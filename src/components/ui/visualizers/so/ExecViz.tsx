"use client";

import React, { useState } from 'react';
import { m as motion } from 'framer-motion';
import { FileCode, RefreshCw, Terminal } from 'lucide-react';

export default function ExecViz() {
    const [hovered, setHovered] = useState<'before' | 'exec' | 'after' | null>(null);

    const yLine = 80;
    const pathLine = `M 40 ${yLine} L 560 ${yLine}`;

    return (
        <div className="w-full my-8 select-none flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl relative">
                <svg
                    viewBox="0 0 600 170"
                    className="w-full h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter id="glow-exec" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <linearGradient id="grad-exec" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#38bdf8" />
                            <stop offset="50%" stopColor="#c084fc" />
                            <stop offset="100%" stopColor="#34d399" />
                        </linearGradient>
                    </defs>

                    {/* Base Pipeline Track */}
                    <path
                        d={pathLine}
                        className="stroke-slate-300/30 dark:stroke-white/[0.08]"
                        strokeWidth="1.5"
                    />

                    {/* Active Gradient Track */}
                    <path
                        d={pathLine}
                        stroke="url(#grad-exec)"
                        strokeWidth={1.8}
                        filter="url(#glow-exec)"
                    />

                    {/* Flowing mutation particle */}
                    <motion.circle
                        r={3}
                        fill="#c084fc"
                        filter="url(#glow-exec)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${pathLine}")` }}
                    />

                    {/* NODE 1: ORIGINAL PROGRAM (x = 110) */}
                    <g
                        transform={`translate(110, ${yLine})`}
                        onMouseEnter={() => setHovered('before')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer"
                    >
                        <circle cx="0" cy="0" r="26" fill="transparent" />
                        <circle cx="0" cy="0" r={hovered === 'before' ? 16 : 13} fill="rgba(56, 189, 248, 0.14)" className="transition-all duration-200" />
                        <circle cx="0" cy="0" r="2.5" fill="#38bdf8" />
                        
                        {/* Auto-spaced flexbox header */}
                        <foreignObject x="-75" y="-56" width="150" height="50" className="overflow-visible pointer-events-none">
                            <div className="w-full h-full flex flex-col items-center justify-center gap-1.5">
                                <FileCode className="w-4.5 h-4.5 text-sky-400 drop-shadow-[0_0_6px_rgba(56,189,248,0.5)]" strokeWidth={1.8} />
                                <span className="font-mono text-[9px] font-semibold text-sky-300 tracking-wide whitespace-nowrap">
                                    prog_original
                                </span>
                            </div>
                        </foreignObject>

                        {/* PID Badge below */}
                        <foreignObject x="-50" y="18" width="100" height="30" className="overflow-visible pointer-events-none">
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#0b0f19] border border-sky-400/40 text-[8px] font-mono text-sky-300 font-semibold shadow-sm tracking-wide whitespace-nowrap">
                                    PID 1024
                                </span>
                            </div>
                        </foreignObject>
                    </g>

                    {/* NODE 2: EXECLP MUTATION GATEWAY (x = 300) */}
                    <g
                        transform={`translate(300, ${yLine})`}
                        onMouseEnter={() => setHovered('exec')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer"
                    >
                        {/* Elegant capsule with generous internal padding and gap */}
                        <foreignObject x="-80" y="-18" width="160" height="36" className="overflow-visible pointer-events-none">
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0b0f19] border border-purple-400/60 shadow-lg transition-all duration-200">
                                    <RefreshCw className="w-4 h-4 text-purple-400 animate-[spin_6s_linear_infinite]" strokeWidth={1.8} />
                                    <span className="font-mono text-[8.5px] font-bold text-purple-300 tracking-wider whitespace-nowrap">
                                        execlp("ls")
                                    </span>
                                </span>
                            </div>
                        </foreignObject>

                        {/* Subtitle below with clear spacing */}
                        <foreignObject x="-90" y="24" width="180" height="24" className="overflow-visible pointer-events-none">
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="font-mono text-[7.5px] text-purple-300/80 whitespace-nowrap">
                                    Substitueix memòria RAM
                                </span>
                            </div>
                        </foreignObject>
                    </g>

                    {/* NODE 3: MUTATED PROGRAM (x = 490) */}
                    <g
                        transform={`translate(490, ${yLine})`}
                        onMouseEnter={() => setHovered('after')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer"
                    >
                        <circle cx="0" cy="0" r="26" fill="transparent" />
                        <circle cx="0" cy="0" r={hovered === 'after' ? 16 : 13} fill="rgba(52, 211, 153, 0.14)" className="transition-all duration-200" />
                        <circle cx="0" cy="0" r="2.5" fill="#34d399" />
                        
                        {/* Auto-spaced flexbox header */}
                        <foreignObject x="-75" y="-56" width="150" height="50" className="overflow-visible pointer-events-none">
                            <div className="w-full h-full flex flex-col items-center justify-center gap-1.5">
                                <Terminal className="w-4.5 h-4.5 text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.5)]" strokeWidth={1.8} />
                                <span className="font-mono text-[9px] font-semibold text-emerald-300 tracking-wide whitespace-nowrap">
                                    binari: /bin/ls
                                </span>
                            </div>
                        </foreignObject>

                        {/* Same PID Badge below */}
                        <foreignObject x="-60" y="18" width="120" height="30" className="overflow-visible pointer-events-none">
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#0b0f19] border border-emerald-400/40 text-[8px] font-mono text-emerald-300 font-semibold shadow-sm tracking-wide whitespace-nowrap">
                                    PID 1024 ✓
                                </span>
                            </div>
                        </foreignObject>
                    </g>
                </svg>
            </div>
        </div>
    );
}
