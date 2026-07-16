import React, { createContext, useContext, useState, type ReactNode, useMemo, useCallback } from 'react';

export interface Stroke {
    id: string;
    points: { x: number; y: number }[];
    color: string;
    width: number;
}

export type DrawTool = 'pen' | 'eraser' | 'pan';

interface DrawContextType {
    isDrawMode: boolean; // Computed based on currentTool !== 'pan'
    setIsDrawMode: (v: boolean) => void;
    currentTool: DrawTool;
    setCurrentTool: (t: DrawTool) => void;
    currentColor: string;
    setCurrentColor: (c: string) => void;
    currentWidth: number;
    setCurrentWidth: (w: number) => void;
    strokes: Stroke[];
    setStrokes: (strokes: Stroke[]) => void;
    addStroke: (stroke: Stroke) => void;
    removeStroke: (id: string) => void;
    clearStrokes: () => void;
    undoStroke: () => void;
    redoStroke: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

const DrawContext = createContext<DrawContextType | undefined>(undefined);

export const DrawProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentTool, setCurrentTool] = useState<DrawTool>('pen');
    const isDrawMode = currentTool !== 'pan';
    
    // Kept for backwards compatibility but it just sets tool to 'pen' or 'pan'
    const setIsDrawMode = useCallback((v: boolean) => {
        setCurrentTool(v ? 'pen' : 'pan');
    }, []);

    const [currentColor, setCurrentColor] = useState('#ef4444'); // Default red
    const [currentWidth, setCurrentWidth] = useState(4); // Default brush width
    const [strokes, setStrokes] = useState<Stroke[]>([]);
    const [undoneStrokes, setUndoneStrokes] = useState<Stroke[]>([]);

    const addStroke = useCallback((stroke: Stroke) => {
        setStrokes((prev) => [...prev, stroke]);
        setUndoneStrokes([]);
    }, []);

    const clearStrokes = useCallback(() => {
        setStrokes([]);
        setUndoneStrokes([]);
    }, []);

    const removeStroke = useCallback((id: string) => {
        setStrokes((prev) => prev.filter(s => s.id !== id));
    }, []);

    const undoStroke = useCallback(() => {
        setStrokes((prev) => {
            if (prev.length === 0) return prev;
            const newStrokes = [...prev];
            const popped = newStrokes.pop();
            if (popped) {
                setUndoneStrokes((u) => [...u, popped]);
            }
            return newStrokes;
        });
    }, []);

    const redoStroke = useCallback(() => {
        setUndoneStrokes((prev) => {
            if (prev.length === 0) return prev;
            const newUndone = [...prev];
            const popped = newUndone.pop();
            if (popped) {
                setStrokes((s) => [...s, popped]);
            }
            return newUndone;
        });
    }, []);

    const contextValue = useMemo(() => ({
        isDrawMode,
        setIsDrawMode,
        currentTool,
        setCurrentTool,
        currentColor,
        setCurrentColor,
        currentWidth,
        setCurrentWidth,
        strokes,
        setStrokes,
        addStroke,
        removeStroke,
        clearStrokes,
        undoStroke,
        redoStroke,
        canUndo: strokes.length > 0,
        canRedo: undoneStrokes.length > 0
    }), [isDrawMode, currentTool, currentColor, currentWidth, strokes, undoneStrokes, addStroke, removeStroke, clearStrokes, undoStroke, redoStroke, setIsDrawMode]);

    return (
        <DrawContext.Provider value={contextValue}>
            {children}
        </DrawContext.Provider>
    );
};

export const useDrawContext = () => {
    const context = useContext(DrawContext);
    if (context === undefined) {
        throw new Error('useDrawContext must be used within a DrawProvider');
    }
    return context;
};
