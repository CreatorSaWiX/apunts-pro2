import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
    DndContext,
    DragOverlay,
    closestCorners,
} from '@dnd-kit/core';
import {
    SortableContext,
    horizontalListSortingStrategy
} from '@dnd-kit/sortable';
import { useTasks } from '../../../contexts/TasksContext';
import { useShallow } from 'zustand/react/shallow';
import BoardColumn from './BoardColumn';
import TaskCard from './TaskCard';
import { AddColumnCard } from './AddColumnCard';
import { useBoardDnD } from './useBoardDnD';
import {
    DEFAULT_COLUMNS,
    type BoardColumnData,
    type ColumnColor
} from './boardConstants';
import type { Task } from '../../../types/tasks';

const EMPTY_TASKS: Task[] = [];


// Wrapper memoitzat que garanteix callbacks 100% estables per evitar renders innecessaris a les columnes
interface ColumnItemProps {
    column: BoardColumnData;
    allColumns: BoardColumnData[];
    tasks: Task[];
    onAddTask: (columnId: string, taskData?: Partial<Task>) => void;
    onUpdateColumn: (columnId: string, updates: Partial<{ title: string; color: string }>) => void;
    onDeleteColumn: (columnId: string) => void;
}

const BoardColumnItem: React.FC<ColumnItemProps> = React.memo(({
    column,
    allColumns,
    tasks,
    onAddTask,
    onUpdateColumn,
    onDeleteColumn
}) => {
    const handleAddTask = useCallback((taskData?: Partial<Task>) => {
        onAddTask(column.id, taskData);
    }, [column.id, onAddTask]);

    const handleUpdateColumn = useCallback((updates: Partial<{ title: string; color: string }>) => {
        onUpdateColumn(column.id, updates);
    }, [column.id, onUpdateColumn]);

    const handleDeleteColumn = useCallback(() => {
        onDeleteColumn(column.id);
    }, [column.id, onDeleteColumn]);

    return (
        <BoardColumn
            column={column}
            allColumns={allColumns}
            tasks={tasks}
            onAddTask={handleAddTask}
            onUpdateColumn={handleUpdateColumn}
            onDeleteColumn={handleDeleteColumn}
        />
    );
});

BoardColumnItem.displayName = 'BoardColumnItem';

const BoardView: React.FC = () => {
    const { filteredTasks: tasks, tasks: allTasks, updateTask, addTask, deleteTask } = useTasks(
        useShallow(state => ({
            filteredTasks: state.filteredTasks,
            tasks: state.tasks,
            updateTask: state.updateTask,
            addTask: state.addTask,
            deleteTask: state.deleteTask
        }))
    );

    const [localTasks, setLocalTasks] = useState<Task[]>(tasks);

    useEffect(() => {
        setLocalTasks(tasks);
    }, [tasks]);

    const [columns, setColumns] = useState<BoardColumnData[]>(() => {
        const saved = localStorage.getItem('planner_columns');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return DEFAULT_COLUMNS;
            }
        }
        return DEFAULT_COLUMNS;
    });

    useEffect(() => {
        localStorage.setItem('planner_columns', JSON.stringify(columns));
    }, [columns]);

    // Ref per desacoblar allTasks dels callbacks i mantenir referències 100% estables
    const allTasksRef = useRef(allTasks);
    allTasksRef.current = allTasks;

    // O(1) Pre-càlcul: agrupació de tasques per columna (només canvia quan canvien les tasques)
    const tasksByStatus = useMemo(() => {
        const mapping: Record<string, Task[]> = {};
        localTasks.forEach(taskItem => {
            if (mapping[taskItem.status]) {
                mapping[taskItem.status].push(taskItem);
            } else {
                mapping[taskItem.status] = [taskItem];
            }
        });
        return mapping;
    }, [localTasks]);

    // Hook modularitzat per a tota la màquina d'estats del Drag & Drop
    const {
        sensors,
        activeTask,
        activeColumn,
        onDragStart,
        onDragOver,
        onDragEnd
    } = useBoardDnD({
        localTasks,
        setLocalTasks,
        columns,
        setColumns,
        updateTask
    });

    // Callbacks estables per a les accions de columna
    const handleAddTask = useCallback((status: string, taskData: Partial<Task> = {}) => {
        addTask({
            title: taskData.title || '',
            status,
            priority: taskData.priority || 'LOW',
            dueDate: taskData.dueDate || null,
            startDate: taskData.startDate || null,
            estimatedMinutes: taskData.estimatedMinutes ?? 60,
            subjectId: taskData.subjectId
        });
    }, [addTask]);

    // setColumns és garantit com a referència estable per React useState
    const handleUpdateColumn = useCallback((id: string, updates: Partial<{ title: string; color: string }>) => {
        setColumns(cols => cols.map(c => (c.id === id ? { ...c, ...updates } : c)));
    }, [setColumns]);

    const handleDeleteColumn = useCallback((id: string) => {
        setColumns(cols => cols.filter(c => c.id !== id));
        const tasksToDelete = allTasksRef.current.filter(taskItem => taskItem.status === id);
        tasksToDelete.forEach(taskItem => deleteTask(taskItem.id));
    }, [deleteTask, setColumns]);

    const handleAddColumn = useCallback((title: string, color: ColumnColor) => {
        const id = typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : `col_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        setColumns(prev => [...prev, { id, title, color }]);
    }, []);

    const columnIds = useMemo(() => columns.map(c => c.id), [columns]);

    return (
        <div className="h-full flex overflow-x-auto overflow-y-hidden gap-8 px-4 md:px-8 pt-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative z-10 w-full max-md:snap-x max-md:snap-mandatory max-md:scroll-px-4">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDragEnd={onDragEnd}
            >
                <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
                    {columns.map(col => (
                        <BoardColumnItem
                            key={col.id}
                            column={col}
                            allColumns={columns}
                            tasks={tasksByStatus[col.id] ?? EMPTY_TASKS}
                            onAddTask={handleAddTask}
                            onUpdateColumn={handleUpdateColumn}
                            onDeleteColumn={handleDeleteColumn}
                        />
                    ))}
                </SortableContext>

                {/* Subcomponent aïllat per afegir noves columnes */}
                <AddColumnCard onAddColumn={handleAddColumn} />

                {createPortal(
                    <DragOverlay dropAnimation={null}>
                        {activeTask ? <TaskCard task={activeTask} isOverlay={true} /> : null}
                        {activeColumn ? (
                            <div className="w-[85vw] md:w-87.5 h-full bg-[#111115]/50 backdrop-blur border border-white/10 rounded-2xl ring-2 ring-primary/30 flex items-start justify-center pt-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                                <span className="font-bold text-sm tracking-widest uppercase text-white/50">
                                    {activeColumn.title}
                                </span>
                            </div>
                        ) : null}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>
        </div>
    );
};

export default BoardView;
