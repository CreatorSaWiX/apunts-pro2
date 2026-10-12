"use client";

import React, { useState } from 'react';
import { m as motion } from 'framer-motion';
import { Shield, ShieldAlert, Inbox, CheckCircle2 } from 'lucide-react';

export default function SigmaskViz() {
    const [mode, setMode] = useState<'block' | 'unblock'>('block');

    // Precision trajectories reaching exact destination coordinates
    // Origin: (60, 60) -> Gate: (190, 60) -> Pending: (340, 30) or Delivered: (340, 60)
    const pathInBlock   = "M 60 60 C 160 60, 210 30, 340 30";
    const pathInUnblock = "M 60 60 L 340 60";

    return (
        <div className="w-full my-6 select-none flex flex-col items-center justify-center">
            <div className="w-full max-w-xl relative flex flex-col items-center">
                <svg
                    viewBox="0 0 440 105"
                    className="w-full h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter id="glow-sigmask" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <linearGradient id="grad-blocked-wire" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#818cf8" />
                            <stop offset="100%" stopColor="#fbbf24" />
                        </linearGradient>

                        <linearGradient id="grad-pass-wire" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#818cf8" />
                            <stop offset="100%" stopColor="#34d399" />
                        </linearGradient>
                    </defs>

                    {/* Inactive base tracks (all the way to the pins) */}
                    <path d={pathInBlock}   className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.2" strokeDasharray="3 3" />
                    <path d={pathInUnblock} className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.2" />

                    {/* Active Track according to mode */}
                    {mode === 'block' ? (
                        <motion.path
                            d={pathInBlock}
                            stroke="url(#grad-blocked-wire)"
                            strokeWidth={2.4}
                            strokeLinecap="round"
                            filter="url(#glow-sigmask)"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.35 }}
                        />
                    ) : (
                        <motion.path
                            d={pathInUnblock}
                            stroke="url(#grad-pass-wire)"
                            strokeWidth={2.4}
                            strokeLinecap="round"
                            filter="url(#glow-sigmask)"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.35 }}
                        />
                    )}

                    {/* Flowing particle reaching exact pin */}
                    <motion.circle
                        key={mode}
                        r={3}
                        fill={mode === 'block' ? "#fbbf24" : "#34d399"}
                        filter="url(#glow-sigmask)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                        style={{
                            offsetPath: `path("${mode === 'block' ? pathInBlock : pathInUnblock}")`
                        }}
                    />

                    {/* 1. SIGNAL INGRESS */}
                    <g transform="translate(60, 60)">
                        <circle cx="0" cy="0" r="14" fill="rgba(129, 140, 248, 0.12)" />
                        <circle cx="0" cy="0" r="2.5" fill="#818cf8" />
                        <text x="0" y="24" textAnchor="middle" className="font-mono text-[9px] font-semibold fill-indigo-300 pointer-events-none">
                            SIGINT
                        </text>
                    </g>

                    {/* 2. MASK GATE NODE */}
                    <g
                        transform="translate(190, 60)"
                        onClick={() => setMode(m => m === 'block' ? 'unblock' : 'block')}
                        className="cursor-pointer group"
                    >
                        <foreignObject x="-44" y="-17" width="88" height="34" className="overflow-visible">
                            <div
                                className={`w-full h-full flex items-center justify-center gap-1.5 px-3 rounded-xl border backdrop-blur-sm transition-all duration-200 bg-[#0b0f19] ${
                                    mode === 'block'
                                        ? 'border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                                        : 'border-emerald-500/50 shadow-[0_0_12px_rgba(52,211,153,0.25)]'
                                }`}
                            >
                                {mode === 'block' ? (
                                    <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" strokeWidth={1.8} />
                                ) : (
                                    <Shield className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={1.8} />
                                )}
                                <span className="font-mono text-[9px] font-bold tracking-wider text-white select-none">
                                    {mode === 'block' ? "BLOCK" : "OPEN"}
                                </span>
                            </div>
                        </foreignObject>
                    </g>

                    {/* 3. DESTINATION A: PENDING BITMAP (Reachable on block) */}
                    <g transform="translate(340, 30)" opacity={mode === 'block' ? 1 : 0.25} className="transition-opacity duration-300">
                        <circle cx="0" cy="0" r={mode === 'block' ? 14 : 11} fill="rgba(251, 191, 36, 0.15)" className="transition-all duration-200" />
                        <circle cx="0" cy="0" r="2.5" fill="#fbbf24" />
                        <foreignObject x="10" y="-8" width="16" height="16" className="pointer-events-none">
                            <Inbox className="w-3.5 h-3.5 text-amber-300" strokeWidth={1.8} />
                        </foreignObject>
                        <text x="30" y="3" textAnchor="start" className="font-mono text-[8.5px] font-semibold fill-amber-300 pointer-events-none">
                            PENDING (bit=1)
                        </text>
                    </g>

                    {/* 4. DESTINATION B: DELIVERED / ATÈS (Reachable on unblock) */}
                    <g transform="translate(340, 60)" opacity={mode === 'unblock' ? 1 : 0.25} className="transition-opacity duration-300">
                        <circle cx="0" cy="0" r={mode === 'unblock' ? 14 : 11} fill="rgba(52, 211, 153, 0.15)" className="transition-all duration-200" />
                        <circle cx="0" cy="0" r="2.5" fill="#34d399" />
                        <foreignObject x="10" y="-8" width="16" height="16" className="pointer-events-none">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" strokeWidth={1.8} />
                        </foreignObject>
                        <text x="30" y="3" textAnchor="start" className="font-mono text-[8.5px] font-semibold fill-emerald-300 pointer-events-none">
                            ATÈS (s'executa)
                        </text>
                    </g>
                </svg>

                {/* INTERACTIVE COMMAND CAPSULE */}
                <div className="flex items-center gap-2 mt-1">
                    <button
                        type="button"
                        onClick={() => setMode('block')}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-mono transition-all duration-200 border ${
                            mode === 'block'
                                ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                                : 'bg-slate-900/40 border-white/5 text-slate-500 hover:text-slate-300'
                        }`}
                    >
                        sigprocmask(SIG_BLOCK, &amp;mascara, NULL)
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('unblock')}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-mono transition-all duration-200 border ${
                            mode === 'unblock'
                                ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.2)]'
                                : 'bg-slate-900/40 border-white/5 text-slate-500 hover:text-slate-300'
                        }`}
                    >
                        sigprocmask(SIG_UNBLOCK, &amp;mascara, NULL)
                    </button>
                </div>
            </div>
        </div>
    );
}
