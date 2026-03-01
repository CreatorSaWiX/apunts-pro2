import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, Clock, AlertTriangle, RefreshCw, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { quizzes } from '../content/data/quizzes';
import confetti from 'canvas-confetti';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-cpp';

const renderInlineCode = (text: string) => {
    if (!text.includes('`')) return text;
    const parts = text.split(/`([^`]+)`/g);
    return parts.map((part, i) => {
        if (i % 2 === 1) {
            return (
                <code key={i} className="font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20 shadow-[0_0_10px_rgba(14,165,233,0.15)] mx-0.5 leading-none px-2 text-[0.85em]">
                    {part}
                </code>
            );
        }
        return <span key={i}>{part}</span>;
    });
};

const QuizPage: React.FC = () => {
    const { id: topicId } = useParams();

    // 1. Initial shuffling logic (Senior: prevent memorizing order)
    const originalQuiz = useMemo(() => quizzes.find(q => q.topicId === topicId), [topicId]);

    const [quiz] = useState(() => {
        if (!originalQuiz) return null;
        // Shuffle questions
        const shuffledQuestions = [...originalQuiz.questions].sort(() => Math.random() - 0.5);
        // Shuffle options for each question
        const fullyShuffled = shuffledQuestions.map(q => ({
            ...q,
            options: [...q.options].sort(() => Math.random() - 0.5)
        }));
        return { ...originalQuiz, questions: fullyShuffled };
    });

    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
    const [isFinished, setIsFinished] = useState(false);
    const [timeLeft, setTimeLeft] = useState(quiz ? quiz.timeLimitSeconds : 0);

    // 2. Persist progress in session storage (Senior: UX protection)
    useEffect(() => {
        const saved = sessionStorage.getItem(`quiz_${topicId}`);
        if (saved) {
            try {
                const { currentIdx, answers, time } = JSON.parse(saved);
                setCurrentQuestionIdx(currentIdx);
                setSelectedAnswers(answers);
                setTimeLeft(time);
            } catch (e) { console.error("Error restoring quiz session", e); }
        }
    }, [topicId]);

    useEffect(() => {
        if (!isFinished) {
            sessionStorage.setItem(`quiz_${topicId}`, JSON.stringify({
                currentIdx: currentQuestionIdx,
                answers: selectedAnswers,
                time: timeLeft
            }));
        } else {
            sessionStorage.removeItem(`quiz_${topicId}`);
        }
    }, [currentQuestionIdx, selectedAnswers, timeLeft, isFinished, topicId]);

    // 3. Code highlighting (Senior: Visual Quality)
    useEffect(() => {
        if (!isFinished) Prism.highlightAll();
    }, [currentQuestionIdx, isFinished]);

    // Timer Logic with visual warnings
    useEffect(() => {
        if (!quiz || isFinished) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setIsFinished(true);
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [quiz, isFinished]);

    // 4. Keyboard Navigation (Senior: Accessibility & Pro-feel)
    const handleSelectOption = useCallback((optionId: string) => {
        if (isFinished) return;
        setSelectedAnswers(prev => ({ ...prev, [quiz!.questions[currentQuestionIdx].id]: optionId }));
    }, [isFinished, currentQuestionIdx, quiz]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isFinished || !quiz) return;
            const key = e.key.toLowerCase();
            const currentQ = quiz.questions[currentQuestionIdx];

            // Map keys a,b,c,d to options based on their current displayed index
            if (['a', 'b', 'c', 'd'].includes(key)) {
                const idx = key.charCodeAt(0) - 97; // 0 for a, 1 for b...
                if (currentQ.options[idx]) {
                    handleSelectOption(currentQ.options[idx].id);
                }
            } else if (e.key === 'Enter' && selectedAnswers[currentQ.id]) {
                handleNext();
            } else if (e.key === 'ArrowRight' && selectedAnswers[currentQ.id]) {
                handleNext();
            } else if (e.key === 'ArrowLeft') {
                handlePrev();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFinished, quiz, currentQuestionIdx, selectedAnswers, handleSelectOption]);

    if (!quiz) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 max-w-2xl mx-auto flex flex-col items-center justify-center text-center relative z-10">
                <AlertTriangle size={48} className="text-amber-500 mb-4" />
                <h1 className="text-2xl font-bold text-white mb-2">Sense dades</h1>
                <p className="text-slate-400 mb-8">Encara estem preparant els tests per a aquest tema. Torna-hi més endavant!</p>
                <Link to="/" className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors">
                    Tornar a l'inici
                </Link>
            </div>
        );
    }

    const currentQ = quiz.questions[currentQuestionIdx];

    const handleNext = () => {
        if (currentQuestionIdx < quiz.questions.length - 1) {
            setCurrentQuestionIdx(prev => prev + 1);
        } else {
            finishQuiz();
        }
    };

    const handlePrev = () => {
        if (currentQuestionIdx > 0) {
            setCurrentQuestionIdx(prev => prev - 1);
        }
    };

    const finishQuiz = () => {
        setIsFinished(true);
        const finalScore = quiz.questions.reduce((acc, q) => acc + (selectedAnswers[q.id] === q.correctOptionId ? 1 : 0), 0);
        if (finalScore === quiz.questions.length) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#0ea5e9', '#38bdf8', '#ffffff']
            });
        }
    };

    const score = quiz.questions.reduce((acc, q) => acc + (selectedAnswers[q.id] === q.correctOptionId ? 1 : 0), 0);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="h-screen pt-8 md:pt-10 pb-6 px-4 max-w-4xl mx-auto flex flex-col relative z-10 overflow-hidden">
            {/* Elegant Header */}
            <div className="flex items-center justify-between mb-4 xl:mb-6 pb-3 border-b border-white/5 shrink-0">
                <Link
                    to="/"
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-all text-sm font-medium group"
                >
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Tornar a temes
                </Link>

                {!isFinished && (
                    <div className={`flex items-center gap-3 px-5 py-2 rounded-2xl font-mono text-sm font-bold border transition-all duration-500 ${timeLeft < 60
                        ? 'bg-red-500/20 text-red-400 border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.2)] scale-105'
                        : 'bg-slate-800/50 backdrop-blur-md text-slate-300 border-white/10'
                        }`}>
                        <Clock size={16} className={timeLeft < 60 ? 'animate-pulse' : ''} />
                        <span className="tabular-nums">{formatTime(timeLeft)}</span>
                    </div>
                )}
            </div>

            {isFinished ? (
                // RESULTS SCREEN - Premium Finish
                <div className="flex-1 overflow-y-auto min-h-0 pr-2 pb-6 custom-scrollbar">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
                    >
                        {/* Background Decorative Element */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="text-center mb-10 relative z-10">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Trophy className={`mx-auto mb-4 ${score === quiz.questions.length ? 'text-amber-400' : 'text-slate-500'}`} size={56} />
                                <h2 className="text-3xl xl:text-4xl font-black text-white mb-3 tracking-tight">Cicle Finalitzat</h2>

                                <div className="flex items-center justify-center gap-4 mb-4">
                                    <div className="text-5xl xl:text-6xl font-black bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                                        {Math.round((score / quiz.questions.length) * 100)}%
                                    </div>
                                    <div className="h-12 w-px bg-white/10" />
                                    <div className="text-left">
                                        <p className="text-slate-400 text-xs xl:text-sm uppercase tracking-widest font-bold">Puntuació</p>
                                        <p className="text-white font-mono text-lg xl:text-xl">{score} / {quiz.questions.length}</p>
                                    </div>
                                </div>

                                <p className="text-slate-300 text-base max-w-lg mx-auto leading-relaxed">
                                    {score === quiz.questions.length
                                        ? "Perfecte. Has demostrat un domini absolut de la matèria. Estàs preparat per a qualsevol repte tècnic d'alt nivell."
                                        : "Analitza els teus errors per millorar la teva tècnica en C++."}
                                </p>
                            </motion.div>
                        </div>

                        <div className="space-y-4 xl:space-y-6 relative z-10">
                            {quiz.questions.map((q, i) => {
                                const userAnswer = selectedAnswers[q.id];
                                const isCorrect = userAnswer === q.correctOptionId;

                                return (
                                    <motion.div
                                        key={q.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 + 0.5 }}
                                        className={`p-5 xl:p-6 rounded-3xl border transition-colors ${isCorrect ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}
                                    >
                                        <div className="flex gap-4">
                                            <div className={`mt-1 p-1.5 rounded-full shrink-0 h-fit ${isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                                {isCorrect ? <CheckCircle size={18} /> : <XCircle size={18} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-slate-200 font-bold leading-relaxed mb-3 text-sm xl:text-base">{i + 1}. {renderInlineCode(q.question)}</h4>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                                    <div className={`p-3 rounded-xl text-xs font-medium border ${isCorrect ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-red-500/10 border-red-500/20 text-red-300'}`}>
                                                        <span className="uppercase opacity-50 block mb-1">La teva resposta</span>
                                                        <span className="">{renderInlineCode(q.options.find(o => o.id === userAnswer)?.text || 'No contestada')}</span>
                                                    </div>
                                                    {!isCorrect && (
                                                        <div className="p-3 rounded-xl text-xs font-medium border bg-emerald-500/10 border-emerald-500/20 text-emerald-300">
                                                            <span className="uppercase opacity-50 block mb-1">Resposta Correcta</span>
                                                            <span className="">{renderInlineCode(q.options.find(o => o.id === q.correctOptionId)?.text || '')}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                                    <p className="text-xs xl:text-sm text-slate-300 leading-relaxed italic">
                                                        <span className="font-bold text-primary not-italic mr-2">Deep-dive:</span>
                                                        {renderInlineCode(q.explanation)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        <div className="mt-10 flex justify-center">
                            <button
                                onClick={() => window.location.reload()}
                                className="flex items-center gap-2 px-8 py-3 bg-white text-slate-950 font-bold rounded-2xl hover:bg-slate-200 transition-colors shadow-xl"
                            >
                                <RefreshCw size={18} /> Reintentar Test
                            </button>
                        </div>
                    </motion.div>
                </div>
            ) : (
                // QUIZ SCREEN - Immersive Challenge (Fit in Screen)
                <div className="flex flex-col flex-1 min-h-0">
                    {/* Animated Progress Track */}
                    <div className="flex gap-2 mb-4 xl:mb-6 px-1 shrink-0">
                        {quiz.questions.map((q, i) => (
                            <div
                                key={q.id}
                                className="h-1.5 flex-1 relative rounded-full bg-white/5 overflow-hidden"
                            >
                                <motion.div
                                    className={`absolute inset-0 rounded-full ${i <= currentQuestionIdx ? 'bg-primary' : ''}`}
                                    initial={false}
                                    animate={{
                                        width: i < currentQuestionIdx || (i === currentQuestionIdx && !!selectedAnswers[q.id]) ? '100%' : '0%',
                                        opacity: i === currentQuestionIdx ? 1 : 0.6
                                    }}
                                    transition={{ duration: 0.5 }}
                                />
                                {i === currentQuestionIdx && (
                                    <motion.div
                                        className="absolute inset-0 bg-white/20"
                                        animate={{ opacity: [0, 1, 0] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQ.id}
                            initial={{ opacity: 0, x: 20, filter: 'blur(5px)' }}
                            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, x: -20, filter: 'blur(5px)' }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-t-[2.5rem] rounded-b-2xl p-6 xl:p-10 shadow-2xl mb-4 xl:mb-6 flex-1 flex flex-col min-h-0"
                        >
                            {/* Question Header */}
                            {/* <div className="hidden sm:flex items-center justify-between mb-4 xl:mb-6 shrink-0">
                                <span className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-[10px] xl:text-xs font-black uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(14,165,233,0.15)] flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                    Progrés: {currentQuestionIdx + 1}/{quiz.questions.length}
                                </span>
                                <div className="flex gap-1.5">
                                    {['A', 'B', 'C', 'D'].map((l, i) => (
                                        <div key={l} className={`w-6 h-6 rounded border flex items-center justify-center text-[10px] xl:text-xs font-bold transition-colors ${selectedAnswers[currentQ.id] ? (i === currentQ.options.findIndex(o => o.id === selectedAnswers[currentQ.id]) ? 'bg-primary border-primary text-white shadow-[0_0_10px_rgba(14,165,233,0.3)]' : 'border-white/10 text-white/20') : 'border-white/10 text-white/40'}`}>
                                            {l}
                                        </div>
                                    ))}
                                </div>
                            </div> */}

                            {/* Question Content Wrapper - Scrollable if extremely long, else flex content */}
                            <div className="flex flex-col flex-1 min-h-0 overflow-y-auto pr-2 pb-2 custom-scrollbar">
                                <h2 className="text-xl xl:text-2xl text-white font-bold leading-tight mb-4 xl:mb-6 shrink-0">
                                    {renderInlineCode(currentQ.question)}
                                </h2>

                                {currentQ.codeSnippet && (
                                    <div className="rounded-2xl overflow-hidden mb-5 border border-white/10 shadow-xl bg-[#0d1117] shrink-0 group relative">
                                        <div className="flex items-center px-4 py-3 bg-white/[0.03] border-b border-white/5 relative">
                                            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <div className="flex gap-1.5 z-10 hover:gap-2 transition-all cursor-default">
                                                <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                                                <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                                                <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                            </div>
                                            <div className="ml-4 text-[12px] font-mono font-medium text-slate-400 z-10 flex items-center gap-2">
                                                <span className="text-primary/70">⌘</span> snippet.cpp
                                            </div>
                                        </div>
                                        <pre className="!mx-0 !my-0 !p-4 xl:!p-6 !bg-transparent">
                                            <code className="language-cpp font-mono text-xs xl:text-sm leading-relaxed">
                                                {currentQ.codeSnippet}
                                            </code>
                                        </pre>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 gap-3 mt-auto shrink-0">
                                    {currentQ.options.map((opt, i) => {
                                        const isSelected = selectedAnswers[currentQ.id] === opt.id;
                                        const letters = ['A', 'B', 'C', 'D'];
                                        return (
                                            <motion.button
                                                key={opt.id}
                                                onClick={() => handleSelectOption(opt.id)}
                                                whileHover={{ x: 4, scale: 1.01 }}
                                                whileTap={{ scale: 0.98 }}
                                                className={`group cursor-pointer text-left p-3.5 xl:p-4 rounded-2xl border transition-colors duration-300 flex gap-4 items-center relative overflow-hidden ${isSelected
                                                    ? 'bg-primary/10 border-primary shadow-[0_0_25px_rgba(14,165,233,0.15)] ring-1 ring-primary/50'
                                                    : 'bg-slate-800/40 border-white/5 hover:bg-slate-700/50 hover:border-white/20'
                                                    }`}
                                            >
                                                {isSelected && (
                                                    <motion.div
                                                        layoutId="selection-glow"
                                                        className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none"
                                                    />
                                                )}

                                                <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 transition-all duration-300 font-mono font-bold text-sm z-10 ${isSelected
                                                    ? 'bg-primary text-white border-transparent scale-110 shadow-[0_0_15px_rgba(14,165,233,0.4)]'
                                                    : 'border-white/10 bg-black/40 text-slate-400 group-hover:border-white/30 group-hover:text-slate-200'
                                                    }`}>
                                                    {letters[i]}
                                                </div>
                                                <span className={`leading-snug text-sm xl:text-[15px] transition-colors z-10 ${isSelected ? 'text-white font-semibold' : 'text-slate-300 group-hover:text-slate-100'}`}>
                                                    {renderInlineCode(opt.text)}
                                                </span>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Pro-Navigation Controls */}
                    <div className="flex items-center justify-between gap-4 shrink-0 px-2 xl:px-4">
                        <button
                            onClick={handlePrev}
                            disabled={currentQuestionIdx === 0}
                            className="flex items-center gap-2 px-6 py-3.5 xl:py-4 rounded-2xl border border-white/10 bg-slate-900/50 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-0 disabled:pointer-events-none transition-all font-bold text-sm shadow-lg hover:shadow-xl"
                        >
                            <ChevronLeft size={18} /> <span className="hidden sm:inline">Anterior</span>
                        </button>

                        <div className="flex-1 max-w-xs h-px bg-gradient-to-r from-transparent via-white/10 to-transparent hidden md:block" />

                        <button
                            onClick={handleNext}
                            disabled={!selectedAnswers[currentQ.id]}
                            className={`flex items-center justify-center gap-2 px-8 xl:px-10 py-3.5 xl:py-4 rounded-2xl font-black uppercase tracking-widest text-xs xl:text-sm transition-all duration-300 relative overflow-hidden group ${!!selectedAnswers[currentQ.id]
                                ? 'bg-white text-slate-950 shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:scale-105 active:scale-95'
                                : 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed opacity-50'
                                }`}
                        >
                            {!!selectedAnswers[currentQ.id] && (
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                            )}

                            <span className="relative z-10">{currentQuestionIdx === quiz.questions.length - 1 ? 'Avaluar' : 'Següent'}</span>
                            {currentQuestionIdx !== quiz.questions.length - 1 && <ChevronRight size={18} className="relative z-10" />}

                            {/* Keyboard hint */}
                            {!!selectedAnswers[currentQ.id] && (
                                <span className="hidden lg:block absolute bottom-1 right-2 text-[8px] font-bold opacity-30 text-slate-900">
                                    ↵ ENTER
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizPage;
