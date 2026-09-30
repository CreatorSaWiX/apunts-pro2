"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Play, Pause, Check } from 'lucide-react';

interface QueueStep {
    id: number;
    queue: number[][];
    v1: number[] | null;
    v2: number[] | null;
    merged: number[] | null;
    isFinal: boolean;
}

const STEPS: QueueStep[] = [
    {
        id: 0,
        queue: [[7], [8], [2], [4], [6], [1], [3], [5]],
        v1: null,
        v2: null,
        merged: null,
        isFinal: false,
    },
    {
        id: 1,
        v1: [7],
        v2: [8],
        merged: [7, 8],
        queue: [[2], [4], [6], [1], [3], [5], [7, 8]],
        isFinal: false,
    },
    {
        id: 2,
        v1: [2],
        v2: [4],
        merged: [2, 4],
        queue: [[6], [1], [3], [5], [7, 8], [2, 4]],
        isFinal: false,
    },
    {
        id: 3,
        v1: [6],
        v2: [1],
        merged: [1, 6],
        queue: [[3], [5], [7, 8], [2, 4], [1, 6]],
        isFinal: false,
    },
    {
        id: 4,
        v1: [3],
        v2: [5],
        merged: [3, 5],
        queue: [[7, 8], [2, 4], [1, 6], [3, 5]],
        isFinal: false,
    },
    {
        id: 5,
        v1: [7, 8],
        v2: [2, 4],
        merged: [2, 4, 7, 8],
        queue: [[1, 6], [3, 5], [2, 4, 7, 8]],
        isFinal: false,
    },
    {
        id: 6,
        v1: [1, 6],
        v2: [3, 5],
        merged: [1, 3, 5, 6],
        queue: [[2, 4, 7, 8], [1, 3, 5, 6]],
        isFinal: false,
    },
    {
        id: 7,
        v1: [2, 4, 7, 8],
        v2: [1, 3, 5, 6],
        merged: [1, 2, 3, 4, 5, 6, 7, 8],
        queue: [[1, 2, 3, 4, 5, 6, 7, 8]],
        isFinal: false,
    },
    {
        id: 8,
        v1: null,
        v2: null,
        merged: [1, 2, 3, 4, 5, 6, 7, 8],
        queue: [],
        isFinal: true,
    },
];

export default function MergeQueueVisualizer() {
    const [stepIdx, setStepIdx] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const step = STEPS[stepIdx];

    useEffect(() => {
        if (!isPlaying) return;

        const interval = setInterval(() => {
            setStepIdx(prev => {
                if (prev >= STEPS.length - 1) {
                    setIsPlaying(false);
                    return prev;
                }
                return prev + 1;
            });
        }, 1500);

        return () => clearInterval(interval);
    }, [isPlaying]);

    const prevStep = () => {
        setIsPlaying(false);
        setStepIdx(prev => Math.max(0, prev - 1));
    };

    const nextStep = () => {
        setIsPlaying(false);
        setStepIdx(prev => Math.min(STEPS.length - 1, prev + 1));
    };

    const reset = () => {
        setIsPlaying(false);
        setStepIdx(0);
    };

    const togglePlay = () => {
        if (stepIdx >= STEPS.length - 1) {
            setStepIdx(0);
            setIsPlaying(true);
        } else {
            setIsPlaying(prev => !prev);
        }
    };

    const getVectorStyle = (len: number, isNew: boolean = false) => {
        if (isNew) {
            return 'bg-emerald-950/60 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.3)]';
        }
        if (len === 1) {
            return 'bg-slate-900/60 border-slate-700 text-slate-300';
        }
        if (len === 2) {
            return 'bg-amber-950/30 border-amber-500/40 text-amber-200';
        }
        if (len === 4) {
            return 'bg-sky-950/30 border-sky-500/40 text-sky-200';
        }
        return 'bg-emerald-950/40 border-emerald-400 text-emerald-200';
    };

    return (
        <div className="w-full flex flex-col items-center gap-5 my-8 font-mono select-none not-prose px-2">

            {/* CONTROLS DE REPRODUCCIÓ MINIMALISTES */}
            <div className="flex items-center gap-3">
                {/* Indicador de mida de cua */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/60 border border-white/10 text-xs">
                    <span className="text-slate-500">cua Q:</span>
                    <span className="text-sky-300 font-bold">|Q| = {step.queue.length}</span>
                </div>

                {/* Botons */}
                <div className="flex items-center gap-1.5">
                    <button
                        type="button"
                        onClick={togglePlay}
                        title={isPlaying ? "Pausar" : "Reproduir"}
                        className={`p-1.5 rounded-lg border transition ${
                            isPlaying
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                : 'bg-slate-900/40 hover:bg-slate-800 border-white/5 text-slate-300'
                        }`}
                    >
                        {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                    </button>
                    <button
                        type="button"
                        onClick={prevStep}
                        disabled={stepIdx === 0}
                        title="Pas anterior"
                        className="p-1.5 rounded-lg bg-slate-900/40 hover:bg-slate-800 border border-white/5 text-slate-400 hover:text-slate-200 transition disabled:opacity-30 disabled:pointer-events-none"
                    >
                        <ArrowLeft size={14} />
                    </button>
                    <button
                        type="button"
                        onClick={nextStep}
                        disabled={stepIdx === STEPS.length - 1}
                        title="Següent pas"
                        className="p-1.5 rounded-lg bg-slate-900/40 hover:bg-slate-800 border border-white/5 text-slate-400 hover:text-slate-200 transition disabled:opacity-30 disabled:pointer-events-none"
                    >
                        <ArrowRight size={14} />
                    </button>
                    <button
                        type="button"
                        onClick={reset}
                        title="Reiniciar"
                        className="p-1.5 rounded-lg bg-slate-900/40 hover:bg-slate-800 border border-white/5 text-slate-400 hover:text-slate-200 transition"
                    >
                        <RotateCcw size={14} />
                    </button>
                </div>
            </div>

            {/* DIBUIX DE LA CUA Q (PIPELINE FIFO) */}
            <div className="w-full max-w-xl flex flex-col items-center gap-2">
                {/* Capçalera FIFO: Front -> Back */}
                <div className="w-full flex items-center justify-between text-[11px] text-slate-500 px-2 font-mono">
                    <span className="text-amber-400 font-bold">
                        &lt;- desencua(Q) [Front]
                    </span>
                    <span className="text-emerald-400 font-bold">
                        [Back] &lt;- encua(Q, ...)
                    </span>
                </div>

                {/* Pista de la Cua */}
                <div className="w-full min-h-[64px] p-2 rounded-2xl border border-white/5 bg-slate-950/20 flex items-center justify-start gap-2 overflow-x-auto">
                    {step.queue.length === 0 ? (
                        <div className="w-full flex items-center justify-center text-xs text-slate-500 py-2 italic">
                            cua buida: vector final retornat
                        </div>
                    ) : (
                        step.queue.map((vec, idx) => {
                            const isNewest = Boolean(step.merged && idx === step.queue.length - 1 && stepIdx !== 0);

                            return (
                                <div
                                    key={`q-item-${idx}-${vec.join('-')}`}
                                    className="flex flex-col items-center gap-0.5 flex-shrink-0"
                                >
                                    <div
                                        className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all duration-300 ${getVectorStyle(
                                            vec.length,
                                            isNewest
                                        )}`}
                                    >
                                        {vec.map((val, vIdx) => (
                                            <span
                                                key={vIdx}
                                                className="font-bold text-xs sm:text-sm font-mono"
                                            >
                                                {val}
                                            </span>
                                        ))}
                                    </div>
                                    <span className="text-[9px] text-slate-600 font-mono">Q[{idx}]</span>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* ZONA DE FUSIÓ ACTIVA: desencua(Q) + desencua(Q) -> merge -> encua(Q) */}
            <div className="w-full max-w-xl flex flex-col items-center">
                {step.v1 && step.v2 && step.merged ? (
                    <div className="flex flex-col items-center gap-2 p-3 rounded-2xl border border-white/5 bg-slate-900/20">
                        {/* 1. Els dos vectors extrets */}
                        <div className="flex items-center justify-center gap-3">
                            {/* v1 */}
                            <div className="flex items-center gap-1 bg-amber-950/30 px-2.5 py-1 rounded-xl border border-amber-500/40 text-amber-200 text-xs font-bold">
                                {step.v1.map((val, idx) => (
                                    <span key={idx}>{val}</span>
                                ))}
                            </div>

                            <span className="text-slate-500 font-bold text-xs">+</span>

                            {/* v2 */}
                            <div className="flex items-center gap-1 bg-sky-950/30 px-2.5 py-1 rounded-xl border border-sky-500/40 text-sky-200 text-xs font-bold">
                                {step.v2.map((val, idx) => (
                                    <span key={idx}>{val}</span>
                                ))}
                            </div>

                            <span className="text-slate-500 font-bold text-xs">-&gt;</span>

                            {/* Resultat de merge() */}
                            <div className="flex items-center gap-1 bg-emerald-950/50 px-3 py-1 rounded-xl border-2 border-emerald-500/80 text-emerald-200 text-xs font-bold shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                                {step.merged.map((val, idx) => (
                                    <span key={idx}>{val}</span>
                                ))}
                            </div>
                        </div>

                        {/* Indicador de reingrés */}
                        <span className="text-[10px] text-emerald-400 font-mono font-bold">
                            encua(Q, [{step.merged.join(', ')}])
                        </span>
                    </div>
                ) : step.isFinal && step.merged ? (
                    /* Estat complet: retorn del vector */
                    <div className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                            <Check size={14} className="text-emerald-400" />
                            <span>vector final ordenat</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            {step.merged.map((val, idx) => (
                                <div
                                    key={idx}
                                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-950/80 border border-emerald-400 text-emerald-200 flex items-center justify-center font-bold text-sm sm:text-base font-mono"
                                >
                                    {val}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Estat inicial */
                    <div className="text-xs text-slate-500 italic py-2 font-mono">
                        fes clic a play per veure les fusions consecutives a la cua
                    </div>
                )}
            </div>

        </div>
    );
}
