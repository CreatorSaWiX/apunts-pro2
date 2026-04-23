export type SubjectType = 'pro2' | 'm1' | 'm2' | 'comunitari';

export interface SubjectConfig {
    id: SubjectType;
    label: string;
    color: string;
    description: string;
}

export const SUBJECTS: SubjectConfig[] = [
    {
        id: 'pro2',
        label: 'PRO2',
        color: 'sky',
        description: 'Programació 2'
    },
    {
        id: 'm1',
        label: 'M1',
        color: 'violet',
        description: 'Matemàtiques 1 (Àlgebra)'
    },
    {
        id: 'm2',
        label: 'M2',
        color: 'emerald',
        description: 'Matemàtiques 2 (Càlcul)'
    },
    {
        id: 'comunitari',
        label: 'General',
        color: 'slate',
        description: 'Publicacions generals de la comunitat'
    }
];

export const getSubjectById = (id: string) => SUBJECTS.find(s => s.id === id);
