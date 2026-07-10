import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, StopCircle, Plus, X } from 'lucide-react';
import { useTasks } from '../../contexts/TasksContext';
import { useSettings } from '../../contexts/SettingsContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import AIStreamingIndicator, { type StreamPhase } from '../AIStreamingIndicator';

interface AIPromptBarProps {
    isOpen: boolean;
    onClose: () => void;
}

const AIPromptBar: React.FC<AIPromptBarProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [streamPhase, setStreamPhase] = useState<StreamPhase>('idle');
    const [thoughtText, setThoughtText] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { tasks, addTask, updateTask, deleteTask, subjects } = useTasks();
    const { aiSettings } = useSettings();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const [attachedFile, setAttachedFile] = useState<{ mimeType: string, data: string, name: string } | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const processFile = (file: File) => {
        if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
            setError(t('planner.ai.errorFiles', 'Només es permeten imatges o PDFs.'));
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError(t('planner.ai.errorSize', "L'arxiu és massa gran. Màxim 5MB."));
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
            textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
        }
    }, [prompt]);

    useEffect(() => {
        if (isOpen && textareaRef.current) {
            textareaRef.current.focus();
        } else {
            setPrompt('');
            setError(null);
        }
    }, [isOpen]);

    const handleStop = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setIsGenerating(false);
        setStreamPhase('idle');
        setThoughtText('');
    };

    const handleGenerate = async () => {
        if ((!prompt.trim() && !attachedFile) || isGenerating) return;

        setIsGenerating(true);
        setError(null);
        setStreamPhase('connecting');
        setThoughtText('');

        try {
            const { auth } = await import('../../lib/firebase');
            const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';

            abortControllerRef.current = new AbortController();

            const response = await fetch('/api/planner-ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    prompt,
                    currentTasks: tasks,
                    subjects: subjects.map(s => ({ id: s.id, name: s.name })),
                    currentDate: new Date().toISOString(),
                    aiSettings,
                    attachedFile
                }),
                signal: abortControllerRef.current.signal
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({ error: t('planner.ai.errorUnknown', 'Error desconegut') }));
                throw new Error(data.error || t('planner.ai.errorGenerate', 'Error al generar tasques'));
            }

            const reader = response.body?.getReader();
            if (!reader) throw new Error(t('planner.ai.errorStreaming', 'El navegador no suporta streaming'));

            const decoder = new TextDecoder();
            let sseBuffer = '';
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                sseBuffer += decoder.decode(value, { stream: true });
                const events = sseBuffer.split('\n\n');
                sseBuffer = events.pop() || '';

                for (const eventBlock of events) {
                    if (!eventBlock.trim()) continue;

                    let eventType = 'message';
                    let eventData = '';

                    for (const line of eventBlock.split('\n')) {
                        if (line.startsWith('event: ')) {
                            eventType = line.substring(7).trim();
                        } else if (line.startsWith('data: ')) {
                            eventData = line.substring(6);
                        }
                    }

                    if (!eventData) continue;

                    try {
                        const parsed = JSON.parse(eventData);

                        switch (eventType) {
                            case 'status':
                                if (parsed.phase === 'thinking') setStreamPhase('thinking');
                                else if (parsed.phase === 'writing') setStreamPhase('writing');
                                break;
                            case 'thought':
                                setThoughtText(prev => prev + parsed.text);
                                break;
                            case 'actions':
                                setStreamPhase('writing'); 
                                const actions = parsed.actions;
                                if (actions && Array.isArray(actions) && actions.length > 0) {
                                    for (const action of actions) {
                                        if (action.type === 'CREATE' && action.task) {
                                            await addTask({
                                                title: action.task.title || 'Tasca AI',
                                                description: action.task.description || '',
                                                status: action.task.status || 'TODO',
                                                priority: action.task.priority || 'MEDIUM',
                                                dueDate: action.task.dueDate || null,
                                                startDate: action.task.startDate || null,
                                                estimatedMinutes: action.task.estimatedMinutes || 60,
                                                subjectId: action.task.subjectId || undefined,
                                                source: 'AI'
                                            });
                                        } else if (action.type === 'UPDATE' && action.taskId && action.updates) {
                                            await updateTask(action.taskId, action.updates);
                                        } else if (action.type === 'DELETE' && action.taskId) {
                                            await deleteTask(action.taskId);
                                        }
                                    }
                                }
                                break;
                            case 'error':
                                throw new Error(parsed.message);
                            case 'done':
                                setStreamPhase('done');
                                setPrompt('');
                                setAttachedFile(null);
                                window.dispatchEvent(new CustomEvent('ai-magic-done'));
                                onClose();
                                break;
                        }
                    } catch (e) {
                        console.error('Error parsejant event SSE:', e);
                    }
                }
            }

        } catch (err: any) {
            if (err.name === 'AbortError') return;
            console.error(err);
            setError(err.message);
        } finally {
            setIsGenerating(false);
            setStreamPhase('idle');
            setThoughtText('');
            abortControllerRef.current = null;
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleGenerate();
        }
        if (e.key === 'Escape') {
            if (isGenerating) handleStop();
            else onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Invisible click-catcher to close when clicking outside */}
                    <div className="fixed inset-0 z-[90]" onClick={onClose} />

                    <motion.div
                        initial={{ y: 150, scale: 0.95 }}
                        animate={{ y: 0, scale: 1 }}
                        exit={{ y: 150, scale: 0.95 }}
                        transition={{ type: "spring", bounce: 0.25, duration: 0.6 }}
                        className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] w-[90vw] max-w-2xl"
                    >
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

                        {/* Main Container */}
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

                            {/* Error Message */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="px-4 pt-2 pb-1"
                                >
                                    <div className="text-red-400 text-xs font-medium bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
                                        {error}
                                    </div>
                                </motion.div>
                            )}

                            <div className="relative flex items-end gap-2">

                                {/* File Input */}
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*,.pdf" onChange={e => { if (e.target.files?.[0]) { processFile(e.target.files[0]); e.target.value = ''; } }} />
                                <button onClick={() => fileInputRef.current?.click()} disabled={isGenerating} className="shrink-0 p-2 text-slate-400 hover:text-slate-200 hover:bg-white/10 rounded-full transition-colors mb-1.5 ml-1" title={t('planner.ai.attach', "Adjuntar imatge o PDF")}>
                                    <Plus size={20} />
                                </button>

                                {/* Auto-growing Textarea or Streaming Indicator */}
                                <div className="flex-1 min-h-[44px] py-[12px] flex flex-col justify-center">
                                    {streamPhase !== 'idle' && streamPhase !== 'done' ? (
                                        <AIStreamingIndicator 
                                            phase={streamPhase} 
                                            thoughtText={thoughtText}
                                            hideAvatar={true}
                                        />
                                    ) : (
                                        <textarea
                                            ref={textareaRef}
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            disabled={isGenerating}
                                            placeholder={t('planner.ai.placeholder', "Escriu què necessites planificar...")}
                                            className="w-full max-h-[200px] bg-transparent text-[15px] leading-relaxed text-white placeholder:text-slate-500 focus:outline-none resize-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                                            rows={1}
                                        />
                                    )}
                                </div>

                                {/* Submit / Stop Button */}
                                <div className="pr-2 pb-2 shrink-0">
                                    <button
                                        onClick={isGenerating ? handleStop : handleGenerate}
                                        disabled={(!prompt.trim() && !attachedFile && !isGenerating)}
                                        className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 
                                        ${(!prompt.trim() && !attachedFile && !isGenerating)
                                                ? 'bg-white/5 text-white/30 cursor-not-allowed'
                                                : isGenerating
                                                    ? 'bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/50 hover:bg-fuchsia-500/30'
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
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AIPromptBar;
