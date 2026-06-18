import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Sparkles, StopCircle, CheckCircle2 } from 'lucide-react';
import { useRoadmap } from '../../../contexts/RoadmapContext';
import { motion, AnimatePresence } from 'framer-motion';

interface RoadmapAIPromptBarProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string;
    changes?: { type: 'add' | 'remove'; subject: string }[];
}

const RoadmapAIPromptBar: React.FC<RoadmapAIPromptBarProps> = ({ isOpen, onClose }) => {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const { nodes, addSubjectNode } = useRoadmap();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

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
        if (!prompt.trim() || isGenerating) return;

        const userMsg = prompt.trim();
        setPrompt('');
        setError(null);
        setIsGenerating(true);

        const newMsg: Message = { id: Date.now().toString(), role: 'user', content: userMsg };
        setMessages(prev => [...prev, newMsg]);

        const activeNodes = nodes
            .filter(n => ['passed', 'in_progress', 'retaking'].includes(n.data.status))
            .map(n => n.id);

        try {
            const response = await fetch('/api/roadmap-ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: userMsg,
                    currentNodes: activeNodes
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Error al comunicar amb la IA');
            }

            const data = await response.json();
            
            const aiResponse = data.reply || "He processat la teva petició però no tinc comentaris addicionals.";
            const changes = data.actions || [];

            // Apliquem canvis reals a la UI
            if (changes && Array.isArray(changes)) {
                for (const change of changes) {
                    if (change.type === 'add' && change.subject) {
                        addSubjectNode(change.subject, 'optional');
                    }
                }
            }

            const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'ai', content: aiResponse, changes };
            setMessages(prev => [...prev, aiMsg]);
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
                        initial={{ y: 100, opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 50, opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", bounce: 0.25, duration: 0.6 }}
                        className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] w-[90vw] max-w-2xl flex flex-col justify-end pointer-events-none"
                    >
                        {/* Chat Area (Floating above input) */}
                        {messages.length > 0 && (
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
                                            <div className={`flex flex-col gap-2 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                                <div className="px-6 py-4 rounded-[24px] text-[15px] leading-relaxed text-slate-200 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)] backdrop-blur-xl border border-white/10 bg-slate-800/40">
                                                    {msg.content}
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

                                    {/* Thinking Indicator */}
                                    {isGenerating && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex gap-3 flex-row items-end"
                                        >
                                            <div className="bg-slate-800/40 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-[24px] flex gap-1.5 items-center shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)]">
                                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

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
                            <div className="relative bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)] overflow-hidden flex flex-col p-2">
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
                                        placeholder="Demana el que vulguis a l'Apunts AI..."
                                        className="flex-1 max-h-[120px] min-h-[44px] py-[12px] bg-transparent text-[15px] leading-relaxed text-white placeholder:text-slate-500 focus:outline-none resize-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
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
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default RoadmapAIPromptBar;
