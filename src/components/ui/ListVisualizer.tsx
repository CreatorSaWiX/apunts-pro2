"use client";

import { useState } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { Trash2, ArrowLeft, ArrowRight, MousePointer2 } from 'lucide-react';

interface Node {
    id: string;
    value: number;
}

export default function ListVisualizer() {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [iteratorPos, setIteratorPos] = useState<number>(-1); // -1 is begin (iteminf), 0 to size-1 real nodes, size is itemsup (end)
    const [lastAction, setLastAction] = useState<string>('');

    const generateId = () => Math.random().toString(36).substr(2, 9);

    const handlePushBack = () => {
        const newNode = { id: generateId(), value: Math.floor(Math.random() * 99) + 1 };
        setNodes(prev => [...prev, newNode]);
        setLastAction(`push_back(${newNode.value})`);
    };

    const handlePushFront = () => {
        const newNode = { id: generateId(), value: Math.floor(Math.random() * 99) + 1 };
        setNodes(prev => [newNode, ...prev]);
        setLastAction(`push_front(${newNode.value})`);
    };

    const handleInsert = () => {
        const newNode = { id: generateId(), value: Math.floor(Math.random() * 99) + 1 };
        const newNodes = [...nodes];
        // Insert before iterator position. iteratorPos -1 is iteminf (so insert at 0), size is itemsup (insert at end)
        const insertIdx = iteratorPos === -1 ? 0 : (iteratorPos === nodes.length ? nodes.length : iteratorPos);
        newNodes.splice(insertIdx, 0, newNode);
        setNodes(newNodes);
        setLastAction(`insert(it, ${newNode.value})`);
    };

    const handleErase = () => {
        if (nodes.length === 0 || iteratorPos < 0 || iteratorPos >= nodes.length) return;
        const newNodes = [...nodes];
        newNodes.splice(iteratorPos, 0); // No, this doesn't do anything.
        const filtered = nodes.filter((_, i) => i !== iteratorPos);
        setNodes(filtered);
        setLastAction(`erase(it)`);
    };

    const moveNext = () => {
        if (iteratorPos < nodes.length) {
            setIteratorPos(prev => prev + 1);
            setLastAction('it++');
        }
    };

    const movePrev = () => {
        if (iteratorPos > -1) {
            setIteratorPos(prev => prev - 1);
            setLastAction('--it');
        }
    };

    return (
        <div className="w-full flex flex-col items-center justify-center gap-12 my-16 font-mono select-none not-prose px-4">
            
            {/* Visual List */}
            <div className="relative flex flex-row flex-wrap items-center justify-center gap-y-16 gap-x-0 w-full max-w-4xl">
                
                {/* iteminf SENTINEL */}
                <SentinelNode label="iteminf" isTarget={iteratorPos === -1} />

                {/* REAL NODES */}
                <AnimatePresence mode="popLayout">
                    {nodes.map((node, i) => (
                        <div key={node.id} className="flex items-center">
                            <PointerLine />
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0, y: -20 }}
                                className={`group relative w-16 h-16 bg-[#0a0d14] border-2 rounded-2xl flex flex-col items-center justify-center transition-colors duration-300
                                    ${iteratorPos === i ? 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'border-slate-800'}`}
                            >
                                <span className="text-blue-400 font-bold text-xl">{node.value}</span>
                                <div className="absolute -bottom-6 text-[9px] text-slate-600">node[{i}]</div>
                                
                                {iteratorPos === i && (
                                    <motion.div 
                                        layoutId="iterator-pointer"
                                        className="absolute -top-10 text-blue-500 flex flex-col items-center"
                                    >
                                        <MousePointer2 size={20} fill="currentColor" />
                                        <span className="text-[10px] font-bold mt-1">it</span>
                                    </motion.div>
                                )}
                            </motion.div>
                        </div>
                    ))}
                </AnimatePresence>

                {/* itemsup SENTINEL */}
                <div className="flex items-center">
                    <PointerLine />
                    <SentinelNode label="itemsup" isTarget={iteratorPos === nodes.length} />
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-6 w-full max-w-2xl">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    {/* Position Controls */}
                    <div className="flex gap-2 p-1 bg-slate-900/50 rounded-xl border border-slate-800/50">
                        <button type="button" onClick={movePrev} disabled={iteratorPos <= -1} className="flex-1 h-10 hover:bg-slate-800 disabled:opacity-20 rounded-lg flex items-center justify-center transition-all">
                            <ArrowLeft size={18} />
                        </button>
                        <div className="flex-[2] flex items-center justify-center text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                            Iterador
                        </div>
                        <button type="button" onClick={moveNext} disabled={iteratorPos >= nodes.length} className="flex-1 h-10 hover:bg-slate-800 disabled:opacity-20 rounded-lg flex items-center justify-center transition-all">
                            <ArrowRight size={18} />
                        </button>
                    </div>

                    {/* Standard Ops */}
                    <div className="flex gap-2">
                        <button type="button" onClick={handlePushFront} className="flex-1 h-10 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-xl border border-emerald-500/20 transition-all">
                            push_front()
                        </button>
                        <button type="button" onClick={handlePushBack} className="flex-1 h-10 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-xl border border-emerald-500/20 transition-all">
                            push_back()
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    {/* Iterator Ops */}
                    <div className="flex gap-2">
                        <button type="button" onClick={handleInsert} className="flex-1 h-10 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-bold rounded-xl border border-blue-500/20 transition-all">
                            insert(it, val)
                        </button>
                        <button type="button" 
                            onClick={handleErase} 
                            disabled={iteratorPos < 0 || iteratorPos >= nodes.length}
                            className="flex-1 h-10 bg-rose-500/10 hover:bg-rose-500/20 disabled:opacity-20 text-rose-400 text-xs font-bold rounded-xl border border-rose-500/20 transition-all"
                        >
                            erase(it)
                        </button>
                    </div>

                    {/* Utils */}
                    <button type="button" onClick={() => {setNodes([]); setIteratorPos(-1); setLastAction('clear()');}} className="h-10 bg-slate-800/30 hover:bg-slate-800/50 text-slate-500 rounded-xl border border-slate-800/50 flex items-center justify-center gap-2 text-xs font-bold tracking-widest">
                        <Trash2 size={16} /> RESET
                    </button>
                </div>

                {/* Log */}
                <div className="h-4 text-center text-[10px] tracking-widest text-slate-600 uppercase font-bold">
                    {lastAction ? (
                        <motion.span key={lastAction} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
                            $ {lastAction}
                        </motion.span>
                    ) : (
                        <span className="opacity-20 italic">list.ops()</span>
                    )}
                </div>
            </div>
        </div>
    );
}

function SentinelNode({ label, isTarget }: { label: string; isTarget: boolean }) {
    return (
        <div className={`relative w-14 h-14 border-2 rounded-xl flex flex-col items-center justify-center transition-all duration-300
            ${isTarget ? 'border-blue-500 bg-blue-500/5' : 'border-slate-800/50 bg-slate-900/20'}`}
        >
            <span className="text-[9px] text-slate-500 uppercase font-black">{label}</span>
            <div className="absolute -bottom-6 text-[8px] text-slate-700 tracking-tighter italic">SENTINEL</div>
            
            {isTarget && (
                <motion.div 
                    layoutId="iterator-pointer"
                    className="absolute -top-10 text-blue-500 flex flex-col items-center"
                >
                    <MousePointer2 size={18} fill="currentColor" />
                    <span className="text-[10px] font-bold mt-1">it</span>
                </motion.div>
            )}
        </div>
    );
}

function PointerLine() {
    return (
        <div className="w-8 flex flex-col items-center justify-center gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
            <div className="h-px w-full bg-slate-400 relative">
                <div className="absolute -right-1 -top-[3px] border-y-[4px] border-y-transparent border-l-[6px] border-l-slate-400" />
            </div>
            <div className="h-px w-full bg-slate-400 relative">
                <div className="absolute -left-1 -top-[3px] border-y-[4px] border-y-transparent border-r-[6px] border-r-slate-400" />
            </div>
        </div>
    );
}
