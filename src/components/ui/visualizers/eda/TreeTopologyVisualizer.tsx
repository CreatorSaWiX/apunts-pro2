"use client";

import React, { useState } from "react";

interface TreeNode {
    id: number;
    x: number;
    y: number;
    level: number;
}

const TREE_NODES: TreeNode[] = [
    // Nivell 0 (h=0)
    { id: 1, x: 270, y: 34, level: 0 },

    // Nivell 1 (h=1)
    { id: 2, x: 142, y: 92, level: 1 },
    { id: 3, x: 398, y: 92, level: 1 },

    // Nivell 2 (h=2)
    { id: 4, x: 78, y: 150, level: 2 },
    { id: 5, x: 206, y: 150, level: 2 },
    { id: 6, x: 334, y: 150, level: 2 },
    { id: 7, x: 462, y: 150, level: 2 },

    // Nivell 3 (h=3)
    { id: 8, x: 46, y: 208, level: 3 },
    { id: 9, x: 110, y: 208, level: 3 },
    { id: 10, x: 174, y: 208, level: 3 },
    { id: 11, x: 238, y: 208, level: 3 },
    { id: 12, x: 302, y: 208, level: 3 },
    { id: 13, x: 366, y: 208, level: 3 },
    { id: 14, x: 430, y: 208, level: 3 },
    { id: 15, x: 494, y: 208, level: 3 },
];

const NODE_MAP = new Map<number, TreeNode>(TREE_NODES.map((n) => [n.id, n]));

export default function TreeTopologyVisualizer() {
    // Nombre de nodes (1 a 15)
    const [n, setN] = useState<number>(10);
    // Mode de visualització
    const [mode, setMode] = useState<"topology" | "leaves">("topology");
    // Node interactiu actiu
    const [activeId, setActiveId] = useState<number | null>(null);

    const h = Math.floor(Math.log2(n));
    const internalCount = Math.floor(n / 2);

    const activeParent = activeId && activeId > 1 ? Math.floor(activeId / 2) : null;
    const activeLeft = activeId && 2 * activeId <= n ? 2 * activeId : null;
    const activeRight = activeId && 2 * activeId + 1 <= n ? 2 * activeId + 1 : null;

    // Arestes visibles: per a cada node i de 2 fins a n, connectat al pare ⌊i/2⌋
    const visibleEdges = Array.from({ length: n - 1 }, (_, idx) => {
        const childId = idx + 2;
        const parentId = Math.floor(childId / 2);
        return { childId, parentId };
    });

    return (
        <div className="w-full flex flex-col items-center justify-center gap-5 my-8 font-mono select-none not-prose px-1">

            {/* 1. FILA SUPERIOR COMPACTA: BOTONS MINIMALISTES + SLIDER */}
            <div className="w-full max-w-xl flex items-center justify-between gap-3 text-xs">
                {/* Botons compactes sense icones */}
                <div className="flex items-center bg-white/[0.04] p-0.5 rounded-lg border border-white/10">
                    <button
                        type="button"
                        onClick={() => setMode("topology")}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                            mode === "topology"
                                ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                                : "text-slate-400 hover:text-slate-200 border border-transparent"
                        }`}
                    >
                        Topologia
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode("leaves")}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                            mode === "leaves"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : "text-slate-400 hover:text-slate-200 border border-transparent"
                        }`}
                    >
                        Fulles
                    </button>
                </div>

                {/* Slider fi + valor de n */}
                <div className="flex items-center gap-2.5">
                    <input
                        type="range"
                        min="1"
                        max="15"
                        value={n}
                        onChange={(e) => setN(Number(e.target.value))}
                        className="w-28 sm:w-36 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
                    />
                    <span className="font-mono text-xs text-slate-400 min-w-[28px] text-right font-medium">
                        n={n}
                    </span>
                </div>
            </div>

            {/* 2. DIBUIX DE L'ARBRE EN SVG (SENSE FONS) */}
            <div className="relative w-full max-w-xl h-auto flex justify-center">
                <svg
                    viewBox="0 0 540 242"
                    className="w-full max-w-xl h-auto overflow-visible font-mono"
                    aria-label="Arbre binari"
                >
                    {/* EIX D'ALÇADA VERTICAL (Lateral esquerra h = 0..3) */}
                    <g className="transition-opacity duration-200">
                        <line
                            x1="22"
                            y1="34"
                            x2="22"
                            y2={34 + h * 58}
                            stroke="#38bdf8"
                            strokeWidth="1.2"
                            strokeDasharray="2 3"
                            className="transition-all duration-300"
                        />
                        {[0, 1, 2, 3].map((lvl) => {
                            const isReached = lvl <= h;
                            const yPos = 34 + lvl * 58;
                            return (
                                <g key={`lvl-${lvl}`}>
                                    <line
                                        x1="18"
                                        y1={yPos}
                                        x2="26"
                                        y2={yPos}
                                        stroke={isReached ? "#38bdf8" : "#334155"}
                                        strokeWidth={isReached ? "1.5" : "1"}
                                    />
                                    <text
                                        x="14"
                                        y={yPos + 3}
                                        textAnchor="end"
                                        className={`text-[9.5px] select-none transition-colors duration-200 ${
                                            isReached ? "fill-sky-400 font-bold" : "fill-slate-600"
                                        }`}
                                    >
                                        h={lvl}
                                    </text>
                                </g>
                            );
                        })}
                    </g>

                    {/* ARESTES CONNECTORES ENTRE PARE I FILL */}
                    <g>
                        {visibleEdges.map(({ childId, parentId }) => {
                            const parentNode = NODE_MAP.get(parentId)!;
                            const childNode = NODE_MAP.get(childId)!;

                            const isConnectedToActive =
                                activeId !== null &&
                                ((activeId === childId && activeParent === parentId) ||
                                 (activeId === parentId && (activeLeft === childId || activeRight === childId)));

                            return (
                                <line
                                    key={`edge-${parentId}-${childId}`}
                                    x1={parentNode.x}
                                    y1={parentNode.y}
                                    x2={childNode.x}
                                    y2={childNode.y}
                                    stroke={isConnectedToActive ? "#38bdf8" : "#334155"}
                                    strokeWidth={isConnectedToActive ? "2.2" : "1.2"}
                                    className="transition-colors duration-200"
                                />
                            );
                        })}
                    </g>

                    {/* NODES DE L'ARBRE (1 fins a n) */}
                    <g>
                        {TREE_NODES.slice(0, n).map((node) => {
                            const id = node.id;
                            const isLeaf = id > internalCount;
                            const isSelected = activeId === id;
                            const isParentOfActive = activeParent === id;
                            const isChildOfActive = activeLeft === id || activeRight === id;

                            let strokeColor = "#475569";
                            let strokeWidth = "1.5";
                            let fillColor = "#090d16";
                            let textColor = "#cbd5e1";

                            if (mode === "leaves") {
                                if (isLeaf) {
                                    strokeColor = "#10b981";
                                    fillColor = "rgba(16, 185, 129, 0.14)";
                                    textColor = "#6ee7b7";
                                } else {
                                    strokeColor = "#f59e0b";
                                    fillColor = "rgba(245, 158, 11, 0.12)";
                                    textColor = "#fcd34d";
                                }
                            } else {
                                if (node.id === 1) {
                                    strokeColor = "#38bdf8";
                                    fillColor = "rgba(56, 189, 248, 0.12)";
                                    textColor = "#7dd3fc";
                                }
                            }

                            if (isSelected) {
                                strokeColor = "#38bdf8";
                                strokeWidth = "2.4";
                                fillColor = "rgba(56, 189, 248, 0.28)";
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
                                    onMouseEnter={() => setActiveId(id)}
                                    onMouseLeave={() => setActiveId(null)}
                                    onClick={() => setActiveId((prev) => (prev === id ? null : id))}
                                >
                                    {isSelected && (
                                        <circle
                                            cx={node.x}
                                            cy={node.y}
                                            r="17"
                                            fill="none"
                                            stroke="#38bdf8"
                                            strokeWidth="1"
                                            strokeDasharray="2 2"
                                            className="opacity-70"
                                        />
                                    )}

                                    <circle
                                        cx={node.x}
                                        cy={node.y}
                                        r="13"
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
                                        fontSize="11"
                                        className="select-none pointer-events-none"
                                    >
                                        {id}
                                    </text>

                                    {node.id === 1 && (
                                        <text
                                            x={node.x}
                                            y={node.y - 18}
                                            textAnchor="middle"
                                            fontSize="8"
                                            fill="#38bdf8"
                                            fontWeight="600"
                                            className="select-none pointer-events-none opacity-80"
                                        >
                                            arrel
                                        </text>
                                    )}
                                </g>
                            );
                        })}
                    </g>
                </svg>
            </div>

            {/* 3. REPRESENTACIÓ SOBRE VECTOR CONTINU (AMB ÍNDEXS, SENSE SCROLLBAR) */}
            <div className="w-full max-w-xl flex items-center justify-center gap-0.5 sm:gap-1 md:gap-1.5 pt-1">
                {/* Slot [0] buit */}
                <div className="flex flex-col items-center gap-1 opacity-35">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-md sm:rounded-lg border border-dashed border-slate-800 bg-slate-900/10 flex items-center justify-center cursor-not-allowed text-[10px] sm:text-xs text-slate-600 font-bold">
                        ∅
                    </div>
                    <span className="text-[8px] sm:text-[9px] md:text-[9.5px] text-slate-600 font-mono select-none">
                        [0]
                    </span>
                </div>

                {/* Slots [1..n] */}
                {Array.from({ length: n }, (_, idx) => {
                    const id = idx + 1;
                    const isLeaf = id > internalCount;
                    const isSelected = activeId === id;
                    const isParent = activeParent === id;
                    const isChild = activeLeft === id || activeRight === id;

                    let borderCls = "border-white/10";
                    let bgCls = "bg-white/[0.02]";
                    let textCls = "text-slate-300";
                    let indexCls = "text-slate-500 group-hover:text-slate-300";

                    if (mode === "leaves") {
                        if (isLeaf) {
                            borderCls = "border-emerald-500/40";
                            bgCls = "bg-emerald-500/10";
                            textCls = "text-emerald-300 font-semibold";
                        } else {
                            borderCls = "border-amber-500/40";
                            bgCls = "bg-amber-500/10";
                            textCls = "text-amber-300 font-semibold";
                        }
                    }

                    if (isSelected) {
                        borderCls = "border-sky-400";
                        bgCls = "bg-sky-500/25";
                        textCls = "text-white font-bold";
                        indexCls = "text-sky-300 font-bold";
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

                    const isFirstLeaf = id === internalCount + 1 && internalCount > 0;

                    return (
                        <React.Fragment key={`slot-${id}`}>
                            {isFirstLeaf && mode === "leaves" && (
                                <div className="flex flex-col items-center h-full mx-0.5 sm:mx-1 pt-0.5">
                                    <div className="h-5 sm:h-6 md:h-7 w-0.5 bg-emerald-500/50 rounded-full" />
                                </div>
                            )}
                            <div
                                onMouseEnter={() => setActiveId(id)}
                                onMouseLeave={() => setActiveId(null)}
                                onClick={() => setActiveId((prev) => (prev === id ? null : id))}
                                className="flex flex-col items-center gap-1 cursor-pointer group"
                            >
                                <div
                                    className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-md sm:rounded-lg border flex items-center justify-center transition-colors duration-150 text-[10px] sm:text-xs ${borderCls} ${bgCls} ${textCls}`}
                                >
                                    {id}
                                </div>
                                <span className={`text-[8px] sm:text-[9px] md:text-[9.5px] font-mono select-none transition-colors duration-150 ${indexCls}`}>
                                    [{id}]
                                </span>
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>

        </div>
    );
}
