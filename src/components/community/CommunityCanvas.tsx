import React, { useState, useEffect, useCallback } from 'react';
import { ReactFlow, Background, BackgroundVariant, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { DrawProvider, useDrawContext, type Stroke } from '../../contexts/DrawContext';
import { useShallow } from 'zustand/react/shallow';
import CommunityDrawLayer from './CommunityDrawLayer';
import { LiquidToolbar, LiquidToolbarButton } from '../ui/glass/LiquidToolbar';
import LiquidPanel from '../ui/glass/LiquidPanel';
import { Undo2, Redo2, Trash2, Pen, Eraser, Hand } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { m as motion, AnimatePresence } from 'framer-motion';
import { useMultiplayerCanvas } from '../../hooks/useMultiplayerCanvas';
import { useCanvasShortcuts } from '../../hooks/useCanvasShortcuts';

import type { Node, Edge } from '@xyflow/react';

/* Constants estàtiques fora del cicle de render */

const EMPTY_NODES: Node[] = [];
const EMPTY_EDGES: Edge[] = [];
const PRO_OPTIONS = { hideAttribution: true };

const DRAW_COLORS = [
    { id: 'red', value: '#ef4444', labelKey: 'canvas.colors.red', defaultLabel: 'Vermell (R / 4 / C)' },
    { id: 'blue', value: '#3b82f6', labelKey: 'canvas.colors.blue', defaultLabel: 'Blau (B / 5 / C)' },
    { id: 'yellow', value: '#eab308', labelKey: 'canvas.colors.yellow', defaultLabel: 'Groc (Y / 6 / C)' },
    { id: 'purple', value: '#a855f7', labelKey: 'canvas.colors.purple', defaultLabel: 'Lila (U / 7 / C)' },
] as const;

const STROKE_SIZES = [2, 4, 8] as const;

const GRID_BACKGROUND_STYLE: React.CSSProperties = {
    backgroundImage: 'linear-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.1) 1px, transparent 1px)',
    backgroundSize: '60px 60px',
    maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)',
    WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)'
};

// A wrapper to use the hooks inside ReactFlowProvider and DrawProvider
const CanvasContent: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { t } = useTranslation();
    const { isDrawMode, currentTool, setCurrentTool, currentColor, setCurrentColor, currentWidth, setCurrentWidth, undoStroke, redoStroke, canUndo, canRedo, clearStrokes, strokes, setStrokes } = useDrawContext(useShallow(state => ({
        isDrawMode: state.isDrawMode,
        currentTool: state.currentTool,
        setCurrentTool: state.setCurrentTool,
        currentColor: state.currentColor,
        setCurrentColor: state.setCurrentColor,
        currentWidth: state.currentWidth,
        setCurrentWidth: state.setCurrentWidth,
        undoStroke: state.undoStroke,
        redoStroke: state.redoStroke,
        canUndo: state.canUndo,
        canRedo: state.canRedo,
        clearStrokes: state.clearStrokes,
        strokes: state.strokes,
        setStrokes: state.setStrokes
    })));
    const { updateCursor, broadcastStroke, broadcastLiveStroke, broadcastClear, broadcastRemoveStroke } = useMultiplayerCanvas(strokes, setStrokes as React.Dispatch<React.SetStateAction<Stroke[]>>, currentColor);
    
    const [isColorMenuOpen, setIsColorMenuOpen] = useState(false);
    const [isSizeMenuOpen, setIsSizeMenuOpen] = useState(false);

    // Gestió resilient del scroll de la pàgina
    useEffect(() => {
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = prevOverflow;
        };
    }, []);

    // Tancar els desplegables automàticament en canviar d'eina
    useEffect(() => {
        if (currentTool !== 'pen') {
            setIsColorMenuOpen(false);
            setIsSizeMenuOpen(false);
        }
    }, [currentTool]);

    // Dreceres de teclat
    useCanvasShortcuts({ onClose, onClearBroadcast: broadcastClear });

    // Handler memoitzat per netejar el llenç
    const handleClearCanvas = useCallback(() => {
        if (window.confirm(t('canvas.confirmClear', 'Vols esborrar tot el llenç?'))) {
            clearStrokes();
            broadcastClear();
        }
    }, [t, clearStrokes, broadcastClear]);

    return (
        <div className="w-full h-full relative bg-[#09090b] overflow-hidden">
            {/* Background grids */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-30" style={GRID_BACKGROUND_STYLE} />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.06)_0%,rgba(9,9,11,0.6)_60%,rgba(9,9,11,1)_100%)] pointer-events-none z-0" />

            <div className="w-full h-full relative z-10">
                <ReactFlow
                    nodes={EMPTY_NODES}
                    edges={EMPTY_EDGES}
                    panOnDrag={!isDrawMode}
                    nodesDraggable={!isDrawMode}
                    zoomOnScroll={!isDrawMode}
                    zoomOnPinch={!isDrawMode}
                    zoomOnDoubleClick={false}
                    elementsSelectable={!isDrawMode}
                    nodesConnectable={!isDrawMode}
                    minZoom={0.1}
                    maxZoom={4}
                    proOptions={PRO_OPTIONS}
                    className="bg-transparent"
                >
                    <Background color="#38bdf8" variant={BackgroundVariant.Dots} gap={24} size={2} className="opacity-10" />
                    <CommunityDrawLayer updateCursor={updateCursor} broadcastStroke={broadcastStroke} broadcastLiveStroke={broadcastLiveStroke} broadcastRemoveStroke={broadcastRemoveStroke} />
                </ReactFlow>
            </div>

            {/* Drawing Toolbar */}
            <LiquidToolbar>
                <LiquidToolbarButton key="pan" onClick={() => setCurrentTool('pan')} active={currentTool === 'pan'} title={t('canvas.tools.pan', 'Moure / Panoràmica (H / 1 / Espai)')}>
                    <Hand size={18} />
                </LiquidToolbarButton>
                <LiquidToolbarButton key="pen" onClick={() => setCurrentTool('pen')} active={currentTool === 'pen'} title={t('canvas.tools.pen', 'Dibuixar (P / 2)')}>
                    <Pen size={18} />
                </LiquidToolbarButton>
                <LiquidToolbarButton key="eraser" onClick={() => setCurrentTool('eraser')} active={currentTool === 'eraser'} title={t('canvas.tools.eraser', 'Esborrar (E / 3)')}>
                    <Eraser size={18} />
                </LiquidToolbarButton>

                {currentTool === 'pen' && (
                    <motion.div
                        key="pen-controls"
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="flex items-center gap-1"
                    >
                        <div className="w-px h-6 bg-white/10 mx-1" />

                        {/* Size controls */}
                        <div key="size-selector" className="relative">
                            <button
                                type="button"
                                onClick={() => setIsSizeMenuOpen(!isSizeMenuOpen)}
                                title={t('canvas.tools.sizeSelect', 'Seleccionar Mida')}
                                className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center transition duration-300 hover:bg-white/10 cursor-pointer"
                            >
                                <div 
                                    className="rounded-full bg-white transition duration-300"
                                    style={{ width: currentWidth + 2, height: currentWidth + 2 }}
                                />
                            </button>

                            <AnimatePresence>
                                {isSizeMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 flex gap-1 p-2 rounded-[2rem] pointer-events-auto"
                                    >
                                        <LiquidPanel className="absolute inset-0 pointer-events-none" variant="darker">{null}</LiquidPanel>
                                        
                                        <div className="relative z-10 flex gap-2 px-2 items-center">
                                            {STROKE_SIZES.map(size => (
                                                <button
                                                    key={size}
                                                    type="button"
                                                    onClick={() => { setCurrentWidth(size); setIsSizeMenuOpen(false); }}
                                                    title={t('canvas.tools.size', 'Mida {{size}}px ([ / ])', { size })}
                                                    className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition duration-300 cursor-pointer ${currentWidth === size ? 'bg-white/20 shadow-inner scale-110' : 'hover:bg-white/10 opacity-70 hover:opacity-100'}`}
                                                    aria-label={t('canvas.tools.size', 'Mida {{size}}px ([ / ])', { size })}>
                                                    <div 
                                                        className="rounded-full bg-white transition duration-300"
                                                        style={{ width: size + 2, height: size + 2 }}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="w-px h-6 bg-white/10 mx-1" />

                        {/* Color controls */}
                        <div key="color-selector" className="relative">
                            <button
                                type="button"
                                onClick={() => setIsColorMenuOpen(!isColorMenuOpen)}
                                title={t('canvas.colors.select', 'Seleccionar Color')}
                                className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center transition duration-300 hover:bg-white/10 cursor-pointer"
                            >
                                <div className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: currentColor, boxShadow: `0 0 12px ${currentColor}80` }} />
                            </button>

                            <AnimatePresence>
                                {isColorMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 flex gap-1 p-2 rounded-[2rem] pointer-events-auto"
                                    >
                                        <LiquidPanel className="absolute inset-0 pointer-events-none" variant="darker">{null}</LiquidPanel>
                                        
                                        <div className="relative z-10 flex gap-1 px-1">
                                            {DRAW_COLORS.map(c => {
                                                const colorLabel = t(c.labelKey, c.defaultLabel);
                                                return (
                                                    <button
                                                        key={c.id}
                                                        type="button"
                                                        onClick={() => { setCurrentColor(c.value); setIsColorMenuOpen(false); }}
                                                        title={colorLabel}
                                                        className={`w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition cursor-pointer ${currentColor === c.value ? 'bg-white/10 scale-110' : ''}`}
                                                        aria-label={colorLabel}
                                                    >
                                                        <div className="w-5 h-5 rounded-full" style={{ backgroundColor: c.value, boxShadow: `0 0 8px ${c.value}80` }} />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="w-px h-6 bg-white/10 mx-1" />
                    </motion.div>
                )}

                <LiquidToolbarButton key="undo" onClick={undoStroke} active={false} className={!canUndo ? 'opacity-30 cursor-not-allowed' : ''} title={t('canvas.actions.undo', 'Desfer (Ctrl+Z)')}>
                    <Undo2 size={18} />
                </LiquidToolbarButton>

                <LiquidToolbarButton key="redo" onClick={redoStroke} active={false} className={!canRedo ? 'opacity-30 cursor-not-allowed' : ''} title={t('canvas.actions.redo', 'Refer (Ctrl+Y / Ctrl+Shift+Z)')}>
                    <Redo2 size={18} />
                </LiquidToolbarButton>

                <LiquidToolbarButton key="clear" onClick={handleClearCanvas} active={false} className="text-red-400 hover:text-red-300 hover:bg-red-500/10" title={t('canvas.actions.clear', 'Netejar tot el llenç (Shift+Supr)')}>
                    <Trash2 size={18} />
                </LiquidToolbarButton>

            </LiquidToolbar>
        </div>
    );
};

interface CommunityCanvasProps {
    onClose: () => void;
}

const CommunityCanvas: React.FC<CommunityCanvasProps> = ({ onClose }) => {
    return (
        <ReactFlowProvider>
            <DrawProvider>
                <div className="w-full h-full absolute inset-0 bg-[#09090b]">
                    <CanvasContent onClose={onClose} />
                </div>
            </DrawProvider>
        </ReactFlowProvider>
    );
};

export default CommunityCanvas;
