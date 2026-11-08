"use client";

import React, { useState } from 'react';
import { m as motion } from 'framer-motion';
import { Cpu, Layers, HardDrive, ShieldAlert } from 'lucide-react';

export default function MMUViz() {
    const [mode, setMode] = useState<'valid' | 'fault'>('valid');

    const pathCpuToMmu = "M 70 75 L 240 75";
    const pathValid    = "M 240 75 C 320 75, 370 42, 470 42";
    const pathFault    = "M 240 75 C 320 75, 370 108, 470 108";

    return (
        <div className="w-full my-6 select-none flex flex-col items-center justify-center not-prose">
            <div className="w-full max-w-lg relative flex flex-col items-center">
                
                {/* Minimalist Switcher */}
                <div className="flex items-center gap-1 p-0.5 rounded-full bg-slate-900/60 border border-white/5 mb-3">
                    <button
                        type="button"
                        onClick={() => setMode('valid')}
                        className={`px-3 py-1 rounded-full font-mono text-[10px] transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                            mode === 'valid'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold shadow-sm'
                                : 'text-slate-500 hover:text-slate-300 border border-transparent'
                        }`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${mode === 'valid' ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                        Vàlid
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('fault')}
                        className={`px-3 py-1 rounded-full font-mono text-[10px] transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                            mode === 'fault'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-400/40 font-bold shadow-sm'
                                : 'text-slate-500 hover:text-slate-300 border border-transparent'
                        }`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${mode === 'fault' ? 'bg-rose-400' : 'bg-slate-600'}`} />
                        Trap
                    </button>
                </div>

                <svg
                    viewBox="0 0 540 150"
                    className="w-full h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter id="glow-mmu-clean" x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <linearGradient id="grad-cpu-mmu" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#38bdf8" />
                            <stop offset="100%" stopColor="#a78bfa" />
                        </linearGradient>

                        <linearGradient id="grad-mmu-ram" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#a78bfa" />
                            <stop offset="100%" stopColor="#34d399" />
                        </linearGradient>

                        <linearGradient id="grad-mmu-trap" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#a78bfa" />
                            <stop offset="100%" stopColor="#f43f5e" />
                        </linearGradient>
                    </defs>

                    {/* BASE INACTIVE BLUEPRINT */}
                    <path d={pathCpuToMmu} className="stroke-slate-300/25 dark:stroke-white/[0.07]" strokeWidth="1.4" />
                    <path d={pathValid} className="stroke-slate-300/25 dark:stroke-white/[0.07]" strokeWidth="1.4" strokeDasharray={mode === 'fault' ? "3 3" : "none"} />
                    <path d={pathFault} className="stroke-slate-300/25 dark:stroke-white/[0.07]" strokeWidth="1.4" strokeDasharray={mode === 'valid' ? "3 3" : "none"} />

                    {/* ACTIVE: CPU -> MMU */}
                    <path d={pathCpuToMmu} stroke="url(#grad-cpu-mmu)" strokeWidth={1.8} strokeLinecap="round" filter="url(#glow-mmu-clean)" />

                    {/* ACTIVE: MMU -> RAM */}
                    <motion.path
                        d={pathValid}
                        stroke="url(#grad-mmu-ram)"
                        strokeWidth={mode === 'valid' ? 2.2 : 1}
                        strokeLinecap="round"
                        animate={{ opacity: mode === 'valid' ? 1 : 0.15 }}
                        transition={{ duration: 0.2 }}
                        filter={mode === 'valid' ? "url(#glow-mmu-clean)" : undefined}
                    />

                    {/* ACTIVE: MMU -> TRAP */}
                    <motion.path
                        d={pathFault}
                        stroke="url(#grad-mmu-trap)"
                        strokeWidth={mode === 'fault' ? 2.2 : 1}
                        strokeLinecap="round"
                        strokeDasharray={mode === 'fault' ? "none" : "3 3"}
                        animate={{ opacity: mode === 'fault' ? 1 : 0.15 }}
                        transition={{ duration: 0.2 }}
                        filter={mode === 'fault' ? "url(#glow-mmu-clean)" : undefined}
                    />

                    {/* PARTICLES */}
                    <motion.circle
                        r={2.6}
                        fill="#38bdf8"
                        filter="url(#glow-mmu-clean)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${pathCpuToMmu}")` }}
                    />
                    <motion.circle
                        key={mode}
                        r={2.8}
                        fill={mode === 'valid' ? "#34d399" : "#f43f5e"}
                        filter="url(#glow-mmu-clean)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.7, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${mode === 'valid' ? pathValid : pathFault}")` }}
                    />

                    {/* LABEL: @L */}
                    <text x="155" y="64" textAnchor="middle" className="font-mono text-[8.5px] font-semibold fill-sky-300/80 pointer-events-none">
                        @L
                    </text>

                    {/* LABEL: @F */}
                    <text x="355" y="32" textAnchor="middle" className={`font-mono text-[8.5px] font-semibold fill-emerald-300 pointer-events-none transition-opacity duration-200 ${mode === 'valid' ? 'opacity-90' : 'opacity-20'}`}>
                        @F
                    </text>

                    {/* LABEL: TRAP */}
                    <text x="355" y="118" textAnchor="middle" className={`font-mono text-[8.5px] font-semibold fill-rose-300 pointer-events-none transition-opacity duration-200 ${mode === 'fault' ? 'opacity-90' : 'opacity-20'}`}>
                        TRAP
                    </text>

                    {/* NODE 1: CPU */}
                    <g transform="translate(70, 75)">
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

                    {/* NODE 2: MMU */}
                    <g transform="translate(240, 75)">
                        <circle cx="0" cy="0" r="16" fill="rgba(167, 139, 250, 0.14)" />
                        <circle cx="0" cy="0" r="2.5" fill="#a78bfa" />
                        <foreignObject x="-14" y="-32" width="28" height="28" className="overflow-visible pointer-events-none">
                            <div className="w-full h-full flex items-center justify-center">
                                <Layers className="w-4.5 h-4.5 text-purple-400" strokeWidth={1.8} />
                            </div>
                        </foreignObject>
                        <text x="0" y="24" textAnchor="middle" className="font-mono text-[9px] font-bold tracking-widest fill-purple-300 pointer-events-none">
                            MMU
                        </text>
                    </g>

                    {/* NODE 3: RAM */}
                    <g transform="translate(470, 42)" onClick={() => setMode('valid')} className="cursor-pointer">
                        <circle cx="0" cy="0" r="14" fill="rgba(52, 211, 153, 0.12)" />
                        <circle cx="0" cy="0" r="2.5" fill="#34d399" />
                        <foreignObject x="-14" y="-32" width="28" height="28" className="overflow-visible pointer-events-none">
                            <div className={`w-full h-full flex items-center justify-center transition-opacity duration-200 ${mode === 'valid' ? 'opacity-100' : 'opacity-25'}`}>
                                <HardDrive className="w-4.5 h-4.5 text-emerald-400" strokeWidth={1.8} />
                            </div>
                        </foreignObject>
                        <text x="0" y="24" textAnchor="middle" className={`font-mono text-[9px] font-semibold tracking-wider fill-emerald-400 pointer-events-none transition-opacity duration-200 ${mode === 'valid' ? 'opacity-100' : 'opacity-25'}`}>
                            RAM
                        </text>
                    </g>

                    {/* NODE 4: SIGSEGV */}
                    <g transform="translate(470, 108)" onClick={() => setMode('fault')} className="cursor-pointer">
                        <circle cx="0" cy="0" r="14" fill="rgba(244, 63, 94, 0.12)" />
                        <circle cx="0" cy="0" r="2.5" fill="#f43f5e" />
                        <foreignObject x="-14" y="-32" width="28" height="28" className="overflow-visible pointer-events-none">
                            <div className={`w-full h-full flex items-center justify-center transition-opacity duration-200 ${mode === 'fault' ? 'opacity-100' : 'opacity-25'}`}>
                                <ShieldAlert className="w-4.5 h-4.5 text-rose-400" strokeWidth={1.8} />
                            </div>
                        </foreignObject>
                        <text x="0" y="24" textAnchor="middle" className={`font-mono text-[9px] font-semibold tracking-wider fill-rose-400 pointer-events-none transition-opacity duration-200 ${mode === 'fault' ? 'opacity-100' : 'opacity-25'}`}>
                            SIGSEGV
                        </text>
                    </g>
                </svg>

            </div>
        </div>
    );
}
