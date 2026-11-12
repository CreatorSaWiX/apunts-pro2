"use client";

import { useState } from "react";

type ScenarioId = "two_rows" | "zero_rows" | "check_fail" | "return_null";
type PhaseIdx = 0 | 1 | 2 | 3 | 4;
type Tone = "normal" | "sky" | "amber" | "emerald" | "rose";

interface RightCard {
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

interface PhaseSpec {
    idx: PhaseIdx;
    label: string;
    countTag: string;
    executed: boolean;
    tone: Exclude<Tone, "normal">;
    cards: [RightCard, RightCard, RightCard];
    note: string;
    edges: EdgeList;
}

type EdgeList = CurveEdge[];

interface ScenarioConfig {
    id: ScenarioId;
    label: string;
    activeClass: string;
    defaultPhase: PhaseIdx;
    phases: [PhaseSpec, PhaseSpec, PhaseSpec, PhaseSpec, PhaseSpec];
}

// Geometria exacta: esquerra 5*32 + 4*8 = 192px; dreta 20 + 3*40 + 2*16 + 20 = 192px
const ROW_H_LEFT = 32;
const GAP_LEFT = 8;
const CARD_H_RIGHT = 40;
const GAP_RIGHT = 16;
const OFFSET_RIGHT = 20;

const getYLeft = (idx: number) => idx * (ROW_H_LEFT + GAP_LEFT) + ROW_H_LEFT / 2;
const getYRight = (idx: number) => OFFSET_RIGHT + idx * (CARD_H_RIGHT + GAP_RIGHT) + CARD_H_RIGHT / 2;

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
    two_rows: {
        id: "two_rows",
        label: "2 FILES",
        activeClass: "bg-emerald-500/15 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)] font-semibold",
        defaultPhase: 3,
        phases: [
            {
                idx: 0,
                label: "BEFORE STATEMENT",
                countTag: "×1",
                executed: true,
                tone: "sky",
                cards: [
                    { label: "NEW / OLD", value: "NULL", tone: "normal" },
                    { label: "BD", value: "sense canvis", tone: "normal" },
                    { label: "Execucions", value: "1 cop (inici)", tone: "sky" },
                ],
                note: "S'executa 1 cop abans de processar files · ideal per regles globals",
                edges: [{ toCard: 2, tone: "sky", badge: "×1" }],
            },
            {
                idx: 1,
                label: "BEFORE ROW",
                countTag: "×2",
                executed: true,
                tone: "amber",
                cards: [
                    { label: "NEW / OLD", value: "disponible ✓", tone: "amber" },
                    { label: "BD", value: "abans de física", tone: "amber" },
                    { label: "Execucions", value: "1 per fila (×2)", tone: "amber" },
                ],
                note: "Permet alterar NEW o preparar FK abans de validar restriccions",
                edges: [
                    { toCard: 0, tone: "amber", badge: "NEW" },
                    { toCard: 2, tone: "amber", dashed: true },
                ],
            },
            {
                idx: 2,
                label: "DML + PK/FK/CHECK",
                countTag: "×2",
                executed: true,
                tone: "emerald",
                cards: [
                    { label: "NEW / OLD", value: "validada", tone: "normal" },
                    { label: "BD", value: "2 files desades ✓", tone: "emerald" },
                    { label: "Restriccions", value: "PK · FK · CHECK ✓", tone: "emerald" },
                ],
                note: "Escriu a la taula i comprova totes les restriccions d'integritat",
                edges: [{ toCard: 1, tone: "emerald", badge: "✓" }],
            },
            {
                idx: 3,
                label: "AFTER ROW",
                countTag: "×2",
                executed: true,
                tone: "emerald",
                cards: [
                    { label: "NEW / OLD", value: "disponible ✓", tone: "emerald" },
                    { label: "BD", value: "coherent + fills ✓", tone: "emerald" },
                    { label: "Execucions", value: "STMT: 1 · ROW: 2", tone: "emerald" },
                ],
                note: "La fila ja és vàlida · segur per auditar o propagar a altres taules",
                edges: [
                    { toCard: 0, tone: "emerald" },
                    { toCard: 1, tone: "emerald", badge: "✓" },
                ],
            },
            {
                idx: 4,
                label: "AFTER STATEMENT",
                countTag: "×1",
                executed: true,
                tone: "sky",
                cards: [
                    { label: "NEW / OLD", value: "NULL", tone: "normal" },
                    { label: "BD", value: "2 files finals ✓", tone: "emerald" },
                    { label: "Execucions", value: "1 cop (final)", tone: "sky" },
                ],
                note: "Tanca la sentència 1 sol cop al final · sense accés a NEW ni OLD",
                edges: [{ toCard: 2, tone: "sky", badge: "×1" }],
            },
        ],
    },
    zero_rows: {
        id: "zero_rows",
        label: "0 FILES",
        activeClass: "bg-sky-500/15 border-sky-400 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.2)] font-semibold",
        defaultPhase: 4,
        phases: [
            {
                idx: 0,
                label: "BEFORE STATEMENT",
                countTag: "×1",
                executed: true,
                tone: "sky",
                cards: [
                    { label: "NEW / OLD", value: "NULL", tone: "normal" },
                    { label: "BD", value: "0 files afectades", tone: "normal" },
                    { label: "Execucions", value: "STMT: ×1 ✓", tone: "sky" },
                ],
                note: "BEFORE STATEMENT s'executa igualment encara que hi hagi 0 files",
                edges: [{ toCard: 2, tone: "sky", badge: "×1" }],
            },
            {
                idx: 1,
                label: "BEFORE ROW",
                countTag: "×0",
                executed: false,
                tone: "amber",
                cards: [
                    { label: "NEW / OLD", value: "— (no entra)", tone: "normal" },
                    { label: "BD", value: "sense canvis", tone: "normal" },
                    { label: "Execucions", value: "ROW: ×0 (botat)", tone: "amber" },
                ],
                note: "Amb 0 files afectades, els triggers FOR EACH ROW no s'executen mai",
                edges: [{ toCard: 2, tone: "amber", dashed: true, badge: "×0" }],
            },
            {
                idx: 2,
                label: "DML + PK/FK/CHECK",
                countTag: "×0",
                executed: false,
                tone: "amber",
                cards: [
                    { label: "NEW / OLD", value: "—", tone: "normal" },
                    { label: "BD", value: "sense canvis", tone: "normal" },
                    { label: "Restriccions", value: "cap fila a validar", tone: "amber" },
                ],
                note: "No es modifica cap tupla física a la taula",
                edges: [{ toCard: 1, tone: "amber", dashed: true, badge: "×0" }],
            },
            {
                idx: 3,
                label: "AFTER ROW",
                countTag: "×0",
                executed: false,
                tone: "amber",
                cards: [
                    { label: "NEW / OLD", value: "— (no entra)", tone: "normal" },
                    { label: "BD", value: "sense canvis", tone: "normal" },
                    { label: "Execucions", value: "ROW: ×0 (botat)", tone: "amber" },
                ],
                note: "Amb 0 files afectades, AFTER ROW tampoc arriba a disparar-se",
                edges: [{ toCard: 2, tone: "amber", dashed: true, badge: "×0" }],
            },
            {
                idx: 4,
                label: "AFTER STATEMENT",
                countTag: "×1",
                executed: true,
                tone: "sky",
                cards: [
                    { label: "NEW / OLD", value: "NULL", tone: "normal" },
                    { label: "BD", value: "intacta (0 files)", tone: "normal" },
                    { label: "Execucions", value: "STMT: 1 · ROW: 0", tone: "sky" },
                ],
                note: "STATEMENT sempre dispara (×1) · ROW només si afecta ≥ 1 fila (×0)",
                edges: [{ toCard: 2, tone: "sky", badge: "×1" }],
            },
        ],
    },
    check_fail: {
        id: "check_fail",
        label: "CHECK ✕",
        activeClass: "bg-rose-500/15 border-rose-400 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)] font-semibold",
        defaultPhase: 2,
        phases: [
            {
                idx: 0,
                label: "BEFORE STATEMENT",
                countTag: "×1",
                executed: true,
                tone: "sky",
                cards: [
                    { label: "NEW / OLD", value: "NULL", tone: "normal" },
                    { label: "BD", value: "abans d'error", tone: "normal" },
                    { label: "Execucions", value: "×1 (però farà UNDO)", tone: "sky" },
                ],
                note: "S'executa al principi, però si falla després es desfarà per atomicitat",
                edges: [{ toCard: 2, tone: "sky" }],
            },
            {
                idx: 1,
                label: "BEFORE ROW",
                countTag: "×1",
                executed: true,
                tone: "amber",
                cards: [
                    { label: "NEW / OLD", value: "disponible", tone: "amber" },
                    { label: "BD", value: "abans de CHECK", tone: "amber" },
                    { label: "Fase", value: "Abans de restriccions", tone: "amber" },
                ],
                note: "S'executa ABANS de comprovar CHECK/FK · última opció per corregir NEW",
                edges: [{ toCard: 0, tone: "amber", badge: "NEW" }],
            },
            {
                idx: 2,
                label: "DML + PK/FK/CHECK",
                countTag: "✕",
                executed: true,
                tone: "rose",
                cards: [
                    { label: "Restricció", value: "CHECK / FK FAIL ✕", tone: "rose" },
                    { label: "BD", value: "ROLLBACK ↺", tone: "rose" },
                    { label: "AFTER", value: "NO s'executa (×0)", tone: "rose" },
                ],
                note: "Viola PK/FK/CHECK abans dels triggers AFTER · avorta i desfà tot",
                edges: [
                    { toCard: 0, tone: "rose", badge: "✕" },
                    { toCard: 1, tone: "rose", dashed: true },
                ],
            },
            {
                idx: 3,
                label: "AFTER ROW",
                countTag: "—",
                executed: false,
                tone: "rose",
                cards: [
                    { label: "Restricció", value: "tall previ", tone: "rose" },
                    { label: "BD", value: "ROLLBACK ↺", tone: "rose" },
                    { label: "Execucions", value: "no arriba (×0)", tone: "rose" },
                ],
                note: "Mai s'executa si falla una restricció de taula",
                edges: [{ toCard: 2, tone: "rose", dashed: true, badge: "✕" }],
            },
            {
                idx: 4,
                label: "AFTER STATEMENT",
                countTag: "—",
                executed: false,
                tone: "rose",
                cards: [
                    { label: "Estat", value: "transacció avortada", tone: "rose" },
                    { label: "BD", value: "ROLLBACK ↺", tone: "rose" },
                    { label: "Execucions", value: "no arriba (×0)", tone: "rose" },
                ],
                note: "Per atomicitat, s'avorta abans d'arribar a AFTER STATEMENT",
                edges: [{ toCard: 1, tone: "rose", dashed: true, badge: "↺" }],
            },
        ],
    },
    return_null: {
        id: "return_null",
        label: "RETURN NULL",
        activeClass: "bg-amber-500/15 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)] font-semibold",
        defaultPhase: 1,
        phases: [
            {
                idx: 0,
                label: "BEFORE STATEMENT",
                countTag: "×1",
                executed: true,
                tone: "sky",
                cards: [
                    { label: "NEW / OLD", value: "NULL", tone: "normal" },
                    { label: "BD", value: "inici", tone: "normal" },
                    { label: "Execucions", value: "×1", tone: "sky" },
                ],
                note: "Execució normal d'inici de sentència",
                edges: [{ toCard: 2, tone: "sky" }],
            },
            {
                idx: 1,
                label: "BEFORE ROW",
                countTag: "NULL",
                executed: true,
                tone: "amber",
                cards: [
                    { label: "Retorn", value: "RETURN NULL;", tone: "amber" },
                    { label: "BD", value: "fila ignorada (sense error)", tone: "sky" },
                    { label: "AFTER ROW", value: "botat (×0)", tone: "amber" },
                ],
                note: "Cancel·la silenciosament la fila · no fa DML ni AFTER ROW, sense error",
                edges: [
                    { toCard: 0, tone: "amber", badge: "∅" },
                    { toCard: 1, tone: "sky", dashed: true },
                ],
            },
            {
                idx: 2,
                label: "DML + PK/FK/CHECK",
                countTag: "—",
                executed: false,
                tone: "amber",
                cards: [
                    { label: "Retorn", value: "cancel·lat per BEFORE", tone: "amber" },
                    { label: "BD", value: "fila no escrita", tone: "normal" },
                    { label: "Excepció", value: "cap (silenciós)", tone: "sky" },
                ],
                note: "Com que BEFORE ROW ha retornat NULL, la modificació física s'omet",
                edges: [{ toCard: 1, tone: "amber", dashed: true, badge: "—" }],
            },
            {
                idx: 3,
                label: "AFTER ROW",
                countTag: "—",
                executed: false,
                tone: "amber",
                cards: [
                    { label: "Retorn", value: "cancel·lat per BEFORE", tone: "amber" },
                    { label: "BD", value: "fila omesa", tone: "normal" },
                    { label: "AFTER ROW", value: "no s'executa", tone: "amber" },
                ],
                note: "Si la fila es descarta silenciosament, no dispara AFTER ROW",
                edges: [{ toCard: 2, tone: "amber", dashed: true, badge: "—" }],
            },
            {
                idx: 4,
                label: "AFTER STATEMENT",
                countTag: "×1",
                executed: true,
                tone: "sky",
                cards: [
                    { label: "Excepció", value: "cap (no hi ha ROLLBACK)", tone: "sky" },
                    { label: "BD", value: "resta intacta ✓", tone: "emerald" },
                    { label: "Execucions", value: "STMT: ×1", tone: "sky" },
                ],
                note: "No hi ha error: AFTER STATEMENT s'executa i la transacció continua",
                edges: [{ toCard: 2, tone: "sky", badge: "×1" }],
            },
        ],
    },
};

const SCENARIO_ORDER: ScenarioId[] = ["two_rows", "zero_rows", "check_fail", "return_null"];

export default function TriggerOrderVisualizer() {
    const [scenarioId, setScenarioId] = useState<ScenarioId>("two_rows");
    const [activePhase, setActivePhase] = useState<PhaseIdx>(3);

    const scenario = SCENARIOS[scenarioId];
    const current = scenario.phases[activePhase];

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
                                setActivePhase(item.defaultPhase);
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
                style={{ gridTemplateColumns: "1.2fr 52px 1fr" }}
            >
                <span>ORDRE D&apos;EXECUCIÓ</span>
                <span />
                <div className="flex items-center justify-between">
                    <span>ESTAT</span>
                    <span className="text-slate-600">{scenario.label}</span>
                </div>
            </div>

            {/* Cos principal: 5 fases a l'esquerra + SVG + 3 targetes d'estat a la dreta */}
            <div
                className="relative grid items-center"
                style={{ gridTemplateColumns: "1.2fr 52px 1fr" }}
            >
                {/* Columna esquerra: fases */}
                <div className="flex flex-col gap-2">
                    {scenario.phases.map((phase) => {
                        const isActive = activePhase === phase.idx;
                        const isSkipped = !phase.executed;

                        return (
                            <button
                                key={`${scenarioId}-${phase.idx}`}
                                type="button"
                                onMouseEnter={() => setActivePhase(phase.idx)}
                                onClick={() => setActivePhase(phase.idx)}
                                className={`h-8 px-2.5 rounded-lg border text-left transition-all duration-150 cursor-pointer flex items-center justify-between gap-1 ${
                                    isActive
                                        ? TONE_ACTIVE_BTN[phase.tone]
                                        : isSkipped
                                        ? "bg-slate-900/15 border-white/5 text-slate-600 opacity-35 hover:opacity-70"
                                        : "bg-slate-900/45 border-white/10 text-slate-300 hover:border-slate-600"
                                }`}
                            >
                                <span className={`truncate text-[10px] sm:text-[11px] ${isSkipped && !isActive ? "line-through" : ""}`}>
                                    {phase.label}
                                </span>
                                <span className="text-[10px] font-bold opacity-80 shrink-0">
                                    {phase.countTag}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Connexions SVG alineades al píxel */}
                <svg
                    viewBox="0 0 52 192"
                    className="w-full h-[192px] pointer-events-none overflow-visible"
                >
                    <defs>
                        {(Object.keys(TONE_HEX) as Exclude<Tone, "normal">[]).map((tone) => (
                            <marker
                                key={tone}
                                id={`trig-arrow-${tone}`}
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
                        const y1 = getYLeft(activePhase);
                        const y2 = getYRight(edge.toCard);
                        const color = TONE_HEX[edge.tone];

                        return (
                            <g key={`${scenarioId}-${activePhase}-edge-${i}`}>
                                <path
                                    d={`M 0,${y1} C 26,${y1} 26,${y2} 49,${y2}`}
                                    fill="none"
                                    stroke={color}
                                    strokeWidth={edge.dashed ? 1.5 : 1.9}
                                    strokeDasharray={edge.dashed ? "3 3" : undefined}
                                    markerEnd={`url(#trig-arrow-${edge.tone})`}
                                    className="transition-all duration-200"
                                />
                                {edge.badge && (
                                    <g transform={`translate(26, ${(y1 + y2) / 2})`}>
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

                {/* Columna dreta: 3 targetes d'efecte */}
                <div
                    className="flex flex-col gap-4"
                    style={{ paddingTop: `${OFFSET_RIGHT}px`, paddingBottom: `${OFFSET_RIGHT}px` }}
                >
                    {current.cards.map((card) => (
                        <div
                            key={card.label}
                            className={`h-10 px-2.5 rounded-lg border flex flex-col justify-center transition-all duration-200 ${TONE_CARD_CLASS[card.tone]}`}
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
