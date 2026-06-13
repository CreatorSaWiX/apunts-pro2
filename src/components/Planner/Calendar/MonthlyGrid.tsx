import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isToday } from 'date-fns';
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

const MonthlyGrid: React.FC<MonthlyGridProps> = ({ currentDate, tasks }) => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Comença dilluns
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const weekDays = ['Dll', 'Dmt', 'Dmc', 'Djj', 'Dvv', 'Dss', 'Dmg'];

    return (
        <div className="flex flex-col h-full bg-slate-900/40 backdrop-blur-2xl rounded-[32px] border border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_10px_40px_rgba(0,0,0,0.4)] overflow-hidden">
            <div className="grid grid-cols-7 border-b border-white/5 bg-slate-900/60 shadow-sm">
                {weekDays.map(day => (
                    <div key={day} className="py-3 text-center text-[11px] font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 uppercase tracking-[0.2em] border-r border-white/5 last:border-0">
                        {day}
                    </div>
                ))}
            </div>
            
            <div className="grid grid-cols-7 flex-1 bg-white/[0.02]">
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

export default MonthlyGrid;
