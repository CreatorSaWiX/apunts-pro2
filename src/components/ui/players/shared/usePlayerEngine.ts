import React, { useState, useEffect, useCallback } from 'react';

export function usePlayerEngine(totalSteps: number, defaultSpeed: number = 1000) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (isPlaying && currentStep < totalSteps - 1) {
            timer = setTimeout(() => {
                const next = currentStep + 1;
                setCurrentStep(next);
                if (next >= totalSteps - 1) {
                    setIsPlaying(false);
                }
            }, defaultSpeed);
        } else if (isPlaying && currentStep >= totalSteps - 1) {
            setIsPlaying(false);
        }
        return () => clearTimeout(timer);
    }, [isPlaying, currentStep, totalSteps, defaultSpeed]);

    const handlePlayPause = useCallback((onPlay?: () => void) => {
        setIsPlaying(p => {
            const willPlay = !p;
            if (willPlay && onPlay) onPlay();
            
            if (willPlay && currentStep >= totalSteps - 1) {
                setCurrentStep(0);
            }
            return willPlay;
        });
    }, [currentStep, totalSteps]);

    const handleNext = useCallback(() => React.startTransition(() => setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1))), [totalSteps]);
    const handlePrev = useCallback(() => React.startTransition(() => setCurrentStep(prev => Math.max(prev - 1, 0))), []);
    const handleReset = useCallback((onReset?: () => void) => { 
        setIsPlaying(false); 
        React.startTransition(() => { 
            setCurrentStep(0); 
            if (onReset) onReset();
        }); 
    }, []);
    const handleFullEnd = useCallback(() => { setIsPlaying(false); React.startTransition(() => { setCurrentStep(totalSteps - 1); }); }, [totalSteps]);

    return {
        currentStep,
        setCurrentStep,
        isPlaying,
        setIsPlaying,
        handlePlayPause,
        handleNext,
        handlePrev,
        handleReset,
        handleFullEnd
    };
}
