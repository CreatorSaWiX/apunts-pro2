import { useEffect, useState, useRef, useMemo, memo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import type { CommunityPost, PostAttachment } from '../../types/community';
import { m as motion, AnimatePresence, type Variants } from 'framer-motion';
import { X, Heart, Share2, Trash2, ChevronLeft, ChevronRight, MessageCircle, Pencil, Check } from 'lucide-react';
import ReplySection from './ReplySection';
import FileViewerRenderer from './viewers/FileViewerRenderer';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { doc, updateDoc, deleteField, deleteDoc, collection, getDocs, increment, setDoc, serverTimestamp } from 'firebase/firestore';
import { HtmlRenderer } from '../ui/typography/HtmlRenderer';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';
import type { Locale } from 'date-fns';
import { ca, es, enUS } from 'date-fns/locale';
import BottomSheet from '../ui/mobile/BottomSheet';
import { useIsMobile } from '../../hooks/useIsMobile';
import ConfirmModal from '../ui/modals/ConfirmModal';
import { resolveMediaUrl } from '../../lib/mediaUtils';

const dateLocales: Record<string, Locale> = { ca, es, en: enUS };

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

interface PostDetailModalProps {
    post: CommunityPost | null;
    isOpen: boolean;
    onClose: () => void;
    onNext?: () => void;
    onPrev?: () => void;
    onDelete?: (postId: string) => void;
    onEdit?: () => void;
}

interface PostImagesCarouselProps {
    images: PostAttachment[];
    currentIndex: number;
    onChangeIndex: (idx: number | ((prev: number) => number)) => void;
    ariaLabelPrev: string;
    ariaLabelNext: string;
}

const PostImagesCarousel = memo(({
    images,
    currentIndex,
    onChangeIndex,
    ariaLabelPrev,
    ariaLabelNext
}: PostImagesCarouselProps) => {
    if (images.length === 0) return null;

    const currentImage = images[currentIndex] || images[0];

    return (
        <div className="w-full h-[450px] sm:h-125 lg:h-[540px] bg-[#020202] border-b border-white/10 relative group/carousel select-none flex flex-col items-center justify-center overflow-hidden shrink-0">
            <AnimatePresence mode="wait">
                <motion.img
                    key={currentIndex}
                    src={resolveMediaUrl(currentImage.url)}
                    alt={currentImage.name || `Image ${currentIndex + 1}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="w-full h-full object-contain p-4 mx-auto"
                />
            </AnimatePresence>

            {images.length > 1 && (
                <>
                    {/* Left Arrow */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onChangeIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition hover:scale-110 active:scale-95 z-10 shadow-lg"
                        title={ariaLabelPrev}
                        aria-label={ariaLabelPrev}
                    >
                        <ChevronLeft size={22} className="-ml-0.5" />
                    </button>

                    {/* Right Arrow */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onChangeIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition hover:scale-110 active:scale-95 z-10 shadow-lg"
                        title={ariaLabelNext}
                        aria-label={ariaLabelNext}
                    >
                        <ChevronRight size={22} className="-mr-0.5" />
                    </button>

                    {/* Counter Badge */}
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white text-xs font-bold tracking-wider z-10 shadow-md">
                        {currentIndex + 1} / {images.length}
                    </div>

                    {/* Dots Indicator */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 shadow-md">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => onChangeIndex(idx)}
                                className={`h-1.5 rounded-full transition duration-300 ${idx === currentIndex ? 'w-6 bg-primary shadow-[0_0_8px_rgba(14,165,233,0.8)]' : 'w-1.5 bg-white/40 hover:bg-white/80'}`}
                                aria-label={`Imatge ${idx + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
});
PostImagesCarousel.displayName = 'PostImagesCarousel';

const PostDetailModal = ({ post, isOpen, onClose, onNext, onPrev, onDelete, onEdit }: PostDetailModalProps) => {
    const { t, i18n } = useTranslation();
    const { user } = useAuth();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [direction, setDirection] = useState<'next' | 'prev' | null>(null);
    const isMobile = useIsMobile();
    const navigate = useNavigate();
    const [showCommentsMobile, setShowCommentsMobile] = useState(false);
    const [copiedShare, setCopiedShare] = useState(false);

    // Coordenades del gest de swipe mantingudes en un ref per evitar re-renderitzats durant el moviment
    const touchCoordsRef = useRef<{ startX: number; startY: number; currentX: number; currentY: number } | null>(null);

    const onPrevRef = useRef(onPrev);
    const onNextRef = useRef(onNext);
    const onCloseRef = useRef(onClose);

    useEffect(() => {
        onPrevRef.current = onPrev;
        onNextRef.current = onNext;
        onCloseRef.current = onClose;
    }, [onPrev, onNext, onClose]);

    useEffect(() => {
        if (!isOpen) return;
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
                return;
            }
            if (e.key === 'Escape') {
                onCloseRef.current();
            } else if (e.key === 'ArrowLeft' && onPrevRef.current) {
                e.preventDefault();
                setDirection('prev');
                onPrevRef.current();
            } else if (e.key === 'ArrowRight' && onNextRef.current) {
                e.preventDefault();
                setDirection('next');
                onNextRef.current();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = originalOverflow;
        };
    }, [isOpen]);

    // Reinicialitzar índex d'imatge en canviar de publicació
    useEffect(() => {
        setCurrentImageIndex(0);
    }, [post?.id]);

    const postImages = useMemo(() => {
        return post?.attachments?.filter(a => a.type.startsWith('image/') && !a.isCustomThumbnail) || [];
    }, [post?.attachments]);

    const postFiles = useMemo(() => {
        return post?.attachments?.filter(a => !a.type.startsWith('image/') && !a.isCustomThumbnail) || [];
    }, [post?.attachments]);

    const hasLiked = Boolean(user && post?.reactions?.[user.id]?.emoji === '❤️');
    const likeCount = useMemo(() => {
        return Object.values(post?.reactions || {}).filter(r => r.emoji === '❤️').length;
    }, [post?.reactions]);

    const currentLocale = dateLocales[i18n.language] || ca;

    const timeAgo = useMemo(() => {
        if (!post?.createdAt) return '';
        try {
            const date = typeof post.createdAt.toDate === 'function'
                ? post.createdAt.toDate()
                : new Date(post.createdAt.seconds * 1000);
            return formatDistanceToNow(date, { addSuffix: true, locale: currentLocale });
        } catch (e) {
            console.error('Error formatting date:', e);
            return '';
        }
    }, [post?.createdAt, currentLocale]);

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
            } catch (e) {
                console.debug('Failed to parse viewed_posts from localStorage:', e);
            }

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

    const handleLike = useCallback(async () => {
        if (!user || !post) return;
        const postRef = doc(db, 'community_posts', post.id);

        try {
            if (hasLiked) {
                await updateDoc(postRef, {
                    [`reactions.${user.id}`]: deleteField()
                });

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
        } catch (err) {
            console.error(err);
        }
    }, [user, post, hasLiked]);

    const handleShare = useCallback(async () => {
        if (!post) return;
        const shareUrl = `${window.location.origin}/community?post=${post.id}`;
        try {
            if (navigator.share && isMobile) {
                await navigator.share({
                    title: 'Apunts Community',
                    text: post.content?.substring(0, 100) || 'Publicació a la comunitat Apunts',
                    url: shareUrl
                });
            } else {
                await navigator.clipboard.writeText(shareUrl);
                setCopiedShare(true);
                setTimeout(() => setCopiedShare(false), 2000);
            }
        } catch (err) {
            // Ignore abort errors from native share sheet cancel
            if ((err as Error)?.name !== 'AbortError') {
                console.debug('Failed to share:', err);
            }
        }
    }, [post, isMobile]);

    const handleDelete = useCallback(async () => {
        if (!post) return;
        try {
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

            if (onDelete) {
                onDelete(post.id);
            }

            onClose();
        } catch (err) {
            console.error(err);
            alert(t('community.postDetail.deleteError', "Error en eliminar la publicació."));
        }
    }, [post, onDelete, onClose, t]);

    // Touch gesture handlers that don't trigger React state updates during drag
    const handleTouchStart = (e: React.TouchEvent) => {
        if (!isMobile) return;
        touchCoordsRef.current = {
            startX: e.targetTouches[0].clientX,
            startY: e.targetTouches[0].clientY,
            currentX: e.targetTouches[0].clientX,
            currentY: e.targetTouches[0].clientY,
        };
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isMobile || !touchCoordsRef.current) return;
        touchCoordsRef.current.currentX = e.targetTouches[0].clientX;
        touchCoordsRef.current.currentY = e.targetTouches[0].clientY;
    };

    const handleTouchEnd = () => {
        if (!isMobile || !touchCoordsRef.current) return;
        const { startX, startY, currentX, currentY } = touchCoordsRef.current;
        const distanceX = startX - currentX;
        const distanceY = Math.abs(startY - currentY);
        touchCoordsRef.current = null;

        // Només detectar com a swipe si el desplaçament horitzontal és clarament superior al vertical (> 50px)
        if (Math.abs(distanceX) > 50 && Math.abs(distanceX) > distanceY) {
            if (distanceX > 0 && onNext) {
                setDirection('next');
                onNext();
            } else if (distanceX < 0 && onPrev) {
                setDirection('prev');
                onPrev();
            }
        }
    };

    if (!post) return null;

    const authorUsername = (user && user.id === post.userId) ? user.username : post.username;
    const authorAvatar = (user && user.id === post.userId) ? user.avatar : post.userAvatar;

    const content = (
        <AnimatePresence>
            {isOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={t('community.postDetail.modalTitle', 'Detall de la publicació')}
                    className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden ${isMobile ? 'p-0' : 'p-4 md:p-6'}`}
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-[#050505]/90 backdrop-blur-md"
                        onClick={onClose}
                    />

                    {/* Botó flotant de navegació esquerra */}
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
                            title={t('community.postDetail.prevTooltip', 'Publicació anterior (←)')}
                            aria-label={t('community.postDetail.prevTooltip', 'Publicació anterior (←)')}
                        >
                            <ChevronLeft size={28} className="group-hover:-translate-x-0.5 transition-transform" />
                        </motion.button>
                    )}

                    {/* Botó flotant de navegació dreta */}
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
                            title={t('community.postDetail.nextTooltip', 'Publicació següent (→)')}
                            aria-label={t('community.postDetail.nextTooltip', 'Publicació següent (→)')}
                        >
                            <ChevronRight size={28} className="group-hover:translate-x-0.5 transition-transform" />
                        </motion.button>
                    )}

                    <motion.div
                        initial={{ opacity: 0, y: "100%", scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: "100%", scale: 0.9 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className={`relative w-full bg-[#0a0a0a] shadow-2xl overflow-hidden flex flex-col ${isMobile ? 'h-dvh rounded-none border-none' : 'h-[90vh] max-w-7xl border border-white/10 rounded-4xl'}`}
                    >
                        {/* Barra superior de capçalera */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0 bg-[#0a0a0a]/90 backdrop-blur-xl z-20">
                            <div className="flex items-center gap-3 min-w-0">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={post.id}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        transition={{ duration: 0.15 }}
                                        className="flex items-center gap-3 min-w-0 cursor-pointer group"
                                        onClick={() => {
                                            onClose();
                                            setTimeout(() => navigate(`/profile/${authorUsername}`), 100);
                                        }}
                                    >
                                        <img
                                            src={resolveMediaUrl(authorAvatar)}
                                            alt={authorUsername}
                                            loading="lazy"
                                            className="w-10 h-10 rounded-full object-cover bg-slate-800 border border-white/10 shrink-0"
                                        />
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-slate-100 truncate group-hover:text-primary transition-colors">
                                                {authorUsername}
                                            </h3>
                                            {timeAgo && (
                                                <p className="text-xs text-slate-500 font-medium capitalize first-letter:capitalize truncate">
                                                    {timeAgo}
                                                </p>
                                            )}
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleLike}
                                    type="button"
                                    aria-label={hasLiked ? t('community.postDetail.unlike', "Ja no m'agrada") : t('community.postDetail.like', "M'agrada")}
                                    className={`px-4 py-2 rounded-full transition-colors flex items-center gap-2 ${hasLiked ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-transparent'}`}
                                >
                                    <motion.div animate={{ scale: hasLiked ? [1, 1.3, 1] : 1 }} transition={{ duration: 0.3 }}>
                                        <Heart size={18} fill={hasLiked ? 'currentColor' : 'none'} />
                                    </motion.div>
                                    <span className="text-sm font-bold hidden sm:inline">
                                        {likeCount > 0 ? likeCount : t('community.postDetail.like', "M'agrada")}
                                    </span>
                                </motion.button>

                                <button
                                    type="button"
                                    onClick={handleShare}
                                    aria-label={t('common.share', 'Compartir')}
                                    title={copiedShare ? t('community.postDetail.linkCopied', 'Enllaç copiat!') : t('common.share', 'Compartir')}
                                    className={`p-2.5 rounded-full transition-colors ${copiedShare ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
                                >
                                    {copiedShare ? <Check size={18} /> : <Share2 size={18} />}
                                </button>

                                {user?.id === post.userId && (
                                    <>
                                        {onEdit && (
                                            <button
                                                type="button"
                                                aria-label={t('community.postDetail.editTooltip', 'Editar publicació')}
                                                onClick={() => onEdit()}
                                                className="p-2.5 rounded-full bg-white/5 text-slate-300 hover:bg-white/10 transition-colors"
                                                title={t('community.postDetail.editTooltip', 'Editar publicació')}
                                            >
                                                <Pencil size={18} />
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            aria-label={t('community.postDetail.deleteTooltip', 'Eliminar publicació')}
                                            onClick={() => setIsDeleteModalOpen(true)}
                                            className="p-2.5 rounded-full bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-colors"
                                            title={t('community.postDetail.deleteTooltip', 'Eliminar publicació')}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </>
                                )}
                                <div className="w-px h-6 bg-white/10 mx-1" />
                                <button
                                    type="button"
                                    aria-label={t('common.close', 'Tancar')}
                                    onClick={onClose}
                                    className="p-2.5 rounded-full hover:bg-rose-500/20 text-slate-400 hover:text-rose-500 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Contingut i comentaris en dues columnes */}
                        <div className="flex-1 min-h-0 relative overflow-hidden flex flex-col">
                            <AnimatePresence mode="wait" custom={direction}>
                                <motion.div
                                    key={post.id}
                                    custom={direction}
                                    variants={contentVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    onTouchStart={handleTouchStart}
                                    onTouchMove={handleTouchMove}
                                    onTouchEnd={handleTouchEnd}
                                    className="flex flex-col lg:flex-row flex-1 min-h-0 w-full h-full overflow-hidden"
                                >
                                    {/* Columna esquerra: contingut i carrusel */}
                                    <div className="flex-1 min-w-0 min-h-[30vh] lg:h-full overflow-y-auto overscroll-contain custom-scrollbar bg-[#060606] flex flex-col">
                                        {/* Secció visual / carrusel */}
                                        <PostImagesCarousel
                                            images={postImages}
                                            currentIndex={currentImageIndex}
                                            onChangeIndex={setCurrentImageIndex}
                                            ariaLabelPrev={t('common.previous', 'Anterior')}
                                            ariaLabelNext={t('common.next', 'Següent')}
                                        />

                                        <div className="p-6 sm:p-8 lg:p-10 max-w-4xl mx-auto w-full">
                                            {/* Contingut de text */}
                                            <HtmlRenderer
                                                content={post.content}
                                                className="prose prose-invert prose-lg max-w-none break-words overflow-x-hidden prose-p:text-slate-200 prose-headings:text-white prose-a:text-primary mb-10 font-normal leading-relaxed prose-pre:max-w-[calc(100vw-3rem)] sm:prose-pre:max-w-full"
                                            />

                                            {/* Fitxers i documents amb visualitzadors */}
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

                                    {/* Columna dreta: secció de comentaris (només escriptori) */}
                                    {!isMobile && (
                                        <div className="flex w-[420px] xl:w-[450px] shrink-0 border-l border-white/10 bg-[#080808] flex-col h-full min-h-0 overflow-hidden">
                                            <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                                                <ReplySection
                                                    postId={post.id}
                                                    postAuthorId={post.userId}
                                                    postContent={post.content}
                                                    onNavigateToProfile={(username) => {
                                                        onClose();
                                                        setTimeout(() => navigate(`/profile/${username}`), 100);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Botó flotant de comentaris per a mòbils */}
                        {isMobile && (
                            <div className="absolute bottom-6 right-4 z-50">
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setShowCommentsMobile(true)}
                                    type="button"
                                    aria-label={t('community.postDetail.comments', 'Comentaris')}
                                    className="w-14 h-14 rounded-full bg-black/80 backdrop-blur-xl border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)] text-white flex items-center justify-center relative group"
                                >
                                    <MessageCircle size={28} className="text-white drop-shadow-md" />
                                </motion.button>
                            </div>
                        )}

                        {/* Panell inferior (BottomSheet) de comentaris per a mòbils */}
                        {isMobile && (
                            <BottomSheet
                                isOpen={showCommentsMobile}
                                onClose={() => setShowCommentsMobile(false)}
                                title={t('community.postDetail.comments', 'Comentaris')}
                                fullBleed={true}
                            >
                                <div className="h-[70vh] flex flex-col overflow-hidden pb-[env(safe-area-inset-bottom)]">
                                    <ReplySection
                                        postId={post.id}
                                        postAuthorId={post.userId}
                                        postContent={post.content}
                                        onNavigateToProfile={(username) => {
                                            onClose();
                                            setTimeout(() => navigate(`/profile/${username}`), 100);
                                        }}
                                    />
                                </div>
                            </BottomSheet>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    if (typeof document === 'undefined') return null;
    return (
        <>
            {createPortal(content, document.body)}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title={t('community.postDetail.deleteConfirmTitle', 'Eliminar publicació')}
                message={t('community.postDetail.deleteConfirm', 'Segur que vols eliminar aquesta publicació? Aquesta acció no es pot desfer.')}
                confirmText={t('common.delete', 'Eliminar')}
                isDestructive={true}
            />
        </>
    );
};

export default memo(PostDetailModal);
