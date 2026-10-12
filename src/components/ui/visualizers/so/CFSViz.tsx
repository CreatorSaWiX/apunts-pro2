"use client";

import React, { useState } from 'react';
import { Cpu } from 'lucide-react';

interface ProcessNode {
    id: string;
    label: string;
    vruntime: number;
    color: string;
}

export default function CFSViz() {
    const [ioEvent, setIoEvent] = useState(false);

    // Sorted strictly by vruntime (lowest on left = next to run)
    const processes: ProcessNode[] = ioEvent
        ? [
            { id: "p0", label: "P_io (Teclat)", vruntime: 4, color: "#34d399" },
            { id: "p1", label: "P1 (Shell)", vruntime: 24, color: "#38bdf8" },
            { id: "p2", label: "P2 (Compilador)", vruntime: 65, color: "#818cf8" },
            { id: "p3", label: "P3 (Render)", vruntime: 120, color: "#f43f5e" }
        ]
        : [
            { id: "p1", label: "P1 (Shell)", vruntime: 24, color: "#38bdf8" },
            { id: "p2", label: "P2 (Compilador)", vruntime: 65, color: "#818cf8" },
            { id: "p3", label: "P3 (Render)", vruntime: 120, color: "#f43f5e" }
        ];

    const count = processes.length;
    const getX = (idx: number) => {
        if (count === 3) return 100 + idx * 170; // 100, 270, 440
        return 75 + idx * 130; // 75, 205, 335, 465
    };

    const yAxis = 75;

    return (
        <div className="w-full my-6 select-none flex flex-col items-center justify-center">
            <div className="w-full max-w-xl relative flex flex-col items-center">
                {/* Minimalist 2-state Switch */}
                <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-900/60 border border-white/5 mb-2">
                    <button
                        type="button"
                        onClick={() => setIoEvent(false)}
                        className={`px-3 py-1 rounded-full font-mono text-[10px] transition-all duration-200 cursor-pointer ${
                            !ioEvent
                                ? 'bg-sky-500/20 text-sky-300 border border-sky-400/40 shadow-sm'
                                : 'text-slate-500 hover:text-slate-300 border border-transparent'
                        }`}
                    >
                        Cua normal
                    </button>
                    <button
                        type="button"
                        onClick={() => setIoEvent(true)}
                        className={`px-3 py-1 rounded-full font-mono text-[10px] transition-all duration-200 cursor-pointer ${
                            ioEvent
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-sm'
                                : 'text-slate-500 hover:text-slate-300 border border-transparent'
                        }`}
                    >
                        Event E/S (Desperta)
                    </button>
                </div>

                <svg
                    viewBox="0 0 540 130"
                    className="w-full h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter id="glow-cfs" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <linearGradient id="grad-cfs-track" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#34d399" />
                            <stop offset="30%" stopColor="#38bdf8" />
                            <stop offset="70%" stopColor="#818cf8" />
                            <stop offset="100%" stopColor="#f43f5e" />
                        </linearGradient>
                    </defs>

                    {/* Axis Line */}
                    <path
                        d={`M 40 ${yAxis} L 500 ${yAxis}`}
                        className="stroke-slate-300/30 dark:stroke-white/[0.08]"
                        strokeWidth="1.5"
                    />
                    <path
                        d={`M 40 ${yAxis} L 500 ${yAxis}`}
                        stroke="url(#grad-cfs-track)"
                        strokeWidth={1.8}
                        strokeLinecap="round"
                    />

                    {/* Edge axis hints (tiny, non-intrusive) */}
                    <text x="40" y={yAxis + 42} className="font-mono text-[7px] uppercase tracking-widest fill-slate-500 pointer-events-none">
                        min vruntime
                    </text>
                    <text x="500" y={yAxis + 42} textAnchor="end" className="font-mono text-[7px] uppercase tracking-widest fill-slate-500 pointer-events-none">
                        max vruntime
                    </text>

                    {/* CPU TARGET BADGE (Only on the leftmost process, floating above with plenty of space) */}
                    <g transform={`translate(${getX(0)}, ${yAxis - 48})`}>
                        <foreignObject x="-45" y="-12" width="90" height="24" className="overflow-visible pointer-events-none">
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0b0f19] border border-emerald-400/60 shadow-lg text-[7px] font-mono text-emerald-300 font-semibold tracking-wider whitespace-nowrap">
                                    <Cpu className="w-3 h-3 text-emerald-400" />
                                    <span>CPU</span>
                                </span>
                            </div>
                        </foreignObject>
                    </g>

                    {/* PROCESS NODES */}
                    {processes.map((proc, idx) => {
                        const x = getX(idx);
                        const isFirst = idx === 0;

                        return (
                            <g key={proc.id} transform={`translate(${x}, ${yAxis})`} className="transition-all duration-300">
                                {/* Track Dot / Node */}
                                <circle
                                    cx="0"
                                    cy="0"
                                    r={isFirst ? 14 : 10}
                                    fill={isFirst ? "rgba(52, 211, 153, 0.16)" : "#0b0f19"}
                                    stroke={proc.color}
                                    strokeWidth={isFirst ? 1.8 : 1}
                                    filter={isFirst ? "url(#glow-cfs)" : undefined}
                                />
                                <circle cx="0" cy="0" r="2.5" fill={proc.color} />

                                {/* Label directly above with clean spacing */}
                                <foreignObject x="-60" y="-30" width="120" height="20" className="overflow-visible pointer-events-none">
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className={`font-mono text-[8.5px] font-semibold tracking-wide whitespace-nowrap ${
                                            isFirst ? 'text-emerald-300 font-bold' : 'text-slate-300'
                                        }`}>
                                            {proc.label}
                                        </span>
                                    </div>
                                </foreignObject>

                                {/* vruntime Badge directly below with clean spacing */}
                                <foreignObject x="-40" y="14" width="80" height="22" className="overflow-visible pointer-events-none">
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-mono text-[7px] font-semibold whitespace-nowrap ${
                                            isFirst
                                                ? 'bg-[#0b0f19] border border-emerald-400/50 text-emerald-300'
                                                : 'bg-[#0b0f19] border border-white/10 text-slate-400'
                                        }`}>
                                            {proc.vruntime} ms
                                        </span>
                                    </div>
                                </foreignObject>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}
