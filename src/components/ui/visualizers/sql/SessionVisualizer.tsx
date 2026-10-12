"use client";

import React from 'react';

export default function SessionVisualizer() {
    return (
        <div className="w-full flex items-center justify-center my-6 select-none not-prose font-mono">
            <div className="w-full max-w-xl">
                <svg
                    viewBox="0 0 580 120"
                    className="w-full h-auto overflow-visible select-none"
                >
                    <defs>
                        <marker
                            id="pipe-arrow"
                            viewBox="0 0 10 10"
                            refX="7"
                            refY="5"
                            markerWidth="5"
                            markerHeight="5"
                            orient="auto"
                        >
                            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#475569" />
                        </marker>
                        <marker
                            id="pipe-arrow-emerald"
                            viewBox="0 0 10 10"
                            refX="7"
                            refY="5"
                            markerWidth="5"
                            markerHeight="5"
                            orient="auto"
                        >
                            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#10b981" />
                        </marker>
                        <marker
                            id="pipe-arrow-rose"
                            viewBox="0 0 10 10"
                            refX="7"
                            refY="5"
                            markerWidth="5"
                            markerHeight="5"
                            orient="auto"
                        >
                            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f43f5e" />
                        </marker>
                    </defs>

                    {/* 1. CONNEXIÓ */}
                    <g transform="translate(10, 42)">
                        <rect
                            width="105"
                            height="36"
                            rx="7"
                            fill="#0b1324"
                            stroke="#38bdf8"
                            strokeWidth="1.3"
                        />
                        <text
                            x="52.5"
                            y="18"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#f8fafc"
                            fontSize="11"
                            fontWeight="bold"
                        >
                            Connexió
                        </text>
                        <text
                            x="52.5"
                            y="28"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#64748b"
                            fontSize="7.5"
                        >
                            TCP / Xarxa
                        </text>
                    </g>

                    {/* Fletxa Connexió -> Sessió */}
                    <path
                        d="M 115 60 L 150 60"
                        fill="none"
                        stroke="#475569"
                        strokeWidth="1.4"
                        markerEnd="url(#pipe-arrow)"
                    />

                    {/* 2. SESSIÓ */}
                    <g transform="translate(155, 42)">
                        <rect
                            width="110"
                            height="36"
                            rx="7"
                            fill="#0c1a2e"
                            stroke="#60a5fa"
                            strokeWidth="1.3"
                        />
                        <text
                            x="55"
                            y="18"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#f8fafc"
                            fontSize="11"
                            fontWeight="bold"
                        >
                            Sessió
                        </text>
                        <text
                            x="55"
                            y="28"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#64748b"
                            fontSize="7.5"
                        >
                            usuari · esquema
                        </text>
                    </g>

                    {/* Fletxa Sessió -> Transacció */}
                    <path
                        d="M 265 60 L 300 60"
                        fill="none"
                        stroke="#475569"
                        strokeWidth="1.4"
                        markerEnd="url(#pipe-arrow)"
                    />

                    {/* 3. TRANSACCIÓ */}
                    <g transform="translate(305, 42)">
                        <rect
                            width="115"
                            height="36"
                            rx="7"
                            fill="#181206"
                            stroke="#f59e0b"
                            strokeWidth="1.3"
                        />
                        <text
                            x="57.5"
                            y="18"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#fef3c7"
                            fontSize="11"
                            fontWeight="bold"
                        >
                            Transacció
                        </text>
                        <text
                            x="57.5"
                            y="28"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#b45309"
                            fontSize="7.5"
                        >
                            unitat atòmica
                        </text>
                    </g>

                    {/* Bifurcació cap a COMMIT / ROLLBACK */}
                    {/* Camí cap a COMMIT */}
                    <path
                        d="M 420 60 C 445 60, 445 32, 470 32"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="1.4"
                        markerEnd="url(#pipe-arrow-emerald)"
                    />

                    {/* Camí cap a ROLLBACK */}
                    <path
                        d="M 420 60 C 445 60, 445 88, 470 88"
                        fill="none"
                        stroke="#f43f5e"
                        strokeWidth="1.4"
                        markerEnd="url(#pipe-arrow-rose)"
                    />

                    {/* Node COMMIT */}
                    <g transform="translate(475, 18)">
                        <rect
                            width="95"
                            height="28"
                            rx="6"
                            fill="#061e14"
                            stroke="#10b981"
                            strokeWidth="1.3"
                        />
                        <text
                            x="47.5"
                            y="14"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#a7f3d0"
                            fontSize="10"
                            fontWeight="bold"
                        >
                            COMMIT ✓
                        </text>
                    </g>

                    {/* Node ROLLBACK */}
                    <g transform="translate(475, 74)">
                        <rect
                            width="95"
                            height="28"
                            rx="6"
                            fill="#240b12"
                            stroke="#f43f5e"
                            strokeWidth="1.3"
                        />
                        <text
                            x="47.5"
                            y="14"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#fecdd3"
                            fontSize="10"
                            fontWeight="bold"
                        >
                            ROLLBACK ✕
                        </text>
                    </g>
                </svg>
            </div>
        </div>
    );
}
