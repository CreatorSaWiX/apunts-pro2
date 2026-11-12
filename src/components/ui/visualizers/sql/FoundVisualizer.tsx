"use client";

import { useState } from "react";

type ModeId = "select_into" | "dml" | "for_loop" | "for_trap";
type Tone = "normal" | "sky" | "amber" | "emerald" | "rose";

interface SlotView {
    label: string;
    display: string;
    tone: Tone;
}

interface CurveEdge {
    fromStep: 0 | 1 | 2 | 3;
    toSlot: 0 | 1 | 2;
    tone: Exclude<Tone, "normal">;
    dashed?: boolean;
    badge?: string;
}

interface ExecStep {
    lineNum: string;
    code: string;
    tag?: string;
    slots: [SlotView, SlotView, SlotView];
    statusText: string;
    statusTone: Tone;
    edges: CurveEdge[];
}

interface ModeDef {
    id: ModeId;
    label: string;
    matchLabel?: string;
    emptyLabel?: string;
    leftHeader: string;
    getSteps: (hasMatch: boolean) => [ExecStep, ExecStep, ExecStep, ExecStep];
}

// Geometria exacta: esquerra 4x36px + 3x8px = 168px; dreta 3x36px + 2x12px + 2x18px = 168px
const ROW_H = 36;
const GAP_LEFT = 8;
const OFFSET_RIGHT = 18;
const GAP_RIGHT = 12;
const TOTAL_H = 4 * ROW_H + 3 * GAP_LEFT; // 168px
const SVG_W = 56;

const getYLeft = (idx: number) => idx * (ROW_H + GAP_LEFT) + ROW_H / 2;
const getYRight = (idx: number) => OFFSET_RIGHT + idx * (ROW_H + GAP_RIGHT) + ROW_H / 2;

const TONE_HEX: Record<Tone, string> = {
    normal: "#475569",
    sky: "#38bdf8",
    amber: "#f59e0b",
    emerald: "#10b981",
    rose: "#f43f5e",
};

const TONE_CELL: Record<Tone, string> = {
    normal: "bg-slate-900/40 border-white/10 text-slate-300",
    sky: "bg-sky-500/15 border-sky-400/70 text-sky-200 shadow-[0_0_10px_rgba(56,189,248,0.18)]",
    amber: "bg-amber-500/10 border-amber-400/60 border-dashed text-amber-200",
    emerald: "bg-emerald-500/15 border-emerald-400/70 text-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.18)]",
    rose: "bg-rose-500/15 border-rose-500/70 text-rose-200 shadow-[0_0_10px_rgba(244,63,94,0.2)]",
};

const TONE_STEP_ACTIVE: Record<Tone, string> = {
    normal: "bg-slate-800/80 border-slate-400 text-slate-100",
    sky: "bg-sky-500/15 border-sky-400 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.2)]",
    amber: "bg-amber-500/15 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.2)]",
    emerald: "bg-emerald-500/15 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.2)]",
    rose: "bg-rose-500/15 border-rose-400 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.22)]",
};

const TONE_PILL: Record<Tone, string> = {
    normal: "bg-slate-900/50 border-white/10 text-slate-400",
    sky: "bg-sky-500/10 border-sky-500/30 text-sky-300",
    amber: "bg-amber-500/10 border-amber-500/30 text-amber-300",
    emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    rose: "bg-rose-500/10 border-rose-500/30 text-rose-300",
};

const MODES: ModeDef[] = [
    {
        id: "select_into",
        label: "SELECT ... INTO",
        matchLabel: "1 fila",
        emptyLabel: "0 files",
        leftHeader: "EXECUCIÓ · SELECT INTO",
        getSteps: (hasMatch) => [
            {
                lineNum: "1",
                code: "BEGIN",
                slots: [
                    { label: "BD", display: hasMatch ? "1 fila" : "0 files", tone: "normal" },
                    { label: "FOUND", display: "False (init)", tone: "normal" },
                    { label: "Branca", display: "inici bloc", tone: "normal" },
                ],
                statusText: "FOUND és local al bloc i sempre comença en False",
                statusTone: "sky",
                edges: [{ fromStep: 0, toSlot: 1, tone: "sky", dashed: true }],
            },
            {
                lineNum: "2",
                code: "SELECT ... INTO v",
                tag: hasMatch ? "1 fila" : "buit",
                slots: [
                    { label: "BD", display: hasMatch ? "1 fila" : "0 files", tone: hasMatch ? "sky" : "amber" },
                    {
                        label: "FOUND",
                        display: hasMatch ? "True ✓" : "False ✕",
                        tone: hasMatch ? "emerald" : "rose",
                    },
                    { label: "Branca", display: "avaluant…", tone: "normal" },
                ],
                statusText: hasMatch
                    ? "SELECT ... INTO troba 1 fila → posa FOUND = True"
                    : "Cap fila trobada → v queda NULL i FOUND = False",
                statusTone: hasMatch ? "emerald" : "rose",
                edges: [
                    {
                        fromStep: 1,
                        toSlot: 1,
                        tone: hasMatch ? "emerald" : "rose",
                        badge: hasMatch ? "T" : "F",
                    },
                ],
            },
            {
                lineNum: "3",
                code: "IF NOT FOUND THEN",
                tag: hasMatch ? "salta" : "entra",
                slots: [
                    { label: "BD", display: hasMatch ? "1 fila" : "0 files", tone: "normal" },
                    {
                        label: "FOUND",
                        display: hasMatch ? "True ✓" : "False ✕",
                        tone: hasMatch ? "emerald" : "rose",
                    },
                    {
                        label: "Branca",
                        display: hasMatch ? "salta IF ✓" : "entra IF ✕",
                        tone: hasMatch ? "emerald" : "rose",
                    },
                ],
                statusText: hasMatch
                    ? "NOT FOUND és fals → omet el bloc d'error"
                    : "NOT FOUND és cert → entra dins la branca IF",
                statusTone: hasMatch ? "sky" : "amber",
                edges: [
                    {
                        fromStep: 2,
                        toSlot: 2,
                        tone: hasMatch ? "emerald" : "rose",
                    },
                ],
            },
            {
                lineNum: "4",
                code: hasMatch ? "-- segueix normal" : "RAISE EXCEPTION",
                tag: hasMatch ? "✓" : "✕",
                slots: [
                    { label: "BD", display: hasMatch ? "1 fila" : "0 files", tone: "normal" },
                    {
                        label: "FOUND",
                        display: hasMatch ? "True ✓" : "False ✕",
                        tone: hasMatch ? "emerald" : "rose",
                    },
                    {
                        label: "Sortida",
                        display: hasMatch ? "continua ✓" : "avorta ✕",
                        tone: hasMatch ? "emerald" : "rose",
                    },
                ],
                statusText: hasMatch
                    ? "La funció continua amb la dada carregada a v"
                    : "Llança excepció en no trobar cap fila",
                statusTone: hasMatch ? "emerald" : "rose",
                edges: [
                    { fromStep: 1, toSlot: 1, tone: hasMatch ? "emerald" : "rose", dashed: true },
                    {
                        fromStep: 3,
                        toSlot: 2,
                        tone: hasMatch ? "emerald" : "rose",
                        badge: hasMatch ? "✓" : "✕",
                    },
                ],
            },
        ],
    },
    {
        id: "dml",
        label: "INSERT / UPDATE",
        matchLabel: "≥ 1 fila",
        emptyLabel: "0 files",
        leftHeader: "EXECUCIÓ · DML",
        getSteps: (hasMatch) => [
            {
                lineNum: "1",
                code: "BEGIN",
                slots: [
                    { label: "Afect.", display: hasMatch ? "≥ 1 fila" : "0 files", tone: "normal" },
                    { label: "FOUND", display: "False (init)", tone: "normal" },
                    { label: "Branca", display: "inici bloc", tone: "normal" },
                ],
                statusText: "FOUND inicia en False abans de modificar taules",
                statusTone: "sky",
                edges: [{ fromStep: 0, toSlot: 1, tone: "sky", dashed: true }],
            },
            {
                lineNum: "2",
                code: "UPDATE emp SET ...",
                tag: hasMatch ? "2 files" : "0 files",
                slots: [
                    { label: "Afect.", display: hasMatch ? "2 files" : "0 files", tone: hasMatch ? "sky" : "amber" },
                    {
                        label: "FOUND",
                        display: hasMatch ? "True ✓" : "False ✕",
                        tone: hasMatch ? "emerald" : "rose",
                    },
                    { label: "Branca", display: "avaluant…", tone: "normal" },
                ],
                statusText: hasMatch
                    ? "Ha modificat ≥ 1 fila → FOUND passa a True"
                    : "Cap fila compleix el WHERE → FOUND queda en False",
                statusTone: hasMatch ? "emerald" : "rose",
                edges: [
                    {
                        fromStep: 1,
                        toSlot: 1,
                        tone: hasMatch ? "emerald" : "rose",
                        badge: hasMatch ? "T" : "F",
                    },
                ],
            },
            {
                lineNum: "3",
                code: "IF NOT FOUND THEN",
                tag: hasMatch ? "salta" : "entra",
                slots: [
                    { label: "Afect.", display: hasMatch ? "2 files" : "0 files", tone: "normal" },
                    {
                        label: "FOUND",
                        display: hasMatch ? "True ✓" : "False ✕",
                        tone: hasMatch ? "emerald" : "rose",
                    },
                    {
                        label: "Branca",
                        display: hasMatch ? "salta IF ✓" : "entra IF ✕",
                        tone: hasMatch ? "emerald" : "rose",
                    },
                ],
                statusText: hasMatch
                    ? "No cal fer SELECT previ: l'UPDATE directe ja informa amb FOUND"
                    : "Detecta que no existia cap fila per actualitzar",
                statusTone: hasMatch ? "sky" : "amber",
                edges: [{ fromStep: 2, toSlot: 2, tone: hasMatch ? "emerald" : "rose" }],
            },
            {
                lineNum: "4",
                code: hasMatch ? "-- canvi aplicat" : "RAISE EXCEPTION",
                tag: hasMatch ? "✓" : "✕",
                slots: [
                    { label: "Afect.", display: hasMatch ? "2 files" : "0 files", tone: "normal" },
                    {
                        label: "FOUND",
                        display: hasMatch ? "True ✓" : "False ✕",
                        tone: hasMatch ? "emerald" : "rose",
                    },
                    {
                        label: "Sortida",
                        display: hasMatch ? "commit ✓" : "avorta ✕",
                        tone: hasMatch ? "emerald" : "rose",
                    },
                ],
                statusText: hasMatch
                    ? "Patró òptim de qualitat: UPDATE directe + comprovació FOUND"
                    : "Llança error sense haver fet cap consulta SELECT prèvia",
                statusTone: hasMatch ? "emerald" : "rose",
                edges: [
                    { fromStep: 1, toSlot: 1, tone: hasMatch ? "emerald" : "rose", dashed: true },
                    {
                        fromStep: 3,
                        toSlot: 2,
                        tone: hasMatch ? "emerald" : "rose",
                        badge: hasMatch ? "✓" : "✕",
                    },
                ],
            },
        ],
    },
    {
        id: "for_loop",
        label: "FOR ... LOOP",
        matchLabel: "≥ 1 iter",
        emptyLabel: "0 iters",
        leftHeader: "BUCLE FOR · SORTIDA",
        getSteps: (hasMatch) => [
            {
                lineNum: "1",
                code: "BEGIN",
                slots: [
                    { label: "Iters", display: "0", tone: "normal" },
                    { label: "FOUND", display: "False (init)", tone: "normal" },
                    { label: "Branca", display: "inici bloc", tone: "normal" },
                ],
                statusText: "Abans del bucle FOR, FOUND està a False",
                statusTone: "sky",
                edges: [{ fromStep: 0, toSlot: 1, tone: "sky", dashed: true }],
            },
            {
                lineNum: "2",
                code: "FOR r IN SELECT ...",
                tag: hasMatch ? "2 iters" : "0 iters",
                slots: [
                    { label: "Iters", display: hasMatch ? "2 vegades" : "0 (buit)", tone: hasMatch ? "sky" : "amber" },
                    { label: "FOUND", display: hasMatch ? "True" : "False", tone: hasMatch ? "sky" : "amber" },
                    { label: "Cos", display: hasMatch ? "RETURN NEXT r" : "no entra", tone: "normal" },
                ],
                statusText: hasMatch
                    ? "El SELECT retorna 2 files → itera 2 vegades"
                    : "El SELECT no retorna files → salta directament a END LOOP",
                statusTone: hasMatch ? "sky" : "amber",
                edges: [{ fromStep: 1, toSlot: 0, tone: hasMatch ? "sky" : "amber" }],
            },
            {
                lineNum: "3",
                code: "END LOOP;",
                tag: hasMatch ? "→ True" : "→ False",
                slots: [
                    { label: "Iters", display: hasMatch ? "2 (≥ 1)" : "0", tone: "normal" },
                    {
                        label: "FOUND",
                        display: hasMatch ? "True ✓" : "False ✕",
                        tone: hasMatch ? "emerald" : "rose",
                    },
                    { label: "Branca", display: "en sortir", tone: "normal" },
                ],
                statusText: hasMatch
                    ? "En sortir del FOR, queda FOUND = True perquè ha iterat ≥ 1 cop"
                    : "En sortir del FOR, queda FOUND = False perquè ha fet 0 iteracions",
                statusTone: hasMatch ? "emerald" : "rose",
                edges: [
                    {
                        fromStep: 2,
                        toSlot: 1,
                        tone: hasMatch ? "emerald" : "rose",
                        badge: hasMatch ? "T" : "F",
                    },
                ],
            },
            {
                lineNum: "4",
                code: "IF NOT FOUND THEN",
                tag: hasMatch ? "✓" : "RAISE ✕",
                slots: [
                    { label: "Iters", display: hasMatch ? "2" : "0", tone: "normal" },
                    {
                        label: "FOUND",
                        display: hasMatch ? "True ✓" : "False ✕",
                        tone: hasMatch ? "emerald" : "rose",
                    },
                    {
                        label: "Resultat",
                        display: hasMatch ? "emeses ✓" : "RAISE ✕",
                        tone: hasMatch ? "emerald" : "rose",
                    },
                ],
                statusText: hasMatch
                    ? "Patró clàssic d'examen: té resultats i acaba normalment"
                    : "Patró clàssic d'examen: detecta 0 resultats i llança excepció",
                statusTone: hasMatch ? "emerald" : "rose",
                edges: [
                    { fromStep: 2, toSlot: 1, tone: hasMatch ? "emerald" : "rose", dashed: true },
                    {
                        fromStep: 3,
                        toSlot: 2,
                        tone: hasMatch ? "emerald" : "rose",
                        badge: hasMatch ? "✓" : "✕",
                    },
                ],
            },
        ],
    },
    {
        id: "for_trap",
        label: "TRAMPA FOR",
        leftHeader: "DINS VS EN SORTIR DEL FOR",
        getSteps: () => [
            {
                lineNum: "1",
                code: "FOR r IN SELECT ...",
                tag: "iter 1",
                slots: [
                    { label: "Iters", display: "1 (dins FOR)", tone: "sky" },
                    { label: "FOUND", display: "True", tone: "sky" },
                    { label: "Efecte", display: "entra cos", tone: "sky" },
                ],
                statusText: "El bucle FOR comença i executa 1 iteració",
                statusTone: "sky",
                edges: [
                    { fromStep: 0, toSlot: 0, tone: "sky" },
                    { fromStep: 0, toSlot: 1, tone: "sky", dashed: true },
                ],
            },
            {
                lineNum: "2",
                code: "  UPDATE ... (0 files)",
                tag: "⚠ False",
                slots: [
                    { label: "Iters", display: "1 (dins FOR)", tone: "sky" },
                    { label: "FOUND", display: "False ⚠", tone: "amber" },
                    { label: "Efecte", display: "sobreescrit!", tone: "amber" },
                ],
                statusText: "Dins la iteració, un UPDATE sense files posa FOUND = False",
                statusTone: "amber",
                edges: [
                    { fromStep: 1, toSlot: 1, tone: "amber", badge: "F" },
                    { fromStep: 1, toSlot: 2, tone: "amber", dashed: true },
                ],
            },
            {
                lineNum: "3",
                code: "END LOOP;",
                tag: "↺ True!",
                slots: [
                    { label: "Iters", display: "1 (≥ 1)", tone: "emerald" },
                    { label: "FOUND", display: "True ✓", tone: "emerald" },
                    { label: "Efecte", display: "reescrit!", tone: "emerald" },
                ],
                statusText: "TRAMPA: en sortir del FOR, FOUND es reescriu a True (perquè ha iterat)",
                statusTone: "emerald",
                edges: [
                    { fromStep: 2, toSlot: 1, tone: "emerald", badge: "↺ T" },
                    { fromStep: 2, toSlot: 2, tone: "emerald" },
                ],
            },
            {
                lineNum: "4",
                code: "IF NOT FOUND THEN ...",
                tag: "NO entra",
                slots: [
                    { label: "Iters", display: "1", tone: "normal" },
                    { label: "FOUND", display: "True ✓", tone: "emerald" },
                    { label: "Branca", display: "salta IF ✓", tone: "emerald" },
                ],
                statusText: "IF NOT FOUND després del FOR NO detecta el False de dins el bucle",
                statusTone: "emerald",
                edges: [
                    { fromStep: 2, toSlot: 1, tone: "emerald", dashed: true },
                    { fromStep: 3, toSlot: 2, tone: "emerald", badge: "✓" },
                ],
            },
        ],
    },
];

/**
 * Interactive minimalist visualizer for PL/pgSQL `IF` branching, `FOUND` updates
 * across `SELECT INTO`, DML, `FOR ... LOOP`, and the classic `FOR` exit rewrite trap.
 */
export default function FoundVisualizer() {
    const [modeId, setModeId] = useState<ModeId>("select_into");
    const [hasMatch, setHasMatch] = useState<boolean>(false);
    const [stepIndex, setStepIndex] = useState<number>(3);

    const activeMode = MODES.find((m) => m.id === modeId) || MODES[0];
    const steps = activeMode.getSteps(hasMatch);
    const currentStep = steps[stepIndex] || steps[3];
    const hasToggle = Boolean(activeMode.matchLabel && activeMode.emptyLabel);

    return (
        <div className="w-full max-w-xl mx-auto my-6 not-prose select-none font-mono text-xs">
            {/* Selector de sentència / cas */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pb-4">
                {MODES.map((item) => {
                    const isSelected = item.id === modeId;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                                setModeId(item.id);
                                setStepIndex(item.id === "for_trap" ? 2 : 3);
                            }}
                            className={`px-2.5 py-1 rounded-md border text-[11px] transition-all duration-150 cursor-pointer ${
                                isSelected
                                    ? item.id === "for_trap"
                                        ? "bg-amber-500/15 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)] font-semibold"
                                        : "bg-sky-500/15 border-sky-400 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.2)] font-semibold"
                                    : "bg-slate-900/30 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10"
                            }`}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </div>

            {/* Capçaleres de columna + mini selector de resultat BD */}
            <div
                className="grid items-center text-[10px] text-slate-500 font-semibold tracking-wider pb-2"
                style={{ gridTemplateColumns: `minmax(0, 1.25fr) ${SVG_W}px minmax(0, 1fr)` }}
            >
                <span className="truncate pr-1">{activeMode.leftHeader}</span>
                <span />
                <div className="flex items-center justify-end gap-1">
                    {hasToggle ? (
                        <div className="inline-flex p-0.5 rounded-md bg-slate-900/70 border border-white/10">
                            <button
                                type="button"
                                onClick={() => setHasMatch(true)}
                                className={`px-1.5 py-0.5 rounded text-[9.5px] transition-all cursor-pointer ${
                                    hasMatch
                                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold"
                                        : "text-slate-500 hover:text-slate-300 border border-transparent"
                                }`}
                            >
                                {activeMode.matchLabel}
                            </button>
                            <button
                                type="button"
                                onClick={() => setHasMatch(false)}
                                className={`px-1.5 py-0.5 rounded text-[9.5px] transition-all cursor-pointer ${
                                    !hasMatch
                                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold"
                                        : "text-slate-500 hover:text-slate-300 border border-transparent"
                                }`}
                            >
                                {activeMode.emptyLabel}
                            </button>
                        </div>
                    ) : (
                        <span>ESTAT DE FOUND</span>
                    )}
                </div>
            </div>

            {/* Cos principal: codi pas a pas (esquerra) + corbes SVG + estat FOUND (dreta) */}
            <div
                className="relative grid items-center"
                style={{ gridTemplateColumns: `minmax(0, 1.25fr) ${SVG_W}px minmax(0, 1fr)` }}
            >
                <div className="flex flex-col gap-2">
                    {steps.map((step, idx) => {
                        const isActive = stepIndex === idx;
                        const isDimmed = idx > stepIndex;

                        return (
                            <button
                                key={`${modeId}-${idx}`}
                                type="button"
                                onMouseEnter={() => setStepIndex(idx)}
                                onClick={() => setStepIndex(idx)}
                                className={`h-9 px-2 rounded-lg border text-left transition-all duration-150 cursor-pointer flex items-center justify-between gap-1.5 ${
                                    isActive
                                        ? TONE_STEP_ACTIVE[step.statusTone]
                                        : isDimmed
                                        ? "bg-slate-900/20 border-white/5 text-slate-600 opacity-35 hover:opacity-75"
                                        : "bg-slate-900/50 border-white/10 text-slate-300 hover:border-slate-600"
                                }`}
                            >
                                <div className="flex items-center gap-1.5 min-w-0">
                                    <span className="text-[9.5px] opacity-50 w-2.5 shrink-0">
                                        {step.lineNum}
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

                {/* Connexions SVG alineades al píxel */}
                <svg
                    viewBox={`0 0 ${SVG_W} ${TOTAL_H}`}
                    style={{ height: `${TOTAL_H}px` }}
                    className="w-full pointer-events-none overflow-visible"
                >
                    {currentStep.edges.map((edge, i) => {
                        const y1 = getYLeft(edge.fromStep);
                        const y2 = getYRight(edge.toSlot);
                        const stroke = TONE_HEX[edge.tone];
                        return (
                            <g key={`${modeId}-${hasMatch}-${stepIndex}-edge-${i}`}>
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

                {/* Estat BD, valor de FOUND i branca executada */}
                <div
                    className="flex flex-col gap-3"
                    style={{ paddingTop: `${OFFSET_RIGHT}px`, paddingBottom: `${OFFSET_RIGHT}px` }}
                >
                    {currentStep.slots.map((slot, idx) => (
                        <div
                            key={`${modeId}-slot-${idx}`}
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

            {/* Resum en 1 línia */}
            <div className="mt-3 flex justify-center">
                <div
                    className={`px-3 py-1 rounded-lg border text-[11px] text-center transition-colors ${TONE_PILL[currentStep.statusTone]}`}
                >
                    {currentStep.statusText}
                </div>
            </div>
        </div>
    );
}
