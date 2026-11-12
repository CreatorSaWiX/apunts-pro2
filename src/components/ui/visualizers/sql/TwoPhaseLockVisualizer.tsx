"use client";

import { useState } from "react";

type ProtocolId = "pr2f" | "strong_strict" | "violation";
type Tone = "sky" | "amber" | "emerald" | "rose";

interface PhaseStep {
    op: string;
    sub?: string;
    before: 0 | 1 | 2;
    after: 0 | 1 | 2;
    tone: Tone;
    badge?: string;
    statusText: string;
}

interface ProtocolConfig {
    id: ProtocolId;
    label: string;
    tone: Tone;
    defaultStep: number;
    phaseAnnotation: { x: number; text: string; tone: Tone }[];
    steps: [PhaseStep, PhaseStep, PhaseStep, PhaseStep, PhaseStep];
    properties: {
        serializable: boolean;
        noDirtyRead: boolean;
        recoverable: boolean;
    };
}

const SVG_W = 500;
const SVG_H = 114;
const X_START = 16;
const X_END = 484;
const X_STEPS = [50, 150, 250, 350, 450] as const;
const Y_LEVELS: Record<0 | 1 | 2, number> = {
    0: 94,
    1: 58,
    2: 22,
};

const TONE_HEX: Record<Tone, string> = {
    sky: "#38bdf8",
    amber: "#f59e0b",
    emerald: "#10b981",
    rose: "#f43f5e",
};

const TONE_TAB: Record<Tone, string> = {
    sky: "bg-sky-500/15 border-sky-400 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.2)] font-semibold",
    amber: "bg-amber-500/15 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)] font-semibold",
    emerald: "bg-emerald-500/15 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)] font-semibold",
    rose: "bg-rose-500/15 border-rose-400 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)] font-semibold",
};

const TONE_STEP_ACTIVE: Record<Tone, string> = {
    sky: "bg-sky-500/15 border-sky-400 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.2)]",
    amber: "bg-amber-500/15 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.2)]",
    emerald: "bg-emerald-500/15 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.2)]",
    rose: "bg-rose-500/15 border-rose-400 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.22)]",
};

const TONE_PILL: Record<Tone, string> = {
    sky: "bg-sky-500/10 border-sky-500/30 text-sky-300",
    amber: "bg-amber-500/10 border-amber-500/30 text-amber-300",
    emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    rose: "bg-rose-500/10 border-rose-500/30 text-rose-300",
};

const PROTOCOLS: ProtocolConfig[] = [
    {
        id: "pr2f",
        label: "PR2F",
        tone: "sky",
        defaultStep: 2,
        phaseAnnotation: [
            { x: 100, text: "CREIXENT ↗", tone: "sky" },
            { x: 300, text: "MINVANT ↘", tone: "amber" },
        ],
        steps: [
            {
                op: "LOCK(A)",
                sub: "↗ +1",
                before: 0,
                after: 1,
                tone: "sky",
                statusText: "Fase creixent ↗ · adquireix LOCK(A, X)",
            },
            {
                op: "LOCK(B)",
                sub: "màx 2",
                before: 1,
                after: 2,
                tone: "sky",
                statusText: "Punt de reserva (2) · encara no ha alliberat cap grànul",
            },
            {
                op: "UNLOCK(A)",
                sub: "↘ -1",
                before: 2,
                after: 1,
                tone: "amber",
                badge: "↘",
                statusText: "Fase minvant ↘ · allibera A abans del COMMIT (risc brut)",
            },
            {
                op: "UNLOCK(B)",
                sub: "↘ 0",
                before: 1,
                after: 0,
                tone: "amber",
                statusText: "Totes les reserves alliberades · prohibit demanar-ne de noves",
            },
            {
                op: "COMMIT",
                sub: "final",
                before: 0,
                after: 0,
                tone: "emerald",
                statusText: "COMMIT ✓ · serialitzable, però vulnerable a ABORT previ",
            },
        ],
        properties: {
            serializable: true,
            noDirtyRead: false,
            recoverable: false,
        },
    },
    {
        id: "strong_strict",
        label: "FORTAMENT ESTRICTE",
        tone: "emerald",
        defaultStep: 3,
        phaseAnnotation: [
            { x: 145, text: "CREIXENT ↗", tone: "sky" },
            { x: 350, text: "RETÉ TOTES FINS FINAL", tone: "emerald" },
        ],
        steps: [
            {
                op: "LOCK(A)",
                sub: "↗ +1",
                before: 0,
                after: 1,
                tone: "sky",
                statusText: "Adquireix LOCK(A, X) abans d'operar sobre A",
            },
            {
                op: "RU, W(A)",
                sub: "manté A",
                before: 1,
                after: 1,
                tone: "sky",
                statusText: "Opera sobre A i conserva la reserva activa",
            },
            {
                op: "LOCK(B)",
                sub: "↗ 2",
                before: 1,
                after: 2,
                tone: "emerald",
                statusText: "Adquireix LOCK(B, X) sense haver alliberat A",
            },
            {
                op: "RU, W(B)",
                sub: "manté A,B",
                before: 2,
                after: 2,
                tone: "emerald",
                statusText: "Manté A i B fins a l'acabament · cap altra TX pot llegir dades brutes",
            },
            {
                op: "COMMIT",
                sub: "UNLOCK A,B",
                before: 2,
                after: 0,
                tone: "emerald",
                badge: "✓",
                statusText: "COMMIT / ABORT + UNLOCK(A, B) · evita lectures brutes i garanteix recuperabilitat",
            },
        ],
        properties: {
            serializable: true,
            noDirtyRead: true,
            recoverable: true,
        },
    },
    {
        id: "violation",
        label: "VIOLA PR2F",
        tone: "rose",
        defaultStep: 3,
        phaseAnnotation: [
            { x: 100, text: "CREIX", tone: "sky" },
            { x: 250, text: "ALLIBERA", tone: "amber" },
            { x: 400, text: "RE-DEMANA ✕", tone: "rose" },
        ],
        steps: [
            {
                op: "LOCK(A)",
                sub: "↗ +1",
                before: 0,
                after: 1,
                tone: "sky",
                statusText: "Fase creixent · adquireix LOCK(A, X)",
            },
            {
                op: "RU, W(A)",
                sub: "opera",
                before: 1,
                after: 1,
                tone: "sky",
                statusText: "Opera sobre A amb reserva X",
            },
            {
                op: "UNLOCK(A)",
                sub: "↘ 0",
                before: 1,
                after: 0,
                tone: "amber",
                statusText: "Entra a la fase minvant en alliberar A",
            },
            {
                op: "LOCK(B)",
                sub: "✕ viola",
                before: 0,
                after: 1,
                tone: "rose",
                badge: "✕",
                statusText: "✕ Demana LOCK(B, X) després d'un UNLOCK → viola PR2F",
            },
            {
                op: "COMMIT",
                sub: "UNLOCK B",
                before: 1,
                after: 0,
                tone: "rose",
                statusText: "Horari fora de PR2F · pot generar cicles al graf de precedències",
            },
        ],
        properties: {
            serializable: false,
            noDirtyRead: false,
            recoverable: false,
        },
    },
];

function buildAreaPath(steps: PhaseStep[]): string {
    const parts: string[] = [`M ${X_START},${Y_LEVELS[0]}`];
    steps.forEach((step, idx) => {
        const x = X_STEPS[idx];
        const nextX = idx < steps.length - 1 ? X_STEPS[idx + 1] : X_END;
        parts.push(`L ${x},${Y_LEVELS[step.before]}`);
        if (step.before !== step.after) {
            parts.push(`L ${x},${Y_LEVELS[step.after]}`);
        }
        parts.push(`L ${nextX},${Y_LEVELS[step.after]}`);
    });
    parts.push(`L ${X_END},${Y_LEVELS[0]} Z`);
    return parts.join(" ");
}

/**
 * Interactive minimalist phase-curve visualizer for Two-Phase Locking (PR2F),
 * Strong Strict PR2F, and PR2F violations.
 */
export default function TwoPhaseLockVisualizer() {
    const [protocolId, setProtocolId] = useState<ProtocolId>("pr2f");
    const [stepIndex, setStepIndex] = useState<number>(2);

    const protocol = PROTOCOLS.find((p) => p.id === protocolId) || PROTOCOLS[0];
    const activeStep = protocol.steps[stepIndex] || protocol.steps[0];
    const areaPath = buildAreaPath(protocol.steps);
    const gradientId = `pr2f-area-${protocol.id}`;

    const propertyPills = [
        { label: "Serialitzable", ok: protocol.properties.serializable },
        { label: "Sense lectura bruta", ok: protocol.properties.noDirtyRead },
        { label: "Recuperable", ok: protocol.properties.recoverable },
    ];

    return (
        <div className="w-full max-w-xl mx-auto my-6 not-prose select-none font-mono text-xs">
            {/* Selector de variant */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pb-4">
                {PROTOCOLS.map((item) => {
                    const isSelected = item.id === protocolId;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                                setProtocolId(item.id);
                                setStepIndex(item.defaultStep);
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

            {/* Capçalera minimalista de la corba */}
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold tracking-wider px-1 pb-1">
                <span>RESERVES ACTIVES</span>
                <span className="text-slate-600">TEMPS →</span>
            </div>

            {/* Gràfic SVG esglaonat de fases */}
            <div className="relative w-full">
                <svg
                    viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                    className="w-full h-auto overflow-visible"
                >
                    <defs>
                        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={TONE_HEX[protocol.tone]} stopOpacity="0.22" />
                            <stop offset="100%" stopColor={TONE_HEX[protocol.tone]} stopOpacity="0.02" />
                        </linearGradient>
                    </defs>

                    {/* Línies guia horitzontals (0, 1, 2 reserves) */}
                    {([0, 1, 2] as const).map((lvl) => (
                        <g key={lvl}>
                            <line
                                x1={X_START}
                                y1={Y_LEVELS[lvl]}
                                x2={X_END}
                                y2={Y_LEVELS[lvl]}
                                stroke={lvl === 0 ? "#334155" : "#1e293b"}
                                strokeWidth={lvl === 0 ? 1.2 : 1}
                                strokeDasharray={lvl === 0 ? undefined : "3 3"}
                            />
                            <text
                                x={6}
                                y={Y_LEVELS[lvl] + 3}
                                textAnchor="middle"
                                fill="#475569"
                                fontSize="9"
                            >
                                {lvl}
                            </text>
                        </g>
                    ))}

                    {/* Anotacions de fase subtils */}
                    {protocol.phaseAnnotation.map((note) => (
                        <text
                            key={note.text}
                            x={note.x}
                            y={11}
                            textAnchor="middle"
                            fill={TONE_HEX[note.tone]}
                            fontSize="8.5"
                            fontWeight="bold"
                            opacity={0.75}
                        >
                            {note.text}
                        </text>
                    ))}

                    {/* Àrea suau sota la corba */}
                    <path d={areaPath} fill={`url(#${gradientId})`} />

                    {/* Segment inicial fins a t1 */}
                    <line
                        x1={X_START}
                        y1={Y_LEVELS[0]}
                        x2={X_STEPS[0]}
                        y2={Y_LEVELS[0]}
                        stroke="#475569"
                        strokeWidth="1.75"
                    />

                    {/* Segments esglaonats acolorits per fase */}
                    {protocol.steps.map((step, idx) => {
                        const x = X_STEPS[idx];
                        const nextX = idx < protocol.steps.length - 1 ? X_STEPS[idx + 1] : X_END;
                        const yBefore = Y_LEVELS[step.before];
                        const yAfter = Y_LEVELS[step.after];
                        const stroke = TONE_HEX[step.tone];
                        const isSelected = stepIndex === idx;

                        const segPath =
                            step.before !== step.after
                                ? `M ${x},${yBefore} L ${x},${yAfter} L ${nextX},${yAfter}`
                                : `M ${x},${yAfter} L ${nextX},${yAfter}`;

                        return (
                            <g key={`${protocol.id}-seg-${idx}`}>
                                {/* Guia vertical subtil al pas actiu */}
                                {isSelected && (
                                    <line
                                        x1={x}
                                        y1={16}
                                        x2={x}
                                        y2={Y_LEVELS[0]}
                                        stroke={stroke}
                                        strokeWidth="1"
                                        strokeDasharray="2 3"
                                        strokeOpacity={0.45}
                                    />
                                )}

                                <path
                                    d={segPath}
                                    fill="none"
                                    stroke={stroke}
                                    strokeWidth={isSelected ? 2.6 : 1.9}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="transition-all duration-150"
                                />

                                {/* Node interactiu al punt d'operació */}
                                <circle
                                    cx={x}
                                    cy={yAfter}
                                    r={isSelected ? 4.5 : 3}
                                    fill={isSelected ? "#020617" : stroke}
                                    stroke={stroke}
                                    strokeWidth={isSelected ? 2.2 : 1}
                                    className="transition-all duration-150"
                                />

                                {/* Micro-badge sobre transicions clau */}
                                {step.badge && (
                                    <g transform={`translate(${x}, ${(yBefore + yAfter) / 2})`}>
                                        <rect
                                            x="-8"
                                            y="-7"
                                            width="16"
                                            height="14"
                                            rx="3.5"
                                            fill="#020617"
                                            stroke={stroke}
                                            strokeWidth="1"
                                        />
                                        <text
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            y="0.5"
                                            fill={stroke}
                                            fontSize="8.5"
                                            fontWeight="bold"
                                        >
                                            {step.badge}
                                        </text>
                                    </g>
                                )}

                                {/* Àrea interactiva transparent per fer hover/clic directament al gràfic */}
                                <rect
                                    x={idx === 0 ? X_START : x - 45}
                                    y={0}
                                    width={idx === 0 ? 50 + 45 - X_START : idx === protocol.steps.length - 1 ? X_END - (x - 45) : 90}
                                    height={SVG_H}
                                    fill="transparent"
                                    className="cursor-pointer"
                                    onMouseEnter={() => setStepIndex(idx)}
                                    onClick={() => setStepIndex(idx)}
                                />
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* 5 botons alineats sota X_STEPS = [50, 150, 250, 350, 450] */}
            <div className="grid grid-cols-5 mt-1">
                {protocol.steps.map((step, idx) => {
                    const isSelected = stepIndex === idx;
                    return (
                        <div key={`${protocol.id}-btn-${idx}`} className="px-0.5">
                            <button
                                type="button"
                                onMouseEnter={() => setStepIndex(idx)}
                                onClick={() => setStepIndex(idx)}
                                className={`w-full py-1.5 px-1 rounded-lg border text-center transition-all duration-150 cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                                    isSelected
                                        ? TONE_STEP_ACTIVE[step.tone]
                                        : "bg-slate-900/40 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/15"
                                }`}
                            >
                                <span className="text-[9.5px] sm:text-[10.5px] font-semibold truncate max-w-full leading-tight">
                                    {step.op}
                                </span>
                                {step.sub && (
                                    <span className="text-[8.5px] opacity-65 truncate max-w-full leading-none">
                                        {step.sub}
                                    </span>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Resum del pas seleccionat */}
            <div className="mt-3 flex justify-center">
                <div
                    className={`px-3 py-1 rounded-lg border text-[11px] text-center transition-colors ${TONE_PILL[activeStep.tone]}`}
                >
                    {activeStep.statusText}
                </div>
            </div>

            {/* Propietats garantides */}
            <div className="mt-2.5 grid grid-cols-3 gap-1.5">
                {propertyPills.map((prop) => (
                    <div
                        key={prop.label}
                        className={`px-2 py-1 rounded-md border flex items-center justify-between text-[9.5px] sm:text-[10px] transition-colors ${
                            prop.ok
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                                : "bg-rose-500/10 border-rose-500/30 text-rose-300/85"
                        }`}
                    >
                        <span className="truncate">{prop.label}</span>
                        <span className="font-bold ml-1 shrink-0">{prop.ok ? "✓" : "✕"}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
