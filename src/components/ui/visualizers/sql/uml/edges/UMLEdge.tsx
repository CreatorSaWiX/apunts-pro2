import React from 'react';
import {
    BaseEdge,
    EdgeLabelRenderer,
    getSmoothStepPath,
    Position,
    type EdgeProps
} from '@xyflow/react';

export interface UMLEdgeData extends Record<string, unknown> {
    name?: string;
    fromMultiplicity?: string;
    toMultiplicity?: string;
    type?: 'association' | 'inheritance' | 'aggregation' | 'composition';
}

export function UMLEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    data
}: EdgeProps) {
    const edgeData = (data || {}) as UMLEdgeData;
    const isInheritance = edgeData.type === 'inheritance';

    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        borderRadius: 16
    });

    // Càlcul de posicions de les etiquetes de multiplicitat
    const getMultiplicityOffset = (x: number, y: number, position: Position) => {
        switch (position) {
            case Position.Left:
                return { x: x - 18, y: y - 14 };
            case Position.Right:
                return { x: x + 18, y: y - 14 };
            case Position.Top:
                return { x: x + 14, y: y - 16 };
            case Position.Bottom:
                return { x: x + 14, y: y + 16 };
            default:
                return { x, y };
        }
    };

    const sourceLabelPos = getMultiplicityOffset(sourceX, sourceY, sourcePosition);
    const targetLabelPos = getMultiplicityOffset(targetX, targetY, targetPosition);

    return (
        <>
            <BaseEdge
                id={id}
                path={edgePath}
                style={{
                    stroke: isInheritance ? '#818cf8' : '#64748b',
                    strokeWidth: isInheritance ? 2.5 : 1.75,
                    ...style
                }}
                markerEnd={isInheritance ? 'url(#uml-inheritance-arrow)' : markerEnd}
            />

            <EdgeLabelRenderer>
                {/* 1. Multiplicitat a l'extrem d'origen (Font) */}
                {!isInheritance && edgeData.fromMultiplicity && (
                    <div
                        style={{
                            position: 'absolute',
                            transform: `translate(-50%, -50%) translate(${sourceLabelPos.x}px,${sourceLabelPos.y}px)`,
                            pointerEvents: 'all'
                        }}
                        className="px-1.5 py-0.5 rounded bg-slate-900/90 border border-slate-700/80 text-[10px] font-mono font-bold text-amber-300 shadow-md nodrag nopan z-20"
                    >
                        {edgeData.fromMultiplicity}
                    </div>
                )}

                {/* 2. Nom de l'associació / Rol al centre */}
                {edgeData.name && (
                    <div
                        style={{
                            position: 'absolute',
                            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                            pointerEvents: 'all'
                        }}
                        className="px-2.5 py-1 rounded-full bg-[#0d1117]/95 border border-indigo-500/40 text-[11px] font-sans font-medium text-indigo-200 shadow-xl backdrop-blur-md nodrag nopan z-20 flex items-center gap-1.5"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                        <span>{edgeData.name}</span>
                    </div>
                )}

                {/* 3. Multiplicitat a l'extrem de destí */}
                {!isInheritance && edgeData.toMultiplicity && (
                    <div
                        style={{
                            position: 'absolute',
                            transform: `translate(-50%, -50%) translate(${targetLabelPos.x}px,${targetLabelPos.y}px)`,
                            pointerEvents: 'all'
                        }}
                        className="px-1.5 py-0.5 rounded bg-slate-900/90 border border-slate-700/80 text-[10px] font-mono font-bold text-sky-300 shadow-md nodrag nopan z-20"
                    >
                        {edgeData.toMultiplicity}
                    </div>
                )}
            </EdgeLabelRenderer>
        </>
    );
}
