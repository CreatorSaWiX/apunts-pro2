"use client";

import { useState } from "react";

interface TestValue {
    id: string;
    label: string;
    resolved: string;
    valid: boolean;
    isDefault?: boolean;
}

const TEST_VALUES: TestValue[] = [
    { id: "bcn", label: "'BCN'", resolved: "'BCN'", valid: true },
    { id: "mad", label: "'MAD'", resolved: "'MAD'", valid: true },
    { id: "val", label: "'VAL'", resolved: "'VAL'", valid: true },
    { id: "default", label: "DEFAULT", resolved: "'BCN'", valid: true, isDefault: true },
    { id: "par", label: "'PAR'", resolved: "ERROR", valid: false },
];

export default function DomainVisualizer() {
    const [selectedId, setSelectedId] = useState<string>("bcn");

    const current = TEST_VALUES.find((v) => v.id === selectedId) || TEST_VALUES[0];

    return (
        <div className="w-full max-w-lg mx-auto my-8 not-prose select-none font-mono text-xs">
            {/* Selector de valor de prova */}
            <div className="flex items-center justify-center gap-1.5 pb-5">
                {TEST_VALUES.map((item) => {
                    const isSelected = item.id === selectedId;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setSelectedId(item.id)}
                            className={`px-2.5 py-1 rounded-md border text-[11px] transition-all duration-150 cursor-pointer ${
                                isSelected
                                    ? item.valid
                                        ? "bg-emerald-500/15 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)] font-semibold"
                                        : "bg-rose-500/15 border-rose-400 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)] font-semibold"
                                    : "bg-slate-900/30 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10"
                            }`}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </div>

            {/* Diagrama SVG i blocs connectats */}
            <div className="flex flex-col items-center">
                {/* 1. Bloc del DOMAIN central */}
                <div
                    className={`px-4 py-2 rounded-xl border transition-all duration-200 flex flex-col items-center gap-1 ${
                        current.valid
                            ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-300"
                            : "bg-rose-950/20 border-rose-500/40 text-rose-300"
                    }`}
                >
                    <div className="flex items-center gap-2 text-[11px]">
                        <span className="text-slate-400 font-semibold">DOMAIN</span>
                        <span className="text-sky-300 font-bold">ciutat</span>
                        <span className="text-slate-500 text-[10px]">CHAR(15)</span>
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1.5 pt-0.5">
                        <span>CHECK:</span>
                        <span className="text-slate-300">IN ('BCN', 'MAD', 'VAL')</span>
                        <span className="text-slate-600">|</span>
                        <span className={current.valid ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                            {current.valid ? (current.isDefault ? "DEFAULT → 'BCN'" : "VALID") : "CHECK FAIL"}
                        </span>
                    </div>
                </div>

                {/* 2. Connexions SVG direccionals */}
                <svg viewBox="0 0 280 44" className="w-[280px] h-11 overflow-visible">
                    <defs>
                        <marker
                            id="arrow-emerald"
                            viewBox="0 0 6 6"
                            refX="5"
                            refY="3"
                            markerWidth="5"
                            markerHeight="5"
                            orient="auto"
                        >
                            <path d="M 0 0 L 6 3 L 0 6 z" fill="#10b981" />
                        </marker>
                        <marker
                            id="arrow-rose"
                            viewBox="0 0 6 6"
                            refX="5"
                            refY="3"
                            markerWidth="5"
                            markerHeight="5"
                            orient="auto"
                        >
                            <path d="M 0 0 L 6 3 L 0 6 z" fill="#f43f5e" />
                        </marker>
                    </defs>

                    {/* Branca esquerra cap a ciutat_naix */}
                    <path
                        d="M 140 0 C 140 20 60 20 60 40"
                        fill="none"
                        stroke={current.valid ? "#10b981" : "#f43f5e"}
                        strokeWidth="1.5"
                        strokeDasharray={current.valid ? "none" : "3 3"}
                        markerEnd={current.valid ? "url(#arrow-emerald)" : "url(#arrow-rose)"}
                        className="transition-colors duration-200"
                    />

                    {/* Branca dreta cap a ciutat_treb */}
                    <path
                        d="M 140 0 C 140 20 220 20 220 40"
                        fill="none"
                        stroke={current.valid ? "#10b981" : "#f43f5e"}
                        strokeWidth="1.5"
                        strokeDasharray={current.valid ? "none" : "3 3"}
                        markerEnd={current.valid ? "url(#arrow-emerald)" : "url(#arrow-rose)"}
                        className="transition-colors duration-200"
                    />
                </svg>

                {/* 3. Taula empleats minimalista (sense fons ni caixes pesades) */}
                <div className="w-full max-w-sm flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold px-1 pb-1 border-b border-white/10">
                        <span>empleats</span>
                        <span className="text-slate-600">: ciutat</span>
                    </div>

                    {/* Columnes */}
                    <div className="grid grid-cols-2 gap-2 pt-0.5">
                        {/* ciutat_naix */}
                        <div
                            className={`p-2 rounded-lg border transition-all duration-200 flex flex-col gap-0.5 ${
                                current.valid
                                    ? "border-emerald-500/30 text-emerald-200"
                                    : "border-rose-500/30 text-rose-300"
                            }`}
                        >
                            <span className="text-[10px] text-slate-400 font-semibold">ciutat_naix</span>
                            <span className="text-xs font-bold truncate">
                                {current.valid ? current.resolved : "REJECTED"}
                            </span>
                        </div>

                        {/* ciutat_treb */}
                        <div
                            className={`p-2 rounded-lg border transition-all duration-200 flex flex-col gap-0.5 ${
                                current.valid
                                    ? "border-emerald-500/30 text-emerald-200"
                                    : "border-rose-500/30 text-rose-300"
                            }`}
                        >
                            <span className="text-[10px] text-slate-400 font-semibold">ciutat_treb</span>
                            <span className="text-xs font-bold truncate">
                                {current.valid ? current.resolved : "REJECTED"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
