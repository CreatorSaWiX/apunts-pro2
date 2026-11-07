"use client";

import React, { useState } from "react";

export interface MinMaxHeapVisualizerProps {
    type?: "min" | "max";
}

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

// Valors canònics per a Min-Heap i Max-Heap (1-indexat)
const MIN_HEAP_VALS = [0, 10, 15, 20, 35, 25, 40, 50];
const MAX_HEAP_VALS = [0, 90, 75, 80, 40, 55, 60, 20];

export default function MinMaxHeapVisualizer({ type = "min" }: MinMaxHeapVisualizerProps) {
    const [heapType, setHeapType] = useState<"min" | "max">(type === "max" ? "max" : "min");
    const [activeIdx, setActiveIdx] = useState<number | null>(null);

    const values = heapType === "min" ? MIN_HEAP_VALS : MAX_HEAP_VALS;
    const isMin = heapType === "min";

    const activeParent = activeIdx && activeIdx > 1 ? Math.floor(activeIdx / 2) : null;
    const activeLeft = activeIdx && 2 * activeIdx <= 7 ? 2 * activeIdx : null;
    const activeRight = activeIdx && 2 * activeIdx + 1 <= 7 ? 2 * activeIdx + 1 : null;

    return (
        <div className="w-full flex flex-col items-center justify-center gap-5 my-8 font-mono select-none not-prose px-1">

            {/* 1. FILA SUPERIOR COMPACTA: SELECTOR MIN/MAX + RELACIÓ */}
            <div className="w-full max-w-lg flex items-center justify-between gap-3 text-xs">
                {/* Botons compactes */}
                <div className="flex items-center bg-white/[0.04] p-0.5 rounded-lg border border-white/10">
                    <button
                        type="button"
                        onClick={() => setHeapType("min")}
                        className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                            isMin
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : "text-slate-400 hover:text-slate-200 border border-transparent"
                        }`}
                    >
                        Min-Heap
                    </button>
                    <button
                        type="button"
                        onClick={() => setHeapType("max")}
                        className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                            !isMin
                                ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                                : "text-slate-400 hover:text-slate-200 border border-transparent"
                        }`}
                    >
                        Max-Heap
                    </button>
                </div>

                {/* Condició matemàtica d'invariància */}
                <div className="text-[11px] font-mono text-slate-400">
                    {isMin ? (
                        <span>fill <span className="text-emerald-400 font-bold">≥</span> pare <span className="text-emerald-400 font-bold">≤</span> fill</span>
                    ) : (
                        <span>fill <span className="text-sky-400 font-bold">≤</span> pare <span className="text-sky-400 font-bold">≥</span> fill</span>
                    )}
                </div>
            </div>

            {/* 2. ARBRE BINARI (SVG SENSE FONS) */}
            <div className="relative w-full max-w-lg h-auto flex justify-center">
                <svg
                    viewBox="0 0 500 205"
                    className="w-full max-w-lg h-auto overflow-visible font-mono"
                    aria-label={isMin ? "Arbre Min-Heap" : "Arbre Max-Heap"}
                >
                    {/* Indicador d'arrel (mín o màx) */}
                    <text
                        x="250"
                        y="15"
                        textAnchor="middle"
                        fontSize="9"
                        fill={isMin ? "#34d399" : "#38bdf8"}
                        fontWeight="bold"
                        className="select-none pointer-events-none opacity-90"
                    >
                        {isMin ? `mín absolut: ${values[1]}` : `màx absolut: ${values[1]}`}
                    </text>

                    {/* ARESTES AMB XAPA DE COMPARACIÓ (≤ o ≥) */}
                    <g>
                        {TREE_LINKS.map((link) => {
                            const fromNode = NODE_MAP.get(link.from)!;
                            const toNode = NODE_MAP.get(link.to)!;
                            const isConnectedToActive =
                                activeIdx !== null &&
                                ((activeIdx === link.to && activeParent === link.from) ||
                                 (activeIdx === link.from && (activeLeft === link.to || activeRight === link.to)));

                            const midX = (fromNode.x + toNode.x) / 2;
                            const midY = (fromNode.y + toNode.y) / 2;

                            const edgeColor = isConnectedToActive
                                ? (isMin ? "#10b981" : "#38bdf8")
                                : "#334155";

                            const badgeColor = isConnectedToActive
                                ? (isMin ? "#34d399" : "#38bdf8")
                                : "#64748b";

                            const badgeSymbol = isMin
                                ? (link.isLeft ? "≥" : "≤")
                                : (link.isLeft ? "≤" : "≥");

                            return (
                                <g key={`link-${link.from}-${link.to}`}>
                                    <line
                                        x1={fromNode.x}
                                        y1={fromNode.y}
                                        x2={toNode.x}
                                        y2={toNode.y}
                                        stroke={edgeColor}
                                        strokeWidth={isConnectedToActive ? "2.2" : "1.2"}
                                        className="transition-colors duration-200"
                                    />
                                    {/* Xapa de relació (≤ o ≥) */}
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
                            const id = node.idx;
                            const val = values[id];
                            const isSelected = activeIdx === id;
                            const isParentOfActive = activeParent === id;
                            const isChildOfActive = activeLeft === id || activeRight === id;

                            let strokeColor = "#475569";
                            let strokeWidth = "1.5";
                            let fillColor = "#090d16";
                            let textColor = "#cbd5e1";

                            // Arrel
                            if (id === 1) {
                                strokeColor = isMin ? "#10b981" : "#38bdf8";
                                fillColor = isMin ? "rgba(16, 185, 129, 0.15)" : "rgba(56, 189, 248, 0.15)";
                                textColor = isMin ? "#6ee7b7" : "#7dd3fc";
                            }

                            if (isSelected) {
                                strokeColor = isMin ? "#34d399" : "#38bdf8";
                                strokeWidth = "2.4";
                                fillColor = isMin ? "rgba(16, 185, 129, 0.28)" : "rgba(56, 189, 248, 0.28)";
                                textColor = "#ffffff";
                            } else if (isParentOfActive) {
                                strokeColor = "#fbbf24";
                                strokeWidth = "2";
                                fillColor = "rgba(251, 191, 36, 0.18)";
                                textColor = "#fde68a";
                            } else if (isChildOfActive) {
                                strokeColor = "#60a5fa";
                                strokeWidth = "2";
                                fillColor = "rgba(96, 165, 250, 0.18)";
                                textColor = "#bfdbfe";
                            }

                            return (
                                <g
                                    key={`node-${id}`}
                                    className="cursor-pointer group"
                                    onMouseEnter={() => setActiveIdx(id)}
                                    onMouseLeave={() => setActiveIdx(null)}
                                    onClick={() => setActiveIdx((prev) => (prev === id ? null : id))}
                                >
                                    {isSelected && (
                                        <circle
                                            cx={node.x}
                                            cy={node.y}
                                            r="19"
                                            fill="none"
                                            stroke={isMin ? "#34d399" : "#38bdf8"}
                                            strokeWidth="1"
                                            strokeDasharray="2 2"
                                            className="opacity-70"
                                        />
                                    )}

                                    <circle
                                        cx={node.x}
                                        cy={node.y}
                                        r="15"
                                        fill={fillColor}
                                        stroke={strokeColor}
                                        strokeWidth={strokeWidth}
                                        className="transition-all duration-150 group-hover:stroke-sky-300"
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
                {Array.from({ length: 7 }, (_, idx) => {
                    const id = idx + 1;
                    const val = values[id];
                    const isSelected = activeIdx === id;
                    const isParent = activeParent === id;
                    const isChild = activeLeft === id || activeRight === id;

                    let borderCls = "border-white/10";
                    let bgCls = "bg-white/[0.02]";
                    let textCls = "text-slate-300";
                    let indexCls = "text-slate-500 group-hover:text-slate-300";

                    if (id === 1) {
                        borderCls = isMin ? "border-emerald-500/40" : "border-sky-500/40";
                        bgCls = isMin ? "bg-emerald-500/10" : "bg-sky-500/10";
                        textCls = isMin ? "text-emerald-300 font-semibold" : "text-sky-300 font-semibold";
                    }

                    if (isSelected) {
                        borderCls = isMin ? "border-emerald-400" : "border-sky-400";
                        bgCls = isMin ? "bg-emerald-500/25" : "bg-sky-500/25";
                        textCls = "text-white font-bold";
                        indexCls = isMin ? "text-emerald-300 font-bold" : "text-sky-300 font-bold";
                    } else if (isParent) {
                        borderCls = "border-amber-400";
                        bgCls = "bg-amber-500/20";
                        textCls = "text-amber-200 font-bold";
                        indexCls = "text-amber-300 font-semibold";
                    } else if (isChild) {
                        borderCls = "border-blue-400";
                        bgCls = "bg-blue-500/20";
                        textCls = "text-blue-200 font-bold";
                        indexCls = "text-blue-300 font-semibold";
                    }

                    return (
                        <div
                            key={`slot-${id}`}
                            onMouseEnter={() => setActiveIdx(id)}
                            onMouseLeave={() => setActiveIdx(null)}
                            onClick={() => setActiveIdx((prev) => (prev === id ? null : id))}
                            className="flex flex-col items-center gap-1 cursor-pointer group"
                        >
                            <div
                                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg border flex items-center justify-center transition-colors duration-150 text-xs ${borderCls} ${bgCls} ${textCls}`}
                            >
                                {val}
                            </div>
                            <span className={`text-[9px] sm:text-[10px] font-mono select-none transition-colors duration-150 ${indexCls}`}>
                                [{id}]
                            </span>
                        </div>
                    );
                })}
            </div>

        </div>
    );
}

