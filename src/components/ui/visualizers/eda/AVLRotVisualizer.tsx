"use client";

import React, { useState } from "react";

type CaseType = "LL" | "RR" | "LR" | "RL";

interface NodeItem {
    id: string;
    label: string;
    x: number;
    y: number;
    balance?: string;
    variant?: "unbalanced" | "root" | "normal";
}

interface SubtreeItem {
    id: string;
    label: string;
    topX: number;
    topY: number;
    width: number;
    height: number;
}

interface EdgeItem {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
}

interface TreeDiagramData {
    nodes: NodeItem[];
    subtrees: SubtreeItem[];
    edges: EdgeItem[];
}

interface RotationCaseData {
    id: CaseType;
    operation: string;
    before: TreeDiagramData;
    after: TreeDiagramData;
}

const CASES_DATA: Record<CaseType, RotationCaseData> = {
    LL: {
        id: "LL",
        operation: "LL(p)",
        before: {
            nodes: [
                { id: "p", label: "p", x: 195, y: 40, balance: "+2", variant: "unbalanced" },
                { id: "q", label: "q", x: 120, y: 98, variant: "normal" },
            ],
            subtrees: [
                { id: "A", label: "A", topX: 75, topY: 154, width: 34, height: 44 },
                { id: "B", label: "B", topX: 145, topY: 154, width: 34, height: 44 },
                { id: "C", label: "C", topX: 245, topY: 96, width: 34, height: 44 },
            ],
            edges: [
                { fromX: 195, fromY: 40, toX: 120, toY: 98 },
                { fromX: 195, fromY: 40, toX: 245, toY: 96 },
                { fromX: 120, fromY: 98, toX: 75, toY: 154 },
                { fromX: 120, fromY: 98, toX: 145, toY: 154 },
            ],
        },
        after: {
            nodes: [
                { id: "q", label: "q", x: 520, y: 40, variant: "root" },
                { id: "p", label: "p", x: 595, y: 98, variant: "normal" },
            ],
            subtrees: [
                { id: "A", label: "A", topX: 445, topY: 96, width: 34, height: 44 },
                { id: "B", label: "B", topX: 565, topY: 154, width: 34, height: 44 },
                { id: "C", label: "C", topX: 635, topY: 154, width: 34, height: 44 },
            ],
            edges: [
                { fromX: 520, fromY: 40, toX: 445, toY: 96 },
                { fromX: 520, fromY: 40, toX: 595, toY: 98 },
                { fromX: 595, fromY: 98, toX: 565, toY: 154 },
                { fromX: 595, fromY: 98, toX: 635, toY: 154 },
            ],
        },
    },
    RR: {
        id: "RR",
        operation: "RR(p)",
        before: {
            nodes: [
                { id: "p", label: "p", x: 125, y: 40, balance: "-2", variant: "unbalanced" },
                { id: "q", label: "q", x: 200, y: 98, variant: "normal" },
            ],
            subtrees: [
                { id: "A", label: "A", topX: 75, topY: 96, width: 34, height: 44 },
                { id: "B", label: "B", topX: 175, topY: 154, width: 34, height: 44 },
                { id: "C", label: "C", topX: 245, topY: 154, width: 34, height: 44 },
            ],
            edges: [
                { fromX: 125, fromY: 40, toX: 75, toY: 96 },
                { fromX: 125, fromY: 40, toX: 200, toY: 98 },
                { fromX: 200, fromY: 98, toX: 175, toY: 154 },
                { fromX: 200, fromY: 98, toX: 245, toY: 154 },
            ],
        },
        after: {
            nodes: [
                { id: "q", label: "q", x: 520, y: 40, variant: "root" },
                { id: "p", label: "p", x: 445, y: 98, variant: "normal" },
            ],
            subtrees: [
                { id: "A", label: "A", topX: 405, topY: 154, width: 34, height: 44 },
                { id: "B", label: "B", topX: 475, topY: 154, width: 34, height: 44 },
                { id: "C", label: "C", topX: 595, topY: 96, width: 34, height: 44 },
            ],
            edges: [
                { fromX: 520, fromY: 40, toX: 445, toY: 98 },
                { fromX: 520, fromY: 40, toX: 595, toY: 96 },
                { fromX: 445, fromY: 98, toX: 405, toY: 154 },
                { fromX: 445, fromY: 98, toX: 475, toY: 154 },
            ],
        },
    },
    LR: {
        id: "LR",
        operation: "LR(p)",
        before: {
            nodes: [
                { id: "p", label: "p", x: 215, y: 35, balance: "+2", variant: "unbalanced" },
                { id: "q", label: "q", x: 135, y: 88, variant: "normal" },
                { id: "r", label: "r", x: 175, y: 140, variant: "root" },
            ],
            subtrees: [
                { id: "A", label: "A", topX: 85, topY: 140, width: 32, height: 42 },
                { id: "B", label: "B", topX: 145, topY: 188, width: 30, height: 38 },
                { id: "C", label: "C", topX: 195, topY: 188, width: 30, height: 38 },
                { id: "D", label: "D", topX: 260, topY: 88, width: 32, height: 42 },
            ],
            edges: [
                { fromX: 215, fromY: 35, toX: 135, toY: 88 },
                { fromX: 215, fromY: 35, toX: 260, toY: 88 },
                { fromX: 135, fromY: 88, toX: 85, toY: 140 },
                { fromX: 135, fromY: 88, toX: 175, toY: 140 },
                { fromX: 175, fromY: 140, toX: 145, toY: 188 },
                { fromX: 175, fromY: 140, toX: 195, toY: 188 },
            ],
        },
        after: {
            nodes: [
                { id: "r", label: "r", x: 520, y: 35, variant: "root" },
                { id: "q", label: "q", x: 445, y: 88, variant: "normal" },
                { id: "p", label: "p", x: 595, y: 88, variant: "normal" },
            ],
            subtrees: [
                { id: "A", label: "A", topX: 410, topY: 145, width: 30, height: 40 },
                { id: "B", label: "B", topX: 470, topY: 145, width: 30, height: 40 },
                { id: "C", label: "C", topX: 570, topY: 145, width: 30, height: 40 },
                { id: "D", label: "D", topX: 630, topY: 145, width: 30, height: 40 },
            ],
            edges: [
                { fromX: 520, fromY: 35, toX: 445, toY: 88 },
                { fromX: 520, fromY: 35, toX: 595, toY: 88 },
                { fromX: 445, fromY: 88, toX: 410, toY: 145 },
                { fromX: 445, fromY: 88, toX: 470, toY: 145 },
                { fromX: 595, fromY: 88, toX: 570, toY: 145 },
                { fromX: 595, fromY: 88, toX: 630, toY: 145 },
            ],
        },
    },
    RL: {
        id: "RL",
        operation: "RL(p)",
        before: {
            nodes: [
                { id: "p", label: "p", x: 105, y: 35, balance: "-2", variant: "unbalanced" },
                { id: "q", label: "q", x: 185, y: 88, variant: "normal" },
                { id: "r", label: "r", x: 145, y: 140, variant: "root" },
            ],
            subtrees: [
                { id: "A", label: "A", topX: 60, topY: 88, width: 32, height: 42 },
                { id: "B", label: "B", topX: 125, topY: 188, width: 30, height: 38 },
                { id: "C", label: "C", topX: 175, topY: 188, width: 30, height: 38 },
                { id: "D", label: "D", topX: 235, topY: 140, width: 32, height: 42 },
            ],
            edges: [
                { fromX: 105, fromY: 35, toX: 60, toY: 88 },
                { fromX: 105, fromY: 35, toX: 185, toY: 88 },
                { fromX: 185, fromY: 88, toX: 145, toY: 140 },
                { fromX: 185, fromY: 88, toX: 235, toY: 140 },
                { fromX: 145, fromY: 140, toX: 125, toY: 188 },
                { fromX: 145, fromY: 140, toX: 175, toY: 188 },
            ],
        },
        after: {
            nodes: [
                { id: "r", label: "r", x: 520, y: 35, variant: "root" },
                { id: "p", label: "p", x: 445, y: 88, variant: "normal" },
                { id: "q", label: "q", x: 595, y: 88, variant: "normal" },
            ],
            subtrees: [
                { id: "A", label: "A", topX: 410, topY: 145, width: 30, height: 40 },
                { id: "B", label: "B", topX: 470, topY: 145, width: 30, height: 40 },
                { id: "C", label: "C", topX: 570, topY: 145, width: 30, height: 40 },
                { id: "D", label: "D", topX: 630, topY: 145, width: 30, height: 40 },
            ],
            edges: [
                { fromX: 520, fromY: 35, toX: 445, toY: 88 },
                { fromX: 520, fromY: 35, toX: 595, toY: 88 },
                { fromX: 445, fromY: 88, toX: 410, toY: 145 },
                { fromX: 445, fromY: 88, toX: 470, toY: 145 },
                { fromX: 595, fromY: 88, toX: 570, toY: 145 },
                { fromX: 595, fromY: 88, toX: 630, toY: 145 },
            ],
        },
    },
};

const CASES_LIST: CaseType[] = ["LL", "RR", "LR", "RL"];

function renderSubtree(st: SubtreeItem) {
    const half = st.width / 2;
    const points = `${st.topX},${st.topY} ${st.topX - half},${st.topY + st.height} ${st.topX + half},${st.topY + st.height}`;
    return (
        <g key={`subtree-${st.id}`}>
            <polygon
                points={points}
                fill="rgba(51, 65, 85, 0.35)"
                stroke="#64748b"
                strokeWidth="1.2"
                strokeLinejoin="round"
            />
            <text
                x={st.topX}
                y={st.topY + st.height * 0.65}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#cbd5e1"
                fontSize="11"
                fontFamily="ui-monospace, monospace"
                fontWeight="600"
            >
                {st.label}
            </text>
        </g>
    );
}

function renderNode(n: NodeItem) {
    const isUnbalanced = n.variant === "unbalanced";
    const isRoot = n.variant === "root";

    const strokeColor = isUnbalanced ? "#f59e0b" : isRoot ? "#38bdf8" : "#94a3b8";
    const fillColor = isUnbalanced ? "#181206" : isRoot ? "#081827" : "#0f172a";
    const textColor = isUnbalanced ? "#fbbf24" : isRoot ? "#7dd3fc" : "#f1f5f9";

    return (
        <g key={`node-${n.id}`}>
            <circle
                cx={n.x}
                cy={n.y}
                r="15"
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth="1.6"
            />
            <text
                x={n.x}
                y={n.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={textColor}
                fontSize="12.5"
                fontWeight="bold"
                fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
                {n.label}
            </text>
            {n.balance && (
                <text
                    x={n.x + 19}
                    y={n.y - 10}
                    textAnchor="start"
                    dominantBaseline="central"
                    fill="#f59e0b"
                    fontSize="10"
                    fontFamily="ui-monospace, monospace"
                    fontWeight="bold"
                >
                    {n.balance}
                </text>
            )}
        </g>
    );
}

export default function AVLRotVisualizer() {
    const [selectedCase, setSelectedCase] = useState<CaseType>("LL");
    const active = CASES_DATA[selectedCase];

    return (
        <div className="w-full flex flex-col items-center justify-center my-6 select-none not-prose bg-transparent">
            {/* Minimalist Tab Selector */}
            <div className="flex items-center justify-center gap-1.5 mb-2">
                {CASES_LIST.map((c) => {
                    const isSelected = selectedCase === c;
                    return (
                        <button
                            key={c}
                            type="button"
                            onClick={() => setSelectedCase(c)}
                            className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-colors cursor-pointer ${
                                isSelected
                                    ? "bg-sky-500/15 text-sky-300 border border-sky-500/40"
                                    : "text-slate-400 hover:text-slate-200 border border-transparent hover:bg-slate-800/30"
                            }`}
                        >
                            {c}
                        </button>
                    );
                })}
            </div>

            {/* SVG Tree Diagrams */}
            <div className="w-full max-w-2xl flex justify-center">
                <svg
                    viewBox="0 0 680 236"
                    className="w-full h-auto overflow-visible"
                    style={{ maxHeight: "280px" }}
                >
                    <defs>
                        <marker
                            id="avl-arrow-marker"
                            viewBox="0 0 10 10"
                            refX="7"
                            refY="5"
                            markerWidth="6"
                            markerHeight="6"
                            orient="auto"
                        >
                            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8" />
                        </marker>
                    </defs>

                    {/* BEFORE TREE EDGES */}
                    {active.before.edges.map((e, idx) => (
                        <line
                            key={`before-edge-${idx}`}
                            x1={e.fromX}
                            y1={e.fromY}
                            x2={e.toX}
                            y2={e.toY}
                            stroke="#475569"
                            strokeWidth="1.4"
                        />
                    ))}

                    {/* BEFORE SUBTREES */}
                    {active.before.subtrees.map(renderSubtree)}

                    {/* BEFORE NODES */}
                    {active.before.nodes.map(renderNode)}

                    {/* TRANSFORMATION ARROW (CENTER) */}
                    <g transform="translate(340, 105)">
                        <line
                            x1="-24"
                            y1="0"
                            x2="24"
                            y2="0"
                            stroke="#38bdf8"
                            strokeWidth="2"
                            markerEnd="url(#avl-arrow-marker)"
                        />
                        <text
                            x="0"
                            y="-14"
                            textAnchor="middle"
                            dominantBaseline="central"
                            fill="#38bdf8"
                            fontSize="11"
                            fontFamily="ui-monospace, monospace"
                            fontWeight="bold"
                        >
                            {active.operation}
                        </text>
                    </g>

                    {/* AFTER TREE EDGES */}
                    {active.after.edges.map((e, idx) => (
                        <line
                            key={`after-edge-${idx}`}
                            x1={e.fromX}
                            y1={e.fromY}
                            x2={e.toX}
                            y2={e.toY}
                            stroke="#475569"
                            strokeWidth="1.4"
                        />
                    ))}

                    {/* AFTER SUBTREES */}
                    {active.after.subtrees.map(renderSubtree)}

                    {/* AFTER NODES */}
                    {active.after.nodes.map(renderNode)}
                </svg>
            </div>
        </div>
    );
}
