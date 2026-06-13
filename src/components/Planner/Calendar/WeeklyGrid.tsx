import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isToday } from 'date-fns';
import { ca } from 'date-fns/locale';
import type { Task } from '../../../types/tasks';
import { useTasks } from '../../../contexts/TasksContext';
import TaskCard from '../Board/TaskCard';

interface WeeklyGridProps {
    currentDate: Date;
    tasks: Task[];
}

const WeekDayColumn: React.FC<{ day: Date; tasks: Task[] }> = ({ day, tasks }) => {
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
            className={`flex flex-col flex-1 border-r border-slate-700/30 p-2 min-w-[200px] transition-colors
                ${isOver ? 'bg-primary/10 ring-2 ring-primary inset-0 z-10' : 'hover:bg-slate-800/30'}
                ${isToday(day) ? 'bg-slate-800/20' : ''}
            `}
        >
            <div className="flex flex-col items-center mb-4 pb-2 border-b border-slate-700/50">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{format(day, 'EEEE', { locale: ca })}</span>
                <span className={`text-xl font-bold mt-1 w-8 h-8 flex items-center justify-center rounded-full ${isToday(day) ? 'bg-primary text-white' : 'text-slate-200'}`}>
                    {format(day, 'd')}
                </span>
            </div>
            
            <div className="flex flex-col gap-2 overflow-y-auto flex-1">
                {tasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                ))}
            </div>
        </div>
    );
};

const WeeklyGrid: React.FC<WeeklyGridProps> = ({ currentDate, tasks }) => {
    const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
    const endDate = endOfWeek(currentDate, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return (
        <div className="flex h-full bg-slate-900 rounded-lg border border-slate-700/50 overflow-x-auto">
            {days.map(day => {
                const dayTasks = tasks.filter(t => t.startDate && t.startDate.startsWith(format(day, 'yyyy-MM-dd')));
                return (
                    <WeekDayColumn 
                        key={day.toISOString()} 
                        day={day} 
                        tasks={dayTasks}
                    />
                );
            })}
        </div>
    );
};

export default WeeklyGrid;
