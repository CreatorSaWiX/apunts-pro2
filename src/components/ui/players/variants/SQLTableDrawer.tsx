import React from 'react';
import { Database, Table, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import type { SQLTableData } from '../../../../lib/simulations/engine/types';
import DataGrid from '../../visualizers/sql/DataGrid';

// =========================================================================
// 1. CALAIX DE TAULES DE LA BASE DE DADES (Per a visualitzacions estàtiques com 'esquema_empresa')
// =========================================================================
interface SQLSourceTableDrawerProps {
    sourceTables: Record<string, SQLTableData>;
    selectedTable: string;
    onSelectTable: (name: string) => void;
    activeTables?: string[];
    activeColumns?: Record<string, string[]>;
    isExpanded: boolean;
    onToggle: () => void;
}

export function SQLSourceTableDrawer({
    sourceTables = {},
    selectedTable,
    onSelectTable,
    activeTables = [],
    activeColumns = {},
    isExpanded,
    onToggle
}: SQLSourceTableDrawerProps) {
    const tableNames = Object.keys(sourceTables);
    const activeTableName = sourceTables[selectedTable] ? selectedTable : tableNames[0];
    const currentTableData = sourceTables[activeTableName];

    if (!isExpanded) {
        return (
            <div className="bg-[#090b10] border-t border-slate-800/80 flex flex-col relative z-20 shrink-0 select-none">
                <div
                    className="px-3 py-1.5 bg-[#0d1117] flex items-center justify-between cursor-pointer hover:bg-[#161b22] transition-colors"
                    onClick={onToggle}
                >
                    <span className="text-[11px] font-mono font-medium text-slate-300">
                        Taules ({tableNames.length})
                    </span>
                    <button
                        type="button"
                        className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] font-mono cursor-pointer"
                    >
                        <span>Desplega</span>
                        <ChevronUp size={13} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-[#0d1117] border-t border-slate-800/80 flex flex-col relative z-20 min-h-0 select-none">
            {/* Barra de pestanyes per a cada taula font */}
            <div className="h-8 border-b border-slate-800/80 flex items-center justify-between px-2 sm:px-3 bg-[#0a0d14] shrink-0">
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                    {tableNames.map((tableName) => {
                        const isSelected = activeTableName === tableName;

                        return (
                            <button
                                key={tableName}
                                type="button"
                                onClick={() => onSelectTable(tableName)}
                                className={`px-2.5 py-1 rounded-md text-[11px] font-mono tracking-wide flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap
                                    ${isSelected
                                        ? 'bg-[#161b22] text-emerald-400 font-bold border border-slate-700/80 shadow-xs'
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                                    }`}
                            >
                                <Table size={11} className={isSelected ? "text-emerald-400" : "text-slate-500"} />
                                <span>{tableName}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Botó de plegar */}
                <button
                    type="button"
                    onClick={onToggle}
                    className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] font-mono cursor-pointer ml-2 shrink-0"
                    title="Plega les taules"
                >
                    <span>Plega</span>
                    <ChevronDown size={13} />
                </button>
            </div>

            {/* Contingut de la taula seleccionada */}
            <div className="flex-1 min-h-0 overflow-hidden relative">
                <DataGrid
                    table={currentTableData}
                    tableName={activeTableName}
                    activeColumns={activeColumns[activeTableName] || []}
                    showFooter={false}
                />
            </div>
        </div>
    );
}

// =========================================================================
// 2. CALAIX EXCLUSIU DE RESULTAT DE CONSULTA (Per a visualitzacions amb play com 'select_filtre_join')
// =========================================================================
interface SQLResultDrawerProps {
    resultTable?: SQLTableData;
    projectedColumns?: string[];
    isExpanded: boolean;
    onToggle: () => void;
}

export function SQLResultDrawer({
    resultTable,
    projectedColumns = [],
    isExpanded,
    onToggle
}: SQLResultDrawerProps) {
    const hasResult = Boolean(resultTable && resultTable.rows && resultTable.rows.length > 0);
    const effectiveTable: SQLTableData = (resultTable && resultTable.columns.length > 0)
        ? resultTable
        : {
            columns: projectedColumns.length > 0 ? projectedColumns : [],
            rows: []
        };

    if (!isExpanded) {
        return (
            <div className="bg-[#090b10] border-t border-slate-800/80 flex flex-col relative z-20 shrink-0 select-none">
                <div
                    className="px-3 py-1.5 bg-[#0d1117] flex items-center justify-between cursor-pointer hover:bg-[#161b22] transition-colors"
                    onClick={onToggle}
                >
                    <span className="text-[11px] font-mono font-medium text-slate-300">
                        Resultat {hasResult ? `(${resultTable!.rows.length})` : ''}
                    </span>
                    <button
                        type="button"
                        className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] font-mono cursor-pointer"
                    >
                        <span>Desplega</span>
                        <ChevronUp size={13} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-[#0d1117] border-t border-slate-800/80 flex flex-col relative z-20 min-h-0 select-none">
            {/* Barra superior de la taula de resultat minimalista */}
            <div className="h-8 border-b border-slate-800/80 flex items-center justify-between px-3 bg-[#0a0d14] shrink-0">
                <span className="text-[11px] font-mono font-medium text-slate-300">
                    Resultat {hasResult ? `(${resultTable!.rows.length})` : ''}
                </span>

                {/* Botó de plegar */}
                <button
                    type="button"
                    onClick={onToggle}
                    className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] font-mono cursor-pointer"
                    title="Plega el resultat"
                >
                    <span>Plega</span>
                    <ChevronDown size={13} />
                </button>
            </div>

            {/* Contingut: taula sense omplir res si encara no hi ha files */}
            <div className="flex-1 min-h-0 overflow-hidden relative">
                <DataGrid
                    table={effectiveTable}
                    tableName="Resultat"
                    activeColumns={effectiveTable.columns}
                    showFooter={false}
                />
            </div>
        </div>
    );
}

export default SQLResultDrawer;

