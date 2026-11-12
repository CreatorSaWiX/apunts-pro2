"use client";

import { useState } from "react";

type TabId = "drivers" | "static_dynamic";
type DriverId = 1 | 2 | 3 | 4;
type SqlModeId = "sqlj" | "jdbc";
type NodeTone = "slate" | "sky" | "amber" | "emerald";

interface PipelineNode {
    title: string;
    sub: string;
    tone: NodeTone;
}

interface DriverSpec {
    id: DriverId;
    label: string;
    nodes: PipelineNode[];
    dashedArrowIdx?: number;
    note: string;
    noteTone: Exclude<NodeTone, "slate">;
}

interface SqlModeSpec {
    id: SqlModeId;
    label: string;
    stages: { title: string; sub: string; highlight?: boolean }[];
    badge: string;
    tone: "amber" | "sky";
    note: string;
}

const TONE_BOX: Record<NodeTone, { fill: string; stroke: string; text: string; sub: string }> = {
    slate: { fill: "#0f172a", stroke: "#475569", text: "#e2e8f0", sub: "#64748b" },
    sky: { fill: "#0c1a2e", stroke: "#38bdf8", text: "#bae6fd", sub: "#7dd3fc" },
    amber: { fill: "#181206", stroke: "#f59e0b", text: "#fde68a", sub: "#d97706" },
    emerald: { fill: "#061e14", stroke: "#10b981", text: "#a7f3d0", sub: "#34d399" },
};

const TONE_PILL: Record<Exclude<NodeTone, "slate">, string> = {
    sky: "bg-sky-500/10 border-sky-500/30 text-sky-300",
    amber: "bg-amber-500/10 border-amber-500/30 text-amber-300",
    emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
};

const DRIVERS: Record<DriverId, DriverSpec> = {
    1: {
        id: 1,
        label: "Tipus 1 · Pont",
        nodes: [
            { title: "App Java", sub: "API JDBC", tone: "sky" },
            { title: "Pont JDBC-ODBC", sub: "traducció", tone: "amber" },
            { title: "Driver ODBC", sub: "natiu client", tone: "amber" },
            { title: "SGBD", sub: "BD", tone: "slate" },
        ],
        note: "Doble traducció JDBC → ODBC → SGBD · lent i dependent del client",
        noteTone: "amber",
    },
    2: {
        id: 2,
        label: "Tipus 2 · Natiu",
        nodes: [
            { title: "App Java", sub: "API JDBC", tone: "sky" },
            { title: "Driver JDBC", sub: "wrapper Java", tone: "sky" },
            { title: "Lib. Nativa", sub: "C / C++ SGBD", tone: "amber" },
            { title: "SGBD", sub: "BD", tone: "slate" },
        ],
        note: "Crida llibreries natives del fabricant instal·lades al client",
        noteTone: "amber",
    },
    3: {
        id: 3,
        label: "Tipus 3 · Xarxa",
        nodes: [
            { title: "App Java", sub: "API JDBC", tone: "sky" },
            { title: "Driver Genèric", sub: "Java pur", tone: "sky" },
            { title: "Middleware", sub: "servidor JDBC", tone: "amber" },
            { title: "SGBD", sub: "BD", tone: "slate" },
        ],
        dashedArrowIdx: 1,
        note: "Protocol de xarxa independent cap a un servidor intermedi JDBC",
        noteTone: "sky",
    },
    4: {
        id: 4,
        label: "Tipus 4 · Java pur",
        nodes: [
            { title: "App Java", sub: "API JDBC", tone: "sky" },
            { title: "Driver Java Pur", sub: "protocol directe", tone: "emerald" },
            { title: "SGBD", sub: "TCP/IP", tone: "slate" },
        ],
        note: "100% Java · connexió directa contra l'SGBD sense capes natives (el més habitual)",
        noteTone: "emerald",
    },
};

const SQL_MODES: Record<SqlModeId, SqlModeSpec> = {
    sqlj: {
        id: "sqlj",
        label: "SQLJ (Estàtic)",
        stages: [
            { title: "Codi + SQL fix", sub: "incrustat" },
            { title: "Precompilador", sub: "valida SQL abans", highlight: true },
            { title: "Execució", sub: "pla fixat" },
        ],
        badge: "+ eficient · − portable",
        tone: "amber",
        note: "El precompilador valida i compila l'SQL abans d'executar · cal recompilar si canvia l'SGBD",
    },
    jdbc: {
        id: "jdbc",
        label: "JDBC (Dinàmic)",
        stages: [
            { title: "String SQL", sub: "en temps d'exec." },
            { title: "Compilació Java", sub: "sense validar SQL" },
            { title: "Runtime + Driver", sub: "compila SQL al vol", highlight: true },
        ],
        badge: "+ portable · dinàmic",
        tone: "sky",
        note: "Les sentències són Strings construïts en execució · portable entre SGBD",
    },
};

export default function JdbcIntroVisualizer() {
    const [tab, setTab] = useState<TabId>("drivers");
    const [driverId, setDriverId] = useState<DriverId>(4);
    const [sqlMode, setSqlMode] = useState<SqlModeId>("jdbc");

    const driver = DRIVERS[driverId];
    const activeSql = SQL_MODES[sqlMode];

    // Distribució horitzontal dins viewBox="0 0 460 88"
    const count = driver.nodes.length;
    const nodeW = count === 3 ? 116 : 94;
    const gap = count === 3 ? 42 : 20;
    const totalW = count * nodeW + (count - 1) * gap;
    const startX = (460 - totalW) / 2;

    return (
        <div className="w-full max-w-xl mx-auto my-6 not-prose select-none font-mono text-xs">
            {/* Selector principal de vista */}
            <div className="flex items-center justify-center gap-1.5 pb-3">
                {[
                    { id: "drivers" as TabId, label: "Drivers JDBC (1–4)" },
                    { id: "static_dynamic" as TabId, label: "Estàtic vs Dinàmic" },
                ].map((item) => {
                    const isSelected = tab === item.id;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setTab(item.id)}
                            className={`px-3 py-1 rounded-md border text-[11px] transition-all duration-150 cursor-pointer ${
                                isSelected
                                    ? "bg-sky-500/15 border-sky-400 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.2)] font-semibold"
                                    : "bg-slate-900/30 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10"
                            }`}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </div>

            {tab === "drivers" ? (
                <div>
                    {/* Sub-selector Tipus 1..4 */}
                    <div className="flex flex-wrap items-center justify-center gap-1.5 pb-3">
                        {([1, 2, 3, 4] as DriverId[]).map((id) => {
                            const spec = DRIVERS[id];
                            const isSelected = driverId === id;
                            const activeCls =
                                id === 4
                                    ? "bg-emerald-500/15 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)] font-semibold"
                                    : id === 3
                                    ? "bg-sky-500/15 border-sky-400 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.2)] font-semibold"
                                    : "bg-amber-500/15 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)] font-semibold";
                            return (
                                <button
                                    key={id}
                                    type="button"
                                    onMouseEnter={() => setDriverId(id)}
                                    onClick={() => setDriverId(id)}
                                    className={`px-2 py-0.5 rounded-md border text-[10.5px] transition-all duration-150 cursor-pointer ${
                                        isSelected
                                            ? activeCls
                                            : "bg-slate-900/30 border-white/5 text-slate-400 hover:text-slate-200"
                                    }`}
                                >
                                    {spec.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Diagrama SVG d'arquitectura del driver */}
                    <svg viewBox="0 0 460 72" className="w-full h-auto overflow-visible">
                        <defs>
                            <marker
                                id="jdbc-arrow-slate"
                                viewBox="0 0 6 6"
                                refX="4.5"
                                refY="3"
                                markerWidth="4.5"
                                markerHeight="4.5"
                                orient="auto"
                            >
                                <path d="M 0 0 L 6 3 L 0 6 z" fill="#64748b" />
                            </marker>
                            <marker
                                id="jdbc-arrow-emerald"
                                viewBox="0 0 6 6"
                                refX="4.5"
                                refY="3"
                                markerWidth="4.5"
                                markerHeight="4.5"
                                orient="auto"
                            >
                                <path d="M 0 0 L 6 3 L 0 6 z" fill="#10b981" />
                            </marker>
                            <marker
                                id="jdbc-arrow-sky"
                                viewBox="0 0 6 6"
                                refX="4.5"
                                refY="3"
                                markerWidth="4.5"
                                markerHeight="4.5"
                                orient="auto"
                            >
                                <path d="M 0 0 L 6 3 L 0 6 z" fill="#38bdf8" />
                            </marker>
                        </defs>

                        {driver.nodes.map((node, idx) => {
                            const x = startX + idx * (nodeW + gap);
                            const palette = TONE_BOX[node.tone];
                            const hasNext = idx < count - 1;
                            const isDirectPure = driverId === 4;
                            const isNetworkHop = driver.dashedArrowIdx === idx;
                            const arrowStroke = isDirectPure
                                ? "#10b981"
                                : isNetworkHop
                                ? "#38bdf8"
                                : "#64748b";
                            const markerId = isDirectPure
                                ? "url(#jdbc-arrow-emerald)"
                                : isNetworkHop
                                ? "url(#jdbc-arrow-sky)"
                                : "url(#jdbc-arrow-slate)";

                            return (
                                <g key={`${driverId}-${node.title}`}>
                                    <g transform={`translate(${x}, 14)`}>
                                        <rect
                                            width={nodeW}
                                            height="44"
                                            rx="8"
                                            fill={palette.fill}
                                            stroke={palette.stroke}
                                            strokeWidth="1.3"
                                        />
                                        <text
                                            x={nodeW / 2}
                                            y="18"
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            fill={palette.text}
                                            fontSize="9.5"
                                            fontWeight="bold"
                                        >
                                            {node.title}
                                        </text>
                                        <text
                                            x={nodeW / 2}
                                            y="32"
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            fill={palette.sub}
                                            fontSize="7.5"
                                        >
                                            {node.sub}
                                        </text>
                                    </g>

                                    {hasNext && (
                                        <>
                                            <line
                                                x1={x + nodeW}
                                                y1="36"
                                                x2={x + nodeW + gap - 3}
                                                y2="36"
                                                stroke={arrowStroke}
                                                strokeWidth="1.4"
                                                strokeDasharray={isNetworkHop ? "3 2" : undefined}
                                                markerEnd={markerId}
                                            />
                                            {isNetworkHop && (
                                                <text
                                                    x={x + nodeW + gap / 2}
                                                    y="26"
                                                    textAnchor="middle"
                                                    fill="#38bdf8"
                                                    fontSize="7"
                                                >
                                                    xarxa
                                                </text>
                                            )}
                                        </>
                                    )}
                                </g>
                            );
                        })}
                    </svg>

                    {/* Nota compacta */}
                    <div className="mt-2 flex justify-center">
                        <div className={`px-3 py-1 rounded-lg border text-[11px] text-center ${TONE_PILL[driver.noteTone]}`}>
                            {driver.note}
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    {/* Dues files comparatives: SQLJ vs JDBC */}
                    <div className="flex flex-col gap-2.5">
                        {(["sqlj", "jdbc"] as SqlModeId[]).map((id) => {
                            const spec = SQL_MODES[id];
                            const isActive = sqlMode === id;
                            const isAmber = spec.tone === "amber";

                            return (
                                <button
                                    key={id}
                                    type="button"
                                    onMouseEnter={() => setSqlMode(id)}
                                    onClick={() => setSqlMode(id)}
                                    className={`p-2.5 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
                                        isActive
                                            ? isAmber
                                                ? "bg-amber-500/10 border-amber-400/70 shadow-[0_0_12px_rgba(245,158,11,0.15)]"
                                                : "bg-sky-500/10 border-sky-400/70 shadow-[0_0_12px_rgba(56,189,248,0.15)]"
                                            : "bg-slate-900/30 border-white/5 opacity-55 hover:opacity-85"
                                    }`}
                                >
                                    <div className="flex items-center justify-between pb-2">
                                        <span className={`font-bold text-[11px] ${isAmber ? "text-amber-300" : "text-sky-300"}`}>
                                            {spec.label}
                                        </span>
                                        <span className="text-[10px] text-slate-400">{spec.badge}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        {spec.stages.map((st, sIdx) => (
                                            <div
                                                key={st.title}
                                                className={`px-2 py-1.5 rounded-lg border text-center ${
                                                    st.highlight
                                                        ? isAmber
                                                            ? "bg-amber-500/15 border-amber-400/60 text-amber-200"
                                                            : "bg-sky-500/15 border-sky-400/60 text-sky-200"
                                                        : "bg-slate-950/60 border-white/10 text-slate-300"
                                                }`}
                                            >
                                                <div className="text-[10px] font-semibold truncate">
                                                    {sIdx + 1}. {st.title}
                                                </div>
                                                <div className="text-[9px] opacity-65 truncate mt-0.5">{st.sub}</div>
                                            </div>
                                        ))}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Nota compacta */}
                    <div className="mt-3 flex justify-center">
                        <div className={`px-3 py-1 rounded-lg border text-[11px] text-center ${TONE_PILL[activeSql.tone]}`}>
                            {activeSql.note}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
