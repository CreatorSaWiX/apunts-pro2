import React, { memo } from 'react';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import { Key, Box, Diamond } from 'lucide-react';
import type { UMLClass, UMLAttribute } from '../../../../../../lib/simulations/content/uml/types';

export interface UMLClassNodeData extends Record<string, unknown> {
    umlClass: UMLClass;
    isActive?: boolean;
}

export type UMLClassNodeType = Node<UMLClassNodeData, 'umlClass'>;

export const UMLClassNode = memo(function UMLClassNode({ data }: NodeProps<UMLClassNodeType>) {
    const { umlClass, isActive } = data;

    return (
        <div
            className={`rounded-xl border transition-all duration-300 min-w-[220px] max-w-[300px] shadow-2xl backdrop-blur-md overflow-hidden font-sans select-none
                ${isActive
                    ? 'border-indigo-400/90 bg-[#0f172a]/95 ring-2 ring-indigo-500/40 shadow-[0_0_25px_rgba(99,102,241,0.3)]'
                    : 'border-slate-800 bg-[#0d1117]/95 hover:border-slate-700'
                }`}
        >
            {/* Handles a les 4 cares per a encaminament automàtic */}
            <Handle
                type="target"
                id="target-top"
                position={Position.Top}
                className="!w-2 !h-2 !bg-indigo-400 !border-2 !border-slate-950 !-top-1 opacity-0 group-hover:opacity-100"
            />
            <Handle
                type="source"
                id="source-top"
                position={Position.Top}
                className="!w-2 !h-2 !bg-indigo-400 !border-2 !border-slate-950 !-top-1 opacity-0 group-hover:opacity-100"
            />

            <Handle
                type="target"
                id="target-bottom"
                position={Position.Bottom}
                className="!w-2 !h-2 !bg-indigo-400 !border-2 !border-slate-950 !-bottom-1 opacity-0 group-hover:opacity-100"
            />
            <Handle
                type="source"
                id="source-bottom"
                position={Position.Bottom}
                className="!w-2 !h-2 !bg-indigo-400 !border-2 !border-slate-950 !-bottom-1 opacity-0 group-hover:opacity-100"
            />

            <Handle
                type="target"
                id="target-left"
                position={Position.Left}
                className="!w-2 !h-2 !bg-indigo-400 !border-2 !border-slate-950 !-left-1"
            />
            <Handle
                type="source"
                id="source-left"
                position={Position.Left}
                className="!w-2 !h-2 !bg-indigo-400 !border-2 !border-slate-950 !-left-1"
            />

            <Handle
                type="target"
                id="target-right"
                position={Position.Right}
                className="!w-2 !h-2 !bg-indigo-400 !border-2 !border-slate-950 !-right-1"
            />
            <Handle
                type="source"
                id="source-right"
                position={Position.Right}
                className="!w-2 !h-2 !bg-indigo-400 !border-2 !border-slate-950 !-right-1"
            />

            {/* Capçalera de classe UML estil Linear */}
            <div
                className={`px-3 py-2 flex items-center justify-between border-b transition-colors
                    ${isActive
                        ? 'bg-gradient-to-r from-indigo-950/90 to-purple-900/60 border-indigo-500/40 text-indigo-200'
                        : 'bg-gradient-to-r from-slate-900/95 to-slate-850 border-slate-800 text-slate-100'
                    }`}
            >
                <div className="flex items-center gap-2 font-mono font-bold text-xs tracking-wide">
                    <div className={`p-1 rounded-md ${isActive ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-indigo-400'}`}>
                        <Box size={13} />
                    </div>
                    <span>{umlClass.name}</span>
                </div>
                {umlClass.isAbstract && (
                    <span className="text-[10px] font-mono italic text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                        &laquo;abstract&raquo;
                    </span>
                )}
            </div>

            {/* Atributs de la classe */}
            <div className="divide-y divide-slate-800/40 text-xs py-1">
                {umlClass.attributes.length === 0 ? (
                    <div className="px-3 py-2 text-[11px] text-slate-500 italic">
                        Sense atributs propis
                    </div>
                ) : (
                    umlClass.attributes.map((attr: UMLAttribute) => (
                        <div
                            key={attr.name}
                            className="px-3 py-1.5 flex items-center justify-between text-slate-300 hover:bg-slate-800/40 transition-colors"
                        >
                            <div className="flex items-center gap-2 min-w-0 pr-2">
                                {attr.isId ? (
                                    <span title="Clau externa / Identificador">
                                        <Key size={12} className="text-amber-400 shrink-0 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]" />
                                    </span>
                                ) : (
                                    <Diamond size={8} className="text-slate-500 fill-slate-500 shrink-0" />
                                )}
                                <span className={`font-mono text-[11px] truncate ${attr.isId ? 'font-bold text-amber-200' : 'text-slate-200'}`}>
                                    {attr.name}
                                </span>
                                {attr.isId && (
                                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                        id
                                    </span>
                                )}
                                {attr.multiplicity && (
                                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
                                        {attr.multiplicity}
                                    </span>
                                )}
                            </div>

                            {attr.type && (
                                <span className="font-mono text-[10px] text-slate-400 shrink-0">
                                    {attr.type}
                                </span>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
});
