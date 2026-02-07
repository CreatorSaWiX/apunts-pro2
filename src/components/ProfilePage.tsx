import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut, Upload, Clock, Trash2, Github, Loader, Edit2, X, Save } from 'lucide-react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useUserSolutions } from '../hooks/useSolutions';
import { getRank } from '../utils/ranks';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { updateProfile } from 'firebase/auth';
import { motion } from 'framer-motion';

// --- Edit Profile Modal Component ---
const EditProfileModal = ({ isOpen, onClose, user, onUpdate }: any) => {
    const [username, setUsername] = useState(user?.username || '');
    const [github, setGithub] = useState(user?.github || '');
    const [avatar, setAvatar] = useState(user?.avatar || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setUsername(user.username);
            setGithub(user.github || '');
            setAvatar(user.avatar || '');
            setBio(user.bio || '');
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onUpdate({ username, github, avatar, bio });
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
                        <label className="text-xs font-semibold text-slate-400 uppercase">GitHub Username</label>
                        <div className="relative">
                            <Github size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                value={github}
                                onChange={(e) => setGithub(e.target.value)}
                                className="w-full bg-slate-900 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:border-sky-500 outline-none"
                                placeholder="usuari-github"
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

    // Determine which user to show
    // If uid is present, we show that user. If not, we show the logged-in user.
    const userIdToFetch = uid || authUser?.id;
    const isOwnProfile = !uid || (authUser && authUser.id === uid);

    const { solutions: userContributions, loading } = useUserSolutions(userIdToFetch || '');
    const [activeTab, setActiveTab] = useState('uploads');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Local state for extended user data
    const [extendedUser, setExtendedUser] = useState<any>(null);

    // Fetch extended user data
    useEffect(() => {
        const fetchUserData = async () => {
            if (userIdToFetch) {
                const docRef = doc(db, 'users', userIdToFetch);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setExtendedUser({ ...docSnap.data(), id: userIdToFetch });
                } else if (isOwnProfile && authUser) {
                    // Fallback to auth user data if firestore doc missing
                    setExtendedUser(authUser);
                } else {
                    // User not found or just basic info
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

    const handleUpdateProfile = async (data: any) => {
        if (!authUser?.id) return;

        const userRef = doc(db, 'users', authUser.id);

        try {
            // Update Firestore
            await setDoc(userRef, data, { merge: true });

            // Update Auth Profile (so it reflects in navbar etc)
            if (auth.currentUser && data.username) {
                await updateProfile(auth.currentUser, {
                    displayName: data.username,
                    photoURL: data.avatar || auth.currentUser.photoURL
                });
            }

            // Update local state
            setExtendedUser((prev: any) => ({ ...prev, ...data }));

            // Force reload to update context if needed, or we implement a context updater later
            // For now, user might see old name in nav until refresh, but extendedUser handles profile page.
            if (data.username !== authUser.username) {
                window.location.reload(); // Simple way to ensure AuthContext gets fresh data
            }

        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    if (!userIdToFetch) {
        return <Navigate to="/login" replace />;
    }

    const rank = getRank(userContributions.length);

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
                        Tancar Sessió
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
                    href={extendedUser?.github ? `https://github.com/${extendedUser.github}` : '#'}
                    target="_blank"
                    rel="noreferrer"
                    className={`bg-[#1e1e1e] border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center transition-all ${extendedUser?.github ? 'hover:border-purple-500/30 hover:bg-purple-500/5 cursor-pointer' : 'opacity-70'}`}
                >
                    <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 mb-3">
                        <Github size={20} />
                    </div>
                    <span className="text-2xl font-bold text-white truncate max-w-full px-2">
                        {extendedUser?.github || 'No Linked'}
                    </span>
                    <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">GitHub</span>
                </a>
            </div>

            {/* Content Tabs */}
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl w-fit">
                    <button
                        onClick={() => setActiveTab('uploads')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'uploads' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                    >
                        Els meus solucionaris
                    </button>
                    <button
                        onClick={() => setActiveTab('saved')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'saved' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                    >
                        Guardats
                    </button>
                </div>

                <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 overflow-hidden min-h-[200px]">
                    {loading ? (
                        <div className="flex items-center justify-center h-40">
                            <Loader className="animate-spin text-slate-500" />
                        </div>
                    ) : userContributions.length > 0 ? (
                        userContributions.map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 font-mono text-xs font-bold border border-white/5">
                                        CPP
                                    </div>
                                    <div>
                                        <h4 className="text-slate-200 font-medium">{item.title}</h4>
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <span className="font-mono text-slate-400">{item.id}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1"><Clock size={10} /> {item.date}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${item.status === 'approved'
                                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                        : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                        }`}>
                                        {item.status === 'approved' ? 'Publicat' : 'Pendent'}
                                    </span>

                                    <button className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-40 text-slate-500">
                            <p>No has pujat cap solució encara.</p>
                            <Link to="/new-solution" className="text-sky-400 text-sm mt-2 hover:underline">
                                Pujar la primera
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
