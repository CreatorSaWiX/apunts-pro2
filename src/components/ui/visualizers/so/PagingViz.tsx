"use client";

import React, { useState } from 'react';
import { m as motion } from 'framer-motion';

type ActiveItem = 'p0' | 'p1' | 'p2' | 'free' | null;

// Clean S-curves from logical pages (x=130) to physical frames (x=430)
const PATH_P0_TO_F2 = "M 130 65 C 280 65, 280 128, 430 128";
const PATH_P1_TO_F0 = "M 130 111 C 280 111, 280 56, 430 56";
const PATH_P2_TO_F3 = "M 130 157 C 280 157, 280 164, 430 164";

export default function PagingViz() {
    const [hovered, setHovered] = useState<ActiveItem>(null);

    const isFaded = (item: ActiveItem) => hovered !== null && hovered !== item;
    const isLit   = (item: ActiveItem) => hovered === item;

    return (
        <div className="w-full my-6 select-none flex flex-col items-center justify-center not-prose">
            <div className="w-full max-w-lg relative">
                <svg
                    viewBox="0 0 570 196"
                    className="w-full h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        {/* Subtle glow filter */}
                        <filter id="glow-paging-clean" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* Diagonal hatch for internal fragmentation */}
                        <pattern id="hatch-frag-clean" width="5" height="5" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                            <line x1="0" y1="0" x2="0" y2="5" stroke="#fbbf24" strokeWidth="1" opacity="0.4" />
                        </pattern>
                    </defs>

                    {/* Column Headers */}
                    <text
                        x="85"
                        y="22"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="font-mono text-[9px] font-semibold tracking-widest fill-sky-400/80"
                    >
                        PÀGINES
                    </text>
                    <text
                        x="485"
                        y="22"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="font-mono text-[9px] font-semibold tracking-widest fill-emerald-400/80"
                    >
                        RAM
                    </text>

                    {/* Blueprint tracks (Faint background) */}
                    <path d={PATH_P0_TO_F2} className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.5" />
                    <path d={PATH_P1_TO_F0} className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.5" />
                    <path d={PATH_P2_TO_F3} className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.5" />

                    {/* Active highlight paths */}
                    <motion.path
                        d={PATH_P0_TO_F2}
                        stroke="#38bdf8"
                        strokeWidth={isLit('p0') ? 2.2 : 1.6}
                        strokeLinecap="round"
                        animate={{ opacity: isFaded('p0') ? 0.15 : 0.85 }}
                        transition={{ duration: 0.2 }}
                        filter={isLit('p0') ? "url(#glow-paging-clean)" : undefined}
                    />
                    <motion.path
                        d={PATH_P1_TO_F0}
                        stroke="#34d399"
                        strokeWidth={isLit('p1') ? 2.2 : 1.6}
                        strokeLinecap="round"
                        animate={{ opacity: isFaded('p1') ? 0.15 : 0.85 }}
                        transition={{ duration: 0.2 }}
                        filter={isLit('p1') ? "url(#glow-paging-clean)" : undefined}
                    />
                    <motion.path
                        d={PATH_P2_TO_F3}
                        stroke="#fbbf24"
                        strokeWidth={isLit('p2') ? 2.2 : 1.6}
                        strokeLinecap="round"
                        animate={{ opacity: isFaded('p2') ? 0.15 : 0.85 }}
                        transition={{ duration: 0.2 }}
                        filter={isLit('p2') ? "url(#glow-paging-clean)" : undefined}
                    />

                    {/* Flowing kinetic particles */}
                    <motion.circle
                        r={2.5}
                        fill="#38bdf8"
                        filter="url(#glow-paging-clean)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${PATH_P0_TO_F2}")` }}
                    />
                    <motion.circle
                        r={2.5}
                        fill="#34d399"
                        filter="url(#glow-paging-clean)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 2.4, repeat: Infinity, delay: 0.8, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${PATH_P1_TO_F0}")` }}
                    />
                    <motion.circle
                        r={2.5}
                        fill="#fbbf24"
                        filter="url(#glow-paging-clean)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 2.4, repeat: Infinity, delay: 1.6, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${PATH_P2_TO_F3}")` }}
                    />

                    {/* === LEFT: LOGICAL PAGES (Contiguous 4 KB) === */}
                    {/* P0 */}
                    <g
                        transform="translate(40, 50)"
                        onMouseEnter={() => setHovered('p0')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer"
                    >
                        <rect x="0" y="0" width="90" height="30" rx="7" fill="transparent" />
                        <motion.rect
                            x="0"
                            y="0"
                            width="90"
                            height="30"
                            rx="7"
                            fill="#0b0f19"
                            stroke="#38bdf8"
                            strokeWidth={isLit('p0') ? 1.75 : 1}
                            animate={{ opacity: isFaded('p0') ? 0.3 : 1 }}
                            filter={isLit('p0') ? "url(#glow-paging-clean)" : undefined}
                        />
                        <text
                            x="45"
                            y="15"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[9px] font-semibold fill-sky-300 pointer-events-none"
                        >
                            P0 · 4KB
                        </text>
                        <circle cx="90" cy="15" r="2.5" fill="#38bdf8" />
                    </g>

                    {/* P1 */}
                    <g
                        transform="translate(40, 96)"
                        onMouseEnter={() => setHovered('p1')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer"
                    >
                        <rect x="0" y="0" width="90" height="30" rx="7" fill="transparent" />
                        <motion.rect
                            x="0"
                            y="0"
                            width="90"
                            height="30"
                            rx="7"
                            fill="#0b0f19"
                            stroke="#34d399"
                            strokeWidth={isLit('p1') ? 1.75 : 1}
                            animate={{ opacity: isFaded('p1') ? 0.3 : 1 }}
                            filter={isLit('p1') ? "url(#glow-paging-clean)" : undefined}
                        />
                        <text
                            x="45"
                            y="15"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[9px] font-semibold fill-emerald-300 pointer-events-none"
                        >
                            P1 · 4KB
                        </text>
                        <circle cx="90" cy="15" r="2.5" fill="#34d399" />
                    </g>

                    {/* P2 */}
                    <g
                        transform="translate(40, 142)"
                        onMouseEnter={() => setHovered('p2')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer"
                    >
                        <rect x="0" y="0" width="90" height="30" rx="7" fill="transparent" />
                        <motion.rect
                            x="0"
                            y="0"
                            width="90"
                            height="30"
                            rx="7"
                            fill="#0b0f19"
                            stroke="#fbbf24"
                            strokeWidth={isLit('p2') ? 1.75 : 1}
                            animate={{ opacity: isFaded('p2') ? 0.3 : 1 }}
                            filter={isLit('p2') ? "url(#glow-paging-clean)" : undefined}
                        />
                        <text
                            x="45"
                            y="15"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[9px] font-semibold fill-amber-300 pointer-events-none"
                        >
                            P2 · 4KB
                        </text>
                        <circle cx="90" cy="15" r="2.5" fill="#fbbf24" />
                    </g>

                    {/* === RIGHT: PHYSICAL RAM FRAMES (Scattered / Non-contiguous) === */}
                    {/* F0 (holds P1) */}
                    <g
                        transform="translate(430, 42)"
                        onMouseEnter={() => setHovered('p1')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer"
                    >
                        <rect x="0" y="0" width="110" height="28" rx="6" fill="transparent" />
                        <motion.rect
                            x="0"
                            y="0"
                            width="110"
                            height="28"
                            rx="6"
                            fill="#0b0f19"
                            stroke="#34d399"
                            strokeWidth={isLit('p1') ? 1.75 : 1}
                            animate={{ opacity: isFaded('p1') ? 0.3 : 1 }}
                            filter={isLit('p1') ? "url(#glow-paging-clean)" : undefined}
                        />
                        <text
                            x="55"
                            y="14"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[8.5px] font-semibold fill-emerald-300 pointer-events-none"
                        >
                            F0 · P1
                        </text>
                        <circle cx="0" cy="14" r="2.5" fill="#34d399" />
                    </g>

                    {/* F1 (Free Frame -> shows NO external fragmentation) */}
                    <g
                        transform="translate(430, 78)"
                        onMouseEnter={() => setHovered('free')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer"
                    >
                        <rect x="0" y="0" width="110" height="28" rx="6" fill="transparent" />
                        <motion.rect
                            x="0"
                            y="0"
                            width="110"
                            height="28"
                            rx="6"
                            fill="rgba(255,255,255,0.01)"
                            stroke={isLit('free') ? "#34d399" : "#64748b"}
                            strokeWidth={isLit('free') ? 1.5 : 0.8}
                            strokeDasharray="3 3"
                            animate={{ opacity: isFaded('free') ? 0.3 : 1 }}
                        />
                        <text
                            x="55"
                            y="14"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className={`font-mono text-[8px] pointer-events-none transition-colors ${
                                isLit('free') ? 'fill-emerald-300 font-semibold' : 'fill-slate-500'
                            }`}
                        >
                            F1 · Lliure
                        </text>
                    </g>

                    {/* F2 (holds P0) */}
                    <g
                        transform="translate(430, 114)"
                        onMouseEnter={() => setHovered('p0')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer"
                    >
                        <rect x="0" y="0" width="110" height="28" rx="6" fill="transparent" />
                        <motion.rect
                            x="0"
                            y="0"
                            width="110"
                            height="28"
                            rx="6"
                            fill="#0b0f19"
                            stroke="#38bdf8"
                            strokeWidth={isLit('p0') ? 1.75 : 1}
                            animate={{ opacity: isFaded('p0') ? 0.3 : 1 }}
                            filter={isLit('p0') ? "url(#glow-paging-clean)" : undefined}
                        />
                        <text
                            x="55"
                            y="14"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[8.5px] font-semibold fill-sky-300 pointer-events-none"
                        >
                            F2 · P0
                        </text>
                        <circle cx="0" cy="14" r="2.5" fill="#38bdf8" />
                    </g>

                    {/* F3 (holds P2 -> Internal Fragmentation: 2400 B used + 1696 B wasted) */}
                    <g
                        transform="translate(430, 150)"
                        onMouseEnter={() => setHovered('p2')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer"
                    >
                        <rect x="0" y="0" width="110" height="28" rx="6" fill="transparent" />
                        {/* Frame container */}
                        <motion.rect
                            x="0"
                            y="0"
                            width="110"
                            height="28"
                            rx="6"
                            fill="#0b0f19"
                            stroke="#fbbf24"
                            strokeWidth={isLit('p2') ? 1.75 : 1}
                            animate={{ opacity: isFaded('p2') ? 0.3 : 1 }}
                            filter={isLit('p2') ? "url(#glow-paging-clean)" : undefined}
                        />

                        {/* Used memory (2.4 KB) */}
                        <rect
                            x="1"
                            y="1"
                            width="62"
                            height="26"
                            rx="5"
                            fill="rgba(251, 191, 36, 0.12)"
                        />
                        <text
                            x="32"
                            y="14"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[8px] font-bold fill-amber-200 pointer-events-none"
                        >
                            2.4 KB
                        </text>

                        {/* Wasted residual / Internal fragmentation (1696 B) */}
                        <rect
                            x="64"
                            y="1"
                            width="45"
                            height="26"
                            rx="5"
                            fill="url(#hatch-frag-clean)"
                            stroke="#fbbf24"
                            strokeWidth="0.8"
                            strokeDasharray="2 2"
                        />
                        <text
                            x="86"
                            y="14"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[7.5px] font-extrabold fill-amber-300 pointer-events-none"
                        >
                            1696 B
                        </text>

                        <circle cx="0" cy="14" r="2.5" fill="#fbbf24" />
                    </g>
                </svg>
            </div>
        </div>
    );
}
