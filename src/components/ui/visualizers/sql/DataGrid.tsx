import React from 'react';
import type { SQLTableData } from '../../../../lib/simulations/engine/types';

interface DataGridProps {
    table?: SQLTableData;
    tableName?: string;
    activeColumns?: string[];
    className?: string;
    showFooter?: boolean;
    accentColor?: 'emerald' | 'amber' | 'sky';
}

export default function DataGrid({
    table,
    tableName,
    activeColumns = [],
    className = '',
    showFooter = false,
    accentColor = 'emerald'
}: DataGridProps) {
    if (!table || !table.columns.length) {
        return (
            <div className={`w-full py-4 text-center text-slate-500 font-mono text-xs bg-[#0d1117] ${className}`}>
                Sense dades
            </div>
        );
    }

    return (
        <div className={`w-full flex flex-col bg-[#0d1117] text-xs font-mono select-none overflow-hidden ${className || 'h-full'}`}>
            {/* Taula minimalista estil Linear / Apple */}
            <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full border-collapse text-left">
                    <thead className="sticky top-0 z-10 bg-[#0d1117] border-b border-slate-800/80">
                        <tr className="text-slate-400 text-[11px]">
                            <th className="py-2.5 px-3 w-10 text-center text-slate-600 font-normal">#</th>
                            {table.columns.map((col) => {
                                const isColActive = activeColumns.includes(col);
                                return (
                                    <th
                                        key={col}
                                        className={`py-2.5 px-3 font-semibold tracking-wide whitespace-nowrap transition-colors
                                            ${isColActive 
                                                ? (accentColor === 'amber' 
                                                    ? 'text-amber-400 bg-amber-500/10' 
                                                    : accentColor === 'sky' 
                                                    ? 'text-sky-400 bg-sky-500/10' 
                                                    : 'text-emerald-400 bg-emerald-500/5') 
                                                : 'text-slate-300'}`}
                                    >
                                        {col}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40 text-[11px]">
                        {table.rows.length === 0 ? (
                            <tr>
                                <td colSpan={table.columns.length + 1} className="py-8 text-center text-slate-500 italic">
                                    (Taula buida — 0 files)
                                </td>
                            </tr>
                        ) : (
                            table.rows.map((row, rowIdx) => {
                                const status = table.rowStatuses?.[rowIdx] || 'normal';
                                const isDeleted = status === 'deleted';
                                const isFiltered = status === 'filtered';
                                const isActive = status === 'active';
                                const isInserted = status === 'inserted';
                                const isUpdated = status === 'updated';

                                let rowStyle = 'text-slate-300 hover:bg-slate-800/30';
                                if (isDeleted) {
                                    rowStyle = 'bg-rose-950/30 text-rose-300/80 line-through decoration-rose-500/80 font-normal';
                                } else if (isFiltered) {
                                    rowStyle = 'opacity-30 line-through text-slate-600 bg-red-950/5';
                                } else if (isActive) {
                                    rowStyle = 'bg-emerald-500/10 text-emerald-200 font-medium';
                                } else if (isInserted) {
                                    rowStyle = 'bg-emerald-500/15 text-emerald-300 font-medium';
                                } else if (isUpdated) {
                                    rowStyle = 'bg-amber-500/15 text-amber-300 font-medium';
                                }

                                return (
                                    <tr
                                        key={rowIdx}
                                        className={`transition-colors duration-150 ${rowStyle}`}
                                    >
                                        <td className="py-2 px-3 text-center text-slate-600 select-none">
                                            {rowIdx + 1}
                                        </td>
                                        {row.map((cell, cellIdx) => {
                                            const colName = table.columns[cellIdx];
                                            const isColActive = activeColumns.includes(colName);
                                            const isCellHighlighted = (isUpdated || isInserted || isActive) && isColActive;

                                            return (
                                                <td key={cellIdx} className="py-2 px-3 whitespace-nowrap">
                                                    {cell === null ? (
                                                        <span className="italic text-slate-500 font-sans text-[10px]">NULL</span>
                                                    ) : isCellHighlighted ? (
                                                        <span className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-mono transition-all ${
                                                            isUpdated
                                                                ? 'bg-amber-400/20 text-amber-200 border border-amber-400/40 shadow-[0_0_8px_rgba(251,191,36,0.15)]'
                                                                : isInserted
                                                                ? 'bg-emerald-400/20 text-emerald-200 border border-emerald-400/40'
                                                                : 'bg-sky-400/20 text-sky-200 border border-sky-400/40'
                                                        }`}>
                                                            {String(cell)}
                                                        </span>
                                                    ) : (
                                                        String(cell)
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer amb recompte (només si showFooter és true) */}
            {showFooter && (
                <div className="h-7 px-3 bg-[#0a0d14] border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                    <span>{tableName ? `Taula: ${tableName}` : ''}</span>
                    <span>{table.rows.length} {table.rows.length === 1 ? 'fila' : 'files'}</span>
                </div>
            )}
        </div>
    );
}
