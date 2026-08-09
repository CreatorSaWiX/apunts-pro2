import React, { useState, useTransition } from 'react';
import { m as motion } from 'framer-motion';
import { Settings, Github, Heart } from 'lucide-react';
import { useSubjectStore } from '../stores/useSubjectStore';
import { useTranslation } from 'react-i18next';

import { Link } from 'react-router-dom';
import Spinner from './ui/Spinner';
import BottomSheet from './ui/mobile/BottomSheet';

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
    const { subject, setSubject } = useSubjectStore();
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
            <BottomSheet
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title={t('settings.title', 'Ajustaments')}
                subtitle={t('settings.subtitle', 'Configuració de portada')}
            >
                {!showContributors ? (
                    <div className="space-y-8 flex-1">
                        {/* Subject Switcher */}
                        <div className="space-y-3">
                            <label className="text-xs uppercase tracking-wider text-slate-400 font-bold block mb-3">
                                {t('settings.subject', 'Assignatura')}
                            </label>
                            <div className="grid grid-cols-3 gap-2 bg-slate-800/50 p-1.5 rounded-2xl border border-white/5 relative">
                                {(['pro2', 'm1', 'm2'] as const).map((sub) => (
                                    <button type="button"
                                        key={sub}
                                        onClick={() => startTransition(() => setSubject(sub))}
                                        className={`relative py-2 px-1 rounded-xl text-xs font-bold transition-all duration-300 z-10 ${safeSubject === sub
                                            ? 'text-white'
                                            : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                                            }`}
                                    >
                                        {safeSubject === sub && (
                                            <motion.div
                                                layoutId="active-subject-menu"
                                                className={`absolute inset-0 rounded-xl z-[-1] bg-linear-to-r ${sub === 'pro2' ? 'from-sky-400 to-blue-500 shadow-[0_0_15px_rgba(56,189,248,0.4)]' :
                                                    sub === 'm1' ? 'from-violet-500 to-fuchsia-500 shadow-[0_0_15px_rgba(139,92,246,0.4)]' :
                                                        'from-emerald-400 to-teal-500 shadow-[0_0_15px_rgba(52,211,153,0.4)]'
                                                    }`}
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        {sub.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Language Selector */}
                        <div className="space-y-3">
                            <label className="text-xs uppercase tracking-wider text-slate-400 font-bold block mb-3">
                                {t('settings.language', 'Idioma')}
                            </label>
                            <div className="grid grid-cols-3 gap-2 bg-slate-800/50 p-1.5 rounded-2xl border border-white/5 relative">
                                {['ca', 'es', 'en'].map((lang) => (
                                    <button type="button"
                                        key={lang}
                                        onClick={() => i18n.changeLanguage(lang)}
                                        className={`relative py-2 px-1 rounded-xl text-xs font-bold transition-all duration-300 z-10 ${preferredLang === lang
                                            ? 'text-slate-900'
                                            : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                                            }`}
                                    >
                                        {preferredLang === lang && (
                                            <motion.div
                                                layoutId="active-lang-menu"
                                                className="absolute inset-0 rounded-xl bg-linear-to-r from-slate-300 to-slate-100 shadow-[0_0_15px_rgba(255,255,255,0.2)] z-[-1]"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        {lang.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Links Section */}
                        <div className="space-y-3 pt-4 border-t border-white/5">
                            <label className="text-xs uppercase tracking-wider text-slate-400 font-bold block mb-3">
                                {t('settings.links', 'Enllaços')}
                            </label>
                            <div className="flex flex-col gap-2">
                                <a href="https://github.com/CreatorSaWiX/apunts-pro2" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/50 border border-white/5 hover:bg-slate-700/50 hover:border-white/10 transition-all text-sm text-slate-300 hover:text-white">
                                    <Github size={18} />
                                    <span className="font-medium">Source Code</span>
                                </a>
                                <button type="button" onClick={handleContributorsClick} className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/50 border border-white/5 hover:bg-slate-700/50 hover:border-white/10 transition-all text-sm text-slate-300 hover:text-white text-left w-full">
                                    <Heart size={18} />
                                    <span className="font-medium">Contributors</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col h-full overflow-hidden">
                        <button
                            type="button"
                            onClick={() => setShowContributors(false)}
                            className="flex items-center gap-2 text-sm text-primary font-bold mb-4 hover:opacity-80 transition-opacity"
                        >
                            ← {t('settings.back', 'Tornar')}
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
            </BottomSheet>
        </div>
    );
};

export default MobileActionMenu;
