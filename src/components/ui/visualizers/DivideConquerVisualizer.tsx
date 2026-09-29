"use client";

import React, { useState } from 'react';
import { InlineMath } from 'react-katex';

type StageMode = 'all' | 'divide' | 'conquer' | 'combine';
type BranchCount = 1 | 2 | 3;

interface BranchPreset {
    id: BranchCount;
    label: string;
    subSizeText: string;
    recCostText: string;
}

const BRANCH_PRESETS: BranchPreset[] = [
    { id: 2, label: "a = 2 (Mergesort)", subSizeText: "n/2", recCostText: "2 · T(n/2)" },
    { id: 1, label: "a = 1 (Cerca binària)", subSizeText: "n/2", recCostText: "1 · T(n/2)" },
    { id: 3, label: "a = 3 (Karatsuba)", subSizeText: "n/2", recCostText: "3 · T(n/2)" },
];

export default function DivideConquerVisualizer() {
    const [stage, setStage] = useState<StageMode>('all');
    const [branchCount, setBranchCount] = useState<BranchCount>(2);

    const currentPreset = BRANCH_PRESETS.find(p => p.id === branchCount) || BRANCH_PRESETS[0];

    const getBranchX = (idx: number, count: number): number => {
        if (count === 1) return 310;
        if (count === 2) return idx === 0 ? 210 : 410;
        if (idx === 0) return 145;
        if (idx === 1) return 310;
        return 475;
    };

    const rootX = 310;
    const rootY = 32;
    const subproblemY = 110;
    const solutionY = 180;
    const combinedY = 258;

    const svgWidth = 620;
    const boxWidth = branchCount === 3 ? 120 : 136;
    const boxHeight = 36;

    const getFormulaMath = () => {
        const rec = currentPreset.recCostText;
        if (stage === 'divide') {
            return `T(n) = {\\color{#f59e0b}{T_{\\text{divisio}}(n)}} + ${rec} + T_{\\text{combinar}}(n)`;
        }
        if (stage === 'conquer') {
            return `T(n) = T_{\\text{divisio}}(n) + {\\color{#10b981}{${rec}}} + T_{\\text{combinar}}(n)`;
        }
        if (stage === 'combine') {
            return `T(n) = T_{\\text{divisio}}(n) + ${rec} + {\\color{#c084fc}{T_{\\text{combinar}}(n)}}`;
        }
        return `T(n) = T_{\\text{divisio}}(n) + ${rec} + T_{\\text{combinar}}(n)`;
    };

    return (
        <div className="w-full flex flex-col items-center gap-4 my-8 font-mono select-none not-prose">

            {/* 1. SELECTOR MINIMALISTA DE RAMIFICACIÓ (a = 1, 2, 3) */}
            <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/5 gap-1 text-xs">
                {BRANCH_PRESETS.map(p => (
                    <button
                        key={p.id}
                        type="button"
                        onClick={() => setBranchCount(p.id)}
                        className={`px-3 py-1 rounded-lg font-medium transition-all duration-150 ${
                            branchCount === p.id
                                ? 'bg-slate-800 text-sky-300 border border-sky-500/30 shadow-sm'
                                : 'text-slate-400 hover:text-slate-200 border border-transparent'
                        }`}
                    >
                        {p.label}
                    </button>
                ))}
            </div>

            {/* 2. DIAGRAMA SVG INTERACTIU */}
            <div className="w-full max-w-2xl relative">
                <svg
                    className="w-full h-auto select-none"
                    viewBox="0 0 620 300"
                    onClick={() => setStage('all')}
                >
                    <defs>
                        <style>
                            {`
                                @keyframes dcDashFlow {
                                    to {
                                        stroke-dashoffset: -20;
                                    }
                                }
                                .flow-active {
                                    stroke-dasharray: 6 4;
                                    animation: dcDashFlow 0.85s linear infinite;
                                }
                            `}
                        </style>

                        {/* Filtres de resplendor per a cada fase */}
                        <filter id="glow-amber" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#f59e0b" floodOpacity="0.45" />
                        </filter>
                        <filter id="glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#10b981" floodOpacity="0.45" />
                        </filter>
                        <filter id="glow-purple" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#c084fc" floodOpacity="0.45" />
                        </filter>

                        {/* Fletxes de direcció */}
                        <marker
                            id="arrow-amber"
                            viewBox="0 0 10 10"
                            refX="7"
                            refY="5"
                            markerWidth="6"
                            markerHeight="6"
                            orient="auto-start-reverse"
                        >
                            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f59e0b" />
                        </marker>
                        <marker
                            id="arrow-emerald"
                            viewBox="0 0 10 10"
                            refX="7"
                            refY="5"
                            markerWidth="6"
                            markerHeight="6"
                            orient="auto-start-reverse"
                        >
                            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#10b981" />
                        </marker>
                        <marker
                            id="arrow-purple"
                            viewBox="0 0 10 10"
                            refX="7"
                            refY="5"
                            markerWidth="6"
                            markerHeight="6"
                            orient="auto-start-reverse"
                        >
                            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#c084fc" />
                        </marker>
                        <marker
                            id="arrow-muted"
                            viewBox="0 0 10 10"
                            refX="7"
                            refY="5"
                            markerWidth="6"
                            markerHeight="6"
                            orient="auto-start-reverse"
                        >
                            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#475569" />
                        </marker>
                        <marker
                            id="arrow-dim"
                            viewBox="0 0 10 10"
                            refX="7"
                            refY="5"
                            markerWidth="6"
                            markerHeight="6"
                            orient="auto-start-reverse"
                        >
                            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#1e293b" />
                        </marker>
                    </defs>

                    {/* FLETXES: 1. DIVIDIR (Root -> Subproblemes) */}
                    {Array.from({ length: branchCount }).map((_, idx) => {
                        const targetX = getBranchX(idx, branchCount);
                        const isDivide = stage === 'divide';
                        const isAll = stage === 'all';
                        const startY = rootY + boxHeight / 2;
                        const endY = subproblemY - boxHeight / 2;
                        const midY = (startY + endY) / 2;

                        return (
                            <path
                                key={`div-edge-${idx}`}
                                d={`M ${rootX} ${startY} C ${rootX} ${midY}, ${targetX} ${midY}, ${targetX} ${endY}`}
                                fill="none"
                                stroke={isDivide ? '#f59e0b' : isAll ? '#475569' : '#1e293b'}
                                strokeWidth={isDivide ? 2.2 : 1.2}
                                strokeDasharray={isDivide ? undefined : '4 3'}
                                markerEnd={isDivide ? 'url(#arrow-amber)' : isAll ? 'url(#arrow-muted)' : 'url(#arrow-dim)'}
                                className={`transition-all duration-200 ${isDivide ? 'flow-active' : ''}`}
                            />
                        );
                    })}

                    {/* FLETXES: 2. VÈNCER (Subproblema -> Solució) */}
                    {Array.from({ length: branchCount }).map((_, idx) => {
                        const x = getBranchX(idx, branchCount);
                        const isConquer = stage === 'conquer';
                        const isAll = stage === 'all';
                        const startY = subproblemY + boxHeight / 2;
                        const endY = solutionY - boxHeight / 2;

                        return (
                            <g key={`conq-edge-${idx}`}>
                                <line
                                    x1={x}
                                    y1={startY}
                                    x2={x}
                                    y2={endY}
                                    stroke={isConquer ? '#10b981' : isAll ? '#475569' : '#1e293b'}
                                    strokeWidth={isConquer ? 2.2 : 1.2}
                                    markerEnd={isConquer ? 'url(#arrow-emerald)' : isAll ? 'url(#arrow-muted)' : 'url(#arrow-dim)'}
                                    className={`transition-all duration-200 ${isConquer ? 'flow-active' : ''}`}
                                />
                                {idx === 0 && (
                                    <text
                                        x={branchCount === 1 ? x + 24 : x - 18}
                                        y={(startY + endY) / 2 + 3}
                                        fontSize="9.5"
                                        fill={isConquer ? '#34d399' : isAll ? '#64748b' : '#1e293b'}
                                        fontWeight="bold"
                                        textAnchor={branchCount === 1 ? 'start' : 'end'}
                                        className="transition-colors duration-200"
                                    >
                                        rec
                                    </text>
                                )}
                            </g>
                        );
                    })}

                    {/* FLETXES: 3. FUSIÓ / COMBINAR (Solucions -> Solució global) */}
                    {Array.from({ length: branchCount }).map((_, idx) => {
                        const startX = getBranchX(idx, branchCount);
                        const isCombine = stage === 'combine';
                        const isAll = stage === 'all';
                        const startY = solutionY + boxHeight / 2;
                        const endY = combinedY - boxHeight / 2;
                        const midY = (startY + endY) / 2;

                        return (
                            <path
                                key={`comb-edge-${idx}`}
                                d={`M ${startX} ${startY} C ${startX} ${midY}, ${rootX} ${midY}, ${rootX} ${endY}`}
                                fill="none"
                                stroke={isCombine ? '#c084fc' : isAll ? '#475569' : '#1e293b'}
                                strokeWidth={isCombine ? 2.2 : 1.2}
                                strokeDasharray={isCombine ? undefined : '4 3'}
                                markerEnd={isCombine ? 'url(#arrow-purple)' : isAll ? 'url(#arrow-muted)' : 'url(#arrow-dim)'}
                                className={`transition-all duration-200 ${isCombine ? 'flow-active' : ''}`}
                            />
                        );
                    })}

                    {/* BLOC 1: PROBLEMA ORIGINAL (CLICA PER DIVISIÓ) */}
                    <g
                        onClick={(e) => {
                            e.stopPropagation();
                            setStage(prev => prev === 'divide' ? 'all' : 'divide');
                        }}
                        transform={`translate(${rootX - 110}, ${rootY - boxHeight / 2})`}
                        className="cursor-pointer group"
                    >
                        <rect
                            width="220"
                            height={boxHeight}
                            rx="10"
                            fill={stage === 'divide' ? '#181206' : stage === 'all' ? '#0b0f19' : '#080b12'}
                            stroke={stage === 'divide' ? '#f59e0b' : stage === 'all' ? '#38bdf8' : '#1e293b'}
                            strokeWidth={stage === 'divide' ? 2 : 1.2}
                            filter={stage === 'divide' ? 'url(#glow-amber)' : undefined}
                            className="transition-all duration-200 group-hover:stroke-amber-400"
                        />
                        <text
                            x="110"
                            y="18"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill={stage === 'divide' ? '#fef3c7' : stage === 'all' ? '#f8fafc' : '#475569'}
                            fontSize="11"
                            fontWeight="bold"
                            className="transition-colors duration-200 group-hover:fill-white"
                        >
                            Problema inicial (mida n)
                        </text>
                    </g>

                    {/* BLOCS 2: SUBPROBLEMES (CLICA PER VÈNCER) */}
                    {Array.from({ length: branchCount }).map((_, idx) => {
                        const x = getBranchX(idx, branchCount);
                        const isConquer = stage === 'conquer';
                        const isDivide = stage === 'divide';
                        const isAll = stage === 'all';

                        return (
                            <g
                                key={`subproblem-box-${idx}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setStage(prev => prev === 'conquer' ? 'all' : 'conquer');
                                }}
                                transform={`translate(${x - boxWidth / 2}, ${subproblemY - boxHeight / 2})`}
                                className="cursor-pointer group"
                            >
                                <rect
                                    width={boxWidth}
                                    height={boxHeight}
                                    rx="8"
                                    fill={isConquer ? '#061e14' : isDivide ? '#181206' : isAll ? '#0a0d16' : '#06080e'}
                                    stroke={isConquer ? '#10b981' : isDivide ? '#f59e0b' : isAll ? '#334155' : '#1e293b'}
                                    strokeWidth={isConquer || isDivide ? 1.8 : 1}
                                    filter={isConquer ? 'url(#glow-emerald)' : isDivide ? 'url(#glow-amber)' : undefined}
                                    className="transition-all duration-200 group-hover:stroke-emerald-400"
                                />
                                <text
                                    x={boxWidth / 2}
                                    y="14"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill={isConquer ? '#34d399' : isDivide ? '#fbbf24' : isAll ? '#cbd5e1' : '#475569'}
                                    fontSize="10"
                                    fontWeight="bold"
                                    className="transition-colors duration-200 group-hover:fill-white"
                                >
                                    {branchCount === 1 ? 'Subproblema' : `Subproblema ${idx + 1}`}
                                </text>
                                <text
                                    x={boxWidth / 2}
                                    y="26"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill={isConquer ? '#a7f3d0' : isDivide ? '#fde68a' : isAll ? '#94a3b8' : '#334155'}
                                    fontSize="9"
                                    className="transition-colors duration-200"
                                >
                                    mida {currentPreset.subSizeText}
                                </text>
                            </g>
                        );
                    })}

                    {/* BLOCS 3: SOLUCIONS PARCIALS (CLICA PER FUSIÓ) */}
                    {Array.from({ length: branchCount }).map((_, idx) => {
                        const x = getBranchX(idx, branchCount);
                        const isCombine = stage === 'combine';
                        const isConquer = stage === 'conquer';
                        const isAll = stage === 'all';

                        return (
                            <g
                                key={`solution-box-${idx}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setStage(prev => prev === 'combine' ? 'all' : 'combine');
                                }}
                                transform={`translate(${x - boxWidth / 2}, ${solutionY - boxHeight / 2})`}
                                className="cursor-pointer group"
                            >
                                <rect
                                    width={boxWidth}
                                    height={boxHeight}
                                    rx="8"
                                    fill={isCombine ? '#1a0f2e' : isConquer ? '#061e14' : isAll ? '#0a0d16' : '#06080e'}
                                    stroke={isCombine ? '#c084fc' : isConquer ? '#10b981' : isAll ? '#334155' : '#1e293b'}
                                    strokeWidth={isCombine || isConquer ? 1.8 : 1}
                                    filter={isCombine ? 'url(#glow-purple)' : isConquer ? 'url(#glow-emerald)' : undefined}
                                    className="transition-all duration-200 group-hover:stroke-purple-400"
                                />
                                <text
                                    x={boxWidth / 2}
                                    y="18"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill={isCombine ? '#e9d5ff' : isConquer ? '#34d399' : isAll ? '#cbd5e1' : '#475569'}
                                    fontSize="10.5"
                                    fontWeight="bold"
                                    className="transition-colors duration-200 group-hover:fill-white"
                                >
                                    {branchCount === 1 ? 'Solució' : `Solució ${idx + 1}`}
                                </text>
                            </g>
                        );
                    })}

                    {/* BLOC 4: SOLUCIÓ GLOBAL COMBINADA (CLICA PER FUSIÓ) */}
                    <g
                        onClick={(e) => {
                            e.stopPropagation();
                            setStage(prev => prev === 'combine' ? 'all' : 'combine');
                        }}
                        transform={`translate(${rootX - 110}, ${combinedY - boxHeight / 2})`}
                        className="cursor-pointer group"
                    >
                        <rect
                            width="220"
                            height={boxHeight}
                            rx="10"
                            fill={stage === 'combine' ? '#1a0f2e' : stage === 'all' ? '#0b0f19' : '#080b12'}
                            stroke={stage === 'combine' ? '#c084fc' : stage === 'all' ? '#334155' : '#1e293b'}
                            strokeWidth={stage === 'combine' ? 2 : 1}
                            filter={stage === 'combine' ? 'url(#glow-purple)' : undefined}
                            className="transition-all duration-200 group-hover:stroke-purple-400"
                        />
                        <text
                            x="110"
                            y="18"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill={stage === 'combine' ? '#f5f3ff' : stage === 'all' ? '#f8fafc' : '#475569'}
                            fontSize="11"
                            fontWeight="bold"
                            className="transition-colors duration-200 group-hover:fill-white"
                        >
                            Solució global combinada
                        </text>
                    </g>

                    {/* ETAPES LATERALS: INDICADORS I ACTIVADORS DE FASE */}
                    {/* 1. Divisió */}
                    <g
                        onClick={(e) => {
                            e.stopPropagation();
                            setStage(prev => prev === 'divide' ? 'all' : 'divide');
                        }}
                        transform={`translate(${svgWidth - 14}, ${subproblemY})`}
                        className="cursor-pointer group"
                    >
                        <text
                            x="0"
                            y="-6"
                            textAnchor="end"
                            dominantBaseline="middle"
                            fill={stage === 'divide' ? '#f59e0b' : stage === 'all' ? '#94a3b8' : '#334155'}
                            fontSize="10"
                            fontWeight="bold"
                            className="transition-colors duration-200 group-hover:fill-amber-400"
                        >
                            1. Divisió
                        </text>
                        <text
                            x="0"
                            y="8"
                            textAnchor="end"
                            dominantBaseline="middle"
                            fill={stage === 'divide' ? '#fbbf24' : stage === 'all' ? '#64748b' : '#1e293b'}
                            fontSize="9"
                            fontWeight="bold"
                            className="transition-colors duration-200 group-hover:fill-amber-300"
                        >
                            T_divisió(n)
                        </text>
                    </g>

                    {/* 2. Vèncer */}
                    <g
                        onClick={(e) => {
                            e.stopPropagation();
                            setStage(prev => prev === 'conquer' ? 'all' : 'conquer');
                        }}
                        transform={`translate(${svgWidth - 14}, ${solutionY})`}
                        className="cursor-pointer group"
                    >
                        <text
                            x="0"
                            y="-6"
                            textAnchor="end"
                            dominantBaseline="middle"
                            fill={stage === 'conquer' ? '#10b981' : stage === 'all' ? '#94a3b8' : '#334155'}
                            fontSize="10"
                            fontWeight="bold"
                            className="transition-colors duration-200 group-hover:fill-emerald-400"
                        >
                            2. Vèncer
                        </text>
                        <text
                            x="0"
                            y="8"
                            textAnchor="end"
                            dominantBaseline="middle"
                            fill={stage === 'conquer' ? '#34d399' : stage === 'all' ? '#64748b' : '#1e293b'}
                            fontSize="9"
                            fontWeight="bold"
                            className="transition-colors duration-200 group-hover:fill-emerald-300"
                        >
                            {currentPreset.recCostText}
                        </text>
                    </g>

                    {/* 3. Fusió */}
                    <g
                        onClick={(e) => {
                            e.stopPropagation();
                            setStage(prev => prev === 'combine' ? 'all' : 'combine');
                        }}
                        transform={`translate(${svgWidth - 14}, ${combinedY})`}
                        className="cursor-pointer group"
                    >
                        <text
                            x="0"
                            y="-6"
                            textAnchor="end"
                            dominantBaseline="middle"
                            fill={stage === 'combine' ? '#c084fc' : stage === 'all' ? '#94a3b8' : '#334155'}
                            fontSize="10"
                            fontWeight="bold"
                            className="transition-colors duration-200 group-hover:fill-purple-400"
                        >
                            3. Fusió
                        </text>
                        <text
                            x="0"
                            y="8"
                            textAnchor="end"
                            dominantBaseline="middle"
                            fill={stage === 'combine' ? '#d8b4fe' : stage === 'all' ? '#64748b' : '#1e293b'}
                            fontSize="9"
                            fontWeight="bold"
                            className="transition-colors duration-200 group-hover:fill-purple-300"
                        >
                            T_combinar(n)
                        </text>
                    </g>
                </svg>
            </div>

            {/* 3. BARRA INFORMATIVA I COST RECURRENT */}
            <div className="w-full max-w-2xl flex flex-wrap items-center justify-between gap-3 text-xs py-1.5 px-2 border-t border-white/5 pt-2">
                {/* Descripció dinàmica del procés segons el contenidor clicat */}
                <div className="flex items-center gap-2">
                    {stage === 'all' ? (
                        <span className="text-slate-400 text-[11px]">
                            Clica un bloc per activar la fase (<span className="text-amber-400">Divisió</span>, <span className="text-emerald-400">Vèncer</span>, <span className="text-purple-400">Fusió</span>)
                        </span>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] border ${
                                stage === 'divide'
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                    : stage === 'conquer'
                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                    : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                            }`}>
                                {stage === 'divide' && '1. Divisió'}
                                {stage === 'conquer' && '2. Vèncer'}
                                {stage === 'combine' && '3. Fusió'}
                            </span>
                            <span className="text-slate-300 text-[11px]">
                                {stage === 'divide' && `Descomposició en ${branchCount} subproblemes de mida ${currentPreset.subSizeText}`}
                                {stage === 'conquer' && `Resolució recursiva dels ${branchCount} subproblemes`}
                                {stage === 'combine' && `Fusió de les solucions parcials en la solució global`}
                            </span>
                            <button
                                type="button"
                                onClick={() => setStage('all')}
                                className="text-[10px] text-slate-500 hover:text-slate-300 underline decoration-dotted ml-1"
                            >
                                veure tot
                            </button>
                        </div>
                    )}
                </div>

                {/* Equació de cost destacant el component actiu */}
                <div className="flex items-center gap-1.5 text-slate-400">
                    <span className="text-slate-500">Cost:</span>
                    <span className="font-mono text-slate-200">
                        <InlineMath math={getFormulaMath()} />
                    </span>
                </div>
            </div>

        </div>
    );
}
