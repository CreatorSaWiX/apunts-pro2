import React, { useState, useMemo, useEffect, useCallback, Suspense, lazy, useTransition } from 'react';
import { useTasks } from '../../contexts/TasksContext';
import { useSettingsStore } from '../../stores/useSettingsStore';
import NavigationPill from '../ui/NavigationPill';
import { Calendar, LayoutDashboard, GanttChartSquare, Sparkles, Route, RotateCcw, RotateCw } from 'lucide-react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Spinner from '../ui/Spinner';
import AIPromptBar from './AIPromptBar';
import GlobalTaskContextMenu from './GlobalTaskContextMenu';
import GlobalFiltersBar from './GlobalFiltersBar';
import TaskPopover from './TaskPopover';
import { usePlannerShortcuts } from './usePlannerShortcuts';
import { dispatchOpenTaskPopover } from './plannerEvents';

const BoardView = lazy(() => import('./Board/BoardView'));
const CalendarView = lazy(() => import('./Calendar/CalendarView'));
const GanttView = lazy(() => import('./Gantt/GanttView'));
const RoadmapView = lazy(() => import('./Roadmap/RoadmapView'));

type ViewMode = 'board' | 'calendar' | 'gantt' | 'roadmap';

const VIEW_TRANSITION = {
    duration: 0.4,
    ease: 'easeInOut' as const
};

/**
 * Partícules decoratives flotants per al botó de l'Assistent IA
 */
const AIParticles: React.FC = React.memo(() => {
    const particles = useMemo(() => {
        return [...Array(6)].map((_, i) => ({
            id: i,
            x: (Math.random() - 0.5) * 20,
            delay: Math.random() * 3,
            duration: 2 + Math.random() * 2,
            size: 1 + Math.random() * 2
        }));
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-full">
            <style>{`
                @keyframes aiParticleFloat {
                    0% { transform: translateY(20px); opacity: 0; }
                    50% { opacity: 0.8; }
                    100% { transform: translateY(-20px); opacity: 0; }
                }
            `}</style>
            {particles.map(p => (
                <div
                    key={p.id}
                    className="absolute top-1/2 left-1/2 rounded-full bg-fuchsia-400 shadow-[0_0_8px_rgba(232,121,249,0.8)]"
                    style={{
                        width: p.size,
                        height: p.size,
                        marginLeft: -p.size / 2 + p.x,
                        marginTop: -p.size / 2,
                        animation: `aiParticleFloat ${p.duration}s linear ${p.delay}s infinite`
                    }}
                />
            ))}
        </div>
    );
});
AIParticles.displayName = 'AIParticles';

const FallbackSpinner: React.FC = React.memo(() => (
    <div className="flex items-center justify-center w-full h-full min-h-[300px]">
        <Spinner size="xl" variant="primary" />
    </div>
));
FallbackSpinner.displayName = 'FallbackSpinner';

/**
 * Estructura principal del Planificador (PlannerLayout)
 * Centralitza la navegació entre vistes (Tauler, Calendari, Timeline, Roadmap),
 * drecera de teclat, filtres globals i popovers.
 */
const PlannerLayout: React.FC = () => {
    const { t } = useTranslation();

    // Subscripcions granulars a Zustand: només valors primitius per evitar re-renderitzats massius
    const isLoading = useTasks(state => state.isLoading);
    const error = useTasks(state => state.error);
    const addTask = useTasks(state => state.addTask);
    const undo = useTasks(state => state.undo);
    const redo = useTasks(state => state.redo);

    const hasFiltersActive = useTasks(state => 
        state.filters.subjects.length > 0 || 
        state.filters.priorities.length > 0 || 
        state.filters.dateRange !== 'ALL'
    );

    const hasSubjectTasks = useTasks(state => 
        state.subjects.length > 0 && state.tasks.some(t => Boolean(t.subjectId))
    );

    const defaultPlannerView = useSettingsStore(state => state.defaultPlannerView);

    const [activeTab, setActiveTab] = useState<ViewMode>(defaultPlannerView || 'board');
    const [view, setView] = useState<ViewMode>(defaultPlannerView || 'board');
    const [, startTransition] = useTransition();
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);
    const [screenGlow, setScreenGlow] = useState(false);
    const [historyToast, setHistoryToast] = useState<{ type: 'undo' | 'redo'; title?: string; key: number } | null>(null);

    // Auto-tancar la notificació flotant d'Undo/Redo després de 2 segons
    useEffect(() => {
        if (!historyToast) return;
        const timer = setTimeout(() => setHistoryToast(null), 2000);
        return () => clearTimeout(timer);
    }, [historyToast]);

    // Activació de dreceres de teclat del planificador
    usePlannerShortcuts();

    // Canvi de vista amb transició concurrent no-bloquejant
    const handleViewChange = useCallback((newView: ViewMode) => {
        setActiveTab(prev => {
            if (prev === newView) return prev;
            startTransition(() => {
                setView(newView);
            });
            return newView;
        });
    }, []);

    // Efecte de resplendor en completar accions d'IA
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout> | null = null;
        const handleMagic = () => {
            setScreenGlow(true);
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => setScreenGlow(false), 2000);
        };
        window.addEventListener('ai-magic-done', handleMagic);
        return () => {
            window.removeEventListener('ai-magic-done', handleMagic);
            if (timer) clearTimeout(timer);
        };
    }, []);

    // Gestió de pantalla completa en dispositius mòbils en posició horitzontal
    useEffect(() => {
        const attemptFullscreen = () => {
            if (window.innerWidth > window.innerHeight && window.innerHeight < 600) {
                if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(() => {});
                }
            }
        };

        const mediaQuery = window.matchMedia('(orientation: landscape) and (max-height: 600px) and (pointer: coarse)');
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', attemptFullscreen);
        }
        window.addEventListener('orientationchange', attemptFullscreen);
        attemptFullscreen();

        return () => {
            if (mediaQuery.removeEventListener) {
                mediaQuery.removeEventListener('change', attemptFullscreen);
            }
            window.removeEventListener('orientationchange', attemptFullscreen);
        };
    }, []);

    // Gestor d'esdeveniments d'accions ràpides del planificador (ex: dreceres de teclat)
    useEffect(() => {
        const handlePlannerAction = (e: Event) => {
            const action = (e as CustomEvent).detail?.action;
            if (['plannerViewWeek', 'plannerViewMonth', 'plannerViewYear'].includes(action)) {
                handleViewChange('calendar');
            } else if (action === 'plannerUndo') {
                undo().then((undoneAction) => {
                    if (undoneAction) {
                        setHistoryToast({
                            type: 'undo',
                            title: undoneAction.title || (undoneAction.type === 'DELETE' ? undoneAction.task.title : undefined),
                            key: Date.now()
                        });
                    }
                }).catch((err) => {
                    console.error('Error al desfer acció:', err);
                });
            } else if (action === 'plannerRedo') {
                redo().then((redoneAction) => {
                    if (redoneAction) {
                        setHistoryToast({
                            type: 'redo',
                            title: redoneAction.title || (redoneAction.type === 'DELETE' ? redoneAction.task.title : undefined),
                            key: Date.now()
                        });
                    }
                }).catch((err) => {
                    console.error('Error al refer acció:', err);
                });
            } else if (action === 'plannerCreateTask') {
                const now = new Date();
                const due = new Date(now.getTime() + 60 * 60000);
                addTask({
                    title: '',
                    status: 'TODO',
                    priority: 'LOW',
                    startDate: now.toISOString(),
                    dueDate: due.toISOString(),
                    estimatedMinutes: 60
                }).then((newTaskId: string) => {
                    dispatchOpenTaskPopover({
                        x: window.innerWidth / 2,
                        y: window.innerHeight / 2,
                        taskId: newTaskId
                    });
                }).catch((err) => {
                    console.error('Error al crear tasca des de drecera:', err);
                });
            }
        };

        window.addEventListener('planner-action', handlePlannerAction);
        return () => window.removeEventListener('planner-action', handlePlannerAction);
    }, [handleViewChange, addTask, undo, redo]);

    // Pestanyes de navegació memoitzades
    const navTabs = useMemo(() => [
        { id: 'board' as const, label: t('planner.board', 'Tauler'), icon: LayoutDashboard },
        { id: 'calendar' as const, label: t('planner.calendar', 'Calendari'), icon: Calendar },
        { id: 'gantt' as const, label: t('planner.timeline', 'Timeline'), icon: GanttChartSquare },
        { id: 'roadmap' as const, label: t('planner.roadmap', 'Roadmap'), icon: Route }
    ], [t]);

    const isFiltersBarVisible = hasSubjectTasks || hasFiltersActive;
    const contentTopClass = isFiltersBarVisible ? 'md:top-[140px]' : '';

    if (isLoading) {
        return (
            <div className="flex items-center justify-center flex-1">
                <Spinner size="2xl" variant="primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl m-4">
                {t('planner.errorLoading', 'Error carregant les tasques')}: {error}
            </div>
        );
    }

    return (
        <div className="flex flex-col flex-1 h-full relative w-full">
            <GlobalTaskContextMenu />

            {/* Selector de vistes dinàmic (Fix superior dret) */}
            <div 
                role="tablist"
                aria-label={t('planner.views', 'Vistes del planificador')}
                className="fixed top-5 md:top-6 right-4 sm:right-6 z-50 touch-landscape:hidden"
            >
                <NavigationPill>
                    {navTabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                type="button"
                                role="tab"
                                id={`planner-tab-${tab.id}`}
                                aria-controls={`planner-panel-${tab.id}`}
                                aria-selected={isActive}
                                key={tab.id}
                                onClick={() => handleViewChange(tab.id)}
                                className={`relative flex items-center justify-center gap-2 px-4 sm:px-6 h-11 md:h-10 rounded-full transition duration-300 text-[11px] sm:text-sm font-bold tracking-wide z-10 group hover:scale-[1.02] active:scale-[0.98] ${
                                    isActive ? 'text-white' : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="planner-active-tab"
                                        className="absolute inset-0 bg-white/[0.12] border border-white/[0.15] rounded-full z-[-1] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_0_20px_rgba(255,255,255,0.1),0_0_8px_rgba(255,255,255,0.05)]"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    >
                                        <div className="absolute inset-x-4 -bottom-px h-px bg-gradient-to-r from-transparent via-white/50 to-transparent blur-[1px]" />
                                    </motion.div>
                                )}
                                <Icon
                                    size={16}
                                    strokeWidth={isActive ? 2.5 : 2}
                                    className={`transition-colors ${
                                        isActive ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'group-hover:text-slate-200'
                                    }`}
                                />
                                <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                        );
                    })}

                    <div className="w-px h-6 bg-white/[0.1] mx-1" />

                    {/* Botó del Mode Assistent IA */}
                    <button
                        type="button"
                        onClick={() => setIsAIModalOpen(true)}
                        className="group relative flex items-center justify-center w-11 h-11 md:w-10 md:h-10 rounded-full transition duration-500 shrink-0 hover:scale-[1.05] active:scale-[0.95] overflow-hidden cursor-pointer"
                        title={t('planner.aiPlanner', 'IA Planner')}
                        aria-label={t('planner.aiPlanner', 'IA Planner')}
                    >
                        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                            <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(217,70,239,0.5)_360deg)] animate-[spin_3s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute inset-[1px] bg-slate-900/90 backdrop-blur-3xl rounded-full" />
                        </div>

                        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.2),transparent_70%)] pointer-events-none" />

                        <AIParticles />

                        <Sparkles
                            size={18}
                            strokeWidth={2.5}
                            className="relative z-10 text-fuchsia-400 group-hover:text-fuchsia-300 transition duration-300 drop-shadow-[0_0_8px_rgba(217,70,239,0.6)]"
                        />
                    </button>
                </NavigationPill>
            </div>

            {/* Barra de filtres globals (només a Tauler i Timeline) */}
            {(view === 'board' || view === 'gantt') && <GlobalFiltersBar />}

            {/* Àrea de contingut de la vista activa */}
            <div className="flex-1 relative flex flex-col w-full h-full">
                <Suspense fallback={<FallbackSpinner />}>
                    <AnimatePresence mode="wait">
                        {view === 'board' && (
                            <motion.div
                                key="board"
                                id="planner-panel-board"
                                role="tabpanel"
                                aria-labelledby="planner-tab-board"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={VIEW_TRANSITION}
                                className={`absolute inset-x-0 bottom-0 top-[88px] ${contentTopClass} touch-landscape:!top-0 z-10`}
                            >
                                <BoardView />
                            </motion.div>
                        )}
                        {view === 'calendar' && (
                            <motion.div
                                key="calendar"
                                id="planner-panel-calendar"
                                role="tabpanel"
                                aria-labelledby="planner-tab-calendar"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={VIEW_TRANSITION}
                                className="absolute inset-x-0 bottom-0 top-[88px] touch-landscape:!top-0 z-10"
                            >
                                <CalendarView />
                            </motion.div>
                        )}
                        {view === 'gantt' && (
                            <motion.div
                                key="gantt"
                                id="planner-panel-gantt"
                                role="tabpanel"
                                aria-labelledby="planner-tab-gantt"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={VIEW_TRANSITION}
                                className={`absolute inset-x-0 bottom-0 top-[88px] ${contentTopClass} touch-landscape:!top-0 z-10`}
                            >
                                <GanttView />
                            </motion.div>
                        )}
                        {view === 'roadmap' && (
                            <motion.div
                                key="roadmap"
                                id="planner-panel-roadmap"
                                role="tabpanel"
                                aria-labelledby="planner-tab-roadmap"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={VIEW_TRANSITION}
                                className="fixed inset-0 z-0"
                            >
                                <RoadmapView isOpenAI={isAIModalOpen} onCloseAI={() => setIsAIModalOpen(false)} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Suspense>
            </div>

            {/* Efecte de resplendor de pantalla per a IA */}
            <AnimatePresence>
                {screenGlow && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 1.5 } }}
                        className="fixed inset-0 pointer-events-none z-[150]"
                    >
                        <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(217,70,239,0.15)] border border-fuchsia-500/20 mix-blend-screen" />
                    </motion.div>
                )}
            </AnimatePresence>

            {view !== 'roadmap' && <AIPromptBar isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} />}
            <TaskPopover />

            {/* Feedback flotant d'Undo / Redo */}
            <AnimatePresence>
                {historyToast && (
                    <motion.div
                        key={historyToast.key}
                        initial={{ opacity: 0, y: 16, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2 bg-neutral-900/90 dark:bg-neutral-800/95 text-white rounded-full shadow-2xl border border-white/10 backdrop-blur-md text-xs font-medium pointer-events-none"
                    >
                        {historyToast.type === 'undo' ? (
                            <RotateCcw className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        ) : (
                            <RotateCw className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        )}
                        <span className="truncate max-w-[280px]">
                            {historyToast.type === 'undo' ? t('planner.undone', 'Canvi desfet') : t('planner.redone', 'Canvi refet')}
                            {historyToast.title ? `: ${historyToast.title}` : ''}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PlannerLayout;
