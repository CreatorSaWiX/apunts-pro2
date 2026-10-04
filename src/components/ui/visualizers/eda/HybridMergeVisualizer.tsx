"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Play, Pause, Check } from 'lucide-react';

interface HybridStep {
    id: number;
    phase: string;
    subroutine: string;
    array: number[];
    leftIdxs: number[];
    rightIdxs: number[];
    activeIdxs: number[];
    comparingIdxs: [number, number] | null;
    mergedCount: number; // quants elements ja s'han fusionat al davant
    isLeftSorted: boolean;
    isRightSorted: boolean;
    isMerging: boolean;
    isFinal: boolean;
}

const STEPS: HybridStep[] = [
    {
        id: 0,
        phase: "Vector inicial",
        subroutine: "d - e = 7 >= 4 (llindar) -> divideix pel mig en m = 3",
        array: [7, 3, 9, 2, 8, 1, 6, 4],
        leftIdxs: [0, 1, 2, 3],
        rightIdxs: [4, 5, 6, 7],
        activeIdxs: [],
        comparingIdxs: null,
        mergedCount: 0,
        isLeftSorted: false,
        isRightSorted: false,
        isMerging: false,
        isFinal: false,
    },
    {
        id: 1,
        phase: "Talla crítica assolida",
        subroutine: "Mida subblocs = 4 <= llindar (4) -> s'interromp la recursió i s'aplica inserció",
        array: [7, 3, 9, 2, 8, 1, 6, 4],
        leftIdxs: [0, 1, 2, 3],
        rightIdxs: [4, 5, 6, 7],
        activeIdxs: [0, 1, 2, 3],
        comparingIdxs: null,
        mergedCount: 0,
        isLeftSorted: false,
        isRightSorted: false,
        isMerging: false,
        isFinal: false,
    },
    // Inserció bloc esquerre
    {
        id: 2,
        phase: "Inserció bloc esquerre",
        subroutine: "ordena_insercio: element 3 s'insereix davant del 7 (3 < 7)",
        array: [3, 7, 9, 2, 8, 1, 6, 4],
        leftIdxs: [0, 1, 2, 3],
        rightIdxs: [4, 5, 6, 7],
        activeIdxs: [0, 1],
        comparingIdxs: null,
        mergedCount: 0,
        isLeftSorted: false,
        isRightSorted: false,
        isMerging: false,
        isFinal: false,
    },
    {
        id: 3,
        phase: "Inserció bloc esquerre",
        subroutine: "ordena_insercio: element 9 >= 7 -> ja queda al seu lloc",
        array: [3, 7, 9, 2, 8, 1, 6, 4],
        leftIdxs: [0, 1, 2, 3],
        rightIdxs: [4, 5, 6, 7],
        activeIdxs: [2],
        comparingIdxs: null,
        mergedCount: 0,
        isLeftSorted: false,
        isRightSorted: false,
        isMerging: false,
        isFinal: false,
    },
    {
        id: 4,
        phase: "Inserció bloc esquerre",
        subroutine: "ordena_insercio: element 2 es desplaça fins a l'inici (2 < 3)",
        array: [2, 3, 7, 9, 8, 1, 6, 4],
        leftIdxs: [0, 1, 2, 3],
        rightIdxs: [4, 5, 6, 7],
        activeIdxs: [0],
        comparingIdxs: null,
        mergedCount: 0,
        isLeftSorted: true,
        isRightSorted: false,
        isMerging: false,
        isFinal: false,
    },
    // Inserció bloc dret
    {
        id: 5,
        phase: "Inserció bloc dret",
        subroutine: "ordena_insercio(T, 4, 7): element 1 s'insereix davant del 8 (1 < 8)",
        array: [2, 3, 7, 9, 1, 8, 6, 4],
        leftIdxs: [0, 1, 2, 3],
        rightIdxs: [4, 5, 6, 7],
        activeIdxs: [4, 5],
        comparingIdxs: null,
        mergedCount: 0,
        isLeftSorted: true,
        isRightSorted: false,
        isMerging: false,
        isFinal: false,
    },
    {
        id: 6,
        phase: "Inserció bloc dret",
        subroutine: "ordena_insercio(T, 4, 7): element 6 s'insereix entre 1 i 8",
        array: [2, 3, 7, 9, 1, 6, 8, 4],
        leftIdxs: [0, 1, 2, 3],
        rightIdxs: [4, 5, 6, 7],
        activeIdxs: [5, 6],
        comparingIdxs: null,
        mergedCount: 0,
        isLeftSorted: true,
        isRightSorted: false,
        isMerging: false,
        isFinal: false,
    },
    {
        id: 7,
        phase: "Inserció bloc dret",
        subroutine: "ordena_insercio(T, 4, 7): element 4 s'insereix entre 1 i 6",
        array: [2, 3, 7, 9, 1, 4, 6, 8],
        leftIdxs: [0, 1, 2, 3],
        rightIdxs: [4, 5, 6, 7],
        activeIdxs: [5],
        comparingIdxs: null,
        mergedCount: 0,
        isLeftSorted: true,
        isRightSorted: true,
        isMerging: false,
        isFinal: false,
    },
    // Fusió merge pas a pas
    {
        id: 8,
        phase: "Inici de la fusió",
        subroutine: "merge(T, 0, 3, 7): dos blocs ordenats [2, 3, 7, 9] i [1, 4, 6, 8]",
        array: [2, 3, 7, 9, 1, 4, 6, 8],
        leftIdxs: [0, 1, 2, 3],
        rightIdxs: [4, 5, 6, 7],
        activeIdxs: [],
        comparingIdxs: [0, 4],
        mergedCount: 0,
        isLeftSorted: true,
        isRightSorted: true,
        isMerging: true,
        isFinal: false,
    },
    {
        id: 9,
        phase: "Fusió merge (pas 1)",
        subroutine: "Compara 2 vs 1 -> 1 és menor, s'afegeix com a 1r element",
        array: [1, 3, 7, 9, 2, 4, 6, 8],
        leftIdxs: [1, 2, 3],
        rightIdxs: [5, 6, 7],
        activeIdxs: [0],
        comparingIdxs: [4, 5],
        mergedCount: 1,
        isLeftSorted: true,
        isRightSorted: true,
        isMerging: true,
        isFinal: false,
    },
    {
        id: 10,
        phase: "Fusió merge (pas 2)",
        subroutine: "Compara 2 vs 4 -> 2 és menor, s'afegeix com a 2n element",
        array: [1, 2, 7, 9, 3, 4, 6, 8],
        leftIdxs: [2, 3],
        rightIdxs: [5, 6, 7],
        activeIdxs: [1],
        comparingIdxs: [4, 5],
        mergedCount: 2,
        isLeftSorted: true,
        isRightSorted: true,
        isMerging: true,
        isFinal: false,
    },
    {
        id: 11,
        phase: "Fusió merge (pas 3)",
        subroutine: "Compara 3 vs 4 -> 3 és menor, s'afegeix com a 3r element",
        array: [1, 2, 3, 9, 7, 4, 6, 8],
        leftIdxs: [3],
        rightIdxs: [5, 6, 7],
        activeIdxs: [2],
        comparingIdxs: [4, 5],
        mergedCount: 3,
        isLeftSorted: true,
        isRightSorted: true,
        isMerging: true,
        isFinal: false,
    },
    {
        id: 12,
        phase: "Fusió merge (pas 4)",
        subroutine: "Compara 7 vs 4 -> 4 és menor, s'afegeix com a 4t element",
        array: [1, 2, 3, 4, 7, 9, 6, 8],
        leftIdxs: [4, 5],
        rightIdxs: [6, 7],
        activeIdxs: [3],
        comparingIdxs: [4, 6],
        mergedCount: 4,
        isLeftSorted: true,
        isRightSorted: true,
        isMerging: true,
        isFinal: false,
    },
    {
        id: 13,
        phase: "Fusió merge (pas 5)",
        subroutine: "Compara 7 vs 6 -> 6 és menor, s'afegeix com a 5è element",
        array: [1, 2, 3, 4, 6, 9, 7, 8],
        leftIdxs: [5, 6],
        rightIdxs: [7],
        activeIdxs: [4],
        comparingIdxs: [5, 7],
        mergedCount: 5,
        isLeftSorted: true,
        isRightSorted: true,
        isMerging: true,
        isFinal: false,
    },
    {
        id: 14,
        phase: "Fusió merge (pas 6)",
        subroutine: "Compara 7 vs 8 -> 7 és menor, s'afegeix com a 6è element",
        array: [1, 2, 3, 4, 6, 7, 9, 8],
        leftIdxs: [6],
        rightIdxs: [7],
        activeIdxs: [5],
        comparingIdxs: [6, 7],
        mergedCount: 6,
        isLeftSorted: true,
        isRightSorted: true,
        isMerging: true,
        isFinal: false,
    },
    {
        id: 15,
        phase: "Fusió merge (pas 7)",
        subroutine: "Compara 9 vs 8 -> 8 és menor, s'afegeix; finalment s'hi afegeix el 9",
        array: [1, 2, 3, 4, 6, 7, 8, 9],
        leftIdxs: [],
        rightIdxs: [],
        activeIdxs: [6, 7],
        comparingIdxs: null,
        mergedCount: 8,
        isLeftSorted: true,
        isRightSorted: true,
        isMerging: false,
        isFinal: true,
    },
    {
        id: 16,
        phase: "Vector totalment ordenat",
        subroutine: "Final: hibridació completada amb èxit (inserció per a blocs petits + fusió)",
        array: [1, 2, 3, 4, 6, 7, 8, 9],
        leftIdxs: [],
        rightIdxs: [],
        activeIdxs: [],
        comparingIdxs: null,
        mergedCount: 8,
        isLeftSorted: true,
        isRightSorted: true,
        isMerging: false,
        isFinal: true,
    },
];

export default function HybridMergeVisualizer() {
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

    return (
        <div className="w-full flex flex-col items-center gap-4 my-7 font-mono select-none not-prose px-2 bg-transparent">

            {/* CONTROLS DE REPRODUCCIÓ MINIMALISTES */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/60 border border-white/10 text-xs">
                    <span className="text-slate-500">llindar:</span>
                    <span className="text-purple-300 font-bold">talla_critica = 4</span>
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

            {/* DIBUIX VISUAL DEL VECTOR T */}
            <div className="w-full max-w-xl flex flex-col items-center gap-2.5 py-1">

                {/* ETIQUETES DE ZONA SUPERIOR */}
                <div className="w-full max-w-md flex items-center justify-between px-2 text-[11px] h-5">
                    {step.isFinal ? (
                        <div className="w-full text-center text-emerald-400 font-bold text-xs">
                            vector T completament fusionat i ordenat
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-1.5">
                                <span className={`font-bold transition-colors ${
                                    step.isLeftSorted ? 'text-sky-300' : 'text-slate-400'
                                }`}>
                                    T[0..3]
                                </span>
                                <span className="text-[10px] text-slate-500">
                                    {step.isLeftSorted ? "(ordenat)" : "(inserció)"}
                                </span>
                            </div>

                            <span className="text-[10px] text-slate-500 font-mono">
                                pas {stepIdx + 1} de {STEPS.length}
                            </span>

                            <div className="flex items-center gap-1.5">
                                <span className={`font-bold transition-colors ${
                                    step.isRightSorted ? 'text-purple-300' : 'text-slate-400'
                                }`}>
                                    T[4..7]
                                </span>
                                <span className="text-[10px] text-slate-500">
                                    {step.isRightSorted ? "(ordenat)" : "(inserció)"}
                                </span>
                            </div>
                        </>
                    )}
                </div>

                {/* LES CEL·LES DEL VECTOR T */}
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                    <span className="text-xs font-bold text-slate-500 mr-1">T:</span>

                    {step.array.map((val, idx) => {
                        const isLeft = idx <= 3;
                        const isActive = step.activeIdxs.includes(idx);
                        const isComparing = step.comparingIdxs && (step.comparingIdxs[0] === idx || step.comparingIdxs[1] === idx);
                        const isMergedPrefix = step.isMerging && idx < step.mergedCount;

                        let cellClass = "bg-slate-900/60 border-slate-800 text-slate-300";

                        if (step.isFinal) {
                            cellClass = "bg-emerald-950/60 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.3)]";
                        } else if (isMergedPrefix) {
                            cellClass = "bg-emerald-950/40 border-emerald-500/60 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.2)]";
                        } else if (isComparing) {
                            cellClass = "bg-amber-950/60 border-amber-400 text-amber-200 scale-105 shadow-[0_0_14px_rgba(245,158,11,0.35)]";
                        } else if (isActive) {
                            cellClass = isLeft
                                ? "bg-sky-950/60 border-sky-400 text-sky-200 scale-105 shadow-[0_0_12px_rgba(56,189,248,0.3)]"
                                : "bg-purple-950/60 border-purple-400 text-purple-200 scale-105 shadow-[0_0_12px_rgba(192,132,252,0.3)]";
                        } else if (step.isLeftSorted && isLeft) {
                            cellClass = "bg-sky-950/30 border-sky-500/40 text-sky-200";
                        } else if (step.isRightSorted && !isLeft) {
                            cellClass = "bg-purple-950/30 border-purple-500/40 text-purple-200";
                        }

                        return (
                            <React.Fragment key={`hyb-cell-${idx}`}>
                                {/* Separador central a m = 3 */}
                                {idx === 4 && (
                                    <div className="flex flex-col items-center justify-center px-0.5">
                                        <div className="w-0.5 h-10 bg-slate-700 rounded-full" />
                                    </div>
                                )}

                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-[10px] text-slate-500 font-mono">{idx}</span>

                                    <div
                                        className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl border-2 flex items-center justify-center font-bold text-sm sm:text-base transition-all duration-200 ${cellClass}`}
                                    >
                                        {val}
                                    </div>
                                </div>
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* INDICADOR D'OPERACIÓ ACTUAL */}
                <div className="w-full max-w-lg flex flex-col items-center gap-1.5 mt-1">
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
