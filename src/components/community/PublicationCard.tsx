import { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import type { CommunityPost } from '../../types/community';
import { Heart, Eye, FileCode2, Box, FileVideo, FileText, Archive, Pin } from 'lucide-react';
import { db } from '../../lib/firebase';
import { doc, updateDoc, deleteField, deleteDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import Tilt from 'react-parallax-tilt';
import { renderEmojis } from '../../lib/emojis';
import DOMPurify from 'dompurify';
import Spinner from '../ui/Spinner';
import FileUploader from '../ui/FileUploader';
import { ImagePlus } from 'lucide-react';
import subjectsData from '../../data/subjects.json';
import { useMobilePerformance } from '../../hooks/useMobilePerformance';

interface PublicationCardProps {
    post: CommunityPost;
    isHeroMode?: boolean;
    onThumbnailUpload?: (attachments: any[]) => void;
}

const CODE_EXTENSIONS = ['js', 'jsx', 'ts', 'tsx', 'json', 'html', 'css', 'cpp', 'c', 'h', 'hpp', 'py', 'java', 'go', 'rs', 'php', 'rb'];
const MODEL_EXTENSIONS = ['gltf', 'glb', 'obj'];

const PublicationCard = ({ post, isHeroMode = false, onThumbnailUpload }: PublicationCardProps) => {
    const { user } = useAuth();
    const { isMobile, isLiteMode } = useMobilePerformance();
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    
    const firstAttachment = post.attachments?.[0];
    const imageAttachment = post.attachments?.find(a => a.type.startsWith('image/'));
    
    const coverUrl = firstAttachment?.thumbnailUrl || imageAttachment?.url;

    const ext = firstAttachment?.name.split('.').pop()?.toLowerCase() || '';
    const type = firstAttachment?.type || '';

    let badgeIcon = null;
    let badgeText = '';

    if (type.startsWith('video/')) { badgeIcon = <FileVideo size={10} />; badgeText = 'Vídeo'; }
    else if (type === 'application/pdf') { badgeIcon = <FileText size={10} />; badgeText = 'PDF'; }
    else if (CODE_EXTENSIONS.includes(ext) || type.startsWith('text/')) { badgeIcon = <FileCode2 size={10} />; badgeText = 'Codi'; }
    else if (MODEL_EXTENSIONS.includes(ext)) { badgeIcon = <Box size={10} />; badgeText = '3D'; }
    else if (['zip','rar','tar'].includes(ext)) { badgeIcon = <Archive size={10} />; badgeText = 'ZIP'; }

    const isVideo = type.startsWith('video/');
    const likeCount = Object.values(post.reactions || {}).filter(r => r.emoji === '❤️').length;
    const hasLiked = user && post.reactions?.[user.id]?.emoji === '❤️';

    const handleLike = async (e: React.MouseEvent) => {
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
                        resourceTitle: post.content.substring(0, 30) + '...',
                        commentId: 'community_post_like',
                        read: false,
                        createdAt: serverTimestamp()
                    });
                }
            }
        } catch (err) { console.error(err); }
    };

    const getSafeContent = (content: string, length: number) => {
        if (!content) return '';
        let textOnly = content.replace(/<[^>]*>?/gm, ' '); // Strip HTML tags for the preview snippet
        textOnly = textOnly.replace(/!\[.*?\]\(.*?\)/g, '');
        const truncated = textOnly.length > length ? textOnly.substring(0, length) + '...' : textOnly;
        return DOMPurify.sanitize(renderEmojis(truncated));
    };

    const safeContentHero = useMemo(() => post.content ? getSafeContent(post.content, 150) : 'Discussió', [post.content]);
    const safeContentTitle = useMemo(() => post.content ? getSafeContent(post.content, 150) : 'Sense descripció', [post.content]);

    const subjectData = useMemo(() => {
        if (!post.subject) return null;
        return subjectsData.find(s => s.id === post.subject || s.name === post.subject);
    }, [post.subject]);

    const cardVisuals = (
        <>
            {/* Spotlight Overlay - Static Performant CSS Glow */}
            <div 
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]"
            />
            {isVideo && isHovered && firstAttachment ? (
                <video 
                    src={firstAttachment.url} 
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
                        alt={post.content.substring(0, 20)} 
                        className={`w-full h-full object-cover transition-all duration-500 ${!isHeroMode ? 'group-hover:scale-105' : ''} ${imageLoaded ? 'opacity-100 blur-none' : 'opacity-0 blur-sm'}`}
                        loading="lazy"
                        decoding="async"
                        onLoad={() => setImageLoaded(true)}
                    />
                </>
            ) : (
                <div className={`w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-white/10 to-white/5 p-6 text-center border border-white/5 rounded-[inherit] relative overflow-hidden transition-transform duration-500 ${!isHeroMode ? 'group-hover:scale-105' : ''}`}>
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent z-0" />
                    <span className="text-4xl font-black text-white/10 select-none absolute -bottom-4 -right-4">{subjectData ? subjectData.name : post.subject}</span>
                    <p className="text-white font-bold text-lg leading-snug line-clamp-3 relative z-10"
                        dangerouslySetInnerHTML={{
                            __html: safeContentHero
                        }}
                    />
                </div>
            )}

            {/* Custom Thumbnail Upload Overlay */}
            {onThumbnailUpload && (
                <div 
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center text-white cursor-pointer z-30 backdrop-blur-sm rounded-[inherit]"
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

            {/* Top Right Actions (Like Button - Always visible on mobile, hover on desktop) */}
            <div className="absolute top-2 right-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 z-10">
                <button type="button" 
                    onClick={handleLike}
                    className={`h-8 px-2.5 rounded-full flex items-center justify-center gap-1.5 backdrop-blur-md border border-white/20 transition-all active:scale-90 ${hasLiked ? 'bg-rose-500/20 text-rose-500 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'bg-black/60 text-white hover:bg-black/80'}`}
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
                        <span className={`w-1.5 h-1.5 rounded-full bg-${subjectData.colorToken}`} />
                        {subjectData.name}
                    </div>
                )}
                {badgeText && (
                    <div className="bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold tracking-widest px-2 py-1 rounded-md flex items-center gap-1.5 shadow-xl">
                        <span className="text-primary">{badgeIcon}</span>
                        {badgeText}
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
            {isMobile || isLiteMode || isHeroMode ? (
                <div className="w-full aspect-video rounded-xl overflow-hidden relative bg-[#0F172A] border border-white/10 active:scale-[0.98] active:border-white/20 shadow-lg transition-all duration-200">
                    {cardVisuals}
                </div>
            ) : (
                <Tilt
                    tiltEnable={true}
                    tiltMaxAngleX={5}
                    tiltMaxAngleY={5}
                    scale={1.02}
                    transitionSpeed={2000}
                    className="w-full aspect-video rounded-xl overflow-hidden relative bg-[#0F172A] border border-white/10 group-hover:border-white/20 shadow-lg group-hover:shadow-[0_15px_40px_rgba(255,255,255,0.08)] transition-all duration-500"
                >
                    {cardVisuals}
                </Tilt>
            )}

            {/* Info Section */}
            <div className="flex flex-col gap-1 px-1 mt-1">
                <h3 className="text-slate-100 font-medium text-sm line-clamp-1 leading-snug group-hover:text-primary transition-colors"
                    dangerouslySetInnerHTML={{
                        __html: safeContentTitle
                    }}
                />
                
                <div className="flex items-center justify-between gap-2 mt-1">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1 mr-1">
                        <img src={post.userAvatar} alt={post.username} loading="lazy" decoding="async" className="w-4 h-4 rounded-full object-cover bg-slate-800 shrink-0 border border-white/10" />
                        <span className="text-[11px] text-slate-300 truncate group-hover:text-white transition-colors">
                            {post.username}
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

export default PublicationCard;
