"use client";

import { useState } from "react";

interface EmployeeRow {
    id: number;
    dept: number;
    salary: number;
    matchesWhere: boolean;
}

interface MetricSummary {
    id: "count" | "avg" | "max";
    label: string;
    result: string;
    calcNote: string;
    color: {
        border: string;
        bg: string;
        text: string;
        stroke: string;
        glow: string;
    };
}

const EMPLOYEES: EmployeeRow[] = [
    { id: 0, dept: 1, salary: 240000, matchesWhere: false },
    { id: 1, dept: 2, salary: 180000, matchesWhere: true },
    { id: 2, dept: 2, salary: 220000, matchesWhere: true },
    { id: 3, dept: 3, salary: 310000, matchesWhere: false },
    { id: 4, dept: 2, salary: 260000, matchesWhere: true },
];

const METRICS: MetricSummary[] = [
    {
        id: "count",
        label: "COUNT(*)",
        result: "3",
        calcNote: "3 files filtrades",
        color: {
            border: "border-sky-400",
            bg: "bg-sky-500/15",
            text: "text-sky-300",
            stroke: "#38bdf8",
            glow: "shadow-[0_0_12px_rgba(56,189,248,0.25)]",
        },
    },
    {
        id: "avg",
        label: "AVG(sou)",
        result: "220.000",
        calcNote: "(180k + 220k + 260k) / 3",
        color: {
            border: "border-amber-400",
            bg: "bg-amber-500/15",
            text: "text-amber-300",
            stroke: "#f59e0b",
            glow: "shadow-[0_0_12px_rgba(245,158,11,0.25)]",
        },
    },
    {
        id: "max",
        label: "MAX(sou)",
        result: "260.000",
        calcNote: "max(180k, 220k, 260k)",
        color: {
            border: "border-emerald-400",
            bg: "bg-emerald-500/15",
            text: "text-emerald-300",
            stroke: "#10b981",
            glow: "shadow-[0_0_12px_rgba(16,185,129,0.25)]",
        },
    },
];

// Coordenades exactes de connexió SVG
const ROW_HEIGHT = 30;
const GAP_IN = 8;
const OFFSET_OUT = 18;
const GAP_OUT = 32;

const getYIn = (index: number) => index * (ROW_HEIGHT + GAP_IN) + ROW_HEIGHT / 2;
const getYOut = (index: number) => OFFSET_OUT + index * (ROW_HEIGHT + GAP_OUT) + ROW_HEIGHT / 2;

export default function AggregateVisualizer() {
    const [activeMetric, setActiveMetric] = useState<"count" | "avg" | "max" | null>(null);

    return (
        <div className="w-full max-w-xl mx-auto my-6 not-prose select-none font-mono text-xs">
            {/* Capçaleres de columna minimalistes */}
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
                <span className="text-center text-sky-400/80 font-bold">num_dpt = 2</span>
                <div className="px-2 text-center text-emerald-400/90 font-bold">
                    AGREGACIÓ
                </div>
            </div>

            {/* Cos de la visualització */}
            <div
                className="relative grid items-center"
                style={{ gridTemplateColumns: "1fr 90px 1fr" }}
            >
                {/* Taula d'entrada: files amb filtre WHERE */}
                <div className="flex flex-col gap-2">
                    {EMPLOYEES.map((row) => {
                        const isFiltered = row.matchesWhere;
                        const isMaxSalary = row.salary === 260000;
                        const isHighlighted =
                            activeMetric !== null &&
                            isFiltered &&
                            (activeMetric !== "max" || isMaxSalary);

                        return (
                            <div
                                key={row.id}
                                className={`h-[30px] px-2.5 rounded-lg border transition-all duration-200 grid items-center text-center ${
                                    !isFiltered
                                        ? "bg-slate-900/10 border-white/5 text-slate-600 opacity-25"
                                        : isHighlighted
                                        ? "bg-slate-900/80 border-sky-400 text-sky-200 shadow-[0_0_10px_rgba(56,189,248,0.2)]"
                                        : "bg-slate-900/50 border-white/10 text-slate-300"
                                }`}
                                style={{ gridTemplateColumns: "36px 1fr" }}
                            >
                                <span
                                    className={`font-bold border-r pr-1 ${
                                        isFiltered ? "text-sky-300 border-white/10" : "text-slate-600 border-white/5"
                                    }`}
                                >
                                    {row.dept}
                                </span>
                                <span className="pl-1 text-right tabular-nums">
                                    {row.salary.toLocaleString("ca-ES")}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Connexions de convergència SVG cap a les mètriques */}
                <svg
                    viewBox="0 0 90 182"
                    className="w-full h-[182px] pointer-events-none overflow-visible"
                >
                    {METRICS.map((metric, metricIdx) => {
                        const y2 = getYOut(metricIdx);
                        const isMetricActive = activeMetric === metric.id;
                        const isOtherActive = activeMetric !== null && !isMetricActive;

                        return EMPLOYEES.filter((r) => r.matchesWhere).map((row) => {
                            const y1 = getYIn(row.id);
                            const isMaxNode = row.salary === 260000;
                            const isEdgeRelevant = metric.id !== "max" || isMaxNode;

                            let strokeColor = metric.color.stroke;
                            let opacity = 0.45;
                            let strokeWidth = 1.25;

                            if (isMetricActive && isEdgeRelevant) {
                                opacity = 1;
                                strokeWidth = 2.2;
                            } else if (isOtherActive || (isMetricActive && !isEdgeRelevant)) {
                                opacity = 0.08;
                                strokeColor = "#334155";
                            }

                            return (
                                <path
                                    key={`${metric.id}-${row.id}`}
                                    d={`M 0,${y1} C 45,${y1} 45,${y2} 90,${y2}`}
                                    fill="none"
                                    stroke={strokeColor}
                                    strokeWidth={strokeWidth}
                                    strokeOpacity={opacity}
                                    className="transition-all duration-200"
                                />
                            );
                        });
                    })}
                </svg>

                {/* Taula de sortida: 3 funcions d'agregació */}
                <div
                    className="flex flex-col gap-[32px]"
                    style={{ paddingTop: `${OFFSET_OUT}px`, paddingBottom: `${OFFSET_OUT}px` }}
                >
                    {METRICS.map((metric) => {
                        const isHighlighted = activeMetric === metric.id;
                        const isDimmed = activeMetric !== null && !isHighlighted;

                        return (
                            <div key={metric.id} className="relative">
                                <button
                                    type="button"
                                    onMouseEnter={() => setActiveMetric(metric.id)}
                                    onMouseLeave={() => setActiveMetric(null)}
                                    onClick={() =>
                                        setActiveMetric((curr) => (curr === metric.id ? null : metric.id))
                                    }
                                    style={{ gridTemplateColumns: "1fr 1fr" }}
                                    className={`w-full h-[30px] px-2.5 rounded-lg border transition-all duration-200 cursor-pointer grid items-center text-center ${
                                        isHighlighted
                                            ? `${metric.color.bg} ${metric.color.border} ${metric.color.text} ${metric.color.glow}`
                                            : isDimmed
                                            ? "bg-slate-900/20 border-white/5 text-slate-600 opacity-30"
                                            : "bg-slate-900/60 border-white/10 text-slate-200 hover:border-slate-500"
                                    }`}
                                >
                                    <span className="font-semibold text-left text-[10px] truncate border-r border-white/10 pr-1">
                                        {metric.label}
                                    </span>
                                    <span className="pl-1 text-right tabular-nums font-bold">
                                        {metric.result}
                                    </span>
                                </button>

                                {/* Anotació compacta de càlcul en hover/click */}
                                {isHighlighted && (
                                    <div className="absolute -bottom-4 right-0 text-[10px] font-mono text-slate-400 bg-slate-950/90 px-1.5 py-0.5 rounded border border-white/10 shadow-sm pointer-events-none whitespace-nowrap z-10">
                                        {metric.calcNote}
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
