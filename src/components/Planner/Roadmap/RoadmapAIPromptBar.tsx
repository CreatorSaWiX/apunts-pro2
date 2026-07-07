import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Sparkles, StopCircle, CheckCircle2, Plus, X } from 'lucide-react';
import { useRoadmap } from '../../../contexts/RoadmapContext';
import { useSettings } from '../../../contexts/SettingsContext';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import SubjectHoursWidget from './Widgets/SubjectHoursWidget';
import SubjectEvaluationWidget from './Widgets/SubjectEvaluationWidget';
import SubjectCompetenciesWidget from './Widgets/SubjectCompetenciesWidget';

interface RoadmapAIPromptBarProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string;
    changes?: { type: 'add' | 'remove'; subject: string }[];
    attachmentName?: string;
    attachmentType?: 'image' | 'pdf';
}

const RoadmapAIPromptBar: React.FC<RoadmapAIPromptBarProps> = ({ isOpen, onClose }) => {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const { nodes, addSubjectNode } = useRoadmap();
    const { aiSettings } = useSettings();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [attachedFile, setAttachedFile] = useState<{ mimeType: string, data: string, name: string } | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const processFile = (file: File) => {
        if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
            setError('Només es permeten imatges o PDFs.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError("L'arxiu és massa gran. Màxim 5MB.");
            return;
        }
        setError(null);
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = (e.target?.result as string).split(',')[1];
            setAttachedFile({ mimeType: file.type, data: base64, name: file.name });
        };
        reader.readAsDataURL(file);
    };

    const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
    const onDragLeave = () => setIsDragging(false);
    const onDrop = (e: React.DragEvent) => {
        e.preventDefault(); setIsDragging(false);
        if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
    };

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = `${Math.min(scrollHeight, 120)}px`;
        }
    }, [prompt]);

    // Auto-scroll chat
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isGenerating]);

    useEffect(() => {
        if (isOpen && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [isOpen]);

    const handleGenerate = async () => {
        if ((!prompt.trim() && !attachedFile) || isGenerating) return;

        const userMsg = prompt.trim();
        setPrompt('');
        setAttachedFile(null);
        setError(null);
        setIsGenerating(true);

        const newMsg: Message = { 
            id: Date.now().toString(), 
            role: 'user', 
            content: userMsg,
            ...(attachedFile && {
                attachmentName: attachedFile.name,
                attachmentType: attachedFile.mimeType.startsWith('image/') ? 'image' : 'pdf'
            })
        };
        setMessages(prev => [...prev, newMsg]);

        const activeNodes = nodes
            .filter(n => ['passed', 'in_progress', 'retaking'].includes(n.data.status))
            .map(n => ({ id: n.id, status: n.data.status }));

        try {
            const { auth, db } = await import('../../../lib/firebase');
            const { doc, getDoc } = await import('firebase/firestore');
            const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';
            const uid = auth.currentUser?.uid;

            let memory = {};
            if (uid) {
                try {
                    const memoryDoc = await getDoc(doc(db, 'ai_memory', uid));
                    if (memoryDoc.exists()) {
                        memory = memoryDoc.data();
                    }
                } catch (e) {
                    console.error("No s'ha pogut carregar la memòria", e);
                }
            }

            const history = messages.slice(-10).map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                content: m.content
            }));

            const userName = auth.currentUser?.displayName || 'Estudiant';

            const response = await fetch('/api/roadmap-ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    prompt: userMsg,
                    currentNodes: activeNodes,
                    history,
                    memory,
                    aiSettings,
                    userName,
                    attachedFile
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Error al comunicar amb la IA');
            }

            const reader = response.body?.getReader();
            if (!reader) throw new Error("No s'ha pogut iniciar l'stream");
            const decoder = new TextDecoder();
            let aiResponse = "";
            let changes: any[] = [];
            let buffer = "";
            const aiMsgId = (Date.now() + 1).toString();

            // Afegim el missatge buit abans de començar l'streaming
            setMessages(prev => [...prev, { id: aiMsgId, role: 'ai', content: "", changes: [] }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');

                // L'última línia pot estar incompleta si s'ha tallat el chunk TCP, la guardem
                buffer = lines.pop() || "";

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.slice(6);
                        if (dataStr.trim() === '[DONE]') continue;

                        try {
                            const parsed = JSON.parse(dataStr);

                            if (parsed.type === 'text') {
                                aiResponse += parsed.content;
                                setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: aiResponse } : m));
                            } else if (parsed.type === 'actions') {
                                changes = parsed.content;
                                setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, changes } : m));

                                // Apliquem canvis reals a la UI en temps real
                                for (const change of changes) {
                                    if (change.type === 'add' && change.subject) {
                                        addSubjectNode(change.subject, 'optional');
                                    }
                                }
                            } else if (parsed.type === 'error') {
                                setError(parsed.content);
                            }
                        } catch (e) {
                            // Ignorar chunks mal formats
                        }
                    }
                }
            }

            window.dispatchEvent(new CustomEvent('ai-magic-done'));

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Error comunicant amb la IA');
        } finally {
            setIsGenerating(false);
            if (textareaRef.current) {
                textareaRef.current.focus();
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleGenerate();
        }
        if (e.key === 'Escape') {
            onClose();
        }
    };

    const markdownComponents = React.useMemo(() => ({
        strong({ node, children, ...props }: any) {
            const text = String(children);
            const match = /^\[([A-Z0-9.-]+)\]$/.exec(text.trim());
            if (match) {
                return (
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[11px] font-black bg-sky-500/10 text-sky-400 border border-sky-500/30 shadow-[0_0_8px_rgba(14,165,233,0.2)] mx-1 align-middle">
                        {match[1]}
                    </span>
                );
            }
            return <strong {...props}>{children}</strong>;
        },
        pre({ node, children, ...props }: any) {
            // Check if it's a custom widget block (language starts with subject-)
            if (node && node.children && node.children.length === 1 && node.children[0].tagName === 'code') {
                const codeNode = node.children[0];
                const className = codeNode.properties?.className || [];
                const langClass = className.find((c: string) => c.startsWith('language-subject-'));
                if (langClass) {
                    // Do not wrap custom widgets in a <pre> block
                    return <>{children}</>;
                }
            }
            return (
                <pre className="bg-slate-950/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4 overflow-x-auto custom-scrollbar my-4" {...props}>
                    {children}
                </pre>
            );
        },
        code({ node, className, children, ...props }: any) {
            const text = String(children);
            const matchClass = /language-([\w-]+)/.exec(className || '');

            if (matchClass) {
                if (matchClass[1] === 'subject-stats') {
                    return <SubjectHoursWidget subjectId={text.replace(/\n$/, '')} />
                }
                if (matchClass[1] === 'subject-evaluation') {
                    return <SubjectEvaluationWidget dataString={text} />
                }
                if (matchClass[1] === 'subject-competencies') {
                    return <SubjectCompetenciesWidget dataString={text} />
                }
                // Regular highlighted block code
                return <code className={className} {...props}>{children}</code>;
            }

            // Distinguish inline code
            const isInline = !text.includes('\n');

            if (isInline) {
                // Gemini sometimes double-wraps inline code with backticks inside the actual text node
                let cleanText = text.trim();
                cleanText = cleanText.replace(/^`+|`+$/g, '').trim();

                const match = /^\[([A-Z0-9.-]+)\]$/.exec(cleanText);
                if (match) {
                    return (
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[11px] font-black bg-sky-500/10 text-sky-400 border border-sky-500/30 shadow-[0_0_8px_rgba(14,165,233,0.2)] mx-1 align-middle">
                            {match[1]}
                        </span>
                    );
                }
                return (
                    <code className="bg-sky-500/10 text-sky-300 px-1.5 py-0.5 rounded-md text-sm font-mono border border-sky-500/20" {...props}>
                        {cleanText}
                    </code>
                );
            }

            // Block code without language
            return <code className={className} {...props}>{children}</code>;
        }
    }), []);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Completely transparent backdrop to allow seeing the roadmap clearly */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[90] bg-transparent"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ y: 150, scale: 0.95 }}
                        animate={{ y: 0, scale: 1 }}
                        exit={{ y: 150, scale: 0.95 }}
                        transition={{ type: "spring", bounce: 0.25, duration: 0.6 }}
                        className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] w-[90vw] max-w-2xl flex flex-col justify-end pointer-events-none"
                    >
                        {/* Chat Area (Floating above input) */}
                        <div className="relative pointer-events-auto">
                            <div
                                className="overflow-y-auto px-2 pb-6 space-y-6 custom-scrollbar pointer-events-auto max-h-[60vh] flex flex-col"
                                ref={chatContainerRef}
                            >
                                <AnimatePresence initial={false}>
                                    {messages.map((msg) => (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                                        >
                                            {/* Bubble */}
                                            <div className={`flex flex-col gap-2 ${msg.role === 'user' ? 'max-w-[85%] items-end' : 'w-[85%] items-start'}`}>
                                                <div className="px-6 py-4 rounded-[24px] text-[15px] w-full leading-relaxed text-slate-200 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)] backdrop-blur-xl border border-white/10 bg-slate-800/40">
                                                    {msg.role === 'ai' ? (
                                                        !msg.content && isGenerating ? (
                                                            <div className="flex gap-1.5 items-center h-6 py-1">
                                                                <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-fuchsia-500" />
                                                                <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.15 }} className="w-1.5 h-1.5 rounded-full bg-fuchsia-400" />
                                                                <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.3 }} className="w-1.5 h-1.5 rounded-full bg-fuchsia-300" />
                                                            </div>
                                                        ) : (
                                                            <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-transparent prose-pre:p-0 prose-pre:border-none prose-a:text-sky-400 hover:prose-a:text-sky-300 text-[15px] prose-strong:text-white prose-strong:font-bold prose-ul:my-3 prose-li:my-1 [&_.katex]:text-lg [&_.katex-display]:my-4 [&_.katex-display]:py-3 [&_.katex-display]:overflow-x-auto custom-scrollbar [&_.katex-display]:bg-black/20 [&_.katex-display]:rounded-2xl [&_.katex-display]:border [&_.katex-display]:border-white/5 [&_.katex-display]:shadow-inner">
                                                                <ReactMarkdown
                                                                    remarkPlugins={[remarkGfm, remarkMath]}
                                                                    rehypePlugins={[[rehypeKatex, { strict: false, throwOnError: false, errorColor: '#cbd5e1' }]]}
                                                                    components={markdownComponents}
                                                                >
                                                                    {msg.content + (isGenerating && msg.id === messages[messages.length - 1]?.id ? ' ▍' : '')}
                                                                </ReactMarkdown>
                                                            </div>
                                                        )
                                                    ) : (
                                                        <div className="space-y-2">
                                                            {msg.attachmentName && (
                                                                <div className={`flex items-center gap-1.5 text-xs rounded-lg px-2 py-1 w-fit ${msg.attachmentType === 'image'
                                                                    ? 'bg-blue-500/15 border border-blue-400/20 text-blue-300'
                                                                    : 'bg-orange-500/15 border border-orange-400/20 text-orange-300'
                                                                }`}>
                                                                    <span>{msg.attachmentType === 'image' ? '🖼' : '📄'}</span>
                                                                    <span className="truncate max-w-[180px]">{msg.attachmentName}</span>
                                                                </div>
                                                            )}
                                                            {msg.content && <span className="whitespace-pre-wrap">{msg.content}</span>}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Changes */}
                                                {msg.changes && msg.changes.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        {msg.changes.map((change, idx) => (
                                                            <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wide shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
                                                                <CheckCircle2 size={12} />
                                                                {change.type === 'add' ? 'Afegit' : 'Eliminat'} {change.subject}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}

                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="px-4 pb-2"
                            >
                                <div className="text-red-400 text-xs font-medium bg-red-500/10 backdrop-blur-xl border border-red-500/20 px-3 py-2 rounded-lg shadow-lg">
                                    {error}
                                </div>
                            </motion.div>
                        )}

                        {/* Input Area (Planner AI style) */}
                        <div className="relative pointer-events-auto">
                            {/* Glowing Aura (Apple Intelligence Style) */}
                            <div
                                className={`absolute -inset-[1px] rounded-[32px] blur-md transition-all duration-700 pointer-events-none
                                    ${isGenerating
                                        ? 'bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 opacity-50 animate-[pulse_1s_ease-in-out_infinite]'
                                        : 'bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-cyan-500/20 opacity-20'}
                                `}
                            />

                            {/* Pulsing glow when generating */}
                            {isGenerating && (
                                <div className="absolute -inset-4 bg-fuchsia-500/20 blur-3xl rounded-[100%] animate-[pulse_2s_ease-in-out_infinite] pointer-events-none" />
                            )}

                            {/* Main Input Container */}
                            <div
                                className={`relative bg-slate-800/40 backdrop-blur-xl transform-gpu border ${isDragging ? 'border-fuchsia-500/50 bg-slate-800/60' : 'border-white/10'} rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)] overflow-hidden flex flex-col p-2 transition-colors duration-300`}
                                onDragOver={onDragOver}
                                onDragLeave={onDragLeave}
                                onDrop={onDrop}
                            >

                                <AnimatePresence>
                                    {attachedFile && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="px-4 pt-2">
                                            <div className="relative inline-block border border-white/10 rounded-xl bg-slate-900/50 p-1 mt-2">
                                                {attachedFile.mimeType.startsWith('image/') ? (
                                                    <img src={`data:${attachedFile.mimeType};base64,${attachedFile.data}`} alt="preview" className="h-16 object-contain rounded-lg" loading="lazy" />
                                                ) : (
                                                    <div className="h-16 w-16 flex items-center justify-center bg-slate-800 rounded-lg"><span className="text-xs font-bold text-slate-300">PDF</span></div>
                                                )}
                                                <button onClick={() => setAttachedFile(null)} className="absolute -top-2 -right-2 bg-slate-700 text-white rounded-full p-1 hover:bg-red-500 transition-colors shadow-lg z-20">
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="relative flex items-end gap-2">

                                    {/* File Input */}
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*,.pdf" onChange={e => { if (e.target.files?.[0]) { processFile(e.target.files[0]); e.target.value = ''; } }} />
                                    <button onClick={() => fileInputRef.current?.click()} disabled={isGenerating} className="shrink-0 p-2 text-slate-400 hover:text-slate-200 hover:bg-white/10 rounded-full transition-colors mb-1.5 ml-1" title="Adjuntar imatge o PDF">
                                        <Plus size={20} />
                                    </button>

                                    {/* Auto-growing Textarea */}
                                    <textarea
                                        ref={textareaRef}
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        disabled={isGenerating}
                                        placeholder="Demana el que vulguis al teu tutor..."
                                        className="flex-1 max-h-[120px] min-h-[44px] py-[12px] bg-transparent text-[15px] leading-relaxed text-white placeholder:text-slate-500 focus:outline-none resize-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                                        rows={1}
                                    />

                                    {/* Submit Button */}
                                    <div className="pr-2 pb-2 shrink-0">
                                        <button
                                            onClick={handleGenerate}
                                            disabled={(!prompt.trim() && !attachedFile) || isGenerating}
                                            className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 
                                                ${(!prompt.trim() && !attachedFile && !isGenerating)
                                                    ? 'bg-white/5 text-white/30 cursor-not-allowed'
                                                    : isGenerating
                                                        ? 'bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/50'
                                                        : 'bg-white text-black hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                                                }`}
                                        >
                                            {isGenerating ? (
                                                <StopCircle size={16} strokeWidth={2.5} className="animate-pulse" />
                                            ) : (
                                                <ArrowUp size={16} strokeWidth={3} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default RoadmapAIPromptBar;
