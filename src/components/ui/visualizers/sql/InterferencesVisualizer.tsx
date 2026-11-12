"use client";

import { useState } from "react";

type InterferenceId =
    | "lost_update"
    | "dirty_read"
    | "non_repeatable"
    | "inconsistent_analysis"
    | "phantom";

type TxActor = "T1" | "T2";
type CellTone = "normal" | "pending" | "committed" | "reverted" | "warning" | "error";
type IsolationLevel = "READ UNCOMMITTED" | "READ COMMITTED" | "REPEATABLE READ" | "SERIALIZABLE";

interface SlotView {
    label: string;
    display: string;
    tone: CellTone;
}

interface CurveEdge {
    fromStep: 0 | 1 | 2 | 3;
    toSlot: 0 | 1 | 2;
    color: string;
    dashed?: boolean;
    badge?: string;
}

interface InterferenceStep {
    tx: TxActor;
    op: string;
    tag?: string;
    slots: [SlotView, SlotView, SlotView];
    statusText: string;
    statusTone: "neutral" | "amber" | "emerald" | "rose" | "sky";
    edges: CurveEdge[];
}

interface InterferenceConfig {
    id: InterferenceId;
    label: string;
    scope: "1 dada" | "Conjunt";
    rightTitle: string;
    minLevelIdx: 0 | 1 | 2 | 3;
    steps: [InterferenceStep, InterferenceStep, InterferenceStep, InterferenceStep];
}

const ISOLATION_LEVELS: IsolationLevel[] = [
    "READ UNCOMMITTED",
    "READ COMMITTED",
    "REPEATABLE READ",
    "SERIALIZABLE",
];

// Coordenades exactes per alinear files HTML (h-9 = 36px) amb corbes SVG
const ROW_H = 36;
const GAP_LEFT = 8;
const OFFSET_RIGHT = 18;
const GAP_RIGHT = 12;

const getYLeft = (idx: number) => idx * (ROW_H + GAP_LEFT) + ROW_H / 2;
const getYRight = (idx: number) => OFFSET_RIGHT + idx * (ROW_H + GAP_RIGHT) + ROW_H / 2;

const SCENARIOS: InterferenceConfig[] = [
    {
        id: "lost_update",
        label: "Act. perduda",
        scope: "1 dada",
        rightTitle: "DADA x = 100",
        minLevelIdx: 0,
        steps: [
            {
                tx: "T1",
                op: "R(x) → 100",
                slots: [
                    { label: "BD", display: "100", tone: "normal" },
                    { label: "T₁", display: "100", tone: "reverted" },
                    { label: "T₂", display: "—", tone: "normal" },
                ],
                statusText: "T₁ llegeix x = 100",
                statusTone: "sky",
                edges: [
                    { fromStep: 0, toSlot: 0, color: "#475569", dashed: true },
                    { fromStep: 0, toSlot: 1, color: "#38bdf8" },
                ],
            },
            {
                tx: "T2",
                op: "R(x) → 100",
                slots: [
                    { label: "BD", display: "100", tone: "normal" },
                    { label: "T₁", display: "100", tone: "normal" },
                    { label: "T₂", display: "100", tone: "reverted" },
                ],
                statusText: "T₂ també llegeix x = 100 (mateix valor base)",
                statusTone: "neutral",
                edges: [
                    { fromStep: 1, toSlot: 0, color: "#475569", dashed: true },
                    { fromStep: 1, toSlot: 2, color: "#a78bfa" },
                ],
            },
            {
                tx: "T1",
                op: "W(x ← 120)",
                tag: "+20",
                slots: [
                    { label: "BD", display: "120", tone: "pending" },
                    { label: "T₁", display: "+20 → 120 ✓", tone: "committed" },
                    { label: "T₂", display: "100 (antic)", tone: "warning" },
                ],
                statusText: "T₁ aplica +20 · però T₂ conserva x = 100",
                statusTone: "amber",
                edges: [
                    { fromStep: 2, toSlot: 0, color: "#f59e0b" },
                    { fromStep: 2, toSlot: 1, color: "#10b981" },
                ],
            },
            {
                tx: "T2",
                op: "W(x ← 150)",
                tag: "✕",
                slots: [
                    { label: "BD", display: "150", tone: "warning" },
                    { label: "T₁", display: "120 perdut ✕", tone: "error" },
                    { label: "T₂", display: "150 ≠ 170", tone: "error" },
                ],
                statusText: "T₂ trepitja el +20 de T₁ (esperat: 170)",
                statusTone: "rose",
                edges: [
                    { fromStep: 2, toSlot: 1, color: "#f43f5e", dashed: true },
                    { fromStep: 3, toSlot: 0, color: "#f43f5e", badge: "✕" },
                ],
            },
        ],
    },
    {
        id: "dirty_read",
        label: "No confirmada",
        scope: "1 dada",
        rightTitle: "DADA x = 100",
        minLevelIdx: 1,
        steps: [
            {
                tx: "T2",
                op: "W(x ← 200)",
                tag: "*",
                slots: [
                    { label: "BD", display: "200*", tone: "pending" },
                    { label: "T₁", display: "—", tone: "normal" },
                    { label: "T₂", display: "buffer 200*", tone: "pending" },
                ],
                statusText: "T₂ modifica x = 200 sense COMMIT",
                statusTone: "amber",
                edges: [
                    { fromStep: 0, toSlot: 0, color: "#f59e0b" },
                    { fromStep: 0, toSlot: 2, color: "#f59e0b", dashed: true },
                ],
            },
            {
                tx: "T1",
                op: "R(x) → 200*",
                tag: "⚠",
                slots: [
                    { label: "BD", display: "200*", tone: "pending" },
                    { label: "T₁", display: "200* ⚠", tone: "warning" },
                    { label: "T₂", display: "buffer 200*", tone: "pending" },
                ],
                statusText: "T₁ llegeix la dada no confirmada (200*)",
                statusTone: "amber",
                edges: [
                    { fromStep: 0, toSlot: 0, color: "#f59e0b", dashed: true },
                    { fromStep: 1, toSlot: 1, color: "#f59e0b", badge: "*" },
                ],
            },
            {
                tx: "T2",
                op: "ABORT",
                tag: "↺",
                slots: [
                    { label: "BD", display: "200 ↺ 100", tone: "reverted" },
                    { label: "T₁", display: "200 ✕", tone: "error" },
                    { label: "T₂", display: "ABORT ↺", tone: "reverted" },
                ],
                statusText: "T₂ avorta i desfà x = 100 · T₁ reté 200",
                statusTone: "sky",
                edges: [
                    { fromStep: 2, toSlot: 0, color: "#38bdf8", dashed: true, badge: "↺" },
                    { fromStep: 1, toSlot: 1, color: "#f43f5e" },
                ],
            },
            {
                tx: "T1",
                op: "COMMIT",
                tag: "✕",
                slots: [
                    { label: "BD", display: "100 ✓", tone: "committed" },
                    { label: "T₁", display: "200 ≠ 100", tone: "error" },
                    { label: "T₂", display: "ABORT ↺", tone: "reverted" },
                ],
                statusText: "T₁ confirma basant-se en dades inexistents",
                statusTone: "rose",
                edges: [
                    { fromStep: 2, toSlot: 0, color: "#10b981", dashed: true },
                    { fromStep: 3, toSlot: 1, color: "#f43f5e", badge: "≠" },
                ],
            },
        ],
    },
    {
        id: "non_repeatable",
        label: "No repetible",
        scope: "1 dada",
        rightTitle: "DADA x = 100",
        minLevelIdx: 2,
        steps: [
            {
                tx: "T1",
                op: "R(x) → 100",
                slots: [
                    { label: "BD", display: "100", tone: "normal" },
                    { label: "T₁", display: "1a: 100", tone: "reverted" },
                    { label: "T₂", display: "—", tone: "normal" },
                ],
                statusText: "1a lectura de T₁ sobre x → obté 100",
                statusTone: "sky",
                edges: [
                    { fromStep: 0, toSlot: 0, color: "#475569", dashed: true },
                    { fromStep: 0, toSlot: 1, color: "#38bdf8" },
                ],
            },
            {
                tx: "T2",
                op: "W(x ← 200)",
                tag: "*",
                slots: [
                    { label: "BD", display: "200*", tone: "pending" },
                    { label: "T₁", display: "1a: 100", tone: "normal" },
                    { label: "T₂", display: "buffer 200*", tone: "pending" },
                ],
                statusText: "T₂ modifica la mateixa dada x",
                statusTone: "amber",
                edges: [
                    { fromStep: 1, toSlot: 0, color: "#f59e0b" },
                    { fromStep: 1, toSlot: 2, color: "#f59e0b", dashed: true },
                ],
            },
            {
                tx: "T2",
                op: "COMMIT",
                tag: "✓",
                slots: [
                    { label: "BD", display: "200 ✓", tone: "committed" },
                    { label: "T₁", display: "1a: 100", tone: "normal" },
                    { label: "T₂", display: "COMMIT ✓", tone: "committed" },
                ],
                statusText: "T₂ confirma el nou valor x = 200",
                statusTone: "emerald",
                edges: [
                    { fromStep: 2, toSlot: 0, color: "#10b981", badge: "✓" },
                    { fromStep: 2, toSlot: 2, color: "#10b981" },
                ],
            },
            {
                tx: "T1",
                op: "R(x) → 200",
                tag: "≠",
                slots: [
                    { label: "BD", display: "200", tone: "normal" },
                    { label: "T₁", display: "100 ≠ 200", tone: "error" },
                    { label: "T₂", display: "COMMIT ✓", tone: "committed" },
                ],
                statusText: "Mateixa dada x, dos valors diferents (100 ≠ 200)",
                statusTone: "rose",
                edges: [
                    { fromStep: 0, toSlot: 1, color: "#38bdf8", dashed: true },
                    { fromStep: 3, toSlot: 1, color: "#f43f5e", badge: "≠" },
                ],
            },
        ],
    },
    {
        id: "inconsistent_analysis",
        label: "Anàlisi incons.",
        scope: "Conjunt",
        rightTitle: "CONJUNT {A, B}",
        minLevelIdx: 2,
        steps: [
            {
                tx: "T1",
                op: "R(A) → 100",
                slots: [
                    { label: "A", display: "100", tone: "reverted" },
                    { label: "B", display: "100", tone: "normal" },
                    { label: "Σ(T₁)", display: "100 + …", tone: "reverted" },
                ],
                statusText: "T₁ llegeix A = 100 abans del traspàs",
                statusTone: "sky",
                edges: [
                    { fromStep: 0, toSlot: 0, color: "#38bdf8" },
                    { fromStep: 0, toSlot: 2, color: "#38bdf8", dashed: true },
                ],
            },
            {
                tx: "T2",
                op: "W(A ← 60)",
                tag: "-40",
                slots: [
                    { label: "A", display: "100 → 60*", tone: "pending" },
                    { label: "B", display: "100", tone: "normal" },
                    { label: "Σ(T₁)", display: "100 + …", tone: "normal" },
                ],
                statusText: "T₂ resta 40 a A (traspàs en curs)",
                statusTone: "amber",
                edges: [{ fromStep: 1, toSlot: 0, color: "#f59e0b" }],
            },
            {
                tx: "T2",
                op: "W(B ← 140) ✓",
                tag: "+40",
                slots: [
                    { label: "A", display: "60 ✓", tone: "committed" },
                    { label: "B", display: "140 ✓", tone: "committed" },
                    { label: "Σ(T₁)", display: "100 + …", tone: "normal" },
                ],
                statusText: "T₂ suma 40 a B i confirma · BD coherent (Σ = 200)",
                statusTone: "emerald",
                edges: [
                    { fromStep: 1, toSlot: 0, color: "#10b981" },
                    { fromStep: 2, toSlot: 1, color: "#10b981", badge: "✓" },
                ],
            },
            {
                tx: "T1",
                op: "R(B) → 140",
                tag: "≠",
                slots: [
                    { label: "A", display: "60 ✓", tone: "normal" },
                    { label: "B", display: "140 ✓", tone: "normal" },
                    { label: "Σ(T₁)", display: "240 ≠ 200", tone: "error" },
                ],
                statusText: "T₁ barreja A antic (100) amb B nou (140)",
                statusTone: "rose",
                edges: [
                    { fromStep: 0, toSlot: 0, color: "#38bdf8", dashed: true },
                    { fromStep: 3, toSlot: 1, color: "#f43f5e" },
                    { fromStep: 3, toSlot: 2, color: "#f43f5e", badge: "≠" },
                ],
            },
        ],
    },
    {
        id: "phantom",
        label: "Fantasmes",
        scope: "Conjunt",
        rightTitle: "WHERE cond",
        minLevelIdx: 3,
        steps: [
            {
                tx: "T1",
                op: "SELECT WHERE C",
                tag: "1",
                slots: [
                    { label: "r₁", display: "compleix C", tone: "reverted" },
                    { label: "r₂", display: "—", tone: "normal" },
                    { label: "T₁", display: "{ r₁ } · 1 fila", tone: "reverted" },
                ],
                statusText: "1a consulta WHERE C · retorna { r₁ }",
                statusTone: "sky",
                edges: [
                    { fromStep: 0, toSlot: 0, color: "#38bdf8" },
                    { fromStep: 0, toSlot: 2, color: "#38bdf8" },
                ],
            },
            {
                tx: "T2",
                op: "INSERT r₂ (C)",
                tag: "+1*",
                slots: [
                    { label: "r₁", display: "compleix C", tone: "normal" },
                    { label: "r₂", display: "+ nova*", tone: "pending" },
                    { label: "T₁", display: "{ r₁ } · 1 fila", tone: "normal" },
                ],
                statusText: "T₂ insereix r₂ que compleix la condició C",
                statusTone: "amber",
                edges: [{ fromStep: 1, toSlot: 1, color: "#f59e0b", dashed: true, badge: "+" }],
            },
            {
                tx: "T2",
                op: "COMMIT",
                tag: "✓",
                slots: [
                    { label: "r₁", display: "compleix C", tone: "normal" },
                    { label: "r₂", display: "inserida ✓", tone: "committed" },
                    { label: "T₁", display: "{ r₁ } · 1 fila", tone: "normal" },
                ],
                statusText: "T₂ confirma la nova fila r₂ a la BD",
                statusTone: "emerald",
                edges: [{ fromStep: 2, toSlot: 1, color: "#10b981", badge: "✓" }],
            },
            {
                tx: "T1",
                op: "SELECT WHERE C",
                tag: "+1",
                slots: [
                    { label: "r₁", display: "compleix C", tone: "normal" },
                    { label: "r₂", display: "fantasma ✦", tone: "error" },
                    { label: "T₁", display: "{r₁, r₂} · 2", tone: "error" },
                ],
                statusText: "2a consulta WHERE C · apareix la fila nova r₂",
                statusTone: "rose",
                edges: [
                    { fromStep: 3, toSlot: 0, color: "#38bdf8", dashed: true },
                    { fromStep: 3, toSlot: 1, color: "#f43f5e", badge: "+1" },
                    { fromStep: 3, toSlot: 2, color: "#f43f5e" },
                ],
            },
        ],
    },
];

function getCellToneClass(tone: CellTone): string {
    switch (tone) {
        case "pending":
            return "bg-amber-500/10 border-amber-400/50 border-dashed text-amber-200";
        case "committed":
            return "bg-emerald-500/15 border-emerald-400/70 text-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.18)]";
        case "reverted":
            return "bg-sky-500/15 border-sky-400/70 text-sky-200 shadow-[0_0_10px_rgba(56,189,248,0.18)]";
        case "warning":
            return "bg-amber-500/15 border-amber-400/70 text-amber-200";
        case "error":
            return "bg-rose-500/15 border-rose-500/70 text-rose-200 shadow-[0_0_10px_rgba(244,63,94,0.2)]";
        default:
            return "bg-slate-900/40 border-white/10 text-slate-300";
    }
}

function getStatusPillClass(tone: InterferenceStep["statusTone"]): string {
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

function getStepButtonClass(step: InterferenceStep, isActive: boolean, isDimmed: boolean): string {
    if (isActive) {
        switch (step.statusTone) {
            case "rose":
                return "bg-rose-500/15 border-rose-400 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.22)]";
            case "emerald":
                return "bg-emerald-500/15 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.2)]";
            case "sky":
                return "bg-sky-500/15 border-sky-400 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.2)]";
            case "amber":
                return "bg-amber-500/15 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.2)]";
            default:
                return "bg-slate-800/80 border-slate-400 text-slate-100";
        }
    }
    if (isDimmed) {
        return "bg-slate-900/20 border-white/5 text-slate-600 opacity-35 hover:opacity-70";
    }
    return "bg-slate-900/50 border-white/10 text-slate-300 hover:border-slate-600";
}

/**
 * Interactive minimalist visualizer for the 5 SQL transaction concurrency anomalies
 * (Lost Update, Dirty Read, Non-Repeatable Read, Inconsistent Analysis, Phantoms).
 */
export default function InterferencesVisualizer() {
    const [scenarioId, setScenarioId] = useState<InterferenceId>("lost_update");
    const [stepIndex, setStepIndex] = useState<number>(3);

    const scenario = SCENARIOS.find((s) => s.id === scenarioId) || SCENARIOS[0];
    const currentStep = scenario.steps[stepIndex];

    return (
        <div className="w-full max-w-xl mx-auto my-6 not-prose select-none font-mono text-xs">
            {/* Selector minimalista de les 5 interferències */}
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
                                    ? "bg-sky-500/15 border-sky-400 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.2)] font-semibold"
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
                style={{ gridTemplateColumns: "1.25fr 48px 1fr" }}
            >
                <div className="flex items-center justify-between pr-1">
                    <span>HORARI CONCURRENT</span>
                    <div className="flex items-center gap-1.5 text-[9.5px]">
                        <span className="text-sky-400">T₁</span>
                        <span className="text-slate-700">/</span>
                        <span className="text-violet-400">T₂</span>
                    </div>
                </div>
                <span />
                <div className="flex items-center justify-between gap-1">
                    <span className="truncate">{scenario.rightTitle}</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-900/70 border border-white/10 text-[9px] text-slate-400 shrink-0">
                        {scenario.scope}
                    </span>
                </div>
            </div>

            {/* Cos principal: seqüència temporal (esquerra) + corbes SVG + estat (dreta) */}
            <div
                className="relative grid items-center"
                style={{ gridTemplateColumns: "1.25fr 48px 1fr" }}
            >
                {/* Columna esquerra: 4 passos seqüencials */}
                <div className="flex flex-col gap-2">
                    {scenario.steps.map((step, idx) => {
                        const isActive = stepIndex === idx;
                        const isDimmed = idx > stepIndex;
                        const isT1 = step.tx === "T1";

                        return (
                            <button
                                key={`${scenarioId}-${idx}`}
                                type="button"
                                onMouseEnter={() => setStepIndex(idx)}
                                onClick={() => setStepIndex(idx)}
                                className={`h-9 px-2 rounded-lg border text-left transition-all duration-150 cursor-pointer flex items-center justify-between gap-1.5 ${getStepButtonClass(
                                    step,
                                    isActive,
                                    isDimmed
                                )}`}
                            >
                                <div className="flex items-center gap-1.5 min-w-0">
                                    <span
                                        className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold border shrink-0 ${
                                            isT1
                                                ? "bg-sky-500/15 border-sky-400/30 text-sky-300"
                                                : "bg-violet-500/15 border-violet-400/30 text-violet-300"
                                        }`}
                                    >
                                        {isT1 ? "T₁" : "T₂"}
                                    </span>
                                    <span className="truncate text-[11px]">{step.op}</span>
                                </div>
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
                    viewBox="0 0 48 168"
                    className="w-full h-[168px] pointer-events-none overflow-visible"
                >
                    {currentStep.edges.map((edge, i) => {
                        const y1 = getYLeft(edge.fromStep);
                        const y2 = getYRight(edge.toSlot);
                        return (
                            <g key={`${scenarioId}-${stepIndex}-edge-${i}`}>
                                <path
                                    d={`M 0,${y1} C 24,${y1} 24,${y2} 48,${y2}`}
                                    fill="none"
                                    stroke={edge.color}
                                    strokeWidth={edge.dashed ? 1.5 : 2}
                                    strokeDasharray={edge.dashed ? "3 3" : undefined}
                                    strokeOpacity={0.9}
                                    className="transition-all duration-200"
                                />
                                {edge.badge && (
                                    <g transform={`translate(24, ${(y1 + y2) / 2})`}>
                                        <rect
                                            x="-10"
                                            y="-8"
                                            width="20"
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

                {/* Columna dreta: estat de la BD i vista de les transaccions */}
                <div
                    className="flex flex-col gap-3"
                    style={{ paddingTop: `${OFFSET_RIGHT}px`, paddingBottom: `${OFFSET_RIGHT}px` }}
                >
                    {currentStep.slots.map((slot, idx) => (
                        <div
                            key={`${scenarioId}-slot-${idx}`}
                            className={`h-9 px-2.5 rounded-lg border flex items-center justify-between gap-1.5 transition-all duration-200 ${getCellToneClass(
                                slot.tone
                            )}`}
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

            {/* Resum del pas actual en 1 línia */}
            <div className="mt-3 flex justify-center">
                <div
                    className={`px-3 py-1 rounded-lg border text-[11px] transition-colors text-center ${getStatusPillClass(
                        currentStep.statusTone
                    )}`}
                >
                    {currentStep.statusText}
                </div>
            </div>

            {/* Nivells d'aïllament: quins eviten la interferència i quin n'és el mínim */}
            <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {ISOLATION_LEVELS.map((level, idx) => {
                    const isAvoided = idx >= scenario.minLevelIdx;
                    const isMinimum = idx === scenario.minLevelIdx;

                    return (
                        <div
                            key={level}
                            className={`px-2 py-1 rounded-md border flex items-center justify-between text-[9.5px] transition-colors ${
                                isMinimum
                                    ? "bg-emerald-500/15 border-emerald-400/60 text-emerald-200 font-bold"
                                    : isAvoided
                                    ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-300/90"
                                    : "bg-rose-500/10 border-rose-500/30 text-rose-300/80"
                            }`}
                        >
                            <span className="truncate">{level}</span>
                            <span className="font-bold ml-1 shrink-0">
                                {isAvoided ? "✓" : "✕"}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
