import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Folder, Flag, Calendar, Filter, Search } from 'lucide-react';
import { useTasks, type DateRangeFilter } from '../../contexts/TasksContext';
import type { TaskPriority } from '../../types/tasks';
import { useTranslation } from 'react-i18next';
import BottomSheet from '../ui/mobile/BottomSheet';
import NavigationPill from '../ui/NavigationPill';
import { getSubjectColor } from '../../stores/useSubjectStore';

type FilterType = 'SUBJECTS' | 'PRIORITY' | 'DATERANGE';

const PRIORITIES: TaskPriority[] = ['HIGH', 'MEDIUM', 'LOW'];

const PRIORITY_CONFIG: Record<TaskPriority, {
    labelKey: string;
    defaultLabel: string;
    dotClass: string;
    mobileDotClass: string;
}> = {
    HIGH: {
        labelKey: 'planner.filters.priorities.high',
        defaultLabel: 'Alta',
        dotClass: 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]',
        mobileDotClass: 'bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.5)]'
    },
    MEDIUM: {
        labelKey: 'planner.filters.priorities.medium',
        defaultLabel: 'Mitjana',
        dotClass: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]',
        mobileDotClass: 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.5)]'
    },
    LOW: {
        labelKey: 'planner.filters.priorities.low',
        defaultLabel: 'Baixa',
        dotClass: 'bg-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.5)]',
        mobileDotClass: 'bg-slate-400 shadow-[0_0_12px_rgba(148,163,184,0.5)]'
    }
};

const DATE_RANGE_OPTIONS: { id: DateRangeFilter; labelKey: string; defaultLabel: string }[] = [
    { id: 'ALL', labelKey: 'planner.filters.dateRanges.all', defaultLabel: 'Totes les dates' },
    { id: 'TODAY', labelKey: 'planner.filters.dateRanges.today', defaultLabel: 'Avui' },
    { id: 'THIS_WEEK', labelKey: 'planner.filters.dateRanges.thisWeek', defaultLabel: 'Aquesta setmana' },
    { id: 'THIS_MONTH', labelKey: 'planner.filters.dateRanges.thisMonth', defaultLabel: 'Aquest mes' },
    { id: 'THIS_TERM', labelKey: 'planner.filters.dateRanges.thisTerm', defaultLabel: 'Aquest quatrimestre' }
];

const DROPDOWN_ANIMATION = {
    initial: { opacity: 0, y: -10, scale: 0.9, filter: 'blur(8px)' },
    animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, y: -5, scale: 0.95, filter: 'blur(4px)' },
    transition: { type: 'spring' as const, stiffness: 400, damping: 25, mass: 0.8 }
};

/**
 * Barra global de filtres per al Tauler i el Cronograma (Gantt).
 * Permet filtrar per Assignatures utilitzades, Prioritat i Rang de Dates.
 */
const GlobalFiltersBar: React.FC = () => {
    const { t } = useTranslation();

    // Selectors granulars de Zustand per evitar re-renderitzats en arrossegar o editar tasques
    const subjects = useTasks(state => state.subjects);
    const filters = useTasks(state => state.filters);
    const setFilters = useTasks(state => state.setFilters);
    const clearFilters = useTasks(state => state.clearFilters);

    // Cadena primitiva amb els IDs d'assignatures presents a les tasques.
    // Només genera un canvi d'estat si canvia el conjunt d'assignatures de les tasques,
    // MAI en arrossegar, moure, redimensionar o editar detalls d'una tasca.
    const usedSubjectIdsString = useTasks(useCallback(state => {
        const ids = new Set<string>();
        for (let i = 0; i < state.tasks.length; i++) {
            const sid = state.tasks[i].subjectId;
            if (sid) ids.add(sid);
        }
        return Array.from(ids).sort().join(',');
    }, []));

    const [openFilter, setOpenFilter] = useState<FilterType | null>(null);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [subjectSearch, setSubjectSearch] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    // Només es computen les assignatures utilitzades quan canvia la cadena primitiva d'IDs o el catàleg
    const usedSubjects = useMemo(() => {
        if (!usedSubjectIdsString || !subjects) return [];
        const idSet = new Set(usedSubjectIdsString.split(','));
        return subjects.filter(subject => idSet.has(subject.id));
    }, [subjects, usedSubjectIdsString]);

    // Filtratge ràpid del cercador mòbil
    const filteredSubjects = useMemo(() => {
        const query = subjectSearch.trim().toLowerCase();
        if (!query) return usedSubjects;
        return usedSubjects.filter(s => 
            s.name.toLowerCase().includes(query) || s.id.toLowerCase().includes(query)
        );
    }, [usedSubjects, subjectSearch]);

    const activeFilterCount = 
        filters.subjects.length + 
        filters.priorities.length + 
        (filters.dateRange !== 'ALL' ? 1 : 0);

    const isVisible = usedSubjects.length > 0 || activeFilterCount > 0;

    // Tancament de desplegables en fer clic fora o prémer Escape (només actiu si un menú està obert)
    useEffect(() => {
        if (!openFilter) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpenFilter(null);
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setOpenFilter(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [openFilter]);

    const toggleFilter = useCallback((filter: FilterType) => {
        setOpenFilter(prev => (prev === filter ? null : filter));
    }, []);

    const toggleSubject = useCallback((id: string) => {
        setFilters(prev => ({
            ...prev,
            subjects: prev.subjects.includes(id) 
                ? prev.subjects.filter(sId => sId !== id) 
                : [...prev.subjects, id]
        }));
    }, [setFilters]);

    const togglePriority = useCallback((priority: TaskPriority) => {
        setFilters(prev => ({
            ...prev,
            priorities: prev.priorities.includes(priority) 
                ? prev.priorities.filter(p => p !== priority) 
                : [...prev.priorities, priority]
        }));
    }, [setFilters]);

    const setDateRange = useCallback((range: DateRangeFilter) => {
        setFilters(prev => ({ ...prev, dateRange: range }));
        setOpenFilter(null);
    }, [setFilters]);

    const handleMobileOpen = useCallback(() => {
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
            try { navigator.vibrate(30); } catch { }
        }
        setIsMobileFiltersOpen(true);
    }, []);

    if (!isVisible) {
        return null;
    }

    return (
        <>
            {/* Botó flotant de filtres per a dispositius mòbils (Dalt a l'esquerra) */}
            <div className="md:hidden touch-landscape:hidden fixed top-5 left-4 z-50">
                <NavigationPill>
                    <button
                        type="button"
                        onClick={handleMobileOpen}
                        className={`relative flex items-center justify-center w-11 h-11 transition-colors active:scale-95 cursor-pointer ${
                            activeFilterCount > 0 ? 'text-primary' : 'text-white hover:text-primary'
                        }`}
                        aria-label={t('planner.filters.mobileTitle', 'Filtres')}
                        aria-haspopup="dialog"
                        aria-expanded={isMobileFiltersOpen}
                    >
                        <Filter size={20} />
                        {activeFilterCount > 0 && (
                            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.8)] border-2 border-[#13131A]" />
                        )}
                    </button>
                </NavigationPill>
            </div>

            {/* Barra de filtres d'escriptori centrada */}
            <div
                ref={containerRef}
                className="absolute top-20 md:top-24 left-6 right-6 z-40 flex items-center justify-center gap-3 flex-wrap pointer-events-auto"
            >
                {/* Botó: Netejar tots els filtres (Totes) */}
                <button
                    type="button"
                    onClick={clearFilters}
                    className={`shrink-0 max-md:hidden touch-landscape:hidden px-4 py-1.5 rounded-full text-[10px] font-extrabold tracking-[0.2em] uppercase transition duration-300 border cursor-pointer ${
                        activeFilterCount === 0
                            ? 'bg-white/10 text-white border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.15)]'
                            : 'bg-[#111115]/80 backdrop-blur-xl text-slate-500 border-white/5 hover:border-white/10 hover:text-slate-300'
                    }`}
                    aria-label={t('planner.filters.clearAll', 'Netejar tots els filtres')}
                >
                    {t('planner.filters.all', 'Totes')}
                </button>

                <div className="w-px h-6 bg-white/[0.1] mx-1 shrink-0 max-md:hidden touch-landscape:hidden" />

                {/* Desplegable: Assignatures */}
                {usedSubjects.length > 0 && (
                    <div className="relative shrink-0 max-md:hidden touch-landscape:hidden">
                        <button
                            type="button"
                            onClick={() => toggleFilter('SUBJECTS')}
                            aria-haspopup="listbox"
                            aria-expanded={openFilter === 'SUBJECTS'}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-extrabold tracking-[0.2em] uppercase transition duration-300 border cursor-pointer ${
                                filters.subjects.length > 0
                                    ? 'bg-indigo-400/10 text-indigo-300 border-indigo-400/30'
                                    : 'bg-[#111115]/80 backdrop-blur-xl text-slate-400 border-white/5 hover:border-white/10 hover:text-slate-200'
                            } ${openFilter === 'SUBJECTS' ? 'border-white/20 bg-white/5 text-white' : ''}`}
                        >
                            <Folder size={12} strokeWidth={2.5} />
                            <span>{t('planner.filters.subjects', 'Assignatures')}</span>
                            {filters.subjects.length > 0 && <span>({filters.subjects.length})</span>}
                            <ChevronDown
                                size={12}
                                strokeWidth={3}
                                className={`transition-transform duration-300 ${openFilter === 'SUBJECTS' ? 'rotate-180' : ''}`}
                            />
                        </button>

                        <AnimatePresence>
                            {openFilter === 'SUBJECTS' && (
                                <motion.div
                                    role="listbox"
                                    aria-label={t('planner.filters.subjects', 'Assignatures')}
                                    {...DROPDOWN_ANIMATION}
                                    className="absolute top-full left-0 mt-2 w-56 bg-[#13131A]/70 backdrop-blur-[40px] border border-white/[0.08] rounded-[20px] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] z-50 flex flex-col gap-1 origin-top"
                                >
                                    {usedSubjects.map(subject => {
                                        const isActive = filters.subjects.includes(subject.id);
                                        const color = getSubjectColor(subject.colorToken);
                                        return (
                                            <button
                                                type="button"
                                                role="option"
                                                aria-selected={isActive}
                                                key={subject.id}
                                                onClick={() => toggleSubject(subject.id)}
                                                className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left cursor-pointer"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span 
                                                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" 
                                                        style={{
                                                            backgroundColor: color.primary,
                                                            boxShadow: `0 0 8px rgba(${color.primary_rgb}, 0.5)`
                                                        }}
                                                    />
                                                    <span className={`text-[12px] font-medium truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>
                                                        {subject.name}
                                                    </span>
                                                </div>
                                                {isActive && <Check size={14} className="text-white shrink-0" />}
                                            </button>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* Desplegable: Prioritats */}
                <div className="relative shrink-0 max-md:hidden touch-landscape:hidden">
                    <button
                        type="button"
                        onClick={() => toggleFilter('PRIORITY')}
                        aria-haspopup="listbox"
                        aria-expanded={openFilter === 'PRIORITY'}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-extrabold tracking-[0.2em] uppercase transition duration-300 border cursor-pointer ${
                            filters.priorities.length > 0
                                ? 'bg-amber-400/10 text-amber-300 border-amber-400/30'
                                : 'bg-[#111115]/80 backdrop-blur-xl text-slate-400 border-white/5 hover:border-white/10 hover:text-slate-200'
                        } ${openFilter === 'PRIORITY' ? 'border-white/20 bg-white/5 text-white' : ''}`}
                    >
                        <Flag size={12} strokeWidth={2.5} />
                        <span>{t('planner.filters.priority', 'Prioritat')}</span>
                        {filters.priorities.length > 0 && <span>({filters.priorities.length})</span>}
                        <ChevronDown
                            size={12}
                            strokeWidth={3}
                            className={`transition-transform duration-300 ${openFilter === 'PRIORITY' ? 'rotate-180' : ''}`}
                        />
                    </button>

                    <AnimatePresence>
                        {openFilter === 'PRIORITY' && (
                            <motion.div
                                role="listbox"
                                aria-label={t('planner.filters.priority', 'Prioritat')}
                                {...DROPDOWN_ANIMATION}
                                className="absolute top-full left-0 mt-2 w-48 bg-[#13131A]/70 backdrop-blur-[40px] border border-white/[0.08] rounded-[20px] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] z-50 flex flex-col gap-1 origin-top"
                            >
                                {PRIORITIES.map(p => {
                                    const isActive = filters.priorities.includes(p);
                                    const config = PRIORITY_CONFIG[p];
                                    const label = t(config.labelKey, config.defaultLabel);
                                    return (
                                        <button
                                            type="button"
                                            role="option"
                                            aria-selected={isActive}
                                            key={p}
                                            onClick={() => togglePriority(p)}
                                            className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left cursor-pointer"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${config.dotClass}`} />
                                                <span className={`text-[12px] font-medium ${isActive ? 'text-white' : 'text-slate-300'}`}>
                                                    {label}
                                                </span>
                                            </div>
                                            {isActive && <Check size={14} className="text-white shrink-0" />}
                                        </button>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Desplegable: Data Límit */}
                <div className="relative shrink-0 max-md:hidden touch-landscape:hidden">
                    <button
                        type="button"
                        onClick={() => toggleFilter('DATERANGE')}
                        aria-haspopup="listbox"
                        aria-expanded={openFilter === 'DATERANGE'}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-extrabold tracking-[0.2em] uppercase transition duration-300 border cursor-pointer ${
                            filters.dateRange !== 'ALL'
                                ? 'bg-emerald-400/10 text-emerald-300 border-emerald-400/30'
                                : 'bg-[#111115]/80 backdrop-blur-xl text-slate-400 border-white/5 hover:border-white/10 hover:text-slate-200'
                        } ${openFilter === 'DATERANGE' ? 'border-white/20 bg-white/5 text-white' : ''}`}
                    >
                        <Calendar size={12} strokeWidth={2.5} />
                        <span>{t('planner.filters.deadline', 'Data Límit')}</span>
                        {filters.dateRange !== 'ALL' && <span>(1)</span>}
                        <ChevronDown
                            size={12}
                            strokeWidth={3}
                            className={`transition-transform duration-300 ${openFilter === 'DATERANGE' ? 'rotate-180' : ''}`}
                        />
                    </button>

                    <AnimatePresence>
                        {openFilter === 'DATERANGE' && (
                            <motion.div
                                role="listbox"
                                aria-label={t('planner.filters.deadline', 'Data Límit')}
                                {...DROPDOWN_ANIMATION}
                                className="absolute top-full left-0 mt-2 w-56 bg-[#13131A]/70 backdrop-blur-[40px] border border-white/[0.08] rounded-[20px] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] z-50 flex flex-col gap-1 origin-top"
                            >
                                {DATE_RANGE_OPTIONS.map(range => {
                                    const isActive = filters.dateRange === range.id;
                                    const label = t(range.labelKey, range.defaultLabel);
                                    return (
                                        <button
                                            type="button"
                                            role="option"
                                            aria-selected={isActive}
                                            key={range.id}
                                            onClick={() => setDateRange(range.id)}
                                            className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left cursor-pointer ${
                                                isActive ? 'bg-white/5' : ''
                                            }`}
                                        >
                                            <span className={`text-[12px] font-medium ${isActive ? 'text-white' : 'text-slate-300'}`}>
                                                {label}
                                            </span>
                                            {isActive && <Check size={14} className="text-white shrink-0" />}
                                        </button>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Panell inferior per a dispositius mòbils (BottomSheet) */}
            <BottomSheet 
                isOpen={isMobileFiltersOpen} 
                onClose={() => setIsMobileFiltersOpen(false)}
                title={t('planner.filters.mobileTitle', 'Filtres')}
            >
                <div className="flex flex-col gap-8 pb-4">
                    {/* Secció: Assignatures */}
                    {usedSubjects.length > 0 && (
                        <div className="flex flex-col gap-3">
                            <span className="text-[10px] font-extrabold tracking-[0.15em] uppercase text-slate-500">
                                {t('planner.filters.subjects', 'Assignatures')}
                            </span>
                            
                            {usedSubjects.length > 4 && (
                                <div className="relative">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    <input 
                                        type="text" 
                                        value={subjectSearch}
                                        onChange={(e) => setSubjectSearch(e.target.value)}
                                        placeholder={t('planner.filters.searchSubject', 'Cerca assignatura...')}
                                        className="w-full bg-[#111115] border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-[14px] text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
                                {filteredSubjects.length === 0 ? (
                                    <div className="text-center py-4 text-slate-500 text-sm">
                                        {t('planner.popover.noSubjectsFound', 'Cap assignatura')}
                                    </div>
                                ) : (
                                    filteredSubjects.map(subject => {
                                        const isActive = filters.subjects.includes(subject.id);
                                        const color = getSubjectColor(subject.colorToken);
                                        return (
                                            <button
                                                type="button"
                                                key={subject.id}
                                                onClick={() => toggleSubject(subject.id)}
                                                className={`flex items-center justify-between w-full p-4 rounded-2xl border transition duration-300 cursor-pointer ${
                                                    isActive ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/5'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span 
                                                        className="w-3 h-3 rounded-full shrink-0 shadow-sm" 
                                                        style={{
                                                            backgroundColor: color.primary,
                                                            boxShadow: `0 0 12px rgba(${color.primary_rgb}, 0.5)`
                                                        }}
                                                    />
                                                    <span className={`text-[14px] font-medium truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>
                                                        {subject.name}
                                                    </span>
                                                </div>
                                                {isActive && <Check size={18} className="text-white shrink-0" />}
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    )}

                    {/* Secció: Prioritats */}
                    <div className="flex flex-col gap-3">
                        <span className="text-[10px] font-extrabold tracking-[0.15em] uppercase text-slate-500">
                            {t('planner.filters.priority', 'Prioritat')}
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                            {PRIORITIES.map(p => {
                                const isActive = filters.priorities.includes(p);
                                const config = PRIORITY_CONFIG[p];
                                const label = t(config.labelKey, config.defaultLabel);
                                return (
                                    <button
                                        type="button"
                                        key={p}
                                        onClick={() => togglePriority(p)}
                                        className={`flex flex-col items-start gap-2 w-full p-3 rounded-2xl border transition duration-300 cursor-pointer ${
                                            isActive ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/5'
                                        }`}
                                        aria-label={label}
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <span className={`shrink-0 w-3 h-3 rounded-full ${config.mobileDotClass}`} />
                                            {isActive && <Check size={14} className="text-white shrink-0" />}
                                        </div>
                                        <span className={`text-[12px] font-medium ${isActive ? 'text-white' : 'text-slate-300'} truncate w-full text-left`}>
                                            {label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Secció: Data Límit */}
                    <div className="flex flex-col gap-3">
                        <span className="text-[10px] font-extrabold tracking-[0.15em] uppercase text-slate-500">
                            {t('planner.filters.deadline', 'Data Límit')}
                        </span>
                        <div className="grid grid-cols-1 gap-2">
                            {DATE_RANGE_OPTIONS.map(range => {
                                const isActive = filters.dateRange === range.id;
                                const label = t(range.labelKey, range.defaultLabel);
                                return (
                                    <button
                                        type="button"
                                        key={range.id}
                                        onClick={() => setDateRange(range.id)}
                                        className={`flex items-center justify-between w-full p-4 rounded-2xl border transition duration-300 cursor-pointer ${
                                            isActive ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/5'
                                        }`}
                                    >
                                        <span className={`text-[14px] font-medium ${isActive ? 'text-white' : 'text-slate-300'}`}>
                                            {label}
                                        </span>
                                        {isActive && <Check size={18} className="text-white shrink-0" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </BottomSheet>
        </>
    );
};

export default GlobalFiltersBar;
