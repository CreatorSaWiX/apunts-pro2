"use client";

import React, { useState } from 'react';
import { m as motion } from 'framer-motion';
import { Cpu, Zap, Database, HardDrive } from 'lucide-react';

export default function TLBViz() {
    const [mode, setMode] = useState<'hit' | 'miss'>('hit');

    const yLine = 48;
    const yDetour = 116;

    const pathCpuToTlb   = `M 70 ${yLine} L 210 ${yLine}`;
    const pathDirectHit  = `M 210 ${yLine} L 470 ${yLine}`;
    const pathDetourMiss = `M 210 ${yLine} C 270 ${yLine}, 285 ${yDetour}, 350 ${yDetour} C 415 ${yDetour}, 425 ${yLine}, 470 ${yLine}`;

    const pathFullHit  = `M 70 ${yLine} L 470 ${yLine}`;
    const pathFullMiss = `M 70 ${yLine} L 210 ${yLine} C 270 ${yLine}, 285 ${yDetour}, 350 ${yDetour} C 415 ${yDetour}, 425 ${yLine}, 470 ${yLine}`;

    return (
        <div className="w-full my-6 select-none flex flex-col items-center justify-center not-prose">
            <div className="w-full max-w-lg relative flex flex-col items-center">
                
                {/* Minimalist Switcher */}
                <div className="flex items-center gap-1 p-0.5 rounded-full bg-slate-900/60 border border-white/5 mb-4">
                    <button
                        type="button"
                        onClick={() => setMode('hit')}
                        className={`px-3 py-1 rounded-full font-mono text-[10px] transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                            mode === 'hit'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold shadow-sm'
                                : 'text-slate-500 hover:text-slate-300 border border-transparent'
                        }`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${mode === 'hit' ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                        Hit
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('miss')}
                        className={`px-3 py-1 rounded-full font-mono text-[10px] transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                            mode === 'miss'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-400/40 font-bold shadow-sm'
                                : 'text-slate-500 hover:text-slate-300 border border-transparent'
                        }`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${mode === 'miss' ? 'bg-rose-400' : 'bg-slate-600'}`} />
                        Miss
                    </button>
                </div>

                <svg
                    viewBox="0 0 540 170"
                    className="w-full h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter id="glow-tlb-min" x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <linearGradient id="grad-miss-curve" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#f43f5e" />
                            <stop offset="40%" stopColor="#fbbf24" />
                            <stop offset="70%" stopColor="#818cf8" />
                            <stop offset="100%" stopColor="#34d399" />
                        </linearGradient>
                    </defs>

                    {/* BASE INACTIVE BLUEPRINT */}
                    <path
                        d={pathCpuToTlb}
                        className="stroke-slate-300/25 dark:stroke-white/[0.07]"
                        strokeWidth="1.4"
                    />
                    <path
                        d={pathDirectHit}
                        className="stroke-slate-300/25 dark:stroke-white/[0.07]"
                        strokeWidth="1.4"
                        strokeDasharray={mode === 'miss' ? "3 3" : "none"}
                    />
                    <path
                        d={pathDetourMiss}
                        className="stroke-slate-300/25 dark:stroke-white/[0.07]"
                        strokeWidth="1.4"
                        strokeDasharray={mode === 'hit' ? "3 3" : "none"}
                    />

                    {/* ACTIVE: CPU -> TLB */}
                    <path
                        d={pathCpuToTlb}
                        stroke="#38bdf8"
                        strokeWidth={1.8}
                        strokeLinecap="round"
                        filter="url(#glow-tlb-min)"
                    />

                    {/* ACTIVE: TLB HIT (Direct) */}
                    <motion.path
                        d={pathDirectHit}
                        stroke="#34d399"
                        strokeWidth={mode === 'hit' ? 2 : 1}
                        strokeLinecap="round"
                        strokeDasharray={mode === 'hit' ? "none" : "3 3"}
                        animate={{ opacity: mode === 'hit' ? 0.95 : 0.15 }}
                        transition={{ duration: 0.2 }}
                        filter={mode === 'hit' ? "url(#glow-tlb-min)" : undefined}
                    />

                    {/* ACTIVE: TLB MISS (Detour) */}
                    <motion.path
                        d={pathDetourMiss}
                        stroke="url(#grad-miss-curve)"
                        strokeWidth={mode === 'miss' ? 2 : 1}
                        strokeLinecap="round"
                        strokeDasharray={mode === 'miss' ? "none" : "3 3"}
                        animate={{ opacity: mode === 'miss' ? 0.95 : 0.15 }}
                        transition={{ duration: 0.2 }}
                        filter={mode === 'miss' ? "url(#glow-tlb-min)" : undefined}
                    />

                    {/* KINETIC FLOW PARTICLES */}
                    {mode === 'hit' ? (
                        <motion.circle
                            key="hit-p"
                            r={2.8}
                            fill="#34d399"
                            filter="url(#glow-tlb-min)"
                            initial={{ offsetDistance: "0%", opacity: 0 }}
                            animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                            style={{ offsetPath: `path("${pathFullHit}")` }}
                        />
                    ) : (
                        <motion.circle
                            key="miss-p"
                            r={2.8}
                            fill="#fbbf24"
                            filter="url(#glow-tlb-min)"
                            initial={{ offsetDistance: "0%", opacity: 0 }}
                            animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                            style={{ offsetPath: `path("${pathFullMiss}")` }}
                        />
                    )}

                    {/* NODE 1: CPU (70, yLine) */}
                    <g transform={`translate(70, ${yLine})`}>
                        <circle cx="0" cy="0" r="14" fill="rgba(56, 189, 248, 0.12)" />
                        <circle cx="0" cy="0" r="2.5" fill="#38bdf8" />
                        <foreignObject x="-14" y="-32" width="28" height="28" className="overflow-visible pointer-events-none">
                            <div className="w-full h-full flex items-center justify-center">
                                <Cpu className="w-4.5 h-4.5 text-sky-400" strokeWidth={1.8} />
                            </div>
                        </foreignObject>
                        <text x="0" y="24" textAnchor="middle" className="font-mono text-[9px] font-semibold tracking-wider fill-sky-400 pointer-events-none">
                            CPU
                        </text>
                    </g>

                    {/* NODE 2: TLB (210, yLine) */}
                    <g transform={`translate(210, ${yLine})`}>
                        <circle
                            cx="0"
                            cy="0"
                            r="14"
                            fill={mode === 'hit' ? "rgba(52, 211, 153, 0.14)" : "rgba(244, 63, 94, 0.12)"}
                            className="transition-colors duration-200"
                        />
                        <circle
                            cx="0"
                            cy="0"
                            r="2.5"
                            fill={mode === 'hit' ? "#34d399" : "#f43f5e"}
                            className="transition-colors duration-200"
                        />
                        <foreignObject x="-14" y="-32" width="28" height="28" className="overflow-visible pointer-events-none">
                            <div className="w-full h-full flex items-center justify-center">
                                <Zap
                                    className={`w-4.5 h-4.5 transition-colors duration-200 ${
                                        mode === 'hit' ? 'text-emerald-400' : 'text-rose-400'
                                    }`}
                                    strokeWidth={1.8}
                                />
                            </div>
                        </foreignObject>
                        <text
                            x="0"
                            y="24"
                            textAnchor="middle"
                            className={`font-mono text-[9px] font-semibold tracking-wider pointer-events-none transition-colors duration-200 ${
                                mode === 'hit' ? 'fill-emerald-400' : 'fill-rose-400'
                            }`}
                        >
                            TLB
                        </text>
                    </g>

                    {/* NODE 3: TP (350, yDetour) */}
                    <g transform={`translate(350, ${yDetour})`}>
                        <circle
                            cx="0"
                            cy="0"
                            r="14"
                            fill="rgba(129, 140, 248, 0.12)"
                            className={`transition-opacity duration-200 ${mode === 'miss' ? 'opacity-100' : 'opacity-20'}`}
                        />
                        <circle
                            cx="0"
                            cy="0"
                            r="2.5"
                            fill="#818cf8"
                            className={`transition-opacity duration-200 ${mode === 'miss' ? 'opacity-100' : 'opacity-20'}`}
                        />
                        <foreignObject x="-14" y="-32" width="28" height="28" className="overflow-visible pointer-events-none">
                            <div className={`w-full h-full flex items-center justify-center transition-opacity duration-200 ${mode === 'miss' ? 'opacity-100' : 'opacity-20'}`}>
                                <Database className="w-4.5 h-4.5 text-indigo-400" strokeWidth={1.8} />
                            </div>
                        </foreignObject>
                        <text
                            x="0"
                            y="24"
                            textAnchor="middle"
                            className={`font-mono text-[9px] font-semibold tracking-wider fill-indigo-300 pointer-events-none transition-opacity duration-200 ${
                                mode === 'miss' ? 'opacity-100' : 'opacity-20'
                            }`}
                        >
                            TP
                        </text>
                    </g>

                    {/* NODE 4: RAM (470, yLine) */}
                    <g transform={`translate(470, ${yLine})`}>
                        <circle cx="0" cy="0" r="14" fill="rgba(52, 211, 153, 0.12)" />
                        <circle cx="0" cy="0" r="2.5" fill="#34d399" />
                        <foreignObject x="-14" y="-32" width="28" height="28" className="overflow-visible pointer-events-none">
                            <div className="w-full h-full flex items-center justify-center">
                                <HardDrive className="w-4.5 h-4.5 text-emerald-400" strokeWidth={1.8} />
                            </div>
                        </foreignObject>
                        <text x="0" y="24" textAnchor="middle" className="font-mono text-[9px] font-semibold tracking-wider fill-emerald-400 pointer-events-none">
                            RAM
                        </text>
                    </g>
                </svg>

            </div>
        </div>
    );
}
