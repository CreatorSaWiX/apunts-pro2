import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Folder, Flag, Calendar } from 'lucide-react';
import { useTasks, type DateRangeFilter } from '../../contexts/TasksContext';
import type { TaskPriority } from '../../types/tasks';

const GlobalFiltersBar: React.FC = () => {
    const { subjects, filters, setFilters, clearFilters, tasks } = useTasks();
    const [openFilter, setOpenFilter] = useState<'SUBJECTS' | 'PRIORITY' | 'DATERANGE' | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const usedSubjects = useMemo(() => {
        return subjects.filter(subject => tasks.some(t => t.subjectId === subject.id));
    }, [subjects, tasks]);

    const activeFilterCount = filters.subjects.length + filters.priorities.length + (filters.dateRange !== 'ALL' ? 1 : 0);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpenFilter(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleFilter = (filter: 'SUBJECTS' | 'PRIORITY' | 'DATERANGE') => {
        setOpenFilter(openFilter === filter ? null : filter);
    };

    if (usedSubjects.length === 0 && activeFilterCount === 0) return null;

    return (
        <div ref={containerRef} className="absolute top-20 md:top-24 left-6 right-6 z-40 flex items-center justify-center gap-3 flex-wrap">
            
            {/* Clear All / Totes */}
            <button
                onClick={clearFilters}
                className={`shrink-0 px-4 py-1.5 rounded-full text-[10px] font-extrabold tracking-[0.2em] uppercase transition-all duration-300 border ${activeFilterCount === 0 ? 'bg-white/10 text-white border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.15)]' : 'bg-[#111115]/80 backdrop-blur-xl text-slate-500 border-white/5 hover:border-white/10 hover:text-slate-300'}`}
            >
                Totes
            </button>

            <div className="w-px h-6 bg-white/[0.1] mx-1 shrink-0"></div>

            {/* Subjects Dropdown */}
            {usedSubjects.length > 0 && (
                <div className="relative shrink-0">
                    <button
                        onClick={() => toggleFilter('SUBJECTS')}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-extrabold tracking-[0.2em] uppercase transition-all duration-300 border ${filters.subjects.length > 0 ? 'bg-indigo-400/10 text-indigo-300 border-indigo-400/30' : 'bg-[#111115]/80 backdrop-blur-xl text-slate-400 border-white/5 hover:border-white/10 hover:text-slate-200'} ${openFilter === 'SUBJECTS' ? 'border-white/20 bg-white/5 text-white' : ''}`}
                    >
                        <Folder size={12} strokeWidth={2.5} />
                        Assignatures {filters.subjects.length > 0 && `(${filters.subjects.length})`}
                        <ChevronDown size={12} strokeWidth={3} className={`transition-transform duration-300 ${openFilter === 'SUBJECTS' ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {openFilter === 'SUBJECTS' && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.9, filter: 'blur(8px)' }}
                                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, y: -5, scale: 0.95, filter: 'blur(4px)' }}
                                transition={{ type: 'spring', stiffness: 400, damping: 25, mass: 0.8 }}
                                className="absolute top-full left-0 mt-2 w-56 bg-[#13131A]/70 backdrop-blur-[40px] border border-white/[0.08] rounded-[20px] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] z-50 flex flex-col gap-1 origin-top"
                            >
                                {usedSubjects.map(subject => {
                                    const isActive = filters.subjects.includes(subject.id);
                                    return (
                                        <button
                                            key={subject.id}
                                            onClick={() => setFilters(prev => ({ ...prev, subjects: isActive ? prev.subjects.filter(id => id !== subject.id) : [...prev.subjects, subject.id] }))}
                                            className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2.5 h-2.5 rounded-full bg-${subject.colorToken.split('-')[0]}-400 shadow-[0_0_8px_rgba(var(--${subject.colorToken.split('-')[0]}-400-rgb),0.5)]`} />
                                                <span className={`text-[12px] font-medium ${isActive ? 'text-white' : 'text-slate-300'}`}>{subject.name}</span>
                                            </div>
                                            {isActive && <Check size={14} className="text-white" />}
                                        </button>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {/* Priorities Dropdown */}
            <div className="relative shrink-0">
                <button
                    onClick={() => toggleFilter('PRIORITY')}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-extrabold tracking-[0.2em] uppercase transition-all duration-300 border ${filters.priorities.length > 0 ? 'bg-amber-400/10 text-amber-300 border-amber-400/30' : 'bg-[#111115]/80 backdrop-blur-xl text-slate-400 border-white/5 hover:border-white/10 hover:text-slate-200'} ${openFilter === 'PRIORITY' ? 'border-white/20 bg-white/5 text-white' : ''}`}
                >
                    <Flag size={12} strokeWidth={2.5} />
                    Prioritat {filters.priorities.length > 0 && `(${filters.priorities.length})`}
                    <ChevronDown size={12} strokeWidth={3} className={`transition-transform duration-300 ${openFilter === 'PRIORITY' ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                    {openFilter === 'PRIORITY' && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.9, filter: 'blur(8px)' }}
                            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -5, scale: 0.95, filter: 'blur(4px)' }}
                            transition={{ type: 'spring', stiffness: 400, damping: 25, mass: 0.8 }}
                            className="absolute top-full left-0 mt-2 w-48 bg-[#13131A]/70 backdrop-blur-[40px] border border-white/[0.08] rounded-[20px] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] z-50 flex flex-col gap-1 origin-top"
                        >
                            {(['HIGH', 'MEDIUM', 'LOW'] as TaskPriority[]).map(p => {
                                const isActive = filters.priorities.includes(p);
                                const labels: Record<string, string> = { HIGH: 'Alta', MEDIUM: 'Mitjana', LOW: 'Baixa' };
                                const colors: Record<string, string> = { HIGH: 'red', MEDIUM: 'amber', LOW: 'slate' };
                                const color = colors[p];
                                return (
                                    <button
                                        key={p}
                                        onClick={() => setFilters(prev => ({ ...prev, priorities: isActive ? prev.priorities.filter(x => x !== p) : [...prev.priorities, p] }))}
                                        className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2.5 h-2.5 rounded-full bg-${color}-400 shadow-[0_0_8px_rgba(var(--${color}-400-rgb),0.5)]`} />
                                            <span className={`text-[12px] font-medium ${isActive ? 'text-white' : 'text-slate-300'}`}>{labels[p]}</span>
                                        </div>
                                        {isActive && <Check size={14} className="text-white" />}
                                    </button>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Date Range Dropdown */}
            <div className="relative shrink-0">
                <button
                    onClick={() => toggleFilter('DATERANGE')}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-extrabold tracking-[0.2em] uppercase transition-all duration-300 border ${filters.dateRange !== 'ALL' ? 'bg-emerald-400/10 text-emerald-300 border-emerald-400/30' : 'bg-[#111115]/80 backdrop-blur-xl text-slate-400 border-white/5 hover:border-white/10 hover:text-slate-200'} ${openFilter === 'DATERANGE' ? 'border-white/20 bg-white/5 text-white' : ''}`}
                >
                    <Calendar size={12} strokeWidth={2.5} />
                    Data Límit {filters.dateRange !== 'ALL' && '(1)'}
                    <ChevronDown size={12} strokeWidth={3} className={`transition-transform duration-300 ${openFilter === 'DATERANGE' ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                    {openFilter === 'DATERANGE' && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.9, filter: 'blur(8px)' }}
                            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -5, scale: 0.95, filter: 'blur(4px)' }}
                            transition={{ type: 'spring', stiffness: 400, damping: 25, mass: 0.8 }}
                            className="absolute top-full left-0 mt-2 w-56 bg-[#13131A]/70 backdrop-blur-[40px] border border-white/[0.08] rounded-[20px] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] z-50 flex flex-col gap-1 origin-top"
                        >
                            {(['ALL', 'TODAY', 'THIS_WEEK', 'THIS_MONTH', 'THIS_TERM'] as DateRangeFilter[]).map(range => {
                                const isActive = filters.dateRange === range;
                                const labels: Record<string, string> = { ALL: 'Totes les dates', TODAY: 'Avui', THIS_WEEK: 'Aquesta setmana', THIS_MONTH: 'Aquest mes', THIS_TERM: 'Aquest quatrimestre' };
                                return (
                                    <button
                                        key={range}
                                        onClick={() => setFilters(prev => ({ ...prev, dateRange: range }))}
                                        className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left ${isActive ? 'bg-white/5' : ''}`}
                                    >
                                        <span className={`text-[12px] font-medium ${isActive ? 'text-white' : 'text-slate-300'}`}>{labels[range]}</span>
                                        {isActive && <Check size={14} className="text-white" />}
                                    </button>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Active Chips (Only shown if something is active and menu is closed) */}
            {/* Wait, the user said "posem TOTES, ASSIG, PRIORITAT, DEADLINE. I que vagin marcant amb checkbox". The buttons themselves act as the indicator, showing (1), (2) etc. We don't need active chips if we have dropdown buttons showing the count! */}
        </div>
    );
};

export default GlobalFiltersBar;
