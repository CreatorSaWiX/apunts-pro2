"use client";

import React, { useState, useEffect, useMemo } from "react";
import { m as motion } from "framer-motion";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

type GraphPresetId = "cycle" | "nocycle";
type Phase = "enter" | "choose" | "explore" | "base_true" | "base_false" | "unchoose" | "done_true" | "done_false";

interface GraphNode {
    id: number;
    x: number;
    y: number;
}

interface GraphPreset {
    id: GraphPresetId;
    label: string;
    n: number;
    nodes: GraphNode[];
    edges: [number, number][];
    adj: number[][];
    viewBox: string;
}

interface HamiltonStep {
    u: number;
    visitats: number;
    vis: boolean[];
    path: number[];
    phase: Phase;
    activeLine: number;
    targetV: number | null;
    activeEdge: [number, number] | null;
    closingEdge: [number, number] | null;
    unchooseEdge: [number, number] | null;
    foundCycle: boolean;
}

const PRESETS: Record<GraphPresetId, GraphPreset> = {
    cycle: {
        id: "cycle",
        label: "G₁ ✓",
        n: 5,
        nodes: [
            { id: 0, x: 42, y: 80 },
            { id: 1, x: 104, y: 26 },
            { id: 2, x: 198, y: 34 },
            { id: 3, x: 104, y: 134 },
            { id: 4, x: 198, y: 126 },
        ],
        edges: [
            [0, 1],
            [0, 3],
            [1, 2],
            [1, 4],
            [2, 3],
            [2, 4],
            [3, 4],
        ],
        adj: [
            [1, 3],
            [0, 2, 4],
            [1, 3, 4],
            [0, 2, 4],
            [1, 2, 3],
        ],
        viewBox: "0 0 240 160",
    },
    nocycle: {
        id: "nocycle",
        label: "G₂ ✗",
        n: 4,
        nodes: [
            { id: 0, x: 42, y: 80 },
            { id: 1, x: 118, y: 80 },
            { id: 2, x: 198, y: 34 },
            { id: 3, x: 198, y: 126 },
        ],
        edges: [
            [0, 1],
            [1, 2],
            [1, 3],
            [2, 3],
        ],
        adj: [
            [1],
            [0, 2, 3],
            [1, 3],
            [1, 2],
        ],
        viewBox: "0 0 240 160",
    },
};

const LINE_H = 21;

function sameUndirectedEdge(a: [number, number] | null, u: number, v: number): boolean {
    if (!a) return false;
    return (a[0] === u && a[1] === v) || (a[0] === v && a[1] === u);
}

function isEdgeOnPath(path: number[], u: number, v: number, closed: boolean): boolean {
    for (let i = 0; i < path.length - 1; i++) {
        if ((path[i] === u && path[i + 1] === v) || (path[i] === v && path[i + 1] === u)) {
            return true;
        }
    }
    if (closed && path.length > 1) {
        const last = path[path.length - 1];
        const first = path[0];
        if ((last === u && first === v) || (last === v && first === u)) {
            return true;
        }
    }
    return false;
}

function buildSteps(preset: GraphPreset): HamiltonStep[] {
    const steps: HamiltonStep[] = [];
    const { n, adj } = preset;
    const vis: boolean[] = Array(n).fill(false);
    vis[0] = true;
    const path: number[] = [0];

    const pushStep = (partial: Omit<HamiltonStep, "vis" | "path">) => {
        steps.push({
            ...partial,
            vis: [...vis],
            path: [...path],
        });
    };

    pushStep({
        u: 0,
        visitats: 1,
        phase: "enter",
        activeLine: 1,
        targetV: null,
        activeEdge: null,
        closingEdge: null,
        unchooseEdge: null,
        foundCycle: false,
    });

    const walk = (u: number, visitats: number): boolean => {
        for (const v of adj[u]) {
            if (vis[v]) continue;

            vis[v] = true;
            pushStep({
                u,
                visitats,
                phase: "choose",
                activeLine: 8,
                targetV: v,
                activeEdge: [u, v],
                closingEdge: null,
                unchooseEdge: null,
                foundCycle: false,
            });

            path.push(v);
            const nextVisitats = visitats + 1;

            if (nextVisitats === n) {
                const hasReturnEdge = adj[v].includes(0);
                if (hasReturnEdge) {
                    pushStep({
                        u: v,
                        visitats: nextVisitats,
                        phase: "base_true",
                        activeLine: 3,
                        targetV: 0,
                        activeEdge: null,
                        closingEdge: [v, 0],
                        unchooseEdge: null,
                        foundCycle: true,
                    });
                    return true;
                }

                pushStep({
                    u: v,
                    visitats: nextVisitats,
                    phase: "base_false",
                    activeLine: 4,
                    targetV: 0,
                    activeEdge: null,
                    closingEdge: [v, 0],
                    unchooseEdge: null,
                    foundCycle: false,
                });
            } else {
                pushStep({
                    u: v,
                    visitats: nextVisitats,
                    phase: "explore",
                    activeLine: 9,
                    targetV: null,
                    activeEdge: null,
                    closingEdge: null,
                    unchooseEdge: null,
                    foundCycle: false,
                });

                if (walk(v, nextVisitats)) {
                    return true;
                }
            }

            path.pop();
            vis[v] = false;
            pushStep({
                u,
                visitats,
                phase: "unchoose",
                activeLine: 10,
                targetV: v,
                activeEdge: null,
                closingEdge: null,
                unchooseEdge: [u, v],
                foundCycle: false,
            });
        }

        return false;
    };

    const ok = walk(0, 1);

    if (ok) {
        pushStep({
            u: 0,
            visitats: n,
            phase: "done_true",
            activeLine: 9,
            targetV: null,
            activeEdge: null,
            closingEdge: [path[path.length - 1], 0],
            unchooseEdge: null,
            foundCycle: true,
        });
    } else {
        pushStep({
            u: 0,
            visitats: 1,
            phase: "done_false",
            activeLine: 13,
            targetV: null,
            activeEdge: null,
            closingEdge: null,
            unchooseEdge: null,
            foundCycle: false,
        });
    }

    return steps;
}

export default function HamiltonVisualizer() {
    const [presetId, setPresetId] = useState<GraphPresetId>("cycle");
    const [stepIdx, setStepIdx] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const preset = PRESETS[presetId];
    const steps = useMemo(() => buildSteps(preset), [preset]);
    const step = steps[stepIdx] ?? steps[0];

    const nodeMap = useMemo(
        () => new Map<number, GraphNode>(preset.nodes.map((nd) => [nd.id, nd])),
        [preset]
    );

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

    const handleSelectPreset = (nextId: GraphPresetId) => {
        setIsPlaying(false);
        setPresetId(nextId);
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

    let highlightCls = "bg-sky-500/[0.12] border-sky-400";
    if (step.phase === "explore") {
        highlightCls = "bg-indigo-500/[0.14] border-indigo-400";
    } else if (step.phase === "base_true" || step.phase === "done_true") {
        highlightCls = "bg-emerald-500/[0.14] border-emerald-400";
    } else if (step.phase === "base_false" || step.phase === "done_false") {
        highlightCls = "bg-rose-500/[0.14] border-rose-400";
    } else if (step.phase === "unchoose") {
        highlightCls = "bg-amber-500/[0.14] border-amber-400";
    }

    let inlineChip: { text: string; cls: string } | null = null;
    if (step.phase === "enter") {
        inlineChip = { text: "u=0", cls: "bg-sky-500/15 text-sky-300 border-sky-500/30" };
    } else if (step.phase === "choose") {
        inlineChip = { text: `vis[${step.targetV}]=T`, cls: "bg-sky-500/15 text-sky-300 border-sky-500/30" };
    } else if (step.phase === "explore") {
        inlineChip = { text: `u→${step.u}`, cls: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30" };
    } else if (step.phase === "base_true") {
        inlineChip = { text: `${step.u}→0 ✓`, cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" };
    } else if (step.phase === "base_false") {
        inlineChip = { text: `${step.u}↛0 ✗`, cls: "bg-rose-500/15 text-rose-300 border-rose-500/30" };
    } else if (step.phase === "unchoose") {
        inlineChip = { text: `vis[${step.targetV}]=F`, cls: "bg-amber-500/15 text-amber-300 border-amber-500/30" };
    } else if (step.phase === "done_true") {
        inlineChip = { text: "true ✓", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" };
    } else if (step.phase === "done_false") {
        inlineChip = { text: "false ✗", cls: "bg-rose-500/15 text-rose-300 border-rose-500/30" };
    }

    const codeLines: Array<{ idx: number; node: React.ReactNode }> = [
        {
            idx: 0,
            node: (
                <>
                    <span className="text-purple-400">bool</span>{" "}
                    <span className="text-sky-300">hamilton</span>
                    <span className="text-slate-400">(</span>
                    <span className="text-purple-400">const</span>{" "}
                    <span className="text-slate-400">vector&lt;vector&lt;</span>
                    <span className="text-purple-400">int</span>
                    <span className="text-slate-400">&gt;&gt;&amp; G,</span>
                </>
            ),
        },
        {
            idx: 1,
            node: (
                <>
                    {"    "}
                    <span className="text-purple-400">int</span>{" "}
                    <span className="text-slate-200">u</span>
                    <span className="text-slate-400">, </span>
                    <span className="text-purple-400">int</span>{" "}
                    <span className="text-slate-200">visitats</span>
                    <span className="text-slate-400">, </span>
                    <span className="text-purple-400">int</span>{" "}
                    <span className="text-slate-200">n</span>
                    <span className="text-slate-400">, vector&lt;</span>
                    <span className="text-purple-400">bool</span>
                    <span className="text-slate-400">&gt;&amp; vis) {"{"}</span>
                </>
            ),
        },
        {
            idx: 2,
            node: (
                <>
                    {"  "}
                    <span className="text-purple-400">if</span>{" "}
                    <span className="text-slate-400">(visitats == n) {"{"}</span>
                </>
            ),
        },
        {
            idx: 3,
            node: (
                <>
                    {"    "}
                    <span className="text-purple-400">for</span>{" "}
                    <span className="text-slate-400">(</span>
                    <span className="text-purple-400">int</span>{" "}
                    <span className="text-slate-200">v : G[u]</span>
                    <span className="text-slate-400">) </span>
                    <span className="text-purple-400">if</span>{" "}
                    <span className="text-slate-400">(v == 0) </span>
                    <span className="text-emerald-300">return true</span>
                    <span className="text-slate-400">;</span>
                </>
            ),
        },
        {
            idx: 4,
            node: (
                <>
                    {"    "}
                    <span className="text-rose-300">return false</span>
                    <span className="text-slate-400">;</span>
                </>
            ),
        },
        {
            idx: 5,
            node: <span className="text-slate-400">{"  }"}</span>,
        },
        {
            idx: 6,
            node: (
                <>
                    {"  "}
                    <span className="text-purple-400">for</span>{" "}
                    <span className="text-slate-400">(</span>
                    <span className="text-purple-400">int</span>{" "}
                    <span className="text-slate-200">v : G[u]</span>
                    <span className="text-slate-400">) {"{"}</span>
                </>
            ),
        },
        {
            idx: 7,
            node: (
                <>
                    {"    "}
                    <span className="text-purple-400">if</span>{" "}
                    <span className="text-slate-400">(!vis[v]) {"{"}</span>
                </>
            ),
        },
        {
            idx: 8,
            node: (
                <>
                    {"      "}
                    <span className="text-sky-300">vis[v]</span>
                    <span className="text-slate-400"> = </span>
                    <span className="text-sky-300">true</span>
                    <span className="text-slate-400">;</span>
                </>
            ),
        },
        {
            idx: 9,
            node: (
                <>
                    {"      "}
                    <span className="text-purple-400">if</span>{" "}
                    <span className="text-slate-400">(</span>
                    <span className="text-indigo-300">hamilton</span>
                    <span className="text-slate-400">(G, v, visitats+1, n, vis)) </span>
                    <span className="text-emerald-300">return true</span>
                    <span className="text-slate-400">;</span>
                </>
            ),
        },
        {
            idx: 10,
            node: (
                <>
                    {"      "}
                    <span className="text-amber-300">vis[v]</span>
                    <span className="text-slate-400"> = </span>
                    <span className="text-amber-300">false</span>
                    <span className="text-slate-400">;</span>
                </>
            ),
        },
        {
            idx: 11,
            node: <span className="text-slate-400">{"    }"}</span>,
        },
        {
            idx: 12,
            node: <span className="text-slate-400">{"  }"}</span>,
        },
        {
            idx: 13,
            node: (
                <>
                    {"  "}
                    <span className="text-rose-300">return false</span>
                    <span className="text-slate-400">;</span>
                </>
            ),
        },
        {
            idx: 14,
            node: <span className="text-slate-400">{"}"}</span>,
        },
    ];

    const isCycleClosed = step.foundCycle;
    const isFailBase = step.phase === "base_false";
    const isDoneFalse = step.phase === "done_false";

    return (
        <div className="w-full flex flex-col items-center justify-center gap-5 my-8 font-mono select-none not-prose px-1">
            {/* 1. FILA SUPERIOR COMPACTA: PRESET + CONTROLS */}
            <div className="w-full max-w-[54rem] flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center bg-white/[0.04] p-0.5 rounded-lg border border-white/10">
                    {(["cycle", "nocycle"] as const).map((id) => {
                        const active = presetId === id;
                        return (
                            <button
                                key={id}
                                type="button"
                                onClick={() => handleSelectPreset(id)}
                                className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                                    active
                                        ? id === "cycle"
                                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                            : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                        : "text-slate-400 hover:text-slate-200 border border-transparent"
                                }`}
                            >
                                {PRESETS[id].label}
                            </button>
                        );
                    })}
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

            {/* 2. ZONA CENTRAL (SENSE FONS): CODI + VIS + GRAF */}
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
                                (step.phase === "enter" && line.idx === 0) ||
                                (step.phase === "base_true" && line.idx === 2) ||
                                (step.phase === "base_false" && line.idx === 2);
                            return (
                                <div
                                    key={`ham-line-${line.idx}`}
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

                {/* DRETA: VECTOR VIS[0..n-1] + GRAF SVG */}
                <div className="w-full md:w-[248px] shrink-0 flex flex-col items-center gap-4">
                    {/* Vector vis[0..n-1] + comptador visitats */}
                    <div className="flex items-start gap-1.5">
                        <span className="text-[11px] text-slate-500 mr-0.5 mt-1.5">vis:</span>

                        {step.vis.map((visited, idx) => {
                            const isCurrentU = !isDoneFalse && step.u === idx;
                            const isMarkedNow = step.phase === "choose" && step.targetV === idx;
                            const isUnmarkedNow = step.phase === "unchoose" && step.targetV === idx;

                            let boxCls = "bg-white/[0.02] border border-white/10 text-slate-500";
                            if (isCycleClosed) {
                                boxCls =
                                    "bg-emerald-500/20 border-2 border-emerald-400 text-emerald-200 font-bold";
                            } else if (isDoneFalse) {
                                boxCls =
                                    idx === 0
                                        ? "bg-rose-500/15 border border-rose-400/50 text-rose-300 font-bold"
                                        : "bg-white/[0.02] border border-white/10 text-slate-600";
                            } else if (isMarkedNow) {
                                boxCls =
                                    "bg-sky-500/25 border-2 border-sky-400 text-sky-100 font-bold scale-105 shadow-[0_0_10px_rgba(56,189,248,0.28)]";
                            } else if (isUnmarkedNow) {
                                boxCls =
                                    "bg-amber-500/20 border-2 border-amber-400 text-amber-200 font-bold scale-105 shadow-[0_0_10px_rgba(251,191,36,0.28)]";
                            } else if (isCurrentU) {
                                boxCls =
                                    "bg-sky-500/20 border-2 border-sky-400 text-sky-200 font-bold";
                            } else if (visited) {
                                boxCls =
                                    "bg-indigo-500/18 border border-indigo-400/50 text-indigo-300 font-bold";
                            }

                            return (
                                <div key={`ham-vis-${idx}`} className="flex flex-col items-center gap-0.5">
                                    <div
                                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] transition-all duration-150 ${boxCls}`}
                                    >
                                        {visited ? "T" : "F"}
                                    </div>
                                    <span
                                        className={`text-[8.5px] ${
                                            isCurrentU
                                                ? "text-sky-300 font-bold"
                                                : visited
                                                ? "text-indigo-300"
                                                : "text-slate-500"
                                        }`}
                                    >
                                        [{idx}]
                                    </span>
                                </div>
                            );
                        })}

                        <span
                            className={`ml-1 mt-1 px-1.5 py-0.5 rounded border text-[10px] font-bold ${
                                step.visitats === preset.n
                                    ? isFailBase
                                        ? "bg-rose-500/15 border-rose-400/40 text-rose-300"
                                        : "bg-emerald-500/15 border-emerald-400/40 text-emerald-300"
                                    : "bg-white/[0.03] border-white/10 text-slate-400"
                            }`}
                        >
                            {step.visitats}/{preset.n}
                        </span>
                    </div>

                    {/* Graf SVG sense fons */}
                    <svg
                        viewBox={preset.viewBox}
                        className="w-full max-w-[240px] h-auto overflow-visible font-mono"
                        aria-label="Cicle Hamiltonià sobre graf"
                    >
                        {/* Arestes del graf */}
                        <g>
                            {preset.edges.map(([u, v]) => {
                                const uNode = nodeMap.get(u)!;
                                const vNode = nodeMap.get(v)!;

                                const onPath = isEdgeOnPath(step.path, u, v, isCycleClosed);
                                const isActiveChoose = sameUndirectedEdge(step.activeEdge, u, v);
                                const isUnchoosing = sameUndirectedEdge(step.unchooseEdge, u, v);
                                const isClosingSuccess =
                                    isCycleClosed && sameUndirectedEdge(step.closingEdge, u, v);

                                let stroke = "#334155";
                                let strokeWidth = "1.5";
                                let dash = "none";

                                if (isClosingSuccess || (isCycleClosed && onPath)) {
                                    stroke = "#34d399";
                                    strokeWidth = "2.6";
                                } else if (isUnchoosing) {
                                    stroke = "#fbbf24";
                                    strokeWidth = "2.4";
                                    dash = "3 2.5";
                                } else if (isActiveChoose) {
                                    stroke = "#38bdf8";
                                    strokeWidth = "2.6";
                                } else if (onPath) {
                                    stroke = "#38bdf8";
                                    strokeWidth = "2.3";
                                }

                                return (
                                    <line
                                        key={`ham-edge-${u}-${v}`}
                                        x1={uNode.x}
                                        y1={uNode.y}
                                        x2={vNode.x}
                                        y2={vNode.y}
                                        stroke={stroke}
                                        strokeWidth={strokeWidth}
                                        strokeDasharray={dash}
                                        className="transition-all duration-200"
                                    />
                                );
                            })}

                            {/* Aresta virtual fallida quan visitats == n i no hi ha retorn a 0 */}
                            {isFailBase && step.closingEdge && (() => {
                                const fromNode = nodeMap.get(step.closingEdge[0])!;
                                const toNode = nodeMap.get(0)!;
                                const midX = (fromNode.x + toNode.x) / 2;
                                const midY = (fromNode.y + toNode.y) / 2;
                                return (
                                    <g>
                                        <line
                                            x1={fromNode.x}
                                            y1={fromNode.y}
                                            x2={toNode.x}
                                            y2={toNode.y}
                                            stroke="#f87171"
                                            strokeWidth="2"
                                            strokeDasharray="4 3"
                                        />
                                        <text
                                            x={midX}
                                            y={midY}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            fontSize="11"
                                            fontWeight="bold"
                                            fill="#fca5a5"
                                        >
                                            ✕
                                        </text>
                                    </g>
                                );
                            })()}
                        </g>

                        {/* Vèrtexs del graf */}
                        <g>
                            {preset.nodes.map((node) => {
                                const isVisited = step.vis[node.id];
                                const isCurrent = !isDoneFalse && step.u === node.id;
                                const isTarget = step.phase === "choose" && step.targetV === node.id;
                                const isOrigin = node.id === 0;

                                let fill = "#090d16";
                                let stroke = "#475569";
                                let strokeWidth = "1.5";
                                let textFill = "#94a3b8";

                                if (isCycleClosed) {
                                    fill = "rgba(16, 185, 129, 0.24)";
                                    stroke = "#34d399";
                                    strokeWidth = "2.2";
                                    textFill = "#6ee7b7";
                                } else if (isDoneFalse && isOrigin) {
                                    fill = "rgba(248, 113, 113, 0.2)";
                                    stroke = "#f87171";
                                    strokeWidth = "2.2";
                                    textFill = "#fca5a5";
                                } else if (isFailBase && isCurrent) {
                                    fill = "rgba(248, 113, 113, 0.24)";
                                    stroke = "#f87171";
                                    strokeWidth = "2.4";
                                    textFill = "#ffffff";
                                } else if (isTarget) {
                                    fill = "rgba(56, 189, 248, 0.28)";
                                    stroke = "#38bdf8";
                                    strokeWidth = "2.4";
                                    textFill = "#ffffff";
                                } else if (isCurrent) {
                                    fill = "rgba(56, 189, 248, 0.24)";
                                    stroke = "#38bdf8";
                                    strokeWidth = "2.4";
                                    textFill = "#ffffff";
                                } else if (isVisited) {
                                    fill = "rgba(129, 140, 248, 0.18)";
                                    stroke = "#818cf8";
                                    strokeWidth = "1.8";
                                    textFill = "#c7d2fe";
                                }

                                return (
                                    <g key={`ham-node-${node.id}`}>
                                        {isOrigin && (
                                            <circle
                                                cx={node.x}
                                                cy={node.y}
                                                r="18"
                                                fill="none"
                                                stroke={isCycleClosed ? "#34d399" : "#475569"}
                                                strokeWidth="1"
                                                strokeDasharray="2 2"
                                                className="opacity-70"
                                            />
                                        )}

                                        <circle
                                            cx={node.x}
                                            cy={node.y}
                                            r="14"
                                            fill={fill}
                                            stroke={stroke}
                                            strokeWidth={strokeWidth}
                                            className="transition-all duration-200"
                                        />

                                        <text
                                            x={node.x}
                                            y={node.y + 0.5}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            fontSize="11"
                                            fontWeight="bold"
                                            fill={textFill}
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
            </div>

            {/* 3. PEU COMPACTE: CAMÍ ACTUAL I ESTAT DE RETORN */}
            <div className="w-full max-w-[54rem] flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
                <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-slate-500">camí:</span>
                    {isDoneFalse ? (
                        <span className="text-rose-300 text-[11px] px-1.5 py-0.5 rounded border border-rose-500/30 bg-rose-500/15 font-bold">
                            ∅
                        </span>
                    ) : (
                        <>
                            {step.path.map((v, i) => {
                                const isLast = i === step.path.length - 1;
                                return (
                                    <React.Fragment key={`ham-path-${v}-${i}`}>
                                        <span
                                            className={`px-1.5 py-0.5 rounded text-[10.5px] font-medium border transition-colors ${
                                                isCycleClosed
                                                    ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-300 font-bold"
                                                    : isFailBase && isLast
                                                    ? "bg-rose-500/20 border-rose-400/40 text-rose-300 font-bold"
                                                    : isLast
                                                    ? "bg-sky-500/20 border-sky-400/40 text-sky-200 font-bold"
                                                    : "bg-indigo-500/10 border-indigo-500/20 text-indigo-300"
                                            }`}
                                        >
                                            {v}
                                        </span>
                                        {i < step.path.length - 1 && (
                                            <span className="text-slate-600 text-[10px]">→</span>
                                        )}
                                    </React.Fragment>
                                );
                            })}

                            {isCycleClosed && (
                                <>
                                    <span className="text-emerald-400 text-[10px]">→</span>
                                    <span className="px-1.5 py-0.5 rounded text-[10.5px] font-bold border bg-emerald-500/25 border-emerald-400 text-emerald-200">
                                        0 ✓
                                    </span>
                                </>
                            )}

                            {isFailBase && (
                                <>
                                    <span className="text-rose-400 text-[10px]">↛</span>
                                    <span className="px-1.5 py-0.5 rounded text-[10.5px] font-bold border bg-rose-500/20 border-rose-400/50 text-rose-300">
                                        0 ✗
                                    </span>
                                </>
                            )}
                        </>
                    )}
                </div>

                {inlineChip && (
                    <span
                        className={`px-2 py-0.5 rounded text-[10.5px] font-bold border ${inlineChip.cls}`}
                    >
                        {inlineChip.text}
                    </span>
                )}
            </div>
        </div>
    );
}
