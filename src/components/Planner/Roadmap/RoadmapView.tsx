import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { ReactFlow, Panel, Background, BackgroundVariant, useReactFlow } from '@xyflow/react';
import { useRoadmap } from '../../../contexts/RoadmapContext';
import type { SubjectNodeData } from '../../../contexts/RoadmapContext';
import SubjectNode from './SubjectNode';
import SubjectContextMenu from './SubjectContextMenu';
import SubjectSearchModal from './SubjectSearchModal';
import SubjectDetailsModal from './SubjectDetailsModal';
import RoadmapAIPromptBar from './RoadmapAIPromptBar';
import Spinner from '../../ui/Spinner';
import { Save, Plus, GraduationCap, ChevronUp, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { specializations } from '../../../data/curriculum';
import { motion, AnimatePresence, useIsPresent } from 'framer-motion';
import { SpecializationModal } from './SpecializationModal';
import LiquidPanel from '../../ui/glass/LiquidPanel';
import LiquidDropdown from '../../ui/glass/LiquidDropdown';
import { LiquidToolbar, LiquidToolbarButton } from '../../ui/glass/LiquidToolbar';
import { Modal } from '../../ui/Modal';

const nodeTypes = {
    subjectNode: SubjectNode,
};

// Custom Zoom Controls Component
const CustomControls = () => {
    const { zoomIn, zoomOut, fitView } = useReactFlow();
    return (
        <Panel position="bottom-left" className="m-6 z-40">
            <LiquidPanel className="flex flex-col gap-2 p-2">
                <button onClick={() => zoomIn({ duration: 400 })} className="p-2.5 text-slate-400 hover:text-sky-400 hover:bg-white/5 rounded-xl transition-all hover:scale-110 active:scale-95" title="Zoom In">
                    <ZoomIn size={18} strokeWidth={2.5} />
                </button>
                <div className="w-full h-px bg-white/5" />
                <button onClick={() => zoomOut({ duration: 400 })} className="p-2.5 text-slate-400 hover:text-sky-400 hover:bg-white/5 rounded-xl transition-all hover:scale-110 active:scale-95" title="Zoom Out">
                    <ZoomOut size={18} strokeWidth={2.5} />
                </button>
                <div className="w-full h-px bg-white/5" />
                <button onClick={() => fitView({ padding: 0.2, duration: 800 })} className="p-2.5 text-slate-400 hover:text-sky-400 hover:bg-white/5 rounded-xl transition-all hover:scale-110 active:scale-95" title="Fit View">
                    <Maximize size={18} strokeWidth={2.5} />
                </button>
            </LiquidPanel>
        </Panel>
    );
};


interface RoadmapViewProps {
    isOpenAI?: boolean;
    onCloseAI?: () => void;
}

const RoadmapView: React.FC<RoadmapViewProps> = ({ isOpenAI = false, onCloseAI = () => {} }) => {
    const { nodes, edges, onNodesChange, onEdgesChange, onConnect, saveRoadmap, isLoading, canStartMaster, totalPassedECTS, setSpecialization } = useRoadmap();
    const [isSaving, setIsSaving] = useState(false);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState<{x: number, y: number} | null>(null);
    const [isSpecMenuOpen, setIsSpecMenuOpen] = useState(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const isPresent = useIsPresent();
    const [shouldRender, setShouldRender] = useState(true);

    useEffect(() => {
        if (!isPresent) {
            const timer = setTimeout(() => setShouldRender(false), 500); // 500ms allows the 400ms exit animation to finish
            return () => clearTimeout(timer);
        } else {
            setShouldRender(true);
        }
    }, [isPresent]);

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

    const currentSpecNode = nodes.find(n => n.data.type === 'specialization');
    const currentSpec = useMemo(() => {
        if (!currentSpecNode) return null;
        return specializations.find(s => s.mandatory.includes(currentSpecNode.id));
    }, [currentSpecNode]);

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

    if (!shouldRender) return null; // Unmount heavy ReactFlow after exit transition to prevent FPS drop

    if (isLoading) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#09090b]">
                <div className="relative">
                    <div className="absolute inset-0 bg-sky-500/20 blur-xl rounded-full" />
                    <Spinner size="xl" variant="sky" className="relative z-10" />
                </div>
                <span className="mt-6 text-sky-400/80 font-mono text-xs tracking-[0.3em] uppercase animate-pulse">Iniciant Sistemes...</span>
            </div>
        );
    }

    // Circular Progress Calculation
    const radius = 22;
    const circumference = 2 * Math.PI * radius;
    const percentage = Math.min(totalPassedECTS / 240, 1);
    const strokeDashoffset = circumference - percentage * circumference;

    return (
        <div className="w-full h-full relative bg-[#09090b] overflow-hidden flex">
            
            {/* Radial Gradient Focus Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.03)_0%,rgba(9,9,11,1)_100%)] pointer-events-none z-0" />

            <div className="flex-1 relative z-10">
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
                    minZoom={0.1}
                    maxZoom={2}
                    defaultEdgeOptions={{
                        type: 'smoothstep',
                        animated: false,
                        style: { stroke: 'rgba(56, 189, 248, 0.4)', strokeWidth: 2 }
                    }}
                >
                    <Background color="#38bdf8" variant={BackgroundVariant.Dots} gap={24} size={2} className="opacity-10" />
                    <CustomControls />
                </ReactFlow>

                {/* ECTS Circular Glass Widget Bottom Right */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="absolute bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none"
                >
                    <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-full py-3 px-5 flex items-center gap-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)] pointer-events-auto">
                        <div className="relative w-[50px] h-[50px] flex items-center justify-center">
                            {/* Background Circle */}
                            <svg className="w-full h-full transform -rotate-90 absolute inset-0">
                                <circle cx="25" cy="25" r={radius} stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-800" />
                                <circle 
                                    cx="25" cy="25" r={radius} stroke="currentColor" strokeWidth="4" fill="transparent" 
                                    strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} 
                                    strokeLinecap="round"
                                    className="text-sky-500 transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]" 
                                />
                            </svg>
                            <span className="text-[10px] font-bold text-sky-400 mt-0.5">{Math.round(percentage * 100)}%</span>
                        </div>
                        <div className="flex flex-col pr-2">
                            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-[0.2em] mb-0.5">Crèdits Aprovats</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black text-white tracking-tight">{totalPassedECTS}</span>
                                <span className="text-sm font-medium text-slate-500">/240</span>
                            </div>
                        </div>
                    </div>

                    <AnimatePresence>
                        {canStartMaster && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className="bg-orange-500/10 backdrop-blur-xl border border-orange-500/30 rounded-2xl p-3 flex items-center gap-3 shadow-[0_0_20px_rgba(249,115,22,0.15)] relative overflow-hidden pointer-events-auto"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/10 to-orange-500/0 animate-[shine_3s_infinite]" />
                                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0 border border-orange-500/30">
                                    <GraduationCap size={16} className="text-orange-400" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-mono text-orange-400/80 uppercase tracking-widest">Master Ready</span>
                                    <span className="text-xs font-bold text-orange-200">Requisits PARS Assolits</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Floating Dock Action Buttons Bottom Center */}
                {/* Floating Dock Action Buttons Bottom Center */}
                <LiquidToolbar delay={0.3}>
                        
                        {/* Tria Especialitat */}
                        <div className="relative">
                            <LiquidToolbarButton 
                                onClick={() => setIsSpecMenuOpen(!isSpecMenuOpen)}
                            >
                                <GraduationCap size={16} />
                                <span className="hidden sm:inline">
                                    {currentSpec ? currentSpec.name : 'Especialitat'}
                                </span>
                                <span className="sm:hidden">
                                    {currentSpec ? currentSpec.name.substring(0, 6) + '.' : 'Espec.'}
                                </span>
                            </LiquidToolbarButton>
                        </div>

                        <SpecializationModal
                            isOpen={isSpecMenuOpen}
                            onClose={() => setIsSpecMenuOpen(false)}
                            currentSpecId={currentSpec?.id || null}
                            onSelect={setSpecialization}
                        />

                        <div className="w-px h-6 bg-white/10 mx-1" />

                        {/* Afegir Optativa */}
                        <LiquidToolbarButton 
                            onClick={() => setIsSearchModalOpen(true)}
                        >
                            <Plus size={16} />
                            <span className="hidden sm:inline">Optativa</span>
                            <span className="sm:hidden">Opt.</span>
                        </LiquidToolbarButton>

                        <div className="w-px h-6 bg-white/10 mx-1" />

                        {/* Guardar */}
                        <LiquidToolbarButton 
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? <Spinner size="sm" variant="white" glow={false} /> : <Save size={16} />}
                            <span className="hidden sm:inline">{isSaving ? 'Guardant...' : 'Guardar'}</span>
                            <span className="sm:hidden">{isSaving ? '...' : 'Desar'}</span>
                        </LiquidToolbarButton>

                </LiquidToolbar>
            </div>

            <SubjectContextMenu 
                isOpen={isMenuOpen} 
                onClose={() => setIsMenuOpen(false)} 
                nodeId={selectedNodeId} 
                nodeData={selectedNodeData}
                position={menuPosition}
                onOpenDetails={() => setIsDetailsOpen(true)}
            />

            <SubjectSearchModal 
                isOpen={isSearchModalOpen} 
                onClose={() => setIsSearchModalOpen(false)} 
            />

            <SubjectDetailsModal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                subjectId={selectedNodeId}
            />

            <RoadmapAIPromptBar 
                isOpen={isOpenAI} 
                onClose={onCloseAI} 
            />
        </div>
    );
};

export default RoadmapView;

