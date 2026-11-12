"use client";

import { useState } from "react";

type ModeId = "cursor" | "null_types" | "empty";
type Tone = "normal" | "sky" | "amber" | "emerald" | "rose";

interface SlotView {
    label: string;
    display: string;
    tone: Tone;
}

interface CurveEdge {
    fromRow: 0 | 1 | 2 | 3;
    toSlot: 0 | 1 | 2;
    tone: Exclude<Tone, "normal">;
    dashed?: boolean;
    badge?: string;
}

interface RowItem {
    badge: string;
    code: string;
    tag?: string;
    rowTone: Tone;
    slots: [SlotView, SlotView, SlotView];
    edges: CurveEdge[];
    statusText: string;
    statusTone: Tone;
}

interface ModeConfig {
    id: ModeId;
    label: string;
    tone: Exclude<Tone, "normal">;
    leftHeader: string;
    rightHeader: string;
    isSequential: boolean;
    defaultIdx: number;
    rows: [RowItem, RowItem, RowItem, RowItem];
}

// Geometria exacta: esquerra 4x36px + 3x8px = 168px; dreta 3x36px + 2x12px + 2x18px = 168px
const ROW_H = 36;
const GAP_LEFT = 8;
const OFFSET_RIGHT = 18;
const GAP_RIGHT = 12;
const TOTAL_H = 4 * ROW_H + 3 * GAP_LEFT; // 168px
const SVG_W = 56;

const getYLeft = (idx: number) => idx * (ROW_H + GAP_LEFT) + ROW_H / 2;
const getYRight = (idx: number) => OFFSET_RIGHT + idx * (ROW_H + GAP_RIGHT) + ROW_H / 2;

const TONE_HEX: Record<Tone, string> = {
    normal: "#475569",
    sky: "#38bdf8",
    amber: "#f59e0b",
    emerald: "#10b981",
    rose: "#f43f5e",
};

const TONE_TAB: Record<ModeConfig["tone"], string> = {
    sky: "bg-sky-500/15 border-sky-400 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.2)] font-semibold",
    amber: "bg-amber-500/15 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)] font-semibold",
    emerald: "bg-emerald-500/15 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)] font-semibold",
    rose: "bg-rose-500/15 border-rose-400 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)] font-semibold",
};

const TONE_CELL: Record<Tone, string> = {
    normal: "bg-slate-900/40 border-white/10 text-slate-300",
    sky: "bg-sky-500/15 border-sky-400/70 text-sky-200 shadow-[0_0_10px_rgba(56,189,248,0.18)]",
    amber: "bg-amber-500/10 border-amber-400/60 border-dashed text-amber-200",
    emerald: "bg-emerald-500/15 border-emerald-400/70 text-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.18)]",
    rose: "bg-rose-500/15 border-rose-500/70 text-rose-200 shadow-[0_0_10px_rgba(244,63,94,0.2)]",
};

const TONE_ROW_ACTIVE: Record<Tone, string> = {
    normal: "bg-slate-800/80 border-slate-400 text-slate-100",
    sky: "bg-sky-500/15 border-sky-400 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.2)]",
    amber: "bg-amber-500/15 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.2)]",
    emerald: "bg-emerald-500/15 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.2)]",
    rose: "bg-rose-500/15 border-rose-400 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.22)]",
};

const TONE_PILL: Record<Tone, string> = {
    normal: "bg-slate-900/50 border-white/10 text-slate-400",
    sky: "bg-sky-500/10 border-sky-500/30 text-sky-300",
    amber: "bg-amber-500/10 border-amber-500/30 text-amber-300",
    emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    rose: "bg-rose-500/10 border-rose-500/30 text-rose-300",
};

const MODES: ModeConfig[] = [
    {
        id: "cursor",
        label: "CURSOR & wasNull()",
        tone: "amber",
        leftHeader: "CURSOR ResultSet (activitats)",
        rightHeader: "LECTURA JAVA",
        isSequential: false,
        defaultIdx: 3,
        rows: [
            {
                badge: "0",
                code: "Abans de la 1a fila",
                tag: "inicial",
                rowTone: "rose",
                slots: [
                    { label: "rs.next()", display: "no cridat", tone: "amber" },
                    { label: "getInt()", display: "SQLException ✕", tone: "rose" },
                    { label: "wasNull()", display: "—", tone: "normal" },
                ],
                edges: [{ fromRow: 0, toSlot: 1, tone: "rose", dashed: true, badge: "✕" }],
                statusText: "Inicialment apunta abans de la 1a fila · cal cridar rs.next() abans de llegir",
                statusTone: "rose",
            },
            {
                badge: "→1",
                code: "\"Taller\" | 15",
                tag: "next=true",
                rowTone: "sky",
                slots: [
                    { label: "rs.next()", display: "true ✓", tone: "emerald" },
                    { label: "getInt()", display: "15", tone: "sky" },
                    { label: "wasNull()", display: "false", tone: "normal" },
                ],
                edges: [
                    { fromRow: 1, toSlot: 0, tone: "emerald", dashed: true },
                    { fromRow: 1, toSlot: 1, tone: "sky", badge: "15" },
                ],
                statusText: "rs.next() avança a fila 1 · getInt(\"preu\") retorna 15",
                statusTone: "sky",
            },
            {
                badge: "→2",
                code: "\"Xerrada\" | 0",
                tag: "0 real",
                rowTone: "emerald",
                slots: [
                    { label: "rs.next()", display: "true ✓", tone: "emerald" },
                    { label: "getInt()", display: "0", tone: "sky" },
                    { label: "wasNull()", display: "false ✓", tone: "emerald" },
                ],
                edges: [
                    { fromRow: 2, toSlot: 1, tone: "sky" },
                    { fromRow: 2, toSlot: 2, tone: "emerald", badge: "0 ✓" },
                ],
                statusText: "Preu és 0 a la BD: getInt() retorna 0 i wasNull() retorna false",
                statusTone: "emerald",
            },
            {
                badge: "→3",
                code: "\"Festa\" | NULL",
                tag: "NULL!",
                rowTone: "amber",
                slots: [
                    { label: "rs.next()", display: "true ✓", tone: "emerald" },
                    { label: "getInt()", display: "0 ⚠", tone: "amber" },
                    { label: "wasNull()", display: "true ⚠", tone: "amber" },
                ],
                edges: [
                    { fromRow: 3, toSlot: 1, tone: "amber", dashed: true, badge: "0?" },
                    { fromRow: 3, toSlot: 2, tone: "amber", badge: "NULL" },
                ],
                statusText: "SQL NULL retorna 0 a getInt() · només rs.wasNull() == true el distingeix de 0",
                statusTone: "amber",
            },
        ],
    },
    {
        id: "null_types",
        label: "String vs int (NULL)",
        tone: "sky",
        leftHeader: "COLUMNA SQL → GETTER JAVA",
        rightHeader: "DETECCIÓ NULL",
        isSequential: false,
        defaultIdx: 3,
        rows: [
            {
                badge: "Str",
                code: "'Taller' → getString()",
                tag: "valor",
                rowTone: "sky",
                slots: [
                    { label: "Valor", display: "\"Taller\"", tone: "sky" },
                    { label: "== null?", display: "false", tone: "normal" },
                    { label: "Mètode", display: "directe ✓", tone: "emerald" },
                ],
                edges: [{ fromRow: 0, toSlot: 0, tone: "sky" }],
                statusText: "Una columna amb text retorna el String normalment",
                statusTone: "sky",
            },
            {
                badge: "Str",
                code: "NULL → getString()",
                tag: "null",
                rowTone: "emerald",
                slots: [
                    { label: "Valor", display: "null", tone: "emerald" },
                    { label: "== null?", display: "true ✓", tone: "emerald" },
                    { label: "Mètode", display: "if (s == null)", tone: "emerald" },
                ],
                edges: [
                    { fromRow: 1, toSlot: 0, tone: "emerald", dashed: true },
                    { fromRow: 1, toSlot: 1, tone: "emerald", badge: "✓" },
                ],
                statusText: "Classes Java (String, Date): NULL SQL arriba directament com a null",
                statusTone: "emerald",
            },
            {
                badge: "int",
                code: "0 → getInt()",
                tag: "0 real",
                rowTone: "sky",
                slots: [
                    { label: "Valor", display: "0", tone: "sky" },
                    { label: "wasNull()", display: "false ✓", tone: "emerald" },
                    { label: "Mètode", display: "getInt + wasNull", tone: "sky" },
                ],
                edges: [{ fromRow: 2, toSlot: 1, tone: "emerald", badge: "F" }],
                statusText: "Tipus primitiu amb 0 real: getInt() = 0 i wasNull() = false",
                statusTone: "sky",
            },
            {
                badge: "int",
                code: "NULL → getInt()",
                tag: "0 ⚠",
                rowTone: "amber",
                slots: [
                    { label: "Valor", display: "0 (ambigu!)", tone: "amber" },
                    { label: "wasNull()", display: "true ⚠", tone: "amber" },
                    { label: "Mètode", display: "if (rs.wasNull())", tone: "rose" },
                ],
                edges: [
                    { fromRow: 3, toSlot: 0, tone: "amber", dashed: true },
                    { fromRow: 3, toSlot: 1, tone: "amber", badge: "T" },
                ],
                statusText: "Primitius (int, float, double): SQL NULL retorna 0 → cal rs.wasNull() tot seguit",
                statusTone: "amber",
            },
        ],
    },
    {
        id: "empty",
        label: "0 FILES (buit)",
        tone: "rose",
        leftHeader: "CONSULTA SENSE RESULTATS",
        rightHeader: "COMPTADOR quants",
        isSequential: true,
        defaultIdx: 3,
        rows: [
            {
                badge: "1",
                code: "rs = st.executeQuery(...)",
                tag: "0 files",
                rowTone: "sky",
                slots: [
                    { label: "rs", display: "buit (0 files)", tone: "sky" },
                    { label: "quants", display: "0", tone: "normal" },
                    { label: "Sortida", display: "—", tone: "normal" },
                ],
                edges: [{ fromRow: 0, toSlot: 0, tone: "sky" }],
                statusText: "executeQuery() no retorna null si no hi ha files: retorna un ResultSet buit",
                statusTone: "sky",
            },
            {
                badge: "2",
                code: "while (rs.next())",
                tag: "false!",
                rowTone: "amber",
                slots: [
                    { label: "rs.next()", display: "false", tone: "amber" },
                    { label: "quants", display: "0", tone: "normal" },
                    { label: "Sortida", display: "no entra", tone: "normal" },
                ],
                edges: [{ fromRow: 1, toSlot: 0, tone: "amber", badge: "F" }],
                statusText: "La 1a crida a rs.next() retorna false i salta tot el bucle while",
                statusTone: "amber",
            },
            {
                badge: "3",
                code: "if (quants == 0)",
                tag: "true ✓",
                rowTone: "rose",
                slots: [
                    { label: "rs.next()", display: "false", tone: "normal" },
                    { label: "quants", display: "0 == 0 ✓", tone: "rose" },
                    { label: "Sortida", display: "\"Sense resultats\"", tone: "rose" },
                ],
                edges: [
                    { fromRow: 2, toSlot: 1, tone: "rose" },
                    { fromRow: 2, toSlot: 2, tone: "rose", badge: "0" },
                ],
                statusText: "El comptador detecta que no s'ha processat cap fila",
                statusTone: "rose",
            },
            {
                badge: "4",
                code: "rs.close();",
                tag: "tanca",
                rowTone: "emerald",
                slots: [
                    { label: "Cursor", display: "tancat ✓", tone: "emerald" },
                    { label: "quants", display: "0", tone: "normal" },
                    { label: "Sortida", display: "\"Sense resultats\"", tone: "rose" },
                ],
                edges: [{ fromRow: 3, toSlot: 0, tone: "emerald", badge: "✓" }],
                statusText: "Cal tancar el ResultSet (rs.close()) en acabar de recórrer-lo",
                statusTone: "emerald",
            },
        ],
    },
];

/**
 * Interactive minimalist visualizer for JDBC `ResultSet` cursor movement,
 * `0` vs `NULL` (`wasNull()`) on primitives vs reference types, and empty results.
 */
export default function ResultSetVisualizer() {
    const [modeId, setModeId] = useState<ModeId>("cursor");
    const [activeIdx, setActiveIdx] = useState<number>(3);

    const activeMode = MODES.find((m) => m.id === modeId) || MODES[0];
    const current = activeMode.rows[activeIdx] || activeMode.rows[0];

    return (
        <div className="w-full max-w-xl mx-auto my-6 not-prose select-none font-mono text-xs">
            {/* Selector de vista */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pb-4">
                {MODES.map((item) => {
                    const isSelected = item.id === modeId;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                                setModeId(item.id);
                                setActiveIdx(item.defaultIdx);
                            }}
                            className={`px-2.5 py-1 rounded-md border text-[11px] transition-all duration-150 cursor-pointer ${
                                isSelected
                                    ? TONE_TAB[item.tone]
                                    : "bg-slate-900/30 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10"
                            }`}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </div>

            {/* Capçaleres */}
            <div
                className="grid items-center text-[10px] text-slate-500 font-semibold tracking-wider pb-2"
                style={{ gridTemplateColumns: `minmax(0, 1.25fr) ${SVG_W}px minmax(0, 1fr)` }}
            >
                <span className="truncate pr-1">{activeMode.leftHeader}</span>
                <span />
                <span className="text-right truncate pl-1">{activeMode.rightHeader}</span>
            </div>

            {/* Cos principal: files/passos (esquerra) + corbes SVG + lectura Java (dreta) */}
            <div
                className="relative grid items-center"
                style={{ gridTemplateColumns: `minmax(0, 1.25fr) ${SVG_W}px minmax(0, 1fr)` }}
            >
                <div className="flex flex-col gap-2">
                    {activeMode.rows.map((row, idx) => {
                        const isActive = activeIdx === idx;
                        const isDimmed = activeMode.isSequential
                            ? idx > activeIdx
                            : !isActive;

                        return (
                            <button
                                key={`${activeMode.id}-${idx}`}
                                type="button"
                                onMouseEnter={() => setActiveIdx(idx)}
                                onClick={() => setActiveIdx(idx)}
                                className={`h-9 px-2 rounded-lg border text-left transition-all duration-150 cursor-pointer flex items-center justify-between gap-1.5 ${
                                    isActive
                                        ? TONE_ROW_ACTIVE[row.rowTone]
                                        : isDimmed
                                        ? "bg-slate-900/20 border-white/5 text-slate-500 opacity-45 hover:opacity-80"
                                        : "bg-slate-900/50 border-white/10 text-slate-300 hover:border-slate-600"
                                }`}
                            >
                                <div className="flex items-center gap-1.5 min-w-0">
                                    <span
                                        className={`px-1 py-0.5 rounded text-[9px] font-bold border shrink-0 ${
                                            isActive
                                                ? "bg-white/10 border-current/30"
                                                : "bg-slate-900/60 border-white/10 text-slate-500"
                                        }`}
                                    >
                                        {row.badge}
                                    </span>
                                    <span className="truncate text-[11px]">{row.code}</span>
                                </div>
                                {row.tag && (
                                    <span className="text-[9.5px] font-bold opacity-85 shrink-0">
                                        {row.tag}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Connexions SVG alineades al píxel */}
                <svg
                    viewBox={`0 0 ${SVG_W} ${TOTAL_H}`}
                    style={{ height: `${TOTAL_H}px` }}
                    className="w-full pointer-events-none overflow-visible"
                >
                    {current.edges.map((edge, i) => {
                        const y1 = getYLeft(edge.fromRow);
                        const y2 = getYRight(edge.toSlot);
                        const stroke = TONE_HEX[edge.tone];
                        return (
                            <g key={`${activeMode.id}-${activeIdx}-edge-${i}`}>
                                <path
                                    d={`M 0,${y1} C ${SVG_W / 2},${y1} ${SVG_W / 2},${y2} ${SVG_W},${y2}`}
                                    fill="none"
                                    stroke={stroke}
                                    strokeWidth={edge.dashed ? 1.5 : 2}
                                    strokeDasharray={edge.dashed ? "3 3" : undefined}
                                    strokeOpacity={0.9}
                                    className="transition-all duration-200"
                                />
                                {edge.badge && (
                                    <g transform={`translate(${SVG_W / 2}, ${(y1 + y2) / 2})`}>
                                        <rect
                                            x="-13"
                                            y="-8"
                                            width="26"
                                            height="16"
                                            rx="4"
                                            fill="#020617"
                                            stroke={stroke}
                                            strokeWidth="1"
                                        />
                                        <text
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            y="1"
                                            fill={stroke}
                                            fontSize="8.5"
                                            fontWeight="bold"
                                        >
                                            {edge.badge}
                                        </text>
                                    </g>
                                )}
                            </g>
                        );
                    })}
                </svg>

                {/* Resultats llegits en Java */}
                <div
                    className="flex flex-col gap-3"
                    style={{ paddingTop: `${OFFSET_RIGHT}px`, paddingBottom: `${OFFSET_RIGHT}px` }}
                >
                    {current.slots.map((slot, idx) => (
                        <div
                            key={`${activeMode.id}-slot-${idx}`}
                            className={`h-9 px-2.5 rounded-lg border flex items-center justify-between gap-1.5 transition-all duration-200 ${TONE_CELL[slot.tone]}`}
                        >
                            <span className="font-bold text-[10px] opacity-80 shrink-0">
                                {slot.label}
                            </span>
                            <span className="text-[11px] font-semibold tabular-nums truncate">
                                {slot.display}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Resum en 1 línia */}
            <div className="mt-3 flex justify-center">
                <div
                    className={`px-3 py-1 rounded-lg border text-[11px] text-center transition-colors ${TONE_PILL[current.statusTone]}`}
                >
                    {current.statusText}
                </div>
            </div>
        </div>
    );
}
