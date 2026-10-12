"use client";

import React, { useState, useEffect } from 'react';
import { m as motion } from 'framer-motion';
import { Cpu } from 'lucide-react';

export default function RoundRobinViz() {
    const [scenario, setScenario] = useState<'quantum' | 'blocked'>('quantum');
    const [activeProcess, setActiveProcess] = useState<number>(0); // 0: P1, 1: P2, 2: P3

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveProcess((prev) => (prev + 1) % 3);
        }, scenario === 'quantum' ? 2200 : 1500);
        return () => clearInterval(interval);
    }, [scenario]);

    // Ring layout: center (270, 95), radius 58
    // P1: top (270, 37)
    // P2: bottom-right (270 + 58*cos(30), 95 + 58*sin(30)) = (320, 124)
    // P3: bottom-left (270 - 58*cos(30), 95 + 58*sin(30)) = (220, 124)
    const cx = 270;
    const cy = 92;
    const r = 58;

    return (
        <div className="w-full my-8 select-none flex flex-col items-center justify-center">
            <div className="w-full max-w-xl relative flex flex-col items-center">
                {/* Scenario Toggle */}
                <div className="flex items-center gap-2 mb-3">
                    <button
                        type="button"
                        onClick={() => setScenario('quantum')}
                        className={`px-3 py-1 rounded-full font-mono text-[10.5px] transition-all duration-200 cursor-pointer ${
                            scenario === 'quantum'
                                ? 'bg-sky-500/20 text-sky-300 border border-sky-400/50'
                                : 'bg-slate-900/40 text-slate-500 border border-white/5 hover:text-slate-300'
                        }`}
                    >
                        Torn normal (Q = 10 ms)
                    </button>
                    <button
                        type="button"
                        onClick={() => setScenario('blocked')}
                        className={`px-3 py-1 rounded-full font-mono text-[10.5px] transition-all duration-200 cursor-pointer ${
                            scenario === 'blocked'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50'
                                : 'bg-slate-900/40 text-slate-500 border border-white/5 hover:text-slate-300'
                        }`}
                    >
                        Bloqueig prematur (3 ms)
                    </button>
                </div>

                <svg
                    viewBox="0 0 540 180"
                    className="w-full h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter id="glow-rr" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Orbit Ring */}
                    <circle
                        cx={cx}
                        cy={cy}
                        r={r}
                        className="stroke-slate-300/30 dark:stroke-white/[0.08]"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                    />

                    {/* Rotating Active Stream: anchored precisely at cx, cy using strokeDashoffset */}
                    <motion.circle
                        cx={cx}
                        cy={cy}
                        r={r}
                        stroke="#38bdf8"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeDasharray="95 270"
                        animate={{ strokeDashoffset: [0, -365] }}
                        transition={{
                            duration: scenario === 'quantum' ? 4.8 : 3.2,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        filter="url(#glow-rr)"
                    />

                    {/* CENTER: CPU */}
                    <g transform={`translate(${cx}, ${cy})`}>
                        <circle cx="0" cy="0" r="22" fill="#0b0f19" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />
                        <foreignObject x="-10" y="-14" width="20" height="20" className="pointer-events-none">
                            <Cpu className="w-5 h-5 text-indigo-400" strokeWidth={1.75} />
                        </foreignObject>
                        <text x="0" y="13" textAnchor="middle" className="font-mono text-[7px] tracking-wider fill-indigo-200 pointer-events-none uppercase font-semibold">
                            CPU
                        </text>
                    </g>

                    {/* NODE 1: P1 (Top) */}
                    <g
                        transform={`translate(${cx}, ${cy - r})`}
                        onClick={() => setActiveProcess(0)}
                        className="cursor-pointer"
                    >
                        <circle
                            cx="0"
                            cy="0"
                            r={activeProcess === 0 ? 15 : 12}
                            fill={activeProcess === 0 ? "rgba(56, 189, 248, 0.2)" : "#0b0f19"}
                            stroke={activeProcess === 0 ? "#38bdf8" : "rgba(255,255,255,0.15)"}
                            strokeWidth={activeProcess === 0 ? 1.8 : 1}
                            className="transition-all duration-300"
                        />
                        <text
                            x="0"
                            y="3.5"
                            textAnchor="middle"
                            className={`font-mono text-[9px] font-bold pointer-events-none ${
                                activeProcess === 0 ? "fill-sky-300" : "fill-slate-400"
                            }`}
                        >
                            P1
                        </text>
                        {activeProcess === 0 && (
                            <text x="0" y="-20" textAnchor="middle" className="font-mono text-[8px] fill-sky-400 font-semibold pointer-events-none">
                                {scenario === 'quantum' ? "10 ms" : "3 ms (I/O)"}
                            </text>
                        )}
                    </g>

                    {/* NODE 2: P2 (Bottom Right) */}
                    <g
                        transform={`translate(${cx + 50}, ${cy + 30})`}
                        onClick={() => setActiveProcess(1)}
                        className="cursor-pointer"
                    >
                        <circle
                            cx="0"
                            cy="0"
                            r={activeProcess === 1 ? 15 : 12}
                            fill={activeProcess === 1 ? "rgba(129, 140, 248, 0.2)" : "#0b0f19"}
                            stroke={activeProcess === 1 ? "#818cf8" : "rgba(255,255,255,0.15)"}
                            strokeWidth={activeProcess === 1 ? 1.8 : 1}
                            className="transition-all duration-300"
                        />
                        <text
                            x="0"
                            y="3.5"
                            textAnchor="middle"
                            className={`font-mono text-[9px] font-bold pointer-events-none ${
                                activeProcess === 1 ? "fill-indigo-300" : "fill-slate-400"
                            }`}
                        >
                            P2
                        </text>
                        {activeProcess === 1 && (
                            <text x="24" y="4" textAnchor="start" className="font-mono text-[8px] fill-indigo-400 font-semibold pointer-events-none">
                                10 ms
                            </text>
                        )}
                    </g>

                    {/* NODE 3: P3 (Bottom Left) */}
                    <g
                        transform={`translate(${cx - 50}, ${cy + 30})`}
                        onClick={() => setActiveProcess(2)}
                        className="cursor-pointer"
                    >
                        <circle
                            cx="0"
                            cy="0"
                            r={activeProcess === 2 ? 15 : 12}
                            fill={activeProcess === 2 ? "rgba(52, 211, 153, 0.2)" : "#0b0f19"}
                            stroke={activeProcess === 2 ? "#34d399" : "rgba(255,255,255,0.15)"}
                            strokeWidth={activeProcess === 2 ? 1.8 : 1}
                            className="transition-all duration-300"
                        />
                        <text
                            x="0"
                            y="3.5"
                            textAnchor="middle"
                            className={`font-mono text-[9px] font-bold pointer-events-none ${
                                activeProcess === 2 ? "fill-emerald-300" : "fill-slate-400"
                            }`}
                        >
                            P3
                        </text>
                        {activeProcess === 2 && (
                            <text x="-24" y="4" textAnchor="end" className="font-mono text-[8px] fill-emerald-400 font-semibold pointer-events-none">
                                10 ms
                            </text>
                        )}
                    </g>
                </svg>
            </div>
        </div>
    );
}
