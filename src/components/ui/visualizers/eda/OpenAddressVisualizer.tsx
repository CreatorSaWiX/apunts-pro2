"use client";

import React, { useState } from "react";

type Strategy = "linear" | "quadratic" | "double";

interface SlotInfo {
    index: number;
    initialKey: string | null;
}

const SLOTS: SlotInfo[] = [
    { index: 0, initialKey: null },
    { index: 1, initialKey: "k₁" },
    { index: 2, initialKey: "k₂" }, // Col·lisió inicial: h(k) = 2
    { index: 3, initialKey: "k₃" },
    { index: 4, initialKey: "k₄" }, // 1..4 formen un clúster primari
    { index: 5, initialKey: null },
    { index: 6, initialKey: null },
    { index: 7, initialKey: "k₅" },
];

export default function OpenAddressVisualizer() {
    const [strategy, setStrategy] = useState<Strategy>("linear");

    // Coordenades centrals dels slots (0..7)
    // viewBox: 540 x 175
    // Cada slot té amplada 46, gap 16. Amplada total = 480. Marges = 30.
    const slotCenters = [53, 115, 177, 239, 301, 363, 425, 487];
    const slotTopY = 100;
    const slotWidth = 46;
    const slotHeight = 40;

    // Configuració de salts segons estratègia
    // Clau que s'insereix: k, amb h(k) = 2
    // Destí final lliure depèn de l'estratègia
    let targetSlot = 5;
    let hops: {
        from: number;
        to: number;
        label: string;
        isSuccess: boolean;
        arcHeight: number;
    }[] = [];

    if (strategy === "linear") {
        // Sondeig lineal: +1, +1, +1 fins trobar casella 5
        targetSlot = 5;
        hops = [
            { from: 2, to: 3, label: "+1", isSuccess: false, arcHeight: 34 },
            { from: 3, to: 4, label: "+1", isSuccess: false, arcHeight: 34 },
            { from: 4, to: 5, label: "+1", isSuccess: true, arcHeight: 34 },
        ];
    } else if (strategy === "quadratic") {
        // Sondeig quadràtic: +1^2 = 3 (ocupat), +2^2 = +4 -> 2 + 4 = 6 (lliure!)
        targetSlot = 6;
        hops = [
            { from: 2, to: 3, label: "+1²", isSuccess: false, arcHeight: 32 },
            { from: 2, to: 6, label: "+2²", isSuccess: true, arcHeight: 62 },
        ];
    } else {
        // Doble dispersió: pas donat per h2(k) = 3 -> 2 + 3 = 5 (lliure!)
        targetSlot = 5;
        hops = [
            { from: 2, to: 5, label: "+h₂(k)", isSuccess: true, arcHeight: 52 },
        ];
    }

    // Slots visitats (col·lisions intermèdies)
    const visitedCollisionSlots =
        strategy === "linear"
            ? [2, 3, 4]
            : strategy === "quadratic"
            ? [2, 3]
            : [2];

    return (
        <div className="w-full flex flex-col items-center my-6 not-prose select-none font-mono">
            {/* Selector d'estratègia: botons plans minimalistes sense cap contenidor */}
            <div className="flex items-center gap-1.5 mb-2">
                <button
                    type="button"
                    onClick={() => setStrategy("linear")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-150 ${
                        strategy === "linear"
                            ? "bg-sky-500/15 text-sky-300 border border-sky-500/30"
                            : "text-slate-400 hover:text-slate-200 border border-transparent"
                    }`}
                >
                    Lineal
                </button>
                <button
                    type="button"
                    onClick={() => setStrategy("quadratic")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-150 ${
                        strategy === "quadratic"
                            ? "bg-sky-500/15 text-sky-300 border border-sky-500/30"
                            : "text-slate-400 hover:text-slate-200 border border-transparent"
                    }`}
                >
                    Quadràtic
                </button>
                <button
                    type="button"
                    onClick={() => setStrategy("double")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-150 ${
                        strategy === "double"
                            ? "bg-sky-500/15 text-sky-300 border border-sky-500/30"
                            : "text-slate-400 hover:text-slate-200 border border-transparent"
                    }`}
                >
                    Doble dispersió
                </button>
            </div>

            {/* Diagrama vectorial en SVG pla i transparent */}
            <svg
                viewBox="0 0 540 175"
                className="w-full max-w-xl h-auto overflow-visible"
                aria-label="Visualització de sondeig en adreçament obert"
            >
                <defs>
                    {/* Fletxa per salt que col·lisiona (ambre) */}
                    <marker
                        id="probe-arrow-amber"
                        viewBox="0 0 10 10"
                        refX="8"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto"
                    >
                        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f59e0b" />
                    </marker>

                    {/* Fletxa per inserció exitosa (emerald) */}
                    <marker
                        id="probe-arrow-emerald"
                        viewBox="0 0 10 10"
                        refX="8"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto"
                    >
                        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#10b981" />
                    </marker>

                    {/* Fletxa d'entrada inicial de h(k) (sky) */}
                    <marker
                        id="probe-arrow-sky"
                        viewBox="0 0 10 10"
                        refX="8"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto"
                    >
                        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8" />
                    </marker>
                </defs>

                {/* 1. FLETXA D'ENTRADA DE LA CLAU: h(k) -> Slot 2 */}
                <g>
                    <line
                        x1={slotCenters[2]}
                        y1={24}
                        x2={slotCenters[2]}
                        y2={slotTopY - 6}
                        stroke="#38bdf8"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                        markerEnd="url(#probe-arrow-sky)"
                    />
                    <text
                        x={slotCenters[2]}
                        y={16}
                        textAnchor="middle"
                        className="text-[11px] font-bold fill-sky-300"
                    >
                        h(k)
                    </text>
                </g>

                {/* 2. ARCS DE SONDEIG (HOPS) */}
                {hops.map((hop, idx) => {
                    const x1 = slotCenters[hop.from];
                    const x2 = slotCenters[hop.to];
                    const midX = (x1 + x2) / 2;
                    const peakY = slotTopY - hop.arcHeight;
                    const strokeColor = hop.isSuccess ? "#10b981" : "#f59e0b";
                    const marker = hop.isSuccess
                        ? "url(#probe-arrow-emerald)"
                        : "url(#probe-arrow-amber)";

                    // Traçat corbat suau cap amunt
                    const pathD = `M ${x1} ${slotTopY - 2} Q ${midX} ${peakY - 14} ${x2} ${slotTopY - 2}`;

                    return (
                        <g key={`hop-${idx}`}>
                            <path
                                d={pathD}
                                fill="none"
                                stroke={strokeColor}
                                strokeWidth="1.75"
                                markerEnd={marker}
                                className="transition-all duration-300"
                            />
                            {/* Etiqueta de la distància de salt */}
                            <rect
                                x={midX - 16}
                                y={peakY - 18}
                                width="32"
                                height="15"
                                rx="4"
                                fill="#020617"
                                stroke={strokeColor}
                                strokeWidth="1"
                                fillOpacity="0.85"
                            />
                            <text
                                x={midX}
                                y={peakY - 7}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="text-[10px] font-bold"
                                fill={strokeColor}
                            >
                                {hop.label}
                            </text>
                        </g>
                    );
                })}

                {/* 3. CASEfLLES DE LA TAULA HASH (SLOTS 0..7) */}
                {SLOTS.map((slot) => {
                    const cx = slotCenters[slot.index];
                    const leftX = cx - slotWidth / 2;
                    const isTarget = slot.index === targetSlot;
                    const isCollision = visitedCollisionSlots.includes(slot.index);
                    const isOccupiedInitial = slot.initialKey !== null;

                    let bgFill = "#0a0d14";
                    let strokeColor = "#1e293b";
                    let strokeWidth = 1;

                    if (isTarget) {
                        bgFill = "rgba(16, 185, 129, 0.12)";
                        strokeColor = "#10b981";
                        strokeWidth = 1.75;
                    } else if (isCollision) {
                        bgFill = "rgba(245, 158, 11, 0.08)";
                        strokeColor = "#f59e0b";
                        strokeWidth = 1.5;
                    } else if (isOccupiedInitial) {
                        bgFill = "#0f172a";
                        strokeColor = "#334155";
                    }

                    return (
                        <g key={`slot-${slot.index}`}>
                            {/* Rectangle del slot */}
                            <rect
                                x={leftX}
                                y={slotTopY}
                                width={slotWidth}
                                height={slotHeight}
                                rx="8"
                                fill={bgFill}
                                stroke={strokeColor}
                                strokeWidth={strokeWidth}
                                className="transition-all duration-300"
                            />

                            {/* Contingut del slot */}
                            {isTarget ? (
                                <text
                                    x={cx}
                                    y={slotTopY + slotHeight / 2 + 1}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className="text-xs font-bold fill-emerald-300"
                                >
                                    k
                                </text>
                            ) : isOccupiedInitial ? (
                                <text
                                    x={cx}
                                    y={slotTopY + slotHeight / 2 + 1}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className={`text-xs font-medium ${
                                        isCollision ? "fill-amber-300" : "fill-slate-400"
                                    }`}
                                >
                                    {slot.initialKey}
                                </text>
                            ) : null}

                            {/* Índex del vector [0..7] */}
                            <text
                                x={cx}
                                y={slotTopY + slotHeight + 16}
                                textAnchor="middle"
                                className={`text-[10px] font-bold ${
                                    isTarget
                                        ? "fill-emerald-400"
                                        : isCollision
                                        ? "fill-amber-400"
                                        : "fill-slate-500"
                                }`}
                            >
                                [{slot.index}]
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}
