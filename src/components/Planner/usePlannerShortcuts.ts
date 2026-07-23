import { useEffect } from 'react';
import { useSettings } from '../../contexts/SettingsContext';

export const usePlannerShortcuts = () => {
    const { shortcuts, isSettingsLoaded } = useSettings();

    useEffect(() => {
        if (!isSettingsLoaded) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if typing in an input, textarea or contenteditable
            if (e.target instanceof HTMLElement && (e.target.isContentEditable || ['INPUT', 'TEXTAREA'].includes(e.target.tagName))) {
                return;
            }

            const isMac = navigator.userAgent.toLowerCase().includes('mac');
            const metaPressed = isMac ? e.metaKey : e.ctrlKey;
            const keyPressed = e.key.toLowerCase();

            // Find matching action
            let matchedAction: string | null = null;
            for (const [actionId, config] of Object.entries(shortcuts)) {
                if (actionId.startsWith('planner') && config.key.toLowerCase() === keyPressed && config.meta === metaPressed) {
                    matchedAction = actionId;
                    break;
                }
            }

            if (matchedAction) {
                e.preventDefault();
                e.stopPropagation();
                window.dispatchEvent(new CustomEvent('planner-action', { detail: { action: matchedAction } }));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [shortcuts, isSettingsLoaded]);
};
