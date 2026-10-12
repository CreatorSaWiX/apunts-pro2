"use client";

import React, { useState } from "react";

interface KeyNode {
    id: string;
    label: string;
    y: number;
    targetValId: string | null;
}

interface ValNode {
    id: string;
    label: string;
    y: number;
}

const KEYS: KeyNode[] = [
    { id: "k1", label: "k₁", y: 62, targetValId: "i1" },
    { id: "k2", label: "k₂", y: 98, targetValId: "i2" },
    { id: "k3", label: "k₃", y: 134, targetValId: "i1" }, // Múltiples claus → mateixa informació
    { id: "k4", label: "k₄", y: 170, targetValId: null }, // Funció parcial: no definida (bot)
];

const VALS: ValNode[] = [
    { id: "i1", label: "i₁", y: 72 },
    { id: "i2", label: "i₂", y: 118 },
    { id: "i3", label: "i₃", y: 160 },
];

export default function DictVisualizer() {
    const [hoveredKey, setHoveredKey] = useState<string | null>(null);
    const [hoveredVal, setHoveredVal] = useState<string | null>(null);

    const isEdgeActive = (key: KeyNode): boolean => {
        if (!key.targetValId) return false;
        if (hoveredKey) return hoveredKey === key.id;
        if (hoveredVal) return hoveredVal === key.targetValId;
        return false;
    };

    const isEdgeDimmed = (key: KeyNode): boolean => {
        if (!hoveredKey && !hoveredVal) return false;
        return !isEdgeActive(key);
    };

    const isKeyActive = (keyId: string): boolean => {
        if (hoveredKey === keyId) return true;
        if (hoveredVal) {
            const key = KEYS.find(k => k.id === keyId);
            return key?.targetValId === hoveredVal;
        }
        return false;
    };

    const isValActive = (valId: string): boolean => {
        if (hoveredVal === valId) return true;
        if (hoveredKey) {
            const key = KEYS.find(k => k.id === hoveredKey);
            return key?.targetValId === valId;
        }
        return false;
    };

    return (
        <div className="w-full flex justify-center my-8 not-prose select-none">
            <svg
                viewBox="0 0 540 216"
                className="w-full max-w-lg h-auto overflow-visible"
                aria-label="Funció parcial d'un diccionari f: K -> I"
            >
                <defs>
                    {/* Fletxa estàndard */}
                    <marker
                        id="dict-arrow-default"
                        viewBox="0 0 10 10"
                        refX="8"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto-start-reverse"
                    >
                        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#64748b" />
                    </marker>

                    {/* Fletxa activa */}
                    <marker
                        id="dict-arrow-active"
                        viewBox="0 0 10 10"
                        refX="8"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto-start-reverse"
                    >
                        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8" />
                    </marker>

                    {/* Fletxa de la funció superior */}
                    <marker
                        id="dict-arrow-f"
                        viewBox="0 0 10 10"
                        refX="7"
                        refY="5"
                        markerWidth="5"
                        markerHeight="5"
                        orient="auto-start-reverse"
                    >
                        <path d="M 0 2 L 7 5 L 0 8 z" fill="#94a3b8" />
                    </marker>
                </defs>

                {/* --- CONJUNT DOMINI K --- */}
                <rect
                    x="45"
                    y="32"
                    width="125"
                    height="166"
                    rx="22"
                    className="stroke-slate-700/60 fill-slate-900/10 transition-colors duration-300"
                    strokeWidth="1.2"
                />
                <text
                    x="107"
                    y="22"
                    textAnchor="middle"
                    className="text-sm font-serif italic fill-sky-400 font-semibold"
                >
                    K
                </text>

                {/* --- CONJUNT CODOMINI / RANG I --- */}
                <rect
                    x="370"
                    y="32"
                    width="125"
                    height="166"
                    rx="22"
                    className="stroke-slate-700/60 fill-slate-900/10 transition-colors duration-300"
                    strokeWidth="1.2"
                />
                <text
                    x="432"
                    y="22"
                    textAnchor="middle"
                    className="text-sm font-serif italic fill-emerald-400 font-semibold"
                >
                    I
                </text>

                {/* --- FLETXA SUPERIOR f: K -> I --- */}
                <path
                    d="M 180 18 L 358 18"
                    stroke="#475569"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                    markerEnd="url(#dict-arrow-f)"
                />
                <text
                    x="269"
                    y="13"
                    textAnchor="middle"
                    className="text-[11px] font-serif italic fill-slate-400"
                >
                    f : K → I
                </text>

                {/* --- ARESTES DE MAPATGE (CUBIC BEZIER) --- */}
                {KEYS.map((key) => {
                    if (!key.targetValId) return null;
                    const val = VALS.find((v) => v.id === key.targetValId);
                    if (!val) return null;

                    const startX = 145;
                    const startY = key.y;
                    const endX = 390;
                    const endY = val.y;
                    const c1X = startX + 110;
                    const c2X = endX - 110;

                    const active = isEdgeActive(key);
                    const dimmed = isEdgeDimmed(key);

                    return (
                        <g key={`edge-${key.id}-${val.id}`}>
                            {/* Hitbox transparent per a facilitar el hover */}
                            <path
                                d={`M ${startX} ${startY} C ${c1X} ${startY}, ${c2X} ${endY}, ${endX} ${endY}`}
                                fill="none"
                                stroke="transparent"
                                strokeWidth="16"
                                className="cursor-pointer"
                                onMouseEnter={() => setHoveredKey(key.id)}
                                onMouseLeave={() => setHoveredKey(null)}
                            />
                            {/* Traç visible */}
                            <path
                                d={`M ${startX} ${startY} C ${c1X} ${startY}, ${c2X} ${endY}, ${endX} ${endY}`}
                                fill="none"
                                stroke={active ? "#38bdf8" : "#64748b"}
                                strokeWidth={active ? 2.2 : 1.4}
                                strokeOpacity={dimmed ? 0.2 : active ? 1 : 0.65}
                                markerEnd={active ? "url(#dict-arrow-active)" : "url(#dict-arrow-default)"}
                                className="transition-all duration-200 pointer-events-none"
                            />
                        </g>
                    );
                })}

                {/* --- ELEMENTS DEL CONJUNT K --- */}
                {KEYS.map((key) => {
                    const active = isKeyActive(key.id);
                    const isUnmapped = key.targetValId === null;

                    return (
                        <g
                            key={`node-key-${key.id}`}
                            className="cursor-pointer group"
                            onMouseEnter={() => setHoveredKey(key.id)}
                            onMouseLeave={() => setHoveredKey(null)}
                        >
                            {/* Etiqueta de la clau */}
                            <text
                                x="95"
                                y={key.y + 4}
                                textAnchor="middle"
                                className={`text-xs font-mono font-medium transition-colors duration-200 ${
                                    active
                                        ? "fill-sky-300 font-bold"
                                        : isUnmapped
                                        ? "fill-slate-500"
                                        : "fill-slate-300"
                                }`}
                            >
                                {key.label}
                            </text>

                            {/* Punt d'ancoratge */}
                            <circle
                                cx="145"
                                cy={key.y}
                                r={active ? 5 : 3.5}
                                fill={active ? "#38bdf8" : isUnmapped ? "#475569" : "#64748b"}
                                stroke="#0f172a"
                                strokeWidth="1.5"
                                className="transition-all duration-200"
                            />

                            {/* Indicador de funció parcial (clau no definida) */}
                            {isUnmapped && (
                                <text
                                    x="162"
                                    y={key.y + 3}
                                    className="text-[10px] font-mono fill-slate-500 opacity-60"
                                >
                                    ⊥
                                </text>
                            )}
                        </g>
                    );
                })}

                {/* --- ELEMENTS DEL CONJUNT I --- */}
                {VALS.map((val) => {
                    const active = isValActive(val.id);

                    return (
                        <g
                            key={`node-val-${val.id}`}
                            className="cursor-pointer group"
                            onMouseEnter={() => setHoveredVal(val.id)}
                            onMouseLeave={() => setHoveredVal(null)}
                        >
                            {/* Punt d'ancoratge */}
                            <circle
                                cx="395"
                                cy={val.y}
                                r={active ? 5 : 3.5}
                                fill={active ? "#34d399" : "#64748b"}
                                stroke="#0f172a"
                                strokeWidth="1.5"
                                className="transition-all duration-200"
                            />

                            {/* Etiqueta del valor */}
                            <text
                                x="445"
                                y={val.y + 4}
                                textAnchor="middle"
                                className={`text-xs font-mono font-medium transition-colors duration-200 ${
                                    active ? "fill-emerald-300 font-bold" : "fill-slate-300"
                                }`}
                            >
                                {val.label}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}
