import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { getSubjectById, type SubjectType } from '../../config/subjects';
import { AlertCircle, ChevronDown, Paperclip, X, Maximize2, Minimize2, Eye, ChevronLeft } from 'lucide-react';

import SubjectSelectorModal from './SubjectSelectorModal';
import FileUploader, { type Attachment } from '../ui/inputs/FileUploader';
import Spinner from '../ui/Spinner';
import Modal from '../ui/modals/Modal';
import PublicationCard from './PublicationCard';
import type { CommunityPost } from '../../types/community';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { tailwindColors } from '../../stores/useSubjectStore';
import { useTranslation } from 'react-i18next';

const RichTextEditor = lazy(() => import('../ui/editors/RichTextEditor'));

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialSubject?: SubjectType;
}

interface TiptapEditor {
    isDestroyed?: boolean;
    isEmpty?: boolean;
    getHTML: () => string;
}

export default function CreatePostModal({ isOpen, onClose, initialSubject }: CreatePostModalProps) {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { customSubjectColors } = useSettingsStore();
    const [subject, setSubject] = useState<SubjectType>(initialSubject || 'General');
    const [content, setContent] = useState('');
    const [debouncedContent, setDebouncedContent] = useState('');
    const [loading, setLoading] = useState(false);

    const [showSubjectSelector, setShowSubjectSelector] = useState(false);

    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [editorInstance, setEditorInstance] = useState<TiptapEditor | null>(null);

    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showUploader, setShowUploader] = useState(false);
    const [showMobilePreview, setShowMobilePreview] = useState(false);

    const activeSubject = getSubjectById(subject);

    useEffect(() => {
        if (initialSubject) {
            setSubject(initialSubject);
        }
    }, [initialSubject]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedContent(content);
        }, 300);
        return () => clearTimeout(handler);
    }, [content]);

    const handleSaveDraft = () => {
        if (!user) return;
        const currentContent = editorInstance && !editorInstance.isDestroyed ? editorInstance.getHTML() : content;
        if (!user || ((editorInstance && !editorInstance.isDestroyed ? editorInstance.isEmpty : !currentContent.trim()) && attachments.length === 0)) return;
        
        const draftData = {
            content: currentContent,
            subject,
            attachments,
            updatedAt: new Date().toISOString()
        };
        localStorage.setItem(`apunts_post_draft_${user.id}`, JSON.stringify(draftData));
    };

    useEffect(() => {
        if (debouncedContent.trim() || attachments.length > 0) {
            handleSaveDraft();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedContent, attachments, subject]);

    const handleClearDraft = () => {
        if (!user) return;
        localStorage.removeItem(`apunts_post_draft_${user.id}`);
    };

    const handleSend = async () => {
        const finalContent = editorInstance && !editorInstance.isDestroyed ? editorInstance.getHTML() : content;
        if (!user || ((editorInstance && !editorInstance.isDestroyed ? editorInstance.isEmpty : !finalContent.trim()) && attachments.length === 0)) return;

        setLoading(true);
        setError(null);

        try {
            const cleanAttachments = attachments.map(att => ({
                url: att.url || '',
                name: att.name || 'document',
                type: att.type || 'unknown',
                size: att.size || 0,
                ...(att.thumbnailUrl ? { thumbnailUrl: att.thumbnailUrl } : {}),
                ...(att.isCustomThumbnail !== undefined ? { isCustomThumbnail: att.isCustomThumbnail } : {})
            }));

            const postData = {
                userId: user.id,
                username: user.username || 'Anònim',
                userAvatar: user.avatar || null,
                content: finalContent.trim(),
                subject: subject,
                attachments: cleanAttachments,
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
            handleClearDraft();
            onClose();
        } catch {
            setError('No s\'ha pogut publicar el post. Torna-ho a provar.');
        } finally {
            setLoading(false);
        }
    };

    const handleThumbnailUpload = (newAtts: Attachment[]) => {
        if (newAtts.length > 0) {
            setAttachments(prev => {
                if (prev.length > 0) {
                    const newArray = [...prev];
                    newArray[0] = { ...newArray[0], thumbnailUrl: newAtts[0].url };
                    return newArray;
                } else {
                    return [...prev, { ...newAtts[0], isCustomThumbnail: true }];
                }
            });
        }
    };

    const livePreviewElement = useMemo(() => {
        if (!user) return null;
        const livePost: CommunityPost = {
            id: 'preview',
            userId: user.id,
            username: user.username || 'Anònim',
            userAvatar: user.avatar || '',
            content: debouncedContent.trim() || 'Comença a escriure per veure com queda...',
            subject: subject,
            attachments: attachments,
            createdAt: Timestamp.now(),
            reactions: {},
            isPinned: false
        };
        return <PublicationCard 
            post={livePost} 
            onThumbnailUpload={handleThumbnailUpload}
        />;
    }, [debouncedContent, user, subject, attachments]);

    if (!user) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={isFullscreen ? 'screen' : '6xl'} fullScreenOnMobile={true} hideCloseButton={true}>
            <Modal.Layout className="flex-col md:flex-row h-full w-full">
                {/* LEFT PANEL: EDITOR */}
                <div className={`flex-1 flex flex-col relative z-10 w-full ${isFullscreen ? '' : 'md:w-3/5'} ${showMobilePreview ? 'hidden md:flex' : 'flex'}`}>
                    <Modal.Header className="px-4! md:px-8! py-4! md:py-6! border-none! bg-transparent! flex justify-between items-center w-full">
                        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">{t('community.createPost.title', 'Nou recurs')}</h2>
                        <div className="flex items-center gap-2 ml-auto">
                            <button
                                type="button"
                                onClick={() => setIsFullscreen(!isFullscreen)}
                                className="hidden md:flex p-2.5 min-w-[44px] min-h-[44px] items-center justify-center rounded-full bg-white/5 hover:bg-white/15 active:scale-95 transition text-white border border-white/10 backdrop-blur-md shadow-xs group"
                                title={isFullscreen ? "Minimitzar" : "Ampliar editor"}
                            >
                                {isFullscreen ? (
                                    <Minimize2 size={18} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
                                ) : (
                                    <Maximize2 size={18} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowMobilePreview(!showMobilePreview)}
                                className={`md:hidden flex p-2.5 min-w-[44px] min-h-[44px] items-center justify-center rounded-full transition text-white border border-white/10 backdrop-blur-md shadow-xs ${showMobilePreview ? 'bg-primary text-white border-primary/50' : 'bg-white/5 hover:bg-white/15'}`}
                                title={showMobilePreview ? "Tancar miniatura" : "Veure miniatura"}
                                aria-label="Veure">
                                <Eye size={18} strokeWidth={showMobilePreview ? 3 : 2.5} />
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex p-2.5 min-w-[44px] min-h-[44px] items-center justify-center rounded-full bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 active:scale-95 transition text-white border border-white/10 backdrop-blur-md shadow-xs"
                                title="Tancar"
                                aria-label="Tancar">
                                <X size={18} strokeWidth={2.5} />
                            </button>
                        </div>
                    </Modal.Header>

                    {/* Content Area */}
                    <Modal.Body className="px-4! md:px-8! pb-6! pt-0! bg-transparent flex flex-col custom-scrollbar">



                        {/* Seamless Text Input or Rich Editor */}
                        <div className="relative shrink-0 flex-1 min-h-[200px] md:min-h-100 flex flex-col">
                            <Suspense fallback={
                                <div className="w-full h-full min-h-[200px] md:min-h-100 flex items-center justify-center bg-white/2 border border-white/5 rounded-2xl">
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
                                            <div key={att.name || i} className="flex items-center justify-between bg-white/3 border border-white/10 p-3 rounded-2xl group hover:border-white/20 transition-colors">
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
                                                        <div className="flex items-center gap-2">
                                                            <span className="truncate text-sm font-bold text-slate-200">{att.name}</span>
                                                            {att.isCustomThumbnail && (
                                                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary border border-primary/30 uppercase tracking-wider shrink-0">Miniatura</span>
                                                            )}
                                                        </div>
                                                        <span className="text-xs text-slate-500">{(att.size / 1024 / 1024).toFixed(2)} MB</span>
                                                    </div>
                                                </div>
                                                <button type="button" aria-label="Eliminar fitxer"
                                                    onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
                                                    className="text-slate-500 hover:text-white p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full hover:bg-white/10 transition opacity-100 md:opacity-0 md:group-hover:opacity-100"
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
                    <div className="px-4 md:px-8 py-4 md:py-5 border-t border-white/5 bg-transparent flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 shrink-0">
                        <div className="flex items-center gap-2">


                            {isFullscreen && (
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowUploader(!showUploader)}
                                        className={`w-10 h-10 flex items-center justify-center rounded-full transition ${showUploader ? 'text-white bg-white/20' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
                                        title="Alternar Adjunts"
                                        aria-label="Alternar Adjunts">
                                        <Paperclip size={20} />
                                    </button>
                                </div>
                            )}

                            {error && (
                                <div className="ml-2 flex items-center gap-2 text-rose-400 text-xs font-bold px-3 py-1.5 bg-rose-500/10 rounded-full border border-rose-500/20">
                                    <AlertCircle size={14} />
                                    <span>{error}</span>
                                </div>
                            )}

                        </div>

                        <div className="flex items-center gap-2 md:gap-4 ml-auto sm:ml-0">
                            <button
                                type="button"
                                onClick={() => setShowSubjectSelector(true)}
                                className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs md:text-sm font-medium transition group min-h-[44px]"
                                aria-label="Element interactiu">
                                <span
                                    className="w-2 h-2 rounded-full shrink-0"
                                    style={activeSubject ? {
                                        backgroundColor: tailwindColors[customSubjectColors[activeSubject.label] || activeSubject.color]?.primary || '#0ea5e9',
                                        boxShadow: `0 0 10px rgba(${tailwindColors[customSubjectColors[activeSubject.label] || activeSubject.color]?.primary_rgb || '14, 165, 233'}, 0.8)`
                                    } : { backgroundColor: '#64748b' }}
                                />
                                <span className="truncate max-w-[110px] sm:max-w-none">{activeSubject ? activeSubject.label : t('community.createPost.noSubject', 'Assignatura')}</span>
                                <ChevronDown size={14} className="text-slate-400 group-hover:text-white transition-colors shrink-0" />
                            </button>

                            <button type="button"
                                onClick={handleSend}
                                disabled={loading || ((editorInstance && !editorInstance.isDestroyed ? editorInstance.isEmpty : !content.trim()) && attachments.length === 0)}
                                className="px-6 md:px-8 py-2.5 md:py-3 bg-white text-black hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-white font-bold rounded-full transition hover:scale-105 active:scale-95 flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] text-xs md:text-base min-h-[44px]"
                             aria-label="Botó interactiu">
                                {loading && <Spinner size="sm" variant="primary" />}
                                {t('community.createPost.publishBtn', 'Publicar')}
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL: LIVE PREVIEW */}
                {!isFullscreen && (
                    <div className={`${showMobilePreview ? 'flex w-full h-full' : 'hidden md:flex md:w-2/5'} flex-col border-l border-white/5 relative overflow-hidden bg-black noise-bg shrink-0`}>
                        {/* Abstract Ambient Glows */}
                        <div className="absolute top-[10%] right-[10%] w-75 h-75 bg-primary/20 rounded-full blur-[120px] pointer-events-none transform-gpu will-change-transform" />
                        <div className="absolute bottom-[10%] left-[10%] w-62.5 h-62.5 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none transform-gpu will-change-transform" />

                        <div className="flex items-center justify-between px-6 md:px-8 py-6 relative z-10">
                            <div className="flex items-center gap-2 text-white/50 text-xs font-bold tracking-widest uppercase">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                {t('community.createPost.livePreview', 'Live Preview')}
                            </div>
                            <button
                                type="button"
                                onClick={() => showMobilePreview ? setShowMobilePreview(false) : onClose()}
                                className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 transition text-white border border-white/10 backdrop-blur-md shadow-xs flex items-center gap-2"
                                title={showMobilePreview ? "Tornar a l'edició" : "Tancar"}
                            >
                                {showMobilePreview ? (
                                    <>
                                        <ChevronLeft size={18} strokeWidth={2.5} />
                                        <span className="text-xs font-bold pr-1 md:hidden">Tornar</span>
                                    </>
                                ) : (
                                    <X size={18} strokeWidth={2.5} />
                                )}
                            </button>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
                            <div className="w-full max-w-[320px] flex flex-col items-center gap-6">
                                {livePreviewElement}
                                
                                <div className="w-full max-w-[240px]">
                                    <FileUploader 
                                        onUploadComplete={handleThumbnailUpload} 
                                        variant="button" 
                                        acceptType="images" 
                                        maxFiles={1} 
                                        maxSizeMB={5}
                                    />
                                </div>
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
}
