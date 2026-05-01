"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Trash2 } from 'lucide-react';

const MAX_VIZ_CAPACITY = 1024; // Un límit tècnic molt alt, només per evitar bloquejos reals de memòria.

export default function VectorVisualizer() {
    const [elements, setElements] = useState<number[]>([]);
    const [capacity, setCapacity] = useState<number>(0);
    const [isReallocating, setIsReallocating] = useState(false);
    const [lastAction, setLastAction] = useState<string>('');

    const reallocate = async (newCap: number) => {
        setIsReallocating(true);
        setLastAction(`reallocate_(${newCap})...`);
        await new Promise(resolve => setTimeout(resolve, 600));
        setCapacity(newCap);
        setIsReallocating(false);
    };

    const handlePush = async () => {
        if (isReallocating) return;

        let currentCap = capacity;
        if (elements.length === capacity) {
            const newCap = capacity === 0 ? 1 : Math.min(capacity * 2, MAX_VIZ_CAPACITY);
            await reallocate(newCap);
            currentCap = newCap;
        }
        
        const val = Math.floor(Math.random() * 99) + 1;
        setElements(prev => [...prev, val]);
        setLastAction(`push_back(${val})`);
    };

    const handlePop = async () => {
        if (isReallocating || elements.length === 0) return;
        const newElements = elements.slice(0, -1);
        setElements(newElements);
        setLastAction(`pop_back()`);
        if (newElements.length > 0 && newElements.length === capacity / 4) {
            await reallocate(capacity / 2);
        }
    };

    const handleClear = () => {
        setElements([]);
        setCapacity(0);
        setLastAction('clear()');
    };

    return (
        <div className="w-full flex flex-col items-center justify-center gap-10 my-16 font-mono select-none not-prose px-4">
            
            {/* Visual Array */}
            <div className="relative flex flex-col items-center w-full max-w-2xl">
                {/* Stats subtle labels */}
                <div className="absolute -top-8 left-0 right-0 flex justify-between px-2 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                    <span>Size: {elements.length}</span>
                    <span>Capacity: {capacity}</span>
                </div>

                <div className="flex flex-row flex-wrap gap-2 justify-center relative z-0 min-h-[48px] items-center w-full">
                    <AnimatePresence mode="popLayout">
                        {/* Render slots based on capacity */}
                        {Array.from({ length: Math.max(capacity, 4) }).map((_, i) => {
                            const isOccupied = i < elements.length;
                            const isSlotVisible = i < capacity;

                            return (
                                <div 
                                    key={`slot-${i}`} 
                                    className={`w-12 h-12 shrink-0 border-2 rounded-xl flex items-center justify-center relative transition-all duration-500 
                                        ${isSlotVisible ? 'border-dashed border-slate-800' : 'border-transparent'}`} 
                                >
                                    {isOccupied && (
                                        <motion.div
                                            key={`item-${i}-${elements[i]}`}
                                            layout
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ 
                                                opacity: 1, 
                                                scale: 1,
                                                borderColor: isReallocating ? "rgba(234, 179, 8, 0.4)" : "rgba(59, 130, 246, 0.5)"
                                            }}
                                            exit={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                            className="absolute inset-0 bg-[#0a0d14] border border-blue-800/80 rounded-xl flex items-center justify-center text-blue-400 font-bold text-lg shadow-[0_0_15px_rgba(59,130,246,0.15)] z-10"
                                        >
                                            {elements[i]}
                                            {isReallocating && (
                                                <motion.div 
                                                    animate={{ opacity: [0, 1, 0] }}
                                                    transition={{ repeat: Infinity, duration: 0.8 }}
                                                    className="absolute inset-0 bg-yellow-400/5 rounded-xl"
                                                />
                                            )}
                                        </motion.div>
                                    )}
                                </div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-6 w-full max-w-sm">
                <div className="flex items-center gap-3 w-full">
                    <button
                        onClick={handlePush}
                        disabled={isReallocating}
                        className="flex-1 h-10 bg-blue-500/10 hover:bg-blue-500/20 disabled:opacity-30 text-blue-400 font-bold text-sm rounded-lg border border-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                        <Plus size={16} /> push_back()
                    </button>
                    
                    <button
                        onClick={handlePop}
                        disabled={isReallocating || elements.length === 0}
                        className="flex-1 h-10 bg-rose-500/10 hover:bg-rose-500/20 disabled:opacity-30 text-rose-400 font-bold text-sm rounded-lg border border-rose-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                        <Minus size={16} /> pop_back()
                    </button>

                    <button
                        onClick={handleClear}
                        className="w-10 h-10 bg-slate-800/30 hover:bg-slate-800/50 text-slate-500 rounded-lg flex items-center justify-center transition-all border border-slate-800/50"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>

                {/* Minimalist Console Log */}
                <div className="h-4 text-center text-[10px] tracking-widest text-slate-600 uppercase font-bold">
                    {lastAction ? (
                        <motion.span 
                            key={lastAction}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {lastAction}
                        </motion.span>
                    ) : (
                        <span className="opacity-20 italic">v.vector_ops()</span>
                    )}
                </div>
            </div>
        </div>
    );
}
