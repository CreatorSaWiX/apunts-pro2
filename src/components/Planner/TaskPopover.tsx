import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { m as motion, AnimatePresence } from 'framer-motion';
import { useTasks } from '../../contexts/TasksContext';
import { Flag, Bookmark, Search } from 'lucide-react';
import type { TaskPriority } from '../../types/tasks';
import { useTranslation } from 'react-i18next';
import SubjectPicker from './SubjectPicker';
import BottomSheet from '../ui/mobile/BottomSheet';

export interface TaskPopoverEventDetail {
    x: number;
    y: number;
    taskId: string;
}

const TaskPopover: React.FC = () => {
    const { t } = useTranslation();
    const { tasks, updateTask, subjects } = useTasks();
    const [isOpen, setIsOpen] = useState(false);
    const [taskId, setTaskId] = useState<string | null>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const popoverRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [subjectSearch, setSubjectSearch] = useState('');

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const task = tasks.find(t => t.id === taskId);

    useEffect(() => {
        const handleOpen = (e: Event) => {
            const customEvent = e as CustomEvent<TaskPopoverEventDetail>;
            const { x, y, taskId: targetId } = customEvent.detail;
            
            // Adjust position so it doesn't go off screen (overestimate size)
            const width = 300;
            const height = 350;
            let finalX = x;
            let finalY = y;
            
            if (x + width > window.innerWidth) finalX = window.innerWidth - width - 10;
            if (y + height > window.innerHeight) finalY = window.innerHeight - height - 10;

            setPosition({ x: finalX, y: finalY });
            setTaskId(targetId);
            setIsOpen(true);
        };

        window.addEventListener('open-task-popover', handleOpen);
        return () => window.removeEventListener('open-task-popover', handleOpen);
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        const handleClose = () => setIsOpen(false);

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
    }, [isOpen]);

    if (!task) return null;

    if (isMobile) {
        const filteredSubjects = subjects?.filter(s => s.name.toLowerCase().includes(subjectSearch.toLowerCase())) || [];

        return (
            <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <div className="flex flex-col gap-6 mt-1">
                    {/* TÍTOL */}
                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-[16px] px-4 py-3.5 shadow-sm">
                        <input 
                            value={task.title}
                            onChange={(e) => updateTask(task.id, { title: e.target.value })}
                            placeholder={t('planner.popover.titlePlaceholder', "Títol...")}
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
                                onClick={() => updateTask(task.id, { subjectId: undefined })}
                                className={`flex items-center gap-3.5 p-4 rounded-[14px] border text-left transition-all ${
                                    !task.subjectId 
                                        ? 'bg-white/[0.08] border-white/[0.12]' 
                                        : 'bg-white/[0.02] border-white/[0.03] hover:bg-white/[0.04]'
                                }`}
                            >
                                <div className="w-3 h-3 rounded-full bg-slate-600" />
                                <span className={`text-[15px] font-medium ${!task.subjectId ? 'text-white' : 'text-slate-300'}`}>Sense Assignatura</span>
                            </button>

                            {/* Llista d'assignatures */}
                            {filteredSubjects.map(s => {
                                const isSelected = task.subjectId === s.id;
                                return (
                                    <button
                                        key={s.id}
                                        onClick={() => updateTask(task.id, { subjectId: s.id })}
                                        className={`flex items-center gap-3.5 p-4 rounded-[14px] border text-left transition-all ${
                                            isSelected 
                                                ? `bg-${s.colorToken}/15 border-${s.colorToken}/30 shadow-[inset_0_1px_3px_rgba(255,255,255,0.1)]` 
                                                : 'bg-white/[0.02] border-white/[0.03] hover:bg-white/[0.04]'
                                        }`}
                                    >
                                        <div className={`w-3 h-3 rounded-full bg-${s.colorToken} shadow-[0_0_10px_currentColor]`} />
                                        <span className={`text-[15px] font-medium ${isSelected ? 'text-white' : 'text-slate-300'}`}>{s.name}</span>
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
                            {(['HIGH', 'MEDIUM', 'LOW'] as TaskPriority[]).map((p) => {
                                const isSelected = task.priority === p;
                                const colors = {
                                    HIGH: 'red-400',
                                    MEDIUM: 'amber-400',
                                    LOW: 'slate-400'
                                };
                                const dotColor = `bg-${colors[p]}`;
                                const labels = {
                                    HIGH: 'Alta',
                                    MEDIUM: 'Mitjana',
                                    LOW: 'Baixa'
                                };
                                return (
                                    <button
                                        key={p}
                                        onClick={() => updateTask(task.id, { priority: p })}
                                        className={`flex flex-col gap-3 p-4 rounded-[16px] border text-left transition-all ${
                                            isSelected
                                                ? `bg-${colors[p]}/15 border-${colors[p]}/30 shadow-[inset_0_1px_3px_rgba(255,255,255,0.1)]`
                                                : 'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.06]'
                                        }`}
                                    >
                                        <div className={`w-3 h-3 rounded-full ${dotColor} ${isSelected ? 'shadow-[0_0_12px_currentColor]' : ''}`} />
                                        <span className={`text-[15px] font-medium ${isSelected ? 'text-white' : 'text-slate-400'}`}>{labels[p]}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </BottomSheet>
        );
    }

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    ref={popoverRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30, mass: 0.8 }}
                    className="fixed z-[1001] w-[240px] flex flex-col origin-top-left flex flex-col !rounded-[16px] backdrop-blur-xl border border-[var(--glass-border)] border-t-[var(--glass-border-light)] border-l-[var(--glass-border-light)] shadow-[var(--glass-shadow-inner),var(--glass-shadow-outer)] bg-[var(--glass-bg)]"
                    style={{ 
                        left: position.x, 
                        top: position.y,
                        WebkitBackdropFilter: 'blur(24px)'
                    }}
                >
                    {/* Títol Ràpid */}
                    <div className="p-3 border-b border-white/[0.05]">
                        <input 
                            value={task.title}
                            onChange={(e) => updateTask(task.id, { title: e.target.value })}
                            placeholder={t('planner.popover.titlePlaceholder', "Títol...")}
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
                                className="w-full justify-between py-1.5"
                                placeholder={t('planner.popover.noSubject', 'Sense Assignatura')}
                            />
                        </div>

                        {/* Prioritat */}
                        <div className="px-2 pt-1 pb-1 flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase text-slate-500">
                            <Flag size={10} />
                            <span>{t('planner.filters.priority', 'Prioritat')}</span>
                        </div>
                        <div className="flex bg-white/[0.02] p-0.5 rounded-lg border border-white/[0.03] mx-1 mb-1">
                            {(['LOW', 'MEDIUM', 'HIGH'] as TaskPriority[]).map((p) => {
                                const colors = {
                                    LOW: 'text-primary bg-primary/20',
                                    MEDIUM: 'text-amber-400 bg-amber-400/20',
                                    HIGH: 'text-red-400 bg-red-400/20'
                                };
                                const isSelected = task.priority === p;
                                return (
                                    <button type="button"
                                        key={p}
                                        onClick={() => updateTask(task.id, { priority: p })}
                                        className={`flex-1 py-1.5 rounded text-[9px] font-bold tracking-wider transition-all ${
                                            isSelected ? colors[p] : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                                        }`}
                                    >
                                        {p === 'LOW' ? t('planner.popover.priorityLow', 'BAIX') : p === 'MEDIUM' ? t('planner.popover.priorityMedium', 'MIG') : t('planner.popover.priorityHigh', 'ALT')}
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
