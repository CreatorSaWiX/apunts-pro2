"use client";

import React, { useState } from 'react';
import { m as motion } from 'framer-motion';

type Mode = 'multi' | 'single';
type SharedId = 'text' | 'data' | 'files';
type ThreadId = 't1' | 't2' | 't3';
type ActiveItem = SharedId | ThreadId | null;

interface SharedBlock {
    id: SharedId;
    label: string;
    x: number;
    width: number;
    color: string;
    textClass: string;
}

interface ThreadCard {
    id: ThreadId;
    label: string;
    x: number;
    width: number;
}

interface LinkDef {
    id: string;
    shared: SharedId;
    thread: ThreadId;
    d: string;
    color: string;
    delay: number;
}

const SHARED_BLOCKS: SharedBlock[] = [
    {
        id: 'text',
        label: '.text (Codi)',
        x: 50,
        width: 135,
        color: '#38bdf8',
        textClass: 'fill-sky-300',
    },
    {
        id: 'data',
        label: '.data / heap',
        x: 205,
        width: 150,
        color: '#34d399',
        textClass: 'fill-emerald-300',
    },
    {
        id: 'files',
        label: 'TC (Fitxers)',
        x: 375,
        width: 135,
        color: '#a78bfa',
        textClass: 'fill-purple-300',
    },
];

const MULTI_THREADS: ThreadCard[] = [
    { id: 't1', label: 'T1', x: 50, width: 135 },
    { id: 't2', label: 'T2', x: 212, width: 135 },
    { id: 't3', label: 'T3', x: 375, width: 135 },
];

const SINGLE_THREADS: ThreadCard[] = [
    { id: 't1', label: 'T1', x: 205, width: 150 },
];

const SHARED_Y = 30;
const SHARED_H = 42;
const SHARED_PORT_Y = SHARED_Y + SHARED_H; // 72

const THREAD_Y = 118;
const THREAD_H = 54;
const THREAD_PORT_Y = THREAD_Y; // 118

function buildLinks(threads: ThreadCard[], mode: Mode): LinkDef[] {
    const links: LinkDef[] = [];

    threads.forEach((thread, tIdx) => {
        const tx = thread.x + thread.width / 2;

        SHARED_BLOCKS.forEach((shared, sIdx) => {
            const sx = shared.x + shared.width / 2;
            let cpTopY = 95;
            let cpBotY = 95;

            if (mode === 'multi') {
                if (thread.id === 't1' && shared.id === 'files') {
                    cpTopY = 104;
                    cpBotY = 104;
                } else if (thread.id === 't3' && shared.id === 'text') {
                    cpTopY = 86;
                    cpBotY = 86;
                } else if (sx !== tx) {
                    cpTopY = 96;
                    cpBotY = 94;
                }
            }

            // Instruction fetches (.text) flow downward; data/file access flows upward
            const d =
                shared.id === 'text'
                    ? `M ${sx} ${SHARED_PORT_Y} C ${sx} ${cpTopY}, ${tx} ${cpBotY}, ${tx} ${THREAD_PORT_Y}`
                    : `M ${tx} ${THREAD_PORT_Y} C ${tx} ${cpBotY}, ${sx} ${cpTopY}, ${sx} ${SHARED_PORT_Y}`;

            links.push({
                id: `${thread.id}-${shared.id}`,
                shared: shared.id,
                thread: thread.id,
                d,
                color: shared.color,
                delay: (tIdx * 3 + sIdx) * 0.28,
            });
        });
    });

    return links;
}

const isSharedId = (item: ActiveItem): item is SharedId =>
    item === 'text' || item === 'data' || item === 'files';

const isThreadId = (item: ActiveItem): item is ThreadId =>
    item === 't1' || item === 't2' || item === 't3';

export default function ThreadMemoryViz() {
    const [mode, setMode] = useState<Mode>('multi');
    const [hovered, setHovered] = useState<ActiveItem>(null);

    const threads = mode === 'multi' ? MULTI_THREADS : SINGLE_THREADS;
    const links = buildLinks(threads, mode);

    const isSharedLit = (id: SharedId) => hovered === id;
    const isSharedFaded = (id: SharedId) => isSharedId(hovered) && hovered !== id;
    const isSharedConnected = () => isThreadId(hovered);

    const isThreadLit = (id: ThreadId) => hovered === id;
    const isThreadFaded = (id: ThreadId) => isThreadId(hovered) && hovered !== id;
    const isThreadConnected = () => isSharedId(hovered);

    const isLinkLit = (link: LinkDef) => hovered === link.shared || hovered === link.thread;
    const isLinkFaded = (link: LinkDef) => hovered !== null && !isLinkLit(link);

    return (
        <div className="w-full my-6 select-none flex flex-col items-center justify-center not-prose">
            <div className="w-full max-w-lg relative flex flex-col items-center">
                {/* Minimalist 2-state Switch */}
                <div className="flex items-center gap-1 p-0.5 rounded-full bg-slate-900/60 border border-white/5 mb-3">
                    {([
                        { id: 'multi', label: 'Multi-thread' },
                        { id: 'single', label: 'Single-thread' },
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
                    viewBox="0 0 560 190"
                    className="w-full h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter id="glow-threads" filterUnits="userSpaceOnUse" x="-20" y="-20" width="600" height="230">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* SHARED PCB CONTAINER */}
                    <rect
                        x="36"
                        y="4"
                        width="488"
                        height="78"
                        rx="11"
                        className="fill-slate-500/[0.03] dark:fill-white/[0.015] stroke-slate-400/25 dark:stroke-white/[0.1]"
                        strokeWidth="1"
                        strokeDasharray="3 3"
                    />
                    <text
                        x="280"
                        y="16"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="font-mono text-[8.5px] font-semibold tracking-widest fill-slate-500 dark:fill-slate-400 uppercase pointer-events-none"
                    >
                        PCB · Compartit
                    </text>

                    {/* CONNECTING TRACKS & KINETIC PARTICLES */}
                    <g key={mode} className="pointer-events-none">
                        {links.map((link) => {
                            const lit = isLinkLit(link);
                            const faded = isLinkFaded(link);

                            return (
                                <g key={link.id}>
                                    <path
                                        d={link.d}
                                        className="stroke-slate-300/25 dark:stroke-white/[0.08]"
                                        strokeWidth="1.2"
                                    />
                                    <motion.path
                                        d={link.d}
                                        stroke={link.color}
                                        strokeWidth={lit ? 2 : 1.35}
                                        strokeLinecap="round"
                                        initial={false}
                                        animate={{ opacity: faded ? 0.1 : lit ? 0.95 : 0.6 }}
                                        transition={{ duration: 0.2 }}
                                        filter={lit ? 'url(#glow-threads)' : undefined}
                                    />
                                    <g
                                        opacity={faded ? 0.08 : 1}
                                        className="transition-opacity duration-200"
                                    >
                                        <motion.circle
                                            r={2.2}
                                            fill={link.color}
                                            filter="url(#glow-threads)"
                                            initial={{ offsetDistance: '0%', opacity: 0 }}
                                            animate={{
                                                offsetDistance: '100%',
                                                opacity: [0, 1, 1, 0],
                                            }}
                                            transition={{
                                                duration: 2.4,
                                                repeat: Infinity,
                                                delay: link.delay,
                                                ease: 'easeInOut',
                                            }}
                                            style={{ offsetPath: `path("${link.d}")` }}
                                        />
                                    </g>
                                </g>
                            );
                        })}
                    </g>

                    {/* SHARED RESOURCE CARDS */}
                    {SHARED_BLOCKS.map((block) => {
                        const cx = block.x + block.width / 2;
                        const cy = SHARED_Y + SHARED_H / 2;
                        const lit = isSharedLit(block.id);
                        const faded = isSharedFaded(block.id);
                        const connected = isSharedConnected();

                        return (
                            <g
                                key={block.id}
                                onMouseEnter={() => setHovered(block.id)}
                                onMouseLeave={() => setHovered(null)}
                                className="cursor-pointer transition-opacity duration-200"
                                opacity={faded ? 0.25 : 1}
                            >
                                <rect
                                    x={block.x}
                                    y={SHARED_Y}
                                    width={block.width}
                                    height={SHARED_H}
                                    rx="8"
                                    fill="#0b0f19"
                                    stroke={block.color}
                                    strokeWidth={lit ? 1.8 : 1.1}
                                    strokeOpacity={lit ? 1 : connected ? 0.75 : 0.45}
                                    filter={lit ? 'url(#glow-threads)' : undefined}
                                />
                                <text
                                    x={cx}
                                    y={cy}
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    className={`font-mono text-[9.5px] font-bold tracking-wider pointer-events-none ${block.textClass}`}
                                >
                                    {block.label}
                                </text>
                                <circle cx={cx} cy={SHARED_PORT_Y} r="2.5" fill={block.color} />
                            </g>
                        );
                    })}

                    {/* PRIVATE THREAD CONTEXT CARDS */}
                    {threads.map((thread) => {
                        const cx = thread.x + thread.width / 2;
                        const lit = isThreadLit(thread.id);
                        const faded = isThreadFaded(thread.id);
                        const connected = isThreadConnected();

                        return (
                            <g
                                key={thread.id}
                                onMouseEnter={() => setHovered(thread.id)}
                                onMouseLeave={() => setHovered(null)}
                                className="cursor-pointer transition-opacity duration-200"
                                opacity={faded ? 0.25 : 1}
                            >
                                <rect
                                    x={thread.x}
                                    y={THREAD_Y}
                                    width={thread.width}
                                    height={THREAD_H}
                                    rx="8"
                                    fill="#0b0f19"
                                    stroke="#fbbf24"
                                    strokeWidth={lit ? 1.8 : 1.1}
                                    strokeOpacity={lit ? 1 : connected ? 0.75 : 0.45}
                                    filter={lit ? 'url(#glow-threads)' : undefined}
                                />
                                <text
                                    x={cx}
                                    y={THREAD_Y + 18}
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    className="font-mono text-[10px] font-bold fill-amber-300 tracking-wider pointer-events-none"
                                >
                                    {thread.label}
                                </text>
                                <text
                                    x={cx}
                                    y={THREAD_Y + 37}
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    className="font-mono text-[8.5px] fill-amber-400/80 tracking-wide pointer-events-none"
                                >
                                    Regs · Stack · PC
                                </text>
                                <circle cx={cx} cy={THREAD_PORT_Y} r="2.5" fill="#fbbf24" />
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}
