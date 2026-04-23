import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Check, Code2, ExternalLink, FileText, X } from 'lucide-react';
import { useSolutions } from '../hooks/useSolutions';
import { courseStructure } from '../content/data/courseStructure';
import NotebookLayout from '../components/layout/NotebookLayout';
import { useLanguage } from '../contexts/LanguageContext';

const SolutionsListPage = () => {
    const { id: topicId } = useParams();
    const [searchQuery, setSearchQuery] = useState('');
    const { preferredLang } = useLanguage();
    
    const [availablePdfs, setAvailablePdfs] = useState<{ ca: boolean; es: boolean }>({ ca: false, es: false });
    const [isPdfMenuOpen, setIsPdfMenuOpen] = useState(false);

    // 1. Get definitions for the current topic from our static structure
    const topicDefinition = courseStructure.find(t => t.id === topicId);
    
    // We pass the explicit problem IDs so they are searched globally (not just constrained by topicId namespace)
    const predefinedProblemIds = topicDefinition?.problems?.map(p => p.id) || [];
    const { solutions: uploadedSolutions, loading } = useSolutions(topicId || '', predefinedProblemIds);

    // Scroll to top
    useEffect(() => {
        window.scrollTo(0, 0);
        document.body.style.overflow = 'auto';

        if (topicId) {
            const subject = topicId.split('-')[0];
            const checkPdfs = async () => {
                try {
                    const [caRes, esRes] = await Promise.all([
                        fetch(`/pdfs/solucionaris/${subject}/ca/solucionari-${topicId}.pdf`, { method: 'HEAD' }),
                        fetch(`/pdfs/solucionaris/${subject}/es/solucionari-${topicId}.pdf`, { method: 'HEAD' })
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
        }
    }, [topicId]);

    // 2. M1 & M2 Special Layout Check
    if ((topicId?.startsWith('m1-') || topicId?.startsWith('m2-')) && topicDefinition) {
        return <NotebookLayout topic={topicDefinition} solutions={uploadedSolutions} loading={loading} />;
    }

    // 2. Identify problems associated with this topic
    // problemsList is now an array of { id, title }
    const problemsList = topicDefinition?.problems || [];

    // Helper to check status
    const getProblemStatus = (problemId: string) => {
        // Check if we have a solution uploaded for this ID
        const solution = uploadedSolutions.find(s => s.id === problemId);
        return solution ? { status: 'solved', solution } : { status: 'pending', solution: null };
    };

    // Filter based on search (Structure-based)
    const visibleProblems = problemsList.filter(problem => {
        const pId = problem.id;
        const pTitle = problem.title;

        return pId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            // Also search in uploaded solution title if we have one (legacy override)
            uploadedSolutions.find(s => s.id === pId)?.title.toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Fallback: If we rely on uploaded solutions (unstructured topics)
    const displaySolutionsFallback = problemsList.length === 0
        ? uploadedSolutions.filter(s => s.id.toLowerCase().includes(searchQuery.toLowerCase()) || s.title.toLowerCase().includes(searchQuery.toLowerCase()))
        : [];

    if (!topicDefinition && !loading && uploadedSolutions.length === 0) {
        return (
            <div className="min-h-screen pt-24 pb-20 px-4 max-w-5xl mx-auto flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-6 border border-white/5">
                    <Code2 size={32} className="text-slate-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Tema no trobat o buit</h2>
                <Link to="/" className="mt-4 px-6 py-2.5 bg-indigo-500 text-white rounded-xl font-medium hover:bg-indigo-400 transition-colors">
                    Tornar a l'inici
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-28 pb-20 px-4 max-w-6xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-12 relative"
            >
                <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group">
                    <ArrowLeft size={16} /> <span className="font-medium">Tornar a l'Inici</span>
                </Link>

                <div className="flex flex-col md:flex-row md:items-stretch justify-between gap-8 mb-8 relative">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                            {(preferredLang === 'es' && topicDefinition?.title_es) ? topicDefinition.title_es : (topicDefinition?.title || 'Llista de Problemes')}
                        </h1>
                        <p className="text-slate-400 text-lg max-w-4xl leading-relaxed opacity-70 font-medium">
                            {(preferredLang === 'es' && topicDefinition?.description_es) ? topicDefinition.description_es : (topicDefinition?.description || `Col·lecció d'exercicis del tema ${topicId}.`)}
                        </p>
                    </div>

                    {/* PDF Large Square Button - Right Aligned */}
                    {(availablePdfs.ca || availablePdfs.es) && (
                        <div className="relative shrink-0 self-center md:self-stretch flex items-center">
                            <button 
                                onClick={() => setIsPdfMenuOpen(!isPdfMenuOpen)}
                                className="flex flex-col items-center justify-center gap-2 px-8 py-6 text-xs font-black uppercase tracking-[0.2em] rounded-2xl border transition-all select-none bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-300 shadow-xl shadow-red-950/20 group min-w-[120px] h-full max-h-[120px]"
                            >
                                <FileText size={32} className="group-hover:scale-110 transition-transform duration-300" />
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
                                            {availablePdfs.ca && topicId && (
                                                <a 
                                                    href={`/pdfs/solucionaris/${topicId.split('-')[0]}/ca/solucionari-${topicId}.pdf`}
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
                                            {availablePdfs.es && topicId && (
                                                <a 
                                                    href={`/pdfs/solucionaris/${topicId.split('-')[0]}/es/solucionari-${topicId}.pdf`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={() => setIsPdfMenuOpen(false)}
                                                    className="flex items-center gap-4 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-red-500/10 rounded-xl transition-all group"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
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
                    <div className="w-full lg:w-80">
                        <div className="relative flex items-center bg-slate-900 border border-white/10 rounded-xl px-4 py-3 focus-within:border-emerald-500/30 transition-colors">
                            <Search size={18} className="text-slate-500 mr-3" />
                            <input
                                type="text"
                                placeholder="Buscar ID (P12345)..."
                                className="bg-transparent border-none outline-none text-white w-full text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Problems List based on Structure */}
            {problemsList.length > 0 ? (
                loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-44 rounded-3xl bg-slate-800/20 border border-white/5 animate-pulse relative overflow-hidden">
                                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                            </div>
                        ))}
                    </div>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visibleProblems.map((problem, index) => {
                        const { id: problemId } = problem;
                        const problemTitle = (preferredLang === 'es' && problem.title_es) ? problem.title_es : problem.title;
                        const { status, solution } = getProblemStatus(problemId);
                        const isSolved = status === 'solved';

                        return (
                            <motion.div
                                key={problemId}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <Link
                                    to={`/tema/${topicId}/solucionaris/${problemId}`}
                                    className="group relative block h-full"
                                >
                                    <div className={`h-full backdrop-blur-sm rounded-3xl border p-6 transition-all duration-300 relative overflow-hidden group-hover:shadow-2xl group-hover:-translate-y-1 group-active:scale-95
                                        ${isSolved
                                            ? 'bg-linear-to-br from-slate-900/80 to-slate-800/80 border-emerald-500/30 hover:border-emerald-400/60 hover:shadow-emerald-500/10'
                                            : 'bg-slate-900/40 border-white/5 hover:border-white/20 hover:bg-slate-800/40 opacity-90 hover:opacity-100'
                                        }
                                    `}>
                                        {/* Decorative glow for solved problems */}
                                        {isSolved && (
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none transition-transform duration-700 ease-out group-hover:scale-150" />
                                        )}

                                        <div className="relative z-10 flex items-start justify-between mb-4">
                                            {(() => {
                                                const isJutgeId = /^[A-Z0-9]{6}$/.test(problemId) && topicId?.startsWith('pro2-');
                                                const jutgeUrl = isJutgeId ? `https://jutge.org/problems/${problemId}` : undefined;
                                                
                                                if (jutgeUrl) {
                                                    return (
                                                        <button 
                                                            onClick={(e) => {
                                                                e.preventDefault(); 
                                                                window.open(jutgeUrl, '_blank', 'noopener,noreferrer');
                                                            }}
                                                            className={`px-2.5 py-1 rounded-lg font-mono text-sm font-bold border transition-all shadow-sm flex items-center gap-1.5 hover:-translate-y-0.5
                                                                ${isSolved ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-400' : 'bg-slate-800 text-slate-400 border-white/10 hover:bg-slate-700 hover:text-white'}
                                                            `}
                                                            title="Obrir problema al Jutge"
                                                        >
                                                            {problemId}
                                                            <ExternalLink size={14} className="opacity-70" />
                                                        </button>
                                                    );
                                                }
                                                
                                                return (
                                                    <div className={`px-2.5 py-1 rounded-lg font-mono text-sm font-bold border transition-colors shadow-sm
                                                        ${isSolved ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-white/10'}
                                                    `}>
                                                        {problemId}
                                                    </div>
                                                );
                                            })()}
                                            {isSolved ? (
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1.5 rounded-full border border-emerald-500/20 shadow-sm backdrop-blur-md">
                                                    <Check size={12} strokeWidth={3} /> Fet
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-800/50 px-2.5 py-1.5 rounded-full border border-white/5">
                                                    Pendent
                                                </div>
                                            )}
                                        </div>

                                        <h3 className={`text-lg font-semibold mb-2 line-clamp-2 transition-colors ${isSolved ? 'text-slate-200 group-hover:text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>
                                            {problemTitle || solution?.title || problemId}
                                        </h3>

                                        <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-xs">
                                            <span className={`${isSolved ? 'text-emerald-400/80' : 'text-slate-600'} group-hover:text-white transition-colors`}>
                                                {isSolved ? 'Veure solució' : 'Llegir enunciat'}
                                            </span>
                                            {isSolved && <ArrowLeft size={12} className="rotate-180 text-emerald-500 group-hover:translate-x-1 transition-transform" />}
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
                )
            ) : (
                /* Fallback for unstructured topics */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displaySolutionsFallback.length > 0 ? displaySolutionsFallback.map(sol => (
                        <motion.div key={sol.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <Link to={`/tema/${topicId}/solucionaris/${sol.id}`} className="block p-6 bg-slate-900 border border-white/10 rounded-2xl hover:border-emerald-500/50 transition-colors">
                                <h3 className="text-white font-bold">{sol.title}</h3>
                                <p className="text-emerald-400 text-sm">{sol.id}</p>
                            </Link>
                        </motion.div>
                    )) : (
                        <div className="col-span-full text-center py-20 text-slate-500">
                            <p>No hi ha problemes definits per a aquest tema.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SolutionsListPage;
