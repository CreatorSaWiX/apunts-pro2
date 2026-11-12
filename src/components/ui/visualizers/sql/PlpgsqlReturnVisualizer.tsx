"use client";

import { useState } from "react";

type ReturnModeId = "scalar" | "void" | "setof";
type Tone = "normal" | "sky" | "amber" | "emerald" | "rose";

interface SlotView {
    label: string;
    display: string;
    tone: Tone;
}

interface CurveEdge {
    fromStep: number;
    toSlot: number;
    tone: Exclude<Tone, "normal">;
    dashed?: boolean;
    badge?: string;
}

interface ExecStep {
    lineNum: string;
    code: string;
    tag?: string;
    slots: SlotView[];
    statusText: string;
    statusTone: Tone;
    edges: CurveEdge[];
}

interface ReturnModeConfig {
    id: ReturnModeId;
    label: string;
    tone: Exclude<Tone, "normal">;
    leftHeader: string;
    rightHeader: string;
    sqlCall: string;
    sqlOut: string;
    defaultStep: number;
    steps: ExecStep[];
}

const ROW_H = 36;
const GAP_LEFT = 8;
const GAP_RIGHT = 12;
const SVG_W = 56;

const TONE_HEX: Record<Tone, string> = {
    normal: "#475569",
    sky: "#38bdf8",
    amber: "#f59e0b",
    emerald: "#10b981",
    rose: "#f43f5e",
};

const TONE_TAB: Record<ReturnModeConfig["tone"], string> = {
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

const MODES: ReturnModeConfig[] = [
    {
        id: "scalar",
        label: "RETURN valor",
        tone: "sky",
        leftHeader: "RETURNS VARCHAR(15)",
        rightHeader: "SORTIDA · 1 VALOR",
        sqlCall: "SELECT trobar_ciutat('123A');",
        sqlOut: "'VIC'",
        defaultStep: 1,
        steps: [
            {
                lineNum: "1",
                code: "SELECT ... INTO ciutat",
                slots: [
                    { label: "ciutat", display: "'VIC'", tone: "sky" },
                    { label: "Retorn", display: "pendent…", tone: "normal" },
                ],
                statusText: "SELECT ... INTO desa 1 fila a la variable local",
                statusTone: "sky",
                edges: [{ fromStep: 0, toSlot: 0, tone: "sky" }],
            },
            {
                lineNum: "2",
                code: "RETURN ciutat;",
                tag: "↵ surt",
                slots: [
                    { label: "ciutat", display: "'VIC'", tone: "sky" },
                    { label: "Retorn", display: "'VIC' ✓", tone: "emerald" },
                ],
                statusText: "RETURN envia el valor i acaba la funció immediatament",
                statusTone: "emerald",
                edges: [
                    { fromStep: 0, toSlot: 0, tone: "sky", dashed: true },
                    { fromStep: 1, toSlot: 1, tone: "emerald", badge: "↵" },
                ],
            },
            {
                lineNum: "3",
                code: "-- sentència següent",
                tag: "✕ omès",
                slots: [
                    { label: "Flux", display: "tallat a línia 2", tone: "rose" },
                    { label: "Retorn", display: "'VIC' ✓", tone: "emerald" },
                ],
                statusText: "No s'executa res després de RETURN (1 sol resultat)",
                statusTone: "rose",
                edges: [
                    { fromStep: 1, toSlot: 1, tone: "emerald", dashed: true },
                    { fromStep: 2, toSlot: 0, tone: "rose", dashed: true, badge: "✕" },
                ],
            },
        ],
    },
    {
        id: "void",
        label: "RETURNS void",
        tone: "amber",
        leftHeader: "RETURNS void",
        rightHeader: "BD · SENSE RETORN",
        sqlCall: "SELECT actualitzar_dpt(...);",
        sqlOut: "(void)",
        defaultStep: 1,
        steps: [
            {
                lineNum: "1",
                code: "INSERT / UPDATE ...",
                tag: "BD",
                slots: [
                    { label: "Taula BD", display: "actualitzada", tone: "amber" },
                    { label: "Retorn", display: "∅ (cap)", tone: "normal" },
                ],
                statusText: "Només executa accions SQL sobre les taules",
                statusTone: "amber",
                edges: [{ fromStep: 0, toSlot: 0, tone: "amber" }],
            },
            {
                lineNum: "2",
                code: "RETURN;",
                tag: "buit",
                slots: [
                    { label: "Taula BD", display: "modificada ✓", tone: "emerald" },
                    { label: "Retorn", display: "void (∅)", tone: "sky" },
                ],
                statusText: "RETURN; sense expressió (o END directe) retorna void",
                statusTone: "sky",
                edges: [
                    { fromStep: 0, toSlot: 0, tone: "emerald", dashed: true },
                    { fromStep: 1, toSlot: 1, tone: "sky", badge: "∅" },
                ],
            },
            {
                lineNum: "3",
                code: "END;",
                tag: "✓",
                slots: [
                    { label: "Taula BD", display: "canvis fets ✓", tone: "emerald" },
                    { label: "Retorn", display: "void (∅)", tone: "sky" },
                ],
                statusText: "Procediment completat sense retornar dades al client",
                statusTone: "emerald",
                edges: [{ fromStep: 2, toSlot: 1, tone: "emerald", badge: "✓" }],
            },
        ],
    },
    {
        id: "setof",
        label: "SETOF + RETURN NEXT",
        tone: "emerald",
        leftHeader: "RETURNS SETOF Tdades",
        rightHeader: "BUFFER · N TUPLES",
        sqlCall: "SELECT * FROM clients_ciutat('VIC');",
        sqlOut: "2 files",
        defaultStep: 3,
        steps: [
            {
                lineNum: "1",
                code: "FOR reg IN SELECT ...",
                tag: "iter 1",
                slots: [
                    { label: "reg", display: "(111A, JOAN)", tone: "sky" },
                    { label: "Buffer", display: "[ ] · 0", tone: "normal" },
                    { label: "Flux", display: "dins bucle", tone: "sky" },
                ],
                statusText: "Iteració 1 · reg pren el tipus compost Tdades_client",
                statusTone: "sky",
                edges: [{ fromStep: 0, toSlot: 0, tone: "sky" }],
            },
            {
                lineNum: "2",
                code: "RETURN NEXT reg;",
                tag: "+1 ↻",
                slots: [
                    { label: "reg", display: "(111A, JOAN)", tone: "sky" },
                    { label: "Buffer", display: "[ reg₁ ] · 1", tone: "amber" },
                    { label: "Flux", display: "no acaba ↻", tone: "amber" },
                ],
                statusText: "RETURN NEXT afegeix reg₁ al buffer SENSE sortir",
                statusTone: "amber",
                edges: [
                    { fromStep: 1, toSlot: 1, tone: "amber", badge: "+1" },
                    { fromStep: 1, toSlot: 2, tone: "amber", dashed: true },
                ],
            },
            {
                lineNum: "3",
                code: "LOOP → RETURN NEXT",
                tag: "+2 ↻",
                slots: [
                    { label: "reg", display: "(222B, PAU)", tone: "sky" },
                    { label: "Buffer", display: "[reg₁, reg₂] · 2", tone: "amber" },
                    { label: "Flux", display: "acumula ↻", tone: "amber" },
                ],
                statusText: "Iteració 2 · segueix acumulant files al resultat",
                statusTone: "amber",
                edges: [
                    { fromStep: 2, toSlot: 0, tone: "sky", dashed: true },
                    { fromStep: 2, toSlot: 1, tone: "amber", badge: "+1" },
                ],
            },
            {
                lineNum: "4",
                code: "RETURN;",
                tag: "✓ emet",
                slots: [
                    { label: "reg", display: "fi bucle", tone: "normal" },
                    { label: "Buffer", display: "{reg₁, reg₂} ✓", tone: "emerald" },
                    { label: "Flux", display: "finalitza ✓", tone: "emerald" },
                ],
                statusText: "El RETURN; final tanca la funció i emet les 2 tuples",
                statusTone: "emerald",
                edges: [
                    { fromStep: 3, toSlot: 1, tone: "emerald", badge: "✓" },
                    { fromStep: 3, toSlot: 2, tone: "emerald" },
                ],
            },
        ],
    },
];

/**
 * Interactive minimalist visualizer contrasting PL/pgSQL return mechanisms:
 * scalar/composite RETURN, RETURNS void, and RETURNS SETOF with RETURN NEXT.
 */
export default function PlpgsqlReturnVisualizer() {
    const [modeId, setModeId] = useState<ReturnModeId>("setof");
    const [stepIndex, setStepIndex] = useState<number>(3);

    const activeMode = MODES.find((m) => m.id === modeId) || MODES[0];
    const currentStep = activeMode.steps[stepIndex] || activeMode.steps[0];

    const totalH =
        activeMode.steps.length * ROW_H + (activeMode.steps.length - 1) * GAP_LEFT;
    const rightH =
        currentStep.slots.length * ROW_H + (currentStep.slots.length - 1) * GAP_RIGHT;
    const offsetRight = (totalH - rightH) / 2;

    const getYLeft = (idx: number) => idx * (ROW_H + GAP_LEFT) + ROW_H / 2;
    const getYRight = (idx: number) => offsetRight + idx * (ROW_H + GAP_RIGHT) + ROW_H / 2;

    return (
        <div className="w-full max-w-xl mx-auto my-6 not-prose select-none font-mono text-xs">
            {/* Selector de modalitat de retorn */}
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

            {/* Capçaleres de columna */}
            <div
                className="grid items-center text-[10px] text-slate-500 font-semibold tracking-wider pb-2"
                style={{ gridTemplateColumns: `minmax(0, 1.25fr) ${SVG_W}px minmax(0, 1fr)` }}
            >
                <span className="truncate pr-1">{activeMode.leftHeader}</span>
                <span />
                <span className="text-right truncate pl-1">{activeMode.rightHeader}</span>
            </div>

            {/* Cos principal: flux d'execució + corbes SVG + buffer / sortida */}
            <div
                className="relative grid items-center"
                style={{ gridTemplateColumns: `minmax(0, 1.25fr) ${SVG_W}px minmax(0, 1fr)` }}
            >
                {/* Passos d'execució */}
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
                    viewBox={`0 0 ${SVG_W} ${totalH}`}
                    style={{ height: `${totalH}px` }}
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

                {/* Estat i sortida */}
                <div
                    className="flex flex-col gap-3"
                    style={{
                        paddingTop: `${offsetRight}px`,
                        paddingBottom: `${offsetRight}px`,
                    }}
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

            {/* Crida SQL recomanada */}
            <div className="mt-2 flex justify-center">
                <div className="px-3 py-1 rounded-md bg-slate-900/40 border border-white/5 text-[10.5px] text-slate-400 flex flex-wrap items-center justify-center gap-2">
                    <span className="text-slate-300">{activeMode.sqlCall}</span>
                    <span className="text-slate-600">→</span>
                    <span className="font-bold text-slate-200">{activeMode.sqlOut}</span>
                </div>
            </div>
        </div>
    );
}
