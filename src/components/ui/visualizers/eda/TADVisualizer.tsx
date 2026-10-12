"use client";

import React, { useState } from "react";

export default function TADVisualizer() {
    const [hovered, setHovered] = useState<"tad" | "hash" | "avl" | null>(null);

    const isHashActive = hovered === "hash" || hovered === "tad";
    const isAvlActive = hovered === "avl" || hovered === "tad";
    const isHashDimmed = hovered === "avl";
    const isAvlDimmed = hovered === "hash";

    return (
        <div className="w-full flex justify-center my-6 not-prose select-none">
            <svg
                viewBox="0 0 620 170"
                className="w-full max-w-xl h-auto overflow-visible"
                aria-label="TAD especificació i implementacions"
            >
                <defs>
                    {/* Fletxa neutra */}
                    <marker
                        id="tad-arrow-default"
                        viewBox="0 0 10 10"
                        refX="8"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto-start-reverse"
                    >
                        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#475569" />
                    </marker>

                    {/* Fletxa activa per Hash (sky) */}
                    <marker
                        id="tad-arrow-sky"
                        viewBox="0 0 10 10"
                        refX="8"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto-start-reverse"
                    >
                        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8" />
                    </marker>

                    {/* Fletxa activa per AVL (emerald) */}
                    <marker
                        id="tad-arrow-emerald"
                        viewBox="0 0 10 10"
                        refX="8"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto-start-reverse"
                    >
                        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#34d399" />
                    </marker>
                </defs>

                {/* ========================================================= */}
                {/* 1. BLOC ESQUERRE: TAD (ESPECIFICACIÓ / "QUÈ")             */}
                {/* ========================================================= */}
                <g
                    className="cursor-pointer transition-opacity duration-200"
                    onMouseEnter={() => setHovered("tad")}
                    onMouseLeave={() => setHovered(null)}
                >
                    {/* Caixa de contorn */}
                    <rect
                        x="18"
                        y="15"
                        width="180"
                        height="140"
                        rx="10"
                        fill="#0b1120"
                        fillOpacity="0.5"
                        stroke={hovered === "tad" ? "#38bdf8" : "#334155"}
                        strokeWidth={hovered === "tad" ? "1.8" : "1.2"}
                        strokeDasharray={hovered === "tad" ? "none" : "none"}
                        className="transition-all duration-200"
                    />

                    {/* Capçalera */}
                    <text
                        x="34"
                        y="40"
                        className="text-xs font-mono font-bold fill-sky-400"
                    >
                        TAD
                    </text>

                    {/* Badge 'què' */}
                    <rect
                        x="142"
                        y="27"
                        width="42"
                        height="17"
                        rx="4"
                        fill="rgba(56, 189, 248, 0.08)"
                        stroke={hovered === "tad" ? "#38bdf8" : "#0284c7"}
                        strokeWidth="1"
                        className="transition-all duration-200"
                    />
                    <text
                        x="163"
                        y="39"
                        textAnchor="middle"
                        className="text-[9px] font-mono font-bold fill-sky-300"
                    >
                        què
                    </text>

                    {/* Línia separadora */}
                    <line
                        x1="30"
                        y1="52"
                        x2="186"
                        y2="52"
                        stroke="#1e293b"
                        strokeWidth="1"
                    />

                    {/* Components del TAD */}
                    <g className="font-mono text-[10px]">
                        {/* Valors */}
                        <text x="34" y="74" className="fill-slate-400">
                            valors:
                        </text>
                        <text x="86" y="74" className="fill-slate-200 font-semibold">
                            ⟨K, I⟩
                        </text>

                        {/* Operacions */}
                        <text x="34" y="99" className="fill-slate-400">
                            operacions:
                        </text>
                        <text x="34" y="113" className="fill-slate-300 text-[9px]">
                            find, insert, erase
                        </text>

                        {/* Axiomes */}
                        <text x="34" y="136" className="fill-slate-400">
                            axiomes:
                        </text>
                        <text x="92" y="136" className="fill-slate-300 text-[9.5px]">
                            semàntica
                        </text>
                    </g>
                </g>

                {/* ========================================================= */}
                {/* 2. CONNEXIONS CENTRALS (RAMIFICACIÓ QUÈ -> COM)           */}
                {/* ========================================================= */}

                {/* Branca cap a Hash */}
                <path
                    d="M 198 56 C 275 56, 295 46, 372 46"
                    fill="none"
                    stroke={isHashActive ? "#38bdf8" : "#334155"}
                    strokeWidth={isHashActive ? 2 : 1.3}
                    strokeOpacity={isHashDimmed ? 0.2 : isHashActive ? 1 : 0.6}
                    markerEnd={isHashActive ? "url(#tad-arrow-sky)" : "url(#tad-arrow-default)"}
                    className="transition-all duration-200 pointer-events-none"
                />

                {/* Branca cap a AVL */}
                <path
                    d="M 198 114 C 275 114, 295 124, 372 124"
                    fill="none"
                    stroke={isAvlActive ? "#34d399" : "#334155"}
                    strokeWidth={isAvlActive ? 2 : 1.3}
                    strokeOpacity={isAvlDimmed ? 0.2 : isAvlActive ? 1 : 0.6}
                    markerEnd={isAvlActive ? "url(#tad-arrow-emerald)" : "url(#tad-arrow-default)"}
                    className="transition-all duration-200 pointer-events-none"
                />

                {/* ========================================================= */}
                {/* 3. BLOC DRET SUPERIOR: HASH TABLE                         */}
                {/* ========================================================= */}
                <g
                    className="cursor-pointer transition-opacity duration-200"
                    style={{ opacity: isHashDimmed ? 0.35 : 1 }}
                    onMouseEnter={() => setHovered("hash")}
                    onMouseLeave={() => setHovered(null)}
                >
                    <rect
                        x="380"
                        y="15"
                        width="222"
                        height="62"
                        rx="8"
                        fill="#0b1120"
                        fillOpacity="0.5"
                        stroke={isHashActive ? "#38bdf8" : "#334155"}
                        strokeWidth={isHashActive ? "1.8" : "1.2"}
                        className="transition-all duration-200"
                    />

                    {/* Text descriptiu minimalista */}
                    <text
                        x="396"
                        y="39"
                        className="text-xs font-mono font-semibold fill-slate-200"
                    >
                        Hash
                    </text>
                    <text
                        x="434"
                        y="39"
                        className="text-[10px] font-mono fill-slate-500"
                    >
                        unordered_map
                    </text>

                    {/* Complexitat mitjana */}
                    <text
                        x="396"
                        y="58"
                        className="text-[10.5px] font-mono font-semibold fill-sky-400"
                    >
                        Θ(1) <tspan className="text-[9px] fill-slate-500 font-normal">mitjà</tspan>
                    </text>

                    {/* Micro-esquema de taula de dispersió (buckets) */}
                    <g className="transition-opacity duration-200">
                        {/* Slots de memòria */}
                        <rect x="548" y="24" width="22" height="9" rx="2" fill="#0f172a" stroke="#475569" strokeWidth="0.8" />
                        <rect x="548" y="37" width="22" height="9" rx="2" fill={isHashActive ? "rgba(56, 189, 248, 0.2)" : "#0f172a"} stroke={isHashActive ? "#38bdf8" : "#475569"} strokeWidth="0.8" />
                        <rect x="548" y="50" width="22" height="9" rx="2" fill="#0f172a" stroke="#475569" strokeWidth="0.8" />
                        {/* Fletxa de dispersió h(k) entrant al slot central */}
                        <path
                            d="M 536 41.5 L 544 41.5"
                            stroke={isHashActive ? "#38bdf8" : "#64748b"}
                            strokeWidth="1.2"
                        />
                        <circle cx="536" cy="41.5" r="1.5" fill={isHashActive ? "#38bdf8" : "#64748b"} />
                    </g>
                </g>

                {/* ========================================================= */}
                {/* 4. BLOC DRET INFERIOR: ARBRE AVL                          */}
                {/* ========================================================= */}
                <g
                    className="cursor-pointer transition-opacity duration-200"
                    style={{ opacity: isAvlDimmed ? 0.35 : 1 }}
                    onMouseEnter={() => setHovered("avl")}
                    onMouseLeave={() => setHovered(null)}
                >
                    <rect
                        x="380"
                        y="93"
                        width="222"
                        height="62"
                        rx="8"
                        fill="#0b1120"
                        fillOpacity="0.5"
                        stroke={isAvlActive ? "#34d399" : "#334155"}
                        strokeWidth={isAvlActive ? "1.8" : "1.2"}
                        className="transition-all duration-200"
                    />

                    {/* Text descriptiu minimalista */}
                    <text
                        x="396"
                        y="117"
                        className="text-xs font-mono font-semibold fill-slate-200"
                    >
                        AVL
                    </text>
                    <text
                        x="426"
                        y="117"
                        className="text-[10px] font-mono fill-slate-500"
                    >
                        map
                    </text>

                    {/* Complexitat pitjor cas */}
                    <text
                        x="396"
                        y="136"
                        className="text-[10.5px] font-mono font-semibold fill-emerald-400"
                    >
                        Θ(log n) <tspan className="text-[9px] fill-slate-500 font-normal">pitjor</tspan>
                    </text>

                    {/* Micro-esquema d'arbre binari equilibrat */}
                    <g className="transition-opacity duration-200">
                        {/* Branques */}
                        <line x1="558" y1="110" x2="548" y2="124" stroke={isAvlActive ? "#34d399" : "#475569"} strokeWidth="1" />
                        <line x1="558" y1="110" x2="568" y2="124" stroke={isAvlActive ? "#34d399" : "#475569"} strokeWidth="1" />
                        {/* Nodes */}
                        <circle cx="558" cy="110" r="3.5" fill={isAvlActive ? "#34d399" : "#334155"} stroke="#0f172a" strokeWidth="1" />
                        <circle cx="548" cy="124" r="3" fill="#1e293b" stroke={isAvlActive ? "#34d399" : "#475569"} strokeWidth="0.8" />
                        <circle cx="568" cy="124" r="3" fill="#1e293b" stroke={isAvlActive ? "#34d399" : "#475569"} strokeWidth="0.8" />
                    </g>
                </g>
            </svg>
        </div>
    );
}
