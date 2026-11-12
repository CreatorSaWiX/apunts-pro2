"use client";

import { useState } from "react";

type ModeId = "valid" | "r1_cap" | "r2_level" | "r3_leaf" | "r4_dup";
type Tone = "emerald" | "rose" | "sky" | "amber";

interface RuleStatus {
    id: string;
    label: string;
    ok: boolean;
}

const SVG_W = 520;
const SVG_H = 188;

const TONE_TAB: Record<Tone, string> = {
    emerald: "bg-emerald-500/15 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)] font-semibold",
    rose: "bg-rose-500/15 border-rose-400 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)] font-semibold",
    sky: "bg-sky-500/15 border-sky-400 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.2)] font-semibold",
    amber: "bg-amber-500/15 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)] font-semibold",
};

const TONE_PILL: Record<Tone, string> = {
    emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    rose: "bg-rose-500/10 border-rose-500/30 text-rose-300",
    sky: "bg-sky-500/10 border-sky-500/30 text-sky-300",
    amber: "bg-amber-500/10 border-amber-500/30 text-amber-300",
};

const TABS: { id: ModeId; label: string; tone: Tone }[] = [
    { id: "valid", label: "VÀLID (d = 1)", tone: "emerald" },
    { id: "r1_cap", label: "✕ R1: Capacitat", tone: "rose" },
    { id: "r2_level", label: "✕ R2: Nivell h", tone: "rose" },
    { id: "r3_leaf", label: "✕ R3: No a fulla", tone: "rose" },
    { id: "r4_dup", label: "✕ R4: Duplicat intern", tone: "rose" },
];

interface ValidLeafSpec {
    idx: 0 | 1 | 2;
    cx: number;
    ptrX: number;
    rangeLabel: string;
    keys: [string, string];
    rids: [string, string];
    repeatedKeyIdx?: 0;
    rootHighlightKey?: 0 | 1;
    note: string;
}

const VALID_LEAVES: ValidLeafSpec[] = [
    {
        idx: 0,
        cx: 92,
        ptrX: 204,
        rangeLabel: "< 20",
        keys: ["10", "15"],
        rids: ["r₁", "r₂"],
        note: "f₀ (< 20): totes les claus són menors que 20 · fulla amb [valor, RID]",
    },
    {
        idx: 1,
        cx: 260,
        ptrX: 260,
        rangeLabel: "20 ≤ x < 40",
        keys: ["20", "30"],
        rids: ["r₃", "r₄"],
        repeatedKeyIdx: 0,
        rootHighlightKey: 0,
        note: "f₁ (20 ≤ x < 40): el 20 de l'arrel és repetit a la fulla (Regla 3)",
    },
    {
        idx: 2,
        cx: 428,
        ptrX: 316,
        rangeLabel: "≥ 40",
        keys: ["40", "55"],
        rids: ["r₅", "r₆"],
        repeatedKeyIdx: 0,
        rootHighlightKey: 1,
        note: "f₂ (≥ 40): el 40 de l'arrel és repetit a la fulla · fulles enllaçades ⇄",
    },
];

function getRulesStatus(mode: ModeId): RuleStatus[] {
    return [
        { id: "r1", label: "R1 Capacitat", ok: mode !== "r1_cap" },
        { id: "r2", label: "R2 Nivell h", ok: mode !== "r2_level" },
        { id: "r3", label: "R3 100% fulles", ok: mode !== "r3_leaf" },
        { id: "r4", label: "R4 Ordre/Únics", ok: mode !== "r4_dup" },
    ];
}

function LinkedArrows({ x1, x2, y }: { x1: number; x2: number; y: number }) {
    return (
        <g stroke="#38bdf8" strokeWidth="1.2" opacity={0.65}>
            <line x1={x1 + 3} y1={y - 4} x2={x2 - 4} y2={y - 4} markerEnd="url(#bp-arrow-sky)" />
            <line x1={x2 - 3} y1={y + 4} x2={x1 + 4} y2={y + 4} markerEnd="url(#bp-arrow-sky)" />
        </g>
    );
}

interface Internal2KeyNodeProps {
    cx: number;
    y: number;
    k1: string;
    k2: string;
    k1Tone?: "normal" | "sky" | "rose";
    k2Tone?: "normal" | "sky" | "rose";
}

function Internal2KeyNode({
    cx,
    y,
    k1,
    k2,
    k1Tone = "normal",
    k2Tone = "normal",
}: Internal2KeyNodeProps) {
    const x0 = cx - 68; // width = 136
    const keyStyle = (tone: "normal" | "sky" | "rose") =>
        tone === "rose"
            ? { fill: "#240b12", stroke: "#f43f5e", text: "#fecdd3" }
            : tone === "sky"
            ? { fill: "#0c223d", stroke: "#38bdf8", text: "#bae6fd" }
            : { fill: "#0b1324", stroke: "#334155", text: "#e2e8f0" };

    const s1 = keyStyle(k1Tone);
    const s2 = keyStyle(k2Tone);

    return (
        <g>
            <rect
                x={x0}
                y={y}
                width={136}
                height={34}
                rx={8}
                fill="#0b1324"
                stroke="#38bdf8"
                strokeOpacity={0.55}
                strokeWidth="1.3"
            />
            {/* Key 1 */}
            <rect x={x0 + 22} y={y + 4} width={36} height={26} rx={4} fill={s1.fill} stroke={s1.stroke} strokeWidth="1" />
            <text x={x0 + 40} y={y + 18} textAnchor="middle" dominantBaseline="middle" fill={s1.text} fontSize="12" fontWeight="bold">
                {k1}
            </text>
            {/* Key 2 */}
            <rect x={x0 + 78} y={y + 4} width={36} height={26} rx={4} fill={s2.fill} stroke={s2.stroke} strokeWidth="1" />
            <text x={x0 + 96} y={y + 18} textAnchor="middle" dominantBaseline="middle" fill={s2.text} fontSize="12" fontWeight="bold">
                {k2}
            </text>
            {/* 3 pointer slots: f0, f1, f2 */}
            {[12, 68, 124].map((dx) => (
                <circle key={dx} cx={x0 + dx} cy={y + 28} r={2.6} fill="#38bdf8" opacity={0.85} />
            ))}
        </g>
    );
}

interface Leaf2NodeProps {
    cx: number;
    y: number;
    keys: [string, string];
    rids: [string, string];
    active?: boolean;
    errorKeyIdx?: 0 | 1;
    highlightKeyIdx?: 0 | 1;
    onHover?: () => void;
    onLeave?: () => void;
}

function Leaf2Node({
    cx,
    y,
    keys,
    rids,
    active = false,
    errorKeyIdx,
    highlightKeyIdx,
    onHover,
    onLeave,
}: Leaf2NodeProps) {
    const x0 = cx - 66; // width = 132
    const borderColor = errorKeyIdx !== undefined ? "#f43f5e" : active ? "#38bdf8" : "#334155";
    const bg = errorKeyIdx !== undefined ? "#1a0910" : active ? "#0c1d33" : "#0b1324";

    return (
        <g
            className={onHover ? "cursor-pointer" : undefined}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            onClick={onHover}
        >
            <rect
                x={x0}
                y={y}
                width={132}
                height={44}
                rx={8}
                fill={bg}
                stroke={borderColor}
                strokeWidth={active || errorKeyIdx !== undefined ? 1.5 : 1.2}
            />
            {[0, 1].map((idx) => {
                const bx = x0 + 6 + idx * 62;
                const isErr = errorKeyIdx === idx;
                const isHi = highlightKeyIdx === idx;
                return (
                    <g key={idx}>
                        <rect
                            x={bx}
                            y={y + 5}
                            width={58}
                            height={34}
                            rx={5}
                            fill={isErr ? "#2e0d17" : isHi ? "#0e2948" : "#0f172a"}
                            stroke={isErr ? "#f43f5e" : isHi ? "#38bdf8" : "#1e293b"}
                            strokeWidth="1"
                        />
                        <text
                            x={bx + 29}
                            y={y + 17}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill={isErr ? "#fecdd3" : isHi ? "#bae6fd" : "#e2e8f0"}
                            fontSize="12"
                            fontWeight="bold"
                        >
                            {keys[idx]}
                        </text>
                        <text
                            x={bx + 29}
                            y={y + 31}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#64748b"
                            fontSize="8.5"
                        >
                            {rids[idx]}
                        </text>
                    </g>
                );
            })}
        </g>
    );
}

/**
 * Interactive minimalist visualizer for B+ tree structure (order d, internal routing,
 * doubly-linked leaves with RIDs) and the 4 exam validation rules.
 */
export default function BPlusTreeVisualizer() {
    const [mode, setMode] = useState<ModeId>("valid");
    const [activeLeaf, setActiveLeaf] = useState<0 | 1 | 2 | null>(1);

    const rules = getRulesStatus(mode);
    const hoveredSpec =
        mode === "valid" && activeLeaf !== null ? VALID_LEAVES[activeLeaf] : null;

    const statusInfo: { text: string; tone: Tone } = (() => {
        if (mode === "valid") {
            return hoveredSpec
                ? { text: hoveredSpec.note, tone: "sky" }
                : {
                      text: "Arbre B+ d = 1 vàlid: nodes amb [1, 2] claus, fulles al nivell 2 i claus internes repetides",
                      tone: "emerald",
                  };
        }
        if (mode === "r1_cap") {
            return {
                text: "✕ Regla 1: la fulla dreta té 3 claus (> 2d = 2) · excedeix la capacitat màxima",
                tone: "rose",
            };
        }
        if (mode === "r2_level") {
            return {
                text: "✕ Regla 2: desequilibrat · la fulla esquerra és al nivell 2 i les dretes al nivell 3",
                tone: "rose",
            };
        }
        if (mode === "r3_leaf") {
            return {
                text: "✕ Regla 3: el valor intern 20 no apareix repetit a cap fulla (les fulles han de tenir el 100%)",
                tone: "rose",
            };
        }
        return {
            text: "✕ Regla 4: el valor 30 està duplicat en dos nodes interns (prohibit als nivells interns)",
            tone: "rose",
        };
    })();

    return (
        <div className="w-full max-w-xl mx-auto my-6 not-prose select-none font-mono text-xs">
            {/* Selector de cas */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pb-3">
                {TABS.map((tab) => {
                    const isSelected = tab.id === mode;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => {
                                setMode(tab.id);
                                setActiveLeaf(tab.id === "valid" ? 1 : null);
                            }}
                            className={`px-2.5 py-1 rounded-md border text-[11px] transition-all duration-150 cursor-pointer ${
                                isSelected
                                    ? TONE_TAB[tab.tone]
                                    : "bg-slate-900/30 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10"
                            }`}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Capçalera minimalista */}
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold tracking-wider px-1 pb-1">
                <span>ORDRE d = 1 · CAPACITAT [1..2]</span>
                <span className="text-slate-600">
                    {mode === "valid" ? "PASSA PER LES FULLES" : "ARBRE INVÀLID"}
                </span>
            </div>

            {/* Diagrama SVG de l'arbre B+ */}
            <div className="rounded-xl border border-white/10 bg-slate-950/60 px-2 py-2">
                <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-auto overflow-visible">
                    <defs>
                        {[
                            { id: "bp-arrow-slate", color: "#475569" },
                            { id: "bp-arrow-sky", color: "#38bdf8" },
                            { id: "bp-arrow-rose", color: "#f43f5e" },
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

                    {/* MODES 2-NIVELLS: VÀLID, R1 CAPACITAT, R3 FALTA A FULLA */}
                    {(mode === "valid" || mode === "r1_cap" || mode === "r3_leaf") && (
                        <>
                            {/* Etiquetes de nivell */}
                            <text x="8" y="34" fill="#475569" fontSize="9.5" fontWeight="bold">
                                h=1
                            </text>
                            <text x="8" y="139" fill="#475569" fontSize="9.5" fontWeight="bold">
                                h=2
                            </text>

                            {/* Arrel [ 20 | 40 ] */}
                            <Internal2KeyNode
                                cx={260}
                                y={14}
                                k1="20"
                                k2="40"
                                k1Tone={
                                    mode === "r3_leaf"
                                        ? "rose"
                                        : hoveredSpec?.rootHighlightKey === 0
                                        ? "sky"
                                        : "normal"
                                }
                                k2Tone={hoveredSpec?.rootHighlightKey === 1 ? "sky" : "normal"}
                            />

                            {/* Arestes arrel -> fulles */}
                            {VALID_LEAVES.map((leaf) => {
                                const isActive = mode === "valid" && activeLeaf === leaf.idx;
                                const isR3ErrorEdge = mode === "r3_leaf" && leaf.idx === 1;
                                const targetCx = mode === "r1_cap" && leaf.idx === 2 ? 434 : leaf.cx;
                                const stroke = isR3ErrorEdge
                                    ? "#f43f5e"
                                    : isActive
                                    ? "#38bdf8"
                                    : "#475569";
                                const marker = isR3ErrorEdge
                                    ? "url(#bp-arrow-rose)"
                                    : isActive
                                    ? "url(#bp-arrow-sky)"
                                    : "url(#bp-arrow-slate)";
                                const pathD =
                                    leaf.ptrX === targetCx
                                        ? `M ${leaf.ptrX},48 L ${targetCx},112`
                                        : `M ${leaf.ptrX},48 C ${leaf.ptrX},82 ${targetCx},78 ${targetCx},112`;

                                return (
                                    <g key={`edge-${leaf.idx}`}>
                                        <path
                                            d={pathD}
                                            fill="none"
                                            stroke={stroke}
                                            strokeWidth={isActive || isR3ErrorEdge ? 2 : 1.3}
                                            strokeDasharray={isR3ErrorEdge ? "3 3" : undefined}
                                            strokeOpacity={
                                                mode === "valid" && activeLeaf !== null && !isActive
                                                    ? 0.25
                                                    : 0.9
                                            }
                                            markerEnd={marker}
                                        />
                                        {(isActive || isR3ErrorEdge) && (
                                            <g
                                                transform={`translate(${(leaf.ptrX + targetCx) / 2}, 81)`}
                                            >
                                                <rect
                                                    x={isR3ErrorEdge ? -32 : -36}
                                                    y="-9"
                                                    width={isR3ErrorEdge ? 64 : 72}
                                                    height="18"
                                                    rx="4"
                                                    fill="#020617"
                                                    stroke={stroke}
                                                    strokeWidth="1"
                                                />
                                                <text
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                    y="1"
                                                    fill={stroke}
                                                    fontSize="9"
                                                    fontWeight="bold"
                                                >
                                                    {isR3ErrorEdge ? "20 ∉ fulla" : leaf.rangeLabel}
                                                </text>
                                            </g>
                                        )}
                                    </g>
                                );
                            })}

                            {/* Llista doblement enllaçada entre fulles */}
                            <LinkedArrows x1={158} x2={194} y={138} />
                            <LinkedArrows
                                x1={326}
                                x2={mode === "r1_cap" ? 359 : 362}
                                y={138}
                            />

                            {/* Fulla 0 */}
                            <Leaf2Node
                                cx={92}
                                y={116}
                                keys={["10", "15"]}
                                rids={["r₁", "r₂"]}
                                active={mode === "valid" && activeLeaf === 0}
                                onHover={mode === "valid" ? () => setActiveLeaf(0) : undefined}
                            />

                            {/* Fulla 1 (a R3 falta el 20 -> mostra [25 | 30] en vermell!) */}
                            <Leaf2Node
                                cx={260}
                                y={116}
                                keys={mode === "r3_leaf" ? ["25", "30"] : ["20", "30"]}
                                rids={["r₃", "r₄"]}
                                active={mode === "valid" && activeLeaf === 1}
                                errorKeyIdx={mode === "r3_leaf" ? 0 : undefined}
                                highlightKeyIdx={
                                    mode === "valid" && activeLeaf === 1 ? 0 : undefined
                                }
                                onHover={mode === "valid" ? () => setActiveLeaf(1) : undefined}
                            />

                            {/* Fulla 2 (a R1 té 3 valors -> overflow [40 | 50 | 55]!) */}
                            {mode === "r1_cap" ? (
                                <g>
                                    <rect
                                        x={359}
                                        y={116}
                                        width={150}
                                        height={44}
                                        rx={8}
                                        fill="#1a0910"
                                        stroke="#f43f5e"
                                        strokeWidth="1.6"
                                    />
                                    {["40", "50", "55"].map((val, idx) => {
                                        const bx = 365 + idx * 47;
                                        return (
                                            <g key={val}>
                                                <rect
                                                    x={bx}
                                                    y={121}
                                                    width={44}
                                                    height={34}
                                                    rx={5}
                                                    fill="#2e0d17"
                                                    stroke="#f43f5e"
                                                    strokeWidth="1"
                                                />
                                                <text
                                                    x={bx + 22}
                                                    y={133}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                    fill="#fecdd3"
                                                    fontSize="11.5"
                                                    fontWeight="bold"
                                                >
                                                    {val}
                                                </text>
                                                <text
                                                    x={bx + 22}
                                                    y={147}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                    fill="#fb7185"
                                                    fontSize="8"
                                                >
                                                    {`r${idx + 5}`}
                                                </text>
                                            </g>
                                        );
                                    })}
                                    <text
                                        x={434}
                                        y={174}
                                        textAnchor="middle"
                                        fill="#fb7185"
                                        fontSize="9.5"
                                        fontWeight="bold"
                                    >
                                        3 claus &gt; 2d = 2 ✕
                                    </text>
                                </g>
                            ) : (
                                <Leaf2Node
                                    cx={428}
                                    y={116}
                                    keys={["40", "55"]}
                                    rids={["r₅", "r₆"]}
                                    active={mode === "valid" && activeLeaf === 2}
                                    highlightKeyIdx={
                                        mode === "valid" && activeLeaf === 2 ? 0 : undefined
                                    }
                                    onHover={mode === "valid" ? () => setActiveLeaf(2) : undefined}
                                />
                            )}
                        </>
                    )}

                    {/* MODE R2: FULLES A NIVELLS DIFERENTS (h=2 vs h=3) */}
                    {mode === "r2_level" && (
                        <>
                            {["h=1", "h=2", "h=3"].map((lbl, idx) => (
                                <text
                                    key={lbl}
                                    x="8"
                                    y={28 + idx * 62}
                                    fill={idx > 0 ? "#fb7185" : "#475569"}
                                    fontSize="9.5"
                                    fontWeight="bold"
                                >
                                    {lbl}
                                </text>
                            ))}

                            {/* Línia guia nivell 2 vs nivell 3 */}
                            <line
                                x1="36"
                                y1="88"
                                x2="510"
                                y2="88"
                                stroke="#f43f5e"
                                strokeWidth="1"
                                strokeDasharray="3 3"
                                opacity={0.3}
                            />
                            <line
                                x1="36"
                                y1="154"
                                x2="510"
                                y2="154"
                                stroke="#f43f5e"
                                strokeWidth="1"
                                strokeDasharray="3 3"
                                opacity={0.3}
                            />

                            {/* Arrel [ 20 ] (1 clau) */}
                            <g>
                                <rect x={220} y={8} width={80} height={32} rx={8} fill="#0b1324" stroke="#38bdf8" strokeOpacity={0.6} strokeWidth="1.3" />
                                <rect x={242} y={12} width={36} height={24} rx={4} fill="#0f172a" stroke="#334155" />
                                <text x={260} y={25} textAnchor="middle" dominantBaseline="middle" fill="#e2e8f0" fontSize="12" fontWeight="bold">
                                    20
                                </text>
                                <circle cx={231} cy={34} r={2.4} fill="#38bdf8" />
                                <circle cx={289} cy={34} r={2.4} fill="#38bdf8" />
                            </g>

                            {/* Arestes */}
                            <path d="M 231,40 C 231,56 122,52 122,68" fill="none" stroke="#f43f5e" strokeWidth="1.5" markerEnd="url(#bp-arrow-rose)" />
                            <path d="M 289,40 C 289,56 374,52 374,68" fill="none" stroke="#475569" strokeWidth="1.4" markerEnd="url(#bp-arrow-slate)" />

                            {/* Fulla esquerra atrapada a h=2 */}
                            <Leaf2Node cx={122} y={70} keys={["10", "15"]} rids={["r₁", "r₂"]} errorKeyIdx={0} />
                            <text x={122} y={128} textAnchor="middle" fill="#fb7185" fontSize="9.5" fontWeight="bold">
                                fulla a h=2 ✕
                            </text>

                            {/* Node intern a h=2 [ 40 ] */}
                            <g>
                                <rect x={334} y={70} width={80} height={32} rx={8} fill="#0b1324" stroke="#38bdf8" strokeOpacity={0.5} strokeWidth="1.3" />
                                <rect x={356} y={74} width={36} height={24} rx={4} fill="#0f172a" stroke="#334155" />
                                <text x={374} y={87} textAnchor="middle" dominantBaseline="middle" fill="#e2e8f0" fontSize="12" fontWeight="bold">
                                    40
                                </text>
                                <circle cx={345} cy={96} r={2.4} fill="#38bdf8" />
                                <circle cx={403} cy={96} r={2.4} fill="#38bdf8" />
                            </g>

                            {/* Arestes h=2 -> h=3 */}
                            <path d="M 345,102 C 345,118 296,116 296,132" fill="none" stroke="#475569" strokeWidth="1.3" markerEnd="url(#bp-arrow-slate)" />
                            <path d="M 403,102 C 403,118 446,116 446,132" fill="none" stroke="#475569" strokeWidth="1.3" markerEnd="url(#bp-arrow-slate)" />

                            {/* Fulles a h=3 */}
                            <Leaf2Node cx={296} y={134} keys={["20", "30"]} rids={["r₃", "r₄"]} />
                            <Leaf2Node cx={446} y={134} keys={["40", "55"]} rids={["r₅", "r₆"]} />
                        </>
                    )}

                    {/* MODE R4: DUPLICAT EN NODES INTERNS */}
                    {mode === "r4_dup" && (
                        <>
                            {["h=1", "h=2", "h=3"].map((lbl, idx) => (
                                <text
                                    key={lbl}
                                    x="8"
                                    y={28 + idx * 62}
                                    fill={idx < 2 ? "#fb7185" : "#475569"}
                                    fontSize="9.5"
                                    fontWeight="bold"
                                >
                                    {lbl}
                                </text>
                            ))}

                            {/* Arrel [ 30 ] (30 en vermell!) */}
                            <g>
                                <rect x={220} y={8} width={80} height={32} rx={8} fill="#1a0910" stroke="#f43f5e" strokeWidth="1.4" />
                                <rect x={242} y={12} width={36} height={24} rx={4} fill="#2e0d17" stroke="#f43f5e" />
                                <text x={260} y={25} textAnchor="middle" dominantBaseline="middle" fill="#fecdd3" fontSize="12" fontWeight="bold">
                                    30
                                </text>
                                <circle cx={231} cy={34} r={2.4} fill="#38bdf8" />
                                <circle cx={289} cy={34} r={2.4} fill="#38bdf8" />
                            </g>

                            {/* Arestes arrel -> h=2 */}
                            <path d="M 231,40 C 231,56 140,52 140,66" fill="none" stroke="#475569" strokeWidth="1.3" markerEnd="url(#bp-arrow-slate)" />
                            <path d="M 289,40 C 289,56 380,52 380,66" fill="none" stroke="#f43f5e" strokeWidth="1.6" strokeDasharray="3 3" markerEnd="url(#bp-arrow-rose)" />

                            {/* Node intern esquerre h=2 [ 20 ] */}
                            <g>
                                <rect x={100} y={68} width={80} height={32} rx={8} fill="#0b1324" stroke="#38bdf8" strokeOpacity={0.5} strokeWidth="1.3" />
                                <rect x={122} y={72} width={36} height={24} rx={4} fill="#0f172a" stroke="#334155" />
                                <text x={140} y={85} textAnchor="middle" dominantBaseline="middle" fill="#e2e8f0" fontSize="12" fontWeight="bold">
                                    20
                                </text>
                                <circle cx={111} cy={94} r={2.4} fill="#38bdf8" />
                                <circle cx={169} cy={94} r={2.4} fill="#38bdf8" />
                            </g>

                            {/* Node intern dret h=2 [ 30 ] -> 30 repetit! */}
                            <g>
                                <rect x={340} y={68} width={80} height={32} rx={8} fill="#1a0910" stroke="#f43f5e" strokeWidth="1.4" />
                                <rect x={362} y={72} width={36} height={24} rx={4} fill="#2e0d17" stroke="#f43f5e" />
                                <text x={380} y={85} textAnchor="middle" dominantBaseline="middle" fill="#fecdd3" fontSize="12" fontWeight="bold">
                                    30
                                </text>
                                <circle cx={351} cy={94} r={2.4} fill="#38bdf8" />
                                <circle cx={409} cy={94} r={2.4} fill="#38bdf8" />
                            </g>

                            {/* Etiqueta de conflicte 30 = 30 */}
                            <g transform="translate(335, 52)">
                                <rect x="-24" y="-8" width="48" height="16" rx="4" fill="#020617" stroke="#f43f5e" strokeWidth="1" />
                                <text textAnchor="middle" dominantBaseline="middle" y="1" fill="#fecdd3" fontSize="8.5" fontWeight="bold">
                                    30 = 30 ✕
                                </text>
                            </g>

                            {/* Arestes h=2 -> fulles h=3 */}
                            <path d="M 111,100 L 92,132" fill="none" stroke="#475569" strokeWidth="1.2" markerEnd="url(#bp-arrow-slate)" />
                            <path d="M 169,100 L 222,132" fill="none" stroke="#475569" strokeWidth="1.2" markerEnd="url(#bp-arrow-slate)" />
                            <path d="M 351,100 L 348,132" fill="none" stroke="#475569" strokeWidth="1.2" markerEnd="url(#bp-arrow-slate)" />
                            <path d="M 409,100 L 456,132" fill="none" stroke="#475569" strokeWidth="1.2" markerEnd="url(#bp-arrow-slate)" />

                            {/* 4 fulles compactes a h=3 */}
                            {[
                                { x: 46, label: "10, 15" },
                                { x: 176, label: "20, 25" },
                                { x: 302, label: "30, 35" },
                                { x: 416, label: "40, 55" },
                            ].map((leaf) => (
                                <g key={leaf.label}>
                                    <rect x={leaf.x} y={134} width={92} height={36} rx={7} fill="#0b1324" stroke="#334155" strokeWidth="1.2" />
                                    <text x={leaf.x + 46} y={153} textAnchor="middle" dominantBaseline="middle" fill="#cbd5e1" fontSize="11" fontWeight="bold">
                                        {leaf.label}
                                    </text>
                                </g>
                            ))}
                        </>
                    )}
                </svg>
            </div>

            {/* Resum en 1 línia */}
            <div className="mt-3 flex justify-center">
                <div
                    className={`px-3 py-1 rounded-lg border text-[11px] text-center transition-colors ${TONE_PILL[statusInfo.tone]}`}
                >
                    {statusInfo.text}
                </div>
            </div>

            {/* 4 regles de validació d'examen */}
            <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {rules.map((rule) => (
                    <div
                        key={rule.id}
                        className={`px-2 py-1 rounded-md border flex items-center justify-between text-[9.5px] transition-colors ${
                            rule.ok
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                                : "bg-rose-500/15 border-rose-500/50 text-rose-200 font-bold"
                        }`}
                    >
                        <span className="truncate">{rule.label}</span>
                        <span className="font-bold ml-1 shrink-0">{rule.ok ? "✓" : "✕"}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
