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
            className="flex flex-col p-5 bg-slate-900/40 backdrop-blur-xl border-[0.5px] border-white/5 rounded-[24px] cursor-pointer hover:border-primary/30 hover:bg-slate-900/60 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(var(--primary-rgb),0.15)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-300 group overflow-hidden relative"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <h3 className="text-[15px] font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 capitalize mb-4 group-hover:from-primary group-hover:to-primary/60 transition-all tracking-wide drop-shadow-sm">
                {format(monthDate, 'MMMM', { locale: ca })}
            </h3>
            
            <div className="grid grid-cols-7 gap-1.5 relative z-10">
                {/* Weekday headers */}
                {['Dl', 'Dt', 'Dc', 'Dj', 'Dv', 'Ds', 'Dg'].map(day => (
                    <div key={day} className="text-[9px] font-bold text-center text-slate-500 uppercase tracking-wider">{day}</div>
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
                        <div key={day} className={`aspect-square flex items-center justify-center relative rounded-full transition-colors ${hasTasks ? 'bg-primary/10 text-primary font-bold' : 'text-slate-400'}`}>
                            <span className="text-[11px] z-10">{day}</span>
                            {hasTasks && (
                                <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.8)] rounded-full"></span>
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
        <div className="flex flex-col h-full overflow-hidden relative">
            <div className="flex-1 overflow-y-auto p-4 md:p-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {months.map(monthDate => (
                        <MiniMonth 
                            key={monthDate.toISOString()} 
                            monthDate={monthDate} 
                            tasks={tasks} 
                            onClick={() => onSelectMonth(monthDate)} 
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default YearlyGrid;
