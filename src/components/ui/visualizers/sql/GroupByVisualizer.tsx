"use client";

import { useState } from "react";

interface EmployeeRow {
    id: number;
    dept: number;
    salary: number;
    groupIndex: number;
}

interface GroupSummary {
    dept: number;
    avgSalary: number;
    formula: string;
    color: {
        border: string;
        bg: string;
        text: string;
        stroke: string;
        glow: string;
    };
}

const INPUT_ROWS: EmployeeRow[] = [
    { id: 0, dept: 1, salary: 240000, groupIndex: 0 },
    { id: 1, dept: 2, salary: 180000, groupIndex: 1 },
    { id: 2, dept: 1, salary: 260000, groupIndex: 0 },
    { id: 3, dept: 3, salary: 310000, groupIndex: 2 },
    { id: 4, dept: 2, salary: 220000, groupIndex: 1 },
];

const GROUP_SUMMARIES: GroupSummary[] = [
    {
        dept: 1,
        avgSalary: 250000,
        formula: "(240k + 260k) / 2",
        color: {
            border: "border-sky-400",
            bg: "bg-sky-500/15",
            text: "text-sky-300",
            stroke: "#38bdf8",
            glow: "shadow-[0_0_12px_rgba(56,189,248,0.25)]",
        },
    },
    {
        dept: 2,
        avgSalary: 200000,
        formula: "(180k + 220k) / 2",
        color: {
            border: "border-amber-400",
            bg: "bg-amber-500/15",
            text: "text-amber-300",
            stroke: "#f59e0b",
            glow: "shadow-[0_0_12px_rgba(245,158,11,0.25)]",
        },
    },
    {
        dept: 3,
        avgSalary: 310000,
        formula: "310k / 1",
        color: {
            border: "border-emerald-400",
            bg: "bg-emerald-500/15",
            text: "text-emerald-300",
            stroke: "#10b981",
            glow: "shadow-[0_0_12px_rgba(16,185,129,0.25)]",
        },
    },
];

// Càlcul de coordenades exactes per a la connexió corba SVG
const ROW_HEIGHT = 32;
const GAP_IN = 8;
const OFFSET_OUT = 16;
const GAP_OUT = 32;

const getYIn = (index: number) => index * (ROW_HEIGHT + GAP_IN) + ROW_HEIGHT / 2;
const getYOut = (index: number) => OFFSET_OUT + index * (ROW_HEIGHT + GAP_OUT) + ROW_HEIGHT / 2;

export default function GroupByVisualizer() {
    const [activeGroup, setActiveGroup] = useState<number | null>(null);

    return (
        <div className="w-full max-w-xl mx-auto my-6 not-prose select-none font-mono text-xs">
            {/* Capçaleres minimalistes de columnes */}
            <div
                className="grid items-center text-[11px] text-slate-500 font-semibold tracking-wider pb-2"
                style={{ gridTemplateColumns: "1fr 90px 1fr" }}
            >
                <div
                    className="grid px-2 text-center"
                    style={{ gridTemplateColumns: "44px 1fr" }}
                >
                    <span>num_dpt</span>
                    <span>sou</span>
                </div>
                <span className="text-center text-sky-400/80 font-bold">GROUP BY</span>
                <div
                    className="grid px-2 text-center"
                    style={{ gridTemplateColumns: "44px 1fr" }}
                >
                    <span>num_dpt</span>
                    <span className="text-emerald-400/90">sou_mig</span>
                </div>
            </div>

            {/* Cos de la visualització */}
            <div
                className="relative grid items-center"
                style={{ gridTemplateColumns: "1fr 90px 1fr" }}
            >
                {/* Taula d'entrada: files individuals */}
                <div className="flex flex-col gap-2">
                    {INPUT_ROWS.map((row) => {
                        const summary = GROUP_SUMMARIES[row.groupIndex];
                        const isHighlighted = activeGroup === row.groupIndex;
                        const isDimmed = activeGroup !== null && !isHighlighted;

                        return (
                            <button
                                key={row.id}
                                type="button"
                                onMouseEnter={() => setActiveGroup(row.groupIndex)}
                                onMouseLeave={() => setActiveGroup(null)}
                                onClick={() =>
                                    setActiveGroup((curr) => (curr === row.groupIndex ? null : row.groupIndex))
                                }
                                style={{ gridTemplateColumns: "36px 1fr" }}
                                className={`h-8 px-2.5 rounded-lg border transition-all duration-200 cursor-pointer grid items-center text-center ${
                                    isHighlighted
                                        ? `${summary.color.bg} ${summary.color.border} ${summary.color.text} ${summary.color.glow}`
                                        : isDimmed
                                        ? "bg-slate-900/20 border-white/5 text-slate-600 opacity-30"
                                        : "bg-slate-900/40 border-white/10 text-slate-300 hover:border-slate-600"
                                }`}
                            >
                                <span className="font-bold border-r border-white/10 pr-1">{row.dept}</span>
                                <span className="pl-1 text-right tabular-nums">
                                    {row.salary.toLocaleString("ca-ES")}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Connexions de convergència SVG */}
                <svg
                    viewBox="0 0 90 192"
                    className="w-full h-[192px] pointer-events-none overflow-visible"
                >
                    {INPUT_ROWS.map((row) => {
                        const y1 = getYIn(row.id);
                        const y2 = getYOut(row.groupIndex);
                        const summary = GROUP_SUMMARIES[row.groupIndex];
                        const isHighlighted = activeGroup === row.groupIndex;
                        const isDimmed = activeGroup !== null && !isHighlighted;

                        return (
                            <path
                                key={row.id}
                                d={`M 0,${y1} C 45,${y1} 45,${y2} 90,${y2}`}
                                fill="none"
                                stroke={
                                    isHighlighted
                                        ? summary.color.stroke
                                        : isDimmed
                                        ? "#334155"
                                        : summary.color.stroke
                                }
                                strokeWidth={isHighlighted ? 2.2 : 1.25}
                                strokeOpacity={isDimmed ? 0.15 : isHighlighted ? 1 : 0.55}
                                className="transition-all duration-200"
                            />
                        );
                    })}
                </svg>

                {/* Taula de sortida: grups agregats */}
                <div
                    className="flex flex-col gap-[32px]"
                    style={{ paddingTop: `${OFFSET_OUT}px`, paddingBottom: `${OFFSET_OUT}px` }}
                >
                    {GROUP_SUMMARIES.map((group, idx) => {
                        const isHighlighted = activeGroup === idx;
                        const isDimmed = activeGroup !== null && !isHighlighted;

                        return (
                            <div key={group.dept} className="relative">
                                <button
                                    type="button"
                                    onMouseEnter={() => setActiveGroup(idx)}
                                    onMouseLeave={() => setActiveGroup(null)}
                                    onClick={() =>
                                        setActiveGroup((curr) => (curr === idx ? null : idx))
                                    }
                                    style={{ gridTemplateColumns: "36px 1fr" }}
                                    className={`w-full h-8 px-2.5 rounded-lg border transition-all duration-200 cursor-pointer grid items-center text-center ${
                                        isHighlighted
                                            ? `${group.color.bg} ${group.color.border} ${group.color.text} ${group.color.glow}`
                                            : isDimmed
                                            ? "bg-slate-900/20 border-white/5 text-slate-600 opacity-30"
                                            : "bg-slate-900/60 border-white/10 text-slate-200 hover:border-slate-500"
                                    }`}
                                >
                                    <span className="font-bold border-r border-white/10 pr-1">{group.dept}</span>
                                    <span className="pl-1 text-right tabular-nums font-semibold">
                                        {group.avgSalary.toLocaleString("ca-ES")}
                                    </span>
                                </button>

                                {/* Indicador de càlcul compacte discret */}
                                {isHighlighted && (
                                    <div className="absolute -bottom-4 right-0 text-[10px] font-mono text-slate-400 bg-slate-950/90 px-1.5 py-0.5 rounded border border-white/10 shadow-sm pointer-events-none whitespace-nowrap z-10">
                                        avg: {group.formula}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
