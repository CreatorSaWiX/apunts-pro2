"use client";

import { useState } from "react";

type CaseId = "insert" | "update" | "delete" | "update_zero";
type Tone = "emerald" | "rose" | "amber" | "sky";

interface CaseConfig {
    id: CaseId;
    label: string;
    sql: string;
    tone: Tone;
    activeClass: string;
    blocked: boolean;
    activeStepIdx: 0 | 1 | 2;
    steps: [
        { label: string; tag: string },
        { label: string; tag: string },
        { label: string; tag: string }
    ];
    rows: [
        { id: string; text: string; badge?: string; tone: Tone | "neutral" },
        { id: string; text: string; badge?: string; tone: Tone | "neutral" }
    ];
    statusText: string;
}

// Geometria exacta: esquerra 3x36px + 2x8px = 124px; dreta 2x44px + 20px + 2x8px = 124px
const ROW_H_LEFT = 36;
const GAP_LEFT = 8;
const TOTAL_H = 3 * ROW_H_LEFT + 2 * GAP_LEFT; // 124px
const ROW_H_RIGHT = 44;
const GAP_RIGHT = 20;
const OFFSET_RIGHT = (TOTAL_H - (2 * ROW_H_RIGHT + GAP_RIGHT)) / 2; // 8px
const SVG_W = 64;

const getYLeft = (idx: 0 | 1 | 2) => idx * (ROW_H_LEFT + GAP_LEFT) + ROW_H_LEFT / 2; // 18, 62, 106
const getYRight = (idx: 0 | 1) => OFFSET_RIGHT + idx * (ROW_H_RIGHT + GAP_RIGHT) + ROW_H_RIGHT / 2; // 30, 94

const TONE_HEX: Record<Tone, string> = {
    emerald: "#10b981",
    rose: "#f43f5e",
    amber: "#f59e0b",
    sky: "#38bdf8",
};

const TONE_CARD: Record<Tone | "neutral", string> = {
    emerald: "bg-emerald-500/15 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.2)]",
    rose: "bg-rose-500/15 border-rose-500 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.2)]",
    amber: "bg-amber-500/15 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.2)]",
    sky: "bg-sky-500/15 border-sky-400 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.2)]",
    neutral: "bg-slate-900/40 border-white/10 text-slate-400",
};

const TONE_PILL: Record<Tone, string> = {
    emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    rose: "bg-rose-500/10 border-rose-500/30 text-rose-300",
    amber: "bg-amber-500/10 border-amber-500/30 text-amber-300",
    sky: "bg-sky-500/10 border-sky-500/30 text-sky-300",
};

const CASES: CaseConfig[] = [
    {
        id: "update",
        label: "UPDATE",
        sql: "UPDATE auditoria SET accio = 'x' WHERE id = 1;",
        tone: "rose",
        activeClass: "bg-rose-500/15 border-rose-400 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)] font-semibold",
        blocked: true,
        activeStepIdx: 1,
        steps: [
            { label: "BEFORE STATEMENT", tag: "1 cop" },
            { label: "RAISE EXCEPTION", tag: "✕ avorta" },
            { label: "Accés taula", tag: "bloquejat" },
        ],
        rows: [
            { id: "#1", text: "login_ok", badge: "intacte", tone: "neutral" },
            { id: "#2", text: "logout_ok", badge: "intacte", tone: "neutral" },
        ],
        statusText: "BEFORE STATEMENT intercepta l'UPDATE abans de tocar cap fila",
    },
    {
        id: "delete",
        label: "DELETE",
        sql: "DELETE FROM auditoria;",
        tone: "rose",
        activeClass: "bg-rose-500/15 border-rose-400 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)] font-semibold",
        blocked: true,
        activeStepIdx: 1,
        steps: [
            { label: "BEFORE STATEMENT", tag: "1 cop" },
            { label: "RAISE EXCEPTION", tag: "✕ avorta" },
            { label: "Accés taula", tag: "bloquejat" },
        ],
        rows: [
            { id: "#1", text: "login_ok", badge: "intacte", tone: "neutral" },
            { id: "#2", text: "logout_ok", badge: "intacte", tone: "neutral" },
        ],
        statusText: "Bloqueja l'esborrat sencer en 1 única execució abans d'entrar a files",
    },
    {
        id: "update_zero",
        label: "UPDATE (0 files)",
        sql: "UPDATE auditoria SET accio = 'x' WHERE id = 999;",
        tone: "amber",
        activeClass: "bg-amber-500/15 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)] font-semibold",
        blocked: true,
        activeStepIdx: 1,
        steps: [
            { label: "BEFORE STATEMENT", tag: "0 files → 1 cop" },
            { label: "RAISE EXCEPTION", tag: "✕ igualment!" },
            { label: "Accés taula", tag: "bloquejat" },
        ],
        rows: [
            { id: "#1", text: "login_ok", badge: "intacte", tone: "neutral" },
            { id: "#999", text: "0 files afectades", badge: "salta igual", tone: "amber" },
        ],
        statusText: "FOR EACH STATEMENT s'executa 1 cop fins i tot si afecta 0 files",
    },
    {
        id: "insert",
        label: "INSERT",
        sql: "INSERT INTO auditoria VALUES (3, 'alta_ok');",
        tone: "emerald",
        activeClass: "bg-emerald-500/15 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)] font-semibold",
        blocked: false,
        activeStepIdx: 2,
        steps: [
            { label: "BEFORE STATEMENT", tag: "no aplica" },
            { label: "RAISE EXCEPTION", tag: "omès" },
            { label: "Accés taula", tag: "✓ permès" },
        ],
        rows: [
            { id: "#1", text: "login_ok", tone: "neutral" },
            { id: "#3", text: "alta_ok", badge: "+ nou ✓", tone: "emerald" },
        ],
        statusText: "INSERT no dispara el trigger (només escolta UPDATE OR DELETE)",
    },
];

/**
 * Interactive minimalist visualizer for Exemple 2 (`BEFORE STATEMENT` global guard
 * blocking UPDATE/DELETE even on 0 rows while allowing INSERT).
 */
export default function StatementGuardVisualizer() {
    const [caseId, setCaseId] = useState<CaseId>("update");

    const current = CASES.find((c) => c.id === caseId) || CASES[0];
    const yLeft = getYLeft(current.activeStepIdx);
    const yTarget = getYRight(1);
    const color = TONE_HEX[current.tone];

    return (
        <div className="w-full max-w-xl mx-auto my-6 not-prose select-none font-mono text-xs">
            {/* Selector de sentència SQL */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pb-3">
                {CASES.map((item) => {
                    const isSelected = item.id === caseId;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setCaseId(item.id)}
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

            {/* Sentència SQL disparada */}
            <div className="pb-4 flex justify-center">
                <div className="px-3 py-1.5 rounded-lg bg-slate-900/50 border border-white/10 text-[11px] text-slate-300 truncate max-w-full">
                    {current.sql}
                </div>
            </div>

            {/* Capçaleres */}
            <div
                className="grid items-center text-[10px] text-slate-500 font-semibold tracking-wider pb-2"
                style={{ gridTemplateColumns: `minmax(0, 1.2fr) ${SVG_W}px minmax(0, 1fr)` }}
            >
                <span>TRIGGER (BEFORE STATEMENT)</span>
                <span />
                <span className="text-right">auditoria</span>
            </div>

            {/* Cos principal: Trigger -> Escut/Flux SVG -> Taula auditoria */}
            <div
                className="relative grid items-start"
                style={{ gridTemplateColumns: `minmax(0, 1.2fr) ${SVG_W}px minmax(0, 1fr)` }}
            >
                {/* Passos d'intercepció */}
                <div className="flex flex-col gap-2">
                    {current.steps.map((step, idx) => {
                        const isActive = current.activeStepIdx === idx;
                        const isBlockedOut = current.blocked && idx === 2;

                        return (
                            <div
                                key={`${current.id}-step-${idx}`}
                                className={`h-9 px-2.5 rounded-lg border flex items-center justify-between gap-1.5 transition-all duration-150 ${
                                    isActive
                                        ? TONE_CARD[current.tone]
                                        : isBlockedOut
                                        ? "bg-slate-900/20 border-white/5 border-dashed text-slate-600 opacity-30 line-through"
                                        : "bg-slate-900/40 border-white/10 text-slate-400 opacity-65"
                                }`}
                            >
                                <span className="text-[11px] truncate">{step.label}</span>
                                <span className="text-[9.5px] font-bold opacity-85 shrink-0">
                                    {step.tag}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Connexió SVG: barrera si bloqueja, fletxa si passa */}
                <svg
                    viewBox={`0 0 ${SVG_W} ${TOTAL_H}`}
                    style={{ height: TOTAL_H }}
                    className="w-full pointer-events-none overflow-visible"
                >
                    <defs>
                        <marker
                            id="sg-arrow-emerald"
                            viewBox="0 0 10 10"
                            refX="7"
                            refY="5"
                            markerWidth="5"
                            markerHeight="5"
                            orient="auto"
                        >
                            <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill={TONE_HEX.emerald} />
                        </marker>
                    </defs>

                    {current.blocked ? (
                        <g>
                            {/* Línia fins a la barrera */}
                            <path
                                d={`M 0,${yLeft} L 34,${yLeft}`}
                                fill="none"
                                stroke={color}
                                strokeWidth="1.8"
                                strokeDasharray="3 3"
                            />
                            {/* Barrera vertical de protecció */}
                            <line
                                x1="36"
                                y1="14"
                                x2="36"
                                y2={TOTAL_H - 14}
                                stroke={color}
                                strokeWidth="1.8"
                                strokeOpacity="0.65"
                                strokeLinecap="round"
                            />
                            {/* Badge de bloqueig */}
                            <g transform={`translate(36, ${yLeft})`}>
                                <rect
                                    x="-11"
                                    y="-9"
                                    width="22"
                                    height="18"
                                    rx="4"
                                    fill="#020617"
                                    stroke={color}
                                    strokeWidth="1.2"
                                />
                                <text
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    y="1"
                                    fill={color}
                                    fontSize="10"
                                    fontWeight="bold"
                                >
                                    ✕
                                </text>
                            </g>
                        </g>
                    ) : (
                        <g>
                            <path
                                d={`M 0,${yLeft} C 32,${yLeft} 32,${yTarget} 57,${yTarget}`}
                                fill="none"
                                stroke={TONE_HEX.emerald}
                                strokeWidth="2"
                                markerEnd="url(#sg-arrow-emerald)"
                            />
                            <g transform={`translate(32, ${(yLeft + yTarget) / 2})`}>
                                <rect
                                    x="-10"
                                    y="-8"
                                    width="20"
                                    height="16"
                                    rx="4"
                                    fill="#020617"
                                    stroke={TONE_HEX.emerald}
                                    strokeWidth="1"
                                />
                                <text
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    y="1"
                                    fill={TONE_HEX.emerald}
                                    fontSize="9.5"
                                    fontWeight="bold"
                                >
                                    ✓
                                </text>
                            </g>
                        </g>
                    )}
                </svg>

                {/* Estat taula auditoria */}
                <div
                    className="flex flex-col gap-5"
                    style={{ paddingTop: `${OFFSET_RIGHT}px`, paddingBottom: `${OFFSET_RIGHT}px` }}
                >
                    {current.rows.map((row) => (
                        <div
                            key={`${current.id}-${row.id}`}
                            className={`h-11 px-2.5 rounded-lg border flex items-center justify-between gap-1.5 transition-all duration-150 ${TONE_CARD[row.tone]}`}
                        >
                            <div className="flex items-center gap-1.5 min-w-0">
                                <span className="text-[10px] opacity-60 shrink-0">{row.id}</span>
                                <span className="text-[11px] font-semibold truncate">{row.text}</span>
                            </div>
                            {row.badge && (
                                <span className="text-[9.5px] font-bold opacity-85 shrink-0">
                                    {row.badge}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Resum en 1 línia */}
            <div className="mt-3 flex justify-center">
                <div
                    className={`px-3 py-1 rounded-lg border text-[11px] text-center transition-colors ${TONE_PILL[current.tone]}`}
                >
                    {current.statusText}
                </div>
            </div>
        </div>
    );
}
