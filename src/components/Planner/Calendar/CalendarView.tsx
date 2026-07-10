import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
import { createPortal } from 'react-dom';
import { useTasks } from '../../../contexts/TasksContext';
import type { Task } from '../../../types/tasks';
import { useAltKey } from '../../../hooks/useAltKey';
import MonthlyGrid from './MonthlyGrid';
import WeeklyGrid from './WeeklyGrid';
import YearlyGrid from './YearlyGrid';
import TaskCard from '../Board/TaskCard';
import UnscheduledDrawer from '../UnscheduledDrawer';
import { useTranslation } from 'react-i18next';

type CalendarMode = 'month' | 'week' | 'year';

const CalendarView: React.FC = () => {
    const { t } = useTranslation();
    const { tasks, updateTask, addTask } = useTasks();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [mode, setMode] = useState<CalendarMode>('week');
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const isAltPressed = useAltKey();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    const handleSelectMonth = (date: Date) => {
        setCurrentDate(date);
        setMode('month');
    };

    const onDragStart = (event: DragStartEvent) => {
        document.body.style.userSelect = 'none';
        const task = event.active.data.current?.task as Task | undefined;
        if (task) setActiveTask(task);
    };

    const onDragEnd = (event: DragEndEvent) => {
        document.body.style.userSelect = '';
        const { over, active } = event;
        const task = active.data.current?.task as Task | undefined;
        
        if (task && over) {
            const targetDateStr = String(over.id);
            const pieceOffsetMinutes = active.data.current?.pieceOffsetMinutes || 0;
            
            if (targetDateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
                const newDate = new Date(targetDateStr);

                if (mode === 'week') {
                    const translatedRect = active.rect.current.translated;
                    const overRect = over.rect;
                    
                    if (translatedRect && overRect) {
                        const relativeY = translatedRect.top - overRect.top;
                        let totalMinutes = Math.round(relativeY);
                        totalMinutes = Math.max(0, Math.round(totalMinutes / 5) * 5); // Snap 5 mins
                        
                        totalMinutes -= pieceOffsetMinutes;
                        
                        // setHours(0) handles negative minutes perfectly (e.g. going back to previous day)
                        newDate.setHours(0, totalMinutes, 0, 0);
                    } else {
                        newDate.setHours(task.startDate ? new Date(task.startDate).getHours() : 12, task.startDate ? new Date(task.startDate).getMinutes() : 0, 0, 0);
                    }
                } else {
                    if (task.startDate) {
                        const originalDate = new Date(task.startDate);
                        newDate.setHours(originalDate.getHours(), originalDate.getMinutes(), 0, 0);
                    } else {
                        newDate.setHours(12, 0, 0, 0);
                    }
                }

                if (isAltPressed) {
                    addTask({
                        title: `${task.title} (Còpia)`,
                        description: task.description,
                        status: task.status,
                        priority: task.priority,
                        dueDate: task.dueDate ? new Date(newDate.getTime() + (task.estimatedMinutes || 60) * 60000).toISOString() : null,
                        startDate: newDate.toISOString(),
                        estimatedMinutes: task.estimatedMinutes,
                        source: task.source
                    });
                } else {
                    const updates: Partial<Task> = { startDate: newDate.toISOString() };
                    if (task.dueDate) {
                        updates.dueDate = new Date(newDate.getTime() + (task.estimatedMinutes || 60) * 60000).toISOString();
                    }
                    updateTask(task.id, updates);
                }
            }
        }
        setActiveTask(null);
    };

    const unplannedTasks = tasks.filter(t => !t.startDate);

    return (
        <div className="flex flex-col h-full relative w-full gap-4">
            {/* Grid Principal i Sidebar */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
            >
                <div className="flex flex-1 overflow-hidden gap-4 relative">
                    {/* Floating View Toggle (iPad Dock style) */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
                        <div className="bg-slate-900/80 backdrop-blur-3xl p-1 rounded-full border border-white/10 flex shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                            {(['week', 'month', 'year'] as CalendarMode[]).map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setMode(m)}
                                    className={`relative px-5 py-1.5 text-[10px] font-extrabold tracking-widest uppercase transition-all duration-300 rounded-full outline-none hover:scale-105 active:scale-95 ${
                                        mode === m ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                                    }`}
                                >
                                    {mode === m && (
                                        <motion.div
                                            layoutId="calendarMode"
                                            className="absolute inset-0 bg-white/10 border border-white/10 rounded-full z-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_12px_rgba(255,255,255,0.05)]"
                                            transition={{ type: "spring", stiffness: 450, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10">{m === 'week' ? t('planner.calendarView.week', 'Setm') : m === 'month' ? t('planner.calendarView.month', 'Mes') : t('planner.calendarView.year', 'Any')}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Contingut Principal */}
                    <div className="flex-1 overflow-hidden relative">
                        {mode === 'month' && <MonthlyGrid currentDate={currentDate} tasks={tasks} />}
                        {mode === 'week' && <WeeklyGrid currentDate={currentDate} tasks={tasks} />}
                        {mode === 'year' && <YearlyGrid currentDate={currentDate} tasks={tasks} onSelectMonth={handleSelectMonth} />}
                    </div>
                </div>

                <UnscheduledDrawer tasks={unplannedTasks} />

                {createPortal(
                    <DragOverlay zIndex={1000} dropAnimation={null}>
                        {activeTask && mode !== 'week' ? (
                            <TaskCard task={activeTask} />
                        ) : null}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>
        </div>
    );
};

export default CalendarView;
