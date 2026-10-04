"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Play, Pause, Check } from 'lucide-react';

interface HoareStep {
    id: number;
    array: number[];
    pointerI: number | null;
    pointerJ: number | null;
    inspectingIdx: number | null;
    inspectingType: 'i' | 'j' | null;
    inspectingResult: string | null;
    swapping: [number, number] | null;
    isCrossed: boolean;
    isFinal: boolean;
    subroutine: string;
}

// Seqüència detallada pas a pas de la partició de Hoare amb T = [3, 7, 2, 4, 6, 8, 1, 5] i pivot x = 3
const STEPS: HoareStep[] = [
    {
        id: 0,
        array: [3, 7, 2, 4, 6, 8, 1, 5],
        pointerI: null,
        pointerJ: null,
        inspectingIdx: null,
        inspectingType: null,
        inspectingResult: null,
        swapping: null,
        isCrossed: false,
        isFinal: false,
        subroutine: "Inicialització: pivot x = 3 (T[0]), i = -1 (esquerra) i j = 8 (dreta)",
    },
    {
        id: 1,
        array: [3, 7, 2, 4, 6, 8, 1, 5],
        pointerI: null,
        pointerJ: 7,
        inspectingIdx: 7,
        inspectingType: 'j',
        inspectingResult: "5 > 3 (continua)",
        swapping: null,
        isCrossed: false,
        isFinal: false,
        subroutine: "Bucle j: --j -> j = 7. T[7] = 5 > 3 (correcte a la dreta), j continua avançant",
    },
    {
        id: 2,
        array: [3, 7, 2, 4, 6, 8, 1, 5],
        pointerI: null,
        pointerJ: 6,
        inspectingIdx: 6,
        inspectingType: 'j',
        inspectingResult: "1 <= 3 (aturat)",
        swapping: null,
        isCrossed: false,
        isFinal: false,
        subroutine: "Bucle j: --j -> j = 6. T[6] = 1 <= 3 -> j s'atura a la posició 6",
    },
    {
        id: 3,
        array: [3, 7, 2, 4, 6, 8, 1, 5],
        pointerI: 0,
        pointerJ: 6,
        inspectingIdx: 0,
        inspectingType: 'i',
        inspectingResult: "3 >= 3 (aturat)",
        swapping: null,
        isCrossed: false,
        isFinal: false,
        subroutine: "Bucle i: ++i -> i = 0. T[0] = 3 >= 3 -> i s'atura a la posició 0",
    },
    {
        id: 4,
        array: [3, 7, 2, 4, 6, 8, 1, 5],
        pointerI: 0,
        pointerJ: 6,
        inspectingIdx: null,
        inspectingType: null,
        inspectingResult: null,
        swapping: [0, 6],
        isCrossed: false,
        isFinal: false,
        subroutine: "Comprovació i < j: 0 < 6 (no creuats) -> preparem swap(T[0], T[6])",
    },
    {
        id: 5,
        array: [1, 7, 2, 4, 6, 8, 3, 5],
        pointerI: 0,
        pointerJ: 6,
        inspectingIdx: null,
        inspectingType: null,
        inspectingResult: null,
        swapping: null,
        isCrossed: false,
        isFinal: false,
        subroutine: "swap(T[0], T[6]) realitzat: 1 i 3 intercanvien posicions",
    },
    {
        id: 6,
        array: [1, 7, 2, 4, 6, 8, 3, 5],
        pointerI: 0,
        pointerJ: 5,
        inspectingIdx: 5,
        inspectingType: 'j',
        inspectingResult: "8 > 3 (continua)",
        swapping: null,
        isCrossed: false,
        isFinal: false,
        subroutine: "Bucle j: --j -> j = 5. T[5] = 8 > 3 (correcte a la dreta), j continua avançant",
    },
    {
        id: 7,
        array: [1, 7, 2, 4, 6, 8, 3, 5],
        pointerI: 0,
        pointerJ: 4,
        inspectingIdx: 4,
        inspectingType: 'j',
        inspectingResult: "6 > 3 (continua)",
        swapping: null,
        isCrossed: false,
        isFinal: false,
        subroutine: "Bucle j: --j -> j = 4. T[4] = 6 > 3 (correcte a la dreta), j continua avançant",
    },
    {
        id: 8,
        array: [1, 7, 2, 4, 6, 8, 3, 5],
        pointerI: 0,
        pointerJ: 3,
        inspectingIdx: 3,
        inspectingType: 'j',
        inspectingResult: "4 > 3 (continua)",
        swapping: null,
        isCrossed: false,
        isFinal: false,
        subroutine: "Bucle j: --j -> j = 3. T[3] = 4 > 3 (correcte a la dreta), j continua avançant",
    },
    {
        id: 9,
        array: [1, 7, 2, 4, 6, 8, 3, 5],
        pointerI: 0,
        pointerJ: 2,
        inspectingIdx: 2,
        inspectingType: 'j',
        inspectingResult: "2 <= 3 (aturat)",
        swapping: null,
        isCrossed: false,
        isFinal: false,
        subroutine: "Bucle j: --j -> j = 2. T[2] = 2 <= 3 -> j s'atura a la posició 2",
    },
    {
        id: 10,
        array: [1, 7, 2, 4, 6, 8, 3, 5],
        pointerI: 1,
        pointerJ: 2,
        inspectingIdx: 1,
        inspectingType: 'i',
        inspectingResult: "7 >= 3 (aturat)",
        swapping: null,
        isCrossed: false,
        isFinal: false,
        subroutine: "Bucle i: ++i -> i = 1. T[1] = 7 >= 3 -> i s'atura a la posició 1",
    },
    {
        id: 11,
        array: [1, 7, 2, 4, 6, 8, 3, 5],
        pointerI: 1,
        pointerJ: 2,
        inspectingIdx: null,
        inspectingType: null,
        inspectingResult: null,
        swapping: [1, 2],
        isCrossed: false,
        isFinal: false,
        subroutine: "Comprovació i < j: 1 < 2 (no creuats) -> preparem swap(T[1], T[2])",
    },
    {
        id: 12,
        array: [1, 2, 7, 4, 6, 8, 3, 5],
        pointerI: 1,
        pointerJ: 2,
        inspectingIdx: null,
        inspectingType: null,
        inspectingResult: null,
        swapping: null,
        isCrossed: false,
        isFinal: false,
        subroutine: "swap(T[1], T[2]) realitzat: 2 i 7 intercanvien posicions",
    },
    {
        id: 13,
        array: [1, 2, 7, 4, 6, 8, 3, 5],
        pointerI: 1,
        pointerJ: 1,
        inspectingIdx: 1,
        inspectingType: 'j',
        inspectingResult: "2 <= 3 (aturat)",
        swapping: null,
        isCrossed: false,
        isFinal: false,
        subroutine: "Bucle j: --j -> j = 1. T[1] = 2 <= 3 -> j s'atura a la posició 1",
    },
    {
        id: 14,
        array: [1, 2, 7, 4, 6, 8, 3, 5],
        pointerI: 2,
        pointerJ: 1,
        inspectingIdx: 2,
        inspectingType: 'i',
        inspectingResult: "7 >= 3 (aturat)",
        swapping: null,
        isCrossed: false,
        isFinal: false,
        subroutine: "Bucle i: ++i -> i = 2. T[2] = 7 >= 3 -> i s'atura a la posició 2",
    },
    {
        id: 15,
        array: [1, 2, 7, 4, 6, 8, 3, 5],
        pointerI: 2,
        pointerJ: 1,
        inspectingIdx: null,
        inspectingType: null,
        inspectingResult: null,
        swapping: null,
        isCrossed: true,
        isFinal: false,
        subroutine: "Comprovació i >= j: i = 2 >= j = 1 -> punters creuats! El bucle finalitza sense swap",
    },
    {
        id: 16,
        array: [1, 2, 7, 4, 6, 8, 3, 5],
        pointerI: null,
        pointerJ: 1,
        inspectingIdx: null,
        inspectingType: null,
        inspectingResult: null,
        swapping: null,
        isCrossed: false,
        isFinal: true,
        subroutine: "Partició completada: retorna tall q = j = 1. T[0..1] <= 3 i T[2..7] >= 3",
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

            {/* BARRA SUPERIOR: CONTROLS ESTACIONARIS I INDICADOR DE PAS */}
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

            {/* DIBUIX VISUAL DEL VECTOR T I ELS PUNTERS */}
            <div className="w-full max-w-xl flex flex-col items-center gap-2.5 py-1">

                {/* ETIQUETES DE ZONA SUPERIOR I PIVOT */}
                <div className="w-full max-w-md flex items-center justify-between px-2 text-[11px] h-5">
                    {step.isFinal ? (
                        <>
                            <span className="text-sky-400 font-bold">
                                T[0..1] &lt;= 3 (esquerra)
                            </span>
                            <span className="text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-[10px]">
                                tall q = j = 1
                            </span>
                            <span className="text-purple-400 font-bold">
                                T[2..7] &gt;= 3 (dreta)
                            </span>
                        </>
                    ) : (
                        <div className="w-full flex items-center justify-between px-1 text-xs">
                            <span className="text-amber-400 font-bold">
                                pivot x = 3 (T[0])
                            </span>
                            <span className="text-[10px] text-slate-500">
                                pas {stepIdx + 1} de {STEPS.length}
                            </span>
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
                        const isInspecting = step.inspectingIdx === idx;
                        const isPivot = stepIdx === 0 && idx === 0;

                        const isLeftFinal = step.isFinal && idx <= 1;
                        const isRightFinal = step.isFinal && idx >= 2;

                        let cellClass = "bg-slate-900/60 border-slate-800 text-slate-300";

                        if (isSwapping) {
                            cellClass = "bg-amber-950/70 border-amber-400 text-amber-200 scale-105 shadow-[0_0_16px_rgba(245,158,11,0.4)] z-10";
                        } else if (isI && isJ) {
                            cellClass = "bg-purple-950/60 border-purple-400 text-purple-200 shadow-[0_0_12px_rgba(192,132,252,0.3)]";
                        } else if (isInspecting && step.inspectingType === 'j') {
                            cellClass = "bg-sky-950/60 border-sky-400 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.3)]";
                        } else if (isInspecting && step.inspectingType === 'i') {
                            cellClass = "bg-amber-950/60 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.3)]";
                        } else if (isI) {
                            cellClass = "bg-amber-950/40 border-amber-500/80 text-amber-200";
                        } else if (isJ) {
                            cellClass = "bg-sky-950/40 border-sky-500/80 text-sky-200";
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
                                        className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl border-2 flex items-center justify-center font-bold text-sm sm:text-base transition-all duration-200 ${cellClass}`}
                                    >
                                        {val}
                                    </div>

                                    {/* Indicadors inferiors de punters i / j i avaluacions */}
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
                <div className="w-full max-w-lg flex flex-col items-center gap-1.5 mt-1">
                    {/* Badge de resultat de la comprovació actual si s'està avaluant */}
                    {step.inspectingResult && (
                        <div className="text-[10px] font-mono px-2 py-0.5 rounded border bg-slate-900/60 border-white/10 text-slate-300">
                            avaluant: <span className={step.inspectingType === 'j' ? 'text-sky-300 font-bold' : 'text-amber-300 font-bold'}>{step.inspectingResult}</span>
                        </div>
                    )}

                    {step.isFinal ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold shadow-sm shadow-emerald-500/10 text-center">
                            <Check size={14} className="text-emerald-400 shrink-0" />
                            <span>{step.subroutine}</span>
                        </div>
                    ) : (
                        <div className="w-full text-center px-3 py-1.5 rounded-xl bg-slate-900/60 border border-white/5 text-slate-300 text-xs font-mono">
                            <span className="text-slate-200 font-medium">{step.subroutine}</span>
                        </div>
                    )}
                </div>

            </div>

        </div>
    );
}
