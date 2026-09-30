import React, { createContext, useContext, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import { createStore, useStore } from 'zustand';
import type { Node, Edge } from '@xyflow/react';
import { useAuth } from '../AuthContext';
import { getCreditsForSubject, getSemesterForSubject, specializations } from '../../data/curriculum';
import { CFGS_DEGREES } from '../../data/cfgs';
import { getGridLayoutedElements } from '../../lib/gridLayout';

// Re-export types from the dedicated types module
export type { SubjectStatus, ItineraryType, SubjectNodeData, DrawingStroke, ExperienceDetails, RoadmapState } from './types';
export type { User } from '../AuthContext';
import type { SubjectNodeData, SubjectStatus, DrawingStroke, RoadmapState } from './types';

// Re-export pure logic for external consumers (e.g. tests, AI endpoints)
export { wouldCreateCycle } from './roadmapLogic';

import {
    computeDerivedState,
    checkPrerequisites,
    wouldCreateCycle,
    removeUndefined,
    createInitialGraph,
    isGradableNode,
    subjectsMap,
} from './roadmapLogic';

// Silence unused import warnings — isGradableNode is used transitively by computeDerivedState
void isGradableNode;

const createRoadmapStore = () => createStore<RoadmapState>((set, get) => ({
    nodes: [],
    edges: [],
    itinerary: 'GEI_STANDARD',
    isLoading: true,
    totalPassedECTS: 0,
    totalPlannedECTS: 0,
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
    onEdgesChange: (changes) => set(state => {
        const newEdges = applyEdgeChanges(changes, state.edges);
        const hasEdgeRemoval = changes.some(c => c.type === 'remove');
        if (hasEdgeRemoval) {
            const finalNodes = checkPrerequisites(state.nodes, newEdges);
            const derived = computeDerivedState(finalNodes, state.targetGrade);
            return { edges: newEdges, nodes: finalNodes, ...derived, saveVersion: state.saveVersion + 1 };
        }
        return { edges: newEdges };
    }),
    onConnect: (connection) => set(state => {
        if (!connection.source || !connection.target) return state;
        // Blindatge matemàtic: Evitar cicles en el DAG acadèmic
        if (wouldCreateCycle(connection.source, connection.target, state.edges)) {
            console.warn(`[Roadmap] Connexió descartada: crearia un cicle entre ${connection.source} i ${connection.target}`);
            return state;
        }
        const newEdges = addEdge(connection, state.edges);
        const finalNodes = checkPrerequisites(state.nodes, newEdges);
        const derived = computeDerivedState(finalNodes, state.targetGrade);
        return { edges: newEdges, nodes: finalNodes, ...derived, saveVersion: state.saveVersion + 1 };
    }),

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
        const subject = subjectsMap.get(acronym);
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
                const subject = subjectsMap.get(acronym);
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

            const { db } = await import('../../lib/firebase');
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
                const { db } = await import('../../lib/firebase');
                const { doc, getDoc } = await import('firebase/firestore');
                const docRef = doc(db, 'users', user.id, 'roadmaps', 'main');
                const snap = await getDoc(docRef);
                if (snap.exists() && isMounted) {
                    const data = snap.data();
                    if (data.nodes && data.edges) {
                        const migratedNodes = (data.nodes as Node<SubjectNodeData>[]).map((n) => ({
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
