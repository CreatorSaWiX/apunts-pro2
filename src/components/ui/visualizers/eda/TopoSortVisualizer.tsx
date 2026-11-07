"use client";

import React, { useState, useEffect } from "react";
import { m as motion } from "framer-motion";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

interface NodeCoord {
    id: number;
    x: number;
    y: number;
}

interface Edge {
    u: number;
    v: number;
    isBack?: boolean;
}

interface Step {
    activeNode: number | null;
    activeEdge: [number, number] | null;
    removedEdges: [number, number][];
    ge: number[];
    queue: number[];
    ordre: number[];
    status: "init" | "pop" | "decrement" | "done" | "cycle";
}

const NODES: NodeCoord[] = [
    { id: 0, x: 65, y: 45 },
    { id: 1, x: 65, y: 125 },
    { id: 2, x: 195, y: 45 },
    { id: 3, x: 195, y: 125 },
    { id: 4, x: 325, y: 55 },
    { id: 5, x: 440, y: 90 },
];

const NODE_MAP = new Map<number, NodeCoord>(NODES.map((n) => [n.id, n]));

// ── Arestes Mode DAG ──────────────────────────────────────────────────────────
const EDGES_DAG: Edge[] = [
    { u: 0, v: 2 },
    { u: 0, v: 3 },
    { u: 1, v: 3 },
    { u: 2, v: 4 },
    { u: 3, v: 4 },
    { u: 3, v: 5 },
    { u: 4, v: 5 },
];

// ── Arestes Mode Cicle (+ aresta de retrocés 4 -> 2) ──────────────────────────
const EDGES_CYCLE: Edge[] = [
    ...EDGES_DAG,
    { u: 4, v: 2, isBack: true },
];

// ── Passos Mode DAG ──────────────────────────────────────────────────────────
const STEPS_DAG: Step[] = [
    // 0: Estat inicial
    {
        activeNode: null,
        activeEdge: null,
        removedEdges: [],
        ge: [0, 0, 1, 2, 2, 2],
        queue: [0, 1],
        ordre: [],
        status: "init",
    },
    // 1: Pop 0 de Q
    {
        activeNode: 0,
        activeEdge: null,
        removedEdges: [],
        ge: [0, 0, 1, 2, 2, 2],
        queue: [1],
        ordre: [0],
        status: "pop",
    },
    // 2: Elimina 0 -> 2 (ge[2] = 0 -> entra a Q)
    {
        activeNode: 0,
        activeEdge: [0, 2],
        removedEdges: [[0, 2]],
        ge: [0, 0, 0, 2, 2, 2],
        queue: [1, 2],
        ordre: [0],
        status: "decrement",
    },
    // 3: Elimina 0 -> 3 (ge[3] = 1)
    {
        activeNode: 0,
        activeEdge: [0, 3],
        removedEdges: [[0, 2], [0, 3]],
        ge: [0, 0, 0, 1, 2, 2],
        queue: [1, 2],
        ordre: [0],
        status: "decrement",
    },
    // 4: Pop 1 de Q
    {
        activeNode: 1,
        activeEdge: null,
        removedEdges: [[0, 2], [0, 3]],
        ge: [0, 0, 0, 1, 2, 2],
        queue: [2],
        ordre: [0, 1],
        status: "pop",
    },
    // 5: Elimina 1 -> 3 (ge[3] = 0 -> entra a Q)
    {
        activeNode: 1,
        activeEdge: [1, 3],
        removedEdges: [[0, 2], [0, 3], [1, 3]],
        ge: [0, 0, 0, 0, 2, 2],
        queue: [2, 3],
        ordre: [0, 1],
        status: "decrement",
    },
    // 6: Pop 2 de Q
    {
        activeNode: 2,
        activeEdge: null,
        removedEdges: [[0, 2], [0, 3], [1, 3]],
        ge: [0, 0, 0, 0, 2, 2],
        queue: [3],
        ordre: [0, 1, 2],
        status: "pop",
    },
    // 7: Elimina 2 -> 4 (ge[4] = 1)
    {
        activeNode: 2,
        activeEdge: [2, 4],
        removedEdges: [[0, 2], [0, 3], [1, 3], [2, 4]],
        ge: [0, 0, 0, 0, 1, 2],
        queue: [3],
        ordre: [0, 1, 2],
        status: "decrement",
    },
    // 8: Pop 3 de Q
    {
        activeNode: 3,
        activeEdge: null,
        removedEdges: [[0, 2], [0, 3], [1, 3], [2, 4]],
        ge: [0, 0, 0, 0, 1, 2],
        queue: [],
        ordre: [0, 1, 2, 3],
        status: "pop",
    },
    // 9: Elimina 3 -> 4 (ge[4] = 0 -> entra a Q)
    {
        activeNode: 3,
        activeEdge: [3, 4],
        removedEdges: [[0, 2], [0, 3], [1, 3], [2, 4], [3, 4]],
        ge: [0, 0, 0, 0, 0, 2],
        queue: [4],
        ordre: [0, 1, 2, 3],
        status: "decrement",
    },
    // 10: Elimina 3 -> 5 (ge[5] = 1)
    {
        activeNode: 3,
        activeEdge: [3, 5],
        removedEdges: [[0, 2], [0, 3], [1, 3], [2, 4], [3, 4], [3, 5]],
        ge: [0, 0, 0, 0, 0, 1],
        queue: [4],
        ordre: [0, 1, 2, 3],
        status: "decrement",
    },
    // 11: Pop 4 de Q
    {
        activeNode: 4,
        activeEdge: null,
        removedEdges: [[0, 2], [0, 3], [1, 3], [2, 4], [3, 4], [3, 5]],
        ge: [0, 0, 0, 0, 0, 1],
        queue: [],
        ordre: [0, 1, 2, 3, 4],
        status: "pop",
    },
    // 12: Elimina 4 -> 5 (ge[5] = 0 -> entra a Q)
    {
        activeNode: 4,
        activeEdge: [4, 5],
        removedEdges: [[0, 2], [0, 3], [1, 3], [2, 4], [3, 4], [3, 5], [4, 5]],
        ge: [0, 0, 0, 0, 0, 0],
        queue: [5],
        ordre: [0, 1, 2, 3, 4],
        status: "decrement",
    },
    // 13: Pop 5 de Q
    {
        activeNode: 5,
        activeEdge: null,
        removedEdges: [[0, 2], [0, 3], [1, 3], [2, 4], [3, 4], [3, 5], [4, 5]],
        ge: [0, 0, 0, 0, 0, 0],
        queue: [],
        ordre: [0, 1, 2, 3, 4, 5],
        status: "done",
    },
];

// ── Passos Mode Cicle ────────────────────────────────────────────────────────
const STEPS_CYCLE: Step[] = [
    // 0: Inici mode cicle (ge[2] comença en 2 per l'aresta 4->2)
    {
        activeNode: null,
        activeEdge: null,
        removedEdges: [],
        ge: [0, 0, 2, 2, 2, 2],
        queue: [0, 1],
        ordre: [],
        status: "init",
    },
    // 1: Pop 0
    {
        activeNode: 0,
        activeEdge: null,
        removedEdges: [],
        ge: [0, 0, 2, 2, 2, 2],
        queue: [1],
        ordre: [0],
        status: "pop",
    },
    // 2: Elimina 0 -> 2 (ge[2] baixa a 1, NO entra a Q)
    {
        activeNode: 0,
        activeEdge: [0, 2],
        removedEdges: [[0, 2]],
        ge: [0, 0, 1, 2, 2, 2],
        queue: [1],
        ordre: [0],
        status: "decrement",
    },
    // 3: Elimina 0 -> 3 (ge[3] baixa a 1)
    {
        activeNode: 0,
        activeEdge: [0, 3],
        removedEdges: [[0, 2], [0, 3]],
        ge: [0, 0, 1, 1, 2, 2],
        queue: [1],
        ordre: [0],
        status: "decrement",
    },
    // 4: Pop 1
    {
        activeNode: 1,
        activeEdge: null,
        removedEdges: [[0, 2], [0, 3]],
        ge: [0, 0, 1, 1, 2, 2],
        queue: [],
        ordre: [0, 1],
        status: "pop",
    },
    // 5: Elimina 1 -> 3 (ge[3] = 0 -> entra a Q)
    {
        activeNode: 1,
        activeEdge: [1, 3],
        removedEdges: [[0, 2], [0, 3], [1, 3]],
        ge: [0, 0, 1, 0, 2, 2],
        queue: [3],
        ordre: [0, 1],
        status: "decrement",
    },
    // 6: Pop 3
    {
        activeNode: 3,
        activeEdge: null,
        removedEdges: [[0, 2], [0, 3], [1, 3]],
        ge: [0, 0, 1, 0, 2, 2],
        queue: [],
        ordre: [0, 1, 3],
        status: "pop",
    },
    // 7: Elimina 3 -> 4 (ge[4] baixa a 1)
    {
        activeNode: 3,
        activeEdge: [3, 4],
        removedEdges: [[0, 2], [0, 3], [1, 3], [3, 4]],
        ge: [0, 0, 1, 0, 1, 2],
        queue: [],
        ordre: [0, 1, 3],
        status: "decrement",
    },
    // 8: Elimina 3 -> 5 (ge[5] baixa a 1)
    {
        activeNode: 3,
        activeEdge: [3, 5],
        removedEdges: [[0, 2], [0, 3], [1, 3], [3, 4], [3, 5]],
        ge: [0, 0, 1, 0, 1, 1],
        queue: [],
        ordre: [0, 1, 3],
        status: "decrement",
    },
    // 9: Bloqueig: Q buida i |ordre| = 3 < 6 (cicle entre 2 i 4)
    {
        activeNode: null,
        activeEdge: null,
        removedEdges: [[0, 2], [0, 3], [1, 3], [3, 4], [3, 5]],
        ge: [0, 0, 1, 0, 1, 1],
        queue: [],
        ordre: [0, 1, 3],
        status: "cycle",
    },
];

export default function TopoSortVisualizer() {
    const [mode, setMode] = useState<"dag" | "cycle">("dag");
    const [stepIdx, setStepIdx] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const steps = mode === "dag" ? STEPS_DAG : STEPS_CYCLE;
    const edges = mode === "dag" ? EDGES_DAG : EDGES_CYCLE;
    const currentStep = steps[stepIdx] || steps[0];

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
        }, 800);

        return () => clearInterval(interval);
    }, [isPlaying, steps.length]);

    const handleSelectMode = (newMode: "dag" | "cycle") => {
        setIsPlaying(false);
        setMode(newMode);
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

    const isEdgeRemoved = (u: number, v: number) => {
        return currentStep.removedEdges.some((e) => e[0] === u && e[1] === v);
    };

    const isEdgeActive = (u: number, v: number) => {
        return currentStep.activeEdge?.[0] === u && currentStep.activeEdge?.[1] === v;
    };

    const isNodeInCycle = (id: number) => {
        return currentStep.status === "cycle" && (id === 2 || id === 4 || id === 5);
    };

    return (
        <div className="w-full flex flex-col items-center justify-center gap-5 my-8 font-mono select-none not-prose px-1">
            {/* 1. CONTROLS MINIMALISTES APPLE / LINEAR */}
            <div className="w-full max-w-lg flex items-center justify-between gap-2 text-xs">
                {/* Selector de mode: DAG vs Cicle */}
                <div className="flex items-center bg-white/[0.04] p-0.5 rounded-lg border border-white/10">
                    <button
                        type="button"
                        onClick={() => handleSelectMode("dag")}
                        className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                            mode === "dag"
                                ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                                : "text-slate-400 hover:text-slate-200 border border-transparent"
                        }`}
                    >
                        DAG
                    </button>
                    <button
                        type="button"
                        onClick={() => handleSelectMode("cycle")}
                        className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                            mode === "cycle"
                                ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                : "text-slate-400 hover:text-slate-200 border border-transparent"
                        }`}
                    >
                        Cicle
                    </button>
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
                        onClick={togglePlay}
                        title={isPlaying ? "Pausa" : "Reprodueix"}
                        className={`p-1 rounded-md transition ${
                            isPlaying
                                ? "bg-amber-500/20 text-amber-300"
                                : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]"
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
                    <span className="text-[10px] text-slate-500 font-mono px-1 select-none">
                        {stepIdx + 1}/{steps.length}
                    </span>
                </div>
            </div>

            {/* 2. DIBUIX DEL DIGRAF (SVG SENSE FONS) */}
            <div className="relative w-full max-w-lg h-auto flex justify-center">
                <svg
                    viewBox="0 -12 500 185"
                    className="w-full max-w-lg h-auto overflow-visible font-mono"
                    aria-label="Ordenació topològica en un DAG"
                >
                    <defs>
                        {/* Marcador de fletxa estàndard */}
                        <marker
                            id="arrow-default"
                            markerWidth="6"
                            markerHeight="6"
                            refX="5"
                            refY="3"
                            orient="auto"
                        >
                            <path d="M 0 0 L 6 3 L 0 6 z" fill="#475569" />
                        </marker>
                        {/* Marcador de fletxa activa */}
                        <marker
                            id="arrow-active"
                            markerWidth="6"
                            markerHeight="6"
                            refX="5"
                            refY="3"
                            orient="auto"
                        >
                            <path d="M 0 0 L 6 3 L 0 6 z" fill="#38bdf8" />
                        </marker>
                        {/* Marcador de fletxa de cicle */}
                        <marker
                            id="arrow-cycle"
                            markerWidth="6"
                            markerHeight="6"
                            refX="5"
                            refY="3"
                            orient="auto"
                        >
                            <path d="M 0 0 L 6 3 L 0 6 z" fill="#f43f5e" />
                        </marker>
                    </defs>

                    {/* ARESTES DIRECTES */}
                    <g>
                        {edges.map((edge) => {
                            const from = NODE_MAP.get(edge.u)!;
                            const to = NODE_MAP.get(edge.v)!;

                            const removed = isEdgeRemoved(edge.u, edge.v);
                            const active = isEdgeActive(edge.u, edge.v);

                            // Aresta corbada de cicle cap enrere (4 -> 2)
                            if (edge.isBack) {
                                const cycleActive = currentStep.status === "cycle";
                                return (
                                    <path
                                        key={`edge-${edge.u}-${edge.v}`}
                                        d="M 311 47 Q 260 -8 209 37"
                                        fill="none"
                                        stroke={cycleActive ? "#f43f5e" : "#f43f5e88"}
                                        strokeWidth={cycleActive ? "2.2" : "1.5"}
                                        strokeDasharray={cycleActive ? "none" : "3 3"}
                                        markerEnd="url(#arrow-cycle)"
                                        className="transition-all duration-300"
                                    />
                                );
                            }

                            // Aresta recta estàndard
                            const dx = to.x - from.x;
                            const dy = to.y - from.y;
                            const dist = Math.sqrt(dx * dx + dy * dy);
                            const r = 16;

                            const x1 = from.x + (r * dx) / dist;
                            const y1 = from.y + (r * dy) / dist;
                            const x2 = to.x - ((r + 4) * dx) / dist;
                            const y2 = to.y - ((r + 4) * dy) / dist;

                            let strokeColor = "#334155";
                            let strokeWidth = "1.2";
                            let marker = "url(#arrow-default)";
                            let opacity = 1;

                            if (active) {
                                strokeColor = "#38bdf8";
                                strokeWidth = "2.2";
                                marker = "url(#arrow-active)";
                            } else if (removed) {
                                strokeColor = "#1e293b";
                                opacity = 0.25;
                                strokeWidth = "1";
                            }

                            return (
                                <line
                                    key={`edge-${edge.u}-${edge.v}`}
                                    x1={x1}
                                    y1={y1}
                                    x2={x2}
                                    y2={y2}
                                    stroke={strokeColor}
                                    strokeWidth={strokeWidth}
                                    strokeDasharray={removed ? "3 3" : "none"}
                                    markerEnd={removed ? undefined : marker}
                                    opacity={opacity}
                                    className="transition-all duration-200"
                                />
                            );
                        })}
                    </g>

                    {/* NODES */}
                    <g>
                        {NODES.map((node) => {
                            const isProcessed = currentStep.ordre.includes(node.id);
                            const isInQueue = currentStep.queue.includes(node.id);
                            const isActive = currentStep.activeNode === node.id;
                            const inCycle = isNodeInCycle(node.id);
                            const geVal = currentStep.ge[node.id];

                            let fillCircle = "#090d16";
                            let strokeCircle = "#334155";
                            let textFill = "#94a3b8";
                            let badgeStroke = "#334155";
                            let badgeText = "#64748b";

                            if (inCycle) {
                                fillCircle = "#260c14";
                                strokeCircle = "#f43f5e";
                                textFill = "#fda4af";
                                badgeStroke = "#f43f5e";
                                badgeText = "#fda4af";
                            } else if (isActive) {
                                fillCircle = "#042f2e";
                                strokeCircle = "#2dd4bf";
                                textFill = "#5eead4";
                                badgeStroke = "#2dd4bf";
                                badgeText = "#5eead4";
                            } else if (isInQueue) {
                                fillCircle = "#082f49";
                                strokeCircle = "#38bdf8";
                                textFill = "#7dd3fc";
                                badgeStroke = "#38bdf8";
                                badgeText = "#7dd3fc";
                            } else if (isProcessed) {
                                fillCircle = "#022c22";
                                strokeCircle = "#059669";
                                textFill = "#6ee7b7";
                                badgeStroke = "#059669";
                                badgeText = "#6ee7b7";
                            } else if (geVal === 0) {
                                badgeStroke = "#10b981";
                                badgeText = "#34d399";
                            }

                            return (
                                <g key={`node-${node.id}`} className="transition-all duration-200">
                                    {/* Xapa d'in-degree ge[u] sobre el node (amb marge net, sense solapament) */}
                                    <g opacity={isProcessed ? 0.35 : 1} className="transition-opacity duration-200">
                                        <rect
                                            x={node.x - 9}
                                            y={node.y - 34}
                                            width="18"
                                            height="12"
                                            rx="3.5"
                                            fill="#020617"
                                            stroke={badgeStroke}
                                            strokeWidth="1"
                                        />
                                        <text
                                            x={node.x}
                                            y={node.y - 28}
                                            textAnchor="middle"
                                            dominantBaseline="central"
                                            fill={badgeText}
                                            fontSize="8.5"
                                            fontWeight="bold"
                                            className="select-none pointer-events-none"
                                        >
                                            {geVal}
                                        </text>
                                    </g>

                                    {/* Cercle principal del vèrtex */}
                                    <circle
                                        cx={node.x}
                                        cy={node.y}
                                        r="16"
                                        fill={fillCircle}
                                        stroke={strokeCircle}
                                        strokeWidth={isActive || isInQueue || inCycle ? "2" : "1.2"}
                                        className="transition-colors duration-200"
                                    />

                                    {/* Identificador del vèrtex */}
                                    <text
                                        x={node.x}
                                        y={node.y}
                                        textAnchor="middle"
                                        dominantBaseline="central"
                                        fill={textFill}
                                        fontSize="11.5"
                                        fontWeight="bold"
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

            {/* 3. ESTRUCTURES DE DADES DE KAHN (SENSE TEXT PROSAIC) */}
            <div className="w-full max-w-lg flex flex-col items-center gap-3 pt-1">
                {/* Vector ge (in-degrees) */}
                <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                    <span className="text-[11px] text-slate-500 font-mono select-none mr-1">
                        ge:
                    </span>
                    {currentStep.ge.map((val, idx) => {
                        const isInQueue = currentStep.queue.includes(idx);
                        const isProcessed = currentStep.ordre.includes(idx);
                        const inCycle = isNodeInCycle(idx);

                        let borderCls = "border-white/10";
                        let bgCls = "bg-white/[0.02]";
                        let textCls = "text-slate-400";

                        if (inCycle) {
                            borderCls = "border-rose-500/50";
                            bgCls = "bg-rose-500/15";
                            textCls = "text-rose-300 font-bold";
                        } else if (val === 0) {
                            borderCls = "border-emerald-500/40";
                            bgCls = "bg-emerald-500/15";
                            textCls = "text-emerald-300 font-bold";
                        } else if (isInQueue) {
                            borderCls = "border-sky-400/50";
                            bgCls = "bg-sky-500/15";
                            textCls = "text-sky-300 font-bold";
                        } else if (isProcessed) {
                            borderCls = "border-emerald-500/20";
                            bgCls = "bg-emerald-500/5";
                            textCls = "text-emerald-500/60";
                        }

                        return (
                            <div key={`ge-cell-${idx}`} className="flex flex-col items-center gap-1">
                                <motion.div
                                    layout
                                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg border flex items-center justify-center text-xs transition-colors duration-150 ${borderCls} ${bgCls} ${textCls}`}
                                >
                                    {val}
                                </motion.div>
                                <span className="text-[9px] sm:text-[10px] font-mono text-slate-600 select-none">
                                    [{idx}]
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Fila compacta: Cua Q + Ordre topològic */}
                <div className="w-full flex items-center justify-between gap-3 text-xs pt-1 border-t border-white/[0.04]">
                    {/* Cua Q (Fonts) */}
                    <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-slate-500 font-mono select-none">
                            Q:
                        </span>
                        {currentStep.queue.length === 0 ? (
                            <span className="text-slate-600 text-[11px] font-mono px-2 py-0.5 rounded border border-white/5 bg-white/[0.01]">
                                ∅
                            </span>
                        ) : (
                            <div className="flex items-center gap-1">
                                {currentStep.queue.map((u, i) => (
                                    <span
                                        key={`q-${u}-${i}`}
                                        className="px-2 py-0.5 rounded text-[11px] font-mono font-bold border bg-sky-500/20 border-sky-400/40 text-sky-200"
                                    >
                                        {u}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Vector ordre */}
                    <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-slate-500 font-mono select-none">
                            ordre:
                        </span>
                        {currentStep.ordre.length === 0 ? (
                            <span className="text-slate-600 text-[11px] font-mono px-2 py-0.5 rounded border border-white/5 bg-white/[0.01]">
                                []
                            </span>
                        ) : (
                            <div className="flex items-center gap-1">
                                {currentStep.ordre.map((u, i) => (
                                    <React.Fragment key={`ord-${u}-${i}`}>
                                        <span className="px-1.5 sm:px-2 py-0.5 rounded text-[11px] font-mono font-bold border bg-emerald-500/15 border-emerald-500/40 text-emerald-300">
                                            {u}
                                        </span>
                                        {i < currentStep.ordre.length - 1 && (
                                            <span className="text-slate-600 text-[9px]">→</span>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        )}

                        {/* Indicador final discret */}
                        {currentStep.status === "done" && (
                            <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] font-bold border bg-emerald-500/15 border-emerald-500/30 text-emerald-300">
                                DAG
                            </span>
                        )}
                        {currentStep.status === "cycle" && (
                            <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] font-bold border bg-rose-500/15 border-rose-500/30 text-rose-300">
                                Cicle
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
