import React, { useRef, useCallback } from 'react';
import { useViewport } from '@xyflow/react';
import { useDrawContext, type Stroke } from '../../../contexts/DrawContext';

// O(N) path generation using Array.join instead of O(N²) string concatenation
const getSvgPathFromPoints = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y} L ${points[0].x} ${points[0].y}`;
    
    const parts = new Array(points.length);
    parts[0] = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
        parts[i] = `L ${points[i].x} ${points[i].y}`;
    }
    return parts.join(' ');
};

// SVG filter definition — shared by all strokes instead of per-stroke CSS drop-shadow
const StrokeGlowFilter = React.memo(() => (
    <defs>
        <filter id="stroke-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.4 0" result="glow" />
            <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>
    </defs>
));

const MemoizedCompletedStrokes = React.memo(({ strokes, currentTool, removeStroke }: { strokes: Stroke[]; currentTool: string; removeStroke: (id: string) => void }) => {
    return (
        <>
            {strokes.map(stroke => (
                <path
                    key={stroke.id}
                    d={getSvgPathFromPoints(stroke.points)}
                    stroke={stroke.color}
                    strokeWidth={stroke.width}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#stroke-glow)"
                    pointerEvents={currentTool === 'eraser' ? 'stroke' : 'none'}
                    onPointerDown={(e) => {
                        if (currentTool === 'eraser') {
                            e.stopPropagation();
                            removeStroke(stroke.id);
                        }
                    }}
                    onPointerEnter={(e) => {
                        if (currentTool === 'eraser' && e.buttons > 0) {
                            removeStroke(stroke.id);
                        }
                    }}
                />
            ))}
        </>
    );
});

const DrawLayer: React.FC = () => {
    const { x, y, zoom } = useViewport();
    const { isDrawMode, currentTool, currentColor, currentWidth, strokes, addStroke, removeStroke } = useDrawContext();
    
    // Use refs for mutable drawing state to avoid O(N) array spreads per pointerMove frame
    const currentStrokeRef = useRef<Stroke | null>(null);
    const currentPathRef = useRef<SVGPathElement | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    const getMouseCoords = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
        if (!svgRef.current) return { x: 0, y: 0 };
        const rect = svgRef.current.getBoundingClientRect();
        // Convert screen coordinates to ReactFlow viewport coordinates
        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;
        return {
            x: (clientX - x) / zoom,
            y: (clientY - y) / zoom
        };
    }, [x, y, zoom]);

    const handlePointerDown = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
        if (!isDrawMode || currentTool !== 'pen') return;
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        
        const coords = getMouseCoords(e);
        currentStrokeRef.current = {
            id: Date.now().toString(),
            points: [coords],
            color: currentColor,
            width: currentWidth
        };
        
        // Direct DOM manipulation for the active stroke — zero React re-renders during drawing
        if (currentPathRef.current) {
            currentPathRef.current.setAttribute('d', `M ${coords.x} ${coords.y}`);
            currentPathRef.current.setAttribute('stroke', currentColor);
            currentPathRef.current.setAttribute('stroke-width', String(currentWidth));
            currentPathRef.current.style.display = '';
        }
    }, [isDrawMode, currentTool, currentColor, currentWidth, getMouseCoords]);

    const handlePointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
        if (!isDrawMode || currentTool !== 'pen' || !currentStrokeRef.current) return;
        e.preventDefault();
        
        const coords = getMouseCoords(e);
        // O(1) mutable push instead of O(N) immutable array spread
        currentStrokeRef.current.points.push(coords);
        
        // Direct DOM update — no React setState, no reconciliation, no GC pressure
        if (currentPathRef.current) {
            const d = currentPathRef.current.getAttribute('d') || '';
            currentPathRef.current.setAttribute('d', `${d} L ${coords.x} ${coords.y}`);
        }
    }, [isDrawMode, currentTool, getMouseCoords]);

    const handlePointerUp = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
        if (!isDrawMode || currentTool !== 'pen' || !currentStrokeRef.current) return;
        e.preventDefault();
        e.currentTarget.releasePointerCapture(e.pointerId);
        
        if (currentStrokeRef.current.points.length > 0) {
            addStroke(currentStrokeRef.current);
        }
        currentStrokeRef.current = null;
        
        // Hide the active stroke path
        if (currentPathRef.current) {
            currentPathRef.current.setAttribute('d', '');
            currentPathRef.current.style.display = 'none';
        }
    }, [isDrawMode, currentTool, addStroke]);

    return (
        <svg
            ref={svgRef}
            className={`absolute inset-0 w-full h-full z-40 ${isDrawMode ? (currentTool === 'eraser' ? 'cursor-cell' : 'cursor-crosshair') + ' touch-none pointer-events-auto' : 'pointer-events-none'}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={{ touchAction: 'none' }}
        >
            <StrokeGlowFilter />
            <g transform={`translate(${x}, ${y}) scale(${zoom})`}>
                <MemoizedCompletedStrokes strokes={strokes} currentTool={currentTool} removeStroke={removeStroke} />
                
                {/* Active stroke: rendered via direct DOM manipulation, no React re-renders */}
                <path
                    ref={currentPathRef}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ display: 'none' }}
                />
            </g>
        </svg>
    );
};

export default DrawLayer;
