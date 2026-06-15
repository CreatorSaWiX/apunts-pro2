import React, { useState, useEffect, useMemo } from 'react';
import { 
    DndContext, 
    DragOverlay, 
    closestCorners, 
    KeyboardSensor,
    PointerSensor,
    useSensor, 
    useSensors,
    type DragStartEvent, 
    type DragOverEvent
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useTasks } from '../../../contexts/TasksContext';
import BoardColumn from './BoardColumn';
import TaskCard from './TaskCard';
import type { Task, TaskStatus } from '../../../types/tasks';
import { createPortal } from 'react-dom';
import { Plus, X } from 'lucide-react';

const defaultColumns = [
    { id: 'TODO', title: 'TO DO', color: 'indigo-400' },
    { id: 'IN_PROGRESS', title: 'IN PROGRESS', color: 'fuchsia-400' },
    { id: 'COMPLETE', title: 'COMPLETE', color: 'emerald-400' }
];

const PRESET_COLORS = ['indigo-400', 'fuchsia-400', 'emerald-400', 'amber-400', 'rose-400', 'cyan-400'];


const BoardView: React.FC = () => {
    const { tasks: allTasks, updateTask, addTask, activeSubjectId } = useTasks();
    const tasks = useMemo(() => {
        if (!activeSubjectId) return allTasks;
        return allTasks.filter(t => t.subjectId === activeSubjectId);
    }, [allTasks, activeSubjectId]);
    const [localTasks, setLocalTasks] = useState(tasks);

    useEffect(() => {
        setLocalTasks(tasks);
    }, [tasks]);

    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [activeColumn, setActiveColumn] = useState<{id: string, title: string, color?: string} | null>(null);

    const [columns, setColumns] = useState<{id: string, title: string, color?: string}[]>(() => {
        const saved = localStorage.getItem('planner_columns');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { return defaultColumns; }
        }
        return defaultColumns;
    });

    const [isAddingColumn, setIsAddingColumn] = useState(false);
    const [newColumnName, setNewColumnName] = useState('');
    const [newColumnColor, setNewColumnColor] = useState(PRESET_COLORS[0]);

    useEffect(() => {
        localStorage.setItem('planner_columns', JSON.stringify(columns));
    }, [columns]);

    const handleAddColumn = () => {
        if (newColumnName.trim()) {
            const id = newColumnName.trim().toUpperCase().replace(/\s+/g, '_');
            if (!columns.find(c => c.id === id)) {
                setColumns([...columns, { id, title: newColumnName.trim(), color: newColumnColor }]);
            }
            setNewColumnName('');
            setNewColumnColor(PRESET_COLORS[0]);
            setIsAddingColumn(false);
        }
    };

    const updateColumn = (id: string, updates: Partial<{ title: string; color: string }>) => {
        setColumns(cols => cols.map(c => c.id === id ? { ...c, ...updates } : c));
    };

    const deleteColumn = (id: string) => {
        setColumns(cols => cols.filter(c => c.id !== id));
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
        
        if (active.data.current?.type === 'Column') {
            setActiveColumn(active.data.current.column);
            return;
        }

        const task = localTasks.find(t => t.id === active.id);
        if (task) {
            setActiveTask(task);
        }
    };

    const onDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        
        if (active.data.current?.type === 'Column') return;

        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isOverTask = over.data.current?.type === 'Task';
        const isOverColumn = over.data.current?.type === 'Column';

        setLocalTasks(prev => {
            const activeIndex = prev.findIndex(t => t.id === activeId);
            if (activeIndex === -1) return prev;
            
            const activeTask = prev[activeIndex];
            let newStatus = activeTask.status;

            if (isOverTask) {
                const overTask = prev.find(t => t.id === overId);
                if (overTask) newStatus = overTask.status;
            } else if (isOverColumn) {
                newStatus = overId as TaskStatus;
            }

            if (activeTask.status !== newStatus) {
                const newTasks = [...prev];
                newTasks[activeIndex] = { ...activeTask, status: newStatus as TaskStatus };
                
                if (isOverTask) {
                    const overIndex = newTasks.findIndex(t => t.id === overId);
                    return arrayMove(newTasks, activeIndex, overIndex);
                }
                return newTasks;
            }
            
            // Reorder within the same column during drag
            if (isOverTask && activeTask.status === newStatus) {
                const overIndex = prev.findIndex(t => t.id === overId);
                if (activeIndex !== overIndex) {
                    return arrayMove(prev, activeIndex, overIndex);
                }
            }

            return prev;
        });
    };

    const onDragEnd = (event: any) => {
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
                    return arrayMove(cols, oldIndex, newIndex);
                });
            }
            return;
        }

        if (activeTask) {
            const finalTask = localTasks.find(t => t.id === activeTask.id);
            if (finalTask && finalTask.status !== activeTask.status) {
                updateTask(activeTask.id, { status: finalTask.status });
            }
        }
        
        setActiveTask(null);
    };

    return (
        <div className="h-full flex overflow-x-auto overflow-y-hidden gap-8 px-8 pt-4 pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative z-10 w-full">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDragEnd={onDragEnd}
            >
                <SortableContext items={columns.map(c => c.id)} strategy={horizontalListSortingStrategy}>
                    {columns.map(col => (
                        <BoardColumn 
                            key={col.id} 
                            column={col} 
                            tasks={localTasks.filter(t => t.status === col.id)} 
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
                            onUpdateColumn={(updates) => updateColumn(col.id, updates)}
                            onDeleteColumn={() => deleteColumn(col.id)}
                        />
                    ))}
                </SortableContext>

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
                        <div className="bg-[#111115]/90 backdrop-blur-[40px] border border-white/[0.04] p-4 rounded-[24px] flex flex-col gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.02)]">
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full bg-${newColumnColor} shadow-[0_0_12px_currentColor] text-${newColumnColor} shrink-0`} />
                                <input
                                    autoFocus
                                    value={newColumnName}
                                    onChange={(e) => setNewColumnName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleAddColumn();
                                        if (e.key === 'Escape') setIsAddingColumn(false);
                                    }}
                                    placeholder="Nom de la llista..."
                                    className="bg-transparent text-slate-200 text-sm font-semibold flex-1 focus:outline-none placeholder:text-slate-600 tracking-wide"
                                />
                                <button onClick={() => setIsAddingColumn(false)} className="text-slate-500 hover:text-white transition-colors p-1"><X size={16} strokeWidth={2.5}/></button>
                            </div>
                            
                            <div className="flex gap-3 items-center justify-center py-1">
                                {PRESET_COLORS.map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setNewColumnColor(color)}
                                        className={`w-4 h-4 rounded-full transition-all duration-300 bg-${color} ${newColumnColor === color ? `scale-125 shadow-[0_0_12px_currentColor] text-${color} ring-1 ring-${color} ring-offset-2 ring-offset-[#111115]` : 'opacity-40 hover:opacity-100 hover:scale-110'}`}
                                    />
                                ))}
                            </div>

                            <button onClick={handleAddColumn} className="mt-2 bg-white/5 hover:bg-white/10 text-white text-[11px] font-bold uppercase tracking-wider py-2.5 rounded-[16px] transition-colors border border-white/5 hover:border-white/10 w-full">Crear Llista</button>
                        </div>
                    )}
                </div>

                {createPortal(
                    <DragOverlay dropAnimation={null}>
                        {activeTask ? <TaskCard task={activeTask} isOverlay={true} /> : null}
                        {activeColumn ? (
                            <div className="w-[350px] h-full bg-[#111115]/50 backdrop-blur border border-white/10 rounded-2xl ring-2 ring-primary/30 flex items-start justify-center pt-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                                <span className="font-bold text-sm tracking-widest uppercase text-white/50">{activeColumn.title}</span>
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
