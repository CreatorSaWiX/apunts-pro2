"use client";

import React, { useState } from 'react';
import { m as motion } from 'framer-motion';

type TraceMode = 'race' | 'safe';

export default function RaceConditionViz() {
    const [mode, setMode] = useState<TraceMode>('race');
    const isRace = mode === 'race';

    const pathT1In = "M 94 48 C 155 48, 156 74, 217 74";
    const pathT2In = "M 94 118 C 155 118, 156 92, 217 92";

    const pathOutT1Safe = "M 333 74 C 383 74, 383 48, 433 48";
    const pathOutT1Race = "M 333 74 C 383 74, 383 44, 433 44";

    const pathOutT2Safe = "M 333 92 C 383 92, 383 118, 433 118";
    const pathOutT2Race = "M 333 92 C 383 92, 383 52, 433 52";

    return (
        <div className="w-full my-6 select-none flex flex-col items-center justify-center not-prose">
            <div className="w-full max-w-xl relative flex flex-col items-center">

                {/* Minimalist Switcher */}
                <div className="flex items-center gap-1 p-0.5 rounded-full bg-slate-900/60 border border-white/5 mb-3">
                    <button
                        type="button"
                        onClick={() => setMode('race')}
                        className={`px-3 py-1 rounded-full font-mono text-[10px] transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                            isRace
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-400/40 font-bold shadow-sm'
                                : 'text-slate-500 hover:text-slate-300 border border-transparent'
                        }`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${isRace ? 'bg-rose-400' : 'bg-slate-600'}`} />
                        Race Condition
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('safe')}
                        className={`px-3 py-1 rounded-full font-mono text-[10px] transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                            !isRace
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold shadow-sm'
                                : 'text-slate-500 hover:text-slate-300 border border-transparent'
                        }`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${!isRace ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                        Traça segura
                    </button>
                </div>

                <svg
                    viewBox="0 0 560 165"
                    className="w-full h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter id="glow-race" filterUnits="userSpaceOnUse" x="-20" y="-20" width="600" height="205">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <linearGradient id="grad-t1-in-safe" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#38bdf8" />
                            <stop offset="100%" stopColor="#34d399" />
                        </linearGradient>
                        <linearGradient id="grad-t2-in-safe" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#818cf8" />
                            <stop offset="100%" stopColor="#34d399" />
                        </linearGradient>

                        <linearGradient id="grad-t1-in-race" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#38bdf8" />
                            <stop offset="100%" stopColor="#f43f5e" />
                        </linearGradient>
                        <linearGradient id="grad-t2-in-race" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#818cf8" />
                            <stop offset="100%" stopColor="#f43f5e" />
                        </linearGradient>

                        <linearGradient id="grad-out-t1-safe" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#34d399" />
                            <stop offset="100%" stopColor="#38bdf8" />
                        </linearGradient>
                        <linearGradient id="grad-out-t2-safe" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#34d399" />
                            <stop offset="100%" stopColor="#818cf8" />
                        </linearGradient>

                        <linearGradient id="grad-out-race" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#f43f5e" />
                            <stop offset="100%" stopColor="#fbbf24" />
                        </linearGradient>
                    </defs>

                    {/* BASE BLUEPRINT TRACKS */}
                    <path d={pathT1In} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" />
                    <path d={pathT2In} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" />
                    <path
                        d={isRace ? pathOutT1Race : pathOutT1Safe}
                        className="stroke-slate-300/25 dark:stroke-white/[0.08]"
                        strokeWidth="1.2"
                    />
                    <path
                        d={pathOutT2Safe}
                        className="stroke-slate-300/25 dark:stroke-white/[0.08]"
                        strokeWidth="1.2"
                        strokeDasharray={isRace ? "3 3" : "none"}
                    />

                    {/* ACTIVE INCOMING PATHS */}
                    <path
                        d={pathT1In}
                        stroke={isRace ? "url(#grad-t1-in-race)" : "url(#grad-t1-in-safe)"}
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        filter="url(#glow-race)"
                    />
                    <path
                        d={pathT2In}
                        stroke={isRace ? "url(#grad-t2-in-race)" : "url(#grad-t2-in-safe)"}
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        filter="url(#glow-race)"
                    />

                    {/* ACTIVE OUTGOING: T1 -> tasca_1() */}
                    <path
                        d={isRace ? pathOutT1Race : pathOutT1Safe}
                        stroke={isRace ? "url(#grad-out-race)" : "url(#grad-out-t1-safe)"}
                        strokeWidth={isRace ? 2 : 1.8}
                        strokeLinecap="round"
                        filter="url(#glow-race)"
                    />

                    {/* ACTIVE OUTGOING: T2 -> tasca_2() (safe) OR dashed/faded (race) */}
                    <motion.path
                        d={pathOutT2Safe}
                        stroke="url(#grad-out-t2-safe)"
                        strokeWidth={isRace ? 1.1 : 1.8}
                        strokeLinecap="round"
                        strokeDasharray={isRace ? "3 3" : "none"}
                        animate={{ opacity: isRace ? 0.15 : 1 }}
                        transition={{ duration: 0.25 }}
                        filter={isRace ? undefined : "url(#glow-race)"}
                    />

                    {/* ACTIVE OUTGOING: T2 -> tasca_1() (race collision) */}
                    <motion.path
                        d={pathOutT2Race}
                        stroke="url(#grad-out-race)"
                        strokeWidth={2}
                        strokeLinecap="round"
                        animate={{ opacity: isRace ? 1 : 0 }}
                        transition={{ duration: 0.25 }}
                        filter={isRace ? "url(#glow-race)" : undefined}
                    />

                    {/* KINETIC PARTICLES */}
                    <motion.circle
                        key={`p-t1-in-${mode}`}
                        r={2.5}
                        fill="#38bdf8"
                        filter="url(#glow-race)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 1.1, repeat: Infinity, repeatDelay: 1.3, delay: 0, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${pathT1In}")` }}
                    />
                    <motion.circle
                        key={`p-t2-in-${mode}`}
                        r={2.5}
                        fill="#818cf8"
                        filter="url(#glow-race)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 1.1, repeat: Infinity, repeatDelay: 1.3, delay: isRace ? 0 : 1.1, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${pathT2In}")` }}
                    />
                    <motion.circle
                        key={`p-t1-out-${mode}`}
                        r={2.6}
                        fill={isRace ? "#f43f5e" : "#34d399"}
                        filter="url(#glow-race)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 1.0, repeat: Infinity, repeatDelay: 1.4, delay: 1.0, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${isRace ? pathOutT1Race : pathOutT1Safe}")` }}
                    />
                    <motion.circle
                        key={`p-t2-out-${mode}`}
                        r={2.6}
                        fill={isRace ? "#fbbf24" : "#818cf8"}
                        filter="url(#glow-race)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 1.0, repeat: Infinity, repeatDelay: 1.4, delay: isRace ? 1.0 : 2.1, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${isRace ? pathOutT2Race : pathOutT2Safe}")` }}
                    />

                    {/* LEFT COLUMN: T1 */}
                    <g>
                        <rect
                            x="42"
                            y="34"
                            width="52"
                            height="28"
                            rx="7"
                            fill="#0b0f19"
                            stroke="#38bdf8"
                            strokeWidth="1.4"
                            strokeOpacity="0.75"
                        />
                        <text
                            x="68"
                            y="48"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[10.5px] font-bold fill-sky-300 tracking-wider pointer-events-none"
                        >
                            T1
                        </text>
                        <circle cx="94" cy="48" r="2.5" fill="#38bdf8" />
                    </g>

                    {/* LEFT COLUMN: T2 */}
                    <g>
                        <rect
                            x="42"
                            y="104"
                            width="52"
                            height="28"
                            rx="7"
                            fill="#0b0f19"
                            stroke="#818cf8"
                            strokeWidth="1.4"
                            strokeOpacity="0.75"
                        />
                        <text
                            x="68"
                            y="118"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[10.5px] font-bold fill-indigo-300 tracking-wider pointer-events-none"
                        >
                            T2
                        </text>
                        <circle cx="94" cy="118" r="2.5" fill="#818cf8" />
                    </g>

                    {/* CENTER: SHARED VARIABLE primer */}
                    <g>
                        <rect
                            x="217"
                            y="61"
                            width="116"
                            height="44"
                            rx="8"
                            fill="#0b0f19"
                            stroke={isRace ? "#f43f5e" : "#34d399"}
                            strokeWidth={isRace ? 1.7 : 1.5}
                            strokeOpacity={isRace ? 0.9 : 0.75}
                            filter="url(#glow-race)"
                        />
                        <text
                            x="275"
                            y="73"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className={`font-mono text-[10px] font-bold tracking-wider pointer-events-none ${
                                isRace ? 'fill-rose-200' : 'fill-emerald-200'
                            }`}
                        >
                            primer
                        </text>

                        <rect
                            x="247"
                            y="83"
                            width="56"
                            height="15"
                            rx="4"
                            fill={isRace ? "rgba(244, 63, 94, 0.16)" : "rgba(52, 211, 153, 0.14)"}
                            stroke={isRace ? "#f43f5e" : "#34d399"}
                            strokeWidth="0.9"
                            strokeOpacity={isRace ? 0.65 : 0.55}
                        />
                        <text
                            x="275"
                            y="90.5"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className={`font-mono text-[8.5px] font-bold tracking-wider pointer-events-none ${
                                isRace ? 'fill-rose-300' : 'fill-emerald-300'
                            }`}
                        >
                            {isRace ? '== 1 !' : '1 → 0'}
                        </text>

                        <circle cx="217" cy="74" r="2.3" fill={isRace ? "#f43f5e" : "#34d399"} />
                        <circle cx="217" cy="92" r="2.3" fill={isRace ? "#f43f5e" : "#34d399"} />
                        <circle cx="333" cy="74" r="2.3" fill={isRace ? "#f43f5e" : "#34d399"} />
                        <circle cx="333" cy="92" r="2.3" fill={isRace ? "#f43f5e" : "#34d399"} />
                    </g>

                    {/* RIGHT COLUMN: tasca_1() */}
                    <g>
                        {isRace && (
                            <motion.rect
                                key="collision-pulse"
                                x="430"
                                y="30"
                                width="90"
                                height="36"
                                rx="10"
                                stroke="#fbbf24"
                                strokeWidth="1.2"
                                filter="url(#glow-race)"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 0.75, 0] }}
                                transition={{ duration: 0.8, delay: 1.7, repeat: Infinity, repeatDelay: 1.6, ease: "easeOut" }}
                            />
                        )}
                        <rect
                            x="433"
                            y="33"
                            width="84"
                            height="30"
                            rx="8"
                            fill="#0b0f19"
                            stroke={isRace ? "url(#grad-out-race)" : "url(#grad-out-t1-safe)"}
                            strokeWidth={isRace ? 1.8 : 1.4}
                            strokeOpacity={isRace ? 0.95 : 0.8}
                            filter="url(#glow-race)"
                        />
                        <text
                            x="475"
                            y="48"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className={`font-mono text-[9.5px] font-bold tracking-wider pointer-events-none ${
                                isRace ? 'fill-rose-300' : 'fill-sky-300'
                            }`}
                        >
                            tasca_1()
                        </text>
                        {isRace ? (
                            <>
                                <circle cx="433" cy="44" r="2.3" fill="#f43f5e" />
                                <circle cx="433" cy="52" r="2.3" fill="#fbbf24" />
                            </>
                        ) : (
                            <circle cx="433" cy="48" r="2.5" fill="#38bdf8" />
                        )}
                    </g>

                    {/* RIGHT COLUMN: tasca_2() */}
                    <motion.g
                        animate={{ opacity: isRace ? 0.25 : 1 }}
                        transition={{ duration: 0.25 }}
                    >
                        <rect
                            x="433"
                            y="103"
                            width="84"
                            height="30"
                            rx="8"
                            fill="#0b0f19"
                            stroke={isRace ? "#64748b" : "url(#grad-out-t2-safe)"}
                            strokeWidth={isRace ? 1.1 : 1.4}
                            strokeOpacity={isRace ? 0.6 : 0.8}
                            filter={isRace ? undefined : "url(#glow-race)"}
                        />
                        <text
                            x="475"
                            y="118"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className={`font-mono text-[9.5px] font-bold tracking-wider pointer-events-none ${
                                isRace ? 'fill-slate-400' : 'fill-indigo-300'
                            }`}
                        >
                            tasca_2()
                        </text>
                        <circle cx="433" cy="118" r="2.5" fill={isRace ? "#64748b" : "#818cf8"} />
                    </motion.g>
                </svg>
            </div>
        </div>
    );
}
