import React, { createContext, useContext, useRef, type ReactNode } from 'react';
import { createStore, useStore } from 'zustand';

export interface Stroke {
    id: string;
    points: { x: number; y: number }[];
    color: string;
    width: number;
}

export type DrawTool = 'pen' | 'eraser' | 'pan';

export interface DrawState {
    currentTool: DrawTool;
    isDrawMode: boolean; // computed based on tool
    currentColor: string;
    currentWidth: number;
    strokes: Stroke[];
    undoneStrokes: Stroke[];
    canUndo: boolean;
    canRedo: boolean;
    setCurrentTool: (t: DrawTool) => void;
    setIsDrawMode: (v: boolean) => void;
    setCurrentColor: (c: string) => void;
    setCurrentWidth: (w: number) => void;
    setStrokes: (strokes: Stroke[] | ((prev: Stroke[]) => Stroke[])) => void;
    addStroke: (stroke: Stroke) => void;
    removeStroke: (id: string) => void;
    clearStrokes: () => void;
    undoStroke: () => void;
    redoStroke: () => void;
}

type DrawStore = ReturnType<typeof createDrawStore>;

const createDrawStore = () =>
    createStore<DrawState>((set) => ({
        currentTool: 'pan',
        isDrawMode: false,
        currentColor: '#ef4444',
        currentWidth: 4,
        strokes: [],
        undoneStrokes: [],
        canUndo: false,
        canRedo: false,
        setCurrentTool: (t) => set({ currentTool: t, isDrawMode: t !== 'pan' }),
        setIsDrawMode: (v) => set({ currentTool: v ? 'pen' : 'pan', isDrawMode: v }),
        setCurrentColor: (c) => set({ currentColor: c }),
        setCurrentWidth: (w) => set({ currentWidth: w }),
        setStrokes: (newStrokes) => set((state) => {
            const strokes = typeof newStrokes === 'function' ? newStrokes(state.strokes) : newStrokes;
            return { strokes, canUndo: strokes.length > 0 };
        }),
        addStroke: (stroke) => set((state) => {
            const newStrokes = [...state.strokes, stroke];
            return { strokes: newStrokes, undoneStrokes: [], canUndo: true, canRedo: false };
        }),
        removeStroke: (id) => set((state) => {
            const newStrokes = state.strokes.filter(s => s.id !== id);
            return { strokes: newStrokes, canUndo: newStrokes.length > 0 };
        }),
        clearStrokes: () => set({ strokes: [], undoneStrokes: [], canUndo: false, canRedo: false }),
        undoStroke: () => set((state) => {
            if (state.strokes.length === 0) return state;
            const popped = state.strokes[state.strokes.length - 1];
            const newStrokes = state.strokes.slice(0, -1);
            const newUndone = [...state.undoneStrokes, popped];
            return { strokes: newStrokes, undoneStrokes: newUndone, canUndo: newStrokes.length > 0, canRedo: true };
        }),
        redoStroke: () => set((state) => {
            if (state.undoneStrokes.length === 0) return state;
            const popped = state.undoneStrokes[state.undoneStrokes.length - 1];
            const newUndone = state.undoneStrokes.slice(0, -1);
            const newStrokes = [...state.strokes, popped];
            return { strokes: newStrokes, undoneStrokes: newUndone, canUndo: true, canRedo: newUndone.length > 0 };
        })
    }));

const DrawContext = createContext<DrawStore | null>(null);

export const DrawProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // We use a ref to ensure the store is only created once per provider instance
    const storeRef = useRef<DrawStore>(null);
    if (!storeRef.current) {
        storeRef.current = createDrawStore();
    }

    return (
        <DrawContext.Provider value={storeRef.current}>
            {children}
        </DrawContext.Provider>
    );
};

export function useDrawContext<T>(selector: (state: DrawState) => T): T {
    const store = useContext(DrawContext);
    if (!store) throw new Error('useDrawContext must be used within a DrawProvider');
    return useStore(store, selector);
}
