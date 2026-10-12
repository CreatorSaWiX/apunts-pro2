import React, { memo } from 'react';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import { Diamond } from 'lucide-react';
import type { UMLClass } from '../../../../../../lib/simulations/content/uml/types';

export interface UMLDiamondNodeData extends Record<string, unknown> {
    umlClass: UMLClass;
    isActive?: boolean;
}

export type UMLDiamondNodeType = Node<UMLDiamondNodeData, 'umlDiamond'>;

export const UMLDiamondNode = memo(function UMLDiamondNode({ data }: NodeProps<UMLDiamondNodeType>) {
    const { umlClass, isActive } = data;

    return (
        <div className="relative flex items-center justify-center w-28 h-28 select-none">
            {/* Handles als 4 vèrtexs del diamant */}
            <Handle
                type="target"
                id="target-top"
                position={Position.Top}
                className="!w-2.5 !h-2.5 !bg-indigo-400 !border-2 !border-slate-950 !top-0"
            />
            <Handle
                type="source"
                id="source-top"
                position={Position.Top}
                className="!w-2.5 !h-2.5 !bg-indigo-400 !border-2 !border-slate-950 !top-0"
            />

            <Handle
                type="target"
                id="target-bottom"
                position={Position.Bottom}
                className="!w-2.5 !h-2.5 !bg-indigo-400 !border-2 !border-slate-950 !bottom-0"
            />
            <Handle
                type="source"
                id="source-bottom"
                position={Position.Bottom}
                className="!w-2.5 !h-2.5 !bg-indigo-400 !border-2 !border-slate-950 !bottom-0"
            />

            <Handle
                type="target"
                id="target-left"
                position={Position.Left}
                className="!w-2.5 !h-2.5 !bg-indigo-400 !border-2 !border-slate-950 !left-0"
            />
            <Handle
                type="source"
                id="source-left"
                position={Position.Left}
                className="!w-2.5 !h-2.5 !bg-indigo-400 !border-2 !border-slate-950 !left-0"
            />

            <Handle
                type="target"
                id="target-right"
                position={Position.Right}
                className="!w-2.5 !h-2.5 !bg-indigo-400 !border-2 !border-slate-950 !right-0"
            />
            <Handle
                type="source"
                id="source-right"
                position={Position.Right}
                className="!w-2.5 !h-2.5 !bg-indigo-400 !border-2 !border-slate-950 !right-0"
            />

            {/* Figura de rombe girada 45 graus */}
            <div
                className={`w-20 h-20 rotate-45 rounded-xl border-2 transition-all duration-300 shadow-2xl flex items-center justify-center backdrop-blur-md
                    ${isActive
                        ? 'border-indigo-400 bg-gradient-to-br from-indigo-950/95 to-purple-900/90 shadow-[0_0_25px_rgba(99,102,241,0.5)]'
                        : 'border-indigo-500/60 bg-gradient-to-br from-slate-900/95 via-[#0d1424] to-indigo-950/80 shadow-[0_0_15px_rgba(99,102,241,0.25)] hover:border-indigo-400'
                    }`}
            >
                {/* Contingut interior contra-girat per mantenir el text horitzontal */}
                <div className="-rotate-45 flex flex-col items-center justify-center text-center px-1">
                    <Diamond size={13} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] mb-0.5" />
                    <span className="font-mono font-bold text-[11px] text-cyan-200 tracking-tight leading-tight">
                        {umlClass.name}
                    </span>
                    <span className="text-[9px] font-sans text-indigo-300/80 font-medium tracking-wider uppercase mt-0.5">
                        Relació
                    </span>
                </div>
            </div>
        </div>
    );
});
