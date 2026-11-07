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
    queue: number[]; // Cua FIFO actual
    dist: number[]; // Vector dist[0..5], -1 per a no descoberts
    current: number | null; // Node u que s'està processant
    exploringEdge: [number, number] | null; // Aresta que s'està comprovant
    treeEdges: [number, number][]; // Arestes de l'arbre BFS
    crossEdges: [number, number][]; // Arestes transversals (veí ja visitat)
    status: "init" | "pop" | "explore" | "done";
}

// 6 nodes amb la mateixa disposició planar que DFS
const NODES: NodePos[] = [
    { id: 0, x: 130, y: 55 },
    { id: 1, x: 260, y: 45 },
    { id: 2, x: 190, y: 155 },
    { id: 3, x: 390, y: 55 },
    { id: 4, x: 340, y: 155 },
    { id: 5, x: 70, y: 155 },
];

const NODE_MAP = new Map<number, NodePos>(NODES.map((n) => [n.id, n]));

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

// --- ESCENARI 1: BFS iniciant a s = 0 ---
const STEPS_S0: Step[] = [
    // 0: Inicialització: dist[0]=0, Q=[0]
    {
        queue: [0],
        dist: [0, -1, -1, -1, -1, -1],
        current: 0,
        exploringEdge: null,
        treeEdges: [],
        crossEdges: [],
        status: "init",
    },
    // 1: Desencua u=0
    {
        queue: [],
        dist: [0, -1, -1, -1, -1, -1],
        current: 0,
        exploringEdge: null,
        treeEdges: [],
        crossEdges: [],
        status: "pop",
    },
    // 2: u=0 explora veí 1 -> dist[1]=1, Q.push(1)
    {
        queue: [1],
        dist: [0, 1, -1, -1, -1, -1],
        current: 0,
        exploringEdge: [0, 1],
        treeEdges: [[0, 1]],
        crossEdges: [],
        status: "explore",
    },
    // 3: u=0 explora veí 2 -> dist[2]=1, Q.push(2)
    {
        queue: [1, 2],
        dist: [0, 1, 1, -1, -1, -1],
        current: 0,
        exploringEdge: [0, 2],
        treeEdges: [
            [0, 1],
            [0, 2],
        ],
        crossEdges: [],
        status: "explore",
    },
    // 4: Desencua u=1
    {
        queue: [2],
        dist: [0, 1, 1, -1, -1, -1],
        current: 1,
        exploringEdge: null,
        treeEdges: [
            [0, 1],
            [0, 2],
        ],
        crossEdges: [],
        status: "pop",
    },
    // 5: u=1 explora veí 3 -> dist[3]=2, Q.push(3)
    {
        queue: [2, 3],
        dist: [0, 1, 1, 2, -1, -1],
        current: 1,
        exploringEdge: [1, 3],
        treeEdges: [
            [0, 1],
            [0, 2],
            [1, 3],
        ],
        crossEdges: [],
        status: "explore",
    },
    // 6: u=1 explora veí 4 -> dist[4]=2, Q.push(4)
    {
        queue: [2, 3, 4],
        dist: [0, 1, 1, 2, 2, -1],
        current: 1,
        exploringEdge: [1, 4],
        treeEdges: [
            [0, 1],
            [0, 2],
            [1, 3],
            [1, 4],
        ],
        crossEdges: [],
        status: "explore",
    },
    // 7: Desencua u=2
    {
        queue: [3, 4],
        dist: [0, 1, 1, 2, 2, -1],
        current: 2,
        exploringEdge: null,
        treeEdges: [
            [0, 1],
            [0, 2],
            [1, 3],
            [1, 4],
        ],
        crossEdges: [],
        status: "pop",
    },
    // 8: u=2 comprova veí 4 (ja visitat) -> cross edge (2, 4)
    {
        queue: [3, 4],
        dist: [0, 1, 1, 2, 2, -1],
        current: 2,
        exploringEdge: [2, 4],
        treeEdges: [
            [0, 1],
            [0, 2],
            [1, 3],
            [1, 4],
        ],
        crossEdges: [[2, 4]],
        status: "explore",
    },
    // 9: u=2 explora veí 5 -> dist[5]=2, Q.push(5)
    {
        queue: [3, 4, 5],
        dist: [0, 1, 1, 2, 2, 2],
        current: 2,
        exploringEdge: [2, 5],
        treeEdges: [
            [0, 1],
            [0, 2],
            [1, 3],
            [1, 4],
            [2, 5],
        ],
        crossEdges: [[2, 4]],
        status: "explore",
    },
    // 10: Desencua u=3
    {
        queue: [4, 5],
        dist: [0, 1, 1, 2, 2, 2],
        current: 3,
        exploringEdge: null,
        treeEdges: [
            [0, 1],
            [0, 2],
            [1, 3],
            [1, 4],
            [2, 5],
        ],
        crossEdges: [[2, 4]],
        status: "pop",
    },
    // 11: u=3 comprova veí 4 (ja visitat) -> cross edge (3, 4)
    {
        queue: [4, 5],
        dist: [0, 1, 1, 2, 2, 2],
        current: 3,
        exploringEdge: [3, 4],
        treeEdges: [
            [0, 1],
            [0, 2],
            [1, 3],
            [1, 4],
            [2, 5],
        ],
        crossEdges: [
            [2, 4],
            [3, 4],
        ],
        status: "explore",
    },
    // 12: Desencua u=4 (cap veí nou)
    {
        queue: [5],
        dist: [0, 1, 1, 2, 2, 2],
        current: 4,
        exploringEdge: null,
        treeEdges: [
            [0, 1],
            [0, 2],
            [1, 3],
            [1, 4],
            [2, 5],
        ],
        crossEdges: [
            [2, 4],
            [3, 4],
        ],
        status: "pop",
    },
    // 13: Desencua u=5 (cap veí nou)
    {
        queue: [],
        dist: [0, 1, 1, 2, 2, 2],
        current: 5,
        exploringEdge: null,
        treeEdges: [
            [0, 1],
            [0, 2],
            [1, 3],
            [1, 4],
            [2, 5],
        ],
        crossEdges: [
            [2, 4],
            [3, 4],
        ],
        status: "pop",
    },
    // 14: BFS completat!
    {
        queue: [],
        dist: [0, 1, 1, 2, 2, 2],
        current: null,
        exploringEdge: null,
        treeEdges: [
            [0, 1],
            [0, 2],
            [1, 3],
            [1, 4],
            [2, 5],
        ],
        crossEdges: [
            [2, 4],
            [3, 4],
        ],
        status: "done",
    },
];

// --- ESCENARI 2: BFS iniciant a s = 2 ---
const STEPS_S2: Step[] = [
    // 0: Inicialització: dist[2]=0, Q=[2]
    {
        queue: [2],
        dist: [-1, -1, 0, -1, -1, -1],
        current: 2,
        exploringEdge: null,
        treeEdges: [],
        crossEdges: [],
        status: "init",
    },
    // 1: Desencua u=2
    {
        queue: [],
        dist: [-1, -1, 0, -1, -1, -1],
        current: 2,
        exploringEdge: null,
        treeEdges: [],
        crossEdges: [],
        status: "pop",
    },
    // 2: u=2 explora veí 0 -> dist[0]=1, Q.push(0)
    {
        queue: [0],
        dist: [1, -1, 0, -1, -1, -1],
        current: 2,
        exploringEdge: [2, 0],
        treeEdges: [[2, 0]],
        crossEdges: [],
        status: "explore",
    },
    // 3: u=2 explora veí 4 -> dist[4]=1, Q.push(4)
    {
        queue: [0, 4],
        dist: [1, -1, 0, -1, 1, -1],
        current: 2,
        exploringEdge: [2, 4],
        treeEdges: [
            [2, 0],
            [2, 4],
        ],
        crossEdges: [],
        status: "explore",
    },
    // 4: u=2 explora veí 5 -> dist[5]=1, Q.push(5)
    {
        queue: [0, 4, 5],
        dist: [1, -1, 0, -1, 1, 1],
        current: 2,
        exploringEdge: [2, 5],
        treeEdges: [
            [2, 0],
            [2, 4],
            [2, 5],
        ],
        crossEdges: [],
        status: "explore",
    },
    // 5: Desencua u=0
    {
        queue: [4, 5],
        dist: [1, -1, 0, -1, 1, 1],
        current: 0,
        exploringEdge: null,
        treeEdges: [
            [2, 0],
            [2, 4],
            [2, 5],
        ],
        crossEdges: [],
        status: "pop",
    },
    // 6: u=0 explora veí 1 -> dist[1]=2, Q.push(1)
    {
        queue: [4, 5, 1],
        dist: [1, 2, 0, -1, 1, 1],
        current: 0,
        exploringEdge: [0, 1],
        treeEdges: [
            [2, 0],
            [2, 4],
            [2, 5],
            [0, 1],
        ],
        crossEdges: [],
        status: "explore",
    },
    // 7: Desencua u=4
    {
        queue: [5, 1],
        dist: [1, 2, 0, -1, 1, 1],
        current: 4,
        exploringEdge: null,
        treeEdges: [
            [2, 0],
            [2, 4],
            [2, 5],
            [0, 1],
        ],
        crossEdges: [],
        status: "pop",
    },
    // 8: u=4 comprova veí 1 (ja visitat) -> cross edge (4, 1)
    {
        queue: [5, 1],
        dist: [1, 2, 0, -1, 1, 1],
        current: 4,
        exploringEdge: [4, 1],
        treeEdges: [
            [2, 0],
            [2, 4],
            [2, 5],
            [0, 1],
        ],
        crossEdges: [[4, 1]],
        status: "explore",
    },
    // 9: u=4 explora veí 3 -> dist[3]=2, Q.push(3)
    {
        queue: [5, 1, 3],
        dist: [1, 2, 0, 2, 1, 1],
        current: 4,
        exploringEdge: [4, 3],
        treeEdges: [
            [2, 0],
            [2, 4],
            [2, 5],
            [0, 1],
            [4, 3],
        ],
        crossEdges: [[4, 1]],
        status: "explore",
    },
    // 10: Desencua u=5
    {
        queue: [1, 3],
        dist: [1, 2, 0, 2, 1, 1],
        current: 5,
        exploringEdge: null,
        treeEdges: [
            [2, 0],
            [2, 4],
            [2, 5],
            [0, 1],
            [4, 3],
        ],
        crossEdges: [[4, 1]],
        status: "pop",
    },
    // 11: Desencua u=1 -> comprova veí 3 (ja visitat) -> cross edge (1, 3)
    {
        queue: [3],
        dist: [1, 2, 0, 2, 1, 1],
        current: 1,
        exploringEdge: [1, 3],
        treeEdges: [
            [2, 0],
            [2, 4],
            [2, 5],
            [0, 1],
            [4, 3],
        ],
        crossEdges: [
            [4, 1],
            [1, 3],
        ],
        status: "explore",
    },
    // 12: Desencua u=3
    {
        queue: [],
        dist: [1, 2, 0, 2, 1, 1],
        current: 3,
        exploringEdge: null,
        treeEdges: [
            [2, 0],
            [2, 4],
            [2, 5],
            [0, 1],
            [4, 3],
        ],
        crossEdges: [
            [4, 1],
            [1, 3],
        ],
        status: "pop",
    },
    // 13: BFS completat!
    {
        queue: [],
        dist: [1, 2, 0, 2, 1, 1],
        current: null,
        exploringEdge: null,
        treeEdges: [
            [2, 0],
            [2, 4],
            [2, 5],
            [0, 1],
            [4, 3],
        ],
        crossEdges: [
            [4, 1],
            [1, 3],
        ],
        status: "done",
    },
];

export default function BFSVisualizer() {
    const [startNode, setStartNode] = useState<0 | 2>(0);
    const [stepIdx, setStepIdx] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const steps = startNode === 0 ? STEPS_S0 : STEPS_S2;
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
                {/* Selector d'origen s=0 o s=2 */}
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
                        s=0
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
                        s=2
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
                    aria-label="Visualitzador BFS sobre graf"
                >
                    {/* ARESTES */}
                    <g>
                        {EDGES.map((edge) => {
                            const uNode = NODE_MAP.get(edge.u)!;
                            const vNode = NODE_MAP.get(edge.v)!;

                            const isExploring = isSameEdge(currentStep.exploringEdge, edge.u, edge.v);
                            const isTree = hasEdge(currentStep.treeEdges, edge.u, edge.v);
                            const isCross = hasEdge(currentStep.crossEdges, edge.u, edge.v);

                            let strokeColor = "#334155";
                            let strokeWidth = "1.5";
                            let strokeDasharray = "none";

                            if (isExploring) {
                                strokeColor = "#fbbf24";
                                strokeWidth = "2.8";
                            } else if (isCross) {
                                strokeColor = "#64748b";
                                strokeWidth = "1.6";
                                strokeDasharray = "3 3";
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
                            const d = currentStep.dist[node.id];
                            const isDiscovered = d !== -1;
                            const isCurrent = currentStep.current === node.id;
                            const isInQueue = currentStep.queue.includes(node.id);
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
                            } else if (isInQueue) {
                                strokeColor = "#818cf8";
                                strokeWidth = "2";
                                fillColor = "rgba(129, 140, 248, 0.18)";
                                textColor = "#c7d2fe";
                            } else if (isDiscovered) {
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

                                    {/* Identificador del node */}
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

                                    {/* Xapa de distància d=... a dalt del node si està descobert */}
                                    {isDiscovered && (
                                        <g>
                                            <rect
                                                x={node.x - 11}
                                                y={node.y - 25}
                                                width="22"
                                                height="12"
                                                rx="3"
                                                fill="#020617"
                                                stroke={isCurrent ? "#38bdf8" : "#10b981"}
                                                strokeWidth="1"
                                                className="transition-colors duration-200"
                                            />
                                            <text
                                                x={node.x}
                                                y={node.y - 18}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                fontSize="8"
                                                fill={isCurrent ? "#7dd3fc" : "#6ee7b7"}
                                                fontWeight="600"
                                                className="select-none pointer-events-none"
                                            >
                                                d={d}
                                            </text>
                                        </g>
                                    )}
                                </g>
                            );
                        })}
                    </g>
                </svg>
            </div>

            {/* 3. ESTRUCTURES DE DADES: VECTOR DIST + CUA FIFO */}
            <div className="w-full max-w-lg flex flex-col items-center gap-3 pt-1">
                {/* Vector dist[0..5] */}
                <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                    <span className="text-[11px] text-slate-500 font-mono select-none mr-1">
                        dist:
                    </span>
                    {currentStep.dist.map((d, idx) => {
                        const isCurrent = currentStep.current === idx;
                        const isDiscovered = d !== -1;
                        const isDone = currentStep.status === "done";

                        let borderCls = "border-white/10";
                        let bgCls = "bg-white/[0.02]";
                        let textCls = "text-slate-600";
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
                        } else if (isDiscovered) {
                            borderCls = "border-emerald-500/40";
                            bgCls = "bg-emerald-500/15";
                            textCls = "text-emerald-400 font-semibold";
                            idxCls = "text-emerald-500";
                        }

                        return (
                            <div key={`dist-${idx}`} className="flex flex-col items-center gap-1">
                                <motion.div
                                    layout
                                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg border flex items-center justify-center text-xs transition-colors duration-150 ${borderCls} ${bgCls} ${textCls}`}
                                >
                                    {d === -1 ? "∞" : d}
                                </motion.div>
                                <span className={`text-[9px] sm:text-[10px] font-mono select-none transition-colors duration-150 ${idxCls}`}>
                                    [{idx}]
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Cua FIFO (Q) */}
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="text-[11px] text-slate-500 font-mono select-none mr-0.5">
                        cua:
                    </span>
                    {currentStep.queue.length === 0 ? (
                        <span className="text-slate-600 text-xs italic font-mono px-2 py-0.5 rounded border border-white/5 bg-white/[0.01]">
                            ∅
                        </span>
                    ) : (
                        <div className="flex items-center gap-1 flex-wrap justify-center">
                            {currentStep.queue.map((u, i) => {
                                const isFront = i === 0;
                                return (
                                    <React.Fragment key={`q-${u}-${i}`}>
                                        <span
                                            className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium border transition-colors ${
                                                isFront
                                                    ? "bg-sky-500/20 border-sky-400/40 text-sky-200 font-bold"
                                                    : "bg-indigo-500/10 border-indigo-500/20 text-indigo-300"
                                            }`}
                                        >
                                            {u}
                                        </span>
                                        {i < currentStep.queue.length - 1 && (
                                            <span className="text-slate-600 text-[10px]">·</span>
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
