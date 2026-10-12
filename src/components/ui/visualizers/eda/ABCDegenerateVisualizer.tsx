"use client";

import React, { useState } from "react";

interface NodeItem {
    val: number;
    x: number;
    y: number;
    parentVal: number | null;
}

// Conjunt de dades idèntic {1, 2, 3, 4, 5} per a tots dos arbres
const BALANCED_NODES: NodeItem[] = [
    { val: 3, x: 145, y: 36, parentVal: null },
    { val: 2, x: 95, y: 100, parentVal: 3 },
    { val: 4, x: 195, y: 100, parentVal: 3 },
    { val: 1, x: 70, y: 164, parentVal: 2 },
    { val: 5, x: 220, y: 164, parentVal: 4 },
];

const DEGENERATE_NODES: NodeItem[] = [
    { val: 1, x: 345, y: 36, parentVal: null },
    { val: 2, x: 385, y: 72, parentVal: 1 },
    { val: 3, x: 425, y: 108, parentVal: 2 },
    { val: 4, x: 465, y: 144, parentVal: 3 },
    { val: 5, x: 505, y: 180, parentVal: 4 },
];

function getSearchPath(nodes: NodeItem[], targetVal: number | null): number[] {
    if (targetVal === null) return [];
    const path: number[] = [];
    let curr: NodeItem | undefined = nodes.find(n => n.val === targetVal);
    while (curr) {
        path.push(curr.val);
        curr = nodes.find(n => n.val === curr?.parentVal);
    }
    return path;
}

export default function ABCDegenerateVisualizer() {
    const [hoveredVal, setHoveredVal] = useState<number | null>(null);

    const balancedPath = getSearchPath(BALANCED_NODES, hoveredVal);
    const degeneratePath = getSearchPath(DEGENERATE_NODES, hoveredVal);

    return (
        <div className="w-full flex items-center justify-center my-6 not-prose select-none">
            <svg
                viewBox="0 0 560 216"
                className="w-full max-w-2xl h-auto overflow-visible font-mono"
                aria-label="Comparació d'alçada entre arbre binari equilibrat i arbre degenerat"
            >
                {/* 1. SEPARADOR DISCRET CENTRAL */}
                <line
                    x1="280"
                    y1="20"
                    x2="280"
                    y2="190"
                    stroke="#334155"
                    strokeWidth="1"
                    strokeDasharray="3 4"
                    className="opacity-30"
                />

                {/* ---------------- ARBRE EQUILIBRAT (ESQUERRA) ---------------- */}
                <g>
                    {/* Cota vertical d'alçada esquerra (h = 2) */}
                    <g className="opacity-70">
                        <line x1="38" y1="36" x2="38" y2="164" stroke="#475569" strokeWidth="1" strokeDasharray="2 3" />
                        <line x1="33" y1="36" x2="43" y2="36" stroke="#475569" strokeWidth="1" />
                        <line x1="33" y1="164" x2="43" y2="164" stroke="#475569" strokeWidth="1" />
                        <text
                            x="26"
                            y="100"
                            textAnchor="middle"
                            className="text-[10px] fill-slate-500 font-medium"
                            transform="rotate(-90 26 100)"
                        >
                            h = 2
                        </text>
                    </g>

                    {/* Arestes de l'arbre equilibrat */}
                    {BALANCED_NODES.filter(n => n.parentVal !== null).map(node => {
                        const parent = BALANCED_NODES.find(n => n.val === node.parentVal)!;
                        const inPath = balancedPath.includes(node.val) && balancedPath.includes(parent.val);

                        return (
                            <line
                                key={`b-edge-${parent.val}-${node.val}`}
                                x1={parent.x}
                                y1={parent.y}
                                x2={node.x}
                                y2={node.y}
                                stroke={inPath ? "#10b981" : "#334155"}
                                strokeWidth={inPath ? 2 : 1.2}
                                strokeLinecap="round"
                                className="transition-colors duration-200"
                                style={{ opacity: hoveredVal !== null && !inPath ? 0.25 : 0.8 }}
                            />
                        );
                    })}

                    {/* Nodes de l'arbre equilibrat */}
                    {BALANCED_NODES.map(node => {
                        const isHovered = hoveredVal === node.val;
                        const inPath = balancedPath.includes(node.val);

                        let stroke = "#334155";
                        let fill = "#0a0d14";
                        let textColor = "fill-slate-300";

                        if (isHovered) {
                            stroke = "#10b981";
                            fill = "rgba(16, 185, 129, 0.2)";
                            textColor = "fill-emerald-300 font-bold";
                        } else if (inPath) {
                            stroke = "#34d399";
                            fill = "rgba(16, 185, 129, 0.1)";
                            textColor = "fill-emerald-400";
                        }

                        return (
                            <g
                                key={`b-node-${node.val}`}
                                className="cursor-pointer transition-opacity duration-200"
                                style={{ opacity: hoveredVal !== null && !inPath ? 0.35 : 1 }}
                                onMouseEnter={() => setHoveredVal(node.val)}
                                onMouseLeave={() => setHoveredVal(null)}
                            >
                                <circle
                                    cx={node.x}
                                    cy={node.y}
                                    r={15}
                                    fill={fill}
                                    stroke={stroke}
                                    strokeWidth={isHovered ? 2 : inPath ? 1.8 : 1.4}
                                    className="transition-all duration-200"
                                />
                                <text
                                    x={node.x}
                                    y={node.y + 4}
                                    textAnchor="middle"
                                    className={`text-xs transition-colors duration-200 ${textColor}`}
                                >
                                    {node.val}
                                </text>
                            </g>
                        );
                    })}

                    {/* Subtítol tècnic minimalista esquerra */}
                    <text
                        x="145"
                        y="204"
                        textAnchor="middle"
                        className="text-[11px] fill-emerald-400/90 font-mono"
                    >
                        h = ⌊log₂ n⌋ <tspan className="fill-slate-500">·</tspan> Θ(log n)
                    </text>
                </g>

                {/* ---------------- ARBRE DEGENERAT (DRETA) ---------------- */}
                <g>
                    {/* Arestes de l'arbre degenerat */}
                    {DEGENERATE_NODES.filter(n => n.parentVal !== null).map(node => {
                        const parent = DEGENERATE_NODES.find(n => n.val === node.parentVal)!;
                        const inPath = degeneratePath.includes(node.val) && degeneratePath.includes(parent.val);

                        return (
                            <line
                                key={`d-edge-${parent.val}-${node.val}`}
                                x1={parent.x}
                                y1={parent.y}
                                x2={node.x}
                                y2={node.y}
                                stroke={inPath ? "#fb7185" : "#334155"}
                                strokeWidth={inPath ? 2 : 1.2}
                                strokeLinecap="round"
                                className="transition-colors duration-200"
                                style={{ opacity: hoveredVal !== null && !inPath ? 0.25 : 0.8 }}
                            />
                        );
                    })}

                    {/* Nodes de l'arbre degenerat */}
                    {DEGENERATE_NODES.map(node => {
                        const isHovered = hoveredVal === node.val;
                        const inPath = degeneratePath.includes(node.val);

                        let stroke = "#334155";
                        let fill = "#0a0d14";
                        let textColor = "fill-slate-300";

                        if (isHovered) {
                            stroke = "#fb7185";
                            fill = "rgba(244, 63, 94, 0.2)";
                            textColor = "fill-rose-300 font-bold";
                        } else if (inPath) {
                            stroke = "#f43f5e";
                            fill = "rgba(244, 63, 94, 0.1)";
                            textColor = "fill-rose-400";
                        }

                        return (
                            <g
                                key={`d-node-${node.val}`}
                                className="cursor-pointer transition-opacity duration-200"
                                style={{ opacity: hoveredVal !== null && !inPath ? 0.35 : 1 }}
                                onMouseEnter={() => setHoveredVal(node.val)}
                                onMouseLeave={() => setHoveredVal(null)}
                            >
                                <circle
                                    cx={node.x}
                                    cy={node.y}
                                    r={15}
                                    fill={fill}
                                    stroke={stroke}
                                    strokeWidth={isHovered ? 2 : inPath ? 1.8 : 1.4}
                                    className="transition-all duration-200"
                                />
                                <text
                                    x={node.x}
                                    y={node.y + 4}
                                    textAnchor="middle"
                                    className={`text-xs transition-colors duration-200 ${textColor}`}
                                >
                                    {node.val}
                                </text>
                            </g>
                        );
                    })}

                    {/* Cota vertical d'alçada dreta (h = 4) */}
                    <g className="opacity-70">
                        <line x1="535" y1="36" x2="535" y2="180" stroke="#475569" strokeWidth="1" strokeDasharray="2 3" />
                        <line x1="530" y1="36" x2="540" y2="36" stroke="#475569" strokeWidth="1" />
                        <line x1="530" y1="180" x2="540" y2="180" stroke="#475569" strokeWidth="1" />
                        <text
                            x="548"
                            y="108"
                            textAnchor="middle"
                            className="text-[10px] fill-slate-500 font-medium"
                            transform="rotate(90 548 108)"
                        >
                            h = 4
                        </text>
                    </g>

                    {/* Subtítol tècnic minimalista dreta */}
                    <text
                        x="425"
                        y="204"
                        textAnchor="middle"
                        className="text-[11px] fill-rose-400/90 font-mono"
                    >
                        h = n - 1 <tspan className="fill-slate-500">·</tspan> Θ(n)
                    </text>
                </g>
            </svg>
        </div>
    );
}
