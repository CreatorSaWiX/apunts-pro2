"use client";

import React, { useState, useEffect, useId, useMemo } from "react";
import { m as motion } from "framer-motion";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

type Phase = "enter" | "choose" | "explore" | "base" | "unchoose" | "done";

interface BacktrackStep {
    pas: number;
    e: (number | null)[];
    phase: Phase;
    activeLine: number;
    candidate: number | null;
    stack: number[];
    currentNode: string | null;
    unchooseEdge: [string, string] | null;
    visitedNodes: string[];
    visitedEdges: [string, string][];
    solutions: string[];
}

interface TreeNodePos {
    id: string;
    x: number;
    y: number;
    depth: number;
}

interface TreeEdge {
    u: string;
    v: string;
    bit: string;
}

const LINE_H = 24;

function buildSteps(n: number): BacktrackStep[] {
    const steps: BacktrackStep[] = [];
    const e: (number | null)[] = Array(n).fill(null);
    const visitedNodes = new Set<string>([""]);
    const visitedEdges: [string, string][] = [];
    const solutions: string[] = [];

    steps.push({
        pas: 0,
        e: [...e],
        phase: "enter",
        activeLine: 0,
        candidate: null,
        stack: [0],
        currentNode: "",
        unchooseEdge: null,
        visitedNodes: Array.from(visitedNodes),
        visitedEdges: [...visitedEdges],
        solutions: [...solutions],
    });

    const walk = (pas: number, prefix: string, stack: number[]) => {
        for (const c of [0, 1]) {
            e[pas] = c;
            steps.push({
                pas,
                e: [...e],
                phase: "choose",
                activeLine: 6,
                candidate: c,
                stack: [...stack],
                currentNode: prefix,
                unchooseEdge: null,
                visitedNodes: Array.from(visitedNodes),
                visitedEdges: [...visitedEdges],
                solutions: [...solutions],
            });

            const child = prefix + String(c);
            visitedNodes.add(child);
            visitedEdges.push([prefix, child]);
            const nextStack = [...stack, pas + 1];

            if (pas + 1 === n) {
                solutions.push(child);
                steps.push({
                    pas: n,
                    e: [...e],
                    phase: "base",
                    activeLine: 2,
                    candidate: null,
                    stack: nextStack,
                    currentNode: child,
                    unchooseEdge: null,
                    visitedNodes: Array.from(visitedNodes),
                    visitedEdges: [...visitedEdges],
                    solutions: [...solutions],
                });
            } else {
                steps.push({
                    pas: pas + 1,
                    e: [...e],
                    phase: "explore",
                    activeLine: 7,
                    candidate: null,
                    stack: nextStack,
                    currentNode: child,
                    unchooseEdge: null,
                    visitedNodes: Array.from(visitedNodes),
                    visitedEdges: [...visitedEdges],
                    solutions: [...solutions],
                });
                walk(pas + 1, child, nextStack);
            }

            e[pas] = null;
            steps.push({
                pas,
                e: [...e],
                phase: "unchoose",
                activeLine: 8,
                candidate: c,
                stack: [...stack],
                currentNode: prefix,
                unchooseEdge: [prefix, child],
                visitedNodes: Array.from(visitedNodes),
                visitedEdges: [...visitedEdges],
                solutions: [...solutions],
            });
        }
    };

    walk(0, "", [0]);

    steps.push({
        pas: 0,
        e: Array(n).fill(null),
        phase: "done",
        activeLine: 10,
        candidate: null,
        stack: [],
        currentNode: null,
        unchooseEdge: null,
        visitedNodes: Array.from(visitedNodes),
        visitedEdges: [...visitedEdges],
        solutions: [...solutions],
    });

    return steps;
}

function buildTreeLayout(n: number): {
    nodes: TreeNodePos[];
    edges: TreeEdge[];
    nodeMap: Map<string, TreeNodePos>;
    viewBox: string;
} {
    const nodes: TreeNodePos[] = [];
    const edges: TreeEdge[] = [];
    const levelY = n === 2 ? [20, 62, 106] : [18, 54, 92, 130];
    const viewBox = n === 2 ? "0 0 260 130" : "0 0 260 152";

    const place = (prefix: string, depth: number, x: number, dx: number) => {
        nodes.push({ id: prefix, x, y: levelY[depth], depth });
        if (depth < n) {
            const leftId = `${prefix}0`;
            const rightId = `${prefix}1`;
            edges.push({ u: prefix, v: leftId, bit: "0" });
            edges.push({ u: prefix, v: rightId, bit: "1" });
            place(leftId, depth + 1, x - dx, dx / 2);
            place(rightId, depth + 1, x + dx, dx / 2);
        }
    };

    place("", 0, 130, 60);
    const nodeMap = new Map<string, TreeNodePos>(nodes.map((nd) => [nd.id, nd]));
    return { nodes, edges, nodeMap, viewBox };
}

function isOnActivePath(currentNode: string | null, u: string, v: string): boolean {
    if (currentNode === null) return false;
    return currentNode.startsWith(v) && v.length === u.length + 1;
}

export default function BacktrackVisualizer() {
    const uid = useId();
    const [n, setN] = useState<2 | 3>(3);
    const [stepIdx, setStepIdx] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const steps = useMemo(() => buildSteps(n), [n]);
    const tree = useMemo(() => buildTreeLayout(n), [n]);

    const step = steps[stepIdx] ?? steps[0];

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
        }, 650);

        return () => clearInterval(interval);
    }, [isPlaying, steps.length]);

    const handleSelectN = (nextN: 2 | 3) => {
        setIsPlaying(false);
        setN(nextN);
        setStepIdx(0);
    };

    const reset = () => {
        setIsPlaying(false);
        setStepIdx(0);
    };

    const prevStep = () => {
        setIsPlaying(false);
        setStepIdx((prev) => Math.max(0, prev - 1));
    };

    const nextStep = () => {
        setIsPlaying(false);
        setStepIdx((prev) => Math.min(steps.length - 1, prev + 1));
    };

    const togglePlay = () => {
        if (stepIdx >= steps.length - 1) {
            setStepIdx(0);
            setIsPlaying(true);
        } else {
            setIsPlaying((prev) => !prev);
        }
    };

    const jumpToNode = (nodeId: string) => {
        setIsPlaying(false);
        const idx = steps.findIndex((s) => s.currentNode === nodeId);
        if (idx !== -1) {
            setStepIdx(idx);
        }
    };

    // Estil de la barra d'execució al codi segons la fase
    let highlightCls = "bg-sky-500/[0.12] border-sky-400";
    if (step.phase === "explore") {
        highlightCls = "bg-indigo-500/[0.14] border-indigo-400";
    } else if (step.phase === "base") {
        highlightCls = "bg-emerald-500/[0.14] border-emerald-400";
    } else if (step.phase === "unchoose") {
        highlightCls = "bg-amber-500/[0.14] border-amber-400";
    } else if (step.phase === "done") {
        highlightCls = "bg-emerald-500/[0.08] border-emerald-500/50";
    }

    // Xip mínim inline amb el valor viu de la línia activa
    let inlineChip: { text: string; cls: string } | null = null;
    if (step.phase === "enter") {
        inlineChip = { text: "pas=0", cls: "bg-sky-500/15 text-sky-300 border-sky-500/30" };
    } else if (step.phase === "choose") {
        inlineChip = { text: `e[${step.pas}]=${step.candidate}`, cls: "bg-sky-500/15 text-sky-300 border-sky-500/30" };
    } else if (step.phase === "explore") {
        inlineChip = { text: `pas→${step.pas}`, cls: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30" };
    } else if (step.phase === "base") {
        inlineChip = { text: step.e.join(""), cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" };
    } else if (step.phase === "unchoose") {
        inlineChip = { text: `e[${step.pas}]=·`, cls: "bg-amber-500/15 text-amber-300 border-amber-500/30" };
    } else if (step.phase === "done") {
        inlineChip = { text: "✓", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" };
    }

    const codeLines: Array<{ idx: number; node: React.ReactNode }> = [
        {
            idx: 0,
            node: (
                <>
                    <span className="text-purple-400">void</span>{" "}
                    <span className="text-sky-300">backtrack</span>
                    <span className="text-slate-400">(</span>
                    <span className="text-teal-300">Estat</span>
                    <span className="text-slate-300">&amp; e, </span>
                    <span className="text-purple-400">int</span>{" "}
                    <span className="text-slate-200">pas</span>
                    <span className="text-slate-400">) {"{"}</span>
                </>
            ),
        },
        {
            idx: 1,
            node: (
                <>
                    {"    "}
                    <span className="text-purple-400">if</span>{" "}
                    <span className="text-slate-400">(</span>
                    <span className="text-slate-200">es_solucio_completa</span>
                    <span className="text-slate-400">(e, pas)) {"{"}</span>
                </>
            ),
        },
        {
            idx: 2,
            node: (
                <>
                    {"        "}
                    <span className="text-emerald-300">processar</span>
                    <span className="text-slate-400">(e);</span>
                </>
            ),
        },
        {
            idx: 3,
            node: (
                <>
                    {"        "}
                    <span className="text-purple-400">return</span>
                    <span className="text-slate-400">;</span>
                </>
            ),
        },
        {
            idx: 4,
            node: <span className="text-slate-400">{"    }"}</span>,
        },
        {
            idx: 5,
            node: (
                <>
                    {"    "}
                    <span className="text-purple-400">for</span>{" "}
                    <span className="text-slate-400">(</span>
                    <span className="text-purple-400">int</span>{" "}
                    <span className="text-slate-200">c : candidats_valids</span>
                    <span className="text-slate-400">(e, pas)) {"{"}</span>
                </>
            ),
        },
        {
            idx: 6,
            node: (
                <>
                    {"        "}
                    <span className="text-sky-300">aplicar</span>
                    <span className="text-slate-400">(e, c);       </span>
                    <span className={step.activeLine === 6 ? "text-sky-400/90" : "text-slate-600"}>
                        {"// Choose"}
                    </span>
                </>
            ),
        },
        {
            idx: 7,
            node: (
                <>
                    {"        "}
                    <span className="text-indigo-300">backtrack</span>
                    <span className="text-slate-400">(e, pas + 1); </span>
                    <span className={step.activeLine === 7 ? "text-indigo-400/90" : "text-slate-600"}>
                        {"// Explore"}
                    </span>
                </>
            ),
        },
        {
            idx: 8,
            node: (
                <>
                    {"        "}
                    <span className="text-amber-300">desfer</span>
                    <span className="text-slate-400">(e, c);        </span>
                    <span className={step.activeLine === 8 ? "text-amber-400/90" : "text-slate-600"}>
                        {"// Un-choose"}
                    </span>
                </>
            ),
        },
        {
            idx: 9,
            node: <span className="text-slate-400">{"    }"}</span>,
        },
        {
            idx: 10,
            node: <span className="text-slate-400">{"}"}</span>,
        },
    ];

    return (
        <div className="w-full flex flex-col items-center justify-center gap-5 my-8 font-mono select-none not-prose px-1">
            {/* 1. FILA SUPERIOR COMPACTA: MIDA + CONTROLS */}
            <div className="w-full max-w-[54rem] flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center bg-white/[0.04] p-0.5 rounded-lg border border-white/10">
                    <button
                        type="button"
                        onClick={() => handleSelectN(2)}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                            n === 2
                                ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                                : "text-slate-400 hover:text-slate-200 border border-transparent"
                        }`}
                    >
                        n=2
                    </button>
                    <button
                        type="button"
                        onClick={() => handleSelectN(3)}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                            n === 3
                                ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                                : "text-slate-400 hover:text-slate-200 border border-transparent"
                        }`}
                    >
                        n=3
                    </button>
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
                        disabled={stepIdx >= steps.length - 1}
                        title="Pas següent"
                        className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] disabled:opacity-30 disabled:pointer-events-none transition"
                    >
                        <ChevronRight size={13} />
                    </button>
                    <span className="text-[10px] text-slate-500 font-mono px-1.5 select-none">
                        {stepIdx + 1}/{steps.length}
                    </span>
                </div>
            </div>

            {/* 2. ZONA CENTRAL (SENSE FONS): CODI + SOLUCIÓ PARCIAL I ARBRE */}
            <div className="w-full max-w-[54rem] flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
                {/* ESQUERRA: TRAÇA DIRECTA SOBRE EL CODI */}
                <div className="w-full md:w-auto flex-1 min-w-0 overflow-x-auto hide-scrollbar md:overflow-visible">
                    <div className="relative border-l border-white/[0.08] pl-3 py-0.5 inline-block min-w-full">
                        <motion.div
                            initial={false}
                            animate={{ y: step.activeLine * LINE_H }}
                            transition={{ type: "spring", stiffness: 460, damping: 34 }}
                            style={{ height: LINE_H }}
                            className={`absolute left-0 right-0 top-0.5 rounded-r-md border-l-2 pointer-events-none transition-colors duration-200 ${highlightCls}`}
                        />

                        {codeLines.map((line) => {
                            const isActive = step.activeLine === line.idx;
                            return (
                                <div
                                    key={`bt-line-${line.idx}`}
                                    style={{ height: LINE_H, lineHeight: `${LINE_H}px` }}
                                    className={`relative flex items-center whitespace-nowrap text-[10.5px] sm:text-[11px] transition-opacity duration-150 ${
                                        isActive ? "opacity-100" : "opacity-60"
                                    }`}
                                >
                                    <span className="font-mono whitespace-pre">
                                        {line.node}
                                    </span>
                                    {isActive && inlineChip && (
                                        <span
                                            className={`ml-2 px-1.5 py-[1px] rounded text-[9.5px] leading-tight font-bold border ${inlineChip.cls}`}
                                        >
                                            {inlineChip.text}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* DRETA: VECTOR PARCIAL e + ARBRE DE RECURSIÓ (SENSE FONS) */}
                <div className="w-full md:w-[270px] shrink-0 flex flex-col items-center gap-4">
                    {/* Solució parcial e[0..n-1] amb zones passat / present / futur */}
                    <div className="flex items-end gap-1.5">
                        <span className="text-[11px] text-slate-500 mr-1 mb-6">e:</span>

                        {step.e.map((val, i) => {
                            const isDone = step.phase === "done";
                            const isPast = !isDone && i < step.pas;
                            const isPresent = !isDone && i === step.pas;
                            const isBase = step.phase === "base";
                            const isUnchoose = step.phase === "unchoose" && isPresent;
                            const isChoose = step.phase === "choose" && isPresent;

                            let zoneLabel = "";
                            let zoneCls = "text-slate-600";
                            if (!isDone) {
                                if (isPast) {
                                    zoneLabel = "passat";
                                    zoneCls = "text-emerald-400/75";
                                } else if (isPresent) {
                                    zoneLabel = "present";
                                    zoneCls = isUnchoose ? "text-amber-300" : "text-sky-400";
                                } else {
                                    zoneLabel = "futur";
                                    zoneCls = "text-slate-600";
                                }
                            }

                            let cellCls = "border border-dashed border-slate-700/70 text-slate-600";
                            if (isBase) {
                                cellCls =
                                    "bg-emerald-500/20 border-2 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(52,211,153,0.28)]";
                            } else if (isUnchoose) {
                                cellCls =
                                    "bg-amber-500/20 border-2 border-amber-400 text-amber-200 scale-105 shadow-[0_0_12px_rgba(251,191,36,0.28)]";
                            } else if (isChoose) {
                                cellCls =
                                    "bg-sky-500/25 border-2 border-sky-400 text-white scale-105 shadow-[0_0_12px_rgba(56,189,248,0.3)]";
                            } else if (isPresent) {
                                cellCls = "bg-sky-500/10 border-2 border-sky-400/70 text-sky-200";
                            } else if (isPast) {
                                cellCls = "bg-emerald-500/12 border border-emerald-500/45 text-emerald-300";
                            }

                            const showPtr = !isDone && step.pas === i;

                            return (
                                <div key={`slot-${i}`} className="flex flex-col items-center gap-1">
                                    <span className={`h-3 text-[8.5px] leading-none font-medium ${zoneCls}`}>
                                        {zoneLabel}
                                    </span>

                                    <div
                                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-200 ${cellCls}`}
                                    >
                                        {val !== null ? val : "·"}
                                    </div>

                                    <span className="text-[9.5px] text-slate-500">[{i}]</span>

                                    <div className="h-4 flex items-center justify-center">
                                        {showPtr && (
                                            <motion.span
                                                layoutId={`pas-ptr-${uid}`}
                                                transition={{ type: "spring", stiffness: 420, damping: 30 }}
                                                className={`text-[9.5px] font-bold whitespace-nowrap ${
                                                    isUnchoose ? "text-amber-300" : "text-sky-400"
                                                }`}
                                            >
                                                ▲ pas
                                            </motion.span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Posició límit [n] per al cas base (pas == n) */}
                        <div className="flex flex-col items-center gap-1">
                            <span className="h-3 text-[8.5px] leading-none font-bold text-emerald-400">
                                {step.pas === n ? "base" : ""}
                            </span>
                            <div
                                className={`w-9 h-9 rounded-xl border border-dashed flex items-center justify-center text-[10px] font-bold transition-all duration-200 ${
                                    step.pas === n
                                        ? "border-emerald-400 bg-emerald-500/15 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.22)]"
                                        : "border-white/[0.07] text-slate-700"
                                }`}
                            >
                                n
                            </div>
                            <span className="text-[9.5px] text-slate-600">[{n}]</span>
                            <div className="h-4 flex items-center justify-center">
                                {step.phase !== "done" && step.pas === n && (
                                    <motion.span
                                        layoutId={`pas-ptr-${uid}`}
                                        transition={{ type: "spring", stiffness: 420, damping: 30 }}
                                        className="text-[9.5px] font-bold text-emerald-400 whitespace-nowrap"
                                    >
                                        ▲ pas
                                    </motion.span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Arbre de recursió SVG (transparent i clicable) */}
                    <svg
                        viewBox={tree.viewBox}
                        className="w-full max-w-[260px] h-auto overflow-visible font-mono"
                        aria-label="Arbre de recursió del backtracking"
                    >
                        {/* Arestes */}
                        <g>
                            {tree.edges.map((edge) => {
                                const uNode = tree.nodeMap.get(edge.u)!;
                                const vNode = tree.nodeMap.get(edge.v)!;
                                const active = isOnActivePath(step.currentNode, edge.u, edge.v);
                                const isUnchoosing =
                                    step.unchooseEdge?.[0] === edge.u && step.unchooseEdge?.[1] === edge.v;
                                const isVisited = step.visitedEdges.some(
                                    ([eu, ev]) => eu === edge.u && ev === edge.v
                                );

                                let stroke = "#1e293b";
                                let strokeWidth = "1.2";
                                let dash = "2.5 2.5";
                                let opacity = 0.65;

                                if (isUnchoosing) {
                                    stroke = "#fbbf24";
                                    strokeWidth = "2.2";
                                    dash = "none";
                                    opacity = 1;
                                } else if (active) {
                                    stroke = step.phase === "base" && vNode.depth === n ? "#10b981" : "#38bdf8";
                                    strokeWidth = "2.2";
                                    dash = "none";
                                    opacity = 1;
                                } else if (isVisited) {
                                    stroke = "#334155";
                                    strokeWidth = "1.4";
                                    dash = "none";
                                    opacity = 0.9;
                                }

                                const midX = (uNode.x + vNode.x) / 2 + (edge.bit === "0" ? -6 : 6);
                                const midY = (uNode.y + vNode.y) / 2;

                                return (
                                    <g key={`edge-${edge.u}-${edge.v}`}>
                                        <line
                                            x1={uNode.x}
                                            y1={uNode.y}
                                            x2={vNode.x}
                                            y2={vNode.y}
                                            stroke={stroke}
                                            strokeWidth={strokeWidth}
                                            strokeDasharray={dash}
                                            opacity={opacity}
                                            className="transition-all duration-200"
                                        />
                                        <text
                                            x={midX}
                                            y={midY}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            fontSize="7.5"
                                            fontWeight={active || isUnchoosing ? "bold" : "normal"}
                                            fill={
                                                isUnchoosing
                                                    ? "#fbbf24"
                                                    : active
                                                    ? "#7dd3fc"
                                                    : isVisited
                                                    ? "#64748b"
                                                    : "#334155"
                                            }
                                            className="select-none pointer-events-none"
                                        >
                                            {edge.bit}
                                        </text>
                                    </g>
                                );
                            })}
                        </g>

                        {/* Nodes */}
                        <g>
                            {tree.nodes.map((node) => {
                                const isCurrent = step.currentNode === node.id;
                                const isLeaf = node.depth === n;
                                const isSolvedLeaf = isLeaf && step.solutions.includes(node.id);
                                const isInStack =
                                    step.currentNode !== null && step.currentNode.startsWith(node.id);
                                const isVisited = step.visitedNodes.includes(node.id);

                                let fill = "#090d16";
                                let stroke = "#334155";
                                let strokeWidth = "1.3";

                                if (isCurrent && step.phase === "base") {
                                    fill = "rgba(16, 185, 129, 0.28)";
                                    stroke = "#34d399";
                                    strokeWidth = "2.2";
                                } else if (isCurrent && step.phase === "unchoose") {
                                    fill = "rgba(251, 191, 36, 0.22)";
                                    stroke = "#fbbf24";
                                    strokeWidth = "2.2";
                                } else if (isCurrent) {
                                    fill = "rgba(56, 189, 248, 0.28)";
                                    stroke = "#38bdf8";
                                    strokeWidth = "2.2";
                                } else if (isInStack) {
                                    fill = "rgba(129, 140, 248, 0.2)";
                                    stroke = "#818cf8";
                                    strokeWidth = "1.7";
                                } else if (isSolvedLeaf) {
                                    fill = "rgba(16, 185, 129, 0.16)";
                                    stroke = "#10b981";
                                    strokeWidth = "1.6";
                                } else if (isVisited) {
                                    fill = "#0f172a";
                                    stroke = "#475569";
                                }

                                const r = n === 2 ? 9.5 : 7.5;

                                return (
                                    <g
                                        key={`node-${node.id}`}
                                        onClick={() => jumpToNode(node.id)}
                                        className="cursor-pointer group"
                                    >
                                        {isCurrent && (
                                            <circle
                                                cx={node.x}
                                                cy={node.y}
                                                r={r + 3.5}
                                                fill="none"
                                                stroke={
                                                    step.phase === "base"
                                                        ? "#34d399"
                                                        : step.phase === "unchoose"
                                                        ? "#fbbf24"
                                                        : "#38bdf8"
                                                }
                                                strokeWidth="1.1"
                                                strokeDasharray="2 2"
                                                className="opacity-80"
                                            />
                                        )}

                                        <circle
                                            cx={node.x}
                                            cy={node.y}
                                            r={r}
                                            fill={fill}
                                            stroke={stroke}
                                            strokeWidth={strokeWidth}
                                            className="transition-all duration-150 group-hover:stroke-sky-300"
                                        />

                                        {isLeaf && (
                                            <text
                                                x={node.x}
                                                y={node.y + r + 9}
                                                textAnchor="middle"
                                                fontSize="8"
                                                fontWeight={isSolvedLeaf ? "bold" : "normal"}
                                                fill={
                                                    isCurrent
                                                        ? "#6ee7b7"
                                                        : isSolvedLeaf
                                                        ? "#34d399"
                                                        : "#475569"
                                                }
                                                className="select-none pointer-events-none"
                                            >
                                                {node.id}
                                            </text>
                                        )}
                                    </g>
                                );
                            })}
                        </g>
                    </svg>
                </div>
            </div>

            {/* 3. PEU COMPACTE: PILA DE CRIDES I SORTIDA */}
            <div className="w-full max-w-[54rem] flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
                {/* Pila de crides */}
                <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-slate-500">pila:</span>
                    {step.stack.length === 0 ? (
                        <span className="text-slate-600 text-[11px] px-1.5 py-0.5 rounded border border-white/5 bg-white/[0.01]">
                            ∅
                        </span>
                    ) : (
                        step.stack.map((frame, i) => {
                            const isTop = i === step.stack.length - 1;
                            return (
                                <React.Fragment key={`stack-${frame}-${i}`}>
                                    <span
                                        className={`px-1.5 py-0.5 rounded text-[10.5px] font-medium border transition-colors ${
                                            isTop
                                                ? step.phase === "base"
                                                    ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-300 font-bold"
                                                    : step.phase === "unchoose"
                                                    ? "bg-amber-500/20 border-amber-400/40 text-amber-300 font-bold"
                                                    : "bg-sky-500/20 border-sky-400/40 text-sky-200 font-bold"
                                                : "bg-indigo-500/10 border-indigo-500/20 text-indigo-300"
                                        }`}
                                    >
                                        bt({frame})
                                    </span>
                                    {i < step.stack.length - 1 && (
                                        <span className="text-slate-600 text-[10px]">→</span>
                                    )}
                                </React.Fragment>
                            );
                        })
                    )}
                </div>

                {/* Solucions processades */}
                <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-slate-500">out:</span>
                    {step.solutions.length === 0 ? (
                        <span className="text-slate-600 text-[11px] px-1.5 py-0.5 rounded border border-white/5 bg-white/[0.01]">
                            ∅
                        </span>
                    ) : (
                        step.solutions.map((sol, idx) => {
                            const isNewest =
                                step.phase === "base" && idx === step.solutions.length - 1;
                            return (
                                <span
                                    key={`sol-${sol}`}
                                    className={`px-1.5 py-0.5 rounded text-[10.5px] font-medium border transition-all ${
                                        isNewest
                                            ? "bg-emerald-500/25 border-emerald-400 text-emerald-200 font-bold scale-105"
                                            : "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                                    }`}
                                >
                                    {sol}
                                </span>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
