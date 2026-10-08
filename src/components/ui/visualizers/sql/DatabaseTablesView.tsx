import React from 'react';
import type { SQLTableData } from '../../../../lib/simulations/engine/types';
import DataGrid from './DataGrid';

interface DatabaseTablesViewProps {
    sourceTables: Record<string, SQLTableData>;
    activeTables?: string[];
    activeColumns?: Record<string, string[]>;
}

export function DatabaseTablesView({
    sourceTables = {},
    activeTables = [],
    activeColumns = {}
}: DatabaseTablesViewProps) {
    const tableNames = Object.keys(sourceTables);

    if (tableNames.length === 0) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 font-mono text-xs p-6 bg-[#0d1117]">
                <p>Sense dades disponibles.</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full overflow-y-auto custom-scrollbar divide-y divide-slate-800/80 bg-[#0d1117] select-none">
            {tableNames.map((tableName) => {
                const tableData = sourceTables[tableName];
                if (!tableData) return null;
                const colsActive = activeColumns[tableName] || [];

                return (
                    <div key={tableName} className="w-full">
                        {/* Títol directe de la taula - sense icones ni badges */}
                        <div className="px-3 py-1.5 bg-[#0a0d14] border-b border-slate-800/80 font-mono text-xs font-bold text-slate-200">
                            {tableName}
                        </div>

                        {/* Dades aprofitant tot l'espai */}
                        <DataGrid
                            table={tableData}
                            activeColumns={colsActive}
                            showFooter={false}
                            className="h-auto"
                        />
                    </div>
                );
            })}
        </div>
    );
}

export default DatabaseTablesView;
