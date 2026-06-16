import React, { useMemo, useCallback, useState } from 'react';
import { ReactFlow, Controls } from '@xyflow/react'; 
import { useRoadmap } from '../../../contexts/RoadmapContext';
import type { SubjectNodeData } from '../../../contexts/RoadmapContext';
import SubjectNode from './SubjectNode';
import SubjectContextMenu from './SubjectContextMenu';
import NavigationPill from '../../ui/NavigationPill';
import { Wand2, Save, Loader2, Plus, GraduationCap } from 'lucide-react';

const nodeTypes = {
    subjectNode: SubjectNode,
};

const RoadmapView: React.FC = () => {
    const { nodes, edges, onNodesChange, onEdgesChange, onConnect, saveRoadmap, isLoading, canStartMaster, totalPassedECTS } = useRoadmap();
    const [isSaving, setIsSaving] = useState(false);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState<{x: number, y: number} | null>(null);

    // Set the node type for all nodes
    const typedNodes = useMemo(() => {
        return nodes.map(n => ({ ...n, type: 'subjectNode' }));
    }, [nodes]);

    const onNodeClick = useCallback((event: React.MouseEvent, node: any) => {
        setSelectedNodeId(node.id);
        setMenuPosition({ x: event.clientX, y: event.clientY });
        setIsMenuOpen(true);
    }, []);

    const selectedNodeData = useMemo(() => {
        if (!selectedNodeId) return null;
        const node = nodes.find(n => n.id === selectedNodeId);
        return node ? node.data as SubjectNodeData : null;
    }, [selectedNodeId, nodes]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await saveRoadmap();
        } catch(err) {
            console.error("Failed to save", err);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#09090b]">
                <Loader2 className="w-8 h-8 text-sky-500 animate-spin mb-4" />
                <span className="text-sky-500/70 font-mono text-sm tracking-widest uppercase">Carregant Roadmap...</span>
            </div>
        );
    }

    return (
        <div className="w-full h-full relative bg-[#09090b] overflow-hidden flex">
            {/* Custom Circuit Board Background */}
            <div className="absolute inset-0 pointer-events-none opacity-20" 
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2338bdf8' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            <div className="flex-1 relative">
                <ReactFlow
                    nodes={typedNodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onNodeClick={onNodeClick}
                    nodeTypes={nodeTypes}
                    fitView
                    fitViewOptions={{ padding: 0.2 }}
                    proOptions={{ hideAttribution: true }}
                    className="bg-transparent"
                    minZoom={0.2}
                    defaultEdgeOptions={{
                        type: 'smoothstep',
                        animated: true,
                        style: { stroke: 'rgba(56, 189, 248, 0.4)', strokeWidth: 2 }
                    }}
                >
                    <Controls className="!bg-slate-900/80 !border-white/10 !fill-white" />
                </ReactFlow>

                {/* Info Panel Top Left */}
                <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
                    <div className="bg-slate-900/80 backdrop-blur border border-white/10 rounded-xl p-4 flex items-center gap-4">
                        <div className="flex flex-col">
                            <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Crèdits Aprovats</span>
                            <span className="text-2xl font-bold text-white">{totalPassedECTS} <span className="text-sm font-normal text-slate-500">/ 240 ECTS</span></span>
                        </div>
                    </div>
                    {canStartMaster && (
                        <div className="bg-orange-500/20 backdrop-blur border border-orange-500/50 rounded-xl p-3 flex items-center gap-3 animate-pulse">
                            <GraduationCap className="text-orange-400" />
                            <span className="text-sm font-medium text-orange-200">Requisits de Màster (PARS) Assolits!</span>
                        </div>
                    )}
                </div>

                {/* Action Buttons Bottom Right */}
                <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-4 items-end">
                    
                    {/* Add Node Button */}
                    <button className="h-12 px-6 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(56,189,248,0.4)] transition-all transform hover:scale-105">
                        <Plus size={20} />
                        Afegir Assignatura
                    </button>

                    <NavigationPill>
                        <button 
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`h-10 px-4 flex items-center gap-2 text-sm font-bold transition-colors ${isSaving ? 'text-slate-500' : 'text-slate-300 hover:text-white'}`}
                        >
                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            Guardar
                        </button>
                        <div className="w-px h-5 bg-white/10 mx-1" />
                        <button className="h-10 px-4 flex items-center gap-2 text-sm font-bold text-sky-400 hover:text-sky-300 transition-colors">
                            <Wand2 size={16} />
                            Planificar amb IA
                        </button>
                    </NavigationPill>
                </div>
            </div>

            <SubjectContextMenu 
                isOpen={isMenuOpen} 
                onClose={() => setIsMenuOpen(false)} 
                nodeId={selectedNodeId} 
                nodeData={selectedNodeData}
                position={menuPosition}
            />
        </div>
    );
};

export default RoadmapView;
