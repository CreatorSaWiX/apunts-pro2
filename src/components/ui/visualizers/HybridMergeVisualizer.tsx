"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Play, Pause, Check } from 'lucide-react';

interface HybridStep {
    id: number;
    phase: string;
    subroutine: string;
    // Valors de les dues meitats de T
    left: number[];
    right: number[];
    // Índexs actius que s'estan intercanviant o inserint
    activeLeftIdxs: number[];
    activeRightIdxs: number[];
    isLeftSorted: boolean;
    isRightSorted: boolean;
    isFinalMerge: boolean;
}

const STEPS: HybridStep[] = [
    {
        id: 0,
        phase: "Vector inicial",
        subroutine: "d - e = 7 >= 4 -> divideix pel mig (m = 3)",
        left: [7, 3, 9, 2],
        right: [8, 1, 6, 4],
        activeLeftIdxs: [],
        activeRightIdxs: [],
        isLeftSorted: false,
        isRightSorted: false,
        isFinalMerge: false,
    },
    {
        id: 1,
        phase: "Talla crítica assolida",
        subroutine: "mida = 4 <= talla_critica -> s'atura la recursio",
        left: [7, 3, 9, 2],
        right: [8, 1, 6, 4],
        activeLeftIdxs: [0, 1, 2, 3],
        activeRightIdxs: [4, 5, 6, 7],
        isLeftSorted: false,
        isRightSorted: false,
        isFinalMerge: false,
    },
    {
        id: 2,
        phase: "Insercio bloc esquerre",
        subroutine: "ordena_insercio(T, 0, 3): 3 s'insereix davant de 7",
        left: [3, 7, 9, 2],
        right: [8, 1, 6, 4],
        activeLeftIdxs: [0, 1],
        activeRightIdxs: [],
        isLeftSorted: false,
        isRightSorted: false,
        isFinalMerge: false,
    },
    {
        id: 3,
        phase: "Bloc esquerre ordenat",
        subroutine: "ordena_insercio(T, 0, 3): 2 s'insereix al principi",
        left: [2, 3, 7, 9],
        right: [8, 1, 6, 4],
        activeLeftIdxs: [0],
        activeRightIdxs: [],
        isLeftSorted: true,
        isRightSorted: false,
        isFinalMerge: false,
    },
    {
        id: 4,
        phase: "Insercio bloc dret",
        subroutine: "ordena_insercio(T, 4, 7): 1 s'insereix davant de 8",
        left: [2, 3, 7, 9],
        right: [1, 8, 6, 4],
        activeLeftIdxs: [],
        activeRightIdxs: [4, 5],
        isLeftSorted: true,
        isRightSorted: false,
        isFinalMerge: false,
    },
    {
        id: 5,
        phase: "Bloc dret ordenat",
        subroutine: "ordena_insercio(T, 4, 7): 4 i 6 s'insereixen ordenadament",
        left: [2, 3, 7, 9],
        right: [1, 4, 6, 8],
        activeLeftIdxs: [],
        activeRightIdxs: [5, 6, 7],
        isLeftSorted: true,
        isRightSorted: true,
        isFinalMerge: false,
    },
    {
        id: 6,
        phase: "Fusio merge",
        subroutine: "merge(T, 0, 3, 7) -> vector T completament ordenat",
        left: [1, 2, 3, 4],
        right: [6, 7, 8, 9],
        activeLeftIdxs: [],
        activeRightIdxs: [],
        isLeftSorted: true,
        isRightSorted: true,
        isFinalMerge: true,
    },
];

export default function HybridMergeVisualizer() {
    const [stepIdx, setStepIdx] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const currentStep = STEPS[stepIdx];

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
            <div className="flex items-center gap-3">
                {/* Badge de llindar */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/60 border border-white/10 text-xs">
                    <span className="text-slate-500">llindar:</span>
                    <span className="text-purple-300 font-bold">talla_critica = 4</span>
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

            {/* DIBUIX VISUAL DIRECTE DEL VECTOR I L'ORDENACIÓ */}
            <div className="w-full max-w-xl flex flex-col items-center gap-4 py-2">

                {/* ETIOQUETES SUPERIORS DE SUBRUTINA */}
                <div className="w-full max-w-md flex items-center justify-between px-3 text-[11px]">
                    {/* Meitat Esquerra */}
                    <div className="flex items-center gap-1.5">
                        <span className={`transition-all duration-200 font-bold ${
                            currentStep.isFinalMerge
                                ? 'text-emerald-400'
                                : currentStep.isLeftSorted
                                ? 'text-sky-300'
                                : stepIdx >= 2
                                ? 'text-amber-300 animate-pulse'
                                : 'text-slate-500'
                        }`}>
                            T[0..3]
                        </span>
                        {stepIdx >= 2 && !currentStep.isFinalMerge && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-950/60 text-sky-300 border border-sky-500/20">
                                {currentStep.isLeftSorted ? "ordenat" : "ordena_insercio"}
                            </span>
                        )}
                    </div>

                    {/* Meitat Dreta */}
                    <div className="flex items-center gap-1.5">
                        <span className={`transition-all duration-200 font-bold ${
                            currentStep.isFinalMerge
                                ? 'text-emerald-400'
                                : currentStep.isRightSorted
                                ? 'text-purple-300'
                                : stepIdx >= 4
                                ? 'text-amber-300 animate-pulse'
                                : 'text-slate-500'
                        }`}>
                            T[4..7]
                        </span>
                        {stepIdx >= 4 && !currentStep.isFinalMerge && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-950/60 text-purple-300 border border-purple-500/20">
                                {currentStep.isRightSorted ? "ordenat" : "ordena_insercio"}
                            </span>
                        )}
                    </div>
                </div>

                {/* LES CEL·LES DEL VECTOR T AMB LES DUES MEITATS */}
                <div className="flex items-center justify-center gap-2">
                    <span className="text-xs font-bold text-slate-500 mr-1">T:</span>

                    {/* BLOC ESQUERRE T[0..3] */}
                    <div className={`flex items-center gap-1.5 p-1 rounded-2xl border transition-all duration-300 ${
                        currentStep.isFinalMerge
                            ? 'border-emerald-500/40 bg-emerald-950/20'
                            : currentStep.isLeftSorted
                            ? 'border-sky-500/40 bg-sky-950/20 shadow-[0_0_12px_rgba(56,189,248,0.15)]'
                            : stepIdx >= 1
                            ? 'border-sky-500/20 bg-sky-950/10'
                            : 'border-white/5 bg-slate-900/30'
                    }`}>
                        {currentStep.left.map((val, idx) => {
                            const isMoving = currentStep.activeLeftIdxs.includes(idx);
                            const isSorted = currentStep.isLeftSorted;

                            return (
                                <div key={`hyb-left-cell-${idx}`} className="flex flex-col items-center gap-1">
                                    {/* Índex */}
                                    <span className="text-[10px] text-slate-500 font-mono">{idx}</span>

                                    {/* Caixa */}
                                    <div
                                        className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl border-2 flex items-center justify-center font-bold text-sm sm:text-base transition-all duration-300 ${
                                            currentStep.isFinalMerge
                                                ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                                                : isMoving
                                                ? 'bg-amber-950/60 border-amber-400 text-amber-200 scale-105 shadow-[0_0_12px_rgba(245,158,11,0.35)]'
                                                : isSorted
                                                ? 'bg-sky-950/40 border-sky-400 text-sky-200'
                                                : stepIdx >= 1
                                                ? 'bg-slate-900/80 border-slate-700 text-slate-200'
                                                : 'bg-slate-900/60 border-slate-800 text-slate-300'
                                        }`}
                                    >
                                        {val}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* SEPARADOR FÍSIC DEL PUNT MIG (m = 3) */}
                    <div className="flex flex-col items-center gap-1 px-1">
                        <span className="text-[9px] text-slate-500 font-bold">m=3</span>
                        <div className="w-0.5 h-11 bg-slate-700 rounded-full opacity-60" />
                    </div>

                    {/* BLOC DRET T[4..7] */}
                    <div className={`flex items-center gap-1.5 p-1 rounded-2xl border transition-all duration-300 ${
                        currentStep.isFinalMerge
                            ? 'border-emerald-500/40 bg-emerald-950/20'
                            : currentStep.isRightSorted
                            ? 'border-purple-500/40 bg-purple-950/20 shadow-[0_0_12px_rgba(192,132,252,0.15)]'
                            : stepIdx >= 1
                            ? 'border-purple-500/20 bg-purple-950/10'
                            : 'border-white/5 bg-slate-900/30'
                    }`}>
                        {currentStep.right.map((val, relIdx) => {
                            const absIdx = relIdx + 4;
                            const isMoving = currentStep.activeRightIdxs.includes(absIdx);
                            const isSorted = currentStep.isRightSorted;

                            return (
                                <div key={`hyb-right-cell-${relIdx}`} className="flex flex-col items-center gap-1">
                                    {/* Índex */}
                                    <span className="text-[10px] text-slate-500 font-mono">{absIdx}</span>

                                    {/* Caixa */}
                                    <div
                                        className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl border-2 flex items-center justify-center font-bold text-sm sm:text-base transition-all duration-300 ${
                                            currentStep.isFinalMerge
                                                ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                                                : isMoving
                                                ? 'bg-amber-950/60 border-amber-400 text-amber-200 scale-105 shadow-[0_0_12px_rgba(245,158,11,0.35)]'
                                                : isSorted
                                                ? 'bg-purple-950/40 border-purple-400 text-purple-200'
                                                : stepIdx >= 1
                                                ? 'bg-slate-900/80 border-slate-700 text-slate-200'
                                                : 'bg-slate-900/60 border-slate-800 text-slate-300'
                                        }`}
                                    >
                                        {val}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* INDICADOR D'OPERACIÓ ACTUAL (Minimalista) */}
                <div className="flex items-center gap-2 mt-2">
                    {currentStep.isFinalMerge ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold shadow-sm shadow-emerald-500/10">
                            <Check size={14} className="text-emerald-400" />
                            <span>merge(T, 0, 3, 7): fusionat i ordenat</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/60 border border-white/5 text-slate-300 text-xs font-mono">
                            <span className="text-slate-500">accio:</span>
                            <span className="text-slate-200 font-bold">{currentStep.subroutine}</span>
                        </div>
                    )}
                </div>

            </div>

        </div>
    );
}
