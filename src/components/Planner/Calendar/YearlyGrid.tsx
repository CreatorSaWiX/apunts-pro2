import React, { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { format, getDay, getDaysInMonth, isSameDay } from 'date-fns';
import { ca } from 'date-fns/locale';
import { m as motion } from 'framer-motion';
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
            className="flex flex-col cursor-pointer group p-3 -m-3 rounded-2xl transition-all duration-500 hover:bg-[#151722] hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
        >
            <h3 
                className="text-lg font-bold text-slate-400 mb-2 capitalize transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/40"
            >
                {format(monthDate, 'MMM', { locale: ca })}
            </h3>
            
            <div className="grid grid-cols-7 gap-y-1.5 gap-x-0.5">
                {/* Blanks */}
                {blanksArray.map(b => (
                    <div key={`blank-${b}`} className="aspect-square"></div>
                ))}
                
                {/* Days */}
                {daysArray.map(day => {
                    const currentDayDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
                    const hasTasks = tasks.some(t => t.startDate && isSameDay(new Date(t.startDate), currentDayDate));
                    const isToday = isSameDay(currentDayDate, new Date());
                    
                    return (
                        <div key={day} className={`aspect-square flex items-center justify-center relative rounded-full transition-all duration-300 ${isToday ? 'bg-white text-slate-900 font-bold shadow-[0_0_10px_rgba(255,255,255,0.2)] scale-110' : hasTasks ? 'bg-white/10 text-white font-bold shadow-[inset_0_1px_3px_rgba(255,255,255,0.2)]' : 'text-slate-500 group-hover:text-slate-300'}`}>
                            <span className={`text-[11px] sm:text-[10px] z-10 ${isToday ? '' : 'opacity-90'}`}>{day}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const YearBlock: React.FC<{ year: number; tasks: Task[]; onSelectMonth: (date: Date) => void }> = ({ year, tasks, onSelectMonth }) => {
    const months = Array.from({ length: 12 }).map((_, i) => new Date(year, i, 1));
    
    return (
        <div id={`year-${year}`} className="flex flex-col mb-16 relative">
            {/* Year Header - Clean SOTY editorial style in the normal document flow for all screens */}
            <h2 
                className="text-[60px] sm:text-[80px] md:text-[100px] leading-none font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40 tracking-tighter mb-8 md:mb-12 pl-2 drop-shadow-lg"
            >
                {year}
            </h2>
            {/* Grid of Months */}
            <div className="relative z-10 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-10">
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
    );
};

const YearlyGrid: React.FC<YearlyGridProps> = ({ currentDate, tasks, onSelectMonth }) => {
    const [baseYear, setBaseYear] = useState(() => currentDate.getFullYear());
    const [visibleYear, setVisibleYear] = useState(() => currentDate.getFullYear());
    
    // Render 11 years (-5 to +5) for a massive scroll buffer
    const yearsToRender = Array.from({ length: 11 }).map((_, i) => baseYear + (i - 5));
    
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Initial scroll to center on load or when currentDate prop changes significantly
    useEffect(() => {
        setBaseYear(currentDate.getFullYear());
        setVisibleYear(currentDate.getFullYear());
        
        // Use a short timeout to ensure DOM has painted the years
        const timer = setTimeout(() => {
            if (scrollContainerRef.current) {
                const centerYearId = `year-${currentDate.getFullYear()}`;
                const centerYearEl = document.getElementById(centerYearId);
                if (centerYearEl) {
                    scrollContainerRef.current.scrollTop = centerYearEl.offsetTop - 60; // leave some space at top
                }
            }
        }, 50);
        return () => clearTimeout(timer);
    }, [currentDate]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;

        // Update visible year for mobile header
        const yearElements = yearsToRender.map(y => document.getElementById(`year-${y}`));
        let currentVisYear = visibleYear;
        for (const el of yearElements) {
            // If the element's top is roughly visible
            if (el && el.offsetTop <= target.scrollTop + 150) {
                currentVisYear = parseInt(el.id.replace('year-', ''));
            }
        }
        if (currentVisYear !== visibleYear) {
            setVisibleYear(currentVisYear);
        }

        // Infinite scroll logic
        // If scrolling near top (within ~3 years)
        if (target.scrollTop < 1500) {
            const pivotId = `year-${yearsToRender[5]}`; // center year
            const pivotEl = document.getElementById(pivotId);
            const oldOffset = pivotEl ? pivotEl.offsetTop : 0;
            
            flushSync(() => {
                setBaseYear(prev => prev - 2);
            });
            
            const newPivotEl = document.getElementById(pivotId);
            if (newPivotEl) {
                target.scrollTop += (newPivotEl.offsetTop - oldOffset);
            }
        }
        // If scrolling near bottom
        else if (target.scrollTop > target.scrollHeight - target.clientHeight - 1500) {
            const pivotId = `year-${yearsToRender[5]}`; // center year
            const pivotEl = document.getElementById(pivotId);
            const oldOffset = pivotEl ? pivotEl.offsetTop : 0;
            
            flushSync(() => {
                setBaseYear(prev => prev + 2);
            });
            
            const newPivotEl = document.getElementById(pivotId);
            if (newPivotEl) {
                target.scrollTop += (newPivotEl.offsetTop - oldOffset);
            }
        }
    };

    return (
        <div className="flex flex-col h-full relative">

            <div 
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="absolute -top-32 bottom-0 left-0 right-0 overflow-y-auto px-4 md:px-8 pt-32 pb-16 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
                {yearsToRender.map(year => (
                    <YearBlock 
                        key={year} 
                        year={year} 
                        tasks={tasks} 
                        onSelectMonth={onSelectMonth} 
                    />
                ))}
            </div>
        </div>
    );
};

export default YearlyGrid;
