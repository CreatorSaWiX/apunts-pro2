import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { m as motion, AnimatePresence } from 'framer-motion';
import { useTasks } from '../../contexts/TasksContext';
import { Copy, Trash2, Flag } from 'lucide-react';
import type { Task, TaskPriority } from '../../types/tasks';
import { useTranslation } from 'react-i18next';
import { getClampedCoordinates, type TaskContextMenuEventDetail } from './plannerEvents';

const PRIORITIES: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH'];

/**
 * Menú contextual flotant global per a tasques (clic dret).
 * Accessible des de qualsevol vista del planificador (Tauler, Calendari, Gantt).
 */
const GlobalTaskContextMenu: React.FC = () => {
    const { t } = useTranslation();

    // Accions granulars estables de Zustand (zero re-renderitzats per canvis d'estat de tasques)
    const updateTask = useTasks(state => state.updateTask);
    const deleteTask = useTasks(state => state.deleteTask);
    const addTask = useTasks(state => state.addTask);

    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [targetTask, setTargetTask] = useState<Task | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Mantenir la tasca actual sincronitzada amb la versió més recent de la store
    const activeTask = useTasks(state => 
        targetTask ? (state.tasks.find(t => t.id === targetTask.id) ?? targetTask) : null
    );

    const handleCloseMenu = useCallback(() => {
        setIsOpen(false);
        setTargetTask(null);
    }, []);

    // Lògica unificada de duplicació de tasques (preservant subjectId)
    const duplicateTask = useCallback((taskToCopy: Task) => {
        addTask({
            title: `${taskToCopy.title}${t('planner.contextMenu.copySuffix', ' (Còpia)')}`,
            ...(taskToCopy.description ? { description: taskToCopy.description } : {}),
            status: taskToCopy.status,
            priority: taskToCopy.priority,
            dueDate: taskToCopy.dueDate,
            startDate: taskToCopy.startDate,
            estimatedMinutes: taskToCopy.estimatedMinutes,
            subjectId: taskToCopy.subjectId ?? null
        });
    }, [addTask, t]);

    // Obertura del menú contextual amb càlcul segur de límits del viewport
    useEffect(() => {
        const handleOpenMenu = (e: Event) => {
            const customEvent = e as CustomEvent<TaskContextMenuEventDetail>;
            const { x, y, task: taskItem } = customEvent.detail;
            
            const coords = getClampedCoordinates(x, y, 220, 240, 10);

            setPosition(coords);
            setTargetTask(taskItem);
            setIsOpen(true);
        };

        window.addEventListener('open-task-context-menu', handleOpenMenu);
        return () => window.removeEventListener('open-task-context-menu', handleOpenMenu);
    }, []);

    // Gestió de tancament exterior, redimensionament, scroll i dreceres de teclat (Escape, Delete, Alt)
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (!activeTask || e.repeat) return;

            if (e.key === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
                handleCloseMenu();
            } else if (e.key === 'Backspace' || e.key === 'Delete') {
                e.preventDefault();
                deleteTask(activeTask.id);
                handleCloseMenu();
            } else if (e.key === 'Alt' || e.key === 'Option') {
                e.preventDefault();
                duplicateTask(activeTask);
                handleCloseMenu();
            }
        };

        const handlePointerDownOutside = (e: PointerEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                if (e.button === 0) {
                    e.stopPropagation();
                    e.preventDefault();
                }
                handleCloseMenu();
            }
        };

        window.addEventListener('pointerdown', handlePointerDownOutside, true);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('scroll', handleCloseMenu, true);
        window.addEventListener('resize', handleCloseMenu);

        return () => {
            window.removeEventListener('pointerdown', handlePointerDownOutside, true);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('scroll', handleCloseMenu, true);
            window.removeEventListener('resize', handleCloseMenu);
        };
    }, [isOpen, activeTask, deleteTask, duplicateTask, handleCloseMenu]);

    const handleCyclePriority = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!activeTask) return;
        const nextPriority = PRIORITIES[(PRIORITIES.indexOf(activeTask.priority) + 1) % PRIORITIES.length];
        updateTask(activeTask.id, { priority: nextPriority });
        handleCloseMenu();
    };

    const handleDuplicateClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!activeTask) return;
        duplicateTask(activeTask);
        handleCloseMenu();
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (activeTask) {
            deleteTask(activeTask.id);
        }
        handleCloseMenu();
    };

    const priorityInfo = useMemo(() => {
        if (!activeTask) return { color: 'text-slate-400', label: '' };
        switch (activeTask.priority) {
            case 'HIGH':
                return { color: 'text-red-400', label: t('planner.filters.priorities.high', 'Alta') };
            case 'MEDIUM':
                return { color: 'text-amber-400', label: t('planner.filters.priorities.medium', 'Mitjana') };
            case 'LOW':
            default:
                return { color: 'text-slate-400', label: t('planner.filters.priorities.low', 'Baixa') };
        }
    }, [activeTask, t]);

    return createPortal(
        <AnimatePresence>
            {isOpen && activeTask && (
                <motion.div 
                    role="menu"
                    aria-label={t('planner.contextMenu.title', 'Opcions de la tasca')}
                    initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)', y: -10 }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, filter: 'blur(5px)', y: -5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25, mass: 0.8 }}
                    ref={menuRef}
                    className="fixed z-[9999] bg-[#13131A]/70 backdrop-blur-[40px] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] rounded-[20px] p-2 min-w-[210px] flex flex-col gap-1 origin-top-left select-none"
                    style={{ 
                        left: position.x, 
                        top: position.y,
                    }}
                    onClick={(e) => e.stopPropagation()}
                    onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
                >
                    {/* Capçalera del menú amb el títol de la tasca */}
                    <div className="px-3 py-2 border-b border-white/5 mb-1 pointer-events-none select-none">
                        <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 truncate">
                            {activeTask.title || t('planner.untitledTask', 'Tasca sense títol')}
                        </p>
                    </div>

                    {/* Botó: Canviar Prioritat */}
                    <button
                        type="button"
                        role="menuitem"
                        onClick={handleCyclePriority}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-left text-[12px] font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                        aria-label={t('planner.contextMenu.changePriority', 'Canviar Prioritat')}
                    >
                        <Flag size={14} className={priorityInfo.color} />
                        <span>{t('planner.contextMenu.changePriority', 'Canviar Prioritat')}</span>
                        <span className="ml-auto text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                            {priorityInfo.label}
                        </span>
                    </button>
                    
                    {/* Botó: Duplicar */}
                    <button
                        type="button"
                        role="menuitem"
                        onClick={handleDuplicateClick}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-left text-[12px] font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors group cursor-pointer"
                        aria-label={t('planner.contextMenu.duplicate', 'Duplicar')}
                    >
                        <Copy size={14} className="text-slate-400 group-hover:text-white transition-colors" />
                        <span>{t('planner.contextMenu.duplicate', 'Duplicar')}</span>
                        <kbd className="ml-auto text-[10px] text-slate-500 font-mono">Alt</kbd>
                    </button>
                    
                    <div className="h-px bg-white/5 my-1 mx-1" />
                    
                    {/* Botó: Eliminar */}
                    <button
                        type="button"
                        role="menuitem"
                        onClick={handleDeleteClick}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-left text-[12px] font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors group cursor-pointer"
                        aria-label={t('planner.contextMenu.delete', 'Eliminar')}
                    >
                        <Trash2 size={14} />
                        <span>{t('planner.contextMenu.delete', 'Eliminar')}</span>
                        <kbd className="ml-auto text-[10px] text-red-400/60 font-mono">Del</kbd>
                    </button>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default GlobalTaskContextMenu;
