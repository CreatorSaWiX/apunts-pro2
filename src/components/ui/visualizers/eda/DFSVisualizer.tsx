"use client";

import React, { useState, useEffect } from "react";
import { m as motion } from "framer-motion";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

interface NodePos {
    id: number;
    x: number;
    y: number;
}

interface Edge {
    u: number;
    v: number;
}

interface Step {
    stack: number[]; // Pila de crides recursives actual
    vis: boolean[]; // Vector vis[0..5]
    current: number | null; // Node u actual de dfs(u)
    exploringEdge: [number, number] | null; // Aresta que s'està mirant en el bucle
    treeEdges: [number, number][]; // Arestes d'arbre (descobertes)
    backEdges: [number, number][]; // Arestes de retrocés (cicles)
    status: "active" | "backtrack" | "done";
}

// 6 nodes en posició planar neta
const NODES: NodePos[] = [
    { id: 0, x: 130, y: 55 },
    { id: 1, x: 260, y: 45 },
    { id: 2, x: 190, y: 155 },
    { id: 3, x: 390, y: 55 },
    { id: 4, x: 340, y: 155 },
    { id: 5, x: 70, y: 155 },
];

const NODE_MAP = new Map<number, NodePos>(NODES.map((n) => [n.id, n]));

// Arestes del graf (no dirigit)
const EDGES: Edge[] = [
    { u: 0, v: 1 },
    { u: 0, v: 2 },
    { u: 1, v: 3 },
    { u: 1, v: 4 },
    { u: 2, v: 4 },
    { u: 2, v: 5 },
    { u: 3, v: 4 },
];

function isSameEdge(e1: [number, number] | null, u: number, v: number): boolean {
    if (!e1) return false;
    return (e1[0] === u && e1[1] === v) || (e1[0] === v && e1[1] === u);
}

function hasEdge(list: [number, number][], u: number, v: number): boolean {
    return list.some((e) => (e[0] === u && e[1] === v) || (e[0] === v && e[1] === u));
}

// --- ESCENARI 1: DFS iniciant a u = 0 ---
const STEPS_U0: Step[] = [
    // 0: Inici dfs(0)
    {
        stack: [0],
        vis: [true, false, false, false, false, false],
        current: 0,
        exploringEdge: null,
        treeEdges: [],
        backEdges: [],
        status: "active",
    },
    // 1: 0 explora veí 1
    {
        stack: [0],
        vis: [true, false, false, false, false, false],
        current: 0,
        exploringEdge: [0, 1],
        treeEdges: [],
        backEdges: [],
        status: "active",
    },
    // 2: Entra dfs(1), aresta d'arbre (0, 1)
    {
        stack: [0, 1],
        vis: [true, true, false, false, false, false],
        current: 1,
        exploringEdge: null,
        treeEdges: [[0, 1]],
        backEdges: [],
        status: "active",
    },
    // 3: 1 explora veí 3
    {
        stack: [0, 1],
        vis: [true, true, false, false, false, false],
        current: 1,
        exploringEdge: [1, 3],
        treeEdges: [[0, 1]],
        backEdges: [],
        status: "active",
    },
    // 4: Entra dfs(3), aresta d'arbre (1, 3)
    {
        stack: [0, 1, 3],
        vis: [true, true, false, true, false, false],
        current: 3,
        exploringEdge: null,
        treeEdges: [
            [0, 1],
            [1, 3],
        ],
        backEdges: [],
        status: "active",
    },
    // 5: 3 explora veí 4
    {
        stack: [0, 1, 3],
        vis: [true, true, false, true, false, false],
        current: 3,
        exploringEdge: [3, 4],
        treeEdges: [
            [0, 1],
            [1, 3],
        ],
        backEdges: [],
        status: "active",
    },
    // 6: Entra dfs(4), aresta d'arbre (3, 4)
    {
        stack: [0, 1, 3, 4],
        vis: [true, true, false, true, true, false],
        current: 4,
        exploringEdge: null,
        treeEdges: [
            [0, 1],
            [1, 3],
            [3, 4],
        ],
        backEdges: [],
        status: "active",
    },
    // 7: 4 comprova veí 1 (ja visitat, no és pare 3) -> aresta de retrocés (cicle!)
    {
        stack: [0, 1, 3, 4],
        vis: [true, true, false, true, true, false],
        current: 4,
        exploringEdge: [4, 1],
        treeEdges: [
            [0, 1],
            [1, 3],
            [3, 4],
        ],
        backEdges: [[4, 1]],
        status: "active",
    },
    // 8: 4 explora veí 2
    {
        stack: [0, 1, 3, 4],
        vis: [true, true, false, true, true, false],
        current: 4,
        exploringEdge: [4, 2],
        treeEdges: [
            [0, 1],
            [1, 3],
            [3, 4],
        ],
        backEdges: [[4, 1]],
        status: "active",
    },
    // 9: Entra dfs(2), aresta d'arbre (4, 2)
    {
        stack: [0, 1, 3, 4, 2],
        vis: [true, true, true, true, true, false],
        current: 2,
        exploringEdge: null,
        treeEdges: [
            [0, 1],
            [1, 3],
            [3, 4],
            [4, 2],
        ],
        backEdges: [[4, 1]],
        status: "active",
    },
    // 10: 2 comprova veí 0 (ja visitat, no és pare 4) -> aresta de retrocés (cicle!)
    {
        stack: [0, 1, 3, 4, 2],
        vis: [true, true, true, true, true, false],
        current: 2,
        exploringEdge: [2, 0],
        treeEdges: [
            [0, 1],
            [1, 3],
            [3, 4],
            [4, 2],
        ],
        backEdges: [
            [4, 1],
            [2, 0],
        ],
        status: "active",
    },
    // 11: 2 explora veí 5
    {
        stack: [0, 1, 3, 4, 2],
        vis: [true, true, true, true, true, false],
        current: 2,
        exploringEdge: [2, 5],
        treeEdges: [
            [0, 1],
            [1, 3],
            [3, 4],
            [4, 2],
        ],
        backEdges: [
            [4, 1],
            [2, 0],
        ],
        status: "active",
    },
    // 12: Entra dfs(5), aresta d'arbre (2, 5). Tots visitats!
    {
        stack: [0, 1, 3, 4, 2, 5],
        vis: [true, true, true, true, true, true],
        current: 5,
        exploringEdge: null,
        treeEdges: [
            [0, 1],
            [1, 3],
            [3, 4],
            [4, 2],
            [2, 5],
        ],
        backEdges: [
            [4, 1],
            [2, 0],
        ],
        status: "active",
    },
    // 13: 5 no té més veïns -> retrocedeix a 2
    {
        stack: [0, 1, 3, 4, 2],
        vis: [true, true, true, true, true, true],
        current: 2,
        exploringEdge: null,
        treeEdges: [
            [0, 1],
            [1, 3],
            [3, 4],
            [4, 2],
            [2, 5],
        ],
        backEdges: [
            [4, 1],
            [2, 0],
        ],
        status: "backtrack",
    },
    // 14: 2 retrocedeix a 4
    {
        stack: [0, 1, 3, 4],
        vis: [true, true, true, true, true, true],
        current: 4,
        exploringEdge: null,
        treeEdges: [
            [0, 1],
            [1, 3],
            [3, 4],
            [4, 2],
            [2, 5],
        ],
        backEdges: [
            [4, 1],
            [2, 0],
        ],
        status: "backtrack",
    },
    // 15: 4 retrocedeix a 3
    {
        stack: [0, 1, 3],
        vis: [true, true, true, true, true, true],
        current: 3,
        exploringEdge: null,
        treeEdges: [
            [0, 1],
            [1, 3],
            [3, 4],
            [4, 2],
            [2, 5],
        ],
        backEdges: [
            [4, 1],
            [2, 0],
        ],
        status: "backtrack",
    },
    // 16: 3 retrocedeix a 1
    {
        stack: [0, 1],
        vis: [true, true, true, true, true, true],
        current: 1,
        exploringEdge: null,
        treeEdges: [
            [0, 1],
            [1, 3],
            [3, 4],
            [4, 2],
            [2, 5],
        ],
        backEdges: [
            [4, 1],
            [2, 0],
        ],
        status: "backtrack",
    },
    // 17: 1 retrocedeix a 0
    {
        stack: [0],
        vis: [true, true, true, true, true, true],
        current: 0,
        exploringEdge: null,
        treeEdges: [
            [0, 1],
            [1, 3],
            [3, 4],
            [4, 2],
            [2, 5],
        ],
        backEdges: [
            [4, 1],
            [2, 0],
        ],
        status: "backtrack",
    },
    // 18: DFS finalitzat!
    {
        stack: [],
        vis: [true, true, true, true, true, true],
        current: null,
        exploringEdge: null,
        treeEdges: [
            [0, 1],
            [1, 3],
            [3, 4],
            [4, 2],
            [2, 5],
        ],
        backEdges: [
            [4, 1],
            [2, 0],
        ],
        status: "done",
    },
];

// --- ESCENARI 2: DFS iniciant a u = 2 ---
const STEPS_U2: Step[] = [
    // 0: Inici dfs(2)
    {
        stack: [2],
        vis: [false, false, true, false, false, false],
        current: 2,
        exploringEdge: null,
        treeEdges: [],
        backEdges: [],
        status: "active",
    },
    // 1: 2 explora veí 0
    {
        stack: [2],
        vis: [false, false, true, false, false, false],
        current: 2,
        exploringEdge: [2, 0],
        treeEdges: [],
        backEdges: [],
        status: "active",
    },
    // 2: Entra dfs(0), aresta d'arbre (2, 0)
    {
        stack: [2, 0],
        vis: [true, false, true, false, false, false],
        current: 0,
        exploringEdge: null,
        treeEdges: [[2, 0]],
        backEdges: [],
        status: "active",
    },
    // 3: 0 explora veí 1
    {
        stack: [2, 0],
        vis: [true, false, true, false, false, false],
        current: 0,
        exploringEdge: [0, 1],
        treeEdges: [[2, 0]],
        backEdges: [],
        status: "active",
    },
    // 4: Entra dfs(1), aresta d'arbre (0, 1)
    {
        stack: [2, 0, 1],
        vis: [true, true, true, false, false, false],
        current: 1,
        exploringEdge: null,
        treeEdges: [
            [2, 0],
            [0, 1],
        ],
        backEdges: [],
        status: "active",
    },
    // 5: 1 explora veí 3
    {
        stack: [2, 0, 1],
        vis: [true, true, true, false, false, false],
        current: 1,
        exploringEdge: [1, 3],
        treeEdges: [
            [2, 0],
            [0, 1],
        ],
        backEdges: [],
        status: "active",
    },
    // 6: Entra dfs(3), aresta d'arbre (1, 3)
    {
        stack: [2, 0, 1, 3],
        vis: [true, true, true, true, false, false],
        current: 3,
        exploringEdge: null,
        treeEdges: [
            [2, 0],
            [0, 1],
            [1, 3],
        ],
        backEdges: [],
        status: "active",
    },
    // 7: 3 explora veí 4
    {
        stack: [2, 0, 1, 3],
        vis: [true, true, true, true, false, false],
        current: 3,
        exploringEdge: [3, 4],
        treeEdges: [
            [2, 0],
            [0, 1],
            [1, 3],
        ],
        backEdges: [],
        status: "active",
    },
    // 8: Entra dfs(4), aresta d'arbre (3, 4)
    {
        stack: [2, 0, 1, 3, 4],
        vis: [true, true, true, true, true, false],
        current: 4,
        exploringEdge: null,
        treeEdges: [
            [2, 0],
            [0, 1],
            [1, 3],
            [3, 4],
        ],
        backEdges: [],
        status: "active",
    },
    // 9: 4 comprova veí 1 (ja visitat) -> back edge (4, 1)
    {
        stack: [2, 0, 1, 3, 4],
        vis: [true, true, true, true, true, false],
        current: 4,
        exploringEdge: [4, 1],
        treeEdges: [
            [2, 0],
            [0, 1],
            [1, 3],
            [3, 4],
        ],
        backEdges: [[4, 1]],
        status: "active",
    },
    // 10: 4 comprova veí 2 (ja visitat) -> back edge (4, 2)
    {
        stack: [2, 0, 1, 3, 4],
        vis: [true, true, true, true, true, false],
        current: 4,
        exploringEdge: [4, 2],
        treeEdges: [
            [2, 0],
            [0, 1],
            [1, 3],
            [3, 4],
        ],
        backEdges: [
            [4, 1],
            [4, 2],
        ],
        status: "active",
    },
    // 11: Retrocedeix 4 -> 3 -> 1 -> 0 -> 2
    {
        stack: [2],
        vis: [true, true, true, true, true, false],
        current: 2,
        exploringEdge: null,
        treeEdges: [
            [2, 0],
            [0, 1],
            [1, 3],
            [3, 4],
        ],
        backEdges: [
            [4, 1],
            [4, 2],
        ],
        status: "backtrack",
    },
    // 12: 2 explora veí 5
    {
        stack: [2],
        vis: [true, true, true, true, true, false],
        current: 2,
        exploringEdge: [2, 5],
        treeEdges: [
            [2, 0],
            [0, 1],
            [1, 3],
            [3, 4],
        ],
        backEdges: [
            [4, 1],
            [4, 2],
        ],
        status: "active",
    },
    // 13: Entra dfs(5), aresta d'arbre (2, 5). Tots visitats!
    {
        stack: [2, 5],
        vis: [true, true, true, true, true, true],
        current: 5,
        exploringEdge: null,
        treeEdges: [
            [2, 0],
            [0, 1],
            [1, 3],
            [3, 4],
            [2, 5],
        ],
        backEdges: [
            [4, 1],
            [4, 2],
        ],
        status: "active",
    },
    // 14: Retrocedeix de 5 a 2
    {
        stack: [2],
        vis: [true, true, true, true, true, true],
        current: 2,
        exploringEdge: null,
        treeEdges: [
            [2, 0],
            [0, 1],
            [1, 3],
            [3, 4],
            [2, 5],
        ],
        backEdges: [
            [4, 1],
            [4, 2],
        ],
        status: "backtrack",
    },
    // 15: DFS finalitzat!
    {
        stack: [],
        vis: [true, true, true, true, true, true],
        current: null,
        exploringEdge: null,
        treeEdges: [
            [2, 0],
            [0, 1],
            [1, 3],
            [3, 4],
            [2, 5],
        ],
        backEdges: [
            [4, 1],
            [4, 2],
        ],
        status: "done",
    },
];

export default function DFSVisualizer() {
    const [startNode, setStartNode] = useState<0 | 2>(0);
    const [stepIdx, setStepIdx] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const steps = startNode === 0 ? STEPS_U0 : STEPS_U2;
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
        }, 1100);

        return () => clearInterval(interval);
    }, [isPlaying, steps.length]);

    const handleSelectStart = (node: 0 | 2) => {
        setIsPlaying(false);
        setStartNode(node);
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
                {/* Selector d'origen u=0 o u=2 */}
                <div className="flex items-center bg-white/[0.04] p-0.5 rounded-lg border border-white/10">
                    <button
                        type="button"
                        onClick={() => handleSelectStart(0)}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                            startNode === 0
                                ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                                : "text-slate-400 hover:text-slate-200 border border-transparent"
                        }`}
                    >
                        u=0
                    </button>
                    <button
                        type="button"
                        onClick={() => handleSelectStart(2)}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                            startNode === 2
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : "text-slate-400 hover:text-slate-200 border border-transparent"
                        }`}
                    >
                        u=2
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

            {/* 2. DIBUIX DEL GRAF (SVG SENSE FONS) */}
            <div className="relative w-full max-w-lg h-auto flex justify-center">
                <svg
                    viewBox="0 0 460 205"
                    className="w-full max-w-lg h-auto overflow-visible font-mono"
                    aria-label="Visualitzador DFS sobre graf"
                >
                    {/* ARESTES */}
                    <g>
                        {EDGES.map((edge) => {
                            const uNode = NODE_MAP.get(edge.u)!;
                            const vNode = NODE_MAP.get(edge.v)!;

                            const isExploring = isSameEdge(currentStep.exploringEdge, edge.u, edge.v);
                            const isTree = hasEdge(currentStep.treeEdges, edge.u, edge.v);
                            const isBack = hasEdge(currentStep.backEdges, edge.u, edge.v);

                            let strokeColor = "#334155";
                            let strokeWidth = "1.5";
                            let strokeDasharray = "none";

                            if (isExploring) {
                                strokeColor = "#fbbf24";
                                strokeWidth = "2.8";
                            } else if (isBack) {
                                strokeColor = "#f59e0b";
                                strokeWidth = "2";
                                strokeDasharray = "4 3";
                            } else if (isTree) {
                                strokeColor = "#38bdf8";
                                strokeWidth = "2.4";
                            }

                            return (
                                <line
                                    key={`edge-${edge.u}-${edge.v}`}
                                    x1={uNode.x}
                                    y1={uNode.y}
                                    x2={vNode.x}
                                    y2={vNode.y}
                                    stroke={strokeColor}
                                    strokeWidth={strokeWidth}
                                    strokeDasharray={strokeDasharray}
                                    className="transition-all duration-200"
                                />
                            );
                        })}
                    </g>

                    {/* VÈRTEXS DEL GRAF */}
                    <g>
                        {NODES.map((node) => {
                            const isVisited = currentStep.vis[node.id];
                            const isCurrent = currentStep.current === node.id;
                            const isInStack = currentStep.stack.includes(node.id);
                            const isDone = currentStep.status === "done";

                            let strokeColor = "#475569";
                            let strokeWidth = "1.5";
                            let fillColor = "#090d16";
                            let textColor = "#94a3b8";

                            if (isDone) {
                                strokeColor = "#10b981";
                                strokeWidth = "2";
                                fillColor = "rgba(16, 185, 129, 0.2)";
                                textColor = "#6ee7b7";
                            } else if (isCurrent) {
                                strokeColor = "#38bdf8";
                                strokeWidth = "2.6";
                                fillColor = "rgba(56, 189, 248, 0.28)";
                                textColor = "#ffffff";
                            } else if (isInStack) {
                                strokeColor = "#818cf8";
                                strokeWidth = "2";
                                fillColor = "rgba(129, 140, 248, 0.18)";
                                textColor = "#c7d2fe";
                            } else if (isVisited) {
                                strokeColor = "#10b981";
                                strokeWidth = "1.8";
                                fillColor = "rgba(16, 185, 129, 0.15)";
                                textColor = "#6ee7b7";
                            }

                            return (
                                <g key={`node-${node.id}`}>
                                    {/* Halo ressaltat per al node actiu */}
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
                                        {node.id}
                                    </text>
                                </g>
                            );
                        })}
                    </g>
                </svg>
            </div>

            {/* 3. ESTRUCTURES DE DADES: VECTOR VIS + PILA DE RECURSIÓ */}
            <div className="w-full max-w-lg flex flex-col items-center gap-3 pt-1">
                {/* Vector vis[0..5] */}
                <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                    <span className="text-[11px] text-slate-500 font-mono select-none mr-1">
                        vis:
                    </span>
                    {currentStep.vis.map((visited, idx) => {
                        const isCurrent = currentStep.current === idx;
                        const isDone = currentStep.status === "done";

                        let borderCls = "border-white/10";
                        let bgCls = "bg-white/[0.02]";
                        let textCls = "text-slate-500";
                        let idxCls = "text-slate-600";

                        if (isDone) {
                            borderCls = "border-emerald-400";
                            bgCls = "bg-emerald-500/20";
                            textCls = "text-emerald-300 font-bold";
                            idxCls = "text-emerald-400";
                        } else if (isCurrent) {
                            borderCls = "border-sky-400";
                            bgCls = "bg-sky-500/25";
                            textCls = "text-sky-300 font-bold";
                            idxCls = "text-sky-300 font-bold";
                        } else if (visited) {
                            borderCls = "border-emerald-500/40";
                            bgCls = "bg-emerald-500/15";
                            textCls = "text-emerald-400 font-semibold";
                            idxCls = "text-emerald-500";
                        }

                        return (
                            <div key={`vis-${idx}`} className="flex flex-col items-center gap-1">
                                <motion.div
                                    layout
                                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg border flex items-center justify-center text-xs transition-colors duration-150 ${borderCls} ${bgCls} ${textCls}`}
                                >
                                    {visited ? "T" : "F"}
                                </motion.div>
                                <span className={`text-[9px] sm:text-[10px] font-mono select-none transition-colors duration-150 ${idxCls}`}>
                                    [{idx}]
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Pila de crides recursives (call stack) */}
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="text-[11px] text-slate-500 font-mono select-none mr-0.5">
                        pila:
                    </span>
                    {currentStep.stack.length === 0 ? (
                        <span className="text-slate-600 text-xs italic font-mono px-2 py-0.5 rounded border border-white/5 bg-white/[0.01]">
                            ∅
                        </span>
                    ) : (
                        <div className="flex items-center gap-1 flex-wrap justify-center">
                            {currentStep.stack.map((u, i) => {
                                const isTop = i === currentStep.stack.length - 1;
                                return (
                                    <React.Fragment key={`stack-${u}-${i}`}>
                                        <span
                                            className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium border transition-colors ${
                                                isTop
                                                    ? "bg-sky-500/20 border-sky-400/40 text-sky-200 font-bold"
                                                    : "bg-indigo-500/10 border-indigo-500/20 text-indigo-300"
                                            }`}
                                        >
                                            {u}
                                        </span>
                                        {i < currentStep.stack.length - 1 && (
                                            <span className="text-slate-600 text-[10px]">→</span>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}
