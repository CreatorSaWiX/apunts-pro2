import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Upload, Mail, Send, Bell, ExternalLink } from 'lucide-react';
import { useParams, Navigate } from 'react-router-dom';

import { m as motion, AnimatePresence } from 'framer-motion';
import MailboxModal from '../components/mailing/MailboxModal';
import ComposeMessageModal from '../components/mailing/ComposeMessageModal';
import InboxModal from '../components/notifications/InboxModal';
import Spinner from '../components/ui/Spinner';

import FileUploader, { type Attachment } from '../components/ui/inputs/FileUploader';
import type { CommunityPost } from '../types/community';
import PublicationCard from '../components/community/PublicationCard';
const PostDetailModal = lazy(() => import('../components/community/PostDetailModal'));
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '../hooks/useIsMobile';

// --- Inline Editable Text Component ---
const InlineEditableText = ({
    value,
    onSave,
    className,
    placeholder,
    isEditable,
    multiline = false,
    inputClassName = '',
    externalLink
}: {
    value: string;
    onSave: (val: string) => Promise<void>;
    className?: string;
    placeholder?: string;
    isEditable: boolean;
    multiline?: boolean;
    inputClassName?: string;
    externalLink?: string;
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
        <span className="inline-flex items-center gap-1.5">
            <span
                onClick={() => setIsEditing(true)}
                className={`${className} cursor-text group/inline relative inline-flex items-center`}
                title={t('common.clickToEdit', 'Fes clic per editar')}
            >
                <span className="line-clamp-2">{value || <span className="text-slate-500 italic">{placeholder}</span>}</span>
            </span>
            {externalLink && value && (
                <a href={externalLink} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white transition-colors cursor-pointer" title="Visitar" onClick={(e) => e.stopPropagation()}>
                    <ExternalLink size={14} strokeWidth={2.5} />
                </a>
            )}
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

    const [isMailboxOpen, setIsMailboxOpen] = useState(false);
    const [isInboxOpen, setIsInboxOpen] = useState(false);
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

    interface ExtendedUser {
        id: string;
        username: string;
        avatar?: string;
        banner?: string;
        bio?: string;
        portfolio?: string;
        role?: string;
        email?: string;
    }

    const [extendedUser, setExtendedUser] = useState<ExtendedUser | null>(null);
    const [isFetchingUser, setIsFetchingUser] = useState(true);

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
                bannerRef.current.style.transform = `translate3d(0, ${y}px, 0) scale(${scale})`;
            } else if (y > 0) {
                // Parallax Effect on Scroll Down
                const isMobile = window.innerWidth < 768;
                // Stronger parallax for mobile
                const parallaxSpeed = isMobile ? 0.75 : 0.4;
                const fadeSpeed = isMobile ? 400 : 500;
                
                bannerRef.current.style.transform = `translate3d(0, ${y * parallaxSpeed}px, 0) scale(1)`;
                const opacity = Math.max(0, 1 - (y / fadeSpeed));
                bannerRef.current.style.opacity = opacity.toString();
            } else {
                bannerRef.current.style.transform = `translate3d(0, 0px, 0) scale(1)`;
                bannerRef.current.style.opacity = '1';
            }
        };

        const handleScroll = () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(render);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, []);

    useEffect(() => {
        let isMounted = true;
        const fetchUserData = async () => {
            if (userIdToFetch) {
                setIsFetchingUser(true);
                const { db } = await import('../lib/firebase');
                const { doc, getDoc } = await import('firebase/firestore');
                if (!isMounted) return;
                
                const docRef = doc(db, 'users', userIdToFetch);
                const docSnap = await getDoc(docRef);
                
                if (!isMounted) return;

                if (docSnap.exists()) {
                    setExtendedUser({ ...docSnap.data(), id: userIdToFetch } as ExtendedUser);
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
        return () => { isMounted = false; };
    }, [userIdToFetch, authUser, isOwnProfile, t]);

    useEffect(() => {
        if (!userIdToFetch) return;
        let isMounted = true;
        
        const fetchPosts = async () => {
            setIsFetchingPosts(true);
            try {
                const { db } = await import('../lib/firebase');
                const { collection, query, where, getDocs } = await import('firebase/firestore');
                if (!isMounted) return;

                const q = query(collection(db, 'community_posts'), where('userId', '==', userIdToFetch));
                const snapshot = await getDocs(q);
                
                if (!isMounted) return;

                const posts: CommunityPost[] = [];
                snapshot.forEach(doc => {
                    posts.push({ id: doc.id, ...doc.data() } as CommunityPost);
                });
                posts.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
                setUserPosts(posts);
            } catch (err) {
                console.error("Error fetching user posts:", err);
            } finally {
                if (isMounted) setIsFetchingPosts(false);
            }
        };
        fetchPosts();
        return () => { isMounted = false; };
    }, [userIdToFetch]);

    useEffect(() => {
        if (!isOwnProfile || !authUser) return;
        let isMounted = true;
        let unsubscribeMsg: (() => void) | undefined;
        let unsubscribeNotif: (() => void) | undefined;

        const setup = async () => {
            const { db } = await import('../lib/firebase');
            const { collection, query, where, onSnapshot } = await import('firebase/firestore');
            
            if (!isMounted) return;

            const qMsg = query(collection(db, 'messages'), where('receiverId', '==', authUser.id), where('read', '==', false));
            unsubscribeMsg = onSnapshot(qMsg, (snapshot) => setUnreadCount(snapshot.size));

            const qNotif = query(collection(db, 'notifications'), where('userId', '==', authUser.id), where('read', '==', false));
            unsubscribeNotif = onSnapshot(qNotif, (snapshot) => setUnreadNotificationsCount(snapshot.size));
        };

        setup();
        return () => { 
            isMounted = false;
            if (unsubscribeMsg) unsubscribeMsg(); 
            if (unsubscribeNotif) unsubscribeNotif(); 
        };
    }, [isOwnProfile, authUser]);

    const handleUpdateProfile = async (data: Partial<ExtendedUser>) => {
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
            setExtendedUser((prev: ExtendedUser | null) => prev ? { ...prev, ...data } : null);
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
            <div className="min-h-screen flex items-center justify-center w-full">
                <Spinner size="2xl" variant="primary" />
            </div>
        );
    }

    const getProxyUrl = (url: string | undefined | null) => {
        if (!url) return undefined;
        // Si estem en desenvolupament (Vite), passem pel proxy per evitar el bloqueig dels ISPs espanyols al subdomini .r2.dev
        if (import.meta.env.DEV && url.includes('.r2.dev/')) {
            const path = new URL(url).pathname;
            return `/api/cdn${path}`;
        } 
        return url;
    };

    const isVideoUrl = (url: string) => /\.(mp4|webm|mov|ogg)$/i.test(url.split('?')[0]);
    const bannerUrl = getProxyUrl(extendedUser?.banner) || `https://picsum.photos/seed/${extendedUser?.username || 'Apunts'}/1920/1080`;
    const avatarUrl = getProxyUrl(extendedUser?.avatar) || `https://api.dicebear.com/7.x/initials/svg?seed=${extendedUser?.username}`;
    const isBannerVideo = bannerUrl && isVideoUrl(bannerUrl);

    return (
        <div className="min-h-screen w-full relative z-10 font-sans bg-transparent">

            {/* HERO SECTION - Premium Bento Approach */}
            <div className="relative w-full flex flex-col mb-4 md:mb-8 group/hero">
                {/* Banner Container */}
                <div className="relative w-full h-[220px] md:h-[320px] lg:h-[380px]">
                    {/* Immersive background header with smooth mask. Native scroll listener handles overscroll scale. */}
                    <div
                        ref={bannerRef}
                        className="absolute inset-0 apple-mask-hero pointer-events-none select-none overflow-hidden"
                        style={{
                            transformOrigin: 'top',
                            willChange: 'transform' // Performance optimization
                        }}
                    >
                        {isBannerVideo ? (
                            <>
                                <video src={bannerUrl} autoPlay loop muted playsInline className="absolute inset-0 object-cover w-full h-full opacity-40 blur-[40px] scale-110 transition-opacity duration-1000" />
                                <video src={bannerUrl} autoPlay loop muted playsInline className="absolute inset-0 object-cover w-full h-full opacity-70 transition-opacity duration-1000" />
                            </>
                        ) : (
                            <>
                                <div className="absolute inset-0 bg-cover bg-center opacity-40 blur-[40px] scale-110 transition-opacity duration-1000" style={{ backgroundImage: `url(${bannerUrl})` }} />
                                <div className="absolute inset-0 bg-cover bg-center opacity-70 transition-opacity duration-1000" style={{ backgroundImage: `url(${bannerUrl})` }} />
                            </>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent opacity-100" />
                    </div>

                    {isOwnProfile && (
                        <div className="absolute top-20 right-4 z-30 opacity-0 group-hover/hero:opacity-100 transition-opacity duration-300 pointer-events-auto">
                            <div className="relative overflow-hidden rounded-xl">
                                <button type="button" className="flex items-center gap-2 bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/20 px-3 py-2 text-white transition-all font-medium shadow-lg text-xs cursor-pointer">
                                    <Upload size={14} />
                                    <span className="hidden sm:inline">{t('profile.bannerFormatHint', '2MB max (WebP/WebM recomanat)')}</span>
                                </button>
                                <FileUploader
                                    variant="avatar"
                                    acceptType="imagesAndVideos"
                                    maxSizeMB={2}
                                    maxFiles={1}
                                    onUploadComplete={(atts) => handleImageUpload(atts, 'banner')}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile Info Container */}
                <div className="w-full px-4 md:px-8 max-w-[1100px] mx-auto flex flex-col md:flex-row md:items-end gap-4 md:gap-8 relative z-20 -mt-16 md:-mt-20">
                    <motion.div initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="relative shrink-0 group/avatar mx-auto md:mx-0">
                        {/* Awwwards touch: subtle glow behind avatar */}
                        <div className="absolute inset-0 bg-primary/20 blur-[30px] rounded-full pointer-events-none md:opacity-50 opacity-100" />
                        <div className="w-24 h-24 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-[1.25rem] md:rounded-[2rem] p-1 bg-[#020617]/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/20 relative overflow-hidden z-10">
                            <img src={avatarUrl} alt={extendedUser?.username} loading="lazy" className="w-full h-full rounded-[1rem] md:rounded-[1.7rem] object-cover bg-[#111]" />
                            {isOwnProfile && (
                                <div className="absolute inset-1 rounded-[1rem] md:rounded-[1.7rem] bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white cursor-pointer overflow-hidden z-10">
                                    <Upload size={24} className="mb-1 relative z-20 pointer-events-none" />
                                    <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-center px-2 relative z-20 pointer-events-none">{t('common.change', 'Canviar')}</span>
                                    <div className="absolute inset-0 z-10">
                                        <FileUploader
                                            variant="avatar"
                                            acceptType="images"
                                            maxFiles={1}
                                            maxSizeMB={5}
                                            onUploadComplete={(atts) => handleImageUpload(atts, 'avatar')}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="pb-0 md:pb-4 flex-1 flex flex-col md:flex-row items-center md:items-end justify-between gap-5 md:gap-6 relative z-20 w-full">
                        <div className="flex flex-col items-center md:items-start relative z-20 w-full md:w-auto">
                            <h1 className="text-[28px] leading-tight md:text-5xl font-extrabold tracking-tight text-white mb-1.5 md:mb-1 drop-shadow-md text-center md:text-left flex items-center justify-center md:justify-start">
                                <InlineEditableText
                                    value={extendedUser?.username || t('profile.defaultUser', 'Usuari')}
                                    onSave={async (val) => await handleUpdateProfile({ username: val })}
                                    isEditable={isOwnProfile}
                                />
                            </h1>
                            <div className="flex flex-col md:flex-row items-center gap-2.5 md:gap-3 mt-1 w-full justify-center md:justify-start">
                                <div className="text-[15px] md:text-base text-slate-300 font-medium tracking-wide text-center md:text-left max-w-70 md:max-w-none leading-snug">
                                    <InlineEditableText
                                        value={extendedUser?.bio || ''}
                                        placeholder={t('profile.edit.bioPlaceholder', "Creative Developer")}
                                        onSave={async (val) => await handleUpdateProfile({ bio: val })}
                                        isEditable={isOwnProfile}
                                        multiline={false}
                                    />
                                </div>
                                {(extendedUser?.portfolio || isOwnProfile) && (
                                    <div className="flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-slate-600 hidden md:block" />
                                        <div className="flex items-center text-[13px] md:text-sm font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer bg-white/5 md:bg-transparent px-3.5 py-1.5 md:px-0 md:py-0 rounded-full border border-white/10 md:border-none backdrop-blur-md md:backdrop-blur-none">
                                            {extendedUser?.portfolio && !isOwnProfile ? (
                                                <a href={extendedUser.portfolio} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1.5">
                                                    {extendedUser.portfolio.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                                                    <ExternalLink size={14} strokeWidth={2.5} />
                                                </a>
                                            ) : (
                                                <InlineEditableText
                                                    value={extendedUser?.portfolio || ''}
                                                    onSave={async (val) => await handleUpdateProfile({ portfolio: val })}
                                                    placeholder={t('profile.stats.noLink', 'Afegeix portfoli')}
                                                    isEditable={isOwnProfile}
                                                    externalLink={extendedUser?.portfolio}
                                                />
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-3 shrink-0 mt-2 md:mt-0 pb-2 md:pb-0">
                            {isOwnProfile ? (
                                <>
                                    <button type="button" onClick={() => setIsMailboxOpen(true)} className="relative p-3 md:p-2.5 rounded-full md:rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all border border-white/10 shadow-lg" title={t('profile.inbox.privateMailbox', 'Bústia Privada')}>
                                        <Mail size={18} strokeWidth={2.5} className="md:w-4 md:h-4" />
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-lg border border-[#0d0f17]">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </button>
                                    <button type="button" onClick={() => setIsInboxOpen(true)} className="relative p-3 md:p-2.5 rounded-full md:rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all border border-white/10 shadow-lg" title={t('profile.notifications.title', 'Notificacions')}>
                                        <Bell size={18} strokeWidth={2.5} className="md:w-4 md:h-4" />
                                        {unreadNotificationsCount > 0 && (
                                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-lg border border-[#0d0f17]">
                                                {unreadNotificationsCount}
                                            </span>
                                        )}
                                    </button>
                                    <button type="button" onClick={logout} className="p-3 md:p-2.5 rounded-full md:rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all border border-red-500/20 shadow-lg" title={t('common.logout', 'Tancar sessió')}>
                                        <LogOut size={18} strokeWidth={2.5} className="md:w-4 md:h-4" />
                                    </button>
                                </>
                            ) : (
                                <button type="button" onClick={() => { if (!authUser) return window.location.href = '/login'; setIsComposeOpen(true); }} className="flex items-center gap-2 bg-white hover:bg-slate-200 text-black px-6 md:px-5 py-3 md:py-2.5 rounded-full md:rounded-xl transition-all font-bold shadow-lg text-sm md:text-sm">
                                    <Send size={16} strokeWidth={2.5} /> <span>{t('profile.contact', 'Contactar')}</span>
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* USER POSTS MASONRY GRID */}
            <div className="max-w-[1100px] mx-auto px-4 md:px-8 w-full mt-8 md:mt-12 lg:mt-20 pb-32 relative z-30">
                {/* Posts title section removed per user request */}

                {isFetchingPosts ? (
                    <div className="flex justify-center items-center py-20">
                        <Spinner size="md" variant="primary" />
                    </div>
                ) : userPosts.length > 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                        className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6 max-w-[1200px] mx-auto pb-24"
                    >
                        {userPosts.map(post => (
                            <div key={post.id} className="break-inside-avoid mb-4 md:mb-6" onClick={() => setSelectedPost(post)}>
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
                {selectedPost && (() => {
                    const currentIdx = userPosts.findIndex(p => p.id === selectedPost.id);
                    const handlePrevPost = userPosts.length > 1 && currentIdx !== -1 ? () => {
                        const prevIdx = currentIdx > 0 ? currentIdx - 1 : userPosts.length - 1;
                        setSelectedPost(userPosts[prevIdx]);
                    } : undefined;
                    const handleNextPost = userPosts.length > 1 && currentIdx !== -1 ? () => {
                        const nextIdx = currentIdx < userPosts.length - 1 ? currentIdx + 1 : 0;
                        setSelectedPost(userPosts[nextIdx]);
                    } : undefined;

                    return (
                        <Suspense fallback={null}>
                            <PostDetailModal
                                isOpen={!!selectedPost}
                                onClose={() => setSelectedPost(null)}
                                post={selectedPost}
                                onPrev={handlePrevPost}
                                onNext={handleNextPost}
                            />
                        </Suspense>
                    );
                })()}
            </AnimatePresence>
        </div>
    );
};

export default ProfilePage;
