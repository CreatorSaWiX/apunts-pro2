"use client";

import { useState } from 'react';
import { m as motion } from 'framer-motion';

type ChainId = 'tty' | 'file' | null;

interface TcSlot {
    fd: number;
    target: number;
    y: number;
    cy: number;
    chain: Exclude<ChainId, null>;
    stroke: string;
    labelClass: string;
    targetClass: string;
}

const TC_SLOTS: readonly TcSlot[] = [
    {
        fd: 0,
        target: 0,
        y: 34,
        cy: 46,
        chain: 'tty',
        stroke: '#38bdf8',
        labelClass: 'fill-sky-300',
        targetClass: 'fill-sky-400/90',
    },
    {
        fd: 1,
        target: 0,
        y: 66,
        cy: 78,
        chain: 'tty',
        stroke: '#38bdf8',
        labelClass: 'fill-sky-300',
        targetClass: 'fill-sky-400/90',
    },
    {
        fd: 2,
        target: 0,
        y: 98,
        cy: 110,
        chain: 'tty',
        stroke: '#38bdf8',
        labelClass: 'fill-sky-300',
        targetClass: 'fill-sky-400/90',
    },
    {
        fd: 3,
        target: 1,
        y: 130,
        cy: 142,
        chain: 'file',
        stroke: '#34d399',
        labelClass: 'fill-emerald-300',
        targetClass: 'fill-emerald-400/90',
    },
];

export default function KernelTablesViz() {
    const [hovered, setHovered] = useState<ChainId>(null);

    const isFaded = (chain: Exclude<ChainId, null>) => hovered !== null && hovered !== chain;
    const isLit   = (chain: Exclude<ChainId, null>) => hovered === chain;

    // Cubic Bézier S-curves: TC -> TFO
    const PATH_TC0_TFO0 = "M 125 46 C 162.5 46, 162.5 66, 200 66";
    const PATH_TC1_TFO0 = "M 125 78 C 162.5 78, 162.5 66, 200 66";
    const PATH_TC2_TFO0 = "M 125 110 C 162.5 110, 162.5 66, 200 66";
    const PATH_TC3_TFO1 = "M 125 142 C 162.5 142, 162.5 136, 200 136";

    // Cubic Bézier curves: TFO -> TI
    const PATH_TFO0_TI0 = "M 365 66 C 402.5 66, 402.5 66, 440 66";
    const PATH_TFO1_TI1 = "M 365 136 C 402.5 136, 402.5 136, 440 136";

    const TTY_TC_PATHS = [PATH_TC0_TFO0, PATH_TC1_TFO0, PATH_TC2_TFO0];

    return (
        <div className="w-full my-6 select-none flex flex-col items-center justify-center not-prose">
            <div className="w-full max-w-lg relative flex flex-col items-center">
                <svg
                    viewBox="0 0 580 185"
                    className="w-full h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter id="glow-ktables" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* COLUMN HEADERS */}
                    <text
                        x="77.5"
                        y="16"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="font-mono text-[9px] font-semibold tracking-widest fill-slate-500 uppercase"
                    >
                        TC (PCB)
                    </text>
                    <text
                        x="282.5"
                        y="16"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="font-mono text-[9px] font-semibold tracking-widest fill-slate-500 uppercase"
                    >
                        TFO (Sistema)
                    </text>
                    <text
                        x="495"
                        y="16"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="font-mono text-[9px] font-semibold tracking-widest fill-slate-500 uppercase"
                    >
                        TI (Sistema)
                    </text>

                    {/* BASE BLUEPRINT TRACKS */}
                    <path d={PATH_TC0_TFO0} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" />
                    <path d={PATH_TC1_TFO0} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" />
                    <path d={PATH_TC2_TFO0} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" />
                    <path d={PATH_TC3_TFO1} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" />
                    <path d={PATH_TFO0_TI0} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" />
                    <path d={PATH_TFO1_TI1} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" />

                    {/* ACTIVE MAPPING CURVES: TTY CHAIN */}
                    {TTY_TC_PATHS.map((d, idx) => (
                        <motion.path
                            key={`tty-curve-${idx}`}
                            d={d}
                            stroke="#38bdf8"
                            strokeWidth={isLit('tty') ? 2.2 : 1.5}
                            strokeLinecap="round"
                            animate={{ opacity: isFaded('tty') ? 0.15 : 0.9 }}
                            transition={{ duration: 0.2 }}
                            filter={isLit('tty') ? "url(#glow-ktables)" : undefined}
                        />
                    ))}
                    <motion.path
                        d={PATH_TFO0_TI0}
                        stroke="#a78bfa"
                        strokeWidth={isLit('tty') ? 2.2 : 1.5}
                        strokeLinecap="round"
                        animate={{ opacity: isFaded('tty') ? 0.15 : 0.9 }}
                        transition={{ duration: 0.2 }}
                        filter={isLit('tty') ? "url(#glow-ktables)" : undefined}
                    />

                    {/* ACTIVE MAPPING CURVES: FILE CHAIN */}
                    <motion.path
                        d={PATH_TC3_TFO1}
                        stroke="#34d399"
                        strokeWidth={isLit('file') ? 2.2 : 1.5}
                        strokeLinecap="round"
                        animate={{ opacity: isFaded('file') ? 0.15 : 0.9 }}
                        transition={{ duration: 0.2 }}
                        filter={isLit('file') ? "url(#glow-ktables)" : undefined}
                    />
                    <motion.path
                        d={PATH_TFO1_TI1}
                        stroke="#fbbf24"
                        strokeWidth={isLit('file') ? 2.2 : 1.5}
                        strokeLinecap="round"
                        animate={{ opacity: isFaded('file') ? 0.15 : 0.9 }}
                        transition={{ duration: 0.2 }}
                        filter={isLit('file') ? "url(#glow-ktables)" : undefined}
                    />

                    {/* KINETIC PARTICLES: TC 1 -> TFO 0 -> TI 0 */}
                    <g opacity={isFaded('tty') ? 0.15 : 1} className="transition-opacity duration-200">
                        <motion.circle
                            r={2.5}
                            fill="#38bdf8"
                            filter="url(#glow-ktables)"
                            initial={{ offsetDistance: "0%", opacity: 0 }}
                            animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                            transition={{
                                duration: 0.85,
                                repeat: Infinity,
                                repeatDelay: 1.55,
                                ease: "easeInOut",
                            }}
                            style={{ offsetPath: `path("${PATH_TC1_TFO0}")` }}
                        />
                        <motion.circle
                            r={2.5}
                            fill="#a78bfa"
                            filter="url(#glow-ktables)"
                            initial={{ offsetDistance: "0%", opacity: 0 }}
                            animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                            transition={{
                                duration: 0.85,
                                repeat: Infinity,
                                repeatDelay: 1.55,
                                delay: 0.95,
                                ease: "easeInOut",
                            }}
                            style={{ offsetPath: `path("${PATH_TFO0_TI0}")` }}
                        />
                    </g>

                    {/* KINETIC PARTICLES: TC 3 -> TFO 1 -> TI 1 */}
                    <g opacity={isFaded('file') ? 0.15 : 1} className="transition-opacity duration-200">
                        <motion.circle
                            r={2.5}
                            fill="#34d399"
                            filter="url(#glow-ktables)"
                            initial={{ offsetDistance: "0%", opacity: 0 }}
                            animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                            transition={{
                                duration: 0.85,
                                repeat: Infinity,
                                repeatDelay: 1.55,
                                delay: 1.2,
                                ease: "easeInOut",
                            }}
                            style={{ offsetPath: `path("${PATH_TC3_TFO1}")` }}
                        />
                        <motion.circle
                            r={2.5}
                            fill="#fbbf24"
                            filter="url(#glow-ktables)"
                            initial={{ offsetDistance: "0%", opacity: 0 }}
                            animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                            transition={{
                                duration: 0.85,
                                repeat: Infinity,
                                repeatDelay: 1.55,
                                delay: 2.15,
                                ease: "easeInOut",
                            }}
                            style={{ offsetPath: `path("${PATH_TFO1_TI1}")` }}
                        />
                    </g>

                    {/* LEFT: TC SLOTS (PCB) */}
                    {TC_SLOTS.map((slot) => (
                        <g
                            key={`tc-${slot.fd}`}
                            onMouseEnter={() => setHovered(slot.chain)}
                            onMouseLeave={() => setHovered(null)}
                            className="cursor-pointer transition-opacity duration-200"
                            opacity={isFaded(slot.chain) ? 0.25 : 1}
                        >
                            <rect
                                x="30"
                                y={slot.y}
                                width="95"
                                height="24"
                                rx="6"
                                fill="#0b0f19"
                                stroke={slot.stroke}
                                strokeWidth={isLit(slot.chain) ? 1.8 : 1}
                                strokeOpacity={isLit(slot.chain) ? 1 : 0.45}
                                filter={isLit(slot.chain) ? "url(#glow-ktables)" : undefined}
                            />
                            <text
                                x="42"
                                y={slot.cy}
                                textAnchor="start"
                                dominantBaseline="central"
                                className={`font-mono text-[9.5px] font-bold tracking-wider pointer-events-none ${slot.labelClass}`}
                            >
                                fd {slot.fd}
                            </text>
                            <line
                                x1="88"
                                y1={slot.y + 5}
                                x2="88"
                                y2={slot.y + 19}
                                stroke={slot.stroke}
                                strokeWidth="1"
                                strokeOpacity="0.25"
                            />
                            <text
                                x="106.5"
                                y={slot.cy}
                                textAnchor="middle"
                                dominantBaseline="central"
                                className={`font-mono text-[9.5px] font-bold tracking-wider pointer-events-none ${slot.targetClass}`}
                            >
                                {slot.target}
                            </text>
                            <circle cx="125" cy={slot.cy} r="2.5" fill={slot.stroke} />
                        </g>
                    ))}

                    {/* CENTER: TFO 0 */}
                    <g
                        onMouseEnter={() => setHovered('tty')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer transition-opacity duration-200"
                        opacity={isFaded('tty') ? 0.25 : 1}
                    >
                        <rect
                            x="200"
                            y="44"
                            width="165"
                            height="44"
                            rx="8"
                            fill="#0b0f19"
                            stroke="#38bdf8"
                            strokeWidth={isLit('tty') ? 1.8 : 1}
                            strokeOpacity={isLit('tty') ? 1 : 0.45}
                            filter={isLit('tty') ? "url(#glow-ktables)" : undefined}
                        />
                        <text
                            x="282.5"
                            y="58"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[10px] font-bold fill-sky-300 tracking-wider pointer-events-none"
                        >
                            TFO 0 · rw
                        </text>
                        <text
                            x="282.5"
                            y="75"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[8.5px] fill-sky-400/80 tracking-wider pointer-events-none"
                        >
                            {'refs: 3\u00A0\u00A0pos: -'}
                        </text>
                        <circle cx="200" cy="66" r="2.5" fill="#38bdf8" />
                        <circle cx="365" cy="66" r="2.5" fill="#a78bfa" />
                    </g>

                    {/* CENTER: TFO 1 */}
                    <g
                        onMouseEnter={() => setHovered('file')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer transition-opacity duration-200"
                        opacity={isFaded('file') ? 0.25 : 1}
                    >
                        <rect
                            x="200"
                            y="114"
                            width="165"
                            height="44"
                            rx="8"
                            fill="#0b0f19"
                            stroke="#34d399"
                            strokeWidth={isLit('file') ? 1.8 : 1}
                            strokeOpacity={isLit('file') ? 1 : 0.45}
                            filter={isLit('file') ? "url(#glow-ktables)" : undefined}
                        />
                        <text
                            x="282.5"
                            y="128"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[10px] font-bold fill-emerald-300 tracking-wider pointer-events-none"
                        >
                            TFO 1 · r
                        </text>
                        <text
                            x="282.5"
                            y="145"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[8.5px] fill-emerald-400/80 tracking-wider pointer-events-none"
                        >
                            {'refs: 1\u00A0\u00A0pos: 0'}
                        </text>
                        <circle cx="200" cy="136" r="2.5" fill="#34d399" />
                        <circle cx="365" cy="136" r="2.5" fill="#fbbf24" />
                    </g>

                    {/* RIGHT: TI 0 */}
                    <g
                        onMouseEnter={() => setHovered('tty')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer transition-opacity duration-200"
                        opacity={isFaded('tty') ? 0.25 : 1}
                    >
                        <rect
                            x="440"
                            y="44"
                            width="110"
                            height="44"
                            rx="8"
                            fill="#0b0f19"
                            stroke="#a78bfa"
                            strokeWidth={isLit('tty') ? 1.8 : 1}
                            strokeOpacity={isLit('tty') ? 1 : 0.45}
                            filter={isLit('tty') ? "url(#glow-ktables)" : undefined}
                        />
                        <text
                            x="495"
                            y="58"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[10px] font-bold fill-purple-300 tracking-wider pointer-events-none"
                        >
                            TI 0 · tty0
                        </text>
                        <text
                            x="495"
                            y="75"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[8.5px] fill-purple-400/80 tracking-wider pointer-events-none"
                        >
                            refs: 1 · c
                        </text>
                        <circle cx="440" cy="66" r="2.5" fill="#a78bfa" />
                    </g>

                    {/* RIGHT: TI 1 */}
                    <g
                        onMouseEnter={() => setHovered('file')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer transition-opacity duration-200"
                        opacity={isFaded('file') ? 0.25 : 1}
                    >
                        <rect
                            x="440"
                            y="114"
                            width="110"
                            height="44"
                            rx="8"
                            fill="#0b0f19"
                            stroke="#fbbf24"
                            strokeWidth={isLit('file') ? 1.8 : 1}
                            strokeOpacity={isLit('file') ? 1 : 0.45}
                            filter={isLit('file') ? "url(#glow-ktables)" : undefined}
                        />
                        <text
                            x="495"
                            y="128"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[10px] font-bold fill-amber-300 tracking-wider pointer-events-none"
                        >
                            TI 1 · f.txt
                        </text>
                        <text
                            x="495"
                            y="145"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[8.5px] fill-amber-400/80 tracking-wider pointer-events-none"
                        >
                            refs: 1 · reg
                        </text>
                        <circle cx="440" cy="136" r="2.5" fill="#fbbf24" />
                    </g>
                </svg>
            </div>
        </div>
    );
}
