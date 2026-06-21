import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { SUBJECTS, type SubjectType } from '../../config/subjects';
import { Image as ImageIcon, Smile, AlertCircle, ChevronDown, Paperclip, Loader2, X, FileText } from 'lucide-react';
import GifPicker from '../ui/GifPicker';
import SubjectSelectorModal from './SubjectSelectorModal';
import FileUploader, { type Attachment } from './FileUploader';
import { motion, AnimatePresence } from 'framer-motion';
import PublicationCard from './PublicationCard';
import type { CommunityPost } from '../../types/community';
import RichTextEditor from '../ui/RichTextEditor';

const emojiModules = import.meta.glob('../../assets/emojis/*.{png,PNG,webp,jpg}', { eager: true, query: '?url', import: 'default' });
const CUSTOM_EMOTES = Object.values(emojiModules) as string[];

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreatePostModal = ({ isOpen, onClose }: CreatePostModalProps) => {
    const { user } = useAuth();
    const [content, setContent] = useState('');
    const [subject, setSubject] = useState<SubjectType>(SUBJECTS[0]?.id || '');
    const [loading, setLoading] = useState(false);
    const [isNoteMode, setIsNoteMode] = useState(false);
    
    const [showGifPicker, setShowGifPicker] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showSubjectSelector, setShowSubjectSelector] = useState(false);
    
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [error, setError] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [editorInstance, setEditorInstance] = useState<any>(null);

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
            setError("Espera un moment abans de publicar de nou.");
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
                type: 'resource',
                attachments: attachments,
                createdAt: serverTimestamp(),
                reactions: {},
                rank: 0,
                isPinned: false,
                isNote: isNoteMode
            });

            setContent('');
            setAttachments([]);
            localStorage.setItem(`last_post_${user.id}`, now.toString());
            onClose();
        } catch (err) {
            console.error(err);
            setError("Error al publicar. Torna-ho a provar.");
        } finally {
            setLoading(false);
        }
    };

    const handleEmojiSelect = (emojiUrl: string) => {
        if (isNoteMode && editorInstance) {
            editorInstance.chain().focus().setImage({ src: emojiUrl }).run();
        } else {
            const emojiName = emojiUrl.split('/').pop()?.split('.')[0] || 'emoji';
            setContent(prev => prev + (prev.endsWith(' ') || prev === '' ? '' : ' ') + `:${emojiName}: `);
        }
        setShowEmojiPicker(false);
    };

    const handleGifSelect = async (gifUrl: string) => {
        if (isNoteMode && editorInstance) {
            editorInstance.chain().focus().setImage({ src: gifUrl }).run();
        } else {
            setContent(prev => prev + (prev ? '\n\n' : '') + `![gif](${gifUrl})`);
        }
        setShowGifPicker(false);
    };

    if (!user) return null;

    const livePost: CommunityPost = {
        id: 'preview',
        userId: user.id,
        username: user.username,
        userAvatar: user.avatar || '',
        content: content.trim() || 'Comença a escriure per veure com queda...',
        subject: subject,
        type: 'resource',
        attachments: attachments,
        createdAt: new Date() as any,
        reactions: {},
        rank: 0,
        isPinned: false,
        isNote: isNoteMode
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-12">
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="absolute inset-0 bg-[#050505]/80 backdrop-blur-xl"
                        onClick={onClose}
                    />
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-6xl bg-[#0a0a0a] rounded-[2rem] shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row h-[85vh] border border-white/10 transition-all duration-500"
                    >
                        {/* LEFT PANEL: EDITOR */}
                        <div className="flex-1 flex flex-col relative z-10 w-full md:w-3/5 bg-linear-to-b from-white/[0.02] to-transparent">
                            
                            {/* Header */}
                            <div className="flex items-center justify-between px-8 py-6">
                                <h2 className="text-2xl font-bold text-white tracking-tight">Nou recurs</h2>
                                <button onClick={onClose} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-all active:scale-95 md:hidden">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 overflow-y-auto px-8 pb-6 flex flex-col custom-scrollbar">
                                
                                {/* Sleek Subject Selector */}
                                <div className="mb-6 flex">
                                    <button
                                        type="button"
                                        onClick={() => setShowSubjectSelector(true)}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium transition-all group"
                                    >
                                        <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(14,165,233,0.8)]" />
                                        {activeSubject.label}
                                        <ChevronDown size={14} className="text-slate-400 group-hover:text-white transition-colors ml-1" />
                                    </button>
                                </div>

                                {/* Seamless Text Input or Rich Editor */}
                                <div className={`relative shrink-0 ${isNoteMode ? 'flex-1 min-h-[400px]' : 'min-h-[160px]'}`}>
                                    {isNoteMode ? (
                                        <RichTextEditor 
                                            content={content} 
                                            onChange={setContent} 
                                            placeholder="Títol de l'apunt... Comença a escriure aquí"
                                            editorRef={setEditorInstance}
                                        />
                                    ) : (
                                        <textarea 
                                            ref={textareaRef}
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            placeholder="Comparteix coneixement..."
                                            className="w-full h-full bg-transparent text-white placeholder:text-slate-600 text-xl font-medium resize-none outline-none overflow-hidden"
                                        />
                                    )}
                                </div>

                                {/* Uploader */}
                                {!isNoteMode && (
                                    <div className="mt-auto pt-6 border-t border-white/5">
                                        <FileUploader 
                                            onUploadComplete={(newAtts) => setAttachments(prev => [...prev, ...newAtts])} 
                                        />
                                        
                                        {attachments.length > 0 && (
                                        <div className="flex flex-col gap-3 mt-4">
                                            {attachments.map((att, i) => (
                                                <div key={i} className="flex items-center justify-between bg-white/[0.03] border border-white/10 p-3 rounded-2xl group hover:border-white/20 transition-colors">
                                                    <div className="flex items-center gap-4 overflow-hidden">
                                                        <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-black/50 border border-white/5 flex items-center justify-center">
                                                            {att.thumbnailUrl ? (
                                                                <img src={att.thumbnailUrl} alt={att.name} className="w-full h-full object-cover" />
                                                            ) : att.type.startsWith('image/') ? (
                                                                <img src={att.url} alt={att.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <Paperclip size={18} className="text-slate-400" />
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col min-w-0">
                                                            <span className="truncate text-sm font-bold text-slate-200">{att.name}</span>
                                                            <span className="text-xs text-slate-500">{(att.size / 1024 / 1024).toFixed(2)} MB</span>
                                                        </div>
                                                    </div>
                                                    <button 
                                                        onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
                                                        className="text-slate-500 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="px-8 py-5 border-t border-white/5 bg-[#0a0a0a] flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => { setShowGifPicker(!showGifPicker); setShowEmojiPicker(false); }}
                                            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
                                            title="Afegir GIF"
                                        >
                                            <ImageIcon size={20} />
                                        </button>
                                        {showGifPicker && (
                                            <div className="absolute bottom-full left-0 mb-4 z-50">
                                                <div className="fixed inset-0" onClick={() => setShowGifPicker(false)} />
                                                <div className="relative shadow-2xl border border-white/10 rounded-xl overflow-hidden">
                                                    <GifPicker onSelect={handleGifSelect} onClose={() => setShowGifPicker(false)} />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => { setShowEmojiPicker(!showEmojiPicker); setShowGifPicker(false); }}
                                            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
                                            title="Afegir Emote personalitzat"
                                        >
                                            <Smile size={20} />
                                        </button>
                                        {showEmojiPicker && (
                                            <div className="absolute bottom-full left-0 mb-4 z-50">
                                                <div className="fixed inset-0" onClick={() => setShowEmojiPicker(false)} />
                                                <div className="relative p-4 bg-[#111] border border-white/10 rounded-2xl shadow-2xl grid grid-cols-6 gap-2 w-72 max-h-64 overflow-y-auto custom-scrollbar">
                                                    {CUSTOM_EMOTES.map(emoji => (
                                                        <button
                                                            key={emoji}
                                                            type="button"
                                                            onClick={() => handleEmojiSelect(emoji)}
                                                            className="p-1 rounded-xl hover:bg-white/10 transition-transform hover:scale-110"
                                                        >
                                                            <img src={emoji} alt="emoji" className="w-8 h-8 object-contain" />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {error && (
                                        <div className="ml-4 flex items-center gap-2 text-rose-400 text-xs font-bold px-3 py-1.5 bg-rose-500/10 rounded-full border border-rose-500/20">
                                            <AlertCircle size={14} />
                                            <span>{error}</span>
                                        </div>
                                    )}

                                    <div className="w-px h-6 bg-white/10 mx-2 hidden sm:block" />

                                    <button
                                        type="button"
                                        onClick={() => setIsNoteMode(!isNoteMode)}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${isNoteMode ? 'bg-primary/20 text-primary border-primary/30 shadow-[0_0_15px_rgba(14,165,233,0.3)]' : 'bg-white/5 text-slate-400 hover:text-white border-white/10 hover:bg-white/10'}`}
                                        title="Mode Apunt Extens (Notion style)"
                                    >
                                        <FileText size={14} />
                                        <span className="hidden sm:inline">Apunt Extens</span>
                                    </button>
                                </div>

                                <button
                                    onClick={handleSend}
                                    disabled={loading || (!content.trim() && attachments.length === 0)}
                                    className="px-8 py-3 bg-white text-black hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-white font-bold rounded-full transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                                >
                                    {loading && <Loader2 size={18} className="animate-spin text-black" />}
                                    Publicar
                                </button>
                            </div>
                        </div>

                        {/* RIGHT PANEL: LIVE PREVIEW */}
                        <div className="hidden md:flex flex-col w-2/5 border-l border-white/5 relative overflow-hidden bg-black noise-bg shrink-0">
                            {/* Abstract Ambient Glows */}
                            <div className="absolute top-[10%] right-[10%] w-[300px] h-[300px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
                            <div className="absolute bottom-[10%] left-[10%] w-[250px] h-[250px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
                            
                            <div className="flex items-center justify-between px-8 py-6 relative z-10">
                                <div className="flex items-center gap-2 text-white/50 text-xs font-bold tracking-widest uppercase">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Live Preview
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
                                <div className="w-full max-w-[320px] pointer-events-none">
                                    <PublicationCard post={{...livePost, content: livePost.content}} />
                                    {/* A simple hack for emotes in live preview: Since PublicationCard strips images from content by default, we can just let PublicationCard show its stripped text, but we render a markdown block below it in the preview if there are emotes! Or better, we just change PublicationCard to allow small emotes in text. For now, since the actual feed strips them, we show exactly what the feed shows. BUT wait, if the feed strips images, the user will NEVER see their emotes in the feed! Let's allow emojis in PublicationCard. */}
                                </div>
                                
                                <p className="mt-12 text-[11px] font-mono text-white/30 text-center max-w-[250px]">
                                    Així es veurà el teu apunt a la Comunitat
                                </p>
                            </div>
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
