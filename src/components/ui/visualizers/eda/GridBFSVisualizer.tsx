"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

// Graella 4x5
// S = (0, 0), T = (2, 4)
// # = parets/obstacles
const GRID_MAP = [
    ["S", ".", ".", "#", "."],
    [".", "#", ".", ".", "."],
    [".", "#", ".", "#", "T"],
    [".", ".", ".", ".", "."],
];

// Distàncies mínimes des de S
const DIST_MAP = [
    [0, 1, 2, -1, 4],
    [1, -1, 3, 4, 5],
    [2, -1, 4, -1, 6],
    [3, 4, 5, 6, 7],
];

// Camí mínim de S a T
const SHORTEST_PATH = [
    { r: 0, c: 0 },
    { r: 0, c: 1 },
    { r: 0, c: 2 },
    { r: 1, c: 2 },
    { r: 1, c: 3 },
    { r: 1, c: 4 },
    { r: 2, c: 4 },
];

export default function GridBFSVisualizer() {
    // Pas de BFS: 0 (inici) fins a 6 (destí T assolit)
    const [step, setStep] = useState<number>(0);

    const goPrev = () => setStep((prev) => Math.max(0, prev - 1));
    const goNext = () => setStep((prev) => Math.min(6, prev + 1));

    const isPathCell = (r: number, c: number): boolean => {
        return step === 6 && SHORTEST_PATH.some((p) => p.r === r && p.c === c);
    };

    return (
        <div className="w-full my-6 font-mono text-xs select-none not-prose flex flex-col items-center gap-3">
            {/* Controls minimalistes (només < i >) */}
            <div className="w-full max-w-md flex items-center justify-between px-1">
                <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                    <span className="text-slate-500 font-bold">BFS dist:</span>
                    <span className="font-bold text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30">
                        d = {step}
                    </span>
                    {step === 6 && (
                        <span className="text-sky-300 font-bold bg-sky-500/20 px-1.5 py-0.5 rounded border border-sky-500/30">
                            T assolit (6 passos)
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-0.5">
                    <button
                        type="button"
                        onClick={goPrev}
                        disabled={step === 0}
                        className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition disabled:opacity-20 disabled:cursor-not-allowed active:scale-95"
                    >
                        <ChevronLeft size={13} />
                    </button>
                    <button
                        type="button"
                        onClick={goNext}
                        disabled={step === 6}
                        className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition disabled:opacity-20 disabled:cursor-not-allowed active:scale-95"
                    >
                        <ChevronRight size={13} />
                    </button>
                </div>
            </div>

            {/* Visualització central: Graella + Vector de desplaçaments di, dj */}
            <div className="w-full max-w-md flex items-center justify-center gap-6">
                {/* 1. Graella 2D (Sense contenidor ni fons) */}
                <div className="flex flex-col gap-1">
                    {GRID_MAP.map((row, r) => (
                        <div key={`grid-row-${r}`} className="flex items-center gap-1">
                            {row.map((cellType, c) => {
                                const dist = DIST_MAP[r][c];
                                const isObstacle = cellType === "#";
                                const isStart = cellType === "S";
                                const isTarget = cellType === "T";
                                const isVisited = dist !== -1 && dist <= step;
                                const isFrontier = dist === step;
                                const inShortestPath = isPathCell(r, c);

                                return (
                                    <div
                                        key={`cell-${r}-${c}`}
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-all duration-200 ${
                                            isObstacle
                                                ? "bg-slate-900 border border-slate-800 text-slate-700"
                                                : inShortestPath
                                                ? "bg-sky-500/30 border-2 border-sky-400 text-sky-200 scale-105 z-10 shadow-[0_0_8px_rgba(56,189,248,0.35)]"
                                                : isFrontier
                                                ? "bg-emerald-500/25 border-2 border-emerald-400 text-emerald-300 scale-105 z-10 shadow-[0_0_8px_rgba(52,211,153,0.3)]"
                                                : isVisited
                                                ? "bg-slate-800/80 border border-slate-700 text-slate-300"
                                                : "bg-slate-950/40 border border-white/5 text-slate-600"
                                        }`}
                                    >
                                        {isObstacle ? (
                                            <span className="text-[10px] text-slate-600">#</span>
                                        ) : isStart ? (
                                            <span className="text-emerald-400 font-bold">S</span>
                                        ) : isTarget ? (
                                            <span className={isVisited ? "text-sky-300 font-bold" : "text-amber-400 font-bold"}>T</span>
                                        ) : isVisited ? (
                                            <span className="text-[10px] font-mono">{dist}</span>
                                        ) : (
                                            <span className="text-[8px] text-slate-700">·</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* 2. Mini rosa de 4 moviments ortogonals (di, dj) */}
                <div className="flex flex-col items-center gap-1.5">
                    <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Arestes di, dj</span>
                    <div className="grid grid-cols-3 gap-1 w-16 h-16 place-items-center">
                        <div />
                        <div className="w-5 h-5 rounded bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400">
                            <ArrowUp size={10} />
                        </div>
                        <div />
                        <div className="w-5 h-5 rounded bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400">
                            <ArrowLeft size={10} />
                        </div>
                        <div className="w-5 h-5 rounded bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold text-[9px]">
                            u
                        </div>
                        <div className="w-5 h-5 rounded bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400">
                            <ArrowRight size={10} />
                        </div>
                        <div />
                        <div className="w-5 h-5 rounded bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400">
                            <ArrowDown size={10} />
                        </div>
                        <div />
                    </div>
                </div>
            </div>
        </div>
    );
}
