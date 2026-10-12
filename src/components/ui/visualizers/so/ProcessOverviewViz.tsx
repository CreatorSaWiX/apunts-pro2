"use client";

import React, { useState } from 'react';
import { m as motion } from 'framer-motion';
import { GitFork, Zap, Clock, Shield, Hourglass, Terminal, Cpu } from 'lucide-react';

type SectionId = 'fork' | 'pcb' | 'signal' | 'alarm' | 'wait' | null;

interface InteractiveSection {
    id: SectionId;
    label: string;
    description: string;
    color: string;
}

const SECTIONS_INFO: Record<string, { label: string; desc: string; color: string }> = {
    pcb: {
        label: "PCB (Process Control Block)",
        desc: "La fitxa al Kernel amb el PID, registres de la CPU, memòria i taula de senyals.",
        color: "#a78bfa"
    },
    fork: {
        label: "fork() · Creació de procés",
        desc: "Clonació exacta: duplica la memòria i ramifica l'execució generant un nou PID fill.",
        color: "#38bdf8"
    },
    alarm: {
        label: "alarm() · Temporitzador",
        desc: "Programa un compte enrere al Kernel que enviarà un senyal SIGALRM en expirar.",
        color: "#fbbf24"
    },
    signal: {
        label: "Signals · Notificació asíncrona",
        desc: "Interrupció externa o entre processos (kill) que altera immediatament l'execució.",
        color: "#f43f5e"
    },
    wait: {
        label: "waitpid() · Sincronització",
        desc: "El pare espera que el fill acabi (exit), en recull l'estat i elimina el seu PCB.",
        color: "#34d399"
    }
};

// Paths
const PATH_PARENT_INIT = "M 70 70 L 175 70";
const PATH_FORK_BRANCH = "M 175 70 C 215 70, 225 150, 265 150";
const PATH_PARENT_WAIT = "M 175 70 L 535 70";
const PATH_CHILD_RUN   = "M 265 150 L 465 150";
const PATH_CHILD_REAP  = "M 465 150 C 505 150, 515 70, 535 70";
const PATH_PARENT_CONT = "M 535 70 L 620 70";

const PATH_ALARM_LOOP  = "M 315 70 C 315 26, 365 26, 365 70";
const PATH_SIGNAL_DOWN = "M 415 70 L 415 150";

export default function ProcessOverviewViz() {
    const [hovered, setHovered] = useState<SectionId>(null);

    const activeInfo = hovered ? SECTIONS_INFO[hovered] : null;

    const isFaded = (section: SectionId) => hovered !== null && hovered !== section;
    const isLit   = (section: SectionId) => hovered === section;

    return (
        <div className="w-full my-8 select-none flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl relative">
                <svg
                    viewBox="0 0 680 220"
                    className="w-full h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        {/* Glow filter */}
                        <filter id="glow-ov" x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* Gradients */}
                        <linearGradient id="grad-fork" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#38bdf8" />
                            <stop offset="100%" stopColor="#818cf8" />
                        </linearGradient>

                        <linearGradient id="grad-sync" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#818cf8" />
                            <stop offset="100%" stopColor="#34d399" />
                        </linearGradient>

                        <linearGradient id="grad-signal" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.3" />
                            <stop offset="50%" stopColor="#f43f5e" stopOpacity="1" />
                            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.3" />
                        </linearGradient>
                    </defs>

                    {/* BASE TRACKS (Faded blueprint) */}
                    <path d={PATH_PARENT_INIT} className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.5" />
                    <path d={PATH_FORK_BRANCH} className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.5" strokeDasharray="3 3" />
                    <path d={PATH_PARENT_WAIT} className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.5" />
                    <path d={PATH_CHILD_RUN}   className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.5" />
                    <path d={PATH_CHILD_REAP}  className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.5" strokeDasharray="3 3" />
                    <path d={PATH_PARENT_CONT} className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.5" />

                    <path d={PATH_ALARM_LOOP}  className="stroke-slate-300/30 dark:stroke-white/[0.06]" strokeWidth="1.2" strokeDasharray="2 3" />
                    <path d={PATH_SIGNAL_DOWN} className="stroke-slate-300/30 dark:stroke-white/[0.06]" strokeWidth="1.2" strokeDasharray="2 3" />

                    {/* 1. PARENT TRACK (CYAN) */}
                    <motion.path
                        d={PATH_PARENT_INIT}
                        stroke="#38bdf8"
                        strokeWidth={1.8}
                        strokeLinecap="round"
                        animate={{ opacity: isFaded('fork') && isFaded('pcb') ? 0.25 : 0.85 }}
                        filter="url(#glow-ov)"
                    />
                    <motion.path
                        d={PATH_PARENT_WAIT}
                        stroke="#38bdf8"
                        strokeWidth={isLit('wait') ? 2.2 : 1.6}
                        strokeLinecap="round"
                        strokeDasharray={isLit('wait') ? "none" : "4 4"}
                        animate={{ opacity: isFaded('wait') ? 0.25 : 0.7 }}
                        filter="url(#glow-ov)"
                    />
                    <motion.path
                        d={PATH_PARENT_CONT}
                        stroke="#38bdf8"
                        strokeWidth={1.8}
                        strokeLinecap="round"
                        animate={{ opacity: isFaded('wait') ? 0.25 : 0.85 }}
                        filter="url(#glow-ov)"
                    />

                    {/* 2. FORK BRANCH TRACK */}
                    <motion.path
                        d={PATH_FORK_BRANCH}
                        stroke="url(#grad-fork)"
                        strokeWidth={isLit('fork') ? 2.5 : 1.8}
                        strokeLinecap="round"
                        animate={{ opacity: isFaded('fork') ? 0.2 : 0.9 }}
                        filter="url(#glow-ov)"
                    />

                    {/* 3. CHILD TRACK (INDIGO) */}
                    <motion.path
                        d={PATH_CHILD_RUN}
                        stroke="#818cf8"
                        strokeWidth={isLit('fork') || isLit('signal') ? 2.2 : 1.8}
                        strokeLinecap="round"
                        animate={{ opacity: isFaded('fork') && isFaded('signal') && isFaded('wait') ? 0.25 : 0.85 }}
                        filter="url(#glow-ov)"
                    />

                    {/* 4. WAITPID REAP TRACK (GREEN / TEAL) */}
                    <motion.path
                        d={PATH_CHILD_REAP}
                        stroke="url(#grad-sync)"
                        strokeWidth={isLit('wait') ? 2.5 : 1.8}
                        strokeLinecap="round"
                        animate={{ opacity: isFaded('wait') ? 0.2 : 0.9 }}
                        filter="url(#glow-ov)"
                    />

                    {/* 5. ALARM LOOP (AMBER) */}
                    <motion.path
                        d={PATH_ALARM_LOOP}
                        stroke="#fbbf24"
                        strokeWidth={isLit('alarm') ? 2.2 : 1.4}
                        strokeLinecap="round"
                        strokeDasharray={isLit('alarm') ? "none" : "3 3"}
                        animate={{ opacity: isFaded('alarm') ? 0.2 : 0.8 }}
                        filter="url(#glow-ov)"
                    />

                    {/* 6. SIGNAL PATH (ROSE) */}
                    <motion.path
                        d={PATH_SIGNAL_DOWN}
                        stroke="#f43f5e"
                        strokeWidth={isLit('signal') ? 2.2 : 1.4}
                        strokeLinecap="round"
                        strokeDasharray={isLit('signal') ? "none" : "3 3"}
                        animate={{ opacity: isFaded('signal') ? 0.2 : 0.8 }}
                        filter="url(#glow-ov)"
                    />

                    {/* === FLOWING PARTICLES === */}
                    {/* Parent flow */}
                    <motion.circle
                        r={2.5}
                        fill="#38bdf8"
                        filter="url(#glow-ov)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 0.9, 0.9, 0] }}
                        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${PATH_PARENT_INIT}")` }}
                    />

                    {/* Fork branch particle */}
                    <motion.circle
                        r={3}
                        fill="#818cf8"
                        filter="url(#glow-ov)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.8, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${PATH_FORK_BRANCH}")` }}
                    />

                    {/* Child run particle */}
                    <motion.circle
                        r={2.5}
                        fill="#818cf8"
                        filter="url(#glow-ov)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 0.9, 0.9, 0] }}
                        transition={{ duration: 2.2, repeat: Infinity, delay: 1.2, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${PATH_CHILD_RUN}")` }}
                    />

                    {/* Waitpid sync particle */}
                    <motion.circle
                        r={3}
                        fill="#34d399"
                        filter="url(#glow-ov)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity, delay: 1.8, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${PATH_CHILD_REAP}")` }}
                    />

                    {/* Alarm loop particle */}
                    <motion.circle
                        r={2.2}
                        fill="#fbbf24"
                        filter="url(#glow-ov)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 0.9, 0.9, 0] }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
                        style={{ offsetPath: `path("${PATH_ALARM_LOOP}")` }}
                    />

                    {/* Signal pulse particle */}
                    <motion.circle
                        r={2.5}
                        fill="#f43f5e"
                        filter="url(#glow-ov)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: 0.6, ease: "easeIn" }}
                        style={{ offsetPath: `path("${PATH_SIGNAL_DOWN}")` }}
                    />

                    {/* === INTERACTIVE NODES === */}

                    {/* NODE 1: PARENT PROCESS ORIGIN */}
                    <g transform="translate(70, 70)">
                        <circle cx="0" cy="0" r="16" fill="rgba(56, 189, 248, 0.08)" />
                        <circle cx="0" cy="0" r="3" fill="#38bdf8" />
                        <foreignObject x="-10" y="-30" width="20" height="20" className="pointer-events-none">
                            <Terminal className="w-5 h-5 text-sky-400" strokeWidth={1.75} />
                        </foreignObject>
                        <text x="0" y="24" textAnchor="middle" className="font-mono text-[9px] font-semibold tracking-wider fill-sky-400 pointer-events-none">
                            PARENT
                        </text>
                    </g>

                    {/* NODE 2: PCB CAPSULE (Hoverable) */}
                    <g
                        transform="translate(105, 34)"
                        onMouseEnter={() => setHovered('pcb')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer"
                    >
                        <rect x="-30" y="-14" width="60" height="28" fill="transparent" />
                        <motion.rect
                            x="-24"
                            y="-11"
                            width="48"
                            height="22"
                            rx="11"
                            fill="#0b0f19"
                            stroke="#a78bfa"
                            strokeWidth={isLit('pcb') ? 1.75 : 1}
                            animate={{
                                opacity: isFaded('pcb') ? 0.35 : 1,
                                scale: isLit('pcb') ? 1.08 : 1
                            }}
                            transition={{ duration: 0.2 }}
                            filter={isLit('pcb') ? "url(#glow-ov)" : undefined}
                        />
                        <foreignObject x="-18" y="-7" width="14" height="14" className="pointer-events-none">
                            <Shield className="w-3.5 h-3.5 text-purple-400" strokeWidth={1.8} />
                        </foreignObject>
                        <text x="5" y="4" textAnchor="middle" className="font-mono text-[8.5px] font-bold tracking-widest fill-purple-300 pointer-events-none">
                            PCB
                        </text>
                    </g>

                    {/* NODE 3: FORK (Hoverable) */}
                    <g
                        transform="translate(175, 70)"
                        onMouseEnter={() => setHovered('fork')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer"
                    >
                        <rect x="-24" y="-24" width="48" height="48" fill="transparent" />
                        <circle cx="0" cy="0" r={isLit('fork') ? 14 : 11} fill="rgba(56, 189, 248, 0.12)" className="transition-all duration-200" />
                        <circle cx="0" cy="0" r="2.5" fill="#38bdf8" />
                        <foreignObject x="-9" y="-28" width="18" height="18" className="pointer-events-none">
                            <div className={`flex items-center justify-center transition-transform duration-200 ${isLit('fork') ? 'scale-125' : ''}`}>
                                <GitFork className="w-4.5 h-4.5 text-sky-400" strokeWidth={1.8} />
                            </div>
                        </foreignObject>
                        <text x="0" y="24" textAnchor="middle" className={`font-mono text-[9px] tracking-wider transition-all duration-200 pointer-events-none ${
                            isLit('fork') ? 'font-bold fill-white' : 'font-medium fill-sky-300'
                        }`}>
                            fork()
                        </text>
                    </g>

                    {/* NODE 4: CHILD PROCESS ORIGIN */}
                    <g transform="translate(265, 150)">
                        <circle cx="0" cy="0" r="15" fill="rgba(129, 140, 248, 0.1)" />
                        <circle cx="0" cy="0" r="3" fill="#818cf8" />
                        <foreignObject x="-10" y="12" width="20" height="20" className="pointer-events-none">
                            <Terminal className="w-5 h-5 text-indigo-400" strokeWidth={1.75} />
                        </foreignObject>
                        <text x="0" y="40" textAnchor="middle" className="font-mono text-[9px] font-semibold tracking-wider fill-indigo-400 pointer-events-none">
                            CHILD
                        </text>

                        {/* Child's PCB */}
                        <g
                            transform="translate(48, 0)"
                            onMouseEnter={() => setHovered('pcb')}
                            onMouseLeave={() => setHovered(null)}
                            className="cursor-pointer"
                        >
                            <rect x="-24" y="-12" width="48" height="24" fill="transparent" />
                            <rect
                                x="-20"
                                y="-9"
                                width="40"
                                height="18"
                                rx="9"
                                fill="#0b0f19"
                                stroke="#a78bfa"
                                strokeWidth={isLit('pcb') ? 1.5 : 0.8}
                                className={`transition-opacity duration-200 ${isFaded('pcb') ? 'opacity-30' : 'opacity-80'}`}
                            />
                            <text x="0" y="3.5" textAnchor="middle" className="font-mono text-[7.5px] font-semibold tracking-wider fill-purple-300 pointer-events-none">
                                PCB'
                            </text>
                        </g>
                    </g>

                    {/* NODE 5: ALARM TIMER (Hoverable) */}
                    <g
                        transform="translate(340, 28)"
                        onMouseEnter={() => setHovered('alarm')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer"
                    >
                        <rect x="-24" y="-16" width="48" height="36" fill="transparent" />
                        <motion.div
                            animate={{ scale: isLit('alarm') ? 1.2 : 1 }}
                            transition={{ duration: 0.2 }}
                        />
                        <foreignObject x="-10" y="-10" width="20" height="20" className="pointer-events-none">
                            <div className={`flex items-center justify-center transition-all duration-200 ${
                                isLit('alarm') ? 'scale-120 drop-shadow-[0_0_8px_#fbbf24]' : isFaded('alarm') ? 'opacity-30' : 'opacity-85'
                            }`}>
                                <Clock className="w-4.5 h-4.5 text-amber-400" strokeWidth={1.75} />
                            </div>
                        </foreignObject>
                        <text x="0" y="20" textAnchor="middle" className={`font-mono text-[8.5px] tracking-wider transition-all duration-200 pointer-events-none ${
                            isLit('alarm') ? 'font-bold fill-white' : isFaded('alarm') ? 'opacity-30 fill-amber-300' : 'fill-amber-300'
                        }`}>
                            alarm()
                        </text>
                    </g>

                    {/* NODE 6: SIGNALS (Hoverable) */}
                    <g
                        transform="translate(415, 110)"
                        onMouseEnter={() => setHovered('signal')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer"
                    >
                        <rect x="-24" y="-24" width="48" height="48" fill="transparent" />
                        <foreignObject x="-10" y="-10" width="20" height="20" className="pointer-events-none">
                            <div className={`flex items-center justify-center transition-all duration-200 ${
                                isLit('signal') ? 'scale-125 drop-shadow-[0_0_10px_#f43f5e]' : isFaded('signal') ? 'opacity-30' : 'opacity-85'
                            }`}>
                                <Zap className="w-5 h-5 text-rose-400" strokeWidth={1.8} />
                            </div>
                        </foreignObject>
                        <text x="0" y="22" textAnchor="middle" className={`font-mono text-[8.5px] tracking-wider transition-all duration-200 pointer-events-none ${
                            isLit('signal') ? 'font-bold fill-white' : isFaded('signal') ? 'opacity-30 fill-rose-300' : 'fill-rose-300'
                        }`}>
                            signals
                        </text>
                    </g>

                    {/* NODE 7: WAITPID / EXIT REAP (Hoverable) */}
                    <g
                        transform="translate(535, 70)"
                        onMouseEnter={() => setHovered('wait')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer"
                    >
                        <rect x="-28" y="-28" width="56" height="56" fill="transparent" />
                        <circle cx="0" cy="0" r={isLit('wait') ? 14 : 11} fill="rgba(52, 211, 153, 0.12)" className="transition-all duration-200" />
                        <circle cx="0" cy="0" r="2.5" fill="#34d399" />
                        <foreignObject x="-9" y="-28" width="18" height="18" className="pointer-events-none">
                            <div className={`flex items-center justify-center transition-transform duration-200 ${isLit('wait') ? 'scale-125' : ''}`}>
                                <Hourglass className="w-4.5 h-4.5 text-emerald-400" strokeWidth={1.8} />
                            </div>
                        </foreignObject>
                        <text x="0" y="24" textAnchor="middle" className={`font-mono text-[9px] tracking-wider transition-all duration-200 pointer-events-none ${
                            isLit('wait') ? 'font-bold fill-white' : 'font-medium fill-emerald-300'
                        }`}>
                            waitpid()
                        </text>
                    </g>

                    {/* Continuation arrow */}
                    <circle cx="620" cy="70" r="2" fill="#38bdf8" opacity="0.6" />
                </svg>

                {/* BOTTOM CAPTION BAR (Minimalist status pill) */}
                <div className="w-full flex justify-center mt-2 px-4 min-h-[34px]">
                    {activeInfo ? (
                        <div
                            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono transition-all duration-300 bg-slate-900/80 border border-white/10 shadow-lg backdrop-blur-sm"
                            style={{ borderColor: `${activeInfo.color}40` }}
                        >
                            <span className="font-semibold" style={{ color: activeInfo.color }}>
                                {activeInfo.label}:
                            </span>
                            <span className="text-slate-300 text-[11px]">
                                {activeInfo.desc}
                            </span>
                        </div>
                    ) : (
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono text-slate-500 bg-slate-900/40 border border-white/5 transition-opacity duration-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                            <span>Explora els nodes: fork, PCB, alarmes, senyals i sincronització</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
