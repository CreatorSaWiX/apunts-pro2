import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle, ExternalLink } from 'lucide-react';
import { m as motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface SolutionHeaderProps {
    solution: any;
    topicId: string;
    authorData: { avatar?: string; username?: string } | null;
    prevSolution: any;
    nextSolution: any;
    jutgeUrl?: string;
    canonicalTitle: string;
}

const SolutionHeader = ({
    solution,
    topicId,
    authorData,
    prevSolution,
    nextSolution,
    jutgeUrl,
    canonicalTitle,
}: SolutionHeaderProps) => {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-8 pb-4 border-b border-white/5"
        >
            <div className="flex items-center gap-4 min-w-0">
                <Link
                    to={`/tema/${topicId}/solucionaris`}
                    className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-800/50 hover:bg-white/10 text-slate-400 hover:text-white transition border border-white/5 hover:border-white/20"
                    title={t('solutionDetail.backToList', 'Tornar a la llista')}
                >
                    <ArrowLeft size={18} />
                </Link>

                <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                        {jutgeUrl ? (
                            <a href={jutgeUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 font-mono text-emerald-400 hover:text-emerald-300 hover:underline font-bold tracking-tight text-lg flex items-center gap-1.5" title={t('solutionDetail.openJutge', 'Obrir problema al Jutge')}>
                                {solution.id}
                                <ExternalLink size={16} className="opacity-70" />
                            </a>
                        ) : (
                            <span className="shrink-0 font-mono text-emerald-400 font-bold tracking-tight text-lg">
                                {solution.id}
                            </span>
                        )}
                        <span className="shrink-0 w-1 h-1 rounded-full bg-slate-600"></span>
                        <h1 className="text-lg font-bold text-slate-200 truncate">
                            {canonicalTitle}
                        </h1>
                    </div>
                    {/* Author Info */}
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                        <span className="text-slate-500 mr-0.5">{t('solutionDetail.author', 'Autor:')}</span>
                        {solution.authorId ? (
                            <Link to={`/profile/${solution.author}`} className="flex items-center gap-2 hover:text-sky-400 transition-colors">
                                {authorData?.avatar && <img src={authorData.avatar} className="w-5 h-5 rounded-full bg-slate-800 object-cover" loading="lazy" alt="Avatar de l'autor" />}
                                {authorData?.username || solution.author || t('solutionDetail.anonymous', 'Anònim')}
                            </Link>
                        ) : (
                            <span className="flex items-center gap-2 text-slate-400 cursor-default">
                                {solution.author || t('solutionDetail.anonymous', 'Anònim')}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Prev/Next Buttons */}
            <div className="flex items-center gap-2">
                <Link
                    to={prevSolution ? `/tema/${topicId}/solucionaris/${prevSolution.id}` : '#'}
                    className={`p-2.5 rounded-lg border border-white/5 transition flex items-center gap-2 ${prevSolution
                        ? 'bg-slate-800/50 hover:bg-white/10 text-slate-400 hover:text-white hover:border-white/10'
                        : 'bg-transparent text-slate-800 border-transparent cursor-not-allowed hidden sm:flex'
                        }`}
                    title={prevSolution ? `${t('solutionDetail.prevTooltip', 'Anterior:')} ${prevSolution.title}` : undefined}
                >
                    <ChevronLeft size={18} />
                    <span className="text-sm font-medium hidden lg:inline">{t('solutionDetail.prev', 'Anterior')}</span>
                </Link>
                <Link
                    to={nextSolution ? `/tema/${topicId}/solucionaris/${nextSolution.id}` : '#'}
                    className={`p-2.5 rounded-lg border border-white/5 transition flex items-center gap-2 ${nextSolution
                        ? 'bg-slate-800/50 hover:bg-white/10 text-slate-400 hover:text-white hover:border-white/10'
                        : 'bg-transparent text-slate-800 border-transparent cursor-not-allowed hidden sm:flex'
                        }`}
                    title={nextSolution ? `${t('solutionDetail.nextTooltip', 'Següent:')} ${nextSolution.title}` : undefined}
                >
                    <span className="text-sm font-medium hidden lg:inline">{t('solutionDetail.next', 'Següent')}</span>
                    <ChevronRight size={18} />
                </Link>
            </div>
        </motion.div>
    );
};

export default SolutionHeader;
