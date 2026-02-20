import { useState, useEffect, useRef } from 'react';
import {
    collection, query, orderBy, onSnapshot,
    addDoc, updateDoc, deleteDoc, doc, getDocs, where,
    serverTimestamp, deleteField, limit
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import CommentItem, { type Comment } from './CommentItem';
import { Send, Loader, MessageCircle, Info, Image as ImageIcon } from 'lucide-react';
import ConfirmModal from '../ui/ConfirmModal';
import GifPicker from '../ui/GifPicker';
import { AnimatePresence } from 'framer-motion';

interface CommentsSectionProps {
    solutionId: string; // The ID of the solution (parent document)
    solutionTitle?: string;
}

const CommentsSection = ({ solutionId, solutionTitle }: CommentsSectionProps) => {
    const { user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [threadedComments, setThreadedComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState<any | null>(null);
    const [showGifPicker, setShowGifPicker] = useState(false);
    const [visibleCount, setVisibleCount] = useState(20);
    const commentsEndRef = useRef<HTMLDivElement>(null);

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

    // Subscribe to comments
    useEffect(() => {
        if (!solutionId) return;

        const q = query(
            collection(db, 'solutions', solutionId, 'comments'),
            orderBy('createdAt', 'asc'),
            limit(visibleCount)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const rawComments = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Comment[];

            setComments(rawComments);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [solutionId, visibleCount]);

    // Build threads whenever comments change
    useEffect(() => {
        const buildThreads = () => {
            const roots: Comment[] = [];
            const byId: Record<string, Comment> = {};

            // 1. Index comments by ID and clone to avoid mutation issues
            comments.forEach(c => {
                byId[c.id] = { ...c, replies: [] };
            });

            // 2. Assign to parents
            comments.forEach(c => {
                const node = byId[c.id];
                if (c.replyTo) {
                    let parentId = c.replyTo.id;
                    let rootId = parentId;
                    let depth = 0;

                    // Safety break
                    while (byId[rootId] && byId[rootId].replyTo && depth < 50) {
                        rootId = byId[rootId].replyTo!.id;
                        depth++;
                    }

                    if (byId[rootId]) {
                        byId[rootId].replies?.push(node);
                    } else {
                        roots.push(node);
                    }

                } else {
                    roots.push(node);
                }
            });

            setThreadedComments(roots);
        };

        buildThreads();
    }, [comments]);


    const scrollToBottom = () => {
        commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const submitComment = async (content: string, replyToObj: any = null) => {
        if (!content.trim() || !user) return;

        try {
            // Add comment
            const docRef = await addDoc(collection(db, 'solutions', solutionId, 'comments'), {
                userId: user.id,
                username: user.username || 'Usuari',
                userAvatar: user.avatar || '',
                content: content,
                createdAt: serverTimestamp(),
                reactions: {},
                replyTo: replyToObj ? {
                    id: replyToObj.id,
                    username: replyToObj.username,
                    content: replyToObj.content.substring(0, 50) + (replyToObj.content.length > 50 ? '...' : '')
                } : null
            });

            // Send notification if replying
            if (replyToObj && replyToObj.userId !== user.id) {
                await addDoc(collection(db, 'notifications'), {
                    userId: replyToObj.userId, // The receiver
                    type: 'reply',
                    fromUserId: user.id,
                    fromUserName: user.username,
                    fromUserAvatar: user.avatar || '',
                    resourceId: solutionId, // To link back
                    resourceTitle: solutionTitle || 'Solució',
                    commentId: docRef.id,
                    read: false,
                    createdAt: serverTimestamp()
                });
            }

            scrollToBottom();
        } catch (error) {
            console.error("Error sending comment:", error);
        }
    };

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        const content = newComment.trim();
        if (!content) return;

        setNewComment('');
        setReplyingTo(null);
        await submitComment(content, replyingTo);
    };

    const handleGifSelect = async (gifUrl: string) => {
        setShowGifPicker(false);
        await submitComment(gifUrl, replyingTo);
        setReplyingTo(null);
    };

    const handleReaction = async (commentId: string, emoji: string) => {
        if (!user) return;

        const commentRef = doc(db, 'solutions', solutionId, 'comments', commentId);
        const comment = comments.find(c => c.id === commentId);

        if (!comment) return;

        const currentReaction = comment.reactions?.[user.id];

        try {
            if (currentReaction?.emoji === emoji) {
                await updateDoc(commentRef, {
                    [`reactions.${user.id}`]: deleteField()
                });
            } else {
                await updateDoc(commentRef, {
                    [`reactions.${user.id}`]: {
                        emoji,
                        username: user.username,
                        userId: user.id
                    }
                });

                if (comment.userId !== user.id) {
                    await addDoc(collection(db, 'notifications'), {
                        userId: comment.userId,
                        type: 'reaction',
                        content: emoji,
                        fromUserId: user.id,
                        fromUserName: user.username,
                        fromUserAvatar: user.avatar || '',
                        resourceId: solutionId,
                        resourceTitle: solutionTitle || 'Solució',
                        commentId: commentId,
                        read: false,
                        createdAt: serverTimestamp()
                    });
                }
            }
        } catch (error) {
            console.error("Error updating reaction:", error);
        }
    };

    // Open Delete Modal
    const handleDeleteRequest = (commentId: string) => {
        setCommentToDelete(commentId);
        setIsDeleteModalOpen(true);
    };

    // Actual Delete Action
    const confirmDelete = async () => {
        if (!commentToDelete) return;

        try {
            // Recursive function to delete comment and its replies
            const deleteRecursively = async (targetId: string) => {
                // Find direct replies first
                const repliesQuery = query(
                    collection(db, 'solutions', solutionId, 'comments'),
                    where('replyTo.id', '==', targetId)
                );

                const snapshot = await getDocs(repliesQuery);

                // Delete replies recursively
                const deletePromises = snapshot.docs.map(doc => deleteRecursively(doc.id));
                await Promise.all(deletePromises);

                // Delete the comment itself
                await deleteDoc(doc(db, 'solutions', solutionId, 'comments', targetId));
            };

            await deleteRecursively(commentToDelete);
            setCommentToDelete(null);
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    return (
        <>
            <div className="flex flex-col bg-slate-900/50 border border-white/5 rounded-2xl shadow-lg mt-8 mb-12 backdrop-blur-sm">
                {/* Header */}
                <div className="px-5 py-4 bg-white/5 border-b border-white/5 flex items-center gap-3 rounded-t-2xl">
                    <MessageCircle size={18} className="text-sky-400" />
                    <h3 className="font-bold text-slate-200">Comentaris</h3>
                    <span className="text-xs font-mono text-slate-500 bg-black/20 px-2 py-0.5 rounded-full">
                        {comments.length}
                    </span>
                </div>

                {/* List */}
                <div className="flex-1 p-5 min-h-[200px] max-h-[500px] overflow-y-auto custom-scrollbar flex flex-col gap-6">
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <Loader className="animate-spin text-sky-500" />
                        </div>
                    ) : threadedComments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-slate-500 gap-2 opacity-60">
                            <MessageCircle size={32} />
                            <p>Sigues el primer en comentar!</p>
                        </div>
                    ) : (
                        <>
                            {threadedComments.map((comment) => (
                                <CommentItem
                                    key={comment.id}
                                    comment={comment}
                                    onReact={handleReaction}
                                    onReply={(c) => {
                                        setReplyingTo(c);
                                        setTimeout(scrollToBottom, 100); // Focus input area
                                    }}
                                    onDelete={handleDeleteRequest}
                                />
                            ))}
                            {comments.length >= visibleCount && (
                                <button
                                    onClick={() => setVisibleCount(prev => prev + 20)}
                                    className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-sky-400 hover:bg-white/5 rounded-lg transition-colors border border-dashed border-white/10"
                                >
                                    Carregar més comentaris...
                                </button>
                            )}
                        </>
                    )}
                    <div ref={commentsEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-black/20 border-t border-white/5 relative z-10 rounded-b-2xl">
                    {user ? (
                        <form onSubmit={handleSend} className="relative">
                            {replyingTo && (
                                <div className="flex items-center justify-between bg-sky-500/10 border border-sky-500/20 text-sky-400 px-3 py-2 rounded-t-lg text-xs mb-2">
                                    <span>Responent a <b>@{replyingTo.username}</b></span>
                                    <button
                                        type="button"
                                        onClick={() => setReplyingTo(null)}
                                        className="hover:text-white"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                            <div className="relative flex items-center gap-2">
                                {/* GIF Picker Button */}
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowGifPicker(!showGifPicker)}
                                        className={`p-2 rounded-lg transition-colors ${showGifPicker ? 'bg-sky-500/20 text-sky-400' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                                        title="Enviar GIF"
                                    >
                                        <ImageIcon size={20} />
                                    </button>

                                    {showGifPicker && (
                                        <div className="absolute bottom-full left-0 mb-2 z-50">
                                            <div className="fixed inset-0 z-40" onClick={() => setShowGifPicker(false)} />
                                            <div className="relative z-50">
                                                <GifPicker
                                                    onSelect={handleGifSelect}
                                                    onClose={() => setShowGifPicker(false)}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder={`Escriu un comentari${replyingTo ? ' de resposta...' : '...'}`}
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!newComment.trim()}
                                    className="absolute right-2 p-2 bg-sky-500 hover:bg-sky-400 text-white rounded-lg disabled:opacity-50 disabled:bg-slate-700 transition-colors shadow-lg shadow-sky-500/20"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                            <div className="mt-2 text-[10px] text-slate-500 flex items-center gap-1.5 opacity-60 pl-1">
                                <Info size={10} />
                                <span>Pots utilitzar Markdown bàsic. Sigues respectuós.</span>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center py-3 text-sm text-slate-500">
                            Inicieu sessió per participar a la conversa.
                        </div>
                    )}
                </div>
            </div>

            {/* Confirm Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && (
                    <ConfirmModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => setIsDeleteModalOpen(false)}
                        onConfirm={confirmDelete}
                        title="Eliminar comentari"
                        message="Estàs segur que vols eliminar aquest missatge? Aquesta acció és irreversible."
                        confirmText="Eliminar"
                        isDestructive={true}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default CommentsSection;
