"use client";

import React, { useState, useEffect, useId, useMemo } from "react";
import { m as motion } from "framer-motion";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

type Phase = "enter" | "set0" | "call0" | "set1" | "call1" | "base" | "done";
type ActivePart = "full" | "assign" | "call";

interface SubsetSolution {
    bits: string;
    label: string;
}

interface SubsetsStep {
    idx: number;
    s: (0 | 1 | null)[];
    phase: Phase;
    activeLine: number;
    activePart: ActivePart;
    chosenIdx: number | null;
    stack: number[];
    currentNode: string | null;
    visitedNodes: string[];
    visitedEdges: [string, string][];
    solutions: SubsetSolution[];
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

const ELEMENTS = ["a", "b", "c"] as const;
const LINE_H = 24;

function formatSubset(s: (0 | 1 | null)[]): string {
    const picked: string[] = [];
    for (let i = 0; i < s.length; i++) {
        if (s[i] === 1) picked.push(ELEMENTS[i]);
    }
    return picked.length === 0 ? "∅" : `{${picked.join(",")}}`;
}

function buildSteps(n: 2 | 3): SubsetsStep[] {
    const steps: SubsetsStep[] = [];
    const s: (0 | 1 | null)[] = Array(n).fill(null);
    const visitedNodes = new Set<string>([""]);
    const visitedEdges: [string, string][] = [];
    const solutions: SubsetSolution[] = [];

    steps.push({
        idx: 0,
        s: [...s],
        phase: "enter",
        activeLine: 0,
        activePart: "full",
        chosenIdx: null,
        stack: [0],
        currentNode: "",
        visitedNodes: Array.from(visitedNodes),
        visitedEdges: [...visitedEdges],
        solutions: [...solutions],
    });

    const walk = (idx: number, prefix: string, stack: number[]) => {
        for (const bit of [0, 1] as const) {
            for (let j = idx + 1; j < n; j++) s[j] = null;
            s[idx] = bit;

            const setPhase: Phase = bit === 0 ? "set0" : "set1";
            const callPhase: Phase = bit === 0 ? "call0" : "call1";
            const line = bit === 0 ? 5 : 6;

            steps.push({
                idx,
                s: [...s],
                phase: setPhase,
                activeLine: line,
                activePart: "assign",
                chosenIdx: idx,
                stack: [...stack],
                currentNode: prefix,
                visitedNodes: Array.from(visitedNodes),
                visitedEdges: [...visitedEdges],
                solutions: [...solutions],
            });

            const child = `${prefix}${bit}`;
            visitedNodes.add(child);
            visitedEdges.push([prefix, child]);
            const nextStack = [...stack, idx + 1];

            if (idx + 1 === n) {
                solutions.push({ bits: child, label: formatSubset(s) });
                steps.push({
                    idx: n,
                    s: [...s],
                    phase: "base",
                    activeLine: 2,
                    activePart: "full",
                    chosenIdx: null,
                    stack: nextStack,
                    currentNode: child,
                    visitedNodes: Array.from(visitedNodes),
                    visitedEdges: [...visitedEdges],
                    solutions: [...solutions],
                });
            } else {
                steps.push({
                    idx: idx + 1,
                    s: [...s],
                    phase: callPhase,
                    activeLine: line,
                    activePart: "call",
                    chosenIdx: null,
                    stack: nextStack,
                    currentNode: child,
                    visitedNodes: Array.from(visitedNodes),
                    visitedEdges: [...visitedEdges],
                    solutions: [...solutions],
                });
                walk(idx + 1, child, nextStack);
            }
        }

        s[idx] = null;
    };

    walk(0, "", [0]);

    steps.push({
        idx: 0,
        s: Array(n).fill(null),
        phase: "done",
        activeLine: 7,
        activePart: "full",
        chosenIdx: null,
        stack: [],
        currentNode: null,
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
    const levelY = n === 2 ? [18, 60, 104] : [16, 52, 90, 128];
    const viewBox = n === 2 ? "0 0 280 128" : "0 0 280 152";
    const startDx = n === 2 ? 56 : 64;

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

    place("", 0, 140, startDx);
    const nodeMap = new Map<string, TreeNodePos>(nodes.map((nd) => [nd.id, nd]));
    return { nodes, edges, nodeMap, viewBox };
}

function isOnActivePath(currentNode: string | null, u: string, v: string): boolean {
    if (currentNode === null) return false;
    return currentNode.startsWith(v) && v.length === u.length + 1;
}

export default function SubsetsVisualizer() {
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
        const targetIdx = steps.findIndex((st) => st.currentNode === nodeId);
        if (targetIdx !== -1) {
            setStepIdx(targetIdx);
        }
    };

    // Color de la barra activa al codi segons l'operació
    let highlightCls = "bg-sky-500/[0.12] border-sky-400";
    if (step.phase === "set1" || step.phase === "call1") {
        highlightCls = "bg-indigo-500/[0.14] border-indigo-400";
    } else if (step.phase === "base") {
        highlightCls = "bg-emerald-500/[0.14] border-emerald-400";
    } else if (step.phase === "done") {
        highlightCls = "bg-emerald-500/[0.08] border-emerald-500/50";
    }

    // Xip mínim al costat de la línia activa
    let inlineChip: { text: string; cls: string } | null = null;
    if (step.phase === "enter") {
        inlineChip = { text: "idx=0", cls: "bg-sky-500/15 text-sky-300 border-sky-500/30" };
    } else if (step.phase === "set0") {
        inlineChip = { text: `s[${step.idx}]=0`, cls: "bg-sky-500/15 text-sky-300 border-sky-500/30" };
    } else if (step.phase === "call0") {
        inlineChip = { text: `idx→${step.idx}`, cls: "bg-sky-500/15 text-sky-300 border-sky-500/30" };
    } else if (step.phase === "set1") {
        inlineChip = { text: `s[${step.idx}]=1`, cls: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30" };
    } else if (step.phase === "call1") {
        inlineChip = { text: `idx→${step.idx}`, cls: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30" };
    } else if (step.phase === "base") {
        inlineChip = {
            text: formatSubset(step.s),
            cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
        };
    } else if (step.phase === "done") {
        inlineChip = { text: `2^${n}=${1 << n}`, cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" };
    }

    const renderBranchLine = (lineIdx: 5 | 6, bit: 0 | 1) => {
        const isAssign = step.activeLine === lineIdx && step.activePart === "assign";
        const isCall = step.activeLine === lineIdx && step.activePart === "call";
        const varCls = bit === 0 ? "text-sky-300" : "text-indigo-300";
        const callCls = bit === 0 ? "text-sky-200" : "text-indigo-200";

        return (
            <>
                {"    "}
                <span className={isCall ? "opacity-45 transition-opacity" : "transition-opacity"}>
                    <span className={varCls}>s[idx]</span>
                    <span className="text-slate-400"> = </span>
                    <span className={`${varCls} font-bold`}>{bit}</span>
                    <span className="text-slate-400">;</span>
                </span>{" "}
                <span className={isAssign ? "opacity-45 transition-opacity" : "transition-opacity"}>
                    <span className={callCls}>subconjunts</span>
                    <span className="text-slate-400">(s, idx + 1, n);</span>
                </span>
            </>
        );
    };

    const codeLines: Array<{ idx: number; node: React.ReactNode }> = [
        {
            idx: 0,
            node: (
                <>
                    <span className="text-purple-400">void</span>{" "}
                    <span className="text-sky-300">subconjunts</span>
                    <span className="text-slate-400">(vector&lt;</span>
                    <span className="text-purple-400">int</span>
                    <span className="text-slate-400">&gt;&amp; s, </span>
                    <span className="text-purple-400">int</span>{" "}
                    <span className="text-slate-200">idx</span>
                    <span className="text-slate-400">, </span>
                    <span className="text-purple-400">int</span>{" "}
                    <span className="text-slate-200">n</span>
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
                    <span className="text-slate-400">(idx == n) {"{"}</span>
                </>
            ),
        },
        {
            idx: 2,
            node: (
                <>
                    {"        "}
                    <span className="text-emerald-300">processar</span>
                    <span className="text-slate-400">(s);</span>
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
            node: renderBranchLine(5, 0),
        },
        {
            idx: 6,
            node: renderBranchLine(6, 1),
        },
        {
            idx: 7,
            node: <span className="text-slate-400">{"}"}</span>,
        },
    ];

    const isBase = step.phase === "base";
    const isDone = step.phase === "done";
    const hasAnyDecision = step.s.some((v) => v !== null);
    const liveSubset = hasAnyDecision ? formatSubset(step.s) : "·";

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

            {/* 2. ZONA CENTRAL (SENSE FONS): CODI + VECTOR DE BITS/BIJECCIÓ + ARBRE */}
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
                                    key={`sub-line-${line.idx}`}
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

                {/* DRETA: VECTOR s + BIJECCIÓ {a, b, c} + ARBRE BINARI CLICABLE */}
                <div className="w-full md:w-[288px] shrink-0 flex flex-col items-center gap-4">
                    {/* Vector s[0..n-1] amb l'element associat damunt cada bit */}
                    <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-slate-500 mr-0.5 mt-1">s:</span>

                        {step.s.map((val, i) => {
                            const isAssignedHere = step.chosenIdx === i;
                            const isPointer = !isDone && step.idx === i;
                            const isDecided = val !== null;

                            let elemCls = "text-slate-600/40 border-transparent";
                            if (val === 1) {
                                elemCls = isBase
                                    ? "text-emerald-200 bg-emerald-500/25 border-emerald-400/60"
                                    : "text-emerald-300 bg-emerald-500/15 border-emerald-500/40";
                            } else if (val === 0) {
                                elemCls = "text-slate-600 line-through border-transparent opacity-50";
                            }

                            let cellCls = "border border-dashed border-slate-700/70 text-slate-600";
                            if (isBase) {
                                cellCls =
                                    val === 1
                                        ? "bg-emerald-500/20 border-2 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(52,211,153,0.28)]"
                                        : "bg-slate-800/40 border-2 border-emerald-500/50 text-slate-400";
                            } else if (isAssignedHere && val === 0) {
                                cellCls =
                                    "bg-sky-500/25 border-2 border-sky-400 text-sky-100 scale-105 shadow-[0_0_12px_rgba(56,189,248,0.28)]";
                            } else if (isAssignedHere && val === 1) {
                                cellCls =
                                    "bg-indigo-500/25 border-2 border-indigo-400 text-indigo-100 scale-105 shadow-[0_0_12px_rgba(129,140,248,0.3)]";
                            } else if (isPointer) {
                                cellCls = "bg-sky-500/10 border-2 border-sky-400/70 text-sky-200";
                            } else if (isDecided) {
                                cellCls =
                                    val === 1
                                        ? "bg-indigo-500/15 border border-indigo-400/45 text-indigo-200"
                                        : "bg-sky-500/10 border border-sky-500/35 text-sky-300";
                            }

                            return (
                                <div key={`bit-slot-${i}`} className="flex flex-col items-center gap-1">
                                    <span
                                        className={`px-1.5 py-[1px] rounded text-[9.5px] font-bold border transition-all duration-150 ${elemCls}`}
                                    >
                                        {ELEMENTS[i]}
                                    </span>

                                    <div
                                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-200 ${cellCls}`}
                                    >
                                        {val !== null ? val : "·"}
                                    </div>

                                    <span className="text-[9.5px] text-slate-500">[{i}]</span>

                                    <div className="h-4 flex items-center justify-center">
                                        {isPointer && (
                                            <motion.span
                                                layoutId={`idx-ptr-${uid}`}
                                                transition={{ type: "spring", stiffness: 420, damping: 30 }}
                                                className={`text-[9.5px] font-bold whitespace-nowrap ${
                                                    step.phase === "set1" ? "text-indigo-300" : "text-sky-400"
                                                }`}
                                            >
                                                ▲ idx
                                            </motion.span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Posició límit [n] per al cas base (idx == n) */}
                        <div className="flex flex-col items-center gap-1">
                            <span className="h-[17px]" />
                            <div
                                className={`w-9 h-9 rounded-xl border border-dashed flex items-center justify-center text-[10px] font-bold transition-all duration-200 ${
                                    step.idx === n
                                        ? "border-emerald-400 bg-emerald-500/15 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.22)]"
                                        : "border-white/[0.07] text-slate-700"
                                }`}
                            >
                                n
                            </div>
                            <span className="text-[9.5px] text-slate-600">[{n}]</span>
                            <div className="h-4 flex items-center justify-center">
                                {!isDone && step.idx === n && (
                                    <motion.span
                                        layoutId={`idx-ptr-${uid}`}
                                        transition={{ type: "spring", stiffness: 420, damping: 30 }}
                                        className="text-[9.5px] font-bold text-emerald-400 whitespace-nowrap"
                                    >
                                        ▲ idx
                                    </motion.span>
                                )}
                            </div>
                        </div>

                        {/* Subconjunt resultant en temps real (bijecció) */}
                        <div className="flex flex-col items-center gap-1 ml-1">
                            <span className="h-[17px]" />
                            <span
                                className={`px-2 h-9 rounded-xl border flex items-center justify-center text-[11px] font-bold transition-all duration-200 ${
                                    isBase
                                        ? "bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(52,211,153,0.25)]"
                                        : isDone
                                        ? "border-white/[0.06] text-slate-600"
                                        : "bg-white/[0.02] border-white/10 text-slate-400"
                                }`}
                            >
                                {isDone ? "·" : liveSubset}
                            </span>
                            <span className="h-[14px]" />
                            <span className="h-4" />
                        </div>
                    </div>

                    {/* Arbre binari de decisions (SVG transparent i clicable) */}
                    <svg
                        viewBox={tree.viewBox}
                        className="w-full max-w-[280px] h-auto overflow-visible font-mono"
                        aria-label="Arbre de recursió de subconjunts"
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

                                let stroke = "#1e293b";
                                let strokeWidth = "1.2";
                                let dash = "2.5 2.5";
                                let opacity = 0.65;

                                if (active) {
                                    stroke =
                                        isBase && vNode.depth === n
                                            ? "#10b981"
                                            : edge.bit === "0"
                                            ? "#38bdf8"
                                            : "#818cf8";
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
                                            fontWeight={active ? "bold" : "normal"}
                                            fill={
                                                active
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
                                const isLeaf = node.depth === n;
                                const isSolvedLeaf =
                                    isLeaf && step.solutions.some((sol) => sol.bits === node.id);
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
                                } else if (isCurrent) {
                                    const isOne = step.phase === "set1" || step.phase === "call1";
                                    fill = isOne
                                        ? "rgba(129, 140, 248, 0.28)"
                                        : "rgba(56, 189, 248, 0.28)";
                                    stroke = isOne ? "#818cf8" : "#38bdf8";
                                    strokeWidth = "2.2";
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

                                const r = n === 2 ? 9.5 : 7.5;
                                const ringStroke = isBase
                                    ? "#34d399"
                                    : step.phase === "set1" || step.phase === "call1"
                                    ? "#818cf8"
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

            {/* 3. PEU COMPACTE: PILA DE CRIDES I SUBCONJUNTS GENERATS */}
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
                                                    : step.phase === "set1" || step.phase === "call1"
                                                    ? "bg-indigo-500/20 border-indigo-400/40 text-indigo-200 font-bold"
                                                    : "bg-sky-500/20 border-sky-400/40 text-sky-200 font-bold"
                                                : "bg-indigo-500/10 border-indigo-500/20 text-indigo-300"
                                        }`}
                                    >
                                        s({frame})
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
                        step.solutions.map((sol, idx) => {
                            const isNewest = isBase && idx === step.solutions.length - 1;
                            return (
                                <button
                                    key={`sol-${sol.bits}`}
                                    type="button"
                                    onClick={() => jumpToNode(sol.bits)}
                                    title={sol.bits}
                                    className={`px-1.5 py-0.5 rounded text-[10.5px] font-medium border transition-all cursor-pointer ${
                                        isNewest
                                            ? "bg-emerald-500/25 border-emerald-400 text-emerald-200 font-bold scale-105"
                                            : "bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:border-emerald-400/60"
                                    }`}
                                >
                                    {sol.label}
                                </button>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
