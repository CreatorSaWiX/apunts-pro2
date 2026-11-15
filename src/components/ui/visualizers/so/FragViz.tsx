"use client";

import React, { useState } from 'react';
import { m as motion } from 'framer-motion';

export default function FragViz() {
    const [mode, setMode] = useState<'interna' | 'externa'>('interna');

    const PATH_P0 = "M 125 49 C 235 49, 245 53, 360 53";
    const PATH_P1 = "M 125 89 C 235 89, 245 109, 360 109";

    return (
        <div className="w-full my-6 select-none flex flex-col items-center justify-center not-prose">
            <div className="w-full max-w-lg relative flex flex-col items-center">

                {/* Minimalist Switcher */}
                <div className="flex items-center gap-1 p-0.5 rounded-full bg-slate-900/60 border border-white/5 mb-3">
                    <button
                        type="button"
                        onClick={() => setMode('interna')}
                        className={`px-3 py-1 rounded-full font-mono text-[10px] transition-all duration-200 cursor-pointer ${
                            mode === 'interna'
                                ? 'bg-white/10 text-white font-bold border border-white/15 shadow-sm'
                                : 'text-slate-500 hover:text-slate-300 border border-transparent'
                        }`}
                    >
                        Interna · SÍ
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('externa')}
                        className={`px-3 py-1 rounded-full font-mono text-[10px] transition-all duration-200 cursor-pointer ${
                            mode === 'externa'
                                ? 'bg-white/10 text-white font-bold border border-white/15 shadow-sm'
                                : 'text-slate-500 hover:text-slate-300 border border-transparent'
                        }`}
                    >
                        Externa · NO
                    </button>
                </div>

                <svg
                    viewBox="0 0 540 135"
                    className="w-full h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter id="glow-frag" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <pattern id="hatch-frag-viz" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                            <line x1="0" y1="0" x2="0" y2="6" stroke="#fbbf24" strokeWidth="1.2" opacity="0.38" />
                        </pattern>
                    </defs>

                    {mode === 'interna' ? (
                        <g>
                            {/* Top Frame Size Ruler */}
                            <path
                                d="M 70 28 L 470 28"
                                className="stroke-slate-300/30 dark:stroke-white/[0.12]"
                                strokeWidth="1"
                            />
                            <path d="M 70 24 L 70 32 M 470 24 L 470 32" className="stroke-slate-300/30 dark:stroke-white/[0.12]" strokeWidth="1" />
                            <text
                                x="270"
                                y="16"
                                textAnchor="middle"
                                dominantBaseline="central"
                                className="font-mono text-[9px] font-semibold fill-slate-400 tracking-wider"
                            >
                                1 Marc = 4096 B
                            </text>

                            {/* Frame Outer Container */}
                            <rect
                                x="70"
                                y="44"
                                width="400"
                                height="44"
                                rx="9"
                                fill="#0b0f19"
                                stroke="#34d399"
                                strokeWidth="1.2"
                                strokeOpacity="0.45"
                            />

                            {/* Used Segment (2400 B -> 234px) */}
                            <motion.rect
                                x="70"
                                y="44"
                                height="44"
                                rx="9"
                                fill="rgba(56, 189, 248, 0.14)"
                                stroke="#38bdf8"
                                strokeWidth="1.5"
                                filter="url(#glow-frag)"
                                initial={{ width: 0 }}
                                animate={{ width: 234 }}
                                transition={{ duration: 0.35, ease: "easeOut" }}
                            />
                            <text
                                x="187"
                                y="66"
                                textAnchor="middle"
                                dominantBaseline="central"
                                className="font-mono text-[10px] font-bold fill-sky-300 tracking-wider pointer-events-none"
                            >
                                2400 B
                            </text>

                            {/* Wasted Tail (1696 B -> 166px) */}
                            <rect
                                x="304"
                                y="44"
                                width="166"
                                height="44"
                                rx="9"
                                fill="url(#hatch-frag-viz)"
                                stroke="#fbbf24"
                                strokeWidth="1.2"
                                strokeDasharray="3 3"
                                strokeOpacity="0.65"
                            />
                            <text
                                x="387"
                                y="66"
                                textAnchor="middle"
                                dominantBaseline="central"
                                className="font-mono text-[10px] font-bold fill-amber-300 tracking-wider pointer-events-none"
                            >
                                1696 B
                            </text>

                            {/* Divider tick */}
                            <line x1="304" y1="40" x2="304" y2="92" stroke="#fbbf24" strokeWidth="1" strokeOpacity="0.5" />

                            <text
                                x="187"
                                y="106"
                                textAnchor="middle"
                                dominantBaseline="central"
                                className="font-mono text-[8px] fill-sky-400/80 tracking-widest uppercase"
                            >
                                Ús
                            </text>
                            <text
                                x="387"
                                y="106"
                                textAnchor="middle"
                                dominantBaseline="central"
                                className="font-mono text-[8px] fill-amber-400/80 tracking-widest uppercase"
                            >
                                Fragmentació
                            </text>
                        </g>
                    ) : (
                        <g>
                            {/* Left: 8 KB Logical Process split into two 4 KB pages */}
                            <text
                                x="80"
                                y="18"
                                textAnchor="middle"
                                dominantBaseline="central"
                                className="font-mono text-[8.5px] font-semibold fill-slate-500 tracking-widest uppercase"
                            >
                                Procés 8 KB
                            </text>
                            <text
                                x="430"
                                y="10"
                                textAnchor="middle"
                                dominantBaseline="central"
                                className="font-mono text-[8.5px] font-semibold fill-slate-500 tracking-widest uppercase"
                            >
                                RAM
                            </text>

                            {/* Curves */}
                            <path d={PATH_P0} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" />
                            <path d={PATH_P1} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" />

                            <path d={PATH_P0} stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" filter="url(#glow-frag)" />
                            <path d={PATH_P1} stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" filter="url(#glow-frag)" />

                            <motion.circle
                                r={2.5}
                                fill="#38bdf8"
                                filter="url(#glow-frag)"
                                initial={{ offsetDistance: "0%", opacity: 0 }}
                                animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                                style={{ offsetPath: `path("${PATH_P0}")` }}
                            />
                            <motion.circle
                                r={2.5}
                                fill="#34d399"
                                filter="url(#glow-frag)"
                                initial={{ offsetDistance: "0%", opacity: 0 }}
                                animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                                transition={{ duration: 2.2, repeat: Infinity, delay: 0.9, ease: "easeInOut" }}
                                style={{ offsetPath: `path("${PATH_P1}")` }}
                            />

                            {/* P0 */}
                            <rect x="35" y="35" width="90" height="28" rx="7" fill="#0b0f19" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.6" />
                            <text x="80" y="49" textAnchor="middle" dominantBaseline="central" className="font-mono text-[9px] font-bold fill-sky-300">
                                P0 · 4 KB
                            </text>
                            <circle cx="125" cy="49" r="2.5" fill="#38bdf8" />

                            {/* P1 */}
                            <rect x="35" y="75" width="90" height="28" rx="7" fill="#0b0f19" stroke="#34d399" strokeWidth="1.2" strokeOpacity="0.6" />
                            <text x="80" y="89" textAnchor="middle" dominantBaseline="central" className="font-mono text-[9px] font-bold fill-emerald-300">
                                P1 · 4 KB
                            </text>
                            <circle cx="125" cy="89" r="2.5" fill="#34d399" />

                            {/* RAM Slots: Occupied / Free(4KB) / Occupied / Free(4KB) */}
                            {/* Slot 0: Occupied */}
                            <rect x="360" y="18" width="140" height="20" rx="5" fill="#0b0f19" stroke="#64748b" strokeWidth="1" strokeOpacity="0.2" />
                            <text x="430" y="28" textAnchor="middle" dominantBaseline="central" className="font-mono text-[8px] fill-slate-500">
                                Ocupat
                            </text>

                            {/* Slot 1: P0 Target */}
                            <rect x="360" y="42" width="140" height="22" rx="6" fill="#0b0f19" stroke="#38bdf8" strokeWidth="1.3" strokeOpacity="0.7" />
                            <text x="430" y="53" textAnchor="middle" dominantBaseline="central" className="font-mono text-[8.5px] font-bold fill-sky-300">
                                Marc 1 · 4 KB
                            </text>
                            <circle cx="360" cy="53" r="2.5" fill="#38bdf8" />

                            {/* Slot 2: Occupied */}
                            <rect x="360" y="70" width="140" height="20" rx="5" fill="#0b0f19" stroke="#64748b" strokeWidth="1" strokeOpacity="0.2" />
                            <text x="430" y="80" textAnchor="middle" dominantBaseline="central" className="font-mono text-[8px] fill-slate-500">
                                Ocupat
                            </text>

                            {/* Slot 3: P1 Target */}
                            <rect x="360" y="98" width="140" height="22" rx="6" fill="#0b0f19" stroke="#34d399" strokeWidth="1.3" strokeOpacity="0.7" />
                            <text x="430" y="109" textAnchor="middle" dominantBaseline="central" className="font-mono text-[8.5px] font-bold fill-emerald-300">
                                Marc 3 · 4 KB
                            </text>
                            <circle cx="360" cy="109" r="2.5" fill="#34d399" />
                        </g>
                    )}
                </svg>
            </div>
        </div>
    );
}
