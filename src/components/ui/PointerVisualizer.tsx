"use client";

import { useState } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw, ArrowRight } from 'lucide-react';

type State = 'start' | 'bridged' | 'deleted';
const steps: State[] = ['start', 'bridged', 'deleted'];

export default function PointerVisualizer() {
    const [stepIdx, setStepIdx] = useState(0);
    const state = steps[stepIdx];

    const next = () => setStepIdx(prev => Math.min(prev + 1, steps.length - 1));
    const prev = () => setStepIdx(prev => Math.max(prev - 1, 0));
    const reset = () => setStepIdx(0);

    return (
        <div className="w-full flex flex-col items-center justify-center gap-10 my-16 font-mono select-none not-prose">
            
            {/* Visualització Nodes */}
            <div className="flex items-center justify-center h-24 gap-4 md:gap-12 relative">
                
                <Node label="ant" value="A" />

                <Pointer 
                    to={state === 'start' ? 'next' : 'far'} 
                    active={state !== 'start'}
                />

                <AnimatePresence mode="popLayout">
                    {state !== 'deleted' && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
                            className="flex items-center gap-4 md:gap-12"
                        >
                            <Node label="p" value="B" highlight={state === 'start'} />
                            <Pointer to="next" />
                        </motion.div>
                    )}
                </AnimatePresence>

                <Node label="seg" value="C" highlight={state !== 'start'} />
            </div>

            {/* Controls de Navegació Ultra-Minimalistes */}
            <div className="flex flex-col items-center gap-6 w-full max-w-xs">
                
                {/* Línia de Codi actual */}
                <div className="flex items-center gap-3 text-[11px] min-h-[1.5rem]">
                    <span className="text-slate-700 font-black">$</span>
                    <motion.span 
                        key={state}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-slate-400 font-bold"
                    >
                        {state === 'start' && "remove_middle_node();"}
                        {state === 'bridged' && "ant->next = p->next;"}
                        {state === 'deleted' && "delete p;"}
                    </motion.span>
                </div>

                {/* Nav Arrows */}
                <div className="flex items-center gap-8">
                    <button type="button" 
                        onClick={prev}
                        disabled={stepIdx === 0}
                        className="p-3 border border-slate-800 rounded-full hover:border-slate-500 hover:text-slate-300 transition-all disabled:opacity-5 text-slate-600"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <div className="flex gap-1.5">
                        {steps.map((_, i) => (
                            <div 
                                key={i} 
                                className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${i === stepIdx ? 'bg-emerald-500 w-4' : 'bg-slate-800'}`} 
                            />
                        ))}
                    </div>

                    <button type="button" 
                        onClick={next}
                        disabled={stepIdx === steps.length - 1}
                        className="p-3 border border-slate-800 rounded-full hover:border-emerald-500 hover:text-emerald-500 transition-all disabled:opacity-5 text-slate-600"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                {stepIdx > 0 && (
                    <button type="button" 
                        onClick={reset}
                        className="flex items-center gap-2 text-[9px] text-slate-700 hover:text-slate-400 transition-colors uppercase font-black tracking-[0.3em]"
                    >
                        <RotateCcw size={10} /> Reset
                    </button>
                )}
            </div>
        </div>
    );
}

function Node({ label, value, highlight }: any) {
    return (
        <div className="flex flex-col items-center gap-2">
            <span className="text-[9px] text-slate-700 font-black uppercase tracking-widest">{label}</span>
            <motion.div 
                animate={{ 
                    borderColor: highlight ? '#10b981' : '#1e293b',
                    color: highlight ? '#10b981' : '#475569',
                    scale: highlight ? 1.05 : 1
                }}
                className="w-12 h-12 border-2 rounded-2xl flex items-center justify-center font-bold text-lg bg-transparent transition-all duration-500"
            >
                {value}
            </motion.div>
        </div>
    );
}

function Pointer({ to, active }: { to: 'next' | 'far', active?: boolean }) {
    return (
        <motion.div layout className="relative h-px flex items-center justify-end" style={{ width: to === 'far' ? 120 : 48 }}>
            <motion.div 
                layout
                animate={{ 
                    backgroundColor: active ? '#10b981' : '#1e293b'
                }}
                className="h-[1.5px] w-full"
            />
            <motion.div 
                layout
                animate={{ color: active ? '#10b981' : '#1e293b' }}
                className="absolute right-[-6px] flex items-center"
            >
                <ArrowRight size={14} strokeWidth={2.5} />
            </motion.div>
        </motion.div>
    );
}
