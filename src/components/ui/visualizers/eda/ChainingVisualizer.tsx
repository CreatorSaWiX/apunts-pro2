"use client";

import React, { useState } from "react";

interface ChainNode {
    key: string;
}

interface TableRow {
    index: number;
    label: string;
    chain: ChainNode[];
    isDots?: boolean;
}

const ROWS: TableRow[] = [
    { index: 0, label: "T[0]", chain: [] },
    { index: 1, label: "T[1]", chain: [{ key: "k₁" }, { key: "k₄" }] },
    { index: 2, label: "T[2]", chain: [] },
    { index: 3, label: "T[3]", chain: [{ key: "k₂" }, { key: "k₅" }, { key: "k₇" }] },
    { index: 4, label: "···", chain: [], isDots: true },
    { index: 5, label: "T[m-1]", chain: [{ key: "k₃" }] },
];

export default function ChainingVisualizer() {
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);

    const rowYPositions = [18, 58, 98, 138, 178, 214];
    const slotWidth = 62;
    const slotHeight = 28;
    const nodeWidth = 68;
    const nodeHeight = 28;
    const arrowLen = 22;

    return (
        <div className="w-full flex justify-center my-6 not-prose select-none">
            <svg
                viewBox="0 0 520 256"
                className="w-full max-w-xl h-auto overflow-visible font-mono"
                aria-label="Resolució de col·lisions per encadenament"
            >
                <defs>
                    {/* Fletxa per defecte */}
                    <marker
                        id="chain-arrow-default"
                        viewBox="0 0 10 10"
                        refX="8"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto"
                    >
                        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#64748b" />
                    </marker>

                    {/* Fletxa activa / ressaltada */}
                    <marker
                        id="chain-arrow-active"
                        viewBox="0 0 10 10"
                        refX="8"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto"
                    >
                        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8" />
                    </marker>
                </defs>

                {ROWS.map((row, rIdx) => {
                    const y = rowYPositions[rIdx];
                    const isHovered = hoveredRow === row.index;
                    const isDimmed = hoveredRow !== null && !isHovered;

                    if (row.isDots) {
                        return (
                            <g key="dots" className="opacity-40 select-none">
                                <text
                                    x={46}
                                    y={y + 16}
                                    textAnchor="middle"
                                    className="text-xs fill-slate-500 font-bold"
                                >
                                    ⋮
                                </text>
                            </g>
                        );
                    }

                    const hasElements = row.chain.length > 0;
                    const strokeColor = isHovered ? "#38bdf8" : "#334155";
                    const fillColor = isHovered ? "rgba(56, 189, 248, 0.08)" : "#0f172a";
                    const textColor = isHovered ? "fill-sky-300" : "fill-slate-400";
                    const arrowColor = isHovered ? "#38bdf8" : "#64748b";
                    const markerId = isHovered ? "url(#chain-arrow-active)" : "url(#chain-arrow-default)";

                    // Coordenada x d'inici de la fletxa des de la taula
                    const tableArrowStartX = 16 + slotWidth;
                    const tableArrowY = y + slotHeight / 2;

                    return (
                        <g
                            key={row.label}
                            className="cursor-pointer transition-opacity duration-200"
                            style={{ opacity: isDimmed ? 0.28 : 1 }}
                            onMouseEnter={() => setHoveredRow(row.index)}
                            onMouseLeave={() => setHoveredRow(null)}
                        >
                            {/* Casella de la taula T[j] */}
                            <rect
                                x="16"
                                y={y}
                                width={slotWidth}
                                height={slotHeight}
                                rx="5"
                                fill={fillColor}
                                stroke={strokeColor}
                                strokeWidth={isHovered ? "1.5" : "1"}
                                className="transition-all duration-200"
                            />
                            <text
                                x={16 + slotWidth / 2}
                                y={y + 18}
                                textAnchor="middle"
                                className={`text-[11px] font-semibold transition-colors duration-200 ${textColor}`}
                            >
                                {row.label}
                            </text>

                            {/* Fletxa des de la taula cap al primer node o cap a null */}
                            <line
                                x1={tableArrowStartX}
                                y1={tableArrowY}
                                x2={tableArrowStartX + arrowLen}
                                y2={tableArrowY}
                                stroke={arrowColor}
                                strokeWidth={isHovered ? "1.5" : "1"}
                                markerEnd={markerId}
                                className="transition-colors duration-200"
                            />

                            {/* Casella buida -> null */}
                            {!hasElements && (
                                <g transform={`translate(${tableArrowStartX + arrowLen + 6}, ${y + 5})`}>
                                    <rect
                                        x="0"
                                        y="0"
                                        width="34"
                                        height="18"
                                        rx="4"
                                        fill="#020617"
                                        stroke={isHovered ? "#38bdf8" : "#1e293b"}
                                        strokeWidth="1"
                                        className="transition-colors duration-200"
                                    />
                                    <text
                                        x="17"
                                        y="12.5"
                                        textAnchor="middle"
                                        className={`text-[9.5px] font-semibold transition-colors duration-200 ${
                                            isHovered ? "fill-sky-400" : "fill-slate-600"
                                        }`}
                                    >
                                        null
                                    </text>
                                </g>
                            )}

                            {/* Llista enllaçada de nodes */}
                            {hasElements && (
                                <g>
                                    {row.chain.map((node, nIdx) => {
                                        const nodeX = tableArrowStartX + arrowLen + 6 + nIdx * (nodeWidth + arrowLen);
                                        const nodeY = y;
                                        const nextArrowStartX = nodeX + nodeWidth;

                                        return (
                                            <g key={node.key}>
                                                {/* Compartiment clau (esquerra) */}
                                                <rect
                                                    x={nodeX}
                                                    y={nodeY}
                                                    width={nodeWidth - 20}
                                                    height={nodeHeight}
                                                    rx="5"
                                                    fill={isHovered ? "rgba(56, 189, 248, 0.12)" : "#0b1329"}
                                                    stroke={strokeColor}
                                                    strokeWidth={isHovered ? "1.5" : "1"}
                                                    className="transition-all duration-200"
                                                />
                                                <text
                                                    x={nodeX + (nodeWidth - 20) / 2}
                                                    y={nodeY + 18}
                                                    textAnchor="middle"
                                                    className={`text-[11px] font-semibold transition-colors duration-200 ${
                                                        isHovered ? "fill-sky-200" : "fill-slate-200"
                                                    }`}
                                                >
                                                    {node.key}
                                                </text>

                                                {/* Compartiment punter (dreta) */}
                                                <rect
                                                    x={nodeX + nodeWidth - 20}
                                                    y={nodeY}
                                                    width="20"
                                                    height={nodeHeight}
                                                    rx="5"
                                                    fill={isHovered ? "rgba(56, 189, 248, 0.06)" : "#070d1e"}
                                                    stroke={strokeColor}
                                                    strokeWidth={isHovered ? "1.5" : "1"}
                                                    className="transition-all duration-200"
                                                />
                                                {/* Punt del punter */}
                                                <circle
                                                    cx={nodeX + nodeWidth - 10}
                                                    cy={nodeY + nodeHeight / 2}
                                                    r="2.5"
                                                    fill={isHovered ? "#38bdf8" : "#64748b"}
                                                    className="transition-colors duration-200"
                                                />

                                                {/* Fletxa al següent node o cap a null */}
                                                <line
                                                    x1={nextArrowStartX}
                                                    y1={tableArrowY}
                                                    x2={nextArrowStartX + arrowLen}
                                                    y2={tableArrowY}
                                                    stroke={arrowColor}
                                                    strokeWidth={isHovered ? "1.5" : "1"}
                                                    markerEnd={markerId}
                                                    className="transition-colors duration-200"
                                                />

                                                {/* Últim node -> null */}
                                                {nIdx === row.chain.length - 1 && (
                                                    <g
                                                        transform={`translate(${
                                                            nextArrowStartX + arrowLen + 6
                                                        }, ${y + 5})`}
                                                    >
                                                        <rect
                                                            x="0"
                                                            y="0"
                                                            width="34"
                                                            height="18"
                                                            rx="4"
                                                            fill="#020617"
                                                            stroke={isHovered ? "#38bdf8" : "#1e293b"}
                                                            strokeWidth="1"
                                                            className="transition-colors duration-200"
                                                        />
                                                        <text
                                                            x="17"
                                                            y="12.5"
                                                            textAnchor="middle"
                                                            className={`text-[9.5px] font-semibold transition-colors duration-200 ${
                                                                isHovered ? "fill-sky-400" : "fill-slate-600"
                                                            }`}
                                                        >
                                                            null
                                                        </text>
                                                    </g>
                                                )}
                                            </g>
                                        );
                                    })}
                                </g>
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}
