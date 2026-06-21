import type { CommunityPost } from '../../types/community';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Share2, Download, File, MessageSquare, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ReplySection from './ReplySection';
import FileViewerRenderer from './viewers/FileViewerRenderer';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { doc, updateDoc, deleteField, deleteDoc, collection, getDocs } from 'firebase/firestore';

interface PostDetailModalProps {
    post: CommunityPost | null;
    isOpen: boolean;
    onClose: () => void;
}

const PostDetailModal = ({ post, isOpen, onClose }: PostDetailModalProps) => {
    const { user } = useAuth();
    if (!post) return null;

    const hasLiked = user && post.reactions?.[user.id]?.emoji === '❤️';
    const likeCount = Object.values(post.reactions || {}).filter(r => r.emoji === '❤️').length;

    const handleLike = async () => {
        if (!user) return;
        const postRef = doc(db, 'community_posts', post.id);

        try {
            if (hasLiked) {
                await updateDoc(postRef, {
                    [`reactions.${user.id}`]: deleteField()
                });
            } else {
                await updateDoc(postRef, {
                    [`reactions.${user.id}`]: {
                        emoji: '❤️',
                        username: user.username,
                        userId: user.id
                    }
                });
            }
        } catch (err) { console.error(err); }
    };

    const handleDelete = async () => {
        if (!confirm('Segur que vols eliminar aquesta publicació? Aquesta acció no es pot desfer.')) return;
        try {
            // Eliminar respostes de la subcol·lecció primer
            const repliesRef = collection(db, 'community_posts', post.id, 'replies');
            const repliesSnapshot = await getDocs(repliesRef);
            await Promise.all(repliesSnapshot.docs.map(replyDoc => deleteDoc(replyDoc.ref)));

            await deleteDoc(doc(db, 'community_posts', post.id));
            onClose();
        } catch (err) {
            console.error(err);
            alert("Error en eliminar la publicació.");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-hidden">
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="absolute inset-0 bg-[#050505]/90 backdrop-blur-md"
                        onClick={onClose}
                    />
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-5xl bg-[#0a0a0a] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col h-full max-h-full"
                    >
                        {/* Header Navbar */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0 bg-[#0a0a0a]/80 backdrop-blur-xl z-10">
                            <div className="flex items-center gap-3">
                                <img src={post.userAvatar} alt={post.username} className="w-10 h-10 rounded-full object-cover bg-slate-800" />
                                <div>
                                    <h3 className="font-bold text-slate-100">{post.username}</h3>
                                    <p className="text-xs text-slate-500 font-medium">{post.isNote ? 'Ha creat un apunt extens' : (post.type === 'question' ? 'Ha preguntat un dubte' : 'Ha compartit un recurs')}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={handleLike} className={`px-4 py-2 rounded-full transition-colors flex items-center gap-2 ${hasLiked ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-transparent'}`}>
                                    <Heart size={18} fill={hasLiked ? 'currentColor' : 'none'} />
                                    <span className="text-sm font-bold hidden sm:inline">{likeCount > 0 ? likeCount : 'M\'agrada'}</span>
                                </button>
                                <button className="p-2.5 rounded-full bg-white/5 text-slate-300 hover:bg-white/10 transition-colors">
                                    <Share2 size={18} />
                                </button>
                                {user?.id === post.userId && (
                                    <button 
                                        onClick={handleDelete}
                                        className="p-2.5 rounded-full bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-colors"
                                        title="Eliminar publicació"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                                <div className="w-px h-6 bg-white/10 mx-1" />
                                <button onClick={onClose} className="p-2.5 rounded-full hover:bg-rose-500/20 text-slate-400 hover:text-rose-500 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth">
                            {/* Visual/Cover Section (If there are images) */}
                            {post.attachments && post.attachments.filter(a => a.type.startsWith('image/')).length > 0 && (
                                <div className="w-full bg-[#050505] flex flex-col items-center justify-center border-b border-white/5 py-8 px-4">
                                    {post.attachments.filter(a => a.type.startsWith('image/')).map((img, i) => (
                                        <img key={i} src={img.url} alt="Cover" className="max-w-full max-h-[70vh] rounded-xl object-contain mb-6 last:mb-0 shadow-2xl" />
                                    ))}
                                </div>
                            )}

                            <div className="max-w-3xl mx-auto px-6 py-12">
                                {/* Text Content */}
                                {post.isNote ? (
                                    <div className="prose prose-invert prose-lg max-w-none prose-p:text-slate-300 prose-headings:text-white prose-a:text-primary mb-12 font-medium"
                                         dangerouslySetInnerHTML={{ __html: post.content }}
                                    />
                                ) : (
                                    <div className="prose prose-invert prose-lg max-w-none prose-p:text-slate-300 prose-headings:text-white prose-a:text-primary mb-12 font-medium">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {post.content}
                                        </ReactMarkdown>
                                    </div>
                                )}

                                {/* Files / Documents with Viewers */}
                                {post.attachments && post.attachments.filter(a => !a.type.startsWith('image/')).length > 0 && (
                                    <div className="mb-12">
                                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Fitxers Adjunts i Interacció</h4>
                                        <div className="flex flex-col gap-8">
                                            {post.attachments.filter(a => !a.type.startsWith('image/')).map((file, i) => (
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

                                <div className="w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent my-12" />

                                {/* Comments Section */}
                                <div className="pb-12">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <MessageSquare size={20} />
                                        </div>
                                        <h3 className="text-xl font-bold text-white">Comentaris</h3>
                                    </div>
                                    <ReplySection postId={post.id} postAuthorId={post.userId} postContent={post.content} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PostDetailModal;
