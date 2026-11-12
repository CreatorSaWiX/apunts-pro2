"use client";

import { useState } from "react";

type StrategyId = "only_ciutat" | "rid_intersect" | "only_id" | "seq";
type Tone = "normal" | "sky" | "amber" | "emerald" | "rose";

interface CostCard {
    label: string;
    detail: string;
    tone: Tone;
}

interface CostEdge {
    toCard: 0 | 1 | 2;
    tone: Exclude<Tone, "normal">;
    dashed?: boolean;
    badge?: string;
}

interface StrategySpec {
    id: StrategyId;
    label: string;
    total: string;
    barPct: number;
    tone: Exclude<Tone, "normal">;
    cards: [CostCard, CostCard, CostCard];
    edges: CostEdge[];
    note: string;
}

// Geometria exacta: esquerra 4*36 + 3*8 = 168px; dreta 18 + 3*36 + 2*12 + 18 = 168px
const ROW_H = 36;
const GAP_LEFT = 8;
const OFFSET_RIGHT = 18;
const GAP_RIGHT = 12;

const getYLeft = (idx: number) => idx * (ROW_H + GAP_LEFT) + ROW_H / 2;
const getYRight = (idx: number) => OFFSET_RIGHT + idx * (ROW_H + GAP_RIGHT) + ROW_H / 2;

const TONE_HEX: Record<Exclude<Tone, "normal">, string> = {
    sky: "#38bdf8",
    amber: "#f59e0b",
    emerald: "#10b981",
    rose: "#f43f5e",
};

const TONE_CARD_CLASS: Record<Tone, string> = {
    normal: "bg-slate-900/20 border-white/5 text-slate-600 opacity-40",
    sky: "bg-sky-500/15 border-sky-400/70 text-sky-200 shadow-[0_0_10px_rgba(56,189,248,0.18)]",
    amber: "bg-amber-500/10 border-amber-400/60 text-amber-200",
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

const STRATEGIES: StrategySpec[] = [
    {
        id: "only_ciutat",
        label: "Només ciutat",
        total: "1.015 ✓",
        barPct: 6,
        tone: "emerald",
        cards: [
            { label: "Índex id", detail: "0 (no usat)", tone: "normal" },
            { label: "Índex ciutat", detail: "3 + 12 = 15", tone: "sky" },
            { label: "Dades R", detail: "1.000 (no agr.)", tone: "emerald" },
        ],
        edges: [
            { toCard: 1, tone: "sky", badge: "15" },
            { toCard: 2, tone: "emerald", badge: "1k" },
        ],
        note: "Guanyadora (1.015 E/S) · evita pagar les 999 fulles addicionals d'id",
    },
    {
        id: "rid_intersect",
        label: "Intersecció RIDs",
        total: "1.217",
        barPct: 8,
        tone: "amber",
        cards: [
            { label: "Índex id", detail: "3 + 999 = 1.002", tone: "rose" },
            { label: "Índex ciutat", detail: "3 + 12 = 15", tone: "sky" },
            { label: "Dades R", detail: "200 (M∩)", tone: "emerald" },
        ],
        edges: [
            { toCard: 0, tone: "rose", badge: "+1k" },
            { toCard: 1, tone: "sky" },
            { toCard: 2, tone: "emerald", badge: "200" },
        ],
        note: "Estalvia 800 pàgs. de dades, però perd 1.002 escanejant fulles d'id (+202 net)",
    },
    {
        id: "only_id",
        label: "Només id (agr.)",
        total: "17.002",
        barPct: 85,
        tone: "rose",
        cards: [
            { label: "Índex id", detail: "3 + 999 = 1.002", tone: "amber" },
            { label: "Índex ciutat", detail: "0 (no usat)", tone: "normal" },
            { label: "Dades R", detail: "⌈80k/5⌉ = 16.000", tone: "rose" },
        ],
        edges: [
            { toCard: 0, tone: "amber" },
            { toCard: 2, tone: "rose", badge: "16k" },
        ],
        note: "Encara que id sigui agrupat, id > 20000 selecciona el 80% de la taula",
    },
    {
        id: "seq",
        label: "Seqüencial",
        total: "20.000",
        barPct: 100,
        tone: "rose",
        cards: [
            { label: "Índex id", detail: "0", tone: "normal" },
            { label: "Índex ciutat", detail: "0", tone: "normal" },
            { label: "Dades R", detail: "⌈100k/5⌉ = 20.000", tone: "rose" },
        ],
        edges: [{ toCard: 2, tone: "rose", badge: "20k" }],
        note: "Sense cap índex, recorre totes les 20.000 pàgines de dades de R",
    },
];

export default function IndexStrategyVisualizer() {
    const [activeIdx, setActiveIdx] = useState<number>(0);

    const current = STRATEGIES[activeIdx];

    return (
        <div className="w-full max-w-xl mx-auto my-6 not-prose select-none font-mono text-xs">
            {/* Capçaleres */}
            <div
                className="grid items-center text-[10px] text-slate-500 font-semibold tracking-wider pb-2"
                style={{ gridTemplateColumns: "1.15fr 56px 1fr" }}
            >
                <div className="flex items-center justify-between">
                    <span>ESTRATÈGIA</span>
                    <span className="text-slate-600">E/S</span>
                </div>
                <span />
                <div className="flex items-center justify-between">
                    <span>DESGLOSSAMENT</span>
                    <span className="text-slate-600">h=3, k=80</span>
                </div>
            </div>

            {/* Cos principal: 4 estratègies <-> SVG <-> 3 blocs de cost */}
            <div
                className="relative grid items-center"
                style={{ gridTemplateColumns: "1.15fr 56px 1fr" }}
            >
                {/* Columna esquerra: estratègies comparades */}
                <div className="flex flex-col gap-2">
                    {STRATEGIES.map((st, idx) => {
                        const isActive = activeIdx === idx;
                        return (
                            <button
                                key={st.id}
                                type="button"
                                onMouseEnter={() => setActiveIdx(idx)}
                                onClick={() => setActiveIdx(idx)}
                                className={`relative h-9 px-2.5 rounded-lg border text-left transition-all duration-150 cursor-pointer flex items-center justify-between gap-1.5 overflow-hidden ${
                                    isActive
                                        ? TONE_ACTIVE_BTN[st.tone]
                                        : "bg-slate-900/35 border-white/10 text-slate-400 hover:text-slate-200 hover:border-slate-600"
                                }`}
                            >
                                <span className="truncate text-[10.5px] sm:text-[11px]">{st.label}</span>
                                <span className="text-[10.5px] font-bold tabular-nums shrink-0">{st.total}</span>

                                {/* Barra proporcional subtil inferior */}
                                <span
                                    className="absolute left-0 bottom-0 h-[2px] transition-all duration-300"
                                    style={{
                                        width: `${st.barPct}%`,
                                        backgroundColor: TONE_HEX[st.tone],
                                        opacity: isActive ? 0.9 : 0.35,
                                    }}
                                />
                            </button>
                        );
                    })}
                </div>

                {/* Connexions SVG alineades al píxel */}
                <svg
                    viewBox="0 0 56 168"
                    className="w-full h-[168px] pointer-events-none overflow-visible"
                >
                    <defs>
                        {(Object.keys(TONE_HEX) as Exclude<Tone, "normal">[]).map((tone) => (
                            <marker
                                key={tone}
                                id={`strat-arrow-${tone}`}
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
                        const y1 = getYLeft(activeIdx);
                        const y2 = getYRight(edge.toCard);
                        const color = TONE_HEX[edge.tone];
                        return (
                            <g key={`${current.id}-e-${i}`}>
                                <path
                                    d={`M 0,${y1} C 28,${y1} 28,${y2} 53,${y2}`}
                                    fill="none"
                                    stroke={color}
                                    strokeWidth={edge.dashed ? 1.5 : 1.9}
                                    strokeDasharray={edge.dashed ? "3 3" : undefined}
                                    markerEnd={`url(#strat-arrow-${edge.tone})`}
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

                {/* Columna dreta: desglossament del cost */}
                <div
                    className="flex flex-col gap-3"
                    style={{ paddingTop: `${OFFSET_RIGHT}px`, paddingBottom: `${OFFSET_RIGHT}px` }}
                >
                    {current.cards.map((card) => (
                        <div
                            key={card.label}
                            className={`h-9 px-2.5 rounded-lg border flex items-center justify-between gap-1.5 transition-all duration-200 ${TONE_CARD_CLASS[card.tone]}`}
                        >
                            <span className="text-[9.5px] opacity-75 truncate">{card.label}</span>
                            <span className="text-[10.5px] font-bold tabular-nums shrink-0">{card.detail}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Nota compacta */}
            <div className="mt-4 flex justify-center">
                <div className={`px-3 py-1 rounded-lg border text-[11px] text-center transition-colors ${TONE_PILL[current.tone]}`}>
                    {current.note}
                </div>
            </div>
        </div>
    );
}
