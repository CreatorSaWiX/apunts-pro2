"use client";

import React, { useState } from 'react';
import { m as motion } from 'framer-motion';
import { Timer, Bell, Play, Ban } from 'lucide-react';

export default function AlarmViz() {
    const [actionOutcome, setActionOutcome] = useState<'default' | 'handler'>('default');

    // Layout coordinates
    // Program line: (95, 42) -> (245, 42)
    // Kernel timer: (95, 92) -> (245, 92)
    // Alarm inject: (245, 92) -> (245, 42)
    const pathProgram = "M 95 42 L 245 42";
    const pathTimer   = "M 95 92 L 245 92";
    const pathDeliver = "M 245 92 L 245 42";

    // Outcomes after SIGALRM arrives at (245, 42)
    const pathExit    = "M 245 42 C 290 42, 315 20, 370 20";
    const pathHandler = "M 245 42 C 290 42, 315 66, 370 66";

    return (
        <div className="w-full my-6 select-none flex flex-col items-center justify-center">
            <div className="w-full max-w-xl relative flex flex-col items-center">
                <svg
                    viewBox="0 0 520 115"
                    className="w-full h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter id="glow-alarm" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <linearGradient id="grad-timer-wire" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#f43f5e" />
                        </linearGradient>

                        <linearGradient id="grad-handler-flow" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#f43f5e" />
                            <stop offset="100%" stopColor="#34d399" />
                        </linearGradient>
                    </defs>

                    {/* BASE INACTIVE TRACKS */}
                    <path d={pathProgram} className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.3" />
                    <path d={pathTimer}   className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.3" strokeDasharray="3 3" />
                    <path d={pathDeliver} className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.3" strokeDasharray="2 2" />
                    <path d={pathExit}    className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.2" strokeDasharray="3 3" />
                    <path d={pathHandler} className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.2" />

                    {/* ACTIVE FLOW TRACKS */}
                    {/* 1. Main Program thread continues running */}
                    <path d={pathProgram} stroke="#38bdf8" strokeWidth={1.8} filter="url(#glow-alarm)" />

                    {/* 2. Kernel Background Countdown (cleanly unobstructed) */}
                    <path d={pathTimer} stroke="url(#grad-timer-wire)" strokeWidth={1.8} strokeDasharray="4 4" filter="url(#glow-alarm)" />

                    {/* 3. SIGALRM Interrupt injection up to program */}
                    <path d={pathDeliver} stroke="#f43f5e" strokeWidth={2} strokeLinecap="round" filter="url(#glow-alarm)" />

                    {/* 4. Branch A: Default Exit */}
                    <motion.path
                        d={pathExit}
                        stroke="#f43f5e"
                        strokeWidth={actionOutcome === 'default' ? 2.2 : 1.4}
                        strokeDasharray={actionOutcome === 'default' ? "none" : "3 3"}
                        animate={{ opacity: actionOutcome === 'default' ? 1 : 0.3 }}
                        filter="url(#glow-alarm)"
                    />

                    {/* 5. Branch B: Custom Handler */}
                    <motion.path
                        d={pathHandler}
                        stroke="url(#grad-handler-flow)"
                        strokeWidth={actionOutcome === 'handler' ? 2.4 : 1.4}
                        animate={{ opacity: actionOutcome === 'handler' ? 1 : 0.3 }}
                        filter="url(#glow-alarm)"
                    />

                    {/* CONTINUOUS FLOW PARTICLES */}
                    {/* Program execution particle */}
                    <motion.circle
                        r={2.5}
                        fill="#38bdf8"
                        filter="url(#glow-alarm)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 0.9, 0.9, 0] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
                        style={{ offsetPath: `path("${pathProgram}")` }}
                    />

                    {/* Countdown particle */}
                    <motion.circle
                        r={2.5}
                        fill="#f59e0b"
                        filter="url(#glow-alarm)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
                        style={{ offsetPath: `path("${pathTimer}")` }}
                    />

                    {/* Outcome particle based on selected branch */}
                    <motion.circle
                        key={actionOutcome}
                        r={2.75}
                        fill={actionOutcome === 'default' ? "#f43f5e" : "#34d399"}
                        filter="url(#glow-alarm)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 1.6, repeat: Infinity, delay: 0.6, ease: "easeInOut" }}
                        style={{
                            offsetPath: `path("${actionOutcome === 'default' ? pathExit : pathHandler}")`
                        }}
                    />

                    {/* NODE 1: PROGRAM ORIGIN (Label to the left) */}
                    <g transform="translate(95, 42)">
                        <circle cx="0" cy="0" r="12" fill="rgba(56, 189, 248, 0.12)" />
                        <circle cx="0" cy="0" r="2.5" fill="#38bdf8" />
                        <text x="-16" y="3" textAnchor="end" className="font-mono text-[8.5px] font-semibold fill-sky-300 pointer-events-none">
                            PROGRAMA
                        </text>
                    </g>

                    {/* NODE 2: ALARM ORIGIN (Label & icon positioned strictly to the left) */}
                    <g transform="translate(95, 92)">
                        <circle cx="0" cy="0" r="13" fill="rgba(245, 158, 11, 0.12)" />
                        <circle cx="0" cy="0" r="2.5" fill="#f59e0b" />
                        <foreignObject x="-30" y="-8" width="16" height="16" className="pointer-events-none">
                            <Timer className="w-4 h-4 text-amber-400" strokeWidth={1.8} />
                        </foreignObject>
                        <text x="-36" y="3" textAnchor="end" className="font-mono text-[8.5px] font-bold fill-amber-300 pointer-events-none">
                            alarm(N)
                        </text>
                    </g>

                    {/* Kernel countdown description */}
                    <g transform="translate(170, 106)">
                        <text x="0" y="0" textAnchor="middle" className="font-mono text-[7.5px] fill-slate-400 dark:fill-slate-500 pointer-events-none">
                            Kernel compta en segon pla...
                        </text>
                    </g>

                    {/* NODE 3: SIGALRM ARRIVAL (Interrupt point) */}
                    <g transform="translate(245, 42)">
                        <circle cx="0" cy="0" r="14" fill="rgba(244, 63, 94, 0.15)" />
                        <circle cx="0" cy="0" r="2.5" fill="#f43f5e" />
                        <foreignObject x="-8" y="-28" width="16" height="16" className="pointer-events-none">
                            <Bell className="w-4 h-4 text-rose-400" strokeWidth={1.8} />
                        </foreignObject>
                        <text x="0" y="24" textAnchor="middle" className="font-mono text-[8.5px] font-bold fill-rose-300 pointer-events-none">
                            SIGALRM
                        </text>
                    </g>

                    {/* OUTCOME A: DEFAULT EXIT (Mata procés) */}
                    <g
                        transform="translate(370, 20)"
                        onClick={() => setActionOutcome('default')}
                        className="cursor-pointer group"
                        opacity={actionOutcome === 'default' ? 1 : 0.35}
                    >
                        <circle cx="0" cy="0" r="11" fill="rgba(244, 63, 94, 0.12)" />
                        <circle cx="0" cy="0" r="2" fill="#f43f5e" />
                        <foreignObject x="8" y="-8" width="16" height="16" className="pointer-events-none">
                            <Ban className="w-3.5 h-3.5 text-rose-400" strokeWidth={1.8} />
                        </foreignObject>
                        <text x="28" y="3" textAnchor="start" className="font-mono text-[8.5px] font-semibold fill-rose-300 pointer-events-none">
                            SIG_DFL ➔ exit() (Timeout)
                        </text>
                    </g>

                    {/* OUTCOME B: HANDLER (Capturat amb sigaction) */}
                    <g
                        transform="translate(370, 66)"
                        onClick={() => setActionOutcome('handler')}
                        className="cursor-pointer group"
                        opacity={actionOutcome === 'handler' ? 1 : 0.35}
                    >
                        <circle cx="0" cy="0" r="11" fill="rgba(52, 211, 153, 0.12)" />
                        <circle cx="0" cy="0" r="2" fill="#34d399" />
                        <foreignObject x="8" y="-8" width="16" height="16" className="pointer-events-none">
                            <Play className="w-3.5 h-3.5 text-emerald-400" strokeWidth={1.8} />
                        </foreignObject>
                        <text x="28" y="3" textAnchor="start" className="font-mono text-[8.5px] font-bold fill-emerald-300 pointer-events-none">
                            sigaction ➔ handler() (Continua)
                        </text>
                    </g>
                </svg>

                {/* SELECTOR BOTONS INFERIORS */}
                <div className="flex items-center gap-2 mt-1">
                    <button
                        type="button"
                        onClick={() => setActionOutcome('default')}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-mono transition-all duration-200 border ${
                            actionOutcome === 'default'
                                ? 'bg-rose-500/15 border-rose-500/50 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
                                : 'bg-slate-900/40 border-white/5 text-slate-500 hover:text-slate-300'
                        }`}
                    >
                        1. Per defecte: mata el procés (exit)
                    </button>
                    <button
                        type="button"
                        onClick={() => setActionOutcome('handler')}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-mono transition-all duration-200 border ${
                            actionOutcome === 'handler'
                                ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.2)]'
                                : 'bg-slate-900/40 border-white/5 text-slate-500 hover:text-slate-300'
                        }`}
                    >
                        2. Amb sigaction: executa handler i continua
                    </button>
                </div>
            </div>
        </div>
    );
}
