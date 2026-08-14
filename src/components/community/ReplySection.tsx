import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { 
    collection, query, orderBy, onSnapshot, 
    addDoc, serverTimestamp 
} from 'firebase/firestore';
import type { PostReply } from '../../types/community';
import { Smile, ChevronDown, ArrowUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { formatDistanceToNow } from 'date-fns';
import { ca } from 'date-fns/locale';
import Spinner from '../ui/Spinner';
import { CUSTOM_EMOJIS } from '../../lib/emojis';
import { useMentions } from '../../hooks/useMentions';
import MentionPopup from '../ui/modals/MentionPopup';

interface ReplySectionProps {
    postId: string;
    postAuthorId: string;
    postContent: string;
    onNavigateToProfile?: (username: string) => void;
}

const CUSTOM_EMOTES = Object.values(CUSTOM_EMOJIS);

const ReplySection = ({ postId, postAuthorId, postContent, onNavigateToProfile }: ReplySectionProps) => {
    const { user } = useAuth();
    const [replies, setReplies] = useState<PostReply[]>([]);
    const [loading, setLoading] = useState(true);
    const [newReply, setNewReply] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [visibleLimit, setVisibleLimit] = useState(3);
    const repliesEndRef = useRef<HTMLDivElement>(null);
    
    const { 
        mentionSearch, 
        handleInputChange, 
        insertMention, 
        getMentionedUsers, 
        suggestedUsers 
    } = useMentions();

    useEffect(() => {
        const q = query(
            collection(db, 'community_posts', postId, 'replies'),
            orderBy('createdAt', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const rawReplies = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as PostReply[];
            setReplies(rawReplies);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [postId]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newReply.trim()) return;

        const content = newReply.trim();
        setNewReply('');
        
        try {
            await addDoc(collection(db, 'community_posts', postId, 'replies'), {
                userId: user.id,
                username: user.username,
                userAvatar: user.avatar || '',
                content: content,
                createdAt: serverTimestamp()
            });

            // Send notification to post owner
            if (postAuthorId !== user.id) {
                await addDoc(collection(db, 'notifications'), {
                    userId: postAuthorId,
                    type: 'reply',
                    fromUserId: user.id,
                    fromUserName: user.username,
                    fromUserAvatar: user.avatar || '',
                    resourceId: postId,
                    resourceTitle: postContent.substring(0, 30) + '...',
                    commentId: 'community_post_reply',
                    read: false,
                    createdAt: serverTimestamp()
                });
            }

            // Send notifications to mentioned users
            const mentionedUsers = getMentionedUsers(content, user.id);
            await Promise.all(mentionedUsers.map(async (mUser) => {
                if (mUser.id === postAuthorId) return; // Skip if owner already notified
                
                await addDoc(collection(db, 'notifications'), {
                    userId: mUser.id,
                    type: 'mention',
                    fromUserId: user.id,
                    fromUserName: user.username,
                    fromUserAvatar: user.avatar || '',
                    resourceId: postId,
                    resourceTitle: postContent.substring(0, 30) + '...',
                    commentId: 'community_post_mention',
                    read: false,
                    createdAt: serverTimestamp()
                });
            }));

            setTimeout(() => repliesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        } catch (e) {
            console.error(e);
        }
    };

    const handleEmojiSelect = (emojiUrl: string) => {
        const emojiName = emojiUrl.split('/').pop()?.split('.')[0] || 'emoji';
        setNewReply(prev => prev + (prev.endsWith(' ') || prev === '' ? '' : ' ') + `:${emojiName}: `);
        setShowEmojiPicker(false);
    };

    const visibleReplies = replies.slice(0, visibleLimit);
    const hasMore = replies.length > visibleLimit;

    return (
        <div className="flex flex-col h-full min-h-0 overflow-hidden">
            {/* Replies List */}
            <div className="flex-1 min-h-0 overflow-y-auto p-6 custom-scrollbar space-y-4">
                {loading ? (
                    <div className="flex justify-center py-4">
                        <Spinner size="sm" variant="slate" glow={false} />
                    </div>
                ) : replies.length === 0 ? (
                    <div className="text-center py-4 text-slate-500 text-xs italic">
                        Encara no hi ha respostes. <span className="text-slate-300">Sigues el primer!</span>
                    </div>
                ) : (
                    <>
                        {visibleReplies.map((reply) => (
                            <div key={reply.id} className="flex gap-3 group">
                                <img loading="lazy"
                                    src={reply.userAvatar} 
                                    alt={reply.username} 
                                    className={`w-8 h-8 rounded-xl object-cover shrink-0 ${onNavigateToProfile ? 'cursor-pointer' : ''}`}
                                    onClick={() => onNavigateToProfile && reply.username && onNavigateToProfile(reply.username)}
                                />
                                <div className="flex-1 min-w-0 bg-white/5 rounded-2xl p-3 border border-white/5">
                                    <div className="flex items-center justify-between mb-1">
                                        <span 
                                            className={`text-xs font-bold text-slate-300 group-hover:text-primary transition-colors ${onNavigateToProfile ? 'cursor-pointer' : ''}`}
                                            onClick={() => onNavigateToProfile && reply.username && onNavigateToProfile(reply.username)}
                                        >
                                            {reply.username}
                                        </span>
                                        <span className="text-[10px] text-slate-500">
                                            {reply.createdAt?.toDate ? formatDistanceToNow(reply.createdAt.toDate(), { locale: ca, addSuffix: true }) : 'Ara'}
                                        </span>
                                    </div>
                                    <div className="text-xs text-slate-400 prose prose-invert prose-sm max-w-none prose-p:leading-normal prose-img:w-5 prose-img:h-5 prose-img:inline-block">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {reply.content ? reply.content.replace(/:([a-zA-Z0-9_]+):/g, (match, name) => CUSTOM_EMOJIS[name] ? `![${name}](${CUSTOM_EMOJIS[name]})` : match) : ''}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {hasMore && (
                            <button type="button" 
                                onClick={() => setVisibleLimit(prev => prev + 10)}
                                className="w-full py-2 text-[11px] font-bold text-slate-500 hover:text-primary transition-colors flex items-center justify-center gap-2"
                            >
                                <ChevronDown size={14} />
                                Veure {replies.length - visibleLimit} respostes més
                            </button>
                        )}
                    </>
                )}
                <div ref={repliesEndRef} />
            </div>

            {/* Input Area */}
            {user ? (
                <form onSubmit={handleSend} className="shrink-0 bg-transparent px-4 py-3 pb-8 sm:pb-4 relative">
                    <div className="flex items-end gap-2.5">
                        <img 
                            src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} 
                            alt={user.username} 
                            className="w-9 h-9 rounded-full object-cover shrink-0 border border-white/10 bg-slate-800 mb-0.5"
                        />
                        <div className="relative flex-1 flex items-end bg-white/5 border border-white/10 hover:border-white/20 focus-within:border-white/30 focus-within:bg-white/10 rounded-[1.25rem] p-1 transition">
                            
                            <div className="relative flex-1">
                                {mentionSearch && (
                                    <MentionPopup users={suggestedUsers} onSelect={(u) => setNewReply(insertMention(newReply, u))} position="top" />
                                )}
                                <textarea 
                                    value={newReply}
                                    onChange={(e) => {
                                        setNewReply(e.target.value);
                                        handleInputChange(e.target.value, e.target.selectionStart || 0);
                                    }}
                                    placeholder="Afegeix un comentari..."
                                    rows={1}
                                    onInput={(e) => {
                                        const target = e.target as HTMLTextAreaElement;
                                        target.style.height = 'auto';
                                        target.style.height = Math.min(target.scrollHeight, 100) + 'px';
                                    }}
                                    className="w-full bg-transparent border-none px-3 py-2 text-base sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-0 resize-none max-h-[100px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                                    style={{ height: '36px' }}
                                />
                            </div>

                            <div className="relative shrink-0 flex items-center mb-0.5">
                                <button
                                    type="button"
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    className={`p-1.5 rounded-full transition-colors mr-1 ${showEmojiPicker ? 'text-primary' : 'text-slate-400 hover:text-white'}`}
                                >
                                    <Smile size={22} />
                                </button>
                                {showEmojiPicker && (
                                    <div className="absolute bottom-full right-0 mb-4 z-50">
                                        <div className="fixed inset-0" onClick={() => setShowEmojiPicker(false)} />
                                        <div className="relative p-2 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl grid grid-cols-6 gap-1 w-72 max-h-48 overflow-y-auto custom-scrollbar">
                                            {CUSTOM_EMOTES.map(emoji => (
                                                <button
                                                    key={emoji}
                                                    type="button"
                                                    onClick={() => handleEmojiSelect(emoji)}
                                                    className="p-1 rounded-lg hover:bg-slate-800 transition-transform hover:scale-110 flex items-center justify-center"
                                                >
                                                    <img src={emoji} alt="emoji" loading="lazy" className="w-6 h-6 object-contain" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                <button 
                                    type="submit"
                                    disabled={!newReply.trim()}
                                    className={`p-1.5 rounded-full transition flex items-center justify-center mr-1 ${newReply.trim() ? 'bg-primary text-white shadow-md shadow-primary/30' : 'bg-transparent text-slate-600'}`}
                                >
                                    <ArrowUp size={20} strokeWidth={3} />
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="shrink-0 bg-transparent text-center py-6 text-xs text-slate-500 uppercase tracking-widest font-bold">
                    Inicia sessió per respondre
                </div>
            )}
        </div>
    );
};

export default ReplySection;
