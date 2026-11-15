"use client";

import React, { useState } from 'react';
import { m as motion } from 'framer-motion';
import { Cpu } from 'lucide-react';

type ThreadModel = 'ult' | 'klt';

export default function ThreadModelsViz() {
    const [mode, setMode] = useState<ThreadModel>('ult');

    // Coordinate map (viewBox 0 0 560 175)
    // User threads: x=65 (41..89), y=42, 88, 134
    // Kernel boundary: x=145
    // ULT funnel bottleneck (I/O): x=180 (164..196), y=88
    // Kernel node(s): x=265 (216..314), y=88 (ULT) | y=42, 88, 134 (KLT)
    // CPU Cores: x=465 (423..507), y=60 (Core 0), y=116 (Core 1)

    // ULT paths
    const pathUltT1 = "M 89 42 C 130 42, 130 88, 164 88";
    const pathUltT2 = "M 89 88 L 164 88";
    const pathUltT3 = "M 89 134 C 130 134, 130 88, 164 88";
    const pathUltNeck = "M 196 88 L 216 88";
    const pathUltToCore0 = "M 314 88 C 368 88, 368 60, 423 60";

    // KLT paths
    const pathKltT1 = "M 89 42 L 216 42";
    const pathKltT2 = "M 89 88 L 216 88";
    const pathKltT3 = "M 89 134 L 216 134";
    const pathKltK1ToCore0 = "M 314 42 C 368 42, 368 60, 423 60";
    const pathKltK2ToCore0 = "M 314 88 C 368 88, 368 60, 423 60";
    const pathKltK3ToCore1 = "M 314 134 C 368 134, 368 116, 423 116";

    // Full continuous kinetic paths for KLT active threads
    const pathKltFullT2 = "M 89 88 L 314 88 C 368 88, 368 60, 423 60";
    const pathKltFullT3 = "M 89 134 L 314 134 C 368 134, 368 116, 423 116";

    const isUlt = mode === 'ult';

    return (
        <div className="w-full my-6 select-none flex flex-col items-center justify-center not-prose">
            <div className="w-full max-w-xl relative flex flex-col items-center">

                {/* Minimalist Segmented Toggle */}
                <div className="flex items-center gap-1 p-0.5 rounded-full bg-slate-900/60 border border-white/5 mb-3">
                    <button
                        type="button"
                        onClick={() => setMode('ult')}
                        className={`px-3 py-1 rounded-full font-mono text-[10px] transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                            isUlt
                                ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-400/40 shadow-sm'
                                : 'text-slate-500 hover:text-slate-300 border border-transparent'
                        }`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${isUlt ? 'bg-amber-400' : 'bg-slate-600'}`} />
                        ULT
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('klt')}
                        className={`px-3 py-1 rounded-full font-mono text-[10px] transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                            !isUlt
                                ? 'bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-400/40 shadow-sm'
                                : 'text-slate-500 hover:text-slate-300 border border-transparent'
                        }`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${!isUlt ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                        KLT
                    </button>
                </div>

                <svg
                    viewBox="0 0 560 175"
                    className="w-full h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter id="glow-threads" filterUnits="userSpaceOnUse" x="-20" y="-20" width="600" height="215">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <linearGradient id="grad-klt-t2" gradientUnits="userSpaceOnUse" x1="314" y1="0" x2="423" y2="0">
                            <stop offset="0%" stopColor="#38bdf8" />
                            <stop offset="100%" stopColor="#34d399" />
                        </linearGradient>

                        <linearGradient id="grad-klt-t3" gradientUnits="userSpaceOnUse" x1="314" y1="0" x2="423" y2="0">
                            <stop offset="0%" stopColor="#818cf8" />
                            <stop offset="100%" stopColor="#34d399" />
                        </linearGradient>
                    </defs>

                    {/* COLUMN HEADERS */}
                    <text
                        x="65"
                        y="14"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="font-mono text-[8.5px] font-semibold tracking-widest uppercase fill-slate-500 pointer-events-none"
                    >
                        USER
                    </text>
                    <text
                        x="265"
                        y="14"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="font-mono text-[8.5px] font-semibold tracking-widest uppercase fill-slate-500 pointer-events-none"
                    >
                        KERNEL
                    </text>
                    <text
                        x="465"
                        y="14"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="font-mono text-[8.5px] font-semibold tracking-widest uppercase fill-slate-500 pointer-events-none"
                    >
                        CPU
                    </text>

                    {/* KERNEL BOUNDARY SUBTLE DASHED DIVIDER */}
                    <line
                        x1="145"
                        y1="26"
                        x2="145"
                        y2="152"
                        className="stroke-slate-300/20 dark:stroke-white/[0.08]"
                        strokeWidth="1.2"
                        strokeDasharray="3 4"
                    />

                    {/* TRACKS & PARTICLES BY MODE */}
                    {isUlt ? (
                        <g key="ult-tracks">
                            {/* Blueprint Base Tracks */}
                            <path d={pathUltT1} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" />
                            <path d={pathUltT2} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" />
                            <path d={pathUltT3} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" />
                            <path d={pathUltNeck} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" />
                            <path d={pathUltToCore0} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" strokeDasharray="3 3" />

                            {/* Active / Stalled Tracks */}
                            <motion.path
                                d={pathUltT1}
                                stroke="#f43f5e"
                                strokeWidth={1.8}
                                strokeLinecap="round"
                                filter="url(#glow-threads)"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.95 }}
                                transition={{ duration: 0.25 }}
                            />
                            <motion.path
                                d={pathUltT2}
                                stroke="#fbbf24"
                                strokeWidth={1.4}
                                strokeDasharray="3 3"
                                strokeLinecap="round"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.55 }}
                                transition={{ duration: 0.25 }}
                            />
                            <motion.path
                                d={pathUltT3}
                                stroke="#fbbf24"
                                strokeWidth={1.4}
                                strokeDasharray="3 3"
                                strokeLinecap="round"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.55 }}
                                transition={{ duration: 0.25 }}
                            />
                            <motion.path
                                d={pathUltNeck}
                                stroke="#f43f5e"
                                strokeWidth={1.8}
                                strokeLinecap="round"
                                filter="url(#glow-threads)"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0.55, 0.95, 0.55] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <motion.path
                                d={pathUltToCore0}
                                stroke="#fbbf24"
                                strokeWidth={1.4}
                                strokeDasharray="4 4"
                                strokeLinecap="round"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.5 }}
                                transition={{ duration: 0.25 }}
                            />

                            {/* Stalling Particle from T1 hitting the I/O Bottleneck */}
                            <motion.circle
                                key="ult-t1-io-particle"
                                r={2.5}
                                fill="#f43f5e"
                                filter="url(#glow-threads)"
                                initial={{ offsetDistance: "0%", opacity: 0 }}
                                animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                                transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
                                style={{ offsetPath: `path("${pathUltT1}")` }}
                            />
                        </g>
                    ) : (
                        <g key="klt-tracks">
                            {/* Blueprint Base Tracks */}
                            <path d={pathKltT1} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" />
                            <path d={pathKltT2} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" />
                            <path d={pathKltT3} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" />
                            <path d={pathKltK1ToCore0} className="stroke-slate-300/20 dark:stroke-white/[0.06]" strokeWidth="1.2" strokeDasharray="3 3" />
                            <path d={pathKltK2ToCore0} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" />
                            <path d={pathKltK3ToCore1} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" />

                            {/* T1 Blocked Track (Stops at K1 I/O) */}
                            <motion.path
                                d={pathKltT1}
                                stroke="#fbbf24"
                                strokeWidth={1.5}
                                strokeDasharray="3 3"
                                strokeLinecap="round"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.7 }}
                                transition={{ duration: 0.25 }}
                            />

                            {/* T2 Active Parallel Track -> Core 0 */}
                            <motion.path
                                d={pathKltT2}
                                stroke="#38bdf8"
                                strokeWidth={1.8}
                                strokeLinecap="round"
                                filter="url(#glow-threads)"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.95 }}
                                transition={{ duration: 0.25 }}
                            />
                            <motion.path
                                d={pathKltK2ToCore0}
                                stroke="url(#grad-klt-t2)"
                                strokeWidth={1.8}
                                strokeLinecap="round"
                                filter="url(#glow-threads)"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.95 }}
                                transition={{ duration: 0.25 }}
                            />

                            {/* T3 Active Parallel Track -> Core 1 */}
                            <motion.path
                                d={pathKltT3}
                                stroke="#818cf8"
                                strokeWidth={1.8}
                                strokeLinecap="round"
                                filter="url(#glow-threads)"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.95 }}
                                transition={{ duration: 0.25 }}
                            />
                            <motion.path
                                d={pathKltK3ToCore1}
                                stroke="url(#grad-klt-t3)"
                                strokeWidth={1.8}
                                strokeLinecap="round"
                                filter="url(#glow-threads)"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.95 }}
                                transition={{ duration: 0.25 }}
                            />

                            {/* Kinetic Particles for T2 -> Core 0 and T3 -> Core 1 */}
                            <motion.circle
                                key="klt-t2-particle"
                                r={2.5}
                                fill="#34d399"
                                filter="url(#glow-threads)"
                                initial={{ offsetDistance: "0%", opacity: 0 }}
                                animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                                transition={{ duration: 2.0, repeat: Infinity, ease: "easeInOut" }}
                                style={{ offsetPath: `path("${pathKltFullT2}")` }}
                            />
                            <motion.circle
                                key="klt-t3-particle"
                                r={2.5}
                                fill="#34d399"
                                filter="url(#glow-threads)"
                                initial={{ offsetDistance: "0%", opacity: 0 }}
                                animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                                transition={{ duration: 2.0, repeat: Infinity, delay: 0.65, ease: "easeInOut" }}
                                style={{ offsetPath: `path("${pathKltFullT3}")` }}
                            />
                        </g>
                    )}

                    {/* LEFT COLUMN: USER THREADS T1, T2, T3 */}
                    <g>
                        {/* T1 (y=42) - Issues I/O in both modes */}
                        <rect
                            x="41"
                            y="29"
                            width="48"
                            height="26"
                            rx="7"
                            fill="#0b0f19"
                            stroke={isUlt ? '#f43f5e' : '#fbbf24'}
                            strokeWidth="1.4"
                            strokeOpacity="0.85"
                        />
                        <text
                            x="65"
                            y="42"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className={`font-mono text-[9.5px] font-bold tracking-wider pointer-events-none ${
                                isUlt ? 'fill-rose-300' : 'fill-amber-300'
                            }`}
                        >
                            T1
                        </text>
                        <circle cx="89" cy="42" r="2.5" fill={isUlt ? '#f43f5e' : '#fbbf24'} />

                        {/* T2 (y=88) - Blocked in ULT, Running on Core 0 in KLT */}
                        <rect
                            x="41"
                            y="75"
                            width="48"
                            height="26"
                            rx="7"
                            fill="#0b0f19"
                            stroke={isUlt ? '#fbbf24' : '#38bdf8'}
                            strokeWidth={isUlt ? 1.1 : 1.4}
                            strokeOpacity={isUlt ? 0.45 : 0.85}
                        />
                        <text
                            x="65"
                            y="88"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className={`font-mono text-[9.5px] font-bold tracking-wider pointer-events-none ${
                                isUlt ? 'fill-amber-200/60' : 'fill-sky-300'
                            }`}
                        >
                            T2
                        </text>
                        <circle cx="89" cy="88" r="2.5" fill={isUlt ? '#fbbf24' : '#38bdf8'} opacity={isUlt ? 0.55 : 1} />

                        {/* T3 (y=134) - Blocked in ULT, Running on Core 1 in KLT */}
                        <rect
                            x="41"
                            y="121"
                            width="48"
                            height="26"
                            rx="7"
                            fill="#0b0f19"
                            stroke={isUlt ? '#fbbf24' : '#818cf8'}
                            strokeWidth={isUlt ? 1.1 : 1.4}
                            strokeOpacity={isUlt ? 0.45 : 0.85}
                        />
                        <text
                            x="65"
                            y="134"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className={`font-mono text-[9.5px] font-bold tracking-wider pointer-events-none ${
                                isUlt ? 'fill-amber-200/60' : 'fill-indigo-300'
                            }`}
                        >
                            T3
                        </text>
                        <circle cx="89" cy="134" r="2.5" fill={isUlt ? '#fbbf24' : '#818cf8'} opacity={isUlt ? 0.55 : 1} />
                    </g>

                    {/* MIDDLE ZONE: KERNEL SCHEDULER NODES */}
                    {isUlt ? (
                        <g key="ult-kernel-nodes">
                            {/* Funnel Bottleneck I/O Pill at x=180 */}
                            <motion.rect
                                x="164"
                                y="79"
                                width="32"
                                height="18"
                                rx="5"
                                fill="#0b0f19"
                                stroke="#f43f5e"
                                strokeWidth="1.4"
                                filter="url(#glow-threads)"
                                animate={{ strokeOpacity: [0.55, 1, 0.55] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <text
                                x="180"
                                y="88"
                                textAnchor="middle"
                                dominantBaseline="central"
                                className="font-mono text-[8px] font-bold tracking-wider fill-rose-300 pointer-events-none"
                            >
                                I/O
                            </text>
                            <circle cx="164" cy="88" r="2.2" fill="#f43f5e" />
                            <circle cx="196" cy="88" r="2.2" fill="#f43f5e" />

                            {/* Single Kernel Thread Node (x=265, y=88) */}
                            <motion.rect
                                x="216"
                                y="73"
                                width="98"
                                height="30"
                                rx="8"
                                fill="#0b0f19"
                                stroke="#f43f5e"
                                strokeWidth="1.5"
                                animate={{ strokeOpacity: [0.45, 0.9, 0.45] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <motion.circle
                                cx="228"
                                cy="88"
                                r="2.8"
                                fill="#f43f5e"
                                filter="url(#glow-threads)"
                                animate={{ opacity: [0.35, 1, 0.35] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <text
                                x="271"
                                y="88"
                                textAnchor="middle"
                                dominantBaseline="central"
                                className="font-mono text-[9px] font-bold tracking-wider fill-rose-300 pointer-events-none"
                            >
                                1 Fil Kernel
                            </text>
                            <circle cx="216" cy="88" r="2.2" fill="#f43f5e" />
                            <circle cx="314" cy="88" r="2.2" fill="#fbbf24" opacity="0.65" />
                        </g>
                    ) : (
                        <g key="klt-kernel-nodes">
                            {/* K1 (y=42) - Blocked in I/O */}
                            <rect
                                x="216"
                                y="29"
                                width="98"
                                height="26"
                                rx="7"
                                fill="#0b0f19"
                                stroke="#fbbf24"
                                strokeWidth="1.4"
                                strokeOpacity="0.8"
                            />
                            <motion.circle
                                cx="228"
                                cy="42"
                                r="2.6"
                                fill="#f43f5e"
                                filter="url(#glow-threads)"
                                animate={{ opacity: [0.35, 1, 0.35] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <text
                                x="246"
                                y="42"
                                textAnchor="middle"
                                dominantBaseline="central"
                                className="font-mono text-[9.5px] font-bold tracking-wider fill-amber-300 pointer-events-none"
                            >
                                K1
                            </text>
                            <rect
                                x="265"
                                y="34"
                                width="36"
                                height="16"
                                rx="4"
                                fill="rgba(244, 63, 94, 0.14)"
                                stroke="#f43f5e"
                                strokeWidth="1"
                                strokeOpacity="0.8"
                            />
                            <text
                                x="283"
                                y="42"
                                textAnchor="middle"
                                dominantBaseline="central"
                                className="font-mono text-[8px] font-bold tracking-wider fill-rose-300 pointer-events-none"
                            >
                                I/O
                            </text>
                            <circle cx="216" cy="42" r="2.2" fill="#fbbf24" />
                            <circle cx="314" cy="42" r="2.2" fill="#64748b" opacity="0.35" />

                            {/* K2 (y=88) - Active -> Core 0 */}
                            <rect
                                x="216"
                                y="75"
                                width="98"
                                height="26"
                                rx="7"
                                fill="#0b0f19"
                                stroke="#38bdf8"
                                strokeWidth="1.4"
                                strokeOpacity="0.85"
                            />
                            <text
                                x="265"
                                y="88"
                                textAnchor="middle"
                                dominantBaseline="central"
                                className="font-mono text-[9.5px] font-bold tracking-wider fill-sky-300 pointer-events-none"
                            >
                                K2
                            </text>
                            <circle cx="216" cy="88" r="2.5" fill="#38bdf8" />
                            <circle cx="314" cy="88" r="2.5" fill="#34d399" />

                            {/* K3 (y=134) - Active -> Core 1 */}
                            <rect
                                x="216"
                                y="121"
                                width="98"
                                height="26"
                                rx="7"
                                fill="#0b0f19"
                                stroke="#818cf8"
                                strokeWidth="1.4"
                                strokeOpacity="0.85"
                            />
                            <text
                                x="265"
                                y="134"
                                textAnchor="middle"
                                dominantBaseline="central"
                                className="font-mono text-[9.5px] font-bold tracking-wider fill-indigo-300 pointer-events-none"
                            >
                                K3
                            </text>
                            <circle cx="216" cy="134" r="2.5" fill="#818cf8" />
                            <circle cx="314" cy="134" r="2.5" fill="#34d399" />
                        </g>
                    )}

                    {/* RIGHT COLUMN: CPU CORES */}
                    {/* Core 0 (465, 60) */}
                    <g
                        transform="translate(465, 60)"
                        className="transition-opacity duration-300"
                        opacity={isUlt ? 0.65 : 1}
                    >
                        <rect
                            x="-42"
                            y="-16"
                            width="84"
                            height="32"
                            rx="8"
                            fill="#0b0f19"
                            stroke={isUlt ? '#fbbf24' : '#34d399'}
                            strokeWidth={isUlt ? 1.2 : 1.5}
                            strokeOpacity={isUlt ? 0.45 : 0.85}
                            filter={!isUlt ? "url(#glow-threads)" : undefined}
                        />
                        <foreignObject x="-31" y="-8" width="16" height="16" className="pointer-events-none">
                            <div className="w-full h-full flex items-center justify-center">
                                <Cpu
                                    className={`w-4 h-4 ${isUlt ? 'text-amber-300/80' : 'text-emerald-400'}`}
                                    strokeWidth={1.8}
                                />
                            </div>
                        </foreignObject>
                        <text
                            x="12"
                            y="0"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className={`font-mono text-[9.5px] font-bold tracking-wider pointer-events-none ${
                                isUlt ? 'fill-amber-200/80' : 'fill-emerald-300'
                            }`}
                        >
                            Core 0
                        </text>
                        <circle cx="-42" cy="0" r="2.5" fill={isUlt ? '#fbbf24' : '#34d399'} />
                    </g>

                    {/* Core 1 (465, 116) */}
                    <g
                        transform="translate(465, 116)"
                        className="transition-opacity duration-300"
                        opacity={isUlt ? 0.2 : 1}
                    >
                        <rect
                            x="-42"
                            y="-16"
                            width="84"
                            height="32"
                            rx="8"
                            fill="#0b0f19"
                            stroke={isUlt ? '#64748b' : '#34d399'}
                            strokeWidth={isUlt ? 1 : 1.5}
                            strokeOpacity={isUlt ? 0.4 : 0.85}
                            filter={!isUlt ? "url(#glow-threads)" : undefined}
                        />
                        <foreignObject x="-31" y="-8" width="16" height="16" className="pointer-events-none">
                            <div className="w-full h-full flex items-center justify-center">
                                <Cpu
                                    className={`w-4 h-4 ${isUlt ? 'text-slate-500' : 'text-emerald-400'}`}
                                    strokeWidth={1.8}
                                />
                            </div>
                        </foreignObject>
                        <text
                            x="12"
                            y="0"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className={`font-mono text-[9.5px] font-bold tracking-wider pointer-events-none ${
                                isUlt ? 'fill-slate-400' : 'fill-emerald-300'
                            }`}
                        >
                            Core 1
                        </text>
                        <circle cx="-42" cy="0" r="2.5" fill={isUlt ? '#64748b' : '#34d399'} />
                    </g>
                </svg>
            </div>
        </div>
    );
}
