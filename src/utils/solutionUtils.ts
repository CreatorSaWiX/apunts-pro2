import type { TopicDefinition } from '../content/data/courseStructure';

export const getCanonicalTitle = (solutionId: string, solutionTitle: string, topicId?: string, courseStructure?: TopicDefinition[]): string => {
    let canonicalTitle = solutionTitle;
    if (topicId && courseStructure) {
        const topic = courseStructure.find(t => t.id === topicId);
        if (topic) {
            const problemDef = topic.problems.find(p => (typeof p === 'string' ? p : p.id) === solutionId);
            if (problemDef && typeof problemDef !== 'string') {
                canonicalTitle = problemDef.title;
            }
        }
    }
    return canonicalTitle;
};

export const isJutgeId = (solutionId?: string, topicId?: string): boolean => {
    return !!(solutionId && /^[A-Z0-9]{6}$/.test(solutionId) && topicId?.startsWith('pro2-'));
};

export const isSolutionSolved = (solution: any): boolean => {
    return !!(solution && solution.authorId && (
        (solution.type === 'notebook' && solution.content) || 
        (solution.code && !solution.code.includes('// Solució no disponible encara'))
    ));
};
