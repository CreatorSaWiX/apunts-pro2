import React, { useMemo, useEffect, useRef } from 'react';
import {
    ReactFlow,
    Background,
    BackgroundVariant,
    Controls,
    MarkerType,
    useNodesState,
    useEdgesState,
    type Edge,
    type NodeTypes,
    type ReactFlowInstance
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { TableNode, type TableNodeType } from './nodes/TableNode';
import type { SQLDatabaseSchema } from '../../../../lib/simulations/engine/types';

interface SchemaCanvasProps {
    schema?: SQLDatabaseSchema;
    activeTables?: string[];
    activeColumns?: Record<string, string[]>;
    interactive?: boolean;
}

const nodeTypes: NodeTypes = {
    table: TableNode
};

export default function SchemaCanvas({
    schema,
    activeTables = [],
    activeColumns = {},
    interactive = true
}: SchemaCanvasProps) {
    const rfInstanceRef = useRef<any>(null);

    // Converteix schema.tables en Nodes de ReactFlow
    const initialNodes = useMemo<TableNodeType[]>(() => {
        if (!schema?.tables) return [];

        return schema.tables.map((table, idx) => {
            // Distribució per defecte si no té coordenades x, y
            const defaultX = 60 + (idx % 2) * 380;
            const defaultY = 40 + Math.floor(idx / 2) * 260;

            const isActive = activeTables.includes(table.name);
            const cols = activeColumns[table.name] || [];

            return {
                id: table.name,
                type: 'table',
                position: { x: table.x ?? defaultX, y: table.y ?? defaultY },
                data: {
                    schema: table,
                    isActive,
                    activeColumns: cols
                }
            };
        });
    }, [schema?.tables, activeTables, activeColumns]);

    // Converteix schema.relations en Edges de ReactFlow amb encaminament òptim de costats
    const initialEdges = useMemo<Edge[]>(() => {
        if (!schema?.relations) return [];

        const tablePositions = new Map<string, { x: number; y: number }>();
        schema.tables?.forEach((t, idx) => {
            const defaultX = 60 + (idx % 2) * 380;
            const defaultY = 40 + Math.floor(idx / 2) * 260;
            tablePositions.set(t.name, { x: t.x ?? defaultX, y: t.y ?? defaultY });
        });

        return schema.relations.map((rel) => {
            const isSourceActive = activeTables.includes(rel.fromTable);
            const isTargetActive = activeTables.includes(rel.toTable);
            const isRelationActive = isSourceActive && isTargetActive;

            const fromPos = tablePositions.get(rel.fromTable) || { x: 0, y: 0 };
            const toPos = tablePositions.get(rel.toTable) || { x: 0, y: 0 };

            // Connexió directa sense bucles: si la font està a la dreta del destí, surt per l'esquerra i entra per la dreta
            const sourceSide = fromPos.x > toPos.x ? 'left' : 'right';
            const targetSide = fromPos.x > toPos.x ? 'right' : 'left';

            return {
                id: `${rel.fromTable}_${rel.fromColumn}__${rel.toTable}_${rel.toColumn}`,
                source: rel.fromTable,
                sourceHandle: `${rel.fromTable}-${rel.fromColumn}-source-${sourceSide}`,
                target: rel.toTable,
                targetHandle: `${rel.toTable}-${rel.toColumn}-target-${targetSide}`,
                type: 'smoothstep',
                animated: isRelationActive,
                style: {
                    stroke: isRelationActive ? '#38bdf8' : '#475569',
                    strokeWidth: isRelationActive ? 2.5 : 1.5,
                },
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    width: 14,
                    height: 14,
                    color: isRelationActive ? '#38bdf8' : '#475569'
                },
                label: rel.cardinality || '1:N',
                labelStyle: { fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' },
                labelBgStyle: { fill: '#0b0f19', fillOpacity: 0.9, rx: 4, ry: 4 },
                labelBgPadding: [4, 2]
            };
        });
    }, [schema?.relations, schema?.tables, activeTables]);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // Sincronitza l'estat quan canvien les props de simulació PRESERVANT posicions arrossegades
    useEffect(() => {
        setNodes((prevNodes) =>
            initialNodes.map((node) => {
                const prev = prevNodes.find((p) => p.id === node.id);
                return prev ? { ...node, position: prev.position } : node;
            })
        );
    }, [initialNodes, setNodes]);

    useEffect(() => {
        setEdges(initialEdges);
    }, [initialEdges, setEdges]);

    return (
        <div className="w-full h-full min-h-[300px] bg-[#090d16] relative overflow-hidden select-none">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={interactive ? onNodesChange : undefined}
                onEdgesChange={interactive ? onEdgesChange : undefined}
                nodeTypes={nodeTypes}
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
                {/* Quadrícula Workbench */}
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
    );
}
