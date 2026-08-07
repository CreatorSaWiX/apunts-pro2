import React, { useState, useRef, useEffect, useMemo } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Folder, Flag, Calendar, Filter, Search } from 'lucide-react';
import { useTasks, type DateRangeFilter } from '../../contexts/TasksContext';
import type { TaskPriority } from '../../types/tasks';
import { useTranslation } from 'react-i18next';
import BottomSheet from '../ui/mobile/BottomSheet';
import NavigationPill from '../ui/NavigationPill';

const GlobalFiltersBar: React.FC = () => {
    const { t } = useTranslation();
    const { subjects, filters, setFilters, clearFilters, tasks } = useTasks();
    const [openFilter, setOpenFilter] = useState<'SUBJECTS' | 'PRIORITY' | 'DATERANGE' | null>(null);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [subjectSearch, setSubjectSearch] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const usedSubjects = useMemo(() => {
        return subjects.filter(subject => tasks.some(t => t.subjectId === subject.id));
    }, [subjects, tasks]);

    const filteredSubjects = useMemo(() => {
        if (!subjectSearch.trim()) return usedSubjects;
        const query = subjectSearch.toLowerCase();
        return usedSubjects.filter(s => s.name.toLowerCase().includes(query) || s.id.toLowerCase().includes(query));
    }, [usedSubjects, subjectSearch]);

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
        <>
        {/* Mobile Filter Button (Top Left) */}
        <div className="md:hidden touch-landscape:hidden fixed top-5 left-4 z-50">
            <NavigationPill>
                <button type="button"
                    onClick={() => {
                        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(30);
                        setIsMobileFiltersOpen(true);
                    }}
                    className={`relative flex items-center justify-center w-11 h-11 transition-colors active:scale-95 ${activeFilterCount > 0 ? 'text-primary' : 'text-white hover:text-primary'}`}
                    aria-label="Filtres"
                >
                    <Filter size={20} />
                    {activeFilterCount > 0 && (
                        <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.8)] border-2 border-[#13131A]" />
                    )}
                </button>
            </NavigationPill>
        </div>

        <div ref={containerRef} className="absolute top-20 md:top-24 left-6 right-6 z-40 flex items-center justify-center gap-3 flex-wrap">
            
            {/* Clear All / Totes */}
            <button type="button"
                onClick={clearFilters}
                className={`shrink-0 max-md:hidden touch-landscape:hidden px-4 py-1.5 rounded-full text-[10px] font-extrabold tracking-[0.2em] uppercase transition-all duration-300 border ${activeFilterCount === 0 ? 'bg-white/10 text-white border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.15)]' : 'bg-[#111115]/80 backdrop-blur-xl text-slate-500 border-white/5 hover:border-white/10 hover:text-slate-300'}`}
            >
                {t('planner.filters.all', 'Totes')}
            </button>

            <div className="w-px h-6 bg-white/[0.1] mx-1 shrink-0 max-md:hidden touch-landscape:hidden"></div>

            {/* Subjects Dropdown */}
            {usedSubjects.length > 0 && (
                <div className="relative shrink-0 max-md:hidden touch-landscape:hidden">
                    <button type="button"
                        onClick={() => toggleFilter('SUBJECTS')}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-extrabold tracking-[0.2em] uppercase transition-all duration-300 border ${filters.subjects.length > 0 ? 'bg-indigo-400/10 text-indigo-300 border-indigo-400/30' : 'bg-[#111115]/80 backdrop-blur-xl text-slate-400 border-white/5 hover:border-white/10 hover:text-slate-200'} ${openFilter === 'SUBJECTS' ? 'border-white/20 bg-white/5 text-white' : ''}`}
                    >
                        <Folder size={12} strokeWidth={2.5} />
                        {t('planner.filters.subjects', 'Assignatures')} {filters.subjects.length > 0 && `(${filters.subjects.length})`}
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
                                        <button type="button"
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
            <div className="relative shrink-0 max-md:hidden touch-landscape:hidden">
                <button type="button"
                    onClick={() => toggleFilter('PRIORITY')}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-extrabold tracking-[0.2em] uppercase transition-all duration-300 border ${filters.priorities.length > 0 ? 'bg-amber-400/10 text-amber-300 border-amber-400/30' : 'bg-[#111115]/80 backdrop-blur-xl text-slate-400 border-white/5 hover:border-white/10 hover:text-slate-200'} ${openFilter === 'PRIORITY' ? 'border-white/20 bg-white/5 text-white' : ''}`}
                >
                    <Flag size={12} strokeWidth={2.5} />
                    {t('planner.filters.priority', 'Prioritat')} {filters.priorities.length > 0 && `(${filters.priorities.length})`}
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
                                const labels: Record<string, string> = { 
                                    HIGH: t('planner.filters.priorities.high', 'Alta'), 
                                    MEDIUM: t('planner.filters.priorities.medium', 'Mitjana'), 
                                    LOW: t('planner.filters.priorities.low', 'Baixa') 
                                };
                                const colors: Record<string, string> = { HIGH: 'red', MEDIUM: 'amber', LOW: 'slate' };
                                const color = colors[p];
                                return (
                                    <button type="button"
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
            <div className="relative shrink-0 max-md:hidden touch-landscape:hidden">
                <button type="button"
                    onClick={() => toggleFilter('DATERANGE')}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-extrabold tracking-[0.2em] uppercase transition-all duration-300 border ${filters.dateRange !== 'ALL' ? 'bg-emerald-400/10 text-emerald-300 border-emerald-400/30' : 'bg-[#111115]/80 backdrop-blur-xl text-slate-400 border-white/5 hover:border-white/10 hover:text-slate-200'} ${openFilter === 'DATERANGE' ? 'border-white/20 bg-white/5 text-white' : ''}`}
                >
                    <Calendar size={12} strokeWidth={2.5} />
                    {t('planner.filters.deadline', 'Data Límit')} {filters.dateRange !== 'ALL' && '(1)'}
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
                                const labels: Record<string, string> = { 
                                    ALL: t('planner.filters.dateRanges.all', 'Totes les dates'), 
                                    TODAY: t('planner.filters.dateRanges.today', 'Avui'), 
                                    THIS_WEEK: t('planner.filters.dateRanges.thisWeek', 'Aquesta setmana'), 
                                    THIS_MONTH: t('planner.filters.dateRanges.thisMonth', 'Aquest mes'), 
                                    THIS_TERM: t('planner.filters.dateRanges.thisTerm', 'Aquest quatrimestre') 
                                };
                                return (
                                    <button type="button"
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

            {/* Bottom Sheet for Mobile Filters */}
            <BottomSheet 
                isOpen={isMobileFiltersOpen} 
                onClose={() => setIsMobileFiltersOpen(false)}
                title={t('planner.filters.mobileTitle', 'Filtres')}
            >
                <div className="flex flex-col gap-8 pb-4">
                    {/* Subjects Section */}
                    {usedSubjects.length > 0 && (
                        <div className="flex flex-col gap-3">
                            <span className="text-[10px] font-extrabold tracking-[0.15em] uppercase text-slate-500">{t('planner.filters.subjects', 'Assignatures')}</span>
                            
                            {usedSubjects.length > 4 && (
                                <div className="relative">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input 
                                        type="text" 
                                        value={subjectSearch}
                                        onChange={(e) => setSubjectSearch(e.target.value)}
                                        placeholder={t('planner.filters.searchSubject', 'Cerca assignatura...')}
                                        className="w-full bg-[#111115] border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-[14px] text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
                                {filteredSubjects.length === 0 ? (
                                    <div className="text-center py-4 text-slate-500 text-sm">Cap assignatura</div>
                                ) : (
                                    filteredSubjects.map(subject => {
                                        const isActive = filters.subjects.includes(subject.id);
                                        return (
                                            <button type="button"
                                                key={subject.id}
                                                onClick={() => setFilters(prev => ({ ...prev, subjects: isActive ? prev.subjects.filter(id => id !== subject.id) : [...prev.subjects, subject.id] }))}
                                                className={`flex items-center justify-between w-full p-4 rounded-2xl border transition-all duration-300 ${isActive ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/5'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className={`w-3 h-3 rounded-full bg-${subject.colorToken.split('-')[0]}-400 shadow-[0_0_12px_rgba(var(--${subject.colorToken.split('-')[0]}-400-rgb),0.5)]`} />
                                                    <span className={`text-[14px] font-medium ${isActive ? 'text-white' : 'text-slate-300'}`}>{subject.name}</span>
                                                </div>
                                                {isActive && <Check size={18} className="text-white" />}
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    )}

                    {/* Priorities Section */}
                    <div className="flex flex-col gap-3">
                        <span className="text-[10px] font-extrabold tracking-[0.15em] uppercase text-slate-500">{t('planner.filters.priority', 'Prioritat')}</span>
                        <div className="grid grid-cols-3 gap-2">
                            {(['HIGH', 'MEDIUM', 'LOW'] as TaskPriority[]).map(p => {
                                const isActive = filters.priorities.includes(p);
                                const labels: Record<string, string> = { 
                                    HIGH: t('planner.filters.priorities.high', 'Alta'), 
                                    MEDIUM: t('planner.filters.priorities.medium', 'Mitjana'), 
                                    LOW: t('planner.filters.priorities.low', 'Baixa') 
                                };
                                const colors: Record<string, string> = { HIGH: 'red', MEDIUM: 'amber', LOW: 'slate' };
                                const color = colors[p];
                                return (
                                    <button type="button"
                                        key={p}
                                        onClick={() => setFilters(prev => ({ ...prev, priorities: isActive ? prev.priorities.filter(x => x !== p) : [...prev.priorities, p] }))}
                                        className={`flex flex-col items-start gap-2 w-full p-3 rounded-2xl border transition-all duration-300 ${isActive ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/5'}`}
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <span className={`shrink-0 w-3 h-3 rounded-full bg-${color}-400 shadow-[0_0_12px_rgba(var(--${color}-400-rgb),0.5)]`} />
                                            {isActive && <Check size={14} className="text-white shrink-0" />}
                                        </div>
                                        <span className={`text-[12px] font-medium ${isActive ? 'text-white' : 'text-slate-300'} truncate w-full text-left`}>{labels[p]}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Date Range Section */}
                    <div className="flex flex-col gap-3">
                        <span className="text-[10px] font-extrabold tracking-[0.15em] uppercase text-slate-500">{t('planner.filters.deadline', 'Data Límit')}</span>
                        <div className="grid grid-cols-1 gap-2">
                            {(['ALL', 'TODAY', 'THIS_WEEK', 'THIS_MONTH', 'THIS_TERM'] as DateRangeFilter[]).map(range => {
                                const isActive = filters.dateRange === range;
                                const labels: Record<string, string> = { 
                                    ALL: t('planner.filters.dateRanges.all', 'Totes les dates'), 
                                    TODAY: t('planner.filters.dateRanges.today', 'Avui'), 
                                    THIS_WEEK: t('planner.filters.dateRanges.thisWeek', 'Aquesta setmana'), 
                                    THIS_MONTH: t('planner.filters.dateRanges.thisMonth', 'Aquest mes'), 
                                    THIS_TERM: t('planner.filters.dateRanges.thisTerm', 'Aquest quatrimestre') 
                                };
                                return (
                                    <button type="button"
                                        key={range}
                                        onClick={() => setFilters(prev => ({ ...prev, dateRange: range }))}
                                        className={`flex items-center justify-between w-full p-4 rounded-2xl border transition-all duration-300 ${isActive ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/5'}`}
                                    >
                                        <span className={`text-[14px] font-medium ${isActive ? 'text-white' : 'text-slate-300'}`}>{labels[range]}</span>
                                        {isActive && <Check size={18} className="text-white" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </BottomSheet>
        </div>
        </>
    );
};

export default GlobalFiltersBar;
