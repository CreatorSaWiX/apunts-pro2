"use client";

import { useState } from 'react';
import { m as motion } from 'framer-motion';

interface BSTNode {
    id: number;
    val: number;
    x: number;
    y: number;
    left?: number;
    right?: number;
}

const BST_NODES: BSTNode[] = [
    { id: 50, val: 50, x: 250, y: 35, left: 20, right: 80 },
    { id: 20, val: 20, x: 130, y: 105, left: 10, right: 30 },
    { id: 80, val: 80, x: 370, y: 105, left: 70, right: 90 },
    { id: 10, val: 10, x: 70, y: 175 },
    { id: 30, val: 30, x: 190, y: 175 },
    { id: 70, val: 70, x: 310, y: 175 },
    { id: 90, val: 90, x: 430, y: 175 },
];

const BST_LINKS = [
    { from: 50, to: 20, type: 'LEFT', label: '<' },
    { from: 50, to: 80, type: 'RIGHT', label: '<' },
    { from: 20, to: 10, type: 'LEFT', label: '<' },
    { from: 20, to: 30, type: 'RIGHT', label: '<' },
    { from: 80, to: 70, type: 'LEFT', label: '<' },
    { from: 80, to: 90, type: 'RIGHT', label: '<' },
];

const INORDER_TRAVERSAL = [10, 20, 30, 50, 70, 80, 90];

// Helper to get all node IDs in the left/right subtree of a node
function getSubtreeNodes(nodeId: number, side: 'LEFT' | 'RIGHT'): number[] {
    const node = BST_NODES.find(n => n.id === nodeId);
    if (!node) return [];

    const rootChildId = side === 'LEFT' ? node.left : node.right;
    if (!rootChildId) return [];

    const result: number[] = [];
    const queue = [rootChildId];

    while (queue.length > 0) {
        const currId = queue.shift()!;
        result.push(currId);
        const currNode = BST_NODES.find(n => n.id === currId);
        if (currNode) {
            if (currNode.left) queue.push(currNode.left);
            if (currNode.right) queue.push(currNode.right);
        }
    }
    return result;
}

export default function BSTVisualizer() {
    const [selectedId, setSelectedId] = useState<number>(50);

    const leftSubtree = getSubtreeNodes(selectedId, 'LEFT');
    const rightSubtree = getSubtreeNodes(selectedId, 'RIGHT');

    const getNodeRole = (id: number) => {
        if (id === selectedId) return 'SELECTED';
        if (leftSubtree.includes(id)) return 'LEFT_SUBTREE';
        if (rightSubtree.includes(id)) return 'RIGHT_SUBTREE';
        return 'DEFAULT';
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'SELECTED':
                return {
                    bg: 'bg-emerald-500/20',
                    border: 'border-emerald-400',
                    text: 'text-emerald-300',
                    svgFill: '#064e3b',
                    svgStroke: '#34d399',
                    linkStroke: '#10b981',
                    glow: 'shadow-[0_0_20px_rgba(52,211,153,0.35)]'
                };
            case 'LEFT_SUBTREE':
                return {
                    bg: 'bg-blue-500/15',
                    border: 'border-blue-400',
                    text: 'text-blue-300',
                    svgFill: '#1e3a8a',
                    svgStroke: '#60a5fa',
                    linkStroke: '#3b82f6',
                    glow: 'shadow-[0_0_15px_rgba(96,165,250,0.25)]'
                };
            case 'RIGHT_SUBTREE':
                return {
                    bg: 'bg-purple-500/15',
                    border: 'border-purple-400',
                    text: 'text-purple-300',
                    svgFill: '#4c1d95',
                    svgStroke: '#c084fc',
                    linkStroke: '#a855f7',
                    glow: 'shadow-[0_0_15px_rgba(192,132,252,0.25)]'
                };
            default:
                return {
                    bg: 'bg-[#0a0d14]',
                    border: 'border-slate-800',
                    text: 'text-slate-400',
                    svgFill: '#0a0d14',
                    svgStroke: '#334155',
                    linkStroke: '#334155',
                    glow: ''
                };
        }
    };

    return (
        <div className="w-full flex flex-col items-center justify-center gap-6 my-10 font-mono select-none not-prose px-4">

            {/* 1. BST TREE REPRESENTATION */}
            <div className="relative w-full max-w-[500px] h-[220px]">
                <svg className="w-full h-full" viewBox="0 0 500 220">

                    {/* CONNECTING LINKS */}
                    {BST_LINKS.map(link => {
                        const fromNode = BST_NODES.find(n => n.id === link.from)!;
                        const toNode = BST_NODES.find(n => n.id === link.to)!;

                        const isLeftActive = link.from === selectedId && link.type === 'LEFT';
                        const isRightActive = link.from === selectedId && link.type === 'RIGHT';
                        const isSubtreeLink =
                            (leftSubtree.includes(link.from) && leftSubtree.includes(link.to)) ||
                            (rightSubtree.includes(link.from) && rightSubtree.includes(link.to));

                        let strokeColor = '#334155';
                        let textColor = '#64748b';
                        let isHighlighted = false;

                        if (isLeftActive || (isSubtreeLink && leftSubtree.includes(link.to))) {
                            strokeColor = '#3b82f6';
                            textColor = '#60a5fa';
                            isHighlighted = true;
                        } else if (isRightActive || (isSubtreeLink && rightSubtree.includes(link.to))) {
                            strokeColor = '#a855f7';
                            textColor = '#c084fc';
                            isHighlighted = true;
                        }

                        const midX = (fromNode.x + toNode.x) / 2;
                        const midY = (fromNode.y + toNode.y) / 2;

                        return (
                            <g key={`${link.from}-${link.to}`}>
                                <line
                                    x1={fromNode.x}
                                    y1={fromNode.y}
                                    x2={toNode.x}
                                    y2={toNode.y}
                                    stroke={strokeColor}
                                    strokeWidth={isHighlighted ? '2.5' : '1.5'}
                                    strokeDasharray={isHighlighted ? 'none' : '4 3'}
                                    className="transition duration-300"
                                />

                                {/* COMPARISON BADGE */}
                                <rect
                                    x={midX - 16}
                                    y={midY - 7.5}
                                    width="32"
                                    height="15"
                                    rx="4"
                                    fill="#020617"
                                    stroke={strokeColor}
                                    strokeWidth="1"
                                    className="transition duration-300"
                                />
                                <text
                                    x={midX}
                                    y={midY + 1}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill={textColor}
                                    fontWeight="bold"
                                    fontSize="8.5"
                                    className="select-none pointer-events-none"
                                >
                                    {link.label}
                                </text>
                            </g>
                        );
                    })}

                    {/* TREE NODES */}
                    {BST_NODES.map(node => {
                        const role = getNodeRole(node.id);
                        const style = getRoleColor(role);

                        return (
                            <g
                                key={node.id}
                                onClick={() => setSelectedId(node.id)}
                                className="cursor-pointer group"
                            >
                                {/* Circle */}
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
                                    fill={role === 'DEFAULT' ? '#94a3b8' : '#ffffff'}
                                    fontWeight="bold"
                                    fontSize="14"
                                    className="select-none pointer-events-none"
                                >
                                    {node.val}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* 2. INORDER ARRAY REPRESENTATION */}
            <div className="flex flex-col items-center gap-2 w-full max-w-lg">
                <div className="flex flex-row flex-wrap items-center justify-center gap-2 w-full">
                    {INORDER_TRAVERSAL.map(val => {
                        const role = getNodeRole(val);
                        const style = getRoleColor(role);
                        const isSel = val === selectedId;

                        return (
                            <motion.div
                                key={val}
                                onClick={() => setSelectedId(val)}
                                layout
                                className={`cursor-pointer relative w-12 h-12 rounded-2xl border-2 flex flex-col items-center justify-center transition duration-200
                                    ${style.bg} ${style.border} ${style.glow}
                                    ${isSel ? 'scale-105 z-10' : 'hover:border-slate-700'}`}
                            >
                                <span className={`font-bold text-sm ${style.text}`}>
                                    {val}
                                </span>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

        </div>
    );
}
