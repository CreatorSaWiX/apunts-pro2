"use client";

import React, { useState } from 'react';
import { m as motion } from 'framer-motion';
import { Zap, Shield, Inbox, Sliders, Timer, Terminal, Ban, Play } from 'lucide-react';

type SectionId = 'mask' | 'pending' | 'actions' | 'alarm' | null;

// Routing paths
const PATH_SIG_IN     = "M 55 105 L 185 105";
const PATH_ALARM_FEED = "M 185 180 C 105 180, 105 105, 185 105";
const PATH_BLOCKED    = "M 185 105 C 235 105, 260 45, 340 45";
const PATH_UNBLOCK    = "M 340 45 C 415 45, 435 105, 485 105";
const PATH_DIRECT     = "M 185 105 L 485 105";

// Outputs from Action Table
const PATH_OUT_DFL     = "M 485 105 C 535 105, 555 65, 620 65";
const PATH_OUT_IGN     = "M 485 105 L 620 105";
const PATH_OUT_HANDLER = "M 485 105 C 535 105, 555 145, 620 145";

export default function SignalPcbViz() {
    const [hovered, setHovered] = useState<SectionId>(null);

    const isFaded = (sec: SectionId) => hovered !== null && hovered !== sec;
    const isLit   = (sec: SectionId) => hovered === sec;

    return (
        <div className="w-full my-8 select-none flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl relative">
                <svg
                    viewBox="0 0 680 230"
                    className="w-full h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        {/* Glow Filter */}
                        <filter id="glow-sigpcb" x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* Gradients */}
                        <linearGradient id="grad-blocked" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#818cf8" />
                            <stop offset="100%" stopColor="#fbbf24" />
                        </linearGradient>

                        <linearGradient id="grad-unblock" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#fbbf24" />
                            <stop offset="100%" stopColor="#c084fc" />
                        </linearGradient>

                        <linearGradient id="grad-direct" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#818cf8" />
                            <stop offset="100%" stopColor="#38bdf8" />
                        </linearGradient>

                        <linearGradient id="grad-alarm" x1="100%" y1="100%" x2="0%" y2="0%">
                            <stop offset="0%" stopColor="#f59e0b" />
                            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#38bdf8" />
                        </linearGradient>
                    </defs>

                    {/* BASE INACTIVE TRACKS (Blueprint background) */}
                    <path d={PATH_SIG_IN}     className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.5" />
                    <path d={PATH_ALARM_FEED} className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.5" strokeDasharray="3 3" />
                    <path d={PATH_BLOCKED}    className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.5" strokeDasharray="3 3" />
                    <path d={PATH_UNBLOCK}    className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.5" strokeDasharray="3 3" />
                    <path d={PATH_DIRECT}     className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.5" />
                    <path d={PATH_OUT_DFL}     className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.5" />
                    <path d={PATH_OUT_IGN}     className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.5" />
                    <path d={PATH_OUT_HANDLER} className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.5" />

                    {/* ACTIVE FLOW TRACKS */}
                    {/* Signal Ingress */}
                    <motion.path
                        d={PATH_SIG_IN}
                        stroke="#38bdf8"
                        strokeWidth={1.8}
                        strokeLinecap="round"
                        animate={{ opacity: isFaded('mask') ? 0.25 : 0.85 }}
                        filter="url(#glow-sigpcb)"
                    />

                    {/* Alarm Feed to Ingress */}
                    <motion.path
                        d={PATH_ALARM_FEED}
                        stroke="url(#grad-alarm)"
                        strokeWidth={isLit('alarm') ? 2.2 : 1.5}
                        strokeLinecap="round"
                        strokeDasharray={isLit('alarm') ? "none" : "3 3"}
                        animate={{ opacity: isFaded('alarm') ? 0.2 : 0.85 }}
                        filter="url(#glow-sigpcb)"
                    />

                    {/* Blocked Path (to Pending) */}
                    <motion.path
                        d={PATH_BLOCKED}
                        stroke="url(#grad-blocked)"
                        strokeWidth={isLit('mask') || isLit('pending') ? 2.4 : 1.6}
                        strokeLinecap="round"
                        strokeDasharray={isLit('pending') ? "none" : "4 4"}
                        animate={{ opacity: isFaded('mask') && isFaded('pending') ? 0.2 : 0.9 }}
                        filter="url(#glow-sigpcb)"
                    />

                    {/* Unblock Path (Pending -> Actions) */}
                    <motion.path
                        d={PATH_UNBLOCK}
                        stroke="url(#grad-unblock)"
                        strokeWidth={isLit('pending') || isLit('actions') ? 2.4 : 1.6}
                        strokeLinecap="round"
                        strokeDasharray={isLit('pending') ? "none" : "4 4"}
                        animate={{ opacity: isFaded('pending') && isFaded('actions') ? 0.2 : 0.9 }}
                        filter="url(#glow-sigpcb)"
                    />

                    {/* Direct Passthrough (Not Blocked) */}
                    <motion.path
                        d={PATH_DIRECT}
                        stroke="url(#grad-direct)"
                        strokeWidth={isLit('mask') || isLit('actions') ? 2.2 : 1.6}
                        strokeLinecap="round"
                        animate={{ opacity: isFaded('mask') && isFaded('actions') ? 0.2 : 0.8 }}
                        filter="url(#glow-sigpcb)"
                    />

                    {/* Output Tracks */}
                    <motion.path
                        d={PATH_OUT_DFL}
                        stroke="#f43f5e"
                        strokeWidth={isLit('actions') ? 2.2 : 1.6}
                        strokeLinecap="round"
                        animate={{ opacity: isFaded('actions') ? 0.25 : 0.85 }}
                        filter="url(#glow-sigpcb)"
                    />
                    <motion.path
                        d={PATH_OUT_IGN}
                        stroke="#94a3b8"
                        strokeWidth={isLit('actions') ? 2.2 : 1.6}
                        strokeLinecap="round"
                        animate={{ opacity: isFaded('actions') ? 0.25 : 0.85 }}
                        filter="url(#glow-sigpcb)"
                    />
                    <motion.path
                        d={PATH_OUT_HANDLER}
                        stroke="#34d399"
                        strokeWidth={isLit('actions') ? 2.4 : 1.8}
                        strokeLinecap="round"
                        animate={{ opacity: isFaded('actions') ? 0.25 : 0.9 }}
                        filter="url(#glow-sigpcb)"
                    />

                    {/* === FLOWING SIGNAL PARTICLES === */}
                    {/* 1. Alarm countdown signal firing */}
                    <motion.circle
                        r={2.5}
                        fill="#f59e0b"
                        filter="url(#glow-sigpcb)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${PATH_ALARM_FEED}")` }}
                    />

                    {/* 2. Direct signal through Mask to Action Table */}
                    <motion.circle
                        r={2.75}
                        fill="#38bdf8"
                        filter="url(#glow-sigpcb)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 0.9, 0.9, 0] }}
                        transition={{ duration: 2.1, repeat: Infinity, delay: 0.3, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${PATH_DIRECT}")` }}
                    />

                    {/* 3. Blocked signal redirected into Pending bitmap */}
                    <motion.circle
                        r={2.75}
                        fill="#fbbf24"
                        filter="url(#glow-sigpcb)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 1.9, repeat: Infinity, delay: 1.1, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${PATH_BLOCKED}")` }}
                    />

                    {/* 4. Release from pending into Action Table */}
                    <motion.circle
                        r={2.5}
                        fill="#c084fc"
                        filter="url(#glow-sigpcb)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 0.9, 0.9, 0] }}
                        transition={{ duration: 1.9, repeat: Infinity, delay: 1.8, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${PATH_UNBLOCK}")` }}
                    />

                    {/* 5. Execution pulse reaching Handler */}
                    <motion.circle
                        r={3}
                        fill="#34d399"
                        filter="url(#glow-sigpcb)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 1.4, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${PATH_OUT_HANDLER}")` }}
                    />

                    {/* === INTERACTIVE NODES === */}

                    {/* ORIGIN: SIGNAL INGRESS */}
                    <g transform="translate(55, 105)">
                        <circle cx="0" cy="0" r="14" fill="rgba(56, 189, 248, 0.08)" />
                        <circle cx="0" cy="0" r="2.5" fill="#38bdf8" />
                        <foreignObject x="-9" y="-26" width="18" height="18" className="pointer-events-none">
                            <div className="flex items-center justify-center">
                                <Zap className="w-4 h-4 text-sky-400" strokeWidth={2} />
                            </div>
                        </foreignObject>
                        <text x="0" y="24" textAnchor="middle" className="font-mono text-[9px] font-bold tracking-wider fill-sky-300 pointer-events-none">
                            SIGNAL
                        </text>
                    </g>

                    {/* 4. ALARM TIMER (alarm()) */}
                    <g
                        transform="translate(185, 180)"
                        onMouseEnter={() => setHovered('alarm')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer group"
                    >
                        <rect x="-26" y="-22" width="52" height="44" fill="transparent" />
                        <circle cx="0" cy="0" r={isLit('alarm') ? 14 : 11} fill="rgba(245, 158, 11, 0.12)" className="transition-all duration-200" />
                        <circle cx="0" cy="0" r="2.5" fill="#f59e0b" />
                        <foreignObject x="-9" y="-26" width="18" height="18" className="pointer-events-none">
                            <div className={`flex items-center justify-center transition-transform duration-200 ${isLit('alarm') ? 'scale-125' : ''}`}>
                                <Timer className="w-4 h-4 text-amber-400" strokeWidth={1.8} />
                            </div>
                        </foreignObject>
                        <text x="0" y="22" textAnchor="middle" className={`font-mono text-[8.5px] tracking-wider transition-all duration-200 pointer-events-none ${
                            isLit('alarm') ? 'font-bold fill-white' : 'font-medium fill-amber-300'
                        }`}>
                            alarm()
                        </text>
                    </g>

                    {/* 1. BLOCK MASK (Màscara de bloqueig) */}
                    <g
                        transform="translate(185, 105)"
                        onMouseEnter={() => setHovered('mask')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer group"
                    >
                        <rect x="-28" y="-24" width="56" height="48" fill="transparent" />
                        <circle cx="0" cy="0" r={isLit('mask') ? 15 : 12} fill="rgba(129, 140, 248, 0.12)" className="transition-all duration-200" />
                        <circle cx="0" cy="0" r="2.5" fill="#818cf8" />
                        <foreignObject x="-9" y="-28" width="18" height="18" className="pointer-events-none">
                            <div className={`flex items-center justify-center transition-transform duration-200 ${isLit('mask') ? 'scale-125' : ''}`}>
                                <Shield className="w-4.5 h-4.5 text-indigo-400" strokeWidth={1.8} />
                            </div>
                        </foreignObject>
                        <text x="0" y="24" textAnchor="middle" className={`font-mono text-[9px] tracking-wider transition-all duration-200 pointer-events-none ${
                            isLit('mask') ? 'font-bold fill-white' : 'font-medium fill-indigo-300'
                        }`}>
                            MASK
                        </text>
                    </g>

                    {/* 2. PENDING BITMAP (Bústia de pendents) */}
                    <g
                        transform="translate(340, 45)"
                        onMouseEnter={() => setHovered('pending')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer group"
                    >
                        <rect x="-30" y="-22" width="60" height="44" fill="transparent" />
                        <circle cx="0" cy="0" r={isLit('pending') ? 14 : 11} fill="rgba(251, 191, 36, 0.12)" className="transition-all duration-200" />
                        <circle cx="0" cy="0" r="2.5" fill="#fbbf24" />
                        <foreignObject x="-9" y="-26" width="18" height="18" className="pointer-events-none">
                            <div className={`flex items-center justify-center transition-transform duration-200 ${isLit('pending') ? 'scale-125' : ''}`}>
                                <Inbox className="w-4 h-4 text-amber-300" strokeWidth={1.8} />
                            </div>
                        </foreignObject>
                        <text x="0" y="22" textAnchor="middle" className={`font-mono text-[8.5px] tracking-wider transition-all duration-200 pointer-events-none ${
                            isLit('pending') ? 'font-bold fill-white' : 'font-medium fill-amber-300'
                        }`}>
                            PENDING
                        </text>
                    </g>

                    {/* 3. ACTION TABLE (Taula d'accions) */}
                    <g
                        transform="translate(485, 105)"
                        onMouseEnter={() => setHovered('actions')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer group"
                    >
                        <rect x="-28" y="-24" width="56" height="48" fill="transparent" />
                        <circle cx="0" cy="0" r={isLit('actions') ? 15 : 12} fill="rgba(192, 132, 252, 0.12)" className="transition-all duration-200" />
                        <circle cx="0" cy="0" r="2.5" fill="#c084fc" />
                        <foreignObject x="-9" y="-28" width="18" height="18" className="pointer-events-none">
                            <div className={`flex items-center justify-center transition-transform duration-200 ${isLit('actions') ? 'scale-125' : ''}`}>
                                <Sliders className="w-4.5 h-4.5 text-purple-400" strokeWidth={1.8} />
                            </div>
                        </foreignObject>
                        <text x="0" y="24" textAnchor="middle" className={`font-mono text-[9px] tracking-wider transition-all duration-200 pointer-events-none ${
                            isLit('actions') ? 'font-bold fill-white' : 'font-medium fill-purple-300'
                        }`}>
                            ACTIONS
                        </text>
                    </g>

                    {/* THREE OUTCOMES */}
                    {/* SIG_DFL */}
                    <g transform="translate(620, 65)">
                        <circle cx="0" cy="0" r="2" fill="#f43f5e" />
                        <foreignObject x="8" y="-9" width="16" height="16" className="pointer-events-none">
                            <Terminal className="w-3.5 h-3.5 text-rose-400" strokeWidth={1.75} />
                        </foreignObject>
                        <text x="28" y="3" textAnchor="start" className="font-mono text-[8.5px] tracking-wider font-semibold fill-rose-300 pointer-events-none">
                            SIG_DFL
                        </text>
                    </g>

                    {/* SIG_IGN */}
                    <g transform="translate(620, 105)">
                        <circle cx="0" cy="0" r="2" fill="#94a3b8" />
                        <foreignObject x="8" y="-9" width="16" height="16" className="pointer-events-none">
                            <Ban className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.75} />
                        </foreignObject>
                        <text x="28" y="3" textAnchor="start" className="font-mono text-[8.5px] tracking-wider font-semibold fill-slate-400 pointer-events-none">
                            SIG_IGN
                        </text>
                    </g>

                    {/* HANDLER */}
                    <g transform="translate(620, 145)">
                        <circle cx="0" cy="0" r="2" fill="#34d399" />
                        <foreignObject x="8" y="-9" width="16" height="16" className="pointer-events-none">
                            <Play className="w-3.5 h-3.5 text-emerald-400" strokeWidth={1.75} />
                        </foreignObject>
                        <text x="28" y="3" textAnchor="start" className="font-mono text-[8.5px] tracking-wider font-semibold fill-emerald-300 pointer-events-none">
                            HANDLER
                        </text>
                    </g>
                </svg>
            </div>
        </div>
    );
}
