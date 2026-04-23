import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import type { CommunityPost, PostRank } from '../../types/community';
import { SUBJECTS } from '../../config/subjects';
import { 
    MessageSquare, Heart, Share2, MoreHorizontal, 
    Zap, Award, Flame, Pin, Trash2, AlertCircle 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ca } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../lib/firebase';
import { doc, updateDoc, deleteDoc, deleteField, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import ReplySection from './ReplySection';

interface PublicationCardProps {
    post: CommunityPost;
}

const rankStyles: Record<PostRank, { 
    container: string, 
    badge: string, 
    label: string, 
    icon: any,
    glow: string 
}> = {
    0: { 
        container: 'border-white/5 bg-slate-900/50', 
        badge: 'bg-slate-800 text-slate-400', 
        label: 'Normal', 
        icon: MessageSquare,
        glow: 'opacity-0'
    },
    1: { 
        container: 'border-sky-500/30 bg-sky-950/20 shadow-[0_0_20px_rgba(14,165,233,0.15)]', 
        badge: 'bg-sky-500 text-white shadow-lg shadow-sky-500/40', 
        label: 'Featured', 
        icon: Zap,
        glow: 'bg-sky-500/10 opacity-100'
    },
    2: { 
        container: 'border-rose-500/40 bg-rose-950/20 shadow-[0_0_30px_rgba(244,63,94,0.2)] animate-pulse', 
        badge: 'bg-rose-500 text-white shadow-lg shadow-rose-500/40', 
        label: 'Epic', 
        icon: Flame,
        glow: 'bg-rose-500/15 opacity-100'
    },
    3: { 
        container: 'border-amber-500/50 bg-amber-950/20 ring-1 ring-amber-500/30', 
        badge: 'bg-linear-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/40', 
        label: 'Legendary', 
        icon: Award,
        glow: 'bg-amber-500/20 opacity-100'
    },
    4: { 
        container: 'border-transparent bg-slate-900/80 relative before:absolute before:-inset-[2px] before:bg-linear-to-r before:from-indigo-500 before:via-purple-500 before:to-pink-500 before:rounded-[34px] before:-z-10 before:animate-gradient-x', 
        badge: 'bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 text-white italic font-black tracking-tighter', 
        label: 'Mythic', 
        icon: Zap,
        glow: 'bg-purple-500/30 opacity-100 blur-[50px]'
    }
};

const PublicationCard = ({ post }: PublicationCardProps) => {
    const { user } = useAuth();
    const [showReplies, setShowReplies] = useState(false);
    const [showModMenu, setShowModMenu] = useState(false);
    const subject = SUBJECTS.find(s => s.id === post.subject);
    const isMod = user?.role === 'moderador';
    const isOwner = user?.id === post.userId;
    
    const style = rankStyles[post.rank];
    const RankIcon = style.icon;

    const handleReaction = async (emoji: string) => {
        if (!user) return;
        const postRef = doc(db, 'community_posts', post.id);
        const hasReacted = post.reactions?.[user.id]?.emoji === emoji;

        try {
            if (hasReacted) {
                await updateDoc(postRef, {
                    [`reactions.${user.id}`]: deleteField()
                });
            } else {
                await updateDoc(postRef, {
                    [`reactions.${user.id}`]: {
                        emoji,
                        username: user.username,
                        userId: user.id
                    }
                });

                // Trigger Notification
                if (post.userId !== user.id) {
                    await addDoc(collection(db, 'notifications'), {
                        userId: post.userId,
                        type: 'reaction',
                        content: emoji,
                        fromUserId: user.id,
                        fromUserName: user.username,
                        fromUserAvatar: user.avatar || '',
                        resourceId: post.id,
                        resourceTitle: post.content.substring(0, 30) + '...',
                        commentId: 'community_post', // To distinguish from solution comments
                        read: false,
                        createdAt: serverTimestamp()
                    });
                }
            }
        } catch (e) { console.error(e); }
    };

    const updateRank = async (rank: PostRank) => {
        if (!isMod) return;
        await updateDoc(doc(db, 'community_posts', post.id), { rank });
        setShowModMenu(false);
    };

    const togglePin = async () => {
        if (!isMod) return;
        await updateDoc(doc(db, 'community_posts', post.id), { isPinned: !post.isPinned });
        setShowModMenu(false);
    };

    const deletePost = async () => {
        if (!isMod && !isOwner) return;
        if (confirm("Segur que vols eliminar aquesta publicació?")) {
            await deleteDoc(doc(db, 'community_posts', post.id));
        }
    };

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
                relative rounded-[32px] p-1 transition-all duration-500
                ${post.rank === 4 ? 'z-10' : 'z-0'}
            `}
        >
            {/* Background Glow */}
            <div className={`absolute inset-0 rounded-[32px] blur-3xl pointer-events-none transition-all duration-700 -z-20 ${style.glow}`} />

            <div className={`
                h-full w-full rounded-[30px] border backdrop-blur-2xl p-6 md:p-8 flex flex-col gap-6
                ${style.container}
            `}>
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <img 
                                src={post.userAvatar} 
                                alt={post.username} 
                                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white/10"
                            />
                            {post.isPinned && (
                                <div className="absolute -top-2 -left-2 p-1.5 bg-amber-500 text-white rounded-full shadow-lg border-2 border-slate-900">
                                    <Pin size={10} fill="currentColor" />
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className="font-bold text-white text-lg">{post.username}</h4>
                                {post.rank > 0 && (
                                    <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${style.badge}`}>
                                        <RankIcon size={10} strokeWidth={3} />
                                        <span>{style.label}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span>{post.createdAt?.toDate ? formatDistanceToNow(post.createdAt.toDate(), { locale: ca, addSuffix: true }) : 'Ara'}</span>
                                <span>•</span>
                                <span className={`font-bold text-${subject?.color || 'slate'}-400 uppercase tracking-widest text-[10px]`}>
                                    {subject?.label || 'General'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <button 
                            onClick={() => setShowModMenu(!showModMenu)}
                            className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                        >
                            <MoreHorizontal size={20} />
                        </button>
                        
                        <AnimatePresence>
                            {showModMenu && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    className="absolute right-0 top-full mt-2 w-56 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-50 p-2"
                                >
                                    {isMod && (
                                        <>
                                            <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Moderar</div>
                                            <button onClick={() => updateRank(1)} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-sky-400 hover:bg-white/5 rounded-xl transition-all">
                                                <Zap size={14} /> Mark as Featured
                                            </button>
                                            <button onClick={() => updateRank(2)} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-white/5 rounded-xl transition-all">
                                                <Flame size={14} /> Mark as Epic
                                            </button>
                                            <button onClick={() => updateRank(3)} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-amber-400 hover:bg-white/5 rounded-xl transition-all">
                                                <Award size={14} /> Mark as Legendary
                                            </button>
                                            <button onClick={() => updateRank(4)} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-purple-400 hover:bg-white/5 rounded-xl transition-all">
                                                <Zap size={14} className="animate-pulse" /> Mark as Mythic
                                            </button>
                                            <div className="h-px bg-white/5 my-1" />
                                            <button onClick={togglePin} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-200 hover:bg-white/5 rounded-xl transition-all">
                                                <Pin size={14} /> {post.isPinned ? 'Desancorar' : 'Ancorar'}
                                            </button>
                                        </>
                                    )}
                                    {(isMod || isOwner) && (
                                        <button onClick={deletePost} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                                            <Trash2 size={14} /> Eliminar
                                        </button>
                                    )}
                                    {!isMod && !isOwner && (
                                        <button 
                                            onClick={async () => {
                                                await updateDoc(doc(db, 'community_posts', post.id), { reports: (post.reports || 0) + 1 });
                                                setShowModMenu(false);
                                                alert("Gràcies! Hem rebut la teva denúncia.");
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:bg-white/5 rounded-xl transition-all"
                                        >
                                            <AlertCircle size={14} /> Denunciar contingut
                                        </button>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Content */}
                <div className="prose prose-invert max-w-none prose-p:text-slate-300 prose-p:leading-relaxed prose-a:text-primary hover:prose-a:text-accent">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {post.content}
                    </ReactMarkdown>
                </div>

                {/* Footer / Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => handleReaction('❤️')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${post.reactions?.[user?.id || '']?.emoji === '❤️' ? 'bg-rose-500/20 text-rose-500' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
                        >
                            <Heart size={18} fill={post.reactions?.[user?.id || '']?.emoji === '❤️' ? 'currentColor' : 'none'} />
                            <span className="text-sm font-bold">{Object.values(post.reactions || {}).filter(r => r.emoji === '❤️').length}</span>
                        </button>

                        <button 
                            onClick={() => setShowReplies(!showReplies)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${showReplies ? 'bg-primary/20 text-accent' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
                        >
                            <MessageSquare size={18} />
                            <span className="text-sm font-bold">Respon</span>
                        </button>
                    </div>

                    <button className="p-2 text-slate-500 hover:text-white transition-all">
                        <Share2 size={18} />
                    </button>
                </div>

                {/* Replies Section */}
                <AnimatePresence>
                    {showReplies && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-white/5 -mx-6 -mb-6 mt-2 p-6 overflow-hidden rounded-b-[30px]"
                        >
                            <ReplySection 
                                postId={post.id} 
                                postAuthorId={post.userId}
                                postContent={post.content}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default PublicationCard;
