"use client";

import { useState } from "react";

interface IntervalOption {
    label: string;
    sql: string;
    minutes: number;
    resultingTime: string;
}

const INTERVAL_PRESETS: IntervalOption[] = [
    { label: "10 min", sql: "INTERVAL '10 min'", minutes: 10, resultingTime: "10:10" },
    { label: "30 min", sql: "INTERVAL '30 min'", minutes: 30, resultingTime: "10:30" },
    { label: "2 h",    sql: "INTERVAL '2 hour'", minutes: 120, resultingTime: "12:00" },
];

export default function IntervalVisualizer() {
    const [selectedIdx, setSelectedIdx] = useState<number>(0);

    const activePreset = INTERVAL_PRESETS[selectedIdx];
    // Dynamic X position for the threshold (between 160 and 260 in a 360-wide viewBox)
    const thresholdX = 140 + selectedIdx * 50;

    return (
        <div className="w-full max-w-lg mx-auto my-6 not-prose select-none font-mono text-xs">
            {/* Selector interactiu de presets d'interval */}
            <div className="flex items-center justify-between pb-3">
                <span className="text-[11px] text-slate-500 font-semibold tracking-wider">
                    data_sortida = 10:00
                </span>
                <div className="flex gap-1.5">
                    {INTERVAL_PRESETS.map((preset, idx) => {
                        const isSelected = selectedIdx === idx;
                        return (
                            <button
                                key={preset.label}
                                type="button"
                                onClick={() => setSelectedIdx(idx)}
                                className={`px-2 py-1 rounded-md border text-[11px] transition-all duration-200 cursor-pointer ${
                                    isSelected
                                        ? "bg-sky-500/20 border-sky-400 text-sky-200 shadow-[0_0_10px_rgba(56,189,248,0.2)] font-bold"
                                        : "bg-slate-900/40 border-white/10 text-slate-400 hover:text-slate-200"
                                }`}
                            >
                                + {preset.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Línia temporal SVG minimalista */}
            <div className="relative w-full">
                <svg viewBox="0 0 360 84" className="w-full h-auto overflow-visible">
                    {/* Zona acceptada: moment > threshold (ombreig suau) */}
                    <rect
                        x={thresholdX}
                        y="20"
                        width={360 - thresholdX}
                        height="44"
                        fill="url(#accepted-gradient)"
                        className="transition-all duration-300"
                    />

                    <defs>
                        <linearGradient id="accepted-gradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.04" />
                        </linearGradient>
                    </defs>

                    {/* Eix temporal base */}
                    <line
                        x1="30"
                        y1="48"
                        x2="340"
                        y2="48"
                        stroke="#334155"
                        strokeWidth="1.5"
                    />
                    {/* Fletxa eix */}
                    <path
                        d="M 336,44 L 344,48 L 336,52"
                        fill="none"
                        stroke="#334155"
                        strokeWidth="1.5"
                    />

                    {/* Punt base: data_sortida (10:00) */}
                    <circle cx="60" cy="48" r="4.5" fill="#38bdf8" />
                    <text
                        x="60"
                        y="66"
                        textAnchor="middle"
                        fill="#94a3b8"
                        fontSize="10"
                        className="font-mono font-semibold"
                    >
                        10:00
                    </text>

                    {/* Barra de l'interval: bracket superior */}
                    <path
                        d={`M 60,34 L 60,28 L ${thresholdX},28 L ${thresholdX},34`}
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="1.5"
                        className="transition-all duration-300"
                    />
                    <text
                        x={(60 + thresholdX) / 2}
                        y="20"
                        textAnchor="middle"
                        fill="#38bdf8"
                        fontSize="10"
                        className="font-mono font-bold transition-all duration-300"
                    >
                        + {activePreset.sql}
                    </text>

                    {/* Punt resultant / llindar */}
                    <line
                        x1={thresholdX}
                        y1="34"
                        x2={thresholdX}
                        y2="58"
                        stroke="#10b981"
                        strokeWidth="2"
                        className="transition-all duration-300"
                    />
                    <circle
                        cx={thresholdX}
                        cy="48"
                        r="4"
                        fill="#020617"
                        stroke="#10b981"
                        strokeWidth="2"
                        className="transition-all duration-300"
                    />
                    <text
                        x={thresholdX}
                        y="66"
                        textAnchor="middle"
                        fill="#10b981"
                        fontSize="10"
                        className="font-mono font-bold transition-all duration-300"
                    >
                        {activePreset.resultingTime}
                    </text>

                    {/* Etiqueta de la condició moment > ... */}
                    <text
                        x={Math.min(thresholdX + 45, 310)}
                        y="40"
                        textAnchor="middle"
                        fill="#34d399"
                        fontSize="9.5"
                        className="font-mono font-bold tracking-tight transition-all duration-300"
                    >
                        moment &gt; {activePreset.resultingTime}
                    </text>
                </svg>
            </div>
        </div>
    );
}
