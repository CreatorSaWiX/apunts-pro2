import React, { useEffect, useState, useRef } from 'react';
import { useTasks } from '../../contexts/TasksContext';
import { Copy, Trash2, Flag } from 'lucide-react';
import type { Task, TaskPriority } from '../../types/tasks';

export interface ContextMenuEventDetail {
    x: number;
    y: number;
    task: Task;
}

const GlobalTaskContextMenu: React.FC = () => {
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
                    title: `${task.title} (Còpia)`,
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

        window.addEventListener('open-task-context-menu', handleOpenMenu);
        window.addEventListener('pointerdown', handlePointerDownOutside, true);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('scroll', handleCloseMenu, true); // Close on any scroll

        return () => {
            window.removeEventListener('open-task-context-menu', handleOpenMenu);
            window.removeEventListener('pointerdown', handlePointerDownOutside, true);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('scroll', handleCloseMenu, true);
        };
    }, [deleteTask, addTask, isOpen, task]);

    if (!isOpen || !task) return null;

    const handleDuplicate = (e: React.MouseEvent) => {
        e.stopPropagation();
        addTask({
            title: `${task.title} (Còpia)`,
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
        const priorities: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH'];
        const next = priorities[(priorities.indexOf(task.priority) + 1) % priorities.length];
        updateTask(task.id, { priority: next });
        setIsOpen(false);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        deleteTask(task.id);
        setIsOpen(false);
    };

    return (
        <div 
            ref={menuRef}
            className="fixed z-[9999] bg-slate-900/95 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-xl py-1.5 min-w-[180px] flex flex-col gap-0.5"
            style={{ 
                left: position.x, 
                top: position.y,
                boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
            }}
            onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
        >
            <div className="px-3 py-2 border-b border-white/5 mb-1 pointer-events-none select-none">
                <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 truncate">{task.title}</p>
            </div>

            <button 
                onClick={handleCyclePriority}
                className="flex items-center gap-3 px-3 py-2 w-full text-left text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
            >
                <Flag size={14} className={task.priority === 'HIGH' ? 'text-red-400' : task.priority === 'MEDIUM' ? 'text-amber-400' : 'text-slate-400'} />
                <span>Canviar Prioritat</span>
            </button>
            
            <button 
                onClick={handleDuplicate}
                className="flex items-center justify-between px-3 py-2 w-full text-left text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors group"
            >
                <div className="flex items-center gap-3">
                    <Copy size={14} className="text-slate-400 group-hover:text-white transition-colors" />
                    <span>Duplicar</span>
                </div>
                <span className="text-[9px] text-slate-500 font-mono bg-white/5 px-1.5 py-0.5 rounded">Alt/Opt</span>
            </button>
            
            <div className="h-px bg-white/5 my-1" />
            
            <button 
                onClick={handleDelete}
                className="flex items-center justify-between px-3 py-2 w-full text-left text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors group"
            >
                <div className="flex items-center gap-3">
                    <Trash2 size={14} />
                    <span>Eliminar</span>
                </div>
                <span className="text-[9px] text-red-400/60 font-mono bg-red-500/10 px-1.5 py-0.5 rounded group-hover:text-red-300">⌫ / Supr</span>
            </button>
        </div>
    );
};

export default GlobalTaskContextMenu;
