"use client";

import React, { useState, useEffect, useMemo } from "react";
import { m as motion } from "framer-motion";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Crown } from "lucide-react";

type Phase = "enter" | "choose" | "explore" | "base" | "pruned" | "unchoose" | "done";

interface NQueensStep {
    i: number;
    j: number | null;
    d1: number | null;
    d2: number | null;
    queens: number[]; // queens[row] = col per a files 0..queens.length-1
    mc: boolean[];
    md1: boolean[];
    md2: boolean[];
    phase: Phase;
    activeLine: number;
    stack: number[];
    total: number;
    solutions: number[][];
}

const LINE_H = 22;

function formatSol(q: number[]): string {
    return `[${q.join(",")}]`;
}

function buildSteps(n: 3 | 4): NQueensStep[] {
    const steps: NQueensStep[] = [];
    const diagSize = 2 * n - 1;
    const mc = Array<boolean>(n).fill(false);
    const md1 = Array<boolean>(diagSize).fill(false);
    const md2 = Array<boolean>(diagSize).fill(false);
    const queens: number[] = [];
    const solutions: number[][] = [];
    let foundCount = 0;

    steps.push({
        i: 0,
        j: null,
        d1: null,
        d2: null,
        queens: [],
        mc: [...mc],
        md1: [...md1],
        md2: [...md2],
        phase: "enter",
        activeLine: 0,
        stack: [0],
        total: 0,
        solutions: [],
    });

    const walk = (i: number, stack: number[]): number => {
        let localTotal = 0;
        let placedAny = false;

        for (let j = 0; j < n; ++j) {
            const d1 = i + j;
            const d2 = i - j + n - 1;

            if (!mc[j] && !md1[d1] && !md2[d2]) {
                placedAny = true;
                mc[j] = md1[d1] = md2[d2] = true;
                queens.push(j);

                steps.push({
                    i,
                    j,
                    d1,
                    d2,
                    queens: [...queens],
                    mc: [...mc],
                    md1: [...md1],
                    md2: [...md2],
                    phase: "choose",
                    activeLine: 7,
                    stack: [...stack],
                    total: foundCount,
                    solutions: solutions.map((s) => [...s]),
                });

                const nextStack = [...stack, i + 1];

                if (i + 1 === n) {
                    localTotal += 1;
                    foundCount += 1;
                    solutions.push([...queens]);

                    steps.push({
                        i: n,
                        j: null,
                        d1: null,
                        d2: null,
                        queens: [...queens],
                        mc: [...mc],
                        md1: [...md1],
                        md2: [...md2],
                        phase: "base",
                        activeLine: 2,
                        stack: nextStack,
                        total: foundCount,
                        solutions: solutions.map((s) => [...s]),
                    });
                } else {
                    steps.push({
                        i: i + 1,
                        j: null,
                        d1: null,
                        d2: null,
                        queens: [...queens],
                        mc: [...mc],
                        md1: [...md1],
                        md2: [...md2],
                        phase: "explore",
                        activeLine: 8,
                        stack: nextStack,
                        total: foundCount,
                        solutions: solutions.map((s) => [...s]),
                    });

                    localTotal += walk(i + 1, nextStack);
                }

                queens.pop();
                mc[j] = md1[d1] = md2[d2] = false;

                steps.push({
                    i,
                    j,
                    d1,
                    d2,
                    queens: [...queens],
                    mc: [...mc],
                    md1: [...md1],
                    md2: [...md2],
                    phase: "unchoose",
                    activeLine: 9,
                    stack: [...stack],
                    total: foundCount,
                    solutions: solutions.map((s) => [...s]),
                });
            }
        }

        if (!placedAny) {
            steps.push({
                i,
                j: null,
                d1: null,
                d2: null,
                queens: [...queens],
                mc: [...mc],
                md1: [...md1],
                md2: [...md2],
                phase: "pruned",
                activeLine: 6,
                stack: [...stack],
                total: foundCount,
                solutions: solutions.map((s) => [...s]),
            });
        }

        return localTotal;
    };

    const total = walk(0, [0]);

    steps.push({
        i: 0,
        j: null,
        d1: null,
        d2: null,
        queens: [],
        mc: Array<boolean>(n).fill(false),
        md1: Array<boolean>(diagSize).fill(false),
        md2: Array<boolean>(diagSize).fill(false),
        phase: "done",
        activeLine: 12,
        stack: [],
        total,
        solutions: solutions.map((s) => [...s]),
    });

    return steps;
}

export default function NQueensVisualizer() {
    const [n, setN] = useState<3 | 4>(4);
    const [stepIdx, setStepIdx] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [hoveredCell, setHoveredCell] = useState<{ r: number; c: number } | null>(null);

    const steps = useMemo(() => buildSteps(n), [n]);
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

    const handleSelectN = (nextN: 3 | 4) => {
        setIsPlaying(false);
        setHoveredCell(null);
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

    const jumpToSolution = (solIdx: number) => {
        setIsPlaying(false);
        let seen = -1;
        const targetIdx = steps.findIndex((st) => {
            if (st.phase === "base") {
                seen += 1;
                return seen === solIdx;
            }
            return false;
        });
        if (targetIdx !== -1) setStepIdx(targetIdx);
    };

    const isBase = step.phase === "base";
    const isPruned = step.phase === "pruned";
    const isChoose = step.phase === "choose";
    const isUnchoose = step.phase === "unchoose";
    const isDone = step.phase === "done";

    let highlightCls = "bg-sky-500/[0.12] border-sky-400";
    if (step.phase === "explore") {
        highlightCls = "bg-indigo-500/[0.14] border-indigo-400";
    } else if (isBase) {
        highlightCls = "bg-emerald-500/[0.14] border-emerald-400";
    } else if (isPruned) {
        highlightCls = "bg-rose-500/[0.14] border-rose-400";
    } else if (isUnchoose) {
        highlightCls = "bg-amber-500/[0.14] border-amber-400";
    } else if (isDone) {
        highlightCls = "bg-emerald-500/[0.08] border-emerald-500/50";
    }

    let inlineChip: { text: string; cls: string } | null = null;
    if (step.phase === "enter") {
        inlineChip = { text: "i=0", cls: "bg-sky-500/15 text-sky-300 border-sky-500/30" };
    } else if (isChoose) {
        inlineChip = {
            text: `(${step.i},${step.j}) d1=${step.d1} d2=${step.d2}`,
            cls: "bg-sky-500/15 text-sky-300 border-sky-500/30",
        };
    } else if (step.phase === "explore") {
        inlineChip = { text: `i→${step.i}`, cls: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30" };
    } else if (isBase) {
        inlineChip = {
            text: formatSol(step.queens),
            cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
        };
    } else if (isPruned) {
        inlineChip = {
            text: `i=${step.i} ✕`,
            cls: "bg-rose-500/15 text-rose-300 border-rose-500/30",
        };
    } else if (isUnchoose) {
        inlineChip = {
            text: `(${step.i},${step.j})→F`,
            cls: "bg-amber-500/15 text-amber-300 border-amber-500/30",
        };
    } else if (isDone) {
        inlineChip = {
            text: `${step.total}`,
            cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
        };
    }

    // Cel·la inspeccionada (hover del ratolí té prioritat, si no la cel·la del pas actual)
    const focusCell =
        hoveredCell ??
        (step.j !== null && step.i < n ? { r: step.i, c: step.j } : null);
    const focusD1 = focusCell ? focusCell.r + focusCell.c : null;
    const focusD2 = focusCell ? focusCell.r - focusCell.c + n - 1 : null;

    const codeLines: Array<{ idx: number; node: React.ReactNode }> = [
        {
            idx: 0,
            node: (
                <>
                    <span className="text-purple-400">int</span>{" "}
                    <span className="text-sky-300">reines</span>
                    <span className="text-slate-400">(</span>
                    <span className="text-purple-400">int</span>{" "}
                    <span className="text-slate-200">i</span>
                    <span className="text-slate-400">, </span>
                    <span className="text-purple-400">int</span>{" "}
                    <span className="text-slate-200">n</span>
                    <span className="text-slate-400">, vector&lt;</span>
                    <span className="text-purple-400">bool</span>
                    <span className="text-slate-400">&gt;&amp; mc,</span>
                </>
            ),
        },
        {
            idx: 1,
            node: (
                <>
                    {"    "}
                    <span className="text-slate-400">vector&lt;</span>
                    <span className="text-purple-400">bool</span>
                    <span className="text-slate-400">&gt;&amp; md1, vector&lt;</span>
                    <span className="text-purple-400">bool</span>
                    <span className="text-slate-400">&gt;&amp; md2) {"{"}</span>
                </>
            ),
        },
        {
            idx: 2,
            node: (
                <>
                    {"  "}
                    <span className="text-purple-400">if</span>{" "}
                    <span className="text-slate-400">(i == n) </span>
                    <span className="text-emerald-300">return 1</span>
                    <span className="text-slate-400">;</span>
                </>
            ),
        },
        {
            idx: 3,
            node: (
                <>
                    {"  "}
                    <span className="text-purple-400">int</span>{" "}
                    <span className="text-slate-200">total = 0</span>
                    <span className="text-slate-400">;</span>
                </>
            ),
        },
        {
            idx: 4,
            node: (
                <>
                    {"  "}
                    <span className="text-purple-400">for</span>{" "}
                    <span className="text-slate-400">(</span>
                    <span className="text-purple-400">int</span>{" "}
                    <span className="text-slate-200">j = 0</span>
                    <span className="text-slate-400">; j &lt; n; ++j) {"{"}</span>
                </>
            ),
        },
        {
            idx: 5,
            node: (
                <>
                    {"    "}
                    <span className="text-purple-400">int</span>{" "}
                    <span className="text-indigo-300">d1</span>
                    <span className="text-slate-400"> = i + j, </span>
                    <span className="text-purple-300">d2</span>
                    <span className="text-slate-400"> = i - j + n - 1;</span>
                </>
            ),
        },
        {
            idx: 6,
            node: (
                <>
                    {"    "}
                    <span className="text-purple-400">if</span>{" "}
                    <span className="text-slate-400">(!</span>
                    <span className="text-sky-300">mc[j]</span>
                    <span className="text-slate-400"> &amp;&amp; !</span>
                    <span className="text-indigo-300">md1[d1]</span>
                    <span className="text-slate-400"> &amp;&amp; !</span>
                    <span className="text-purple-300">md2[d2]</span>
                    <span className="text-slate-400">) {"{"}</span>
                </>
            ),
        },
        {
            idx: 7,
            node: (
                <>
                    {"      "}
                    <span className="text-sky-300">mc[j]</span>
                    <span className="text-slate-400"> = </span>
                    <span className="text-indigo-300">md1[d1]</span>
                    <span className="text-slate-400"> = </span>
                    <span className="text-purple-300">md2[d2]</span>
                    <span className="text-slate-400"> = </span>
                    <span className="text-sky-300">true</span>
                    <span className="text-slate-400">;</span>
                    <span className={`ml-2 ${step.activeLine === 7 ? "text-sky-400/90" : "text-slate-600"}`}>
                        {"// Choose"}
                    </span>
                </>
            ),
        },
        {
            idx: 8,
            node: (
                <>
                    {"      "}
                    <span className="text-slate-200">total += </span>
                    <span className="text-indigo-300">reines</span>
                    <span className="text-slate-400">(i + 1, n, mc, md1, md2);</span>
                </>
            ),
        },
        {
            idx: 9,
            node: (
                <>
                    {"      "}
                    <span className="text-amber-300">mc[j]</span>
                    <span className="text-slate-400"> = </span>
                    <span className="text-amber-300">md1[d1]</span>
                    <span className="text-slate-400"> = </span>
                    <span className="text-amber-300">md2[d2]</span>
                    <span className="text-slate-400"> = </span>
                    <span className="text-amber-300">false</span>
                    <span className="text-slate-400">;</span>
                    <span className={`ml-1.5 ${step.activeLine === 9 ? "text-amber-400/90" : "text-slate-600"}`}>
                        {"// Un-choose"}
                    </span>
                </>
            ),
        },
        {
            idx: 10,
            node: <span className="text-slate-400">{"    }"}</span>,
        },
        {
            idx: 11,
            node: <span className="text-slate-400">{"  }"}</span>,
        },
        {
            idx: 12,
            node: (
                <>
                    {"  "}
                    <span className="text-purple-400">return</span>{" "}
                    <span className="text-emerald-300">total</span>
                    <span className="text-slate-400">;</span>
                </>
            ),
        },
        {
            idx: 13,
            node: <span className="text-slate-400">{"}"}</span>,
        },
    ];

    const diagCount = 2 * n - 1;

    return (
        <div className="w-full flex flex-col items-center justify-center gap-5 my-8 font-mono select-none not-prose px-1">
            {/* 1. FILA SUPERIOR COMPACTA: n=3 | n=4 + CONTROLS */}
            <div className="w-full max-w-[54rem] flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center bg-white/[0.04] p-0.5 rounded-lg border border-white/10">
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
                    <button
                        type="button"
                        onClick={() => handleSelectN(4)}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                            n === 4
                                ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                                : "text-slate-400 hover:text-slate-200 border border-transparent"
                        }`}
                    >
                        n=4
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

            {/* 2. ZONA CENTRAL (SENSE FONS): CODI + TAULER n×n I VECTORS DE PODA */}
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
                                (isChoose && line.idx === 5);
                            return (
                                <div
                                    key={`nq-line-${line.idx}`}
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

                {/* DRETA: TAULER n×n + VECTORS mc, md1, md2 */}
                <div className="w-full md:w-[248px] shrink-0 flex flex-col items-center gap-3.5">
                    {/* Graella n×n transparent */}
                    <div
                        className="flex flex-col items-center gap-1"
                        onMouseLeave={() => setHoveredCell(null)}
                    >
                        {/* Capçalera de columnes j */}
                        <div className="flex items-center gap-1 pl-5">
                            {Array.from({ length: n }, (_, j) => (
                                <span
                                    key={`col-lbl-${j}`}
                                    className={`w-9 text-center text-[9px] transition-colors ${
                                        focusCell?.c === j ? "text-sky-400 font-bold" : "text-slate-600"
                                    }`}
                                >
                                    j={j}
                                </span>
                            ))}
                        </div>

                        {Array.from({ length: n }, (_, r) => {
                            const isCurrentRow = !isDone && step.i === r;
                            return (
                                <div key={`row-${r}`} className="flex items-center gap-1">
                                    <span
                                        className={`w-4 text-right text-[9px] transition-colors ${
                                            isCurrentRow
                                                ? isPruned
                                                    ? "text-rose-400 font-bold"
                                                    : "text-sky-400 font-bold"
                                                : focusCell?.r === r
                                                ? "text-slate-300 font-bold"
                                                : "text-slate-600"
                                        }`}
                                    >
                                        {r}
                                    </span>

                                    {Array.from({ length: n }, (_, c) => {
                                        const hasQueen = step.queens[r] === c;
                                        const d1 = r + c;
                                        const d2 = r - c + n - 1;
                                        const isAttacked = step.mc[c] || step.md1[d1] || step.md2[d2];

                                        const isActiveFocus = focusCell?.r === r && focusCell?.c === c;
                                        const sameCol = focusCell !== null && focusCell.c === c;
                                        const sameD1 = focusD1 !== null && d1 === focusD1;
                                        const sameD2 = focusD2 !== null && d2 === focusD2;
                                        const inFocusRay = !isActiveFocus && (sameCol || sameD1 || sameD2);

                                        const isPlacedNow = isChoose && step.i === r && step.j === c;
                                        const isRemovedNow = isUnchoose && step.i === r && step.j === c;
                                        const isPrunedCell = isPruned && step.i === r;
                                        const isCandidateRow = !isDone && step.i === r && !hasQueen;

                                        const isDarkSquare = (r + c) % 2 === 1;
                                        let cellCls = isDarkSquare
                                            ? "bg-white/[0.03] border-white/[0.08] text-slate-600"
                                            : "bg-transparent border-white/[0.06] text-slate-600";

                                        if (isBase && hasQueen) {
                                            cellCls =
                                                "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.28)]";
                                        } else if (isPlacedNow) {
                                            cellCls =
                                                "bg-sky-500/25 border-sky-400 text-sky-200 scale-105 shadow-[0_0_12px_rgba(56,189,248,0.3)]";
                                        } else if (isRemovedNow) {
                                            cellCls =
                                                "bg-amber-500/20 border-amber-400 text-amber-300 scale-105 shadow-[0_0_10px_rgba(251,191,36,0.25)]";
                                        } else if (hasQueen) {
                                            cellCls =
                                                "bg-indigo-500/18 border-indigo-400/60 text-indigo-200";
                                        } else if (isPrunedCell) {
                                            cellCls = "bg-rose-500/12 border-rose-500/40 text-rose-400/80";
                                        } else if (isActiveFocus && hoveredCell) {
                                            cellCls = isAttacked
                                                ? "bg-rose-500/15 border-rose-400/70 text-rose-300"
                                                : "bg-sky-500/15 border-sky-400/70 text-sky-300";
                                        } else if (inFocusRay) {
                                            cellCls = sameCol
                                                ? "bg-sky-500/[0.08] border-sky-500/25 text-sky-400/60"
                                                : sameD1
                                                ? "bg-indigo-500/[0.08] border-indigo-500/25 text-indigo-400/60"
                                                : "bg-purple-500/[0.08] border-purple-500/25 text-purple-400/60";
                                        } else if (isCandidateRow && isAttacked) {
                                            cellCls = "bg-rose-500/[0.04] border-white/[0.07] text-rose-400/45";
                                        }

                                        return (
                                            <div
                                                key={`sq-${r}-${c}`}
                                                onMouseEnter={() => setHoveredCell({ r, c })}
                                                className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all duration-150 cursor-crosshair ${cellCls}`}
                                            >
                                                {hasQueen ? (
                                                    <Crown size={14} strokeWidth={2.2} />
                                                ) : isRemovedNow ? (
                                                    <span className="text-[11px] font-bold">×</span>
                                                ) : isPrunedCell || (isCandidateRow && isAttacked) ? (
                                                    <span className="text-[10px]">×</span>
                                                ) : isCandidateRow && !isAttacked ? (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60" />
                                                ) : (
                                                    <span className="text-[9px] opacity-25">·</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>

                    {/* Vectors de marcatge O(1): mc, md1 (↗), md2 (↘) */}
                    <div className="flex flex-col items-end gap-1.5 w-full pr-1">
                        {/* mc[0..n-1] */}
                        <div className="flex items-center gap-1">
                            <span className="text-[9.5px] text-sky-400/80 mr-1">mc:</span>
                            {step.mc.map((used, idx) => {
                                const isFocused = focusCell?.c === idx;
                                let cls = "border-white/10 bg-white/[0.02] text-slate-600";
                                if (isFocused && isUnchoose) {
                                    cls = "border-amber-400 bg-amber-500/20 text-amber-200 font-bold";
                                } else if (isFocused && hoveredCell && used) {
                                    cls = "border-rose-400 bg-rose-500/20 text-rose-200 font-bold";
                                } else if (isFocused) {
                                    cls = "border-sky-400 bg-sky-500/25 text-sky-100 font-bold";
                                } else if (used) {
                                    cls = "border-sky-500/40 bg-sky-500/12 text-sky-300 font-bold";
                                }
                                return (
                                    <div key={`mc-${idx}`} className="flex flex-col items-center">
                                        <span
                                            className={`w-5 h-5 rounded border flex items-center justify-center text-[9px] transition-colors ${cls}`}
                                        >
                                            {used ? "T" : "F"}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* md1[0..2n-2] (↗ i+j) */}
                        <div className="flex items-center gap-0.5">
                            <span className="text-[9.5px] text-indigo-400/80 mr-1">md1↗:</span>
                            {Array.from({ length: diagCount }, (_, idx) => {
                                const used = step.md1[idx];
                                const isFocused = focusD1 === idx;
                                let cls = "border-white/10 bg-white/[0.02] text-slate-600";
                                if (isFocused && isUnchoose) {
                                    cls = "border-amber-400 bg-amber-500/20 text-amber-200 font-bold";
                                } else if (isFocused && hoveredCell && used) {
                                    cls = "border-rose-400 bg-rose-500/20 text-rose-200 font-bold";
                                } else if (isFocused) {
                                    cls = "border-indigo-400 bg-indigo-500/25 text-indigo-100 font-bold";
                                } else if (used) {
                                    cls = "border-indigo-500/40 bg-indigo-500/12 text-indigo-300 font-bold";
                                }
                                return (
                                    <span
                                        key={`md1-${idx}`}
                                        title={`d1=${idx}`}
                                        className={`w-[19px] h-[19px] rounded border flex items-center justify-center text-[8.5px] transition-colors ${cls}`}
                                    >
                                        {used ? "T" : "F"}
                                    </span>
                                );
                            })}
                        </div>

                        {/* md2[0..2n-2] (↘ i-j+n-1) */}
                        <div className="flex items-center gap-0.5">
                            <span className="text-[9.5px] text-purple-400/80 mr-1">md2↘:</span>
                            {Array.from({ length: diagCount }, (_, idx) => {
                                const used = step.md2[idx];
                                const isFocused = focusD2 === idx;
                                let cls = "border-white/10 bg-white/[0.02] text-slate-600";
                                if (isFocused && isUnchoose) {
                                    cls = "border-amber-400 bg-amber-500/20 text-amber-200 font-bold";
                                } else if (isFocused && hoveredCell && used) {
                                    cls = "border-rose-400 bg-rose-500/20 text-rose-200 font-bold";
                                } else if (isFocused) {
                                    cls = "border-purple-400 bg-purple-500/25 text-purple-100 font-bold";
                                } else if (used) {
                                    cls = "border-purple-500/40 bg-purple-500/12 text-purple-300 font-bold";
                                }
                                return (
                                    <span
                                        key={`md2-${idx}`}
                                        title={`d2=${idx}`}
                                        className={`w-[19px] h-[19px] rounded border flex items-center justify-center text-[8.5px] transition-colors ${cls}`}
                                    >
                                        {used ? "T" : "F"}
                                    </span>
                                );
                            })}
                        </div>

                        {/* Fòrmula viva de la cel·la inspeccionada */}
                        <div className="h-4 flex items-center justify-end text-[9.5px] text-slate-500">
                            {focusCell ? (
                                <span>
                                    <span className="text-sky-400">j={focusCell.c}</span>
                                    {" · "}
                                    <span className="text-indigo-400">d1={focusD1}</span>
                                    {" · "}
                                    <span className="text-purple-400">d2={focusD2}</span>
                                </span>
                            ) : (
                                <span className="text-slate-600">
                                    total={step.total}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. PEU COMPACTE: PILA DE CRIDES I SOLUCIONS TROBADES */}
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
                                                    : isPruned
                                                    ? "bg-rose-500/20 border-rose-400/50 text-rose-300 font-bold"
                                                    : isUnchoose
                                                    ? "bg-amber-500/20 border-amber-400/40 text-amber-300 font-bold"
                                                    : "bg-sky-500/20 border-sky-400/40 text-sky-200 font-bold"
                                                : "bg-indigo-500/10 border-indigo-500/20 text-indigo-300"
                                        }`}
                                    >
                                        r({frame})
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
                            {isDone ? "0" : "·"}
                        </span>
                    ) : (
                        step.solutions.map((sol, idx) => {
                            const isNewest = isBase && idx === step.solutions.length - 1;
                            return (
                                <button
                                    key={`sol-${sol.join("-")}`}
                                    type="button"
                                    onClick={() => jumpToSolution(idx)}
                                    className={`px-1.5 py-0.5 rounded text-[10.5px] font-medium border transition-all cursor-pointer ${
                                        isNewest
                                            ? "bg-emerald-500/25 border-emerald-400 text-emerald-200 font-bold scale-105"
                                            : "bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:border-emerald-400/60"
                                    }`}
                                >
                                    {formatSol(sol)}
                                </button>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
