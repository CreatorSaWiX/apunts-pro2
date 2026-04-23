import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { SUBJECTS, type SubjectType } from '../../config/subjects';
import { Send, Image as ImageIcon, Smile, Info, AlertCircle, ChevronDown } from 'lucide-react';
import GifPicker from '../ui/GifPicker';
import { motion, AnimatePresence } from 'framer-motion';

const emojiModules = import.meta.glob('../../assets/emojis/*.{png,PNG,webp,jpg}', { eager: true, as: 'url' });
const CUSTOM_EMOTES = Object.values(emojiModules);

const PostComposer = () => {
    const { user } = useAuth();
    const [content, setContent] = useState('');
    const [subject, setSubject] = useState<SubjectType>('pro2');
    const [type, setType] = useState<any>('resource');
    const [loading, setLoading] = useState(false);
    const [showGifPicker, setShowGifPicker] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !content.trim()) return;

        // Simple Rate Limit check
        const lastPost = localStorage.getItem(`last_post_${user.id}`);
        const now = Date.now();
        if (lastPost && now - parseInt(lastPost) < 30000) { // 30 seconds
            setError("Espera un moment abans de tornar a publicar (Spam Control 🛡️)");
            setTimeout(() => setError(null), 5000);
            return;
        }

        setLoading(true);
        try {
            await addDoc(collection(db, 'community_posts'), {
                userId: user.id,
                username: user.username,
                userAvatar: user.avatar || '',
                content: content.trim(),
                subject: subject,
                type: type,
                createdAt: serverTimestamp(),
                reactions: {},
                rank: 0,
                isPinned: false
            });

            setContent('');
            localStorage.setItem(`last_post_${user.id}`, now.toString());
        } catch (err) {
            console.error(err);
            setError("Error al publicar. Tenta-ho de nou.");
        } finally {
            setLoading(false);
        }
    };

    const handleEmojiSelect = (emojiUrl: string) => {
        const emojiName = emojiUrl.split('/').pop()?.split('.')[0] || 'emoji';
        setContent(prev => prev + (prev.endsWith(' ') || prev === '' ? '' : ' ') + `![${emojiName}](${emojiUrl}) `);
        setShowEmojiPicker(false);
    };

    const handleGifSelect = async (gifUrl: string) => {
        setContent(prev => prev + (prev ? '\n\n' : '') + `![gif](${gifUrl})`);
        setShowGifPicker(false);
    };

    if (!user) {
        return (
            <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 text-center backdrop-blur-xl">
                <p className="text-slate-400 mb-4">Inicia sessió per participar a la comunitat.</p>
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-primary/20 text-accent font-bold">
                    🛡️ Accés restringit
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
            <form onSubmit={handleSend} className="p-6">
                <div className="flex items-start gap-4 mb-4">
                    <img 
                        src={user.avatar} 
                        alt="My Avatar" 
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-primary/20"
                    />
                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <div className="relative group">
                                <select 
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value as SubjectType)}
                                    className="appearance-none bg-slate-800 border border-white/10 rounded-xl px-4 py-2 pr-10 text-xs font-bold text-slate-200 focus:outline-none focus:border-primary/50 transition-all cursor-pointer uppercase tracking-wider"
                                >
                                    {SUBJECTS.map(s => (
                                        <option key={s.id} value={s.id}>{s.label}</option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-hover:text-primary transition-colors" />
                            </div>

                            <select 
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-slate-200 focus:outline-none focus:border-primary/50 transition-all cursor-pointer uppercase tracking-wider"
                            >
                                <option value="resource">📦 Recurs</option>
                                <option value="link">🔗 Enllaç</option>
                                <option value="question">❓ Dubte</option>
                                <option value="announcement">📢 Avís</option>
                            </select>
                        </div>

                        <textarea 
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Què vols compartir amb la comunitat?"
                            className="w-full bg-transparent border-none text-slate-200 placeholder:text-slate-600 focus:ring-0 text-lg resize-none min-h-[120px] custom-scrollbar"
                        />
                    </div>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl mb-4"
                        >
                            <AlertCircle size={14} />
                            <span>{error}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => { setShowGifPicker(!showGifPicker); setShowEmojiPicker(false); }}
                                className={`p-2.5 rounded-xl transition-all ${showGifPicker ? 'bg-primary/20 text-accent' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                                title="Enviar GIF"
                            >
                                <ImageIcon size={20} />
                            </button>
                            {showGifPicker && (
                                <div className="absolute bottom-full left-0 mb-4 z-50">
                                    <div className="fixed inset-0" onClick={() => setShowGifPicker(false)} />
                                    <div className="relative">
                                        <GifPicker onSelect={handleGifSelect} onClose={() => setShowGifPicker(false)} />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => { setShowEmojiPicker(!showEmojiPicker); setShowGifPicker(false); }}
                                className={`p-2.5 rounded-xl transition-all ${showEmojiPicker ? 'bg-primary/20 text-accent' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                                title="Inserir Emoji"
                            >
                                <Smile size={20} />
                            </button>
                            {showEmojiPicker && (
                                <div className="absolute bottom-full left-0 mb-4 z-50">
                                    <div className="fixed inset-0" onClick={() => setShowEmojiPicker(false)} />
                                    <div className="relative p-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl grid grid-cols-6 gap-1 w-72 max-h-64 overflow-y-auto custom-scrollbar">
                                        {CUSTOM_EMOTES.map(emoji => (
                                            <button
                                                key={emoji}
                                                type="button"
                                                onClick={() => handleEmojiSelect(emoji)}
                                                className="p-1.5 rounded-xl hover:bg-slate-800 transition-transform hover:scale-110 flex items-center justify-center text-2xl"
                                            >
                                                <img src={emoji} alt="emoji" className="w-8 h-8 object-contain" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="hidden md:flex items-center gap-1.5 text-[10px] text-slate-600 font-medium uppercase tracking-widest pl-4">
                            <Info size={10} />
                            <span>Markdown actiu</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !content.trim()}
                        className="flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-primary to-accent text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-50 group active:scale-95"
                    >
                        <span>Publicar</span>
                        <Send size={16} className={`${loading ? 'animate-ping' : 'group-hover:translate-x-1 transition-transform'}`} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostComposer;
