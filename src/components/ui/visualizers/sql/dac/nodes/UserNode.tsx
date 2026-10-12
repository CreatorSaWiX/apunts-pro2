import React, { memo } from 'react';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import { Crown, User, ShieldCheck, ShieldAlert, Key } from 'lucide-react';

export interface UserNodeData extends Record<string, unknown> {
    name: string;
    role?: string;
    isOwner?: boolean;
    status: 'active' | 'revoked' | 'saved_by_alternative';
    privileges: string[];
}

export type UserNodeType = Node<UserNodeData, 'userNode'>;

export const UserNode = memo(function UserNode({ data }: NodeProps<UserNodeType>) {
    const { name, role, isOwner, status, privileges } = data;

    const isRevoked = status === 'revoked';
    const isSavedByAlt = status === 'saved_by_alternative';

    return (
        <div
            className={`rounded-xl border transition-all duration-300 w-[175px] shadow-2xl backdrop-blur-md overflow-hidden font-sans select-none
                ${isOwner
                    ? 'border-amber-500/60 bg-[#161208]/95 ring-2 ring-amber-500/30 shadow-[0_0_25px_rgba(245,158,11,0.25)]'
                    : isRevoked
                        ? 'border-red-500/40 bg-[#180d10]/90 opacity-60 grayscale-[40%]'
                        : isSavedByAlt
                            ? 'border-emerald-500/60 bg-[#0d1a14]/95 ring-2 ring-emerald-500/30'
                            : 'border-slate-800 bg-[#0d1117]/95 hover:border-slate-700'
                }`}
        >
            {/* Handles a les 4 cares */}
            <Handle type="target" id="target-left" position={Position.Left} className="!w-2 !h-2 !bg-sky-400 !border-2 !border-slate-950 !-left-1" />
            <Handle type="source" id="source-left" position={Position.Left} className="!w-2 !h-2 !bg-sky-400 !border-2 !border-slate-950 !-left-1" />
            <Handle type="target" id="target-right" position={Position.Right} className="!w-2 !h-2 !bg-sky-400 !border-2 !border-slate-950 !-right-1" />
            <Handle type="source" id="source-right" position={Position.Right} className="!w-2 !h-2 !bg-sky-400 !border-2 !border-slate-950 !-right-1" />
            <Handle type="target" id="target-top" position={Position.Top} className="!w-2 !h-2 !bg-sky-400 !border-2 !border-slate-950 !-top-1" />
            <Handle type="source" id="source-top" position={Position.Top} className="!w-2 !h-2 !bg-sky-400 !border-2 !border-slate-950 !-top-1" />
            <Handle type="target" id="target-bottom" position={Position.Bottom} className="!w-2 !h-2 !bg-sky-400 !border-2 !border-slate-950 !-bottom-1" />
            <Handle type="source" id="source-bottom" position={Position.Bottom} className="!w-2 !h-2 !bg-sky-400 !border-2 !border-slate-950 !-bottom-1" />

            {/* Capçalera d'usuari */}
            <div
                className={`px-2.5 py-1.5 border-b flex items-center justify-between transition-colors
                    ${isOwner
                        ? 'bg-gradient-to-r from-amber-950/80 to-yellow-900/40 border-amber-500/30 text-amber-200'
                        : isRevoked
                            ? 'bg-red-950/40 border-red-500/30 text-red-300'
                            : 'bg-slate-900/90 border-slate-800 text-slate-200'
                    }`}
            >
                <div className="flex items-center gap-1.5 font-mono font-bold text-xs truncate">
                    <div
                        className={`p-1 rounded-md shrink-0 ${
                            isOwner
                                ? 'bg-amber-500/20 text-amber-300'
                                : isRevoked
                                    ? 'bg-red-500/20 text-red-400'
                                    : 'bg-slate-800 text-sky-400'
                        }`}
                    >
                        {isOwner ? <Crown size={12} /> : <User size={12} />}
                    </div>
                    <span className="truncate">{name}</span>
                </div>

                {/* Badge d'estat */}
                {isOwner ? (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                        DBA
                    </span>
                ) : isRevoked ? (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1 shrink-0">
                        <ShieldAlert size={9} /> REVOCAT
                    </span>
                ) : isSavedByAlt ? (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 shrink-0" title="Conserva el permís per camí alternatiu">
                        <ShieldCheck size={9} /> CAMÍ ALT.
                    </span>
                ) : (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20 shrink-0">
                        {role || 'USUARI'}
                    </span>
                )}
            </div>

            {/* Privilegis de l'usuari */}
            <div className="p-2 flex flex-wrap gap-1 bg-[#090d16]">
                {privileges.length === 0 ? (
                    <span className="text-[10px] font-mono text-slate-600 italic">Sense privilegis</span>
                ) : (
                    privileges.map((p, i) => {
                        const hasGrantOption = p.includes('*');
                        return (
                            <span
                                key={i}
                                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium flex items-center gap-1 ${
                                    isRevoked
                                        ? 'line-through text-red-400/70 bg-red-950/20 border border-red-500/20'
                                        : hasGrantOption
                                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                            : 'bg-slate-800 text-sky-300 border border-slate-700/80'
                                }`}
                            >
                                <Key size={10} className={hasGrantOption ? 'text-amber-400' : 'text-sky-400'} />
                                <span>{p}</span>
                            </span>
                        );
                    })
                )}
            </div>
        </div>
    );
});
