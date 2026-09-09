import { useState, useMemo, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { CommunityPost } from '../../types/community';
import { Heart, Eye, FileCode2, Box, FileVideo, FileText, Archive, Pin, ImagePlus } from 'lucide-react';
import { db } from '../../lib/firebase';
import { doc, updateDoc, deleteField, deleteDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { renderEmojis } from '../../lib/emojis';
import DOMPurify from 'dompurify';
import FileUploader from '../ui/inputs/FileUploader';
import subjectsData from '../../data/subjects.json';
import { tailwindColors } from '../../stores/useSubjectStore';
import { resolveMediaUrl } from '../../lib/mediaUtils';

interface PublicationCardProps {
    post: CommunityPost;
    isHeroMode?: boolean;
    onThumbnailUpload?: (attachments: NonNullable<CommunityPost['attachments']>) => void;
}

/* ==========================================================================
   Constants estàtiques i Map O(1) fora del cicle de render
   ========================================================================== */

const CODE_EXTENSIONS = new Set(['js', 'jsx', 'ts', 'tsx', 'json', 'html', 'css', 'cpp', 'c', 'h', 'hpp', 'py', 'java', 'go', 'rs', 'php', 'rb']);
const MODEL_EXTENSIONS = new Set(['gltf', 'glb', 'obj']);
const ARCHIVE_EXTENSIONS = new Set(['zip', 'rar', 'tar', 'gz', '7z']);

// Índex hash O(1) per trobar assignatures per ID o nom
const SUBJECT_MAP = new Map<string, typeof subjectsData[0]>();
subjectsData.forEach(s => {
    if (s.id) SUBJECT_MAP.set(s.id.toLowerCase(), s);
    if (s.name) SUBJECT_MAP.set(s.name.toLowerCase(), s);
});

interface AttachmentBadgeInfo {
    icon: React.ReactNode;
    text: string;
}

function getAttachmentBadge(attachment?: { name: string; type: string }): AttachmentBadgeInfo | null {
    if (!attachment) return null;
    const type = attachment.type || '';
    const ext = attachment.name.split('.').pop()?.toLowerCase() || '';

    if (type.startsWith('video/')) {
        return { icon: <FileVideo size={10} />, text: 'Vídeo' };
    }
    if (type === 'application/pdf') {
        return { icon: <FileText size={10} />, text: 'PDF' };
    }
    if (CODE_EXTENSIONS.has(ext) || type.startsWith('text/')) {
        return { icon: <FileCode2 size={10} />, text: 'Codi' };
    }
    if (MODEL_EXTENSIONS.has(ext)) {
        return { icon: <Box size={10} />, text: '3D' };
    }
    if (ARCHIVE_EXTENSIONS.has(ext)) {
        return { icon: <Archive size={10} />, text: 'ZIP' };
    }
    return null;
}

function getSafeSnippet(content?: string, length = 150): string {
    if (!content) return '';
    let textOnly = content.replace(/<[^>]*>?/gm, ' '); // Treure etiquetes HTML per la previsualització
    textOnly = textOnly.replace(/!\[.*?\]\(.*?\)/g, ''); // Treure imatges markdown
    const truncated = textOnly.length > length ? textOnly.substring(0, length) + '...' : textOnly;
    return DOMPurify.sanitize(renderEmojis(truncated));
}

/* ==========================================================================
   Component PublicationCard
   ========================================================================== */

const PublicationCard = ({ post, isHeroMode = false, onThumbnailUpload }: PublicationCardProps) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const firstAttachment = post.attachments?.[0];
    const imageAttachment = post.attachments?.find(a => a.type.startsWith('image/'));
    const coverUrl = useMemo(
        () => resolveMediaUrl(firstAttachment?.thumbnailUrl || imageAttachment?.url),
        [firstAttachment?.thumbnailUrl, imageAttachment?.url]
    );

    const badgeInfo = useMemo(() => getAttachmentBadge(firstAttachment), [firstAttachment]);
    const isVideo = firstAttachment?.type?.startsWith('video/') ?? false;

    const likeCount = useMemo(
        () => Object.values(post.reactions || {}).filter(r => r.emoji === '❤️').length,
        [post.reactions]
    );
    const hasLiked = user && post.reactions?.[user.id]?.emoji === '❤️';

    const handleLike = useCallback(async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) return;
        const postRef = doc(db, 'community_posts', post.id);
        try {
            if (hasLiked) {
                await updateDoc(postRef, { [`reactions.${user.id}`]: deleteField() });

                if (post.userId !== user.id) {
                    await deleteDoc(doc(db, 'notifications', `like_${post.id}_${user.id}`));
                }
            } else {
                await updateDoc(postRef, {
                    [`reactions.${user.id}`]: { emoji: '❤️', username: user.username, userId: user.id }
                });

                if (post.userId !== user.id) {
                    await setDoc(doc(db, 'notifications', `like_${post.id}_${user.id}`), {
                        userId: post.userId,
                        type: 'like',
                        fromUserId: user.id,
                        fromUserName: user.username,
                        fromUserAvatar: user.avatar || '',
                        resourceId: post.id,
                        resourceTitle: post.content ? post.content.substring(0, 30) + '...' : '',
                        commentId: 'community_post_like',
                        read: false,
                        createdAt: serverTimestamp()
                    });
                }
            }
        } catch (err) {
            console.error(err);
        }
    }, [user, hasLiked, post.id, post.userId, post.content]);

    // Contingut sanititzat unificat
    const safeContent = useMemo(() => {
        if (!post.content) return isHeroMode ? 'Discussió' : 'Sense descripció';
        return getSafeSnippet(post.content, 150);
    }, [post.content, isHeroMode]);

    // Cerca O(1) de l'assignatura
    const subjectData = useMemo(() => {
        if (!post.subject) return null;
        return SUBJECT_MAP.get(post.subject.toLowerCase()) || null;
    }, [post.subject]);

    const authorAvatar = (user && user.id === post.userId) ? user.avatar : post.userAvatar;
    const authorName = (user && user.id === post.userId) ? user.username : post.username;

    const handleAuthorClick = useCallback((e: React.MouseEvent | React.KeyboardEvent) => {
        e.stopPropagation();
        navigate(`/profile/${post.username}`);
    }, [navigate, post.username]);

    const cardVisuals = (
        <>
            {/* Spotlight Overlay - Static Performant CSS Glow */}
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]" />

            {isVideo && isHovered && firstAttachment ? (
                <video
                    src={resolveMediaUrl(firstAttachment.url)}
                    autoPlay
                    muted
                    loop
                    className="w-full h-full object-cover transition-opacity duration-300 opacity-0 animate-[fadeIn_0.3s_ease-in-out_forwards]"
                />
            ) : coverUrl ? (
                <>
                    {!imageLoaded && (
                        <div className="absolute inset-0 shimmer-skeleton z-10" />
                    )}
                    <img
                        src={coverUrl}
                        alt={post.content ? post.content.substring(0, 20) : 'Recurs'}
                        className={`w-full h-full object-cover transition duration-500 ${!isHeroMode ? 'group-hover:scale-105' : ''} ${imageLoaded ? 'opacity-100 blur-none' : 'opacity-0 blur-sm'}`}
                        loading="lazy"
                        decoding="async"
                        onLoad={() => setImageLoaded(true)}
                    />
                </>
            ) : (
                <div className={`w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-white/10 to-white/5 p-6 text-center border border-white/5 rounded-[inherit] relative overflow-hidden transition-transform duration-500 ${!isHeroMode ? 'group-hover:scale-105' : ''}`}>
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent z-0" />
                    <span className="text-4xl font-black text-white/10 select-none absolute -bottom-4 -right-4">
                        {subjectData ? subjectData.name : post.subject}
                    </span>
                    <p
                        className="text-white font-bold text-lg leading-snug line-clamp-3 relative z-10"
                        dangerouslySetInnerHTML={{ __html: safeContent }}
                    />
                </div>
            )}

            {/* Custom Thumbnail Upload Overlay */}
            {onThumbnailUpload && (
                <div
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col items-center justify-center text-white cursor-pointer z-30 backdrop-blur-sm rounded-[inherit]"
                    title="Canviar Miniatura"
                >
                    <div className="flex flex-col items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300 pointer-events-none">
                        <ImagePlus size={32} className="mb-2 drop-shadow-md text-white" />
                        <span className="text-xs font-bold tracking-widest uppercase text-center px-4 drop-shadow-md">Canviar Miniatura</span>
                    </div>
                    <div className="absolute inset-0 z-40">
                        <FileUploader
                            variant="avatar"
                            acceptType="images"
                            maxFiles={1}
                            maxSizeMB={5}
                            onUploadComplete={onThumbnailUpload}
                        />
                    </div>
                </div>
            )}

            {/* Overlays */}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Top Right Actions (Like Button) */}
            <div className="absolute top-2 right-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 z-10">
                <button
                    type="button"
                    onClick={handleLike}
                    aria-pressed={Boolean(hasLiked)}
                    className={`h-8 px-2.5 rounded-full flex items-center justify-center gap-1.5 backdrop-blur-md border border-white/20 transition active:scale-90 cursor-pointer ${hasLiked ? 'bg-rose-500/20 text-rose-500 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'bg-black/60 text-white hover:bg-black/80'}`}
                    aria-label="M'agrada"
                >
                    <Heart size={14} fill={hasLiked ? 'currentColor' : 'none'} />
                    {likeCount > 0 && <span className="text-xs font-bold">{likeCount}</span>}
                </button>
            </div>

            {/* Top Left Badges */}
            <div className="absolute top-2 left-2 flex flex-wrap gap-1.5 z-10 max-w-[80%]">
                {post.isPinned && (
                    <div className="bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center justify-center shadow-xl">
                        <Pin size={12} className="text-white -rotate-45" />
                    </div>
                )}
                {subjectData && (
                    <div className="bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold tracking-widest px-2 py-1 rounded-md flex items-center gap-1.5 shadow-xl">
                        <span 
                            className="w-1.5 h-1.5 rounded-full" 
                            style={{ backgroundColor: tailwindColors[subjectData.colorToken?.split('-')[0] || 'sky']?.primary || '#0ea5e9' }}
                        />
                        {subjectData.name}
                    </div>
                )}
                {badgeInfo && (
                    <div className="bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold tracking-widest px-2 py-1 rounded-md flex items-center gap-1.5 shadow-xl">
                        <span className="text-white">{badgeInfo.icon}</span>
                        {badgeInfo.text}
                    </div>
                )}
            </div>
        </>
    );

    return (
        <div
            className="flex flex-col gap-2 group cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="w-full aspect-video rounded-xl overflow-hidden relative bg-[#0F172A] border border-white/10 active:scale-[0.98] active:border-white/20 shadow-lg transition duration-200 group-hover:border-white/20 group-hover:shadow-[0_15px_40px_rgba(255,255,255,0.08)]">
                {cardVisuals}
            </div>

            {/* Info Section */}
            <div className="flex flex-col gap-1 px-1 mt-1">
                <h3
                    className="text-slate-100 font-medium text-sm line-clamp-1 leading-snug group-hover:text-primary transition-colors"
                    dangerouslySetInnerHTML={{ __html: safeContent }}
                />

                <div className="flex items-center justify-between gap-2 mt-1">
                    <div 
                        role="link"
                        tabIndex={0}
                        className="flex items-center gap-1.5 min-w-0 flex-1 mr-1 cursor-pointer group/author focus:outline-none focus-visible:underline"
                        onClick={handleAuthorClick}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                handleAuthorClick(e);
                            }
                        }}
                        aria-label={`Veure perfil de ${authorName}`}
                    >
                        <img
                            src={resolveMediaUrl(authorAvatar)}
                            alt={authorName}
                            loading="lazy"
                            decoding="async"
                            className="w-4 h-4 rounded-full object-cover bg-slate-800 shrink-0 border border-white/10"
                        />
                        <span className="text-[11px] text-slate-300 truncate group-hover/author:text-white transition-colors">
                            {authorName}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 text-slate-400 text-[11px] font-medium">
                        <div className="flex items-center gap-1">
                            <Heart size={12} className={hasLiked ? 'text-rose-500 fill-rose-500' : ''} />
                            <span className={hasLiked ? 'text-rose-500' : ''}>{likeCount > 0 ? likeCount : ''}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Eye size={12} />
                            <span>{post.views || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(PublicationCard, (prev, next) => {
    // Comparador eficient sense serialització JSON
    if (prev.post.id !== next.post.id) return false;
    if (prev.isHeroMode !== next.isHeroMode) return false;
    if (prev.post.views !== next.post.views) return false;
    if (prev.post.username !== next.post.username) return false;
    if (prev.post.userAvatar !== next.post.userAvatar) return false;
    if (prev.post.isPinned !== next.post.isPinned) return false;
    if (prev.post.content !== next.post.content) return false;

    // Comparació de reaccions ràpida (evita JSON.stringify a cada render)
    const prevReactions = prev.post.reactions;
    const nextReactions = next.post.reactions;
    if (prevReactions !== nextReactions) {
        const prevKeys = prevReactions ? Object.keys(prevReactions) : [];
        const nextKeys = nextReactions ? Object.keys(nextReactions) : [];
        if (prevKeys.length !== nextKeys.length) return false;
        for (const k of prevKeys) {
            if (prevReactions?.[k]?.emoji !== nextReactions?.[k]?.emoji) return false;
        }
    }

    return true;
});

