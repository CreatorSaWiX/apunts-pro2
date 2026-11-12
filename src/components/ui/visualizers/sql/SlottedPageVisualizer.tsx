"use client";

import { useState } from "react";

type ModeId = "initial" | "compact" | "insert";
type Tone = "sky" | "amber" | "emerald" | "violet";

interface SlotItem {
    slot: number;
    tableId: string;
    name: string;
    offset: string;
    moved?: boolean;
    inserted?: boolean;
}

const PAGE_H = 246;
const RID_H = 32;
const RID_GAP = 8;
const SVG_W = 48;
const VAF_CENTER_Y = 218;

const MODES: {
    id: ModeId;
    label: string;
    tone: Tone;
    activeClass: string;
    slots: SlotItem[];
    freeLabel: string;
    note: string;
}[] = [
    {
        id: "initial",
        label: "ESTAT INICIAL",
        tone: "sky",
        activeClass: "bg-sky-500/15 border-sky-400 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.2)] font-semibold",
        slots: [
            { slot: 1, tableId: "t1", name: "CARME", offset: "@040" },
            { slot: 2, tableId: "t1", name: "JOSEP", offset: "@120" },
            { slot: 3, tableId: "t1", name: "NURIA", offset: "@200" },
        ],
        freeLabel: "Espai lliure (1.8K)",
        note: "Files creixen avall ↓ · VAF creix amunt ↑ · RID = (pàg 12, slot VAF)",
    },
    {
        id: "compact",
        label: "MOU / COMPACTA F2",
        tone: "amber",
        activeClass: "bg-amber-500/15 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)] font-semibold",
        slots: [
            { slot: 1, tableId: "t1", name: "CARME", offset: "@040" },
            { slot: 2, tableId: "t1", name: "JOSEP", offset: "@088", moved: true },
            { slot: 3, tableId: "t1", name: "NURIA", offset: "@200" },
        ],
        freeLabel: "Espai lliure compactat",
        note: "F2 es mou (@120 → @088): només canvia VAF[2], el RID (12, 2) resta intacte ✓",
    },
    {
        id: "insert",
        label: "+ INSERIR F4",
        tone: "emerald",
        activeClass: "bg-emerald-500/15 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)] font-semibold",
        slots: [
            { slot: 1, tableId: "t1", name: "CARME", offset: "@040" },
            { slot: 2, tableId: "t1", name: "JOSEP", offset: "@120" },
            { slot: 3, tableId: "t1", name: "NURIA", offset: "@200" },
            { slot: 4, tableId: "t1", name: "PAU", offset: "@260", inserted: true },
        ],
        freeLabel: "Espai lliure reduït (1.2K)",
        note: "Nova fila F4 s'afegeix avall ↓ i VAF afegeix slot [4] cap amunt ↑",
    },
];

const TONE_HEX: Record<Tone, string> = {
    sky: "#38bdf8",
    amber: "#f59e0b",
    emerald: "#10b981",
    violet: "#a78bfa",
};

const TONE_PILL: Record<Tone, string> = {
    sky: "bg-sky-500/10 border-sky-500/30 text-sky-300",
    amber: "bg-amber-500/10 border-amber-500/30 text-amber-300",
    emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    violet: "bg-violet-500/10 border-violet-500/30 text-violet-300",
};

export default function SlottedPageVisualizer() {
    const [modeId, setModeId] = useState<ModeId>("compact");
    const [activeSlot, setActiveSlot] = useState<number | null>(2);

    const mode = MODES.find((m) => m.id === modeId) || MODES[1];
    const slots = mode.slots;
    const ridContentH = slots.length * RID_H + (slots.length - 1) * RID_GAP;
    const ridOffset = (PAGE_H - ridContentH) / 2;
    const getYRid = (idx: number) => ridOffset + idx * (RID_H + RID_GAP) + RID_H / 2;

    const selectedItem =
        activeSlot !== null ? slots.find((s) => s.slot === activeSlot) || null : null;

    // VAF s'ordena de dreta a esquerra [ ... | 3 | 2 | 1 ]
    const vafReversed = [...slots].reverse();

    const getSlotTone = (item: SlotItem): Tone => {
        if (item.moved) return "amber";
        if (item.inserted) return "emerald";
        return "sky";
    };

    return (
        <div className="w-full max-w-xl mx-auto my-6 not-prose select-none font-mono text-xs">
            {/* Selector d'operació dins la pàgina */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pb-4">
                {MODES.map((item) => {
                    const isSelected = item.id === modeId;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                                setModeId(item.id);
                                setActiveSlot(
                                    item.id === "compact" ? 2 : item.id === "insert" ? 4 : 1
                                );
                            }}
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

            {/* Capçaleres */}
            <div
                className="grid items-center text-[10px] text-slate-500 font-semibold tracking-wider pb-2"
                style={{ gridTemplateColumns: "0.78fr 48px 1.45fr" }}
            >
                <span>RID (3B + 1B)</span>
                <span />
                <span className="text-right">PÀGINA DE DADES (VAF)</span>
            </div>

            {/* Cos principal: RIDs -> Corbes SVG cap al VAF -> Pàgina física */}
            <div
                className="relative grid items-start"
                style={{ gridTemplateColumns: "0.78fr 48px 1.45fr" }}
            >
                {/* Columna esquerra: RIDs externs (invariants) */}
                <div
                    className="flex flex-col gap-2"
                    style={{
                        height: PAGE_H,
                        paddingTop: `${ridOffset}px`,
                        paddingBottom: `${ridOffset}px`,
                    }}
                >
                    {slots.map((item) => {
                        const isActive = activeSlot === item.slot;
                        const isDimmed = activeSlot !== null && !isActive;
                        const tone = getSlotTone(item);

                        return (
                            <button
                                key={item.slot}
                                type="button"
                                onMouseEnter={() => setActiveSlot(item.slot)}
                                onClick={() =>
                                    setActiveSlot((curr) => (curr === item.slot ? null : item.slot))
                                }
                                className={`h-8 px-2 rounded-lg border flex items-center justify-between text-[11px] transition-all duration-150 cursor-pointer ${
                                    isDimmed
                                        ? "bg-slate-900/20 border-white/5 text-slate-600 opacity-35"
                                        : isActive
                                        ? tone === "amber"
                                            ? "bg-amber-500/15 border-amber-400 text-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                                            : tone === "emerald"
                                            ? "bg-emerald-500/15 border-emerald-400 text-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                                            : "bg-sky-500/15 border-sky-400 text-sky-200 shadow-[0_0_10px_rgba(56,189,248,0.2)]"
                                        : "bg-slate-900/45 border-white/10 text-slate-300 hover:border-slate-600"
                                }`}
                            >
                                <span className="truncate font-semibold">(12, {item.slot})</span>
                                <span className="text-[9px] opacity-65 hidden sm:inline">VAF</span>
                            </button>
                        );
                    })}
                </div>

                {/* Corbes SVG convergint cap al vector VAF */}
                <svg
                    viewBox={`0 0 ${SVG_W} ${PAGE_H}`}
                    style={{ height: PAGE_H }}
                    className="w-full pointer-events-none overflow-visible"
                >
                    {slots.map((item, idx) => {
                        const y1 = getYRid(idx);
                        const y2 = VAF_CENTER_Y;
                        const isActive = activeSlot === item.slot;
                        const isDimmed = activeSlot !== null && !isActive;
                        const tone = getSlotTone(item);
                        const stroke = isDimmed ? "#334155" : TONE_HEX[tone];

                        return (
                            <path
                                key={item.slot}
                                d={`M 0,${y1} C 24,${y1} 24,${y2} ${SVG_W},${y2}`}
                                fill="none"
                                stroke={stroke}
                                strokeWidth={isActive ? 2.2 : 1.4}
                                strokeOpacity={isDimmed ? 0.18 : isActive ? 1 : 0.65}
                                strokeDasharray={item.inserted ? "3 3" : undefined}
                                className="transition-all duration-150"
                            />
                        );
                    })}
                </svg>

                {/* Estructura interna d'una pàgina */}
                <div
                    className="rounded-xl border border-white/10 bg-[#0b1120]/90 p-2.5 flex flex-col justify-between"
                    style={{ height: PAGE_H }}
                >
                    {/* Capçalera de pàgina */}
                    <div className="h-7 px-2 rounded-md bg-slate-900/80 border border-white/10 flex items-center justify-between text-[10px] text-slate-400 shrink-0">
                        <span className="font-semibold text-slate-300">Capçalera pàg. 12</span>
                        <span className="text-slate-500 hidden sm:inline">files ↓</span>
                    </div>

                    {/* Zona de dades (creix avall) + espai lliure */}
                    <div className="flex-1 my-2 flex flex-col justify-between min-h-0">
                        <div className="flex flex-col gap-1">
                            {slots.map((item) => {
                                const isActive = activeSlot === item.slot;
                                const isDimmed = activeSlot !== null && !isActive;
                                const tone = getSlotTone(item);

                                return (
                                    <button
                                        key={item.slot}
                                        type="button"
                                        onMouseEnter={() => setActiveSlot(item.slot)}
                                        onClick={() =>
                                            setActiveSlot((curr) =>
                                                curr === item.slot ? null : item.slot
                                            )
                                        }
                                        className={`h-7 px-2 rounded-md border flex items-center justify-between gap-1 text-left transition-all duration-150 cursor-pointer ${
                                            item.inserted ? "border-dashed" : ""
                                        } ${
                                            isDimmed
                                                ? "bg-slate-900/20 border-white/5 text-slate-600 opacity-35"
                                                : isActive
                                                ? tone === "amber"
                                                    ? "bg-amber-500/15 border-amber-400 text-amber-200"
                                                    : tone === "emerald"
                                                    ? "bg-emerald-500/15 border-emerald-400 text-emerald-200"
                                                    : "bg-sky-500/15 border-sky-400 text-sky-200"
                                                : "bg-slate-900/50 border-white/10 text-slate-300 hover:border-slate-600"
                                        }`}
                                    >
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <span className="text-[9px] px-1 rounded bg-slate-950/70 border border-white/10 text-slate-400 shrink-0">
                                                {item.tableId}
                                            </span>
                                            <span className="text-[10.5px] font-semibold truncate">
                                                F{item.slot} · {item.name}
                                            </span>
                                        </div>
                                        <span className="text-[9.5px] opacity-75 tabular-nums shrink-0">
                                            {item.offset}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Espai lliure al centre */}
                        <div className="flex-1 mt-1 rounded-md border border-dashed border-white/5 bg-slate-950/35 flex items-center justify-center text-[9.5px] text-slate-500">
                            {mode.freeLabel}
                        </div>
                    </div>

                    {/* Vector d'Adreces de Fila (creix amunt / esquerra) */}
                    <div className="h-[34px] px-2 rounded-md bg-slate-900/80 border border-violet-500/25 flex items-center justify-between gap-1.5 shrink-0">
                        <span className="text-[9.5px] text-violet-300/80 font-bold shrink-0">
                            ← VAF
                        </span>
                        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                            {vafReversed.map((item) => {
                                const isActive = activeSlot === item.slot;
                                const tone = getSlotTone(item);
                                return (
                                    <button
                                        key={item.slot}
                                        type="button"
                                        onMouseEnter={() => setActiveSlot(item.slot)}
                                        onClick={() =>
                                            setActiveSlot((curr) =>
                                                curr === item.slot ? null : item.slot
                                            )
                                        }
                                        className={`px-1.5 py-0.5 rounded border text-[9.5px] transition-all cursor-pointer shrink-0 ${
                                            isActive
                                                ? tone === "amber"
                                                    ? "bg-amber-500/20 border-amber-400 text-amber-200 font-bold"
                                                    : tone === "emerald"
                                                    ? "bg-emerald-500/20 border-emerald-400 text-emerald-200 font-bold"
                                                    : "bg-sky-500/20 border-sky-400 text-sky-200 font-bold"
                                                : "bg-slate-950/70 border-white/10 text-slate-400 hover:text-slate-200"
                                        }`}
                                    >
                                        {item.slot}:{item.offset}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Resum en 1 línia */}
            <div className="mt-3 flex justify-center">
                <div
                    className={`px-3 py-1 rounded-lg border text-[11px] transition-colors ${
                        selectedItem
                            ? TONE_PILL[getSlotTone(selectedItem)]
                            : TONE_PILL[mode.tone]
                    }`}
                >
                    {selectedItem && !(modeId === "compact" && selectedItem.slot === 2)
                        ? `RID (12, ${selectedItem.slot}) → VAF[${selectedItem.slot}] = ${selectedItem.offset} → F${selectedItem.slot} (${selectedItem.tableId})`
                        : mode.note}
                </div>
            </div>
        </div>
    );
}
