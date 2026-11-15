"use client";

import React, { useState } from 'react';
import { m as motion } from 'framer-motion';

type ActiveItem = 'p1' | 'p2' | 'kernel' | null;

export default function AddrSpaceViz() {
    const [hovered, setHovered] = useState<ActiveItem>(null);

    const isFaded = (item: ActiveItem) => hovered !== null && hovered !== item;
    const isLit   = (item: ActiveItem) => hovered === item;

    // Crossed physical mapping curves (proves relocation + isolation)
    const PATH_P1_TO_RAM = "M 150 60 C 270 60, 270 151, 390 151";
    const PATH_P2_TO_RAM = "M 150 134 C 270 134, 270 83, 390 83";

    return (
        <div className="w-full my-6 select-none flex justify-center not-prose">
            <div className="w-full max-w-lg relative flex justify-center">
                <svg
                    viewBox="0 0 560 185"
                    className="w-full h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter id="glow-addr" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* COLUMN HEADERS */}
                    <text
                        x="95"
                        y="16"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="font-mono text-[9px] font-semibold tracking-widest fill-slate-500 uppercase"
                    >
                        @L (Virtual)
                    </text>
                    <text
                        x="455"
                        y="16"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="font-mono text-[9px] font-semibold tracking-widest fill-slate-500 uppercase"
                    >
                        @F (RAM)
                    </text>

                    {/* BASE BLUEPRINT TRACKS */}
                    <path d={PATH_P1_TO_RAM} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" />
                    <path d={PATH_P2_TO_RAM} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" />

                    {/* ACTIVE MAPPING CURVES */}
                    <motion.path
                        d={PATH_P1_TO_RAM}
                        stroke="#38bdf8"
                        strokeWidth={isLit('p1') ? 2.2 : 1.5}
                        strokeLinecap="round"
                        animate={{ opacity: isFaded('p1') ? 0.15 : 0.9 }}
                        transition={{ duration: 0.2 }}
                        filter={isLit('p1') ? "url(#glow-addr)" : undefined}
                    />
                    <motion.path
                        d={PATH_P2_TO_RAM}
                        stroke="#818cf8"
                        strokeWidth={isLit('p2') ? 2.2 : 1.5}
                        strokeLinecap="round"
                        animate={{ opacity: isFaded('p2') ? 0.15 : 0.9 }}
                        transition={{ duration: 0.2 }}
                        filter={isLit('p2') ? "url(#glow-addr)" : undefined}
                    />

                    {/* KINETIC PARTICLES */}
                    <motion.circle
                        r={2.5}
                        fill="#38bdf8"
                        filter="url(#glow-addr)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${PATH_P1_TO_RAM}")` }}
                    />
                    <motion.circle
                        r={2.5}
                        fill="#818cf8"
                        filter="url(#glow-addr)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 2.4, repeat: Infinity, delay: 1.1, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${PATH_P2_TO_RAM}")` }}
                    />

                    {/* MMU PILL (CENTER CROSSING) */}
                    <g transform="translate(270, 108)">
                        <rect
                            x="-22"
                            y="-10"
                            width="44"
                            height="20"
                            rx="10"
                            fill="#0b0f19"
                            stroke="#a78bfa"
                            strokeWidth="1"
                            strokeOpacity="0.45"
                        />
                        <text
                            x="0"
                            y="0"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[8px] font-bold fill-purple-300 tracking-wider pointer-events-none"
                        >
                            MMU
                        </text>
                    </g>

                    {/* LEFT: VIRTUAL SPACES (BOTH START AT 0x0) */}
                    {/* P1 */}
                    <g
                        onMouseEnter={() => setHovered('p1')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer transition-opacity duration-200"
                        opacity={isFaded('p1') ? 0.25 : 1}
                    >
                        <rect
                            x="40"
                            y="34"
                            width="110"
                            height="52"
                            rx="8"
                            fill="#0b0f19"
                            stroke="#38bdf8"
                            strokeWidth={isLit('p1') ? 1.8 : 1}
                            strokeOpacity={isLit('p1') ? 1 : 0.45}
                            filter={isLit('p1') ? "url(#glow-addr)" : undefined}
                        />
                        <text
                            x="95"
                            y="52"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[10px] font-bold fill-sky-300 tracking-wider pointer-events-none"
                        >
                            Procés 1
                        </text>
                        <text
                            x="95"
                            y="69"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[8px] fill-sky-400/75 tracking-wider pointer-events-none"
                        >
                            0x0 .. N
                        </text>
                        <circle cx="150" cy="60" r="2.5" fill="#38bdf8" />
                    </g>

                    {/* P2 */}
                    <g
                        onMouseEnter={() => setHovered('p2')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer transition-opacity duration-200"
                        opacity={isFaded('p2') ? 0.25 : 1}
                    >
                        <rect
                            x="40"
                            y="108"
                            width="110"
                            height="52"
                            rx="8"
                            fill="#0b0f19"
                            stroke="#818cf8"
                            strokeWidth={isLit('p2') ? 1.8 : 1}
                            strokeOpacity={isLit('p2') ? 1 : 0.45}
                            filter={isLit('p2') ? "url(#glow-addr)" : undefined}
                        />
                        <text
                            x="95"
                            y="126"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[10px] font-bold fill-indigo-300 tracking-wider pointer-events-none"
                        >
                            Procés 2
                        </text>
                        <text
                            x="95"
                            y="143"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[8px] fill-indigo-400/75 tracking-wider pointer-events-none"
                        >
                            0x0 .. N
                        </text>
                        <circle cx="150" cy="134" r="2.5" fill="#818cf8" />
                    </g>

                    {/* RIGHT: PHYSICAL RAM BLOCKS */}
                    {/* KERNEL PROTECTED */}
                    <g
                        onMouseEnter={() => setHovered('kernel')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer transition-opacity duration-200"
                        opacity={isFaded('kernel') ? 0.25 : 1}
                    >
                        <rect
                            x="390"
                            y="30"
                            width="130"
                            height="28"
                            rx="7"
                            fill="#0b0f19"
                            stroke="#f43f5e"
                            strokeWidth={isLit('kernel') ? 1.8 : 1}
                            strokeOpacity={isLit('kernel') ? 1 : 0.4}
                            filter={isLit('kernel') ? "url(#glow-addr)" : undefined}
                        />
                        <text
                            x="404"
                            y="44"
                            dominantBaseline="central"
                            className="font-mono text-[9px] font-bold fill-rose-300 tracking-wider pointer-events-none"
                        >
                            Kernel
                        </text>
                        <text
                            x="506"
                            y="44"
                            textAnchor="end"
                            dominantBaseline="central"
                            className="font-mono text-[8px] font-semibold fill-rose-400/80 tracking-widest pointer-events-none"
                        >
                            ---
                        </text>
                    </g>

                    {/* P2 IN RAM (@F2) */}
                    <g
                        onMouseEnter={() => setHovered('p2')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer transition-opacity duration-200"
                        opacity={isFaded('p2') ? 0.25 : 1}
                    >
                        <rect
                            x="390"
                            y="66"
                            width="130"
                            height="34"
                            rx="7"
                            fill="#0b0f19"
                            stroke="#818cf8"
                            strokeWidth={isLit('p2') ? 1.8 : 1}
                            strokeOpacity={isLit('p2') ? 1 : 0.45}
                            filter={isLit('p2') ? "url(#glow-addr)" : undefined}
                        />
                        <text
                            x="455"
                            y="83"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[9.5px] font-bold fill-indigo-300 tracking-wider pointer-events-none"
                        >
                            P2 · @F₂
                        </text>
                        <circle cx="390" cy="83" r="2.5" fill="#818cf8" />
                    </g>

                    {/* FREE HOLE */}
                    <rect
                        x="390"
                        y="108"
                        width="130"
                        height="18"
                        rx="5"
                        fill="transparent"
                        stroke="#64748b"
                        strokeWidth="1"
                        strokeDasharray="3 3"
                        strokeOpacity="0.22"
                    />

                    {/* P1 IN RAM (@F1) */}
                    <g
                        onMouseEnter={() => setHovered('p1')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer transition-opacity duration-200"
                        opacity={isFaded('p1') ? 0.25 : 1}
                    >
                        <rect
                            x="390"
                            y="134"
                            width="130"
                            height="34"
                            rx="7"
                            fill="#0b0f19"
                            stroke="#38bdf8"
                            strokeWidth={isLit('p1') ? 1.8 : 1}
                            strokeOpacity={isLit('p1') ? 1 : 0.45}
                            filter={isLit('p1') ? "url(#glow-addr)" : undefined}
                        />
                        <text
                            x="455"
                            y="151"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[9.5px] font-bold fill-sky-300 tracking-wider pointer-events-none"
                        >
                            P1 · @F₁
                        </text>
                        <circle cx="390" cy="151" r="2.5" fill="#38bdf8" />
                    </g>
                </svg>
            </div>
        </div>
    );
}
