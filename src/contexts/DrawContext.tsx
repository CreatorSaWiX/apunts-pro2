import React, { createContext, useContext, useState, type ReactNode } from 'react';

export interface Stroke {
    id: string;
    points: { x: number; y: number }[];
    color: string;
    width: number;
}

interface DrawContextType {
    isDrawMode: boolean;
    setIsDrawMode: (v: boolean) => void;
    currentColor: string;
    setCurrentColor: (c: string) => void;
    strokes: Stroke[];
    setStrokes: (strokes: Stroke[]) => void;
    addStroke: (stroke: Stroke) => void;
    clearStrokes: () => void;
    undoStroke: () => void;
    redoStroke: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

const DrawContext = createContext<DrawContextType | undefined>(undefined);

export const DrawProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isDrawMode, setIsDrawMode] = useState(false);
    const [currentColor, setCurrentColor] = useState('#ef4444'); // Default red
    const [strokes, setStrokes] = useState<Stroke[]>([]);
    const [undoneStrokes, setUndoneStrokes] = useState<Stroke[]>([]);

    const addStroke = (stroke: Stroke) => {
        setStrokes((prev) => [...prev, stroke]);
        setUndoneStrokes([]);
    };

    const clearStrokes = () => {
        setStrokes([]);
        setUndoneStrokes([]);
    };

    const undoStroke = () => {
        setStrokes((prev) => {
            if (prev.length === 0) return prev;
            const newStrokes = [...prev];
            const popped = newStrokes.pop();
            if (popped) {
                setUndoneStrokes((u) => [...u, popped]);
            }
            return newStrokes;
        });
    };

    const redoStroke = () => {
        setUndoneStrokes((prev) => {
            if (prev.length === 0) return prev;
            const newUndone = [...prev];
            const popped = newUndone.pop();
            if (popped) {
                setStrokes((s) => [...s, popped]);
            }
            return newUndone;
        });
    };

    return (
        <DrawContext.Provider
            value={{
                isDrawMode,
                setIsDrawMode,
                currentColor,
                setCurrentColor,
                strokes,
                setStrokes,
                addStroke,
                clearStrokes,
                undoStroke,
                redoStroke,
                canUndo: strokes.length > 0,
                canRedo: undoneStrokes.length > 0
            }}
        >
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
