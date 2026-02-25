"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const MAX_CAPACITY = 5;

export default function QueueVisualizer() {
    const [queue, setQueue] = useState<number[]>([]);
    const [inputValue, setInputValue] = useState<string>('20');
    const [lastAction, setLastAction] = useState<string>('');

    const handlePush = () => {
        if (!inputValue) return;
        const val = parseInt(inputValue, 10);
        if (isNaN(val)) return;
        if (queue.length >= MAX_CAPACITY) {
            setLastAction("Error: Cua plena (Overflow)");
            return;
        }
        setQueue([...queue, val]);
        setInputValue(Math.floor(Math.random() * 100).toString());
        setLastAction(`Q.push(${val})`);
    };

    const handlePop = () => {
        if (queue.length === 0) {
            setLastAction("Error: Cua buida (Underflow)");
            return;
        }
        const popped = queue[0]; // Cua: Surt el primer Element davanter!
        setQueue(queue.slice(1));
        setLastAction(`Q.pop() -> S'extreu el ${popped}`);
    };

    // Creem els slots buits per la línia base de fons.
    const slots = Array.from({ length: MAX_CAPACITY }).map((_, i) => i);

    return (
        <div className="w-full flex flex-col items-center justify-center gap-10 my-16 font-mono select-none not-prose">

            {/* QUEUE VISUAL HORITZONTAL */}
            <div className="relative w-fit mx-auto mt-6 mb-8 flex flex-col items-center">

                {/* Apuntador FRONT estàtic (Només a l'inici) */}
                <AnimatePresence>
                    {queue.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute -top-6 left-0 w-16 flex justify-center items-center gap-1 text-slate-400 text-[10px] tracking-widest font-bold z-20 whitespace-nowrap"
                        >
                            <span className="rotate-90">→</span> FRONT
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Apuntador BACK mòbil horitzontal (Sense animacions a Y, només translació X layout) */}
                <AnimatePresence>
                    {queue.length > 0 && (
                        <motion.div
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                            className="absolute -bottom-6 flex justify-center items-center gap-1 text-slate-400 text-[10px] tracking-widest font-bold z-20 whitespace-nowrap w-16"
                            style={{
                                left: `${(queue.length - 1) * 4.5}rem` // (w-16 = 4rem) + (gap-2 = 0.5rem)
                            }}
                        >
                            <span className="-rotate-90">→</span> BACK
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* El taulell d'slots de fons alineat */}
                <div className="flex flex-row gap-2 relative z-0">
                    {slots.map((i) => (
                        <div key={`empty-${i}`} className="w-16 h-12 shrink-0 border-2 border-dashed border-slate-800/80 rounded-xl" />
                    ))}
                </div>

                {/* Els blocs de dades reals (FIFO) */}
                <div className="absolute inset-0 flex flex-row gap-2 z-10 pointer-events-none">
                    <AnimatePresence mode="popLayout">
                        {queue.map((item, i) => (
                            <motion.div
                                key={`item-${item}-${i}`}
                                layout
                                initial={{ opacity: 0, x: 40, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: -40, scale: 0.8, filter: "blur(4px)" }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 25,
                                    mass: 1
                                }}
                                className="w-16 h-12 shrink-0 bg-[#0a0d14] border border-fuchsia-800/80 rounded-xl flex items-center justify-center text-fuchsia-400 font-bold text-lg shadow-[0_0_15px_rgba(192,38,211,0.15)] pointer-events-auto"
                            >
                                {item}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* COMMAND PANEL MINIMALISTA */}
            <div className="flex flex-row flex-wrap justify-center gap-6 w-full max-w-lg mt-4">
                <div className="flex items-center gap-3">
                    <input
                        type="number"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handlePush()}
                        placeholder="Val"
                        className="w-16 h-10 bg-slate-900/40 border border-slate-800 rounded-lg px-2 text-center text-fuchsia-200 focus:outline-none focus:border-fuchsia-500/50 transition-colors"
                    />
                    <button
                        onClick={handlePush}
                        className="h-10 px-4 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 text-fuchsia-400 font-bold text-sm tracking-wide rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] border border-fuchsia-500/20"
                    >
                        <Plus size={16} /> push( )
                    </button>

                    <button
                        onClick={handlePop}
                        className="h-10 px-4 ml-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-sm tracking-wide rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] border border-rose-500/20"
                    >
                        <Minus size={16} /> pop( )
                    </button>
                </div>

                <div className="w-full text-center text-[11px] h-4">
                    {lastAction ? (
                        <span className={`${lastAction.startsWith('Error') ? 'text-rose-400/80 font-bold' : 'text-slate-500'}`}>
                            {lastAction}
                        </span>
                    ) : (
                        <span className="text-slate-800/80">Esperant ordres per la cua...</span>
                    )}
                </div>
            </div>

        </div>
    );
}
