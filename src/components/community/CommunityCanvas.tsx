import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ReactFlow, Background, BackgroundVariant, useReactFlow, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { DrawProvider, useDrawContext } from '../../contexts/DrawContext';
import CommunityDrawLayer from './CommunityDrawLayer';
import { LiquidToolbar, LiquidToolbarButton } from '../ui/glass/LiquidToolbar';
import { Palette, X, Undo2, Redo2, Trash2, Pen, Eraser, Hand } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { m as motion } from 'framer-motion';
import { useMultiplayerCanvas } from '../../hooks/useMultiplayerCanvas';

// A wrapper to use the hooks inside ReactFlowProvider and DrawProvider
const CanvasContent: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { t } = useTranslation();
    const { isDrawMode, currentTool, setCurrentTool, currentColor, setCurrentColor, currentWidth, setCurrentWidth, undoStroke, redoStroke, canUndo, canRedo, clearStrokes, strokes, setStrokes } = useDrawContext();
    const { updateCursor, broadcastStroke, broadcastLiveStroke, broadcastClear, broadcastRemoveStroke } = useMultiplayerCanvas(strokes, setStrokes, currentColor);
    
    // Enable draw mode by default when opening canvas, and manage body overflow
    useEffect(() => {
        setCurrentTool('pen');
        
        // Hide scrollbar on the page
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [setCurrentTool]);

    const drawColors = [
        { id: 'red', value: '#ef4444' },
        { id: 'blue', value: '#3b82f6' },
        { id: 'yellow', value: '#eab308' },
        { id: 'purple', value: '#a855f7' },
    ];

    return (
        <div className="w-full h-full relative bg-[#09090b] overflow-hidden">
            {/* Background grids */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.1) 1px, transparent 1px)', backgroundSize: '60px 60px', maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)' }} />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.06)_0%,rgba(9,9,11,0.6)_60%,rgba(9,9,11,1)_100%)] pointer-events-none z-0" />

            <div className="w-full h-full relative z-10">
                <ReactFlow
                    nodes={[]}
                    edges={[]}
                    panOnDrag={!isDrawMode}
                    nodesDraggable={!isDrawMode}
                    zoomOnScroll={!isDrawMode}
                    zoomOnPinch={!isDrawMode}
                    zoomOnDoubleClick={false}
                    elementsSelectable={!isDrawMode}
                    nodesConnectable={!isDrawMode}
                    minZoom={0.1}
                    maxZoom={4}
                    proOptions={{ hideAttribution: true }}
                    className="bg-transparent"
                >
                    <Background color="#38bdf8" variant={BackgroundVariant.Dots} gap={24} size={2} className="opacity-10" />
                    <CommunityDrawLayer updateCursor={updateCursor} broadcastStroke={broadcastStroke} broadcastLiveStroke={broadcastLiveStroke} broadcastRemoveStroke={broadcastRemoveStroke} />
                </ReactFlow>
            </div>

            {/* Drawing Toolbar */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
                <LiquidToolbar>
                    <LiquidToolbarButton onClick={() => setCurrentTool('pan')} active={currentTool === 'pan'}>
                        <Hand size={18} />
                    </LiquidToolbarButton>
                    <LiquidToolbarButton onClick={() => setCurrentTool('pen')} active={currentTool === 'pen'}>
                        <Pen size={18} />
                    </LiquidToolbarButton>
                    <LiquidToolbarButton onClick={() => setCurrentTool('eraser')} active={currentTool === 'eraser'}>
                        <Eraser size={18} />
                    </LiquidToolbarButton>

                    <div className="w-px h-6 bg-white/10 mx-1" />

                    {/* Size controls */}
                    {[2, 4, 8].map(size => (
                        <button
                            key={size}
                            type="button"
                            onClick={() => setCurrentWidth(size)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${currentWidth === size ? 'bg-white/20 shadow-inner' : 'hover:bg-white/10 opacity-70 hover:opacity-100'}`}
                        >
                            <div 
                                className="rounded-full bg-white transition-all duration-300"
                                style={{ width: size + 2, height: size + 2 }}
                            />
                        </button>
                    ))}

                    <div className="w-px h-6 bg-white/10 mx-1" />

                    {/* Color controls */}
                    {drawColors.map(c => (
                        <button
                            key={c.id}
                            type="button"
                            onClick={() => setCurrentColor(c.value)}
                            className={`w-8 h-8 rounded-full transition-all duration-300 relative ${currentColor === c.value ? 'scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)] z-10' : 'scale-90 hover:scale-100 opacity-70 hover:opacity-100'}`}
                            style={{ backgroundColor: c.value, boxShadow: currentColor === c.value ? `0 0 20px ${c.value}66` : 'none' }}
                        />
                    ))}

                    <div className="w-px h-6 bg-white/10 mx-1" />

                    <LiquidToolbarButton onClick={undoStroke} active={false} className={!canUndo ? 'opacity-30 cursor-not-allowed' : ''}>
                        <Undo2 size={18} />
                    </LiquidToolbarButton>

                    <LiquidToolbarButton onClick={redoStroke} active={false} className={!canRedo ? 'opacity-30 cursor-not-allowed' : ''}>
                        <Redo2 size={18} />
                    </LiquidToolbarButton>

                    <LiquidToolbarButton onClick={() => { if(window.confirm('Vols esborrar tot el llenç?')) { clearStrokes(); broadcastClear(); } }} active={false} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                        <Trash2 size={18} />
                    </LiquidToolbarButton>

                </LiquidToolbar>
            </div>
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
                <CanvasContent onClose={onClose} />
            </DrawProvider>
        </ReactFlowProvider>
    );
};

export default CommunityCanvas;
