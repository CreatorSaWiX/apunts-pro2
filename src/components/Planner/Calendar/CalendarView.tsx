import React, { useState, useRef } from 'react';
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
        const task = event.active.data.current?.task as Task | undefined;
        if (task) setActiveTask(task);
    };

    const onDragEnd = (event: DragEndEvent) => {
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
                        dueDate: task.dueDate,
                        startDate: newDate.toISOString(),
                        estimatedMinutes: task.estimatedMinutes,
                        source: task.source
                    });
                } else {
                    updateTask(task.id, { startDate: newDate.toISOString() });
                }
            }
        }
        setActiveTask(null);
    };

    const isSwiping = useRef(false);

    const handleWheel = (e: React.WheelEvent) => {
        // Ignore primarily vertical scrolling
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) return;
        
        if (isSwiping.current) return;
        
        if (Math.abs(e.deltaX) > 30) {
            isSwiping.current = true;
            if (e.deltaX > 0) {
                handleNext();
            } else {
                handlePrevious();
            }
            setTimeout(() => {
                isSwiping.current = false;
            }, 600); // 600ms debounce
        }
    };

    return (
        <div className="flex flex-col h-full relative w-full gap-4" onWheel={handleWheel}>
            {/* Grid Principal i Sidebar */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
            >
                <div className="flex flex-1 overflow-hidden gap-4">
                    {/* Contingut Principal */}
                    <div className="flex-1 overflow-hidden rounded-[32px] bg-slate-900/20 backdrop-blur-3xl border border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_10px_40px_rgba(0,0,0,0.4)]">
                        {/* Month/Year subtle header overlay */}
                        <div className="absolute top-4 left-6 z-10 pointer-events-none opacity-50">
                            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 tracking-tight drop-shadow-lg capitalize">
                                {mode === 'month' && format(currentDate, 'MMMM yyyy', { locale: ca })}
                                {mode === 'year' && format(currentDate, 'yyyy', { locale: ca })}
                                {mode === 'week' && `${format(currentDate, 'MMMM yyyy', { locale: ca })}`}
                            </h2>
                        </div>
                        {mode === 'month' && <MonthlyGrid currentDate={currentDate} tasks={tasks} />}
                        {mode === 'week' && <WeeklyGrid currentDate={currentDate} tasks={tasks} />}
                        {mode === 'year' && <YearlyGrid currentDate={currentDate} tasks={tasks} onSelectMonth={handleSelectMonth} />}
                    </div>

                    {/* Sidebar per tasques no planificades */}
                    <div className="w-[260px] flex-shrink-0 flex flex-col gap-4">
                        {/* Dynamic Island Mode Toggle */}
                        <div className="bg-slate-900/40 backdrop-blur-[40px] p-1.5 rounded-[24px] border border-white/[0.08] flex shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.4)] relative">
                            {(['week', 'month', 'year'] as CalendarMode[]).map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setMode(m)}
                                    className={`relative flex-1 py-2 text-[12px] font-bold tracking-widest uppercase transition-all duration-500 rounded-[20px] outline-none hover:scale-[1.02] active:scale-[0.98] ${
                                        mode === m ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                                    }`}
                                >
                                    {mode === m && (
                                        <motion.div
                                            layoutId="calendarMode"
                                            className="absolute inset-0 bg-white/10 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] rounded-[20px] z-0"
                                            transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                                        >
                                            <div className="absolute -bottom-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-70" />
                                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-4 bg-primary/20 blur-md rounded-full" />
                                        </motion.div>
                                    )}
                                    <span className="relative z-10">{m === 'week' ? 'Setm' : m === 'month' ? 'Mes' : 'Any'}</span>
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 bg-slate-900/50 backdrop-blur-2xl border border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_10px_40px_rgba(0,0,0,0.4)] rounded-[32px] p-4 flex flex-col gap-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            <h3 className="font-extrabold text-[12px] tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 uppercase px-1">No Planificades</h3>
                            <div className="flex flex-col gap-3 flex-1">
                                {tasks.filter(t => !t.startDate).map(task => (
                                    <TaskCard key={task.id} task={task} />
                                ))}
                                {tasks.filter(t => !t.startDate).length === 0 && (
                                    <div className="flex items-center justify-center flex-1">
                                        <p className="text-center text-slate-500 text-sm font-semibold tracking-wide">Totes les tasques estan planificades!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

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
