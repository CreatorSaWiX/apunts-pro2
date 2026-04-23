import { useState, useEffect } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, FileText, LayoutList, CheckCircle2, X } from 'lucide-react';
import type { Solution } from '../../content/data/solutions';
import type { TopicDefinition } from '../../content/data/courseStructure';
import { MarkdownRenderer } from '../../markdown/MarkdownRenderer';

interface NotebookLayoutProps {
    topic: TopicDefinition;
    solutions: Solution[];
    loading: boolean;
}

const NotebookLayout = ({ topic, solutions, loading }: NotebookLayoutProps) => {
    // 1. Sidebar selection state
    const STORAGE_KEY = `notebook-last-problem-${topic.id}`;
    const [selectedProblemId, _setSelectedProblemId] = useState<string | null>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && topic.problems.some(p => (typeof p === 'string' ? p : p.id) === stored)) {
            return stored;
        }
        return null;
    });

    const setSelectedProblemId = (id: string) => {
        _setSelectedProblemId(id);
        localStorage.setItem(STORAGE_KEY, id);
    };

    const [availablePdfs, setAvailablePdfs] = useState<{ ca: boolean; es: boolean }>({ ca: false, es: false });
    const [isPdfMenuOpen, setIsPdfMenuOpen] = useState(false);

    // Initialize with first problem if available OR nothing fetched
    useEffect(() => {
        if (topic.problems.length > 0 && !selectedProblemId) {
            const firstId = typeof topic.problems[0] === 'string' ? topic.problems[0] : topic.problems[0].id;
            setSelectedProblemId(firstId);
        }
    }, [topic, selectedProblemId]);

    // Check for PDFs
    useEffect(() => {
        const subject = topic.id.split('-')[0];
        const checkPdfs = async () => {
            try {
                const [caRes, esRes] = await Promise.all([
                    fetch(`/pdfs/solucionaris/${subject}/ca/solucionari-${topic.id}.pdf`, { method: 'HEAD' }),
                    fetch(`/pdfs/solucionaris/${subject}/es/solucionari-${topic.id}.pdf`, { method: 'HEAD' })
                ]);

                const isValidPdf = (res: Response) => {
                    return res.ok && res.headers.get('content-type')?.includes('application/pdf');
                };

                setAvailablePdfs({
                    ca: !!isValidPdf(caRes),
                    es: !!isValidPdf(esRes)
                });
            } catch (e) {
                console.error("Error comprovant PDFs de solucionaris", e);
                setAvailablePdfs({ ca: false, es: false });
            }
        };
        checkPdfs();
    }, [topic.id]);

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
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            const prev = topic.problems[currentIndex - 1];
            setSelectedProblemId(typeof prev === 'string' ? prev : prev.id);
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
                <div className="flex flex-col md:flex-row md:items-stretch justify-between gap-8 mb-4 relative">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight mb-2">
                            {topic.title}
                        </h1>
                        <p className="text-slate-400 text-sm md:text-lg font-medium opacity-70 max-w-4xl">
                            {topic.description}
                        </p>
                    </div>

                    {/* PDF Large Square Button - Right Aligned */}
                    {(availablePdfs.ca || availablePdfs.es) && (
                        <div className="relative shrink-0 self-center md:self-stretch flex items-center">
                            <button
                                onClick={() => setIsPdfMenuOpen(!isPdfMenuOpen)}
                                className="flex flex-col items-center justify-center gap-2 px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl border transition-all select-none bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-300 shadow-xl shadow-red-950/20 group min-w-[100px] h-full max-h-[100px]"
                            >
                                <FileText size={28} className="group-hover:scale-110 transition-transform duration-300" />
                                <span>PDF</span>
                            </button>

                            <AnimatePresence>
                                {isPdfMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className="absolute right-0 top-full mt-3 w-56 bg-[#0b1221]/90 backdrop-blur-xl border border-red-500/20 rounded-2xl shadow-[0_20px_50px_-12px_rgba(239,68,68,0.3)] z-50 overflow-hidden"
                                    >
                                        <div className="p-4 border-b border-red-500/10 flex justify-between items-center">
                                            <span className="text-[10px] text-red-400/70 font-bold uppercase tracking-widest">Idioma Solucionari</span>
                                            <button onClick={() => setIsPdfMenuOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                                                <X size={16} />
                                            </button>
                                        </div>
                                        <div className="p-2">
                                            {availablePdfs.ca && (
                                                <a
                                                    href={`/pdfs/solucionaris/${topic.id.split('-')[0]}/ca/solucionari-${topic.id}.pdf`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={() => setIsPdfMenuOpen(false)}
                                                    className="flex items-center gap-4 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-red-500/10 rounded-xl transition-all group"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                                                        <span className="text-xs font-bold text-red-400">CA</span>
                                                    </div>
                                                    <span>Català</span>
                                                </a>
                                            )}
                                            {availablePdfs.es && (
                                                <a
                                                    href={`/pdfs/solucionaris/${topic.id.split('-')[0]}/es/solucionari-${topic.id}.pdf`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={() => setIsPdfMenuOpen(false)}
                                                    className="flex items-center gap-4 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-red-500/10 rounded-xl transition-all group"
                                                >
                                                    <div className="w-4 h-8 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                                                        <span className="text-xs font-bold text-red-400">ES</span>
                                                    </div>
                                                    <span>Español</span>
                                                </a>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
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
                                        <div className="p-8 md:p-12 relative overflow-hidden">
                                            {/* Decorative Background Element */}
                                            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                                            <div className="flex flex-col gap-2 mb-8">
                                                <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight leading-tight">
                                                    {selectedProblemTitle}
                                                </h2>
                                            </div>

                                            <div className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed font-sans mb-12 relative z-10">
                                                {currentSolution?.statement ? (
                                                    <div className="markdown-statement">
                                                        <MarkdownRenderer content={currentSolution.statement} />
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-3 text-slate-500 bg-slate-900/50 border border-white/5 p-4 rounded-xl">
                                                        <FileText size={20} className="opacity-50" />
                                                        <p className="italic text-sm m-0">
                                                            L'enunciat no està disponible actualment.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Solution Content */}
                                            {currentSolution ? (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.1 }}
                                                    className="bg-slate-900/80 rounded-2xl p-6 md:p-10 border border-emerald-500/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] relative"
                                                >
                                                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-emerald-500/5 to-transparent rounded-t-2xl pointer-events-none"></div>

                                                    <div className="text-slate-200 relative z-10">
                                                        {currentSolution.content ? (
                                                            <div className="prose prose-invert prose-emerald max-w-none heading-reset text-lg">
                                                                <MarkdownRenderer content={currentSolution.content} />
                                                            </div>
                                                        ) : (
                                                            <div className="font-mono text-sm">
                                                                {currentSolution.code ? (
                                                                    <div className="p-4 bg-black/60 rounded-xl text-slate-300 whitespace-pre overflow-x-auto border border-white/5">
                                                                        {currentSolution.code}
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex gap-3 text-slate-500 items-center justify-center p-8 bg-black/20 rounded-xl border border-white/5">
                                                                        <CheckCircle2 size={18} className="opacity-40" />
                                                                        <span className="italic text-sm">Aquesta solució encara està buida.</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center py-16 text-slate-500 bg-slate-900/40 rounded-2xl border border-dashed border-white/10">
                                                    <FileText size={48} className="mb-4 opacity-20" />
                                                    <p className="text-sm">Encara no hi ha una proposta de resolució penjada.</p>
                                                </div>
                                            )}
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
