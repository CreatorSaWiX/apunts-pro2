import React, { useMemo, useRef, useState } from 'react';
import {
    ReactFlow,
    Background,
    BackgroundVariant,
    Controls,
    useNodesState,
    useEdgesState,
    type Edge,
    type NodeTypes,
    type EdgeTypes
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Maximize2, Minimize2, RotateCcw, Layers } from 'lucide-react';
import { UMLClassNode, type UMLClassNodeType } from './nodes/UMLClassNode';
import { UMLEdge } from './edges/UMLEdge';
import { umlSchemas } from '../../../../../lib/simulations/content/uml/schemas';
import type { UMLSchema } from '../../../../../lib/simulations/content/uml/types';

interface UMLCanvasProps {
    schema?: string | UMLSchema;
    height?: number | string;
    interactive?: boolean;
    showHeader?: boolean;
    title?: string;
}

const nodeTypes: NodeTypes = {
    umlClass: UMLClassNode
};

const edgeTypes: EdgeTypes = {
    umlEdge: UMLEdge
};

export default function UMLCanvas({
    schema: schemaProp,
    height = 420,
    interactive = true,
    showHeader = true
}: UMLCanvasProps) {
    const rfInstanceRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const activeSchema: UMLSchema | undefined = useMemo(() => {
        if (!schemaProp) return umlSchemas.uml_associacions;
        if (typeof schemaProp === 'string') {
            return umlSchemas[schemaProp] || umlSchemas.uml_associacions;
        }
        return schemaProp;
    }, [schemaProp]);

    // Converteix classes a Nodes
    const initialNodes = useMemo<UMLClassNodeType[]>(() => {
        if (!activeSchema?.classes) return [];

        return activeSchema.classes.map((cls, idx) => {
            const defaultX = 80 + (idx % 2) * 380;
            const defaultY = 50 + Math.floor(idx / 2) * 220;

            return {
                id: cls.id,
                type: 'umlClass',
                position: { x: cls.x ?? defaultX, y: cls.y ?? defaultY },
                data: {
                    umlClass: cls,
                    isActive: false
                }
            };
        });
    }, [activeSchema]);

    // Converteix associacions a Edges
    const initialEdges = useMemo<Edge[]>(() => {
        if (!activeSchema?.associations) return [];

        const classPositions = new Map<string, { x: number; y: number }>();
        activeSchema.classes?.forEach((c, idx) => {
            const defaultX = 80 + (idx % 2) * 380;
            const defaultY = 50 + Math.floor(idx / 2) * 220;
            classPositions.set(c.id, { x: c.x ?? defaultX, y: c.y ?? defaultY });
        });

        return activeSchema.associations.map((ass) => {
            const fromPos = classPositions.get(ass.fromClass) || { x: 0, y: 0 };
            const toPos = classPositions.get(ass.toClass) || { x: 0, y: 0 };

            const isVertical = Math.abs(fromPos.y - toPos.y) > Math.abs(fromPos.x - toPos.x);
            let sourceHandle = 'source-right';
            let targetHandle = 'target-left';

            if (isVertical) {
                if (fromPos.y > toPos.y) {
                    sourceHandle = 'source-top';
                    targetHandle = 'target-bottom';
                } else {
                    sourceHandle = 'source-bottom';
                    targetHandle = 'target-top';
                }
            } else {
                if (fromPos.x > toPos.x) {
                    sourceHandle = 'source-left';
                    targetHandle = 'target-right';
                } else {
                    sourceHandle = 'source-right';
                    targetHandle = 'target-left';
                }
            }

            return {
                id: ass.id,
                source: ass.fromClass,
                target: ass.toClass,
                sourceHandle,
                targetHandle,
                type: 'umlEdge',
                data: {
                    name: ass.name,
                    fromMultiplicity: ass.fromMultiplicity,
                    toMultiplicity: ass.toMultiplicity,
                    type: ass.type || 'association'
                }
            };
        });
    }, [activeSchema]);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    React.useEffect(() => {
        setNodes(initialNodes);
    }, [initialNodes, setNodes]);

    React.useEffect(() => {
        setEdges(initialEdges);
    }, [initialEdges, setEdges]);

    const handleResetView = () => {
        setNodes(initialNodes);
        if (rfInstanceRef.current) {
            rfInstanceRef.current.fitView({ padding: 0.25, duration: 300 });
        }
    };

    const toggleFullscreen = () => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(() => {});
            setIsFullscreen(true);
        } else {
            document.exitFullscreen().catch(() => {});
            setIsFullscreen(false);
        }
    };

    React.useEffect(() => {
        const handleFs = () => setIsFullscreen(Boolean(document.fullscreenElement));
        document.addEventListener('fullscreenchange', handleFs);
        return () => document.removeEventListener('fullscreenchange', handleFs);
    }, []);

    const containerHeight = isFullscreen ? '100vh' : typeof height === 'number' ? `${height}px` : height;

    return (
        <div
            ref={containerRef}
            style={{ height: containerHeight }}
            className={`w-full flex flex-col overflow-hidden select-none ${
                showHeader
                    ? 'rounded-2xl border border-slate-800/80 bg-[#0d1117] shadow-2xl my-6'
                    : 'bg-[#090d16]'
            } ${isFullscreen ? 'fixed inset-0 z-50 rounded-none border-0 my-0' : ''}`}
        >
            {showHeader && (
                <div className="h-10 border-b border-slate-800/80 flex items-end px-3 shrink-0 bg-[#0a0d14] justify-between">
                    <div className="flex items-end h-full">
                        <div className="px-3.5 py-2 border-t border-x rounded-t-xl text-[11px] font-mono tracking-wider flex gap-2 items-center shadow-sm relative top-px z-10 bg-[#0d1117] border-slate-800/80 text-emerald-400 font-bold whitespace-nowrap">
                            <Layers size={13} className="text-emerald-400 shrink-0" />
                            <span>Esquema UML</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 pb-1.5 z-10">
                        <button
                            type="button"
                            aria-label="Reiniciar posició"
                            onClick={handleResetView}
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                            title="Reiniciar posició"
                        >
                            <RotateCcw size={13} />
                        </button>
                        <button
                            type="button"
                            aria-label={isFullscreen ? "Sortir de pantalla completa" : "Pantalla completa"}
                            onClick={toggleFullscreen}
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                            title={isFullscreen ? 'Sortir de pantalla completa' : 'Pantalla completa'}
                        >
                            {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                        </button>
                    </div>
                </div>
            )}

            {/* Canvas interactiu */}
            <div className="flex-1 min-h-0 relative bg-[#090d16]">
                <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                    <defs>
                        <marker
                            id="uml-inheritance-arrow"
                            viewBox="0 0 16 16"
                            refX="14"
                            refY="8"
                            markerWidth="14"
                            markerHeight="14"
                            orient="auto-start-reverse"
                        >
                            <polygon
                                points="2 2, 14 8, 2 14"
                                fill="#090d16"
                                stroke="#38bdf8"
                                strokeWidth="2"
                                strokeLinejoin="round"
                            />
                        </marker>
                    </defs>
                </svg>

                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={interactive ? onNodesChange : undefined}
                    onEdgesChange={interactive ? onEdgesChange : undefined}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    onInit={(instance) => {
                        rfInstanceRef.current = instance;
                        requestAnimationFrame(() => {
                            instance.fitView({ padding: 0.25 });
                        });
                    }}
                    fitView
                    fitViewOptions={{ padding: 0.25 }}
                    minZoom={0.4}
                    maxZoom={1.6}
                    nodesDraggable={interactive}
                    nodesConnectable={false}
                    elementsSelectable={interactive}
                    proOptions={{ hideAttribution: true }}
                >
                    <Background
                        variant={BackgroundVariant.Lines}
                        gap={24}
                        size={1}
                        color="rgba(255, 255, 255, 0.04)"
                    />
                    <Controls
                        showInteractive={false}
                        className="!bg-[#161b22]/90 !border-slate-800 !shadow-xl [&>button]:!bg-[#161b22] [&>button]:!border-slate-700/60 [&>button]:!text-slate-300 [&>button:hover]:!bg-slate-800"
                    />
                </ReactFlow>
            </div>
        </div>
    );
}
