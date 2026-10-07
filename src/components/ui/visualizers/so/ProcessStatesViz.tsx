"use client";

import React, { useState } from 'react';
import { m as motion } from 'framer-motion';
import { Clock, Cpu, Pause, Ghost } from 'lucide-react';

interface StateNode {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
    color: string;
    x: number;
    y: number;
}

interface Transition {
    id: string;
    label: string;
    path: string;
    color: string;
    labelX: number;
    labelY: number;
    delay: number;
    relatedStates: string[];
}

const STATES: StateNode[] = [
    { id: "READY", label: "READY", icon: Clock, color: "#38bdf8", x: 140, y: 88 },
    { id: "RUN", label: "RUN", icon: Cpu, color: "#34d399", x: 360, y: 88 },
    { id: "BLOCKED", label: "BLOCKED", icon: Pause, color: "#fbbf24", x: 250, y: 204 },
    { id: "ZOMBIE", label: "ZOMBIE", icon: Ghost, color: "#f43f5e", x: 570, y: 88 }
];

const TRANSITIONS: Transition[] = [
    {
        id: "fork",
        label: "fork()",
        path: "M 48 88 L 122 88",
        color: "#38bdf8",
        labelX: 82,
        labelY: 76,
        delay: 0,
        relatedStates: ["READY"]
    },
    {
        id: "dispatch",
        label: "CPU",
        path: "M 158 78 C 218 52, 282 52, 342 78",
        color: "#34d399",
        labelX: 250,
        labelY: 54,
        delay: 0.3,
        relatedStates: ["READY", "RUN"]
    },
    {
        id: "quantum",
        label: "QUÀNTUM",
        path: "M 342 98 C 282 124, 218 124, 158 98",
        color: "#38bdf8",
        labelX: 250,
        labelY: 124,
        delay: 0.6,
        relatedStates: ["RUN", "READY"]
    },
    {
        id: "wait",
        label: "I/O WAIT",
        path: "M 352 106 C 342 152, 302 192, 268 202",
        color: "#fbbf24",
        labelX: 334,
        labelY: 168,
        delay: 0.9,
        relatedStates: ["RUN", "BLOCKED"]
    },
    {
        id: "event",
        label: "EVENT",
        path: "M 232 202 C 198 192, 158 152, 148 106",
        color: "#38bdf8",
        labelX: 168,
        labelY: 168,
        delay: 1.2,
        relatedStates: ["BLOCKED", "READY"]
    },
    {
        id: "exit",
        label: "exit()",
        path: "M 378 88 L 552 88",
        color: "#f43f5e",
        labelX: 465,
        labelY: 76,
        delay: 0.5,
        relatedStates: ["RUN", "ZOMBIE"]
    },
    {
        id: "waitpid",
        label: "waitpid()",
        path: "M 570 106 L 570 188",
        color: "#94a3b8",
        labelX: 608,
        labelY: 150,
        delay: 1.4,
        relatedStates: ["ZOMBIE"]
    }
];

export default function ProcessStatesViz() {
    const [hoveredState, setHoveredState] = useState<string | null>(null);

    return (
        <div className="w-full my-8 select-none flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl relative">
                <svg
                    viewBox="0 0 660 240"
                    className="w-full h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        {/* Glow Filter */}
                        <filter id="glow-proc" x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* Arrow Marker */}
                        <marker
                            id="arrow-end"
                            viewBox="0 0 6 6"
                            refX="5"
                            refY="3"
                            markerWidth="4"
                            markerHeight="4"
                            orient="auto-start-reverse"
                        >
                            <path d="M 0 0 L 6 3 L 0 6 z" fill="currentColor" opacity="0.4" />
                        </marker>
                    </defs>

                    {/* Inactive Base Tracks */}
                    {TRANSITIONS.map(tr => (
                        <path
                            key={`base-${tr.id}`}
                            d={tr.path}
                            className="stroke-slate-300/30 dark:stroke-white/[0.07]"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                        />
                    ))}

                    {/* Active Highlight Tracks */}
                    {TRANSITIONS.map(tr => {
                        const isRelated = hoveredState !== null && tr.relatedStates.includes(hoveredState);
                        const hasHover = hoveredState !== null;
                        const opacity = hasHover ? (isRelated ? 1 : 0.2) : 0.75;
                        const strokeWidth = isRelated ? 2.2 : 1.6;

                        return (
                            <motion.path
                                key={`active-${tr.id}`}
                                d={tr.path}
                                stroke={tr.color}
                                strokeWidth={strokeWidth}
                                strokeLinecap="round"
                                animate={{ opacity }}
                                transition={{ duration: 0.25 }}
                                filter="url(#glow-proc)"
                            />
                        );
                    })}

                    {/* Concurrent Signal Pulses */}
                    {TRANSITIONS.map(tr => {
                        const isRelated = hoveredState !== null && tr.relatedStates.includes(hoveredState);
                        const hasHover = hoveredState !== null;
                        const opacity = hasHover ? (isRelated ? 1 : 0.15) : 0.9;

                        return (
                            <motion.circle
                                key={`pulse-${tr.id}`}
                                r={isRelated ? 3.5 : 2.5}
                                fill={tr.color}
                                filter="url(#glow-proc)"
                                initial={{ offsetDistance: "0%", opacity: 0 }}
                                animate={{
                                    offsetDistance: "100%",
                                    opacity: [0, opacity, opacity, 0]
                                }}
                                transition={{
                                    duration: 1.8,
                                    repeat: Infinity,
                                    delay: tr.delay,
                                    ease: "easeInOut"
                                }}
                                style={{
                                    offsetPath: `path("${tr.path}")`
                                }}
                            />
                        );
                    })}

                    {/* Transition Labels */}
                    {TRANSITIONS.map(tr => {
                        const isRelated = hoveredState !== null && tr.relatedStates.includes(hoveredState);
                        const hasHover = hoveredState !== null;
                        const textOpacity = hasHover && !isRelated ? "opacity-25" : "opacity-90";

                        return (
                            <text
                                key={`lbl-${tr.id}`}
                                x={tr.labelX}
                                y={tr.labelY}
                                textAnchor="middle"
                                className={`font-mono text-[9px] font-medium tracking-wider transition-all duration-200 pointer-events-none ${textOpacity}`}
                                style={{ fill: isRelated ? "#ffffff" : tr.color }}
                            >
                                {tr.label}
                            </text>
                        );
                    })}

                    {/* Exit Milestone Pin: REAPED / TERMINAT */}
                    <g transform="translate(570, 188)">
                        <circle cx="0" cy="0" r="2.5" fill="#94a3b8" />
                        <text
                            x="0"
                            y="14"
                            textAnchor="middle"
                            className="font-mono text-[8.5px] tracking-widest uppercase fill-slate-400 dark:fill-slate-500 pointer-events-none"
                        >
                            REAPED
                        </text>
                    </g>

                    {/* 4 CORE STATE NODES (Pure icon + small text underneath, no containers) */}
                    {STATES.map(st => {
                        const Icon = st.icon;
                        const isHovered = hoveredState === st.id;
                        const hasHover = hoveredState !== null;
                        const textOpacity = hasHover && !isHovered ? "opacity-30" : "opacity-100";

                        return (
                            <g
                                key={st.id}
                                onMouseEnter={() => setHoveredState(st.id)}
                                onMouseLeave={() => setHoveredState(null)}
                                className="cursor-pointer group"
                            >
                                {/* Touch/hover hit area */}
                                <rect
                                    x={st.x - 30}
                                    y={st.y - 28}
                                    width={60}
                                    height={56}
                                    fill="transparent"
                                />

                                {/* Icon directly */}
                                <foreignObject
                                    x={st.x - 12}
                                    y={st.y - 24}
                                    width={24}
                                    height={24}
                                    className="overflow-visible pointer-events-none"
                                >
                                    <div
                                        className={`transition-all duration-300 flex items-center justify-center ${textOpacity} ${
                                            isHovered ? "scale-115" : "scale-100"
                                        }`}
                                        style={{
                                            color: st.color,
                                            filter: isHovered
                                                ? `drop-shadow(0 0 10px ${st.color})`
                                                : `drop-shadow(0 0 4px ${st.color}70)`
                                        }}
                                    >
                                        <Icon className="w-5 h-5" strokeWidth={1.75} />
                                    </div>
                                </foreignObject>

                                {/* Connection Pin Dot */}
                                <circle
                                    cx={st.x}
                                    cy={st.y}
                                    r={isHovered ? 2.75 : 2}
                                    fill={st.color}
                                    className={`transition-all duration-300 ${textOpacity}`}
                                />

                                {/* State Name Directly Under Icon */}
                                <text
                                    x={st.x}
                                    y={st.y + 16}
                                    textAnchor="middle"
                                    className={`font-mono text-[10px] tracking-widest uppercase transition-all duration-200 pointer-events-none ${
                                        isHovered ? "font-bold" : "font-semibold"
                                    } ${textOpacity}`}
                                    style={{
                                        fill: isHovered ? "#ffffff" : st.color
                                    }}
                                >
                                    {st.label}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}
