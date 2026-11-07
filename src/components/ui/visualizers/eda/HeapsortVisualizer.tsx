"use client";

import React, { useState, useEffect } from "react";
import { m as motion } from "framer-motion";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

interface VectorItem {
    id: string;
    val: number;
}

interface Step {
    heapSize: number; // mida del heap actiu (1..7)
    i: number | null; // node actiu
    other: number | null; // node amb qui es compara / swap
    children?: [number, number] | null; // fills que s'estan comparant a enfonsar
    items: VectorItem[]; // 7 elements
    status: "heapify" | "extract_swap" | "compare_children" | "compare" | "sink_swap" | "done";
}

// Vector inicial: [12, 35, 20, 60, 45, 10, 80]
// 1-indexat:
// t[1]=12, t[2]=35, t[3]=20, t[4]=60, t[5]=45, t[6]=10, t[7]=80

const HEAPIFY_STEPS: Step[] = [
    // Estat inicial brut
    {
        heapSize: 7,
        i: null,
        other: null,
        items: [
            { id: "12", val: 12 },
            { id: "35", val: 35 },
            { id: "20", val: 20 },
            { id: "60", val: 60 },
            { id: "45", val: 45 },
            { id: "10", val: 10 },
            { id: "80", val: 80 },
        ],
        status: "heapify",
    },
    // Floyd pas 1: i = 3, fills 6 (10) i 7 (80)
    {
        heapSize: 7,
        i: 3,
        other: null,
        children: [6, 7],
        items: [
            { id: "12", val: 12 },
            { id: "35", val: 35 },
            { id: "20", val: 20 },
            { id: "60", val: 60 },
            { id: "45", val: 45 },
            { id: "10", val: 10 },
            { id: "80", val: 80 },
        ],
        status: "compare_children",
    },
    // Compara t[3]=20 amb t[7]=80
    {
        heapSize: 7,
        i: 3,
        other: 7,
        items: [
            { id: "12", val: 12 },
            { id: "35", val: 35 },
            { id: "20", val: 20 },
            { id: "60", val: 60 },
            { id: "45", val: 45 },
            { id: "10", val: 10 },
            { id: "80", val: 80 },
        ],
        status: "compare",
    },
    // Swap 20 i 80
    {
        heapSize: 7,
        i: 7,
        other: null,
        items: [
            { id: "12", val: 12 },
            { id: "35", val: 35 },
            { id: "80", val: 80 },
            { id: "60", val: 60 },
            { id: "45", val: 45 },
            { id: "10", val: 10 },
            { id: "20", val: 20 },
        ],
        status: "sink_swap",
    },
    // Floyd pas 2: i = 2, fills 4 (60) i 5 (45)
    {
        heapSize: 7,
        i: 2,
        other: null,
        children: [4, 5],
        items: [
            { id: "12", val: 12 },
            { id: "35", val: 35 },
            { id: "80", val: 80 },
            { id: "60", val: 60 },
            { id: "45", val: 45 },
            { id: "10", val: 10 },
            { id: "20", val: 20 },
        ],
        status: "compare_children",
    },
    // Swap 35 i 60
    {
        heapSize: 7,
        i: 4,
        other: null,
        items: [
            { id: "12", val: 12 },
            { id: "60", val: 60 },
            { id: "80", val: 80 },
            { id: "35", val: 35 },
            { id: "45", val: 45 },
            { id: "10", val: 10 },
            { id: "20", val: 20 },
        ],
        status: "sink_swap",
    },
    // Floyd pas 3: i = 1 (arrel), fills 2 (60) i 3 (80)
    {
        heapSize: 7,
        i: 1,
        other: null,
        children: [2, 3],
        items: [
            { id: "12", val: 12 },
            { id: "60", val: 60 },
            { id: "80", val: 80 },
            { id: "35", val: 35 },
            { id: "45", val: 45 },
            { id: "10", val: 10 },
            { id: "20", val: 20 },
        ],
        status: "compare_children",
    },
    // Swap 12 i 80 -> 12 baixa a posició 3
    {
        heapSize: 7,
        i: 3,
        other: null,
        items: [
            { id: "80", val: 80 },
            { id: "60", val: 60 },
            { id: "12", val: 12 },
            { id: "35", val: 35 },
            { id: "45", val: 45 },
            { id: "10", val: 10 },
            { id: "20", val: 20 },
        ],
        status: "sink_swap",
    },
    // Enfonsar continua a i = 3: fills 6 (10) i 7 (20)
    {
        heapSize: 7,
        i: 3,
        other: null,
        children: [6, 7],
        items: [
            { id: "80", val: 80 },
            { id: "60", val: 60 },
            { id: "12", val: 12 },
            { id: "35", val: 35 },
            { id: "45", val: 45 },
            { id: "10", val: 10 },
            { id: "20", val: 20 },
        ],
        status: "compare_children",
    },
    // Swap 12 i 20
    {
        heapSize: 7,
        i: 7,
        other: null,
        items: [
            { id: "80", val: 80 },
            { id: "60", val: 60 },
            { id: "20", val: 20 },
            { id: "35", val: 35 },
            { id: "45", val: 45 },
            { id: "10", val: 10 },
            { id: "12", val: 12 },
        ],
        status: "sink_swap",
    },
];

// FASE D'EXTRACCIONS (SORTING LOOP: i = 7 down to 2)
const EXTRACTION_STEPS: Step[] = [
    // --- ITERACIÓ 1: i = 7 ---
    // Swap root t[1]=80 amb t[7]=12
    {
        heapSize: 7,
        i: 1,
        other: 7,
        items: [
            { id: "80", val: 80 },
            { id: "60", val: 60 },
            { id: "20", val: 20 },
            { id: "35", val: 35 },
            { id: "45", val: 45 },
            { id: "10", val: 10 },
            { id: "12", val: 12 },
        ],
        status: "extract_swap",
    },
    // 80 queda bloquejat a t[7], heapSize passa a 6
    {
        heapSize: 6,
        i: 1,
        other: null,
        items: [
            { id: "12", val: 12 },
            { id: "60", val: 60 },
            { id: "20", val: 20 },
            { id: "35", val: 35 },
            { id: "45", val: 45 },
            { id: "10", val: 10 },
            { id: "80", val: 80 },
        ],
        status: "compare_children",
        children: [2, 3],
    },
    // Enfonsar 12: swap amb 60 (posició 2)
    {
        heapSize: 6,
        i: 2,
        other: null,
        items: [
            { id: "60", val: 60 },
            { id: "12", val: 12 },
            { id: "20", val: 20 },
            { id: "35", val: 35 },
            { id: "45", val: 45 },
            { id: "10", val: 10 },
            { id: "80", val: 80 },
        ],
        status: "sink_swap",
    },
    // Enfonsar continua a i=2: fills 4 (35) i 5 (45)
    {
        heapSize: 6,
        i: 2,
        other: null,
        children: [4, 5],
        items: [
            { id: "60", val: 60 },
            { id: "12", val: 12 },
            { id: "20", val: 20 },
            { id: "35", val: 35 },
            { id: "45", val: 45 },
            { id: "10", val: 10 },
            { id: "80", val: 80 },
        ],
        status: "compare_children",
    },
    // Swap 12 amb 45
    {
        heapSize: 6,
        i: 5,
        other: null,
        items: [
            { id: "60", val: 60 },
            { id: "45", val: 45 },
            { id: "20", val: 20 },
            { id: "35", val: 35 },
            { id: "12", val: 12 },
            { id: "10", val: 10 },
            { id: "80", val: 80 },
        ],
        status: "sink_swap",
    },

    // --- ITERACIÓ 2: i = 6 ---
    // Swap root t[1]=60 amb t[6]=10
    {
        heapSize: 6,
        i: 1,
        other: 6,
        items: [
            { id: "60", val: 60 },
            { id: "45", val: 45 },
            { id: "20", val: 20 },
            { id: "35", val: 35 },
            { id: "12", val: 12 },
            { id: "10", val: 10 },
            { id: "80", val: 80 },
        ],
        status: "extract_swap",
    },
    // 60 bloquejat a t[6], heapSize passa a 5
    {
        heapSize: 5,
        i: 1,
        other: null,
        children: [2, 3],
        items: [
            { id: "10", val: 10 },
            { id: "45", val: 45 },
            { id: "20", val: 20 },
            { id: "35", val: 35 },
            { id: "12", val: 12 },
            { id: "60", val: 60 },
            { id: "80", val: 80 },
        ],
        status: "compare_children",
    },
    // Swap 10 amb 45
    {
        heapSize: 5,
        i: 2,
        other: null,
        items: [
            { id: "45", val: 45 },
            { id: "10", val: 10 },
            { id: "20", val: 20 },
            { id: "35", val: 35 },
            { id: "12", val: 12 },
            { id: "60", val: 60 },
            { id: "80", val: 80 },
        ],
        status: "sink_swap",
    },
    // Enfonsar a i=2: fills 4 (35) i 5 (12)
    {
        heapSize: 5,
        i: 2,
        other: null,
        children: [4, 5],
        items: [
            { id: "45", val: 45 },
            { id: "10", val: 10 },
            { id: "20", val: 20 },
            { id: "35", val: 35 },
            { id: "12", val: 12 },
            { id: "60", val: 60 },
            { id: "80", val: 80 },
        ],
        status: "compare_children",
    },
    // Swap 10 amb 35
    {
        heapSize: 5,
        i: 4,
        other: null,
        items: [
            { id: "45", val: 45 },
            { id: "35", val: 35 },
            { id: "20", val: 20 },
            { id: "10", val: 10 },
            { id: "12", val: 12 },
            { id: "60", val: 60 },
            { id: "80", val: 80 },
        ],
        status: "sink_swap",
    },

    // --- ITERACIÓ 3: i = 5 ---
    // Swap root t[1]=45 amb t[5]=12
    {
        heapSize: 5,
        i: 1,
        other: 5,
        items: [
            { id: "45", val: 45 },
            { id: "35", val: 35 },
            { id: "20", val: 20 },
            { id: "10", val: 10 },
            { id: "12", val: 12 },
            { id: "60", val: 60 },
            { id: "80", val: 80 },
        ],
        status: "extract_swap",
    },
    // 45 bloquejat a t[5], heapSize passa a 4
    {
        heapSize: 4,
        i: 1,
        other: null,
        children: [2, 3],
        items: [
            { id: "12", val: 12 },
            { id: "35", val: 35 },
            { id: "20", val: 20 },
            { id: "10", val: 10 },
            { id: "45", val: 45 },
            { id: "60", val: 60 },
            { id: "80", val: 80 },
        ],
        status: "compare_children",
    },
    // Swap 12 amb 35
    {
        heapSize: 4,
        i: 2,
        other: null,
        items: [
            { id: "35", val: 35 },
            { id: "12", val: 12 },
            { id: "20", val: 20 },
            { id: "10", val: 10 },
            { id: "45", val: 45 },
            { id: "60", val: 60 },
            { id: "80", val: 80 },
        ],
        status: "sink_swap",
    },

    // --- ITERACIÓ 4: i = 4 ---
    // Swap root t[1]=35 amb t[4]=10
    {
        heapSize: 4,
        i: 1,
        other: 4,
        items: [
            { id: "35", val: 35 },
            { id: "12", val: 12 },
            { id: "20", val: 20 },
            { id: "10", val: 10 },
            { id: "45", val: 45 },
            { id: "60", val: 60 },
            { id: "80", val: 80 },
        ],
        status: "extract_swap",
    },
    // 35 bloquejat a t[4], heapSize passa a 3
    {
        heapSize: 3,
        i: 1,
        other: null,
        children: [2, 3],
        items: [
            { id: "10", val: 10 },
            { id: "12", val: 12 },
            { id: "20", val: 20 },
            { id: "35", val: 35 },
            { id: "45", val: 45 },
            { id: "60", val: 60 },
            { id: "80", val: 80 },
        ],
        status: "compare_children",
    },
    // Swap 10 amb 20 (posició 3)
    {
        heapSize: 3,
        i: 3,
        other: null,
        items: [
            { id: "20", val: 20 },
            { id: "12", val: 12 },
            { id: "10", val: 10 },
            { id: "35", val: 35 },
            { id: "45", val: 45 },
            { id: "60", val: 60 },
            { id: "80", val: 80 },
        ],
        status: "sink_swap",
    },

    // --- ITERACIÓ 5: i = 3 ---
    // Swap root t[1]=20 amb t[3]=10
    {
        heapSize: 3,
        i: 1,
        other: 3,
        items: [
            { id: "20", val: 20 },
            { id: "12", val: 12 },
            { id: "10", val: 10 },
            { id: "35", val: 35 },
            { id: "45", val: 45 },
            { id: "60", val: 60 },
            { id: "80", val: 80 },
        ],
        status: "extract_swap",
    },
    // 20 bloquejat a t[3], heapSize passa a 2
    {
        heapSize: 2,
        i: 1,
        other: null,
        children: [2, 2],
        items: [
            { id: "10", val: 10 },
            { id: "12", val: 12 },
            { id: "20", val: 20 },
            { id: "35", val: 35 },
            { id: "45", val: 45 },
            { id: "60", val: 60 },
            { id: "80", val: 80 },
        ],
        status: "compare_children",
    },
    // Swap 10 amb 12
    {
        heapSize: 2,
        i: 2,
        other: null,
        items: [
            { id: "12", val: 12 },
            { id: "10", val: 10 },
            { id: "20", val: 20 },
            { id: "35", val: 35 },
            { id: "45", val: 45 },
            { id: "60", val: 60 },
            { id: "80", val: 80 },
        ],
        status: "sink_swap",
    },

    // --- ITERACIÓ 6: i = 2 ---
    // Swap root t[1]=12 amb t[2]=10
    {
        heapSize: 2,
        i: 1,
        other: 2,
        items: [
            { id: "12", val: 12 },
            { id: "10", val: 10 },
            { id: "20", val: 20 },
            { id: "35", val: 35 },
            { id: "45", val: 45 },
            { id: "60", val: 60 },
            { id: "80", val: 80 },
        ],
        status: "extract_swap",
    },
    // Tot ordenat! heapSize = 0 (tots 7 ordenats)
    {
        heapSize: 0,
        i: null,
        other: null,
        items: [
            { id: "10", val: 10 },
            { id: "12", val: 12 },
            { id: "20", val: 20 },
            { id: "35", val: 35 },
            { id: "45", val: 45 },
            { id: "60", val: 60 },
            { id: "80", val: 80 },
        ],
        status: "done",
    },
];

const ALL_STEPS: Step[] = [...HEAPIFY_STEPS, ...EXTRACTION_STEPS];

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

export default function HeapsortVisualizer() {
    const [viewMode, setViewMode] = useState<"all" | "sort">("all");
    const [stepIdx, setStepIdx] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const steps = viewMode === "all" ? ALL_STEPS : EXTRACTION_STEPS;
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

    const handleSelectViewMode = (mode: "all" | "sort") => {
        setIsPlaying(false);
        setViewMode(mode);
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
                {/* Selector de fase */}
                <div className="flex items-center bg-white/[0.04] p-0.5 rounded-lg border border-white/10">
                    <button
                        type="button"
                        onClick={() => handleSelectViewMode("all")}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                            viewMode === "all"
                                ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                                : "text-slate-400 hover:text-slate-200 border border-transparent"
                        }`}
                    >
                        Complet
                    </button>
                    <button
                        type="button"
                        onClick={() => handleSelectViewMode("sort")}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                            viewMode === "sort"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : "text-slate-400 hover:text-slate-200 border border-transparent"
                        }`}
                    >
                        Extraccions
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

            {/* 2. ARBRE BINARI (SVG SENSE FONS, MAX-HEAP) */}
            <div className="relative w-full max-w-lg h-auto flex justify-center">
                <svg
                    viewBox="0 0 500 205"
                    className="w-full max-w-lg h-auto overflow-visible font-mono"
                    aria-label="Visualitzador Heapsort In-Place"
                >
                    {/* ARESTES AMB XAPES DE COMPARACIÓ (Max-Heap: fill ≤ pare ≥ fill) */}
                    <g>
                        {TREE_LINKS.map((link) => {
                            const isLinkInHeap =
                                link.from <= currentStep.heapSize && link.to <= currentStep.heapSize;
                            const fromNode = NODE_MAP.get(link.from)!;
                            const toNode = NODE_MAP.get(link.to)!;

                            const isComparingChildren =
                                currentStep.children &&
                                (currentStep.children[0] === link.to || currentStep.children[1] === link.to) &&
                                currentStep.i === link.from &&
                                isLinkInHeap;

                            const isDirectSwap =
                                (currentStep.status === "extract_swap" || currentStep.status === "sink_swap") &&
                                ((currentStep.i === link.to && currentStep.other === link.from) ||
                                    (currentStep.i === link.from && currentStep.other === link.to));

                            const isComparing =
                                currentStep.status === "compare" &&
                                ((currentStep.i === link.to && currentStep.other === link.from) ||
                                    (currentStep.i === link.from && currentStep.other === link.to));

                            const isEdgeActive = isComparingChildren || isDirectSwap || isComparing;

                            const midX = (fromNode.x + toNode.x) / 2;
                            const midY = (fromNode.y + toNode.y) / 2;

                            const edgeColor = isDirectSwap
                                ? "#38bdf8"
                                : isComparing || isComparingChildren
                                ? "#fbbf24"
                                : "#334155";

                            const badgeColor = isDirectSwap
                                ? "#7dd3fc"
                                : isComparing || isComparingChildren
                                ? "#fcd34d"
                                : "#64748b";

                            // Max-heap: branca esquerra ≤, branca dreta ≥
                            const badgeSymbol = link.isLeft ? "≤" : "≥";

                            return (
                                <g
                                    key={`link-${link.from}-${link.to}`}
                                    style={{ opacity: isLinkInHeap ? 1 : 0.12 }}
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
                            const isInHeap = idx <= currentStep.heapSize;
                            const isSorted = !isInHeap;
                            const item = currentStep.items[idx - 1];
                            const val = item ? item.val : null;

                            const isCurrent = currentStep.i === idx;
                            const isOther = currentStep.other === idx;
                            const isChildComparing =
                                currentStep.children &&
                                (currentStep.children[0] === idx || currentStep.children[1] === idx);
                            const isDone = currentStep.status === "done";

                            let strokeColor = "#475569";
                            let strokeWidth = "1.5";
                            let fillColor = "#090d16";
                            let textColor = "#cbd5e1";

                            if (isSorted || isDone) {
                                strokeColor = "#10b981";
                                strokeWidth = "1.8";
                                fillColor = "rgba(16, 185, 129, 0.18)";
                                textColor = "#6ee7b7";
                            } else if (idx === 1 && !isCurrent && !isOther) {
                                strokeColor = "#38bdf8";
                                fillColor = "rgba(56, 189, 248, 0.12)";
                                textColor = "#7dd3fc";
                            }

                            if (isCurrent && !isDone) {
                                strokeColor = "#38bdf8";
                                strokeWidth = "2.4";
                                fillColor = "rgba(56, 189, 248, 0.28)";
                                textColor = "#ffffff";
                            } else if (isOther && !isDone) {
                                strokeColor = "#fbbf24";
                                strokeWidth = "2.2";
                                fillColor = "rgba(251, 191, 36, 0.2)";
                                textColor = "#fde68a";
                            } else if (isChildComparing && !isDone) {
                                strokeColor = "#60a5fa";
                                strokeWidth = "2";
                                fillColor = "rgba(96, 165, 250, 0.15)";
                                textColor = "#bfdbfe";
                            }

                            return (
                                <g
                                    key={`node-${idx}`}
                                    style={{ opacity: isSorted && !isDone ? 0.35 : 1 }}
                                    className="transition-opacity duration-200"
                                >
                                    {isCurrent && !isDone && (
                                        <circle
                                            cx={node.x}
                                            cy={node.y}
                                            r="19"
                                            fill="none"
                                            stroke="#38bdf8"
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
                                        strokeDasharray={isSorted && !isDone ? "3 3" : "none"}
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

                {/* Slots 1 a 7 */}
                {currentStep.items.map((item, idx) => {
                    const pos = idx + 1; // 1-indexat
                    const isInHeap = pos <= currentStep.heapSize;
                    const isSorted = !isInHeap;
                    const isCurrent = currentStep.i === pos;
                    const isOther = currentStep.other === pos;
                    const isChildComparing =
                        currentStep.children &&
                        (currentStep.children[0] === pos || currentStep.children[1] === pos);
                    const isDone = currentStep.status === "done";

                    let borderCls = "border-white/10";
                    let bgCls = "bg-white/[0.02]";
                    let textCls = "text-slate-300";
                    let indexCls = "text-slate-500";

                    if (isSorted || isDone) {
                        borderCls = "border-emerald-400";
                        bgCls = "bg-emerald-500/20";
                        textCls = "text-emerald-300 font-bold";
                        indexCls = "text-emerald-400 font-semibold";
                    }

                    if (isCurrent && !isDone) {
                        borderCls = "border-sky-400";
                        bgCls = "bg-sky-500/25";
                        textCls = "text-white font-bold";
                        indexCls = "text-sky-300 font-bold";
                    } else if (isOther && !isDone) {
                        borderCls = "border-amber-400";
                        bgCls = "bg-amber-500/20";
                        textCls = "text-amber-200 font-bold";
                        indexCls = "text-amber-300 font-semibold";
                    } else if (isChildComparing && !isDone) {
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

