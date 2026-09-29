"use client";

import React, { useState } from 'react';
import { m as motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';

interface Item {
    id: number;
    val: number;
}

interface StepData {
    name: string;
    k: number | null;
    items: Item[];
    insertedId: number | null;
    insertedIdx: number | null;
    sortedUpTo: number; // índex fins on el prefix està ordenat (inclusiu)
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
    {
        name: "Inicial",
        k: null,
        items: [
            { id: 1, val: 3 },
            { id: 2, val: 8 },
            { id: 3, val: 5 },
            { id: 4, val: 1 },
            { id: 5, val: 4 },
        ],
        insertedId: null,
        insertedIdx: null,
        sortedUpTo: 0,
        comparisons: 0,
        totalComparisons: 0,
        swaps: 0,
        totalSwaps: 0,
        action: "Prefix v[0..0] ordenat per definició",
    },
    {
        name: "k = 1",
        k: 1,
        items: [
            { id: 1, val: 3 },
            { id: 2, val: 8 },
            { id: 3, val: 5 },
            { id: 4, val: 1 },
            { id: 5, val: 4 },
        ],
        insertedId: 2,
        insertedIdx: 1,
        sortedUpTo: 1,
        comparisons: 1,
        totalComparisons: 1,
        swaps: 0,
        totalSwaps: 0,
        action: "Inserim 8: comparem 8 ≥ 3 (atura immediat)",
    },
    {
        name: "k = 2",
        k: 2,
        items: [
            { id: 1, val: 3 },
            { id: 3, val: 5 },
            { id: 2, val: 8 },
            { id: 4, val: 1 },
            { id: 5, val: 4 },
        ],
        insertedId: 3,
        insertedIdx: 1,
        sortedUpTo: 2,
        comparisons: 2,
        totalComparisons: 3,
        swaps: 1,
        totalSwaps: 1,
        action: "Inserim 5: 5 < 8 (swap), 5 ≥ 3 (atura)",
    },
    {
        name: "k = 3",
        k: 3,
        items: [
            { id: 4, val: 1 },
            { id: 1, val: 3 },
            { id: 3, val: 5 },
            { id: 2, val: 8 },
            { id: 5, val: 4 },
        ],
        insertedId: 4,
        insertedIdx: 0,
        sortedUpTo: 3,
        comparisons: 3,
        totalComparisons: 6,
        swaps: 3,
        totalSwaps: 4,
        action: "Inserim 1: menor que 8, 5, 3 (arriba a posició 0)",
    },
    {
        name: "k = 4",
        k: 4,
        items: [
            { id: 4, val: 1 },
            { id: 1, val: 3 },
            { id: 5, val: 4 },
            { id: 3, val: 5 },
            { id: 2, val: 8 },
        ],
        insertedId: 5,
        insertedIdx: 2,
        sortedUpTo: 4,
        comparisons: 3,
        totalComparisons: 9,
        swaps: 2,
        totalSwaps: 6,
        action: "Inserim 4: menor que 8, 5; major que 3 (atura)",
    },
    {
        name: "Ordenat",
        k: null,
        items: [
            { id: 4, val: 1 },
            { id: 1, val: 3 },
            { id: 5, val: 4 },
            { id: 3, val: 5 },
            { id: 2, val: 8 },
        ],
        insertedId: null,
        insertedIdx: null,
        sortedUpTo: 4,
        comparisons: 0,
        totalComparisons: 9,
        swaps: 0,
        totalSwaps: 6,
        action: "Vector completament ordenat",
    },
];

export default function InsertionSortVisualizer() {
    const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);

    const step = STEPS[currentStepIdx];

    const prevStep = () => setCurrentStepIdx(prev => Math.max(0, prev - 1));
    const nextStep = () => setCurrentStepIdx(prev => Math.min(STEPS.length - 1, prev + 1));
    const reset = () => setCurrentStepIdx(0);

    return (
        <div className="w-full flex flex-col items-center gap-6 my-10 font-mono select-none not-prose px-2">

            {/* 1. SELECTOR D'ITERACIÓ I CONTROLS MINIMALISTES */}
            <div className="w-full max-w-xl flex flex-wrap items-center justify-between gap-3">
                {/* Píndoles d'iteració */}
                <div className="flex bg-slate-900/60 p-1 rounded-xl border border-white/5 gap-1 text-xs">
                    {STEPS.map((s, idx) => {
                        const isCurrent = currentStepIdx === idx;
                        return (
                            <button
                                key={`step-btn-${idx}`}
                                type="button"
                                onClick={() => setCurrentStepIdx(idx)}
                                className={`px-2.5 py-1 rounded-lg font-bold transition-all duration-150 ${
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

                {/* Controls Anterior / Següent / Reset */}
                <div className="flex items-center gap-1">
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
                    const isInserted = step.insertedId === item.id;
                    const isBarrier = idx === step.sortedUpTo + 1;

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
                                className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 flex flex-col items-center justify-center transition-colors duration-200 ${
                                    isInserted
                                        ? 'bg-[#181206] border-amber-500/80 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                                        : isSorted
                                        ? 'bg-[#061e14] border-emerald-500/80 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.18)]'
                                        : 'bg-[#0a0d14] border-slate-800 text-sky-400'
                                }`}
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
                                {isInserted && (
                                    <div className="absolute -top-5 px-1.5 py-0.2 rounded bg-amber-500/20 border border-amber-500/40 text-[9px] font-bold text-amber-300">
                                        insert
                                    </div>
                                )}
                            </motion.div>
                        </React.Fragment>
                    );
                })}
            </div>

            {/* 3. DADES D'ACCIÓ, COMPARACIONS I INTERCANVIS EN DIRECTE */}
            <div className="w-full max-w-xl flex flex-wrap items-center justify-between gap-3 text-xs pt-2 border-t border-white/5 text-slate-400">
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
    );
}
