"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Play, Pause, Check } from 'lucide-react';

interface HoareStep {
    id: number;
    array: number[];
    pointerI: number | null;
    pointerJ: number | null;
    swapping: [number, number] | null;
    isCrossed: boolean;
    isFinal: boolean;
    subroutine: string;
}

// Exemple teòric UPC: T = [3, 7, 2, 4, 6, 8, 1, 5], pivot x = 3
const STEPS: HoareStep[] = [
    {
        id: 0,
        array: [3, 7, 2, 4, 6, 8, 1, 5],
        pointerI: null,
        pointerJ: null,
        swapping: null,
        isCrossed: false,
        isFinal: false,
        subroutine: "pivot x = 3 a T[0], punters i=-1 i j=8 fora de rang",
    },
    {
        id: 1,
        array: [3, 7, 2, 4, 6, 8, 1, 5],
        pointerI: 0,
        pointerJ: 6,
        swapping: [0, 6],
        isCrossed: false,
        isFinal: false,
        subroutine: "i s'atura a T[0]=3 (>= 3) i j s'atura a T[6]=1 (<= 3)",
    },
    {
        id: 2,
        array: [1, 7, 2, 4, 6, 8, 3, 5],
        pointerI: 0,
        pointerJ: 6,
        swapping: null,
        isCrossed: false,
        isFinal: false,
        subroutine: "swap(T[0], T[6]): 1 i 3 intercanvien posicions",
    },
    {
        id: 3,
        array: [1, 7, 2, 4, 6, 8, 3, 5],
        pointerI: 1,
        pointerJ: 2,
        swapping: [1, 2],
        isCrossed: false,
        isFinal: false,
        subroutine: "i s'atura a T[1]=7 (>= 3) i j s'atura a T[2]=2 (<= 3)",
    },
    {
        id: 4,
        array: [1, 2, 7, 4, 6, 8, 3, 5],
        pointerI: 1,
        pointerJ: 2,
        swapping: null,
        isCrossed: false,
        isFinal: false,
        subroutine: "swap(T[1], T[2]): 2 i 7 intercanvien posicions",
    },
    {
        id: 5,
        array: [1, 2, 7, 4, 6, 8, 3, 5],
        pointerI: 2,
        pointerJ: 1,
        swapping: null,
        isCrossed: true,
        isFinal: false,
        subroutine: "punters creuats: i=2 >= j=1 -> finalitza el bucle sense swap",
    },
    {
        id: 6,
        array: [1, 2, 7, 4, 6, 8, 3, 5],
        pointerI: null,
        pointerJ: 1,
        swapping: null,
        isCrossed: false,
        isFinal: true,
        subroutine: "retorn de j = 1: T[0..1] <= 3 i T[2..7] >= 3",
    },
];

export default function HoarePartitionVisualizer() {
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
        }, 1600);

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

    return (
        <div className="w-full flex flex-col items-center gap-5 my-8 font-mono select-none not-prose px-2">

            {/* CONTROLS DE REPRODUCCIÓ MINIMALISTES */}
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

            {/* DIBUIX VISUAL DEL VECTOR T I ELS PUNTERS */}
            <div className="w-full max-w-xl flex flex-col items-center gap-3 py-1">

                {/* ETIQUETES DE ZONA SUPERIOR */}
                <div className="w-full max-w-md flex items-center justify-between px-2 text-[11px] h-5">
                    {step.isFinal ? (
                        <>
                            <span className="text-sky-400 font-bold">
                                T[0..1] &lt;= 3 (esquerra)
                            </span>
                            <span className="text-emerald-400 font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/30 text-[10px]">
                                tall j = 1
                            </span>
                            <span className="text-purple-400 font-bold">
                                T[2..7] &gt;= 3 (dreta)
                            </span>
                        </>
                    ) : (
                        <div className="w-full text-center text-amber-300 font-bold text-xs">
                            pivot de referencia: x = 3
                        </div>
                    )}
                </div>

                {/* CEL·LES DEL VECTOR T AMB ÍNDEXS ESTABLES */}
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                    <span className="text-xs font-bold text-slate-500 mr-1">T:</span>

                    {step.array.map((val, idx) => {
                        const isI = step.pointerI === idx;
                        const isJ = step.pointerJ === idx;
                        const isSwapping = step.swapping && (step.swapping[0] === idx || step.swapping[1] === idx);
                        const isPivot = stepIdx === 0 && idx === 0;

                        const isLeftFinal = step.isFinal && idx <= 1;
                        const isRightFinal = step.isFinal && idx >= 2;

                        let cellClass = "bg-slate-900/60 border-slate-800 text-slate-300";

                        if (isSwapping) {
                            cellClass = "bg-amber-950/70 border-amber-400 text-amber-200 scale-105 shadow-[0_0_16px_rgba(245,158,11,0.4)] z-10";
                        } else if (isI && isJ) {
                            cellClass = "bg-purple-950/60 border-purple-400 text-purple-200 shadow-[0_0_12px_rgba(192,132,252,0.3)]";
                        } else if (isI) {
                            cellClass = "bg-amber-950/50 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.25)]";
                        } else if (isJ) {
                            cellClass = "bg-sky-950/50 border-sky-400 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.25)]";
                        } else if (isLeftFinal) {
                            cellClass = "bg-sky-950/40 border-sky-400 text-sky-200 shadow-[0_0_10px_rgba(56,189,248,0.2)]";
                        } else if (isRightFinal) {
                            cellClass = "bg-purple-950/40 border-purple-400 text-purple-200 shadow-[0_0_10px_rgba(192,132,252,0.2)]";
                        } else if (isPivot) {
                            cellClass = "bg-amber-950/40 border-amber-500/60 text-amber-300";
                        }

                        return (
                            <React.Fragment key={`hoare-slot-${idx}`}>
                                {/* Separador visual de tall a l'estat final entre idx=1 i idx=2 */}
                                {step.isFinal && idx === 2 && (
                                    <div className="flex flex-col items-center justify-center px-0.5">
                                        <div className="w-0.5 h-10 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                                    </div>
                                )}

                                <div className="flex flex-col items-center gap-1">
                                    {/* Índex superior */}
                                    <span className="text-[10px] text-slate-500 font-mono">{idx}</span>

                                    {/* Casella estable amb transició CSS suau */}
                                    <div
                                        className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl border-2 flex items-center justify-center font-bold text-sm sm:text-base transition-all duration-300 ${cellClass}`}
                                    >
                                        {val}
                                    </div>

                                    {/* Indicadors inferiors de punters i / j */}
                                    <div className="h-4 flex flex-col items-center">
                                        {isI && isJ ? (
                                            <span className="text-[10px] font-bold text-purple-400">
                                                ^ i,j
                                            </span>
                                        ) : isI ? (
                                            <span className="text-[10px] font-bold text-amber-400">
                                                ^ i
                                            </span>
                                        ) : isJ ? (
                                            <span className="text-[10px] font-bold text-sky-400">
                                                ^ j
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* INDICADOR D'OPERACIÓ ACTUAL */}
                <div className="flex items-center gap-2 mt-1">
                    {step.isFinal ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold shadow-sm shadow-emerald-500/10">
                            <Check size={14} className="text-emerald-400" />
                            <span>{step.subroutine}</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/60 border border-white/5 text-slate-300 text-xs font-mono">
                            <span className="text-slate-500">accio:</span>
                            <span className="text-slate-200 font-bold">{step.subroutine}</span>
                        </div>
                    )}
                </div>

            </div>

        </div>
    );
}
