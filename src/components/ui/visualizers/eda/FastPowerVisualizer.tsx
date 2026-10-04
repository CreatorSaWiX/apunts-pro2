"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Play, Pause, Check } from 'lucide-react';
import { InlineMath } from 'react-katex';

interface LevelData {
    n: number;
    isBase: boolean;
    isEven: boolean;
    half: number;
    mults: number;
    equationLatex: string;
    resolvedLatex: string;
}

function computeLevels(initialN: number): LevelData[] {
    const levels: LevelData[] = [];
    let cur = initialN;

    while (cur > 0) {
        if (cur % 2 === 0) {
            const half = cur / 2;
            levels.push({
                n: cur,
                isBase: false,
                isEven: true,
                half,
                mults: 1,
                equationLatex: `x^{${cur}} = x^{${half}} \\cdot x^{${half}}`,
                resolvedLatex: `(x^{${half}})^2 = x^{${cur}}`,
            });
            cur = half;
        } else {
            const half = (cur - 1) / 2;
            levels.push({
                n: cur,
                isBase: false,
                isEven: false,
                half,
                mults: 2,
                equationLatex: `x^{${cur}} = x^{${half}} \\cdot x^{${half}} \\cdot x`,
                resolvedLatex: `(x^{${half}})^2 \\cdot x = x^{${cur}}`,
            });
            cur = half;
        }
    }

    // Cas base n = 0
    levels.push({
        n: 0,
        isBase: true,
        isEven: true,
        half: 0,
        mults: 0,
        equationLatex: `x^0 = 1`,
        resolvedLatex: `1`,
    });

    return levels;
}

const PRESETS = [
    { label: "x^24", desc: "Mixt", val: 24 },
    { label: "x^16", desc: "Potència 2", val: 16 },
    { label: "x^13", desc: "Senar", val: 13 },
];

export default function FastPowerVisualizer() {
    const [exponent, setExponent] = useState<number>(24);
    const [stepIdx, setStepIdx] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const levels = useMemo(() => computeLevels(exponent), [exponent]);
    const numLevels = levels.length;
    // Passos totals: descens (numLevels - 1) + cas base (1) + ascens (numLevels - 1) = 2 * numLevels - 1
    const totalSteps = 2 * numLevels - 1;

    // Multiplicacions totals
    const totalMults = useMemo(() => levels.reduce((sum, l) => sum + l.mults, 0), [levels]);
    const naiveMults = Math.max(0, exponent - 1);
    const savingPercent = naiveMults > 0 ? Math.round(((naiveMults - totalMults) / naiveMults) * 100) : 0;

    // Multiplicacions acumulades executades fins al pas actual
    const runningMults = useMemo(() => {
        if (stepIdx < numLevels) return 0;
        let mults = 0;
        for (let s = numLevels; s <= stepIdx; s++) {
            const retLevelIdx = (numLevels - 1) - (s - (numLevels - 1));
            if (retLevelIdx >= 0 && retLevelIdx < numLevels) {
                mults += levels[retLevelIdx].mults;
            }
        }
        return mults;
    }, [stepIdx, numLevels, levels]);

    // Timer de reproducció automàtica
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

    const selectPreset = (val: number) => {
        setIsPlaying(false);
        setExponent(val);
        setStepIdx(0);
    };

    // Estat de cada nivell
    const getLevelState = (lvlIdx: number) => {
        // Fase 1: Descens (passos 0 fins a numLevels - 2)
        if (stepIdx < numLevels - 1) {
            if (lvlIdx > stepIdx) return 'pending';
            if (lvlIdx === stepIdx) return 'descending';
            return 'waiting';
        }

        // Pas del cas base (pas = numLevels - 1)
        if (stepIdx === numLevels - 1) {
            if (lvlIdx === numLevels - 1) return 'base_active';
            return 'waiting';
        }

        // Fase 2: Ascens (passos numLevels fins a totalSteps - 1)
        const currentReturnLvl = (numLevels - 1) - (stepIdx - (numLevels - 1));
        if (lvlIdx === currentReturnLvl) return 'ascending';
        if (lvlIdx > currentReturnLvl) return 'resolved';
        return 'waiting';
    };

    // Missatge d'estat de fase
    const getPhaseMessage = () => {
        if (stepIdx < numLevels - 1) {
            const curLvl = levels[stepIdx];
            return (
                <span className="text-sky-300 font-medium">
                    Descens: volem calcular <InlineMath math={`x^{${curLvl.n}}`} /> dividint l&apos;exponent per 2
                </span>
            );
        }
        if (stepIdx === numLevels - 1) {
            return (
                <span className="text-amber-300 font-medium">
                    Cas base: <InlineMath math="x^0 = 1" /> es resol immediatament en <InlineMath math="\Theta(1)" />
                </span>
            );
        }
        if (stepIdx === totalSteps - 1) {
            return (
                <span className="text-emerald-300 font-medium">
                    Completat: <InlineMath math={`x^{${exponent}}`} /> calculat en només {totalMults} multiplicacions
                </span>
            );
        }
        const currentReturnLvl = (numLevels - 1) - (stepIdx - (numLevels - 1));
        const curLvl = levels[currentReturnLvl];
        return (
            <span className="text-emerald-300 font-medium">
                Ascens: substituïm <InlineMath math={`x^{${curLvl.half}}`} /> per obtenir <InlineMath math={`x^{${curLvl.n}}`} />
            </span>
        );
    };

    return (
        <div className="w-full flex flex-col items-center gap-3 my-6 font-mono select-none not-prose px-2 bg-transparent">

            {/* 1. BARRA SUPERIOR COMPACTA: PRESETS + CONTROLS A LA MATEIXA LÍNIA */}
            <div className="w-full max-w-xl flex items-center justify-between gap-2">
                {/* Selectors d'exponent compactes */}
                <div className="flex bg-slate-900/60 p-0.5 rounded-lg border border-white/5 gap-1 text-xs">
                    {PRESETS.map((p) => {
                        const isSelected = exponent === p.val;
                        return (
                            <button
                                key={`preset-${p.val}`}
                                type="button"
                                onClick={() => selectPreset(p.val)}
                                className={`px-2.5 py-1 rounded-md font-bold transition-all duration-150 ${
                                    isSelected
                                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                        : 'text-slate-400 hover:text-slate-200 border border-transparent'
                                }`}
                            >
                                <span>{p.label}</span>
                                <span className="hidden sm:inline text-[10px] text-slate-500 ml-1 font-normal">({p.desc})</span>
                            </button>
                        );
                    })}
                </div>

                {/* Controls de reproducció minimalistes */}
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

            {/* 2. MISSATGE D'ESTAT FIX I COMPACTE */}
            <div className="h-5 flex items-center justify-center text-center text-[11px] px-2">
                {getPhaseMessage()}
            </div>

            {/* 3. QUADRE COMPACTE D'EQUACIONS (ALTURA REDUÏDA) */}
            <div className="w-full max-w-xl rounded-xl border border-white/10 bg-slate-900/40 overflow-hidden divide-y divide-white/5">
                {levels.map((lvl, idx) => {
                    const state = getLevelState(idx);
                    const isBase = lvl.isBase;
                    const nextLvl = levels[idx + 1];

                    let rowBg = "bg-transparent";
                    let borderAccent = "border-l-2 border-l-transparent";

                    if (state === 'descending') {
                        rowBg = "bg-sky-500/15";
                        borderAccent = "border-l-2 border-l-sky-400";
                    } else if (state === 'base_active') {
                        rowBg = "bg-amber-500/15";
                        borderAccent = "border-l-2 border-l-amber-400";
                    } else if (state === 'ascending') {
                        rowBg = "bg-emerald-500/15";
                        borderAccent = "border-l-2 border-l-emerald-400";
                    } else if (state === 'resolved') {
                        rowBg = "bg-emerald-500/5";
                        borderAccent = "border-l-2 border-l-emerald-500/30";
                    }

                    return (
                        <div
                            key={`row-${lvl.n}`}
                            className={`w-full flex items-center justify-between px-3 sm:px-4 py-2 transition-all duration-200 ${rowBg} ${borderAccent}`}
                        >
                            {/* ESQUERRA: Paritat i Equació Matemàtica Directa */}
                            <div className="flex items-center gap-2 sm:gap-2.5">
                                <span
                                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded border tracking-wider uppercase ${
                                        isBase
                                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                                            : lvl.isEven
                                            ? 'bg-sky-500/20 border-sky-500/40 text-sky-300'
                                            : 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                                    }`}
                                >
                                    {isBase ? 'base' : lvl.isEven ? 'parell' : 'senar'}
                                </span>

                                <span className="font-mono font-bold text-xs sm:text-sm text-slate-100">
                                    <InlineMath math={lvl.equationLatex} />
                                </span>
                            </div>

                            {/* DRETA: Estat del càlcul, transició o cost */}
                            <div className="flex items-center gap-2 text-xs">
                                {state === 'descending' && nextLvl && (
                                    <span className="text-sky-300 font-semibold text-[11px] flex items-center gap-1 animate-pulse">
                                        <span>↓</span>
                                        <span>però quant val <InlineMath math={`x^{${nextLvl.n}}`} />?</span>
                                    </span>
                                )}

                                {state === 'base_active' && (
                                    <span className="text-amber-300 font-bold text-[11px] flex items-center gap-1">
                                        <span>retorna 1</span>
                                        <span className="text-[10px] text-amber-400/80 font-mono">(0 mults)</span>
                                    </span>
                                )}

                                {state === 'ascending' && (
                                    <span className="text-emerald-300 font-bold text-[11px] flex items-center gap-1 animate-pulse">
                                        <span>↑ <InlineMath math={lvl.resolvedLatex} /></span>
                                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                                            +{lvl.mults}
                                        </span>
                                    </span>
                                )}

                                {state === 'resolved' && (
                                    <span className="text-emerald-400 text-[10px] flex items-center gap-1 font-mono">
                                        <Check size={11} className="text-emerald-400" />
                                        <span>resolt (+{lvl.mults})</span>
                                    </span>
                                )}

                                {(state === 'waiting' || state === 'pending') && (
                                    <span className="text-slate-500 text-[10px] font-mono">
                                        {isBase ? '0 mults' : lvl.mults === 1 ? '1 mult (y · y)' : '2 mults (y · y · x)'}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 4. RESUM COMPARATIU DE COMPLEXITAT COMPACTE */}
            <div className="w-full max-w-xl flex flex-wrap items-center justify-between gap-2 text-[11px] pt-1 text-slate-400 border-t border-white/5">
                <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">Mults D&C:</span>
                    <strong className="text-emerald-400 font-mono">
                        {runningMults} / {totalMults}
                    </strong>
                    <span className="text-slate-600">|</span>
                    <span className="text-slate-500">Alçada:</span>
                    <span className="text-slate-300">{numLevels} crides (<InlineMath math="\approx \log_2 n" />)</span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-slate-500">Ingenu (for):</span>
                    <span className="font-mono text-rose-400/80">{naiveMults} mults</span>
                    <span className="font-mono font-bold text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 text-[10px]">
                        -{savingPercent}%
                    </span>
                    <span className="font-mono text-sky-400 font-bold text-[10px]">
                        <InlineMath math="\Theta(\log n)" />
                    </span>
                </div>
            </div>

        </div>
    );
}
