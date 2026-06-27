import React, { useState, useRef } from 'react';
import { useViewport } from '@xyflow/react';
import { useDrawContext, type Stroke } from '../../../contexts/DrawContext';

// Helper to generate SVG path data from points
const getSvgPathFromPoints = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y} L ${points[0].x} ${points[0].y}`;
    
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
        // Simple smoothing can be added here, but linear is fine for performance
        path += ` L ${points[i].x} ${points[i].y}`;
    }
    return path;
};

const DrawLayer: React.FC = () => {
    const { x, y, zoom } = useViewport();
    const { isDrawMode, currentColor, strokes, addStroke } = useDrawContext();
    
    const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    const getMouseCoords = (e: React.PointerEvent<SVGSVGElement>) => {
        if (!svgRef.current) return { x: 0, y: 0 };
        const rect = svgRef.current.getBoundingClientRect();
        // Convert screen coordinates to ReactFlow viewport coordinates
        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;
        return {
            x: (clientX - x) / zoom,
            y: (clientY - y) / zoom
        };
    };

    const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
        if (!isDrawMode) return;
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        
        const coords = getMouseCoords(e);
        setCurrentStroke({
            id: Date.now().toString(),
            points: [coords],
            color: currentColor,
            width: 4 // Default brush width
        });
    };

    const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
        if (!isDrawMode || !currentStroke) return;
        e.preventDefault();
        
        const coords = getMouseCoords(e);
        setCurrentStroke(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                points: [...prev.points, coords]
            };
        });
    };

    const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
        if (!isDrawMode || !currentStroke) return;
        e.preventDefault();
        e.currentTarget.releasePointerCapture(e.pointerId);
        
        if (currentStroke.points.length > 0) {
            addStroke(currentStroke);
        }
        setCurrentStroke(null);
    };

    return (
        <svg
            ref={svgRef}
            className={`absolute inset-0 w-full h-full z-40 ${isDrawMode ? 'cursor-crosshair touch-none pointer-events-auto' : 'pointer-events-none'}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={{ touchAction: 'none' }}
        >
            <g transform={`translate(${x}, ${y}) scale(${zoom})`}>
                {strokes.map(stroke => (
                    <path
                        key={stroke.id}
                        d={getSvgPathFromPoints(stroke.points)}
                        stroke={stroke.color}
                        strokeWidth={stroke.width}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ filter: `drop-shadow(0px 0px 6px ${stroke.color}66)` }}
                    />
                ))}
                
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
            </g>
        </svg>
    );
};

export default DrawLayer;
