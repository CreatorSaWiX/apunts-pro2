import React, { useState, useMemo } from 'react';
import { Eye, HardDrive, Play, RotateCcw, ShieldCheck, ShieldAlert } from 'lucide-react';

interface Row {
    num_empl: number;
    nom_empl: string;
    sou: number;
    num_dpt: number;
}

const INITIAL_BASE_ROWS: Row[] = [
    { num_empl: 1, nom_empl: 'CARME', sou: 400000, num_dpt: 1 },
    { num_empl: 2, nom_empl: 'EUGENIA', sou: 350000, num_dpt: 2 },
    { num_empl: 3, nom_empl: 'JOSEP', sou: 250000, num_dpt: 3 },
    { num_empl: 4, nom_empl: 'RICARDO', sou: 400000, num_dpt: 1 },
    { num_empl: 11, nom_empl: 'NURIA', sou: 100000, num_dpt: 3 }
];

export default function ViewVisualizer() {
    const [withCheckOption, setWithCheckOption] = useState<boolean>(true);
    const [actionType, setActionType] = useState<'violating' | 'valid'>('violating');
    const [isExecuted, setIsExecuted] = useState<boolean>(false);

    const baseRows: Row[] = useMemo(() => {
        if (!isExecuted) return INITIAL_BASE_ROWS;

        if (actionType === 'violating') {
            if (withCheckOption) {
                return INITIAL_BASE_ROWS;
            } else {
                return INITIAL_BASE_ROWS.map(r =>
                    r.num_empl === 2 ? { ...r, num_dpt: 3 } : r
                );
            }
        } else {
            return INITIAL_BASE_ROWS.map(r =>
                r.num_empl === 2 ? { ...r, sou: 380000 } : r
            );
        }
    }, [isExecuted, actionType, withCheckOption]);

    const viewRows = baseRows.filter(r => r.num_dpt === 2);

    const statusMessage = useMemo(() => {
        if (!isExecuted) {
            return "Premeu «Executar» per comprovar el comportament de l'UPDATE sobre la vista i la taula base.";
        }
        if (actionType === 'violating') {
            if (withCheckOption) {
                return "ERROR: Violació de CHECK OPTION. Sentència avortada; taula base protegida.";
            } else {
                return "UPDATE aplicat a la taula base. La fila ja no compleix el filtre i desapareix de la vista.";
            }
        }
        return "UPDATE aplicat amb èxit (sou = 380.000). Es reflecteix tant a la base com a la vista.";
    }, [isExecuted, actionType, withCheckOption]);

    return (
        <div className="w-full rounded-2xl border border-slate-800/80 bg-[#0d1117] flex flex-col overflow-hidden shadow-2xl my-6 select-none font-sans">
            {/* Header d'estil Apple / Linear */}
            <div className="h-10 border-b border-slate-800/80 flex items-end px-3 shrink-0 bg-[#0a0d14] overflow-x-auto overflow-y-hidden custom-scrollbar">
                <div className="px-3.5 py-2 border-t border-x rounded-t-xl text-[10px] sm:text-[11px] font-mono tracking-wider flex gap-2 items-center bg-[#0d1117] border-slate-800/80 text-emerald-400 font-bold whitespace-nowrap shrink-0">
                    <Eye size={13} className="text-emerald-400 shrink-0" />
                    <span>Vistes & CHECK OPTION</span>
                </div>

                <div className="flex items-center gap-1 ml-2">
                    <button
                        type="button"
                        onClick={() => {
                            setActionType('violating');
                            setIsExecuted(false);
                        }}
                        className={`px-3 py-2 border-t border-x rounded-t-xl text-[10px] sm:text-[11px] font-mono tracking-wider flex items-center transition-colors whitespace-nowrap shrink-0 cursor-pointer relative top-px ${
                            actionType === 'violating'
                                ? 'bg-[#0d1117] border-slate-800/80 text-emerald-400 font-bold z-10'
                                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                        }`}
                    >
                        SET num_dpt = 3
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setActionType('valid');
                            setIsExecuted(false);
                        }}
                        className={`px-3 py-2 border-t border-x rounded-t-xl text-[10px] sm:text-[11px] font-mono tracking-wider flex items-center transition-colors whitespace-nowrap shrink-0 cursor-pointer relative top-px ${
                            actionType === 'valid'
                                ? 'bg-[#0d1117] border-slate-800/80 text-emerald-400 font-bold z-10'
                                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                        }`}
                    >
                        SET sou = 380k
                    </button>
                </div>

                <div className="flex-1 border-b border-slate-800/80 h-full relative z-0 min-w-5"></div>

                {/* Controls a la dreta del header */}
                <div className="flex items-center gap-2 pb-1.5 z-10 shrink-0">
                    <button
                        type="button"
                        onClick={() => {
                            setWithCheckOption(!withCheckOption);
                            setIsExecuted(false);
                        }}
                        className={`px-2 py-1 rounded-md text-[10px] font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer border ${
                            withCheckOption
                                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                    >
                        {withCheckOption ? <ShieldCheck size={11} /> : <ShieldAlert size={11} />}
                        <span>CHECK OPTION: {withCheckOption ? 'ON' : 'OFF'}</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsExecuted(true)}
                        className="px-2.5 py-1 rounded-md bg-emerald-500 text-slate-950 font-mono font-bold text-[10px] flex items-center gap-1 hover:bg-emerald-400 transition-colors cursor-pointer"
                    >
                        <Play size={10} className="fill-current" />
                        <span>Executar</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsExecuted(false)}
                        className="p-1 rounded-md text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Reiniciar"
                    >
                        <RotateCcw size={12} />
                    </button>
                </div>
            </div>

            {/* Panell Dual: Vista Virtual (esquerra) vs Taula Base (dreta) */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800/80 bg-[#090d16]">
                {/* 1. Vista Virtual */}
                <div className="flex flex-col min-h-[260px] bg-[#0d1117]">
                    <div className="h-9 border-b border-slate-800/60 bg-[#0a0d14] flex items-center justify-between px-3 shrink-0">
                        <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-slate-300">
                            <Eye size={12} className="text-emerald-400" />
                            <span>Vista: empleats_dep2</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">
                            WHERE num_dpt = 2
                        </span>
                    </div>

                    <div className="p-3 flex-1 overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left font-mono text-xs border-collapse">
                            <thead>
                                <tr className="text-slate-400 border-b border-slate-800 text-[10px]">
                                    <th className="py-2 px-3">num_empl</th>
                                    <th className="py-2 px-3">nom_empl</th>
                                    <th className="py-2 px-3">sou</th>
                                    <th className="py-2 px-3">num_dpt</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/40 text-[11px]">
                                {viewRows.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-8 text-center text-slate-600 italic">
                                            0 files (cap fila compleix num_dpt = 2)
                                        </td>
                                    </tr>
                                ) : (
                                    viewRows.map(row => (
                                        <tr key={row.num_empl} className="text-slate-200">
                                            <td className="py-2 px-3 font-bold">{row.num_empl}</td>
                                            <td className="py-2 px-3">{row.nom_empl}</td>
                                            <td className="py-2 px-3">{row.sou}</td>
                                            <td className="py-2 px-3 font-bold text-emerald-400">{row.num_dpt}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 2. Taula Base */}
                <div className="flex flex-col min-h-[260px] bg-[#0d1117]">
                    <div className="h-9 border-b border-slate-800/60 bg-[#0a0d14] flex items-center justify-between px-3 shrink-0">
                        <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-slate-300">
                            <HardDrive size={12} className="text-slate-400" />
                            <span>Taula Base: empleats</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">
                            {baseRows.length} files
                        </span>
                    </div>

                    <div className="p-3 flex-1 overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left font-mono text-xs border-collapse">
                            <thead>
                                <tr className="text-slate-400 border-b border-slate-800 text-[10px]">
                                    <th className="py-2 px-3">num_empl</th>
                                    <th className="py-2 px-3">nom_empl</th>
                                    <th className="py-2 px-3">sou</th>
                                    <th className="py-2 px-3">num_dpt</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/40 text-[11px]">
                                {baseRows.map(row => {
                                    const isTargetRow = row.num_empl === 2 && isExecuted;
                                    return (
                                        <tr
                                            key={row.num_empl}
                                            className={isTargetRow ? 'bg-emerald-500/10 text-emerald-300' : 'text-slate-300'}
                                        >
                                            <td className="py-2 px-3">{row.num_empl}</td>
                                            <td className="py-2 px-3">{row.nom_empl}</td>
                                            <td className="py-2 px-3">{row.sou}</td>
                                            <td className="py-2 px-3">{row.num_dpt}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Barra d'estat d'una sola línia */}
            <div className="h-8 px-3 border-t border-slate-800/80 bg-[#0a0d14] flex items-center shrink-0">
                <span className={`text-[11px] font-mono truncate ${
                    isExecuted && actionType === 'violating' && withCheckOption
                        ? 'text-red-400'
                        : 'text-emerald-400/90'
                }`}>
                    {statusMessage}
                </span>
            </div>
        </div>
    );
}
