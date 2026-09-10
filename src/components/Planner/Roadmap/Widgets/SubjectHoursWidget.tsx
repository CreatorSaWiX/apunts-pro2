import React, { useState, useEffect, useMemo } from 'react';
import { m as motion } from 'framer-motion';
import Spinner from '../../../ui/Spinner';

interface SubjectHourItem {
    type?: string;
    label?: string;
    value: number;
}

interface SubjectHoursData {
    hours?: SubjectHourItem[];
    [key: string]: unknown;
}

interface SubjectHoursWidgetProps {
    subjectId: string;
}

const HOUR_COLORS = [
    '#0ea5e9', // sky-500
    '#10b981', // emerald-500
    '#d946ef', // fuchsia-500
    '#f59e0b', // amber-500
    '#6366f1'  // indigo-500
] as const;

// Module-level in-memory cache with TTL (30 min) to prevent redundant HTTP requests across widgets
const CACHE_TTL_MS = 30 * 60 * 1000;
const hoursCache = new Map<string, { data: SubjectHoursData; timestamp: number }>();

function getCachedHours(key: string): SubjectHoursData | null {
    const entry = hoursCache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
        hoursCache.delete(key);
        return null;
    }
    return entry.data;
}

const SubjectHoursWidget: React.FC<SubjectHoursWidgetProps> = ({ subjectId }) => {
    const cleanId = subjectId ? subjectId.trim().toUpperCase() : '';
    const cached = cleanId ? getCachedHours(cleanId) : null;
    const [data, setData] = useState<SubjectHoursData | null>(() => cached);
    const [loading, setLoading] = useState<boolean>(Boolean(cleanId && !cached));

    useEffect(() => {
        if (!cleanId) {
            setData(null);
            setLoading(false);
            return;
        }

        const currentCached = getCachedHours(cleanId);
        if (currentCached) {
            setData(currentCached);
            setLoading(false);
            return;
        }

        let ignore = false;
        setData(null);
        setLoading(true);

        fetch(`/data/subjects/${cleanId}.json`)
            .then(res => {
                if (!res.ok) throw new Error('Not found');
                return res.json();
            })
            .then((json: SubjectHoursData) => {
                if (!ignore) {
                    hoursCache.set(cleanId, { data: json, timestamp: Date.now() });
                    setData(json);
                    setLoading(false);
                }
            })
            .catch(err => {
                if (!ignore) {
                    console.error(`Failed to load subject details for widget: ${cleanId}`, err);
                    setData(null);
                    setLoading(false);
                }
            });

        return () => {
            ignore = true;
        };
    }, [cleanId]);

    const maxHours = useMemo(() => {
        if (!data?.hours || data.hours.length === 0) return 10;
        return Math.max(...data.hours.map((h) => h.value), 10);
    }, [data?.hours]);

    if (!cleanId) return null;

    if (loading) {
        return (
            <div className="flex items-center justify-center p-6 bg-slate-900/30 border border-white/5 rounded-2xl my-4">
                <Spinner size="sm" variant="sky" />
            </div>
        );
    }

    if (!data?.hours || data.hours.length === 0) {
        return null;
    }

    return (
        <div className="my-6 flex justify-center w-full">
            <div className="flex flex-wrap justify-center gap-6">
                {data.hours.map((hour: SubjectHourItem, i: number) => {
                    const color = HOUR_COLORS[i % HOUR_COLORS.length];
                    const percentage = Math.min((hour.value / maxHours) * 100, 100) || 0;

                    return (
                        <div key={hour.type || i} className="flex flex-col items-center justify-center w-24">
                            <div className="relative w-16 h-16 flex items-center justify-center mb-2">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    <circle
                                        cx="50" cy="50" r="40"
                                        fill="transparent"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        className="text-white/5"
                                    />
                                    <motion.circle
                                        cx="50" cy="50" r="40"
                                        fill="transparent"
                                        stroke={color}
                                        strokeWidth="8"
                                        strokeLinecap="round"
                                        strokeDasharray={251.2}
                                        initial={{ strokeDashoffset: 251.2 }}
                                        whileInView={{ strokeDashoffset: 251.2 - (251.2 * percentage) / 100 }}
                                        viewport={{ once: true, margin: "-20px" }}
                                        transition={{ duration: 1.5, ease: "easeOut", delay: i * 0.1 }}
                                        style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                    <motion.span
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true, margin: "-20px" }}
                                        transition={{ delay: 0.5 + i * 0.1 }}
                                        className="text-lg font-black text-white"
                                        style={{ textShadow: `0 0 15px ${color}80` }}
                                    >
                                        {hour.value}
                                    </motion.span>
                                </div>
                            </div>
                            <h4 className="text-[9px] font-bold text-slate-400 text-center uppercase tracking-widest leading-tight">
                                {hour.type}
                            </h4>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

SubjectHoursWidget.displayName = 'SubjectHoursWidget';

export default React.memo(SubjectHoursWidget);
