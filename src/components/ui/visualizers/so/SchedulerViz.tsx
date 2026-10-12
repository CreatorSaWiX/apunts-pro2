"use client";

import React, { useState } from 'react';
import { m as motion } from 'framer-motion';
import { Cpu, Shield, ArrowRight } from 'lucide-react';

export default function SchedulerViz() {
    const [policy, setPolicy] = useState<'preemptive' | 'cooperative'>('preemptive');

    // Spacious layout coordinates: viewBox 0 0 600 160
    // Timeline height: y = 92
    // Preemption arc height: peaks at y = 26
    const yLine = 92;
    const pathDispatch   = `M 170 ${yLine} L 245 ${yLine}`;
    const pathToCpu      = `M 345 ${yLine} L 430 ${yLine}`;
    const pathExit       = `M 490 ${yLine} L 565 ${yLine}`;
    const pathPreemption = `M 460 74 C 460 26, 120 26, 120 74`;

    return (
        <div className="w-full my-8 select-none flex flex-col items-center justify-center">
            <div className="w-full max-w-xl relative flex flex-col items-center">
                {/* Minimalist Policy Toggle */}
                <div className="flex items-center gap-2 mb-4">
                    <button
                        type="button"
                        onClick={() => setPolicy('preemptive')}
                        className={`px-3 py-1 rounded-full font-mono text-[10.5px] transition-all duration-200 cursor-pointer ${
                            policy === 'preemptive'
                                ? 'bg-sky-500/20 text-sky-300 border border-sky-400/50'
                                : 'bg-slate-900/40 text-slate-500 border border-white/5 hover:text-slate-300'
                        }`}
                    >
                        Apropiativa (Preemptive)
                    </button>
                    <button
                        type="button"
                        onClick={() => setPolicy('cooperative')}
                        className={`px-3 py-1 rounded-full font-mono text-[10.5px] transition-all duration-200 cursor-pointer ${
                            policy === 'cooperative'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50'
                                : 'bg-slate-900/40 text-slate-500 border border-white/5 hover:text-slate-300'
                        }`}
                    >
                        Cooperativa (Non-preemptive)
                    </button>
                </div>

                <svg
                    viewBox="0 0 600 155"
                    className="w-full h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter id="glow-sched" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <linearGradient id="grad-preempt" x1="100%" y1="0%" x2="0%" y2="0%">
                            <stop offset="0%" stopColor="#f43f5e" />
                            <stop offset="50%" stopColor="#fbbf24" />
                            <stop offset="100%" stopColor="#38bdf8" />
                        </linearGradient>
                    </defs>

                    {/* Base Tracks */}
                    <path d={pathDispatch} className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.5" />
                    <path d={pathToCpu} className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.5" />
                    <path d={pathExit} className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.5" strokeDasharray="3 3" />
                    <path d={pathPreemption} className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.2" strokeDasharray="3 3" />

                    {/* Active Tracks */}
                    <path d={pathDispatch} stroke="#38bdf8" strokeWidth={1.8} filter="url(#glow-sched)" />
                    <path d={pathToCpu} stroke="#818cf8" strokeWidth={1.8} filter="url(#glow-sched)" />
                    <path d={pathExit} stroke="#34d399" strokeWidth={1.5} filter="url(#glow-sched)" />

                    {/* Preemption Loop */}
                    <motion.path
                        d={pathPreemption}
                        stroke="url(#grad-preempt)"
                        strokeWidth={policy === 'preemptive' ? 2 : 1}
                        strokeDasharray={policy === 'preemptive' ? "none" : "3 3"}
                        animate={{ opacity: policy === 'preemptive' ? 1 : 0.15 }}
                        transition={{ duration: 0.25 }}
                        filter="url(#glow-sched)"
                    />

                    {/* Particles */}
                    <motion.circle
                        r={2.5}
                        fill="#38bdf8"
                        filter="url(#glow-sched)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        style={{ offsetPath: `path("${pathDispatch}")` }}
                    />
                    <motion.circle
                        r={2.5}
                        fill="#818cf8"
                        filter="url(#glow-sched)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.75, ease: "linear" }}
                        style={{ offsetPath: `path("${pathToCpu}")` }}
                    />

                    {policy === 'preemptive' && (
                        <motion.circle
                            key="preempt-dot"
                            r={2.75}
                            fill="#f43f5e"
                            filter="url(#glow-sched)"
                            initial={{ offsetDistance: "0%", opacity: 0 }}
                            animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                            transition={{ duration: 2.2, repeat: Infinity, delay: 0.9, ease: "easeInOut" }}
                            style={{ offsetPath: `path("${pathPreemption}")` }}
                        />
                    )}

                    {/* CUA READY (Processos ben espaiats) */}
                    <g transform={`translate(100, ${yLine})`}>
                        <g transform="translate(-40, -10)">
                            <rect x="0" y="0" width="22" height="20" rx="4" className="fill-slate-900 border stroke-white/10" strokeWidth="0.8" />
                            <text x="11" y="13.5" textAnchor="middle" className="font-mono text-[8px] fill-slate-400 pointer-events-none">P3</text>
                        </g>
                        <g transform="translate(-10, -10)">
                            <rect x="0" y="0" width="22" height="20" rx="4" className="fill-slate-900 border stroke-white/10" strokeWidth="0.8" />
                            <text x="11" y="13.5" textAnchor="middle" className="font-mono text-[8px] fill-slate-400 pointer-events-none">P2</text>
                        </g>
                        <g transform="translate(20, -10)">
                            <rect x="0" y="0" width="24" height="20" rx="4" className="fill-sky-950/80 stroke-sky-400/60" strokeWidth="1" />
                            <text x="12" y="13.5" textAnchor="middle" className="font-mono text-[8.5px] font-bold fill-sky-300 pointer-events-none">P1</text>
                        </g>
                        <text x="0" y="30" textAnchor="middle" className="font-mono text-[8.5px] uppercase tracking-wider fill-sky-400 font-semibold pointer-events-none">
                            Cua Ready
                        </text>
                    </g>

                    {/* SCHEDULER (Decisió) */}
                    <g transform={`translate(295, ${yLine})`}>
                        <rect x="-42" y="-14" width="84" height="28" rx="7" fill="#0b0f19" stroke="rgba(129, 140, 248, 0.4)" strokeWidth="1" />
                        <foreignObject x="-34" y="-8" width="16" height="16" className="pointer-events-none">
                            <Shield className="w-4 h-4 text-indigo-400" strokeWidth={1.75} />
                        </foreignObject>
                        <text x="8" y="3.5" textAnchor="middle" className="font-mono text-[8.5px] font-bold fill-indigo-300 pointer-events-none">
                            Scheduler
                        </text>
                    </g>

                    {/* CPU RUN */}
                    <g transform={`translate(460, ${yLine})`}>
                        <circle cx="0" cy="0" r="16" fill="rgba(52, 211, 153, 0.12)" />
                        <circle cx="0" cy="0" r="2.5" fill="#34d399" />
                        <foreignObject x="-9" y="-28" width="18" height="18" className="pointer-events-none">
                            <Cpu className="w-4.5 h-4.5 text-emerald-400" strokeWidth={1.75} />
                        </foreignObject>
                        <text x="0" y="24" textAnchor="middle" className="font-mono text-[9px] font-bold fill-emerald-300 pointer-events-none">
                            CPU (RUN)
                        </text>
                    </g>

                    {/* PREEMPTION LABEL AT PEAK OF ARC */}
                    {policy === 'preemptive' ? (
                        <g transform="translate(290, 20)">
                            <rect x="-44" y="-9" width="88" height="18" rx="4" fill="#0b0f19" stroke="rgba(244, 63, 94, 0.5)" strokeWidth="0.8" />
                            <text x="0" y="3" textAnchor="middle" className="font-mono text-[7.5px] uppercase tracking-wider fill-rose-300 pointer-events-none font-semibold">
                                Fi quàntum
                            </text>
                        </g>
                    ) : (
                        <g transform={`translate(535, ${yLine - 14})`}>
                            <text x="0" y="0" textAnchor="middle" className="font-mono text-[8px] fill-emerald-400/80 pointer-events-none">
                                exit()
                            </text>
                        </g>
                    )}
                </svg>
            </div>
        </div>
    );
}
