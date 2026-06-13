import React, { useState, useEffect } from 'react';
import { 
    DndContext, 
    DragOverlay, 
    closestCorners, 
    KeyboardSensor, 
    PointerSensor, 
    useSensor, 
    useSensors, 
    type DragStartEvent, 
    type DragOverEvent, 
    type DragEndEvent,
    defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useTasks } from '../../../contexts/TasksContext';
import BoardColumn from './BoardColumn';
import TaskCard from './TaskCard';
import type { Task, TaskStatus } from '../../../types/tasks';
import { useAltKey } from '../../../hooks/useAltKey';
import { createPortal } from 'react-dom';
import { Plus, X } from 'lucide-react';

const defaultColumns = [
    { id: 'TODO', title: 'TO DO' },
    { id: 'IN_PROGRESS', title: 'IN PROGRESS' },
    { id: 'COMPLETE', title: 'COMPLETE' }
];

const BoardView: React.FC = () => {
    const { tasks, updateTask, addTask } = useTasks();
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const isAltPressed = useAltKey();
    const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

    const [columns, setColumns] = useState<{id: string, title: string}[]>(() => {
        const saved = localStorage.getItem('planner_columns');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { return defaultColumns; }
        }
        return defaultColumns;
    });

    const [isAddingColumn, setIsAddingColumn] = useState(false);
    const [newColumnName, setNewColumnName] = useState('');

    useEffect(() => {
        localStorage.setItem('planner_columns', JSON.stringify(columns));
    }, [columns]);

    const handleAddColumn = () => {
        if (newColumnName.trim()) {
            const id = newColumnName.trim().toUpperCase().replace(/\s+/g, '_');
            if (!columns.find(c => c.id === id)) {
                setColumns([...columns, { id, title: newColumnName.trim() }]);
            }
            setNewColumnName('');
            setIsAddingColumn(false);
        }
    };

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

    const onDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const task = tasks.find(t => t.id === active.id);
        if (task) {
            setActiveTask(task);
            setDragOverColumn(task.status);
        }
    };

    const onDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isOverTask = over.data.current?.type === 'Task';
        const isOverColumn = over.data.current?.type === 'Column';

        let newStatus = dragOverColumn;

        if (isOverTask) {
            const overTaskObj = tasks.find(t => t.id === overId);
            if (overTaskObj) newStatus = overTaskObj.status;
        } else if (isOverColumn) {
            newStatus = overId as string;
        }

        if (newStatus && newStatus !== dragOverColumn) {
            setDragOverColumn(newStatus);
        }
    };

    const onDragEnd = (event: DragEndEvent) => {
        if (activeTask && dragOverColumn) {
            if (isAltPressed) {
                addTask({
                    title: `${activeTask.title} (Còpia)`,
                    description: activeTask.description,
                    status: dragOverColumn as TaskStatus,
                    priority: activeTask.priority,
                    dueDate: activeTask.dueDate,
                    startDate: activeTask.startDate,
                    estimatedMinutes: activeTask.estimatedMinutes,
                    source: activeTask.source
                });
            } else {
                if (activeTask.status !== dragOverColumn) {
                    updateTask(activeTask.id, { status: dragOverColumn as TaskStatus });
                }
            }
        }
        
        setActiveTask(null);
        setDragOverColumn(null);
    };

    return (
        <div className="h-full flex overflow-x-auto gap-5 px-1 pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative z-10 w-full">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDragEnd={onDragEnd}
            >
                {columns.map(col => (
                    <BoardColumn 
                        key={col.id} 
                        column={col} 
                        tasks={tasks.filter(t => t.status === col.id)} 
                        onAddTask={(taskData: Partial<Task> = {}) => {
                            addTask({
                                title: taskData.title || '',
                                status: col.id,
                                priority: taskData.priority || 'LOW',
                                dueDate: taskData.dueDate || null,
                                startDate: taskData.startDate || null,
                                estimatedMinutes: 60,
                                source: 'MANUAL'
                            });
                        }}
                    />
                ))}

                {/* Add Column UI */}
                <div className="flex-shrink-0 w-[350px] h-full">
                    {!isAddingColumn ? (
                        <button 
                            onClick={() => setIsAddingColumn(true)}
                            className="group flex flex-col items-center justify-center gap-3 text-slate-500 bg-white/[0.01] hover:bg-white/[0.03] border border-dashed border-white/10 hover:border-white/20 rounded-[32px] w-full h-[100px] transition-all duration-300 backdrop-blur-md"
                        >
                            <div className="bg-white/5 group-hover:bg-white/10 group-hover:scale-110 group-hover:text-white p-2.5 rounded-full transition-all duration-300">
                                <Plus size={20} strokeWidth={2.5} />
                            </div>
                            <span className="text-sm font-semibold tracking-wide transition-colors group-hover:text-white/80">Afegeix llista</span>
                        </button>
                    ) : (
                        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-5 rounded-[32px] flex flex-col gap-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                            <input
                                autoFocus
                                value={newColumnName}
                                onChange={(e) => setNewColumnName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleAddColumn();
                                    if (e.key === 'Escape') setIsAddingColumn(false);
                                }}
                                placeholder="Nom de la llista..."
                                className="bg-white/5 text-white text-sm font-medium px-4 py-3 rounded-2xl border border-white/10 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 w-full transition-colors placeholder:text-slate-500"
                            />
                            <div className="flex items-center gap-2">
                                <button onClick={handleAddColumn} className="bg-white text-black hover:bg-slate-200 text-sm font-bold px-4 py-2.5 rounded-xl flex-1 transition-colors">Afegir</button>
                                <button onClick={() => setIsAddingColumn(false)} className="bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white p-2.5 rounded-xl transition-colors"><X size={18} strokeWidth={2.5} /></button>
                            </div>
                        </div>
                    )}
                </div>

                {createPortal(
                    <DragOverlay dropAnimation={defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.4' } } })}>
                        {activeTask ? <TaskCard task={activeTask} /> : null}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>
        </div>
    );
};

export default BoardView;
