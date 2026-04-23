import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { 
    collection, query, orderBy, onSnapshot, 
    addDoc, serverTimestamp 
} from 'firebase/firestore';
import type { PostReply } from '../../types/community';
import { Send, Smile, Loader, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { formatDistanceToNow } from 'date-fns';
import { ca } from 'date-fns/locale';

interface ReplySectionProps {
    postId: string;
    postAuthorId: string;
    postContent: string;
}

const emojiModules = import.meta.glob('../../assets/emojis/*.{png,PNG,webp,jpg}', { eager: true, as: 'url' });
const CUSTOM_EMOTES = Object.values(emojiModules);

const ReplySection = ({ postId, postAuthorId, postContent }: ReplySectionProps) => {
    const { user } = useAuth();
    const [replies, setReplies] = useState<PostReply[]>([]);
    const [loading, setLoading] = useState(true);
    const [newReply, setNewReply] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [visibleLimit, setVisibleLimit] = useState(3);
    const repliesEndRef = useRef<HTMLDivElement>(null);

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

            setTimeout(() => repliesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        } catch (e) {
            console.error(e);
        }
    };

    const handleEmojiSelect = (emojiUrl: string) => {
        const emojiName = emojiUrl.split('/').pop()?.split('.')[0] || 'emoji';
        setNewReply(prev => prev + (prev.endsWith(' ') || prev === '' ? '' : ' ') + `![${emojiName}](${emojiUrl}) `);
        setShowEmojiPicker(false);
    };

    const visibleReplies = replies.slice(0, visibleLimit);
    const hasMore = replies.length > visibleLimit;

    return (
        <div className="flex flex-col gap-4">
            {/* Replies List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex justify-center py-4">
                        <Loader className="animate-spin text-slate-600" size={16} />
                    </div>
                ) : replies.length === 0 ? (
                    <div className="text-center py-4 text-slate-500 text-xs italic">
                        Encara no hi ha respostes. Sigues el primer!
                    </div>
                ) : (
                    <>
                        {visibleReplies.map((reply) => (
                            <div key={reply.id} className="flex gap-3 group">
                                <img 
                                    src={reply.userAvatar} 
                                    alt={reply.username} 
                                    className="w-8 h-8 rounded-xl object-cover shrink-0"
                                />
                                <div className="flex-1 min-w-0 bg-white/5 rounded-2xl p-3 border border-white/5">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-bold text-slate-300">{reply.username}</span>
                                        <span className="text-[10px] text-slate-500">
                                            {reply.createdAt?.toDate ? formatDistanceToNow(reply.createdAt.toDate(), { locale: ca, addSuffix: true }) : 'Ara'}
                                        </span>
                                    </div>
                                    <div className="text-xs text-slate-400 prose prose-invert prose-sm max-w-none prose-p:leading-normal prose-img:w-5 prose-img:h-5 prose-img:inline-block">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {reply.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {hasMore && (
                            <button 
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
                <form onSubmit={handleSend} className="relative mt-2">
                    <div className="relative flex items-center gap-2">
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className={`p-2 rounded-lg transition-all ${showEmojiPicker ? 'bg-primary/20 text-accent' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                            >
                                <Smile size={18} />
                            </button>
                            {showEmojiPicker && (
                                <div className="absolute bottom-full left-0 mb-2 z-50">
                                    <div className="fixed inset-0" onClick={() => setShowEmojiPicker(false)} />
                                    <div className="relative p-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl grid grid-cols-6 gap-1 w-72 max-h-48 overflow-y-auto custom-scrollbar">
                                        {CUSTOM_EMOTES.map(emoji => (
                                            <button
                                                key={emoji}
                                                type="button"
                                                onClick={() => handleEmojiSelect(emoji)}
                                                className="p-1 rounded-lg hover:bg-slate-800 transition-transform hover:scale-110 flex items-center justify-center"
                                            >
                                                <img src={emoji} alt="emoji" className="w-6 h-6 object-contain" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <input 
                            type="text" 
                            value={newReply}
                            onChange={(e) => setNewReply(e.target.value)}
                            placeholder="Escriu una resposta..."
                            className="flex-1 bg-slate-950/50 border border-white/5 rounded-xl px-4 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-all"
                        />

                        <button 
                            type="submit"
                            disabled={!newReply.trim()}
                            className="p-2 bg-primary text-white rounded-xl disabled:opacity-30 transition-all shadow-lg shadow-primary/20"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </form>
            ) : (
                <div className="text-center py-2 text-[10px] text-slate-600 uppercase tracking-widest font-bold">
                    Inicia sessió per respondre
                </div>
            )}
        </div>
    );
};

export default ReplySection;
