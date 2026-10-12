"use client";

import { useState } from "react";

interface BaseRow {
    id: number;
    num_empl: number;
    nom_empl: string;
    sou: number;
    souLabel: string;
    num_dpt: number;
    ciutat: string;
    targetIndex: number | null; // index a la vista virtual si passa sou >= 200k
}

interface ViewRow {
    targetIndex: number;
    num_empl: number;
    nom_empl: string;
    sou: number;
    souLabel: string;
    num_dpt: number;
    baseId: number;
}

const BASE_ROWS: BaseRow[] = [
    { id: 0, num_empl: 1, nom_empl: "CARME", sou: 400000, souLabel: "400k", num_dpt: 1, ciutat: "BCN", targetIndex: 0 },
    { id: 1, num_empl: 2, nom_empl: "EUGENIA", sou: 350000, souLabel: "350k", num_dpt: 2, ciutat: "MAD", targetIndex: 1 },
    { id: 2, num_empl: 3, nom_empl: "JOSEP", sou: 150000, souLabel: "150k", num_dpt: 3, ciutat: "BCN", targetIndex: null },
    { id: 3, num_empl: 4, nom_empl: "RICARDO", sou: 220000, souLabel: "220k", num_dpt: 2, ciutat: "BCN", targetIndex: 2 },
    { id: 4, num_empl: 11, nom_empl: "NURIA", sou: 100000, souLabel: "100k", num_dpt: 3, ciutat: "MAD", targetIndex: null },
];

const VIEW_ROWS: ViewRow[] = [
    { targetIndex: 0, num_empl: 1, nom_empl: "CARME", sou: 400000, souLabel: "400k", num_dpt: 1, baseId: 0 },
    { targetIndex: 1, num_empl: 2, nom_empl: "EUGENIA", sou: 350000, souLabel: "350k", num_dpt: 2, baseId: 1 },
    { targetIndex: 2, num_empl: 4, nom_empl: "RICARDO", sou: 220000, souLabel: "220k", num_dpt: 2, baseId: 3 },
];

// Càlcul precís de coordenades per a les corbes SVG
const ROW_HEIGHT = 32;
const GAP_IN = 8;
const GAP_OUT = 24;
const OFFSET_OUT = 24;

const getYIn = (index: number) => index * (ROW_HEIGHT + GAP_IN) + ROW_HEIGHT / 2;
const getYOut = (index: number) => OFFSET_OUT + index * (ROW_HEIGHT + GAP_OUT) + ROW_HEIGHT / 2;

type Mode = "def" | "filter";

export default function ViewVisualizer() {
    const [mode, setMode] = useState<Mode>("def");
    const [hoveredBaseId, setHoveredBaseId] = useState<number | null>(null);
    const [hoveredViewIdx, setHoveredViewIdx] = useState<number | null>(null);

    // Determina si una fila concreta està activa segons hover o mode
    const getActiveState = (baseId: number, targetIdx: number | null) => {
        // En mode consulta filter (WHERE num_dpt = 2):
        if (mode === "filter") {
            const isDpt2 = targetIdx !== null && (targetIdx === 1 || targetIdx === 2); // Eugenia i Ricardo
            if (hoveredBaseId !== null || hoveredViewIdx !== null) {
                const matchHover =
                    (hoveredBaseId !== null && hoveredBaseId === baseId) ||
                    (hoveredViewIdx !== null && hoveredViewIdx === targetIdx);
                return { isHighlight: matchHover, isDim: !matchHover };
            }
            return { isHighlight: isDpt2, isDim: !isDpt2 };
        }

        // En mode definició CREATE VIEW:
        if (hoveredBaseId !== null || hoveredViewIdx !== null) {
            const matchHover =
                (hoveredBaseId !== null && hoveredBaseId === baseId) ||
                (hoveredViewIdx !== null && hoveredViewIdx === targetIdx);
            return { isHighlight: matchHover, isDim: !matchHover };
        }

        return { isHighlight: false, isDim: false };
    };

    return (
        <div className="w-full my-8 not-prose select-none font-mono flex flex-col items-center justify-center">
            {/* Selector interactiu minimalista */}
            <div className="flex items-center gap-2 mb-6 text-[11px]">
                <button
                    type="button"
                    onClick={() => {
                        setMode("def");
                        setHoveredBaseId(null);
                        setHoveredViewIdx(null);
                    }}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                        mode === "def"
                            ? "bg-emerald-500/15 text-emerald-300 font-semibold"
                            : "text-slate-500 hover:text-slate-300"
                    }`}
                >
                    CREATE VIEW
                </button>
                <span className="text-slate-700">/</span>
                <button
                    type="button"
                    onClick={() => {
                        setMode("filter");
                        setHoveredBaseId(null);
                        setHoveredViewIdx(null);
                    }}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                        mode === "filter"
                            ? "bg-sky-500/15 text-sky-300 font-semibold"
                            : "text-slate-500 hover:text-slate-300"
                    }`}
                >
                    WHERE num_dpt = 2
                </button>
            </div>

            {/* Esquema visual de dues taules connectades */}
            <div className="w-full max-w-3xl overflow-x-auto py-2">
                <div className="min-w-[580px] flex items-center justify-center gap-0">
                    {/* TAULA BASE: empleats */}
                    <div className="flex flex-col flex-1 max-w-[280px]">
                        <div className="flex items-baseline justify-between mb-2 px-1 text-[11px]">
                            <span className="font-semibold text-slate-300">empleats</span>
                            <span className="text-[10px] text-slate-500">taula física</span>
                        </div>

                        {/* Capçaleres */}
                        <div className="grid grid-cols-5 text-[10px] text-slate-500 font-semibold pb-1.5 px-2 border-b border-white/10 text-center">
                            <span>num</span>
                            <span>nom</span>
                            <span>sou</span>
                            <span>dpt</span>
                            <span className="text-slate-600 line-through" title="No projectada al SELECT">ciutat</span>
                        </div>

                        {/* Files d'entrada */}
                        <div className="flex flex-col gap-2 mt-2">
                            {BASE_ROWS.map((row) => {
                                const { isHighlight, isDim } = getActiveState(row.id, row.targetIndex);
                                const isExcluded = row.targetIndex === null;

                                return (
                                    <div
                                        key={row.id}
                                        onMouseEnter={() => setHoveredBaseId(row.id)}
                                        onMouseLeave={() => setHoveredBaseId(null)}
                                        className={`h-8 px-2 rounded-lg border grid grid-cols-5 items-center text-center text-xs transition-all duration-200 cursor-pointer ${
                                            isHighlight
                                                ? "bg-emerald-500/15 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                                                : isDim || (isExcluded && hoveredBaseId === null && hoveredViewIdx === null)
                                                ? "bg-slate-900/10 border-white/5 text-slate-600 opacity-40"
                                                : "bg-slate-900/40 border-white/10 text-slate-300 hover:border-slate-700"
                                        }`}
                                    >
                                        <span className="font-mono">{row.num_empl}</span>
                                        <span className="truncate">{row.nom_empl}</span>
                                        <span className={isExcluded ? "text-slate-600" : "text-amber-400/90 font-medium"}>
                                            {row.souLabel}
                                        </span>
                                        <span>{row.num_dpt}</span>
                                        <span className="text-slate-600 text-[10px]">{row.ciutat}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* CONNECTOR CENTRAL SVG */}
                    <div className="relative w-20 sm:w-28 h-[192px] shrink-0 mt-8">
                        <svg
                            viewBox="0 0 100 192"
                            className="w-full h-full pointer-events-none overflow-visible"
                        >
                            {BASE_ROWS.filter((r) => r.targetIndex !== null).map((row) => {
                                const y1 = getYIn(row.id);
                                const y2 = getYOut(row.targetIndex!);
                                const { isHighlight, isDim } = getActiveState(row.id, row.targetIndex);

                                return (
                                    <path
                                        key={row.id}
                                        d={`M 0,${y1} C 50,${y1} 50,${y2} 100,${y2}`}
                                        fill="none"
                                        stroke={
                                            isHighlight
                                                ? mode === "filter" ? "#38bdf8" : "#10b981"
                                                : isDim
                                                ? "#1e293b"
                                                : "#334155"
                                        }
                                        strokeWidth={isHighlight ? 2 : 1.25}
                                        strokeOpacity={isDim ? 0.2 : isHighlight ? 1 : 0.6}
                                        className="transition-all duration-200"
                                    />
                                );
                            })}
                        </svg>

                        {/* Etiqueta flotant de filtre */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-[9px] text-slate-500 bg-[#020617] px-1.5 py-0.5 rounded border border-white/10 whitespace-nowrap">
                                {mode === "filter" ? "dpt = 2" : "sou ≥ 200k"}
                            </span>
                        </div>
                    </div>

                    {/* VISTA VIRTUAL: empleats_altsous */}
                    <div className="flex flex-col flex-1 max-w-[240px]">
                        <div className="flex items-baseline justify-between mb-2 px-1 text-[11px]">
                            <span className="font-semibold text-emerald-400">empleats_altsous</span>
                            <span className="text-[10px] text-emerald-500/80">vista virtual</span>
                        </div>

                        {/* Capçaleres */}
                        <div className="grid grid-cols-4 text-[10px] text-slate-500 font-semibold pb-1.5 px-2 border-b border-emerald-500/20 text-center">
                            <span>num</span>
                            <span>nom</span>
                            <span>sou</span>
                            <span>dpt</span>
                        </div>

                        {/* Files de sortida */}
                        <div
                            className="flex flex-col gap-[24px]"
                            style={{ paddingTop: `${OFFSET_OUT}px`, paddingBottom: `${OFFSET_OUT}px` }}
                        >
                            {VIEW_ROWS.map((row) => {
                                const { isHighlight, isDim } = getActiveState(row.baseId, row.targetIndex);

                                return (
                                    <div
                                        key={row.targetIndex}
                                        onMouseEnter={() => setHoveredViewIdx(row.targetIndex)}
                                        onMouseLeave={() => setHoveredViewIdx(null)}
                                        className={`h-8 px-2 rounded-lg border grid grid-cols-4 items-center text-center text-xs transition-all duration-200 cursor-pointer ${
                                            isHighlight
                                                ? mode === "filter"
                                                    ? "bg-sky-500/20 border-sky-400 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.25)]"
                                                    : "bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.25)]"
                                                : isDim
                                                ? "bg-slate-900/10 border-white/5 text-slate-600 opacity-40"
                                                : "bg-emerald-500/5 border-emerald-500/30 text-emerald-300 hover:border-emerald-400/50"
                                        }`}
                                    >
                                        <span className="font-mono">{row.num_empl}</span>
                                        <span className="truncate">{row.nom_empl}</span>
                                        <span className="text-amber-400/90 font-medium">{row.souLabel}</span>
                                        <span>{row.num_dpt}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
