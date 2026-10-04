"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Play, Pause } from 'lucide-react';

interface StepConfig {
    id: number;
    label: string;
}

const STEPS: StepConfig[] = [
    { id: 0, label: "Blocs de mida q" },
    { id: 1, label: "Medianes de bloc" },
    { id: 2, label: "Vector n/q medianes" },
    { id: 3, label: "Pseudo-mediana" },
    { id: 4, label: "Cotes de partició" },
    { id: 5, label: "Garantia n/4" },
    { id: 6, label: "Recurrència Θ(n)" },
];

export default function BFPRTVisualizer() {
    const [stepIdx, setStepIdx] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const totalSteps = STEPS.length;

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
        }, 1800);

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

    // Paràmetres geomètrics dels 5 blocs de mida q=5
    // Vector A[l..u] centrat
    const numBlocks = 5;
    const blockWidth = 76;
    const blockGap = 10;
    const blockHeight = 28;
    const totalBlocksWidth = numBlocks * blockWidth + (numBlocks - 1) * blockGap; // 5*76 + 4*10 = 420
    const startX = (680 - totalBlocksWidth) / 2; // 130
    const topArrayY = 62;

    // Coordenades del vector inferior de n/q medianes
    const medBlockWidth = 26;
    const medGap = 8;
    const totalMedWidth = numBlocks * medBlockWidth + (numBlocks - 1) * medGap; // 5*26 + 4*8 = 162
    const medStartX = (680 - totalMedWidth) / 2; // 259
    const medArrayY = 144;

    return (
        <div className="w-full flex flex-col items-center gap-2 my-8 font-mono select-none not-prose px-2 bg-transparent">

            {/* CONTROLS DE REPRODUCCIÓ MINIMALISTES */}
            <div className="flex items-center gap-1.5">
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
                    disabled={stepIdx === totalSteps - 1}
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

            {/* DIBUIX DE L'ALGORISME EN SVG (FIB EDA SLIDES STYLE) */}
            <div className="w-full max-w-2xl relative">
                <svg
                    className="w-full h-auto select-none"
                    viewBox="0 0 680 270"
                >
                    <defs>
                        {/* Fletxa blava cap a blocs */}
                        <marker
                            id="bfprt-arrow-blue"
                            viewBox="0 0 10 10"
                            refX="7"
                            refY="5"
                            markerWidth="6"
                            markerHeight="6"
                            orient="auto"
                        >
                            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8" />
                        </marker>

                        {/* Fletxa vermella descendent */}
                        <marker
                            id="bfprt-arrow-red"
                            viewBox="0 0 10 10"
                            refX="7"
                            refY="5"
                            markerWidth="6"
                            markerHeight="6"
                            orient="auto"
                        >
                            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#ef4444" />
                        </marker>

                        {/* Fletxa verda ascendent (retorn del pivot) */}
                        <marker
                            id="bfprt-arrow-green"
                            viewBox="0 0 10 10"
                            refX="7"
                            refY="5"
                            markerWidth="6"
                            markerHeight="6"
                            orient="auto"
                        >
                            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#10b981" />
                        </marker>
                    </defs>

                    {/* ===================== FLETXES SUPERIORS: n/q BLOCS ===================== */}
                    <g className="transition-all duration-300">
                        <text
                            x="340"
                            y="18"
                            textAnchor="middle"
                            fill="#38bdf8"
                            fontSize="11"
                            fontWeight="bold"
                        >
                            n/q blocs
                        </text>

                        {/* Fletxes blaves apuntant a cada bloc */}
                        {[0, 1, 3, 4].map(b => {
                            const targetX = startX + b * (blockWidth + blockGap) + blockWidth / 2;
                            return (
                                <line
                                    key={`arrow-top-${b}`}
                                    x1="340"
                                    y1="22"
                                    x2={targetX}
                                    y2={topArrayY - 6}
                                    stroke="#38bdf8"
                                    strokeWidth="1.2"
                                    markerEnd="url(#bfprt-arrow-blue)"
                                    opacity={stepIdx <= 3 ? 0.85 : 0.3}
                                    className="transition-all duration-300"
                                />
                            );
                        })}
                    </g>

                    {/* ===================== VECTOR ORIGINAL A[l..u] ===================== */}
                    <g className="transition-all duration-300">
                        {/* Contenidor general del vector */}
                        <rect
                            x={startX - 3}
                            y={topArrayY - 3}
                            width={totalBlocksWidth + 6}
                            height={blockHeight + 6}
                            rx="6"
                            fill="#0b1329"
                            stroke="#1e293b"
                            strokeWidth="1"
                        />

                        {/* Els 5 blocs de mida q */}
                        {[0, 1, 2, 3, 4].map(b => {
                            const bX = startX + b * (blockWidth + blockGap);
                            return (
                                <g key={`block-${b}`}>
                                    {/* Requadre del bloc */}
                                    <rect
                                        x={bX}
                                        y={topArrayY}
                                        width={blockWidth}
                                        height={blockHeight}
                                        rx="4"
                                        fill="#0f172a"
                                        stroke={stepIdx === 0 && b === 0 ? "#38bdf8" : "#334155"}
                                        strokeWidth={stepIdx === 0 && b === 0 ? 1.5 : 1}
                                        className="transition-all duration-300"
                                    />

                                    {/* 5 elements (punts) a cada bloc */}
                                    {[0, 1, 2, 3, 4].map(i => {
                                        const dotX = bX + 10 + i * 14;
                                        const dotY = topArrayY + blockHeight / 2;
                                        const isBlockMedian = i === 2;
                                        const isMedianOfMedians = b === 2 && i === 2;

                                        let dotFill = "#475569";
                                        let dotStroke = "#64748b";
                                        let dotR = 4;

                                        if (isMedianOfMedians && stepIdx >= 3) {
                                            dotFill = "#10b981";
                                            dotStroke = "#34d399";
                                            dotR = 5.5;
                                        } else if (isBlockMedian && stepIdx >= 1) {
                                            dotFill = "#ef4444";
                                            dotStroke = "#f87171";
                                            dotR = 4.8;
                                        }

                                        return (
                                            <circle
                                                key={`dot-${b}-${i}`}
                                                cx={dotX}
                                                cy={dotY}
                                                r={dotR}
                                                fill={dotFill}
                                                stroke={dotStroke}
                                                strokeWidth="1.2"
                                                className="transition-all duration-300"
                                            />
                                        );
                                    })}
                                </g>
                            );
                        })}
                    </g>

                    {/* ===================== PAS 0: COTA q AL PRIMER BLOC ===================== */}
                    {stepIdx === 0 && (
                        <g transform={`translate(${startX}, ${topArrayY + blockHeight + 6})`}>
                            {/* Clau/acotació de mida q */}
                            <path
                                d={`M 0 0 L 0 5 L ${blockWidth} 5 L ${blockWidth} 0 M ${blockWidth/2} 5 L ${blockWidth/2} 9`}
                                stroke="#94a3b8"
                                strokeWidth="1"
                                fill="none"
                            />
                            <text
                                x={blockWidth / 2}
                                y="20"
                                textAnchor="middle"
                                fill="#94a3b8"
                                fontSize="10.5"
                                fontWeight="bold"
                            >
                                q
                            </text>
                        </g>
                    )}

                    {/* ===================== PAS 1: ETIQUETA MEDIANA DEL BLOC ===================== */}
                    {stepIdx === 1 && (
                        <g>
                            <path
                                d={`M 248 116 L 216 100`}
                                stroke="#ef4444"
                                strokeWidth="1.2"
                                markerEnd="url(#bfprt-arrow-red)"
                            />
                            <text
                                x="254"
                                y="126"
                                textAnchor="start"
                                fill="#ef4444"
                                fontSize="10"
                                fontWeight="bold"
                            >
                                mediana del bloc
                            </text>
                        </g>
                    )}

                    {/* ===================== PASSOS 2 I 3: PROJECCIÓ A VECTOR DE MEDIANES ===================== */}
                    {(stepIdx === 2 || stepIdx === 3) && (
                        <g className="transition-all duration-300">
                            {/* Fletxes vermelles descendents des de cada mediana de bloc */}
                            {[0, 1, 2, 3, 4].map(b => {
                                const sourceX = startX + b * (blockWidth + blockGap) + 10 + 2 * 14;
                                const sourceY = topArrayY + blockHeight + 2;
                                const targetX = medStartX + b * (medBlockWidth + medGap) + medBlockWidth / 2;
                                const targetY = medArrayY - 4;

                                return (
                                    <line
                                        key={`med-proj-${b}`}
                                        x1={sourceX}
                                        y1={sourceY}
                                        x2={targetX}
                                        y2={targetY}
                                        stroke="#ef4444"
                                        strokeWidth="1.2"
                                        strokeDasharray="3 2"
                                        markerEnd="url(#bfprt-arrow-red)"
                                        opacity="0.85"
                                    />
                                );
                            })}

                            {/* Vector de n/q medianes */}
                            <rect
                                x={medStartX - 2}
                                y={medArrayY - 2}
                                width={totalMedWidth + 4}
                                height={blockHeight + 4}
                                rx="5"
                                fill="#0f172a"
                                stroke="#ef4444"
                                strokeWidth="1.2"
                            />

                            {/* Les n/q medianes com a punts vermells / verd */}
                            {[0, 1, 2, 3, 4].map(b => {
                                const dotX = medStartX + b * (medBlockWidth + medGap) + medBlockWidth / 2;
                                const dotY = medArrayY + blockHeight / 2;
                                const isPseudoMedian = b === 2;

                                return (
                                    <circle
                                        key={`med-dot-${b}`}
                                        cx={dotX}
                                        cy={dotY}
                                        r={isPseudoMedian && stepIdx >= 3 ? 5.5 : 4.8}
                                        fill={isPseudoMedian && stepIdx >= 3 ? "#10b981" : "#ef4444"}
                                        stroke={isPseudoMedian && stepIdx >= 3 ? "#34d399" : "#f87171"}
                                        strokeWidth="1.2"
                                    />
                                );
                            })}

                            {/* Clau inferior: n/q medianes */}
                            <g transform={`translate(${medStartX}, ${medArrayY + blockHeight + 6})`}>
                                <path
                                    d={`M 0 0 L 0 4 L ${totalMedWidth} 4 L ${totalMedWidth} 0 M ${totalMedWidth/2} 4 L ${totalMedWidth/2} 8`}
                                    stroke="#ef4444"
                                    strokeWidth="1"
                                    fill="none"
                                />
                                <text
                                    x={totalMedWidth / 2}
                                    y="18"
                                    textAnchor="middle"
                                    fill="#ef4444"
                                    fontSize="10"
                                    fontWeight="bold"
                                >
                                    n/q medianes
                                </text>
                            </g>
                        </g>
                    )}

                    {/* ===================== PAS 3: PSEUDO-MEDIANA IDENTIFICADA ===================== */}
                    {stepIdx === 3 && (
                        <g className="transition-all duration-300">
                            {/* Arc verd de retorn cap a la posició original al vector A */}
                            <path
                                d={`M 354 140 C 378 126, 378 98, 354 82`}
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="1.8"
                                markerEnd="url(#bfprt-arrow-green)"
                            />

                            {/* Etiqueta pseudo-mediana trobada recursivament */}
                            <g transform="translate(190, 198)">
                                <path
                                    d="M 120 0 L 146 -32"
                                    stroke="#10b981"
                                    strokeWidth="1.2"
                                    markerEnd="url(#bfprt-arrow-green)"
                                />
                                <text x="110" y="8" textAnchor="end" fill="#34d399" fontSize="9.5" fontWeight="bold">
                                    mediana de les medianes,
                                </text>
                                <text x="110" y="21" textAnchor="end" fill="#34d399" fontSize="9.5" fontWeight="bold">
                                    trobada recursivament
                                </text>
                            </g>
                        </g>
                    )}

                    {/* ===================== PASSOS 4, 5, 6: PARTICIO USANT PIVOT VERD ===================== */}
                    {stepIdx >= 4 && (
                        <g className="transition-all duration-300">
                            {/* Clau verda general de partició sobre el vector original */}
                            <g transform={`translate(${startX - 2}, ${topArrayY + blockHeight + 6})`}>
                                <path
                                    d={`M 0 0 L 0 5 L ${totalBlocksWidth + 4} 5 L ${totalBlocksWidth + 4} 0 M ${(totalBlocksWidth + 4)/2} 5 L ${(totalBlocksWidth + 4)/2} 9`}
                                    stroke="#10b981"
                                    strokeWidth="1.2"
                                    fill="none"
                                />
                                <text
                                    x={(totalBlocksWidth + 4) / 2 - 12}
                                    y="20"
                                    textAnchor="middle"
                                    fill="#34d399"
                                    fontSize="10"
                                    fontWeight="bold"
                                >
                                    Partició del vector, usant
                                </text>
                                <circle
                                    cx={(totalBlocksWidth + 4) / 2 + 76}
                                    cy="17"
                                    r="4.5"
                                    fill="#10b981"
                                    stroke="#34d399"
                                    strokeWidth="1"
                                />
                            </g>
                        </g>
                    )}

                    {/* ===================== PAS 4: COTES INDIVIDUALS ===================== */}
                    {stepIdx === 4 && (
                        <g transform="translate(340, 142)" className="transition-all duration-300">
                            {/* Relació 1: verd >= n / (2q) vermells */}
                            <circle cx="-36" cy="12" r="5" fill="#10b981" stroke="#34d399" strokeWidth="1" />
                            <text x="-24" y="15" textAnchor="start" fill="#cbd5e1" fontSize="13" fontWeight="bold">
                                ≥
                            </text>
                            <text x="-6" y="8" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">
                                n
                            </text>
                            <line x1="-14" y1="11" x2="2" y2="11" stroke="#38bdf8" strokeWidth="1" />
                            <text x="-6" y="21" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">
                                2q
                            </text>
                            <circle cx="12" cy="12" r="5" fill="#ef4444" stroke="#f87171" strokeWidth="1" />

                            {/* Relació 2: vermell >= q / 2 negres */}
                            <circle cx="-36" cy="46" r="5" fill="#ef4444" stroke="#f87171" strokeWidth="1" />
                            <text x="-24" y="49" textAnchor="start" fill="#cbd5e1" fontSize="13" fontWeight="bold">
                                ≥
                            </text>
                            <text x="-6" y="42" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">
                                q
                            </text>
                            <line x1="-14" y1="45" x2="2" y2="45" stroke="#94a3b8" strokeWidth="1" />
                            <text x="-6" y="55" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">
                                2
                            </text>
                            <circle cx="12" cy="46" r="5" fill="#475569" stroke="#64748b" strokeWidth="1" />
                        </g>
                    )}

                    {/* ===================== PAS 5: CLAU COMBINADA (GARANTIA n/4) ===================== */}
                    {stepIdx === 5 && (
                        <g transform="translate(310, 142)" className="transition-all duration-300">
                            {/* Relació 1: verd >= n / (2q) vermells */}
                            <circle cx="-46" cy="12" r="5" fill="#10b981" stroke="#34d399" strokeWidth="1" />
                            <text x="-34" y="15" textAnchor="start" fill="#cbd5e1" fontSize="13" fontWeight="bold">
                                ≥
                            </text>
                            <text x="-16" y="8" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">
                                n
                            </text>
                            <line x1="-24" y1="11" x2="-8" y2="11" stroke="#38bdf8" strokeWidth="1" />
                            <text x="-16" y="21" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">
                                2q
                            </text>
                            <circle cx="2" cy="12" r="5" fill="#ef4444" stroke="#f87171" strokeWidth="1" />

                            {/* Relació 2: vermell >= q / 2 negres */}
                            <circle cx="-46" cy="46" r="5" fill="#ef4444" stroke="#f87171" strokeWidth="1" />
                            <text x="-34" y="49" textAnchor="start" fill="#cbd5e1" fontSize="13" fontWeight="bold">
                                ≥
                            </text>
                            <text x="-16" y="42" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">
                                q
                            </text>
                            <line x1="-24" y1="45" x2="-8" y2="45" stroke="#94a3b8" strokeWidth="1" />
                            <text x="-16" y="55" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">
                                2
                            </text>
                            <circle cx="2" cy="46" r="5" fill="#475569" stroke="#64748b" strokeWidth="1" />

                            {/* Clau dreta combinant les dues línies */}
                            <path
                                d="M 16 4 C 23 4, 23 25, 30 29 C 23 33, 23 54, 16 54"
                                fill="none"
                                stroke="#cbd5e1"
                                strokeWidth="1.5"
                            />

                            {/* Resultat: >= n / 4 elements negres */}
                            <text x="38" y="33" textAnchor="start" fill="#cbd5e1" fontSize="14" fontWeight="bold">
                                ≥
                            </text>
                            <text x="56" y="24" textAnchor="middle" fill="#34d399" fontSize="12" fontWeight="bold">
                                n
                            </text>
                            <line x1="48" y1="28" x2="64" y2="28" stroke="#34d399" strokeWidth="1.2" />
                            <text x="56" y="39" textAnchor="middle" fill="#34d399" fontSize="12" fontWeight="bold">
                                4
                            </text>
                            <circle cx="75" cy="29" r="5" fill="#475569" stroke="#64748b" strokeWidth="1" />
                        </g>
                    )}

                    {/* ===================== PAS 6: RECURRÈNCIA I LINEALITAT ===================== */}
                    {stepIdx === 6 && (
                        <g transform="translate(140, 138)" className="transition-all duration-300">
                            {/* Requadre suau de recurrència */}
                            <rect
                                x="0"
                                y="0"
                                width="400"
                                height="72"
                                rx="8"
                                fill="#0f172a"
                                fillOpacity="0.75"
                                stroke="#1e293b"
                                strokeWidth="1"
                            />

                            {/* Equació de cost C(n) */}
                            <text x="200" y="28" textAnchor="middle" fill="#f8fafc" fontSize="12.5" fontWeight="bold">
                                C(n) = <tspan fill="#34d399">C(n/q)</tspan> + <tspan fill="#38bdf8">C(3n/4)</tspan> + <tspan fill="#fbbf24">Θ(n)</tspan>
                            </text>

                            {/* Suma de fraccions i conclusió lineal */}
                            <text x="200" y="52" textAnchor="middle" fill="#94a3b8" fontSize="10.5">
                                si <tspan fill="#cbd5e1" fontWeight="bold">1/q + 3/4 &lt; 1</tspan> (si q = 5: 1/5 + 3/4 = 19/20)
                                <tspan dx="10" fill="#10b981" fontWeight="bold">⟹ C(n) ∈ Θ(n)</tspan>
                            </text>
                        </g>
                    )}

                </svg>
            </div>

            {/* PILLS D'ETAPES ALGORÍSMIQUES INTERACTIVES */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                {STEPS.map(p => {
                    const isCurrent = stepIdx === p.id;
                    const isPassed = stepIdx > p.id;
                    return (
                        <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                                setIsPlaying(false);
                                setStepIdx(p.id);
                            }}
                            className={`px-2.5 py-1 text-xs rounded-md transition border ${
                                isCurrent
                                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 font-bold'
                                    : isPassed
                                    ? 'bg-slate-900/60 border-emerald-500/30 text-emerald-400'
                                    : 'bg-slate-900/30 border-white/5 text-slate-500 hover:text-slate-300'
                            }`}
                        >
                            {p.label}
                        </button>
                    );
                })}
            </div>

        </div>
    );
}
