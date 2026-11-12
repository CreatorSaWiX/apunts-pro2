"use client";

import { useState } from "react";

type IterId = 1 | 2;
type SubStep = 0 | 1 | 2 | 3;

interface RowRecord {
    dni: string;
    nom: string;
    pref: string;
}

const INPUT_ROWS: Record<IterId, RowRecord> = {
    1: { dni: "111A", nom: "ANNA", pref: "N" },
    2: { dni: "222B", nom: "MARC", pref: "N" },
};

// Coordenades exactes (168px d'alçada total a esquerra i dreta)
const ROW_H_LEFT = 36;
const GAP_LEFT = 8;
const getYLeft = (idx: number) => idx * (ROW_H_LEFT + GAP_LEFT) + ROW_H_LEFT / 2;

const Y_REG = 42;
const Y_OUT_ROW: Record<IterId, number> = {
    1: 104,
    2: 142,
};

const CODE_STEPS: { idx: SubStep; label: string; tag?: string }[] = [
    { idx: 0, label: "FOR reg IN SELECT" },
    { idx: 1, label: "reg.pref := 'P'" },
    { idx: 2, label: "RETURN NEXT reg", tag: "+1" },
    { idx: 3, label: "RETURN;", tag: "fi" },
];

export default function SetofVisualizer() {
    const [iter, setIter] = useState<IterId>(2);
    const [subStep, setSubStep] = useState<SubStep>(3);

    const activeRecord = INPUT_ROWS[iter];
    const isFinished = subStep === 3;
    const isRegLoaded = subStep < 3;
    const isPrefMutated = subStep >= 1 && subStep < 3;

    const row1Visible = subStep === 3 || iter === 2 || subStep >= 2;
    const row2Visible = subStep === 3 || (iter === 2 && subStep >= 2);
    const row1IsNew = iter === 1 && subStep === 2;
    const row2IsNew = iter === 2 && subStep === 2;

    const getStatusInfo = (): { text: string; tone: string } => {
        if (subStep === 0) {
            return {
                text: `FOR · carrega fila ${iter} ('${activeRecord.nom}', pref = 'N') a reg`,
                tone: "bg-sky-500/10 border-sky-500/30 text-sky-300",
            };
        }
        if (subStep === 1) {
            return {
                text: `reg.pref := 'P' · actualitza el camp dins Tdades_client`,
                tone: "bg-amber-500/10 border-amber-500/30 text-amber-300",
            };
        }
        if (subStep === 2) {
            return {
                text: `RETURN NEXT · afegeix fila ${iter} al resultat sense sortir del bucle`,
                tone: "bg-sky-500/10 border-sky-500/30 text-sky-300",
            };
        }
        return {
            text: `RETURN; · finalitza la funció i entrega les 2 files de SETOF`,
            tone: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
        };
    };

    const status = getStatusInfo();

    const renderArrowEdges = () => {
        if (subStep === 0) {
            const y1 = getYLeft(0);
            return (
                <path
                    d={`M 0,${y1} C 26,${y1} 26,${Y_REG} 49,${Y_REG}`}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.8"
                    markerEnd="url(#setof-arrow-sky)"
                />
            );
        }
        if (subStep === 1) {
            const y1 = getYLeft(1);
            return (
                <g>
                    <path
                        d={`M 0,${y1} C 26,${y1} 26,${Y_REG} 49,${Y_REG}`}
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="1.8"
                        markerEnd="url(#setof-arrow-amber)"
                    />
                    <g transform={`translate(26, ${(y1 + Y_REG) / 2})`}>
                        <rect x="-13" y="-8" width="26" height="16" rx="4" fill="#020617" stroke="#f59e0b" strokeWidth="1" />
                        <text textAnchor="middle" dominantBaseline="middle" y="0.5" fill="#f59e0b" fontSize="8.5" fontWeight="bold">
                            .pref
                        </text>
                    </g>
                </g>
            );
        }
        if (subStep === 2) {
            const y1 = getYLeft(2);
            const y2 = Y_OUT_ROW[iter];
            return (
                <g>
                    <path
                        d={`M 0,${y1} C 26,${y1} 26,${y2} 49,${y2}`}
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="1.8"
                        markerEnd="url(#setof-arrow-sky)"
                    />
                    <g transform={`translate(26, ${(y1 + y2) / 2})`}>
                        <rect x="-10" y="-8" width="20" height="16" rx="4" fill="#020617" stroke="#38bdf8" strokeWidth="1" />
                        <text textAnchor="middle" dominantBaseline="middle" y="0.5" fill="#38bdf8" fontSize="9" fontWeight="bold">
                            +1
                        </text>
                    </g>
                </g>
            );
        }

        const y1 = getYLeft(3);
        return (
            <g>
                <path
                    d={`M 0,${y1} C 26,${y1} 26,${Y_OUT_ROW[1]} 49,${Y_OUT_ROW[1]}`}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1.7"
                    markerEnd="url(#setof-arrow-emerald)"
                />
                <path
                    d={`M 0,${y1} C 26,${y1} 26,${Y_OUT_ROW[2]} 49,${Y_OUT_ROW[2]}`}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1.7"
                    markerEnd="url(#setof-arrow-emerald)"
                />
            </g>
        );
    };

    const presets: { label: string; active: boolean; activeCls: string; onClick: () => void }[] = [
        {
            label: "1 · ANNA",
            active: iter === 1 && subStep < 3,
            activeCls: "bg-sky-500/15 border-sky-400 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.2)] font-semibold",
            onClick: () => {
                setIter(1);
                setSubStep(2);
            },
        },
        {
            label: "2 · MARC",
            active: iter === 2 && subStep < 3,
            activeCls: "bg-sky-500/15 border-sky-400 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.2)] font-semibold",
            onClick: () => {
                setIter(2);
                setSubStep(2);
            },
        },
        {
            label: "RETURN; (Final)",
            active: subStep === 3,
            activeCls: "bg-emerald-500/15 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)] font-semibold",
            onClick: () => {
                setIter(2);
                setSubStep(3);
            },
        },
    ];

    const renderOutputRow = (rowIdx: IterId, visible: boolean, isNew: boolean) => {
        const record = INPUT_ROWS[rowIdx];
        if (!visible) {
            return (
                <div className="h-8 px-2.5 rounded-lg border border-dashed border-white/10 bg-slate-900/20 flex items-center justify-center text-[10px] text-slate-600">
                    pendent
                </div>
            );
        }
        return (
            <div
                className={`h-8 px-2.5 rounded-lg border grid grid-cols-[44px_1fr_28px] items-center text-[11px] transition-all duration-200 ${
                    isFinished
                        ? "bg-emerald-500/15 border-emerald-400/70 text-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.18)]"
                        : isNew
                        ? "bg-sky-500/15 border-sky-400/70 text-sky-200 shadow-[0_0_10px_rgba(56,189,248,0.18)]"
                        : "bg-slate-900/50 border-white/15 text-slate-300"
                }`}
            >
                <span className="text-slate-400 text-[10px]">{record.dni}</span>
                <span className="font-semibold truncate">{record.nom}</span>
                <span className="text-right font-bold text-emerald-300">P</span>
            </div>
        );
    };

    return (
        <div className="w-full max-w-xl mx-auto my-6 not-prose select-none font-mono text-xs">
            {/* Selector minimalista d'iteracions i retorn final */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pb-4">
                {presets.map((p) => (
                    <button
                        key={p.label}
                        type="button"
                        onClick={p.onClick}
                        className={`px-2.5 py-1 rounded-md border text-[11px] transition-all duration-150 cursor-pointer ${
                            p.active
                                ? p.activeCls
                                : "bg-slate-900/30 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10"
                        }`}
                    >
                        {p.label}
                    </button>
                ))}
            </div>

            {/* Capçaleres */}
            <div
                className="grid items-center text-[10px] text-slate-500 font-semibold tracking-wider pb-2"
                style={{ gridTemplateColumns: "1fr 52px 1.15fr" }}
            >
                <span>PL/pgSQL · BUCLE</span>
                <span />
                <div className="flex items-center justify-between">
                    <span>Tdades_client</span>
                    <span className="text-slate-600">ciutat = &apos;BCN&apos;</span>
                </div>
            </div>

            {/* Cos principal: passos del codi + SVG + registre i resultat SETOF */}
            <div
                className="relative grid items-center"
                style={{ gridTemplateColumns: "1fr 52px 1.15fr" }}
            >
                {/* Columna esquerra: línies del bucle */}
                <div className="flex flex-col gap-2">
                    {CODE_STEPS.map((step) => {
                        const isActive = subStep === step.idx;
                        const isExecuted = step.idx < subStep;
                        const isDimmed = step.idx > subStep;

                        const activeStyle =
                            step.idx === 3
                                ? "bg-emerald-500/15 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                                : step.idx === 1
                                ? "bg-amber-500/15 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                                : "bg-sky-500/15 border-sky-400 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.2)]";

                        return (
                            <button
                                key={step.idx}
                                type="button"
                                onMouseEnter={() => {
                                    if (step.idx === 3) setIter(2);
                                    setSubStep(step.idx);
                                }}
                                onClick={() => {
                                    if (step.idx === 3) setIter(2);
                                    setSubStep(step.idx);
                                }}
                                className={`h-9 px-2.5 rounded-lg border text-left transition-all duration-150 cursor-pointer flex items-center justify-between gap-1 ${
                                    isActive
                                        ? activeStyle
                                        : isExecuted
                                        ? "bg-slate-900/50 border-white/10 text-slate-300 hover:border-slate-600"
                                        : isDimmed
                                        ? "bg-slate-900/20 border-white/5 text-slate-600 opacity-35 hover:opacity-70"
                                        : "bg-slate-900/40 border-white/10 text-slate-300"
                                }`}
                            >
                                <span className="truncate text-[10.5px] sm:text-[11px]">{step.label}</span>
                                {step.tag && (
                                    <span className="text-[10px] font-bold opacity-80 shrink-0">
                                        {step.tag}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Connexions SVG alineades al píxel */}
                <svg
                    viewBox="0 0 52 168"
                    className="w-full h-[168px] pointer-events-none overflow-visible"
                >
                    <defs>
                        {[
                            { id: "setof-arrow-sky", color: "#38bdf8" },
                            { id: "setof-arrow-amber", color: "#f59e0b" },
                            { id: "setof-arrow-emerald", color: "#10b981" },
                        ].map((m) => (
                            <marker
                                key={m.id}
                                id={m.id}
                                viewBox="0 0 6 6"
                                refX="4.5"
                                refY="3"
                                markerWidth="4.5"
                                markerHeight="4.5"
                                orient="auto"
                            >
                                <path d="M 0 0 L 6 3 L 0 6 z" fill={m.color} />
                            </marker>
                        ))}
                    </defs>
                    {renderArrowEdges()}
                </svg>

                {/* Columna dreta: registre temporal `reg` + sortida acumulada `SETOF` */}
                <div className="h-[168px] py-[10px] flex flex-col justify-between">
                    {/* Zona 1: variable composta `reg` */}
                    <div>
                        <div className="h-[14px] leading-[14px] text-[9.5px] text-slate-500 flex justify-between px-0.5">
                            <span>reg (fila actual)</span>
                            <span className="text-slate-600">dni · nom · pref</span>
                        </div>
                        <div
                            className={`h-9 px-2.5 rounded-lg border grid grid-cols-[44px_1fr_38px] items-center text-[11px] transition-all duration-200 ${
                                !isRegLoaded
                                    ? "bg-slate-900/20 border-white/5 text-slate-600 opacity-45"
                                    : isPrefMutated
                                    ? "bg-amber-500/10 border-amber-400/60 text-slate-200"
                                    : "bg-sky-500/10 border-sky-400/60 text-sky-200"
                            }`}
                        >
                            {isRegLoaded ? (
                                <>
                                    <span className="text-slate-400 text-[10px]">{activeRecord.dni}</span>
                                    <span className="font-semibold truncate">{activeRecord.nom}</span>
                                    <span
                                        className={`text-right font-bold ${
                                            isPrefMutated ? "text-amber-300" : "text-sky-300"
                                        }`}
                                    >
                                        {isPrefMutated ? "N→P" : "N"}
                                    </span>
                                </>
                            ) : (
                                <span className="col-span-3 text-center text-[10px] text-slate-500">
                                    bucle finalitzat
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Zona 2: acumulador `SETOF Tdades_client` */}
                    <div>
                        <div className="h-[14px] leading-[14px] text-[9.5px] text-emerald-400/80 flex justify-between px-0.5">
                            <span>SETOF resultat</span>
                            <span className="text-slate-500">
                                {(row1Visible ? 1 : 0) + (row2Visible ? 1 : 0)}/2 files
                            </span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            {renderOutputRow(1, row1Visible, row1IsNew)}
                            {renderOutputRow(2, row2Visible, row2IsNew)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Estat actual en 1 línia */}
            <div className="mt-4 flex justify-center">
                <div className={`px-3 py-1 rounded-lg border text-[11px] transition-colors ${status.tone}`}>
                    {status.text}
                </div>
            </div>
        </div>
    );
}
