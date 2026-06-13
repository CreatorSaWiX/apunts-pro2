import React, { useRef, useEffect } from 'react';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isToday } from 'date-fns';
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
    const taskEnd = new Date(taskStart.getTime() + (task.estimatedMinutes || 60) * 60000);

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

        if (isSelected) {
            window.addEventListener('click', handleGlobalClick);
            window.addEventListener('keydown', handleGlobalKeyDown);
            window.addEventListener('task-selected', handleTaskSelected);
        }

        return () => {
            window.removeEventListener('click', handleGlobalClick);
            window.removeEventListener('keydown', handleGlobalKeyDown);
            window.removeEventListener('task-selected', handleTaskSelected);
        };
    }, [isSelected, isEditing, task.id, deleteTask]);

    const handlePointerDown = (type: 'top' | 'bottom') => (e: React.PointerEvent) => {
        if (isEditing) return;
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
        }
        
        if (action === 'bottom') {
            updates.estimatedMinutes = pieceOffsetMinutes + snappedMinutes;
        }

        if (Object.keys(updates).length > 0) {
            updateTask(task.id, updates);
        }
        
        setCurrentTop(snappedTop);
        setCurrentHeight(snappedMinutes);
    };

    const handleTaskDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(true);
        setTimeout(() => inputRef.current?.focus(), 0);
    };

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
    const accentColor = priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.LOW;

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
            onDoubleClick={handleTaskDoubleClick}
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

            <div className="px-3 py-2 flex flex-col h-full pointer-events-none select-none">
                <div className="flex items-center gap-1.5 opacity-60 mb-0.5 pr-4">
                    <span className="text-[9px] font-bold tracking-[0.1em] text-slate-300">{startTimeStr} - {endTimeStr}</span>
                    {isResizing && <span className="text-[9px] font-bold ml-auto text-primary">{Math.round(currentHeight)}m</span>}
                </div>
                
                {isEditing ? (
                    <input
                        ref={inputRef}
                        className="text-[12px] font-bold leading-tight bg-slate-800/80 rounded px-1 -mx-1 text-white outline-none w-full border border-white/20 pointer-events-auto"
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
                        className="text-[12px] font-bold leading-tight text-slate-200 line-clamp-3 pointer-events-auto cursor-text"
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

    const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Obtenim posició del clic
        const bounds = e.currentTarget.getBoundingClientRect();
        const y = e.clientY - bounds.top;
        const hour = Math.floor(y / 60);
        const minute = Math.floor((y % 60) / 15) * 15; // Snap a quarts d'hora

        const newTaskDate = new Date(day);
        newTaskDate.setHours(hour, minute, 0, 0);

        addTask({
            title: 'Nova Tasca',
            status: 'TODO',
            priority: 'LOW',
            dueDate: null,
            startDate: newTaskDate.toISOString(),
            estimatedMinutes: 60,
            source: 'MANUAL'
        });
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
    const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
    const endDate = endOfWeek(currentDate, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to 8 AM on load
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 8 * 60 - 20;
        }
    }, [currentDate]);

    return (
        <div className="flex flex-col h-full bg-slate-900/40 backdrop-blur-2xl rounded-[32px] border border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_10px_40px_rgba(0,0,0,0.4)] overflow-hidden">
            {/* Header Dies */}
            <div className="flex border-b border-white/5 bg-slate-900/60 z-20 shadow-sm">
                <div className="w-14 flex-shrink-0 border-r border-white/5"></div>
                <div className="flex flex-1">
                    {days.map(day => (
                        <div key={day.toISOString()} className={`flex-1 text-center py-3 border-r border-white/5 last:border-0 ${isToday(day) ? 'bg-primary/5' : ''}`}>
                            <div className={`text-[10px] font-bold uppercase tracking-widest ${isToday(day) ? 'text-primary' : 'text-slate-500'}`}>
                                {format(day, 'EEE', { locale: ca })}
                            </div>
                            <div className={`text-xl font-black mt-0.5 ${isToday(day) ? 'text-primary drop-shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]' : 'text-slate-300'}`}>
                                {format(day, 'd')}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Time Grid Scrollable */}
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="flex relative min-h-[1440px]"> {/* 24 hores * 60px */}
                    
                    {/* Columna Hores */}
                    <div className="w-14 flex-shrink-0 border-r border-white/[0.03] relative bg-slate-900/10 z-10 backdrop-blur-sm">
                        {Array.from({ length: 24 }).map((_, i) => (
                            <div key={i} className="absolute w-full text-right pr-3 text-[10px] font-semibold text-slate-500/80 -translate-y-2" style={{ top: `${i * 60}px` }}>
                                {i === 0 ? '' : `${i.toString().padStart(2, '0')}:00`}
                            </div>
                        ))}
                    </div>

                    {/* Línies Horitzontals de Fons */}
                    <div className="absolute inset-0 left-14 pointer-events-none">
                        {Array.from({ length: 24 }).map((_, i) => (
                            <div key={i} className="absolute w-full border-b border-white/[0.03]" style={{ top: `${i * 60}px` }}></div>
                        ))}
                    </div>

                    <CurrentTimeLine />

                    {/* Columnes dels Dies */}
                    <div className="flex flex-1 relative">
                        {days.map(day => {
                            const dayStart = new Date(day);
                            dayStart.setHours(0, 0, 0, 0);
                            const dayEnd = new Date(day);
                            dayEnd.setHours(24, 0, 0, 0);

                            const dayTasks = tasks.filter(t => {
                                if (!t.startDate) return false;
                                const start = new Date(t.startDate);
                                const end = new Date(start.getTime() + (t.estimatedMinutes || 60) * 60000);
                                return start < dayEnd && end > dayStart;
                            });

                            return (
                                <TimeDayColumn 
                                    key={day.toISOString()} 
                                    day={day} 
                                    tasks={dayTasks}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeeklyGrid;
