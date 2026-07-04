import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import type { Node, Edge, NodeChange, EdgeChange, Connection } from '@xyflow/react';
import { useAuth } from './AuthContext';
import subjectsData from '../data/subjects.json';
import { geiBaseNodes, geiBaseEdges, getCreditsForSubject, getSemesterForSubject, specializations } from '../data/curriculum';
import { CFGS_DEGREES } from '../data/cfgs';
import { getGridLayoutedElements } from '../lib/gridLayout';

export type SubjectStatus = 'locked' | 'available' | 'in_progress' | 'passed' | 'failed' | 'retaking';
export type ItineraryType = 'GEI_STANDARD' | 'GEI_PARS';

export interface SubjectNodeData extends Record<string, unknown> {
    label: string;
    credits: number;
    status: SubjectStatus;
    type: 'obligatory' | 'specialization' | 'optional' | 'basic' | 'master' | 'mobility' | 'internship' | 'tfg' | 'tfm' | 'text' | 'postit';
    attempts: number;
    description: string;
    semester: number;
    grade?: number | null;
    details?: {
        destination?: string;
        program?: string;
        company?: string;
        role?: string;
        title?: string;
    };
    // Annotation fields
    text?: string;
    color?: string;
    fontSize?: number;
    fontWeight?: string;
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
    updateNodeGrade: (nodeId: string, grade: number | null) => void;
    saveRoadmap: (strokes?: any[]) => Promise<void>;
    addSubjectNode: (acronym: string, type: SubjectNodeData['type']) => void;
    addExperienceNode: (type: 'mobility' | 'internship' | 'tfg' | 'tfm', details: any) => void;
    addCFGSValidations: (cfgsId: string) => void;
    addCustomValidation: (name: string, credits: number) => void;
    addAnnotationNode: (type: 'text' | 'postit', x: number, y: number) => void;
    updateNodeData: (nodeId: string, data: Partial<SubjectNodeData>) => void;
    duplicateAnnotation: (nodeId: string) => void;
    removeNode: (nodeId: string) => void;
    setSpecialization: (specializationId: string) => void;
    isLoading: boolean;
    totalPassedECTS: number;
    canStartMaster: boolean;
    averageGrade: number | null;
    initialStrokes: any[];
}

const RoadmapContext = createContext<RoadmapContextType | undefined>(undefined);

const removeUndefined = (obj: any): any => {
    if (Array.isArray(obj)) return obj.map(removeUndefined);
    if (obj !== null && typeof obj === 'object') {
        return Object.fromEntries(
            Object.entries(obj)
                .filter(([_, v]) => v !== undefined)
                .map(([k, v]) => [k, removeUndefined(v)])
        );
    }
    return obj;
};

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
                semester,
                grade: null
            }
        };
    });

    const edges: Edge[] = geiBaseEdges.map((e, idx) => ({
        id: `e-${e.source}-${e.target}-${idx}`,
        source: e.source,
        target: e.target,
        animated: false
    }));

    // Add TFG by default
    const tfgNode: Node<SubjectNodeData> = {
        id: `tfg_default`,
        position: { x: 0, y: 0 },
        data: {
            label: 'Treball Final de Grau',
            credits: 18,
            status: 'locked',
            type: 'tfg',
            attempts: 0,
            description: 'TFG',
            semester: 8,
            grade: null
        }
    };
    nodes.push(tfgNode);

    return getGridLayoutedElements(nodes, edges);
};

export const RoadmapProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [nodes, setNodes] = useState<Node<SubjectNodeData>[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [initialStrokes, setInitialStrokes] = useState<any[]>([]);
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
                const { db } = await import('../lib/firebase');
                const { doc, getDoc } = await import('firebase/firestore');
                const docRef = doc(db, 'users', user.id, 'roadmaps', 'main');
                const snap = await getDoc(docRef);
                if (snap.exists() && isMounted) {
                    const data = snap.data();
                    if (data.nodes && data.edges) {
                        // Migrate old nodes that don't have a semester or grade
                        let migratedNodes = data.nodes.map((n: any) => ({
                            ...n,
                            data: {
                                ...n.data,
                                semester: n.data.semester || getSemesterForSubject(n.id),
                                grade: n.data.grade !== undefined ? n.data.grade : null
                            }
                        }));

                        // Ensure TFG exists for older roadmaps
                        if (!migratedNodes.some((n: any) => n.data.type === 'tfg')) {
                            migratedNodes.push({
                                id: `tfg_default`,
                                position: { x: 0, y: 0 },
                                data: {
                                    label: 'Treball Final de Grau',
                                    credits: 18,
                                    status: 'locked',
                                    type: 'tfg',
                                    attempts: 0,
                                    description: 'TFG',
                                    semester: 8,
                                    grade: null
                                }
                            });
                        }

                        setNodes(migratedNodes as Node<SubjectNodeData>[]);
                        setEdges(data.edges);
                        if (data.itinerary) setItinerary(data.itinerary);
                        if (data.strokes) setInitialStrokes(data.strokes);
                    }
                } else if (isMounted) {
                    // Initialize default GEI tree
                    const { nodes: layoutedNodes, edges: layoutedEdges } = createInitialGraph();
                    setNodes(layoutedNodes as Node<SubjectNodeData>[]);
                    setEdges(layoutedEdges);
                    setInitialStrokes([]);
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

    // Derived Logic for Average Grade (Nota Mitjana Ponderada)
    const averageGrade = useMemo(() => {
        let totalGradePoints = 0;
        let totalGradedCredits = 0;
        nodes.forEach((node) => {
            if (node.data.status === 'passed' && typeof node.data.grade === 'number') {
                totalGradePoints += node.data.grade * node.data.credits;
                totalGradedCredits += node.data.credits;
            }
        });
        if (totalGradedCredits === 0) return null;
        return totalGradePoints / totalGradedCredits;
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
        let nodesChanged = true;
        let newNodes = [...currentNodes];

        // Evaluate repeatedly until the graph stabilizes (to handle cascading locks/unlocks)
        let safetyCounter = 0;
        while (nodesChanged && safetyCounter < 15) {
            nodesChanged = false;
            safetyCounter++;

            const maxPassedSemester = newNodes.reduce((max, n) => n.data.status === 'passed' ? Math.max(max, n.data.semester || getSemesterForSubject(n.id)) : max, 0);
            const allowedSemester = Math.max(1, maxPassedSemester + 1);
            const passedCredits = newNodes.reduce((sum, n) => n.data.status === 'passed' ? sum + n.data.credits : sum, 0);

            newNodes = newNodes.map(node => {
                const incomingEdges = currentEdges.filter(e => e.target === node.id);
                const edgePrereqsPassed = incomingEdges.length === 0 || incomingEdges.every(e => {
                    const sourceNode = newNodes.find(n => n.id === e.source);
                    return sourceNode?.data.status === 'passed';
                });

                const isSemesterAllowed = (node.data.semester || getSemesterForSubject(node.id)) <= allowedSemester;
                let prereqsMet = edgePrereqsPassed && isSemesterAllowed;

                // Els blocs finals (TFG, Mobilitat, Pràctiques) no depenen d'un semestre seqüencial estricte,
                // sinó d'haver superat una quantitat suficient de crèdits (aprox. 3 anys = 180 ECTS).
                // Rebaixem a 160 per donar flexibilitat.
                if (['tfg', 'tfm', 'mobility', 'internship'].includes(node.data.type)) {
                    prereqsMet = edgePrereqsPassed && passedCredits >= 160;
                }

                // If prerequisites are NOT met, force node to locked
                if (!prereqsMet && node.data.status !== 'locked') {
                    nodesChanged = true;
                    return { ...node, data: { ...node.data, status: 'locked' as SubjectStatus, attempts: 0, grade: null } };
                }

                // If prerequisites ARE met but node is locked, unlock it to 'in_progress'
                if (prereqsMet && node.data.status === 'locked') {
                    nodesChanged = true;
                    return { ...node, data: { ...node.data, status: 'in_progress' as SubjectStatus, attempts: 1 } };
                }

                return node;
            });
        }

        return newNodes;
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

                    // Clear grade if status is not passed anymore
                    let newGrade = node.data.grade;
                    if (status !== 'passed') {
                        newGrade = null;
                    }

                    return { ...node, data: { ...node.data, status, attempts: newAttempts, grade: newGrade } };
                }
                return node;
            });
            // Re-check prerequisites after status change
            return checkPrerequisites(mapped, edges);
        });
    }, [edges, checkPrerequisites]);

    const updateNodeGrade = useCallback((nodeId: string, grade: number | null) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === nodeId) {
                    return { ...node, data: { ...node.data, grade } };
                }
                return node;
            })
        );
    }, []);

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
                semester,
                grade: null
            }
        };

        setNodes(prev => {
            const newNodes = [...prev, newNode];
            const { nodes: layouted } = getGridLayoutedElements(newNodes, edges);
            return layouted as Node<SubjectNodeData>[];
        });
    }, [edges]);

    const addExperienceNode = useCallback((type: 'mobility' | 'internship' | 'tfg' | 'tfm', details: any) => {
        const id = `${type}_${Date.now()}`;
        const credits = details.credits || (type === 'tfg' ? 18 : type === 'tfm' ? 30 : 12);

        let label = 'Experiència';
        let description = '';
        if (type === 'mobility') {
            label = `Mobilitat: ${details.destination || 'Internacional'}`;
            description = `Programa: ${details.program || 'Erasmus+'}`;
        } else if (type === 'internship') {
            label = `Pràctiques: ${details.company || 'Empresa'}`;
            description = `Rol: ${details.role || 'Enginyer'}`;
        } else if (type === 'tfg') {
            label = 'Treball Final de Grau';
            description = details.title || 'TFG';
        } else if (type === 'tfm') {
            label = 'Treball Final de Màster';
            description = details.title || 'TFM';
        }

        const newNode: Node<SubjectNodeData> = {
            id,
            position: { x: 0, y: 0 },
            data: {
                label,
                credits,
                status: 'in_progress', // Start in progress visually
                type,
                attempts: 1,
                description,
                semester: 8, // Usually later in the degree
                grade: null,
                details
            }
        };

        setNodes(prev => {
            const newNodes = [...prev, newNode];
            const { nodes: layouted } = getGridLayoutedElements(newNodes, edges);
            return layouted as Node<SubjectNodeData>[];
        });
    }, [edges]);

    const addCFGSValidations = useCallback((cfgsId: string) => {
        const cfgs = CFGS_DEGREES.find(c => c.id === cfgsId);
        if (!cfgs) return;

        const newNodes: Node<SubjectNodeData>[] = cfgs.modules.map((mod, idx) => ({
            id: `CFGS_${cfgsId}_${idx}_${Date.now()}`,
            position: { x: 0, y: 0 },
            data: {
                label: mod.name,
                credits: mod.credits,
                status: 'passed',
                type: 'optional',
                attempts: 1,
                description: `Convalidació de CFGS: ${cfgs.title}`,
                semester: 9, // Place at the bottom of the graph
                grade: null
            }
        }));

        setNodes(prev => {
            // Remove any existing CFGS validation nodes so they don't accumulate
            const filteredPrev = prev.filter(n => !n.id.startsWith('CFGS_'));
            const combined = [...filteredPrev, ...newNodes];
            const { nodes: layouted } = getGridLayoutedElements(combined, edges);
            return layouted as Node<SubjectNodeData>[];
        });
    }, [edges]);

    const addCustomValidation = useCallback((name: string, credits: number) => {
        const newNode: Node<SubjectNodeData> = {
            id: `VALIDATION_${Date.now()}`,
            position: { x: 0, y: 0 },
            data: {
                label: name,
                credits,
                status: 'passed',
                type: 'optional',
                attempts: 1,
                description: `Convalidació: ${name}`,
                semester: 9, // Place at the bottom
                grade: null
            }
        };

        setNodes(prev => {
            const newNodes = [...prev, newNode];
            return newNodes as Node<SubjectNodeData>[];
        });
    }, [edges]);

    const addAnnotationNode = useCallback((type: 'text' | 'postit', x: number, y: number) => {
        const newNode: Node<SubjectNodeData> = {
            id: `ANNOTATION_${Date.now()}`,
            position: { x, y },
            type: type === 'text' ? 'textNode' : 'postItNode',
            style: { width: type === 'text' ? 300 : 250, height: type === 'text' ? 100 : 250 },
            data: {
                label: '',
                credits: 0,
                status: 'available',
                type,
                attempts: 0,
                description: '',
                semester: 0,
                text: type === 'text' ? 'El teu text aquí' : 'Nota',
                color: type === 'text' ? '#ffffff' : '#fef08a',
                fontSize: 16,
                fontWeight: 'normal'
            }
        };

        setNodes(prev => [...prev, newNode]);
    }, []);

    const updateNodeData = useCallback((nodeId: string, data: Partial<SubjectNodeData>) => {
        setNodes(prev => prev.map(n => {
            if (n.id === nodeId) {
                return { ...n, data: { ...n.data, ...data } };
            }
            return n;
        }));
    }, []);

    const duplicateAnnotation = useCallback((nodeId: string) => {
        setNodes(prev => {
            const sourceNode = prev.find(n => n.id === nodeId);
            if (!sourceNode) return prev;

            const newNode: Node<SubjectNodeData> = {
                ...sourceNode,
                id: `ANNOTATION_${Date.now()}`,
                selected: false, // Deselect the clone initially
                style: sourceNode.style,
                position: {
                    x: sourceNode.position.x + 40,
                    y: sourceNode.position.y + 40
                }
            };
            return [...prev, newNode];
        });
    }, []);

    const removeNode = useCallback((nodeId: string) => {
        setNodes(prev => {
            const newNodes = prev.filter(n => n.id !== nodeId);
            return newNodes as Node<SubjectNodeData>[];
        });
        setEdges(prev => prev.filter(e => e.source !== nodeId && e.target !== nodeId));
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
                            semester,
                            grade: null
                        }
                    });
                }
            });

            // Apply prerequisites
            return checkPrerequisites(newNodes as Node<SubjectNodeData>[], edges);
        });
    }, [edges, checkPrerequisites]);

    // Recalculate layout when edges change (only on connection)
    const onConnect = useCallback(
        (params: Connection) => {
            setEdges((eds) => {
                const newEdges = addEdge(params, eds);
                setNodes(nds => {
                    return checkPrerequisites(nds, newEdges) as Node<SubjectNodeData>[];
                });
                return newEdges;
            });
        },
        []
    );

    const saveRoadmap = useCallback(async (strokes: any[] = []) => {
        if (!user) return;
        try {
            // Clean nodes and edges to avoid Firebase errors from undefined or non-serializable fields added by ReactFlow
            const cleanNodes = nodes.map(n => ({
                id: n.id,
                position: n.position,
                style: n.style,
                data: {
                    label: n.data.label,
                    credits: n.data.credits,
                    status: n.data.status,
                    type: n.data.type,
                    attempts: n.data.attempts,
                    description: n.data.description,
                    semester: n.data.semester,
                    grade: n.data.grade,
                    text: n.data.text,
                    color: n.data.color,
                    fontSize: n.data.fontSize,
                    fontWeight: n.data.fontWeight
                },
                type: n.type || 'subjectNode',
            }));
            const cleanEdges = edges.map(e => ({
                id: e.id,
                source: e.source,
                target: e.target,
                animated: !!e.animated
            }));

            const { db } = await import('../lib/firebase');
            const { doc, setDoc } = await import('firebase/firestore');
            const docRef = doc(db, 'users', user.id, 'roadmaps', 'main');
            await setDoc(docRef, removeUndefined({
                nodes: cleanNodes,
                edges: cleanEdges,
                itinerary,
                strokes,
                updatedAt: new Date().toISOString()
            }));
        } catch (err) {
            console.error("Error saving roadmap:", err);
            throw err;
        }
    }, [nodes, edges, itinerary, user]);

    return (
        <RoadmapContext.Provider value={{
            nodes, edges, itinerary, setItinerary,
            onNodesChange, onEdgesChange, onConnect,
            updateNodeStatus, updateNodeGrade, saveRoadmap, addSubjectNode, addExperienceNode, addCFGSValidations, addCustomValidation, addAnnotationNode, updateNodeData, duplicateAnnotation, removeNode,
            setSpecialization,
            isLoading, totalPassedECTS, canStartMaster, averageGrade, initialStrokes
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
