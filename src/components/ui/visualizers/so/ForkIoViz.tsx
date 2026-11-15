"use client";

import { useState } from 'react';
import { m as motion } from 'framer-motion';

type ForkMode = 'before' | 'after';
type HoverBranch = 'pare' | 'fill' | 'tfo' | 'ti' | null;

const PATH_PARE_BEFORE = "M 140 47 C 178 47, 178 80, 215 80";
const PATH_FILL_BEFORE = "M 140 113 C 178 113, 178 80, 215 80";
const PATH_TFO_TI_BEFORE = "M 350 80 L 425 80";

const PATH_PARE_AFTER = "M 140 47 L 215 47";
const PATH_FILL_AFTER = "M 140 113 L 215 113";
const PATH_TFOA_TI = "M 350 47 C 388 47, 388 80, 425 80";
const PATH_TFOB_TI = "M 350 113 C 388 113, 388 80, 425 80";

export default function ForkIoViz() {
    const [mode, setMode] = useState<ForkMode>('before');
    const [hovered, setHovered] = useState<HoverBranch>(null);

    const switchMode = (next: ForkMode) => {
        setMode(next);
        setHovered(null);
    };

    const isPareLit = hovered === 'pare';
    const isFillLit = hovered === 'fill';
    const isTfoLit = hovered === 'tfo';
    const isTiLit = hovered === 'ti';

    const isPareFaded = hovered === 'fill' || hovered === 'ti';
    const isFillFaded = hovered === 'pare' || hovered === 'ti';
    const isSharedTfoFaded = false;
    const isTiFaded = false;

    return (
        <div className="w-full my-6 select-none flex flex-col items-center justify-center not-prose">
            <div className="w-full max-w-lg relative flex flex-col items-center">

                {/* Minimalist Switcher */}
                <div className="flex items-center gap-1 p-0.5 rounded-full bg-slate-900/60 border border-white/5 mb-3">
                    {([
                        { id: 'before', label: 'open() abans de fork()' },
                        { id: 'after', label: 'open() després de fork()' },
                    ] as const).map((item) => {
                        const isActive = mode === item.id;
                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => switchMode(item.id)}
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
                        <filter id="glow-forkio" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* COLUMN HEADERS */}
                    <text
                        x="87.5"
                        y="14"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="font-mono text-[9px] font-semibold tracking-widest fill-slate-500 uppercase"
                    >
                        TC
                    </text>
                    <text
                        x="282.5"
                        y="14"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="font-mono text-[9px] font-semibold tracking-widest fill-slate-500 uppercase"
                    >
                        TFO
                    </text>
                    <text
                        x="475"
                        y="14"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="font-mono text-[9px] font-semibold tracking-widest fill-slate-500 uppercase"
                    >
                        TI
                    </text>

                    {/* TRAJECTORIES & PARTICLES */}
                    {mode === 'before' ? (
                        <g>
                            {/* Base Blueprint Tracks */}
                            <path d={PATH_PARE_BEFORE} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" />
                            <path d={PATH_FILL_BEFORE} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" />
                            <path d={PATH_TFO_TI_BEFORE} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" />

                            {/* Active Paths */}
                            <motion.path
                                d={PATH_PARE_BEFORE}
                                stroke="#38bdf8"
                                strokeWidth={isPareLit ? 2.2 : 1.5}
                                strokeLinecap="round"
                                animate={{ opacity: isPareFaded ? 0.15 : 0.9 }}
                                transition={{ duration: 0.2 }}
                                filter={isPareLit ? "url(#glow-forkio)" : undefined}
                            />
                            <motion.path
                                d={PATH_FILL_BEFORE}
                                stroke="#818cf8"
                                strokeWidth={isFillLit ? 2.2 : 1.5}
                                strokeLinecap="round"
                                animate={{ opacity: isFillFaded ? 0.15 : 0.9 }}
                                transition={{ duration: 0.2 }}
                                filter={isFillLit ? "url(#glow-forkio)" : undefined}
                            />
                            <motion.path
                                d={PATH_TFO_TI_BEFORE}
                                stroke="#c084fc"
                                strokeWidth={isTfoLit || isTiLit || isPareLit || isFillLit ? 2.2 : 1.5}
                                strokeLinecap="round"
                                animate={{ opacity: 0.9 }}
                                transition={{ duration: 0.2 }}
                            />

                            {/* Kinetic Particles */}
                            <g opacity={isPareFaded ? 0.15 : 1}>
                                <motion.circle
                                    key={`pare-${mode}`}
                                    r={2.5}
                                    fill="#38bdf8"
                                    filter="url(#glow-forkio)"
                                    initial={{ offsetDistance: "0%", opacity: 0 }}
                                    animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                                    transition={{ duration: 2.0, repeat: Infinity, ease: "easeInOut" }}
                                    style={{ offsetPath: `path("${PATH_PARE_BEFORE}")` }}
                                />
                            </g>
                            <g opacity={isFillFaded ? 0.15 : 1}>
                                <motion.circle
                                    key={`fill-${mode}`}
                                    r={2.5}
                                    fill="#818cf8"
                                    filter="url(#glow-forkio)"
                                    initial={{ offsetDistance: "0%", opacity: 0 }}
                                    animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                                    transition={{ duration: 2.0, repeat: Infinity, delay: 0.45, ease: "easeInOut" }}
                                    style={{ offsetPath: `path("${PATH_FILL_BEFORE}")` }}
                                />
                            </g>
                            <motion.circle
                                key={`tfo-ti-${mode}`}
                                r={2.5}
                                fill="#c084fc"
                                filter="url(#glow-forkio)"
                                initial={{ offsetDistance: "0%", opacity: 0 }}
                                animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                                transition={{ duration: 1.7, repeat: Infinity, delay: 0.85, ease: "easeInOut" }}
                                style={{ offsetPath: `path("${PATH_TFO_TI_BEFORE}")` }}
                            />
                        </g>
                    ) : (
                        <g>
                            {/* Base Blueprint Tracks */}
                            <path d={PATH_PARE_AFTER} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" />
                            <path d={PATH_FILL_AFTER} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" />
                            <path d={PATH_TFOA_TI} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" />
                            <path d={PATH_TFOB_TI} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" />

                            {/* Active Paths */}
                            <motion.path
                                d={PATH_PARE_AFTER}
                                stroke="#38bdf8"
                                strokeWidth={isPareLit ? 2.2 : 1.5}
                                strokeLinecap="round"
                                animate={{ opacity: isPareFaded ? 0.15 : 0.9 }}
                                transition={{ duration: 0.2 }}
                            />
                            <motion.path
                                d={PATH_FILL_AFTER}
                                stroke="#818cf8"
                                strokeWidth={isFillLit ? 2.2 : 1.5}
                                strokeLinecap="round"
                                animate={{ opacity: isFillFaded ? 0.15 : 0.9 }}
                                transition={{ duration: 0.2 }}
                            />
                            <motion.path
                                d={PATH_TFOA_TI}
                                stroke="#38bdf8"
                                strokeWidth={isPareLit || isTiLit ? 2.2 : 1.5}
                                strokeLinecap="round"
                                animate={{ opacity: hovered === 'fill' ? 0.15 : 0.9 }}
                                transition={{ duration: 0.2 }}
                                filter={isPareLit || isTiLit ? "url(#glow-forkio)" : undefined}
                            />
                            <motion.path
                                d={PATH_TFOB_TI}
                                stroke="#818cf8"
                                strokeWidth={isFillLit || isTiLit ? 2.2 : 1.5}
                                strokeLinecap="round"
                                animate={{ opacity: hovered === 'pare' ? 0.15 : 0.9 }}
                                transition={{ duration: 0.2 }}
                                filter={isFillLit || isTiLit ? "url(#glow-forkio)" : undefined}
                            />

                            {/* Kinetic Particles */}
                            <g opacity={isPareFaded ? 0.15 : 1}>
                                <motion.circle
                                    key={`pare-${mode}`}
                                    r={2.5}
                                    fill="#38bdf8"
                                    filter="url(#glow-forkio)"
                                    initial={{ offsetDistance: "0%", opacity: 0 }}
                                    animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                                    transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
                                    style={{ offsetPath: `path("${PATH_PARE_AFTER}")` }}
                                />
                            </g>
                            <g opacity={isFillFaded ? 0.15 : 1}>
                                <motion.circle
                                    key={`fill-${mode}`}
                                    r={2.5}
                                    fill="#818cf8"
                                    filter="url(#glow-forkio)"
                                    initial={{ offsetDistance: "0%", opacity: 0 }}
                                    animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                                    transition={{ duration: 1.7, repeat: Infinity, delay: 0.4, ease: "easeInOut" }}
                                    style={{ offsetPath: `path("${PATH_FILL_AFTER}")` }}
                                />
                            </g>
                            <g opacity={hovered === 'fill' ? 0.15 : 1}>
                                <motion.circle
                                    key={`tfoa-ti-${mode}`}
                                    r={2.5}
                                    fill="#38bdf8"
                                    filter="url(#glow-forkio)"
                                    initial={{ offsetDistance: "0%", opacity: 0 }}
                                    animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                                    transition={{ duration: 2.0, repeat: Infinity, delay: 0.7, ease: "easeInOut" }}
                                    style={{ offsetPath: `path("${PATH_TFOA_TI}")` }}
                                />
                            </g>
                            <g opacity={hovered === 'pare' ? 0.15 : 1}>
                                <motion.circle
                                    key={`tfob-ti-${mode}`}
                                    r={2.5}
                                    fill="#818cf8"
                                    filter="url(#glow-forkio)"
                                    initial={{ offsetDistance: "0%", opacity: 0 }}
                                    animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                                    transition={{ duration: 2.0, repeat: Infinity, delay: 1.1, ease: "easeInOut" }}
                                    style={{ offsetPath: `path("${PATH_TFOB_TI}")` }}
                                />
                            </g>
                        </g>
                    )}

                    {/* LEFT COLUMN: TC (PARE & FILL) */}
                    <g
                        onMouseEnter={() => setHovered('pare')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer transition-opacity duration-200"
                        opacity={isPareFaded ? 0.25 : 1}
                    >
                        <rect
                            x="35"
                            y="30"
                            width="105"
                            height="34"
                            rx="8"
                            fill="#0b0f19"
                            stroke="#38bdf8"
                            strokeWidth={isPareLit ? 1.8 : 1.1}
                            strokeOpacity={isPareLit ? 1 : 0.55}
                            filter={isPareLit ? "url(#glow-forkio)" : undefined}
                        />
                        <text
                            x="87.5"
                            y="47"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[9.5px] font-bold fill-sky-300 tracking-wider pointer-events-none"
                        >
                            Pare · TC[3]
                        </text>
                        <circle cx="140" cy="47" r="2.5" fill="#38bdf8" />
                    </g>

                    <g
                        onMouseEnter={() => setHovered('fill')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer transition-opacity duration-200"
                        opacity={isFillFaded ? 0.25 : 1}
                    >
                        <rect
                            x="35"
                            y="96"
                            width="105"
                            height="34"
                            rx="8"
                            fill="#0b0f19"
                            stroke="#818cf8"
                            strokeWidth={isFillLit ? 1.8 : 1.1}
                            strokeOpacity={isFillLit ? 1 : 0.55}
                            filter={isFillLit ? "url(#glow-forkio)" : undefined}
                        />
                        <text
                            x="87.5"
                            y="113"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[9.5px] font-bold fill-indigo-300 tracking-wider pointer-events-none"
                        >
                            Fill · TC[3]
                        </text>
                        <circle cx="140" cy="113" r="2.5" fill="#818cf8" />
                    </g>

                    {/* CENTER COLUMN: TFO */}
                    {mode === 'before' ? (
                        <g
                            onMouseEnter={() => setHovered('tfo')}
                            onMouseLeave={() => setHovered(null)}
                            className="cursor-pointer transition-opacity duration-200"
                            opacity={isSharedTfoFaded ? 0.25 : 1}
                        >
                            <rect
                                x="215"
                                y="61"
                                width="135"
                                height="38"
                                rx="8"
                                fill="#0b0f19"
                                stroke="#c084fc"
                                strokeWidth={isTfoLit ? 1.8 : 1.2}
                                strokeOpacity={isTfoLit ? 1 : 0.65}
                                filter={isTfoLit ? "url(#glow-forkio)" : undefined}
                            />
                            <text
                                x="282.5"
                                y="73"
                                textAnchor="middle"
                                dominantBaseline="central"
                                className="font-mono text-[9.5px] font-bold fill-purple-300 tracking-wider pointer-events-none"
                            >
                                TFO · refs: 2
                            </text>
                            <text
                                x="282.5"
                                y="88"
                                textAnchor="middle"
                                dominantBaseline="central"
                                className="font-mono text-[8px] font-semibold fill-purple-400/80 tracking-wider pointer-events-none"
                            >
                                pos_le compartit
                            </text>
                            <circle cx="215" cy="80" r="2.5" fill="#c084fc" />
                            <circle cx="350" cy="80" r="2.5" fill="#c084fc" />
                        </g>
                    ) : (
                        <g>
                            <g
                                onMouseEnter={() => setHovered('pare')}
                                onMouseLeave={() => setHovered(null)}
                                className="cursor-pointer transition-opacity duration-200"
                                opacity={hovered === 'fill' ? 0.25 : 1}
                            >
                                <rect
                                    x="215"
                                    y="30"
                                    width="135"
                                    height="34"
                                    rx="8"
                                    fill="#0b0f19"
                                    stroke="#38bdf8"
                                    strokeWidth={isPareLit ? 1.8 : 1.1}
                                    strokeOpacity={isPareLit ? 1 : 0.55}
                                    filter={isPareLit ? "url(#glow-forkio)" : undefined}
                                />
                                <text
                                    x="282.5"
                                    y="47"
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    className="font-mono text-[9.5px] font-bold fill-sky-300 tracking-wider pointer-events-none"
                                >
                                    TFO A · pos: 0
                                </text>
                                <circle cx="215" cy="47" r="2.5" fill="#38bdf8" />
                                <circle cx="350" cy="47" r="2.5" fill="#38bdf8" />
                            </g>

                            <g
                                onMouseEnter={() => setHovered('fill')}
                                onMouseLeave={() => setHovered(null)}
                                className="cursor-pointer transition-opacity duration-200"
                                opacity={hovered === 'pare' ? 0.25 : 1}
                            >
                                <rect
                                    x="215"
                                    y="96"
                                    width="135"
                                    height="34"
                                    rx="8"
                                    fill="#0b0f19"
                                    stroke="#818cf8"
                                    strokeWidth={isFillLit ? 1.8 : 1.1}
                                    strokeOpacity={isFillLit ? 1 : 0.55}
                                    filter={isFillLit ? "url(#glow-forkio)" : undefined}
                                />
                                <text
                                    x="282.5"
                                    y="113"
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    className="font-mono text-[9.5px] font-bold fill-indigo-300 tracking-wider pointer-events-none"
                                >
                                    TFO B · pos: 0
                                </text>
                                <circle cx="215" cy="113" r="2.5" fill="#818cf8" />
                                <circle cx="350" cy="113" r="2.5" fill="#818cf8" />
                            </g>
                        </g>
                    )}

                    {/* RIGHT COLUMN: TI */}
                    <g
                        onMouseEnter={() => setHovered('ti')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer transition-opacity duration-200"
                        opacity={isTiFaded ? 0.25 : 1}
                    >
                        <rect
                            x="425"
                            y="61"
                            width="100"
                            height="38"
                            rx="8"
                            fill="#0b0f19"
                            stroke="#34d399"
                            strokeWidth={isTiLit ? 1.8 : 1.2}
                            strokeOpacity={isTiLit ? 1 : 0.65}
                            filter={isTiLit ? "url(#glow-forkio)" : undefined}
                        />
                        <text
                            x="475"
                            y="73"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[8.5px] font-bold fill-emerald-300 tracking-wide pointer-events-none"
                        >
                            TI · fitxer.txt
                        </text>
                        <text
                            x="475"
                            y="88"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[8px] font-semibold fill-emerald-400/85 tracking-wider pointer-events-none"
                        >
                            {mode === 'before' ? 'refs: 1' : 'refs: 2'}
                        </text>
                        <circle cx="425" cy="80" r="2.5" fill="#34d399" />
                    </g>
                </svg>
            </div>
        </div>
    );
}
