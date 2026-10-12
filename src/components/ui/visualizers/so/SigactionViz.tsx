"use client";

import React, { useState } from 'react';
import { m as motion } from 'framer-motion';
import { Zap, Sliders, Play, XCircle } from 'lucide-react';

export default function SigactionViz() {
    const [hovered, setHovered] = useState(false);

    const pathIncoming   = "M 60 60 L 190 60";
    const pathDfl        = "M 190 60 C 240 60, 260 30, 360 30";
    const pathCustom     = "M 190 60 C 240 60, 260 90, 360 90";

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
                        <filter id="glow-sigaction" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <linearGradient id="grad-custom-handler" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#c084fc" />
                            <stop offset="100%" stopColor="#34d399" />
                        </linearGradient>
                    </defs>

                    {/* Inactive base tracks */}
                    <path d={pathIncoming} className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.2" />
                    <path d={pathDfl}      className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.2" strokeDasharray="3 3" />
                    <path d={pathCustom}   className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.2" />

                    {/* Incoming track */}
                    <motion.path
                        d={pathIncoming}
                        stroke="#38bdf8"
                        strokeWidth={1.8}
                        strokeLinecap="round"
                        filter="url(#glow-sigaction)"
                    />

                    {/* Old Default Path (Bypassed / Inactive) */}
                    <path
                        d={pathDfl}
                        stroke="#f43f5e"
                        strokeWidth="1.2"
                        strokeDasharray="3 3"
                        opacity={hovered ? "0.2" : "0.35"}
                    />

                    {/* Custom Handler Path (Active & highlighted) */}
                    <motion.path
                        d={pathCustom}
                        stroke="url(#grad-custom-handler)"
                        strokeWidth={hovered ? 2.5 : 2}
                        strokeLinecap="round"
                        filter="url(#glow-sigaction)"
                        animate={{ opacity: hovered ? 1 : 0.9 }}
                    />

                    {/* Flowing signal redirected into user handler */}
                    <motion.circle
                        r={3}
                        fill="#34d399"
                        filter="url(#glow-sigaction)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${pathCustom}")` }}
                    />

                    {/* 1. INCOMING SIGNAL */}
                    <g transform="translate(60, 60)">
                        <circle cx="0" cy="0" r="14" fill="rgba(56, 189, 248, 0.12)" />
                        <circle cx="0" cy="0" r="2.5" fill="#38bdf8" />
                        <foreignObject x="-8" y="-24" width="16" height="16" className="pointer-events-none">
                            <Zap className="w-4 h-4 text-sky-400" strokeWidth={1.8} />
                        </foreignObject>
                        <text x="0" y="24" textAnchor="middle" className="font-mono text-[9px] font-semibold fill-sky-300 pointer-events-none">
                            SIGINT
                        </text>
                    </g>

                    {/* 2. SIGACTION REDIRECTION (Action Table node) */}
                    <g
                        transform="translate(190, 60)"
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                        className="cursor-pointer"
                    >
                        <rect x="-24" y="-20" width="48" height="40" fill="transparent" />
                        <circle cx="0" cy="0" r="14" fill="rgba(192, 132, 252, 0.12)" />
                        <circle cx="0" cy="0" r="2.5" fill="#c084fc" />
                        <foreignObject x="-8" y="-24" width="16" height="16" className="pointer-events-none">
                            <Sliders className="w-4 h-4 text-purple-400" strokeWidth={1.8} />
                        </foreignObject>
                        <text x="0" y="24" textAnchor="middle" className="font-mono text-[8.5px] font-semibold fill-purple-300 pointer-events-none">
                            sigaction()
                        </text>
                    </g>

                    {/* 3. OLD DEFAULT (Disabled) */}
                    <g transform="translate(360, 30)" opacity={hovered ? "0.3" : "0.5"}>
                        <circle cx="0" cy="0" r="2" fill="#f43f5e" />
                        <text x="12" y="3" textAnchor="start" className="font-mono text-[8.5px] line-through fill-rose-400 pointer-events-none">
                            SIG_DFL (exit)
                        </text>
                    </g>

                    {/* 4. NEW HANDLER (Active) */}
                    <g
                        transform="translate(360, 90)"
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                        className="cursor-pointer"
                    >
                        <circle cx="0" cy="0" r="13" fill="rgba(52, 211, 153, 0.12)" />
                        <circle cx="0" cy="0" r="2.5" fill="#34d399" />
                        <foreignObject x="10" y="-8" width="16" height="16" className="pointer-events-none">
                            <Play className="w-3.5 h-3.5 text-emerald-400" strokeWidth={1.8} />
                        </foreignObject>
                        <text x="30" y="4" textAnchor="start" className="font-mono text-[9px] font-bold fill-emerald-300 pointer-events-none">
                            handler()
                        </text>
                    </g>
                </svg>
            </div>
        </div>
    );
}
