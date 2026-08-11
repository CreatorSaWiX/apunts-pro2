import React, { useRef, useEffect, useLayoutEffect, useState, useMemo } from 'react';
import { flushSync, createPortal } from 'react-dom';
import { useDroppable, useDraggable, useDndContext } from '@dnd-kit/core';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isToday, addDays, subDays } from 'date-fns';
import { ca } from 'date-fns/locale';
import type { Task } from '../../../types/tasks';
import { m as motion } from 'framer-motion';
import { useTasks } from '../../../contexts/TasksContext';
import { useDuplicateModifier } from '../../../hooks/useDuplicateModifier';
import NavigationPill from '../../ui/NavigationPill';

interface WeeklyGridProps {
    currentDate: Date;
    tasks: Task[];
    deferBuffers?: boolean;
}

const ResizableTask: React.FC<{ task: Task; day: Date; updateTask: (id: string, updates: Partial<Task>) => void }> = ({ task, day, updateTask }) => {
    const { deleteTask } = useTasks();
    
    const taskStart = new Date(task.startDate!);
    const taskEnd = task.dueDate ? new Date(task.dueDate) : new Date(taskStart.getTime() + (task.estimatedMinutes || 60) * 60000);

    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(day);
    dayEnd.setHours(24, 0, 0, 0);

    const isContinuingFromPrev = taskStart < dayStart;
    const isContinuingToNext = taskEnd > dayEnd;

    const renderStart = isContinuingFromPrev ? dayStart : taskStart;
    const renderEnd = isContinuingToNext ? dayEnd : taskEnd;

    const top = (renderStart.getHours() * 60) + renderStart.getMinutes();
    const baseHeight = Math.max(15, (renderEnd.getTime() - renderStart.getTime()) / 60000);

    const pieceOffsetMinutes = isContinuingFromPrev ? (dayStart.getTime() - taskStart.getTime()) / 60000 : 0;

    const { attributes, listeners, setNodeRef, isDragging, transform } = useDraggable({
        id: `${task.id}::${format(day, 'yyyy-MM-dd')}`,
        data: { type: 'Task', task, pieceOffsetMinutes }
    });

    const [isResizing, setIsResizing] = React.useState<'top' | 'bottom' | null>(null);
    const [currentHeight, setCurrentHeight] = React.useState(baseHeight);
    const [currentTop, setCurrentTop] = React.useState(top);
    
    const [isSelected, setIsSelected] = React.useState(false);
    const taskRef = React.useRef<HTMLDivElement>(null);
    const isAltPressed = useDuplicateModifier();

    const dragStart = React.useRef({ y: 0, height: 0, top: 0 });

    React.useEffect(() => {
        if (!isResizing) {
            setCurrentHeight(baseHeight);
            setCurrentTop(top);
        }
    }, [task.estimatedMinutes, task.startDate, isResizing, day]);

    React.useEffect(() => {
        const handleGlobalClick = () => setIsSelected(false);
        const handlePlannerAction = (e: Event) => {
            if (!isSelected) return;
            const action = (e as CustomEvent).detail.action;
            
            if (action === 'plannerDeleteTask') {
                deleteTask(task.id);
            } else if (action === 'plannerEditTask') {
                const rect = taskRef.current?.getBoundingClientRect();
                window.dispatchEvent(new CustomEvent('open-task-popover', { detail: { x: rect ? rect.left + rect.width / 2 : window.innerWidth / 2, y: rect ? rect.top + rect.height / 2 : window.innerHeight / 2, taskId: task.id } }));
            } else if (action === 'plannerPriorityLow') {
                updateTask(task.id, { priority: 'LOW' });
            } else if (action === 'plannerPriorityMedium') {
                updateTask(task.id, { priority: 'MEDIUM' });
            } else if (action === 'plannerPriorityHigh') {
                updateTask(task.id, { priority: 'HIGH' });
            }
        };

        if (isSelected) {
            window.addEventListener('click', handleGlobalClick);
            window.addEventListener('planner-action', handlePlannerAction);
        }

        return () => {
            window.removeEventListener('click', handleGlobalClick);
            window.removeEventListener('planner-action', handlePlannerAction);
        };
    }, [isSelected, task.id, deleteTask]);

    React.useEffect(() => {
        const handleTaskSelected = (e: Event) => {
            const customEvent = e as CustomEvent;
            if (customEvent.detail === task.id) {
                setIsSelected(true);
            } else if (isSelected) {
                setIsSelected(false);
            }
        };

        window.addEventListener('task-selected', handleTaskSelected);
        return () => window.removeEventListener('task-selected', handleTaskSelected);
    }, [task.id, isSelected]);

    const handlePointerDown = (type: 'top' | 'bottom') => (e: React.PointerEvent) => {
        e.preventDefault(); // Això evita que l'input perdi el focus (onBlur)
        e.stopPropagation();
        setIsSelected(true);
        setIsResizing(type);
        dragStart.current = { y: e.clientY, height: currentHeight, top: currentTop };
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isResizing) return;
        e.stopPropagation();
        const deltaY = e.clientY - dragStart.current.y;
        
        if (isResizing === 'bottom') {
            const rawHeight = dragStart.current.height + deltaY;
            setCurrentHeight(Math.max(15, Math.round(rawHeight / 5) * 5));
        } else if (isResizing === 'top') {
            const rawTop = dragStart.current.top + deltaY;
            const snappedTop = Math.max(0, Math.round(rawTop / 5) * 5);
            const topDiff = snappedTop - dragStart.current.top;
            setCurrentTop(snappedTop);
            setCurrentHeight(Math.max(15, dragStart.current.height - topDiff));
        }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (!isResizing) return;
        e.stopPropagation();
        const action = isResizing;
        setIsResizing(null);
        e.currentTarget.releasePointerCapture(e.pointerId);
        
        const snappedTop = Math.round(currentTop / 5) * 5;
        const snappedMinutes = Math.max(15, Math.round(currentHeight / 5) * 5);
        
        const updates: Partial<Task> = {};
        
        if (action === 'top') {
            const newStartDate = new Date(dayStart);
            newStartDate.setHours(Math.floor(snappedTop / 60));
            newStartDate.setMinutes(snappedTop % 60);
            updates.startDate = newStartDate.toISOString();
            
            const timeDiff = newStartDate.getTime() - taskStart.getTime();
            updates.estimatedMinutes = Math.max(15, (task.estimatedMinutes || 60) - (timeDiff / 60000));
            if (task.dueDate) {
                updates.dueDate = new Date(newStartDate.getTime() + updates.estimatedMinutes * 60000).toISOString();
            }
        }
        
        if (action === 'bottom') {
            updates.estimatedMinutes = pieceOffsetMinutes + snappedMinutes;
            if (task.dueDate) {
                updates.dueDate = new Date(taskStart.getTime() + updates.estimatedMinutes * 60000).toISOString();
            }
        }

        if (Object.keys(updates).length > 0) {
            updateTask(task.id, updates);
        }
        
        setCurrentTop(snappedTop);
        setCurrentHeight(snappedMinutes);
    };

    const height = isResizing ? currentHeight : baseHeight;
    const layoutTop = isResizing ? currentTop : top;
    
    const snappedY = transform ? Math.round(transform.y / 5) * 5 : 0;
    const colWidth = taskRef.current?.parentElement?.offsetWidth || 0;
    const snappedX = transform && colWidth ? Math.round(transform.x / colWidth) * colWidth : 0;

    const visualTop = isResizing ? currentTop : isDragging ? Math.round((top + (transform?.y || 0)) / 5) * 5 : top;
    
    const endMinutes = Math.round(visualTop + height);
    const endH = Math.floor(endMinutes / 60);
    const endM = endMinutes % 60;
    const endTimeStr = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;
    const startMinutes = Math.round(visualTop);
    const startH = Math.floor(startMinutes / 60);
    const startM = startMinutes % 60;
    const startTimeStr = `${startH.toString().padStart(2, '0')}:${startM.toString().padStart(2, '0')}`;

    // Temps originals per a la còpia fantasma
    const origEndMinutes = Math.round(top + baseHeight);
    const origEndH = Math.floor(origEndMinutes / 60);
    const origEndM = origEndMinutes % 60;
    const origEndTimeStr = `${origEndH.toString().padStart(2, '0')}:${origEndM.toString().padStart(2, '0')}`;
    const origStartMinutes = Math.round(top);
    const origStartH = Math.floor(origStartMinutes / 60);
    const origStartM = origStartMinutes % 60;
    const origStartTimeStr = `${origStartH.toString().padStart(2, '0')}:${origStartM.toString().padStart(2, '0')}`;

    const radiusClass = isContinuingFromPrev && isContinuingToNext ? 'rounded-none border-y-0' 
        : isContinuingFromPrev ? 'rounded-b-md rounded-t-none border-t-0' 
        : isContinuingToNext ? 'rounded-t-md rounded-b-none border-b-0' 
        : 'rounded-md';

    const priorityColors = {
        HIGH: 'bg-red-500',
        MEDIUM: 'bg-amber-500',
        LOW: 'bg-primary'
    };
    
    const { subjects } = useTasks();
    const taskSubject = subjects.find(s => s.id === task.subjectId);
    
    // Si té assignatura utilitzem el seu color (ex: bg-fuchsia-400), sinó el de prioritat
    const accentColor = taskSubject ? `bg-${taskSubject.colorToken}` : (priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.LOW);

    return (
        <>
            {/* Còpia Fantasma quan es duplica amb Alt */}
            {isDragging && isAltPressed && (
                <div 
                    className={`absolute left-1 right-1 border overflow-hidden flex flex-col pointer-events-none
                        bg-slate-900/40 opacity-50 border-white/[0.03]
                        ${radiusClass}
                    `}
                    style={{
                        top: `${top}px`,
                        height: `${baseHeight}px`,
                        zIndex: 5
                    }}
                >
                    <div className={`absolute top-0 bottom-0 left-0 w-1 ${accentColor} shadow-[0_0_15px_currentColor] opacity-50`} />
                    <div className={`pl-3 pr-2 flex flex-col h-full overflow-hidden ${baseHeight < 40 ? 'py-0.5' : 'py-2'}`}>
                        {baseHeight >= 40 && (
                            <div className="flex items-center gap-1.5 opacity-40 mb-0.5 pr-4 shrink-0">
                                <span className="text-[9px] font-bold tracking-[0.1em] text-slate-300">{origStartTimeStr} - {origEndTimeStr}</span>
                            </div>
                        )}
                        <div className={`font-bold leading-tight text-slate-200/50 shrink-0 ${baseHeight < 30 ? 'text-[9px] truncate' : 'text-[12px] line-clamp-3'}`}>
                            {task.title || 'Nova Tasca'}
                        </div>
                    </div>
                </div>
            )}

            <div 
                ref={(node) => {
                setNodeRef(node);
                if (node) taskRef.current = node;
            }}
            {...attributes}
            {...listeners}
            onPointerDown={(e) => {
                listeners?.onPointerDown?.(e);
            }}
            onClick={(e) => {
                e.stopPropagation();
                if (isSelected) {
                    // Substitueix el doble-clic per a mòbils: un segon clic edita la tasca
                    window.dispatchEvent(new CustomEvent('open-task-popover', { detail: { x: e.clientX, y: e.clientY, taskId: task.id } }));
                    return;
                }
                setIsSelected(true);
                window.dispatchEvent(new CustomEvent('task-selected', { detail: task.id }));
            }}
            onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.dispatchEvent(new CustomEvent('open-task-context-menu', { detail: { x: e.clientX, y: e.clientY, task } }));
            }}
            onDoubleClick={(e) => {
                e.stopPropagation();
                window.dispatchEvent(new CustomEvent('open-task-popover', { detail: { x: e.clientX, y: e.clientY, taskId: task.id } }));
            }}
            className={`absolute left-1 right-1 border overflow-hidden backdrop-blur-xl flex flex-col group
                ${isDragging || isResizing ? '' : 'transition-[box-shadow,opacity,transform] duration-200'}
                bg-white/[0.02] hover:bg-white/[0.05] shadow-[inset_0_1px_3px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.3)] cursor-grab active:cursor-grabbing
                ${isSelected ? 'border-white/30 shadow-[inset_0_1px_3px_rgba(255,255,255,0.3),0_0_30px_rgba(255,255,255,0.1)]' : 'border-white/[0.05]'}
                ${isResizing ? 'z-30 shadow-[0_30px_60px_rgba(0,0,0,0.6)] opacity-95 scale-[1.03]' : 'hover:z-20 hover:shadow-[inset_0_1px_3px_rgba(255,255,255,0.2),0_15px_50px_rgba(0,0,0,0.5)]'}
                ${isDragging ? 'shadow-[0_30px_60px_rgba(0,0,0,0.6)] z-50 opacity-90 scale-[1.04] cursor-grabbing pointer-events-none' : ''}
                ${radiusClass}
            `}
            style={{
                top: `${layoutTop}px`,
                height: `${height}px`,
                zIndex: isResizing || isDragging || isSelected ? 30 : 10,
                ...(transform ? { transform: `translate3d(${snappedX}px, ${snappedY}px, 0)` } : {})
            }}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
        >
            {/* Subtle Gradient background matching accent color */}
            <div className={`absolute inset-0 opacity-[0.15] mix-blend-plus-lighter ${accentColor}`} />
            
            {/* Color Accent Indicator */}
            <div className={`absolute top-0 bottom-0 left-0 w-[3px] ${accentColor} shadow-[0_0_20px_currentColor] opacity-100`} />

            {/* Top Resize Handle */}
            {!isContinuingFromPrev && (
                <div 
                    className={`absolute top-0 left-0 right-0 h-5 max-md:h-10 max-md:-translate-y-2.5 cursor-ns-resize z-20 flex justify-center pt-[2px] md:pt-[3px] group/handle transition-colors ${isSelected ? 'bg-white/[0.05]' : 'hover:bg-white/[0.05]'}`}
                    style={{ touchAction: 'none' }}
                    onPointerDown={handlePointerDown('top')}
                >
                    <div className="w-6 h-[3px] bg-white/40 rounded-full group-hover/handle:bg-white/80 group-hover/handle:scale-x-150 transition duration-200" />
                </div>
            )}

            <div className={`pl-3 pr-2 flex flex-col h-full pointer-events-none select-none overflow-hidden ${height < 40 ? 'py-0.5' : 'py-2'}`}>
                {height >= 40 && (
                    <div className="flex items-center gap-1.5 opacity-60 mb-0.5 pr-4 shrink-0">
                        <span className="text-[9px] font-bold tracking-[0.1em] text-slate-300">{startTimeStr} - {endTimeStr}</span>
                    </div>
                )}
                
                <div 
                    className={`font-bold leading-tight text-slate-200 pointer-events-auto shrink-0 ${height < 30 ? 'text-[9px] truncate' : 'text-[12px] line-clamp-3'}`}
                >
                    {task.title || 'Nova Tasca'}
                </div>
            </div>

                {/* Bottom Resize Handle */}
                {!isContinuingToNext && (
                    <div 
                        className={`absolute bottom-0 left-0 right-0 h-5 max-md:h-10 max-md:translate-y-2.5 cursor-ns-resize z-20 flex justify-center pb-[2px] md:pb-[3px] items-end group/handle transition-colors ${isSelected ? 'bg-white/[0.05]' : 'hover:bg-white/[0.05]'}`}
                        style={{ touchAction: 'none' }}
                        onPointerDown={handlePointerDown('bottom')}
                    >
                        <div className="w-6 h-[3px] bg-white/40 rounded-full group-hover/handle:bg-white/80 group-hover/handle:scale-x-150 transition duration-200" />
                    </div>
                )}
            </div>
        </>
    );
};

const CurrentTimeLine = () => {
    const [now, setNow] = React.useState(new Date());
    
    React.useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(interval);
    }, []);

    const top = now.getHours() * 60 + now.getMinutes();

    return (
        <div 
            className="absolute left-14 right-0 z-20 pointer-events-none flex items-center transition-[top] duration-1000 ease-linear"
            style={{ top: `${top}px` }}
        >
            <div className="w-3 h-3 rounded-full bg-indigo-400 shadow-[0_0_20px_rgba(129,140,248,1),0_0_10px_rgba(255,255,255,0.8)] -ml-[5px] z-10 animate-pulse"></div>
            <div className="flex-1 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-transparent shadow-[0_0_10px_rgba(129,140,248,0.8)]"></div>
        </div>
    );
};

const TimeDayColumn: React.FC<{ day: Date; tasks: Task[] }> = ({ day, tasks }) => {
    const { addTask, updateTask } = useTasks();
    const dateStr = format(day, 'yyyy-MM-dd');
    
    const { setNodeRef, isOver } = useDroppable({
        id: dateStr,
        data: { type: 'DateCell', date: dateStr }
    });

    const handleDoubleClick = async (e: React.MouseEvent<HTMLDivElement>) => {
        // Obtenim posició del clic
        const bounds = e.currentTarget.getBoundingClientRect();
        const y = e.clientY - bounds.top;
        const hour = Math.floor(y / 60);
        const minute = Math.floor((y % 60) / 15) * 15; // Snap a quarts d'hora

        const newTaskDate = new Date(day);
        newTaskDate.setHours(hour, minute, 0, 0);
        const estimatedMinutes = 60;
        const dueDate = new Date(newTaskDate.getTime() + estimatedMinutes * 60000);

        const id = await addTask({
            title: '',
            status: 'TODO',
            priority: 'LOW',
            dueDate: dueDate.toISOString(),
            startDate: newTaskDate.toISOString(),
            estimatedMinutes
        });
        window.dispatchEvent(new CustomEvent('open-task-popover', { detail: { x: e.clientX, y: e.clientY, taskId: id } }));
    };

    return (
        <div 
            ref={setNodeRef}
            onDoubleClick={handleDoubleClick}
            className={`flex-1 border-r border-white/[0.03] last:border-0 relative transition-colors cursor-crosshair
                ${isOver ? 'bg-primary/5' : ''}
                ${isToday(day) ? 'bg-white/[0.015]' : ''}
            `}
        >
            {tasks.map(task => (
                <ResizableTask key={`${task.id}-${dateStr}`} task={task} day={day} updateTask={updateTask} />
            ))}
        </div>
    );
};

const WeeklyGrid: React.FC<WeeklyGridProps> = ({ currentDate, tasks, deferBuffers }) => {
    const { active } = useDndContext();
    const isDraggingContext = !!active;

    const [baseDate, setBaseDate] = useState(() => startOfWeek(currentDate, { weekStartsOn: 1 }));
    const [columnWidth, setColumnWidth] = useState(() => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth < 768) {
                return window.innerWidth - 56;
            } else {
                return Math.max(140, (window.innerWidth - 56) / 7);
            }
        }
        return 140;
    });

    const days = useMemo(() => {
        if (deferBuffers) {
            // During animation: 3 weeks (21 days) to prevent pop-in
            return eachDayOfInterval({ start: subDays(baseDate, 7), end: addDays(endOfWeek(baseDate, { weekStartsOn: 1 }), 7) });
        }
        // After animation: 9 weeks buffer for infinite scroll
        const startDate = subDays(baseDate, 28);
        const endDate = addDays(endOfWeek(baseDate, { weekStartsOn: 1 }), 28);
        return eachDayOfInterval({ start: startDate, end: endDate });
    }, [baseDate, deferBuffers]);
    
    // O(1) Pre-càlcul per agrupar tasques per dia i evitar el lag en el renderitzat
    const tasksByDay = useMemo(() => {
        const mapping: Record<string, typeof tasks> = {};
        days.forEach((day: Date) => {
            const dayStart = new Date(day);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(day);
            dayEnd.setHours(24, 0, 0, 0);
            mapping[day.toISOString()] = tasks.filter(t => {
                if (!t.startDate) return false;
                const start = new Date(t.startDate);
                const end = t.dueDate ? new Date(t.dueDate) : new Date(start.getTime() + (t.estimatedMinutes || 60) * 60000);
                return start < dayEnd && end > dayStart;
            });
        });
        return mapping;
    }, [days, tasks]);
    
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Track dynamic column width based on viewport
    useEffect(() => {
        const updateWidth = () => {
            if (scrollContainerRef.current) {
                if (window.innerWidth < 768) {
                    setColumnWidth(scrollContainerRef.current.clientWidth - 56);
                } else {
                    const width = Math.max(140, (scrollContainerRef.current.clientWidth - 56) / 7);
                    setColumnWidth(width);
                }
            }
        };
        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    // Auto-scroll to current time and current day on load, mode change, or buffer restoration
    useLayoutEffect(() => {
        setBaseDate(startOfWeek(currentDate, { weekStartsOn: 1 }));
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const clientWidth = container.clientWidth;
            const clientHeight = container.clientHeight;
            
            // Vertical scroll: center the current time
            const now = new Date();
            const currentMinutes = now.getHours() * 60 + now.getMinutes();
            container.scrollTop = Math.max(0, currentMinutes - clientHeight / 2);
            
            // Horizontal scroll: Target the current day accurately
            const isMobile = window.innerWidth < 768;
            const actualWidth = isMobile ? (clientWidth - 56) : Math.max(140, (clientWidth - 56) / 7);
            const dayOffset = (currentDate.getDay() + 6) % 7;
            const bufferOffset = deferBuffers ? 7 : 28;
            
            if (isMobile) {
                // Mòbil: scroll exacte a l'inici de la columna del dia (compensat pels 56px fixed)
                container.scrollLeft = (bufferOffset + dayOffset) * actualWidth;
            } else {
                // Desktop: centrar el dia a la pantalla
                container.scrollLeft = (bufferOffset + dayOffset) * actualWidth - (clientWidth - 56) / 2 + actualWidth / 2;
            }
        }
    }, [currentDate, deferBuffers]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (deferBuffers) return;
        const target = e.currentTarget;

        // If scrolled to within 14 columns of the left edge (2 full weeks buffer)
        if (target.scrollLeft < 14 * columnWidth) {
            flushSync(() => {
                setBaseDate(prev => subDays(prev, 7));
            });
            target.scrollLeft += 7 * columnWidth;
        } 
        // If scrolled to within 14 columns of the right edge (total width is 63 cols, max scrollLeft is 56. 56 - 14 = 42)
        else if (target.scrollLeft > 42 * columnWidth) {
            flushSync(() => {
                setBaseDate(prev => addDays(prev, 7));
            });
            target.scrollLeft -= 7 * columnWidth;
        }
    };

    return (
        <div className="flex flex-col h-full overflow-hidden relative">
            
            {/* Desktop Title Header eliminat per estalviar espai */}

            {/* Mobile Back (Fixed at Top Left via Portal to fix backdrop-blur bug) */}
            {createPortal(
                <div className="md:hidden fixed top-5 left-4 z-[9999]">
                    <NavigationPill>
                        <button 
                            type="button"
                            onClick={() => window.dispatchEvent(new CustomEvent('planner-action', { detail: { action: 'plannerViewMonth' } }))}
                            className="relative flex items-center justify-center w-11 h-11 transition-colors active:scale-95 text-white hover:text-primary"
                            aria-label="Tornar a la vista mensual"
                        >
                            <svg className="w-5 h-5 pr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    </NavigationPill>
                </div>,
                document.body
            )}

            {/* 2D Scrollable Area */}
            <div 
                ref={scrollContainerRef} 
                onScroll={handleScroll}
                className={`flex-1 overflow-y-auto overflow-x-auto relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] max-md:scroll-pl-14
                    ${!isDraggingContext ? 'max-md:snap-x max-md:snap-mandatory' : ''}
                `}
            >
                <div className="flex flex-col min-w-max">
                    
                    {/* Header Dies (Sticky Top) */}
                    <div className="flex border-b border-white/[0.05] bg-[#0f111a]/80 backdrop-blur-3xl z-40 shadow-[0_10px_30px_rgba(0,0,0,0.3)] sticky top-0">
                        
                        {/* Top-Left Corner (Sticky Top + Left) amb el nom del mes! */}
                        <div className="w-14 flex-shrink-0 border-r border-white/[0.03] sticky left-0 z-50 backdrop-blur-3xl bg-[#0f111a]/60 flex items-center justify-center relative overflow-hidden">
                            {/* Aquest petit text rotat dóna un look super premium i no perdem el context del mes! */}
                            <span className="absolute text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em] -rotate-90 whitespace-nowrap">
                                {format(baseDate, 'MMM', { locale: ca })}
                            </span>
                        </div>
                        
                        <div className="flex">
                            {days.map((day: Date) => (
                                <div key={day.toISOString()} style={{ width: columnWidth, minWidth: columnWidth }} className={`max-md:snap-start flex-shrink-0 text-center py-3 border-r border-white/[0.03] last:border-0 ${isToday(day) ? 'bg-white/[0.02]' : ''}`}>
                                    <div className="flex items-center justify-center gap-1.5">
                                        <span className={`text-[13px] font-medium capitalize ${isToday(day) ? 'text-white font-bold' : 'text-slate-400'}`}>
                                            {format(day, 'EEE', { locale: ca })}
                                        </span>
                                        <span className={`text-[18px] flex items-center justify-center w-8 h-8 rounded-full ${isToday(day) ? 'bg-white text-slate-900 font-bold shadow-[0_0_10px_rgba(255,255,255,0.2)]' : 'text-slate-200 font-normal'}`}>
                                            {format(day, 'd')}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Time Grid Scrollable */}
                    <div className="flex relative h-[1440px] max-md:h-[1640px]">
                        
                        {/* Columna Hores (Sticky Left) */}
                        <div className="w-14 flex-shrink-0 border-r border-white/[0.03] relative bg-transparent z-30 backdrop-blur-2xl sticky left-0">
                            <div className="absolute inset-0 bg-[#0f111a]/40 pointer-events-none -z-10" />
                            {Array.from({ length: 24 }).map((_, i) => (
                                <div key={i} className="absolute w-full text-right pr-3 text-[10px] font-semibold text-slate-500/80 -translate-y-2" style={{ top: `${i * 60}px` }}>
                                    {i === 0 ? '' : `${i.toString().padStart(2, '0')}:00`}
                                </div>
                            ))}
                        </div>

                        {/* Columnes dels Dies */}
                        <div className="flex flex-1 relative min-w-max bg-slate-900/10">
                            {/* Línies Horitzontals de Fons — CSS gradient (0 nodes vs 24 divs) */}
                            <div 
                                className="absolute top-0 left-0 right-0 h-[1440px] pointer-events-none z-0"
                                style={{ backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 59px, rgba(255,255,255,0.03) 59px, rgba(255,255,255,0.03) 60px)' }}
                            />

                            <div className="absolute inset-0 z-20 pointer-events-none">
                                <CurrentTimeLine />
                            </div>

                            {days.map((day: Date) => {
                                const dayTasks = tasksByDay[day.toISOString()] || [];

                                return (
                                    <div key={day.toISOString()} style={{ width: columnWidth, minWidth: columnWidth }} className="flex-shrink-0 flex flex-col relative z-10">
                                        <TimeDayColumn 
                                            day={day} 
                                            tasks={dayTasks}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeeklyGrid;
