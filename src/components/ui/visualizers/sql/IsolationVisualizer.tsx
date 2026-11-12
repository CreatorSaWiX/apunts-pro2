"use client";

import { useState } from "react";

type LevelIdx = 0 | 1 | 2 | 3;
type TrackId = "S" | "X" | "IC";

interface IsolationLevelConfig {
    idx: LevelIdx;
    label: string;
    shortLabel: string;
    activeClass: string;
}

interface InterferenceChip {
    id: string;
    label: string;
    minLevelIdx: LevelIdx;
    track: TrackId;
}

const LEVELS: IsolationLevelConfig[] = [
    {
        idx: 0,
        label: "READ UNCOMMITTED",
        shortLabel: "READ UNCOMMITTED",
        activeClass: "bg-rose-500/15 border-rose-400 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)] font-semibold",
    },
    {
        idx: 1,
        label: "READ COMMITTED",
        shortLabel: "READ COMMITTED",
        activeClass: "bg-sky-500/15 border-sky-400 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.2)] font-semibold",
    },
    {
        idx: 2,
        label: "REPEATABLE READ",
        shortLabel: "REPEATABLE READ",
        activeClass: "bg-amber-500/15 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)] font-semibold",
    },
    {
        idx: 3,
        label: "SERIALIZABLE",
        shortLabel: "SERIALIZABLE",
        activeClass: "bg-emerald-500/15 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)] font-semibold",
    },
];

const INTERFERENCES: InterferenceChip[] = [
    { id: "lost", label: "Act. perduda", minLevelIdx: 0, track: "X" },
    { id: "dirty", label: "No confirmada", minLevelIdx: 1, track: "S" },
    { id: "nonrep", label: "No repetible", minLevelIdx: 2, track: "S" },
    { id: "incons", label: "Anàlisi incons.", minLevelIdx: 2, track: "S" },
    { id: "phantom", label: "Fantasmes", minLevelIdx: 3, track: "IC" },
];

const MILESTONES = [
    { x: 76, label: "R(A)" },
    { x: 166, label: "SELECT IC" },
    { x: 256, label: "RU/W(B)" },
    { x: 356, label: "COMMIT" },
];

export default function IsolationVisualizer() {
    const [levelIdx, setLevelIdx] = useState<LevelIdx>(1);
    const [hoveredTrack, setHoveredTrack] = useState<TrackId | null>(null);

    const sWidth = levelIdx === 0 ? 0 : levelIdx === 1 ? 46 : 280;
    const sActive = levelIdx > 0;
    const sFillsToCommit = levelIdx >= 2;
    const icActive = levelIdx === 3;

    const getTrackOpacity = (track: TrackId) =>
        hoveredTrack !== null && hoveredTrack !== track ? 0.25 : 1;

    return (
        <div className="w-full max-w-xl mx-auto my-6 not-prose select-none font-mono text-xs">
            {/* Selector minimalista dels 4 nivells d'aïllament */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pb-4">
                {LEVELS.map((lvl) => {
                    const isSelected = lvl.idx === levelIdx;
                    return (
                        <button
                            key={lvl.idx}
                            type="button"
                            onClick={() => setLevelIdx(lvl.idx)}
                            className={`px-2 py-1 rounded-md border text-[10px] sm:text-[11px] transition-all duration-150 cursor-pointer ${
                                isSelected
                                    ? lvl.activeClass
                                    : "bg-slate-900/30 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10"
                            }`}
                        >
                            {lvl.shortLabel}
                        </button>
                    );
                })}
            </div>

            {/* Línia temporal SVG de durada de reserves (S, X, IC) */}
            <div className="w-full">
                <svg
                    viewBox="0 0 380 124"
                    className="w-full h-auto overflow-visible"
                >
                    {/* Fites verticals de la transacció */}
                    {MILESTONES.map((m) => (
                        <g key={m.label}>
                            <text
                                x={m.x}
                                y="12"
                                textAnchor="middle"
                                fill={m.label === "COMMIT" ? "#94a3b8" : "#64748b"}
                                fontSize="9"
                                fontWeight={m.label === "COMMIT" ? "bold" : "normal"}
                            >
                                {m.label}
                            </text>
                            <line
                                x1={m.x}
                                y1="20"
                                x2={m.x}
                                y2="116"
                                stroke={m.label === "COMMIT" ? "#334155" : "#1e293b"}
                                strokeWidth="1"
                                strokeDasharray={m.label === "COMMIT" ? undefined : "2 3"}
                            />
                        </g>
                    ))}

                    {/* TRACK 1: LOCK(S) — Lectures */}
                    <g
                        style={{ opacity: getTrackOpacity("S") }}
                        className="transition-opacity duration-200"
                    >
                        <rect
                            x="4"
                            y="34"
                            width="54"
                            height="18"
                            rx="5"
                            fill="#0c1a2e"
                            stroke={sActive ? "#38bdf8" : "#334155"}
                            strokeWidth="1"
                        />
                        <text
                            x="31"
                            y="43.5"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill={sActive ? "#7dd3fc" : "#64748b"}
                            fontSize="9"
                            fontWeight="bold"
                        >
                            S · R(G)
                        </text>

                        {/* Línia base discontínua */}
                        <line
                            x1="76"
                            y1="43"
                            x2="356"
                            y2="43"
                            stroke="#334155"
                            strokeWidth="1.2"
                            strokeDasharray="3 3"
                        />

                        {/* Barra de durada de LOCK(S) */}
                        <rect
                            x="76"
                            y="34"
                            width={sWidth}
                            height="18"
                            rx="5"
                            fill="#0ea5e9"
                            fillOpacity={sActive ? 0.18 : 0}
                            stroke="#38bdf8"
                            strokeOpacity={sActive ? 0.9 : 0}
                            strokeWidth="1.3"
                            className="transition-all duration-300"
                        />

                        {levelIdx === 0 && (
                            <text
                                x="216"
                                y="43.5"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="#64748b"
                                fontSize="8.5"
                            >
                                sense LOCK(S)
                            </text>
                        )}

                        {levelIdx === 1 && (
                            <>
                                <text
                                    x="99"
                                    y="43.5"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill="#bae6fd"
                                    fontSize="8.5"
                                    fontWeight="bold"
                                >
                                    S
                                </text>
                                <circle cx="122" cy="43" r="2.5" fill="#38bdf8" />
                                <text
                                    x="128"
                                    y="43.5"
                                    textAnchor="start"
                                    dominantBaseline="middle"
                                    fill="#38bdf8"
                                    fillOpacity="0.8"
                                    fontSize="8"
                                >
                                    UNLOCK
                                </text>
                            </>
                        )}

                        {sFillsToCommit && (
                            <>
                                <text
                                    x="216"
                                    y="43.5"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill="#bae6fd"
                                    fontSize="8.5"
                                    fontWeight="bold"
                                >
                                    LOCK(S) · fins COMMIT
                                </text>
                                <circle cx="356" cy="43" r="2.5" fill="#38bdf8" />
                            </>
                        )}
                    </g>

                    {/* TRACK 2: LOCK(X) — Escriptures */}
                    <g
                        style={{ opacity: getTrackOpacity("X") }}
                        className="transition-opacity duration-200"
                    >
                        <rect
                            x="4"
                            y="64"
                            width="54"
                            height="18"
                            rx="5"
                            fill="#181206"
                            stroke="#f59e0b"
                            strokeWidth="1"
                        />
                        <text
                            x="31"
                            y="73.5"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#fcd34d"
                            fontSize="9"
                            fontWeight="bold"
                        >
                            X · W(G)
                        </text>

                        <line
                            x1="76"
                            y1="73"
                            x2="256"
                            y2="73"
                            stroke="#1e293b"
                            strokeWidth="1"
                            strokeDasharray="2 3"
                        />

                        <rect
                            x="256"
                            y="64"
                            width="100"
                            height="18"
                            rx="5"
                            fill="#f59e0b"
                            fillOpacity="0.18"
                            stroke="#f59e0b"
                            strokeOpacity="0.9"
                            strokeWidth="1.3"
                        />
                        <text
                            x="306"
                            y="73.5"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#fde68a"
                            fontSize="8.5"
                            fontWeight="bold"
                        >
                            LOCK(X)
                        </text>
                        <circle cx="356" cy="73" r="2.5" fill="#f59e0b" />
                    </g>

                    {/* TRACK 3: LOCK(IC) — Informació de Control */}
                    <g
                        style={{ opacity: getTrackOpacity("IC") }}
                        className="transition-opacity duration-200"
                    >
                        <rect
                            x="4"
                            y="94"
                            width="54"
                            height="18"
                            rx="5"
                            fill="#061e14"
                            stroke={icActive ? "#10b981" : "#334155"}
                            strokeWidth="1"
                        />
                        <text
                            x="31"
                            y="103.5"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill={icActive ? "#6ee7b7" : "#64748b"}
                            fontSize="9"
                            fontWeight="bold"
                        >
                            IC · rang
                        </text>

                        <line
                            x1="76"
                            y1="103"
                            x2="166"
                            y2="103"
                            stroke="#1e293b"
                            strokeWidth="1"
                            strokeDasharray="2 3"
                        />

                        <line
                            x1="166"
                            y1="103"
                            x2="356"
                            y2="103"
                            stroke="#334155"
                            strokeWidth="1.2"
                            strokeDasharray="3 3"
                        />

                        <rect
                            x="166"
                            y="94"
                            width={icActive ? 190 : 0}
                            height="18"
                            rx="5"
                            fill="#10b981"
                            fillOpacity={icActive ? 0.18 : 0}
                            stroke="#10b981"
                            strokeOpacity={icActive ? 0.9 : 0}
                            strokeWidth="1.3"
                            className="transition-all duration-300"
                        />

                        {icActive ? (
                            <>
                                <text
                                    x="261"
                                    y="103.5"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill="#a7f3d0"
                                    fontSize="8.5"
                                    fontWeight="bold"
                                >
                                    LOCK(IC) · fins COMMIT
                                </text>
                                <circle cx="356" cy="103" r="2.5" fill="#10b981" />
                            </>
                        ) : (
                            <text
                                x="261"
                                y="103.5"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="#64748b"
                                fontSize="8.5"
                            >
                                sense LOCK(IC)
                            </text>
                        )}
                    </g>
                </svg>
            </div>

            {/* Escut d'interferències evitades vs possibles */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
                {INTERFERENCES.map((item) => {
                    const isAvoided = levelIdx >= item.minLevelIdx;
                    return (
                        <div
                            key={item.id}
                            onMouseEnter={() => setHoveredTrack(item.track)}
                            onMouseLeave={() => setHoveredTrack(null)}
                            className={`px-2 py-1 rounded-md border text-[10px] flex items-center gap-1.5 transition-all duration-150 cursor-default ${
                                isAvoided
                                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                                    : "bg-rose-500/10 border-rose-500/25 text-rose-300/80"
                            }`}
                        >
                            <span className="font-bold">{isAvoided ? "✓" : "✕"}</span>
                            <span>{item.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
