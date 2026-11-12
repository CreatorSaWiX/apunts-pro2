"use client";

import { useState } from "react";

type ModeId = "select" | "update" | "insert" | "delete" | "phantom";
type Tone = "sky" | "amber" | "emerald" | "rose" | "violet";
type RowState = "active" | "dimmed" | "inserted" | "deleted" | "phantom" | "ghost" | "control";

interface LeftRowView {
    id: string;
    pk: string;
    name: string;
    meta: string;
    state: RowState;
    tone: Tone;
    tag?: string;
}

interface RightOpView {
    rowId: string;
    readLabel?: string;
    writePair?: { ru: string; w: string };
    tone: Tone;
    tag?: string;
}

interface ViewFrame {
    rows: LeftRowView[];
    ops: RightOpView[];
    statusText: string;
    statusTone: Tone;
}

interface ModeConfig {
    id: ModeId;
    label: string;
    sqlVerb: string;
    sqlRest?: string;
    tone: Tone;
    activeClass: string;
    frame?: ViewFrame;
}

interface PhantomStepConfig {
    id: number;
    label: string;
    tone: Tone;
    frame: ViewFrame;
}

// Geometria exacta per alinear corbes SVG amb files de 36px (h-9) i gap de 8px (gap-2)
const ROW_H = 36;
const GAP = 8;
const SVG_W = 56;

const getYLeft = (idx: number) => idx * (ROW_H + GAP) + ROW_H / 2;
const getYRight = (idx: number, offset: number) => offset + idx * (ROW_H + GAP) + ROW_H / 2;

const BASE_ROWS: { id: string; pk: string; name: string; meta: string }[] = [
    { id: "1", pk: "1", name: "CARME", meta: "dpt 1" },
    { id: "2", pk: "2", name: "JOSEP", meta: "dpt 1" },
    { id: "3", pk: "3", name: "NURIA", meta: "dpt 2" },
];

function makeBaseRows(activeIds: string[], activeTone: Tone, activeState: RowState = "active"): LeftRowView[] {
    return BASE_ROWS.map((r) => {
        const isMatched = activeIds.includes(r.id);
        return {
            ...r,
            state: isMatched ? activeState : "dimmed",
            tone: activeTone,
        };
    });
}

const MODES: ModeConfig[] = [
    {
        id: "select",
        label: "SELECT",
        sqlVerb: "SELECT",
        sqlRest: "* FROM emp WHERE dpt = 1;",
        tone: "sky",
        activeClass: "bg-sky-500/15 border-sky-400 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.2)] font-semibold",
        frame: {
            rows: makeBaseRows(["1", "2"], "sky"),
            ops: [
                { rowId: "1", readLabel: "R(1)", tone: "sky" },
                { rowId: "2", readLabel: "R(2)", tone: "sky" },
            ],
            statusText: "SELECT → R(G) per cada fila llegida · sense IC",
            statusTone: "sky",
        },
    },
    {
        id: "update",
        label: "UPDATE",
        sqlVerb: "UPDATE",
        sqlRest: "emp SET sou = 200 WHERE dpt = 1;",
        tone: "amber",
        activeClass: "bg-amber-500/15 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)] font-semibold",
        frame: {
            rows: makeBaseRows(["1", "2"], "amber"),
            ops: [
                { rowId: "1", writePair: { ru: "RU(1)", w: "W(1)" }, tone: "amber" },
                { rowId: "2", writePair: { ru: "RU(2)", w: "W(2)" }, tone: "amber" },
            ],
            statusText: "UPDATE → RU(G), W(G) per cada fila afectada",
            statusTone: "amber",
        },
    },
    {
        id: "insert",
        label: "INSERT",
        sqlVerb: "INSERT",
        sqlRest: "INTO emp VALUES (4, 'PAU', 2);",
        tone: "emerald",
        activeClass: "bg-emerald-500/15 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)] font-semibold",
        frame: {
            rows: [
                ...makeBaseRows([], "emerald"),
                { id: "4", pk: "4", name: "PAU", meta: "dpt 2", state: "inserted", tone: "emerald", tag: "+" },
            ],
            ops: [
                { rowId: "4", writePair: { ru: "RU(4)", w: "W(4)" }, tone: "emerald" },
            ],
            statusText: "INSERT → RU(4), W(4) · sense IC (no hi ha fantasma)",
            statusTone: "emerald",
        },
    },
    {
        id: "delete",
        label: "DELETE",
        sqlVerb: "DELETE",
        sqlRest: "FROM emp WHERE id = 3;",
        tone: "rose",
        activeClass: "bg-rose-500/15 border-rose-400 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)] font-semibold",
        frame: {
            rows: makeBaseRows(["3"], "rose", "deleted"),
            ops: [
                { rowId: "3", writePair: { ru: "RU(3)", w: "W(3)" }, tone: "rose" },
            ],
            statusText: "DELETE → RU(3), W(3) sobre la fila esborrada",
            statusTone: "rose",
        },
    },
    {
        id: "phantom",
        label: "FANTASMA · IC",
        sqlVerb: "FANTASMA",
        tone: "violet",
        activeClass: "bg-violet-500/15 border-violet-400 text-violet-300 shadow-[0_0_10px_rgba(167,139,250,0.2)] font-semibold",
    },
];

const PHANTOM_STEPS: PhantomStepConfig[] = [
    {
        id: 0,
        label: "T1: SELECT dpt=1",
        tone: "sky",
        frame: {
            rows: [
                ...makeBaseRows(["1", "2"], "sky"),
                { id: "4", pk: "4", name: "—", meta: "dpt 1", state: "ghost", tone: "emerald" },
                { id: "IC", pk: "IC", name: "Control", meta: "dpt = 1", state: "control", tone: "violet", tag: "IC" },
            ],
            ops: [
                { rowId: "1", readLabel: "R(1)", tone: "sky" },
                { rowId: "2", readLabel: "R(2)", tone: "sky" },
                { rowId: "IC", readLabel: "R(IC)", tone: "violet" },
            ],
            statusText: "T1 llegeix conjunt dpt = 1 → afegeix R(IC)",
            statusTone: "sky",
        },
    },
    {
        id: 1,
        label: "T2: INSERT (4, dpt=1)",
        tone: "emerald",
        frame: {
            rows: [
                ...makeBaseRows([], "emerald"),
                { id: "4", pk: "4", name: "PAU", meta: "dpt 1", state: "inserted", tone: "emerald", tag: "+" },
                { id: "IC", pk: "IC", name: "Control", meta: "dpt = 1", state: "control", tone: "violet", tag: "IC" },
            ],
            ops: [
                { rowId: "4", writePair: { ru: "RU(4)", w: "W(4)" }, tone: "emerald" },
                { rowId: "IC", writePair: { ru: "RU(IC)", w: "W(IC)" }, tone: "violet" },
            ],
            statusText: "T2 insereix fila 4 dins dpt = 1 → RU(IC), W(IC)",
            statusTone: "emerald",
        },
    },
    {
        id: 2,
        label: "T1: SELECT dpt=1",
        tone: "violet",
        frame: {
            rows: [
                ...makeBaseRows(["1", "2"], "sky"),
                { id: "4", pk: "4", name: "PAU", meta: "dpt 1", state: "phantom", tone: "violet", tag: "nou" },
                { id: "IC", pk: "IC", name: "Control", meta: "dpt = 1", state: "control", tone: "violet", tag: "IC" },
            ],
            ops: [
                { rowId: "1", readLabel: "R(1)", tone: "sky" },
                { rowId: "2", readLabel: "R(2)", tone: "sky" },
                { rowId: "4", readLabel: "R(4)", tone: "violet", tag: "fantasma" },
                { rowId: "IC", readLabel: "R(IC)", tone: "violet" },
            ],
            statusText: "Apareix la fila 4 (fantasma) · IC detecta el conflicte",
            statusTone: "violet",
        },
    },
];

const TONE_HEX: Record<Tone, string> = {
    sky: "#38bdf8",
    amber: "#f59e0b",
    emerald: "#10b981",
    rose: "#f43f5e",
    violet: "#a78bfa",
};

const TONE_ACTIVE_CARD: Record<Tone, string> = {
    sky: "bg-sky-500/15 border-sky-400 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.2)]",
    amber: "bg-amber-500/15 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.2)]",
    emerald: "bg-emerald-500/15 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.2)]",
    rose: "bg-rose-500/15 border-rose-400 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.2)]",
    violet: "bg-violet-500/15 border-violet-400 text-violet-200 shadow-[0_0_12px_rgba(167,139,250,0.22)]",
};

const TONE_PILL: Record<Tone, string> = {
    sky: "bg-sky-500/10 border-sky-500/30 text-sky-300",
    amber: "bg-amber-500/10 border-amber-500/30 text-amber-300",
    emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    rose: "bg-rose-500/10 border-rose-500/30 text-rose-300",
    violet: "bg-violet-500/10 border-violet-500/30 text-violet-300",
};

const TONE_PK_BADGE: Record<Tone, string> = {
    sky: "bg-sky-500/20 border-sky-400/40 text-sky-300",
    amber: "bg-amber-500/20 border-amber-400/40 text-amber-300",
    emerald: "bg-emerald-500/20 border-emerald-400/40 text-emerald-300",
    rose: "bg-rose-500/20 border-rose-400/40 text-rose-300",
    violet: "bg-violet-500/20 border-violet-400/40 text-violet-300",
};

const TONE_VERB_TEXT: Record<Tone, string> = {
    sky: "text-sky-400",
    amber: "text-amber-400",
    emerald: "text-emerald-400",
    rose: "text-rose-400",
    violet: "text-violet-400",
};

export default function GranuleVisualizer() {
    const [modeId, setModeId] = useState<ModeId>("select");
    const [phantomStepIdx, setPhantomStepIdx] = useState<number>(2);
    const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);

    const activeMode = MODES.find((m) => m.id === modeId) || MODES[0];
    const frame: ViewFrame =
        modeId === "phantom"
            ? PHANTOM_STEPS[phantomStepIdx].frame
            : activeMode.frame!;

    const { rows, ops, statusText, statusTone } = frame;
    const activeRowIds = new Set(ops.map((o) => o.rowId));

    const totalH = rows.length * ROW_H + (rows.length - 1) * GAP;
    const rightContentH = ops.length * ROW_H + (ops.length - 1) * GAP;
    const offsetRight = (totalH - rightContentH) / 2;

    return (
        <div className="w-full max-w-xl mx-auto my-6 not-prose select-none font-mono text-xs">
            {/* Selector minimalista d'operacions SQL */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pb-3">
                {MODES.map((item) => {
                    const isSelected = item.id === modeId;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                                setModeId(item.id);
                                setHoveredRowId(null);
                            }}
                            className={`px-2.5 py-1 rounded-md border text-[11px] transition-all duration-150 cursor-pointer ${
                                isSelected
                                    ? item.activeClass
                                    : "bg-slate-900/30 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10"
                            }`}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </div>

            {/* Sentència SQL activa o seqüència de 3 passos en cas de fantasma */}
            {modeId === "phantom" ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 pb-4">
                    {PHANTOM_STEPS.map((step, idx) => {
                        const isSelected = idx === phantomStepIdx;
                        return (
                            <button
                                key={step.id}
                                type="button"
                                onMouseEnter={() => {
                                    setPhantomStepIdx(idx);
                                    setHoveredRowId(null);
                                }}
                                onClick={() => {
                                    setPhantomStepIdx(idx);
                                    setHoveredRowId(null);
                                }}
                                className={`px-2.5 py-1.5 rounded-lg border text-[10px] text-center transition-all duration-150 cursor-pointer truncate ${
                                    isSelected
                                        ? TONE_ACTIVE_CARD[step.tone]
                                        : "bg-slate-900/30 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10"
                                }`}
                            >
                                <span className="opacity-60 mr-1">{idx + 1}.</span>
                                <span className="font-semibold">{step.label}</span>
                            </button>
                        );
                    })}
                </div>
            ) : (
                <div className="pb-4 flex justify-center">
                    <div className="px-3 py-1.5 rounded-lg bg-slate-900/50 border border-white/10 text-[11px] text-slate-300 truncate max-w-full">
                        <span className={`font-bold mr-1.5 ${TONE_VERB_TEXT[activeMode.tone]}`}>
                            {activeMode.sqlVerb}
                        </span>
                        <span>{activeMode.sqlRest}</span>
                    </div>
                </div>
            )}

            {/* Capçaleres de columna */}
            <div
                className="grid items-center text-[10px] text-slate-500 font-semibold tracking-wider pb-2 px-0.5"
                style={{ gridTemplateColumns: "minmax(0, 1fr) 56px minmax(0, 1fr)" }}
            >
                <div className="flex items-center justify-between pr-1">
                    <span>GRÀNULS (emp)</span>
                    <span className="text-slate-600">PK</span>
                </div>
                <span />
                <span className="text-right pl-1">OPERACIONS</span>
            </div>

            {/* Cos gràfic de 3 columnes alineades al píxel */}
            <div
                className="relative grid items-start"
                style={{ gridTemplateColumns: "minmax(0, 1fr) 56px minmax(0, 1fr)" }}
            >
                {/* Columna esquerra: files (grànuls G) + IC quan hi ha fantasma */}
                <div className="flex flex-col gap-2">
                    {rows.map((row) => {
                        const isInteractive = activeRowIds.has(row.id);
                        const isHovered = hoveredRowId === row.id;
                        const isHoverDimmed = hoveredRowId !== null && !isHovered;
                        const isGhost = row.state === "ghost";
                        const isDimmed = row.state === "dimmed";
                        const isDashed = row.state === "inserted" || row.state === "control" || isGhost;

                        let cardClass = "bg-slate-900/40 border-white/10 text-slate-300";
                        if (isGhost) {
                            cardClass = "bg-slate-900/15 border-white/10 border-dashed text-slate-600 opacity-25";
                        } else if (isDimmed) {
                            cardClass = "bg-slate-900/15 border-white/5 text-slate-600 opacity-25";
                        } else if (isHoverDimmed) {
                            cardClass = "bg-slate-900/25 border-white/5 text-slate-500 opacity-35";
                        } else if (isHovered || isInteractive) {
                            cardClass = TONE_ACTIVE_CARD[row.tone];
                        }

                        return (
                            <button
                                key={`${modeId}-row-${row.id}`}
                                type="button"
                                disabled={!isInteractive}
                                onMouseEnter={isInteractive ? () => setHoveredRowId(row.id) : undefined}
                                onMouseLeave={isInteractive ? () => setHoveredRowId(null) : undefined}
                                onClick={
                                    isInteractive
                                        ? () => setHoveredRowId((curr) => (curr === row.id ? null : row.id))
                                        : undefined
                                }
                                className={`h-9 px-2 rounded-lg border flex items-center justify-between gap-1.5 text-left transition-all duration-150 ${
                                    isDashed ? "border-dashed" : ""
                                } ${isInteractive ? "cursor-pointer" : "cursor-default"} ${cardClass}`}
                            >
                                <div className="flex items-center gap-1.5 min-w-0">
                                    <span
                                        className={`h-5 min-w-5 px-1 rounded border text-[10px] font-bold flex items-center justify-center shrink-0 ${
                                            isDimmed || isGhost || isHoverDimmed
                                                ? "bg-slate-900/40 border-white/5 text-slate-600"
                                                : TONE_PK_BADGE[row.tone]
                                        }`}
                                    >
                                        {row.tag === "+" ? "+4" : row.pk}
                                    </span>
                                    <span
                                        className={`truncate text-[11px] ${
                                            row.state === "deleted" ? "line-through opacity-75" : ""
                                        }`}
                                    >
                                        {row.name}
                                    </span>
                                </div>
                                <span className="text-[10px] opacity-70 shrink-0 tabular-nums">
                                    {row.meta}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Connexions SVG fluides */}
                <svg
                    viewBox={`0 0 ${SVG_W} ${totalH}`}
                    style={{ height: totalH }}
                    className="w-full pointer-events-none overflow-visible"
                >
                    {ops.map((op, opIdx) => {
                        const leftIdx = rows.findIndex((r) => r.id === op.rowId);
                        if (leftIdx === -1) return null;

                        const y1 = getYLeft(leftIdx);
                        const y2 = getYRight(opIdx, offsetRight);
                        const isHovered = hoveredRowId === op.rowId;
                        const isHoverDimmed = hoveredRowId !== null && !isHovered;
                        const isControl = op.rowId === "IC";

                        const stroke = isHoverDimmed ? "#334155" : TONE_HEX[op.tone];
                        const opacity = isHoverDimmed ? 0.18 : isHovered ? 1 : 0.78;
                        const strokeWidth = isHovered ? 2.4 : 1.75;

                        return (
                            <path
                                key={`${modeId}-edge-${op.rowId}`}
                                d={`M 0,${y1} C ${SVG_W / 2},${y1} ${SVG_W / 2},${y2} ${SVG_W},${y2}`}
                                fill="none"
                                stroke={stroke}
                                strokeWidth={strokeWidth}
                                strokeOpacity={opacity}
                                strokeDasharray={isControl ? "3 3" : undefined}
                                className="transition-all duration-150"
                            />
                        );
                    })}
                </svg>

                {/* Columna dreta: operacions sobre grànuls generades */}
                <div
                    className="flex flex-col gap-2"
                    style={{ paddingTop: `${offsetRight}px`, paddingBottom: `${offsetRight}px` }}
                >
                    {ops.map((op) => {
                        const isHovered = hoveredRowId === op.rowId;
                        const isHoverDimmed = hoveredRowId !== null && !isHovered;
                        const isControl = op.rowId === "IC";

                        return (
                            <button
                                key={`${modeId}-op-${op.rowId}`}
                                type="button"
                                onMouseEnter={() => setHoveredRowId(op.rowId)}
                                onMouseLeave={() => setHoveredRowId(null)}
                                onClick={() => setHoveredRowId((curr) => (curr === op.rowId ? null : op.rowId))}
                                className={`h-9 px-2 rounded-lg border flex items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer ${
                                    isControl ? "border-dashed" : ""
                                } ${
                                    isHoverDimmed
                                        ? "bg-slate-900/25 border-white/5 text-slate-500 opacity-35"
                                        : TONE_ACTIVE_CARD[op.tone]
                                }`}
                            >
                                {op.readLabel ? (
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[11px] font-bold tracking-tight">
                                            {op.readLabel}
                                        </span>
                                        {op.tag && (
                                            <span className="text-[9px] px-1 py-0.5 rounded bg-violet-500/20 border border-violet-400/30 text-violet-200 hidden sm:inline">
                                                {op.tag}
                                            </span>
                                        )}
                                    </div>
                                ) : op.writePair ? (
                                    <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold">
                                        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-400/30 text-amber-200">
                                            {op.writePair.ru}
                                        </span>
                                        <span className="opacity-60">→</span>
                                        <span
                                            className={`px-1.5 py-0.5 rounded border ${
                                                op.tone === "rose"
                                                    ? "bg-rose-500/20 border-rose-400/30 text-rose-200"
                                                    : op.tone === "violet"
                                                    ? "bg-violet-500/20 border-violet-400/30 text-violet-200"
                                                    : "bg-emerald-500/20 border-emerald-400/30 text-emerald-200"
                                            }`}
                                        >
                                            {op.writePair.w}
                                        </span>
                                    </div>
                                ) : null}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Regla resum en 1 línia */}
            <div className="mt-3 flex justify-center">
                <div className={`px-3 py-1 rounded-lg border text-[11px] transition-colors ${TONE_PILL[statusTone]}`}>
                    {statusText}
                </div>
            </div>
        </div>
    );
}
