"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Play, Pause, Check } from 'lucide-react';

const DEFAULT_ARRAY = [3, 7, 11, 18, 25, 31, 42, 54, 63, 79, 88];
const DEFAULT_TARGET = 54;

interface StepInfo {
    e: number;
    d: number;
    m: number;
    midVal: number;
    comparison: '<' | '>' | '==';
    isFound: boolean;
}

function computeSteps(arr: number[], target: number): StepInfo[] {
    const steps: StepInfo[] = [];
    let e = 0;
    let d = arr.length - 1;

    while (e <= d) {
        const m = Math.floor((e + d) / 2);
        const midVal = arr[m];

        if (midVal === target) {
            steps.push({ e, d, m, midVal, comparison: '==', isFound: true });
            break;
        } else if (target < midVal) {
            steps.push({ e, d, m, midVal, comparison: '<', isFound: false });
            d = m - 1;
        } else {
            steps.push({ e, d, m, midVal, comparison: '>', isFound: false });
            e = m + 1;
        }
    }

    return steps;
}

export default function BinarySearchVisualizer() {
    const [target, setTarget] = useState<number>(DEFAULT_TARGET);
    const [stepIdx, setStepIdx] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const steps = useMemo(() => computeSteps(DEFAULT_ARRAY, target), [target]);
    const currentStep = steps[stepIdx] || steps[0];

    useEffect(() => {
        if (!isPlaying) return;

        const interval = setInterval(() => {
            setStepIdx(prev => {
                if (prev >= steps.length - 1) {
                    setIsPlaying(false);
                    return prev;
                }
                return prev + 1;
            });
        }, 1500);

        return () => clearInterval(interval);
    }, [isPlaying, steps.length]);

    const prevStep = () => {
        setIsPlaying(false);
        setStepIdx(prev => Math.max(0, prev - 1));
    };

    const nextStep = () => {
        setIsPlaying(false);
        setStepIdx(prev => Math.min(steps.length - 1, prev + 1));
    };

    const reset = () => {
        setIsPlaying(false);
        setStepIdx(0);
    };

    const togglePlay = () => {
        if (stepIdx >= steps.length - 1) {
            setStepIdx(0);
            setIsPlaying(true);
        } else {
            setIsPlaying(prev => !prev);
        }
    };

    const handleSelectTarget = (val: number) => {
        setIsPlaying(false);
        setTarget(val);
        setStepIdx(0);
    };

    // Geometria de la graella de cel·les
    const cellWidth = 44;
    const gap = 6;
    const pitch = cellWidth + gap; // 50
    const startX = Math.round((600 - (DEFAULT_ARRAY.length * pitch - gap)) / 2); // 28

    const getCenterX = (idx: number) => startX + idx * pitch + cellWidth / 2;

    const eX = getCenterX(currentStep.e);
    const dX = getCenterX(currentStep.d);
    const mX = getCenterX(currentStep.m);

    const intervalWidth = Math.max(currentStep.d - currentStep.e + 1, 1);

    return (
        <div className="w-full flex flex-col items-center gap-4 my-8 font-mono select-none not-prose px-2">

            {/* CONTROLS DE REPRODUCCIÓ MINIMALISTES AMB SELECTOR DE TARGET */}
            <div className="flex items-center gap-3">
                {/* Indicador de target interactiu */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/60 border border-white/10 text-xs">
                    <span className="text-slate-500">cerca:</span>
                    <span className="text-sky-300 font-bold">x = {target}</span>
                </div>

                {/* Botons de reproducció */}
                <div className="flex items-center gap-1.5">
                    <button
                        type="button"
                        onClick={togglePlay}
                        title={isPlaying ? "Pausar" : "Reproduir cerca"}
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
                        disabled={stepIdx === steps.length - 1}
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
            </div>

            {/* DIBUIX VISUAL EN SVG (100% transparent, vector scalat) */}
            <div className="w-full max-w-2xl relative">
                <svg
                    className="w-full h-auto select-none"
                    viewBox="0 0 600 170"
                >
                    <defs>
                        {/* Fletxa dreta (target > A[m]) */}
                        <marker
                            id="bin-arrow-right"
                            viewBox="0 0 10 10"
                            refX="7"
                            refY="5"
                            markerWidth="6"
                            markerHeight="6"
                            orient="auto"
                        >
                            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f59e0b" />
                        </marker>

                        {/* Fletxa esquerra (target < A[m]) */}
                        <marker
                            id="bin-arrow-left"
                            viewBox="0 0 10 10"
                            refX="7"
                            refY="5"
                            markerWidth="6"
                            markerHeight="6"
                            orient="auto-start-reverse"
                        >
                            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f59e0b" />
                        </marker>
                    </defs>

                    {/* --- VECTOR I ÍNDEXS --- */}
                    {DEFAULT_ARRAY.map((val, idx) => {
                        const cellX = startX + idx * pitch;
                        const centerX = cellX + cellWidth / 2;

                        const isInRange = idx >= currentStep.e && idx <= currentStep.d;
                        const isMid = idx === currentStep.m;
                        const isFound = currentStep.isFound && isMid;

                        return (
                            <g
                                key={`bin-cell-${idx}`}
                                className="cursor-pointer transition-all duration-300"
                                onClick={() => handleSelectTarget(val)}
                            >
                                {/* Índex superior */}
                                <text
                                    x={centerX}
                                    y="14"
                                    textAnchor="middle"
                                    fontSize="10"
                                    fill={isInRange ? '#94a3b8' : '#334155'}
                                    fontWeight="bold"
                                    className="transition-all duration-200"
                                >
                                    {idx}
                                </text>

                                {/* Cel·la del vector */}
                                <rect
                                    x={cellX}
                                    y="22"
                                    width={cellWidth}
                                    height={cellWidth}
                                    rx="8"
                                    fill={
                                        isFound
                                            ? '#061e14'
                                            : isMid
                                            ? '#1e1b4b'
                                            : isInRange
                                            ? '#0f172a'
                                            : '#090d16'
                                    }
                                    stroke={
                                        isFound
                                            ? '#10b981'
                                            : isMid
                                            ? '#f59e0b'
                                            : isInRange
                                            ? '#334155'
                                            : '#1e293b'
                                    }
                                    strokeWidth={isFound ? 2.5 : isMid ? 2 : 1}
                                    opacity={isInRange ? 1 : 0.22}
                                    className="transition-all duration-200"
                                />

                                {/* Valor numèric */}
                                <text
                                    x={centerX}
                                    y="45"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill={
                                        isFound
                                            ? '#6ee7b7'
                                            : isMid
                                            ? '#fef08a'
                                            : isInRange
                                            ? '#f1f5f9'
                                            : '#475569'
                                    }
                                    fontSize="12.5"
                                    fontWeight="bold"
                                    className="transition-all duration-200"
                                >
                                    {val}
                                </text>
                            </g>
                        );
                    })}

                    {/* --- PUNTERS (e, m, d) SOTA EL VECTOR --- */}
                    {/* Indicador e */}
                    {currentStep.e !== currentStep.m && (
                        <g transform={`translate(${eX}, 74)`} className="transition-all duration-300">
                            <path d="M 0 -3 L 4 3 L -4 3 z" fill="#38bdf8" />
                            <text x="0" y="14" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">
                                e
                            </text>
                        </g>
                    )}

                    {/* Indicador d */}
                    {currentStep.d !== currentStep.m && (
                        <g transform={`translate(${dX}, 74)`} className="transition-all duration-300">
                            <path d="M 0 -3 L 4 3 L -4 3 z" fill="#38bdf8" />
                            <text x="0" y="14" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">
                                d
                            </text>
                        </g>
                    )}

                    {/* Indicador m (o combinació quan coincideixen) */}
                    <g transform={`translate(${mX}, 74)`} className="transition-all duration-300">
                        <path
                            d="M 0 -3 L 4 3 L -4 3 z"
                            fill={currentStep.isFound ? '#10b981' : '#f59e0b'}
                        />
                        <text
                            x="0"
                            y="14"
                            textAnchor="middle"
                            fill={currentStep.isFound ? '#10b981' : '#f59e0b'}
                            fontSize="10"
                            fontWeight="bold"
                        >
                            {currentStep.e === currentStep.d
                                ? 'e=m=d'
                                : currentStep.e === currentStep.m
                                ? 'e, m'
                                : currentStep.d === currentStep.m
                                ? 'm, d'
                                : 'm'}
                        </text>
                    </g>

                    {/* --- COMPARACIÓ VISUAL I DIRECCIÓ --- */}
                    <g transform="translate(300, 114)">
                        {currentStep.isFound ? (
                            <g className="transition-all duration-300">
                                <circle cx="-42" cy="-1" r="7" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
                                <path d="M -45 -1 L -43 1 L -39 -3" stroke="#6ee7b7" strokeWidth="1.5" fill="none" />
                                <text
                                    x="-28"
                                    y="0"
                                    dominantBaseline="middle"
                                    textAnchor="start"
                                    fill="#6ee7b7"
                                    fontSize="12"
                                    fontWeight="bold"
                                >
                                    A[{currentStep.m}] = {target}
                                </text>
                            </g>
                        ) : currentStep.comparison === '>' ? (
                            <g className="transition-all duration-300">
                                <text
                                    x="-15"
                                    y="0"
                                    dominantBaseline="middle"
                                    textAnchor="end"
                                    fill="#fbbf24"
                                    fontSize="11.5"
                                    fontWeight="bold"
                                >
                                    {target} &gt; {currentStep.midVal}
                                </text>
                                <line
                                    x1="5"
                                    y1="0"
                                    x2="45"
                                    y2="0"
                                    stroke="#f59e0b"
                                    strokeWidth="2"
                                    markerEnd="url(#bin-arrow-right)"
                                />
                            </g>
                        ) : (
                            <g className="transition-all duration-300">
                                <line
                                    x1="-5"
                                    y1="0"
                                    x2="-45"
                                    y2="0"
                                    stroke="#f59e0b"
                                    strokeWidth="2"
                                    markerEnd="url(#bin-arrow-left)"
                                />
                                <text
                                    x="15"
                                    y="0"
                                    dominantBaseline="middle"
                                    textAnchor="start"
                                    fill="#fbbf24"
                                    fontSize="11.5"
                                    fontWeight="bold"
                                >
                                    {target} &lt; {currentStep.midVal}
                                </text>
                            </g>
                        )}
                    </g>

                    {/* --- CLAQUETA / BRACKET DE LA FINESTRA ACTIVA [e..d] --- */}
                    <g className="transition-all duration-300">
                        {/* Línia horitzontal de l'interval */}
                        <line
                            x1={eX}
                            y1="144"
                            x2={dX}
                            y2="144"
                            stroke={currentStep.isFound ? '#10b981' : '#38bdf8'}
                            strokeWidth="1.8"
                            opacity="0.8"
                            className="transition-all duration-200"
                        />
                        {/* Tics extrems */}
                        <line
                            x1={eX}
                            y1="139"
                            x2={eX}
                            y2="149"
                            stroke={currentStep.isFound ? '#10b981' : '#38bdf8'}
                            strokeWidth="1.8"
                            opacity="0.8"
                        />
                        <line
                            x1={dX}
                            y1="139"
                            x2={dX}
                            y2="149"
                            stroke={currentStep.isFound ? '#10b981' : '#38bdf8'}
                            strokeWidth="1.8"
                            opacity="0.8"
                        />

                        {/* Mida de l'interval restant */}
                        <text
                            x={(eX + dX) / 2}
                            y="161"
                            textAnchor="middle"
                            fill={currentStep.isFound ? '#6ee7b7' : '#94a3b8'}
                            fontSize="10"
                            fontWeight="bold"
                            className="transition-all duration-200"
                        >
                            {currentStep.isFound
                                ? 'trobat'
                                : `mida = ${intervalWidth}`}
                        </text>
                    </g>
                </svg>
            </div>

        </div>
    );
}
