"use client";

import { useState } from "react";

type ScenarioId = "before_ok" | "skip_col" | "after_trap";
type StepIdx = 0 | 1 | 2;
type Tone = "normal" | "sky" | "amber" | "emerald" | "rose";

interface StateCard {
    label: string;
    value: string;
    tone: Tone;
}

interface CurveEdge {
    toCard: 0 | 1 | 2;
    tone: Exclude<Tone, "normal">;
    dashed?: boolean;
    badge?: string;
}

interface StepSpec {
    code: string;
    tag: string;
    tone: Exclude<Tone, "normal">;
    cards: [StateCard, StateCard, StateCard];
    note: string;
    edges: CurveEdge[];
}

interface ScenarioConfig {
    id: ScenarioId;
    label: string;
    rightTitle: string;
    defaultStep: StepIdx;
    activeClass: string;
    steps: [StepSpec, StepSpec, StepSpec];
}

// Geometria exacta: 3 files x 36px + 2 gaps x 14px = 136px
const ROW_H = 36;
const GAP = 14;
const getY = (idx: number) => idx * (ROW_H + GAP) + ROW_H / 2;

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

const TONE_ACTIVE_BTN: Record<Exclude<Tone, "normal">, string> = {
    sky: "bg-sky-500/15 border-sky-400 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.2)]",
    amber: "bg-amber-500/15 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.2)]",
    emerald: "bg-emerald-500/15 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.2)]",
    rose: "bg-rose-500/15 border-rose-400 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.22)]",
};

const TONE_PILL: Record<Exclude<Tone, "normal">, string> = {
    sky: "bg-sky-500/10 border-sky-500/30 text-sky-300",
    amber: "bg-amber-500/10 border-amber-500/30 text-amber-300",
    emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    rose: "bg-rose-500/10 border-rose-500/30 text-rose-300",
};

const SCENARIOS: Record<ScenarioId, ScenarioConfig> = {
    before_ok: {
        id: "before_ok",
        label: "UPDATE qtt := 4",
        rightTitle: "BEFORE ROW",
        defaultStep: 1,
        activeClass: "bg-emerald-500/15 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)] font-semibold",
        steps: [
            {
                code: "1  UPDATE SET qtt = 4",
                tag: "inici",
                tone: "amber",
                cards: [
                    { label: "OLD", value: "qtt: 2 · total: 30", tone: "normal" },
                    { label: "NEW (memòria)", value: "qtt: 4 · total: 30", tone: "amber" },
                    { label: "items (taula)", value: "encara (2, 30)", tone: "normal" },
                ],
                note: "L'UPDATE proposa NEW amb qtt = 4 però encara manté preu_total = 30",
                edges: [{ toCard: 1, tone: "amber", badge: "NEW" }],
            },
            {
                code: "2  NEW.preu_total := 60",
                tag: "muta",
                tone: "amber",
                cards: [
                    { label: "OLD", value: "qtt: 2 · total: 30", tone: "sky" },
                    { label: "NEW (memòria)", value: "qtt: 4 · 30 → 60", tone: "amber" },
                    { label: "items (taula)", value: "encara (2, 30)", tone: "normal" },
                ],
                note: "(OLD.preu_total / OLD.qtt) × NEW.qtt = (30 / 2) × 4 = 60 abans de desar",
                edges: [
                    { toCard: 0, tone: "sky", dashed: true },
                    { toCard: 1, tone: "amber", badge: "×4" },
                ],
            },
            {
                code: "3  RETURN NEW;",
                tag: "✓",
                tone: "emerald",
                cards: [
                    { label: "OLD", value: "qtt: 2 · total: 30", tone: "normal" },
                    { label: "NEW (memòria)", value: "qtt: 4 · total: 60", tone: "emerald" },
                    { label: "items (taula)", value: "qtt: 4 · total: 60 ✓", tone: "emerald" },
                ],
                note: "RETURN NEW desa directament la fila recalculada dins de items",
                edges: [
                    { toCard: 1, tone: "emerald", dashed: true },
                    { toCard: 2, tone: "emerald", badge: "✓" },
                ],
            },
        ],
    },
    skip_col: {
        id: "skip_col",
        label: "UPDATE nom",
        rightTitle: "OF qtt",
        defaultStep: 1,
        activeClass: "bg-sky-500/15 border-sky-400 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.2)] font-semibold",
        steps: [
            {
                code: "1  UPDATE SET nom = 'A'",
                tag: "inici",
                tone: "sky",
                cards: [
                    { label: "OLD", value: "qtt: 2 · total: 30", tone: "normal" },
                    { label: "NEW (memòria)", value: "nom: 'A' · qtt: 2", tone: "sky" },
                    { label: "items (taula)", value: "encara (2, 30)", tone: "normal" },
                ],
                note: "La sentència modifica nom, però qtt no apareix al SET",
                edges: [{ toCard: 1, tone: "sky" }],
            },
            {
                code: "2  UPDATE OF qtt (filtre)",
                tag: "×0",
                tone: "sky",
                cards: [
                    { label: "OLD", value: "qtt: 2 · total: 30", tone: "normal" },
                    { label: "Trigger", value: "No s'activa (×0)", tone: "sky" },
                    { label: "items (taula)", value: "pendent d'escriure", tone: "normal" },
                ],
                note: "Gràcies a BEFORE UPDATE OF qtt, el trigger no es dispara innecessàriament",
                edges: [{ toCard: 1, tone: "sky", dashed: true, badge: "×0" }],
            },
            {
                code: "3  escriptura directa",
                tag: "✓",
                tone: "emerald",
                cards: [
                    { label: "OLD", value: "qtt: 2 · total: 30", tone: "normal" },
                    { label: "Trigger", value: "omès (×0)", tone: "normal" },
                    { label: "items (taula)", value: "nom: 'A' · total: 30 ✓", tone: "emerald" },
                ],
                note: "Nom actualitzat sense cap sobrecàrrega de trigger",
                edges: [{ toCard: 2, tone: "emerald", badge: "✓" }],
            },
        ],
    },
    after_trap: {
        id: "after_trap",
        label: "Si fos AFTER",
        rightTitle: "TRAMPA",
        defaultStep: 2,
        activeClass: "bg-rose-500/15 border-rose-400 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)] font-semibold",
        steps: [
            {
                code: "1  UPDATE SET qtt = 4",
                tag: "inici",
                tone: "amber",
                cards: [
                    { label: "OLD", value: "qtt: 2 · total: 30", tone: "normal" },
                    { label: "NEW (memòria)", value: "qtt: 4 · total: 30", tone: "amber" },
                    { label: "items (taula)", value: "encara (2, 30)", tone: "normal" },
                ],
                note: "Es construeix NEW amb qtt = 4 i preu_total = 30",
                edges: [{ toCard: 1, tone: "amber" }],
            },
            {
                code: "2  escriptura física!",
                tag: "abans!",
                tone: "rose",
                cards: [
                    { label: "OLD", value: "qtt: 2 · total: 30", tone: "normal" },
                    { label: "NEW", value: "ja gravada", tone: "rose" },
                    { label: "items (taula)", value: "DESADA (4, 30) !", tone: "rose" },
                ],
                note: "En un trigger AFTER, la fila ja s'ha escrit a disc abans d'entrar",
                edges: [{ toCard: 2, tone: "rose", badge: "!" }],
            },
            {
                code: "3  NEW.preu_total := 60",
                tag: "ignorat",
                tone: "rose",
                cards: [
                    { label: "OLD", value: "qtt: 2 · total: 30", tone: "normal" },
                    { label: "NEW (perdut)", value: "total := 60 (ignorat)", tone: "amber" },
                    { label: "items (taula)", value: "segueix (4, 30) ✕", tone: "rose" },
                ],
                note: "Canviar NEW a un trigger AFTER no té cap efecte sobre la taula",
                edges: [
                    { toCard: 1, tone: "amber", dashed: true },
                    { toCard: 2, tone: "rose", dashed: true, badge: "✕" },
                ],
            },
        ],
    },
};

const SCENARIO_ORDER: ScenarioId[] = ["before_ok", "skip_col", "after_trap"];

export default function BeforeModifyVisualizer() {
    const [scenarioId, setScenarioId] = useState<ScenarioId>("before_ok");
    const [stepIdx, setStepIdx] = useState<StepIdx>(1);

    const scenario = SCENARIOS[scenarioId];
    const current = scenario.steps[stepIdx];

    return (
        <div className="w-full max-w-xl mx-auto my-6 not-prose select-none font-mono text-xs">
            {/* Selector minimalista d'escenaris */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pb-4">
                {SCENARIO_ORDER.map((id) => {
                    const item = SCENARIOS[id];
                    const isSelected = scenarioId === id;
                    return (
                        <button
                            key={id}
                            type="button"
                            onClick={() => {
                                setScenarioId(id);
                                setStepIdx(item.defaultStep);
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

            {/* Capçaleres */}
            <div
                className="grid items-center text-[10px] text-slate-500 font-semibold tracking-wider pb-2"
                style={{ gridTemplateColumns: "1.15fr 56px 1fr" }}
            >
                <span>SEQÜÈNCIA</span>
                <span />
                <div className="flex items-center justify-between">
                    <span>TUPLA</span>
                    <span className="text-slate-600">{scenario.rightTitle}</span>
                </div>
            </div>

            {/* Cos principal: 3 passos + SVG + 3 targetes */}
            <div
                className="relative grid items-center"
                style={{ gridTemplateColumns: "1.15fr 56px 1fr" }}
            >
                {/* Columna esquerra */}
                <div className="flex flex-col gap-[14px]">
                    {scenario.steps.map((step, idx) => {
                        const sIdx = idx as StepIdx;
                        const isActive = stepIdx === sIdx;
                        const isExecuted = sIdx < stepIdx;

                        return (
                            <button
                                key={`${scenarioId}-${idx}`}
                                type="button"
                                onMouseEnter={() => setStepIdx(sIdx)}
                                onClick={() => setStepIdx(sIdx)}
                                className={`h-9 px-2.5 rounded-lg border text-left transition-all duration-150 cursor-pointer flex items-center justify-between gap-1 ${
                                    isActive
                                        ? TONE_ACTIVE_BTN[step.tone]
                                        : isExecuted
                                        ? "bg-slate-900/50 border-white/10 text-slate-300 hover:border-slate-600"
                                        : "bg-slate-900/20 border-white/5 text-slate-500 opacity-45 hover:opacity-80"
                                }`}
                            >
                                <span className="truncate text-[10.5px] sm:text-[11px]">{step.code}</span>
                                <span className="text-[9.5px] font-bold opacity-80 shrink-0">{step.tag}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Connexions SVG alineades al píxel */}
                <svg
                    viewBox="0 0 56 136"
                    className="w-full h-[136px] pointer-events-none overflow-visible"
                >
                    <defs>
                        {(Object.keys(TONE_HEX) as Exclude<Tone, "normal">[]).map((tone) => (
                            <marker
                                key={tone}
                                id={`bmod-arrow-${tone}`}
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
                        const y1 = getY(stepIdx);
                        const y2 = getY(edge.toCard);
                        const color = TONE_HEX[edge.tone];
                        return (
                            <g key={`${scenarioId}-${stepIdx}-e-${i}`}>
                                <path
                                    d={`M 0,${y1} C 28,${y1} 28,${y2} 53,${y2}`}
                                    fill="none"
                                    stroke={color}
                                    strokeWidth={edge.dashed ? 1.5 : 1.9}
                                    strokeDasharray={edge.dashed ? "3 3" : undefined}
                                    markerEnd={`url(#bmod-arrow-${edge.tone})`}
                                    className="transition-all duration-200"
                                />
                                {edge.badge && (
                                    <g transform={`translate(28, ${(y1 + y2) / 2})`}>
                                        <rect
                                            x="-12"
                                            y="-8"
                                            width="24"
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

                {/* Columna dreta */}
                <div className="flex flex-col gap-[14px]">
                    {current.cards.map((card) => (
                        <div
                            key={card.label}
                            className={`h-9 px-2.5 rounded-lg border flex flex-col justify-center transition-all duration-200 ${TONE_CARD_CLASS[card.tone]}`}
                        >
                            <span className="text-[9px] opacity-65 leading-none">{card.label}</span>
                            <span className="text-[10.5px] sm:text-[11px] font-bold truncate mt-0.5">
                                {card.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Nota compacta en 1 línia */}
            <div className="mt-4 flex justify-center">
                <div className={`px-3 py-1 rounded-lg border text-[11px] transition-colors ${TONE_PILL[current.tone]}`}>
                    {current.note}
                </div>
            </div>
        </div>
    );
}
