import React, { useState, useRef, useEffect } from 'react';
import { useViewport } from '@xyflow/react';
import { useDrawContext, type Stroke } from '../../contexts/DrawContext';
import { useShallow } from 'zustand/react/shallow';
import MultiplayerCursors from './MultiplayerCursors';

// Helper to generate SVG path data from points with Quadratic Bezier Smoothing
const getSvgPathFromPoints = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y} L ${points[0].x} ${points[0].y}`;
    
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        path += ` Q ${points[i].x} ${points[i].y}, ${xc} ${yc}`;
    }
    path += ` L ${points[points.length - 1].x} ${points[points.length - 1].y}`;
    return path;
};

interface CompletedStrokesProps {
    strokes: Stroke[];
    currentTool: string;
    removeStroke: (id: string) => void;
    broadcastRemoveStroke: (id: string) => void;
}

// Memoized component to prevent re-rendering all strokes when drawing a new one
const MemoizedCompletedStrokes = React.memo(({ strokes, currentTool, removeStroke, broadcastRemoveStroke }: CompletedStrokesProps) => {
    return (
        <>
            {strokes.map((stroke: Stroke) => (
                <path
                    key={stroke.id}
                    d={getSvgPathFromPoints(stroke.points)}
                    stroke={stroke.color}
                    strokeWidth={stroke.width}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ filter: `drop-shadow(0px 0px 6px ${stroke.color}66)` }}
                    pointerEvents={currentTool === 'eraser' ? 'stroke' : 'none'}
                    onPointerDown={(e) => {
                        if (currentTool === 'eraser') {
                            e.stopPropagation();
                            removeStroke(stroke.id);
                            broadcastRemoveStroke(stroke.id);
                        }
                    }}
                    onPointerEnter={(e) => {
                        if (currentTool === 'eraser' && e.buttons > 0) {
                            removeStroke(stroke.id);
                            broadcastRemoveStroke(stroke.id);
                        }
                    }}
                />
            ))}
        </>
    );
});

interface CommunityDrawLayerProps {
    updateCursor: (x: number, y: number) => void;
    broadcastStroke: (stroke: Stroke) => void;
    broadcastLiveStroke: (stroke: Stroke) => void;
    broadcastRemoveStroke: (id: string) => void;
}

const CommunityDrawLayer: React.FC<CommunityDrawLayerProps> = ({ updateCursor, broadcastStroke, broadcastLiveStroke, broadcastRemoveStroke }) => {
    const { x, y, zoom } = useViewport();
    const { isDrawMode, currentTool, currentColor, currentWidth, strokes, setStrokes, removeStroke } = useDrawContext(useShallow(state => ({
        isDrawMode: state.isDrawMode,
        currentTool: state.currentTool,
        currentColor: state.currentColor,
        currentWidth: state.currentWidth,
        strokes: state.strokes,
        setStrokes: state.setStrokes,
        removeStroke: state.removeStroke
    })));
    const customCursorRef = useRef<HTMLDivElement>(null);
    const rafId = useRef<number | null>(null);
    
    const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
    const currentStrokeRef = useRef<Stroke | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    const viewportRef = useRef({ x, y, zoom });
    useEffect(() => {
        viewportRef.current = { x, y, zoom };
    });

    const getMouseCoords = (e: React.PointerEvent<SVGSVGElement> | MouseEvent) => {
        if (!svgRef.current) return { x: 0, y: 0 };
        const rect = svgRef.current.getBoundingClientRect();
        const clientX = 'clientX' in e ? e.clientX : 0;
        const clientY = 'clientY' in e ? e.clientY : 0;
        const { x: vx, y: vy, zoom: vz } = viewportRef.current;
        return {
            x: (clientX - rect.left - vx) / vz,
            y: (clientY - rect.top - vy) / vz
        };
    };

    const updateLocalCursorCSS = (e: React.PointerEvent<SVGSVGElement> | MouseEvent) => {
        if (!svgRef.current) return;
        const rect = svgRef.current.getBoundingClientRect();
        const clientX = 'clientX' in e ? e.clientX : 0;
        const clientY = 'clientY' in e ? e.clientY : 0;
        
        if (rafId.current) cancelAnimationFrame(rafId.current);
        rafId.current = requestAnimationFrame(() => {
            const mouseX = clientX - rect.left;
            const mouseY = clientY - rect.top;
            if (customCursorRef.current) {
                customCursorRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
            }
        });
    };

    // Send cursor position even when not drawing if mouse is over
    useEffect(() => {
        if (!isDrawMode) return;
        const handleGlobalMove = (e: MouseEvent) => {
            if (svgRef.current && svgRef.current.contains(e.target as Node)) {
                const coords = getMouseCoords(e);
                updateCursor(coords.x, coords.y);
                updateLocalCursorCSS(e);
            }
        };
        window.addEventListener('mousemove', handleGlobalMove, { passive: true });
        return () => {
            window.removeEventListener('mousemove', handleGlobalMove);
            if (rafId.current) cancelAnimationFrame(rafId.current);
        };
    }, [isDrawMode, updateCursor]);

    const lastPointRef = useRef<{ x: number; y: number } | null>(null);
    const liveBroadcastRaf = useRef<number | null>(null);
    const pendingLiveBroadcast = useRef<Stroke | null>(null);

    const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
        if (!isDrawMode) return;
        updateLocalCursorCSS(e);
        
        if (currentTool !== 'pen') return;
        
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        
        const coords = getMouseCoords(e);
        lastPointRef.current = coords;
        const newStroke: Stroke = {
            id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
            points: [coords],
            color: currentColor,
            width: currentWidth
        };
        // Synchronous ref assignment to eliminate race condition with immediate pointermove
        currentStrokeRef.current = newStroke;
        setCurrentStroke(newStroke);
        broadcastStroke(newStroke);
        updateCursor(coords.x, coords.y);
    };

    const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
        if (!isDrawMode) return;
        updateLocalCursorCSS(e);
        
        const activeStroke = currentStrokeRef.current;
        if (currentTool !== 'pen' || !activeStroke) return;
        
        e.preventDefault();
        
        const coords = getMouseCoords(e);

        // Algorisme de decimació adaptatiu a pantalla: llindar de 2px de pantalla real
        const lastPt = lastPointRef.current;
        if (lastPt) {
            const screenDx = (coords.x - lastPt.x) * zoom;
            const screenDy = (coords.y - lastPt.y) * zoom;
            if (screenDx * screenDx + screenDy * screenDy < 4) {
                updateCursor(coords.x, coords.y);
                return;
            }
        }
        lastPointRef.current = coords;

        // Acumulació síncrona al ref per evitar pèrdua de punts a 60-240Hz per batching de React
        activeStroke.points.push(coords);

        const updatedStroke: Stroke = {
            ...activeStroke,
            points: [...activeStroke.points]
        };

        setCurrentStroke(updatedStroke);
        
        // Throttling adaptatiu per no saturar el canal RTDB de Firebase
        pendingLiveBroadcast.current = updatedStroke;
        if (!liveBroadcastRaf.current) {
            liveBroadcastRaf.current = requestAnimationFrame(() => {
                liveBroadcastRaf.current = null;
                if (pendingLiveBroadcast.current) {
                    broadcastLiveStroke(pendingLiveBroadcast.current);
                }
            });
        }
        updateCursor(coords.x, coords.y);
    };

    const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
        const activeStroke = currentStrokeRef.current;
        if (!isDrawMode || currentTool !== 'pen' || !activeStroke) return;
        e.preventDefault();
        e.currentTarget.releasePointerCapture(e.pointerId);
        
        lastPointRef.current = null;
        if (liveBroadcastRaf.current) {
            cancelAnimationFrame(liveBroadcastRaf.current);
            liveBroadcastRaf.current = null;
        }

        if (activeStroke.points.length > 0) {
            setStrokes((prev: Stroke[]) => [...prev, activeStroke]);
            broadcastStroke(activeStroke);
        }
        currentStrokeRef.current = null;
        setCurrentStroke(null);
    };

    // Calculate cursor size based on zoom and brush width
    const cursorSize = Math.max(12, currentWidth * zoom * 2);

    return (
        <>
            <svg
                ref={svgRef}
                className={`absolute inset-0 w-full h-full z-40 ${isDrawMode ? 'cursor-none touch-none pointer-events-auto' : 'pointer-events-none'}`}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
            >
                <g style={{ transform: `translate(${x}px, ${y}px) scale(${zoom})`, transformOrigin: '0 0' }}>
                    <MemoizedCompletedStrokes 
                        strokes={strokes} 
                        currentTool={currentTool} 
                        removeStroke={removeStroke} 
                        broadcastRemoveStroke={broadcastRemoveStroke} 
                    />
                    
                    {currentStroke && (
                        <path
                            d={getSvgPathFromPoints(currentStroke.points)}
                            stroke={currentStroke.color}
                            strokeWidth={currentStroke.width}
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ filter: `drop-shadow(0px 0px 6px ${currentStroke.color}66)` }}
                        />
                    )}

                    {/* Own cursor is hidden by CSS, but we show other cursors here */}
                    <MultiplayerCursors />
                </g>
            </svg>
            
            {/* Draw own custom cursor when hovering */}
            {isDrawMode && (
                <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
                    <div 
                        ref={customCursorRef}
                        className={`absolute rounded-full border-2 pointer-events-none ${currentTool === 'eraser' ? 'border-red-500 bg-red-500/20' : 'border-white/50'}`}
                        style={{
                            width: cursorSize,
                            height: cursorSize,
                            marginLeft: -cursorSize / 2,
                            marginTop: -cursorSize / 2,
                            boxShadow: currentTool === 'pen' ? `0 0 10px ${currentColor}` : 'none',
                            backgroundColor: currentTool === 'pen' ? `${currentColor}88` : undefined,
                            transform: `translate(-100px, -100px)`,
                            willChange: 'transform'
                        }}
                    />
                </div>
            )}
        </>
    );
};

export default CommunityDrawLayer;
