"use client";

import { useState } from "react";

type ScenarioId = "serializable" | "cycle" | "no_conflict";
type TxId = "T1" | "T2" | "T3";
type Tone = "sky" | "amber" | "emerald" | "rose";

interface ScheduleSlot {
    t: number;
    tx: TxId;
    op: string;
    conflictId?: string;
}

interface ConflictEdge {
    id: string;
    from: TxId;
    to: TxId;
    granule: string;
    rule: string;
    path: string;
    badgePos: { x: number; y: number };
    tone: Tone;
}

interface GraphNode {
    id: TxId;
    label: string;
    x: number;
    y: number;
}

interface ScenarioConfig {
    id: ScenarioId;
    label: string;
    activeClass: string;
    txs: TxId[];
    slots: ScheduleSlot[];
    nodes: GraphNode[];
    edges: ConflictEdge[];
    serialOrders: string[];
    isCyclic: boolean;
    statusText: string;
    statusTone: Tone;
}

const TX_SUB: Record<TxId, string> = {
    T1: "T₁",
    T2: "T₂",
    T3: "T₃",
};

const NODE_RADIUS = 20;

const SCENARIOS: ScenarioConfig[] = [
    {
        id: "serializable",
        label: "ACÍCLIC · SERIALITZABLE",
        activeClass: "bg-emerald-500/15 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)] font-semibold",
        txs: ["T1", "T2", "T3"],
        slots: [
            { t: 1, tx: "T2", op: "RU(A)" },
            { t: 2, tx: "T2", op: "W(A)", conflictId: "c1" },
            { t: 3, tx: "T1", op: "R(A)", conflictId: "c1" },
            { t: 4, tx: "T2", op: "RU(B)" },
            { t: 5, tx: "T2", op: "W(B)", conflictId: "c2" },
            { t: 6, tx: "T3", op: "R(B)", conflictId: "c2" },
        ],
        nodes: [
            { id: "T2", label: "T₂", x: 110, y: 38 },
            { id: "T1", label: "T₁", x: 48, y: 142 },
            { id: "T3", label: "T₃", x: 172, y: 142 },
        ],
        edges: [
            {
                id: "c1",
                from: "T2",
                to: "T1",
                granule: "A",
                rule: "W(A) abans de R(A) → T₂ ≺ T₁",
                path: "M 98.2,57.8 L 60.3,121.4",
                badgePos: { x: 79, y: 90 },
                tone: "sky",
            },
            {
                id: "c2",
                from: "T2",
                to: "T3",
                granule: "B",
                rule: "W(B) abans de R(B) → T₂ ≺ T₃",
                path: "M 121.8,57.8 L 159.7,121.4",
                badgePos: { x: 141, y: 90 },
                tone: "emerald",
            },
        ],
        serialOrders: ["T₂ ; T₁ ; T₃", "T₂ ; T₃ ; T₁"],
        isCyclic: false,
        statusText: "Sense cicles → 2 ordres topològics equivalents",
        statusTone: "emerald",
    },
    {
        id: "cycle",
        label: "CICLE · NO SERIALITZABLE",
        activeClass: "bg-rose-500/15 border-rose-400 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)] font-semibold",
        txs: ["T1", "T2"],
        slots: [
            { t: 1, tx: "T1", op: "R(A)", conflictId: "c1" },
            { t: 2, tx: "T2", op: "RU(A)" },
            { t: 3, tx: "T2", op: "W(A)", conflictId: "c1" },
            { t: 4, tx: "T2", op: "R(B)", conflictId: "c2" },
            { t: 5, tx: "T1", op: "RU(B)" },
            { t: 6, tx: "T1", op: "W(B)", conflictId: "c2" },
        ],
        nodes: [
            { id: "T1", label: "T₁", x: 48, y: 90 },
            { id: "T2", label: "T₂", x: 172, y: 90 },
        ],
        edges: [
            {
                id: "c1",
                from: "T1",
                to: "T2",
                granule: "A",
                rule: "R(A) abans de W(A) → T₁ ≺ T₂",
                path: "M 65,75 Q 110,25 155,75",
                badgePos: { x: 110, y: 50 },
                tone: "rose",
            },
            {
                id: "c2",
                from: "T2",
                to: "T1",
                granule: "B",
                rule: "R(B) abans de W(B) → T₂ ≺ T₁",
                path: "M 155,105 Q 110,155 65,105",
                badgePos: { x: 110, y: 130 },
                tone: "amber",
            },
        ],
        serialOrders: [],
        isCyclic: true,
        statusText: "Cicle T₁ ⇄ T₂ → horari no serialitzable",
        statusTone: "rose",
    },
    {
        id: "no_conflict",
        label: "R i RU · SENSE CONFLICTE",
        activeClass: "bg-sky-500/15 border-sky-400 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.2)] font-semibold",
        txs: ["T1", "T2"],
        slots: [
            { t: 1, tx: "T1", op: "R(A)" },
            { t: 2, tx: "T2", op: "RU(A)" },
            { t: 3, tx: "T2", op: "R(A)" },
            { t: 4, tx: "T1", op: "R(A)" },
        ],
        nodes: [
            { id: "T1", label: "T₁", x: 48, y: 90 },
            { id: "T2", label: "T₂", x: 172, y: 90 },
        ],
        edges: [],
        serialOrders: ["T₁ ; T₂", "T₂ ; T₁"],
        isCyclic: false,
        statusText: "Cap escriptura (W) → 0 arestes · commutables",
        statusTone: "sky",
    },
];

const TONE_HEX: Record<Tone, string> = {
    sky: "#38bdf8",
    amber: "#f59e0b",
    emerald: "#10b981",
    rose: "#f43f5e",
};

const TONE_CELL_ACTIVE: Record<Tone, string> = {
    sky: "bg-sky-500/20 border-sky-400 text-sky-200 shadow-[0_0_10px_rgba(56,189,248,0.25)] font-bold",
    amber: "bg-amber-500/20 border-amber-400 text-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.25)] font-bold",
    emerald: "bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.25)] font-bold",
    rose: "bg-rose-500/20 border-rose-400 text-rose-200 shadow-[0_0_10px_rgba(244,63,94,0.25)] font-bold",
};

const TONE_CELL_IDLE: Record<Tone, string> = {
    sky: "bg-sky-500/10 border-sky-500/35 text-sky-300 hover:border-sky-400",
    amber: "bg-amber-500/10 border-amber-500/35 text-amber-300 hover:border-amber-400",
    emerald: "bg-emerald-500/10 border-emerald-500/35 text-emerald-300 hover:border-emerald-400",
    rose: "bg-rose-500/10 border-rose-500/35 text-rose-300 hover:border-rose-400",
};

const TONE_PILL: Record<Tone, string> = {
    sky: "bg-sky-500/10 border-sky-500/30 text-sky-300",
    amber: "bg-amber-500/10 border-amber-500/30 text-amber-300",
    emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    rose: "bg-rose-500/10 border-rose-500/30 text-rose-300",
};

export default function PrecedenceVisualizer() {
    const [scenarioId, setScenarioId] = useState<ScenarioId>("serializable");
    const [activeConflictId, setActiveConflictId] = useState<string | null>(null);

    const scenario = SCENARIOS.find((s) => s.id === scenarioId) || SCENARIOS[0];
    const activeEdge = scenario.edges.find((e) => e.id === activeConflictId) || null;

    const gridCols =
        scenario.txs.length === 3
            ? "20px repeat(3, minmax(0, 1fr))"
            : "20px repeat(2, minmax(0, 1fr))";

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
                                setActiveConflictId(null);
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

            {/* Cos principal: Horari (esquerra) + Graf de precedències SVG (dreta) */}
            <div className="grid grid-cols-1 sm:grid-cols-[1.15fr_1fr] gap-5 items-center">
                {/* 1. Horari concurrent */}
                <div className="flex flex-col">
                    <div
                        className="grid items-center gap-1.5 text-[10px] text-slate-500 font-semibold tracking-wider pb-2 text-center"
                        style={{ gridTemplateColumns: gridCols }}
                    >
                        <span>#</span>
                        {scenario.txs.map((tx) => (
                            <span key={tx} className="text-slate-300">
                                {TX_SUB[tx]}
                            </span>
                        ))}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        {scenario.slots.map((slot) => (
                            <div
                                key={`${scenarioId}-t-${slot.t}`}
                                className="grid items-center gap-1.5 h-8"
                                style={{ gridTemplateColumns: gridCols }}
                            >
                                <span className="text-[10px] text-slate-600 text-center tabular-nums">
                                    {slot.t}
                                </span>

                                {scenario.txs.map((tx) => {
                                    if (slot.tx !== tx) {
                                        return (
                                            <div key={tx} className="h-8 flex items-center justify-center">
                                                <span className="h-full border-l border-white/5" />
                                            </div>
                                        );
                                    }

                                    const edge = slot.conflictId
                                        ? scenario.edges.find((e) => e.id === slot.conflictId)
                                        : undefined;
                                    const isHighlighted =
                                        activeConflictId !== null && slot.conflictId === activeConflictId;
                                    const isDimmed =
                                        activeConflictId !== null && slot.conflictId !== activeConflictId;

                                    let cellClass =
                                        "bg-slate-900/40 border-white/10 text-slate-400";
                                    if (isDimmed) {
                                        cellClass = "bg-slate-900/20 border-white/5 text-slate-600 opacity-30";
                                    } else if (edge) {
                                        cellClass = isHighlighted
                                            ? TONE_CELL_ACTIVE[edge.tone]
                                            : TONE_CELL_IDLE[edge.tone];
                                    }

                                    return (
                                        <button
                                            key={tx}
                                            type="button"
                                            disabled={!edge}
                                            onMouseEnter={
                                                edge ? () => setActiveConflictId(edge.id) : undefined
                                            }
                                            onMouseLeave={
                                                edge ? () => setActiveConflictId(null) : undefined
                                            }
                                            onClick={
                                                edge
                                                    ? () =>
                                                          setActiveConflictId((curr) =>
                                                              curr === edge.id ? null : edge.id
                                                          )
                                                    : undefined
                                            }
                                            className={`h-8 px-2 rounded-lg border text-[11px] flex items-center justify-center transition-all duration-150 ${
                                                edge ? "cursor-pointer" : "cursor-default"
                                            } ${cellClass}`}
                                        >
                                            <span>{slot.op}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Graf de precedències SVG */}
                <div className="flex flex-col items-center">
                    <div className="w-full flex items-center justify-between text-[10px] text-slate-500 font-semibold tracking-wider pb-1 px-1">
                        <span>GRAF DE PRECEDÈNCIES</span>
                        <span className={scenario.isCyclic ? "text-rose-400" : "text-emerald-400/90"}>
                            {scenario.isCyclic ? "Cicle ✕" : "Acíclic ✓"}
                        </span>
                    </div>

                    <svg
                        viewBox="0 0 220 180"
                        className="w-full max-w-[260px] h-auto overflow-visible"
                    >
                        <defs>
                            {(Object.keys(TONE_HEX) as Tone[]).map((tone) => (
                                <marker
                                    key={tone}
                                    id={`prec-arrow-${tone}`}
                                    viewBox="0 0 10 10"
                                    refX="7"
                                    refY="5"
                                    markerWidth="5.5"
                                    markerHeight="5.5"
                                    orient="auto"
                                >
                                    <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill={TONE_HEX[tone]} />
                                </marker>
                            ))}
                            <marker
                                id="prec-arrow-dim"
                                viewBox="0 0 10 10"
                                refX="7"
                                refY="5"
                                markerWidth="5"
                                markerHeight="5"
                                orient="auto"
                            >
                                <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#334155" />
                            </marker>
                        </defs>

                        {/* Sense arestes (cas R / RU sense W) */}
                        {scenario.edges.length === 0 && (
                            <g>
                                <line
                                    x1="74"
                                    y1="90"
                                    x2="146"
                                    y2="90"
                                    stroke="#334155"
                                    strokeWidth="1.25"
                                    strokeDasharray="3 4"
                                    opacity="0.55"
                                />
                                <rect
                                    x="97"
                                    y="80"
                                    width="26"
                                    height="20"
                                    rx="5"
                                    fill="#020617"
                                    stroke="#334155"
                                    strokeWidth="1"
                                />
                                <text
                                    x="110"
                                    y="91"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill="#64748b"
                                    fontSize="11"
                                    fontWeight="bold"
                                >
                                    ∅
                                </text>
                            </g>
                        )}

                        {/* Arestes de conflicte */}
                        {scenario.edges.map((edge) => {
                            const isActive = activeConflictId === edge.id;
                            const isDimmed = activeConflictId !== null && !isActive;
                            const color = isDimmed ? "#334155" : TONE_HEX[edge.tone];

                            return (
                                <g
                                    key={`${scenarioId}-${edge.id}`}
                                    className="cursor-pointer"
                                    onMouseEnter={() => setActiveConflictId(edge.id)}
                                    onMouseLeave={() => setActiveConflictId(null)}
                                    onClick={() =>
                                        setActiveConflictId((curr) =>
                                            curr === edge.id ? null : edge.id
                                        )
                                    }
                                >
                                    {/* Àrea invisible ampla per facilitar hover/clic */}
                                    <path
                                        d={edge.path}
                                        fill="none"
                                        stroke="transparent"
                                        strokeWidth="14"
                                    />
                                    <path
                                        d={edge.path}
                                        fill="none"
                                        stroke={color}
                                        strokeWidth={isActive ? 2.6 : 1.8}
                                        strokeOpacity={isDimmed ? 0.25 : 0.95}
                                        markerEnd={
                                            isDimmed
                                                ? "url(#prec-arrow-dim)"
                                                : `url(#prec-arrow-${edge.tone})`
                                        }
                                        className="transition-all duration-150"
                                    />
                                    <g transform={`translate(${edge.badgePos.x}, ${edge.badgePos.y})`}>
                                        <rect
                                            x="-10"
                                            y="-9"
                                            width="20"
                                            height="18"
                                            rx="5"
                                            fill="#020617"
                                            stroke={color}
                                            strokeWidth={isActive ? 1.5 : 1}
                                            opacity={isDimmed ? 0.35 : 1}
                                        />
                                        <text
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            y="1"
                                            fill={color}
                                            fontSize="10"
                                            fontWeight="bold"
                                            opacity={isDimmed ? 0.35 : 1}
                                        >
                                            {edge.granule}
                                        </text>
                                    </g>
                                </g>
                            );
                        })}

                        {/* Nodes (Transaccions) */}
                        {scenario.nodes.map((node) => {
                            const isInvolved = activeEdge
                                ? activeEdge.from === node.id || activeEdge.to === node.id
                                : false;
                            const isDimmed = activeEdge !== null && !isInvolved;
                            const ringColor = isInvolved && activeEdge
                                ? TONE_HEX[activeEdge.tone]
                                : scenario.isCyclic
                                ? "#f43f5e"
                                : "#475569";

                            return (
                                <g
                                    key={`${scenarioId}-${node.id}`}
                                    transform={`translate(${node.x}, ${node.y})`}
                                    opacity={isDimmed ? 0.35 : 1}
                                    className="transition-opacity duration-150"
                                >
                                    <circle
                                        r={NODE_RADIUS}
                                        fill="#0b1120"
                                        stroke={ringColor}
                                        strokeWidth={isInvolved ? 2.2 : 1.5}
                                    />
                                    <text
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        y="1"
                                        fill="#f1f5f9"
                                        fontSize="12"
                                        fontWeight="bold"
                                    >
                                        {node.label}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </div>
            </div>

            {/* Ordres serials equivalents + estat en 1 línia */}
            <div className="mt-3 flex flex-col items-center gap-2">
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                    {scenario.serialOrders.length > 0 ? (
                        scenario.serialOrders.map((order) => (
                            <span
                                key={order}
                                className="px-2.5 py-0.5 rounded-md border bg-slate-900/50 border-white/10 text-slate-200 text-[11px]"
                            >
                                {order}
                            </span>
                        ))
                    ) : (
                        <span className="px-2.5 py-0.5 rounded-md border bg-rose-500/10 border-rose-500/30 text-rose-300 text-[11px]">
                            Cap ordre serial equivalent
                        </span>
                    )}
                </div>

                <div
                    className={`px-3 py-1 rounded-lg border text-[11px] transition-colors ${
                        activeEdge
                            ? TONE_PILL[activeEdge.tone]
                            : TONE_PILL[scenario.statusTone]
                    }`}
                >
                    {activeEdge ? activeEdge.rule : scenario.statusText}
                </div>
            </div>
        </div>
    );
}
