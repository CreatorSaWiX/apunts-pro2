import subjectsData from '../data/subjects.json';

export type SubjectType = string;

export interface SubjectConfig {
    id: SubjectType;
    label: string;
    color: string;
    description: string;
}

export const SUBJECTS: SubjectConfig[] = subjectsData.map(s => ({
    id: s.id,
    label: s.name,
    color: s.colorToken.split('-')[0] || 'slate',
    description: s.description
}));

export const getSubjectById = (id: string) => SUBJECTS.find(s => s.id === id);
