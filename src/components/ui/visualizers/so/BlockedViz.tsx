"use client";

import React, { useState } from 'react';
import { m as motion } from 'framer-motion';
import { Cpu, Pause, Clock } from 'lucide-react';

export default function BlockedViz() {
    const [hovered, setHovered] = useState<'run' | 'blocked' | 'ready' | null>(null);

    // Coordinates of the 3 triangle points
    const pRun = { x: 130, y: 70 };
    const pReady = { x: 470, y: 70 };
    const pBlocked = { x: 300, y: 160 };

    // Arcs
    const pathRunToBlocked = `M ${pRun.x} ${pRun.y} C ${pRun.x} 120, 210 ${pBlocked.y}, ${pBlocked.x} ${pBlocked.y}`;
    const pathBlockedToReady = `M ${pBlocked.x} ${pBlocked.y} C 390 ${pBlocked.y}, ${pReady.x} 120, ${pReady.x} ${pReady.y}`;
    const pathReadyToRun = `M ${pReady.x} ${pReady.y} C 390 20, 210 20, ${pRun.x} ${pRun.y}`;

    return (
        <div className="w-full my-8 select-none flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl relative">
                <svg
                    viewBox="0 0 600 220"
                    className="w-full h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter id="glow-blocked" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Base tracks */}
                    <path d={pathRunToBlocked} className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.5" />
                    <path d={pathBlockedToReady} className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.5" />
                    <path d={pathReadyToRun} className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.5" strokeDasharray="3 3" />

                    {/* Active highlight tracks */}
                    <path
                        d={pathRunToBlocked}
                        stroke="#fbbf24"
                        strokeWidth={hovered === 'blocked' ? 2.5 : 1.8}
                        filter="url(#glow-blocked)"
                    />
                    <path
                        d={pathBlockedToReady}
                        stroke="#38bdf8"
                        strokeWidth={hovered === 'ready' ? 2.5 : 1.8}
                        filter="url(#glow-blocked)"
                    />
                    <path
                        d={pathReadyToRun}
                        stroke="#34d399"
                        strokeWidth={hovered === 'run' ? 2.5 : 1.6}
                        strokeDasharray="3 3"
                        filter="url(#glow-blocked)"
                    />

                    {/* Animated stream particles */}
                    <motion.circle
                        r={3}
                        fill="#fbbf24"
                        filter="url(#glow-blocked)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${pathRunToBlocked}")` }}
                    />
                    <motion.circle
                        r={3}
                        fill="#38bdf8"
                        filter="url(#glow-blocked)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 2.2, repeat: Infinity, delay: 0.8, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${pathBlockedToReady}")` }}
                    />
                    <motion.circle
                        r={3}
                        fill="#34d399"
                        filter="url(#glow-blocked)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 2.6, repeat: Infinity, delay: 1.5, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${pathReadyToRun}")` }}
                    />

                    {/* TRANSITION LABELS IN SPACIOUS EMBEDDED PILLS */}
                    {/* Top Arc Label */}
                    <g transform="translate(300, 18)">
                        <foreignObject x="-80" y="-14" width="160" height="28" className="overflow-visible pointer-events-none">
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#0b0f19] border border-emerald-400/40 text-[7.5px] font-mono text-emerald-300 font-semibold shadow-sm tracking-wide whitespace-nowrap">
                                    Torn de CPU (Scheduler)
                                </span>
                            </div>
                        </foreignObject>
                    </g>
                    {/* Left Descending Arc Label */}
                    <g transform="translate(165, 125)">
                        <foreignObject x="-70" y="-14" width="140" height="28" className="overflow-visible pointer-events-none">
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#0b0f19] border border-amber-400/40 text-[7.5px] font-mono text-amber-300 font-semibold shadow-sm tracking-wide whitespace-nowrap">
                                    read() / waitpid()
                                </span>
                            </div>
                        </foreignObject>
                    </g>
                    {/* Right Ascending Arc Label */}
                    <g transform="translate(435, 125)">
                        <foreignObject x="-70" y="-14" width="140" height="28" className="overflow-visible pointer-events-none">
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#0b0f19] border border-sky-400/40 text-[7.5px] font-mono text-sky-300 font-semibold shadow-sm tracking-wide whitespace-nowrap">
                                    E/S resolta / Event
                                </span>
                            </div>
                        </foreignObject>
                    </g>

                    {/* NODE 1: RUN (Top Left) */}
                    <g
                        transform={`translate(${pRun.x}, ${pRun.y})`}
                        onMouseEnter={() => setHovered('run')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer"
                    >
                        <circle cx="0" cy="0" r="26" fill="transparent" />
                        <circle cx="0" cy="0" r={hovered === 'run' ? 16 : 13} fill="rgba(52, 211, 153, 0.14)" className="transition-all duration-200" />
                        <circle cx="0" cy="0" r="2.5" fill="#34d399" />
                        
                        {/* Auto-spaced flexbox header */}
                        <foreignObject x="-60" y="-56" width="120" height="50" className="overflow-visible pointer-events-none">
                            <div className="w-full h-full flex flex-col items-center justify-center gap-1.5">
                                <Cpu className="w-4.5 h-4.5 text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.5)]" strokeWidth={1.8} />
                                <span className="font-mono text-[9px] font-semibold text-emerald-300 tracking-wide whitespace-nowrap">
                                    RUN
                                </span>
                            </div>
                        </foreignObject>

                        {/* Status label placed with plenty of space */}
                        <foreignObject x="-80" y="14" width="80" height="26" className="overflow-visible pointer-events-none">
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#0b0f19] border border-emerald-400/40 text-[7px] font-mono text-emerald-300 font-semibold shadow-sm whitespace-nowrap">
                                    100% CPU
                                </span>
                            </div>
                        </foreignObject>
                    </g>

                    {/* NODE 2: BLOCKED (Bottom Center) */}
                    <g
                        transform={`translate(${pBlocked.x}, ${pBlocked.y})`}
                        onMouseEnter={() => setHovered('blocked')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer"
                    >
                        <circle cx="0" cy="0" r="26" fill="transparent" />
                        <circle cx="0" cy="0" r={hovered === 'blocked' ? 16 : 13} fill="rgba(251, 191, 36, 0.14)" className="transition-all duration-200" />
                        <circle cx="0" cy="0" r="2.5" fill="#fbbf24" />
                        
                        {/* 0% CPU Badge directly above */}
                        <foreignObject x="-50" y="-32" width="100" height="28" className="overflow-visible pointer-events-none">
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#0b0f19] border border-amber-400/50 text-[7.5px] font-mono text-amber-300 font-bold shadow-sm whitespace-nowrap">
                                    0% CPU
                                </span>
                            </div>
                        </foreignObject>

                        {/* Auto-spaced flexbox footer */}
                        <foreignObject x="-60" y="10" width="120" height="50" className="overflow-visible pointer-events-none">
                            <div className="w-full h-full flex flex-col items-center justify-center gap-1.5">
                                <Pause className="w-4.5 h-4.5 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]" strokeWidth={1.8} />
                                <span className="font-mono text-[9px] font-bold text-amber-300 tracking-wide whitespace-nowrap">
                                    BLOCKED
                                </span>
                            </div>
                        </foreignObject>
                    </g>

                    {/* NODE 3: READY (Top Right) */}
                    <g
                        transform={`translate(${pReady.x}, ${pReady.y})`}
                        onMouseEnter={() => setHovered('ready')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer"
                    >
                        <circle cx="0" cy="0" r="26" fill="transparent" />
                        <circle cx="0" cy="0" r={hovered === 'ready' ? 16 : 13} fill="rgba(56, 189, 248, 0.14)" className="transition-all duration-200" />
                        <circle cx="0" cy="0" r="2.5" fill="#38bdf8" />
                        
                        {/* Auto-spaced flexbox header */}
                        <foreignObject x="-60" y="-56" width="120" height="50" className="overflow-visible pointer-events-none">
                            <div className="w-full h-full flex flex-col items-center justify-center gap-1.5">
                                <Clock className="w-4.5 h-4.5 text-sky-400 drop-shadow-[0_0_6px_rgba(56,189,248,0.5)]" strokeWidth={1.8} />
                                <span className="font-mono text-[9px] font-semibold text-sky-300 tracking-wide whitespace-nowrap">
                                    READY
                                </span>
                            </div>
                        </foreignObject>

                        {/* Queue label */}
                        <foreignObject x="0" y="14" width="80" height="26" className="overflow-visible pointer-events-none">
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#0b0f19] border border-sky-400/40 text-[7px] font-mono text-sky-300 font-semibold shadow-sm whitespace-nowrap">
                                    A la cua
                                </span>
                            </div>
                        </foreignObject>
                    </g>
                </svg>
            </div>
        </div>
    );
}
