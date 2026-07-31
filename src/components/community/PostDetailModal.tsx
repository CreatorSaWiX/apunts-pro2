import { useEffect, useState } from 'react';
import type { CommunityPost } from '../../types/community';
import { m as motion, AnimatePresence, type Variants } from 'framer-motion';
import { X, Heart, Share2, Trash2, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import ReplySection from './ReplySection';
import FileViewerRenderer from './viewers/FileViewerRenderer';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { doc, updateDoc, deleteField, deleteDoc, collection, getDocs, increment, setDoc, serverTimestamp } from 'firebase/firestore';
import { HtmlRenderer } from '../ui/HtmlRenderer';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';
import { ca, es, enUS } from 'date-fns/locale';
import BottomSheet from '../ui/mobile/BottomSheet';
import { useIsMobile } from '../../hooks/useIsMobile';

interface PostDetailModalProps {
    post: CommunityPost | null;
    isOpen: boolean;
    onClose: () => void;
    onNext?: () => void;
    onPrev?: () => void;
}

const PostDetailModal = ({ post, isOpen, onClose, onNext, onPrev }: PostDetailModalProps) => {
    const { t, i18n } = useTranslation();
    const { user } = useAuth();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [direction, setDirection] = useState<'next' | 'prev' | null>(null);
    const isMobile = useIsMobile();
    const [showCommentsMobile, setShowCommentsMobile] = useState(false);
    
    // Swipe gestures states
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [touchEndX, setTouchEndX] = useState<number | null>(null);
    const [touchStartY, setTouchStartY] = useState<number | null>(null);
    const [touchEndY, setTouchEndY] = useState<number | null>(null);

    useEffect(() => {
        if (!isOpen) return;
        
        // Lock body scroll to prevent background scrolling on mobile
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        
        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
                return;
            }
            if (e.key === 'ArrowLeft' && onPrev) {
                e.preventDefault();
                setDirection('prev');
                onPrev();
            } else if (e.key === 'ArrowRight' && onNext) {
                e.preventDefault();
                setDirection('next');
                onNext();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = originalOverflow;
        };
    }, [isOpen, onPrev, onNext]);

    const contentVariants: Variants = {
        enter: (dir: 'next' | 'prev' | null) => ({
            x: dir === 'next' ? 60 : dir === 'prev' ? -60 : 0,
            opacity: 0,
            scale: 0.98,
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: {
                x: { type: "spring", stiffness: 380, damping: 32 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.2 }
            }
        },
        exit: (dir: 'next' | 'prev' | null) => ({
            x: dir === 'next' ? -60 : dir === 'prev' ? 60 : 0,
            opacity: 0,
            scale: 0.98,
            transition: {
                x: { type: "spring", stiffness: 380, damping: 32 },
                opacity: { duration: 0.15 },
                scale: { duration: 0.15 }
            }
        })
    };

    const hasLiked = user && post?.reactions?.[user.id]?.emoji === '❤️';
    const likeCount = Object.values(post?.reactions || {}).filter(r => r.emoji === '❤️').length;

    useEffect(() => {
        setCurrentImageIndex(0);
    }, [post?.id]);

    const dateLocales: Record<string, any> = { ca, es, en: enUS };
    const currentLocale = dateLocales[i18n.language] || ca;
    
    let timeAgo = '';
    if (post?.createdAt) {
        try {
            const date = typeof post.createdAt.toDate === 'function' 
                ? post.createdAt.toDate() 
                : new Date(post.createdAt.seconds * 1000);
            timeAgo = formatDistanceToNow(date, { addSuffix: true, locale: currentLocale });
        } catch (e) {
            console.error('Error formatting date:', e);
        }
    }

    useEffect(() => {
        if (!post || !isOpen) return;

        const recordView = async () => {
            if (user && post.userId === user.id) return; // Els autors no sumen visualitzacions

            const storageKey = user ? `viewed_posts_${user.id}` : 'viewed_posts';
            const viewedPostsStr = localStorage.getItem(storageKey) || '{}';
            let viewedPosts: Record<string, boolean> = {};
            try {
                const parsed = JSON.parse(viewedPostsStr);
                if (Array.isArray(parsed)) {
                    parsed.forEach(id => viewedPosts[id] = true);
                } else {
                    viewedPosts = parsed;
                }
            } catch (e) { }

            if (!viewedPosts[post.id]) {
                viewedPosts[post.id] = true;
                localStorage.setItem(storageKey, JSON.stringify(viewedPosts));

                const postRef = doc(db, 'community_posts', post.id);
                try {
                    await updateDoc(postRef, {
                        views: increment(1)
                    });
                } catch (err) {
                    console.error('Error recording view:', err);
                }
            }
        };

        recordView();
    }, [post, isOpen, user]);

    const handleLike = async () => {
        if (!user || !post) return;
        const postRef = doc(db, 'community_posts', post.id);

        try {
            if (hasLiked) {
                await updateDoc(postRef, {
                    [`reactions.${user.id}`]: deleteField()
                });

                // Remove notification if un-liked
                if (post.userId !== user.id) {
                    await deleteDoc(doc(db, 'notifications', `like_${post.id}_${user.id}`));
                }
            } else {
                await updateDoc(postRef, {
                    [`reactions.${user.id}`]: {
                        emoji: '❤️',
                        username: user.username,
                        userId: user.id
                    }
                });

                if (post.userId !== user.id) {
                    await setDoc(doc(db, 'notifications', `like_${post.id}_${user.id}`), {
                        userId: post.userId,
                        type: 'like',
                        fromUserId: user.id,
                        fromUserName: user.username,
                        fromUserAvatar: user.avatar || '',
                        resourceId: post.id,
                        resourceTitle: post.content ? post.content.substring(0, 30) + '...' : 'Publicació',
                        commentId: 'community_post_like',
                        read: false,
                        createdAt: serverTimestamp()
                    });
                }
            }
        } catch (err) { console.error(err); }
    };

    const handleDelete = async () => {
        if (!post) return;
        if (!confirm(t('community.postDetail.deleteConfirm', 'Segur que vols eliminar aquesta publicació? Aquesta acció no es pot desfer.'))) return;
        try {
            // Eliminar respostes de la subcol·lecció primer
            const repliesRef = collection(db, 'community_posts', post.id, 'replies');
            const repliesSnapshot = await getDocs(repliesRef);
            await Promise.all(repliesSnapshot.docs.map(replyDoc => deleteDoc(replyDoc.ref)));

            await deleteDoc(doc(db, 'community_posts', post.id));

            // Sincronitzem l'esborrat amb Algolia
            fetch('/api/sync-algolia', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete', postId: post.id })
            }).catch(console.error);

            onClose();
        } catch (err) {
            console.error(err);
            alert(t('community.postDetail.deleteError', "Error en eliminar la publicació."));
        }
    };

    if (!isOpen || !post) return null;

    const postImages = post.attachments?.filter(a => a.type.startsWith('image/') && !a.isCustomThumbnail) || [];
    const postFiles = post.attachments?.filter(a => !a.type.startsWith('image/') && !a.isCustomThumbnail) || [];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden ${isMobile ? 'p-0' : 'p-4 md:p-6'}`}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-[#050505]/90 backdrop-blur-md"
                        onClick={onClose}
                    />

                    {/* Floating Left Navigation Button */}
                    {!isMobile && onPrev && (
                        <motion.button
                            type="button"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            whileHover={{ scale: 1.1, x: -3 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => { e.stopPropagation(); setDirection('prev'); onPrev(); }}
                            className="absolute left-4 md:left-6 xl:left-8 top-1/2 -translate-y-1/2 z-[110] w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/15 backdrop-blur-xl flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.6)] cursor-pointer group transition-colors"
                            title="Publicació anterior (←)"
                        >
                            <ChevronLeft size={28} className="group-hover:-translate-x-0.5 transition-transform" />
                        </motion.button>
                    )}

                    {/* Floating Right Navigation Button */}
                    {!isMobile && onNext && (
                        <motion.button
                            type="button"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            whileHover={{ scale: 1.1, x: 3 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => { e.stopPropagation(); setDirection('next'); onNext(); }}
                            className="absolute right-4 md:right-6 xl:right-8 top-1/2 -translate-y-1/2 z-[110] w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/15 backdrop-blur-xl flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.6)] cursor-pointer group transition-colors"
                            title="Publicació següent (→)"
                        >
                            <ChevronRight size={28} className="group-hover:translate-x-0.5 transition-transform" />
                        </motion.button>
                    )}

                    <motion.div
                        initial={{ opacity: 0, y: "100%", scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: "100%", scale: 0.9 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className={`relative w-full bg-[#0a0a0a] shadow-2xl overflow-hidden flex flex-col ${isMobile ? 'h-[100dvh] rounded-none border-none' : 'h-[90vh] max-w-7xl border border-white/10 rounded-4xl'}`}
                    >
                        {/* Top Bar Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0 bg-[#0a0a0a]/90 backdrop-blur-xl z-20">
                            <div className="flex items-center gap-3 min-w-0">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={post.id}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        transition={{ duration: 0.15 }}
                                        className="flex items-center gap-3 min-w-0"
                                    >
                                        <img src={post.userAvatar} alt={post.username} loading="lazy" className="w-10 h-10 rounded-full object-cover bg-slate-800 border border-white/10 shrink-0" />
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-slate-100 truncate">{post.username}</h3>
                                            {timeAgo && <p className="text-xs text-slate-500 font-medium capitalize first-letter:capitalize truncate">{timeAgo}</p>}
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleLike}
                                    className={`px-4 py-2 rounded-full transition-colors flex items-center gap-2 ${hasLiked ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-transparent'}`}
                                >
                                    <motion.div animate={{ scale: hasLiked ? [1, 1.3, 1] : 1 }} transition={{ duration: 0.3 }}>
                                        <Heart size={18} fill={hasLiked ? 'currentColor' : 'none'} />
                                    </motion.div>
                                    <span className="text-sm font-bold hidden sm:inline">{likeCount > 0 ? likeCount : t('community.postDetail.like', "M'agrada")}</span>
                                </motion.button>
                                <button type="button" aria-label="Desar" className="hidden sm:block p-2.5 rounded-full bg-white/5 text-slate-300 hover:bg-white/10 transition-colors">
                                    <Share2 size={18} />
                                </button>
                                {user?.id === post.userId && (
                                    <button type="button" aria-label="Compartir"
                                        onClick={handleDelete}
                                        className="p-2.5 rounded-full bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-colors"
                                        title={t('community.postDetail.deleteTooltip', "Eliminar publicació")}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                                <div className="w-px h-6 bg-white/10 mx-1" />
                                <button type="button" aria-label="Tancar" onClick={onClose} className="p-2.5 rounded-full hover:bg-rose-500/20 text-slate-400 hover:text-rose-500 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Two Column Content & Comments */}
                        <div className="flex-1 min-h-0 relative overflow-hidden flex flex-col">
                            <AnimatePresence mode="wait" custom={direction}>
                                <motion.div
                                    key={post.id}
                                    custom={direction}
                                    variants={contentVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    onTouchStart={(e) => {
                                        if (!isMobile) return;
                                        setTouchEndX(null);
                                        setTouchEndY(null);
                                        setTouchStartX(e.targetTouches[0].clientX);
                                        setTouchStartY(e.targetTouches[0].clientY);
                                    }}
                                    onTouchMove={(e) => {
                                        if (!isMobile) return;
                                        setTouchEndX(e.targetTouches[0].clientX);
                                        setTouchEndY(e.targetTouches[0].clientY);
                                    }}
                                    onTouchEnd={() => {
                                        if (!isMobile || !touchStartX || !touchEndX || !touchStartY || !touchEndY) return;
                                        const distanceX = touchStartX - touchEndX;
                                        const distanceY = Math.abs(touchStartY - touchEndY);
                                        
                                        // Només detectar com a swipe si el desplaçament horitzontal és més gran que el vertical
                                        // i supera un llindar de 50 píxels. Això evita que fer scroll avall canviï el post per accident.
                                        if (Math.abs(distanceX) > 50 && Math.abs(distanceX) > distanceY) {
                                            if (distanceX > 0 && onNext) {
                                                setDirection('next');
                                                onNext();
                                            } else if (distanceX < 0 && onPrev) {
                                                setDirection('prev');
                                                onPrev();
                                            }
                                        }
                                    }}
                                    className="flex flex-col lg:flex-row flex-1 min-h-0 w-full h-full overflow-hidden"
                                >
                                    {/* Left Column: Content & Carousel */}
                                    <div className="flex-1 min-w-0 min-h-[30vh] lg:h-full overflow-y-auto overscroll-contain custom-scrollbar bg-[#060606] flex flex-col">
                                {/* Visual/Carousel Section (If there are images) */}
                                {postImages.length > 0 && (
                                    <div className="w-full h-[450px] sm:h-[500px] lg:h-[540px] bg-[#020202] border-b border-white/10 relative group/carousel select-none flex flex-col items-center justify-center overflow-hidden shrink-0">
                                        <AnimatePresence mode="wait">
                                            <motion.img
                                                key={currentImageIndex}
                                                src={postImages[currentImageIndex]?.url}
                                                alt={`Image ${currentImageIndex + 1}`}
                                                initial={{ opacity: 0, scale: 0.98 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.98 }}
                                                transition={{ duration: 0.2 }}
                                                className="w-full h-full object-contain p-4 mx-auto"
                                            />
                                        </AnimatePresence>

                                        {/* Carousel Controls (If > 1 image) */}
                                        {postImages.length > 1 && (
                                            <>
                                                {/* Left Arrow */}
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setCurrentImageIndex((prev) => (prev === 0 ? postImages.length - 1 : prev - 1));
                                                    }}
                                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all hover:scale-110 active:scale-95 z-10 shadow-lg"
                                                    title="Anterior"
                                                >
                                                    <ChevronLeft size={22} className="-ml-0.5" />
                                                </button>

                                                {/* Right Arrow */}
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setCurrentImageIndex((prev) => (prev === postImages.length - 1 ? 0 : prev + 1));
                                                    }}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all hover:scale-110 active:scale-95 z-10 shadow-lg"
                                                    title="Següent"
                                                >
                                                    <ChevronRight size={22} className="-mr-0.5" />
                                                </button>

                                                {/* Counter Badge */}
                                                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white text-xs font-bold tracking-wider z-10 shadow-md">
                                                    {currentImageIndex + 1} / {postImages.length}
                                                </div>

                                                {/* Dots Indicator */}
                                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 shadow-md">
                                                    {postImages.map((_, idx) => (
                                                        <button
                                                            key={idx}
                                                            type="button"
                                                            onClick={() => setCurrentImageIndex(idx)}
                                                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-6 bg-primary shadow-[0_0_8px_rgba(14,165,233,0.8)]' : 'w-1.5 bg-white/40 hover:bg-white/80'}`}
                                                        />
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                <div className="p-6 sm:p-8 lg:p-10 max-w-4xl mx-auto w-full">
                                    {/* Text Content */}
                                    <HtmlRenderer content={post.content} className="prose prose-invert prose-lg max-w-none break-words overflow-x-hidden prose-p:text-slate-200 prose-headings:text-white prose-a:text-primary mb-10 font-normal leading-relaxed prose-pre:max-w-[calc(100vw-3rem)] sm:prose-pre:max-w-full" />

                                    {/* Files / Documents with Viewers */}
                                    {postFiles.length > 0 && (
                                        <div className="mt-8 pt-8 border-t border-white/5">
                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                {t('community.postDetail.attachmentsTitle', 'Fitxers Adjunts i Interacció')}
                                            </h4>
                                            <div className="flex flex-col gap-6">
                                                {postFiles.map((file, i) => (
                                                    <FileViewerRenderer
                                                        key={i}
                                                        url={file.url}
                                                        filename={file.name}
                                                        type={file.type}
                                                        size={file.size}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                                {/* Right Column: Comments Section (Desktop only) */}
                                {!isMobile && (
                                    <div className="flex w-[420px] xl:w-[450px] shrink-0 border-l border-white/10 bg-[#080808] flex-col h-full min-h-0 overflow-hidden">
                                        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                                            <ReplySection postId={post.id} postAuthorId={post.userId} postContent={post.content} />
                                        </div>
                                    </div>
                                )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        
                        {/* Mobile Floating Comments Button */}
                        {isMobile && (
                            <div className="absolute bottom-6 right-4 z-50">
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setShowCommentsMobile(true)}
                                    className="w-14 h-14 rounded-full bg-black/80 backdrop-blur-xl border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)] text-white flex items-center justify-center relative group"
                                >
                                    <MessageCircle size={28} className="text-white drop-shadow-md" />
                                </motion.button>
                            </div>
                        )}
                        
                        {/* Mobile Bottom Sheet for Comments */}
                        {isMobile && (
                            <BottomSheet
                                isOpen={showCommentsMobile}
                                onClose={() => setShowCommentsMobile(false)}
                                title={t('community.postDetail.comments', 'Comentaris')}
                            >
                                <div className="h-[70vh] flex flex-col bg-[#060606] -mx-4 -mb-4">
                                    <ReplySection postId={post.id} postAuthorId={post.userId} postContent={post.content} />
                                </div>
                            </BottomSheet>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PostDetailModal;
