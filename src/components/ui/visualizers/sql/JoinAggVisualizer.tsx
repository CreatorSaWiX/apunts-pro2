"use client";

import { useState } from "react";

interface EmployeeRow {
    id: number;
    dept: string;
    salary: number;
    groupIndex: number;
}

interface GroupSummary {
    dept: string;
    count: number;
    avgSalary: number;
    passesHaving: boolean;
    color: {
        border: string;
        bg: string;
        text: string;
        stroke: string;
        glow: string;
    };
}

const INPUT_ROWS: EmployeeRow[] = [
    { id: 0, dept: "SISTEMES", salary: 240000, groupIndex: 0 },
    { id: 1, dept: "SISTEMES", salary: 260000, groupIndex: 0 },
    { id: 2, dept: "VENDES", salary: 180000, groupIndex: 1 },
    { id: 3, dept: "VENDES", salary: 220000, groupIndex: 1 },
    { id: 4, dept: "I+D", salary: 310000, groupIndex: 2 },
];

const GROUPS: GroupSummary[] = [
    {
        dept: "SISTEMES",
        count: 2,
        avgSalary: 250000,
        passesHaving: true,
        color: {
            border: "border-sky-400",
            bg: "bg-sky-500/15",
            text: "text-sky-300",
            stroke: "#38bdf8",
            glow: "shadow-[0_0_12px_rgba(56,189,248,0.25)]",
        },
    },
    {
        dept: "VENDES",
        count: 2,
        avgSalary: 200000,
        passesHaving: true,
        color: {
            border: "border-emerald-400",
            bg: "bg-emerald-500/15",
            text: "text-emerald-300",
            stroke: "#10b981",
            glow: "shadow-[0_0_12px_rgba(16,185,129,0.25)]",
        },
    },
    {
        dept: "I+D",
        count: 1,
        avgSalary: 310000,
        passesHaving: false,
        color: {
            border: "border-rose-400/50",
            bg: "bg-rose-500/10",
            text: "text-rose-300",
            stroke: "#f43f5e",
            glow: "shadow-[0_0_12px_rgba(244,63,94,0.2)]",
        },
    },
];

// Càlcul de coordenades exactes (alçada de fila 32px, gap 8px)
const ROW_H = 32;
const GAP_IN = 8;
const getYIn = (index: number) => index * (ROW_H + GAP_IN) + ROW_H / 2;

// Posicions verticals dels 3 grups de sortida (centres: 36px, 116px, 176px)
const GROUP_Y_OUT = [36, 116, 176];

export default function JoinAggVisualizer() {
    const [activeGroup, setActiveGroup] = useState<number | null>(null);

    return (
        <div className="w-full max-w-xl mx-auto my-6 not-prose select-none font-mono text-xs">
            {/* 1. CAPÇALERES UNIFICADES */}
            <div
                className="grid items-center text-[10px] text-slate-500 font-semibold tracking-wider pb-2 px-1"
                style={{ gridTemplateColumns: "1fr 90px 1fr" }}
            >
                <div className="grid grid-cols-[1fr_80px] px-2.5 text-left">
                    <span>nom_dpt</span>
                    <span className="text-right">sou</span>
                </div>
                <div className="text-center text-[9px] text-amber-400/90 font-bold tracking-wider">
                    HAVING &gt; 1
                </div>
                <div className="grid grid-cols-[1fr_80px] px-2.5 text-left">
                    <span>nom_dpt</span>
                    <span className="text-right text-emerald-400/90">sou_mig</span>
                </div>
            </div>

            {/* 2. COS GRÀFIC DE LA VISUALITZACIÓ */}
            <div
                className="relative grid items-start"
                style={{ gridTemplateColumns: "1fr 90px 1fr" }}
            >
                {/* Taula d'entrada: tuples del join */}
                <div className="flex flex-col gap-2">
                    {INPUT_ROWS.map((row) => {
                        const group = GROUPS[row.groupIndex];
                        const isHighlighted = activeGroup === row.groupIndex;
                        const isDimmed = activeGroup !== null && !isHighlighted;

                        return (
                            <button
                                key={`in-${row.id}`}
                                type="button"
                                onMouseEnter={() => setActiveGroup(row.groupIndex)}
                                onMouseLeave={() => setActiveGroup(null)}
                                className={`h-8 px-2.5 rounded-lg border grid grid-cols-[1fr_80px] items-center text-left transition-all duration-200 cursor-pointer ${
                                    isHighlighted
                                        ? `${group.color.bg} ${group.color.border} ${group.color.text} ${group.color.glow}`
                                        : isDimmed
                                        ? "bg-slate-900/20 border-white/5 text-slate-600 opacity-30"
                                        : "bg-slate-900/40 border-white/10 text-slate-300 hover:border-slate-600"
                                }`}
                            >
                                <span className="truncate">{row.dept}</span>
                                <span className="text-right tabular-nums">
                                    {row.salary.toLocaleString("ca-ES")}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Connexions SVG (192px alçada total) */}
                <div className="h-[192px] relative">
                    <svg
                        viewBox="0 0 90 192"
                        className="w-full h-[192px] overflow-visible pointer-events-none"
                    >
                        {INPUT_ROWS.map((row) => {
                            const y1 = getYIn(row.id);
                            const y2 = GROUP_Y_OUT[row.groupIndex];
                            const group = GROUPS[row.groupIndex];
                            const isHighlighted = activeGroup === row.groupIndex;
                            const isDimmed = activeGroup !== null && !isHighlighted;

                            return (
                                <path
                                    key={`path-${row.id}`}
                                    d={`M 0,${y1} C 45,${y1} 45,${y2} 90,${y2}`}
                                    fill="none"
                                    stroke={
                                        isHighlighted
                                            ? group.color.stroke
                                            : isDimmed
                                            ? "#334155"
                                            : row.groupIndex === 2
                                            ? "#475569"
                                            : "#475569"
                                    }
                                    strokeWidth={isHighlighted ? 2 : 1.25}
                                    strokeOpacity={
                                        isDimmed
                                            ? 0.15
                                            : isHighlighted
                                            ? 1
                                            : row.groupIndex === 2
                                            ? 0.3
                                            : 0.6
                                    }
                                    strokeDasharray={row.groupIndex === 2 ? "3 3" : undefined}
                                    className="transition-all duration-200"
                                />
                            );
                        })}
                    </svg>
                </div>

                {/* Taula de sortida: grups que compleixen HAVING COUNT(*) > 1 */}
                <div className="h-[192px] relative flex flex-col justify-between">
                    {/* Grup 0: SISTEMES */}
                    <button
                        type="button"
                        onMouseEnter={() => setActiveGroup(0)}
                        onMouseLeave={() => setActiveGroup(null)}
                        style={{ height: "32px", marginTop: "20px" }}
                        className={`px-2.5 rounded-lg border grid grid-cols-[1fr_80px] items-center text-left transition-all duration-200 cursor-pointer ${
                            activeGroup === 0
                                ? `${GROUPS[0].color.bg} ${GROUPS[0].color.border} ${GROUPS[0].color.text} ${GROUPS[0].color.glow}`
                                : activeGroup !== null
                                ? "bg-slate-900/20 border-white/5 text-slate-600 opacity-30"
                                : "bg-slate-900/40 border-white/10 text-slate-300 hover:border-slate-600"
                        }`}
                    >
                        <span className="truncate">{GROUPS[0].dept}</span>
                        <span className="text-right text-emerald-300/90 tabular-nums font-semibold">
                            {GROUPS[0].avgSalary.toLocaleString("ca-ES")}
                        </span>
                    </button>

                    {/* Grup 1: VENDES */}
                    <button
                        type="button"
                        onMouseEnter={() => setActiveGroup(1)}
                        onMouseLeave={() => setActiveGroup(null)}
                        style={{ height: "32px", marginTop: "28px" }}
                        className={`px-2.5 rounded-lg border grid grid-cols-[1fr_80px] items-center text-left transition-all duration-200 cursor-pointer ${
                            activeGroup === 1
                                ? `${GROUPS[1].color.bg} ${GROUPS[1].color.border} ${GROUPS[1].color.text} ${GROUPS[1].color.glow}`
                                : activeGroup !== null
                                ? "bg-slate-900/20 border-white/5 text-slate-600 opacity-30"
                                : "bg-slate-900/40 border-white/10 text-slate-300 hover:border-slate-600"
                        }`}
                    >
                        <span className="truncate">{GROUPS[1].dept}</span>
                        <span className="text-right text-emerald-300/90 tabular-nums font-semibold">
                            {GROUPS[1].avgSalary.toLocaleString("ca-ES")}
                        </span>
                    </button>

                    {/* Grup 2: I+D (Descartat per HAVING COUNT(*) <= 1) */}
                    <button
                        type="button"
                        onMouseEnter={() => setActiveGroup(2)}
                        onMouseLeave={() => setActiveGroup(null)}
                        style={{ height: "32px", marginTop: "28px" }}
                        className={`px-2.5 rounded-lg border border-dashed text-center flex items-center justify-center transition-all duration-200 cursor-pointer ${
                            activeGroup === 2
                                ? "border-rose-400/50 bg-rose-500/10 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)]"
                                : "border-white/10 bg-slate-900/20 text-slate-500 opacity-40 hover:opacity-80"
                        }`}
                    >
                        <span className="text-[10px] tracking-wider font-semibold">
                            COUNT = 1 ≤ 1
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
