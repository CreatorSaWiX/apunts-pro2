"use client";

import { useState } from "react";

type UnionMode = "UNION" | "UNION ALL";

interface InputItem {
    id: number;
    table: "dept" | "empl";
    value: string;
}

const DEPT_ROWS: InputItem[] = [
    { id: 0, table: "dept", value: "BARCELONA" },
    { id: 1, table: "dept", value: "MADRID" },
    { id: 2, table: "dept", value: "GIRONA" },
];

const EMPL_ROWS: InputItem[] = [
    { id: 3, table: "empl", value: "BARCELONA" },
    { id: 4, table: "empl", value: "TARRAGONA" },
    { id: 5, table: "empl", value: "MADRID" },
];

const UNION_OUTPUT = ["BARCELONA", "MADRID", "GIRONA", "TARRAGONA"];

const UNION_ALL_OUTPUT: { id: number; value: string; table: "dept" | "empl" }[] = [
    { id: 0, value: "BARCELONA", table: "dept" },
    { id: 1, value: "MADRID", table: "dept" },
    { id: 2, value: "GIRONA", table: "dept" },
    { id: 3, value: "BARCELONA", table: "empl" },
    { id: 4, value: "TARRAGONA", table: "empl" },
    { id: 5, value: "MADRID", table: "empl" },
];

// Coordenades geomètriques de connexió SVG
const Y_IN: Record<number, number> = {
    0: 14,
    1: 48,
    2: 82,
    3: 126,
    4: 160,
    5: 194,
};

const Y_OUT_UNION: Record<string, number> = {
    BARCELONA: 41,
    MADRID: 83,
    GIRONA: 125,
    TARRAGONA: 167,
};

const Y_OUT_UNION_ALL: Record<number, number> = {
    0: 14,
    1: 50,
    2: 86,
    3: 122,
    4: 158,
    5: 194,
};

export default function UnionVisualizer() {
    const [mode, setMode] = useState<UnionMode>("UNION");
    const [hoveredValue, setHoveredValue] = useState<string | null>(null);

    const getLineStyle = (val: string) => {
        const isHovered = hoveredValue === val;
        const isAnyHovered = hoveredValue !== null;

        if (isHovered) {
            return {
                stroke: "#38bdf8",
                strokeWidth: 2,
                opacity: 1,
            };
        }
        if (isAnyHovered) {
            return {
                stroke: "#334155",
                strokeWidth: 1,
                opacity: 0.15,
            };
        }
        return {
            stroke: "#475569",
            strokeWidth: 1.2,
            opacity: 0.5,
        };
    };

    return (
        <div className="w-full max-w-lg mx-auto my-6 not-prose select-none font-mono text-xs">
            {/* Capçaleres de columna i toggle UNION / UNION ALL */}
            <div
                className="grid items-center text-[11px] text-slate-500 font-semibold tracking-wider pb-2"
                style={{ gridTemplateColumns: "1fr 90px 1fr" }}
            >
                <div className="flex justify-between px-1">
                    <span className="text-slate-400">ciutat_dpt</span>
                    <span className="text-slate-400">ciutat_empl</span>
                </div>

                {/* Selector discret minimalista */}
                <div className="flex justify-center">
                    <div className="inline-flex p-0.5 rounded-md bg-slate-900/60 border border-white/5">
                        <button
                            type="button"
                            onClick={() => setMode("UNION")}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                                mode === "UNION"
                                    ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                                    : "text-slate-500 hover:text-slate-300 border border-transparent"
                            }`}
                        >
                            UNION
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode("UNION ALL")}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                                mode === "UNION ALL"
                                    ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                                    : "text-slate-500 hover:text-slate-300 border border-transparent"
                            }`}
                        >
                            ALL
                        </button>
                    </div>
                </div>

                <span className="text-center text-sky-400/90 font-bold">ciutat</span>
            </div>

            {/* Cos gràfic amb dues taules font i resultat */}
            <div
                className="relative grid items-center"
                style={{ gridTemplateColumns: "1fr 90px 1fr" }}
            >
                {/* Taules font d'entrada */}
                <div className="flex flex-col gap-4">
                    {/* Taula 1: departaments */}
                    <div className="flex flex-col gap-1.5">
                        {DEPT_ROWS.map((row) => {
                            const isHighlighted = hoveredValue === row.value;
                            const isDimmed = hoveredValue !== null && !isHighlighted;
                            return (
                                <button
                                    key={`dept-${row.id}`}
                                    type="button"
                                    onMouseEnter={() => setHoveredValue(row.value)}
                                    onMouseLeave={() => setHoveredValue(null)}
                                    className={`h-7 px-2.5 rounded-lg border text-left transition-all duration-150 ${
                                        isHighlighted
                                            ? "bg-sky-500/15 border-sky-400 text-sky-200 shadow-[0_0_10px_rgba(56,189,248,0.25)]"
                                            : isDimmed
                                            ? "bg-slate-900/20 border-white/5 text-slate-600 opacity-30"
                                            : "bg-slate-900/40 border-white/10 text-slate-300 hover:border-slate-600"
                                    }`}
                                >
                                    {row.value}
                                </button>
                            );
                        })}
                    </div>

                    {/* Taula 2: empleats */}
                    <div className="flex flex-col gap-1.5">
                        {EMPL_ROWS.map((row) => {
                            const isHighlighted = hoveredValue === row.value;
                            const isDimmed = hoveredValue !== null && !isHighlighted;
                            return (
                                <button
                                    key={`empl-${row.id}`}
                                    type="button"
                                    onMouseEnter={() => setHoveredValue(row.value)}
                                    onMouseLeave={() => setHoveredValue(null)}
                                    className={`h-7 px-2.5 rounded-lg border text-left transition-all duration-150 ${
                                        isHighlighted
                                            ? "bg-sky-500/15 border-sky-400 text-sky-200 shadow-[0_0_10px_rgba(56,189,248,0.25)]"
                                            : isDimmed
                                            ? "bg-slate-900/20 border-white/5 text-slate-600 opacity-30"
                                            : "bg-slate-900/40 border-white/10 text-slate-300 hover:border-slate-600"
                                    }`}
                                >
                                    {row.value}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Traçat corb de connexions SVG */}
                <svg
                    viewBox="0 0 90 208"
                    className="w-full h-[208px] pointer-events-none overflow-visible"
                >
                    {mode === "UNION" ? (
                        <>
                            {DEPT_ROWS.map((row) => {
                                const y1 = Y_IN[row.id];
                                const y2 = Y_OUT_UNION[row.value];
                                const style = getLineStyle(row.value);
                                return (
                                    <path
                                        key={`line-dept-${row.id}`}
                                        d={`M 0 ${y1} C 45 ${y1}, 45 ${y2}, 90 ${y2}`}
                                        fill="none"
                                        stroke={style.stroke}
                                        strokeWidth={style.strokeWidth}
                                        opacity={style.opacity}
                                        className="transition-all duration-200"
                                    />
                                );
                            })}
                            {EMPL_ROWS.map((row) => {
                                const y1 = Y_IN[row.id];
                                const y2 = Y_OUT_UNION[row.value];
                                const style = getLineStyle(row.value);
                                return (
                                    <path
                                        key={`line-empl-${row.id}`}
                                        d={`M 0 ${y1} C 45 ${y1}, 45 ${y2}, 90 ${y2}`}
                                        fill="none"
                                        stroke={style.stroke}
                                        strokeWidth={style.strokeWidth}
                                        opacity={style.opacity}
                                        className="transition-all duration-200"
                                    />
                                );
                            })}
                        </>
                    ) : (
                        <>
                            {DEPT_ROWS.map((row) => {
                                const y1 = Y_IN[row.id];
                                const y2 = Y_OUT_UNION_ALL[row.id];
                                const style = getLineStyle(row.value);
                                return (
                                    <path
                                        key={`line-all-dept-${row.id}`}
                                        d={`M 0 ${y1} C 45 ${y1}, 45 ${y2}, 90 ${y2}`}
                                        fill="none"
                                        stroke={style.stroke}
                                        strokeWidth={style.strokeWidth}
                                        opacity={style.opacity}
                                        className="transition-all duration-200"
                                    />
                                );
                            })}
                            {EMPL_ROWS.map((row) => {
                                const y1 = Y_IN[row.id];
                                const y2 = Y_OUT_UNION_ALL[row.id];
                                const style = getLineStyle(row.value);
                                return (
                                    <path
                                        key={`line-all-empl-${row.id}`}
                                        d={`M 0 ${y1} C 45 ${y1}, 45 ${y2}, 90 ${y2}`}
                                        fill="none"
                                        stroke={style.stroke}
                                        strokeWidth={style.strokeWidth}
                                        opacity={style.opacity}
                                        className="transition-all duration-200"
                                    />
                                );
                            })}
                        </>
                    )}
                </svg>

                {/* Columna resultant */}
                <div className="h-[208px] flex flex-col justify-center">
                    {mode === "UNION" ? (
                        <div className="flex flex-col gap-3.5">
                            {UNION_OUTPUT.map((val) => {
                                const isHighlighted = hoveredValue === val;
                                const isDimmed = hoveredValue !== null && !isHighlighted;
                                return (
                                    <button
                                        key={`out-${val}`}
                                        type="button"
                                        onMouseEnter={() => setHoveredValue(val)}
                                        onMouseLeave={() => setHoveredValue(null)}
                                        className={`h-7 px-2.5 rounded-lg border text-left transition-all duration-150 ${
                                            isHighlighted
                                                ? "bg-sky-500/15 border-sky-400 text-sky-200 shadow-[0_0_10px_rgba(56,189,248,0.25)]"
                                                : isDimmed
                                                ? "bg-slate-900/20 border-white/5 text-slate-600 opacity-30"
                                                : "bg-slate-900/40 border-white/10 text-slate-300 hover:border-slate-600"
                                        }`}
                                    >
                                        {val}
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {UNION_ALL_OUTPUT.map((row) => {
                                const isHighlighted = hoveredValue === row.value;
                                const isDimmed = hoveredValue !== null && !isHighlighted;
                                return (
                                    <button
                                        key={`out-all-${row.id}`}
                                        type="button"
                                        onMouseEnter={() => setHoveredValue(row.value)}
                                        onMouseLeave={() => setHoveredValue(null)}
                                        className={`h-7 px-2.5 rounded-lg border text-left transition-all duration-150 ${
                                            isHighlighted
                                                ? "bg-sky-500/15 border-sky-400 text-sky-200 shadow-[0_0_10px_rgba(56,189,248,0.25)]"
                                                : isDimmed
                                                ? "bg-slate-900/20 border-white/5 text-slate-600 opacity-30"
                                                : "bg-slate-900/40 border-white/10 text-slate-300 hover:border-slate-600"
                                        }`}
                                    >
                                        {row.value}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
