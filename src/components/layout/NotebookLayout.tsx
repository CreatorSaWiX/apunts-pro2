import { useState, useEffect } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, FileText, LayoutList, CheckCircle2 } from 'lucide-react';
import type { Solution } from '../../content/data/solutions';
import type { TopicDefinition } from '../../content/data/courseStructure';
import CommentsSection from '../comments/CommentsSection';
import { MarkdownRenderer } from '../../markdown/MarkdownRenderer';

interface NotebookLayoutProps {
    topic: TopicDefinition;
    solutions: Solution[];
    loading: boolean;
}

const NotebookLayout = ({ topic, solutions, loading }: NotebookLayoutProps) => {
    // 1. Sidebar selection state
    const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);
    const [showSolution, setShowSolution] = useState(false);

    // Initialize with first problem if available
    useEffect(() => {
        if (topic.problems.length > 0 && !selectedProblemId) {
            const firstId = typeof topic.problems[0] === 'string' ? topic.problems[0] : topic.problems[0].id;
            setSelectedProblemId(firstId);
        }
    }, [topic, selectedProblemId]);

    if (loading && solutions.length === 0) {
        return (
            <div className="min-h-screen pt-24 pb-20 px-4 flex items-center justify-center">
                <div className="text-slate-500 animate-pulse">Carregant exercicis...</div>
            </div>
        );
    }

    // Derived states
    const selectedProblemDef = topic.problems.find(p => (typeof p === 'string' ? p : p.id) === selectedProblemId);
    const selectedProblemTitle = selectedProblemDef ? (typeof selectedProblemDef === 'string' ? selectedProblemDef : selectedProblemDef.title) : '';

    // Find the current solution data (if any)
    const currentSolution = solutions.find(s => s.id === selectedProblemId);

    // Find index for navigation
    const currentIndex = topic.problems.findIndex(p => (typeof p === 'string' ? p : p.id) === selectedProblemId);

    const handleNext = () => {
        if (currentIndex < topic.problems.length - 1) {
            const next = topic.problems[currentIndex + 1];
            setSelectedProblemId(typeof next === 'string' ? next : next.id);
            setShowSolution(false);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            const prev = topic.problems[currentIndex - 1];
            setSelectedProblemId(typeof prev === 'string' ? prev : prev.id);
            setShowSolution(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 max-w-[1600px] mx-auto flex flex-col relative z-10">
            {/* Header / Breadcrumb - Compact Row */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 pl-2 shrink-0"
            >
                <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight whitespace-nowrap">
                        {topic.title}
                    </h1>
                    <p className="text-slate-400 text-sm md:text-base truncate max-w-full md:max-w-3xl">{topic.description}</p>
                </div>
            </motion.div>

            {/* Content Area: Main Layout */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">

                {/* 1. Sidebar / Navigation (Left) - Sticky on Desktop */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="w-full lg:w-80 flex flex-col bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md shrink-0 lg:sticky lg:top-24"
                >
                    <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-200 font-medium">
                            <LayoutList size={18} />
                            <span>Exercicis</span>
                        </div>
                        <span className="text-xs text-slate-500 font-mono bg-black/20 px-2 py-0.5 rounded">
                            {topic.problems.length}
                        </span>
                    </div>

                    <div className="max-h-[300px] lg:max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar p-2 space-y-1">
                        {topic.problems.map((prob, idx) => {
                            const pId = typeof prob === 'string' ? prob : prob.id;
                            const pTitle = typeof prob === 'string' ? prob : prob.title;
                            const isActive = pId === selectedProblemId;

                            // Debug check
                            const s = solutions.find(s => s.id === pId);
                            const isSolved = !!s;

                            return (
                                <button
                                    key={pId}
                                    onClick={() => {
                                        setSelectedProblemId(pId);
                                        setShowSolution(false);
                                        // Scroll to top of content
                                        const el = document.getElementById('problem-content');
                                        if (el) {
                                            const yOffset = -100; // Offset for header
                                            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                                            window.scrollTo({ top: y, behavior: 'smooth' });
                                        }
                                    }}
                                    className={`w-full text-left px-3 py-3 rounded-lg flex items-start gap-3 transition-all relative group
                                        ${isActive
                                            ? 'bg-indigo-500/10 text-indigo-200 shadow-[inset_2px_0_0_0_#6366f1]'
                                            : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                                        }
                                    `}
                                >
                                    <span className={`text-xs font-mono font-bold mt-0.5 w-6 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-600'}`}>
                                        {(idx + 1).toString().padStart(2, '0')}
                                    </span>
                                    <span className="text-sm font-medium line-clamp-2 leading-relaxed">
                                        {pTitle}
                                    </span>
                                    {isSolved && (
                                        <CheckCircle2 size={12} className="ml-auto mt-1 text-emerald-500/50 shrink-0" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </motion.div>

                {/* 2. Main Exercise View (Right) */}
                <div id="problem-content" className="flex-1 flex flex-col relative min-w-0">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={selectedProblemId || 'empty'}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="flex-1 flex flex-col bg-slate-900/30 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm relative"
                        >
                            {selectedProblemId ? (
                                <>
                                    {/* Content Container (No internal scroll) */}
                                    <div className="flex-1">

                                        {/* Statement Section */}
                                        <div className="p-8 md:p-12 border-b border-white/5">
                                            <div className="flex items-center gap-3 mb-6">
                                                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-bold border border-indigo-500/30 font-mono tracking-wider">
                                                    {selectedProblemId}
                                                </span>
                                            </div>

                                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 tracking-tight leading-tight">
                                                {selectedProblemTitle}
                                            </h2>

                                            <div className="prose prose-invert prose-lg max-w-none text-slate-300 leading-loose">
                                                {currentSolution?.statement ? (
                                                    <div className="markdown-statement">
                                                        <MarkdownRenderer content={currentSolution.statement} />
                                                    </div>
                                                ) : (
                                                    <p className="italic text-slate-500">
                                                        Enunciat no disponible pel moment.
                                                        {import.meta.env.DEV && <span className="text-xs ml-2 opacity-50 block mt-2 font-mono">(Debug: ID: {selectedProblemId}, Solved: {!!currentSolution}, Sols loaded: {solutions.length})</span>}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Solution Section (Toggle) */}
                                        <div className="p-8 md:p-12 bg-black/20 min-h-[300px]">
                                            <div className="flex items-center justify-between mb-6">
                                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                                    Solució
                                                </h3>
                                                <button
                                                    onClick={() => setShowSolution(!showSolution)}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border
                                                        ${showSolution
                                                            ? 'bg-slate-800 text-slate-300 border-white/10 hover:bg-slate-700'
                                                            : 'bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-500 shadow-lg shadow-emerald-500/20'
                                                        }
                                                    `}
                                                >
                                                    {showSolution ? 'Amagar' : 'Mostrar Solució'}
                                                </button>
                                            </div>

                                            <AnimatePresence>
                                                {showSolution && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="bg-slate-800/50 rounded-xl p-6 border border-white/5 shadow-inner">
                                                            {/* Solution Content */}
                                                            {currentSolution ? (
                                                                <div className="text-slate-300">
                                                                    {currentSolution.content ? (
                                                                        <div className="prose prose-invert prose-emerald max-w-none heading-reset">
                                                                            <MarkdownRenderer content={currentSolution.content} />
                                                                        </div>
                                                                    ) : (
                                                                        <div className="font-mono text-sm">
                                                                            {currentSolution.code ? (
                                                                                <div className="p-4 bg-black/40 rounded-lg text-slate-300 whitespace-pre overflow-x-auto">
                                                                                    {currentSolution.code}
                                                                                </div>
                                                                            ) : (
                                                                                <p className="italic text-slate-500">Solució pendent.</p>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                                                                    <FileText size={48} className="mb-4 opacity-20" />
                                                                    <p>Encara no hi ha solució disponible.</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Comments Section */}
                                        <div className="p-8 md:p-12 bg-slate-900/40 border-t border-white/5">
                                            <CommentsSection
                                                solutionId={selectedProblemId || ''}
                                                solutionTitle={selectedProblemTitle}
                                            />
                                        </div>
                                    </div>

                                    {/* Footer Navigation */}
                                    <div className="p-4 border-t border-white/5 bg-slate-900/80 backdrop-blur-md flex justify-between items-center shrink-0">
                                        <button
                                            onClick={handlePrev}
                                            disabled={currentIndex === 0}
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronLeft size={18} />
                                            <span className="hidden sm:inline font-medium">Anterior</span>
                                        </button>

                                        <span className="text-xs text-slate-500 font-mono">
                                            {currentIndex + 1} / {topic.problems.length}
                                        </span>

                                        <button
                                            onClick={handleNext}
                                            disabled={currentIndex === topic.problems.length - 1}
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <span className="hidden sm:inline font-medium">Següent</span>
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-500 min-h-[400px]">
                                    <p>Selecciona un exercici per començar</p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default NotebookLayout;
