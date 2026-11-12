"use client";

import { useState } from "react";

type ModeId = "passive" | "eca_true" | "eca_false" | "uses";
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

interface EcaStep {
    badge: string;
    badgeTone: Exclude<Tone, "normal">;
    code: string;
    tag?: string;
    slots: SlotView[];
    statusText: string;
    statusTone: Tone;
    edges: CurveEdge[];
}

interface FlowModeConfig {
    id: Exclude<ModeId, "uses">;
    label: string;
    tone: Exclude<Tone, "normal">;
    leftHeader: string;
    rightHeader: string;
    defaultStep: number;
    steps: [EcaStep, EcaStep, EcaStep];
}

interface UseCaseItem {
    id: string;
    label: string;
    tone: Exclude<Tone, "normal">;
    event: string;
    condition: string;
    action: string;
    summary: string;
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
    violet: "#a78bfa",
};

const TONE_TAB: Record<Exclude<Tone, "normal">, string> = {
    sky: "bg-sky-500/15 border-sky-400 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.2)] font-semibold",
    amber: "bg-amber-500/15 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)] font-semibold",
    emerald: "bg-emerald-500/15 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)] font-semibold",
    rose: "bg-rose-500/15 border-rose-400 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)] font-semibold",
    violet: "bg-violet-500/15 border-violet-400 text-violet-300 shadow-[0_0_10px_rgba(167,139,250,0.2)] font-semibold",
};

const TONE_CELL: Record<Tone, string> = {
    normal: "bg-slate-900/40 border-white/10 text-slate-300",
    sky: "bg-sky-500/15 border-sky-400/70 text-sky-200 shadow-[0_0_10px_rgba(56,189,248,0.18)]",
    amber: "bg-amber-500/10 border-amber-400/60 border-dashed text-amber-200",
    emerald: "bg-emerald-500/15 border-emerald-400/70 text-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.18)]",
    rose: "bg-rose-500/15 border-rose-500/70 text-rose-200 shadow-[0_0_10px_rgba(244,63,94,0.2)]",
    violet: "bg-violet-500/15 border-violet-400/70 text-violet-200 shadow-[0_0_10px_rgba(167,139,250,0.18)]",
};

const TONE_STEP_ACTIVE: Record<Tone, string> = {
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

const BADGE_STYLE: Record<Exclude<Tone, "normal">, string> = {
    sky: "bg-sky-500/15 border-sky-400/35 text-sky-300",
    amber: "bg-amber-500/15 border-amber-400/35 text-amber-300",
    emerald: "bg-emerald-500/15 border-emerald-400/35 text-emerald-300",
    rose: "bg-rose-500/15 border-rose-400/35 text-rose-300",
    violet: "bg-violet-500/15 border-violet-400/35 text-violet-300",
};

const TABS: { id: ModeId; label: string; tone: Exclude<Tone, "normal"> }[] = [
    { id: "passive", label: "SGBD PASSIU", tone: "sky" },
    { id: "eca_true", label: "ECA · C = True", tone: "emerald" },
    { id: "eca_false", label: "ECA · C = False", tone: "rose" },
    { id: "uses", label: "4 ÀMBITS", tone: "violet" },
];

const FLOW_MODES: Record<Exclude<ModeId, "uses">, FlowModeConfig> = {
    passive: {
        id: "passive",
        label: "SGBD PASSIU",
        tone: "sky",
        leftHeader: "PETICIÓ EXPLÍCITA",
        rightHeader: "SGBD PASSIU",
        defaultStep: 0,
        steps: [
            {
                badge: "SQL",
                badgeTone: "sky",
                code: "UPDATE emp SET sou = 3000",
                tag: "petició",
                slots: [
                    { label: "emp", display: "sou ← 3000 ✓", tone: "sky" },
                    { label: "Reacció", display: "∅ (cap)", tone: "normal" },
                ],
                statusText: "Només executa l'ordre SQL rebuda directament de l'usuari",
                statusTone: "sky",
                edges: [{ fromStep: 0, toSlot: 0, tone: "sky" }],
            },
            {
                badge: "E/C",
                badgeTone: "amber",
                code: "sense detector ECA",
                tag: "inactiu",
                slots: [
                    { label: "emp", display: "sou ← 3000 ✓", tone: "normal" },
                    { label: "Reacció", display: "sense regles", tone: "normal" },
                ],
                statusText: "No vigila esdeveniments ni avalua condicions automàticament",
                statusTone: "normal",
                edges: [{ fromStep: 1, toSlot: 1, tone: "amber", dashed: true, badge: "—" }],
            },
            {
                badge: "A",
                badgeTone: "rose",
                code: "cap acció automàtica",
                tag: "∅",
                slots: [
                    { label: "emp", display: "sou ← 3000 ✓", tone: "normal" },
                    { label: "auditoria", display: "sense canvis", tone: "normal" },
                ],
                statusText: "L'aplicació hauria de programar manualment qualsevol efecte derivat",
                statusTone: "normal",
                edges: [{ fromStep: 2, toSlot: 1, tone: "rose", dashed: true }],
            },
        ],
    },
    eca_true: {
        id: "eca_true",
        label: "ECA · C = True",
        tone: "emerald",
        leftHeader: "REGLA ECA · ACTIVA",
        rightHeader: "EFECTE SGBD",
        defaultStep: 2,
        steps: [
            {
                badge: "E",
                badgeTone: "sky",
                code: "UPDATE OF sou ON emp",
                tag: "dispara",
                slots: [
                    { label: "emp", display: "sou ← 3000 ✓", tone: "sky" },
                    { label: "auditoria", display: "pendent C…", tone: "normal" },
                ],
                statusText: "Esdeveniment (E): UPDATE OF sou activa automàticament el disparador",
                statusTone: "sky",
                edges: [{ fromStep: 0, toSlot: 0, tone: "sky" }],
            },
            {
                badge: "C",
                badgeTone: "emerald",
                code: "NEW.sou > 2500",
                tag: "True ✓",
                slots: [
                    { label: "emp", display: "sou ← 3000 ✓", tone: "normal" },
                    { label: "Condició", display: "3000 > 2500 ✓", tone: "emerald" },
                ],
                statusText: "Condició (C): s'avalua certa → autoritza l'execució de l'acció",
                statusTone: "emerald",
                edges: [
                    { fromStep: 0, toSlot: 0, tone: "sky", dashed: true },
                    { fromStep: 1, toSlot: 1, tone: "emerald", badge: "✓" },
                ],
            },
            {
                badge: "A",
                badgeTone: "emerald",
                code: "INSERT INTO auditoria",
                tag: "executa",
                slots: [
                    { label: "emp", display: "sou ← 3000 ✓", tone: "sky" },
                    { label: "auditoria", display: "+ registre log ✓", tone: "emerald" },
                ],
                statusText: "Acció (A): executa el procediment emmagatzemat automàticament",
                statusTone: "emerald",
                edges: [
                    { fromStep: 0, toSlot: 0, tone: "sky", dashed: true },
                    { fromStep: 2, toSlot: 1, tone: "emerald", badge: "A ✓" },
                ],
            },
        ],
    },
    eca_false: {
        id: "eca_false",
        label: "ECA · C = False",
        tone: "rose",
        leftHeader: "REGLA ECA · FILTRADA",
        rightHeader: "EFECTE SGBD",
        defaultStep: 1,
        steps: [
            {
                badge: "E",
                badgeTone: "sky",
                code: "UPDATE OF sou ON emp",
                tag: "dispara",
                slots: [
                    { label: "emp", display: "sou ← 2100 ✓", tone: "sky" },
                    { label: "auditoria", display: "pendent C…", tone: "normal" },
                ],
                statusText: "Esdeveniment (E): s'activa igualment en modificar sou",
                statusTone: "sky",
                edges: [{ fromStep: 0, toSlot: 0, tone: "sky" }],
            },
            {
                badge: "C",
                badgeTone: "rose",
                code: "NEW.sou > 2500",
                tag: "False ✕",
                slots: [
                    { label: "emp", display: "sou ← 2100 ✓", tone: "sky" },
                    { label: "Condició", display: "2100 > 2500 ✕", tone: "rose" },
                ],
                statusText: "Condició (C): és falsa → la regla s'atura sense executar A",
                statusTone: "rose",
                edges: [
                    { fromStep: 0, toSlot: 0, tone: "sky", dashed: true },
                    { fromStep: 1, toSlot: 1, tone: "rose", badge: "✕" },
                ],
            },
            {
                badge: "A",
                badgeTone: "amber",
                code: "INSERT INTO auditoria",
                tag: "omès ∅",
                slots: [
                    { label: "emp", display: "sou ← 2100 ✓", tone: "sky" },
                    { label: "auditoria", display: "sense canvis (∅)", tone: "normal" },
                ],
                statusText: "Acció (A): omesa · l'UPDATE original sobre emp es manté intacte",
                statusTone: "amber",
                edges: [
                    { fromStep: 0, toSlot: 0, tone: "sky", dashed: true },
                    { fromStep: 2, toSlot: 1, tone: "amber", dashed: true, badge: "∅" },
                ],
            },
        ],
    },
};

const USE_CASES: UseCaseItem[] = [
    {
        id: "audit",
        label: "Auditoria",
        tone: "sky",
        event: "UPDATE / DELETE",
        condition: "sempre (o > llindar)",
        action: "INSERT INTO log",
        summary: "Registra qui, quan i què s'ha modificat sense tocar l'aplicació",
    },
    {
        id: "derived",
        label: "Atribut derivat",
        tone: "emerald",
        event: "INSERT / DEL / UPD",
        condition: "canvia valor o FK",
        action: "dpt.total += Δ",
        summary: "Manté totals o comptadors sincronitzats de manera incremental",
    },
    {
        id: "business",
        label: "Regla complexa",
        tone: "amber",
        event: "INSERT / UPDATE",
        condition: "consulta altres files",
        action: "RAISE EXCEPTION",
        summary: "Imposa restriccions que un CHECK de fila no pot expressar",
    },
    {
        id: "sync",
        label: "Dades relacionades",
        tone: "violet",
        event: "INSERT / DELETE",
        condition: "manca fila pare/fill",
        action: "INSERT / DEL pare",
        summary: "Crea o manté registres dependents coherents entre taules",
    },
];

/**
 * Interactive minimalist visualizer for active DBMS behavior,
 * the ECA (Event-Condition-Action) rule, and its 4 main use cases.
 */
export default function ECAVisualizer() {
    const [modeId, setModeId] = useState<ModeId>("eca_true");
    const [stepIndex, setStepIndex] = useState<number>(2);
    const [useCaseIdx, setUseCaseIdx] = useState<number>(0);

    const handleSelectMode = (nextMode: ModeId) => {
        setModeId(nextMode);
        if (nextMode !== "uses") {
            setStepIndex(FLOW_MODES[nextMode].defaultStep);
        }
    };

    const flowConfig = modeId === "uses" ? null : FLOW_MODES[modeId];
    const currentFlowStep = flowConfig
        ? flowConfig.steps[stepIndex] || flowConfig.steps[0]
        : null;

    const leftCount = flowConfig ? flowConfig.steps.length : USE_CASES.length;
    const rightCount = currentFlowStep ? currentFlowStep.slots.length : 3;

    const totalH = leftCount * ROW_H + (leftCount - 1) * GAP_LEFT;
    const rightH = rightCount * ROW_H + (rightCount - 1) * GAP_RIGHT;
    const offsetRight = (totalH - rightH) / 2;

    const getYLeft = (idx: number) => idx * (ROW_H + GAP_LEFT) + ROW_H / 2;
    const getYRight = (idx: number) => offsetRight + idx * (ROW_H + GAP_RIGHT) + ROW_H / 2;

    const activeUseCase = USE_CASES[useCaseIdx] || USE_CASES[0];

    return (
        <div className="w-full max-w-xl mx-auto my-6 not-prose select-none font-mono text-xs">
            {/* Selector de mode */}
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
                                    ? TONE_TAB[tab.tone]
                                    : "bg-slate-900/30 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10"
                            }`}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {modeId === "uses" ? (
                <>
                    {/* Capçaleres Àmbits d'ús */}
                    <div
                        className="grid items-center text-[10px] text-slate-500 font-semibold tracking-wider pb-2"
                        style={{ gridTemplateColumns: `minmax(0, 1fr) ${SVG_W}px minmax(0, 1.25fr)` }}
                    >
                        <span className="truncate pr-1">ÀMBIT D&apos;ÚS</span>
                        <span />
                        <span className="text-right truncate pl-1">DESGLOSSAMENT ECA</span>
                    </div>

                    {/* 4 àmbits -> fan out cap a E, C, A */}
                    <div
                        className="relative grid items-center"
                        style={{ gridTemplateColumns: `minmax(0, 1fr) ${SVG_W}px minmax(0, 1.25fr)` }}
                    >
                        <div className="flex flex-col gap-2">
                            {USE_CASES.map((item, idx) => {
                                const isActive = useCaseIdx === idx;
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onMouseEnter={() => setUseCaseIdx(idx)}
                                        onClick={() => setUseCaseIdx(idx)}
                                        className={`h-9 px-2.5 rounded-lg border text-left transition-all duration-150 cursor-pointer flex items-center justify-between gap-1.5 ${
                                            isActive
                                                ? TONE_STEP_ACTIVE[item.tone]
                                                : "bg-slate-900/35 border-white/5 text-slate-400 opacity-55 hover:opacity-90"
                                        }`}
                                    >
                                        <span className="truncate text-[11px] font-semibold">
                                            {item.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        <svg
                            viewBox={`0 0 ${SVG_W} ${totalH}`}
                            style={{ height: `${totalH}px` }}
                            className="w-full pointer-events-none overflow-visible"
                        >
                            {[0, 1, 2].map((targetIdx) => {
                                const y1 = getYLeft(useCaseIdx);
                                const y2 = getYRight(targetIdx);
                                const stroke = TONE_HEX[activeUseCase.tone];
                                return (
                                    <path
                                        key={`use-edge-${targetIdx}`}
                                        d={`M 0,${y1} C ${SVG_W / 2},${y1} ${SVG_W / 2},${y2} ${SVG_W},${y2}`}
                                        fill="none"
                                        stroke={stroke}
                                        strokeWidth="1.8"
                                        strokeOpacity={0.9}
                                        className="transition-all duration-200"
                                    />
                                );
                            })}
                        </svg>

                        <div
                            className="flex flex-col gap-3"
                            style={{
                                paddingTop: `${offsetRight}px`,
                                paddingBottom: `${offsetRight}px`,
                            }}
                        >
                            {[
                                { key: "E", val: activeUseCase.event, tone: "sky" as const },
                                { key: "C", val: activeUseCase.condition, tone: "amber" as const },
                                { key: "A", val: activeUseCase.action, tone: "emerald" as const },
                            ].map((slot) => (
                                <div
                                    key={slot.key}
                                    className={`h-9 px-2.5 rounded-lg border flex items-center justify-between gap-2 transition-all duration-200 ${TONE_CELL[slot.tone]}`}
                                >
                                    <span className="font-bold text-[10.5px] shrink-0">
                                        {slot.key}
                                    </span>
                                    <span className="text-[11px] font-semibold truncate">
                                        {slot.val}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-3 flex justify-center">
                        <div
                            className={`px-3 py-1 rounded-lg border text-[11px] text-center transition-colors ${TONE_PILL[activeUseCase.tone]}`}
                        >
                            {activeUseCase.summary}
                        </div>
                    </div>
                </>
            ) : flowConfig && currentFlowStep ? (
                <>
                    {/* Capçaleres Flux Passiu / ECA */}
                    <div
                        className="grid items-center text-[10px] text-slate-500 font-semibold tracking-wider pb-2"
                        style={{ gridTemplateColumns: `minmax(0, 1.25fr) ${SVG_W}px minmax(0, 1fr)` }}
                    >
                        <span className="truncate pr-1">{flowConfig.leftHeader}</span>
                        <span />
                        <span className="text-right truncate pl-1">{flowConfig.rightHeader}</span>
                    </div>

                    <div
                        className="relative grid items-center"
                        style={{ gridTemplateColumns: `minmax(0, 1.25fr) ${SVG_W}px minmax(0, 1fr)` }}
                    >
                        <div className="flex flex-col gap-2">
                            {flowConfig.steps.map((step, idx) => {
                                const isActive = stepIndex === idx;
                                const isSkipped =
                                    modeId === "eca_false" && idx === 2 && stepIndex >= 1;

                                return (
                                    <button
                                        key={`${flowConfig.id}-${idx}`}
                                        type="button"
                                        onMouseEnter={() => setStepIndex(idx)}
                                        onClick={() => setStepIndex(idx)}
                                        className={`h-9 px-2 rounded-lg border text-left transition-all duration-150 cursor-pointer flex items-center justify-between gap-1.5 ${
                                            isActive
                                                ? TONE_STEP_ACTIVE[step.statusTone]
                                                : isSkipped
                                                ? "bg-slate-900/20 border-white/5 text-slate-600 opacity-35 hover:opacity-75"
                                                : "bg-slate-900/50 border-white/10 text-slate-300 hover:border-slate-600"
                                        }`}
                                    >
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <span
                                                className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold border shrink-0 ${BADGE_STYLE[step.badgeTone]}`}
                                            >
                                                {step.badge}
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

                        <svg
                            viewBox={`0 0 ${SVG_W} ${totalH}`}
                            style={{ height: `${totalH}px` }}
                            className="w-full pointer-events-none overflow-visible"
                        >
                            {currentFlowStep.edges.map((edge, i) => {
                                const y1 = getYLeft(edge.fromStep);
                                const y2 = getYRight(edge.toSlot);
                                const stroke = TONE_HEX[edge.tone];
                                return (
                                    <g key={`${flowConfig.id}-${stepIndex}-edge-${i}`}>
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
                                                    x="-11"
                                                    y="-8"
                                                    width="22"
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
                                                    {edge.badge}
                                                </text>
                                            </g>
                                        )}
                                    </g>
                                );
                            })}
                        </svg>

                        <div
                            className="flex flex-col gap-3"
                            style={{
                                paddingTop: `${offsetRight}px`,
                                paddingBottom: `${offsetRight}px`,
                            }}
                        >
                            {currentFlowStep.slots.map((slot, idx) => (
                                <div
                                    key={`${flowConfig.id}-slot-${idx}`}
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

                    <div className="mt-3 flex justify-center">
                        <div
                            className={`px-3 py-1 rounded-lg border text-[11px] text-center transition-colors ${TONE_PILL[currentFlowStep.statusTone]}`}
                        >
                            {currentFlowStep.statusText}
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
}
