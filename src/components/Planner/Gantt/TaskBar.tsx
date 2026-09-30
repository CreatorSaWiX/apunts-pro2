import React, { useState, useRef, useEffect, useMemo } from 'react';
import { format, addMinutes } from 'date-fns';
import type { Task, Subject } from '../../../types/tasks';
import { getSubjectColor } from '../../../stores/useSubjectStore';
import { dispatchOpenTaskPopover, dispatchOpenTaskContextMenu } from '../plannerEvents';
import type { LayoutTask } from './TrackMinHeap';

export interface TaskBarProps {
    task: LayoutTask;
    zoomLevel: number;
    timelineStart: Date;
    updateTask: (id: string, updates: Partial<Task>) => void;
    subject?: Subject;
}

export const TaskBar: React.FC<TaskBarProps> = React.memo(({ 
    task, 
    zoomLevel, 
    timelineStart, 
    updateTask, 
    subject 
}) => {
    const [dragState, setDragState] = useState<{ 
        type: 'left' | 'right' | 'move'; 
        initialX: number; 
        initialLeft: number; 
        initialWidth: number;
        isTouch?: boolean;
        touchStartY?: number;
        hasMoved?: boolean;
    } | null>(null);

    const [optimistic, setOptimistic] = useState<{ left: number; width: number } | null>(null);
    const lastTapRef = useRef<number>(0);
    const wasDraggedRef = useRef<boolean>(false);

    // Refs per sincronitzar valors mutables als listeners d'esdeveniments globals sense re-subscriure
    const dragStateRef = useRef(dragState);
    const optimisticRef = useRef(optimistic);
    useEffect(() => {
        dragStateRef.current = dragState;
        optimisticRef.current = optimistic;
    });

    const isDragging = dragState !== null;

    useEffect(() => {
        if (!isDragging) return;
        
        const handleMove = (clientX: number, clientY: number) => {
            const currentDrag = dragStateRef.current;
            if (!currentDrag) return;

            const dx = clientX - currentDrag.initialX;
            
            // Distingeix entre toc, desplaçament horitzontal i scroll vertical
            if (currentDrag.isTouch && !currentDrag.hasMoved) {
                const dy = clientY - (currentDrag.touchStartY || 0);
                if (Math.abs(dx) > 5) {
                    setDragState(prev => prev ? { ...prev, hasMoved: true } : null);
                    wasDraggedRef.current = true;
                } else if (Math.abs(dy) > 5) {
                    setDragState(null);
                    return;
                } else {
                    return;
                }
            }

            if (!currentDrag.isTouch && Math.abs(dx) > 3) {
                wasDraggedRef.current = true;
            }

            // Snap magnètic a 5 minuts
            const snapPixels = 5 * zoomLevel;
            const snappedDx = Math.round(dx / snapPixels) * snapPixels;

            let nextOptimistic: { left: number; width: number };
            if (currentDrag.type === 'right') {
                nextOptimistic = { 
                    left: currentDrag.initialLeft, 
                    width: Math.max(4, currentDrag.initialWidth + snappedDx) 
                };
            } else if (currentDrag.type === 'left') {
                const newWidth = Math.max(4, currentDrag.initialWidth - snappedDx);
                const newLeft = currentDrag.initialLeft + (currentDrag.initialWidth - newWidth);
                nextOptimistic = { left: newLeft, width: newWidth };
            } else {
                nextOptimistic = { 
                    left: currentDrag.initialLeft + snappedDx, 
                    width: currentDrag.initialWidth 
                };
            }

            setOptimistic(nextOptimistic);
            optimisticRef.current = nextOptimistic;
        };

        const handleMouseUp = () => {
            const currentOptimistic = optimisticRef.current;
            if (currentOptimistic) {
                const newLeftMins = Math.round(currentOptimistic.left / zoomLevel);
                const newDurationMins = Math.round(currentOptimistic.width / zoomLevel);
                const newStartDate = addMinutes(timelineStart, newLeftMins);
                
                const updates: Partial<Task> = {
                    startDate: newStartDate.toISOString(), 
                    estimatedMinutes: newDurationMins 
                };
                if (task.dueDate) {
                    updates.dueDate = addMinutes(newStartDate, newDurationMins).toISOString();
                }
                
                updateTask(task.id, updates);
                setOptimistic(null);
                optimisticRef.current = null;
            }
            setDragState(null);
            dragStateRef.current = null;

            setTimeout(() => {
                wasDraggedRef.current = false;
            }, 50);
        };

        const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
        const handleTouchMove = (e: TouchEvent) => {
            const currentDrag = dragStateRef.current;
            if (currentDrag && (currentDrag.hasMoved || currentDrag.type !== 'move')) {
                e.preventDefault();
            }
            if (e.touches.length > 0) {
                handleMove(e.touches[0].clientX, e.touches[0].clientY);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchend', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleMouseUp);
        };
    }, [isDragging, zoomLevel, timelineStart, task.id, task.dueDate, updateTask]);

    const displayLeft = optimistic ? optimistic.left : task.leftMins * zoomLevel;
    const displayWidth = optimistic ? optimistic.width : Math.max(4, task.durationMins * zoomLevel);

    const subjectColor = useMemo(() => {
        return subject?.colorToken ? getSubjectColor(subject.colorToken) : null;
    }, [subject]);

    const baseColorClass = !subjectColor 
        ? (task.priority === 'HIGH' ? 'bg-red-500' : task.priority === 'MEDIUM' ? 'bg-amber-500' : 'bg-indigo-500') 
        : '';

    const currentLeftMins = Math.round(displayLeft / zoomLevel);
    const currentDurationMins = Math.round(displayWidth / zoomLevel);
    const currentStartDate = useMemo(() => addMinutes(timelineStart, currentLeftMins), [timelineStart, currentLeftMins]);
    const currentEndDate = useMemo(() => addMinutes(currentStartDate, currentDurationMins), [currentStartDate, currentDurationMins]);
    const startStr = useMemo(() => format(currentStartDate, 'HH:mm'), [currentStartDate]);
    const endStr = useMemo(() => format(currentEndDate, 'HH:mm'), [currentEndDate]);

    return (
        <>
            {/* Línies guies magnètiques en ajustar dates/hores a Timeline */}
            {dragState && (
                <>
                    {/* Línia guia esquerra (inici) */}
                    <div 
                        aria-hidden="true"
                        className="absolute w-[2px] bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,1)] pointer-events-none z-50"
                        style={{
                            left: `${displayLeft}px`,
                            top: `${task.trackIndex * 46 + 26}px`,
                            height: '44px'
                        }}
                    >
                        <span className={`absolute -top-5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[10px] font-bold shadow-md font-mono tracking-wider transition-transform ${dragState.type === 'left' ? 'bg-emerald-500 text-slate-950 scale-105 ring-2 ring-emerald-300' : 'bg-emerald-500 text-slate-950'}`}>
                            {startStr}
                        </span>
                    </div>

                    {/* Línia guia dreta (fi) */}
                    <div 
                        aria-hidden="true"
                        className="absolute w-[2px] bg-emerald-400/90 shadow-[0_0_10px_rgba(52,211,153,0.8)] pointer-events-none z-50"
                        style={{
                            left: `${displayLeft + displayWidth}px`,
                            top: `${task.trackIndex * 46 + 26}px`,
                            height: '44px'
                        }}
                    >
                        <span className={`absolute -bottom-5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[10px] font-bold shadow-md font-mono tracking-wider transition-transform ${dragState.type === 'right' ? 'bg-emerald-600 text-white scale-105 ring-2 ring-emerald-400' : 'bg-emerald-600 text-white'}`}>
                            {endStr}
                        </span>
                    </div>
                </>
            )}

            <div
                role="button"
                tabIndex={0}
                aria-label={`${task.title || 'Sense títol'}, ${startStr} a ${endStr}`}
                onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dispatchOpenTaskContextMenu({ x: e.clientX, y: e.clientY, task });
                }}
                onMouseDown={(e) => {
                    if (e.button === 0) {
                        setDragState({ type: 'move', initialX: e.clientX, initialLeft: displayLeft, initialWidth: displayWidth });
                    }
                }}
                onTouchStart={(e) => {
                    e.stopPropagation();
                    setDragState({ 
                        type: 'move', 
                        initialX: e.touches[0].clientX, 
                        initialLeft: displayLeft, 
                        initialWidth: displayWidth, 
                        isTouch: true, 
                        touchStartY: e.touches[0].clientY, 
                        hasMoved: false 
                    });
                }}
                onClick={(e) => {
                    if (wasDraggedRef.current) return;
                    
                    const clickNow = Date.now();
                    if (clickNow - lastTapRef.current < 300) {
                        dispatchOpenTaskPopover({ x: e.clientX, y: e.clientY, taskId: task.id });
                        lastTapRef.current = 0;
                    } else {
                        lastTapRef.current = clickNow;
                    }
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        const rect = e.currentTarget.getBoundingClientRect();
                        dispatchOpenTaskPopover({ 
                            x: rect.left + rect.width / 2, 
                            y: rect.top + rect.height / 2, 
                            taskId: task.id 
                        });
                    }
                }}
                className={`absolute h-8 rounded-md flex items-center px-2 group overflow-hidden transition duration-200 ${baseColorClass} border ${
                    dragState 
                        ? 'border-emerald-400/90 shadow-[0_0_20px_rgba(52,211,153,0.35)] z-40 brightness-110' 
                        : 'border-white/20 shadow-lg hover:brightness-110 hover:z-30 cursor-pointer'
                } outline-none focus-visible:ring-2 focus-visible:ring-white/40`}
                style={{
                    left: displayLeft,
                    width: displayWidth,
                    top: task.trackIndex * 46 + 32,
                    ...(subjectColor ? { backgroundColor: subjectColor.primary } : {})
                }}
                title={`${task.title || 'Sense títol'} \n${format(task.start, 'HH:mm')} - ${format(task.end, 'HH:mm')}`}
            >
                {/* Capa de degradat per donar profunditat visual al color */}
                <div className="absolute inset-0 bg-linear-to-br from-white/30 via-transparent to-black/40 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 pointer-events-none mix-blend-overlay" />

                {/* Tirador d'ajust esquerre */}
                {displayWidth >= 12 && (
                    <div 
                        className={`absolute left-0 top-0 bottom-0 w-3 max-md:w-6 cursor-col-resize z-20 flex items-center justify-start pl-[2px] md:pl-[3px] group/handle ${
                            dragState?.type === 'left' ? 'bg-emerald-400/30' : 'hover:bg-white/20'
                        }`}
                        onMouseDown={(e) => { 
                            e.stopPropagation(); 
                            setDragState({ type: 'left', initialX: e.clientX, initialLeft: displayLeft, initialWidth: displayWidth }); 
                        }}
                        onTouchStart={(e) => { 
                            e.stopPropagation(); 
                            setDragState({ 
                                type: 'left', 
                                initialX: e.touches[0].clientX, 
                                initialLeft: displayLeft, 
                                initialWidth: displayWidth, 
                                isTouch: true, 
                                touchStartY: e.touches[0].clientY, 
                                hasMoved: false 
                            }); 
                        }}
                    >
                        <div className={`w-[3px] h-3 rounded-full transition duration-200 ${
                            dragState?.type === 'left' ? 'bg-emerald-400 scale-y-150 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-white/40 group-hover/handle:bg-white/80 group-hover/handle:scale-y-150'
                        }`} />
                    </div>
                )}
                
                {displayWidth > 50 && (
                    <div className="truncate text-[11px] font-bold text-white drop-shadow-md z-10 px-2 max-md:px-4 pointer-events-none select-none tracking-wide flex items-center gap-1.5">
                        <span className="truncate">{task.title || 'Sense títol'}</span>
                        {dragState && (
                            <span className="text-[8px] uppercase tracking-wider bg-emerald-500/30 border border-emerald-400/50 px-1 py-0.2 rounded text-emerald-200 font-bold font-mono shrink-0">
                                Snap 5m
                            </span>
                        )}
                    </div>
                )}
                
                {/* Tirador d'ajust dret */}
                {displayWidth >= 12 && (
                    <div 
                        className={`absolute right-0 top-0 bottom-0 w-3 max-md:w-6 cursor-col-resize z-20 flex items-center justify-end pr-[2px] md:pr-[3px] group/handle ${
                            dragState?.type === 'right' ? 'bg-emerald-400/30' : 'hover:bg-white/20'
                        }`}
                        onMouseDown={(e) => { 
                            e.stopPropagation(); 
                            setDragState({ type: 'right', initialX: e.clientX, initialLeft: displayLeft, initialWidth: displayWidth }); 
                        }}
                        onTouchStart={(e) => { 
                            e.stopPropagation(); 
                            setDragState({ 
                                type: 'right', 
                                initialX: e.touches[0].clientX, 
                                initialLeft: displayLeft, 
                                initialWidth: displayWidth, 
                                isTouch: true, 
                                touchStartY: e.touches[0].clientY, 
                                hasMoved: false 
                            }); 
                        }}
                    >
                        <div className={`w-[3px] h-3 rounded-full transition duration-200 ${
                            dragState?.type === 'right' ? 'bg-emerald-400 scale-y-150 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-white/40 group-hover/handle:bg-white/80 group-hover/handle:scale-y-150'
                        }`} />
                    </div>
                )}
            </div>
        </>
    );
});

TaskBar.displayName = 'TaskBar';
