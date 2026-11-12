"use client";

import { useState } from "react";

type EventId = "insert" | "delete" | "update_move" | "noop";
type Tone = "emerald" | "rose" | "sky" | "amber";

interface DeltaEdge {
    deptIdx: 0 | 1;
    badge: "+1" | "-1";
    tone: Tone;
}

interface EventConfig {
    id: EventId;
    label: string;
    sql: string;
    branchIdx: 0 | 1 | 2 | 3;
    tone: Tone;
    activeClass: string;
    dpt1Count: string;
    dpt2Count: string;
    dpt1Tone: Tone | "neutral";
    dpt2Tone: Tone | "neutral";
    edges: DeltaEdge[];
    statusText: string;
}

// Geometria exacta: esquerra 4x36px + 3x8px = 168px; dreta 2x44px + 20px + 2x30px = 168px
const ROW_H_LEFT = 36;
const GAP_LEFT = 8;
const TOTAL_H = 4 * ROW_H_LEFT + 3 * GAP_LEFT; // 168px
const ROW_H_RIGHT = 44;
const GAP_RIGHT = 20;
const OFFSET_RIGHT = (TOTAL_H - (2 * ROW_H_RIGHT + GAP_RIGHT)) / 2; // 30px
const SVG_W = 64;

const getYLeft = (idx: 0 | 1 | 2 | 3) => idx * (ROW_H_LEFT + GAP_LEFT) + ROW_H_LEFT / 2; // 18, 62, 106, 150
const getYRight = (idx: 0 | 1) => OFFSET_RIGHT + idx * (ROW_H_RIGHT + GAP_RIGHT) + ROW_H_RIGHT / 2; // 52, 116

const BRANCHES: { idx: 0 | 1 | 2 | 3; label: string; eventId: EventId }[] = [
    { idx: 0, label: "IF TG_OP = 'INSERT'", eventId: "insert" },
    { idx: 1, label: "ELSIF TG_OP = 'DELETE'", eventId: "delete" },
    { idx: 2, label: "ELSIF UPDATE ∧ OLD ≠ NEW", eventId: "update_move" },
    { idx: 3, label: "(sense canvi de num_dpt)", eventId: "noop" },
];

const EVENTS: EventConfig[] = [
    {
        id: "insert",
        label: "INSERT (dpt 1)",
        sql: "INSERT INTO empleats VALUES (9, 'PAU', 1);",
        branchIdx: 0,
        tone: "emerald",
        activeClass: "bg-emerald-500/15 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)] font-semibold",
        dpt1Count: "2 → 3",
        dpt2Count: "1",
        dpt1Tone: "emerald",
        dpt2Tone: "neutral",
        edges: [{ deptIdx: 0, badge: "+1", tone: "emerald" }],
        statusText: "TG_OP = 'INSERT' · incrementa només departament NEW.num_dpt (1)",
    },
    {
        id: "delete",
        label: "DELETE (dpt 1)",
        sql: "DELETE FROM empleats WHERE num_empl = 1;",
        branchIdx: 1,
        tone: "rose",
        activeClass: "bg-rose-500/15 border-rose-400 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)] font-semibold",
        dpt1Count: "2 → 1",
        dpt2Count: "1",
        dpt1Tone: "rose",
        dpt2Tone: "neutral",
        edges: [{ deptIdx: 0, badge: "-1", tone: "rose" }],
        statusText: "TG_OP = 'DELETE' · decrementa només departament OLD.num_dpt (1)",
    },
    {
        id: "update_move",
        label: "UPDATE dpt (1→2)",
        sql: "UPDATE empleats SET num_dpt = 2 WHERE num_empl = 1;",
        branchIdx: 2,
        tone: "sky",
        activeClass: "bg-sky-500/15 border-sky-400 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.2)] font-semibold",
        dpt1Count: "2 → 1",
        dpt2Count: "1 → 2",
        dpt1Tone: "rose",
        dpt2Tone: "emerald",
        edges: [
            { deptIdx: 0, badge: "-1", tone: "rose" },
            { deptIdx: 1, badge: "+1", tone: "emerald" },
        ],
        statusText: "Canvi de dpt (1 → 2): -1 a OLD.num_dpt i +1 a NEW.num_dpt (incremental)",
    },
    {
        id: "noop",
        label: "UPDATE sou / =",
        sql: "UPDATE empleats SET sou = 300 WHERE num_empl = 1;",
        branchIdx: 3,
        tone: "amber",
        activeClass: "bg-amber-500/15 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)] font-semibold",
        dpt1Count: "2",
        dpt2Count: "1",
        dpt1Tone: "neutral",
        dpt2Tone: "neutral",
        edges: [],
        statusText: "UPDATE OF num_dpt i OLD <> NEW eviten activacions innecessàries",
    },
];

const TONE_HEX: Record<Tone, string> = {
    emerald: "#10b981",
    rose: "#f43f5e",
    sky: "#38bdf8",
    amber: "#f59e0b",
};

const TONE_CARD: Record<Tone | "neutral", string> = {
    emerald: "bg-emerald-500/15 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.2)]",
    rose: "bg-rose-500/15 border-rose-500 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.2)]",
    sky: "bg-sky-500/15 border-sky-400 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.2)]",
    amber: "bg-amber-500/15 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.2)]",
    neutral: "bg-slate-900/40 border-white/10 text-slate-400",
};

const TONE_PILL: Record<Tone, string> = {
    emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    rose: "bg-rose-500/10 border-rose-500/30 text-rose-300",
    sky: "bg-sky-500/10 border-sky-500/30 text-sky-300",
    amber: "bg-amber-500/10 border-amber-500/30 text-amber-300",
};

export default function IncrementalTriggerVisualizer() {
    const [eventId, setEventId] = useState<EventId>("update_move");

    const ev = EVENTS.find((e) => e.id === eventId) || EVENTS[0];
    const y1 = getYLeft(ev.branchIdx);

    return (
        <div className="w-full max-w-xl mx-auto my-6 not-prose select-none font-mono text-xs">
            {/* Selector d'operació sobre empleats */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pb-3">
                {EVENTS.map((item) => {
                    const isSelected = item.id === eventId;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setEventId(item.id)}
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

            {/* Sentència SQL disparadora */}
            <div className="pb-4 flex justify-center">
                <div className="px-3 py-1.5 rounded-lg bg-slate-900/50 border border-white/10 text-[11px] text-slate-300 truncate max-w-full">
                    {ev.sql}
                </div>
            </div>

            {/* Capçaleres */}
            <div
                className="grid items-center text-[10px] text-slate-500 font-semibold tracking-wider pb-2"
                style={{ gridTemplateColumns: "1.2fr 64px 1fr" }}
            >
                <span>TRIGGER (AFTER ROW)</span>
                <span />
                <span className="text-right">departaments</span>
            </div>

            {/* Cos principal: branques TG_OP -> SVG -> comptadors incrementals */}
            <div
                className="relative grid items-start"
                style={{ gridTemplateColumns: "1.2fr 64px 1fr" }}
            >
                {/* Branques del trigger */}
                <div className="flex flex-col gap-2">
                    {BRANCHES.map((branch) => {
                        const isActive = ev.branchIdx === branch.idx;
                        const isNoop = branch.idx === 3;

                        return (
                            <button
                                key={branch.idx}
                                type="button"
                                onClick={() => setEventId(branch.eventId)}
                                className={`h-9 px-2.5 rounded-lg border text-left flex items-center transition-all duration-150 cursor-pointer ${
                                    isNoop ? "border-dashed" : ""
                                } ${
                                    isActive
                                        ? TONE_CARD[ev.tone]
                                        : "bg-slate-900/30 border-white/5 text-slate-500 opacity-45 hover:opacity-80"
                                }`}
                            >
                                <span className="text-[11px] truncate">{branch.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Connexions SVG amb delta (+1 / -1) */}
                <svg
                    viewBox={`0 0 ${SVG_W} ${TOTAL_H}`}
                    style={{ height: TOTAL_H }}
                    className="w-full pointer-events-none overflow-visible"
                >
                    <defs>
                        {(Object.keys(TONE_HEX) as Tone[]).map((t) => (
                            <marker
                                key={t}
                                id={`trg-arrow-${t}`}
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

                    {ev.edges.length === 0 ? (
                        <g>
                            <path
                                d={`M 0,${y1} L 34,${y1}`}
                                fill="none"
                                stroke={TONE_HEX.amber}
                                strokeWidth="1.6"
                                strokeDasharray="3 3"
                            />
                            <g transform={`translate(42, ${y1})`}>
                                <rect
                                    x="-10"
                                    y="-8"
                                    width="20"
                                    height="16"
                                    rx="4"
                                    fill="#020617"
                                    stroke={TONE_HEX.amber}
                                    strokeWidth="1"
                                />
                                <text
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    y="1"
                                    fill={TONE_HEX.amber}
                                    fontSize="10"
                                    fontWeight="bold"
                                >
                                    ∅
                                </text>
                            </g>
                        </g>
                    ) : (
                        ev.edges.map((edge) => {
                            const y2 = getYRight(edge.deptIdx);
                            const color = TONE_HEX[edge.tone];
                            return (
                                <g key={`${ev.id}-${edge.deptIdx}`}>
                                    <path
                                        d={`M 0,${y1} C 32,${y1} 32,${y2} 57,${y2}`}
                                        fill="none"
                                        stroke={color}
                                        strokeWidth="2"
                                        markerEnd={`url(#trg-arrow-${edge.tone})`}
                                    />
                                    <g transform={`translate(32, ${(y1 + y2) / 2})`}>
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
                                            y="1"
                                            fill={color}
                                            fontSize="9.5"
                                            fontWeight="bold"
                                        >
                                            {edge.badge}
                                        </text>
                                    </g>
                                </g>
                            );
                        })
                    )}
                </svg>

                {/* Comptadors a departaments */}
                <div
                    className="flex flex-col gap-5"
                    style={{ paddingTop: `${OFFSET_RIGHT}px`, paddingBottom: `${OFFSET_RIGHT}px` }}
                >
                    {(
                        [
                            { idx: 0, id: "1", name: "DIRECCIÓ", count: ev.dpt1Count, tone: ev.dpt1Tone },
                            { idx: 1, id: "2", name: "VENDES", count: ev.dpt2Count, tone: ev.dpt2Tone },
                        ] as const
                    ).map((dept) => {
                        const isTouched = dept.tone !== "neutral";
                        return (
                            <div
                                key={dept.id}
                                className={`h-11 px-2.5 rounded-lg border flex items-center justify-between gap-1.5 transition-all duration-150 ${
                                    isTouched
                                        ? TONE_CARD[dept.tone]
                                        : "bg-slate-900/35 border-white/10 text-slate-400 opacity-55"
                                }`}
                            >
                                <div className="flex items-center gap-1.5 min-w-0">
                                    <span className="font-bold text-[11px] shrink-0">
                                        {dept.id}
                                    </span>
                                    <span className="text-[10px] opacity-80 truncate">
                                        {dept.name}
                                    </span>
                                </div>
                                <span className="text-[11px] font-bold tabular-nums shrink-0">
                                    {dept.count}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Resum en 1 línia */}
            <div className="mt-3 flex justify-center">
                <div className={`px-3 py-1 rounded-lg border text-[11px] transition-colors ${TONE_PILL[ev.tone]}`}>
                    {ev.statusText}
                </div>
            </div>
        </div>
    );
}
