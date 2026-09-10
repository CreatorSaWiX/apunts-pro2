import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowUp, StopCircle, Plus, X } from 'lucide-react';
import { useTasks, useTasksStore } from '../../contexts/TasksContext';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { m as motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import AIStreamingIndicator, { type StreamPhase } from '../AIStreamingIndicator';
import type { Task, TaskStatus, TaskPriority, Subject } from '../../types/tasks';
import { dispatchAIMagicDone } from './plannerEvents';

interface AIPromptBarProps {
    isOpen: boolean;
    onClose: () => void;
}

interface AttachedFile {
    mimeType: string;
    data: string;
    name: string;
}

interface PlannerAIAction {
    type: 'CREATE' | 'UPDATE' | 'DELETE';
    task?: {
        title?: string;
        description?: string;
        status?: TaskStatus;
        priority?: TaskPriority;
        dueDate?: string | null;
        startDate?: string | null;
        estimatedMinutes?: number;
        subjectId?: string;
    };
    taskId?: string;
    updates?: Partial<Task>;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function getAvailableStatuses(): string[] {
    try {
        const saved = localStorage.getItem('planner_columns');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
                return parsed.map((c: { id?: string }) => c.id).filter((id): id is string => Boolean(id));
            }
        }
    } catch {
        // Utilitzar estats per defecte si falla el parsing
    }
    return ['TODO', 'IN_PROGRESS', 'COMPLETE'];
}

/**
 * Barra d'indicacions de l'Assistent IA per al Planificador.
 * Suporta entrada de text multilínea, adjunció de fitxers (imatges i PDFs)
 * i recepció de flux d'esdeveniments en temps real (Server-Sent Events).
 */
const AIPromptBar: React.FC<AIPromptBarProps> = ({ isOpen, onClose }) => {
    const { t, i18n } = useTranslation();
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [streamPhase, setStreamPhase] = useState<StreamPhase>('idle');
    const [thoughtText, setThoughtText] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Accés no reactiu a la botiga de tasques (zero re-renderitzats durant l'arrossegament o edició de tasques)
    const tasksStore = useTasksStore();
    const addTask = useTasks(state => state.addTask);
    const updateTask = useTasks(state => state.updateTask);
    const deleteTask = useTasks(state => state.deleteTask);
    const aiSettings = useSettingsStore(state => state.aiSettings);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Gestió del processament de fitxers adjunts
    const processFile = useCallback((file: File) => {
        if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
            setError(t('planner.ai.errorFiles', 'Només es permeten imatges o PDFs.'));
            return;
        }
        if (file.size > MAX_FILE_SIZE) {
            setError(t('planner.ai.errorSize', "L'arxiu és massa gran. Màxim 5MB."));
            return;
        }
        setError(null);
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            if (result) {
                const base64 = result.split(',')[1];
                setAttachedFile({ mimeType: file.type, data: base64, name: file.name });
            }
        };
        reader.onerror = () => {
            setError(t('planner.ai.errorReadingFile', "Error en llegir l'arxiu"));
        };
        reader.readAsDataURL(file);
    }, [t]);

    const onDragOver = useCallback((e: React.DragEvent) => { 
        e.preventDefault(); 
        setIsDragging(true); 
    }, []);

    const onDragLeave = useCallback(() => { 
        setIsDragging(false); 
    }, []);

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault(); 
        setIsDragging(false);
        if (e.dataTransfer.files?.[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    }, [processFile]);

    // Redimensionament automàtic de l'àrea de text
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
        }
    }, [prompt]);

    // Reinicialització en obrir o tancar el panell
    useEffect(() => {
        if (!isOpen) {
            setPrompt('');
            setError(null);
            setAttachedFile(null);
        } else {
            textareaRef.current?.focus();
        }
    }, [isOpen]);

    // Neteja del controlador d'avortament al desmuntar
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
                abortControllerRef.current = null;
            }
        };
    }, []);

    const handleStop = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setIsGenerating(false);
        setStreamPhase('idle');
        setThoughtText('');
    }, []);

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

            // Obtenir les tasques i assignatures més recents directament de la store en temps d'execució
            const { tasks: currentTasks, subjects: currentSubjects } = tasksStore.getState();

            const response = await fetch('/api/planner-ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    prompt,
                    currentTasks,
                    subjects: currentSubjects.map((s: Subject) => ({ id: s.id, name: s.name })),
                    currentDate: new Date().toISOString(),
                    availableStatuses: getAvailableStatuses(),
                    aiSettings,
                    ...(attachedFile ? { attachedFile } : {}),
                    language: i18n.language
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
                                setThoughtText(prev => prev + (parsed.text || ''));
                                break;
                            case 'actions':
                                setStreamPhase('writing');
                                const actions = parsed.actions;
                                if (Array.isArray(actions) && actions.length > 0) {
                                    await Promise.all(actions.map(async (action: PlannerAIAction) => {
                                        try {
                                            if (action.type === 'CREATE' && action.task) {
                                                await addTask({
                                                    title: action.task.title || 'Tasca AI',
                                                    description: action.task.description || '',
                                                    status: action.task.status || 'TODO',
                                                    priority: action.task.priority || 'MEDIUM',
                                                    dueDate: action.task.dueDate || null,
                                                    startDate: action.task.startDate || null,
                                                    estimatedMinutes: action.task.estimatedMinutes || 60,
                                                    subjectId: action.task.subjectId ?? null
                                                });
                                            } else if (action.type === 'UPDATE' && action.taskId && action.updates) {
                                                await updateTask(action.taskId, action.updates);
                                            } else if (action.type === 'DELETE' && action.taskId) {
                                                await deleteTask(action.taskId);
                                            }
                                        } catch (actionErr) {
                                            console.error('Error aplicant acció AI:', actionErr);
                                        }
                                    }));
                                }
                                break;
                            case 'error':
                                throw new Error(parsed.message || 'Error en el servei IA');
                            case 'done':
                                setStreamPhase('done');
                                setPrompt('');
                                setAttachedFile(null);
                                dispatchAIMagicDone();
                                onClose();
                                break;
                        }
                    } catch (e) {
                        console.error('Error parsejant event SSE:', e);
                    }
                }
            }

        } catch (err: unknown) {
            const errorObj = err as Error;
            if (errorObj?.name === 'AbortError') return;
            console.error(err);
            setError(errorObj?.message || 'Error desconegut');
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
                    {/* Teló invisible per capturar clics exteriors i tancar el panell */}
                    <div 
                        className="fixed inset-0 z-[90]" 
                        onClick={onClose} 
                        aria-hidden="true" 
                    />

                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-label={t('planner.ai.dialogTitle', "Assistent d'Intel·ligència Artificial")}
                        initial={{ y: 150, scale: 0.95 }}
                        animate={{ y: 0, scale: 1 }}
                        exit={{ y: 150, scale: 0.95 }}
                        transition={{ type: "spring", bounce: 0.25, duration: 0.6 }}
                        className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] w-[90vw] max-w-2xl"
                    >
                        {/* Aura brillant estil Apple Intelligence */}
                        <div
                            className={`absolute -inset-[1px] rounded-[32px] blur-md transition duration-700 pointer-events-none ${
                                isGenerating
                                    ? 'bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 opacity-50 animate-[pulse_1s_ease-in-out_infinite]'
                                    : 'bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-cyan-500/20 opacity-20'
                            }`}
                        />

                        {/* Resplendor vibrant addicional durant la generació */}
                        {isGenerating && (
                            <div className="absolute -inset-4 bg-fuchsia-500/20 blur-3xl rounded-[100%] animate-[pulse_2s_ease-in-out_infinite] pointer-events-none" />
                        )}

                        {/* Contenidor principal de la barra d'entrada */}
                        <div
                            className={`relative bg-slate-800/40 backdrop-blur-xl transform-gpu border ${
                                isDragging ? 'border-fuchsia-500/50 bg-slate-800/60' : 'border-white/10'
                            } rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)] overflow-hidden flex flex-col p-2 transition-colors duration-300`}
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                            onDrop={onDrop}
                        >
                            {/* Previsualització de l'arxiu adjunt (imatge o PDF) */}
                            <AnimatePresence>
                                {attachedFile && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10 }} 
                                        animate={{ opacity: 1, y: 0 }} 
                                        exit={{ opacity: 0, y: -10 }} 
                                        className="px-4 pt-2"
                                    >
                                        <div className="relative inline-block border border-white/10 rounded-xl bg-slate-900/50 p-1 mt-2">
                                            {attachedFile.mimeType.startsWith('image/') ? (
                                                <img 
                                                    src={`data:${attachedFile.mimeType};base64,${attachedFile.data}`} 
                                                    alt="preview" 
                                                    className="h-16 object-contain rounded-lg" 
                                                    loading="lazy" 
                                                />
                                            ) : (
                                                <div className="h-16 w-16 flex items-center justify-center bg-slate-800 rounded-lg">
                                                    <span className="text-xs font-bold text-slate-300">PDF</span>
                                                </div>
                                            )}
                                            <button 
                                                type="button" 
                                                onClick={() => setAttachedFile(null)} 
                                                aria-label={t('planner.ai.removeAttachment', "Eliminar fitxer adjunt")}
                                                className="absolute -top-2 -right-2 bg-slate-700 text-white rounded-full p-1 hover:bg-red-500 transition-colors shadow-lg z-20 cursor-pointer"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Missatge d'error */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="px-4 pt-2 pb-1"
                                >
                                    <div className="text-red-400 text-xs font-medium bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
                                        {error}
                                    </div>
                                </motion.div>
                            )}

                            <div className="relative flex items-end gap-2">
                                {/* Selector i botó d'adjunció de fitxer */}
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept="image/*,.pdf" 
                                    onChange={e => { 
                                        if (e.target.files?.[0]) { 
                                            processFile(e.target.files[0]); 
                                            e.target.value = ''; 
                                        } 
                                    }} 
                                />
                                <button 
                                    type="button" 
                                    onClick={() => fileInputRef.current?.click()} 
                                    disabled={isGenerating} 
                                    className="shrink-0 p-2 text-slate-400 hover:text-slate-200 hover:bg-white/10 rounded-full transition-colors mb-1.5 ml-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
                                    title={t('planner.ai.attach', "Adjuntar imatge o PDF")}
                                    aria-label={t('planner.ai.attach', "Adjuntar imatge o PDF")}
                                >
                                    <Plus size={20} />
                                </button>

                                {/* Àrea de text auto-creixent o Indicador de flux d'IA */}
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
                                            aria-label={t('planner.ai.placeholder', "Escriu què necessites planificar...")}
                                            placeholder={t('planner.ai.placeholder', "Escriu què necessites planificar...")}
                                            className="w-full max-h-[200px] bg-transparent text-[15px] leading-relaxed text-white placeholder:text-slate-500 focus:outline-none resize-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                                            rows={1}
                                        />
                                    )}
                                </div>

                                {/* Botó d'enviament o aturada de generació */}
                                <div className="pr-2 pb-2 shrink-0">
                                    <button 
                                        type="button"
                                        onClick={isGenerating ? handleStop : handleGenerate}
                                        disabled={(!prompt.trim() && !attachedFile && !isGenerating)}
                                        aria-label={isGenerating ? t('planner.ai.stop', 'Aturar generació') : t('planner.ai.generate', 'Generar tasques')}
                                        className={`relative flex items-center justify-center w-8 h-8 rounded-full transition duration-300 ${
                                            (!prompt.trim() && !attachedFile && !isGenerating)
                                                ? 'bg-white/5 text-white/30 cursor-not-allowed'
                                                : isGenerating
                                                    ? 'bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/50 hover:bg-fuchsia-500/30 cursor-pointer'
                                                    : 'bg-white text-black hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.2)] cursor-pointer'
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
