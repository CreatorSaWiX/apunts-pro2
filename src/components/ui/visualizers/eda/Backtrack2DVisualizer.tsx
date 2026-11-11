"use client";

import React, { useState, useEffect, useId, useMemo } from "react";
import { m as motion } from "framer-motion";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

type Phase = "enter" | "choose" | "explore" | "wrap" | "arrive" | "base" | "unchoose" | "done";

interface Backtrack2DStep {
    i: number;
    j: number;
    v: number | null;
    M: number[][];
    phase: Phase;
    activeLine: number;
    cands: number[];
    stack: [number, number][];
    solutions: number[][][];
}

const N = 2;
const LINE_H = 24;
const CELL = 42;
const GAP = 8;
const STRIDE = CELL + GAP;

function cloneMatrix(M: number[][]): number[][] {
    return M.map((row) => [...row]);
}

function getValidCandidates(M: number[][], i: number, j: number): number[] {
    const valid: number[] = [];
    for (const v of [1, 2]) {
        const inRow = M[i].some((x, col) => col !== j && x === v);
        const inCol = M.some((row, r) => r !== i && row[j] === v);
        if (!inRow && !inCol) valid.push(v);
    }
    return valid;
}

function formatMatrixChip(M: number[][]): string {
    return M.map((row) => row.join("")).join("/");
}

function buildSteps(): Backtrack2DStep[] {
    const steps: Backtrack2DStep[] = [];
    const M: number[][] = [
        [0, 0],
        [0, 0],
    ];
    const solutions: number[][][] = [];

    steps.push({
        i: 0,
        j: 0,
        v: null,
        M: cloneMatrix(M),
        phase: "enter",
        activeLine: 0,
        cands: getValidCandidates(M, 0, 0),
        stack: [[0, 0]],
        solutions: [],
    });

    const walk = (i: number, j: number, stack: [number, number][]) => {
        if (i === N) {
            solutions.push(cloneMatrix(M));
            steps.push({
                i: N,
                j: 0,
                v: null,
                M: cloneMatrix(M),
                phase: "base",
                activeLine: 2,
                cands: [],
                stack: [...stack],
                solutions: solutions.map(cloneMatrix),
            });
            return;
        }

        if (j === N) {
            steps.push({
                i,
                j: N,
                v: null,
                M: cloneMatrix(M),
                phase: "wrap",
                activeLine: 3,
                cands: [],
                stack: [...stack],
                solutions: solutions.map(cloneMatrix),
            });

            const nextStack: [number, number][] = [...stack, [i + 1, 0]];
            if (i + 1 < N) {
                steps.push({
                    i: i + 1,
                    j: 0,
                    v: null,
                    M: cloneMatrix(M),
                    phase: "arrive",
                    activeLine: 4,
                    cands: getValidCandidates(M, i + 1, 0),
                    stack: nextStack,
                    solutions: solutions.map(cloneMatrix),
                });
            }
            walk(i + 1, 0, nextStack);
            return;
        }

        const cands = getValidCandidates(M, i, j);
        for (const v of cands) {
            M[i][j] = v;
            steps.push({
                i,
                j,
                v,
                M: cloneMatrix(M),
                phase: "choose",
                activeLine: 5,
                cands,
                stack: [...stack],
                solutions: solutions.map(cloneMatrix),
            });

            const nextStack: [number, number][] = [...stack, [i, j + 1]];
            if (j + 1 < N) {
                steps.push({
                    i,
                    j: j + 1,
                    v: null,
                    M: cloneMatrix(M),
                    phase: "explore",
                    activeLine: 6,
                    cands: getValidCandidates(M, i, j + 1),
                    stack: nextStack,
                    solutions: solutions.map(cloneMatrix),
                });
            }
            walk(i, j + 1, nextStack);

            M[i][j] = 0;
            steps.push({
                i,
                j,
                v,
                M: cloneMatrix(M),
                phase: "unchoose",
                activeLine: 7,
                cands,
                stack: [...stack],
                solutions: solutions.map(cloneMatrix),
            });
        }
    };

    walk(0, 0, [[0, 0]]);

    steps.push({
        i: 0,
        j: 0,
        v: null,
        M: [
            [0, 0],
            [0, 0],
        ],
        phase: "done",
        activeLine: 9,
        cands: [],
        stack: [],
        solutions: solutions.map(cloneMatrix),
    });

    return steps;
}

export default function Backtrack2DVisualizer() {
    const uid = useId();
    const [stepIdx, setStepIdx] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const steps = useMemo(() => buildSteps(), []);
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
    const isWrap = step.phase === "wrap";
    const isChoose = step.phase === "choose";
    const isExplore = step.phase === "explore";
    const isArrive = step.phase === "arrive";
    const isUnchoose = step.phase === "unchoose";
    const isDone = step.phase === "done";

    let highlightCls = "bg-sky-500/[0.12] border-sky-400";
    if (isExplore || isWrap || isArrive) {
        highlightCls = "bg-indigo-500/[0.14] border-indigo-400";
    } else if (isBase) {
        highlightCls = "bg-emerald-500/[0.14] border-emerald-400";
    } else if (isUnchoose) {
        highlightCls = "bg-amber-500/[0.14] border-amber-400";
    } else if (isDone) {
        highlightCls = "bg-emerald-500/[0.08] border-emerald-500/50";
    }

    let inlineChip: { text: string; cls: string } | null = null;
    if (step.phase === "enter") {
        inlineChip = { text: "(0,0)", cls: "bg-sky-500/15 text-sky-300 border-sky-500/30" };
    } else if (isChoose) {
        inlineChip = {
            text: `M[${step.i}][${step.j}]=${step.v}`,
            cls: "bg-sky-500/15 text-sky-300 border-sky-500/30",
        };
    } else if (isExplore) {
        inlineChip = {
            text: `(${step.i},${step.j})`,
            cls: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
        };
    } else if (isWrap) {
        inlineChip = {
            text: `(${step.i},${N})→(${step.i + 1},0)`,
            cls: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
        };
    } else if (isArrive) {
        inlineChip = {
            text: `(${step.i},0)`,
            cls: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
        };
    } else if (isBase) {
        inlineChip = {
            text: formatMatrixChip(step.M),
            cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
        };
    } else if (isUnchoose) {
        inlineChip = {
            text: `M[${step.i}][${step.j}]=0`,
            cls: "bg-amber-500/15 text-amber-300 border-amber-500/30",
        };
    } else if (isDone) {
        inlineChip = { text: "✓", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" };
    }

    const codeLines: Array<{ idx: number; node: React.ReactNode }> = [
        {
            idx: 0,
            node: (
                <>
                    <span className="text-purple-400">void</span>{" "}
                    <span className="text-sky-300">backtrack_2d</span>
                    <span className="text-slate-400">(vector&lt;vector&lt;</span>
                    <span className="text-purple-400">int</span>
                    <span className="text-slate-400">&gt;&gt;&amp; M,</span>
                </>
            ),
        },
        {
            idx: 1,
            node: (
                <>
                    {"    "}
                    <span className="text-purple-400">int</span>{" "}
                    <span className="text-slate-200">i</span>
                    <span className="text-slate-400">, </span>
                    <span className="text-purple-400">int</span>{" "}
                    <span className="text-slate-200">j</span>
                    <span className="text-slate-400">, </span>
                    <span className="text-purple-400">int</span>{" "}
                    <span className="text-slate-200">n</span>
                    <span className="text-slate-400">) {"{"}</span>
                </>
            ),
        },
        {
            idx: 2,
            node: (
                <>
                    {"  "}
                    <span className="text-purple-400">if</span>{" "}
                    <span className="text-slate-400">(i == n) {"{ "}</span>
                    <span className="text-emerald-300">processar</span>
                    <span className="text-slate-400">(M); </span>
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
                    <span className="text-purple-400">if</span>{" "}
                    <span className="text-slate-400">(j == n) {"{ "}</span>
                    <span className="text-indigo-300">backtrack_2d</span>
                    <span className="text-slate-400">(M, i + 1, 0, n); </span>
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
                    <span className="text-purple-400">for</span>{" "}
                    <span className="text-slate-400">(</span>
                    <span className="text-purple-400">int</span>{" "}
                    <span className="text-slate-200">v : candidats_valids</span>
                    <span className="text-slate-400">(M, i, j)) {"{"}</span>
                </>
            ),
        },
        {
            idx: 5,
            node: (
                <>
                    {"    "}
                    <span className="text-sky-300">M[i][j]</span>
                    <span className="text-slate-400"> = v;</span>
                </>
            ),
        },
        {
            idx: 6,
            node: (
                <>
                    {"    "}
                    <span className="text-indigo-300">backtrack_2d</span>
                    <span className="text-slate-400">(M, i, j + 1, n);</span>
                </>
            ),
        },
        {
            idx: 7,
            node: (
                <>
                    {"    "}
                    <span className="text-amber-300">M[i][j]</span>
                    <span className="text-slate-400"> = 0;</span>
                </>
            ),
        },
        {
            idx: 8,
            node: <span className="text-slate-400">{"  }"}</span>,
        },
        {
            idx: 9,
            node: <span className="text-slate-400">{"}"}</span>,
        },
    ];

    // Coordenades de la fletxa de salt quan j == n (de (i, n) a (i+1, 0))
    const wrapStartX = 2 * STRIDE + CELL / 2;
    const wrapStartY = step.i * STRIDE + CELL / 2;
    const wrapEndX = CELL / 2;
    const wrapEndY = (step.i + 1) * STRIDE + CELL / 2;
    const wrapMidX = (wrapStartX + wrapEndX) / 2;
    const wrapMidY = (wrapStartY + wrapEndY) / 2 - 10;

    return (
        <div className="w-full flex flex-col items-center justify-center gap-5 my-8 font-mono select-none not-prose px-1">
            {/* 1. FILA SUPERIOR COMPACTA: COORDENADA ACTIVA + CONTROLS */}
            <div className="w-full max-w-[54rem] flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-[11px]">
                    <span
                        className={`px-2 py-0.5 rounded-md border transition-colors ${
                            isBase
                                ? "bg-emerald-500/15 border-emerald-400/40 text-emerald-300 font-bold"
                                : isWrap
                                ? "bg-indigo-500/15 border-indigo-400/40 text-indigo-300 font-bold"
                                : isUnchoose
                                ? "bg-amber-500/15 border-amber-400/40 text-amber-300 font-bold"
                                : isDone
                                ? "bg-white/[0.03] border-white/10 text-slate-500"
                                : "bg-sky-500/15 border-sky-500/30 text-sky-300 font-bold"
                        }`}
                    >
                        {isDone ? "n=2" : `(i,j)=(${step.i},${step.j})`}
                    </span>
                    {!isDone && step.cands.length > 0 && (
                        <span className="px-2 py-0.5 rounded-md border border-white/10 bg-white/[0.03] text-slate-400">
                            {`{${step.cands.join(",")}}`}
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

            {/* 2. ZONA CENTRAL (SENSE FONS): CODI + MATRIU M AMB LÍMITS j==n I i==n */}
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
                            const isActive =
                                step.activeLine === line.idx ||
                                (step.phase === "enter" && line.idx === 1);
                            return (
                                <div
                                    key={`b2d-line-${line.idx}`}
                                    style={{ height: LINE_H, lineHeight: `${LINE_H}px` }}
                                    className={`relative flex items-center whitespace-nowrap text-[10px] sm:text-[10.5px] transition-opacity duration-150 ${
                                        isActive ? "opacity-100" : "opacity-60"
                                    }`}
                                >
                                    <span className="font-mono whitespace-pre">{line.node}</span>
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

                {/* DRETA: MATRIU M[0..1][0..1] + CASELLES LÍMIT j==n I i==n */}
                <div className="w-full md:w-[220px] shrink-0 flex flex-col items-center gap-2">
                    {/* Etiquetes de columna j = 0, 1, n */}
                    <div className="flex items-center gap-2 pl-6">
                        {[0, 1].map((c) => (
                            <span
                                key={`col-h-${c}`}
                                style={{ width: CELL }}
                                className={`text-center text-[9.5px] transition-colors ${
                                    !isDone && step.j === c ? "text-sky-400 font-bold" : "text-slate-600"
                                }`}
                            >
                                j={c}
                            </span>
                        ))}
                        <span
                            style={{ width: CELL }}
                            className={`text-center text-[9.5px] transition-colors ${
                                isWrap ? "text-indigo-400 font-bold" : "text-slate-700"
                            }`}
                        >
                            j=n
                        </span>
                    </div>

                    {/* Matriu amb etiquetes de fila i = 0, 1, n */}
                    <div className="flex items-start gap-2">
                        {/* Etiquetes de fila */}
                        <div className="flex flex-col gap-2 w-4">
                            {[0, 1].map((r) => (
                                <span
                                    key={`row-h-${r}`}
                                    style={{ height: CELL, lineHeight: `${CELL}px` }}
                                    className={`text-right text-[9.5px] transition-colors ${
                                        !isDone && step.i === r
                                            ? isWrap
                                                ? "text-indigo-400 font-bold"
                                                : "text-sky-400 font-bold"
                                            : "text-slate-600"
                                    }`}
                                >
                                    i={r}
                                </span>
                            ))}
                            <span
                                style={{ height: CELL, lineHeight: `${CELL}px` }}
                                className={`text-right text-[9.5px] transition-colors ${
                                    isBase ? "text-emerald-400 font-bold" : "text-slate-700"
                                }`}
                            >
                                i=n
                            </span>
                        </div>

                        {/* Graella 3x3 (2x2 real + columna j==n + casella base i==n) */}
                        <div
                            className="relative"
                            style={{ width: 3 * CELL + 2 * GAP, height: 3 * CELL + 2 * GAP }}
                        >
                            <div className="grid grid-cols-3 gap-2">
                                {[0, 1].map((r) => (
                                    <React.Fragment key={`m-row-${r}`}>
                                        {[0, 1].map((c) => {
                                            const val = step.M[r][c];
                                            const isPointer = !isDone && step.i === r && step.j === c;
                                            const isFilled = val !== 0;

                                            let cls = "border border-dashed border-slate-700/70 text-slate-600";
                                            if (isBase) {
                                                cls =
                                                    "bg-emerald-500/20 border-2 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(52,211,153,0.28)]";
                                            } else if (isPointer && isUnchoose) {
                                                cls =
                                                    "bg-amber-500/20 border-2 border-amber-400 text-amber-200 scale-105 shadow-[0_0_12px_rgba(251,191,36,0.28)]";
                                            } else if (isPointer && isChoose) {
                                                cls =
                                                    "bg-sky-500/25 border-2 border-sky-400 text-white scale-105 shadow-[0_0_12px_rgba(56,189,248,0.3)]";
                                            } else if (isPointer) {
                                                cls =
                                                    "bg-sky-500/10 border-2 border-sky-400/75 text-sky-200";
                                            } else if (isFilled) {
                                                cls =
                                                    "bg-indigo-500/15 border border-indigo-400/45 text-indigo-200";
                                            }

                                            return (
                                                <div
                                                    key={`cell-${r}-${c}`}
                                                    style={{ width: CELL, height: CELL }}
                                                    className={`relative rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-200 ${cls}`}
                                                >
                                                    {isFilled ? val : "0"}
                                                    {isPointer && (
                                                        <motion.span
                                                            layoutId={`b2d-ptr-${uid}`}
                                                            transition={{ type: "spring", stiffness: 420, damping: 30 }}
                                                            className={`absolute -inset-1 rounded-[14px] border pointer-events-none ${
                                                                isUnchoose
                                                                    ? "border-amber-400/60"
                                                                    : "border-sky-400/60"
                                                            }`}
                                                        />
                                                    )}
                                                </div>
                                            );
                                        })}

                                        {/* Casella límit j == n al final de la fila r */}
                                        {(() => {
                                            const isHere = isWrap && step.i === r;
                                            return (
                                                <div
                                                    style={{ width: CELL, height: CELL }}
                                                    className={`relative rounded-xl border border-dashed flex items-center justify-center text-[10px] font-bold transition-all duration-200 ${
                                                        isHere
                                                            ? "bg-indigo-500/20 border-indigo-400 text-indigo-200 shadow-[0_0_12px_rgba(129,140,248,0.28)]"
                                                            : "border-white/[0.07] text-slate-700"
                                                    }`}
                                                >
                                                    j==n
                                                    {isHere && (
                                                        <motion.span
                                                            layoutId={`b2d-ptr-${uid}`}
                                                            transition={{ type: "spring", stiffness: 420, damping: 30 }}
                                                            className="absolute -inset-1 rounded-[14px] border border-indigo-400/70 pointer-events-none"
                                                        />
                                                    )}
                                                </div>
                                            );
                                        })()}
                                    </React.Fragment>
                                ))}

                                {/* Casella límit i == n a (2, 0) */}
                                <div
                                    style={{ width: CELL, height: CELL }}
                                    className={`relative rounded-xl border border-dashed flex items-center justify-center text-[10px] font-bold transition-all duration-200 ${
                                        isBase
                                            ? "bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(52,211,153,0.28)]"
                                            : "border-white/[0.07] text-slate-700"
                                    }`}
                                >
                                    i==n
                                    {isBase && (
                                        <motion.span
                                            layoutId={`b2d-ptr-${uid}`}
                                            transition={{ type: "spring", stiffness: 420, damping: 30 }}
                                            className="absolute -inset-1 rounded-[14px] border border-emerald-400/70 pointer-events-none"
                                        />
                                    )}
                                </div>
                                <div style={{ width: CELL, height: CELL }} />
                                <div style={{ width: CELL, height: CELL }} />
                            </div>

                            {/* Overlay SVG transparent per mostrar el salt de fila (i, n) ⤵ (i+1, 0) */}
                            <svg
                                viewBox={`0 0 ${3 * CELL + 2 * GAP} ${3 * CELL + 2 * GAP}`}
                                className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                            >
                                <defs>
                                    <marker
                                        id={`wrap-arrow-${uid}`}
                                        markerWidth="6"
                                        markerHeight="6"
                                        refX="5"
                                        refY="3"
                                        orient="auto"
                                    >
                                        <path d="M 0 0 L 6 3 L 0 6 z" fill="#818cf8" />
                                    </marker>
                                </defs>

                                {isWrap && (
                                    <path
                                        d={`M ${wrapStartX} ${wrapStartY + 14} Q ${wrapMidX} ${wrapMidY + 18} ${wrapEndX + 12} ${wrapEndY - 6}`}
                                        fill="none"
                                        stroke="#818cf8"
                                        strokeWidth="1.8"
                                        strokeDasharray="3 2"
                                        markerEnd={`url(#wrap-arrow-${uid})`}
                                    />
                                )}
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. PEU COMPACTE: PILA (i,j) I MATRIUS PROCESSADES */}
            <div className="w-full max-w-[54rem] flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
                <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-slate-500">pila:</span>
                    {step.stack.length === 0 ? (
                        <span className="text-slate-600 text-[11px] px-1.5 py-0.5 rounded border border-white/5 bg-white/[0.01]">
                            ·
                        </span>
                    ) : (
                        step.stack.map(([fi, fj], idx) => {
                            const isTop = idx === step.stack.length - 1;
                            return (
                                <React.Fragment key={`stack-${fi}-${fj}-${idx}`}>
                                    <span
                                        className={`px-1.5 py-0.5 rounded text-[10.5px] font-medium border transition-colors ${
                                            isTop
                                                ? isBase
                                                    ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-300 font-bold"
                                                    : isWrap || isExplore || isArrive
                                                    ? "bg-indigo-500/20 border-indigo-400/40 text-indigo-200 font-bold"
                                                    : isUnchoose
                                                    ? "bg-amber-500/20 border-amber-400/40 text-amber-300 font-bold"
                                                    : "bg-sky-500/20 border-sky-400/40 text-sky-200 font-bold"
                                                : "bg-indigo-500/10 border-indigo-500/20 text-indigo-300"
                                        }`}
                                    >
                                        ({fi},{fj})
                                    </span>
                                    {idx < step.stack.length - 1 && (
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
                        step.solutions.map((mat, idx) => {
                            const isNewest = isBase && idx === step.solutions.length - 1;
                            return (
                                <button
                                    key={`sol-${idx}`}
                                    type="button"
                                    onClick={() => jumpToSolution(idx)}
                                    className={`px-1.5 py-0.5 rounded text-[10.5px] font-medium border transition-all cursor-pointer ${
                                        isNewest
                                            ? "bg-emerald-500/25 border-emerald-400 text-emerald-200 font-bold scale-105"
                                            : "bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:border-emerald-400/60"
                                    }`}
                                >
                                    {formatMatrixChip(mat)}
                                </button>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
