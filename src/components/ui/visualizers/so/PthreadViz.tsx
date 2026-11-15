"use client";

import React, { useState } from 'react';
import { m as motion } from 'framer-motion';

export default function PthreadViz() {
    const [mode, setMode] = useState<'pthread_exit' | 'exit'>('pthread_exit');
    const isExit = mode === 'exit';

    // Core horizontal timeline & branch paths
    const pathMainEntry = "M 45 45 L 135 45";
    const pathMainWaitLeft = "M 135 45 L 310 45";
    const pathMainWaitRight = "M 310 45 L 425 45";
    const pathMainResume = "M 425 45 L 515 45";
    const pathMainFull = "M 45 45 L 515 45";

    const pathT1Cut = "M 135 45 C 172 45, 173 95, 210 95 L 310 95";
    const pathT1PostCut = "M 310 95 L 355 95";
    const pathT1Join = "M 355 95 C 390 95, 390 45, 425 45";
    const pathT1Full = "M 135 45 C 172 45, 173 95, 210 95 L 355 95 C 390 95, 390 45, 425 45";

    const pathT2Cut = "M 135 45 C 172 45, 173 138, 210 138 L 310 138";
    const pathT2PostCut = "M 310 138 L 395 138";
    const pathT2Join = "M 395 138 C 410 138, 410 45, 425 45";
    const pathT2Full = "M 135 45 C 172 45, 173 138, 210 138 L 395 138 C 410 138, 410 45, 425 45";

    return (
        <div className="w-full my-6 select-none flex flex-col items-center justify-center not-prose">
            <div className="w-full max-w-lg relative flex flex-col items-center">
                {/* Minimalist 2-state Switch */}
                <div className="flex items-center gap-1 p-0.5 rounded-full bg-slate-900/60 border border-white/5 mb-3">
                    <button
                        type="button"
                        onClick={() => setMode('pthread_exit')}
                        className={`px-3 py-1 rounded-full font-mono text-[10px] transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                            !isExit
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-sm'
                                : 'text-slate-500 hover:text-slate-300 border border-transparent'
                        }`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${!isExit ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                        pthread_exit()
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('exit')}
                        className={`px-3 py-1 rounded-full font-mono text-[10px] transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                            isExit
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-400/40 shadow-sm'
                                : 'text-slate-500 hover:text-slate-300 border border-transparent'
                        }`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${isExit ? 'bg-rose-400 animate-pulse' : 'bg-slate-600'}`} />
                        exit()
                    </button>
                </div>

                <svg
                    viewBox="0 0 560 165"
                    className="w-full h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter id="glow-pthread" filterUnits="userSpaceOnUse" x="-20" y="-20" width="600" height="205">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <linearGradient
                            id="grad-t2-branch"
                            gradientUnits="userSpaceOnUse"
                            x1="135"
                            y1="45"
                            x2="210"
                            y2="138"
                        >
                            <stop offset="0%" stopColor="#38bdf8" />
                            <stop offset="100%" stopColor="#818cf8" />
                        </linearGradient>

                        <linearGradient
                            id="grad-t2-join"
                            gradientUnits="userSpaceOnUse"
                            x1="395"
                            y1="138"
                            x2="425"
                            y2="45"
                        >
                            <stop offset="0%" stopColor="#818cf8" />
                            <stop offset="100%" stopColor="#34d399" />
                        </linearGradient>
                    </defs>

                    {/* Blueprint base tracks */}
                    <path d={pathMainFull} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.3" />
                    <path d={pathT1Full} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.3" />
                    <path d={pathT2Full} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.3" />

                    {/* Active tracks up to x=310 */}
                    <path
                        d={pathMainEntry}
                        stroke="#38bdf8"
                        strokeWidth={1.8}
                        strokeLinecap="round"
                        filter="url(#glow-pthread)"
                    />
                    <path
                        d={pathMainWaitLeft}
                        stroke="#38bdf8"
                        strokeOpacity={0.35}
                        strokeWidth={1.4}
                        strokeDasharray="4 4"
                    />
                    <path
                        d={pathT1Cut}
                        stroke="#38bdf8"
                        strokeWidth={1.8}
                        strokeLinecap="round"
                        filter="url(#glow-pthread)"
                    />
                    <path
                        d={pathT2Cut}
                        stroke="url(#grad-t2-branch)"
                        strokeWidth={1.8}
                        strokeLinecap="round"
                        filter="url(#glow-pthread)"
                    />

                    {/* Right of x=310 (faded/dashed in exit() mode) */}
                    <motion.g
                        animate={{ opacity: isExit ? 0.15 : 1 }}
                        transition={{ duration: 0.25 }}
                    >
                        <path
                            d={pathMainWaitRight}
                            stroke={isExit ? "#94a3b8" : "#38bdf8"}
                            strokeOpacity={isExit ? 1 : 0.35}
                            strokeWidth={1.4}
                            strokeDasharray="4 4"
                        />
                        <path
                            d={pathMainResume}
                            stroke={isExit ? "#94a3b8" : "#34d399"}
                            strokeWidth={isExit ? 1.4 : 2}
                            strokeDasharray={isExit ? "4 4" : undefined}
                            strokeLinecap="round"
                            filter={isExit ? undefined : "url(#glow-pthread)"}
                        />

                        {/* T1 continuation & join curve */}
                        <path
                            d={pathT1PostCut}
                            stroke={isExit ? "#94a3b8" : "#38bdf8"}
                            strokeWidth={isExit ? 1.4 : 1.8}
                            strokeDasharray={isExit ? "4 4" : undefined}
                            strokeLinecap="round"
                            filter={isExit ? undefined : "url(#glow-pthread)"}
                        />
                        <path
                            d={pathT1Join}
                            stroke={isExit ? "#94a3b8" : "#34d399"}
                            strokeWidth={isExit ? 1.4 : 1.8}
                            strokeDasharray={isExit ? "4 4" : undefined}
                            strokeLinecap="round"
                            filter={isExit ? undefined : "url(#glow-pthread)"}
                        />

                        {/* T2 continuation & join curve */}
                        <path
                            d={pathT2PostCut}
                            stroke={isExit ? "#94a3b8" : "#818cf8"}
                            strokeWidth={isExit ? 1.4 : 1.8}
                            strokeDasharray={isExit ? "4 4" : undefined}
                            strokeLinecap="round"
                            filter={isExit ? undefined : "url(#glow-pthread)"}
                        />
                        <path
                            d={pathT2Join}
                            stroke={isExit ? "#94a3b8" : "url(#grad-t2-join)"}
                            strokeWidth={isExit ? 1.4 : 1.8}
                            strokeDasharray={isExit ? "4 4" : undefined}
                            strokeLinecap="round"
                            filter={isExit ? undefined : "url(#glow-pthread)"}
                        />

                        {/* Thread finish dots */}
                        <circle cx="355" cy="95" r="2.5" fill={isExit ? "#94a3b8" : "#34d399"} />
                        <circle cx="395" cy="138" r="2.5" fill={isExit ? "#94a3b8" : "#818cf8"} />

                        {/* join() node (425, 45) */}
                        <g transform="translate(425, 45)">
                            <circle
                                cx="0"
                                cy="0"
                                r="10"
                                fill={isExit ? "rgba(148, 163, 184, 0.14)" : "rgba(52, 211, 153, 0.16)"}
                            />
                            <circle cx="0" cy="0" r="3" fill={isExit ? "#94a3b8" : "#34d399"} />
                            <text
                                x="0"
                                y="-21"
                                textAnchor="middle"
                                dominantBaseline="central"
                                className={`font-mono text-[9.5px] font-bold tracking-wide pointer-events-none ${
                                    isExit ? "fill-slate-400" : "fill-emerald-300"
                                }`}
                            >
                                join()
                            </text>
                        </g>
                    </motion.g>

                    {/* Kinetic particles */}
                    {!isExit ? (
                        <>
                            {/* main -> create() */}
                            <motion.circle
                                key="p-main-entry-pthread"
                                r={2.6}
                                fill="#38bdf8"
                                filter="url(#glow-pthread)"
                                initial={{ offsetDistance: "0%", opacity: 0 }}
                                animate={{
                                    offsetDistance: ["0%", "16.7%", "83.3%", "100%", "100%"],
                                    opacity: [0, 1, 1, 0, 0],
                                }}
                                transition={{
                                    duration: 3.2,
                                    times: [0, 0.03, 0.17, 0.20, 1],
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                style={{ offsetPath: `path("${pathMainEntry}")` }}
                            />
                            {/* T1 -> join() */}
                            <motion.circle
                                key="p-t1-pthread"
                                r={2.6}
                                filter="url(#glow-pthread)"
                                initial={{ offsetDistance: "0%", opacity: 0, fill: "#38bdf8" }}
                                animate={{
                                    offsetDistance: ["0%", "0%", "8.3%", "91.7%", "100%", "100%"],
                                    opacity: [0, 0, 1, 1, 0, 0],
                                    fill: ["#38bdf8", "#38bdf8", "#38bdf8", "#34d399", "#34d399", "#34d399"],
                                }}
                                transition={{
                                    duration: 3.2,
                                    times: [0, 0.20, 0.24, 0.64, 0.68, 1],
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                style={{ offsetPath: `path("${pathT1Full}")` }}
                            />
                            {/* T2 -> join() */}
                            <motion.circle
                                key="p-t2-pthread"
                                r={2.6}
                                filter="url(#glow-pthread)"
                                initial={{ offsetDistance: "0%", opacity: 0, fill: "#38bdf8" }}
                                animate={{
                                    offsetDistance: ["0%", "0%", "6.9%", "93.1%", "100%", "100%"],
                                    opacity: [0, 0, 1, 1, 0, 0],
                                    fill: ["#38bdf8", "#38bdf8", "#818cf8", "#818cf8", "#34d399", "#34d399"],
                                }}
                                transition={{
                                    duration: 3.2,
                                    times: [0, 0.20, 0.24, 0.74, 0.78, 1],
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                style={{ offsetPath: `path("${pathT2Full}")` }}
                            />
                            {/* join() -> main resume */}
                            <motion.circle
                                key="p-main-resume-pthread"
                                r={2.8}
                                fill="#34d399"
                                filter="url(#glow-pthread)"
                                initial={{ offsetDistance: "0%", opacity: 0 }}
                                animate={{
                                    offsetDistance: ["0%", "0%", "13.6%", "86.4%", "100%", "100%"],
                                    opacity: [0, 0, 1, 1, 0, 0],
                                }}
                                transition={{
                                    duration: 3.2,
                                    times: [0, 0.77, 0.80, 0.96, 0.99, 1],
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                style={{ offsetPath: `path("${pathMainResume}")` }}
                            />
                        </>
                    ) : (
                        <>
                            {/* main -> create() */}
                            <motion.circle
                                key="p-main-entry-exit"
                                r={2.6}
                                fill="#38bdf8"
                                filter="url(#glow-pthread)"
                                initial={{ offsetDistance: "0%", opacity: 0 }}
                                animate={{
                                    offsetDistance: ["0%", "16.7%", "83.3%", "100%", "100%"],
                                    opacity: [0, 1, 1, 0, 0],
                                }}
                                transition={{
                                    duration: 2.2,
                                    times: [0, 0.05, 0.25, 0.30, 1],
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                style={{ offsetPath: `path("${pathMainEntry}")` }}
                            />
                            {/* T1 -> x=310 cut */}
                            <motion.circle
                                key="p-t1-exit"
                                r={2.6}
                                fill="#38bdf8"
                                filter="url(#glow-pthread)"
                                initial={{ offsetDistance: "0%", opacity: 0 }}
                                animate={{
                                    offsetDistance: ["0%", "0%", "9.1%", "90.9%", "100%", "100%"],
                                    opacity: [0, 0, 1, 1, 0, 0],
                                }}
                                transition={{
                                    duration: 2.2,
                                    times: [0, 0.30, 0.35, 0.80, 0.85, 1],
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                style={{ offsetPath: `path("${pathT1Cut}")` }}
                            />
                            {/* T2 -> x=310 cut */}
                            <motion.circle
                                key="p-t2-exit"
                                r={2.6}
                                fill="#818cf8"
                                filter="url(#glow-pthread)"
                                initial={{ offsetDistance: "0%", opacity: 0 }}
                                animate={{
                                    offsetDistance: ["0%", "0%", "9.1%", "90.9%", "100%", "100%"],
                                    opacity: [0, 0, 1, 1, 0, 0],
                                }}
                                transition={{
                                    duration: 2.2,
                                    times: [0, 0.30, 0.35, 0.80, 0.85, 1],
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                style={{ offsetPath: `path("${pathT2Cut}")` }}
                            />
                        </>
                    )}

                    {/* Start dot & labels */}
                    <circle cx="45" cy="45" r="2.5" fill="#38bdf8" />
                    <text
                        x="78"
                        y="27"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="font-mono text-[9.5px] font-semibold tracking-wider fill-sky-300 pointer-events-none"
                    >
                        main
                    </text>

                    {/* create() junction node (135, 45) */}
                    <g transform="translate(135, 45)">
                        <circle cx="0" cy="0" r="10" fill="rgba(56, 189, 248, 0.14)" />
                        <circle cx="0" cy="0" r="3" fill="#38bdf8" />
                        <text
                            x="0"
                            y="-21"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[9.5px] font-bold tracking-wide fill-sky-300 pointer-events-none"
                        >
                            create()
                        </text>
                    </g>

                    {/* Thread labels */}
                    <text
                        x="228"
                        y="79"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="font-mono text-[9.5px] font-semibold tracking-wider fill-sky-300 pointer-events-none"
                    >
                        T1
                    </text>
                    <text
                        x="228"
                        y="153"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="font-mono text-[9.5px] font-semibold tracking-wider fill-indigo-300 pointer-events-none"
                    >
                        T2
                    </text>

                    {/* exit() termination cut at x=310 */}
                    {isExit && (
                        <g>
                            <motion.line
                                x1={310}
                                y1={22}
                                x2={310}
                                y2={152}
                                stroke="#f43f5e"
                                strokeWidth={1.3}
                                strokeDasharray="3 3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.85 }}
                                transition={{ duration: 0.25 }}
                            />
                            {/* Sibling cut markers on main & T2 */}
                            <circle cx="310" cy="45" r="2.3" fill="#f43f5e" />
                            <circle cx="310" cy="138" r="2.3" fill="#f43f5e" />

                            {/* Termination pulse at T1 exit() */}
                            <motion.circle
                                cx={310}
                                cy={95}
                                stroke="#f43f5e"
                                strokeWidth={1.2}
                                initial={{ r: 6, opacity: 0 }}
                                animate={{
                                    r: [6, 6, 15, 19],
                                    opacity: [0, 0, 0.75, 0],
                                }}
                                transition={{
                                    duration: 2.2,
                                    times: [0, 0.81, 0.86, 1],
                                    repeat: Infinity,
                                    ease: "easeOut",
                                }}
                            />

                            {/* Crisp exit() node */}
                            <g transform="translate(310, 95)">
                                <circle cx="0" cy="0" r="10" fill="rgba(244, 63, 94, 0.18)" />
                                <circle cx="0" cy="0" r="3.2" fill="#f43f5e" filter="url(#glow-pthread)" />
                            </g>

                            <text
                                x="283"
                                y="79"
                                textAnchor="middle"
                                dominantBaseline="central"
                                className="font-mono text-[9.5px] font-bold tracking-wide fill-rose-400 pointer-events-none"
                            >
                                exit()
                            </text>
                        </g>
                    )}
                </svg>
            </div>
        </div>
    );
}
