"use client";

import React, { useState } from 'react';
import { m as motion } from 'framer-motion';

type AlgoMode = 'fifo' | 'lru' | 'clock';

interface FrameSlot {
    id: string;
    page: string;
    tag: string;
    isVictim: boolean;
    y: number;
}

const SLOTS_BY_MODE: Record<AlgoMode, FrameSlot[]> = {
    fifo: [
        { id: 'M0', page: 'P4', tag: 't = 1', isVictim: true,  y: 16 },
        { id: 'M1', page: 'P7', tag: 't = 2', isVictim: false, y: 54 },
        { id: 'M2', page: 'P2', tag: 't = 3', isVictim: false, y: 92 },
    ],
    lru: [
        { id: 'M0', page: 'P4', tag: '1 ms',  isVictim: false, y: 16 },
        { id: 'M1', page: 'P7', tag: '9 ms',  isVictim: true,  y: 54 },
        { id: 'M2', page: 'P2', tag: '3 ms',  isVictim: false, y: 92 },
    ],
    clock: [
        { id: 'M0', page: 'P4', tag: 'ref 1→0', isVictim: false, y: 16 },
        { id: 'M1', page: 'P7', tag: 'ref 1→0', isVictim: false, y: 54 },
        { id: 'M2', page: 'P2', tag: 'ref = 0', isVictim: true,  y: 92 },
    ],
};

export default function PageReplaceViz() {
    const [algo, setAlgo] = useState<AlgoMode>('fifo');

    const slots = SLOTS_BY_MODE[algo];
    const victim = slots.find((s) => s.isVictim) ?? slots[0];
    const victimCenterY = victim.y + 14;

    const PATH_IN  = `M 105 68 C 150 68, 150 ${victimCenterY}, 195 ${victimCenterY}`;
    const PATH_OUT = `M 345 ${victimCenterY} C 390 ${victimCenterY}, 390 68, 435 68`;

    return (
        <div className="w-full my-6 select-none flex flex-col items-center justify-center not-prose">
            <div className="w-full max-w-lg relative flex flex-col items-center">

                {/* Minimalist Switcher */}
                <div className="flex items-center gap-1 p-0.5 rounded-full bg-slate-900/60 border border-white/5 mb-3">
                    {([
                        { id: 'fifo', label: 'FIFO' },
                        { id: 'lru', label: 'LRU' },
                        { id: 'clock', label: 'Rellotge' },
                    ] as const).map((item) => {
                        const isActive = algo === item.id;
                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setAlgo(item.id)}
                                className={`px-3 py-1 rounded-full font-mono text-[10px] transition-all duration-200 cursor-pointer ${
                                    isActive
                                        ? 'bg-white/10 text-white font-bold border border-white/15 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-300 border border-transparent'
                                }`}
                            >
                                {item.label}
                            </button>
                        );
                    })}
                </div>

                <svg
                    viewBox="0 0 540 135"
                    className="w-full h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter id="glow-rep" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* INCOMING & OUTGOING TRAJECTORIES */}
                    <path d={PATH_IN}  className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" />
                    <path d={PATH_OUT} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" strokeDasharray="3 3" />

                    <path d={PATH_IN}  stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" filter="url(#glow-rep)" />
                    <path d={PATH_OUT} stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" filter="url(#glow-rep)" />

                    {/* KINETIC PARTICLES */}
                    <motion.circle
                        key={`in-${algo}`}
                        r={2.5}
                        fill="#38bdf8"
                        filter="url(#glow-rep)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 2.0, repeat: Infinity, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${PATH_IN}")` }}
                    />
                    <motion.circle
                        key={`out-${algo}`}
                        r={2.5}
                        fill="#f43f5e"
                        filter="url(#glow-rep)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 2.0, repeat: Infinity, delay: 0.7, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${PATH_OUT}")` }}
                    />

                    {/* CLOCK HAND SWEEP INDICATOR (Clock / Second Chance mode) */}
                    {algo === 'clock' && (
                        <g>
                            <path
                                d="M 183 30 L 183 106"
                                stroke="#fbbf24"
                                strokeWidth="1.2"
                                strokeDasharray="2 2"
                                opacity="0.65"
                            />
                            <circle cx="183" cy="30" r="2" fill="#fbbf24" opacity="0.5" />
                            <circle cx="183" cy="68" r="2" fill="#fbbf24" opacity="0.5" />
                            <circle cx="183" cy="106" r="3" fill="#fbbf24" filter="url(#glow-rep)" />
                        </g>
                    )}

                    {/* LEFT NODE: INCOMING PAGE */}
                    <g>
                        <rect
                            x="30"
                            y="52"
                            width="75"
                            height="32"
                            rx="8"
                            fill="#0b0f19"
                            stroke="#38bdf8"
                            strokeWidth="1.2"
                            strokeOpacity="0.65"
                        />
                        <text
                            x="67"
                            y="68"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[10px] font-bold fill-sky-300 tracking-wider pointer-events-none"
                        >
                            P nova
                        </text>
                        <circle cx="105" cy="68" r="2.5" fill="#38bdf8" />
                    </g>

                    {/* CENTER: 3 RAM FRAMES */}
                    {slots.map((slot) => {
                        const strokeColor = slot.isVictim ? '#f43f5e' : '#64748b';
                        return (
                            <g key={slot.id}>
                                <rect
                                    x="195"
                                    y={slot.y}
                                    width="150"
                                    height="28"
                                    rx="7"
                                    fill="#0b0f19"
                                    stroke={strokeColor}
                                    strokeWidth={slot.isVictim ? 1.6 : 1}
                                    strokeOpacity={slot.isVictim ? 0.9 : 0.35}
                                    filter={slot.isVictim ? "url(#glow-rep)" : undefined}
                                />
                                <text
                                    x="210"
                                    y={slot.y + 14}
                                    dominantBaseline="central"
                                    className={`font-mono text-[9.5px] font-bold tracking-wider pointer-events-none ${
                                        slot.isVictim ? 'fill-rose-300' : 'fill-slate-300'
                                    }`}
                                >
                                    {slot.id} · {slot.page}
                                </text>
                                <text
                                    x="332"
                                    y={slot.y + 14}
                                    textAnchor="end"
                                    dominantBaseline="central"
                                    className={`font-mono text-[8px] font-semibold tracking-wider pointer-events-none ${
                                        slot.isVictim
                                            ? 'fill-rose-400'
                                            : algo === 'clock'
                                              ? 'fill-amber-400/85'
                                              : 'fill-slate-500'
                                    }`}
                                >
                                    {slot.tag}
                                </text>
                            </g>
                        );
                    })}

                    {/* RIGHT NODE: SWAP / VICTIM EVICTION */}
                    <g>
                        <rect
                            x="435"
                            y="52"
                            width="75"
                            height="32"
                            rx="8"
                            fill="#0b0f19"
                            stroke="#f43f5e"
                            strokeWidth="1.2"
                            strokeOpacity="0.55"
                        />
                        <text
                            x="472"
                            y="68"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[10px] font-bold fill-rose-300 tracking-wider pointer-events-none"
                        >
                            Víctima
                        </text>
                        <circle cx="435" cy="68" r="2.5" fill="#f43f5e" />
                    </g>
                </svg>
            </div>
        </div>
    );
}
