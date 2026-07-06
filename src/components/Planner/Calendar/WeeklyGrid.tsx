import React, { useRef, useEffect, useState, useMemo } from 'react';
import { flushSync } from 'react-dom';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isToday, addDays, subDays } from 'date-fns';
import { ca } from 'date-fns/locale';
import type { Task } from '../../../types/tasks';
import { useTasks } from '../../../contexts/TasksContext';

interface WeeklyGridProps {
    currentDate: Date;
    tasks: Task[];
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
    
    const [isEditing, setIsEditing] = React.useState(false);
    const [editTitle, setEditTitle] = React.useState(task.title);
    const [isSelected, setIsSelected] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const taskRef = React.useRef<HTMLDivElement>(null);

    const dragStart = React.useRef({ y: 0, height: 0, top: 0 });

    React.useEffect(() => {
        if (!isResizing) {
            setCurrentHeight(baseHeight);
            setCurrentTop(top);
        }
    }, [task.estimatedMinutes, task.startDate, isResizing, day]);

    React.useEffect(() => {
        const handleGlobalClick = () => setIsSelected(false);
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (isSelected && !isEditing && (e.key === 'Backspace' || e.key === 'Delete')) {
                deleteTask(task.id);
            }
        };
        const handleTaskSelected = (e: Event) => {
            const customEvent = e as CustomEvent;
            if (customEvent.detail !== task.id) {
                setIsSelected(false);
            }
        };
        
        const handleEditInline = (e: Event) => {
            const customEvent = e as CustomEvent;
            if (customEvent.detail === task.id) {
                setIsEditing(true);
                setTimeout(() => inputRef.current?.focus(), 0);
            }
        };

        if (isSelected) {
            window.addEventListener('click', handleGlobalClick);
            window.addEventListener('keydown', handleGlobalKeyDown);
            window.addEventListener('task-selected', handleTaskSelected);
        }
        window.addEventListener('task-edit-inline', handleEditInline);

        return () => {
            window.removeEventListener('click', handleGlobalClick);
            window.removeEventListener('keydown', handleGlobalKeyDown);
            window.removeEventListener('task-selected', handleTaskSelected);
            window.removeEventListener('task-edit-inline', handleEditInline);
        };
    }, [isSelected, isEditing, task.id, deleteTask]);

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

    // L'edició en línia ara s'activa a través de l'event 'task-edit-inline' quan es crea la tasca

    const handleTitleSubmit = () => {
        setIsEditing(false);
        if (editTitle.trim() && editTitle !== task.title) {
            updateTask(task.id, { title: editTitle.trim() });
        } else {
            setEditTitle(task.title);
        }
    };

    const height = isResizing ? currentHeight : baseHeight;
    const layoutTop = isResizing ? currentTop : top;
    
    const snappedY = transform ? Math.round(transform.y / 5) * 5 : 0;
    const colWidth = taskRef.current?.parentElement?.offsetWidth || 0;
    const snappedX = transform && colWidth ? Math.round(transform.x / colWidth) * colWidth : 0;

    const visualTop = isResizing ? currentTop : isDragging ? top + snappedY : top;
    
    const endMinutes = visualTop + height;
    const endH = Math.floor(endMinutes / 60);
    const endM = endMinutes % 60;
    const endTimeStr = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;
    const startH = Math.floor(visualTop / 60);
    const startM = visualTop % 60;
    const startTimeStr = `${startH.toString().padStart(2, '0')}:${startM.toString().padStart(2, '0')}`;

    const radiusClass = isContinuingFromPrev && isContinuingToNext ? 'rounded-none border-y-0' 
        : isContinuingFromPrev ? 'rounded-b-xl rounded-t-none border-t-0' 
        : isContinuingToNext ? 'rounded-t-xl rounded-b-none border-b-0' 
        : 'rounded-xl';

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
                setIsSelected(prev => {
                    const next = !prev;
                    if (next) window.dispatchEvent(new CustomEvent('task-selected', { detail: task.id }));
                    return next;
                });
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
            className={`absolute left-1 right-1 border overflow-hidden backdrop-blur-2xl transition-[box-shadow,opacity] flex flex-col group
                bg-slate-900/40 hover:bg-slate-900/60 shadow-[0_8px_32px_rgba(0,0,0,0.3)] cursor-grab active:cursor-grabbing
                ${isSelected ? 'border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.1)]' : 'border-white/[0.03]'}
                ${isResizing ? 'z-30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] opacity-95 scale-[1.02]' : 'hover:z-20 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]'}
                ${isDragging ? 'shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 opacity-90 scale-[1.02] cursor-grabbing pointer-events-none' : ''}
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
            {/* Color Accent Indicator */}
            <div className={`absolute top-0 bottom-0 left-0 w-1 ${accentColor} shadow-[0_0_15px_currentColor] opacity-80`} />

            {/* Top Resize Handle */}
            {!isContinuingFromPrev && (
                <div 
                    className="absolute top-0 left-0 right-0 h-3 cursor-ns-resize z-20 flex justify-center pt-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    onPointerDown={handlePointerDown('top')}
                >
                    <div className="w-8 h-1 rounded-full bg-white/20" />
                </div>
            )}

            <div className={`pl-3 pr-2 flex flex-col h-full pointer-events-none select-none overflow-hidden ${height < 40 ? 'py-0.5' : 'py-2'}`}>
                {height >= 40 && (
                    <div className="flex items-center gap-1.5 opacity-60 mb-0.5 pr-4 shrink-0">
                        <span className="text-[9px] font-bold tracking-[0.1em] text-slate-300">{startTimeStr} - {endTimeStr}</span>
                    </div>
                )}
                
                {isEditing ? (
                    <input
                        ref={inputRef}
                        className="text-[12px] font-bold leading-tight bg-slate-900/90 rounded-md px-1.5 py-0.5 -mx-1.5 -my-0.5 text-white outline-none w-[calc(100%+0.75rem)] border border-white/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/30 pointer-events-auto shadow-lg backdrop-blur-sm transition-all"
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        onBlur={handleTitleSubmit}
                        onKeyDown={e => e.key === 'Enter' && handleTitleSubmit()}
                        onPointerDown={e => e.stopPropagation()}
                        onClick={e => e.stopPropagation()}
                        onDoubleClick={e => e.stopPropagation()}
                    />
                ) : (
                    <div 
                        className={`font-bold leading-tight text-slate-200 pointer-events-auto shrink-0 ${height < 30 ? 'text-[9px] truncate' : 'text-[12px] line-clamp-3'}`}
                    >
                        {task.title}
                    </div>
                )}
            </div>

            {/* Bottom Resize Handle */}
            {!isContinuingToNext && (
                <div 
                    className="absolute bottom-0 left-0 right-0 h-3 cursor-ns-resize z-20 flex justify-center pb-0.5 items-end opacity-0 group-hover:opacity-100 transition-opacity"
                    onPointerDown={handlePointerDown('bottom')}
                >
                    <div className="w-8 h-1 rounded-full bg-white/20" />
                </div>
            )}
        </div>
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
            className="absolute left-14 right-0 z-20 pointer-events-none flex items-center transition-all duration-1000 ease-linear"
            style={{ top: `${top}px` }}
        >
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.9)] -ml-1.5 z-10"></div>
            <div className="flex-1 h-px bg-red-500/60 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
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
            estimatedMinutes,
            source: 'MANUAL'
        });
        window.dispatchEvent(new CustomEvent('task-edit-inline', { detail: id }));
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

const WeeklyGrid: React.FC<WeeklyGridProps> = ({ currentDate, tasks }) => {
    const [baseDate, setBaseDate] = useState(() => startOfWeek(currentDate, { weekStartsOn: 1 }));
    const [columnWidth, setColumnWidth] = useState(140);

    const startDate = subDays(baseDate, 28); // 4 weeks before
    const endDate = addDays(endOfWeek(baseDate, { weekStartsOn: 1 }), 28); // 4 weeks after (total 9 weeks = 63 days)
    const days = useMemo(() => eachDayOfInterval({ start: startDate, end: endDate }), [startDate, endDate]);
    
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
                const width = Math.max(140, (scrollContainerRef.current.clientWidth - 56) / 7);
                setColumnWidth(width);
            }
        };
        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    // Auto-scroll to current time and current day on load or when external currentDate changes
    useEffect(() => {
        setBaseDate(startOfWeek(currentDate, { weekStartsOn: 1 }));
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const clientWidth = container.clientWidth;
            const clientHeight = container.clientHeight;
            
            // Vertical scroll: center the current time
            const now = new Date();
            const currentMinutes = now.getHours() * 60 + now.getMinutes();
            container.scrollTop = Math.max(0, currentMinutes - clientHeight / 2);
            
            // Horizontal scroll: Center the current day of the week unconditionally
            const exactFitWidth = (clientWidth - 56) / 7;
            const width = Math.max(140, exactFitWidth);
            
            const dayOffset = (currentDate.getDay() + 6) % 7;
            container.scrollLeft = (28 + dayOffset) * width - (clientWidth - 56) / 2 + width / 2;
        }
    }, [currentDate]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
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
            
            {/* Title Header */}
            <div className="flex items-center px-6 py-3 shrink-0 z-50">
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80 capitalize tracking-tight drop-shadow-sm">
                    {format(baseDate, 'MMMM yyyy', { locale: ca })}
                </h1>
            </div>

            {/* 2D Scrollable Area */}
            <div 
                ref={scrollContainerRef} 
                onScroll={handleScroll}
                className="flex-1 overflow-auto relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
                <div className="flex flex-col min-w-max">
                    
                    {/* Header Dies (Sticky Top) */}
                    <div className="flex border-b border-white/5 bg-slate-900/90 backdrop-blur-xl z-40 shadow-sm sticky top-0">
                        {/* Top-Left Corner (Sticky Top + Left) */}
                        <div className="w-14 flex-shrink-0 border-r border-white/5 sticky left-0 z-50 bg-slate-900/90 backdrop-blur-xl"></div>
                        
                        <div className="flex">
                            {days.map((day: Date) => (
                                <div key={day.toISOString()} style={{ width: columnWidth, minWidth: columnWidth }} className={`flex-shrink-0 text-center py-2.5 border-r border-white/5 last:border-0 ${isToday(day) ? 'bg-primary/5' : ''}`}>
                                    <div className="flex items-center justify-center gap-1.5">
                                        <span className={`text-[13px] font-medium capitalize ${isToday(day) ? 'text-primary font-semibold' : 'text-slate-400'}`}>
                                            {format(day, 'EEE', { locale: ca })}
                                        </span>
                                        <span className={`text-[18px] flex items-center justify-center w-8 h-8 rounded-full ${isToday(day) ? 'bg-primary text-white font-bold shadow-[0_0_12px_rgba(var(--primary-rgb),0.6)]' : 'text-slate-200 font-normal'}`}>
                                            {format(day, 'd')}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Time Grid Scrollable */}
                    <div className="flex relative min-h-[1440px]">
                        
                        {/* Columna Hores (Sticky Left) */}
                        <div className="w-14 flex-shrink-0 border-r border-white/[0.03] relative bg-slate-900/90 z-30 backdrop-blur-md sticky left-0">
                            {Array.from({ length: 24 }).map((_, i) => (
                                <div key={i} className="absolute w-full text-right pr-3 text-[10px] font-semibold text-slate-500/80 -translate-y-2" style={{ top: `${i * 60}px` }}>
                                    {i === 0 ? '' : `${i.toString().padStart(2, '0')}:00`}
                                </div>
                            ))}
                        </div>

                        {/* Columnes dels Dies */}
                        <div className="flex flex-1 relative min-w-max bg-slate-900/10">
                            {/* Línies Horitzontals de Fons */}
                            <div className="absolute inset-0 pointer-events-none z-0">
                                {Array.from({ length: 24 }).map((_, i) => (
                                    <div key={i} className="absolute w-full border-b border-white/[0.03]" style={{ top: `${i * 60}px` }}></div>
                                ))}
                            </div>

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
