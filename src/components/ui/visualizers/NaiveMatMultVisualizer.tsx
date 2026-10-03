"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Play, Pause } from 'lucide-react';

export default function NaiveMatMultVisualizer() {
    // 0: Partició inicial
    // 1: P1 = AE (1a crida per Z11)
    // 2: P2 = BG (2a crida per Z11)
    // 3: Z11 = AE + BG (Suma no recursiva)
    // 4: Z12 = AF + BH (Crides 3 i 4 + suma)
    // 5: Z21 = CE + DG (Crides 5 i 6 + suma)
    // 6: Z22 = CF + DH (Crides 7 i 8 + suma)
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

    // Activitat per blocs
    const isAActive = stepIdx === 1 || stepIdx === 4;
    const isEActive = stepIdx === 1 || stepIdx === 5;
    const isBActive = stepIdx === 2 || stepIdx === 4;
    const isGActive = stepIdx === 2 || stepIdx === 5;
    const isFActive = stepIdx === 4 || stepIdx === 6;
    const isHActive = stepIdx === 4 || stepIdx === 6;
    const isCActive = stepIdx === 5 || stepIdx === 6;
    const isDActive = stepIdx === 5 || stepIdx === 6;

    const isZ11Done = stepIdx >= 3;
    const isZ12Done = stepIdx >= 4;
    const isZ21Done = stepIdx >= 5;
    const isZ22Done = stepIdx >= 6;

    const pills = [
        { id: 'ae', label: 'P₁=AE', active: stepIdx >= 1 },
        { id: 'bg', label: 'P₂=BG', active: stepIdx >= 2 },
        { id: 'af', label: 'P₃=AF', active: stepIdx >= 4 },
        { id: 'bh', label: 'P₄=BH', active: stepIdx >= 4 },
        { id: 'ce', label: 'P₅=CE', active: stepIdx >= 5 },
        { id: 'dg', label: 'P₆=DG', active: stepIdx >= 5 },
        { id: 'cf', label: 'P₇=CF', active: stepIdx >= 6 },
        { id: 'dh', label: 'P₈=DH', active: stepIdx >= 6 },
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

            {/* EQUACIÓ MATRICIAL EN SVG SENSE SOLAPAMENT */}
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
                        <rect
                            x="4" y="20" width="52" height="52" rx="4"
                            fill="#0284c7"
                            fillOpacity={isAActive ? 0.35 : 0.12}
                            stroke={isAActive ? "#38bdf8" : "#0284c7"}
                            strokeWidth={isAActive ? 2 : 1}
                        />
                        <text x="30" y="35" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">A</text>
                        <text x="30" y="49" textAnchor="middle" fill="#bae6fd" fontSize="9">1  2</text>
                        <text x="30" y="62" textAnchor="middle" fill="#bae6fd" fontSize="9">3  4</text>

                        {/* Quadrant B */}
                        <rect
                            x="60" y="20" width="52" height="52" rx="4"
                            fill="#3b82f6"
                            fillOpacity={isBActive ? 0.35 : 0.12}
                            stroke={isBActive ? "#60a5fa" : "#3b82f6"}
                            strokeWidth={isBActive ? 2 : 1}
                        />
                        <text x="86" y="35" textAnchor="middle" fill="#60a5fa" fontSize="10" fontWeight="bold">B</text>
                        <text x="86" y="49" textAnchor="middle" fill="#bfdbfe" fontSize="9">0  1</text>
                        <text x="86" y="62" textAnchor="middle" fill="#bfdbfe" fontSize="9">1  0</text>

                        {/* Quadrant C */}
                        <rect
                            x="4" y="76" width="52" height="52" rx="4"
                            fill="#0d9488"
                            fillOpacity={isCActive ? 0.35 : 0.12}
                            stroke={isCActive ? "#2dd4bf" : "#0d9488"}
                            strokeWidth={isCActive ? 2 : 1}
                        />
                        <text x="30" y="91" textAnchor="middle" fill="#2dd4bf" fontSize="10" fontWeight="bold">C</text>
                        <text x="30" y="105" textAnchor="middle" fill="#99f6e4" fontSize="9">2  0</text>
                        <text x="30" y="118" textAnchor="middle" fill="#99f6e4" fontSize="9">0  1</text>

                        {/* Quadrant D */}
                        <rect
                            x="60" y="76" width="52" height="52" rx="4"
                            fill="#6366f1"
                            fillOpacity={isDActive ? 0.35 : 0.12}
                            stroke={isDActive ? "#818cf8" : "#6366f1"}
                            strokeWidth={isDActive ? 2 : 1}
                        />
                        <text x="86" y="91" textAnchor="middle" fill="#818cf8" fontSize="10" fontWeight="bold">D</text>
                        <text x="86" y="105" textAnchor="middle" fill="#c7d2fe" fontSize="9">1  3</text>
                        <text x="86" y="118" textAnchor="middle" fill="#c7d2fe" fontSize="9">2  1</text>
                    </g>

                    {/* SÍMBOL PRODUCTE × */}
                    <text x="146" y="90" textAnchor="middle" fill="#64748b" fontSize="18" fontWeight="bold">×</text>

                    {/* ===================== MATRIU Y (4×4) ===================== */}
                    <g transform="translate(160, 15)">
                        <text x="58" y="10" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">
                            Y (4×4)
                        </text>
                        <rect x="0" y="16" width="116" height="116" rx="8" fill="#0f172a" fillOpacity="0.8" stroke="#334155" strokeWidth="1" />

                        {/* Quadrant E */}
                        <rect
                            x="4" y="20" width="52" height="52" rx="4"
                            fill="#059669"
                            fillOpacity={isEActive ? 0.35 : 0.12}
                            stroke={isEActive ? "#10b981" : "#059669"}
                            strokeWidth={isEActive ? 2 : 1}
                        />
                        <text x="30" y="35" textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="bold">E</text>
                        <text x="30" y="49" textAnchor="middle" fill="#a7f3d0" fontSize="9">1  0</text>
                        <text x="30" y="62" textAnchor="middle" fill="#a7f3d0" fontSize="9">0  1</text>

                        {/* Quadrant F */}
                        <rect
                            x="60" y="20" width="52" height="52" rx="4"
                            fill="#16a34a"
                            fillOpacity={isFActive ? 0.35 : 0.12}
                            stroke={isFActive ? "#4ade80" : "#16a34a"}
                            strokeWidth={isFActive ? 2 : 1}
                        />
                        <text x="86" y="35" textAnchor="middle" fill="#4ade80" fontSize="10" fontWeight="bold">F</text>
                        <text x="86" y="49" textAnchor="middle" fill="#bbf7d0" fontSize="9">2  1</text>
                        <text x="86" y="62" textAnchor="middle" fill="#bbf7d0" fontSize="9">0  1</text>

                        {/* Quadrant G */}
                        <rect
                            x="4" y="76" width="52" height="52" rx="4"
                            fill="#65a30d"
                            fillOpacity={isGActive ? 0.35 : 0.12}
                            stroke={isGActive ? "#a3e635" : "#65a30d"}
                            strokeWidth={isGActive ? 2 : 1}
                        />
                        <text x="30" y="91" textAnchor="middle" fill="#a3e635" fontSize="10" fontWeight="bold">G</text>
                        <text x="30" y="105" textAnchor="middle" fill="#d9f99d" fontSize="9">0  1</text>
                        <text x="30" y="118" textAnchor="middle" fill="#d9f99d" fontSize="9">1  0</text>

                        {/* Quadrant H */}
                        <rect
                            x="60" y="76" width="52" height="52" rx="4"
                            fill="#d97706"
                            fillOpacity={isHActive ? 0.35 : 0.12}
                            stroke={isHActive ? "#fbbf24" : "#d97706"}
                            strokeWidth={isHActive ? 2 : 1}
                        />
                        <text x="86" y="91" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">H</text>
                        <text x="86" y="105" textAnchor="middle" fill="#fde68a" fontSize="9">1  1</text>
                        <text x="86" y="118" textAnchor="middle" fill="#fde68a" fontSize="9">0  2</text>
                    </g>

                    {/* SÍMBOL IGUAL = */}
                    <text x="291" y="90" textAnchor="middle" fill="#64748b" fontSize="18" fontWeight="bold">=</text>

                    {/* ===================== MATRIU RESULTAT Z (4×4) ===================== */}
                    <g transform="translate(305, 15)">
                        <text x="58" y="10" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">
                            Z (4×4)
                        </text>
                        <rect x="0" y="16" width="116" height="116" rx="8" fill="#0f172a" fillOpacity="0.8" stroke="#334155" strokeWidth="1" />

                        {/* Quadrant Z11 */}
                        <rect
                            x="4" y="20" width="52" height="52" rx="4"
                            fill={isZ11Done ? "#0284c7" : "#0f172a"}
                            fillOpacity={stepIdx === 3 ? 0.4 : isZ11Done ? 0.2 : 0.4}
                            stroke={stepIdx === 3 ? "#38bdf8" : isZ11Done ? "#0284c7" : "#334155"}
                            strokeWidth={stepIdx === 3 ? 2 : 1}
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
                            fillOpacity={stepIdx === 4 ? 0.4 : isZ12Done ? 0.2 : 0.4}
                            stroke={stepIdx === 4 ? "#4ade80" : isZ12Done ? "#16a34a" : "#334155"}
                            strokeWidth={stepIdx === 4 ? 2 : 1}
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

                    {/* ===================== DETALL DEL PAS ACTUAL (AMPLI I CLAR) ===================== */}
                    <g transform="translate(440, 25)">
                        <rect x="0" y="0" width="255" height="122" rx="8" fill="#0f172a" fillOpacity="0.8" stroke="#334155" strokeWidth="1" />

                        {stepIdx === 0 && (
                            <>
                                <text x="127" y="24" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">Estat inicial: Partició en 4 blocs</text>
                                <text x="127" y="48" textAnchor="middle" fill="#94a3b8" fontSize="10">X i Y tenen mida 4×4 (n = 4)</text>
                                <text x="127" y="70" textAnchor="middle" fill="#38bdf8" fontSize="10">Cada submatriu té mida 2×2 (n/2 = 2)</text>
                                <text x="127" y="96" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="bold">8 productes recursius a calcular</text>
                            </>
                        )}

                        {stepIdx === 1 && (
                            <>
                                <text x="127" y="24" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">Pas 1: 1a crida recursiva (AE)</text>
                                <text x="127" y="48" textAnchor="middle" fill="#94a3b8" fontSize="10">P₁ = A · E</text>
                                <text x="127" y="70" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">[1 2; 3 4] · [1 0; 0 1] = [1 2; 3 4]</text>
                                <text x="127" y="98" textAnchor="middle" fill="#f59e0b" fontSize="10">Crida recursiva 1 de 8 (cost T(n/2))</text>
                            </>
                        )}

                        {stepIdx === 2 && (
                            <>
                                <text x="127" y="24" textAnchor="middle" fill="#60a5fa" fontSize="11" fontWeight="bold">Pas 2: 2a crida recursiva (BG)</text>
                                <text x="127" y="48" textAnchor="middle" fill="#94a3b8" fontSize="10">P₂ = B · G</text>
                                <text x="127" y="70" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">[0 1; 1 0] · [0 1; 1 0] = [1 0; 0 1]</text>
                                <text x="127" y="98" textAnchor="middle" fill="#f59e0b" fontSize="10">Crida recursiva 2 de 8 (cost T(n/2))</text>
                            </>
                        )}

                        {stepIdx === 3 && (
                            <>
                                <text x="127" y="24" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">Pas 3: Suma matricial de Z₁₁</text>
                                <text x="127" y="48" textAnchor="middle" fill="#94a3b8" fontSize="10">Z₁₁ = P₁ + P₂ = AE + BG</text>
                                <text x="127" y="70" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">[1 2; 3 4] + [1 0; 0 1] = [2 2; 3 5]</text>
                                <text x="127" y="98" textAnchor="middle" fill="#38bdf8" fontSize="10">Suma de mida 2×2 → Cost Θ(n²)</text>
                            </>
                        )}

                        {stepIdx === 4 && (
                            <>
                                <text x="127" y="24" textAnchor="middle" fill="#4ade80" fontSize="11" fontWeight="bold">Pas 4: Quadrant Z₁₂ (P₃ + P₄)</text>
                                <text x="127" y="46" textAnchor="middle" fill="#94a3b8" fontSize="9.5">P₃ = AF = [2 3; 6 7],  P₄ = BH = [0 2; 1 1]</text>
                                <text x="127" y="70" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">Z₁₂ = AF + BH = [2 5; 7 8]</text>
                                <text x="127" y="98" textAnchor="middle" fill="#f59e0b" fontSize="10">+2 crides recursives (P₃, P₄)</text>
                            </>
                        )}

                        {stepIdx === 5 && (
                            <>
                                <text x="127" y="24" textAnchor="middle" fill="#2dd4bf" fontSize="11" fontWeight="bold">Pas 5: Quadrant Z₂₁ (P₅ + P₆)</text>
                                <text x="127" y="46" textAnchor="middle" fill="#94a3b8" fontSize="9.5">P₅ = CE = [2 0; 0 1],  P₆ = DG = [3 1; 1 2]</text>
                                <text x="127" y="70" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">Z₂₁ = CE + DG = [5 1; 1 3]</text>
                                <text x="127" y="98" textAnchor="middle" fill="#f59e0b" fontSize="10">+2 crides recursives (P₅, P₆)</text>
                            </>
                        )}

                        {stepIdx === 6 && (
                            <>
                                <text x="127" y="24" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="bold">Pas 6: Quadrant Z₂₂ (P₇ + P₈)</text>
                                <text x="127" y="46" textAnchor="middle" fill="#94a3b8" fontSize="9.5">P₇ = CF = [4 2; 0 1],  P₈ = DH = [1 7; 2 4]</text>
                                <text x="127" y="70" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">Z₂₂ = CF + DH = [5 9; 2 5]</text>
                                <text x="127" y="98" textAnchor="middle" fill="#fbbf24" fontSize="10">Últimes 2 crides recursives (P₇, P₈)</text>
                            </>
                        )}

                        {stepIdx === 7 && (
                            <>
                                <text x="127" y="24" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="bold">Pas 7: Matriu Z completada</text>
                                <text x="127" y="48" textAnchor="middle" fill="#94a3b8" fontSize="10">8 productes recursius realitzats</text>
                                <text x="127" y="70" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">4 sumes de submatrius (Θ(n²))</text>
                                <text x="127" y="98" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="bold">Complexitat: T(n) ∈ Θ(n³)</text>
                            </>
                        )}
                    </g>

                    {/* ===================== COMPTADOR DELS 8 PRODUCTES SENSE SOLAPAMENT ===================== */}
                    <g transform="translate(15, 172)">
                        <text x="0" y="14" fill="#64748b" fontSize="10" fontWeight="bold">
                            Crides recursives (a = 8):
                        </text>
                        {pills.map((pill, idx) => {
                            const xPos = 180 + idx * 64;
                            return (
                                <g key={pill.id} transform={`translate(${xPos}, 0)`}>
                                    <rect
                                        x="0" y="0" width="58" height="22" rx="4"
                                        fill={pill.active ? "#f59e0b" : "#0f172a"}
                                        fillOpacity={pill.active ? 0.25 : 0.6}
                                        stroke={pill.active ? "#f59e0b" : "#334155"}
                                        strokeWidth={pill.active ? 1.5 : 1}
                                    />
                                    <text
                                        x="29" y="15" textAnchor="middle"
                                        fill={pill.active ? "#fbbf24" : "#475569"}
                                        fontSize="9.5" fontWeight="bold"
                                    >
                                        {pill.label}
                                    </text>
                                </g>
                            );
                        })}
                    </g>

                    {/* LÍNIA ASIMPTÒTICA INFERIOR */}
                    <g transform="translate(15, 224)">
                        <text x="0" y="0" fill="#64748b" fontSize="11">
                            8 subproblemes recursius de mida n/2
                        </text>
                        <text x="680" y="0" textAnchor="end" fill="#f59e0b" fontSize="11" fontWeight="bold">
                            T(n) = 8T(n/2) + Θ(n²) → Θ(n³)
                        </text>
                    </g>
                </svg>
            </div>

        </div>
    );
}
