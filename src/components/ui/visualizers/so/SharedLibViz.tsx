"use client";

import React, { useState } from 'react';
import { m as motion } from 'framer-motion';

type ActiveItem = 'a' | 'b' | 'shared' | null;

export default function SharedLibViz() {
    const [hovered, setHovered] = useState<ActiveItem>(null);

    const isFaded = (item: ActiveItem) => hovered !== null && hovered !== item;
    const isLit   = (item: ActiveItem) => hovered === item;

    // S-curves from processes to physical RAM frames
    const PATH_A_PRIVATE = "M 135 43 C 240 43, 300 36, 390 36";
    const PATH_A_SHARED  = "M 135 60 C 230 60, 270 84, 370 84";
    const PATH_B_SHARED  = "M 135 120 C 230 120, 270 96, 370 96";
    const PATH_B_PRIVATE = "M 135 138 C 240 138, 300 144, 390 144";

    return (
        <div className="w-full my-6 select-none flex justify-center not-prose">
            <div className="w-full max-w-lg relative flex justify-center">
                <svg
                    viewBox="0 0 540 180"
                    className="w-full h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter id="glow-sl" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <linearGradient id="grad-shared" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#38bdf8" />
                            <stop offset="50%" stopColor="#c084fc" />
                            <stop offset="100%" stopColor="#34d399" />
                        </linearGradient>
                    </defs>

                    {/* COLUMN LABELS */}
                    <text
                        x="87"
                        y="18"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="font-mono text-[9px] font-semibold tracking-widest fill-slate-500 uppercase"
                    >
                        Processos
                    </text>
                    <text
                        x="440"
                        y="10"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="font-mono text-[9px] font-semibold tracking-widest fill-slate-500 uppercase"
                    >
                        RAM Física
                    </text>

                    {/* BASE BLUEPRINT TRACKS */}
                    <path d={PATH_A_PRIVATE} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" strokeDasharray="3 3" />
                    <path d={PATH_A_SHARED}  className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" />
                    <path d={PATH_B_SHARED}  className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" />
                    <path d={PATH_B_PRIVATE} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" strokeDasharray="3 3" />

                    {/* 1. PATH A -> PRIVATE A */}
                    <path
                        d={PATH_A_PRIVATE}
                        stroke="#38bdf8"
                        strokeWidth={isLit('a') ? 2.2 : 1.4}
                        strokeLinecap="round"
                        strokeDasharray="4 4"
                        filter="url(#glow-sl)"
                        opacity={isFaded('a') ? 0.2 : 0.85}
                    />
                    <motion.circle
                        r={2.5}
                        fill="#38bdf8"
                        filter="url(#glow-sl)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 2.2, repeat: Infinity, delay: 0.2, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${PATH_A_PRIVATE}")` }}
                    />

                    {/* 2. PATH A -> SHARED LIBC */}
                    <path
                        d={PATH_A_SHARED}
                        stroke="#c084fc"
                        strokeWidth={isLit('a') || isLit('shared') ? 2.2 : 1.6}
                        strokeLinecap="round"
                        filter="url(#glow-sl)"
                        opacity={hovered === 'b' ? 0.2 : 1}
                    />
                    <motion.circle
                        r={2.5}
                        fill="#c084fc"
                        filter="url(#glow-sl)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${PATH_A_SHARED}")` }}
                    />

                    {/* 3. PATH B -> SHARED LIBC */}
                    <path
                        d={PATH_B_SHARED}
                        stroke="#c084fc"
                        strokeWidth={isLit('b') || isLit('shared') ? 2.2 : 1.6}
                        strokeLinecap="round"
                        filter="url(#glow-sl)"
                        opacity={hovered === 'a' ? 0.2 : 1}
                    />
                    <motion.circle
                        r={2.5}
                        fill="#c084fc"
                        filter="url(#glow-sl)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 2.4, repeat: Infinity, delay: 0.8, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${PATH_B_SHARED}")` }}
                    />

                    {/* 4. PATH B -> PRIVATE B */}
                    <path
                        d={PATH_B_PRIVATE}
                        stroke="#818cf8"
                        strokeWidth={isLit('b') ? 2.2 : 1.4}
                        strokeLinecap="round"
                        strokeDasharray="4 4"
                        filter="url(#glow-sl)"
                        opacity={isFaded('b') ? 0.2 : 0.85}
                    />
                    <motion.circle
                        r={2.5}
                        fill="#818cf8"
                        filter="url(#glow-sl)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 2.2, repeat: Infinity, delay: 1, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${PATH_B_PRIVATE}")` }}
                    />

                    {/* NODE 1: PROCÉS A */}
                    <g
                        onMouseEnter={() => setHovered('a')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer transition-opacity duration-200"
                        opacity={hovered === 'b' ? 0.25 : 1}
                    >
                        <rect
                            x="40"
                            y="33"
                            width="95"
                            height="36"
                            rx="8"
                            fill="#0b0f19"
                            stroke="#38bdf8"
                            strokeWidth={isLit('a') ? 1.8 : 1}
                            strokeOpacity={isLit('a') ? 1 : 0.4}
                            filter={isLit('a') ? "url(#glow-sl)" : undefined}
                        />
                        <text
                            x="87"
                            y="51"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[10px] font-bold fill-sky-300 tracking-wider pointer-events-none"
                        >
                            Procés A
                        </text>
                    </g>

                    {/* NODE 2: PROCÉS B */}
                    <g
                        onMouseEnter={() => setHovered('b')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer transition-opacity duration-200"
                        opacity={hovered === 'a' ? 0.25 : 1}
                    >
                        <rect
                            x="40"
                            y="110"
                            width="95"
                            height="36"
                            rx="8"
                            fill="#0b0f19"
                            stroke="#818cf8"
                            strokeWidth={isLit('b') ? 1.8 : 1}
                            strokeOpacity={isLit('b') ? 1 : 0.4}
                            filter={isLit('b') ? "url(#glow-sl)" : undefined}
                        />
                        <text
                            x="87"
                            y="128"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[10px] font-bold fill-indigo-300 tracking-wider pointer-events-none"
                        >
                            Procés B
                        </text>
                    </g>

                    {/* NODE 3: FRAME PRIVAT A */}
                    <g
                        onMouseEnter={() => setHovered('a')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer transition-opacity duration-200"
                        opacity={hovered === 'b' ? 0.25 : 1}
                    >
                        <rect
                            x="390"
                            y="22"
                            width="110"
                            height="28"
                            rx="6"
                            fill="#0b0f19"
                            stroke="#38bdf8"
                            strokeWidth={isLit('a') ? 1.8 : 1}
                            strokeOpacity={isLit('a') ? 1 : 0.4}
                            filter={isLit('a') ? "url(#glow-sl)" : undefined}
                        />
                        <text
                            x="404"
                            y="36"
                            dominantBaseline="central"
                            className="font-mono text-[9px] font-semibold fill-sky-300 tracking-wide pointer-events-none"
                        >
                            .data (A)
                        </text>
                        <text
                            x="488"
                            y="36"
                            textAnchor="end"
                            dominantBaseline="central"
                            className="font-mono text-[8px] font-semibold fill-sky-400/80 tracking-wider pointer-events-none"
                        >
                            rw-
                        </text>
                    </g>

                    {/* NODE 4: MARC COMPARTIT (LIBC.SO) */}
                    <g
                        onMouseEnter={() => setHovered('shared')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer transition-opacity duration-200"
                    >
                        <rect
                            x="370"
                            y="68"
                            width="140"
                            height="44"
                            rx="8"
                            fill="#0b0f19"
                            stroke="#c084fc"
                            strokeWidth={isLit('shared') ? 2 : 1.2}
                            strokeOpacity={isLit('shared') ? 1 : 0.5}
                            filter={isLit('shared') ? "url(#glow-sl)" : undefined}
                        />
                        <text
                            x="386"
                            y="83"
                            dominantBaseline="central"
                            className="font-mono text-[10px] font-bold fill-purple-300 tracking-wider pointer-events-none"
                        >
                            libc.so (.text)
                        </text>
                        <text
                            x="496"
                            y="83"
                            textAnchor="end"
                            dominantBaseline="central"
                            className="font-mono text-[8px] font-semibold fill-purple-400/80 tracking-wider pointer-events-none"
                        >
                            r-x
                        </text>
                        <text
                            x="440"
                            y="99"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[7.5px] font-semibold fill-emerald-400 tracking-widest pointer-events-none"
                        >
                            ● 1x Marc Compartit
                        </text>
                    </g>

                    {/* NODE 5: FRAME PRIVAT B */}
                    <g
                        onMouseEnter={() => setHovered('b')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer transition-opacity duration-200"
                        opacity={hovered === 'a' ? 0.25 : 1}
                    >
                        <rect
                            x="390"
                            y="130"
                            width="110"
                            height="28"
                            rx="6"
                            fill="#0b0f19"
                            stroke="#818cf8"
                            strokeWidth={isLit('b') ? 1.8 : 1}
                            strokeOpacity={isLit('b') ? 1 : 0.4}
                            filter={isLit('b') ? "url(#glow-sl)" : undefined}
                        />
                        <text
                            x="404"
                            y="144"
                            dominantBaseline="central"
                            className="font-mono text-[9px] font-semibold fill-indigo-300 tracking-wide pointer-events-none"
                        >
                            .data (B)
                        </text>
                        <text
                            x="488"
                            y="144"
                            textAnchor="end"
                            dominantBaseline="central"
                            className="font-mono text-[8px] font-semibold fill-indigo-400/80 tracking-wider pointer-events-none"
                        >
                            rw-
                        </text>
                    </g>
                </svg>
            </div>
        </div>
    );
}
