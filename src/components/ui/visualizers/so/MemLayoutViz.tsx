"use client";

import React, { useState } from 'react';
import { m as motion } from 'framer-motion';

type SegmentId = 'stack' | 'mmap' | 'heap' | 'data' | 'text' | 'null' | null;

export default function MemLayoutViz() {
    const [hovered, setHovered] = useState<SegmentId>(null);

    const isFaded = (id: SegmentId) => hovered !== null && hovered !== id;
    const isLit   = (id: SegmentId) => hovered === id;

    const PATH_STACK_GROWTH = "M 75 36 L 75 82";
    const PATH_HEAP_GROWTH  = "M 75 170 L 75 124";

    return (
        <div className="w-full my-6 select-none flex justify-center not-prose">
            <div className="w-full max-w-lg relative flex justify-center">
                <svg
                    viewBox="0 0 480 315"
                    className="w-full h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter id="glow-mem" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <linearGradient id="grad-stack" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#38bdf8" />
                            <stop offset="100%" stopColor="#818cf8" />
                        </linearGradient>

                        <linearGradient id="grad-heap" x1="0%" y1="100%" x2="0%" y2="0%">
                            <stop offset="0%" stopColor="#34d399" />
                            <stop offset="100%" stopColor="#38bdf8" />
                        </linearGradient>
                    </defs>

                    {/* TOP ADDRESS */}
                    <text
                        x="240"
                        y="18"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="font-mono text-[9px] fill-slate-500 tracking-widest font-semibold"
                    >
                        0x7FFFFFFFFFFF
                    </text>

                    {/* LEFT AXIS: BLUEPRINT TRACK */}
                    <path
                        d="M 75 32 L 75 284"
                        className="stroke-slate-300/25 dark:stroke-white/[0.08]"
                        strokeWidth="1.2"
                        strokeDasharray="3 3"
                    />

                    {/* STACK GROWTH INDICATOR (DOWN) */}
                    <path
                        d={PATH_STACK_GROWTH}
                        stroke="url(#grad-stack)"
                        strokeWidth={isLit('stack') ? 2.2 : 1.5}
                        strokeLinecap="round"
                        filter="url(#glow-mem)"
                    />
                    <motion.circle
                        r={2.5}
                        fill="#38bdf8"
                        filter="url(#glow-mem)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${PATH_STACK_GROWTH}")` }}
                    />
                    <text
                        x="64"
                        y="59"
                        textAnchor="end"
                        dominantBaseline="central"
                        className="font-mono text-[8px] font-bold fill-sky-400 tracking-wider pointer-events-none"
                    >
                        ↓ %rsp
                    </text>

                    {/* HEAP GROWTH INDICATOR (UP) */}
                    <path
                        d={PATH_HEAP_GROWTH}
                        stroke="url(#grad-heap)"
                        strokeWidth={isLit('heap') ? 2.2 : 1.5}
                        strokeLinecap="round"
                        filter="url(#glow-mem)"
                    />
                    <motion.circle
                        r={2.5}
                        fill="#34d399"
                        filter="url(#glow-mem)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${PATH_HEAP_GROWTH}")` }}
                    />
                    <text
                        x="64"
                        y="147"
                        textAnchor="end"
                        dominantBaseline="central"
                        className="font-mono text-[8px] font-bold fill-emerald-400 tracking-wider pointer-events-none"
                    >
                        ↑ brk
                    </text>

                    {/* 1. STACK */}
                    <g
                        onMouseEnter={() => setHovered('stack')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer transition-opacity duration-200"
                        opacity={isFaded('stack') ? 0.25 : 1}
                    >
                        <rect
                            x="110"
                            y="32"
                            width="260"
                            height="32"
                            rx="8"
                            fill="#0b0f19"
                            stroke="#38bdf8"
                            strokeWidth={isLit('stack') ? 1.8 : 1}
                            strokeOpacity={isLit('stack') ? 1 : 0.4}
                            filter={isLit('stack') ? "url(#glow-mem)" : undefined}
                        />
                        <text
                            x="128"
                            y="48"
                            dominantBaseline="central"
                            className="font-mono text-[10px] font-bold fill-sky-300 tracking-wider pointer-events-none"
                        >
                            STACK
                        </text>
                        <text
                            x="352"
                            y="48"
                            textAnchor="end"
                            dominantBaseline="central"
                            className="font-mono text-[8.5px] font-semibold fill-sky-400/80 tracking-widest pointer-events-none"
                        >
                            rw-
                        </text>
                    </g>

                    {/* 2. ESPAI LLIURE (GAP) */}
                    <g className="pointer-events-none">
                        <rect
                            x="110"
                            y="72"
                            width="260"
                            height="26"
                            rx="6"
                            fill="transparent"
                            stroke="#64748b"
                            strokeWidth="1"
                            strokeDasharray="4 4"
                            strokeOpacity="0.2"
                        />
                        <text
                            x="240"
                            y="85"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[7.5px] fill-slate-500/80 tracking-widest uppercase font-medium"
                        >
                            Espai Lliure
                        </text>
                    </g>

                    {/* 3. MMAP */}
                    <g
                        onMouseEnter={() => setHovered('mmap')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer transition-opacity duration-200"
                        opacity={isFaded('mmap') ? 0.25 : 1}
                    >
                        <rect
                            x="110"
                            y="106"
                            width="260"
                            height="30"
                            rx="8"
                            fill="#0b0f19"
                            stroke="#c084fc"
                            strokeWidth={isLit('mmap') ? 1.8 : 1}
                            strokeOpacity={isLit('mmap') ? 1 : 0.4}
                            filter={isLit('mmap') ? "url(#glow-mem)" : undefined}
                        />
                        <text
                            x="128"
                            y="121"
                            dominantBaseline="central"
                            className="font-mono text-[10px] font-bold fill-purple-300 tracking-wider pointer-events-none"
                        >
                            MMAP
                        </text>
                        <text
                            x="352"
                            y="121"
                            textAnchor="end"
                            dominantBaseline="central"
                            className="font-mono text-[8.5px] font-semibold fill-purple-400/80 tracking-widest pointer-events-none"
                        >
                            r-x
                        </text>
                    </g>

                    {/* 4. HEAP */}
                    <g
                        onMouseEnter={() => setHovered('heap')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer transition-opacity duration-200"
                        opacity={isFaded('heap') ? 0.25 : 1}
                    >
                        <rect
                            x="110"
                            y="144"
                            width="260"
                            height="32"
                            rx="8"
                            fill="#0b0f19"
                            stroke="#34d399"
                            strokeWidth={isLit('heap') ? 1.8 : 1}
                            strokeOpacity={isLit('heap') ? 1 : 0.4}
                            filter={isLit('heap') ? "url(#glow-mem)" : undefined}
                        />
                        <text
                            x="128"
                            y="160"
                            dominantBaseline="central"
                            className="font-mono text-[10px] font-bold fill-emerald-300 tracking-wider pointer-events-none"
                        >
                            HEAP
                        </text>
                        <text
                            x="352"
                            y="160"
                            textAnchor="end"
                            dominantBaseline="central"
                            className="font-mono text-[8.5px] font-semibold fill-emerald-400/80 tracking-widest pointer-events-none"
                        >
                            rw-
                        </text>
                    </g>

                    {/* 5. DATA */}
                    <g
                        onMouseEnter={() => setHovered('data')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer transition-opacity duration-200"
                        opacity={isFaded('data') ? 0.25 : 1}
                    >
                        <rect
                            x="110"
                            y="184"
                            width="260"
                            height="30"
                            rx="8"
                            fill="#0b0f19"
                            stroke="#fbbf24"
                            strokeWidth={isLit('data') ? 1.8 : 1}
                            strokeOpacity={isLit('data') ? 1 : 0.4}
                            filter={isLit('data') ? "url(#glow-mem)" : undefined}
                        />
                        <text
                            x="128"
                            y="199"
                            dominantBaseline="central"
                            className="font-mono text-[10px] font-bold fill-amber-300 tracking-wider pointer-events-none"
                        >
                            .DATA / .BSS
                        </text>
                        <text
                            x="352"
                            y="199"
                            textAnchor="end"
                            dominantBaseline="central"
                            className="font-mono text-[8.5px] font-semibold fill-amber-400/80 tracking-widest pointer-events-none"
                        >
                            rw-
                        </text>
                    </g>

                    {/* 6. TEXT */}
                    <g
                        onMouseEnter={() => setHovered('text')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer transition-opacity duration-200"
                        opacity={isFaded('text') ? 0.25 : 1}
                    >
                        <rect
                            x="110"
                            y="222"
                            width="260"
                            height="30"
                            rx="8"
                            fill="#0b0f19"
                            stroke="#818cf8"
                            strokeWidth={isLit('text') ? 1.8 : 1}
                            strokeOpacity={isLit('text') ? 1 : 0.4}
                            filter={isLit('text') ? "url(#glow-mem)" : undefined}
                        />
                        <text
                            x="128"
                            y="237"
                            dominantBaseline="central"
                            className="font-mono text-[10px] font-bold fill-indigo-300 tracking-wider pointer-events-none"
                        >
                            .TEXT / .RODATA
                        </text>
                        <text
                            x="352"
                            y="237"
                            textAnchor="end"
                            dominantBaseline="central"
                            className="font-mono text-[8.5px] font-semibold fill-indigo-400/80 tracking-widest pointer-events-none"
                        >
                            r-x
                        </text>
                    </g>

                    {/* 7. NULL PAGE */}
                    <g
                        onMouseEnter={() => setHovered('null')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer transition-opacity duration-200"
                        opacity={isFaded('null') ? 0.25 : 1}
                    >
                        <rect
                            x="110"
                            y="260"
                            width="260"
                            height="24"
                            rx="6"
                            fill="#0b0f19"
                            stroke="#f43f5e"
                            strokeWidth={isLit('null') ? 1.8 : 1}
                            strokeOpacity={isLit('null') ? 1 : 0.4}
                            filter={isLit('null') ? "url(#glow-mem)" : undefined}
                        />
                        <text
                            x="128"
                            y="272"
                            dominantBaseline="central"
                            className="font-mono text-[9px] font-bold fill-rose-400 tracking-wider pointer-events-none"
                        >
                            NULL (0x0)
                        </text>
                        <text
                            x="352"
                            y="272"
                            textAnchor="end"
                            dominantBaseline="central"
                            className="font-mono text-[8.5px] font-semibold fill-rose-400/80 tracking-widest pointer-events-none"
                        >
                            ---
                        </text>
                    </g>

                    {/* BOTTOM ADDRESS */}
                    <text
                        x="240"
                        y="302"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="font-mono text-[9px] fill-slate-500 tracking-widest font-semibold"
                    >
                        0x000000000000
                    </text>
                </svg>
            </div>
        </div>
    );
}
