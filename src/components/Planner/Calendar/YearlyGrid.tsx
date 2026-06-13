import React from 'react';
import { format, eachMonthOfInterval, startOfYear, endOfYear, getDay, getDaysInMonth } from 'date-fns';
import { ca } from 'date-fns/locale';
import type { Task } from '../../../types/tasks';

interface YearlyGridProps {
    currentDate: Date;
    tasks: Task[];
    onSelectMonth: (date: Date) => void;
}

const MiniMonth: React.FC<{ monthDate: Date; tasks: Task[]; onClick: () => void }> = ({ monthDate, tasks, onClick }) => {
    const daysInMonth = getDaysInMonth(monthDate);
    // getDay returns 0 for Sunday. We want Monday=0
    let firstDayIndex = getDay(new Date(monthDate.getFullYear(), monthDate.getMonth(), 1)) - 1;
    if (firstDayIndex === -1) firstDayIndex = 6; // Sunday

    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanksArray = Array.from({ length: firstDayIndex }, (_, i) => i);

    return (
        <div 
            onClick={onClick}
            className="flex flex-col p-4 bg-slate-800/30 border border-slate-700/30 rounded-xl cursor-pointer hover:border-primary/50 hover:bg-slate-800/50 transition-all group"
        >
            <h3 className="text-sm font-bold text-slate-300 capitalize mb-3 group-hover:text-primary transition-colors">
                {format(monthDate, 'MMMM', { locale: ca })}
            </h3>
            
            <div className="grid grid-cols-7 gap-1">
                {/* Weekday headers */}
                {['dl', 'dt', 'dc', 'dj', 'dv', 'ds', 'dg'].map(day => (
                    <div key={day} className="text-[10px] text-center text-slate-500">{day}</div>
                ))}
                
                {/* Blanks */}
                {blanksArray.map(b => (
                    <div key={`blank-${b}`} className="aspect-square"></div>
                ))}
                
                {/* Days */}
                {daysArray.map(day => {
                    const dateStr = format(new Date(monthDate.getFullYear(), monthDate.getMonth(), day), 'yyyy-MM-dd');
                    const hasTasks = tasks.some(t => t.startDate && t.startDate.startsWith(dateStr));
                    
                    return (
                        <div key={day} className="aspect-square flex items-center justify-center relative">
                            <span className="text-[10px] text-slate-400">{day}</span>
                            {hasTasks && (
                                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const YearlyGrid: React.FC<YearlyGridProps> = ({ currentDate, tasks, onSelectMonth }) => {
    const start = startOfYear(currentDate);
    const end = endOfYear(currentDate);
    const months = eachMonthOfInterval({ start, end });

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-2">
            {months.map(monthDate => (
                <MiniMonth 
                    key={monthDate.toISOString()} 
                    monthDate={monthDate} 
                    tasks={tasks} 
                    onClick={() => onSelectMonth(monthDate)} 
                />
            ))}
        </div>
    );
};

export default YearlyGrid;
