import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Sparkles, StopCircle } from 'lucide-react';
import { useTasks } from '../../contexts/TasksContext';
import { useSettings } from '../../contexts/SettingsContext';
import { motion, AnimatePresence } from 'framer-motion';
// import type { Task } from '../../types/tasks';

interface AIPromptBarProps {
    isOpen: boolean;
    onClose: () => void;
}

const AIPromptBar: React.FC<AIPromptBarProps> = ({ isOpen, onClose }) => {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { tasks, addTask, updateTask, deleteTask, subjects } = useTasks();
    const { aiSettings } = useSettings();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

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

    const handleGenerate = async () => {
        if (!prompt.trim() || isGenerating) return;

        setIsGenerating(true);
        setError(null);

        try {
            const { auth } = await import('../../lib/firebase');
            const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';

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
                    aiSettings
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Error al generar tasques');
            }

            const data = await response.json();
            const actions = data.actions;

            if (actions && Array.isArray(actions)) {
                if (actions.length > 0) {
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
                setPrompt('');
                window.dispatchEvent(new CustomEvent('ai-magic-done'));
                onClose();
            } else {
                setError('La resposta de la IA no té el format correcte.');
            }

        } catch (err: any) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsGenerating(false);
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

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Invisible click-catcher to close when clicking outside */}
                    <div className="fixed inset-0 z-[90]" onClick={onClose} />

                    <motion.div
                        initial={{ y: 100, opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 50, opacity: 0, scale: 0.95 }}
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
                        <div className="relative bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)] overflow-hidden flex flex-col p-2">

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
                                {/* Icon / Sparkles */}
                                <div className="pl-4 pb-[14px] shrink-0 pointer-events-none">
                                    <Sparkles size={20} className={`transition-all duration-700 ${isGenerating ? 'text-fuchsia-400 animate-pulse' : 'text-slate-400'}`} />
                                </div>

                                {/* Auto-growing Textarea */}
                                <textarea
                                    ref={textareaRef}
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={isGenerating}
                                    placeholder="Escriu què necessites planificar..."
                                    className="flex-1 max-h-[200px] min-h-[44px] py-[12px] bg-transparent text-[15px] leading-relaxed text-white placeholder:text-slate-500 focus:outline-none resize-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                                    rows={1}
                                />

                                {/* Submit Button */}
                                <div className="pr-2 pb-2 shrink-0">
                                    <button
                                        onClick={handleGenerate}
                                        disabled={!prompt.trim() && !isGenerating}
                                        className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 
                                        ${(!prompt.trim() && !isGenerating)
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
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AIPromptBar;
