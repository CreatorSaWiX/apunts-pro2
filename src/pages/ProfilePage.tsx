import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut, Upload, Globe, Loader, Edit2, X, Save, Mail, Send, Bell, Info } from 'lucide-react';
import { useParams, Navigate } from 'react-router-dom';
import { useUserSolutions } from '../hooks/useSolutions';
import { getRank } from '../utils/ranks';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { updateProfile } from 'firebase/auth';
import { motion, AnimatePresence, useMotionTemplate, useMotionValue } from 'framer-motion';
import MailboxModal from '../components/mailing/MailboxModal';
import ComposeMessageModal from '../components/mailing/ComposeMessageModal';
import InboxModal from '../components/notifications/InboxModal';

// --- Spotlight Card (Re-used from TopicCarousel to ensure identical UI consistency) ---
function SpotlightCard({
    children,
    className = "",
    isActive = false,
    ...props
}: {
    children: React.ReactNode;
    className?: string;
    isActive?: boolean;
    [key: string]: any;
}) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const backgroundStyle = useMotionTemplate`
        radial-gradient(
          800px circle at ${mouseX}px ${mouseY}px,
          rgba(var(--primary-rgb), 0.12),
          transparent 80%
        )
    `;

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <div
            className={`group/card relative overflow-hidden transition-all duration-300 ${isActive ? 'bg-slate-900/80 border-primary/20 shadow-2xl shadow-primary/20 ring-1 ring-primary/20 backdrop-blur-md' : 'bg-slate-900/40 border-[0.5px] border-white/5'} ${className}`}
            onMouseMove={handleMouseMove}
            {...props}
        >
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition duration-300 group-hover/card:opacity-100 z-50"
                style={{ background: backgroundStyle }}
            />
            {children}
        </div>
    );
}

// --- Edit Profile Modal Component ---
const EditProfileModal = ({ isOpen, onClose, user, onUpdate }: any) => {
    const [username, setUsername] = useState(user?.username || '');
    const [portfolio, setPortfolio] = useState(user?.portfolio || '');
    const [avatar, setAvatar] = useState(user?.avatar || '');
    const [banner, setBanner] = useState(user?.banner || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setUsername(user.username);
            setPortfolio(user.portfolio || '');
            setAvatar(user.avatar || '');
            setBanner(user.banner || '');
            setBio(user.bio || '');
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onUpdate({ username, portfolio, avatar, banner, bio });
            onClose();
        } catch (error) {
            console.error("Error updating profile:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-0 bg-[#0B0F19]/80 backdrop-blur-sm shadow-2xl overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                        className="bg-[#0a0d16] border border-white/10 rounded-[32px] w-full max-w-lg p-6 md:p-8 shadow-2xl relative my-8"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white tracking-tight">Editar Perfil</h2>
                            <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors hover:bg-white/10">
                                <X size={20} strokeWidth={2} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-1.5 flex flex-col items-start w-full gap-2">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1">Nom d'usuari</label>
                                <div className="relative w-full">
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full bg-[#0a0d16] border border-white/5 rounded-2xl px-5 py-3.5 text-white focus:border-primary/50 focus:bg-slate-900 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5 flex flex-col items-start w-full gap-2">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1">Avatar & Banner</label>
                                <div className="grid grid-cols-2 gap-3 w-full">
                                    <input
                                        type="text"
                                        value={avatar}
                                        onChange={(e) => setAvatar(e.target.value)}
                                        placeholder="URL de l'Avatar"
                                        className="w-full bg-[#0a0d16] border border-white/5 rounded-2xl px-5 py-3.5 text-white focus:border-primary/50 focus:bg-slate-900 focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder-slate-600 text-sm"
                                    />
                                    <input
                                        type="text"
                                        value={banner}
                                        onChange={(e) => setBanner(e.target.value)}
                                        placeholder="URL del Banner"
                                        className="w-full bg-[#0a0d16] border border-white/5 rounded-2xl px-5 py-3.5 text-white focus:border-primary/50 focus:bg-slate-900 focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder-slate-600 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5 flex flex-col items-start w-full gap-2">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1">Identitat web</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                                    <div className="relative w-full">
                                        <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input
                                            type="text"
                                            value={portfolio}
                                            onChange={(e) => setPortfolio(e.target.value)}
                                            className="w-full bg-[#0a0d16] border border-white/5 rounded-2xl pl-11 pr-4 py-3.5 text-white focus:border-primary/50 focus:bg-slate-900 focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder-slate-600 text-sm"
                                            placeholder="https://portfolio.com"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        className="w-full bg-[#0a0d16] border border-white/5 rounded-2xl px-5 py-3.5 text-white focus:border-primary/50 focus:bg-slate-900 focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder-slate-600 text-sm"
                                        placeholder="La teva biografia / rol curt..."
                                    />
                                </div>
                            </div>

                            <div className="pt-6 flex justify-end gap-3 border-t border-white/5">
                                <button type="button" onClick={onClose} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 hover:text-white font-medium transition-colors text-sm border border-transparent hover:border-white/10">
                                    Cancel·lar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-gradient-to-r from-primary/90 to-accent/90 hover:from-primary hover:to-accent px-8 py-2.5 rounded-xl shadow-lg shadow-primary/20 text-white font-semibold flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
                                >
                                    {isLoading ? <Loader size={18} className="animate-spin" /> : <Save size={18} />}
                                    Desar canvis
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};


const ProfilePage = () => {
    const { uid } = useParams();
    const { user: authUser, logout, isLoading: authLoading } = useAuth();

    const userIdToFetch = uid || authUser?.id;
    const isOwnProfile = !uid || (authUser && authUser.id === uid);

    const { solutions: userContributions } = useUserSolutions(userIdToFetch || '');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Mailing & Activity State
    const [isMailboxOpen, setIsMailboxOpen] = useState(false);
    const [isInboxOpen, setIsInboxOpen] = useState(false);
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

    const [extendedUser, setExtendedUser] = useState<any>(null);
    const [isFetchingUser, setIsFetchingUser] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            if (userIdToFetch) {
                setIsFetchingUser(true);
                const docRef = doc(db, 'users', userIdToFetch);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setExtendedUser({ ...docSnap.data(), id: userIdToFetch });
                } else if (isOwnProfile && authUser) {
                    setExtendedUser(authUser);
                } else {
                    setExtendedUser({
                        username: 'Usuari',
                        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${userIdToFetch}`,
                        id: userIdToFetch
                    });
                }
                setIsFetchingUser(false);
            }
        };
        fetchUserData();
    }, [userIdToFetch, authUser, isOwnProfile]);

    // Fetch unread counts
    useEffect(() => {
        const fetchUnread = async () => {
            if (isOwnProfile && authUser) {
                // Messages
                const qMsg = query(
                    collection(db, 'messages'),
                    where('receiverId', '==', authUser.id),
                    where('read', '==', false)
                );
                const snapMsg = await getDocs(qMsg);
                setUnreadCount(snapMsg.size);

                // Notifications
                const qNotif = query(
                    collection(db, 'notifications'),
                    where('userId', '==', authUser.id),
                    where('read', '==', false)
                );
                const snapNotif = await getDocs(qNotif);
                setUnreadNotificationsCount(snapNotif.size);
            }
        };
        fetchUnread();

        const interval = setInterval(fetchUnread, 30000);
        return () => clearInterval(interval);
    }, [isOwnProfile, authUser]);

    const handleUpdateProfile = async (data: any) => {
        if (!authUser?.id) return;

        const userRef = doc(db, 'users', authUser.id);

        try {
            await setDoc(userRef, data, { merge: true });

            if (auth.currentUser && data.username) {
                await updateProfile(auth.currentUser, {
                    displayName: data.username,
                    photoURL: data.avatar || auth.currentUser.photoURL
                });
            }

            setExtendedUser((prev: any) => ({ ...prev, ...data }));

            if (data.username !== authUser.username) {
                window.location.reload();
            }

        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    if (!userIdToFetch && !authLoading) {
        return <Navigate to="/login" replace />;
    }

    if (authLoading || isFetchingUser || !extendedUser) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-24 relative z-10 w-full">
                <Loader size={32} className="text-primary animate-spin" />
            </div>
        );
    }

    const rank = getRank(userContributions.length);

    const displayUrl = (url: string) => {
        try {
            return new URL(url).hostname;
        } catch {
            return url;
        }
    };

    return (
        <div className="min-h-screen md:h-screen py-6 md:py-10 px-4 md:px-8 max-w-[1040px] mx-auto relative z-10 font-sans flex flex-col justify-center overflow-y-auto md:overflow-hidden">
            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={extendedUser}
                onUpdate={handleUpdateProfile}
            />

            {/* Banner Section */}
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="relative mb-6 md:mb-6 shrink-0 z-30">
                <SpotlightCard className="h-56 md:h-75 rounded-[32px] md:rounded-[40px] border border-[0.5px] border-white/5 relative shadow-none [mask-image:linear-gradient(to_bottom,black_5%,transparent_90%)]">
                    {extendedUser?.banner ? (
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover/card:scale-105"
                            style={{ backgroundImage: `url(${extendedUser.banner})` }}
                        />
                    ) : (
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover/card:scale-105 opacity-80"
                            style={{ backgroundImage: `url(https://picsum.photos/seed/${extendedUser?.username || 'Apunts'}/960/540)` }}
                        />
                    )}
                </SpotlightCard>

                {/* Overlapping Identity Section */}
                <div className="absolute -bottom-5 md:-bottom-2 left-6 md:left-12 flex items-end gap-6 w-[calc(100%-3rem)] md:w-[calc(100%-6rem)] z-20">
                    <div className="relative shrink-0 transition-transform duration-300 hover:scale-[1.02]">
                        <div className="relative z-10 shadow-[0_8px_30px_rgb(0,0,0,0.5)] rounded-[1.8rem]">
                            <img
                                src={extendedUser?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${extendedUser?.username}`}
                                alt={extendedUser?.username}
                                className="w-28 h-28 md:w-36 md:h-36 rounded-[1.8rem] bg-[#0f111a] object-cover"
                            />
                        </div>
                    </div>

                    <div className="pb-3 flex-1 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white line-clamp-1">
                                {extendedUser?.username || 'Usuari'}
                            </h1>
                            <p className="text-sm font-light text-slate-400 mt-1">
                                {extendedUser?.bio || 'Membre de la comunitat'}
                            </p>
                        </div>

                        {isOwnProfile && (
                            <div className="flex items-center gap-2 pb-1 shrink-0">
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="group/btn flex items-center gap-2 bg-slate-900/40 hover:bg-slate-900/80 border border-white/5 px-4 py-2.5 rounded-xl text-slate-300 hover:text-white hover:border-primary/20 transition-all font-semibold backdrop-blur-md shadow-lg"
                                >
                                    <Edit2 size={16} className="text-slate-400 group-hover/btn:text-primary transition-colors" />
                                    <span>Editar Perfil</span>
                                </button>
                                <button
                                    onClick={logout}
                                    className="p-2.5 rounded-xl bg-red-500/5 hover:bg-red-500/10 text-red-500 hover:text-red-400 transition-all border border-red-500/10 hover:border-red-500/20 shadow-lg"
                                    title="Tancar sessió"
                                >
                                    <LogOut size={16} strokeWidth={2} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Profile Content Grid */}
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 shrink-0 relative z-40`}>

                {(extendedUser?.role === 'moderador' || extendedUser?.role === 'editor') && (
                    <>
                        {/* Stats Card: Solucionaris */}
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="h-full">
                            <SpotlightCard className="h-full min-h-[220px] rounded-[24px] md:rounded-[36px] p-6 lg:p-8 flex flex-col justify-between group/metric hover:bg-slate-900/60 transition-colors">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-slate-500 group-hover/metric:bg-primary/10 group-hover/metric:border-primary/20 group-hover/metric:text-accent group-hover/metric:shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)] transition-all duration-300">
                                        <Upload size={24} strokeWidth={1.5} />
                                    </div>
                                </div>
                                <div className="mt-8 relative z-20">
                                    <span className="block text-3xl md:text-4xl font-bold leading-tight tracking-tight text-white mb-4 truncate">
                                        {userContributions.length}
                                    </span>
                                    <span className="text-xs font-mono text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <div className="h-px w-6 bg-slate-700 group-hover/metric:w-12 group-hover/metric:bg-primary transition-all duration-300" />
                                        SOLUCIONARIS
                                    </span>
                                </div>
                            </SpotlightCard>
                        </motion.div>

                        {/* Rank Card */}
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="h-full relative z-[50]">
                            <SpotlightCard className="h-full min-h-[220px] rounded-[24px] md:rounded-[36px] p-6 lg:p-8 flex flex-col justify-between group/metric hover:bg-slate-900/60 transition-colors !overflow-visible">
                                <div className="flex justify-between items-start mb-6 w-full relative z-40">
                                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-slate-500 group-hover/metric:bg-primary/10 group-hover/metric:border-primary/20 group-hover/metric:text-accent transition-all duration-300 group-hover/metric:shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]">
                                        <User size={24} strokeWidth={1.5} />
                                    </div>
                                    <div className="absolute right-0 top-0 group/info cursor-help z-[100]">
                                        <div className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-500 group-hover/info:text-primary">
                                            <Info size={18} />
                                        </div>
                                        {/* Pure CSS Popover - Positioned explicitly below icon to prevent obscuring profile header */}
                                        <div className="absolute right-0 top-full mt-2 w-[240px] md:w-[260px] p-5 bg-[#0f111a] border border-white/10 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] opacity-0 invisible group-hover/info:opacity-100 group-hover/info:visible transition-all duration-300 origin-top-right translate-y-2 group-hover/info:translate-y-0 z-[100]">
                                            <h4 className="font-bold text-white mb-4 tracking-tight text-sm">Escala de rangs</h4>
                                            <ul className="space-y-2.5 text-xs font-semibold">
                                                <li className="flex justify-between items-center"><span className="text-orange-500">Bronze</span> <span className="text-slate-500">0+</span></li>
                                                <li className="flex justify-between items-center"><span className="text-slate-400">Silver</span> <span className="text-slate-500">5+</span></li>
                                                <li className="flex justify-between items-center"><span className="text-yellow-400">Gold</span> <span className="text-slate-500">10+</span></li>
                                                <li className="flex justify-between items-center"><span className="text-cyan-400">Platinum</span> <span className="text-slate-500">15+</span></li>
                                                <li className="flex justify-between items-center"><span className="text-blue-500">Diamond</span> <span className="text-slate-500">20+</span></li>
                                                <li className="flex justify-between items-center"><span className="text-purple-500">Champion</span> <span className="text-slate-500">25+</span></li>
                                                <li className="flex justify-between items-center"><span className="text-red-500">Grand Champion</span> <span className="text-slate-500">35+</span></li>
                                                <li className="flex justify-between items-center"><span className="text-pink-500">SSL</span> <span className="text-pink-400/50">50+</span></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 relative z-20">
                                    <div className={`flex items-baseline gap-2 mb-4 ${rank.color}`}>
                                        <span className={`text-3xl md:text-4xl font-bold leading-tight tracking-tight truncate ${rank.color.includes('bg-clip-text') ? rank.color : ''}`}>
                                            {rank.name}
                                        </span>
                                        {rank.division && (
                                            <div className="flex gap-1 ml-1" title={`Divisió ${rank.division}`}>
                                                {[1, 2, 3].map((bar) => {
                                                    const isActive = bar <= (rank.division === 'I' ? 1 : rank.division === 'II' ? 2 : 3);
                                                    return (
                                                        <div
                                                            key={bar}
                                                            className={`h-4 w-[5px] rounded-[1px] skew-x-[-15deg] transition-all duration-300 ${isActive
                                                                ? `bg-current shadow-[0_0_8px_currentColor] opacity-90`
                                                                : 'bg-white/10'
                                                                }`}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-xs font-mono text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <div className="h-px w-6 bg-slate-700 group-hover/metric:w-12 group-hover/metric:bg-primary transition-all duration-300" />
                                        RANG ACTUAL
                                    </span>
                                </div>
                            </SpotlightCard>
                        </motion.div>

                        {/* Portfolio Card */}
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="h-full">
                            <SpotlightCard className={`h-full min-h-[220px] rounded-[24px] md:rounded-[36px] p-6 lg:p-8 flex flex-col justify-between transition-colors ${extendedUser?.portfolio ? 'group/metric hover:bg-slate-900/60 hover:border-primary/20 cursor-pointer' : 'opacity-60 isolate border-[0.5px] border-white/5'}`}>
                                {extendedUser?.portfolio ? (
                                    <a
                                        href={extendedUser.portfolio}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="absolute inset-0 z-10"
                                    />
                                ) : null}

                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-3.5 rounded-2xl bg-white/5 border border-white/5 text-slate-500 transition-all duration-300 ${extendedUser?.portfolio ? 'group-hover/metric:bg-primary/10 group-hover/metric:border-primary/20 group-hover/metric:text-accent group-hover/metric:shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]' : ''}`}>
                                        <Globe size={24} strokeWidth={1.5} />
                                    </div>
                                </div>
                                <div className="mt-8 relative z-20 pointer-events-none">
                                    <span className="block text-2xl lg:text-3xl font-bold leading-tight tracking-tight text-white mb-4 truncate">
                                        {extendedUser?.portfolio ? displayUrl(extendedUser.portfolio) : 'Sense vincular'}
                                    </span>
                                    <span className="text-xs font-mono text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <div className={`h-px bg-slate-700 transition-all duration-300 ${extendedUser?.portfolio ? 'w-6 group-hover/metric:w-12 group-hover/metric:bg-primary' : 'w-6'}`} />
                                        PORTFOLI
                                    </span>
                                </div>
                            </SpotlightCard>
                        </motion.div>
                    </>
                )}
            </div>

            {/* Public action for viewing someone else's profile */}
            {!isOwnProfile && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="w-full mt-10 md:mt-16 flex justify-center shrink-0 z-20">
                    <button
                        onClick={() => {
                            if (!authUser) return window.location.href = '/login';
                            setIsComposeOpen(true);
                        }}
                        className="group flex items-center gap-3 bg-gradient-to-r from-primary/80 to-accent/80 hover:from-primary hover:to-accent px-8 py-3.5 rounded-2xl shadow-xl shadow-primary/20 text-white font-bold transition-all transform hover:-translate-y-1 text-base relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                        <Send size={20} strokeWidth={2.5} className="relative z-10 group-hover:rotate-12 transition-transform" />
                        <span className="relative z-10">Enviar missatge directe</span>
                    </button>
                </motion.div>
            )}

            {/* Mailing & Activity System for the Owner */}
            {isOwnProfile && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 w-full mt-4 flex-1 min-h-0 pb-6">
                    <motion.div className="h-full min-h-[140px]" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <button onClick={() => setIsMailboxOpen(true)} className="w-full h-full outline-none text-left flex">
                            <SpotlightCard className="w-full h-full rounded-[24px] md:rounded-[36px] p-6 lg:p-8 flex items-center gap-5 group/action hover:bg-slate-900/60 transition-colors border-white/5 border hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">
                                <div className="relative">
                                    <div className="p-4 rounded-[1.2rem] bg-slate-900 border border-white/5 text-slate-400 group-hover/action:text-accent group-hover/action:border-primary/20 transition-all duration-300 shrink-0 shadow-lg group-hover/action:shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]">
                                        <Mail size={24} strokeWidth={1.5} />
                                    </div>
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-[22px] h-[22px] bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg border-2 border-[var(--bg-app-color,#0B0F19)]">
                                            {unreadCount}
                                        </span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg md:text-xl font-bold text-white mb-1 leading-tight group-hover/action:text-accent transition-colors tracking-tight">Bústia privada</h3>
                                    <p className="text-sm font-light text-slate-500 truncate">
                                        {unreadCount > 0 ? `Tens ${unreadCount} ${unreadCount === 1 ? 'missatge' : 'missatges'} pendents de llegir` : 'Sense nous missatges, tot net.'}
                                    </p>
                                </div>
                            </SpotlightCard>
                        </button>
                    </motion.div>

                    <motion.div className="h-full min-h-[140px]" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <button onClick={() => setIsInboxOpen(true)} className="w-full h-full outline-none text-left flex">
                            <SpotlightCard className="w-full h-full rounded-[24px] md:rounded-[36px] p-6 lg:p-8 flex items-center gap-5 group/action hover:bg-slate-900/60 transition-colors border-white/5 border hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">
                                <div className="relative">
                                    <div className="p-4 rounded-[1.2rem] bg-slate-900 border border-white/5 text-slate-400 group-hover/action:text-accent group-hover/action:border-primary/20 transition-all duration-300 shrink-0 shadow-lg group-hover/action:shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]">
                                        <Bell size={24} strokeWidth={1.5} />
                                    </div>
                                    {unreadNotificationsCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-[22px] h-[22px] bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg border-2 border-[var(--bg-app-color,#0B0F19)]">
                                            {unreadNotificationsCount}
                                        </span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg md:text-xl font-bold text-white mb-1 leading-tight group-hover/action:text-accent transition-colors tracking-tight">Notificacions</h3>
                                    <p className="text-sm font-light text-slate-500 truncate">
                                        {unreadNotificationsCount > 0 ? `${unreadNotificationsCount} novetats per revisar` : 'Estàs al dia amb l\'activitat.'}
                                    </p>
                                </div>
                            </SpotlightCard>
                        </button>
                    </motion.div>
                </div>
            )}

            {/* Modals Layer */}
            <AnimatePresence>
                {isMailboxOpen && <MailboxModal isOpen={isMailboxOpen} onClose={() => setIsMailboxOpen(false)} />}
                {isInboxOpen && <InboxModal isOpen={isInboxOpen} onClose={() => setIsInboxOpen(false)} />}
                {isComposeOpen && extendedUser && (
                    <ComposeMessageModal
                        isOpen={isComposeOpen}
                        onClose={() => setIsComposeOpen(false)}
                        receiverId={extendedUser.id}
                        receiverName={extendedUser.username}
                        initialSubject=""
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProfilePage;
