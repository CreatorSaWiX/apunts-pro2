"use client";

import React, { useState } from 'react';
import { m as motion } from 'framer-motion';
import { Terminal, Globe, Code2, Cpu, MemoryStick, HardDrive, Shield } from 'lucide-react';

const COLUMNS = [
    {
        id: 0,
        app: { label: "SHELL", icon: Terminal, x: 130, y: 22 },
        hw: { label: "CPU", icon: Cpu, x: 130, y: 198 },
        colorTop: "#38bdf8",
        colorBottom: "#38bdf8",
        gradientTopId: "stream-top-0",
        gradientBotId: "stream-bot-0",
        delayTop: 0,
        delayBot: 0.65
    },
    {
        id: 1,
        app: { label: "BROWSER", icon: Globe, x: 320, y: 22 },
        hw: { label: "RAM", icon: MemoryStick, x: 320, y: 198 },
        colorTop: "#818cf8",
        colorBottom: "#818cf8",
        gradientTopId: "stream-top-1",
        gradientBotId: "stream-bot-1",
        delayTop: 0.45,
        delayBot: 1.1
    },
    {
        id: 2,
        app: { label: "EDITOR", icon: Code2, x: 510, y: 22 },
        hw: { label: "STORAGE", icon: HardDrive, x: 510, y: 198 },
        colorTop: "#2dd4bf",
        colorBottom: "#2dd4bf",
        gradientTopId: "stream-top-2",
        gradientBotId: "stream-bot-2",
        delayTop: 0.9,
        delayBot: 1.55
    }
];

// Precision bezier paths connecting pin-to-pin
const PATHS_TOP = [
    "M 130 58 C 130 96, 266 96, 266 130", // Shell -> Kernel Left
    "M 320 58 L 320 112",                  // Browser -> Kernel Top
    "M 510 58 C 510 96, 374 96, 374 130"   // Editor -> Kernel Right
];

const PATHS_BOTTOM = [
    "M 266 130 C 266 164, 130 164, 130 188", // Kernel Left -> CPU
    "M 320 148 L 320 188",                    // Kernel Bottom -> RAM
    "M 374 130 C 374 164, 510 164, 510 188"  // Kernel Right -> Storage
];

export default function OSMediatorViz() {
    const [hoveredCol, setHoveredCol] = useState<number | null>(null);

    return (
        <div className="w-full my-8 select-none flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl relative">
                <svg
                    viewBox="0 0 640 250"
                    className="w-full h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        {/* Glow filters */}
                        <filter id="glow-soft" x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                        <filter id="glow-kernel" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="8" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* Stream Gradients for each of the 3 columns */}
                        {/* Column 0: Cyan -> Indigo -> Cyan */}
                        <linearGradient id="stream-top-0" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.9" />
                        </linearGradient>
                        <linearGradient id="stream-bot-0" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.85" />
                        </linearGradient>

                        {/* Column 1: Indigo -> Purple -> Indigo */}
                        <linearGradient id="stream-top-1" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.85" />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.9" />
                        </linearGradient>
                        <linearGradient id="stream-bot-1" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.85" />
                        </linearGradient>

                        {/* Column 2: Teal -> Emerald -> Teal */}
                        <linearGradient id="stream-top-2" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.85" />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.9" />
                        </linearGradient>
                        <linearGradient id="stream-bot-2" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.85" />
                        </linearGradient>
                    </defs>

                    {/* Inactive Base Tracks */}
                    {PATHS_TOP.map((d, i) => (
                        <path
                            key={`base-top-${i}`}
                            d={d}
                            className="stroke-slate-300/30 dark:stroke-white/[0.06]"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                        />
                    ))}
                    {PATHS_BOTTOM.map((d, i) => (
                        <path
                            key={`base-bot-${i}`}
                            d={d}
                            className="stroke-slate-300/30 dark:stroke-white/[0.06]"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                        />
                    ))}

                    {/* Active Highlight Tracks for ALL 3 COLUMNS */}
                    {COLUMNS.map((col, i) => {
                        const isFocused = hoveredCol === i;
                        const hasFocus = hoveredCol !== null;
                        const opacity = hasFocus ? (isFocused ? 1 : 0.25) : 0.85;
                        const strokeWidth = isFocused ? 2.2 : 1.75;

                        return (
                            <React.Fragment key={`tracks-${col.id}`}>
                                {/* Top Track */}
                                <motion.path
                                    d={PATHS_TOP[i]}
                                    stroke={`url(#${col.gradientTopId})`}
                                    strokeWidth={strokeWidth}
                                    strokeLinecap="round"
                                    animate={{ opacity }}
                                    transition={{ duration: 0.25 }}
                                    filter="url(#glow-soft)"
                                />
                                {/* Bottom Track */}
                                <motion.path
                                    d={PATHS_BOTTOM[i]}
                                    stroke={`url(#${col.gradientBotId})`}
                                    strokeWidth={strokeWidth}
                                    strokeLinecap="round"
                                    animate={{ opacity }}
                                    transition={{ duration: 0.25 }}
                                    filter="url(#glow-soft)"
                                />
                            </React.Fragment>
                        );
                    })}

                    {/* Travelling Data Signals for ALL 3 COLUMNS CONCURRENTLY */}
                    {COLUMNS.map((col, i) => {
                        const isFocused = hoveredCol === i;
                        const hasFocus = hoveredCol !== null;
                        const opacity = hasFocus ? (isFocused ? 1 : 0.2) : 1;

                        return (
                            <React.Fragment key={`signals-${col.id}`}>
                                {/* Top Particle (App -> Kernel) */}
                                <motion.circle
                                    r={isFocused ? 3.5 : 2.75}
                                    fill={col.colorTop}
                                    filter="url(#glow-soft)"
                                    initial={{ offsetDistance: "0%", opacity: 0 }}
                                    animate={{
                                        offsetDistance: "100%",
                                        opacity: [0, opacity, opacity, 0]
                                    }}
                                    transition={{
                                        duration: 1.4,
                                        repeat: Infinity,
                                        delay: col.delayTop,
                                        ease: "easeInOut"
                                    }}
                                    style={{
                                        offsetPath: `path("${PATHS_TOP[i]}")`
                                    }}
                                />

                                {/* Bottom Particle (Kernel -> HW) */}
                                <motion.circle
                                    r={isFocused ? 3.5 : 2.75}
                                    fill={col.colorBottom}
                                    filter="url(#glow-soft)"
                                    initial={{ offsetDistance: "0%", opacity: 0 }}
                                    animate={{
                                        offsetDistance: "100%",
                                        opacity: [0, opacity, opacity, 0]
                                    }}
                                    transition={{
                                        duration: 1.4,
                                        repeat: Infinity,
                                        delay: col.delayBot,
                                        ease: "easeInOut"
                                    }}
                                    style={{
                                        offsetPath: `path("${PATHS_BOTTOM[i]}")`
                                    }}
                                />
                            </React.Fragment>
                        );
                    })}

                    {/* Center OS Kernel Node */}
                    <g transform="translate(320, 130)">
                        {/* Ambient glow halo */}
                        <circle
                            r="28"
                            fill="rgba(99, 102, 241, 0.16)"
                            filter="url(#glow-kernel)"
                        />
                        {/* Refined Dark Glass Capsule */}
                        <rect
                            x="-54"
                            y="-18"
                            width="108"
                            height="36"
                            rx="18"
                            fill="#0b0f19"
                            stroke="rgba(255, 255, 255, 0.14)"
                            strokeWidth="1"
                        />
                        {/* Center Icon & Minimal Text */}
                        <foreignObject x="-44" y="-10" width="20" height="20" className="pointer-events-none">
                            <Shield className="w-4.5 h-4.5 text-indigo-400" strokeWidth={1.75} />
                        </foreignObject>
                        <text
                            x="-18"
                            y="4"
                            className="fill-slate-200 font-mono text-[10px] font-semibold tracking-[0.2em] pointer-events-none"
                        >
                            KERNEL
                        </text>

                        {/* Connection Pin Dots */}
                        <circle cx="-54" cy="0" r="1.75" fill="rgba(99, 102, 241, 0.8)" />
                        <circle cx="54" cy="0" r="1.75" fill="rgba(99, 102, 241, 0.8)" />
                        <circle cx="0" cy="-18" r="1.75" fill="rgba(99, 102, 241, 0.8)" />
                        <circle cx="0" cy="18" r="1.75" fill="rgba(99, 102, 241, 0.8)" />
                    </g>

                    {/* TOP ROW: APPS (Icon + Text below, No Containers) */}
                    {COLUMNS.map((col, idx) => {
                        const Icon = col.app.icon;
                        const isFocused = hoveredCol === idx;
                        const hasFocus = hoveredCol !== null;
                        const textOpacity = hasFocus && !isFocused ? "opacity-35" : "opacity-100";

                        return (
                            <g
                                key={`app-${col.id}`}
                                onMouseEnter={() => setHoveredCol(idx)}
                                onMouseLeave={() => setHoveredCol(null)}
                                className="cursor-pointer group"
                            >
                                {/* Invisible touch/click hit area */}
                                <rect
                                    x={col.app.x - 32}
                                    y={col.app.y - 12}
                                    width={64}
                                    height={56}
                                    fill="transparent"
                                />

                                {/* Icon directly */}
                                <foreignObject
                                    x={col.app.x - 12}
                                    y={col.app.y - 8}
                                    width={24}
                                    height={24}
                                    className="overflow-visible pointer-events-none"
                                >
                                    <div
                                        className={`transition-all duration-300 flex items-center justify-center ${textOpacity} ${
                                            isFocused ? "scale-115" : "scale-100"
                                        }`}
                                        style={{
                                            color: col.colorTop,
                                            filter: isFocused
                                                ? `drop-shadow(0 0 10px ${col.colorTop})`
                                                : `drop-shadow(0 0 4px ${col.colorTop}80)`
                                        }}
                                    >
                                        <Icon className="w-5 h-5" strokeWidth={1.75} />
                                    </div>
                                </foreignObject>

                                {/* Small Text Directly Under Icon */}
                                <text
                                    x={col.app.x}
                                    y={col.app.y + 27}
                                    textAnchor="middle"
                                    className={`font-mono text-[9.5px] tracking-widest transition-all duration-300 uppercase pointer-events-none ${textOpacity} ${
                                        isFocused ? "font-bold" : "font-medium"
                                    }`}
                                    style={{
                                        fill: isFocused ? "#ffffff" : col.colorTop
                                    }}
                                >
                                    {col.app.label}
                                </text>

                                {/* Connection Pin Dot */}
                                <circle
                                    cx={col.app.x}
                                    cy={58}
                                    r={isFocused ? 2.5 : 2}
                                    fill={col.colorTop}
                                    className={`transition-all duration-300 ${textOpacity}`}
                                />
                            </g>
                        );
                    })}

                    {/* BOTTOM ROW: HARDWARE (Icon + Text below, No Containers) */}
                    {COLUMNS.map((col, idx) => {
                        const Icon = col.hw.icon;
                        const isFocused = hoveredCol === idx;
                        const hasFocus = hoveredCol !== null;
                        const textOpacity = hasFocus && !isFocused ? "opacity-35" : "opacity-100";

                        return (
                            <g
                                key={`hw-${col.id}`}
                                onMouseEnter={() => setHoveredCol(idx)}
                                onMouseLeave={() => setHoveredCol(null)}
                                className="cursor-pointer group"
                            >
                                {/* Invisible touch/click hit area */}
                                <rect
                                    x={col.hw.x - 32}
                                    y={col.hw.y - 18}
                                    width={64}
                                    height={56}
                                    fill="transparent"
                                />

                                {/* Connection Pin Dot */}
                                <circle
                                    cx={col.hw.x}
                                    cy={188}
                                    r={isFocused ? 2.5 : 2}
                                    fill={col.colorBottom}
                                    className={`transition-all duration-300 ${textOpacity}`}
                                />

                                {/* Icon directly */}
                                <foreignObject
                                    x={col.hw.x - 12}
                                    y={col.hw.y - 4}
                                    width={24}
                                    height={24}
                                    className="overflow-visible pointer-events-none"
                                >
                                    <div
                                        className={`transition-all duration-300 flex items-center justify-center ${textOpacity} ${
                                            isFocused ? "scale-115" : "scale-100"
                                        }`}
                                        style={{
                                            color: col.colorBottom,
                                            filter: isFocused
                                                ? `drop-shadow(0 0 10px ${col.colorBottom})`
                                                : `drop-shadow(0 0 4px ${col.colorBottom}80)`
                                        }}
                                    >
                                        <Icon className="w-5 h-5" strokeWidth={1.75} />
                                    </div>
                                </foreignObject>

                                {/* Small Text Directly Under Icon */}
                                <text
                                    x={col.hw.x}
                                    y={col.hw.y + 31}
                                    textAnchor="middle"
                                    className={`font-mono text-[9.5px] tracking-widest transition-all duration-300 uppercase pointer-events-none ${textOpacity} ${
                                        isFocused ? "font-bold" : "font-medium"
                                    }`}
                                    style={{
                                        fill: isFocused ? "#ffffff" : col.colorBottom
                                    }}
                                >
                                    {col.hw.label}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}
