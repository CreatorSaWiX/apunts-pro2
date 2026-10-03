"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Play, Pause } from 'lucide-react';

export default function NaiveMultVisualizer() {
    const [stepIdx, setStepIdx] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    // 0: Entrada, 1: Ramificació 4 subproblemes, 2: Càlcul 4 productes, 3: Suma termes creuats, 4: Recombinació final
    const totalSteps = 5;

    useEffect(() => {
        if (!isPlaying) return;

        const interval = setInterval(() => {
            setStepIdx(prev => {
                if (prev >= totalSteps - 1) {
                    setIsPlaying(false);
                    return prev;
                }
                return prev + 1;
            });
        }, 1400);

        return () => clearInterval(interval);
    }, [isPlaying, totalSteps]);

    const prevStep = () => {
        setIsPlaying(false);
        setStepIdx(prev => Math.max(0, prev - 1));
    };

    const nextStep = () => {
        setIsPlaying(false);
        setStepIdx(prev => Math.min(totalSteps - 1, prev + 1));
    };

    const reset = () => {
        setIsPlaying(false);
        setStepIdx(0);
    };

    const togglePlay = () => {
        if (stepIdx >= totalSteps - 1) {
            setStepIdx(0);
            setIsPlaying(true);
        } else {
            setIsPlaying(prev => !prev);
        }
    };

    const isBranchesActive = stepIdx >= 1;
    const isCalculated = stepIdx >= 2;
    const isCrossed = stepIdx >= 3;
    const isFinal = stepIdx >= 4;

    const branches = [
        { id: 'p1', xTarget: 85, label: 'P₁ = 20×17 = 340', formula: 'P₁ = x_E · y_E' },
        { id: 'p2', xTarget: 240, label: 'P₂ = 20×14 = 280', formula: 'P₂ = x_E · y_D' },
        { id: 'p3', xTarget: 400, label: 'P₃ = 14×17 = 238', formula: 'P₃ = x_D · y_E' },
        { id: 'p4', xTarget: 555, label: 'P₄ = 14×14 = 196', formula: 'P₄ = x_D · y_D' },
    ];

    return (
        <div className="w-full flex flex-col items-center gap-2 my-6 font-mono select-none not-prose px-2 bg-transparent">

            {/* CONTROLS ESTACIONARIS I CENTRATS */}
            <div className="w-full max-w-xl flex items-center justify-end gap-1 px-1">
                <button
                    type="button"
                    onClick={togglePlay}
                    title={isPlaying ? "Pausar" : "Reproduir"}
                    className={`p-1.5 rounded-lg border transition ${
                        isPlaying
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-slate-900/40 hover:bg-slate-800 border-white/5 text-slate-300'
                    }`}
                >
                    {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                </button>
                <button
                    type="button"
                    onClick={prevStep}
                    disabled={stepIdx === 0}
                    title="Pas anterior"
                    className="p-1.5 rounded-lg bg-slate-900/40 hover:bg-slate-800 border border-white/5 text-slate-400 hover:text-slate-200 transition disabled:opacity-30 disabled:pointer-events-none"
                >
                    <ArrowLeft size={13} />
                </button>
                <button
                    type="button"
                    onClick={nextStep}
                    disabled={stepIdx === totalSteps - 1}
                    title="Següent pas"
                    className="p-1.5 rounded-lg bg-slate-900/40 hover:bg-slate-800 border border-white/5 text-slate-400 hover:text-slate-200 transition disabled:opacity-30 disabled:pointer-events-none"
                >
                    <ArrowRight size={13} />
                </button>
                <button
                    type="button"
                    onClick={reset}
                    title="Reiniciar"
                    className="p-1.5 rounded-lg bg-slate-900/40 hover:bg-slate-800 border border-white/5 text-slate-400 hover:text-slate-200 transition"
                >
                    <RotateCcw size={13} />
                </button>
            </div>

            {/* DIBUIX PURAMENT VISUAL DE L'ALGORISME INGENU (SVG) */}
            <div className="w-full max-w-xl relative">
                <svg
                    className="w-full h-auto select-none"
                    viewBox="0 0 640 230"
                >
                    <defs>
                        <marker
                            id="arrow-amber"
                            viewBox="0 0 10 10"
                            refX="7"
                            refY="5"
                            markerWidth="5"
                            markerHeight="5"
                            orient="auto"
                        >
                            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f59e0b" />
                        </marker>
                    </defs>

                    {/* ===================== LINIES DE CONNEXIÓ ===================== */}
                    {/* De l'arrel a les 4 branques */}
                    {branches.map(b => (
                        <path
                            key={`naive-branch-${b.id}`}
                            d={`M 320 44 C 320 75, ${b.xTarget} 75, ${b.xTarget} 95`}
                            fill="none"
                            stroke={isBranchesActive ? "#f59e0b" : "#334155"}
                            strokeWidth={isBranchesActive ? 2 : 1}
                            strokeDasharray={isBranchesActive ? undefined : "3 3"}
                            markerEnd={isBranchesActive ? "url(#arrow-amber)" : undefined}
                            className="transition-all duration-300"
                        />
                    ))}

                    {/* De les 4 branques a la recombinació */}
                    {branches.map(b => (
                        <path
                            key={`naive-merge-${b.id}`}
                            d={`M ${b.xTarget} 132 C ${b.xTarget} 160, 320 160, 320 178`}
                            fill="none"
                            stroke={isFinal ? "#f59e0b" : (isCrossed && (b.id === 'p2' || b.id === 'p3')) ? "#f59e0b" : "#334155"}
                            strokeWidth={isFinal ? 2 : 1}
                            className="transition-all duration-300"
                        />
                    ))}

                    {/* ===================== NIVELL SUPERIOR: OPERANDS ===================== */}
                    <g transform="translate(180, 10)">
                        <rect
                            x="0"
                            y="0"
                            width="280"
                            height="34"
                            rx="10"
                            fill="#0f172a"
                            fillOpacity="0.8"
                            stroke="#f59e0b"
                            strokeWidth="1.5"
                            strokeOpacity="0.6"
                        />
                        <text
                            x="140"
                            y="22"
                            textAnchor="middle"
                            fill="#f8fafc"
                            fontSize="13"
                            fontWeight="bold"
                            fontFamily="monospace"
                        >
                            2014 × 1714 → [20 | 14] × [17 | 14]
                        </text>
                    </g>

                    {/* ===================== NIVELL INTERMEDI: 4 SUBPRODUCTES ===================== */}
                    {branches.map(b => {
                        const isMiddle = b.id === 'p2' || b.id === 'p3';
                        const highlight = isCrossed && isMiddle;
                        return (
                            <g key={`naive-node-${b.id}`} transform={`translate(${b.xTarget - 67}, 98)`}>
                                <rect
                                    x="0"
                                    y="0"
                                    width="134"
                                    height="34"
                                    rx="8"
                                    fill="#0f172a"
                                    fillOpacity="0.9"
                                    stroke={highlight ? "#fbbf24" : isCalculated ? "#f59e0b" : "#334155"}
                                    strokeWidth={highlight ? 2 : isCalculated ? 1.5 : 1}
                                />
                                <text
                                    x="67"
                                    y="21"
                                    textAnchor="middle"
                                    fill={highlight ? "#fef08a" : isCalculated ? "#fbbf24" : "#64748b"}
                                    fontSize="10"
                                    fontWeight="bold"
                                    fontFamily="monospace"
                                >
                                    {isCalculated ? b.label : b.formula}
                                </text>
                            </g>
                        );
                    })}

                    {/* ===================== NIVELL INFERIOR: RECOMBINACIÓ FINAL ===================== */}
                    <g transform="translate(130, 180)">
                        <rect
                            x="0"
                            y="0"
                            width="380"
                            height="38"
                            rx="10"
                            fill="#0f172a"
                            fillOpacity="0.95"
                            stroke={isFinal ? "#f59e0b" : "#334155"}
                            strokeWidth={isFinal ? 2 : 1}
                            className="transition-all duration-300"
                        />
                        <text
                            x="190"
                            y="24"
                            textAnchor="middle"
                            fill={isFinal ? "#fbbf24" : "#64748b"}
                            fontSize="12"
                            fontWeight="bold"
                            fontFamily="monospace"
                        >
                            {isFinal
                                ? "340·10⁴ + (280+238)·10² + 196 = 3.451.996"
                                : isCrossed
                                ? "P₂ + P₃ = 280 + 238 = 518"
                                : "10⁴·P₁ + 10²·(P₂ + P₃) + P₄"}
                        </text>
                    </g>
                </svg>
            </div>

            {/* MÈTRICA ASIMPTÒTICA (SENSE CAIXES DE TEXT) */}
            <div className="w-full max-w-xl flex items-center justify-between text-xs text-slate-400 px-2 font-mono">
                <span className="text-slate-500">
                    4 subproblemes recursius (a = 4)
                </span>
                <span className="text-amber-400 font-bold">
                    T(n) = 4T(n/2) + Θ(n) → Θ(n²)
                </span>
            </div>

        </div>
    );
}
