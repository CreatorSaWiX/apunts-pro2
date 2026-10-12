"use client";

import React, { useState } from 'react';
import { m as motion } from 'framer-motion';
import { Cpu, Ghost, CheckCircle2 } from 'lucide-react';

export default function ZombieViz() {
    const [hovered, setHovered] = useState<'run' | 'zombie' | 'reaped' | null>(null);

    const yLine = 85;
    const pathLine = `M 40 ${yLine} L 580 ${yLine}`;

    return (
        <div className="w-full my-8 select-none flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl relative">
                <svg
                    viewBox="0 0 620 185"
                    className="w-full h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter id="glow-zombie" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <linearGradient id="grad-zombie" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#38bdf8" />
                            <stop offset="50%" stopColor="#f43f5e" />
                            <stop offset="100%" stopColor="#34d399" />
                        </linearGradient>
                    </defs>

                    {/* Timeline base track */}
                    <path
                        d={pathLine}
                        className="stroke-slate-300/30 dark:stroke-white/[0.08]"
                        strokeWidth="1.5"
                    />

                    {/* Active Gradient track */}
                    <path
                        d={pathLine}
                        stroke="url(#grad-zombie)"
                        strokeWidth={1.8}
                        filter="url(#glow-zombie)"
                    />

                    {/* Flowing particle */}
                    <motion.circle
                        r={3}
                        fill="#f43f5e"
                        filter="url(#glow-zombie)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${pathLine}")` }}
                    />

                    {/* TRANSITION BADGES FLOATING ABOVE TRACK */}
                    <g transform="translate(205, 42)">
                        <foreignObject x="-60" y="-15" width="120" height="30" className="overflow-visible pointer-events-none">
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#0b0f19] border border-rose-400/50 text-[8px] font-mono text-rose-300 font-semibold shadow-sm tracking-wide whitespace-nowrap">
                                    exit(status)
                                </span>
                            </div>
                        </foreignObject>
                    </g>
                    <g transform="translate(415, 42)">
                        <foreignObject x="-60" y="-15" width="120" height="30" className="overflow-visible pointer-events-none">
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#0b0f19] border border-emerald-400/50 text-[8px] font-mono text-emerald-300 font-semibold shadow-sm tracking-wide whitespace-nowrap">
                                    waitpid()
                                </span>
                            </div>
                        </foreignObject>
                    </g>

                    {/* NODE 1: RUNNING PROCESS (x = 100) */}
                    <g
                        transform={`translate(100, ${yLine})`}
                        onMouseEnter={() => setHovered('run')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer"
                    >
                        <circle cx="0" cy="0" r="26" fill="transparent" />
                        <circle cx="0" cy="0" r={hovered === 'run' ? 16 : 13} fill="rgba(56, 189, 248, 0.14)" className="transition-all duration-200" />
                        <circle cx="0" cy="0" r="2.5" fill="#38bdf8" />
                        
                        {/* Auto-spaced flexbox header */}
                        <foreignObject x="-60" y="-56" width="120" height="50" className="overflow-visible pointer-events-none">
                            <div className="w-full h-full flex flex-col items-center justify-center gap-1.5">
                                <Cpu className="w-4.5 h-4.5 text-sky-400 drop-shadow-[0_0_6px_rgba(56,189,248,0.5)]" strokeWidth={1.8} />
                                <span className="font-mono text-[9px] font-semibold text-sky-300 tracking-wide whitespace-nowrap">
                                    RUN
                                </span>
                            </div>
                        </foreignObject>

                        {/* Subtitle Badge below */}
                        <foreignObject x="-70" y="18" width="140" height="30" className="overflow-visible pointer-events-none">
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#0b0f19] border border-sky-400/40 text-[7.5px] font-mono text-sky-300 font-semibold shadow-sm tracking-wide whitespace-nowrap">
                                    RAM + PCB actius
                                </span>
                            </div>
                        </foreignObject>
                    </g>

                    {/* NODE 2: ZOMBIE STATE (x = 310) */}
                    <g
                        transform={`translate(310, ${yLine})`}
                        onMouseEnter={() => setHovered('zombie')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer"
                    >
                        <circle cx="0" cy="0" r="26" fill="transparent" />
                        <circle cx="0" cy="0" r={hovered === 'zombie' ? 16 : 13} fill="rgba(244, 63, 94, 0.16)" className="transition-all duration-200" />
                        <circle cx="0" cy="0" r="2.5" fill="#f43f5e" />
                        
                        {/* Auto-spaced flexbox header */}
                        <foreignObject x="-60" y="-56" width="120" height="50" className="overflow-visible pointer-events-none">
                            <div className="w-full h-full flex flex-col items-center justify-center gap-1.5">
                                <Ghost className="w-4.5 h-4.5 text-rose-400 drop-shadow-[0_0_6px_rgba(244,63,94,0.5)]" strokeWidth={1.8} />
                                <span className="font-mono text-[9px] font-bold text-rose-300 tracking-wide whitespace-nowrap">
                                    ZOMBIE
                                </span>
                            </div>
                        </foreignObject>

                        {/* Status Badge below */}
                        <foreignObject x="-75" y="18" width="150" height="30" className="overflow-visible pointer-events-none">
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#0b0f19] border border-rose-400/40 text-[7.5px] font-mono text-rose-300 font-semibold shadow-sm tracking-wide whitespace-nowrap">
                                    Només PCB (status)
                                </span>
                            </div>
                        </foreignObject>
                    </g>

                    {/* NODE 3: REAPED / ALLIBERAT (x = 520) */}
                    <g
                        transform={`translate(520, ${yLine})`}
                        onMouseEnter={() => setHovered('reaped')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer"
                    >
                        <circle cx="0" cy="0" r="26" fill="transparent" />
                        <circle cx="0" cy="0" r={hovered === 'reaped' ? 16 : 13} fill="rgba(52, 211, 153, 0.14)" className="transition-all duration-200" />
                        <circle cx="0" cy="0" r="2.5" fill="#34d399" />
                        
                        {/* Auto-spaced flexbox header */}
                        <foreignObject x="-60" y="-56" width="120" height="50" className="overflow-visible pointer-events-none">
                            <div className="w-full h-full flex flex-col items-center justify-center gap-1.5">
                                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.5)]" strokeWidth={1.8} />
                                <span className="font-mono text-[9px] font-semibold text-emerald-300 tracking-wide whitespace-nowrap">
                                    ALLIBERAT
                                </span>
                            </div>
                        </foreignObject>

                        {/* Subtitle Badge below */}
                        <foreignObject x="-65" y="18" width="130" height="30" className="overflow-visible pointer-events-none">
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#0b0f19] border border-emerald-400/40 text-[7.5px] font-mono text-emerald-300 font-semibold shadow-sm tracking-wide whitespace-nowrap">
                                    PCB destruït ✓
                                </span>
                            </div>
                        </foreignObject>
                    </g>
                </svg>
            </div>
        </div>
    );
}
