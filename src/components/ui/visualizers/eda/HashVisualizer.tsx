"use client";

import React, { useState } from "react";

interface KeyItem {
    id: string;
    label: string;
    y: number;
    targetSlot: number;
    isCollision?: boolean;
}

const KEYS: KeyItem[] = [
    { id: "k1", label: "k₁", y: 56, targetSlot: 0 },
    { id: "k2", label: "k₂", y: 92, targetSlot: 2, isCollision: true },
    { id: "k3", label: "k₃", y: 128, targetSlot: 2, isCollision: true },
    { id: "k4", label: "k₄", y: 164, targetSlot: 4 },
];

const SLOTS = [
    { index: 0, label: "T[0]", y: 44, keys: ["k₁"] },
    { index: 1, label: "T[1]", y: 72, keys: [] },
    { index: 2, label: "T[2]", y: 100, keys: ["k₂", "k₃"], isCollision: true },
    { index: 3, label: "···", y: 128, keys: [], isDots: true },
    { index: 4, label: "T[m-1]", y: 156, keys: ["k₄"] },
];

export default function HashVisualizer() {
    const [hoveredKey, setHoveredKey] = useState<string | null>(null);
    const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);

    const activeSlot =
        hoveredSlot !== null
            ? hoveredSlot
            : hoveredKey
            ? KEYS.find((k) => k.id === hoveredKey)?.targetSlot ?? null
            : null;

    return (
        <div className="w-full flex justify-center my-6 not-prose select-none">
            <svg
                viewBox="0 0 540 210"
                className="w-full max-w-xl h-auto overflow-visible font-mono"
                aria-label="Funció de dispersió i taula de hash"
            >
                <defs>
                    {/* Fletxa per defecte (sky) */}
                    <marker
                        id="hash-arrow-default"
                        viewBox="0 0 10 10"
                        refX="8"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto"
                    >
                        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8" />
                    </marker>

                    {/* Fletxa per col·lisió (amber) */}
                    <marker
                        id="hash-arrow-collision"
                        viewBox="0 0 10 10"
                        refX="8"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto"
                    >
                        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#fbbf24" />
                    </marker>

                    {/* Fletxa atenuada */}
                    <marker
                        id="hash-arrow-dim"
                        viewBox="0 0 10 10"
                        refX="8"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto"
                    >
                        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#334155" />
                    </marker>
                </defs>

                {/* ========================================================= */}
                {/* 1. UNIVERS DE CLAUS K (ESQUERRA)                          */}
                {/* ========================================================= */}
                <g>
                    {/* Contorn subtil de l'univers */}
                    <rect
                        x="24"
                        y="22"
                        width="132"
                        height="166"
                        rx="16"
                        fill="#0b1120"
                        fillOpacity="0.4"
                        stroke="#1e293b"
                        strokeWidth="1.2"
                        strokeDasharray="4 3"
                    />

                    {/* Etiqueta Univers K */}
                    <text
                        x="38"
                        y="42"
                        className="text-xs font-bold fill-slate-300"
                    >
                        K
                    </text>
                    <text
                        x="52"
                        y="42"
                        className="text-[9px] fill-slate-600 font-normal"
                    >
                        |K| ≫ m
                    </text>

                    {/* Elements k1..k4 */}
                    {KEYS.map((k) => {
                        const isHovered = hoveredKey === k.id;
                        const isTargetActive = activeSlot === k.targetSlot;
                        const isDimmed =
                            (hoveredKey !== null && !isHovered) ||
                            (hoveredSlot !== null && !isTargetActive);

                        return (
                            <g
                                key={k.id}
                                className="cursor-pointer transition-opacity duration-200"
                                style={{ opacity: isDimmed ? 0.3 : 1 }}
                                onMouseEnter={() => setHoveredKey(k.id)}
                                onMouseLeave={() => setHoveredKey(null)}
                            >
                                <rect
                                    x="40"
                                    y={k.y - 12}
                                    width="100"
                                    height="24"
                                    rx="6"
                                    fill={
                                        k.isCollision
                                            ? isTargetActive
                                                ? "rgba(251, 191, 36, 0.12)"
                                                : "#0f172a"
                                            : isTargetActive
                                            ? "rgba(56, 189, 248, 0.12)"
                                            : "#0f172a"
                                    }
                                    stroke={
                                        k.isCollision
                                            ? isTargetActive
                                                ? "#fbbf24"
                                                : "#334155"
                                            : isTargetActive
                                            ? "#38bdf8"
                                            : "#334155"
                                    }
                                    strokeWidth={isTargetActive ? "1.5" : "1"}
                                    className="transition-all duration-200"
                                />
                                <text
                                    x="90"
                                    y={k.y + 4}
                                    textAnchor="middle"
                                    className={`text-[11px] font-semibold transition-colors duration-200 ${
                                        k.isCollision
                                            ? isTargetActive
                                                ? "fill-amber-300"
                                                : "fill-slate-300"
                                            : isTargetActive
                                            ? "fill-sky-300"
                                            : "fill-slate-300"
                                    }`}
                                >
                                    {k.label}
                                </text>

                                {/* Punt d'ancoratge de sortida */}
                                <circle
                                    cx="140"
                                    cy={k.y}
                                    r="2.5"
                                    fill={
                                        k.isCollision
                                            ? isTargetActive
                                                ? "#fbbf24"
                                                : "#475569"
                                            : isTargetActive
                                            ? "#38bdf8"
                                            : "#475569"
                                    }
                                    className="transition-colors duration-200"
                                />
                            </g>
                        );
                    })}
                </g>

                {/* ========================================================= */}
                {/* 2. FUNCIÓ DE DISPERSIÓ h(k) I FLETXES DE MAPATGE          */}
                {/* ========================================================= */}
                <g>
                    {/* Etiqueta discreta al centre */}
                    <text
                        x="270"
                        y="34"
                        textAnchor="middle"
                        className="text-[11px] font-semibold fill-sky-400"
                    >
                        h(k)
                    </text>

                    {/* Fletxes de mapatge */}
                    {KEYS.map((k) => {
                        const target = SLOTS.find((s) => s.index === k.targetSlot)!;
                        const isHovered = hoveredKey === k.id;
                        const isTargetActive = activeSlot === k.targetSlot;
                        const isDimmed =
                            (hoveredKey !== null && !isHovered) ||
                            (hoveredSlot !== null && !isTargetActive);

                        // Coordenades d'inici i final
                        const startX = 142;
                        const startY = k.y;
                        const endX = 398;
                        // Desplaçament lleuger si hi ha dues claus a la mateixa casella perquè es vegin ambdues fletxes entrant
                        const offset = k.id === "k2" ? -3 : k.id === "k3" ? 3 : 0;
                        const endY = target.y + offset;

                        // Punts de control per a corba suau en S
                        const c1X = startX + 90;
                        const c1Y = startY;
                        const c2X = endX - 90;
                        const c2Y = endY;

                        const isCollision = k.isCollision;
                        const strokeColor = isDimmed
                            ? "#1e293b"
                            : isCollision
                            ? isTargetActive
                                ? "#fbbf24"
                                : "#d97706"
                            : isTargetActive
                            ? "#38bdf8"
                            : "#0284c7";

                        const marker = isDimmed
                            ? "url(#hash-arrow-dim)"
                            : isCollision
                            ? "url(#hash-arrow-collision)"
                            : "url(#hash-arrow-default)";

                        return (
                            <path
                                key={`arrow-${k.id}`}
                                d={`M ${startX} ${startY} C ${c1X} ${c1Y}, ${c2X} ${c2Y}, ${endX} ${endY}`}
                                fill="none"
                                stroke={strokeColor}
                                strokeWidth={isTargetActive ? 2 : 1.2}
                                strokeOpacity={isDimmed ? 0.2 : 0.85}
                                markerEnd={marker}
                                className="transition-all duration-200 pointer-events-none"
                            />
                        );
                    })}
                </g>

                {/* ========================================================= */}
                {/* 3. TAULA T (DRETA)                                        */}
                {/* ========================================================= */}
                <g>
                    {/* Capçalera discreta de la taula */}
                    <text
                        x="445"
                        y="30"
                        textAnchor="middle"
                        className="text-xs font-bold fill-slate-300"
                    >
                        T
                    </text>

                    {/* Caselles de la taula */}
                    {SLOTS.map((slot) => {
                        const isTargetActive = activeSlot === slot.index;
                        const isDimmed =
                            (hoveredSlot !== null && !isTargetActive) ||
                            (hoveredKey !== null && !isTargetActive);

                        if (slot.isDots) {
                            return (
                                <g key="slot-dots" style={{ opacity: isDimmed ? 0.3 : 1 }}>
                                    <text
                                        x="445"
                                        y={slot.y + 4}
                                        textAnchor="middle"
                                        className="text-xs fill-slate-600 tracking-widest select-none"
                                    >
                                        ⋮
                                    </text>
                                </g>
                            );
                        }

                        return (
                            <g
                                key={`slot-${slot.index}`}
                                className="cursor-pointer transition-opacity duration-200"
                                style={{ opacity: isDimmed ? 0.3 : 1 }}
                                onMouseEnter={() => setHoveredSlot(slot.index)}
                                onMouseLeave={() => setHoveredSlot(null)}
                            >
                                <rect
                                    x="400"
                                    y={slot.y - 11}
                                    width="90"
                                    height="22"
                                    rx="5"
                                    fill={
                                        slot.isCollision
                                            ? isTargetActive
                                                ? "rgba(251, 191, 36, 0.15)"
                                                : "rgba(251, 191, 36, 0.05)"
                                            : isTargetActive
                                            ? "rgba(56, 189, 248, 0.12)"
                                            : "#0f172a"
                                    }
                                    stroke={
                                        slot.isCollision
                                            ? isTargetActive
                                                ? "#fbbf24"
                                                : "#78350f"
                                            : isTargetActive
                                            ? "#38bdf8"
                                            : "#334155"
                                    }
                                    strokeWidth={isTargetActive ? "1.5" : "1"}
                                    className="transition-all duration-200"
                                />

                                <text
                                    x="445"
                                    y={slot.y + 4}
                                    textAnchor="middle"
                                    className={`text-[10px] font-medium transition-colors duration-200 ${
                                        slot.isCollision
                                            ? isTargetActive
                                                ? "fill-amber-300"
                                                : "fill-amber-400/80"
                                            : isTargetActive
                                            ? "fill-sky-300"
                                            : "fill-slate-400"
                                    }`}
                                >
                                    {slot.label}
                                </text>
                            </g>
                        );
                    })}

                    {/* Peu discret de la taula */}
                    <text
                        x="445"
                        y="188"
                        textAnchor="middle"
                        className="text-[9px] fill-slate-600 font-normal"
                    >
                        mida m
                    </text>
                </g>
            </svg>
        </div>
    );
}
