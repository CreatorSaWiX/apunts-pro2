import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import type { ReactNode } from 'react';
import { applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import { createStore, useStore } from 'zustand';
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

export interface DrawingStroke {
    id?: string;
    points: { x: number; y: number; pressure?: number }[];
    color?: string;
    size?: number;
    [key: string]: unknown;
}

export interface ExperienceDetails {
    destination?: string;
    program?: string;
    company?: string;
    role?: string;
    title?: string;
    credits?: number;
}

interface SubjectDataItem {
    name: string;
    description: string;
    [key: string]: unknown;
}

const typedSubjectsData = subjectsData as SubjectDataItem[];

// Data context: nodes, edges, derived values. Changes when nodes/edges change.


// Actions context: stable callbacks. Does NOT change on drag/position changes.


// Backwards-compatible combined type





export interface RoadmapState {
    nodes: Node<SubjectNodeData>[];
    edges: Edge[];
    itinerary: ItineraryType;
    isLoading: boolean;
    totalPassedECTS: number;
    canStartMaster: boolean;
    averageGrade: number | null;
    initialStrokes: DrawingStroke[];
    targetGrade: number | null;
    requiredAverageGrade: number | null;
    user: any;
    saveVersion: number;
    lastSavedVersion: number;

    setNodes: (updater: (prev: Node<SubjectNodeData>[]) => Node<SubjectNodeData>[]) => void;
    setEdges: (updater: (prev: Edge[]) => Edge[]) => void;
    setItinerary: (it: ItineraryType) => void;
    setIsLoading: (v: boolean) => void;
    setTargetGrade: (grade: number | null) => void;
    setInitialStrokes: (strokes: DrawingStroke[]) => void;
    setUser: (u: any) => void;

    onNodesChange: (changes: NodeChange[]) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;
    onConnect: (connection: Connection) => void;
    updateNodeStatus: (nodeId: string, status: SubjectStatus) => void;
    updateNodeGrade: (nodeId: string, grade: number | null) => void;
    addSubjectNode: (acronym: string, type: SubjectNodeData['type']) => void;
    addExperienceNode: (type: 'mobility' | 'internship' | 'tfg' | 'tfm', details: ExperienceDetails) => void;
    addCFGSValidations: (cfgsId: string) => void;
    addCustomValidation: (name: string, credits: number) => void;
    addAnnotationNode: (type: 'text' | 'postit', x: number, y: number) => void;
    updateNodeData: (nodeId: string, data: Partial<SubjectNodeData>) => void;
    duplicateAnnotation: (nodeId: string) => void;
    removeNode: (nodeId: string) => void;
    setSpecialization: (specializationId: string) => void;
    saveRoadmap: (strokes?: DrawingStroke[]) => Promise<void>;
}

const computeDerivedState = (nodes: Node<SubjectNodeData>[], targetGrade: number | null) => {
    let totalPassedECTS = 0;
    let totalGradePoints = 0;
    let totalGradedCredits = 0;
    let gradablePassedPoints = 0;
    let gradablePassedECTS = 0;
    let gradableRemainingECTS = 0;

    nodes.forEach(node => {
        const isPassed = node.data.status === 'passed';
        if (isPassed) {
            totalPassedECTS += node.data.credits;
        }

        if (isPassed && typeof node.data.grade === 'number') {
            totalGradePoints += node.data.grade * node.data.credits;
            totalGradedCredits += node.data.credits;
        }

        if (isGradableNode(node)) {
            if (isPassed && typeof node.data.grade === 'number') {
                gradablePassedPoints += node.data.grade * node.data.credits;
                gradablePassedECTS += node.data.credits;
            } else if (!isPassed) {
                gradableRemainingECTS += node.data.credits;
            }
        }
    });

    const averageGrade = totalGradedCredits === 0 ? null : totalGradePoints / totalGradedCredits;
    const canStartMaster = totalPassedECTS >= 213;
    let requiredAverageGrade = null;
    
    if (targetGrade !== null && gradableRemainingECTS > 0) {
        const totalGradableECTS = gradablePassedECTS + gradableRemainingECTS;
        requiredAverageGrade = (targetGrade * totalGradableECTS - gradablePassedPoints) / gradableRemainingECTS;
    }

    return { totalPassedECTS, averageGrade, canStartMaster, requiredAverageGrade };
};

// Extracted checkPrerequisites
const checkPrerequisites = (currentNodes: Node<SubjectNodeData>[], currentEdges: Edge[]) => {
    const incomingMap = new Map<string, string[]>();
    for (const e of currentEdges) {
        const arr = incomingMap.get(e.target);
        if (arr) arr.push(e.source);
        else incomingMap.set(e.target, [e.source]);
    }

    let nodesChanged = true;
    let newNodes = [...currentNodes];
    let safetyCounter = 0;

    while (nodesChanged && safetyCounter < 15) {
        nodesChanged = false;
        safetyCounter++;
        const nodeMap = new Map(newNodes.map(n => [n.id, n]));
        
        const maxPassedSemester = newNodes.reduce((max, n) => {
            const isPassed = n.data.status === 'passed';
            const isRegularSubject = !['optional', 'specialization', 'tfg', 'tfm', 'mobility', 'internship'].includes(n.data.type);
            if (isPassed && isRegularSubject) {
                return Math.max(max, n.data.semester || getSemesterForSubject(n.id));
            }
            return max;
        }, 0);
        const allowedSemester = Math.max(1, maxPassedSemester + 1);
        const passedCredits = newNodes.reduce((sum, n) => n.data.status === 'passed' ? sum + n.data.credits : sum, 0);

        newNodes = newNodes.map(node => {
            const incoming = incomingMap.get(node.id);
            const edgePrereqsPassed = !incoming || incoming.every(sourceId => {
                const sourceNode = nodeMap.get(sourceId);
                return sourceNode?.data.status === 'passed';
            });

            const isSemesterAllowed = (node.data.semester || getSemesterForSubject(node.id)) <= allowedSemester;
            let prereqsMet = edgePrereqsPassed && isSemesterAllowed;

            if (['tfg', 'tfm', 'mobility', 'internship'].includes(node.data.type)) {
                prereqsMet = edgePrereqsPassed && passedCredits >= 160;
            }

            if (!prereqsMet && node.data.status !== 'locked') {
                nodesChanged = true;
                return { ...node, data: { ...node.data, status: 'locked' as SubjectStatus, attempts: 0, grade: null } };
            }

            if (prereqsMet && node.data.status === 'locked') {
                nodesChanged = true;
                return { ...node, data: { ...node.data, status: 'in_progress' as SubjectStatus, attempts: 1 } };
            }
            return node;
        });
    }
    return newNodes;
};

const createRoadmapStore = () => createStore<RoadmapState>((set, get) => ({
    nodes: [],
    edges: [],
    itinerary: 'GEI_STANDARD',
    isLoading: true,
    totalPassedECTS: 0,
    canStartMaster: false,
    averageGrade: null,
    initialStrokes: [],
    targetGrade: null,
    requiredAverageGrade: null,
    user: null,
    saveVersion: 0,
    lastSavedVersion: 0,

    setNodes: (updater) => set(state => {
        const newNodes = updater(state.nodes);
        const derived = computeDerivedState(newNodes, state.targetGrade);
        return { nodes: newNodes, ...derived, saveVersion: state.saveVersion + 1 };
    }),
    setEdges: (updater) => set(state => ({ edges: updater(state.edges), saveVersion: state.saveVersion + 1 })),
    setItinerary: (it) => set(state => ({ itinerary: it, saveVersion: state.saveVersion + 1 })),
    setIsLoading: (v) => set({ isLoading: v }),
    setTargetGrade: (grade) => set(state => {
        const derived = computeDerivedState(state.nodes, grade);
        return { targetGrade: grade, ...derived, saveVersion: state.saveVersion + 1 };
    }),
    setInitialStrokes: (strokes) => set({ initialStrokes: strokes }),
    setUser: (u) => set({ user: u }),

    onNodesChange: (changes) => set(state => {
        const newNodes = applyNodeChanges(changes, state.nodes) as Node<SubjectNodeData>[];
        // Don't recompute derived or saveVersion on mere position changes
        return { nodes: newNodes };
    }),
    onEdgesChange: (changes) => set(state => ({ edges: applyEdgeChanges(changes, state.edges) })),
    onConnect: (connection) => set(state => ({ edges: addEdge(connection, state.edges) })),

    updateNodeStatus: (nodeId, status) => set(state => {
        const mapped = state.nodes.map(node => {
            if (node.id === nodeId) {
                let newAttempts = node.data.attempts || 1;
                if (node.data.status === 'failed' && status === 'retaking') newAttempts += 1;
                if (status === 'locked' || status === 'available') newAttempts = 0;
                if (status === 'in_progress' && newAttempts === 0) newAttempts = 1;
                let newGrade = node.data.grade;
                if (status !== 'passed') newGrade = null;
                return { ...node, data: { ...node.data, status, attempts: newAttempts, grade: newGrade } };
            }
            return node;
        });
        const finalNodes = checkPrerequisites(mapped, state.edges);
        const derived = computeDerivedState(finalNodes, state.targetGrade);
        return { nodes: finalNodes, ...derived, saveVersion: state.saveVersion + 1 };
    }),

    updateNodeGrade: (nodeId, grade) => set(state => {
        const mapped = state.nodes.map(node => {
            if (node.id === nodeId) return { ...node, data: { ...node.data, grade } };
            return node;
        });
        const derived = computeDerivedState(mapped, state.targetGrade);
        return { nodes: mapped, ...derived, saveVersion: state.saveVersion + 1 };
    }),

    addSubjectNode: (acronym, type) => set(state => {
        const subject = (subjectsData as SubjectDataItem[]).find(s => s.name === acronym);
        const semester = getSemesterForSubject(acronym);
        const newNode: Node<SubjectNodeData> = {
            id: acronym, position: { x: 0, y: 0 },
            data: { label: subject?.description || acronym, credits: getCreditsForSubject(acronym), status: 'available', type, attempts: 0, description: subject?.description || acronym, semester, grade: null }
        };
        const { nodes: layouted } = getGridLayoutedElements([...state.nodes, newNode], state.edges);
        const derived = computeDerivedState(layouted as Node<SubjectNodeData>[], state.targetGrade);
        return { nodes: layouted as Node<SubjectNodeData>[], ...derived, saveVersion: state.saveVersion + 1 };
    }),

    addExperienceNode: (type, details) => set(state => {
        const id = `${type}_${Date.now()}`;
        const credits = details.credits || (type === 'tfg' ? 18 : type === 'tfm' ? 30 : 12);
        let label = 'Experiència'; let description = '';
        if (type === 'mobility') { label = `Mobilitat: ${details.destination || 'Internacional'}`; description = `Programa: ${details.program || 'Erasmus+'}`; }
        else if (type === 'internship') { label = `Pràctiques: ${details.company || 'Empresa'}`; description = `Rol: ${details.role || 'Enginyer'}`; }
        else if (type === 'tfg') { label = 'Treball Final de Grau'; description = details.title || 'TFG'; }
        else if (type === 'tfm') { label = 'Treball Final de Màster'; description = details.title || 'TFM'; }
        
        const newNode: Node<SubjectNodeData> = {
            id, position: { x: 0, y: 0 },
            data: { label, credits, status: 'in_progress', type, attempts: 1, description, semester: 8, grade: null, details }
        };
        const { nodes: layouted } = getGridLayoutedElements([...state.nodes, newNode], state.edges);
        const derived = computeDerivedState(layouted as Node<SubjectNodeData>[], state.targetGrade);
        return { nodes: layouted as Node<SubjectNodeData>[], ...derived, saveVersion: state.saveVersion + 1 };
    }),

    addCFGSValidations: (cfgsId) => set(state => {
        const cfgs = CFGS_DEGREES.find(c => c.id === cfgsId);
        if (!cfgs) return state;
        const newNodes: Node<SubjectNodeData>[] = cfgs.modules.map((mod, idx) => ({
            id: `CFGS_${cfgsId}_${idx}_${Date.now()}`, position: { x: 0, y: 0 },
            data: { label: mod.name, credits: mod.credits, status: 'passed', type: 'optional', attempts: 1, description: `Convalidació de CFGS: ${cfgs.title}`, semester: 9, grade: null }
        }));
        const filteredPrev = state.nodes.filter(n => !n.id.startsWith('CFGS_'));
        const combined = [...filteredPrev, ...newNodes];
        const { nodes: layouted } = getGridLayoutedElements(combined, state.edges);
        const derived = computeDerivedState(layouted as Node<SubjectNodeData>[], state.targetGrade);
        return { nodes: layouted as Node<SubjectNodeData>[], ...derived, saveVersion: state.saveVersion + 1 };
    }),

    addCustomValidation: (name, credits) => set(state => {
        const newNode: Node<SubjectNodeData> = {
            id: `VALIDATION_${Date.now()}`, position: { x: 0, y: 0 },
            data: { label: name, credits, status: 'passed', type: 'optional', attempts: 1, description: `Convalidació: ${name}`, semester: 9, grade: null }
        };
        const newNodes = [...state.nodes, newNode];
        const derived = computeDerivedState(newNodes, state.targetGrade);
        return { nodes: newNodes, ...derived, saveVersion: state.saveVersion + 1 };
    }),

    addAnnotationNode: (type, x, y) => set(state => {
        const newNode: Node<SubjectNodeData> = {
            id: `ANNOTATION_${Date.now()}`, position: { x, y }, type: type === 'text' ? 'textNode' : 'postItNode',
            style: { width: type === 'text' ? 300 : 250, height: type === 'text' ? 100 : 250 },
            data: { label: '', credits: 0, status: 'available', type, attempts: 0, description: '', semester: 0, text: type === 'text' ? 'El teu text aquí' : 'Nota', color: type === 'text' ? '#ffffff' : '#fef08a', fontSize: 16, fontWeight: 'normal' }
        };
        return { nodes: [...state.nodes, newNode], saveVersion: state.saveVersion + 1 };
    }),

    updateNodeData: (nodeId, data) => set(state => ({
        nodes: state.nodes.map(n => n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n),
        saveVersion: state.saveVersion + 1
    })),

    duplicateAnnotation: (nodeId) => set(state => {
        const sourceNode = state.nodes.find(n => n.id === nodeId);
        if (!sourceNode) return state;
        const newNode: Node<SubjectNodeData> = {
            ...sourceNode, id: `ANNOTATION_${Date.now()}`, selected: false,
            position: { x: sourceNode.position.x + 40, y: sourceNode.position.y + 40 }
        };
        return { nodes: [...state.nodes, newNode], saveVersion: state.saveVersion + 1 };
    }),

    removeNode: (nodeId) => set(state => {
        const newNodes = state.nodes.filter(n => n.id !== nodeId);
        const newEdges = state.edges.filter(e => e.source !== nodeId && e.target !== nodeId);
        const derived = computeDerivedState(newNodes, state.targetGrade);
        return { nodes: newNodes, edges: newEdges, ...derived, saveVersion: state.saveVersion + 1 };
    }),

    setSpecialization: (specializationId) => set(state => {
        const spec = specializations.find(s => s.id === specializationId);
        if (!spec) return state;
        const newNodes = state.nodes.filter(n => n.data.type !== 'specialization');
        spec.mandatory.forEach(acronym => {
            if (!newNodes.find(n => n.id === acronym)) {
                const subject = (subjectsData as SubjectDataItem[]).find(s => s.name === acronym);
                newNodes.push({
                    id: acronym, position: { x: 0, y: 0 },
                    data: { label: subject?.description || acronym, credits: getCreditsForSubject(acronym), status: 'locked', type: 'specialization', attempts: 0, description: subject?.description || acronym, semester: getSemesterForSubject(acronym), grade: null }
                });
            }
        });
        const finalNodes = checkPrerequisites(newNodes, state.edges);
        const derived = computeDerivedState(finalNodes, state.targetGrade);
        return { nodes: finalNodes, ...derived, saveVersion: state.saveVersion + 1 };
    }),

    saveRoadmap: async (strokes = []) => {
        const state = get();
        if (!state.user) return;
        if (strokes.length === 0 && state.saveVersion === state.lastSavedVersion) return;

        try {
            const cleanNodes = state.nodes.map(n => ({
                id: n.id, position: n.position, style: n.style,
                data: { label: n.data.label, credits: n.data.credits, status: n.data.status, type: n.data.type, attempts: n.data.attempts, description: n.data.description, semester: n.data.semester, grade: n.data.grade, text: n.data.text, color: n.data.color, fontSize: n.data.fontSize, fontWeight: n.data.fontWeight },
                type: n.type || 'subjectNode',
            }));
            const cleanEdges = state.edges.map(e => ({ id: e.id, source: e.source, target: e.target, animated: !!e.animated }));

            const payload = removeUndefined({
                nodes: cleanNodes, edges: cleanEdges, itinerary: state.itinerary, strokes, targetGrade: state.targetGrade
            });

            const { db } = await import('../lib/firebase');
            const { doc, setDoc } = await import('firebase/firestore');
            await setDoc(doc(db, 'users', state.user.id, 'roadmaps', 'main'), { ...payload, updatedAt: new Date().toISOString() });
            
            set({ lastSavedVersion: state.saveVersion });
        } catch (err) {
            console.error("Error saving roadmap:", err);
            throw err;
        }
    }
}));

type RoadmapStore = ReturnType<typeof createRoadmapStore>;
const RoadmapContext = createContext<RoadmapStore | null>(null);

// Lightweight context so SubjectNode can read requiredAverageGrade without
// subscribing to the full RoadmapContext (which changes on every drag/zoom).
const TargetGradeContext = createContext<number | null>(null);
export const TargetGradeProvider = TargetGradeContext.Provider;
export const useTargetGrade = () => useContext(TargetGradeContext);

const removeUndefined = <T,>(obj: T): T => {
    if (Array.isArray(obj)) return obj.map(removeUndefined) as unknown as T;
    if (obj !== null && typeof obj === 'object') {
        return Object.fromEntries(
            Object.entries(obj)
                .filter(([_, v]) => v !== undefined)
                .map(([k, v]) => [k, removeUndefined(v)])
        ) as T;
    }
    return obj;
};

/** Returns true if a node contributes to the weighted GPA (nota mitjana ponderada). */
const isGradableNode = (node: Node<SubjectNodeData>): boolean => {
    if (node.id.startsWith('CFGS_') || node.id.startsWith('VALIDATION_')) return false;
    if (node.data.type === 'text' || node.data.type === 'postit') return false;
    return true;
};

const createInitialGraph = () => {
    const nodes: Node<SubjectNodeData>[] = geiBaseNodes.map(acronym => {
        const subject = typedSubjectsData.find((s) => s.name === acronym);
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
    const storeRef = useRef<RoadmapStore>(null);
    if (!storeRef.current) {
        storeRef.current = createRoadmapStore();
    }

    const store = storeRef.current;

    useEffect(() => {
        store.getState().setUser(user);
    }, [user, store]);

    useEffect(() => {
        let isMounted = true;
        const loadRoadmap = async () => {
            if (!user) {
                if (isMounted) store.getState().setIsLoading(false);
                return;
            }
            try {
                store.getState().setIsLoading(true);
                const { db } = await import('../lib/firebase');
                const { doc, getDoc } = await import('firebase/firestore');
                const docRef = doc(db, 'users', user.id, 'roadmaps', 'main');
                const snap = await getDoc(docRef);
                if (snap.exists() && isMounted) {
                    const data = snap.data();
                    if (data.nodes && data.edges) {
                        const migratedNodes = (data.nodes as any[]).map((n) => ({
                            ...n,
                            data: {
                                ...n.data,
                                semester: n.data.semester || getSemesterForSubject(n.id),
                                grade: n.data.grade !== undefined ? n.data.grade : null
                            }
                        }));
                        if (!migratedNodes.some((n) => n.data.type === 'tfg')) {
                            migratedNodes.push({
                                id: `tfg_default`, position: { x: 0, y: 0 },
                                data: { label: 'Treball Final de Grau', credits: 18, status: 'locked', type: 'tfg', attempts: 0, description: 'TFG', semester: 8, grade: null }
                            });
                        }
                        store.getState().setNodes(() => migratedNodes);
                        store.getState().setEdges(() => data.edges);
                        if (data.itinerary) store.getState().setItinerary(data.itinerary);
                        if (data.strokes) store.getState().setInitialStrokes(data.strokes);
                        if (typeof data.targetGrade === 'number') store.getState().setTargetGrade(data.targetGrade);
                    }
                } else if (isMounted) {
                    const { nodes: layoutedNodes, edges: layoutedEdges } = createInitialGraph();
                    store.getState().setNodes(() => layoutedNodes as Node<SubjectNodeData>[]);
                    store.getState().setEdges(() => layoutedEdges);
                    store.getState().setInitialStrokes([]);
                }
            } catch (err) {
                console.error("Failed to load roadmap:", err);
            } finally {
                if (isMounted) store.getState().setIsLoading(false);
            }
        };
        loadRoadmap();
        return () => { isMounted = false; };
    }, [user, store]);

    return (
        <RoadmapContext.Provider value={store}>
            {children}
        </RoadmapContext.Provider>
    );
};

export function useRoadmap<T>(selector: (state: RoadmapState) => T): T {
    const store = useContext(RoadmapContext);
    if (!store) throw new Error('useRoadmap must be used within a RoadmapProvider');
    return useStore(store, selector);
}

// Deprecated alias aliases
export const useRoadmapActions = () => useRoadmap(state => state);
export const useRoadmapData = () => useRoadmap(state => state);
