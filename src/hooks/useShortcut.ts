import { useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';

export const useShortcut = (actionName: string, callback: () => void) => {
    const { shortcuts } = useSettings();
    const shortcut = shortcuts?.[actionName];

    useEffect(() => {
        if (!shortcut) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            // Check if the pressed key matches
            if (e.key.toLowerCase() !== shortcut.key.toLowerCase()) return;

            // Check if modifiers match
            const isMetaPressed = e.metaKey || e.ctrlKey;
            if (shortcut.meta && !isMetaPressed) return;
            if (!shortcut.meta && isMetaPressed) return;

            // Optional: avoid triggering if user is typing in an input/textarea (unless meta is pressed)
            const target = e.target as HTMLElement;
            if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') && !shortcut.meta) {
                return;
            }

            e.preventDefault();
            callback();
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [shortcut, callback]);
};
