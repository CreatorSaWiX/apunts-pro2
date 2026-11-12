"use client";

import { useState } from "react";

type OpId = "INSERT" | "UPDATE" | "DELETE";
type LevelId = "ROW" | "STATEMENT";
type VarId = "old" | "tg_op" | "new";
type Tone = "normal" | "sky" | "amber" | "emerald" | "rose";

interface RowSpec {
    varId: VarId;
    leftLabel: string;
    leftValue: string;
    leftTone: Tone;
    rightLabel: string;
    rightValue: string;
    rightTone: Tone;
    edgeTone: Exclude<Tone, "normal">;
    edgeDashed?: boolean;
    edgeBadge: string;
    note: string;
}

const ROW_H = 38;
const GAP = 12;
const TOTAL_H = 3 * ROW_H + 2 * GAP; // 138px
const SVG_W = 64;

const getY = (idx: number) => idx * (ROW_H + GAP) + ROW_H / 2;

const TONE_HEX: Record<Tone, string> = {
    normal: "#475569",
    sky: "#38bdf8",
    amber: "#f59e0b",
    emerald: "#10b981",
    rose: "#f43f5e",
};

const OP_TAB_STYLE: Record<OpId, string> = {
    INSERT: "bg-emerald-500/15 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)] font-semibold",
    UPDATE: "bg-sky-500/15 border-sky-400 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.2)] font-semibold",
    DELETE: "bg-rose-500/15 border-rose-400 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)] font-semibold",
};

const TONE_BOX: Record<Tone, string> = {
    normal: "bg-slate-900/40 border-white/10 text-slate-300",
    sky: "bg-sky-500/15 border-sky-400/70 text-sky-200 shadow-[0_0_10px_rgba(56,189,248,0.18)]",
    amber: "bg-amber-500/15 border-amber-400/70 text-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.18)]",
    emerald: "bg-emerald-500/15 border-emerald-400/70 text-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.18)]",
    rose: "bg-rose-500/10 border-rose-500/45 border-dashed text-rose-300",
};

const TONE_PILL: Record<Tone, string> = {
    normal: "bg-slate-900/50 border-white/10 text-slate-400",
    sky: "bg-sky-500/10 border-sky-500/30 text-sky-300",
    amber: "bg-amber-500/10 border-amber-500/30 text-amber-300",
    emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    rose: "bg-rose-500/10 border-rose-500/30 text-rose-300",
};

function getRows(op: OpId, level: LevelId): [RowSpec, RowSpec, RowSpec] {
    if (level === "STATEMENT") {
        return [
            {
                varId: "old",
                leftLabel: "Abans",
                leftValue: "(taula sencera)",
                leftTone: "normal",
                rightLabel: "OLD",
                rightValue: "NULL",
                rightTone: "rose",
                edgeTone: "rose",
                edgeDashed: true,
                edgeBadge: "NULL",
                note: "A FOR EACH STATEMENT, OLD és sempre NULL (no apunta a cap fila)",
            },
            {
                varId: "tg_op",
                leftLabel: "Sentència",
                leftValue: `${op} ON emp`,
                leftTone: "sky",
                rightLabel: "TG_OP",
                rightValue: `'${op}'`,
                rightTone: "sky",
                edgeTone: "sky",
                edgeBadge: "OP",
                note: `TG_OP val '${op}' · únic context disponible en triggers STATEMENT`,
            },
            {
                varId: "new",
                leftLabel: "Després",
                leftValue: "(1 cop / sentència)",
                leftTone: "normal",
                rightLabel: "NEW",
                rightValue: "NULL",
                rightTone: "rose",
                edgeTone: "rose",
                edgeDashed: true,
                edgeBadge: "NULL",
                note: "A FOR EACH STATEMENT, NEW és sempre NULL (no apunta a cap fila)",
            },
        ];
    }

    if (op === "INSERT") {
        return [
            {
                varId: "old",
                leftLabel: "Abans",
                leftValue: "(no existia)",
                leftTone: "normal",
                rightLabel: "OLD",
                rightValue: "NULL",
                rightTone: "rose",
                edgeTone: "rose",
                edgeDashed: true,
                edgeBadge: "NULL",
                note: "A INSERT, OLD val NULL · comprova TG_OP abans d'accedir-hi",
            },
            {
                varId: "tg_op",
                leftLabel: "Sentència",
                leftValue: "INSERT (1, PAU, 200)",
                leftTone: "emerald",
                rightLabel: "TG_OP",
                rightValue: "'INSERT'",
                rightTone: "sky",
                edgeTone: "sky",
                edgeBadge: "OP",
                note: "TG_OP = 'INSERT' · identifica l'operació en triggers multi-esdeveniment",
            },
            {
                varId: "new",
                leftLabel: "Després",
                leftValue: "(1, 'PAU', 200)",
                leftTone: "emerald",
                rightLabel: "NEW",
                rightValue: "(1, PAU, 200)",
                rightTone: "emerald",
                edgeTone: "emerald",
                edgeBadge: "✓",
                note: "NEW conté la tupla nova inserida (editable a BEFORE ROW)",
            },
        ];
    }

    if (op === "UPDATE") {
        return [
            {
                varId: "old",
                leftLabel: "Abans",
                leftValue: "(1, 'PAU', 200)",
                leftTone: "amber",
                rightLabel: "OLD",
                rightValue: "(1, PAU, 200)",
                rightTone: "amber",
                edgeTone: "amber",
                edgeBadge: "✓",
                note: "OLD conserva els valors previs de la fila abans de l'UPDATE",
            },
            {
                varId: "tg_op",
                leftLabel: "Sentència",
                leftValue: "UPDATE sou = 260",
                leftTone: "sky",
                rightLabel: "TG_OP",
                rightValue: "'UPDATE'",
                rightTone: "sky",
                edgeTone: "sky",
                edgeBadge: "OP",
                note: "TG_OP = 'UPDATE' · tant OLD com NEW estan disponibles",
            },
            {
                varId: "new",
                leftLabel: "Després",
                leftValue: "(1, 'PAU', 260)",
                leftTone: "emerald",
                rightLabel: "NEW",
                rightValue: "(1, PAU, 260)",
                rightTone: "emerald",
                edgeTone: "emerald",
                edgeBadge: "✓",
                note: "NEW conté els valors actualitzats (ex: Δ = NEW.sou - OLD.sou)",
            },
        ];
    }

    return [
        {
            varId: "old",
            leftLabel: "Abans",
            leftValue: "(1, 'PAU', 200)",
            leftTone: "amber",
            rightLabel: "OLD",
            rightValue: "(1, PAU, 200)",
            rightTone: "amber",
            edgeTone: "amber",
            edgeBadge: "✓",
            note: "OLD conté la fila que s'està esborrant",
        },
        {
            varId: "tg_op",
            leftLabel: "Sentència",
            leftValue: "DELETE WHERE id = 1",
            leftTone: "rose",
            rightLabel: "TG_OP",
            rightValue: "'DELETE'",
            rightTone: "sky",
            edgeTone: "sky",
            edgeBadge: "OP",
            note: "TG_OP = 'DELETE' · només existeix OLD; NEW és NULL",
        },
        {
            varId: "new",
            leftLabel: "Després",
            leftValue: "(esborrada)",
            leftTone: "normal",
            rightLabel: "NEW",
            rightValue: "NULL",
            rightTone: "rose",
            edgeTone: "rose",
            edgeDashed: true,
            edgeBadge: "NULL",
            note: "A DELETE, NEW val NULL · comprova TG_OP abans d'accedir a NEW",
        },
    ];
}

function getGuardSnippet(op: OpId, level: LevelId): { code: string; hint: string } {
    if (level === "STATEMENT") {
        return {
            code: `IF TG_OP = '${op}' THEN`,
            hint: "FOR EACH STATEMENT · NEW i OLD són NULL",
        };
    }
    if (op === "INSERT") {
        return {
            code: "IF TG_OP = 'INSERT' THEN",
            hint: "usa NEW · no accedeixis a OLD (NULL)",
        };
    }
    if (op === "UPDATE") {
        return {
            code: "ELSIF TG_OP = 'UPDATE' THEN",
            hint: "usa OLD i NEW (ex: NEW.x <> OLD.x)",
        };
    }
    return {
        code: "ELSIF TG_OP = 'DELETE' THEN",
        hint: "usa OLD · no accedeixis a NEW (NULL)",
    };
}

/**
 * Interactive minimalist visualizer for PostgreSQL trigger context variables
 * (`TG_OP`, `OLD`, `NEW`) across `INSERT`, `UPDATE`, `DELETE`, and `ROW` vs `STATEMENT`.
 */
export default function TriggerVarsVisualizer() {
    const [op, setOp] = useState<OpId>("UPDATE");
    const [level, setLevel] = useState<LevelId>("ROW");
    const [activeVar, setActiveVar] = useState<VarId | null>(null);

    const rows = getRows(op, level);
    const activeRow =
        activeVar !== null ? rows.find((r) => r.varId === activeVar) || rows[1] : null;
    const guard = getGuardSnippet(op, level);

    const defaultStatus =
        level === "STATEMENT"
            ? `STATEMENT · només TG_OP = '${op}' disponible (OLD i NEW són NULL)`
            : op === "INSERT"
            ? "INSERT (ROW) · NEW disponible, OLD és NULL"
            : op === "UPDATE"
            ? "UPDATE (ROW) · tant OLD com NEW disponibles"
            : "DELETE (ROW) · OLD disponible, NEW és NULL";

    const statusText = activeRow ? activeRow.note : defaultStatus;
    const statusTone: Tone = activeRow
        ? activeRow.rightTone
        : level === "STATEMENT"
        ? "sky"
        : op === "INSERT"
        ? "emerald"
        : op === "UPDATE"
        ? "sky"
        : "amber";

    return (
        <div className="w-full max-w-xl mx-auto my-6 not-prose select-none font-mono text-xs">
            {/* Selector d'operació activadora */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pb-4">
                {(["INSERT", "UPDATE", "DELETE"] as const).map((item) => {
                    const isSelected = item === op;
                    return (
                        <button
                            key={item}
                            type="button"
                            onClick={() => setOp(item)}
                            className={`px-2.5 py-1 rounded-md border text-[11px] transition-all duration-150 cursor-pointer ${
                                isSelected
                                    ? OP_TAB_STYLE[item]
                                    : "bg-slate-900/30 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10"
                            }`}
                        >
                            {item}
                        </button>
                    );
                })}
            </div>

            {/* Capçaleres + selector ROW / STATEMENT */}
            <div
                className="grid items-center text-[10px] text-slate-500 font-semibold tracking-wider pb-2"
                style={{ gridTemplateColumns: `minmax(0, 1.15fr) ${SVG_W}px minmax(0, 1fr)` }}
            >
                <span>ESTAT DE LA TUPLA</span>
                <span />
                <div className="flex items-center justify-end">
                    <div className="inline-flex p-0.5 rounded-md bg-slate-900/70 border border-white/10">
                        {(["ROW", "STATEMENT"] as const).map((lvl) => (
                            <button
                                key={lvl}
                                type="button"
                                onClick={() => setLevel(lvl)}
                                className={`px-1.5 py-0.5 rounded text-[9.5px] transition-all cursor-pointer ${
                                    level === lvl
                                        ? "bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold"
                                        : "text-slate-500 hover:text-slate-300 border border-transparent"
                                }`}
                            >
                                {lvl}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Cos principal: Abans/SQL/Després <-> SVG <-> OLD/TG_OP/NEW */}
            <div
                className="relative grid items-center"
                style={{ gridTemplateColumns: `minmax(0, 1.15fr) ${SVG_W}px minmax(0, 1fr)` }}
            >
                {/* Columna esquerra */}
                <div className="flex flex-col gap-3">
                    {rows.map((row) => {
                        const isHighlighted = activeVar === row.varId;
                        const isDimmed = activeVar !== null && !isHighlighted;

                        return (
                            <button
                                key={`left-${row.varId}`}
                                type="button"
                                onMouseEnter={() => setActiveVar(row.varId)}
                                onMouseLeave={() => setActiveVar(null)}
                                onClick={() =>
                                    setActiveVar((curr) => (curr === row.varId ? null : row.varId))
                                }
                                className={`h-[38px] px-2.5 rounded-lg border text-left transition-all duration-150 cursor-pointer flex items-center justify-between gap-1.5 ${
                                    isDimmed
                                        ? "bg-slate-900/20 border-white/5 text-slate-600 opacity-30"
                                        : isHighlighted
                                        ? TONE_BOX[row.edgeTone]
                                        : TONE_BOX[row.leftTone]
                                }`}
                            >
                                <span className="text-[10px] opacity-65 shrink-0">
                                    {row.leftLabel}
                                </span>
                                <span className="text-[11px] font-semibold truncate">
                                    {row.leftValue}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Connexions SVG horitzontals */}
                <svg
                    viewBox={`0 0 ${SVG_W} ${TOTAL_H}`}
                    style={{ height: `${TOTAL_H}px` }}
                    className="w-full pointer-events-none overflow-visible"
                >
                    {rows.map((row, idx) => {
                        const y = getY(idx);
                        const isHighlighted = activeVar === row.varId;
                        const isDimmed = activeVar !== null && !isHighlighted;
                        const stroke = isDimmed ? "#334155" : TONE_HEX[row.edgeTone];

                        return (
                            <g
                                key={`edge-${row.varId}`}
                                opacity={isDimmed ? 0.2 : isHighlighted ? 1 : 0.85}
                                className="transition-opacity duration-200"
                            >
                                <path
                                    d={`M 0,${y} L ${SVG_W},${y}`}
                                    fill="none"
                                    stroke={stroke}
                                    strokeWidth={isHighlighted ? 2.2 : row.edgeDashed ? 1.4 : 1.8}
                                    strokeDasharray={row.edgeDashed ? "3 3" : undefined}
                                />
                                <g transform={`translate(${SVG_W / 2}, ${y})`}>
                                    <rect
                                        x="-15"
                                        y="-8"
                                        width="30"
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
                                        {row.edgeBadge}
                                    </text>
                                </g>
                            </g>
                        );
                    })}
                </svg>

                {/* Columna dreta: OLD / TG_OP / NEW */}
                <div className="flex flex-col gap-3">
                    {rows.map((row) => {
                        const isHighlighted = activeVar === row.varId;
                        const isDimmed = activeVar !== null && !isHighlighted;

                        return (
                            <button
                                key={`right-${row.varId}`}
                                type="button"
                                onMouseEnter={() => setActiveVar(row.varId)}
                                onMouseLeave={() => setActiveVar(null)}
                                onClick={() =>
                                    setActiveVar((curr) => (curr === row.varId ? null : row.varId))
                                }
                                className={`h-[38px] px-2.5 rounded-lg border text-left transition-all duration-150 cursor-pointer flex items-center justify-between gap-1.5 ${
                                    isDimmed
                                        ? "bg-slate-900/20 border-white/5 text-slate-600 opacity-30"
                                        : TONE_BOX[row.rightTone]
                                }`}
                            >
                                <span className="font-bold text-[10.5px] shrink-0">
                                    {row.rightLabel}
                                </span>
                                <span className="text-[11px] font-semibold truncate">
                                    {row.rightValue}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Resum contextual */}
            <div className="mt-3 flex justify-center">
                <div
                    className={`px-3 py-1 rounded-lg border text-[11px] text-center transition-colors ${TONE_PILL[statusTone]}`}
                >
                    {statusText}
                </div>
            </div>

            {/* Guarda segura multi-esdeveniment */}
            <div className="mt-2 flex justify-center">
                <div className="px-3 py-1 rounded-md bg-slate-900/40 border border-white/5 text-[10px] text-slate-400 flex flex-wrap items-center justify-center gap-2">
                    <span className="text-sky-300 font-semibold">{guard.code}</span>
                    <span className="text-slate-600">·</span>
                    <span>{guard.hint}</span>
                </div>
            </div>
        </div>
    );
}
