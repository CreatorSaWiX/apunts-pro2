import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { SUBJECTS, type SubjectType } from '../../config/subjects';
import { Image as ImageIcon, Smile, AlertCircle, ChevronDown, Paperclip, Loader2 } from 'lucide-react';
import GifPicker from '../ui/GifPicker';
import SubjectSelectorModal from './SubjectSelectorModal';
import FileUploader, { type Attachment } from './FileUploader';
import { motion, AnimatePresence } from 'framer-motion';

const emojiModules = import.meta.glob('../../assets/emojis/*.{png,PNG,webp,jpg}', { eager: true, query: '?url', import: 'default' });
const CUSTOM_EMOTES = Object.values(emojiModules);

const PostComposer = () => {
    const { user } = useAuth();
    const [content, setContent] = useState('');
    const [subject, setSubject] = useState<SubjectType>(SUBJECTS[0]?.id || '');
    const [type, setType] = useState<any>('resource');
    const [loading, setLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    
    // Pickers state
    const [showGifPicker, setShowGifPicker] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showSubjectSelector, setShowSubjectSelector] = useState(false);
    const [showUploader, setShowUploader] = useState(false);
    
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [error, setError] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const activeSubject = SUBJECTS.find(s => s.id === subject) || SUBJECTS[0];

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 300)}px`;
        }
    }, [content]);

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
            setIsFocused(false);
            if (textareaRef.current) textareaRef.current.style.height = 'auto';
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
        setContent(prev => prev + (prev.endsWith(' ') || prev === '' ? '' : ' ') + `:${emojiName}: `);
        setShowEmojiPicker(false);
    };

    const handleGifSelect = async (gifUrl: string) => {
        setContent(prev => prev + (prev ? '\n\n' : '') + `![gif](${gifUrl})`);
        setShowGifPicker(false);
    };

    if (!user) return null; // In a social app, if not logged in, we either hide composer or show a compact CTA

    const isExpanded = isFocused || content.length > 0 || attachments.length > 0 || showUploader || showEmojiPicker || showGifPicker;

    return (
        <div className="px-4 py-3 flex gap-3 transition-colors duration-300">
            {/* Avatar */}
            <div className="shrink-0 pt-1">
                <img 
                    src={user.avatar} 
                    alt={user.username} 
                    className="w-10 h-10 rounded-full object-cover bg-slate-800"
                />
            </div>

            {/* Input Area */}
            <div className="flex-1 min-w-0 flex flex-col">
                <textarea 
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    placeholder="Què està passant?"
                    className="w-full bg-transparent border-none text-slate-100 placeholder:text-slate-500 focus:ring-0 text-xl resize-none outline-none py-2 overflow-hidden"
                    rows={1}
                />

                <AnimatePresence>
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex items-center gap-2 text-rose-500 text-xs mb-2 font-medium"
                        >
                            <AlertCircle size={14} />
                            <span>{error}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Attachments Preview */}
                {attachments.length > 0 && (
                    <div className="flex flex-col gap-2 mt-2 mb-3">
                        {attachments.map((att, i) => (
                            <div key={i} className="flex items-center justify-between bg-white/5 border border-white/10 p-2 rounded-xl text-sm">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <Paperclip size={14} className="text-primary shrink-0" />
                                    <span className="truncate text-slate-300 font-medium">{att.name}</span>
                                </div>
                                <button 
                                    onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
                                    className="text-slate-500 hover:text-rose-400 p-1 rounded-full hover:bg-white/5 transition-colors"
                                >
                                    &times;
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
                            className="mb-3 overflow-hidden"
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

                {/* Actions & Submit (Visible when expanded) */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex flex-col gap-3 pt-3 overflow-hidden border-t border-white/5 mt-1"
                        >
                            {/* Properties (Subject & Type) */}
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowSubjectSelector(true)}
                                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold transition-colors"
                                >
                                    <span>{activeSubject.label}</span>
                                    <ChevronDown size={12} />
                                </button>
                                
                                <select 
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="bg-white/5 hover:bg-white/10 text-slate-300 rounded-full px-3 py-1 text-xs font-bold transition-colors appearance-none cursor-pointer outline-none border-none focus:ring-0"
                                >
                                    <option value="resource" className="bg-slate-900">📦 Recurs</option>
                                    <option value="link" className="bg-slate-900">🔗 Enllaç</option>
                                    <option value="question" className="bg-slate-900">❓ Dubte</option>
                                    <option value="announcement" className="bg-slate-900">📢 Avís</option>
                                </select>
                            </div>

                            {/* Tools & Post Button */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 -ml-2">
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => { setShowGifPicker(!showGifPicker); setShowEmojiPicker(false); setShowUploader(false); }}
                                            className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                                        >
                                            <ImageIcon size={18} />
                                        </button>
                                        {showGifPicker && (
                                            <div className="absolute top-full left-0 mt-2 z-50">
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
                                            onClick={() => { setShowEmojiPicker(!showEmojiPicker); setShowGifPicker(false); setShowUploader(false); }}
                                            className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                                        >
                                            <Smile size={18} />
                                        </button>
                                        {showEmojiPicker && (
                                            <div className="absolute top-full left-0 mt-2 z-50">
                                                <div className="fixed inset-0" onClick={() => setShowEmojiPicker(false)} />
                                                <div className="relative p-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl grid grid-cols-6 gap-1 w-72 max-h-64 overflow-y-auto">
                                                    {CUSTOM_EMOTES.map(emoji => (
                                                        <button
                                                            key={emoji}
                                                            type="button"
                                                            onClick={() => handleEmojiSelect(emoji)}
                                                            className="p-1 rounded-xl hover:bg-slate-800 transition-transform hover:scale-110"
                                                        >
                                                            <img src={emoji} alt="emoji" className="w-6 h-6 object-contain" />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => { setShowUploader(!showUploader); setShowEmojiPicker(false); setShowGifPicker(false); }}
                                        className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                                    >
                                        <Paperclip size={18} />
                                    </button>
                                </div>

                                <button
                                    onClick={handleSend}
                                    disabled={loading || (!content.trim() && attachments.length === 0)}
                                    className="px-5 py-1.5 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary text-white font-bold rounded-full transition-colors flex items-center gap-2 text-sm"
                                >
                                    {loading && <Loader2 size={14} className="animate-spin" />}
                                    Piular
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <SubjectSelectorModal 
                    isOpen={showSubjectSelector}
                    onClose={() => setShowSubjectSelector(false)}
                    onSelect={(id) => setSubject(id)}
                    selectedId={subject}
                />
            </div>
        </div>
    );
};

export default PostComposer;
