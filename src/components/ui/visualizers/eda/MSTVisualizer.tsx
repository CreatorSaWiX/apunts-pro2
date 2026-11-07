"use client";

import React, { useState, useEffect } from "react";
import { m as motion } from "framer-motion";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

type AlgorithmType = "prim" | "kruskal";

interface NodePos {
    id: number;
    x: number;
    y: number;
}

interface Edge {
    id: string;
    u: number;
    v: number;
    w: number;
    labelPos: { x: number; y: number };
}

const NODES: NodePos[] = [
    { id: 0, x: 60, y: 98 },
    { id: 1, x: 180, y: 45 },
    { id: 2, x: 180, y: 152 },
    { id: 3, x: 310, y: 45 },
    { id: 4, x: 310, y: 152 },
    { id: 5, x: 420, y: 98 },
];

const NODE_MAP = new Map<number, NodePos>(NODES.map((n) => [n.id, n]));

const EDGES: Edge[] = [
    { id: "3-4", u: 3, v: 4, w: 1, labelPos: { x: 324, y: 98 } },
    { id: "0-2", u: 0, v: 2, w: 2, labelPos: { x: 114, y: 130 } },
    { id: "1-2", u: 1, v: 2, w: 3, labelPos: { x: 166, y: 98 } },
    { id: "0-1", u: 0, v: 1, w: 4, labelPos: { x: 114, y: 66 } },
    { id: "2-4", u: 2, v: 4, w: 5, labelPos: { x: 245, y: 164 } },
    { id: "1-3", u: 1, v: 3, w: 6, labelPos: { x: 245, y: 32 } },
    { id: "3-5", u: 3, v: 5, w: 7, labelPos: { x: 370, y: 66 } },
    { id: "4-5", u: 4, v: 5, w: 8, labelPos: { x: 370, y: 130 } },
];

function getEdgePath(edge: Edge): string {
    const u = NODE_MAP.get(edge.u)!;
    const v = NODE_MAP.get(edge.v)!;
    const r = 14;

    const dx = v.x - u.x;
    const dy = v.y - u.y;
    const len = Math.hypot(dx, dy);
    if (len === 0) return "";

    const ux = dx / len;
    const uy = dy / len;

    const startX = u.x + ux * r;
    const startY = u.y + uy * r;
    const endX = v.x - ux * r;
    const endY = v.y - uy * r;

    return `M ${startX} ${startY} L ${endX} ${endY}`;
}

interface Step {
    treeEdges: string[]; // Arestes acceptades a l'MST
    activeEdge: string | null; // Aresta que s'està considerant
    cycleEdge: string | null; // Aresta que forma cicle (rebutjada)
    treeNodes: number[]; // Nodes connectats a l'arbre (Prim)
    components: number[]; // Representant DSU de cada node 0..5 (Kruskal)
    totalWeight: number; // Suma acumulada de pesos a l'MST
    crossingCandidates?: string[]; // Arestes que creuen el tall actual (Prim)
}

// --- PASSOS DE PRIM (inici a s = 0) ---
const STEPS_PRIM: Step[] = [
    {
        treeEdges: [],
        activeEdge: null,
        cycleEdge: null,
        treeNodes: [0],
        components: [0, 1, 2, 3, 4, 5],
        totalWeight: 0,
        crossingCandidates: ["0-2", "0-1"],
    },
    {
        treeEdges: ["0-2"],
        activeEdge: "0-2",
        cycleEdge: null,
        treeNodes: [0, 2],
        components: [0, 1, 2, 3, 4, 5],
        totalWeight: 2,
        crossingCandidates: ["1-2", "0-1", "2-4"],
    },
    {
        treeEdges: ["0-2", "1-2"],
        activeEdge: "1-2",
        cycleEdge: null,
        treeNodes: [0, 1, 2],
        components: [0, 1, 2, 3, 4, 5],
        totalWeight: 5,
        crossingCandidates: ["2-4", "1-3"],
    },
    {
        treeEdges: ["0-2", "1-2", "2-4"],
        activeEdge: "2-4",
        cycleEdge: null,
        treeNodes: [0, 1, 2, 4],
        components: [0, 1, 2, 3, 4, 5],
        totalWeight: 10,
        crossingCandidates: ["3-4", "1-3", "4-5"],
    },
    {
        treeEdges: ["0-2", "1-2", "2-4", "3-4"],
        activeEdge: "3-4",
        cycleEdge: null,
        treeNodes: [0, 1, 2, 3, 4],
        components: [0, 1, 2, 3, 4, 5],
        totalWeight: 11,
        crossingCandidates: ["3-5", "4-5"],
    },
    {
        treeEdges: ["0-2", "1-2", "2-4", "3-4", "3-5"],
        activeEdge: "3-5",
        cycleEdge: null,
        treeNodes: [0, 1, 2, 3, 4, 5],
        components: [0, 1, 2, 3, 4, 5],
        totalWeight: 18,
        crossingCandidates: [],
    },
];

// --- PASSOS DE KRUSKAL (ordenat per pesos 1..8 amb DSU) ---
const STEPS_KRUSKAL: Step[] = [
    {
        treeEdges: [],
        activeEdge: null,
        cycleEdge: null,
        treeNodes: [],
        components: [0, 1, 2, 3, 4, 5],
        totalWeight: 0,
    },
    // 1: (3, 4) w=1 -> diferents components -> uneix
    {
        treeEdges: ["3-4"],
        activeEdge: "3-4",
        cycleEdge: null,
        treeNodes: [3, 4],
        components: [0, 1, 2, 3, 3, 5],
        totalWeight: 1,
    },
    // 2: (0, 2) w=2 -> diferents components -> uneix
    {
        treeEdges: ["3-4", "0-2"],
        activeEdge: "0-2",
        cycleEdge: null,
        treeNodes: [0, 2, 3, 4],
        components: [0, 1, 0, 3, 3, 5],
        totalWeight: 3,
    },
    // 3: (1, 2) w=3 -> diferents components -> uneix
    {
        treeEdges: ["3-4", "0-2", "1-2"],
        activeEdge: "1-2",
        cycleEdge: null,
        treeNodes: [0, 1, 2, 3, 4],
        components: [0, 0, 0, 3, 3, 5],
        totalWeight: 6,
    },
    // 4: (0, 1) w=4 -> mateixa component {0,1,2} -> cicle!
    {
        treeEdges: ["3-4", "0-2", "1-2"],
        activeEdge: "0-1",
        cycleEdge: "0-1",
        treeNodes: [0, 1, 2, 3, 4],
        components: [0, 0, 0, 3, 3, 5],
        totalWeight: 6,
    },
    // 5: (2, 4) w=5 -> diferents components {0,1,2} i {3,4} -> uneix
    {
        treeEdges: ["3-4", "0-2", "1-2", "2-4"],
        activeEdge: "2-4",
        cycleEdge: null,
        treeNodes: [0, 1, 2, 3, 4],
        components: [0, 0, 0, 0, 0, 5],
        totalWeight: 11,
    },
    // 6: (1, 3) w=6 -> mateixa component {0,1,2,3,4} -> cicle!
    {
        treeEdges: ["3-4", "0-2", "1-2", "2-4"],
        activeEdge: "1-3",
        cycleEdge: "1-3",
        treeNodes: [0, 1, 2, 3, 4],
        components: [0, 0, 0, 0, 0, 5],
        totalWeight: 11,
    },
    // 7: (3, 5) w=7 -> uneix {0,1,2,3,4} amb {5} -> MST complet (n-1 = 5)
    {
        treeEdges: ["3-4", "0-2", "1-2", "2-4", "3-5"],
        activeEdge: "3-5",
        cycleEdge: null,
        treeNodes: [0, 1, 2, 3, 4, 5],
        components: [0, 0, 0, 0, 0, 0],
        totalWeight: 18,
    },
];

export default function MSTVisualizer() {
    const [algo, setAlgo] = useState<AlgorithmType>("prim");
    const [stepIdx, setStepIdx] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const steps = algo === "prim" ? STEPS_PRIM : STEPS_KRUSKAL;
    const step = steps[stepIdx] || steps[0];

    useEffect(() => {
        setStepIdx(0);
        setIsPlaying(false);
    }, [algo]);

    useEffect(() => {
        if (!isPlaying) return;
        const timer = setInterval(() => {
            setStepIdx((prev) => {
                if (prev >= steps.length - 1) {
                    setIsPlaying(false);
                    return prev;
                }
                return prev + 1;
            });
        }, 1300);
        return () => clearInterval(timer);
    }, [isPlaying, steps.length]);

    const nextStep = () => {
        setIsPlaying(false);
        setStepIdx((prev) => Math.min(prev + 1, steps.length - 1));
    };

    const prevStep = () => {
        setIsPlaying(false);
        setStepIdx((prev) => Math.max(prev - 1, 0));
    };

    const reset = () => {
        setIsPlaying(false);
        setStepIdx(0);
    };

    return (
        <div className="w-full flex flex-col items-center justify-center gap-4 my-8 font-mono select-none not-prose px-1">

            {/* 1. BARRA SUPERIOR MINIMALISTA APPLE / LINEAR */}
            <div className="w-full max-w-lg flex items-center justify-between text-xs">
                {/* Switcher Prim / Kruskal */}
                <div className="flex items-center bg-white/[0.04] p-0.5 rounded-lg border border-white/10">
                    <button
                        type="button"
                        onClick={() => setAlgo("prim")}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                            algo === "prim"
                                ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                                : "text-slate-400 hover:text-slate-200 border border-transparent"
                        }`}
                    >
                        Prim
                    </button>
                    <button
                        type="button"
                        onClick={() => setAlgo("kruskal")}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                            algo === "kruskal"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : "text-slate-400 hover:text-slate-200 border border-transparent"
                        }`}
                    >
                        Kruskal
                    </button>
                </div>

                {/* Pes acumulat de l'MST */}
                <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                        ∑ = {step.totalWeight}
                    </span>
                    {step.cycleEdge && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 animate-pulse">
                            cicle
                        </span>
                    )}
                </div>

                {/* Controls de reproducció */}
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
                        onClick={() => setIsPlaying((p) => !p)}
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
                    <span className="text-[10px] font-mono text-slate-500 px-1.5 min-w-[28px] text-center">
                        {stepIdx + 1}/{steps.length}
                    </span>
                </div>
            </div>

            {/* 2. GRAF VECTORIAL SENSE FONS (SVG) */}
            <div className="relative w-full max-w-lg h-auto flex justify-center">
                <svg
                    viewBox="0 0 480 195"
                    className="w-full max-w-lg h-auto overflow-visible font-mono"
                    aria-label="Arbre d'Expansio Minim"
                >
                    {/* ARESTES */}
                    <g>
                        {EDGES.map((edge) => {
                            const isTree = step.treeEdges.includes(edge.id);
                            const isCycle = step.cycleEdge === edge.id;
                            const isActive = step.activeEdge === edge.id;
                            const isCandidate =
                                algo === "prim" &&
                                !isTree &&
                                step.crossingCandidates?.includes(edge.id);

                            let stroke = "#334155";
                            let strokeWidth = "1.2";
                            let strokeDasharray = "none";

                            if (isTree) {
                                stroke = "#10b981";
                                strokeWidth = "2.4";
                            } else if (isCycle) {
                                stroke = "#f59e0b";
                                strokeWidth = "2";
                                strokeDasharray = "3 3";
                            } else if (isActive) {
                                stroke = "#38bdf8";
                                strokeWidth = "2";
                            } else if (isCandidate) {
                                stroke = "#38bdf8";
                                strokeWidth = "1.4";
                                strokeDasharray = "3 2";
                            }

                            return (
                                <g key={`edge-${edge.id}`}>
                                    <path
                                        d={getEdgePath(edge)}
                                        fill="none"
                                        stroke={stroke}
                                        strokeWidth={strokeWidth}
                                        strokeDasharray={strokeDasharray}
                                        className="transition-all duration-200"
                                    />
                                    {/* Pastilla del pes de l'aresta */}
                                    <rect
                                        x={edge.labelPos.x - 7}
                                        y={edge.labelPos.y - 7}
                                        width="14"
                                        height="14"
                                        rx="3"
                                        fill="#090d16"
                                        stroke={
                                            isTree
                                                ? "#10b981"
                                                : isCycle
                                                ? "#f59e0b"
                                                : isActive || isCandidate
                                                ? "#38bdf8"
                                                : "#334155"
                                        }
                                        strokeWidth="1"
                                        className="transition-colors duration-200"
                                    />
                                    <text
                                        x={edge.labelPos.x}
                                        y={edge.labelPos.y + 0.5}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fontSize="9"
                                        fontWeight="600"
                                        fill={
                                            isTree
                                                ? "#6ee7b7"
                                                : isCycle
                                                ? "#fbbf24"
                                                : isActive || isCandidate
                                                ? "#7dd3fc"
                                                : "#94a3b8"
                                        }
                                        className="select-none pointer-events-none"
                                    >
                                        {edge.w}
                                    </text>
                                </g>
                            );
                        })}
                    </g>

                    {/* VÈRTEXS DEL GRAF */}
                    <g>
                        {NODES.map((node) => {
                            const isPrimInTree = algo === "prim" && step.treeNodes.includes(node.id);
                            const kruskalComp = step.components[node.id];
                            const isKruskalConnected = algo === "kruskal" && step.treeNodes.includes(node.id);

                            let strokeColor = "#334155";
                            let strokeWidth = "1.5";
                            let fillColor = "#090d16";
                            let textColor = "#94a3b8";

                            if (algo === "prim") {
                                if (isPrimInTree) {
                                    strokeColor = "#10b981";
                                    strokeWidth = "2";
                                    fillColor = "rgba(16, 185, 129, 0.16)";
                                    textColor = "#6ee7b7";
                                }
                            } else {
                                if (isKruskalConnected) {
                                    strokeColor = "#10b981";
                                    strokeWidth = "2";
                                    fillColor = "rgba(16, 185, 129, 0.16)";
                                    textColor = "#6ee7b7";
                                }
                            }

                            return (
                                <g key={`node-${node.id}`}>
                                    <circle
                                        cx={node.x}
                                        cy={node.y}
                                        r="14"
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
                                        fontSize="11"
                                        className="select-none pointer-events-none"
                                    >
                                        {node.id}
                                    </text>

                                    {/* Indicador de component DSU a Kruskal */}
                                    {algo === "kruskal" && (
                                        <text
                                            x={node.x}
                                            y={node.y - 18}
                                            textAnchor="middle"
                                            fontSize="8.5"
                                            fontWeight="600"
                                            fill="#64748b"
                                            className="select-none pointer-events-none"
                                        >
                                            c:{kruskalComp}
                                        </text>
                                    )}
                                </g>
                            );
                        })}
                    </g>
                </svg>
            </div>

            {/* 3. ESTRUCTURES INTERNES SEGONS L'ALGORISME */}
            <div className="w-full max-w-lg flex flex-col items-center gap-2 pt-1 text-xs">
                {algo === "prim" ? (
                    // ESTRUCTURES PRIM: Tall d'arestes candidates
                    <div className="flex items-center gap-1.5 flex-wrap justify-center">
                        <span className="text-[11px] text-slate-500 font-mono select-none mr-1">
                            tall:
                        </span>
                        {step.crossingCandidates && step.crossingCandidates.length > 0 ? (
                            step.crossingCandidates.map((edgeId, i) => {
                                const edge = EDGES.find((e) => e.id === edgeId)!;
                                const isMin = i === 0;
                                return (
                                    <span
                                        key={`cand-${edgeId}`}
                                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono border transition-colors ${
                                            isMin
                                                ? "bg-sky-500/20 border-sky-400/40 text-sky-200 font-bold"
                                                : "bg-white/[0.03] border-white/10 text-slate-400"
                                        }`}
                                    >
                                        ({edge.u},{edge.v}):{edge.w}
                                    </span>
                                );
                            })
                        ) : (
                            <span className="text-slate-600 text-xs font-mono px-2 py-0.5 rounded border border-white/5 bg-white/[0.01]">
                                ∅ (complet)
                            </span>
                        )}
                    </div>
                ) : (
                    // ESTRUCTURES KRUSKAL: Cua ordenada d'arestes i components DSU
                    <div className="flex items-center gap-1.5 flex-wrap justify-center">
                        <span className="text-[11px] text-slate-500 font-mono select-none mr-1">
                            arestes:
                        </span>
                        {EDGES.map((edge) => {
                            const isAccepted = step.treeEdges.includes(edge.id);
                            const isCycle = step.cycleEdge === edge.id;
                            const isActive = step.activeEdge === edge.id;

                            let cls = "bg-white/[0.03] border-white/10 text-slate-500";
                            if (isAccepted) {
                                cls = "bg-emerald-500/20 border-emerald-400/40 text-emerald-300 font-bold";
                            } else if (isCycle) {
                                cls = "bg-amber-500/20 border-amber-400/40 text-amber-300 line-through font-bold";
                            } else if (isActive) {
                                cls = "bg-sky-500/20 border-sky-400/40 text-sky-200 font-bold";
                            }

                            return (
                                <span
                                    key={`kr-edge-${edge.id}`}
                                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono border transition-colors ${cls}`}
                                >
                                    {edge.w}
                                </span>
                            );
                        })}
                    </div>
                )}
            </div>

        </div>
    );
}
