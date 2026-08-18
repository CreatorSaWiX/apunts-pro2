import { FileText } from 'lucide-react';
import { m as motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HtmlRenderer } from '../ui/typography/HtmlRenderer';
import CommentsSection from '../comments/CommentsSection';

import type { Solution } from '../../content/data/solutions';

interface ProblemStatementPanelProps {
    solution: Solution;
    lang: string;
    setLang: (lang: string) => void;
}

const ProblemStatementPanel = ({ solution, lang, setLang }: ProblemStatementPanelProps) => {
    const { t } = useTranslation();

    const availableLanguages = solution.availableLanguages && solution.availableLanguages.length > 0
        ? solution.availableLanguages
        : ['ca', 'es', 'en'];

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-6"
        >
            <div className="bg-slate-900/50 border border-white/5 rounded-3xl overflow-hidden shadow-xl backdrop-blur-sm transition duration-500 hover:border-white/10 hover:shadow-2xl hover:-translate-y-1">
                <div className="px-5 py-3 bg-white/5 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FileText size={16} className="text-indigo-400" />
                        <span className="text-sm font-medium text-slate-200">{t('solutionDetail.statement', 'Enunciat')}</span>
                    </div>

                    {/* LANGUAGE SELECTOR */}
                    <div className="flex items-center gap-1 text-[10px] font-bold uppercase bg-black/20 p-1 rounded-lg">
                        {availableLanguages.map((l: string) => (
                            <button type="button"
                                key={l}
                                onClick={() => setLang(l)}
                                className={`px-2 py-1 rounded-md transition ${lang === l
                                    ? 'bg-indigo-500 text-white shadow-sm'
                                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                                    }`}
                            >
                                {l}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="p-6 text-slate-300 leading-relaxed text-[15px]">
                    {solution.statement ? (
                        <HtmlRenderer content={solution.statement} className="jutge-content space-y-4" />
                    ) : (
                        <p className="italic text-slate-500">{t('solutionDetail.statementNotAvailable', 'Enunciat no disponible.')}</p>
                    )}
                </div>
            </div>

            <CommentsSection solutionId={solution.id} solutionTitle={solution.title} />
        </motion.div>
    );
};

export default ProblemStatementPanel;
