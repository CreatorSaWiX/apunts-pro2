"use client";

import React, { useState, useEffect } from "react";
import { m as motion } from "framer-motion";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

interface VectorItem {
    id: string;
    val: number;
}

interface Step {
    i: number | null; // índex actual de l'element que sura (1..7)
    pare: number | null; // índex del pare amb qui es compara (1..3)
    items: VectorItem[]; // 7 elements (1-indexats a les posicions 1..7)
    action: string; // descripció breu minimalista de l'acció
    status: "insert" | "compare" | "swap" | "done";
    isSwapping?: boolean;
}

// Escenari 1: x = 12 (sura 1 nivell i s'atura a t[3])
const STEPS_X12: Step[] = [
    {
        i: 7,
        pare: 3,
        items: [
            { id: "10", val: 10 },
            { id: "15", val: 15 },
            { id: "20", val: 20 },
            { id: "35", val: 35 },
            { id: "25", val: 25 },
            { id: "40", val: 40 },
            { id: "x", val: 12 },
        ],
        action: "afegir x=12 a t[7]",
        status: "insert",
    },
    {
        i: 7,
        pare: 3,
        items: [
            { id: "10", val: 10 },
            { id: "15", val: 15 },
            { id: "20", val: 20 },
            { id: "35", val: 35 },
            { id: "25", val: 25 },
            { id: "40", val: 40 },
            { id: "x", val: 12 },
        ],
        action: "t[7]=12 < t[3]=20 → swap",
        status: "compare",
    },
    {
        i: 3,
        pare: 1,
        items: [
            { id: "10", val: 10 },
            { id: "15", val: 15 },
            { id: "x", val: 12 },
            { id: "35", val: 35 },
            { id: "25", val: 25 },
            { id: "40", val: 40 },
            { id: "20", val: 20 },
        ],
        action: "swap(t[7], t[3]) · i = 3",
        status: "swap",
        isSwapping: true,
    },
    {
        i: 3,
        pare: 1,
        items: [
            { id: "10", val: 10 },
            { id: "15", val: 15 },
            { id: "x", val: 12 },
            { id: "35", val: 35 },
            { id: "25", val: 25 },
            { id: "40", val: 40 },
            { id: "20", val: 20 },
        ],
        action: "t[3]=12 ≥ t[1]=10 → aturat",
        status: "compare",
    },
    {
        i: 3,
        pare: null,
        items: [
            { id: "10", val: 10 },
            { id: "15", val: 15 },
            { id: "x", val: 12 },
            { id: "35", val: 35 },
            { id: "25", val: 25 },
            { id: "40", val: 40 },
            { id: "20", val: 20 },
        ],
        action: "invariant restablert · Θ(log n)",
        status: "done",
    },
];

// Escenari 2: x = 5 (sura 2 nivells fins a l'arrel t[1])
const STEPS_X5: Step[] = [
    {
        i: 7,
        pare: 3,
        items: [
            { id: "10", val: 10 },
            { id: "15", val: 15 },
            { id: "20", val: 20 },
            { id: "35", val: 35 },
            { id: "25", val: 25 },
            { id: "40", val: 40 },
            { id: "x", val: 5 },
        ],
        action: "afegir x=5 a t[7]",
        status: "insert",
    },
    {
        i: 7,
        pare: 3,
        items: [
            { id: "10", val: 10 },
            { id: "15", val: 15 },
            { id: "20", val: 20 },
            { id: "35", val: 35 },
            { id: "25", val: 25 },
            { id: "40", val: 40 },
            { id: "x", val: 5 },
        ],
        action: "t[7]=5 < t[3]=20 → swap",
        status: "compare",
    },
    {
        i: 3,
        pare: 1,
        items: [
            { id: "10", val: 10 },
            { id: "15", val: 15 },
            { id: "x", val: 5 },
            { id: "35", val: 35 },
            { id: "25", val: 25 },
            { id: "40", val: 40 },
            { id: "20", val: 20 },
        ],
        action: "swap(t[7], t[3]) · i = 3",
        status: "swap",
        isSwapping: true,
    },
    {
        i: 3,
        pare: 1,
        items: [
            { id: "10", val: 10 },
            { id: "15", val: 15 },
            { id: "x", val: 5 },
            { id: "35", val: 35 },
            { id: "25", val: 25 },
            { id: "40", val: 40 },
            { id: "20", val: 20 },
        ],
        action: "t[3]=5 < t[1]=10 → swap",
        status: "compare",
    },
    {
        i: 1,
        pare: null,
        items: [
            { id: "x", val: 5 },
            { id: "15", val: 15 },
            { id: "10", val: 10 },
            { id: "35", val: 35 },
            { id: "25", val: 25 },
            { id: "40", val: 40 },
            { id: "20", val: 20 },
        ],
        action: "swap(t[3], t[1]) · nova arrel!",
        status: "swap",
        isSwapping: true,
    },
    {
        i: 1,
        pare: null,
        items: [
            { id: "x", val: 5 },
            { id: "15", val: 15 },
            { id: "10", val: 10 },
            { id: "35", val: 35 },
            { id: "25", val: 25 },
            { id: "40", val: 40 },
            { id: "20", val: 20 },
        ],
        action: "i = 1 (arrel) · Θ(log n)",
        status: "done",
    },
];

interface TreeNodeData {
    idx: number;
    x: number;
    y: number;
}

const TREE_NODES: TreeNodeData[] = [
    { idx: 1, x: 250, y: 36 },
    { idx: 2, x: 135, y: 100 },
    { idx: 3, x: 365, y: 100 },
    { idx: 4, x: 75, y: 164 },
    { idx: 5, x: 195, y: 164 },
    { idx: 6, x: 305, y: 164 },
    { idx: 7, x: 425, y: 164 },
];

const NODE_MAP = new Map<number, TreeNodeData>(TREE_NODES.map((n) => [n.idx, n]));

const TREE_LINKS = [
    { from: 1, to: 2, isLeft: true },
    { from: 1, to: 3, isLeft: false },
    { from: 2, to: 4, isLeft: true },
    { from: 2, to: 5, isLeft: false },
    { from: 3, to: 6, isLeft: true },
    { from: 3, to: 7, isLeft: false },
];

export default function HeapSurarVisualizer() {
    const [scenario, setScenario] = useState<"12" | "5">("12");
    const [stepIdx, setStepIdx] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const steps = scenario === "12" ? STEPS_X12 : STEPS_X5;
    const currentStep = steps[stepIdx];

    // Auto-play interval
    useEffect(() => {
        if (!isPlaying) return;

        const interval = setInterval(() => {
            setStepIdx((prev) => {
                if (prev >= steps.length - 1) {
                    setIsPlaying(false);
                    return prev;
                }
                return prev + 1;
            });
        }, 1200);

        return () => clearInterval(interval);
    }, [isPlaying, steps.length]);

    const handleSelectScenario = (scen: "12" | "5") => {
        setIsPlaying(false);
        setScenario(scen);
        setStepIdx(0);
    };

    const nextStep = () => {
        setIsPlaying(false);
        setStepIdx((prev) => Math.min(steps.length - 1, prev + 1));
    };

    const prevStep = () => {
        setIsPlaying(false);
        setStepIdx((prev) => Math.max(0, prev - 1));
    };

    const reset = () => {
        setIsPlaying(false);
        setStepIdx(0);
    };

    const togglePlay = () => {
        if (stepIdx >= steps.length - 1) {
            setStepIdx(0);
            setIsPlaying(true);
        } else {
            setIsPlaying((prev) => !prev);
        }
    };

    return (
        <div className="w-full flex flex-col items-center justify-center gap-5 my-8 font-mono select-none not-prose px-1">

            {/* 1. FILA SUPERIOR COMPACTA: PRESETS + CONTROLS (SENSE TEXT EXPLICATIU) */}
            <div className="w-full max-w-lg flex items-center justify-between gap-2 text-xs">
                {/* Selector d'element a inserir x=12 o x=5 */}
                <div className="flex items-center bg-white/[0.04] p-0.5 rounded-lg border border-white/10">
                    <button
                        type="button"
                        onClick={() => handleSelectScenario("12")}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                            scenario === "12"
                                ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                                : "text-slate-400 hover:text-slate-200 border border-transparent"
                        }`}
                    >
                        x=12
                    </button>
                    <button
                        type="button"
                        onClick={() => handleSelectScenario("5")}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                            scenario === "5"
                                ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                                : "text-slate-400 hover:text-slate-200 border border-transparent"
                        }`}
                    >
                        x=5
                    </button>
                </div>

                {/* Controls de reproducció pas a pas */}
                <div className="flex items-center bg-white/[0.04] p-0.5 rounded-lg border border-white/10 gap-0.5">
                    <button
                        type="button"
                        onClick={reset}
                        title="Reinicia"
                        className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] transition"
                    >
                        <RotateCcw size={12} />
                    </button>
                    <button
                        type="button"
                        onClick={prevStep}
                        disabled={stepIdx <= 0}
                        title="Pas anterior"
                        className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] disabled:opacity-30 disabled:pointer-events-none transition"
                    >
                        <ChevronLeft size={13} />
                    </button>
                    <button
                        type="button"
                        onClick={togglePlay}
                        title={isPlaying ? "Pausa" : "Reprodueix"}
                        className={`p-1 rounded-md transition ${
                            isPlaying
                                ? "bg-amber-500/20 text-amber-300"
                                : "text-slate-300 hover:text-white hover:bg-white/[0.06]"
                        }`}
                    >
                        {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                    </button>
                    <button
                        type="button"
                        onClick={nextStep}
                        disabled={stepIdx >= steps.length - 1}
                        title="Pas següent"
                        className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] disabled:opacity-30 disabled:pointer-events-none transition"
                    >
                        <ChevronRight size={13} />
                    </button>
                </div>
            </div>

            {/* 2. ARBRE BINARI (SVG SENSE FONS) */}
            <div className="relative w-full max-w-lg h-auto flex justify-center">
                <svg
                    viewBox="0 0 500 205"
                    className="w-full max-w-lg h-auto overflow-visible font-mono"
                    aria-label="Operació surar en un Min-Heap"
                >
                    {/* ARESTES AMB XAPES DE COMPARACIÓ (Min-Heap: fill ≥ pare ≤ fill) */}
                    <g>
                        {TREE_LINKS.map((link) => {
                            const fromNode = NODE_MAP.get(link.from)!;
                            const toNode = NODE_MAP.get(link.to)!;

                            const isEdgeActive =
                                (currentStep.i === link.to && currentStep.pare === link.from) ||
                                (currentStep.i === link.from && currentStep.pare === link.to);

                            const midX = (fromNode.x + toNode.x) / 2;
                            const midY = (fromNode.y + toNode.y) / 2;

                            const edgeColor = isEdgeActive
                                ? (currentStep.status === "compare" ? "#fbbf24" : "#38bdf8")
                                : "#334155";

                            const badgeColor = isEdgeActive
                                ? (currentStep.status === "compare" ? "#fcd34d" : "#7dd3fc")
                                : "#64748b";

                            // Min-heap: branca esquerra ≥, branca dreta ≤
                            const badgeSymbol = link.isLeft ? "≥" : "≤";

                            return (
                                <g key={`link-${link.from}-${link.to}`}>
                                    <line
                                        x1={fromNode.x}
                                        y1={fromNode.y}
                                        x2={toNode.x}
                                        y2={toNode.y}
                                        stroke={edgeColor}
                                        strokeWidth={isEdgeActive ? "2.4" : "1.2"}
                                        strokeDasharray={isEdgeActive ? "none" : "none"}
                                        className="transition-colors duration-200"
                                    />
                                    {/* Xapa de relació */}
                                    <rect
                                        x={midX - 8}
                                        y={midY - 6.5}
                                        width="16"
                                        height="13"
                                        rx="3"
                                        fill="#020617"
                                        stroke={edgeColor}
                                        strokeWidth="1"
                                        className="transition-colors duration-200"
                                    />
                                    <text
                                        x={midX}
                                        y={midY + 1}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fill={badgeColor}
                                        fontWeight="bold"
                                        fontSize="9.5"
                                        className="select-none pointer-events-none"
                                    >
                                        {badgeSymbol}
                                    </text>
                                </g>
                            );
                        })}
                    </g>

                    {/* NODES DE L'ARBRE */}
                    <g>
                        {TREE_NODES.map((node) => {
                            const idx = node.idx;
                            const item = currentStep.items[idx - 1];
                            const val = item.val;

                            const isCurrent = currentStep.i === idx;
                            const isParent = currentStep.pare === idx;
                            const isDone = currentStep.status === "done" && isCurrent;

                            let strokeColor = "#475569";
                            let strokeWidth = "1.5";
                            let fillColor = "#090d16";
                            let textColor = "#cbd5e1";

                            if (idx === 1 && !isCurrent && !isParent) {
                                strokeColor = "#10b981";
                                fillColor = "rgba(16, 185, 129, 0.12)";
                                textColor = "#6ee7b7";
                            }

                            if (isDone) {
                                strokeColor = "#10b981";
                                strokeWidth = "2.4";
                                fillColor = "rgba(16, 185, 129, 0.28)";
                                textColor = "#ffffff";
                            } else if (isCurrent) {
                                strokeColor = "#38bdf8";
                                strokeWidth = "2.4";
                                fillColor = "rgba(56, 189, 248, 0.28)";
                                textColor = "#ffffff";
                            } else if (isParent) {
                                strokeColor = "#fbbf24";
                                strokeWidth = "2.2";
                                fillColor = "rgba(251, 191, 36, 0.2)";
                                textColor = "#fde68a";
                            }

                            return (
                                <g key={`node-${idx}`}>
                                    {/* Halo ressaltat per a l'element actiu que sura */}
                                    {isCurrent && (
                                        <circle
                                            cx={node.x}
                                            cy={node.y}
                                            r="19"
                                            fill="none"
                                            stroke={isDone ? "#10b981" : "#38bdf8"}
                                            strokeWidth="1.2"
                                            strokeDasharray="2 2"
                                            className="opacity-80"
                                        />
                                    )}

                                    <circle
                                        cx={node.x}
                                        cy={node.y}
                                        r="15"
                                        fill={fillColor}
                                        stroke={strokeColor}
                                        strokeWidth={strokeWidth}
                                        className="transition-all duration-200"
                                    />

                                    <text
                                        x={node.x}
                                        y={node.y + 1}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fill={textColor}
                                        fontWeight="bold"
                                        fontSize="11.5"
                                        className="select-none pointer-events-none"
                                    >
                                        {val}
                                    </text>


                                </g>
                            );
                        })}
                    </g>
                </svg>
            </div>

            {/* 3. VECTOR AMB VALORS I ÍNDEXS SOTA (SENSE TEXT REDUNDANT, SENSE SCROLLBAR) */}
            <div className="w-full max-w-lg flex items-center justify-center gap-1.5 sm:gap-2 pt-1">
                {/* Slot 0 buit */}
                <div className="flex flex-col items-center gap-1 opacity-35">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-dashed border-slate-800 bg-slate-900/10 flex items-center justify-center cursor-not-allowed text-xs text-slate-600 font-bold">
                        ∅
                    </div>
                    <span className="text-[9px] sm:text-[10px] text-slate-600 font-mono select-none">
                        [0]
                    </span>
                </div>

                {/* Slots 1 a 7 (animats amb Framer Motion per visualitzar el swap físic) */}
                {currentStep.items.map((item, idx) => {
                    const pos = idx + 1; // 1-indexat
                    const isCurrent = currentStep.i === pos;
                    const isParent = currentStep.pare === pos;
                    const isDone = currentStep.status === "done" && isCurrent;

                    let borderCls = "border-white/10";
                    let bgCls = "bg-white/[0.02]";
                    let textCls = "text-slate-300";
                    let indexCls = "text-slate-500";

                    if (isDone) {
                        borderCls = "border-emerald-400";
                        bgCls = "bg-emerald-500/25";
                        textCls = "text-white font-bold";
                        indexCls = "text-emerald-300 font-bold";
                    } else if (isCurrent) {
                        borderCls = "border-sky-400";
                        bgCls = "bg-sky-500/25";
                        textCls = "text-white font-bold";
                        indexCls = "text-sky-300 font-bold";
                    } else if (isParent) {
                        borderCls = "border-amber-400";
                        bgCls = "bg-amber-500/20";
                        textCls = "text-amber-200 font-bold";
                        indexCls = "text-amber-300 font-semibold";
                    }

                    return (
                        <div key={`col-${pos}`} className="flex flex-col items-center gap-1">
                            <motion.div
                                layout
                                transition={{
                                    type: "spring",
                                    stiffness: 350,
                                    damping: 26,
                                }}
                                key={item.id}
                                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg border flex items-center justify-center text-xs transition-colors duration-150 ${borderCls} ${bgCls} ${textCls}`}
                            >
                                {item.val}
                            </motion.div>
                            <span className={`text-[9px] sm:text-[10px] font-mono select-none transition-colors duration-150 ${indexCls}`}>
                                [{pos}]
                            </span>
                        </div>
                    );
                })}
            </div>

        </div>
    );
}

