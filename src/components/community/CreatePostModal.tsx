import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { SUBJECTS, type SubjectType } from '../../config/subjects';
import { Image as ImageIcon, Smile, AlertCircle, ChevronDown, Paperclip, Loader2, X } from 'lucide-react';
import GifPicker from '../ui/GifPicker';
import SubjectSelectorModal from './SubjectSelectorModal';
import FileUploader, { type Attachment } from './FileUploader';
import { motion, AnimatePresence } from 'framer-motion';

const emojiModules = import.meta.glob('../../assets/emojis/*.{png,PNG,webp,jpg}', { eager: true, as: 'url' });
const CUSTOM_EMOTES = Object.values(emojiModules);

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreatePostModal = ({ isOpen, onClose }: CreatePostModalProps) => {
    const { user } = useAuth();
    const [content, setContent] = useState('');
    const [subject, setSubject] = useState<SubjectType>(SUBJECTS[0]?.id || '');
    const [type, setType] = useState<any>('resource');
    const [loading, setLoading] = useState(false);
    
    const [showGifPicker, setShowGifPicker] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showSubjectSelector, setShowSubjectSelector] = useState(false);
    const [showUploader, setShowUploader] = useState(false);
    
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [error, setError] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const activeSubject = SUBJECTS.find(s => s.id === subject) || SUBJECTS[0];

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = '150px';
        }
    }, [isOpen]);

    const handleSend = async () => {
        if (!user || (!content.trim() && attachments.length === 0)) return;

        const lastPost = localStorage.getItem(`last_post_${user.id}`);
        const now = Date.now();
        if (lastPost && now - parseInt(lastPost) < 30000) { 
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
                attachments: attachments,
                createdAt: serverTimestamp(),
                reactions: {},
                rank: 0,
                isPinned: false
            });

            setContent('');
            setAttachments([]);
            setShowUploader(false);
            localStorage.setItem(`last_post_${user.id}`, now.toString());
            onClose();
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

    if (!user) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                            <h2 className="text-xl font-bold text-slate-100">Publicar nou recurs</h2>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {/* Properties (Subject & Type) */}
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <button
                                    type="button"
                                    onClick={() => setShowSubjectSelector(true)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-sm font-bold transition-colors border border-white/5"
                                >
                                    <span>{activeSubject.label}</span>
                                    <ChevronDown size={16} />
                                </button>
                                
                                <select 
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="bg-white/5 hover:bg-white/10 text-slate-200 rounded-xl px-4 py-2 text-sm font-bold transition-colors appearance-none cursor-pointer outline-none border border-white/5 focus:ring-0"
                                >
                                    <option value="resource" className="bg-slate-900">📦 Recurs o Apunts</option>
                                    <option value="question" className="bg-slate-900">❓ Dubte</option>
                                    <option value="link" className="bg-slate-900">🔗 Enllaç</option>
                                    <option value="announcement" className="bg-slate-900">📢 Avís</option>
                                </select>
                            </div>

                            {/* Text Input */}
                            <textarea 
                                ref={textareaRef}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Escriu el títol, concepte clau o enganxa'n els apunts aquí..."
                                className="w-full bg-transparent border-none text-slate-100 placeholder:text-slate-500 focus:ring-0 text-xl resize-none outline-none overflow-hidden min-h-[150px]"
                            />

                            <AnimatePresence>
                                {!attachments.some(a => a.type.startsWith('image/')) && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="flex items-center gap-2 text-amber-500 text-sm mb-4 font-medium p-3 bg-amber-500/10 rounded-xl border border-amber-500/20"
                                    >
                                        <AlertCircle size={16} />
                                        <span>L'aparador és exclusivament visual. Has d'adjuntar una imatge de portada.</span>
                                    </motion.div>
                                )}
                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="flex items-center gap-2 text-rose-500 text-sm mb-4 font-medium p-3 bg-rose-500/10 rounded-xl"
                                    >
                                        <AlertCircle size={16} />
                                        <span>{error}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Attachments Preview */}
                            {attachments.length > 0 && (
                                <div className="flex flex-col gap-2 mt-4 mb-4">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Adjunts ({attachments.length})</h3>
                                    {attachments.map((att, i) => (
                                        <div key={i} className="flex items-center justify-between bg-white/5 border border-white/10 p-3 rounded-xl text-sm">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                {att.type.startsWith('image/') ? (
                                                    <img src={att.url} alt={att.name} className="w-8 h-8 rounded bg-slate-800 object-cover" />
                                                ) : (
                                                    <Paperclip size={18} className="text-primary shrink-0" />
                                                )}
                                                <span className="truncate text-slate-200 font-medium">{att.name}</span>
                                            </div>
                                            <button 
                                                onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
                                                className="text-slate-500 hover:text-rose-400 p-2 rounded-full hover:bg-white/5 transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* File Uploader Area */}
                            <AnimatePresence>
                                {showUploader && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-4 overflow-hidden"
                                    >
                                        <FileUploader 
                                            onUploadComplete={(newAtts) => {
                                                setAttachments(prev => [...prev, ...newAtts]);
                                                setShowUploader(false);
                                            }} 
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Footer (Actions) */}
                        <div className="px-6 py-4 border-t border-white/5 bg-white/[0.02] flex items-center justify-between">
                            <div className="flex items-center gap-1">
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => { setShowGifPicker(!showGifPicker); setShowEmojiPicker(false); setShowUploader(false); }}
                                        className="p-2.5 text-primary hover:bg-primary/10 rounded-full transition-colors"
                                        title="Afegir GIF"
                                    >
                                        <ImageIcon size={20} />
                                    </button>
                                    {showGifPicker && (
                                        <div className="absolute bottom-full left-0 mb-2 z-50">
                                            <div className="fixed inset-0" onClick={() => setShowGifPicker(false)} />
                                            <div className="relative shadow-2xl">
                                                <GifPicker onSelect={handleGifSelect} onClose={() => setShowGifPicker(false)} />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => { setShowEmojiPicker(!showEmojiPicker); setShowGifPicker(false); setShowUploader(false); }}
                                        className="p-2.5 text-primary hover:bg-primary/10 rounded-full transition-colors"
                                        title="Afegir Emote personalitzat"
                                    >
                                        <Smile size={20} />
                                    </button>
                                    {showEmojiPicker && (
                                        <div className="absolute bottom-full left-0 mb-2 z-50">
                                            <div className="fixed inset-0" onClick={() => setShowEmojiPicker(false)} />
                                            <div className="relative p-3 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl grid grid-cols-6 gap-2 w-72 max-h-64 overflow-y-auto">
                                                {CUSTOM_EMOTES.map(emoji => (
                                                    <button
                                                        key={emoji}
                                                        type="button"
                                                        onClick={() => handleEmojiSelect(emoji)}
                                                        className="p-1 rounded-xl hover:bg-slate-700 transition-transform hover:scale-110"
                                                    >
                                                        <img src={emoji} alt="emoji" className="w-8 h-8 object-contain" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => { setShowUploader(!showUploader); setShowEmojiPicker(false); setShowGifPicker(false); }}
                                    className="p-2.5 text-primary hover:bg-primary/10 rounded-full transition-colors"
                                    title="Afegir adjunts (PDFs, imatges, zips)"
                                >
                                    <Paperclip size={20} />
                                </button>
                            </div>

                            <button
                                onClick={handleSend}
                                disabled={loading || !attachments.some(a => a.type.startsWith('image/')) || (!content.trim() && attachments.length === 0)}
                                className="px-6 py-2.5 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary text-white font-bold rounded-full transition-colors flex items-center gap-2"
                            >
                                {loading && <Loader2 size={18} className="animate-spin" />}
                                Publicar
                            </button>
                        </div>
                    </motion.div>

                    <SubjectSelectorModal 
                        isOpen={showSubjectSelector}
                        onClose={() => setShowSubjectSelector(false)}
                        onSelect={(id) => setSubject(id)}
                        selectedId={subject}
                    />
                </div>
            )}
        </AnimatePresence>
    );
};

export default CreatePostModal;
