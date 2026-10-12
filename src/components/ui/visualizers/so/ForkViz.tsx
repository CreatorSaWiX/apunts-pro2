"use client";

import React, { useState } from 'react';
import { m as motion } from 'framer-motion';
import { GitFork, Cpu, Clock } from 'lucide-react';

export default function ForkViz() {
    const [hovered, setHovered] = useState<'parent' | 'child' | 'fork' | null>(null);

    const yParent = 60;
    const yChild = 155;

    const pathParent = `M 40 ${yParent} L 550 ${yParent}`;
    const pathForkBranch = `M 140 ${yParent} C 210 ${yParent}, 240 ${yChild}, 310 ${yChild} L 550 ${yChild}`;

    return (
        <div className="w-full my-8 select-none flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl relative">
                <svg
                    viewBox="0 0 600 210"
                    className="w-full h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter id="glow-fork" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <linearGradient id="grad-fork-branch" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#38bdf8" />
                            <stop offset="100%" stopColor="#818cf8" />
                        </linearGradient>
                    </defs>

                    {/* Timeline tracks (Base faint tracks) */}
                    <path
                        d={pathParent}
                        className="stroke-slate-300/30 dark:stroke-white/[0.08]"
                        strokeWidth="1.5"
                    />
                    <path
                        d={pathForkBranch}
                        className="stroke-slate-300/30 dark:stroke-white/[0.08]"
                        strokeWidth="1.5"
                    />

                    {/* Active highlight tracks */}
                    <path
                        d={`M 40 ${yParent} L 140 ${yParent}`}
                        stroke="#38bdf8"
                        strokeWidth={1.8}
                        filter="url(#glow-fork)"
                    />
                    <path
                        d={`M 140 ${yParent} L 550 ${yParent}`}
                        stroke="#34d399"
                        strokeWidth={hovered === 'parent' ? 2.5 : 1.8}
                        filter="url(#glow-fork)"
                        className="transition-all duration-200"
                    />
                    <path
                        d={pathForkBranch}
                        stroke="url(#grad-fork-branch)"
                        strokeWidth={hovered === 'child' ? 2.5 : 1.8}
                        filter="url(#glow-fork)"
                        className="transition-all duration-200"
                    />

                    {/* Animated stream particles */}
                    <motion.circle
                        r={3}
                        fill="#34d399"
                        filter="url(#glow-fork)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                        style={{ offsetPath: `path("${pathParent}")` }}
                    />
                    <motion.circle
                        r={3}
                        fill="#818cf8"
                        filter="url(#glow-fork)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: 0.9, ease: "linear" }}
                        style={{ offsetPath: `path("${pathForkBranch}")` }}
                    />

                    {/* NODE 1: FORK() INVOCATION */}
                    <g
                        transform={`translate(140, ${yParent})`}
                        onMouseEnter={() => setHovered('fork')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer"
                    >
                        <circle cx="0" cy="0" r="24" fill="transparent" />
                        <circle cx="0" cy="0" r={hovered === 'fork' ? 15 : 12} fill="rgba(56, 189, 248, 0.14)" className="transition-all duration-200" />
                        <circle cx="0" cy="0" r="2.5" fill="#38bdf8" />
                        
                        {/* Auto-spaced flexbox header */}
                        <foreignObject x="-60" y="-52" width="120" height="46" className="overflow-visible pointer-events-none">
                            <div className="w-full h-full flex flex-col items-center justify-center gap-1.5">
                                <GitFork className="w-4.5 h-4.5 text-sky-400 drop-shadow-[0_0_6px_rgba(56,189,248,0.5)]" strokeWidth={1.8} />
                                <span className="font-mono text-[9px] font-bold text-sky-300 tracking-wider whitespace-nowrap">
                                    fork()
                                </span>
                            </div>
                        </foreignObject>
                    </g>

                    {/* BADGE: COPIA DE MEMORIA (Centered in the spacious middle branch) */}
                    <g transform="translate(240, 107)">
                        <foreignObject x="-65" y="-16" width="130" height="32" className="overflow-visible pointer-events-none">
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#0b0f19] border border-indigo-400/40 text-[8px] font-mono text-indigo-300 font-semibold shadow-sm tracking-wide whitespace-nowrap">
                                    Còpia RAM
                                </span>
                            </div>
                        </foreignObject>
                    </g>

                    {/* NODE 2: PARENT RUNNING */}
                    <g
                        transform={`translate(400, ${yParent})`}
                        onMouseEnter={() => setHovered('parent')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer"
                    >
                        <circle cx="0" cy="0" r="26" fill="transparent" />
                        <circle cx="0" cy="0" r={hovered === 'parent' ? 16 : 13} fill="rgba(52, 211, 153, 0.14)" className="transition-all duration-200" />
                        <circle cx="0" cy="0" r="2.5" fill="#34d399" />
                        
                        {/* Auto-spaced flexbox header */}
                        <foreignObject x="-70" y="-52" width="140" height="46" className="overflow-visible pointer-events-none">
                            <div className="w-full h-full flex flex-col items-center justify-center gap-1.5">
                                <Cpu className="w-4.5 h-4.5 text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.5)]" strokeWidth={1.8} />
                                <span className="font-mono text-[9px] font-semibold text-emerald-300 tracking-wide whitespace-nowrap">
                                    PARE · RUN
                                </span>
                            </div>
                        </foreignObject>

                        {/* Return Badge */}
                        <foreignObject x="35" y="-14" width="120" height="28" className="overflow-visible pointer-events-none">
                            <div className="w-full h-full flex items-center">
                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#0b0f19] border border-emerald-400/50 text-[8px] font-mono text-emerald-300 font-semibold shadow-sm tracking-wide whitespace-nowrap">
                                    ret = PID_fill
                                </span>
                            </div>
                        </foreignObject>
                    </g>

                    {/* NODE 3: CHILD READY */}
                    <g
                        transform={`translate(400, ${yChild})`}
                        onMouseEnter={() => setHovered('child')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer"
                    >
                        <circle cx="0" cy="0" r="26" fill="transparent" />
                        <circle cx="0" cy="0" r={hovered === 'child' ? 16 : 13} fill="rgba(129, 140, 248, 0.14)" className="transition-all duration-200" />
                        <circle cx="0" cy="0" r="2.5" fill="#818cf8" />
                        
                        {/* Auto-spaced flexbox footer */}
                        <foreignObject x="-70" y="10" width="140" height="46" className="overflow-visible pointer-events-none">
                            <div className="w-full h-full flex flex-col items-center justify-center gap-1.5">
                                <Clock className="w-4.5 h-4.5 text-indigo-400 drop-shadow-[0_0_6px_rgba(129,140,248,0.5)]" strokeWidth={1.8} />
                                <span className="font-mono text-[9px] font-semibold text-indigo-300 tracking-wide whitespace-nowrap">
                                    FILL · READY
                                </span>
                            </div>
                        </foreignObject>

                        {/* Return Badge */}
                        <foreignObject x="35" y="-14" width="100" height="28" className="overflow-visible pointer-events-none">
                            <div className="w-full h-full flex items-center">
                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#0b0f19] border border-indigo-400/50 text-[8px] font-mono text-indigo-300 font-semibold shadow-sm tracking-wide whitespace-nowrap">
                                    ret = 0
                                </span>
                            </div>
                        </foreignObject>
                    </g>
                </svg>
            </div>
        </div>
    );
}
