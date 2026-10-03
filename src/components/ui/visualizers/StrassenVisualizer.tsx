"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Play, Pause } from 'lucide-react';

export default function StrassenVisualizer() {
    // 0: Partició inicial
    // 1: P1, P2 (primeres 2 crides)
    // 2: P3, P4 (crides 3 i 4)
    // 3: P5, P6, P7 (crides 5, 6, 7 -> Total 7!)
    // 4: Reconstrucció Z11 = P5 + P4 - P2 + P6
    // 5: Reconstrucció Z12 = P1+P2 i Z21 = P3+P4
    // 6: Reconstrucció Z22 = P1 + P5 - P3 - P7
    // 7: Matriu Z final acoblada
    const [stepIdx, setStepIdx] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const totalSteps = 8;

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
        }, 1700);

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

    const isP1Active = stepIdx >= 1;
    const isP2Active = stepIdx >= 1;
    const isP3Active = stepIdx >= 2;
    const isP4Active = stepIdx >= 2;
    const isP5Active = stepIdx >= 3;
    const isP6Active = stepIdx >= 3;
    const isP7Active = stepIdx >= 3;

    const isZ11Done = stepIdx >= 4;
    const isZ12Done = stepIdx >= 5;
    const isZ21Done = stepIdx >= 5;
    const isZ22Done = stepIdx >= 6;

    const products = [
        { id: 'p1', label: 'P₁ = A(F - H)', active: isP1Active },
        { id: 'p2', label: 'P₂ = (A + B)H', active: isP2Active },
        { id: 'p3', label: 'P₃ = (C + D)E', active: isP3Active },
        { id: 'p4', label: 'P₄ = D(G - E)', active: isP4Active },
        { id: 'p5', label: 'P₅ = (A+D)(E+H)', active: isP5Active },
        { id: 'p6', label: 'P₆ = (B-D)(G+H)', active: isP6Active },
        { id: 'p7', label: 'P₇ = (A-C)(E+F)', active: isP7Active },
    ];

    return (
        <div className="w-full flex flex-col items-center gap-2 my-6 font-mono select-none not-prose px-2 bg-transparent">

            {/* CONTROLS ESTACIONARIS I CENTRATS */}
            <div className="w-full max-w-2xl flex items-center justify-end gap-1 px-1">
                <button
                    type="button"
                    onClick={togglePlay}
                    title={isPlaying ? "Pausar" : "Reproduir"}
                    className={`p-1.5 rounded-lg border transition ${
                        isPlaying
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
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

            {/* DIAGRAMA VECTORIAL PUR EN SVG SENSE SOLAPAMENTS */}
            <div className="w-full max-w-2xl relative">
                <svg
                    className="w-full h-auto select-none"
                    viewBox="0 0 710 240"
                >
                    {/* ===================== MATRIU X (4×4) ===================== */}
                    <g transform="translate(15, 15)">
                        <text x="58" y="10" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">
                            X (4×4)
                        </text>
                        <rect x="0" y="16" width="116" height="116" rx="8" fill="#0f172a" fillOpacity="0.8" stroke="#334155" strokeWidth="1" />

                        {/* Quadrant A */}
                        <rect x="4" y="20" width="52" height="52" rx="4" fill="#0284c7" fillOpacity="0.15" stroke="#38bdf8" strokeWidth="1" />
                        <text x="30" y="35" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">A</text>
                        <text x="30" y="49" textAnchor="middle" fill="#bae6fd" fontSize="9">1  2</text>
                        <text x="30" y="62" textAnchor="middle" fill="#bae6fd" fontSize="9">3  4</text>

                        {/* Quadrant B */}
                        <rect x="60" y="20" width="52" height="52" rx="4" fill="#3b82f6" fillOpacity="0.15" stroke="#60a5fa" strokeWidth="1" />
                        <text x="86" y="35" textAnchor="middle" fill="#60a5fa" fontSize="10" fontWeight="bold">B</text>
                        <text x="86" y="49" textAnchor="middle" fill="#bfdbfe" fontSize="9">0  1</text>
                        <text x="86" y="62" textAnchor="middle" fill="#bfdbfe" fontSize="9">1  0</text>

                        {/* Quadrant C */}
                        <rect x="4" y="76" width="52" height="52" rx="4" fill="#0d9488" fillOpacity="0.15" stroke="#2dd4bf" strokeWidth="1" />
                        <text x="30" y="91" textAnchor="middle" fill="#2dd4bf" fontSize="10" fontWeight="bold">C</text>
                        <text x="30" y="105" textAnchor="middle" fill="#99f6e4" fontSize="9">2  0</text>
                        <text x="30" y="118" textAnchor="middle" fill="#99f6e4" fontSize="9">0  1</text>

                        {/* Quadrant D */}
                        <rect x="60" y="76" width="52" height="52" rx="4" fill="#6366f1" fillOpacity="0.15" stroke="#818cf8" strokeWidth="1" />
                        <text x="86" y="91" textAnchor="middle" fill="#818cf8" fontSize="10" fontWeight="bold">D</text>
                        <text x="86" y="105" textAnchor="middle" fill="#c7d2fe" fontSize="9">1  3</text>
                        <text x="86" y="118" textAnchor="middle" fill="#c7d2fe" fontSize="9">2  1</text>
                    </g>

                    {/* SÍMBOL × */}
                    <text x="144" y="90" textAnchor="middle" fill="#64748b" fontSize="18" fontWeight="bold">×</text>

                    {/* ===================== MATRIU Y (4×4) ===================== */}
                    <g transform="translate(156, 15)">
                        <text x="58" y="10" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">
                            Y (4×4)
                        </text>
                        <rect x="0" y="16" width="116" height="116" rx="8" fill="#0f172a" fillOpacity="0.8" stroke="#334155" strokeWidth="1" />

                        {/* Quadrant E */}
                        <rect x="4" y="20" width="52" height="52" rx="4" fill="#059669" fillOpacity="0.15" stroke="#10b981" strokeWidth="1" />
                        <text x="30" y="35" textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="bold">E</text>
                        <text x="30" y="49" textAnchor="middle" fill="#a7f3d0" fontSize="9">1  0</text>
                        <text x="30" y="62" textAnchor="middle" fill="#a7f3d0" fontSize="9">0  1</text>

                        {/* Quadrant F */}
                        <rect x="60" y="20" width="52" height="52" rx="4" fill="#16a34a" fillOpacity="0.15" stroke="#4ade80" strokeWidth="1" />
                        <text x="86" y="35" textAnchor="middle" fill="#4ade80" fontSize="10" fontWeight="bold">F</text>
                        <text x="86" y="49" textAnchor="middle" fill="#bbf7d0" fontSize="9">2  1</text>
                        <text x="86" y="62" textAnchor="middle" fill="#bbf7d0" fontSize="9">0  1</text>

                        {/* Quadrant G */}
                        <rect x="4" y="76" width="52" height="52" rx="4" fill="#65a30d" fillOpacity="0.15" stroke="#a3e635" strokeWidth="1" />
                        <text x="30" y="91" textAnchor="middle" fill="#a3e635" fontSize="10" fontWeight="bold">G</text>
                        <text x="30" y="105" textAnchor="middle" fill="#d9f99d" fontSize="9">0  1</text>
                        <text x="30" y="118" textAnchor="middle" fill="#d9f99d" fontSize="9">1  0</text>

                        {/* Quadrant H */}
                        <rect x="60" y="76" width="52" height="52" rx="4" fill="#d97706" fillOpacity="0.15" stroke="#fbbf24" strokeWidth="1" />
                        <text x="86" y="91" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">H</text>
                        <text x="86" y="105" textAnchor="middle" fill="#fde68a" fontSize="9">1  1</text>
                        <text x="86" y="118" textAnchor="middle" fill="#fde68a" fontSize="9">0  2</text>
                    </g>

                    {/* ===================== CENTRE: ELS 7 PRODUCTES DE STRASSEN ===================== */}
                    <g transform="translate(285, 15)">
                        <text x="75" y="10" textAnchor="middle" fill="#34d399" fontSize="9.5" fontWeight="bold">
                            7 PRODUCTES (a = 7)
                        </text>

                        {products.map((p, idx) => {
                            const yPos = 17 + idx * 16.5;
                            return (
                                <g key={p.id} transform={`translate(0, ${yPos})`}>
                                    <rect
                                        x="0" y="0" width="150" height="14" rx="3"
                                        fill={p.active ? "#064e3b" : "#0f172a"}
                                        stroke={p.active ? "#10b981" : "#1e293b"}
                                        strokeWidth={p.active ? 1.5 : 1}
                                    />
                                    <text
                                        x="75" y="10.5" textAnchor="middle"
                                        fill={p.active ? "#a7f3d0" : "#475569"}
                                        fontSize="8" fontWeight="bold"
                                    >
                                        {p.label}
                                    </text>
                                </g>
                            );
                        })}
                    </g>

                    {/* ===================== MATRIU RESULTAT Z ===================== */}
                    <g transform="translate(448, 15)">
                        <text x="58" y="10" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">
                            Z (4×4)
                        </text>
                        <rect x="0" y="16" width="116" height="116" rx="8" fill="#0f172a" fillOpacity="0.8" stroke="#334155" strokeWidth="1" />

                        {/* Quadrant Z11 */}
                        <rect
                            x="4" y="20" width="52" height="52" rx="4"
                            fill={isZ11Done ? "#0284c7" : "#0f172a"}
                            fillOpacity={stepIdx === 4 ? 0.4 : isZ11Done ? 0.2 : 0.4}
                            stroke={stepIdx === 4 ? "#38bdf8" : isZ11Done ? "#0284c7" : "#334155"}
                            strokeWidth={stepIdx === 4 ? 2 : 1}
                        />
                        <text x="30" y="35" textAnchor="middle" fill={isZ11Done ? "#38bdf8" : "#475569"} fontSize="10" fontWeight="bold">Z₁₁</text>
                        <text x="30" y="49" textAnchor="middle" fill={isZ11Done ? "#f8fafc" : "#334155"} fontSize="9" fontWeight="bold">
                            {isZ11Done ? "2  2" : "·  ·"}
                        </text>
                        <text x="30" y="62" textAnchor="middle" fill={isZ11Done ? "#f8fafc" : "#334155"} fontSize="9" fontWeight="bold">
                            {isZ11Done ? "3  5" : "·  ·"}
                        </text>

                        {/* Quadrant Z12 */}
                        <rect
                            x="60" y="20" width="52" height="52" rx="4"
                            fill={isZ12Done ? "#16a34a" : "#0f172a"}
                            fillOpacity={stepIdx === 5 ? 0.4 : isZ12Done ? 0.2 : 0.4}
                            stroke={stepIdx === 5 ? "#4ade80" : isZ12Done ? "#16a34a" : "#334155"}
                            strokeWidth={stepIdx === 5 ? 2 : 1}
                        />
                        <text x="86" y="35" textAnchor="middle" fill={isZ12Done ? "#4ade80" : "#475569"} fontSize="10" fontWeight="bold">Z₁₂</text>
                        <text x="86" y="49" textAnchor="middle" fill={isZ12Done ? "#f8fafc" : "#334155"} fontSize="9" fontWeight="bold">
                            {isZ12Done ? "2  5" : "·  ·"}
                        </text>
                        <text x="86" y="62" textAnchor="middle" fill={isZ12Done ? "#f8fafc" : "#334155"} fontSize="9" fontWeight="bold">
                            {isZ12Done ? "7  8" : "·  ·"}
                        </text>

                        {/* Quadrant Z21 */}
                        <rect
                            x="4" y="76" width="52" height="52" rx="4"
                            fill={isZ21Done ? "#0d9488" : "#0f172a"}
                            fillOpacity={stepIdx === 5 ? 0.4 : isZ21Done ? 0.2 : 0.4}
                            stroke={stepIdx === 5 ? "#2dd4bf" : isZ21Done ? "#0d9488" : "#334155"}
                            strokeWidth={stepIdx === 5 ? 2 : 1}
                        />
                        <text x="30" y="91" textAnchor="middle" fill={isZ21Done ? "#2dd4bf" : "#475569"} fontSize="10" fontWeight="bold">Z₂₁</text>
                        <text x="30" y="105" textAnchor="middle" fill={isZ21Done ? "#f8fafc" : "#334155"} fontSize="9" fontWeight="bold">
                            {isZ21Done ? "5  1" : "·  ·"}
                        </text>
                        <text x="30" y="118" textAnchor="middle" fill={isZ21Done ? "#f8fafc" : "#334155"} fontSize="9" fontWeight="bold">
                            {isZ21Done ? "1  3" : "·  ·"}
                        </text>

                        {/* Quadrant Z22 */}
                        <rect
                            x="60" y="76" width="52" height="52" rx="4"
                            fill={isZ22Done ? "#d97706" : "#0f172a"}
                            fillOpacity={stepIdx === 6 ? 0.4 : isZ22Done ? 0.2 : 0.4}
                            stroke={stepIdx === 6 ? "#fbbf24" : isZ22Done ? "#d97706" : "#334155"}
                            strokeWidth={stepIdx === 6 ? 2 : 1}
                        />
                        <text x="86" y="91" textAnchor="middle" fill={isZ22Done ? "#fbbf24" : "#475569"} fontSize="10" fontWeight="bold">Z₂₂</text>
                        <text x="86" y="105" textAnchor="middle" fill={isZ22Done ? "#f8fafc" : "#334155"} fontSize="9" fontWeight="bold">
                            {isZ22Done ? "5  9" : "·  ·"}
                        </text>
                        <text x="86" y="118" textAnchor="middle" fill={isZ22Done ? "#f8fafc" : "#334155"} fontSize="9" fontWeight="bold">
                            {isZ22Done ? "2  5" : "·  ·"}
                        </text>
                    </g>

                    {/* ===================== PANELL DE DETALL DEL PAS ACTUAL ===================== */}
                    <g transform="translate(576, 25)">
                        <rect x="0" y="0" width="122" height="122" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1" />

                        {stepIdx === 0 && (
                            <>
                                <text x="61" y="22" textAnchor="middle" fill="#94a3b8" fontSize="9.5" fontWeight="bold">Inici Strassen</text>
                                <text x="61" y="46" textAnchor="middle" fill="#64748b" fontSize="8.5">Estalvi:</text>
                                <text x="61" y="64" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="bold">7 productes</text>
                                <text x="61" y="80" textAnchor="middle" fill="#64748b" fontSize="8.5">en comptes de 8</text>
                                <text x="61" y="104" textAnchor="middle" fill="#38bdf8" fontSize="8.5">Premeu [▶]</text>
                            </>
                        )}

                        {stepIdx === 1 && (
                            <>
                                <text x="61" y="20" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="bold">Pas 1: P₁, P₂</text>
                                <text x="61" y="40" textAnchor="middle" fill="#6ee7b7" fontSize="8">P₁ = A(F - H)</text>
                                <text x="61" y="56" textAnchor="middle" fill="#6ee7b7" fontSize="8">P₂ = (A + B)H</text>
                                <text x="61" y="80" textAnchor="middle" fill="#64748b" fontSize="8">2 crides</text>
                                <text x="61" y="96" textAnchor="middle" fill="#10b981" fontSize="8.5" fontWeight="bold">T(n/2) actives</text>
                            </>
                        )}

                        {stepIdx === 2 && (
                            <>
                                <text x="61" y="20" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="bold">Pas 2: P₃, P₄</text>
                                <text x="61" y="40" textAnchor="middle" fill="#6ee7b7" fontSize="8">P₃ = (C + D)E</text>
                                <text x="61" y="56" textAnchor="middle" fill="#6ee7b7" fontSize="8">P₄ = D(G - E)</text>
                                <text x="61" y="80" textAnchor="middle" fill="#64748b" fontSize="8">Portem 4 de 7</text>
                                <text x="61" y="96" textAnchor="middle" fill="#10b981" fontSize="8.5" fontWeight="bold">crides recursives</text>
                            </>
                        )}

                        {stepIdx === 3 && (
                            <>
                                <text x="61" y="18" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="bold">Pas 3: P₅,P₆,P₇</text>
                                <text x="61" y="34" textAnchor="middle" fill="#a7f3d0" fontSize="7.5">P₅=(A+D)(E+H)</text>
                                <text x="61" y="48" textAnchor="middle" fill="#a7f3d0" fontSize="7.5">P₆=(B-D)(G+H)</text>
                                <text x="61" y="62" textAnchor="middle" fill="#a7f3d0" fontSize="7.5">P₇=(A-C)(E+F)</text>
                                <text x="61" y="84" textAnchor="middle" fill="#fbbf24" fontSize="8.5" fontWeight="bold">Total: 7 crides</text>
                                <text x="61" y="100" textAnchor="middle" fill="#34d399" fontSize="8">estalvi aconseguit</text>
                            </>
                        )}

                        {stepIdx === 4 && (
                            <>
                                <text x="61" y="20" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold">Pas 4: Z₁₁</text>
                                <text x="61" y="40" textAnchor="middle" fill="#bae6fd" fontSize="8">P₅+P₄-P₂+P₆</text>
                                <text x="61" y="60" textAnchor="middle" fill="#64748b" fontSize="8">= AE + BG</text>
                                <text x="61" y="80" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="bold">[2 2; 3 5]</text>
                                <text x="61" y="100" textAnchor="middle" fill="#38bdf8" fontSize="8">Suma: Θ(n²)</text>
                            </>
                        )}

                        {stepIdx === 5 && (
                            <>
                                <text x="61" y="20" textAnchor="middle" fill="#4ade80" fontSize="9" fontWeight="bold">Pas 5: Z₁₂, Z₂₁</text>
                                <text x="61" y="40" textAnchor="middle" fill="#bbf7d0" fontSize="7.5">Z₁₂ = P₁ + P₂</text>
                                <text x="61" y="55" textAnchor="middle" fill="#f8fafc" fontSize="8.5" fontWeight="bold">= [2 5; 7 8]</text>
                                <text x="61" y="75" textAnchor="middle" fill="#99f6e4" fontSize="7.5">Z₂₁ = P₃ + P₄</text>
                                <text x="61" y="90" textAnchor="middle" fill="#f8fafc" fontSize="8.5" fontWeight="bold">= [5 1; 1 3]</text>
                            </>
                        )}

                        {stepIdx === 6 && (
                            <>
                                <text x="61" y="20" textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="bold">Pas 6: Z₂₂</text>
                                <text x="61" y="40" textAnchor="middle" fill="#fde68a" fontSize="7.5">P₁+P₅-P₃-P₇</text>
                                <text x="61" y="60" textAnchor="middle" fill="#64748b" fontSize="8">= CF + DH</text>
                                <text x="61" y="80" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="bold">[5 9; 2 5]</text>
                                <text x="61" y="100" textAnchor="middle" fill="#fbbf24" fontSize="8">Reconstrucció feta</text>
                            </>
                        )}

                        {stepIdx === 7 && (
                            <>
                                <text x="61" y="20" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="bold">Pas 7: Final</text>
                                <text x="61" y="40" textAnchor="middle" fill="#64748b" fontSize="8">Matriu Z idèntica</text>
                                <text x="61" y="60" textAnchor="middle" fill="#34d399" fontSize="8.5" fontWeight="bold">amb només a=7</text>
                                <text x="61" y="80" textAnchor="middle" fill="#64748b" fontSize="8">Subcúbic:</text>
                                <text x="61" y="100" textAnchor="middle" fill="#10b981" fontSize="8.5" fontWeight="bold">Θ(n^2.807)</text>
                            </>
                        )}
                    </g>

                    {/* ===================== RESUM INFERIOR CLAR I ESPAIÓS ===================== */}
                    <g transform="translate(15, 172)">
                        <text x="0" y="14" fill="#64748b" fontSize="10" fontWeight="bold">
                            Crides recursives de Strassen (a = 7):
                        </text>
                        {products.map((p, idx) => {
                            const xPos = 240 + idx * 64;
                            return (
                                <g key={p.id} transform={`translate(${xPos}, 0)`}>
                                    <rect
                                        x="0" y="0" width="58" height="22" rx="4"
                                        fill={p.active ? "#064e3b" : "#0f172a"}
                                        fillOpacity={p.active ? 0.35 : 0.6}
                                        stroke={p.active ? "#10b981" : "#334155"}
                                        strokeWidth={p.active ? 1.5 : 1}
                                    />
                                    <text
                                        x="29" y="15" textAnchor="middle"
                                        fill={p.active ? "#6ee7b7" : "#475569"}
                                        fontSize="9.5" fontWeight="bold"
                                    >
                                        {`P${idx + 1}`}
                                    </text>
                                </g>
                            );
                        })}
                    </g>

                    {/* LÍNIA ASIMPTÒTICA INFERIOR */}
                    <g transform="translate(15, 224)">
                        <text x="0" y="0" fill="#64748b" fontSize="11">
                            7 subproblemes recursius de mida n/2
                        </text>
                        <text x="680" y="0" textAnchor="end" fill="#10b981" fontSize="11" fontWeight="bold">
                            T(n) = 7T(n/2) + Θ(n²) → Θ(n^2.807)
                        </text>
                    </g>
                </svg>
            </div>

        </div>
    );
}
