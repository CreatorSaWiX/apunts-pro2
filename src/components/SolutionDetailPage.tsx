import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, FileText, ChevronLeft, ChevronRight, CheckCircle, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSolution, useSolutions } from '../hooks/useSolutions';
import CodeBlock from './ui/CodeBlock';

const SolutionDetailPage = () => {
    const { id: topicId, problemId } = useParams();
    const { solution, loading } = useSolution(topicId || '', problemId || '');
    const { solutions } = useSolutions(topicId || '');
    const [authorData, setAuthorData] = useState<{ avatar?: string; username?: string; } | null>(null);

    // Fetch author data if authorId is present
    useEffect(() => {
        const fetchAuthor = async () => {
            if (solution?.authorId) {
                try {
                    // Import doc/getDoc/db needed
                    const { doc, getDoc } = await import('firebase/firestore');
                    const { db } = await import('../lib/firebase');
                    const userDoc = await getDoc(doc(db, 'users', solution.authorId));
                    if (userDoc.exists()) {
                        setAuthorData(userDoc.data());
                    }
                } catch (e) {
                    console.error("Error fetching author:", e);
                }
            }
        };
        fetchAuthor();
    }, [solution]);

    // Find prev/next
    const currentIndex = solutions.findIndex(s => s.id === problemId);
    const prevSolution = currentIndex > 0 ? solutions[currentIndex - 1] : null;
    const nextSolution = currentIndex !== -1 && currentIndex < solutions.length - 1 ? solutions[currentIndex + 1] : null;

    // Scroll to top
    useEffect(() => {
        window.scrollTo(0, 0);
        document.body.style.overflow = 'auto';
    }, [problemId]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center pt-24 pb-20 px-4">
            <div className="flex flex-col items-center gap-4">
                <Loader className="animate-spin text-sky-500" size={32} />
                <p className="text-slate-400 text-sm">Carregant solució...</p>
            </div>
        </div>
    );

    if (!solution) return (
        <div className="min-h-screen flex items-center justify-center pt-24 pb-20 px-4">
            <div className="text-center">
                <h2 className="text-xl font-bold text-white mb-2">Solució no trobada</h2>
                <Link to={`/tema/${topicId}/solucionaris`} className="text-slate-400 hover:text-white transition-colors">
                    Tornar a la llista
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 max-w-[1400px] mx-auto flex flex-col relative z-10">

            {/* Top Navigation Bar */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-between mb-8 pb-4 border-b border-white/5"
            >
                <div className="flex items-center gap-4">
                    <Link
                        to={`/tema/${topicId}/solucionaris`}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-800/50 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/5 hover:border-white/20"
                        title="Tornar a la llista"
                    >
                        <ArrowLeft size={18} />
                    </Link>

                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-emerald-400 font-bold tracking-tight text-lg">
                                {solution.id}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                            <h1 className="text-lg font-bold text-slate-200 truncate max-w-xs sm:max-w-md">
                                {solution.title}
                            </h1>
                            <div className="hidden sm:flex items-center gap-1 ml-2 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                                <CheckCircle size={10} className="fill-current" />
                                <span>Acceptat</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                            {solution.authorId ? (
                                <Link
                                    to={`/profile/${solution.authorId}`}
                                    className="flex items-center gap-2 hover:text-sky-400 transition-colors"
                                >
                                    <img
                                        src={authorData?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${solution.author}`}
                                        alt={authorData?.username || solution.author}
                                        className="w-5 h-5 rounded-full bg-slate-800 object-cover"
                                    />
                                    {authorData?.username || solution.author || 'Anònim'}
                                </Link>
                            ) : (
                                <span className="flex items-center gap-2 text-slate-400 cursor-default">
                                    <img
                                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${solution.author}`}
                                        alt={solution.author}
                                        className="w-5 h-5 rounded-full bg-slate-800"
                                    />
                                    {solution.author || 'Anònim'}
                                </span>
                            )}
                            <span className="w-0.5 h-0.5 rounded-full bg-slate-700"></span>
                            <span className="flex items-center gap-1.5 hover:text-slate-300 transition-colors cursor-default">
                                <Calendar size={12} /> Recent
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        to={prevSolution ? `/tema/${topicId}/solucionaris/${prevSolution.id}` : '#'}
                        className={`p-2.5 rounded-lg border border-white/5 transition-all flex items-center gap-2 ${prevSolution
                            ? 'bg-slate-800/50 hover:bg-white/10 text-slate-400 hover:text-white hover:border-white/10'
                            : 'bg-transparent text-slate-800 border-transparent cursor-not-allowed hidden sm:flex'
                            }`}
                        title={prevSolution ? `Anterior: ${prevSolution.title}` : undefined}
                    >
                        <ChevronLeft size={18} />
                        <span className="text-sm font-medium hidden lg:inline">Anterior</span>
                    </Link>
                    <Link
                        to={nextSolution ? `/tema/${topicId}/solucionaris/${nextSolution.id}` : '#'}
                        className={`p-2.5 rounded-lg border border-white/5 transition-all flex items-center gap-2 ${nextSolution
                            ? 'bg-slate-800/50 hover:bg-white/10 text-slate-400 hover:text-white hover:border-white/10'
                            : 'bg-transparent text-slate-800 border-transparent cursor-not-allowed hidden sm:flex'
                            }`}
                        title={nextSolution ? `Següent: ${nextSolution.title}` : undefined}
                    >
                        <span className="text-sm font-medium hidden lg:inline">Següent</span>
                        <ChevronRight size={18} />
                    </Link>
                </div>
            </motion.div>

            {/* Split View Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full items-start">

                {/* Left Panel: Problem Statement / Info */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="flex flex-col gap-6"
                >
                    <div className="bg-[#1e1e1e] border border-white/5 rounded-2xl overflow-hidden shadow-lg">
                        <div className="px-5 py-3 bg-white/5 border-b border-white/5 flex items-center gap-2">
                            <FileText size={16} className="text-indigo-400" />
                            <span className="text-sm font-medium text-slate-200">Enunciat</span>
                        </div>
                        <div className="p-6 text-slate-300 leading-relaxed text-[15px]">
                            {solution.statement ? (
                                <div dangerouslySetInnerHTML={{ __html: solution.statement }} className="space-y-4" />
                            ) : (
                                <p className="italic text-slate-500">Enunciat no disponible.</p>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Right Panel: Code */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative"
                >
                    <div className="bg-[#1e1e1e] border border-white/5 rounded-2xl overflow-hidden shadow-lg">
                        {/* Cleaner header for Code Block */}
                        <div className="px-5 py-3 bg-white/5 border-b border-white/5 flex items-center justify-between">
                            <span className="text-sm font-mono text-slate-400">{solution.id}.cpp</span>
                            <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">C++</span>
                        </div>

                        <div className="p-0">
                            <CodeBlock
                                code={solution.code}
                                language="cpp"
                                title="" // Hide internal header
                            />
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default SolutionDetailPage;
