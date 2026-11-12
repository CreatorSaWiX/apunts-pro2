"use client";

import { useState } from "react";

type TierId = "logic" | "virtual" | "physical";
type Tone = "sky" | "violet" | "emerald";

interface TierSpec {
    id: TierId;
    step: string;
    title: string;
    subtitle: string;
    tone: Tone;
    chips: { label: string; sub?: string }[];
    note: string;
}

const TIERS: TierSpec[] = [
    {
        id: "logic",
        step: "1",
        title: "Nivell lògic",
        subtitle: "Taules i índexs",
        tone: "sky",
        chips: [
            { label: "Taules", sub: "relacions" },
            { label: "Índexs B+", sub: "(valor, RID)" },
        ],
        note: "Nivell lògic: treballa amb files i índexs sense conèixer on són al disc",
    },
    {
        id: "virtual",
        step: "2",
        title: "Nivell virtual (SGBD)",
        subtitle: "Tablespaces i RID",
        tone: "violet",
        chips: [
            { label: "Espai Virtual (EV)" },
            { label: "RID", sub: "3B pàg + 1B VAF" },
        ],
        note: "Nivell virtual: adreça cada fila via RID (num_pàg_virtual + elem_VAF)",
    },
    {
        id: "physical",
        step: "3",
        title: "Nivell físic (SO)",
        subtitle: "Disc i E/S",
        tone: "emerald",
        chips: [
            { label: "Fitxer" },
            { label: "Extensions", sub: "consecutives" },
            { label: "Pàgines", sub: "2K–8K" },
        ],
        note: "Nivell físic: extensions de pàgines contigües (unitat real d'E/S: 2K–8K)",
    },
];

const TONE_CARD: Record<Tone, string> = {
    sky: "bg-sky-500/12 border-sky-400/75 text-sky-200 shadow-[0_0_14px_rgba(56,189,248,0.18)]",
    violet: "bg-violet-500/12 border-violet-400/75 text-violet-200 shadow-[0_0_14px_rgba(167,139,250,0.18)]",
    emerald: "bg-emerald-500/12 border-emerald-400/75 text-emerald-200 shadow-[0_0_14px_rgba(16,185,129,0.18)]",
};

const TONE_CHIP: Record<Tone, string> = {
    sky: "bg-sky-500/15 border-sky-400/35 text-sky-200",
    violet: "bg-violet-500/15 border-violet-400/35 text-violet-200",
    emerald: "bg-emerald-500/15 border-emerald-400/35 text-emerald-200",
};

const TONE_PILL: Record<Tone, string> = {
    sky: "bg-sky-500/10 border-sky-500/30 text-sky-300",
    violet: "bg-violet-500/10 border-violet-500/30 text-violet-300",
    emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
};

export default function StorageArchVisualizer() {
    const [activeTier, setActiveTier] = useState<TierId>("virtual");

    const current = TIERS.find((t) => t.id === activeTier) || TIERS[1];

    return (
        <div className="w-full max-w-xl mx-auto my-6 not-prose select-none font-mono text-xs">
            <div className="flex flex-col items-stretch">
                {TIERS.map((tier, idx) => {
                    const isSelected = tier.id === activeTier;
                    const isDimmed = !isSelected;

                    return (
                        <div key={tier.id} className="flex flex-col items-center">
                            <button
                                type="button"
                                onMouseEnter={() => setActiveTier(tier.id)}
                                onClick={() => setActiveTier(tier.id)}
                                className={`w-full px-3 py-2.5 rounded-xl border transition-all duration-150 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-left ${
                                    isSelected
                                        ? TONE_CARD[tier.tone]
                                        : isDimmed
                                        ? "bg-slate-900/35 border-white/10 text-slate-400 hover:border-slate-600"
                                        : ""
                                }`}
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className="h-5 w-5 rounded-md bg-slate-950/60 border border-white/10 text-[10px] font-bold flex items-center justify-center shrink-0">
                                        {tier.step}
                                    </span>
                                    <div className="flex items-baseline gap-2 min-w-0">
                                        <span className="text-[11px] font-bold truncate">
                                            {tier.title}
                                        </span>
                                        <span className="text-[10px] opacity-65 hidden sm:inline truncate">
                                            {tier.subtitle}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-1.5">
                                    {tier.chips.map((chip, cIdx) => (
                                        <div key={chip.label} className="flex items-center gap-1.5">
                                            {idx === 2 && cIdx > 0 && (
                                                <span className="text-[10px] opacity-50">→</span>
                                            )}
                                            <span
                                                className={`px-2 py-0.5 rounded-md border text-[10px] flex items-center gap-1 ${
                                                    isSelected
                                                        ? TONE_CHIP[tier.tone]
                                                        : "bg-slate-950/40 border-white/5 text-slate-400"
                                                }`}
                                            >
                                                <span className="font-semibold">{chip.label}</span>
                                                {chip.sub && (
                                                    <span className="opacity-70 text-[9px]">
                                                        ({chip.sub})
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </button>

                            {idx < TIERS.length - 1 && (
                                <svg
                                    viewBox="0 0 24 22"
                                    className="w-6 h-[22px] pointer-events-none overflow-visible"
                                >
                                    <path
                                        d="M 12,1 L 12,17 M 8,13 L 12,18 L 16,13"
                                        fill="none"
                                        stroke={idx === 0 ? "#818cf8" : "#34d399"}
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeOpacity="0.65"
                                    />
                                </svg>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-3 flex justify-center">
                <div
                    className={`px-3 py-1 rounded-lg border text-[11px] transition-colors ${TONE_PILL[current.tone]}`}
                >
                    {current.note}
                </div>
            </div>
        </div>
    );
}
