import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task, TaskPriority } from '../../../types/tasks';
import { useTasks } from '../../../contexts/TasksContext';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Calendar, Flag, Trash2, Copy, Play } from 'lucide-react';
import { format } from 'date-fns';
import { useAltKey } from '../../../hooks/useAltKey';
import { DateTimePicker } from './DateTimePicker';

interface TaskCardProps {
    task: Task;
}

const toLocalDatetime = (isoString?: string | null) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
    const { updateTask, deleteTask } = useTasks();

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const backgroundStyle = useMotionTemplate`
        radial-gradient(
          400px circle at ${mouseX}px ${mouseY}px,
          rgba(255, 255, 255, 0.06),
          transparent 80%
        )
    `;

    function handleMouseMove(e: React.MouseEvent) {
        const { left, top } = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - left);
        mouseY.set(e.clientY - top);
    }

    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editPriority, setEditPriority] = useState<TaskPriority>(task.priority);
    const [editDueDate, setEditDueDate] = useState<string>(toLocalDatetime(task.dueDate));
    const [editStartDate, setEditStartDate] = useState<string>(toLocalDatetime(task.startDate));

    const isAltPressed = useAltKey();

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: 'Task',
            task
        }
    });

    const style = {
        transition: transition || 'transform 250ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        transform: isDragging && transform
            ? `${CSS.Translate.toString(transform)} rotate(4deg) scale(1.05)`
            : CSS.Transform.toString(transform),
        zIndex: isDragging ? 100 : 'auto',
    };

    const handleSave = () => {
        setIsEditing(false);
        const updates: Partial<Task> = {
            title: editTitle.trim() || 'Nova Tasca',
            priority: editPriority,
            dueDate: editDueDate ? new Date(editDueDate).toISOString() : null,
            startDate: editStartDate ? new Date(editStartDate).toISOString() : null
        };

        if (updates.startDate && updates.dueDate) {
            const start = new Date(updates.startDate).getTime();
            const end = new Date(updates.dueDate).getTime();
            if (end > start) {
                updates.estimatedMinutes = Math.round((end - start) / 60000);
            }
        }

        updateTask(task.id, updates);
    };

    const togglePriority = (e: React.MouseEvent) => {
        e.stopPropagation();
        const priorities: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH'];
        const currentIndex = priorities.indexOf(task.priority);
        const nextPriority = priorities[(currentIndex + 1) % priorities.length];
        updateTask(task.id, { priority: nextPriority });
    };

    const getPriorityStyle = (priority: TaskPriority) => {
        switch (priority) {
            case 'HIGH': return 'text-red-400 bg-red-500/10 border-red-500/20 hover:bg-red-500/20';
            case 'MEDIUM': return 'text-amber-400 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20';
            case 'LOW': return 'text-slate-400 bg-slate-500/10 border-slate-500/20 hover:bg-slate-500/20';
        }
    };

    const renderProgressBar = () => {
        if (!task.dueDate) return null;

        const now = new Date().getTime();
        const end = new Date(task.dueDate).getTime();
        const start = task.startDate ? new Date(task.startDate).getTime() : new Date(task.createdAt).getTime();

        const total = end - start;
        const elapsed = now - start;

        let percentage = 0;
        if (total > 0) {
            percentage = Math.max(0, Math.min(100, (elapsed / total) * 100));
        } else {
            percentage = 100;
        }

        let color = 'bg-indigo-400';
        if (percentage > 50) color = 'bg-yellow-400';
        if (percentage > 80) color = 'bg-orange-500';
        if (percentage > 95) color = 'bg-red-500';

        const timeLeft = end - now;
        let timeText = '';
        if (timeLeft < 0) {
            timeText = 'Caducat';
            color = 'bg-red-600';
            percentage = 100;
        } else {
            const totalMins = Math.floor(timeLeft / (1000 * 60));
            const d = Math.floor(totalMins / (24 * 60));
            const h = Math.floor((totalMins % (24 * 60)) / 60);
            const m = totalMins % 60;

            const parts = [];
            if (d > 0) parts.push(`${d}d`);
            if (h > 0) parts.push(`${h}h`);
            if (m > 0 || parts.length === 0) parts.push(`${m}min`);

            timeText = `Queden ${parts.join(' ')}`;
        }

        const deadlineText = format(new Date(task.dueDate), "d MMM yyyy, HH:mm");

        return (
            <div className="w-full pointer-events-none flex flex-col gap-1.5 group/progress">
                <div className="flex justify-between items-center opacity-70 group-hover/progress:opacity-100 transition-opacity">
                    <span className="text-[10px] font-medium text-slate-400 tracking-wider uppercase">
                        {timeText}
                    </span>
                    <span className="text-[10px] font-bold text-slate-300 tracking-wider">
                        {deadlineText}
                    </span>
                </div>
                <div className="h-[1.5px] w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${color} transition-all duration-1000 ease-out`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
        );
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className={`bg-white/[0.02] border-2 border-dashed border-white/10 rounded-[24px] h-[100px] shadow-inner ${isAltPressed ? 'cursor-copy' : 'cursor-grabbing'}`}
            />
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`mx-1 relative outline-none z-10 ${isAltPressed ? 'cursor-copy' : 'cursor-grab active:cursor-grabbing'} ${isDragging ? 'z-50' : ''}`}
        >
            <div 
                onDoubleClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                }}
                onMouseMove={handleMouseMove}
                className={`group bg-slate-900/60 border-[0.5px] border-white/10 hover:border-primary/30 rounded-[24px] p-4 shadow-md hover:shadow-[0_8px_30px_rgba(var(--primary-rgb),0.2)] backdrop-blur-[40px] transition-all duration-300 flex flex-col gap-2.5 relative hover:-translate-y-1 overflow-hidden transform-gpu ${isDragging ? 'shadow-[0_30px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(var(--primary-rgb),0.3)] border-primary/50 opacity-100 scale-[1.02]' : ''}`}
            >
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-[20px] opacity-0 transition duration-300 group-hover:opacity-100 z-0"
                style={{ background: backgroundStyle }}
            />

            {isAltPressed && (
                <div className="absolute -top-3 -right-3 bg-primary text-white p-2 rounded-full shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] z-10 pointer-events-none ring-4 ring-slate-900">
                    <Copy size={14} />
                </div>
            )}

            {isEditing ? (
                <div className="flex flex-col gap-3 w-full" onPointerDown={(e) => e.stopPropagation()} onDoubleClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-2 w-full">
                        <input
                            autoFocus
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSave();
                                if (e.key === 'Escape') {
                                    setEditTitle(task.title);
                                    setEditPriority(task.priority);
                                    setEditDueDate(toLocalDatetime(task.dueDate));
                                    setEditStartDate(toLocalDatetime(task.startDate));
                                    setIsEditing(false);
                                }
                                e.stopPropagation();
                            }}
                            className="bg-transparent text-sm font-medium text-white p-1 focus:outline-none flex-1 border-b border-indigo-500/50"
                        />
                        <button
                            onClick={(e) => { e.stopPropagation(); handleSave(); }}
                            className="bg-white/10 hover:bg-indigo-500 text-[11px] font-bold tracking-wide uppercase px-2 py-1 rounded text-slate-300 hover:text-white transition-colors"
                        >
                            Save ⏎
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const priorities: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH'];
                                setEditPriority(priorities[(priorities.indexOf(editPriority) + 1) % priorities.length]);
                            }}
                            className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors border ${editPriority === 'HIGH' ? 'text-red-400 bg-red-500/10 border-red-500/20' :
                                editPriority === 'MEDIUM' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                                    'text-slate-400 bg-slate-500/10 border-slate-500/20'
                                }`}
                        >
                            <Flag size={12} className={editPriority === 'HIGH' ? 'fill-current' : ''} />
                            <span className="hidden sm:inline font-medium">Priority</span>
                        </button>

                        <DateTimePicker
                            value={editStartDate}
                            onChange={setEditStartDate}
                            placeholder="Data inici"
                            icon={<Play size={12} className="text-emerald-400" />}
                        />

                        <DateTimePicker
                            value={editDueDate}
                            onChange={setEditDueDate}
                            placeholder="Data límit"
                            icon={<Calendar size={12} className="text-indigo-400" />}
                        />
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-start gap-2 pointer-events-none relative z-10">
                        <h4 className="text-[14px] font-bold text-white flex-1 leading-snug tracking-tight drop-shadow-sm">
                            {task.title}
                        </h4>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteTask(task.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors p-2 rounded-xl -mr-1 -mt-1 z-10 pointer-events-auto"
                            title="Delete task"
                            onPointerDown={(e) => e.stopPropagation()}
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>

                    {renderProgressBar()}

                    <div className="flex items-center gap-1.5 mt-1 pointer-events-auto relative z-10" onPointerDown={(e) => e.stopPropagation()}>
                        {/* Priority Toggle Pill */}
                        <button
                            onClick={togglePriority}
                            className={`flex items-center justify-center w-6 h-6 rounded-full border transition-colors ${getPriorityStyle(task.priority)}`}
                            title={`Priority: ${task.priority}`}
                        >
                            <Flag size={10} className={task.priority === 'HIGH' ? 'fill-current' : ''} />
                        </button>

                        {/* Date Display Pill */}
                        <button className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase border transition-colors ${task.dueDate ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20 hover:bg-indigo-500/20' : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-slate-300'}`}>
                            <Calendar size={9} />
                            {task.dueDate ? format(new Date(task.dueDate), 'MMM d') : 'No date'}
                        </button>

                        <div className="ml-auto flex items-center gap-1 text-slate-500">
                            {task.source === 'AI' && (
                                <span className="text-[9px] tracking-[0.2em] uppercase font-black text-fuchsia-400 bg-fuchsia-500/10 border border-fuchsia-500/20 px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(217,70,239,0.1)]">AI Spark</span>
                            )}
                        </div>
                    </div>
                </>
            )}
            </div>
        </div>
    );
};

export default TaskCard;
