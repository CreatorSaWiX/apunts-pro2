import React, { useState, useLayoutEffect, useRef, useMemo, useCallback } from 'react';
import { flushSync } from 'react-dom';
import { format } from 'date-fns';
import type { Task } from '../../../types/tasks';

interface YearlyGridProps {
    currentDate: Date;
    tasks: Task[];
    onSelectMonth: (date: Date, clickEvent?: React.MouseEvent) => void;
}

interface MiniMonthProps {
    monthDate: Date;
    scheduledDatesSet: Set<string>;
    todayStr: string;
    onClick: (e: React.MouseEvent) => void;
}

const MONTH_NAMES_CA = ['gen.', 'febr.', 'març', 'abr.', 'maig', 'juny', 'jul.', 'ag.', 'set.', 'oct.', 'nov.', 'des.'];
const FULL_MONTH_NAMES_CA = [
    'gener', 'febrer', 'març', 'abril', 'maig', 'juny',
    'juliol', 'agost', 'setembre', 'octubre', 'novembre', 'desembre'
];

interface MonthMeta {
    daysInMonth: number;
    firstDayIndex: number;
    monthKey: string;
    monthName: string;
    fullMonthLabel: string;
    daysArray: number[];
    blanksArray: number[];
}

const monthMetaCache = new Map<string, MonthMeta>();

function getMonthMeta(year: number, month: number): MonthMeta {
    const key = `${year}-${month}`;
    const cached = monthMetaCache.get(key);
    if (cached) return cached;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dayOfWeek = new Date(year, month, 1).getDay(); // 0 for Sunday
    const firstDayIndex = (dayOfWeek + 6) % 7; // Monday = 0
    const mStr = month < 9 ? `0${month + 1}` : `${month + 1}`;
    const monthKey = `${year}-${mStr}`;
    const monthName = MONTH_NAMES_CA[month] || '';
    const fullMonthLabel = `${FULL_MONTH_NAMES_CA[month] || ''} ${year}`;
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanksArray = Array.from({ length: firstDayIndex }, (_, i) => i);

    const meta: MonthMeta = {
        daysInMonth,
        firstDayIndex,
        monthKey,
        monthName,
        fullMonthLabel,
        daysArray,
        blanksArray
    };
    monthMetaCache.set(key, meta);
    return meta;
}

const MiniMonth: React.FC<MiniMonthProps> = React.memo(({ 
    monthDate, 
    scheduledDatesSet, 
    todayStr, 
    onClick 
}) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const meta = getMonthMeta(year, month);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick(e as unknown as React.MouseEvent);
        }
    }, [onClick]);

    return (
        <div 
            role="button"
            tabIndex={0}
            aria-label={meta.fullMonthLabel}
            onClick={onClick}
            onKeyDown={handleKeyDown}
            className="flex flex-col cursor-pointer group p-2.5 -m-2.5 rounded-[24px] transition-colors duration-200 border border-transparent hover:bg-white/[0.05] hover:border-white/[0.08] hover:shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)_inset] hover:-translate-y-1.5 relative outline-none focus-visible:ring-2 focus-visible:ring-white/20"
        >
            <div className="absolute inset-0 overflow-hidden rounded-[24px] pointer-events-none">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out bg-[radial-gradient(120%_120%_at_50%_0%,_rgba(255,255,255,0.08)_0%,_transparent_100%)]" />
            </div>
            
            <h3 
                className="text-lg font-bold text-slate-400 mb-2 capitalize transition duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:text-white group-hover:translate-x-1 relative z-10"
            >
                {meta.monthName}
            </h3>
            
            <div className="grid grid-cols-7 gap-y-1.5 gap-x-0.5">
                {/* Blanks */}
                {meta.blanksArray.map(b => (
                    <div key={`blank-${b}`} className="aspect-square" aria-hidden="true" />
                ))}
                
                {/* Days */}
                {meta.daysArray.map(day => {
                    const dayStr = day < 10 ? `0${day}` : `${day}`;
                    const dateKey = `${meta.monthKey}-${dayStr}`;
                    const hasTasks = scheduledDatesSet.has(dateKey);
                    const isCurrentDay = dateKey === todayStr;
                    
                    return (
                        <div 
                            key={day} 
                            className={`aspect-square flex items-center justify-center relative rounded-full ${
                                isCurrentDay 
                                    ? 'bg-white text-slate-900 font-bold shadow-[0_0_10px_rgba(255,255,255,0.2)] scale-110' 
                                    : hasTasks 
                                        ? 'bg-white/10 text-white font-bold shadow-[inset_0_1px_3px_rgba(255,255,255,0.2)]' 
                                        : 'text-slate-500 group-hover:text-slate-300'
                            }`}
                        >
                            <span className={`text-[11px] sm:text-[10px] z-10 ${isCurrentDay ? '' : 'opacity-90'}`}>{day}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
});

MiniMonth.displayName = 'MiniMonth';

interface YearBlockProps {
    year: number;
    scheduledDatesSet: Set<string>;
    todayStr: string;
    onSelectMonth: (date: Date, clickEvent?: React.MouseEvent) => void;
}

const YearBlock: React.FC<YearBlockProps> = React.memo(({ 
    year, 
    scheduledDatesSet, 
    todayStr, 
    onSelectMonth 
}) => {
    const months = useMemo(() => Array.from({ length: 12 }, (_, i) => new Date(year, i, 1)), [year]);
    
    return (
        <div id={`year-${year}`} className="flex flex-col mb-16 relative">
            {/* Year Header - Clean SOTY editorial style in the normal document flow for all screens */}
            <h2 
                className="text-[60px] sm:text-[80px] md:text-[100px] leading-none font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40 tracking-tighter mb-8 md:mb-12 pl-2 drop-shadow-lg select-none"
            >
                {year}
            </h2>
            {/* Grid of Months */}
            <div className="relative z-10 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-10">
                {months.map(monthDate => (
                    <MiniMonth 
                        key={monthDate.toISOString()} 
                        monthDate={monthDate} 
                        scheduledDatesSet={scheduledDatesSet}
                        todayStr={todayStr}
                        onClick={(e) => onSelectMonth(monthDate, e)} 
                    />
                ))}
            </div>
        </div>
    );
});

YearBlock.displayName = 'YearBlock';

const YearlyGrid: React.FC<YearlyGridProps> = ({ currentDate, tasks, onSelectMonth }) => {
    const currentYear = currentDate.getFullYear();
    const [baseYear, setBaseYear] = useState(currentYear);
    
    // Conjunt Set<string> O(1) de dates amb tasques planificades ('yyyy-MM-dd')
    const scheduledDatesSet = useMemo(() => {
        const set = new Set<string>();
        for (let i = 0; i < tasks.length; i++) {
            const startDate = tasks[i].startDate;
            if (!startDate) continue;
            const d = new Date(startDate);
            if (isNaN(d.getTime())) continue;
            set.add(format(d, 'yyyy-MM-dd'));
        }
        return set;
    }, [tasks]);

    const todayStr = useMemo(() => format(new Date(), 'yyyy-MM-dd'), []);

    // Buffer constant de 5 anys (-2 a +2): càrrega instantània i zero re-renderitzats post-animació
    const yearsToRender = useMemo(() => {
        return [-2, -1, 0, 1, 2].map(offset => baseYear + offset);
    }, [baseYear]);
    
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const isProgrammaticScrollRef = useRef(false);

    // Centrat inicial en l'any seleccionat (sense cicles innecessaris)
    useLayoutEffect(() => {
        if (baseYear !== currentYear) {
            setBaseYear(currentYear);
        }
        if (scrollContainerRef.current) {
            const el = document.getElementById(`year-${currentYear}`);
            if (el) {
                isProgrammaticScrollRef.current = true;
                scrollContainerRef.current.scrollTop = el.offsetTop - 60;
                setTimeout(() => {
                    isProgrammaticScrollRef.current = false;
                }, 50);
            }
        }
    }, [currentYear]);

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        if (isProgrammaticScrollRef.current) return;
        const target = e.currentTarget;

        // Llindar segur a prop dels límits de la llista (250px)
        if (target.scrollTop < 250) {
            const pivotId = `year-${baseYear}`;
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
        else if (target.scrollTop > target.scrollHeight - target.clientHeight - 250) {
            const pivotId = `year-${baseYear}`;
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
    }, [baseYear]);

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
                        scheduledDatesSet={scheduledDatesSet}
                        todayStr={todayStr}
                        onSelectMonth={onSelectMonth} 
                    />
                ))}
            </div>
        </div>
    );
};

export default YearlyGrid;
