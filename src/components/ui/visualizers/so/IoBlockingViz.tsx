"use client";

import { useState } from 'react';
import { m as motion } from 'framer-motion';

type IoMode = 'blocking' | 'nonblock';
type HoverNode = 'cpu' | 'read' | 'blocked' | 'ready' | null;

const PATH_CPU_READ = "M 120 76 L 165 76";
const PATH_READ_BLOCKED = "M 245 76 C 272 76, 268 123, 295 123";
const PATH_BLOCKED_READY = "M 390 123 C 416 123, 410 76, 435 76";
const PATH_NONBLOCK_ARC = "M 245 76 C 285 26, 395 26, 435 76";

export default function IoBlockingViz() {
    const [mode, setMode] = useState<IoMode>('blocking');
    const [hovered, setHovered] = useState<HoverNode>(null);

    const isBlocking = mode === 'blocking';
    const isLit = (node: HoverNode) => hovered === node;
    const isFaded = (node: HoverNode) => hovered !== null && hovered !== node;

    const cpuReadDimmed = hovered !== null && hovered !== 'cpu' && hovered !== 'read';
    const readBlockedDimmed = hovered !== null && hovered !== 'read' && hovered !== 'blocked';
    const blockedReadyDimmed = hovered !== null && hovered !== 'blocked' && hovered !== 'ready';
    const nonblockArcDimmed = hovered !== null && hovered !== 'read' && hovered !== 'ready';

    return (
        <div className="w-full my-6 select-none flex flex-col items-center justify-center not-prose">
            <div className="w-full max-w-lg relative flex flex-col items-center">

                {/* Minimalist Switcher */}
                <div className="flex items-center gap-1 p-0.5 rounded-full bg-slate-900/60 border border-white/5 mb-3">
                    {([
                        { id: 'blocking', label: 'Bloquejant' },
                        { id: 'nonblock', label: 'O_NONBLOCK' },
                    ] as const).map((item) => {
                        const isActive = mode === item.id;
                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                    setMode(item.id);
                                    setHovered(null);
                                }}
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
                    viewBox="0 0 560 155"
                    className="w-full h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter id="glow-ioblock" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* BASE BLUEPRINT TRACKS */}
                    <path d={PATH_CPU_READ} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" />
                    <path d={PATH_READ_BLOCKED} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" />
                    <path d={PATH_BLOCKED_READY} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" />
                    <path d={PATH_NONBLOCK_ARC} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" strokeDasharray="3 3" />

                    {/* ACTIVE PATH: CPU -> read() */}
                    <path
                        d={PATH_CPU_READ}
                        stroke="#38bdf8"
                        strokeWidth={isLit('cpu') || isLit('read') ? 2 : 1.5}
                        strokeLinecap="round"
                        filter="url(#glow-ioblock)"
                        opacity={cpuReadDimmed ? 0.25 : 0.9}
                    />

                    {/* BLOCKING PATHS */}
                    {isBlocking && (
                        <>
                            <path
                                d={PATH_READ_BLOCKED}
                                stroke="#fbbf24"
                                strokeWidth={isLit('read') || isLit('blocked') ? 2.1 : 1.5}
                                strokeLinecap="round"
                                filter="url(#glow-ioblock)"
                                opacity={readBlockedDimmed ? 0.25 : 0.9}
                            />
                            <path
                                d={PATH_BLOCKED_READY}
                                stroke="#c084fc"
                                strokeWidth={isLit('blocked') || isLit('ready') ? 2.1 : 1.5}
                                strokeLinecap="round"
                                filter="url(#glow-ioblock)"
                                opacity={blockedReadyDimmed ? 0.25 : 0.95}
                            />

                            {/* int (HW) badge beside rising path */}
                            <g opacity={blockedReadyDimmed ? 0.25 : 1}>
                                <rect
                                    x="416"
                                    y="112"
                                    width="60"
                                    height="18"
                                    rx="9"
                                    fill="#0b0f19"
                                    stroke="#c084fc"
                                    strokeWidth="1"
                                    strokeOpacity="0.6"
                                />
                                <text
                                    x="446"
                                    y="121"
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    className="font-mono text-[8px] font-semibold fill-purple-300 tracking-wider pointer-events-none"
                                >
                                    int (HW)
                                </text>
                            </g>
                        </>
                    )}

                    {/* NON-BLOCKING TOP BYPASS PATH */}
                    {!isBlocking && (
                        <>
                            <path
                                d={PATH_NONBLOCK_ARC}
                                stroke="#38bdf8"
                                strokeWidth={isLit('read') || isLit('ready') ? 2.2 : 1.6}
                                strokeLinecap="round"
                                filter="url(#glow-ioblock)"
                                opacity={nonblockArcDimmed ? 0.25 : 0.95}
                            />
                            <g opacity={nonblockArcDimmed ? 0.25 : 1}>
                                <rect
                                    x="295"
                                    y="10"
                                    width="90"
                                    height="18"
                                    rx="9"
                                    fill="#0b0f19"
                                    stroke="#38bdf8"
                                    strokeWidth="1"
                                    strokeOpacity="0.55"
                                />
                                <text
                                    x="340"
                                    y="19"
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    className="font-mono text-[8px] font-semibold fill-sky-300 tracking-wider pointer-events-none"
                                >
                                    O_NONBLOCK
                                </text>
                            </g>
                        </>
                    )}

                    {/* KINETIC PARTICLES */}
                    <motion.circle
                        key={`cpu-read-${mode}`}
                        r={2.5}
                        fill="#38bdf8"
                        filter="url(#glow-ioblock)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{
                            duration: isBlocking ? 1.5 : 1.0,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        style={{ offsetPath: `path("${PATH_CPU_READ}")` }}
                    />

                    {isBlocking ? (
                        <>
                            <motion.circle
                                key={`read-blocked-${mode}`}
                                r={2.5}
                                fill="#fbbf24"
                                filter="url(#glow-ioblock)"
                                initial={{ offsetDistance: "0%", opacity: 0 }}
                                animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                                transition={{
                                    duration: 1.9,
                                    repeat: Infinity,
                                    delay: 0.45,
                                    ease: "easeInOut",
                                }}
                                style={{ offsetPath: `path("${PATH_READ_BLOCKED}")` }}
                            />
                            <motion.circle
                                key={`blocked-ready-${mode}`}
                                r={2.5}
                                fill="#c084fc"
                                filter="url(#glow-ioblock)"
                                initial={{ offsetDistance: "0%", opacity: 0 }}
                                animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                                transition={{
                                    duration: 1.9,
                                    repeat: Infinity,
                                    delay: 1.1,
                                    ease: "easeInOut",
                                }}
                                style={{ offsetPath: `path("${PATH_BLOCKED_READY}")` }}
                            />
                        </>
                    ) : (
                        <motion.circle
                            key={`nonblock-arc-${mode}`}
                            r={2.5}
                            fill="#38bdf8"
                            filter="url(#glow-ioblock)"
                            initial={{ offsetDistance: "0%", opacity: 0 }}
                            animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                            transition={{
                                duration: 1.1,
                                repeat: Infinity,
                                delay: 0.3,
                                ease: "easeOut",
                            }}
                            style={{ offsetPath: `path("${PATH_NONBLOCK_ARC}")` }}
                        />
                    )}

                    {/* NODE 1: CPU · RUN */}
                    <g
                        onMouseEnter={() => setHovered('cpu')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer transition-opacity duration-200"
                        opacity={isFaded('cpu') ? 0.25 : 1}
                    >
                        <rect
                            x="30"
                            y="58"
                            width="90"
                            height="36"
                            rx="8"
                            fill="#0b0f19"
                            stroke="#38bdf8"
                            strokeWidth={isLit('cpu') ? 1.8 : 1.2}
                            strokeOpacity={isLit('cpu') ? 1 : 0.65}
                            filter={isLit('cpu') ? "url(#glow-ioblock)" : undefined}
                        />
                        <text
                            x="75"
                            y="76"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[10px] font-bold fill-sky-300 tracking-wider pointer-events-none"
                        >
                            CPU · RUN
                        </text>
                        <circle cx="120" cy="76" r="2.5" fill="#38bdf8" />
                    </g>

                    {/* NODE 2: read() */}
                    <g
                        onMouseEnter={() => setHovered('read')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer transition-opacity duration-200"
                        opacity={isFaded('read') ? 0.25 : 1}
                    >
                        <rect
                            x="165"
                            y="58"
                            width="80"
                            height="36"
                            rx="8"
                            fill="#0b0f19"
                            stroke="#818cf8"
                            strokeWidth={isLit('read') ? 1.8 : 1.2}
                            strokeOpacity={isLit('read') ? 1 : 0.65}
                            filter={isLit('read') ? "url(#glow-ioblock)" : undefined}
                        />
                        <text
                            x="205"
                            y="76"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[10px] font-bold fill-indigo-300 tracking-wider pointer-events-none"
                        >
                            read()
                        </text>
                        <circle cx="165" cy="76" r="2.5" fill="#818cf8" />
                        <circle cx="245" cy="76" r="2.5" fill="#818cf8" />
                    </g>

                    {/* NODE 3: BLOCKED */}
                    <g
                        onMouseEnter={() => isBlocking && setHovered('blocked')}
                        onMouseLeave={() => setHovered(null)}
                        className={`transition-opacity duration-200 ${isBlocking ? 'cursor-pointer' : 'pointer-events-none'}`}
                        opacity={!isBlocking ? 0.2 : isFaded('blocked') ? 0.25 : 1}
                    >
                        <rect
                            x="295"
                            y="106"
                            width="95"
                            height="34"
                            rx="8"
                            fill="#0b0f19"
                            stroke="#fbbf24"
                            strokeWidth={isLit('blocked') ? 1.8 : 1.2}
                            strokeOpacity={isLit('blocked') ? 1 : isBlocking ? 0.7 : 0.4}
                            strokeDasharray={isBlocking ? undefined : "3 3"}
                            filter={isBlocking && isLit('blocked') ? "url(#glow-ioblock)" : undefined}
                        />
                        <text
                            x="342.5"
                            y="123"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[10px] font-bold fill-amber-300 tracking-wider pointer-events-none"
                        >
                            BLOCKED
                        </text>
                        <circle cx="295" cy="123" r="2.5" fill="#fbbf24" />
                        <circle cx="390" cy="123" r="2.5" fill="#fbbf24" />
                    </g>

                    {/* NODE 4: READY / READY (RUN) */}
                    <g
                        onMouseEnter={() => setHovered('ready')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer transition-opacity duration-200"
                        opacity={isFaded('ready') ? 0.25 : 1}
                    >
                        <rect
                            x="435"
                            y="58"
                            width="95"
                            height="36"
                            rx="8"
                            fill="#0b0f19"
                            stroke={isBlocking ? '#34d399' : '#38bdf8'}
                            strokeWidth={isLit('ready') ? 1.8 : 1.2}
                            strokeOpacity={isLit('ready') ? 1 : 0.7}
                            filter={isLit('ready') ? "url(#glow-ioblock)" : undefined}
                        />
                        {isBlocking ? (
                            <text
                                x="482.5"
                                y="76"
                                textAnchor="middle"
                                dominantBaseline="central"
                                className="font-mono text-[10px] font-bold fill-emerald-300 tracking-wider pointer-events-none"
                            >
                                READY
                            </text>
                        ) : (
                            <>
                                <text
                                    x="482.5"
                                    y="70"
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    className="font-mono text-[9.5px] font-bold fill-sky-300 tracking-wider pointer-events-none"
                                >
                                    READY (RUN)
                                </text>
                                <text
                                    x="482.5"
                                    y="83"
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    className="font-mono text-[7.5px] font-semibold fill-sky-400/80 tracking-wider pointer-events-none"
                                >
                                    -1 · EAGAIN
                                </text>
                            </>
                        )}
                        <circle cx="435" cy="76" r="2.5" fill={isBlocking ? '#34d399' : '#38bdf8'} />
                    </g>
                </svg>
            </div>
        </div>
    );
}
