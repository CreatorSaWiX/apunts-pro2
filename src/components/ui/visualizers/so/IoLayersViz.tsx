"use client";

import { useState } from 'react';
import { m as motion } from 'framer-motion';

type FlowId = 'tty' | 'disk' | null;

interface LayerNode {
    x: number;
    width: number;
    label: string;
    hasLeftPort: boolean;
    hasRightPort: boolean;
}

const COLUMNS: readonly { x: number; width: number; cx: number; header: string }[] = [
    { x: 22,  width: 86,  cx: 65,  header: '1. VIRTUAL' },
    { x: 152, width: 114, cx: 209, header: '2. LÒGIC (VFS)' },
    { x: 310, width: 118, cx: 369, header: '3. FÍSIC' },
    { x: 472, width: 86,  cx: 515, header: 'HW' },
];

const TTY_NODES: readonly LayerNode[] = [
    { x: 22,  width: 86,  label: 'fd 0',        hasLeftPort: false, hasRightPort: true },
    { x: 152, width: 114, label: '/dev/tty0',   hasLeftPort: true,  hasRightPort: true },
    { x: 310, width: 118, label: 'c · (136,0)', hasLeftPort: true,  hasRightPort: true },
    { x: 472, width: 86,  label: 'TTY',         hasLeftPort: true,  hasRightPort: false },
];

const DISK_NODES: readonly LayerNode[] = [
    { x: 22,  width: 86,  label: 'fd 3',      hasLeftPort: false, hasRightPort: true },
    { x: 152, width: 114, label: 'dades.txt', hasLeftPort: true,  hasRightPort: true },
    { x: 310, width: 118, label: 'b · (8,1)', hasLeftPort: true,  hasRightPort: true },
    { x: 472, width: 86,  label: 'Disc',      hasLeftPort: true,  hasRightPort: false },
];

const SEGMENT_X: readonly [number, number][] = [
    [108, 152],
    [266, 310],
    [428, 472],
];

export default function IoLayersViz() {
    const [hovered, setHovered] = useState<FlowId>(null);

    const isFaded = (flow: Exclude<FlowId, null>) => hovered !== null && hovered !== flow;
    const isLit   = (flow: Exclude<FlowId, null>) => hovered === flow;

    const ttyCy  = 64;  // y=46, height=36 -> center 64
    const diskCy = 124; // y=106, height=36 -> center 124

    const ttyPaths  = SEGMENT_X.map(([x1, x2]) => `M ${x1} ${ttyCy} L ${x2} ${ttyCy}`);
    const diskPaths = SEGMENT_X.map(([x1, x2]) => `M ${x1} ${diskCy} L ${x2} ${diskCy}`);

    return (
        <div className="w-full my-6 select-none flex flex-col items-center justify-center not-prose">
            <div className="w-full max-w-lg relative flex flex-col items-center">
                <svg
                    viewBox="0 0 580 155"
                    className="w-full h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter id="glow-iolayers" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* COLUMN HEADERS */}
                    {COLUMNS.map((col) => (
                        <text
                            key={col.header}
                            x={col.cx}
                            y="16"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[9px] font-semibold tracking-widest fill-slate-500 uppercase"
                        >
                            {col.header}
                        </text>
                    ))}

                    {/* SUBTLE OS / HW BOUNDARY */}
                    <line
                        x1="450"
                        y1="10"
                        x2="450"
                        y2="146"
                        className="stroke-slate-300/20 dark:stroke-white/[0.07]"
                        strokeWidth="1"
                        strokeDasharray="3 3"
                    />

                    {/* BASE BLUEPRINT TRACKS */}
                    {ttyPaths.map((d, idx) => (
                        <path
                            key={`bp-tty-${idx}`}
                            d={d}
                            className="stroke-slate-300/25 dark:stroke-white/[0.08]"
                            strokeWidth="1.2"
                        />
                    ))}
                    {diskPaths.map((d, idx) => (
                        <path
                            key={`bp-disk-${idx}`}
                            d={d}
                            className="stroke-slate-300/25 dark:stroke-white/[0.08]"
                            strokeWidth="1.2"
                        />
                    ))}

                    {/* ACTIVE FLOW PATHS: TTY */}
                    {ttyPaths.map((d, idx) => (
                        <motion.path
                            key={`act-tty-${idx}`}
                            d={d}
                            stroke="#38bdf8"
                            strokeWidth={isLit('tty') ? 2.2 : 1.5}
                            strokeLinecap="round"
                            animate={{ opacity: isFaded('tty') ? 0.15 : 0.9 }}
                            transition={{ duration: 0.2 }}
                            filter={isLit('tty') ? "url(#glow-iolayers)" : undefined}
                        />
                    ))}

                    {/* ACTIVE FLOW PATHS: DISK */}
                    {diskPaths.map((d, idx) => (
                        <motion.path
                            key={`act-disk-${idx}`}
                            d={d}
                            stroke="#34d399"
                            strokeWidth={isLit('disk') ? 2.2 : 1.5}
                            strokeLinecap="round"
                            animate={{ opacity: isFaded('disk') ? 0.15 : 0.9 }}
                            transition={{ duration: 0.2 }}
                            filter={isLit('disk') ? "url(#glow-iolayers)" : undefined}
                        />
                    ))}

                    {/* KINETIC PARTICLES: TTY */}
                    <g opacity={isFaded('tty') ? 0.15 : 1} className="transition-opacity duration-200">
                        {ttyPaths.map((d, idx) => (
                            <motion.circle
                                key={`pt-tty-${idx}`}
                                r={2.5}
                                fill="#38bdf8"
                                filter="url(#glow-iolayers)"
                                initial={{ offsetDistance: "0%", opacity: 0 }}
                                animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                                transition={{
                                    duration: 0.65,
                                    repeat: Infinity,
                                    repeatDelay: 1.75,
                                    delay: idx * 0.75,
                                    ease: "easeInOut",
                                }}
                                style={{ offsetPath: `path("${d}")` }}
                            />
                        ))}
                    </g>

                    {/* KINETIC PARTICLES: DISK */}
                    <g opacity={isFaded('disk') ? 0.15 : 1} className="transition-opacity duration-200">
                        {diskPaths.map((d, idx) => (
                            <motion.circle
                                key={`pt-disk-${idx}`}
                                r={2.5}
                                fill="#34d399"
                                filter="url(#glow-iolayers)"
                                initial={{ offsetDistance: "0%", opacity: 0 }}
                                animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                                transition={{
                                    duration: 0.65,
                                    repeat: Infinity,
                                    repeatDelay: 1.75,
                                    delay: 1.15 + idx * 0.75,
                                    ease: "easeInOut",
                                }}
                                style={{ offsetPath: `path("${d}")` }}
                            />
                        ))}
                    </g>

                    {/* ROW 1 NODES: TTY (SKY #38bdf8) */}
                    {TTY_NODES.map((node) => (
                        <g
                            key={`tty-${node.label}`}
                            onMouseEnter={() => setHovered('tty')}
                            onMouseLeave={() => setHovered(null)}
                            className="cursor-pointer transition-opacity duration-200"
                            opacity={isFaded('tty') ? 0.25 : 1}
                        >
                            <rect
                                x={node.x}
                                y="46"
                                width={node.width}
                                height="36"
                                rx="8"
                                fill="#0b0f19"
                                stroke="#38bdf8"
                                strokeWidth={isLit('tty') ? 1.8 : 1}
                                strokeOpacity={isLit('tty') ? 1 : 0.45}
                                filter={isLit('tty') ? "url(#glow-iolayers)" : undefined}
                            />
                            <text
                                x={node.x + node.width / 2}
                                y={ttyCy}
                                textAnchor="middle"
                                dominantBaseline="central"
                                className="font-mono text-[10px] font-bold fill-sky-300 tracking-wider pointer-events-none"
                            >
                                {node.label}
                            </text>
                            {node.hasLeftPort && <circle cx={node.x} cy={ttyCy} r="2.5" fill="#38bdf8" />}
                            {node.hasRightPort && <circle cx={node.x + node.width} cy={ttyCy} r="2.5" fill="#38bdf8" />}
                        </g>
                    ))}

                    {/* ROW 2 NODES: DISK (EMERALD #34d399) */}
                    {DISK_NODES.map((node) => (
                        <g
                            key={`disk-${node.label}`}
                            onMouseEnter={() => setHovered('disk')}
                            onMouseLeave={() => setHovered(null)}
                            className="cursor-pointer transition-opacity duration-200"
                            opacity={isFaded('disk') ? 0.25 : 1}
                        >
                            <rect
                                x={node.x}
                                y="106"
                                width={node.width}
                                height="36"
                                rx="8"
                                fill="#0b0f19"
                                stroke="#34d399"
                                strokeWidth={isLit('disk') ? 1.8 : 1}
                                strokeOpacity={isLit('disk') ? 1 : 0.45}
                                filter={isLit('disk') ? "url(#glow-iolayers)" : undefined}
                            />
                            <text
                                x={node.x + node.width / 2}
                                y={diskCy}
                                textAnchor="middle"
                                dominantBaseline="central"
                                className="font-mono text-[10px] font-bold fill-emerald-300 tracking-wider pointer-events-none"
                            >
                                {node.label}
                            </text>
                            {node.hasLeftPort && <circle cx={node.x} cy={diskCy} r="2.5" fill="#34d399" />}
                            {node.hasRightPort && <circle cx={node.x + node.width} cy={diskCy} r="2.5" fill="#34d399" />}
                        </g>
                    ))}
                </svg>
            </div>
        </div>
    );
}
