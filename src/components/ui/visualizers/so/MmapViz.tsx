"use client";

import React, { useState } from 'react';
import { m as motion } from 'framer-motion';
import { Terminal, Layers, HardDrive } from 'lucide-react';

export default function MmapViz() {
    const [flag, setFlag] = useState<'shared' | 'private'>('shared');

    // Layout coordinates
    // P1:   (75, 45)
    // P2:   (75, 115)
    // Shared RAM: (310, 80)
    // Private Upper (COW): (310, 45)
    // Private Lower:       (310, 115)
    // Disc: (485, 80)

    const pathP1Shared     = "M 75 45 C 170 45, 215 80, 310 80";
    const pathP2Shared     = "M 75 115 C 170 115, 215 80, 310 80";
    const pathSharedToDisc = "M 310 80 L 485 80";
    const pathFullP1ToDisc = "M 75 45 C 170 45, 215 80, 310 80 L 485 80";

    const pathP1Private = "M 75 45 L 310 45";
    const pathP2Private = "M 75 115 L 310 115";

    return (
        <div className="w-full my-6 select-none flex flex-col items-center justify-center not-prose">
            <div className="w-full max-w-xl relative flex flex-col items-center">
                
                {/* Minimalist Switcher */}
                <div className="flex items-center gap-1 p-0.5 rounded-full bg-slate-900/60 border border-white/5 mb-4">
                    <button
                        type="button"
                        onClick={() => setFlag('shared')}
                        className={`px-3 py-1 rounded-full font-mono text-[10px] transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                            flag === 'shared'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-sm'
                                : 'text-slate-500 hover:text-slate-300 border border-transparent'
                        }`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${flag === 'shared' ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                        MAP_SHARED
                    </button>
                    <button
                        type="button"
                        onClick={() => setFlag('private')}
                        className={`px-3 py-1 rounded-full font-mono text-[10px] transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                            flag === 'private'
                                ? 'bg-sky-500/20 text-sky-300 border border-sky-400/40 shadow-sm'
                                : 'text-slate-500 hover:text-slate-300 border border-transparent'
                        }`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${flag === 'private' ? 'bg-sky-400' : 'bg-slate-600'}`} />
                        MAP_PRIVATE
                    </button>
                </div>

                <svg
                    viewBox="0 0 560 160"
                    className="w-full h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        {/* Glow Filter */}
                        <filter id="glow-mmap" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* BASE BLUEPRINT TRACKS (Faint background) */}
                    <path
                        d={pathP1Shared}
                        className="stroke-slate-300/30 dark:stroke-white/[0.08]"
                        strokeWidth="1.5"
                    />
                    <path
                        d={pathP2Shared}
                        className="stroke-slate-300/30 dark:stroke-white/[0.08]"
                        strokeWidth="1.5"
                    />
                    <path
                        d={pathSharedToDisc}
                        className="stroke-slate-300/30 dark:stroke-white/[0.08]"
                        strokeWidth="1.5"
                        strokeDasharray={flag === 'private' ? "3 3" : "none"}
                    />
                    <path
                        d={pathP1Private}
                        className="stroke-slate-300/30 dark:stroke-white/[0.08]"
                        strokeWidth="1.5"
                    />
                    <path
                        d={pathP2Private}
                        className="stroke-slate-300/30 dark:stroke-white/[0.08]"
                        strokeWidth="1.5"
                    />

                    {/* ACTIVE TRACKS - SHARED MODE */}
                    <motion.path
                        d={pathP1Shared}
                        stroke="#38bdf8"
                        strokeWidth={flag === 'shared' ? 2 : 1}
                        strokeLinecap="round"
                        animate={{ opacity: flag === 'shared' ? 0.95 : 0.1 }}
                        transition={{ duration: 0.25 }}
                        filter={flag === 'shared' ? "url(#glow-mmap)" : undefined}
                    />
                    <motion.path
                        d={pathP2Shared}
                        stroke="#818cf8"
                        strokeWidth={flag === 'shared' ? 2 : 1}
                        strokeLinecap="round"
                        animate={{ opacity: flag === 'shared' ? 0.95 : 0.1 }}
                        transition={{ duration: 0.25 }}
                        filter={flag === 'shared' ? "url(#glow-mmap)" : undefined}
                    />
                    <motion.path
                        d={pathSharedToDisc}
                        stroke="#34d399"
                        strokeWidth={flag === 'shared' ? 2 : 1}
                        strokeLinecap="round"
                        animate={{ opacity: flag === 'shared' ? 0.95 : 0.1 }}
                        transition={{ duration: 0.25 }}
                        filter={flag === 'shared' ? "url(#glow-mmap)" : undefined}
                    />

                    {/* ACTIVE TRACKS - PRIVATE MODE */}
                    <motion.path
                        d={pathP1Private}
                        stroke="#38bdf8"
                        strokeWidth={flag === 'private' ? 2 : 1}
                        strokeLinecap="round"
                        animate={{ opacity: flag === 'private' ? 0.95 : 0.1 }}
                        transition={{ duration: 0.25 }}
                        filter={flag === 'private' ? "url(#glow-mmap)" : undefined}
                    />
                    <motion.path
                        d={pathP2Private}
                        stroke="#818cf8"
                        strokeWidth={flag === 'private' ? 2 : 1}
                        strokeLinecap="round"
                        animate={{ opacity: flag === 'private' ? 0.95 : 0.1 }}
                        transition={{ duration: 0.25 }}
                        filter={flag === 'private' ? "url(#glow-mmap)" : undefined}
                    />

                    {/* KINETIC PARTICLES */}
                    {flag === 'shared' ? (
                        <>
                            <motion.circle
                                key="shared-p1-particle"
                                r={3}
                                fill="#38bdf8"
                                filter="url(#glow-mmap)"
                                initial={{ offsetDistance: "0%", opacity: 0 }}
                                animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                                style={{ offsetPath: `path("${pathFullP1ToDisc}")` }}
                            />
                            <motion.circle
                                key="shared-p2-particle"
                                r={3}
                                fill="#818cf8"
                                filter="url(#glow-mmap)"
                                initial={{ offsetDistance: "0%", opacity: 0 }}
                                animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                                transition={{ duration: 1.8, repeat: Infinity, delay: 0.6, ease: "easeInOut" }}
                                style={{ offsetPath: `path("${pathP2Shared}")` }}
                            />
                        </>
                    ) : (
                        <>
                            <motion.circle
                                key="private-p1-particle"
                                r={3}
                                fill="#38bdf8"
                                filter="url(#glow-mmap)"
                                initial={{ offsetDistance: "0%", opacity: 0 }}
                                animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                                style={{ offsetPath: `path("${pathP1Private}")` }}
                            />
                            <motion.circle
                                key="private-p2-particle"
                                r={3}
                                fill="#818cf8"
                                filter="url(#glow-mmap)"
                                initial={{ offsetDistance: "0%", opacity: 0 }}
                                animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                                transition={{ duration: 1.8, repeat: Infinity, delay: 0.5, ease: "easeInOut" }}
                                style={{ offsetPath: `path("${pathP2Private}")` }}
                            />
                        </>
                    )}

                    {/* NODE 1: P1 (75, 45) */}
                    <g transform="translate(75, 45)">
                        <circle cx="0" cy="0" r={14} fill="rgba(56, 189, 248, 0.12)" />
                        <circle cx="0" cy="0" r="2.5" fill="#38bdf8" />
                        <foreignObject x="-10" y="-30" width="20" height="20" className="pointer-events-none">
                            <div className="flex items-center justify-center">
                                <Terminal className="w-5 h-5 text-sky-400 drop-shadow-[0_0_6px_rgba(56,189,248,0.5)]" strokeWidth={1.8} />
                            </div>
                        </foreignObject>
                        <text x="0" y="24" textAnchor="middle" className="font-mono text-[9px] font-semibold tracking-wider fill-sky-400 pointer-events-none">
                            P1
                        </text>
                    </g>

                    {/* NODE 2: P2 (75, 115) */}
                    <g transform="translate(75, 115)">
                        <circle cx="0" cy="0" r={14} fill="rgba(129, 140, 248, 0.12)" />
                        <circle cx="0" cy="0" r="2.5" fill="#818cf8" />
                        <foreignObject x="-10" y="-30" width="20" height="20" className="pointer-events-none">
                            <div className="flex items-center justify-center">
                                <Terminal className="w-5 h-5 text-indigo-400 drop-shadow-[0_0_6px_rgba(129,140,248,0.5)]" strokeWidth={1.8} />
                            </div>
                        </foreignObject>
                        <text x="0" y="24" textAnchor="middle" className="font-mono text-[9px] font-semibold tracking-wider fill-indigo-400 pointer-events-none">
                            P2
                        </text>
                    </g>

                    {/* SHARED RAM NODE (310, 80) */}
                    <g
                        transform="translate(310, 80)"
                        className={`transition-opacity duration-200 ${flag === 'shared' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    >
                        <circle cx="0" cy="0" r={14} fill="rgba(52, 211, 153, 0.14)" />
                        <circle cx="0" cy="0" r="2.5" fill="#34d399" />
                        <foreignObject x="-10" y="-30" width="20" height="20" className="pointer-events-none">
                            <div className="flex items-center justify-center">
                                <Layers className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" strokeWidth={1.8} />
                            </div>
                        </foreignObject>
                        <text x="0" y="24" textAnchor="middle" className="font-mono text-[9px] font-semibold tracking-wider fill-emerald-400 pointer-events-none">
                            RAM
                        </text>
                    </g>

                    {/* PRIVATE UPPER NODE: COW (310, 45) */}
                    <g
                        transform="translate(310, 45)"
                        className={`transition-opacity duration-200 ${flag === 'private' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    >
                        <circle cx="0" cy="0" r={14} fill="rgba(56, 189, 248, 0.12)" />
                        <circle cx="0" cy="0" r="2.5" fill="#38bdf8" />
                        <foreignObject x="-10" y="-30" width="20" height="20" className="pointer-events-none">
                            <div className="flex items-center justify-center">
                                <Layers className="w-4.5 h-4.5 text-sky-400 drop-shadow-[0_0_6px_rgba(56,189,248,0.5)]" strokeWidth={1.8} />
                            </div>
                        </foreignObject>
                        <text x="0" y="24" textAnchor="middle" className="font-mono text-[9px] font-semibold tracking-wider fill-sky-300 pointer-events-none">
                            COW
                        </text>
                    </g>

                    {/* PRIVATE LOWER NODE: RAM (310, 115) */}
                    <g
                        transform="translate(310, 115)"
                        className={`transition-opacity duration-200 ${flag === 'private' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    >
                        <circle cx="0" cy="0" r={14} fill="rgba(129, 140, 248, 0.12)" />
                        <circle cx="0" cy="0" r="2.5" fill="#818cf8" />
                        <foreignObject x="-10" y="-30" width="20" height="20" className="pointer-events-none">
                            <div className="flex items-center justify-center">
                                <Layers className="w-4.5 h-4.5 text-indigo-400 drop-shadow-[0_0_6px_rgba(129,140,248,0.5)]" strokeWidth={1.8} />
                            </div>
                        </foreignObject>
                        <text x="0" y="24" textAnchor="middle" className="font-mono text-[9px] font-semibold tracking-wider fill-indigo-300 pointer-events-none">
                            RAM
                        </text>
                    </g>

                    {/* NODE: DISC (485, 80) */}
                    <g
                        transform="translate(485, 80)"
                        className={`transition-opacity duration-200 ${flag === 'shared' ? 'opacity-100' : 'opacity-25'}`}
                    >
                        <circle cx="0" cy="0" r={14} fill={flag === 'shared' ? "rgba(52, 211, 153, 0.12)" : "rgba(148, 163, 184, 0.08)"} />
                        <circle cx="0" cy="0" r="2.5" fill={flag === 'shared' ? "#34d399" : "#64748b"} />
                        <foreignObject x="-10" y="-30" width="20" height="20" className="pointer-events-none">
                            <div className="flex items-center justify-center">
                                <HardDrive
                                    className={`w-5 h-5 ${flag === 'shared' ? 'text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.5)]' : 'text-slate-500'}`}
                                    strokeWidth={1.8}
                                />
                            </div>
                        </foreignObject>
                        <text
                            x="0"
                            y="24"
                            textAnchor="middle"
                            className={`font-mono text-[9px] font-semibold tracking-wider pointer-events-none ${
                                flag === 'shared' ? 'fill-emerald-400' : 'fill-slate-500'
                            }`}
                        >
                            DISC
                        </text>
                    </g>
                </svg>

            </div>
        </div>
    );
}
