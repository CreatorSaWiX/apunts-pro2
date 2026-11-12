"use client";

import { useState } from "react";

type ModeId = "declare" | "assign";
type Tone = "normal" | "sky" | "amber" | "emerald" | "rose";

interface SlotItem {
    label: string;
    value: string;
    tone: Tone;
}

interface EdgeSpec {
    toSlot: 0 | 1 | 2;
    tone: Exclude<Tone, "normal">;
    dashed?: boolean;
    badge?: string;
}

interface RowSpec {
    code: string;
    tag?: string;
    tone: Exclude<Tone, "normal">;
    slots: [SlotItem, SlotItem, SlotItem];
    note: string;
    edges: EdgeSpec[];
}

interface ModeSpec {
    id: ModeId;
    label: string;
    leftHeader: string;
    rightHeader: string;
    rightSub: string;
    defaultRow: 0 | 1 | 2 | 3;
    rows: [RowSpec, RowSpec, RowSpec, RowSpec];
}

// Geometria exacta: 4 files x 36px + 3 gaps x 8px = 168px; dreta 18 + 3x36 + 2x12 + 18 = 168px
const ROW_H = 36;
const GAP_LEFT = 8;
const OFFSET_RIGHT = 18;
const GAP_RIGHT = 12;
const getYLeft = (idx: number) => idx * (ROW_H + GAP_LEFT) + ROW_H / 2;
const getYRight = (idx: number) => OFFSET_RIGHT + idx * (ROW_H + GAP_RIGHT) + ROW_H / 2;

const TONE_HEX: Record<Exclude<Tone, "normal">, string> = {
    sky: "#38bdf8",
    amber: "#f59e0b",
    emerald: "#10b981",
    rose: "#f43f5e",
};

const TONE_SLOT_CLASS: Record<Tone, string> = {
    normal: "bg-slate-900/40 border-white/10 text-slate-300",
    sky: "bg-sky-500/15 border-sky-400/70 text-sky-200 shadow-[0_0_10px_rgba(56,189,248,0.18)]",
    amber: "bg-amber-500/10 border-amber-400/60 border-dashed text-amber-200",
    emerald: "bg-emerald-500/15 border-emerald-400/70 text-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.18)]",
    rose: "bg-rose-500/15 border-rose-500/70 text-rose-200 shadow-[0_0_10px_rgba(244,63,94,0.2)]",
};

const TONE_ACTIVE_BTN: Record<Exclude<Tone, "normal">, string> = {
    sky: "bg-sky-500/15 border-sky-400 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.2)]",
    amber: "bg-amber-500/15 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.2)]",
    emerald: "bg-emerald-500/15 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.2)]",
    rose: "bg-rose-500/15 border-rose-400 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.22)]",
};

const TONE_PILL: Record<Exclude<Tone, "normal">, string> = {
    sky: "bg-sky-500/10 border-sky-500/30 text-sky-300",
    amber: "bg-amber-500/10 border-amber-500/30 text-amber-300",
    emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    rose: "bg-rose-500/10 border-rose-500/30 text-rose-300",
};

const MODES: Record<ModeId, ModeSpec> = {
    declare: {
        id: "declare",
        label: "DECLARE",
        leftHeader: "DECLARACIÓ",
        rightHeader: "MEMÒRIA LOCAL",
        rightSub: "volàtil",
        defaultRow: 3,
        rows: [
            {
                code: "x INT;",
                tag: "NULL",
                tone: "amber",
                slots: [
                    { label: "clients.dni", value: "VARCHAR(9)", tone: "normal" },
                    { label: "Tipus", value: "INT", tone: "normal" },
                    { label: "Valor", value: "NULL", tone: "amber" },
                ],
                note: "Sense inicialitzar, qualsevol variable pren valor NULL",
                edges: [
                    { toSlot: 1, tone: "amber", dashed: true },
                    { toSlot: 2, tone: "amber", badge: "∅" },
                ],
            },
            {
                code: "n INT NOT NULL;",
                tag: "✕",
                tone: "rose",
                slots: [
                    { label: "clients.dni", value: "VARCHAR(9)", tone: "normal" },
                    { label: "Restricció", value: "NOT NULL", tone: "rose" },
                    { label: "Valor", value: "ERROR (falta :=)", tone: "rose" },
                ],
                note: "NOT NULL obliga a assignar valor inicial (DEFAULT o :=)",
                edges: [
                    { toSlot: 1, tone: "rose" },
                    { toSlot: 2, tone: "rose", badge: "✕" },
                ],
            },
            {
                code: "k CONSTANT INT := 5;",
                tag: "const",
                tone: "emerald",
                slots: [
                    { label: "clients.dni", value: "VARCHAR(9)", tone: "normal" },
                    { label: "Tipus", value: "CONSTANT INT", tone: "emerald" },
                    { label: "Valor", value: "5 (immutable)", tone: "emerald" },
                ],
                note: "CONSTANT fixa el valor inicial i impedeix reassignar-lo",
                edges: [
                    { toSlot: 1, tone: "emerald" },
                    { toSlot: 2, tone: "emerald", badge: "=" },
                ],
            },
            {
                code: "d clients.dni%TYPE;",
                tag: "%TYPE",
                tone: "sky",
                slots: [
                    { label: "clients.dni", value: "VARCHAR(9)", tone: "sky" },
                    { label: "Tipus d", value: "VARCHAR(9) ✓", tone: "sky" },
                    { label: "Valor", value: "NULL", tone: "amber" },
                ],
                note: "%TYPE hereta automàticament el tipus de la columna de la BD",
                edges: [
                    { toSlot: 0, tone: "sky", dashed: true },
                    { toSlot: 1, tone: "sky", badge: "%T" },
                ],
            },
        ],
    },
    assign: {
        id: "assign",
        label: "ASSIGNACIONS",
        leftHeader: "SENTÈNCIA",
        rightHeader: "EXECUCIÓ",
        rightSub: "màx. 1 fila",
        defaultRow: 0,
        rows: [
            {
                code: "SELECT ... INTO v  (1 fila)",
                tag: "1",
                tone: "emerald",
                slots: [
                    { label: "Files", value: "1 tupla", tone: "emerald" },
                    { label: "Variable v", value: "'BCN' ✓", tone: "emerald" },
                    { label: "FOUND", value: "True", tone: "emerald" },
                ],
                note: "Si retorna exactament 1 fila, assigna el resultat i continua",
                edges: [
                    { toSlot: 0, tone: "emerald" },
                    { toSlot: 1, tone: "emerald", badge: "✓" },
                ],
            },
            {
                code: "SELECT ... INTO v  (0 files)",
                tag: "0",
                tone: "amber",
                slots: [
                    { label: "Files", value: "0 tuples", tone: "amber" },
                    { label: "Variable v", value: "NULL", tone: "amber" },
                    { label: "FOUND", value: "False", tone: "amber" },
                ],
                note: "Si no troba cap fila, deixa NULL a la variable i FOUND = False",
                edges: [
                    { toSlot: 0, tone: "amber", dashed: true },
                    { toSlot: 1, tone: "amber", badge: "∅" },
                ],
            },
            {
                code: "SELECT ... INTO v  (2+ files)",
                tag: ">1 ✕",
                tone: "rose",
                slots: [
                    { label: "Files", value: "3 tuples (> 1)", tone: "rose" },
                    { label: "Variable v", value: "ERROR ✕", tone: "rose" },
                    { label: "Excepció", value: "TOO_MANY_ROWS", tone: "rose" },
                ],
                note: "Només vàlida amb ≤ 1 fila: múltiples files llancen error",
                edges: [
                    { toSlot: 0, tone: "rose" },
                    { toSlot: 2, tone: "rose", badge: "✕" },
                ],
            },
            {
                code: "imp := import_una_com(1);",
                tag: ":=",
                tone: "sky",
                slots: [
                    { label: "Retorn f()", value: "1 valor (450)", tone: "sky" },
                    { label: "imp", value: "450 ✓", tone: "sky" },
                    { label: "Mode", value: "Escalar / :=", tone: "normal" },
                ],
                note: "Assignació directa d'una expressió, subconsulta escalar o funció",
                edges: [
                    { toSlot: 0, tone: "sky" },
                    { toSlot: 1, tone: "sky", badge: ":=" },
                ],
            },
        ],
    },
};

export default function PlpgsqlVarVisualizer() {
    const [modeId, setModeId] = useState<ModeId>("declare");
    const [activeRow, setActiveRow] = useState<0 | 1 | 2 | 3>(3);

    const mode = MODES[modeId];
    const current = mode.rows[activeRow];

    return (
        <div className="w-full max-w-xl mx-auto my-6 not-prose select-none font-mono text-xs">
            {/* Selector de mode */}
            <div className="flex items-center justify-center gap-1.5 pb-4">
                {(["declare", "assign"] as ModeId[]).map((id) => {
                    const spec = MODES[id];
                    const isSelected = modeId === id;
                    return (
                        <button
                            key={id}
                            type="button"
                            onClick={() => {
                                setModeId(id);
                                setActiveRow(spec.defaultRow);
                            }}
                            className={`px-3 py-1 rounded-md border text-[11px] transition-all duration-150 cursor-pointer ${
                                isSelected
                                    ? "bg-sky-500/15 border-sky-400 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.2)] font-semibold"
                                    : "bg-slate-900/30 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10"
                            }`}
                        >
                            {spec.label}
                        </button>
                    );
                })}
            </div>

            {/* Capçaleres */}
            <div
                className="grid items-center text-[10px] text-slate-500 font-semibold tracking-wider pb-2"
                style={{ gridTemplateColumns: "1.2fr 56px 1fr" }}
            >
                <span>{mode.leftHeader}</span>
                <span />
                <div className="flex items-center justify-between">
                    <span>{mode.rightHeader}</span>
                    <span className="text-slate-600">{mode.rightSub}</span>
                </div>
            </div>

            {/* Cos principal: files a l'esquerra + corbes SVG + targetes d'estat a la dreta */}
            <div
                className="relative grid items-center"
                style={{ gridTemplateColumns: "1.2fr 56px 1fr" }}
            >
                {/* Columna esquerra */}
                <div className="flex flex-col gap-2">
                    {mode.rows.map((row, idx) => {
                        const rowIdx = idx as 0 | 1 | 2 | 3;
                        const isActive = activeRow === rowIdx;
                        const isDimmed = !isActive;

                        return (
                            <button
                                key={`${modeId}-${idx}`}
                                type="button"
                                onMouseEnter={() => setActiveRow(rowIdx)}
                                onClick={() => setActiveRow(rowIdx)}
                                className={`h-9 px-2.5 rounded-lg border text-left transition-all duration-150 cursor-pointer flex items-center justify-between gap-1.5 ${
                                    isActive
                                        ? TONE_ACTIVE_BTN[row.tone]
                                        : isDimmed
                                        ? "bg-slate-900/35 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/15"
                                        : ""
                                }`}
                            >
                                <span className="truncate text-[10.5px] sm:text-[11px]">{row.code}</span>
                                {row.tag && (
                                    <span className="text-[10px] font-bold opacity-80 shrink-0">
                                        {row.tag}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Connexions SVG alineades al píxel */}
                <svg
                    viewBox="0 0 56 168"
                    className="w-full h-[168px] pointer-events-none overflow-visible"
                >
                    <defs>
                        {(Object.keys(TONE_HEX) as Exclude<Tone, "normal">[]).map((tone) => (
                            <marker
                                key={tone}
                                id={`var-arrow-${tone}`}
                                viewBox="0 0 6 6"
                                refX="4.5"
                                refY="3"
                                markerWidth="4.5"
                                markerHeight="4.5"
                                orient="auto"
                            >
                                <path d="M 0 0 L 6 3 L 0 6 z" fill={TONE_HEX[tone]} />
                            </marker>
                        ))}
                    </defs>

                    {current.edges.map((edge, i) => {
                        const y1 = getYLeft(activeRow);
                        const y2 = getYRight(edge.toSlot);
                        const color = TONE_HEX[edge.tone];
                        return (
                            <g key={`${modeId}-${activeRow}-edge-${i}`}>
                                <path
                                    d={`M 0,${y1} C 28,${y1} 28,${y2} 53,${y2}`}
                                    fill="none"
                                    stroke={color}
                                    strokeWidth={edge.dashed ? 1.5 : 1.9}
                                    strokeDasharray={edge.dashed ? "3 3" : undefined}
                                    markerEnd={`url(#var-arrow-${edge.tone})`}
                                    className="transition-all duration-200"
                                />
                                {edge.badge && (
                                    <g transform={`translate(28, ${(y1 + y2) / 2})`}>
                                        <rect
                                            x="-11"
                                            y="-8"
                                            width="22"
                                            height="16"
                                            rx="4"
                                            fill="#020617"
                                            stroke={color}
                                            strokeWidth="1"
                                        />
                                        <text
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            y="0.5"
                                            fill={color}
                                            fontSize="9"
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

                {/* Columna dreta */}
                <div
                    className="flex flex-col gap-3"
                    style={{ paddingTop: `${OFFSET_RIGHT}px`, paddingBottom: `${OFFSET_RIGHT}px` }}
                >
                    {current.slots.map((slot) => (
                        <div
                            key={slot.label}
                            className={`h-9 px-2.5 rounded-lg border flex items-center justify-between gap-2 transition-all duration-200 ${TONE_SLOT_CLASS[slot.tone]}`}
                        >
                            <span className="text-[10px] opacity-70 truncate">{slot.label}</span>
                            <span className="text-[11px] font-bold truncate shrink-0">{slot.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Nota compacta en 1 línia */}
            <div className="mt-4 flex justify-center">
                <div className={`px-3 py-1 rounded-lg border text-[11px] transition-colors ${TONE_PILL[current.tone]}`}>
                    {current.note}
                </div>
            </div>
        </div>
    );
}
