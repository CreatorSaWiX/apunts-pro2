import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { LogOut, Upload, Mail, Send, Bell, ExternalLink } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { m as motion, AnimatePresence } from 'framer-motion';
import MailboxModal from '../components/mailing/MailboxModal';
import ComposeMessageModal from '../components/mailing/ComposeMessageModal';
import InboxModal from '../components/notifications/InboxModal';
import Spinner from '../components/ui/Spinner';
import FileUploader, { type Attachment } from '../components/ui/inputs/FileUploader';
import type { CommunityPost } from '../types/community';
import PublicationCard from '../components/community/PublicationCard';
import { useTranslation } from 'react-i18next';
import InlineEditableText from '../components/ui/inputs/InlineEditableText';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../contexts/AuthContext';

import { resolveMediaUrl, isVideoUrl } from '../lib/mediaUtils';

const PostDetailModal = lazy(() => import('../components/community/PostDetailModal'));

const ProfilePage = () => {
    const { t } = useTranslation();
    const { username } = useParams();
    const { user: authUser, logout, isLoading: authLoading } = useAuth();
    
    const {
        extendedUser,
        isFetchingUser,
        isOwnProfile,
        userPosts,
        isFetchingPosts,
        hasMorePosts,
        loadMorePosts,
        unreadCount,
        unreadNotificationsCount,
        handleUpdateProfile,
        setUserPosts
    } = useProfile(username);

    const [isMailboxOpen, setIsMailboxOpen] = useState(false);
    const [isInboxOpen, setIsInboxOpen] = useState(false);
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
    const bannerRef = React.useRef<HTMLDivElement>(null);

    const setupVideo = useCallback((el: HTMLVideoElement | null) => {
        if (el) {
            el.muted = true;
            el.defaultMuted = true;
            el.playsInline = true;
            el.play().catch(() => {});
        }
    }, []);

    const bannerUrl = resolveMediaUrl(extendedUser?.banner) || `https://picsum.photos/seed/${extendedUser?.username || 'Apunts'}/1920/1080`;
    const avatarUrl = resolveMediaUrl(extendedUser?.avatar) || `https://api.dicebear.com/7.x/initials/svg?seed=${extendedUser?.username}`;
    const isBannerVideo = Boolean(bannerUrl && isVideoUrl(bannerUrl));

    // Parallax effect for the banner
    useEffect(() => {
        let animationFrameId: number;

        const render = () => {
            if (!bannerRef.current) return;
            const y = window.scrollY;

            if (y < 0) {
                const bannerHeight = bannerRef.current.offsetHeight || 380;
                const scale = 1 + (Math.abs(y) / bannerHeight);
                bannerRef.current.style.transform = `translate3d(0, ${y}px, 0) scale(${scale})`;
            } else if (y > 0) {
                const isMobile = window.innerWidth < 768;
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
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const handleImageUpload = async (attachments: Attachment[], field: 'avatar' | 'banner') => {
        if (attachments.length > 0) {
            await handleUpdateProfile({ [field]: attachments[0].url });
        }
    };

    if (isFetchingUser || !extendedUser) {
        return (
            <div className="min-h-screen flex items-center justify-center w-full">
                <Spinner size="2xl" variant="primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full relative z-10 font-sans bg-transparent">
            {/* HERO SECTION */}
            <div className="relative w-full flex flex-col mb-4 md:mb-8 group/hero">
                <div className="relative w-full h-[220px] md:h-[320px] lg:h-[380px]">
                    <div ref={bannerRef} className="absolute inset-0 apple-mask-hero pointer-events-none select-none overflow-hidden" style={{ transformOrigin: 'top' }}>
                        {isBannerVideo ? (
                            <>
                                <video 
                                    ref={setupVideo}
                                    src={bannerUrl} 
                                    autoPlay 
                                    loop 
                                    muted 
                                    playsInline 
                                    preload="auto"
                                    className="absolute inset-0 object-cover w-full h-full opacity-40 blur-2xl scale-110 transition-opacity duration-700" 
                                />
                                <video 
                                    ref={setupVideo}
                                    src={bannerUrl} 
                                    autoPlay 
                                    loop 
                                    muted 
                                    playsInline 
                                    preload="auto"
                                    className="absolute inset-0 object-cover w-full h-full opacity-70 transition-opacity duration-700" 
                                />
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
                                <button type="button" className="flex items-center gap-2 bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/20 px-3 py-2 text-white transition font-medium shadow-lg text-xs cursor-pointer">
                                    <Upload size={14} />
                                    <span className="hidden sm:inline">{t('profile.bannerFormatHint', '2MB max (WebP/WebM recomanat)')}</span>
                                </button>
                                <FileUploader variant="avatar" acceptType="imagesAndVideos" maxSizeMB={2} maxFiles={1} onUploadComplete={(atts) => handleImageUpload(atts, 'banner')} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile Info Container */}
                <div className="w-full px-4 md:px-8 max-w-[1100px] mx-auto flex flex-col md:flex-row md:items-end gap-4 md:gap-8 relative z-20 -mt-16 md:-mt-20">
                    <motion.div initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="relative shrink-0 group/avatar mx-auto md:mx-0">
                        <div className="absolute inset-0 bg-primary/20 blur-[30px] rounded-full pointer-events-none md:opacity-50 opacity-100" />
                        <div className="w-24 h-24 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-[1.25rem] md:rounded-[2rem] p-1 bg-[#020617]/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/20 relative overflow-hidden z-10">
                            <img src={avatarUrl} alt={extendedUser?.username} loading="eager" fetchPriority="high" className="w-full h-full rounded-[1rem] md:rounded-[1.7rem] object-cover bg-[#111]" />
                            {isOwnProfile && (
                                <div className="absolute inset-1 rounded-[1rem] md:rounded-[1.7rem] bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white cursor-pointer overflow-hidden z-10">
                                    <Upload size={24} className="mb-1 relative z-20 pointer-events-none" />
                                    <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-center px-2 relative z-20 pointer-events-none">{t('common.change', 'Canviar')}</span>
                                    <div className="absolute inset-0 z-10">
                                        <FileUploader variant="avatar" acceptType="images" maxFiles={1} maxSizeMB={5} onUploadComplete={(atts) => handleImageUpload(atts, 'avatar')} />
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
                                    <button type="button" onClick={() => setIsMailboxOpen(true)} className="relative p-3 md:p-2.5 rounded-full md:rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition border border-white/10 shadow-lg" title={t('profile.inbox.privateMailbox', 'Bústia Privada')}>
                                        <Mail size={18} strokeWidth={2.5} className="md:w-4 md:h-4" />
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-lg border border-[#0d0f17]">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </button>
                                    <button type="button" onClick={() => setIsInboxOpen(true)} className="relative p-3 md:p-2.5 rounded-full md:rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition border border-white/10 shadow-lg" title={t('profile.notifications.title', 'Notificacions')}>
                                        <Bell size={18} strokeWidth={2.5} className="md:w-4 md:h-4" />
                                        {unreadNotificationsCount > 0 && (
                                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-lg border border-[#0d0f17]">
                                                {unreadNotificationsCount}
                                            </span>
                                        )}
                                    </button>
                                    <button type="button" onClick={logout} className="p-3 md:p-2.5 rounded-full md:rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition border border-red-500/20 shadow-lg" title={t('common.logout', 'Tancar sessió')}>
                                        <LogOut size={18} strokeWidth={2.5} className="md:w-4 md:h-4" />
                                    </button>
                                </>
                            ) : (
                                <button type="button" onClick={() => { if (!authUser) return window.location.href = '/login'; setIsComposeOpen(true); }} className="flex items-center gap-2 bg-white hover:bg-slate-200 text-black px-6 md:px-5 py-3 md:py-2.5 rounded-full md:rounded-xl transition font-bold shadow-lg text-sm md:text-sm">
                                    <Send size={16} strokeWidth={2.5} /> <span>{t('profile.contact', 'Contactar')}</span>
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* USER POSTS */}
            <div className="max-w-[1100px] mx-auto px-4 md:px-8 w-full mt-8 md:mt-12 lg:mt-20 pb-32 relative z-30">
                {isFetchingPosts && userPosts.length === 0 ? (
                    <div className="flex justify-center items-center py-20">
                        <Spinner size="md" variant="primary" />
                    </div>
                ) : userPosts.length > 0 ? (
                    <>
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                            className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6 max-w-[1200px] mx-auto"
                        >
                            {userPosts.map(post => (
                                <div key={post.id} className="break-inside-avoid mb-4 md:mb-6 cursor-pointer" onClick={() => setSelectedPost(post)}>
                                    <PublicationCard post={post} />
                                </div>
                            ))}
                        </motion.div>
                        
                        {hasMorePosts && (
                            <div className="flex justify-center mt-12 mb-8">
                                <button 
                                    onClick={loadMorePosts}
                                    className="px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition border border-white/10 shadow-lg text-sm font-semibold flex items-center gap-2"
                                >
                                    {t('common.loadMore', 'Carregar més')}
                                </button>
                            </div>
                        )}
                    </>
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
                                onDelete={(postId) => {
                                    setUserPosts(prev => prev.filter(p => p.id !== postId));
                                }}
                            />
                        </Suspense>
                    );
                })()}
            </AnimatePresence>
        </div>
    );
};

export default ProfilePage;
