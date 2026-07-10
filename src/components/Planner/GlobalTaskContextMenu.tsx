import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasks } from '../../contexts/TasksContext';
import { Copy, Trash2, Flag } from 'lucide-react';
import type { Task, TaskPriority } from '../../types/tasks';
import { useTranslation } from 'react-i18next';

export interface ContextMenuEventDetail {
    x: number;
    y: number;
    task: Task;
}

const GlobalTaskContextMenu: React.FC = () => {
    const { t } = useTranslation();
    const { updateTask, deleteTask, addTask } = useTasks();
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [task, setTask] = useState<Task | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOpenMenu = (e: Event) => {
            const customEvent = e as CustomEvent<ContextMenuEventDetail>;
            const { x, y, task: targetTask } = customEvent.detail;
            
            // Adjust position if it goes off screen
            let finalX = x;
            let finalY = y;
            
            // Approximate menu size
            const menuWidth = 180;
            const menuHeight = 160;
            
            if (x + menuWidth > window.innerWidth) {
                finalX = window.innerWidth - menuWidth - 10;
            }
            if (y + menuHeight > window.innerHeight) {
                finalY = window.innerHeight - menuHeight - 10;
            }

            setPosition({ x: finalX, y: finalY });
            setTask(targetTask);
            setIsOpen(true);
        };

        window.addEventListener('open-task-context-menu', handleOpenMenu);
        return () => window.removeEventListener('open-task-context-menu', handleOpenMenu);
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        const handleCloseMenu = () => {
            setIsOpen(false);
            setTask(null);
        };

        const handlePointerDownOutside = (e: PointerEvent) => {
            if (isOpen && menuRef.current && !menuRef.current.contains(e.target as Node)) {
                if (e.button === 0) {
                    e.stopPropagation();
                    e.preventDefault();
                }
                handleCloseMenu();
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen || !task || e.repeat) return;
            if (e.key === 'Backspace' || e.key === 'Delete') {
                e.preventDefault();
                deleteTask(task.id);
                handleCloseMenu();
            } else if (e.key === 'Alt' || e.key === 'Option') {
                e.preventDefault();
                addTask({
                    title: `${task.title}${t('planner.contextMenu.copySuffix', ' (Còpia)')}`,
                    ...(task.description ? { description: task.description } : {}),
                    status: task.status,
                    priority: task.priority,
                    dueDate: task.dueDate,
                    startDate: task.startDate,
                    estimatedMinutes: task.estimatedMinutes,
                    source: task.source
                });
                handleCloseMenu();
            }
        };

        window.addEventListener('pointerdown', handlePointerDownOutside, true);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('scroll', handleCloseMenu, true); // Close on any scroll

        return () => {
            window.removeEventListener('pointerdown', handlePointerDownOutside, true);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('scroll', handleCloseMenu, true);
        };
    }, [deleteTask, addTask, isOpen, task]);

    const handleDuplicate = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!task) return;
        addTask({
            title: `${task.title}${t('planner.contextMenu.copySuffix', ' (Còpia)')}`,
            ...(task.description ? { description: task.description } : {}),
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate,
            startDate: task.startDate,
            estimatedMinutes: task.estimatedMinutes,
            source: task.source
        });
        setIsOpen(false);
    };

    const handleCyclePriority = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!task) return;
        const priorities: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH'];
        const next = priorities[(priorities.indexOf(task.priority) + 1) % priorities.length];
        updateTask(task.id, { priority: next });
        setIsOpen(false);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (task) deleteTask(task.id);
        setIsOpen(false);
    };

    return (
        <AnimatePresence>
            {isOpen && task && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)', y: -10 }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, filter: 'blur(5px)', y: -5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25, mass: 0.8 }}
                    ref={menuRef}
                    className="fixed z-[9999] bg-[#13131A]/70 backdrop-blur-[40px] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] rounded-[20px] p-2 min-w-[200px] flex flex-col gap-1 origin-top-left"
                    style={{ 
                        left: position.x, 
                        top: position.y,
                    }}
                    onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
                >
                    <div className="px-3 py-2 border-b border-white/5 mb-1 pointer-events-none select-none">
                        <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 truncate">{task.title}</p>
                    </div>

                    <button 
                        onClick={handleCyclePriority}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-left text-[12px] font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                    >
                        <Flag size={14} className={task.priority === 'HIGH' ? 'text-red-400' : task.priority === 'MEDIUM' ? 'text-amber-400' : 'text-slate-400'} />
                        <span>{t('planner.contextMenu.changePriority', 'Canviar Prioritat')}</span>
                    </button>
                    
                    <button 
                        onClick={handleDuplicate}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-left text-[12px] font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors group"
                    >
                        <Copy size={14} className="text-slate-400 group-hover:text-white transition-colors" />
                        <span>{t('planner.contextMenu.duplicate', 'Duplicar')}</span>
                    </button>
                    
                    <div className="h-px bg-white/5 my-1 mx-1" />
                    
                    <button 
                        onClick={handleDelete}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-left text-[12px] font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors group"
                    >
                        <Trash2 size={14} />
                        <span>{t('planner.contextMenu.delete', 'Eliminar')}</span>
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default GlobalTaskContextMenu;
