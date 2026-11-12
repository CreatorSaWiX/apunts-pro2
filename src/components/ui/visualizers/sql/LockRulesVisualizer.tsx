"use client";

import { useState } from "react";

type ModeId = "compat" | "read_s" | "write_x" | "upgrade_sx" | "reuse";
type LockMode = "S" | "X";
type Tone = "normal" | "sky" | "amber" | "emerald" | "rose" | "violet";

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

interface RuleStep {
    badge?: string;
    badgeTone?: "sky" | "violet" | "emerald" | "amber";
    op: string;
    tag?: string;
    slots: SlotView[];
    statusText: string;
    statusTone: Tone;
    edges: CurveEdge[];
}

interface SequenceModeConfig {
    id: Exclude<ModeId, "compat">;
    label: string;
    leftHeader: string;
    rightHeader: string;
    isSequential: boolean;
    defaultStep: number;
    steps: RuleStep[];
}

const ROW_H = 36;
const GAP_LEFT = 8;
const GAP_RIGHT = 12;
const SVG_W = 56;

const COMPAT_ROW_H = 38;
const COMPAT_GAP = 12;
const COMPAT_SVG_W = 88;
const COMPAT_H = 2 * COMPAT_ROW_H + COMPAT_GAP;
const getYCompat = (idx: number) => idx * (COMPAT_ROW_H + COMPAT_GAP) + COMPAT_ROW_H / 2;

const TONE_HEX: Record<Tone, string> = {
    normal: "#475569",
    sky: "#38bdf8",
    amber: "#f59e0b",
    emerald: "#10b981",
    rose: "#f43f5e",
    violet: "#a78bfa",
};

const TONE_CELL: Record<Tone, string> = {
    normal: "bg-slate-900/40 border-white/10 text-slate-300",
    sky: "bg-sky-500/15 border-sky-400/70 text-sky-200 shadow-[0_0_10px_rgba(56,189,248,0.18)]",
    amber: "bg-amber-500/10 border-amber-400/60 border-dashed text-amber-200",
    emerald: "bg-emerald-500/15 border-emerald-400/70 text-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.18)]",
    rose: "bg-rose-500/15 border-rose-500/70 text-rose-200 shadow-[0_0_10px_rgba(244,63,94,0.2)]",
    violet: "bg-violet-500/15 border-violet-400/70 text-violet-200 shadow-[0_0_10px_rgba(167,139,250,0.18)]",
};

const TONE_ACTIVE_STEP: Record<Tone, string> = {
    normal: "bg-slate-800/80 border-slate-400 text-slate-100",
    sky: "bg-sky-500/15 border-sky-400 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.2)]",
    amber: "bg-amber-500/15 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.2)]",
    emerald: "bg-emerald-500/15 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.2)]",
    rose: "bg-rose-500/15 border-rose-400 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.22)]",
    violet: "bg-violet-500/15 border-violet-400 text-violet-200 shadow-[0_0_12px_rgba(167,139,250,0.2)]",
};

const TONE_PILL: Record<Tone, string> = {
    normal: "bg-slate-900/50 border-white/10 text-slate-400",
    sky: "bg-sky-500/10 border-sky-500/30 text-sky-300",
    amber: "bg-amber-500/10 border-amber-500/30 text-amber-300",
    emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    rose: "bg-rose-500/10 border-rose-500/30 text-rose-300",
    violet: "bg-violet-500/10 border-violet-500/30 text-violet-300",
};

const BADGE_STYLE: Record<NonNullable<RuleStep["badgeTone"]>, string> = {
    sky: "bg-sky-500/15 border-sky-400/30 text-sky-300",
    violet: "bg-violet-500/15 border-violet-400/30 text-violet-300",
    emerald: "bg-emerald-500/15 border-emerald-400/30 text-emerald-300",
    amber: "bg-amber-500/15 border-amber-400/30 text-amber-300",
};

const TABS: { id: ModeId; label: string }[] = [
    { id: "compat", label: "S vs X" },
    { id: "read_s", label: "R(G) → S" },
    { id: "write_x", label: "RU, W → X" },
    { id: "upgrade_sx", label: "Conversió S → X" },
    { id: "reuse", label: "Ja té LOCK" },
];

const SEQUENCE_MODES: Record<Exclude<ModeId, "compat">, SequenceModeConfig> = {
    read_s: {
        id: "read_s",
        label: "R(G) → S",
        leftHeader: "SEQÜÈNCIA LECTURA",
        rightHeader: "GRÀNUL G",
        isSequential: true,
        defaultStep: 1,
        steps: [
            {
                badge: "1",
                badgeTone: "sky",
                op: "LOCK(G, S)",
                tag: "abans",
                slots: [
                    { label: "Reserva", display: "S (Shared)", tone: "sky" },
                    { label: "Accés", display: "lectura R", tone: "normal" },
                ],
                statusText: "Demana reserva compartida S abans de llegir G",
                statusTone: "sky",
                edges: [{ fromStep: 0, toSlot: 0, tone: "sky" }],
            },
            {
                badge: "2",
                badgeTone: "emerald",
                op: "R(G)",
                tag: "✓",
                slots: [
                    { label: "Reserva", display: "S (Shared)", tone: "sky" },
                    { label: "Accés", display: "R(G) ✓", tone: "emerald" },
                ],
                statusText: "Llegeix G amb S (excepció: READ UNCOMMITTED no demana S)",
                statusTone: "emerald",
                edges: [
                    { fromStep: 0, toSlot: 0, tone: "sky", dashed: true },
                    { fromStep: 1, toSlot: 1, tone: "emerald", badge: "✓" },
                ],
            },
            {
                badge: "3",
                badgeTone: "sky",
                op: "UNLOCK(G)",
                slots: [
                    { label: "Reserva", display: "Lliure", tone: "normal" },
                    { label: "Accés", display: "tancat", tone: "normal" },
                ],
                statusText: "Allibera S (immediat a RC · al final a RR / SERIALIZABLE)",
                statusTone: "normal",
                edges: [{ fromStep: 2, toSlot: 0, tone: "sky", dashed: true, badge: "↺" }],
            },
        ],
    },
    write_x: {
        id: "write_x",
        label: "RU, W → X",
        leftHeader: "SEQÜÈNCIA ESCRIPTURA",
        rightHeader: "GRÀNUL G",
        isSequential: true,
        defaultStep: 2,
        steps: [
            {
                badge: "1",
                badgeTone: "amber",
                op: "LOCK(G, X)",
                tag: "abans RU",
                slots: [
                    { label: "Reserva", display: "X (eXclusive)", tone: "amber" },
                    { label: "Ordre", display: "LOCK(X) 1r", tone: "emerald" },
                ],
                statusText: "Cal demanar LOCK(G, X) abans de RU(G)",
                statusTone: "amber",
                edges: [{ fromStep: 0, toSlot: 0, tone: "amber", badge: "1r" }],
            },
            {
                badge: "2",
                badgeTone: "amber",
                op: "RU(G)",
                slots: [
                    { label: "Reserva", display: "X (eXclusive)", tone: "amber" },
                    { label: "Ordre", display: "RU protegit ✓", tone: "sky" },
                ],
                statusText: "RU(G) ja s'executa amb reserva exclusiva X",
                statusTone: "sky",
                edges: [
                    { fromStep: 0, toSlot: 0, tone: "amber", dashed: true },
                    { fromStep: 1, toSlot: 1, tone: "sky" },
                ],
            },
            {
                badge: "3",
                badgeTone: "emerald",
                op: "W(G)",
                tag: "✓",
                slots: [
                    { label: "Reserva", display: "X (fins final)", tone: "amber" },
                    { label: "Ordre", display: "X → RU → W ✓", tone: "emerald" },
                ],
                statusText: "Escriu G · mai demanar X entre RU(G) i W(G)",
                statusTone: "emerald",
                edges: [
                    { fromStep: 0, toSlot: 0, tone: "amber", dashed: true },
                    { fromStep: 2, toSlot: 1, tone: "emerald", badge: "✓" },
                ],
            },
        ],
    },
    upgrade_sx: {
        id: "upgrade_sx",
        label: "Conversió S → X",
        leftHeader: "HORARI AMB CONVERSIÓ",
        rightHeader: "ESTAT SOBRE G",
        isSequential: true,
        defaultStep: 2,
        steps: [
            {
                badge: "T₁",
                badgeTone: "sky",
                op: "LOCK(G, S) · R(G)",
                slots: [
                    { label: "G", display: "S { T₁ }", tone: "sky" },
                    { label: "T₁", display: "té S", tone: "sky" },
                    { label: "T₂", display: "—", tone: "normal" },
                ],
                statusText: "T₁ adquireix S i llegeix el grànul G",
                statusTone: "sky",
                edges: [
                    { fromStep: 0, toSlot: 0, tone: "sky" },
                    { fromStep: 0, toSlot: 1, tone: "sky", dashed: true },
                ],
            },
            {
                badge: "T₂",
                badgeTone: "violet",
                op: "LOCK(G, S) · R(G)",
                tag: "✓",
                slots: [
                    { label: "G", display: "S { T₁, T₂ }", tone: "emerald" },
                    { label: "T₁", display: "té S", tone: "sky" },
                    { label: "T₂", display: "té S", tone: "violet" },
                ],
                statusText: "T₂ també adquireix S · compatible amb T₁",
                statusTone: "emerald",
                edges: [
                    { fromStep: 1, toSlot: 0, tone: "emerald", badge: "✓" },
                    { fromStep: 1, toSlot: 2, tone: "violet", dashed: true },
                ],
            },
            {
                badge: "T₁",
                badgeTone: "amber",
                op: "LOCK(G, X)",
                tag: "⏳",
                slots: [
                    { label: "G", display: "S { T₂ } · cua T₁", tone: "amber" },
                    { label: "T₁", display: "espera X ⏳", tone: "rose" },
                    { label: "T₂", display: "té S", tone: "violet" },
                ],
                statusText: "T₁ vol fer RU, W → demana X, però espera T₂(S)",
                statusTone: "rose",
                edges: [
                    { fromStep: 2, toSlot: 1, tone: "rose", badge: "⏳" },
                    { fromStep: 1, toSlot: 0, tone: "amber", dashed: true },
                ],
            },
            {
                badge: "T₂",
                badgeTone: "emerald",
                op: "UNLOCK(G) → T₁: X",
                tag: "✓",
                slots: [
                    { label: "G", display: "X { T₁ }", tone: "emerald" },
                    { label: "T₁", display: "S → X · RU, W ✓", tone: "emerald" },
                    { label: "T₂", display: "alliberat", tone: "normal" },
                ],
                statusText: "Quan T₂ allibera S, T₁ converteix S → X i escriu",
                statusTone: "emerald",
                edges: [
                    { fromStep: 3, toSlot: 0, tone: "emerald" },
                    { fromStep: 3, toSlot: 1, tone: "emerald", badge: "✓" },
                ],
            },
        ],
    },
    reuse: {
        id: "reuse",
        label: "Ja té LOCK",
        leftHeader: "RESERVA PRÈVIA + OP",
        rightHeader: "PETICIÓ NOVA?",
        isSequential: false,
        defaultStep: 0,
        steps: [
            {
                badge: "S",
                badgeTone: "sky",
                op: "té S + R(G)",
                tag: "✓",
                slots: [
                    { label: "Té", display: "LOCK(G, S)", tone: "sky" },
                    { label: "Nova?", display: "No cal ✓", tone: "emerald" },
                    { label: "Motiu", display: "S permet R", tone: "normal" },
                ],
                statusText: "Ja té S per repetir lectura → no torna a demanar reserva",
                statusTone: "emerald",
                edges: [
                    { fromStep: 0, toSlot: 0, tone: "sky", dashed: true },
                    { fromStep: 0, toSlot: 1, tone: "emerald", badge: "✓" },
                ],
            },
            {
                badge: "X",
                badgeTone: "amber",
                op: "té X + R(G)",
                tag: "✓",
                slots: [
                    { label: "Té", display: "LOCK(G, X)", tone: "amber" },
                    { label: "Nova?", display: "No cal ✓", tone: "emerald" },
                    { label: "Motiu", display: "X inclou R", tone: "normal" },
                ],
                statusText: "Ja té X per llegir de nou → no torna a demanar reserva",
                statusTone: "emerald",
                edges: [
                    { fromStep: 1, toSlot: 0, tone: "amber", dashed: true },
                    { fromStep: 1, toSlot: 1, tone: "emerald", badge: "✓" },
                ],
            },
            {
                badge: "X",
                badgeTone: "amber",
                op: "té X + RU, W",
                tag: "✓",
                slots: [
                    { label: "Té", display: "LOCK(G, X)", tone: "amber" },
                    { label: "Nova?", display: "No cal ✓", tone: "emerald" },
                    { label: "Motiu", display: "X inclou RU, W", tone: "normal" },
                ],
                statusText: "Ja té X per escriure de nou → no torna a demanar reserva",
                statusTone: "emerald",
                edges: [
                    { fromStep: 2, toSlot: 0, tone: "amber", dashed: true },
                    { fromStep: 2, toSlot: 1, tone: "emerald", badge: "✓" },
                ],
            },
            {
                badge: "S",
                badgeTone: "sky",
                op: "té S + RU, W",
                tag: "↑ X",
                slots: [
                    { label: "Té", display: "S (només R)", tone: "amber" },
                    { label: "Nova?", display: "LOCK(G, X) ↑", tone: "amber" },
                    { label: "Motiu", display: "conversió S→X", tone: "rose" },
                ],
                statusText: "S no permet escriure → ha de demanar conversió a LOCK(G, X)",
                statusTone: "amber",
                edges: [
                    { fromStep: 3, toSlot: 0, tone: "amber", dashed: true },
                    { fromStep: 3, toSlot: 1, tone: "amber", badge: "↑" },
                ],
            },
        ],
    },
};

function CompatMatrixView() {
    const [focus, setFocus] = useState<{ side: "left" | "right"; mode: LockMode }>({
        side: "left",
        mode: "S",
    });

    const modes: { id: LockMode; label: string; permits: string }[] = [
        { id: "S", label: "S · Shared", permits: "R" },
        { id: "X", label: "X · eXclusive", permits: "R, RU, W" },
    ];

    const isCompatible = (l: LockMode, r: LockMode) => l === "S" && r === "S";
    const pairs: { l: LockMode; r: LockMode; li: number; ri: number }[] = [
        { l: "S", r: "S", li: 0, ri: 0 },
        { l: "S", r: "X", li: 0, ri: 1 },
        { l: "X", r: "S", li: 1, ri: 0 },
        { l: "X", r: "X", li: 1, ri: 1 },
    ];

    // Punt exacte sobre la corba de Bézier cúbica (t=0.75 prop de dreta, t=0.25 prop d'esquerra)
    const getCurveBadgePoint = (y1: number, y2: number, nearRight: boolean) => {
        const t = nearRight ? 0.75 : 0.25;
        const u = 1 - t;
        const x =
            3 * u * u * t * (COMPAT_SVG_W / 2) +
            3 * u * t * t * (COMPAT_SVG_W / 2) +
            t * t * t * COMPAT_SVG_W;
        const y = (u * u * u + 3 * u * u * t) * y1 + (3 * u * t * t + t * t * t) * y2;
        return { x, y };
    };

    const statusText =
        focus.side === "left"
            ? focus.mode === "S"
                ? "T₁ té S → T₂ pot obtenir S ✓, però X ha d'esperar ✕"
                : "T₁ té X → incompatible amb S i X · T₂ sempre espera ✕"
            : focus.mode === "S"
            ? "T₂ demana S → compatible amb S ✓, incompatible amb X ✕"
            : "T₂ demana X → incompatible amb S i X · ha d'esperar ✕";

    const statusTone: Tone = focus.mode === "S" ? "emerald" : "rose";

    return (
        <>
            {/* Capçaleres */}
            <div
                className="grid items-center text-[10px] text-slate-500 font-semibold tracking-wider pb-2"
                style={{ gridTemplateColumns: `minmax(0, 1fr) ${COMPAT_SVG_W}px minmax(0, 1fr)` }}
            >
                <span className="pr-1">T₁ TÉ SOBRE G</span>
                <span className="text-center text-slate-600">compat.</span>
                <span className="text-right pl-1">T₂ DEMANA G</span>
            </div>

            {/* Graella 2×2 amb corbes SVG */}
            <div
                className="relative grid items-center"
                style={{ gridTemplateColumns: `minmax(0, 1fr) ${COMPAT_SVG_W}px minmax(0, 1fr)` }}
            >
                {/* T1 té */}
                <div className="flex flex-col gap-3">
                    {modes.map((m) => {
                        const isSelected = focus.side === "left" && focus.mode === m.id;
                        const tone: Tone = m.id === "S" ? "sky" : "amber";
                        return (
                            <button
                                key={`l-${m.id}`}
                                type="button"
                                onMouseEnter={() => setFocus({ side: "left", mode: m.id })}
                                onClick={() => setFocus({ side: "left", mode: m.id })}
                                className={`h-[38px] px-2.5 rounded-lg border transition-all duration-150 cursor-pointer flex items-center justify-between gap-1.5 ${
                                    isSelected
                                        ? TONE_ACTIVE_STEP[tone]
                                        : "bg-slate-900/40 border-white/10 text-slate-300 hover:border-slate-600"
                                }`}
                            >
                                <span className="font-semibold text-[11px] truncate">{m.label}</span>
                                <span className="text-[9.5px] opacity-75 shrink-0">{m.permits}</span>
                            </button>
                        );
                    })}
                </div>

                {/* SVG Bipartit */}
                <svg
                    viewBox={`0 0 ${COMPAT_SVG_W} ${COMPAT_H}`}
                    className="w-full h-[88px] pointer-events-none overflow-visible"
                >
                    {pairs.map((p) => {
                        const y1 = getYCompat(p.li);
                        const y2 = getYCompat(p.ri);
                        const ok = isCompatible(p.l, p.r);
                        const isActive =
                            focus.side === "left" ? focus.mode === p.l : focus.mode === p.r;

                        const strokeColor = isActive ? (ok ? "#10b981" : "#f43f5e") : "#334155";
                        const pathData =
                            y1 === y2
                                ? `M 0,${y1} L ${COMPAT_SVG_W},${y2}`
                                : `M 0,${y1} C ${COMPAT_SVG_W / 2},${y1} ${COMPAT_SVG_W / 2},${y2} ${COMPAT_SVG_W},${y2}`;
                        const badgePt = getCurveBadgePoint(y1, y2, focus.side === "left");

                        return (
                            <g key={`${p.l}-${p.r}`}>
                                <path
                                    d={pathData}
                                    fill="none"
                                    stroke={strokeColor}
                                    strokeWidth={isActive ? 2 : 1.1}
                                    strokeDasharray={!isActive || !ok ? "3 3" : undefined}
                                    strokeOpacity={isActive ? 0.95 : 0.25}
                                    className="transition-all duration-200"
                                />
                                {isActive && (
                                    <g transform={`translate(${badgePt.x}, ${badgePt.y})`}>
                                        <rect
                                            x="-9"
                                            y="-8"
                                            width="18"
                                            height="16"
                                            rx="4"
                                            fill="#020617"
                                            stroke={strokeColor}
                                            strokeWidth="1"
                                        />
                                        <text
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            y="1"
                                            fill={strokeColor}
                                            fontSize="9.5"
                                            fontWeight="bold"
                                        >
                                            {ok ? "✓" : "✕"}
                                        </text>
                                    </g>
                                )}
                            </g>
                        );
                    })}
                </svg>

                {/* T2 demana */}
                <div className="flex flex-col gap-3">
                    {modes.map((m) => {
                        const isSelected = focus.side === "right" && focus.mode === m.id;
                        const activeCompat =
                            focus.side === "left" && isCompatible(focus.mode, m.id);
                        const activeBlocked =
                            focus.side === "left" && !isCompatible(focus.mode, m.id);

                        const rowClass = isSelected
                            ? TONE_ACTIVE_STEP[m.id === "S" ? "emerald" : "rose"]
                            : activeCompat
                            ? TONE_CELL.emerald
                            : activeBlocked
                            ? TONE_CELL.rose
                            : "bg-slate-900/40 border-white/10 text-slate-300 hover:border-slate-600";

                        return (
                            <button
                                key={`r-${m.id}`}
                                type="button"
                                onMouseEnter={() => setFocus({ side: "right", mode: m.id })}
                                onClick={() => setFocus({ side: "right", mode: m.id })}
                                className={`h-[38px] px-2.5 rounded-lg border transition-all duration-150 cursor-pointer flex items-center justify-between gap-1.5 ${rowClass}`}
                            >
                                <span className="font-semibold text-[11px] truncate">
                                    LOCK(G, {m.id})
                                </span>
                                <span className="text-[10px] font-bold shrink-0">
                                    {focus.side === "left"
                                        ? activeCompat
                                            ? "✓"
                                            : "⏳"
                                        : m.permits}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Resum en 1 línia */}
            <div className="mt-4 flex justify-center">
                <div
                    className={`px-3 py-1 rounded-lg border text-[11px] text-center transition-colors ${TONE_PILL[statusTone]}`}
                >
                    {statusText}
                </div>
            </div>
        </>
    );
}

/**
 * Interactive minimalist visualizer for lock modes (S vs X compatibility)
 * and the 4 transaction lock-request rules on granules.
 */
export default function LockRulesVisualizer() {
    const [modeId, setModeId] = useState<ModeId>("compat");
    const [stepIndex, setStepIndex] = useState<number>(1);

    const handleSelectMode = (nextMode: ModeId) => {
        setModeId(nextMode);
        if (nextMode !== "compat") {
            setStepIndex(SEQUENCE_MODES[nextMode].defaultStep);
        }
    };

    const seqConfig = modeId === "compat" ? null : SEQUENCE_MODES[modeId];
    const currentStep = seqConfig
        ? seqConfig.steps[stepIndex] || seqConfig.steps[0]
        : null;

    const totalH = seqConfig
        ? seqConfig.steps.length * ROW_H + (seqConfig.steps.length - 1) * GAP_LEFT
        : 0;
    const rightH = currentStep
        ? currentStep.slots.length * ROW_H + (currentStep.slots.length - 1) * GAP_RIGHT
        : 0;
    const offsetRight = (totalH - rightH) / 2;

    const getYLeft = (idx: number) => idx * (ROW_H + GAP_LEFT) + ROW_H / 2;
    const getYRight = (idx: number) => offsetRight + idx * (ROW_H + GAP_RIGHT) + ROW_H / 2;

    return (
        <div className="w-full max-w-xl mx-auto my-6 not-prose select-none font-mono text-xs">
            {/* Selector minimalista */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pb-4">
                {TABS.map((tab) => {
                    const isSelected = tab.id === modeId;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => handleSelectMode(tab.id)}
                            className={`px-2.5 py-1 rounded-md border text-[11px] transition-all duration-150 cursor-pointer ${
                                isSelected
                                    ? "bg-sky-500/15 border-sky-400 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.2)] font-semibold"
                                    : "bg-slate-900/30 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10"
                            }`}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {modeId === "compat" || !seqConfig || !currentStep ? (
                <CompatMatrixView />
            ) : (
                <>
                    {/* Capçaleres */}
                    <div
                        className="grid items-center text-[10px] text-slate-500 font-semibold tracking-wider pb-2"
                        style={{ gridTemplateColumns: `minmax(0, 1.25fr) ${SVG_W}px minmax(0, 1fr)` }}
                    >
                        <span className="truncate pr-1">{seqConfig.leftHeader}</span>
                        <span />
                        <span className="text-right truncate pl-1">{seqConfig.rightHeader}</span>
                    </div>

                    {/* Cos principal: passos (esquerra) + corbes SVG + estat G (dreta) */}
                    <div
                        className="relative grid items-center"
                        style={{ gridTemplateColumns: `minmax(0, 1.25fr) ${SVG_W}px minmax(0, 1fr)` }}
                    >
                        <div className="flex flex-col gap-2">
                            {seqConfig.steps.map((step, idx) => {
                                const isActive = stepIndex === idx;
                                const isDimmed = seqConfig.isSequential
                                    ? idx > stepIndex
                                    : stepIndex !== idx;

                                return (
                                    <button
                                        key={`${seqConfig.id}-${idx}`}
                                        type="button"
                                        onMouseEnter={() => setStepIndex(idx)}
                                        onClick={() => setStepIndex(idx)}
                                        className={`h-9 px-2 rounded-lg border text-left transition-all duration-150 cursor-pointer flex items-center justify-between gap-1.5 ${
                                            isActive
                                                ? TONE_ACTIVE_STEP[step.statusTone]
                                                : isDimmed
                                                ? "bg-slate-900/20 border-white/5 text-slate-600 opacity-35 hover:opacity-75"
                                                : "bg-slate-900/50 border-white/10 text-slate-300 hover:border-slate-600"
                                        }`}
                                    >
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            {step.badge && step.badgeTone && (
                                                <span
                                                    className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold border shrink-0 ${BADGE_STYLE[step.badgeTone]}`}
                                                >
                                                    {step.badge}
                                                </span>
                                            )}
                                            <span className="truncate text-[11px]">{step.op}</span>
                                        </div>
                                        {step.tag && (
                                            <span className="text-[9.5px] font-bold opacity-80 shrink-0">
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
                                    <g key={`${seqConfig.id}-${stepIndex}-edge-${i}`}>
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

                        {/* Estat sobre G */}
                        <div
                            className="flex flex-col gap-3"
                            style={{
                                paddingTop: `${offsetRight}px`,
                                paddingBottom: `${offsetRight}px`,
                            }}
                        >
                            {currentStep.slots.map((slot, idx) => (
                                <div
                                    key={`${seqConfig.id}-slot-${idx}`}
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

                    {/* Resum en 1 línia */}
                    <div className="mt-4 flex justify-center">
                        <div
                            className={`px-3 py-1 rounded-lg border text-[11px] text-center transition-colors ${TONE_PILL[currentStep.statusTone]}`}
                        >
                            {currentStep.statusText}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
