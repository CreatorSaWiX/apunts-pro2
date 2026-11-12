"use client";

import { useState } from "react";

type ScenarioId = "non_recoverable" | "recoverable" | "cascade";
type OpTone = "neutral" | "amber" | "emerald" | "rose" | "sky";
type LaneState = "idle" | "open" | "committed" | "aborted";

interface TimeSlot {
    t: number;
    t1?: { label: string; tone: OpTone };
    t2?: { label: string; tone: OpTone };
    t1Lane: LaneState;
    t2Lane: LaneState;
    dbValue: string;
    verdict: string;
    verdictTone: OpTone;
}

interface ScenarioConfig {
    id: ScenarioId;
    label: string;
    activeClass: string;
    slots: [TimeSlot, TimeSlot, TimeSlot, TimeSlot, TimeSlot, TimeSlot];
    outcomeEdge: {
        fromT: number; // 1-based time index
        toT: number;
        color: string;
        dashed?: boolean;
        badge: string;
    };
}

const ROW_H = 32;
const GAP = 8;
const getY = (t: number) => (t - 1) * (ROW_H + GAP) + ROW_H / 2;

const BASE_SLOTS: [TimeSlot, TimeSlot, TimeSlot, TimeSlot] = [
    {
        t: 1,
        t1: { label: "RU(A)", tone: "neutral" },
        t1Lane: "open",
        t2Lane: "idle",
        dbValue: "A = 10",
        verdict: "T1 inicia lectura sobre A",
        verdictTone: "neutral",
    },
    {
        t: 2,
        t1: { label: "W(A)", tone: "amber" },
        t1Lane: "open",
        t2Lane: "idle",
        dbValue: "A = 20*",
        verdict: "T1 escriu valor no confirmat",
        verdictTone: "amber",
    },
    {
        t: 3,
        t2: { label: "RU(A)", tone: "amber" },
        t1Lane: "open",
        t2Lane: "open",
        dbValue: "A = 20*",
        verdict: "T2 depèn del W(A) de T1",
        verdictTone: "amber",
    },
    {
        t: 4,
        t2: { label: "W(A)", tone: "amber" },
        t1Lane: "open",
        t2Lane: "open",
        dbValue: "A = 30*",
        verdict: "T2 escriu sobre la dada de T1",
        verdictTone: "amber",
    },
];

const SCENARIOS: ScenarioConfig[] = [
    {
        id: "non_recoverable",
        label: "NO RECUPERABLE",
        activeClass: "bg-rose-500/15 border-rose-400 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)] font-semibold",
        slots: [
            ...BASE_SLOTS,
            {
                t: 5,
                t2: { label: "COMMIT", tone: "rose" },
                t1Lane: "open",
                t2Lane: "committed",
                dbValue: "A = 30 (disc)",
                verdict: "T2 confirma mentre T1 segueix oberta",
                verdictTone: "rose",
            },
            {
                t: 6,
                t1: { label: "ABORT", tone: "rose" },
                t1Lane: "aborted",
                t2Lane: "committed",
                dbValue: "A = 30 (disc)",
                verdict: "✕ NO RECUPERABLE · T2 ja no es pot desfer",
                verdictTone: "rose",
            },
        ],
        outcomeEdge: {
            fromT: 6,
            toT: 5,
            color: "#f43f5e",
            dashed: true,
            badge: "✕",
        },
    },
    {
        id: "recoverable",
        label: "RECUPERABLE",
        activeClass: "bg-emerald-500/15 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)] font-semibold",
        slots: [
            ...BASE_SLOTS,
            {
                t: 5,
                t1: { label: "COMMIT", tone: "emerald" },
                t1Lane: "committed",
                t2Lane: "open",
                dbValue: "A = 20 (disc)",
                verdict: "T1 confirma primer la dependència",
                verdictTone: "emerald",
            },
            {
                t: 6,
                t2: { label: "COMMIT", tone: "emerald" },
                t1Lane: "committed",
                t2Lane: "committed",
                dbValue: "A = 30 (disc)",
                verdict: "✓ RECUPERABLE · T1 confirma abans que T2",
                verdictTone: "emerald",
            },
        ],
        outcomeEdge: {
            fromT: 5,
            toT: 6,
            color: "#10b981",
            badge: "✓",
        },
    },
    {
        id: "cascade",
        label: "CASCADA (ABORT)",
        activeClass: "bg-sky-500/15 border-sky-400 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.2)] font-semibold",
        slots: [
            ...BASE_SLOTS,
            {
                t: 5,
                t1: { label: "ABORT", tone: "sky" },
                t1Lane: "aborted",
                t2Lane: "open",
                dbValue: "A = 10*",
                verdict: "T1 avorta abans que T2 confirmi",
                verdictTone: "sky",
            },
            {
                t: 6,
                t2: { label: "ABORT ↺", tone: "sky" },
                t1Lane: "aborted",
                t2Lane: "aborted",
                dbValue: "A = 10 (intacte)",
                verdict: "✓ RECUPERABLE · T2 es desfà en cascada",
                verdictTone: "sky",
            },
        ],
        outcomeEdge: {
            fromT: 5,
            toT: 6,
            color: "#38bdf8",
            dashed: true,
            badge: "↺",
        },
    },
];

function getOpButtonClass(tone: OpTone, isActive: boolean, isFuture: boolean): string {
    if (isFuture) {
        return "bg-slate-900/20 border-white/5 text-slate-600 opacity-30 hover:opacity-70";
    }
    if (isActive) {
        switch (tone) {
            case "emerald":
                return "bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.22)]";
            case "rose":
                return "bg-rose-500/20 border-rose-400 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.25)]";
            case "sky":
                return "bg-sky-500/20 border-sky-400 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.22)]";
            case "amber":
                return "bg-amber-500/20 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.2)]";
            default:
                return "bg-slate-800/80 border-slate-400 text-slate-100";
        }
    }
    switch (tone) {
        case "emerald":
            return "bg-emerald-500/10 border-emerald-500/35 text-emerald-300";
        case "rose":
            return "bg-rose-500/10 border-rose-500/35 text-rose-300";
        case "sky":
            return "bg-sky-500/10 border-sky-500/35 text-sky-300";
        case "amber":
            return "bg-amber-500/10 border-amber-500/30 text-amber-300/90";
        default:
            return "bg-slate-900/50 border-white/10 text-slate-300 hover:border-slate-600";
    }
}

function getFooterToneClass(tone: OpTone): string {
    switch (tone) {
        case "emerald":
            return "bg-emerald-500/10 border-emerald-500/30 text-emerald-300";
        case "rose":
            return "bg-rose-500/10 border-rose-500/30 text-rose-300";
        case "sky":
            return "bg-sky-500/10 border-sky-500/30 text-sky-300";
        case "amber":
            return "bg-amber-500/10 border-amber-500/30 text-amber-300";
        default:
            return "bg-slate-900/50 border-white/10 text-slate-400";
    }
}

interface LaneProps {
    slots: TimeSlot[];
    side: "t1" | "t2";
    activeT: number;
    onSelectT: (t: number) => void;
}

function TransactionLane({ slots, side, activeT, onSelectT }: LaneProps) {
    return (
        <div className="flex flex-col gap-2">
            {slots.map((slot) => {
                const isActive = activeT === slot.t;
                const isFuture = slot.t > activeT;
                const op = side === "t1" ? slot.t1 : slot.t2;
                const lane = side === "t1" ? slot.t1Lane : slot.t2Lane;

                if (!op) {
                    const isOpenLine = !isFuture && lane === "open";
                    return (
                        <button
                            key={`${side}-empty-${slot.t}`}
                            type="button"
                            onMouseEnter={() => onSelectT(slot.t)}
                            onClick={() => onSelectT(slot.t)}
                            className="h-8 flex items-center justify-center cursor-pointer"
                        >
                            <span
                                className={`w-px h-full transition-colors ${
                                    isOpenLine
                                        ? "border-l border-dashed border-amber-500/40"
                                        : "border-l border-white/5"
                                }`}
                            />
                        </button>
                    );
                }

                return (
                    <button
                        key={`${side}-${slot.t}`}
                        type="button"
                        onMouseEnter={() => onSelectT(slot.t)}
                        onClick={() => onSelectT(slot.t)}
                        className={`h-8 px-2.5 rounded-lg border text-center transition-all duration-150 cursor-pointer flex items-center justify-center text-[11px] font-medium ${getOpButtonClass(
                            op.tone,
                            isActive,
                            isFuture
                        )}`}
                    >
                        {op.label}
                    </button>
                );
            })}
        </div>
    );
}

export default function RecoverabilityVisualizer() {
    const [scenarioId, setScenarioId] = useState<ScenarioId>("non_recoverable");
    const [activeT, setActiveT] = useState<number>(6);

    const scenario = SCENARIOS.find((s) => s.id === scenarioId) || SCENARIOS[0];
    const currentSlot = scenario.slots[activeT - 1] || scenario.slots[5];

    const showDepEdge = activeT >= 3;
    const showOutcomeEdge = activeT === 6;

    const depColor =
        activeT >= 5
            ? scenarioId === "recoverable"
                ? "#10b981"
                : scenarioId === "cascade"
                ? "#38bdf8"
                : activeT === 6
                ? "#f43f5e"
                : "#f59e0b"
            : "#f59e0b";

    const depBadge =
        activeT >= 5
            ? scenarioId === "recoverable"
                ? "A ✓"
                : scenarioId === "cascade"
                ? "A ↺"
                : activeT === 6
                ? "A ✕"
                : "A*"
            : "A*";

    const yDep1 = getY(2);
    const yDep2 = getY(3);
    const yOut1 = getY(scenario.outcomeEdge.fromT);
    const yOut2 = getY(scenario.outcomeEdge.toT);

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
                                setActiveT(6);
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
                style={{ gridTemplateColumns: "20px 1fr 84px 1fr" }}
            >
                <span className="text-center text-slate-600">t</span>
                <span className="text-center">T1</span>
                <span className="text-center text-slate-600">dep</span>
                <span className="text-center">T2</span>
            </div>

            {/* Cos principal: temps + T1 + connexions SVG + T2 */}
            <div
                className="relative grid items-start"
                style={{ gridTemplateColumns: "20px 1fr 84px 1fr" }}
            >
                {/* Columna t = 1..6 */}
                <div className="flex flex-col gap-2">
                    {scenario.slots.map((slot) => {
                        const isActive = activeT === slot.t;
                        const isFuture = slot.t > activeT;
                        return (
                            <button
                                key={`t-${slot.t}`}
                                type="button"
                                onMouseEnter={() => setActiveT(slot.t)}
                                onClick={() => setActiveT(slot.t)}
                                className={`h-8 flex items-center justify-center text-[10px] rounded transition-colors cursor-pointer ${
                                    isActive
                                        ? "text-slate-200 font-bold"
                                        : isFuture
                                        ? "text-slate-700"
                                        : "text-slate-500 hover:text-slate-300"
                                }`}
                            >
                                {slot.t}
                            </button>
                        );
                    })}
                </div>

                {/* Columna T1 */}
                <TransactionLane slots={scenario.slots} side="t1" activeT={activeT} onSelectT={setActiveT} />

                {/* Connexions SVG (dependència T1 -> T2 i relació COMMIT/ABORT) */}
                <svg
                    viewBox="0 0 84 232"
                    className="w-full h-[232px] pointer-events-none overflow-visible"
                >
                    <defs>
                        {[
                            { id: "rec-arrow-amber", color: "#f59e0b" },
                            { id: "rec-arrow-emerald", color: "#10b981" },
                            { id: "rec-arrow-rose", color: "#f43f5e" },
                            { id: "rec-arrow-sky", color: "#38bdf8" },
                        ].map((m) => (
                            <marker
                                key={m.id}
                                id={m.id}
                                viewBox="0 0 6 6"
                                refX="4.5"
                                refY="3"
                                markerWidth="4.5"
                                markerHeight="4.5"
                                orient="auto"
                            >
                                <path d="M 0 0 L 6 3 L 0 6 z" fill={m.color} />
                            </marker>
                        ))}
                    </defs>

                    {/* 1. Fletxa de dependència: T1 W(A) [t=2] -> T2 RU(A) [t=3] */}
                    <g opacity={showDepEdge ? 1 : 0.12} className="transition-opacity duration-200">
                        <path
                            d={`M 0,${yDep1} C 42,${yDep1} 42,${yDep2} 81,${yDep2}`}
                            fill="none"
                            stroke={showDepEdge ? depColor : "#334155"}
                            strokeWidth={showDepEdge ? 1.8 : 1.1}
                            strokeDasharray={scenarioId === "cascade" && activeT >= 5 ? "3 3" : undefined}
                            markerEnd={
                                !showDepEdge
                                    ? undefined
                                    : depColor === "#10b981"
                                    ? "url(#rec-arrow-emerald)"
                                    : depColor === "#f43f5e"
                                    ? "url(#rec-arrow-rose)"
                                    : depColor === "#38bdf8"
                                    ? "url(#rec-arrow-sky)"
                                    : "url(#rec-arrow-amber)"
                            }
                        />
                        {showDepEdge && (
                            <g transform={`translate(42, ${(yDep1 + yDep2) / 2})`}>
                                <rect
                                    x="-13"
                                    y="-8"
                                    width="26"
                                    height="16"
                                    rx="4"
                                    fill="#020617"
                                    stroke={depColor}
                                    strokeWidth="1"
                                />
                                <text
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    y="0.5"
                                    fill={depColor}
                                    fontSize="9"
                                    fontWeight="bold"
                                >
                                    {depBadge}
                                </text>
                            </g>
                        )}
                    </g>

                    {/* 2. Fletxa de veredicte entre t=5 i t=6 */}
                    <g opacity={showOutcomeEdge ? 1 : 0.1} className="transition-opacity duration-200">
                        <path
                            d={`M 0,${yOut1} C 42,${yOut1} 42,${yOut2} 81,${yOut2}`}
                            fill="none"
                            stroke={showOutcomeEdge ? scenario.outcomeEdge.color : "#334155"}
                            strokeWidth={showOutcomeEdge ? 1.8 : 1}
                            strokeDasharray={scenario.outcomeEdge.dashed ? "3 3" : undefined}
                            markerEnd={
                                !showOutcomeEdge
                                    ? undefined
                                    : scenario.outcomeEdge.color === "#10b981"
                                    ? "url(#rec-arrow-emerald)"
                                    : scenario.outcomeEdge.color === "#f43f5e"
                                    ? "url(#rec-arrow-rose)"
                                    : "url(#rec-arrow-sky)"
                            }
                        />
                        {showOutcomeEdge && (
                            <g transform={`translate(42, ${(yOut1 + yOut2) / 2})`}>
                                <rect
                                    x="-9"
                                    y="-8"
                                    width="18"
                                    height="16"
                                    rx="4"
                                    fill="#020617"
                                    stroke={scenario.outcomeEdge.color}
                                    strokeWidth="1"
                                />
                                <text
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    y="0.5"
                                    fill={scenario.outcomeEdge.color}
                                    fontSize="9.5"
                                    fontWeight="bold"
                                >
                                    {scenario.outcomeEdge.badge}
                                </text>
                            </g>
                        )}
                    </g>
                </svg>

                {/* Columna T2 */}
                <TransactionLane slots={scenario.slots} side="t2" activeT={activeT} onSelectT={setActiveT} />
            </div>

            {/* Estat compacte: valor d'A + criteri de recuperabilitat */}
            <div className="mt-4 flex justify-center">
                <div
                    className={`px-3 py-1 rounded-lg border text-[11px] flex flex-wrap items-center justify-center gap-2 transition-colors ${getFooterToneClass(
                        currentSlot.verdictTone
                    )}`}
                >
                    <span className="font-bold">{currentSlot.dbValue}</span>
                    <span className="opacity-40">|</span>
                    <span>{currentSlot.verdict}</span>
                </div>
            </div>
        </div>
    );
}
