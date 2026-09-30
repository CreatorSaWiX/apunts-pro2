import type { Node, Edge } from '@xyflow/react';
import type { SubjectNodeData, SubjectStatus } from './types';
import { getSemesterForSubject, getCreditsForSubject, geiBaseNodes, geiBaseEdges } from '../../data/curriculum';
import { getGridLayoutedElements } from '../../lib/gridLayout';
import subjectsData from '../../data/subjects.json';

// ── Subject Data Lookup ──────────────────────────────────────────────────────

interface SubjectDataItem {
    name: string;
    description: string;
    [key: string]: unknown;
}

const typedSubjectsData = subjectsData as SubjectDataItem[];
export const subjectsMap = new Map<string, SubjectDataItem>(typedSubjectsData.map(s => [s.name, s]));

// ── Pure Derived-State Computation ───────────────────────────────────────────

/** Returns true if a node contributes to the weighted GPA (nota mitjana ponderada). */
export const isGradableNode = (node: Node<SubjectNodeData>): boolean => {
    if (node.id.startsWith('CFGS_') || node.id.startsWith('VALIDATION_')) return false;
    if (node.data.type === 'text' || node.data.type === 'postit') return false;
    return true;
};

export const computeDerivedState = (nodes: Node<SubjectNodeData>[], targetGrade: number | null) => {
    let totalPassedECTS = 0;
    let totalPlannedECTS = 0;
    let totalGradePoints = 0;
    let totalGradedCredits = 0;
    let gradablePassedPoints = 0;
    let gradablePassedECTS = 0;
    let gradableRemainingECTS = 0;

    nodes.forEach(node => {
        totalPlannedECTS += (node.data.credits || 0);
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

    return { totalPassedECTS, totalPlannedECTS, averageGrade, canStartMaster, requiredAverageGrade };
};

// ── DAG Prerequisite Propagation ─────────────────────────────────────────────

// checkPrerequisites: Fixed-point DAG propagation for prerequisite cascading
const SPECIAL_TYPES = new Set(['optional', 'specialization', 'tfg', 'tfm', 'mobility', 'internship']);
const EXPERIENCE_TYPES = new Set(['tfg', 'tfm', 'mobility', 'internship']);

export const checkPrerequisites = (currentNodes: Node<SubjectNodeData>[], currentEdges: Edge[]) => {
    const incomingMap = new Map<string, string[]>();
    for (const e of currentEdges) {
        const arr = incomingMap.get(e.target);
        if (arr) arr.push(e.source);
        else incomingMap.set(e.target, [e.source]);
    }

    // Invariants de bucle: Les assignatures aprovades pertanyen a l'historial i mai muten aquí
    const passedSet = new Set<string>();
    let maxPassedSemester = 0;
    let passedCredits = 0;

    for (const n of currentNodes) {
        if (n.data.status === 'passed') {
            passedSet.add(n.id);
            passedCredits += n.data.credits;
            if (!SPECIAL_TYPES.has(n.data.type)) {
                const sem = n.data.semester || getSemesterForSubject(n.id);
                if (sem > maxPassedSemester) maxPassedSemester = sem;
            }
        }
    }

    const allowedSemester = Math.max(1, maxPassedSemester + 1);

    return currentNodes.map(node => {
        // Regla d'or: Mai degradar l'historial acadèmic de l'alumne (passed, failed, retaking)
        if (node.data.status === 'passed' || node.data.status === 'failed' || node.data.status === 'retaking') {
            return node;
        }

        const incoming = incomingMap.get(node.id);
        const edgePrereqsPassed = !incoming || incoming.every(sourceId => passedSet.has(sourceId));
        const isSemesterAllowed = (node.data.semester || getSemesterForSubject(node.id)) <= allowedSemester;
        
        let prereqsMet = edgePrereqsPassed && isSemesterAllowed;
        if (EXPERIENCE_TYPES.has(node.data.type)) {
            prereqsMet = edgePrereqsPassed && passedCredits >= 160;
        }

        if (!prereqsMet && node.data.status !== 'locked') {
            return { ...node, data: { ...node.data, status: 'locked' as SubjectStatus, attempts: 0, grade: null } };
        }
        if (prereqsMet && node.data.status === 'locked') {
            return { ...node, data: { ...node.data, status: 'in_progress' as SubjectStatus, attempts: 1 } };
        }
        return node;
    });
};

// ── Cycle Detection ──────────────────────────────────────────────────────────

/**
 * Detecta si afegir una aresta dirigida (source -> target) introduiria un cicle al graf.
 * En un DAG pur, una aresta (source -> target) crea un cicle si i només si target === source
 * o ja existeix un camí dirigit previ des de target cap a source (target ~> source).
 * Temps d'execució: O(V + E) mitjançant cerca en amplada (BFS) amb punter de cua O(1).
 */
export const wouldCreateCycle = (source: string, target: string, edges: Edge[]): boolean => {
    if (!source || !target || source === target) return true;

    const adj = new Map<string, string[]>();
    for (let i = 0; i < edges.length; i++) {
        const e = edges[i];
        if (!e.source || !e.target) continue;
        const list = adj.get(e.source);
        if (list) list.push(e.target);
        else adj.set(e.source, [e.target]);
    }

    // BFS des de target per comprovar si podem assolir source
    const visited = new Set<string>([target]);
    const queue: string[] = [target];
    let head = 0;

    while (head < queue.length) {
        const curr = queue[head++];
        if (curr === source) return true;
        const neighbors = adj.get(curr);
        if (neighbors) {
            for (let i = 0; i < neighbors.length; i++) {
                const next = neighbors[i];
                if (!visited.has(next)) {
                    visited.add(next);
                    queue.push(next);
                }
            }
        }
    }

    return false;
};

// ── Utility ──────────────────────────────────────────────────────────────────

export const removeUndefined = <T,>(obj: T): T => {
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

// ── Initial Graph Builder ────────────────────────────────────────────────────

export const createInitialGraph = () => {
    const nodes: Node<SubjectNodeData>[] = geiBaseNodes.map(acronym => {
        const subject = subjectsMap.get(acronym);
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
