import React, { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import { ReactFlow, Panel, Background, BackgroundVariant, useReactFlow, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useRoadmap, RoadmapProvider, TargetGradeProvider } from '../../../contexts/RoadmapContext';
import type { SubjectNodeData, DrawingStroke } from '../../../contexts/RoadmapContext';
import type { Node } from '@xyflow/react';

import SubjectNode from './Nodes/SubjectNode';
import SubjectContextMenu from './SubjectContextMenu';
import SubjectSearchModal from './SubjectSearchModal';
import SubjectDetailsModal from './SubjectDetailsModal';
import RoadmapAIPromptBar from './RoadmapAIPromptBar';
import Spinner from '../../ui/Spinner';

import {
    Save,
    Plus,
    GraduationCap,
    Sparkles,
    Award,
    Palette,
    Trash2,
    Undo2,
    Redo2,
    X,
    Type,
    StickyNote,
    MoreHorizontal,
    CalendarDays
} from 'lucide-react';
import { specializations } from '../../../data/curriculum';
import { m as motion, AnimatePresence, useIsPresent } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import CustomControls from './CustomControls';
import RoadmapStatsWidget from './RoadmapStatsWidget';

import { SpecializationModal } from './SpecializationModal';
import ExperienceSelectorModal from './ExperienceSelectorModal';
import ValidationsModal from './ValidationsModal';
import TextNode from './Nodes/TextNode';
import PostItNode from './Nodes/PostItNode';
import DrawLayer from './DrawLayer';
import { DrawProvider, useDrawContext, type Stroke } from '../../../contexts/DrawContext';
import { useShallow } from 'zustand/react/shallow';
import { useCanvasShortcuts } from '../../../hooks/useCanvasShortcuts';
import LiquidPanel from '../../ui/glass/LiquidPanel';
import { LiquidToolbar, LiquidToolbarButton } from '../../ui/glass/LiquidToolbar';
import { FabMenu } from '../../ui/mobile/FabMenu';

const nodeTypes = {
    subjectNode: SubjectNode,
    mobility: SubjectNode,
    internship: SubjectNode,
    tfg: SubjectNode,
    tfm: SubjectNode,
    textNode: TextNode,
    postItNode: PostItNode,
};

const FIT_VIEW_OPTIONS = { padding: 0.2 };
const PRO_OPTIONS = { hideAttribution: true };
const DEFAULT_EDGE_OPTIONS = {
    type: 'smoothstep',
    animated: false,
    style: { stroke: 'rgba(56, 189, 248, 0.4)', strokeWidth: 2 }
};

const DRAW_PALETTE = [
    { color: '#ef4444', labelKey: 'canvas.colors.red', fallback: 'Vermell', bg: 'bg-red-500', shadow: 'rgba(239,68,68,0.5)' },
    { color: '#3b82f6', labelKey: 'canvas.colors.blue', fallback: 'Blau', bg: 'bg-blue-500', shadow: 'rgba(59,130,246,0.5)' },
    { color: '#eab308', labelKey: 'canvas.colors.yellow', fallback: 'Groc', bg: 'bg-yellow-500', shadow: 'rgba(234,179,8,0.5)' },
    { color: '#a855f7', labelKey: 'canvas.colors.purple', fallback: 'Lila', bg: 'bg-purple-500', shadow: 'rgba(168,85,247,0.5)' }
];

// --- Main Inner Component ---

export interface RoadmapViewProps {
    isOpenAI?: boolean;
    onCloseAI?: () => void;
}

const RoadmapViewInner: React.FC<RoadmapViewProps> = ({ isOpenAI = false, onCloseAI = () => { } }) => {
    const { t } = useTranslation();
    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        saveRoadmap,
        isLoading,
        canStartMaster,
        totalPassedECTS,
        totalPlannedECTS,
        setSpecialization,
        averageGrade,
        initialStrokes,
        addAnnotationNode,
        addSubjectNode,
        targetGrade,
        setTargetGrade,
        requiredAverageGrade
    } = useRoadmap(useShallow(state => ({
        nodes: state.nodes,
        edges: state.edges,
        onNodesChange: state.onNodesChange,
        onEdgesChange: state.onEdgesChange,
        onConnect: state.onConnect,
        saveRoadmap: state.saveRoadmap,
        isLoading: state.isLoading,
        canStartMaster: state.canStartMaster,
        totalPassedECTS: state.totalPassedECTS,
        totalPlannedECTS: state.totalPlannedECTS,
        setSpecialization: state.setSpecialization,
        averageGrade: state.averageGrade,
        initialStrokes: state.initialStrokes,
        addAnnotationNode: state.addAnnotationNode,
        addSubjectNode: state.addSubjectNode,
        targetGrade: state.targetGrade,
        setTargetGrade: state.setTargetGrade,
        requiredAverageGrade: state.requiredAverageGrade
    })));

    const {
        isDrawMode,
        setIsDrawMode,
        currentColor,
        setCurrentColor,
        clearStrokes,
        undoStroke,
        redoStroke,
        canUndo,
        canRedo,
        strokes,
        setStrokes
    } = useDrawContext(useShallow(state => ({
        isDrawMode: state.isDrawMode,
        setIsDrawMode: state.setIsDrawMode,
        currentColor: state.currentColor,
        setCurrentColor: state.setCurrentColor,
        clearStrokes: state.clearStrokes,
        undoStroke: state.undoStroke,
        redoStroke: state.redoStroke,
        canUndo: state.canUndo,
        canRedo: state.canRedo,
        strokes: state.strokes,
        setStrokes: state.setStrokes
    })));

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
    const [isColorMenuOpen, setIsColorMenuOpen] = useState(false);
    const isPresent = useIsPresent();
    const [shouldRender, setShouldRender] = useState(true);

    const isExiting = !isPresent;

    useCanvasShortcuts({ enabled: isDrawMode && !isExiting, onClose: () => setIsDrawMode(false) });

    useEffect(() => {
        if (!isPresent) {
            const timer = setTimeout(() => setShouldRender(false), 450);
            return () => clearTimeout(timer);
        } else {
            setShouldRender(true);
        }
    }, [isPresent]);

    useEffect(() => {
        if (initialStrokes && initialStrokes.length > 0) {
            const formattedStrokes: Stroke[] = initialStrokes.map(s => ({
                id: s.id || Math.random().toString(),
                points: s.points.map(p => ({ x: p.x, y: p.y })),
                color: s.color || '#ef4444',
                width: typeof s.width === 'number' ? s.width : (typeof s.size === 'number' ? s.size : 3)
            }));
            setStrokes(formattedStrokes);
        }
    }, [initialStrokes, setStrokes]);

    // Dispatch event to hide main navigation when draw mode is active
    useEffect(() => {
        window.dispatchEvent(new CustomEvent('apunts_canvas_active', { detail: isDrawMode }));
        return () => {
            window.dispatchEvent(new CustomEvent('apunts_canvas_active', { detail: false }));
        };
    }, [isDrawMode]);

    // WeakMap structural sharing: during drag, applyNodeChanges only creates
    // new references for moved nodes (~1 per frame). We cache the typed version
    // keyed by the source node reference, reusing unchanged nodes and reducing
    // object allocations from O(n) to O(changed) per frame.
    const typedNodesCacheRef = useRef(new WeakMap<object, (typeof nodes)[number]>());
    const typedNodes = useMemo(() => {
        const cache = typedNodesCacheRef.current;
        return nodes.map(n => {
            const cached = cache.get(n);
            if (cached) return cached;
            const dataType = (n.data as Record<string, unknown>)?.type as string;
            const resolvedType = dataType === 'text'
                ? 'textNode'
                : dataType === 'postit'
                ? 'postItNode'
                : (dataType === 'mobility' || dataType === 'internship' || dataType === 'tfg' || dataType === 'tfm')
                ? dataType
                : 'subjectNode';
            const typed = { ...n, type: resolvedType };
            cache.set(n, typed);
            return typed;
        });
    }, [nodes]);

    const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
        setSelectedNodeId(node.id);
        const nodeType = (node.data as Record<string, unknown>)?.type;
        if (nodeType === 'text' || nodeType === 'postit') {
            return;
        }
        setMenuPosition({ x: event.clientX, y: event.clientY });
        setIsMenuOpen(true);
    }, []);

    // Only scan nodes when the context menu is actually visible.
    const selectedNodeData = useMemo(() => {
        if (!selectedNodeId || !isMenuOpen) return null;
        const node = nodes.find(n => n.id === selectedNodeId);
        return node ? (node.data as unknown as SubjectNodeData) : null;
    }, [selectedNodeId, nodes, isMenuOpen]);

    const currentSpecNode = useMemo(() => nodes.find(n => (n.data as Record<string, unknown>)?.type === 'specialization'), [nodes]);
    const currentSpec = useMemo(() => {
        if (!currentSpecNode) return null;
        return specializations.find(s => s.mandatory.includes(currentSpecNode.id));
    }, [currentSpecNode]);

    const handleSave = useCallback(async () => {
        setIsSaving(true);
        try {
            const strokesToSave: DrawingStroke[] = strokes.map(s => ({
                id: s.id,
                points: s.points,
                color: s.color,
                size: s.width,
                width: s.width
            }));
            await saveRoadmap(strokesToSave);
        } catch (err) {
            console.error("Failed to save", err);
        } finally {
            setIsSaving(false);
        }
    }, [saveRoadmap, strokes]);

    const handleAddAnnotation = useCallback((type: 'text' | 'postit') => {
        const center = reactFlowInstance.screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
        addAnnotationNode(type, center.x, center.y);
        setIsDrawMode(false);
    }, [reactFlowInstance, addAnnotationNode, setIsDrawMode]);

    const handleAISubjectAdd = useCallback((abbr: string, type?: string) => {
        addSubjectNode(abbr, (type as SubjectNodeData['type']) || 'optional');
    }, [addSubjectNode]);

    const handleCloseContextMenu = useCallback(() => setIsMenuOpen(false), []);
    const handleOpenDetails = useCallback(() => setIsDetailsOpen(true), []);
    const handleCloseDetails = useCallback(() => setIsDetailsOpen(false), []);
    const handleCloseSearch = useCallback(() => setIsSearchModalOpen(false), []);
    const handleCloseExperience = useCallback(() => setIsExperienceModalOpen(false), []);
    const handleCloseValidations = useCallback(() => setIsValidationsModalOpen(false), []);
    const handleCloseSpec = useCallback(() => setIsSpecMenuOpen(false), []);

    if (!shouldRender) return null;

    if (isLoading) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#09090b]">
                <div className="relative">
                    <div className="absolute inset-0 bg-sky-500/20 blur-xl rounded-full" />
                    <Spinner size="xl" variant="sky" className="relative z-10" />
                </div>
                <span className="mt-6 text-sky-400/80 font-mono text-xs tracking-[0.3em] uppercase animate-pulse">
                    {t('roadmapView.startingSystems', 'Iniciant Sistemes...')}
                </span>
            </div>
        );
    }

    return (
        <div className="w-full h-full relative bg-[#09090b] overflow-hidden flex">
            {/* Animated Sci-Fi Grid Overlay */}
            <div
                className="absolute inset-0 pointer-events-none z-0 opacity-30"
                style={{
                    backgroundImage: 'linear-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.1) 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                    maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)',
                    WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)'
                }}
            />

            {/* Radial Gradient Focus Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.06)_0%,rgba(9,9,11,0.6)_60%,rgba(9,9,11,1)_100%)] pointer-events-none z-0" />

            <div className="flex-1 relative z-10">
                <TargetGradeProvider value={requiredAverageGrade}>
                    <ReactFlow
                        nodes={typedNodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onNodeClick={onNodeClick}
                        nodeTypes={nodeTypes}
                        fitView
                        fitViewOptions={FIT_VIEW_OPTIONS}
                        proOptions={PRO_OPTIONS}
                        className="bg-transparent"
                        minZoom={0.1}
                        maxZoom={2}
                        panOnDrag={!isDrawMode && !isExiting}
                        nodesDraggable={!isDrawMode && !isExiting}
                        zoomOnScroll={!isDrawMode && !isExiting}
                        zoomOnPinch={!isDrawMode && !isExiting}
                        zoomOnDoubleClick={false}
                        elementsSelectable={!isDrawMode && !isExiting}
                        nodesConnectable={!isDrawMode && !isExiting}
                        defaultEdgeOptions={DEFAULT_EDGE_OPTIONS}
                    >
                        <Background color="#38bdf8" variant={BackgroundVariant.Dots} gap={24} size={2} className="opacity-10" />
                        <CustomControls />
                        <DrawLayer />
                    </ReactFlow>
                </TargetGradeProvider>

                {!isExiting && (
                    <>
                        <RoadmapStatsWidget
                            averageGrade={averageGrade}
                            targetGrade={targetGrade}
                            requiredAverageGrade={requiredAverageGrade}
                            setTargetGrade={setTargetGrade}
                            totalPassedECTS={totalPassedECTS}
                            totalPlannedECTS={totalPlannedECTS}
                            canStartMaster={canStartMaster}
                            onSave={handleSave}
                        />

                        {/* Floating Dock Action Buttons Bottom Center */}
                        <LiquidToolbar delay={0.3} className={isDrawMode ? "landscape:hidden lg:landscape:flex" : "hidden sm:flex"}>
                            {isDrawMode ? [
                                <motion.div layout key="color-selector" className="relative">
                                    <LiquidToolbarButton
                                        onClick={() => setIsColorMenuOpen(!isColorMenuOpen)}
                                        active={false}
                                        title={t('canvas.colors.select', 'Seleccionar Color')}
                                    >
                                        <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: currentColor, boxShadow: `0 0 12px ${currentColor}80` }} />
                                    </LiquidToolbarButton>

                                    <AnimatePresence>
                                        {isColorMenuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute bottom-full mb-4 left-0 origin-bottom-left flex gap-1 p-2 rounded-[2rem] pointer-events-auto"
                                            >
                                                <LiquidPanel className="absolute inset-0 pointer-events-none" variant="darker">{null}</LiquidPanel>

                                                <div className="relative z-10 flex gap-1 px-1">
                                                    {DRAW_PALETTE.map((p) => (
                                                        <button
                                                            type="button"
                                                            key={p.color}
                                                            onClick={() => { setCurrentColor(p.color); setIsColorMenuOpen(false); }}
                                                            className={`w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition ${currentColor === p.color ? 'bg-white/10 scale-110' : ''}`}
                                                            title={t(p.labelKey, p.fallback)}
                                                            aria-label={t(p.labelKey, p.fallback)}
                                                        >
                                                            <div className={`w-5 h-5 rounded-full ${p.bg}`} style={{ boxShadow: `0 0 8px ${p.shadow}` }} />
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>,

                                <motion.div layout key="sep-1" className="w-px h-6 bg-white/10 mx-1" />,

                                <LiquidToolbarButton key="add-text" onClick={() => handleAddAnnotation('text')} title={t('roadmapView.addText', 'Afegir Text')}>
                                    <Type size={16} />
                                </LiquidToolbarButton>,

                                <LiquidToolbarButton key="add-postit" onClick={() => handleAddAnnotation('postit')} title={t('roadmapView.addPostit', 'Afegir Post-it')}>
                                    <StickyNote size={16} />
                                </LiquidToolbarButton>,

                                <motion.div layout key="sep-2" className="w-px h-6 bg-white/10 mx-1" />,

                                <LiquidToolbarButton
                                    key="undo"
                                    onClick={undoStroke}
                                    title={t('canvas.actions.undo', 'Desfer (Ctrl+Z)')}
                                    disabled={!canUndo}
                                    className={!canUndo ? 'opacity-50 cursor-not-allowed' : ''}
                                >
                                    <Undo2 size={16} />
                                </LiquidToolbarButton>,

                                <LiquidToolbarButton
                                    key="redo"
                                    onClick={redoStroke}
                                    title={t('canvas.actions.redo', 'Refer (Ctrl+Y / Ctrl+Shift+Z)')}
                                    disabled={!canRedo}
                                    className={!canRedo ? 'opacity-50 cursor-not-allowed' : ''}
                                >
                                    <Redo2 size={16} />
                                </LiquidToolbarButton>,

                                <LiquidToolbarButton
                                    key="clear"
                                    onClick={() => { if (window.confirm(t('canvas.confirmClear', 'Vols esborrar tot el llenç?'))) clearStrokes(); }}
                                    title={t('canvas.actions.clear', 'Netejar tot el llenç (Shift+Supr)')}
                                    className="hover:text-rose-400"
                                >
                                    <Trash2 size={16} />
                                </LiquidToolbarButton>,

                                <motion.div layout key="sep-3" className="w-px h-6 bg-white/10 mx-1" />,

                                <LiquidToolbarButton key="exit-draw" onClick={() => setIsDrawMode(false)} className="text-white hover:text-slate-300">
                                    <X size={16} />
                                    <span className="hidden sm:inline font-bold">{t('roadmapView.exit', 'Sortir')}</span>
                                </LiquidToolbarButton>
                            ] : [
                                <motion.div layout key="spec-selector" className="relative">
                                    <LiquidToolbarButton
                                        onClick={() => setIsSpecMenuOpen(!isSpecMenuOpen)}
                                    >
                                        <GraduationCap size={16} />
                                        <span className="hidden sm:inline">
                                            {currentSpec ? currentSpec.name : t('roadmapView.specialization', 'Especialitat')}
                                        </span>
                                        <span className="sm:hidden">
                                            {currentSpec ? currentSpec.name.substring(0, 6) + '.' : t('roadmapView.specializationShort', 'Espec.')}
                                        </span>
                                    </LiquidToolbarButton>
                                </motion.div>,

                                <motion.div layout key="sep-4" className="w-px h-6 bg-white/10 mx-1" />,

                                <LiquidToolbarButton
                                    key="add-optativa"
                                    onClick={() => setIsSearchModalOpen(true)}
                                >
                                    <Plus size={16} />
                                    <span className="hidden sm:inline">{t('roadmapView.elective', 'Optativa')}</span>
                                    <span className="sm:hidden">{t('roadmapView.electiveShort', 'Opt.')}</span>
                                </LiquidToolbarButton>,

                                <motion.div layout key="sep-5" className="w-px h-6 bg-white/10 mx-1" />,

                                <LiquidToolbarButton
                                    key="draw-mode"
                                    onClick={() => setIsDrawMode(true)}
                                >
                                    <Palette size={16} />
                                    <span className="hidden sm:inline font-medium">{t('roadmapView.draw', 'Dibuixar')}</span>
                                    <span className="sm:hidden font-medium">{t('roadmapView.drawShort', 'Dib.')}</span>
                                </LiquidToolbarButton>,

                                <motion.div layout key="sep-6" className="w-px h-6 bg-white/10 mx-1" />,

                                <motion.div layout key="more-actions" className="relative">
                                    <LiquidToolbarButton
                                        onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                                        active={isMoreMenuOpen}
                                    >
                                        <MoreHorizontal size={16} />
                                        <span className="hidden sm:inline font-medium">{t('roadmapView.more', 'Més')}</span>
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

                                                <button
                                                    type="button"
                                                    onClick={() => { setIsExperienceModalOpen(true); setIsMoreMenuOpen(false); }}
                                                    className="relative z-10 flex items-center gap-3 w-full p-2.5 rounded-2xl hover:bg-white/10 text-white transition-colors text-sm font-medium"
                                                >
                                                    <Sparkles size={16} className="text-white" />
                                                    {t('roadmapView.addExperience', 'Afegir Experiència')}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => { setIsValidationsModalOpen(true); setIsMoreMenuOpen(false); }}
                                                    className="relative z-10 flex items-center gap-3 w-full p-2.5 rounded-2xl hover:bg-white/10 text-white transition-colors text-sm font-medium"
                                                >
                                                    <Award size={16} className="text-white" />
                                                    {t('roadmapView.validations', 'Convalidacions')}
                                                </button>

                                                <a
                                                    href="https://www.fib.upc.edu/ca/graus/grau-en-enginyeria-informatica/horaris"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={() => setIsMoreMenuOpen(false)}
                                                    className="relative z-10 flex items-center gap-3 w-full p-2.5 rounded-2xl hover:bg-white/10 text-white transition-colors text-sm font-medium"
                                                >
                                                    <CalendarDays size={16} className="text-white" />
                                                    {t('roadmapView.schedulePlanner', 'Planificador horaris')}
                                                </a>

                                                <div className="h-px bg-white/10 my-1 relative z-10" />

                                                <button
                                                    type="button"
                                                    onClick={() => { handleSave(); setIsMoreMenuOpen(false); }}
                                                    disabled={isSaving}
                                                    className="relative z-10 flex items-center gap-3 w-full p-2.5 rounded-2xl hover:bg-white/10 text-white transition-colors text-sm font-medium"
                                                >
                                                    {isSaving ? <Spinner size="sm" variant="white" glow={false} /> : <Save size={16} className="text-white" />}
                                                    {isSaving ? t('roadmapView.saving', 'Guardant...') : t('roadmapView.saveRoadmap', 'Guardar Roadmap')}
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ]}
                        </LiquidToolbar>

                        {/* FAB Menu for Mobile (Main Menu only) */}
                        {!isDrawMode && (
                            <FabMenu
                                className="bottom-24 right-6"
                                mainIcon={<Plus size={24} />}
                                actions={[
                                    { id: 'spec', label: currentSpec ? currentSpec.name : t('roadmapView.specialization', 'Especialitat'), icon: <GraduationCap size={20} />, onClick: () => setIsSpecMenuOpen(true) },
                                    { id: 'elective', label: t('roadmapView.elective', 'Optativa'), icon: <Plus size={20} />, onClick: () => setIsSearchModalOpen(true) },
                                    { id: 'experience', label: t('roadmapView.addExperience', 'Afegir Experiència'), icon: <Sparkles size={20} />, onClick: () => setIsExperienceModalOpen(true) },
                                    { id: 'validations', label: t('roadmapView.validations', 'Convalidacions'), icon: <Award size={20} />, onClick: () => setIsValidationsModalOpen(true) },
                                    { id: 'schedule', label: t('roadmapView.schedulePlanner', 'Planificador horaris'), icon: <CalendarDays size={20} />, onClick: () => window.open('https://www.fib.upc.edu/ca/graus/grau-en-enginyeria-informatica/horaris', '_blank') },
                                    { id: 'save', label: t('roadmapView.saveRoadmap', 'Guardar'), icon: <Save size={20} />, onClick: handleSave },
                                    { id: 'draw', label: t('roadmapView.draw', 'Dibuixar'), icon: <Palette size={20} />, onClick: () => setIsDrawMode(true) }
                                ]}
                            />
                        )}
                    </>
                )}
            </div>

            <SubjectContextMenu
                isOpen={isMenuOpen}
                onClose={handleCloseContextMenu}
                nodeId={selectedNodeId}
                nodeData={selectedNodeData}
                position={menuPosition}
                onOpenDetails={handleOpenDetails}
            />

            {/* True lazy-mount: components only instantiate when opened, eliminating
                idle zustand subscriptions, cascading useMemo chains, and background DOM. */}
            {isSearchModalOpen && (
                <SubjectSearchModal
                    isOpen={isSearchModalOpen}
                    onClose={handleCloseSearch}
                />
            )}

            {isDetailsOpen && (
                <SubjectDetailsModal
                    isOpen={isDetailsOpen}
                    onClose={handleCloseDetails}
                    subjectId={selectedNodeId}
                />
            )}

            {isExperienceModalOpen && (
                <ExperienceSelectorModal
                    isOpen={isExperienceModalOpen}
                    onClose={handleCloseExperience}
                />
            )}

            {isValidationsModalOpen && (
                <ValidationsModal
                    isOpen={isValidationsModalOpen}
                    onClose={handleCloseValidations}
                />
            )}

            {isSpecMenuOpen && (
                <SpecializationModal
                    isOpen={isSpecMenuOpen}
                    onClose={handleCloseSpec}
                    currentSpecId={currentSpec?.id || null}
                    onSelect={setSpecialization}
                />
            )}

            {isOpenAI && (
                <RoadmapAIPromptBar
                    isOpen={isOpenAI}
                    onClose={onCloseAI}
                    nodes={nodes}
                    addSubjectNode={handleAISubjectAdd}
                />
            )}
        </div>
    );
};

export const RoadmapView: React.FC<RoadmapViewProps> = (props) => (
    <RoadmapProvider>
        <ReactFlowProvider>
            <DrawProvider>
                <RoadmapViewInner {...props} />
            </DrawProvider>
        </ReactFlowProvider>
    </RoadmapProvider>
);

export default RoadmapView;

