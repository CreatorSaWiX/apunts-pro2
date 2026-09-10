import { useRef, useEffect, useState, useCallback, type ChangeEvent } from 'react';
import { useRoadmap, type SubjectNodeData } from '../../../../contexts/RoadmapContext';
import { useShallow } from 'zustand/react/shallow';

export interface UseAnnotationNodeOptions {
    id: string;
    data: SubjectNodeData;
    defaultFontSize?: number;
}

export function useAnnotationNode({ id, data, defaultFontSize = 16 }: UseAnnotationNodeOptions) {
    const { updateNodeData, duplicateAnnotation, removeNode } = useRoadmap(
        useShallow(state => ({
            updateNodeData: state.updateNodeData,
            duplicateAnnotation: state.duplicateAnnotation,
            removeNode: state.removeNode
        }))
    );

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [localText, setLocalText] = useState(data.text || '');
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const latestTextRef = useRef(data.text || '');
    latestTextRef.current = localText;

    const currentFontSize = data.fontSize || defaultFontSize;

    // Auto-resize textarea to content height
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [localText, currentFontSize, data.fontWeight]);

    // Keep localText in sync if changed from outside
    useEffect(() => {
        if (!isEditing) {
            setLocalText(data.text || '');
        }
    }, [data.text, isEditing]);

    const flushTextChange = useCallback((textToSave: string) => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
            debounceTimerRef.current = null;
        }
        updateNodeData(id, { text: textToSave });
    }, [id, updateNodeData]);

    // Clean up timer and flush on unmount
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
                updateNodeData(id, { text: latestTextRef.current });
            }
        };
    }, [id, updateNodeData]);

    const handleTextChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setLocalText(value);
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
            flushTextChange(value);
        }, 250);
    }, [flushTextChange]);

    const handleBlur = useCallback(() => {
        setIsEditing(false);
        flushTextChange(latestTextRef.current);
    }, [flushTextChange]);

    const handleToggleBold = useCallback(() => {
        updateNodeData(id, { fontWeight: data.fontWeight === 'bold' ? 'normal' : 'bold' });
    }, [id, data.fontWeight, updateNodeData]);

    const handleSizeChange = useCallback((newSize: number) => {
        if (isNaN(newSize)) return;
        updateNodeData(id, { fontSize: Math.max(10, Math.min(100, newSize)) });
    }, [id, updateNodeData]);

    const handleColorChange = useCallback((color: string) => {
        updateNodeData(id, { color });
    }, [id, updateNodeData]);

    const handleDuplicate = useCallback(() => {
        duplicateAnnotation(id);
    }, [id, duplicateAnnotation]);

    const handleRemove = useCallback(() => {
        removeNode(id);
    }, [id, removeNode]);

    return {
        textareaRef,
        isEditing,
        setIsEditing,
        localText,
        handleTextChange,
        handleBlur,
        handleToggleBold,
        handleSizeChange,
        handleColorChange,
        handleDuplicate,
        handleRemove,
        currentFontSize
    };
}
