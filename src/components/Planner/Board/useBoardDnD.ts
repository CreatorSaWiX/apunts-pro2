import { useState, useCallback } from 'react';
import {
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragStartEvent,
    type DragOverEvent,
    type DragEndEvent
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import type { Task, TaskStatus } from '../../../types/tasks';
import type { BoardColumnData } from './boardConstants';

interface UseBoardDnDProps {
    localTasks: Task[];
    setLocalTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    columns: BoardColumnData[];
    setColumns: React.Dispatch<React.SetStateAction<BoardColumnData[]>>;
    updateTask: (id: string, updates: Partial<Task>) => void;
}

export const useBoardDnD = ({
    localTasks,
    setLocalTasks,
    columns,
    setColumns,
    updateTask
}: UseBoardDnDProps) => {
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [activeColumn, setActiveColumn] = useState<BoardColumnData | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const onDragStart = useCallback((event: DragStartEvent) => {
        const { active } = event;

        if (active.data.current?.type === 'Column') {
            setActiveColumn(active.data.current.column);
            return;
        }

        const task = localTasks.find(taskItem => taskItem.id === active.id);
        if (task) {
            setActiveTask(task);
        }
    }, [localTasks]);

    const onDragOver = useCallback((event: DragOverEvent) => {
        const { active, over } = event;

        if (active.data.current?.type === 'Column') return;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isOverTask = over.data.current?.type === 'Task';
        const isOverColumn = over.data.current?.type === 'Column';

        setLocalTasks(prev => {
            const activeIndex = prev.findIndex(taskItem => taskItem.id === activeId);
            if (activeIndex === -1) return prev;

            const currentActiveTask = prev[activeIndex];
            let newStatus = currentActiveTask.status;

            if (isOverTask) {
                const overTask = prev.find(taskItem => taskItem.id === overId);
                if (overTask) newStatus = overTask.status;
            } else if (isOverColumn) {
                newStatus = overId as TaskStatus;
            }

            if (currentActiveTask.status !== newStatus) {
                const newTasks = [...prev];
                newTasks[activeIndex] = { ...currentActiveTask, status: newStatus as TaskStatus };

                if (isOverTask) {
                    const overIndex = newTasks.findIndex(taskItem => taskItem.id === overId);
                    return arrayMove(newTasks, activeIndex, overIndex);
                }
                return newTasks;
            }

            // Reordenament dins de la mateixa columna durant el drag
            if (isOverTask && currentActiveTask.status === newStatus) {
                const overIndex = prev.findIndex(taskItem => taskItem.id === overId);
                if (activeIndex !== overIndex) {
                    return arrayMove(prev, activeIndex, overIndex);
                }
            }

            return prev;
        });
    }, [setLocalTasks]);

    const onDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;

        if (active.data.current?.type === 'Column') {
            setActiveColumn(null);
            if (!over) return;
            const activeId = active.id as string;
            const overId = over.id as string;
            if (activeId !== overId) {
                setColumns(cols => {
                    const oldIndex = cols.findIndex(c => c.id === activeId);
                    const newIndex = cols.findIndex(c => c.id === overId);
                    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                        return arrayMove(cols, oldIndex, newIndex);
                    }
                    return cols;
                });
            }
            return;
        }

        if (activeTask) {
            const finalTask = localTasks.find(taskItem => taskItem.id === activeTask.id);
            if (finalTask && finalTask.status !== activeTask.status) {
                updateTask(activeTask.id, { status: finalTask.status });
            }
        }

        setActiveTask(null);
    }, [activeTask, localTasks, setColumns, updateTask]);

    return {
        sensors,
        activeTask,
        activeColumn,
        onDragStart,
        onDragOver,
        onDragEnd
    };
};
