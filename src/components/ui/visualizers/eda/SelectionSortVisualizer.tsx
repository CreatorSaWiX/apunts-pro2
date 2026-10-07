"use client";

import React, { useState, useEffect } from 'react';
import { m as motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, RotateCcw, Play, Pause, Check } from 'lucide-react';
import { InlineMath } from 'react-katex';

interface Item {
    id: number;
    val: number;
}

interface StepData {
    iteration: string; // "Inicial", "i = 4", "i = 3", "i = 2", "i = 1", "Ordenat"
    i: number | null;
    items: Item[];
    maxIdx: number | null;
    comparingIdx: number | null;
    comparingResult?: string | null;
    swapped: [number, number] | null;
    sortedFrom: number; // elements a partir d'aquest índex estan definitivament ordenats (5 = cap)
    comparisons: number;
    totalComparisons: number;
    swaps: number;
    totalSwaps: number;
    action: string;
}

// IDs únics per conservar identitat física durant l'animació layout:
// 3 -> id:1, 8 -> id:2, 5 -> id:3, 1 -> id:4, 4 -> id:5
const STEPS: StepData[] = [
    // 0. Inicial
    {
        iteration: "Inicial",
        i: null,
        items: [
            { id: 1, val: 3 },
            { id: 2, val: 8 },
            { id: 3, val: 5 },
            { id: 4, val: 1 },
            { id: 5, val: 4 },
        ],
        maxIdx: null,
        comparingIdx: null,
        comparingResult: null,
        swapped: null,
        sortedFrom: 5,
        comparisons: 0,
        totalComparisons: 0,
        swaps: 0,
        totalSwaps: 0,
        action: "Estat inicial no ordenat: v = [3, 8, 5, 1, 4]",
    },

    // --- ITERACIÓ i = 4 (Cerca del màxim a v[0..4]) ---
    {
        iteration: "i = 4",
        i: 4,
        items: [
            { id: 1, val: 3 },
            { id: 2, val: 8 },
            { id: 3, val: 5 },
            { id: 4, val: 1 },
            { id: 5, val: 4 },
        ],
        maxIdx: 0,
        comparingIdx: null,
        comparingResult: null,
        swapped: null,
        sortedFrom: 5,
        comparisons: 0,
        totalComparisons: 0,
        swaps: 0,
        totalSwaps: 0,
        action: "i = 4: Cerca del màxim a v[0..4]. Candidat inicial a v[0] = 3",
    },
    {
        iteration: "i = 4",
        i: 4,
        items: [
            { id: 1, val: 3 },
            { id: 2, val: 8 },
            { id: 3, val: 5 },
            { id: 4, val: 1 },
            { id: 5, val: 4 },
        ],
        maxIdx: 1,
        comparingIdx: 1,
        comparingResult: "v[1]=8 > màx(v[0]=3)",
        swapped: null,
        sortedFrom: 5,
        comparisons: 1,
        totalComparisons: 1,
        swaps: 0,
        totalSwaps: 0,
        action: "Compara v[1]=8 > màx 3 -> Nou màxim provisional a v[1] = 8",
    },
    {
        iteration: "i = 4",
        i: 4,
        items: [
            { id: 1, val: 3 },
            { id: 2, val: 8 },
            { id: 3, val: 5 },
            { id: 4, val: 1 },
            { id: 5, val: 4 },
        ],
        maxIdx: 1,
        comparingIdx: 2,
        comparingResult: "v[2]=5 <= màx(v[1]=8)",
        swapped: null,
        sortedFrom: 5,
        comparisons: 1,
        totalComparisons: 2,
        swaps: 0,
        totalSwaps: 0,
        action: "Compara v[2]=5 <= màx 8 -> El màxim es manté a v[1] = 8",
    },
    {
        iteration: "i = 4",
        i: 4,
        items: [
            { id: 1, val: 3 },
            { id: 2, val: 8 },
            { id: 3, val: 5 },
            { id: 4, val: 1 },
            { id: 5, val: 4 },
        ],
        maxIdx: 1,
        comparingIdx: 3,
        comparingResult: "v[3]=1 <= màx(v[1]=8)",
        swapped: null,
        sortedFrom: 5,
        comparisons: 1,
        totalComparisons: 3,
        swaps: 0,
        totalSwaps: 0,
        action: "Compara v[3]=1 <= màx 8 -> El màxim es manté a v[1] = 8",
    },
    {
        iteration: "i = 4",
        i: 4,
        items: [
            { id: 1, val: 3 },
            { id: 2, val: 8 },
            { id: 3, val: 5 },
            { id: 4, val: 1 },
            { id: 5, val: 4 },
        ],
        maxIdx: 1,
        comparingIdx: 4,
        comparingResult: "v[4]=4 <= màx(v[1]=8)",
        swapped: null,
        sortedFrom: 5,
        comparisons: 1,
        totalComparisons: 4,
        swaps: 0,
        totalSwaps: 0,
        action: "Compara v[4]=4 <= màx 8 -> Màxim definitiu de v[0..4] a v[1] = 8",
    },
    {
        iteration: "i = 4",
        i: 4,
        items: [
            { id: 1, val: 3 },
            { id: 5, val: 4 },
            { id: 3, val: 5 },
            { id: 4, val: 1 },
            { id: 2, val: 8 },
        ],
        maxIdx: 4,
        comparingIdx: null,
        comparingResult: null,
        swapped: [1, 4],
        sortedFrom: 5,
        comparisons: 0,
        totalComparisons: 4,
        swaps: 1,
        totalSwaps: 1,
        action: "swap(v[1], v[4]): movem el màxim 8 a la darrera posició i = 4",
    },
    {
        iteration: "i = 4",
        i: 4,
        items: [
            { id: 1, val: 3 },
            { id: 5, val: 4 },
            { id: 3, val: 5 },
            { id: 4, val: 1 },
            { id: 2, val: 8 },
        ],
        maxIdx: null,
        comparingIdx: null,
        comparingResult: null,
        swapped: null,
        sortedFrom: 4,
        comparisons: 0,
        totalComparisons: 4,
        swaps: 0,
        totalSwaps: 1,
        action: "v[4] = 8 queda fixat al final del vector",
    },

    // --- ITERACIÓ i = 3 (Cerca del màxim a v[0..3]) ---
    {
        iteration: "i = 3",
        i: 3,
        items: [
            { id: 1, val: 3 },
            { id: 5, val: 4 },
            { id: 3, val: 5 },
            { id: 4, val: 1 },
            { id: 2, val: 8 },
        ],
        maxIdx: 0,
        comparingIdx: null,
        comparingResult: null,
        swapped: null,
        sortedFrom: 4,
        comparisons: 0,
        totalComparisons: 4,
        swaps: 0,
        totalSwaps: 1,
        action: "i = 3: Cerca del màxim a v[0..3]. Candidat inicial a v[0] = 3",
    },
    {
        iteration: "i = 3",
        i: 3,
        items: [
            { id: 1, val: 3 },
            { id: 5, val: 4 },
            { id: 3, val: 5 },
            { id: 4, val: 1 },
            { id: 2, val: 8 },
        ],
        maxIdx: 1,
        comparingIdx: 1,
        comparingResult: "v[1]=4 > màx(v[0]=3)",
        swapped: null,
        sortedFrom: 4,
        comparisons: 1,
        totalComparisons: 5,
        swaps: 0,
        totalSwaps: 1,
        action: "Compara v[1]=4 > màx 3 -> Nou màxim provisional a v[1] = 4",
    },
    {
        iteration: "i = 3",
        i: 3,
        items: [
            { id: 1, val: 3 },
            { id: 5, val: 4 },
            { id: 3, val: 5 },
            { id: 4, val: 1 },
            { id: 2, val: 8 },
        ],
        maxIdx: 2,
        comparingIdx: 2,
        comparingResult: "v[2]=5 > màx(v[1]=4)",
        swapped: null,
        sortedFrom: 4,
        comparisons: 1,
        totalComparisons: 6,
        swaps: 0,
        totalSwaps: 1,
        action: "Compara v[2]=5 > màx 4 -> Nou màxim provisional a v[2] = 5",
    },
    {
        iteration: "i = 3",
        i: 3,
        items: [
            { id: 1, val: 3 },
            { id: 5, val: 4 },
            { id: 3, val: 5 },
            { id: 4, val: 1 },
            { id: 2, val: 8 },
        ],
        maxIdx: 2,
        comparingIdx: 3,
        comparingResult: "v[3]=1 <= màx(v[2]=5)",
        swapped: null,
        sortedFrom: 4,
        comparisons: 1,
        totalComparisons: 7,
        swaps: 0,
        totalSwaps: 1,
        action: "Compara v[3]=1 <= màx 5 -> Màxim definitiu de v[0..3] a v[2] = 5",
    },
    {
        iteration: "i = 3",
        i: 3,
        items: [
            { id: 1, val: 3 },
            { id: 5, val: 4 },
            { id: 4, val: 1 },
            { id: 3, val: 5 },
            { id: 2, val: 8 },
        ],
        maxIdx: 3,
        comparingIdx: null,
        comparingResult: null,
        swapped: [2, 3],
        sortedFrom: 4,
        comparisons: 0,
        totalComparisons: 7,
        swaps: 1,
        totalSwaps: 2,
        action: "swap(v[2], v[3]): movem el màxim 5 a la posició i = 3",
    },
    {
        iteration: "i = 3",
        i: 3,
        items: [
            { id: 1, val: 3 },
            { id: 5, val: 4 },
            { id: 4, val: 1 },
            { id: 3, val: 5 },
            { id: 2, val: 8 },
        ],
        maxIdx: null,
        comparingIdx: null,
        comparingResult: null,
        swapped: null,
        sortedFrom: 3,
        comparisons: 0,
        totalComparisons: 7,
        swaps: 0,
        totalSwaps: 2,
        action: "v[3] = 5 queda fixat al subvector ordenat",
    },

    // --- ITERACIÓ i = 2 (Cerca del màxim a v[0..2]) ---
    {
        iteration: "i = 2",
        i: 2,
        items: [
            { id: 1, val: 3 },
            { id: 5, val: 4 },
            { id: 4, val: 1 },
            { id: 3, val: 5 },
            { id: 2, val: 8 },
        ],
        maxIdx: 0,
        comparingIdx: null,
        comparingResult: null,
        swapped: null,
        sortedFrom: 3,
        comparisons: 0,
        totalComparisons: 7,
        swaps: 0,
        totalSwaps: 2,
        action: "i = 2: Cerca del màxim a v[0..2]. Candidat inicial a v[0] = 3",
    },
    {
        iteration: "i = 2",
        i: 2,
        items: [
            { id: 1, val: 3 },
            { id: 5, val: 4 },
            { id: 4, val: 1 },
            { id: 3, val: 5 },
            { id: 2, val: 8 },
        ],
        maxIdx: 1,
        comparingIdx: 1,
        comparingResult: "v[1]=4 > màx(v[0]=3)",
        swapped: null,
        sortedFrom: 3,
        comparisons: 1,
        totalComparisons: 8,
        swaps: 0,
        totalSwaps: 2,
        action: "Compara v[1]=4 > màx 3 -> Nou màxim provisional a v[1] = 4",
    },
    {
        iteration: "i = 2",
        i: 2,
        items: [
            { id: 1, val: 3 },
            { id: 5, val: 4 },
            { id: 4, val: 1 },
            { id: 3, val: 5 },
            { id: 2, val: 8 },
        ],
        maxIdx: 1,
        comparingIdx: 2,
        comparingResult: "v[2]=1 <= màx(v[1]=4)",
        swapped: null,
        sortedFrom: 3,
        comparisons: 1,
        totalComparisons: 9,
        swaps: 0,
        totalSwaps: 2,
        action: "Compara v[2]=1 <= màx 4 -> Màxim definitiu de v[0..2] a v[1] = 4",
    },
    {
        iteration: "i = 2",
        i: 2,
        items: [
            { id: 1, val: 3 },
            { id: 4, val: 1 },
            { id: 5, val: 4 },
            { id: 3, val: 5 },
            { id: 2, val: 8 },
        ],
        maxIdx: 2,
        comparingIdx: null,
        comparingResult: null,
        swapped: [1, 2],
        sortedFrom: 3,
        comparisons: 0,
        totalComparisons: 9,
        swaps: 1,
        totalSwaps: 3,
        action: "swap(v[1], v[2]): movem el màxim 4 a la posició i = 2",
    },
    {
        iteration: "i = 2",
        i: 2,
        items: [
            { id: 1, val: 3 },
            { id: 4, val: 1 },
            { id: 5, val: 4 },
            { id: 3, val: 5 },
            { id: 2, val: 8 },
        ],
        maxIdx: null,
        comparingIdx: null,
        comparingResult: null,
        swapped: null,
        sortedFrom: 2,
        comparisons: 0,
        totalComparisons: 9,
        swaps: 0,
        totalSwaps: 3,
        action: "v[2] = 4 queda fixat al subvector ordenat",
    },

    // --- ITERACIÓ i = 1 (Cerca del màxim a v[0..1]) ---
    {
        iteration: "i = 1",
        i: 1,
        items: [
            { id: 1, val: 3 },
            { id: 4, val: 1 },
            { id: 5, val: 4 },
            { id: 3, val: 5 },
            { id: 2, val: 8 },
        ],
        maxIdx: 0,
        comparingIdx: null,
        comparingResult: null,
        swapped: null,
        sortedFrom: 2,
        comparisons: 0,
        totalComparisons: 9,
        swaps: 0,
        totalSwaps: 3,
        action: "i = 1: Cerca del màxim a v[0..1]. Candidat inicial a v[0] = 3",
    },
    {
        iteration: "i = 1",
        i: 1,
        items: [
            { id: 1, val: 3 },
            { id: 4, val: 1 },
            { id: 5, val: 4 },
            { id: 3, val: 5 },
            { id: 2, val: 8 },
        ],
        maxIdx: 0,
        comparingIdx: 1,
        comparingResult: "v[1]=1 <= màx(v[0]=3)",
        swapped: null,
        sortedFrom: 2,
        comparisons: 1,
        totalComparisons: 10,
        swaps: 0,
        totalSwaps: 3,
        action: "Compara v[1]=1 <= màx 3 -> Màxim definitiu de v[0..1] a v[0] = 3",
    },
    {
        iteration: "i = 1",
        i: 1,
        items: [
            { id: 4, val: 1 },
            { id: 1, val: 3 },
            { id: 5, val: 4 },
            { id: 3, val: 5 },
            { id: 2, val: 8 },
        ],
        maxIdx: 1,
        comparingIdx: null,
        comparingResult: null,
        swapped: [0, 1],
        sortedFrom: 2,
        comparisons: 0,
        totalComparisons: 10,
        swaps: 1,
        totalSwaps: 4,
        action: "swap(v[0], v[1]): movem el 3 a la posició i = 1",
    },
    {
        iteration: "i = 1",
        i: 1,
        items: [
            { id: 4, val: 1 },
            { id: 1, val: 3 },
            { id: 5, val: 4 },
            { id: 3, val: 5 },
            { id: 2, val: 8 },
        ],
        maxIdx: null,
        comparingIdx: null,
        comparingResult: null,
        swapped: null,
        sortedFrom: 1,
        comparisons: 0,
        totalComparisons: 10,
        swaps: 0,
        totalSwaps: 4,
        action: "v[1] = 3 queda fixat al subvector ordenat",
    },

    // --- FINAL: VECTOR COMPLETAMENT ORDENAT ---
    {
        iteration: "Ordenat",
        i: 0,
        items: [
            { id: 4, val: 1 },
            { id: 1, val: 3 },
            { id: 5, val: 4 },
            { id: 3, val: 5 },
            { id: 2, val: 8 },
        ],
        maxIdx: null,
        comparingIdx: null,
        comparingResult: null,
        swapped: null,
        sortedFrom: 0,
        comparisons: 0,
        totalComparisons: 10,
        swaps: 0,
        totalSwaps: 4,
        action: "v[0] = 1 queda fixat per exclusió. Vector completament ordenat!",
    },
];

const ITERATION_TABS = ["Inicial", "i = 4", "i = 3", "i = 2", "i = 1", "Ordenat"];

export default function SelectionSortVisualizer() {
    const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const step = STEPS[currentStepIdx];

    useEffect(() => {
        if (!isPlaying) return;

        const interval = setInterval(() => {
            setCurrentStepIdx(prev => {
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
        setCurrentStepIdx(prev => Math.max(0, prev - 1));
    };

    const nextStep = () => {
        setIsPlaying(false);
        setCurrentStepIdx(prev => Math.min(STEPS.length - 1, prev + 1));
    };

    const reset = () => {
        setIsPlaying(false);
        setCurrentStepIdx(0);
    };

    const togglePlay = () => {
        if (currentStepIdx >= STEPS.length - 1) {
            setCurrentStepIdx(0);
            setIsPlaying(true);
        } else {
            setIsPlaying(prev => !prev);
        }
    };

    const jumpToIteration = (iter: string) => {
        setIsPlaying(false);
        const idx = STEPS.findIndex(s => s.iteration === iter);
        if (idx !== -1) {
            setCurrentStepIdx(idx);
        }
    };

    return (
        <div className="w-full flex flex-col items-center gap-6 my-10 font-mono select-none not-prose px-2">

            {/* 1. SELECTOR D'ITERACIÓ I BOTONS DE CONTROL */}
            <div className="w-full max-w-xl flex flex-wrap items-center justify-between gap-3">
                {/* Píndoles d'iteració */}
                <div className="flex bg-slate-900/60 p-1 rounded-xl border border-white/5 gap-1 text-xs">
                    {ITERATION_TABS.map((iter) => {
                        const isCurrent = step.iteration === iter;
                        return (
                            <button
                                key={`tab-btn-${iter}`}
                                type="button"
                                onClick={() => jumpToIteration(iter)}
                                className={`px-2.5 py-1 rounded-lg font-bold transition-all duration-150 ${
                                    isCurrent
                                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                        : 'text-slate-400 hover:text-slate-200 border border-transparent'
                                }`}
                            >
                                {iter}
                            </button>
                        );
                    })}
                </div>

                {/* Controls Play / Anterior / Següent / Reset */}
                <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-500 mr-1 hidden sm:inline">
                        {currentStepIdx + 1}/{STEPS.length}
                    </span>
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
                        disabled={currentStepIdx === 0}
                        title="Pas anterior"
                        className="p-1.5 rounded-lg bg-slate-900/40 hover:bg-slate-800 border border-white/5 text-slate-400 hover:text-slate-200 transition disabled:opacity-30 disabled:pointer-events-none"
                    >
                        <ArrowLeft size={14} />
                    </button>
                    <button
                        type="button"
                        onClick={nextStep}
                        disabled={currentStepIdx === STEPS.length - 1}
                        title="Següent pas"
                        className="p-1.5 rounded-lg bg-slate-900/40 hover:bg-slate-800 border border-white/5 text-slate-400 hover:text-slate-200 transition disabled:opacity-30 disabled:pointer-events-none"
                    >
                        <ArrowRight size={14} />
                    </button>
                    <button
                        type="button"
                        onClick={reset}
                        title="Reiniciar a l'estat inicial"
                        className="p-1.5 rounded-lg bg-slate-900/40 hover:bg-slate-800 border border-white/5 text-slate-400 hover:text-slate-200 transition ml-1"
                    >
                        <RotateCcw size={14} />
                    </button>
                </div>
            </div>

            {/* 2. VECTOR VISUAL AMB CAXELLES ANIMADES */}
            <div className="relative flex flex-row items-center justify-center gap-3 sm:gap-4 py-8">
                {step.items.map((item, idx) => {
                    const isSorted = idx >= step.sortedFrom;
                    const isSwapped = step.swapped && (step.swapped[0] === idx || step.swapped[1] === idx);
                    const isMax = step.maxIdx === idx;
                    const isComparing = step.comparingIdx === idx;
                    const isBarrier = idx === step.sortedFrom && idx > 0;

                    let cellStyle = 'bg-[#0a0d14] border-slate-800 text-sky-400';
                    if (isSorted) {
                        cellStyle = 'bg-[#061e14] border-emerald-500/80 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.18)]';
                    } else if (isSwapped) {
                        cellStyle = 'bg-[#181206] border-amber-500/80 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)] scale-105';
                    } else if (isComparing) {
                        cellStyle = 'bg-[#071927] border-sky-400 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.25)] scale-105';
                    } else if (isMax) {
                        cellStyle = 'bg-[#150a21] border-purple-400 text-purple-300 shadow-[0_0_12px_rgba(192,132,252,0.25)]';
                    }

                    return (
                        <React.Fragment key={item.id}>
                            {/* Barra divisòria | entre no-ordenat i ordenat */}
                            {isBarrier && (
                                <div className="relative flex flex-col items-center justify-center h-16 w-2 mx-1">
                                    <div className="w-0.5 h-16 bg-emerald-500/60 rounded-full" />
                                    <span className="absolute -top-5 text-[9px] font-bold text-emerald-400 uppercase tracking-wider">
                                        |
                                    </span>
                                </div>
                            )}

                            {/* Casella del vector */}
                            <motion.div
                                layout
                                transition={{
                                    type: "spring",
                                    stiffness: 350,
                                    damping: 28,
                                }}
                                className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 flex flex-col items-center justify-center transition-colors duration-200 ${cellStyle}`}
                            >
                                {/* Valor gran de la casella */}
                                <span className="font-bold text-xl sm:text-2xl">
                                    {item.val}
                                </span>

                                {/* Índex del vector [0..4] */}
                                <div className="absolute -bottom-5 text-[10px] font-bold text-slate-500">
                                    [{idx}]
                                </div>

                                {/* Marcador i indicador superior */}
                                {isSwapped ? (
                                    <div className="absolute -top-5 px-1.5 py-0.2 rounded bg-amber-500/20 border border-amber-500/40 text-[9px] font-bold text-amber-300">
                                        swap
                                    </div>
                                ) : isComparing ? (
                                    <div className="absolute -top-5 px-1.5 py-0.2 rounded bg-sky-500/20 border border-sky-500/40 text-[9px] font-bold text-sky-300">
                                        compara
                                    </div>
                                ) : isMax && !isSorted ? (
                                    <div className="absolute -top-5 px-1.5 py-0.2 rounded bg-purple-500/20 border border-purple-500/40 text-[9px] font-bold text-purple-300">
                                        màx
                                    </div>
                                ) : isSorted && idx === step.sortedFrom ? (
                                    <div className="absolute -top-5 px-1.5 py-0.2 rounded bg-emerald-500/20 border border-emerald-500/40 text-[9px] font-bold text-emerald-300">
                                        fixat
                                    </div>
                                ) : null}
                            </motion.div>
                        </React.Fragment>
                    );
                })}
            </div>

            {/* 3. DADES D'ACCIÓ, AVALUACIÓ I COMPARACIONS EN DIRECTE */}
            <div className="w-full max-w-xl flex flex-col gap-2 pt-2 border-t border-white/5 text-xs text-slate-400">
                {/* Resultat de la comparació actual si s'està avaluant */}
                {step.comparingResult && (
                    <div className="flex justify-center">
                        <div className="text-[11px] font-mono px-2.5 py-0.5 rounded-lg border bg-slate-900/60 border-white/10 text-slate-300">
                            avaluant: <span className="text-sky-300 font-bold">{step.comparingResult}</span>
                        </div>
                    </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3">
                    {/* Darrera operació */}
                    <div className="flex items-center gap-1.5">
                        <span className="text-slate-500">Acció:</span>
                        <span className="font-mono font-bold text-slate-200 bg-slate-900/60 px-2 py-0.5 rounded border border-white/5">
                            {step.action}
                        </span>
                    </div>

                    {/* Comparacions acumulades */}
                    <div className="flex items-center gap-2">
                        <span className="text-slate-500">Comp:</span>
                        <span className="font-mono font-bold text-sky-300">
                            {step.comparisons > 0 ? `+${step.comparisons}` : '0'}
                        </span>
                        <span className="text-slate-600">|</span>
                        <span className="text-slate-500">Total:</span>
                        <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            {step.totalComparisons} / 10
                        </span>
                        <span className="text-[11px] text-slate-500 hidden sm:inline">
                            (<InlineMath math="n(n-1)/2" />)
                        </span>
                    </div>
                </div>
            </div>

        </div>
    );
}
