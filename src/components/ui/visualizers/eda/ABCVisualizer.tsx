"use client";

import React, { useState } from "react";

interface NodeData {
    val: number;
    x: number;
    y: number;
    left?: number;
    right?: number;
    parent?: number;
}

const NODES: NodeData[] = [
    { val: 5, x: 270, y: 38, left: 3, right: 7 },
    { val: 3, x: 160, y: 104, left: 2, right: 4, parent: 5 },
    { val: 7, x: 380, y: 104, right: 8, parent: 5 },
    { val: 2, x: 105, y: 168, parent: 3 },
    { val: 4, x: 215, y: 168, parent: 3 },
    { val: 8, x: 435, y: 168, parent: 7 },
];

const NODE_MAP = new Map<number, NodeData>(NODES.map((n) => [n.val, n]));

const INORDER_SEQUENCE = [2, 3, 4, 5, 7, 8];

// Cerca recursiva dels nodes pertanyents al subarbre esquerre o dret
function getSubtree(rootVal: number, side: "left" | "right"): Set<number> {
    const result = new Set<number>();
    const root = NODE_MAP.get(rootVal);
    if (!root) return result;

    const start = side === "left" ? root.left : root.right;
    if (start === undefined) return result;

    const stack = [start];
    while (stack.length > 0) {
        const curr = stack.pop()!;
        result.add(curr);
        const node = NODE_MAP.get(curr);
        if (node) {
            if (node.left !== undefined) stack.push(node.left);
            if (node.right !== undefined) stack.push(node.right);
        }
    }
    return result;
}

export default function ABCVisualizer() {
    // Node actiu seleccionat com a referència (per defecte l'arrel 5)
    const [selectedVal, setSelectedVal] = useState<number>(5);

    const leftSubtree = getSubtree(selectedVal, "left");
    const rightSubtree = getSubtree(selectedVal, "right");

    const getRole = (val: number) => {
        if (val === selectedVal) return "root";
        if (leftSubtree.has(val)) return "left";
        if (rightSubtree.has(val)) return "right";
        return "dimmed";
    };

    return (
        <div className="w-full flex flex-col items-center justify-center my-6 not-prose select-none">
            <svg
                viewBox="0 0 540 230"
                className="w-full max-w-xl h-auto overflow-visible font-mono"
                aria-label="Propietat de l'Arbre Binari de Cerca"
            >
                {/* 1. LÍNIES DE PROJECCIÓ INORDRE (Verticals subtils cap a l'eix inferior) */}
                <g className="opacity-35">
                    {INORDER_SEQUENCE.map((val) => {
                        const node = NODE_MAP.get(val)!;
                        const role = getRole(val);
                        let strokeColor = "#334155";
                        if (role === "root") strokeColor = "#38bdf8";
                        else if (role === "left") strokeColor = "#10b981";
                        else if (role === "right") strokeColor = "#c084fc";

                        return (
                            <line
                                key={`proj-${val}`}
                                x1={node.x}
                                y1={node.y + 14}
                                x2={node.x}
                                y2={208}
                                stroke={strokeColor}
                                strokeWidth="0.8"
                                strokeDasharray="2 3"
                                className="transition-colors duration-200"
                            />
                        );
                    })}
                </g>

                {/* 2. EIX HORITZONTAL INORDRE (base visual de projecció ordenada) */}
                <g>
                    {/* Línia d'eix continu molt neta */}
                    <line
                        x1="80"
                        y1="208"
                        x2="460"
                        y2="208"
                        stroke="#334155"
                        strokeWidth="1"
                        className="opacity-40"
                    />

                    {/* Nodes de l'eix inordre */}
                    {INORDER_SEQUENCE.map((val, idx) => {
                        const node = NODE_MAP.get(val)!;
                        const role = getRole(val);
                        const isLast = idx === INORDER_SEQUENCE.length - 1;
                        const nextNode = !isLast ? NODE_MAP.get(INORDER_SEQUENCE[idx + 1])! : null;

                        let textFill = "fill-slate-500";
                        if (role === "root") textFill = "fill-sky-400 font-bold";
                        else if (role === "left") textFill = "fill-emerald-400 font-medium";
                        else if (role === "right") textFill = "fill-purple-400 font-medium";

                        return (
                            <g
                                key={`inorder-${val}`}
                                className="cursor-pointer"
                                onClick={() => setSelectedVal(val)}
                            >
                                {/* Punt sobre l'eix */}
                                <circle
                                    cx={node.x}
                                    cy={208}
                                    r="2.5"
                                    className={
                                        role === "root"
                                            ? "fill-sky-400"
                                            : role === "left"
                                              ? "fill-emerald-400"
                                              : role === "right"
                                                ? "fill-purple-400"
                                                : "fill-slate-600"
                                    }
                                />
                                {/* Valor a sota del punt */}
                                <text
                                    x={node.x}
                                    y={224}
                                    textAnchor="middle"
                                    className={`text-[11px] transition-colors duration-200 ${textFill}`}
                                >
                                    {val}
                                </text>

                                {/* Indicador de menor estricte entre components */}
                                {nextNode && (
                                    <text
                                        x={(node.x + nextNode.x) / 2}
                                        y={212}
                                        textAnchor="middle"
                                        className="text-[9px] fill-slate-600 opacity-60 pointer-events-none"
                                    >
                                        &lt;
                                    </text>
                                )}
                            </g>
                        );
                    })}
                </g>

                {/* 3. ARESTES DE L'ARBRE */}
                <g>
                    {NODES.filter((n) => n.parent !== undefined).map((node) => {
                        const parent = NODE_MAP.get(node.parent!)!;
                        const nodeRole = getRole(node.val);
                        const parentRole = getRole(parent.val);

                        let strokeColor = "#334155";
                        let strokeWidth = 1.2;
                        let opacity = 0.5;

                        // Si connecta dins del subarbre esquerre o dret
                        if (nodeRole === "left" && (parentRole === "left" || parentRole === "root")) {
                            strokeColor = "#10b981";
                            strokeWidth = 1.8;
                            opacity = 0.9;
                        } else if (nodeRole === "right" && (parentRole === "right" || parentRole === "root")) {
                            strokeColor = "#c084fc";
                            strokeWidth = 1.8;
                            opacity = 0.9;
                        } else if (nodeRole === "dimmed") {
                            opacity = 0.2;
                        }

                        return (
                            <line
                                key={`edge-${parent.val}-${node.val}`}
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

                {/* 4. ANOTACIONS MATEMÀTIQUES MINIMALISTES (< k_x i > k_x) */}
                {leftSubtree.size > 0 && (
                    <g className="transition-opacity duration-200">
                        <text
                            x={NODE_MAP.get(selectedVal)!.x - 64}
                            y={NODE_MAP.get(selectedVal)!.y + 36}
                            textAnchor="middle"
                            className="text-[11px] fill-emerald-400/90 font-medium font-mono"
                        >
                            &lt; {selectedVal}
                        </text>
                    </g>
                )}

                {rightSubtree.size > 0 && (
                    <g className="transition-opacity duration-200">
                        <text
                            x={NODE_MAP.get(selectedVal)!.x + 64}
                            y={NODE_MAP.get(selectedVal)!.y + 36}
                            textAnchor="middle"
                            className="text-[11px] fill-purple-400/90 font-medium font-mono"
                        >
                            &gt; {selectedVal}
                        </text>
                    </g>
                )}

                {/* 5. NODES DE L'ARBRE */}
                <g>
                    {NODES.map((node) => {
                        const role = getRole(node.val);
                        const isRoot = role === "root";
                        const isLeft = role === "left";
                        const isRight = role === "right";
                        const isDimmed = role === "dimmed";

                        let strokeColor = "#334155";
                        let strokeWidth = "1.5";
                        let fillColor = "rgba(10, 13, 20, 0.85)";
                        let textColor = "fill-slate-300";

                        if (isRoot) {
                            strokeColor = "#38bdf8";
                            strokeWidth = "2.2";
                            fillColor = "rgba(56, 189, 248, 0.12)";
                            textColor = "fill-sky-300 font-bold";
                        } else if (isLeft) {
                            strokeColor = "#10b981";
                            strokeWidth = "1.8";
                            fillColor = "rgba(16, 185, 129, 0.1)";
                            textColor = "fill-emerald-300 font-semibold";
                        } else if (isRight) {
                            strokeColor = "#c084fc";
                            strokeWidth = "1.8";
                            fillColor = "rgba(192, 132, 252, 0.1)";
                            textColor = "fill-purple-300 font-semibold";
                        }

                        return (
                            <g
                                key={`node-${node.val}`}
                                className="cursor-pointer transition-opacity duration-200"
                                style={{ opacity: isDimmed ? 0.3 : 1 }}
                                onClick={() => setSelectedVal(node.val)}
                            >
                                {/* Halo subtil al node seleccionat */}
                                {isRoot && (
                                    <circle
                                        cx={node.x}
                                        cy={node.y}
                                        r="20"
                                        fill="none"
                                        stroke="#38bdf8"
                                        strokeWidth="0.8"
                                        strokeDasharray="2 3"
                                        className="opacity-50"
                                    />
                                )}

                                {/* Cercle principal */}
                                <circle
                                    cx={node.x}
                                    cy={node.y}
                                    r={isRoot ? 15 : 13.5}
                                    fill={fillColor}
                                    stroke={strokeColor}
                                    strokeWidth={strokeWidth}
                                    className="transition-all duration-200"
                                />

                                {/* Valor numèric */}
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
                </g>
            </svg>
        </div>
    );
}
