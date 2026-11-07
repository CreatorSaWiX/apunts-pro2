"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type PQVizType = "unordered" | "sorted" | "avl" | "heap";

interface PriorityQueueCompareVisualizerProps {
    type?: PQVizType;
}

// =========================================================================
// 1. VECTOR NO ORDENAT (Escaneig pas a pas: només botons < i >)
// =========================================================================
function UnorderedVectorMiniViz() {
    const items = [7, 2, 9, 1, 5];
    const [step, setStep] = useState<number>(0);

    // Calcula el mínim vist fins a l'element actual
    let currentMinIdx = 0;
    for (let i = 1; i <= step; i++) {
        if (items[i] < items[currentMinIdx]) {
            currentMinIdx = i;
        }
    }

    const goPrev = () => setStep((prev) => Math.max(0, prev - 1));
    const goNext = () => setStep((prev) => Math.min(items.length - 1, prev + 1));

    return (
        <div className="flex items-center gap-2.5 font-mono text-xs select-none not-prose py-0.5">
            {/* Cel·les del vector */}
            <div className="flex items-center gap-1">
                {items.map((val, idx) => {
                    const isExamining = idx === step;
                    const isCurrentMin = idx === currentMinIdx;
                    const isUnseen = idx > step;

                    return (
                        <div
                            key={`unord-${idx}`}
                            className={`relative w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px] transition-all duration-150 ${
                                isExamining
                                    ? "bg-amber-500/25 border-2 border-amber-400 text-amber-300 scale-105 shadow-[0_0_8px_rgba(251,191,36,0.3)] z-10"
                                    : isCurrentMin
                                    ? "bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300"
                                    : isUnseen
                                    ? "bg-slate-900/40 border border-white/5 text-slate-600"
                                    : "bg-slate-900/80 border border-white/10 text-slate-400"
                            }`}
                        >
                            <span>{val}</span>
                            <span className="text-[7px] text-slate-500 absolute -bottom-3.5">[{idx}]</span>
                        </div>
                    );
                })}
            </div>

            {/* Només 2 botons: Enrere i Endavant */}
            <div className="flex items-center gap-0.5 ml-auto">
                <button
                    type="button"
                    onClick={goPrev}
                    disabled={step === 0}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition disabled:opacity-20 disabled:cursor-not-allowed active:scale-95"
                >
                    <ChevronLeft size={13} />
                </button>
                <button
                    type="button"
                    onClick={goNext}
                    disabled={step === items.length - 1}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition disabled:opacity-20 disabled:cursor-not-allowed active:scale-95"
                >
                    <ChevronRight size={13} />
                </button>
            </div>
        </div>
    );
}

// =========================================================================
// 2. VECTOR ORDENAT (Sense cap botó: mínim evident a v[0])
// =========================================================================
function SortedVectorMiniViz() {
    const items = [1, 2, 5, 7, 9];

    return (
        <div className="flex items-center gap-2.5 font-mono text-xs select-none not-prose py-0.5">
            <div className="flex items-center gap-1">
                {items.map((val, idx) => {
                    const isMin = idx === 0;

                    return (
                        <div
                            key={`sorted-${idx}`}
                            className={`relative w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px] transition-all ${
                                isMin
                                    ? "bg-emerald-500/25 border-2 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.35)] scale-105 z-10"
                                    : "bg-slate-900/80 border border-white/10 text-slate-400"
                            }`}
                        >
                            <span>{val}</span>
                            <span className="text-[7px] text-slate-500 absolute -bottom-3.5">[{idx}]</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// =========================================================================
// 3. ARBRE AVL / std::set (Baixada per l'alçada: només botons < i >)
// =========================================================================
function AVLTreeMiniViz() {
    const [step, setStep] = useState<number>(0); // 0: arrel 5, 1: fill esquerre 2, 2: fulla 1

    const goPrev = () => setStep((prev) => Math.max(0, prev - 1));
    const goNext = () => setStep((prev) => Math.min(2, prev + 1));

    return (
        <div className="flex items-center gap-2.5 font-mono text-xs select-none not-prose py-0.5">
            {/* Mini Arbre SVG net i transparent */}
            <svg viewBox="0 0 115 42" className="w-[115px] h-[42px] overflow-visible">
                {/* Arestes */}
                <line
                    x1="58"
                    y1="7"
                    x2="28"
                    y2="20"
                    stroke={step >= 1 ? "#38bdf8" : "#334155"}
                    strokeWidth={step >= 1 ? "1.8" : "1"}
                    className="transition-colors duration-150"
                />
                <line x1="58" y1="7" x2="88" y2="20" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
                <line
                    x1="28"
                    y1="20"
                    x2="13"
                    y2="34"
                    stroke={step >= 2 ? "#34d399" : "#334155"}
                    strokeWidth={step >= 2 ? "2" : "1"}
                    className="transition-colors duration-150"
                />
                <line x1="28" y1="20" x2="43" y2="34" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />

                {/* Arrel: 5 */}
                <circle
                    cx="58"
                    cy="7"
                    r="5.5"
                    fill={step === 0 ? "#0284c7" : "#0f172a"}
                    stroke={step >= 0 ? "#38bdf8" : "#475569"}
                    strokeWidth="1.5"
                />
                <text x="58" y="9.5" textAnchor="middle" fill="#f8fafc" fontSize="7" fontWeight="bold">
                    5
                </text>

                {/* Fill esquerre: 2 */}
                <circle
                    cx="28"
                    cy="20"
                    r="5.5"
                    fill={step === 1 ? "#0284c7" : "#0f172a"}
                    stroke={step >= 1 ? "#38bdf8" : "#475569"}
                    strokeWidth="1.5"
                />
                <text x="28" y="22.5" textAnchor="middle" fill="#f8fafc" fontSize="7" fontWeight="bold">
                    2
                </text>

                {/* Fill dret: 8 */}
                <circle cx="88" cy="20" r="5" fill="#0f172a" stroke="#334155" strokeWidth="1" />
                <text x="88" y="22.5" textAnchor="middle" fill="#64748b" fontSize="6.5">
                    8
                </text>

                {/* Fulla esquerra: 1 (Mínim) */}
                <circle
                    cx="13"
                    cy="34"
                    r="6"
                    fill={step === 2 ? "#064e3b" : "#0f172a"}
                    stroke={step === 2 ? "#34d399" : "#475569"}
                    strokeWidth={step === 2 ? "1.8" : "1"}
                />
                <text
                    x="13"
                    y="36.5"
                    textAnchor="middle"
                    fill={step === 2 ? "#a7f3d0" : "#94a3b8"}
                    fontSize="7"
                    fontWeight="bold"
                >
                    1
                </text>

                {/* Fill dret de 2: 3 */}
                <circle cx="43" cy="34" r="5" fill="#0f172a" stroke="#334155" strokeWidth="1" />
                <text x="43" y="36.5" textAnchor="middle" fill="#64748b" fontSize="6.5">
                    3
                </text>
            </svg>

            {/* Només 2 botons: Enrere i Endavant */}
            <div className="flex items-center gap-0.5 ml-auto">
                <button
                    type="button"
                    onClick={goPrev}
                    disabled={step === 0}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition disabled:opacity-20 disabled:cursor-not-allowed active:scale-95"
                >
                    <ChevronLeft size={13} />
                </button>
                <button
                    type="button"
                    onClick={goNext}
                    disabled={step === 2}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition disabled:opacity-20 disabled:cursor-not-allowed active:scale-95"
                >
                    <ChevronRight size={13} />
                </button>
            </div>
        </div>
    );
}

// =========================================================================
// 4. MUNT BINARI (HEAP) (Dualitat Arbre-Vector: només botons < i >)
// =========================================================================
function BinaryHeapMiniViz() {
    // Passos del camí vertical d'alçada:
    // Pas 0 -> v[1] = 1 (mínim absolut a l'arrel)
    // Pas 1 -> v[2] = 2 (fill)
    // Pas 2 -> v[5] = 9 (fulla a l'alçada màxima)
    const stepsMapping = [1, 2, 5];
    const [step, setStep] = useState<number>(0);
    const activeIdx = stepsMapping[step];

    const treeNodes = [
        { idx: 1, val: 1, x: 44, y: 7 },
        { idx: 2, val: 2, x: 23, y: 19 },
        { idx: 3, val: 4, x: 65, y: 19 },
        { idx: 4, val: 7, x: 12, y: 32 },
        { idx: 5, val: 9, x: 34, y: 32 },
    ];

    const goPrev = () => setStep((prev) => Math.max(0, prev - 1));
    const goNext = () => setStep((prev) => Math.min(stepsMapping.length - 1, prev + 1));

    return (
        <div className="flex items-center gap-2.5 font-mono text-xs select-none not-prose py-0.5">
            {/* 1. Mini Arbre SVG complet */}
            <svg viewBox="0 0 78 38" className="w-[78px] h-[38px] overflow-visible shrink-0">
                <line
                    x1="44"
                    y1="7"
                    x2="23"
                    y2="19"
                    stroke={activeIdx === 2 || activeIdx === 5 ? "#10b981" : "#334155"}
                    strokeWidth="1.2"
                />
                <line x1="44" y1="7" x2="65" y2="19" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="23" y1="19" x2="12" y2="32" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
                <line
                    x1="23"
                    y1="19"
                    x2="34"
                    y2="32"
                    stroke={activeIdx === 5 ? "#10b981" : "#334155"}
                    strokeWidth="1.2"
                />

                {treeNodes.map((n) => {
                    const isSelected = n.idx === activeIdx;
                    return (
                        <circle
                            key={`tree-n-${n.idx}`}
                            cx={n.x}
                            cy={n.y}
                            r={isSelected ? "5.5" : "4.5"}
                            fill={isSelected ? "#064e3b" : "#0f172a"}
                            stroke={isSelected ? "#34d399" : "#475569"}
                            strokeWidth={isSelected ? "1.8" : "1"}
                            className="transition-all duration-150"
                        />
                    );
                })}
            </svg>

            {/* 2. Vector contigu sincronitzat (v[1..5]) */}
            <div className="flex items-center gap-0.5">
                {treeNodes.map((n) => {
                    const isSelected = n.idx === activeIdx;
                    return (
                        <div
                            key={`arr-n-${n.idx}`}
                            className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[9px] transition-all duration-150 ${
                                isSelected
                                    ? "bg-emerald-500/25 border-2 border-emerald-400 text-emerald-300 scale-105 shadow-[0_0_8px_rgba(52,211,153,0.35)] z-10"
                                    : "bg-slate-900/80 border border-white/10 text-slate-400"
                            }`}
                        >
                            <span>{n.val}</span>
                        </div>
                    );
                })}
            </div>

            {/* Només 2 botons: Enrere i Endavant */}
            <div className="flex items-center gap-0.5 ml-auto">
                <button
                    type="button"
                    onClick={goPrev}
                    disabled={step === 0}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition disabled:opacity-20 disabled:cursor-not-allowed active:scale-95"
                >
                    <ChevronLeft size={13} />
                </button>
                <button
                    type="button"
                    onClick={goNext}
                    disabled={step === stepsMapping.length - 1}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition disabled:opacity-20 disabled:cursor-not-allowed active:scale-95"
                >
                    <ChevronRight size={13} />
                </button>
            </div>
        </div>
    );
}

// =========================================================================
// 5. EXPORTACIÓ PRINCIPAL
// =========================================================================
export default function PriorityQueueCompareVisualizer({ type }: PriorityQueueCompareVisualizerProps) {
    if (type === "unordered") return <UnorderedVectorMiniViz />;
    if (type === "sorted") return <SortedVectorMiniViz />;
    if (type === "avl") return <AVLTreeMiniViz />;
    if (type === "heap") return <BinaryHeapMiniViz />;

    return (
        <div className="flex flex-col gap-2 my-2 not-prose">
            <UnorderedVectorMiniViz />
            <SortedVectorMiniViz />
            <AVLTreeMiniViz />
            <BinaryHeapMiniViz />
        </div>
    );
}
