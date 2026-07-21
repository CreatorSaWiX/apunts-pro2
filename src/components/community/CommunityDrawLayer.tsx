import React, { useState, useRef, useEffect } from 'react';
import { useViewport } from '@xyflow/react';
import { useDrawContext, type Stroke } from '../../contexts/DrawContext';
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

// Memoized component to prevent re-rendering all strokes when drawing a new one
const MemoizedCompletedStrokes = React.memo(({ strokes, currentTool, removeStroke, broadcastRemoveStroke }: any) => {
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
    const { isDrawMode, currentTool, currentColor, currentWidth, strokes, setStrokes, removeStroke } = useDrawContext();
    const rafId = useRef<number | null>(null);
    
    const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    const getMouseCoords = (e: React.PointerEvent<SVGSVGElement> | MouseEvent) => {
        if (!svgRef.current) return { x: 0, y: 0 };
        const rect = svgRef.current.getBoundingClientRect();
        const clientX = 'clientX' in e ? e.clientX : 0;
        const clientY = 'clientY' in e ? e.clientY : 0;
        return {
            x: (clientX - rect.left - x) / zoom,
            y: (clientY - rect.top - y) / zoom
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
            document.documentElement.style.setProperty('--mouse-x', `${mouseX}px`);
            document.documentElement.style.setProperty('--mouse-y', `${mouseY}px`);
        });
    };

    // Send cursor position even when not drawing if mouse is over
    useEffect(() => {
        const handleGlobalMove = (e: MouseEvent) => {
            if (isDrawMode && svgRef.current && svgRef.current.contains(e.target as Node)) {
                const coords = getMouseCoords(e);
                updateCursor(coords.x, coords.y);
                updateLocalCursorCSS(e);
            }
        };
        window.addEventListener('mousemove', handleGlobalMove);
        return () => {
            window.removeEventListener('mousemove', handleGlobalMove);
            if (rafId.current) cancelAnimationFrame(rafId.current);
        };
    }, [isDrawMode, x, y, zoom, updateCursor]);

    const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
        if (!isDrawMode) return;
        updateLocalCursorCSS(e);
        
        if (currentTool !== 'pen') return;
        
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        
        const coords = getMouseCoords(e);
        const newStroke = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
            points: [coords],
            color: currentColor,
            width: currentWidth
        };
        setCurrentStroke(newStroke);
        broadcastStroke(newStroke);
        updateCursor(coords.x, coords.y);
    };

    const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
        if (!isDrawMode) return;
        updateLocalCursorCSS(e);
        
        if (currentTool !== 'pen' || !currentStroke) return;
        
        e.preventDefault();
        
        const coords = getMouseCoords(e);
        setCurrentStroke((prev: Stroke | null) => {
            if (!prev) return prev;
            return {
                ...prev,
                points: [...prev.points, coords]
            };
        });
        
        if (currentStroke) {
            broadcastLiveStroke({
                ...currentStroke,
                points: [...currentStroke.points, coords]
            });
        }
        updateCursor(coords.x, coords.y);
    };

    const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
        if (!isDrawMode || currentTool !== 'pen' || !currentStroke) return;
        e.preventDefault();
        e.currentTarget.releasePointerCapture(e.pointerId);
        
        if (currentStroke.points.length > 0) {
            setStrokes((prev: Stroke[]) => [...prev, currentStroke]);
            broadcastStroke(currentStroke);
        }
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
                        className={`absolute rounded-full border-2 backdrop-blur-sm ${currentTool === 'eraser' ? 'border-red-500 bg-red-500/20' : 'border-white/50'}`}
                        style={{
                            width: cursorSize,
                            height: cursorSize,
                            marginLeft: -cursorSize / 2,
                            marginTop: -cursorSize / 2,
                            boxShadow: currentTool === 'pen' ? `0 0 10px ${currentColor}` : 'none',
                            backgroundColor: currentTool === 'pen' ? `${currentColor}88` : undefined,
                            transform: `translate(var(--mouse-x, -100px), var(--mouse-y, -100px))`
                        }}
                    />
                </div>
            )}
        </>
    );
};

export default CommunityDrawLayer;
