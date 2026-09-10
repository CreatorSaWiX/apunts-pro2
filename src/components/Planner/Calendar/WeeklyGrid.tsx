import React, { useRef, useEffect, useLayoutEffect, useState, useMemo } from 'react';
import { flushSync, createPortal } from 'react-dom';
import { useDroppable, useDraggable, useDndContext, useDndMonitor } from '@dnd-kit/core';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isToday, addDays, subDays } from 'date-fns';
import { ca } from 'date-fns/locale';
import type { Task } from '../../../types/tasks';
import { useTasks } from '../../../contexts/TasksContext';
import { useDuplicateModifier } from '../../../hooks/useDuplicateModifier';
import NavigationPill from '../../ui/NavigationPill';
import { getSubjectColor } from '../../../stores/useSubjectStore';
import {
    dispatchOpenTaskPopover,
    dispatchOpenTaskContextMenu,
    dispatchPlannerAction,
    dispatchTaskSelected
} from '../plannerEvents';

interface WeeklyGridProps {
    currentDate: Date;
    tasks: Task[];
}

const ResizableTask: React.FC<{ task: Task; day: Date; updateTask: (id: string, updates: Partial<Task>) => void }> = React.memo(({ task, day, updateTask }) => {
    const deleteTask = useTasks(state => state.deleteTask);
    
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
    const isResizingRef = React.useRef(false);
    const hasResizedRef = React.useRef(false);
    const wasDraggingRef = React.useRef(false);

    React.useEffect(() => {
        if (isDragging) {
            wasDraggingRef.current = true;
        } else if (wasDraggingRef.current) {
            const timer = setTimeout(() => {
                wasDraggingRef.current = false;
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isDragging]);

    React.useEffect(() => {
        if (!isResizing) {
            setCurrentHeight(baseHeight);
            setCurrentTop(top);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                dispatchOpenTaskPopover({
                    x: rect ? rect.left + rect.width / 2 : window.innerWidth / 2,
                    y: rect ? rect.top + rect.height / 2 : window.innerHeight / 2,
                    taskId: task.id
                });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        setIsResizing(type);
        isResizingRef.current = true;
        hasResizedRef.current = false;
        dragStart.current = { y: e.clientY, height: currentHeight, top: currentTop };
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isResizing) return;
        e.stopPropagation();
        const deltaY = e.clientY - dragStart.current.y;
        if (Math.abs(deltaY) > 2) {
            hasResizedRef.current = true;
        }
        
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

        setTimeout(() => {
            isResizingRef.current = false;
            hasResizedRef.current = false;
        }, 300);
        
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
    
    const endMinutes = Math.round(layoutTop + height);
    const endH = Math.floor(endMinutes / 60);
    const endM = endMinutes % 60;
    const endTimeStr = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;
    const startMinutes = Math.round(layoutTop);
    const startH = Math.floor(startMinutes / 60);
    const startM = startMinutes % 60;
    const startTimeStr = `${startH.toString().padStart(2, '0')}:${startM.toString().padStart(2, '0')}`;

    const radiusClass = isContinuingFromPrev && isContinuingToNext ? 'rounded-none border-y-0' 
        : isContinuingFromPrev ? 'rounded-b-md rounded-t-none border-t-0' 
        : isContinuingToNext ? 'rounded-t-md rounded-b-none border-b-0' 
        : 'rounded-md';

    const priorityColors = {
        HIGH: 'bg-red-500',
        MEDIUM: 'bg-amber-500',
        LOW: 'bg-primary'
    };
    
    const taskSubject = useTasks(state => 
        task.subjectId ? state.subjects.find(s => s.id === task.subjectId) : undefined
    );
    const subjectColor = taskSubject ? getSubjectColor(taskSubject.colorToken) : null;
    const accentColorClass = !subjectColor ? (priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.LOW) : '';
    const accentStyle = subjectColor ? { backgroundColor: subjectColor.primary, color: subjectColor.primary } : undefined;

    return (
        <>
            {/* Línies guies magnètiques en ajustar dates/hores */}
            {isResizing && (
                <>
                    {/* Línia guia superior amb l'hora d'inici */}
                    <div 
                        className="absolute left-0 right-0 h-[2px] bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,1)] pointer-events-none"
                        style={{ top: `${layoutTop}px`, zIndex: 45 }}
                    >
                        <span className={`absolute -top-5 left-1 px-1.5 py-0.5 rounded text-[10px] font-bold shadow-md font-mono tracking-wider transition-transform ${isResizing === 'top' ? 'bg-emerald-500 text-slate-950 scale-105 ring-2 ring-emerald-300' : 'bg-emerald-500 text-slate-950'}`}>
                            {startTimeStr}
                        </span>
                    </div>

                    {/* Línia guia inferior amb l'hora de finalització */}
                    <div 
                        className="absolute left-0 right-0 h-[2px] bg-emerald-400/90 shadow-[0_0_10px_rgba(52,211,153,0.8)] pointer-events-none"
                        style={{ top: `${layoutTop + height}px`, zIndex: 45 }}
                    >
                        <span className={`absolute -bottom-5 left-1 px-1.5 py-0.5 rounded text-[10px] font-bold shadow-md font-mono tracking-wider transition-transform ${isResizing === 'bottom' ? 'bg-emerald-600 text-white scale-105 ring-2 ring-emerald-400' : 'bg-emerald-600 text-white'}`}>
                            {endTimeStr}
                        </span>
                    </div>
                </>
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
                    if (hasResizedRef.current || isResizingRef.current || wasDraggingRef.current || isDragging) {
                        hasResizedRef.current = false;
                        isResizingRef.current = false;
                        wasDraggingRef.current = false;
                        return;
                    }
                    if (window.innerWidth < 768 && isSelected) {
                        dispatchOpenTaskPopover({ x: e.clientX, y: e.clientY, taskId: task.id });
                        return;
                    }
                    setIsSelected(true);
                    dispatchTaskSelected(task.id);
                }}
                onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dispatchOpenTaskContextMenu({ x: e.clientX, y: e.clientY, task });
                }}
                onDoubleClick={(e) => {
                    e.stopPropagation();
                    dispatchOpenTaskPopover({ x: e.clientX, y: e.clientY, taskId: task.id });
                }}
                className={`absolute left-1 right-1 border overflow-hidden flex flex-col group
                    ${isDragging
                        ? isAltPressed
                            ? 'opacity-70 pointer-events-none backdrop-blur-md'
                            : 'opacity-25 border-dashed border-white/20 bg-slate-900/30 pointer-events-none'
                        : 'backdrop-blur-xl'
                    }
                    ${isDragging || isResizing ? '' : 'transition-[box-shadow,opacity] duration-200'}
                    ${isDragging ? '' : 'bg-white/[0.02] hover:bg-white/[0.05] shadow-[inset_0_1px_3px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.3)] cursor-grab active:cursor-grabbing'}
                    ${isSelected ? 'border-white/30 shadow-[inset_0_1px_3px_rgba(255,255,255,0.3),0_0_30px_rgba(255,255,255,0.1)]' : 'border-white/[0.05]'}
                    ${isResizing ? 'z-40 border-emerald-400/80 shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_20px_rgba(52,211,153,0.2)]' : isDragging ? '' : 'hover:z-20 hover:shadow-[inset_0_1px_3px_rgba(255,255,255,0.2),0_15px_50px_rgba(0,0,0,0.5)]'}
                    ${radiusClass}
                `}
                style={{
                    top: `${layoutTop}px`,
                    height: `${height}px`,
                    zIndex: isDragging ? 5 : isResizing ? 40 : isSelected ? 30 : 10
                }}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
            >
                {/* Subtle Gradient background matching accent color */}
                <div 
                    className={`absolute inset-0 opacity-[0.15] mix-blend-plus-lighter ${accentColorClass}`} 
                    style={subjectColor ? { backgroundColor: subjectColor.primary } : undefined}
                />
                
                {/* Color Accent Indicator */}
                <div 
                    className={`absolute top-0 bottom-0 left-0 w-[3px] ${accentColorClass} shadow-[0_0_20px_currentColor] opacity-100`} 
                    style={accentStyle}
                />

                {/* Top Resize Handle */}
                {!isContinuingFromPrev && (
                    <div 
                        className={`absolute top-0 left-0 right-0 h-5 max-md:h-10 max-md:-translate-y-2.5 cursor-ns-resize z-20 flex justify-center pt-[2px] md:pt-[3px] group/handle transition-colors ${isSelected || isResizing === 'top' ? 'bg-white/[0.08]' : 'hover:bg-white/[0.05]'}`}
                        style={{ touchAction: 'none' }}
                        onPointerDown={handlePointerDown('top')}
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                        }}
                    >
                        <div className={`w-6 h-[3px] rounded-full transition duration-200 ${isResizing === 'top' ? 'bg-emerald-400 scale-x-150 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-white/40 group-hover/handle:bg-white/80 group-hover/handle:scale-x-150'}`} />
                    </div>
                )}

                <div className={`pl-3 pr-2 flex flex-col h-full pointer-events-none select-none overflow-hidden ${height < 40 ? 'py-0.5' : 'py-2'}`}>
                    {height >= 40 && (
                        <div className="flex items-center justify-between gap-1 mb-0.5 pr-2 shrink-0">
                            <span className={`text-[9px] font-bold font-mono tracking-wider ${isResizing ? 'text-emerald-300' : 'text-slate-300'}`}>
                                {startTimeStr} - {endTimeStr}
                            </span>
                            {isResizing && (
                                <span className="text-[8px] uppercase tracking-wider bg-emerald-500/25 border border-emerald-400/40 px-1 py-0.2 rounded text-emerald-200 font-bold font-mono">
                                    Snap 5m
                                </span>
                            )}
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
                        className={`absolute bottom-0 left-0 right-0 h-5 max-md:h-10 max-md:translate-y-2.5 cursor-ns-resize z-20 flex justify-center pb-[2px] md:pb-[3px] items-end group/handle transition-colors ${isSelected || isResizing === 'bottom' ? 'bg-white/[0.08]' : 'hover:bg-white/[0.05]'}`}
                        style={{ touchAction: 'none' }}
                        onPointerDown={handlePointerDown('bottom')}
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                        }}
                    >
                        <div className={`w-6 h-[3px] rounded-full transition duration-200 ${isResizing === 'bottom' ? 'bg-emerald-400 scale-x-150 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-white/40 group-hover/handle:bg-white/80 group-hover/handle:scale-x-150'}`} />
                    </div>
                )}
            </div>
        </>
    );
});

ResizableTask.displayName = 'ResizableTask';

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

const TimeDayColumn: React.FC<{ day: Date; tasks: Task[] }> = React.memo(({ day, tasks }) => {
    const addTask = useTasks(state => state.addTask);
    const updateTask = useTasks(state => state.updateTask);
    const subjects = useTasks(state => state.subjects);
    const dateStr = format(day, 'yyyy-MM-dd');
    
    const { setNodeRef, isOver } = useDroppable({
        id: dateStr,
        data: { type: 'DateCell', date: dateStr }
    });

    const { active } = useDndContext();
    const colRef = React.useRef<HTMLDivElement>(null);
    const [dragY, setDragY] = React.useState<number | null>(null);

    const setRefs = React.useCallback((node: HTMLDivElement | null) => {
        setNodeRef(node);
        colRef.current = node;
    }, [setNodeRef]);

    useDndMonitor({
        onDragMove(event) {
            if (event.over?.id === dateStr && colRef.current) {
                const colRect = colRef.current.getBoundingClientRect();
                const translated = event.active.rect.current.translated;
                if (translated) {
                    const pieceOffsetMinutes = (event.active.data.current?.pieceOffsetMinutes as number) || 0;
                    const relativeY = translated.top - colRect.top;
                    const snapped = Math.max(0, Math.min(23 * 60, Math.round((relativeY - pieceOffsetMinutes) / 5) * 5));
                    setDragY(prev => (prev === snapped ? prev : snapped));
                }
            } else if (dragY !== null) {
                setDragY(null);
            }
        },
        onDragEnd() {
            setDragY(null);
        },
        onDragCancel() {
            setDragY(null);
        }
    });

    const ghostPosition = React.useMemo(() => {
        if (!isOver || dragY === null || !active) return null;

        const task = active.data.current?.task as Task | undefined;
        const duration = task?.estimatedMinutes || 60;

        const startH = Math.floor(dragY / 60);
        const startM = dragY % 60;
        const endMinutes = Math.min(24 * 60, dragY + duration);
        const endH = Math.floor(endMinutes / 60);
        const endM = endMinutes % 60;

        const startTime = `${startH.toString().padStart(2, '0')}:${startM.toString().padStart(2, '0')}`;
        const endTime = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;

        const taskSubject = task?.subjectId ? subjects?.find(s => s.id === task.subjectId) : null;
        const subjectColor = taskSubject?.colorToken ? getSubjectColor(taskSubject.colorToken) : null;
        const priorityColors = { HIGH: '#EF4444', MEDIUM: '#F59E0B', LOW: '#10B981' };
        const accentColor = subjectColor?.primary || (task?.priority ? priorityColors[task.priority as keyof typeof priorityColors] : '#10B981');

        return {
            top: dragY,
            height: duration,
            startTime,
            endTime,
            title: task?.title || 'Nova Tasca',
            accentColor,
            subjectName: taskSubject?.name
        };
    }, [isOver, dragY, active, subjects]);

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
        dispatchOpenTaskPopover({ x: e.clientX, y: e.clientY, taskId: id });
    };

    const isDraggingThisColumn = active ? String(active.id).includes(`::${dateStr}`) : false;

    return (
        <div 
            ref={setRefs}
            onDoubleClick={handleDoubleClick}
            className={`flex-1 border-r border-white/[0.03] last:border-0 relative transition-colors cursor-crosshair
                ${isOver ? 'bg-primary/5' : ''}
                ${isToday(day) ? 'bg-white/[0.015]' : ''}
            `}
            style={{
                zIndex: isOver ? 30 : isDraggingThisColumn ? 10 : 1
            }}
        >
            {/* Línies guies i targeta de previsualització unificada */}
            {ghostPosition && (
                <>
                    {/* Línia guia superior amb l'hora d'inici */}
                    <div 
                        className="absolute left-0 right-0 h-[2px] bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,1)] pointer-events-none"
                        style={{ top: `${ghostPosition.top}px`, zIndex: 35 }}
                    >
                        <span className="absolute -top-5 left-1 px-1.5 py-0.5 rounded bg-emerald-500 text-[10px] font-bold text-slate-950 shadow-md font-mono tracking-wider">
                            {ghostPosition.startTime}
                        </span>
                    </div>

                    {/* Targeta fantasma unificada d'ajust */}
                    <div 
                        className="absolute left-1 right-1 rounded-xl border border-emerald-400/80 bg-[#0d0f17]/95 backdrop-blur-2xl pointer-events-none flex flex-col justify-between p-2 shadow-[0_15px_40px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(52,211,153,0.15)] overflow-hidden"
                        style={{ 
                            top: `${ghostPosition.top}px`, 
                            height: `${ghostPosition.height}px`,
                            zIndex: 25
                        }}
                    >
                        {/* Fons translúcid suau amb color d'accent */}
                        <div 
                            className="absolute inset-0 opacity-[0.15] mix-blend-plus-lighter pointer-events-none"
                            style={{ backgroundColor: ghostPosition.accentColor }}
                        />

                        {/* Barra lateral d'accent de 3.5px com a les tasques de calendari */}
                        <div 
                            className="absolute top-0 bottom-0 left-0 w-[3.5px] shadow-[0_0_15px_currentColor]"
                            style={{ backgroundColor: ghostPosition.accentColor, color: ghostPosition.accentColor }}
                        />

                        {/* Tirador decoratiu superior */}
                        <div className="w-6 h-[3px] bg-white/40 rounded-full mx-auto shrink-0" />

                        {/* Contingut central */}
                        <div className="pl-2.5 pr-1 flex flex-col justify-between flex-1 min-w-0 py-0.5">
                            <div className="flex items-center justify-between text-[9px] font-bold font-mono text-emerald-300/90">
                                <div className="flex items-center gap-1.5 truncate">
                                    <span className="tracking-wider">{ghostPosition.startTime} - {ghostPosition.endTime}</span>
                                    {ghostPosition.subjectName && (
                                        <span 
                                            className="text-[8px] font-bold px-1.5 py-0.2 rounded uppercase tracking-wider truncate"
                                            style={{
                                                color: ghostPosition.accentColor,
                                                backgroundColor: 'rgba(255,255,255,0.08)'
                                            }}
                                        >
                                            {ghostPosition.subjectName}
                                        </span>
                                    )}
                                </div>
                                <span className="text-[8px] uppercase tracking-wider bg-emerald-500/25 border border-emerald-400/40 px-1 py-0.2 rounded text-emerald-200 font-bold shrink-0 ml-1">
                                    Snap 5m
                                </span>
                            </div>
                            <div className="text-xs font-bold text-white truncate my-auto">
                                {ghostPosition.title}
                            </div>
                        </div>

                        {/* Tirador decoratiu inferior */}
                        <div className="w-6 h-[3px] bg-white/40 rounded-full mx-auto shrink-0" />
                    </div>

                    {/* Línia guia inferior amb l'hora de finalització */}
                    <div 
                        className="absolute left-0 right-0 h-[2px] bg-emerald-400/90 shadow-[0_0_10px_rgba(52,211,153,0.8)] pointer-events-none"
                        style={{ top: `${ghostPosition.top + ghostPosition.height}px`, zIndex: 35 }}
                    >
                        <span className="absolute -bottom-5 left-1 px-1.5 py-0.5 rounded bg-emerald-600 text-[10px] font-bold text-white shadow-md font-mono tracking-wider">
                            {ghostPosition.endTime}
                        </span>
                    </div>
                </>
            )}

            {tasks.map(task => (
                <ResizableTask key={`${task.id}-${dateStr}`} task={task} day={day} updateTask={updateTask} />
            ))}
        </div>
    );
});

TimeDayColumn.displayName = 'TimeDayColumn';

const WeeklyGrid: React.FC<WeeklyGridProps> = ({ currentDate, tasks }) => {
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

    // Buffer constant de 5 setmanes (35 dies): estable, fluid i sense re-renderitzats mid-animació
    const days = useMemo(() => {
        const startDate = subDays(baseDate, 14);
        const endDate = addDays(endOfWeek(baseDate, { weekStartsOn: 1 }), 14);
        return eachDayOfInterval({ start: startDate, end: endDate });
    }, [baseDate]);
    
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

    // Auto-scroll a l'hora i dia actuals
    useLayoutEffect(() => {
        setBaseDate(startOfWeek(currentDate, { weekStartsOn: 1 }));
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const clientWidth = container.clientWidth;
            const clientHeight = container.clientHeight;
            
            // Scroll vertical: centrar l'hora actual
            const now = new Date();
            const currentMinutes = now.getHours() * 60 + now.getMinutes();
            container.scrollTop = Math.max(0, currentMinutes - clientHeight / 2);
            
            // Scroll horitzontal: centrar el dia seleccionat
            const isMobile = window.innerWidth < 768;
            const actualWidth = isMobile ? (clientWidth - 56) : Math.max(140, (clientWidth - 56) / 7);
            const dayOffset = (currentDate.getDay() + 6) % 7;
            const bufferOffset = 14;
            
            if (isMobile) {
                container.scrollLeft = (bufferOffset + dayOffset) * actualWidth;
            } else {
                container.scrollLeft = (bufferOffset + dayOffset) * actualWidth - (clientWidth - 56) / 2 + actualWidth / 2;
            }
        }
    }, [currentDate]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;

        // Llindar segur: a 7 columnes (1 setmana) de la vora esquerra
        if (target.scrollLeft < 7 * columnWidth) {
            flushSync(() => {
                setBaseDate(prev => subDays(prev, 7));
            });
            target.scrollLeft += 7 * columnWidth;
        } 
        // Total columnes: 35. 35 - 7 (pantalla) - 7 (vora) = 21
        else if (target.scrollLeft > 21 * columnWidth) {
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
                            onClick={() => dispatchPlannerAction('plannerViewMonth')}
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
