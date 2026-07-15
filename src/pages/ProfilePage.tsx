import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut, Upload, Globe, Edit2, Save, Mail, Send, Bell, Info } from 'lucide-react';
import { useParams, Navigate } from 'react-router-dom';
import { useUserSolutions } from '../hooks/useSolutions';
import { getRank } from '../utils/ranks';
import { m as motion, AnimatePresence } from 'framer-motion';
import MailboxModal from '../components/mailing/MailboxModal';
import ComposeMessageModal from '../components/mailing/ComposeMessageModal';
import InboxModal from '../components/notifications/InboxModal';
import SSLParticles from '../components/SSLParticles';
import Spinner from '../components/ui/Spinner';
import Modal from '../components/ui/Modal';
import FileUploader, { type Attachment } from '../components/ui/FileUploader';
import type { CommunityPost } from '../types/community';
import PublicationCard from '../components/community/PublicationCard';
import PostDetailModal from '../components/community/PostDetailModal';
import { useTranslation } from 'react-i18next';

// --- Inline Editable Text Component ---
const InlineEditableText = ({ 
    value, 
    onSave, 
    className, 
    placeholder, 
    isEditable, 
    multiline = false,
    inputClassName = ''
}: { 
    value: string; 
    onSave: (val: string) => Promise<void>; 
    className?: string; 
    placeholder?: string; 
    isEditable: boolean;
    multiline?: boolean;
    inputClassName?: string;
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);
    const [isSaving, setIsSaving] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        setTempValue(value);
    }, [value]);

    const save = async () => {
        if (tempValue !== value) {
            setIsSaving(true);
            await onSave(tempValue);
            setIsSaving(false);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !multiline) {
            save();
        } else if (e.key === 'Escape') {
            setTempValue(value);
            setIsEditing(false);
        }
    };

    if (!isEditable) {
        return <span className={className}>{value || placeholder}</span>;
    }

    if (isEditing) {
        return (
            <div className="relative inline-block w-full max-w-full">
                {multiline ? (
                    <textarea 
                        autoFocus
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        onBlur={save}
                        onKeyDown={handleKeyDown}
                        className={`${className} bg-transparent border-none p-0 m-0 outline-none w-full resize-none focus:ring-0 ${inputClassName}`}
                        rows={3}
                        disabled={isSaving}
                    />
                ) : (
                    <input 
                        autoFocus
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        onBlur={save}
                        onKeyDown={handleKeyDown}
                        className={`${className} bg-transparent border-none p-0 m-0 outline-none w-full focus:ring-0 ${inputClassName}`}
                        disabled={isSaving}
                    />
                )}
                {isSaving && <div className="absolute right-0 top-1/2 -translate-y-1/2"><Spinner size="sm" /></div>}
            </div>
        );
    }

    return (
        <span 
            onClick={() => setIsEditing(true)} 
            className={`${className} cursor-text group/inline relative inline-flex items-center`}
            title={t('common.clickToEdit', 'Fes clic per editar')}
        >
            <span className="line-clamp-2">{value || <span className="text-slate-500 italic">{placeholder}</span>}</span>
            <Edit2 size={20} className="ml-3 opacity-0 group-hover/inline:opacity-40 hover:!opacity-100 transition-opacity text-white shrink-0 cursor-pointer" />
        </span>
    );
};

// --- Main Profile Component ---
const ProfilePage = () => {
    const { t } = useTranslation();
    const { uid } = useParams();
    const { user: authUser, logout, isLoading: authLoading } = useAuth();

    const userIdToFetch = uid || authUser?.id;
    const isOwnProfile = Boolean(!uid || (authUser && authUser.id === uid));

    const { solutions: userContributions } = useUserSolutions(userIdToFetch || '');

    const [isMailboxOpen, setIsMailboxOpen] = useState(false);
    const [isInboxOpen, setIsInboxOpen] = useState(false);
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

    const [extendedUser, setExtendedUser] = useState<any>(null);
    const [isFetchingUser, setIsFetchingUser] = useState(true);
    const [isHoveringSSL, setIsHoveringSSL] = useState(false);

    const [userPosts, setUserPosts] = useState<CommunityPost[]>([]);
    const [isFetchingPosts, setIsFetchingPosts] = useState(true);
    const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
    const bannerRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        let animationFrameId: number;
        
        const render = () => {
            if (!bannerRef.current) return;
            
            const y = window.scrollY;
            
            if (y < 0) {
                // Native Safari/iOS Overscroll
                const bannerHeight = bannerRef.current.offsetHeight || 380;
                const scale = 1 + (Math.abs(y) / bannerHeight);
                // translateY(y) moves it UP relative to the document, canceling the OS down-shift
                bannerRef.current.style.transform = `translateY(${y}px) scale(${scale})`;
            } else if (y > 0) {
                // Parallax Effect on Scroll Down
                bannerRef.current.style.transform = `translateY(${y * 0.4}px) scale(1)`;
                const opacity = Math.max(0, 1 - (y / 500));
                bannerRef.current.style.opacity = opacity.toString();
            } else {
                bannerRef.current.style.transform = `translateY(0px) scale(1)`;
                bannerRef.current.style.opacity = '1';
            }
        };

        const handleScroll = () => {
            animationFrameId = requestAnimationFrame(render);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            if (userIdToFetch) {
                setIsFetchingUser(true);
                const { db } = await import('../lib/firebase');
                const { doc, getDoc } = await import('firebase/firestore');
                const docRef = doc(db, 'users', userIdToFetch);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setExtendedUser({ ...docSnap.data(), id: userIdToFetch });
                } else if (isOwnProfile && authUser) {
                    setExtendedUser(authUser);
                } else {
                    setExtendedUser({
                        username: t('profile.defaultUser', 'Usuari'),
                        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${userIdToFetch}`,
                        id: userIdToFetch
                    });
                }
                setIsFetchingUser(false);
            }
        };
        fetchUserData();
    }, [userIdToFetch, authUser, isOwnProfile]);

    useEffect(() => {
        if (!userIdToFetch) return;
        const fetchPosts = async () => {
            setIsFetchingPosts(true);
            try {
                const { db } = await import('../lib/firebase');
                const { collection, query, where, getDocs } = await import('firebase/firestore');
                const q = query(collection(db, 'community_posts'), where('userId', '==', userIdToFetch));
                const snapshot = await getDocs(q);
                const posts: CommunityPost[] = [];
                snapshot.forEach(doc => {
                    posts.push({ id: doc.id, ...doc.data() } as CommunityPost);
                });
                posts.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
                setUserPosts(posts);
            } catch (err) {
                console.error("Error fetching user posts:", err);
            } finally {
                setIsFetchingPosts(false);
            }
        };
        fetchPosts();
    }, [userIdToFetch]);

    useEffect(() => {
        if (!isOwnProfile || !authUser) return;
        let unsubscribeMsg = () => {};
        let unsubscribeNotif = () => {};

        const setup = async () => {
            const { db } = await import('../lib/firebase');
            const { collection, query, where, onSnapshot } = await import('firebase/firestore');
            const qMsg = query(collection(db, 'messages'), where('receiverId', '==', authUser.id), where('read', '==', false));
            unsubscribeMsg = onSnapshot(qMsg, (snapshot) => setUnreadCount(snapshot.size));

            const qNotif = query(collection(db, 'notifications'), where('userId', '==', authUser.id), where('read', '==', false));
            unsubscribeNotif = onSnapshot(qNotif, (snapshot) => setUnreadNotificationsCount(snapshot.size));
        };

        setup();
        return () => { unsubscribeMsg(); unsubscribeNotif(); };
    }, [isOwnProfile, authUser]);

    const handleUpdateProfile = async (data: any) => {
        if (!authUser?.id) return;
        const { db, auth } = await import('../lib/firebase');
        const { doc, setDoc } = await import('firebase/firestore');
        const { updateProfile } = await import('firebase/auth');
        const userRef = doc(db, 'users', authUser.id);
        try {
            await setDoc(userRef, data, { merge: true });
            if (auth.currentUser && data.username) {
                await updateProfile(auth.currentUser, { displayName: data.username, photoURL: data.avatar || auth.currentUser.photoURL });
            }
            setExtendedUser((prev: any) => ({ ...prev, ...data }));
            if (data.username !== authUser.username && data.username) window.location.reload();
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const handleImageUpload = async (attachments: Attachment[], field: 'avatar' | 'banner') => {
        if (attachments.length > 0) {
            await handleUpdateProfile({ [field]: attachments[0].url });
        }
    };

    if (!userIdToFetch && !authLoading) return <Navigate to="/login" replace />;

    if (authLoading || isFetchingUser || !extendedUser) {
        return (
            <div className="min-h-screen flex items-center justify-center relative z-10 w-full bg-[#0a0a0a]">
                <Spinner size="lg" variant="primary" />
            </div>
        );
    }

    const rank = getRank(userContributions.length);
    const displayUrl = (url: string) => {
        try { return new URL(url).hostname; } catch { return url; }
    };


    const bannerUrl = extendedUser?.banner || `https://picsum.photos/seed/${extendedUser?.username || 'Apunts'}/1920/1080`;
    const avatarUrl = extendedUser?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${extendedUser?.username}`;

    return (
        <div className="min-h-screen w-full relative z-10 font-sans bg-transparent">

            {/* HERO SECTION - Premium Bento Approach */}
            <div className="relative w-full h-[280px] md:h-[320px] lg:h-[380px] mb-8 group/hero">
                {/* Immersive background header with smooth mask. Native scroll listener handles overscroll scale. */}
                <div 
                    ref={bannerRef}
                    className="absolute inset-0 apple-mask-hero pointer-events-none select-none overflow-hidden"
                    style={{
                        transformOrigin: 'top',
                        willChange: 'transform' // Performance optimization
                    }}
                >
                    <div className="absolute inset-0 bg-cover bg-center opacity-40 blur-[40px] scale-110 transition-opacity duration-1000" style={{ backgroundImage: `url(${bannerUrl})` }} />
                    <div className="absolute inset-0 bg-cover bg-center opacity-70 transition-opacity duration-1000" style={{ backgroundImage: `url(${bannerUrl})` }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/60 to-transparent opacity-100" />
                </div>

                {isOwnProfile && (
                    <div className="absolute top-20 right-4 z-30 opacity-0 group-hover/hero:opacity-100 transition-opacity duration-300 pointer-events-auto">
                        <div className="relative overflow-hidden rounded-xl">
                            <button type="button" className="flex items-center bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/20 p-2 text-white transition-all font-semibold shadow-lg text-sm cursor-pointer">
                                <Upload size={16} /> 
                            </button>
                            <FileUploader 
                                variant="avatar" 
                                acceptType="images"
                                maxFiles={1} 
                                onUploadComplete={(atts) => handleImageUpload(atts, 'banner')} 
                            />
                        </div>
                    </div>
                )}

                <div className="absolute bottom-0 left-0 w-full px-4 md:px-8 max-w-[1100px] left-1/2 -translate-x-1/2 flex items-end gap-5 md:gap-8 translate-y-1/3 z-20">
                    <motion.div initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="relative shrink-0 group/avatar">
                        <div className="w-24 h-24 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-[1.5rem] md:rounded-[2rem] p-1 bg-white/10 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/20 relative overflow-hidden">
                            <img src={avatarUrl} alt={extendedUser?.username} loading="lazy" className="w-full h-full rounded-[1.2rem] md:rounded-[1.7rem] object-cover bg-[#111]" />
                            {isOwnProfile && (
                                <div className="absolute inset-1 rounded-[1.2rem] md:rounded-[1.7rem] bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white cursor-pointer overflow-hidden z-10">
                                    <Upload size={24} className="mb-1 relative z-20 pointer-events-none" />
                                    <span className="text-xs font-bold tracking-widest uppercase text-center px-2 relative z-20 pointer-events-none">{t('common.change', 'Canviar')}</span>
                                    <div className="absolute inset-0 z-10">
                                        <FileUploader 
                                            variant="avatar" 
                                            acceptType="images"
                                            maxFiles={1} 
                                            onUploadComplete={(atts) => handleImageUpload(atts, 'avatar')} 
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="pb-2 md:pb-4 flex-1 flex flex-col sm:flex-row sm:items-end justify-between gap-4 relative z-20">
                        <div>
                            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-1 drop-shadow-lg">
                                <InlineEditableText 
                                    value={extendedUser?.username || t('profile.defaultUser', 'Usuari')}
                                    onSave={async (val) => await handleUpdateProfile({ username: val })}
                                    isEditable={isOwnProfile}
                                />
                            </h1>
                            <div className="text-sm md:text-base text-slate-300 font-medium tracking-wide max-w-xl">
                                <InlineEditableText 
                                    value={extendedUser?.bio || ''}
                                    placeholder={t('profile.edit.bioPlaceholder', "Creative Developer")}
                                    onSave={async (val) => await handleUpdateProfile({ bio: val })}
                                    isEditable={isOwnProfile}
                                    multiline={true}
                                />
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3 shrink-0">
                            {isOwnProfile ? (
                                <button type="button" onClick={logout} className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all border border-red-500/20 shadow-lg">
                                    <LogOut size={16} strokeWidth={2.5} />
                                </button>
                            ) : (
                                <button type="button" onClick={() => { if (!authUser) return window.location.href = '/login'; setIsComposeOpen(true); }} className="flex items-center gap-2 bg-white hover:bg-slate-200 text-black px-5 py-2.5 rounded-xl transition-all font-bold shadow-lg text-sm">
                                    <Send size={16} strokeWidth={2.5} /> <span>{t('profile.contact', 'Contactar')}</span>
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* BENTO GRID CONTENT */}
            <div className="max-w-[1100px] mx-auto px-4 md:px-8 w-full mt-24 md:mt-28 relative z-30 pb-32">
                
                {(extendedUser?.role === 'moderador' || extendedUser?.role === 'editor') && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-4 md:mb-5">
                        
                        {/* Solucionaris Card */}
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="h-full">
                            <div className="premium-bento-card rounded-3xl p-6 md:p-8 h-full flex flex-col justify-between group">
                                <div className="p-3 w-fit rounded-xl bg-white/5 border border-white/10 text-slate-400 mb-6 group-hover:text-white group-hover:border-white/20 transition-all">
                                    <Upload size={20} strokeWidth={2} />
                                </div>
                                <div>
                                    <span className="block text-4xl md:text-5xl font-bold tracking-tight text-white mb-2 tabular-nums">
                                        {userContributions.length}
                                    </span>
                                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <div className="h-px w-4 bg-slate-700 group-hover:w-8 group-hover:bg-white/50 transition-all" />
                                        {t('profile.stats.solutions', 'SOLUCIONARIS')}
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Rank Card (Wider) */}
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="h-full md:col-span-1 relative z-50">
                            <div className="premium-bento-card rounded-3xl p-6 md:p-8 h-full flex flex-col justify-between group relative overflow-visible">
                                <div className="flex justify-between items-start w-full relative z-40 mb-6">
                                    <div className="p-3 w-fit rounded-xl bg-white/5 border border-white/10 text-slate-400 group-hover:text-white group-hover:border-white/20 transition-all">
                                        <User size={20} strokeWidth={2} />
                                    </div>
                                    <div className="group/info cursor-help">
                                        <div className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-slate-500 group-hover/info:text-white">
                                            <Info size={16} />
                                        </div>
                                        {/* Rank Tooltip */}
                                        <div className="absolute right-0 top-full mt-2 w-64 p-5 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] opacity-0 invisible group-hover/info:opacity-100 group-hover/info:visible transition-all duration-300 origin-top-right translate-y-2 group-hover/info:translate-y-0 z-50 pointer-events-none">
                                            <h4 className="font-bold text-white mb-4 tracking-tight text-xs uppercase">{t('profile.stats.rankScale', 'Escala de Rangs')}</h4>
                                            <ul className="space-y-2.5 text-[11px] font-semibold">
                                                <li className="flex justify-between items-center"><span className="text-orange-500">Bronze</span> <span className="text-slate-500 tabular-nums">0+</span></li>
                                                <li className="flex justify-between items-center"><span className="text-slate-300">Silver</span> <span className="text-slate-500 tabular-nums">5+</span></li>
                                                <li className="flex justify-between items-center"><span className="text-yellow-400">Gold</span> <span className="text-slate-500 tabular-nums">10+</span></li>
                                                <li className="flex justify-between items-center"><span className="text-cyan-400">Platinum</span> <span className="text-slate-500 tabular-nums">15+</span></li>
                                                <li className="flex justify-between items-center"><span className="text-blue-500">Diamond</span> <span className="text-slate-500 tabular-nums">20+</span></li>
                                                <li className="flex justify-between items-center"><span className="text-purple-500">Champion</span> <span className="text-slate-500 tabular-nums">25+</span></li>
                                                <li className="flex justify-between items-center"><span className="text-red-500">Grand Champion</span> <span className="text-slate-500 tabular-nums">35+</span></li>
                                                <li className="flex justify-between items-center"><span className="ssl-platinum-rank text-transparent bg-clip-text font-black">SSL</span> <span className="text-slate-400 tabular-nums">50+</span></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative z-20">
                                    <div 
                                        className={`flex items-baseline gap-2 mb-2 ${rank.color}`}
                                        onMouseEnter={rank.name === 'SSL' ? () => setIsHoveringSSL(true) : undefined}
                                        onMouseLeave={rank.name === 'SSL' ? () => setIsHoveringSSL(false) : undefined}
                                    >
                                        {rank.name === 'SSL' && <SSLParticles isHovered={isHoveringSSL} />}
                                        <span className={`text-3xl md:text-4xl font-bold tracking-tight truncate ${rank.color.includes('bg-clip-text') ? rank.color : 'text-white'}`}>
                                            {rank.name}
                                        </span>
                                        {rank.division && (
                                            <div className="flex gap-1 ml-1">
                                                {[1, 2, 3].map((bar) => {
                                                    const isActive = bar <= (rank.division === 'I' ? 1 : rank.division === 'II' ? 2 : 3);
                                                    return (
                                                        <div key={bar} className={`h-4 w-1.5 rounded-[1px] skew-x-[-15deg] transition-all duration-300 ${isActive ? `bg-current shadow-[0_0_8px_currentColor] opacity-100` : 'bg-white/10'}`} />
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <div className="h-px w-4 bg-slate-700 group-hover:w-8 group-hover:bg-white/50 transition-all" />
                                        {t('profile.stats.currentLevel', 'NIVELL ACTUAL')}
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Portfolio Card */}
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="h-full">
                            <div className={`premium-bento-card rounded-3xl p-6 md:p-8 h-full flex flex-col justify-between group ${(extendedUser?.portfolio && !isOwnProfile) ? 'premium-bento-hover cursor-pointer' : 'opacity-80 hover:opacity-100 transition-opacity'}`}>
                                {extendedUser?.portfolio && !isOwnProfile && (
                                    <a href={extendedUser.portfolio} target="_blank" rel="noreferrer" className="absolute inset-0 z-10" />
                                )}
                                <div className="flex justify-between items-start w-full relative z-40 mb-6 pointer-events-none">
                                    <div className="p-3 w-fit rounded-xl bg-white/5 border border-white/10 text-slate-400 group-hover:text-white group-hover:border-white/20 transition-all">
                                        <Globe size={20} strokeWidth={2} />
                                    </div>
                                    {extendedUser?.portfolio && (
                                        <a href={extendedUser.portfolio} target="_blank" rel="noreferrer" className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors pointer-events-auto" title="Visitar Portfoli">
                                            <Globe size={16} />
                                        </a>
                                    )}
                                </div>
                                <div className="relative z-20 pointer-events-auto">
                                    <InlineEditableText 
                                        value={extendedUser?.portfolio || ''} 
                                        onSave={async (val) => await handleUpdateProfile({ portfolio: val })} 
                                        placeholder={t('profile.stats.noLink', 'Sense vincular')}
                                        isEditable={isOwnProfile}
                                        className="block text-xl md:text-2xl font-bold tracking-tight text-white mb-2 truncate"
                                        inputClassName="text-base font-normal mt-2 mb-2"
                                    />
                                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-2 pointer-events-none mt-2">
                                        <div className={`h-px bg-slate-700 transition-all ${extendedUser?.portfolio ? 'w-4 group-hover:w-8 group-hover:bg-white/50' : 'w-4'}`} />
                                        {t('profile.stats.portfolio', 'PORTFOLI')}
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                    </div>
                )}

                {/* Mailing & Notifications Row */}
                {isOwnProfile && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                        <motion.button initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} onClick={() => setIsMailboxOpen(true)} className="text-left outline-none">
                            <div className="premium-bento-card premium-bento-hover rounded-3xl p-6 md:p-8 flex items-center gap-5 group w-full">
                                <div className="relative">
                                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 group-hover:text-white group-hover:border-white/20 transition-all shadow-lg">
                                        <Mail size={20} strokeWidth={2} />
                                    </div>
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg border-2 border-[#0d0f17]">
                                            {unreadCount}
                                        </span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base md:text-lg font-bold text-white mb-0.5 tracking-tight group-hover:text-white transition-colors">{t('profile.inbox.privateMailbox', 'Bústia Privada')}</h3>
                                    <p className="text-sm text-slate-500 truncate">
                                        {unreadCount > 0 ? t('profile.inbox.pendingMessages', 'Tens {{count}} missatges pendents', { count: unreadCount }) : t('profile.inbox.allRead', 'Tot llegit.')}
                                    </p>
                                </div>
                            </div>
                        </motion.button>

                        <motion.button initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} onClick={() => setIsInboxOpen(true)} className="text-left outline-none">
                            <div className="premium-bento-card premium-bento-hover rounded-3xl p-6 md:p-8 flex items-center gap-5 group w-full">
                                <div className="relative">
                                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 group-hover:text-white group-hover:border-white/20 transition-all shadow-lg">
                                        <Bell size={20} strokeWidth={2} />
                                    </div>
                                    {unreadNotificationsCount > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg border-2 border-[#0d0f17]">
                                            {unreadNotificationsCount}
                                        </span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base md:text-lg font-bold text-white mb-0.5 tracking-tight group-hover:text-white transition-colors">{t('profile.notifications.title', 'Notificacions')}</h3>
                                    <p className="text-sm text-slate-500 truncate">
                                        {unreadNotificationsCount > 0 ? t('profile.notifications.unread', '{{count}} novetats sense llegir', { count: unreadNotificationsCount }) : t('profile.notifications.upToDate', 'Estàs al dia.')}
                                    </p>
                                </div>
                            </div>
                        </motion.button>
                    </div>
                )}
            </div>

            {/* USER POSTS MASONRY GRID */}
            <div className="max-w-[1100px] mx-auto px-4 md:px-8 w-full mt-4 md:mt-8 pb-32 relative z-30">
                <div className="mb-8 border-b border-white/5 pb-4">
                    <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                        {t('profile.posts.title', 'Publicacions')}
                        <span className="bg-white/10 text-white text-xs py-1 px-2.5 rounded-full font-bold">
                            {userPosts.length}
                        </span>
                    </h2>
                </div>

                {isFetchingPosts ? (
                    <div className="flex justify-center items-center py-20">
                        <Spinner size="md" variant="primary" />
                    </div>
                ) : userPosts.length > 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
                    >
                        {userPosts.map(post => (
                            <div key={post.id} className="break-inside-avoid" onClick={() => setSelectedPost(post)}>
                                <PublicationCard post={post} />
                            </div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-slate-500 font-medium">{t('profile.posts.noPosts', 'Aquest usuari encara no ha publicat res.')}</p>
                    </div>
                )}
            </div>

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
                {selectedPost && (
                    <PostDetailModal
                        isOpen={!!selectedPost}
                        onClose={() => setSelectedPost(null)}
                        post={selectedPost}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProfilePage;
