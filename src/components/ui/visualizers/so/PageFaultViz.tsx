"use client";

import React, { useState } from 'react';
import { m as motion } from 'framer-motion';
import { Cpu, AlertCircle, Disc, HardDrive } from 'lucide-react';

export default function PageFaultViz() {
    const [hovered, setHovered] = useState<'cpu' | 'fault' | 'disc' | 'ram' | null>(null);

    const yLine = 60;
    const yDetour = 120;

    // Trajectory paths
    const pathCpuToFault = `M 70 ${yLine} L 200 ${yLine}`;
    const pathFaultToDisc = `M 200 ${yLine} C 255 ${yLine}, 280 ${yDetour}, 335 ${yDetour}`;
    const pathDiscToRam  = `M 335 ${yDetour} C 390 ${yDetour}, 415 ${yLine}, 470 ${yLine}`;
    const pathResume     = `M 470 ${yLine} C 390 24, 150 24, 70 ${yLine}`;

    const isFaded = (node: string) => hovered !== null && hovered !== node;

    return (
        <div className="w-full my-6 select-none flex flex-col items-center justify-center not-prose">
            <div className="w-full max-w-lg relative flex flex-col items-center">
                <svg
                    viewBox="0 0 540 160"
                    className="w-full h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter id="glow-pf-clean" x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <linearGradient id="grad-fault-disc" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f43f5e" />
                            <stop offset="100%" stopColor="#fbbf24" />
                        </linearGradient>

                        <linearGradient id="grad-disc-ram" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#fbbf24" />
                            <stop offset="100%" stopColor="#34d399" />
                        </linearGradient>

                        <linearGradient id="grad-resume" x1="100%" y1="0%" x2="0%" y2="0%">
                            <stop offset="0%" stopColor="#34d399" />
                            <stop offset="100%" stopColor="#38bdf8" />
                        </linearGradient>
                    </defs>

                    {/* BASE INACTIVE BLUEPRINT */}
                    <path d={pathCpuToFault} className="stroke-slate-300/25 dark:stroke-white/[0.07]" strokeWidth="1.4" />
                    <path d={pathFaultToDisc} className="stroke-slate-300/25 dark:stroke-white/[0.07]" strokeWidth="1.4" strokeDasharray="3 3" />
                    <path d={pathDiscToRam} className="stroke-slate-300/25 dark:stroke-white/[0.07]" strokeWidth="1.4" strokeDasharray="3 3" />
                    <path d={pathResume} className="stroke-slate-300/20 dark:stroke-white/[0.05]" strokeWidth="1.2" strokeDasharray="3 3" />

                    {/* ACTIVE TRACK 1: CPU -> FAULT */}
                    <path
                        d={pathCpuToFault}
                        stroke="#f43f5e"
                        strokeWidth={1.8}
                        strokeLinecap="round"
                        filter="url(#glow-pf-clean)"
                    />

                    {/* ACTIVE TRACK 2: FAULT -> DISC */}
                    <path
                        d={pathFaultToDisc}
                        stroke="url(#grad-fault-disc)"
                        strokeWidth={1.8}
                        strokeLinecap="round"
                        strokeDasharray="3 3"
                        filter="url(#glow-pf-clean)"
                    />

                    {/* ACTIVE TRACK 3: DISC -> RAM (4 KB LOAD) */}
                    <path
                        d={pathDiscToRam}
                        stroke="url(#grad-disc-ram)"
                        strokeWidth={2}
                        strokeLinecap="round"
                        filter="url(#glow-pf-clean)"
                    />

                    {/* ACTIVE TRACK 4: RESUME EXECUTION */}
                    <path
                        d={pathResume}
                        stroke="url(#grad-resume)"
                        strokeWidth={1.4}
                        strokeLinecap="round"
                        strokeDasharray="4 4"
                        filter="url(#glow-pf-clean)"
                    />

                    {/* CONTINUOUS FLOW PARTICLES */}
                    {/* 1. Trap trigger */}
                    <motion.circle
                        r={2.5}
                        fill="#f43f5e"
                        filter="url(#glow-pf-clean)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${pathCpuToFault}")` }}
                    />

                    {/* 2. Disk I/O fetch */}
                    <motion.circle
                        r={2.5}
                        fill="#fbbf24"
                        filter="url(#glow-pf-clean)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity, delay: 0.6, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${pathFaultToDisc}")` }}
                    />

                    {/* 3. Page load to RAM */}
                    <motion.circle
                        r={2.8}
                        fill="#34d399"
                        filter="url(#glow-pf-clean)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity, delay: 1.2, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${pathDiscToRam}")` }}
                    />

                    {/* 4. Resume instruction */}
                    <motion.circle
                        r={2.2}
                        fill="#38bdf8"
                        filter="url(#glow-pf-clean)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 0.8, 0.8, 0] }}
                        transition={{ duration: 2.4, repeat: Infinity, delay: 1.8, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${pathResume}")` }}
                    />

                    {/* NODE 1: CPU */}
                    <g
                        transform={`translate(70, ${yLine})`}
                        onMouseEnter={() => setHovered('cpu')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer"
                    >
                        <circle cx="0" cy="0" r="14" fill="rgba(56, 189, 248, 0.12)" />
                        <circle cx="0" cy="0" r="2.5" fill="#38bdf8" />
                        <foreignObject x="-14" y="-32" width="28" height="28" className="overflow-visible pointer-events-none">
                            <div className={`w-full h-full flex items-center justify-center transition-opacity duration-200 ${isFaded('cpu') ? 'opacity-30' : 'opacity-100'}`}>
                                <Cpu className="w-4.5 h-4.5 text-sky-400" strokeWidth={1.8} />
                            </div>
                        </foreignObject>
                        <text
                            x="0"
                            y="24"
                            textAnchor="middle"
                            className={`font-mono text-[9px] font-semibold tracking-wider fill-sky-400 pointer-events-none transition-opacity duration-200 ${isFaded('cpu') ? 'opacity-30' : 'opacity-100'}`}
                        >
                            CPU
                        </text>
                    </g>

                    {/* NODE 2: FAULT */}
                    <g
                        transform={`translate(200, ${yLine})`}
                        onMouseEnter={() => setHovered('fault')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer"
                    >
                        <circle cx="0" cy="0" r="14" fill="rgba(244, 63, 94, 0.14)" />
                        <circle cx="0" cy="0" r="2.5" fill="#f43f5e" />
                        <foreignObject x="-14" y="-32" width="28" height="28" className="overflow-visible pointer-events-none">
                            <div className={`w-full h-full flex items-center justify-center transition-opacity duration-200 ${isFaded('fault') ? 'opacity-30' : 'opacity-100'}`}>
                                <AlertCircle className="w-4.5 h-4.5 text-rose-400" strokeWidth={1.8} />
                            </div>
                        </foreignObject>
                        <text
                            x="0"
                            y="24"
                            textAnchor="middle"
                            className={`font-mono text-[9px] font-bold tracking-wider fill-rose-400 pointer-events-none transition-opacity duration-200 ${isFaded('fault') ? 'opacity-30' : 'opacity-100'}`}
                        >
                            FAULT
                        </text>
                    </g>

                    {/* NODE 3: DISC */}
                    <g
                        transform={`translate(335, ${yDetour})`}
                        onMouseEnter={() => setHovered('disc')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer"
                    >
                        <circle cx="0" cy="0" r="14" fill="rgba(251, 191, 36, 0.12)" />
                        <circle cx="0" cy="0" r="2.5" fill="#fbbf24" />
                        <foreignObject x="-14" y="-32" width="28" height="28" className="overflow-visible pointer-events-none">
                            <div className={`w-full h-full flex items-center justify-center transition-opacity duration-200 ${isFaded('disc') ? 'opacity-30' : 'opacity-100'}`}>
                                <Disc className="w-4.5 h-4.5 text-amber-400" strokeWidth={1.8} />
                            </div>
                        </foreignObject>
                        <text
                            x="0"
                            y="24"
                            textAnchor="middle"
                            className={`font-mono text-[9px] font-semibold tracking-wider fill-amber-300 pointer-events-none transition-opacity duration-200 ${isFaded('disc') ? 'opacity-30' : 'opacity-100'}`}
                        >
                            DISC
                        </text>
                    </g>

                    {/* NODE 4: RAM */}
                    <g
                        transform={`translate(470, ${yLine})`}
                        onMouseEnter={() => setHovered('ram')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer"
                    >
                        <circle cx="0" cy="0" r="14" fill="rgba(52, 211, 153, 0.14)" />
                        <circle cx="0" cy="0" r="2.5" fill="#34d399" />
                        <foreignObject x="-14" y="-32" width="28" height="28" className="overflow-visible pointer-events-none">
                            <div className={`w-full h-full flex items-center justify-center transition-opacity duration-200 ${isFaded('ram') ? 'opacity-30' : 'opacity-100'}`}>
                                <HardDrive className="w-4.5 h-4.5 text-emerald-400" strokeWidth={1.8} />
                            </div>
                        </foreignObject>
                        <text
                            x="0"
                            y="24"
                            textAnchor="middle"
                            className={`font-mono text-[9px] font-semibold tracking-wider fill-emerald-400 pointer-events-none transition-opacity duration-200 ${isFaded('ram') ? 'opacity-30' : 'opacity-100'}`}
                        >
                            RAM
                        </text>
                    </g>
                </svg>
            </div>
        </div>
    );
}
