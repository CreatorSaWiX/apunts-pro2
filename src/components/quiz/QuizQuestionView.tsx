import React from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ReactCodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { EditorView } from '@codemirror/view';
import { cpp } from '@codemirror/lang-cpp';
import { useTranslation } from 'react-i18next';
import type { QuizQuestion, QuizOption } from '../../types/quiz';
import { renderInlineCode } from '../../utils/quizUtils';

interface QuizQuestionViewProps {
    questionsLength: number;
    currentQuestionIdx: number;
    currentQ: QuizQuestion;
    selectedAnswers: Record<string, string>;
    onSelectOption: (optionId: string) => void;
    onPrev: () => void;
    onNext: () => void;
}

export const QuizQuestionView: React.FC<QuizQuestionViewProps> = ({
    questionsLength,
    currentQuestionIdx,
    currentQ,
    selectedAnswers,
    onSelectOption,
    onPrev,
    onNext
}) => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col flex-1 min-h-0">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQ.id}
                    initial={{ opacity: 0, x: 20, filter: 'blur(5px)' }}
                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, x: -20, filter: 'blur(5px)' }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-t-[2.5rem] rounded-b-2xl p-6 xl:p-10 shadow-2xl mb-4 xl:mb-6 flex-1 flex flex-col min-h-0"
                >
                    <div className="flex flex-col flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-2 pb-2 custom-scrollbar">
                        <h2 className="text-xl xl:text-2xl text-white font-bold leading-tight mb-4 xl:mb-6 shrink-0">
                            {renderInlineCode(currentQ.question)}
                        </h2>

                        {currentQ.codeSnippet && (
                            <div className="rounded-2xl overflow-hidden mb-5 border border-white/10 shadow-xl bg-[#0d1117] shrink-0 group relative">
                                <div className="flex items-center px-4 py-3 bg-white/3 border-b border-white/5 relative">
                                    <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="flex gap-1.5 z-10 hover:gap-2 transition cursor-default">
                                        <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                                        <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                                        <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                    </div>
                                    <div className="ml-4 text-[12px] font-mono font-medium text-slate-400 z-10 flex items-center gap-2">
                                        <span className="text-primary/70">⌘</span> snippet.cpp
                                    </div>
                                </div>
                                <div className="p-4 xl:p-6 text-xs xl:text-sm">
                                    <ReactCodeMirror
                                        value={currentQ.codeSnippet}
                                        readOnly={true}
                                        editable={false}
                                        theme={[vscodeDark, EditorView.theme({
                                            "&": { backgroundColor: "transparent !important" },
                                            ".cm-gutters": { backgroundColor: "transparent !important", borderRight: "none !important", color: "rgba(255,255,255,0.3)" },
                                            ".cm-scroller": { fontFamily: "inherit" }
                                        })]}
                                        extensions={[cpp()]}
                                        className="font-mono leading-relaxed tracking-tight bg-transparent!"
                                        basicSetup={{
                                            lineNumbers: true,
                                            foldGutter: false,
                                            highlightActiveLine: false,
                                            highlightSelectionMatches: false,
                                            syntaxHighlighting: true,
                                            drawSelection: false,
                                            dropCursor: false,
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-3 mt-auto shrink-0">
                            {currentQ.options.map((opt: QuizOption, i: number) => {
                                const isSelected = selectedAnswers[currentQ.id] === opt.id;
                                const letters = ['A', 'B', 'C', 'D'];
                                return (
                                    <motion.button
                                        key={opt.id}
                                        onClick={() => onSelectOption(opt.id)}
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
                                                className="absolute inset-0 bg-linear-to-r from-primary/10 to-transparent pointer-events-none"
                                            />
                                        )}

                                        <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 transition duration-300 font-mono font-bold text-sm z-10 ${isSelected
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
                    type="button"
                    onClick={onPrev}
                    disabled={currentQuestionIdx === 0}
                    className="flex items-center gap-2 px-6 py-3.5 xl:py-4 rounded-2xl border border-white/10 bg-slate-900/50 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-0 disabled:pointer-events-none transition font-bold text-sm shadow-lg hover:shadow-xl"
                    aria-label="Enrere">
                    <ChevronLeft size={18} /> <span className="hidden sm:inline">{t('quiz.prev', 'Anterior')}</span>
                </button>

                <div className="flex-1 max-w-xs h-px bg-linear-to-r from-transparent via-white/10 to-transparent hidden md:block" />

                <button type="button"
                    onClick={onNext}
                    disabled={!selectedAnswers[currentQ.id]}
                    className={`flex items-center justify-center gap-2 px-8 xl:px-10 py-3.5 xl:py-4 rounded-2xl font-black uppercase tracking-widest text-xs xl:text-sm transition duration-300 relative overflow-hidden group ${selectedAnswers[currentQ.id]
                        ? 'bg-white text-slate-950 shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:scale-105 active:scale-95'
                        : 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed opacity-50'
                        }`}
                    aria-label="Botó interactiu"
                >
                    {selectedAnswers[currentQ.id] && (
                        <div className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                    )}

                    <span className="relative z-10">{currentQuestionIdx === questionsLength - 1 ? t('quiz.evaluate', 'Avaluar') : t('quiz.next', 'Següent')}</span>
                    {currentQuestionIdx !== questionsLength - 1 && <ChevronRight size={18} className="relative z-10" />}

                    {selectedAnswers[currentQ.id] && (
                        <span className="hidden lg:block absolute bottom-1 right-2 text-[8px] font-bold opacity-30 text-slate-900">
                            ↵ ENTER
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
};
