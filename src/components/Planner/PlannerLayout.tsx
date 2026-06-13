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
                    {/* Dynamic Island Navigator */}
                    <div className="bg-slate-900/40 backdrop-blur-[40px] p-1.5 rounded-full border border-white/[0.08] flex shrink-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
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
                                    className={`relative flex items-center gap-2 px-6 py-2.5 rounded-full transition-all duration-300 text-sm font-bold tracking-wide z-10 group hover:scale-[1.02] active:scale-[0.98] ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="planner-active-tab"
                                            className="absolute inset-0 bg-white/[0.08] border border-white/[0.12] rounded-full z-[-1] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_0_20px_rgba(255,255,255,0.05)]"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 500, damping: 35 }}
                                        >
                                            {/* Glow sub-layer */}
                                            <div className="absolute inset-x-4 -bottom-px h-px bg-gradient-to-r from-transparent via-white/40 to-transparent blur-[1px]" />
                                        </motion.div>
                                    )}
                                    <Icon size={16} strokeWidth={isActive ? 2.5 : 2} className={`transition-colors ${isActive ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'group-hover:text-slate-200'}`} />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Magic AI Button */}
                    <button
                        onClick={() => setIsAIModalOpen(true)}
                        className="group relative flex items-center gap-2 px-6 py-2.5 rounded-full transition-all duration-500 text-sm font-extrabold tracking-wide shrink-0 hover:scale-[1.02] active:scale-[0.98] overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.15)] hover:shadow-[0_0_40px_rgba(168,85,247,0.3)]"
                    >
                        {/* Animated Border Wrapper */}
                        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                            <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(217,70,239,0.8)_360deg)] animate-[spin_3s_linear_infinite] opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute inset-[1px] bg-slate-900/90 backdrop-blur-3xl rounded-full" />
                        </div>
                        
                        {/* Inner Hover Glow */}
                        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.3),transparent_70%)] pointer-events-none" />

                        {/* Content */}
                        <Sparkles size={16} strokeWidth={2.5} className="relative z-10 text-fuchsia-400 group-hover:text-fuchsia-300 transition-colors duration-300 drop-shadow-[0_0_8px_rgba(217,70,239,0.5)]" />
                        <span className="relative z-10 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">IA Planner</span>
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
