import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, X, BookOpen, ChevronRight, Menu } from 'lucide-react';
import { topics } from '../data/notes';
import { motion, AnimatePresence } from 'framer-motion';

const Navigation: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    return (
        <>
            {/* Top-Left Floating Navigation Pill */}
            <div className="fixed top-6 left-6 z-50">
                <div className="flex items-center p-1.5 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl transition-all hover:bg-slate-900/80">
                    <Link
                        to="/"
                        className={`p-2.5 rounded-full transition-all ${location.pathname === '/' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        title="Inici"
                    >
                        <Home size={20} />
                    </Link>

                    <div className="w-px h-5 bg-white/10 mx-1" />

                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="p-2.5 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                        title="Obrir Menú"
                    >
                        <Menu size={20} />
                    </button>
                </div>
            </div>

            {/* Menu Drawer - Slides from LEFT */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                            onClick={() => setIsMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 h-full w-[85vw] md:w-[400px] bg-slate-900 border-r border-white/10 shadow-2xl z-50 flex flex-col"
                        >
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-950/50">
                                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                    <BookOpen size={24} className="text-sky-400" />
                                    Apunts PRO2
                                </h3>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Temari del Curs</div>
                                {topics.map((topic, i) => (
                                    <Link
                                        key={topic.id}
                                        to={`/tema/${topic.id}`}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-800/50 border border-transparent hover:border-slate-700/50 transition-all group"
                                    >
                                        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 text-slate-500 font-mono text-xs group-hover:bg-sky-500 group-hover:text-white transition-colors">
                                            {i + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-slate-300 font-medium group-hover:text-white transition-colors truncate">
                                                {topic.title}
                                            </h4>
                                        </div>
                                        <ChevronRight size={16} className="text-slate-600 group-hover:text-sky-500 opacity-0 group-hover:opacity-100 transition-all" />
                                    </Link>
                                ))}
                            </div>

                            <div className="p-4 border-t border-white/5 text-center text-xs text-slate-600">
                                Fet amb ❤️ per a la FIB
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navigation;
