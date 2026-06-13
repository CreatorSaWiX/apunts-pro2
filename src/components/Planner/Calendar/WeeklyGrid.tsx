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

const ResizableTask: React.FC<{ task: Task; updateTask: (id: string, updates: Partial<Task>) => void }> = ({ task, updateTask }) => {
    const { removeTask } = useTasks();
    const startDate = new Date(task.startDate!);
    const hour = startDate.getHours();
    const min = startDate.getMinutes();
    const top = (hour * 60) + min;
    const baseHeight = Math.max(task.estimatedMinutes || 60, 15);

    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: task.id,
        data: { type: 'Task', task }
    });

    const [isResizing, setIsResizing] = React.useState<'top' | 'bottom' | null>(null);
    const [currentHeight, setCurrentHeight] = React.useState(baseHeight);
    const [currentTop, setCurrentTop] = React.useState(top);
    
    const [isEditing, setIsEditing] = React.useState(false);
    const [editTitle, setEditTitle] = React.useState(task.title);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const dragStart = React.useRef({ y: 0, height: 0, top: 0 });

    React.useEffect(() => {
        if (!isResizing) {
            setCurrentHeight(Math.max(task.estimatedMinutes || 60, 15));
            setCurrentTop((new Date(task.startDate!).getHours() * 60) + new Date(task.startDate!).getMinutes());
        }
    }, [task.estimatedMinutes, task.startDate, isResizing]);

    const handlePointerDown = (type: 'top' | 'bottom') => (e: React.PointerEvent) => {
        if (isEditing) return;
        e.stopPropagation();
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
            const newStartDate = new Date(startDate);
            newStartDate.setHours(Math.floor(snappedTop / 60));
            newStartDate.setMinutes(snappedTop % 60);
            updates.startDate = newStartDate.toISOString();
        }
        
        if (action === 'bottom' || action === 'top') {
            updates.estimatedMinutes = snappedMinutes;
        }

        if (Object.keys(updates).length > 0) {
            updateTask(task.id, updates);
        }
        
        setCurrentTop(snappedTop);
        setCurrentHeight(snappedMinutes);
    };

    const handleDoubleClick = (e: React.MouseEvent) => {
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

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Vols esborrar aquesta tasca?')) {
            removeTask(task.id);
        }
    };

    const height = isResizing ? currentHeight : baseHeight;
    const renderTop = isResizing ? currentTop : top;
    
    const endMinutes = renderTop + height;
    const endH = Math.floor(endMinutes / 60);
    const endM = endMinutes % 60;
    const endTimeStr = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;
    const startH = Math.floor(renderTop / 60);
    const startM = renderTop % 60;
    const startTimeStr = `${startH.toString().padStart(2, '0')}:${startM.toString().padStart(2, '0')}`;

    const priorityColors = {
        HIGH: 'bg-red-500',
        MEDIUM: 'bg-amber-500',
        LOW: 'bg-primary'
    };
    const accentColor = priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.LOW;

    return (
        <div 
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`absolute left-1 right-1 rounded-xl border border-white/[0.03] overflow-hidden backdrop-blur-2xl transition-all flex flex-col group
                bg-slate-900/40 hover:bg-slate-900/60 shadow-[0_8px_32px_rgba(0,0,0,0.3)] cursor-grab active:cursor-grabbing
                ${isResizing ? 'z-30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] opacity-95 scale-[1.02]' : 'hover:z-20 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]'}
                ${isDragging ? 'opacity-20 pointer-events-none' : ''}
            `}
            style={{
                top: `${renderTop}px`,
                height: `${height}px`,
                zIndex: isResizing || isDragging ? 30 : 10
            }}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
        >
            {/* Color Accent Indicator */}
            <div className={`absolute top-0 bottom-0 left-0 w-1 ${accentColor} shadow-[0_0_15px_currentColor] opacity-80`} />

            {/* Top Resize Handle */}
            <div 
                className="absolute top-0 left-0 right-0 h-3 cursor-ns-resize z-20 flex justify-center pt-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                onPointerDown={handlePointerDown('top')}
            >
                <div className="w-8 h-1 rounded-full bg-white/20" />
            </div>

            {/* Delete Button */}
            <button 
                className="absolute top-1.5 right-1.5 w-5 h-5 rounded-md bg-red-500/20 text-red-300 hover:bg-red-500 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-20 cursor-pointer pointer-events-auto"
                onClick={handleDelete}
                onPointerDown={e => e.stopPropagation()}
            >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
            </button>

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
                    />
                ) : (
                    <div 
                        className="text-[12px] font-bold leading-tight text-slate-200 line-clamp-3 pointer-events-auto cursor-text"
                        onDoubleClick={handleDoubleClick}
                    >
                        {task.title}
                    </div>
                )}
            </div>

            {/* Bottom Resize Handle */}
            <div 
                className="absolute bottom-0 left-0 right-0 h-3 cursor-ns-resize z-20 flex justify-center pb-0.5 items-end opacity-0 group-hover:opacity-100 transition-opacity"
                onPointerDown={handlePointerDown('bottom')}
            >
                <div className="w-8 h-1 rounded-full bg-white/20" />
            </div>
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
                <ResizableTask key={task.id} task={task} updateTask={updateTask} />
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
                            const dayTasks = tasks.filter(t => t.startDate && t.startDate.startsWith(format(day, 'yyyy-MM-dd')));
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
