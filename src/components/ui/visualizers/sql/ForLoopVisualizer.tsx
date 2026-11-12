"use client";

import { useState } from "react";

type IterId = 1 | 2;
type SubStep = 0 | 1 | 2 | 3;

interface OrderRow {
    numCom: number;
    dni: string;
    total: number | null;
    itemsNote: string;
}

const ORDERS: { 1: OrderRow; 2: OrderRow; other: OrderRow } = {
    1: { numCom: 101, dni: "123A", total: 45, itemsNote: "2×15 + 1×15" },
    2: { numCom: 102, dni: "123A", total: 120, itemsNote: "3×40" },
    other: { numCom: 103, dni: "999Z", total: null, itemsNote: "altre client" },
};

// Geometria exacta: 4 files de 36px (h-9) + 3 gaps de 8px (gap-2) = 168px
const ROW_H = 36;
const GAP = 8;
const TOTAL_H = 4 * ROW_H + 3 * GAP; // 168px
const SVG_W = 56;
const getY = (idx: number) => idx * (ROW_H + GAP) + ROW_H / 2;

const LOOP_STEPS: { idx: SubStep; label: string; tag?: string }[] = [
    { idx: 0, label: "FOR num_comanda IN SELECT" },
    { idx: 1, label: "SELECT SUM(...) INTO import" },
    { idx: 2, label: "UPDATE comandes SET ..." },
    { idx: 3, label: "END LOOP;", tag: "fi" },
];

export default function ForLoopVisualizer() {
    const [iter, setIter] = useState<IterId>(2);
    const [subStep, setSubStep] = useState<SubStep>(3);

    const activeOrder = ORDERS[iter];
    const isFinished = iter === 2 && subStep === 3;

    // Estat de les variables locals a memòria
    const memNumCom = isFinished ? "—" : String(activeOrder.numCom);
    const memImport =
        isFinished
            ? "—"
            : subStep >= 1
            ? `${activeOrder.total} €`
            : iter === 2
            ? "45 €"
            : "NULL";

    // Estat de les dues files que compleixen WHERE dni = '123A'
    const row101Done = iter === 2 || subStep >= 2;
    const row102Done = iter === 2 && subStep >= 2;
    const row101Updating = iter === 1 && subStep === 2;
    const row102Updating = iter === 2 && subStep === 2;

    const getStatus = (): { text: string; tone: string } => {
        if (subStep === 0) {
            return {
                text: `FOR · carrega num_comanda ← ${activeOrder.numCom} (fila ${iter} de 2 per '123A')`,
                tone: "bg-sky-500/10 border-sky-500/30 text-sky-300",
            };
        }
        if (subStep === 1) {
            return {
                text: `SELECT INTO · suma ítems de #${activeOrder.numCom} (${activeOrder.itemsNote}) → import = ${activeOrder.total} €`,
                tone: "bg-amber-500/10 border-amber-500/30 text-amber-300",
            };
        }
        if (subStep === 2) {
            return {
                text: `UPDATE · desa import_total = ${activeOrder.total} € a la comanda #${activeOrder.numCom}`,
                tone: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
            };
        }
        if (iter === 1) {
            return {
                text: "END LOOP · fi iteració 1 → passa automàticament a la comanda #102",
                tone: "bg-sky-500/10 border-sky-500/30 text-sky-300",
            };
        }
        return {
            text: "END LOOP · bucle acabat (2 files processades · FOUND = True)",
            tone: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
        };
    };

    const status = getStatus();

    const getStepStyle = (idx: SubStep) => {
        const isActive = subStep === idx;
        if (!isActive) {
            return idx < subStep
                ? "bg-slate-900/50 border-white/10 text-slate-300 hover:border-slate-600"
                : "bg-slate-900/20 border-white/5 text-slate-600 opacity-40 hover:opacity-75";
        }
        if (idx === 0) {
            return "bg-sky-500/15 border-sky-400 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.2)]";
        }
        if (idx === 1) {
            return "bg-amber-500/15 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.2)]";
        }
        return "bg-emerald-500/15 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.2)]";
    };

    const renderArrows = () => {
        const activeRowY = getY(iter); // 1 -> row #101 (62), 2 -> row #102 (106)

        if (subStep === 0) {
            const y1 = getY(0);
            return (
                <g>
                    <path
                        d={`M 0,${y1} L 49,${getY(0)}`}
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="1.9"
                        markerEnd="url(#for-arrow-sky)"
                    />
                    <path
                        d={`M 0,${y1} C 28,${y1} 28,${activeRowY} ${SVG_W},${activeRowY}`}
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="1.3"
                        strokeDasharray="3 3"
                        strokeOpacity="0.65"
                    />
                </g>
            );
        }

        if (subStep === 1) {
            const y1 = getY(1);
            return (
                <path
                    d={`M 0,${y1} C 28,${y1} 28,${getY(0)} 49,${getY(0)}`}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="1.9"
                    markerEnd="url(#for-arrow-amber)"
                />
            );
        }

        if (subStep === 2) {
            const y1 = getY(2);
            return (
                <path
                    d={`M 0,${y1} C 28,${y1} 28,${activeRowY} 49,${activeRowY}`}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    markerEnd="url(#for-arrow-emerald)"
                />
            );
        }

        if (iter === 1) {
            const y1 = getY(3);
            return (
                <path
                    d={`M 0,${y1} C 28,${y1} 28,${getY(2)} 49,${getY(2)}`}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.6"
                    strokeDasharray="3 3"
                    markerEnd="url(#for-arrow-sky)"
                />
            );
        }

        const y1 = getY(3);
        return (
            <g>
                <path
                    d={`M 0,${y1} C 28,${y1} 28,${getY(1)} 49,${getY(1)}`}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1.75"
                    markerEnd="url(#for-arrow-emerald)"
                />
                <path
                    d={`M 0,${y1} C 28,${y1} 28,${getY(2)} 49,${getY(2)}`}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1.75"
                    markerEnd="url(#for-arrow-emerald)"
                />
            </g>
        );
    };

    const renderOrderCard = (order: OrderRow, done: boolean, isUpdating: boolean, isTargetIter: boolean) => {
        const displayTotal = done ? `${order.total} € ✓` : "NULL";
        let cardClass = "bg-slate-900/40 border-white/10 text-slate-300";

        if (isUpdating) {
            cardClass = "bg-emerald-500/15 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.2)]";
        } else if (isTargetIter && subStep === 0) {
            cardClass = "bg-sky-500/15 border-sky-400 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.2)]";
        } else if (done) {
            cardClass = "bg-emerald-500/10 border-emerald-500/40 text-emerald-300";
        }

        return (
            <div
                key={order.numCom}
                className={`h-9 px-2.5 rounded-lg border flex items-center justify-between gap-1.5 transition-all duration-150 ${cardClass}`}
            >
                <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-bold text-[11px] shrink-0">#{order.numCom}</span>
                    <span className="text-[10px] opacity-65 hidden sm:inline truncate">
                        {order.dni}
                    </span>
                </div>
                <span
                    className={`text-[11px] font-semibold tabular-nums shrink-0 ${
                        !done && !isUpdating ? "text-slate-500 italic font-normal" : ""
                    }`}
                >
                    {displayTotal}
                </span>
            </div>
        );
    };

    return (
        <div className="w-full max-w-xl mx-auto my-6 not-prose select-none font-mono text-xs">
            {/* Selector d'iteració */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pb-4">
                <span className="text-[10px] text-slate-500 mr-1">dni_client = &apos;123A&apos;</span>
                {([1, 2] as IterId[]).map((id) => {
                    const isSelected = iter === id;
                    return (
                        <button
                            key={id}
                            type="button"
                            onClick={() => {
                                setIter(id);
                                setSubStep(id === 1 ? 0 : 2);
                            }}
                            className={`px-2.5 py-1 rounded-md border text-[11px] transition-all duration-150 cursor-pointer ${
                                isSelected
                                    ? "bg-sky-500/15 border-sky-400 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.2)] font-semibold"
                                    : "bg-slate-900/30 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10"
                            }`}
                        >
                            Iteració {id} (#{ORDERS[id].numCom})
                        </button>
                    );
                })}
            </div>

            {/* Capçaleres */}
            <div
                className="grid items-center text-[10px] text-slate-500 font-semibold tracking-wider pb-2"
                style={{ gridTemplateColumns: "1.2fr 56px 1fr" }}
            >
                <span>COS DEL BUCLE</span>
                <span />
                <div className="flex items-center justify-between pl-1">
                    <span>MEMÒRIA / comandes</span>
                    <span className="text-slate-600 hidden sm:inline">2 files</span>
                </div>
            </div>

            {/* Cos principal de 3 columnes */}
            <div
                className="relative grid items-start"
                style={{ gridTemplateColumns: "1.2fr 56px 1fr" }}
            >
                {/* Columna esquerra: passos dins el bucle */}
                <div className="flex flex-col gap-2">
                    {LOOP_STEPS.map((step) => (
                        <button
                            key={step.idx}
                            type="button"
                            onMouseEnter={() => setSubStep(step.idx)}
                            onClick={() => setSubStep(step.idx)}
                            className={`h-9 px-2.5 rounded-lg border text-left flex items-center justify-between gap-1.5 transition-all duration-150 cursor-pointer ${getStepStyle(
                                step.idx
                            )}`}
                        >
                            <span className="text-[11px] truncate">{step.label}</span>
                            {step.tag && (
                                <span className="text-[10px] font-bold opacity-75 shrink-0">
                                    {step.tag}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Connexions SVG */}
                <svg
                    viewBox={`0 0 ${SVG_W} ${TOTAL_H}`}
                    style={{ height: TOTAL_H }}
                    className="w-full pointer-events-none overflow-visible"
                >
                    <defs>
                        <marker
                            id="for-arrow-sky"
                            viewBox="0 0 10 10"
                            refX="7"
                            refY="5"
                            markerWidth="5"
                            markerHeight="5"
                            orient="auto"
                        >
                            <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#38bdf8" />
                        </marker>
                        <marker
                            id="for-arrow-amber"
                            viewBox="0 0 10 10"
                            refX="7"
                            refY="5"
                            markerWidth="5"
                            markerHeight="5"
                            orient="auto"
                        >
                            <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#f59e0b" />
                        </marker>
                        <marker
                            id="for-arrow-emerald"
                            viewBox="0 0 10 10"
                            refX="7"
                            refY="5"
                            markerWidth="5"
                            markerHeight="5"
                            orient="auto"
                        >
                            <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#10b981" />
                        </marker>
                    </defs>
                    {renderArrows()}
                </svg>

                {/* Columna dreta: variables locals + files de comandes */}
                <div className="flex flex-col gap-2">
                    {/* Fila 0: Memòria local (num_comanda | import) */}
                    <div
                        className={`h-9 px-2 rounded-lg border grid grid-cols-2 items-center gap-1 transition-all duration-150 ${
                            subStep === 0
                                ? "bg-sky-500/15 border-sky-400/75 text-sky-200"
                                : subStep === 1
                                ? "bg-amber-500/15 border-amber-400/75 text-amber-200"
                                : "bg-slate-900/45 border-white/10 text-slate-300"
                        }`}
                    >
                        <div className="flex items-center justify-between border-r border-white/10 pr-1.5 min-w-0">
                            <span className="text-[9px] opacity-65 truncate">com</span>
                            <span className="text-[11px] font-bold tabular-nums">{memNumCom}</span>
                        </div>
                        <div className="flex items-center justify-between pl-1 min-w-0">
                            <span className="text-[9px] opacity-65 truncate">imp</span>
                            <span className="text-[11px] font-bold tabular-nums">{memImport}</span>
                        </div>
                    </div>

                    {/* Files 1..2: Comandes del client '123A' */}
                    {renderOrderCard(ORDERS[1], row101Done, row101Updating, iter === 1)}
                    {renderOrderCard(ORDERS[2], row102Done, row102Updating, iter === 2)}

                    {/* Fila 3: Comanda d'un altre client (descartada pel WHERE) */}
                    <div className="h-9 px-2.5 rounded-lg border bg-slate-900/15 border-white/5 text-slate-600 opacity-25 flex items-center justify-between">
                        <span className="text-[11px]">#{ORDERS.other.numCom}</span>
                        <span className="text-[10px]">{ORDERS.other.dni}</span>
                    </div>
                </div>
            </div>

            {/* Estat actual en 1 línia */}
            <div className="mt-3 flex justify-center">
                <div className={`px-3 py-1 rounded-lg border text-[11px] transition-colors ${status.tone}`}>
                    {status.text}
                </div>
            </div>
        </div>
    );
}
