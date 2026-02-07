export interface Solution {
    id: string;
    title: string;
    author: string;
    authorId?: string;
    code: string;
    statement?: string;
    status?: 'pending' | 'approved';
    date?: string;
}

export interface TopicSolutions {
    topicId: string;
    solutions: Solution[];
}

// Imports
import p37500Code from './solutions/tema1/P37500.cpp?raw';
import p37500Statement from './solutions/tema1/P37500.html?raw';

export const allSolutions: TopicSolutions[] = [
    {
        topicId: 'tema-1',
        solutions: [
            {
                id: 'P37500',
                title: 'Primers nombres',
                author: 'Arnau',
                code: p37500Code,
                statement: p37500Statement
            },
            {
                id: 'P59539',
                title: 'Nombres harmònics (1)',
                author: 'Arnau',
                code: `// Placeholder for P59539`,
                statement: `<p>Feu un programa que llegeixi un nombre natural <code>n</code> i escrigui el n-èssim nombre harmònic amb 4 decimals.</p>`
            },
            {
                id: 'P97969',
                title: 'Comptant as (1)',
                author: 'Arnau',
                code: `// Placeholder for P97969`,
                statement: `<p>Feu un programa que llegeixi una seqüència de caràcters acabada en punt i escrigui quantes 'a' hi ha aparegut.</p>`
            }
        ]
    }
];

export const getSolutionsByTopic = (topicId: string) => {
    return allSolutions.find(t => t.topicId === topicId)?.solutions || [];
};

export const getSolutionById = (topicId: string, problemId: string) => {
    const topic = allSolutions.find(t => t.topicId === topicId);
    return topic?.solutions.find(s => s.id === problemId);
};
