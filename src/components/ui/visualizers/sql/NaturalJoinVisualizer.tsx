"use client";

import { useState } from "react";

interface EmployeeRow {
    id: number;
    nom: string;
    num_dpt: number;
}

interface DepartmentRow {
    id: number;
    num_dpt: number;
    nom: string;
}

interface ResultRow {
    id: number;
    emplId: number;
    deptId: number;
    nom_empl: string;
    nom_dpt: string;
    num_dpt: number;
}

const EMPLOYEES: EmployeeRow[] = [
    { id: 0, nom: "JOAN", num_dpt: 1 },
    { id: 1, nom: "MARIA", num_dpt: 2 },
    { id: 2, nom: "PAU", num_dpt: 1 },
];

const DEPARTMENTS: DepartmentRow[] = [
    { id: 0, num_dpt: 1, nom: "SISTEMES" },
    { id: 1, num_dpt: 2, nom: "VENDES" },
    { id: 2, num_dpt: 3, nom: "I+D" },
];

const RESULTS: ResultRow[] = [
    { id: 0, emplId: 0, deptId: 0, nom_empl: "JOAN", nom_dpt: "SISTEMES", num_dpt: 1 },
    { id: 1, emplId: 1, deptId: 1, nom_empl: "MARIA", nom_dpt: "VENDES", num_dpt: 2 },
    { id: 2, emplId: 2, deptId: 0, nom_empl: "PAU", nom_dpt: "SISTEMES", num_dpt: 1 },
];

// Càlcul precís de coordenades: alçada de fila 32px + gap de 8px
const ROW_H = 32;
const GAP_ROW = 8;
const getY = (index: number) => index * (ROW_H + GAP_ROW) + ROW_H / 2;

export default function NaturalJoinVisualizer() {
    const [highlightMatch, setHighlightMatch] = useState<{
        emplIds: number[];
        deptIds: number[];
        resultIds: number[];
    } | null>(null);

    const onHoverEmployee = (emp: EmployeeRow) => {
        const matches = RESULTS.filter((r) => r.emplId === emp.id);
        setHighlightMatch({
            emplIds: [emp.id],
            deptIds: matches.map((m) => m.deptId),
            resultIds: matches.map((m) => m.id),
        });
    };

    const onHoverDepartment = (dpt: DepartmentRow) => {
        const matches = RESULTS.filter((r) => r.deptId === dpt.id);
        setHighlightMatch({
            emplIds: matches.map((m) => m.emplId),
            deptIds: [dpt.id],
            resultIds: matches.map((m) => m.id),
        });
    };

    const onHoverResult = (res: ResultRow) => {
        setHighlightMatch({
            emplIds: [res.emplId],
            deptIds: [res.deptId],
            resultIds: [res.id],
        });
    };

    const onLeave = () => setHighlightMatch(null);

    const isEmpActive = (id: number) => highlightMatch?.emplIds.includes(id) ?? false;
    const isDeptActive = (id: number) => highlightMatch?.deptIds.includes(id) ?? false;
    const isResultActive = (id: number) => highlightMatch?.resultIds.includes(id) ?? false;
    const isDimmed = highlightMatch !== null;

    return (
        <div className="w-full max-w-lg mx-auto my-6 not-prose select-none font-mono text-xs">
            {/* 1. CAPÇALERES UNIFICADES (alçada i alineació exactes) */}
            <div
                className="grid items-center text-[10px] text-slate-500 font-semibold tracking-wider pb-2 px-1"
                style={{ gridTemplateColumns: "1fr 80px 1fr" }}
            >
                <div className="flex items-center justify-between px-2">
                    <span>nom_empl</span>
                    <span className="text-amber-400/90 font-bold">num_dpt</span>
                </div>
                <div className="text-center text-[9px] text-slate-600 tracking-wider">
                    ⋈
                </div>
                <div className="flex items-center justify-between px-2">
                    <span className="text-amber-400/90 font-bold">num_dpt</span>
                    <span className="text-right">nom_dpt</span>
                </div>
            </div>

            {/* 2. TAULES D'ENTRADA I CONNEXIÓ SVG */}
            <div
                className="relative grid items-start"
                style={{ gridTemplateColumns: "1fr 80px 1fr" }}
            >
                {/* Taula esquerra: empleats */}
                <div className="flex flex-col gap-2">
                    {EMPLOYEES.map((row) => {
                        const active = isEmpActive(row.id);
                        const dimmed = isDimmed && !active;

                        return (
                            <button
                                key={`emp-${row.id}`}
                                type="button"
                                onMouseEnter={() => onHoverEmployee(row)}
                                onMouseLeave={onLeave}
                                className={`h-8 px-2.5 rounded-lg border flex items-center justify-between text-left transition-all duration-200 cursor-pointer ${
                                    active
                                        ? "bg-sky-500/15 border-sky-400 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.25)]"
                                        : dimmed
                                        ? "bg-slate-900/20 border-white/5 text-slate-600 opacity-30"
                                        : "bg-slate-900/40 border-white/10 text-slate-300 hover:border-slate-600"
                                }`}
                            >
                                <span className="truncate">{row.nom}</span>
                                <span
                                    className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs transition-colors ${
                                        active
                                            ? "bg-amber-500/25 border border-amber-400/50 text-amber-200 shadow-[0_0_8px_rgba(245,158,11,0.3)]"
                                            : dimmed
                                            ? "bg-slate-900/30 border border-white/5 text-slate-600"
                                            : "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                                    }`}
                                >
                                    {row.num_dpt}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Connexions SVG alineades al píxel (y=16, y=56, y=96) */}
                <div className="h-[112px] relative">
                    <svg
                        viewBox="0 0 80 112"
                        className="w-full h-[112px] overflow-visible pointer-events-none"
                    >
                        {EMPLOYEES.map((emp) => {
                            const dptIndex = DEPARTMENTS.findIndex((d) => d.num_dpt === emp.num_dpt);
                            if (dptIndex === -1) return null;

                            const y1 = getY(emp.id);
                            const y2 = getY(dptIndex);
                            const active = isEmpActive(emp.id) && isDeptActive(dptIndex);
                            const dimmed = isDimmed && !active;

                            const isStraight = y1 === y2;
                            const pathData = isStraight
                                ? `M 0,${y1} L 80,${y2}`
                                : `M 0,${y1} C 40,${y1} 40,${y2} 80,${y2}`;

                            return (
                                <path
                                    key={`conn-${emp.id}-${dptIndex}`}
                                    d={pathData}
                                    fill="none"
                                    stroke={
                                        active
                                            ? "#f59e0b"
                                            : dimmed
                                            ? "#334155"
                                            : "#475569"
                                    }
                                    strokeWidth={active ? 2 : 1.25}
                                    strokeOpacity={dimmed ? 0.15 : active ? 1 : 0.6}
                                    className="transition-all duration-200"
                                />
                            );
                        })}
                    </svg>
                </div>

                {/* Taula dreta: departaments */}
                <div className="flex flex-col gap-2">
                    {DEPARTMENTS.map((row) => {
                        const active = isDeptActive(row.id);
                        const dimmed = isDimmed && !active;

                        return (
                            <button
                                key={`dpt-${row.id}`}
                                type="button"
                                onMouseEnter={() => onHoverDepartment(row)}
                                onMouseLeave={onLeave}
                                className={`h-8 px-2.5 rounded-lg border flex items-center justify-between text-left transition-all duration-200 cursor-pointer ${
                                    active
                                        ? "bg-emerald-500/15 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(52,211,153,0.25)]"
                                        : dimmed
                                        ? "bg-slate-900/20 border-white/5 text-slate-600 opacity-30"
                                        : "bg-slate-900/40 border-white/10 text-slate-300 hover:border-slate-600"
                                }`}
                            >
                                <span
                                    className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs transition-colors ${
                                        active
                                            ? "bg-amber-500/25 border border-amber-400/50 text-amber-200 shadow-[0_0_8px_rgba(245,158,11,0.3)]"
                                            : dimmed
                                            ? "bg-slate-900/30 border border-white/5 text-slate-600"
                                            : "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                                    }`}
                                >
                                    {row.num_dpt}
                                </span>
                                <span className="truncate text-right">{row.nom}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 3. TRANSICIÓ DE FLUX VISUAL CAP AL RESULTAT */}
            <div className="w-full h-8 relative flex items-center justify-center my-1 pointer-events-none">
                <svg viewBox="0 0 320 32" className="w-full max-w-[320px] h-8 overflow-visible">
                    {/* Línies subtils de convergència */}
                    <path
                        d="M 60,0 C 60,16 130,16 130,28"
                        fill="none"
                        stroke="#334155"
                        strokeWidth="1"
                        strokeDasharray="3 3"
                        strokeOpacity="0.4"
                    />
                    <path
                        d="M 260,0 C 260,16 190,16 190,28"
                        fill="none"
                        stroke="#334155"
                        strokeWidth="1"
                        strokeDasharray="3 3"
                        strokeOpacity="0.4"
                    />
                    {/* Fletxa central minimalista */}
                    <path
                        d="M 160,4 L 160,20 M 156,16 L 160,21 L 164,16"
                        stroke="#64748b"
                        strokeWidth="1.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            {/* 4. TAULA RESULTANT: SELECT e.nom_empl, d.nom_dpt */}
            <div className="w-full max-w-[320px] mx-auto">
                <div className="grid grid-cols-2 text-[10px] font-semibold tracking-wider pb-2 px-3">
                    <span className="text-slate-400">nom_empl</span>
                    <span className="text-right text-slate-400">nom_dpt</span>
                </div>
                <div className="flex flex-col gap-2">
                    {RESULTS.map((row) => {
                        const active = isResultActive(row.id);
                        const dimmed = isDimmed && !active;

                        return (
                            <button
                                key={`res-${row.id}`}
                                type="button"
                                onMouseEnter={() => onHoverResult(row)}
                                onMouseLeave={onLeave}
                                className={`h-8 px-3 rounded-lg border grid grid-cols-2 items-center text-left transition-all duration-200 cursor-pointer ${
                                    active
                                        ? "bg-slate-900/80 border-sky-400 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.25)]"
                                        : dimmed
                                        ? "bg-slate-900/20 border-white/5 text-slate-600 opacity-30"
                                        : "bg-slate-900/40 border-white/10 text-slate-300 hover:border-slate-600"
                                }`}
                            >
                                <span className={active ? "text-sky-300 font-semibold" : "text-slate-300"}>
                                    {row.nom_empl}
                                </span>
                                <span
                                    className={`text-right ${
                                        active ? "text-emerald-300 font-semibold" : "text-emerald-400/80"
                                    }`}
                                >
                                    {row.nom_dpt}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
