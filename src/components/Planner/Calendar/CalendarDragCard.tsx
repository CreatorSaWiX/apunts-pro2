import React, { useMemo, useCallback } from 'react';
import type { Task, TaskPriority } from '../../../types/tasks';
import { useTasks } from '../../../contexts/TasksContext';
import { getSubjectColor } from '../../../stores/useSubjectStore';

interface CalendarDragCardProps {
    task: Task;
}

const PRIORITY_ACCENT_COLORS: Record<TaskPriority, string> = {
    HIGH: '#EF4444',
    MEDIUM: '#F59E0B',
    LOW: '#10B981'
};

const DEFAULT_ACCENT_COLOR = '#10B981';

/**
 * Formatador pur del temps estimat de la tasca en minuts o hores
 */
function formatDuration(minutes?: number): string {
    const mins = minutes && minutes > 0 ? minutes : 60;
    if (mins < 60) return `${mins}m`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

/**
 * Targeta visual d'arrossegament (Drag Overlay) que acompanya el cursor
 * quan s'arrossega una tasca des del calaix de tasques pendents cap al calendari.
 */
export const CalendarDragCard: React.FC<CalendarDragCardProps> = React.memo(({ task }) => {
    // Selector granular O(1): només recupera l'assignatura d'aquesta tasca concreta sense subscriure tot l'array
    const taskSubject = useTasks(
        useCallback(
            state => (task.subjectId ? state.subjects.find(s => s.id === task.subjectId) : undefined),
            [task.subjectId]
        )
    );

    const subjectColor = useMemo(() => {
        return taskSubject?.colorToken ? getSubjectColor(taskSubject.colorToken) : null;
    }, [taskSubject]);

    const priorityColor = PRIORITY_ACCENT_COLORS[task.priority] || DEFAULT_ACCENT_COLOR;
    const accentColor = subjectColor?.primary || priorityColor;
    const durationLabel = useMemo(() => formatDuration(task.estimatedMinutes), [task.estimatedMinutes]);

    return (
        <div 
            aria-hidden="true"
            className="w-48 h-[60px] relative rounded-xl border border-white/20 bg-[#111115]/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col justify-between p-2 pointer-events-none select-none rotate-2 scale-105 cursor-grabbing"
        >
            {/* Fons translúcid suau amb el color de l'assignatura */}
            <div
                className="absolute inset-0 opacity-[0.15] mix-blend-plus-lighter pointer-events-none"
                style={{ backgroundColor: accentColor }}
            />

            {/* Barra d'accent lateral de 3.5px coherent amb les targetes del calendari */}
            <div
                className="absolute top-0 bottom-0 left-0 w-[3.5px] shadow-[0_0_15px_currentColor]"
                style={{ backgroundColor: accentColor, color: accentColor }}
            />

            {/* Tirador superior decoratiu */}
            <div className="w-6 h-[3px] bg-white/40 rounded-full mx-auto" />

            <div className="pl-2.5 pr-1 flex flex-col justify-center flex-1 min-w-0">
                <div className="flex items-center gap-1.5 opacity-75">
                    <span className="text-[9px] font-bold tracking-wider font-mono text-slate-300">
                        {durationLabel}
                    </span>
                    {taskSubject && (
                        <span
                            className="text-[8px] font-bold px-1.5 py-0.2 rounded uppercase tracking-wider truncate max-w-[100px]"
                            style={{
                                color: accentColor,
                                backgroundColor: `rgba(${subjectColor?.primary_rgb || '16,185,129'}, 0.15)`
                            }}
                        >
                            {taskSubject.name}
                        </span>
                    )}
                </div>
                <div className="font-bold text-xs leading-tight text-white truncate mt-0.5">
                    {task.title || 'Sense títol'}
                </div>
            </div>

            {/* Tirador inferior decoratiu */}
            <div className="w-6 h-[3px] bg-white/40 rounded-full mx-auto" />
        </div>
    );
});

CalendarDragCard.displayName = 'CalendarDragCard';
