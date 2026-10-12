"use client";

import { useState } from "react";

interface Employee {
    id: number;
    nom: string;
    num_dpt: number;
    ciutat_empl: string;
}

interface Department {
    num_dpt: number;
    ciutat_dpt: string;
}

const EMPLOYEES: Employee[] = [
    { id: 0, nom: "Garcia", num_dpt: 10, ciutat_empl: "BCN" },
    { id: 1, nom: "Perez", num_dpt: 10, ciutat_empl: "MAD" },
    { id: 2, nom: "Lopez", num_dpt: 20, ciutat_empl: "VAL" },
];

const DEPARTMENTS: Department[] = [
    { num_dpt: 10, ciutat_dpt: "BCN" },
    { num_dpt: 20, ciutat_dpt: "VAL" },
];

// Coordenades dels centres de fila per a les corbes SVG
const ROW_H = 34;
const GAP_EMP = 8;
const Y_EMP = (idx: number) => idx * (ROW_H + GAP_EMP) + ROW_H / 2;

// Offset departaments per alinear visualment amb les files d'empleats
const OFFSET_DEPT = 14;
const GAP_DEPT = 34;
const Y_DEPT = (idx: number) => OFFSET_DEPT + idx * (ROW_H + GAP_DEPT) + ROW_H / 2;

const DEPT_INDEX_MAP: Record<number, number> = {
    10: 0,
    20: 1,
};

export default function AssertionVisualizer() {
    const [selectedEmp, setSelectedEmp] = useState<number>(1); // 1 = Perez (MAD), el cas que viola l'asserció

    const currentEmp = EMPLOYEES[selectedEmp];
    const deptIdx = DEPT_INDEX_MAP[currentEmp.num_dpt];
    const currentDept = DEPARTMENTS[deptIdx];
    const isViolation = currentEmp.ciutat_empl !== currentDept.ciutat_dpt;

    return (
        <div className="w-full max-w-lg mx-auto my-6 not-prose select-none font-mono text-xs">
            {/* Taules i connector SVG */}
            <div className="grid items-center" style={{ gridTemplateColumns: "1fr 90px 1fr" }}>
                
                {/* Taula empleats */}
                <div className="flex flex-col">
                    <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider pb-1.5 px-1 flex justify-between">
                        <span>empleats</span>
                        <span className="text-slate-600">e</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        {EMPLOYEES.map((emp) => {
                            const isSelected = selectedEmp === emp.id;
                            const empDept = DEPARTMENTS[DEPT_INDEX_MAP[emp.num_dpt]];
                            const rowConflict = emp.ciutat_empl !== empDept.ciutat_dpt;

                            return (
                                <button
                                    key={emp.id}
                                    type="button"
                                    onClick={() => setSelectedEmp(emp.id)}
                                    className={`h-[34px] px-2.5 rounded-lg border text-left transition-all duration-150 flex items-center justify-between cursor-pointer ${
                                        isSelected
                                            ? rowConflict
                                                ? "bg-rose-500/15 border-rose-500/60 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.2)]"
                                                : "bg-emerald-500/15 border-emerald-500/50 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.18)]"
                                            : "bg-slate-900/40 border-white/5 text-slate-400 hover:border-slate-700"
                                    }`}
                                >
                                    <span className="truncate">{emp.nom}</span>
                                    <div className="flex items-center gap-1.5 text-[11px]">
                                        <span className="text-sky-400/80 font-bold">d{emp.num_dpt}</span>
                                        <span className={`font-semibold ${isSelected && rowConflict ? "text-rose-300" : "text-slate-300"}`}>
                                            {emp.ciutat_empl}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Connexions SVG */}
                <svg viewBox="0 0 90 126" className="w-full h-[126px] pointer-events-none overflow-visible">
                    {EMPLOYEES.map((emp) => {
                        const targetDptIdx = DEPT_INDEX_MAP[emp.num_dpt];
                        const y1 = Y_EMP(emp.id);
                        const y2 = Y_DEPT(targetDptIdx);
                        const isSelected = selectedEmp === emp.id;
                        const empDept = DEPARTMENTS[targetDptIdx];
                        const rowConflict = emp.ciutat_empl !== empDept.ciutat_dpt;

                        const strokeColor = isSelected
                            ? rowConflict
                                ? "#f43f5e"
                                : "#10b981"
                            : "#334155";

                        return (
                            <g key={emp.id}>
                                <path
                                    d={`M 0,${y1} C 45,${y1} 45,${y2} 90,${y2}`}
                                    fill="none"
                                    stroke={strokeColor}
                                    strokeWidth={isSelected ? 2 : 1}
                                    strokeOpacity={isSelected ? 1 : 0.35}
                                    className="transition-all duration-200"
                                />
                                {isSelected && (
                                    <g transform={`translate(45, ${(y1 + y2) / 2})`}>
                                        <rect
                                            x="-11"
                                            y="-9"
                                            width="22"
                                            height="18"
                                            rx="4"
                                            fill="#020617"
                                            stroke={rowConflict ? "#f43f5e" : "#10b981"}
                                            strokeWidth="1"
                                        />
                                        <text
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            y="1"
                                            fill={rowConflict ? "#f43f5e" : "#10b981"}
                                            fontSize="10"
                                            fontWeight="bold"
                                        >
                                            {rowConflict ? "≠" : "="}
                                        </text>
                                    </g>
                                )}
                            </g>
                        );
                    })}
                </svg>

                {/* Taula departaments */}
                <div className="flex flex-col">
                    <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider pb-1.5 px-1 flex justify-between">
                        <span>departaments</span>
                        <span className="text-slate-600">d</span>
                    </div>
                    <div
                        className="flex flex-col gap-[34px]"
                        style={{ paddingTop: `${OFFSET_DEPT}px`, paddingBottom: `${OFFSET_DEPT}px` }}
                    >
                        {DEPARTMENTS.map((dept, idx) => {
                            const isTargeted = deptIdx === idx;
                            return (
                                <div
                                    key={dept.num_dpt}
                                    className={`h-[34px] px-2.5 rounded-lg border flex items-center justify-between transition-all duration-150 ${
                                        isTargeted
                                            ? "bg-slate-900/80 border-sky-500/40 text-slate-200"
                                            : "bg-slate-900/30 border-white/5 text-slate-500"
                                    }`}
                                >
                                    <span className="text-sky-400 font-bold">d{dept.num_dpt}</span>
                                    <span className="font-semibold text-slate-300">{dept.ciutat_dpt}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Avaluació de la condició (mínima i compacta) */}
            <div className="mt-4 flex justify-center">
                <div
                    className={`px-3 py-1 rounded-lg border text-[11px] font-mono flex items-center gap-2 transition-colors ${
                        isViolation
                            ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
                            : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    }`}
                >
                    <span className="text-slate-500">e.ciutat &lt;&gt; d.ciutat:</span>
                    <span className="font-bold">
                        &apos;{currentEmp.ciutat_empl}&apos; {isViolation ? "≠" : "="} &apos;{currentDept.ciutat_dpt}&apos;
                    </span>
                    <span className="text-slate-600">|</span>
                    <span className={`font-bold ${isViolation ? "text-rose-400" : "text-emerald-400"}`}>
                        {isViolation ? "✗ VIOLACIÓ (NOT EXISTS)" : "✓ ACCEPTAT"}
                    </span>
                </div>
            </div>
        </div>
    );
}
