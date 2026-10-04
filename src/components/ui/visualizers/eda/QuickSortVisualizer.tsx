"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Play, Pause, Check } from 'lucide-react';

interface QSStep {
    id: number;
    title: string;
    subroutine: string;
    array: number[];
    pivotIdx: number | null;
    t1Range: [number, number]; // rang de T1 (<= pivot)
    t2Range: [number, number]; // rang de T2 (>= pivot)
    activeRecRange: [number, number] | null; // quin subvector s'està ordenant recursivament
    isPartitioned: boolean;
    isSubSorted: boolean;
    isFinal: boolean;
}

const STEPS: QSStep[] = [
    {
        id: 0,
        title: "Estat inicial",
        subroutine: "Vector desordenat de mida n = 8 abans de triar pivot",
        array: [6, 2, 8, 4, 7, 1, 3, 5],
        pivotIdx: null,
        t1Range: [-1, -1],
        t2Range: [-1, -1],
        activeRecRange: null,
        isPartitioned: false,
        isSubSorted: false,
        isFinal: false,
    },
    {
        id: 1,
        title: "1. Triar Pivot inicial",
        subroutine: "Selecció del pivot x = 4 a T[3] com a valor de referència",
        array: [6, 2, 8, 4, 7, 1, 3, 5],
        pivotIdx: 3,
        t1Range: [-1, -1],
        t2Range: [-1, -1],
        activeRecRange: null,
        isPartitioned: false,
        isSubSorted: false,
        isFinal: false,
    },
    {
        id: 2,
        title: "2. Partició Θ(n) en curs",
        subroutine: "Partició: separen elements <= 4 a l'esquerra i >= 4 a la dreta",
        array: [2, 1, 3, 4, 7, 8, 6, 5],
        pivotIdx: 3,
        t1Range: [0, 2],
        t2Range: [4, 7],
        activeRecRange: null,
        isPartitioned: true,
        isSubSorted: false,
        isFinal: false,
    },
    {
        id: 3,
        title: "2. Partició finalitzada",
        subroutine: "T1 = [2, 1, 3] <= 4, pivot 4 a la posició final, T2 = [7, 8, 6, 5] >= 4",
        array: [2, 1, 3, 4, 7, 8, 6, 5],
        pivotIdx: 3,
        t1Range: [0, 2],
        t2Range: [4, 7],
        activeRecRange: null,
        isPartitioned: true,
        isSubSorted: false,
        isFinal: false,
    },
    // Vèncer recursivament: Subvector esquerre T[0..2]
    {
        id: 4,
        title: "3. Recursió esquerra: quicksort(T, 0, 2)",
        subroutine: "Subvector T[0..2] = [2, 1, 3]: tria pivot x = 2 a T[0]",
        array: [2, 1, 3, 4, 7, 8, 6, 5],
        pivotIdx: 0,
        t1Range: [0, 2],
        t2Range: [4, 7],
        activeRecRange: [0, 2],
        isPartitioned: true,
        isSubSorted: false,
        isFinal: false,
    },
    {
        id: 5,
        title: "3. Recursió esquerra resolta",
        subroutine: "Partició sobre [2, 1, 3]: 1 <= 2 <= 3 -> subvector T[0..2] queda [1, 2, 3] ordenat!",
        array: [1, 2, 3, 4, 7, 8, 6, 5],
        pivotIdx: 3,
        t1Range: [0, 2],
        t2Range: [4, 7],
        activeRecRange: [0, 2],
        isPartitioned: true,
        isSubSorted: false,
        isFinal: false,
    },
    // Vèncer recursivament: Subvector dret T[4..7]
    {
        id: 6,
        title: "3. Recursió dreta: quicksort(T, 4, 7)",
        subroutine: "Subvector T[4..7] = [7, 8, 6, 5]: tria pivot x = 6 a T[6]",
        array: [1, 2, 3, 4, 7, 8, 6, 5],
        pivotIdx: 6,
        t1Range: [0, 2],
        t2Range: [4, 7],
        activeRecRange: [4, 7],
        isPartitioned: true,
        isSubSorted: false,
        isFinal: false,
    },
    {
        id: 7,
        title: "3. Partició dreta en curs",
        subroutine: "Partició sobre [7, 8, 6, 5] amb pivot 6 -> 5 a l'esquerra, 6 al mig, 8 i 7 a la dreta",
        array: [1, 2, 3, 4, 5, 6, 8, 7],
        pivotIdx: 5,
        t1Range: [0, 2],
        t2Range: [4, 7],
        activeRecRange: [4, 7],
        isPartitioned: true,
        isSubSorted: false,
        isFinal: false,
    },
    {
        id: 8,
        title: "3. Recursió dreta resolta",
        subroutine: "Recursió sobre [8, 7] -> queda [7, 8]. Subvector T[4..7] completament ordenat [5, 6, 7, 8]!",
        array: [1, 2, 3, 4, 5, 6, 7, 8],
        pivotIdx: 3,
        t1Range: [0, 2],
        t2Range: [4, 7],
        activeRecRange: [4, 7],
        isPartitioned: true,
        isSubSorted: true,
        isFinal: false,
    },
    {
        id: 9,
        title: "4. Combinació gratuïta Θ(1)",
        subroutine: "Els dos subblocs i el pivot ja estan col·locats in-place! No cal fusió addicional",
        array: [1, 2, 3, 4, 5, 6, 7, 8],
        pivotIdx: null,
        t1Range: [-1, -1],
        t2Range: [-1, -1],
        activeRecRange: null,
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
        }, 1400);

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
        <div className="w-full flex flex-col items-center gap-4 my-7 font-mono select-none not-prose px-2 bg-transparent">

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
                    className="p-1.5 rounded-lg bg-slate-900/40 hover:bg-slate-800 border border-white/5 text-slate-400 hover:text-slate-200 transition ml-1"
                >
                    <RotateCcw size={14} />
                </button>
            </div>

            {/* DIBUIX VISUAL DEL VECTOR T I LES PARTICIONS */}
            <div className="w-full max-w-xl flex flex-col items-center gap-2.5 py-1">

                {/* ETIQUETES DE PARTICIÓ */}
                <div className="w-full max-w-md flex items-center justify-between px-2 text-[11px] h-5">
                    {step.isFinal ? (
                        <div className="w-full text-center text-emerald-400 font-bold text-xs">
                            vector T ordenat in-place (cost de fusió nul, Θ(1))
                        </div>
                    ) : (
                        <>
                            <span className="text-sky-400 font-bold">
                                {step.t1Range[0] !== -1 ? `T[${step.t1Range[0]}..${step.t1Range[1]}] <= 4` : "subvector esquerre"}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                                pas {stepIdx + 1} de {STEPS.length}
                            </span>
                            <span className="text-purple-400 font-bold">
                                {step.t2Range[0] !== -1 ? `T[${step.t2Range[0]}..${step.t2Range[1]}] >= 4` : "subvector dret"}
                            </span>
                        </>
                    )}
                </div>

                {/* CEL·LES DEL VECTOR T */}
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                    <span className="text-xs font-bold text-slate-500 mr-1">T:</span>

                    {step.array.map((val, idx) => {
                        const isPivot = step.pivotIdx === idx;
                        const inT1 = idx >= step.t1Range[0] && idx <= step.t1Range[1];
                        const inT2 = idx >= step.t2Range[0] && idx <= step.t2Range[1];
                        const isInActiveRec = step.activeRecRange && idx >= step.activeRecRange[0] && idx <= step.activeRecRange[1];

                        let cellClass = "bg-slate-900/60 border-slate-800 text-slate-300";

                        if (step.isFinal) {
                            cellClass = "bg-emerald-950/60 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.3)]";
                        } else if (isPivot) {
                            cellClass = "bg-amber-950/70 border-amber-400 text-amber-200 scale-105 shadow-[0_0_16px_rgba(245,158,11,0.4)] z-10";
                        } else if (isInActiveRec) {
                            cellClass = inT1
                                ? "bg-sky-950/60 border-sky-400 text-sky-200 shadow-[0_0_10px_rgba(56,189,248,0.3)]"
                                : "bg-purple-950/60 border-purple-400 text-purple-200 shadow-[0_0_10px_rgba(192,132,252,0.3)]";
                        } else if (inT1) {
                            cellClass = step.isSubSorted
                                ? "bg-sky-950/40 border-sky-400 text-sky-200"
                                : "bg-sky-950/20 border-sky-500/40 text-sky-300";
                        } else if (inT2) {
                            cellClass = step.isSubSorted
                                ? "bg-purple-950/40 border-purple-400 text-purple-200"
                                : "bg-purple-950/20 border-purple-500/40 text-purple-300";
                        }

                        return (
                            <div key={`qs-cell-${idx}`} className="flex flex-col items-center gap-1">
                                <span className="text-[10px] text-slate-500 font-mono">{idx}</span>

                                <div
                                    className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl border-2 flex items-center justify-center font-bold text-sm sm:text-base transition-all duration-200 ${cellClass}`}
                                >
                                    {val}
                                </div>

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
                <div className="w-full max-w-lg flex flex-col items-center gap-1 mt-1">
                    {step.isFinal ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold shadow-sm shadow-emerald-500/10 text-center">
                            <Check size={14} className="text-emerald-400 shrink-0" />
                            <span>{step.subroutine}</span>
                        </div>
                    ) : (
                        <div className="w-full text-center px-3 py-1.5 rounded-xl bg-slate-900/60 border border-white/5 text-slate-300 text-xs font-mono">
                            <span className="text-slate-400 font-medium">{step.subroutine}</span>
                        </div>
                    )}
                </div>

            </div>

        </div>
    );
}
