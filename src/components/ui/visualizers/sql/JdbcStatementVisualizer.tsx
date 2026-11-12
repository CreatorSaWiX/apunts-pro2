"use client";

import { useState } from "react";

type ModeId = "statement" | "prepared" | "cursors";
type CursorMode = "same" | "separate";
type Tone = "sky" | "amber" | "emerald" | "rose" | "violet";

interface FlowRow {
    id: number;
    leftCode: string;
    rightTitle: string;
    rightSub: string;
    badge: string;
    tone: Tone;
    note: string;
}

// Geometria exacta per a Statement / Prepared (4 files x 36px + 3 gaps x 8px = 168px)
const ROW_H_4 = 36;
const GAP_4 = 8;
const TOTAL_H_4 = 4 * ROW_H_4 + 3 * GAP_4; // 168px
const getY4 = (idx: number) => idx * (ROW_H_4 + GAP_4) + ROW_H_4 / 2; // 18, 62, 106, 150

// Geometria exacta per a Cursors (esquerra 3x38px + 2x12px = 138px; dreta 2x44px + 20px + 2x15px = 138px)
const CUR_LEFT_H = 38;
const CUR_LEFT_GAP = 12;
const TOTAL_H_CUR = 3 * CUR_LEFT_H + 2 * CUR_LEFT_GAP; // 138px
const CUR_RIGHT_H = 44;
const CUR_RIGHT_GAP = 20;
const CUR_OFFSET_RIGHT = (TOTAL_H_CUR - (2 * CUR_RIGHT_H + CUR_RIGHT_GAP)) / 2; // 15px
const getYCurLeft = (idx: 0 | 1 | 2) => idx * (CUR_LEFT_H + CUR_LEFT_GAP) + CUR_LEFT_H / 2; // 19, 69, 119
const getYCurRight = (idx: 0 | 1) => CUR_OFFSET_RIGHT + idx * (CUR_RIGHT_H + CUR_RIGHT_GAP) + CUR_RIGHT_H / 2; // 37, 101

const SVG_W = 64;

const STATEMENT_ROWS: FlowRow[] = [
    {
        id: 0,
        leftCode: "st.executeUpdate(sql₁)",
        rightTitle: "Compila + Executa",
        rightSub: "→ int",
        badge: "compila",
        tone: "amber",
        note: "1a crida: l'SGBD analitza i compila el pla des de zero",
    },
    {
        id: 1,
        leftCode: "st.executeUpdate(sql₂)",
        rightTitle: "Compila + Executa",
        rightSub: "→ int",
        badge: "compila",
        tone: "amber",
        note: "2a crida: torna a recompilar tota la sentència SQL",
    },
    {
        id: 2,
        leftCode: "st.executeUpdate(sql₃)",
        rightTitle: "Compila + Executa",
        rightSub: "→ int",
        badge: "compila",
        tone: "amber",
        note: "3a crida: executeUpdate retorna int (files afectades, 0 si cap)",
    },
    {
        id: 3,
        leftCode: "st.executeQuery(sql₄)",
        rightTitle: "Compila + Executa",
        rightSub: "→ RS",
        badge: "compila",
        tone: "sky",
        note: "executeQuery retorna un ResultSet amb les files del SELECT",
    },
];

const PREPARED_ROWS: FlowRow[] = [
    {
        id: 0,
        leftCode: 'prepareStatement("... ?")',
        rightTitle: "Pla compilat (1×)",
        rightSub: "reutilitzable",
        badge: "1×",
        tone: "sky",
        note: "Preparat fora del bucle: l'SGBD compila la sentència un sol cop",
    },
    {
        id: 1,
        leftCode: 'ps.setString(1, "titelles")',
        rightTitle: "Enllaça ?₁",
        rightSub: "índex 1..",
        badge: "?₁",
        tone: "amber",
        note: "Els paràmetres ? s'assignen indexant sempre des d'1 (setString, setInt...)",
    },
    {
        id: 2,
        leftCode: "ps.executeUpdate()",
        rightTitle: "Executa pla",
        rightSub: "→ int",
        badge: "×N",
        tone: "emerald",
        note: "Reutilitza el pla sense recompilar i retorna el nombre de files afectades",
    },
    {
        id: 3,
        leftCode: "ps.executeQuery()",
        rightTitle: "Executa pla",
        rightSub: "→ RS",
        badge: "×N",
        tone: "violet",
        note: "Reutilitza el pla precompilat i retorna un ResultSet (sense passar sql)",
    },
];

const TONE_HEX: Record<Tone, string> = {
    sky: "#38bdf8",
    amber: "#f59e0b",
    emerald: "#10b981",
    rose: "#f43f5e",
    violet: "#a78bfa",
};

const TONE_CARD: Record<Tone, string> = {
    sky: "bg-sky-500/15 border-sky-400 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.2)]",
    amber: "bg-amber-500/15 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.2)]",
    emerald: "bg-emerald-500/15 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.2)]",
    rose: "bg-rose-500/15 border-rose-500 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.2)]",
    violet: "bg-violet-500/15 border-violet-400 text-violet-200 shadow-[0_0_12px_rgba(167,139,250,0.2)]",
};

const TONE_PILL: Record<Tone, string> = {
    sky: "bg-sky-500/10 border-sky-500/30 text-sky-300",
    amber: "bg-amber-500/10 border-amber-500/30 text-amber-300",
    emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    rose: "bg-rose-500/10 border-rose-500/30 text-rose-300",
    violet: "bg-violet-500/10 border-violet-500/30 text-violet-300",
};

export default function JdbcStatementVisualizer() {
    const [mode, setMode] = useState<ModeId>("prepared");
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
    const [cursorMode, setCursorMode] = useState<CursorMode>("same");

    const rows = mode === "statement" ? STATEMENT_ROWS : PREPARED_ROWS;
    const hoveredRow = hoveredIdx !== null ? rows[hoveredIdx] : null;

    return (
        <div className="w-full max-w-xl mx-auto my-6 not-prose select-none font-mono text-xs">
            {/* Selector de mode */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pb-4">
                {(
                    [
                        { id: "statement" as const, label: "Statement", activeClass: TONE_CARD.amber },
                        { id: "prepared" as const, label: "PreparedStatement", activeClass: TONE_CARD.emerald },
                        { id: "cursors" as const, label: "Cursors simultanis", activeClass: TONE_CARD.sky },
                    ] as const
                ).map((tab) => {
                    const isSelected = mode === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => {
                                setMode(tab.id);
                                setHoveredIdx(null);
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

            {mode !== "cursors" ? (
                <>
                    {/* Capçaleres */}
                    <div
                        className="grid items-center text-[10px] text-slate-500 font-semibold tracking-wider pb-2"
                        style={{ gridTemplateColumns: "1.25fr 64px 1fr" }}
                    >
                        <span>JAVA ({mode === "statement" ? "Statement" : "PreparedStatement"})</span>
                        <span />
                        <span className="text-right">SGBD / RETORN</span>
                    </div>

                    {/* Cos 4 files alineat al píxel */}
                    <div
                        className="relative grid items-start"
                        style={{ gridTemplateColumns: "1.25fr 64px 1fr" }}
                    >
                        {/* Crides Java */}
                        <div className="flex flex-col gap-2">
                            {rows.map((row) => {
                                const isHovered = hoveredIdx === row.id;
                                const isDimmed = hoveredIdx !== null && !isHovered;

                                return (
                                    <button
                                        key={`${mode}-l-${row.id}`}
                                        type="button"
                                        onMouseEnter={() => setHoveredIdx(row.id)}
                                        onMouseLeave={() => setHoveredIdx(null)}
                                        onClick={() =>
                                            setHoveredIdx((curr) => (curr === row.id ? null : row.id))
                                        }
                                        className={`h-9 px-2.5 rounded-lg border text-left flex items-center transition-all duration-150 cursor-pointer ${
                                            isDimmed
                                                ? "bg-slate-900/20 border-white/5 text-slate-600 opacity-30"
                                                : isHovered
                                                ? TONE_CARD[row.tone]
                                                : "bg-slate-900/45 border-white/10 text-slate-200 hover:border-slate-600"
                                        }`}
                                    >
                                        <span className="text-[11px] truncate">{row.leftCode}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Connexions SVG */}
                        <svg
                            viewBox={`0 0 ${SVG_W} ${TOTAL_H_4}`}
                            style={{ height: TOTAL_H_4 }}
                            className="w-full pointer-events-none overflow-visible"
                        >
                            {rows.map((row) => {
                                const y = getY4(row.id);
                                const isHovered = hoveredIdx === row.id;
                                const isDimmed = hoveredIdx !== null && !isHovered;
                                const color = isDimmed ? "#334155" : TONE_HEX[row.tone];
                                const opacity = isDimmed ? 0.2 : isHovered ? 1 : 0.85;

                                return (
                                    <g
                                        key={`${mode}-e-${row.id}`}
                                        opacity={opacity}
                                        className="transition-opacity duration-150"
                                    >
                                        <path
                                            d={`M 0,${y} L ${SVG_W},${y}`}
                                            fill="none"
                                            stroke={color}
                                            strokeWidth={isHovered ? 2.2 : 1.6}
                                            strokeDasharray={mode === "statement" ? "3 3" : undefined}
                                        />
                                        <g transform={`translate(32, ${y})`}>
                                            <rect
                                                x="-19"
                                                y="-8"
                                                width="38"
                                                height="16"
                                                rx="4"
                                                fill="#020617"
                                                stroke={color}
                                                strokeWidth="1"
                                            />
                                            <text
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                y="1"
                                                fill={color}
                                                fontSize="8.5"
                                                fontWeight="bold"
                                            >
                                                {row.badge}
                                            </text>
                                        </g>
                                    </g>
                                );
                            })}
                        </svg>

                        {/* Execució SGBD i tipus de retorn */}
                        <div className="flex flex-col gap-2">
                            {rows.map((row) => {
                                const isHovered = hoveredIdx === row.id;
                                const isDimmed = hoveredIdx !== null && !isHovered;

                                return (
                                    <button
                                        key={`${mode}-r-${row.id}`}
                                        type="button"
                                        onMouseEnter={() => setHoveredIdx(row.id)}
                                        onMouseLeave={() => setHoveredIdx(null)}
                                        onClick={() =>
                                            setHoveredIdx((curr) => (curr === row.id ? null : row.id))
                                        }
                                        className={`h-9 px-2.5 rounded-lg border flex items-center justify-between gap-1 text-left transition-all duration-150 cursor-pointer ${
                                            isDimmed
                                                ? "bg-slate-900/20 border-white/5 text-slate-600 opacity-30"
                                                : TONE_CARD[row.tone]
                                        }`}
                                    >
                                        <span className="text-[11px] font-semibold truncate">
                                            {row.rightTitle}
                                        </span>
                                        <span className="text-[9.5px] opacity-80 shrink-0">
                                            {row.rightSub}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Resum en 1 línia */}
                    <div className="mt-3 flex justify-center">
                        <div
                            className={`px-3 py-1 rounded-lg border text-[11px] transition-colors ${
                                hoveredRow
                                    ? TONE_PILL[hoveredRow.tone]
                                    : mode === "statement"
                                    ? TONE_PILL.amber
                                    : TONE_PILL.emerald
                            }`}
                        >
                            {hoveredRow
                                ? hoveredRow.note
                                : mode === "statement"
                                ? "Statement recompila cada sentència · evita'l dins de bucles"
                                : "PreparedStatement compila 1 cop · paràmetres ? des d'1"}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* Selector: Mateix st vs st1 + st2 separats */}
                    <div className="flex flex-wrap items-center justify-center gap-1.5 pb-4">
                        <button
                            type="button"
                            onClick={() => setCursorMode("same")}
                            className={`px-2.5 py-1 rounded-md border text-[11px] transition-all duration-150 cursor-pointer ${
                                cursorMode === "same"
                                    ? `${TONE_CARD.rose} font-semibold`
                                    : "bg-slate-900/30 border-white/5 text-slate-400 hover:text-slate-200"
                            }`}
                        >
                            Mateix st (1 sol objecte) ✕
                        </button>
                        <button
                            type="button"
                            onClick={() => setCursorMode("separate")}
                            className={`px-2.5 py-1 rounded-md border text-[11px] transition-all duration-150 cursor-pointer ${
                                cursorMode === "separate"
                                    ? `${TONE_CARD.emerald} font-semibold`
                                    : "bg-slate-900/30 border-white/5 text-slate-400 hover:text-slate-200"
                            }`}
                        >
                            st₁ i st₂ separats ✓
                        </button>
                    </div>

                    {/* Capçaleres */}
                    <div
                        className="grid items-center text-[10px] text-slate-500 font-semibold tracking-wider pb-2"
                        style={{ gridTemplateColumns: "1.2fr 64px 1fr" }}
                    >
                        <span>CONSULTES IMBRICADES</span>
                        <span />
                        <span className="text-right">CURSORS OBERTS</span>
                    </div>

                    {/* Cos: 3 sentències -> SVG -> 2 ResultSet */}
                    <div
                        className="relative grid items-start"
                        style={{ gridTemplateColumns: "1.2fr 64px 1fr" }}
                    >
                        <div className="flex flex-col gap-3">
                            <div
                                className={`h-[38px] px-2.5 rounded-lg border flex items-center justify-between text-[11px] ${
                                    cursorMode === "same" ? TONE_CARD.rose : TONE_CARD.emerald
                                }`}
                            >
                                <span className="truncate">rs1 = st1.executeQuery(...)</span>
                                <span className="text-[9px] opacity-75 shrink-0">st1</span>
                            </div>
                            <div className="h-[38px] px-2.5 rounded-lg border bg-slate-900/40 border-white/10 text-slate-300 flex items-center justify-between text-[11px]">
                                <span className="truncate">while (rs1.next())</span>
                                <span
                                    className={`text-[9px] font-bold shrink-0 ${
                                        cursorMode === "same" ? "text-rose-400" : "text-emerald-400"
                                    }`}
                                >
                                    {cursorMode === "same" ? "tancat ✕" : "actiu"}
                                </span>
                            </div>
                            <div
                                className={`h-[38px] px-2.5 rounded-lg border flex items-center justify-between text-[11px] ${
                                    cursorMode === "same" ? TONE_CARD.amber : TONE_CARD.sky
                                }`}
                            >
                                <span className="truncate">
                                    rs2 = {cursorMode === "same" ? "st1" : "st2"}.executeQuery(...)
                                </span>
                                <span className="text-[9px] font-bold opacity-85 shrink-0">
                                    {cursorMode === "same" ? "st1!" : "st2"}
                                </span>
                            </div>
                        </div>

                        <svg
                            viewBox={`0 0 ${SVG_W} ${TOTAL_H_CUR}`}
                            style={{ height: TOTAL_H_CUR }}
                            className="w-full pointer-events-none overflow-visible"
                        >
                            <defs>
                                {(Object.keys(TONE_HEX) as Tone[]).map((t) => (
                                    <marker
                                        key={t}
                                        id={`cur-arrow-${t}`}
                                        viewBox="0 0 10 10"
                                        refX="7"
                                        refY="5"
                                        markerWidth="5"
                                        markerHeight="5"
                                        orient="auto"
                                    >
                                        <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill={TONE_HEX[t]} />
                                    </marker>
                                ))}
                            </defs>

                            {cursorMode === "same" ? (
                                <>
                                    {/* st1 al pas 2 tanca rs1 */}
                                    <path
                                        d={`M 0,${getYCurLeft(2)} C 32,${getYCurLeft(2)} 32,${getYCurRight(0)} 57,${getYCurRight(0)}`}
                                        fill="none"
                                        stroke={TONE_HEX.rose}
                                        strokeWidth="1.9"
                                        strokeDasharray="3 3"
                                        markerEnd="url(#cur-arrow-rose)"
                                    />
                                    <g transform={`translate(32, ${(getYCurLeft(2) + getYCurRight(0)) / 2})`}>
                                        <rect
                                            x="-18"
                                            y="-8"
                                            width="36"
                                            height="16"
                                            rx="4"
                                            fill="#020617"
                                            stroke={TONE_HEX.rose}
                                            strokeWidth="1"
                                        />
                                        <text
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            y="1"
                                            fill={TONE_HEX.rose}
                                            fontSize="8.5"
                                            fontWeight="bold"
                                        >
                                            tanca ✕
                                        </text>
                                    </g>
                                    {/* i obre rs2 */}
                                    <path
                                        d={`M 0,${getYCurLeft(2)} C 32,${getYCurLeft(2)} 32,${getYCurRight(1)} 57,${getYCurRight(1)}`}
                                        fill="none"
                                        stroke={TONE_HEX.amber}
                                        strokeWidth="1.8"
                                        markerEnd="url(#cur-arrow-amber)"
                                    />
                                </>
                            ) : (
                                <>
                                    <path
                                        d={`M 0,${getYCurLeft(0)} C 32,${getYCurLeft(0)} 32,${getYCurRight(0)} 57,${getYCurRight(0)}`}
                                        fill="none"
                                        stroke={TONE_HEX.emerald}
                                        strokeWidth="2"
                                        markerEnd="url(#cur-arrow-emerald)"
                                    />
                                    <path
                                        d={`M 0,${getYCurLeft(2)} C 32,${getYCurLeft(2)} 32,${getYCurRight(1)} 57,${getYCurRight(1)}`}
                                        fill="none"
                                        stroke={TONE_HEX.sky}
                                        strokeWidth="2"
                                        markerEnd="url(#cur-arrow-sky)"
                                    />
                                </>
                            )}
                        </svg>

                        <div
                            className="flex flex-col gap-5"
                            style={{
                                paddingTop: `${CUR_OFFSET_RIGHT}px`,
                                paddingBottom: `${CUR_OFFSET_RIGHT}px`,
                            }}
                        >
                            <div
                                className={`h-11 px-2.5 rounded-lg border flex items-center justify-between transition-all duration-150 ${
                                    cursorMode === "same" ? TONE_CARD.rose : TONE_CARD.emerald
                                }`}
                            >
                                <span
                                    className={`text-[11px] font-bold ${
                                        cursorMode === "same" ? "line-through" : ""
                                    }`}
                                >
                                    rs1 (st1)
                                </span>
                                <span className="text-[10px] font-semibold">
                                    {cursorMode === "same" ? "TANCAT ✕" : "OBERT ✓"}
                                </span>
                            </div>
                            <div
                                className={`h-11 px-2.5 rounded-lg border flex items-center justify-between transition-all duration-150 ${
                                    cursorMode === "same" ? TONE_CARD.amber : TONE_CARD.sky
                                }`}
                            >
                                <span className="text-[11px] font-bold">
                                    rs2 ({cursorMode === "same" ? "st1" : "st2"})
                                </span>
                                <span className="text-[10px] font-semibold">OBERT ✓</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 flex justify-center">
                        <div
                            className={`px-3 py-1 rounded-lg border text-[11px] ${
                                cursorMode === "same" ? TONE_PILL.rose : TONE_PILL.emerald
                            }`}
                        >
                            {cursorMode === "same"
                                ? "1 Statement = 1 ResultSet: reexecutar sobre st1 tanca rs1 automàticament"
                                : "st1 i st2 separats mantenen tots dos ResultSet oberts alhora"}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
