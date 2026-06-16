export const geiBaseNodes = [
    // Q1
    'F', 'FM', 'IC', 'PRO1',
    // Q2
    'M1', 'M2', 'PRO2', 'EC',
    // Q3
    'EDA', 'PE', 'SO', 'CI', 'BD',
    // Q4
    'EEE', 'IDI', 'IES', 'AC', 'XC',
    // Q5
    'PROP', 'PAR'
];

export const geiBaseEdges = [
    // Precorequisits i Prerequisits (Simplificats com edges visuals)
    { source: 'F', target: 'EDA' },
    { source: 'FM', target: 'PE' },
    { source: 'IC', target: 'EC' },
    { source: 'PRO1', target: 'PRO2' },
    { source: 'PRO1', target: 'EDA' },
    { source: 'PRO1', target: 'PROP' },
    { source: 'M1', target: 'PE' },
    { source: 'M1', target: 'SO' },
    { source: 'EC', target: 'SO' },
    { source: 'EC', target: 'AC' },
    { source: 'EC', target: 'CI' },
    { source: 'EC', target: 'XC' },
    { source: 'M2', target: 'PE' },
    { source: 'PRO2', target: 'EDA' },
    { source: 'PRO2', target: 'PROP' },
    { source: 'PRO2', target: 'PAR' },
    { source: 'PRO2', target: 'IES' },
    { source: 'EDA', target: 'BD' },
    { source: 'EDA', target: 'IES' },
    { source: 'BD', target: 'IES' }
];

// Helper to determine base ECTS based on acronym (default 6, 7.5 for some Q1/Q2)
export const getCreditsForSubject = (acronym: string): number => {
    const q1q2 = ['F', 'FM', 'IC', 'PRO1', 'M1', 'M2', 'PRO2', 'EC'];
    if (q1q2.includes(acronym)) return 7.5;
    if (acronym === 'TFG') return 18;
    if (acronym === 'TFM') return 30; // Depèn del màster, posem 30 estàndard
    return 6;
};

// Helper to assign strict semester columns for the Grid layout
export const getSemesterForSubject = (acronym: string): number => {
    const semesters: Record<string, number> = {
        'F': 1, 'FM': 1, 'IC': 1, 'PRO1': 1,
        'M1': 2, 'M2': 2, 'PRO2': 2, 'EC': 2,
        'EDA': 3, 'PE': 3, 'SO': 3, 'CI': 3, 'BD': 3,
        'EEE': 4, 'IDI': 4, 'IES': 4, 'AC': 4, 'XC': 4,
        'PROP': 5, 'PAR': 5,
        'A': 6, 'G': 6, 'IA': 6, 'LI': 6, 'LP': 6, 'TC': 6, // Ex. Computació
    };
    return semesters[acronym] || 8; // Default to column 8 if not defined
};
