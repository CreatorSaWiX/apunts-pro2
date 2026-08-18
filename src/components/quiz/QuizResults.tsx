import React, { useMemo } from 'react';
import { m as motion } from 'framer-motion';
import { Trophy, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Quiz } from '../../types/quiz';
import { renderInlineCode } from '../../utils/quizUtils';

interface QuizResultsProps {
    quiz: Quiz;
    selectedAnswers: Record<string, string>;
    onRetry: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({ quiz, selectedAnswers, onRetry }) => {
    const { t } = useTranslation();

    // Memoize score calculation
    const score = useMemo(() => {
        return quiz.questions.reduce((acc, q) => acc + (selectedAnswers[q.id] === q.correctOptionId ? 1 : 0), 0);
    }, [quiz, selectedAnswers]);

    return (
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
                        <h2 className="text-3xl xl:text-4xl font-black text-white mb-3 tracking-tight">{t('quiz.finishedTitle', 'Cicle Finalitzat')}</h2>

                        <div className="flex items-center justify-center gap-4 mb-4">
                            <div className="text-5xl xl:text-6xl font-black bg-linear-to-br from-primary to-accent bg-clip-text text-transparent">
                                {Math.round((score / quiz.questions.length) * 100)}%
                            </div>
                            <div className="h-12 w-px bg-white/10" />
                            <div className="text-left">
                                <p className="text-slate-400 text-xs xl:text-sm uppercase tracking-widest font-bold">{t('quiz.score', 'Puntuació')}</p>
                                <p className="text-white font-mono text-lg xl:text-xl">{score} / {quiz.questions.length}</p>
                            </div>
                        </div>

                        <p className="text-slate-300 text-base max-w-lg mx-auto leading-relaxed">
                            {score === quiz.questions.length
                                ? t('quiz.perfectScore', "Perfecte. Has demostrat un domini absolut de la matèria. Estàs preparat per a qualsevol repte tècnic d'alt nivell.")
                                : t('quiz.improveScore', "Analitza els teus errors per millorar la teva tècnica.")}
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
                                                <span className="uppercase opacity-50 block mb-1">{t('quiz.yourAnswer', 'La teva resposta')}</span>
                                                <span className="">{renderInlineCode(q.options.find(o => o.id === userAnswer)?.text || t('quiz.notAnswered', 'No contestada'))}</span>
                                            </div>
                                            {!isCorrect && (
                                                <div className="p-3 rounded-xl text-xs font-medium border bg-emerald-500/10 border-emerald-500/20 text-emerald-300">
                                                    <span className="uppercase opacity-50 block mb-1">{t('quiz.correctAnswer', 'Resposta Correcta')}</span>
                                                    <span className="">{renderInlineCode(q.options.find(o => o.id === q.correctOptionId)?.text || '')}</span>
                                                </div>
                                            )}
                                        </div>

                                        {q.explanation && (
                                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                                <p className="text-xs xl:text-sm text-slate-300 leading-relaxed italic">
                                                    <span className="font-bold text-primary not-italic mr-2">{t('quiz.deepDive', 'Deep-dive:')}</span>
                                                    {renderInlineCode(q.explanation)}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="mt-10 flex justify-center">
                    <button type="button"
                        onClick={onRetry}
                        className="flex items-center gap-2 px-8 py-3 bg-white text-slate-950 font-bold rounded-2xl hover:bg-slate-200 transition-colors shadow-xl"
                    >
                        <RefreshCw size={18} /> {t('quiz.retry', 'Reintentar Test')}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
