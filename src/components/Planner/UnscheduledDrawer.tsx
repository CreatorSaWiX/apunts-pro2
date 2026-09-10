import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Archive, X, Flag, Clock } from 'lucide-react';
import { m as motion, AnimatePresence } from 'framer-motion';
import type { Task, TaskPriority, Subject } from '../../types/tasks';
import { useTranslation } from 'react-i18next';
import { useTasks } from '../../contexts/TasksContext';
import { getSubjectColor } from '../../stores/useSubjectStore';

interface UnscheduledDrawerProps {
    tasks: Task[];
}

interface DraggableMiniTaskProps {
    task: Task;
    subject?: Subject;
}

/**
 * Estils de xapa per a cada nivell de prioritat
 */
const PRIORITY_BADGE_STYLES: Record<TaskPriority, string> = {
    HIGH: 'text-red-400 bg-red-500/10 border-red-500/20',
    MEDIUM: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    LOW: 'text-slate-400 bg-slate-500/10 border-slate-500/20'
};

/**
 * Formatador del temps estimat en minuts/hores
 */
const formatEstimatedMinutes = (minutes?: number): string => {
    if (!minutes || minutes <= 0) return '1h';
    if (minutes < 60) return `${minutes}m`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

/**
 * Targeta compacta arrossegable per a la safata de backlog
 */
const DraggableMiniTask: React.FC<DraggableMiniTaskProps> = React.memo(({ task, subject }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: task.id,
        data: { type: 'Task', task }
    });

    const subjectColor = subject?.colorToken ? getSubjectColor(subject.colorToken) : null;
    const accentColor = subjectColor?.primary || (
        task.priority === 'HIGH' ? '#EF4444' : 
        task.priority === 'MEDIUM' ? '#F59E0B' : '#64748B'
    );
    const priorityStyle = PRIORITY_BADGE_STYLES[task.priority] || PRIORITY_BADGE_STYLES.LOW;
    const durationStr = formatEstimatedMinutes(task.estimatedMinutes);

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`group/task relative bg-slate-800/80 backdrop-blur-xl border border-white/5 rounded-2xl p-3 flex flex-col gap-1.5 cursor-grab active:cursor-grabbing hover:bg-slate-700/80 hover:border-white/10 transition duration-200 shadow-lg select-none overflow-hidden ${
                isDragging ? 'opacity-30 border-dashed border-white/25 scale-95' : ''
            }`}
        >
            {/* Barra lateral d'accent de color */}
            <div 
                className="absolute top-0 bottom-0 left-0 w-[3px]"
                style={{ backgroundColor: accentColor }}
            />

            {/* Fila principal: prioritat, títol i durada */}
            <div className="flex items-center gap-2 pl-1">
                <div className={`p-1 rounded-md border shrink-0 ${priorityStyle}`}>
                    <Flag size={11} strokeWidth={3} className={task.priority === 'HIGH' ? 'fill-current' : ''} />
                </div>
                <span className="text-xs font-bold text-white truncate flex-1">
                    {task.title || 'Sense títol'}
                </span>
                <span className="text-[10px] font-mono font-medium text-slate-400 shrink-0 flex items-center gap-1 bg-white/[0.04] px-1.5 py-0.5 rounded">
                    <Clock size={10} className="text-slate-500" />
                    {durationStr}
                </span>
            </div>

            {/* Fila secundària: assignatura i descripció */}
            {(subject || task.description) && (
                <div className="flex items-center gap-2 pl-1">
                    {subject && (
                        <span 
                            className="text-[9px] font-bold px-1.5 py-0.2 rounded uppercase tracking-wider truncate max-w-[110px]"
                            style={{
                                color: accentColor,
                                backgroundColor: `rgba(${subjectColor?.primary_rgb || '100,116,139'}, 0.15)`
                            }}
                        >
                            {subject.name}
                        </span>
                    )}
                    {task.description && (
                        <p className="text-[10px] text-slate-400 truncate flex-1">{task.description}</p>
                    )}
                </div>
            )}
        </div>
    );
});

DraggableMiniTask.displayName = 'DraggableMiniTask';

/**
 * Safata flotant de tasques pendents de planificació (Backlog)
 */
const UnscheduledDrawer: React.FC<UnscheduledDrawerProps> = ({ tasks }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const drawerRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const subjects = useTasks(state => state.subjects);

    // Diccionari O(1) d'assignatures per evitar cerques lineals repetides
    const subjectsMap = useMemo(() => {
        const map = new Map<string, Subject>();
        subjects?.forEach(s => map.set(s.id, s));
        return map;
    }, [subjects]);

    const handleToggle = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    const handleClose = useCallback(() => {
        setIsOpen(false);
    }, []);

    // Tancament en fer clic fora o prémer Escape
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e: MouseEvent | TouchEvent) => {
            const target = e.target as Node;
            if (
                drawerRef.current &&
                !drawerRef.current.contains(target) &&
                buttonRef.current &&
                !buttonRef.current.contains(target)
            ) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    if (tasks.length === 0) return null;

    return (
        <>
            {/* Botó flotant d'accés al Backlog */}
            <div className="absolute bottom-6 left-6 z-50">
                <button
                    ref={buttonRef}
                    type="button"
                    onClick={handleToggle}
                    className="group relative flex items-center gap-3 px-5 py-3 rounded-full bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition hover:scale-105 active:scale-95 cursor-pointer"
                    aria-label={isOpen ? t('planner.unscheduled.close', 'Tancar panell') : t('planner.unscheduled.open', 'Obrir panell de tasques')}
                    aria-expanded={isOpen}
                    aria-haspopup="dialog"
                >
                    <div className="relative">
                        <Archive size={20} className="text-slate-300 group-hover:text-white transition-colors" />
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-slate-900 shadow-sm">
                            {tasks.length}
                        </div>
                    </div>
                    <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors hidden sm:block">
                        {t('planner.unscheduled.backlog', 'Backlog')}
                    </span>
                </button>
            </div>

            {/* Panell flotant desplegable (Drawer / Popover) */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={drawerRef}
                        role="dialog"
                        aria-modal="false"
                        aria-label={t('planner.unscheduled.backlog', 'Backlog')}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: 'spring', bounce: 0.25, duration: 0.3 }}
                        className="absolute bottom-24 left-6 z-50 w-80 max-h-[60vh] flex flex-col bg-slate-900/95 backdrop-blur-3xl border border-white/10 rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden"
                    >
                        {/* Capçalera del panell */}
                        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/[0.02]">
                            <div className="flex items-center gap-2">
                                <Archive size={16} className="text-slate-400" />
                                <span className="font-extrabold text-xs tracking-widest text-slate-300 uppercase">
                                    {t('planner.unscheduled.toPlan', 'Per planificar')}
                                </span>
                                <span className="text-[10px] font-bold font-mono px-1.5 py-0.2 rounded-full bg-white/10 text-slate-300">
                                    {tasks.length}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={handleClose}
                                className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                                aria-label={t('common.close', 'Tancar')}
                            >
                                <X size={16} strokeWidth={2.5} />
                            </button>
                        </div>

                        {/* Llista de tasques arrossegables */}
                        <div className="flex-1 overflow-y-auto p-3.5 flex flex-col gap-2.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {tasks.map(task => (
                                <DraggableMiniTask 
                                    key={task.id} 
                                    task={task} 
                                    subject={task.subjectId ? subjectsMap.get(task.subjectId) : undefined}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default UnscheduledDrawer;
