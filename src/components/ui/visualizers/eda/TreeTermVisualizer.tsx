"use client";

import React, { useState } from "react";

interface TreeNode {
    id: string;
    label: string;
    x: number;
    y: number;
    parentId: string | null;
    childrenIds: string[];
    isLeaf?: boolean;
    isRoot?: boolean;
    level: number;
}

const NODES: TreeNode[] = [
    // Nivell 0 (Arrel)
    { id: "r", label: "r", x: 260, y: 38, parentId: null, childrenIds: ["u", "v"], isRoot: true, level: 0 },

    // Nivell 1
    { id: "u", label: "u", x: 175, y: 104, parentId: "r", childrenIds: ["w", "x"], level: 1 },
    { id: "v", label: "v", x: 345, y: 104, parentId: "r", childrenIds: ["y", "z"], level: 1 },

    // Nivell 2
    { id: "w", label: "w", x: 125, y: 172, parentId: "u", childrenIds: [], isLeaf: true, level: 2 },
    { id: "x", label: "x", x: 225, y: 172, parentId: "u", childrenIds: ["a", "b"], level: 2 },
    { id: "y", label: "y", x: 305, y: 172, parentId: "v", childrenIds: ["c"], level: 2 },
    { id: "z", label: "z", x: 385, y: 172, parentId: "v", childrenIds: [], isLeaf: true, level: 2 },

    // Nivell 3 (Fulles més profundes -> h = 3)
    { id: "a", label: "a", x: 195, y: 240, parentId: "x", childrenIds: [], isLeaf: true, level: 3 },
    { id: "b", label: "b", x: 255, y: 240, parentId: "x", childrenIds: [], isLeaf: true, level: 3 },
    { id: "c", label: "c", x: 305, y: 240, parentId: "y", childrenIds: [], isLeaf: true, level: 3 },
];

const NODE_MAP = new Map<string, TreeNode>(NODES.map((n) => [n.id, n]));

// Calculador d'ancestres recursiu
function getAncestors(nodeId: string): string[] {
    const ancestors: string[] = [];
    let curr = NODE_MAP.get(nodeId);
    while (curr && curr.parentId) {
        ancestors.push(curr.parentId);
        curr = NODE_MAP.get(curr.parentId);
    }
    return ancestors;
}

export default function TreeTermVisualizer() {
    const [activeId, setActiveId] = useState<string | null>("x");

    const activeNode = activeId ? NODE_MAP.get(activeId) : null;
    const ancestors = activeId ? getAncestors(activeId) : [];
    const parentId = activeNode?.parentId ?? null;
    const childrenIds = activeNode?.childrenIds ?? [];

    // Comprova si una aresta connecta pare amb fill actiu
    const isEdgeInPath = (pId: string, cId: string) => {
        if (!activeId) return false;
        // Aresta entre ancestres o cap al node actiu
        if (cId === activeId && pId === parentId) return true;
        if (ancestors.includes(cId) && ancestors.includes(pId)) return true;
        // Aresta del node actiu cap a un dels seus fills
        if (pId === activeId && childrenIds.includes(cId)) return true;
        return false;
    };

    return (
        <div className="w-full flex flex-col items-center justify-center my-6 not-prose select-none">
            <svg
                viewBox="0 0 520 280"
                className="w-full max-w-xl h-auto overflow-visible font-mono"
                aria-label="Definicions i terminologia d'arbres"
            >
                <defs>
                    <marker
                        id="tree-h-arrow"
                        viewBox="0 0 10 10"
                        refX="5"
                        refY="5"
                        markerWidth="5"
                        markerHeight="5"
                        orient="auto"
                    >
                        <path d="M 0 2 L 8 5 L 0 8 z" fill="#64748b" />
                    </marker>
                </defs>

                {/* EIX D'ALÇADA I NIVELLS (lateral esquerra, disseny tècnic minimalista) */}
                <g className="opacity-70">
                    {/* Línia de cota d'alçada vertical */}
                    <line
                        x1="45"
                        y1="38"
                        x2="45"
                        y2="240"
                        stroke="#475569"
                        strokeWidth="1"
                        strokeDasharray="2 3"
                    />
                    {/* Fletxa cota inferior */}
                    <line x1="40" y1="38" x2="50" y2="38" stroke="#475569" strokeWidth="1" />
                    <line x1="40" y1="240" x2="50" y2="240" stroke="#475569" strokeWidth="1" />

                    {/* Etiqueta d'alçada màxima */}
                    <text
                        x="32"
                        y="144"
                        textAnchor="middle"
                        className="text-[10px] fill-slate-500 font-bold"
                        transform="rotate(-90 32 144)"
                    >
                        h = 3
                    </text>

                    {/* Nivells discrets */}
                    {[
                        { lvl: 0, y: 38 },
                        { lvl: 1, y: 104 },
                        { lvl: 2, y: 172 },
                        { lvl: 3, y: 240 },
                    ].map((step) => (
                        <g key={step.lvl}>
                            <text
                                x="58"
                                y={step.y + 3}
                                className="text-[9px] fill-slate-600 font-medium"
                            >
                                n_{step.lvl}
                            </text>
                            <line
                                x1="72"
                                y1={step.y}
                                x2="90"
                                y2={step.y}
                                stroke="#334155"
                                strokeWidth="0.8"
                                strokeDasharray="2 3"
                                className="opacity-40"
                            />
                        </g>
                    ))}
                </g>

                {/* ARESTES DE L'ARBRE */}
                <g>
                    {NODES.filter((n) => n.parentId).map((node) => {
                        const parent = NODE_MAP.get(node.parentId!)!;
                        const inPath = isEdgeInPath(parent.id, node.id);
                        const isChildOfActive = parent.id === activeId;
                        const isDimmed = activeId !== null && !inPath;

                        let strokeColor = "#334155";
                        let strokeWidth = 1.2;
                        let opacity = 0.55;

                        if (inPath) {
                            if (isChildOfActive) {
                                strokeColor = "#38bdf8"; // blau cel cap als fills
                                strokeWidth = 1.8;
                                opacity = 0.95;
                            } else {
                                strokeColor = "#10b981"; // verd maragda cap als ancestres/arrel
                                strokeWidth = 2;
                                opacity = 1;
                            }
                        } else if (isDimmed) {
                            opacity = 0.18;
                        }

                        return (
                            <line
                                key={`${parent.id}-${node.id}`}
                                x1={parent.x}
                                y1={parent.y}
                                x2={node.x}
                                y2={node.y}
                                stroke={strokeColor}
                                strokeWidth={strokeWidth}
                                strokeLinecap="round"
                                className="transition-all duration-200"
                                style={{ opacity }}
                            />
                        );
                    })}
                </g>

                {/* NODES DE L'ARBRE */}
                <g>
                    {NODES.map((node) => {
                        const isActive = activeId === node.id;
                        const isParent = parentId === node.id;
                        const isAncestor = ancestors.includes(node.id);
                        const isChild = childrenIds.includes(node.id);
                        const isDimmed = activeId !== null && !isActive && !isAncestor && !isChild;

                        // Colors de contorn i fons
                        let strokeColor = "#334155";
                        let strokeWidth = "1.5";
                        let fillColor = "#090d16";
                        let textColor = "fill-slate-300";

                        if (isActive) {
                            strokeColor = "#38bdf8";
                            strokeWidth = "2.2";
                            fillColor = "rgba(56, 189, 248, 0.15)";
                            textColor = "fill-sky-300 font-bold";
                        } else if (isParent) {
                            strokeColor = "#f59e0b";
                            strokeWidth = "2";
                            fillColor = "rgba(245, 158, 11, 0.12)";
                            textColor = "fill-amber-300 font-semibold";
                        } else if (isAncestor) {
                            strokeColor = "#10b981";
                            strokeWidth = "1.8";
                            fillColor = "rgba(16, 185, 129, 0.1)";
                            textColor = "fill-emerald-300";
                        } else if (isChild) {
                            strokeColor = "#38bdf8";
                            strokeWidth = "1.6";
                            fillColor = "rgba(56, 189, 248, 0.08)";
                            textColor = "fill-sky-400";
                        } else if (node.isRoot) {
                            strokeColor = "#10b981";
                            fillColor = "rgba(16, 185, 129, 0.06)";
                            textColor = "fill-emerald-400";
                        } else if (node.isLeaf) {
                            strokeColor = "#475569";
                        }

                        return (
                            <g
                                key={node.id}
                                className="cursor-pointer transition-opacity duration-200"
                                style={{ opacity: isDimmed ? 0.25 : 1 }}
                                onMouseEnter={() => setActiveId(node.id)}
                                onClick={() => setActiveId((prev) => (prev === node.id ? null : node.id))}
                            >
                                {/* Cercle del node */}
                                <circle
                                    cx={node.x}
                                    cy={node.y}
                                    r={node.isRoot ? 16 : 14}
                                    fill={fillColor}
                                    stroke={strokeColor}
                                    strokeWidth={strokeWidth}
                                    className="transition-all duration-200"
                                />

                                {/* Subtil indicador visual de fulla (anell concèntric puntejat molt fi) */}
                                {node.isLeaf && (
                                    <circle
                                        cx={node.x}
                                        cy={node.y}
                                        r={18}
                                        fill="none"
                                        stroke={isActive ? "#38bdf8" : "#475569"}
                                        strokeWidth="0.8"
                                        strokeDasharray="2 2"
                                        className="opacity-40"
                                    />
                                )}

                                {/* Etiqueta del node */}
                                <text
                                    x={node.x}
                                    y={node.y + 4}
                                    textAnchor="middle"
                                    className={`text-xs transition-colors duration-200 ${textColor}`}
                                >
                                    {node.label}
                                </text>
                            </g>
                        );
                    })}
                </g>

                {/* RELACIONS MINIMALISTES AL PEU (fórmula matemàtica compacta, sense títols ni caixes) */}
                {activeNode ? (
                    <g className="transition-opacity duration-200 opacity-90">
                        <text
                            x="260"
                            y="272"
                            textAnchor="middle"
                            className="text-[11px] fill-slate-400 font-mono"
                        >
                            <tspan className="fill-sky-400 font-semibold">{activeNode.label}</tspan>
                            {activeNode.isRoot && (
                                <tspan className="fill-emerald-400"> (arrel)</tspan>
                            )}
                            {activeNode.isLeaf && (
                                <tspan className="fill-slate-500"> (fulla)</tspan>
                            )}
                            {parentId && (
                                <tspan>
                                    {" · "}
                                    <tspan className="fill-slate-500">pare:</tspan>{" "}
                                    <tspan className="fill-amber-400">{parentId}</tspan>
                                </tspan>
                            )}
                            {ancestors.length > 0 && (
                                <tspan>
                                    {" · "}
                                    <tspan className="fill-slate-500">anc:</tspan>{" "}
                                    <tspan className="fill-emerald-400">
                                        {"{" + ancestors.join(", ") + "}"}
                                    </tspan>
                                </tspan>
                            )}
                            {childrenIds.length > 0 && (
                                <tspan>
                                    {" · "}
                                    <tspan className="fill-slate-500">fills:</tspan>{" "}
                                    <tspan className="fill-sky-400">
                                        {"{" + childrenIds.join(", ") + "}"}
                                    </tspan>
                                </tspan>
                            )}
                        </text>
                    </g>
                ) : (
                    <text
                        x="260"
                        y="272"
                        textAnchor="middle"
                        className="text-[10px] fill-slate-600 font-mono"
                    >
                        r (arrel) · ancestres · pare · fills · fulles
                    </text>
                )}
            </svg>
        </div>
    );
}
