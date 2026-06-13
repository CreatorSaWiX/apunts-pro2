import React, { useState } from 'react';
import { X, Bot, Sparkles, Loader2 } from 'lucide-react';
import { useTasks } from '../../contexts/TasksContext';
import type { Task } from '../../types/tasks';

interface AIModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AIModal: React.FC<AIModalProps> = ({ isOpen, onClose }) => {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { tasks, addTask } = useTasks();

    if (!isOpen) return null;

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setIsGenerating(true);
        setError(null);

        try {
            const response = await fetch('/api/planner-ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt,
                    currentTasks: tasks
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Error al generar tasques');
            }

            const data = await response.json();
            const newTasks: Partial<Task>[] = data.tasks;

            if (newTasks && newTasks.length > 0) {
                // Afegim les tasques una per una
                for (const t of newTasks) {
                    addTask({
                        title: t.title || 'Tasca AI',
                        description: t.description || '',
                        status: 'TODO',
                        priority: t.priority || 'MEDIUM',
                        dueDate: t.dueDate || null,
                        startDate: t.startDate || null,
                        estimatedMinutes: t.estimatedMinutes || 60,
                        source: 'AI'
                    });
                }

                setPrompt('');
                onClose();
            } else {
                setError('La IA no ha pogut extreure cap tasca.');
            }

        } catch (err: any) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] p-4 bg-black/40 backdrop-blur-md">
            <div className="relative w-full max-w-2xl">
                {/* Glow Aura */}
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/30 to-fuchsia-600/30 rounded-[32px] blur-2xl opacity-50 animate-[pulse_4s_ease-in-out_infinite] pointer-events-none" />

                {/* Modal Container */}
                <div className="relative bg-[#050505]/80 backdrop-blur-3xl border border-white/10 w-full rounded-[32px] shadow-[0_0_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.05)] overflow-hidden flex flex-col transform transition-all">

                    <div className="flex flex-col p-8 pb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3 text-white">
                                <div className="bg-gradient-to-br from-violet-500 to-fuchsia-500 p-2 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                                    <Sparkles size={20} className="text-white" />
                                </div>
                                <h2 className="text-xl font-bold tracking-tight">Intelligence</h2>
                            </div>
                            <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-all rounded-full hover:bg-white/5">
                                <X size={20} strokeWidth={2.5} />
                            </button>
                        </div>

                        <p className="text-sm font-medium text-slate-400 mb-6 leading-relaxed">
                            Enganxa el temari d'una assignatura, el text d'un PDF, o descriu què necessites estudiar aquesta setmana. Nosaltres ho esmicolem i planifiquem per tu de forma màgica.
                        </p>

                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Tinc exàmen de PRO2 el divendres sobre grafs i m'agradaria planificar-ho..."
                            className="w-full h-32 bg-transparent text-lg text-white placeholder:text-slate-600 focus:outline-none resize-none mb-2"
                            disabled={isGenerating}
                            autoFocus
                        />

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium p-3 rounded-xl mb-4">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Action Bar */}
                    <div className="bg-white/[0.02] border-t border-white/5 p-4 px-8 flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">
                            AI Magic <span className="text-fuchsia-400/50 ml-1">✦</span>
                        </span>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={onClose}
                                className="px-5 py-2 text-sm font-bold text-slate-400 hover:text-white transition-colors"
                                disabled={isGenerating}
                            >
                                Cancel·lar
                            </button>
                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating || !prompt.trim()}
                                className="relative group overflow-hidden flex items-center gap-2 bg-white text-black disabled:bg-white/20 disabled:text-white/40 px-6 py-2.5 rounded-xl text-sm font-extrabold transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin text-fuchsia-500" />
                                        <span>Generant...</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <span className="relative z-10">Planificar Ara</span>
                                        <Sparkles size={16} className="text-fuchsia-500 relative z-10" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIModal;
