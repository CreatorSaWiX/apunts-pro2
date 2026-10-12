"use client";

import React, { useState } from 'react';
import { m as motion } from 'framer-motion';
import { Play, PauseCircle } from 'lucide-react';

export default function StoppedViz() {
    const [hovered, setHovered] = useState<'active' | 'stop' | 'stopped' | 'cont' | null>(null);

    // Coordinates
    const pActive = { x: 100, y: 100 };
    const pStopped = { x: 520, y: 100 };

    // Arcs with generous vertical amplitude
    const pathStop = `M ${pActive.x} ${pActive.y} C 240 35, 380 35, ${pStopped.x} ${pStopped.y}`;
    const pathCont = `M ${pStopped.x} ${pStopped.y} C 380 165, 240 165, ${pActive.x} ${pActive.y}`;

    return (
        <div className="w-full my-8 select-none flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl relative">
                <svg
                    viewBox="0 0 620 205"
                    className="w-full h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter id="glow-stopped" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Base tracks */}
                    <path d={pathStop} className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.5" />
                    <path d={pathCont} className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.5" strokeDasharray="3 3" />

                    {/* Active highlight paths */}
                    <path
                        d={pathStop}
                        stroke="#818cf8"
                        strokeWidth={hovered === 'stop' ? 2.5 : 1.8}
                        filter="url(#glow-stopped)"
                    />
                    <path
                        d={pathCont}
                        stroke="#34d399"
                        strokeWidth={hovered === 'cont' ? 2.5 : 1.8}
                        strokeDasharray="3 3"
                        filter="url(#glow-stopped)"
                    />

                    {/* Animated stream particles */}
                    <motion.circle
                        r={3}
                        fill="#818cf8"
                        filter="url(#glow-stopped)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${pathStop}")` }}
                    />
                    <motion.circle
                        r={3}
                        fill="#34d399"
                        filter="url(#glow-stopped)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 2.4, repeat: Infinity, delay: 1.2, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${pathCont}")` }}
                    />

                    {/* TRANSITION BADGES IN SPACIOUS CLEAR CHANNELS */}
                    {/* Top Freeze Label */}
                    <g
                        transform="translate(310, 24)"
                        onMouseEnter={() => setHovered('stop')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer"
                    >
                        <foreignObject x="-80" y="-15" width="160" height="30" className="overflow-visible pointer-events-none">
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="inline-flex items-center px-4 py-1 rounded-full bg-[#0b0f19] border border-indigo-400/50 text-[8px] font-mono text-indigo-300 font-semibold shadow-sm tracking-wide whitespace-nowrap">
                                    Ctrl+Z / SIGSTOP
                                </span>
                            </div>
                        </foreignObject>
                    </g>
                    {/* Bottom Resume Label */}
                    <g
                        transform="translate(310, 175)"
                        onMouseEnter={() => setHovered('cont')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer"
                    >
                        <foreignObject x="-90" y="-15" width="180" height="30" className="overflow-visible pointer-events-none">
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="inline-flex items-center px-4 py-1 rounded-full bg-[#0b0f19] border border-emerald-400/50 text-[8px] font-mono text-emerald-300 font-semibold shadow-sm tracking-wide whitespace-nowrap">
                                    SIGCONT / fg (Continua)
                                </span>
                            </div>
                        </foreignObject>
                    </g>

                    {/* NODE 1: ACTIVE (RUN / READY) (Left) */}
                    <g
                        transform={`translate(${pActive.x}, ${pActive.y})`}
                        onMouseEnter={() => setHovered('active')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer"
                    >
                        <circle cx="0" cy="0" r="26" fill="transparent" />
                        <circle cx="0" cy="0" r={hovered === 'active' ? 16 : 13} fill="rgba(56, 189, 248, 0.14)" className="transition-all duration-200" />
                        <circle cx="0" cy="0" r="2.5" fill="#38bdf8" />
                        
                        {/* Auto-spaced flexbox header */}
                        <foreignObject x="-60" y="-56" width="120" height="50" className="overflow-visible pointer-events-none">
                            <div className="w-full h-full flex flex-col items-center justify-center gap-1.5">
                                <Play className="w-4.5 h-4.5 text-sky-400 drop-shadow-[0_0_6px_rgba(56,189,248,0.5)]" strokeWidth={1.8} />
                                <span className="font-mono text-[9px] font-semibold text-sky-300 tracking-wide whitespace-nowrap">
                                    RUN / READY
                                </span>
                            </div>
                        </foreignObject>

                        {/* Status below */}
                        <foreignObject x="-55" y="18" width="110" height="30" className="overflow-visible pointer-events-none">
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#0b0f19] border border-sky-400/40 text-[7.5px] font-mono text-sky-300 font-semibold shadow-sm tracking-wide whitespace-nowrap">
                                    En execució
                                </span>
                            </div>
                        </foreignObject>
                    </g>

                    {/* NODE 2: STOPPED (Right) */}
                    <g
                        transform={`translate(${pStopped.x}, ${pStopped.y})`}
                        onMouseEnter={() => setHovered('stopped')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer"
                    >
                        <circle cx="0" cy="0" r="26" fill="transparent" />
                        <circle cx="0" cy="0" r={hovered === 'stopped' ? 16 : 13} fill="rgba(129, 140, 248, 0.16)" className="transition-all duration-200" />
                        <circle cx="0" cy="0" r="2.5" fill="#818cf8" />
                        
                        {/* Auto-spaced flexbox header */}
                        <foreignObject x="-60" y="-56" width="120" height="50" className="overflow-visible pointer-events-none">
                            <div className="w-full h-full flex flex-col items-center justify-center gap-1.5">
                                <PauseCircle className="w-4.5 h-4.5 text-indigo-400 drop-shadow-[0_0_6px_rgba(129,140,248,0.5)]" strokeWidth={1.8} />
                                <span className="font-mono text-[9px] font-bold text-indigo-300 tracking-wide whitespace-nowrap">
                                    STOPPED
                                </span>
                            </div>
                        </foreignObject>

                        {/* Status badge below */}
                        <foreignObject x="-65" y="18" width="130" height="30" className="overflow-visible pointer-events-none">
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#0b0f19] border border-indigo-400/40 text-[7.5px] font-mono text-indigo-300 font-semibold shadow-sm tracking-wide whitespace-nowrap">
                                    0% CPU · Pausat
                                </span>
                            </div>
                        </foreignObject>
                    </g>
                </svg>
            </div>
        </div>
    );
}
