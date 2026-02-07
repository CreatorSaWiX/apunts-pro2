import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Check, ArrowLeft, Terminal, Code2, Search, Plus, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { topics } from '../data/notes';
import { useAuth } from '../contexts/AuthContext';
import { useSolutions } from '../hooks/useSolutions';

const SolutionsListPage = () => {
    const { id: topicId } = useParams();
    const { solutions, loading } = useSolutions(topicId || '');
    const topic = topics.find(t => t.id === topicId);
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useAuth();

    // Scroll to top
    useEffect(() => {
        window.scrollTo(0, 0);
        document.body.style.overflow = 'auto';
    }, []);

    // Filter solutions based on search query
    const filteredSolutions = solutions.filter(sol =>
        sol.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sol.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!topic) {
        return (
            <div className="min-h-screen pt-24 pb-20 px-4 max-w-5xl mx-auto flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-6 border border-white/5">
                    <Code2 size={32} className="text-slate-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Tema no trobat</h2>
                <p className="text-slate-400 mb-8 max-w-md">No s'ha pogut trobar el tema que estàs buscant. Potser l'enllaç és incorrecte o el tema ha estat eliminat.</p>
                <Link
                    to="/"
                    className="px-6 py-2.5 bg-indigo-500 text-white rounded-xl font-medium hover:bg-indigo-400 transition-colors shadow-lg shadow-indigo-500/20"
                >
                    Tornar a l'inici
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-28 pb-20 px-4 max-w-6xl mx-auto">

            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-12 relative"
            >
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group"
                >
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                    </div>
                    <span className="font-medium">Tornar a l'Inici</span>
                </Link>

                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div className="flex-1">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                            Solucionaris <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Jutge</span>
                        </h1>
                        <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
                            Col·lecció d'exercicis resolts del tema <span className="text-white font-semibold">{topic.title}</span>.
                            Solucions optimitzades, comentades i verificades.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        {/* Search Bar - Ctrl+F style for ID */}
                        <div className="w-full lg:w-80">
                            <div className="relative group">
                                {/* Glow effect */}
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>

                                <div className="relative flex items-center bg-slate-900 border border-white/10 rounded-xl px-4 py-3 focus-within:border-emerald-500/30 transition-colors">
                                    <Search size={18} className="text-slate-500 mr-3" />
                                    <input
                                        type="text"
                                        placeholder="ID de l'exercici (P37500)..."
                                        className="bg-transparent border-none outline-none text-white placeholder-slate-500 w-full text-sm font-medium"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Add Solution Button (Only for logged users) */}
                        {user && (
                            <Link
                                to="/new-solution"
                                className="flex items-center justify-center gap-2 px-5 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors shadow-lg shadow-white/5 whitespace-nowrap"
                            >
                                <Plus size={18} />
                                <span className="hidden sm:inline">Afegir Solució</span>
                            </Link>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Solutions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSolutions.length > 0 ? (
                    filteredSolutions.map((sol, index) => (
                        <motion.div
                            key={sol.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                            <Link
                                to={`/tema/${topicId}/solucionaris/${sol.id}`}
                                className="group relative block h-full"
                            >
                                <div className="h-full bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-white/5 p-6 hover:border-emerald-500/30 hover:bg-slate-800/60 transition-all duration-300 relative overflow-hidden group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] group-hover:translate-y-[-2px]">

                                    {/* Abstract decorative background */}
                                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors pointer-events-none" />

                                    <div className="flex items-start justify-between mb-4 relative z-10">
                                        <div className="bg-slate-800/80 border border-white/5 px-2.5 py-1 rounded-lg text-emerald-400 font-mono text-sm font-semibold group-hover:text-emerald-300 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all">
                                            {sol.id}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/5 px-2 py-1 rounded-full border border-emerald-500/10">
                                            <Check size={10} strokeWidth={4} /> Acceptat
                                        </div>
                                    </div>

                                    <div className="relative z-10">
                                        <h3 className="text-lg font-semibold text-slate-200 group-hover:text-white transition-colors line-clamp-2 mb-4 leading-snug min-h-[3rem]">
                                            {sol.title}
                                        </h3>

                                        <div className="flex items-center justify-between pt-4 border-t border-white/5 group-hover:border-white/10 transition-colors">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                                                <span className="text-xs font-medium text-slate-400 group-hover:text-indigo-300 transition-colors">C++</span>
                                            </div>
                                            <span className="text-xs font-medium text-emerald-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                                                Veure solució <ArrowLeft size={12} className="rotate-180" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="col-span-full py-24 text-center bg-slate-900/30 rounded-3xl border border-white/5 border-dashed"
                    >
                        <div className="w-20 h-20 bg-slate-800/40 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                            <Search size={32} className="text-slate-600" />
                        </div>
                        <h3 className="text-xl font-medium text-white mb-2">No s'han trobat resultats</h3>
                        <p className="text-slate-500 max-w-sm mx-auto">
                            No hi ha cap exercici amb l'ID o títol "{searchQuery}". Comprova que estigui ben escrit.
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default SolutionsListPage;
