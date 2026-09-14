"use client";

import React, { useState } from 'react';
import { m as motion } from 'framer-motion';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

type TreeMode = 'general' | 'independent' | 'numeric';

interface ModeOption {
    id: TreeMode;
    label: string;
}

const MODES: ModeOption[] = [
    { id: 'general', label: 'General (Condicionat)' },
    { id: 'independent', label: 'Independents' },
    { id: 'numeric', label: 'Exemple numèric' },
];

export interface ProbTreeVisualizerProps {
    mode?: TreeMode;
    className?: string;
}

export default function ProbTreeVisualizer(props: ProbTreeVisualizerProps) {
    const [currentMode, setCurrentMode] = useState<TreeMode>(props.mode || 'general');
    const [hoveredPath, setHoveredPath] = useState<number | null>(null);

    const isIndep = currentMode === 'independent';
    const isNum = currentMode === 'numeric';

    // Mathematical LaTeX definitions for each branch
    const branchMath = {
        A: isNum ? '0{,}60' : 'P(A)',
        notA: isNum ? '0{,}40' : 'P(\\overline{A})',
        B_given_A: isNum ? '0{,}70' : isIndep ? 'P(B)' : 'P(B \\mid A)',
        notB_given_A: isNum ? '0{,}30' : isIndep ? 'P(\\overline{B})' : 'P(\\overline{B} \\mid A)',
        B_given_notA: isNum ? '0{,}25' : isIndep ? 'P(B)' : 'P(B \\mid \\overline{A})',
        notB_given_notA: isNum ? '0{,}75' : isIndep ? 'P(\\overline{B})' : 'P(\\overline{B} \\mid \\overline{A})',
    };

    // Mathematical LaTeX definitions for each leaf (product rule)
    const leaves = [
        {
            id: 0,
            activeColor: '#38bdf8',
            formula: isNum 
                ? 'P(A \\cap B) = 0{,}60 \\cdot 0{,}70 = 0{,}42' 
                : isIndep 
                ? 'P(A \\cap B) = P(A) \\cdot P(B)' 
                : 'P(A \\cap B) = P(A) \\cdot P(B \\mid A)',
        },
        {
            id: 1,
            activeColor: '#818cf8',
            formula: isNum 
                ? 'P(A \\cap \\overline{B}) = 0{,}60 \\cdot 0{,}30 = 0{,}18' 
                : isIndep 
                ? 'P(A \\cap \\overline{B}) = P(A) \\cdot P(\\overline{B})' 
                : 'P(A \\cap \\overline{B}) = P(A) \\cdot P(\\overline{B} \\mid A)',
        },
        {
            id: 2,
            activeColor: '#c084fc',
            formula: isNum 
                ? 'P(\\overline{A} \\cap B) = 0{,}40 \\cdot 0{,}25 = 0{,}10' 
                : isIndep 
                ? 'P(\\overline{A} \\cap B) = P(\\overline{A}) \\cdot P(B)' 
                : 'P(\\overline{A} \\cap B) = P(\\overline{A}) \\cdot P(B \\mid \\overline{A})',
        },
        {
            id: 3,
            activeColor: '#f472b6',
            formula: isNum 
                ? 'P(\\overline{A} \\cap \\overline{B}) = 0{,}40 \\cdot 0{,}75 = 0{,}30' 
                : isIndep 
                ? 'P(\\overline{A} \\cap \\overline{B}) = P(\\overline{A}) \\cdot P(\\overline{B})' 
                : 'P(\\overline{A} \\cap \\overline{B}) = P(\\overline{A}) \\cdot P(\\overline{B} \\mid \\overline{A})',
        },
    ];

    const getPathOpacity = (pathIdx: number) => {
        if (hoveredPath === null) return 0.7;
        return hoveredPath === pathIdx ? 1 : 0.2;
    };

    const isPathActive = (pathIdx: number) => hoveredPath === pathIdx;

    return (
        <div className={`w-full flex flex-col items-center justify-center gap-6 my-10 font-sans select-none not-prose ${props.className || ''}`}>
            
            {/* 1. Minimal Segmented Controls (Linear style) */}
            <div className="flex flex-nowrap items-center gap-1 p-1 bg-slate-900/50 border border-white/5 rounded-xl backdrop-blur-sm whitespace-nowrap">
                {MODES.map((mode) => {
                    const isActive = currentMode === mode.id;
                    return (
                        <button
                            key={mode.id}
                            type="button"
                            onClick={() => setCurrentMode(mode.id)}
                            className={`shrink-0 relative px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
                                isActive ? 'text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="probtree-active-pill"
                                    className="absolute inset-0 bg-white/10 border border-white/10 rounded-lg shadow-sm"
                                    transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                                />
                            )}
                            <span className="relative z-10">{mode.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* 2. Hybrid Tree Canvas — SVG curves + Real LaTeX Auto-Sized HTML Nodes */}
            <div className="w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex justify-center py-2 px-1">
                <div className="relative min-w-[650px] max-w-3xl w-full h-[260px]">
                    
                    {/* SVG Vector Curves (Smooth branches) */}
                    <svg viewBox="0 0 700 260" className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                        {/* Path 0: Root -> A -> B */}
                        <g style={{ opacity: getPathOpacity(0) }} className="transition-opacity duration-200">
                            <path
                                d="M 45 130 C 110 130, 110 65, 175 65"
                                fill="none"
                                stroke={isPathActive(0) ? '#38bdf8' : '#334155'}
                                strokeWidth={isPathActive(0) ? 2.5 : 1.5}
                                className="transition-all duration-200"
                            />
                            <path
                                d="M 195 65 C 255 65, 255 35, 325 35"
                                fill="none"
                                stroke={isPathActive(0) ? '#38bdf8' : '#334155'}
                                strokeWidth={isPathActive(0) ? 2.5 : 1.5}
                                className="transition-all duration-200"
                            />
                            <line
                                x1="345" y1="35" x2="385" y2="35"
                                stroke={isPathActive(0) ? '#38bdf8' : '#334155'}
                                strokeWidth="1"
                                strokeDasharray="3 3"
                            />
                        </g>

                        {/* Path 1: Root -> A -> notB */}
                        <g style={{ opacity: getPathOpacity(1) }} className="transition-opacity duration-200">
                            <path
                                d="M 45 130 C 110 130, 110 65, 175 65"
                                fill="none"
                                stroke={isPathActive(1) ? '#818cf8' : '#334155'}
                                strokeWidth={isPathActive(1) ? 2.5 : 1.5}
                                className="transition-all duration-200"
                            />
                            <path
                                d="M 195 65 C 255 65, 255 95, 325 95"
                                fill="none"
                                stroke={isPathActive(1) ? '#818cf8' : '#334155'}
                                strokeWidth={isPathActive(1) ? 2.5 : 1.5}
                                className="transition-all duration-200"
                            />
                            <line
                                x1="345" y1="95" x2="385" y2="95"
                                stroke={isPathActive(1) ? '#818cf8' : '#334155'}
                                strokeWidth="1"
                                strokeDasharray="3 3"
                            />
                        </g>

                        {/* Path 2: Root -> notA -> B */}
                        <g style={{ opacity: getPathOpacity(2) }} className="transition-opacity duration-200">
                            <path
                                d="M 45 130 C 110 130, 110 195, 175 195"
                                fill="none"
                                stroke={isPathActive(2) ? '#c084fc' : '#334155'}
                                strokeWidth={isPathActive(2) ? 2.5 : 1.5}
                                className="transition-all duration-200"
                            />
                            <path
                                d="M 195 195 C 255 195, 255 165, 325 165"
                                fill="none"
                                stroke={isPathActive(2) ? '#c084fc' : '#334155'}
                                strokeWidth={isPathActive(2) ? 2.5 : 1.5}
                                className="transition-all duration-200"
                            />
                            <line
                                x1="345" y1="165" x2="385" y2="165"
                                stroke={isPathActive(2) ? '#c084fc' : '#334155'}
                                strokeWidth="1"
                                strokeDasharray="3 3"
                            />
                        </g>

                        {/* Path 3: Root -> notA -> notB */}
                        <g style={{ opacity: getPathOpacity(3) }} className="transition-opacity duration-200">
                            <path
                                d="M 45 130 C 110 130, 110 195, 175 195"
                                fill="none"
                                stroke={isPathActive(3) ? '#f472b6' : '#334155'}
                                strokeWidth={isPathActive(3) ? 2.5 : 1.5}
                                className="transition-all duration-200"
                            />
                            <path
                                d="M 195 195 C 255 195, 255 225, 325 225"
                                fill="none"
                                stroke={isPathActive(3) ? '#f472b6' : '#334155'}
                                strokeWidth={isPathActive(3) ? 2.5 : 1.5}
                                className="transition-all duration-200"
                            />
                            <line
                                x1="345" y1="225" x2="385" y2="225"
                                stroke={isPathActive(3) ? '#f472b6' : '#334155'}
                                strokeWidth="1"
                                strokeDasharray="3 3"
                            />
                        </g>
                    </svg>

                    {/* ================= HTML NODES & BADGES WITH REAL LATEX ================= */}
                    {/* Root Node Ω */}
                    <div 
                        style={{ left: '4.5%', top: '50%', transform: 'translate(-50%, -50%)' }}
                        className="absolute z-10 w-8 h-8 rounded-xl bg-slate-900 border border-white/15 flex items-center justify-center text-slate-300 font-mono font-bold text-xs shadow-md pointer-events-none"
                    >
                        <InlineMath math="\Omega" />
                    </div>

                    {/* Stage 1: Branch Labels */}
                    <div 
                        style={{ left: '15.5%', top: '35%', transform: 'translate(-50%, -50%)' }}
                        className="absolute z-10 px-2 py-0.5 rounded-lg bg-slate-950 border border-white/10 text-xs text-sky-300 shadow-sm pointer-events-none whitespace-nowrap"
                    >
                        <InlineMath math={branchMath.A} />
                    </div>

                    <div 
                        style={{ left: '15.5%', top: '65%', transform: 'translate(-50%, -50%)' }}
                        className="absolute z-10 px-2 py-0.5 rounded-lg bg-slate-950 border border-white/10 text-xs text-purple-300 shadow-sm pointer-events-none whitespace-nowrap"
                    >
                        <InlineMath math={branchMath.notA} />
                    </div>

                    {/* Stage 1: State Nodes */}
                    <div 
                        style={{ left: '26%', top: '25%', transform: 'translate(-50%, -50%)' }}
                        className="absolute z-10 px-2.5 py-1 rounded-xl bg-slate-900 border border-sky-400 text-sky-200 text-xs font-bold shadow-sm pointer-events-none whitespace-nowrap"
                    >
                        <InlineMath math="A" />
                    </div>

                    <div 
                        style={{ left: '26%', top: '75%', transform: 'translate(-50%, -50%)' }}
                        className="absolute z-10 px-2.5 py-1 rounded-xl bg-slate-900 border border-purple-400 text-purple-200 text-xs font-bold shadow-sm pointer-events-none whitespace-nowrap"
                    >
                        <InlineMath math="\overline{A}" />
                    </div>

                    {/* Stage 2: Branch Labels (Conditional probabilities with auto-sizing) */}
                    <div 
                        style={{ left: '36.5%', top: '18%', transform: 'translate(-50%, -50%)' }}
                        className="absolute z-10 px-2 py-0.5 rounded-lg bg-slate-950 border border-white/10 text-xs text-slate-300 shadow-sm pointer-events-none whitespace-nowrap"
                    >
                        <InlineMath math={branchMath.B_given_A} />
                    </div>

                    <div 
                        style={{ left: '36.5%', top: '33%', transform: 'translate(-50%, -50%)' }}
                        className="absolute z-10 px-2 py-0.5 rounded-lg bg-slate-950 border border-white/10 text-xs text-slate-400 shadow-sm pointer-events-none whitespace-nowrap"
                    >
                        <InlineMath math={branchMath.notB_given_A} />
                    </div>

                    <div 
                        style={{ left: '36.5%', top: '67%', transform: 'translate(-50%, -50%)' }}
                        className="absolute z-10 px-2 py-0.5 rounded-lg bg-slate-950 border border-white/10 text-xs text-slate-300 shadow-sm pointer-events-none whitespace-nowrap"
                    >
                        <InlineMath math={branchMath.B_given_notA} />
                    </div>

                    <div 
                        style={{ left: '36.5%', top: '82%', transform: 'translate(-50%, -50%)' }}
                        className="absolute z-10 px-2 py-0.5 rounded-lg bg-slate-950 border border-white/10 text-xs text-slate-400 shadow-sm pointer-events-none whitespace-nowrap"
                    >
                        <InlineMath math={branchMath.notB_given_notA} />
                    </div>

                    {/* Stage 2: Nodes B and notB */}
                    <div 
                        style={{ left: '47.5%', top: '13.5%', transform: 'translate(-50%, -50%)' }}
                        className="absolute z-10 px-2 py-1 rounded-xl bg-slate-900 border border-emerald-400 text-emerald-200 text-xs font-bold shadow-sm pointer-events-none whitespace-nowrap"
                    >
                        <InlineMath math="B" />
                    </div>

                    <div 
                        style={{ left: '47.5%', top: '36.5%', transform: 'translate(-50%, -50%)' }}
                        className="absolute z-10 px-2 py-1 rounded-xl bg-slate-900 border border-slate-600 text-slate-300 text-xs font-bold shadow-sm pointer-events-none whitespace-nowrap"
                    >
                        <InlineMath math="\overline{B}" />
                    </div>

                    <div 
                        style={{ left: '47.5%', top: '63.5%', transform: 'translate(-50%, -50%)' }}
                        className="absolute z-10 px-2 py-1 rounded-xl bg-slate-900 border border-emerald-400 text-emerald-200 text-xs font-bold shadow-sm pointer-events-none whitespace-nowrap"
                    >
                        <InlineMath math="B" />
                    </div>

                    <div 
                        style={{ left: '47.5%', top: '86.5%', transform: 'translate(-50%, -50%)' }}
                        className="absolute z-10 px-2 py-1 rounded-xl bg-slate-900 border border-slate-600 text-slate-300 text-xs font-bold shadow-sm pointer-events-none whitespace-nowrap"
                    >
                        <InlineMath math="\overline{B}" />
                    </div>

                    {/* Stage 3: Leaf Cards (Clean Auto-Sized LaTeX, Zero Text Overflow) */}
                    {leaves.map((leaf, i) => {
                        const topOffsets = ['13.5%', '36.5%', '63.5%', '86.5%'];
                        const isActive = isPathActive(i);

                        return (
                            <div
                                key={leaf.id}
                                style={{ left: '55%', top: topOffsets[i], transform: 'translate(0, -50%)' }}
                                onMouseEnter={() => setHoveredPath(i)}
                                onMouseLeave={() => setHoveredPath(null)}
                                className={`absolute z-10 px-3.5 py-1.5 rounded-xl border text-xs md:text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap shadow-sm ${
                                    isActive 
                                        ? 'bg-slate-900 border-sky-400 text-white shadow-lg shadow-sky-500/15 scale-[1.02]' 
                                        : 'bg-slate-900/70 border-white/10 text-slate-300 hover:border-white/20 hover:text-white'
                                }`}
                            >
                                <InlineMath math={leaf.formula} />
                            </div>
                        );
                    })}

                </div>
            </div>

            {/* 3. Subtitle / Pedagogical explanation */}
            <div className="flex flex-col items-center text-center gap-1 min-h-[32px]">
                <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
                    {currentMode === 'general' && "A cada camí, la probabilitat conjunta és el producte de la marginal i les condicionades."}
                    {currentMode === 'independent' && "Si A i B són independents, les probabilitats de branca no depenen del node anterior."}
                    {currentMode === 'numeric' && "La suma de totes les fulles sempre és 1: 0,42 + 0,18 + 0,10 + 0,30 = 1,00."}
                </p>
            </div>

        </div>
    );
}
