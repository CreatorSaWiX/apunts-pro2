import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { flushSync, createPortal } from 'react-dom';
import { format, addDays, addMinutes } from 'date-fns';
import { ca } from 'date-fns/locale';
import { useTasks } from '../../../contexts/TasksContext';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import type { Task, Subject } from '../../../types/tasks';
import { 
    DndContext, 
    DragOverlay, 
    useSensor, 
    useSensors, 
    PointerSensor, 
    closestCorners, 
    useDroppable, 
    type DragEndEvent 
} from '@dnd-kit/core';
import UnscheduledDrawer from '../UnscheduledDrawer';
import TaskCard from '../Board/TaskCard';
import { TrackMinHeap, getRulerConfig } from './TrackMinHeap';
import type { LayoutTask } from './TrackMinHeap';
import { TaskBar } from './TaskBar';

const GanttView: React.FC = () => {
    // Selectors granulars de Zustand
    const tasks = useTasks(state => state.filteredTasks);
    const updateTask = useTasks(state => state.updateTask);
    const subjects = useTasks(state => state.subjects);

    // Mapa O(1) d'assignatures per no fer cerques lineals repetides a cada barra
    const subjectsMap = useMemo(() => {
        return new Map<string, Subject>(subjects.map(s => [s.id, s]));
    }, [subjects]);

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const { setNodeRef: setDroppableRef } = useDroppable({
        id: 'gantt-timeline'
    });

    const setRefs = useCallback((node: HTMLDivElement | null) => {
        scrollContainerRef.current = node;
        setDroppableRef(node);
    }, [setDroppableRef]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    // Nivell de zoom: píxels per minut
    const [zoomLevel, setZoomLevel] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('gantt_zoom');
            if (saved) {
                const parsed = parseFloat(saved);
                if (!isNaN(parsed) && parsed > 0) return parsed;
            }
        }
        return 2;
    });
    
    useEffect(() => {
        localStorage.setItem('gantt_zoom', zoomLevel.toString());
    }, [zoomLevel]);
    
    // Finestra de la línia temporal
    const [baseDate, setBaseDate] = useState(() => new Date());
    const [containerWidth, setContainerWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1920));

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

    // Rastreig de l'hora actual
    const [now, setNow] = useState(() => new Date());
    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(interval);
    }, []);

    // Centrat inicial
    useEffect(() => {
        if (scrollContainerRef.current) {
            const nowMinutes = (now.getTime() - timelineStart.getTime()) / 60000;
            const nowPixels = nowMinutes * zoomLevel;
            scrollContainerRef.current.scrollLeft = nowPixels - scrollContainerRef.current.clientWidth / 2;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [containerWidth]);

    const isShiftingRef = useRef(false);

    // Scroll infinit: re-centra la finestra de temps suaument en aproximar-se al límit del buffer
    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        if (target.clientWidth === 0 || isShiftingRef.current) return;
        
        const threshold = 2 * target.clientWidth;
        const maxScroll = target.scrollWidth - target.clientWidth;

        if (target.scrollLeft < threshold || target.scrollLeft > maxScroll - threshold) {
            isShiftingRef.current = true;
            
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
    }, [zoomLevel, timelineStart, totalWidthPixels]);

    // Canvi de nivell de zoom respecte al centre visible del viewport
    const handleZoomChange = useCallback((newZoom: number) => {
        if (!scrollContainerRef.current) return;
        const target = scrollContainerRef.current;
        if (target.clientWidth === 0) return;
        
        const centerScreenPx = target.scrollLeft + target.clientWidth / 2;
        const centerMinutes = centerScreenPx / zoomLevel;
        const centerTime = new Date(timelineStart.getTime() + centerMinutes * 60000);
        
        flushSync(() => {
            setBaseDate(centerTime);
            setZoomLevel(newZoom);
        });
        
        target.scrollLeft = (totalWidthPixels / 2) - target.clientWidth / 2;
    }, [zoomLevel, timelineStart, totalWidthPixels]);

    const rulerConfig = useMemo(() => getRulerConfig(zoomLevel), [zoomLevel]);

    // Generació d'etiquetes de temps per a la regla temporal
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

    // Algorisme de disposició visual de tasques a la línia temporal (pre-càlcul optimitzat)
    const tasksWithLayout = useMemo(() => {
        const bufferMs = 24 * 60 * 60000; // 24 hores de buffer
        const winStart = timelineStart.getTime() - bufferMs;
        const winEnd = timelineEnd.getTime() + bufferMs;
        const nowMs = now.getTime();

        const visibleTasks: { task: Task; start: Date; end: Date; startMs: number; endMs: number }[] = [];

        for (let i = 0; i < tasks.length; i++) {
            const t = tasks[i];
            if (!t.startDate && !t.dueDate) continue;

            const startMs = t.startDate ? new Date(t.startDate).getTime() : nowMs;
            const endMs = t.dueDate ? new Date(t.dueDate).getTime() : (startMs + (t.estimatedMinutes || 60) * 60000);

            if (endMs >= winStart && startMs <= winEnd) {
                visibleTasks.push({
                    task: t,
                    start: new Date(startMs),
                    end: new Date(endMs),
                    startMs,
                    endMs
                });
            }
        }

        visibleTasks.sort((a, b) => a.startMs - b.startMs);

        // Algorisme de Greedy Interval Partitioning via Min-Heap (Empaquetament òptim de pistes O(N log K))
        const heap = new TrackMinHeap();
        let nextTrackIndex = 0;
        const BUFFER_GAP_MS = 5 * 60 * 1000; // 5 minuts de marge visual entre tasques consecutives

        return visibleTasks.map((item) => {
            const durationMins = Math.max(5, (item.endMs - item.startMs) / 60000);
            const leftMins = (item.startMs - timelineStart.getTime()) / 60000;

            let assignedTrack: number;
            const earliest = heap.peek();

            if (earliest && earliest.endTime + BUFFER_GAP_MS <= item.startMs) {
                // Reutilitzar la pista que s'ha alliberat abans O(log K)
                const slot = heap.pop()!;
                assignedTrack = slot.trackIndex;
                heap.push({ trackIndex: assignedTrack, endTime: item.endMs });
            } else {
                // S'encavalca amb totes les pistes en curs: assignar nova pista O(log K)
                assignedTrack = nextTrackIndex++;
                heap.push({ trackIndex: assignedTrack, endTime: item.endMs });
            }

            return {
                ...item.task,
                start: item.start,
                end: item.end,
                durationMins,
                trackIndex: assignedTrack,
                leftMins
            };
        });
    }, [tasks, timelineStart, timelineEnd, now]);

    const unplannedTasks = useMemo(() => tasks.filter(t => !t.startDate), [tasks]);

    const onDragEnd = useCallback((event: DragEndEvent) => {
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
    }, [zoomLevel, timelineStart, updateTask]);

    const handleGoToNow = useCallback(() => {
        flushSync(() => {
            setBaseDate(new Date(now.getTime()));
        });
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = (totalWidthPixels / 2) - scrollContainerRef.current.clientWidth / 2;
        }
    }, [now, totalWidthPixels]);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={(e) => setActiveTask(e.active.data.current?.task)}
            onDragEnd={onDragEnd}
            onDragCancel={() => setActiveTask(null)}
        >
            <div 
                role="region"
                aria-label="Línia temporal Gantt"
                className="flex flex-col h-full bg-[#0B0F19] rounded-2xl overflow-hidden border border-white/[0.05] shadow-2xl relative"
            >
                {/* Línia temporal scrollable */}
                <div 
                    ref={setRefs}
                    onScroll={handleScroll}
                    className="flex-1 overflow-auto relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] cursor-grab active:cursor-grabbing"
                >
                    <div 
                        className="relative min-h-full overflow-hidden" 
                        style={{ width: totalWidthPixels }}
                    >
                        {/* Línies verticals de la graella */}
                        <div aria-hidden="true" className="absolute inset-0 top-8 pointer-events-none z-0">
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

                        {/* Capçalera de la regla temporal */}
                        <div 
                            aria-hidden="true"
                            className="sticky top-0 h-8 bg-slate-900/80 backdrop-blur-md border-b border-white/[0.05] z-20 overflow-hidden pointer-events-none"
                        >
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

                        {/* Indicador de l'hora actual (Playhead) */}
                        <div 
                            aria-hidden="true"
                            className="absolute top-8 bottom-0 w-px bg-red-500 z-10 shadow-[0_0_10px_rgba(239,68,68,1)] pointer-events-none"
                            style={{ left: ((now.getTime() - timelineStart.getTime()) / 60000) * zoomLevel }}
                        >
                            <div className="absolute top-0 -translate-x-1/2 -mt-1 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-[#0B0F19]" />
                        </div>

                        {/* Àrea de pistes de tasques */}
                        <div 
                            className="relative pt-6 pb-24" 
                            style={{ minHeight: `${tasksWithLayout.reduce((max, t) => Math.max(max, t.trackIndex), 0) * 50 + 100}px` }}
                        >
                            {tasksWithLayout.map((task: LayoutTask) => (
                                <TaskBar 
                                    key={task.id} 
                                    task={task} 
                                    zoomLevel={zoomLevel} 
                                    timelineStart={timelineStart} 
                                    updateTask={updateTask} 
                                    subject={task.subjectId ? subjectsMap.get(task.subjectId) : undefined}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Controls flotants de zoom */}
                <div 
                    role="toolbar"
                    aria-label="Controls de zoom de Gantt"
                    className="hidden lg:flex touch-landscape:hidden absolute bottom-6 right-6 z-40 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl items-center gap-4"
                >
                    <button
                        type="button"
                        onClick={handleGoToNow}
                        className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer mr-2"
                        title="Vés a l'hora actual"
                        aria-label="Vés a l'hora actual"
                    >
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
                        aria-label="Nivell de zoom"
                        className="w-32 accent-white cursor-pointer"
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

export default GanttView;
