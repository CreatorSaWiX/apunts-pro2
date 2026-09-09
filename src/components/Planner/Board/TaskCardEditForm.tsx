import React, { useState } from 'react';
import { Flag, Play, Calendar, Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import SubjectPicker from '../SubjectPicker';
import { DateTimePicker } from './DateTimePicker';
import StatusPicker from './StatusPicker';
import { toLocalDatetime } from './boardConstants';
import type { Task, TaskPriority, TaskStatus } from '../../../types/tasks';

interface TaskCardEditFormProps {
    task: Task;
    allColumns?: { id: string; title: string; color?: string }[];
    onSave: (updates: Partial<Task>) => void;
    onCancel: () => void;
}

const PRIORITIES: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH'];

export const TaskCardEditForm: React.FC<TaskCardEditFormProps> = React.memo(({
    task,
    allColumns,
    onSave,
    onCancel
}) => {
    const { t } = useTranslation();
    const [editTitle, setEditTitle] = useState(task.title);
    const [editPriority, setEditPriority] = useState<TaskPriority>(task.priority);
    const [editDueDate, setEditDueDate] = useState<string>(() => toLocalDatetime(task.dueDate));
    const [editStartDate, setEditStartDate] = useState<string>(() => toLocalDatetime(task.startDate));
    const [editSubjectId, setEditSubjectId] = useState<string | null>(task.subjectId || null);
    const [editStatus, setEditStatus] = useState<string>(task.status);

    const handleSave = () => {
        const updates: Partial<Task> = {
            title: editTitle.trim() || t('planner.boardView.defaultTaskTitle', 'Nova Tasca'),
            priority: editPriority,
            dueDate: editDueDate ? new Date(editDueDate).toISOString() : null,
            startDate: editStartDate ? new Date(editStartDate).toISOString() : null,
            subjectId: editSubjectId || null,
            status: editStatus as TaskStatus
        };

        if (updates.startDate && updates.dueDate) {
            const start = new Date(updates.startDate).getTime();
            const end = new Date(updates.dueDate).getTime();
            if (end > start) {
                updates.estimatedMinutes = Math.round((end - start) / 60000);
            }
        }

        onSave(updates);
    };

    const cyclePriority = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const nextIndex = (PRIORITIES.indexOf(editPriority) + 1) % PRIORITIES.length;
        setEditPriority(PRIORITIES[nextIndex]);
    };

    return (
        <div
            className="flex flex-col gap-3 w-full"
            onPointerDown={(e) => e.stopPropagation()}
            onDoubleClick={(e) => e.stopPropagation()}
        >
            <div className="flex gap-2 w-full">
                <input
                    autoFocus
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                            handleSave();
                        }
                        if (e.key === 'Escape') {
                            onCancel();
                        }
                        e.stopPropagation();
                    }}
                    className="bg-transparent text-sm font-medium text-white p-1 focus:outline-none flex-1 border-b border-indigo-500/50"
                />
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onCancel();
                    }}
                    className="flex items-center justify-center p-1.5 rounded-md text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
                    title={t('common.cancel', 'Cancel·lar')}
                    aria-label="Cancel·lar"
                >
                    <X size={16} strokeWidth={2.5} />
                </button>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleSave();
                    }}
                    className="flex items-center justify-center p-1.5 rounded-md text-emerald-400 hover:text-white hover:bg-emerald-500 transition-colors"
                    title={t('common.save', 'Guardar')}
                    aria-label="Guardar canvis"
                >
                    <Check size={16} strokeWidth={2.5} />
                </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
                {allColumns && allColumns.length > 0 && (
                    <StatusPicker
                        value={editStatus}
                        onChange={setEditStatus}
                        columns={allColumns}
                    />
                )}

                <button
                    type="button"
                    onClick={cyclePriority}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors border ${
                        editPriority === 'HIGH'
                            ? 'text-red-400 bg-red-500/10 border-red-500/20'
                            : editPriority === 'MEDIUM'
                            ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                            : 'text-slate-400 bg-slate-500/10 border-slate-500/20'
                    }`}
                    title={t('planner.boardView.priority', 'Priority')}
                    aria-label="Marcar prioritat"
                >
                    <Flag size={12} className={editPriority === 'HIGH' ? 'fill-current' : ''} />
                    <span className="hidden sm:inline font-medium">{t('planner.boardView.priority', 'Priority')}</span>
                </button>

                <SubjectPicker
                    value={editSubjectId}
                    onChange={setEditSubjectId}
                    placeholder={t('planner.boardView.subject', 'Assignatura')}
                />

                <DateTimePicker
                    value={editStartDate}
                    onChange={setEditStartDate}
                    placeholder={t('planner.boardView.startDate', 'Data inici')}
                    icon={<Play size={12} className="text-emerald-400" />}
                />

                <DateTimePicker
                    value={editDueDate}
                    onChange={setEditDueDate}
                    placeholder={t('planner.boardView.dueDate', 'Data límit')}
                    icon={<Calendar size={12} className="text-indigo-400" />}
                />
            </div>
        </div>
    );
});

TaskCardEditForm.displayName = 'TaskCardEditForm';
