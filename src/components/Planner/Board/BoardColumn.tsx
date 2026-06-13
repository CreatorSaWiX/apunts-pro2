import React, { useMemo, useState } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';
import type { Task, TaskPriority } from '../../../types/tasks';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Plus, Calendar, Flag, Play } from 'lucide-react';
import { DateTimePicker } from './DateTimePicker';

interface BoardColumnProps {
    column: { id: string; title: string };
    tasks: Task[];
    onAddTask: (taskData?: Partial<Task>) => void;
}

const toLocalDatetime = (d: Date) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const BoardColumn: React.FC<BoardColumnProps> = ({ column, tasks, onAddTask }) => {
    const taskIds = useMemo(() => tasks.map(t => t.id), [tasks]);
    const [isDrafting, setIsDrafting] = useState(false);
    const [draftTitle, setDraftTitle] = useState('');
    const [draftPriority, setDraftPriority] = useState<TaskPriority>('LOW');
    const [draftDueDate, setDraftDueDate] = useState<string>('');
    const [draftStartDate, setDraftStartDate] = useState<string>('');

    const { setNodeRef, isOver } = useDroppable({
        id: column.id,
        data: {
            type: 'Column',
            column
        }
    });

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const backgroundStyle = useMotionTemplate`
        radial-gradient(
          600px circle at ${mouseX}px ${mouseY}px,
          rgba(var(--primary-rgb), 0.08),
          transparent 80%
        )
    `;

    function handleMouseMove(e: React.MouseEvent) {
        const { left, top } = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - left);
        mouseY.set(e.clientY - top);
    }

    const getColumnAccent = (id: string) => {
        switch (id) {
            case 'TODO': return 'bg-slate-400 text-slate-300';
            case 'IN_PROGRESS': return 'bg-primary text-primary';
            case 'COMPLETE': return 'bg-emerald-400 text-emerald-400';
            default: return 'bg-slate-400 text-slate-300';
        }
    };

    const startDrafting = () => {
        setDraftStartDate(toLocalDatetime(new Date()));
        setIsDrafting(true);
    };

    const handleDoubleClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            startDrafting();
        }
    };

    const submitDraft = () => {
        if (draftTitle.trim()) {
            onAddTask({
                title: draftTitle.trim(),
                priority: draftPriority,
                dueDate: draftDueDate ? new Date(draftDueDate).toISOString() : null,
                startDate: draftStartDate ? new Date(draftStartDate).toISOString() : null
            });
        }
        setDraftTitle('');
        setDraftPriority('LOW');
        setDraftDueDate('');
        setDraftStartDate('');
        setIsDrafting(false);
    };

    const cyclePriority = (e: React.MouseEvent) => {
        e.preventDefault();
        const priorities: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH'];
        const next = priorities[(priorities.indexOf(draftPriority) + 1) % priorities.length];
        setDraftPriority(next);
    };

    return (
        <div
            ref={setNodeRef}
            className={`relative overflow-hidden flex flex-col flex-shrink-0 w-[350px] h-full max-h-full transition-all duration-500 ease-out group/col ${isOver ? 'bg-slate-800/60 border-primary/50 shadow-[0_0_40px_rgba(var(--primary-rgb),0.3)]' : 'bg-slate-900/50 hover:bg-slate-900/70 border-white/[0.08]'} border rounded-[32px] backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_10px_40px_rgba(0,0,0,0.4)]`}
            onDoubleClick={handleDoubleClick}
            onMouseMove={handleMouseMove}
        >
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-[32px] opacity-0 transition duration-300 group-hover/col:opacity-100 z-0"
                style={{ background: backgroundStyle }}
            />
            {/* Consistent Header */}
            <div className="flex items-center justify-between px-6 py-5 pointer-events-none sticky top-0 z-10 rounded-t-[32px] border-b border-transparent transition-colors relative">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-transparent opacity-0 group-hover/col:opacity-100 transition-opacity duration-500" />
                <div className="flex items-center gap-3 relative z-10">
                    <div className={`w-2.5 h-2.5 rounded-full ${getColumnAccent(column.id)} shadow-[0_0_12px_currentColor,inset_0_2px_4px_rgba(255,255,255,0.5)] ring-4 ring-black/20`}></div>
                    <h3 className="font-extrabold text-[13px] tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 uppercase drop-shadow-[0_2px_10px_rgba(255,255,255,0.1)]">{column.title}</h3>
                    <span className="text-[11px] font-bold text-slate-300 bg-white/10 px-2 py-0.5 rounded-full ml-1 shadow-inner border border-white/5">{tasks.length}</span>
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); startDrafting(); }}
                    className="text-slate-500 hover:text-white transition-all duration-300 pointer-events-auto p-1.5 opacity-0 group-hover/col:opacity-100 hover:scale-110"
                >
                    <Plus size={18} strokeWidth={2.5} />
                </button>
            </div>

            {/* Contingut de la columna */}
            <div
                className="flex-1 overflow-y-auto overflow-x-visible flex flex-col gap-4 min-h-[150px] px-5 pb-8 pt-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                onDoubleClick={handleDoubleClick}
            >
                <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                    {tasks.length === 0 && !isDrafting ? (
                        <div
                            onDoubleClick={(e) => { e.stopPropagation(); startDrafting(); }}
                            className="flex flex-col items-center justify-center h-28 text-center cursor-pointer group rounded-2xl mx-1 hover:bg-white/[0.02] transition-colors border border-dashed border-white/[0.05] hover:border-white/[0.1]"
                        >
                            <p className="text-xs font-semibold tracking-wide text-slate-500 group-hover:text-slate-400 transition-colors pointer-events-none">Fes doble clic per afegir</p>
                        </div>
                    ) : (
                        tasks.map(task => (
                            <TaskCard key={task.id} task={task} />
                        ))
                    )}
                </SortableContext>

                {isDrafting && (
                    <div className="bg-slate-800/90 backdrop-blur-xl border border-primary/50 rounded-2xl p-4 shadow-xl flex flex-col gap-3 relative z-20 mx-4">
                        <div className="flex gap-2">
                            <input
                                autoFocus
                                value={draftTitle}
                                onChange={(e) => setDraftTitle(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') submitDraft();
                                    if (e.key === 'Escape') {
                                        setDraftTitle('');
                                        setIsDrafting(false);
                                    }
                                }}
                                placeholder="Nom de la tasca..."
                                className="bg-transparent text-sm font-medium text-white p-1 focus:outline-none flex-1 placeholder:text-slate-500"
                            />
                            <button
                                onClick={submitDraft}
                                className="bg-primary/20 hover:bg-primary text-xs font-bold tracking-wide uppercase px-3 py-1.5 rounded-xl text-primary hover:text-white transition-colors flex items-center gap-1"
                            >
                                Guardar
                            </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs">
                            <button
                                onClick={cyclePriority}
                                className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors border ${draftPriority === 'HIGH' ? 'text-red-400 bg-red-500/10 border-red-500/20' :
                                    draftPriority === 'MEDIUM' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                                        'text-slate-400 bg-slate-500/10 border-slate-500/20'
                                    }`}
                            >
                                <Flag size={12} className={draftPriority === 'HIGH' ? 'fill-current' : ''} />
                                <span className="hidden sm:inline font-medium">Priority</span>
                            </button>

                            <DateTimePicker
                                value={draftStartDate}
                                onChange={setDraftStartDate}
                                placeholder="Data inici"
                                icon={<Play size={12} className="text-emerald-400" />}
                            />

                            <DateTimePicker
                                value={draftDueDate}
                                onChange={setDraftDueDate}
                                placeholder="Data límit"
                                icon={<Calendar size={12} className="text-indigo-400" />}
                            />
                        </div>
                    </div>
                )}

                {/* Àrea invisible per agafar el doble clic a baix */}
                {tasks.length > 0 && !isDrafting && (
                    <div
                        onDoubleClick={(e) => { e.stopPropagation(); startDrafting(); }}
                        className="flex-1 min-h-[60px] cursor-pointer rounded-[32px] opacity-0 hover:opacity-100 hover:bg-white/[0.03] flex items-center justify-center transition-all mt-2 border border-transparent hover:border-white/5"
                        title="Doble clic per afegir tasca"
                    >
                        <Plus size={20} className="text-slate-500" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default BoardColumn;
