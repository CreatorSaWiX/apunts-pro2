import React, { useMemo, useState } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';
import type { Task, TaskPriority } from '../../../types/tasks';
import { useTasks } from '../../../contexts/TasksContext';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Plus, Calendar, Flag, Play } from 'lucide-react';
import { DateTimePicker } from './DateTimePicker';

interface BoardColumnProps {
    column: { id: string; title: string; color?: string };
    tasks: Task[];
    onAddTask: (taskData?: Partial<Task>) => void;
    onUpdateColumn?: (updates: Partial<{ title: string; color: string }>) => void;
}

const toLocalDatetime = (d: Date) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const BoardColumn: React.FC<BoardColumnProps> = ({ column, tasks, onAddTask, onUpdateColumn }) => {
    const { subjects, activeSubjectId } = useTasks();
    const taskIds = useMemo(() => tasks.map(t => t.id), [tasks]);
    const [isDrafting, setIsDrafting] = useState(false);
    const [draftTitle, setDraftTitle] = useState('');
    const [draftPriority, setDraftPriority] = useState<TaskPriority>('MEDIUM');
    const [draftSubjectId, setDraftSubjectId] = useState<string | null>(activeSubjectId);
    const [isEditingHeader, setIsEditingHeader] = useState(false);
    const [headerTitle, setHeaderTitle] = useState(column.title);
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

    const getColumnTheme = (col: {id: string, color?: string}) => {
        if (col.color) {
            switch (col.color) {
                case 'indigo-400': return { bg: 'bg-indigo-400', text: 'text-indigo-300', shadow: 'shadow-[0_0_15px_rgba(129,140,248,0.6)]', halo: 'from-indigo-400/20' };
                case 'fuchsia-400': return { bg: 'bg-fuchsia-400', text: 'text-fuchsia-300', shadow: 'shadow-[0_0_15px_rgba(232,121,249,0.6)]', halo: 'from-fuchsia-400/20' };
                case 'emerald-400': return { bg: 'bg-emerald-400', text: 'text-emerald-300', shadow: 'shadow-[0_0_15px_rgba(52,211,153,0.6)]', halo: 'from-emerald-400/20' };
                case 'amber-400': return { bg: 'bg-amber-400', text: 'text-amber-300', shadow: 'shadow-[0_0_15px_rgba(251,191,36,0.6)]', halo: 'from-amber-400/20' };
                case 'rose-400': return { bg: 'bg-rose-400', text: 'text-rose-300', shadow: 'shadow-[0_0_15px_rgba(251,113,133,0.6)]', halo: 'from-rose-400/20' };
                case 'cyan-400': return { bg: 'bg-cyan-400', text: 'text-cyan-300', shadow: 'shadow-[0_0_15px_rgba(34,211,238,0.6)]', halo: 'from-cyan-400/20' };
            }
        }
        
        switch (col.id) {
            case 'TODO': return { bg: 'bg-slate-400', text: 'text-slate-300', shadow: 'shadow-[0_0_15px_rgba(148,163,184,0.5)]', halo: 'from-slate-500/10' };
            case 'IN_PROGRESS': return { bg: 'bg-primary', text: 'text-primary', shadow: 'shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]', halo: 'from-primary/20' };
            case 'COMPLETE': return { bg: 'bg-emerald-400', text: 'text-emerald-400', shadow: 'shadow-[0_0_15px_rgba(52,211,153,0.5)]', halo: 'from-emerald-500/20' };
            default: return { bg: 'bg-slate-400', text: 'text-slate-300', shadow: 'shadow-[0_0_15px_rgba(148,163,184,0.5)]', halo: 'from-slate-500/10' };
        }
    };
    
    const theme = getColumnTheme(column);
    const COLUMN_COLORS = ['indigo-400', 'fuchsia-400', 'emerald-400', 'amber-400', 'rose-400', 'cyan-400'];
    const [showColorPicker, setShowColorPicker] = useState(false);

    const toggleColorPicker = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowColorPicker(!showColorPicker);
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
        onAddTask({
            title: draftTitle.trim() || 'Nova Tasca',
            priority: draftPriority,
            dueDate: draftDueDate || null,
            startDate: draftStartDate || null,
            estimatedMinutes: 60,
            status: column.id,
            subjectId: draftSubjectId || null
        });

        setIsDrafting(false);
    };

    const cyclePriority = (e: React.MouseEvent) => {
        e.preventDefault();
        const priorities: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH'];
        const next = priorities[(priorities.indexOf(draftPriority) + 1) % priorities.length];
        setDraftPriority(next);
    };

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
        setShowSubjectPicker(!showSubjectPicker);
        setSubjectSearchQuery('');
    };

    return (
        <div
            ref={setNodeRef}
            className={`relative flex flex-col flex-shrink-0 w-[350px] h-full max-h-full transition-all duration-300 ease-out group/col rounded-2xl ${isOver ? 'bg-white/[0.02] ring-1 ring-primary/30' : 'bg-transparent'}`}
            onDoubleClick={handleDoubleClick}
        >
            {/* Minimalist Header */}
            <div className="flex items-center justify-between px-3 py-4 sticky top-0 z-10 group/header">
                <div className="flex items-center gap-2.5 relative z-10 flex-1" onDoubleClick={() => setIsEditingHeader(true)}>
                    <div 
                        onClick={toggleColorPicker}
                        className={`w-2.5 h-2.5 rounded-full ${theme.bg} ${theme.text} shadow-[0_0_8px_currentColor] cursor-pointer hover:scale-150 hover:shadow-[0_0_12px_currentColor] transition-all`}
                        title="Fes clic per canviar el color"
                    ></div>
                    {showColorPicker && (
                        <div className="absolute top-8 left-0 bg-[#13131A] border border-white/[0.08] p-3 rounded-2xl flex gap-3 shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50">
                            {COLUMN_COLORS.map(c => {
                                const t = getColumnTheme({ id: column.id, color: c });
                                return (
                                    <button
                                        key={c}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onUpdateColumn?.({ color: c });
                                            setShowColorPicker(false);
                                        }}
                                        className={`w-4 h-4 rounded-full ${t.bg} shadow-[0_0_8px_currentColor] text-${c} hover:scale-125 transition-transform ${column.color === c ? 'ring-2 ring-current ring-offset-2 ring-offset-[#13131A]' : 'opacity-70 hover:opacity-100'}`}
                                    />
                                );
                            })}
                        </div>
                    )}
                    {isEditingHeader ? (
                        <input
                            autoFocus
                            value={headerTitle}
                            onChange={(e) => setHeaderTitle(e.target.value)}
                            onBlur={() => {
                                setIsEditingHeader(false);
                                if (headerTitle.trim() && headerTitle !== column.title) {
                                    onUpdateColumn?.({ title: headerTitle.trim() });
                                } else {
                                    setHeaderTitle(column.title);
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    setIsEditingHeader(false);
                                    if (headerTitle.trim() && headerTitle !== column.title) {
                                        onUpdateColumn?.({ title: headerTitle.trim() });
                                    }
                                }
                                if (e.key === 'Escape') {
                                    setIsEditingHeader(false);
                                    setHeaderTitle(column.title);
                                }
                            }}
                            className="font-semibold text-[13px] tracking-widest text-slate-200 uppercase bg-transparent border-b border-white/20 focus:outline-none focus:border-primary flex-1"
                        />
                    ) : (
                        <h3 className="font-semibold text-[13px] tracking-widest text-slate-200 uppercase cursor-pointer" onClick={(e) => { if (e.detail === 2) setIsEditingHeader(true); }}>{column.title}</h3>
                    )}
                    <span className="text-[11px] font-medium text-slate-500 bg-white/[0.03] px-2 py-0.5 rounded-md ml-1">{tasks.length}</span>
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); startDrafting(); }}
                    className="text-slate-500 hover:text-white transition-all duration-200 pointer-events-auto p-1 opacity-0 group-hover/col:opacity-100"
                >
                    <Plus size={16} strokeWidth={2.5} />
                </button>
            </div>

            <div
                className="flex-1 overflow-y-auto overflow-x-visible flex flex-col gap-3 min-h-[150px] px-3 pb-8 pt-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                onDoubleClick={handleDoubleClick}
            >
                <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                    {tasks.length === 0 && !isDrafting ? (
                        <div
                            onDoubleClick={(e) => { e.stopPropagation(); startDrafting(); }}
                            className="flex flex-col items-center justify-center h-28 text-center cursor-pointer group rounded-xl mx-1 hover:bg-white/[0.02] transition-colors border border-dashed border-white/[0.05] hover:border-white/[0.1]"
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
                    <div className="bg-[#13131A] border border-white/[0.05] rounded-xl p-3 shadow-lg flex flex-col gap-3 relative z-20 mx-1">
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
                                placeholder="Títol de la tasca..."
                                className="bg-transparent text-[13px] font-medium text-slate-200 p-1 focus:outline-none flex-1 placeholder:text-slate-600"
                            />
                            <button
                                onClick={submitDraft}
                                className="bg-white/10 hover:bg-white/20 text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-md text-slate-300 hover:text-white transition-colors"
                            >
                                Crear
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

                            <div className="relative">
                                {subjects && subjects.length > 0 && (
                                    <button
                                        onClick={toggleSubjectPicker}
                                        className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors border ${
                                            draftSubjectId 
                                                ? (() => {
                                                    const s = subjects.find(sub => sub.id === draftSubjectId);
                                                    return s ? `text-${s.colorToken.replace('500', '400')} bg-${s.colorToken}/10 border-${s.colorToken}/20` : 'text-slate-400 bg-slate-500/10 border-slate-500/20';
                                                })()
                                                : 'text-slate-400 bg-slate-500/10 border-slate-500/20'
                                        }`}
                                    >
                                        <span className="font-semibold text-[10px] tracking-wider uppercase">
                                            {draftSubjectId ? subjects.find(sub => sub.id === draftSubjectId)?.name : 'Assignatura'}
                                        </span>
                                    </button>
                                )}

                                {showSubjectPicker && (
                                    <div className="absolute top-full left-0 mt-2 w-48 bg-[#13131A] border border-white/[0.08] p-2 rounded-xl flex flex-col gap-2 shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50">
                                        <input
                                            autoFocus
                                            value={subjectSearchQuery}
                                            onChange={(e) => setSubjectSearchQuery(e.target.value)}
                                            placeholder="Cerca..."
                                            className="bg-white/5 border border-white/10 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-white/20 w-full placeholder:text-slate-500"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <div className="flex flex-col gap-1 max-h-32 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                                            <button 
                                                onClick={(e) => { e.preventDefault(); setDraftSubjectId(null); setShowSubjectPicker(false); }}
                                                className={`text-left px-2 py-1.5 rounded-md text-[11px] font-semibold tracking-wide uppercase transition-colors ${!draftSubjectId ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-300'}`}
                                            >
                                                Sense assignatura
                                            </button>
                                            {filteredSubjects.map(s => (
                                                <button
                                                    key={s.id}
                                                    onClick={(e) => { e.preventDefault(); setDraftSubjectId(s.id); setShowSubjectPicker(false); }}
                                                    className={`text-left px-2 py-1.5 rounded-md text-[11px] font-semibold tracking-wide uppercase transition-colors flex items-center gap-2 ${draftSubjectId === s.id ? `bg-${s.colorToken}/20 text-${s.colorToken.replace('500', '400')}` : 'text-slate-400 hover:bg-white/5 hover:text-slate-300'}`}
                                                >
                                                    <span className={`w-1.5 h-1.5 rounded-full bg-${s.colorToken}`}></span>
                                                    {s.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

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
