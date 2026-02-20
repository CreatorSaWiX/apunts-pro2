import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useSubject } from '../contexts/SubjectContext';

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
    return (
        <div className="relative flex flex-col items-center justify-center pt-4 pb-6 z-10 text-center px-4">

            {/* Version Badge */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/50 border border-primary/20 shadow-lg shadow-primary/10 backdrop-blur-md"
            >
                <Sparkles size={12} className="text-accent" />
                <span className="text-[10px] uppercase tracking-widest text-accent font-semibold">
                    Edició 2026
                </span>
            </motion.div>

            {/* Main Title with Staggered Letters */}
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

