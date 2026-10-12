"use client";

import React, { useState } from 'react';
import { m as motion } from 'framer-motion';
import { Terminal, Cpu, Shield } from 'lucide-react';

export default function ContextSwitchViz() {
    const [hovered, setHovered] = useState<'a' | 'kernel' | 'b' | null>(null);

    // Coordinates: comfortable vertical and horizontal breathing room
    // Process A: (110, 56)
    // Kernel switch: (300, 130)
    // Process B: (490, 56)
    const yUser = 56;
    const yKernel = 130;

    const pathTrajectory = `M 110 ${yUser} C 180 ${yUser}, 200 ${yKernel}, 280 ${yKernel} L 320 ${yKernel} C 400 ${yKernel}, 420 ${yUser}, 490 ${yUser}`;
    const pathLeadIn     = `M 40 ${yUser} L 110 ${yUser}`;
    const pathLeadOut    = `M 490 ${yUser} L 560 ${yUser}`;

    return (
        <div className="w-full my-8 select-none flex flex-col items-center justify-center">
            <div className="w-full max-w-xl relative">
                <svg
                    viewBox="0 0 600 185"
                    className="w-full h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter id="glow-cs" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <linearGradient id="grad-cs" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#38bdf8" />
                            <stop offset="40%" stopColor="#818cf8" />
                            <stop offset="60%" stopColor="#c084fc" />
                            <stop offset="100%" stopColor="#34d399" />
                        </linearGradient>
                    </defs>

                    {/* Mode Boundaries: Generous background bands with safe margins */}
                    <rect x="30" y="10" width="540" height="72" rx="10" className="fill-slate-500/[0.03] dark:fill-white/[0.015]" />
                    <rect x="150" y="102" width="300" height="64" rx="10" className="fill-indigo-950/15 dark:fill-indigo-500/[0.04] stroke-indigo-500/20" strokeDasharray="3 3" />

                    {/* Safe placed Zone Titles (Centered with maximum breathing room from both nodes) */}
                    <text x="300" y="26" textAnchor="middle" className="font-mono text-[8px] uppercase tracking-widest fill-slate-400/60 dark:fill-slate-500/60 pointer-events-none">
                        Mode Usuari
                    </text>
                    <text x="300" y="156" textAnchor="middle" className="font-mono text-[7.5px] uppercase tracking-widest fill-indigo-400/60 pointer-events-none">
                        Mode Kernel · Overhead
                    </text>

                    {/* Base Tracks */}
                    <path d={pathLeadIn} className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.5" />
                    <path d={pathLeadOut} className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.5" />
                    <path d={pathTrajectory} className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.5" strokeDasharray="3 3" />

                    {/* Active Transition Path */}
                    <path
                        d={pathTrajectory}
                        stroke="url(#grad-cs)"
                        strokeWidth={1.8}
                        strokeLinecap="round"
                        filter="url(#glow-cs)"
                    />

                    {/* Travelling Particle */}
                    <motion.circle
                        r={3}
                        fill="#38bdf8"
                        filter="url(#glow-cs)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${pathTrajectory}")` }}
                    />

                    {/* NODE A: Procés A */}
                    <g
                        transform={`translate(110, ${yUser})`}
                        onMouseEnter={() => setHovered('a')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer"
                    >
                        <circle cx="0" cy="0" r={hovered === 'a' ? 16 : 13} fill="rgba(56, 189, 248, 0.14)" className="transition-all duration-200" />
                        <circle cx="0" cy="0" r="2.5" fill="#38bdf8" />
                        
                        {/* Auto-spaced flexbox header */}
                        <foreignObject x="-60" y="-52" width="120" height="46" className="overflow-visible pointer-events-none">
                            <div className="w-full h-full flex flex-col items-center justify-center gap-1.5">
                                <Terminal className="w-4.5 h-4.5 text-sky-400 drop-shadow-[0_0_6px_rgba(56,189,248,0.5)]" strokeWidth={1.8} />
                                <span className="font-mono text-[9px] font-bold text-sky-300 tracking-wide whitespace-nowrap">
                                    Procés A
                                </span>
                            </div>
                        </foreignObject>
                    </g>

                    {/* KERNEL SWITCH CAPSULES */}
                    {/* Desa PCB[A] */}
                    <g transform={`translate(215, ${yKernel})`}>
                        <foreignObject x="-65" y="-15" width="130" height="30" className="overflow-visible pointer-events-none">
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#0b0f19] border border-indigo-400/50 text-[7.5px] font-mono text-indigo-300 font-semibold shadow-sm tracking-wide whitespace-nowrap">
                                    desa PCB[A]
                                </span>
                            </div>
                        </foreignObject>
                    </g>

                    {/* Central Kernel Shield Icon */}
                    <g transform={`translate(300, ${yKernel})`}>
                        <circle cx="0" cy="0" r="13" fill="#0b0f19" stroke="rgba(192, 132, 252, 0.5)" strokeWidth="1" />
                        <circle cx="0" cy="0" r="2.5" fill="#c084fc" />
                        <foreignObject x="-8" y="-8" width="16" height="16" className="pointer-events-none">
                            <Shield className="w-4 h-4 text-purple-400 drop-shadow-[0_0_6px_rgba(192,132,252,0.6)]" strokeWidth={1.8} />
                        </foreignObject>
                    </g>

                    {/* Carrega PCB[B] */}
                    <g transform={`translate(385, ${yKernel})`}>
                        <foreignObject x="-70" y="-15" width="140" height="30" className="overflow-visible pointer-events-none">
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#0b0f19] border border-purple-400/50 text-[7.5px] font-mono text-purple-300 font-semibold shadow-sm tracking-wide whitespace-nowrap">
                                    carrega PCB[B]
                                </span>
                            </div>
                        </foreignObject>
                    </g>

                    {/* NODE B: Procés B */}
                    <g
                        transform={`translate(490, ${yUser})`}
                        onMouseEnter={() => setHovered('b')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer"
                    >
                        <circle cx="0" cy="0" r={hovered === 'b' ? 16 : 13} fill="rgba(52, 211, 153, 0.14)" className="transition-all duration-200" />
                        <circle cx="0" cy="0" r="2.5" fill="#34d399" />
                        
                        {/* Auto-spaced flexbox header */}
                        <foreignObject x="-60" y="-52" width="120" height="46" className="overflow-visible pointer-events-none">
                            <div className="w-full h-full flex flex-col items-center justify-center gap-1.5">
                                <Cpu className="w-4.5 h-4.5 text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.5)]" strokeWidth={1.8} />
                                <span className="font-mono text-[9px] font-bold text-emerald-300 tracking-wide whitespace-nowrap">
                                    Procés B
                                </span>
                            </div>
                        </foreignObject>
                    </g>
                </svg>
            </div>
        </div>
    );
}
