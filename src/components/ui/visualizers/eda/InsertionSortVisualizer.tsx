"use client";

import React, { useState, useEffect } from 'react';
import { m as motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, RotateCcw, Play, Pause } from 'lucide-react';

interface Item {
    id: number;
    val: number;
}

interface StepData {
    iteration: string; // "Inicial", "k = 1", "k = 2", "k = 3", "k = 4", "Ordenat"
    k: number | null;
    items: Item[];
    insertingId: number | null;
    currentPos: number | null; // on es troba l'element que estem inserint
    comparingPos: number | null; // índex de l'element amb qui es compara
    comparingResult?: string | null;
    swapped: [number, number] | null;
    sortedUpTo: number; // índex fins on el prefix està garantit ordenat (inclusiu)
    comparisons: number;
    totalComparisons: number;
    swaps: number;
    totalSwaps: number;
    action: string;
}

// Exemple de la teoria: v = [3, 8, 5, 1, 4]
// IDs únics per conservar identitat física durant l'animació layout:
// 3 -> id:1, 8 -> id:2, 5 -> id:3, 1 -> id:4, 4 -> id:5
const STEPS: StepData[] = [
    // 0. Inicial
    {
        iteration: "Inicial",
        k: null,
        items: [
            { id: 1, val: 3 },
            { id: 2, val: 8 },
            { id: 3, val: 5 },
            { id: 4, val: 1 },
            { id: 5, val: 4 },
        ],
        insertingId: null,
        currentPos: null,
        comparingPos: null,
        comparingResult: null,
        swapped: null,
        sortedUpTo: 0,
        comparisons: 0,
        totalComparisons: 0,
        swaps: 0,
        totalSwaps: 0,
        action: "Prefix v[0..0] ordenat per definició",
    },

    // --- ITERACIÓ k = 1 ---
    {
        iteration: "k = 1",
        k: 1,
        items: [
            { id: 1, val: 3 },
            { id: 2, val: 8 },
            { id: 3, val: 5 },
            { id: 4, val: 1 },
            { id: 5, val: 4 },
        ],
        insertingId: 2,
        currentPos: 1,
        comparingPos: null,
        comparingResult: null,
        swapped: null,
        sortedUpTo: 0,
        comparisons: 0,
        totalComparisons: 0,
        swaps: 0,
        totalSwaps: 0,
        action: "k = 1: Seleccionem x = v[1] = 8 per inserir al prefix ordenat v[0..0]",
    },
    {
        iteration: "k = 1",
        k: 1,
        items: [
            { id: 1, val: 3 },
            { id: 2, val: 8 },
            { id: 3, val: 5 },
            { id: 4, val: 1 },
            { id: 5, val: 4 },
        ],
        insertingId: 2,
        currentPos: 1,
        comparingPos: 0,
        comparingResult: "x=8 >= v[0]=3 (aturat)",
        swapped: null,
        sortedUpTo: 0,
        comparisons: 1,
        totalComparisons: 1,
        swaps: 0,
        totalSwaps: 0,
        action: "Compara x=8 >= v[0]=3 -> Ja és major, la inserció s'atura a la 1a comprovació",
    },
    {
        iteration: "k = 1",
        k: 1,
        items: [
            { id: 1, val: 3 },
            { id: 2, val: 8 },
            { id: 3, val: 5 },
            { id: 4, val: 1 },
            { id: 5, val: 4 },
        ],
        insertingId: null,
        currentPos: null,
        comparingPos: null,
        comparingResult: null,
        swapped: null,
        sortedUpTo: 1,
        comparisons: 0,
        totalComparisons: 1,
        swaps: 0,
        totalSwaps: 0,
        action: "Prefix ordenat ampliat: v[0..1] = [3, 8] queda ordenat",
    },

    // --- ITERACIÓ k = 2 ---
    {
        iteration: "k = 2",
        k: 2,
        items: [
            { id: 1, val: 3 },
            { id: 2, val: 8 },
            { id: 3, val: 5 },
            { id: 4, val: 1 },
            { id: 5, val: 4 },
        ],
        insertingId: 3,
        currentPos: 2,
        comparingPos: null,
        comparingResult: null,
        swapped: null,
        sortedUpTo: 1,
        comparisons: 0,
        totalComparisons: 1,
        swaps: 0,
        totalSwaps: 0,
        action: "k = 2: Seleccionem x = v[2] = 5 per inserir al prefix v[0..1]",
    },
    {
        iteration: "k = 2",
        k: 2,
        items: [
            { id: 1, val: 3 },
            { id: 2, val: 8 },
            { id: 3, val: 5 },
            { id: 4, val: 1 },
            { id: 5, val: 4 },
        ],
        insertingId: 3,
        currentPos: 2,
        comparingPos: 1,
        comparingResult: "x=5 < v[1]=8 (cal moure)",
        swapped: null,
        sortedUpTo: 1,
        comparisons: 1,
        totalComparisons: 2,
        swaps: 0,
        totalSwaps: 0,
        action: "Compara x=5 < v[1]=8 -> Com que 5 < 8, cal intercanviar cap a l'esquerra",
    },
    {
        iteration: "k = 2",
        k: 2,
        items: [
            { id: 1, val: 3 },
            { id: 3, val: 5 },
            { id: 2, val: 8 },
            { id: 4, val: 1 },
            { id: 5, val: 4 },
        ],
        insertingId: 3,
        currentPos: 1,
        comparingPos: null,
        comparingResult: null,
        swapped: [1, 2],
        sortedUpTo: 1,
        comparisons: 0,
        totalComparisons: 2,
        swaps: 1,
        totalSwaps: 1,
        action: "swap(v[1], v[2]): el 5 avança a la posició 1",
    },
    {
        iteration: "k = 2",
        k: 2,
        items: [
            { id: 1, val: 3 },
            { id: 3, val: 5 },
            { id: 2, val: 8 },
            { id: 4, val: 1 },
            { id: 5, val: 4 },
        ],
        insertingId: 3,
        currentPos: 1,
        comparingPos: 0,
        comparingResult: "x=5 >= v[0]=3 (aturat)",
        swapped: null,
        sortedUpTo: 1,
        comparisons: 1,
        totalComparisons: 3,
        swaps: 0,
        totalSwaps: 1,
        action: "Compara x=5 >= v[0]=3 -> Element anterior és menor o igual, la inserció s'atura",
    },
    {
        iteration: "k = 2",
        k: 2,
        items: [
            { id: 1, val: 3 },
            { id: 3, val: 5 },
            { id: 2, val: 8 },
            { id: 4, val: 1 },
            { id: 5, val: 4 },
        ],
        insertingId: null,
        currentPos: null,
        comparingPos: null,
        comparingResult: null,
        swapped: null,
        sortedUpTo: 2,
        comparisons: 0,
        totalComparisons: 3,
        swaps: 0,
        totalSwaps: 1,
        action: "Prefix ordenat consolidat: v[0..2] = [3, 5, 8]",
    },

    // --- ITERACIÓ k = 3 ---
    {
        iteration: "k = 3",
        k: 3,
        items: [
            { id: 1, val: 3 },
            { id: 3, val: 5 },
            { id: 2, val: 8 },
            { id: 4, val: 1 },
            { id: 5, val: 4 },
        ],
        insertingId: 4,
        currentPos: 3,
        comparingPos: null,
        comparingResult: null,
        swapped: null,
        sortedUpTo: 2,
        comparisons: 0,
        totalComparisons: 3,
        swaps: 0,
        totalSwaps: 1,
        action: "k = 3: Seleccionem x = v[3] = 1 per inserir al prefix v[0..2]",
    },
    {
        iteration: "k = 3",
        k: 3,
        items: [
            { id: 1, val: 3 },
            { id: 3, val: 5 },
            { id: 2, val: 8 },
            { id: 4, val: 1 },
            { id: 5, val: 4 },
        ],
        insertingId: 4,
        currentPos: 3,
        comparingPos: 2,
        comparingResult: "x=1 < v[2]=8 (cal moure)",
        swapped: null,
        sortedUpTo: 2,
        comparisons: 1,
        totalComparisons: 4,
        swaps: 0,
        totalSwaps: 1,
        action: "Compara x=1 < v[2]=8 -> 1 és menor que 8, cal intercanviar",
    },
    {
        iteration: "k = 3",
        k: 3,
        items: [
            { id: 1, val: 3 },
            { id: 3, val: 5 },
            { id: 4, val: 1 },
            { id: 2, val: 8 },
            { id: 5, val: 4 },
        ],
        insertingId: 4,
        currentPos: 2,
        comparingPos: null,
        comparingResult: null,
        swapped: [2, 3],
        sortedUpTo: 2,
        comparisons: 0,
        totalComparisons: 4,
        swaps: 1,
        totalSwaps: 2,
        action: "swap(v[2], v[3]): l'1 passa a la posició 2",
    },
    {
        iteration: "k = 3",
        k: 3,
        items: [
            { id: 1, val: 3 },
            { id: 3, val: 5 },
            { id: 4, val: 1 },
            { id: 2, val: 8 },
            { id: 5, val: 4 },
        ],
        insertingId: 4,
        currentPos: 2,
        comparingPos: 1,
        comparingResult: "x=1 < v[1]=5 (cal moure)",
        swapped: null,
        sortedUpTo: 2,
        comparisons: 1,
        totalComparisons: 5,
        swaps: 0,
        totalSwaps: 2,
        action: "Compara x=1 < v[1]=5 -> 1 és menor que 5, continua retrocedint",
    },
    {
        iteration: "k = 3",
        k: 3,
        items: [
            { id: 1, val: 3 },
            { id: 4, val: 1 },
            { id: 3, val: 5 },
            { id: 2, val: 8 },
            { id: 5, val: 4 },
        ],
        insertingId: 4,
        currentPos: 1,
        comparingPos: null,
        comparingResult: null,
        swapped: [1, 2],
        sortedUpTo: 2,
        comparisons: 0,
        totalComparisons: 5,
        swaps: 1,
        totalSwaps: 3,
        action: "swap(v[1], v[2]): l'1 passa a la posició 1",
    },
    {
        iteration: "k = 3",
        k: 3,
        items: [
            { id: 1, val: 3 },
            { id: 4, val: 1 },
            { id: 3, val: 5 },
            { id: 2, val: 8 },
            { id: 5, val: 4 },
        ],
        insertingId: 4,
        currentPos: 1,
        comparingPos: 0,
        comparingResult: "x=1 < v[0]=3 (cal moure)",
        swapped: null,
        sortedUpTo: 2,
        comparisons: 1,
        totalComparisons: 6,
        swaps: 0,
        totalSwaps: 3,
        action: "Compara x=1 < v[0]=3 -> 1 és menor que 3, ha d'arribar a l'inici del vector",
    },
    {
        iteration: "k = 3",
        k: 3,
        items: [
            { id: 4, val: 1 },
            { id: 1, val: 3 },
            { id: 3, val: 5 },
            { id: 2, val: 8 },
            { id: 5, val: 4 },
        ],
        insertingId: 4,
        currentPos: 0,
        comparingPos: null,
        comparingResult: null,
        swapped: [0, 1],
        sortedUpTo: 2,
        comparisons: 0,
        totalComparisons: 6,
        swaps: 1,
        totalSwaps: 4,
        action: "swap(v[0], v[1]): l'1 arriba a la posició 0 (inici assolit)",
    },
    {
        iteration: "k = 3",
        k: 3,
        items: [
            { id: 4, val: 1 },
            { id: 1, val: 3 },
            { id: 3, val: 5 },
            { id: 2, val: 8 },
            { id: 5, val: 4 },
        ],
        insertingId: null,
        currentPos: null,
        comparingPos: null,
        comparingResult: null,
        swapped: null,
        sortedUpTo: 3,
        comparisons: 0,
        totalComparisons: 6,
        swaps: 0,
        totalSwaps: 4,
        action: "Prefix ordenat consolidat: v[0..3] = [1, 3, 5, 8]",
    },

    // --- ITERACIÓ k = 4 ---
    {
        iteration: "k = 4",
        k: 4,
        items: [
            { id: 4, val: 1 },
            { id: 1, val: 3 },
            { id: 3, val: 5 },
            { id: 2, val: 8 },
            { id: 5, val: 4 },
        ],
        insertingId: 5,
        currentPos: 4,
        comparingPos: null,
        comparingResult: null,
        swapped: null,
        sortedUpTo: 3,
        comparisons: 0,
        totalComparisons: 6,
        swaps: 0,
        totalSwaps: 4,
        action: "k = 4: Seleccionem x = v[4] = 4 per inserir al prefix v[0..3]",
    },
    {
        iteration: "k = 4",
        k: 4,
        items: [
            { id: 4, val: 1 },
            { id: 1, val: 3 },
            { id: 3, val: 5 },
            { id: 2, val: 8 },
            { id: 5, val: 4 },
        ],
        insertingId: 5,
        currentPos: 4,
        comparingPos: 3,
        comparingResult: "x=4 < v[3]=8 (cal moure)",
        swapped: null,
        sortedUpTo: 3,
        comparisons: 1,
        totalComparisons: 7,
        swaps: 0,
        totalSwaps: 4,
        action: "Compara x=4 < v[3]=8 -> 4 < 8, cal intercanviar",
    },
    {
        iteration: "k = 4",
        k: 4,
        items: [
            { id: 4, val: 1 },
            { id: 1, val: 3 },
            { id: 3, val: 5 },
            { id: 5, val: 4 },
            { id: 2, val: 8 },
        ],
        insertingId: 5,
        currentPos: 3,
        comparingPos: null,
        comparingResult: null,
        swapped: [3, 4],
        sortedUpTo: 3,
        comparisons: 0,
        totalComparisons: 7,
        swaps: 1,
        totalSwaps: 5,
        action: "swap(v[3], v[4]): el 4 avança a la posició 3",
    },
    {
        iteration: "k = 4",
        k: 4,
        items: [
            { id: 4, val: 1 },
            { id: 1, val: 3 },
            { id: 3, val: 5 },
            { id: 5, val: 4 },
            { id: 2, val: 8 },
        ],
        insertingId: 5,
        currentPos: 3,
        comparingPos: 2,
        comparingResult: "x=4 < v[2]=5 (cal moure)",
        swapped: null,
        sortedUpTo: 3,
        comparisons: 1,
        totalComparisons: 8,
        swaps: 0,
        totalSwaps: 5,
        action: "Compara x=4 < v[2]=5 -> 4 < 5, continua avançant a l'esquerra",
    },
    {
        iteration: "k = 4",
        k: 4,
        items: [
            { id: 4, val: 1 },
            { id: 1, val: 3 },
            { id: 5, val: 4 },
            { id: 3, val: 5 },
            { id: 2, val: 8 },
        ],
        insertingId: 5,
        currentPos: 2,
        comparingPos: null,
        comparingResult: null,
        swapped: [2, 3],
        sortedUpTo: 3,
        comparisons: 0,
        totalComparisons: 8,
        swaps: 1,
        totalSwaps: 6,
        action: "swap(v[2], v[3]): el 4 avança a la posició 2",
    },
    {
        iteration: "k = 4",
        k: 4,
        items: [
            { id: 4, val: 1 },
            { id: 1, val: 3 },
            { id: 5, val: 4 },
            { id: 3, val: 5 },
            { id: 2, val: 8 },
        ],
        insertingId: 5,
        currentPos: 2,
        comparingPos: 1,
        comparingResult: "x=4 >= v[1]=3 (aturat)",
        swapped: null,
        sortedUpTo: 3,
        comparisons: 1,
        totalComparisons: 9,
        swaps: 0,
        totalSwaps: 6,
        action: "Compara x=4 >= v[1]=3 -> 4 >= 3, la inserció s'atura a la posició 2",
    },

    // --- FINAL: VECTOR COMPLETAMENT ORDENAT ---
    {
        iteration: "Ordenat",
        k: null,
        items: [
            { id: 4, val: 1 },
            { id: 1, val: 3 },
            { id: 5, val: 4 },
            { id: 3, val: 5 },
            { id: 2, val: 8 },
        ],
        insertingId: null,
        currentPos: null,
        comparingPos: null,
        comparingResult: null,
        swapped: null,
        sortedUpTo: 4,
        comparisons: 0,
        totalComparisons: 9,
        swaps: 0,
        totalSwaps: 6,
        action: "Vector completament ordenat: [1, 3, 4, 5, 8]!",
    },
];

const ITERATION_TABS = ["Inicial", "k = 1", "k = 2", "k = 3", "k = 4", "Ordenat"];

export default function InsertionSortVisualizer() {
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

            {/* 1. SELECTOR D'ITERACIÓ I CONTROLS */}
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

            {/* 2. VECTOR VISUAL AMB CAXELLES ANIMADES (LAYOUT ANIMATION) */}
            <div className="relative flex flex-row items-center justify-center gap-3 sm:gap-4 py-8">
                {step.items.map((item, idx) => {
                    const isSorted = idx <= step.sortedUpTo;
                    const isCurrentInserting = step.insertingId === item.id;
                    const isComparingTarget = step.comparingPos === idx;
                    const isSwapped = step.swapped && (step.swapped[0] === idx || step.swapped[1] === idx);
                    const isBarrier = idx === step.sortedUpTo + 1 && step.sortedUpTo < step.items.length - 1;

                    let cellStyle = 'bg-[#0a0d14] border-slate-800 text-sky-400';
                    if (isCurrentInserting) {
                        cellStyle = 'bg-[#181206] border-amber-500/80 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)] scale-105';
                    } else if (isSwapped) {
                        cellStyle = 'bg-[#181206] border-amber-500/80 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)] scale-105';
                    } else if (isComparingTarget) {
                        cellStyle = 'bg-[#071927] border-sky-400 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.25)]';
                    } else if (isSorted) {
                        cellStyle = 'bg-[#061e14] border-emerald-500/80 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.18)]';
                    }

                    return (
                        <React.Fragment key={item.id}>
                            {/* Barra divisòria | entre la part ordenada (esquerra) i la no explorada (dreta) */}
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
                                ) : isCurrentInserting ? (
                                    <div className="absolute -top-5 px-1.5 py-0.2 rounded bg-amber-500/20 border border-amber-500/40 text-[9px] font-bold text-amber-300">
                                        insert
                                    </div>
                                ) : isComparingTarget ? (
                                    <div className="absolute -top-5 px-1.5 py-0.2 rounded bg-sky-500/20 border border-sky-500/40 text-[9px] font-bold text-sky-300">
                                        compara
                                    </div>
                                ) : null}
                            </motion.div>
                        </React.Fragment>
                    );
                })}
            </div>

            {/* 3. DADES D'ACCIÓ, COMPARACIONS I INTERCANVIS EN DIRECTE */}
            <div className="w-full max-w-xl flex flex-col gap-2 pt-2 border-t border-white/5 text-xs text-slate-400">
                {/* Resultat de la comparació actual si s'està avaluant */}
                {step.comparingResult && (
                    <div className="flex justify-center">
                        <div className="text-[11px] font-mono px-2.5 py-0.5 rounded-lg border bg-slate-900/60 border-white/10 text-slate-300">
                            avaluant: <span className="text-amber-300 font-bold">{step.comparingResult}</span>
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

                    {/* Comptadors de cost */}
                    <div className="flex items-center gap-2">
                        <span className="text-slate-500">Comp:</span>
                        <span className="font-mono font-bold text-sky-300">
                            {step.comparisons > 0 ? `+${step.comparisons}` : '0'}
                        </span>
                        <span className="text-slate-500">({step.totalComparisons})</span>

                        <span className="text-slate-600">|</span>

                        <span className="text-slate-500">Swaps:</span>
                        <span className="font-mono font-bold text-amber-300">
                            {step.swaps > 0 ? `+${step.swaps}` : '0'}
                        </span>
                        <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                            total: {step.totalSwaps}
                        </span>
                    </div>
                </div>
            </div>

        </div>
    );
}
