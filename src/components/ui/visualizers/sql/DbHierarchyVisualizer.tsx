"use client";

import React from 'react';

export default function DbHierarchyVisualizer() {
    return (
        <div className="w-full flex items-center justify-center my-6 select-none not-prose font-mono">
            <div className="w-full max-w-xl">
                <svg
                    viewBox="0 0 580 170"
                    className="w-full h-auto overflow-visible select-none"
                >
                    {/* --- CONNECTIONS (BEZIER CURVES) --- */}
                    {/* Servidor -> Catàleg */}
                    <path
                        d="M 115 85 C 145 85, 145 60, 175 60"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="1.5"
                    />

                    {/* Servidor -> Catàleg secundari (línia discontínua) */}
                    <path
                        d="M 115 85 C 145 85, 145 130, 175 130"
                        fill="none"
                        stroke="#1e293b"
                        strokeWidth="1.2"
                        strokeDasharray="3 3"
                    />

                    {/* Catàleg -> information_schema */}
                    <path
                        d="M 270 60 C 295 60, 295 35, 320 35"
                        fill="none"
                        stroke="#334155"
                        strokeWidth="1.2"
                    />

                    {/* Catàleg -> Esquema */}
                    <path
                        d="M 270 60 C 295 60, 295 95, 320 95"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="1.5"
                    />

                    {/* Esquema -> Taules */}
                    <path
                        d="M 430 95 C 455 95, 455 65, 480 65"
                        fill="none"
                        stroke="#334155"
                        strokeWidth="1.2"
                    />

                    {/* Esquema -> Vistes */}
                    <path
                        d="M 430 95 L 480 95"
                        fill="none"
                        stroke="#334155"
                        strokeWidth="1.2"
                    />

                    {/* Esquema -> Dominis */}
                    <path
                        d="M 430 95 C 455 95, 455 125, 480 125"
                        fill="none"
                        stroke="#334155"
                        strokeWidth="1.2"
                    />

                    {/* --- LEVEL 1: SERVIDOR (CLUSTER) --- */}
                    <g transform="translate(20, 68)">
                        <rect
                            width="95"
                            height="34"
                            rx="7"
                            fill="#0b1324"
                            stroke="#38bdf8"
                            strokeWidth="1.4"
                        />
                        <text
                            x="47.5"
                            y="17"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#f8fafc"
                            fontSize="11"
                            fontWeight="bold"
                        >
                            Servidor
                        </text>
                        <text
                            x="47.5"
                            y="27"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#64748b"
                            fontSize="7.5"
                        >
                            Cluster
                        </text>
                    </g>

                    {/* --- LEVEL 2: CATÀLEGS --- */}
                    {/* Catàleg principal */}
                    <g transform="translate(175, 43)">
                        <rect
                            width="95"
                            height="34"
                            rx="7"
                            fill="#0c1a2e"
                            stroke="#60a5fa"
                            strokeWidth="1.3"
                        />
                        <text
                            x="47.5"
                            y="17"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#e2e8f0"
                            fontSize="11"
                            fontWeight="bold"
                        >
                            Catàleg
                        </text>
                        <text
                            x="47.5"
                            y="27"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#64748b"
                            fontSize="7.5"
                        >
                            Database
                        </text>
                    </g>

                    {/* Catàleg secundari (multi-catàleg) */}
                    <g transform="translate(175, 113)" opacity="0.35">
                        <rect
                            width="95"
                            height="34"
                            rx="7"
                            fill="#090d16"
                            stroke="#334155"
                            strokeWidth="1"
                            strokeDasharray="3 2"
                        />
                        <text
                            x="47.5"
                            y="17"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#94a3b8"
                            fontSize="10"
                        >
                            Catàleg 2
                        </text>
                        <text
                            x="47.5"
                            y="27"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#475569"
                            fontSize="7.5"
                        >
                            Database
                        </text>
                    </g>

                    {/* --- LEVEL 3: ESQUEMES --- */}
                    {/* information_schema */}
                    <g transform="translate(320, 21)">
                        <rect
                            width="110"
                            height="28"
                            rx="6"
                            fill="#090d16"
                            stroke="#334155"
                            strokeWidth="1"
                        />
                        <text
                            x="55"
                            y="14"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#94a3b8"
                            fontSize="8.5"
                            fontStyle="italic"
                        >
                            information_schema
                        </text>
                    </g>

                    {/* Esquema */}
                    <g transform="translate(320, 78)">
                        <rect
                            width="110"
                            height="34"
                            rx="7"
                            fill="#061e14"
                            stroke="#10b981"
                            strokeWidth="1.4"
                        />
                        <text
                            x="55"
                            y="17"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#ecfdf5"
                            fontSize="11"
                            fontWeight="bold"
                        >
                            Esquema
                        </text>
                        <text
                            x="55"
                            y="27"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#34d399"
                            fontSize="7.5"
                        >
                            nom_esquema
                        </text>
                    </g>

                    {/* --- LEVEL 4: OBJECTES --- */}
                    {/* Taules */}
                    <g transform="translate(480, 52)">
                        <rect
                            width="80"
                            height="26"
                            rx="5"
                            fill="#090d16"
                            stroke="#334155"
                            strokeWidth="1"
                        />
                        <text
                            x="40"
                            y="13"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#cbd5e1"
                            fontSize="9.5"
                        >
                            Taules
                        </text>
                    </g>

                    {/* Vistes */}
                    <g transform="translate(480, 82)">
                        <rect
                            width="80"
                            height="26"
                            rx="5"
                            fill="#090d16"
                            stroke="#334155"
                            strokeWidth="1"
                        />
                        <text
                            x="40"
                            y="13"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#cbd5e1"
                            fontSize="9.5"
                        >
                            Vistes
                        </text>
                    </g>

                    {/* Dominis */}
                    <g transform="translate(480, 112)">
                        <rect
                            width="80"
                            height="26"
                            rx="5"
                            fill="#090d16"
                            stroke="#334155"
                            strokeWidth="1"
                        />
                        <text
                            x="40"
                            y="13"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#cbd5e1"
                            fontSize="9.5"
                        >
                            Dominis
                        </text>
                    </g>
                </svg>
            </div>
        </div>
    );
}
