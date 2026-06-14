import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Archive, X, Flag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Task, TaskPriority } from '../../types/tasks';

interface UnscheduledDrawerProps {
    tasks: Task[];
}

const DraggableMiniTask: React.FC<{ task: Task }> = ({ task }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: task.id,
        data: { type: 'Task', task }
    });

    const getPriorityColor = (priority: TaskPriority) => {
        if (priority === 'HIGH') return 'text-red-400 bg-red-500/10';
        if (priority === 'MEDIUM') return 'text-amber-400 bg-amber-500/10';
        return 'text-slate-400 bg-slate-500/10';
    };

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`bg-slate-800/80 backdrop-blur-xl border border-white/5 rounded-2xl p-3 flex flex-col gap-2 cursor-grab active:cursor-grabbing hover:bg-slate-700/80 transition-colors shadow-lg ${isDragging ? 'opacity-50' : ''}`}
        >
            <div className="flex items-center gap-2">
                <div className={`p-1 rounded-md border border-white/5 ${getPriorityColor(task.priority)}`}>
                    <Flag size={12} strokeWidth={3} className={task.priority === 'HIGH' ? 'fill-current' : ''} />
                </div>
                <span className="text-xs font-bold text-white truncate flex-1">{task.title}</span>
            </div>
            {task.description && (
                <p className="text-[10px] text-slate-400 line-clamp-1">{task.description}</p>
            )}
        </div>
    );
};

const UnscheduledDrawer: React.FC<UnscheduledDrawerProps> = ({ tasks }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (tasks.length === 0) return null;

    return (
        <>
            {/* Floating Button */}
            <div className="absolute bottom-6 left-6 z-50">
                <button
                    onClick={() => setIsOpen(true)}
                    className="group relative flex items-center gap-3 px-5 py-3 rounded-full bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all hover:scale-105 active:scale-95"
                >
                    <div className="relative">
                        <Archive size={20} className="text-slate-300 group-hover:text-white transition-colors" />
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-slate-900">
                            {tasks.length}
                        </div>
                    </div>
                    <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors hidden sm:block">
                        Backlog
                    </span>
                </button>
            </div>

            {/* Floating Drawer / Popover */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", bounce: 0.3 }}
                        className="absolute bottom-24 left-6 z-50 w-72 max-h-[60vh] flex flex-col bg-slate-900/90 backdrop-blur-3xl border border-white/10 rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden"
                    >
                        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/[0.02]">
                            <div className="flex items-center gap-2">
                                <Archive size={16} className="text-slate-400" />
                                <span className="font-extrabold text-xs tracking-widest text-slate-300 uppercase">Per planificar</span>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={16} strokeWidth={2.5} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {tasks.map(task => (
                                <DraggableMiniTask key={task.id} task={task} />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default UnscheduledDrawer;
