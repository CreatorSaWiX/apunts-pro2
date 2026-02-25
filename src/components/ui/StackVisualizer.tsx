"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const MAX_CAPACITY = 5;

export default function StackVisualizer() {
    const [stack, setStack] = useState<number[]>([]);
    const [inputValue, setInputValue] = useState<string>('20');
    const [lastAction, setLastAction] = useState<string>('');

    const handlePush = () => {
        if (!inputValue) return;
        const val = parseInt(inputValue, 10);
        if (isNaN(val)) return;
        if (stack.length >= MAX_CAPACITY) {
            setLastAction("Error: Pila plena (Overflow)");
            return;
        }
        setStack([...stack, val]);
        setInputValue(Math.floor(Math.random() * 100).toString());
        setLastAction(`S.push(${val})`);
    };

    const handlePop = () => {
        if (stack.length === 0) {
            setLastAction("Error: Pila buida (Underflow)");
            return;
        }
        const popped = stack[stack.length - 1];
        setStack(stack.slice(0, -1));
        setLastAction(`S.pop() -> S'extreu el ${popped}`);
    };

    // Creem els slots per poder dibuixar les zones buides de la pila i posicionar els elements.
    // L'índex 0 és el de dalt de tot, l'índex MAX_CAPACITY - 1 és la base.
    const slots = Array.from({ length: MAX_CAPACITY }).map((_, i) => i);

    return (
        <div className="w-full flex flex-col md:flex-row items-center md:items-end justify-center gap-16 my-16 font-mono select-none not-prose">

            {/* STACK VISUAL */}
            <div className="relative flex flex-col items-center">
                <div className="relative w-48">
                    {/* Background slots (Empty dashes) */}
                    <div className="flex flex-col gap-2 w-full">
                        {slots.map((i) => (
                            <div key={`empty-${i}`} className="w-full h-12 border-2 border-dashed border-slate-800/80 rounded-xl" />
                        ))}
                    </div>

                    {/* Stack Elements (dibuixats de baix cap amunt) */}
                    <div className="absolute inset-0 flex flex-col-reverse gap-2 z-10 pointer-events-none">
                        <AnimatePresence mode="popLayout">
                            {stack.map((item, i) => {
                                const isTop = i === stack.length - 1;
                                return (
                                    <motion.div
                                        key={`item-${i}-${item}`}
                                        layout
                                        initial={{ opacity: 0, x: 40, scale: 0.95 }}
                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                        exit={{ opacity: 0, x: -40, scale: 0.95, transition: { duration: 0.2 } }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 25,
                                            mass: 1
                                        }}
                                        className="w-full shrink-0 h-12 bg-[#0a0d14] border border-sky-800/80 rounded-xl flex items-center justify-center text-sky-400 font-bold text-lg shadow-[0_0_15px_rgba(2,132,199,0.15)] relative pointer-events-auto"
                                    >
                                        {item}

                                        {/* Apuntador TOP independent i suavitzat */}
                                        {isTop && (
                                            <motion.div
                                                layoutId="top-indicator"
                                                initial={{ opacity: 0, x: -15 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -15 }}
                                                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                                className="absolute -left-20 top-0 bottom-0 flex items-center justify-center gap-2 text-slate-400 text-[10px] tracking-widest font-bold z-20"
                                            >
                                                TOP <span>→</span>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>
                {/* Linia de base metàl·lica */}
                <div className="w-56 h-1 bg-slate-800 rounded-full mt-2 shadow-[0_4px_10px_rgba(0,0,0,1)]"></div>
            </div>

            {/* COMMAND PANEL MINIMALISTA */}
            <div className="flex flex-col gap-6 w-full max-w-xs">
                <div className="space-y-3">
                    <div className="flex gap-2 h-10">
                        <input
                            type="number"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handlePush()}
                            placeholder="Val"
                            className="w-16 bg-slate-900/40 border border-slate-800 rounded-lg px-2 text-center text-sky-200 focus:outline-none focus:border-sky-500/50 transition-colors"
                        />
                        <button
                            onClick={handlePush}
                            className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-sm tracking-wide rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] border border-emerald-500/20"
                        >
                            <Plus size={16} /> push( )
                        </button>
                    </div>

                    <button
                        onClick={handlePop}
                        className="w-full h-10 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-sm tracking-wide rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] border border-rose-500/20"
                    >
                        <Minus size={16} /> pop( )
                    </button>
                </div>

                <div className="h-4 text-center text-[11px]">
                    {lastAction ? (
                        <span className={`${lastAction.startsWith('Error') ? 'text-rose-400/80 font-bold' : 'text-slate-500'}`}>
                            {lastAction}
                        </span>
                    ) : (
                        <span className="text-slate-800/80">Esperant ordres...</span>
                    )}
                </div>
            </div>

        </div>
    );
}
