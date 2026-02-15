import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut, Upload, Clock, Trash2, Globe, Loader, Edit2, X, Save, Mail, Send, Bell } from 'lucide-react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useUserSolutions } from '../hooks/useSolutions';
import { getRank } from '../utils/ranks';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { updateProfile } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import MailboxModal from '../components/mailing/MailboxModal';
import ComposeMessageModal from '../components/mailing/ComposeMessageModal';
import InboxModal from '../components/notifications/InboxModal';

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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#1e1e1e] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                    <X size={20} />
                </button>
                <h2 className="text-xl font-bold text-white mb-6">Editar Perfil</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400 uppercase">Nom d'usuari</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-sky-500 outline-none"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400 uppercase">Avatar URL</label>
                        <input
                            type="text"
                            value={avatar}
                            onChange={(e) => setAvatar(e.target.value)}
                            className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-sky-500 outline-none"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400 uppercase">Banner URL</label>
                        <input
                            type="text"
                            value={banner}
                            onChange={(e) => setBanner(e.target.value)}
                            className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-sky-500 outline-none"
                            placeholder="https://imatge-banner.com/foto.jpg"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400 uppercase">Portfoli / Web</label>
                        <div className="relative">
                            <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                value={portfolio}
                                onChange={(e) => setPortfolio(e.target.value)}
                                className="w-full bg-slate-900 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:border-sky-500 outline-none"
                                placeholder="https://el-teu-portfolio.vercel.app"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400 uppercase">Bio / Rol</label>
                        <input
                            type="text"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-sky-500 outline-none"
                            placeholder="Full Stack Developer"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-slate-300 hover:text-white transition-colors">Cancel·lar</button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-lg font-medium flex items-center gap-2"
                        >
                            {isLoading ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
                            Guardar
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};


const ProfilePage = () => {
    const { uid } = useParams();
    const { user: authUser, logout } = useAuth();

    const userIdToFetch = uid || authUser?.id;
    const isOwnProfile = !uid || (authUser && authUser.id === uid);

    const { solutions: userContributions, loading } = useUserSolutions(userIdToFetch || '');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Mailing & Activity State
    const [isMailboxOpen, setIsMailboxOpen] = useState(false);
    const [isInboxOpen, setIsInboxOpen] = useState(false);
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

    const [extendedUser, setExtendedUser] = useState<any>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            if (userIdToFetch) {
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
    }, [isOwnProfile, authUser, isMailboxOpen, isInboxOpen]);

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

    if (!userIdToFetch) {
        return <Navigate to="/login" replace />;
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
        <div className="min-h-screen pt-24 pb-12 px-4 max-w-[1000px] mx-auto relative z-10">
            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={extendedUser}
                onUpdate={handleUpdateProfile}
            />

            {/* Header / Banner */}
            <div className="relative mb-24">
                <div className="h-48 rounded-3xl bg-gradient-to-r from-indigo-900/40 to-sky-900/40 border border-white/10 overflow-hidden relative group">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                    {extendedUser?.banner && (
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${extendedUser.banner})` }}
                        />
                    )}
                    {extendedUser?.banner && <div className="absolute inset-0 bg-black/30"></div>}
                </div>

                <div className="absolute -bottom-16 left-8 flex items-end gap-6">
                    <div className="p-1.5 bg-slate-900 rounded-[2rem] relative group">
                        <img
                            src={extendedUser?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${extendedUser?.username}`}
                            alt={extendedUser?.username}
                            className="w-32 h-32 rounded-[1.7rem] border-4 border-slate-900 bg-slate-800 object-cover"
                        />
                    </div>
                    <div className="mb-4">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-white">{extendedUser?.username || 'Usuari'}</h1>
                            {isOwnProfile && (
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                                >
                                    <Edit2 size={16} />
                                </button>
                            )}
                        </div>
                        <p className="text-slate-400 text-sm flex items-center gap-2">
                            {extendedUser?.bio || 'Full Stack Developer'}
                        </p>
                    </div>
                </div>

                {isOwnProfile && (
                    <button
                        onClick={logout}
                        className="absolute bottom-4 right-8 px-4 py-2 bg-slate-800/50 hover:bg-red-500/10 hover:border-red-500/20 text-slate-300 hover:text-red-400 border border-white/10 rounded-xl transition-all flex items-center gap-2 text-sm font-medium backdrop-blur-md"
                    >
                        <LogOut size={16} />
                        Tancar sessió
                    </button>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                <div className="bg-[#1e1e1e] border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-3">
                        <Upload size={20} />
                    </div>
                    <span className="text-2xl font-bold text-white">{userContributions.length}</span>
                    <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Solucionaris</span>
                </div>

                {/* Rank Card */}
                <div className="bg-[#1e1e1e] border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center relative overflow-hidden">
                    <div className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-3 ${rank.color}`}>
                        {/* We could use dynamic icons here based on rank */}
                        <User size={20} />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className={`text-2xl font-bold ${rank.color}`}>{rank.name}</span>
                        {rank.division && <span className={`text-xl font-bold ${rank.color} opacity-80`}>{rank.division}</span>}
                    </div>
                    <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Rang Actual</span>
                </div>

                <a
                    href={extendedUser?.portfolio ? extendedUser.portfolio : '#'}
                    target="_blank"
                    rel="noreferrer"
                    className={`bg-[#1e1e1e] border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center transition-all ${extendedUser?.portfolio ? 'hover:border-sky-500/30 hover:bg-sky-500/5 cursor-pointer' : 'opacity-70'}`}
                >
                    <div className="w-10 h-10 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400 mb-3">
                        <Globe size={20} />
                    </div>
                    <span className="text-2xl font-bold text-white truncate max-w-full px-2">
                        {extendedUser?.portfolio ? displayUrl(extendedUser.portfolio) : 'No Linked'}
                    </span>
                    <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Portfoli</span>
                </a>
            </div>

            {/* Mailing & Activity System */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full mb-12">
                {isOwnProfile ? (
                    <>
                        <button
                            onClick={() => setIsMailboxOpen(true)}
                            className="relative px-8 py-6 bg-slate-800/50 hover:bg-sky-500/10 border border-white/5 hover:border-sky-500/30 rounded-2xl transition-all group w-full max-w-sm flex flex-col items-center gap-3"
                        >
                            <div className="relative">
                                <Mail size={32} className="text-slate-400 group-hover:text-sky-400 transition-colors" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-red-500/20 animate-pulse">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-lg font-bold text-slate-200 group-hover:text-white">Bústia privada</span>
                            <span className="text-xs text-slate-500 uppercase tracking-wider">
                                {unreadCount > 0 ? `${unreadCount} nous` : 'Sense novetats'}
                            </span>
                        </button>

                        <button
                            onClick={() => setIsInboxOpen(true)}
                            className="relative px-8 py-6 bg-slate-800/50 hover:bg-indigo-500/10 border border-white/5 hover:border-indigo-500/30 rounded-2xl transition-all group w-full max-w-sm flex flex-col items-center gap-3"
                        >
                            <div className="relative">
                                <Bell size={32} className="text-slate-400 group-hover:text-indigo-400 transition-colors" />
                                {unreadNotificationsCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-pink-500/20 animate-pulse">
                                        {unreadNotificationsCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-lg font-bold text-slate-200 group-hover:text-white">Activitat</span>
                            <span className="text-xs text-slate-500 uppercase tracking-wider">
                                {unreadNotificationsCount > 0 ? `${unreadNotificationsCount} noves` : 'Tot al dia'}
                            </span>
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => {
                            if (!authUser) {
                                window.location.href = '/login';
                                return;
                            }
                            setIsComposeOpen(true);
                        }}
                        className="px-8 py-4 bg-sky-500 hover:bg-sky-400 text-white rounded-2xl font-bold text-lg shadow-lg shadow-sky-500/20 hover:shadow-sky-500/40 transition-all flex items-center gap-3 w-full max-w-sm justify-center"
                    >
                        <Send size={24} />
                        Enviar missatge
                    </button>
                )}
            </div>

            {/* Modals */}
            <AnimatePresence>
                {isMailboxOpen && (
                    <MailboxModal isOpen={isMailboxOpen} onClose={() => setIsMailboxOpen(false)} />
                )}
                {isInboxOpen && (
                    <InboxModal isOpen={isInboxOpen} onClose={() => setIsInboxOpen(false)} />
                )}
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
