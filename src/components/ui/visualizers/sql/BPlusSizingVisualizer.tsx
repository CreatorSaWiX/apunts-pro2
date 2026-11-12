"use client";

import { useState } from "react";

type TabId = "levels" | "bytes";
type LevelPresetId = "p100k_80" | "p100k_100" | "p5k_80";
type BytePresetId = "b4k_v12" | "b4k_v28" | "b2k_v12";
type Tone = "emerald" | "sky" | "amber" | "violet";

interface LevelRowSpec {
    label: string;
    formula: string;
    pages: string;
    badge: string;
    tone: Tone;
    note: string;
}

interface LevelPreset {
    id: LevelPresetId;
    label: string;
    nLabel: string;
    k: number;
    fanout: number;
    h: number;
    totalPages: string;
    rows: LevelRowSpec[];
    summary: string;
}

interface BytePreset {
    id: BytePresetId;
    label: string;
    B: number;
    V: number;
    T: number;
    A: number;
}

const ROW_H = 38;
const GAP = 12;
const SVG_W = 64;
const getY = (idx: number) => idx * (ROW_H + GAP) + ROW_H / 2;

const LEVEL_PRESETS: LevelPreset[] = [
    {
        id: "p100k_80",
        label: "N = 100k · 80%",
        nLabel: "N = 100.000 · d = 50 · p = 80%",
        k: 80,
        fanout: 81,
        h: 3,
        totalPages: "1.267",
        rows: [
            {
                label: "Nivell 1 · Arrel",
                formula: "⌈16 / 81⌉ = 1",
                pages: "1 pàg",
                badge: "÷ 81",
                tone: "emerald",
                note: "Quan s'arriba a 1 pàgina tenim l'arrel · alçada final h = 3",
            },
            {
                label: "Nivell 2 · Intern",
                formula: "⌈1.250 / 81⌉ = 16",
                pages: "16 pàgs",
                badge: "÷ 81",
                tone: "sky",
                note: "Cada node intern té k = 80 claus i k + 1 = 81 apuntadors",
            },
            {
                label: "Nivell 3 · Fulles",
                formula: "⌈100.000 / 80⌉ = 1.250",
                pages: "1.250 pàgs",
                badge: "÷ 80",
                tone: "amber",
                note: "k = ⌊2·50·0,80⌋ = 80 entrades [valor, RID] per fulla",
            },
        ],
        summary: "k = 80 · h = 3 · Total = 1.250 + 16 + 1 = 1.267 pàgs",
    },
    {
        id: "p100k_100",
        label: "N = 100k · 100%",
        nLabel: "N = 100.000 · d = 50 · p = 100%",
        k: 100,
        fanout: 101,
        h: 3,
        totalPages: "1.011",
        rows: [
            {
                label: "Nivell 1 · Arrel",
                formula: "⌈10 / 101⌉ = 1",
                pages: "1 pàg",
                badge: "÷ 101",
                tone: "emerald",
                note: "Arribem a 1 pàgina (arrel) · alçada h = 3",
            },
            {
                label: "Nivell 2 · Intern",
                formula: "⌈1.000 / 101⌉ = 10",
                pages: "10 pàgs",
                badge: "÷ 101",
                tone: "sky",
                note: "Al 100% d'ocupació cada node intern té 101 apuntadors",
            },
            {
                label: "Nivell 3 · Fulles",
                formula: "⌈100.000 / 100⌉ = 1.000",
                pages: "1.000 pàgs",
                badge: "÷ 100",
                tone: "amber",
                note: "k = 2d = 100 entrades per fulla → menys fulles (1.000 vs 1.250)",
            },
        ],
        summary: "k = 100 · h = 3 · Total = 1.000 + 10 + 1 = 1.011 pàgs",
    },
    {
        id: "p5k_80",
        label: "N = 5k · 80% (h=2)",
        nLabel: "N = 5.000 · d = 50 · p = 80%",
        k: 80,
        fanout: 81,
        h: 2,
        totalPages: "64",
        rows: [
            {
                label: "Nivell 1 · Arrel",
                formula: "⌈63 / 81⌉ = 1",
                pages: "1 pàg",
                badge: "÷ 81",
                tone: "emerald",
                note: "63 ≤ 81: l'arrel apunta directament a les 63 fulles (h = 2!)",
            },
            {
                label: "Nivell 2 · Fulles",
                formula: "⌈5.000 / 80⌉ = 63",
                pages: "63 pàgs",
                badge: "÷ 80",
                tone: "amber",
                note: "Només 63 pàgines de fulles amb k = 80 entrades per fulla",
            },
        ],
        summary: "k = 80 · h = 2 · Total = 63 + 1 = 64 pàgs",
    },
];

const BYTE_PRESETS: BytePreset[] = [
    { id: "b4k_v12", label: "B = 4096 · V = 12B", B: 4096, V: 12, T: 4, A: 4 },
    { id: "b4k_v28", label: "B = 4096 · V = 28B", B: 4096, V: 28, T: 4, A: 4 },
    { id: "b2k_v12", label: "B = 2048 · V = 12B", B: 2048, V: 12, T: 4, A: 4 },
];

const TONE_HEX: Record<Tone, string> = {
    emerald: "#10b981",
    sky: "#38bdf8",
    amber: "#f59e0b",
    violet: "#a78bfa",
};

const TONE_CARD: Record<Tone, string> = {
    emerald: "bg-emerald-500/15 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.2)]",
    sky: "bg-sky-500/15 border-sky-400 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.2)]",
    amber: "bg-amber-500/15 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.2)]",
    violet: "bg-violet-500/15 border-violet-400 text-violet-200 shadow-[0_0_12px_rgba(167,139,250,0.2)]",
};

const TONE_PILL: Record<Tone, string> = {
    emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    sky: "bg-sky-500/10 border-sky-500/30 text-sky-300",
    amber: "bg-amber-500/10 border-amber-500/30 text-amber-300",
    violet: "bg-violet-500/10 border-violet-500/30 text-violet-300",
};

export default function BPlusSizingVisualizer() {
    const [tab, setTab] = useState<TabId>("levels");
    const [levelPresetId, setLevelPresetId] = useState<LevelPresetId>("p100k_80");
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);
    const [bytePresetId, setBytePresetId] = useState<BytePresetId>("b4k_v12");
    const [hoveredPart, setHoveredPart] = useState<"ptr" | "entries" | "rem" | null>(null);

    const lvl = LEVEL_PRESETS.find((p) => p.id === levelPresetId) || LEVEL_PRESETS[0];
    const totalH = lvl.rows.length * ROW_H + (lvl.rows.length - 1) * GAP;
    const activeRow = hoveredRow !== null ? lvl.rows[hoveredRow] : null;

    const bp = BYTE_PRESETS.find((b) => b.id === bytePresetId) || BYTE_PRESETS[0];
    const nf = Math.floor((bp.B - 2 * bp.A) / (bp.V + bp.T));
    const entriesBytes = nf * (bp.V + bp.T);
    const remBytes = bp.B - 2 * bp.A - entriesBytes;

    return (
        <div className="w-full max-w-xl mx-auto my-6 not-prose select-none font-mono text-xs">
            {/* Selector principal */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pb-3">
                <button
                    type="button"
                    onClick={() => {
                        setTab("levels");
                        setHoveredPart(null);
                    }}
                    className={`px-2.5 py-1 rounded-md border text-[11px] transition-all duration-150 cursor-pointer ${
                        tab === "levels"
                            ? `${TONE_CARD.emerald} font-semibold`
                            : "bg-slate-900/30 border-white/5 text-slate-400 hover:text-slate-200"
                    }`}
                >
                    ALÇADA BOTTOM-UP (N, d, p)
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setTab("bytes");
                        setHoveredRow(null);
                    }}
                    className={`px-2.5 py-1 rounded-md border text-[11px] transition-all duration-150 cursor-pointer ${
                        tab === "bytes"
                            ? `${TONE_CARD.sky} font-semibold`
                            : "bg-slate-900/30 border-white/5 text-slate-400 hover:text-slate-200"
                    }`}
                >
                    CAPACITAT FULLA (B, V, T, A)
                </button>
            </div>

            {tab === "levels" ? (
                <>
                    {/* Presets de dimensionament */}
                    <div className="flex flex-wrap items-center justify-center gap-1.5 pb-4">
                        {LEVEL_PRESETS.map((item) => {
                            const isSelected = item.id === levelPresetId;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => {
                                        setLevelPresetId(item.id);
                                        setHoveredRow(null);
                                    }}
                                    className={`px-2.5 py-1 rounded-md border text-[10.5px] transition-all duration-150 cursor-pointer ${
                                        isSelected
                                            ? `${TONE_CARD.sky} font-semibold`
                                            : "bg-slate-900/30 border-white/5 text-slate-400 hover:text-slate-200"
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
                        <span>CÀLCUL (DE BAIX A DALT ↑)</span>
                        <span />
                        <span className="text-right">NIVELLS (h = {lvl.h})</span>
                    </div>

                    {/* Cos: Fórmules esquerra <-> Nivells dreta */}
                    <div
                        className="relative grid items-start"
                        style={{ gridTemplateColumns: "1.2fr 64px 1fr" }}
                    >
                        <div className="flex flex-col gap-3">
                            {lvl.rows.map((row, idx) => {
                                const isHovered = hoveredRow === idx;
                                const isDimmed = hoveredRow !== null && !isHovered;

                                return (
                                    <button
                                        key={`${lvl.id}-l-${idx}`}
                                        type="button"
                                        onMouseEnter={() => setHoveredRow(idx)}
                                        onMouseLeave={() => setHoveredRow(null)}
                                        onClick={() =>
                                            setHoveredRow((curr) => (curr === idx ? null : idx))
                                        }
                                        className={`h-[38px] px-2.5 rounded-lg border flex items-center justify-between text-left transition-all duration-150 cursor-pointer ${
                                            isDimmed
                                                ? "bg-slate-900/20 border-white/5 text-slate-600 opacity-30"
                                                : TONE_CARD[row.tone]
                                        }`}
                                    >
                                        <span className="text-[11px] font-semibold truncate tabular-nums">
                                            {row.formula}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Fletxes SVG */}
                        <svg
                            viewBox={`0 0 ${SVG_W} ${totalH}`}
                            style={{ height: totalH }}
                            className="w-full pointer-events-none overflow-visible"
                        >
                            {lvl.rows.map((row, idx) => {
                                const y = getY(idx);
                                const isHovered = hoveredRow === idx;
                                const isDimmed = hoveredRow !== null && !isHovered;
                                const color = isDimmed ? "#334155" : TONE_HEX[row.tone];
                                const opacity = isDimmed ? 0.2 : isHovered ? 1 : 0.85;

                                return (
                                    <g
                                        key={`${lvl.id}-e-${idx}`}
                                        opacity={opacity}
                                        className="transition-opacity duration-150"
                                    >
                                        <path
                                            d={`M 0,${y} L ${SVG_W},${y}`}
                                            fill="none"
                                            stroke={color}
                                            strokeWidth={isHovered ? 2.3 : 1.7}
                                        />
                                        <g transform={`translate(32, ${y})`}>
                                            <rect
                                                x="-19"
                                                y="-8"
                                                width="38"
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
                                                {row.badge}
                                            </text>
                                        </g>
                                    </g>
                                );
                            })}
                        </svg>

                        {/* Nivells resultants */}
                        <div className="flex flex-col gap-3">
                            {lvl.rows.map((row, idx) => {
                                const isHovered = hoveredRow === idx;
                                const isDimmed = hoveredRow !== null && !isHovered;

                                return (
                                    <button
                                        key={`${lvl.id}-r-${idx}`}
                                        type="button"
                                        onMouseEnter={() => setHoveredRow(idx)}
                                        onMouseLeave={() => setHoveredRow(null)}
                                        onClick={() =>
                                            setHoveredRow((curr) => (curr === idx ? null : idx))
                                        }
                                        className={`h-[38px] px-2.5 rounded-lg border flex items-center justify-between gap-1.5 text-left transition-all duration-150 cursor-pointer ${
                                            isDimmed
                                                ? "bg-slate-900/20 border-white/5 text-slate-600 opacity-30"
                                                : TONE_CARD[row.tone]
                                        }`}
                                    >
                                        <span className="text-[10.5px] truncate">{row.label}</span>
                                        <span className="text-[11px] font-bold tabular-nums shrink-0">
                                            {row.pages}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-3 flex justify-center">
                        <div
                            className={`px-3 py-1 rounded-lg border text-[11px] transition-colors ${
                                activeRow ? TONE_PILL[activeRow.tone] : TONE_PILL.emerald
                            }`}
                        >
                            {activeRow ? activeRow.note : lvl.summary}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* Presets de bytes */}
                    <div className="flex flex-wrap items-center justify-center gap-1.5 pb-4">
                        {BYTE_PRESETS.map((item) => {
                            const isSelected = item.id === bytePresetId;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => {
                                        setBytePresetId(item.id);
                                        setHoveredPart(null);
                                    }}
                                    className={`px-2.5 py-1 rounded-md border text-[10.5px] transition-all duration-150 cursor-pointer ${
                                        isSelected
                                            ? `${TONE_CARD.sky} font-semibold`
                                            : "bg-slate-900/30 border-white/5 text-slate-400 hover:text-slate-200"
                                    }`}
                                >
                                    {item.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Anatomia en bytes d'una pàgina fulla */}
                    <div className="rounded-xl border border-white/10 bg-[#0b1120]/90 p-3 flex flex-col gap-3">
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span>NODE FULLA · B = {bp.B} B</span>
                            <span>T = {bp.T} B (RID) · A = {bp.A} B</span>
                        </div>

                        <div className="grid gap-1.5 h-10" style={{ gridTemplateColumns: "54px 1fr 48px 54px" }}>
                            <button
                                type="button"
                                onMouseEnter={() => setHoveredPart("ptr")}
                                onMouseLeave={() => setHoveredPart(null)}
                                className={`rounded-lg border flex flex-col items-center justify-center cursor-pointer transition-all ${
                                    hoveredPart === "ptr"
                                        ? TONE_CARD.sky
                                        : "bg-sky-500/10 border-sky-500/35 text-sky-300"
                                }`}
                            >
                                <span className="text-[10px] font-bold">← A</span>
                                <span className="text-[9px] opacity-75">{bp.A}B</span>
                            </button>

                            <button
                                type="button"
                                onMouseEnter={() => setHoveredPart("entries")}
                                onMouseLeave={() => setHoveredPart(null)}
                                className={`rounded-lg border flex items-center justify-center gap-1.5 px-2 cursor-pointer transition-all ${
                                    hoveredPart === "entries"
                                        ? TONE_CARD.emerald
                                        : "bg-emerald-500/10 border-emerald-500/35 text-emerald-300"
                                }`}
                            >
                                <span className="text-[11px] font-bold truncate">
                                    {nf} × [V:{bp.V}B + T:{bp.T}B]
                                </span>
                            </button>

                            <button
                                type="button"
                                onMouseEnter={() => setHoveredPart("rem")}
                                onMouseLeave={() => setHoveredPart(null)}
                                className={`rounded-lg border border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                                    hoveredPart === "rem"
                                        ? TONE_CARD.amber
                                        : "bg-slate-950/50 border-white/10 text-slate-500"
                                }`}
                            >
                                <span className="text-[9px]">sobra</span>
                                <span className="text-[9.5px] font-semibold">{remBytes}B</span>
                            </button>

                            <button
                                type="button"
                                onMouseEnter={() => setHoveredPart("ptr")}
                                onMouseLeave={() => setHoveredPart(null)}
                                className={`rounded-lg border flex flex-col items-center justify-center cursor-pointer transition-all ${
                                    hoveredPart === "ptr"
                                        ? TONE_CARD.sky
                                        : "bg-sky-500/10 border-sky-500/35 text-sky-300"
                                }`}
                            >
                                <span className="text-[10px] font-bold">A →</span>
                                <span className="text-[9px] opacity-75">{bp.A}B</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-1.5 text-center text-[10.5px]">
                            <div className="px-2 py-1 rounded-md bg-slate-900/60 border border-white/5 text-slate-300">
                                espai útil: <strong className="text-sky-300">{bp.B - 2 * bp.A} B</strong>
                            </div>
                            <div className="px-2 py-1 rounded-md bg-slate-900/60 border border-white/5 text-slate-300">
                                entrada: <strong className="text-emerald-300">{bp.V + bp.T} B</strong>
                            </div>
                            <div className="px-2 py-1 rounded-md bg-slate-900/60 border border-white/5 text-slate-300">
                                nf: <strong className="text-emerald-300">{nf}</strong>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 flex justify-center">
                        <div
                            className={`px-3 py-1 rounded-lg border text-[11px] transition-colors ${
                                hoveredPart === "ptr"
                                    ? TONE_PILL.sky
                                    : hoveredPart === "rem"
                                    ? TONE_PILL.amber
                                    : TONE_PILL.emerald
                            }`}
                        >
                            {hoveredPart === "ptr"
                                ? `2A = ${2 * bp.A} B reservats pels 2 apuntadors (fulla anterior i següent)`
                                : hoveredPart === "rem"
                                ? `${remBytes} B sobrants (< ${bp.V + bp.T} B, no hi cap una altra entrada)`
                                : `nf = ⌊(${bp.B} − ${2 * bp.A}) / (${bp.V} + ${bp.T})⌋ = ${nf} entrades per fulla`}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
