export interface QuizOption {
    id: string;
    text: string;
}

export interface QuizQuestion {
    id: string;
    question: string;
    options: QuizOption[];
    correctOptionId: string;
    explanation?: string;
    codeSnippet?: string;
}

export interface Quiz {
    id?: string;
    topicId?: string;
    title?: string;
    timeLimitSeconds: number;
    questions: QuizQuestion[];
}

export interface QuizSession {
    currentIdx: number;
    answers: Record<string, string>;
    time: number;
}
