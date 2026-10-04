"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Play, Pause } from 'lucide-react';
import { InlineMath } from 'react-katex';

interface StepData {
    id: number;
    name: string;
    i: number | null; // índex actiu a T (esquerra)
    j: number | null; // índex actiu a T (dreta)
    k: number; // índex que s'està omplint a B
    chosenFrom: 'i' | 'j' | null; // quin dels dos ha baixat
    chosenIdx: number | null; // quin índex de T ha baixat
    bArray: (number | null)[];
    consumedT: number[]; // índexs de T ja consumits
    isBolcat: boolean; // pas final de bolcat B -> T
    comparisonLabel: string;
}

const STEPS: StepData[] = [
    {
        id: 0,
        name: "Inici",
        i: 0,
        j: 4,
        k: 0,
        chosenFrom: null,
        chosenIdx: null,
        bArray: [null, null, null, null, null, null, null, null],
        consumedT: [],
        isBolcat: false,
        comparisonLabel: "Meitats ordenades a T · B auxiliar buit",
    },
    {
        id: 1,
        name: "1",
        i: 0,
        j: 5,
        k: 1,
        chosenFrom: 'j',
        chosenIdx: 4,
        bArray: [1, null, null, null, null, null, null, null],
        consumedT: [4],
        isBolcat: false,
        comparisonLabel: "1 ≤ 2 → T[4] baixa a B[0]",
    },
    {
        id: 2,
        name: "2",
        i: 0,
        j: 6,
        k: 2,
        chosenFrom: 'j',
        chosenIdx: 5,
        bArray: [1, 1, null, null, null, null, null, null],
        consumedT: [4, 5],
        isBolcat: false,
        comparisonLabel: "1 ≤ 2 → T[5] baixa a B[1] (estabilitat)",
    },
    {
        id: 3,
        name: "3",
        i: 1,
        j: 6,
        k: 3,
        chosenFrom: 'i',
        chosenIdx: 0,
        bArray: [1, 1, 2, null, null, null, null, null],
        consumedT: [4, 5, 0],
        isBolcat: false,
        comparisonLabel: "2 ≤ 5 → T[0] baixa a B[2]",
    },
    {
        id: 4,
        name: "4",
        i: 2,
        j: 6,
        k: 4,
        chosenFrom: 'i',
        chosenIdx: 1,
        bArray: [1, 1, 2, 4, null, null, null, null],
        consumedT: [4, 5, 0, 1],
        isBolcat: false,
        comparisonLabel: "4 ≤ 5 → T[1] baixa a B[3]",
    },
    {
        id: 5,
        name: "5",
        i: 2,
        j: 7,
        k: 5,
        chosenFrom: 'j',
        chosenIdx: 6,
        bArray: [1, 1, 2, 4, 5, null, null, null],
        consumedT: [4, 5, 0, 1, 6],
        isBolcat: false,
        comparisonLabel: "5 < 7 → T[6] baixa a B[4]",
    },
    {
        id: 6,
        name: "6",
        i: 2,
        j: 8,
        k: 6,
        chosenFrom: 'j',
        chosenIdx: 7,
        bArray: [1, 1, 2, 4, 5, 6, null, null],
        consumedT: [4, 5, 0, 1, 6, 7],
        isBolcat: false,
        comparisonLabel: "6 < 7 → T[7] baixa a B[5] (dreta esgotada)",
    },
    {
        id: 7,
        name: "7",
        i: 3,
        j: 8,
        k: 7,
        chosenFrom: 'i',
        chosenIdx: 2,
        bArray: [1, 1, 2, 4, 5, 6, 7, null],
        consumedT: [4, 5, 0, 1, 6, 7, 2],
        isBolcat: false,
        comparisonLabel: "Residual esquerre → T[2]=7 baixa a B[6]",
    },
    {
        id: 8,
        name: "8",
        i: 4,
        j: 8,
        k: 8,
        chosenFrom: 'i',
        chosenIdx: 3,
        bArray: [1, 1, 2, 4, 5, 6, 7, 8],
        consumedT: [4, 5, 0, 1, 6, 7, 2, 3],
        isBolcat: false,
        comparisonLabel: "Residual esquerre → T[3]=8 baixa a B[7]",
    },
    {
        id: 9,
        name: "Bolcat",
        i: null,
        j: null,
        k: 8,
        chosenFrom: null,
        chosenIdx: null,
        bArray: [1, 1, 2, 4, 5, 6, 7, 8],
        consumedT: [],
        isBolcat: true,
        comparisonLabel: "Bolcat final T[e + k] = B[k] · T ordenat",
    },
];

// Vector T inicial amb les dues meitats ordenades
const INITIAL_T = [2, 4, 7, 8, 1, 1, 5, 6];
const FINAL_T = [1, 1, 2, 4, 5, 6, 7, 8];

export default function MergeVisualizer() {
    const [stepIdx, setStepIdx] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const step = STEPS[stepIdx];

    // Reproducció automàtica
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
        }, 900);

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
        <div className="w-full flex flex-col items-center gap-6 my-10 font-mono select-none not-prose px-2">

            {/* 1. SELECTOR MINIMALISTA DE PASSOS I AUTO-PLAY */}
            <div className="w-full max-w-xl flex flex-wrap items-center justify-between gap-3 px-1">
                {/* Píndoles de pas: Inici | 1 .. 8 | Bolcat */}
                <div className="flex bg-slate-900/60 p-1 rounded-xl border border-white/5 gap-1 text-xs">
                    {STEPS.map((s, idx) => {
                        const isCurrent = stepIdx === idx;
                        return (
                            <button
                                key={`step-${idx}`}
                                type="button"
                                onClick={() => {
                                    setIsPlaying(false);
                                    setStepIdx(idx);
                                }}
                                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-bold transition-all duration-150 text-xs ${
                                    isCurrent
                                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                        : 'text-slate-400 hover:text-slate-200 border border-transparent'
                                }`}
                            >
                                {s.name}
                            </button>
                        );
                    })}
                </div>

                {/* Controls: Play/Pause, Anterior, Següent, Reset */}
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={togglePlay}
                        title={isPlaying ? "Pausar" : "Reproduir automàticament"}
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

            {/* 2. DIBUIX VISUAL DIRECTE I INTUITIU */}
            <div className="w-full max-w-xl flex flex-col items-center gap-6 py-2">

                {/* --- SECCIÓ SUPERIOR: VECTOR T (DUES MEITATS) --- */}
                <div className="flex flex-col items-center gap-1.5 w-full">
                    <div className="flex items-center justify-between w-full max-w-md px-2 text-[10px] text-slate-500">
                        <span className="text-sky-400 font-bold">Meitat esquerra T[e..m]</span>
                        <span className="text-purple-400 font-bold">Meitat dreta T[m+1..d]</span>
                    </div>

                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                        <span className="text-xs font-bold text-slate-400 mr-1">T:</span>

                        {/* MEITAT ESQUERRA (0..3) */}
                        <div className="flex items-center gap-1 sm:gap-1.5 p-1 rounded-2xl border border-sky-500/20 bg-sky-950/10">
                            {[0, 1, 2, 3].map((idx) => {
                                const val = step.isBolcat ? FINAL_T[idx] : INITIAL_T[idx];
                                const isPointerI = !step.isBolcat && step.i === idx;
                                const isConsumed = !step.isBolcat && step.consumedT.includes(idx);
                                const isJustChosen = !step.isBolcat && step.chosenIdx === idx;

                                return (
                                    <div key={`t-${idx}`} className="flex flex-col items-center gap-1">
                                        <div
                                            className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl border-2 flex items-center justify-center font-bold text-sm sm:text-base transition-all duration-200 ${
                                                step.isBolcat
                                                    ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                                                    : isJustChosen
                                                    ? 'bg-amber-950/50 border-amber-400 text-amber-200 scale-105 shadow-[0_0_15px_rgba(245,158,11,0.35)]'
                                                    : isPointerI
                                                    ? 'bg-sky-950/50 border-sky-400 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                                                    : isConsumed
                                                    ? 'bg-slate-950/40 border-slate-800 text-slate-700 opacity-30'
                                                    : 'bg-slate-900/60 border-slate-700 text-slate-200'
                                            }`}
                                        >
                                            {val}
                                        </div>

                                        {/* Indicador de punter i */}
                                        <div className="h-4 flex items-center">
                                            {isPointerI && (
                                                <span className="text-[10px] font-bold text-sky-400 animate-pulse">
                                                    ▲ i
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* SEPARADOR FÍSIC ENTRE MEITATS */}
                        <div className="w-0.5 h-12 bg-slate-700 mx-1 rounded-full opacity-60" />

                        {/* MEITAT DRETA (4..7) */}
                        <div className="flex items-center gap-1 sm:gap-1.5 p-1 rounded-2xl border border-purple-500/20 bg-purple-950/10">
                            {[4, 5, 6, 7].map((idx) => {
                                const val = step.isBolcat ? FINAL_T[idx] : INITIAL_T[idx];
                                const isPointerJ = !step.isBolcat && step.j === idx;
                                const isConsumed = !step.isBolcat && step.consumedT.includes(idx);
                                const isJustChosen = !step.isBolcat && step.chosenIdx === idx;

                                return (
                                    <div key={`t-${idx}`} className="flex flex-col items-center gap-1">
                                        <div
                                            className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl border-2 flex items-center justify-center font-bold text-sm sm:text-base transition-all duration-200 ${
                                                step.isBolcat
                                                    ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                                                    : isJustChosen
                                                    ? 'bg-amber-950/50 border-amber-400 text-amber-200 scale-105 shadow-[0_0_15px_rgba(245,158,11,0.35)]'
                                                    : isPointerJ
                                                    ? 'bg-purple-950/50 border-purple-400 text-purple-200 shadow-[0_0_12px_rgba(192,132,252,0.25)]'
                                                    : isConsumed
                                                    ? 'bg-slate-950/40 border-slate-800 text-slate-700 opacity-30'
                                                    : 'bg-slate-900/60 border-slate-700 text-slate-200'
                                            }`}
                                        >
                                            {val}
                                        </div>

                                        {/* Indicador de punter j */}
                                        <div className="h-4 flex items-center">
                                            {isPointerJ && (
                                                <span className="text-[10px] font-bold text-purple-400 animate-pulse">
                                                    ▲ j
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* --- FLETXA CENTRAL DE MOVIMENT / FUSIÓ --- */}
                <div className="flex items-center justify-center h-6">
                    {step.isBolcat ? (
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                            <span>▲</span>
                            <span>T[e + k] = B[k] (bolcat final)</span>
                            <span>▲</span>
                        </div>
                    ) : step.chosenFrom ? (
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                            <span>▼</span>
                            <span>baixa el menor a B[k]</span>
                            <span>▼</span>
                        </div>
                    ) : (
                        <span className="text-[11px] text-slate-500 italic">
                            Compara T[i] amb T[j] i mou el menor a B
                        </span>
                    )}
                </div>

                {/* --- SECCIÓ INFERIOR: VECTOR AUXILIAR B --- */}
                <div className="flex flex-col items-center gap-1.5 w-full">
                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                        <span className="text-xs font-bold text-emerald-400 mr-1">B:</span>

                        <div className="flex items-center gap-1 sm:gap-1.5 p-1 rounded-2xl border border-emerald-500/20 bg-emerald-950/10">
                            {Array.from({ length: 8 }).map((_, idx) => {
                                const val = step.bArray[idx];
                                const isFilled = val !== null;
                                const isCurrentK = !step.isBolcat && step.k === idx;
                                const isNewestAdded = !step.isBolcat && step.k - 1 === idx;

                                return (
                                    <div key={`b-${idx}`} className="flex flex-col items-center gap-1">
                                        <div
                                            className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl border-2 flex items-center justify-center font-bold text-sm sm:text-base transition-all duration-200 ${
                                                isNewestAdded
                                                    ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.35)] scale-105'
                                                    : isFilled
                                                    ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300'
                                                    : 'bg-slate-900/30 border-dashed border-slate-700 text-slate-600'
                                            }`}
                                        >
                                            {isFilled ? val : '·'}
                                        </div>

                                        {/* Indicador de punter k */}
                                        <div className="h-4 flex items-center">
                                            {isCurrentK && (
                                                <span className="text-[10px] font-bold text-emerald-400">
                                                    k={idx}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

            </div>

            {/* 3. PEU INFORMATIU ULTRA-MINIMALISTA */}
            <div className="w-full max-w-xl flex flex-wrap items-center justify-between gap-3 text-xs pt-3 border-t border-white/5 text-slate-400">
                {/* Breu estat visual */}
                <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">Estat:</span>
                    <span className="font-mono font-bold text-slate-200 bg-slate-900/60 px-2 py-0.5 rounded border border-white/5">
                        {step.comparisonLabel}
                    </span>
                </div>

                {/* Cost */}
                <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">Cost:</span>
                    <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-[11px]">
                        <InlineMath math="\Theta(d - e + 1) = \Theta(n)" />
                    </span>
                </div>
            </div>

        </div>
    );
}
