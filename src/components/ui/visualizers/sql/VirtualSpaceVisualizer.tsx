"use client";

import { useState } from "react";

type EvMode = "tables" | "cluster";
type QueryMode = "select_dpt" | "join";
type TupleKind = "dpt" | "empl" | "empty";

interface TupleSlot {
    label: string;
    kind: TupleKind;
}

interface PageSpec {
    id: string;
    title: string;
    fileLabel: string;
    slots: [TupleSlot, TupleSlot, TupleSlot];
    readInSelect: boolean;
    readInJoin: boolean;
}

const PAGES_BY_MODE: Record<EvMode, PageSpec[]> = {
    tables: [
        {
            id: "t-dpt-1",
            title: "Pàg. 1",
            fileLabel: "fitxer dpt",
            slots: [
                { label: "d1", kind: "dpt" },
                { label: "d2", kind: "dpt" },
                { label: "—", kind: "empty" },
            ],
            readInSelect: true,
            readInJoin: true,
        },
        {
            id: "t-empl-1",
            title: "Pàg. 1",
            fileLabel: "fitxer empl",
            slots: [
                { label: "e1·d1", kind: "empl" },
                { label: "e2·d1", kind: "empl" },
                { label: "e3·d2", kind: "empl" },
            ],
            readInSelect: false,
            readInJoin: true,
        },
        {
            id: "t-empl-2",
            title: "Pàg. 2",
            fileLabel: "fitxer empl",
            slots: [
                { label: "e4·d2", kind: "empl" },
                { label: "—", kind: "empty" },
                { label: "—", kind: "empty" },
            ],
            readInSelect: false,
            readInJoin: true,
        },
    ],
    cluster: [
        {
            id: "c-1",
            title: "Pàg. 1",
            fileLabel: "fitxer únic",
            slots: [
                { label: "d1", kind: "dpt" },
                { label: "e1·d1", kind: "empl" },
                { label: "e2·d1", kind: "empl" },
            ],
            readInSelect: true,
            readInJoin: true,
        },
        {
            id: "c-2",
            title: "Pàg. 2",
            fileLabel: "fitxer únic",
            slots: [
                { label: "d2", kind: "dpt" },
                { label: "e3·d2", kind: "empl" },
                { label: "e4·d2", kind: "empl" },
            ],
            readInSelect: true,
            readInJoin: true,
        },
    ],
};

// Geometria exacta: alçada fixa de 182px tant amb 3 pàgines (tables) com amb 2 pàgines (cluster)
const PAGE_H = 54;
const PAGE_GAP = 10;
const Y_QUERY_CENTER = 91;

const getPageCenterY = (mode: EvMode, idx: number): number => {
    const topOffset = mode === "cluster" ? 32 : 0;
    return topOffset + idx * (PAGE_H + PAGE_GAP) + PAGE_H / 2;
};

const TUPLE_STYLE: Record<TupleKind, string> = {
    dpt: "bg-sky-500/15 border-sky-400/50 text-sky-200",
    empl: "bg-amber-500/15 border-amber-400/50 text-amber-200",
    empty: "bg-slate-900/20 border-dashed border-white/10 text-slate-600",
};

export default function VirtualSpaceVisualizer() {
    const [evMode, setEvMode] = useState<EvMode>("cluster");
    const [queryMode, setQueryMode] = useState<QueryMode>("join");

    const pages = PAGES_BY_MODE[evMode];
    const readCount = pages.filter((p) => (queryMode === "select_dpt" ? p.readInSelect : p.readInJoin)).length;

    const isOptimal =
        (evMode === "tables" && queryMode === "select_dpt") ||
        (evMode === "cluster" && queryMode === "join");

    const accentHex = isOptimal ? "#10b981" : evMode === "cluster" ? "#f59e0b" : "#38bdf8";

    const getSummary = (): { text: string; cls: string } => {
        if (evMode === "tables" && queryMode === "select_dpt") {
            return {
                text: "1 pàgina llegida · SELECT d'una sola taula només llegeix dpt ✓",
                cls: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
            };
        }
        if (evMode === "tables" && queryMode === "join") {
            return {
                text: "3 pàgines en 2 fitxers separats · JOIN penalitzat entre fitxers",
                cls: "bg-sky-500/10 border-sky-500/30 text-sky-300",
            };
        }
        if (evMode === "cluster" && queryMode === "join") {
            return {
                text: "2 pàgines compartides · pare i filles junts a la mateixa pàgina ✓",
                cls: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
            };
        }
        return {
            text: "2 pàgines (cost = JOIN!) · SELECT de dpt es veu obligat a llegir files d'empl",
            cls: "bg-amber-500/10 border-amber-500/30 text-amber-300",
        };
    };

    const summary = getSummary();

    return (
        <div className="w-full max-w-xl mx-auto my-6 not-prose select-none font-mono text-xs">
            {/* Controls superiors: Tipus d'EV i Consulta */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4">
                <div className="inline-flex p-0.5 rounded-lg bg-slate-900/60 border border-white/10 gap-0.5">
                    {[
                        { id: "tables" as EvMode, label: "EV de Taules" },
                        { id: "cluster" as EvMode, label: "EV d'Agrupació" },
                    ].map((btn) => {
                        const active = evMode === btn.id;
                        return (
                            <button
                                key={btn.id}
                                type="button"
                                onClick={() => setEvMode(btn.id)}
                                className={`px-2.5 py-1 rounded-md text-[10.5px] transition-all cursor-pointer ${
                                    active
                                        ? "bg-sky-500/20 text-sky-200 border border-sky-400/40 font-semibold"
                                        : "text-slate-400 hover:text-slate-200 border border-transparent"
                                }`}
                            >
                                {btn.label}
                            </button>
                        );
                    })}
                </div>

                <div className="inline-flex p-0.5 rounded-lg bg-slate-900/60 border border-white/10 gap-0.5">
                    {[
                        { id: "select_dpt" as QueryMode, label: "SELECT * FROM dpt" },
                        { id: "join" as QueryMode, label: "JOIN dpt ⋈ empl" },
                    ].map((btn) => {
                        const active = queryMode === btn.id;
                        return (
                            <button
                                key={btn.id}
                                type="button"
                                onClick={() => setQueryMode(btn.id)}
                                className={`px-2.5 py-1 rounded-md text-[10.5px] transition-all cursor-pointer ${
                                    active
                                        ? "bg-emerald-500/20 text-emerald-200 border border-emerald-400/40 font-semibold"
                                        : "text-slate-400 hover:text-slate-200 border border-transparent"
                                }`}
                            >
                                {btn.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Capçaleres */}
            <div
                className="grid items-center text-[10px] text-slate-500 font-semibold tracking-wider pb-2"
                style={{ gridTemplateColumns: "106px 44px 1fr" }}
            >
                <span>CONSULTA</span>
                <span />
                <div className="flex items-center justify-between">
                    <span>PÀGINES (f = 3)</span>
                    <span className="text-slate-600">
                        {evMode === "tables" ? "1 taula ↔ 1 EV" : "N_A=2, k=2"}
                    </span>
                </div>
            </div>

            {/* Cos principal: consulta + connexions SVG + pàgines de disc */}
            <div
                className="relative grid items-center"
                style={{ gridTemplateColumns: "106px 44px 1fr" }}
            >
                {/* Targeta de consulta + cost E/S */}
                <div
                    className={`h-[76px] px-2.5 rounded-xl border flex flex-col justify-center gap-1 transition-all duration-200 ${
                        isOptimal
                            ? "bg-emerald-500/15 border-emerald-400/70 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                            : evMode === "cluster"
                            ? "bg-amber-500/10 border-amber-400/70 text-amber-200"
                            : "bg-sky-500/15 border-sky-400/70 text-sky-200"
                    }`}
                >
                    <span className="text-[10px] font-bold leading-tight">
                        {queryMode === "select_dpt" ? "SELECT dpt" : "JOIN dpt⋈empl"}
                    </span>
                    <span className="text-[11px] font-bold tabular-nums">
                        {readCount} {readCount === 1 ? "pàg." : "pàgs."} E/S
                    </span>
                </div>

                {/* Connexions SVG cap a les pàgines llegides */}
                <svg
                    viewBox="0 0 44 182"
                    className="w-full h-[182px] pointer-events-none overflow-visible"
                >
                    <defs>
                        <marker
                            id="ev-arrow"
                            viewBox="0 0 6 6"
                            refX="4.5"
                            refY="3"
                            markerWidth="4.5"
                            markerHeight="4.5"
                            orient="auto"
                        >
                            <path d="M 0 0 L 6 3 L 0 6 z" fill={accentHex} />
                        </marker>
                    </defs>

                    {pages.map((page, idx) => {
                        const isRead = queryMode === "select_dpt" ? page.readInSelect : page.readInJoin;
                        const y2 = getPageCenterY(evMode, idx);

                        return (
                            <path
                                key={`${evMode}-${page.id}`}
                                d={`M 0,${Y_QUERY_CENTER} C 22,${Y_QUERY_CENTER} 22,${y2} 41,${y2}`}
                                fill="none"
                                stroke={isRead ? accentHex : "#334155"}
                                strokeWidth={isRead ? 1.8 : 1}
                                strokeOpacity={isRead ? 0.9 : 0.15}
                                strokeDasharray={isRead ? undefined : "3 3"}
                                markerEnd={isRead ? "url(#ev-arrow)" : undefined}
                                className="transition-all duration-200"
                            />
                        );
                    })}
                </svg>

                {/* Columna dreta: pàgines de dades (182px fixos) */}
                <div
                    className="h-[182px] flex flex-col gap-[10px]"
                    style={{
                        paddingTop: evMode === "cluster" ? "32px" : "0px",
                        paddingBottom: evMode === "cluster" ? "32px" : "0px",
                    }}
                >
                    {pages.map((page) => {
                        const isRead = queryMode === "select_dpt" ? page.readInSelect : page.readInJoin;

                        return (
                            <div
                                key={page.id}
                                className={`h-[54px] px-2.5 py-1.5 rounded-xl border flex flex-col justify-between transition-all duration-200 overflow-hidden ${
                                    isRead
                                        ? isOptimal
                                            ? "bg-slate-900/70 border-emerald-400/50 shadow-[0_0_12px_rgba(16,185,129,0.12)]"
                                            : evMode === "cluster"
                                            ? "bg-slate-900/70 border-amber-400/50"
                                            : "bg-slate-900/70 border-sky-400/50"
                                        : "bg-slate-900/20 border-white/5 opacity-25"
                                }`}
                            >
                                <div className="h-[14px] leading-[14px] flex items-center justify-between text-[9.5px]">
                                    <span className="font-semibold text-slate-300">
                                        {page.title} · <span className="text-slate-500">{page.fileLabel}</span>
                                    </span>
                                    <span
                                        className={`font-bold ${
                                            isRead
                                                ? isOptimal
                                                    ? "text-emerald-400"
                                                    : evMode === "cluster"
                                                    ? "text-amber-400"
                                                    : "text-sky-400"
                                                : "text-slate-600"
                                        }`}
                                    >
                                        {isRead ? "LLEGIDA" : "—"}
                                    </span>
                                </div>

                                <div className="grid grid-cols-3 gap-1.5">
                                    {page.slots.map((slot, sIdx) => (
                                        <div
                                            key={`${page.id}-${sIdx}`}
                                            className={`h-6 rounded-md border flex items-center justify-center text-[10px] font-semibold truncate ${
                                                TUPLE_STYLE[slot.kind]
                                            }`}
                                        >
                                            {slot.label}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Resum en 1 línia */}
            <div className="mt-4 flex justify-center">
                <div className={`px-3 py-1 rounded-lg border text-[11px] text-center transition-colors ${summary.cls}`}>
                    {summary.text}
                </div>
            </div>
        </div>
    );
}
