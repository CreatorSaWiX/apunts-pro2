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
            className={`min-h-[120px] p-2 border-r border-b border-slate-700/30 transition-colors cursor-pointer hover:bg-slate-800/30
                ${!isCurrentMonth ? 'bg-slate-900/50 text-slate-600' : 'bg-transparent'}
                ${isOver ? 'bg-primary/20 ring-2 ring-primary inset-0 z-10' : ''}
            `}
        >
            <div className="flex justify-between items-start mb-2">
                <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday(day) ? 'bg-primary text-white' : ''}`}>
                    {format(day, 'd')}
                </span>
            </div>
            
            <div className="flex flex-col gap-1 overflow-y-auto max-h-[80px]">
                {tasks.map(task => (
                    <div 
                        key={task.id} 
                        className={`text-xs px-2 py-1 rounded border overflow-hidden text-ellipsis whitespace-nowrap
                            ${task.priority === 'HIGH' ? 'bg-red-500/20 border-red-500/30 text-red-300' : 
                              task.priority === 'MEDIUM' ? 'bg-amber-500/20 border-amber-500/30 text-amber-300' : 
                              'bg-slate-700 border-slate-600 text-slate-300'}
                        `}
                    >
                        {task.title}
                    </div>
                ))}
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
        <div className="flex flex-col h-full bg-slate-900 rounded-lg border border-slate-700/50 overflow-hidden">
            <div className="grid grid-cols-7 border-b border-slate-700/50 bg-slate-800/50">
                {weekDays.map(day => (
                    <div key={day} className="py-2 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider border-r border-slate-700/30 last:border-0">
                        {day}
                    </div>
                ))}
            </div>
            
            <div className="grid grid-cols-7 flex-1">
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
