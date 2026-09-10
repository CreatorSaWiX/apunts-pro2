import { useEffect } from 'react';
import { useSettingsStore, type ShortcutConfig } from '../../stores/useSettingsStore';

/**
 * Valid action identifiers that can be dispatched by Planner shortcuts.
 * Excludes modifiers like `plannerDuplicateModifier` which are handled during drag & drop.
 */
export type PlannerActionId =
    | 'plannerToday'
    | 'plannerViewWeek'
    | 'plannerViewMonth'
    | 'plannerViewYear'
    | 'plannerPrev'
    | 'plannerNext'
    | 'plannerCreateTask'
    | 'plannerDeleteTask'
    | 'plannerEditTask'
    | 'plannerPriorityLow'
    | 'plannerPriorityMedium'
    | 'plannerPriorityHigh';

export interface PlannerActionEventDetail {
    action: PlannerActionId;
}

/**
 * Helper to dispatch a type-safe planner action event.
 */
export const dispatchPlannerAction = (action: PlannerActionId): void => {
    window.dispatchEvent(
        new CustomEvent<PlannerActionEventDetail>('planner-action', {
            detail: { action }
        })
    );
};

const NON_EXECUTABLE_SHORTCUTS = new Set<string>(['plannerDuplicateModifier']);

/**
 * Detects if the current user agent is macOS (evaluated once for performance).
 */
const IS_MAC = typeof navigator !== 'undefined' && /mac/i.test(navigator.userAgent);

/**
 * Checks whether an event target is an active text input or editable element.
 */
const isTextInputElement = (target: EventTarget | null): boolean => {
    if (!(target instanceof HTMLElement)) return false;
    if (target.isContentEditable) return true;
    const { tagName } = target;
    return tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT';
};

/**
 * Hook to register global keyboard shortcuts within the Planner module.
 * Listens to `keydown` events, matches them against user-defined shortcut settings,
 * and emits a decoupled `planner-action` custom event for the active planner views.
 */
export const usePlannerShortcuts = (): void => {
    const { shortcuts, isSettingsLoaded } = useSettingsStore();

    useEffect(() => {
        if (!isSettingsLoaded) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore keystrokes when the user is typing in form fields or editable areas
            if (isTextInputElement(e.target)) {
                return;
            }

            // Ignore standalone modifier keys (Shift, Alt, Control, Meta)
            if (['Control', 'Meta', 'Alt', 'Shift'].includes(e.key)) {
                return;
            }

            const isMetaPressed = IS_MAC ? e.metaKey : e.ctrlKey;
            const keyPressed = e.key.toLowerCase();

            // Find matching planner action
            let matchedAction: PlannerActionId | null = null;

            for (const [actionId, rawConfig] of Object.entries(shortcuts)) {
                if (!actionId.startsWith('planner') || NON_EXECUTABLE_SHORTCUTS.has(actionId)) {
                    continue;
                }

                const config = rawConfig as ShortcutConfig;
                const matchesKey = config.key.toLowerCase() === keyPressed;
                const matchesMeta = Boolean(config.meta) === isMetaPressed;

                // When no meta key is required, ensure other modifiers (Alt, Ctrl) are also not pressed
                // to avoid conflicting with browser or OS-level shortcuts.
                if (!config.meta && (e.altKey || (IS_MAC && e.ctrlKey))) {
                    continue;
                }

                if (matchesKey && matchesMeta) {
                    matchedAction = actionId as PlannerActionId;
                    break;
                }
            }

            if (matchedAction) {
                e.preventDefault();
                e.stopPropagation();
                dispatchPlannerAction(matchedAction);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [shortcuts, isSettingsLoaded]);
};
