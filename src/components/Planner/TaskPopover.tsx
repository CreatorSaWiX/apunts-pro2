import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { m as motion, AnimatePresence } from 'framer-motion';
import { useTasks } from '../../contexts/TasksContext';
import { Flag, Bookmark, Search } from 'lucide-react';
import type { TaskPriority } from '../../types/tasks';
import { useTranslation } from 'react-i18next';
import SubjectPicker from './SubjectPicker';
import BottomSheet from '../ui/mobile/BottomSheet';
import { getSubjectColor } from '../../stores/useSubjectStore';

import { getClampedCoordinates, type TaskPopoverEventDetail } from './plannerEvents';

/**
 * Configuració estàtica per a les opcions de prioritat en vista mòbil
 */
const MOBILE_PRIORITY_OPTIONS: Array<{
    id: TaskPriority;
    dotClass: string;
    selectedClass: string;
    labelKey: string;
    fallbackLabel: string;
}> = [
    {
        id: 'HIGH',
        dotClass: 'bg-red-400',
        selectedClass: 'bg-red-500/15 border-red-500/30 text-white shadow-[inset_0_1px_3px_rgba(255,255,255,0.1)]',
        labelKey: 'planner.popover.priorityHigh',
        fallbackLabel: 'Alta'
    },
    {
        id: 'MEDIUM',
        dotClass: 'bg-amber-400',
        selectedClass: 'bg-amber-500/15 border-amber-500/30 text-white shadow-[inset_0_1px_3px_rgba(255,255,255,0.1)]',
        labelKey: 'planner.popover.priorityMedium',
        fallbackLabel: 'Mitjana'
    },
    {
        id: 'LOW',
        dotClass: 'bg-slate-400',
        selectedClass: 'bg-slate-500/15 border-slate-500/30 text-white shadow-[inset_0_1px_3px_rgba(255,255,255,0.1)]',
        labelKey: 'planner.popover.priorityLow',
        fallbackLabel: 'Baixa'
    }
];

/**
 * Configuració estàtica per a les opcions de prioritat en vista escriptori
 */
const DESKTOP_PRIORITY_OPTIONS: Array<{
    id: TaskPriority;
    selectedClass: string;
    labelKey: string;
    fallbackLabel: string;
}> = [
    {
        id: 'LOW',
        selectedClass: 'text-primary bg-primary/20',
        labelKey: 'planner.popover.priorityLow',
        fallbackLabel: 'BAIX'
    },
    {
        id: 'MEDIUM',
        selectedClass: 'text-amber-400 bg-amber-400/20',
        labelKey: 'planner.popover.priorityMedium',
        fallbackLabel: 'MIG'
    },
    {
        id: 'HIGH',
        selectedClass: 'text-red-400 bg-red-400/20',
        labelKey: 'planner.popover.priorityHigh',
        fallbackLabel: 'ALT'
    }
];

/**
 * Finestra emergent (Popover / BottomSheet) d'edició ràpida de tasques
 */
const TaskPopover: React.FC = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [taskId, setTaskId] = useState<string | null>(null);
    const [localTitle, setLocalTitle] = useState('');
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(false);
    const [subjectSearch, setSubjectSearch] = useState('');

    const popoverRef = useRef<HTMLDivElement>(null);
    const desktopInputRef = useRef<HTMLInputElement>(null);
    const mobileInputRef = useRef<HTMLInputElement>(null);
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Subscripcions selectives de Zustand: només subscrivim quan el popover està obert
    const task = useTasks(useCallback((state) => (taskId ? state.tasks.find(t => t.id === taskId) : undefined), [taskId]));
    const updateTask = useTasks(state => state.updateTask);
    const subjects = useTasks(useCallback(state => (taskId ? state.subjects : undefined), [taskId]));

    // Detecció de vista mòbil (responsive)
    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Sincronitzar el títol local quan es carrega la tasca
    useEffect(() => {
        if (task) {
            setLocalTitle(task.title);
        }
    }, [task?.id]);

    // Obertura del popover mitjançant l'esdeveniment global 'open-task-popover'
    useEffect(() => {
        const handleOpen = (e: Event) => {
            const customEvent = e as CustomEvent<TaskPopoverEventDetail>;
            const { x, y, taskId: targetId } = customEvent.detail;
            
            const coords = getClampedCoordinates(x, y, 260, 300, 10);

            setPosition(coords);
            setTaskId(targetId);
            setSubjectSearch('');
            setIsOpen(true);
        };

        window.addEventListener('open-task-popover', handleOpen);
        return () => window.removeEventListener('open-task-popover', handleOpen);
    }, []);

    // Guardar el títol de forma definitiva a la store i Firestore
    const commitTitle = useCallback((titleToCommit: string) => {
        if (!task) return;
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
            debounceTimerRef.current = null;
        }
        const finalTitle = titleToCommit.trim() || t('planner.task.defaultTitle', 'Nova Tasca');
        if (finalTitle !== task.title) {
            updateTask(task.id, { title: finalTitle });
        }
    }, [task, updateTask, t]);

    // Modificació de títol amb debounce per evitar desenes de peticions de xarxa a Firestore per segon
    const handleTitleChange = useCallback((newTitle: string) => {
        setLocalTitle(newTitle);
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = setTimeout(() => {
            if (task) {
                updateTask(task.id, { title: newTitle });
            }
        }, 400);
    }, [task, updateTask]);

    // Tancament i persistència garantida del títol
    const handleClose = useCallback(() => {
        commitTitle(localTitle);
        setIsOpen(false);
        setTaskId(null);
    }, [commitTitle, localTitle]);

    // Enfocament automàtic a l'input quan s'obre
    useEffect(() => {
        if (isOpen && task) {
            const timer = setTimeout(() => {
                const input = isMobile ? mobileInputRef.current : desktopInputRef.current;
                if (input) {
                    input.focus();
                    input.select();
                }
            }, 60);
            return () => clearTimeout(timer);
        }
    }, [isOpen, taskId, isMobile, !!task]);

    // Tancament en fer clic fora, prémer Escape o fer scroll
    useEffect(() => {
        if (!isOpen) return;

        const isInsidePortal = (target: Node) => {
            if (target instanceof Element && target.closest('.subject-picker-portal')) return true;
            return false;
        };

        const handlePointerDownOutside = (e: PointerEvent) => {
            if (isOpen && popoverRef.current && !popoverRef.current.contains(e.target as Node) && !isInsidePortal(e.target as Node)) {
                if (e.button === 0) {
                    e.stopPropagation();
                }
                handleClose();
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) handleClose();
        };

        const handleScroll = (e: Event) => {
            if (isOpen && popoverRef.current && !popoverRef.current.contains(e.target as Node) && !isInsidePortal(e.target as Node)) {
                handleClose();
            }
        };

        window.addEventListener('pointerdown', handlePointerDownOutside, true);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('scroll', handleScroll, true);

        return () => {
            window.removeEventListener('pointerdown', handlePointerDownOutside, true);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isOpen, handleClose]);

    // Filtre d'assignatures per a la vista mòbil memoitzat
    const filteredSubjects = useMemo(() => {
        if (!subjects) return [];
        const query = subjectSearch.trim().toLowerCase();
        if (!query) return subjects;
        return subjects.filter(s => s.name.toLowerCase().includes(query));
    }, [subjects, subjectSearch]);

    if (!task) return null;

    // Vista per a dispositius mòbils (BottomSheet)
    if (isMobile) {
        return (
            <BottomSheet isOpen={isOpen} onClose={handleClose}>
                <div className="flex flex-col gap-6 mt-1">
                    {/* TÍTOL */}
                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-[16px] px-4 py-3.5 shadow-sm">
                        <input 
                            ref={mobileInputRef}
                            value={localTitle}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            onBlur={() => commitTitle(localTitle)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                                    e.preventDefault();
                                    handleClose();
                                }
                            }}
                            placeholder={t('planner.popover.titlePlaceholder', 'Títol...')}
                            className="text-[17px] font-semibold bg-transparent border-none outline-none text-white w-full placeholder:text-white/30"
                        />
                    </div>

                    {/* ASSIGNATURES */}
                    <div className="flex flex-col gap-3">
                        <div className="px-1 text-[11px] font-bold tracking-[0.15em] uppercase text-slate-400">
                            {t('planner.popover.subjects', 'Assignatures')}
                        </div>
                        
                        <div className="relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input
                                value={subjectSearch}
                                onChange={(e) => setSubjectSearch(e.target.value)}
                                placeholder={t('planner.popover.searchSubject', 'Cerca assignatura...')}
                                className="w-full bg-white/[0.02] border border-white/[0.05] rounded-[14px] pl-10 pr-4 py-3.5 text-[15px] text-white placeholder:text-slate-500 outline-none focus:border-white/20 transition-colors"
                            />
                        </div>

                        <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            {/* Sense Assignatura */}
                            <button
                                type="button"
                                onClick={() => updateTask(task.id, { subjectId: undefined })}
                                className={`flex items-center gap-3.5 p-4 rounded-[14px] border text-left transition ${
                                    !task.subjectId 
                                        ? 'bg-white/[0.08] border-white/[0.12]' 
                                        : 'bg-white/[0.02] border-white/[0.03] hover:bg-white/[0.04]'
                                }`}
                                aria-label={t('planner.popover.noSubject', 'Sense assignatura')}
                            >
                                <div className="w-3 h-3 rounded-full bg-slate-600" />
                                <span className={`text-[15px] font-medium ${!task.subjectId ? 'text-white' : 'text-slate-300'}`}>
                                    {t('planner.popover.noSubject', 'Sense assignatura')}
                                </span>
                            </button>

                            {/* Llista d'assignatures */}
                            {filteredSubjects.map(s => {
                                const isSelected = task.subjectId === s.id;
                                const sColor = getSubjectColor(s.colorToken);
                                return (
                                    <button
                                        type="button"
                                        key={s.id}
                                        onClick={() => updateTask(task.id, { subjectId: s.id })}
                                        style={isSelected ? {
                                            backgroundColor: `rgba(${sColor.primary_rgb}, 0.15)`,
                                            borderColor: `rgba(${sColor.primary_rgb}, 0.3)`,
                                            boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.1)'
                                        } : undefined}
                                        className={`flex items-center gap-3.5 p-4 rounded-[14px] border text-left transition ${
                                            !isSelected ? 'bg-white/[0.02] border-white/[0.03] hover:bg-white/[0.04]' : ''
                                        }`}
                                        aria-label={s.name}
                                    >
                                        <div 
                                            className="w-3 h-3 rounded-full shrink-0" 
                                            style={{
                                                backgroundColor: sColor.primary,
                                                boxShadow: `0 0 10px rgba(${sColor.primary_rgb}, 0.5)`
                                            }}
                                        />
                                        <span className={`text-[15px] font-medium ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                                            {s.name}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* PRIORITAT */}
                    <div className="flex flex-col gap-3 mb-2">
                        <div className="px-1 text-[11px] font-bold tracking-[0.15em] uppercase text-slate-400">
                            {t('planner.filters.priority', 'Prioritat')}
                        </div>
                        <div className="grid grid-cols-3 gap-2.5">
                            {MOBILE_PRIORITY_OPTIONS.map((opt) => {
                                const isSelected = task.priority === opt.id;
                                return (
                                    <button
                                        type="button"
                                        key={opt.id}
                                        onClick={() => updateTask(task.id, { priority: opt.id })}
                                        className={`flex flex-col gap-3 p-4 rounded-[16px] border text-left transition ${
                                            isSelected
                                                ? opt.selectedClass
                                                : 'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.06]'
                                        }`}
                                        aria-label={t(opt.labelKey, opt.fallbackLabel)}
                                    >
                                        <div className={`w-3 h-3 rounded-full ${opt.dotClass} ${isSelected ? 'shadow-[0_0_12px_currentColor]' : ''}`} />
                                        <span className={`text-[15px] font-medium ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                                            {t(opt.labelKey, opt.fallbackLabel)}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </BottomSheet>
        );
    }

    // Vista per a escriptori (Popover flotant amb portal a document.body)
    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    ref={popoverRef}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30, mass: 0.8 }}
                    className="fixed z-[1001] w-[240px] origin-top-left flex flex-col !rounded-[16px] backdrop-blur-xl border border-[var(--glass-border)] border-t-[var(--glass-border-light)] border-l-[var(--glass-border-light)] shadow-[var(--glass-shadow-inner),var(--glass-shadow-outer)] bg-[var(--glass-bg)]"
                    style={{ 
                        left: position.x, 
                        top: position.y,
                        WebkitBackdropFilter: 'blur(24px)'
                    }}
                >
                    {/* Títol Ràpid */}
                    <div className="p-3 border-b border-white/[0.05]">
                        <input 
                            ref={desktopInputRef}
                            value={localTitle}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            onBlur={() => commitTitle(localTitle)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                                    e.preventDefault();
                                    handleClose();
                                }
                            }}
                            placeholder={t('planner.popover.titlePlaceholder', 'Títol...')}
                            className="text-[13px] font-bold bg-transparent border-none outline-none text-white w-full placeholder:text-white/30"
                            autoFocus
                        />
                    </div>

                    <div className="p-2 flex flex-col gap-1">
                        {/* Assignatura */}
                        <div className="px-2 pt-1 pb-1 flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase text-slate-500">
                            <Bookmark size={10} />
                            <span>{t('planner.popover.subject', 'Assignatura')}</span>
                        </div>
                        <div className="px-1 mb-2 relative">
                            <SubjectPicker
                                value={task.subjectId}
                                onChange={(subjectId) => updateTask(task.id, { subjectId: subjectId || undefined })}
                                className="w-full justify-start py-1.5 px-2.5"
                                placeholder={t('planner.popover.noSubject', 'Sense assignatura')}
                            />
                        </div>

                        {/* Prioritat */}
                        <div className="px-2 pt-1 pb-1 flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase text-slate-500">
                            <Flag size={10} />
                            <span>{t('planner.filters.priority', 'Prioritat')}</span>
                        </div>
                        <div className="flex bg-white/[0.02] p-0.5 rounded-lg border border-white/[0.03] mx-1 mb-1">
                            {DESKTOP_PRIORITY_OPTIONS.map((opt) => {
                                const isSelected = task.priority === opt.id;
                                return (
                                    <button 
                                        type="button"
                                        key={opt.id}
                                        onClick={() => updateTask(task.id, { priority: opt.id })}
                                        className={`flex-1 py-1.5 rounded text-[9px] font-bold tracking-wider transition ${
                                            isSelected ? opt.selectedClass : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                                        }`}
                                    >
                                        {t(opt.labelKey, opt.fallbackLabel)}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default TaskPopover;
