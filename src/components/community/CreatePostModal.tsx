import { useState, useRef, useEffect, useMemo, lazy, Suspense } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { SUBJECTS, getSubjectById, type SubjectType } from '../../config/subjects';
import { AlertCircle, ChevronDown, Paperclip, X, FileText, Maximize2, Minimize2, ImagePlus } from 'lucide-react';

import SubjectSelectorModal from './SubjectSelectorModal';
import FileUploader, { type Attachment } from '../ui/FileUploader';
import Spinner from '../ui/Spinner';
import Modal from '../ui/Modal';
import PublicationCard from './PublicationCard';
import type { CommunityPost } from '../../types/community';
import { useSettings } from '../../contexts/SettingsContext';
import { tailwindColors } from '../../contexts/SubjectContext';
import { useTranslation } from 'react-i18next';

const RichTextEditor = lazy(() => import('../ui/RichTextEditor'));


interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreatePostModal = ({ isOpen, onClose }: CreatePostModalProps) => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [content, setContent] = useState('');
    const [subject, setSubject] = useState<SubjectType>('');
    const [loading, setLoading] = useState(false);

    const [debouncedContent, setDebouncedContent] = useState('');
    const { customSubjectColors } = useSettings();


    const [showSubjectSelector, setShowSubjectSelector] = useState(false);

    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [editorInstance, setEditorInstance] = useState<any>(null);

    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showUploader, setShowUploader] = useState(false);

    const activeSubject = getSubjectById(subject);


    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedContent(content);
        }, 500);
        return () => clearTimeout(timer);
    }, [content]);

    const handleSend = async () => {
        const currentContent = editorInstance && !editorInstance.isDestroyed ? editorInstance.getHTML() : content;
        if (!user || ((editorInstance && !editorInstance.isDestroyed ? editorInstance.isEmpty : !currentContent.trim()) && attachments.length === 0)) return;

        const lastPost = localStorage.getItem(`last_post_${user.id}`);
        const now = Date.now();
        if (lastPost && now - parseInt(lastPost) < 30000) {
            setError(t('community.createPost.waitLimit', 'Espera un moment abans de publicar de nou.'));
            setTimeout(() => setError(null), 5000);
            return;
        }

        setLoading(true);
        try {
            const postData = {
                userId: user.id,
                username: user.username,
                userAvatar: user.avatar || '',
                content: currentContent.trim(),
                subject: subject,
                attachments: attachments,
                createdAt: serverTimestamp(),
                reactions: {},
                isPinned: false
            };
            const docRef = await addDoc(collection(db, 'community_posts'), postData);

            // Notify Algolia via Vercel webhook (fire and forget to not block UI)
            fetch('/api/sync-algolia', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'create',
                    post: { id: docRef.id, ...postData }
                })
            }).catch(console.error);

            setContent('');
            setAttachments([]);
            localStorage.setItem(`last_post_${user.id}`, now.toString());
            onClose();
        } catch (err) {
            console.error(err);
            setError(t('community.createPost.publishError', 'Error al publicar. Torna-ho a provar.'));
        } finally {
            setLoading(false);
        }
    };



    const livePreviewElement = useMemo(() => {
        if (!user) return null;
        const livePost: CommunityPost = {
            id: 'preview',
            userId: user.id,
            username: user.username,
            userAvatar: user.avatar || '',
            content: debouncedContent.trim() || t('community.createPost.previewPlaceholder', 'Comença a escriure per veure com queda...'),
            subject: subject,
            attachments: attachments,
            createdAt: new Date() as any,
            reactions: {},
            isPinned: false
        };
        return <PublicationCard 
            post={livePost} 
            onThumbnailUpload={(newAtts) => {
                if (newAtts.length > 0) {
                    setAttachments(prev => {
                        if (prev.length > 0) {
                            const newArray = [...prev];
                            newArray[0] = { ...newArray[0], thumbnailUrl: newAtts[0].url };
                            return newArray;
                        } else {
                            return [...prev, newAtts[0]];
                        }
                    });
                }
            }}
        />;
    }, [debouncedContent, user?.id, user?.username, user?.avatar, subject, attachments, setAttachments, t]);

    if (!user) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={isFullscreen ? 'screen' : '6xl'}>
            <Modal.Layout className="flex-col md:flex-row h-full w-full">
                {/* LEFT PANEL: EDITOR */}
                <div className={`flex-1 flex flex-col relative z-10 w-full ${isFullscreen ? '' : 'md:w-3/5'}`}>
                    <Modal.Header className="px-8! py-6! border-none! bg-transparent! flex justify-between items-center w-full">
                        <h2 className="text-2xl font-bold text-white tracking-tight">{t('community.createPost.title', 'Nou recurs')}</h2>
                        <button
                            type="button"
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            className="p-2 text-slate-400 hover:text-white transition-colors ml-auto mr-12"
                            title={isFullscreen ? "Minimitzar" : "Pantalla Completa"}
                        >
                            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                        </button>
                    </Modal.Header>

                    {/* Content Area */}
                    <Modal.Body className="px-8! pb-6! pt-0! bg-transparent flex flex-col custom-scrollbar">



                        {/* Seamless Text Input or Rich Editor */}
                        <div className="relative shrink-0 flex-1 min-h-100">
                            <Suspense fallback={
                                <div className="w-full h-full min-h-100 flex items-center justify-center bg-white/2 border border-white/5 rounded-2xl">
                                    <Spinner size="lg" variant="primary" />
                                </div>
                            }>
                                <RichTextEditor
                                    content={content}
                                    onChange={setContent}
                                    placeholder={t('community.createPost.noteModePlaceholder', "Títol de l'apunt... Comença a escriure aquí")}
                                    editorRef={setEditorInstance}
                                />
                            </Suspense>
                        </div>

                        {/* Uploader */}
                        {(!isFullscreen || showUploader) && (
                            <div className="mt-auto pt-6 border-t border-white/5">
                                <FileUploader
                                    onUploadComplete={(newAtts) => setAttachments(prev => [...prev, ...newAtts])}
                                />

                                {attachments.length > 0 && (
                                    <div className="flex flex-col gap-3 mt-4">
                                        {attachments.map((att, i) => (
                                            <div key={i} className="flex items-center justify-between bg-white/3 border border-white/10 p-3 rounded-2xl group hover:border-white/20 transition-colors">
                                                <div className="flex items-center gap-4 overflow-hidden">
                                                    <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-black/50 border border-white/5 flex items-center justify-center group/thumb">
                                                        {att.thumbnailUrl ? (
                                                            <img src={att.thumbnailUrl} alt={att.name} loading="lazy" className="w-full h-full object-cover" />
                                                        ) : att.type.startsWith('image/') ? (
                                                            <img src={att.url} alt={att.name} loading="lazy" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Paperclip size={18} className="text-slate-400" />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="truncate text-sm font-bold text-slate-200">{att.name}</span>
                                                        <span className="text-xs text-slate-500">{(att.size / 1024 / 1024).toFixed(2)} MB</span>
                                                    </div>
                                                </div>
                                                <button type="button" aria-label="Eliminar fitxer"
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
                    </Modal.Body>

                    {/* Footer */}
                    <div className="px-8 py-5 border-t border-white/5 bg-transparent flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-2">


                            {isFullscreen && (
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowUploader(!showUploader)}
                                        className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${showUploader ? 'text-white bg-white/20' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
                                        title="Alternar Adjunts"
                                    >
                                        <Paperclip size={20} />
                                    </button>
                                </div>
                            )}

                            {error && (
                                <div className="ml-4 flex items-center gap-2 text-rose-400 text-xs font-bold px-3 py-1.5 bg-rose-500/10 rounded-full border border-rose-500/20">
                                    <AlertCircle size={14} />
                                    <span>{error}</span>
                                </div>
                            )}

                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => setShowSubjectSelector(true)}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium transition-all group"
                            >
                                <span
                                    className="w-2 h-2 rounded-full"
                                    style={activeSubject ? {
                                        backgroundColor: tailwindColors[customSubjectColors[activeSubject.label] || activeSubject.color]?.primary || '#0ea5e9',
                                        boxShadow: `0 0 10px rgba(${tailwindColors[customSubjectColors[activeSubject.label] || activeSubject.color]?.primary_rgb || '14, 165, 233'}, 0.8)`
                                    } : { backgroundColor: '#64748b' }}
                                />
                                {activeSubject ? activeSubject.label : t('community.createPost.noSubject', 'Sense assignatura')}
                                <ChevronDown size={14} className="text-slate-400 group-hover:text-white transition-colors ml-1" />
                            </button>

                            <button type="button"
                                onClick={handleSend}
                                disabled={loading || ((editorInstance && !editorInstance.isDestroyed ? editorInstance.isEmpty : !content.trim()) && attachments.length === 0)}
                                className="px-8 py-3 bg-white text-black hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-white font-bold rounded-full transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                            >
                                {loading && <Spinner size="sm" variant="primary" />}
                                {t('community.createPost.publishBtn', 'Publicar')}
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL: LIVE PREVIEW */}
                {!isFullscreen && (
                    <div className="hidden md:flex flex-col w-2/5 border-l border-white/5 relative overflow-hidden bg-black noise-bg shrink-0">
                        {/* Abstract Ambient Glows */}
                        <div className="absolute top-[10%] right-[10%] w-75 h-75 bg-primary/20 rounded-full blur-[120px] pointer-events-none transform-gpu will-change-transform" />
                        <div className="absolute bottom-[10%] left-[10%] w-62.5 h-62.5 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none transform-gpu will-change-transform" />

                        <div className="flex items-center justify-between px-8 py-6 relative z-10">
                            <div className="flex items-center gap-2 text-white/50 text-xs font-bold tracking-widest uppercase">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                {t('community.createPost.livePreview', 'Live Preview')}
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
                            <div className="w-full max-w-[320px]">
                                {livePreviewElement}
                            </div>

                            <p className="mt-12 text-[11px] font-mono text-white/30 text-center max-w-62.5">
                                {t('community.createPost.livePreviewDesc', 'Així es veurà el teu apunt a la Comunitat')}
                            </p>
                        </div>
                    </div>
                )}
            </Modal.Layout>
            <SubjectSelectorModal
                isOpen={showSubjectSelector}
                onClose={() => setShowSubjectSelector(false)}
                onSelect={(id) => setSubject(id)}
                selectedId={subject}
                allowNone={true}
            />
        </Modal>
    );
};

export default CreatePostModal;
