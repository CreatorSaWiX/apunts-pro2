import { useEffect, useRef } from 'react';
import { useSettings } from '../contexts/SettingsContext';

export const useShortcut = (actionName: string, callback: () => void) => {
    const { shortcuts } = useSettings();
    const shortcut = shortcuts?.[actionName];
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        if (!shortcut) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            // Check if the pressed key matches
            if (e.key.toLowerCase() !== shortcut.key.toLowerCase()) return;

            // Check if modifiers match
            const isMetaPressed = e.metaKey || e.ctrlKey;
            if (shortcut.meta && !isMetaPressed) return;
            if (!shortcut.meta && isMetaPressed) return;

            // Optional: avoid triggering if user is typing in an input/textarea/contenteditable (unless meta is pressed)
            const target = e.target as HTMLElement;
            if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) && !shortcut.meta) {
                return;
            }

            e.preventDefault();
            callbackRef.current();
        };

        document.addEventListener('keydown', handleKeyDown, { capture: true });
        return () => document.removeEventListener('keydown', handleKeyDown, { capture: true });
    }, [shortcut]);
};
