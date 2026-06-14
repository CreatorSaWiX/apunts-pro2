import React, { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { useDroppable } from '@dnd-kit/core';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isToday, addMonths, subMonths } from 'date-fns';
import { ca } from 'date-fns/locale';
import type { Task } from '../../../types/tasks';
import { useTasks } from '../../../contexts/TasksContext';

interface MonthlyGridProps {
    currentDate: Date;
    tasks: Task[];
}

const DayCell: React.FC<{ day: Date; isCurrentMonth: boolean; tasks: Task[] }> = ({ day, isCurrentMonth, tasks }) => {
    const { addTask } = useTasks();
    const dateStr = format(day, 'yyyy-MM-dd');
    
    const { setNodeRef, isOver } = useDroppable({
        id: dateStr,
        data: { type: 'DateCell', date: dateStr }
    });

    const handleDoubleClick = () => {
        addTask({
            title: 'Nova Tasca',
            status: 'TODO',
            priority: 'LOW',
            dueDate: null,
            startDate: new Date(day.setHours(12, 0, 0, 0)).toISOString(),
            estimatedMinutes: 60,
            source: 'MANUAL'
        });
    };

    return (
        <div 
            ref={setNodeRef}
            onDoubleClick={handleDoubleClick}
            className={`relative flex flex-col min-h-[140px] p-1.5 transition-colors border-r border-b border-white/5 
                ${!isCurrentMonth ? 'bg-slate-900/60 text-slate-600' : 'bg-transparent hover:bg-slate-800/40 cursor-pointer'}
                ${isOver ? 'bg-primary/20 border-primary/50 shadow-[inset_0_0_20px_rgba(var(--primary-rgb),0.3)] z-20' : ''}
            `}
        >
            <div className="flex justify-end items-start mb-1">
                <span className={`text-[12px] font-bold w-6 h-6 flex items-center justify-center rounded-full transition-all duration-300 ${isToday(day) ? 'bg-primary text-white shadow-[0_0_10px_rgba(var(--primary-rgb),0.8)]' : 'text-slate-400 hover:bg-white/10'}`}>
                    {format(day, 'd')}
                </span>
            </div>
            
            <div className="flex flex-col gap-[2px] overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {tasks.map(task => {
                    const startDate = task.startDate ? new Date(task.startDate) : new Date();
                    return (
                        <div 
                            key={task.id} 
                            onContextMenu={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                window.dispatchEvent(new CustomEvent('open-task-context-menu', { detail: { x: e.clientX, y: e.clientY, task } }));
                            }}
                            className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded transition-colors hover:bg-white/10 cursor-default group
                                ${task.priority === 'HIGH' ? 'text-red-300' : 
                                  task.priority === 'MEDIUM' ? 'text-amber-300' : 
                                  'text-slate-300'}
                            `}
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 group-hover:opacity-100 transition-opacity"></span>
                            <span className="text-[10px] font-bold opacity-60 tracking-wider">{format(startDate, 'HH:mm')}</span>
                            <span className="text-[11px] font-semibold truncate flex-1 leading-tight">{task.title}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const MonthBlock: React.FC<{ monthDate: Date; tasks: Task[] }> = ({ monthDate, tasks }) => {
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return (
        <div className="flex flex-col mb-12">
            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 tracking-tight drop-shadow-lg capitalize mb-4 px-2">
                {format(monthDate, 'MMMM yyyy', { locale: ca })}
            </h3>
            <div className="grid grid-cols-7 flex-1 bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden shadow-sm">
                {days.map(day => {
                    const dayTasks = tasks.filter(t => t.startDate && t.startDate.startsWith(format(day, 'yyyy-MM-dd')));
                    return (
                        <DayCell 
                            key={day.toISOString()} 
                            day={day} 
                            isCurrentMonth={isSameMonth(day, monthStart)} 
                            tasks={dayTasks}
                        />
                    );
                })}
            </div>
        </div>
    );
};

const MonthlyGrid: React.FC<MonthlyGridProps> = ({ currentDate, tasks }) => {
    const weekDays = ['Dll', 'Dmt', 'Dmc', 'Djj', 'Dvv', 'Dss', 'Dmg'];
    
    const [baseDate, setBaseDate] = useState(() => startOfMonth(currentDate));
    
    // Render 21 months (-10 to +10) for a massive scroll buffer
    const monthsToRender = Array.from({ length: 21 }).map((_, i) => addMonths(baseDate, i - 10));
    
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Initial scroll to center on load or when currentDate prop changes significantly
    useEffect(() => {
        setBaseDate(startOfMonth(currentDate));
        
        // Use a short timeout to ensure DOM has painted the 21 months
        setTimeout(() => {
            if (scrollContainerRef.current) {
                const centerMonthId = `month-${format(startOfMonth(currentDate), 'yyyy-MM')}`;
                const centerMonthEl = document.getElementById(centerMonthId);
                if (centerMonthEl) {
                    scrollContainerRef.current.scrollTop = centerMonthEl.offsetTop - 60; // leave some space at top
                }
            }
        }, 0);
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
        <div className="flex flex-col h-full overflow-hidden relative">
            <div className="grid grid-cols-7 border-b border-white/5 bg-slate-900/90 backdrop-blur-xl z-20 shadow-sm sticky top-0">
                {weekDays.map(day => (
                    <div key={day} className="py-3 text-center text-[11px] font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 uppercase tracking-[0.2em] border-r border-white/5 last:border-0">
                        {day}
                    </div>
                ))}
            </div>
            
            <div 
                ref={scrollContainerRef} 
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
                {monthsToRender.map((monthDate) => (
                    <div key={monthDate.toISOString()} id={`month-${format(monthDate, 'yyyy-MM')}`}>
                        <MonthBlock monthDate={monthDate} tasks={tasks} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MonthlyGrid;
