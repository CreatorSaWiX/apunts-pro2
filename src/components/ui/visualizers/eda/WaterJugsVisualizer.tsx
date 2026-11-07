"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { m as motion } from "framer-motion";

interface StepState {
    step: number;
    a: number; // Aigua a la gerra A (max 4L)
    b: number; // Aigua a la gerra B (max 3L)
    action: string;
}

const BFS_STEPS: StepState[] = [
    { step: 0, a: 0, b: 0, action: "Inici (0, 0)" },
    { step: 1, a: 4, b: 0, action: "Omplir A" },
    { step: 2, a: 1, b: 3, action: "A → B" },
    { step: 3, a: 1, b: 0, action: "Buidar B" },
    { step: 4, a: 0, b: 1, action: "A → B" },
    { step: 5, a: 4, b: 1, action: "Omplir A" },
    { step: 6, a: 2, b: 3, action: "A → B (Target: 2L)" },
];

export default function WaterJugsVisualizer() {
    const [stepIdx, setStepIdx] = useState<number>(0);
    const curr = BFS_STEPS[stepIdx];

    const goPrev = () => setStepIdx((prev) => Math.max(0, prev - 1));
    const goNext = () => setStepIdx((prev) => Math.min(BFS_STEPS.length - 1, prev + 1));

    const isTarget = curr.a === 2;

    return (
        <div className="w-full my-6 font-mono text-xs select-none not-prose flex flex-col items-center gap-3">
            {/* Header controls minimalistes (només < i >) */}
            <div className="w-full max-w-md flex items-center justify-between px-1">
                <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                    <span className="text-slate-500 font-bold">Pas BFS:</span>
                    <span className="font-bold text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30">
                        ({curr.a}, {curr.b})
                    </span>
                    <span className="text-slate-400 font-medium">{curr.action}</span>
                    {isTarget && (
                        <span className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/40">
                            <Check size={10} /> 2L
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-0.5">
                    <button
                        type="button"
                        onClick={goPrev}
                        disabled={stepIdx === 0}
                        className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition disabled:opacity-20 disabled:cursor-not-allowed active:scale-95"
                    >
                        <ChevronLeft size={13} />
                    </button>
                    <button
                        type="button"
                        onClick={goNext}
                        disabled={stepIdx === BFS_STEPS.length - 1}
                        className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition disabled:opacity-20 disabled:cursor-not-allowed active:scale-95"
                    >
                        <ChevronRight size={13} />
                    </button>
                </div>
            </div>

            {/* Visualització central: Dues Gerres + Cadena d'estats (sense fons/contenidor) */}
            <div className="w-full max-w-md flex flex-col sm:flex-row items-center sm:items-end justify-center gap-6 pt-1">
                {/* 1. Les Dues Gerres amb animació fluida de líquid */}
                <div className="flex items-end gap-5">
                    {/* Gerra A (Capacitat 4L - 80px) */}
                    <div className="flex flex-col items-center gap-1.5">
                        <div
                            className={`relative w-12 h-20 rounded-b-xl border-2 flex items-end justify-center overflow-hidden transition-colors duration-300 ${
                                isTarget
                                    ? "border-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.3)] bg-slate-900/60"
                                    : "border-slate-700 bg-slate-900/40"
                            }`}
                        >
                            {/* Líquid animat continu que buida i omple fluidament */}
                            <motion.div
                                initial={false}
                                animate={{ height: `${(curr.a / 4) * 100}%` }}
                                transition={{ duration: 0.35, ease: "easeInOut" }}
                                className={`w-full relative flex items-center justify-center font-bold text-[10px] overflow-hidden ${
                                    isTarget
                                        ? "bg-emerald-500/40 text-emerald-200"
                                        : "bg-sky-500/40 text-sky-200"
                                }`}
                            >
                                {/* Menisc superior suau */}
                                <div
                                    className={`absolute top-0 left-0 right-0 h-[1.5px] ${
                                        isTarget ? "bg-emerald-300/80" : "bg-sky-300/80"
                                    }`}
                                />
                                {curr.a > 0 && `${curr.a}L`}
                            </motion.div>
                        </div>

                        <span className={`text-[10px] font-bold ${isTarget ? "text-emerald-300" : "text-slate-400"}`}>
                            Gerra A (4L)
                        </span>
                    </div>

                    {/* Gerra B (Capacitat 3L - 60px) */}
                    <div className="flex flex-col items-center gap-1.5">
                        <div className="relative w-11 h-[60px] rounded-b-xl border-2 border-slate-700 bg-slate-900/40 flex items-end justify-center overflow-hidden transition-colors duration-300">
                            {/* Líquid animat continu que buida i omple fluidament */}
                            <motion.div
                                initial={false}
                                animate={{ height: `${(curr.b / 3) * 100}%` }}
                                transition={{ duration: 0.35, ease: "easeInOut" }}
                                className="w-full relative bg-sky-500/40 text-sky-200 flex items-center justify-center font-bold text-[10px] overflow-hidden"
                            >
                                {/* Menisc superior suau */}
                                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-sky-300/80" />
                                {curr.b > 0 && `${curr.b}L`}
                            </motion.div>
                        </div>

                        <span className="text-[10px] text-slate-400 font-bold">Gerra B (3L)</span>
                    </div>
                </div>

                {/* 2. Camí d'estats al Graf Implícit */}
                <div className="flex flex-col gap-1.5 items-center sm:items-start pb-2">
                    <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">
                        Camí BFS al graf d'estats
                    </span>
                    <div className="flex items-center gap-1 flex-wrap justify-center sm:justify-start">
                        {BFS_STEPS.map((s, idx) => {
                            const isCurrent = idx === stepIdx;
                            const isPast = idx < stepIdx;

                            return (
                                <React.Fragment key={`state-node-${idx}`}>
                                    <button
                                        type="button"
                                        onClick={() => setStepIdx(idx)}
                                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                                            isCurrent
                                                ? s.a === 2
                                                    ? "bg-emerald-500/30 border border-emerald-400 text-emerald-300 scale-105 shadow-[0_0_8px_rgba(52,211,153,0.3)]"
                                                    : "bg-sky-500/30 border border-sky-400 text-sky-200 scale-105"
                                                : isPast
                                                ? "bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200"
                                                : "bg-slate-950/40 text-slate-600 border border-white/5 hover:text-slate-400"
                                        }`}
                                    >
                                        ({s.a},{s.b})
                                    </button>
                                    {idx < BFS_STEPS.length - 1 && (
                                        <span className="text-slate-600 text-[8px]">→</span>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
