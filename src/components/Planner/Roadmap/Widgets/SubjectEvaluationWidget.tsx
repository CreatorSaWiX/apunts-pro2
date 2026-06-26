import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface EvaluationItem {
    acronym: string;
    name: string;
    weight: number;
}

interface SubjectEvaluationWidgetProps {
    dataString: string;
}

const SubjectEvaluationWidget: React.FC<SubjectEvaluationWidgetProps> = ({ dataString }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    let items: EvaluationItem[] = [];

    try {
        items = JSON.parse(dataString);
    } catch (e) {
        console.error("Failed to parse evaluation data", e);
        return null;
    }

    if (!items || items.length === 0) return null;

    const totalWeight = items.reduce((acc, item) => acc + item.weight, 0);
    const validTotal = totalWeight > 0 ? totalWeight : 100;

    const themeColors = [
        { gradient: 'from-sky-400 to-blue-600', shadow: 'rgba(56, 189, 248, 0.5)', solid: '#38bdf8' },
        { gradient: 'from-emerald-400 to-green-600', shadow: 'rgba(52, 211, 153, 0.5)', solid: '#34d399' },
        { gradient: 'from-fuchsia-400 to-purple-600', shadow: 'rgba(232, 121, 249, 0.5)', solid: '#e879f9' },
        { gradient: 'from-amber-400 to-orange-600', shadow: 'rgba(251, 191, 36, 0.5)', solid: '#fbbf24' },
        { gradient: 'from-rose-400 to-red-600', shadow: 'rgba(251, 113, 133, 0.5)', solid: '#fb7185' }
    ];

    return (
        <div className="my-8 flex flex-col gap-6 w-full bg-slate-900/30 p-6 rounded-3xl border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                Distribució d'Avaluació
            </h4>

            {/* Stacked Bar */}
            <div className="relative h-6 w-full bg-slate-950/50 rounded-full overflow-hidden border border-white/5 flex shadow-inner cursor-crosshair">
                {items.map((item, i) => {
                    const theme = themeColors[i % themeColors.length];
                    const percentage = (item.weight / validTotal) * 100;

                    return (
                        <motion.div
                            key={i}
                            className={`h-full bg-gradient-to-r ${theme.gradient} relative group flex items-center justify-center border-r border-slate-900/50 last:border-r-0 transition-opacity duration-300 ${hoveredIndex !== null && hoveredIndex !== i ? 'opacity-30' : 'opacity-100'}`}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${percentage}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: "easeOut", delay: i * 0.1 }}
                            style={{ boxShadow: hoveredIndex === i ? `0 0 15px ${theme.shadow}` : 'none' }}
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            {/* Inner label on big segments */}
                            {percentage > 10 && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1 }}
                                    className="text-[10px] font-black text-white/90 drop-shadow-md truncate px-1"
                                >
                                    {item.weight}%
                                </motion.span>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Legends */}
            <div className="flex flex-wrap gap-4 mt-2">
                {items.map((item, i) => {
                    const theme = themeColors[i % themeColors.length];
                    const isHovered = hoveredIndex === i;

                    return (
                        <div
                            key={i}
                            className={`flex items-start gap-3 p-3 rounded-2xl transition-all duration-300 cursor-pointer ${isHovered ? 'bg-white/10 scale-105' : 'bg-white/5 hover:bg-white/[0.07]'}`}
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            style={{
                                borderColor: isHovered ? theme.solid : 'transparent',
                                borderWidth: '1px',
                                boxShadow: isHovered ? `0 0 20px ${theme.shadow}` : 'none'
                            }}
                        >
                            <div className={`w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center shadow-lg`}>
                                <span className="text-[11px] font-black text-white">{item.acronym}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-white leading-tight">{item.name}</span>
                                <span className="text-xs text-slate-400 font-medium mt-0.5">{item.weight}% del total</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SubjectEvaluationWidget;
