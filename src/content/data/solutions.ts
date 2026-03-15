export interface Solution {
    id: string;
    title: string;
    author: string;
    authorId?: string;
    code: string;
    statement?: string;
    availableLanguages?: string[];
    status?: 'pending' | 'approved';
    date?: string;
    type?: 'code' | 'notebook'; // New field to support notebook exercises
    content?: string; // Rich markdown content for notebook solutions
}

export interface TopicSolutions {
    topicId: string;
    solutions: Solution[];
}
import { m1t1Solutions } from './solucionarisM1/t1/index';
import { m1t2Solutions } from './solucionarisM1/t2/index';
import { m1t3Solutions } from './solucionarisM1/t3/index';

import { m2t1Solutions } from './solucionarisM2/t1/index';
import { m2t2Solutions } from './solucionarisM2/t2/index';
import { m2t3Solutions } from './solucionarisM2/t3/index';
import { m2t4Solutions } from './solucionarisM2/t4/index';
import { m2t5Solutions } from './solucionarisM2/t5/index';

export const allSolutions: TopicSolutions[] = [
    {
        topicId: 'm1-tema-1',
        solutions: m1t1Solutions
    },
    {
        topicId: 'm1-tema-2',
        solutions: m1t2Solutions
    },
    {
        topicId: 'm1-tema-3',
        solutions: m1t3Solutions
    },
    {
        topicId: 'm2-tema-1-reals',
        solutions: m2t1Solutions
    },
    {
        topicId: 'm2-tema-2-successions',
        solutions: m2t2Solutions
    },
    {
        topicId: 'm2-tema-3-continuïtat',
        solutions: m2t3Solutions
    },
    {
        topicId: 'm2-tema-4-funcions-derivables',
        solutions: m2t4Solutions
    },
    {
        topicId: 'm2-tema-5-taylor',
        solutions: m2t5Solutions
    }
];

export const getSolutionsByTopic = (topicId: string) => {
    return allSolutions.find(t => t.topicId === topicId)?.solutions || [];
};

export const getSolutionById = (topicId: string, problemId: string) => {
    const topic = allSolutions.find(t => t.topicId === topicId);
    return topic?.solutions.find(s => s.id === problemId);
};
