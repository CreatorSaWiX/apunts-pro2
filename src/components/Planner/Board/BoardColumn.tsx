import React, { useMemo, useState, useCallback } from 'react';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';

import { useTasks } from '../../../contexts/TasksContext';
import ConfirmModal from '../../ui/modals/ConfirmModal';
import TaskCard from './TaskCard';
import { ColumnHeader } from './ColumnHeader';
import { ColumnDraftCard } from './ColumnDraftCard';
import type { Task } from '../../../types/tasks';

export interface BoardColumnProps {
    column: { id: string; title: string; color?: string };
    allColumns: { id: string; title: string; color?: string }[];
    tasks: Task[];
    onAddTask: (taskData?: Partial<Task>) => void;
    onUpdateColumn?: (updates: Partial<{ title: string; color: string }>) => void;
    onDeleteColumn?: () => void;
}

const BoardColumn: React.FC<BoardColumnProps> = React.memo(({
    column,
    allColumns,
    tasks,
    onAddTask,
    onUpdateColumn,
    onDeleteColumn
}) => {
    const { t } = useTranslation();
    const { deleteTask } = useTasks(useShallow(state => ({
        deleteTask: state.deleteTask
    })));

    const taskIds = useMemo(() => tasks.map(t => t.id), [tasks]);
    const [isDrafting, setIsDrafting] = useState(false);
    const [isClearModalOpen, setIsClearModalOpen] = useState(false);
    const [isDeleteColumnModalOpen, setIsDeleteColumnModalOpen] = useState(false);

    const { setNodeRef, isOver, transform, transition, attributes, listeners, isDragging } = useSortable({
        id: column.id,
        data: {
            type: 'Column',
            column
        }
    });

    const style = {
        transition,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 100 : 'auto',
    };

    const handleDoubleClickContainer = useCallback((e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            setIsDrafting(true);
        }
    }, []);

    const handleClearTasks = useCallback(() => {
        tasks.forEach(t => deleteTask(t.id));
    }, [tasks, deleteTask]);

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative flex flex-col flex-shrink-0 w-[85vw] max-md:snap-center md:w-87.5 h-full max-h-full transition-colors duration-300 ease-out group/col rounded-2xl ${
                isOver ? 'bg-white/[0.02] ring-1 ring-primary/30' : 'bg-transparent'
            }`}
            onDoubleClick={handleDoubleClickContainer}
        >
            {/* Capçalera modularitzada */}
            <ColumnHeader
                column={column}
                taskCount={tasks.length}
                onUpdateColumn={onUpdateColumn}
                onOpenClearModal={() => setIsClearModalOpen(true)}
                onOpenDeleteModal={() => setIsDeleteColumnModalOpen(true)}
                onStartDrafting={() => setIsDrafting(true)}
                attributes={attributes}
                listeners={listeners}
            />

            {/* Zona de tasques droppable */}
            <div
                className="flex-1 overflow-y-auto overflow-x-visible flex flex-col gap-3 min-h-[150px] px-3 pb-8 pt-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                onDoubleClick={handleDoubleClickContainer}
            >
                <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                    {tasks.length === 0 && !isDrafting ? (
                        <div
                            onDoubleClick={(e) => {
                                e.stopPropagation();
                                setIsDrafting(true);
                            }}
                            className="flex flex-col items-center justify-center h-28 text-center cursor-pointer group rounded-xl mx-1 hover:bg-white/[0.02] transition-colors border border-dashed border-white/[0.05] hover:border-white/[0.1]"
                        >
                            <p className="text-xs font-semibold tracking-wide text-slate-500 group-hover:text-slate-400 transition-colors pointer-events-none">
                                {t('planner.boardView.doubleClickToAdd', 'Fes doble clic per afegir')}
                            </p>
                        </div>
                    ) : (
                        tasks.map(task => (
                            <TaskCard key={task.id} task={task} allColumns={allColumns} />
                        ))
                    )}
                </SortableContext>

                {/* Formulari d'alta ràpida de tasca (Draft) aïllat */}
                <AnimatePresence>
                    {isDrafting && (
                        <ColumnDraftCard
                            columnId={column.id}
                            onAddTask={onAddTask}
                            onCancel={() => setIsDrafting(false)}
                        />
                    )}
                </AnimatePresence>

                {/* Àrea interactiva inferior per agafar clic o doble clic */}
                {tasks.length > 0 && !isDrafting && (
                    <div
                        onClick={(e) => {
                            if (window.matchMedia('(max-width: 768px)').matches) {
                                e.stopPropagation();
                                setIsDrafting(true);
                            }
                        }}
                        onDoubleClick={(e) => {
                            if (!window.matchMedia('(max-width: 768px)').matches) {
                                e.stopPropagation();
                                setIsDrafting(true);
                            }
                        }}
                        className="flex-1 min-h-[60px] cursor-pointer rounded-[32px] max-md:opacity-50 md:opacity-0 md:hover:opacity-100 hover:bg-white/[0.03] flex items-center justify-center transition mt-2 border border-transparent hover:border-white/5"
                        title={t('planner.boardView.doubleClickHint', 'Doble clic per afegir tasca')}
                    >
                        <Plus size={20} className="text-slate-500" />
                    </div>
                )}
            </div>

            {/* Modals de confirmació d'accions destructives */}
            <ConfirmModal
                isOpen={isClearModalOpen}
                onClose={() => setIsClearModalOpen(false)}
                onConfirm={handleClearTasks}
                title={t('planner.boardView.clearList', 'Buidar llista')}
                message={t('planner.boardView.clearConfirm', "Segur que vols eliminar TOTES les tasques d'aquesta llista?")}
                confirmText={t('common.delete', 'Eliminar')}
                isDestructive={true}
            />
            <ConfirmModal
                isOpen={isDeleteColumnModalOpen}
                onClose={() => setIsDeleteColumnModalOpen(false)}
                onConfirm={() => onDeleteColumn?.()}
                title={t('planner.boardView.deleteList', 'Eliminar llista')}
                message={t('planner.boardView.deleteListConfirm', 'Segur que vols eliminar aquesta llista i totes les seves tasques?')}
                confirmText={t('common.delete', 'Eliminar')}
                isDestructive={true}
            />
        </div>
    );
});

BoardColumn.displayName = 'BoardColumn';

export default BoardColumn;
