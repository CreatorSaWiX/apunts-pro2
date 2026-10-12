"use client";

import React, { useState } from 'react';
import { m as motion } from 'framer-motion';
import { Pause, Play, RotateCcw, Zap, Shield } from 'lucide-react';

export default function SigsuspendViz() {
    const [hovered, setHovered] = useState(false);

    // Exact aligned pipeline stages at y = 58
    const p1 = { x: 55,  y: 58 };
    const p2 = { x: 155, y: 58 };
    const p3 = { x: 255, y: 58 };
    const p4 = { x: 355, y: 58 };

    const pathStage1 = `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;
    const pathStage2 = `M ${p2.x} ${p2.y} L ${p3.x} ${p3.y}`;
    const pathStage3 = `M ${p3.x} ${p3.y} L ${p4.x} ${p4.y}`;
    // Curve loops cleanly beneath the timeline where there is zero text
    const pathRestore = `M ${p4.x} ${p4.y} C ${p4.x} 104, ${p1.x} 104, ${p1.x} ${p4.y}`;

    return (
        <div className="w-full my-6 select-none flex flex-col items-center justify-center">
            <div className="w-full max-w-xl relative">
                <svg
                    viewBox="0 0 420 120"
                    className="w-full h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter id="glow-sigsuspend" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <linearGradient id="grad-restore" x1="100%" y1="0%" x2="0%" y2="0%">
                            <stop offset="0%" stopColor="#34d399" />
                            <stop offset="50%" stopColor="#818cf8" />
                            <stop offset="100%" stopColor="#38bdf8" />
                        </linearGradient>
                    </defs>

                    {/* Timeline Base Tracks */}
                    <path d={pathStage1} className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.3" />
                    <path d={pathStage2} className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.3" strokeDasharray="3 3" />
                    <path d={pathStage3} className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.3" />
                    <path d={pathRestore} className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.2" strokeDasharray="3 3" />

                    {/* Active Forward Stages */}
                    <path d={pathStage1} stroke="#38bdf8" strokeWidth={1.8} filter="url(#glow-sigsuspend)" />
                    <path d={pathStage2} stroke="#fbbf24" strokeWidth={1.8} strokeDasharray="3 3" filter="url(#glow-sigsuspend)" />
                    <path d={pathStage3} stroke="#c084fc" strokeWidth={1.8} filter="url(#glow-sigsuspend)" />

                    {/* Restore Loop Path (Clear area below with no text collision) */}
                    <motion.path
                        d={pathRestore}
                        stroke="url(#grad-restore)"
                        strokeWidth={hovered ? 2.2 : 1.6}
                        strokeDasharray="3 3"
                        filter="url(#glow-sigsuspend)"
                        animate={{ opacity: hovered ? 1 : 0.8 }}
                    />

                    {/* Flowing restore particle */}
                    <motion.circle
                        r={2.5}
                        fill="#34d399"
                        filter="url(#glow-sigsuspend)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${pathRestore}")` }}
                    />



                    {/* STAGE 1: RUNNING WITH MASK A */}
                    <g transform={`translate(${p1.x}, ${p1.y})`}>
                        <circle cx="0" cy="0" r="13" fill="rgba(56, 189, 248, 0.12)" />
                        <circle cx="0" cy="0" r="2.5" fill="#38bdf8" />
                        <foreignObject x="-8" y="-32" width="16" height="16" className="pointer-events-none">
                            <Shield className="w-4 h-4 text-sky-400" strokeWidth={1.8} />
                        </foreignObject>
                        <text x="0" y="-8" textAnchor="middle" className="font-mono text-[8px] font-semibold fill-sky-300 pointer-events-none">
                            MÀSCARA A
                        </text>
                    </g>

                    {/* STAGE 2: SIGSUSPEND PAUSE (Temp Mask) */}
                    <g
                        transform={`translate(${p2.x}, ${p2.y})`}
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                        className="cursor-pointer"
                    >
                        <circle cx="0" cy="0" r={hovered ? 15 : 13} fill="rgba(251, 191, 36, 0.12)" className="transition-all duration-200" />
                        <circle cx="0" cy="0" r="2.5" fill="#fbbf24" />
                        <foreignObject x="-8" y="-32" width="16" height="16" className="pointer-events-none">
                            <Pause className="w-4 h-4 text-amber-400" strokeWidth={1.8} />
                        </foreignObject>
                        <text x="0" y="-8" textAnchor="middle" className="font-mono text-[8px] font-bold fill-amber-300 pointer-events-none">
                            PAUSAT
                        </text>
                    </g>

                    {/* STAGE 3: SIGNAL DELIVERED + HANDLER */}
                    <g transform={`translate(${p3.x}, ${p3.y})`}>
                        <circle cx="0" cy="0" r="13" fill="rgba(192, 132, 252, 0.12)" />
                        <circle cx="0" cy="0" r="2.5" fill="#c084fc" />
                        <foreignObject x="-8" y="-32" width="16" height="16" className="pointer-events-none">
                            <Zap className="w-4 h-4 text-purple-400" strokeWidth={1.8} />
                        </foreignObject>
                        <text x="0" y="-8" textAnchor="middle" className="font-mono text-[8px] font-semibold fill-purple-300 pointer-events-none">
                            HANDLER
                        </text>
                    </g>

                    {/* STAGE 4: RETURN & RESTORE */}
                    <g transform={`translate(${p4.x}, ${p4.y})`}>
                        <circle cx="0" cy="0" r="13" fill="rgba(52, 211, 153, 0.12)" />
                        <circle cx="0" cy="0" r="2.5" fill="#34d399" />
                        <foreignObject x="-8" y="-32" width="16" height="16" className="pointer-events-none">
                            <RotateCcw className="w-4 h-4 text-emerald-400" strokeWidth={1.8} />
                        </foreignObject>
                        <text x="0" y="-8" textAnchor="middle" className="font-mono text-[8px] font-bold fill-emerald-300 pointer-events-none">
                            RESTORE
                        </text>
                    </g>
                </svg>

                {/* Subtitle indicator below SVG */}
                <div className="flex items-center text-[9.5px] font-mono text-slate-400">
                    <span>RESTORE: el Kernel auto-restaura la màscara original en retornar</span>
                </div>
            </div>
        </div>
    );
}
