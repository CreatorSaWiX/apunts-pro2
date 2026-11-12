"use client";

import { useState } from "react";

type ScenarioId = "before_new" | "after_new" | "before_exists";
type Tone = "emerald" | "rose" | "sky";

interface StageSpec {
    idx: 0 | 1 | 2;
    label: string;
    tag: string;
    tone: Tone | "muted";
    note: string;
}

interface FlowEdge {
    fromStage: 0 | 1 | 2;
    toTable: 0 | 1;
    badge: string;
    tone: Tone;
    dashed?: boolean;
}

interface ScenarioConfig {
    id: ScenarioId;
    label: string;
    sql: string;
    activeClass: string;
    stages: [StageSpec, StageSpec, StageSpec];
    edges: FlowEdge[];
    usuariValues: string;
    usuariTone: Tone | "neutral";
    estudiantValues: string;
    estudiantTone: Tone;
    statusText: string;
    statusTone: Tone;
}

// Geometria exacta: esquerra 3x36px + 2x12px = 132px; dreta 2x46px + 16px + 2x12px = 132px
const ROW_H_LEFT = 36;
const GAP_LEFT = 12;
const TOTAL_H = 3 * ROW_H_LEFT + 2 * GAP_LEFT; // 132px
const ROW_H_RIGHT = 46;
const GAP_RIGHT = 16;
const OFFSET_RIGHT = (TOTAL_H - (2 * ROW_H_RIGHT + GAP_RIGHT)) / 2; // 12px
const SVG_W = 64;

const getYLeft = (idx: 0 | 1 | 2) => idx * (ROW_H_LEFT + GAP_LEFT) + ROW_H_LEFT / 2; // 18, 66, 114
const getYRight = (idx: 0 | 1) => OFFSET_RIGHT + idx * (ROW_H_RIGHT + GAP_RIGHT) + ROW_H_RIGHT / 2; // 35, 97

const SCENARIOS: ScenarioConfig[] = [
    {
        id: "before_new",
        label: "BEFORE · nou (7)",
        sql: "INSERT INTO estudiant VALUES (7);",
        activeClass: "bg-emerald-500/15 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)] font-semibold",
        stages: [
            {
                idx: 0,
                label: "1. Trigger BEFORE",
                tag: "+ usuari",
                tone: "emerald",
                note: "S'executa ABANS de la FK: detecta 7 ∉ usuari i insereix (7)",
            },
            {
                idx: 1,
                label: "2. Comprovació FK",
                tag: "✓ ok",
                tone: "sky",
                note: "La clau forana troba id_u = 7 a usuari → validació correcta",
            },
            {
                idx: 2,
                label: "3. Desa estudiant",
                tag: "✓",
                tone: "emerald",
                note: "S'insereix estudiant (7) sense errors d'integritat",
            },
        ],
        edges: [
            { fromStage: 0, toTable: 0, badge: "+7", tone: "emerald" },
            { fromStage: 1, toTable: 0, badge: "FK ✓", tone: "sky", dashed: true },
            { fromStage: 2, toTable: 1, badge: "+7", tone: "emerald" },
        ],
        usuariValues: "{1, 7 ✓}",
        usuariTone: "emerald",
        estudiantValues: "{1, 7 ✓}",
        estudiantTone: "emerald",
        statusText: "BEFORE prepara usuari(7) abans de la FK → inserció vàlida ✓",
        statusTone: "emerald",
    },
    {
        id: "after_new",
        label: "AFTER · nou (7)",
        sql: "INSERT INTO estudiant VALUES (7);",
        activeClass: "bg-rose-500/15 border-rose-400 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)] font-semibold",
        stages: [
            {
                idx: 0,
                label: "1. Comprovació FK",
                tag: "23503 ✕",
                tone: "rose",
                note: "L'SGBD comprova la FK abans de l'AFTER: 7 ∉ usuari → falla!",
            },
            {
                idx: 1,
                label: "2. Inserció estudiant",
                tag: "avortada",
                tone: "muted",
                note: "La sentència s'avorta per violació de clau forana",
            },
            {
                idx: 2,
                label: "3. Trigger AFTER",
                tag: "no corre",
                tone: "muted",
                note: "El trigger AFTER no s'arriba a executar mai",
            },
        ],
        edges: [
            { fromStage: 0, toTable: 0, badge: "7 ∉ ✕", tone: "rose", dashed: true },
            { fromStage: 1, toTable: 1, badge: "✕", tone: "rose", dashed: true },
        ],
        usuariValues: "{1}",
        usuariTone: "neutral",
        estudiantValues: "{1} · rebutjat",
        estudiantTone: "rose",
        statusText: "AFTER falla abans d'executar-se: 23503 foreign_key_violation ✕",
        statusTone: "rose",
    },
    {
        id: "before_exists",
        label: "BEFORE · existeix (1)",
        sql: "INSERT INTO estudiant VALUES (1);",
        activeClass: "bg-sky-500/15 border-sky-400 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.2)] font-semibold",
        stages: [
            {
                idx: 0,
                label: "1. Trigger BEFORE",
                tag: "EXISTS",
                tone: "sky",
                note: "Comprova que id_u = 1 ja existeix a usuari → no duplica l'INSERT",
            },
            {
                idx: 1,
                label: "2. Comprovació FK",
                tag: "✓ ok",
                tone: "sky",
                note: "Clau forana id_e = 1 → usuari(1) vàlida",
            },
            {
                idx: 2,
                label: "3. Desa estudiant",
                tag: "✓",
                tone: "emerald",
                note: "S'insereix estudiant (1) normalment",
            },
        ],
        edges: [
            { fromStage: 0, toTable: 0, badge: "∃ 1", tone: "sky", dashed: true },
            { fromStage: 1, toTable: 0, badge: "FK ✓", tone: "sky", dashed: true },
            { fromStage: 2, toTable: 1, badge: "+1", tone: "emerald" },
        ],
        usuariValues: "{1}",
        usuariTone: "sky",
        estudiantValues: "{1 ✓}",
        estudiantTone: "emerald",
        statusText: "NOT EXISTS evita inserir usuari duplicat quan ja existeix",
        statusTone: "sky",
    },
];

const TONE_HEX: Record<Tone, string> = {
    emerald: "#10b981",
    rose: "#f43f5e",
    sky: "#38bdf8",
};

const TONE_CARD: Record<Tone | "neutral" | "muted", string> = {
    emerald: "bg-emerald-500/15 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.2)]",
    rose: "bg-rose-500/15 border-rose-500 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.2)]",
    sky: "bg-sky-500/15 border-sky-400 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.2)]",
    neutral: "bg-slate-900/40 border-white/10 text-slate-300",
    muted: "bg-slate-900/20 border-white/5 text-slate-600 opacity-35",
};

const TONE_PILL: Record<Tone, string> = {
    emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    rose: "bg-rose-500/10 border-rose-500/30 text-rose-300",
    sky: "bg-sky-500/10 border-sky-500/30 text-sky-300",
};

export default function BeforeFkVisualizer() {
    const [scenarioId, setScenarioId] = useState<ScenarioId>("before_new");
    const [hoveredStage, setHoveredStage] = useState<0 | 1 | 2 | null>(null);

    const scenario = SCENARIOS.find((s) => s.id === scenarioId) || SCENARIOS[0];
    const activeStageSpec =
        hoveredStage !== null ? scenario.stages[hoveredStage] : null;

    const highlightedTables = new Set(
        hoveredStage === null
            ? []
            : scenario.edges
                  .filter((e) => e.fromStage === hoveredStage)
                  .map((e) => e.toTable)
    );

    return (
        <div className="w-full max-w-xl mx-auto my-6 not-prose select-none font-mono text-xs">
            {/* Selector BEFORE vs AFTER */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pb-3">
                {SCENARIOS.map((item) => {
                    const isSelected = item.id === scenarioId;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                                setScenarioId(item.id);
                                setHoveredStage(null);
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

            {/* Sentència SQL */}
            <div className="pb-4 flex justify-center">
                <div className="px-3 py-1.5 rounded-lg bg-slate-900/50 border border-white/10 text-[11px] text-slate-300 truncate max-w-full">
                    {scenario.sql}
                </div>
            </div>

            {/* Capçaleres */}
            <div
                className="grid items-center text-[10px] text-slate-500 font-semibold tracking-wider pb-2"
                style={{ gridTemplateColumns: "1.15fr 64px 1fr" }}
            >
                <span>ORDRE D&apos;EXECUCIÓ</span>
                <span />
                <span className="text-right">TAULES (FK id_e → id_u)</span>
            </div>

            {/* Cos principal: Ordre d'execució -> Corbes SVG -> Taules usuari / estudiant */}
            <div
                className="relative grid items-start"
                style={{ gridTemplateColumns: "1.15fr 64px 1fr" }}
            >
                <div className="flex flex-col gap-3">
                    {scenario.stages.map((stage) => {
                        const isHovered = hoveredStage === stage.idx;
                        const isDimmed = hoveredStage !== null && !isHovered;

                        return (
                            <button
                                key={`${scenarioId}-st-${stage.idx}`}
                                type="button"
                                onMouseEnter={() => setHoveredStage(stage.idx)}
                                onMouseLeave={() => setHoveredStage(null)}
                                onClick={() =>
                                    setHoveredStage((curr) => (curr === stage.idx ? null : stage.idx))
                                }
                                className={`h-9 px-2.5 rounded-lg border flex items-center justify-between gap-1.5 text-left transition-all duration-150 cursor-pointer ${
                                    isDimmed
                                        ? "bg-slate-900/20 border-white/5 text-slate-600 opacity-30"
                                        : TONE_CARD[stage.tone]
                                }`}
                            >
                                <span className="text-[11px] truncate">{stage.label}</span>
                                <span className="text-[9px] font-bold opacity-80 shrink-0">
                                    {stage.tag}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <svg
                    viewBox={`0 0 ${SVG_W} ${TOTAL_H}`}
                    style={{ height: TOTAL_H }}
                    className="w-full pointer-events-none overflow-visible"
                >
                    <defs>
                        {(Object.keys(TONE_HEX) as Tone[]).map((t) => (
                            <marker
                                key={t}
                                id={`bfk-arrow-${t}`}
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

                    {scenario.edges.map((edge, i) => {
                        const y1 = getYLeft(edge.fromStage);
                        const y2 = getYRight(edge.toTable);
                        const isHovered = hoveredStage === edge.fromStage;
                        const isDimmed = hoveredStage !== null && !isHovered;
                        const color = isDimmed ? "#334155" : TONE_HEX[edge.tone];
                        const opacity = isDimmed ? 0.18 : isHovered ? 1 : 0.85;

                        return (
                            <g
                                key={`${scenarioId}-edge-${i}`}
                                opacity={opacity}
                                className="transition-opacity duration-150"
                            >
                                <path
                                    d={`M 0,${y1} C 32,${y1} 32,${y2} 57,${y2}`}
                                    fill="none"
                                    stroke={color}
                                    strokeWidth={isHovered ? 2.3 : 1.75}
                                    strokeDasharray={edge.dashed ? "3 3" : undefined}
                                    markerEnd={
                                        isDimmed ? undefined : `url(#bfk-arrow-${edge.tone})`
                                    }
                                />
                                <g transform={`translate(32, ${(y1 + y2) / 2})`}>
                                    <rect
                                        x="-16"
                                        y="-8"
                                        width="32"
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
                                        fontSize="8.5"
                                        fontWeight="bold"
                                    >
                                        {edge.badge}
                                    </text>
                                </g>
                            </g>
                        );
                    })}
                </svg>

                <div
                    className="flex flex-col gap-4"
                    style={{ paddingTop: `${OFFSET_RIGHT}px`, paddingBottom: `${OFFSET_RIGHT}px` }}
                >
                    {(
                        [
                            {
                                idx: 0 as const,
                                name: "usuari",
                                role: "PK",
                                values: scenario.usuariValues,
                                tone: scenario.usuariTone,
                            },
                            {
                                idx: 1 as const,
                                name: "estudiant",
                                role: "FK",
                                values: scenario.estudiantValues,
                                tone: scenario.estudiantTone,
                            },
                        ] as const
                    ).map((tbl) => {
                        const isDimmed =
                            hoveredStage !== null && !highlightedTables.has(tbl.idx);
                        return (
                            <div
                                key={tbl.name}
                                className={`h-[46px] px-2.5 rounded-lg border flex flex-col justify-center gap-0.5 transition-all duration-150 ${
                                    isDimmed
                                        ? "bg-slate-900/20 border-white/5 text-slate-600 opacity-30"
                                        : TONE_CARD[tbl.tone]
                                }`}
                            >
                                <div className="flex items-center justify-between text-[10px]">
                                    <span className="font-bold">{tbl.name}</span>
                                    <span className="opacity-65">{tbl.role}</span>
                                </div>
                                <span className="text-[11px] font-semibold tabular-nums truncate">
                                    {tbl.values}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Resum en 1 línia */}
            <div className="mt-3 flex justify-center">
                <div
                    className={`px-3 py-1 rounded-lg border text-[11px] transition-colors ${
                        activeStageSpec && activeStageSpec.tone !== "muted"
                            ? TONE_PILL[activeStageSpec.tone]
                            : TONE_PILL[scenario.statusTone]
                    }`}
                >
                    {activeStageSpec ? activeStageSpec.note : scenario.statusText}
                </div>
            </div>
        </div>
    );
}
