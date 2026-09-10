import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
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
import { useTasks } from '../../../contexts/TasksContext';
import type { Task } from '../../../types/tasks';
import { useDuplicateModifier } from '../../../hooks/useDuplicateModifier';
import MonthlyGrid from './MonthlyGrid';
import WeeklyGrid from './WeeklyGrid';
import YearlyGrid from './YearlyGrid';
import TaskCard from '../Board/TaskCard';
import { CalendarDragCard } from './CalendarDragCard';
import UnscheduledDrawer from '../UnscheduledDrawer';
import { useTranslation } from 'react-i18next';
import { type PlannerActionEventDetail, dispatchTaskSelected } from '../plannerEvents';

type CalendarMode = 'month' | 'week' | 'year';

// Transició suau estil Apple Calendar (zoom morfològic)
const APPLE_EASE: [number, number, number, number] = [0.16, 0.85, 0.3, 1];
const ZOOM_DURATION = 0.28;

const ZOOM_VARIANTS = {
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

const CALENDAR_MODES: CalendarMode[] = ['year', 'month', 'week'];

/**
 * Desplaçament de dates segons la unitat temporal activa
 */
function shiftCalendarDate(date: Date, calendarMode: CalendarMode, delta: 1 | -1): Date {
    const next = new Date(date);
    if (calendarMode === 'week') {
        next.setDate(next.getDate() + delta * 7);
    } else if (calendarMode === 'month') {
        next.setMonth(next.getMonth() + delta);
    } else if (calendarMode === 'year') {
        next.setFullYear(next.getFullYear() + delta);
    }
    return next;
}

/**
 * Vista principal de Calendari (Setmanal, Mensual i Anual)
 * Centralitza el context d'arrossegament (DnD), zoom morfològic i navegació temporal.
 */
const CalendarView: React.FC = () => {
    const { t } = useTranslation();

    // Selectors granulars de Zustand
    const tasks = useTasks(state => state.tasks);
    const updateTask = useTasks(state => state.updateTask);
    const addTask = useTasks(state => state.addTask);

    const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
    const [mode, setMode] = useState<CalendarMode>('week');
    const [direction, setDirection] = useState(0);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [activeId, setActiveId] = useState<string | null>(null);
    const isAltPressed = useDuplicateModifier();
    const [zoomOrigin, setZoomOrigin] = useState({ x: '50%', y: '50%' });

    const containerRef = useRef<HTMLDivElement>(null);
    const modeRef = useRef(mode);
    modeRef.current = mode;

    // Sensors de gestos i ratolí per a drag & drop
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

    // Canvi de mode de calendari amb càlcul del punt d'origen del zoom
    const handleSetMode = useCallback((newMode: CalendarMode, newDate?: Date, clickEvent?: React.MouseEvent) => {
        const currentMode = modeRef.current;
        if (currentMode === newMode && !newDate) return;

        const currentIndex = CALENDAR_MODES.indexOf(currentMode);
        const newIndex = CALENDAR_MODES.indexOf(newMode);
        
        if (clickEvent && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const clickX = ((clickEvent.clientX - rect.left) / rect.width) * 100;
            const clickY = ((clickEvent.clientY - rect.top) / rect.height) * 100;
            setZoomOrigin({ x: `${Math.round(clickX)}%`, y: `${Math.round(clickY)}%` });
        } else {
            setZoomOrigin({ x: '50%', y: '50%' });
        }
        
        setDirection(newIndex > currentIndex ? 1 : -1);
        setMode(newMode);
        if (newDate) setCurrentDate(newDate);
    }, []);

    // Listener d'esdeveniments de drecera globals (un sol registre estable al cicle de vida)
    useEffect(() => {
        const handlePlannerAction = (e: Event) => {
            const action = (e as CustomEvent<PlannerActionEventDetail>).detail?.action;
            if (action === 'plannerToday') {
                setCurrentDate(new Date());
            } else if (action === 'plannerViewWeek') {
                handleSetMode('week');
            } else if (action === 'plannerViewMonth') {
                handleSetMode('month');
            } else if (action === 'plannerViewYear') {
                handleSetMode('year');
            } else if (action === 'plannerPrev') {
                setCurrentDate(prev => shiftCalendarDate(prev, modeRef.current, -1));
            } else if (action === 'plannerNext') {
                setCurrentDate(prev => shiftCalendarDate(prev, modeRef.current, 1));
            }
        };

        window.addEventListener('planner-action', handlePlannerAction);
        return () => window.removeEventListener('planner-action', handlePlannerAction);
    }, [handleSetMode]);

    const onDragStart = useCallback((event: DragStartEvent) => {
        document.body.style.userSelect = 'none';
        setActiveId(String(event.active.id));
        const taskItem = event.active.data.current?.task as Task | undefined;
        if (taskItem) setActiveTask(taskItem);
    }, []);

    const onDragEnd = useCallback((event: DragEndEvent) => {
        document.body.style.userSelect = '';
        const { over, active } = event;
        const taskItem = active.data.current?.task as Task | undefined;
        
        if (taskItem && over) {
            const targetDateStr = String(over.id);
            const pieceOffsetMinutes = active.data.current?.pieceOffsetMinutes || 0;
            if (targetDateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
                const [targetYear, targetMonth, targetDay] = targetDateStr.split('-').map(Number);
                const newDate = new Date(targetYear, targetMonth - 1, targetDay, 0, 0, 0, 0);

                if (modeRef.current === 'week') {
                    const translatedRect = active.rect.current.translated;
                    const overRect = over.rect;
                    
                    if (translatedRect && overRect) {
                        const relativeY = translatedRect.top - overRect.top;
                        let totalMinutes = Math.round(relativeY);
                        totalMinutes = Math.max(0, Math.round(totalMinutes / 5) * 5); // Snap a 5 minuts
                        totalMinutes -= pieceOffsetMinutes;
                        newDate.setHours(0, totalMinutes, 0, 0);
                    } else {
                        newDate.setHours(
                            taskItem.startDate ? new Date(taskItem.startDate).getHours() : 12, 
                            taskItem.startDate ? new Date(taskItem.startDate).getMinutes() : 0, 
                            0, 
                            0
                        );
                    }
                } else {
                    if (taskItem.startDate) {
                        const originalDate = new Date(taskItem.startDate);
                        newDate.setHours(originalDate.getHours(), originalDate.getMinutes(), 0, 0);
                    } else {
                        newDate.setHours(12, 0, 0, 0);
                    }
                }

                const estimated = taskItem.estimatedMinutes || 60;
                const newDueDate = new Date(newDate.getTime() + estimated * 60000).toISOString();

                if (isAltPressed) {
                    const freshTask = tasks.find(t => t.id === taskItem.id) || taskItem;
                    addTask({
                        title: `${freshTask.title}${t('planner.contextMenu.copySuffix', ' (Còpia)')}`,
                        description: freshTask.description,
                        status: freshTask.status,
                        priority: freshTask.priority,
                        dueDate: newDueDate,
                        startDate: newDate.toISOString(),
                        estimatedMinutes: estimated,
                        subjectId: freshTask.subjectId ?? null
                    }).then((newTaskId) => {
                        setTimeout(() => {
                            dispatchTaskSelected(newTaskId);
                        }, 50);
                    });
                } else {
                    updateTask(taskItem.id, {
                        startDate: newDate.toISOString(),
                        dueDate: newDueDate
                    });
                }
            }
        }

        setActiveTask(null);
        setActiveId(null);
    }, [addTask, updateTask, isAltPressed, tasks, t]);

    const onDragCancel = useCallback(() => {
        document.body.style.userSelect = '';
        setActiveTask(null);
        setActiveId(null);
    }, []);

    // Tasques pendents de planificar (sense startDate)
    const unplannedTasks = useMemo(() => tasks.filter(t => !t.startDate), [tasks]);

    const isMobileViewport = typeof window !== 'undefined' && window.innerWidth < 768;

    return (
        <div className="flex flex-col h-full relative w-full md:gap-4">
            {/* Context DnD per a tot el calendari i el calaix de backlog */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onDragCancel={onDragCancel}
                autoScroll={!isMobileViewport}
            >
                <div className="flex flex-1 md:gap-4 relative z-10">
                    {/* Selector flotant d'escriptori (Estil iPad Dock) */}
                    <div className="hidden md:block touch-landscape:hidden absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
                        <div 
                            role="tablist"
                            aria-label={t('planner.calendarView.viewMode', 'Mode del calendari')}
                            className="bg-[#0f111a]/60 backdrop-blur-3xl p-1.5 rounded-full border border-white/[0.08] flex shadow-[0_30px_60px_-10px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)]"
                        >
                            {(['week', 'month', 'year'] as CalendarMode[]).map((m) => {
                                const isActive = mode === m;
                                return (
                                    <button 
                                        type="button"
                                        role="tab"
                                        id={`calendar-mode-tab-${m}`}
                                        aria-selected={isActive}
                                        key={m}
                                        onClick={() => handleSetMode(m)}
                                        className={`relative px-6 py-2 text-[11px] font-bold tracking-[0.15em] uppercase transition duration-300 rounded-full outline-none hover:scale-[1.02] active:scale-95 cursor-pointer ${
                                            isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                                        }`}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="calendarMode"
                                                className="absolute inset-0 bg-white/10 border border-white/10 rounded-full z-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_20px_rgba(255,255,255,0.1)]"
                                                transition={{ type: "spring", stiffness: 450, damping: 30 }}
                                            />
                                        )}
                                        <span className="relative z-10 drop-shadow-md">
                                            {m === 'week' ? t('planner.calendarView.week', 'Setm') : m === 'month' ? t('planner.calendarView.month', 'Mes') : t('planner.calendarView.year', 'Any')}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Àrea del calendari animada amb morphing zoom accelerat per GPU */}
                    <div ref={containerRef} className="flex-1 relative">
                        <AnimatePresence initial={false} custom={direction}>
                            <motion.div
                                key={mode}
                                custom={direction}
                                variants={ZOOM_VARIANTS}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                style={{ 
                                    transformOrigin: `${zoomOrigin.x} ${zoomOrigin.y}`,
                                    willChange: 'transform, opacity',
                                    backfaceVisibility: 'hidden',
                                    WebkitBackfaceVisibility: 'hidden'
                                }}
                                className="w-full h-full absolute inset-0"
                            >
                                {mode === 'month' && (
                                    <MonthlyGrid 
                                        currentDate={currentDate} 
                                        tasks={tasks} 
                                        onSelectDay={(date, e) => handleSetMode('week', date, e)} 
                                    />
                                )}
                                {mode === 'week' && (
                                    <WeeklyGrid 
                                        currentDate={currentDate} 
                                        tasks={tasks} 
                                    />
                                )}
                                {mode === 'year' && (
                                    <YearlyGrid 
                                        currentDate={currentDate} 
                                        tasks={tasks} 
                                        onSelectMonth={(date, e) => handleSetMode('month', date, e)} 
                                    />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Safata de tasques pendents (Backlog) */}
                <UnscheduledDrawer tasks={unplannedTasks} />

                {/* Capa de previsualització d'arrossegament flotant */}
                {createPortal(
                    <DragOverlay zIndex={1000} dropAnimation={null}>
                        {activeTask ? (
                            mode === 'week' ? (
                                !activeId?.includes('::') ? (
                                    <CalendarDragCard task={activeTask} />
                                ) : null
                            ) : (
                                <div className="w-72 pointer-events-none cursor-grabbing">
                                    <TaskCard task={activeTask} isOverlay={true} />
                                </div>
                            )
                        ) : null}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>
        </div>
    );
};

export default CalendarView;
