"use client";

import React, { useState, useEffect, useId, useMemo } from "react";
import { m as motion } from "framer-motion";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

type Phase = "enter" | "prune" | "choose" | "explore" | "base" | "unchoose" | "done";

interface DerangeStep {
    idx: number;
    sol: (number | null)[];
    usat: boolean[];
    phase: Phase;
    activeLine: number;
    candidate: number | null;
    stack: number[];
    currentNode: string | null;
    prunedNode: string | null;
    prunedEdge: [string, string] | null;
    unchooseEdge: [string, string] | null;
    visitedNodes: string[];
    visitedEdges: [string, string][];
    prunedNodes: string[];
    prunedEdges: [string, string][];
    solutions: string[];
}

interface TreeNodePos {
    id: string;
    x: number;
    y: number;
    depth: number;
    pruned?: boolean;
}

interface TreeEdge {
    u: string;
    v: string;
    k: string;
    pruned?: boolean;
}

const LINE_H = 22;

function buildSteps(n: 2 | 3): DerangeStep[] {
    const steps: DerangeStep[] = [];
    const sol: (number | null)[] = Array(n).fill(null);
    const usat: boolean[] = Array(n).fill(false);
    const visitedNodes = new Set<string>([""]);
    const visitedEdges: [string, string][] = [];
    const prunedNodes = new Set<string>();
    const prunedEdges: [string, string][] = [];
    const solutions: string[] = [];

    const snapshot = (
        partial: Omit<
            DerangeStep,
            "sol" | "usat" | "visitedNodes" | "visitedEdges" | "prunedNodes" | "prunedEdges" | "solutions"
        >
    ): DerangeStep => ({
        ...partial,
        sol: [...sol],
        usat: [...usat],
        visitedNodes: Array.from(visitedNodes),
        visitedEdges: [...visitedEdges],
        prunedNodes: Array.from(prunedNodes),
        prunedEdges: [...prunedEdges],
        solutions: [...solutions],
    });

    steps.push(
        snapshot({
            idx: 0,
            phase: "enter",
            activeLine: 0,
            candidate: null,
            stack: [0],
            currentNode: "",
            prunedNode: null,
            prunedEdge: null,
            unchooseEdge: null,
        })
    );

    const walk = (idx: number, prefix: string, stack: number[]) => {
        for (let k = 0; k < n; ++k) {
            if (usat[k]) continue;

            const child = `${prefix}${k}`;

            // Poda de desarranjament: k == idx (punt fix)
            if (k === idx) {
                prunedNodes.add(child);
                prunedEdges.push([prefix, child]);
                steps.push(
                    snapshot({
                        idx,
                        phase: "prune",
                        activeLine: 4,
                        candidate: k,
                        stack: [...stack],
                        currentNode: prefix,
                        prunedNode: child,
                        prunedEdge: [prefix, child],
                        unchooseEdge: null,
                    })
                );
                continue;
            }

            sol[idx] = k;
            usat[k] = true;
            steps.push(
                snapshot({
                    idx,
                    phase: "choose",
                    activeLine: 6,
                    candidate: k,
                    stack: [...stack],
                    currentNode: prefix,
                    prunedNode: null,
                    prunedEdge: null,
                    unchooseEdge: null,
                })
            );

            visitedNodes.add(child);
            visitedEdges.push([prefix, child]);
            const nextStack = [...stack, idx + 1];

            if (idx + 1 === n) {
                solutions.push(child);
                steps.push(
                    snapshot({
                        idx: n,
                        phase: "base",
                        activeLine: 2,
                        candidate: null,
                        stack: nextStack,
                        currentNode: child,
                        prunedNode: null,
                        prunedEdge: null,
                        unchooseEdge: null,
                    })
                );
            } else {
                steps.push(
                    snapshot({
                        idx: idx + 1,
                        phase: "explore",
                        activeLine: 7,
                        candidate: null,
                        stack: nextStack,
                        currentNode: child,
                        prunedNode: null,
                        prunedEdge: null,
                        unchooseEdge: null,
                    })
                );
                walk(idx + 1, child, nextStack);
            }

            sol[idx] = null;
            usat[k] = false;
            steps.push(
                snapshot({
                    idx,
                    phase: "unchoose",
                    activeLine: 8,
                    candidate: k,
                    stack: [...stack],
                    currentNode: prefix,
                    prunedNode: null,
                    prunedEdge: null,
                    unchooseEdge: [prefix, child],
                })
            );
        }
    };

    walk(0, "", [0]);

    steps.push(
        snapshot({
            idx: 0,
            phase: "done",
            activeLine: 11,
            candidate: null,
            stack: [],
            currentNode: null,
            prunedNode: null,
            prunedEdge: null,
            unchooseEdge: null,
        })
    );

    return steps;
}

function buildTreeLayout(n: 2 | 3): {
    nodes: TreeNodePos[];
    edges: TreeEdge[];
    nodeMap: Map<string, TreeNodePos>;
    viewBox: string;
} {
    if (n === 2) {
        const nodes: TreeNodePos[] = [
            { id: "", x: 120, y: 18, depth: 0 },
            { id: "0", x: 74, y: 60, depth: 1, pruned: true },
            { id: "1", x: 166, y: 60, depth: 1 },
            { id: "10", x: 166, y: 104, depth: 2 },
        ];
        const edges: TreeEdge[] = [
            { u: "", v: "0", k: "0", pruned: true },
            { u: "", v: "1", k: "1" },
            { u: "1", v: "10", k: "0" },
        ];
        const nodeMap = new Map<string, TreeNodePos>(nodes.map((nd) => [nd.id, nd]));
        return { nodes, edges, nodeMap, viewBox: "0 0 240 128" };
    }

    const nodes: TreeNodePos[] = [
        { id: "", x: 125, y: 16, depth: 0 },
        { id: "0", x: 42, y: 52, depth: 1, pruned: true },
        { id: "1", x: 125, y: 52, depth: 1 },
        { id: "2", x: 208, y: 52, depth: 1 },
        { id: "10", x: 98, y: 90, depth: 2 },
        { id: "12", x: 152, y: 90, depth: 2 },
        { id: "20", x: 186, y: 90, depth: 2 },
        { id: "21", x: 232, y: 90, depth: 2, pruned: true },
        { id: "102", x: 98, y: 128, depth: 3, pruned: true },
        { id: "120", x: 152, y: 128, depth: 3 },
        { id: "201", x: 186, y: 128, depth: 3 },
    ];
    const edges: TreeEdge[] = [
        { u: "", v: "0", k: "0", pruned: true },
        { u: "", v: "1", k: "1" },
        { u: "", v: "2", k: "2" },
        { u: "1", v: "10", k: "0" },
        { u: "1", v: "12", k: "2" },
        { u: "2", v: "20", k: "0" },
        { u: "2", v: "21", k: "1", pruned: true },
        { u: "10", v: "102", k: "2", pruned: true },
        { u: "12", v: "120", k: "0" },
        { u: "20", v: "201", k: "1" },
    ];
    const nodeMap = new Map<string, TreeNodePos>(nodes.map((nd) => [nd.id, nd]));
    return { nodes, edges, nodeMap, viewBox: "0 0 250 152" };
}

function isOnActivePath(currentNode: string | null, u: string, v: string): boolean {
    if (currentNode === null) return false;
    return currentNode.startsWith(v) && v.length === u.length + 1;
}

export default function DerangementsVisualizer() {
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
        const targetIdx = steps.findIndex(
            (st) => st.prunedNode === nodeId || st.currentNode === nodeId
        );
        if (targetIdx !== -1) {
            setStepIdx(targetIdx);
        }
    };

    let highlightCls = "bg-sky-500/[0.12] border-sky-400";
    if (step.phase === "prune") {
        highlightCls = "bg-rose-500/[0.14] border-rose-400";
    } else if (step.phase === "explore") {
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
    } else if (step.phase === "prune") {
        inlineChip = {
            text: `k==idx=${step.idx} ✗`,
            cls: "bg-rose-500/15 text-rose-300 border-rose-500/30",
        };
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
            text: `D(${n})=${n === 2 ? 1 : 2}`,
            cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
        };
    }

    const codeLines: Array<{ idx: number; node: React.ReactNode }> = [
        {
            idx: 0,
            node: (
                <>
                    <span className="text-purple-400">void</span>{" "}
                    <span className="text-sky-300">desarranjaments</span>
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
                    <span className="text-slate-200">k = 0</span>
                    <span className="text-slate-400">; k &lt; n; ++k) {"{"}</span>
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
                    <span className="text-slate-400"> &amp;&amp; </span>
                    <span className={step.phase === "prune" ? "text-rose-300 font-bold" : "text-amber-300"}>
                        k != idx
                    </span>
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
                </>
            ),
        },
        {
            idx: 7,
            node: (
                <>
                    {"      "}
                    <span className="text-indigo-300">desarranjaments</span>
                    <span className="text-slate-400">(sol, idx + 1, n, usat);</span>
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
    const isPrune = step.phase === "prune";

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

            {/* 2. ZONA CENTRAL (SENSE FONS): CODI + SOL / USAT + ARBRE PODAT */}
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
                                    key={`der-line-${line.idx}`}
                                    style={{ height: LINE_H, lineHeight: `${LINE_H}px` }}
                                    className={`relative flex items-center whitespace-nowrap text-[9.5px] sm:text-[10px] transition-opacity duration-150 ${
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

                {/* DRETA: SOL[0..n-1] + USAT[0..n-1] + ARBRE PODAT */}
                <div className="w-full md:w-[250px] shrink-0 flex flex-col items-center gap-3.5">
                    {/* Solució parcial sol[0..n-1] */}
                    <div className="flex items-start gap-1.5">
                        <span className="text-[11px] text-slate-500 mr-0.5 mt-2">sol:</span>

                        {step.sol.map((val, i) => {
                            const isPast = !isDone && i < step.idx;
                            const isPresent = !isDone && i === step.idx;
                            const isPrunedSlot = isPrune && isPresent;
                            const isChoose = step.phase === "choose" && isPresent;
                            const isUnchoose = step.phase === "unchoose" && isPresent;

                            let cellCls = "border border-dashed border-slate-700/70 text-slate-600";
                            if (isBase) {
                                cellCls =
                                    "bg-emerald-500/20 border-2 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(52,211,153,0.28)]";
                            } else if (isPrunedSlot) {
                                cellCls =
                                    "bg-rose-500/20 border-2 border-rose-400 text-rose-200 scale-105 shadow-[0_0_12px_rgba(248,113,113,0.3)]";
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

                            const displayVal = isPrunedSlot
                                ? step.candidate
                                : val !== null
                                ? val
                                : "·";

                            return (
                                <div key={`der-sol-${i}`} className="flex flex-col items-center gap-1">
                                    <div
                                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-200 ${cellCls}`}
                                    >
                                        {displayVal}
                                    </div>
                                    <span
                                        className={`text-[9px] ${
                                            isPrunedSlot ? "text-rose-300 font-bold" : "text-slate-500"
                                        }`}
                                    >
                                        [{i}]
                                    </span>
                                    <div className="h-3.5 flex items-center justify-center">
                                        {isPresent && (
                                            <motion.span
                                                layoutId={`der-idx-ptr-${uid}`}
                                                transition={{ type: "spring", stiffness: 420, damping: 30 }}
                                                className={`text-[9px] font-bold whitespace-nowrap ${
                                                    isPrunedSlot
                                                        ? "text-rose-300"
                                                        : isUnchoose
                                                        ? "text-amber-300"
                                                        : "text-sky-400"
                                                }`}
                                            >
                                                {isPrunedSlot ? `≠${i}` : "▲ idx"}
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
                                        layoutId={`der-idx-ptr-${uid}`}
                                        transition={{ type: "spring", stiffness: 420, damping: 30 }}
                                        className="text-[9px] font-bold text-emerald-400 whitespace-nowrap"
                                    >
                                        ▲ idx
                                    </motion.span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Vector booleà usat[0..n-1] (0-indexat!) */}
                    <div className="flex items-start gap-1.5">
                        <span className="text-[11px] text-slate-500 mr-0.5 mt-1.5">usat:</span>

                        {step.usat.map((usedFlag, k) => {
                            const isChanged = step.candidate === k;
                            const isJustMarked = step.phase === "choose" && isChanged;
                            const isJustUnmarked = step.phase === "unchoose" && isChanged;
                            const isPrunedCandidate = isPrune && isChanged;

                            let boxCls = "bg-white/[0.02] border border-white/10 text-slate-500";
                            if (isPrunedCandidate) {
                                boxCls =
                                    "bg-rose-500/20 border-2 border-rose-400 text-rose-200 font-bold scale-105";
                            } else if (isJustMarked) {
                                boxCls =
                                    "bg-sky-500/25 border-2 border-sky-400 text-sky-200 font-bold scale-105 shadow-[0_0_10px_rgba(56,189,248,0.28)]";
                            } else if (isJustUnmarked) {
                                boxCls =
                                    "bg-amber-500/20 border-2 border-amber-400 text-amber-200 font-bold scale-105 shadow-[0_0_10px_rgba(251,191,36,0.28)]";
                            } else if (usedFlag) {
                                boxCls = "bg-indigo-500/20 border border-indigo-400/55 text-indigo-300 font-bold";
                            }

                            return (
                                <div key={`der-usat-${k}`} className="flex flex-col items-center gap-0.5">
                                    <div
                                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] transition-all duration-150 ${boxCls}`}
                                    >
                                        {usedFlag ? "T" : "F"}
                                    </div>
                                    <span
                                        className={`text-[8.5px] ${
                                            isPrunedCandidate
                                                ? "text-rose-300 font-bold"
                                                : isJustMarked
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

                    {/* Arbre de desarranjaments SVG amb branques podades (✕) */}
                    <svg
                        viewBox={tree.viewBox}
                        className="w-full max-w-[250px] h-auto overflow-visible font-mono"
                        aria-label="Arbre de recursió de desarranjaments"
                    >
                        {/* Arestes */}
                        <g>
                            {tree.edges.map((edge) => {
                                const uNode = tree.nodeMap.get(edge.u)!;
                                const vNode = tree.nodeMap.get(edge.v)!;
                                const active = isOnActivePath(step.currentNode, edge.u, edge.v);
                                const isActivePrune =
                                    step.prunedEdge?.[0] === edge.u && step.prunedEdge?.[1] === edge.v;
                                const isPastPruned = step.prunedEdges.some(
                                    ([eu, ev]) => eu === edge.u && ev === edge.v
                                );
                                const isUnchoosing =
                                    step.unchooseEdge?.[0] === edge.u && step.unchooseEdge?.[1] === edge.v;
                                const isVisited = step.visitedEdges.some(
                                    ([eu, ev]) => eu === edge.u && ev === edge.v
                                );

                                let stroke = "#1e293b";
                                let strokeWidth = "1.2";
                                let dash = "2.5 2.5";
                                let opacity = 0.65;

                                if (isActivePrune) {
                                    stroke = "#f87171";
                                    strokeWidth = "2.2";
                                    dash = "3 2.5";
                                    opacity = 1;
                                } else if (isPastPruned) {
                                    stroke = "#7f1d1d";
                                    strokeWidth = "1.2";
                                    dash = "3 2.5";
                                    opacity = 0.75;
                                } else if (isUnchoosing) {
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
                                    <g key={`der-edge-${edge.u}-${edge.v}`}>
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
                                            fontWeight={active || isActivePrune || isUnchoosing ? "bold" : "normal"}
                                            fill={
                                                isActivePrune
                                                    ? "#fca5a5"
                                                    : isPastPruned
                                                    ? "#b91c1c"
                                                    : isUnchoosing
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
                                const isActivePruned = step.prunedNode === node.id;
                                const isPastPruned = step.prunedNodes.includes(node.id);
                                const isLeaf = node.depth === n && !node.pruned;
                                const isSolvedLeaf = isLeaf && step.solutions.includes(node.id);
                                const isInStack =
                                    step.currentNode !== null && step.currentNode.startsWith(node.id);
                                const isVisited = step.visitedNodes.includes(node.id);

                                let fill = "#090d16";
                                let stroke = "#334155";
                                let strokeWidth = "1.3";

                                if (isActivePruned) {
                                    fill = "rgba(248, 113, 113, 0.28)";
                                    stroke = "#f87171";
                                    strokeWidth = "2.2";
                                } else if (isPastPruned) {
                                    fill = "rgba(127, 29, 29, 0.25)";
                                    stroke = "#991b1b";
                                    strokeWidth = "1.3";
                                } else if (isCurrent && isBase) {
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
                                } else if (node.pruned) {
                                    fill = "#090d16";
                                    stroke = "#3f1d24";
                                }

                                const r = n === 2 ? 9.5 : 7.5;
                                const ringStroke = isActivePruned
                                    ? "#f87171"
                                    : isBase
                                    ? "#34d399"
                                    : step.phase === "unchoose"
                                    ? "#fbbf24"
                                    : "#38bdf8";

                                return (
                                    <g
                                        key={`der-node-${node.id}`}
                                        onClick={() => jumpToNode(node.id)}
                                        className="cursor-pointer group"
                                    >
                                        {(isCurrent || isActivePruned) && (
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

                                        {node.pruned && (
                                            <text
                                                x={node.x}
                                                y={node.y + 0.5}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                fontSize="8"
                                                fontWeight="bold"
                                                fill={
                                                    isActivePruned
                                                        ? "#fca5a5"
                                                        : isPastPruned
                                                        ? "#ef4444"
                                                        : "#475569"
                                                }
                                                className="select-none pointer-events-none"
                                            >
                                                ✕
                                            </text>
                                        )}

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

            {/* 3. PEU COMPACTE: PILA DE CRIDES I DESARRANJAMENTS GENERATS */}
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
                                <React.Fragment key={`der-stack-${frame}-${i}`}>
                                    <span
                                        className={`px-1.5 py-0.5 rounded text-[10.5px] font-medium border transition-colors ${
                                            isTop
                                                ? isBase
                                                    ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-300 font-bold"
                                                    : isPrune
                                                    ? "bg-rose-500/20 border-rose-400/40 text-rose-300 font-bold"
                                                    : step.phase === "unchoose"
                                                    ? "bg-amber-500/20 border-amber-400/40 text-amber-300 font-bold"
                                                    : "bg-sky-500/20 border-sky-400/40 text-sky-200 font-bold"
                                                : "bg-indigo-500/10 border-indigo-500/20 text-indigo-300"
                                        }`}
                                    >
                                        d({frame})
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
                        step.solutions.map((der, idx) => {
                            const isNewest = isBase && idx === step.solutions.length - 1;
                            return (
                                <button
                                    key={`der-sol-${der}`}
                                    type="button"
                                    onClick={() => jumpToNode(der)}
                                    className={`px-1.5 py-0.5 rounded text-[10.5px] font-medium border transition-all cursor-pointer ${
                                        isNewest
                                            ? "bg-emerald-500/25 border-emerald-400 text-emerald-200 font-bold scale-105"
                                            : "bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:border-emerald-400/60"
                                    }`}
                                >
                                    {der}
                                </button>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
