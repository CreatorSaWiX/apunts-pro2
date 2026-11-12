"use client";

import { useState } from "react";

type ModeId = "restore" | "rebuild";
type RestoreStepId = 0 | 1 | 2;
type BackupKind = "full" | "incremental";
type Tone = "sky" | "amber" | "emerald" | "rose" | "violet";

interface RestoreStepConfig {
    id: RestoreStepId;
    label: string;
    tone: Tone;
    diskA: { display: string; sub: string; tone: Tone | "neutral" };
    diskB: { display: string; sub: string; tone: Tone | "neutral" };
    showUndo: boolean;
    showRedo: boolean;
    statusText: string;
    statusTone: Tone;
}

interface BackupSourceItem {
    id: string;
    title: string;
    payload: string;
    tone: Tone;
    dashed?: boolean;
}

// Geometria exacta per alinear corbes SVG amb files fixes (Restauració: h-9 = 36px, gap = 8px)
const RESTORE_ROW_H = 36;
const RESTORE_GAP = 8;
const RESTORE_TOTAL_H = 4 * RESTORE_ROW_H + 3 * RESTORE_GAP; // 168px
const DISK_GAP = 16;
const DISK_OFFSET = (RESTORE_TOTAL_H - (2 * RESTORE_ROW_H + DISK_GAP)) / 2; // 40px

const getYLog = (idx: number) => idx * (RESTORE_ROW_H + RESTORE_GAP) + RESTORE_ROW_H / 2;
const getYDisk = (idx: number) => DISK_OFFSET + idx * (RESTORE_ROW_H + DISK_GAP) + RESTORE_ROW_H / 2;

// Geometria exacta per a Reconstrucció (files de 40px + gap 8px -> target de 56px centrat)
const REBUILD_ROW_H = 40;
const REBUILD_GAP = 8;
const REBUILD_TARGET_H = 56;
const SVG_W = 64;

const RESTORE_STEPS: RestoreStepConfig[] = [
    {
        id: 0,
        label: "1. ⚡ Caiguda",
        tone: "rose",
        diskA: { display: "A = 10", sub: "no escrit a disc", tone: "amber" },
        diskB: { display: "B = 80*", sub: "pàgina bruta", tone: "rose" },
        showUndo: false,
        showRedo: false,
        statusText: "⚡ Fallada: T₁ havia confirmat (COMMIT) · T₂ seguia activa",
        statusTone: "rose",
    },
    {
        id: 1,
        label: "2. ↺ UNDO (T₂)",
        tone: "sky",
        diskA: { display: "A = 10", sub: "pendent REDO", tone: "amber" },
        diskB: { display: "B = 80 ↺ 20", sub: "desfà T₂", tone: "sky" },
        showUndo: true,
        showRedo: false,
        statusText: "Cap enrere (UNDO): desfà T₂ sense COMMIT → Atomicitat (A)",
        statusTone: "sky",
    },
    {
        id: 2,
        label: "3. → REDO (T₁)",
        tone: "emerald",
        diskA: { display: "A = 10 → 50 ✓", sub: "refà T₁", tone: "emerald" },
        diskB: { display: "B = 20 ✓", sub: "T₂ revertida", tone: "sky" },
        showUndo: true,
        showRedo: true,
        statusText: "Cap endavant (REDO): refà T₁ confirmada → Definitivitat (D)",
        statusTone: "emerald",
    },
];

const LOG_ENTRIES: { id: number; tx: "T1" | "T2" | "CRASH"; text: string; target?: "A" | "B" }[] = [
    { id: 0, tx: "T1", text: "A: 10 → 50", target: "A" },
    { id: 1, tx: "T1", text: "COMMIT ✓", target: "A" },
    { id: 2, tx: "T2", text: "B: 20 → 80", target: "B" },
    { id: 3, tx: "CRASH", text: "⚡ Caiguda sistema" },
];

const BACKUP_CONFIGS: Record<
    BackupKind,
    {
        label: string;
        sources: BackupSourceItem[];
        result: string;
        statusText: string;
    }
> = {
    full: {
        label: "Completa",
        sources: [
            { id: "full", title: "Còpia completa (t₀)", payload: "A: 10 · B: 20", tone: "sky" },
            { id: "log", title: "Dietari (> t₀)", payload: "T₁: A←50 ✓", tone: "emerald", dashed: true },
        ],
        result: "A = 50 · B = 20 ✓",
        statusText: "Còpia completa (t₀) + dietari posterior → disc reconstruït",
    },
    incremental: {
        label: "Incremental",
        sources: [
            { id: "base", title: "Còpia base (t₀)", payload: "A: 10 · B: 20", tone: "sky" },
            { id: "inc", title: "Incremental (t₁)", payload: "+ Δ A: 30", tone: "amber" },
            { id: "log", title: "Dietari (> t₁)", payload: "T₂: B←40 ✓", tone: "emerald", dashed: true },
        ],
        result: "A = 30 · B = 40 ✓",
        statusText: "Base (t₀) + incremental (t₁) + dietari (> t₁) → disc reconstruït",
    },
};

const TONE_HEX: Record<Tone, string> = {
    sky: "#38bdf8",
    amber: "#f59e0b",
    emerald: "#10b981",
    rose: "#f43f5e",
    violet: "#a78bfa",
};

const TONE_CARD: Record<Tone | "neutral", string> = {
    sky: "bg-sky-500/15 border-sky-400/75 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.18)]",
    amber: "bg-amber-500/15 border-amber-400/75 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.18)]",
    emerald: "bg-emerald-500/15 border-emerald-400/75 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.18)]",
    rose: "bg-rose-500/15 border-rose-500/75 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.2)]",
    violet: "bg-violet-500/15 border-violet-400/75 text-violet-200 shadow-[0_0_12px_rgba(167,139,250,0.2)]",
    neutral: "bg-slate-900/40 border-white/10 text-slate-300",
};

const TONE_PILL: Record<Tone, string> = {
    sky: "bg-sky-500/10 border-sky-500/30 text-sky-300",
    amber: "bg-amber-500/10 border-amber-500/30 text-amber-300",
    emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    rose: "bg-rose-500/10 border-rose-500/30 text-rose-300",
    violet: "bg-violet-500/10 border-violet-500/30 text-violet-300",
};

export default function LogRecoveryVisualizer() {
    const [mode, setMode] = useState<ModeId>("restore");
    const [stepIdx, setStepIdx] = useState<RestoreStepId>(2);
    const [hoveredTarget, setHoveredTarget] = useState<"A" | "B" | null>(null);
    const [backupKind, setBackupKind] = useState<BackupKind>("full");
    const [hoveredSourceId, setHoveredSourceId] = useState<string | null>(null);

    const step = RESTORE_STEPS[stepIdx];
    const backup = BACKUP_CONFIGS[backupKind];
    const rebuildTotalH =
        backup.sources.length * REBUILD_ROW_H + (backup.sources.length - 1) * REBUILD_GAP;
    const rebuildOffsetRight = (rebuildTotalH - REBUILD_TARGET_H) / 2;
    const rebuildTargetY = rebuildTotalH / 2;

    return (
        <div className="w-full max-w-xl mx-auto my-6 not-prose select-none font-mono text-xs">
            {/* Selector principal: Restauració (Log) vs Reconstrucció (Còpia + Log) */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pb-3">
                <button
                    type="button"
                    onClick={() => {
                        setMode("restore");
                        setHoveredSourceId(null);
                    }}
                    className={`px-2.5 py-1 rounded-md border text-[11px] transition-all duration-150 cursor-pointer ${
                        mode === "restore"
                            ? "bg-emerald-500/15 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)] font-semibold"
                            : "bg-slate-900/30 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10"
                    }`}
                >
                    RESTAURACIÓ (LOG)
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setMode("rebuild");
                        setHoveredTarget(null);
                    }}
                    className={`px-2.5 py-1 rounded-md border text-[11px] transition-all duration-150 cursor-pointer ${
                        mode === "rebuild"
                            ? "bg-sky-500/15 border-sky-400 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.2)] font-semibold"
                            : "bg-slate-900/30 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10"
                    }`}
                >
                    RECONSTRUCCIÓ (DISC)
                </button>
            </div>

            {mode === "restore" ? (
                <>
                    {/* Passos de recuperació: Caiguda -> UNDO -> REDO */}
                    <div className="grid grid-cols-3 gap-1.5 pb-4">
                        {RESTORE_STEPS.map((item) => {
                            const isSelected = item.id === stepIdx;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onMouseEnter={() => setStepIdx(item.id)}
                                    onClick={() => setStepIdx(item.id)}
                                    className={`px-2 py-1.5 rounded-lg border text-[10px] sm:text-[11px] text-center transition-all duration-150 cursor-pointer truncate ${
                                        isSelected
                                            ? TONE_CARD[item.tone]
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
                        style={{ gridTemplateColumns: "1.2fr 64px 1fr" }}
                    >
                        <span>DIETARI (LOG)</span>
                        <span />
                        <span className="text-right">DISC</span>
                    </div>

                    {/* Cos: Dietari (esquerra) + Corbes UNDO/REDO (centre) + Disc (dreta) */}
                    <div
                        className="relative grid items-start"
                        style={{ gridTemplateColumns: "1.2fr 64px 1fr" }}
                    >
                        {/* Entrades del dietari */}
                        <div className="flex flex-col gap-2">
                            {LOG_ENTRIES.map((entry) => {
                                const isCrash = entry.tx === "CRASH";
                                const isDimmed =
                                    hoveredTarget !== null && entry.target !== hoveredTarget;

                                let cardClass = "bg-slate-900/40 border-white/10 text-slate-300";
                                if (isCrash) {
                                    cardClass = TONE_CARD.rose;
                                } else if (isDimmed) {
                                    cardClass = "bg-slate-900/20 border-white/5 text-slate-600 opacity-30";
                                } else if (entry.tx === "T1" && step.showRedo) {
                                    cardClass = TONE_CARD.emerald;
                                } else if (entry.tx === "T2" && step.showUndo) {
                                    cardClass = TONE_CARD.sky;
                                } else if (entry.tx === "T1") {
                                    cardClass = "bg-emerald-500/10 border-emerald-500/30 text-emerald-300";
                                } else if (entry.tx === "T2") {
                                    cardClass = "bg-amber-500/10 border-amber-500/30 text-amber-200";
                                }

                                return (
                                    <button
                                        key={entry.id}
                                        type="button"
                                        disabled={!entry.target}
                                        onMouseEnter={
                                            entry.target ? () => setHoveredTarget(entry.target!) : undefined
                                        }
                                        onMouseLeave={
                                            entry.target ? () => setHoveredTarget(null) : undefined
                                        }
                                        onClick={
                                            entry.target
                                                ? () =>
                                                      setHoveredTarget((curr) =>
                                                          curr === entry.target ? null : entry.target!
                                                      )
                                                : undefined
                                        }
                                        className={`h-9 px-2.5 rounded-lg border flex items-center justify-between gap-1.5 text-left transition-all duration-150 ${
                                            entry.target ? "cursor-pointer" : "cursor-default"
                                        } ${cardClass}`}
                                    >
                                        <span className="truncate text-[11px]">
                                            {!isCrash && (
                                                <strong className="mr-1.5 opacity-80">
                                                    {entry.tx === "T1" ? "T₁" : "T₂"}
                                                </strong>
                                            )}
                                            {entry.text}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Connexions SVG (REDO cap endavant / UNDO cap enrere) */}
                        <svg
                            viewBox={`0 0 ${SVG_W} ${RESTORE_TOTAL_H}`}
                            style={{ height: RESTORE_TOTAL_H }}
                            className="w-full pointer-events-none overflow-visible"
                        >
                            {/* T1 (REDO) -> Disc A */}
                            {(() => {
                                const y1 = getYLog(0);
                                const y2 = getYDisk(0);
                                const isActive = step.showRedo;
                                const isDimmed = hoveredTarget === "B";
                                const color = isActive ? TONE_HEX.emerald : "#475569";
                                const opacity = isDimmed ? 0.18 : isActive ? 0.95 : 0.35;

                                return (
                                    <g opacity={opacity} className="transition-opacity duration-200">
                                        <path
                                            d={`M 0,${y1} C 32,${y1} 32,${y2} ${SVG_W},${y2}`}
                                            fill="none"
                                            stroke={color}
                                            strokeWidth={isActive ? 2 : 1.3}
                                            strokeDasharray={isActive ? undefined : "3 3"}
                                        />
                                        {isActive && (
                                            <g transform={`translate(32, ${(y1 + y2) / 2})`}>
                                                <rect
                                                    x="-18"
                                                    y="-8"
                                                    width="36"
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
                                                    REDO →
                                                </text>
                                            </g>
                                        )}
                                    </g>
                                );
                            })()}

                            {/* T2 (UNDO) -> Disc B */}
                            {(() => {
                                const y1 = getYLog(2);
                                const y2 = getYDisk(1);
                                const isActive = step.showUndo;
                                const isDimmed = hoveredTarget === "A";
                                const color = isActive ? TONE_HEX.sky : "#f43f5e";
                                const opacity = isDimmed ? 0.18 : isActive ? 0.95 : 0.4;

                                return (
                                    <g opacity={opacity} className="transition-opacity duration-200">
                                        <path
                                            d={`M 0,${y1} C 32,${y1} 32,${y2} ${SVG_W},${y2}`}
                                            fill="none"
                                            stroke={color}
                                            strokeWidth={isActive ? 2 : 1.3}
                                            strokeDasharray="3 3"
                                        />
                                        {isActive && (
                                            <g transform={`translate(32, ${(y1 + y2) / 2})`}>
                                                <rect
                                                    x="-18"
                                                    y="-8"
                                                    width="36"
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
                                                    ← UNDO
                                                </text>
                                            </g>
                                        )}
                                    </g>
                                );
                            })()}
                        </svg>

                        {/* Estat del disc per a A i B */}
                        <div
                            className="flex flex-col gap-4"
                            style={{ paddingTop: `${DISK_OFFSET}px`, paddingBottom: `${DISK_OFFSET}px` }}
                        >
                            {(
                                [
                                    { id: "A" as const, data: step.diskA },
                                    { id: "B" as const, data: step.diskB },
                                ] as const
                            ).map(({ id, data }) => {
                                const isDimmed = hoveredTarget !== null && hoveredTarget !== id;
                                return (
                                    <button
                                        key={id}
                                        type="button"
                                        onMouseEnter={() => setHoveredTarget(id)}
                                        onMouseLeave={() => setHoveredTarget(null)}
                                        onClick={() =>
                                            setHoveredTarget((curr) => (curr === id ? null : id))
                                        }
                                        className={`h-9 px-2.5 rounded-lg border flex items-center justify-between gap-1 text-left transition-all duration-150 cursor-pointer ${
                                            isDimmed
                                                ? "bg-slate-900/20 border-white/5 text-slate-600 opacity-30"
                                                : TONE_CARD[data.tone]
                                        }`}
                                    >
                                        <span className="font-bold text-[11px] tabular-nums truncate">
                                            {data.display}
                                        </span>
                                        <span className="text-[9px] opacity-70 hidden sm:inline shrink-0">
                                            {data.sub}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Resum de restauració en 1 línia */}
                    <div className="mt-3 flex justify-center">
                        <div
                            className={`px-3 py-1 rounded-lg border text-[11px] transition-colors ${TONE_PILL[step.statusTone]}`}
                        >
                            {step.statusText}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* Selector Completa vs Incremental */}
                    <div className="flex items-center justify-center gap-1.5 pb-4">
                        {(["full", "incremental"] as BackupKind[]).map((kind) => {
                            const isSelected = backupKind === kind;
                            return (
                                <button
                                    key={kind}
                                    type="button"
                                    onClick={() => {
                                        setBackupKind(kind);
                                        setHoveredSourceId(null);
                                    }}
                                    className={`px-2.5 py-1 rounded-md border text-[10px] transition-all duration-150 cursor-pointer ${
                                        isSelected
                                            ? "bg-sky-500/15 border-sky-400 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.2)] font-semibold"
                                            : "bg-slate-900/30 border-white/5 text-slate-400 hover:text-slate-200"
                                    }`}
                                >
                                    Còpia {BACKUP_CONFIGS[kind].label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Capçaleres */}
                    <div
                        className="grid items-center text-[10px] text-slate-500 font-semibold tracking-wider pb-2"
                        style={{ gridTemplateColumns: "1.2fr 64px 1fr" }}
                    >
                        <span>CÒPIA + DIETARI</span>
                        <span />
                        <span className="text-right">DISC RECONSTRUÏT</span>
                    </div>

                    {/* Cos de convergència cap al disc reconstruït */}
                    <div
                        className="relative grid items-start"
                        style={{ gridTemplateColumns: "1.2fr 64px 1fr" }}
                    >
                        <div className="flex flex-col gap-2">
                            {backup.sources.map((src) => {
                                const isHovered = hoveredSourceId === src.id;
                                const isDimmed = hoveredSourceId !== null && !isHovered;
                                return (
                                    <button
                                        key={`${backupKind}-${src.id}`}
                                        type="button"
                                        onMouseEnter={() => setHoveredSourceId(src.id)}
                                        onMouseLeave={() => setHoveredSourceId(null)}
                                        onClick={() =>
                                            setHoveredSourceId((curr) => (curr === src.id ? null : src.id))
                                        }
                                        className={`h-10 px-2.5 rounded-lg border flex items-center justify-between gap-2 text-left transition-all duration-150 cursor-pointer ${
                                            src.dashed ? "border-dashed" : ""
                                        } ${
                                            isDimmed
                                                ? "bg-slate-900/20 border-white/5 text-slate-600 opacity-30"
                                                : TONE_CARD[src.tone]
                                        }`}
                                    >
                                        <span className="text-[11px] font-semibold truncate">
                                            {src.title}
                                        </span>
                                        <span className="text-[10px] opacity-80 shrink-0 tabular-nums">
                                            {src.payload}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Corbes SVG cap al disc reconstruït */}
                        <svg
                            viewBox={`0 0 ${SVG_W} ${rebuildTotalH}`}
                            style={{ height: rebuildTotalH }}
                            className="w-full pointer-events-none overflow-visible"
                        >
                            {backup.sources.map((src, idx) => {
                                const y1 = idx * (REBUILD_ROW_H + REBUILD_GAP) + REBUILD_ROW_H / 2;
                                const y2 = rebuildTargetY;
                                const isHovered = hoveredSourceId === src.id;
                                const isDimmed = hoveredSourceId !== null && !isHovered;

                                return (
                                    <path
                                        key={`${backupKind}-edge-${src.id}`}
                                        d={`M 0,${y1} C 32,${y1} 32,${y2} ${SVG_W},${y2}`}
                                        fill="none"
                                        stroke={isDimmed ? "#334155" : TONE_HEX[src.tone]}
                                        strokeWidth={isHovered ? 2.4 : 1.75}
                                        strokeOpacity={isDimmed ? 0.2 : isHovered ? 1 : 0.8}
                                        strokeDasharray={src.dashed ? "3 3" : undefined}
                                        className="transition-all duration-150"
                                    />
                                );
                            })}
                        </svg>

                        {/* Disc reconstruït */}
                        <div
                            style={{
                                paddingTop: `${rebuildOffsetRight}px`,
                                paddingBottom: `${rebuildOffsetRight}px`,
                            }}
                        >
                            <div
                                className={`h-14 px-3 rounded-xl border flex flex-col justify-center gap-0.5 ${TONE_CARD.emerald}`}
                            >
                                <span className="text-[10px] opacity-75">Estat recuperat</span>
                                <span className="text-[11px] font-bold tabular-nums truncate">
                                    {backup.result}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 flex justify-center">
                        <div className={`px-3 py-1 rounded-lg border text-[11px] ${TONE_PILL.sky}`}>
                            {backup.statusText}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
