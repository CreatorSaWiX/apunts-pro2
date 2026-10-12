"use client";

import React, { useState } from 'react';
import { m as motion } from 'framer-motion';
import { Terminal, Send, ShieldCheck, Zap } from 'lucide-react';

export default function KillViz() {
    const [hovered, setHovered] = useState(false);

    const pathTrajectory = "M 80 60 C 180 20, 270 20, 360 60";
    const pathBaseline   = "M 80 60 L 360 60";

    return (
        <div className="w-full my-6 select-none flex flex-col items-center justify-center">
            <div className="w-full max-w-xl relative">
                <svg
                    viewBox="0 0 440 120"
                    className="w-full h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter id="glow-kill" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <linearGradient id="grad-kill" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#38bdf8" />
                            <stop offset="50%" stopColor="#818cf8" />
                            <stop offset="100%" stopColor="#f43f5e" />
                        </linearGradient>
                    </defs>

                    {/* Inactive tracks */}
                    <path d={pathBaseline} className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.2" strokeDasharray="3 3" />
                    <path d={pathTrajectory} className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.2" />

                    {/* Active trajectory */}
                    <motion.path
                        d={pathTrajectory}
                        stroke="url(#grad-kill)"
                        strokeWidth={hovered ? 2.4 : 1.8}
                        strokeLinecap="round"
                        filter="url(#glow-kill)"
                        animate={{ opacity: hovered ? 1 : 0.85 }}
                        transition={{ duration: 0.2 }}
                    />

                    {/* Flying signal packet */}
                    <motion.circle
                        r={3}
                        fill="#38bdf8"
                        filter="url(#glow-kill)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{
                            offsetDistance: "100%",
                            opacity: [0, 1, 1, 0]
                        }}
                        transition={{
                            duration: 1.8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        style={{
                            offsetPath: `path("${pathTrajectory}")`
                        }}
                    />

                    {/* SENDER NODE (Origin) */}
                    <g
                        transform="translate(80, 60)"
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                        className="cursor-pointer"
                    >
                        <circle cx="0" cy="0" r="14" fill="rgba(56, 189, 248, 0.12)" />
                        <circle cx="0" cy="0" r="2.5" fill="#38bdf8" />
                        <foreignObject x="-8" y="-24" width="16" height="16" className="pointer-events-none">
                            <Terminal className="w-4 h-4 text-sky-400" strokeWidth={1.8} />
                        </foreignObject>
                        <text x="0" y="24" textAnchor="middle" className="font-mono text-[9px] font-semibold fill-sky-300 pointer-events-none">
                            PID 100
                        </text>
                    </g>

                    {/* MEDIATING KERNEL TAG */}
                    <g transform="translate(220, 28)">
                        <rect x="-36" y="-10" width="72" height="20" rx="10" fill="#0b0f19" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />
                        <text x="0" y="3" textAnchor="middle" className="font-mono text-[8px] tracking-wider fill-slate-300 pointer-events-none">
                            sys_kill()
                        </text>
                    </g>

                    {/* Signal packet label floating */}
                    <g transform="translate(220, 76)">
                        <text x="0" y="0" textAnchor="middle" className="font-mono text-[8.5px] tracking-widest uppercase fill-indigo-400 pointer-events-none font-medium">
                            SIGINT · 2
                        </text>
                    </g>

                    {/* RECEIVER NODE (Target) */}
                    <g
                        transform="translate(360, 60)"
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                        className="cursor-pointer"
                    >
                        <circle cx="0" cy="0" r="14" fill="rgba(244, 63, 94, 0.12)" />
                        <circle cx="0" cy="0" r="2.5" fill="#f43f5e" />
                        <foreignObject x="-8" y="-24" width="16" height="16" className="pointer-events-none">
                            <Zap className="w-4 h-4 text-rose-400" strokeWidth={1.8} />
                        </foreignObject>
                        <text x="0" y="24" textAnchor="middle" className="font-mono text-[9px] font-semibold fill-rose-300 pointer-events-none">
                            PID 200
                        </text>
                    </g>
                </svg>
            </div>
        </div>
    );
}
