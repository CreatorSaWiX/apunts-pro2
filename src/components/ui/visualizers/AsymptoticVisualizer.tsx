"use client";

import React, { useState, useMemo } from 'react';
import { RotateCcw } from 'lucide-react';

type AsymptoticMode = 'O' | 'Omega' | 'Theta';
type FunctionPreset = 'quadratic' | 'linear';

interface PresetConfig {
    name: string;
    fFormula: string;
    f: (n: number) => number;
    g: (n: number) => number;
    defaultO: { c: number; n0: number };
    defaultOmega: { c: number; n0: number };
    defaultTheta: { c1: number; c2: number; n0: number };
    nMax: number;
    yMax: number;
}

const PRESETS: Record<FunctionPreset, PresetConfig> = {
    quadratic: {
        name: "Quadràtic",
        fFormula: "f(n) = 0.5n² - 1.5n + 7",
        f: (n: number) => 0.5 * n * n - 1.5 * n + 7,
        g: (n: number) => n * n,
        defaultO: { c: 0.9, n0: 3 },
        defaultOmega: { c: 0.25, n0: 2 },
        defaultTheta: { c1: 0.25, c2: 0.9, n0: 3 },
        nMax: 10,
        yMax: 55,
    },
    linear: {
        name: "Lineal",
        fFormula: "f(n) = 2.8n + 3.5 sin(1.2n) + 3",
        f: (n: number) => 2.8 * n + 3.5 * Math.sin(1.2 * n) + 3,
        g: (n: number) => n,
        defaultO: { c: 4.0, n0: 3 },
        defaultOmega: { c: 1.5, n0: 2 },
        defaultTheta: { c1: 1.5, c2: 4.0, n0: 3 },
        nMax: 10,
        yMax: 45,
    }
};

export default function AsymptoticVisualizer() {
    const [mode, setMode] = useState<AsymptoticMode>('O');
    const [presetKey, setPresetKey] = useState<FunctionPreset>('quadratic');

    const preset = PRESETS[presetKey];

    const [c, setC] = useState<number>(() => preset.defaultO.c);
    const [c1, setC1] = useState<number>(() => preset.defaultTheta.c1);
    const [c2, setC2] = useState<number>(() => preset.defaultTheta.c2);
    const [n0, setN0] = useState<number>(() => preset.defaultO.n0);

    const handleModeChange = (newMode: AsymptoticMode) => {
        setMode(newMode);
        if (newMode === 'O') {
            setC(preset.defaultO.c);
            setN0(preset.defaultO.n0);
        } else if (newMode === 'Omega') {
            setC(preset.defaultOmega.c);
            setN0(preset.defaultOmega.n0);
        } else {
            setC1(preset.defaultTheta.c1);
            setC2(preset.defaultTheta.c2);
            setN0(preset.defaultTheta.n0);
        }
    };

    const handlePresetChange = (newPreset: FunctionPreset) => {
        setPresetKey(newPreset);
        const p = PRESETS[newPreset];
        if (mode === 'O') {
            setC(p.defaultO.c);
            setN0(p.defaultO.n0);
        } else if (mode === 'Omega') {
            setC(p.defaultOmega.c);
            setN0(p.defaultOmega.n0);
        } else {
            setC1(p.defaultTheta.c1);
            setC2(p.defaultTheta.c2);
            setN0(p.defaultTheta.n0);
        }
    };

    const handleReset = () => {
        if (mode === 'O') {
            setC(preset.defaultO.c);
            setN0(preset.defaultO.n0);
        } else if (mode === 'Omega') {
            setC(preset.defaultOmega.c);
            setN0(preset.defaultOmega.n0);
        } else {
            setC1(preset.defaultTheta.c1);
            setC2(preset.defaultTheta.c2);
            setN0(preset.defaultTheta.n0);
        }
    };

    const validation = useMemo(() => {
        const samples = 100;
        const step = (preset.nMax - n0) / samples;
        let isValid = true;
        let violationN: number | null = null;

        for (let i = 0; i <= samples; i++) {
            const nVal = n0 + i * step;
            const fnVal = preset.f(nVal);
            const gnVal = preset.g(nVal);

            if (mode === 'O') {
                if (fnVal > c * gnVal + 0.001) {
                    isValid = false;
                    violationN = nVal;
                    break;
                }
            } else if (mode === 'Omega') {
                if (fnVal < c * gnVal - 0.001) {
                    isValid = false;
                    violationN = nVal;
                    break;
                }
            } else {
                if (fnVal < c1 * gnVal - 0.001 || fnVal > c2 * gnVal + 0.001) {
                    isValid = false;
                    violationN = nVal;
                    break;
                }
            }
        }

        return { isValid, violationN };
    }, [mode, preset, c, c1, c2, n0]);

    const svgWidth = 620;
    const svgHeight = 280;
    const padLeft = 45;
    const padRight = 30;
    const padTop = 20;
    const padBottom = 35;

    const plotWidth = svgWidth - padLeft - padRight;
    const plotHeight = svgHeight - padTop - padBottom;

    const toSvgX = (nVal: number) => padLeft + (nVal / preset.nMax) * plotWidth;
    const toSvgY = (yVal: number) => padTop + plotHeight - (Math.max(0, yVal) / preset.yMax) * plotHeight;

    const curvePoints = useMemo(() => {
        const steps = 80;
        const fPts: [number, number][] = [];
        const gPts: [number, number][] = [];
        const g1Pts: [number, number][] = [];
        const g2Pts: [number, number][] = [];

        for (let i = 0; i <= steps; i++) {
            const nVal = (i / steps) * preset.nMax;
            const fVal = preset.f(nVal);
            const gVal = preset.g(nVal);

            fPts.push([toSvgX(nVal), toSvgY(fVal)]);

            if (mode === 'O' || mode === 'Omega') {
                gPts.push([toSvgX(nVal), toSvgY(c * gVal)]);
            } else {
                g1Pts.push([toSvgX(nVal), toSvgY(c1 * gVal)]);
                g2Pts.push([toSvgX(nVal), toSvgY(c2 * gVal)]);
            }
        }

        const toPathD = (pts: [number, number][]) =>
            pts.reduce((acc, [x, y], idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`, '');

        return {
            fPath: toPathD(fPts),
            gPath: toPathD(gPts),
            g1Path: toPathD(g1Pts),
            g2Path: toPathD(g2Pts),
        };
    }, [preset, mode, c, c1, c2, plotWidth, plotHeight, padLeft, padTop]);

    // Sandvitx Theta: estrictament calculat i fitat per a n >= n0
    const thetaShadePath = useMemo(() => {
        if (mode !== 'Theta') return '';
        const steps = 40;
        const upperPts: [number, number][] = [];
        const lowerPts: [number, number][] = [];

        for (let i = 0; i <= steps; i++) {
            const nVal = n0 + (i / steps) * (preset.nMax - n0);
            const gVal = preset.g(nVal);
            upperPts.push([toSvgX(nVal), toSvgY(c2 * gVal)]);
            lowerPts.push([toSvgX(nVal), toSvgY(c1 * gVal)]);
        }

        let d = `M ${upperPts[0][0].toFixed(1)} ${upperPts[0][1].toFixed(1)}`;
        upperPts.forEach(([x, y]) => { d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`; });
        for (let i = lowerPts.length - 1; i >= 0; i--) {
            d += ` L ${lowerPts[i][0].toFixed(1)} ${lowerPts[i][1].toFixed(1)}`;
        }
        d += ' Z';
        return d;
    }, [mode, n0, preset, c1, c2, plotWidth, plotHeight, padLeft, padTop]);

    const xN0 = toSvgX(n0);

    return (
        <div className="w-full flex flex-col items-center gap-4 my-8 font-mono select-none not-prose">
            
            {/* 1. SELECTORS MINIMALISTES (Sense layoutId per evitar salts) */}
            <div className="w-full max-w-2xl flex flex-wrap items-center justify-between gap-3 px-1">
                {/* Selector de mode amb transició CSS sòlida */}
                <div className="flex bg-slate-900/60 p-1 rounded-xl border border-white/5 gap-1">
                    {(['O', 'Omega', 'Theta'] as AsymptoticMode[]).map((mKey) => {
                        const isSelected = mode === mKey;
                        const label = mKey === 'O' ? 'O(g)' : mKey === 'Omega' ? 'Ω(g)' : 'Θ(g)';
                        return (
                            <button
                                key={mKey}
                                type="button"
                                onClick={() => handleModeChange(mKey)}
                                className={`px-3.5 py-1 rounded-lg text-xs font-bold transition-all duration-150 ${
                                    isSelected
                                        ? mKey === 'O'
                                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                            : mKey === 'Omega'
                                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                            : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                        : 'text-slate-400 hover:text-slate-200 border border-transparent'
                                }`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>

                {/* Selector de funció (Quadràtic vs Lineal) + Reset */}
                <div className="flex items-center gap-1.5 bg-slate-900/40 p-1 rounded-xl border border-white/5">
                    {(['quadratic', 'linear'] as FunctionPreset[]).map((pKey) => {
                        const isSelected = presetKey === pKey;
                        const label = PRESETS[pKey].name;
                        return (
                            <button
                                key={pKey}
                                type="button"
                                onClick={() => handlePresetChange(pKey)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-150 ${
                                    isSelected
                                        ? 'bg-slate-800 text-sky-300 border border-sky-500/30'
                                        : 'text-slate-400 hover:text-slate-200 border border-transparent'
                                }`}
                            >
                                {label}
                            </button>
                        );
                    })}
                    <button
                        type="button"
                        onClick={handleReset}
                        title="Reiniciar valors"
                        className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition ml-0.5 active:scale-90"
                    >
                        <RotateCcw size={13} />
                    </button>
                </div>
            </div>

            {/* Indicador discret de la funció d'exemple activa */}
            <div className="w-full max-w-2xl flex items-center justify-end px-2 text-[11px] text-slate-400 h-4">
                <span className="inline-block w-2.5 h-0.5 bg-sky-400 mr-2 rounded" />
                <span className="font-mono text-sky-300/90">{preset.fFormula}</span>
            </div>

            {/* 2. SVG GRÀFIC TRANSPARENT (Amb clip-path per evitar desbordaments) */}
            <div className="w-full max-w-2xl relative">
                <svg
                    className="w-full h-auto select-none"
                    viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                >
                    <defs>
                        {/* Àrea de tall que assegura que cap corba surti del marc de coordenades */}
                        <clipPath id="asymp-plot-area">
                            <rect x={padLeft} y={padTop} width={plotWidth} height={plotHeight} />
                        </clipPath>

                        <linearGradient id="asymp-valid-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.10" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.01" />
                        </linearGradient>
                        <linearGradient id="asymp-invalid-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.12" />
                            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.01" />
                        </linearGradient>
                        <linearGradient id="theta-sandwich-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.18" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.08" />
                        </linearGradient>
                    </defs>

                    {/* Línies de coordenades subtils */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                        const y = padTop + ratio * plotHeight;
                        const x = padLeft + ratio * plotWidth;
                        const yVal = Math.round((1 - ratio) * preset.yMax);
                        const nVal = Math.round(ratio * preset.nMax);
                        return (
                            <g key={`grid-${i}`} opacity="0.2">
                                <line x1={padLeft} y1={y} x2={padLeft + plotWidth} y2={y} stroke="#64748b" strokeDasharray="3 3" />
                                <line x1={x} y1={padTop} x2={x} y2={padTop + plotHeight} stroke="#64748b" strokeDasharray="3 3" />
                                <text x={padLeft - 6} y={y + 3} textAnchor="end" fontSize="9" fill="#94a3b8">{yVal}</text>
                                <text x={x} y={padTop + plotHeight + 15} textAnchor="middle" fontSize="9" fill="#94a3b8">{nVal}</text>
                            </g>
                        );
                    })}

                    {/* ZONA ASIMPTÒTICA (n >= n0) */}
                    <rect
                        x={xN0}
                        y={padTop}
                        width={Math.max(0, padLeft + plotWidth - xN0)}
                        height={plotHeight}
                        fill={validation.isValid ? "url(#asymp-valid-grad)" : "url(#asymp-invalid-grad)"}
                        className="transition-all duration-150"
                    />

                    {/* ELEMENTS CLIPPATS DINS DE L'ÀREA DE COORDENADES */}
                    <g clipPath="url(#asymp-plot-area)">
                        {/* SANDVITX THETA */}
                        {mode === 'Theta' && thetaShadePath && (
                            <path
                                d={thetaShadePath}
                                fill="url(#theta-sandwich-grad)"
                                stroke="none"
                                className="transition-all duration-150"
                            />
                        )}

                        {/* CORBES DE COTA (O / Omega) */}
                        {(mode === 'O' || mode === 'Omega') && (
                            <path
                                d={curvePoints.gPath}
                                fill="none"
                                stroke={mode === 'O' ? '#f59e0b' : '#3b82f6'}
                                strokeWidth="2"
                                strokeDasharray={mode === 'O' ? 'none' : '5 4'}
                                className="transition-all duration-150"
                            />
                        )}

                        {/* CORBES DE COTA (Theta) */}
                        {mode === 'Theta' && (
                            <>
                                <path
                                    d={curvePoints.g1Path}
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth="1.8"
                                    strokeDasharray="5 3"
                                    className="transition-all duration-150"
                                />
                                <path
                                    d={curvePoints.g2Path}
                                    fill="none"
                                    stroke="#ec4899"
                                    strokeWidth="1.8"
                                    strokeDasharray="5 3"
                                    className="transition-all duration-150"
                                />
                            </>
                        )}

                        {/* CORBA f(n) */}
                        <path
                            d={curvePoints.fPath}
                            fill="none"
                            stroke="#38bdf8"
                            strokeWidth="2.5"
                            style={{ filter: "drop-shadow(0 0 5px rgba(56,189,248,0.35))" }}
                            className="transition-all duration-150"
                        />

                        {/* PUNT VIOLACIÓ AMB BATEC */}
                        {!validation.isValid && validation.violationN !== null && (
                            <g className="animate-pulse">
                                <circle
                                    cx={toSvgX(validation.violationN)}
                                    cy={toSvgY(preset.f(validation.violationN))}
                                    r="6"
                                    fill="#f43f5e"
                                    fillOpacity="0.4"
                                />
                                <circle
                                    cx={toSvgX(validation.violationN)}
                                    cy={toSvgY(preset.f(validation.violationN))}
                                    r="3.5"
                                    fill="#f43f5e"
                                    stroke="#ffffff"
                                    strokeWidth="1.5"
                                />
                            </g>
                        )}
                    </g>

                    {/* LÍNIA n0 */}
                    <line
                        x1={xN0}
                        y1={padTop}
                        x2={xN0}
                        y2={padTop + plotHeight}
                        stroke={validation.isValid ? "#10b981" : "#f43f5e"}
                        strokeWidth="1.5"
                        strokeDasharray="4 3"
                        className="transition-all duration-100"
                    />
                    <text
                        x={xN0}
                        y={padTop + plotHeight + 15}
                        textAnchor="middle"
                        fontSize="9.5"
                        fontWeight="bold"
                        fill={validation.isValid ? "#34d399" : "#fb7185"}
                        className="transition-all duration-100"
                    >
                        n₀={n0}
                    </text>

                    {/* EIXOS X i Y */}
                    <line
                        x1={padLeft}
                        y1={padTop + plotHeight}
                        x2={padLeft + plotWidth + 8}
                        y2={padTop + plotHeight}
                        stroke="#475569"
                        strokeWidth="1"
                    />
                    <line
                        x1={padLeft}
                        y1={padTop - 6}
                        x2={padLeft}
                        y2={padTop + plotHeight}
                        stroke="#475569"
                        strokeWidth="1"
                    />
                    <text x={padLeft + plotWidth + 12} y={padTop + plotHeight + 3} fontSize="10" fill="#94a3b8" fontWeight="bold">n</text>
                    <text x={padLeft - 6} y={padTop - 10} fontSize="9" fill="#94a3b8">T(n)</text>

                    {/* ETIQUETES DE CORBES A LA DRETA */}
                    {mode === 'O' && (
                        <text
                            x={padLeft + plotWidth - 6}
                            y={Math.max(padTop + 12, toSvgY(c * preset.g(preset.nMax)) - 6)}
                            fill="#fbbf24"
                            fontSize="10"
                            fontWeight="bold"
                            textAnchor="end"
                        >
                            {c}·g(n)
                        </text>
                    )}
                    {mode === 'Omega' && (
                        <text
                            x={padLeft + plotWidth - 6}
                            y={Math.max(padTop + 12, toSvgY(c * preset.g(preset.nMax)) + 12)}
                            fill="#60a5fa"
                            fontSize="10"
                            fontWeight="bold"
                            textAnchor="end"
                        >
                            {c}·g(n)
                        </text>
                    )}
                    {mode === 'Theta' && (
                        <>
                            <text
                                x={padLeft + plotWidth - 6}
                                y={Math.max(padTop + 10, toSvgY(c2 * preset.g(preset.nMax)) - 6)}
                                fill="#f472b6"
                                fontSize="9.5"
                                fontWeight="bold"
                                textAnchor="end"
                            >
                                c₂={c2}
                            </text>
                            <text
                                x={padLeft + plotWidth - 6}
                                y={Math.min(padTop + plotHeight - 8, toSvgY(c1 * preset.g(preset.nMax)) + 12)}
                                fill="#60a5fa"
                                fontSize="9.5"
                                fontWeight="bold"
                                textAnchor="end"
                            >
                                c₁={c1}
                            </text>
                        </>
                    )}
                    <text
                        x={padLeft + plotWidth - 6}
                        y={toSvgY(preset.f(preset.nMax)) - 6}
                        fill="#38bdf8"
                        fontSize="10"
                        fontWeight="bold"
                        textAnchor="end"
                    >
                        f(n)
                    </text>
                </svg>
            </div>

            {/* 3. SLIDERS MINIMALISTES */}
            <div className="w-full max-w-2xl flex flex-wrap items-center justify-between gap-4 px-2 text-xs">
                {/* Llindar n0 */}
                <div className="flex items-center gap-2.5">
                    <span className="text-slate-400 font-bold">n₀</span>
                    <input
                        type="range"
                        min="0.5"
                        max="8"
                        step="0.5"
                        value={n0}
                        onChange={(e) => setN0(parseFloat(e.target.value))}
                        className="accent-emerald-400 cursor-pointer h-1.5 w-24 sm:w-32 bg-slate-800 rounded-lg"
                    />
                    <span className="font-bold text-emerald-400 w-7 text-right">{n0}</span>
                </div>

                {/* Constant c (O / Omega) */}
                {(mode === 'O' || mode === 'Omega') && (
                    <div className="flex items-center gap-2.5">
                        <span className="text-slate-400 font-bold">c</span>
                        <input
                            type="range"
                            min="0.1"
                            max={presetKey === 'quadratic' ? '1.8' : '6.0'}
                            step="0.05"
                            value={c}
                            onChange={(e) => setC(parseFloat(e.target.value))}
                            className={`cursor-pointer h-1.5 w-28 sm:w-40 bg-slate-800 rounded-lg ${
                                mode === 'O' ? 'accent-amber-400' : 'accent-blue-400'
                            }`}
                        />
                        <span className={`font-bold w-10 text-right ${mode === 'O' ? 'text-amber-400' : 'text-blue-400'}`}>
                            {c.toFixed(2)}
                        </span>
                    </div>
                )}

                {/* Constants c1 i c2 (Theta) */}
                {mode === 'Theta' && (
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-slate-400 font-bold">c₁</span>
                            <input
                                type="range"
                                min="0.05"
                                max="1.2"
                                step="0.05"
                                value={c1}
                                onChange={(e) => setC1(parseFloat(e.target.value))}
                                className="accent-blue-400 cursor-pointer h-1.5 w-20 sm:w-28 bg-slate-800 rounded-lg"
                            />
                            <span className="font-bold text-blue-400 w-9 text-right">{c1.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-400 font-bold">c₂</span>
                            <input
                                type="range"
                                min="0.3"
                                max={presetKey === 'quadratic' ? '2.0' : '6.5'}
                                step="0.05"
                                value={c2}
                                onChange={(e) => setC2(parseFloat(e.target.value))}
                                className="accent-pink-400 cursor-pointer h-1.5 w-20 sm:w-28 bg-slate-800 rounded-lg"
                            />
                            <span className="font-bold text-pink-400 w-9 text-right">{c2.toFixed(2)}</span>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}
