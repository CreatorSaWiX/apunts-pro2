import React, { useState } from 'react';
import { 
    DndContext, 
    DragOverlay, 
    closestCorners, 
    PointerSensor, 
    useSensor, 
    useSensors, 
    type DragStartEvent, 
    type DragEndEvent
} from '@dnd-kit/core';
import { format, addMonths, subMonths, addWeeks, subWeeks, addYears, subYears } from 'date-fns';
import { ca } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useTasks } from '../../../contexts/TasksContext';
import type { Task } from '../../../types/tasks';
import { useAltKey } from '../../../hooks/useAltKey';
import MonthlyGrid from './MonthlyGrid';
import WeeklyGrid from './WeeklyGrid';
import YearlyGrid from './YearlyGrid';
import TaskCard from '../Board/TaskCard';

type CalendarMode = 'month' | 'week' | 'year';

const CalendarView: React.FC = () => {
    const { tasks, updateTask, addTask } = useTasks();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [mode, setMode] = useState<CalendarMode>('month');
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const isAltPressed = useAltKey();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    const handlePrevious = () => {
        if (mode === 'month') setCurrentDate(prev => subMonths(prev, 1));
        if (mode === 'week') setCurrentDate(prev => subWeeks(prev, 1));
        if (mode === 'year') setCurrentDate(prev => subYears(prev, 1));
    };

    const handleNext = () => {
        if (mode === 'month') setCurrentDate(prev => addMonths(prev, 1));
        if (mode === 'week') setCurrentDate(prev => addWeeks(prev, 1));
        if (mode === 'year') setCurrentDate(prev => addYears(prev, 1));
    };

    const handleSelectMonth = (date: Date) => {
        setCurrentDate(date);
        setMode('month');
    };

    const onDragStart = (event: DragStartEvent) => {
        const task = tasks.find(t => t.id === event.active.id);
        if (task) setActiveTask(task);
    };

    const onDragEnd = (event: DragEndEvent) => {
        const { over } = event;
        
        if (activeTask && over) {
            const targetDateStr = String(over.id);
            
            if (targetDateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
                const newDate = new Date(targetDateStr);
                newDate.setHours(12, 0, 0, 0);

                if (isAltPressed) {
                    addTask({
                        title: `${activeTask.title} (Còpia)`,
                        description: activeTask.description,
                        status: activeTask.status,
                        priority: activeTask.priority,
                        dueDate: activeTask.dueDate,
                        startDate: newDate.toISOString(),
                        estimatedMinutes: activeTask.estimatedMinutes,
                        source: activeTask.source
                    });
                } else {
                    updateTask(activeTask.id, { startDate: newDate.toISOString() });
                }
            }
        }
        setActiveTask(null);
    };

    return (
        <div className="flex flex-col h-full bg-slate-900 rounded-xl overflow-hidden">
            {/* Header del Calendari */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setCurrentDate(new Date())}
                        className="text-sm font-medium bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors border border-slate-600"
                    >
                        Avui
                    </button>
                    <div className="flex items-center gap-1">
                        <button onClick={handlePrevious} className="p-1 hover:bg-slate-800 rounded-md transition-colors"><ChevronLeft size={20} /></button>
                        <button onClick={handleNext} className="p-1 hover:bg-slate-800 rounded-md transition-colors"><ChevronRight size={20} /></button>
                    </div>
                    <h2 className="text-xl font-bold capitalize w-48">
                        {mode === 'month' && format(currentDate, 'MMMM yyyy', { locale: ca })}
                        {mode === 'year' && format(currentDate, 'yyyy', { locale: ca })}
                        {mode === 'week' && `Setmana ${format(currentDate, 'I', { locale: ca })}`}
                    </h2>
                </div>

                <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
                    <button onClick={() => setMode('week')} className={`px-3 py-1 text-sm rounded-md transition-colors ${mode === 'week' ? 'bg-primary/20 text-primary' : 'text-slate-400 hover:text-white'}`}>Setmana</button>
                    <button onClick={() => setMode('month')} className={`px-3 py-1 text-sm rounded-md transition-colors ${mode === 'month' ? 'bg-primary/20 text-primary' : 'text-slate-400 hover:text-white'}`}>Mes</button>
                    <button onClick={() => setMode('year')} className={`px-3 py-1 text-sm rounded-md transition-colors ${mode === 'year' ? 'bg-primary/20 text-primary' : 'text-slate-400 hover:text-white'}`}>Any</button>
                </div>
            </div>

            {/* Grid Principal i Sidebar */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
            >
                <div className="flex flex-1 overflow-hidden">
                    {/* Contingut Principal */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {mode === 'month' && <MonthlyGrid currentDate={currentDate} tasks={tasks} />}
                        {mode === 'week' && <WeeklyGrid currentDate={currentDate} tasks={tasks} />}
                        {mode === 'year' && <YearlyGrid currentDate={currentDate} tasks={tasks} onSelectMonth={handleSelectMonth} />}
                    </div>

                    {/* Sidebar per tasques no planificades */}
                    <div className="w-72 bg-slate-800/30 border-l border-slate-700/50 p-4 overflow-y-auto flex flex-col gap-3">
                        <h3 className="font-semibold text-sm text-slate-400 uppercase tracking-wider mb-2">No Planificades</h3>
                        {tasks.filter(t => !t.startDate).map(task => (
                            <TaskCard key={task.id} task={task} />
                        ))}
                    </div>
                </div>

                {createPortal(
                    <DragOverlay>
                        {activeTask ? <TaskCard task={activeTask} /> : null}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>
        </div>
    );
};

export default CalendarView;
