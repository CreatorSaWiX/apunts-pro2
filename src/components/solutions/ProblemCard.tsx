import { Link } from 'react-router-dom';
import { m as motion } from 'framer-motion';
import { Check, ExternalLink, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { isJutgeProblem, getJutgeUrl } from '../../lib/jutge';

interface ProblemCardProps {
    problemId: string;
    topicId: string;
    problemTitle: string;
    isSolved: boolean;
    solutionTitle?: string;
    index: number;
}

const ProblemCard = ({ problemId, topicId, problemTitle, isSolved, solutionTitle, index }: ProblemCardProps) => {
    const { t } = useTranslation();
    const isJutge = isJutgeProblem(problemId, topicId);
    const jutgeUrl = isJutge ? getJutgeUrl(problemId) : undefined;
    const displayTitle = problemTitle || solutionTitle || problemId;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
        >
            <Link
                to={`/tema/${topicId}/solucionaris/${problemId}`}
                className="group relative block h-full"
            >
                <div className={`h-full backdrop-blur-sm rounded-3xl border p-6 transition duration-300 relative overflow-hidden group-hover:shadow-2xl group-hover:-translate-y-1 group-active:scale-95
                    ${isSolved
                        ? 'bg-linear-to-br from-slate-900/80 to-slate-800/80 border-emerald-500/30 hover:border-emerald-400/60 hover:shadow-emerald-500/10'
                        : 'bg-slate-900/40 border-white/5 hover:border-white/20 hover:bg-slate-800/40 opacity-90 hover:opacity-100'
                    }
                `}>
                    {/* Decorative glow for solved problems */}
                    {isSolved && (
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none transition-transform duration-700 ease-out group-hover:scale-150" />
                    )}

                    <div className="relative z-10 flex items-start justify-between mb-4">
                        {isJutge && jutgeUrl ? (
                            <button type="button" 
                                onClick={(e) => {
                                    e.preventDefault(); 
                                    window.open(jutgeUrl, '_blank', 'noopener,noreferrer');
                                }}
                                className={`px-2.5 py-1 rounded-lg font-mono text-sm font-bold border transition shadow-sm flex items-center gap-1.5 hover:-translate-y-0.5
                                    ${isSolved ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-400' : 'bg-slate-800 text-slate-400 border-white/10 hover:bg-slate-700 hover:text-white'}
                                `}
                                title={t('solutionsList.openJutge', "Obrir problema al Jutge")}
                            >
                                {problemId}
                                <ExternalLink size={14} className="opacity-70" />
                            </button>
                        ) : (
                            <div className={`px-2.5 py-1 rounded-lg font-mono text-sm font-bold border transition-colors shadow-sm
                                ${isSolved ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-white/10'}
                            `}>
                                {problemId}
                            </div>
                        )}
                        {isSolved ? (
                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1.5 rounded-full border border-emerald-500/20 shadow-sm backdrop-blur-md">
                                <Check size={12} strokeWidth={3} /> {t('common.status.done', 'Fet')}
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-800/50 px-2.5 py-1.5 rounded-full border border-white/5">
                                {t('common.status.pending', 'Pendent')}
                            </div>
                        )}
                    </div>

                    <h3 className={`text-lg font-semibold mb-2 line-clamp-2 transition-colors ${isSolved ? 'text-slate-200 group-hover:text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>
                        {displayTitle}
                    </h3>

                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-xs">
                        <span className={`${isSolved ? 'text-emerald-400/80' : 'text-slate-600'} group-hover:text-white transition-colors`}>
                            {isSolved ? t('solutionsList.viewSolution', 'Veure solució') : t('solutionsList.readStatement', 'Llegir enunciat')}
                        </span>
                        {isSolved && <ArrowLeft size={12} className="rotate-180 text-emerald-500 group-hover:translate-x-1 transition-transform" />}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default ProblemCard;
