import React, { useState, useEffect, useRef } from 'react';
import { flushSync, createPortal } from 'react-dom';
import { useDroppable } from '@dnd-kit/core';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isToday, isSameDay, addMonths, subMonths } from 'date-fns';
import { ca } from 'date-fns/locale';
import type { Task } from '../../../types/tasks';
import { m as motion } from 'framer-motion';
import { useTasks } from '../../../contexts/TasksContext';
import NavigationPill from '../../ui/NavigationPill';

interface MonthlyGridProps {
    currentDate: Date;
    tasks: Task[];
    onSelectDay?: (date: Date) => void;
}

const DayCell: React.FC<{ day: Date; isCurrentMonth: boolean; tasks: Task[]; onSelectDay?: (date: Date) => void }> = ({ day, isCurrentMonth, tasks, onSelectDay }) => {
    const { addTask, subjects } = useTasks();
    const dateStr = format(day, 'yyyy-MM-dd');
    
    const { setNodeRef, isOver } = useDroppable({
        id: dateStr,
        data: { type: 'DateCell', date: dateStr }
    });

    const handleDoubleClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const startDate = new Date(day.setHours(12, 0, 0, 0));
        const estimatedMinutes = 60;
        const dueDate = new Date(startDate.getTime() + estimatedMinutes * 60000);

        const id = await addTask({
            title: '',
            status: 'TODO',
            priority: 'LOW',
            dueDate: dueDate.toISOString(),
            startDate: startDate.toISOString(),
            estimatedMinutes
        });
        window.dispatchEvent(new CustomEvent('open-task-popover', { detail: { x: e.clientX, y: e.clientY, taskId: id } }));
    };

    const handleClick = (e: React.MouseEvent) => {
        if (onSelectDay) {
            onSelectDay(day);
        }
    };

    return (
        <div 
            ref={setNodeRef}
            onDoubleClick={handleDoubleClick}
            onClick={handleClick}
            className={`group relative flex flex-col min-h-[90px] md:min-h-[120px] p-1 sm:p-1.5 transition-colors duration-300 border-r border-b border-white/[0.03] 
                ${!isCurrentMonth ? 'opacity-40' : 'hover:bg-white/[0.02] cursor-pointer'}
                ${isOver ? 'bg-primary/10 border-primary/30 z-20' : ''}
            `}
        >
            <div className="flex justify-end items-start mb-0.5 relative z-10">
                <span className={`text-[12px] md:text-[13px] font-medium w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full transition-all duration-300 ${isToday(day) ? 'bg-white text-slate-900 font-bold shadow-[0_0_10px_rgba(255,255,255,0.2)]' : 'text-slate-300 group-hover:text-white'}`}>
                    {format(day, 'd')}
                </span>
            </div>
            
            <div className="flex flex-col gap-1 overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative z-10">
                {tasks.map(task => {
                    const startDate = task.startDate ? new Date(task.startDate) : new Date();
                    const taskSubject = subjects.find(s => s.id === task.subjectId);
                    
                    let dotColor = 'bg-slate-400';
                    if (taskSubject) {
                        dotColor = `bg-${taskSubject.colorToken}`;
                    } else if (task.priority === 'HIGH') {
                        dotColor = 'bg-red-400';
                    } else if (task.priority === 'MEDIUM') {
                        dotColor = 'bg-amber-400';
                    }

                    return (
                        <div 
                            key={task.id} 
                            onContextMenu={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                window.dispatchEvent(new CustomEvent('open-task-context-menu', { detail: { x: e.clientX, y: e.clientY, task } }));
                            }}
                            onClick={(e) => {
                                if (window.innerWidth < 768) {
                                    return; // Allow bubbling to DayCell onClick to open the daily view
                                }
                                e.stopPropagation();
                                window.dispatchEvent(new CustomEvent('open-task-popover', { detail: { x: e.clientX, y: e.clientY, taskId: task.id } }));
                            }}
                            className="flex items-center gap-1.5 px-1.5 py-0.5 rounded hover:bg-white/[0.05] transition-colors cursor-default"
                        >
                            <div className={`w-1.5 h-1.5 rounded-full ${dotColor} shrink-0`} />
                            <span className="text-[10px] sm:text-[11px] font-medium truncate flex-1 leading-tight tracking-tight text-slate-300">{task.title}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const MonthBlock: React.FC<{ monthDate: Date; tasks: Task[]; onSelectDay?: (date: Date) => void }> = ({ monthDate, tasks, onSelectDay }) => {
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const monthId = format(monthDate, 'yyyy-MM');

    return (
        <div className="flex flex-col mb-8 relative w-full pt-4">
            <h3 className="text-[22px] md:text-[32px] font-bold text-white tracking-tight capitalize mb-2 px-3">
                {format(monthDate, 'MMMM yyyy', { locale: ca })}
            </h3>
            <div className="grid grid-cols-7 w-full border-t border-l border-white/[0.03]">
                {days.map(day => {
                    const dayTasks = tasks.filter(t => t.startDate && isSameDay(new Date(t.startDate), day));
                    return (
                        <DayCell 
                            key={day.toISOString()} 
                            day={day} 
                            isCurrentMonth={isSameMonth(day, monthStart)} 
                            tasks={dayTasks}
                            onSelectDay={onSelectDay}
                        />
                    );
                })}
            </div>
        </div>
    );
};

const MonthlyGrid: React.FC<MonthlyGridProps> = ({ currentDate, tasks, onSelectDay }) => {
    const weekDays = ['Dll', 'Dmt', 'Dmc', 'Djj', 'Dvv', 'Dss', 'Dmg'];
    
    const [baseDate, setBaseDate] = useState(() => startOfMonth(currentDate));
    
    // Render 21 months (-10 to +10) for a massive scroll buffer
    const monthsToRender = Array.from({ length: 21 }).map((_, i) => addMonths(baseDate, i - 10));
    
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Initial scroll to center on load or when currentDate prop changes significantly
    useEffect(() => {
        setBaseDate(startOfMonth(currentDate));
        
        // Use a short timeout to ensure DOM has painted the 21 months
        const timer = setTimeout(() => {
            if (scrollContainerRef.current) {
                const centerMonthId = `month-${format(startOfMonth(currentDate), 'yyyy-MM')}`;
                const centerMonthEl = document.getElementById(centerMonthId);
                if (centerMonthEl) {
                    scrollContainerRef.current.scrollTop = centerMonthEl.offsetTop - 60; // leave some space at top
                }
            }
        }, 50);
        return () => clearTimeout(timer);
    }, [currentDate]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;

        // If scrolling near top (within ~3 months)
        if (target.scrollTop < 2500) {
            const pivotId = `month-${format(monthsToRender[10], 'yyyy-MM')}`; // center month
            const pivotEl = document.getElementById(pivotId);
            const oldOffset = pivotEl ? pivotEl.offsetTop : 0;
            
            flushSync(() => {
                setBaseDate(prev => subMonths(prev, 3));
            });
            
            const newPivotEl = document.getElementById(pivotId);
            if (newPivotEl) {
                target.scrollTop += (newPivotEl.offsetTop - oldOffset);
            }
        }
        // If scrolling near bottom
        else if (target.scrollTop > target.scrollHeight - target.clientHeight - 2500) {
            const pivotId = `month-${format(monthsToRender[10], 'yyyy-MM')}`; // center month
            const pivotEl = document.getElementById(pivotId);
            const oldOffset = pivotEl ? pivotEl.offsetTop : 0;
            
            flushSync(() => {
                setBaseDate(prev => addMonths(prev, 3));
            });
            
            const newPivotEl = document.getElementById(pivotId);
            if (newPivotEl) {
                target.scrollTop += (newPivotEl.offsetTop - oldOffset);
            }
        }
    };

    return (
        <div className="flex flex-col h-full relative w-full">
            {/* Top-Left Navigation Pill Back Button */}
            {createPortal(
                <div className="md:hidden fixed top-5 left-4 z-[9999]">
                    <NavigationPill>
                        <button 
                            type="button"
                            onClick={() => window.dispatchEvent(new CustomEvent('planner-action', { detail: { action: 'plannerViewYear' } }))}
                            className="relative flex items-center justify-center w-11 h-11 transition-colors active:scale-95 text-white hover:text-primary"
                            aria-label="Tornar a la vista anual"
                        >
                            <svg className="w-5 h-5 pr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    </NavigationPill>
                </div>,
                document.body
            )}

            {/* Scroll Container */}
            <div 
                ref={scrollContainerRef} 
                onScroll={handleScroll}
                className="absolute -top-[88px] bottom-0 left-0 right-0 overflow-y-auto px-0 md:px-4 pt-[100px] pb-16 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
                {monthsToRender.map((monthDate) => (
                    <div key={monthDate.toISOString()} id={`month-${format(monthDate, 'yyyy-MM')}`}>
                        <MonthBlock monthDate={monthDate} tasks={tasks} onSelectDay={onSelectDay} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MonthlyGrid;
