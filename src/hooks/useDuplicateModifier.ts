import { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';

export const useDuplicateModifier = () => {
    const { shortcuts, isSettingsLoaded } = useSettings();
    const [isModifierPressed, setIsModifierPressed] = useState(false);

    useEffect(() => {
        if (!isSettingsLoaded) return;
        
        const duplicateKey = shortcuts.plannerDuplicateModifier?.key || 'Alt';

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === duplicateKey) setIsModifierPressed(true);
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === duplicateKey) setIsModifierPressed(false);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        
        const handleBlur = () => setIsModifierPressed(false);
        // Also listen for blur to reset state when window loses focus
        window.addEventListener('blur', handleBlur);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('blur', handleBlur);
        };
    }, [shortcuts, isSettingsLoaded]);

    return isModifierPressed;
};
