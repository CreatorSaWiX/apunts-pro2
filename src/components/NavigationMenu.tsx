import React from 'react';
import { Link } from 'react-router-dom';
import { X, BookOpen, ChevronRight } from 'lucide-react';
import { allPersonalNotes } from 'content-collections';
import { motion } from 'framer-motion';

interface NavigationMenuProps {
    isMenuOpen: boolean;
    setIsMenuOpen: (open: boolean) => void;
    subject: string;
    theme: { label: string };
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({ isMenuOpen, setIsMenuOpen, subject, theme }) => {
    if (!isMenuOpen) return null;

    return (
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
                        <BookOpen size={24} className="text-accent" />
                        Apunts {theme.label}
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
                    {[...allPersonalNotes]
                        .filter(n => (n as any).subject === subject && !n.slug.includes('-lab-'))
                        .sort((a, b) => a.order - b.order)
                        .map((topic, i) => (
                            <Link
                                key={topic.slug}
                                to={`/tema/${topic.slug}`}
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-800/50 border border-transparent hover:border-slate-700/50 transition-all group"
                            >
                                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 text-slate-500 font-mono text-xs group-hover:bg-primary group-hover:text-white transition-colors">
                                    {(() => {
                                        const match = topic.title.match(/^Tema (\d+)/);
                                        if (match) return match[1];
                                        if (topic.title.toLowerCase().includes('parcial')) return 'P1';
                                        if (topic.title.toLowerCase().includes('final')) return 'EF';
                                        return i + 1;
                                    })()}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-slate-300 font-medium group-hover:text-white transition-colors truncate">
                                        {topic.title}
                                    </h4>
                                </div>
                                <ChevronRight size={16} className="text-slate-600 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all" />
                            </Link>
                        ))}

                    {[...allPersonalNotes].some(n => (n as any).subject === subject && n.slug.includes('-lab-')) && (
                        <>
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2 mt-8">Laboratoris</div>
                            {[...allPersonalNotes]
                                .filter(n => (n as any).subject === subject && n.slug.includes('-lab-'))
                                .sort((a, b) => a.order - b.order)
                                .map((topic, i) => (
                                    <Link
                                        key={topic.slug}
                                        to={`/tema/${topic.slug}`}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-800/50 border border-transparent hover:border-slate-700/50 transition-all group"
                                    >
                                        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 text-slate-500 font-mono text-xs group-hover:bg-primary group-hover:text-white transition-colors">
                                            L{i + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-slate-300 font-medium group-hover:text-white transition-colors truncate">
                                                {topic.title}
                                            </h4>
                                        </div>
                                        <ChevronRight size={16} className="text-slate-600 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all" />
                                    </Link>
                                ))}
                        </>
                    )}
                </div>

                <div className="p-4 border-t border-white/5 text-center text-xs text-slate-600">
                    Fet amb ❤️ per a la FIB
                </div>
            </motion.div>
        </>
    );
};

export default NavigationMenu;
