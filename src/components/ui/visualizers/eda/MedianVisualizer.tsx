"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Play, Pause } from 'lucide-react';

export default function MedianVisualizer() {
    const [mode, setMode] = useState<'concept' | 'robustness'>('concept');
    const [stepIdx, setStepIdx] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    // Mode 1: 0: Desordenat, 1: Ordenat, 2: Mediana central (5), 3: Partició 50% / 50%
    // Mode 2: 0: Dades amb outlier (100), 1: Mitjana aritmètica (10.9), 2: Mediana (1), 3: Comparativa de robustesa
    const totalSteps = 4;

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
        }, 1600);

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

    const changeMode = (m: 'concept' | 'robustness') => {
        setIsPlaying(false);
        setMode(m);
        setStepIdx(0);
    };

    // Dades per al Mode 1 (Concepte)
    const rawArrayConcept = [7, 2, 9, 1, 5, 8, 3];
    const sortedArrayConcept = [1, 2, 3, 5, 7, 8, 9];
    const medianIdxConcept = 3; // Valor 5

    // Dades per al Mode 2 (Robustesa amb Outlier)
    const outlierArray = [1, 1, 1, 1, 1, 1, 1, 1, 1, 100];
    const medianIdxOutlier = 4; // Índex 4 (o 4/5, per conveni el menor -> valor 1)

    return (
        <div className="w-full flex flex-col items-center gap-3 my-8 font-mono select-none not-prose px-2 bg-transparent">

            {/* CONTROLS I COMMUTADOR DE MODE */}
            <div className="w-full max-w-xl flex flex-wrap items-center justify-between gap-2 px-1">
                {/* Selector de mode (Pills compactes) */}
                <div className="flex bg-slate-900/60 p-0.5 rounded-lg border border-white/5 gap-1 text-xs">
                    <button
                        type="button"
                        onClick={() => changeMode('concept')}
                        className={`px-2.5 py-1 rounded-md font-bold transition-all duration-150 ${
                            mode === 'concept'
                                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                : 'text-slate-400 hover:text-slate-200 border border-transparent'
                        }`}
                    >
                        Concepte (Partició 50/50)
                    </button>
                    <button
                        type="button"
                        onClick={() => changeMode('robustness')}
                        className={`px-2.5 py-1 rounded-md font-bold transition-all duration-150 ${
                            mode === 'robustness'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'text-slate-400 hover:text-slate-200 border border-transparent'
                        }`}
                    >
                        Robustesa vs Mitjana (Outlier)
                    </button>
                </div>

                {/* Controls estacionaris */}
                <div className="flex items-center gap-1">
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
            </div>

            {/* ZONA VISUAL DEL VECTOR (ESTIL MERGEVISUALIZER) */}
            <div className="w-full max-w-xl flex flex-col items-center gap-4 py-2">

                {/* ===================== MODE 1: CONCEPTE I PARTICIÓ ===================== */}
                {mode === 'concept' && (
                    <>
                        {/* Estat o etiqueta superior del pas */}
                        <div className="text-xs text-slate-400 text-center font-bold">
                            {stepIdx === 0 && "1. Entrada desordenada (n = 7, senar)"}
                            {stepIdx === 1 && "2. Vector ordenat per trobar la posició central"}
                            {stepIdx === 2 && "3. Mediana identificada al centre: k = ⌊(7+1)/2⌋ = 4"}
                            {stepIdx === 3 && "4. Propietat clau: Exactament 50% inferiors i 50% superiors"}
                        </div>

                        {/* Cel·les del vector S */}
                        <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                            {(stepIdx === 0 ? rawArrayConcept : sortedArrayConcept).map((val, idx) => {
                                const isMedian = stepIdx >= 2 && idx === medianIdxConcept;
                                const isLower = stepIdx === 3 && idx < medianIdxConcept;
                                const isUpper = stepIdx === 3 && idx > medianIdxConcept;

                                return (
                                    <div key={`concept-cell-${idx}`} className="flex flex-col items-center gap-1">
                                        <div
                                            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl border-2 flex items-center justify-center font-bold text-sm sm:text-base transition-all duration-300 ${
                                                isMedian
                                                    ? 'bg-emerald-950/70 border-emerald-400 text-emerald-200 scale-110 shadow-[0_0_15px_rgba(16,185,129,0.35)]'
                                                    : isLower
                                                    ? 'bg-sky-950/50 border-sky-400 text-sky-200'
                                                    : isUpper
                                                    ? 'bg-purple-950/50 border-purple-400 text-purple-200'
                                                    : 'bg-slate-900/60 border-slate-700 text-slate-200'
                                            }`}
                                        >
                                            {val}
                                        </div>

                                        {/* Indicador inferior */}
                                        <div className="h-5 flex items-center justify-center">
                                            {isMedian && (
                                                <span className="text-[10px] font-bold text-emerald-400 animate-pulse">
                                                    ▲ Mediana
                                                </span>
                                            )}
                                            {isLower && stepIdx === 3 && (
                                                <span className="text-[9px] text-sky-400 font-bold">≤ 5</span>
                                            )}
                                            {isUpper && stepIdx === 3 && (
                                                <span className="text-[9px] text-purple-400 font-bold">≥ 5</span>
                                            )}
                                            {stepIdx < 2 && (
                                                <span className="text-[9px] text-slate-600">[{idx}]</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Indicadors de partició equilibrada en el pas 3 */}
                        {stepIdx === 3 ? (
                            <div className="flex items-center justify-between w-full max-w-md px-3 text-xs">
                                <span className="text-sky-400 font-bold">3 elements ≤ 5 (50%)</span>
                                <span className="text-emerald-400 font-bold">Mediana = 5</span>
                                <span className="text-purple-400 font-bold">3 elements ≥ 5 (50%)</span>
                            </div>
                        ) : (
                            <div className="h-4" />
                        )}
                    </>
                )}

                {/* ===================== MODE 2: ROBUSTESA VS MITJANA (OUTLIER) ===================== */}
                {mode === 'robustness' && (
                    <>
                        <div className="text-xs text-slate-400 text-center font-bold">
                            {stepIdx === 0 && "1. Dades amb 9 valors normals (1) i un extrem anòmal (100)"}
                            {stepIdx === 1 && "2. La mitjana aritmètica es dispara per culpa de l'outlier: x̄ = 10.9"}
                            {stepIdx === 2 && "3. La mediana és completament robusta: Mediana = 1 (immune a l'anomalia)"}
                            {stepIdx === 3 && "4. Síntesi: Pertinença garantida (1 ∈ S) vs Valor fantasma (10.9 ∉ S)"}
                        </div>

                        {/* Cel·les del vector de 10 elements */}
                        <div className="flex items-center justify-center gap-1 sm:gap-1.5 overflow-x-auto max-w-full px-1">
                            {outlierArray.map((val, idx) => {
                                const isOutlier = idx === 9;
                                const isMedian = stepIdx >= 2 && idx === medianIdxOutlier;
                                const highlightOutlier = stepIdx >= 1 && isOutlier;

                                return (
                                    <div key={`outlier-cell-${idx}`} className="flex flex-col items-center gap-1">
                                        <div
                                            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border-2 flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${
                                                isMedian
                                                    ? 'bg-emerald-950/70 border-emerald-400 text-emerald-200 scale-105 shadow-[0_0_15px_rgba(16,185,129,0.35)]'
                                                    : highlightOutlier
                                                    ? 'bg-rose-950/60 border-rose-400 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.35)]'
                                                    : 'bg-slate-900/60 border-slate-700 text-slate-200'
                                            }`}
                                        >
                                            {val}
                                        </div>

                                        <div className="h-5 flex items-center justify-center">
                                            {isMedian && (
                                                <span className="text-[9px] font-bold text-emerald-400 animate-pulse">
                                                    ▲ Med
                                                </span>
                                            )}
                                            {isOutlier && (
                                                <span className="text-[9px] font-bold text-rose-400">
                                                    Outlier
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Taula comparativa de valors */}
                        <div className="w-full max-w-md flex items-center justify-around p-2 rounded-xl bg-slate-900/40 border border-white/5 text-xs">
                            <div className="flex flex-col items-center gap-0.5">
                                <span className="text-slate-500 text-[10px] font-bold">MITJANA ARITMÈTICA (x̄)</span>
                                <span className={`font-bold text-sm ${stepIdx >= 1 ? 'text-rose-400' : 'text-slate-600'}`}>
                                    {stepIdx >= 1 ? "x̄ = 10.9" : "—"}
                                </span>
                                <span className="text-[10px] text-slate-500">
                                    {stepIdx >= 1 ? "10.9 ∉ S (enganyosa)" : ""}
                                </span>
                            </div>

                            <div className="w-px h-8 bg-slate-800" />

                            <div className="flex flex-col items-center gap-0.5">
                                <span className="text-slate-500 text-[10px] font-bold">MEDIANA (k = ⌊(n+1)/2⌋)</span>
                                <span className={`font-bold text-sm ${stepIdx >= 2 ? 'text-emerald-400' : 'text-slate-600'}`}>
                                    {stepIdx >= 2 ? "Mediana = 1" : "—"}
                                </span>
                                <span className="text-[10px] text-slate-500">
                                    {stepIdx >= 2 ? "1 ∈ S (robustesa 100%)" : ""}
                                </span>
                            </div>
                        </div>
                    </>
                )}

            </div>

            {/* MÈTRICA SINTÈTICA INFERIOR */}
            <div className="w-full max-w-xl flex items-center justify-between text-xs text-slate-400 px-2 font-mono">
                <span className="text-slate-500">
                    {mode === 'concept' ? "Partició equilibrada: n elements → 50% / 50%" : "Sensibilitat: Mitjana (0% cota) vs Mediana (50% punt de ruptura)"}
                </span>
                <span className={mode === 'concept' ? "text-sky-400 font-bold" : "text-emerald-400 font-bold"}>
                    {mode === 'concept' ? "k = ⌊(n + 1) / 2⌋" : "Immune a valors extrems"}
                </span>
            </div>

        </div>
    );
}
