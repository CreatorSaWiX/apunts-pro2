import type { Task } from '../../types/tasks';
import type { PlannerActionId } from './usePlannerShortcuts';

export interface TaskPopoverEventDetail {
    x: number;
    y: number;
    taskId: string;
}

export interface TaskContextMenuEventDetail {
    x: number;
    y: number;
    task: Task;
}

export interface PlannerActionEventDetail {
    action: PlannerActionId;
}

/**
 * Dispara l'obertura de la finestra emergent d'edició ràpida de tasca (TaskPopover)
 */
export const dispatchOpenTaskPopover = (detail: TaskPopoverEventDetail): void => {
    window.dispatchEvent(
        new CustomEvent<TaskPopoverEventDetail>('open-task-popover', { detail })
    );
};

/**
 * Dispara l'obertura del menú contextual flotant de tasca (GlobalTaskContextMenu)
 */
export const dispatchOpenTaskContextMenu = (detail: TaskContextMenuEventDetail): void => {
    window.dispatchEvent(
        new CustomEvent<TaskContextMenuEventDetail>('open-task-context-menu', { detail })
    );
};

/**
 * Dispara una acció executada per drecera de teclat o navegació del planificador
 */
export const dispatchPlannerAction = (action: PlannerActionId): void => {
    window.dispatchEvent(
        new CustomEvent<PlannerActionEventDetail>('planner-action', {
            detail: { action }
        })
    );
};

/**
 * Notifica la selecció d'una tasca per centrar-la o ressaltar-la
 */
export const dispatchTaskSelected = (taskId: string): void => {
    window.dispatchEvent(
        new CustomEvent<string>('task-selected', { detail: taskId })
    );
};

/**
 * Notifica que l'Assistent IA ha completat la planificació per activar efectes visuals
 */
export const dispatchAIMagicDone = (): void => {
    window.dispatchEvent(new CustomEvent('ai-magic-done'));
};

/**
 * Funció auxiliar pura per calcular posicions flotants de menús evitant desbordaments de pantalla
 */
export const getClampedCoordinates = (
    x: number,
    y: number,
    width: number,
    height: number,
    padding = 10
): { x: number; y: number } => {
    const maxX = typeof window !== 'undefined' ? window.innerWidth - width - padding : x;
    const maxY = typeof window !== 'undefined' ? window.innerHeight - height - padding : y;

    return {
        x: Math.max(padding, Math.min(x, maxX)),
        y: Math.max(padding, Math.min(y, maxY))
    };
};
