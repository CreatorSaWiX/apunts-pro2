"use client";

import { useState } from "react";

type CaseId = "23514" | "23505" | "23503" | "23502" | "zero_rows";
type Tone = "normal" | "sky" | "amber" | "emerald" | "rose";

interface FlowEdge {
    fromRow: 0 | 1 | 2 | 3;
    toCard: 0 | 1 | 2;
    tone: Exclude<Tone, "normal">;
    dashed?: boolean;
    badge?: string;
}

interface RightCardSpec {
    label: string;
    value: string;
    tone: Tone;
}

interface CaseSpec {
    id: CaseId;
    pillLabel: string;
    activeClass: string;
    isError: boolean;
    cards: [RightCardSpec, RightCardSpec, RightCardSpec];
    edges: FlowEdge[];
    note: string;
    noteTone: Exclude<Tone, "normal">;
}

// Geometria exacta: esquerra 4*36 + 3*8 = 168px; dreta 18 + 3*36 + 2*12 + 18 = 168px
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

const TONE_CARD_CLASS: Record<Tone, string> = {
    normal: "bg-slate-900/40 border-white/10 text-slate-300",
    sky: "bg-sky-500/15 border-sky-400/70 text-sky-200 shadow-[0_0_10px_rgba(56,189,248,0.18)]",
    amber: "bg-amber-500/10 border-amber-400/60 border-dashed text-amber-200",
    emerald: "bg-emerald-500/15 border-emerald-400/70 text-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.18)]",
    rose: "bg-rose-500/15 border-rose-500/70 text-rose-200 shadow-[0_0_10px_rgba(244,63,94,0.2)]",
};

const TONE_PILL: Record<Exclude<Tone, "normal">, string> = {
    sky: "bg-sky-500/10 border-sky-500/30 text-sky-300",
    amber: "bg-amber-500/10 border-amber-500/30 text-amber-300",
    emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    rose: "bg-rose-500/10 border-rose-500/30 text-rose-300",
};

function makeErrorCase(id: Exclude<CaseId, "zero_rows">, pillLabel: string, cause: string, note: string): CaseSpec {
    return {
        id,
        pillLabel,
        activeClass: "bg-rose-500/15 border-rose-400 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)] font-semibold",
        isError: true,
        cards: [
            { label: "getSQLState()", value: `"${id}"`, tone: "rose" },
            { label: "Restricció", value: cause, tone: "rose" },
            { label: "Transacció", value: "ROLLBACK ↺", tone: "sky" },
        ],
        edges: [
            { fromRow: 2, toCard: 0, tone: "rose", badge: "✕" },
            { fromRow: 2, toCard: 1, tone: "rose" },
            { fromRow: 3, toCard: 2, tone: "sky", dashed: true, badge: "↺" },
        ],
        note,
        noteTone: "rose",
    };
}

const CASES: Record<CaseId, CaseSpec> = {
    "23514": makeErrorCase(
        "23514",
        "23514 · CHECK",
        "check_violation",
        "Incompleix un CHECK → salta a catch, executa c.rollback() i llegeix \"23514\""
    ),
    "23505": makeErrorCase(
        "23505",
        "23505 · PK/UNQ",
        "unique_violation",
        "Duplicat de PRIMARY KEY o UNIQUE → salta a catch i desfà amb c.rollback()"
    ),
    "23503": makeErrorCase(
        "23503",
        "23503 · FK",
        "foreign_key_violation",
        "Clau forana inexistent o esborrat amb fills → captura \"23503\" al catch"
    ),
    "23502": makeErrorCase(
        "23502",
        "23502 · NOT NULL",
        "not_null_violation",
        "Valor NULL en columna NOT NULL → captura \"23502\" i desfà canvis previs"
    ),
    zero_rows: {
        id: "zero_rows",
        pillLabel: "mod = 0",
        activeClass: "bg-sky-500/15 border-sky-400 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.2)] font-semibold",
        isError: false,
        cards: [
            { label: "Retorn", value: "int mod = 0", tone: "sky" },
            { label: "SQLException", value: "cap excepció ✓", tone: "emerald" },
            { label: "Transacció", value: "COMMIT ✓", tone: "emerald" },
        ],
        edges: [
            { fromRow: 0, toCard: 0, tone: "sky", badge: "0" },
            { fromRow: 1, toCard: 2, tone: "emerald", badge: "✓" },
        ],
        note: "0 files afectades NO llança SQLException · executeUpdate() retorna 0 i segueix el try",
        noteTone: "sky",
    },
};

const CASE_ORDER: CaseId[] = ["23514", "23505", "23503", "23502", "zero_rows"];

const CODE_LINES = [
    { idx: 0 as const, label: "executeUpdate(...)", kind: "try" as const },
    { idx: 1 as const, label: "c.commit();", kind: "commit" as const },
    { idx: 2 as const, label: "catch (SQLException se)", kind: "catch" as const },
    { idx: 3 as const, label: "c.rollback();", kind: "rollback" as const },
];

export default function JdbcExceptionVisualizer() {
    const [caseId, setCaseId] = useState<CaseId>("23514");

    const current = CASES[caseId];

    const getLineStyle = (idx: 0 | 1 | 2 | 3): { cls: string; tag: string } => {
        if (current.isError) {
            if (idx === 0) return { cls: "bg-rose-500/10 border-rose-400/50 text-rose-200", tag: "llança!" };
            if (idx === 1) return { cls: "bg-slate-900/15 border-white/5 text-slate-600 opacity-30 line-through", tag: "botat" };
            if (idx === 2) return { cls: "bg-rose-500/15 border-rose-400 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.2)]", tag: "entra" };
            return { cls: "bg-sky-500/15 border-sky-400 text-sky-200 shadow-[0_0_10px_rgba(56,189,248,0.18)]", tag: "↺" };
        }
        if (idx === 0) return { cls: "bg-sky-500/15 border-sky-400 text-sky-200 shadow-[0_0_10px_rgba(56,189,248,0.18)]", tag: "→ 0" };
        if (idx === 1) return { cls: "bg-emerald-500/15 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.2)]", tag: "✓" };
        return { cls: "bg-slate-900/15 border-white/5 text-slate-600 opacity-30", tag: "omès" };
    };

    return (
        <div className="w-full max-w-xl mx-auto my-6 not-prose select-none font-mono text-xs">
            {/* Selector de codis SQLState i cas 0 files */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pb-4">
                {CASE_ORDER.map((id) => {
                    const spec = CASES[id];
                    const isSelected = caseId === id;
                    return (
                        <button
                            key={id}
                            type="button"
                            onMouseEnter={() => setCaseId(id)}
                            onClick={() => setCaseId(id)}
                            className={`px-2 py-1 rounded-md border text-[10.5px] transition-all duration-150 cursor-pointer ${
                                isSelected
                                    ? spec.activeClass
                                    : "bg-slate-900/30 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10"
                            }`}
                        >
                            {spec.pillLabel}
                        </button>
                    );
                })}
            </div>

            {/* Capçaleres */}
            <div
                className="grid items-center text-[10px] text-slate-500 font-semibold tracking-wider pb-2"
                style={{ gridTemplateColumns: "1.15fr 56px 1fr" }}
            >
                <span>FLUX try / catch</span>
                <span />
                <div className="flex items-center justify-between">
                    <span>DIAGNÒSTIC</span>
                    <span className="text-slate-600">23XXX</span>
                </div>
            </div>

            {/* Cos principal: flux Java + SVG + targetes de resultat */}
            <div
                className="relative grid items-center"
                style={{ gridTemplateColumns: "1.15fr 56px 1fr" }}
            >
                {/* Columna esquerra: blocs try / catch */}
                <div className="flex flex-col gap-2">
                    {CODE_LINES.map((line) => {
                        const st = getLineStyle(line.idx);
                        return (
                            <div
                                key={line.idx}
                                className={`h-9 px-2.5 rounded-lg border flex items-center justify-between gap-1 transition-all duration-200 ${st.cls}`}
                            >
                                <span className="truncate text-[10.5px] sm:text-[11px]">{line.label}</span>
                                <span className="text-[9.5px] font-bold opacity-80 shrink-0">{st.tag}</span>
                            </div>
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
                                id={`sqlex-arrow-${tone}`}
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
                        const y1 = getYLeft(edge.fromRow);
                        const y2 = getYRight(edge.toCard);
                        const color = TONE_HEX[edge.tone];
                        return (
                            <g key={`${caseId}-e-${i}`}>
                                <path
                                    d={`M 0,${y1} C 28,${y1} 28,${y2} 53,${y2}`}
                                    fill="none"
                                    stroke={color}
                                    strokeWidth={edge.dashed ? 1.5 : 1.9}
                                    strokeDasharray={edge.dashed ? "3 3" : undefined}
                                    markerEnd={`url(#sqlex-arrow-${edge.tone})`}
                                    className="transition-all duration-200"
                                />
                                {edge.badge && (
                                    <g transform={`translate(28, ${(y1 + y2) / 2})`}>
                                        <rect
                                            x="-10"
                                            y="-8"
                                            width="20"
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

                {/* Columna dreta: 3 targetes */}
                <div
                    className="flex flex-col gap-3"
                    style={{ paddingTop: `${OFFSET_RIGHT}px`, paddingBottom: `${OFFSET_RIGHT}px` }}
                >
                    {current.cards.map((card) => (
                        <div
                            key={card.label}
                            className={`h-9 px-2.5 rounded-lg border flex items-center justify-between gap-2 transition-all duration-200 ${TONE_CARD_CLASS[card.tone]}`}
                        >
                            <span className="text-[9.5px] opacity-65 truncate">{card.label}</span>
                            <span className="text-[10.5px] sm:text-[11px] font-bold truncate shrink-0">
                                {card.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Nota compacta */}
            <div className="mt-4 flex justify-center">
                <div className={`px-3 py-1 rounded-lg border text-[11px] text-center transition-colors ${TONE_PILL[current.noteTone]}`}>
                    {current.note}
                </div>
            </div>
        </div>
    );
}
