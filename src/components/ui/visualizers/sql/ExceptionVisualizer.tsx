"use client";

import { useState } from "react";

type ScenarioId = "ok" | "raise" | "fk" | "unique" | "trap";
type Tone = "emerald" | "amber" | "rose" | "sky" | "violet";

interface ScenarioConfig {
    id: ScenarioId;
    label: string;
    activeClass: string;
    fromStepIdx: 0 | 1 | 2;
    toBranchIdx: 0 | 1 | 2 | 3;
    badge: string;
    tone: Tone;
    beginTag?: string;
    omitRaiseHandler?: boolean;
    sqlState: string;
    resultMessage: string;
}

// Geometria exacta: esquerra 3x36px + 2x12px + 2x18px = 168px; dreta 4x36px + 3x8px = 168px
const ROW_H = 36;
const OFFSET_LEFT = 18;
const GAP_LEFT = 12;
const GAP_RIGHT = 8;
const TOTAL_H = 4 * ROW_H + 3 * GAP_RIGHT; // 168px
const SVG_W = 64;

const getYLeft = (idx: 0 | 1 | 2) => OFFSET_LEFT + idx * (ROW_H + GAP_LEFT) + ROW_H / 2; // 36, 84, 132
const getYRight = (idx: 0 | 1 | 2 | 3) => idx * (ROW_H + GAP_RIGHT) + ROW_H / 2; // 18, 62, 106, 150

const BEGIN_STEPS: { idx: 0 | 1 | 2; code: string; sub: string }[] = [
    { idx: 0, code: "IF qtt < 12 → RAISE", sub: "regla" },
    { idx: 1, code: "INSERT items_comanda", sub: "DML" },
    { idx: 2, code: "RETURN;", sub: "sortida" },
];

const EXCEPTION_BRANCHES: {
    idx: 0 | 1 | 2 | 3;
    label: string;
    codeTag: string;
    targetScenario: ScenarioId;
}[] = [
    { idx: 0, label: "WHEN raise_exception", codeTag: "P0001", targetScenario: "raise" },
    { idx: 1, label: "WHEN foreign_key_violation", codeTag: "23503", targetScenario: "fk" },
    { idx: 2, label: "WHEN OTHERS", codeTag: "resta", targetScenario: "unique" },
    { idx: 3, label: "Sortida normal (void)", codeTag: "✓", targetScenario: "ok" },
];

const SCENARIOS: ScenarioConfig[] = [
    {
        id: "ok",
        label: "✓ VÀLID (20)",
        activeClass: "bg-emerald-500/15 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)] font-semibold",
        fromStepIdx: 2,
        toBranchIdx: 3,
        badge: "✓",
        tone: "emerald",
        sqlState: "00000",
        resultMessage: "INSERT confirmat · RETURN void ✓",
    },
    {
        id: "raise",
        label: "P0001 · RAISE",
        activeClass: "bg-amber-500/15 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)] font-semibold",
        fromStepIdx: 0,
        toBranchIdx: 0,
        badge: "P0001",
        tone: "amber",
        sqlState: "P0001",
        resultMessage: "RAISE 'Quantitat 5 inferior a 12' (missatge preservat)",
    },
    {
        id: "fk",
        label: "23503 · FK",
        activeClass: "bg-rose-500/15 border-rose-400 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)] font-semibold",
        fromStepIdx: 1,
        toBranchIdx: 1,
        badge: "23503",
        tone: "rose",
        beginTag: "↺ rollback",
        sqlState: "23503",
        resultMessage: "↺ Rollback BEGIN · 'La comanda o el producte no existeixen'",
    },
    {
        id: "unique",
        label: "23505 · PK",
        activeClass: "bg-sky-500/15 border-sky-400 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.2)] font-semibold",
        fromStepIdx: 1,
        toBranchIdx: 2,
        badge: "23505",
        tone: "sky",
        beginTag: "↺ rollback",
        sqlState: "23505",
        resultMessage: "↺ Rollback BEGIN · capturat per OTHERS → 'Error intern: ...'",
    },
    {
        id: "trap",
        label: "⚠ TRAMPA OTHERS",
        activeClass: "bg-violet-500/15 border-violet-400 text-violet-300 shadow-[0_0_10px_rgba(167,139,250,0.22)] font-semibold",
        fromStepIdx: 0,
        toBranchIdx: 2,
        badge: "P0001",
        tone: "violet",
        omitRaiseHandler: true,
        sqlState: "P0001",
        resultMessage: "⚠ Sense raise_exception → OTHERS emmascara: 'Error intern: Quantitat...'",
    },
];

const TONE_HEX: Record<Tone, string> = {
    emerald: "#10b981",
    amber: "#f59e0b",
    rose: "#f43f5e",
    sky: "#38bdf8",
    violet: "#a78bfa",
};

const TONE_CARD: Record<Tone, string> = {
    emerald: "bg-emerald-500/15 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.2)]",
    amber: "bg-amber-500/15 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.2)]",
    rose: "bg-rose-500/15 border-rose-500 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.2)]",
    sky: "bg-sky-500/15 border-sky-400 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.2)]",
    violet: "bg-violet-500/15 border-violet-400 text-violet-200 shadow-[0_0_12px_rgba(167,139,250,0.22)]",
};

const TONE_PILL: Record<Tone, string> = {
    emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    amber: "bg-amber-500/10 border-amber-500/30 text-amber-300",
    rose: "bg-rose-500/10 border-rose-500/30 text-rose-300",
    sky: "bg-sky-500/10 border-sky-500/30 text-sky-300",
    violet: "bg-violet-500/10 border-violet-500/30 text-violet-300",
};

export default function ExceptionVisualizer() {
    const [scenarioId, setScenarioId] = useState<ScenarioId>("raise");

    const scenario = SCENARIOS.find((s) => s.id === scenarioId) || SCENARIOS[0];
    const y1 = getYLeft(scenario.fromStepIdx);
    const y2 = getYRight(scenario.toBranchIdx);
    const color = TONE_HEX[scenario.tone];

    return (
        <div className="w-full max-w-xl mx-auto my-6 not-prose select-none font-mono text-xs">
            {/* Selector d'escenaris */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pb-4">
                {SCENARIOS.map((item) => {
                    const isSelected = item.id === scenarioId;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setScenarioId(item.id)}
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
                style={{ gridTemplateColumns: "1.1fr 64px 1.2fr" }}
            >
                <div className="flex items-center justify-between pr-1">
                    <span>BLOC BEGIN</span>
                    <span className="text-slate-600">SQLSTATE {scenario.sqlState}</span>
                </div>
                <span />
                <span className="text-right">EXCEPTION / SORTIDA</span>
            </div>

            {/* Cos principal: BEGIN -> Encaminament SVG -> EXCEPTION */}
            <div
                className="relative grid items-start"
                style={{ gridTemplateColumns: "1.1fr 64px 1.2fr" }}
            >
                {/* Columna esquerra: sentències dins BEGIN */}
                <div
                    className="flex flex-col gap-3"
                    style={{ paddingTop: `${OFFSET_LEFT}px`, paddingBottom: `${OFFSET_LEFT}px` }}
                >
                    {BEGIN_STEPS.map((step) => {
                        const isOrigin = scenario.fromStepIdx === step.idx;
                        const isPassedOk =
                            scenario.id === "ok" && (step.idx === 1 || step.idx === 2);
                        const isSkipped =
                            (scenario.fromStepIdx === 0 && step.idx > 0) ||
                            (scenario.fromStepIdx === 1 && step.idx > 1);

                        let cardClass = "bg-slate-900/40 border-white/10 text-slate-400";
                        if (isOrigin) {
                            cardClass = TONE_CARD[scenario.tone];
                        } else if (isPassedOk) {
                            cardClass = "bg-emerald-500/10 border-emerald-500/35 text-emerald-300";
                        } else if (isSkipped) {
                            cardClass = "bg-slate-900/20 border-white/5 text-slate-600 opacity-25";
                        }

                        return (
                            <button
                                key={step.idx}
                                type="button"
                                onClick={() => {
                                    if (step.idx === 0) setScenarioId("raise");
                                    else if (step.idx === 1) setScenarioId("fk");
                                    else setScenarioId("ok");
                                }}
                                className={`h-9 px-2.5 rounded-lg border flex items-center justify-between gap-1.5 text-left transition-all duration-150 cursor-pointer ${cardClass}`}
                            >
                                <span className="text-[11px] truncate">{step.code}</span>
                                <span className="text-[9px] opacity-75 shrink-0">
                                    {isOrigin && scenario.beginTag ? scenario.beginTag : step.sub}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Ruta SVG amb codi SQLSTATE */}
                <svg
                    viewBox={`0 0 ${SVG_W} ${TOTAL_H}`}
                    style={{ height: TOTAL_H }}
                    className="w-full pointer-events-none overflow-visible"
                >
                    <defs>
                        {(Object.keys(TONE_HEX) as Tone[]).map((t) => (
                            <marker
                                key={t}
                                id={`exc-arrow-${t}`}
                                viewBox="0 0 10 10"
                                refX="7"
                                refY="5"
                                markerWidth="5"
                                markerHeight="5"
                                orient="auto"
                            >
                                <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill={TONE_HEX[t]} />
                            </marker>
                        ))}
                    </defs>

                    <path
                        d={`M 0,${y1} C 32,${y1} 32,${y2} 57,${y2}`}
                        fill="none"
                        stroke={color}
                        strokeWidth="2"
                        strokeDasharray={scenario.omitRaiseHandler ? "3 3" : undefined}
                        markerEnd={`url(#exc-arrow-${scenario.tone})`}
                        className="transition-all duration-200"
                    />

                    <g transform={`translate(32, ${(y1 + y2) / 2})`}>
                        <rect
                            x="-19"
                            y="-8"
                            width="38"
                            height="16"
                            rx="4"
                            fill="#020617"
                            stroke={color}
                            strokeWidth="1"
                        />
                        <text
                            textAnchor="middle"
                            dominantBaseline="middle"
                            y="1"
                            fill={color}
                            fontSize="9"
                            fontWeight="bold"
                        >
                            {scenario.badge}
                        </text>
                    </g>
                </svg>

                {/* Columna dreta: branques WHEN i sortida */}
                <div className="flex flex-col gap-2">
                    {EXCEPTION_BRANCHES.map((branch) => {
                        const isMatched = scenario.toBranchIdx === branch.idx;
                        const isOmitted = scenario.omitRaiseHandler && branch.idx === 0;
                        const isBypassed =
                            !isMatched &&
                            scenario.toBranchIdx < 3 &&
                            branch.idx < scenario.toBranchIdx;

                        let cardClass = "bg-slate-900/40 border-white/10 text-slate-400 hover:border-slate-600";
                        if (isOmitted) {
                            cardClass = "bg-slate-900/15 border-white/10 border-dashed text-slate-600 opacity-35";
                        } else if (isMatched) {
                            cardClass = TONE_CARD[scenario.tone];
                        } else if (isBypassed) {
                            cardClass = "bg-slate-900/20 border-white/5 text-slate-600 opacity-35";
                        } else if (scenario.toBranchIdx < 3 && branch.idx === 3) {
                            cardClass = "bg-slate-900/20 border-white/5 text-slate-600 opacity-25";
                        }

                        return (
                            <button
                                key={branch.idx}
                                type="button"
                                onClick={() => setScenarioId(branch.targetScenario)}
                                className={`h-9 px-2.5 rounded-lg border flex items-center justify-between gap-1.5 text-left transition-all duration-150 cursor-pointer ${cardClass}`}
                            >
                                <span
                                    className={`text-[11px] truncate ${
                                        isOmitted ? "line-through" : ""
                                    }`}
                                >
                                    {branch.label}
                                </span>
                                <span className="text-[9px] opacity-75 shrink-0">
                                    {isOmitted ? "omès" : branch.codeTag}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Missatge resultant en 1 línia */}
            <div className="mt-3 flex justify-center">
                <div
                    className={`px-3 py-1 rounded-lg border text-[11px] transition-colors ${TONE_PILL[scenario.tone]}`}
                >
                    {scenario.resultMessage}
                </div>
            </div>
        </div>
    );
}
