import React, { useEffect, useState, useRef } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { useTasks } from '../../contexts/TasksContext';
import { Flag, Bookmark } from 'lucide-react';
import type { TaskPriority } from '../../types/tasks';
import { useTranslation } from 'react-i18next';
import SubjectPicker from './SubjectPicker';

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

    const task = tasks.find(t => t.id === taskId);

    useEffect(() => {
        const handleOpen = (e: Event) => {
            const customEvent = e as CustomEvent<TaskPopoverEventDetail>;
            const { x, y, taskId: targetId } = customEvent.detail;
            
            // Adjust position so it doesn't go off screen
            const width = 240;
            const height = 200;
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

    if (!isOpen || !task) return null;

    return (
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
        </AnimatePresence>
    );
};

export default TaskPopover;
