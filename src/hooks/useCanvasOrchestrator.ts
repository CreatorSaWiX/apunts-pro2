import { useState, useRef, useEffect, useCallback } from 'react';

export function useCanvasOrchestrator() {
    const [isCanvasOpen, setIsCanvasOpen] = useState(false);
    const [isCanvasFullyOpen, setIsCanvasFullyOpen] = useState(false);
    const [isBackgroundHidden, setIsBackgroundHidden] = useState(false);
    const [isCanvasClosing, setIsCanvasClosing] = useState(false);
    const animationTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

    const handleOpenCanvas = useCallback(() => {
        setIsCanvasOpen(true);
        const t1 = setTimeout(() => {
            setIsCanvasFullyOpen(true);
            setIsBackgroundHidden(true);
        }, 800);
        animationTimersRef.current.push(t1);
    }, []);

    const handleCloseCanvas = useCallback(() => {
        setIsCanvasClosing(true);
        setIsBackgroundHidden(false);
        setIsCanvasFullyOpen(false);
        const t1 = setTimeout(() => setIsCanvasOpen(false), 350);
        const t2 = setTimeout(() => setIsCanvasClosing(false), 1200);
        animationTimersRef.current.push(t1, t2);
    }, []);

    useEffect(() => {
        if (typeof document !== 'undefined') {
            if (isCanvasOpen) {
                document.body.classList.add('canvas-active');
                window.dispatchEvent(new CustomEvent('apunts_canvas_active', { detail: true }));
            } else {
                document.body.classList.remove('canvas-active');
                window.dispatchEvent(new CustomEvent('apunts_canvas_active', { detail: false }));
            }
        }
        return () => {
            if (typeof document !== 'undefined') {
                document.body.classList.remove('canvas-active');
                window.dispatchEvent(new CustomEvent('apunts_canvas_active', { detail: false }));
            }
        };
    }, [isCanvasOpen]);

    useEffect(() => {
        const timers = animationTimersRef.current;
        return () => {
            timers.forEach(clearTimeout);
        };
    }, []);

    return {
        isCanvasOpen,
        isCanvasFullyOpen,
        isBackgroundHidden,
        isCanvasClosing,
        handleOpenCanvas,
        handleCloseCanvas
    };
}
