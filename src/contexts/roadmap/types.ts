import type { Node, Edge, NodeChange, EdgeChange, Connection } from '@xyflow/react';
import type { User } from '../AuthContext';

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

export interface RoadmapState {
    nodes: Node<SubjectNodeData>[];
    edges: Edge[];
    itinerary: ItineraryType;
    isLoading: boolean;
    totalPassedECTS: number;
    totalPlannedECTS: number;
    canStartMaster: boolean;
    averageGrade: number | null;
    initialStrokes: DrawingStroke[];
    targetGrade: number | null;
    requiredAverageGrade: number | null;
    user: User | null;
    saveVersion: number;
    lastSavedVersion: number;

    setNodes: (updater: (prev: Node<SubjectNodeData>[]) => Node<SubjectNodeData>[]) => void;
    setEdges: (updater: (prev: Edge[]) => Edge[]) => void;
    setItinerary: (it: ItineraryType) => void;
    setIsLoading: (v: boolean) => void;
    setTargetGrade: (grade: number | null) => void;
    setInitialStrokes: (strokes: DrawingStroke[]) => void;
    setUser: (u: User | null) => void;

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

// Re-export User type from AuthContext for convenience
export type { User } from '../AuthContext';
