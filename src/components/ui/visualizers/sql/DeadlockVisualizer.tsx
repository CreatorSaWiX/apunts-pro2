"use client";

import { useState } from "react";

type ScenarioId = "deadlock" | "no_cycle" | "break_cycle";
type Actor = "T1" | "T2" | "SGBD";
type Tone = "normal" | "sky" | "violet" | "amber" | "emerald" | "rose";
type NodeStatus = "idle" | "active" | "waiting" | "deadlock" | "committed" | "aborted";

interface GranuleState {
    holder: string;
    waiting?: string;
    tone: Tone;
}

interface DeadlockStep {
    t: number;
    actor: Actor;
    op: string;
    tag?: string;
    edgeB: "off" | "wait" | "cycle";
    edgeA: "off" | "wait" | "cycle";
    t1State: NodeStatus;
    t2State: NodeStatus;
    granuleA: GranuleState;
    granuleB: GranuleState;
    verdict: string;
    verdictTone: Exclude<Tone, "violet">;
}

interface ScenarioConfig {
    id: ScenarioId;
    label: string;
    tone: Exclude<Tone, "normal" | "violet">;
    defaultT: number;
    steps: [DeadlockStep, DeadlockStep, DeadlockStep, DeadlockStep, DeadlockStep, DeadlockStep];
}

const TONE_TAB: Record<ScenarioConfig["tone"], string> = {
    rose: "bg-rose-500/15 border-rose-400 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)] font-semibold",
    sky: "bg-sky-500/15 border-sky-400 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.2)] font-semibold",
    emerald: "bg-emerald-500/15 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)] font-semibold",
    amber: "bg-amber-500/15 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)] font-semibold",
};

const TONE_PILL: Record<DeadlockStep["verdictTone"], string> = {
    normal: "bg-slate-900/50 border-white/10 text-slate-400",
    sky: "bg-sky-500/10 border-sky-500/30 text-sky-300",
    amber: "bg-amber-500/10 border-amber-500/30 text-amber-300",
    emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    rose: "bg-rose-500/10 border-rose-500/30 text-rose-300",
};

const TONE_STEP_ACTIVE: Record<DeadlockStep["verdictTone"], string> = {
    normal: "bg-slate-800/80 border-slate-400 text-slate-100",
    sky: "bg-sky-500/15 border-sky-400 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.2)]",
    amber: "bg-amber-500/15 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.2)]",
    emerald: "bg-emerald-500/15 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.2)]",
    rose: "bg-rose-500/15 border-rose-400 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.22)]",
};

const TONE_CARD: Record<Tone, string> = {
    normal: "bg-slate-900/40 border-white/10 text-slate-400",
    sky: "bg-sky-500/10 border-sky-400/50 text-sky-200",
    violet: "bg-violet-500/10 border-violet-400/50 text-violet-200",
    amber: "bg-amber-500/10 border-amber-400/60 border-dashed text-amber-200",
    emerald: "bg-emerald-500/15 border-emerald-400/60 text-emerald-200",
    rose: "bg-rose-500/15 border-rose-500/70 text-rose-200 shadow-[0_0_10px_rgba(244,63,94,0.18)]",
};

const ACTOR_BADGE: Record<Actor, { text: string; cls: string }> = {
    T1: { text: "T₁", cls: "bg-sky-500/15 border-sky-400/30 text-sky-300" },
    T2: { text: "T₂", cls: "bg-violet-500/15 border-violet-400/30 text-violet-300" },
    SGBD: { text: "BD", cls: "bg-emerald-500/15 border-emerald-400/30 text-emerald-300" },
};

const NODE_STYLE: Record<NodeStatus, { fill: string; stroke: string; text: string; sub: string; label: string }> = {
    idle: { fill: "#0b1324", stroke: "#334155", text: "#94a3b8", sub: "#64748b", label: "inactiva" },
    active: { fill: "#0c1a2e", stroke: "#38bdf8", text: "#e0f2fe", sub: "#7dd3fc", label: "activa" },
    waiting: { fill: "#1a1306", stroke: "#f59e0b", text: "#fef3c7", sub: "#fbbf24", label: "espera ⏳" },
    deadlock: { fill: "#240b12", stroke: "#f43f5e", text: "#fecdd3", sub: "#fb7185", label: "bloqueig ✕" },
    committed: { fill: "#061e14", stroke: "#10b981", text: "#a7f3d0", sub: "#34d399", label: "COMMIT ✓" },
    aborted: { fill: "#0b192c", stroke: "#38bdf8", text: "#bae6fd", sub: "#38bdf8", label: "ABORT ↺" },
};

const SCENARIOS: ScenarioConfig[] = [
    {
        id: "deadlock",
        label: "DEADLOCK (CICLE)",
        tone: "rose",
        defaultT: 6,
        steps: [
            {
                t: 1,
                actor: "T1",
                op: "LOCK(A, S)",
                edgeB: "off",
                edgeA: "off",
                t1State: "active",
                t2State: "idle",
                granuleA: { holder: "S { T₁ }", tone: "sky" },
                granuleB: { holder: "Lliure", tone: "normal" },
                verdict: "T₁ obté S sobre A · 0 esperes",
                verdictTone: "sky",
            },
            {
                t: 2,
                actor: "T1",
                op: "R(A)",
                edgeB: "off",
                edgeA: "off",
                t1State: "active",
                t2State: "idle",
                granuleA: { holder: "S { T₁ }", tone: "sky" },
                granuleB: { holder: "Lliure", tone: "normal" },
                verdict: "T₁ llegeix A (manté S fins al final)",
                verdictTone: "sky",
            },
            {
                t: 3,
                actor: "T2",
                op: "LOCK(B, X)",
                edgeB: "off",
                edgeA: "off",
                t1State: "active",
                t2State: "active",
                granuleA: { holder: "S { T₁ }", tone: "sky" },
                granuleB: { holder: "X { T₂ }", tone: "violet" },
                verdict: "T₂ obté X sobre B · graf encara buit",
                verdictTone: "normal",
            },
            {
                t: 4,
                actor: "T2",
                op: "RU(B), W(B)",
                edgeB: "off",
                edgeA: "off",
                t1State: "active",
                t2State: "active",
                granuleA: { holder: "S { T₁ }", tone: "sky" },
                granuleB: { holder: "X { T₂ }", tone: "violet" },
                verdict: "T₂ escriu B (manté X fins al final)",
                verdictTone: "normal",
            },
            {
                t: 5,
                actor: "T1",
                op: "LOCK(B, S)",
                tag: "⏳",
                edgeB: "wait",
                edgeA: "off",
                t1State: "waiting",
                t2State: "active",
                granuleA: { holder: "S { T₁ }", tone: "sky" },
                granuleB: { holder: "X { T₂ }", waiting: "T₁(S)", tone: "amber" },
                verdict: "T₁ espera B (held by T₂) → aresta T₁ → T₂ · sense cicle",
                verdictTone: "amber",
            },
            {
                t: 6,
                actor: "T2",
                op: "LOCK(A, X)",
                tag: "✕",
                edgeB: "cycle",
                edgeA: "cycle",
                t1State: "deadlock",
                t2State: "deadlock",
                granuleA: { holder: "S { T₁ }", waiting: "T₂(X)", tone: "rose" },
                granuleB: { holder: "X { T₂ }", waiting: "T₁(S)", tone: "rose" },
                verdict: "✕ CICLE T₁ → T₂ → T₁ · abraçada mortal!",
                verdictTone: "rose",
            },
        ],
    },
    {
        id: "no_cycle",
        label: "ESPERA SENSE CICLE",
        tone: "sky",
        defaultT: 6,
        steps: [
            {
                t: 1,
                actor: "T1",
                op: "LOCK(A, S)",
                edgeB: "off",
                edgeA: "off",
                t1State: "active",
                t2State: "idle",
                granuleA: { holder: "S { T₁ }", tone: "sky" },
                granuleB: { holder: "Lliure", tone: "normal" },
                verdict: "T₁ obté S sobre A",
                verdictTone: "sky",
            },
            {
                t: 2,
                actor: "T1",
                op: "R(A)",
                edgeB: "off",
                edgeA: "off",
                t1State: "active",
                t2State: "idle",
                granuleA: { holder: "S { T₁ }", tone: "sky" },
                granuleB: { holder: "Lliure", tone: "normal" },
                verdict: "T₁ llegeix A",
                verdictTone: "sky",
            },
            {
                t: 3,
                actor: "T2",
                op: "LOCK(B, X)",
                edgeB: "off",
                edgeA: "off",
                t1State: "active",
                t2State: "active",
                granuleA: { holder: "S { T₁ }", tone: "sky" },
                granuleB: { holder: "X { T₂ }", tone: "violet" },
                verdict: "T₂ obté X sobre B",
                verdictTone: "normal",
            },
            {
                t: 4,
                actor: "T1",
                op: "LOCK(B, S)",
                tag: "⏳",
                edgeB: "wait",
                edgeA: "off",
                t1State: "waiting",
                t2State: "active",
                granuleA: { holder: "S { T₁ }", tone: "sky" },
                granuleB: { holder: "X { T₂ }", waiting: "T₁(S)", tone: "amber" },
                verdict: "T₁ espera B → aresta T₁ → T₂ (graf acíclic: NO és deadlock)",
                verdictTone: "amber",
            },
            {
                t: 5,
                actor: "T2",
                op: "COMMIT · UNLOCK(B)",
                tag: "✓",
                edgeB: "off",
                edgeA: "off",
                t1State: "active",
                t2State: "committed",
                granuleA: { holder: "S { T₁ }", tone: "sky" },
                granuleB: { holder: "Lliure → T₁", tone: "emerald" },
                verdict: "T₂ no necessita A · acaba i allibera B",
                verdictTone: "emerald",
            },
            {
                t: 6,
                actor: "T1",
                op: "LOCK(B, S) · COMMIT",
                tag: "✓",
                edgeB: "off",
                edgeA: "off",
                t1State: "committed",
                t2State: "committed",
                granuleA: { holder: "Lliure", tone: "normal" },
                granuleB: { holder: "Lliure", tone: "normal" },
                verdict: "✓ Espera resolta sense cicle · ambdues confirmen",
                verdictTone: "emerald",
            },
        ],
    },
    {
        id: "break_cycle",
        label: "TRENCAR CICLE",
        tone: "emerald",
        defaultT: 5,
        steps: [
            {
                t: 1,
                actor: "T1",
                op: "LOCK(A, S), R(A)",
                edgeB: "off",
                edgeA: "off",
                t1State: "active",
                t2State: "idle",
                granuleA: { holder: "S { T₁ }", tone: "sky" },
                granuleB: { holder: "Lliure", tone: "normal" },
                verdict: "T₁ reté S sobre A",
                verdictTone: "sky",
            },
            {
                t: 2,
                actor: "T2",
                op: "LOCK(B, X), W(B)",
                edgeB: "off",
                edgeA: "off",
                t1State: "active",
                t2State: "active",
                granuleA: { holder: "S { T₁ }", tone: "sky" },
                granuleB: { holder: "X { T₂ }", tone: "violet" },
                verdict: "T₂ reté X sobre B",
                verdictTone: "normal",
            },
            {
                t: 3,
                actor: "T1",
                op: "LOCK(B, S)",
                tag: "⏳",
                edgeB: "wait",
                edgeA: "off",
                t1State: "waiting",
                t2State: "active",
                granuleA: { holder: "S { T₁ }", tone: "sky" },
                granuleB: { holder: "X { T₂ }", waiting: "T₁(S)", tone: "amber" },
                verdict: "T₁ entra en espera sobre B (T₁ → T₂)",
                verdictTone: "amber",
            },
            {
                t: 4,
                actor: "T2",
                op: "LOCK(A, X)",
                tag: "✕",
                edgeB: "cycle",
                edgeA: "cycle",
                t1State: "deadlock",
                t2State: "deadlock",
                granuleA: { holder: "S { T₁ }", waiting: "T₂(X)", tone: "rose" },
                granuleB: { holder: "X { T₂ }", waiting: "T₁(S)", tone: "rose" },
                verdict: "L'SGBD detecta el cicle T₁ → T₂ → T₁",
                verdictTone: "rose",
            },
            {
                t: 5,
                actor: "SGBD",
                op: "ABORT T₂ · UNLOCK(B)",
                tag: "↺",
                edgeB: "off",
                edgeA: "off",
                t1State: "active",
                t2State: "aborted",
                granuleA: { holder: "S { T₁ }", tone: "sky" },
                granuleB: { holder: "Alliberat ↺", tone: "sky" },
                verdict: "Avorta T₂ (víctima) · trenca el cicle i allibera B",
                verdictTone: "sky",
            },
            {
                t: 6,
                actor: "T1",
                op: "LOCK(B, S) · COMMIT",
                tag: "✓",
                edgeB: "off",
                edgeA: "off",
                t1State: "committed",
                t2State: "aborted",
                granuleA: { holder: "Lliure", tone: "normal" },
                granuleB: { holder: "Lliure", tone: "normal" },
                verdict: "✓ T₁ reprèn B i completa la transacció",
                verdictTone: "emerald",
            },
        ],
    },
];

function getEdgeStyle(state: "off" | "wait" | "cycle") {
    if (state === "cycle") {
        return {
            color: "#f43f5e",
            opacity: 1,
            width: 2.1,
            marker: "url(#dl-arrow-rose)",
        };
    }
    if (state === "wait") {
        return {
            color: "#f59e0b",
            opacity: 0.95,
            width: 1.9,
            marker: "url(#dl-arrow-amber)",
        };
    }
    return {
        color: "#334155",
        opacity: 0.14,
        width: 1.1,
        marker: undefined,
    };
}

/**
 * Interactive minimalist visualizer for transaction deadlocks and the live Wait-For Graph.
 */
export default function DeadlockVisualizer() {
    const [scenarioId, setScenarioId] = useState<ScenarioId>("deadlock");
    const [activeT, setActiveT] = useState<number>(6);

    const scenario = SCENARIOS.find((s) => s.id === scenarioId) || SCENARIOS[0];
    const current = scenario.steps[activeT - 1] || scenario.steps[5];

    const styleB = getEdgeStyle(current.edgeB);
    const styleA = getEdgeStyle(current.edgeA);
    const isCycle = current.edgeB === "cycle" && current.edgeA === "cycle";
    const t1Visual = NODE_STYLE[current.t1State];
    const t2Visual = NODE_STYLE[current.t2State];

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
                                setActiveT(item.defaultT);
                            }}
                            className={`px-2.5 py-1 rounded-md border text-[11px] transition-all duration-150 cursor-pointer ${
                                isSelected
                                    ? TONE_TAB[item.tone]
                                    : "bg-slate-900/30 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10"
                            }`}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </div>

            {/* Cos principal: horari a l'esquerra + graf d'espera i grànuls a la dreta */}
            <div className="grid grid-cols-1 sm:grid-cols-[1.15fr_1fr] gap-3 items-stretch">
                {/* Columna esquerra: horari pas a pas */}
                <div className="flex flex-col">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold tracking-wider pb-2">
                        <span>HORARI (T₁ / T₂)</span>
                        <span className="text-slate-600">t = 1..6</span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        {scenario.steps.map((step) => {
                            const isActive = activeT === step.t;
                            const isFuture = step.t > activeT;
                            const actor = ACTOR_BADGE[step.actor];

                            return (
                                <button
                                    key={`${scenarioId}-${step.t}`}
                                    type="button"
                                    onMouseEnter={() => setActiveT(step.t)}
                                    onClick={() => setActiveT(step.t)}
                                    className={`h-8 px-2 rounded-lg border text-left transition-all duration-150 cursor-pointer flex items-center justify-between gap-1.5 ${
                                        isActive
                                            ? TONE_STEP_ACTIVE[step.verdictTone]
                                            : isFuture
                                            ? "bg-slate-900/20 border-white/5 text-slate-600 opacity-35 hover:opacity-75"
                                            : "bg-slate-900/50 border-white/10 text-slate-300 hover:border-slate-600"
                                    }`}
                                >
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        <span className="text-[9.5px] opacity-50 w-2.5 shrink-0">
                                            {step.t}
                                        </span>
                                        <span
                                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold border shrink-0 ${actor.cls}`}
                                        >
                                            {actor.text}
                                        </span>
                                        <span className="truncate text-[11px]">{step.op}</span>
                                    </div>
                                    {step.tag && (
                                        <span className="text-[10px] font-bold opacity-85 shrink-0">
                                            {step.tag}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Columna dreta: Graf d'espera en directe + estat dels grànuls A i B */}
                <div className="flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold tracking-wider pb-2">
                            <span>GRAF D&apos;ESPERA</span>
                            <span
                                className={`text-[9.5px] font-bold ${
                                    isCycle ? "text-rose-400" : "text-slate-500"
                                }`}
                            >
                                {isCycle ? "CICLE ✕" : "ACÍCLIC"}
                            </span>
                        </div>

                        <div
                            className={`rounded-xl border px-2 py-1.5 transition-colors duration-200 ${
                                isCycle
                                    ? "bg-rose-950/15 border-rose-500/40"
                                    : "bg-slate-900/35 border-white/10"
                            }`}
                        >
                            <svg
                                viewBox="0 0 220 112"
                                className="w-full h-auto overflow-visible pointer-events-none"
                            >
                                <defs>
                                    {[
                                        { id: "dl-arrow-amber", color: "#f59e0b" },
                                        { id: "dl-arrow-rose", color: "#f43f5e" },
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

                                {/* Aresta superior: T1 --(B)--> T2 */}
                                <g opacity={styleB.opacity} className="transition-opacity duration-200">
                                    <path
                                        d="M 56,41 C 82,10 138,10 162,39"
                                        fill="none"
                                        stroke={styleB.color}
                                        strokeWidth={styleB.width}
                                        strokeDasharray={current.edgeB === "off" ? "3 3" : undefined}
                                        markerEnd={styleB.marker}
                                    />
                                    <g transform="translate(110, 17.5)">
                                        <rect
                                            x="-9"
                                            y="-8"
                                            width="18"
                                            height="16"
                                            rx="4"
                                            fill="#020617"
                                            stroke={styleB.color}
                                            strokeWidth="1"
                                        />
                                        <text
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            y="0.5"
                                            fill={current.edgeB === "off" ? "#64748b" : styleB.color}
                                            fontSize="9.5"
                                            fontWeight="bold"
                                        >
                                            B
                                        </text>
                                    </g>
                                </g>

                                {/* Aresta inferior: T2 --(A)--> T1 */}
                                <g opacity={styleA.opacity} className="transition-opacity duration-200">
                                    <path
                                        d="M 164,71 C 138,102 82,102 58,73"
                                        fill="none"
                                        stroke={styleA.color}
                                        strokeWidth={styleA.width}
                                        strokeDasharray={current.edgeA === "off" ? "3 3" : undefined}
                                        markerEnd={styleA.marker}
                                    />
                                    <g transform="translate(110, 94.5)">
                                        <rect
                                            x="-9"
                                            y="-8"
                                            width="18"
                                            height="16"
                                            rx="4"
                                            fill="#020617"
                                            stroke={styleA.color}
                                            strokeWidth="1"
                                        />
                                        <text
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            y="0.5"
                                            fill={current.edgeA === "off" ? "#64748b" : styleA.color}
                                            fontSize="9.5"
                                            fontWeight="bold"
                                        >
                                            A
                                        </text>
                                    </g>
                                </g>

                                {/* Indicador central quan hi ha cicle */}
                                {isCycle && (
                                    <g transform="translate(110, 56)">
                                        <rect
                                            x="-24"
                                            y="-9"
                                            width="48"
                                            height="18"
                                            rx="4"
                                            fill="#240b12"
                                            stroke="#f43f5e"
                                            strokeWidth="1"
                                        />
                                        <text
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            y="0.5"
                                            fill="#fecdd3"
                                            fontSize="8.5"
                                            fontWeight="bold"
                                        >
                                            CICLE ✕
                                        </text>
                                    </g>
                                )}

                                {/* Node T1 */}
                                <g transform="translate(16, 40)">
                                    <rect
                                        width="50"
                                        height="32"
                                        rx="8"
                                        fill={t1Visual.fill}
                                        stroke={t1Visual.stroke}
                                        strokeWidth="1.4"
                                    />
                                    <text
                                        x="25"
                                        y="13"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fill={t1Visual.text}
                                        fontSize="10.5"
                                        fontWeight="bold"
                                    >
                                        T₁
                                    </text>
                                    <text
                                        x="25"
                                        y="24"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fill={t1Visual.sub}
                                        fontSize="7"
                                    >
                                        {t1Visual.label}
                                    </text>
                                </g>

                                {/* Node T2 */}
                                <g transform="translate(154, 40)">
                                    <rect
                                        width="50"
                                        height="32"
                                        rx="8"
                                        fill={t2Visual.fill}
                                        stroke={t2Visual.stroke}
                                        strokeWidth="1.4"
                                    />
                                    <text
                                        x="25"
                                        y="13"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fill={t2Visual.text}
                                        fontSize="10.5"
                                        fontWeight="bold"
                                    >
                                        T₂
                                    </text>
                                    <text
                                        x="25"
                                        y="24"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fill={t2Visual.sub}
                                        fontSize="7"
                                    >
                                        {t2Visual.label}
                                    </text>
                                </g>
                            </svg>
                        </div>
                    </div>

                    {/* Reserves actives i cues sobre A i B */}
                    <div className="flex flex-col gap-1.5 mt-2">
                        {[
                            { id: "A", state: current.granuleA },
                            { id: "B", state: current.granuleB },
                        ].map((g) => (
                            <div
                                key={g.id}
                                className={`h-8 px-2.5 rounded-lg border flex items-center justify-between gap-1.5 transition-colors duration-200 ${TONE_CARD[g.state.tone]}`}
                            >
                                <span className="font-bold text-[10.5px] shrink-0">{g.id}</span>
                                <div className="flex items-center gap-1.5 text-[10px] truncate">
                                    <span className="font-semibold">{g.state.holder}</span>
                                    {g.state.waiting && (
                                        <span className="px-1.5 py-0.5 rounded bg-black/30 border border-current/25 text-[9px]">
                                            cua: {g.state.waiting}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Resum en 1 línia */}
            <div className="mt-3 flex justify-center">
                <div
                    className={`px-3 py-1 rounded-lg border text-[11px] text-center transition-colors ${TONE_PILL[current.verdictTone]}`}
                >
                    {current.verdict}
                </div>
            </div>
        </div>
    );
}
