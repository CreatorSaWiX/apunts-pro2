import React, { useState } from 'react';
import { useTasks } from '../../contexts/TasksContext';
import { Calendar, LayoutDashboard, GanttChartSquare, Bot, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BoardView from './Board/BoardView';
import CalendarView from './Calendar/CalendarView';
import GanttView from './Gantt/GanttView';
import AIModal from './AIModal';

type ViewMode = 'board' | 'calendar' | 'gantt';

const PlannerLayout: React.FC = () => {
    const { isLoading, error } = useTasks();
    const [view, setView] = useState<ViewMode>('board');
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center flex-1">
                <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
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

    return (
        <div className="flex flex-col flex-1 h-full">
            {/* Let the global Background.tsx handle the background! */}

            {/* Header / Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 shrink-0 px-2 mt-4">
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5 w-full sm:w-auto">
                    {/* Tabs Consistents amb HomePage */}
                    <div className="bg-white/[0.02] backdrop-blur-3xl p-1.5 rounded-full border border-white/5 flex shrink-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.8)] relative">
                        {[
                            { id: 'board', label: 'Board', icon: LayoutDashboard },
                            { id: 'calendar', label: 'Calendar', icon: Calendar },
                            { id: 'gantt', label: 'Timeline', icon: GanttChartSquare }
                        ].map((tab) => {
                            const Icon = tab.icon;
                            const isActive = view === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setView(tab.id as ViewMode)}
                                    className={`relative flex items-center gap-2 px-6 py-2.5 rounded-full transition-all text-sm font-semibold tracking-wide z-10 ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="planner-active-tab-consistent"
                                            className="absolute inset-0 bg-white/10 border border-white/10 rounded-full z-[-1] shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        />
                                    )}
                                    <Icon size={16} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-white' : ''} />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* AI Button Consistent */}
                    <button
                        onClick={() => setIsAIModalOpen(true)}
                        className="group relative flex items-center gap-2 bg-white/[0.03] backdrop-blur-xl text-white px-6 py-2.5 rounded-full transition-all duration-300 text-sm font-bold tracking-wide shrink-0 border border-white/10 hover:border-violet-500/50 hover:bg-white/[0.05] overflow-hidden shadow-lg hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]"
                    >
                        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.25),transparent_70%)] z-[-1]" />
                        <Sparkles size={16} strokeWidth={2.5} className="text-violet-400 group-hover:text-fuchsia-400 transition-colors duration-300 group-hover:animate-pulse" />
                        <span>IA Planner</span>
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 relative flex flex-col w-full h-full">

                <AnimatePresence mode="wait">
                    {view === 'board' && (
                        <motion.div key="board" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="absolute inset-0 z-10">
                            <BoardView />
                        </motion.div>
                    )}
                    {view === 'calendar' && (
                        <motion.div key="calendar" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="absolute inset-0 z-10">
                            <CalendarView />
                        </motion.div>
                    )}
                    {view === 'gantt' && (
                        <motion.div key="gantt" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="absolute inset-0 z-10">
                            <GanttView />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AIModal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} />
        </div>
    );
};

export default PlannerLayout;
