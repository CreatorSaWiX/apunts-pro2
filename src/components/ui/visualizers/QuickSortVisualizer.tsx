"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Play, Pause, Check } from 'lucide-react';

interface QSStep {
    id: number;
    title: string;
    subroutine: string;
    array: number[];
    pivotIdx: number | null; // índex del pivot
    t1Range: [number, number]; // rang de T1 (<= pivot)
    t2Range: [number, number]; // rang de T2 (> pivot)
    isPartitioned: boolean;
    isSubSorted: boolean;
    isFinal: boolean;
}

const STEPS: QSStep[] = [
    {
        id: 0,
        title: "Estat inicial",
        subroutine: "vector desordenat abans de triar pivot",
        array: [6, 2, 8, 4, 7, 1, 3, 5],
        pivotIdx: null,
        t1Range: [-1, -1],
        t2Range: [-1, -1],
        isPartitioned: false,
        isSubSorted: false,
        isFinal: false,
    },
    {
        id: 1,
        title: "1. Triar Pivot",
        subroutine: "seleccio del pivot x = 4 a T[3]",
        array: [6, 2, 8, 4, 7, 1, 3, 5],
        pivotIdx: 3, // val = 4
        t1Range: [-1, -1],
        t2Range: [-1, -1],
        isPartitioned: false,
        isSubSorted: false,
        isFinal: false,
    },
    {
        id: 2,
        title: "2. Partició Θ(n)",
        subroutine: "reordenacio lineal: T1 (<= 4) a l'esquerra, T2 (> 4) a la dreta",
        array: [2, 1, 3, 4, 6, 8, 7, 5],
        pivotIdx: 3, // val = 4 a la seva posicio definitiva
        t1Range: [0, 2], // 2, 1, 3
        t2Range: [4, 7], // 6, 8, 7, 5
        isPartitioned: true,
        isSubSorted: false,
        isFinal: false,
    },
    {
        id: 3,
        title: "3. Vèncer recursivament",
        subroutine: "crides recursives rec(T1) i rec(T2) ordenen cada bloc",
        array: [1, 2, 3, 4, 5, 6, 7, 8],
        pivotIdx: 3,
        t1Range: [0, 2], // [1, 2, 3] ordenat
        t2Range: [4, 7], // [5, 6, 7, 8] ordenat
        isPartitioned: true,
        isSubSorted: true,
        isFinal: false,
    },
    {
        id: 4,
        title: "4. Combinació gratuïta Θ(1)",
        subroutine: "concatenacio immediata: cost Theta(1) (ja ordenat in-place)",
        array: [1, 2, 3, 4, 5, 6, 7, 8],
        pivotIdx: null,
        t1Range: [-1, -1],
        t2Range: [-1, -1],
        isPartitioned: false,
        isSubSorted: true,
        isFinal: true,
    },
];

export default function QuickSortVisualizer() {
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

            {/* DIBUIX VISUAL DEL VECTOR T I LES PARTICIONS */}
            <div className="w-full max-w-xl flex flex-col items-center gap-3 py-1">

                {/* ETIQUETES DE PARTICIÓ (T1 <= x, pivot x, T2 > x) */}
                <div className="w-full max-w-md flex items-center justify-between px-2 text-[11px] h-5">
                    {stepIdx === 1 ? (
                        <div className="w-full text-center text-amber-300 font-bold text-xs">
                            pivot seleccionat: x = 4
                        </div>
                    ) : step.isPartitioned ? (
                        <>
                            <span className="text-sky-400 font-bold">
                                T1 &lt;= 4 {step.isSubSorted ? "(ordenat)" : "(subvector esquerre)"}
                            </span>
                            <span className="text-amber-400 font-bold px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/20 text-[10px]">
                                pivot fixat
                            </span>
                            <span className="text-purple-400 font-bold">
                                T2 &gt; 4 {step.isSubSorted ? "(ordenat)" : "(subvector dret)"}
                            </span>
                        </>
                    ) : step.isFinal ? (
                        <div className="w-full text-center text-emerald-400 font-bold text-xs">
                            vector T ordenat in-place (sense feina de fusio)
                        </div>
                    ) : (
                        <div className="w-full text-center text-slate-500 text-xs">
                            vector complet de mida n = 8
                        </div>
                    )}
                </div>

                {/* CEL·LES DEL VECTOR T */}
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                    <span className="text-xs font-bold text-slate-500 mr-1">T:</span>

                    {step.array.map((val, idx) => {
                        const isPivot = step.pivotIdx === idx;
                        const inT1 = idx >= step.t1Range[0] && idx <= step.t1Range[1];
                        const inT2 = idx >= step.t2Range[0] && idx <= step.t2Range[1];

                        let cellClass = "bg-slate-900/60 border-slate-800 text-slate-300";

                        if (step.isFinal) {
                            cellClass = "bg-emerald-950/60 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.3)]";
                        } else if (isPivot) {
                            cellClass = "bg-amber-950/70 border-amber-400 text-amber-200 scale-110 shadow-[0_0_16px_rgba(245,158,11,0.4)] z-10";
                        } else if (inT1) {
                            cellClass = step.isSubSorted
                                ? "bg-sky-950/50 border-sky-400 text-sky-200 shadow-[0_0_10px_rgba(56,189,248,0.2)]"
                                : "bg-sky-950/30 border-sky-500/50 text-sky-300";
                        } else if (inT2) {
                            cellClass = step.isSubSorted
                                ? "bg-purple-950/50 border-purple-400 text-purple-200 shadow-[0_0_10px_rgba(192,132,252,0.2)]"
                                : "bg-purple-950/30 border-purple-500/50 text-purple-300";
                        } else if (stepIdx === 1) {
                            // En pas 1, comparar amb pivot
                            if (val <= 4) {
                                cellClass = "bg-sky-950/20 border-sky-500/30 text-sky-300";
                            } else {
                                cellClass = "bg-purple-950/20 border-purple-500/30 text-purple-300";
                            }
                        }

                        return (
                            <div key={`qs-cell-${idx}`} className="flex flex-col items-center gap-1">
                                {/* Índex */}
                                <span className="text-[10px] text-slate-500 font-mono">{idx}</span>

                                {/* Cel·la */}
                                <div
                                    className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl border-2 flex items-center justify-center font-bold text-sm sm:text-base transition-all duration-300 ${cellClass}`}
                                >
                                    {val}
                                </div>

                                {/* Punter de pivot */}
                                <div className="h-3 flex items-center">
                                    {isPivot && !step.isFinal && (
                                        <span className="text-[9px] text-amber-400 font-bold animate-pulse">
                                            ^ pivot
                                        </span>
                                    )}
                                </div>
                            </div>
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
