import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { allPersonalNotes } from 'content-collections';
import type { Quiz, QuizQuestion } from '../types/quiz';
import { fisherYatesShuffle } from '../utils/quizUtils';

export type AIPhase = 'idle' | 'connecting' | 'thinking' | 'writing';

export const useQuiz = (topicId: string | undefined) => {
    const { t } = useTranslation();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [isGenerating, setIsGenerating] = useState(true);
    const [aiPhase, setAiPhase] = useState<AIPhase>('connecting');
    const [aiThought, setAiThought] = useState('');

    useEffect(() => {
        let isMounted = true;
        const loadQuiz = async () => {
            if (!topicId) return;

            const handleQuizLoaded = (finalQuiz: Quiz) => {
                if (isMounted) setQuiz(finalQuiz);
            };

            try {
                // 1. Try to load local hardcoded quiz
                const { quizzes } = await import('../content/data/quizzes');
                const originalQuiz = (quizzes as Quiz[]).find((q: Quiz) => q.topicId === topicId);
                
                if (originalQuiz) {
                    const fullyShuffled: Quiz = {
                        ...originalQuiz,
                        questions: fisherYatesShuffle(originalQuiz.questions).map((q: any) => ({
                            ...q,
                            options: fisherYatesShuffle(q.options)
                        }))
                    };
                    handleQuizLoaded(fullyShuffled);
                    if (isMounted) setIsGenerating(false);
                    return;
                }
            } catch (e) {
                console.log("No local quizzes found or error loading them.");
            }

            // 2. Not found locally, attempt to generate dynamically via AI
            const normalizedTopicId = topicId.replace(/tema(\d)/, 'tema-$1');
            const topicNote = allPersonalNotes.find(note => note.slug === normalizedTopicId && note.lang === 'ca') || 
                              allPersonalNotes.find(note => note.slug === normalizedTopicId) ||
                              allPersonalNotes.find(note => note.slug.startsWith(normalizedTopicId + '-'));
                              
            if (!topicNote || !topicNote.content) {
                if (isMounted) setIsGenerating(false);
                return;
            }

            try {
                if (isMounted) {
                    setAiPhase('thinking');
                    setAiThought(t('quiz.generating', 'Llegint apunts i generant test (10 min, 10 preguntes)...'));
                }
                
                const response = await fetch('/api/generate-quiz', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        topicId: topicId,
                        markdownContent: topicNote.content
                    })
                });

                if (response.ok) {
                    const generatedQuiz = await response.json();
                    const fullyShuffled: Quiz = {
                        ...generatedQuiz,
                        questions: fisherYatesShuffle(generatedQuiz.questions).map((q: any) => ({
                            ...q,
                            options: fisherYatesShuffle(q.options)
                        }))
                    };
                    handleQuizLoaded(fullyShuffled);
                } else {
                    const errText = await response.text();
                    console.error("Failed to generate quiz:", response.status, errText);
                }
            } catch (e) {
                console.error("Error connecting to Gemini", e);
            } finally {
                if (isMounted) {
                    setIsGenerating(false);
                    setAiPhase('idle');
                }
            }
        };

        loadQuiz();
        return () => { isMounted = false; };
    }, [topicId, t]);

    return { quiz, isGenerating, aiPhase, aiThought };
};
