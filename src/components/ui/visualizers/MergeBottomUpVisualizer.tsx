"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Play, Pause, Check } from 'lucide-react';

interface BottomUpStep {
    id: number;
    m: number;
    i: number;
    call: string;
    array: number[];
    activeRange: [number, number]; // [start, end]
    leftSubRange: [number, number]; // [i, i+m-1]
    rightSubRange: [number, number]; // [i+m, min(i+2m-1, n-1)]
    isFinal: boolean;
}

const STEPS: BottomUpStep[] = [
    {
        id: 0,
        m: 1,
        i: 0,
        call: "Vector inicial desordenat (m = 1)",
        array: [6, 2, 8, 4, 7, 1, 5, 3],
        activeRange: [-1, -1],
        leftSubRange: [-1, -1],
        rightSubRange: [-1, -1],
        isFinal: false,
    },
    // Ronda m = 1 (fusio de parelles unitaries)
    {
        id: 1,
        m: 1,
        i: 0,
        call: "merge(T, 0, 0, 1)",
        array: [2, 6, 8, 4, 7, 1, 5, 3],
        activeRange: [0, 1],
        leftSubRange: [0, 0],
        rightSubRange: [1, 1],
        isFinal: false,
    },
    {
        id: 2,
        m: 1,
        i: 2,
        call: "merge(T, 2, 2, 3)",
        array: [2, 6, 4, 8, 7, 1, 5, 3],
        activeRange: [2, 3],
        leftSubRange: [2, 2],
        rightSubRange: [3, 3],
        isFinal: false,
    },
    {
        id: 3,
        m: 1,
        i: 4,
        call: "merge(T, 4, 4, 5)",
        array: [2, 6, 4, 8, 1, 7, 5, 3],
        activeRange: [4, 5],
        leftSubRange: [4, 4],
        rightSubRange: [5, 5],
        isFinal: false,
    },
    {
        id: 4,
        m: 1,
        i: 6,
        call: "merge(T, 6, 6, 7)",
        array: [2, 6, 4, 8, 1, 7, 3, 5],
        activeRange: [6, 7],
        leftSubRange: [6, 6],
        rightSubRange: [7, 7],
        isFinal: false,
    },
    // Ronda m = 2 (fusio de blocs de mida 2)
    {
        id: 5,
        m: 2,
        i: 0,
        call: "merge(T, 0, 1, 3)",
        array: [2, 4, 6, 8, 1, 7, 3, 5],
        activeRange: [0, 3],
        leftSubRange: [0, 1],
        rightSubRange: [2, 3],
        isFinal: false,
    },
    {
        id: 6,
        m: 2,
        i: 4,
        call: "merge(T, 4, 5, 7)",
        array: [2, 4, 6, 8, 1, 3, 5, 7],
        activeRange: [4, 7],
        leftSubRange: [4, 5],
        rightSubRange: [6, 7],
        isFinal: false,
    },
    // Ronda m = 4 (fusio final de les dues meitats de mida 4)
    {
        id: 7,
        m: 4,
        i: 0,
        call: "merge(T, 0, 3, 7)",
        array: [1, 2, 3, 4, 5, 6, 7, 8],
        activeRange: [0, 7],
        leftSubRange: [0, 3],
        rightSubRange: [4, 7],
        isFinal: true,
    },
];

export default function MergeBottomUpVisualizer() {
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

    return (
        <div className="w-full flex flex-col items-center gap-5 my-8 font-mono select-none not-prose px-2">

            {/* CONTROLS DE REPRODUCCIÓ MINIMALISTES */}
            <div className="flex items-center gap-3">
                {/* Indicador de mida de bloc m */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/60 border border-white/10 text-xs">
                    <span className="text-slate-500">mida bloc:</span>
                    <span className="text-sky-300 font-bold">m = {step.m}</span>
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

            {/* DIBUIX DEL VECTOR T I LES CEL·LES */}
            <div className="w-full max-w-xl flex flex-col items-center gap-3 py-1">

                {/* CEL·LES DEL VECTOR T */}
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                    <span className="text-xs font-bold text-slate-500 mr-1">T:</span>

                    {step.array.map((val, idx) => {
                        const inLeft = idx >= step.leftSubRange[0] && idx <= step.leftSubRange[1];
                        const inRight = idx >= step.rightSubRange[0] && idx <= step.rightSubRange[1];
                        const isActive = idx >= step.activeRange[0] && idx <= step.activeRange[1];

                        let cellClass = "bg-slate-900/60 border-slate-800 text-slate-300";

                        if (step.isFinal) {
                            cellClass = "bg-emerald-950/60 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.3)]";
                        } else if (inLeft) {
                            cellClass = "bg-sky-950/60 border-sky-400 text-sky-200 scale-105 shadow-[0_0_10px_rgba(56,189,248,0.25)]";
                        } else if (inRight) {
                            cellClass = "bg-purple-950/60 border-purple-400 text-purple-200 scale-105 shadow-[0_0_10px_rgba(192,132,252,0.25)]";
                        } else if (stepIdx > 0 && idx < step.activeRange[0]) {
                            // Elements ja ordenats en aquesta ronda
                            cellClass = "bg-slate-900/90 border-slate-700 text-slate-200";
                        }

                        return (
                            <div key={`bu-cell-${idx}`} className="flex flex-col items-center gap-1">
                                {/* Índex superior */}
                                <span className="text-[10px] text-slate-500 font-mono">{idx}</span>

                                {/* Cel·la */}
                                <div
                                    className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl border-2 flex items-center justify-center font-bold text-sm sm:text-base transition-all duration-300 ${cellClass}`}
                                >
                                    {val}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* GUIA DE BLOCS DE MIDA M SOTA EL VECTOR */}
                <div className="w-full flex items-center justify-center gap-1 sm:gap-2 px-6">
                    <div className="w-5" /> {/* Espaiador per alinear amb T: */}
                    <div className="grid grid-cols-4 gap-1 sm:gap-2 w-full max-w-[370px]">
                        {step.m === 1 && (
                            <>
                                <div className={`text-center py-0.5 rounded border text-[9px] font-bold transition-all duration-200 ${
                                    step.i === 0 ? "border-amber-500/40 text-amber-300 bg-amber-950/20" : "border-white/5 text-slate-600"
                                }`}>[0..1]</div>
                                <div className={`text-center py-0.5 rounded border text-[9px] font-bold transition-all duration-200 ${
                                    step.i === 2 ? "border-amber-500/40 text-amber-300 bg-amber-950/20" : "border-white/5 text-slate-600"
                                }`}>[2..3]</div>
                                <div className={`text-center py-0.5 rounded border text-[9px] font-bold transition-all duration-200 ${
                                    step.i === 4 ? "border-amber-500/40 text-amber-300 bg-amber-950/20" : "border-white/5 text-slate-600"
                                }`}>[4..5]</div>
                                <div className={`text-center py-0.5 rounded border text-[9px] font-bold transition-all duration-200 ${
                                    step.i === 6 ? "border-amber-500/40 text-amber-300 bg-amber-950/20" : "border-white/5 text-slate-600"
                                }`}>[6..7]</div>
                            </>
                        )}
                        {step.m === 2 && (
                            <>
                                <div className={`col-span-2 text-center py-0.5 rounded border text-[9px] font-bold transition-all duration-200 ${
                                    step.i === 0 ? "border-amber-500/40 text-amber-300 bg-amber-950/20" : "border-white/5 text-slate-600"
                                }`}>[0..3] (mida 4)</div>
                                <div className={`col-span-2 text-center py-0.5 rounded border text-[9px] font-bold transition-all duration-200 ${
                                    step.i === 4 ? "border-amber-500/40 text-amber-300 bg-amber-950/20" : "border-white/5 text-slate-600"
                                }`}>[4..7] (mida 4)</div>
                            </>
                        )}
                        {step.m === 4 && (
                            <div className="col-span-4 text-center py-0.5 rounded border border-emerald-500/40 text-emerald-300 bg-emerald-950/20 text-[9px] font-bold">
                                [0..7] (mida 8, vector complet)
                            </div>
                        )}
                    </div>
                </div>

                {/* INDICADOR DE LA CRIDA MERGE ACTIVA */}
                <div className="flex items-center gap-2 mt-1">
                    {step.isFinal ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold shadow-sm shadow-emerald-500/10">
                            <Check size={14} className="text-emerald-400" />
                            <span>{step.call}</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/60 border border-white/5 text-slate-300 text-xs font-mono">
                            <span className="text-slate-500">crida:</span>
                            <span className="text-slate-200 font-bold">{step.call}</span>
                        </div>
                    )}
                </div>

            </div>

        </div>
    );
}
