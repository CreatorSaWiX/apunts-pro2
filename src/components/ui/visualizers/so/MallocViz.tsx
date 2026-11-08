"use client";

import React, { useState } from 'react';
import { m as motion } from 'framer-motion';

export default function MallocViz() {
    const [mode, setMode] = useState<'sbrk' | 'malloc'>('sbrk');

    const xStart = 60;
    const x4KB = 210;
    const xAccess = 280;
    const xPool = 460;
    const yBar = 42;
    const hBar = 16;

    return (
        <div className="w-full my-6 select-none flex flex-col items-center justify-center not-prose">
            <div className="w-full max-w-lg relative flex flex-col items-center">
                
                {/* Minimalist Switcher */}
                <div className="flex items-center gap-1 p-0.5 rounded-full bg-slate-900/60 border border-white/5 mb-3">
                    <button
                        type="button"
                        onClick={() => setMode('sbrk')}
                        className={`px-3 py-1 rounded-full font-mono text-[10px] transition-all duration-200 cursor-pointer ${
                            mode === 'sbrk'
                                ? 'bg-white/10 text-white font-bold border border-white/15 shadow-sm'
                                : 'text-slate-500 hover:text-slate-300 border border-transparent'
                        }`}
                    >
                        sbrk(4096)
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('malloc')}
                        className={`px-3 py-1 rounded-full font-mono text-[10px] transition-all duration-200 cursor-pointer ${
                            mode === 'malloc'
                                ? 'bg-white/10 text-white font-bold border border-white/15 shadow-sm'
                                : 'text-slate-500 hover:text-slate-300 border border-transparent'
                        }`}
                    >
                        malloc(4096)
                    </button>
                </div>

                <svg
                    viewBox="0 0 520 95"
                    className="w-full h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter id="glow-malloc-min" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <linearGradient id="grad-malloc-pool" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.3" />
                        </linearGradient>
                    </defs>

                    {/* BASE UNMAPPED TRACK */}
                    <rect
                        x={x4KB}
                        y={yBar}
                        width={xPool - x4KB + 20}
                        height={hBar}
                        rx={hBar / 2}
                        className="fill-rose-950/10 stroke-rose-500/20"
                        strokeWidth="1"
                        strokeDasharray="3 3"
                    />

                    {/* GLIBC EXTRA POOL (Only in malloc mode) */}
                    <motion.rect
                        x={x4KB}
                        y={yBar}
                        height={hBar}
                        rx={hBar / 2}
                        fill="url(#grad-malloc-pool)"
                        stroke="#818cf8"
                        strokeWidth="1"
                        strokeDasharray="2 2"
                        initial={false}
                        animate={{
                            width: mode === 'malloc' ? xPool - x4KB : 0,
                            opacity: mode === 'malloc' ? 1 : 0
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                    />

                    {/* REQUESTED 4 KB BLOCK (0 .. 4096) */}
                    <rect
                        x={xStart}
                        y={yBar}
                        width={x4KB - xStart}
                        height={hBar}
                        rx={hBar / 2}
                        fill="rgba(56, 189, 248, 0.25)"
                        stroke="#38bdf8"
                        strokeWidth="1.2"
                        filter="url(#glow-malloc-min)"
                    />

                    {/* 4 KB BOUNDARY LINE */}
                    <line
                        x1={x4KB}
                        y1={yBar - 10}
                        x2={x4KB}
                        y2={yBar + hBar + 10}
                        className="stroke-slate-400/50"
                        strokeWidth="1.2"
                        strokeDasharray="2 2"
                    />
                    <text
                        x={x4KB}
                        y={yBar + hBar + 18}
                        textAnchor="middle"
                        className="font-mono text-[8px] fill-slate-400 pointer-events-none"
                    >
                        4 KB
                    </text>

                    {/* ORIGIN 0 B */}
                    <text
                        x={xStart}
                        y={yBar + hBar + 18}
                        textAnchor="middle"
                        className="font-mono text-[8px] fill-slate-500 pointer-events-none"
                    >
                        0
                    </text>

                    {/* ACCESS NEEDLE: p[4100] */}
                    <g transform={`translate(${xAccess}, 0)`}>
                        <motion.line
                            x1="0"
                            y1={yBar - 12}
                            x2="0"
                            y2={yBar + hBar + 12}
                            stroke={mode === 'sbrk' ? '#f43f5e' : '#34d399'}
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            animate={{ stroke: mode === 'sbrk' ? '#f43f5e' : '#34d399' }}
                            transition={{ duration: 0.2 }}
                            filter="url(#glow-malloc-min)"
                        />
                        <text
                            x="0"
                            y={yBar - 16}
                            textAnchor="middle"
                            className="font-mono text-[8.5px] font-bold fill-white tracking-wider pointer-events-none"
                        >
                            p[4100]
                        </text>
                        <motion.text
                            x="0"
                            y={yBar + hBar + 18}
                            textAnchor="middle"
                            className="font-mono text-[8.5px] font-extrabold tracking-wider pointer-events-none"
                            animate={{
                                fill: mode === 'sbrk' ? '#f43f5e' : '#34d399'
                            }}
                            transition={{ duration: 0.2 }}
                        >
                            {mode === 'sbrk' ? 'SIGSEGV' : 'OK'}
                        </motion.text>
                    </g>
                </svg>

            </div>
        </div>
    );
}
