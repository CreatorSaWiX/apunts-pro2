import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

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
    }
};

const Hero: React.FC = () => {
    return (
        <div className="relative flex flex-col items-center justify-center pt-4 pb-6 z-10 text-center px-4">

            {/* Version Badge */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/50 border border-sky-500/20 shadow-lg shadow-sky-500/10 backdrop-blur-md"
            >
                <Sparkles size={12} className="text-sky-400" />
                <span className="text-[10px] uppercase tracking-widest text-sky-300 font-semibold">
                    Edició 2026
                </span>
            </motion.div>

            {/* Main Title with Staggered Letters */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={letterContainerVariants}
                className="relative"
            >
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 text-white overflow-visible">
                    <span className="inline-block mr-4">
                        {"APUNTS".split("").map((char, index) => (
                            <motion.span
                                key={index}
                                variants={letterVariants}
                                className="inline-block bg-gradient-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-transparent drop-shadow-2xl"
                            >
                                {char}
                            </motion.span>
                        ))}
                    </span>
                    <span className="inline-block mr-4">
                        {"PRO2".split("").map((char, index) => (
                            <motion.span
                                key={index}
                                variants={letterVariants}
                                className="inline-block bg-gradient-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-transparent drop-shadow-2xl"
                            >
                                {char}
                            </motion.span>
                        ))}
                    </span>
                </h1>
            </motion.div>
        </div>
    );
};

export default Hero;

