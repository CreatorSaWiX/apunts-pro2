import { useState } from 'react';
import { Github, Heart, X, ChevronRight } from 'lucide-react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Spinner from '../ui/Spinner';

interface Contributor {
    uid: string;
    username: string;
    role: string;
    avatar: string;
}

export const AboutSection = () => {
    const { t } = useTranslation();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [contributors, setContributors] = useState<Contributor[]>([]);
    const [isLoadingContributors, setIsLoadingContributors] = useState(false);

    const openContributors = async () => {
        setIsModalOpen(true);
        if (contributors.length > 0) return;

        setIsLoadingContributors(true);
        const uids = ["jV5Y63M77PcqIcOUCpLz76GTYMI3", "tHrqAkSatrV6FVcgfdSErLjyXL12",
            "YU5QuXAZ47dslUX8ruyriHHPfh82", "3cQsRL8DFch3HEk0nHVV1dMQJZl2", "9Z17ChM52YVGsyrIp6gH3ymjEfZ2"];
        const results = await Promise.all(
            uids.map(async (uid) => {
                try {
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
                } catch (e) { console.error("Error carregant col·laboradors", e); }
                return null;
            })
        );
        const fetched = results.filter(Boolean) as Contributor[];
        setContributors(fetched);
        setIsLoadingContributors(false);
    };

    return (
        <div id="about" className="flex flex-col gap-10 w-full pt-4 pb-24">
            <h2 className="text-2xl font-bold text-white w-full border-b border-white/10 pb-4">{t('settings.about', 'Quant a')}</h2>
            <p className="text-slate-400 text-sm font-medium -mt-6">{t('settings.aboutDescription', 'Informació sobre el projecte i les persones que el fan possible.')}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <a
                    href="https://github.com/CreatorSaWiX/apunts-pro2"
                    target="_blank"
                    rel="noreferrer"
                    className="group relative flex flex-col justify-between p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-white/20 transition-all duration-500 overflow-hidden outline-none h-48"
                >
                    <div className="z-10">
                        <Github size={32} className="text-white mb-4" />
                        <h3 className="text-2xl font-black text-white tracking-tight">{t('settings.repository', 'Repositori')}</h3>
                        <p className="text-slate-400 text-sm font-medium mt-1">{t('settings.openSource', 'Codi obert a GitHub')}</p>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500 transform translate-x-1/4 translate-y-1/4">
                        <Github size={120} />
                    </div>
                </a>

                <button type="button"
                    onClick={openContributors}
                    className="group relative text-left flex flex-col justify-between p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-rose-500/30 hover:bg-rose-500/10 transition-all duration-500 overflow-hidden outline-none h-48"
                >
                    <div className="z-10">
                        <Heart size={32} className="text-rose-400 mb-4" />
                        <h3 className="text-2xl font-black text-white tracking-tight">{t('settings.contributors', 'Contribuïdors')}</h3>
                        <p className="text-slate-400 text-sm font-medium mt-1">{t('settings.teamBehind', 'L\'equip darrere el projecte')}</p>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500 transform translate-x-1/4 translate-y-1/4 text-rose-500">
                        <Heart size={120} />
                    </div>
                </button>
            </div>

            {/* Contributors Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#0a0d16]/90 backdrop-blur-xl"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-lg p-8 overflow-hidden rounded-[40px] bg-slate-900 border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Glowing background inside modal */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

                            <button type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors cursor-pointer z-20 outline-none bg-white/5 p-2 rounded-full"
                            >
                                <X size={20} />
                            </button>

                            <div className="mb-8 relative z-10 flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-400">
                                    <Heart size={28} className="fill-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black tracking-tight text-white leading-none">
                                        {t('settings.contributors', 'Contribuïdors')}
                                    </h2>
                                    <p className="text-slate-400 font-medium mt-1">{t('settings.devTeam', 'L\'equip de desenvolupament')}</p>
                                </div>
                            </div>

                            <div className="space-y-3 relative z-10">
                                {isLoadingContributors ? (
                                    <div className="flex justify-center items-center py-12">
                                        <Spinner size="lg" variant="rose" />
                                    </div>
                                ) : (
                                    contributors.map((user, i) => (
                                        <Link
                                            to={`/profile/${user.uid}`}
                                            key={i}
                                            onClick={() => setIsModalOpen(false)}
                                            className="block no-underline outline-none"
                                        >
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.05 * i }}
                                                className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group cursor-pointer"
                                            >
                                                <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-sky-500/20 group-hover:scale-110 transition-transform relative">
                                                    {user.avatar ? (
                                                        <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" loading="lazy" />
                                                    ) : (
                                                        <span className="text-xl">{user.username.charAt(0).toUpperCase()}</span>
                                                    )}
                                                </div>
                                                <div className="flex-1 flex flex-col justify-center items-start">
                                                    <h3 className="text-white font-bold text-lg leading-none mb-1">
                                                        {user.username}
                                                    </h3>
                                                    <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">{user.role}</p>
                                                </div>
                                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-rose-500/20 group-hover:text-rose-400 text-slate-600 transition-all">
                                                    <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
                                                </div>
                                            </motion.div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
