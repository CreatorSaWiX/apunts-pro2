import React, { useState, useTransition } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Github, Heart } from 'lucide-react';
import { useSubject } from '../contexts/SubjectContext';
import { useTranslation } from 'react-i18next';

import { Link } from 'react-router-dom';
import Spinner from './ui/Spinner';

interface Contributor {
    uid: string;
    username: string;
    role: string;
    avatar: string;
}

const MobileActionMenu: React.FC<{
    isOpen: boolean;
    setIsOpen: (val: boolean) => void;
}> = ({ isOpen, setIsOpen }) => {
    const { subject, setSubject } = useSubject();
    const { t, i18n } = useTranslation();
    const preferredLang = i18n.language;
    const [, startTransition] = useTransition();
    const safeSubject = (subject || '').toLowerCase();

    // Contributors state
    const [contributors, setContributors] = useState<Contributor[]>([]);
    const [isLoadingContributors, setIsLoadingContributors] = useState(false);
    const [showContributors, setShowContributors] = useState(false);

    const loadContributors = async () => {
        if (contributors.length > 0) return;
        setIsLoadingContributors(true);
        const uids = ["jV5Y63M77PcqIcOUCpLz76GTYMI3", "tHrqAkSatrV6FVcgfdSErLjyXL12",
            "YU5QuXAZ47dslUX8ruyriHHPfh82", "3cQsRL8DFch3HEk0nHVV1dMQJZl2", "9Z17ChM52YVGsyrIp6gH3ymjEfZ2"];
        const results = await Promise.all(
            uids.map(async (uid) => {
                try {
                    const { db } = await import('../lib/firebase');
                    const { doc, getDoc } = await import('firebase/firestore');
                    const userDoc = await getDoc(doc(db, "users", uid));
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        return {
                            uid,
                            username: data.username || "Usuari",
                            role: data.role || t('settings.contributor', 'Col·laborador'),
                            avatar: data.avatar || ""
                        };
                    }
                } catch (e) { console.error("Error", e); }
                return null;
            })
        );
        const fetched = results.filter(Boolean) as Contributor[];
        setContributors(fetched);
        setIsLoadingContributors(false);
    };

    const handleContributorsClick = () => {
        setShowContributors(true);
        loadContributors();
    };

    return (
        <div className="fixed top-5 right-4 z-50 md:hidden">
            <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 rounded-full bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] text-slate-300 hover:text-white transition-colors focus:outline-none flex items-center gap-2"
            >
                <span className="text-xs font-black tracking-widest uppercase bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">{safeSubject}</span>
                <Settings size={14} className="text-slate-400" />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[2000] flex items-end justify-center md:items-start md:justify-end"
                    >
                        <motion.div
                            initial={{ y: '100%', x: 0 }}
                            animate={{ y: 0, x: 0 }}
                            exit={{ y: '100%', x: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
                            drag="y"
                            dragConstraints={{ top: 0, bottom: 0 }}
                            dragElastic={0.2}
                            onDragEnd={(_e, info) => {
                                if (info.offset.y > 100 || info.velocity.y > 500) {
                                    setIsOpen(false);
                                }
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-h-[90vh] md:h-full md:w-80 bg-slate-900 shadow-[0_-10px_50px_rgba(0,0,0,0.5)] md:shadow-2xl border-t md:border-t-0 md:border-l border-white/10 p-6 pt-3 md:pt-6 pb-8 md:pb-6 flex flex-col relative rounded-t-[32px] md:rounded-none overflow-hidden"
                        >
                            {/* Drag Handle (Mobile only) */}
                            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6 md:hidden touch-none" />

                            <button type="button"
                                onClick={() => setIsOpen(false)}
                                className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors p-1.5 bg-white/5 rounded-full backdrop-blur-md hidden md:block"
                            >
                                <X size={20} />
                            </button>

                            <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">
                                {t('settings.title', 'Ajustaments')}
                            </h2>
                            <p className="text-sm text-slate-400 mb-6">
                                {t('settings.subtitle', 'Configuració de portada')}
                            </p>

                            {!showContributors ? (
                                <div className="space-y-8 flex-1">
                                    {/* Subject Switcher */}
                                    <div className="space-y-3">
                                        <label className="text-xs uppercase tracking-wider text-slate-500 font-bold block mb-3">
                                            {t('settings.subject', 'Assignatura')}
                                        </label>
                                        <div className="grid grid-cols-3 gap-2 bg-slate-800/50 p-1.5 rounded-2xl border border-white/5 relative">
                                            {(['pro2', 'm1', 'm2'] as const).map((sub) => (
                                                <button type="button"
                                                    key={sub}
                                                    onClick={() => startTransition(() => setSubject(sub))}
                                                    className={`relative py-2 px-1 rounded-xl text-xs font-bold transition-all duration-300 z-10 ${safeSubject === sub
                                                        ? 'text-white'
                                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                                                        }`}
                                                >
                                                    {safeSubject === sub && (
                                                        <motion.div
                                                            layoutId="active-subject-menu"
                                                            className={`absolute inset-0 rounded-xl z-[-1] bg-linear-to-r ${sub === 'pro2' ? 'from-sky-400 to-blue-500 shadow-[0_0_15px_rgba(56,189,248,0.4)]' :
                                                                sub === 'm1' ? 'from-violet-500 to-fuchsia-500 shadow-[0_0_15px_rgba(139,92,246,0.4)]' :
                                                                    'from-emerald-500 to-teal-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                                                                }`}
                                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                        />
                                                    )}
                                                    {sub.toUpperCase()}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Language Switcher */}
                                    <div className="space-y-3">
                                        <label className="text-xs uppercase tracking-wider text-slate-500 font-bold block mb-3">
                                            {t('settings.language', 'Idioma')}
                                        </label>
                                        <div className="grid grid-cols-3 gap-2 bg-slate-800/50 p-1.5 rounded-2xl border border-white/5 relative">
                                            {(['ca', 'es', 'en'] as const).map((lang) => (
                                                <button type="button"
                                                    key={lang}
                                                    onClick={() => i18n.changeLanguage(lang)}
                                                    className={`relative py-2 px-1 rounded-xl text-xs font-bold transition-all duration-300 z-10 ${preferredLang === lang
                                                        ? 'text-slate-950'
                                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                                                        }`}
                                                >
                                                    {preferredLang === lang && (
                                                        <motion.div
                                                            layoutId="active-lang-menu"
                                                            className="absolute inset-0 bg-linear-to-br from-white to-slate-400 rounded-xl shadow-md z-[-1]"
                                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                        />
                                                    )}
                                                    {lang.toUpperCase()}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-white/5 space-y-3">
                                        <label className="text-xs uppercase tracking-wider text-slate-500 font-bold block mb-3">
                                            {t('settings.links', 'Enllaços')}
                                        </label>
                                        <a href="https://github.com/CreatorSaWiX/apunts-pro2" target="_blank" rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors">
                                            <Github size={18} />
                                            <span className="text-sm font-medium">{t('settings.sourceCode', 'Codi Font')}</span>
                                        </a>
                                        <button type="button" onClick={handleContributorsClick}
                                            className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-rose-500/10 text-slate-300 hover:text-rose-400 transition-colors">
                                            <Heart size={18} />
                                            <span className="text-sm font-medium">{t('settings.contributors', 'Contribuidors')}</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col">
                                    <button type="button" onClick={() => setShowContributors(false)} className="text-sm text-slate-400 hover:text-white mb-4 flex items-center gap-1">
                                        ← {t('common.back', 'Tornar')}
                                    </button>

                                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                        {isLoadingContributors ? (
                                            <div className="flex justify-center py-8">
                                                <Spinner size="md" variant="rose" glow={false} />
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {contributors.map((user, i) => (
                                                    <Link to={`/profile/${user.uid}`} onClick={() => setIsOpen(false)} key={i} className="flex flex-col gap-1 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center text-white text-xs">
                                                                {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" loading="lazy" alt={`${user.username} avatar`} /> : user.username[0].toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm text-white font-medium">{user.username}</div>
                                                                <div className="text-xs text-slate-400">{user.role}</div>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MobileActionMenu;
