"use client";

import React, { useState } from "react";
import { m as motion } from "framer-motion";

export type GraphRepMode = "neighbors" | "edge";

interface NodeCoord {
    id: number;
    x: number;
    y: number;
}

const NODES: NodeCoord[] = [
    { id: 0, x: 26, y: 26 },
    { id: 1, x: 104, y: 26 },
    { id: 2, x: 104, y: 104 },
    { id: 3, x: 26, y: 104 },
];

const EDGES = [
    { u: 0, v: 1 },
    { u: 0, v: 2 },
    { u: 1, v: 2 },
    { u: 2, v: 3 },
];

// Matriu 4x4
const MATRIX: number[][] = [
    [0, 1, 1, 0],
    [1, 0, 1, 0],
    [1, 1, 0, 1],
    [0, 0, 1, 0],
];

// Llistes d'adjacència
const ADJ_LIST: number[][] = [
    [1, 2],
    [0, 2],
    [0, 1, 3],
    [2],
];

export default function GraphRepVisualizer() {
    const [mode, setMode] = useState<GraphRepMode>("neighbors");
    const [selectedU, setSelectedU] = useState<number>(2);
    const [selectedV, setSelectedV] = useState<number>(1);

    const neighborsOfU = ADJ_LIST[selectedU] || [];
    const hasEdge = MATRIX[selectedU]?.[selectedV] === 1;

    const isEdgeActive = (u: number, v: number): boolean => {
        if (mode === "neighbors") {
            return (u === selectedU && neighborsOfU.includes(v)) || (v === selectedU && neighborsOfU.includes(u));
        }
        return (u === selectedU && v === selectedV) || (u === selectedV && v === selectedU);
    };

    return (
        <div className="w-full my-6 font-mono text-xs select-none not-prose flex flex-col items-center gap-4">
            {/* Minimalist Mode Selector (Apple / Linear pill style) */}
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
                <button
                    type="button"
                    onClick={() => setMode("neighbors")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        mode === "neighbors"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "text-slate-400 hover:text-slate-200 border border-transparent"
                    }`}
                >
                    Iterar veïns d'u
                </button>
                <button
                    type="button"
                    onClick={() => setMode("edge")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        mode === "edge"
                            ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                            : "text-slate-400 hover:text-slate-200 border border-transparent"
                    }`}
                >
                    Consultar aresta (u, v)
                </button>
            </div>

            {/* Quick Vertex Pickers */}
            <div className="flex items-center gap-4 text-slate-400 text-xs">
                <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 font-bold">u:</span>
                    {[0, 1, 2, 3].map((id) => (
                        <button
                            key={`btn-u-${id}`}
                            type="button"
                            onClick={() => setSelectedU(id)}
                            className={`w-6 h-6 rounded-md font-bold transition-all flex items-center justify-center ${
                                selectedU === id
                                    ? "bg-emerald-500/25 text-emerald-300 border border-emerald-400"
                                    : "bg-white/5 hover:bg-white/10 text-slate-400 border border-white/5"
                            }`}
                        >
                            {id}
                        </button>
                    ))}
                </div>

                {mode === "edge" && (
                    <div className="flex items-center gap-1.5">
                        <span className="text-slate-500 font-bold">v:</span>
                        {[0, 1, 2, 3].map((id) => (
                            <button
                                key={`btn-v-${id}`}
                                type="button"
                                onClick={() => setSelectedV(id)}
                                className={`w-6 h-6 rounded-md font-bold transition-all flex items-center justify-center ${
                                    selectedV === id
                                        ? "bg-sky-500/25 text-sky-300 border border-sky-400"
                                        : "bg-white/5 hover:bg-white/10 text-slate-400 border border-white/5"
                                }`}
                            >
                                {id}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* 3-Panel Split: Graph | Matrix | Lists */}
            <div className="w-full max-w-2xl flex flex-wrap items-center justify-center gap-5 sm:gap-6 pt-1">
                {/* 1. EL GRAF (SVG interactiu) */}
                <div className="flex flex-col items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Graf G=(V,E)</span>
                    <svg viewBox="0 0 130 130" className="w-[125px] h-[125px] overflow-visible">
                        {/* Arestes */}
                        {EDGES.map((e) => {
                            const nU = NODES[e.u];
                            const nV = NODES[e.v];
                            const active = isEdgeActive(e.u, e.v);

                            return (
                                <line
                                    key={`edge-${e.u}-${e.v}`}
                                    x1={nU.x}
                                    y1={nU.y}
                                    x2={nV.x}
                                    y2={nV.y}
                                    stroke={active ? "#34d399" : "#334155"}
                                    strokeWidth={active ? "2.5" : "1.2"}
                                    strokeDasharray={!active && mode === "edge" && !hasEdge ? "2 2" : "none"}
                                    className="transition-all duration-200"
                                />
                            );
                        })}

                        {/* Nodes */}
                        {NODES.map((n) => {
                            const isU = n.id === selectedU;
                            const isV = mode === "edge" && n.id === selectedV;
                            const isNeighbor = mode === "neighbors" && neighborsOfU.includes(n.id);

                            return (
                                <g
                                    key={`node-${n.id}`}
                                    onClick={() => setSelectedU(n.id)}
                                    className="cursor-pointer group"
                                >
                                    <circle
                                        cx={n.x}
                                        cy={n.y}
                                        r="12"
                                        fill={isU ? "#064e3b" : isV ? "#0c4a6e" : isNeighbor ? "#1e293b" : "#0f172a"}
                                        stroke={isU ? "#34d399" : isV ? "#38bdf8" : isNeighbor ? "#60a5fa" : "#475569"}
                                        strokeWidth={isU || isV || isNeighbor ? "2" : "1.2"}
                                        className="transition-all duration-200 group-hover:stroke-slate-300"
                                    />
                                    <text
                                        x={n.x}
                                        y={n.y + 4}
                                        textAnchor="middle"
                                        fill={isU ? "#a7f3d0" : isV ? "#7dd3fc" : isNeighbor ? "#93c5fd" : "#cbd5e1"}
                                        fontSize="11"
                                        fontWeight="bold"
                                        className="pointer-events-none"
                                    >
                                        {n.id}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </div>

                {/* 2. MATRIU D'ADJACÈNCIA (Θ(n²)) */}
                <div className="flex flex-col items-center gap-1.5">
                    <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                        <span>Matriu Θ(n²)</span>
                        {mode === "neighbors" ? (
                            <span className="text-amber-400 font-bold">scan Θ(n)</span>
                        ) : (
                            <span className="text-emerald-400 font-bold">accés Θ(1)</span>
                        )}
                    </div>

                    <div className="flex flex-col gap-0.5 bg-white/5 p-1.5 rounded-xl border border-white/5">
                        {/* Capçalera de columnes */}
                        <div className="flex items-center gap-0.5 pb-0.5">
                            <span className="w-5 text-center text-[9px] text-slate-600 font-bold">·</span>
                            {[0, 1, 2, 3].map((col) => (
                                <span
                                    key={`col-hdr-${col}`}
                                    className={`w-6 text-center text-[9px] font-bold ${
                                        mode === "edge" && selectedV === col ? "text-sky-300" : "text-slate-500"
                                    }`}
                                >
                                    {col}
                                </span>
                            ))}
                        </div>

                        {/* Files de la matriu */}
                        {[0, 1, 2, 3].map((row) => {
                            const isSelectedRow = row === selectedU;

                            return (
                                <div
                                    key={`row-${row}`}
                                    className={`flex items-center gap-0.5 rounded px-0.5 transition-colors ${
                                        isSelectedRow && mode === "neighbors"
                                            ? "bg-amber-500/15"
                                            : isSelectedRow && mode === "edge"
                                            ? "bg-sky-500/10"
                                            : ""
                                    }`}
                                >
                                    {/* Capçalera de fila */}
                                    <span
                                        className={`w-5 text-center text-[9px] font-bold ${
                                            isSelectedRow ? "text-emerald-300" : "text-slate-500"
                                        }`}
                                    >
                                        {row}
                                    </span>

                                    {/* Cel·les */}
                                    {[0, 1, 2, 3].map((col) => {
                                        const val = MATRIX[row][col];
                                        const isTargetCell = row === selectedU && col === selectedV && mode === "edge";
                                        const isRowScanCell = isSelectedRow && mode === "neighbors";

                                        return (
                                            <div
                                                key={`cell-${row}-${col}`}
                                                onClick={() => {
                                                    setSelectedU(row);
                                                    setSelectedV(col);
                                                }}
                                                className={`w-6 h-6 rounded flex items-center justify-center font-bold text-[10px] cursor-pointer transition-all ${
                                                    isTargetCell
                                                        ? val === 1
                                                            ? "bg-emerald-500/30 border-2 border-emerald-400 text-emerald-300 scale-110 z-10 shadow-[0_0_8px_rgba(52,211,153,0.3)]"
                                                            : "bg-rose-500/25 border-2 border-rose-400 text-rose-300 scale-110 z-10"
                                                        : isRowScanCell
                                                        ? val === 1
                                                            ? "bg-amber-500/25 border border-amber-400/80 text-amber-300"
                                                            : "bg-slate-900/60 border border-white/5 text-slate-600"
                                                        : val === 1
                                                        ? "bg-slate-800/80 border border-white/10 text-slate-300"
                                                        : "bg-slate-950/40 text-slate-700 border border-transparent"
                                                }`}
                                            >
                                                <span>{val}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 3. LLISTES D'ADJACÈNCIA (Θ(n + m)) */}
                <div className="flex flex-col items-center gap-1.5">
                    <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                        <span>Llistes Θ(n+m)</span>
                        {mode === "neighbors" ? (
                            <span className="text-emerald-400 font-bold">veïns Θ(deg)</span>
                        ) : (
                            <span className="text-amber-400 font-bold">cerca O(deg)</span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1 bg-white/5 p-2 rounded-xl border border-white/5 min-w-[130px]">
                        {[0, 1, 2, 3].map((u) => {
                            const list = ADJ_LIST[u];
                            const isSelected = u === selectedU;

                            return (
                                <div
                                    key={`adj-list-${u}`}
                                    onClick={() => setSelectedU(u)}
                                    className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded cursor-pointer transition-all ${
                                        isSelected
                                            ? "bg-emerald-500/15 border border-emerald-500/30"
                                            : "hover:bg-white/5 border border-transparent"
                                    }`}
                                >
                                    <span
                                        className={`font-bold text-[10px] w-4 ${
                                            isSelected ? "text-emerald-300" : "text-slate-500"
                                        }`}
                                    >
                                        {u}:
                                    </span>
                                    <div className="flex items-center gap-1">
                                        {list.map((neighbor) => {
                                            const isTarget = isSelected && mode === "edge" && neighbor === selectedV;
                                            const isHighlighted = isSelected && mode === "neighbors";

                                            return (
                                                <span
                                                    key={`n-${u}-${neighbor}`}
                                                    className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold transition-all ${
                                                        isTarget
                                                            ? "bg-emerald-500/30 border border-emerald-400 text-emerald-300 scale-105"
                                                            : isHighlighted
                                                            ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300"
                                                            : "bg-slate-900 border border-white/10 text-slate-400"
                                                    }`}
                                                >
                                                    {neighbor}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
