import React, { useState, useMemo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task, TaskPriority } from '../../../types/tasks';
import { useTasks } from '../../../contexts/TasksContext';
import { m as motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Calendar, Flag, Play, X, Check, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { DateTimePicker } from './DateTimePicker';
import { useTranslation } from 'react-i18next';

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
interface TaskCardProps {
    task: Task;
    isOverlay?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, isOverlay }) => {
    const { t } = useTranslation();
    const { updateTask, subjects, deleteTask } = useTasks();
    const subject = task.subjectId ? subjects?.find(s => s.id === task.subjectId) : null;

    const getSubjectClasses = (token: string) => {
        return `text-${token} bg-${token}/10 border-${token}/20`;
    };

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const backgroundStyle = useMotionTemplate`
        radial-gradient(
          400px circle at ${mouseX}px ${mouseY}px,
          rgba(255, 255, 255, 0.06),
          transparent 80%
        )
    `;

    const rafRef = React.useRef<number | null>(null);

    function handleMouseMove(e: React.MouseEvent) {
        if (rafRef.current) return;
        
        const clientX = e.clientX;
        const clientY = e.clientY;
        const currentTarget = e.currentTarget as HTMLElement;

        rafRef.current = requestAnimationFrame(() => {
            const { left, top } = currentTarget.getBoundingClientRect();
            mouseX.set(clientX - left);
            mouseY.set(clientY - top);
            rafRef.current = null;
        });
    }

    React.useEffect(() => {
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editPriority, setEditPriority] = useState<TaskPriority>(task.priority);
    const [editDueDate, setEditDueDate] = useState<string>(toLocalDatetime(task.dueDate));
    const [editStartDate, setEditStartDate] = useState<string>(toLocalDatetime(task.startDate));
    const [editSubjectId, setEditSubjectId] = useState<string | null>(task.subjectId || null);

    const [showSubjectPicker, setShowSubjectPicker] = useState(false);
    const [subjectSearchQuery, setSubjectSearchQuery] = useState('');

    const filteredSubjects = useMemo(() => {
        if (!subjects) return [];
        return [...subjects]
            .sort((a, b) => a.name.localeCompare(b.name))
            .filter(s => s.name.toLowerCase().includes(subjectSearchQuery.toLowerCase()));
    }, [subjects, subjectSearchQuery]);

    const toggleSubjectPicker = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowSubjectPicker(!showSubjectPicker);
        setSubjectSearchQuery('');
    };

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
        transform: isOverlay
            ? 'rotate(3deg) scale(1.05)'
            : isDragging
                ? `${CSS.Transform.toString(transform)} rotate(2deg) scale(1.02)`
                : CSS.Transform.toString(transform),
        zIndex: isDragging || isOverlay ? 10000 : (isEditing || showSubjectPicker ? 50 : 'auto'),
    };

    const handleSave = () => {
        setIsEditing(false);
        const updates: Partial<Task> = {
            title: editTitle.trim() || 'Nova Tasca',
            priority: editPriority,
            dueDate: editDueDate ? new Date(editDueDate).toISOString() : null,
            startDate: editStartDate ? new Date(editStartDate).toISOString() : null,
            subjectId: editSubjectId || undefined
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
            case 'HIGH': return 'text-[#FF453A] bg-[#FF453A]/10 border-[#FF453A]/20 hover:bg-[#FF453A]/20';
            case 'MEDIUM': return 'text-[#FF9F0A] bg-[#FF9F0A]/10 border-[#FF9F0A]/20 hover:bg-[#FF9F0A]/20';
            case 'LOW': return 'text-slate-400 bg-white/5 border-white/5 hover:bg-white/10';
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

        let color = 'bg-[#5E5CE6] shadow-[0_0_10px_rgba(94,92,230,0.8)]';
        if (percentage > 50) color = 'bg-[#FF9F0A] shadow-[0_0_10px_rgba(255,159,10,0.8)]';
        if (percentage > 80) color = 'bg-[#FF453A] shadow-[0_0_10px_rgba(255,69,58,0.8)]';

        const timeLeft = end - now;
        let timeText = '';
        if (timeLeft < 0) {
            timeText = t('common.expired', 'Caducat');
            color = 'bg-[#FF453A] shadow-[0_0_12px_rgba(255,69,58,1)]';
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

            timeText = `${t('common.remaining', 'Queden')} ${parts.join(' ')}`;
        }

        const deadlineText = format(new Date(task.dueDate), "d MMM yyyy, HH:mm");

        return (
            <div className="w-full pointer-events-none flex flex-col gap-1.5 mt-1 group/progress">
                <div className="flex justify-between items-center opacity-60 group-hover/progress:opacity-100 transition-opacity">
                    <span className="text-[9px] font-semibold text-slate-400 tracking-widest uppercase">
                        {timeText}
                    </span>
                    <span className="text-[9px] font-semibold text-slate-500 tracking-widest">
                        {deadlineText}
                    </span>
                </div>
                <div className="relative h-[2px] w-full bg-white/[0.04] rounded-full">
                    <div
                        className={`absolute top-0 left-0 h-full rounded-full ${color} transition-all duration-1000 ease-out`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
        );
    };

    if (isDragging && !isOverlay) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="bg-white/[0.02] border-2 border-dashed border-white/10 rounded-[24px] h-[100px] shadow-inner cursor-grabbing"
            />
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`mx-1 relative outline-none ${isOverlay ? 'cursor-grabbing shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-white/[0.15]' : 'cursor-grab active:cursor-grabbing'}`}
        >
            <div
                onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.dispatchEvent(new CustomEvent('open-task-context-menu', { detail: { x: e.clientX, y: e.clientY, task } }));
                }}
                onDoubleClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                }}
                onMouseMove={handleMouseMove}
                className={`group bg-[#111115]/80 border border-white/[0.04] rounded-[16px] p-3.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_4px_16px_rgba(0,0,0,0.5)] hover:border-white/[0.1] hover:bg-[#111115]/90 hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-[20px] transition-all duration-300 flex flex-col gap-2 relative transform-gpu ${isDragging ? 'shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-white/[0.15] opacity-100 scale-105 rotate-2' : ''}`}
            >
                <motion.div
                    className="pointer-events-none absolute -inset-px rounded-[16px] opacity-0 transition duration-300 group-hover:opacity-100 z-0"
                    style={{ background: backgroundStyle }}
                />

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
                                        setEditSubjectId(task.subjectId || null);
                                        setIsEditing(false);
                                    }
                                    e.stopPropagation();
                                }}
                                className="bg-transparent text-sm font-medium text-white p-1 focus:outline-none flex-1 border-b border-indigo-500/50"
                            />
                            <button type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setEditTitle(task.title);
                                    setEditPriority(task.priority);
                                    setEditDueDate(toLocalDatetime(task.dueDate));
                                    setEditStartDate(toLocalDatetime(task.startDate));
                                    setEditSubjectId(task.subjectId || null);
                                    setIsEditing(false);
                                }}
                                className="flex items-center justify-center p-1.5 rounded-md text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
                                title={t('common.cancel', 'Cancel·lar')}
                            >
                                <X size={16} strokeWidth={2.5} />
                            </button>
                            <button type="button"
                                onClick={(e) => { e.stopPropagation(); handleSave(); }}
                                className="flex items-center justify-center p-1.5 rounded-md text-emerald-400 hover:text-white hover:bg-emerald-500 transition-colors"
                                title={t('common.save', 'Guardar')}
                            >
                                <Check size={16} strokeWidth={2.5} />
                            </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs">
                            <button type="button"
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
                                title={t('planner.boardView.priority', 'Priority')}
                            >
                                <Flag size={12} className={editPriority === 'HIGH' ? 'fill-current' : ''} />
                                <span className="hidden sm:inline font-medium">{t('planner.boardView.priority', 'Priority')}</span>
                            </button>

                            <div className="relative">
                                {subjects && subjects.length > 0 && (
                                    <button type="button"
                                        onClick={toggleSubjectPicker}
                                        className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors border ${editSubjectId
                                            ? (() => {
                                                const s = subjects.find(sub => sub.id === editSubjectId);
                                                return s ? `text-${s.colorToken.replace('500', '400')} bg-${s.colorToken}/10 border-${s.colorToken}/20` : 'text-slate-400 bg-slate-500/10 border-slate-500/20';
                                            })()
                                            : 'text-slate-400 bg-slate-500/10 border-slate-500/20'
                                            }`}
                                    >
                                        <span className="font-semibold text-[10px] tracking-wider uppercase">
                                            {editSubjectId ? subjects.find(sub => sub.id === editSubjectId)?.name : 'Assignatura'}
                                        </span>
                                    </button>
                                )}

                                {showSubjectPicker && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setShowSubjectPicker(false); }} />
                                        <div className="absolute top-full left-0 mt-2 w-48 bg-[#13131A]/70 backdrop-blur-[40px] border border-white/[0.08] p-2 rounded-[20px] flex flex-col gap-2 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] z-50 cursor-default">
                                            <input
                                                autoFocus
                                                value={subjectSearchQuery}
                                                onChange={(e) => setSubjectSearchQuery(e.target.value)}
                                                placeholder="Cerca..."
                                                className="bg-white/5 border border-white/10 text-slate-200 text-[12px] font-medium px-3 py-2 rounded-xl focus:outline-none focus:border-white/20 w-full placeholder:text-slate-500 transition-colors"
                                                onClick={(e) => e.stopPropagation()}
                                                onKeyDown={(e) => e.stopPropagation()}
                                            />
                                            <div className="flex flex-col gap-1 max-h-32 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                                                <button type="button"
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditSubjectId(null); setShowSubjectPicker(false); }}
                                                    className={`text-left px-3 py-2 rounded-xl text-[12px] font-semibold tracking-wide transition-colors ${!editSubjectId ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-300'}`}
                                                >
                                                    Sense assignatura
                                                </button>
                                                {filteredSubjects.map(s => (
                                                    <button type="button"
                                                        key={s.id}
                                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditSubjectId(s.id); setShowSubjectPicker(false); }}
                                                        className={`text-left px-3 py-2 rounded-xl text-[12px] font-semibold tracking-wide transition-colors flex items-center gap-2 ${editSubjectId === s.id ? `bg-${s.colorToken}/20 text-${s.colorToken.replace('500', '400')}` : 'text-slate-400 hover:bg-white/5 hover:text-slate-300'}`}
                                                    >
                                                        <span className={`w-2 h-2 rounded-full bg-${s.colorToken}`}></span>
                                                        {s.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

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
                            <h4 className="text-[13px] font-semibold text-white/90 flex-1 leading-snug tracking-wide">
                                {task.title}
                            </h4>
                            <button type="button"
                                onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-red-400 p-1 pointer-events-auto"
                                title="Eliminar tasca"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>

                        {renderProgressBar()}

                        <div className="flex items-center gap-1.5 mt-1 pointer-events-auto relative z-10" onPointerDown={(e) => e.stopPropagation()}>
                            {/* Priority Toggle Pill */}
                            <button type="button"
                                onClick={togglePriority}
                                className={`flex items-center justify-center w-5 h-5 rounded-md border transition-colors ${getPriorityStyle(task.priority)}`}
                                title={`Priority: ${task.priority}`}
                            >
                                <Flag size={10} className={task.priority === 'HIGH' ? 'fill-current' : ''} />
                            </button>

                            {/* Date Display Pill */}
                            <button type="button" className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-semibold tracking-widest uppercase border transition-colors ${task.dueDate ? 'bg-white/[0.03] text-slate-300 border-white/[0.05] hover:bg-white/[0.08]' : 'bg-transparent text-slate-500 border-transparent hover:bg-white/5'}`}>
                                <Calendar size={10} />
                                {task.dueDate ? format(new Date(task.dueDate), 'MMM d') : 'No date'}
                            </button>

                            <div className="ml-auto flex items-center gap-1.5">
                                {subject && (
                                    <span className={`text-[9px] tracking-[0.1em] font-bold uppercase border px-2 py-0.5 rounded-md ${getSubjectClasses(subject.colorToken)}`}>
                                        {subject.name}
                                    </span>
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
