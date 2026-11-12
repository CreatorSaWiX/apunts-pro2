"use client";

import { useState } from "react";

type ModeId = "commit" | "rollback" | "autocommit_on";
type Tone = "normal" | "sky" | "amber" | "emerald" | "rose";

interface SlotView {
    label: string;
    display: string;
    tone: Tone;
}

interface CurveEdge {
    fromStep: 0 | 1 | 2 | 3;
    toSlot: 0 | 1 | 2;
    tone: Exclude<Tone, "normal">;
    dashed?: boolean;
    badge?: string;
}

interface JdbcStep {
    lineNum: string;
    code: string;
    tag?: string;
    slots: [SlotView, SlotView, SlotView];
    statusText: string;
    statusTone: Tone;
    edges: CurveEdge[];
    connClosed: boolean;
}

interface ModeConfig {
    id: ModeId;
    label: string;
    tone: Exclude<Tone, "normal">;
    autoCommitOn: boolean;
    atomicOk: boolean;
    defaultStep: number;
    steps: [JdbcStep, JdbcStep, JdbcStep, JdbcStep];
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
    emerald: "bg-emerald-500/15 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)] font-semibold",
    sky: "bg-sky-500/15 border-sky-400 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.2)] font-semibold",
    amber: "bg-amber-500/15 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)] font-semibold",
    rose: "bg-rose-500/15 border-rose-400 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)] font-semibold",
};

const TONE_CELL: Record<Tone, string> = {
    normal: "bg-slate-900/40 border-white/10 text-slate-300",
    sky: "bg-sky-500/15 border-sky-400/70 text-sky-200 shadow-[0_0_10px_rgba(56,189,248,0.18)]",
    amber: "bg-amber-500/10 border-amber-400/60 border-dashed text-amber-200",
    emerald: "bg-emerald-500/15 border-emerald-400/70 text-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.18)]",
    rose: "bg-rose-500/15 border-rose-500/70 text-rose-200 shadow-[0_0_10px_rgba(244,63,94,0.2)]",
};

const TONE_STEP_ACTIVE: Record<Tone, string> = {
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
        id: "commit",
        label: "autocommit=false · COMMIT",
        tone: "emerald",
        autoCommitOn: false,
        atomicOk: true,
        defaultStep: 3,
        steps: [
            {
                lineNum: "1",
                code: "c.setAutoCommit(false);",
                tag: "obre TX",
                connClosed: false,
                slots: [
                    { label: "Conn c", display: "TX oberta", tone: "sky" },
                    { label: "Buffer", display: "buit", tone: "normal" },
                    { label: "Disc BD", display: "estat inicial", tone: "normal" },
                ],
                statusText: "Obre transacció · els canvis no es confirmaran fins a commit()",
                statusTone: "sky",
                edges: [{ fromStep: 0, toSlot: 0, tone: "sky" }],
            },
            {
                lineNum: "2",
                code: "executeUpdate(Op 1)",
                tag: "buffer",
                connClosed: false,
                slots: [
                    { label: "Conn c", display: "TX oberta", tone: "sky" },
                    { label: "Buffer", display: "Op 1*", tone: "amber" },
                    { label: "Disc BD", display: "sense canvis", tone: "normal" },
                ],
                statusText: "Op 1 queda pendent al buffer de la transacció",
                statusTone: "amber",
                edges: [{ fromStep: 1, toSlot: 1, tone: "amber" }],
            },
            {
                lineNum: "3",
                code: "executeUpdate(Op 2)",
                tag: "buffer",
                connClosed: false,
                slots: [
                    { label: "Conn c", display: "TX oberta", tone: "sky" },
                    { label: "Buffer", display: "Op 1*, Op 2*", tone: "amber" },
                    { label: "Disc BD", display: "sense canvis", tone: "normal" },
                ],
                statusText: "Op 2 també espera sense confirmar · tot o res",
                statusTone: "amber",
                edges: [
                    { fromStep: 1, toSlot: 1, tone: "amber", dashed: true },
                    { fromStep: 2, toSlot: 1, tone: "amber" },
                ],
            },
            {
                lineNum: "4",
                code: "c.commit(); c.close();",
                tag: "✓",
                connClosed: true,
                slots: [
                    { label: "Conn c", display: "tancada ✓", tone: "emerald" },
                    { label: "Buffer", display: "buidat", tone: "normal" },
                    { label: "Disc BD", display: "Op 1 + Op 2 ✓", tone: "emerald" },
                ],
                statusText: "c.commit() confirma tot atòmicament i c.close() allibera la connexió",
                statusTone: "emerald",
                edges: [
                    { fromStep: 3, toSlot: 0, tone: "emerald", dashed: true },
                    { fromStep: 3, toSlot: 2, tone: "emerald", badge: "✓" },
                ],
            },
        ],
    },
    {
        id: "rollback",
        label: "ROLLBACK (ERROR)",
        tone: "sky",
        autoCommitOn: false,
        atomicOk: true,
        defaultStep: 3,
        steps: [
            {
                lineNum: "1",
                code: "c.setAutoCommit(false);",
                tag: "obre TX",
                connClosed: false,
                slots: [
                    { label: "Conn c", display: "TX oberta", tone: "sky" },
                    { label: "Buffer", display: "buit", tone: "normal" },
                    { label: "Disc BD", display: "estat inicial", tone: "normal" },
                ],
                statusText: "Connexió oberta amb autocommit desactivat",
                statusTone: "sky",
                edges: [{ fromStep: 0, toSlot: 0, tone: "sky" }],
            },
            {
                lineNum: "2",
                code: "executeUpdate(Op 1)",
                tag: "buffer",
                connClosed: false,
                slots: [
                    { label: "Conn c", display: "TX oberta", tone: "sky" },
                    { label: "Buffer", display: "Op 1*", tone: "amber" },
                    { label: "Disc BD", display: "intacte", tone: "normal" },
                ],
                statusText: "Op 1 executada temporalment (reversible)",
                statusTone: "amber",
                edges: [{ fromStep: 1, toSlot: 1, tone: "amber" }],
            },
            {
                lineNum: "3",
                code: "Op 2 → SQLException",
                tag: "✕ error",
                connClosed: false,
                slots: [
                    { label: "Conn c", display: "catch (se)", tone: "rose" },
                    { label: "Buffer", display: "Op 1* (pendent)", tone: "amber" },
                    { label: "Disc BD", display: "intacte", tone: "normal" },
                ],
                statusText: "Falla Op 2 o una regla · salta al bloc catch",
                statusTone: "rose",
                edges: [{ fromStep: 2, toSlot: 0, tone: "rose", badge: "✕" }],
            },
            {
                lineNum: "4",
                code: "c.rollback(); c.close();",
                tag: "↺ desfà",
                connClosed: true,
                slots: [
                    { label: "Conn c", display: "tancada ✓", tone: "sky" },
                    { label: "Buffer", display: "descartat ↺", tone: "sky" },
                    { label: "Disc BD", display: "intacta ✓", tone: "emerald" },
                ],
                statusText: "c.rollback() desfà Op 1 completament abans de tancar c",
                statusTone: "sky",
                edges: [
                    { fromStep: 3, toSlot: 1, tone: "sky", dashed: true, badge: "↺" },
                    { fromStep: 3, toSlot: 2, tone: "emerald" },
                ],
            },
        ],
    },
    {
        id: "autocommit_on",
        label: "autocommit=true (PERILL)",
        tone: "rose",
        autoCommitOn: true,
        atomicOk: false,
        defaultStep: 3,
        steps: [
            {
                lineNum: "1",
                code: "getConnection(...) // true",
                tag: "defecte",
                connClosed: false,
                slots: [
                    { label: "Conn c", display: "autoCommit=true", tone: "amber" },
                    { label: "Buffer", display: "sense TX", tone: "normal" },
                    { label: "Disc BD", display: "estat inicial", tone: "normal" },
                ],
                statusText: "Per defecte JDBC té autocommit = true (sense setAutoCommit(false))",
                statusTone: "amber",
                edges: [{ fromStep: 0, toSlot: 0, tone: "amber" }],
            },
            {
                lineNum: "2",
                code: "executeUpdate(Op 1)",
                tag: "⚡ disc!",
                connClosed: false,
                slots: [
                    { label: "Conn c", display: "1 SQL = 1 TX", tone: "amber" },
                    { label: "Buffer", display: "—", tone: "normal" },
                    { label: "Disc BD", display: "Op 1 gravada ⚡", tone: "amber" },
                ],
                statusText: "Cada sentència fa COMMIT automàtic a l'instant",
                statusTone: "amber",
                edges: [{ fromStep: 1, toSlot: 2, tone: "amber", badge: "⚡" }],
            },
            {
                lineNum: "3",
                code: "Op 2 → SQLException",
                tag: "✕ error",
                connClosed: false,
                slots: [
                    { label: "Conn c", display: "catch (se)", tone: "rose" },
                    { label: "Buffer", display: "—", tone: "normal" },
                    { label: "Disc BD", display: "Op 1 ja a disc!", tone: "rose" },
                ],
                statusText: "Op 2 falla, però Op 1 ja és permanent a la BD",
                statusTone: "rose",
                edges: [
                    { fromStep: 1, toSlot: 2, tone: "rose", dashed: true },
                    { fromStep: 2, toSlot: 0, tone: "rose", badge: "✕" },
                ],
            },
            {
                lineNum: "4",
                code: "c.rollback(); // tard!",
                tag: "✕ trencat",
                connClosed: false,
                slots: [
                    { label: "Conn c", display: "sense efecte", tone: "rose" },
                    { label: "Buffer", display: "—", tone: "normal" },
                    { label: "Disc BD", display: "només Op 1 ✕", tone: "rose" },
                ],
                statusText: "✕ Atomicitat trencada: Op 1 no es pot desfer",
                statusTone: "rose",
                edges: [{ fromStep: 3, toSlot: 2, tone: "rose", dashed: true, badge: "✕" }],
            },
        ],
    },
];

/**
 * Interactive minimalist visualizer for JDBC Connection lifecycle,
 * `setAutoCommit(false)` vs default `autocommit = true`, and `commit()` / `rollback()`.
 */
export default function JdbcConnectionVisualizer() {
    const [modeId, setModeId] = useState<ModeId>("commit");
    const [stepIndex, setStepIndex] = useState<number>(3);

    const activeMode = MODES.find((m) => m.id === modeId) || MODES[0];
    const currentStep = activeMode.steps[stepIndex] || activeMode.steps[3];

    const summaryPills = [
        {
            label: currentStep.connClosed ? "Connexió: tancada" : "Connexió: oberta",
            ok: currentStep.connClosed,
            neutral: !currentStep.connClosed,
        },
        {
            label: activeMode.autoCommitOn ? "autoCommit: true" : "autoCommit: false",
            ok: !activeMode.autoCommitOn,
            neutral: false,
        },
        {
            label: activeMode.atomicOk ? "Atomicitat ✓" : "Atomicitat ✕",
            ok: activeMode.atomicOk,
            neutral: false,
        },
    ];

    return (
        <div className="w-full max-w-xl mx-auto my-6 not-prose select-none font-mono text-xs">
            {/* Selector de flux JDBC */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pb-4">
                {MODES.map((item) => {
                    const isSelected = item.id === modeId;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                                setModeId(item.id);
                                setStepIndex(item.defaultStep);
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
                <span className="truncate pr-1">CODI JAVA (JDBC)</span>
                <span />
                <span className="text-right truncate pl-1">TRANSACCIÓ I BD</span>
            </div>

            {/* Cos principal: passos JDBC (esquerra) + corbes SVG + estat (dreta) */}
            <div
                className="relative grid items-center"
                style={{ gridTemplateColumns: `minmax(0, 1.25fr) ${SVG_W}px minmax(0, 1fr)` }}
            >
                <div className="flex flex-col gap-2">
                    {activeMode.steps.map((step, idx) => {
                        const isActive = stepIndex === idx;
                        const isDimmed = idx > stepIndex;

                        return (
                            <button
                                key={`${activeMode.id}-${idx}`}
                                type="button"
                                onMouseEnter={() => setStepIndex(idx)}
                                onClick={() => setStepIndex(idx)}
                                className={`h-9 px-2 rounded-lg border text-left transition-all duration-150 cursor-pointer flex items-center justify-between gap-1.5 ${
                                    isActive
                                        ? TONE_STEP_ACTIVE[step.statusTone]
                                        : isDimmed
                                        ? "bg-slate-900/20 border-white/5 text-slate-600 opacity-35 hover:opacity-75"
                                        : "bg-slate-900/50 border-white/10 text-slate-300 hover:border-slate-600"
                                }`}
                            >
                                <div className="flex items-center gap-1.5 min-w-0">
                                    <span className="text-[9.5px] opacity-50 w-2.5 shrink-0">
                                        {step.lineNum}
                                    </span>
                                    <span className="truncate text-[11px]">{step.code}</span>
                                </div>
                                {step.tag && (
                                    <span className="text-[9.5px] font-bold opacity-85 shrink-0">
                                        {step.tag}
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
                    {currentStep.edges.map((edge, i) => {
                        const y1 = getYLeft(edge.fromStep);
                        const y2 = getYRight(edge.toSlot);
                        const stroke = TONE_HEX[edge.tone];
                        return (
                            <g key={`${activeMode.id}-${stepIndex}-edge-${i}`}>
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
                                            x="-10"
                                            y="-8"
                                            width="20"
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

                {/* Estat connexió, buffer i disc */}
                <div
                    className="flex flex-col gap-3"
                    style={{ paddingTop: `${OFFSET_RIGHT}px`, paddingBottom: `${OFFSET_RIGHT}px` }}
                >
                    {currentStep.slots.map((slot, idx) => (
                        <div
                            key={`${activeMode.id}-slot-${idx}`}
                            className={`h-9 px-2.5 rounded-lg border flex items-center justify-between gap-1.5 transition-all duration-200 ${TONE_CELL[slot.tone]}`}
                        >
                            <span className="font-bold text-[10.5px] opacity-80 shrink-0">
                                {slot.label}
                            </span>
                            <span className="text-[11px] font-semibold tabular-nums truncate">
                                {slot.display}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Resum del pas actual */}
            <div className="mt-3 flex justify-center">
                <div
                    className={`px-3 py-1 rounded-lg border text-[11px] text-center transition-colors ${TONE_PILL[currentStep.statusTone]}`}
                >
                    {currentStep.statusText}
                </div>
            </div>

            {/* Indicadors clau d'examen */}
            <div className="mt-2.5 grid grid-cols-3 gap-1.5">
                {summaryPills.map((pill) => (
                    <div
                        key={pill.label}
                        className={`px-2 py-1 rounded-md border flex items-center justify-center text-[9.5px] sm:text-[10px] truncate transition-colors ${
                            pill.neutral
                                ? "bg-sky-500/10 border-sky-500/30 text-sky-300"
                                : pill.ok
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                                : "bg-rose-500/10 border-rose-500/30 text-rose-300/85"
                        }`}
                    >
                        <span className="truncate">{pill.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
