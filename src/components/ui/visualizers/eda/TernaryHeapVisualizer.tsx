"use client";

import React, { useState } from "react";

interface TreeNodeData {
    idx: number;
    x: number;
    y: number;
    level: number;
}

const TERNARY_NODES: TreeNodeData[] = [
    // Nivell 0 (h=0)
    { idx: 0, x: 270, y: 34, level: 0 },

    // Nivell 1 (h=1) - fills de 0
    { idx: 1, x: 120, y: 98, level: 1 },
    { idx: 2, x: 270, y: 98, level: 1 },
    { idx: 3, x: 420, y: 98, level: 1 },

    // Nivell 2 (h=2) - fills de 1, 2, 3
    { idx: 4, x: 76, y: 162, level: 2 },
    { idx: 5, x: 120, y: 162, level: 2 },
    { idx: 6, x: 164, y: 162, level: 2 },

    { idx: 7, x: 226, y: 162, level: 2 },
    { idx: 8, x: 270, y: 162, level: 2 },
    { idx: 9, x: 314, y: 162, level: 2 },

    { idx: 10, x: 376, y: 162, level: 2 },
    { idx: 11, x: 420, y: 162, level: 2 },
    { idx: 12, x: 464, y: 162, level: 2 },
];

const NODE_MAP = new Map<number, TreeNodeData>(TERNARY_NODES.map((n) => [n.idx, n]));

export default function TernaryHeapVisualizer() {
    // Mida del munt ternari n (1 a 13)
    const [n, setN] = useState<number>(10);
    const [activeIdx, setActiveIdx] = useState<number | null>(null);

    const h = n <= 1 ? 0 : n <= 4 ? 1 : 2;
    const isPerfect = n === 1 || n === 4 || n === 13;

    // Relacions per al node actiu (Indexat a 0)
    const activeParent = activeIdx !== null && activeIdx > 0 ? Math.floor((activeIdx - 1) / 3) : null;
    const activeChildren =
        activeIdx !== null
            ? [3 * activeIdx + 1, 3 * activeIdx + 2, 3 * activeIdx + 3].filter((c) => c < n)
            : [];

    // Arestes visibles: per a cada node i de 1 a n-1, connectat al pare ⌊(i - 1) / 3⌋
    const visibleEdges = Array.from({ length: n - 1 }, (_, idx) => {
        const childId = idx + 1;
        const parentId = Math.floor((childId - 1) / 3);
        return { childId, parentId };
    });

    return (
        <div className="w-full flex flex-col items-center justify-center gap-5 my-8 font-mono select-none not-prose px-1">

            {/* 1. FILA SUPERIOR COMPACTA: PRESETS + SLIDER + RELACIÓ */}
            <div className="w-full max-w-lg flex items-center justify-between gap-2 text-xs">
                {/* Presets ràpids per alçada h=1 i h=2 */}
                <div className="flex items-center bg-white/[0.04] p-0.5 rounded-lg border border-white/10">
                    <button
                        type="button"
                        onClick={() => setN(4)}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                            n === 4
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : "text-slate-400 hover:text-slate-200 border border-transparent"
                        }`}
                        title="Arbre ternari perfecte d'alçada 1 (4 nodes)"
                    >
                        n=4
                    </button>
                    <button
                        type="button"
                        onClick={() => setN(8)}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                            n === 8
                                ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                                : "text-slate-400 hover:text-slate-200 border border-transparent"
                        }`}
                        title="Arbre ternari complet d'alçada 2 (8 nodes)"
                    >
                        n=8
                    </button>
                    <button
                        type="button"
                        onClick={() => setN(13)}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                            n === 13
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : "text-slate-400 hover:text-slate-200 border border-transparent"
                        }`}
                        title="Arbre ternari perfecte d'alçada 2 (13 nodes)"
                    >
                        n=13
                    </button>
                </div>

                {/* Slider de mida n */}
                <div className="flex items-center gap-2">
                    <input
                        type="range"
                        min="1"
                        max="13"
                        value={n}
                        onChange={(e) => setN(Number(e.target.value))}
                        className="w-24 sm:w-28 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
                    />
                    <span className="font-mono text-xs text-slate-400 min-w-[28px] text-right font-medium">
                        n={n}
                    </span>
                </div>

                {/* Fórmula o estat del node actiu */}
                <div className="text-[11px] font-mono text-slate-400 text-right min-w-[140px]">
                    {activeIdx !== null ? (
                        <span>
                            <span className="text-sky-300 font-bold">i={activeIdx}</span>
                            {" · "}
                            {activeParent !== null && (
                                <span>pare:<span className="text-amber-300">{activeParent}</span></span>
                            )}
                            {activeChildren.length > 0 && (
                                <span className="ml-1 text-slate-400">
                                    fills:<span className="text-blue-300">[{activeChildren.join(",")}]</span>
                                </span>
                            )}
                        </span>
                    ) : (
                        <span>
                            {isPerfect ? (
                                <span className="text-emerald-400">h={h} · perfecte</span>
                            ) : (
                                <span className="text-sky-400">h={h} · complet</span>
                            )}
                        </span>
                    )}
                </div>
            </div>

            {/* 2. ARBRE TERNARI (SVG SENSE FONS) */}
            <div className="relative w-full max-w-lg h-auto flex justify-center">
                <svg
                    viewBox="0 0 540 205"
                    className="w-full max-w-lg h-auto overflow-visible font-mono"
                    aria-label="Munt Ternari indexat a 0"
                >
                    {/* EIX D'ALÇADA VERTICAL (Lateral esquerra h = 0..2) */}
                    <g className="transition-opacity duration-200">
                        <line
                            x1="22"
                            y1="34"
                            x2="22"
                            y2={34 + h * 64}
                            stroke="#38bdf8"
                            strokeWidth="1.2"
                            strokeDasharray="2 3"
                            className="transition-all duration-300"
                        />
                        {[0, 1, 2].map((lvl) => {
                            const isReached = lvl <= h;
                            const yPos = 34 + lvl * 64;
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

                    {/* ARESTES CONNECTORES ENTRE PARE I FILLS */}
                    <g>
                        {visibleEdges.map(({ childId, parentId }) => {
                            const parentNode = NODE_MAP.get(parentId)!;
                            const childNode = NODE_MAP.get(childId)!;

                            const isConnectedToActive =
                                activeIdx !== null &&
                                ((activeIdx === childId && activeParent === parentId) ||
                                 (activeIdx === parentId && activeChildren.includes(childId)));

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

                    {/* NODES DE L'ARBRE (Indexats a 0: 0 fins a n-1) */}
                    <g>
                        {TERNARY_NODES.slice(0, n).map((node) => {
                            const id = node.idx;
                            const isSelected = activeIdx === id;
                            const isParentOfActive = activeParent === id;
                            const isChildOfActive = activeChildren.includes(id);

                            let strokeColor = "#475569";
                            let strokeWidth = "1.5";
                            let fillColor = "#090d16";
                            let textColor = "#cbd5e1";

                            if (id === 0) {
                                strokeColor = "#10b981";
                                fillColor = "rgba(16, 185, 129, 0.12)";
                                textColor = "#6ee7b7";
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
                                    onMouseEnter={() => setActiveIdx(id)}
                                    onMouseLeave={() => setActiveIdx(null)}
                                    onClick={() => setActiveIdx((prev) => (prev === id ? null : id))}
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

                                    {id === 0 && (
                                        <text
                                            x={node.x}
                                            y={node.y - 18}
                                            textAnchor="middle"
                                            fontSize="8"
                                            fill="#34d399"
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

            {/* 3. VECTOR CONTINU INDEXAT A 0: t[0..n-1] (AMB ÍNDEXS, SENSE SCROLLBAR) */}
            <div className="w-full max-w-lg flex items-center justify-center gap-1 sm:gap-1.5 pt-1">
                {Array.from({ length: n }, (_, idx) => {
                    const id = idx; // 0-indexat
                    const isSelected = activeIdx === id;
                    const isParent = activeParent === id;
                    const isChild = activeChildren.includes(id);

                    let borderCls = "border-white/10";
                    let bgCls = "bg-white/[0.02]";
                    let textCls = "text-slate-300";
                    let indexCls = "text-slate-500 group-hover:text-slate-300";

                    if (id === 0) {
                        borderCls = "border-emerald-500/40";
                        bgCls = "bg-emerald-500/10";
                        textCls = "text-emerald-300 font-semibold";
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

                    return (
                        <div
                            key={`slot-${id}`}
                            onMouseEnter={() => setActiveIdx(id)}
                            onMouseLeave={() => setActiveIdx(null)}
                            onClick={() => setActiveIdx((prev) => (prev === id ? null : id))}
                            className="flex flex-col items-center gap-1 cursor-pointer group"
                        >
                            <div
                                className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-lg border flex items-center justify-center transition-colors duration-150 text-[11px] sm:text-xs ${borderCls} ${bgCls} ${textCls}`}
                            >
                                {id}
                            </div>
                            <span className={`text-[8.5px] sm:text-[9.5px] font-mono select-none transition-colors duration-150 ${indexCls}`}>
                                [{id}]
                            </span>
                        </div>
                    );
                })}
            </div>

        </div>
    );
}

