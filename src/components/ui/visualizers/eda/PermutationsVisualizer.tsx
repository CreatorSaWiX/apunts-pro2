"use client";

import React, { useState, useEffect, useId, useMemo } from "react";
import { m as motion } from "framer-motion";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

type Phase = "enter" | "choose" | "explore" | "base" | "unchoose" | "done";

interface PermStep {
    idx: number;
    sol: (number | null)[];
    usat: boolean[];
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
    k: string;
}

const LINE_H = 22;

function buildSteps(n: 2 | 3): PermStep[] {
    const steps: PermStep[] = [];
    const sol: (number | null)[] = Array(n).fill(null);
    const usat: boolean[] = Array(n + 1).fill(false);
    const visitedNodes = new Set<string>([""]);
    const visitedEdges: [string, string][] = [];
    const solutions: string[] = [];

    steps.push({
        idx: 0,
        sol: [...sol],
        usat: [...usat],
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

    const walk = (idx: number, prefix: string, stack: number[]) => {
        for (let k = 1; k <= n; ++k) {
            if (usat[k]) continue;

            sol[idx] = k;
            usat[k] = true;
            steps.push({
                idx,
                sol: [...sol],
                usat: [...usat],
                phase: "choose",
                activeLine: 6,
                candidate: k,
                stack: [...stack],
                currentNode: prefix,
                unchooseEdge: null,
                visitedNodes: Array.from(visitedNodes),
                visitedEdges: [...visitedEdges],
                solutions: [...solutions],
            });

            const child = `${prefix}${k}`;
            visitedNodes.add(child);
            visitedEdges.push([prefix, child]);
            const nextStack = [...stack, idx + 1];

            if (idx + 1 === n) {
                solutions.push(child);
                steps.push({
                    idx: n,
                    sol: [...sol],
                    usat: [...usat],
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
                    idx: idx + 1,
                    sol: [...sol],
                    usat: [...usat],
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
                walk(idx + 1, child, nextStack);
            }

            sol[idx] = null;
            usat[k] = false;
            steps.push({
                idx,
                sol: [...sol],
                usat: [...usat],
                phase: "unchoose",
                activeLine: 8,
                candidate: k,
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
        idx: 0,
        sol: Array(n).fill(null),
        usat: Array(n + 1).fill(false),
        phase: "done",
        activeLine: 11,
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

function buildTreeLayout(n: 2 | 3): {
    nodes: TreeNodePos[];
    edges: TreeEdge[];
    nodeMap: Map<string, TreeNodePos>;
    viewBox: string;
} {
    const nodes: TreeNodePos[] = [];
    const edges: TreeEdge[] = [];

    if (n === 2) {
        const coords: Array<{ id: string; x: number; y: number; depth: number }> = [
            { id: "", x: 130, y: 18, depth: 0 },
            { id: "1", x: 78, y: 60, depth: 1 },
            { id: "2", x: 182, y: 60, depth: 1 },
            { id: "12", x: 78, y: 104, depth: 2 },
            { id: "21", x: 182, y: 104, depth: 2 },
        ];
        nodes.push(...coords);
        edges.push(
            { u: "", v: "1", k: "1" },
            { u: "", v: "2", k: "2" },
            { u: "1", v: "12", k: "2" },
            { u: "2", v: "21", k: "1" }
        );
        const nodeMap = new Map<string, TreeNodePos>(nodes.map((nd) => [nd.id, nd]));
        return { nodes, edges, nodeMap, viewBox: "0 0 260 128" };
    }

    const level1X = [46, 130, 214];
    const used = [false, false, false, false];
    nodes.push({ id: "", x: 130, y: 16, depth: 0 });

    for (let a = 1; a <= 3; a++) {
        const id1 = `${a}`;
        const x1 = level1X[a - 1];
        nodes.push({ id: id1, x: x1, y: 52, depth: 1 });
        edges.push({ u: "", v: id1, k: id1 });
        used[a] = true;

        const avail2 = [1, 2, 3].filter((v) => !used[v]);
        avail2.forEach((b, idx2) => {
            const id2 = `${id1}${b}`;
            const x2 = x1 + (idx2 === 0 ? -20 : 20);
            nodes.push({ id: id2, x: x2, y: 90, depth: 2 });
            edges.push({ u: id1, v: id2, k: `${b}` });
            used[b] = true;

            const c = [1, 2, 3].find((v) => !used[v])!;
            const id3 = `${id2}${c}`;
            nodes.push({ id: id3, x: x2, y: 128, depth: 3 });
            edges.push({ u: id2, v: id3, k: `${c}` });

            used[b] = false;
        });

        used[a] = false;
    }

    const nodeMap = new Map<string, TreeNodePos>(nodes.map((nd) => [nd.id, nd]));
    return { nodes, edges, nodeMap, viewBox: "0 0 260 152" };
}

function isOnActivePath(currentNode: string | null, u: string, v: string): boolean {
    if (currentNode === null) return false;
    return currentNode.startsWith(v) && v.length === u.length + 1;
}

export default function PermutationsVisualizer() {
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
        }, 550);

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
        const targetIdx = steps.findIndex((st) => st.currentNode === nodeId);
        if (targetIdx !== -1) {
            setStepIdx(targetIdx);
        }
    };

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

    let inlineChip: { text: string; cls: string } | null = null;
    if (step.phase === "enter") {
        inlineChip = { text: "idx=0", cls: "bg-sky-500/15 text-sky-300 border-sky-500/30" };
    } else if (step.phase === "choose") {
        inlineChip = {
            text: `sol[${step.idx}]=${step.candidate}`,
            cls: "bg-sky-500/15 text-sky-300 border-sky-500/30",
        };
    } else if (step.phase === "explore") {
        inlineChip = { text: `idx→${step.idx}`, cls: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30" };
    } else if (step.phase === "base") {
        inlineChip = { text: step.sol.join(""), cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" };
    } else if (step.phase === "unchoose") {
        inlineChip = {
            text: `usat[${step.candidate}]=F`,
            cls: "bg-amber-500/15 text-amber-300 border-amber-500/30",
        };
    } else if (step.phase === "done") {
        inlineChip = {
            text: `${n}!=${n === 2 ? 2 : 6}`,
            cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
        };
    }

    const codeLines: Array<{ idx: number; node: React.ReactNode }> = [
        {
            idx: 0,
            node: (
                <>
                    <span className="text-purple-400">void</span>{" "}
                    <span className="text-sky-300">permutacions</span>
                    <span className="text-slate-400">(vector&lt;</span>
                    <span className="text-purple-400">int</span>
                    <span className="text-slate-400">&gt;&amp; sol,</span>
                </>
            ),
        },
        {
            idx: 1,
            node: (
                <>
                    {"    "}
                    <span className="text-purple-400">int</span>{" "}
                    <span className="text-slate-200">idx</span>
                    <span className="text-slate-400">, </span>
                    <span className="text-purple-400">int</span>{" "}
                    <span className="text-slate-200">n</span>
                    <span className="text-slate-400">, vector&lt;</span>
                    <span className="text-purple-400">bool</span>
                    <span className="text-slate-400">&gt;&amp; usat) {"{"}</span>
                </>
            ),
        },
        {
            idx: 2,
            node: (
                <>
                    {"  "}
                    <span className="text-purple-400">if</span>{" "}
                    <span className="text-slate-400">(idx == n) {"{ "}</span>
                    <span className="text-emerald-300">processar</span>
                    <span className="text-slate-400">(sol); </span>
                    <span className="text-purple-400">return</span>
                    <span className="text-slate-400">; {"}"}</span>
                </>
            ),
        },
        {
            idx: 3,
            node: (
                <>
                    {"  "}
                    <span className="text-purple-400">for</span>{" "}
                    <span className="text-slate-400">(</span>
                    <span className="text-purple-400">int</span>{" "}
                    <span className="text-slate-200">k = 1</span>
                    <span className="text-slate-400">; k &lt;= n; ++k) {"{"}</span>
                </>
            ),
        },
        {
            idx: 4,
            node: (
                <>
                    {"    "}
                    <span className="text-purple-400">if</span>{" "}
                    <span className="text-slate-400">(!</span>
                    <span className="text-slate-200">usat[k]</span>
                    <span className="text-slate-400">) {"{"}</span>
                </>
            ),
        },
        {
            idx: 5,
            node: (
                <>
                    {"      "}
                    <span className="text-sky-300">sol[idx]</span>
                    <span className="text-slate-400"> = k;</span>
                </>
            ),
        },
        {
            idx: 6,
            node: (
                <>
                    {"      "}
                    <span className="text-sky-300">usat[k]</span>
                    <span className="text-slate-400"> = </span>
                    <span className="text-sky-300">true</span>
                    <span className="text-slate-400">;</span>
                    <span className={`ml-3 ${step.activeLine === 6 ? "text-sky-400/90" : "text-slate-600"}`}>
                        {"// Choose"}
                    </span>
                </>
            ),
        },
        {
            idx: 7,
            node: (
                <>
                    {"      "}
                    <span className="text-indigo-300">permutacions</span>
                    <span className="text-slate-400">(sol, idx + 1, n, usat);</span>
                    <span className={`ml-1.5 ${step.activeLine === 7 ? "text-indigo-400/90" : "text-slate-600"}`}>
                        {"// Explore"}
                    </span>
                </>
            ),
        },
        {
            idx: 8,
            node: (
                <>
                    {"      "}
                    <span className="text-amber-300">usat[k]</span>
                    <span className="text-slate-400"> = </span>
                    <span className="text-amber-300">false</span>
                    <span className="text-slate-400">;</span>
                    <span className={`ml-2.5 ${step.activeLine === 8 ? "text-amber-400/90" : "text-slate-600"}`}>
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
            node: <span className="text-slate-400">{"  }"}</span>,
        },
        {
            idx: 11,
            node: <span className="text-slate-400">{"}"}</span>,
        },
    ];

    const isBase = step.phase === "base";
    const isDone = step.phase === "done";

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

            {/* 2. ZONA CENTRAL (SENSE FONS): CODI + SOL / USAT + ARBRE */}
            <div className="w-full max-w-[54rem] flex flex-col md:flex-row items-center md:items-start justify-between gap-5">
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
                            const isActive =
                                step.activeLine === line.idx ||
                                (step.phase === "enter" && line.idx === 1) ||
                                (step.phase === "choose" && line.idx === 5);
                            return (
                                <div
                                    key={`perm-line-${line.idx}`}
                                    style={{ height: LINE_H, lineHeight: `${LINE_H}px` }}
                                    className={`relative flex items-center whitespace-nowrap text-[10px] sm:text-[10.5px] transition-opacity duration-150 ${
                                        isActive ? "opacity-100" : "opacity-60"
                                    }`}
                                >
                                    <span className="font-mono whitespace-pre">
                                        {line.node}
                                    </span>
                                    {step.activeLine === line.idx && inlineChip && (
                                        <span
                                            className={`ml-2 px-1.5 py-[1px] rounded text-[9px] leading-tight font-bold border ${inlineChip.cls}`}
                                        >
                                            {inlineChip.text}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* DRETA: SOL[0..n-1] + USAT[0..n] + ARBRE PERMUTACIONS */}
                <div className="w-full md:w-[260px] shrink-0 flex flex-col items-center gap-3.5">
                    {/* Solució parcial sol[0..n-1] */}
                    <div className="flex items-start gap-1.5">
                        <span className="text-[11px] text-slate-500 mr-0.5 mt-2">sol:</span>

                        {step.sol.map((val, i) => {
                            const isPast = !isDone && i < step.idx;
                            const isPresent = !isDone && i === step.idx;
                            const isChoose = step.phase === "choose" && isPresent;
                            const isUnchoose = step.phase === "unchoose" && isPresent;

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
                                cellCls = "bg-indigo-500/15 border border-indigo-400/45 text-indigo-200";
                            }

                            return (
                                <div key={`sol-slot-${i}`} className="flex flex-col items-center gap-1">
                                    <div
                                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-200 ${cellCls}`}
                                    >
                                        {val !== null ? val : "·"}
                                    </div>
                                    <span className="text-[9px] text-slate-500">[{i}]</span>
                                    <div className="h-3.5 flex items-center justify-center">
                                        {isPresent && (
                                            <motion.span
                                                layoutId={`perm-idx-ptr-${uid}`}
                                                transition={{ type: "spring", stiffness: 420, damping: 30 }}
                                                className={`text-[9px] font-bold whitespace-nowrap ${
                                                    isUnchoose ? "text-amber-300" : "text-sky-400"
                                                }`}
                                            >
                                                ▲ idx
                                            </motion.span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Límit [n] per al cas base (idx == n) */}
                        <div className="flex flex-col items-center gap-1">
                            <div
                                className={`w-8 h-8 rounded-xl border border-dashed flex items-center justify-center text-[10px] font-bold transition-all duration-200 ${
                                    step.idx === n
                                        ? "border-emerald-400 bg-emerald-500/15 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.22)]"
                                        : "border-white/[0.07] text-slate-700"
                                }`}
                            >
                                n
                            </div>
                            <span className="text-[9px] text-slate-600">[{n}]</span>
                            <div className="h-3.5 flex items-center justify-center">
                                {!isDone && step.idx === n && (
                                    <motion.span
                                        layoutId={`perm-idx-ptr-${uid}`}
                                        transition={{ type: "spring", stiffness: 420, damping: 30 }}
                                        className="text-[9px] font-bold text-emerald-400 whitespace-nowrap"
                                    >
                                        ▲ idx
                                    </motion.span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Vector booleà usat[0..n] (Θ(1) lookup) */}
                    <div className="flex items-start gap-1.5">
                        <span className="text-[11px] text-slate-500 mr-0.5 mt-1.5">usat:</span>

                        {step.usat.map((usedFlag, k) => {
                            if (k === 0) {
                                return (
                                    <div key="usat-0" className="flex flex-col items-center gap-0.5 opacity-30">
                                        <div className="w-7 h-7 rounded-lg border border-dashed border-slate-700 flex items-center justify-center text-[10px] text-slate-600">
                                            ∅
                                        </div>
                                        <span className="text-[8.5px] text-slate-600">[0]</span>
                                    </div>
                                );
                            }

                            const isChanged = step.candidate === k;
                            const isJustMarked = step.phase === "choose" && isChanged;
                            const isJustUnmarked = step.phase === "unchoose" && isChanged;

                            let boxCls = "bg-white/[0.02] border border-white/10 text-slate-500";
                            if (isJustMarked) {
                                boxCls =
                                    "bg-sky-500/25 border-2 border-sky-400 text-sky-200 font-bold scale-105 shadow-[0_0_10px_rgba(56,189,248,0.28)]";
                            } else if (isJustUnmarked) {
                                boxCls =
                                    "bg-amber-500/20 border-2 border-amber-400 text-amber-200 font-bold scale-105 shadow-[0_0_10px_rgba(251,191,36,0.28)]";
                            } else if (usedFlag) {
                                boxCls = "bg-indigo-500/20 border border-indigo-400/55 text-indigo-300 font-bold";
                            }

                            return (
                                <div key={`usat-${k}`} className="flex flex-col items-center gap-0.5">
                                    <div
                                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] transition-all duration-150 ${boxCls}`}
                                    >
                                        {usedFlag ? "T" : "F"}
                                    </div>
                                    <span
                                        className={`text-[8.5px] ${
                                            isJustMarked
                                                ? "text-sky-300 font-bold"
                                                : isJustUnmarked
                                                ? "text-amber-300 font-bold"
                                                : usedFlag
                                                ? "text-indigo-300"
                                                : "text-slate-500"
                                        }`}
                                    >
                                        [{k}]
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Arbre de permutacions SVG (transparent i clicable) */}
                    <svg
                        viewBox={tree.viewBox}
                        className="w-full max-w-[260px] h-auto overflow-visible font-mono"
                        aria-label="Arbre de recursió de permutacions"
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
                                    stroke = isBase && vNode.depth === n ? "#10b981" : "#38bdf8";
                                    strokeWidth = "2.2";
                                    dash = "none";
                                    opacity = 1;
                                } else if (isVisited) {
                                    stroke = "#334155";
                                    strokeWidth = "1.4";
                                    dash = "none";
                                    opacity = 0.9;
                                }

                                const dx = vNode.x - uNode.x;
                                const labelOffsetX = dx < -1 ? -6 : dx > 1 ? 6 : 6.5;
                                const midX = (uNode.x + vNode.x) / 2 + labelOffsetX;
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
                                            {edge.k}
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

                                if (isCurrent && isBase) {
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
                                const ringStroke = isBase
                                    ? "#34d399"
                                    : step.phase === "unchoose"
                                    ? "#fbbf24"
                                    : "#38bdf8";

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
                                                stroke={ringStroke}
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
                                                y={node.y + r + 9.5}
                                                textAnchor="middle"
                                                fontSize="7.5"
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

            {/* 3. PEU COMPACTE: PILA DE CRIDES I PERMUTACIONS GENERADES */}
            <div className="w-full max-w-[54rem] flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
                <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-slate-500">pila:</span>
                    {step.stack.length === 0 ? (
                        <span className="text-slate-600 text-[11px] px-1.5 py-0.5 rounded border border-white/5 bg-white/[0.01]">
                            ·
                        </span>
                    ) : (
                        step.stack.map((frame, i) => {
                            const isTop = i === step.stack.length - 1;
                            return (
                                <React.Fragment key={`stack-${frame}-${i}`}>
                                    <span
                                        className={`px-1.5 py-0.5 rounded text-[10.5px] font-medium border transition-colors ${
                                            isTop
                                                ? isBase
                                                    ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-300 font-bold"
                                                    : step.phase === "unchoose"
                                                    ? "bg-amber-500/20 border-amber-400/40 text-amber-300 font-bold"
                                                    : "bg-sky-500/20 border-sky-400/40 text-sky-200 font-bold"
                                                : "bg-indigo-500/10 border-indigo-500/20 text-indigo-300"
                                        }`}
                                    >
                                        p({frame})
                                    </span>
                                    {i < step.stack.length - 1 && (
                                        <span className="text-slate-600 text-[10px]">→</span>
                                    )}
                                </React.Fragment>
                            );
                        })
                    )}
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-slate-500">out:</span>
                    {step.solutions.length === 0 ? (
                        <span className="text-slate-600 text-[11px] px-1.5 py-0.5 rounded border border-white/5 bg-white/[0.01]">
                            ·
                        </span>
                    ) : (
                        step.solutions.map((perm, idx) => {
                            const isNewest = isBase && idx === step.solutions.length - 1;
                            return (
                                <button
                                    key={`perm-sol-${perm}`}
                                    type="button"
                                    onClick={() => jumpToNode(perm)}
                                    className={`px-1.5 py-0.5 rounded text-[10.5px] font-medium border transition-all cursor-pointer ${
                                        isNewest
                                            ? "bg-emerald-500/25 border-emerald-400 text-emerald-200 font-bold scale-105"
                                            : "bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:border-emerald-400/60"
                                    }`}
                                >
                                    {perm}
                                </button>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
