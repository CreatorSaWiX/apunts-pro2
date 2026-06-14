import React, { useState, useRef, useEffect, useMemo } from 'react';
import { flushSync } from 'react-dom';
import { format, addDays, subDays, differenceInMinutes, addMinutes } from 'date-fns';
import { ca } from 'date-fns/locale';
import { useTasks } from '../../../contexts/TasksContext';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import type { Task } from '../../../types/tasks';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor, closestCorners, useDroppable, type DragEndEvent } from '@dnd-kit/core';
import { createPortal } from 'react-dom';
import UnscheduledDrawer from '../UnscheduledDrawer';
import TaskCard from '../Board/TaskCard';

const GanttView: React.FC = () => {
    const { tasks, updateTask } = useTasks();
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
    
    // Timeline window: we render a 28-day rolling window
    const [baseDate, setBaseDate] = useState(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    });

    const timelineStart = useMemo(() => subDays(baseDate, 14), [baseDate]);
    const totalMinutes = 28 * 24 * 60;
    const totalWidthPixels = totalMinutes * zoomLevel;

    // Track current time
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(interval);
    }, []);

    // Initial centering
    useEffect(() => {
        if (scrollContainerRef.current) {
            const nowMinutes = differenceInMinutes(now, timelineStart);
            const nowPixels = nowMinutes * zoomLevel;
            scrollContainerRef.current.scrollLeft = nowPixels - scrollContainerRef.current.clientWidth / 2;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Infinite scroll handling
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        const widthPer7Days = 7 * 24 * 60 * zoomLevel;

        if (target.scrollLeft < widthPer7Days) {
            flushSync(() => {
                setBaseDate(prev => subDays(prev, 7));
            });
            target.scrollLeft += widthPer7Days;
        } else if (target.scrollLeft > 3 * widthPer7Days) { // total is 4 * 7 days
            flushSync(() => {
                setBaseDate(prev => addDays(prev, 7));
            });
            target.scrollLeft -= widthPer7Days;
        }
    };

    // Zoom Handling
    const handleZoomChange = (newZoom: number) => {
        if (!scrollContainerRef.current) return;
        const target = scrollContainerRef.current;
        const centerMinutes = (target.scrollLeft + target.clientWidth / 2) / zoomLevel;
        
        flushSync(() => {
            setZoomLevel(newZoom);
        });
        
        target.scrollLeft = (centerMinutes * newZoom) - target.clientWidth / 2;
    };

    // Ruler configuration based on zoom
    const getRulerConfig = () => {
        if (zoomLevel >= 10) return { intervalMins: 15, label: 'HH:mm' };
        if (zoomLevel >= 2) return { intervalMins: 60, label: 'HH:mm' };
        if (zoomLevel >= 0.5) return { intervalMins: 60 * 6, label: 'dd MMM HH:mm' };
        if (zoomLevel >= 0.1) return { intervalMins: 60 * 24, label: 'dd MMM' };
        return { intervalMins: 60 * 24 * 7, label: 'dd MMM' };
    };
    
    const rulerConfig = getRulerConfig();
    const gridTickPixels = rulerConfig.intervalMins * zoomLevel;

    // Generate labels
    const labels = useMemo(() => {
        const arr = [];
        for (let m = 0; m <= totalMinutes; m += rulerConfig.intervalMins) {
            arr.push({ minutes: m, date: addMinutes(timelineStart, m) });
        }
        return arr;
    }, [totalMinutes, rulerConfig.intervalMins, timelineStart]);

    // Smart Stacking Algorithm
    const scheduledTasks = tasks.filter(t => t.startDate || t.dueDate);
    const tasksWithLayout = useMemo(() => {
        const sorted = [...scheduledTasks].sort((a, b) => {
            const aStart = a.startDate ? new Date(a.startDate).getTime() : new Date().getTime();
            const bStart = b.startDate ? new Date(b.startDate).getTime() : new Date().getTime();
            return aStart - bStart;
        });

        return sorted.map((task, index) => {
            const start = task.startDate ? new Date(task.startDate) : new Date();
            const end = task.dueDate ? new Date(task.dueDate) : addDays(start, task.estimatedMinutes ? task.estimatedMinutes / 1440 : 1);
            const durationMins = Math.max(5, differenceInMinutes(end, start));

            const leftMins = differenceInMinutes(start, timelineStart);
            return { ...task, start, end, durationMins, trackIndex: index, leftMins };
        });
    }, [scheduledTasks, timelineStart]);

    const getPriorityColor = (priority: string) => {
        if (priority === 'HIGH') return 'from-red-500/80 to-red-600/80 border-red-400/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]';
        if (priority === 'MEDIUM') return 'from-amber-500/80 to-amber-600/80 border-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]';
        return 'from-primary/80 to-indigo-600/80 border-primary/50 shadow-[0_0_15px_rgba(99,102,241,0.3)]';
    };

    const unplannedTasks = tasks.filter(t => !t.startDate);

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
        >
            <div className="flex flex-col h-full bg-[#0B0F19] rounded-2xl overflow-hidden border border-white/[0.05] shadow-2xl relative">
                
                {/* Scrollable Timeline */}
                <div 
                    ref={setRefs}
                    onScroll={handleScroll}
                    className="flex-1 overflow-auto relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] cursor-grab active:cursor-grabbing"
                >
                <div 
                    className="relative min-h-full" 
                    style={{ width: totalWidthPixels, backgroundImage: `repeating-linear-gradient(to right, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent ${gridTickPixels}px)` }}
                >
                    {/* Time Ruler Header */}
                    <div className="sticky top-0 h-8 bg-slate-900/80 backdrop-blur-md border-b border-white/[0.05] z-20 overflow-hidden pointer-events-none">
                        {labels.map(l => (
                            <div 
                                key={l.minutes}
                                className="absolute top-0 h-full border-l border-white/10 pl-2 pt-1.5 text-[10px] font-semibold text-slate-400 tracking-wider"
                                style={{ left: l.minutes * zoomLevel }}
                            >
                                {format(l.date, rulerConfig.label, { locale: ca })}
                            </div>
                        ))}
                    </div>

                    {/* Playhead (Now) */}
                    <div 
                        className="absolute top-8 bottom-0 w-px bg-red-500 z-10 shadow-[0_0_10px_rgba(239,68,68,1)] pointer-events-none"
                        style={{ left: differenceInMinutes(now, timelineStart) * zoomLevel }}
                    >
                        <div className="absolute top-0 -translate-x-1/2 -mt-1 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-[#0B0F19]" />
                    </div>

                    {/* Tracks Area */}
                    <div className="relative pt-6 pb-24" style={{ minHeight: `${tasksWithLayout.reduce((max, t) => Math.max(max, t.trackIndex), 0) * 50 + 100}px` }}>
                        
                        {/* Task Bars */}
                        {tasksWithLayout.map(task => (
                            <TaskBar 
                                key={task.id} 
                                task={task} 
                                zoomLevel={zoomLevel} 
                                timelineStart={timelineStart} 
                                updateTask={updateTask} 
                                getPriorityColor={getPriorityColor} 
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Floating Zoom Controls */}
            <div className="absolute bottom-6 right-6 z-40 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center gap-4">
                <button 
                    onClick={() => {
                        if (scrollContainerRef.current) {
                            const nowMins = differenceInMinutes(now, timelineStart);
                            scrollContainerRef.current.scrollTo({ left: nowMins * zoomLevel - scrollContainerRef.current.clientWidth / 2, behavior: 'smooth' });
                        }
                    }}
                    className="p-1.5 rounded-full bg-primary/20 hover:bg-primary/30 text-primary transition-colors cursor-pointer mr-2"
                    title="Vés a l'hora actual"
                >
                    <Maximize size={16} />
                </button>
                <ZoomOut size={18} className="text-slate-400" />
                <input 
                    type="range" 
                    min="0.05" 
                    max="10" 
                    step="0.05" 
                    value={zoomLevel} 
                    onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
                    className="w-32 accent-primary cursor-pointer"
                />
                <ZoomIn size={18} className="text-slate-400" />
                <div className="text-xs font-bold text-slate-300 w-10 text-right">{Math.round(zoomLevel * 100)}%</div>
            </div>

            <UnscheduledDrawer tasks={unplannedTasks} />
            
            {createPortal(
                <DragOverlay zIndex={1000} dropAnimation={null}>
                    {activeTask ? <TaskCard task={activeTask} /> : null}
                </DragOverlay>,
                document.body
            )}
        </div>
        </DndContext>
    );
};

const TaskBar: React.FC<{ task: any, zoomLevel: number, timelineStart: Date, updateTask: any, getPriorityColor: any }> = ({ task, zoomLevel, timelineStart, updateTask, getPriorityColor }) => {
    const [dragState, setDragState] = useState<{ type: 'left'|'right', initialX: number, initialLeft: number, initialWidth: number } | null>(null);
    const [optimistic, setOptimistic] = useState<{left: number, width: number} | null>(null);

    useEffect(() => {
        if (!dragState) return;
        
        const handleMouseMove = (e: MouseEvent) => {
            const dx = e.clientX - dragState.initialX;
            
            // Snap a 5 minuts
            const snapPixels = 5 * zoomLevel;
            const snappedDx = Math.round(dx / snapPixels) * snapPixels;

            if (dragState.type === 'right') {
                setOptimistic({ left: dragState.initialLeft, width: Math.max(4, dragState.initialWidth + snappedDx) });
            } else {
                const newWidth = Math.max(4, dragState.initialWidth - snappedDx);
                const newLeft = dragState.initialLeft + (dragState.initialWidth - newWidth);
                setOptimistic({ left: newLeft, width: newWidth });
            }
        };

        const handleMouseUp = () => {
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
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragState, optimistic, zoomLevel, timelineStart, task.id, updateTask]);

    const displayLeft = optimistic ? optimistic.left : task.leftMins * zoomLevel;
    const displayWidth = optimistic ? optimistic.width : Math.max(4, task.durationMins * zoomLevel);

    return (
        <div
            className={`absolute h-8 rounded-md border bg-gradient-to-r flex items-center px-2 group overflow-hidden transition-all duration-200 ${getPriorityColor(task.priority)} ${dragState ? 'z-40 shadow-2xl brightness-110' : 'hover:brightness-110 hover:z-30 cursor-pointer'}`}
            style={{
                left: displayLeft,
                width: displayWidth,
                top: task.trackIndex * 46 + 32,
            }}
            title={`${task.title} \n${format(task.start, 'HH:mm')} - ${format(task.end, 'HH:mm')}`}
        >
            {/* Left handle */}
            {displayWidth >= 12 && (
                <div 
                    className="absolute left-0 top-0 bottom-0 w-3 cursor-col-resize hover:bg-white/30 z-20"
                    onMouseDown={(e) => { e.stopPropagation(); setDragState({ type: 'left', initialX: e.clientX, initialLeft: displayLeft, initialWidth: displayWidth }); }}
                />
            )}
            
            {displayWidth > 50 && (
                <div className="truncate text-xs font-bold text-white drop-shadow-md z-10 px-2 pointer-events-none select-none">{task.title}</div>
            )}
            
            {/* Right handle */}
            {displayWidth >= 12 && (
                <div 
                    className="absolute right-0 top-0 bottom-0 w-3 cursor-col-resize hover:bg-white/30 z-20"
                    onMouseDown={(e) => { e.stopPropagation(); setDragState({ type: 'right', initialX: e.clientX, initialLeft: displayLeft, initialWidth: displayWidth }); }}
                />
            )}

            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50 pointer-events-none" />
        </div>
    );
};

export default GanttView;
