import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AIStreamingIndicator from '../AIStreamingIndicator';
import type { AIPhase } from '../../hooks/useQuiz';

interface QuizLoadingStateProps {
    isGenerating: boolean;
    aiPhase: AIPhase;
    aiThought: string;
}

export const QuizLoadingState: React.FC<QuizLoadingStateProps> = ({
    isGenerating,
    aiPhase,
    aiThought
}) => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 max-w-2xl mx-auto flex flex-col items-center justify-center text-center relative z-10">
            {isGenerating ? (
                <div className="flex flex-col items-center gap-6">
                    <div className="bg-slate-900/60 p-8 rounded-4xl border border-white/10 shadow-2xl">
                        <AIStreamingIndicator
                            phase={aiPhase}
                            thoughtText={aiThought}
                            hideAvatar={true}
                        />
                        <p className="mt-4 text-slate-400 text-sm">{aiThought}</p>
                    </div>
                </div>
            ) : (
                <>
                    <AlertTriangle size={48} className="text-amber-500 mb-4 mx-auto" />
                    <h1 className="text-2xl font-bold text-white mb-2">{t('quiz.noDataTitle', 'Sense dades')}</h1>
                    <p className="text-slate-400 mb-8">{t('quiz.noDataDesc', 'No hem pogut trobar el test ni generar-ne un de nou.')}</p>
                    <Link to="/" className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors inline-block">
                        {t('quiz.backHome', "Tornar a l'inici")}
                    </Link>
                </>
            )}
        </div>
    );
};
