import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, GitCommitVertical } from 'lucide-react';
import { useSubject } from '../contexts/SubjectContext';
import { useRegisterSW } from 'virtual:pwa-register/react';

const APP_DATA: Record<string, { version: string; updated: string }> = {
    pro2: { version: 'v1.0.0', updated: '24/02/2026' },
    m1: { version: 'v1.0.0', updated: '24/02/2026' }
};

const letterContainerVariants = {
    hidden: { transition: { staggerChildren: 0.05 } },
    visible: { transition: { staggerChildren: 0.05 } }
};

const letterVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { type: 'spring' as const, damping: 15, stiffness: 40 }
    },
    exit: {
        opacity: 0,
        y: -20,
        filter: 'blur(10px)',
        transition: { duration: 0.2 }
    }
};

const Hero: React.FC = () => {
    const { subject, theme } = useSubject();
    const {
        needRefresh: [needRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r) {
            console.log('SW Registered:', r);
        },
        onRegisterError(error) {
            console.log('SW Registration error:', error);
        }
    });

    const currentData = APP_DATA[subject] || { version: 'v1.0.0', updated: '24/02/2026' };
    return (
        <div className="relative flex flex-col items-center justify-center pt-4 pb-6 z-10 text-center px-4">

            {/* Version Badge & Updates */}
            <AnimatePresence mode="wait">
                {needRefresh ? (
                    <motion.button
                        key="update-badge"
                        onClick={() => updateServiceWorker(true)}
                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 shadow-lg shadow-red-500/10 backdrop-blur-md cursor-pointer group"
                    >
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                        </span>
                        <span className="text-[10px] uppercase tracking-widest text-red-400 font-semibold group-hover:text-red-300 transition-colors">
                            Hi ha una nova versió
                        </span>
                        <RefreshCw size={12} className="text-red-400 group-hover:text-red-300 group-hover:rotate-180 transition-all duration-500 ease-out" />
                    </motion.button>
                ) : (
                    <motion.div
                        key="version-badge"
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="group relative z-50 mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/50 border border-primary/20 shadow-lg shadow-primary/10 backdrop-blur-md cursor-pointer transition-colors duration-300 hover:bg-slate-800/80 hover:border-primary/40 hover:shadow-primary/20"
                    >
                        <GitCommitVertical size={12} className="text-accent group-hover:rotate-12 transition-transform duration-300" />
                        <span className="text-[10px] uppercase tracking-widest text-accent font-semibold transition-colors group-hover:text-white">
                            {subject === 'pro2' ? 'PRO2' : 'M1'} {currentData.version}
                        </span>

                        {/* Tooltip Last Update Date */}
                        <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 px-3 py-2 bg-slate-800/95 backdrop-blur-md text-slate-300 text-[10px] uppercase tracking-wider font-semibold rounded-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 whitespace-nowrap pointer-events-none border border-white/10 shadow-2xl z-50 flex items-center gap-2 flex-row">
                            <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                            </span>
                            <span>Última actualització: <span className="text-white ml-0.5">{currentData.updated}</span></span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Title with Staggered Letters */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={subject}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={letterContainerVariants}
                    className="relative"
                >
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 text-white overflow-visible">
                        <span className="inline-block mr-4">
                            {"APUNTS".split("").map((char, index) => (
                                <motion.span
                                    key={`static-${index}`}
                                    variants={letterVariants}
                                    className="inline-block bg-gradient-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-transparent drop-shadow-2xl"
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </span>

                        <span className="inline-block mr-4">
                            {theme.label.split("").map((char, index) => (
                                <motion.span
                                    key={`dynamic-${subject}-${index}`}
                                    variants={letterVariants}
                                    className="inline-block bg-gradient-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-transparent drop-shadow-2xl"
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </span>
                    </h1>
                </motion.div>
            </AnimatePresence>
        </div >
    );
};

export default Hero;

