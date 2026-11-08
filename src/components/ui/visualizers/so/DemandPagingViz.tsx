"use client";

import React, { useState } from 'react';
import { m as motion } from 'framer-motion';

export default function DemandPagingViz() {
    const [mode, setMode] = useState<'exec' | 'demand'>('demand');

    // Geometry coordinates
    // Top row (RAM): y = 26
    // Bottom row (DISC): y = 78
    // Page slots: P0(140), P1(205), P2(270), P3(335)
    const slotWidth = 52;
    const slotHeight = 22;
    const yRam = 26;
    const yDisc = 78;

    const xSlots = [140, 205, 270, 335]; // P0, P1, P2, P3
    const xActive = xSlots[1]; // P1 (x = 205)

    const pathTransfer = `M ${xActive + slotWidth / 2} ${yDisc} L ${xActive + slotWidth / 2} ${yRam + slotHeight}`;

    return (
        <div className="w-full my-6 select-none flex flex-col items-center justify-center not-prose">
            <div className="w-full max-w-lg relative flex flex-col items-center">
                
                {/* Minimalist Switcher */}
                <div className="flex items-center gap-1 p-0.5 rounded-full bg-slate-900/60 border border-white/5 mb-3">
                    <button
                        type="button"
                        onClick={() => setMode('exec')}
                        className={`px-3 py-1 rounded-full font-mono text-[10px] transition-all duration-200 cursor-pointer ${
                            mode === 'exec'
                                ? 'bg-white/10 text-white font-bold border border-white/15 shadow-sm'
                                : 'text-slate-500 hover:text-slate-300 border border-transparent'
                        }`}
                    >
                        exec() · 0 KB RAM
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('demand')}
                        className={`px-3 py-1 rounded-full font-mono text-[10px] transition-all duration-200 cursor-pointer ${
                            mode === 'demand'
                                ? 'bg-white/10 text-white font-bold border border-white/15 shadow-sm'
                                : 'text-slate-500 hover:text-slate-300 border border-transparent'
                        }`}
                    >
                        Accés P1 · +4 KB
                    </button>
                </div>

                <svg
                    viewBox="0 0 460 125"
                    className="w-full h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter id="glow-demand-min" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <linearGradient id="grad-demand-up" x1="0%" y1="100%" x2="0%" y2="0%">
                            <stop offset="0%" stopColor="#38bdf8" />
                            <stop offset="100%" stopColor="#34d399" />
                        </linearGradient>
                    </defs>

                    {/* SECTION LABELS */}
                    <text
                        x="90"
                        y={yRam + 15}
                        textAnchor="end"
                        className="font-mono text-[9px] font-bold fill-emerald-400 tracking-wider pointer-events-none"
                    >
                        RAM
                    </text>
                    <text
                        x="90"
                        y={yDisc + 15}
                        textAnchor="end"
                        className="font-mono text-[9px] font-bold fill-amber-400 tracking-wider pointer-events-none"
                    >
                        DISC
                    </text>

                    {/* TRANSFER TRACK (P1 up to RAM) */}
                    <path
                        d={pathTransfer}
                        className="stroke-slate-300/20 dark:stroke-white/[0.08]"
                        strokeWidth="1.2"
                        strokeDasharray="2 2"
                    />
                    <motion.path
                        d={pathTransfer}
                        stroke="url(#grad-demand-up)"
                        strokeWidth={1.8}
                        strokeLinecap="round"
                        initial={false}
                        animate={{ opacity: mode === 'demand' ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                        filter="url(#glow-demand-min)"
                    />

                    {/* TRAVELLING 4 KB PAGE PARTICLE */}
                    {mode === 'demand' && (
                        <motion.circle
                            r={2.8}
                            fill="#34d399"
                            filter="url(#glow-demand-min)"
                            initial={{ offsetDistance: "0%", opacity: 0 }}
                            animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                            style={{ offsetPath: `path("${pathTransfer}")` }}
                        />
                    )}

                    {/* TOP ROW: RAM SLOTS */}
                    {xSlots.map((x, idx) => {
                        const isLoadedSlot = idx === 1 && mode === 'demand';
                        return (
                            <g key={`ram-slot-${idx}`} transform={`translate(${x}, ${yRam})`}>
                                <rect
                                    x="0"
                                    y="0"
                                    width={slotWidth}
                                    height={slotHeight}
                                    rx="5"
                                    className="fill-slate-900/30 stroke-white/[0.08]"
                                    strokeWidth="1"
                                    strokeDasharray="2 2"
                                />
                                {isLoadedSlot && (
                                    <motion.rect
                                        x="0"
                                        y="0"
                                        width={slotWidth}
                                        height={slotHeight}
                                        rx="5"
                                        fill="rgba(52, 211, 153, 0.2)"
                                        stroke="#34d399"
                                        strokeWidth="1.2"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.25 }}
                                        filter="url(#glow-demand-min)"
                                    />
                                )}
                                <text
                                    x={slotWidth / 2}
                                    y={slotHeight / 2 + 3}
                                    textAnchor="middle"
                                    className={`font-mono text-[8px] font-semibold pointer-events-none transition-colors duration-200 ${
                                        isLoadedSlot ? 'fill-emerald-300 font-bold' : 'fill-slate-600'
                                    }`}
                                >
                                    {isLoadedSlot ? '4 KB' : '—'}
                                </text>
                            </g>
                        );
                    })}

                    {/* BOTTOM ROW: DISC SLOTS (ELF PAGES P0..P3) */}
                    {xSlots.map((x, idx) => {
                        const isRequested = idx === 1 && mode === 'demand';
                        return (
                            <g key={`disc-slot-${idx}`} transform={`translate(${x}, ${yDisc})`}>
                                <rect
                                    x="0"
                                    y="0"
                                    width={slotWidth}
                                    height={slotHeight}
                                    rx="5"
                                    className={`transition-colors duration-200 ${
                                        isRequested
                                            ? 'fill-sky-500/15 stroke-sky-400'
                                            : 'fill-slate-900/40 stroke-white/[0.08]'
                                    }`}
                                    strokeWidth="1"
                                />
                                <text
                                    x={slotWidth / 2}
                                    y={slotHeight / 2 + 3}
                                    textAnchor="middle"
                                    className={`font-mono text-[8.5px] pointer-events-none transition-colors duration-200 ${
                                        isRequested ? 'fill-sky-300 font-bold' : 'fill-slate-500'
                                    }`}
                                >
                                    {`P${idx}`}
                                </text>
                            </g>
                        );
                    })}
                </svg>

            </div>
        </div>
    );
}

