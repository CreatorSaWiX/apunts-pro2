import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import type { CommunityPost } from '../../types/community';
import { Heart, Eye, FileCode2, Box, FileVideo, FileText, Archive } from 'lucide-react';
import { db } from '../../lib/firebase';
import { doc, updateDoc, deleteField, deleteDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import Tilt from 'react-parallax-tilt';
import { renderEmojis } from '../../lib/emojis';

interface PublicationCardProps {
    post: CommunityPost;
    isHeroMode?: boolean;
}

const CODE_EXTENSIONS = ['js', 'jsx', 'ts', 'tsx', 'json', 'html', 'css', 'cpp', 'c', 'h', 'hpp', 'py', 'java', 'go', 'rs', 'php', 'rb'];
const MODEL_EXTENSIONS = ['gltf', 'glb', 'obj'];

const PublicationCard = ({ post, isHeroMode = false }: PublicationCardProps) => {
    const { user } = useAuth();
    const [isHovered, setIsHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };
    
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

    const getSafeContent = (content: string, length: number, isHtml: boolean = false) => {
        if (!content) return '';
        let textOnly = content;
        if (isHtml) {
            textOnly = content.replace(/<[^>]*>?/gm, ' '); // Strip HTML tags for the preview snippet
        }
        textOnly = textOnly.replace(/!\[.*?\]\(.*?\)/g, '');
        const truncated = textOnly.length > length ? textOnly.substring(0, length) + '...' : textOnly;
        return renderEmojis(truncated);
    };

    const getRankStyles = (rank: number) => {
        switch(rank) {
            case 4: // Mythic
                return {
                    border: 'border-rose-500/50 group-hover:border-cyan-400/80',
                    shadow: 'shadow-[0_0_20px_rgba(244,63,94,0.2)] group-hover:shadow-[0_0_40px_rgba(34,211,238,0.4)]',
                    glow: 'from-rose-500/20 via-purple-500/20 to-cyan-500/20',
                    badge: 'bg-linear-to-r from-rose-500 to-cyan-500 text-white border-transparent shadow-[0_0_15px_rgba(244,63,94,0.5)]'
                };
            case 3: // Legendary
                return {
                    border: 'border-amber-400/50 group-hover:border-amber-400/80',
                    shadow: 'shadow-[0_0_20px_rgba(251,191,36,0.2)] group-hover:shadow-[0_0_40px_rgba(251,191,36,0.4)]',
                    glow: 'from-amber-400/20 to-yellow-600/20',
                    badge: 'bg-linear-to-r from-amber-400 to-yellow-600 text-black border-transparent shadow-[0_0_15px_rgba(251,191,36,0.5)]'
                };
            case 2: // Epic
                return {
                    border: 'border-purple-500/50 group-hover:border-purple-400/80',
                    shadow: 'shadow-[0_0_20px_rgba(168,85,247,0.2)] group-hover:shadow-[0_0_40px_rgba(168,85,247,0.4)]',
                    glow: 'from-purple-500/20 to-fuchsia-500/20',
                    badge: 'bg-linear-to-r from-purple-500 to-fuchsia-500 text-white border-transparent shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                };
            case 1: // Featured
                return {
                    border: 'border-white/20 group-hover:border-white/40',
                    shadow: 'shadow-lg group-hover:shadow-[0_15px_40px_rgba(255,255,255,0.15)]',
                    glow: 'from-white/10 to-transparent',
                    badge: 'bg-white text-black border-transparent'
                };
            default:
                return {
                    border: 'border-white/10 group-hover:border-white/20',
                    shadow: 'shadow-lg group-hover:shadow-[0_15px_40px_rgba(255,255,255,0.08)]',
                    glow: 'from-white/5 to-transparent',
                    badge: 'bg-black/50 text-white border-white/10'
                };
        }
    };

    const rankStyles = getRankStyles(post.rank || 0);

    return (
        <div 
            className="flex flex-col gap-2 group cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={handleMouseMove}
        >
            <Tilt
                tiltEnable={!isHeroMode}
                tiltMaxAngleX={isHeroMode ? 0 : 5}
                tiltMaxAngleY={isHeroMode ? 0 : 5}
                scale={isHeroMode ? 1 : 1.02}
                transitionSpeed={2000}
                className={`w-full aspect-video rounded-xl overflow-hidden relative bg-[#0F172A] border ${rankStyles.border} transition-all duration-500 ${rankStyles.shadow}`}
            >
                {/* Rarity Glow Overlay */}
                {(post.rank || 0) > 1 && (
                    <div className={`absolute inset-0 bg-linear-to-br ${rankStyles.glow} opacity-30 group-hover:opacity-60 transition-opacity duration-500 z-0 pointer-events-none`} />
                )}
                {/* Spotlight Overlay */}
                <div 
                    className="pointer-events-none absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 mix-blend-overlay"
                    style={{
                        background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.3), transparent 40%)`
                    }}
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
                    <img 
                        src={coverUrl} 
                        alt={post.content.substring(0, 20)} 
                        className={`w-full h-full object-cover transition-transform duration-500 ${!isHeroMode ? 'group-hover:scale-105' : ''}`}
                    />
                ) : (
                    <div className={`w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-white/10 to-white/5 p-6 text-center border border-white/5 relative overflow-hidden transition-transform duration-500 ${!isHeroMode ? 'group-hover:scale-105' : ''}`}>
                        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent z-0" />
                        <span className="text-4xl font-black text-white/10 select-none absolute -bottom-4 -right-4">{post.subject}</span>
                        <p className="text-white font-bold text-lg leading-snug line-clamp-3 relative z-10"
                            dangerouslySetInnerHTML={{
                                __html: post.content 
                                    ? getSafeContent(post.content, 150, post.isNote)
                                    : 'Discussió'
                            }}
                        />
                    </div>
                )}

                {/* Overlays */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Top Right Actions (Like Button) */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    <button 
                        onClick={handleLike}
                        className={`h-8 px-2.5 rounded-full flex items-center justify-center gap-1.5 backdrop-blur-md border border-white/20 transition-all active:scale-90 ${hasLiked ? 'bg-rose-500/20 text-rose-500 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'bg-black/50 text-white hover:bg-black/70'}`}
                    >
                        <Heart size={14} fill={hasLiked ? 'currentColor' : 'none'} />
                        {likeCount > 0 && <span className="text-xs font-bold">{likeCount}</span>}
                    </button>
                </div>

                {/* Top Left Badges */}
                <div className="absolute top-2 left-2 flex flex-wrap gap-1 z-10 max-w-[80%]">
                    {badgeText && (
                        <div className="bg-black/50 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold tracking-widest px-2 py-1 rounded-md flex items-center gap-1.5 shadow-xl">
                            <span className="text-primary">{badgeIcon}</span>
                            {badgeText}
                        </div>
                    )}
                    {(post.rank || 0) > 0 && (
                        <div className={`${rankStyles.badge} text-[10px] font-black tracking-widest px-2 py-1 rounded-md shadow-xl uppercase backdrop-blur-md border`}>
                            {['', 'FEATURED', 'EPIC', 'LEGENDARY', 'MYTHIC'][post.rank || 0]}
                        </div>
                    )}
                    {post.isPinned && (post.rank || 0) === 0 && (
                        <div className="bg-white text-black text-[10px] font-bold tracking-widest px-2 py-1 rounded-md shadow-xl">
                            FEATURED
                        </div>
                    )}
                </div>
            </Tilt>

            {/* Info Section */}
            <div className="flex flex-col gap-1 px-1 mt-1">
                <h3 className="text-slate-100 font-medium text-sm line-clamp-1 leading-snug group-hover:text-primary transition-colors"
                    dangerouslySetInnerHTML={{
                        __html: post.content 
                            ? getSafeContent(post.content, 150, post.isNote)
                            : 'Sense descripció'
                    }}
                />
                
                <div className="flex items-center justify-between mt-0.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                        <img src={post.userAvatar} alt={post.username} className="w-4 h-4 rounded-full object-cover bg-slate-800 shrink-0 border border-white/10" />
                        <span className="text-[11px] text-slate-400 truncate group-hover:text-white transition-colors">
                            {post.username}
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0 text-slate-500 text-[11px] font-medium">
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
