"use client";

import React, { useState } from 'react';
import { m as motion } from 'framer-motion';
import { Terminal, Copy } from 'lucide-react';

export default function COWViz() {
    const [mode, setMode] = useState<'shared' | 'write'>('shared');

    // Layout coordinates
    // PARENT: (100, 55)
    // CHILD:  (100, 115)
    // F42:    (390, 55) -> width: 100, height: 30
    // F99:    (390, 115) -> width: 100, height: 30

    const pathParent = "M 100 55 L 390 55";
    const pathChildShared = "M 100 115 C 240 115, 250 55, 390 55";
    const pathChildWrite  = "M 100 115 L 390 115";

    return (
        <div className="w-full my-6 select-none flex flex-col items-center justify-center not-prose">
            <div className="w-full max-w-lg relative flex flex-col items-center">
                {/* Minimalist 2-state Switch */}
                <div className="flex items-center gap-1 p-0.5 rounded-full bg-slate-900/60 border border-white/5 mb-3">
                    <button
                        type="button"
                        onClick={() => setMode('shared')}
                        className={`px-3 py-1 rounded-full font-mono text-[10px] transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                            mode === 'shared'
                                ? 'bg-sky-500/20 text-sky-300 border border-sky-400/40 shadow-sm'
                                : 'text-slate-500 hover:text-slate-300 border border-transparent'
                        }`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${mode === 'shared' ? 'bg-sky-400' : 'bg-slate-600'}`} />
                        Abans (Compartit)
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('write')}
                        className={`px-3 py-1 rounded-full font-mono text-[10px] transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                            mode === 'write'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-sm'
                                : 'text-slate-500 hover:text-slate-300 border border-transparent'
                        }`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${mode === 'write' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                        En escriure (*p = 'B')
                    </button>
                </div>

                <svg
                    viewBox="0 0 560 170"
                    className="w-full h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        {/* Glow Filter */}
                        <filter id="glow-cow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Column Headers */}
                    <text
                        x="100"
                        y="20"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="font-mono text-[9px] font-semibold tracking-widest fill-sky-400/80"
                    >
                        PROCESSOS (P5)
                    </text>
                    <text
                        x="440"
                        y="20"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="font-mono text-[9px] font-semibold tracking-widest fill-emerald-400/80"
                    >
                        MARCS FÍSICS
                    </text>

                    {/* Blueprint tracks (Faint background) */}
                    <path d={pathParent} className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.5" />
                    <path
                        d={mode === 'shared' ? pathChildShared : pathChildWrite}
                        className="stroke-slate-300/30 dark:stroke-white/[0.08]"
                        strokeWidth="1.5"
                    />

                    {/* Active highlight paths */}
                    {/* Parent Track */}
                    <path
                        d={pathParent}
                        stroke="#38bdf8"
                        strokeWidth={1.8}
                        strokeLinecap="round"
                        filter="url(#glow-cow)"
                    />

                    {/* Child Track (Dynamic) */}
                    <motion.path
                        key={mode}
                        d={mode === 'shared' ? pathChildShared : pathChildWrite}
                        stroke={mode === 'shared' ? "#38bdf8" : "#34d399"}
                        strokeWidth={1.8}
                        strokeLinecap="round"
                        filter="url(#glow-cow)"
                        initial={{ pathLength: 0.3, opacity: 0.4 }}
                        animate={{ pathLength: 1, opacity: 0.95 }}
                        transition={{ duration: 0.3 }}
                    />

                    {/* Flowing kinetic particles */}
                    <motion.circle
                        key="p-parent"
                        r={2.8}
                        fill="#38bdf8"
                        filter="url(#glow-cow)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${pathParent}")` }}
                    />
                    <motion.circle
                        key={`p-child-${mode}`}
                        r={2.8}
                        fill={mode === 'shared' ? "#38bdf8" : "#34d399"}
                        filter="url(#glow-cow)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 2.2, repeat: Infinity, delay: 0.7, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${mode === 'shared' ? pathChildShared : pathChildWrite}")` }}
                    />

                    {/* ============================================================ */}
                    {/* LEFT NODES: PARE & FILL                                      */}
                    {/* ============================================================ */}
                    {/* PARENT NODE (100, 55) */}
                    <g transform="translate(100, 55)">
                        <circle cx="0" cy="0" r="14" fill="rgba(56, 189, 248, 0.12)" />
                        <circle cx="0" cy="0" r="2.5" fill="#38bdf8" />
                        <foreignObject x="-10" y="-30" width="20" height="20" className="pointer-events-none">
                            <div className="flex items-center justify-center">
                                <Terminal className="w-4.5 h-4.5 text-sky-400 drop-shadow-[0_0_6px_rgba(56,189,248,0.5)]" strokeWidth={1.8} />
                            </div>
                        </foreignObject>
                        <text
                            x="0"
                            y="24"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[9px] font-semibold tracking-wider fill-sky-300 pointer-events-none"
                        >
                            PARE
                        </text>
                    </g>

                    {/* CHILD NODE (100, 115) */}
                    <g transform="translate(100, 115)">
                        <circle
                            cx="0"
                            cy="0"
                            r="14"
                            fill={mode === 'shared' ? "rgba(56, 189, 248, 0.12)" : "rgba(52, 211, 153, 0.14)"}
                            className="transition-colors duration-200"
                        />
                        <circle
                            cx="0"
                            cy="0"
                            r="2.5"
                            fill={mode === 'shared' ? "#38bdf8" : "#34d399"}
                            className="transition-colors duration-200"
                        />
                        <foreignObject x="-10" y="-30" width="20" height="20" className="pointer-events-none">
                            <div className="flex items-center justify-center">
                                <Terminal
                                    className={`w-4.5 h-4.5 transition-colors duration-200 ${
                                        mode === 'shared' ? 'text-sky-400' : 'text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.5)]'
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
                                mode === 'shared' ? 'fill-sky-300' : 'fill-emerald-300'
                            }`}
                        >
                            FILL
                        </text>
                    </g>

                    {/* ============================================================ */}
                    {/* RIGHT NODES: MARC 42 & MARC 99                               */}
                    {/* ============================================================ */}
                    {/* FRAME 42 (390, 40) */}
                    <g transform="translate(390, 40)">
                        <rect
                            x="0"
                            y="0"
                            width="100"
                            height="30"
                            rx="7"
                            fill="#0b0f19"
                            stroke="#38bdf8"
                            strokeWidth={1.5}
                            filter="url(#glow-cow)"
                        />
                        <circle cx="0" cy="15" r="2.5" fill="#38bdf8" />
                        <text
                            x="50"
                            y="15"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[9px] font-bold fill-sky-300 pointer-events-none"
                        >
                            F42 · {mode === 'shared' ? 'r--' : 'rw-'}
                        </text>
                    </g>

                    {/* VERTICAL COPY LINK (Appears in Write Mode) */}
                    {mode === 'write' && (
                        <g transform="translate(440, 85)">
                            <motion.line
                                x1="0"
                                y1="-12"
                                x2="0"
                                y2="12"
                                stroke="#a78bfa"
                                strokeWidth={1.5}
                                strokeDasharray="2 2"
                                initial={{ opacity: 0, scaleY: 0 }}
                                animate={{ opacity: 0.9, scaleY: 1 }}
                                transition={{ duration: 0.25 }}
                            />
                            {/* Copy badge */}
                            <foreignObject x="-36" y="-10" width="72" height="20" className="pointer-events-none">
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#0b0f19] border border-purple-400/50 text-[7px] font-mono text-purple-300 font-semibold shadow-sm">
                                        <Copy className="w-2.5 h-2.5" />
                                        4 KB
                                    </span>
                                </div>
                            </foreignObject>
                        </g>
                    )}

                    {/* FRAME 99 (390, 100) */}
                    <g transform="translate(390, 100)">
                        <rect
                            x="0"
                            y="0"
                            width="100"
                            height="30"
                            rx="7"
                            fill="#0b0f19"
                            stroke={mode === 'write' ? "#34d399" : "#475569"}
                            strokeWidth={mode === 'write' ? 1.5 : 0.8}
                            strokeDasharray={mode === 'write' ? "none" : "3 3"}
                            className="transition-all duration-200"
                            filter={mode === 'write' ? "url(#glow-cow)" : undefined}
                        />
                        <circle
                            cx="0"
                            cy="15"
                            r="2.5"
                            fill={mode === 'write' ? "#34d399" : "#475569"}
                            className="transition-colors duration-200"
                        />
                        <text
                            x="50"
                            y="15"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className={`font-mono text-[9px] pointer-events-none transition-colors duration-200 ${
                                mode === 'write' ? 'fill-emerald-300 font-bold' : 'fill-slate-600'
                            }`}
                        >
                            {mode === 'write' ? "F99 · rw-" : "F99 (lliure)"}
                        </text>
                    </g>
                </svg>
            </div>
        </div>
    );
}

