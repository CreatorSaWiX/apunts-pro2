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
    id: string;
    u: number;
    v: number;
    w: number;
    curved?: boolean;
    labelPos: { x: number; y: number };
}

interface PQItem {
    d: number;
    u: number;
    isDiscarded?: boolean;
}

interface Step {
    current: number | null; // Node u extret de pq
    dist: (number | null)[]; // null = ∞
    S: boolean[]; // S[0..4] booleans
    pq: PQItem[]; // Contingut del Min-Heap
    activeEdges: string[]; // Arestes relaxades en aquest pas
    treeEdges: string[]; // Arestes del camí mínim actual
    isDiscard: boolean; // Si la còpia extreta s'ha descartat per S[u] == true
    updatedNode?: number | null; // Node v la distància del qual s'ha actualitzat
    action?: string; // Etiqueta curta de l'operació actual
    desc: string; // Text explicatiu mínim per a cada pas
}

const NODES: NodePos[] = [
    { id: 0, x: 55, y: 98 },
    { id: 1, x: 185, y: 44 },
    { id: 2, x: 185, y: 152 },
    { id: 3, x: 325, y: 44 },
    { id: 4, x: 415, y: 98 },
];

const NODE_MAP = new Map<number, NodePos>(NODES.map((n) => [n.id, n]));

const EDGES: Edge[] = [
    { id: "0-1", u: 0, v: 1, w: 4, labelPos: { x: 115, y: 64 } },
    { id: "0-2", u: 0, v: 2, w: 2, labelPos: { x: 115, y: 134 } },
    { id: "2-1", u: 2, v: 1, w: 1, curved: true, labelPos: { x: 160, y: 98 } },
    { id: "1-3", u: 1, v: 3, w: 3, labelPos: { x: 255, y: 34 } },
    { id: "2-3", u: 2, v: 3, w: 7, labelPos: { x: 258, y: 92 } },
    { id: "2-4", u: 2, v: 4, w: 9, labelPos: { x: 302, y: 138 } },
    { id: "3-4", u: 3, v: 4, w: 2, labelPos: { x: 376, y: 64 } },
];

function getEdgePath(edge: Edge): string {
    const u = NODE_MAP.get(edge.u)!;
    const v = NODE_MAP.get(edge.v)!;
    const r = 14;
    const margin = 5;

    if (edge.curved) {
        const startX = u.x - 3;
        const startY = u.y - r;
        const endX = v.x - 4;
        const endY = v.y + r + margin;
        const ctrlX = Math.min(u.x, v.x) - 24;
        const ctrlY = (u.y + v.y) / 2;
        return `M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`;
    }

    const dx = v.x - u.x;
    const dy = v.y - u.y;
    const len = Math.hypot(dx, dy);
    if (len === 0) return "";

    const ux = dx / len;
    const uy = dy / len;

    const startX = u.x + ux * r;
    const startY = u.y + uy * r;
    const endX = v.x - ux * (r + margin);
    const endY = v.y - uy * (r + margin);

    return `M ${startX} ${startY} L ${endX} ${endY}`;
}

const STEPS: Step[] = [
    // 0: Estat inicial (dist[0]=0, pq.push({0, 0}))
    {
        current: null,
        dist: [0, null, null, null, null],
        S: [false, false, false, false, false],
        pq: [{ d: 0, u: 0 }],
        activeEdges: [],
        treeEdges: [],
        isDiscard: false,
        desc: "inici: dist[0]=0 · encua node 0 {0, 0}",
    },
    // 1: Pop {0, 0} -> S[0] = true
    {
        current: 0,
        dist: [0, null, null, null, null],
        S: [true, false, false, false, false],
        pq: [],
        activeEdges: [],
        treeEdges: [],
        isDiscard: false,
        action: "pop {0, 0}",
        desc: "extreu mínim de pq: node 0 (dist=0) · mirem veïns de 0",
    },
    // 2: u=0 relaxa (0,1)=4 -> dist[1]=4, pq.push({4, 1})
    {
        current: 0,
        dist: [0, 4, null, null, null],
        S: [true, false, false, false, false],
        pq: [{ d: 4, u: 1 }],
        activeEdges: ["0-1"],
        treeEdges: ["0-1"],
        isDiscard: false,
        updatedNode: 1,
        action: "relax 0→1",
        desc: "veí de 0: node 1 (0+4=4) · encua node 1 {4, 1}",
    },
    // 3: u=0 relaxa (0,2)=2 -> dist[2]=2, pq.push({2, 2})
    {
        current: 0,
        dist: [0, 4, 2, null, null],
        S: [true, false, false, false, false],
        pq: [{ d: 2, u: 2 }, { d: 4, u: 1 }],
        activeEdges: ["0-2"],
        treeEdges: ["0-1", "0-2"],
        isDiscard: false,
        updatedNode: 2,
        action: "relax 0→2",
        desc: "veí de 0: node 2 (0+2=2) · encua node 2 {2, 2}",
    },
    // 4: Pop {2, 2} -> S[2] = true
    {
        current: 2,
        dist: [0, 4, 2, null, null],
        S: [true, false, true, false, false],
        pq: [{ d: 4, u: 1 }],
        activeEdges: [],
        treeEdges: ["0-1", "0-2"],
        isDiscard: false,
        action: "pop {2, 2}",
        desc: "extreu mínim de pq: node 2 (dist=2) · mirem veïns de 2",
    },
    // 5: u=2 relaxa (2,1)=3 (<4!) -> dist[1]=3, pq.push({3, 1})
    {
        current: 2,
        dist: [0, 3, 2, null, null],
        S: [true, false, true, false, false],
        pq: [{ d: 3, u: 1 }, { d: 4, u: 1 }],
        activeEdges: ["2-1"],
        treeEdges: ["0-2", "2-1"],
        isDiscard: false,
        updatedNode: 1,
        action: "relax 2→1",
        desc: "veí de 2: node 1 (2+1=3 < 4) · millora i encua {3, 1}",
    },
    // 6: u=2 relaxa (2,3)=9 -> dist[3]=9, pq.push({9, 3})
    {
        current: 2,
        dist: [0, 3, 2, 9, null],
        S: [true, false, true, false, false],
        pq: [{ d: 3, u: 1 }, { d: 4, u: 1 }, { d: 9, u: 3 }],
        activeEdges: ["2-3"],
        treeEdges: ["0-2", "2-1", "2-3"],
        isDiscard: false,
        updatedNode: 3,
        action: "relax 2→3",
        desc: "veí de 2: node 3 (2+7=9) · encua node 3 {9, 3}",
    },
    // 7: u=2 relaxa (2,4)=11 -> dist[4]=11, pq.push({11, 4})
    {
        current: 2,
        dist: [0, 3, 2, 9, 11],
        S: [true, false, true, false, false],
        pq: [{ d: 3, u: 1 }, { d: 4, u: 1 }, { d: 9, u: 3 }, { d: 11, u: 4 }],
        activeEdges: ["2-4"],
        treeEdges: ["0-2", "2-1", "2-3", "2-4"],
        isDiscard: false,
        updatedNode: 4,
        action: "relax 2→4",
        desc: "veí de 2: node 4 (2+9=11) · encua node 4 {11, 4}",
    },
    // 8: Pop {3, 1} -> S[1] = true
    {
        current: 1,
        dist: [0, 3, 2, 9, 11],
        S: [true, true, true, false, false],
        pq: [{ d: 4, u: 1 }, { d: 9, u: 3 }, { d: 11, u: 4 }],
        activeEdges: [],
        treeEdges: ["0-2", "2-1", "2-3", "2-4"],
        isDiscard: false,
        action: "pop {3, 1}",
        desc: "extreu mínim de pq: node 1 (dist=3) · mirem veïns de 1",
    },
    // 9: u=1 relaxa (1,3)=6 (<9!) -> dist[3]=6, pq.push({6, 3})
    {
        current: 1,
        dist: [0, 3, 2, 6, 11],
        S: [true, true, true, false, false],
        pq: [{ d: 4, u: 1 }, { d: 6, u: 3 }, { d: 9, u: 3 }, { d: 11, u: 4 }],
        activeEdges: ["1-3"],
        treeEdges: ["0-2", "2-1", "1-3", "2-4"],
        isDiscard: false,
        updatedNode: 3,
        action: "relax 1→3",
        desc: "veí de 1: node 3 (3+3=6 < 9) · millora i encua {6, 3}",
    },
    // 10: Pop {4, 1} -> S[1] ja és true! Descarta còpia obsoleta
    {
        current: 1,
        dist: [0, 3, 2, 6, 11],
        S: [true, true, true, false, false],
        pq: [{ d: 6, u: 3 }, { d: 9, u: 3 }, { d: 11, u: 4 }],
        activeEdges: [],
        treeEdges: ["0-2", "2-1", "1-3", "2-4"],
        isDiscard: true,
        action: "skip {4, 1}",
        desc: "extreu {4, 1} · node 1 ja tancat (S[1]=T), descarta",
    },
    // 11: Pop {6, 3} -> S[3] = true
    {
        current: 3,
        dist: [0, 3, 2, 6, 11],
        S: [true, true, true, true, false],
        pq: [{ d: 9, u: 3 }, { d: 11, u: 4 }],
        activeEdges: [],
        treeEdges: ["0-2", "2-1", "1-3", "2-4"],
        isDiscard: false,
        action: "pop {6, 3}",
        desc: "extreu mínim de pq: node 3 (dist=6) · mirem veïns de 3",
    },
    // 12: u=3 relaxa (3,4)=8 (<11!) -> dist[4]=8, pq.push({8, 4})
    {
        current: 3,
        dist: [0, 3, 2, 6, 8],
        S: [true, true, true, true, false],
        pq: [{ d: 8, u: 4 }, { d: 9, u: 3 }, { d: 11, u: 4 }],
        activeEdges: ["3-4"],
        treeEdges: ["0-2", "2-1", "1-3", "3-4"],
        isDiscard: false,
        updatedNode: 4,
        action: "relax 3→4",
        desc: "veí de 3: node 4 (6+2=8 < 11) · millora i encua {8, 4}",
    },
    // 13: Pop {8, 4} -> S[4] = true (sense arestes sortints)
    {
        current: 4,
        dist: [0, 3, 2, 6, 8],
        S: [true, true, true, true, true],
        pq: [{ d: 9, u: 3 }, { d: 11, u: 4 }],
        activeEdges: [],
        treeEdges: ["0-2", "2-1", "1-3", "3-4"],
        isDiscard: false,
        action: "pop {8, 4}",
        desc: "extreu mínim de pq: node 4 (dist=8) · sense veïns sortints",
    },
    // 14: Pop {9, 3} -> S[3] ja és true! Descarta còpia obsoleta
    {
        current: 3,
        dist: [0, 3, 2, 6, 8],
        S: [true, true, true, true, true],
        pq: [{ d: 11, u: 4 }],
        activeEdges: [],
        treeEdges: ["0-2", "2-1", "1-3", "3-4"],
        isDiscard: true,
        action: "skip {9, 3}",
        desc: "extreu {9, 3} · node 3 ja tancat (S[3]=T), descarta",
    },
    // 15: Pop {11, 4} -> S[4] ja és true! Descarta còpia obsoleta
    {
        current: 4,
        dist: [0, 3, 2, 6, 8],
        S: [true, true, true, true, true],
        pq: [],
        activeEdges: [],
        treeEdges: ["0-2", "2-1", "1-3", "3-4"],
        isDiscard: true,
        action: "skip {11, 4}",
        desc: "extreu {11, 4} · node 4 ja tancat (S[4]=T), descarta",
    },
    // 16: Cua buida -> Completat
    {
        current: null,
        dist: [0, 3, 2, 6, 8],
        S: [true, true, true, true, true],
        pq: [],
        activeEdges: [],
        treeEdges: ["0-2", "2-1", "1-3", "3-4"],
        isDiscard: false,
        action: "done",
        desc: "pq buida · camins mínims trobats",
    },
];

export default function DijkstraVisualizer() {
    const [stepIdx, setStepIdx] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const step = STEPS[stepIdx];

    useEffect(() => {
        if (!isPlaying) return;
        const timer = setInterval(() => {
            setStepIdx((prev) => {
                if (prev >= STEPS.length - 1) {
                    setIsPlaying(false);
                    return prev;
                }
                return prev + 1;
            });
        }, 1100);
        return () => clearInterval(timer);
    }, [isPlaying]);

    const nextStep = () => {
        setIsPlaying(false);
        setStepIdx((prev) => Math.min(prev + 1, STEPS.length - 1));
    };

    const prevStep = () => {
        setIsPlaying(false);
        setStepIdx((prev) => Math.max(prev - 1, 0));
    };

    const reset = () => {
        setIsPlaying(false);
        setStepIdx(0);
    };

    const togglePlay = () => {
        if (stepIdx >= STEPS.length - 1) {
            setStepIdx(0);
            setIsPlaying(true);
        } else {
            setIsPlaying((p) => !p);
        }
    };

    return (
        <div className="w-full flex flex-col items-center justify-center gap-4 my-8 font-mono select-none not-prose px-1">

            {/* 1. CONTROLS MINIMALISTES APPLE / LINEAR */}
            <div className="w-full max-w-lg flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-sky-500/15 text-sky-300 border border-sky-500/20">
                        s = 0
                    </span>
                    {step.action && (
                        <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                                step.isDiscard
                                    ? "text-amber-400 bg-amber-500/10 border-amber-500/20 animate-pulse"
                                    : step.action === "done"
                                    ? "text-emerald-300 bg-emerald-500/10 border-emerald-500/20"
                                    : "text-sky-300 bg-sky-500/10 border-sky-500/20"
                            }`}
                        >
                            {step.action}
                        </span>
                    )}
                </div>

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
                        disabled={stepIdx >= STEPS.length - 1}
                        title="Pas següent"
                        className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] disabled:opacity-30 disabled:pointer-events-none transition"
                    >
                        <ChevronRight size={13} />
                    </button>
                    <span className="text-[10px] font-mono text-slate-500 px-1.5 min-w-[28px] text-center">
                        {stepIdx + 1}/{STEPS.length}
                    </span>
                </div>
            </div>

            {/* 2. GRAF VECTORIAL SENSE FONS (SVG) */}
            <div className="relative w-full max-w-lg h-auto flex justify-center">
                <svg
                    viewBox="0 0 470 195"
                    className="w-full max-w-lg h-auto overflow-visible font-mono"
                    aria-label="Algorisme de Dijkstra"
                >
                    <defs>
                        <marker
                            id="dijk-arr-default"
                            viewBox="0 0 10 10"
                            refX="6"
                            refY="5"
                            markerWidth="5"
                            markerHeight="5"
                            orient="auto-start-reverse"
                        >
                            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#334155" />
                        </marker>
                        <marker
                            id="dijk-arr-active"
                            viewBox="0 0 10 10"
                            refX="6"
                            refY="5"
                            markerWidth="5"
                            markerHeight="5"
                            orient="auto-start-reverse"
                        >
                            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8" />
                        </marker>
                        <marker
                            id="dijk-arr-tree"
                            viewBox="0 0 10 10"
                            refX="6"
                            refY="5"
                            markerWidth="5"
                            markerHeight="5"
                            orient="auto-start-reverse"
                        >
                            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#10b981" />
                        </marker>
                    </defs>

                    {/* ARESTES PONDERADES */}
                    <g>
                        {EDGES.map((edge) => {
                            const isTree = step.treeEdges.includes(edge.id);
                            const isActive = step.activeEdges.includes(edge.id);

                            let stroke = "#334155";
                            let strokeWidth = "1.2";
                            let marker = "url(#dijk-arr-default)";

                            if (isActive) {
                                stroke = "#38bdf8";
                                strokeWidth = "2.4";
                                marker = "url(#dijk-arr-active)";
                            } else if (isTree) {
                                stroke = "#10b981";
                                strokeWidth = "2.2";
                                marker = "url(#dijk-arr-tree)";
                            }

                            return (
                                <g key={`edge-${edge.id}`}>
                                    <path
                                        d={getEdgePath(edge)}
                                        fill="none"
                                        stroke={stroke}
                                        strokeWidth={strokeWidth}
                                        markerEnd={marker}
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
                                        stroke={isActive ? "#38bdf8" : isTree ? "#10b981" : "#334155"}
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
                                        fill={isActive ? "#7dd3fc" : isTree ? "#6ee7b7" : "#94a3b8"}
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
                            const isSettled = step.S[node.id];
                            const isCurrent = step.current === node.id;
                            const isUpdated = step.updatedNode === node.id;
                            const dVal = step.dist[node.id];

                            let strokeColor = "#334155";
                            let strokeWidth = "1.5";
                            let fillColor = "#090d16";
                            let textColor = "#94a3b8";

                            if (isSettled) {
                                strokeColor = "#10b981";
                                strokeWidth = "2";
                                fillColor = "rgba(16, 185, 129, 0.16)";
                                textColor = "#6ee7b7";
                            } else if (isCurrent || isUpdated) {
                                strokeColor = "#38bdf8";
                                strokeWidth = "2.4";
                                fillColor = "rgba(56, 189, 248, 0.25)";
                                textColor = "#ffffff";
                            }

                            return (
                                <g key={`node-${node.id}`}>
                                    {/* Halo discontinu per al node actiu */}
                                    {isCurrent && (
                                        <circle
                                            cx={node.x}
                                            cy={node.y}
                                            r="19"
                                            fill="none"
                                            stroke={step.isDiscard ? "#f59e0b" : "#38bdf8"}
                                            strokeWidth="1.2"
                                            strokeDasharray="2 2"
                                            className="opacity-80"
                                        />
                                    )}

                                    {/* Cercle principal del node */}
                                    <circle
                                        cx={node.x}
                                        cy={node.y}
                                        r="14"
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
                                        fontSize="11"
                                        className="select-none pointer-events-none"
                                    >
                                        {node.id}
                                    </text>

                                    {/* Placa superior amb distància actual d=... */}
                                    <text
                                        x={node.x}
                                        y={node.y - 18}
                                        textAnchor="middle"
                                        fontSize="9"
                                        fontWeight="600"
                                        fill={isSettled ? "#34d399" : dVal !== null ? "#38bdf8" : "#64748b"}
                                        className="select-none pointer-events-none"
                                    >
                                        {dVal === null ? "∞" : dVal}
                                    </text>
                                </g>
                            );
                        })}
                    </g>
                </svg>
            </div>

            {/* 3. ESTRUCTURES DE DADES DE DIJKSTRA: dist, S, pq */}
            <div className="w-full max-w-lg flex flex-col items-center gap-2.5 pt-1">
                {/* Fila del vector dist */}
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                    <span className="text-[11px] text-slate-500 font-mono select-none w-10 text-right mr-1">
                        dist:
                    </span>
                    {step.dist.map((d, idx) => {
                        const isSettled = step.S[idx];
                        const isCurrent = step.current === idx;
                        const isUpdated = step.updatedNode === idx;

                        let borderCls = "border-white/10";
                        let bgCls = "bg-white/[0.02]";
                        let textCls = "text-slate-500";
                        let idxCls = "text-slate-600";

                        if (isUpdated) {
                            borderCls = "border-sky-400";
                            bgCls = "bg-sky-500/25";
                            textCls = "text-sky-200 font-bold";
                            idxCls = "text-sky-300 font-bold";
                        } else if (isSettled) {
                            borderCls = "border-emerald-500/40";
                            bgCls = "bg-emerald-500/15";
                            textCls = "text-emerald-300 font-bold";
                            idxCls = "text-emerald-500";
                        } else if (isCurrent) {
                            borderCls = "border-sky-400";
                            bgCls = "bg-sky-500/25";
                            textCls = "text-sky-300 font-bold";
                            idxCls = "text-sky-300 font-bold";
                        } else if (d !== null) {
                            borderCls = "border-sky-500/30";
                            bgCls = "bg-sky-500/10";
                            textCls = "text-sky-400 font-semibold";
                            idxCls = "text-slate-500";
                        }

                        return (
                            <div key={`dist-${idx}`} className="flex flex-col items-center gap-0.5">
                                <motion.div
                                    layout
                                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg border flex items-center justify-center text-xs transition-colors duration-150 ${borderCls} ${bgCls} ${textCls}`}
                                >
                                    {d === null ? "∞" : d}
                                </motion.div>
                                <span className={`text-[8.5px] sm:text-[9.5px] font-mono select-none transition-colors duration-150 ${idxCls}`}>
                                    [{idx}]
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Fila del vector S (definitiu) */}
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                    <span className="text-[11px] text-slate-500 font-mono select-none w-10 text-right mr-1">
                        S:
                    </span>
                    {step.S.map((settled, idx) => (
                        <div key={`s-${idx}`} className="w-7 sm:w-8 flex justify-center py-0.5">
                            <span
                                className={`text-[9.5px] font-mono font-medium transition-colors duration-150 ${
                                    settled ? "text-emerald-400" : "text-slate-700"
                                }`}
                            >
                                {settled ? "T" : "F"}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Fila de la cua de prioritats (Min-Heap pq) */}
                <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-0.5">
                    <span className="text-[11px] text-slate-500 font-mono select-none w-10 text-right mr-1">
                        pq:
                    </span>
                    {step.pq.length === 0 ? (
                        <span className="text-slate-600 text-xs font-mono px-2 py-0.5 rounded border border-white/5 bg-white/[0.01]">
                            ∅
                        </span>
                    ) : (
                        <div className="flex items-center gap-1 flex-wrap justify-center">
                            {step.pq.map((item, i) => {
                                const isTop = i === 0;
                                return (
                                    <span
                                        key={`pq-${item.d}-${item.u}-${i}`}
                                        className={`px-1.5 py-0.5 rounded text-[10.5px] font-mono border transition-colors ${
                                            isTop
                                                ? "bg-sky-500/20 border-sky-400/40 text-sky-200 font-bold"
                                                : "bg-white/[0.03] border-white/10 text-slate-400"
                                        }`}
                                    >
                                        {"{"}{item.d}, {item.u}{"}"}
                                    </span>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Text mínim d'estat estil "$ text" */}
                <div className="min-h-5 flex items-center justify-center text-center text-[11px] font-mono text-slate-400 pt-0.5">
                    <motion.span
                        key={stepIdx}
                        initial={{ opacity: 0, y: 3 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.15 }}
                    >
                        <span className="text-slate-500">$</span> {step.desc}
                    </motion.span>
                </div>
            </div>

        </div>
    );
}
