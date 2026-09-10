import React from 'react';
import type { Task } from '../../../types/tasks';
import { useTasks } from '../../../contexts/TasksContext';
import { useShallow } from 'zustand/react/shallow';
import { getSubjectColor } from '../../../stores/useSubjectStore';

interface CalendarDragCardProps {
    task: Task;
}

export const CalendarDragCard: React.FC<CalendarDragCardProps> = React.memo(({ task }) => {
    const { subjects } = useTasks(
        useShallow(state => ({
            subjects: state.subjects
        }))
    );

    const taskSubject = task.subjectId ? subjects?.find(s => s.id === task.subjectId) : null;
    const subjectColor = taskSubject?.colorToken ? getSubjectColor(taskSubject.colorToken) : null;

    const priorityColor =
        task.priority === 'HIGH' ? '#EF4444' :
        task.priority === 'MEDIUM' ? '#F59E0B' : '#10B981';

    const accentColor = subjectColor?.primary || priorityColor;
    const durationMins = task.estimatedMinutes || 60;
    const durationLabel = durationMins >= 60
        ? `${Math.floor(durationMins / 60)}h${durationMins % 60 ? ` ${durationMins % 60}m` : ''}`
        : `${durationMins}m`;

    return (
        <div className="w-48 h-[60px] relative rounded-xl border border-white/20 bg-[#111115]/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col justify-between p-2 pointer-events-none select-none rotate-2 scale-105 cursor-grabbing">
            {/* Fons translúcid suau amb el color de l'assignatura */}
            <div
                className="absolute inset-0 opacity-[0.15] mix-blend-plus-lighter pointer-events-none"
                style={{ backgroundColor: accentColor }}
            />

            {/* Barra d'accent lateral de 3.5px com a les tasques de calendari */}
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
                            className="text-[8px] font-bold px-1.5 py-0.2 rounded uppercase tracking-wider"
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
