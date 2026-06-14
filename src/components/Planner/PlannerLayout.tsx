import React, { useState, useMemo } from 'react';
import { useTasks } from '../../contexts/TasksContext';
import { Calendar, LayoutDashboard, GanttChartSquare, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BoardView from './Board/BoardView';
import CalendarView from './Calendar/CalendarView';
import GanttView from './Gantt/GanttView';
import AIModal from './AIModal';
import GlobalTaskContextMenu from './GlobalTaskContextMenu';

type ViewMode = 'board' | 'calendar' | 'gantt';

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
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-full">
            {particles.map(p => (
                <motion.div
                    key={p.id}
                    initial={{ y: 20, x: p.x, opacity: 0 }}
                    animate={{ y: -20, opacity: [0, 0.8, 0] }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: 'linear'
                    }}
                    className="absolute top-1/2 left-1/2 rounded-full bg-fuchsia-400 shadow-[0_0_8px_rgba(232,121,249,0.8)]"
                    style={{ width: p.size, height: p.size, marginLeft: -p.size/2, marginTop: -p.size/2 }}
                />
            ))}
        </div>
    );
};

const PlannerLayout: React.FC = () => {
    const { isLoading, error, subjects, activeSubjectId, setActiveSubjectId, tasks } = useTasks();
    const [view, setView] = useState<ViewMode>('board');
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);

    const usedSubjects = useMemo(() => {
        return subjects.filter(subject => tasks.some(t => t.subjectId === subject.id));
    }, [subjects, tasks]);

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
        <div className="flex flex-col flex-1 h-full relative w-full">
            <GlobalTaskContextMenu />
            {/* Let the global Background.tsx handle the background! */}

            {/* Dynamic Island Navigator (Fixed Top Right) */}
            <div className="fixed top-5 md:top-6 right-4 sm:right-6 z-50">
                <div className="bg-slate-900/80 backdrop-blur-[40px] p-1.5 rounded-full border border-white/[0.12] flex items-center shrink-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden transition-all hover:bg-slate-900/90 hover:border-white/20">
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
                                className={`relative flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full transition-all duration-300 text-[11px] sm:text-sm font-bold tracking-wide z-10 group hover:scale-[1.02] active:scale-[0.98] ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="planner-active-tab"
                                        className="absolute inset-0 bg-white/[0.08] border border-white/[0.12] rounded-full z-[-1] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_0_20px_rgba(255,255,255,0.05)]"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                                    >
                                        <div className="absolute inset-x-4 -bottom-px h-px bg-gradient-to-r from-transparent via-white/40 to-transparent blur-[1px]" />
                                    </motion.div>
                                )}
                                <Icon size={16} strokeWidth={isActive ? 2.5 : 2} className={`transition-colors ${isActive ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'group-hover:text-slate-200'}`} />
                                <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                        );
                    })}

                    <div className="w-px h-6 bg-white/[0.1] mx-1"></div>

                    <button
                        onClick={() => setIsAIModalOpen(true)}
                        className="group relative flex items-center justify-center p-2.5 sm:p-3 rounded-full transition-all duration-500 shrink-0 hover:scale-[1.05] active:scale-[0.95] overflow-hidden"
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
                </div>
            </div>

            {/* Subject Filters (Floating Below Navigation) */}
            {view === 'board' && usedSubjects.length > 0 && (
                <div className="absolute top-20 md:top-24 left-6 right-6 z-40 flex items-center justify-center gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <button
                        onClick={() => setActiveSubjectId(null)}
                        className={`shrink-0 px-4 py-1.5 rounded-full text-[10px] font-extrabold tracking-[0.2em] uppercase transition-all duration-300 border ${!activeSubjectId ? 'bg-white/10 text-white border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.15)]' : 'bg-[#111115]/80 backdrop-blur-xl text-slate-500 border-white/5 hover:border-white/10 hover:text-slate-300'}`}
                    >
                        Totes
                    </button>
                    {usedSubjects.length > 1 && usedSubjects.map(subject => {
                        const isActive = activeSubjectId === subject.id;
                        const getClasses = (token: string) => {
                            switch (token) {
                                case 'emerald-400': return isActive ? 'bg-emerald-400/10 text-emerald-300 border-emerald-400/30 shadow-[0_0_20px_rgba(52,211,153,0.2)]' : 'bg-[#111115]/80 backdrop-blur-xl text-slate-500 border-white/5 hover:border-emerald-400/30 hover:text-emerald-300';
                                case 'fuchsia-400': return isActive ? 'bg-fuchsia-400/10 text-fuchsia-300 border-fuchsia-400/30 shadow-[0_0_20px_rgba(232,121,249,0.2)]' : 'bg-[#111115]/80 backdrop-blur-xl text-slate-500 border-white/5 hover:border-fuchsia-400/30 hover:text-fuchsia-300';
                                case 'amber-400': return isActive ? 'bg-amber-400/10 text-amber-300 border-amber-400/30 shadow-[0_0_20px_rgba(251,191,36,0.2)]' : 'bg-[#111115]/80 backdrop-blur-xl text-slate-500 border-white/5 hover:border-amber-400/30 hover:text-amber-300';
                                case 'cyan-400': return isActive ? 'bg-cyan-400/10 text-cyan-300 border-cyan-400/30 shadow-[0_0_20px_rgba(34,211,238,0.2)]' : 'bg-[#111115]/80 backdrop-blur-xl text-slate-500 border-white/5 hover:border-cyan-400/30 hover:text-cyan-300';
                                case 'indigo-400': return isActive ? 'bg-indigo-400/10 text-indigo-300 border-indigo-400/30 shadow-[0_0_20px_rgba(129,140,248,0.2)]' : 'bg-[#111115]/80 backdrop-blur-xl text-slate-500 border-white/5 hover:border-indigo-400/30 hover:text-indigo-300';
                                default: return isActive ? 'bg-slate-500/10 text-slate-300 border-slate-500/30' : 'bg-[#111115]/80 backdrop-blur-xl text-slate-500 border-white/5 hover:border-slate-500/30 hover:text-slate-400';
                            }
                        };
                        const getDotColor = (token: string) => {
                        switch (token) {
                            case 'emerald-400': return isActive ? 'bg-emerald-300 shadow-[0_0_8px_currentColor] text-emerald-400' : 'bg-emerald-400/50';
                            case 'fuchsia-400': return isActive ? 'bg-fuchsia-300 shadow-[0_0_8px_currentColor] text-fuchsia-400' : 'bg-fuchsia-400/50';
                            case 'amber-400': return isActive ? 'bg-amber-300 shadow-[0_0_8px_currentColor] text-amber-400' : 'bg-amber-400/50';
                            case 'cyan-400': return isActive ? 'bg-cyan-300 shadow-[0_0_8px_currentColor] text-cyan-400' : 'bg-cyan-400/50';
                            case 'indigo-400': return isActive ? 'bg-indigo-300 shadow-[0_0_8px_currentColor] text-indigo-400' : 'bg-indigo-400/50';
                            default: return isActive ? 'bg-slate-300 shadow-[0_0_8px_currentColor] text-slate-400' : 'bg-slate-500/50';
                        }
                    };
                    return (
                        <button
                            key={subject.id}
                            onClick={() => setActiveSubjectId(isActive ? null : subject.id)}
                            className={`shrink-0 flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-extrabold tracking-[0.2em] uppercase transition-all duration-300 border ${getClasses(subject.colorToken)}`}
                        >
                            <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${getDotColor(subject.colorToken)}`} />
                            {subject.name}
                        </button>
                    );
                })}
            </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 relative flex flex-col w-full h-full">

                <AnimatePresence mode="wait">
                    {view === 'board' && (
                        <motion.div key="board" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className={`absolute inset-x-0 bottom-0 ${usedSubjects.length > 0 ? 'top-[140px]' : 'top-[88px]'} z-10`}>
                            <BoardView />
                        </motion.div>
                    )}
                    {view === 'calendar' && (
                        <motion.div key="calendar" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="absolute inset-x-0 bottom-0 top-[88px] z-10">
                            <CalendarView />
                        </motion.div>
                    )}
                    {view === 'gantt' && (
                        <motion.div key="gantt" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="absolute inset-x-0 bottom-0 top-[88px] z-10">
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
