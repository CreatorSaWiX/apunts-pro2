import React, { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { getDateLocale } from './boardConstants';

interface TaskProgressBarProps {
    dueDate?: string | null;
    startDate?: string | null;
    createdAt: string;
}

export const TaskProgressBar: React.FC<TaskProgressBarProps> = React.memo(({
    dueDate,
    startDate,
    createdAt
}) => {
    const { t, i18n } = useTranslation();
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        if (!dueDate) return;
        const interval = setInterval(() => setNow(Date.now()), 30000);
        return () => clearInterval(interval);
    }, [dueDate]);

    const dateLocale = useMemo(() => getDateLocale(i18n.language), [i18n.language]);

    const progressData = useMemo(() => {
        if (!dueDate) return null;

        const end = new Date(dueDate).getTime();
        if (isNaN(end)) return null;

        const start = startDate ? new Date(startDate).getTime() : new Date(createdAt).getTime();

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

            const parts: string[] = [];
            if (d > 0) parts.push(`${d}d`);
            if (h > 0) parts.push(`${h}h`);
            if (m > 0 || parts.length === 0) parts.push(`${m}min`);

            timeText = `${t('common.remaining', 'Queden')} ${parts.join(' ')}`;
        }

        const deadlineText = format(new Date(dueDate), 'd MMM yyyy, HH:mm', { locale: dateLocale });

        return {
            percentage,
            color,
            timeText,
            deadlineText
        };
    }, [dueDate, startDate, createdAt, now, t, dateLocale]);

    if (!progressData) return null;

    return (
        <div className="w-full pointer-events-none flex flex-col gap-1.5 mt-1 group/progress">
            <div className="flex justify-between items-center opacity-60 group-hover/progress:opacity-100 transition-opacity">
                <span className="text-[9px] font-semibold text-slate-400 tracking-widest uppercase">
                    {progressData.timeText}
                </span>
                <span className="text-[9px] font-semibold text-slate-500 tracking-widest">
                    {progressData.deadlineText}
                </span>
            </div>
            <div className="relative h-[2px] w-full bg-white/[0.04] rounded-full">
                <div
                    className={`absolute top-0 left-0 h-full rounded-full ${progressData.color} transition duration-1000 ease-out`}
                    style={{ width: `${progressData.percentage}%` }}
                />
            </div>
        </div>
    );
});

TaskProgressBar.displayName = 'TaskProgressBar';
