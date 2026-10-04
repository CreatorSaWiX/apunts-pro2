"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Play, Pause, Check } from 'lucide-react';

interface QueueStep {
    id: number;
    phase: 'dequeue' | 'merge' | 'enqueue' | 'final';
    queue: number[][];
    v1: number[] | null;
    v2: number[] | null;
    merged: number[] | null;
    actionText: string;
}

const STEPS: QueueStep[] = [
    {
        id: 0,
        phase: 'enqueue',
        queue: [[7], [8], [2], [4], [6], [1], [3], [5]],
        v1: null,
        v2: null,
        merged: null,
        actionText: "Inicialització: cada element s'encua com a vector unitari (|Q| = 8)",
    },
    // Ronda 1: Parella 1 ([7] i [8])
    {
        id: 1,
        phase: 'dequeue',
        queue: [[2], [4], [6], [1], [3], [5]],
        v1: [7],
        v2: [8],
        merged: null,
        actionText: "desencua(Q) x2: extreiem els dos primers vectors v1 = [7] i v2 = [8]",
    },
    {
        id: 2,
        phase: 'merge',
        queue: [[2], [4], [6], [1], [3], [5]],
        v1: [7],
        v2: [8],
        merged: [7, 8],
        actionText: "merge(v1, v2): fusió ordenada de [7] i [8] -> [7, 8]",
    },
    {
        id: 3,
        phase: 'enqueue',
        queue: [[2], [4], [6], [1], [3], [5], [7, 8]],
        v1: null,
        v2: null,
        merged: [7, 8],
        actionText: "encua(Q, [7, 8]): el nou vector s'insereix al final de la cua",
    },
    // Ronda 1: Parella 2 ([2] i [4])
    {
        id: 4,
        phase: 'dequeue',
        queue: [[6], [1], [3], [5], [7, 8]],
        v1: [2],
        v2: [4],
        merged: null,
        actionText: "desencua(Q) x2: extreiem v1 = [2] i v2 = [4]",
    },
    {
        id: 5,
        phase: 'merge',
        queue: [[6], [1], [3], [5], [7, 8]],
        v1: [2],
        v2: [4],
        merged: [2, 4],
        actionText: "merge(v1, v2): fusió ordenada de [2] i [4] -> [2, 4]",
    },
    {
        id: 6,
        phase: 'enqueue',
        queue: [[6], [1], [3], [5], [7, 8], [2, 4]],
        v1: null,
        v2: null,
        merged: [2, 4],
        actionText: "encua(Q, [2, 4]): s'insereix al final de la cua",
    },
    // Ronda 1: Parella 3 ([6] i [1])
    {
        id: 7,
        phase: 'dequeue',
        queue: [[3], [5], [7, 8], [2, 4]],
        v1: [6],
        v2: [1],
        merged: null,
        actionText: "desencua(Q) x2: extreiem v1 = [6] i v2 = [1]",
    },
    {
        id: 8,
        phase: 'merge',
        queue: [[3], [5], [7, 8], [2, 4]],
        v1: [6],
        v2: [1],
        merged: [1, 6],
        actionText: "merge(v1, v2): 1 < 6 -> fusió ordenada en [1, 6]",
    },
    {
        id: 9,
        phase: 'enqueue',
        queue: [[3], [5], [7, 8], [2, 4], [1, 6]],
        v1: null,
        v2: null,
        merged: [1, 6],
        actionText: "encua(Q, [1, 6]): s'insereix al final de la cua",
    },
    // Ronda 1: Parella 4 ([3] i [5])
    {
        id: 10,
        phase: 'dequeue',
        queue: [[7, 8], [2, 4], [1, 6]],
        v1: [3],
        v2: [5],
        merged: null,
        actionText: "desencua(Q) x2: extreiem els dos últims unitaris v1 = [3] i v2 = [5]",
    },
    {
        id: 11,
        phase: 'merge',
        queue: [[7, 8], [2, 4], [1, 6]],
        v1: [3],
        v2: [5],
        merged: [3, 5],
        actionText: "merge(v1, v2): fusió ordenada de [3] i [5] -> [3, 5]",
    },
    {
        id: 12,
        phase: 'enqueue',
        queue: [[7, 8], [2, 4], [1, 6], [3, 5]],
        v1: null,
        v2: null,
        merged: [3, 5],
        actionText: "encua(Q, [3, 5]): ara tots els elements són blocs de mida 2 (|Q| = 4)",
    },
    // Ronda 2: Parella mida 2 ([7, 8] i [2, 4])
    {
        id: 13,
        phase: 'dequeue',
        queue: [[1, 6], [3, 5]],
        v1: [7, 8],
        v2: [2, 4],
        merged: null,
        actionText: "desencua(Q) x2: extreiem v1 = [7, 8] i v2 = [2, 4]",
    },
    {
        id: 14,
        phase: 'merge',
        queue: [[1, 6], [3, 5]],
        v1: [7, 8],
        v2: [2, 4],
        merged: [2, 4, 7, 8],
        actionText: "merge(v1, v2): fusió ordenada de blocs de mida 2 -> [2, 4, 7, 8]",
    },
    {
        id: 15,
        phase: 'enqueue',
        queue: [[1, 6], [3, 5], [2, 4, 7, 8]],
        v1: null,
        v2: null,
        merged: [2, 4, 7, 8],
        actionText: "encua(Q, [2, 4, 7, 8]): bloc de mida 4 inserit a la cua",
    },
    // Ronda 2: Parella mida 2 ([1, 6] i [3, 5])
    {
        id: 16,
        phase: 'dequeue',
        queue: [[2, 4, 7, 8]],
        v1: [1, 6],
        v2: [3, 5],
        merged: null,
        actionText: "desencua(Q) x2: extreiem v1 = [1, 6] i v2 = [3, 5]",
    },
    {
        id: 17,
        phase: 'merge',
        queue: [[2, 4, 7, 8]],
        v1: [1, 6],
        v2: [3, 5],
        merged: [1, 3, 5, 6],
        actionText: "merge(v1, v2): fusió ordenada de blocs de mida 2 -> [1, 3, 5, 6]",
    },
    {
        id: 18,
        phase: 'enqueue',
        queue: [[2, 4, 7, 8], [1, 3, 5, 6]],
        v1: null,
        v2: null,
        merged: [1, 3, 5, 6],
        actionText: "encua(Q, [1, 3, 5, 6]): queden només 2 meitats de mida 4 (|Q| = 2)",
    },
    // Ronda 3: Fusió final de mida 4 ([2, 4, 7, 8] i [1, 3, 5, 6])
    {
        id: 19,
        phase: 'dequeue',
        queue: [],
        v1: [2, 4, 7, 8],
        v2: [1, 3, 5, 6],
        merged: null,
        actionText: "desencua(Q) x2: extreiem les dues meitats finals (cua buida temporalment)",
    },
    {
        id: 20,
        phase: 'merge',
        queue: [],
        v1: [2, 4, 7, 8],
        v2: [1, 3, 5, 6],
        merged: [1, 2, 3, 4, 5, 6, 7, 8],
        actionText: "merge(v1, v2): fusió final ordenada dels dos blocs -> mida 8",
    },
    {
        id: 21,
        phase: 'enqueue',
        queue: [[1, 2, 3, 4, 5, 6, 7, 8]],
        v1: null,
        v2: null,
        merged: [1, 2, 3, 4, 5, 6, 7, 8],
        actionText: "encua(Q, [1..8]): mida(Q) == 1 -> condició del bucle mentre mida(Q) > 1 finalitzada!",
    },
    {
        id: 22,
        phase: 'final',
        queue: [],
        v1: null,
        v2: null,
        merged: [1, 2, 3, 4, 5, 6, 7, 8],
        actionText: "retorna desencua(Q): vector final totalment ordenat sense cap crida recursiva",
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
        }, 1300);

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

    const getVectorColor = (len: number) => {
        if (len === 1) return 'bg-slate-900/80 border-slate-700 text-slate-300';
        if (len === 2) return 'bg-amber-950/40 border-amber-500/50 text-amber-200';
        if (len === 4) return 'bg-indigo-950/40 border-indigo-500/50 text-indigo-200';
        return 'bg-emerald-950/50 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.3)]';
    };

    return (
        <div className="w-full flex flex-col items-center gap-4 my-7 font-mono select-none not-prose px-2 bg-transparent">

            {/* BARRA DE CONTROLS ESTACIONÀRIA I MINIMALISTA */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/60 border border-white/10 text-xs">
                    <span className="text-slate-500">cua Q:</span>
                    <strong className="text-sky-300 font-mono">|Q| = {step.queue.length}</strong>
                </div>

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
                        className="p-1.5 rounded-lg bg-slate-900/40 hover:bg-slate-800 border border-white/5 text-slate-400 hover:text-slate-200 transition ml-1"
                    >
                        <RotateCcw size={14} />
                    </button>
                </div>
            </div>

            {/* DIBUIX VISUAL DE LA CUA FIFO (TUB DE FLUX) */}
            <div className="w-full max-w-xl flex flex-col items-center gap-2">

                {/* Capçalera FIFO: Front -> Back */}
                <div className="w-full flex items-center justify-between text-[11px] px-2 font-mono">
                    <span className="text-amber-400/90 font-bold flex items-center gap-1">
                        <span>←</span>
                        <span>[FRONT / Sortida] desencua(Q)</span>
                    </span>
                    <span className="text-[10px] text-slate-500">
                        pas {stepIdx + 1} de {STEPS.length}
                    </span>
                    <span className="text-emerald-400/90 font-bold flex items-center gap-1">
                        <span>encua(Q) [BACK / Entrada]</span>
                        <span>←</span>
                    </span>
                </div>

                {/* Tub de la Cua FIFO */}
                <div className="w-full min-h-[72px] p-2.5 rounded-2xl border border-white/10 bg-slate-900/40 flex items-center justify-start gap-2 overflow-x-auto">
                    {step.queue.length === 0 ? (
                        <div className="w-full flex items-center justify-center text-xs text-slate-500 py-3 italic">
                            {step.phase === 'final'
                                ? "cua buida: vector final retornat"
                                : "elements extrets cap a l'estació de fusió"}
                        </div>
                    ) : (
                        step.queue.map((vec, idx) => {
                            const isNewest = step.phase === 'enqueue' && idx === step.queue.length - 1;

                            return (
                                <div
                                    key={`q-slot-${idx}-${vec.join('-')}`}
                                    className="flex flex-col items-center gap-1 shrink-0"
                                >
                                    <div
                                        className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all duration-300 ${
                                            isNewest
                                                ? 'bg-emerald-950/70 border-emerald-400 text-emerald-200 shadow-[0_0_14px_rgba(16,185,129,0.35)] scale-105'
                                                : getVectorColor(vec.length)
                                        }`}
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

            {/* ESTACIÓ DE FUSIÓ ACTIVA: desencua(Q) x2 -> merge -> encua(Q) */}
            <div className="w-full max-w-xl flex flex-col items-center">
                {step.v1 && step.v2 ? (
                    <div className="w-full flex flex-col items-center gap-2 p-3 rounded-2xl border border-white/10 bg-slate-900/30">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                            Estació de fusió activa
                        </span>

                        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                            {/* v1 extret */}
                            <div className="flex items-center gap-1 bg-amber-950/40 px-2.5 py-1.5 rounded-xl border border-amber-500/50 text-amber-200 text-xs font-bold shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                                <span className="text-[10px] text-amber-400 mr-1 font-normal">v1:</span>
                                {step.v1.map((val, idx) => (
                                    <span key={idx}>{val}</span>
                                ))}
                            </div>

                            <span className="text-slate-500 font-bold text-xs">+</span>

                            {/* v2 extret */}
                            <div className="flex items-center gap-1 bg-sky-950/40 px-2.5 py-1.5 rounded-xl border border-sky-500/50 text-sky-200 text-xs font-bold shadow-[0_0_10px_rgba(56,189,248,0.2)]">
                                <span className="text-[10px] text-sky-400 mr-1 font-normal">v2:</span>
                                {step.v2.map((val, idx) => (
                                    <span key={idx}>{val}</span>
                                ))}
                            </div>

                            <span className="text-slate-500 font-bold text-xs">→ merge →</span>

                            {/* Resultat de merge() */}
                            <div className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border-2 transition-all duration-300 text-xs font-bold ${
                                step.merged
                                    ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200 shadow-[0_0_16px_rgba(16,185,129,0.3)] scale-105'
                                    : 'bg-slate-950/40 border-dashed border-slate-700 text-slate-500'
                            }`}>
                                {step.merged ? (
                                    step.merged.map((val, idx) => (
                                        <span key={idx}>{val}</span>
                                    ))
                                ) : (
                                    <span className="text-[11px] italic">fusionant...</span>
                                )}
                            </div>
                        </div>
                    </div>
                ) : step.phase === 'final' && step.merged ? (
                    /* Estat complet: retorn del vector */
                    <div className="w-full flex flex-col items-center gap-2 p-3.5 rounded-2xl border border-emerald-500/40 bg-emerald-950/30 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                            <Check size={14} className="text-emerald-400" />
                            <span>Vector final retornat en ordre complet</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            {step.merged.map((val, idx) => (
                                <div
                                    key={idx}
                                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-950/80 border border-emerald-400 text-emerald-200 flex items-center justify-center font-bold text-sm sm:text-base font-mono shadow-sm"
                                >
                                    {val}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Estat de trànsit / inserció */
                    <div className="text-xs text-slate-500 italic py-1 font-mono">
                        Vector reintroduït a la cua correctament
                    </div>
                )}
            </div>

            {/* INDICADOR D'OPERACIÓ ACTUAL */}
            <div className="w-full max-w-lg text-center px-3 py-1.5 rounded-xl bg-slate-900/60 border border-white/5 text-slate-300 text-xs font-mono">
                <span className="text-slate-400 font-medium">{step.actionText}</span>
            </div>

        </div>
    );
}
