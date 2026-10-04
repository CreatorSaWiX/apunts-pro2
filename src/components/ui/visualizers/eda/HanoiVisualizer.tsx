"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Play, Pause } from 'lucide-react';

export default function HanoiVisualizer() {
    // 0: Arrel (inici), 1..7: Moviments elementals 1 a 7, 8: Final
    const [stepIdx, setStepIdx] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const totalSteps = 9;

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
        }, 1500);

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

    // Estats actius dels nodes i branques
    const isLeftTreeActive = stepIdx >= 1 && stepIdx <= 3;
    const isCenterActive = stepIdx === 4;
    const isRightTreeActive = stepIdx >= 5 && stepIdx <= 7;

    const moves = [
        { id: 1, label: '1. A → C', disc: 'Disc 1', x: 20, active: stepIdx >= 1, current: stepIdx === 1, color: '#38bdf8' },
        { id: 2, label: '2. A → B', disc: 'Disc 2', x: 106, active: stepIdx >= 2, current: stepIdx === 2, color: '#38bdf8' },
        { id: 3, label: '3. C → B', disc: 'Disc 1', x: 192, active: stepIdx >= 3, current: stepIdx === 3, color: '#38bdf8' },
        { id: 4, label: '4. A → C', disc: 'Disc 3 (Base)', x: 288, active: stepIdx >= 4, current: stepIdx === 4, color: '#10b981' },
        { id: 5, label: '5. B → A', disc: 'Disc 1', x: 404, active: stepIdx >= 5, current: stepIdx === 5, color: '#c084fc' },
        { id: 6, label: '6. B → C', disc: 'Disc 2', x: 490, active: stepIdx >= 6, current: stepIdx === 6, color: '#c084fc' },
        { id: 7, label: '7. A → C', disc: 'Disc 1', x: 576, active: stepIdx >= 7, current: stepIdx === 7, color: '#c084fc' },
    ];

    return (
        <div className="w-full flex flex-col items-center gap-2 my-6 font-mono select-none not-prose px-2 bg-transparent">

            {/* CONTROLS ESTACIONARIS I CENTRATS */}
            <div className="w-full max-w-2xl flex items-center justify-end gap-1 px-1">
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

            {/* ARBRE BINARI DE RECURSIÓ SUBTRACTIVA (SVG) */}
            <div className="w-full max-w-2xl relative">
                <svg
                    className="w-full h-auto select-none"
                    viewBox="0 0 680 245"
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

                    {/* ===================== LINIES DE CONNEXIÓ (NIVELL 0 -> NIVELL 1) ===================== */}
                    {/* Arrel cap a Branca Esquerra */}
                    <path
                        d="M 290 38 C 240 50, 185 52, 185 68"
                        fill="none"
                        stroke={isLeftTreeActive ? "#38bdf8" : "#334155"}
                        strokeWidth={isLeftTreeActive ? 2 : 1}
                        markerEnd={isLeftTreeActive ? "url(#arrow-cyan)" : undefined}
                        className="transition-all duration-300"
                    />
                    {/* Arrel cap a Moviment Central Disc 3 */}
                    <path
                        d="M 340 38 L 340 68"
                        fill="none"
                        stroke={isCenterActive ? "#10b981" : "#334155"}
                        strokeWidth={isCenterActive ? 2 : 1}
                        markerEnd={isCenterActive ? "url(#arrow-emerald)" : undefined}
                        className="transition-all duration-300"
                    />
                    {/* Arrel cap a Branca Dreta */}
                    <path
                        d="M 390 38 C 440 50, 495 52, 495 68"
                        fill="none"
                        stroke={isRightTreeActive ? "#c084fc" : "#334155"}
                        strokeWidth={isRightTreeActive ? 2 : 1}
                        markerEnd={isRightTreeActive ? "url(#arrow-purple)" : undefined}
                        className="transition-all duration-300"
                    />

                    {/* ===================== LINIES DE CONNEXIÓ (NIVELL 1 -> NIVELL 2 FULLES) ===================== */}
                    {/* Subarbre esquerre cap a moviments 1, 2, 3 */}
                    <path
                        d="M 150 94 C 110 105, 59 105, 59 122"
                        fill="none"
                        stroke={stepIdx >= 1 ? "#38bdf8" : "#334155"}
                        strokeWidth={stepIdx === 1 ? 2 : 1}
                        className="transition-all duration-200"
                    />
                    <path
                        d="M 185 94 L 145 122"
                        fill="none"
                        stroke={stepIdx >= 2 ? "#38bdf8" : "#334155"}
                        strokeWidth={stepIdx === 2 ? 2 : 1}
                        className="transition-all duration-200"
                    />
                    <path
                        d="M 220 94 C 231 105, 231 108, 231 122"
                        fill="none"
                        stroke={stepIdx >= 3 ? "#38bdf8" : "#334155"}
                        strokeWidth={stepIdx === 3 ? 2 : 1}
                        className="transition-all duration-200"
                    />

                    {/* Moviment central disc 3 cap a fulla 4 */}
                    <path
                        d="M 340 94 L 340 122"
                        fill="none"
                        stroke={stepIdx >= 4 ? "#10b981" : "#334155"}
                        strokeWidth={stepIdx === 4 ? 2 : 1}
                        className="transition-all duration-200"
                    />

                    {/* Subarbre dret cap a moviments 5, 6, 7 */}
                    <path
                        d="M 460 94 C 443 105, 443 108, 443 122"
                        fill="none"
                        stroke={stepIdx >= 5 ? "#c084fc" : "#334155"}
                        strokeWidth={stepIdx === 5 ? 2 : 1}
                        className="transition-all duration-200"
                    />
                    <path
                        d="M 495 94 L 529 122"
                        fill="none"
                        stroke={stepIdx >= 6 ? "#c084fc" : "#334155"}
                        strokeWidth={stepIdx === 6 ? 2 : 1}
                        className="transition-all duration-200"
                    />
                    <path
                        d="M 530 94 C 570 105, 615 105, 615 122"
                        fill="none"
                        stroke={stepIdx >= 7 ? "#c084fc" : "#334155"}
                        strokeWidth={stepIdx === 7 ? 2 : 1}
                        className="transition-all duration-200"
                    />

                    {/* ===================== NIVELL 0: CRIDA ARREL ===================== */}
                    <g transform="translate(235, 10)">
                        <rect
                            x="0" y="0" width="210" height="28" rx="6"
                            fill="#0f172a" fillOpacity="0.9"
                            stroke="#f59e0b" strokeWidth="1.5"
                        />
                        <text x="105" y="18" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">
                            hanoi(3, A, B, C)
                        </text>
                    </g>

                    {/* ===================== NIVELL 1: ELS DOS SUBPROBLEMES (n-1 = 2) ===================== */}
                    {/* Branca 1: Moure n-1 discs d'origen (A) a auxiliar (B) */}
                    <g transform="translate(100, 68)">
                        <rect
                            x="0" y="0" width="170" height="26" rx="5"
                            fill="#0f172a" fillOpacity="0.9"
                            stroke={isLeftTreeActive ? "#38bdf8" : "#334155"}
                            strokeWidth={isLeftTreeActive ? 1.5 : 1}
                        />
                        <text x="85" y="17" textAnchor="middle" fill={isLeftTreeActive ? "#38bdf8" : "#64748b"} fontSize="10" fontWeight="bold">
                            hanoi(2, A, C, B)
                        </text>
                    </g>

                    {/* Pas elemental no recursiu: Moure disc n (3) d'origen (A) a destí (C) */}
                    <g transform="translate(285, 68)">
                        <rect
                            x="0" y="0" width="110" height="26" rx="5"
                            fill="#0f172a" fillOpacity="0.9"
                            stroke={isCenterActive ? "#10b981" : "#334155"}
                            strokeWidth={isCenterActive ? 2 : 1}
                        />
                        <text x="55" y="17" textAnchor="middle" fill={isCenterActive ? "#34d399" : "#64748b"} fontSize="10" fontWeight="bold">
                            Disc 3: A → C
                        </text>
                    </g>

                    {/* Branca 2: Moure n-1 discs d'auxiliar (B) a destí (C) */}
                    <g transform="translate(410, 68)">
                        <rect
                            x="0" y="0" width="170" height="26" rx="5"
                            fill="#0f172a" fillOpacity="0.9"
                            stroke={isRightTreeActive ? "#c084fc" : "#334155"}
                            strokeWidth={isRightTreeActive ? 1.5 : 1}
                        />
                        <text x="85" y="17" textAnchor="middle" fill={isRightTreeActive ? "#c084fc" : "#64748b"} fontSize="10" fontWeight="bold">
                            hanoi(2, B, A, C)
                        </text>
                    </g>

                    {/* ===================== NIVELL 2: ELS 7 MOVIMENTS ELEMENTALS (ORDRE IN-ORDER) ===================== */}
                    {moves.map(m => {
                        const width = m.id === 4 ? 104 : 78;
                        return (
                            <g key={`move-node-${m.id}`} transform={`translate(${m.x}, 122)`}>
                                <rect
                                    x="0" y="0" width={width} height="28" rx="5"
                                    fill={m.current ? m.color : m.active ? "#0f172a" : "#020617"}
                                    fillOpacity={m.current ? 0.25 : m.active ? 0.9 : 0.4}
                                    stroke={m.current ? m.color : m.active ? m.color : "#334155"}
                                    strokeWidth={m.current ? 2 : 1}
                                    className="transition-all duration-200"
                                />
                                <text
                                    x={width / 2} y="13" textAnchor="middle"
                                    fill={m.active ? "#f8fafc" : "#475569"}
                                    fontSize="8.5" fontWeight="bold"
                                >
                                    {m.label}
                                </text>
                                <text
                                    x={width / 2} y="23" textAnchor="middle"
                                    fill={m.active ? m.color : "#334155"}
                                    fontSize="7.5"
                                >
                                    {m.disc}
                                </text>
                            </g>
                        );
                    })}

                    {/* ===================== SEQÜÈNCIA D'EXECUCIÓ (TRAÇA CRONOLÒGICA) ===================== */}
                    <g transform="translate(15, 172)">
                        <text x="0" y="14" fill="#64748b" fontSize="10" fontWeight="bold">
                            Traça elemental ({moves.filter(m => m.active).length} / 7):
                        </text>
                        {moves.map((m, idx) => {
                            const xPos = 180 + idx * 70;
                            return (
                                <g key={`pill-${m.id}`} transform={`translate(${xPos}, 0)`}>
                                    <rect
                                        x="0" y="0" width="64" height="20" rx="4"
                                        fill={m.current ? m.color : m.active ? "#0f172a" : "#020617"}
                                        fillOpacity={m.current ? 0.3 : m.active ? 0.8 : 0.3}
                                        stroke={m.active ? m.color : "#334155"}
                                        strokeWidth={m.current ? 1.5 : 1}
                                    />
                                    <text
                                        x="32" y="14" textAnchor="middle"
                                        fill={m.active ? "#f8fafc" : "#475569"}
                                        fontSize="8.5" fontWeight="bold"
                                    >
                                        {m.label.split('. ')[1]}
                                    </text>
                                </g>
                            );
                        })}
                    </g>

                    {/* ===================== LÍNIA ASIMPTÒTICA INFERIOR ===================== */}
                    <g transform="translate(15, 226)">
                        <text x="0" y="0" fill="#64748b" fontSize="11">
                            Recurrència subtractiva (a = 2, b = 1, k = 0)
                        </text>
                        <text x="650" y="0" textAnchor="end" fill="#f59e0b" fontSize="11" fontWeight="bold">
                            T(n) = 2T(n - 1) + Θ(1) → Θ(2^n)
                        </text>
                    </g>
                </svg>
            </div>

        </div>
    );
}
