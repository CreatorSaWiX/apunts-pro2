import React, { useState, useMemo, useRef } from 'react';
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
import { Shield } from 'lucide-react';
import { UserNode, type UserNodeType } from './nodes/UserNode';
import { PrivilegeEdge } from './edges/PrivilegeEdge';

const nodeTypes: NodeTypes = {
    userNode: UserNode
};

const edgeTypes: EdgeTypes = {
    privilegeEdge: PrivilegeEdge
};

type SimulationState = 'initial' | 'revoke_cascade' | 'revoke_grant_option';

export default function DACVisualizer() {
    const rfInstanceRef = useRef<any>(null);
    const [simState, setSimState] = useState<SimulationState>('initial');

    const nodes = useMemo<UserNodeType[]>(() => {
        const isRevokeCascade = simState === 'revoke_cascade';
        const isRevokeGrantOption = simState === 'revoke_grant_option';

        return [
            {
                id: 'propietari',
                type: 'userNode',
                position: { x: 50, y: 180 },
                data: {
                    name: 'Propietari',
                    isOwner: true,
                    status: 'active',
                    privileges: ['ALL*']
                }
            },
            {
                id: 'anna',
                type: 'userNode',
                position: { x: 440, y: 40 },
                data: {
                    name: 'Anna',
                    role: 'Delegada',
                    status: isRevokeCascade ? 'revoked' : 'active',
                    privileges: isRevokeCascade
                        ? []
                        : isRevokeGrantOption
                            ? ['SELECT']
                            : ['SELECT*']
                }
            },
            {
                id: 'pep',
                type: 'userNode',
                position: { x: 440, y: 320 },
                data: {
                    name: 'Pep',
                    role: 'Analista',
                    status: isRevokeCascade ? 'saved_by_alternative' : 'active',
                    privileges: ['SELECT']
                }
            },
            {
                id: 'carles',
                type: 'userNode',
                position: { x: 820, y: 180 },
                data: {
                    name: 'Carles',
                    role: 'Desenvolupador',
                    status: 'active',
                    privileges: ['SELECT']
                }
            }
        ];
    }, [simState]);

    const edges = useMemo<Edge[]>(() => {
        const isRevokeCascade = simState === 'revoke_cascade';
        const isRevokeGrantOption = simState === 'revoke_grant_option';

        return [
            {
                id: 'edge_prop_anna',
                source: 'propietari',
                target: 'anna',
                sourceHandle: 'source-top',
                targetHandle: 'target-left',
                type: 'privilegeEdge',
                data: {
                    privilege: isRevokeGrantOption ? 'SELECT' : 'SELECT*',
                    hasGrantOption: !isRevokeGrantOption,
                    status: isRevokeCascade ? 'cut' : 'normal'
                }
            },
            {
                id: 'edge_prop_pep',
                source: 'propietari',
                target: 'pep',
                sourceHandle: 'source-bottom',
                targetHandle: 'target-left',
                type: 'privilegeEdge',
                data: {
                    privilege: 'SELECT',
                    hasGrantOption: false,
                    status: isRevokeCascade ? 'active_path' : 'normal'
                }
            },
            {
                id: 'edge_anna_pep',
                source: 'anna',
                target: 'pep',
                sourceHandle: 'source-bottom',
                targetHandle: 'target-top',
                type: 'privilegeEdge',
                data: {
                    privilege: 'SELECT',
                    hasGrantOption: false,
                    status: (isRevokeCascade || isRevokeGrantOption) ? 'cut' : 'normal'
                }
            },
            {
                id: 'edge_pep_carles',
                source: 'pep',
                target: 'carles',
                sourceHandle: 'source-right',
                targetHandle: 'target-left',
                type: 'privilegeEdge',
                data: {
                    privilege: 'SELECT',
                    hasGrantOption: false,
                    status: isRevokeCascade ? 'active_path' : 'normal'
                }
            }
        ];
    }, [simState]);

    const [rfNodes, setRfNodes, onNodesChange] = useNodesState(nodes);
    const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState(edges);

    React.useEffect(() => {
        setRfNodes(nodes);
    }, [nodes, setRfNodes]);

    React.useEffect(() => {
        setRfEdges(edges);
    }, [edges, setRfEdges]);

    const statusMessage = useMemo(() => {
        switch (simState) {
            case 'initial':
                return "Estat inicial: Anna rep SELECT* del propietari; Pep rep permís tant d'Anna com directament del Propietari.";
            case 'revoke_cascade':
                return "REVOKE Anna CASCADE: Aresta d'Anna tallada. Pep conserva el permís pel camí directe alternatiu del propietari.";
            case 'revoke_grant_option':
                return "REVOKE GRANT OPTION: Anna perd el dret a delegar (SELECT* -> SELECT), mantenint el permís per a ella mateixa.";
        }
    }, [simState]);

    return (
        <div className="w-full rounded-2xl border border-slate-800/80 bg-[#0d1117] flex flex-col overflow-hidden shadow-2xl my-6 select-none font-sans">
            {/* Header d'estil Apple / Linear */}
            <div className="h-10 border-b border-slate-800/80 flex items-end px-3 shrink-0 bg-[#0a0d14] overflow-x-auto overflow-y-hidden custom-scrollbar">
                <div className="px-3.5 py-2 border-t border-x rounded-t-xl text-[10px] sm:text-[11px] font-mono tracking-wider flex gap-2 items-center bg-[#0d1117] border-slate-800/80 text-emerald-400 font-bold whitespace-nowrap shrink-0">
                    <Shield size={13} className="text-emerald-400 shrink-0" />
                    <span>Graf DAC</span>
                </div>

                <div className="flex items-center gap-1 ml-2">
                    <button
                        type="button"
                        onClick={() => setSimState('initial')}
                        className={`px-3 py-2 border-t border-x rounded-t-xl text-[10px] sm:text-[11px] font-mono tracking-wider flex items-center transition-colors whitespace-nowrap shrink-0 cursor-pointer relative top-px ${
                            simState === 'initial'
                                ? 'bg-[#0d1117] border-slate-800/80 text-emerald-400 font-bold z-10'
                                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                        }`}
                    >
                        Inicial
                    </button>
                    <button
                        type="button"
                        onClick={() => setSimState('revoke_cascade')}
                        className={`px-3 py-2 border-t border-x rounded-t-xl text-[10px] sm:text-[11px] font-mono tracking-wider flex items-center transition-colors whitespace-nowrap shrink-0 cursor-pointer relative top-px ${
                            simState === 'revoke_cascade'
                                ? 'bg-[#0d1117] border-slate-800/80 text-emerald-400 font-bold z-10'
                                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                        }`}
                    >
                        REVOKE CASCADE
                    </button>
                    <button
                        type="button"
                        onClick={() => setSimState('revoke_grant_option')}
                        className={`px-3 py-2 border-t border-x rounded-t-xl text-[10px] sm:text-[11px] font-mono tracking-wider flex items-center transition-colors whitespace-nowrap shrink-0 cursor-pointer relative top-px ${
                            simState === 'revoke_grant_option'
                                ? 'bg-[#0d1117] border-slate-800/80 text-emerald-400 font-bold z-10'
                                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                        }`}
                    >
                        REVOKE GRANT OPTION
                    </button>
                </div>

                <div className="flex-1 border-b border-slate-800/80 h-full relative z-0 min-w-5"></div>
            </div>

            {/* Canvas interactiu amb React Flow */}
            <div className="h-[440px] relative bg-[#090d16]">
                <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                    <defs>
                        <marker
                            id="dac-arrow"
                            viewBox="0 0 10 10"
                            refX="8"
                            refY="5"
                            markerWidth="10"
                            markerHeight="10"
                            orient="auto-start-reverse"
                        >
                            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8" />
                        </marker>
                    </defs>
                </svg>

                <ReactFlow
                    nodes={rfNodes}
                    edges={rfEdges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    onInit={(instance) => {
                        rfInstanceRef.current = instance;
                        requestAnimationFrame(() => {
                            instance.fitView({ padding: 0.18 });
                        });
                    }}
                    fitView
                    fitViewOptions={{ padding: 0.18 }}
                    minZoom={0.5}
                    maxZoom={1.5}
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
                        className="!bg-[#111622]/90 !border-slate-800 !shadow-xl [&>button]:!bg-[#111622] [&>button]:!border-slate-700/60 [&>button]:!text-slate-300"
                    />
                </ReactFlow>
            </div>

            {/* Barra d'estat d'una sola línia */}
            <div className="h-8 px-3 border-t border-slate-800/80 bg-[#0a0d14] flex items-center shrink-0">
                <span className="text-[11px] font-mono text-emerald-400/90 truncate">
                    {statusMessage}
                </span>
            </div>
        </div>
    );
}
