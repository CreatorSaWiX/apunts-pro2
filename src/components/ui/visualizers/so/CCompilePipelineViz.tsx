"use client";

import React, { useState } from 'react';
import { m as motion } from 'framer-motion';
import { FileCode, FileText, Binary, Terminal } from 'lucide-react';

interface Stage {
    id: number;
    ext: string;
    label: string;
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
    color: string;
    x: number;
}

interface Tool {
    id: number;
    name: string;
    cmd: string;
    fromX: number;
    toX: number;
    midX: number;
    color: string;
}

const STAGES: Stage[] = [
    { id: 0, ext: ".c", label: "SOURCE", icon: FileCode, color: "#38bdf8", x: 75 },
    { id: 1, ext: ".i", label: "EXPANDED", icon: FileText, color: "#818cf8", x: 255 },
    { id: 2, ext: ".o", label: "OBJECT", icon: Binary, color: "#c084fc", x: 435 },
    { id: 3, ext: "a.out", label: "BINARY", icon: Terminal, color: "#34d399", x: 615 }
];

const TOOLS: Tool[] = [
    { id: 0, name: "PREPROCESS", cmd: "cpp", fromX: 75, toX: 255, midX: 165, color: "#60a5fa" },
    { id: 1, name: "COMPILE", cmd: "gcc -c", fromX: 255, toX: 435, midX: 345, color: "#a78bfa" },
    { id: 2, name: "LINK", cmd: "ld", fromX: 435, toX: 615, midX: 525, color: "#2dd4bf" }
];

export default function CCompilePipelineViz() {
    const [hoveredStep, setHoveredStep] = useState<number | null>(null);

    return (
        <div className="w-full my-8 select-none flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl relative">
                <svg
                    viewBox="0 0 690 140"
                    className="w-full h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        {/* Soft Glow */}
                        <filter id="glow-pipe" x="-20%" y="-40%" width="140%" height="180%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* Stream Gradients for the 3 segments */}
                        <linearGradient id="grad-seg-0" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.9" />
                        </linearGradient>

                        <linearGradient id="grad-seg-1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#c084fc" stopOpacity="0.9" />
                        </linearGradient>

                        <linearGradient id="grad-seg-2" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#34d399" stopOpacity="0.9" />
                        </linearGradient>
                    </defs>

                    {/* Continuous Baseline Track */}
                    <line
                        x1="75"
                        y1="52"
                        x2="615"
                        y2="52"
                        className="stroke-slate-300/30 dark:stroke-white/[0.08]"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />

                    {/* Active Highlight Segment Tracks */}
                    {TOOLS.map((tool, i) => {
                        const isHovered = hoveredStep === i;
                        const hasHover = hoveredStep !== null;
                        const opacity = hasHover ? (isHovered ? 1 : 0.25) : 0.75;
                        const strokeWidth = isHovered ? 2.5 : 1.75;

                        return (
                            <motion.line
                                key={`seg-${tool.id}`}
                                x1={tool.fromX}
                                y1="52"
                                x2={tool.toX}
                                y2="52"
                                stroke={`url(#grad-seg-${i})`}
                                strokeWidth={strokeWidth}
                                strokeLinecap="round"
                                animate={{ opacity }}
                                transition={{ duration: 0.25 }}
                                filter="url(#glow-pipe)"
                            />
                        );
                    })}

                    {/* Flowing Compilation Particles (Continuous pipeline streams) */}
                    {TOOLS.map((tool, i) => {
                        const isHovered = hoveredStep === i;
                        const hasHover = hoveredStep !== null;
                        const opacity = hasHover ? (isHovered ? 1 : 0.2) : 0.95;

                        return (
                            <motion.circle
                                key={`particle-${tool.id}`}
                                r={isHovered ? 3.5 : 2.5}
                                fill={tool.color}
                                filter="url(#glow-pipe)"
                                initial={{ offsetDistance: "0%", opacity: 0 }}
                                animate={{
                                    offsetDistance: "100%",
                                    opacity: [0, opacity, opacity, 0]
                                }}
                                transition={{
                                    duration: 1.6,
                                    repeat: Infinity,
                                    delay: i * 0.5,
                                    ease: "easeInOut"
                                }}
                                style={{
                                    offsetPath: `path("M ${tool.fromX} 52 L ${tool.toX} 52")`
                                }}
                            />
                        );
                    })}

                    {/* Tool Badges / Commands in the middle of each segment */}
                    {TOOLS.map((tool, i) => {
                        const isHovered = hoveredStep === i;
                        return (
                            <g
                                key={`tool-tag-${tool.id}`}
                                onMouseEnter={() => setHoveredStep(i)}
                                onMouseLeave={() => setHoveredStep(null)}
                                className="cursor-pointer group"
                            >
                                <rect
                                    x={tool.midX - 32}
                                    y="18"
                                    width="64"
                                    height="32"
                                    fill="transparent"
                                />
                                {/* Tool Command */}
                                <text
                                    x={tool.midX}
                                    y="38"
                                    textAnchor="middle"
                                    className={`font-mono text-[10.5px] tracking-wider transition-all duration-200 pointer-events-none ${
                                        isHovered ? "font-bold scale-110" : "font-medium"
                                    }`}
                                    style={{
                                        fill: isHovered ? "#ffffff" : tool.color
                                    }}
                                >
                                    {tool.cmd}
                                </text>
                            </g>
                        );
                    })}

                    {/* 4 STAGES (Icon + Pin Dot + File Extension + Micro label) */}
                    {STAGES.map((stg, i) => {
                        const Icon = stg.icon;
                        const isHovered = hoveredStep === i || (i > 0 && hoveredStep === i - 1);
                        const hasHover = hoveredStep !== null;
                        const textOpacity = hasHover && !isHovered ? "opacity-35" : "opacity-100";

                        return (
                            <g
                                key={`stage-${stg.id}`}
                                onMouseEnter={() => setHoveredStep(i < 3 ? i : 2)}
                                onMouseLeave={() => setHoveredStep(null)}
                                className="cursor-pointer group"
                            >
                                {/* Hit area */}
                                <rect
                                    x={stg.x - 30}
                                    y="4"
                                    width="60"
                                    height="110"
                                    fill="transparent"
                                />

                                {/* Icon directly (No container box) */}
                                <foreignObject
                                    x={stg.x - 12}
                                    y="14"
                                    width="24"
                                    height="24"
                                    className="overflow-visible pointer-events-none"
                                >
                                    <div
                                        className={`transition-all duration-300 flex items-center justify-center ${textOpacity} ${
                                            isHovered ? "scale-115" : "scale-100"
                                        }`}
                                        style={{
                                            color: stg.color,
                                            filter: isHovered
                                                ? `drop-shadow(0 0 10px ${stg.color})`
                                                : `drop-shadow(0 0 4px ${stg.color}60)`
                                        }}
                                    >
                                        <Icon className="w-5 h-5" strokeWidth={1.75} />
                                    </div>
                                </foreignObject>

                                {/* Pin connection dot on line */}
                                <circle
                                    cx={stg.x}
                                    cy="52"
                                    r={isHovered ? 3 : 2}
                                    fill={stg.color}
                                    className={`transition-all duration-300 ${textOpacity}`}
                                />

                                {/* File Extension / Name directly below line */}
                                <text
                                    x={stg.x}
                                    y="78"
                                    textAnchor="middle"
                                    className={`font-mono text-[11px] font-bold tracking-wider transition-all duration-200 pointer-events-none ${textOpacity}`}
                                    style={{
                                        fill: isHovered ? "#ffffff" : stg.color
                                    }}
                                >
                                    {stg.ext}
                                </text>

                                {/* Micro label underneath */}
                                <text
                                    x={stg.x}
                                    y="94"
                                    textAnchor="middle"
                                    className={`font-mono text-[8.5px] tracking-widest uppercase transition-all duration-200 pointer-events-none fill-slate-400 dark:fill-slate-500 ${textOpacity}`}
                                >
                                    {stg.label}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}
