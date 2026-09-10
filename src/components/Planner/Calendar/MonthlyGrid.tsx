import React, { useState, useLayoutEffect, useRef, useMemo, useCallback } from 'react';
import { flushSync, createPortal } from 'react-dom';
import { useDroppable } from '@dnd-kit/core';
import { 
    startOfMonth, 
    endOfMonth, 
    startOfWeek, 
    endOfWeek, 
    eachDayOfInterval, 
    format, 
    isSameMonth, 
    isToday, 
    addMonths, 
    subMonths 
} from 'date-fns';
import { ca } from 'date-fns/locale';
import type { Task } from '../../../types/tasks';
import { useTasks } from '../../../contexts/TasksContext';
import NavigationPill from '../../ui/NavigationPill';
import { getSubjectColor } from '../../../stores/useSubjectStore';
import { 
    dispatchOpenTaskPopover, 
    dispatchOpenTaskContextMenu, 
    dispatchPlannerAction 
} from '../plannerEvents';

interface MonthlyGridProps {
    currentDate: Date;
    tasks: Task[];
    onSelectDay?: (date: Date, clickEvent?: React.MouseEvent) => void;
}

type SubjectColor = ReturnType<typeof getSubjectColor>;

const WEEK_DAYS = ['Dll', 'Dmt', 'Dmc', 'Djj', 'Dvv', 'Dss', 'Dmg'];
const EMPTY_TASKS: Task[] = [];

interface DayCellProps {
    day: Date;
    isCurrentMonth: boolean;
    tasks: Task[];
    subjectColorsMap: Map<string, SubjectColor>;
    onSelectDay?: (date: Date, clickEvent?: React.MouseEvent) => void;
}

const DayCell: React.FC<DayCellProps> = React.memo(({ 
    day, 
    isCurrentMonth, 
    tasks, 
    subjectColorsMap, 
    onSelectDay 
}) => {
    // Subscripció atòmica a l'acció estable d'afegir tasca (sense re-renderitzats)
    const addTask = useTasks(state => state.addTask);
    const dateStr = useMemo(() => format(day, 'yyyy-MM-dd'), [day]);
    
    const { setNodeRef, isOver } = useDroppable({
        id: dateStr,
        data: { type: 'DateCell', date: dateStr }
    });

    const handleDoubleClick = useCallback(async (e: React.MouseEvent) => {
        e.stopPropagation();
        // Clonant la data evitem mutar l'objecte `day` en memòria
        const startDate = new Date(day.getTime());
        startDate.setHours(12, 0, 0, 0);
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
        dispatchOpenTaskPopover({ x: e.clientX, y: e.clientY, taskId: id });
    }, [addTask, day]);

    const handleClick = useCallback((e: React.MouseEvent) => {
        if (onSelectDay) {
            onSelectDay(day, e);
        }
    }, [day, onSelectDay]);

    return (
        <div 
            ref={setNodeRef}
            role="gridcell"
            aria-label={`${format(day, 'd MMMM yyyy', { locale: ca })}${tasks.length > 0 ? `, ${tasks.length} tasques` : ''}`}
            onDoubleClick={handleDoubleClick}
            onClick={handleClick}
            className={`group relative flex flex-col min-h-[90px] md:min-h-[120px] p-1 sm:p-1.5 transition-colors duration-300 border-r border-b border-white/[0.03] 
                ${!isCurrentMonth ? 'opacity-40' : 'hover:bg-white/[0.02] cursor-pointer'}
                ${isOver ? 'bg-primary/10 border-primary/30 z-20' : ''}
            `}
        >
            <div className="flex justify-end items-start mb-0.5 relative z-10">
                <span className={`text-[12px] md:text-[13px] font-medium w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full transition-[transform,background-color,box-shadow,color] duration-300 ${
                    isToday(day) 
                        ? 'bg-white text-slate-900 font-bold shadow-[0_0_10px_rgba(255,255,255,0.2)]' 
                        : 'text-slate-300 group-hover:text-white'
                }`}>
                    {format(day, 'd')}
                </span>
            </div>
            
            <div className="flex flex-col gap-1 overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative z-10">
                {tasks.map(task => {
                    const subjectColor = task.subjectId ? subjectColorsMap.get(task.subjectId) : null;
                    
                    let dotColor = 'bg-slate-400';
                    if (!subjectColor) {
                        if (task.priority === 'HIGH') {
                            dotColor = 'bg-red-400';
                        } else if (task.priority === 'MEDIUM') {
                            dotColor = 'bg-amber-400';
                        }
                    }

                    return (
                        <div 
                            key={task.id} 
                            onContextMenu={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                dispatchOpenTaskContextMenu({ x: e.clientX, y: e.clientY, task });
                            }}
                            onClick={(e) => {
                                if (window.innerWidth < 768) {
                                    return; // Deixa bombollejar a DayCell onClick per obrir la vista setmanal
                                }
                                e.stopPropagation();
                                dispatchOpenTaskPopover({ x: e.clientX, y: e.clientY, taskId: task.id });
                            }}
                            className="flex items-center gap-1.5 px-1.5 py-0.5 rounded hover:bg-white/[0.05] transition-colors cursor-default"
                        >
                            <div 
                                className={`w-1.5 h-1.5 rounded-full ${!subjectColor ? dotColor : ''} shrink-0`} 
                                style={subjectColor ? { backgroundColor: subjectColor.primary } : undefined}
                            />
                            <span className="text-[10px] sm:text-[11px] font-medium truncate flex-1 leading-tight tracking-tight text-slate-300">
                                {task.title || 'Nova Tasca'}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
});

DayCell.displayName = 'DayCell';

interface MonthBlockProps {
    monthDate: Date;
    tasksByDate: Map<string, Task[]>;
    subjectColorsMap: Map<string, SubjectColor>;
    onSelectDay?: (date: Date, clickEvent?: React.MouseEvent) => void;
}

const MonthBlock: React.FC<MonthBlockProps> = React.memo(({ 
    monthDate, 
    tasksByDate, 
    subjectColorsMap, 
    onSelectDay 
}) => {
    const monthStart = useMemo(() => startOfMonth(monthDate), [monthDate]);
    const days = useMemo(() => {
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
        const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
        return eachDayOfInterval({ start: startDate, end: endDate });
    }, [monthStart]);

    return (
        <div className="flex flex-col mb-8 relative w-full pt-4">
            <h3 className="text-[22px] md:text-[32px] font-bold text-white tracking-tight capitalize mb-2 px-3">
                {format(monthDate, 'MMMM yyyy', { locale: ca })}
            </h3>

            {/* Encapçalats dels dies de la setmana per a cada bloc mensual */}
            <div className="grid grid-cols-7 w-full mb-1 px-1" role="row">
                {WEEK_DAYS.map(day => (
                    <div 
                        key={day} 
                        role="columnheader"
                        className="text-right pr-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider"
                    >
                        {day}
                    </div>
                ))}
            </div>

            <div 
                role="grid"
                aria-label={format(monthDate, 'MMMM yyyy', { locale: ca })}
                className="grid grid-cols-7 w-full border-t border-l border-white/[0.03]"
            >
                {days.map(day => {
                    const dateKey = format(day, 'yyyy-MM-dd');
                    const dayTasks = tasksByDate.get(dateKey) || EMPTY_TASKS;
                    return (
                        <DayCell 
                            key={day.toISOString()} 
                            day={day} 
                            isCurrentMonth={isSameMonth(day, monthStart)} 
                            tasks={dayTasks}
                            subjectColorsMap={subjectColorsMap}
                            onSelectDay={onSelectDay}
                        />
                    );
                })}
            </div>
        </div>
    );
});

MonthBlock.displayName = 'MonthBlock';

const MonthlyGrid: React.FC<MonthlyGridProps> = ({ currentDate, tasks, onSelectDay }) => {
    const [baseDate, setBaseDate] = useState(() => startOfMonth(currentDate));
    const subjects = useTasks(state => state.subjects);

    // Mapa O(1) de colors d'assignatures per evitar subscripcions massives a DayCell
    const subjectColorsMap = useMemo(() => {
        const map = new Map<string, SubjectColor>();
        for (let i = 0; i < subjects.length; i++) {
            const s = subjects[i];
            map.set(s.id, getSubjectColor(s.colorToken));
        }
        return map;
    }, [subjects]);

    // Indexació O(T) de tasques per data ('yyyy-MM-dd') per evitar centenars de filtratges O(N*M)
    const tasksByDate = useMemo(() => {
        const map = new Map<string, Task[]>();
        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            if (!task.startDate) continue;
            const d = new Date(task.startDate);
            if (isNaN(d.getTime())) continue;
            const dateKey = format(d, 'yyyy-MM-dd');
            const list = map.get(dateKey);
            if (list) {
                list.push(task);
            } else {
                map.set(dateKey, [task]);
            }
        }
        return map;
    }, [tasks]);

    // Buffer constant de 7 mesos (-3 a +3): fluid, sense parpelleig i amb 67% menys de nodes DOM
    const monthsToRender = useMemo(() => {
        return [-3, -2, -1, 0, 1, 2, 3].map(i => addMonths(baseDate, i));
    }, [baseDate]);
    
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const isProgrammaticScrollRef = useRef(false);

    // Centrat inicial en el mes seleccionat
    useLayoutEffect(() => {
        const curStart = startOfMonth(currentDate);
        if (baseDate.getTime() !== curStart.getTime()) {
            setBaseDate(curStart);
        }
        if (scrollContainerRef.current) {
            const centerMonthId = `month-${format(curStart, 'yyyy-MM')}`;
            const centerMonthEl = document.getElementById(centerMonthId);
            if (centerMonthEl) {
                isProgrammaticScrollRef.current = true;
                scrollContainerRef.current.scrollTop = centerMonthEl.offsetTop - 60;
                setTimeout(() => {
                    isProgrammaticScrollRef.current = false;
                }, 50);
            }
        }
    }, [currentDate]);

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        if (isProgrammaticScrollRef.current) return;
        const target = e.currentTarget;

        // Llindar segur d'scroll continu (a 350px de la vora)
        if (target.scrollTop < 350) {
            const pivotId = `month-${format(baseDate, 'yyyy-MM')}`;
            const pivotEl = document.getElementById(pivotId);
            const oldOffset = pivotEl ? pivotEl.offsetTop : 0;
            
            flushSync(() => {
                setBaseDate(prev => subMonths(prev, 2));
            });
            
            const newPivotEl = document.getElementById(pivotId);
            if (newPivotEl) {
                target.scrollTop += (newPivotEl.offsetTop - oldOffset);
            }
        }
        else if (target.scrollTop > target.scrollHeight - target.clientHeight - 350) {
            const pivotId = `month-${format(baseDate, 'yyyy-MM')}`;
            const pivotEl = document.getElementById(pivotId);
            const oldOffset = pivotEl ? pivotEl.offsetTop : 0;
            
            flushSync(() => {
                setBaseDate(prev => addMonths(prev, 2));
            });
            
            const newPivotEl = document.getElementById(pivotId);
            if (newPivotEl) {
                target.scrollTop += (newPivotEl.offsetTop - oldOffset);
            }
        }
    }, [baseDate]);

    return (
        <div className="flex flex-col h-full relative w-full">
            {/* Botó flotant de retorn a la vista anual (només mòbil) */}
            {createPortal(
                <div className="md:hidden fixed top-5 left-4 z-[9999]">
                    <NavigationPill>
                        <button 
                            type="button"
                            onClick={() => dispatchPlannerAction('plannerViewYear')}
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

            {/* Contenidor amb scroll infinit suau */}
            <div 
                ref={scrollContainerRef} 
                onScroll={handleScroll}
                className="absolute -top-[88px] bottom-0 left-0 right-0 overflow-y-auto px-0 md:px-4 pt-[100px] pb-16 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
                {monthsToRender.map((monthDate) => (
                    <div key={monthDate.toISOString()} id={`month-${format(monthDate, 'yyyy-MM')}`}>
                        <MonthBlock 
                            monthDate={monthDate} 
                            tasksByDate={tasksByDate}
                            subjectColorsMap={subjectColorsMap}
                            onSelectDay={onSelectDay} 
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MonthlyGrid;
