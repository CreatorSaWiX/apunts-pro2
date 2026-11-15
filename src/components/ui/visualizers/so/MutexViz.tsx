"use client";

import React, { useState } from 'react';
import { m as motion } from 'framer-motion';
import { Lock, Unlock } from 'lucide-react';

type MutexMode = 'mutex' | 'deadlock';

interface ThreadNode {
    id: 'T1' | 'T2';
    y: number;
    stroke: string;
    pinColor: string;
    textClass: string;
}

const THREADS: ThreadNode[] = [
    { id: 'T1', y: 52, stroke: '#38bdf8', pinColor: '#38bdf8', textClass: 'fill-sky-300' },
    { id: 'T2', y: 114, stroke: '#818cf8', pinColor: '#818cf8', textClass: 'fill-indigo-300' },
];

const PATH_T1_IN = 'M 89 52 C 124 52, 124 76, 158 76';
const PATH_T2_IN = 'M 89 114 C 124 114, 124 90, 158 90';
const PATH_GATE_TO_MID = 'M 232 83 L 345 83';
const PATH_MID_TO_UNLOCK = 'M 345 83 L 459 83';
const PATH_CR_FULL = 'M 232 83 L 459 83';

const PATH_T1_PASS = 'M 89 52 C 124 52, 124 76, 158 76 L 232 83 L 459 83';
const PATH_T1_CRASH = 'M 89 52 C 124 52, 124 76, 158 76 L 232 83 L 345 83';

export default function MutexViz() {
    const [mode, setMode] = useState<MutexMode>('mutex');
    const isMutex = mode === 'mutex';

    return (
        <div className="w-full my-6 select-none flex flex-col items-center justify-center not-prose">
            <div className="w-full max-w-xl relative flex flex-col items-center">

                {/* Minimalist 2-state Switcher */}
                <div className="flex items-center gap-1 p-0.5 rounded-full bg-slate-900/60 border border-white/5 mb-3">
                    {([
                        {
                            id: 'mutex',
                            label: 'Mutex',
                            activeClass: 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold shadow-sm',
                            dotClass: 'bg-emerald-400',
                        },
                        {
                            id: 'deadlock',
                            label: 'Deadlock',
                            activeClass: 'bg-rose-500/20 text-rose-300 border border-rose-400/40 font-bold shadow-sm',
                            dotClass: 'bg-rose-400',
                        },
                    ] as const).map((item) => {
                        const isActive = mode === item.id;
                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setMode(item.id)}
                                className={`px-3 py-1 rounded-full font-mono text-[10px] transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                                    isActive
                                        ? item.activeClass
                                        : 'text-slate-500 hover:text-slate-300 border border-transparent'
                                }`}
                            >
                                <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                        isActive ? item.dotClass : 'bg-slate-600'
                                    }`}
                                />
                                {item.label}
                            </button>
                        );
                    })}
                </div>

                <svg
                    viewBox="0 0 560 165"
                    className="w-full h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter id="glow-mutex" filterUnits="userSpaceOnUse" x="-20" y="-20" width="600" height="205">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* BASE BLUEPRINT TRACKS */}
                    <path d={PATH_T1_IN} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" />
                    <path d={PATH_T2_IN} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" strokeDasharray="3 3" />
                    <path
                        d={PATH_CR_FULL}
                        className="stroke-slate-300/25 dark:stroke-white/[0.08]"
                        strokeWidth="1.2"
                        strokeDasharray={isMutex ? undefined : '3 3'}
                    />

                    {/* CRITICAL REGION ZONE BOX (x=345, y=83, 140x72) */}
                    <g>
                        <rect
                            x="275"
                            y="47"
                            width="140"
                            height="72"
                            rx="10"
                            fill={isMutex ? 'rgba(52, 211, 153, 0.03)' : 'rgba(244, 63, 94, 0.04)'}
                            stroke={isMutex ? '#34d399' : '#f43f5e'}
                            strokeOpacity={isMutex ? 0.35 : 0.45}
                            strokeWidth="1.2"
                            strokeDasharray="4 4"
                            className="transition-colors duration-200"
                        />
                        <text
                            x="345"
                            y="56"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className={`font-mono text-[8.5px] font-semibold tracking-wider pointer-events-none transition-colors duration-200 ${
                                isMutex ? 'fill-emerald-400/80' : 'fill-rose-400/80'
                            }`}
                        >
                            Regió crítica
                        </text>
                    </g>

                    {/* ACTIVE TRAJECTORIES */}
                    <path
                        d={PATH_T1_IN}
                        stroke="#38bdf8"
                        strokeWidth={1.6}
                        strokeLinecap="round"
                        filter="url(#glow-mutex)"
                    />
                    <path
                        d={PATH_T2_IN}
                        stroke="#fbbf24"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeDasharray="3 3"
                        opacity={0.85}
                        filter="url(#glow-mutex)"
                    />

                    {isMutex ? (
                        <motion.path
                            key="corridor-mutex"
                            d={PATH_CR_FULL}
                            stroke="#34d399"
                            strokeWidth={1.8}
                            strokeLinecap="round"
                            filter="url(#glow-mutex)"
                            initial={{ opacity: 0.35 }}
                            animate={{ opacity: 0.95 }}
                            transition={{ duration: 0.2 }}
                        />
                    ) : (
                        <>
                            <motion.path
                                key="corridor-deadlock"
                                d={PATH_GATE_TO_MID}
                                stroke="#f43f5e"
                                strokeWidth={1.8}
                                strokeLinecap="round"
                                filter="url(#glow-mutex)"
                                initial={{ opacity: 0.35 }}
                                animate={{ opacity: 0.95 }}
                                transition={{ duration: 0.2 }}
                            />
                            <path
                                d={PATH_MID_TO_UNLOCK}
                                stroke="#f43f5e"
                                strokeWidth={1.2}
                                strokeDasharray="3 3"
                                opacity={0.15}
                            />
                        </>
                    )}

                    {/* KINETIC PARTICLES */}
                    {isMutex ? (
                        <>
                            <motion.circle
                                key="particle-t1-pass"
                                r={2.8}
                                fill="#38bdf8"
                                filter="url(#glow-mutex)"
                                initial={{ offsetDistance: '0%', opacity: 0 }}
                                animate={{ offsetDistance: '100%', opacity: [0, 1, 1, 0] }}
                                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                                style={{ offsetPath: `path("${PATH_T1_PASS}")` }}
                            />
                            <motion.circle
                                key="particle-t2-wait"
                                r={2.5}
                                fill="#fbbf24"
                                filter="url(#glow-mutex)"
                                initial={{ offsetDistance: '0%', opacity: 0 }}
                                animate={{
                                    offsetDistance: ['0%', '84%', '84%', '84%'],
                                    opacity: [0, 1, 0.9, 0],
                                }}
                                transition={{
                                    duration: 2.2,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                    times: [0, 0.42, 0.85, 1],
                                }}
                                style={{ offsetPath: `path("${PATH_T2_IN}")` }}
                            />
                        </>
                    ) : (
                        <>
                            <motion.circle
                                key="particle-t1-crash"
                                r={2.8}
                                fill="#38bdf8"
                                filter="url(#glow-mutex)"
                                initial={{ offsetDistance: '0%', opacity: 0 }}
                                animate={{ offsetDistance: '100%', opacity: [0, 1, 1, 0] }}
                                transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
                                style={{ offsetPath: `path("${PATH_T1_CRASH}")` }}
                            />
                            {/* T2 permanently blocked right outside the locked gate */}
                            <g>
                                <motion.circle
                                    cx={145}
                                    cy={91.5}
                                    r={3.5}
                                    stroke="#f43f5e"
                                    strokeWidth={1.2}
                                    initial={{ r: 3.5, opacity: 0.85 }}
                                    animate={{ r: 10, opacity: 0 }}
                                    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                                />
                                <circle
                                    cx={145}
                                    cy={91.5}
                                    r={3}
                                    fill="#fbbf24"
                                    filter="url(#glow-mutex)"
                                />
                            </g>
                        </>
                    )}

                    {/* LEFT COLUMN: T1 & T2 THREAD CAPSULES (x=65) */}
                    {THREADS.map((thread) => (
                        <g key={thread.id}>
                            <rect
                                x="41"
                                y={thread.y - 14}
                                width="48"
                                height="28"
                                rx="7"
                                fill="#0b0f19"
                                stroke={thread.stroke}
                                strokeWidth="1.4"
                                strokeOpacity="0.85"
                            />
                            <text
                                x="65"
                                y={thread.y}
                                textAnchor="middle"
                                dominantBaseline="central"
                                className={`font-mono text-[10px] font-bold tracking-wider pointer-events-none ${thread.textClass}`}
                            >
                                {thread.id}
                            </text>
                            <circle cx="89" cy={thread.y} r="2.5" fill={thread.pinColor} />
                        </g>
                    ))}

                    {/* CENTER-LEFT GATE: MUTEX (x=195, y=83, 74x36) */}
                    <g transform="translate(195, 83)">
                        <rect
                            x="-37"
                            y="-18"
                            width="74"
                            height="36"
                            rx="8"
                            fill="#0b0f19"
                            stroke={isMutex ? '#34d399' : '#f43f5e'}
                            strokeWidth={isMutex ? 1.5 : 1.8}
                            strokeOpacity={isMutex ? 0.85 : 0.95}
                            filter="url(#glow-mutex)"
                            className="transition-colors duration-200"
                        />
                        <foreignObject x="-35" y="-16" width="70" height="32" className="pointer-events-none">
                            <div className="w-full h-full flex items-center justify-center gap-1.5">
                                <Lock
                                    className={`w-3.5 h-3.5 shrink-0 transition-colors duration-200 ${
                                        isMutex ? 'text-emerald-400' : 'text-rose-400'
                                    }`}
                                    strokeWidth={2}
                                />
                                <span
                                    className={`font-mono text-[9.5px] font-bold tracking-wider transition-colors duration-200 ${
                                        isMutex ? 'text-emerald-300' : 'text-rose-300'
                                    }`}
                                >
                                    mutex
                                </span>
                            </div>
                        </foreignObject>
                        <circle cx="-37" cy="-7" r="2.3" fill="#38bdf8" />
                        <circle cx="-37" cy="7" r="2.3" fill={isMutex ? '#fbbf24' : '#f43f5e'} />
                        <circle cx="37" cy="0" r="2.5" fill={isMutex ? '#34d399' : '#f43f5e'} />
                    </g>

                    {/* DEADLOCK NODE: pthread_exit() INSIDE CRITICAL REGION (x=345, y=83) */}
                    {!isMutex && (
                        <g transform="translate(345, 83)">
                            <motion.circle
                                cx={0}
                                cy={0}
                                r={10}
                                stroke="#f43f5e"
                                strokeWidth={1.2}
                                initial={{ r: 10, opacity: 0.55 }}
                                animate={{ r: 17, opacity: 0 }}
                                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                            />
                            <circle
                                cx={0}
                                cy={0}
                                r={10}
                                fill="#0b0f19"
                                stroke="#f43f5e"
                                strokeWidth={1.6}
                                filter="url(#glow-mutex)"
                            />
                            <path
                                d="M -3.5 -3.5 L 3.5 3.5 M 3.5 -3.5 L -3.5 3.5"
                                stroke="#f43f5e"
                                strokeWidth={1.8}
                                strokeLinecap="round"
                            />
                            <text
                                x={0}
                                y={22}
                                textAnchor="middle"
                                dominantBaseline="central"
                                className="font-mono text-[8.5px] font-semibold fill-rose-400 tracking-wide pointer-events-none"
                            >
                                pthread_exit()
                            </text>
                        </g>
                    )}

                    {/* RIGHT EXIT: UNLOCK NODE (x=495, y=83) */}
                    <g
                        transform="translate(495, 83)"
                        className={`transition-opacity duration-200 ${isMutex ? 'opacity-100' : 'opacity-20'}`}
                    >
                        <rect
                            x="-36"
                            y="-15"
                            width="72"
                            height="30"
                            rx="8"
                            fill="#0b0f19"
                            stroke={isMutex ? '#34d399' : '#64748b'}
                            strokeWidth={isMutex ? 1.4 : 1.1}
                            strokeOpacity={isMutex ? 0.8 : 0.45}
                            filter={isMutex ? 'url(#glow-mutex)' : undefined}
                        />
                        <foreignObject x="-34" y="-14" width="68" height="28" className="pointer-events-none">
                            <div className="w-full h-full flex items-center justify-center gap-1.5">
                                <Unlock
                                    className={`w-3 h-3 shrink-0 ${
                                        isMutex ? 'text-emerald-400' : 'text-slate-500'
                                    }`}
                                    strokeWidth={2}
                                />
                                <span
                                    className={`font-mono text-[9.5px] font-bold tracking-wider ${
                                        isMutex ? 'text-emerald-300' : 'text-slate-500'
                                    }`}
                                >
                                    unlock
                                </span>
                            </div>
                        </foreignObject>
                        <circle cx="-36" cy="0" r="2.5" fill={isMutex ? '#34d399' : '#64748b'} />
                    </g>
                </svg>
            </div>
        </div>
    );
}
