"use client";

import React, { useState } from 'react';
import { m as motion } from 'framer-motion';
import { Cpu, Database, HardDrive } from 'lucide-react';

export default function ThrashingViz() {
    const [mode, setMode] = useState<'normal' | 'thrashing'>('thrashing');

    // Geometry: 3 nodes on a balanced horizontal axis
    // CPU: (80, 85)
    // RAM: (280, 85)
    // SWAP: (480, 85)
    const yLine = 85;

    // Normal: direct stream RAM -> CPU
    const pathRamToCpu = `M 280 ${yLine} L 80 ${yLine}`;

    // Thrashing: continuous ping-pong swap loops between RAM and SWAP
    const pathPageOut = "M 280 75 C 335 40, 425 40, 480 75";
    const pathPageIn  = "M 480 95 C 425 130, 335 130, 280 95";

    // Faint connection lines for blueprint
    const pathStraightSwap = `M 280 ${yLine} L 480 ${yLine}`;

    return (
        <div className="w-full my-6 select-none flex flex-col items-center justify-center not-prose">
            <div className="w-full max-w-lg relative flex flex-col items-center">
                {/* Minimalist 2-state Switch */}
                <div className="flex items-center gap-1 p-0.5 rounded-full bg-slate-900/60 border border-white/5 mb-3">
                    <button
                        type="button"
                        onClick={() => setMode('normal')}
                        className={`px-3 py-1 rounded-full font-mono text-[10px] transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                            mode === 'normal'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-sm'
                                : 'text-slate-500 hover:text-slate-300 border border-transparent'
                        }`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${mode === 'normal' ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                        Normal
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('thrashing')}
                        className={`px-3 py-1 rounded-full font-mono text-[10px] transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                            mode === 'thrashing'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-400/40 shadow-sm'
                                : 'text-slate-500 hover:text-slate-300 border border-transparent'
                        }`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${mode === 'thrashing' ? 'bg-rose-400 animate-pulse' : 'bg-slate-600'}`} />
                        Thrashing
                    </button>
                </div>

                <svg
                    viewBox="0 0 560 170"
                    className="w-full h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        {/* Glow filter */}
                        <filter id="glow-thrashing" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* Thrashing loop gradient */}
                        <linearGradient id="grad-thrash-out" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#fbbf24" />
                            <stop offset="100%" stopColor="#f43f5e" />
                        </linearGradient>
                        <linearGradient id="grad-thrash-in" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#f43f5e" />
                            <stop offset="100%" stopColor="#fbbf24" />
                        </linearGradient>
                    </defs>

                    {/* BASE BLUEPRINT TRACKS (Faint background) */}
                    <path
                        d={pathRamToCpu}
                        className="stroke-slate-300/30 dark:stroke-white/[0.08]"
                        strokeWidth="1.5"
                    />
                    <path
                        d={pathStraightSwap}
                        className="stroke-slate-300/30 dark:stroke-white/[0.08]"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                    />
                    {mode === 'thrashing' && (
                        <>
                            <path d={pathPageOut} className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.5" />
                            <path d={pathPageIn}  className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.5" />
                        </>
                    )}

                    {/* ACTIVE FLOW: NORMAL MODE (RAM -> CPU) */}
                    {mode === 'normal' && (
                        <>
                            <motion.path
                                d={pathRamToCpu}
                                stroke="#34d399"
                                strokeWidth={2}
                                strokeLinecap="round"
                                filter="url(#glow-thrashing)"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.95 }}
                                transition={{ duration: 0.25 }}
                            />
                            {/* Fast steady particle streaming into CPU */}
                            <motion.circle
                                key="particle-normal"
                                r={2.8}
                                fill="#34d399"
                                filter="url(#glow-thrashing)"
                                initial={{ offsetDistance: "0%", opacity: 0 }}
                                animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                style={{ offsetPath: `path("${pathRamToCpu}")` }}
                            />
                        </>
                    )}

                    {/* ACTIVE FLOW: THRASHING MODE (Continuous Swap Storm) */}
                    {mode === 'thrashing' && (
                        <>
                            {/* Page Out Curve */}
                            <motion.path
                                d={pathPageOut}
                                stroke="url(#grad-thrash-out)"
                                strokeWidth={2}
                                strokeLinecap="round"
                                filter="url(#glow-thrashing)"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.95 }}
                                transition={{ duration: 0.25 }}
                            />
                            {/* Page In Curve */}
                            <motion.path
                                d={pathPageIn}
                                stroke="url(#grad-thrash-in)"
                                strokeWidth={2}
                                strokeLinecap="round"
                                filter="url(#glow-thrashing)"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.95 }}
                                transition={{ duration: 0.25 }}
                            />

                            {/* Rapid swapping particles */}
                            <motion.circle
                                key="p-thrash-out"
                                r={2.8}
                                fill="#f43f5e"
                                filter="url(#glow-thrashing)"
                                initial={{ offsetDistance: "0%", opacity: 0 }}
                                animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                                transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
                                style={{ offsetPath: `path("${pathPageOut}")` }}
                            />
                            <motion.circle
                                key="p-thrash-in"
                                r={2.8}
                                fill="#fbbf24"
                                filter="url(#glow-thrashing)"
                                initial={{ offsetDistance: "0%", opacity: 0 }}
                                animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                                transition={{ duration: 0.9, repeat: Infinity, delay: 0.45, ease: "easeInOut" }}
                                style={{ offsetPath: `path("${pathPageIn}")` }}
                            />
                        </>
                    )}

                    {/* ============================================================ */}
                    {/* NODE 1: CPU (80, 85)                                         */}
                    {/* ============================================================ */}
                    <g transform={`translate(80, ${yLine})`}>
                        <circle
                            cx="0"
                            cy="0"
                            r={15}
                            fill={mode === 'normal' ? "rgba(52, 211, 153, 0.12)" : "rgba(244, 63, 94, 0.08)"}
                            className="transition-colors duration-200"
                        />
                        <circle
                            cx="0"
                            cy="0"
                            r="2.5"
                            fill={mode === 'normal' ? "#34d399" : "#f43f5e"}
                            className="transition-colors duration-200"
                        />
                        <foreignObject x="-10" y="-32" width="20" height="20" className="pointer-events-none">
                            <div className="flex items-center justify-center">
                                <Cpu
                                    className={`w-5 h-5 transition-colors duration-200 ${
                                        mode === 'normal'
                                            ? 'text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.5)]'
                                            : 'text-rose-400 opacity-60'
                                    }`}
                                    strokeWidth={1.8}
                                />
                            </div>
                        </foreignObject>
                        <text
                            x="0"
                            y="24"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[9px] font-semibold tracking-wider fill-slate-300 pointer-events-none"
                        >
                            CPU
                        </text>
                        {/* Micro status badge */}
                        <text
                            x="0"
                            y="38"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className={`font-mono text-[8px] font-bold pointer-events-none transition-colors duration-200 ${
                                mode === 'normal' ? 'fill-emerald-400' : 'fill-rose-400'
                            }`}
                        >
                            {mode === 'normal' ? "95%" : "1%"}
                        </text>
                    </g>

                    {/* ============================================================ */}
                    {/* NODE 2: RAM (280, 85)                                        */}
                    {/* ============================================================ */}
                    <g transform={`translate(280, ${yLine})`}>
                        <circle
                            cx="0"
                            cy="0"
                            r={15}
                            fill="rgba(56, 189, 248, 0.12)"
                        />
                        <circle
                            cx="0"
                            cy="0"
                            r="2.5"
                            fill="#38bdf8"
                        />
                        <foreignObject x="-10" y="-32" width="20" height="20" className="pointer-events-none">
                            <div className="flex items-center justify-center">
                                <Database
                                    className="w-5 h-5 text-sky-400 drop-shadow-[0_0_6px_rgba(56,189,248,0.5)]"
                                    strokeWidth={1.8}
                                />
                            </div>
                        </foreignObject>
                        <text
                            x="0"
                            y="24"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[9px] font-semibold tracking-wider fill-sky-300 pointer-events-none"
                        >
                            RAM
                        </text>
                        {/* Working set indicator */}
                        <text
                            x="0"
                            y="38"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className={`font-mono text-[8px] font-semibold pointer-events-none transition-colors duration-200 ${
                                mode === 'normal' ? 'fill-emerald-400/80' : 'fill-rose-400/90'
                            }`}
                        >
                            {mode === 'normal' ? "WS ≤ RAM" : "WS > RAM"}
                        </text>
                    </g>

                    {/* ============================================================ */}
                    {/* NODE 3: SWAP / DISC (480, 85)                                */}
                    {/* ============================================================ */}
                    <g transform={`translate(480, ${yLine})`}>
                        <circle
                            cx="0"
                            cy="0"
                            r={15}
                            fill={mode === 'thrashing' ? "rgba(244, 63, 94, 0.14)" : "rgba(100, 116, 139, 0.1)"}
                            className="transition-colors duration-200"
                        />
                        <circle
                            cx="0"
                            cy="0"
                            r="2.5"
                            fill={mode === 'thrashing' ? "#f43f5e" : "#64748b"}
                            className="transition-colors duration-200"
                        />
                        <foreignObject x="-10" y="-32" width="20" height="20" className="pointer-events-none">
                            <div className="flex items-center justify-center">
                                <HardDrive
                                    className={`w-5 h-5 transition-colors duration-200 ${
                                        mode === 'thrashing'
                                            ? 'text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                                            : 'text-slate-500'
                                    }`}
                                    strokeWidth={1.8}
                                />
                            </div>
                        </foreignObject>
                        <text
                            x="0"
                            y="24"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className={`font-mono text-[9px] font-semibold tracking-wider pointer-events-none transition-colors duration-200 ${
                                mode === 'thrashing' ? 'fill-rose-400' : 'fill-slate-400'
                            }`}
                        >
                            SWAP
                        </text>
                        {/* I/O Saturation status badge */}
                        <text
                            x="0"
                            y="38"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className={`font-mono text-[8px] font-bold pointer-events-none transition-colors duration-200 ${
                                mode === 'thrashing' ? 'fill-rose-400' : 'fill-slate-500'
                            }`}
                        >
                            {mode === 'thrashing' ? "I/O 99%" : "I/O 0%"}
                        </text>
                    </g>
                </svg>
            </div>
        </div>
    );
}

