"use client";

import React, { useState, useEffect } from "react";
import { m as motion } from "framer-motion";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

interface VectorItem {
    id: string;
    val: number | null;
}

interface Step {
    activeCount: number; // quants elements estan presents al heap (1..7)
    i: number | null; // node actiu
    other: number | null; // node amb qui es compara / swap
    children?: [number, number] | null; // fills que s'estan comparant a enfonsar
    items: VectorItem[]; // 7 elements
    status: "init" | "insert" | "compare_children" | "compare" | "swap" | "done";
}

// Dades base: 7 elements
// Input stream: 45, 30, 15, 50, 40, 20, 10

// --- ESCENARI 1: TOP-DOWN (INSERCIÓ SUCCESSIVA AMB SURAR) ---
const STEPS_TOP_DOWN: Step[] = [
    {
        activeCount: 1,
        i: 1,
        other: null,
        items: [
            { id: "45", val: 45 },
            { id: "30", val: null },
            { id: "15", val: null },
            { id: "50", val: null },
            { id: "40", val: null },
            { id: "20", val: null },
            { id: "10", val: null },
        ],
        status: "insert",
    },
    // Insereix 30 a t[2]
    {
        activeCount: 2,
        i: 2,
        other: 1,
        items: [
            { id: "45", val: 45 },
            { id: "30", val: 30 },
            { id: "15", val: null },
            { id: "50", val: null },
            { id: "40", val: null },
            { id: "20", val: null },
            { id: "10", val: null },
        ],
        status: "compare",
    },
    // Swap 30 i 45
    {
        activeCount: 2,
        i: 1,
        other: null,
        items: [
            { id: "30", val: 30 },
            { id: "45", val: 45 },
            { id: "15", val: null },
            { id: "50", val: null },
            { id: "40", val: null },
            { id: "20", val: null },
            { id: "10", val: null },
        ],
        status: "swap",
    },
    // Insereix 15 a t[3]
    {
        activeCount: 3,
        i: 3,
        other: 1,
        items: [
            { id: "30", val: 30 },
            { id: "45", val: 45 },
            { id: "15", val: 15 },
            { id: "50", val: null },
            { id: "40", val: null },
            { id: "20", val: null },
            { id: "10", val: null },
        ],
        status: "compare",
    },
    // Swap 15 i 30
    {
        activeCount: 3,
        i: 1,
        other: null,
        items: [
            { id: "15", val: 15 },
            { id: "45", val: 45 },
            { id: "30", val: 30 },
            { id: "50", val: null },
            { id: "40", val: null },
            { id: "20", val: null },
            { id: "10", val: null },
        ],
        status: "swap",
    },
    // Insereix 50 a t[4] (compara amb t[2]=45, no cal swap)
    {
        activeCount: 4,
        i: 4,
        other: 2,
        items: [
            { id: "15", val: 15 },
            { id: "45", val: 45 },
            { id: "30", val: 30 },
            { id: "50", val: 50 },
            { id: "40", val: null },
            { id: "20", val: null },
            { id: "10", val: null },
        ],
        status: "compare",
    },
    // Insereix 40 a t[5] (compara amb t[2]=45)
    {
        activeCount: 5,
        i: 5,
        other: 2,
        items: [
            { id: "15", val: 15 },
            { id: "45", val: 45 },
            { id: "30", val: 30 },
            { id: "50", val: 50 },
            { id: "40", val: 40 },
            { id: "20", val: null },
            { id: "10", val: null },
        ],
        status: "compare",
    },
    // Swap 40 i 45
    {
        activeCount: 5,
        i: 2,
        other: 1,
        items: [
            { id: "15", val: 15 },
            { id: "40", val: 40 },
            { id: "30", val: 30 },
            { id: "50", val: 50 },
            { id: "45", val: 45 },
            { id: "20", val: null },
            { id: "10", val: null },
        ],
        status: "compare",
    },
    // Insereix 20 a t[6] (compara amb t[3]=30)
    {
        activeCount: 6,
        i: 6,
        other: 3,
        items: [
            { id: "15", val: 15 },
            { id: "40", val: 40 },
            { id: "30", val: 30 },
            { id: "50", val: 50 },
            { id: "45", val: 45 },
            { id: "20", val: 20 },
            { id: "10", val: null },
        ],
        status: "compare",
    },
    // Swap 20 i 30
    {
        activeCount: 6,
        i: 3,
        other: 1,
        items: [
            { id: "15", val: 15 },
            { id: "40", val: 40 },
            { id: "20", val: 20 },
            { id: "50", val: 50 },
            { id: "45", val: 45 },
            { id: "30", val: 30 },
            { id: "10", val: null },
        ],
        status: "compare",
    },
    // Insereix 10 a t[7] (compara amb t[3]=20)
    {
        activeCount: 7,
        i: 7,
        other: 3,
        items: [
            { id: "15", val: 15 },
            { id: "40", val: 40 },
            { id: "20", val: 20 },
            { id: "50", val: 50 },
            { id: "45", val: 45 },
            { id: "30", val: 30 },
            { id: "10", val: 10 },
        ],
        status: "compare",
    },
    // Swap 10 i 20 -> ara a t[3]
    {
        activeCount: 7,
        i: 3,
        other: 1,
        items: [
            { id: "15", val: 15 },
            { id: "40", val: 40 },
            { id: "10", val: 10 },
            { id: "50", val: 50 },
            { id: "45", val: 45 },
            { id: "30", val: 30 },
            { id: "20", val: 20 },
        ],
        status: "compare",
    },
    // Swap 10 i 15 -> nova arrel!
    {
        activeCount: 7,
        i: 1,
        other: null,
        items: [
            { id: "10", val: 10 },
            { id: "40", val: 40 },
            { id: "15", val: 15 },
            { id: "50", val: 50 },
            { id: "45", val: 45 },
            { id: "30", val: 30 },
            { id: "20", val: 20 },
        ],
        status: "done",
    },
];

// --- ESCENARI 2: MÈTODE LINEAL DE FLOYD (BOTTOM-UP AMB ENFONSAR) ---
// Comença amb el vector desordenat completament assignat
const STEPS_FLOYD: Step[] = [
    {
        activeCount: 7,
        i: null,
        other: null,
        items: [
            { id: "45", val: 45 },
            { id: "30", val: 30 },
            { id: "15", val: 15 },
            { id: "50", val: 50 },
            { id: "40", val: 40 },
            { id: "20", val: 20 },
            { id: "10", val: 10 },
        ],
        status: "init",
    },
    // Comença a i = 3 (n/2): compara fills 6 i 7 (valors 20 i 10)
    {
        activeCount: 7,
        i: 3,
        other: null,
        children: [6, 7],
        items: [
            { id: "45", val: 45 },
            { id: "30", val: 30 },
            { id: "15", val: 15 },
            { id: "50", val: 50 },
            { id: "40", val: 40 },
            { id: "20", val: 20 },
            { id: "10", val: 10 },
        ],
        status: "compare_children",
    },
    // Compara t[3]=15 amb t[7]=10
    {
        activeCount: 7,
        i: 3,
        other: 7,
        items: [
            { id: "45", val: 45 },
            { id: "30", val: 30 },
            { id: "15", val: 15 },
            { id: "50", val: 50 },
            { id: "40", val: 40 },
            { id: "20", val: 20 },
            { id: "10", val: 10 },
        ],
        status: "compare",
    },
    // Swap 15 i 10
    {
        activeCount: 7,
        i: 7,
        other: null,
        items: [
            { id: "45", val: 45 },
            { id: "30", val: 30 },
            { id: "10", val: 10 },
            { id: "50", val: 50 },
            { id: "40", val: 40 },
            { id: "20", val: 20 },
            { id: "15", val: 15 },
        ],
        status: "swap",
    },
    // Següent pare: i = 2: compara fills 4 i 5 (valors 50 i 40)
    {
        activeCount: 7,
        i: 2,
        other: null,
        children: [4, 5],
        items: [
            { id: "45", val: 45 },
            { id: "30", val: 30 },
            { id: "10", val: 10 },
            { id: "50", val: 50 },
            { id: "40", val: 40 },
            { id: "20", val: 20 },
            { id: "15", val: 15 },
        ],
        status: "compare_children",
    },
    // Compara t[2]=30 amb t[5]=40 -> 30 <= 40, no cal swap!
    {
        activeCount: 7,
        i: 2,
        other: 5,
        items: [
            { id: "45", val: 45 },
            { id: "30", val: 30 },
            { id: "10", val: 10 },
            { id: "50", val: 50 },
            { id: "40", val: 40 },
            { id: "20", val: 20 },
            { id: "15", val: 15 },
        ],
        status: "compare",
    },
    // Següent pare: i = 1 (arrel): compara fills 2 i 3 (valors 30 i 10)
    {
        activeCount: 7,
        i: 1,
        other: null,
        children: [2, 3],
        items: [
            { id: "45", val: 45 },
            { id: "30", val: 30 },
            { id: "10", val: 10 },
            { id: "50", val: 50 },
            { id: "40", val: 40 },
            { id: "20", val: 20 },
            { id: "15", val: 15 },
        ],
        status: "compare_children",
    },
    // Compara t[1]=45 amb t[3]=10
    {
        activeCount: 7,
        i: 1,
        other: 3,
        items: [
            { id: "45", val: 45 },
            { id: "30", val: 30 },
            { id: "10", val: 10 },
            { id: "50", val: 50 },
            { id: "40", val: 40 },
            { id: "20", val: 20 },
            { id: "15", val: 15 },
        ],
        status: "compare",
    },
    // Swap 45 i 10 -> 45 baixa a posició 3
    {
        activeCount: 7,
        i: 3,
        other: null,
        items: [
            { id: "10", val: 10 },
            { id: "30", val: 30 },
            { id: "45", val: 45 },
            { id: "50", val: 50 },
            { id: "40", val: 40 },
            { id: "20", val: 20 },
            { id: "15", val: 15 },
        ],
        status: "swap",
    },
    // Enfonsar continua a i = 3: compara fills 6 i 7 (valors 20 i 15)
    {
        activeCount: 7,
        i: 3,
        other: null,
        children: [6, 7],
        items: [
            { id: "10", val: 10 },
            { id: "30", val: 30 },
            { id: "45", val: 45 },
            { id: "50", val: 50 },
            { id: "40", val: 40 },
            { id: "20", val: 20 },
            { id: "15", val: 15 },
        ],
        status: "compare_children",
    },
    // Compara t[3]=45 amb t[7]=15
    {
        activeCount: 7,
        i: 3,
        other: 7,
        items: [
            { id: "10", val: 10 },
            { id: "30", val: 30 },
            { id: "45", val: 45 },
            { id: "50", val: 50 },
            { id: "40", val: 40 },
            { id: "20", val: 20 },
            { id: "15", val: 15 },
        ],
        status: "compare",
    },
    // Swap 45 i 15
    {
        activeCount: 7,
        i: 7,
        other: null,
        items: [
            { id: "10", val: 10 },
            { id: "30", val: 30 },
            { id: "15", val: 15 },
            { id: "50", val: 50 },
            { id: "40", val: 40 },
            { id: "20", val: 20 },
            { id: "45", val: 45 },
        ],
        status: "swap",
    },
    // Invariant complet!
    {
        activeCount: 7,
        i: 1,
        other: null,
        items: [
            { id: "10", val: 10 },
            { id: "30", val: 30 },
            { id: "15", val: 15 },
            { id: "50", val: 50 },
            { id: "40", val: 40 },
            { id: "20", val: 20 },
            { id: "45", val: 45 },
        ],
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

export default function HeapBuildVisualizer() {
    const [mode, setMode] = useState<"topdown" | "floyd">("topdown");
    const [stepIdx, setStepIdx] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const steps = mode === "topdown" ? STEPS_TOP_DOWN : STEPS_FLOYD;
    const currentStep = steps[stepIdx];

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

    const handleSelectMode = (newMode: "topdown" | "floyd") => {
        setIsPlaying(false);
        setMode(newMode);
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
                {/* Selector de mètode: Top-Down vs Floyd */}
                <div className="flex items-center bg-white/[0.04] p-0.5 rounded-lg border border-white/10">
                    <button
                        type="button"
                        onClick={() => handleSelectMode("topdown")}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                            mode === "topdown"
                                ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                                : "text-slate-400 hover:text-slate-200 border border-transparent"
                        }`}
                    >
                        Top-Down
                    </button>
                    <button
                        type="button"
                        onClick={() => handleSelectMode("floyd")}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                            mode === "floyd"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : "text-slate-400 hover:text-slate-200 border border-transparent"
                        }`}
                    >
                        Floyd
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
                    aria-label="Visualitzador de construcció de heap"
                >
                    {/* ARESTES AMB XAPES DE COMPARACIÓ (Min-Heap: fill ≥ pare ≤ fill) */}
                    <g>
                        {TREE_LINKS.map((link) => {
                            const isLinkPresent = link.to <= currentStep.activeCount;
                            const fromNode = NODE_MAP.get(link.from)!;
                            const toNode = NODE_MAP.get(link.to)!;

                            const isComparingChildren =
                                currentStep.children &&
                                (currentStep.children[0] === link.to || currentStep.children[1] === link.to) &&
                                currentStep.i === link.from;

                            const isComparingDirect =
                                (currentStep.i === link.from && currentStep.other === link.to) ||
                                (currentStep.i === link.to && currentStep.other === link.from);

                            const isSwapping =
                                currentStep.status === "swap" &&
                                ((currentStep.i === link.to && currentStep.other === link.from) ||
                                    (currentStep.i === link.from && currentStep.other === link.to));

                            const isEdgeActive = isComparingChildren || isComparingDirect || isSwapping;

                            const midX = (fromNode.x + toNode.x) / 2;
                            const midY = (fromNode.y + toNode.y) / 2;

                            const edgeColor = isSwapping
                                ? "#38bdf8"
                                : isComparingDirect || isComparingChildren
                                ? "#fbbf24"
                                : "#334155";

                            const badgeColor = isSwapping
                                ? "#7dd3fc"
                                : isComparingDirect || isComparingChildren
                                ? "#fcd34d"
                                : "#64748b";

                            // Min-heap: branca esquerra ≥, branca dreta ≤
                            const badgeSymbol = link.isLeft ? "≥" : "≤";

                            return (
                                <g
                                    key={`link-${link.from}-${link.to}`}
                                    style={{ opacity: isLinkPresent ? 1 : 0.15 }}
                                    className="transition-opacity duration-200"
                                >
                                    <line
                                        x1={fromNode.x}
                                        y1={fromNode.y}
                                        x2={toNode.x}
                                        y2={toNode.y}
                                        stroke={edgeColor}
                                        strokeWidth={isEdgeActive ? "2.4" : "1.2"}
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
                            const isPresent = idx <= currentStep.activeCount;
                            const item = currentStep.items[idx - 1];
                            const val = item ? item.val : null;

                            const isCurrent = currentStep.i === idx && isPresent;
                            const isOther = currentStep.other === idx && isPresent;
                            const isChildComparing =
                                currentStep.children &&
                                (currentStep.children[0] === idx || currentStep.children[1] === idx) &&
                                isPresent;
                            const isDone = currentStep.status === "done" && isPresent;

                            let strokeColor = "#475569";
                            let strokeWidth = "1.5";
                            let fillColor = "#090d16";
                            let textColor = "#cbd5e1";

                            if (!isPresent) {
                                strokeColor = "#334155";
                                fillColor = "transparent";
                                textColor = "#475569";
                            } else if (idx === 1 && !isCurrent && !isOther) {
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
                            } else if (isOther) {
                                strokeColor = "#fbbf24";
                                strokeWidth = "2.2";
                                fillColor = "rgba(251, 191, 36, 0.2)";
                                textColor = "#fde68a";
                            } else if (isChildComparing) {
                                strokeColor = "#60a5fa";
                                strokeWidth = "2";
                                fillColor = "rgba(96, 165, 250, 0.15)";
                                textColor = "#bfdbfe";
                            }

                            return (
                                <g
                                    key={`node-${idx}`}
                                    style={{ opacity: isPresent ? 1 : 0.22 }}
                                    className="transition-opacity duration-200"
                                >
                                    {isCurrent && isPresent && (
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
                                        strokeDasharray={!isPresent ? "3 3" : "none"}
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
                                        {isPresent && val !== null ? val : "∅"}
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

                {/* Slots 1 a 7 (animats amb Framer Motion per visualitzar els moviments físics) */}
                {currentStep.items.map((item, idx) => {
                    const pos = idx + 1; // 1-indexat
                    const isPresent = pos <= currentStep.activeCount;
                    const isCurrent = currentStep.i === pos && isPresent;
                    const isOther = currentStep.other === pos && isPresent;
                    const isChildComparing =
                        currentStep.children &&
                        (currentStep.children[0] === pos || currentStep.children[1] === pos) &&
                        isPresent;
                    const isDone = currentStep.status === "done" && isPresent;

                    let borderCls = "border-white/10";
                    let bgCls = "bg-white/[0.02]";
                    let textCls = "text-slate-300";
                    let indexCls = "text-slate-500";

                    if (!isPresent) {
                        borderCls = "border-dashed border-slate-800";
                        bgCls = "bg-slate-900/10";
                        textCls = "text-slate-600";
                        indexCls = "text-slate-600";
                    } else if (isDone) {
                        borderCls = "border-emerald-400";
                        bgCls = "bg-emerald-500/25";
                        textCls = "text-white font-bold";
                        indexCls = "text-emerald-300 font-bold";
                    } else if (isCurrent) {
                        borderCls = "border-sky-400";
                        bgCls = "bg-sky-500/25";
                        textCls = "text-white font-bold";
                        indexCls = "text-sky-300 font-bold";
                    } else if (isOther) {
                        borderCls = "border-amber-400";
                        bgCls = "bg-amber-500/20";
                        textCls = "text-amber-200 font-bold";
                        indexCls = "text-amber-300 font-semibold";
                    } else if (isChildComparing) {
                        borderCls = "border-blue-400";
                        bgCls = "bg-blue-500/20";
                        textCls = "text-blue-200 font-bold";
                        indexCls = "text-blue-300 font-semibold";
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
                                {isPresent && item.val !== null ? item.val : "∅"}
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

