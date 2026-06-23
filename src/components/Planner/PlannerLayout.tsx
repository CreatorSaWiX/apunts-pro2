import React, { useState, useMemo, useEffect, Suspense, lazy, useTransition } from 'react';
import { useTasks } from '../../contexts/TasksContext';
import { useSettings } from '../../contexts/SettingsContext';
import NavigationPill from '../ui/NavigationPill';
import { Calendar, LayoutDashboard, GanttChartSquare, Sparkles, Route } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RoadmapProvider } from '../../contexts/RoadmapContext';
import Spinner from '../ui/Spinner';
import AIPromptBar from './AIPromptBar';
import GlobalTaskContextMenu from './GlobalTaskContextMenu';
import GlobalFiltersBar from './GlobalFiltersBar';
import TaskPopover from './TaskPopover';

const BoardView = lazy(() => import('./Board/BoardView'));
const CalendarView = lazy(() => import('./Calendar/CalendarView'));
const GanttView = lazy(() => import('./Gantt/GanttView'));
const RoadmapView = lazy(() => import('./Roadmap/RoadmapView'));
import { ReactFlowProvider } from '@xyflow/react';


type ViewMode = 'board' | 'calendar' | 'gantt' | 'roadmap';

const AIParticles = () => {
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
        <>
            <style>{`
                @keyframes aiParticleFloat {
                    0% { transform: translateY(20px); opacity: 0; }
                    50% { opacity: 0.8; }
                    100% { transform: translateY(-20px); opacity: 0; }
                }
            `}</style>
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-full">
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
        </>
    );
};

const PlannerLayout: React.FC = () => {
    const { isLoading, error, subjects, filters, tasks } = useTasks();
    const { defaultPlannerView } = useSettings();
    const [activeTab, setActiveTab] = useState<ViewMode>(defaultPlannerView || 'board');
    const [view, setView] = useState<ViewMode>(defaultPlannerView || 'board');
    const [isPending, startTransition] = useTransition();
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);
    const [screenGlow, setScreenGlow] = useState(false);

    useEffect(() => {
        const handleMagic = () => {
            setScreenGlow(true);
            setTimeout(() => setScreenGlow(false), 2000); // fade out after 2s
        };
        window.addEventListener('ai-magic-done', handleMagic);
        return () => window.removeEventListener('ai-magic-done', handleMagic);
    }, []);
    // const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

    const usedSubjects = useMemo(() => {
        return subjects.filter(subject => tasks.some(t => t.subjectId === subject.id));
    }, [subjects, tasks]);

    const activeFilterCount = filters.subjects.length + filters.priorities.length + (filters.dateRange !== 'ALL' ? 1 : 0);

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
                Error carregant les tasques: {error}
            </div>
        );
    }

    const FallbackSpinner = () => (
        <div className="flex items-center justify-center w-full h-full min-h-[300px]">
            <Spinner size="xl" variant="primary" className="opacity-50" />
        </div>
    );

    return (
        <RoadmapProvider>
            <div className="flex flex-col flex-1 h-full relative w-full">
                <GlobalTaskContextMenu />
                {/* Let the global Background.tsx handle the background! */}

                {/* Dynamic Island Navigator (Fixed Top Right) */}
                <div className="fixed top-5 md:top-6 right-4 sm:right-6 z-50">
                    <NavigationPill>
                        {[
                            { id: 'board', label: 'Board', icon: LayoutDashboard },
                            { id: 'calendar', label: 'Calendar', icon: Calendar },
                            { id: 'gantt', label: 'Timeline', icon: GanttChartSquare },
                            { id: 'roadmap', label: 'Roadmap', icon: Route }
                        ].map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        if (activeTab === tab.id) return;
                                        setActiveTab(tab.id as ViewMode);
                                        startTransition(() => {
                                            setView(tab.id as ViewMode);
                                        });
                                    }}
                                    className={`relative flex items-center justify-center gap-2 px-4 sm:px-6 h-9 md:h-10 rounded-full transition-all duration-300 text-[11px] sm:text-sm font-bold tracking-wide z-10 group hover:scale-[1.02] active:scale-[0.98] ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'
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
                                    <Icon size={16} strokeWidth={isActive ? 2.5 : 2} className={`transition-colors ${isActive ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'group-hover:text-slate-200'}`} />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                    {/* {isActive && isPending && (
                                        <div className="absolute right-1 sm:right-1.5 flex items-center">
                                            <Spinner size="xs" variant="white" glow={false} />
                                        </div>
                                    )} */}
                                </button>
                            );
                        })}

                        <div className="w-px h-6 bg-white/[0.1] mx-1"></div>

                        <button
                            onClick={() => setIsAIModalOpen(true)}
                            className="group relative flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full transition-all duration-500 shrink-0 hover:scale-[1.05] active:scale-[0.95] overflow-hidden"
                            title="IA Planner"
                        >
                            <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                                <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(217,70,239,0.5)_360deg)] animate-[spin_3s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="absolute inset-[1px] bg-slate-900/90 backdrop-blur-3xl rounded-full" />
                            </div>

                            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.2),transparent_70%)] pointer-events-none" />

                            <AIParticles />

                            <Sparkles size={18} strokeWidth={2.5} className="relative z-10 text-fuchsia-400 group-hover:text-fuchsia-300 transition-all duration-300 drop-shadow-[0_0_8px_rgba(217,70,239,0.6)]" />
                        </button>
                    </NavigationPill>
                </div>

                {/* Global Filters Bar */}
                {(view === 'board' || view === 'gantt') && <GlobalFiltersBar />}

                {/* Main Content Area */}
                <div className="flex-1 relative flex flex-col w-full h-full">

                    <Suspense fallback={<FallbackSpinner />}>
                        <AnimatePresence mode="wait">
                        {view === 'board' && (
                            <motion.div
                                key="board"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.4, ease: 'easeInOut' }}
                                className={`absolute inset-x-0 bottom-0 ${(usedSubjects.length > 0 || activeFilterCount > 0) ? 'top-[140px]' : 'top-[88px]'} z-10`}
                            >
                                <BoardView />
                            </motion.div>
                        )}
                        {view === 'calendar' && (
                            <motion.div
                                key="calendar"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.4, ease: 'easeInOut' }}
                                className="absolute inset-x-0 bottom-0 top-[88px] z-10"
                            >
                                <CalendarView />
                            </motion.div>
                        )}
                        {view === 'gantt' && (
                            <motion.div
                                key="gantt"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.4, ease: 'easeInOut' }}
                                className={`absolute inset-x-0 bottom-0 ${(usedSubjects.length > 0 || activeFilterCount > 0) ? 'top-[140px]' : 'top-[88px]'} z-10`}
                            >
                                <GanttView />
                            </motion.div>
                        )}
                        {view === 'roadmap' && (
                            <motion.div
                                key="roadmap"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.4, ease: 'easeInOut' }}
                                className="fixed inset-0 z-0"
                            >
                                <ReactFlowProvider>
                                    <RoadmapView isOpenAI={isAIModalOpen} onCloseAI={() => setIsAIModalOpen(false)} />
                                </ReactFlowProvider>
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </Suspense>
                </div>

                {/* AI Screen Glow Effect */}
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
            </div>
        </RoadmapProvider>
    );
};

export default PlannerLayout;
