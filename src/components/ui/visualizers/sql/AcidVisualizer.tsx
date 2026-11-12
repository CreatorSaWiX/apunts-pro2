"use client";

import { useState } from "react";

type ScenarioId = "commit" | "check_fail" | "crash" | "no_c";
type RowTone = "normal" | "pending" | "committed" | "reverted" | "error" | "warning";
type AcidState = "valid" | "pending" | "error" | "idle";
type TargetRow = "A" | "B" | "sum";

interface CellView {
    display: string;
    tone: RowTone;
}

interface CurveEdge {
    fromStep: 0 | 1 | 2 | 3;
    toRow: TargetRow;
    color: string;
    dashed?: boolean;
    badge?: string;
}

interface TxStep {
    code: string;
    tag?: string;
    rowA: CellView;
    rowB: CellView;
    rowSum: CellView;
    statusText: string;
    statusTone: "neutral" | "amber" | "emerald" | "rose" | "sky";
    acid: Record<"A" | "C" | "I" | "D", AcidState>;
    edges: CurveEdge[];
}

interface ScenarioConfig {
    id: ScenarioId;
    label: string;
    activeClass: string;
    steps: [TxStep, TxStep, TxStep, TxStep];
}

const ROW_H = 36;
const GAP_LEFT = 8;
const OFFSET_RIGHT = 18;
const GAP_RIGHT = 12;

const getYLeft = (idx: number) => idx * (ROW_H + GAP_LEFT) + ROW_H / 2;
const getYRight = (row: TargetRow) => {
    const idx = row === "A" ? 0 : row === "B" ? 1 : 2;
    return OFFSET_RIGHT + idx * (ROW_H + GAP_RIGHT) + ROW_H / 2;
};

const INITIAL_STEP: TxStep = {
    code: "START TRANSACTION",
    rowA: { display: "100", tone: "normal" },
    rowB: { display: "100", tone: "normal" },
    rowSum: { display: "200", tone: "normal" },
    statusText: "Estat inicial vàlid · Σ = 200",
    statusTone: "neutral",
    acid: { A: "pending", C: "valid", I: "valid", D: "idle" },
    edges: [
        { fromStep: 0, toRow: "A", color: "#475569", dashed: true },
        { fromStep: 0, toRow: "B", color: "#475569", dashed: true },
    ],
};

const SCENARIOS: ScenarioConfig[] = [
    {
        id: "commit",
        label: "COMMIT",
        activeClass: "bg-emerald-500/15 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)] font-semibold",
        steps: [
            INITIAL_STEP,
            {
                code: "UPDATE A (-40)",
                rowA: { display: "100 → 60", tone: "pending" },
                rowB: { display: "100", tone: "normal" },
                rowSum: { display: "160*", tone: "pending" },
                statusText: "Buffer temporal · pendent de confirmar",
                statusTone: "amber",
                acid: { A: "pending", C: "pending", I: "valid", D: "idle" },
                edges: [{ fromStep: 1, toRow: "A", color: "#f59e0b" }],
            },
            {
                code: "UPDATE B (+40)",
                rowA: { display: "60", tone: "pending" },
                rowB: { display: "100 → 140", tone: "pending" },
                rowSum: { display: "200*", tone: "pending" },
                statusText: "Ambdós canvis en buffer · aïllats",
                statusTone: "amber",
                acid: { A: "pending", C: "pending", I: "valid", D: "idle" },
                edges: [
                    { fromStep: 1, toRow: "A", color: "#f59e0b" },
                    { fromStep: 2, toRow: "B", color: "#f59e0b" },
                ],
            },
            {
                code: "COMMIT",
                tag: "✓",
                rowA: { display: "60", tone: "committed" },
                rowB: { display: "140", tone: "committed" },
                rowSum: { display: "200 ✓", tone: "committed" },
                statusText: "COMMIT ✓ · canvis permanents a disc",
                statusTone: "emerald",
                acid: { A: "valid", C: "valid", I: "valid", D: "valid" },
                edges: [
                    { fromStep: 1, toRow: "A", color: "#10b981" },
                    { fromStep: 2, toRow: "B", color: "#10b981" },
                    { fromStep: 3, toRow: "sum", color: "#10b981", badge: "✓" },
                ],
            },
        ],
    },
    {
        id: "check_fail",
        label: "CHECK ✕",
        activeClass: "bg-rose-500/15 border-rose-400 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)] font-semibold",
        steps: [
            INITIAL_STEP,
            {
                code: "UPDATE B (+40)",
                rowA: { display: "100", tone: "normal" },
                rowB: { display: "100 → 140", tone: "pending" },
                rowSum: { display: "240*", tone: "pending" },
                statusText: "Op 1 vàlida en buffer · B = 140",
                statusTone: "amber",
                acid: { A: "pending", C: "pending", I: "valid", D: "idle" },
                edges: [{ fromStep: 1, toRow: "B", color: "#f59e0b" }],
            },
            {
                code: "UPDATE A (-140)",
                tag: "✕",
                rowA: { display: "-40 ✕", tone: "error" },
                rowB: { display: "140", tone: "pending" },
                rowSum: { display: "CHECK < 0", tone: "error" },
                statusText: "Viola CHECK (saldo ≥ 0) · s'avorta la TX",
                statusTone: "rose",
                acid: { A: "pending", C: "error", I: "valid", D: "idle" },
                edges: [
                    { fromStep: 1, toRow: "B", color: "#f59e0b" },
                    { fromStep: 2, toRow: "A", color: "#f43f5e", badge: "✕" },
                ],
            },
            {
                code: "ROLLBACK",
                tag: "↺",
                rowA: { display: "100", tone: "reverted" },
                rowB: { display: "140 ↺ 100", tone: "reverted" },
                rowSum: { display: "200 ✓", tone: "committed" },
                statusText: "ROLLBACK ↺ · Op 1 desfeta (tot o res)",
                statusTone: "sky",
                acid: { A: "valid", C: "valid", I: "valid", D: "idle" },
                edges: [
                    { fromStep: 2, toRow: "A", color: "#f43f5e", dashed: true, badge: "✕" },
                    { fromStep: 3, toRow: "B", color: "#38bdf8", dashed: true, badge: "↺" },
                ],
            },
        ],
    },
    {
        id: "crash",
        label: "CAIGUDA ⚡",
        activeClass: "bg-sky-500/15 border-sky-400 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.2)] font-semibold",
        steps: [
            INITIAL_STEP,
            {
                code: "UPDATE A (-40)",
                rowA: { display: "100 → 60", tone: "pending" },
                rowB: { display: "100", tone: "normal" },
                rowSum: { display: "160*", tone: "pending" },
                statusText: "Op 1 en buffer · sense COMMIT",
                statusTone: "amber",
                acid: { A: "pending", C: "pending", I: "valid", D: "idle" },
                edges: [{ fromStep: 1, toRow: "A", color: "#f59e0b" }],
            },
            {
                code: "⚡ Caiguda SGBD",
                tag: "⚡",
                rowA: { display: "60 ⚡", tone: "error" },
                rowB: { display: "100", tone: "normal" },
                rowSum: { display: "160 ⚡", tone: "error" },
                statusText: "Fallada abans de COMMIT · bloc incomplet",
                statusTone: "rose",
                acid: { A: "pending", C: "error", I: "valid", D: "idle" },
                edges: [{ fromStep: 2, toRow: "A", color: "#f43f5e", dashed: true, badge: "⚡" }],
            },
            {
                code: "UNDO (ROLLBACK)",
                tag: "↺",
                rowA: { display: "60 ↺ 100", tone: "reverted" },
                rowB: { display: "100", tone: "normal" },
                rowSum: { display: "200 ✓", tone: "committed" },
                statusText: "Recuperació UNDO ↺ · BD intacta",
                statusTone: "sky",
                acid: { A: "valid", C: "valid", I: "valid", D: "idle" },
                edges: [{ fromStep: 3, toRow: "A", color: "#38bdf8", dashed: true, badge: "↺" }],
            },
        ],
    },
    {
        id: "no_c",
        label: "SENSE C",
        activeClass: "bg-amber-500/15 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)] font-semibold",
        steps: [
            INITIAL_STEP,
            {
                code: "UPDATE A (-40)",
                rowA: { display: "100 → 60", tone: "pending" },
                rowB: { display: "100", tone: "normal" },
                rowSum: { display: "160*", tone: "pending" },
                statusText: "Op 1 en buffer · falta actualitzar B",
                statusTone: "amber",
                acid: { A: "pending", C: "pending", I: "valid", D: "idle" },
                edges: [{ fromStep: 1, toRow: "A", color: "#f59e0b" }],
            },
            {
                code: "-- (oblida B)",
                rowA: { display: "60", tone: "pending" },
                rowB: { display: "100", tone: "normal" },
                rowSum: { display: "160*", tone: "warning" },
                statusText: "Cap error DDL · però Σ ≠ 200",
                statusTone: "amber",
                acid: { A: "pending", C: "error", I: "valid", D: "idle" },
                edges: [
                    { fromStep: 1, toRow: "A", color: "#f59e0b" },
                    { fromStep: 2, toRow: "B", color: "#475569", dashed: true },
                ],
            },
            {
                code: "COMMIT",
                tag: "⚠",
                rowA: { display: "60", tone: "committed" },
                rowB: { display: "100", tone: "normal" },
                rowSum: { display: "160 ≠ 200", tone: "error" },
                statusText: "COMMIT acceptat · C violada per codi",
                statusTone: "rose",
                acid: { A: "valid", C: "error", I: "valid", D: "valid" },
                edges: [
                    { fromStep: 1, toRow: "A", color: "#10b981" },
                    { fromStep: 3, toRow: "sum", color: "#f43f5e", badge: "≠" },
                ],
            },
        ],
    },
];

const ACID_LABELS: { key: "A" | "C" | "I" | "D"; name: string }[] = [
    { key: "A", name: "Atomicitat" },
    { key: "C", name: "Consistència" },
    { key: "I", name: "Aïllament" },
    { key: "D", name: "Definitivitat" },
];

function getCellToneClass(tone: RowTone): string {
    switch (tone) {
        case "pending":
            return "bg-amber-500/10 border-amber-400/50 border-dashed text-amber-200";
        case "committed":
            return "bg-emerald-500/15 border-emerald-400/70 text-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.18)]";
        case "reverted":
            return "bg-sky-500/15 border-sky-400/70 text-sky-200 shadow-[0_0_10px_rgba(56,189,248,0.18)]";
        case "error":
            return "bg-rose-500/15 border-rose-500/70 text-rose-200 shadow-[0_0_10px_rgba(244,63,94,0.2)]";
        case "warning":
            return "bg-amber-500/15 border-amber-400/70 text-amber-200";
        default:
            return "bg-slate-900/40 border-white/10 text-slate-300";
    }
}

function getStatusPillClass(tone: TxStep["statusTone"]): string {
    switch (tone) {
        case "emerald":
            return "bg-emerald-500/10 border-emerald-500/30 text-emerald-300";
        case "rose":
            return "bg-rose-500/10 border-rose-500/30 text-rose-300";
        case "amber":
            return "bg-amber-500/10 border-amber-500/30 text-amber-300";
        case "sky":
            return "bg-sky-500/10 border-sky-500/30 text-sky-300";
        default:
            return "bg-slate-900/50 border-white/10 text-slate-400";
    }
}

function getAcidPillClass(state: AcidState): { box: string; symbol: string } {
    switch (state) {
        case "valid":
            return { box: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300", symbol: "✓" };
        case "error":
            return { box: "bg-rose-500/15 border-rose-500/40 text-rose-300", symbol: "✕" };
        case "pending":
            return { box: "bg-amber-500/10 border-amber-500/30 text-amber-300", symbol: "•" };
        default:
            return { box: "bg-slate-900/30 border-white/5 text-slate-500", symbol: "—" };
    }
}

export default function AcidVisualizer() {
    const [scenarioId, setScenarioId] = useState<ScenarioId>("commit");
    const [stepIndex, setStepIndex] = useState<number>(3);

    const scenario = SCENARIOS.find((s) => s.id === scenarioId) || SCENARIOS[0];
    const currentStep = scenario.steps[stepIndex];

    const dbRows: { id: TargetRow; label: string; sub?: string; cell: CellView }[] = [
        { id: "A", label: "A", cell: currentStep.rowA },
        { id: "B", label: "B", cell: currentStep.rowB },
        { id: "sum", label: "Σ", sub: "A+B", cell: currentStep.rowSum },
    ];

    return (
        <div className="w-full max-w-xl mx-auto my-6 not-prose select-none font-mono text-xs">
            {/* Selector minimalista d'escenaris */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pb-4">
                {SCENARIOS.map((item) => {
                    const isSelected = item.id === scenarioId;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                                setScenarioId(item.id);
                                setStepIndex(3);
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

            {/* Capçaleres de columna */}
            <div
                className="grid items-center text-[10px] text-slate-500 font-semibold tracking-wider pb-2"
                style={{ gridTemplateColumns: "1.2fr 56px 1fr" }}
            >
                <span>TRANSACCIÓ</span>
                <span />
                <div className="flex items-center justify-between">
                    <span>comptes</span>
                    <span className="text-slate-600">CHECK ≥ 0</span>
                </div>
            </div>

            {/* Cos principal: seqüència SQL (esquerra) + corbes SVG + estat BD (dreta) */}
            <div
                className="relative grid items-center"
                style={{ gridTemplateColumns: "1.2fr 56px 1fr" }}
            >
                {/* Columna esquerra: passos de la transacció */}
                <div className="flex flex-col gap-2">
                    {scenario.steps.map((step, idx) => {
                        const isActive = stepIndex === idx;
                        const isExecuted = idx < stepIndex;
                        const isDimmed = idx > stepIndex;
                        const isErrorEnd = idx >= 2 && step.statusTone === "rose";

                        return (
                            <button
                                key={`${scenarioId}-${idx}`}
                                type="button"
                                onMouseEnter={() => setStepIndex(idx)}
                                onClick={() => setStepIndex(idx)}
                                className={`h-9 px-2.5 rounded-lg border text-left transition-all duration-150 cursor-pointer flex items-center justify-between gap-1.5 ${
                                    isActive
                                        ? isErrorEnd
                                            ? "bg-rose-500/15 border-rose-400 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.22)]"
                                            : step.statusTone === "emerald"
                                            ? "bg-emerald-500/15 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                                            : step.statusTone === "sky"
                                            ? "bg-sky-500/15 border-sky-400 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.2)]"
                                            : "bg-amber-500/15 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                                        : isExecuted
                                        ? "bg-slate-900/50 border-white/10 text-slate-300 hover:border-slate-600"
                                        : isDimmed
                                        ? "bg-slate-900/20 border-white/5 text-slate-600 opacity-35 hover:opacity-70"
                                        : "bg-slate-900/40 border-white/10 text-slate-300"
                                }`}
                            >
                                <span className="truncate text-[11px]">{step.code}</span>
                                {step.tag && (
                                    <span className="text-[10px] font-bold opacity-80 shrink-0">
                                        {step.tag}
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
                    {currentStep.edges.map((edge, i) => {
                        const y1 = getYLeft(edge.fromStep);
                        const y2 = getYRight(edge.toRow);
                        return (
                            <g key={`${scenarioId}-${stepIndex}-edge-${i}`}>
                                <path
                                    d={`M 0,${y1} C 28,${y1} 28,${y2} 56,${y2}`}
                                    fill="none"
                                    stroke={edge.color}
                                    strokeWidth={edge.dashed ? 1.5 : 2}
                                    strokeDasharray={edge.dashed ? "3 3" : undefined}
                                    strokeOpacity={0.9}
                                    className="transition-all duration-200"
                                />
                                {edge.badge && (
                                    <g transform={`translate(28, ${(y1 + y2) / 2})`}>
                                        <rect
                                            x="-9"
                                            y="-8"
                                            width="18"
                                            height="16"
                                            rx="4"
                                            fill="#020617"
                                            stroke={edge.color}
                                            strokeWidth="1"
                                        />
                                        <text
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            y="1"
                                            fill={edge.color}
                                            fontSize="9.5"
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

                {/* Columna dreta: estat de la BD i invariant */}
                <div
                    className="flex flex-col gap-3"
                    style={{ paddingTop: `${OFFSET_RIGHT}px`, paddingBottom: `${OFFSET_RIGHT}px` }}
                >
                    {dbRows.map((row) => (
                        <div
                            key={row.id}
                            className={`h-9 px-2.5 rounded-lg border flex items-center justify-between transition-all duration-200 ${getCellToneClass(
                                row.cell.tone
                            )}`}
                        >
                            <div className="flex items-center gap-1 shrink-0">
                                <span className="font-bold text-[11px]">{row.label}</span>
                                {row.sub && (
                                    <span className="text-[9px] opacity-60 hidden sm:inline">
                                        ({row.sub})
                                    </span>
                                )}
                            </div>
                            <span className="text-[11px] font-semibold tabular-nums truncate">
                                {row.cell.display}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Estat actual en 1 línia */}
            <div className="mt-3 flex justify-center">
                <div
                    className={`px-3 py-1 rounded-lg border text-[11px] transition-colors ${getStatusPillClass(
                        currentStep.statusTone
                    )}`}
                >
                    {currentStep.statusText}
                </div>
            </div>

            {/* Indicador compacte ACID */}
            <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {ACID_LABELS.map(({ key, name }) => {
                    const style = getAcidPillClass(currentStep.acid[key]);
                    return (
                        <div
                            key={key}
                            className={`px-2 py-1 rounded-md border flex items-center justify-between text-[10px] transition-colors ${style.box}`}
                        >
                            <span className="truncate">
                                <strong className="font-bold">{key}</strong>{" "}
                                <span className="opacity-80">{name}</span>
                            </span>
                            <span className="font-bold ml-1 shrink-0">{style.symbol}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
