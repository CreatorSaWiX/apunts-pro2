"use client";

import React, { useState } from "react";

interface DirectKey {
    id: string;
    keyVal: number;
    label: string;
    y: number;
    targetSlot: number;
}

const KEYS: DirectKey[] = [
    { id: "k1", keyVal: 1, label: "k = 1", y: 64, targetSlot: 1 },
    { id: "k2", keyVal: 3, label: "k = 3", y: 114, targetSlot: 3 },
    { id: "k3", keyVal: 6, label: "k = 6", y: 164, targetSlot: 6 },
];

interface Slot {
    index: number;
    label: string;
    y: number;
    keyId: string | null;
    isDots?: boolean;
}

const SLOTS: Slot[] = [
    { index: 0, label: "T[0]", y: 32, keyId: null },
    { index: 1, label: "T[1]", y: 58, keyId: "k1" },
    { index: 2, label: "T[2]", y: 84, keyId: null },
    { index: 3, label: "T[3]", y: 110, keyId: "k2" },
    { index: 4, label: "T[4]", y: 136, keyId: null },
    { index: 5, label: "T[5]", y: 162, keyId: null },
    { index: 6, label: "T[6]", y: 188, keyId: "k3" },
    { index: 7, label: "T[m-1]", y: 214, keyId: null },
];

export default function DirectAddressVisualizer() {
    const [hoveredKey, setHoveredKey] = useState<string | null>(null);
    const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);

    const activeSlotIndex =
        hoveredSlot !== null
            ? hoveredSlot
            : hoveredKey
            ? KEYS.find((k) => k.id === hoveredKey)?.targetSlot ?? null
            : null;

    const activeKeyId =
        hoveredKey !== null
            ? hoveredKey
            : hoveredSlot !== null
            ? SLOTS.find((s) => s.index === hoveredSlot)?.keyId ?? null
            : null;

    return (
        <div className="w-full flex justify-center my-6 not-prose select-none">
            <svg
                viewBox="0 0 520 250"
                className="w-full max-w-lg h-auto overflow-visible font-mono"
                aria-label="Taula d'accés directe k -> T[k]"
            >
                <defs>
                    <marker
                        id="direct-arrow-active"
                        viewBox="0 0 10 10"
                        refX="8"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto"
                    >
                        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8" />
                    </marker>

                    <marker
                        id="direct-arrow-default"
                        viewBox="0 0 10 10"
                        refX="8"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto"
                    >
                        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#475569" />
                    </marker>
                </defs>

                {/* 1. UNIVERS DE CLAUS U */}
                <g>
                    {/* Contorn subtil de l'univers U */}
                    <rect
                        x="32"
                        y="24"
                        width="120"
                        height="200"
                        rx="16"
                        fill="#0b1120"
                        fillOpacity="0.3"
                        stroke="#1e293b"
                        strokeWidth="1.2"
                        strokeDasharray="4 3"
                    />

                    {/* Símbol de l'univers U */}
                    <text
                        x="46"
                        y="44"
                        className="text-xs font-bold fill-slate-400"
                    >
                        U
                    </text>

                    {/* Claus K ⊆ U */}
                    {KEYS.map((k) => {
                        const isKeyActive = activeKeyId === k.id;
                        const isDimmed =
                            (hoveredKey !== null || hoveredSlot !== null) && !isKeyActive;

                        return (
                            <g
                                key={k.id}
                                className="cursor-pointer transition-opacity duration-200"
                                style={{ opacity: isDimmed ? 0.3 : 1 }}
                                onMouseEnter={() => setHoveredKey(k.id)}
                                onMouseLeave={() => setHoveredKey(null)}
                            >
                                <rect
                                    x="48"
                                    y={k.y - 14}
                                    width="88"
                                    height="28"
                                    rx="8"
                                    fill={isKeyActive ? "rgba(56, 189, 248, 0.12)" : "#0f172a"}
                                    stroke={isKeyActive ? "#38bdf8" : "#334155"}
                                    strokeWidth={isKeyActive ? "1.5" : "1"}
                                    className="transition-all duration-200"
                                />
                                <text
                                    x="92"
                                    y={k.y + 4}
                                    textAnchor="middle"
                                    className={`text-[11px] font-semibold transition-colors duration-200 ${
                                        isKeyActive ? "fill-sky-300" : "fill-slate-300"
                                    }`}
                                >
                                    {k.label}
                                </text>

                                {/* Punt d'ancoratge */}
                                <circle
                                    cx="136"
                                    cy={k.y}
                                    r="2.5"
                                    fill={isKeyActive ? "#38bdf8" : "#475569"}
                                    className="transition-colors duration-200"
                                />
                            </g>
                        );
                    })}
                </g>

                {/* 2. CONNEXIONS DIRECTES k -> T[k] */}
                <g>
                    {KEYS.map((k) => {
                        const targetSlot = SLOTS.find((s) => s.index === k.targetSlot);
                        if (!targetSlot) return null;

                        const isKeyActive = activeKeyId === k.id;
                        const isDimmed =
                            (hoveredKey !== null || hoveredSlot !== null) && !isKeyActive;

                        const startX = 136;
                        const startY = k.y;
                        const endX = 330;
                        const endY = targetSlot.y;

                        const dx = (endX - startX) * 0.55;
                        const pathD = `M ${startX} ${startY} C ${startX + dx} ${startY}, ${
                            endX - dx
                        } ${endY}, ${endX} ${endY}`;

                        return (
                            <path
                                key={`edge-${k.id}`}
                                d={pathD}
                                fill="none"
                                stroke={isKeyActive ? "#38bdf8" : "#334155"}
                                strokeWidth={isKeyActive ? 2 : 1}
                                strokeDasharray={isKeyActive ? "none" : "3 3"}
                                markerEnd={
                                    isKeyActive
                                        ? "url(#direct-arrow-active)"
                                        : "url(#direct-arrow-default)"
                                }
                                style={{ opacity: isDimmed ? 0.2 : 1 }}
                                className="transition-all duration-200"
                            />
                        );
                    })}
                </g>

                {/* 3. VECTOR D'ACCÉS DIRECTE T[0..m-1] */}
                <g>
                    {/* Etiqueta superior T */}
                    <text
                        x="376"
                        y="18"
                        textAnchor="middle"
                        className="text-xs font-bold fill-slate-400"
                    >
                        T
                    </text>

                    {SLOTS.map((s) => {
                        const isSlotActive = activeSlotIndex === s.index;
                        const hasKey = s.keyId !== null;
                        const isDimmed =
                            (hoveredKey !== null || hoveredSlot !== null) && !isSlotActive;

                        return (
                            <g
                                key={s.index}
                                className="cursor-pointer transition-opacity duration-200"
                                style={{ opacity: isDimmed ? 0.3 : 1 }}
                                onMouseEnter={() => setHoveredSlot(s.index)}
                                onMouseLeave={() => setHoveredSlot(null)}
                            >
                                {/* Índex a l'esquerra: T[i] */}
                                <text
                                    x="320"
                                    y={s.y + 4}
                                    textAnchor="end"
                                    className={`text-[10px] transition-colors duration-200 ${
                                        isSlotActive
                                            ? "fill-sky-300 font-bold"
                                            : "fill-slate-500"
                                    }`}
                                >
                                    {s.label}
                                </text>

                                {/* Casella de la taula */}
                                <rect
                                    x="334"
                                    y={s.y - 11}
                                    width="84"
                                    height="22"
                                    rx="4"
                                    fill={
                                        isSlotActive
                                            ? hasKey
                                                ? "rgba(56, 189, 248, 0.15)"
                                                : "rgba(100, 116, 139, 0.1)"
                                            : hasKey
                                            ? "#0f172a"
                                            : "#080c14"
                                    }
                                    stroke={
                                        isSlotActive
                                            ? hasKey
                                                ? "#38bdf8"
                                                : "#64748b"
                                            : hasKey
                                            ? "#334155"
                                            : "#1e293b"
                                    }
                                    strokeWidth={isSlotActive ? "1.5" : "1"}
                                    className="transition-all duration-200"
                                />

                                {/* Contingut de la casella: clau o buit (∅) */}
                                <text
                                    x="376"
                                    y={s.y + 4}
                                    textAnchor="middle"
                                    className={`text-[10px] transition-colors duration-200 ${
                                        hasKey
                                            ? isSlotActive
                                                ? "fill-sky-300 font-bold"
                                                : "fill-slate-300 font-medium"
                                            : "fill-slate-600 font-light"
                                    }`}
                                >
                                    {hasKey ? `k = ${s.index}` : "∅"}
                                </text>
                            </g>
                        );
                    })}
                </g>
            </svg>
        </div>
    );
}
