import React, { useState } from 'react';
import { m as motion } from 'framer-motion';
import { Flag, Play, Calendar, Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import SubjectPicker from '../SubjectPicker';
import { DateTimePicker } from './DateTimePicker';
import type { Task, TaskPriority } from '../../../types/tasks';

interface ColumnDraftCardProps {
    columnId: string;
    onAddTask: (taskData?: Partial<Task>) => void;
    onCancel: () => void;
}

const PRIORITIES: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH'];

export const ColumnDraftCard: React.FC<ColumnDraftCardProps> = React.memo(({
    columnId,
    onAddTask,
    onCancel
}) => {
    const { t } = useTranslation();
    const [draftTitle, setDraftTitle] = useState('');
    const [draftPriority, setDraftPriority] = useState<TaskPriority>('MEDIUM');
    const [draftSubjectId, setDraftSubjectId] = useState<string | null>(null);
    const [draftStartDate, setDraftStartDate] = useState<string>('');
    const [draftDueDate, setDraftDueDate] = useState<string>('');

    const handleSubmit = () => {
        const startIso = draftStartDate ? new Date(draftStartDate).toISOString() : null;
        const dueIso = draftDueDate ? new Date(draftDueDate).toISOString() : null;

        let estimatedMinutes = 60;
        if (startIso && dueIso) {
            const start = new Date(startIso).getTime();
            const end = new Date(dueIso).getTime();
            if (end > start) {
                estimatedMinutes = Math.round((end - start) / 60000);
            }
        }

        onAddTask({
            title: draftTitle.trim() || t('planner.boardView.defaultTaskTitle', 'Nova Tasca'),
            priority: draftPriority,
            dueDate: dueIso,
            startDate: startIso,
            estimatedMinutes,
            status: columnId,
            subjectId: draftSubjectId || undefined
        });
        onCancel();
    };

    const cyclePriority = (e: React.MouseEvent) => {
        e.preventDefault();
        const nextIndex = (PRIORITIES.indexOf(draftPriority) + 1) % PRIORITIES.length;
        setDraftPriority(PRIORITIES[nextIndex]);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 25, mass: 0.8 }}
            className="bg-[#13131A]/70 backdrop-blur-[40px] border border-white/[0.08] rounded-[20px] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] flex flex-col gap-3 relative z-20 mx-1 origin-top"
        >
            <div className="flex gap-2">
                <input
                    autoFocus
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    onKeyDown={(e) => {
                        e.stopPropagation();
                        if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleSubmit();
                        if (e.key === 'Escape') onCancel();
                    }}
                    placeholder={t('planner.boardView.newTaskTitle', 'Títol de la tasca...')}
                    className="bg-transparent text-[13px] font-medium text-slate-200 p-1 focus:outline-none flex-1 placeholder:text-slate-600"
                />
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex items-center justify-center p-1.5 rounded-md text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
                    title={t('planner.boardView.cancel', 'Cancel·lar')}
                >
                    <X size={16} strokeWidth={2.5} />
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex items-center justify-center p-1.5 rounded-md text-emerald-400 hover:text-white hover:bg-emerald-500 transition-colors"
                    title={t('planner.boardView.create', 'Crear')}
                >
                    <Check size={16} strokeWidth={2.5} />
                </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Selector de Prioritat */}
                <button
                    type="button"
                    onClick={cyclePriority}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors border ${
                        draftPriority === 'HIGH'
                            ? 'text-red-400 bg-red-500/10 border-red-500/20'
                            : draftPriority === 'MEDIUM'
                            ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                            : 'text-slate-400 bg-slate-500/10 border-slate-500/20'
                    }`}
                >
                    <Flag size={12} className={draftPriority === 'HIGH' ? 'fill-current' : ''} />
                    <span className="hidden sm:inline font-medium">{t('planner.boardView.priority', 'Priority')}</span>
                </button>

                {/* Selector d'Assignatura reutilitzable */}
                <SubjectPicker
                    value={draftSubjectId}
                    onChange={setDraftSubjectId}
                    placeholder={t('planner.boardView.subject', 'Assignatura')}
                />

                {/* Selector Data d'Inici */}
                <DateTimePicker
                    value={draftStartDate}
                    onChange={setDraftStartDate}
                    placeholder={t('planner.boardView.startDate', 'Data inici')}
                    icon={<Play size={12} className="text-emerald-400" />}
                />

                {/* Selector Data Límit */}
                <DateTimePicker
                    value={draftDueDate}
                    onChange={setDraftDueDate}
                    placeholder={t('planner.boardView.dueDate', 'Data límit')}
                    icon={<Calendar size={12} className="text-indigo-400" />}
                />
            </div>
        </motion.div>
    );
});

ColumnDraftCard.displayName = 'ColumnDraftCard';
