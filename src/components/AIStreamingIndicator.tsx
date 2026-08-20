import React, { useState, useEffect, useRef } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { ThoughtBlock, parseThoughtText } from './ThoughtBlock';
import { useTranslation } from 'react-i18next';

export type StreamPhase = 'idle' | 'connecting' | 'thinking' | 'writing' | 'done' | 'analyzing_intent' | 'searching_vector' | 'searching_web';

interface AIStreamingIndicatorProps {
    phase: StreamPhase;
    thoughtText: string;
    renderAvatar?: (iconSize: number, iconClass: string) => React.ReactNode;
    hideAvatar?: boolean;
}

// ── Elapsed timer ────────────────────────────────────────────────────────────
const ElapsedTimer: React.FC<{ startTime: number }> = ({ startTime }) => {
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setElapsed(((Date.now() - startTime) / 1000));
        }, 100);
        return () => clearInterval(interval);
    }, [startTime]);

    return (
        <span className="text-[10px] font-mono text-slate-500/70 tabular-nums ml-2">
            {elapsed.toFixed(1)}s
        </span>
    );
};

// ── Main Component ───────────────────────────────────────────────────────────
const AIStreamingIndicator: React.FC<AIStreamingIndicatorProps> = ({ phase, thoughtText, renderAvatar, hideAvatar = false }) => {
    const { t } = useTranslation();
    const [initialTime] = useState(() => Date.now());
    const thinkStartRef = useRef<number>(initialTime);
    const thoughtPanelRef = useRef<HTMLDivElement>(null);

    // Reset timer when entering thinking phase
    useEffect(() => {
        if (['thinking', 'connecting', 'analyzing_intent', 'searching_vector', 'searching_web'].includes(phase)) {
            thinkStartRef.current = Date.now();
        }
    }, [phase]);

    // Auto-scroll thought panel
    useEffect(() => {
        if (thoughtPanelRef.current) {
            thoughtPanelRef.current.scrollTop = thoughtPanelRef.current.scrollHeight;
        }
    }, [thoughtText]);

    if (phase === 'idle' || phase === 'done' || phase === 'writing') return null;

    return (
        <div className="flex justify-start items-start gap-3">
            {/* Avatar */}
            {!hideAvatar && renderAvatar && (
                <div className="w-6 h-6 rounded-md bg-slate-800/80 border border-white/5 flex items-center justify-center shrink-0 mt-1 overflow-hidden">
                    {renderAvatar(14, 'text-slate-400')}
                </div>
            )}

            <div className="flex flex-col gap-2 max-w-[85%]">
                <AnimatePresence mode="wait">
                    {/* ── CONNECTING ──────────────────────────────── */}
                    {phase === 'connecting' && (
                        <motion.div
                            key="connecting"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4, filter: 'blur(4px)' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="flex items-center gap-2.5"
                        >
                            <motion.span 
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                                className="text-sm text-slate-500 font-medium"
                            >
                                Connectant...
                            </motion.span>
                        </motion.div>
                    )}

                    {/* ── ANALYZING INTENT ────────────────────────────── */}
                    {phase === 'analyzing_intent' && (
                        <motion.div
                            key="analyzing"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4, filter: 'blur(4px)' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="flex items-center gap-2.5"
                        >
                            <motion.span 
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                                className="text-sm text-slate-500 font-medium"
                            >
                                Analitzant la pregunta...
                            </motion.span>
                        </motion.div>
                    )}

                    {/* ── SEARCHING VECTOR ────────────────────────────── */}
                    {phase === 'searching_vector' && (
                        <motion.div
                            key="searching_vector"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4, filter: 'blur(4px)' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="flex items-center gap-2.5"
                        >
                            <motion.span 
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                                className="text-sm text-slate-500 font-medium"
                            >
                                Buscant als apunts...
                            </motion.span>
                        </motion.div>
                    )}

                    {/* ── SEARCHING WEB ────────────────────────────── */}
                    {phase === 'searching_web' && (
                        <motion.div
                            key="searching_web"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4, filter: 'blur(4px)' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="flex items-center gap-2.5"
                        >
                            <motion.span 
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                                className="text-sm text-slate-500 font-medium"
                            >
                                Buscant a la web...
                            </motion.span>
                        </motion.div>
                    )}

                    {/* ── THINKING ────────────────────────────────── */}
                    {phase === 'thinking' && (
                        <motion.div
                            key="thinking"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, filter: 'blur(6px)' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="flex flex-col gap-2"
                        >
                            {/* Minimalist label */}
                            <div className="flex items-center gap-2">
                                <motion.span 
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                                    className="text-sm text-slate-400 font-medium"
                                >
                                    Pensant...
                                </motion.span>
                                <ElapsedTimer startTime={thinkStartRef.current} />
                            </div>

                            {/* Thought text panel (if thoughts available) */}
                            <AnimatePresence>
                                {thoughtText && (
                                    <motion.div
                                        initial={{ opacity: 0, scaleY: 0 }}
                                        animate={{ opacity: 1, scaleY: 1 }}
                                        exit={{ opacity: 0, scaleY: 0 }}
                                        style={{ originY: 0 }}
                                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="relative mt-2 w-full max-w-2xl flex flex-col gap-0.5">
                                            {(() => {
                                                const blocks = parseThoughtText(thoughtText, t);
                                                return blocks.map((block, idx) => (
                                                    <ThoughtBlock 
                                                        key={idx} 
                                                        block={block} 
                                                        initiallyOpen={idx === blocks.length - 1} // Keep the last one open by default
                                                    />
                                                ));
                                            })()}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AIStreamingIndicator;
