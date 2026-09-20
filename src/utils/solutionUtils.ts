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
    return !!(solutionId && /^[A-Z0-9]{6}$/.test(solutionId) && (topicId?.startsWith('pro2-') || topicId?.startsWith('eda-')));
};

interface SolutionLike {
    authorId?: string;
    type?: string;
    content?: string;
    code?: string;
}

export const isSolutionSolved = (solution?: SolutionLike | null): boolean => {
    return !!(solution && solution.authorId && (
        (solution.type === 'notebook' && solution.content) || 
        (solution.code && !solution.code.includes('// Solució no disponible encara'))
    ));
};

export const JUTGE_SUBJECTS = new Set(['pro2', 'eda']);

export const isJutgeSubject = (subjectOrTopicId?: string): boolean => {
    if (!subjectOrTopicId) return false;
    const s = subjectOrTopicId.split('-')[0].toLowerCase();
    return JUTGE_SUBJECTS.has(s);
};

export const isProgrammingSubject = (subjectOrTopicId?: string): boolean => {
    if (!subjectOrTopicId) return false;
    const s = subjectOrTopicId.split('-')[0].toLowerCase();
    return ['pro1', 'pro2', 'eda', 'lp'].includes(s);
};

export const shouldUseNotebookLayout = (topic?: TopicDefinition, topicId?: string): boolean => {
    if (topic?.layout) return topic.layout === 'notebook';
    const id = topic?.id || topicId || '';
    return !isJutgeSubject(id);
};

const SPECIAL_TOPIC_ROUTES: Record<string, string> = {
    'pro2-tema-1': '/tema/pro2-lab-1',
    'pro2-tema-2': '/tema/pro2-lab-2',
    'pro2-tema-9': '/tema/pro2-lab-7',
};

export const getTopicSolutionRoute = (topicSlug: string): string => {
    return SPECIAL_TOPIC_ROUTES[topicSlug] || `/tema/${topicSlug}/solucionaris`;
};

const LAB_TOPIC_SLUGS = new Set(['pro2-tema-1', 'pro2-tema-2', 'pro2-tema-9']);

export const getTopicSolutionLabel = (
    subject: string,
    topicSlug: string,
    t: (key: string, options?: any) => string
): string => {
    if (LAB_TOPIC_SLUGS.has(topicSlug)) {
        return t('topics.solutions.lab', 'Solucionaris Lab');
    }

    const s = (subject || '').toLowerCase();
    if (isJutgeSubject(s)) {
        return t('topics.solutions.jutge', 'Solucionaris Jutge');
    }

    const upper = (subject || '').toUpperCase();
    return t(`topics.solutions.${s}`, { defaultValue: `Solucionaris ${upper}` });
};
