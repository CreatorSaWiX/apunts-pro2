import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { quizzes } from '../content/data/quizzes';

const QuizPage: React.FC = () => {
    const { id: topicId } = useParams();
    const quiz = quizzes.find(q => q.topicId === topicId);

    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
    const [isFinished, setIsFinished] = useState(false);
    const [timeLeft, setTimeLeft] = useState(quiz ? quiz.timeLimitSeconds : 0);

    // Timer Logic
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

    if (!quiz) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 max-w-2xl mx-auto flex flex-col items-center justify-center text-center relative z-10">
                <AlertTriangle size={48} className="text-amber-500 mb-4" />
                <h1 className="text-2xl font-bold text-white mb-2">Sense dades</h1>
                <p className="text-slate-400 mb-8">Encara estem cuinant els tests d'entrevista FAANG per a aquest tema. Torna-hi més endavant!</p>
                <Link to="/" className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors">
                    Tornar a l'inici
                </Link>
            </div>
        );
    }

    const currentQ = quiz.questions[currentQuestionIdx];

    const handleSelectOption = (optionId: string) => {
        if (isFinished) return;
        setSelectedAnswers(prev => ({ ...prev, [currentQ.id]: optionId }));
    };

    const handleNext = () => {
        if (currentQuestionIdx < quiz.questions.length - 1) {
            setCurrentQuestionIdx(prev => prev + 1);
        } else {
            setIsFinished(true);
        }
    };

    const handlePrev = () => {
        if (currentQuestionIdx > 0) {
            setCurrentQuestionIdx(prev => prev - 1);
        }
    };

    // Calculation for Results
    const score = quiz.questions.reduce((acc, q) => {
        return acc + (selectedAnswers[q.id] === q.correctOptionId ? 1 : 0);
    }, 0);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 max-w-4xl mx-auto flex flex-col relative z-10">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <Link
                    to="/"
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
                >
                    <ChevronLeft size={16} /> Tornar a temes
                </Link>

                {!isFinished && (
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono text-sm font-bold border transition-colors ${timeLeft < 60 ? 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse' : 'bg-slate-800 text-slate-300 border-white/5'}`}>
                        <Clock size={16} />
                        {formatTime(timeLeft)}
                    </div>
                )}
            </div>

            {isFinished ? (
                // RESULTS SCREEN
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
                >
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-2">Avaluació Final</h2>
                        <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-xl mb-4">
                            {score} / {quiz.questions.length} Encerts
                        </div>
                        <p className="text-slate-400 max-w-lg mx-auto">
                            {score === quiz.questions.length ? "Ets una màquina! Estàs llest per rebentar el codi a Bending Spoons." : "Hi ha marge de millora. Repassa els conceptes sota la lupa abans de l'entrevista."}
                        </p>
                    </div>

                    <div className="space-y-6">
                        {quiz.questions.map((q, i) => {
                            const userAnswer = selectedAnswers[q.id];
                            const isCorrect = userAnswer === q.correctOptionId;

                            return (
                                <div key={q.id} className={`p-6 rounded-2xl border ${isCorrect ? 'bg-emerald-900/10 border-emerald-500/20' : 'bg-red-900/10 border-red-500/20'}`}>
                                    <div className="flex gap-3 mb-3">
                                        <div className="mt-1">
                                            {isCorrect ? <CheckCircle size={20} className="text-emerald-400" /> : <XCircle size={20} className="text-red-400" />}
                                        </div>
                                        <div>
                                            <h4 className="text-slate-200 font-medium leading-relaxed">{i + 1}. {q.question}</h4>
                                            {!isCorrect && userAnswer && (
                                                <p className="text-red-300/80 text-sm mt-2">La teva resposta: <span className="font-mono">{q.options.find(o => o.id === userAnswer)?.text}</span></p>
                                            )}
                                            {!userAnswer && (
                                                <p className="text-amber-300/80 text-sm mt-2">No contestada.</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-white/5 pl-8">
                                        <p className="text-sm text-emerald-300/90 font-mono mb-2">Resposta Ok: {q.options.find(o => o.id === q.correctOptionId)?.text}</p>
                                        <p className="text-sm text-slate-400 leading-relaxed"><strong className="text-slate-300">Expl.:</strong> {q.explanation}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            ) : (
                // QUIZ SCREEN
                <div className="flex flex-col flex-1">
                    {/* Progress */}
                    <div className="flex gap-2 mb-8">
                        {quiz.questions.map((q, i) => (
                            <div
                                key={q.id}
                                className={`h-1.5 flex-1 rounded-full transition-all ${i === currentQuestionIdx ? 'bg-primary shadow-[0_0_10px_rgba(14,165,233,0.5)]' : !!selectedAnswers[q.id] ? 'bg-primary/40' : 'bg-white/10'}`}
                            />
                        ))}
                    </div>

                    <motion.div
                        key={currentQ.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl mb-8 flex-1"
                    >
                        <h2 className="text-xs font-mono text-primary font-bold tracking-widest uppercase mb-4">Pregunta {currentQuestionIdx + 1} de {quiz.questions.length}</h2>

                        <p className="text-xl md:text-2xl text-slate-200 font-medium leading-relaxed mb-6">
                            {currentQ.question}
                        </p>

                        {currentQ.codeSnippet && (
                            <div className="bg-[#0b1221] p-4 rounded-xl mb-6 font-mono text-sm text-emerald-400 border border-white/5 overflow-x-auto whitespace-pre">
                                {currentQ.codeSnippet}
                            </div>
                        )}

                        <div className="flex flex-col gap-3 mt-8">
                            {currentQ.options.map((opt) => {
                                const isSelected = selectedAnswers[currentQ.id] === opt.id;
                                return (
                                    <button
                                        key={opt.id}
                                        onClick={() => handleSelectOption(opt.id)}
                                        className={`text-left p-4 rounded-xl border transition-all flex gap-4 ${isSelected ? 'bg-primary/10 border-primary/50 text-white' : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:border-white/20'}`}
                                    >
                                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${isSelected ? 'border-primary bg-primary text-white' : 'border-slate-600 text-slate-500'}`}>
                                            <span className="text-xs font-bold uppercase">{opt.id}</span>
                                        </div>
                                        <span className="leading-relaxed text-[15px]">{opt.text}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Bottom nav */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handlePrev}
                            disabled={currentQuestionIdx === 0}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/5 bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            <ChevronLeft size={18} /> Anterior
                        </button>

                        <button
                            onClick={handleNext}
                            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary hover:bg-sky-400 text-white shadow-lg shadow-primary/20 transition-all font-medium"
                        >
                            {currentQuestionIdx === quiz.questions.length - 1 ? 'Finalitzar' : 'Següent'}
                            {currentQuestionIdx !== quiz.questions.length - 1 && <ChevronRight size={18} />}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizPage;
