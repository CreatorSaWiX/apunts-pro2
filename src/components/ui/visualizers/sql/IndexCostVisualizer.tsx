"use client";

import { useState } from "react";

type AccessMode = "clustered" | "unclustered" | "index_only" | "seq";
type Tone = "emerald" | "amber" | "sky" | "rose";

interface LeafEntry {
    id: number;
    keyLabel: string;
    ridLabel: string;
    targetPage: 0 | 1 | 2 | 3;
}

interface DataPage {
    id: 0 | 1 | 2 | 3;
    label: string;
    slots: string;
}

interface ModeSpec {
    id: AccessMode;
    label: string;
    activeClass: string;
    tone: Tone;
    leavesActive: boolean;
    activePages: number[];
    entries: LeafEntry[];
    pages: DataPage[];
    formulaText: string;
}

// Geometria exacta: 4 files x 36px + 3 gaps x 10px = 174px
const ROW_H = 36;
const GAP = 10;
const getY = (idx: number) => idx * (ROW_H + GAP) + ROW_H / 2;

const TONE_HEX: Record<Tone, string> = {
    emerald: "#10b981",
    amber: "#f59e0b",
    sky: "#38bdf8",
    rose: "#f43f5e",
};

const TONE_PILL: Record<Tone, string> = {
    emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    amber: "bg-amber-500/10 border-amber-500/30 text-amber-300",
    sky: "bg-sky-500/10 border-sky-500/30 text-sky-300",
    rose: "bg-rose-500/10 border-rose-500/30 text-rose-300",
};

const CLUSTERED_ENTRIES: LeafEntry[] = [
    { id: 0, keyLabel: "21", ridLabel: "P1#1", targetPage: 0 },
    { id: 1, keyLabel: "24", ridLabel: "P1#2", targetPage: 0 },
    { id: 2, keyLabel: "27", ridLabel: "P2#1", targetPage: 1 },
    { id: 3, keyLabel: "29", ridLabel: "P2#2", targetPage: 1 },
];

const UNCLUSTERED_ENTRIES: LeafEntry[] = [
    { id: 0, keyLabel: "BCN", ridLabel: "P3#1", targetPage: 2 },
    { id: 1, keyLabel: "BCN", ridLabel: "P1#2", targetPage: 0 },
    { id: 2, keyLabel: "BCN", ridLabel: "P4#1", targetPage: 3 },
    { id: 3, keyLabel: "BCN", ridLabel: "P2#1", targetPage: 1 },
];

const MODES: Record<AccessMode, ModeSpec> = {
    clustered: {
        id: "clustered",
        label: "Agrupat",
        activeClass: "bg-emerald-500/15 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)] font-semibold",
        tone: "emerald",
        leavesActive: true,
        activePages: [0, 1],
        entries: CLUSTERED_ENTRIES,
        pages: [
            { id: 0, label: "Pàg. 1", slots: "[ 21 | 24 ]" },
            { id: 1, label: "Pàg. 2", slots: "[ 27 | 29 ]" },
            { id: 2, label: "Pàg. 3", slots: "[ 35 | 40 ]" },
            { id: 3, label: "Pàg. 4", slots: "[ 52 | 60 ]" },
        ],
        formulaText: "Cost: (h + F) + ⌈M / f⌉ = (h + F) + 2 pàgs. · files físicament contigües ✓",
    },
    unclustered: {
        id: "unclustered",
        label: "No agrupat",
        activeClass: "bg-amber-500/15 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)] font-semibold",
        tone: "amber",
        leavesActive: true,
        activePages: [0, 1, 2, 3],
        entries: UNCLUSTERED_ENTRIES,
        pages: [
            { id: 0, label: "Pàg. 1", slots: "[ MAD | BCN ]" },
            { id: 1, label: "Pàg. 2", slots: "[ BCN | VAL ]" },
            { id: 2, label: "Pàg. 3", slots: "[ BCN | GIR ]" },
            { id: 3, label: "Pàg. 4", slots: "[ BCN | TAR ]" },
        ],
        formulaText: "Cost: (h + F) + M = (h + F) + 4 pàgs. · 1 accés a disc per cada RID",
    },
    index_only: {
        id: "index_only",
        label: "Index-Only",
        activeClass: "bg-sky-500/15 border-sky-400 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.2)] font-semibold",
        tone: "sky",
        leavesActive: true,
        activePages: [],
        entries: UNCLUSTERED_ENTRIES,
        pages: [
            { id: 0, label: "Pàg. 1", slots: "[ MAD | BCN ]" },
            { id: 1, label: "Pàg. 2", slots: "[ BCN | VAL ]" },
            { id: 2, label: "Pàg. 3", slots: "[ BCN | GIR ]" },
            { id: 3, label: "Pàg. 4", slots: "[ BCN | TAR ]" },
        ],
        formulaText: "Cost: (h + F) + 0 pàgs. dades · tot el SELECT es resol dins l'índex ✓",
    },
    seq: {
        id: "seq",
        label: "Seqüencial",
        activeClass: "bg-rose-500/15 border-rose-400 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)] font-semibold",
        tone: "rose",
        leavesActive: false,
        activePages: [0, 1, 2, 3],
        entries: UNCLUSTERED_ENTRIES,
        pages: [
            { id: 0, label: "Pàg. 1", slots: "[ MAD | BCN ]" },
            { id: 1, label: "Pàg. 2", slots: "[ BCN | VAL ]" },
            { id: 2, label: "Pàg. 3", slots: "[ BCN | GIR ]" },
            { id: 3, label: "Pàg. 4", slots: "[ BCN | TAR ]" },
        ],
        formulaText: "Cost: 0 índex + ⌈N / f⌉ = 4 pàgs. · més barat si (h + F) + M ≥ ⌈N / f⌉",
    },
};

const MODE_ORDER: AccessMode[] = ["clustered", "unclustered", "index_only", "seq"];

export default function IndexCostVisualizer() {
    const [modeId, setModeId] = useState<AccessMode>("clustered");
    const [hoveredEntry, setHoveredEntry] = useState<number | null>(null);

    const mode = MODES[modeId];
    const showArrows = modeId === "clustered" || modeId === "unclustered";
    const strokeHex = TONE_HEX[mode.tone];

    return (
        <div className="w-full max-w-xl mx-auto my-6 not-prose select-none font-mono text-xs">
            {/* Selector de mètode d'accés */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pb-4">
                {MODE_ORDER.map((id) => {
                    const spec = MODES[id];
                    const isSelected = modeId === id;
                    return (
                        <button
                            key={id}
                            type="button"
                            onClick={() => {
                                setModeId(id);
                                setHoveredEntry(null);
                            }}
                            className={`px-2.5 py-1 rounded-md border text-[11px] transition-all duration-150 cursor-pointer ${
                                isSelected
                                    ? spec.activeClass
                                    : "bg-slate-900/30 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10"
                            }`}
                        >
                            {spec.label}
                        </button>
                    );
                })}
            </div>

            {/* Capçaleres */}
            <div
                className="grid items-center text-[10px] text-slate-500 font-semibold tracking-wider pb-2"
                style={{ gridTemplateColumns: "1fr 84px 1.1fr" }}
            >
                <div className="flex items-center justify-between">
                    <span>FULLES B+ (M=4)</span>
                    <span className="text-slate-600">{mode.leavesActive ? "h+F" : "0 E/S"}</span>
                </div>
                <span className="text-center text-slate-600">RIDs</span>
                <div className="flex items-center justify-between">
                    <span>DADES (f=2)</span>
                    <span className="text-slate-600">{mode.activePages.length} E/S</span>
                </div>
            </div>

            {/* Cos principal: fulles B+ -> fletxes RID -> pàgines de dades */}
            <div
                className="relative grid items-center"
                style={{ gridTemplateColumns: "1fr 84px 1.1fr" }}
            >
                {/* Columna esquerra: entrades de fulla B+ */}
                <div className="flex flex-col gap-2.5">
                    {mode.entries.map((entry) => {
                        const isFocused = hoveredEntry === entry.id;
                        const isDimByHover = hoveredEntry !== null && !isFocused;

                        return (
                            <button
                                key={`${modeId}-leaf-${entry.id}`}
                                type="button"
                                onMouseEnter={() => showArrows && setHoveredEntry(entry.id)}
                                onMouseLeave={() => setHoveredEntry(null)}
                                className={`h-9 px-2.5 rounded-lg border flex items-center justify-between transition-all duration-150 ${
                                    !mode.leavesActive
                                        ? "bg-slate-900/15 border-white/5 text-slate-600 opacity-25 cursor-default"
                                        : isFocused
                                        ? modeId === "clustered"
                                            ? "bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.22)] cursor-pointer"
                                            : "bg-amber-500/20 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.22)] cursor-pointer"
                                        : isDimByHover
                                        ? "bg-slate-900/20 border-white/5 text-slate-600 opacity-35 cursor-pointer"
                                        : modeId === "index_only"
                                        ? "bg-sky-500/15 border-sky-400/60 text-sky-200 shadow-[0_0_10px_rgba(56,189,248,0.14)]"
                                        : "bg-slate-900/50 border-white/10 text-slate-300 hover:border-slate-500 cursor-pointer"
                                }`}
                            >
                                <span className="font-bold text-[11px]">{entry.keyLabel}</span>
                                <span className="text-[10px] opacity-65">{entry.ridLabel}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Connexions SVG RID -> Pàgina */}
                <svg
                    viewBox="0 0 84 174"
                    className="w-full h-[174px] pointer-events-none overflow-visible"
                >
                    <defs>
                        <marker
                            id="idx-arrow-active"
                            viewBox="0 0 6 6"
                            refX="4.5"
                            refY="3"
                            markerWidth="4.5"
                            markerHeight="4.5"
                            orient="auto"
                        >
                            <path d="M 0 0 L 6 3 L 0 6 z" fill={strokeHex} />
                        </marker>
                    </defs>

                    {showArrows &&
                        mode.entries.map((entry) => {
                            const y1 = getY(entry.id);
                            const y2 = getY(entry.targetPage);
                            const isFocused = hoveredEntry === entry.id;
                            const isDim = hoveredEntry !== null && !isFocused;

                            return (
                                <path
                                    key={`${modeId}-edge-${entry.id}`}
                                    d={`M 0,${y1} C 42,${y1} 42,${y2} 81,${y2}`}
                                    fill="none"
                                    stroke={isDim ? "#334155" : strokeHex}
                                    strokeWidth={isFocused ? 2.2 : 1.5}
                                    strokeOpacity={isDim ? 0.18 : 0.85}
                                    markerEnd={isDim ? undefined : "url(#idx-arrow-active)"}
                                    className="transition-all duration-150"
                                />
                            );
                        })}

                    {modeId === "index_only" && (
                        <g transform="translate(42, 87)">
                            <rect
                                x="-24"
                                y="-11"
                                width="48"
                                height="22"
                                rx="6"
                                fill="#020617"
                                stroke="#38bdf8"
                                strokeWidth="1"
                                strokeDasharray="3 2"
                            />
                            <text
                                textAnchor="middle"
                                dominantBaseline="middle"
                                y="0.5"
                                fill="#38bdf8"
                                fontSize="9.5"
                                fontWeight="bold"
                            >
                                0 E/S
                            </text>
                        </g>
                    )}

                    {modeId === "seq" && (
                        <g>
                            <line
                                x1="70"
                                y1="18"
                                x2="70"
                                y2="156"
                                stroke="#f43f5e"
                                strokeWidth="1.6"
                                strokeDasharray="3 3"
                            />
                            {[0, 1, 2, 3].map((pIdx) => (
                                <line
                                    key={pIdx}
                                    x1="70"
                                    y1={getY(pIdx)}
                                    x2="81"
                                    y2={getY(pIdx)}
                                    stroke="#f43f5e"
                                    strokeWidth="1.6"
                                    markerEnd="url(#idx-arrow-active)"
                                />
                            ))}
                        </g>
                    )}
                </svg>

                {/* Columna dreta: 4 pàgines físiques de dades */}
                <div className="flex flex-col gap-2.5">
                    {mode.pages.map((page) => {
                        const isRead = mode.activePages.includes(page.id);
                        const isHoveredTarget =
                            hoveredEntry !== null &&
                            mode.entries[hoveredEntry]?.targetPage === page.id;
                        const isDimByHover = hoveredEntry !== null && !isHoveredTarget;

                        return (
                            <div
                                key={`${modeId}-page-${page.id}`}
                                className={`h-9 px-2.5 rounded-lg border flex items-center justify-between gap-1.5 transition-all duration-150 ${
                                    !isRead || isDimByHover
                                        ? "bg-slate-900/15 border-white/5 text-slate-600 opacity-25"
                                        : modeId === "clustered"
                                        ? "bg-emerald-500/15 border-emerald-400/70 text-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.16)]"
                                        : modeId === "unclustered"
                                        ? "bg-amber-500/15 border-amber-400/70 text-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.15)]"
                                        : "bg-rose-500/15 border-rose-400/70 text-rose-200 shadow-[0_0_10px_rgba(244,63,94,0.16)]"
                                }`}
                            >
                                <span className="font-bold text-[10.5px] shrink-0">{page.label}</span>
                                <span className="text-[10px] opacity-85 truncate">{page.slots}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Fórmula de cost en 1 línia */}
            <div className="mt-4 flex justify-center">
                <div className={`px-3 py-1 rounded-lg border text-[11px] text-center transition-colors ${TONE_PILL[mode.tone]}`}>
                    {mode.formulaText}
                </div>
            </div>
        </div>
    );
}
