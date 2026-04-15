import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, GitCommitVertical, Github, Heart, X, ChevronRight } from 'lucide-react';
import { useSubject } from '../contexts/SubjectContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface Contributor {
    uid: string;
    username: string;
    role: string;
    avatar: string;
}

const APP_DATA: Record<string, { version: string; updated: string }> = {
    pro2: { version: 'v1.4.0', updated: '15/04/2026' },
    m1: { version: 'v1.4.1', updated: '15/04/2026' },
    m2: { version: 'v1.2.2', updated: '15/04/2026' }
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
    const { preferredLang } = useLanguage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [contributors, setContributors] = useState<Contributor[]>([]);
    const [isLoadingContributors, setIsLoadingContributors] = useState(false);

    const openContributors = async () => {
        setIsModalOpen(true);
        if (contributors.length > 0) return; // ja les hem carregat

        setIsLoadingContributors(true);
        const uids = ["jV5Y63M77PcqIcOUCpLz76GTYMI3", "tHrqAkSatrV6FVcgfdSErLjyXL12",
            "YU5QuXAZ47dslUX8ruyriHHPfh82", "9Z17ChM52YVGsyrIp6gH3ymjEfZ2"];
        const fetched: Contributor[] = [];

        for (const uid of uids) {
            try {
                const userDoc = await getDoc(doc(db, "users", uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    fetched.push({
                        uid,
                        username: data.username || "Usuari",
                        role: data.role || (preferredLang === 'es' ? "Colaborador" : "Col·laborador"),
                        avatar: data.avatar || ""
                    });
                }
            } catch (e) { console.error("Error carregant col·laboradors", e); }
        }
        setContributors(fetched);
        setIsLoadingContributors(false);
    };

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

    const currentData = APP_DATA[subject];
    return (
        <div className="relative flex flex-col items-center justify-center pt-12 pb-4 z-10 text-center px-4">

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
                            {subject.toUpperCase()} {currentData.version}
                        </span>

                        {/* Tooltip Last Update Date */}
                        <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 px-3 py-2 bg-slate-800/95 backdrop-blur-md text-slate-300 text-[10px] uppercase tracking-wider font-semibold rounded-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 whitespace-nowrap pointer-events-none border border-white/10 shadow-2xl z-50 flex items-center gap-2 flex-row">
                            <span className="relative flex h-1.5 w-1.5 shrink-0">
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
                                    className="inline-block bg-linear-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-transparent drop-shadow-2xl"
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
                                    className="inline-block bg-linear-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-transparent drop-shadow-2xl"
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </span>
                    </h1>
                </motion.div>
            </AnimatePresence>

            {/* Floating Action Buttons (Bottom Right) */}
            <div className="hidden md:flex fixed bottom-6 right-6 md:bottom-8 md:right-8 z-100 flex-row gap-4 items-center">

                {/* GitHub Button */}
                <motion.a
                    href="https://github.com/CreatorSaWiX/apunts-pro2"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="group relative p-3 rounded-full bg-slate-900 border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:border-white/20 transition-all duration-300 flex items-center justify-center overflow-hidden"
                >
                    <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                    <Github size={22} className="text-slate-400 group-hover:text-white relative z-10 transition-colors" />

                    {/* Hover tooltip for GitHub */}
                    <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 pointer-events-none whitespace-nowrap border border-white/10 shadow-xl">
                        {preferredLang === 'es' ? 'Código Fuente' : 'Codi Font'}
                    </div>
                </motion.a>

                {/* Heart / Contributors Button */}
                <motion.button
                    onClick={openContributors}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="group relative p-3 rounded-full bg-slate-900 border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.2)] hover:shadow-[0_0_30px_rgba(244,63,94,0.6)] hover:border-rose-400 transition-all duration-300 flex items-center justify-center"
                >
                    {/* Particle Effects inside button */}
                    <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <span className="absolute top-[-4px] left-1/2 w-1.5 h-1.5 bg-rose-400 rounded-full animate-ping" />
                        <span className="absolute bottom-[-2px] right-0 w-1 h-1 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '200ms' }} />
                        <span className="absolute top-1/4 left-[-4px] w-1.5 h-1.5 bg-rose-300 rounded-full animate-ping" style={{ animationDelay: '400ms' }} />
                    </div>

                    <Heart size={22} className="text-rose-500 group-hover:fill-rose-500 transition-colors duration-300 relative z-10" />

                    {/* Hover tooltip for Contributors */}
                    <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 pointer-events-none whitespace-nowrap border border-white/10 shadow-xl">
                        {preferredLang === 'es' ? 'Colaboradores' : 'Contribuidors'}
                    </div>
                </motion.button>
            </div>

            {/* Contributors Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-md p-8 overflow-hidden rounded-4xl bg-slate-900/95 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Glowing background inside modal */}
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors cursor-pointer z-20"
                            >
                                <X size={20} />
                            </button>

                            <div className="text-center mb-8 relative z-10 mt-2">
                                <div className="mx-auto w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mb-4 border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                                    <Heart size={28} className="text-rose-500 fill-rose-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    {preferredLang === 'es' ? 'Colaboradores' : 'Contribuidors'}
                                </h2>
                                <p className="text-slate-400 text-sm">
                                    {preferredLang === 'es' ? 'Agradecimiento a los estudiantes que hacen posible este proyecto.' : 'Agraïment als estudiants que fan possible aquest projecte.'}
                                </p>
                            </div>

                            <div className="space-y-4 relative z-10">
                                {isLoadingContributors ? (
                                    <div className="flex justify-center items-center py-8">
                                        <div className="w-8 h-8 rounded-full border-t-2 border-r-2 border-rose-500 animate-spin" />
                                    </div>
                                ) : (
                                    contributors.map((user, i) => (
                                        <Link
                                            to={`/profile/${user.uid}`}
                                            key={i}
                                            onClick={() => setIsModalOpen(false)}
                                            className="block no-underline"
                                        >
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1 + i * 0.1 }}
                                                className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all group cursor-pointer no-underline"
                                            >
                                                <div className="w-12 h-12 rounded-full overflow-hidden bg-linear-to-tr from-primary to-accent flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform relative">
                                                    {user.avatar ? (
                                                        <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span>{user.username.charAt(0).toUpperCase()}</span>
                                                    )}
                                                </div>
                                                <div className="flex-1 flex flex-col justify-center items-start">
                                                    <h3 className="text-white font-semibold flex items-center gap-2">
                                                        {user.username}
                                                    </h3>
                                                    <p className="text-xs text-slate-400 capitalize mt-0.5">{user.role}</p>
                                                </div>
                                                <ChevronRight size={18} className="text-slate-600 group-hover:text-rose-500 group-hover:translate-x-1 transition-all duration-300" />
                                            </motion.div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
};

export default Hero;

