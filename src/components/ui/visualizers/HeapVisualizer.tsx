"use client";

import { useState } from 'react';
import { m as motion } from 'framer-motion';

interface HeapNodeData {
    idx: number;
    val: number;
    x: number;
    y: number;
}

const HEAP_NODES: HeapNodeData[] = [
    { idx: 1, val: 50, x: 250, y: 38 },
    { idx: 2, val: 40, x: 140, y: 110 },
    { idx: 3, val: 30, x: 360, y: 110 },
    { idx: 4, val: 10, x: 85, y: 182 },
    { idx: 5, val: 20, x: 195, y: 182 },
    { idx: 6, val: 15, x: 305, y: 182 },
];

const TREE_LINKS = [
    { from: 1, to: 2 },
    { from: 1, to: 3 },
    { from: 2, to: 4 },
    { from: 2, to: 5 },
    { from: 3, to: 6 },
];

export default function HeapVisualizer() {
    // Selected node index (1 to 6)
    const [selectedIdx, setSelectedIdx] = useState<number>(2);

    const parentIdx = selectedIdx > 1 ? Math.floor(selectedIdx / 2) : null;
    const leftChildIdx = selectedIdx >= 1 && 2 * selectedIdx <= 6 ? 2 * selectedIdx : null;
    const rightChildIdx = selectedIdx >= 1 && 2 * selectedIdx + 1 <= 6 ? 2 * selectedIdx + 1 : null;

    const getNodeRole = (idx: number) => {
        if (idx === selectedIdx) return 'SELECTED';
        if (idx === parentIdx) return 'PARENT';
        if (idx === leftChildIdx) return 'LEFT_CHILD';
        if (idx === rightChildIdx) return 'RIGHT_CHILD';
        return 'DEFAULT';
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'SELECTED':
                return {
                    bg: 'bg-emerald-500/15',
                    border: 'border-emerald-400',
                    text: 'text-emerald-300',
                    svgFill: '#064e3b',
                    svgStroke: '#34d399',
                    glow: 'shadow-[0_0_20px_rgba(52,211,153,0.3)]'
                };
            case 'PARENT':
                return {
                    bg: 'bg-amber-500/15',
                    border: 'border-amber-400',
                    text: 'text-amber-300',
                    svgFill: '#78350f',
                    svgStroke: '#fbbf24',
                    glow: 'shadow-[0_0_15px_rgba(251,191,36,0.25)]'
                };
            case 'LEFT_CHILD':
            case 'RIGHT_CHILD':
                return {
                    bg: 'bg-blue-500/15',
                    border: 'border-blue-400',
                    text: 'text-blue-300',
                    svgFill: '#1e3a8a',
                    svgStroke: '#60a5fa',
                    glow: 'shadow-[0_0_15px_rgba(96,165,250,0.25)]'
                };
            default:
                return {
                    bg: 'bg-[#0a0d14]',
                    border: 'border-slate-800',
                    text: 'text-slate-300',
                    svgFill: '#0a0d14',
                    svgStroke: '#334155',
                    glow: ''
                };
        }
    };

    return (
        <div className="w-full flex flex-col items-center justify-center gap-6 my-10 font-mono select-none not-prose px-4">
            
            {/* 1. TREE REPRESENTATION */}
            <div className="relative w-full max-w-[500px] h-[225px]">
                <svg className="w-full h-full" viewBox="0 0 500 225">
                    {/* CONNECTING LINKS */}
                    {TREE_LINKS.map(link => {
                        const fromNode = HEAP_NODES.find(n => n.idx === link.from)!;
                        const toNode = HEAP_NODES.find(n => n.idx === link.to)!;
                        const isConnectedToSelected =
                            (link.from === selectedIdx && (link.to === leftChildIdx || link.to === rightChildIdx)) ||
                            (link.to === selectedIdx && link.from === parentIdx);

                        const midX = (fromNode.x + toNode.x) / 2;
                        const midY = (fromNode.y + toNode.y) / 2;

                        return (
                            <g key={`${link.from}-${link.to}`}>
                                <line
                                    x1={fromNode.x}
                                    y1={fromNode.y}
                                    x2={toNode.x}
                                    y2={toNode.y}
                                    stroke={isConnectedToSelected ? '#10b981' : '#334155'}
                                    strokeWidth={isConnectedToSelected ? '2.5' : '1.5'}
                                    strokeDasharray={isConnectedToSelected ? 'none' : '4 3'}
                                    className="transition duration-300"
                                />
                                {/* GREATER-OR-EQUAL BADGE ON EDGE */}
                                <rect
                                    x={midX - 9}
                                    y={midY - 7.5}
                                    width="18"
                                    height="15"
                                    rx="4"
                                    fill="#020617"
                                    stroke={isConnectedToSelected ? '#10b981' : '#334155'}
                                    strokeWidth="1"
                                    className="transition duration-300"
                                />
                                <text
                                    x={midX}
                                    y={midY + 1}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill={isConnectedToSelected ? '#34d399' : '#64748b'}
                                    fontWeight="bold"
                                    fontSize="10"
                                    className="select-none pointer-events-none"
                                >
                                    ≥
                                </text>
                            </g>
                        );
                    })}

                    {/* TREE NODES */}
                    {HEAP_NODES.map(node => {
                        const role = getNodeRole(node.idx);
                        const style = getRoleColor(role);

                        return (
                            <g
                                key={node.idx}
                                onClick={() => setSelectedIdx(node.idx)}
                                className="cursor-pointer group"
                            >
                                {/* Node Circle */}
                                <circle
                                    cx={node.x}
                                    cy={node.y}
                                    r="22"
                                    fill={style.svgFill}
                                    stroke={style.svgStroke}
                                    strokeWidth="2"
                                    className="transition duration-200 group-hover:stroke-emerald-400"
                                />

                                {/* Node Value */}
                                <text
                                    x={node.x}
                                    y={node.y + 1}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill={role === 'DEFAULT' ? '#93c5fd' : '#ffffff'}
                                    fontWeight="bold"
                                    fontSize="13"
                                    className="select-none pointer-events-none"
                                >
                                    {node.val}
                                </text>

                                {/* Index Badge [i] */}
                                <rect
                                    x={node.x - 14}
                                    y={node.y - 30}
                                    width="28"
                                    height="13"
                                    rx="4"
                                    fill="#020617"
                                    stroke={style.svgStroke}
                                    strokeWidth="1"
                                />
                                <text
                                    x={node.x}
                                    y={node.y - 22}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill={role === 'DEFAULT' ? '#64748b' : style.svgStroke}
                                    fontWeight="bold"
                                    fontSize="8.5"
                                    className="select-none pointer-events-none"
                                >
                                    v[{node.idx}]
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* 2. PHYSICAL VECTOR REPRESENTATION */}
            <div className="flex flex-row flex-wrap items-center justify-center gap-2.5 w-full max-w-xl">
                
                {/* SLOT 0 (NOT USED) */}
                <div
                    className="relative w-14 h-14 rounded-2xl border-2 border-dashed border-slate-800/80 bg-slate-900/20 flex flex-col items-center justify-center opacity-40"
                >
                    <span className="text-slate-600 font-bold text-xs">∅</span>
                    <div className="absolute -bottom-5 text-[9px] text-slate-600 font-bold">
                        [0]
                    </div>
                </div>

                {/* SLOTS 1 TO 6 */}
                {HEAP_NODES.map(node => {
                    const role = getNodeRole(node.idx);
                    const style = getRoleColor(role);

                    return (
                        <motion.div
                            key={node.idx}
                            onClick={() => setSelectedIdx(node.idx)}
                            layout
                            className={`cursor-pointer relative w-14 h-14 rounded-2xl border-2 flex flex-col items-center justify-center transition duration-200
                                ${style.bg} ${style.border} ${style.glow}
                                ${node.idx === selectedIdx ? 'scale-105 z-10' : 'hover:border-slate-700'}`}
                        >
                            <span className={`font-bold text-base ${style.text}`}>
                                {node.val}
                            </span>
                            <div className="absolute -bottom-5 text-[9px] font-bold text-slate-500">
                                [{node.idx}]
                            </div>
                        </motion.div>
                    );
                })}
            </div>

        </div>
    );
}
