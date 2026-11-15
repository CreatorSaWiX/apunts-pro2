"use client";

import { useState } from 'react';
import { m as motion } from 'framer-motion';

type PipeMode = 'flow' | 'eof' | 'sigpipe';
type HoverNode = 'fill1' | 'pipe' | 'fill2' | null;

const PATH_FILL1_PIPE = "M 135 73 L 215 73";
const PATH_PIPE_FILL2 = "M 345 73 L 425 73";
const PATH_SIGPIPE_BOUNCE = "M 215 66 C 190 32, 155 32, 135 64";

export default function PipeViz() {
    const [mode, setMode] = useState<PipeMode>('flow');
    const [hovered, setHovered] = useState<HoverNode>(null);

    const fill1Closed = mode === 'eof';
    const fill2Closed = mode === 'sigpipe';

    const isNodeFaded = (node: Exclude<HoverNode, null>) => {
        if (node === 'fill1' && fill1Closed) return true;
        if (node === 'fill2' && fill2Closed) return true;
        if (!hovered || hovered === 'pipe' || node === 'pipe') return false;
        return hovered !== node;
    };

    const leftStreamDimmed =
        (hovered === 'fill2') || (mode === 'eof');
    const rightStreamDimmed =
        (hovered === 'fill1') || (mode === 'sigpipe');

    const fill1Color = mode === 'sigpipe' ? '#f43f5e' : '#38bdf8';

    return (
        <div className="w-full my-6 select-none flex flex-col items-center justify-center not-prose">
            <div className="w-full max-w-lg relative flex flex-col items-center">

                {/* Minimalist Switcher */}
                <div className="flex items-center gap-1 p-0.5 rounded-full bg-slate-900/60 border border-white/5 mb-3">
                    {([
                        { id: 'flow', label: 'Flux (pipe)' },
                        { id: 'eof', label: 'EOF (fd[1] tancat)' },
                        { id: 'sigpipe', label: 'SIGPIPE (fd[0] tancat)' },
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
                    viewBox="0 0 560 150"
                    className="w-full h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter id="glow-pipe" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* BASE BLUEPRINT TRACKS */}
                    <path d={PATH_FILL1_PIPE} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" />
                    <path d={PATH_PIPE_FILL2} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" />

                    {/* ACTIVE PATHS & MODE-SPECIFIC SIGNALS */}
                    {mode === 'flow' && (
                        <>
                            <path
                                d={PATH_FILL1_PIPE}
                                stroke="#38bdf8"
                                strokeWidth={hovered === 'fill1' || hovered === 'pipe' ? 2 : 1.5}
                                strokeLinecap="round"
                                filter="url(#glow-pipe)"
                                opacity={leftStreamDimmed ? 0.25 : 0.9}
                            />
                            <path
                                d={PATH_PIPE_FILL2}
                                stroke="#34d399"
                                strokeWidth={hovered === 'fill2' || hovered === 'pipe' ? 2 : 1.5}
                                strokeLinecap="round"
                                filter="url(#glow-pipe)"
                                opacity={rightStreamDimmed ? 0.25 : 0.9}
                            />
                        </>
                    )}

                    {mode === 'eof' && (
                        <>
                            <path
                                d={PATH_PIPE_FILL2}
                                stroke="#34d399"
                                strokeWidth={hovered === 'fill2' || hovered === 'pipe' ? 2 : 1.5}
                                strokeDasharray="3 3"
                                strokeLinecap="round"
                                filter="url(#glow-pipe)"
                                opacity={rightStreamDimmed ? 0.25 : 0.9}
                            />
                            {/* 0 (EOF) badge cleanly above Pipe -> Fill 2 */}
                            <g opacity={rightStreamDimmed ? 0.25 : 1}>
                                <rect
                                    x="359"
                                    y="45"
                                    width="52"
                                    height="18"
                                    rx="9"
                                    fill="#0b0f19"
                                    stroke="#34d399"
                                    strokeWidth="1"
                                    strokeOpacity="0.65"
                                />
                                <text
                                    x="385"
                                    y="54"
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    className="font-mono text-[8px] font-bold fill-emerald-300 tracking-wider pointer-events-none"
                                >
                                    0 (EOF)
                                </text>
                            </g>
                        </>
                    )}

                    {mode === 'sigpipe' && (
                        <>
                            {/* Attempted write track */}
                            <path
                                d="M 135 73 L 208 73"
                                stroke="#f43f5e"
                                strokeWidth="1.4"
                                strokeDasharray="3 3"
                                strokeOpacity="0.55"
                            />
                            {/* Closed reader barrier */}
                            <line
                                x1="208"
                                y1="67"
                                x2="208"
                                y2="79"
                                stroke="#f43f5e"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                filter="url(#glow-pipe)"
                            />
                            {/* SIGPIPE bounce-back curve */}
                            <path
                                d={PATH_SIGPIPE_BOUNCE}
                                stroke="#f43f5e"
                                strokeWidth={hovered === 'fill1' ? 2.2 : 1.7}
                                strokeLinecap="round"
                                filter="url(#glow-pipe)"
                            />
                            {/* SIGPIPE arrowhead pointing at Fill 1 */}
                            <path
                                d="M 139 58 L 135 64 L 142 64"
                                stroke="#f43f5e"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                filter="url(#glow-pipe)"
                            />
                            {/* SIGPIPE pill above bounce curve */}
                            <g>
                                <rect
                                    x="147"
                                    y="11"
                                    width="56"
                                    height="18"
                                    rx="9"
                                    fill="#0b0f19"
                                    stroke="#f43f5e"
                                    strokeWidth="1"
                                    strokeOpacity="0.75"
                                />
                                <text
                                    x="175"
                                    y="20"
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    className="font-mono text-[8px] font-bold fill-rose-300 tracking-wider pointer-events-none"
                                >
                                    SIGPIPE
                                </text>
                            </g>
                        </>
                    )}

                    {/* KINETIC PARTICLES */}
                    {mode === 'flow' && (
                        <>
                            <motion.circle
                                key={`pipe-in-${mode}`}
                                r={2.5}
                                fill="#38bdf8"
                                filter="url(#glow-pipe)"
                                initial={{ offsetDistance: "0%", opacity: 0 }}
                                animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                style={{ offsetPath: `path("${PATH_FILL1_PIPE}")` }}
                            />
                            <motion.circle
                                key={`pipe-out-${mode}`}
                                r={2.5}
                                fill="#34d399"
                                filter="url(#glow-pipe)"
                                initial={{ offsetDistance: "0%", opacity: 0 }}
                                animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: 0.65, ease: "easeInOut" }}
                                style={{ offsetPath: `path("${PATH_PIPE_FILL2}")` }}
                            />
                        </>
                    )}

                    {mode === 'eof' && (
                        <motion.circle
                            key={`pipe-eof-${mode}`}
                            r={2.5}
                            fill="#34d399"
                            filter="url(#glow-pipe)"
                            initial={{ offsetDistance: "0%", opacity: 0 }}
                            animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                            transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
                            style={{ offsetPath: `path("${PATH_PIPE_FILL2}")` }}
                        />
                    )}

                    {mode === 'sigpipe' && (
                        <motion.circle
                            key={`pipe-sig-${mode}`}
                            r={2.5}
                            fill="#f43f5e"
                            filter="url(#glow-pipe)"
                            initial={{ offsetDistance: "0%", opacity: 0 }}
                            animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                            transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
                            style={{ offsetPath: `path("${PATH_SIGPIPE_BOUNCE}")` }}
                        />
                    )}

                    {/* LEFT NODE: Fill 1 · fd[1] */}
                    <g
                        onMouseEnter={() => !fill1Closed && setHovered('fill1')}
                        onMouseLeave={() => setHovered(null)}
                        className={`transition-opacity duration-200 ${fill1Closed ? 'pointer-events-none' : 'cursor-pointer'}`}
                        opacity={isNodeFaded('fill1') ? 0.25 : 1}
                    >
                        <rect
                            x="30"
                            y="54"
                            width="105"
                            height="38"
                            rx="8"
                            fill="#0b0f19"
                            stroke={fill1Closed ? '#64748b' : fill1Color}
                            strokeWidth={hovered === 'fill1' || mode === 'sigpipe' ? 1.8 : 1.2}
                            strokeOpacity={fill1Closed ? 0.5 : hovered === 'fill1' || mode === 'sigpipe' ? 0.95 : 0.65}
                            strokeDasharray={fill1Closed ? "3 3" : undefined}
                            filter={!fill1Closed && (hovered === 'fill1' || mode === 'sigpipe') ? "url(#glow-pipe)" : undefined}
                        />
                        <text
                            x="82.5"
                            y="66"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className={`font-mono text-[9.5px] font-bold tracking-wide pointer-events-none ${
                                fill1Closed
                                    ? 'fill-slate-400'
                                    : mode === 'sigpipe'
                                      ? 'fill-rose-300'
                                      : 'fill-sky-300'
                            }`}
                        >
                            Fill 1 · fd[1]
                        </text>
                        <text
                            x="82.5"
                            y="80"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className={`font-mono text-[8px] font-semibold tracking-wider pointer-events-none ${
                                fill1Closed
                                    ? 'fill-slate-500'
                                    : mode === 'sigpipe'
                                      ? 'fill-rose-400'
                                      : 'fill-sky-400/80'
                            }`}
                        >
                            {fill1Closed ? 'fd[1] ✕' : mode === 'sigpipe' ? 'write() ✕' : 'write()'}
                        </text>
                        <circle cx="135" cy="73" r="2.5" fill={fill1Closed ? '#64748b' : fill1Color} />
                    </g>

                    {/* CENTER NODE: Pipe (RAM) */}
                    <g
                        onMouseEnter={() => setHovered('pipe')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer transition-opacity duration-200"
                    >
                        <rect
                            x="215"
                            y="48"
                            width="130"
                            height="50"
                            rx="10"
                            fill="#0b0f19"
                            stroke="#818cf8"
                            strokeWidth={hovered === 'pipe' ? 1.8 : 1.2}
                            strokeOpacity={hovered === 'pipe' ? 1 : 0.7}
                            filter={hovered === 'pipe' ? "url(#glow-pipe)" : undefined}
                        />
                        <text
                            x="280"
                            y="62"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[10px] font-bold fill-indigo-300 tracking-wider pointer-events-none"
                        >
                            Pipe (RAM)
                        </text>
                        {/* 4 RAM ring-buffer slots */}
                        {[0, 1, 2, 3].map((slotIdx) => {
                            const slotX = 235 + slotIdx * 23;
                            const isFilled = mode === 'flow';
                            return (
                                <rect
                                    key={slotIdx}
                                    x={slotX}
                                    y="75"
                                    width="20"
                                    height="10"
                                    rx="2.5"
                                    fill={isFilled ? (slotIdx < 2 ? '#818cf8' : '#c084fc') : 'transparent'}
                                    fillOpacity={isFilled ? 0.35 + slotIdx * 0.12 : 0}
                                    stroke={isFilled ? '#c084fc' : '#64748b'}
                                    strokeWidth="0.9"
                                    strokeOpacity={isFilled ? 0.75 : 0.3}
                                    strokeDasharray={!isFilled ? "2 2" : undefined}
                                />
                            );
                        })}
                        <circle cx="215" cy="73" r="2.5" fill={mode === 'sigpipe' ? '#f43f5e' : '#818cf8'} />
                        <circle cx="345" cy="73" r="2.5" fill={fill2Closed ? '#64748b' : '#c084fc'} opacity={fill2Closed ? 0.35 : 1} />
                    </g>

                    {/* RIGHT NODE: Fill 2 · fd[0] */}
                    <g
                        onMouseEnter={() => !fill2Closed && setHovered('fill2')}
                        onMouseLeave={() => setHovered(null)}
                        className={`transition-opacity duration-200 ${fill2Closed ? 'pointer-events-none' : 'cursor-pointer'}`}
                        opacity={isNodeFaded('fill2') ? 0.25 : 1}
                    >
                        <rect
                            x="425"
                            y="54"
                            width="105"
                            height="38"
                            rx="8"
                            fill="#0b0f19"
                            stroke={fill2Closed ? '#64748b' : '#34d399'}
                            strokeWidth={hovered === 'fill2' ? 1.8 : 1.2}
                            strokeOpacity={fill2Closed ? 0.5 : hovered === 'fill2' ? 1 : 0.65}
                            strokeDasharray={fill2Closed ? "3 3" : undefined}
                            filter={!fill2Closed && hovered === 'fill2' ? "url(#glow-pipe)" : undefined}
                        />
                        <text
                            x="477.5"
                            y="66"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className={`font-mono text-[9.5px] font-bold tracking-wide pointer-events-none ${
                                fill2Closed ? 'fill-slate-400' : 'fill-emerald-300'
                            }`}
                        >
                            Fill 2 · fd[0]
                        </text>
                        <text
                            x="477.5"
                            y="80"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className={`font-mono text-[8px] font-semibold tracking-wider pointer-events-none ${
                                fill2Closed ? 'fill-slate-500' : 'fill-emerald-400/80'
                            }`}
                        >
                            {fill2Closed ? 'fd[0] ✕' : mode === 'eof' ? 'read() → 0' : 'read()'}
                        </text>
                        <circle cx="425" cy="73" r="2.5" fill={fill2Closed ? '#64748b' : '#34d399'} />
                    </g>

                    {/* BOTTOM FAINT PARENT NOTE */}
                    <g opacity="0.7">
                        <rect
                            x="203"
                            y="116"
                            width="154"
                            height="20"
                            rx="10"
                            fill="#0b0f19"
                            fillOpacity="0.6"
                            stroke="#64748b"
                            strokeWidth="0.9"
                            strokeOpacity="0.3"
                            strokeDasharray="2 2"
                        />
                        <text
                            x="280"
                            y="126"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[8px] font-medium fill-slate-400 tracking-wide pointer-events-none"
                        >
                            Pare: close(fd[0], fd[1])
                        </text>
                    </g>
                </svg>
            </div>
        </div>
    );
}
