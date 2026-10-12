"use client";

import { useState } from "react";

interface DistinctRow {
    id: number;
    value: string;
    targetIndex: number;
}

const INPUT_ROWS: DistinctRow[] = [
    { id: 0, value: "BARCELONA", targetIndex: 0 },
    { id: 1, value: "MATARO", targetIndex: 1 },
    { id: 2, value: "BARCELONA", targetIndex: 0 },
    { id: 3, value: "TOLEDO", targetIndex: 2 },
    { id: 4, value: "MATARO", targetIndex: 1 },
];

const OUTPUT_ROWS = ["BARCELONA", "MATARO", "TOLEDO"];

// Càlcul de coordenades exactes per a la connexió corba SVG
const ROW_HEIGHT = 32;
const GAP_IN = 8;
const GAP_OUT = 24;
const OFFSET_OUT = 24;

const getYIn = (index: number) => index * (ROW_HEIGHT + GAP_IN) + ROW_HEIGHT / 2;
const getYOut = (index: number) => OFFSET_OUT + index * (ROW_HEIGHT + GAP_OUT) + ROW_HEIGHT / 2;

export default function DistinctVisualizer() {
    const [activeTarget, setActiveTarget] = useState<number | null>(null);

    return (
        <div className="w-full max-w-md mx-auto my-6 not-prose select-none font-mono text-xs">
            {/* Capçaleres de columna minimalistes */}
            <div
                className="grid items-center text-[11px] text-slate-500 font-semibold tracking-wider pb-2"
                style={{ gridTemplateColumns: "1fr 80px 1fr" }}
            >
                <span className="text-center">ciutat_empl</span>
                <span />
                <span className="text-center text-sky-400/90">DISTINCT</span>
            </div>

            {/* Cos de la visualització */}
            <div
                className="relative grid items-center"
                style={{ gridTemplateColumns: "1fr 80px 1fr" }}
            >
                {/* Columna d'entrada (amb duplicats) */}
                <div className="flex flex-col gap-2">
                    {INPUT_ROWS.map((row) => {
                        const isHighlighted = activeTarget === row.targetIndex;
                        const isDimmed = activeTarget !== null && !isHighlighted;

                        return (
                            <button
                                key={row.id}
                                type="button"
                                onMouseEnter={() => setActiveTarget(row.targetIndex)}
                                onMouseLeave={() => setActiveTarget(null)}
                                className={`h-8 px-2.5 rounded-lg border text-center transition-all duration-200 cursor-pointer flex items-center justify-center ${
                                    isHighlighted
                                        ? "bg-sky-500/15 border-sky-400 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.2)]"
                                        : isDimmed
                                        ? "bg-slate-900/20 border-white/5 text-slate-600"
                                        : "bg-slate-900/40 border-white/10 text-slate-300 hover:border-slate-600"
                                }`}
                            >
                                <span className="truncate">{row.value}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Connexions SVG fluides */}
                <svg
                    viewBox="0 0 80 192"
                    className="w-full h-[192px] pointer-events-none overflow-visible"
                >
                    {INPUT_ROWS.map((row) => {
                        const y1 = getYIn(row.id);
                        const y2 = getYOut(row.targetIndex);
                        const isHighlighted = activeTarget === row.targetIndex;
                        const isDimmed = activeTarget !== null && !isHighlighted;

                        return (
                            <path
                                key={row.id}
                                d={`M 0,${y1} C 40,${y1} 40,${y2} 80,${y2}`}
                                fill="none"
                                stroke={
                                    isHighlighted
                                        ? "#38bdf8"
                                        : isDimmed
                                        ? "#334155"
                                        : "#475569"
                                }
                                strokeWidth={isHighlighted ? 2 : 1.25}
                                strokeOpacity={isDimmed ? 0.2 : isHighlighted ? 1 : 0.6}
                                className="transition-all duration-200"
                            />
                        );
                    })}
                </svg>

                {/* Columna de sortida (valors únics) */}
                <div
                    className="flex flex-col gap-[24px]"
                    style={{ paddingTop: `${OFFSET_OUT}px`, paddingBottom: `${OFFSET_OUT}px` }}
                >
                    {OUTPUT_ROWS.map((value, idx) => {
                        const isHighlighted = activeTarget === idx;
                        const isDimmed = activeTarget !== null && !isHighlighted;

                        return (
                            <button
                                key={value}
                                type="button"
                                onMouseEnter={() => setActiveTarget(idx)}
                                onMouseLeave={() => setActiveTarget(null)}
                                className={`h-8 px-2.5 rounded-lg border text-center transition-all duration-200 cursor-pointer flex items-center justify-center ${
                                    isHighlighted
                                        ? "bg-sky-500/20 border-sky-400 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.25)]"
                                        : isDimmed
                                        ? "bg-slate-900/20 border-white/5 text-slate-600"
                                        : "bg-slate-900/60 border-sky-500/30 text-sky-300 hover:border-sky-400/50"
                                }`}
                            >
                                <span className="truncate">{value}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
