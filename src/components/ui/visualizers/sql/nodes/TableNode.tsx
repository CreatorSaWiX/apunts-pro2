import React, { memo } from 'react';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import { Table, Key, Link2, Diamond } from 'lucide-react';
import type { SQLTableSchema, SQLTableColumn } from '../../../../../lib/simulations/engine/types';

export interface TableNodeData extends Record<string, unknown> {
    schema: SQLTableSchema;
    isActive?: boolean;
    activeColumns?: string[];
}

export type TableNodeType = Node<TableNodeData, 'table'>;

export const TableNode = memo(function TableNode({ data }: NodeProps<TableNodeType>) {
    const { schema, isActive, activeColumns = [] } = data;

    return (
        <div
            className={`rounded-xl border transition-all duration-300 min-w-[240px] max-w-[320px] shadow-2xl backdrop-blur-md overflow-hidden font-sans select-none
                ${isActive
                    ? 'border-sky-400/80 bg-[#0f172a]/95 ring-2 ring-sky-500/30 shadow-[0_0_25px_rgba(56,189,248,0.25)]'
                    : 'border-slate-800 bg-[#0d1117]/95 hover:border-slate-700'
                }`}
        >
            {/* Header estil MySQL Workbench / DB Designer */}
            <div
                className={`px-3 py-2 flex items-center justify-between border-b transition-colors
                    ${isActive
                        ? 'bg-gradient-to-r from-sky-950/80 to-blue-900/60 border-sky-500/40 text-sky-200'
                        : 'bg-gradient-to-r from-slate-900/90 to-slate-800/80 border-slate-800 text-slate-200'
                    }`}
            >
                <div className="flex items-center gap-2 font-mono font-bold text-xs tracking-wide">
                    <div className={`p-1 rounded-md ${isActive ? 'bg-sky-500/20 text-sky-300' : 'bg-slate-800 text-slate-400'}`}>
                        <Table size={13} />
                    </div>
                    <span>{schema.name}</span>
                </div>
            </div>

            {/* Llista de columnes */}
            <div className="divide-y divide-slate-800/40 text-xs">
                {schema.columns.map((col: SQLTableColumn) => {
                    const isColActive = activeColumns.includes(col.name);

                    return (
                        <div
                            key={col.name}
                            className={`relative px-3 py-1.5 flex items-center justify-between transition-colors
                                ${isColActive
                                    ? 'bg-sky-500/15 text-sky-200 font-medium'
                                    : 'text-slate-300 hover:bg-slate-800/40'
                                }`}
                        >
                            {/* Handle d'entrada per a claus primàries (PK) */}
                            {col.isPk && (
                                <>
                                    <Handle
                                        type="target"
                                        id={`${schema.name}-${col.name}-target-left`}
                                        position={Position.Left}
                                        className="!w-2.5 !h-2.5 !bg-amber-400 !border-2 !border-slate-950 !-left-1.5 transition-transform hover:scale-125"
                                        title={`PK: ${col.name}`}
                                    />
                                    <Handle
                                        type="target"
                                        id={`${schema.name}-${col.name}-target-right`}
                                        position={Position.Right}
                                        className="!w-2.5 !h-2.5 !bg-amber-400 !border-2 !border-slate-950 !-right-1.5 transition-transform hover:scale-125"
                                        title={`PK: ${col.name}`}
                                    />
                                    <Handle
                                        type="target"
                                        id={`${schema.name}-${col.name}-target`}
                                        position={Position.Left}
                                        className="!w-2.5 !h-2.5 !bg-amber-400 !border-2 !border-slate-950 !-left-1.5 opacity-0 pointer-events-none"
                                    />
                                </>
                            )}

                            {/* Nom de la columna i icona */}
                            <div className="flex items-center gap-2 min-w-0 pr-2">
                                {col.isPk ? (
                                    <Key size={12} className="text-amber-400 shrink-0 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]" />
                                ) : col.isFk ? (
                                    <Link2 size={12} className="text-sky-400 shrink-0 drop-shadow-[0_0_6px_rgba(56,189,248,0.5)]" />
                                ) : (
                                    <span title={col.nullable === false ? "NOT NULL" : "Nullable"}>
                                        <Diamond
                                            size={9}
                                            className={col.nullable === false ? "text-slate-400 fill-slate-400 shrink-0" : "text-slate-600 shrink-0"}
                                        />
                                    </span>
                                )}
                                <span className={`font-mono text-[11px] truncate ${col.isPk ? 'font-bold text-amber-200' : isColActive ? 'text-sky-200 font-semibold' : 'text-slate-200'}`}>
                                    {col.name}
                                </span>
                            </div>

                            {/* Tipus de dades i badges */}
                            <div className="flex items-center gap-1.5 shrink-0">
                                {col.defaultValue && (
                                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700/60" title={`DEFAULT ${col.defaultValue}`}>
                                        def
                                    </span>
                                )}
                                <span className="font-mono text-[10px] text-slate-400 tracking-tight">
                                    {col.type}
                                </span>
                            </div>

                            {/* Handle de sortida per a claus foranes (FK) */}
                            {col.isFk && (
                                <>
                                    <Handle
                                        type="source"
                                        id={`${schema.name}-${col.name}-source-left`}
                                        position={Position.Left}
                                        className="!w-2.5 !h-2.5 !bg-sky-400 !border-2 !border-slate-950 !-left-1.5 transition-transform hover:scale-125"
                                        title={`FK -> ${col.references?.table}(${col.references?.column})`}
                                    />
                                    <Handle
                                        type="source"
                                        id={`${schema.name}-${col.name}-source-right`}
                                        position={Position.Right}
                                        className="!w-2.5 !h-2.5 !bg-sky-400 !border-2 !border-slate-950 !-right-1.5 transition-transform hover:scale-125"
                                        title={`FK -> ${col.references?.table}(${col.references?.column})`}
                                    />
                                    <Handle
                                        type="source"
                                        id={`${schema.name}-${col.name}-source`}
                                        position={Position.Right}
                                        className="!w-2.5 !h-2.5 !bg-sky-400 !border-2 !border-slate-950 !-right-1.5 opacity-0 pointer-events-none"
                                    />
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
});
