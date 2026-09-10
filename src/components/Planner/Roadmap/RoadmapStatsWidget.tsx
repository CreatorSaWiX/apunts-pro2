import React from 'react';
import { useTranslation } from 'react-i18next';
import { m as motion, AnimatePresence } from 'framer-motion';
import { Target, GraduationCap } from 'lucide-react';

const RADIUS = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export interface RoadmapStatsWidgetProps {
    averageGrade: number | null;
    targetGrade: number | null;
    requiredAverageGrade: number | null;
    setTargetGrade: (grade: number | null) => void;
    totalPassedECTS: number;
    totalPlannedECTS: number;
    canStartMaster: boolean;
    onSave: () => void;
}

export const RoadmapStatsWidget: React.FC<RoadmapStatsWidgetProps> = React.memo(({
    averageGrade,
    targetGrade,
    requiredAverageGrade,
    setTargetGrade,
    totalPassedECTS,
    totalPlannedECTS,
    canStartMaster,
    onSave
}) => {
    const { t } = useTranslation();

    const percentage = Math.max(0, Math.min(totalPassedECTS / 240, 1));
    const strokeDashoffset = CIRCUMFERENCE - percentage * CIRCUMFERENCE;

    const plannedPercentage = Math.max(0, Math.min(totalPlannedECTS / 240, 1));
    const plannedStrokeDashoffset = CIRCUMFERENCE - plannedPercentage * CIRCUMFERENCE;

    const [inputGrade, setInputGrade] = React.useState<string>(() => (targetGrade !== null ? String(targetGrade) : ''));

    React.useEffect(() => {
        setInputGrade(targetGrade !== null ? String(targetGrade) : '');
    }, [targetGrade]);

    const handleGradeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInputGrade(val);
        if (val === '') {
            setTargetGrade(null);
            return;
        }
        const num = parseFloat(val);
        if (!isNaN(num) && num >= 0 && num <= 10) {
            setTargetGrade(num);
        }
    };

    const handleGradeInputBlur = () => {
        if (inputGrade === '') {
            setTargetGrade(null);
        } else {
            const num = parseFloat(inputGrade);
            if (!isNaN(num) && num >= 0 && num <= 10) {
                setTargetGrade(num);
                setInputGrade(String(num));
            } else {
                setInputGrade(targetGrade !== null ? String(targetGrade) : '');
            }
        }
        onSave();
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute bottom-6 right-6 z-40 hidden lg:flex flex-col items-end gap-3 pointer-events-none"
        >
            <div
                className="bg-slate-900/95 border border-white/10 rounded-3xl p-3 flex flex-col gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)] pointer-events-auto"
                style={{ transform: 'translateZ(0)' }}
            >
                {/* Nota Mitjana Widget */}
                <div className="flex items-center gap-4 px-2 py-1">
                    <div className="relative w-[50px] h-[50px] flex items-center justify-center rounded-full bg-linear-to-br from-fuchsia-500/20 to-purple-500/20 border border-fuchsia-500/30 shadow-[inset_0_0_20px_rgba(217,70,239,0.3),0_0_15px_rgba(217,70,239,0.2)]">
                        <span className="text-[15px] font-black text-white drop-shadow-[0_0_8px_rgba(217,70,239,0.8)] tracking-tight">
                            {averageGrade !== null ? averageGrade.toFixed(2) : '-.--'}
                        </span>
                    </div>
                    <div className="flex flex-col pr-4">
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-0.5">
                            {t('roadmapView.averageGrade', 'Mitjana Ponderada')}
                        </span>
                        <div className="flex items-center gap-3">
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-black text-white tracking-tight">
                                    {averageGrade !== null ? averageGrade.toFixed(2) : '-.--'}
                                </span>
                                <span className="text-xs font-medium text-slate-500">/10</span>
                            </div>

                            {/* Target Input */}
                            <div className="flex items-center bg-white/5 hover:bg-white/10 transition-colors rounded-lg px-2 py-1 border border-white/5 relative group">
                                <Target
                                    size={12}
                                    className={`mr-1.5 transition-colors ${
                                        targetGrade !== null
                                            ? requiredAverageGrade !== null && requiredAverageGrade > 10
                                                ? 'text-red-400'
                                                : 'text-amber-400'
                                            : 'text-slate-500'
                                    }`}
                                />
                                <input
                                    type="number"
                                    min="0"
                                    max="10"
                                    step="0.1"
                                    value={inputGrade}
                                    onChange={handleGradeInputChange}
                                    placeholder="Obj."
                                    title={t('roadmapView.targetGradeInput', 'Escriu la nota objectiu a la que vols arribar')}
                                    className="w-8 bg-transparent text-sm font-bold text-slate-300 hover:text-white focus:text-white tracking-tight outline-none placeholder-slate-600 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    onBlur={handleGradeInputBlur}
                                    onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                                />

                                {/* Required Indicator */}
                                <AnimatePresence>
                                    {targetGrade !== null && requiredAverageGrade !== null && (
                                        <motion.div
                                             initial={{ opacity: 0, y: 5 }}
                                             animate={{ opacity: 1, y: 0 }}
                                             exit={{ opacity: 0, y: 5 }}
                                             className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap z-50 pointer-events-none"
                                         >
                                             <span
                                                 className={`text-[9px] font-bold px-1.5 py-1 rounded-md shadow-[0_4px_12px_rgba(0,0,0,0.5)] flex items-center gap-1 backdrop-blur-md ${
                                                     requiredAverageGrade > 10
                                                         ? 'text-red-400 bg-red-950/90 border border-red-500/30'
                                                         : requiredAverageGrade > 8
                                                         ? 'text-amber-400 bg-amber-950/90 border border-amber-500/30'
                                                         : requiredAverageGrade <= 5
                                                         ? 'text-emerald-400 bg-emerald-950/90 border border-emerald-500/30'
                                                         : 'text-sky-400 bg-sky-950/90 border border-sky-500/30'
                                                 }`}
                                             >
                                                 {requiredAverageGrade > 10
                                                     ? '⚠ Impossible'
                                                     : requiredAverageGrade <= 5
                                                     ? '✓ Garantit'
                                                     : `Cal: ${requiredAverageGrade.toFixed(2)}`}
                                             </span>
                                         </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full h-px bg-white/5 rounded-full" />

                {/* ECTS Widget */}
                <div className="flex items-center gap-4 px-2 py-1">
                    <div className="relative w-[50px] h-[50px] flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90 absolute inset-0">
                            <circle cx="25" cy="25" r={RADIUS} stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-800" />
                            <circle
                                cx="25"
                                cy="25"
                                r={RADIUS}
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="transparent"
                                strokeDasharray={CIRCUMFERENCE}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                className="text-sky-500 transition duration-1000 ease-out drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]"
                            />
                        </svg>
                        <span className="text-[10px] font-bold text-sky-400 mt-0.5">{Math.round(percentage * 100)}%</span>
                    </div>
                    <div className="flex flex-col pr-6">
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-0.5">
                            {t('roadmapView.passedECTS', 'Crèdits Aprovats')}
                        </span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-black text-white tracking-tight">{totalPassedECTS}</span>
                            <span className="text-xs font-medium text-slate-500">/240</span>
                        </div>
                    </div>
                </div>

                <div className="w-full h-px bg-white/5 rounded-full" />

                {/* Planned ECTS Widget */}
                <div className="flex items-center gap-4 px-2 py-1">
                    <div className="relative w-[50px] h-[50px] flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90 absolute inset-0">
                            <circle cx="25" cy="25" r={RADIUS} stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-800" />
                            <circle
                                cx="25"
                                cy="25"
                                r={RADIUS}
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="transparent"
                                strokeDasharray={CIRCUMFERENCE}
                                strokeDashoffset={plannedStrokeDashoffset}
                                strokeLinecap="round"
                                className="text-violet-500 transition duration-1000 ease-out drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]"
                            />
                        </svg>
                        <span className="text-[10px] font-bold text-violet-400 mt-0.5">{Math.round(plannedPercentage * 100)}%</span>
                    </div>
                    <div className="flex flex-col pr-6">
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-0.5">
                            {t('roadmapView.plannedECTS', 'Crèdits Planificats')}
                        </span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-black text-white tracking-tight">{totalPlannedECTS}</span>
                            <span className="text-xs font-medium text-slate-500">/240</span>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {canStartMaster && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-orange-500/10 backdrop-blur-xl border border-orange-500/30 rounded-2xl p-3 flex items-center gap-3 shadow-[0_0_20px_rgba(249,115,22,0.15)] relative overflow-hidden pointer-events-auto"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/10 to-orange-500/0 animate-[shine_3s_infinite]" />
                        <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0 border border-orange-500/30">
                            <GraduationCap size={16} className="text-orange-400" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-mono text-orange-400/80 uppercase tracking-widest">
                                {t('roadmapView.masterReady', 'Master Ready')}
                            </span>
                            <span className="text-xs font-bold text-orange-200">
                                {t('roadmapView.parsRequirements', 'Requisits PARS Assolits')}
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
});

RoadmapStatsWidget.displayName = 'RoadmapStatsWidget';
export default RoadmapStatsWidget;
