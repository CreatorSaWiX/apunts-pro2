import { useState, useEffect } from 'react';

export const useAltKey = () => {
    const [isAltPressed, setIsAltPressed] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Alt') setIsAltPressed(true);
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'Alt') setIsAltPressed(false);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        
        // Also listen for blur to reset state when window loses focus
        window.addEventListener('blur', () => setIsAltPressed(false));

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('blur', () => setIsAltPressed(false));
        };
    }, []);

    return isAltPressed;
};
