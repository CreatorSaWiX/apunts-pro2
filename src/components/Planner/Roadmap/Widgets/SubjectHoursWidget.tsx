import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';


interface SubjectHoursWidgetProps {
    subjectId: string;
}

const SubjectHoursWidget: React.FC<SubjectHoursWidgetProps> = ({ subjectId }) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!subjectId) return;

        setLoading(true);
        // Netegem l'acrònim (treiem possibles espais o salt de línia extres)
        const cleanId = subjectId.trim().toUpperCase();

        fetch(`/data/subjects/${cleanId}.json`)
            .then(res => {
                if (!res.ok) throw new Error('Not found');
                return res.json();
            })
            .then(json => {
                setData(json);
                setLoading(false);
            })
            .catch(err => {
                console.error(`Failed to load subject details for widget: ${cleanId}`, err);
                setData(null);
                setLoading(false);
            });
    }, [subjectId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-6 bg-slate-900/30 border border-white/5 rounded-2xl animate-pulse my-4">
                <div className="w-6 h-6 border-2 border-sky-500/50 border-t-sky-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!data || !data.hours || data.hours.length === 0) {
        return null;
    }

    return (
        <div className="my-6 flex justify-center w-full">
            <div className="flex flex-wrap justify-center gap-6">
                {data.hours.map((hour: any, i: number) => {
                    const colors = [
                        '#0ea5e9', // sky-500
                        '#10b981', // emerald-500
                        '#d946ef', // fuchsia-500
                        '#f59e0b', // amber-500
                        '#6366f1'  // indigo-500
                    ];
                    const color = colors[i % colors.length];
                    const maxHours = Math.max(...data.hours.map((h: any) => h.value), 10);
                    const percentage = Math.min((hour.value / maxHours) * 100, 100) || 0;

                    return (
                        <div key={i} className="flex flex-col items-center justify-center w-24">
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

export default SubjectHoursWidget;
