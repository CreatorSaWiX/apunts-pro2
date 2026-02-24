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
// Force reload

export const allSolutions: TopicSolutions[] = [
    {
        topicId: 'pro2-tema-1',
        solutions: []
    },
    {
        topicId: 'm1-tema-1',
        solutions: m1t1Solutions
    },
    {
        topicId: 'm1-tema-2',
        solutions: m1t2Solutions
    }
];

export const getSolutionsByTopic = (topicId: string) => {
    return allSolutions.find(t => t.topicId === topicId)?.solutions || [];
};

export const getSolutionById = (topicId: string, problemId: string) => {
    const topic = allSolutions.find(t => t.topicId === topicId);
    return topic?.solutions.find(s => s.id === problemId);
};
