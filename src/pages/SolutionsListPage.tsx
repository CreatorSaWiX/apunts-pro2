import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Search, Check, Code2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSolutions } from '../hooks/useSolutions';
import { courseStructure } from '../content/data/courseStructure';
import NotebookLayout from '../components/layout/NotebookLayout';

const SolutionsListPage = () => {
    const { id: topicId } = useParams();
    const { solutions: uploadedSolutions, loading } = useSolutions(topicId || '');
    const [searchQuery, setSearchQuery] = useState('');

    // 1. Get definitions for the current topic from our static structure
    const topicDefinition = courseStructure.find(t => t.id === topicId);

    // 2. M1 Special Layout Check
    if (topicId?.startsWith('m1-') && topicDefinition) {
        return <NotebookLayout topic={topicDefinition} solutions={uploadedSolutions} loading={loading} />;
    }

    // 2. Identify problems associated with this topic
    // problemsList is now an array of { id, title }
    const problemsList = topicDefinition?.problems || [];

    // Scroll to top
    useEffect(() => {
        window.scrollTo(0, 0);
        document.body.style.overflow = 'auto';
    }, []);

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

                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div className="flex-1">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                            {topicDefinition?.title || 'Llista de Problemes'}
                        </h1>
                        <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
                            {topicDefinition?.description || `Col·lecció d'exercicis del tema ${topicId}.`}
                        </p>
                    </div>

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visibleProblems.map((problem, index) => {
                        const { id: problemId, title: problemTitle } = problem;
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
                                    <div className={`h-full backdrop-blur-sm rounded-2xl border p-6 transition-all duration-300 relative overflow-hidden group-hover:shadow-lg group-hover:-translate-y-1 pl-6
                                        ${isSolved
                                            ? 'bg-slate-900/40 border-emerald-500/20 hover:border-emerald-500/40 hover:bg-slate-800/60'
                                            : 'bg-slate-900/20 border-white/5 hover:border-white/10 hover:bg-slate-900/40 opacity-80 hover:opacity-100'
                                        }
                                    `}>
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`px-2.5 py-1 rounded-lg font-mono text-sm font-bold border transition-colors
                                                ${isSolved ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-400 border-white/5'}
                                            `}>
                                                {problemId}
                                            </div>
                                            {isSolved && (
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/5 px-2 py-1 rounded-full border border-emerald-500/10">
                                                    <Check size={10} strokeWidth={4} /> Fet
                                                </div>
                                            )}
                                            {!isSolved && (
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-500/10 px-2 py-1 rounded-full border border-white/5">
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
