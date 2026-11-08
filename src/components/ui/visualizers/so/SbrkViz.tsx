"use client";

import React, { useState } from 'react';
import { m as motion } from 'framer-motion';

type SbrkAction = 'query' | 'expand' | 'shrink';

interface ActionConfig {
    id: SbrkAction;
    label: string;
    xPos: number;
    color: string;
}

const CONFIGS: Record<SbrkAction, ActionConfig> = {
    query: {
        id: 'query',
        label: 'sbrk(0)',
        xPos: 190,
        color: '#38bdf8'
    },
    expand: {
        id: 'expand',
        label: 'sbrk(+N)',
        xPos: 300,
        color: '#34d399'
    },
    shrink: {
        id: 'shrink',
        label: 'sbrk(-N)',
        xPos: 125,
        color: '#fbbf24'
    }
};

export default function SbrkViz() {
    const [action, setAction] = useState<SbrkAction>('query');
    const cfg = CONFIGS[action];

    const xStart = 70;
    const xPage = 370;
    const xEnd = 490;
    const yBar = 46;
    const hBar = 16;

    return (
        <div className="w-full my-6 select-none flex flex-col items-center justify-center not-prose">
            <div className="w-full max-w-lg relative flex flex-col items-center">
                
                {/* Minimalist Switcher */}
                <div className="flex items-center gap-1 p-0.5 rounded-full bg-slate-900/60 border border-white/5 mb-3">
                    {(['query', 'expand', 'shrink'] as const).map((act) => {
                        const item = CONFIGS[act];
                        const isActive = action === act;
                        return (
                            <button
                                key={act}
                                type="button"
                                onClick={() => setAction(act)}
                                className={`px-3 py-1 rounded-full font-mono text-[10px] transition-all duration-200 cursor-pointer ${
                                    isActive
                                        ? 'bg-white/10 text-white font-bold border border-white/15 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-300 border border-transparent'
                                }`}
                            >
                                {item.label}
                            </button>
                        );
                    })}
                </div>

                <svg
                    viewBox="0 0 540 90"
                    className="w-full h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter id="glow-sbrk-min" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <linearGradient id="grad-sbrk-bar" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                            <stop offset="100%" stopColor={cfg.color} stopOpacity="0.8" />
                        </linearGradient>
                    </defs>

                    {/* BASE 4 KB PAGE FRAME */}
                    <rect
                        x={xStart}
                        y={yBar}
                        width={xPage - xStart}
                        height={hBar}
                        rx={hBar / 2}
                        className="fill-slate-900/30 stroke-white/[0.08]"
                        strokeWidth="1"
                    />

                    {/* UNMAPPED SEGMENT (> 4 KB) */}
                    <rect
                        x={xPage}
                        y={yBar}
                        width={xEnd - xPage}
                        height={hBar}
                        rx={hBar / 2}
                        className="fill-rose-950/10 stroke-rose-500/20"
                        strokeWidth="1"
                        strokeDasharray="3 3"
                    />

                    {/* ACTIVE ALLOCATED HEAP */}
                    <motion.rect
                        x={xStart}
                        y={yBar}
                        height={hBar}
                        rx={hBar / 2}
                        fill="url(#grad-sbrk-bar)"
                        stroke={cfg.color}
                        strokeWidth="1.2"
                        animate={{ width: Math.max(12, cfg.xPos - xStart) }}
                        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                        filter="url(#glow-sbrk-min)"
                    />

                    {/* PAGE BOUNDARY (4 KB) */}
                    <line
                        x1={xPage}
                        y1={yBar - 12}
                        x2={xPage}
                        y2={yBar + hBar + 12}
                        className="stroke-indigo-400/50"
                        strokeWidth="1.2"
                        strokeDasharray="2 2"
                    />
                    <text
                        x={xPage}
                        y={yBar - 18}
                        textAnchor="middle"
                        className="font-mono text-[8.5px] font-semibold fill-indigo-300 pointer-events-none"
                    >
                        4 KB
                    </text>

                    {/* UNMAPPED FAULT LABEL */}
                    <text
                        x={(xPage + xEnd) / 2}
                        y={yBar + 11}
                        textAnchor="middle"
                        className="font-mono text-[8px] font-bold fill-rose-400/70 tracking-wider pointer-events-none"
                    >
                        SIGSEGV
                    </text>

                    {/* DYNAMIC BRK NEEDLE */}
                    <motion.g
                        animate={{ x: cfg.xPos }}
                        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                    >
                        <line
                            x1="0"
                            y1={yBar - 14}
                            x2="0"
                            y2={yBar + hBar + 14}
                            stroke={cfg.color}
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            filter="url(#glow-sbrk-min)"
                        />
                        <text
                            x="0"
                            y={yBar - 18}
                            textAnchor="middle"
                            className="font-mono text-[9px] font-bold tracking-wider pointer-events-none"
                            style={{ fill: cfg.color }}
                        >
                            brk
                        </text>
                    </motion.g>

                    {/* ORIGIN 0 B */}
                    <text
                        x={xStart}
                        y={yBar + hBar + 18}
                        textAnchor="middle"
                        className="font-mono text-[8px] fill-slate-500 pointer-events-none"
                    >
                        0
                    </text>
                </svg>

            </div>
        </div>
    );
}
