import React from 'react';
import type { SQLTableData } from '../../../../lib/simulations/engine/types';

interface DataGridProps {
    table?: SQLTableData;
    tableName?: string;
    activeColumns?: string[];
    className?: string;
    showFooter?: boolean;
}

export default function DataGrid({
    table,
    tableName,
    activeColumns = [],
    className = '',
    showFooter = false
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
                                            ${isColActive ? 'text-emerald-400 bg-emerald-500/5' : 'text-slate-300'}`}
                                    >
                                        {col}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40 text-[11px]">
                        {table.rows.map((row, rowIdx) => {
                            const status = table.rowStatuses?.[rowIdx] || 'normal';
                            const isFiltered = status === 'filtered';
                            const isActive = status === 'active';

                            return (
                                <tr
                                    key={rowIdx}
                                    className={`transition-colors duration-150
                                        ${isFiltered ? 'opacity-30 line-through text-slate-600 bg-red-950/5' : ''}
                                        ${isActive ? 'bg-emerald-500/10 text-emerald-200 font-medium' : 'text-slate-300 hover:bg-slate-800/30'}
                                    `}
                                >
                                    <td className="py-2 px-3 text-center text-slate-600 select-none">
                                        {rowIdx + 1}
                                    </td>
                                    {row.map((cell, cellIdx) => (
                                        <td key={cellIdx} className="py-2 px-3 whitespace-nowrap">
                                            {cell === null ? (
                                                <span className="italic text-slate-500 font-sans text-[10px]">NULL</span>
                                            ) : (
                                                String(cell)
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
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
