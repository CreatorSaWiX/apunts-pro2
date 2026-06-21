import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import type { CommunityPost } from '../../types/community';
import { Heart, Eye, FileCode2, Box, FileVideo, FileText, Archive } from 'lucide-react';
import { db } from '../../lib/firebase';
import { doc, updateDoc, deleteField } from 'firebase/firestore';
import Tilt from 'react-parallax-tilt';
import { renderEmojis } from '../../lib/emojis';

interface PublicationCardProps {
    post: CommunityPost;
}

const CODE_EXTENSIONS = ['js', 'jsx', 'ts', 'tsx', 'json', 'html', 'css', 'cpp', 'c', 'h', 'hpp', 'py', 'java', 'go', 'rs', 'php', 'rb'];
const MODEL_EXTENSIONS = ['gltf', 'glb', 'obj'];

const PublicationCard = ({ post }: PublicationCardProps) => {
    const { user } = useAuth();
    const [isHovered, setIsHovered] = useState(false);
    
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
            } else {
                await updateDoc(postRef, {
                    [`reactions.${user.id}`]: { emoji: '❤️', username: user.username, userId: user.id }
                });
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

    return (
        <div 
            className="flex flex-col gap-2 group cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Tilt
                tiltMaxAngleX={5}
                tiltMaxAngleY={5}
                scale={1.02}
                transitionSpeed={2000}
                className="w-full aspect-video rounded-xl overflow-hidden relative bg-[#0a0a0a] border border-white/10 group-hover:border-white/20 transition-colors duration-200 shadow-lg group-hover:shadow-[0_10px_30px_rgba(255,255,255,0.05)]"
            >
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
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-white/10 to-white/5 p-6 text-center border border-white/5 relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
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
                        className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 transition-all active:scale-90 ${hasLiked ? 'bg-rose-500/20 text-rose-500 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'bg-black/50 text-white hover:bg-black/70'}`}
                    >
                        <Heart size={14} fill={hasLiked ? 'currentColor' : 'none'} />
                    </button>
                </div>

                {/* Top Left Badges */}
                <div className="absolute top-2 left-2 flex gap-1 z-10">
                    {badgeText && (
                        <div className="bg-black/50 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold tracking-widest px-2 py-1 rounded-md flex items-center gap-1.5 shadow-xl">
                            <span className="text-primary">{badgeIcon}</span>
                            {badgeText}
                        </div>
                    )}
                    {post.isPinned && (
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
                            <span>{(Math.random() * 500 + 100).toFixed(0)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicationCard;
