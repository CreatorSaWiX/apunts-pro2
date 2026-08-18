import { useEffect, useRef } from 'react';
import { useDrawContext, type DrawTool } from '../contexts/DrawContext';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';

interface UseCanvasShortcutsOptions {
    onClose?: () => void;
    onClearBroadcast?: () => void;
    enabled?: boolean;
}

export const useCanvasShortcuts = ({ onClose, onClearBroadcast, enabled = true }: UseCanvasShortcutsOptions = {}) => {
    const { t } = useTranslation();
    const { shortcuts } = useSettingsStore();
    const {
        currentTool,
        currentColor,
        currentWidth,
        canUndo,
        canRedo,
        undoStroke,
        redoStroke,
        clearStrokes,
        setCurrentTool,
        setCurrentColor,
        setCurrentWidth
    } = useDrawContext(useShallow(state => ({
        currentTool: state.currentTool,
        currentColor: state.currentColor,
        currentWidth: state.currentWidth,
        canUndo: state.canUndo,
        canRedo: state.canRedo,
        undoStroke: state.undoStroke,
        redoStroke: state.redoStroke,
        clearStrokes: state.clearStrokes,
        setCurrentTool: state.setCurrentTool,
        setCurrentColor: state.setCurrentColor,
        setCurrentWidth: state.setCurrentWidth
    })));

    const stateRef = useRef({
        currentTool,
        currentColor,
        currentWidth,
        canUndo,
        canRedo,
        undoStroke,
        redoStroke,
        clearStrokes,
        setCurrentTool,
        setCurrentColor,
        setCurrentWidth,
        onClose,
        onClearBroadcast,
        enabled,
        shortcuts,
        t
    });

    useEffect(() => {
        stateRef.current = {
            currentTool,
            currentColor,
            currentWidth,
            canUndo,
            canRedo,
            undoStroke,
            redoStroke,
            clearStrokes,
            setCurrentTool,
            setCurrentColor,
            setCurrentWidth,
            onClose,
            onClearBroadcast,
            enabled,
            shortcuts,
            t
        };
    });

    const prevToolRef = useRef<DrawTool | null>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const {
                currentTool,
                currentColor,
                currentWidth,
                canUndo,
                canRedo,
                undoStroke,
                redoStroke,
                clearStrokes,
                setCurrentTool,
                setCurrentColor,
                setCurrentWidth,
                onClose,
                onClearBroadcast,
                enabled,
                shortcuts,
                t
            } = stateRef.current;

            if (!enabled) return;

            // Do not trigger if typing in input/textarea/contentEditable
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || (e.target as HTMLElement).isContentEditable) {
                return;
            }

            const drawColors = [
                { id: 'red', value: '#ef4444' },
                { id: 'blue', value: '#3b82f6' },
                { id: 'yellow', value: '#eab308' },
                { id: 'purple', value: '#a855f7' },
            ];
            const sizes = [2, 4, 8];

            const isMac = navigator.userAgent.toLowerCase().includes('mac');
            const metaPressed = isMac ? e.metaKey : e.ctrlKey;
            const key = e.key.toLowerCase();

            // Helper to check match against configured shortcut or fallback
            const matchShortcut = (actionId: string, fallbackKey: string, fallbackMeta = false) => {
                const config = shortcuts?.[actionId] || { key: fallbackKey, meta: fallbackMeta };
                return key === config.key.toLowerCase() && metaPressed === config.meta;
            };

            // 1. Undo / Redo
            if (matchShortcut('canvasUndo', 'z', true) && !e.shiftKey) {
                e.preventDefault();
                if (canUndo) undoStroke();
                return;
            }
            if (matchShortcut('canvasRedo', 'y', true) || (metaPressed && e.shiftKey && key === 'z')) {
                e.preventDefault();
                if (canRedo) redoStroke();
                return;
            }

            // 2. Clear Canvas
            if (matchShortcut('canvasClear', 'delete', false) || (e.shiftKey && (e.key === 'Delete' || e.key === 'Backspace'))) {
                e.preventDefault();
                if (window.confirm(t('canvas.confirmClear', 'Vols esborrar tot el llenç?'))) {
                    clearStrokes();
                    if (onClearBroadcast) onClearBroadcast();
                }
                return;
            }

            // Ignore if Ctrl / Meta / Alt is pressed for tool switching
            if (e.ctrlKey || e.metaKey || e.altKey) return;

            // 3. Tool Switching
            if (matchShortcut('canvasPen', 'p') || key === 'd' || key === '2') {
                e.preventDefault();
                setCurrentTool('pen');
            } else if (matchShortcut('canvasEraser', 'e') || key === '3') {
                e.preventDefault();
                setCurrentTool('eraser');
            } else if (matchShortcut('canvasPan', 'h') || key === 'v' || key === '1') {
                e.preventDefault();
                setCurrentTool('pan');
            } else if (matchShortcut('canvasTempPan', ' ') || e.code === 'Space') {
                e.preventDefault();
                if (!e.repeat && currentTool !== 'pan') {
                    prevToolRef.current = currentTool;
                    setCurrentTool('pan');
                }
            } else if (key === 'escape') {
                e.preventDefault();
                if (currentTool !== 'pan') {
                    setCurrentTool('pan');
                } else if (onClose) {
                    onClose();
                }
            }

            // 4. Brush Size Cycling & Adjusting
            else if (matchShortcut('canvasSizeDecrease', '[') || key === '-') {
                e.preventDefault();
                const idx = sizes.indexOf(currentWidth);
                if (idx > 0) setCurrentWidth(sizes[idx - 1]);
                else setCurrentWidth(sizes[sizes.length - 1]);
            } else if (matchShortcut('canvasSizeIncrease', ']') || key === '+' || key === '=') {
                e.preventDefault();
                const idx = sizes.indexOf(currentWidth);
                if (idx < sizes.length - 1) setCurrentWidth(sizes[idx + 1]);
                else setCurrentWidth(sizes[0]);
            }

            // 5. Color Quick-Select & Cycling
            else if (matchShortcut('canvasColorCycle', 'c')) {
                e.preventDefault();
                const idx = drawColors.findIndex(c => c.value === currentColor);
                const nextIdx = (idx + 1) % drawColors.length;
                setCurrentColor(drawColors[nextIdx].value);
                if (currentTool !== 'pen') setCurrentTool('pen');
            } else if (key === 'r' || key === '4') {
                e.preventDefault();
                setCurrentColor('#ef4444');
                if (currentTool !== 'pen') setCurrentTool('pen');
            } else if (key === 'b' || key === '5') {
                e.preventDefault();
                setCurrentColor('#3b82f6');
                if (currentTool !== 'pen') setCurrentTool('pen');
            } else if (key === 'y' || key === '6') {
                e.preventDefault();
                setCurrentColor('#eab308');
                if (currentTool !== 'pen') setCurrentTool('pen');
            } else if (key === 'u' || key === '7') {
                e.preventDefault();
                setCurrentColor('#a855f7');
                if (currentTool !== 'pen') setCurrentTool('pen');
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if ((e.code === 'Space' || e.key === ' ') && prevToolRef.current) {
                e.preventDefault();
                stateRef.current.setCurrentTool(prevToolRef.current);
                prevToolRef.current = null;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);
};
