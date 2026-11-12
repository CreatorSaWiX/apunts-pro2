"use client";

import { useState } from "react";

type ContextId = "insert" | "update" | "delete" | "after";
type ReturnChoice = 0 | 1 | 2;
type Tone = "normal" | "sky" | "amber" | "emerald" | "rose";

interface OutcomeCard {
    label: string;
    value: string;
    tone: Tone;
}

interface ReturnOutcome {
    code: string;
    tag: string;
    tone: Exclude<Tone, "normal">;
    badge: string;
    cards: [OutcomeCard, OutcomeCard, OutcomeCard];
    note: string;
}

interface ContextConfig {
    id: ContextId;
    label: string;
    rightTitle: string;
    defaultChoice: ReturnChoice;
    activeClass: string;
    choices: [ReturnOutcome, ReturnOutcome, ReturnOutcome];
}

// Geometria exacta: 3 files x 36px + 2 gaps x 14px = 136px
const ROW_H = 36;
const GAP = 14;
const getY = (idx: number) => idx * (ROW_H + GAP) + ROW_H / 2;

const TONE_HEX: Record<Exclude<Tone, "normal">, string> = {
    sky: "#38bdf8",
    amber: "#f59e0b",
    emerald: "#10b981",
    rose: "#f43f5e",
};

const TONE_CARD_CLASS: Record<Tone, string> = {
    normal: "bg-slate-900/40 border-white/10 text-slate-300",
    sky: "bg-sky-500/15 border-sky-400/70 text-sky-200 shadow-[0_0_10px_rgba(56,189,248,0.18)]",
    amber: "bg-amber-500/10 border-amber-400/60 border-dashed text-amber-200",
    emerald: "bg-emerald-500/15 border-emerald-400/70 text-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.18)]",
    rose: "bg-rose-500/15 border-rose-500/70 text-rose-200 shadow-[0_0_10px_rgba(244,63,94,0.2)]",
};

const TONE_ACTIVE_BTN: Record<Exclude<Tone, "normal">, string> = {
    sky: "bg-sky-500/15 border-sky-400 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.2)]",
    amber: "bg-amber-500/15 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.2)]",
    emerald: "bg-emerald-500/15 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.2)]",
    rose: "bg-rose-500/15 border-rose-400 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.22)]",
};

const TONE_PILL: Record<Exclude<Tone, "normal">, string> = {
    sky: "bg-sky-500/10 border-sky-500/30 text-sky-300",
    amber: "bg-amber-500/10 border-amber-500/30 text-amber-300",
    emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    rose: "bg-rose-500/10 border-rose-500/30 text-rose-300",
};

function makeSilentCancel(code: string, tag: string, retValue: string, bdValue: string, note: string): ReturnOutcome {
    return {
        code,
        tag,
        tone: "amber",
        badge: "∅",
        cards: [
            { label: "Valor retornat", value: retValue, tone: "amber" },
            { label: "Taula BD", value: bdValue, tone: "amber" },
            { label: "Trigger AFTER", value: "No s'executa (×0)", tone: "normal" },
        ],
        note,
    };
}

function makeAfterChoice(code: string, isRecommended: boolean): ReturnOutcome {
    return {
        code,
        tag: isRecommended ? "convenció" : "ignorat",
        tone: "sky",
        badge: "—",
        cards: [
            { label: "Retorn", value: "Ignorat per l'SGBD", tone: "sky" },
            { label: "Taula BD", value: "Ja aplicada ✓", tone: "emerald" },
            { label: "Convenció", value: "Usar RETURN NULL;", tone: "sky" },
        ],
        note: "En AFTER o STATEMENT el retorn s'ignora · per convenció s'escriu RETURN NULL;",
    };
}

const CONTEXTS: Record<ContextId, ContextConfig> = {
    insert: {
        id: "insert",
        label: "BEFORE · INSERT",
        rightTitle: "OLD = NULL",
        defaultChoice: 1,
        activeClass: "bg-emerald-500/15 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)] font-semibold",
        choices: [
            {
                code: "RETURN NEW;",
                tag: "✓",
                tone: "emerald",
                badge: "✓",
                cards: [
                    { label: "Valor retornat", value: "NEW (fila nova)", tone: "emerald" },
                    { label: "Taula BD", value: "Inserida ✓", tone: "emerald" },
                    { label: "Trigger AFTER", value: "S'executa ✓", tone: "emerald" },
                ],
                note: "Insereix la fila nova (incloent modificacions fetes sobre NEW)",
            },
            makeSilentCancel(
                "RETURN OLD;",
                "trampa!",
                "OLD = NULL",
                "Cancel·lada (silenciós)",
                "Trampa d'examen: a INSERT, OLD és NULL → cancel·la sense error"
            ),
            makeSilentCancel(
                "RETURN NULL;",
                "∅",
                "NULL",
                "Cancel·lada (silenciós)",
                "Descarta silenciosament la inserció sense excepció ni AFTER"
            ),
        ],
    },
    update: {
        id: "update",
        label: "BEFORE · UPDATE",
        rightTitle: "OLD i NEW",
        defaultChoice: 0,
        activeClass: "bg-sky-500/15 border-sky-400 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.2)] font-semibold",
        choices: [
            {
                code: "RETURN NEW;",
                tag: "✓",
                tone: "emerald",
                badge: "✓",
                cards: [
                    { label: "Valor retornat", value: "NEW (modificada)", tone: "emerald" },
                    { label: "Taula BD", value: "Actualitzada ✓", tone: "emerald" },
                    { label: "Trigger AFTER", value: "S'executa ✓", tone: "emerald" },
                ],
                note: "Modifica la fila amb els valors de NEW i continua cap a AFTER",
            },
            makeSilentCancel(
                "RETURN OLD;",
                "∅",
                "OLD (antiga)",
                "Cancel·lada (sense canvis)",
                "En UPDATE, retornar OLD descarta silenciosament el canvi d'aquella fila"
            ),
            makeSilentCancel(
                "RETURN NULL;",
                "∅",
                "NULL",
                "Cancel·lada (silenciós)",
                "Cancel·la silenciosament la modificació sense error ni AFTER"
            ),
        ],
    },
    delete: {
        id: "delete",
        label: "BEFORE · DELETE",
        rightTitle: "NEW = NULL",
        defaultChoice: 1,
        activeClass: "bg-amber-500/15 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)] font-semibold",
        choices: [
            makeSilentCancel(
                "RETURN NEW;",
                "NULL",
                "NEW = NULL",
                "Cancel·lada (conserva)",
                "A DELETE, NEW és NULL · cal retornar OLD per esborrar la fila"
            ),
            {
                code: "RETURN OLD;",
                tag: "✓",
                tone: "emerald",
                badge: "✓",
                cards: [
                    { label: "Valor retornat", value: "OLD (fila a esborrar)", tone: "emerald" },
                    { label: "Taula BD", value: "Esborrada ✓", tone: "emerald" },
                    { label: "Trigger AFTER", value: "S'executa ✓", tone: "emerald" },
                ],
                note: "Esborra la fila normalment i dispara el trigger AFTER DELETE",
            },
            makeSilentCancel(
                "RETURN NULL;",
                "∅",
                "NULL",
                "Cancel·lada (conserva)",
                "Cancel·la silenciosament l'esborrat · la fila continua a la taula"
            ),
        ],
    },
    after: {
        id: "after",
        label: "AFTER / STMT",
        rightTitle: "ignorat",
        defaultChoice: 2,
        activeClass: "bg-sky-500/15 border-sky-400 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.2)] font-semibold",
        choices: [
            makeAfterChoice("RETURN NEW;", false),
            makeAfterChoice("RETURN OLD;", false),
            makeAfterChoice("RETURN NULL;", true),
        ],
    },
};

const CONTEXT_ORDER: ContextId[] = ["insert", "update", "delete", "after"];

export default function TriggerReturnVisualizer() {
    const [contextId, setContextId] = useState<ContextId>("insert");
    const [choiceIdx, setChoiceIdx] = useState<ReturnChoice>(1);

    const ctx = CONTEXTS[contextId];
    const current = ctx.choices[choiceIdx];
    const y1 = getY(choiceIdx);
    const activeColor = TONE_HEX[current.tone];

    return (
        <div className="w-full max-w-xl mx-auto my-6 not-prose select-none font-mono text-xs">
            {/* Selector de context de trigger */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pb-4">
                {CONTEXT_ORDER.map((id) => {
                    const item = CONTEXTS[id];
                    const isSelected = contextId === id;
                    return (
                        <button
                            key={id}
                            type="button"
                            onClick={() => {
                                setContextId(id);
                                setChoiceIdx(item.defaultChoice);
                            }}
                            className={`px-2.5 py-1 rounded-md border text-[10.5px] sm:text-[11px] transition-all duration-150 cursor-pointer ${
                                isSelected
                                    ? item.activeClass
                                    : "bg-slate-900/30 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10"
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
                style={{ gridTemplateColumns: "1fr 56px 1.2fr" }}
            >
                <span>RETORN DEL TRIGGER</span>
                <span />
                <div className="flex items-center justify-between">
                    <span>EFECTE</span>
                    <span className="text-slate-600">{ctx.rightTitle}</span>
                </div>
            </div>

            {/* Cos principal: 3 opcions de RETURN + SVG + 3 targetes d'efecte */}
            <div
                className="relative grid items-center"
                style={{ gridTemplateColumns: "1fr 56px 1.2fr" }}
            >
                {/* Columna esquerra */}
                <div className="flex flex-col gap-[14px]">
                    {ctx.choices.map((item, idx) => {
                        const rIdx = idx as ReturnChoice;
                        const isActive = choiceIdx === rIdx;

                        return (
                            <button
                                key={`${contextId}-${idx}`}
                                type="button"
                                onMouseEnter={() => setChoiceIdx(rIdx)}
                                onClick={() => setChoiceIdx(rIdx)}
                                className={`h-9 px-2.5 rounded-lg border text-left transition-all duration-150 cursor-pointer flex items-center justify-between gap-1 ${
                                    isActive
                                        ? TONE_ACTIVE_BTN[item.tone]
                                        : "bg-slate-900/40 border-white/10 text-slate-400 hover:text-slate-200 hover:border-slate-600"
                                }`}
                            >
                                <span className="truncate text-[10.5px] sm:text-[11px] font-medium">
                                    {item.code}
                                </span>
                                <span className="text-[9.5px] font-bold opacity-80 shrink-0">
                                    {item.tag}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Connexions SVG alineades al píxel */}
                <svg
                    viewBox="0 0 56 136"
                    className="w-full h-[136px] pointer-events-none overflow-visible"
                >
                    <defs>
                        {(Object.keys(TONE_HEX) as Exclude<Tone, "normal">[]).map((tone) => (
                            <marker
                                key={tone}
                                id={`ret-arrow-${tone}`}
                                viewBox="0 0 6 6"
                                refX="4.5"
                                refY="3"
                                markerWidth="4.5"
                                markerHeight="4.5"
                                orient="auto"
                            >
                                <path d="M 0 0 L 6 3 L 0 6 z" fill={TONE_HEX[tone]} />
                            </marker>
                        ))}
                    </defs>

                    {[0, 1, 2].map((cardIdx) => {
                        const y2 = getY(cardIdx);
                        const isMiddle = cardIdx === 1;
                        return (
                            <g key={`${contextId}-${choiceIdx}-c-${cardIdx}`}>
                                <path
                                    d={`M 0,${y1} C 28,${y1} 28,${y2} 53,${y2}`}
                                    fill="none"
                                    stroke={activeColor}
                                    strokeWidth={isMiddle ? 1.9 : 1.3}
                                    strokeOpacity={isMiddle ? 1 : 0.55}
                                    strokeDasharray={current.tone === "amber" ? "3 3" : undefined}
                                    markerEnd={`url(#ret-arrow-${current.tone})`}
                                    className="transition-all duration-200"
                                />
                                {isMiddle && (
                                    <g transform={`translate(28, ${(y1 + y2) / 2})`}>
                                        <rect
                                            x="-10"
                                            y="-8"
                                            width="20"
                                            height="16"
                                            rx="4"
                                            fill="#020617"
                                            stroke={activeColor}
                                            strokeWidth="1"
                                        />
                                        <text
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            y="0.5"
                                            fill={activeColor}
                                            fontSize="9.5"
                                            fontWeight="bold"
                                        >
                                            {current.badge}
                                        </text>
                                    </g>
                                )}
                            </g>
                        );
                    })}
                </svg>

                {/* Columna dreta: 3 targetes */}
                <div className="flex flex-col gap-[14px]">
                    {current.cards.map((card) => (
                        <div
                            key={card.label}
                            className={`h-9 px-2.5 rounded-lg border flex items-center justify-between gap-2 transition-all duration-200 ${TONE_CARD_CLASS[card.tone]}`}
                        >
                            <span className="text-[9.5px] opacity-65 truncate">{card.label}</span>
                            <span className="text-[10.5px] sm:text-[11px] font-bold truncate shrink-0">
                                {card.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Nota compacta en 1 línia */}
            <div className="mt-4 flex justify-center">
                <div className={`px-3 py-1 rounded-lg border text-[11px] transition-colors ${TONE_PILL[current.tone]}`}>
                    {current.note}
                </div>
            </div>
        </div>
    );
}
