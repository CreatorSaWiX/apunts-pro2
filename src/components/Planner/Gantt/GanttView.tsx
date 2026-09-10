import React, { useState, useRef, useEffect, useMemo } from 'react';
import { flushSync } from 'react-dom';
import { format, addDays, addMinutes } from 'date-fns';
import { ca } from 'date-fns/locale';
import { useTasks } from '../../../contexts/TasksContext';
import { useShallow } from 'zustand/react/shallow';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import type { Task, Subject } from '../../../types/tasks';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor, closestCorners, useDroppable, type DragEndEvent } from '@dnd-kit/core';
import { createPortal } from 'react-dom';
import UnscheduledDrawer from '../UnscheduledDrawer';
import TaskCard from '../Board/TaskCard';
import { getSubjectColor } from '../../../stores/useSubjectStore';

const GanttView: React.FC = () => {
    const { filteredTasks: tasks, updateTask, subjects } = useTasks(useShallow(state => ({
        filteredTasks: state.filteredTasks,
        updateTask: state.updateTask,
        subjects: state.subjects
    })));
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const { setNodeRef: setDroppableRef } = useDroppable({
        id: 'gantt-timeline'
    });

    const setRefs = (node: HTMLDivElement | null) => {
        // assign both refs
        scrollContainerRef.current = node;
        setDroppableRef(node);
    };

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    // Zoom Level: pixels per minute
    const [zoomLevel, setZoomLevel] = useState(() => {
        const saved = localStorage.getItem('gantt_zoom');
        return saved ? parseFloat(saved) : 2;
    });
    
    useEffect(() => {
        localStorage.setItem('gantt_zoom', zoomLevel.toString());
    }, [zoomLevel]);
    
    // Timeline window: dynamic rolling window based on container width
    const [baseDate, setBaseDate] = useState(() => new Date());
    const [containerWidth, setContainerWidth] = useState(() => typeof window !== 'undefined' ? window.innerWidth : 1920);

    useEffect(() => {
        const updateWidth = () => {
            if (scrollContainerRef.current) {
                setContainerWidth(scrollContainerRef.current.clientWidth || window.innerWidth);
            }
        };
        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    const viewportMinutes = containerWidth / zoomLevel;
    const totalMinutes = viewportMinutes * 12;
    const totalWidthPixels = totalMinutes * zoomLevel;

    const timelineStart = useMemo(() => {
        return new Date(baseDate.getTime() - (totalMinutes / 2) * 60000);
    }, [baseDate, totalMinutes]);

    const timelineEnd = useMemo(() => {
        return new Date(timelineStart.getTime() + totalMinutes * 60000);
    }, [timelineStart, totalMinutes]);

    // Track current time
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(interval);
    }, []);

    // Initial centering
    useEffect(() => {
        if (scrollContainerRef.current) {
            const nowMinutes = (now.getTime() - timelineStart.getTime()) / 60000;
            const nowPixels = nowMinutes * zoomLevel;
            scrollContainerRef.current.scrollLeft = nowPixels - scrollContainerRef.current.clientWidth / 2;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [containerWidth]);

    const isShiftingRef = useRef(false);

    // Infinite scroll handling (seamlessly re-centers window when approaching buffer edge)
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        if (target.clientWidth === 0 || isShiftingRef.current) return;
        
        const threshold = 2 * target.clientWidth;
        const maxScroll = target.scrollWidth - target.clientWidth;

        if (target.scrollLeft < threshold || target.scrollLeft > maxScroll - threshold) {
            isShiftingRef.current = true;
            
            // Calculate the timestamp currently at the center of the viewport
            const centerScreenPx = target.scrollLeft + target.clientWidth / 2;
            const centerMinutes = centerScreenPx / zoomLevel;
            const currentCenterTime = new Date(timelineStart.getTime() + centerMinutes * 60000);

            flushSync(() => {
                setBaseDate(currentCenterTime);
            });

            target.scrollLeft = (totalWidthPixels / 2) - target.clientWidth / 2;

            requestAnimationFrame(() => {
                isShiftingRef.current = false;
            });
        }
    };

    // Zoom Handling (relative to the center of the visible viewport)
    const handleZoomChange = (newZoom: number) => {
        if (!scrollContainerRef.current) return;
        const target = scrollContainerRef.current;
        if (target.clientWidth === 0) return;
        
        // Calculate the timestamp currently at the center of the viewport
        const centerScreenPx = target.scrollLeft + target.clientWidth / 2;
        const centerMinutes = centerScreenPx / zoomLevel;
        const centerTime = new Date(timelineStart.getTime() + centerMinutes * 60000);
        
        flushSync(() => {
            setBaseDate(centerTime);
            setZoomLevel(newZoom);
        });
        
        target.scrollLeft = (totalWidthPixels / 2) - target.clientWidth / 2;
    };

    // Ruler configuration based on zoom
    const getRulerConfig = () => {
        if (zoomLevel >= 15) return { intervalMins: 5, label: 'HH:mm' };
        if (zoomLevel >= 8) return { intervalMins: 10, label: 'HH:mm' };
        if (zoomLevel >= 4) return { intervalMins: 15, label: 'HH:mm' };
        if (zoomLevel >= 2) return { intervalMins: 30, label: 'HH:mm' };
        if (zoomLevel >= 1) return { intervalMins: 60, label: 'HH:mm' };
        if (zoomLevel >= 0.5) return { intervalMins: 60 * 3, label: 'dd MMM HH:mm' };
        if (zoomLevel >= 0.2) return { intervalMins: 60 * 6, label: 'dd MMM HH:mm' };
        if (zoomLevel >= 0.05) return { intervalMins: 60 * 24, label: 'dd MMM' };
        return { intervalMins: 60 * 24 * 7, label: 'dd MMM' };
    };
    
    const rulerConfig = getRulerConfig();

    // Generate labels aligned to clean time intervals in local time
    const labels = useMemo(() => {
        const arr = [];
        const intervalMins = rulerConfig.intervalMins;
        const start = new Date(timelineStart.getTime());

        let current: Date;
        if (intervalMins >= 1440) {
            current = new Date(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0, 0);
            if (current.getTime() < start.getTime()) {
                current = addDays(current, 1);
            }
        } else if (intervalMins >= 60) {
            const hoursStep = intervalMins / 60;
            const hour = Math.ceil(start.getHours() / hoursStep) * hoursStep;
            current = new Date(start.getFullYear(), start.getMonth(), start.getDate(), hour, 0, 0, 0);
        } else {
            const mins = Math.ceil(start.getMinutes() / intervalMins) * intervalMins;
            current = new Date(start.getFullYear(), start.getMonth(), start.getDate(), start.getHours(), mins, 0, 0);
        }

        const startMs = timelineStart.getTime();
        const endMs = timelineEnd.getTime();

        while (current.getTime() <= endMs) {
            const minutes = (current.getTime() - startMs) / 60000;
            arr.push({ minutes, date: new Date(current.getTime()) });
            current = addMinutes(current, intervalMins);
        }

        return arr;
    }, [timelineStart, timelineEnd, rulerConfig.intervalMins]);

    // Smart Stacking Algorithm (filters tasks that fall within the current timeline window buffer)
    const tasksWithLayout = useMemo(() => {
        const scheduledTasks = tasks.filter(t => t.startDate || t.dueDate);
        const bufferMs = 24 * 60 * 60000; // 24 hours buffer
        const winStart = timelineStart.getTime() - bufferMs;
        const winEnd = timelineEnd.getTime() + bufferMs;

        const visibleTasks = scheduledTasks.filter(t => {
            const start = t.startDate ? new Date(t.startDate).getTime() : new Date().getTime();
            const end = t.dueDate ? new Date(t.dueDate).getTime() : (start + (t.estimatedMinutes || 60) * 60000);
            return end >= winStart && start <= winEnd;
        });

        const sorted = [...visibleTasks].sort((a, b) => {
            const aStart = a.startDate ? new Date(a.startDate).getTime() : new Date().getTime();
            const bStart = b.startDate ? new Date(b.startDate).getTime() : new Date().getTime();
            return aStart - bStart;
        });

        return sorted.map((task, index) => {
            const start = task.startDate ? new Date(task.startDate) : new Date();
            const end = task.dueDate ? new Date(task.dueDate) : addDays(start, task.estimatedMinutes ? task.estimatedMinutes / 1440 : 1);
            const durationMins = Math.max(5, (end.getTime() - start.getTime()) / 60000);

            const leftMins = (start.getTime() - timelineStart.getTime()) / 60000;
            return { ...task, start, end, durationMins, trackIndex: index, leftMins };
        });
    }, [tasks, timelineStart, timelineEnd]);



    const unplannedTasks = useMemo(() => tasks.filter(t => !t.startDate), [tasks]);

    const onDragEnd = (event: DragEndEvent) => {
        const { over, active } = event;
        const task = active.data.current?.task as Task | undefined;
        
        if (over && over.id === 'gantt-timeline' && task && scrollContainerRef.current && active.rect.current.translated) {
            const dropClientX = active.rect.current.translated.left + (active.rect.current.translated.width / 2);
            const containerRect = scrollContainerRef.current.getBoundingClientRect();
            const relativeX = dropClientX - containerRect.left;
            const absoluteX = scrollContainerRef.current.scrollLeft + relativeX;
            
            const minutesFromStart = absoluteX / zoomLevel;
            const newStartDate = addMinutes(timelineStart, minutesFromStart);
            
            const snappedMins = Math.round(newStartDate.getMinutes() / 5) * 5;
            newStartDate.setMinutes(snappedMins);
            newStartDate.setSeconds(0);
            
            updateTask(task.id, { startDate: newStartDate.toISOString() });
        }
        setActiveTask(null);
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={(e) => setActiveTask(e.active.data.current?.task)}
            onDragEnd={onDragEnd}
            onDragCancel={() => setActiveTask(null)}
        >
            <div className="flex flex-col h-full bg-[#0B0F19] rounded-2xl overflow-hidden border border-white/[0.05] shadow-2xl relative">
                
                {/* Scrollable Timeline */}
                <div 
                    ref={setRefs}
                    onScroll={handleScroll}
                    className="flex-1 overflow-auto relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] cursor-grab active:cursor-grabbing"
                >
                <div 
                    className="relative min-h-full overflow-hidden" 
                    style={{ width: totalWidthPixels }}
                >
                    {/* Vertical Timeline Grid Lines */}
                    <div className="absolute inset-0 top-8 pointer-events-none z-0">
                        {labels.map(l => {
                            const isDayBoundary = l.date.getHours() === 0 && l.date.getMinutes() === 0;
                            const isMonday = l.date.getDay() === 1;
                            const borderClass = rulerConfig.intervalMins >= 1440
                                ? (isMonday ? 'border-white/[0.14]' : 'border-white/[0.06]')
                                : (isDayBoundary ? 'border-white/[0.14]' : 'border-white/[0.05]');

                            return (
                                <div 
                                    key={l.minutes}
                                    className={`absolute top-0 bottom-0 border-l ${borderClass}`}
                                    style={{ left: l.minutes * zoomLevel }}
                                />
                            );
                        })}
                    </div>

                    {/* Time Ruler Header */}
                    <div className="sticky top-0 h-8 bg-slate-900/80 backdrop-blur-md border-b border-white/[0.05] z-20 overflow-hidden pointer-events-none">
                        {labels.map(l => {
                            const isDayBoundary = l.date.getHours() === 0 && l.date.getMinutes() === 0;
                            const isMonday = l.date.getDay() === 1;
                            const isHighlighted = rulerConfig.intervalMins >= 1440 ? isMonday : isDayBoundary;

                            return (
                                <div 
                                    key={l.minutes}
                                    className={`absolute top-0 h-full border-l pl-2 pt-1.5 text-[10px] font-semibold tracking-wider ${
                                        isHighlighted 
                                            ? 'border-white/20 text-white font-bold' 
                                            : 'border-white/10 text-slate-400'
                                    }`}
                                    style={{ left: l.minutes * zoomLevel }}
                                >
                                    {isDayBoundary && rulerConfig.label === 'HH:mm' 
                                        ? format(l.date, 'dd MMM', { locale: ca }) 
                                        : format(l.date, rulerConfig.label, { locale: ca })
                                    }
                                </div>
                            );
                        })}
                    </div>

                    {/* Playhead (Now) */}
                    <div 
                        className="absolute top-8 bottom-0 w-px bg-red-500 z-10 shadow-[0_0_10px_rgba(239,68,68,1)] pointer-events-none"
                        style={{ left: ((now.getTime() - timelineStart.getTime()) / 60000) * zoomLevel }}
                    >
                        <div className="absolute top-0 -translate-x-1/2 -mt-1 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-[#0B0F19]" />
                    </div>

                    {/* Tracks Area */}
                    <div className="relative pt-6 pb-24" style={{ minHeight: `${tasksWithLayout.reduce((max, t) => Math.max(max, t.trackIndex), 0) * 50 + 100}px` }}>
                        
                        {tasksWithLayout.map((task: LayoutTask) => (
                            <TaskBar 
                                key={task.id} 
                                task={task} 
                                zoomLevel={zoomLevel} 
                                timelineStart={timelineStart} 
                                updateTask={updateTask} 
                                subject={subjects?.find(s => s.id === task.subjectId)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Floating Zoom Controls */}
            <div className="hidden lg:flex touch-landscape:hidden absolute bottom-6 right-6 z-40 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl items-center gap-4">
                <button
                    type="button"
                    onClick={() => {
                        flushSync(() => {
                            setBaseDate(new Date(now.getTime()));
                        });
                        if (scrollContainerRef.current) {
                            scrollContainerRef.current.scrollLeft = (totalWidthPixels / 2) - scrollContainerRef.current.clientWidth / 2;
                        }
                    }}
                    className="p-1.5 rounded-full bg-primary/20 hover:bg-primary/30 text-primary transition-colors cursor-pointer mr-2"
                    title="Vés a l'hora actual"
                    aria-label="Vés a l'hora actual">
                    <Maximize size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => handleZoomChange(Math.max(0.05, Math.round((zoomLevel - 0.2) * 100) / 100))}
                    className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-white/5"
                    title="Redueix el zoom"
                    aria-label="Redueix el zoom"
                >
                    <ZoomOut size={18} />
                </button>
                <input 
                    type="range" 
                    min="0.05" 
                    max="10" 
                    step="0.05" 
                    value={zoomLevel} 
                    onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
                    className="w-32 accent-primary cursor-pointer"
                />
                <button
                    type="button"
                    onClick={() => handleZoomChange(Math.min(10, Math.round((zoomLevel + 0.2) * 100) / 100))}
                    className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-white/5"
                    title="Augmenta el zoom"
                    aria-label="Augmenta el zoom"
                >
                    <ZoomIn size={18} />
                </button>
                <div className="text-xs font-bold text-slate-300 w-10 text-right">{Math.round(zoomLevel * 100)}%</div>
            </div>

            <UnscheduledDrawer tasks={unplannedTasks} />
            
            {createPortal(
                <DragOverlay zIndex={1000} dropAnimation={null}>
                    {activeTask ? (
                        <div className="w-72 pointer-events-none cursor-grabbing">
                            <TaskCard task={activeTask} isOverlay={true} />
                        </div>
                    ) : null}
                </DragOverlay>,
                document.body
            )}
        </div>
        </DndContext>
    );
};

type LayoutTask = Task & { start: Date; end: Date; durationMins: number; leftMins: number; trackIndex: number; };

const TaskBar: React.FC<{ task: LayoutTask, zoomLevel: number, timelineStart: Date, updateTask: (id: string, updates: Partial<Task>) => void, subject?: Subject }> = ({ task, zoomLevel, timelineStart, updateTask, subject }) => {
    const [dragState, setDragState] = useState<{ 
        type: 'left'|'right'|'move', 
        initialX: number, 
        initialLeft: number, 
        initialWidth: number,
        isTouch?: boolean,
        touchStartY?: number,
        hasMoved?: boolean
    } | null>(null);
    const [optimistic, setOptimistic] = useState<{left: number, width: number} | null>(null);
    const lastTapRef = useRef<number>(0);
    const wasDraggedRef = useRef<boolean>(false);

    useEffect(() => {
        if (!dragState) return;
        
        const handleMove = (clientX: number, clientY: number) => {
            const dx = clientX - dragState.initialX;
            
            // Check if touch moved significantly (distinguish tap, horizontal drag, vertical scroll)
            if (dragState.isTouch && !dragState.hasMoved) {
                const dy = clientY - (dragState.touchStartY || 0);
                if (Math.abs(dx) > 5) {
                    // Horizontal swipe: lock as task drag
                    setDragState(prev => prev ? { ...prev, hasMoved: true } : null);
                    wasDraggedRef.current = true;
                } else if (Math.abs(dy) > 5) {
                    // Vertical swipe: cancel task drag, allow native scrolling
                    setDragState(null);
                    return;
                } else {
                    return; // Wait for threshold
                }
            }

            // Detect desktop drag
            if (!dragState.isTouch && Math.abs(dx) > 3) {
                wasDraggedRef.current = true;
            }

            // Snap a 5 minuts
            const snapPixels = 5 * zoomLevel;
            const snappedDx = Math.round(dx / snapPixels) * snapPixels;

            if (dragState.type === 'right') {
                setOptimistic({ left: dragState.initialLeft, width: Math.max(4, dragState.initialWidth + snappedDx) });
            } else if (dragState.type === 'left') {
                const newWidth = Math.max(4, dragState.initialWidth - snappedDx);
                const newLeft = dragState.initialLeft + (dragState.initialWidth - newWidth);
                setOptimistic({ left: newLeft, width: newWidth });
            } else if (dragState.type === 'move') {
                setOptimistic({ left: dragState.initialLeft + snappedDx, width: dragState.initialWidth });
            }
        };

        const handleMouseUp = (e: MouseEvent | TouchEvent) => {
            if (optimistic) {
                const newLeftMins = Math.round(optimistic.left / zoomLevel);
                const newDurationMins = Math.round(optimistic.width / zoomLevel);
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
            }
            setDragState(null);

            // Allow click handler to see drag state, then reset
            setTimeout(() => {
                wasDraggedRef.current = false;
            }, 50);
        };

        const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
        const handleTouchMove = (e: TouchEvent) => {
            if (dragState.hasMoved || dragState.type !== 'move') {
                e.preventDefault(); // Prevent scrolling while dragging task
            }
            handleMove(e.touches[0].clientX, e.touches[0].clientY);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dragState, optimistic, zoomLevel, timelineStart, task.id, updateTask]);

    const displayLeft = optimistic ? optimistic.left : task.leftMins * zoomLevel;
    const displayWidth = optimistic ? optimistic.width : Math.max(4, task.durationMins * zoomLevel);

    const subjectColor = subject?.colorToken ? getSubjectColor(subject.colorToken) : null;
    const baseColorClass = !subjectColor ? 
        (task.priority === 'HIGH' ? 'bg-red-500' : task.priority === 'MEDIUM' ? 'bg-amber-500' : 'bg-indigo-500') : '';

    const currentLeftMins = Math.round(displayLeft / zoomLevel);
    const currentDurationMins = Math.round(displayWidth / zoomLevel);
    const currentStartDate = addMinutes(timelineStart, currentLeftMins);
    const currentEndDate = addMinutes(currentStartDate, currentDurationMins);
    const startStr = format(currentStartDate, 'HH:mm');
    const endStr = format(currentEndDate, 'HH:mm');

    return (
        <>
            {/* Línies guies magnètiques en ajustar dates/hores a Timeline */}
            {dragState && (
                <>
                    {/* Línia guia esquerra (inici) */}
                    <div 
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
                onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.dispatchEvent(new CustomEvent('open-task-context-menu', { detail: { x: e.clientX, y: e.clientY, task } }));
                }}
                onMouseDown={(e) => {
                    if (e.button === 0) { // left click only
                        setDragState({ type: 'move', initialX: e.clientX, initialLeft: displayLeft, initialWidth: displayWidth });
                    }
                }}
                onTouchStart={(e) => {
                    e.stopPropagation();
                    setDragState({ type: 'move', initialX: e.touches[0].clientX, initialLeft: displayLeft, initialWidth: displayWidth, isTouch: true, touchStartY: e.touches[0].clientY, hasMoved: false });
                }}
                onClick={(e) => {
                    if (wasDraggedRef.current) return;
                    
                    const now = Date.now();
                    if (now - lastTapRef.current < 300) {
                        window.dispatchEvent(new CustomEvent('open-task-popover', { detail: { x: e.clientX, y: e.clientY, taskId: task.id } }));
                        lastTapRef.current = 0;
                    } else {
                        lastTapRef.current = now;
                    }
                }}
                className={`absolute h-8 rounded-md flex items-center px-2 group overflow-hidden transition duration-200 ${baseColorClass} border ${dragState ? 'border-emerald-400/90 shadow-[0_0_20px_rgba(52,211,153,0.35)] z-40 brightness-110' : 'border-white/20 shadow-lg hover:brightness-110 hover:z-30 cursor-pointer'}`}
                style={{
                    left: displayLeft,
                    width: displayWidth,
                    top: task.trackIndex * 46 + 32,
                    ...(subjectColor ? { backgroundColor: subjectColor.primary } : {})
                }}
                title={`${task.title} \n${format(task.start, 'HH:mm')} - ${format(task.end, 'HH:mm')}`}
            >
                {/* Capa de degradat fosc/clar per donar profunditat al color base */}
                <div className="absolute inset-0 bg-linear-to-br from-white/30 via-transparent to-black/40 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 pointer-events-none mix-blend-overlay" />

                {/* Left handle */}
                {displayWidth >= 12 && (
                    <div 
                        className={`absolute left-0 top-0 bottom-0 w-3 max-md:w-6 cursor-col-resize z-20 flex items-center justify-start pl-[2px] md:pl-[3px] group/handle ${dragState?.type === 'left' ? 'bg-emerald-400/30' : 'hover:bg-white/20'}`}
                        onMouseDown={(e) => { e.stopPropagation(); setDragState({ type: 'left', initialX: e.clientX, initialLeft: displayLeft, initialWidth: displayWidth }); }}
                        onTouchStart={(e) => { e.stopPropagation(); setDragState({ type: 'left', initialX: e.touches[0].clientX, initialLeft: displayLeft, initialWidth: displayWidth, isTouch: true, touchStartY: e.touches[0].clientY, hasMoved: false }); }}
                    >
                        <div className={`w-[3px] h-3 rounded-full transition duration-200 ${dragState?.type === 'left' ? 'bg-emerald-400 scale-y-150 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-white/40 group-hover/handle:bg-white/80 group-hover/handle:scale-y-150'}`} />
                    </div>
                )}
                
                {displayWidth > 50 && (
                    <div className="truncate text-[11px] font-bold text-white drop-shadow-md z-10 px-2 max-md:px-4 pointer-events-none select-none tracking-wide flex items-center gap-1.5">
                        <span className="truncate">{task.title}</span>
                        {dragState && (
                            <span className="text-[8px] uppercase tracking-wider bg-emerald-500/30 border border-emerald-400/50 px-1 py-0.2 rounded text-emerald-200 font-bold font-mono shrink-0">
                                Snap 5m
                            </span>
                        )}
                    </div>
                )}
                
                {/* Right handle */}
                {displayWidth >= 12 && (
                    <div 
                        className={`absolute right-0 top-0 bottom-0 w-3 max-md:w-6 cursor-col-resize z-20 flex items-center justify-end pr-[2px] md:pr-[3px] group/handle ${dragState?.type === 'right' ? 'bg-emerald-400/30' : 'hover:bg-white/20'}`}
                        onMouseDown={(e) => { e.stopPropagation(); setDragState({ type: 'right', initialX: e.clientX, initialLeft: displayLeft, initialWidth: displayWidth }); }}
                        onTouchStart={(e) => { e.stopPropagation(); setDragState({ type: 'right', initialX: e.touches[0].clientX, initialLeft: displayLeft, initialWidth: displayWidth, isTouch: true, touchStartY: e.touches[0].clientY, hasMoved: false }); }}
                    >
                        <div className={`w-[3px] h-3 rounded-full transition duration-200 ${dragState?.type === 'right' ? 'bg-emerald-400 scale-y-150 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-white/40 group-hover/handle:bg-white/80 group-hover/handle:scale-y-150'}`} />
                    </div>
                )}
            </div>
        </>
    );
};

export default GanttView;
