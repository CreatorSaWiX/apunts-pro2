import React, { useState, useRef, useEffect } from 'react';
import { useRoadmapAI } from '../../../hooks/useRoadmapAI';
import { ArrowUp, Sparkles, StopCircle, CheckCircle2, Plus, X } from 'lucide-react';
import { useRoadmap } from '../../../contexts/RoadmapContext';
import { useSettings } from '../../../contexts/SettingsContext';
import { m as motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import SubjectHoursWidget from './Widgets/SubjectHoursWidget';
import SubjectEvaluationWidget from './Widgets/SubjectEvaluationWidget';
import SubjectCompetenciesWidget from './Widgets/SubjectCompetenciesWidget';
import AIStreamingIndicator from '../../AIStreamingIndicator';
import { useTranslation } from 'react-i18next';

interface RoadmapAIPromptBarProps {
    isOpen: boolean;
    onClose: () => void;
}



const RoadmapAIPromptBar: React.FC<RoadmapAIPromptBarProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const [prompt, setPrompt] = useState('');
    const { nodes, addSubjectNode } = useRoadmap();
    const { aiSettings } = useSettings();
    const {
        messages,
        isGenerating,
        error,
        streamPhase,
        thoughtText,
        attachedFile,
        setAttachedFile,
        processFile,
        handleGenerate: doGenerate
    } = useRoadmapAI(aiSettings, nodes, (a: string, t: any) => addSubjectNode(a, t));

    const [isDragging, setIsDragging] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const suggestions = [
        t('planner.roadmapAI.suggestions.hardware', "Què haig de fer si vull ser hardware engineer?"),
        t('planner.roadmapAI.suggestions.addAI', "Afegeix IA al meu roadmap"),
        t('planner.roadmapAI.suggestions.evalEDA', "Com s'avalua EDA?")
    ];

    const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
    const onDragLeave = () => setIsDragging(false);
    const onDrop = (e: React.DragEvent) => {
        e.preventDefault(); setIsDragging(false);
        if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = `${Math.min(scrollHeight, 120)}px`;
        }
    }, [prompt]);

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
        const currentPrompt = prompt;
        setPrompt('');
        await doGenerate(currentPrompt);
        if (textareaRef.current) textareaRef.current.focus();
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
                                            layout
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                                        >
                                            {/* Bubble */}
                                            <div className={`flex flex-col gap-2 ${msg.role === 'user' ? 'max-w-[85%] items-end' : 'w-[85%] items-start'}`}>
                                                <div className="px-6 py-4 rounded-[24px] text-[15px] w-full leading-relaxed text-slate-200 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)] backdrop-blur-xl border border-white/10 bg-slate-800/40">
                                                    {msg.role === 'ai' ? (
                                                        !msg.content && streamPhase !== 'writing' ? (
                                                            <div className="-mx-2 -my-2 min-w-[200px] flex flex-col gap-2">
                                                                <AIStreamingIndicator
                                                                    phase={streamPhase === 'idle' ? 'connecting' : streamPhase}
                                                                    thoughtText={thoughtText}
                                                                    renderAvatar={(size, color) => <Sparkles size={size} className={color} />}
                                                                />
                                                                {streamPhase === 'connecting' && <span className="text-xs text-slate-400 font-medium ml-1.5 animate-pulse">{t('planner.roadmapAI.connecting', 'Connectant i analitzant el teu roadmap...')}</span>}
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
                                                        {msg.changes.map((change, i) => (
                                                            <div key={`${change.subject}-${i}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wide shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
                                                                <CheckCircle2 size={12} />
                                                                {change.type === 'add' ? t('planner.roadmapAI.added', 'Afegit') : t('planner.roadmapAI.removed', 'Eliminat')} {change.subject}
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
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className="px-4 pb-2"
                            >
                                <div className="text-red-400 text-xs font-medium bg-red-500/10 backdrop-blur-xl border border-red-500/20 px-3 py-2 rounded-lg shadow-lg">
                                    {error}
                                </div>
                            </motion.div>
                        )}

                        {/* Input Area (Planner AI style) */}
                        <div className="relative pointer-events-auto flex flex-col items-center">

                            {/* Prompt Suggestions */}
                            <AnimatePresence>
                                {messages.length === 0 && !attachedFile && !prompt && !isGenerating && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10, transition: { duration: 0.2 } }}
                                        className="flex flex-wrap justify-center gap-2 mb-4 px-4 w-full"
                                    >
                                        {suggestions.map((s) => (
                                            <button type="button"
                                                key={s}
                                                onClick={() => { setPrompt(s); setTimeout(() => handleGenerate(), 50); }}
                                                className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 transition-colors backdrop-blur-md cursor-pointer whitespace-nowrap shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="relative w-full">
                                {/* Glowing Aura (Apple Intelligence Style) */}
                                <div
                                    className={`absolute -inset-[1px] rounded-[32px] blur-xl transition-all duration-1000 pointer-events-none
                                        ${isGenerating
                                            ? 'bg-gradient-to-r from-[#8b5cf6] via-[#d946ef] to-[#06b6d4] bg-[length:200%_auto] animate-[gradient-x_2s_linear_infinite] opacity-60'
                                            : 'bg-gradient-to-r from-violet-500/30 via-fuchsia-500/30 to-cyan-500/30 opacity-30'}
                                    `}
                                />

                                {/* Pulsing glow when generating */}
                                {isGenerating && (
                                    <div className="absolute -inset-4 bg-fuchsia-500/20 blur-3xl rounded-[100%] animate-[pulse_2s_ease-in-out_infinite] pointer-events-none" />
                                )}

                                {/* Main Input Container */}
                                <div
                                    className={`relative bg-slate-900/60 backdrop-blur-2xl transform-gpu border ${isDragging ? 'border-fuchsia-500/50 bg-slate-800/80' : 'border-white/10'} rounded-[24px] shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-10px_20px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col p-2 transition-colors duration-300`}
                                    onDragOver={onDragOver}
                                    onDragLeave={onDragLeave}
                                    onDrop={onDrop}
                                >

                                    <AnimatePresence>
                                        {attachedFile && (
                                            <motion.div initial={{ opacity: 0, scale: 0.95, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -10 }} className="px-4 pt-2">
                                                <div className="relative inline-block border border-white/10 rounded-xl bg-slate-900/50 p-1 mt-2">
                                                    {attachedFile.mimeType.startsWith('image/') ? (
                                                        <img src={`data:${attachedFile.mimeType};base64,${attachedFile.data}`} alt="preview" className="h-16 object-contain rounded-lg" loading="lazy" />
                                                    ) : (
                                                        <div className="h-16 w-16 flex items-center justify-center bg-slate-800 rounded-lg"><span className="text-xs font-bold text-slate-300">PDF</span></div>
                                                    )}
                                                    <button type="button" onClick={() => setAttachedFile(null)} className="absolute -top-2 -right-2 bg-slate-700 text-white rounded-full p-1 hover:bg-red-500 transition-colors shadow-lg z-20">
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="relative flex items-end gap-2">

                                        {/* Actions Left */}
                                        <div className="flex items-center pb-1.5 pl-1 gap-1">
                                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*,.pdf" onChange={e => { if (e.target.files?.[0]) { processFile(e.target.files[0]); e.target.value = ''; } }} />
                                            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isGenerating} className="shrink-0 p-2 text-slate-400 hover:text-slate-200 hover:bg-white/10 rounded-full transition-colors" title={t('planner.roadmapAI.attachTooltip', 'Adjuntar imatge o PDF')}>
                                                <Plus size={20} />
                                            </button>

                                        </div>

                                        {/* Auto-growing Textarea */}
                                        <textarea
                                            ref={textareaRef}
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            disabled={isGenerating}
                                            placeholder={t('planner.roadmapAI.placeholder', 'Escriu un missatge a {{name}}...', { name: aiSettings?.identity?.name || 'Roadmap AI' })}
                                            className="flex-1 max-h-[120px] min-h-[44px] py-[12px] bg-transparent text-[15px] leading-relaxed text-white placeholder:text-slate-500 focus:outline-none resize-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                                            rows={1}
                                        />

                                        {/* Submit Button */}
                                        <div className="pr-2 pb-2 shrink-0">
                                            <button type="button"
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
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default RoadmapAIPromptBar;
