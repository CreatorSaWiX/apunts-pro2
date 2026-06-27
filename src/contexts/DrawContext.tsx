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
}

const DrawContext = createContext<DrawContextType | undefined>(undefined);

export const DrawProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isDrawMode, setIsDrawMode] = useState(false);
    const [currentColor, setCurrentColor] = useState('#ef4444'); // Default red
    const [strokes, setStrokes] = useState<Stroke[]>([]);

    const addStroke = (stroke: Stroke) => {
        setStrokes((prev) => [...prev, stroke]);
    };

    const clearStrokes = () => setStrokes([]);

    const undoStroke = () => {
        setStrokes((prev) => prev.slice(0, -1));
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
                undoStroke
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
