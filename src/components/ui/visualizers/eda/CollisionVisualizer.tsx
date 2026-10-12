"use client";

import React, { useState } from "react";

export default function CollisionVisualizer() {
    const [hoveredTarget, setHoveredTarget] = useState<"k1" | "k2" | "slot" | null>(null);

    const isK1Active = hoveredTarget === "k1" || hoveredTarget === "slot" || hoveredTarget === null;
    const isK2Active = hoveredTarget === "k2" || hoveredTarget === "slot" || hoveredTarget === null;
    const isHoveringSpecific = hoveredTarget !== null;

    return (
        <div className="w-full flex justify-center my-6 not-prose select-none">
            <svg
                viewBox="0 0 540 200"
                className="w-full max-w-lg h-auto overflow-visible font-mono"
                aria-label="Col·lisió a la taula hash: h(k1) = h(k2)"
            >
                <defs>
                    <marker
                        id="col-arrow-amber"
                        viewBox="0 0 10 10"
                        refX="7"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto"
                    >
                        <path d="M 0 2 L 7 5 L 0 8 z" fill="#f59e0b" />
                    </marker>

                    <marker
                        id="col-arrow-dim"
                        viewBox="0 0 10 10"
                        refX="7"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto"
                    >
                        <path d="M 0 2 L 7 5 L 0 8 z" fill="#334155" />
                    </marker>
                </defs>

                {/* 1. CLAUS D'ENTRADA (ESQUERRA): k1 != k2 */}
                <g>
                    {/* Clau k1 */}
                    <g
                        className="cursor-pointer transition-opacity duration-200"
                        style={{ opacity: hoveredTarget === "k2" ? 0.35 : 1 }}
                        onMouseEnter={() => setHoveredTarget("k1")}
                        onMouseLeave={() => setHoveredTarget(null)}
                    >
                        <rect
                            x="36"
                            y="34"
                            width="76"
                            height="32"
                            rx="8"
                            fill={hoveredTarget === "k1" ? "rgba(245, 158, 11, 0.15)" : "#0f172a"}
                            stroke={hoveredTarget === "k1" ? "#f59e0b" : "#334155"}
                            strokeWidth={hoveredTarget === "k1" ? 1.5 : 1}
                            className="transition-all duration-200"
                        />
                        <text
                            x="74"
                            y="54"
                            textAnchor="middle"
                            className={`text-xs font-semibold transition-colors duration-200 ${
                                hoveredTarget === "k1" ? "fill-amber-300" : "fill-slate-300"
                            }`}
                        >
                            k₁
                        </text>
                        <circle
                            cx="112"
                            cy="50"
                            r="2.5"
                            fill={hoveredTarget === "k1" ? "#f59e0b" : "#64748b"}
                            className="transition-colors duration-200"
                        />
                    </g>

                    {/* Símbol de diferència k1 != k2 */}
                    <text
                        x="74"
                        y="104"
                        textAnchor="middle"
                        className="text-[11px] font-bold fill-slate-500"
                    >
                        k₁ ≠ k₂
                    </text>

                    {/* Clau k2 */}
                    <g
                        className="cursor-pointer transition-opacity duration-200"
                        style={{ opacity: hoveredTarget === "k1" ? 0.35 : 1 }}
                        onMouseEnter={() => setHoveredTarget("k2")}
                        onMouseLeave={() => setHoveredTarget(null)}
                    >
                        <rect
                            x="36"
                            y="134"
                            width="76"
                            height="32"
                            rx="8"
                            fill={hoveredTarget === "k2" ? "rgba(245, 158, 11, 0.15)" : "#0f172a"}
                            stroke={hoveredTarget === "k2" ? "#f59e0b" : "#334155"}
                            strokeWidth={hoveredTarget === "k2" ? 1.5 : 1}
                            className="transition-all duration-200"
                        />
                        <text
                            x="74"
                            y="154"
                            textAnchor="middle"
                            className={`text-xs font-semibold transition-colors duration-200 ${
                                hoveredTarget === "k2" ? "fill-amber-300" : "fill-slate-300"
                            }`}
                        >
                            k₂
                        </text>
                        <circle
                            cx="112"
                            cy="150"
                            r="2.5"
                            fill={hoveredTarget === "k2" ? "#f59e0b" : "#64748b"}
                            className="transition-colors duration-200"
                        />
                    </g>
                </g>

                {/* 2. FUNCIÓ HASH INTERMÈDIA h(·) */}
                <g>
                    <circle
                        cx="180"
                        cy="100"
                        r="18"
                        fill="#0b1120"
                        stroke={isHoveringSpecific ? "#f59e0b" : "#334155"}
                        strokeWidth="1.2"
                        className="transition-colors duration-200"
                    />
                    <text
                        x="180"
                        y="104"
                        textAnchor="middle"
                        className={`text-[11px] font-bold transition-colors duration-200 ${
                            isHoveringSpecific ? "fill-amber-400" : "fill-slate-400"
                        }`}
                    >
                        h
                    </text>
                </g>

                {/* 3. FLETXES I FORMULA h(k1) = h(k2) */}
                <g>
                    {/* k1 -> h */}
                    <path
                        d="M 112 50 C 145 50, 155 85, 164 92"
                        fill="none"
                        stroke={isK1Active ? "#f59e0b" : "#334155"}
                        strokeWidth={isK1Active && hoveredTarget !== null ? 2 : 1.2}
                        className="transition-all duration-200"
                    />
                    {/* k2 -> h */}
                    <path
                        d="M 112 150 C 145 150, 155 115, 164 108"
                        fill="none"
                        stroke={isK2Active ? "#f59e0b" : "#334155"}
                        strokeWidth={isK2Active && hoveredTarget !== null ? 2 : 1.2}
                        className="transition-all duration-200"
                    />

                    {/* h -> T[j] (línia de sortida de col·lisió) */}
                    <path
                        d="M 198 100 L 326 100"
                        fill="none"
                        stroke={isHoveringSpecific ? "#f59e0b" : "#d97706"}
                        strokeWidth={isHoveringSpecific ? 2.2 : 1.5}
                        markerEnd="url(#col-arrow-amber)"
                        className="transition-all duration-200"
                    />

                    {/* Etiqueta formal h(k1) = h(k2) clarament separada per sobre de la fletxa */}
                    <text
                        x="262"
                        y="82"
                        textAnchor="middle"
                        className={`text-[10px] font-semibold transition-colors duration-200 ${
                            isHoveringSpecific ? "fill-amber-300 font-bold" : "fill-amber-400/90"
                        }`}
                    >
                        h(k₁) = h(k₂)
                    </text>
                </g>

                {/* 4. TAULA HASH T (DRETA) */}
                <g>
                    {/* Etiqueta T */}
                    <text
                        x="430"
                        y="14"
                        textAnchor="middle"
                        className="text-xs font-bold fill-slate-400"
                    >
                        T
                    </text>

                    {/* Casella T[0] (buida) */}
                    <g opacity="0.4">
                        <text x="372" y="38" textAnchor="end" className="text-[10px] fill-slate-500">
                            T[0]
                        </text>
                        <rect x="382" y="24" width="96" height="22" rx="4" fill="#080c14" stroke="#1e293b" />
                        <text x="430" y="38" textAnchor="middle" className="text-[10px] fill-slate-600">
                            ∅
                        </text>
                    </g>

                    {/* Punts suspensius */}
                    <text x="430" y="62" textAnchor="middle" className="text-[10px] fill-slate-600">
                        ···
                    </text>

                    {/* Casella T[j] - COL·LISIÓ */}
                    <g
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredTarget("slot")}
                        onMouseLeave={() => setHoveredTarget(null)}
                    >
                        <text
                            x="372"
                            y="104"
                            textAnchor="end"
                            className={`text-[10px] font-bold transition-colors duration-200 ${
                                isHoveringSpecific ? "fill-amber-300" : "fill-amber-400"
                            }`}
                        >
                            T[j]
                        </text>
                        <rect
                            x="382"
                            y="84"
                            width="96"
                            height="32"
                            rx="6"
                            fill="rgba(245, 158, 11, 0.12)"
                            stroke="#f59e0b"
                            strokeWidth={hoveredTarget === "slot" ? 2 : 1.5}
                            className="transition-all duration-200"
                        />
                        {/* Contingut col·lisionant: k1, k2 */}
                        <text
                            x="430"
                            y="104"
                            textAnchor="middle"
                            className="text-[11px] font-bold fill-amber-300"
                        >
                            k₁, k₂
                        </text>
                    </g>

                    {/* Punts suspensius */}
                    <text x="430" y="142" textAnchor="middle" className="text-[10px] fill-slate-600">
                        ···
                    </text>

                    {/* Casella T[m-1] (buida) */}
                    <g opacity="0.4">
                        <text x="372" y="168" textAnchor="end" className="text-[10px] fill-slate-500">
                            T[m-1]
                        </text>
                        <rect x="382" y="154" width="96" height="22" rx="4" fill="#080c14" stroke="#1e293b" />
                        <text x="430" y="168" textAnchor="middle" className="text-[10px] fill-slate-600">
                            ∅
                        </text>
                    </g>
                </g>
            </svg>
        </div>
    );
}
