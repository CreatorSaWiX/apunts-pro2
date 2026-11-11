"use client";

import React, { useState, useEffect, useMemo } from "react";
import { m as motion } from "framer-motion";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

type Phase = "enter" | "call0" | "call1" | "check" | "prune1" | "prune2" | "base" | "done";
type PruneKind = "p1" | "p2";

interface KnapsackItem {
    p: number;
    v: number;
}

interface BestImprovement {
    bits: string;
    val: number;
    pes: number;
}

interface StackFrame {
    k: number;
    pes: number;
    val: number;
}

interface KnapsackStep {
    k: number;
    pes: number;
    val: number;
    svr: number;
    best: number;
    picks: (0 | 1 | null)[];
    phase: Phase;
    activeLine: number;
    stack: StackFrame[];
    currentNode: string | null;
    visitedNodes: string[];
    visitedEdges: [string, string][];
    prunedNodes: Record<string, PruneKind>;
    leafValues: Record<string, number>;
    improvements: BestImprovement[];
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
    bit: "0" | "1";
}

const ITEMS: readonly KnapsackItem[] = [
    { p: 3, v: 2 },
    { p: 3, v: 5 },
    { p: 2, v: 4 },
];
const N = ITEMS.length;
const TOTAL_VAL = ITEMS.reduce((acc, it) => acc + it.v, 0); // 11
const LINE_H = 24;

function buildSteps(capacity: 4 | 5): KnapsackStep[] {
    const steps: KnapsackStep[] = [];
    const picks: (0 | 1 | null)[] = Array(N).fill(null);
    const visitedNodes = new Set<string>([""]);
    const visitedEdges: [string, string][] = [];
    const prunedNodes: Record<string, PruneKind> = {};
    const leafValues: Record<string, number> = {};
    const improvements: BestImprovement[] = [];
    let best = 0;

    steps.push({
        k: 0,
        pes: 0,
        val: 0,
        svr: TOTAL_VAL,
        best,
        picks: [...picks],
        phase: "enter",
        activeLine: 0,
        stack: [{ k: 0, pes: 0, val: 0 }],
        currentNode: "",
        visitedNodes: Array.from(visitedNodes),
        visitedEdges: [...visitedEdges],
        prunedNodes: { ...prunedNodes },
        leafValues: { ...leafValues },
        improvements: [...improvements],
    });

    const walk = (k: number, pes: number, val: number, svr: number, prefix: string, stack: StackFrame[]) => {
        for (const bit of [0, 1] as const) {
            for (let j = k + 1; j < N; j++) picks[j] = null;
            picks[k] = bit;

            const nextK = k + 1;
            const nextPes = pes + (bit === 1 ? ITEMS[k].p : 0);
            const nextVal = val + (bit === 1 ? ITEMS[k].v : 0);
            const nextSvr = svr - ITEMS[k].v;

            // Pas de crida des del node pare (línia 4 o 6)
            steps.push({
                k,
                pes,
                val,
                svr,
                best,
                picks: [...picks],
                phase: bit === 0 ? "call0" : "call1",
                activeLine: bit === 0 ? 4 : 6,
                stack: [...stack],
                currentNode: prefix,
                visitedNodes: Array.from(visitedNodes),
                visitedEdges: [...visitedEdges],
                prunedNodes: { ...prunedNodes },
                leafValues: { ...leafValues },
                improvements: [...improvements],
            });

            const child = `${prefix}${bit}`;
            visitedNodes.add(child);
            visitedEdges.push([prefix, child]);
            const nextStack = [...stack, { k: nextK, pes: nextPes, val: nextVal }];

            if (nextPes > capacity) {
                prunedNodes[child] = "p1";
                steps.push({
                    k: nextK,
                    pes: nextPes,
                    val: nextVal,
                    svr: nextSvr,
                    best,
                    picks: [...picks],
                    phase: "prune1",
                    activeLine: 2,
                    stack: nextStack,
                    currentNode: child,
                    visitedNodes: Array.from(visitedNodes),
                    visitedEdges: [...visitedEdges],
                    prunedNodes: { ...prunedNodes },
                    leafValues: { ...leafValues },
                    improvements: [...improvements],
                });
            } else if (nextVal + nextSvr <= best) {
                prunedNodes[child] = "p2";
                steps.push({
                    k: nextK,
                    pes: nextPes,
                    val: nextVal,
                    svr: nextSvr,
                    best,
                    picks: [...picks],
                    phase: "prune2",
                    activeLine: 2,
                    stack: nextStack,
                    currentNode: child,
                    visitedNodes: Array.from(visitedNodes),
                    visitedEdges: [...visitedEdges],
                    prunedNodes: { ...prunedNodes },
                    leafValues: { ...leafValues },
                    improvements: [...improvements],
                });
            } else if (nextK === N) {
                if (nextVal > best) {
                    best = nextVal;
                    improvements.push({ bits: child, val: nextVal, pes: nextPes });
                }
                leafValues[child] = nextVal;
                steps.push({
                    k: N,
                    pes: nextPes,
                    val: nextVal,
                    svr: nextSvr,
                    best,
                    picks: [...picks],
                    phase: "base",
                    activeLine: 3,
                    stack: nextStack,
                    currentNode: child,
                    visitedNodes: Array.from(visitedNodes),
                    visitedEdges: [...visitedEdges],
                    prunedNodes: { ...prunedNodes },
                    leafValues: { ...leafValues },
                    improvements: [...improvements],
                });
            } else {
                steps.push({
                    k: nextK,
                    pes: nextPes,
                    val: nextVal,
                    svr: nextSvr,
                    best,
                    picks: [...picks],
                    phase: "check",
                    activeLine: 2,
                    stack: nextStack,
                    currentNode: child,
                    visitedNodes: Array.from(visitedNodes),
                    visitedEdges: [...visitedEdges],
                    prunedNodes: { ...prunedNodes },
                    leafValues: { ...leafValues },
                    improvements: [...improvements],
                });
                walk(nextK, nextPes, nextVal, nextSvr, child, nextStack);
            }
        }

        picks[k] = null;
    };

    walk(0, 0, 0, TOTAL_VAL, "", [{ k: 0, pes: 0, val: 0 }]);

    steps.push({
        k: 0,
        pes: 0,
        val: 0,
        svr: TOTAL_VAL,
        best,
        picks: Array(N).fill(null),
        phase: "done",
        activeLine: 8,
        stack: [],
        currentNode: null,
        visitedNodes: Array.from(visitedNodes),
        visitedEdges: [...visitedEdges],
        prunedNodes: { ...prunedNodes },
        leafValues: { ...leafValues },
        improvements: [...improvements],
    });

    return steps;
}

function buildTreeLayout(): {
    nodes: TreeNodePos[];
    edges: TreeEdge[];
    nodeMap: Map<string, TreeNodePos>;
    viewBox: string;
} {
    const nodes: TreeNodePos[] = [];
    const edges: TreeEdge[] = [];
    const levelY = [16, 52, 90, 128];
    const viewBox = "0 0 280 152";

    const place = (prefix: string, depth: number, x: number, dx: number) => {
        nodes.push({ id: prefix, x, y: levelY[depth], depth });
        if (depth < N) {
            const leftId = `${prefix}0`;
            const rightId = `${prefix}1`;
            edges.push({ u: prefix, v: leftId, bit: "0" });
            edges.push({ u: prefix, v: rightId, bit: "1" });
            place(leftId, depth + 1, x - dx, dx / 2);
            place(rightId, depth + 1, x + dx, dx / 2);
        }
    };

    place("", 0, 140, 64);
    const nodeMap = new Map<string, TreeNodePos>(nodes.map((nd) => [nd.id, nd]));
    return { nodes, edges, nodeMap, viewBox };
}

function isOnActivePath(currentNode: string | null, u: string, v: string): boolean {
    if (currentNode === null) return false;
    return currentNode.startsWith(v) && v.length === u.length + 1;
}

function getPrunedAncestor(nodeId: string, prunedNodes: Record<string, PruneKind>): PruneKind | null {
    for (const [prunedId, kind] of Object.entries(prunedNodes)) {
        if (nodeId.length > prunedId.length && nodeId.startsWith(prunedId)) {
            return kind;
        }
    }
    return null;
}

export default function KnapsackVisualizer() {
    const [capacity, setCapacity] = useState<4 | 5>(5);
    const [stepIdx, setStepIdx] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const steps = useMemo(() => buildSteps(capacity), [capacity]);
    const tree = useMemo(() => buildTreeLayout(), []);
    const reachableSet = useMemo(() => {
        const set = new Set<string>();
        for (const st of steps) {
            if (st.currentNode !== null) set.add(st.currentNode);
        }
        return set;
    }, [steps]);

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
        }, 700);

        return () => clearInterval(interval);
    }, [isPlaying, steps.length]);

    const handleSelectCapacity = (nextC: 4 | 5) => {
        setIsPlaying(false);
        setCapacity(nextC);
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
        const targetIdx = steps.findIndex((st) => st.currentNode === nodeId);
        if (targetIdx !== -1) {
            setIsPlaying(false);
            setStepIdx(targetIdx);
        }
    };

    const isPrune1 = step.phase === "prune1";
    const isPrune2 = step.phase === "prune2";
    const isBase = step.phase === "base";
    const isDone = step.phase === "done";
    const isCall0 = step.phase === "call0";
    const isCall1 = step.phase === "call1";

    let highlightCls = "bg-sky-500/[0.12] border-sky-400";
    if (isCall1) {
        highlightCls = "bg-indigo-500/[0.14] border-indigo-400";
    } else if (isPrune1) {
        highlightCls = "bg-rose-500/[0.14] border-rose-400";
    } else if (isPrune2) {
        highlightCls = "bg-amber-500/[0.14] border-amber-400";
    } else if (isBase) {
        highlightCls = "bg-emerald-500/[0.14] border-emerald-400";
    } else if (isDone) {
        highlightCls = "bg-emerald-500/[0.08] border-emerald-500/50";
    }

    let inlineChip: { text: string; cls: string } | null = null;
    if (step.phase === "enter") {
        inlineChip = { text: `C=${capacity}, svr=${TOTAL_VAL}`, cls: "bg-sky-500/15 text-sky-300 border-sky-500/30" };
    } else if (isCall0) {
        inlineChip = {
            text: `0: svr→${step.svr - ITEMS[step.k].v}`,
            cls: "bg-sky-500/15 text-sky-300 border-sky-500/30",
        };
    } else if (isCall1) {
        inlineChip = {
            text: `1: p→${step.pes + ITEMS[step.k].p}, v→${step.val + ITEMS[step.k].v}`,
            cls: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
        };
    } else if (step.phase === "check") {
        inlineChip = {
            text: `${step.pes}≤${capacity}, ${step.val + step.svr}>${step.best}`,
            cls: "bg-sky-500/15 text-sky-300 border-sky-500/30",
        };
    } else if (isPrune1) {
        inlineChip = {
            text: `${step.pes}>${capacity}`,
            cls: "bg-rose-500/15 text-rose-300 border-rose-500/30",
        };
    } else if (isPrune2) {
        inlineChip = {
            text: `${step.val}+${step.svr}≤${step.best}`,
            cls: "bg-amber-500/15 text-amber-300 border-amber-500/30",
        };
    } else if (isBase) {
        inlineChip = {
            text: `best=${step.best}`,
            cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
        };
    } else if (isDone) {
        inlineChip = {
            text: `opt=${step.best}`,
            cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
        };
    }

    const codeLines: Array<{ idx: number; node: React.ReactNode }> = [
        {
            idx: 0,
            node: (
                <>
                    <span className="text-purple-400">void</span>{" "}
                    <span className="text-sky-300">motxilla</span>
                    <span className="text-slate-400">(</span>
                    <span className="text-purple-400">int</span>{" "}
                    <span className="text-slate-200">k</span>
                    <span className="text-slate-400">, </span>
                    <span className="text-purple-400">int</span>{" "}
                    <span className="text-slate-200">n</span>
                    <span className="text-slate-400">, </span>
                    <span className="text-purple-400">int</span>{" "}
                    <span className="text-slate-200">C</span>
                    <span className="text-slate-400">, </span>
                    <span className="text-purple-400">int</span>{" "}
                    <span className="text-slate-200">pes_act</span>
                    <span className="text-slate-400">,</span>
                </>
            ),
        },
        {
            idx: 1,
            node: (
                <>
                    {"    "}
                    <span className="text-purple-400">int</span>{" "}
                    <span className="text-slate-200">val_act</span>
                    <span className="text-slate-400">, </span>
                    <span className="text-purple-400">int</span>{" "}
                    <span className="text-slate-200">svr</span>
                    <span className="text-slate-400">, </span>
                    <span className="text-purple-400">int</span>
                    <span className="text-slate-400">&amp; millor_val) {"{"}</span>
                </>
            ),
        },
        {
            idx: 2,
            node: (
                <>
                    {"  "}
                    <span className="text-purple-400">if</span>{" "}
                    <span className="text-slate-400">(</span>
                    <span
                        className={`transition-all ${
                            isPrune1
                                ? "text-rose-300 font-bold"
                                : isPrune2
                                ? "opacity-35 text-slate-400"
                                : "text-rose-300/80"
                        }`}
                    >
                        pes_act &gt; C
                    </span>
                    <span className={isPrune1 || isPrune2 ? "opacity-35 text-slate-400" : "text-slate-400"}>
                        {" || "}
                    </span>
                    <span
                        className={`transition-all ${
                            isPrune2
                                ? "text-amber-300 font-bold"
                                : isPrune1
                                ? "opacity-35 text-slate-400"
                                : "text-amber-300/80"
                        }`}
                    >
                        val_act + svr &lt;= millor_val
                    </span>
                    <span className="text-slate-400">) </span>
                    <span
                        className={
                            isPrune1
                                ? "text-rose-300 font-bold"
                                : isPrune2
                                ? "text-amber-300 font-bold"
                                : "text-purple-400"
                        }
                    >
                        return
                    </span>
                    <span className="text-slate-400">;</span>
                </>
            ),
        },
        {
            idx: 3,
            node: (
                <>
                    {"  "}
                    <span className="text-purple-400">if</span>{" "}
                    <span className="text-slate-400">(k == n) {"{ "}</span>
                    <span className="text-emerald-300">millor_val</span>
                    <span className="text-slate-400"> = max(millor_val, val_act); </span>
                    <span className="text-purple-400">return</span>
                    <span className="text-slate-400">; {"}"}</span>
                </>
            ),
        },
        {
            idx: 4,
            node: (
                <>
                    {"  "}
                    <span className="text-sky-300">motxilla</span>
                    <span className="text-slate-400">(k + 1, n, C, pes_act, val_act,</span>
                </>
            ),
        },
        {
            idx: 5,
            node: (
                <>
                    {"      "}
                    <span className="text-slate-400">svr - v[k], millor_val);</span>
                </>
            ),
        },
        {
            idx: 6,
            node: (
                <>
                    {"  "}
                    <span className="text-indigo-300">motxilla</span>
                    <span className="text-slate-400">(k + 1, n, C, pes_act + p[k],</span>
                </>
            ),
        },
        {
            idx: 7,
            node: (
                <>
                    {"      "}
                    <span className="text-slate-400">val_act + v[k], svr - v[k], millor_val);</span>
                </>
            ),
        },
        {
            idx: 8,
            node: <span className="text-slate-400">{"}"}</span>,
        },
    ];

    const boundTotal = step.val + step.svr;
    const pesPct = Math.min(100, (step.pes / capacity) * 100);
    const valPct = (step.val / TOTAL_VAL) * 100;
    const svrPct = (step.svr / TOTAL_VAL) * 100;
    const bestPct = (step.best / TOTAL_VAL) * 100;

    return (
        <div className="w-full flex flex-col items-center justify-center gap-5 my-8 font-mono select-none not-prose px-1">
            {/* 1. FILA SUPERIOR COMPACTA: CAPACITAT C=4 | C=5 + CONTROLS */}
            <div className="w-full max-w-[54rem] flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center bg-white/[0.04] p-0.5 rounded-lg border border-white/10">
                    <button
                        type="button"
                        onClick={() => handleSelectCapacity(4)}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                            capacity === 4
                                ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                                : "text-slate-400 hover:text-slate-200 border border-transparent"
                        }`}
                    >
                        C=4
                    </button>
                    <button
                        type="button"
                        onClick={() => handleSelectCapacity(5)}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                            capacity === 5
                                ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                                : "text-slate-400 hover:text-slate-200 border border-transparent"
                        }`}
                    >
                        C=5
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

            {/* 2. ZONA CENTRAL (SENSE FONS): CODI + BARRES B&B + OBJECTES + ARBRE */}
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
                                (isCall0 && line.idx === 5) ||
                                (isCall1 && line.idx === 7);
                            return (
                                <div
                                    key={`bb-line-${line.idx}`}
                                    style={{ height: LINE_H, lineHeight: `${LINE_H}px` }}
                                    className={`relative flex items-center whitespace-nowrap text-[9.5px] sm:text-[10px] transition-opacity duration-150 ${
                                        isActive ? "opacity-100" : "opacity-60"
                                    }`}
                                >
                                    <span className="font-mono whitespace-pre">{line.node}</span>
                                    {step.activeLine === line.idx && inlineChip && (
                                        <span
                                            className={`ml-1.5 px-1.5 py-[1px] rounded text-[9px] leading-tight font-bold border ${inlineChip.cls}`}
                                        >
                                            {inlineChip.text}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* DRETA: MEDIDORS DE PODA + OBJECTES + ARBRE */}
                <div className="w-full md:w-[272px] shrink-0 flex flex-col items-center gap-3">
                    {/* Barres visuals de Poda 1 (pes_act vs C) i Poda 2 (val_act + svr vs millor_val) */}
                    <div className="w-full flex flex-col gap-2 px-1">
                        {/* Barra Poda 1: Capacitat */}
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between text-[10px]">
                                <span className={isPrune1 ? "text-rose-300 font-bold" : "text-slate-400"}>
                                    pes={step.pes}/{capacity}
                                </span>
                                <span className={isPrune1 ? "text-rose-400 font-bold" : "text-slate-600"}>
                                    {isPrune1 ? `>${capacity}` : `≤${capacity}`}
                                </span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                                <div
                                    style={{ width: `${pesPct}%` }}
                                    className={`h-full rounded-full transition-all duration-200 ${
                                        isPrune1 ? "bg-rose-400" : "bg-sky-400/80"
                                    }`}
                                />
                            </div>
                        </div>

                        {/* Barra Poda 2: Fita optimista val_act + svr vs millor_val */}
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between text-[10px]">
                                <span className={isPrune2 ? "text-amber-300 font-bold" : "text-slate-400"}>
                                    {step.val}+{step.svr}={boundTotal}
                                </span>
                                <span className="text-emerald-400 font-bold">
                                    best={step.best}
                                </span>
                            </div>
                            <div className="relative w-full h-1.5 rounded-full bg-white/[0.06]">
                                <div className="flex h-full w-full rounded-full overflow-hidden">
                                    <div
                                        style={{ width: `${valPct}%` }}
                                        className={`h-full transition-all duration-200 ${
                                            isPrune2
                                                ? "bg-amber-400"
                                                : isBase
                                                ? "bg-emerald-400"
                                                : "bg-indigo-400"
                                        }`}
                                    />
                                    <div
                                        style={{ width: `${svrPct}%` }}
                                        className={`h-full transition-all duration-200 ${
                                            isPrune2 ? "bg-amber-400/35" : "bg-indigo-400/30"
                                        }`}
                                    />
                                </div>
                                {/* Marca vertical de millor_val */}
                                <div
                                    style={{ left: `${bestPct}%` }}
                                    className="absolute -top-0.5 -bottom-0.5 w-0.5 bg-emerald-400 rounded-full transition-all duration-200"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 3 objectes (p[k], v[k]) */}
                    <div className="flex items-center justify-center gap-1.5 w-full">
                        {ITEMS.map((item, idx) => {
                            const pick = step.picks[idx];
                            const isCurrent = !isDone && step.k === idx;
                            const isRemaining = !isDone && idx >= step.k;

                            let cls = "border border-dashed border-white/10 text-slate-500";
                            if (pick === 1) {
                                cls = isPrune1
                                    ? "bg-rose-500/15 border border-rose-400/60 text-rose-200"
                                    : isBase
                                    ? "bg-emerald-500/20 border border-emerald-400 text-emerald-200"
                                    : "bg-indigo-500/18 border border-indigo-400/60 text-indigo-200";
                            } else if (pick === 0) {
                                cls = "border border-white/5 text-slate-600 line-through opacity-45";
                            } else if (isCurrent) {
                                cls = "bg-sky-500/12 border border-sky-400/70 text-sky-200";
                            } else if (isRemaining) {
                                cls = "border border-dashed border-indigo-400/25 text-slate-400";
                            }

                            return (
                                <div
                                    key={`item-${idx}`}
                                    className={`px-2 py-1 rounded-lg flex flex-col items-center text-[9.5px] transition-all duration-150 ${cls}`}
                                >
                                    <span className="font-bold">p:{item.p}</span>
                                    <span className="opacity-80">v:{item.v}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Arbre binari Branch & Bound SVG */}
                    <svg
                        viewBox={tree.viewBox}
                        className="w-full max-w-[272px] h-auto overflow-visible font-mono"
                        aria-label="Arbre de cerca Branch and Bound per a la motxilla 0/1"
                    >
                        {/* Arestes */}
                        <g>
                            {tree.edges.map((edge) => {
                                const uNode = tree.nodeMap.get(edge.u)!;
                                const vNode = tree.nodeMap.get(edge.v)!;
                                const active = isOnActivePath(step.currentNode, edge.u, edge.v);
                                const isVisited = step.visitedEdges.some(
                                    ([eu, ev]) => eu === edge.u && ev === edge.v
                                );
                                const selfPrune = step.prunedNodes[edge.v];
                                const skipped = getPrunedAncestor(edge.v, step.prunedNodes) !== null;

                                let stroke = "#1e293b";
                                let strokeWidth = "1.2";
                                let dash = "2.5 2.5";
                                let opacity = 0.55;

                                if (skipped) {
                                    stroke = "#1e293b";
                                    strokeWidth = "1";
                                    dash = "2 3";
                                    opacity = 0.15;
                                } else if (active && selfPrune) {
                                    stroke = selfPrune === "p1" ? "#f43f5e" : "#fbbf24";
                                    strokeWidth = "2.2";
                                    dash = "none";
                                    opacity = 1;
                                } else if (active) {
                                    stroke =
                                        isBase && vNode.depth === N
                                            ? "#10b981"
                                            : edge.bit === "0"
                                            ? "#38bdf8"
                                            : "#818cf8";
                                    strokeWidth = "2.2";
                                    dash = "none";
                                    opacity = 1;
                                } else if (selfPrune) {
                                    stroke = selfPrune === "p1" ? "rgba(244,63,94,0.45)" : "rgba(251,191,36,0.45)";
                                    strokeWidth = "1.3";
                                    dash = "3 2";
                                    opacity = 0.85;
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
                                            fontWeight={active ? "bold" : "normal"}
                                            opacity={skipped ? 0.16 : 1}
                                            fill={
                                                active && selfPrune
                                                    ? selfPrune === "p1"
                                                        ? "#fda4af"
                                                        : "#fde68a"
                                                    : active
                                                    ? edge.bit === "0"
                                                        ? "#7dd3fc"
                                                        : "#a5b4fc"
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
                                const isLeaf = node.depth === N;
                                const leafVal = step.leafValues[node.id];
                                const isSolvedLeaf = isLeaf && leafVal !== undefined;
                                const selfPrune = step.prunedNodes[node.id];
                                const skipped = getPrunedAncestor(node.id, step.prunedNodes) !== null;
                                const isInStack =
                                    step.currentNode !== null && step.currentNode.startsWith(node.id);
                                const isVisited = step.visitedNodes.includes(node.id);
                                const isReachable = reachableSet.has(node.id);

                                let fill = "#090d16";
                                let stroke = "#334155";
                                let strokeWidth = "1.3";
                                let nodeOpacity = 1;

                                if (skipped) {
                                    fill = "#090d16";
                                    stroke = "#1e293b";
                                    nodeOpacity = 0.16;
                                } else if (isCurrent && selfPrune === "p1") {
                                    fill = "rgba(244, 63, 94, 0.28)";
                                    stroke = "#f43f5e";
                                    strokeWidth = "2.2";
                                } else if (isCurrent && selfPrune === "p2") {
                                    fill = "rgba(251, 191, 36, 0.25)";
                                    stroke = "#fbbf24";
                                    strokeWidth = "2.2";
                                } else if (isCurrent && isBase) {
                                    fill = "rgba(16, 185, 129, 0.28)";
                                    stroke = "#34d399";
                                    strokeWidth = "2.2";
                                } else if (isCurrent) {
                                    fill = isCall1 ? "rgba(129, 140, 248, 0.28)" : "rgba(56, 189, 248, 0.28)";
                                    stroke = isCall1 ? "#818cf8" : "#38bdf8";
                                    strokeWidth = "2.2";
                                } else if (selfPrune === "p1") {
                                    fill = "rgba(244, 63, 94, 0.14)";
                                    stroke = "rgba(244, 63, 94, 0.7)";
                                    strokeWidth = "1.6";
                                } else if (selfPrune === "p2") {
                                    fill = "rgba(251, 191, 36, 0.12)";
                                    stroke = "rgba(251, 191, 36, 0.7)";
                                    strokeWidth = "1.6";
                                } else if (isInStack) {
                                    fill = "rgba(129, 140, 248, 0.18)";
                                    stroke = "#818cf8";
                                    strokeWidth = "1.6";
                                } else if (isSolvedLeaf) {
                                    fill = "rgba(16, 185, 129, 0.16)";
                                    stroke = "#10b981";
                                    strokeWidth = "1.6";
                                } else if (isVisited) {
                                    fill = "#0f172a";
                                    stroke = "#475569";
                                }

                                const r = 7.5;
                                const ringStroke = selfPrune
                                    ? selfPrune === "p1"
                                        ? "#f43f5e"
                                        : "#fbbf24"
                                    : isBase
                                    ? "#34d399"
                                    : isCall1
                                    ? "#818cf8"
                                    : "#38bdf8";

                                return (
                                    <g
                                        key={`node-${node.id}`}
                                        onClick={() => isReachable && jumpToNode(node.id)}
                                        opacity={nodeOpacity}
                                        className={isReachable ? "cursor-pointer group" : "cursor-default"}
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
                                            className={`transition-all duration-150 ${
                                                isReachable ? "group-hover:stroke-sky-300" : ""
                                            }`}
                                        />

                                        {selfPrune && (
                                            <text
                                                x={node.x}
                                                y={node.y + 0.5}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                fontSize="9"
                                                fontWeight="bold"
                                                fill={selfPrune === "p1" ? "#fda4af" : "#fde68a"}
                                                className="select-none pointer-events-none"
                                            >
                                                ×
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
                                                    isCurrent && isBase
                                                        ? "#6ee7b7"
                                                        : isSolvedLeaf
                                                        ? "#34d399"
                                                        : selfPrune === "p1"
                                                        ? "#fb7185"
                                                        : selfPrune === "p2"
                                                        ? "#fbbf24"
                                                        : "#475569"
                                                }
                                                className="select-none pointer-events-none"
                                            >
                                                {isSolvedLeaf ? `v=${leafVal}` : node.id}
                                            </text>
                                        )}
                                    </g>
                                );
                            })}
                        </g>
                    </svg>
                </div>
            </div>

            {/* 3. PEU COMPACTE: PILA I MILLORS FITES TROBADES */}
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
                                <React.Fragment key={`stack-${frame.k}-${i}`}>
                                    <span
                                        className={`px-1.5 py-0.5 rounded text-[10.5px] font-medium border transition-colors ${
                                            isTop
                                                ? isPrune1
                                                    ? "bg-rose-500/20 border-rose-400/50 text-rose-300 font-bold"
                                                    : isPrune2
                                                    ? "bg-amber-500/20 border-amber-400/50 text-amber-300 font-bold"
                                                    : isBase
                                                    ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-300 font-bold"
                                                    : isCall1
                                                    ? "bg-indigo-500/20 border-indigo-400/40 text-indigo-200 font-bold"
                                                    : "bg-sky-500/20 border-sky-400/40 text-sky-200 font-bold"
                                                : "bg-indigo-500/10 border-indigo-500/20 text-indigo-300"
                                        }`}
                                    >
                                        m({frame.k},{frame.pes},{frame.val})
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
                    <span className="text-[11px] text-slate-500">millor:</span>
                    {step.improvements.length === 0 ? (
                        <span className="text-slate-600 text-[11px] px-1.5 py-0.5 rounded border border-white/5 bg-white/[0.01]">
                            0
                        </span>
                    ) : (
                        step.improvements.map((imp, idx) => {
                            const isNewest = isBase && idx === step.improvements.length - 1;
                            return (
                                <button
                                    key={`imp-${imp.bits}`}
                                    type="button"
                                    onClick={() => jumpToNode(imp.bits)}
                                    title={`${imp.bits} (${imp.pes}kg)`}
                                    className={`px-1.5 py-0.5 rounded text-[10.5px] font-medium border transition-all cursor-pointer ${
                                        isNewest
                                            ? "bg-emerald-500/25 border-emerald-400 text-emerald-200 font-bold scale-105"
                                            : "bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:border-emerald-400/60"
                                    }`}
                                >
                                    {imp.val}
                                </button>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
