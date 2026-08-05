import React, { useState, useRef } from 'react';
import { m as motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { 
    DndContext, 
    DragOverlay, 
    closestCorners, 
    MouseSensor,
    TouchSensor,
    useSensor, 
    useSensors, 
    type DragStartEvent, 
    type DragEndEvent
} from '@dnd-kit/core';
import { createPortal } from 'react-dom';
import { format } from 'date-fns';
import { ca } from 'date-fns/locale';
import { useTasks } from '../../../contexts/TasksContext';
import type { Task } from '../../../types/tasks';
import { useDuplicateModifier } from '../../../hooks/useDuplicateModifier';
import MonthlyGrid from './MonthlyGrid';
import WeeklyGrid from './WeeklyGrid';
import YearlyGrid from './YearlyGrid';
import TaskCard from '../Board/TaskCard';
import UnscheduledDrawer from '../UnscheduledDrawer';
import { useTranslation } from 'react-i18next';

type CalendarMode = 'month' | 'week' | 'year';

const CalendarView: React.FC = () => {
    const { t } = useTranslation();
    const { tasks, updateTask, addTask } = useTasks();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [mode, setMode] = useState<CalendarMode>('week');
    const [direction, setDirection] = useState(0);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const isAltPressed = useDuplicateModifier();
    const [zoomOrigin, setZoomOrigin] = useState({ x: '50%', y: '50%' });
    const [isTransitioning, setIsTransitioning] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            },
        })
    );

    const handleSetMode = (newMode: CalendarMode, newDate?: Date, clickEvent?: React.MouseEvent) => {
        const modes: CalendarMode[] = ['year', 'month', 'week'];
        const currentIndex = modes.indexOf(mode);
        const newIndex = modes.indexOf(newMode);
        
        // Compute zoom origin from click coordinates (Apple Calendar morphing zoom)
        if (clickEvent && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const x = ((clickEvent.clientX - rect.left) / rect.width) * 100;
            const y = ((clickEvent.clientY - rect.top) / rect.height) * 100;
            setZoomOrigin({ x: `${x}%`, y: `${y}%` });
        } else {
            setZoomOrigin({ x: '50%', y: '50%' });
        }
        
        // Zoom in = positive direction, Zoom out = negative direction
        setDirection(newIndex > currentIndex ? 1 : -1);
        setIsTransitioning(true);
        setMode(newMode);
        if (newDate) setCurrentDate(newDate);
    };

    React.useEffect(() => {
        const handlePlannerAction = (e: Event) => {
            const action = (e as CustomEvent).detail.action;
            if (action === 'plannerToday') {
                setCurrentDate(new Date());
            } else if (action === 'plannerViewWeek') {
                handleSetMode('week');
            } else if (action === 'plannerViewMonth') {
                handleSetMode('month');
            } else if (action === 'plannerViewYear') {
                handleSetMode('year');
            } else if (action === 'plannerPrev') {
                setCurrentDate(prev => {
                    const newDate = new Date(prev);
                    if (mode === 'week') newDate.setDate(newDate.getDate() - 7);
                    else if (mode === 'month') newDate.setMonth(newDate.getMonth() - 1);
                    else if (mode === 'year') newDate.setFullYear(newDate.getFullYear() - 1);
                    return newDate;
                });
            } else if (action === 'plannerNext') {
                setCurrentDate(prev => {
                    const newDate = new Date(prev);
                    if (mode === 'week') newDate.setDate(newDate.getDate() + 7);
                    else if (mode === 'month') newDate.setMonth(newDate.getMonth() + 1);
                    else if (mode === 'year') newDate.setFullYear(newDate.getFullYear() + 1);
                    return newDate;
                });
            }
        };

        window.addEventListener('planner-action', handlePlannerAction);
        return () => window.removeEventListener('planner-action', handlePlannerAction);
    }, [mode]);

    const onDragStart = (event: DragStartEvent) => {
        document.body.style.userSelect = 'none';
        const task = event.active.data.current?.task as Task | undefined;
        if (task) setActiveTask(task);
    };

    const onDragEnd = (event: DragEndEvent) => {
        document.body.style.userSelect = '';
        const { over, active } = event;
        const task = active.data.current?.task as Task | undefined;
        
        if (task && over) {
            const targetDateStr = String(over.id);
            const pieceOffsetMinutes = active.data.current?.pieceOffsetMinutes || 0;
            
            if (targetDateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
                const newDate = new Date(targetDateStr);

                if (mode === 'week') {
                    const translatedRect = active.rect.current.translated;
                    const overRect = over.rect;
                    
                    if (translatedRect && overRect) {
                        const relativeY = translatedRect.top - overRect.top;
                        let totalMinutes = Math.round(relativeY);
                        totalMinutes = Math.max(0, Math.round(totalMinutes / 5) * 5); // Snap 5 mins
                        
                        totalMinutes -= pieceOffsetMinutes;
                        
                        // setHours(0) handles negative minutes perfectly (e.g. going back to previous day)
                        newDate.setHours(0, totalMinutes, 0, 0);
                    } else {
                        newDate.setHours(task.startDate ? new Date(task.startDate).getHours() : 12, task.startDate ? new Date(task.startDate).getMinutes() : 0, 0, 0);
                    }
                } else {
                    if (task.startDate) {
                        const originalDate = new Date(task.startDate);
                        newDate.setHours(originalDate.getHours(), originalDate.getMinutes(), 0, 0);
                    } else {
                        newDate.setHours(12, 0, 0, 0);
                    }
                }

                if (isAltPressed) {
                    addTask({
                        title: `${task.title} (Còpia)`,
                        description: task.description,
                        status: task.status,
                        priority: task.priority,
                        dueDate: task.dueDate ? new Date(newDate.getTime() + (task.estimatedMinutes || 60) * 60000).toISOString() : null,
                        startDate: newDate.toISOString(),
                        estimatedMinutes: task.estimatedMinutes,
                        source: (task as any).source
                    } as any).then((newTaskId) => {
                        setTimeout(() => {
                            window.dispatchEvent(new CustomEvent('task-selected', { detail: newTaskId }));
                        }, 50);
                    });
                } else {
                    const updates: Partial<Task> = { startDate: newDate.toISOString() };
                    if (task.dueDate) {
                        updates.dueDate = new Date(newDate.getTime() + (task.estimatedMinutes || 60) * 60000).toISOString();
                    }
                    updateTask(task.id, updates);
                }
            }
        }
        setActiveTask(null);
    };

    const unplannedTasks = tasks.filter(t => !t.startDate);

    // Apple Calendar morphing zoom — fast start, soft landing
    const APPLE_EASE: [number, number, number, number] = [0.16, 0.85, 0.3, 1];
    const ZOOM_DURATION = 0.28;

    const variants = {
        initial: (direction: number) => ({
            opacity: 0,
            scale: direction > 0 ? 0.82 : 1.35,
        }),
        animate: {
            opacity: 1,
            scale: 1,
            transition: { duration: ZOOM_DURATION, ease: APPLE_EASE }
        },
        exit: (direction: number) => ({
            opacity: 0,
            scale: direction > 0 ? 2.2 : 0.55,
            transition: { duration: ZOOM_DURATION * 0.85, ease: APPLE_EASE }
        })
    };

    return (
        <div className="flex flex-col h-full relative w-full md:gap-4">
            {/* Grid Principal i Sidebar */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                autoScroll={typeof window !== 'undefined' && window.innerWidth < 768 ? false : true}
            >
                <div className="flex flex-1 md:gap-4 relative z-10">
                    {/* Floating View Toggle (iPad Dock style) - Hidden on mobile */}
                    <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
                        <div className="bg-[#0f111a]/60 backdrop-blur-3xl p-1.5 rounded-full border border-white/[0.08] flex shadow-[0_30px_60px_-10px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)]">
                            {(['week', 'month', 'year'] as CalendarMode[]).map((m) => (
                                <button type="button"
                                    key={m}
                                    onClick={() => handleSetMode(m)}
                                    className={`relative px-6 py-2 text-[11px] font-bold tracking-[0.15em] uppercase transition-all duration-300 rounded-full outline-none hover:scale-[1.02] active:scale-95 ${
                                        mode === m ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                                    }`}
                                >
                                    {mode === m && (
                                        <motion.div
                                            layoutId="calendarMode"
                                            className="absolute inset-0 bg-white/10 border border-white/10 rounded-full z-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_20px_rgba(255,255,255,0.1)]"
                                            transition={{ type: "spring", stiffness: 450, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10 drop-shadow-md">{m === 'week' ? t('planner.calendarView.week', 'Setm') : m === 'month' ? t('planner.calendarView.month', 'Mes') : t('planner.calendarView.year', 'Any')}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Contingut Principal animat */}
                    <LayoutGroup>
                        <div ref={containerRef} className="flex-1 relative">
                            <AnimatePresence mode="popLayout" custom={direction} initial={false}>
                                <motion.div
                                    key={mode}
                                    custom={direction}
                                    variants={variants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    style={{ transformOrigin: `${zoomOrigin.x} ${zoomOrigin.y}` }}
                                    onAnimationComplete={(definition) => {
                                        if (definition === 'animate') setIsTransitioning(false);
                                    }}
                                    className="w-full h-full absolute inset-0"
                                >
                                    {mode === 'month' && <MonthlyGrid currentDate={currentDate} tasks={tasks} deferBuffers={isTransitioning} onSelectDay={(date, e) => handleSetMode('week', date, e)} />}
                                    {mode === 'week' && <WeeklyGrid currentDate={currentDate} tasks={tasks} deferBuffers={isTransitioning} />}
                                    {mode === 'year' && <YearlyGrid currentDate={currentDate} tasks={tasks} deferBuffers={isTransitioning} onSelectMonth={(date, e) => handleSetMode('month', date, e)} />}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </LayoutGroup>
                </div>

                <UnscheduledDrawer tasks={unplannedTasks} />

                {createPortal(
                    <DragOverlay zIndex={1000} dropAnimation={null}>
                        {activeTask && mode !== 'week' ? (
                            <TaskCard task={activeTask} />
                        ) : null}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>
        </div>
    );
};

export default CalendarView;

