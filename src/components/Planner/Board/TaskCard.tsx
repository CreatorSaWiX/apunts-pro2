import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task, TaskPriority } from '../../../types/tasks';
import { useTasks } from '../../../contexts/TasksContext';
import { useShallow } from 'zustand/react/shallow';
import { m as motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Calendar, Flag, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { getSubjectColor } from '../../../stores/useSubjectStore';
import { TaskProgressBar } from './TaskProgressBar';
import { TaskCardEditForm } from './TaskCardEditForm';
import { getDateLocale } from './boardConstants';

export interface TaskCardProps {
    task: Task;
    isOverlay?: boolean;
    allColumns?: { id: string; title: string; color?: string }[];
}

const PRIORITIES: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH'];

const getPriorityStyle = (priority: TaskPriority) => {
    switch (priority) {
        case 'HIGH':
            return 'text-[#FF453A] bg-[#FF453A]/10 border-[#FF453A]/20 hover:bg-[#FF453A]/20';
        case 'MEDIUM':
            return 'text-[#FF9F0A] bg-[#FF9F0A]/10 border-[#FF9F0A]/20 hover:bg-[#FF9F0A]/20';
        case 'LOW':
            return 'text-slate-400 bg-white/5 border-white/5 hover:bg-white/10';
    }
};

const TaskCard: React.FC<TaskCardProps> = React.memo(({ task, isOverlay, allColumns }) => {
    const { t, i18n } = useTranslation();
    const dateLocale = useMemo(() => getDateLocale(i18n.language), [i18n.language]);

    const { updateTask, subjects, deleteTask } = useTasks(useShallow(state => ({
        updateTask: state.updateTask,
        subjects: state.subjects,
        deleteTask: state.deleteTask
    })));

    const subject = task.subjectId ? subjects?.find(s => s.id === task.subjectId) : null;
    const [isEditing, setIsEditing] = useState(false);

    const formattedDueDate = useMemo(() => {
        if (!task.dueDate) return null;
        const d = new Date(task.dueDate);
        if (isNaN(d.getTime())) return null;
        return format(d, 'MMM d', { locale: dateLocale }).replace('.', '');
    }, [task.dueDate, dateLocale]);

    // Efecte de focus de llum amb moviment de cursor
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const rafRef = useRef<number | null>(null);

    const backgroundStyle = useMotionTemplate`
        radial-gradient(
          400px circle at ${mouseX}px ${mouseY}px,
          rgba(255, 255, 255, 0.06),
          transparent 80%
        )
    `;

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (rafRef.current) return;
        const clientX = e.clientX;
        const clientY = e.clientY;
        const currentTarget = e.currentTarget as HTMLElement;

        rafRef.current = requestAnimationFrame(() => {
            const { left, top } = currentTarget.getBoundingClientRect();
            mouseX.set(clientX - left);
            mouseY.set(clientY - top);
            rafRef.current = null;
        });
    }, [mouseX, mouseY]);

    useEffect(() => {
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    // Configuració del sensor Sortable de dnd-kit
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: 'Task',
            task
        }
    });

    const style = {
        transition: transition || 'transform 250ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        transform: isOverlay
            ? 'rotate(3deg) scale(1.05)'
            : isDragging
                ? `${CSS.Transform.toString(transform)} rotate(2deg) scale(1.02)`
                : CSS.Transform.toString(transform),
        zIndex: isDragging || isOverlay ? 10000 : (isEditing ? 50 : 'auto'),
    };

    const handleSave = useCallback((updates: Partial<Task>) => {
        setIsEditing(false);
        updateTask(task.id, updates);
    }, [task.id, updateTask]);

    const togglePriority = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        const currentIndex = PRIORITIES.indexOf(task.priority);
        const nextPriority = PRIORITIES[(currentIndex + 1) % PRIORITIES.length];
        updateTask(task.id, { priority: nextPriority });
    }, [task.id, task.priority, updateTask]);

    const handleDelete = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        deleteTask(task.id);
    }, [task.id, deleteTask]);

    const subjectStyle = useMemo(() => {
        if (!subject?.colorToken) return undefined;
        const color = getSubjectColor(subject.colorToken);
        return {
            color: color.accent,
            backgroundColor: `rgba(${color.primary_rgb}, 0.1)`,
            borderColor: `rgba(${color.primary_rgb}, 0.2)`
        };
    }, [subject?.colorToken]);

    if (isDragging && !isOverlay) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="bg-white/[0.02] border-2 border-dashed border-white/10 rounded-[24px] h-[100px] shadow-inner cursor-grabbing"
            />
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`mx-1 relative outline-none ${
                isOverlay
                    ? 'cursor-grabbing shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-white/[0.15]'
                    : 'cursor-grab active:cursor-grabbing'
            }`}
        >
            <div
                onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.dispatchEvent(
                        new CustomEvent('open-task-context-menu', {
                            detail: { x: e.clientX, y: e.clientY, task }
                        })
                    );
                }}
                onDoubleClick={(e) => {
                    if (!window.matchMedia('(max-width: 768px)').matches) {
                        e.stopPropagation();
                        setIsEditing(true);
                    }
                }}
                onMouseMove={handleMouseMove}
                className={`group bg-[#111115]/80 border border-white/[0.04] rounded-[16px] p-3.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_4px_16px_rgba(0,0,0,0.5)] hover:border-white/[0.1] hover:bg-[#111115]/90 hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-[20px] transition duration-300 flex flex-col gap-2 relative transform-gpu ${
                    isDragging ? 'shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-white/[0.15] opacity-100 scale-105 rotate-2' : ''
                }`}
            >
                {/* Il·luminació radial al cursor */}
                <motion.div
                    className="pointer-events-none absolute -inset-px rounded-[16px] opacity-0 transition duration-300 group-hover:opacity-100 z-0 max-md:hidden"
                    style={{ background: backgroundStyle }}
                />

                {isEditing ? (
                    <TaskCardEditForm
                        task={task}
                        allColumns={allColumns}
                        onSave={handleSave}
                        onCancel={() => setIsEditing(false)}
                    />
                ) : (
                    <>
                        <div className="flex justify-between items-start gap-2 pointer-events-none relative z-10">
                            <h4 className="text-[13px] font-semibold text-white/90 flex-1 leading-snug tracking-wide">
                                {task.title}
                            </h4>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 max-md:opacity-100 transition-opacity pointer-events-auto">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsEditing(true);
                                    }}
                                    className="text-slate-500 hover:text-white p-1 md:hidden"
                                    title={t('planner.boardView.editTask', 'Editar tasca')}
                                    aria-label="Editar tasca"
                                >
                                    <Pencil size={14} />
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="text-slate-500 hover:text-red-400 p-1"
                                    title={t('planner.boardView.deleteTask', 'Eliminar tasca')}
                                    aria-label="Eliminar tasca"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Barra de progrés i compte enrere aïllats */}
                        <TaskProgressBar
                            dueDate={task.dueDate}
                            startDate={task.startDate}
                            createdAt={task.createdAt}
                        />

                        {/* Pills inferiors d'acció ràpida */}
                        <div
                            className="flex items-center gap-1.5 mt-1 pointer-events-auto relative z-10"
                            onPointerDown={(e) => e.stopPropagation()}
                        >
                            {/* Canvi ràpid de prioritat */}
                            <button
                                type="button"
                                onClick={togglePriority}
                                className={`flex items-center justify-center w-6 h-6 md:w-5 md:h-5 rounded-md border transition-colors ${getPriorityStyle(task.priority)}`}
                                title={`Priority: ${task.priority}`}
                                aria-label="Marcar prioritat"
                            >
                                <Flag size={10} className={task.priority === 'HIGH' ? 'fill-current' : ''} />
                            </button>

                            {/* Pill de data */}
                            <button
                                type="button"
                                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-semibold tracking-widest uppercase border transition-colors ${
                                    formattedDueDate
                                        ? 'bg-white/[0.03] text-slate-300 border-white/[0.05] hover:bg-white/[0.08]'
                                        : 'bg-transparent text-slate-500 border-transparent hover:bg-white/5'
                                }`}
                                aria-label="Data límit"
                            >
                                <Calendar size={10} />
                                {formattedDueDate || t('planner.boardView.noDate', 'No date')}
                            </button>

                            {/* Etiqueta d'assignatura */}
                            <div className="ml-auto flex items-center gap-1.5">
                                {subject && (
                                    <span
                                        className="text-[9px] tracking-[0.1em] font-bold uppercase border px-2 py-0.5 rounded-md"
                                        style={subjectStyle}
                                    >
                                        {subject.name}
                                    </span>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
});

TaskCard.displayName = 'TaskCard';

export default TaskCard;
