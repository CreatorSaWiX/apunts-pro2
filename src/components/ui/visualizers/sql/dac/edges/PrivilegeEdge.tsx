import React from 'react';
import {
    BaseEdge,
    EdgeLabelRenderer,
    getSmoothStepPath,
    MarkerType,
    type EdgeProps
} from '@xyflow/react';
import { Star, Key, Scissors } from 'lucide-react';

export interface PrivilegeEdgeData extends Record<string, unknown> {
    privilege: string;
    hasGrantOption?: boolean;
    status?: 'normal' | 'cut' | 'active_path';
}

export function PrivilegeEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    data
}: EdgeProps) {
    const edgeData = (data || {}) as PrivilegeEdgeData;
    const isCut = edgeData.status === 'cut';
    const isActivePath = edgeData.status === 'active_path';
    const hasGrantOption = Boolean(edgeData.hasGrantOption || edgeData.privilege?.includes('*'));

    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        borderRadius: 16
    });

    return (
        <>
            <BaseEdge
                id={id}
                path={edgePath}
                style={{
                    stroke: isCut
                        ? '#ef4444'
                        : isActivePath
                            ? '#10b981'
                            : hasGrantOption
                                ? '#f59e0b'
                                : '#38bdf8',
                    strokeWidth: isCut ? 1.5 : isActivePath ? 2.5 : 2,
                    strokeDasharray: isCut ? '5 5' : undefined,
                    opacity: isCut ? 0.4 : 1,
                    ...style
                }}
                markerEnd={isCut ? undefined : 'url(#dac-arrow)'}
            />

            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        pointerEvents: 'all'
                    }}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-xl nodrag nopan z-30 transition-all ${
                        isCut
                            ? 'bg-[#180a0d] border border-red-500/50 text-red-400 line-through'
                            : isActivePath
                                ? 'bg-[#081812] border border-emerald-500/60 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.35)]'
                                : hasGrantOption
                                    ? 'bg-[#181208] border border-amber-500/60 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                                    : 'bg-[#090d16] border border-sky-500/50 text-sky-300'
                    }`}
                >
                    {isCut ? (
                        <Scissors size={10} className="text-red-400" />
                    ) : hasGrantOption ? (
                        <Star size={10} className="text-amber-400 fill-amber-400" />
                    ) : (
                        <Key size={10} className="text-sky-400" />
                    )}
                    <span>{edgeData.privilege}</span>
                </div>
            </EdgeLabelRenderer>
        </>
    );
}
