"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Play, Pause } from 'lucide-react';
import { InlineMath } from 'react-katex';

interface LevelData {
    n: number;
    isBase: boolean;
    isEven: boolean;
    half: number;
    mults: number;
    returnFormula: string;
}

function fmtPower(p: number): string {
    if (p === 0) return '1';
    if (p === 1) return 'x';
    return `x^{${p}}`;
}

function getReturnFormula(n: number, half: number, isEven: boolean): string {
    if (n === 0) return 'x^0 = 1';
    const yStr = fmtPower(half);
    const resultStr = fmtPower(n);
    if (isEven) {
        if (half === 1) return `y^2 = (${yStr})^2 = ${resultStr}`;
        return `(${yStr})^2 = ${resultStr}`;
    } else {
        if (half === 0) return `1^2 \\cdot x = ${resultStr}`;
        return `(${yStr})^2 \\cdot x = ${resultStr}`;
    }
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
                returnFormula: getReturnFormula(cur, half, true),
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
                returnFormula: getReturnFormula(cur, half, false),
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
        returnFormula: 'x^0 = 1',
    });

    return levels;
}

const PRESETS = [
    { label: "x^24 (Mixt)", val: 24 },
    { label: "x^16 (Potència 2)", val: 16 },
    { label: "x^13 (Senar)", val: 13 },
];

export default function FastPowerVisualizer() {
    const [exponent, setExponent] = useState<number>(24);
    const [stepIdx, setStepIdx] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const levels = useMemo(() => computeLevels(exponent), [exponent]);
    const numLevels = levels.length;
    // Total steps = descent (numLevels - 1 steps) + base case (1 step) + ascent (numLevels - 1 steps) = 2 * numLevels - 1
    const totalSteps = 2 * numLevels - 1;

    // Multiplicacions acumulades
    const totalMults = useMemo(() => levels.reduce((sum, l) => sum + l.mults, 0), [levels]);
    const naiveMults = Math.max(0, exponent - 1);
    const savingPercent = naiveMults > 0 ? Math.round(((naiveMults - totalMults) / naiveMults) * 100) : 0;

    // Càlcul de multiplicacions executades fins al pas actual
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

    // Indicador descriptiu de la fase actual
    const getPhaseMessage = () => {
        if (stepIdx < numLevels - 1) {
            const curLvl = levels[stepIdx];
            return (
                <span className="text-sky-300 font-medium">
                    Fase 1: Divisió recursiva ({curLvl.isEven ? `n = ${curLvl.n} és parell → crida amb n/2 = ${curLvl.half}` : `n = ${curLvl.n} és senar → crida amb (n-1)/2 = ${curLvl.half}`})
                </span>
            );
        }
        if (stepIdx === numLevels - 1) {
            return (
                <span className="text-amber-300 font-medium">
                    Cas base assolit: n = 0 → retorna 1 immediatament en <InlineMath math="\Theta(1)" />
                </span>
            );
        }
        if (stepIdx === totalSteps - 1) {
            return (
                <span className="text-emerald-300 font-medium">
                    Càlcul finalitzat: <InlineMath math={`x^{${exponent}}`} /> obtingut en {totalMults} multiplicacions
                </span>
            );
        }
        const currentReturnLvl = (numLevels - 1) - (stepIdx - (numLevels - 1));
        const curLvl = levels[currentReturnLvl];
        return (
            <span className="text-emerald-300 font-medium">
                Fase 2: Conquesta i retorn (n = {curLvl.n}: eleva al quadrat {curLvl.isEven ? 'y · y' : 'y · y · x'})
            </span>
        );
    };

    return (
        <div className="w-full flex flex-col items-center gap-5 my-8 font-mono select-none not-prose px-2 bg-transparent">

            {/* SELECTOR DE PRESETS */}
            <div className="flex bg-slate-900/60 p-1 rounded-xl border border-white/5 gap-1 text-xs">
                {PRESETS.map((p) => {
                    const isSelected = exponent === p.val;
                    return (
                        <button
                            key={`preset-${p.val}`}
                            type="button"
                            onClick={() => selectPreset(p.val)}
                            className={`px-3 py-1 rounded-lg font-bold transition-all duration-150 ${
                                isSelected
                                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                            }`}
                        >
                            {p.label}
                        </button>
                    );
                })}
            </div>

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
                    className="p-1.5 rounded-lg bg-slate-900/40 hover:bg-slate-800 border border-white/5 text-slate-400 hover:text-slate-200 transition ml-1"
                >
                    <RotateCcw size={14} />
                </button>
            </div>

            {/* MISSATGE DE FASE FIX (Sense moure els botons) */}
            <div className="h-6 flex items-center justify-center text-center text-xs px-2">
                {getPhaseMessage()}
            </div>

            {/* ESCALA RECURSIVA DE POTÈNCIA (PIPELINE DIVISIÓ I CONQUESTA) */}
            <div className="w-full max-w-xl flex flex-col items-center">
                {levels.map((lvl, idx) => {
                    const state = getLevelState(idx);
                    const isBase = lvl.isBase;

                    // Estils de la targeta segons l'estat
                    let cardStyle = "bg-slate-900/20 border-white/5 text-slate-500";
                    if (state === 'descending') {
                        cardStyle = "bg-sky-950/40 border-sky-400 shadow-[0_0_16px_rgba(56,189,248,0.25)] text-sky-200 scale-[1.02]";
                    } else if (state === 'base_active') {
                        cardStyle = "bg-amber-950/40 border-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.25)] text-amber-200 scale-[1.02]";
                    } else if (state === 'ascending') {
                        cardStyle = "bg-emerald-950/40 border-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.25)] text-emerald-200 scale-[1.02]";
                    } else if (state === 'resolved') {
                        cardStyle = "bg-slate-900/40 border-emerald-500/25 text-slate-300";
                    } else if (state === 'pending') {
                        cardStyle = "opacity-25 bg-slate-950/20 border-white/5 text-slate-600";
                    }

                    // Connectors entre aquest nivell i el següent
                    const nextLvl = levels[idx + 1];
                    const isCallActive = stepIdx === idx + 1 && stepIdx < numLevels;
                    const isCallDone = stepIdx > idx;

                    const returnStepForIdx = (numLevels - 1) + ((numLevels - 1) - idx);
                    const isReturnActive = stepIdx === returnStepForIdx;
                    const isReturnDone = stepIdx > returnStepForIdx;

                    return (
                        <React.Fragment key={`level-${lvl.n}`}>
                            {/* TARGETA DEL NIVELL */}
                            <div className={`w-full flex items-center justify-between px-3.5 sm:px-4 py-2.5 rounded-xl border transition-all duration-300 ${cardStyle}`}>
                                
                                {/* ESQUERRA: Crida recursiva i paritat de n */}
                                <div className="flex items-center gap-2 sm:gap-2.5">
                                    {/* Badge de paritat */}
                                    <span
                                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded border transition-colors ${
                                            isBase
                                                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                                                : lvl.isEven
                                                ? 'bg-sky-500/20 border-sky-500/40 text-sky-300'
                                                : 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                                        }`}
                                    >
                                        {isBase ? 'cas base' : lvl.isEven ? 'parell' : 'senar'}
                                    </span>

                                    {/* Expressió de la crida */}
                                    <span className="font-mono font-bold text-xs sm:text-sm">
                                        <InlineMath math={`\\text{potència}(x, ${lvl.n})`} />
                                    </span>
                                </div>

                                {/* DRETA: Càlcul i retorn del resultat */}
                                <div className="flex items-center gap-2 text-xs">
                                    {state === 'pending' && (
                                        <span className="text-slate-600 text-[11px]">pendent</span>
                                    )}

                                    {state === 'descending' && (
                                        <span className="text-sky-300 font-semibold text-[11px]">
                                            crida amb n/2 = {lvl.half}
                                        </span>
                                    )}

                                    {state === 'waiting' && (
                                        <span className="text-slate-500 text-[11px]">
                                            esperant y = <InlineMath math={fmtPower(lvl.half)} />
                                        </span>
                                    )}

                                    {state === 'base_active' && (
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-amber-300 font-bold text-xs">
                                                retorna 1
                                            </span>
                                            <span className="bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] px-1.5 py-0.5 rounded font-mono">
                                                0 mults
                                            </span>
                                        </div>
                                    )}

                                    {state === 'ascending' && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-emerald-300 font-bold text-xs">
                                                <InlineMath math={lvl.returnFormula} />
                                            </span>
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                                                lvl.mults === 1
                                                    ? 'bg-sky-500/20 border-sky-500/40 text-sky-300'
                                                    : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                                            }`}>
                                                +{lvl.mults} mult{lvl.mults > 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    )}

                                    {state === 'resolved' && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-200 font-bold text-xs">
                                                = <InlineMath math={fmtPower(lvl.n)} />
                                            </span>
                                            <span className="text-[10px] text-slate-500 font-mono">
                                                (+{lvl.mults} mult{lvl.mults === 1 ? '' : 's'})
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* FLETXES CONNECTORES ENTRE NIVELLS */}
                            {nextLvl && (
                                <div className="w-full flex items-center justify-between px-6 sm:px-10 py-1 text-[11px] font-mono select-none">
                                    {/* Esquerra: Crida descendent */}
                                    <div className={`flex items-center gap-1 transition-all duration-200 ${
                                        isCallActive ? 'text-sky-300 font-bold' : isCallDone ? 'text-slate-600' : 'text-slate-800'
                                    }`}>
                                        <span>↓</span>
                                        <span className="text-[10px]">
                                            {isCallActive ? `divisió: n/2 = ${nextLvl.n}` : 'crida'}
                                        </span>
                                    </div>

                                    {/* Dreta: Retorn ascendent */}
                                    <div className={`flex items-center gap-1 transition-all duration-200 ${
                                        isReturnActive ? 'text-emerald-300 font-bold' : isReturnDone ? 'text-emerald-500/40' : 'text-slate-800'
                                    }`}>
                                        <span className="text-[10px]">
                                            {isReturnActive ? `retorna y = ${fmtPower(nextLvl.n)}` : 'retorn'}
                                        </span>
                                        <span>↑</span>
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>

            {/* RESUM COMPARATIU DE COMPLEXITAT I OPERACIONS */}
            <div className="w-full max-w-xl flex flex-wrap items-center justify-between gap-3 text-xs pt-3 border-t border-white/5 text-slate-400">
                <div className="flex items-center gap-2">
                    <span className="text-slate-500">Mults D&C:</span>
                    <strong className="text-emerald-400 font-mono text-sm">
                        {runningMults} / {totalMults}
                    </strong>
                    <span className="text-slate-600">|</span>
                    <span className="text-slate-500">Alçada:</span>
                    <span className="text-slate-200">{numLevels} crides (<InlineMath math="\approx \log_2 n" />)</span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-slate-500">Ingenu (for):</span>
                    <span className="font-mono text-rose-400/80">{naiveMults} mults</span>
                    <span className="font-mono font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-[11px]">
                        -{savingPercent}% operacions
                    </span>
                    <span className="font-mono text-sky-400 font-bold text-[11px]">
                        <InlineMath math="\Theta(\log n)" />
                    </span>
                </div>
            </div>

        </div>
    );
}
