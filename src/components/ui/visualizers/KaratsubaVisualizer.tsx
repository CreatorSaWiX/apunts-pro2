"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Play, Pause } from 'lucide-react';

export default function KaratsubaVisualizer() {
    const [stepIdx, setStepIdx] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    // 0: Entrada, 1: Branques, 2: Càlcul productes, 3: Terme creuat Gauss, 4: Resultat final
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
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
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

            {/* DIBUIX PURAMENT VISUAL DE L'ALGORISME DE KARATSUBA (SVG) */}
            <div className="w-full max-w-xl relative">
                <svg
                    className="w-full h-auto select-none"
                    viewBox="0 0 640 230"
                >
                    <defs>
                        <marker
                            id="arrow-cyan"
                            viewBox="0 0 10 10"
                            refX="7"
                            refY="5"
                            markerWidth="5"
                            markerHeight="5"
                            orient="auto"
                        >
                            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8" />
                        </marker>
                        <marker
                            id="arrow-emerald"
                            viewBox="0 0 10 10"
                            refX="7"
                            refY="5"
                            markerWidth="5"
                            markerHeight="5"
                            orient="auto"
                        >
                            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#10b981" />
                        </marker>
                        <marker
                            id="arrow-purple"
                            viewBox="0 0 10 10"
                            refX="7"
                            refY="5"
                            markerWidth="5"
                            markerHeight="5"
                            orient="auto"
                        >
                            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#c084fc" />
                        </marker>
                    </defs>

                    {/* ===================== LINIES DE CONNEXIÓ ===================== */}
                    {/* De l'arrel a les 3 branques */}
                    <path
                        d="M 280 44 C 280 75, 115 75, 115 95"
                        fill="none"
                        stroke={isBranchesActive ? "#38bdf8" : "#334155"}
                        strokeWidth={isBranchesActive ? 2 : 1}
                        strokeDasharray={isBranchesActive ? undefined : "3 3"}
                        markerEnd={isBranchesActive ? "url(#arrow-cyan)" : undefined}
                        className="transition-all duration-300"
                    />
                    <path
                        d="M 320 44 L 320 95"
                        fill="none"
                        stroke={isBranchesActive ? "#10b981" : "#334155"}
                        strokeWidth={isBranchesActive ? 2 : 1}
                        strokeDasharray={isBranchesActive ? undefined : "3 3"}
                        markerEnd={isBranchesActive ? "url(#arrow-emerald)" : undefined}
                        className="transition-all duration-300"
                    />
                    <path
                        d="M 360 44 C 360 75, 525 75, 525 95"
                        fill="none"
                        stroke={isBranchesActive ? "#c084fc" : "#334155"}
                        strokeWidth={isBranchesActive ? 2 : 1}
                        strokeDasharray={isBranchesActive ? undefined : "3 3"}
                        markerEnd={isBranchesActive ? "url(#arrow-purple)" : undefined}
                        className="transition-all duration-300"
                    />

                    {/* De les 3 branques a la recombinació final */}
                    <path
                        d="M 115 132 C 115 160, 260 160, 285 178"
                        fill="none"
                        stroke={isFinal ? "#38bdf8" : isCrossed ? "#38bdf8" : "#334155"}
                        strokeWidth={isFinal ? 2 : 1}
                        className="transition-all duration-300"
                    />
                    <path
                        d="M 320 132 L 320 178"
                        fill="none"
                        stroke={isFinal ? "#10b981" : isCrossed ? "#10b981" : "#334155"}
                        strokeWidth={isFinal ? 2 : 1}
                        className="transition-all duration-300"
                    />
                    <path
                        d="M 525 132 C 525 160, 380 160, 355 178"
                        fill="none"
                        stroke={isFinal ? "#c084fc" : isCrossed ? "#c084fc" : "#334155"}
                        strokeWidth={isFinal ? 2 : 1}
                        className="transition-all duration-300"
                    />

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
                            stroke="#10b981"
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

                    {/* ===================== NIVELL INTERMEDI: 3 BRANQUES ===================== */}
                    {/* Branca 1 (Alts a = 20 * 17) */}
                    <g transform="translate(35, 98)">
                        <rect
                            x="0"
                            y="0"
                            width="160"
                            height="34"
                            rx="8"
                            fill="#0f172a"
                            fillOpacity="0.9"
                            stroke={isCalculated ? "#38bdf8" : "#334155"}
                            strokeWidth={isCalculated ? 1.5 : 1}
                        />
                        <text
                            x="80"
                            y="21"
                            textAnchor="middle"
                            fill={isCalculated ? "#38bdf8" : "#64748b"}
                            fontSize="12"
                            fontWeight="bold"
                            fontFamily="monospace"
                        >
                            {isCalculated ? "a = 20 × 17 = 340" : "a = x_E · y_E"}
                        </text>
                    </g>

                    {/* Branca 2 (Sumes Gauss c = 34 * 31 -> c - a - b) */}
                    <g transform="translate(225, 98)">
                        <rect
                            x="0"
                            y="0"
                            width="190"
                            height="34"
                            rx="8"
                            fill="#0f172a"
                            fillOpacity="0.9"
                            stroke={isCrossed ? "#10b981" : isCalculated ? "#34d399" : "#334155"}
                            strokeWidth={isCrossed ? 2 : 1}
                        />
                        <text
                            x="95"
                            y="21"
                            textAnchor="middle"
                            fill={isCrossed ? "#34d399" : isCalculated ? "#6ee7b7" : "#64748b"}
                            fontSize="12"
                            fontWeight="bold"
                            fontFamily="monospace"
                        >
                            {isCrossed
                                ? "c - a - b = 518"
                                : isCalculated
                                ? "c = 34 × 31 = 1054"
                                : "c = (x_E+x_D)(y_E+y_D)"}
                        </text>
                    </g>

                    {/* Branca 3 (Baixos b = 14 * 14) */}
                    <g transform="translate(445, 98)">
                        <rect
                            x="0"
                            y="0"
                            width="160"
                            height="34"
                            rx="8"
                            fill="#0f172a"
                            fillOpacity="0.9"
                            stroke={isCalculated ? "#c084fc" : "#334155"}
                            strokeWidth={isCalculated ? 1.5 : 1}
                        />
                        <text
                            x="80"
                            y="21"
                            textAnchor="middle"
                            fill={isCalculated ? "#c084fc" : "#64748b"}
                            fontSize="12"
                            fontWeight="bold"
                            fontFamily="monospace"
                        >
                            {isCalculated ? "b = 14 × 14 = 196" : "b = x_D · y_D"}
                        </text>
                    </g>

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
                            stroke={isFinal ? "#10b981" : "#334155"}
                            strokeWidth={isFinal ? 2 : 1}
                            className="transition-all duration-300"
                        />
                        <text
                            x="190"
                            y="24"
                            textAnchor="middle"
                            fill={isFinal ? "#34d399" : "#64748b"}
                            fontSize="12"
                            fontWeight="bold"
                            fontFamily="monospace"
                        >
                            {isFinal
                                ? "340·10⁴ + 518·10² + 196 = 3.451.996"
                                : "10⁴·a + 10²·(c - a - b) + b"}
                        </text>
                    </g>
                </svg>
            </div>

            {/* MÈTRICA ASIMPTÒTICA (SENSE CAIXES DE TEXT) */}
            <div className="w-full max-w-xl flex items-center justify-between text-xs text-slate-400 px-2 font-mono">
                <span className="text-slate-500">
                    3 subproblemes recursius (a = 3)
                </span>
                <span className="text-emerald-400 font-bold">
                    T(n) = 3T(n/2) + Θ(n) → Θ(n^1.585)
                </span>
            </div>

        </div>
    );
}
