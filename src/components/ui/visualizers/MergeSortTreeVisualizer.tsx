"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Play, Pause } from 'lucide-react';

interface TreeStep {
    id: number;
    phase: 'divide' | 'base' | 'merge';
    activeLevel: number;
    // Nodes values at this step
    l0: number[];
    l1_0: number[];
    l1_1: number[];
    l2: number[][];
    l3: number[];
    // Active edges direction & color
    activeEdges: 'none' | 'l0_l1_down' | 'l1_l2_down' | 'l2_l3_down' | 'l3_l2_up' | 'l2_l1_up' | 'l1_l0_up';
}

const TREE_STEPS: TreeStep[] = [
    {
        id: 0,
        phase: 'divide',
        activeLevel: 0,
        l0: [8, 7, 2, 4, 6, 1, 1, 5],
        l1_0: [8, 7, 2, 4],
        l1_1: [6, 1, 1, 5],
        l2: [[8, 7], [2, 4], [6, 1], [1, 5]],
        l3: [8, 7, 2, 4, 6, 1, 1, 5],
        activeEdges: 'none',
    },
    {
        id: 1,
        phase: 'divide',
        activeLevel: 1,
        l0: [8, 7, 2, 4, 6, 1, 1, 5],
        l1_0: [8, 7, 2, 4],
        l1_1: [6, 1, 1, 5],
        l2: [[8, 7], [2, 4], [6, 1], [1, 5]],
        l3: [8, 7, 2, 4, 6, 1, 1, 5],
        activeEdges: 'l0_l1_down',
    },
    {
        id: 2,
        phase: 'divide',
        activeLevel: 2,
        l0: [8, 7, 2, 4, 6, 1, 1, 5],
        l1_0: [8, 7, 2, 4],
        l1_1: [6, 1, 1, 5],
        l2: [[8, 7], [2, 4], [6, 1], [1, 5]],
        l3: [8, 7, 2, 4, 6, 1, 1, 5],
        activeEdges: 'l1_l2_down',
    },
    {
        id: 3,
        phase: 'base',
        activeLevel: 3,
        l0: [8, 7, 2, 4, 6, 1, 1, 5],
        l1_0: [8, 7, 2, 4],
        l1_1: [6, 1, 1, 5],
        l2: [[8, 7], [2, 4], [6, 1], [1, 5]],
        l3: [8, 7, 2, 4, 6, 1, 1, 5],
        activeEdges: 'l2_l3_down',
    },
    {
        id: 4,
        phase: 'merge',
        activeLevel: 2,
        l0: [8, 7, 2, 4, 6, 1, 1, 5],
        l1_0: [8, 7, 2, 4],
        l1_1: [6, 1, 1, 5],
        l2: [[7, 8], [2, 4], [1, 6], [1, 5]],
        l3: [8, 7, 2, 4, 6, 1, 1, 5],
        activeEdges: 'l3_l2_up',
    },
    {
        id: 5,
        phase: 'merge',
        activeLevel: 1,
        l0: [8, 7, 2, 4, 6, 1, 1, 5],
        l1_0: [2, 4, 7, 8],
        l1_1: [1, 1, 5, 6],
        l2: [[7, 8], [2, 4], [1, 6], [1, 5]],
        l3: [8, 7, 2, 4, 6, 1, 1, 5],
        activeEdges: 'l2_l1_up',
    },
    {
        id: 6,
        phase: 'merge',
        activeLevel: 0,
        l0: [1, 1, 2, 4, 5, 6, 7, 8],
        l1_0: [2, 4, 7, 8],
        l1_1: [1, 1, 5, 6],
        l2: [[7, 8], [2, 4], [1, 6], [1, 5]],
        l3: [8, 7, 2, 4, 6, 1, 1, 5],
        activeEdges: 'l1_l0_up',
    },
];

export default function MergeSortTreeVisualizer() {
    const [stepIdx, setStepIdx] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const currentStep = TREE_STEPS[stepIdx];

    useEffect(() => {
        if (!isPlaying) return;

        const interval = setInterval(() => {
            setStepIdx(prev => {
                if (prev >= TREE_STEPS.length - 1) {
                    setIsPlaying(false);
                    return prev;
                }
                return prev + 1;
            });
        }, 1500);

        return () => clearInterval(interval);
    }, [isPlaying]);

    const prevStep = () => {
        setIsPlaying(false);
        setStepIdx(prev => Math.max(0, prev - 1));
    };

    const nextStep = () => {
        setIsPlaying(false);
        setStepIdx(prev => Math.min(TREE_STEPS.length - 1, prev + 1));
    };

    const reset = () => {
        setIsPlaying(false);
        setStepIdx(0);
    };

    const togglePlay = () => {
        if (stepIdx >= TREE_STEPS.length - 1) {
            setStepIdx(0);
            setIsPlaying(true);
        } else {
            setIsPlaying(prev => !prev);
        }
    };

    // Estils d'aresta segons el pas actiu
    const getEdgeStyle = (edgeGroup: 'l0_l1' | 'l1_l2' | 'l2_l3') => {
        const { activeEdges } = currentStep;

        if (edgeGroup === 'l0_l1') {
            if (activeEdges === 'l0_l1_down') {
                return { stroke: '#f59e0b', strokeWidth: 2.2, markerEnd: 'url(#tree-arrow-down-amber)', opacity: 1 };
            }
            if (activeEdges === 'l1_l0_up') {
                return { stroke: '#10b981', strokeWidth: 2.5, markerStart: 'url(#tree-arrow-up-emerald)', opacity: 1 };
            }
            if (stepIdx > 1) {
                return { stroke: stepIdx >= 5 ? '#059669' : '#334155', strokeWidth: 1.2, opacity: 0.6 };
            }
            return { stroke: '#1e293b', strokeWidth: 1, opacity: 0.25 };
        }

        if (edgeGroup === 'l1_l2') {
            if (activeEdges === 'l1_l2_down') {
                return { stroke: '#f59e0b', strokeWidth: 2.2, markerEnd: 'url(#tree-arrow-down-amber)', opacity: 1 };
            }
            if (activeEdges === 'l2_l1_up') {
                return { stroke: '#10b981', strokeWidth: 2.5, markerStart: 'url(#tree-arrow-up-emerald)', opacity: 1 };
            }
            if (stepIdx > 2) {
                return { stroke: stepIdx >= 4 ? '#059669' : '#334155', strokeWidth: 1.2, opacity: 0.6 };
            }
            return { stroke: '#1e293b', strokeWidth: 1, opacity: 0.25 };
        }

        if (edgeGroup === 'l2_l3') {
            if (activeEdges === 'l2_l3_down') {
                return { stroke: '#f59e0b', strokeWidth: 2, markerEnd: 'url(#tree-arrow-down-amber)', opacity: 1 };
            }
            if (activeEdges === 'l3_l2_up') {
                return { stroke: '#10b981', strokeWidth: 2.2, markerStart: 'url(#tree-arrow-up-emerald)', opacity: 1 };
            }
            if (stepIdx > 3) {
                return { stroke: '#059669', strokeWidth: 1.2, opacity: 0.5 };
            }
            return { stroke: '#1e293b', strokeWidth: 1, opacity: 0.25 };
        }

        return { stroke: '#334155', strokeWidth: 1, opacity: 0.4 };
    };

    const isLevelActive = (lvl: number) => currentStep.activeLevel === lvl;
    const isLevelVisible = (lvl: number) => {
        if (currentStep.phase === 'divide') {
            return lvl <= currentStep.activeLevel;
        }
        return true;
    };

    return (
        <div className="w-full flex flex-col items-center gap-4 my-8 font-mono select-none not-prose px-2">

            {/* CONTROLS DE REPRODUCCIÓ MINIMALISTES */}
            <div className="flex items-center gap-1.5">
                <button
                    type="button"
                    onClick={togglePlay}
                    title={isPlaying ? "Pausar" : "Reproduir arbre complet"}
                    className={`p-1.5 rounded-lg border transition ${
                        isPlaying
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-slate-900/40 hover:bg-slate-800 border-white/5 text-slate-300'
                    }`}
                >
                    {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <button
                    type="button"
                    onClick={prevStep}
                    disabled={stepIdx === 0}
                    title="Pas anterior"
                    className="p-1.5 rounded-lg bg-slate-900/40 hover:bg-slate-800 border border-white/5 text-slate-400 hover:text-slate-200 transition disabled:opacity-30 disabled:pointer-events-none"
                >
                    <ArrowLeft size={14} />
                </button>
                <button
                    type="button"
                    onClick={nextStep}
                    disabled={stepIdx === TREE_STEPS.length - 1}
                    title="Següent pas"
                    className="p-1.5 rounded-lg bg-slate-900/40 hover:bg-slate-800 border border-white/5 text-slate-400 hover:text-slate-200 transition disabled:opacity-30 disabled:pointer-events-none"
                >
                    <ArrowRight size={14} />
                </button>
                <button
                    type="button"
                    onClick={reset}
                    title="Reiniciar"
                    className="p-1.5 rounded-lg bg-slate-900/40 hover:bg-slate-800 border border-white/5 text-slate-400 hover:text-slate-200 transition"
                >
                    <RotateCcw size={14} />
                </button>
            </div>

            {/* DIBUIX DE L'ARBRE EN SVG (100% transparent, minimalista) */}
            <div className="w-full max-w-2xl relative">
                <svg
                    className="w-full h-auto select-none"
                    viewBox="0 0 640 280"
                >
                    <defs>
                        {/* Fletxa cap avall (divisió top-down, ambre) */}
                        <marker
                            id="tree-arrow-down-amber"
                            viewBox="0 0 10 10"
                            refX="7"
                            refY="5"
                            markerWidth="6"
                            markerHeight="6"
                            orient="auto"
                        >
                            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f59e0b" />
                        </marker>

                        {/* Fletxa cap amunt (fusió bottom-up, maragda) */}
                        <marker
                            id="tree-arrow-up-emerald"
                            viewBox="0 0 10 10"
                            refX="7"
                            refY="5"
                            markerWidth="6"
                            markerHeight="6"
                            orient="auto-start-reverse"
                        >
                            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#10b981" />
                        </marker>
                    </defs>

                    {/* --- ARESTES DE L'ARBRE (NIVELL 0 -> NIVELL 1) --- */}
                    <g className="transition-all duration-300">
                        <path
                            d="M 320 44 L 180 88"
                            {...getEdgeStyle('l0_l1')}
                            className="transition-all duration-300"
                        />
                        <path
                            d="M 320 44 L 460 88"
                            {...getEdgeStyle('l0_l1')}
                            className="transition-all duration-300"
                        />
                    </g>

                    {/* --- ARESTES (NIVELL 1 -> NIVELL 2) --- */}
                    <g className="transition-all duration-300">
                        <path d="M 180 114 L 110 160" {...getEdgeStyle('l1_l2')} className="transition-all duration-300" />
                        <path d="M 180 114 L 250 160" {...getEdgeStyle('l1_l2')} className="transition-all duration-300" />
                        <path d="M 460 114 L 390 160" {...getEdgeStyle('l1_l2')} className="transition-all duration-300" />
                        <path d="M 460 114 L 530 160" {...getEdgeStyle('l1_l2')} className="transition-all duration-300" />
                    </g>

                    {/* --- ARESTES (NIVELL 2 -> NIVELL 3 FULLES) --- */}
                    <g className="transition-all duration-300">
                        {[
                            [110, 75], [110, 145],
                            [250, 215], [250, 285],
                            [390, 355], [390, 425],
                            [530, 495], [530, 565]
                        ].map(([startX, endX], idx) => (
                            <path
                                key={`tree-edge-leaf-${idx}`}
                                d={`M ${startX} 186 L ${endX} 232`}
                                {...getEdgeStyle('l2_l3')}
                                className="transition-all duration-300"
                            />
                        ))}
                    </g>

                    {/* --- NIVELL 0: Mida 8 (Arrel) --- */}
                    <g
                        transform="translate(216, 16)"
                        className={`transition-all duration-300 ${
                            isLevelActive(0) ? 'opacity-100' : 'opacity-85'
                        }`}
                    >
                        <rect
                            width="208"
                            height="28"
                            rx="8"
                            fill={stepIdx === 6 ? '#061e14' : isLevelActive(0) ? '#0c1a2e' : '#0f172a'}
                            stroke={stepIdx === 6 ? '#10b981' : isLevelActive(0) ? '#38bdf8' : '#334155'}
                            strokeWidth={stepIdx === 6 ? 2.5 : isLevelActive(0) ? 1.8 : 1}
                            className="transition-all duration-300"
                        />
                        {currentStep.l0.map((val, idx) => (
                            <React.Fragment key={`tree-l0-${idx}`}>
                                {idx > 0 && (
                                    <line
                                        x1={idx * 26}
                                        y1="0"
                                        x2={idx * 26}
                                        y2="28"
                                        stroke={idx === 4 ? '#38bdf8' : '#334155'}
                                        strokeWidth={idx === 4 ? 2 : 0.8}
                                    />
                                )}
                                <text
                                    x={idx * 26 + 13}
                                    y="15"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill={stepIdx === 6 ? '#a7f3d0' : isLevelActive(0) ? '#f8fafc' : '#cbd5e1'}
                                    fontSize="11"
                                    fontWeight="bold"
                                    className="transition-all duration-200"
                                >
                                    {val}
                                </text>
                            </React.Fragment>
                        ))}
                    </g>

                    {/* --- NIVELL 1: Mida 4 (2 subvectors) --- */}
                    <g className={`transition-all duration-300 ${isLevelVisible(1) ? (isLevelActive(1) ? 'opacity-100' : 'opacity-85') : 'opacity-20'}`}>
                        {/* Esquerra: T[0..3] */}
                        <g transform="translate(128, 88)">
                            <rect
                                width="104"
                                height="26"
                                rx="6"
                                fill={stepIdx >= 5 ? '#061e14' : isLevelActive(1) ? '#172554' : '#0f172a'}
                                stroke={stepIdx >= 5 ? '#10b981' : isLevelActive(1) ? '#38bdf8' : '#334155'}
                                strokeWidth={isLevelActive(1) ? 1.8 : 1}
                                className="transition-all duration-300"
                            />
                            {currentStep.l1_0.map((val, idx) => (
                                <React.Fragment key={`tree-l1-0-${idx}`}>
                                    {idx > 0 && <line x1={idx * 26} y1="0" x2={idx * 26} y2="26" stroke="#334155" strokeWidth={0.8} />}
                                    <text
                                        x={idx * 26 + 13}
                                        y="14"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fill={stepIdx >= 5 ? '#a7f3d0' : isLevelActive(1) ? '#f8fafc' : '#cbd5e1'}
                                        fontSize="10.5"
                                        fontWeight="bold"
                                        className="transition-all duration-200"
                                    >
                                        {val}
                                    </text>
                                </React.Fragment>
                            ))}
                        </g>

                        {/* Dreta: T[4..7] */}
                        <g transform="translate(408, 88)">
                            <rect
                                width="104"
                                height="26"
                                rx="6"
                                fill={stepIdx >= 5 ? '#061e14' : isLevelActive(1) ? '#1e1b4b' : '#0f172a'}
                                stroke={stepIdx >= 5 ? '#10b981' : isLevelActive(1) ? '#c084fc' : '#334155'}
                                strokeWidth={isLevelActive(1) ? 1.8 : 1}
                                className="transition-all duration-300"
                            />
                            {currentStep.l1_1.map((val, idx) => (
                                <React.Fragment key={`tree-l1-1-${idx}`}>
                                    {idx > 0 && <line x1={idx * 26} y1="0" x2={idx * 26} y2="26" stroke="#334155" strokeWidth={0.8} />}
                                    <text
                                        x={idx * 26 + 13}
                                        y="14"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fill={stepIdx >= 5 ? '#a7f3d0' : isLevelActive(1) ? '#f8fafc' : '#cbd5e1'}
                                        fontSize="10.5"
                                        fontWeight="bold"
                                        className="transition-all duration-200"
                                    >
                                        {val}
                                    </text>
                                </React.Fragment>
                            ))}
                        </g>
                    </g>

                    {/* --- NIVELL 2: Mida 2 (4 subvectors) --- */}
                    <g className={`transition-all duration-300 ${isLevelVisible(2) ? (isLevelActive(2) ? 'opacity-100' : 'opacity-85') : 'opacity-20'}`}>
                        {[
                            { x: 84, vals: currentStep.l2[0] },
                            { x: 224, vals: currentStep.l2[1] },
                            { x: 364, vals: currentStep.l2[2] },
                            { x: 504, vals: currentStep.l2[3] },
                        ].map((node, nIdx) => (
                            <g key={`tree-l2-node-${nIdx}`} transform={`translate(${node.x}, 160)`}>
                                <rect
                                    width="52"
                                    height="26"
                                    rx="6"
                                    fill={stepIdx >= 4 ? '#061e14' : isLevelActive(2) ? '#1e293b' : '#0f172a'}
                                    stroke={stepIdx >= 4 ? '#10b981' : isLevelActive(2) ? '#f59e0b' : '#334155'}
                                    strokeWidth={isLevelActive(2) ? 1.6 : 1}
                                    className="transition-all duration-300"
                                />
                                <line x1="26" y1="0" x2="26" y2="26" stroke="#334155" strokeWidth={0.8} />
                                <text x="13" y="14" textAnchor="middle" dominantBaseline="middle" fill={stepIdx >= 4 ? '#a7f3d0' : '#cbd5e1'} fontSize="10" fontWeight="bold">
                                    {node.vals[0]}
                                </text>
                                <text x="39" y="14" textAnchor="middle" dominantBaseline="middle" fill={stepIdx >= 4 ? '#a7f3d0' : '#cbd5e1'} fontSize="10" fontWeight="bold">
                                    {node.vals[1]}
                                </text>
                            </g>
                        ))}
                    </g>

                    {/* --- NIVELL 3: Mida 1 (8 Casos Base) --- */}
                    <g className={`transition-all duration-300 ${isLevelVisible(3) ? (isLevelActive(3) ? 'opacity-100' : 'opacity-85') : 'opacity-20'}`}>
                        {[62, 132, 202, 272, 342, 412, 482, 552].map((x, idx) => (
                            <g key={`tree-l3-leaf-${idx}`} transform={`translate(${x}, 232)`}>
                                <rect
                                    width="26"
                                    height="26"
                                    rx="6"
                                    fill={stepIdx >= 3 ? '#061e14' : '#0f172a'}
                                    stroke={isLevelActive(3) ? '#34d399' : stepIdx >= 3 ? '#10b981' : '#334155'}
                                    strokeWidth={isLevelActive(3) ? 1.8 : 1}
                                    className="transition-all duration-300"
                                />
                                <text
                                    x="13"
                                    y="14"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill={stepIdx >= 3 ? '#6ee7b7' : '#94a3b8'}
                                    fontSize="10.5"
                                    fontWeight="bold"
                                >
                                    {currentStep.l3[idx]}
                                </text>
                            </g>
                        ))}

                        {/* Indicador de Cas Base */}
                        <g transform="translate(600, 245)">
                            <text
                                x="0"
                                y="0"
                                textAnchor="start"
                                dominantBaseline="middle"
                                fill="#10b981"
                                fontSize="9.5"
                                fontWeight="bold"
                            >
                                e = d
                            </text>
                        </g>
                    </g>
                </svg>
            </div>

        </div>
    );
}
