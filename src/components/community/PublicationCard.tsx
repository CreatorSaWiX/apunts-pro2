import { useAuth } from '../../contexts/AuthContext';
import type { CommunityPost } from '../../types/community';
import { Heart, Eye, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { db } from '../../lib/firebase';
import { doc, updateDoc, deleteField } from 'firebase/firestore';

interface PublicationCardProps {
    post: CommunityPost;
}

const PublicationCard = ({ post }: PublicationCardProps) => {
    const { user } = useAuth();
    
    const imageAttachment = post.attachments?.find(a => a.type.startsWith('image/'));
    // If no image, we still want to render something, maybe a text fallback, but now we force images in Create.
    // For old posts without images, use a placeholder gradient
    const fallbackImage = `https://picsum.photos/seed/${post.id}/800/600`;
    const coverUrl = imageAttachment ? imageAttachment.url : fallbackImage;

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

    return (
        <motion.div 
            whileHover={{ y: -8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="flex flex-col gap-3 group"
        >
            {/* The Image Card */}
            <div className="w-full aspect-[4/3] rounded-[2rem] overflow-hidden relative bg-[#0a0a0a] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] border border-white/5">
                <img 
                    src={coverUrl} 
                    alt={post.content.substring(0, 20)} 
                    className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                />

                {/* Glassmorphism Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-between p-6">
                    {/* Top Right Actions */}
                    <div className="flex justify-end transform -translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                        <button 
                            onClick={handleLike}
                            className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 transition-colors ${hasLiked ? 'bg-rose-500/20 text-rose-500 border-rose-500/50' : 'bg-white/10 text-white hover:bg-white/20'}`}
                        >
                            <Heart size={18} fill={hasLiked ? 'currentColor' : 'none'} />
                        </button>
                    </div>

                    {/* Bottom Info */}
                    <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75">
                        <h3 className="text-white font-bold text-lg line-clamp-2 leading-tight drop-shadow-md mb-3">
                            {post.content ? post.content.replace(/!\[.*?\]\(.*?\)/g, '') : 'Project Showcase'}
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-white/70 backdrop-blur-sm bg-black/30 px-3 py-1 rounded-full border border-white/10">
                                Veure Detalls
                            </span>
                            <ArrowUpRight size={16} className="text-white/70" />
                        </div>
                    </div>
                </div>

                {/* Badges (Always visible) */}
                <div className="absolute top-4 left-4 flex gap-2">
                    {post.isPinned && (
                        <div className="bg-white text-black text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                            Featured
                        </div>
                    )}
                </div>
            </div>

            {/* Author Info (Outside the card, extremely clean) */}
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2.5 min-w-0">
                    <img src={post.userAvatar} alt={post.username} className="w-7 h-7 rounded-full object-cover bg-slate-800 shrink-0" />
                    <span className="text-sm font-bold text-slate-300 truncate hover:text-white transition-colors cursor-pointer">
                        {post.username}
                    </span>
                    {post.rank > 0 && (
                        <span className="text-[9px] bg-white/10 text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-widest">PRO</span>
                    )}
                </div>
                
                <div className="flex items-center gap-3 shrink-0 text-slate-500 text-xs font-bold">
                    <div className="flex items-center gap-1.5">
                        <Heart size={14} className={hasLiked ? 'text-rose-500 fill-rose-500' : ''} />
                        <span className={hasLiked ? 'text-rose-500' : ''}>{likeCount > 0 ? likeCount : ''}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Eye size={14} />
                        <span>{(Math.random() * 5000 + 1000).toFixed(0)}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PublicationCard;
