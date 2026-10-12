"use client";

import { useState } from "react";

type Mode = "single" | "join";
type JoinOp = "delete" | "update" | "insert";

export default function ViewUpdatableVisualizer() {
    const [mode, setMode] = useState<Mode>("join");
    const [joinOp, setJoinOp] = useState<JoinOp>("delete");
    const [singleActive, setSingleActive] = useState<number | null>(0);

    return (
        <div className="w-full max-w-2xl mx-auto my-8 not-prose select-none font-mono text-xs">
            {/* Selector de mode minimalista */}
            <div className="flex items-center justify-center gap-2 mb-6">
                <button
                    type="button"
                    onClick={() => setMode("single")}
                    className={`px-3 py-1 rounded-md text-[11px] transition-all cursor-pointer ${
                        mode === "single"
                            ? "bg-emerald-500/15 border border-emerald-400 text-emerald-300 font-semibold shadow-[0_0_10px_rgba(16,185,129,0.15)]"
                            : "bg-slate-900/30 border border-white/5 text-slate-400 hover:text-slate-200"
                    }`}
                >
                    1:1 Taula base
                </button>
                <span className="text-slate-700">/</span>
                <button
                    type="button"
                    onClick={() => setMode("join")}
                    className={`px-3 py-1 rounded-md text-[11px] transition-all cursor-pointer ${
                        mode === "join"
                            ? "bg-rose-500/15 border border-rose-400 text-rose-300 font-semibold shadow-[0_0_10px_rgba(244,63,94,0.15)]"
                            : "bg-slate-900/30 border border-white/5 text-slate-400 hover:text-slate-200"
                    }`}
                >
                    JOIN (A ⋈ B)
                </button>
            </div>

            {/* MODE 1: TAULA BASE ÚNICA (1:1 UNÍVOCA) */}
            {mode === "single" && (
                <div className="flex flex-col items-center gap-3">
                    <div className="w-full grid items-center" style={{ gridTemplateColumns: "1fr 70px 1fr" }}>
                        {/* Taula Base: empleats */}
                        <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between px-1 text-[10px] text-slate-500 font-semibold pb-1 border-b border-white/10">
                                <span>empleats</span>
                                <span className="text-slate-600">base</span>
                            </div>
                            {[
                                { id: 0, num: 1, nom: "CARME", sou: "400k" },
                                { id: 1, num: 2, nom: "EUGENIA", sou: "350k" },
                                { id: 2, num: 4, nom: "RICARDO", sou: "220k" },
                            ].map((row) => {
                                const isActive = singleActive === row.id;
                                return (
                                    <div
                                        key={row.id}
                                        onMouseEnter={() => setSingleActive(row.id)}
                                        className={`h-7 px-2 rounded border grid grid-cols-3 items-center text-center transition-all cursor-pointer ${
                                            isActive
                                                ? "bg-emerald-500/15 border-emerald-400 text-emerald-200 shadow-[0_0_8px_rgba(16,185,129,0.2)]"
                                                : "bg-slate-900/30 border-white/5 text-slate-400"
                                        }`}
                                    >
                                        <span>{row.num}</span>
                                        <span>{row.nom}</span>
                                        <span className="text-amber-400/90">{row.sou}</span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Connexions centrals 1:1 SVG */}
                        <div className="relative h-[95px] flex items-center justify-center">
                            <svg viewBox="0 0 70 95" className="w-full h-full pointer-events-none">
                                {[0, 1, 2].map((idx) => {
                                    const y = 14 + idx * 34;
                                    const isActive = singleActive === idx;
                                    return (
                                        <g key={idx}>
                                            <line
                                                x1="0"
                                                y1={y}
                                                x2="70"
                                                y2={y}
                                                stroke={isActive ? "#10b981" : "#334155"}
                                                strokeWidth={isActive ? 2 : 1}
                                                strokeDasharray={isActive ? "none" : "2,2"}
                                            />
                                            {isActive && (
                                                <polygon
                                                    points={`62,${y - 3} 68,${y} 62,${y + 3}`}
                                                    fill="#10b981"
                                                />
                                            )}
                                        </g>
                                    );
                                })}
                            </svg>
                            <span className="absolute bg-[#020617] px-1 py-0.5 text-[9px] text-emerald-400 border border-emerald-500/30 rounded">
                                1 : 1
                            </span>
                        </div>

                        {/* Vista: empleats_v */}
                        <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between px-1 text-[10px] text-emerald-400/90 font-semibold pb-1 border-b border-emerald-500/20">
                                <span>vista_altsous</span>
                                <span className="text-emerald-500/70">vista</span>
                            </div>
                            {[
                                { id: 0, num: 1, nom: "CARME", sou: "400k" },
                                { id: 1, num: 2, nom: "EUGENIA", sou: "350k" },
                                { id: 2, num: 4, nom: "RICARDO", sou: "220k" },
                            ].map((row) => {
                                const isActive = singleActive === row.id;
                                return (
                                    <div
                                        key={row.id}
                                        onMouseEnter={() => setSingleActive(row.id)}
                                        className={`h-7 px-2 rounded border grid grid-cols-3 items-center text-center transition-all cursor-pointer ${
                                            isActive
                                                ? "bg-emerald-500/20 border-emerald-400 text-emerald-100 shadow-[0_0_8px_rgba(16,185,129,0.25)]"
                                                : "bg-emerald-500/5 border-emerald-500/20 text-emerald-300"
                                        }`}
                                    >
                                        <span>{row.num}</span>
                                        <span>{row.nom}</span>
                                        <span className="text-amber-400/90">{row.sou}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="text-[10px] text-emerald-400/80 font-mono mt-1">
                        DML(vista) ➔ translació unívoca a la tupla base
                    </div>
                </div>
            )}

            {/* MODE 2: VISTA AMB JOIN (AMBIGÜITAT / INCOMPATIBILITAT) */}
            {mode === "join" && (
                <div className="flex flex-col items-center gap-4">
                    {/* Botons d'operació DML en JOIN */}
                    <div className="flex items-center gap-1.5 text-[10px]">
                        {(["delete", "update", "insert"] as JoinOp[]).map((op) => (
                            <button
                                key={op}
                                type="button"
                                onClick={() => setJoinOp(op)}
                                className={`px-2.5 py-0.5 rounded border transition-all cursor-pointer uppercase font-semibold ${
                                    joinOp === op
                                        ? "bg-rose-500/20 border-rose-400 text-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.2)]"
                                        : "bg-slate-900/30 border-white/5 text-slate-500 hover:text-slate-300"
                                }`}
                            >
                                {op}
                            </button>
                        ))}
                    </div>

                    {/* Fila de la Vista (Join) */}
                    <div className="flex flex-col items-center gap-1">
                        <div className="text-[10px] text-slate-500 font-semibold">
                            vista_empl_dpt (JOIN)
                        </div>
                        <div className="h-8 px-3 rounded-lg border border-rose-500/40 bg-rose-950/20 text-rose-200 flex items-center gap-4 text-xs shadow-[0_0_12px_rgba(244,63,94,0.15)]">
                            <span className="text-slate-400">1</span>
                            <span className="font-semibold text-slate-200">CARME</span>
                            <span className="text-slate-700">|</span>
                            {joinOp === "update" ? (
                                <span className="text-rose-400 line-through">
                                    DIRECCIÓ <span className="no-underline text-amber-300 font-bold ml-1">➔ GESTIÓ</span>
                                </span>
                            ) : joinOp === "insert" ? (
                                <span className="text-emerald-300">+ NOU EMPLEAT</span>
                            ) : (
                                <span className="text-rose-300">DIRECCIÓ</span>
                            )}
                        </div>
                    </div>

                    {/* Bifurcació SVG cap a les dues taules base */}
                    <div className="w-full max-w-md h-12 relative flex items-center justify-center">
                        <svg viewBox="0 0 200 48" className="w-full h-full pointer-events-none">
                            {/* De la vista a Empleats (A) */}
                            <path
                                d="M 100,0 C 100,24 45,20 45,48"
                                fill="none"
                                stroke="#f43f5e"
                                strokeWidth="1.5"
                                strokeDasharray="3,3"
                            />
                            {/* De la vista a Departaments (B) */}
                            <path
                                d="M 100,0 C 100,24 155,20 155,48"
                                fill="none"
                                stroke="#f43f5e"
                                strokeWidth="1.5"
                                strokeDasharray="3,3"
                            />
                        </svg>
                        <div className="absolute text-[9px] text-rose-400 bg-[#020617] px-1 rounded border border-rose-500/30">
                            {joinOp === "delete" ? "Esborrar A? B? Ambdós?" : joinOp === "update" ? "Efecte col·lateral a B" : "Manca NOT NULL a base"}
                        </div>
                    </div>

                    {/* Dues Taules Base: A (empleats) i B (departaments) */}
                    <div className="w-full grid grid-cols-2 gap-4">
                        {/* Taula A: empleats */}
                        <div className="flex flex-col gap-1.5 p-2 rounded border border-white/5 bg-slate-900/20">
                            <div className="flex justify-between text-[10px] text-slate-400 font-semibold pb-1 border-b border-white/10">
                                <span>A: empleats</span>
                                <span className="text-slate-600">FK: num_dpt</span>
                            </div>
                            <div
                                className={`h-7 px-2 rounded border flex items-center justify-between text-[11px] ${
                                    joinOp === "delete"
                                        ? "border-rose-400/80 bg-rose-500/10 text-rose-200"
                                        : "border-white/5 bg-slate-900/40 text-slate-300"
                                }`}
                            >
                                <span>1 CARME</span>
                                <span className="text-slate-500">dpt: 1</span>
                                {joinOp === "delete" && <span className="text-rose-400 font-bold">?</span>}
                            </div>
                            {joinOp === "insert" && (
                                <div className="h-6 px-1.5 rounded border border-amber-500/40 bg-amber-500/10 text-amber-300 text-[10px] flex items-center justify-between">
                                    <span>sou, ciutat</span>
                                    <span className="text-[9px] text-amber-400 font-bold">NOT NULL?</span>
                                </div>
                            )}
                        </div>

                        {/* Taula B: departaments */}
                        <div className="flex flex-col gap-1.5 p-2 rounded border border-white/5 bg-slate-900/20">
                            <div className="flex justify-between text-[10px] text-slate-400 font-semibold pb-1 border-b border-white/10">
                                <span>B: departaments</span>
                                <span className="text-slate-600">PK: num_dpt</span>
                            </div>
                            <div
                                className={`h-7 px-2 rounded border flex items-center justify-between text-[11px] ${
                                    joinOp === "delete"
                                        ? "border-rose-400/80 bg-rose-500/10 text-rose-200"
                                        : joinOp === "update"
                                        ? "border-amber-400/80 bg-amber-500/10 text-amber-200"
                                        : "border-white/5 bg-slate-900/40 text-slate-300"
                                }`}
                            >
                                <span>1 DIRECCIÓ</span>
                                {joinOp === "delete" && <span className="text-rose-400 font-bold">?</span>}
                                {joinOp === "update" && <span className="text-amber-400 text-[10px]">modifica B</span>}
                            </div>
                            {/* Altra fila que depèn de B per mostrar l'efecte col·lateral */}
                            <div className="h-6 px-2 rounded border border-dashed border-slate-700 bg-slate-900/20 text-slate-500 text-[10px] flex items-center justify-between">
                                <span>2 EUGENIA (dpt 1)</span>
                                {joinOp === "update" ? (
                                    <span className="text-rose-400 text-[9px]">afectada!</span>
                                ) : (
                                    <span className="text-slate-600">aliè</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
