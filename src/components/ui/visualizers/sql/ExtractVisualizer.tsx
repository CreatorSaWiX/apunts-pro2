"use client";

import { useState } from "react";

interface ExtractField {
    id: string;
    label: string;
    extractedValue: string;
    segmentHighlight: "year" | "month" | "day" | "all_date";
    strokeColor: string;
    badgeColor: {
        border: string;
        bg: string;
        text: string;
        glow: string;
    };
    note?: string;
}

const EXTRACT_FIELDS: ExtractField[] = [
    {
        id: "year",
        label: "YEAR",
        extractedValue: "2024",
        segmentHighlight: "year",
        strokeColor: "#38bdf8",
        badgeColor: {
            border: "border-sky-400",
            bg: "bg-sky-500/15",
            text: "text-sky-300",
            glow: "shadow-[0_0_12px_rgba(56,189,248,0.25)]",
        },
    },
    {
        id: "month",
        label: "MONTH",
        extractedValue: "10",
        segmentHighlight: "month",
        strokeColor: "#f59e0b",
        badgeColor: {
            border: "border-amber-400",
            bg: "bg-amber-500/15",
            text: "text-amber-300",
            glow: "shadow-[0_0_12px_rgba(245,158,11,0.25)]",
        },
    },
    {
        id: "dow",
        label: "DOW",
        extractedValue: "2",
        note: "Dimarts",
        segmentHighlight: "all_date",
        strokeColor: "#10b981",
        badgeColor: {
            border: "border-emerald-400",
            bg: "bg-emerald-500/15",
            text: "text-emerald-300",
            glow: "shadow-[0_0_12px_rgba(16,185,129,0.25)]",
        },
    },
];

export default function ExtractVisualizer() {
    const [activeId, setActiveId] = useState<string | null>("year");

    const activeField = EXTRACT_FIELDS.find((f) => f.id === activeId);

    return (
        <div className="w-full max-w-lg mx-auto my-6 not-prose select-none font-mono text-xs">
            {/* Timestamp complet segmentat */}
            <div className="flex items-center justify-center gap-1.5 pb-3">
                {/* YEAR */}
                <span
                    onMouseEnter={() => setActiveId("year")}
                    className={`px-2.5 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer ${
                        activeField?.segmentHighlight === "year" || activeField?.segmentHighlight === "all_date"
                            ? "bg-sky-500/20 border-sky-400 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.25)]"
                            : "bg-slate-900/40 border-white/10 text-slate-300 hover:border-slate-600"
                    }`}
                >
                    2024
                </span>
                <span className="text-slate-600 font-bold">-</span>

                {/* MONTH */}
                <span
                    onMouseEnter={() => setActiveId("month")}
                    className={`px-2 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer ${
                        activeField?.segmentHighlight === "month" || activeField?.segmentHighlight === "all_date"
                            ? "bg-amber-500/20 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.25)]"
                            : "bg-slate-900/40 border-white/10 text-slate-300 hover:border-slate-600"
                    }`}
                >
                    10
                </span>
                <span className="text-slate-600 font-bold">-</span>

                {/* DAY */}
                <span
                    onMouseEnter={() => setActiveId("dow")}
                    className={`px-2 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer ${
                        activeField?.segmentHighlight === "day" || activeField?.segmentHighlight === "all_date"
                            ? "bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.25)]"
                            : "bg-slate-900/40 border-white/10 text-slate-300 hover:border-slate-600"
                    }`}
                >
                    15
                </span>

                <span className="text-slate-600 px-1 font-bold">·</span>

                {/* TIME (14:30:00) */}
                <span className="px-2 py-1.5 rounded-lg border bg-slate-900/20 border-white/5 text-slate-500">
                    14:30:00
                </span>
            </div>

            {/* Fletxes de connexió visuals SVG */}
            <svg viewBox="0 0 360 40" className="w-full h-10 overflow-visible pointer-events-none">
                {/* year connection (x=110 to x=60) */}
                <path
                    d="M 105,2 C 105,22 60,18 60,38"
                    fill="none"
                    stroke={activeId === "year" ? "#38bdf8" : "#334155"}
                    strokeWidth={activeId === "year" ? 2 : 1.2}
                    strokeOpacity={activeId === "year" ? 1 : 0.3}
                    className="transition-all duration-200"
                />

                {/* month connection (x=152 to x=180) */}
                <path
                    d="M 152,2 C 152,22 180,18 180,38"
                    fill="none"
                    stroke={activeId === "month" ? "#f59e0b" : "#334155"}
                    strokeWidth={activeId === "month" ? 2 : 1.2}
                    strokeOpacity={activeId === "month" ? 1 : 0.3}
                    className="transition-all duration-200"
                />

                {/* dow / date connection (x=190 to x=300) */}
                <path
                    d="M 190,2 C 190,22 300,18 300,38"
                    fill="none"
                    stroke={activeId === "dow" ? "#10b981" : "#334155"}
                    strokeWidth={activeId === "dow" ? 2 : 1.2}
                    strokeOpacity={activeId === "dow" ? 1 : 0.3}
                    className="transition-all duration-200"
                />
            </svg>

            {/* Files de selecció / resultats d'EXTRACT */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
                {EXTRACT_FIELDS.map((field) => {
                    const isSelected = activeId === field.id;
                    const isDimmed = activeId !== null && !isSelected;

                    return (
                        <button
                            key={field.id}
                            type="button"
                            onMouseEnter={() => setActiveId(field.id)}
                            onClick={() => setActiveId(field.id)}
                            className={`h-11 px-2.5 rounded-lg border transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                                isSelected
                                    ? `${field.badgeColor.bg} ${field.badgeColor.border} ${field.badgeColor.text} ${field.badgeColor.glow}`
                                    : isDimmed
                                    ? "bg-slate-900/20 border-white/5 text-slate-600 opacity-40"
                                    : "bg-slate-900/40 border-white/10 text-slate-300 hover:border-slate-600"
                            }`}
                        >
                            <span className="text-[10px] tracking-wider opacity-70">
                                EXTRACT({field.label})
                            </span>
                            <div className="flex items-center gap-1">
                                <span className="font-bold text-sm leading-none">
                                    {field.extractedValue}
                                </span>
                                {field.note && isSelected && (
                                    <span className="text-[9px] opacity-75">
                                        ({field.note})
                                    </span>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
