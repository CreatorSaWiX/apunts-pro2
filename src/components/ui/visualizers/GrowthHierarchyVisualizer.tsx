"use client";

import React, { useState, useMemo } from 'react';
import { InlineMath } from 'react-katex';
import { RotateCcw } from 'lucide-react';

type RegimeMode = 'sublinear' | 'poly' | 'expo' | 'all';

interface ClassDef {
    id: string;
    latex: string;
    label: string;
    color: string;
    category: 'sublinear' | 'linear' | 'poly' | 'expo';
    fn: (n: number) => number;
}

function factorial(num: number): number {
    let r = 1;
    const n = Math.max(1, Math.min(10, Math.round(num)));
    for (let i = 2; i <= n; i++) r *= i;
    return r;
}

const HIERARCHY: ClassDef[] = [
    { id: 'c', latex: '\\Theta(1)', label: '1', color: '#10b981', category: 'sublinear', fn: () => 1 },
    { id: 'llog', latex: '\\Theta(\\log \\log n)', label: 'log log n', color: '#34d399', category: 'sublinear', fn: (n) => n > 2 ? Math.max(0, Math.log2(Math.log2(n))) : (n > 1 ? (n - 1) * 0.1 : 0) },
    { id: 'log', latex: '\\Theta(\\log n)', label: 'log n', color: '#06b6d4', category: 'sublinear', fn: (n) => Math.log2(Math.max(1, n)) },
    { id: 'sqrt', latex: '\\Theta(\\sqrt{n})', label: '√n', color: '#38bdf8', category: 'sublinear', fn: (n) => Math.sqrt(n) },
    { id: 'lin', latex: '\\Theta(n)', label: 'n', color: '#60a5fa', category: 'linear', fn: (n) => n },
    { id: 'nlogn', latex: '\\Theta(n \\log n)', label: 'n log n', color: '#818cf8', category: 'linear', fn: (n) => n * Math.log2(Math.max(1, n)) },
    { id: 'quad', latex: '\\Theta(n^2)', label: 'n²', color: '#f59e0b', category: 'poly', fn: (n) => n * n },
    { id: 'cube', latex: '\\Theta(n^k)', label: 'n³', color: '#fb923c', category: 'poly', fn: (n) => n * n * n },
    { id: 'exp', latex: '\\Theta(2^n)', label: '2ⁿ', color: '#f43f5e', category: 'expo', fn: (n) => Math.pow(2, n) },
    { id: 'fact', latex: '\\Theta(n!)', label: 'n!', color: '#e11d48', category: 'expo', fn: (n) => factorial(n) },
    { id: 'nn', latex: '\\Theta(n^n)', label: 'nⁿ', color: '#be123c', category: 'expo', fn: (n) => Math.pow(n, n) },
];

const REGIME_CONFIG: Record<RegimeMode, { name: string; activeIds: string[]; nMax: number; yMax: number; defaultN: number }> = {
    sublinear: {
        name: "Sublineal vs Lineal",
        activeIds: ['c', 'llog', 'log', 'sqrt', 'lin', 'nlogn'],
        nMax: 30,
        yMax: 35,
        defaultN: 16,
    },
    poly: {
        name: "Polinomi",
        activeIds: ['lin', 'nlogn', 'quad', 'cube'],
        nMax: 10,
        yMax: 100,
        defaultN: 5,
    },
    expo: {
        name: "Intractable",
        activeIds: ['quad', 'exp', 'fact', 'nn'],
        nMax: 6,
        yMax: 150,
        defaultN: 4,
    },
    all: {
        name: "Panoràmica",
        activeIds: ['log', 'sqrt', 'lin', 'nlogn', 'quad', 'exp'],
        nMax: 8,
        yMax: 70,
        defaultN: 4,
    }
};

export default function GrowthHierarchyVisualizer() {
    const [regime, setRegime] = useState<RegimeMode>('sublinear');
    const [activeIds, setActiveIds] = useState<Set<string>>(() => new Set(REGIME_CONFIG.sublinear.activeIds));
    const [nVal, setNVal] = useState<number>(REGIME_CONFIG.sublinear.defaultN);

    const config = REGIME_CONFIG[regime];
    const nMin = 1;
    const nMax = config.nMax;

    const handleRegimeChange = (newRegime: RegimeMode) => {
        setRegime(newRegime);
        const cfg = REGIME_CONFIG[newRegime];
        setActiveIds(new Set(cfg.activeIds));
        setNVal(cfg.defaultN);
    };

    const toggleClass = (id: string) => {
        setActiveIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                if (next.size > 1) next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const handleReset = () => {
        const cfg = REGIME_CONFIG[regime];
        setActiveIds(new Set(cfg.activeIds));
        setNVal(cfg.defaultN);
    };

    // Coordenades SVG
    const svgWidth = 620;
    const svgHeight = 280;
    const padLeft = 45;
    const padRight = 40;
    const padTop = 20;
    const padBottom = 35;

    const plotWidth = svgWidth - padLeft - padRight;
    const plotHeight = svgHeight - padTop - padBottom;

    // Mapeig correcte: nMin (1) comença exactament a padLeft (l'eix Y)
    const toSvgX = (n: number) => padLeft + ((n - nMin) / (nMax - nMin)) * plotWidth;
    const toSvgY = (y: number) => padTop + plotHeight - (Math.max(0, y) / config.yMax) * plotHeight;

    const steps = 80;

    // Càlcul de camins que comencen exactament a nMin = 1
    const paths = useMemo(() => {
        const map: Record<string, string> = {};

        HIERARCHY.forEach(item => {
            if (!activeIds.has(item.id)) return;
            const pts: [number, number][] = [];
            for (let i = 0; i <= steps; i++) {
                const n = nMin + (i / steps) * (nMax - nMin);
                const y = item.fn(n);
                pts.push([toSvgX(n), toSvgY(y)]);
            }
            map[item.id] = pts.reduce((acc, [x, y], idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`, '');
        });

        return map;
    }, [activeIds, config, nMin, nMax, plotWidth, plotHeight, padLeft, padTop]);

    const xN = toSvgX(nVal);

    return (
        <div className="w-full flex flex-col items-center gap-4 my-8 font-mono select-none not-prose">

            {/* 1. CADENA DE CREIXEMENT UNIVERSAL INCRUSTADA (Sense barra de scroll) */}
            <div className="w-full max-w-3xl flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 py-1 px-1">
                {HIERARCHY.map((item, index) => {
                    const isActive = activeIds.has(item.id);
                    return (
                        <React.Fragment key={item.id}>
                            <button
                                type="button"
                                onClick={() => toggleClass(item.id)}
                                title={`Commuta ${item.label}`}
                                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg transition-all duration-150 flex items-center gap-1 cursor-pointer border text-[11px] sm:text-xs ${
                                    isActive
                                        ? 'bg-slate-800 text-white shadow-sm'
                                        : 'bg-transparent text-slate-500 hover:text-slate-300 border-transparent opacity-50'
                                }`}
                                style={{
                                    borderColor: isActive ? `${item.color}60` : 'transparent',
                                }}
                            >
                                <span
                                    className="w-1.5 h-1.5 rounded-full shrink-0"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span style={{ color: isActive ? item.color : undefined }}>
                                    <InlineMath math={item.latex} />
                                </span>
                            </button>
                            {index < HIERARCHY.length - 1 && (
                                <span className="text-slate-600 font-bold px-0.5 select-none text-[10px] sm:text-[11px]">
                                    ≺
                                </span>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>

            {/* 2. REGIMS DE COMPARACIÓ MINIMALISTES */}
            <div className="w-full max-w-2xl flex flex-wrap items-center justify-between gap-3 px-1">
                <div className="flex bg-slate-900/60 p-1 rounded-xl border border-white/5 gap-1">
                    {(['sublinear', 'poly', 'expo', 'all'] as RegimeMode[]).map((rKey) => {
                        const isSelected = regime === rKey;
                        const label = REGIME_CONFIG[rKey].name;
                        return (
                            <button
                                key={rKey}
                                type="button"
                                onClick={() => handleRegimeChange(rKey)}
                                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all duration-150 ${
                                    isSelected
                                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                        : 'text-slate-400 hover:text-slate-200 border border-transparent'
                                }`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>

                <button
                    type="button"
                    onClick={handleReset}
                    title="Reiniciar selecció"
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition active:scale-90"
                >
                    <RotateCcw size={13} />
                </button>
            </div>

            {/* 3. SVG GRÀFIC TRANSPARENT (Inici exacte a n=1 enganxat a l'eix Y) */}
            <div className="w-full max-w-2xl relative">
                <svg
                    className="w-full h-auto select-none"
                    viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                >
                    <defs>
                        <clipPath id="growth-plot-area">
                            <rect x={padLeft} y={padTop} width={plotWidth} height={plotHeight} />
                        </clipPath>
                    </defs>

                    {/* Línies de coordenades subtils */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                        const y = padTop + ratio * plotHeight;
                        const x = padLeft + ratio * plotWidth;
                        const yVal = Math.round((1 - ratio) * config.yMax);
                        const n = Math.round(nMin + ratio * (nMax - nMin));
                        return (
                            <g key={`grid-${i}`} opacity="0.2">
                                <line x1={padLeft} y1={y} x2={padLeft + plotWidth} y2={y} stroke="#64748b" strokeDasharray="3 3" />
                                <line x1={x} y1={padTop} x2={x} y2={padTop + plotHeight} stroke="#64748b" strokeDasharray="3 3" />
                                <text x={padLeft - 6} y={y + 3} textAnchor="end" fontSize="9" fill="#94a3b8">{yVal}</text>
                                <text x={x} y={padTop + plotHeight + 15} textAnchor="middle" fontSize="9" fill="#94a3b8">{n}</text>
                            </g>
                        );
                    })}

                    {/* CORBES CLIPPADES */}
                    <g clipPath="url(#growth-plot-area)">
                        {HIERARCHY.map((item) => {
                            if (!activeIds.has(item.id) || !paths[item.id]) return null;
                            const currentVal = item.fn(nVal);
                            const ptY = toSvgY(currentVal);

                            return (
                                <g key={item.id}>
                                    <path
                                        d={paths[item.id]}
                                        fill="none"
                                        stroke={item.color}
                                        strokeWidth="2.2"
                                        className="transition-all duration-150"
                                    />
                                    {/* Punt a la posició n de l'slider */}
                                    {ptY >= padTop && ptY <= padTop + plotHeight && (
                                        <g>
                                            <circle
                                                cx={xN}
                                                cy={ptY}
                                                r="3.5"
                                                fill={item.color}
                                                stroke="#ffffff"
                                                strokeWidth="1.2"
                                            />
                                        </g>
                                    )}
                                </g>
                            );
                        })}
                    </g>

                    {/* LÍNIA VERTICAL DE n */}
                    <line
                        x1={xN}
                        y1={padTop}
                        x2={xN}
                        y2={padTop + plotHeight}
                        stroke="#94a3b8"
                        strokeWidth="1.5"
                        strokeDasharray="4 3"
                        className="transition-all duration-75"
                    />
                    <text
                        x={xN}
                        y={padTop + plotHeight + 15}
                        textAnchor="middle"
                        fontSize="9.5"
                        fontWeight="bold"
                        fill="#f8fafc"
                        className="transition-all duration-75"
                    >
                        n={nVal}
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

                    {/* ETIQUETES AL FINAL DE LES CORBES */}
                    {HIERARCHY.map((item) => {
                        if (!activeIds.has(item.id)) return null;
                        const endY = toSvgY(item.fn(nMax));
                        if (endY < padTop - 5 || endY > padTop + plotHeight + 10) return null;

                        return (
                            <text
                                key={`label-${item.id}`}
                                x={padLeft + plotWidth + 4}
                                y={endY + 3}
                                fill={item.color}
                                fontSize="9.5"
                                fontWeight="bold"
                                textAnchor="start"
                            >
                                {item.label}
                            </text>
                        );
                    })}
                </svg>
            </div>

            {/* 4. SLIDER MINIMALISTA DE n I VALORS EN DIRECTE */}
            <div className="w-full max-w-2xl flex flex-wrap items-center justify-between gap-4 px-2 text-xs">
                {/* Slider n */}
                <div className="flex items-center gap-2.5">
                    <span className="text-slate-400 font-bold">n</span>
                    <input
                        type="range"
                        min={nMin}
                        max={nMax}
                        step={regime === 'expo' ? 0.2 : 0.5}
                        value={nVal}
                        onChange={(e) => setNVal(parseFloat(e.target.value))}
                        className="accent-sky-400 cursor-pointer h-1.5 w-32 sm:w-44 bg-slate-800 rounded-lg"
                    />
                    <span className="font-bold text-sky-400 w-8 text-right">{nVal}</span>
                </div>

                {/* Valors calculats en temps real dels termes actius */}
                <div className="flex flex-wrap items-center gap-2">
                    {HIERARCHY.filter(item => activeIds.has(item.id)).map(item => {
                        const val = item.fn(nVal);
                        const displayVal = val >= 10000 ? val.toExponential(1) : (val >= 100 ? Math.round(val) : val.toFixed(1));
                        return (
                            <div
                                key={`val-${item.id}`}
                                className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-900/60 border border-white/5 text-[11px]"
                            >
                                <span className="font-bold" style={{ color: item.color }}>{item.label}:</span>
                                <span className="text-slate-200 font-mono">{displayVal}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
    );
}
