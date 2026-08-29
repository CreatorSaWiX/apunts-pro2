import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useQuiz } from '../hooks/useQuiz';
import type { QuizSession } from '../types/quiz';
import { QuizTimer } from '../components/quiz/QuizTimer';
import { QuizLoadingState } from '../components/quiz/QuizLoadingState';
import { QuizResults } from '../components/quiz/QuizResults';
import { QuizQuestionView } from '../components/quiz/QuizQuestionView';

const QuizPage: React.FC = () => {
    const { id: topicId } = useParams();
    const { t } = useTranslation();

    const { quiz, isGenerating, aiPhase, aiThought } = useQuiz(topicId);

    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
    const [isFinished, setIsFinished] = useState(false);
    
    const timeLeftRef = useRef(0);
    const [initialTimeLeft, setInitialTimeLeft] = useState(0);
    const [isRestoring, setIsRestoring] = useState(true);

    // Initial setup when quiz loads
    useEffect(() => {
        if (quiz && isRestoring) {
            const saved = sessionStorage.getItem(`quiz_${topicId}`);
            if (saved) {
                try {
                    const { currentIdx, answers, time }: QuizSession = JSON.parse(saved);
                    setCurrentQuestionIdx(currentIdx);
                    setSelectedAnswers(answers);
                    timeLeftRef.current = time;
                    setInitialTimeLeft(time);
                } catch (e) {
                    console.error("Error restoring quiz session", e);
                    timeLeftRef.current = quiz.timeLimitSeconds;
                    setInitialTimeLeft(quiz.timeLimitSeconds);
                }
            } else {
                timeLeftRef.current = quiz.timeLimitSeconds;
                setInitialTimeLeft(quiz.timeLimitSeconds);
            }
            setIsRestoring(false);
        }
    }, [quiz, topicId, isRestoring]);

    const saveSession = useCallback((time: number) => {
        if (!isFinished) {
            const sessionData: QuizSession = {
                currentIdx: currentQuestionIdx,
                answers: selectedAnswers,
                time: time
            };
            sessionStorage.setItem(`quiz_${topicId}`, JSON.stringify(sessionData));
        } else {
            sessionStorage.removeItem(`quiz_${topicId}`);
        }
    }, [currentQuestionIdx, selectedAnswers, isFinished, topicId]);

    useEffect(() => {
        if (!isRestoring) {
            saveSession(timeLeftRef.current);
        }
    }, [currentQuestionIdx, selectedAnswers, isFinished, saveSession, isRestoring]);

    const handleSelectOption = useCallback((optionId: string) => {
        if (isFinished || !quiz) return;
        setSelectedAnswers(prev => ({ ...prev, [quiz.questions[currentQuestionIdx].id]: optionId }));
    }, [isFinished, currentQuestionIdx, quiz]);

    const finishQuiz = useCallback(async () => {
        setIsFinished(true);
        if (!quiz) return;
        const finalScore = quiz.questions.reduce((acc, q) => acc + (selectedAnswers[q.id] === q.correctOptionId ? 1 : 0), 0);
        if (finalScore === quiz.questions.length) {
            const confetti = (await import('canvas-confetti')).default;
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#0ea5e9', '#38bdf8', '#ffffff']
            });
        }
    }, [quiz, selectedAnswers]);

    const handleNext = useCallback(() => {
        if (!quiz) return;
        if (currentQuestionIdx < quiz.questions.length - 1) {
            setCurrentQuestionIdx(prev => prev + 1);
        } else {
            finishQuiz();
        }
    }, [quiz, currentQuestionIdx, finishQuiz]);

    const handlePrev = useCallback(() => {
        if (currentQuestionIdx > 0) {
            setCurrentQuestionIdx(prev => prev - 1);
        }
    }, [currentQuestionIdx]);

    const handleSelectOptionRef = useRef(handleSelectOption);
    const handleNextRef = useRef(handleNext);
    const handlePrevRef = useRef(handlePrev);
    
    useEffect(() => {
        handleSelectOptionRef.current = handleSelectOption;
        handleNextRef.current = handleNext;
        handlePrevRef.current = handlePrev;
    }, [handleSelectOption, handleNext, handlePrev]);

    useEffect(() => {
        if (isFinished || !quiz || isRestoring) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            const currentQ = quiz.questions[currentQuestionIdx];
            if (!currentQ) return;
            
            if (e.key >= '1' && e.key <= '4') {
                const optIndex = parseInt(e.key) - 1;
                if (optIndex < currentQ.options.length) {
                    handleSelectOptionRef.current(currentQ.options[optIndex].id);
                }
            } else if (e.key === 'Enter' && selectedAnswers[currentQ.id]) {
                handleNextRef.current();
            } else if (e.key === 'ArrowRight' && selectedAnswers[currentQ.id]) {
                handleNextRef.current();
            } else if (e.key === 'ArrowLeft') {
                handlePrevRef.current();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFinished, quiz, currentQuestionIdx, selectedAnswers, isRestoring]);

    if (!quiz || isRestoring) {
        return (
            <QuizLoadingState 
                isGenerating={isGenerating || isRestoring} 
                aiPhase={aiPhase} 
                aiThought={aiThought} 
            />
        );
    }

    const currentQ = quiz.questions[currentQuestionIdx];

    return (
        <div className="h-screen pt-8 md:pt-10 pb-6 px-4 max-w-4xl mx-auto flex flex-col relative z-10 overflow-hidden overflow-x-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 xl:mb-6 pb-3 border-b border-white/5 shrink-0">
                <Link
                    to="/"
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-medium group"
                >
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> {t('quiz.backTopics', 'Tornar a temes')}
                </Link>

                {!isFinished && (
                    <QuizTimer 
                        initialTime={initialTimeLeft > 0 ? initialTimeLeft : (quiz.timeLimitSeconds || 600)} 
                        isFinished={isFinished} 
                        onTimeUp={() => setIsFinished(true)} 
                        onTick={(t) => {
                            timeLeftRef.current = t;
                            if (t % 5 === 0) saveSession(t);
                        }} 
                    />
                )}
            </div>

            {isFinished ? (
                <QuizResults 
                    quiz={quiz} 
                    selectedAnswers={selectedAnswers} 
                    onRetry={() => window.location.reload()} 
                />
            ) : (
                <>
                    {/* Animated Progress Track */}
                    <div className="flex gap-2 mb-4 xl:mb-6 px-1 shrink-0">
                        {quiz.questions.map((q, i) => (
                            <div
                                key={q.id}
                                className="h-1.5 flex-1 relative rounded-full bg-white/5 overflow-hidden"
                            >
                                <div
                                    className={`absolute inset-0 rounded-full origin-left transition-all duration-500 ease-out ${
                                        i < currentQuestionIdx || (i === currentQuestionIdx && !!selectedAnswers[q.id]) 
                                            ? 'scale-x-100 bg-primary' 
                                            : 'scale-x-0 bg-transparent'
                                    }`}
                                />
                                {i === currentQuestionIdx && (
                                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                )}
                            </div>
                        ))}
                    </div>

                    <QuizQuestionView 
                        questionsLength={quiz.questions.length}
                        currentQuestionIdx={currentQuestionIdx}
                        currentQ={currentQ}
                        selectedAnswers={selectedAnswers}
                        onSelectOption={handleSelectOption}
                        onPrev={handlePrev}
                        onNext={handleNext}
                    />
                </>
            )}
        </div>
    );
};

export default QuizPage;
