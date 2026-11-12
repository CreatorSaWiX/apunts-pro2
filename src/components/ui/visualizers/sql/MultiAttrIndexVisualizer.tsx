"use client";

import { Fragment, useState } from "react";

type QueryId = "prefix_range" | "first_range" | "second_only" | "order_ba";
type Tone = "emerald" | "amber" | "sky" | "rose";
type EntryState = "match" | "scanned" | "skip" | "break";

interface IndexEntry {
    a: string;
    b: number;
}

interface LeafPage {
    id: number;
    label: string;
    entries: [IndexEntry, IndexEntry, IndexEntry];
}

interface QueryConfig {
    id: QueryId;
    tabLabel: string;
    sql: string;
    tone: Tone;
    entryStates: [
        [EntryState, EntryState, EntryState],
        [EntryState, EntryState, EntryState],
        [EntryState, EntryState, EntryState]
    ];
    leafRead: [boolean, boolean, boolean];
    linkActive: [boolean, boolean]; // 0->1, 1->2
    pills: [
        { label: string; value: string; tone: Tone },
        { label: string; value: string; tone: Tone },
        { label: string; value: string; tone: Tone }
    ];
    statusText: string;
}

const LEAF_PAGES: [LeafPage, LeafPage, LeafPage] = [
    {
        id: 1,
        label: "Fulla 1",
        entries: [
            { a: "BCN", b: 20 },
            { a: "BCN", b: 25 },
            { a: "BCN", b: 30 },
        ],
    },
    {
        id: 2,
        label: "Fulla 2",
        entries: [
            { a: "BCN", b: 40 },
            { a: "MAD", b: 20 },
            { a: "MAD", b: 25 },
        ],
    },
    {
        id: 3,
        label: "Fulla 3",
        entries: [
            { a: "MAD", b: 30 },
            { a: "VAL", b: 20 },
            { a: "VAL", b: 40 },
        ],
    },
];

const TONE_TAB: Record<Tone, string> = {
    emerald: "bg-emerald-500/15 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)] font-semibold",
    amber: "bg-amber-500/15 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)] font-semibold",
    sky: "bg-sky-500/15 border-sky-400 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.2)] font-semibold",
    rose: "bg-rose-500/15 border-rose-400 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)] font-semibold",
};

const TONE_PILL: Record<Tone, string> = {
    emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    amber: "bg-amber-500/10 border-amber-500/30 text-amber-300",
    sky: "bg-sky-500/10 border-sky-500/30 text-sky-300",
    rose: "bg-rose-500/10 border-rose-500/30 text-rose-300",
};

const TONE_HEX: Record<Tone, string> = {
    emerald: "#10b981",
    amber: "#f59e0b",
    sky: "#38bdf8",
    rose: "#f43f5e",
};

const QUERIES: QueryConfig[] = [
    {
        id: "prefix_range",
        tabLabel: "A = x ∧ B > y",
        sql: "WHERE ciutat = 'BCN' AND edat > 22",
        tone: "emerald",
        entryStates: [
            ["skip", "match", "match"],
            ["match", "skip", "skip"],
            ["skip", "skip", "skip"],
        ],
        leafRead: [true, true, false],
        linkActive: [true, false],
        pills: [
            { label: "Entrades", value: "Contigües ✓", tone: "emerald" },
            { label: "Fulles", value: "2 / 3 (només F)", tone: "emerald" },
            { label: "Dades", value: "h + F + dades", tone: "sky" },
        ],
        statusText: "Eficient: A = 'BCN' fixa el prefix i B > 22 recorre un bloc contigu sense salts",
    },
    {
        id: "first_range",
        tabLabel: "A > x ∧ B = y",
        sql: "WHERE ciutat > 'BCN' AND edat = 20",
        tone: "amber",
        entryStates: [
            ["skip", "skip", "skip"],
            ["skip", "match", "scanned"],
            ["scanned", "match", "scanned"],
        ],
        leafRead: [false, true, true],
        linkActive: [false, true],
        pills: [
            { label: "Entrades", value: "Disperses ✕", tone: "rose" },
            { label: "Fulles", value: "tot rang A > x", tone: "amber" },
            { label: "Dades", value: "h + F + dades", tone: "amber" },
        ],
        statusText: "Ineficient: en variar A ('MAD', 'VAL'), B = 20 queda dispers i cal escanejar tot A > 'BCN'",
    },
    {
        id: "second_only",
        tabLabel: "SELECT A WHERE B = y",
        sql: "SELECT ciutat FROM T WHERE edat = 20",
        tone: "sky",
        entryStates: [
            ["match", "scanned", "scanned"],
            ["scanned", "match", "scanned"],
            ["scanned", "match", "scanned"],
        ],
        leafRead: [true, true, true],
        linkActive: [true, true],
        pills: [
            { label: "Index-Only", value: "0 dades ✓", tone: "emerald" },
            { label: "Fulles", value: "3 / 3 (totes)", tone: "amber" },
            { label: "Cost", value: "(h - 1) + P_fulles", tone: "sky" },
        ],
        statusText: "Index-only scan complet: 0 accessos a dades, però escaneja totes les fulles en filtrar per B",
    },
    {
        id: "order_ba",
        tabLabel: "ORDER BY B, A",
        sql: "SELECT * FROM T ORDER BY edat, ciutat",
        tone: "rose",
        entryStates: [
            ["scanned", "scanned", "scanned"],
            ["scanned", "break", "scanned"],
            ["scanned", "break", "scanned"],
        ],
        leafRead: [true, true, true],
        linkActive: [true, true],
        pills: [
            { label: "Ordre B", value: "40 → 20 ✕", tone: "rose" },
            { label: "Fulles", value: "desordenades per B", tone: "rose" },
            { label: "Alternativa", value: "ORDER BY A, B ✓", tone: "emerald" },
        ],
        statusText: "L'índex està ordenat per A primer: per B fa salts (40 → 20) i no evita reordenar",
    },
];

function getEntryClass(state: EntryState, queryTone: Tone): string {
    if (state === "match") {
        if (queryTone === "sky") {
            return "bg-sky-500/15 border-sky-400 text-sky-200 shadow-[0_0_8px_rgba(56,189,248,0.18)]";
        }
        if (queryTone === "amber") {
            return "bg-amber-500/15 border-amber-400 text-amber-200 shadow-[0_0_8px_rgba(245,158,11,0.18)]";
        }
        return "bg-emerald-500/15 border-emerald-400 text-emerald-200 shadow-[0_0_8px_rgba(16,185,129,0.18)]";
    }
    if (state === "break") {
        return "bg-rose-500/15 border-rose-500 text-rose-200 shadow-[0_0_8px_rgba(244,63,94,0.2)]";
    }
    if (state === "scanned") {
        return "bg-slate-900/50 border-white/10 border-dashed text-slate-400";
    }
    return "bg-slate-950/40 border-white/5 text-slate-600 opacity-30";
}

/**
 * Interactive minimalist visualizer for multi-attribute B+ tree index `[A, B]`
 * lexicographic ordering, prefix contiguity, scattered 2nd-column scans, and index-only scans.
 */
export default function MultiAttrIndexVisualizer() {
    const [queryId, setQueryId] = useState<QueryId>("prefix_range");

    const q = QUERIES.find((item) => item.id === queryId) || QUERIES[0];

    return (
        <div className="w-full max-w-xl mx-auto my-6 not-prose select-none font-mono text-xs">
            {/* Selector de consulta */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pb-3">
                {QUERIES.map((item) => {
                    const isSelected = item.id === queryId;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setQueryId(item.id)}
                            className={`px-2.5 py-1 rounded-md border text-[11px] transition-all duration-150 cursor-pointer ${
                                isSelected
                                    ? TONE_TAB[item.tone]
                                    : "bg-slate-900/30 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10"
                            }`}
                        >
                            {item.tabLabel}
                        </button>
                    );
                })}
            </div>

            {/* Sentència SQL activa */}
            <div className="pb-3 flex justify-center">
                <div className="px-3 py-1 rounded-lg bg-slate-900/50 border border-white/10 text-[11px] text-slate-300 truncate max-w-full">
                    {q.sql}
                </div>
            </div>

            {/* Capçalera d'ordre lexicogràfic */}
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold tracking-wider px-1 pb-2">
                <span>ÍNDEX [A: ciutat, B: edat]</span>
                <span className="text-slate-600">ORDRE LEXICOGRÀFIC →</span>
            </div>

            {/* 3 fulles connectades amb fletxes SVG */}
            <div
                className="grid items-center"
                style={{
                    gridTemplateColumns:
                        "minmax(0, 1fr) 20px minmax(0, 1fr) 20px minmax(0, 1fr)",
                }}
            >
                {LEAF_PAGES.map((leaf, leafIdx) => {
                    const isRead = q.leafRead[leafIdx];
                    const showArrow = leafIdx < 2;
                    const arrowActive = showArrow ? q.linkActive[leafIdx] : false;
                    const arrowColor = arrowActive ? TONE_HEX[q.tone] : "#334155";

                    return (
                        <Fragment key={leaf.id}>
                            <div
                                className={`rounded-xl border p-2 transition-all duration-200 ${
                                    isRead
                                        ? "bg-slate-900/50 border-white/15"
                                        : "bg-slate-950/40 border-white/5 opacity-45"
                                }`}
                            >
                                <div className="flex items-center justify-between text-[9.5px] pb-1.5 px-0.5">
                                    <span className="text-slate-400 font-semibold">
                                        {leaf.label}
                                    </span>
                                    <span
                                        className={
                                            isRead
                                                ? "text-slate-300 font-bold"
                                                : "text-slate-600"
                                        }
                                    >
                                        {isRead ? "llegida" : "omesa"}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-1">
                                    {leaf.entries.map((entry, eIdx) => {
                                        const state = q.entryStates[leafIdx][eIdx];
                                        return (
                                            <div
                                                key={`${leaf.id}-${eIdx}`}
                                                className={`h-7 px-1.5 rounded-md border flex items-center justify-between text-[10.5px] transition-all duration-200 ${getEntryClass(
                                                    state,
                                                    q.tone
                                                )}`}
                                            >
                                                <span className="font-semibold truncate">
                                                    {entry.a}
                                                </span>
                                                <span className="tabular-nums flex items-center gap-1 shrink-0">
                                                    <span>{entry.b}</span>
                                                    {state === "match" && (
                                                        <span className="text-[9px] font-bold">
                                                            ✓
                                                        </span>
                                                    )}
                                                    {state === "break" && (
                                                        <span className="text-[9px] font-bold text-rose-400">
                                                            ↺
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {showArrow && (
                                <svg
                                    viewBox="0 0 20 24"
                                    className="w-5 h-6 overflow-visible pointer-events-none"
                                >
                                    <line
                                        x1="2"
                                        y1="12"
                                        x2="16"
                                        y2="12"
                                        stroke={arrowColor}
                                        strokeWidth={arrowActive ? 2 : 1.2}
                                        strokeDasharray={arrowActive ? undefined : "2 2"}
                                        opacity={arrowActive ? 0.95 : 0.35}
                                    />
                                    <path
                                        d="M 12,8 L 17,12 L 12,16"
                                        fill="none"
                                        stroke={arrowColor}
                                        strokeWidth={arrowActive ? 2 : 1.2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        opacity={arrowActive ? 0.95 : 0.35}
                                    />
                                </svg>
                            )}
                        </Fragment>
                    );
                })}
            </div>

            {/* Resum en 1 línia */}
            <div className="mt-3 flex justify-center">
                <div
                    className={`px-3 py-1 rounded-lg border text-[11px] text-center transition-colors ${TONE_PILL[q.tone]}`}
                >
                    {q.statusText}
                </div>
            </div>

            {/* 3 mètriques clau d'examen */}
            <div className="mt-2.5 grid grid-cols-3 gap-1.5">
                {q.pills.map((pill) => (
                    <div
                        key={pill.label}
                        className={`px-2 py-1 rounded-md border flex items-center justify-between gap-1 text-[9.5px] transition-colors ${TONE_PILL[pill.tone]}`}
                    >
                        <span className="opacity-75 truncate">{pill.label}</span>
                        <span className="font-bold truncate">{pill.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
