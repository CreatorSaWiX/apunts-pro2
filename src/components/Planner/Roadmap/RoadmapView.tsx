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
import { Save, Plus, GraduationCap, ZoomIn, ZoomOut, Maximize, Sparkles, Award, Palette, Trash2, Undo2, Redo2, X, Type, StickyNote, MoreHorizontal, CalendarDays, BookOpen } from 'lucide-react';
import { specializations } from '../../../data/curriculum';
import { motion, AnimatePresence, useIsPresent } from 'framer-motion';
import { SpecializationModal } from './SpecializationModal';
import ExperienceSelectorModal from './ExperienceSelectorModal';
import ValidationsModal from './ValidationsModal';
import TextNode from './Nodes/TextNode';
import PostItNode from './Nodes/PostItNode';
import DrawLayer from './DrawLayer';
import { DrawProvider, useDrawContext } from '../../../contexts/DrawContext';
import LiquidPanel from '../../ui/glass/LiquidPanel';
import { LiquidToolbar, LiquidToolbarButton } from '../../ui/glass/LiquidToolbar';

const nodeTypes = {
    subjectNode: SubjectNode,
    mobility: SubjectNode,
    internship: SubjectNode,
    tfg: SubjectNode,
    tfm: SubjectNode,
    textNode: TextNode,
    postItNode: PostItNode,
};

// Custom Zoom Controls Component
const CustomControls = () => {
    const { zoomIn, zoomOut, fitView } = useReactFlow();
    return (
        <Panel position="bottom-left" className="m-6 z-40 opacity-30 hover:opacity-100 transition-opacity duration-300">
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

const RoadmapViewInner: React.FC<RoadmapViewProps> = ({ isOpenAI = false, onCloseAI = () => { } }) => {
    const { nodes, edges, onNodesChange, onEdgesChange, onConnect, saveRoadmap, isLoading, canStartMaster, totalPassedECTS, setSpecialization, averageGrade, initialStrokes, addAnnotationNode } = useRoadmap();
    const { isDrawMode, setIsDrawMode, currentColor, setCurrentColor, clearStrokes, undoStroke, redoStroke, canUndo, canRedo, strokes, setStrokes } = useDrawContext();
    const reactFlowInstance = useReactFlow();
    const [isSaving, setIsSaving] = useState(false);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState<{ x: number, y: number } | null>(null);
    const [isSpecMenuOpen, setIsSpecMenuOpen] = useState(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
    const [isValidationsModalOpen, setIsValidationsModalOpen] = useState(false);
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
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

    useEffect(() => {
        if (initialStrokes && initialStrokes.length > 0) {
            setStrokes(initialStrokes);
        }
    }, [initialStrokes, setStrokes]);

    // Set the node type for all nodes
    const typedNodes = useMemo(() => {
        return nodes.map(n => {
            // Keep specialized types if they match our custom nodes
            if (['mobility', 'internship', 'tfg', 'tfm'].includes(n.data.type as string)) {
                return { ...n, type: n.data.type };
            }
            if (n.data.type === 'text') {
                return { ...n, type: 'textNode' };
            }
            if (n.data.type === 'postit') {
                return { ...n, type: 'postItNode' };
            }
            return { ...n, type: 'subjectNode' };
        });
    }, [nodes]);

    const onNodeClick = useCallback((event: React.MouseEvent, node: any) => {
        setSelectedNodeId(node.id);
        if (node.data?.type === 'text' || node.data?.type === 'postit') {
            return;
        }
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
            await saveRoadmap(strokes);
        } catch (err) {
            console.error("Failed to save", err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddAnnotation = (type: 'text' | 'postit') => {
        const center = reactFlowInstance.screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
        addAnnotationNode(type, center.x, center.y);
        setIsDrawMode(false);
    };

    // Planned ECTS calculation moved here to respect Rules of Hooks
    const totalPlannedECTS = useMemo(() => nodes.reduce((sum, n) => sum + (n.data.credits || 0), 0), [nodes]);

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

    // ECTS calculation
    const percentage = Math.min(totalPassedECTS / 240, 1);
    const strokeDashoffset = circumference - percentage * circumference;

    // Planned ECTS calculation variables
    const plannedPercentage = Math.min(totalPlannedECTS / 240, 1);
    const plannedStrokeDashoffset = circumference - plannedPercentage * circumference;

    return (
        <div className="w-full h-full relative bg-[#09090b] overflow-hidden flex">

            {/* Animated Sci-Fi Grid Overlay */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.1) 1px, transparent 1px)', backgroundSize: '60px 60px', maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)' }} />

            {/* Radial Gradient Focus Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.06)_0%,rgba(9,9,11,0.6)_60%,rgba(9,9,11,1)_100%)] pointer-events-none z-0" />

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
                    panOnDrag={!isDrawMode}
                    nodesDraggable={!isDrawMode}
                    zoomOnScroll={!isDrawMode}
                    zoomOnPinch={!isDrawMode}
                    zoomOnDoubleClick={false}
                    elementsSelectable={!isDrawMode}
                    nodesConnectable={!isDrawMode}
                    defaultEdgeOptions={{
                        type: 'smoothstep',
                        animated: false,
                        style: { stroke: 'rgba(56, 189, 248, 0.4)', strokeWidth: 2 }
                    }}
                >
                    <Background color="#38bdf8" variant={BackgroundVariant.Dots} gap={24} size={2} className="opacity-10" />
                    <CustomControls />
                    <DrawLayer />
                </ReactFlow>

                {/* ECTS Circular Glass Widget Bottom Right (Spatial UI) */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="absolute bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none"
                >
                    <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-3 flex flex-col gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)] pointer-events-auto">

                        {/* Nota Mitjana Widget */}
                        <div className="flex items-center gap-4 px-2 py-1">
                            <div className="relative w-[50px] h-[50px] flex items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500/20 to-purple-500/20 border border-fuchsia-500/30 shadow-[inset_0_0_20px_rgba(217,70,239,0.3),0_0_15px_rgba(217,70,239,0.2)]">
                                <span className="text-[15px] font-black text-white drop-shadow-[0_0_8px_rgba(217,70,239,0.8)] tracking-tight">
                                    {averageGrade !== null ? averageGrade.toFixed(2) : '-.--'}
                                </span>
                            </div>
                            <div className="flex flex-col pr-6">
                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-0.5">Mitjana Ponderada</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-black text-white tracking-tight">{averageGrade !== null ? averageGrade.toFixed(2) : '-.--'}</span>
                                    <span className="text-xs font-medium text-slate-500">/10</span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full h-px bg-white/5 rounded-full" />

                        {/* ECTS Widget */}
                        <div className="flex items-center gap-4 px-2 py-1">
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
                            <div className="flex flex-col pr-6">
                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-0.5">Crèdits Aprovats</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-black text-white tracking-tight">{totalPassedECTS}</span>
                                    <span className="text-xs font-medium text-slate-500">/240</span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full h-px bg-white/5 rounded-full" />

                        {/* Planned ECTS Widget */}
                        <div className="flex items-center gap-4 px-2 py-1">
                            <div className="relative w-[50px] h-[50px] flex items-center justify-center">
                                {/* Background Circle */}
                                <svg className="w-full h-full transform -rotate-90 absolute inset-0">
                                    <circle cx="25" cy="25" r={radius} stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-800" />
                                    <circle
                                        cx="25" cy="25" r={radius} stroke="currentColor" strokeWidth="4" fill="transparent"
                                        strokeDasharray={circumference} strokeDashoffset={plannedStrokeDashoffset}
                                        strokeLinecap="round"
                                        className="text-violet-500 transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]"
                                    />
                                </svg>
                                <span className="text-[10px] font-bold text-violet-400 mt-0.5">{Math.round(plannedPercentage * 100)}%</span>
                            </div>
                            <div className="flex flex-col pr-6">
                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-0.5">Crèdits Planificats</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-black text-white tracking-tight">{totalPlannedECTS}</span>
                                    <span className="text-xs font-medium text-slate-500">/240</span>
                                </div>
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
                    {isDrawMode ? [
                        <LiquidToolbarButton key="color-red" onClick={() => setCurrentColor('#ef4444')} className={currentColor === '#ef4444' ? 'text-red-500' : 'text-slate-400 hover:text-red-400'} title="Vermell">
                            <div className="w-4 h-4 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                        </LiquidToolbarButton>,

                        <LiquidToolbarButton key="color-blue" onClick={() => setCurrentColor('#3b82f6')} className={currentColor === '#3b82f6' ? 'text-blue-500' : 'text-slate-400 hover:text-blue-400'} title="Blau">
                            <div className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                        </LiquidToolbarButton>,

                        <LiquidToolbarButton key="color-yellow" onClick={() => setCurrentColor('#eab308')} className={currentColor === '#eab308' ? 'text-yellow-500' : 'text-slate-400 hover:text-yellow-400'} title="Groc">
                            <div className="w-4 h-4 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                        </LiquidToolbarButton>,

                        <LiquidToolbarButton key="color-purple" onClick={() => setCurrentColor('#a855f7')} className={currentColor === '#a855f7' ? 'text-purple-500' : 'text-slate-400 hover:text-purple-400'} title="Lila">
                            <div className="w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                        </LiquidToolbarButton>,

                        <div key="sep-1" className="w-px h-6 bg-white/10 mx-1" />,

                        <LiquidToolbarButton key="add-text" onClick={() => handleAddAnnotation('text')} title="Afegir Text">
                            <Type size={16} />
                        </LiquidToolbarButton>,

                        <LiquidToolbarButton key="add-postit" onClick={() => handleAddAnnotation('postit')} title="Afegir Post-it">
                            <StickyNote size={16} />
                        </LiquidToolbarButton>,

                        <div key="sep-2" className="w-px h-6 bg-white/10 mx-1" />,

                        <LiquidToolbarButton key="undo"
                            onClick={undoStroke}
                            title="Desfer"
                            disabled={!canUndo}
                            className={!canUndo ? 'opacity-50 cursor-not-allowed' : ''}
                        >
                            <Undo2 size={16} />
                        </LiquidToolbarButton>,

                        <LiquidToolbarButton key="redo"
                            onClick={redoStroke}
                            title="Refer"
                            disabled={!canRedo}
                            className={!canRedo ? 'opacity-50 cursor-not-allowed' : ''}
                        >
                            <Redo2 size={16} />
                        </LiquidToolbarButton>,

                        <LiquidToolbarButton key="clear" onClick={clearStrokes} title="Netejar tot" className="hover:text-rose-400">
                            <Trash2 size={16} />
                        </LiquidToolbarButton>,

                        <div key="sep-3" className="w-px h-6 bg-white/10 mx-1" />,

                        <LiquidToolbarButton key="exit-draw" onClick={() => setIsDrawMode(false)} className="text-white hover:text-slate-300">
                            <X size={16} />
                            <span className="hidden sm:inline font-bold">Sortir</span>
                        </LiquidToolbarButton>
                    ] : [
                        /* Tria Especialitat */
                        <div key="spec-selector" className="relative">
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
                        </div>,

                        <SpecializationModal
                            key="spec-modal"
                            isOpen={isSpecMenuOpen}
                            onClose={() => setIsSpecMenuOpen(false)}
                            currentSpecId={currentSpec?.id || null}
                            onSelect={setSpecialization}
                        />,

                        <div key="sep-4" className="w-px h-6 bg-white/10 mx-1" />,

                        /* Afegir Optativa */
                        <LiquidToolbarButton key="add-optativa"
                            onClick={() => setIsSearchModalOpen(true)}
                        >
                            <Plus size={16} />
                            <span className="hidden sm:inline">Optativa</span>
                            <span className="sm:hidden">Opt.</span>
                        </LiquidToolbarButton>,

                        <div key="sep-5" className="w-px h-6 bg-white/10 mx-1" />,

                        /* Dibuixar */
                        <LiquidToolbarButton key="draw-mode"
                            onClick={() => setIsDrawMode(true)}
                        >
                            <Palette size={16} />
                            <span className="hidden sm:inline font-medium">Dibuixar</span>
                            <span className="sm:hidden font-medium">Dib.</span>
                        </LiquidToolbarButton>,

                        <div key="sep-6" className="w-px h-6 bg-white/10 mx-1" />,

                        /* Més Accions */
                        <div key="more-actions" className="relative">
                            <LiquidToolbarButton
                                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                                active={isMoreMenuOpen}
                            >
                                <MoreHorizontal size={16} />
                                <span className="hidden sm:inline font-medium">Més</span>
                            </LiquidToolbarButton>

                            <AnimatePresence>
                                {isMoreMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 flex flex-col gap-1 p-2 min-w-[200px] pointer-events-auto"
                                    >
                                        <LiquidPanel className="absolute inset-0 pointer-events-none" variant="darker">{null}</LiquidPanel>

                                        <button onClick={() => { setIsExperienceModalOpen(true); setIsMoreMenuOpen(false); }} className="relative z-10 flex items-center gap-3 w-full p-2.5 rounded-2xl hover:bg-white/10 text-white transition-colors text-sm font-medium">
                                            <Sparkles size={16} className="text-white" />
                                            Afegir Experiència
                                        </button>

                                        <button onClick={() => { setIsValidationsModalOpen(true); setIsMoreMenuOpen(false); }} className="relative z-10 flex items-center gap-3 w-full p-2.5 rounded-2xl hover:bg-white/10 text-white transition-colors text-sm font-medium">
                                            <Award size={16} className="text-white" />
                                            Convalidacions
                                        </button>

                                        {/* <div className="h-px bg-white/10 my-1 relative z-10" /> */}

                                        <a href="https://www.fib.upc.edu/ca/graus/grau-en-enginyeria-informatica/horaris" target="_blank" rel="noopener noreferrer" onClick={() => setIsMoreMenuOpen(false)} className="relative z-10 flex items-center gap-3 w-full p-2.5 rounded-2xl hover:bg-white/10 text-white transition-colors text-sm font-medium">
                                            <CalendarDays size={16} className="text-white" />
                                            Planificador horaris
                                        </a>
                                        {/*                                         
                                        <a href="https://www.fib.upc.edu/ca/graus/grau-en-enginyeria-informatica/pla-destudis" target="_blank" rel="noopener noreferrer" onClick={() => setIsMoreMenuOpen(false)} className="relative z-10 flex items-center gap-3 w-full p-2.5 rounded-2xl hover:bg-white/10 text-white transition-colors text-sm font-medium">
                                            <BookOpen size={16} className="text-white" />
                                            Pla d'estudis
                                        </a>

                                        <a href="https://www.fib.upc.edu/ca/graus/grau-en-enginyeria-informatica/treball-de-fi-de-grau" target="_blank" rel="noopener noreferrer" onClick={() => setIsMoreMenuOpen(false)} className="relative z-10 flex items-center gap-3 w-full p-2.5 rounded-2xl hover:bg-white/10 text-white transition-colors text-sm font-medium">
                                            <GraduationCap size={16} className="text-white" />
                                            TFG
                                        </a> */}

                                        <div className="h-px bg-white/10 my-1 relative z-10" />

                                        <button onClick={() => { handleSave(); setIsMoreMenuOpen(false); }} disabled={isSaving} className="relative z-10 flex items-center gap-3 w-full p-2.5 rounded-2xl hover:bg-white/10 text-white transition-colors text-sm font-medium">
                                            {isSaving ? <Spinner size="sm" variant="white" glow={false} /> : <Save size={16} className="text-white" />}
                                            {isSaving ? 'Guardant...' : 'Guardar Roadmap'}
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ]}
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

            <ExperienceSelectorModal
                isOpen={isExperienceModalOpen}
                onClose={() => setIsExperienceModalOpen(false)}
            />

            <ValidationsModal
                isOpen={isValidationsModalOpen}
                onClose={() => setIsValidationsModalOpen(false)}
            />

            <RoadmapAIPromptBar
                isOpen={isOpenAI}
                onClose={onCloseAI}
            />
        </div>
    );
};

const RoadmapView: React.FC<RoadmapViewProps> = (props) => (
    <DrawProvider>
        <RoadmapViewInner {...props} />
    </DrawProvider>
);

export default RoadmapView;
