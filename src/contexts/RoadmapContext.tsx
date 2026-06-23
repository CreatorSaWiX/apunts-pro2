import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import type { Node, Edge, NodeChange, EdgeChange, Connection } from '@xyflow/react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import subjectsData from '../data/subjects.json';
import { geiBaseNodes, geiBaseEdges, getCreditsForSubject, getSemesterForSubject, specializations } from '../data/curriculum';
import { getGridLayoutedElements } from '../lib/gridLayout';

export type SubjectStatus = 'locked' | 'available' | 'in_progress' | 'passed' | 'failed' | 'retaking';
export type ItineraryType = 'GEI_STANDARD' | 'GEI_PARS';

export interface SubjectNodeData extends Record<string, unknown> {
    label: string;
    credits: number;
    status: SubjectStatus;
    type: 'obligatory' | 'specialization' | 'optional' | 'basic' | 'master';
    attempts: number;
    description: string;
    semester: number;
}

interface RoadmapContextType {
    nodes: Node<SubjectNodeData>[];
    edges: Edge[];
    itinerary: ItineraryType;
    setItinerary: (it: ItineraryType) => void;
    onNodesChange: (changes: NodeChange[]) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;
    onConnect: (connection: Connection) => void;
    updateNodeStatus: (nodeId: string, status: SubjectStatus) => void;
    saveRoadmap: () => Promise<void>;
    addSubjectNode: (acronym: string, type: SubjectNodeData['type']) => void;
    setSpecialization: (specializationId: string) => void;
    isLoading: boolean;
    totalPassedECTS: number;
    canStartMaster: boolean;
}

const RoadmapContext = createContext<RoadmapContextType | undefined>(undefined);

const createInitialGraph = () => {
    const nodes: Node<SubjectNodeData>[] = geiBaseNodes.map(acronym => {
        const subject = subjectsData.find((s: any) => s.name === acronym);
        const semester = getSemesterForSubject(acronym);
        const isQ1 = semester === 1;
        return {
            id: acronym,
            position: { x: 0, y: 0 },
            data: {
                label: subject?.description || acronym,
                credits: getCreditsForSubject(acronym),
                status: isQ1 ? 'in_progress' : 'locked', // Q1 starts in_progress
                type: 'basic',
                attempts: isQ1 ? 1 : 0,
                description: subject?.description || acronym,
                semester
            }
        };
    });

    const edges: Edge[] = geiBaseEdges.map((e, idx) => ({
        id: `e-${e.source}-${e.target}-${idx}`,
        source: e.source,
        target: e.target,
        animated: false
    }));

    return getGridLayoutedElements(nodes, edges);
};

export const RoadmapProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [nodes, setNodes] = useState<Node<SubjectNodeData>[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [itinerary, setItinerary] = useState<ItineraryType>('GEI_STANDARD');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const loadRoadmap = async () => {
            if (!user) {
                if (isMounted) setIsLoading(false);
                return;
            }
            try {
                const docRef = doc(db, 'users', user.id, 'roadmaps', 'main');
                const snap = await getDoc(docRef);
                if (snap.exists() && isMounted) {
                    const data = snap.data();
                    if (data.nodes && data.edges) {
                        // Migrate old nodes that don't have a semester
                        const migratedNodes = data.nodes.map((n: any) => ({
                            ...n,
                            data: {
                                ...n.data,
                                semester: n.data.semester || getSemesterForSubject(n.id)
                            }
                        }));
                        const { nodes: layoutedNodes } = getGridLayoutedElements(migratedNodes, data.edges);
                        setNodes(layoutedNodes as Node<SubjectNodeData>[]);
                        setEdges(data.edges);
                        if (data.itinerary) setItinerary(data.itinerary);
                    }
                } else if (isMounted) {
                    // Initialize default GEI tree
                    const { nodes: layoutedNodes, edges: layoutedEdges } = createInitialGraph();
                    setNodes(layoutedNodes as Node<SubjectNodeData>[]);
                    setEdges(layoutedEdges);
                }
            } catch (err) {
                console.error("Failed to load roadmap:", err);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };
        loadRoadmap();
        return () => { isMounted = false; };
    }, [user]);

    // Derived Logic for ECTS
    const totalPassedECTS = useMemo(() => {
        return nodes.reduce((acc, node) => {
            if (node.data.status === 'passed') return acc + node.data.credits;
            return acc;
        }, 0);
    }, [nodes]);

    // PARS Rule: Can start master if remaining credits < 27 (excluding TFG 18)
    // Degree total is 240. ECTS remaining = 240 - passed. If remaining <= 27 + 18?
    // Wait, the rule is "missing max 27 ECTS including TFG? No, missing max 9 ECTS + TFG = 27".
    // This means they must have passed >= 240 - 27 = 213 ECTS.
    const canStartMaster = useMemo(() => {
        return totalPassedECTS >= 213;
    }, [totalPassedECTS]);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds) as Node<SubjectNodeData>[]),
        []
    );

    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );



    const checkPrerequisites = useCallback((currentNodes: Node<SubjectNodeData>[], currentEdges: Edge[]) => {
        // Find the maximum semester where the user has passed at least one subject
        const maxPassedSemester = currentNodes.reduce((max, n) => n.data.status === 'passed' ? Math.max(max, n.data.semester || getSemesterForSubject(n.id)) : max, 0);
        const allowedSemester = Math.max(1, maxPassedSemester + 1);

        return currentNodes.map(node => {
            if (node.data.status === 'passed' || node.data.status === 'in_progress' || node.data.status === 'failed' || node.data.status === 'retaking') {
                return node; // Already interacted with
            }
            
            // Find dependencies
            const incomingEdges = currentEdges.filter(e => e.target === node.id);
            const edgePrereqsPassed = incomingEdges.length === 0 || incomingEdges.every(e => {
                const sourceNode = currentNodes.find(n => n.id === e.source);
                return sourceNode?.data.status === 'passed';
            });

            // Semester gating: You can only unlock subjects up to allowedSemester
            const isSemesterAllowed = (node.data.semester || getSemesterForSubject(node.id)) <= allowedSemester;

            if (edgePrereqsPassed && isSemesterAllowed) {
                // Auto-progress to 'in_progress' as requested by the user
                return { ...node, data: { ...node.data, status: 'in_progress' as SubjectStatus, attempts: 1 } };
            }

            return { ...node, data: { ...node.data, status: 'locked' as SubjectStatus } };
        });
    }, []);

    const updateNodeStatus = useCallback((nodeId: string, status: SubjectStatus) => {
        setNodes((nds) => {
            const mapped = nds.map((node) => {
                if (node.id === nodeId) {
                    let newAttempts = node.data.attempts || 1;
                    if (node.data.status === 'failed' && status === 'retaking') {
                        newAttempts += 1;
                    }
                    if (status === 'locked' || status === 'available') {
                        newAttempts = 0;
                    }
                    if (status === 'in_progress' && newAttempts === 0) {
                        newAttempts = 1;
                    }
                    return { ...node, data: { ...node.data, status, attempts: newAttempts } };
                }
                return node;
            });
            // Re-check prerequisites after status change
            return checkPrerequisites(mapped, edges);
        });
    }, [edges, checkPrerequisites]);

    const addSubjectNode = useCallback((acronym: string, type: SubjectNodeData['type']) => {
        const subject = subjectsData.find((s: any) => s.name === acronym);
        const semester = getSemesterForSubject(acronym);
        const newNode: Node<SubjectNodeData> = {
            id: acronym,
            position: { x: 0, y: 0 },
            data: {
                label: subject?.description || acronym,
                credits: getCreditsForSubject(acronym),
                status: 'available',
                type,
                attempts: 0,
                description: subject?.description || acronym,
                semester
            }
        };

        setNodes(prev => {
            const newNodes = [...prev, newNode];
            const { nodes: layouted } = getGridLayoutedElements(newNodes, edges);
            return layouted as Node<SubjectNodeData>[];
        });
    }, [edges]);

    const setSpecialization = useCallback((specializationId: string) => {
        const spec = specializations.find(s => s.id === specializationId);
        if (!spec) return;

        setNodes(prev => {
            // Remove existing specialization nodes
            let newNodes = prev.filter(n => n.data.type !== 'specialization');
            
            // Add new nodes
            spec.mandatory.forEach(acronym => {
                // Check if already exists to avoid duplicates
                if (!newNodes.find(n => n.id === acronym)) {
                    const subject = subjectsData.find((s: any) => s.name === acronym);
                    const semester = getSemesterForSubject(acronym);
                    newNodes.push({
                        id: acronym,
                        position: { x: 0, y: 0 },
                        data: {
                            label: subject?.description || acronym,
                            credits: getCreditsForSubject(acronym),
                            status: 'locked', // Will be recalculated by checkPrerequisites
                            type: 'specialization',
                            attempts: 0,
                            description: subject?.description || acronym,
                            semester
                        }
                    });
                }
            });

            // Re-apply layout
            const { nodes: layouted } = getGridLayoutedElements(newNodes, edges);
            return checkPrerequisites(layouted as Node<SubjectNodeData>[], edges);
        });
    }, [edges, checkPrerequisites]);

    // Recalculate layout when edges change (only on connection)
    const onConnect = useCallback(
        (params: Connection) => {
            setEdges((eds) => {
                const newEdges = addEdge(params, eds);
                setNodes(nds => {
                    const { nodes: layouted } = getGridLayoutedElements(nds, newEdges);
                    return layouted as Node<SubjectNodeData>[];
                });
                return newEdges;
            });
        },
        []
    );

    const saveRoadmap = useCallback(async () => {
        if (!user) return;
        try {
            // Clean nodes and edges to avoid Firebase errors from undefined or non-serializable fields added by ReactFlow
            const cleanNodes = nodes.map(n => ({
                id: n.id,
                position: n.position,
                data: {
                    label: n.data.label,
                    credits: n.data.credits,
                    status: n.data.status,
                    type: n.data.type,
                    attempts: n.data.attempts,
                    description: n.data.description,
                    semester: n.data.semester
                },
                type: n.type || 'subjectNode',
            }));
            const cleanEdges = edges.map(e => ({
                id: e.id,
                source: e.source,
                target: e.target,
                animated: !!e.animated
            }));

            const docRef = doc(db, 'users', user.id, 'roadmaps', 'main');
            await setDoc(docRef, JSON.parse(JSON.stringify({
                nodes: cleanNodes,
                edges: cleanEdges,
                itinerary,
                updatedAt: new Date().toISOString()
            })));
        } catch (err) {
            console.error("Error saving roadmap:", err);
            throw err;
        }
    }, [nodes, edges, itinerary, user]);

    return (
        <RoadmapContext.Provider value={{ 
            nodes, edges, itinerary, setItinerary, 
            onNodesChange, onEdgesChange, onConnect, 
            updateNodeStatus, saveRoadmap, addSubjectNode, 
            setSpecialization,
            isLoading, totalPassedECTS, canStartMaster 
        }}>
            {children}
        </RoadmapContext.Provider>
    );
};

export const useRoadmap = () => {
    const context = useContext(RoadmapContext);
    if (context === undefined) {
        throw new Error('useRoadmap must be used within a RoadmapProvider');
    }
    return context;
};
