"use client";

import { useState } from "react";

type ModeId = "structure" | "call" | "drop";
type CallMode = "scalar" | "table";
type DropTarget = "int" | "text" | "missing";
type Tone = "sky" | "violet" | "amber" | "emerald" | "rose";

interface BlockItem {
    id: string;
    code: string;
    targetIdx: 0 | 1 | 2;
    tone: Tone;
    note: string;
}

interface ServerTarget {
    idx: 0 | 1 | 2;
    title: string;
    sub: string;
}

// Geometria exacta per a Estructura (esquerra 4x36px + 3x8px = 168px; dreta 3x36px + 2x12px + 2x18px = 168px)
const ROW_H = 36;
const GAP_LEFT = 8;
const OFFSET_RIGHT = 18;
const GAP_RIGHT = 12;
const STRUCT_H = 4 * ROW_H + 3 * GAP_LEFT; // 168px
const SVG_W = 56;

const getYLeft = (idx: number) => idx * (ROW_H + GAP_LEFT) + ROW_H / 2;
const getYRight = (idx: number) => OFFSET_RIGHT + idx * (ROW_H + GAP_RIGHT) + ROW_H / 2;

// Geometria exacta per a Crida SELECT (2 files x 36px + 8px = 80px)
const CALL_H = 2 * ROW_H + GAP_LEFT; // 80px

// Geometria exacta per a DROP (esquerra 1 bloc centrat a y=44; dreta 2x40px + 8px = 88px)
const DROP_ROW_H = 40;
const DROP_H = 2 * DROP_ROW_H + GAP_LEFT; // 88px

const STRUCTURE_BLOCKS: BlockItem[] = [
    {
        id: "sig",
        code: "CREATE FUNCTION f(p INT)",
        targetIdx: 0,
        tone: "sky",
        note: "Defineix el nom, paràmetres d'entrada i firma al catàleg",
    },
    {
        id: "ret",
        code: "RETURNS tipus",
        targetIdx: 0,
        tone: "violet",
        note: "Contracte de sortida: tipus escalar, compost, SETOF o void",
    },
    {
        id: "dec",
        code: "DECLARE  v INT;",
        targetIdx: 1,
        tone: "amber",
        note: "Variables locals en memòria volàtil (viuen només durant la crida)",
    },
    {
        id: "body",
        code: "BEGIN … RETURN v; END;",
        targetIdx: 2,
        tone: "emerald",
        note: "Cos SQL/PLpgSQL executat dins el servidor SGBD (sense viatges de xarxa)",
    },
];

const SERVER_TARGETS: ServerTarget[] = [
    { idx: 0, title: "Catàleg SGBD", sub: "firma emmagatzemada" },
    { idx: 1, title: "Memòria local", sub: "per execució" },
    { idx: 2, title: "Motor SGBD", sub: "0 viatges extra" },
];

const SAMPLE_TUPLES = [
    { id: 0, col1: "123A", col2: "CARME" },
    { id: 1, col1: "456B", col2: "JOSEP" },
];

const DROP_MODES: {
    id: DropTarget;
    label: string;
    sql: string;
    tone: Tone;
    status: string;
}[] = [
    {
        id: "int",
        label: "f(INT)",
        sql: "DROP FUNCTION f(INT);",
        tone: "rose",
        status: "Esborra només f(INT) · identificada pels tipus dels paràmetres",
    },
    {
        id: "text",
        label: "f(TEXT)",
        sql: "DROP FUNCTION f(TEXT);",
        tone: "rose",
        status: "Esborra només f(TEXT) · f(INT) resta intacta",
    },
    {
        id: "missing",
        label: "f (sense tipus)",
        sql: "DROP FUNCTION f;",
        tone: "amber",
        status: "✕ Error: cal especificar (tipus_param) per distingir sobrecàrregues",
    },
];

const TONE_HEX: Record<Tone, string> = {
    sky: "#38bdf8",
    violet: "#a78bfa",
    amber: "#f59e0b",
    emerald: "#10b981",
    rose: "#f43f5e",
};

const TONE_CARD: Record<Tone, string> = {
    sky: "bg-sky-500/15 border-sky-400/75 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.2)]",
    violet: "bg-violet-500/15 border-violet-400/75 text-violet-200 shadow-[0_0_12px_rgba(167,139,250,0.2)]",
    amber: "bg-amber-500/15 border-amber-400/75 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.2)]",
    emerald: "bg-emerald-500/15 border-emerald-400/75 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.2)]",
    rose: "bg-rose-500/15 border-rose-500/75 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.2)]",
};

const TONE_PILL: Record<Tone, string> = {
    sky: "bg-sky-500/10 border-sky-500/30 text-sky-300",
    violet: "bg-violet-500/10 border-violet-500/30 text-violet-300",
    amber: "bg-amber-500/10 border-amber-500/30 text-amber-300",
    emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    rose: "bg-rose-500/10 border-rose-500/30 text-rose-300",
};

export default function PlpgsqlVisualizer() {
    const [mode, setMode] = useState<ModeId>("structure");
    const [hoveredStructId, setHoveredStructId] = useState<string | null>(null);
    const [hoveredTargetIdx, setHoveredTargetIdx] = useState<number | null>(null);
    const [callMode, setCallMode] = useState<CallMode>("table");
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);
    const [dropTarget, setDropTarget] = useState<DropTarget>("int");

    const activeStructBlock =
        hoveredStructId !== null
            ? STRUCTURE_BLOCKS.find((b) => b.id === hoveredStructId) || null
            : null;

    const isBlockActive = (b: BlockItem) =>
        hoveredStructId === b.id || hoveredTargetIdx === b.targetIdx;

    const hasStructHover = hoveredStructId !== null || hoveredTargetIdx !== null;
    const activeDrop = DROP_MODES.find((d) => d.id === dropTarget) || DROP_MODES[0];

    return (
        <div className="w-full max-w-xl mx-auto my-6 not-prose select-none font-mono text-xs">
            {/* Selector principal de vista */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pb-4">
                {(
                    [
                        { id: "structure" as const, label: "ESTRUCTURA BLOC", activeClass: TONE_CARD.sky },
                        { id: "call" as const, label: "CRIDA (SELECT)", activeClass: TONE_CARD.emerald },
                        { id: "drop" as const, label: "ESBORRAT (DROP)", activeClass: TONE_CARD.rose },
                    ] as const
                ).map((tab) => {
                    const isSelected = mode === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => {
                                setMode(tab.id);
                                setHoveredStructId(null);
                                setHoveredTargetIdx(null);
                                setHoveredRow(null);
                            }}
                            className={`px-2.5 py-1 rounded-md border text-[11px] transition-all duration-150 cursor-pointer ${
                                isSelected
                                    ? `${tab.activeClass} font-semibold`
                                    : "bg-slate-900/30 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10"
                            }`}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {mode === "structure" && (
                <>
                    {/* Capçaleres */}
                    <div
                        className="grid items-center text-[10px] text-slate-500 font-semibold tracking-wider pb-2"
                        style={{ gridTemplateColumns: "1.2fr 56px 1fr" }}
                    >
                        <div className="flex items-center justify-between pr-1">
                            <span>BLOC PL/pgSQL</span>
                            <span className="text-slate-600">$$ … $$</span>
                        </div>
                        <span />
                        <span className="text-right">SGBD</span>
                    </div>

                    {/* Cos: Bloc PL/pgSQL -> Corbes SVG -> Rol a l'SGBD */}
                    <div
                        className="relative grid items-start"
                        style={{ gridTemplateColumns: "1.2fr 56px 1fr" }}
                    >
                        <div className="flex flex-col gap-2">
                            {STRUCTURE_BLOCKS.map((block) => {
                                const active = isBlockActive(block);
                                const dimmed = hasStructHover && !active;

                                return (
                                    <button
                                        key={block.id}
                                        type="button"
                                        onMouseEnter={() => {
                                            setHoveredStructId(block.id);
                                            setHoveredTargetIdx(null);
                                        }}
                                        onMouseLeave={() => setHoveredStructId(null)}
                                        onClick={() =>
                                            setHoveredStructId((curr) =>
                                                curr === block.id ? null : block.id
                                            )
                                        }
                                        className={`h-9 px-2.5 rounded-lg border text-left flex items-center transition-all duration-150 cursor-pointer ${
                                            dimmed
                                                ? "bg-slate-900/20 border-white/5 text-slate-600 opacity-30"
                                                : active
                                                ? TONE_CARD[block.tone]
                                                : "bg-slate-900/45 border-white/10 text-slate-200 hover:border-slate-600"
                                        }`}
                                    >
                                        <span className="text-[11px] truncate font-medium">
                                            {block.code}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        <svg
                            viewBox={`0 0 ${SVG_W} ${STRUCT_H}`}
                            style={{ height: STRUCT_H }}
                            className="w-full pointer-events-none overflow-visible"
                        >
                            {STRUCTURE_BLOCKS.map((block, idx) => {
                                const y1 = getYLeft(idx);
                                const y2 = getYRight(block.targetIdx);
                                const active = isBlockActive(block);
                                const dimmed = hasStructHover && !active;

                                return (
                                    <path
                                        key={block.id}
                                        d={`M 0,${y1} C 28,${y1} 28,${y2} ${SVG_W},${y2}`}
                                        fill="none"
                                        stroke={dimmed ? "#334155" : TONE_HEX[block.tone]}
                                        strokeWidth={active ? 2.4 : 1.6}
                                        strokeOpacity={dimmed ? 0.18 : active ? 1 : 0.72}
                                        className="transition-all duration-150"
                                    />
                                );
                            })}
                        </svg>

                        <div
                            className="flex flex-col gap-3"
                            style={{ paddingTop: `${OFFSET_RIGHT}px`, paddingBottom: `${OFFSET_RIGHT}px` }}
                        >
                            {SERVER_TARGETS.map((target) => {
                                const matchingBlock = STRUCTURE_BLOCKS.find(
                                    (b) => b.targetIdx === target.idx && hoveredStructId === b.id
                                );
                                const isDirectTarget = hoveredTargetIdx === target.idx;
                                const active = Boolean(matchingBlock) || isDirectTarget;
                                const dimmed = hasStructHover && !active;
                                const activeTone: Tone =
                                    matchingBlock?.tone ||
                                    (target.idx === 0 ? "sky" : target.idx === 1 ? "amber" : "emerald");

                                return (
                                    <button
                                        key={target.idx}
                                        type="button"
                                        onMouseEnter={() => {
                                            setHoveredTargetIdx(target.idx);
                                            setHoveredStructId(null);
                                        }}
                                        onMouseLeave={() => setHoveredTargetIdx(null)}
                                        onClick={() =>
                                            setHoveredTargetIdx((curr) =>
                                                curr === target.idx ? null : target.idx
                                            )
                                        }
                                        className={`h-9 px-2.5 rounded-lg border flex items-center justify-between gap-1.5 text-left transition-all duration-150 cursor-pointer ${
                                            dimmed
                                                ? "bg-slate-900/20 border-white/5 text-slate-600 opacity-30"
                                                : active
                                                ? TONE_CARD[activeTone]
                                                : "bg-slate-900/45 border-white/10 text-slate-300 hover:border-slate-600"
                                        }`}
                                    >
                                        <span className="text-[11px] font-semibold truncate">
                                            {target.title}
                                        </span>
                                        <span className="text-[9px] opacity-70 hidden sm:inline shrink-0">
                                            {target.sub}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-3 flex justify-center">
                        <div
                            className={`px-3 py-1 rounded-lg border text-[11px] transition-colors ${
                                activeStructBlock
                                    ? TONE_PILL[activeStructBlock.tone]
                                    : hoveredTargetIdx === 0
                                    ? TONE_PILL.sky
                                    : hoveredTargetIdx === 1
                                    ? TONE_PILL.amber
                                    : hoveredTargetIdx === 2
                                    ? TONE_PILL.emerald
                                    : "bg-slate-900/50 border-white/10 text-slate-400"
                            }`}
                        >
                            {activeStructBlock
                                ? activeStructBlock.note
                                : hoveredTargetIdx === 0
                                ? "El bloc es desa precompilat dins el catàleg de l'SGBD"
                                : hoveredTargetIdx === 1
                                ? "Les variables sense valor inicial comencen a NULL"
                                : hoveredTargetIdx === 2
                                ? "Lògica SQL executada al servidor sense viatges intermedis"
                                : "$$ LANGUAGE plpgsql · passa el cursor sobre cada part del bloc"}
                        </div>
                    </div>
                </>
            )}

            {mode === "call" && (
                <>
                    {/* Selector: SELECT f(...) vs SELECT * FROM f(...) */}
                    <div className="flex flex-wrap items-center justify-center gap-1.5 pb-4">
                        <button
                            type="button"
                            onClick={() => setCallMode("scalar")}
                            className={`px-2.5 py-1 rounded-md border text-[11px] transition-all duration-150 cursor-pointer ${
                                callMode === "scalar"
                                    ? `${TONE_CARD.amber} font-semibold`
                                    : "bg-slate-900/30 border-white/5 text-slate-400 hover:text-slate-200"
                            }`}
                        >
                            SELECT f(&apos;BCN&apos;);
                        </button>
                        <button
                            type="button"
                            onClick={() => setCallMode("table")}
                            className={`px-2.5 py-1 rounded-md border text-[11px] transition-all duration-150 cursor-pointer ${
                                callMode === "table"
                                    ? `${TONE_CARD.emerald} font-semibold`
                                    : "bg-slate-900/30 border-white/5 text-slate-400 hover:text-slate-200"
                            }`}
                        >
                            SELECT * FROM f(&apos;BCN&apos;);
                        </button>
                    </div>

                    {/* Capçaleres */}
                    <div
                        className="grid items-center text-[10px] text-slate-500 font-semibold tracking-wider pb-2"
                        style={{ gridTemplateColumns: "1fr 56px 1.2fr" }}
                    >
                        <span>RETORNA f(&apos;BCN&apos;)</span>
                        <span />
                        <div className="flex items-center justify-between pl-1">
                            <span>SORTIDA</span>
                            <span className={callMode === "table" ? "text-emerald-400" : "text-amber-400"}>
                                {callMode === "table" ? "dni | nom" : "1 col (f)"}
                            </span>
                        </div>
                    </div>

                    {/* Cos: Tuples retornades -> Corbes -> Format de sortida al client */}
                    <div
                        className="relative grid items-center"
                        style={{ gridTemplateColumns: "1fr 56px 1.2fr" }}
                    >
                        <div className="flex flex-col gap-2">
                            {SAMPLE_TUPLES.map((row) => {
                                const isHovered = hoveredRow === row.id;
                                const isDimmed = hoveredRow !== null && !isHovered;

                                return (
                                    <button
                                        key={row.id}
                                        type="button"
                                        onMouseEnter={() => setHoveredRow(row.id)}
                                        onMouseLeave={() => setHoveredRow(null)}
                                        onClick={() =>
                                            setHoveredRow((curr) => (curr === row.id ? null : row.id))
                                        }
                                        className={`h-9 px-2.5 rounded-lg border flex items-center justify-between text-[11px] transition-all duration-150 cursor-pointer ${
                                            isDimmed
                                                ? "bg-slate-900/20 border-white/5 text-slate-600 opacity-30"
                                                : isHovered
                                                ? TONE_CARD.sky
                                                : "bg-slate-900/45 border-white/10 text-slate-300 hover:border-slate-600"
                                        }`}
                                    >
                                        <span className="text-sky-300 font-semibold">{row.col1}</span>
                                        <span>{row.col2}</span>
                                    </button>
                                );
                            })}
                        </div>

                        <svg
                            viewBox={`0 0 ${SVG_W} ${CALL_H}`}
                            style={{ height: CALL_H }}
                            className="w-full pointer-events-none overflow-visible"
                        >
                            {SAMPLE_TUPLES.map((row) => {
                                const y = getYLeft(row.id);
                                const isHovered = hoveredRow === row.id;
                                const isDimmed = hoveredRow !== null && !isHovered;
                                const color =
                                    isDimmed
                                        ? "#334155"
                                        : callMode === "table"
                                        ? TONE_HEX.emerald
                                        : TONE_HEX.amber;

                                return (
                                    <path
                                        key={row.id}
                                        d={`M 0,${y} L ${SVG_W},${y}`}
                                        fill="none"
                                        stroke={color}
                                        strokeWidth={isHovered ? 2.4 : 1.75}
                                        strokeOpacity={isDimmed ? 0.2 : isHovered ? 1 : 0.8}
                                        strokeDasharray={callMode === "scalar" ? "3 3" : undefined}
                                        className="transition-all duration-150"
                                    />
                                );
                            })}
                        </svg>

                        <div className="flex flex-col gap-2">
                            {SAMPLE_TUPLES.map((row) => {
                                const isHovered = hoveredRow === row.id;
                                const isDimmed = hoveredRow !== null && !isHovered;
                                const activeTone: Tone = callMode === "table" ? "emerald" : "amber";

                                return (
                                    <button
                                        key={row.id}
                                        type="button"
                                        onMouseEnter={() => setHoveredRow(row.id)}
                                        onMouseLeave={() => setHoveredRow(null)}
                                        onClick={() =>
                                            setHoveredRow((curr) => (curr === row.id ? null : row.id))
                                        }
                                        className={`h-9 px-2.5 rounded-lg border text-[11px] transition-all duration-150 cursor-pointer ${
                                            isDimmed
                                                ? "bg-slate-900/20 border-white/5 text-slate-600 opacity-30"
                                                : TONE_CARD[activeTone]
                                        } ${
                                            callMode === "table"
                                                ? "grid grid-cols-2 items-center text-left"
                                                : "flex items-center justify-center"
                                        }`}
                                    >
                                        {callMode === "table" ? (
                                            <>
                                                <span className="border-r border-emerald-400/25 pr-2 truncate">
                                                    {row.col1}
                                                </span>
                                                <span className="pl-2 text-right truncate font-semibold">
                                                    {row.col2}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="truncate">
                                                ({row.col1}, {row.col2})
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-3 flex justify-center">
                        <div
                            className={`px-3 py-1 rounded-lg border text-[11px] transition-colors ${
                                callMode === "table" ? TONE_PILL.emerald : TONE_PILL.amber
                            }`}
                        >
                            {callMode === "table"
                                ? "SELECT * FROM desplega cada camp com una columna real (recomanat)"
                                : "SELECT f(...) retorna la tupla empaquetada en 1 sola columna"}
                        </div>
                    </div>
                </>
            )}

            {mode === "drop" && (
                <>
                    {/* Selector de sentència DROP */}
                    <div className="flex flex-wrap items-center justify-center gap-1.5 pb-4">
                        {DROP_MODES.map((item) => {
                            const isSelected = item.id === dropTarget;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setDropTarget(item.id)}
                                    className={`px-2.5 py-1 rounded-md border text-[11px] transition-all duration-150 cursor-pointer ${
                                        isSelected
                                            ? `${TONE_CARD[item.tone]} font-semibold`
                                            : "bg-slate-900/30 border-white/5 text-slate-400 hover:text-slate-200"
                                    }`}
                                >
                                    {item.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Capçaleres */}
                    <div
                        className="grid items-center text-[10px] text-slate-500 font-semibold tracking-wider pb-2"
                        style={{ gridTemplateColumns: "1.15fr 56px 1fr" }}
                    >
                        <span>SENTÈNCIA</span>
                        <span />
                        <span className="text-right">CATÀLEG SGBD</span>
                    </div>

                    {/* Cos: DROP FUNCTION -> Corba SVG -> Sobrecàrregues al catàleg */}
                    <div
                        className="relative grid items-center"
                        style={{ gridTemplateColumns: "1.15fr 56px 1fr" }}
                    >
                        <div className="py-[22px]">
                            <div
                                className={`h-11 px-2.5 rounded-lg border flex items-center justify-center text-[11px] font-semibold transition-all duration-150 ${
                                    TONE_CARD[activeDrop.tone]
                                }`}
                            >
                                <span className="truncate">{activeDrop.sql}</span>
                            </div>
                        </div>

                        <svg
                            viewBox={`0 0 ${SVG_W} ${DROP_H}`}
                            style={{ height: DROP_H }}
                            className="w-full pointer-events-none overflow-visible"
                        >
                            {dropTarget === "missing" ? (
                                <>
                                    <path
                                        d="M 0,44 C 28,44 28,20 56,20"
                                        fill="none"
                                        stroke={TONE_HEX.amber}
                                        strokeWidth="1.6"
                                        strokeDasharray="3 3"
                                    />
                                    <path
                                        d="M 0,44 C 28,44 28,68 56,68"
                                        fill="none"
                                        stroke={TONE_HEX.amber}
                                        strokeWidth="1.6"
                                        strokeDasharray="3 3"
                                    />
                                    <g transform="translate(28, 44)">
                                        <rect
                                            x="-10"
                                            y="-8"
                                            width="20"
                                            height="16"
                                            rx="4"
                                            fill="#020617"
                                            stroke={TONE_HEX.amber}
                                            strokeWidth="1"
                                        />
                                        <text
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            y="1"
                                            fill={TONE_HEX.amber}
                                            fontSize="10"
                                            fontWeight="bold"
                                        >
                                            ?
                                        </text>
                                    </g>
                                </>
                            ) : (
                                <path
                                    d={`M 0,44 C 28,44 28,${dropTarget === "int" ? 20 : 68} ${SVG_W},${
                                        dropTarget === "int" ? 20 : 68
                                    }`}
                                    fill="none"
                                    stroke={TONE_HEX.rose}
                                    strokeWidth="2.2"
                                />
                            )}
                        </svg>

                        <div className="flex flex-col gap-2">
                            {(
                                [
                                    { id: "int" as const, sig: "f(INT)", ret: "TEXT" },
                                    { id: "text" as const, sig: "f(TEXT)", ret: "INT" },
                                ] as const
                            ).map((fn) => {
                                const isHit = dropTarget === fn.id;
                                const isAmbiguous = dropTarget === "missing";

                                return (
                                    <div
                                        key={fn.id}
                                        className={`h-10 px-2.5 rounded-lg border flex items-center justify-between text-[11px] transition-all duration-150 ${
                                            isHit
                                                ? TONE_CARD.rose
                                                : isAmbiguous
                                                ? `${TONE_CARD.amber} border-dashed`
                                                : "bg-slate-900/45 border-white/10 text-slate-300"
                                        }`}
                                    >
                                        <span className={isHit ? "line-through font-semibold" : "font-semibold"}>
                                            {fn.sig}
                                        </span>
                                        <span className="text-[10px] opacity-75">
                                            {isHit ? "esborrada ✕" : `→ ${fn.ret}`}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-3 flex justify-center">
                        <div className={`px-3 py-1 rounded-lg border text-[11px] ${TONE_PILL[activeDrop.tone]}`}>
                            {activeDrop.status}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
