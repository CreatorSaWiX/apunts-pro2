"use client";

import React, { useState, useId } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export type VennOperation =
    | 'union'
    | 'intersection'
    | 'diff_a_b'
    | 'diff_b_a'
    | 'complement_a'
    | 'complement_b'
    | 'sym_diff'
    | 'disjoint'
    | 'demorgan_union'
    | 'demorgan_inter'
    | 'free';

interface PresetConfig {
    id: VennOperation;
    symbol: string;
    regions?: {
        onlyA: boolean;
        intersect: boolean;
        onlyB: boolean;
        outside: boolean;
    };
    isDisjoint?: boolean;
}

const PRESETS: PresetConfig[] = [
    { id: 'union', symbol: 'A ∪ B', regions: { onlyA: true, intersect: true, onlyB: true, outside: false } },
    { id: 'intersection', symbol: 'A ∩ B', regions: { onlyA: false, intersect: true, onlyB: false, outside: false } },
    { id: 'diff_a_b', symbol: 'A ∖ B', regions: { onlyA: true, intersect: false, onlyB: false, outside: false } },
    { id: 'diff_b_a', symbol: 'B ∖ A', regions: { onlyA: false, intersect: false, onlyB: true, outside: false } },
    { id: 'complement_a', symbol: '¬A', regions: { onlyA: false, intersect: false, onlyB: true, outside: true } },
    { id: 'complement_b', symbol: '¬B', regions: { onlyA: true, intersect: false, onlyB: false, outside: true } },
    { id: 'sym_diff', symbol: 'A Δ B', regions: { onlyA: true, intersect: false, onlyB: true, outside: false } },
    { id: 'disjoint', symbol: 'A ∩ B = ∅', regions: { onlyA: true, intersect: false, onlyB: true, outside: false }, isDisjoint: true },
    { id: 'demorgan_union', symbol: '¬(A ∪ B)', regions: { onlyA: false, intersect: false, onlyB: false, outside: true } },
    { id: 'demorgan_inter', symbol: '¬(A ∩ B)', regions: { onlyA: true, intersect: false, onlyB: true, outside: true } },
    { id: 'free', symbol: 'Lliure' },
];

interface CombinationInfo {
    symbol: string;
    description: string;
    probabilityFormula: string;
}

const COMBINATIONS: Record<string, CombinationInfo> = {
    '0000': {
        symbol: '\\emptyset',
        description: "Succés impossible (conjunt buit). Fes clic a les regions per crear conjunts.",
        probabilityFormula: 'P(\\emptyset) = 0',
    },
    '1000': {
        symbol: 'A \\setminus B',
        description: "Ocorre A però no B (crescent esquerre).",
        probabilityFormula: 'P(A \\setminus B) = P(A) - P(A \\cap B)',
    },
    '0100': {
        symbol: 'A \\cap B',
        description: "Ocorren A i B simultàniament (intersecció).",
        probabilityFormula: 'P(A \\cap B) = P(A) + P(B) - P(A \\cup B)',
    },
    '0010': {
        symbol: 'B \\setminus A',
        description: "Ocorre B però no A (crescent dret).",
        probabilityFormula: 'P(B \\setminus A) = P(B) - P(A \\cap B)',
    },
    '0001': {
        symbol: '\\overline{A \\cup B}',
        description: "Ni A ni B (De Morgan: \\overline{A} \\cap \\overline{B}).",
        probabilityFormula: 'P(\\overline{A \\cup B}) = 1 - P(A \\cup B)',
    },
    '1100': {
        symbol: 'A',
        description: "Ocorre l'esdeveniment A complet.",
        probabilityFormula: 'P(A) = P(A \\setminus B) + P(A \\cap B)',
    },
    '0110': {
        symbol: 'B',
        description: "Ocorre l'esdeveniment B complet.",
        probabilityFormula: 'P(B) = P(B \\setminus A) + P(A \\cap B)',
    },
    '1010': {
        symbol: 'A \\Delta B',
        description: "Diferència simètrica: exactament un dels dos.",
        probabilityFormula: 'P(A \\Delta B) = P(A \\cup B) - P(A \\cap B)',
    },
    '1001': {
        symbol: '\\overline{B}',
        description: "Complementari de B (no ocorre B).",
        probabilityFormula: 'P(\\overline{B}) = 1 - P(B)',
    },
    '0011': {
        symbol: '\\overline{A}',
        description: "Complementari de A (no ocorre A).",
        probabilityFormula: 'P(\\overline{A}) = 1 - P(A)',
    },
    '0101': {
        symbol: '(A \\cap B) \\cup \\overline{A \\cup B}',
        description: "Ocorren tots dos o cap dels dos (\\overline{A \\Delta B}).",
        probabilityFormula: 'P(\\overline{A \\Delta B}) = 1 - P(A \\Delta B)',
    },
    '1110': {
        symbol: 'A \\cup B',
        description: "Unió: ocorre A, B o tots dos («almenys un»).",
        probabilityFormula: 'P(A \\cup B) = P(A) + P(B) - P(A \\cap B)',
    },
    '1101': {
        symbol: 'A \\cup \\overline{B}',
        description: "Tot l'espai excepte només B (\\overline{B \\setminus A}).",
        probabilityFormula: 'P(A \\cup \\overline{B}) = 1 - P(B \\setminus A)',
    },
    '1011': {
        symbol: '\\overline{A \\cap B}',
        description: "No ocorren alhora (De Morgan: \\overline{A} \\cup \\overline{B}).",
        probabilityFormula: 'P(\\overline{A \\cap B}) = 1 - P(A \\cap B)',
    },
    '0111': {
        symbol: '\\overline{A} \\cup B',
        description: "Tot l'espai excepte només A (\\overline{A \\setminus B}).",
        probabilityFormula: 'P(\\overline{A} \\cup B) = 1 - P(A \\setminus B)',
    },
    '1111': {
        symbol: '\\Omega',
        description: "Succés segur (tot l'espai mostral).",
        probabilityFormula: 'P(\\Omega) = 1',
    }
};

export interface VennVisualizerProps {
    op?: string;
    operation?: string;
    compact?: boolean | string;
    interactive?: boolean | string;
    className?: string;
}

function getPresetById(op?: string): PresetConfig {
    if (!op) return PRESETS[0];
    const clean = op.trim().toLowerCase().replace(/[-]/g, '_');
    const found = PRESETS.find(p => p.id === clean);
    if (found) return found;
    if (clean === 'unio') return PRESETS[0];
    if (clean === 'interseccio' || clean === 'inter') return PRESETS[1];
    if (clean === 'not_a') return PRESETS[4];
    if (clean === 'not_b') return PRESETS[5];
    if (clean === 'demorgan' || clean === 'nor') return PRESETS[8];
    if (clean === 'free' || clean === 'interactive') return PRESETS[10];
    return PRESETS[0];
}

/**
 * MiniVennDiagram — Minimalist inline SVG diagram for table cells
 */
function MiniVennDiagram({ op }: { op?: string }) {
    const rawUid = useId();
    const uid = 'm-' + rawUid.replace(/[^a-zA-Z0-9_-]/g, '');
    const preset = getPresetById(op);
    const isDisjoint = !!preset.isDisjoint;

    const r = 18;
    const cy = 25;
    const cxA = isDisjoint ? 26 : 33;
    const cxB = isDisjoint ? 58 : 51;

    const highlightFill = 'rgba(56, 189, 248, 0.4)';
    const regions = preset.regions || { onlyA: true, intersect: true, onlyB: true, outside: false };
    const { onlyA, intersect, onlyB, outside } = regions;

    return (
        <span
            className="inline-flex items-center justify-center align-middle select-none py-0.5"
            title={`${preset.symbol}`}
        >
            <svg
                viewBox="0 0 84 50"
                className="w-16 h-10 overflow-visible"
                aria-label={`Diagrama de Venn ${preset.symbol}`}
            >
                <defs>
                    <mask id={`${uid}-onlyA`}>
                        <rect width="84" height="50" fill="white" />
                        <circle cx={cxB} cy={cy} r={r} fill="black" />
                    </mask>
                    <mask id={`${uid}-onlyB`}>
                        <rect width="84" height="50" fill="white" />
                        <circle cx={cxA} cy={cy} r={r} fill="black" />
                    </mask>
                    <clipPath id={`${uid}-intersect`}>
                        <circle cx={cxB} cy={cy} r={r} />
                    </clipPath>
                    <mask id={`${uid}-outside`}>
                        <rect width="84" height="50" fill="white" />
                        <circle cx={cxA} cy={cy} r={r} fill="black" />
                        <circle cx={cxB} cy={cy} r={r} fill="black" />
                    </mask>
                </defs>

                {/* Universe Ω frame */}
                <rect
                    x="2"
                    y="2"
                    width="80"
                    height="46"
                    rx="8"
                    fill="rgba(15, 23, 42, 0.6)"
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth="1"
                />

                {/* Shaded Outside */}
                {outside && (
                    <rect
                        x="2"
                        y="2"
                        width="80"
                        height="46"
                        rx="8"
                        fill={highlightFill}
                        mask={`url(#${uid}-outside)`}
                    />
                )}

                {/* Shaded Only A */}
                {onlyA && (
                    <circle
                        cx={cxA}
                        cy={cy}
                        r={r}
                        fill={highlightFill}
                        mask={`url(#${uid}-onlyA)`}
                    />
                )}

                {/* Shaded Only B */}
                {onlyB && (
                    <circle
                        cx={cxB}
                        cy={cy}
                        r={r}
                        fill={highlightFill}
                        mask={`url(#${uid}-onlyB)`}
                    />
                )}

                {/* Shaded Intersection */}
                {intersect && !isDisjoint && (
                    <circle
                        cx={cxA}
                        cy={cy}
                        r={r}
                        fill={highlightFill}
                        clipPath={`url(#${uid}-intersect)`}
                    />
                )}

                {/* Subtle Circles */}
                <circle
                    cx={cxA}
                    cy={cy}
                    r={r}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.2"
                    opacity={onlyA || intersect ? 0.9 : 0.4}
                />
                <circle
                    cx={cxB}
                    cy={cy}
                    r={r}
                    fill="none"
                    stroke="#c084fc"
                    strokeWidth="1.2"
                    opacity={onlyB || intersect ? 0.9 : 0.4}
                />

                {/* Minimal Labels */}
                <text x="6" y="10" fill="#475569" fontSize="6.5" fontFamily="monospace">Ω</text>
                <text x={cxA - 5} y={cy + 2.5} fill="#7dd3fc" fontSize="8" fontWeight="bold" fontFamily="monospace">A</text>
                <text x={cxB + 5} y={cy + 2.5} fill="#d8b4fe" fontSize="8" fontWeight="bold" fontFamily="monospace">B</text>
            </svg>
        </span>
    );
}

/**
 * Full VennVisualizer — Apple / Linear / Vercel Minimalist Design
 * All buttons strictly in ONE single horizontal row with free mode.
 */
export default function VennVisualizer(props: VennVisualizerProps) {
    const rawOp = props.op || props.operation;
    const isCompact = props.compact === true || props.compact === 'true' || (rawOp && props.interactive !== true && props.interactive !== 'true');

    if (isCompact && rawOp) {
        return <MiniVennDiagram op={rawOp} />;
    }

    const initialPreset = getPresetById(rawOp);
    const [regions, setRegions] = useState(initialPreset.regions || { onlyA: true, intersect: true, onlyB: true, outside: false });
    const [isDisjoint, setIsDisjoint] = useState(!!initialPreset.isDisjoint);
    const [activePresetId, setActivePresetId] = useState<VennOperation>(initialPreset.id);
    const [hoveredZone, setHoveredZone] = useState<string | null>(null);

    // Compute binary key: 'onlyA intersect onlyB outside'
    const stateKey = `${regions.onlyA ? 1 : 0}${regions.intersect ? 1 : 0}${regions.onlyB ? 1 : 0}${regions.outside ? 1 : 0}`;
    const info = COMBINATIONS[stateKey] || COMBINATIONS['0000'];

    // Select preset from pill bar
    const handleSelectPreset = (preset: PresetConfig) => {
        setActivePresetId(preset.id);
        if (preset.id === 'free') {
            setIsDisjoint(false);
            // In free mode, keep current regions or let user toggle
            return;
        }
        if (preset.regions) {
            setRegions(preset.regions);
            setIsDisjoint(!!preset.isDisjoint);
        }
    };

    // Toggle region directly on the diagram
    const toggleRegion = (region: keyof typeof regions) => {
        if (isDisjoint && region === 'intersect') return;

        const nextRegions = {
            ...regions,
            [region]: !regions[region]
        };
        setRegions(nextRegions);

        // Check if new state matches any known preset
        const nextKey = `${nextRegions.onlyA ? 1 : 0}${nextRegions.intersect ? 1 : 0}${nextRegions.onlyB ? 1 : 0}${nextRegions.outside ? 1 : 0}`;
        const matched = PRESETS.find(p =>
            p.id !== 'free' &&
            !p.isDisjoint === !isDisjoint &&
            p.regions &&
            `${p.regions.onlyA ? 1 : 0}${p.regions.intersect ? 1 : 0}${p.regions.onlyB ? 1 : 0}${p.regions.outside ? 1 : 0}` === nextKey
        );

        if (matched) {
            setActivePresetId(matched.id);
        } else {
            setActivePresetId('free');
        }
    };

    const rawUid = useId();
    const uid = 'v-' + rawUid.replace(/[^a-zA-Z0-9_-]/g, '');

    // Circle coordinates
    const r = isDisjoint ? 54 : 64;
    const cy = 110;
    const cxA = isDisjoint ? 115 : 145;
    const cxB = isDisjoint ? 245 : 215;

    const highlightFill = 'rgba(56, 189, 248, 0.35)';
    const hoverHighlight = 'rgba(56, 189, 248, 0.2)';

    return (
        <div className={`w-full flex flex-col items-center justify-center gap-6 my-10 font-sans select-none not-prose ${props.className || ''}`}>

            {/* 1. Minimal Segmented Tabs — Strictly in ONE single row */}
            <div className="w-full flex justify-center overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-1">
                <div className="flex flex-nowrap items-center gap-1 p-1 bg-slate-900/50 border border-white/5 rounded-xl backdrop-blur-sm whitespace-nowrap shrink-0">
                    {PRESETS.map((preset) => {
                        const isActive = activePresetId === preset.id;
                        return (
                            <button
                                key={preset.id}
                                type="button"
                                onClick={() => handleSelectPreset(preset)}
                                className={`shrink-0 relative px-2.5 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer ${isActive ? 'text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="venn-active-pill"
                                        className="absolute inset-0 bg-white/10 border border-white/10 rounded-lg shadow-sm"
                                        transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                                    />
                                )}
                                <span className="relative z-10">{preset.symbol}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 2. Venn Diagram Canvas — Free of heavy frames, Fully Interactive */}
            <div className="w-full max-w-[360px] aspect-[360/220] relative">
                <svg
                    viewBox="0 0 360 220"
                    className="w-full h-full overflow-visible"
                >
                    <defs>
                        <mask id={`${uid}-onlyA`}>
                            <rect width="360" height="220" fill="white" />
                            <circle cx={cxB} cy={cy} r={r} fill="black" />
                        </mask>
                        <mask id={`${uid}-onlyB`}>
                            <rect width="360" height="220" fill="white" />
                            <circle cx={cxA} cy={cy} r={r} fill="black" />
                        </mask>
                        <clipPath id={`${uid}-intersect`}>
                            <circle cx={cxB} cy={cy} r={r} />
                        </clipPath>
                        <mask id={`${uid}-outside`}>
                            <rect width="360" height="220" fill="white" />
                            <circle cx={cxA} cy={cy} r={r} fill="black" />
                            <circle cx={cxB} cy={cy} r={r} fill="black" />
                        </mask>
                    </defs>

                    {/* Universe Ω Frame (Clickable) */}
                    <g
                        onClick={() => toggleRegion('outside')}
                        onMouseEnter={() => setHoveredZone('outside')}
                        onMouseLeave={() => setHoveredZone(null)}
                        className="cursor-pointer"
                    >
                        <rect
                            x="10"
                            y="10"
                            width="340"
                            height="200"
                            rx="16"
                            fill={hoveredZone === 'outside' && !regions.outside ? hoverHighlight : "rgba(15, 23, 42, 0.4)"}
                            stroke={regions.outside ? "#38bdf8" : "rgba(255, 255, 255, 0.08)"}
                            strokeWidth="1.2"
                            className="transition-colors duration-200"
                        />
                        {regions.outside && (
                            <rect
                                x="10"
                                y="10"
                                width="340"
                                height="200"
                                rx="16"
                                fill={highlightFill}
                                mask={`url(#${uid}-outside)`}
                                className="transition-all duration-300"
                            />
                        )}
                    </g>

                    {/* Interactive Region: Only A */}
                    <g
                        onClick={() => toggleRegion('onlyA')}
                        onMouseEnter={() => setHoveredZone('onlyA')}
                        onMouseLeave={() => setHoveredZone(null)}
                        className="cursor-pointer"
                    >
                        {hoveredZone === 'onlyA' && !regions.onlyA && (
                            <circle
                                cx={cxA}
                                cy={cy}
                                r={r}
                                fill={hoverHighlight}
                                mask={`url(#${uid}-onlyA)`}
                            />
                        )}
                        {regions.onlyA && (
                            <circle
                                cx={cxA}
                                cy={cy}
                                r={r}
                                fill={highlightFill}
                                mask={`url(#${uid}-onlyA)`}
                                className="transition-all duration-300"
                            />
                        )}
                        <circle
                            cx={cxA}
                            cy={cy}
                            r={r}
                            fill="transparent"
                            mask={`url(#${uid}-onlyA)`}
                        />
                    </g>

                    {/* Interactive Region: Only B */}
                    <g
                        onClick={() => toggleRegion('onlyB')}
                        onMouseEnter={() => setHoveredZone('onlyB')}
                        onMouseLeave={() => setHoveredZone(null)}
                        className="cursor-pointer"
                    >
                        {hoveredZone === 'onlyB' && !regions.onlyB && (
                            <circle
                                cx={cxB}
                                cy={cy}
                                r={r}
                                fill={hoverHighlight}
                                mask={`url(#${uid}-onlyB)`}
                            />
                        )}
                        {regions.onlyB && (
                            <circle
                                cx={cxB}
                                cy={cy}
                                r={r}
                                fill={highlightFill}
                                mask={`url(#${uid}-onlyB)`}
                                className="transition-all duration-300"
                            />
                        )}
                        <circle
                            cx={cxB}
                            cy={cy}
                            r={r}
                            fill="transparent"
                            mask={`url(#${uid}-onlyB)`}
                        />
                    </g>

                    {/* Interactive Region: Intersection */}
                    {!isDisjoint && (
                        <g
                            onClick={() => toggleRegion('intersect')}
                            onMouseEnter={() => setHoveredZone('intersect')}
                            onMouseLeave={() => setHoveredZone(null)}
                            className="cursor-pointer"
                        >
                            {hoveredZone === 'intersect' && !regions.intersect && (
                                <circle
                                    cx={cxA}
                                    cy={cy}
                                    r={r}
                                    fill={hoverHighlight}
                                    clipPath={`url(#${uid}-intersect)`}
                                />
                            )}
                            {regions.intersect && (
                                <circle
                                    cx={cxA}
                                    cy={cy}
                                    r={r}
                                    fill={highlightFill}
                                    clipPath={`url(#${uid}-intersect)`}
                                    className="transition-all duration-300"
                                />
                            )}
                            <circle
                                cx={cxA}
                                cy={cy}
                                r={r}
                                fill="transparent"
                                clipPath={`url(#${uid}-intersect)`}
                            />
                        </g>
                    )}

                    {/* Circle A Outline */}
                    <circle
                        cx={cxA}
                        cy={cy}
                        r={r}
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="1.6"
                        opacity={regions.onlyA || regions.intersect ? 0.95 : 0.45}
                        className="transition-all duration-500 pointer-events-none"
                    />

                    {/* Circle B Outline */}
                    <circle
                        cx={cxB}
                        cy={cy}
                        r={r}
                        fill="none"
                        stroke="#c084fc"
                        strokeWidth="1.6"
                        opacity={regions.onlyB || regions.intersect ? 0.95 : 0.45}
                        className="transition-all duration-500 pointer-events-none"
                    />

                    {/* Universe Label */}
                    <text
                        x="24"
                        y="28"
                        fill="#64748b"
                        fontSize="12"
                        fontFamily="monospace"
                        className="select-none pointer-events-none"
                    >
                        Ω
                    </text>

                    {/* Label A */}
                    <text
                        x={isDisjoint ? cxA : cxA - 26}
                        y={cy + 4}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#bae6fd"
                        fontSize="15"
                        fontWeight="600"
                        fontFamily="monospace"
                        className="select-none pointer-events-none"
                    >
                        A
                    </text>

                    {/* Label B */}
                    <text
                        x={isDisjoint ? cxB : cxB + 26}
                        y={cy + 4}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#e9d5ff"
                        fontSize="15"
                        fontWeight="600"
                        fontFamily="monospace"
                        className="select-none pointer-events-none"
                    >
                        B
                    </text>

                    {/* Center Disjoint empty symbol */}
                    {isDisjoint && (
                        <text
                            x="180"
                            y={cy + 4}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#64748b"
                            fontSize="13"
                            fontFamily="monospace"
                        >
                            ∅
                        </text>
                    )}
                </svg>

                {/* Micro hover indicator badge */}
                <AnimatePresence>
                    {hoveredZone && (
                        <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 4 }}
                            transition={{ duration: 0.15 }}
                            className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-white/10 text-[11px] font-mono text-slate-300 backdrop-blur-md shadow-lg pointer-events-none"
                        >
                            {hoveredZone === 'onlyA' && "A ∖ B (només A)"}
                            {hoveredZone === 'onlyB' && "B ∖ A (només B)"}
                            {hoveredZone === 'intersect' && "A ∩ B (intersecció)"}
                            {hoveredZone === 'outside' && "¬(A ∪ B) (exterior)"}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 3. Minimal Dynamic Formula & Description — Updates with clicks and presets */}
            <div className="flex flex-col items-center text-center gap-1.5 min-h-[48px]">
                <motion.div
                    key={stateKey + (isDisjoint ? '-disjoint' : '')}
                    initial={{ opacity: 0, y: 2 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-sm md:text-base font-mono text-slate-100 font-medium flex items-center gap-2"
                >
                    {isDisjoint && stateKey === '1010' ? (
                        <InlineMath math="P(A \cup B) = P(A) + P(B)" />
                    ) : (
                        <InlineMath math={info.probabilityFormula} />
                    )}
                </motion.div>
                <motion.p
                    key={stateKey + '-desc'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15 }}
                    className="text-xs text-slate-400 max-w-md"
                >
                    {isDisjoint && stateKey === '1010' ? "Successos incompatibles (A ∩ B = ∅)." : info.description}
                </motion.p>
            </div>

        </div>
    );
}
