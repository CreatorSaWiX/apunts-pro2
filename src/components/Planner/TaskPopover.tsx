import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasks } from '../../contexts/TasksContext';
import { Flag, Bookmark, Clock } from 'lucide-react';
import type { Task, TaskPriority } from '../../types/tasks';

export interface TaskPopoverEventDetail {
    x: number;
    y: number;
    taskId: string;
}

const TaskPopover: React.FC = () => {
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

        const handleClose = () => setIsOpen(false);

        const handlePointerDownOutside = (e: PointerEvent) => {
            if (isOpen && popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
                if (e.button === 0) {
                    e.stopPropagation();
                }
                handleClose();
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) handleClose();
        };

        window.addEventListener('open-task-popover', handleOpen);
        window.addEventListener('pointerdown', handlePointerDownOutside, true);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('scroll', handleClose, true);

        return () => {
            window.removeEventListener('open-task-popover', handleOpen);
            window.removeEventListener('pointerdown', handlePointerDownOutside, true);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('scroll', handleClose, true);
        };
    }, [isOpen]);

    if (!isOpen || !task) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    ref={popoverRef}
                    initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)', y: -10 }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, filter: 'blur(5px)', y: -5 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30, mass: 0.8 }}
                    className="fixed z-[1001] bg-[#13131A]/90 backdrop-blur-[40px] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] rounded-[16px] w-[240px] flex flex-col origin-top-left"
                    style={{ left: position.x, top: position.y }}
                >
                    {/* Títol Ràpid */}
                    <div className="p-3 border-b border-white/[0.05]">
                        <input 
                            value={task.title}
                            onChange={(e) => updateTask(task.id, { title: e.target.value })}
                            placeholder="Títol..."
                            className="text-[13px] font-bold bg-transparent border-none outline-none text-white w-full placeholder:text-white/30"
                            autoFocus
                        />
                    </div>

                    <div className="p-2 flex flex-col gap-1">
                        {/* Assignatura */}
                        <div className="px-2 pt-1 pb-1 flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase text-slate-500">
                            <Bookmark size={10} />
                            <span>Assignatura</span>
                        </div>
                        <div className="flex flex-wrap gap-1 px-1 mb-2">
                            <button
                                onClick={() => updateTask(task.id, { subjectId: undefined })}
                                className={`px-2 py-1 rounded text-[10px] font-medium transition-colors border ${
                                    !task.subjectId 
                                        ? 'bg-white/10 text-white border-white/20' 
                                        : 'bg-transparent text-slate-500 border-white/[0.05] hover:bg-white/5 hover:text-slate-300'
                                }`}
                            >
                                Cap
                            </button>
                            {subjects.map(subject => {
                                const isSelected = task.subjectId === subject.id;
                                return (
                                    <button
                                        key={subject.id}
                                        onClick={() => updateTask(task.id, { subjectId: subject.id })}
                                        className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-medium transition-all border ${
                                            isSelected
                                                ? `bg-white/10 text-white border-white/20 shadow-sm`
                                                : 'bg-transparent text-slate-400 border-white/[0.05] hover:bg-white/[0.08] hover:text-slate-200'
                                        }`}
                                    >
                                        <div 
                                            className={`w-1.5 h-1.5 rounded-full bg-${subject.colorToken} ${isSelected ? 'shadow-[0_0_4px_currentColor]' : ''}`} 
                                        />
                                        <span>{subject.name}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Prioritat */}
                        <div className="px-2 pt-1 pb-1 flex items-center gap-2 text-[9px] font-bold tracking-widest uppercase text-slate-500">
                            <Flag size={10} />
                            <span>Prioritat</span>
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
                                    <button
                                        key={p}
                                        onClick={() => updateTask(task.id, { priority: p })}
                                        className={`flex-1 py-1.5 rounded text-[9px] font-bold tracking-wider transition-all ${
                                            isSelected ? colors[p] : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                                        }`}
                                    >
                                        {p === 'LOW' ? 'BAIX' : p === 'MEDIUM' ? 'MIG' : 'ALT'}
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
