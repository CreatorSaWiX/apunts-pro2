import { useState, useEffect, lazy, Suspense } from 'react';
import { Edit, Save, X } from 'lucide-react';
import { m as motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MarkdownRenderer } from '../../markdown/MarkdownRenderer';
import CodeBlock from '../ui/editors/CodeBlock';
import Spinner from '../ui/Spinner';
import { updateSolution } from '../../services/solutionService';

const CodeEditor = lazy(() => import('../ui/editors/CodeEditor'));

const CodeEditorSkeleton = () => {
    const { t } = useTranslation();
    return (
        <div className="w-full h-150 bg-slate-900/50 animate-pulse rounded-2xl border border-white/10 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-slate-500">
                <Spinner />
                <span className="text-sm font-medium">{t('solutionDetail.loadingEditor', 'Carregant editor...')}</span>
            </div>
        </div>
    );
};

import type { Solution } from '../../content/data/solutions';

interface SolutionEditorViewerProps {
    solution: Solution | null;
    user: { id: string; username: string } | null;
    topicId: string;
    canonicalTitle: string;
    jutgeUrl?: string;
    setSolution?: React.Dispatch<React.SetStateAction<Solution | null>> | ((updater: (prev: Solution | null) => Solution | null) => void);
}

const SolutionEditorViewer = ({
    solution,
    user,
    topicId,
    canonicalTitle,
    jutgeUrl,
    setSolution
}: SolutionEditorViewerProps) => {
    const { t } = useTranslation();
    if (!solution) return null;
    const [isEditing, setIsEditing] = useState(false);
    const [currentCode, setCurrentCode] = useState(solution?.code || '');

    // Properly sync code state when solution changes without doing it during render loop
    useEffect(() => {
        setCurrentCode(solution?.code || '');
        setIsEditing(false); // Reset editing state on solution change
    }, [solution?.id, solution?.code]);

    const handleSave = async () => {
        if (!solution || !user) return;

        try {
            const solutionData = {
                problemId: solution.id,
                topicId: topicId,
                title: canonicalTitle,
                code: currentCode,
                authorId: user.id,
                authorName: user.username,
                language: 'cpp', // Default for now
                updatedAt: new Date().toISOString(),
                statement: solution.statement || ''
            };

            await updateSolution(solution.id, solutionData);

            if (setSolution) {
                setSolution((prev: Solution | null) => ({
                    ...(prev || {} as Solution),
                    code: currentCode,
                    title: canonicalTitle,
                    authorId: user.id,
                    author: user.username
                }));
            }

            setIsEditing(false);
        } catch (error) {
            console.error("Error saving solution:", error);
            alert(t('solutionDetail.saveError', "Error al guardar la solució. Comprova la consola."));
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative lg:col-span-1 h-full flex flex-col"
        >
            <div className="bg-slate-900/50 border border-white/5 rounded-3xl overflow-hidden shadow-xl flex-1 flex flex-col min-h-125 backdrop-blur-sm transition duration-500 hover:border-white/10 hover:shadow-2xl hover:-translate-y-1">
                <div className="relative flex-1 bg-transparent overflow-hidden flex flex-col p-px">
                    {solution.type === 'notebook' ? (
                        <div className="p-8 md:p-10 h-full overflow-y-auto custom-scrollbar">
                            <div className="prose prose-invert prose-emerald max-w-none heading-reset text-lg">
                                <MarkdownRenderer content={solution.content || ''} />
                            </div>
                        </div>
                    ) : isEditing ? (
                        <>
                            <div className="px-5 py-3 bg-white/3 border-b border-white/6 flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-3">
                                    {jutgeUrl ? (
                                        <a href={jutgeUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-mono text-slate-400 hover:text-sky-400 hover:underline transition-colors flex items-center gap-1.5" title={t('solutionDetail.openJutgeSite', 'Obrir a jutge.org')}>
                                            {solution.id}.cpp
                                            <Edit size={13} className="opacity-0" />
                                        </a>
                                    ) : (
                                        <span className="text-sm font-mono text-slate-400">{solution.id}.cpp</span>
                                    )}
                                    <span className="text-xs font-medium text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">C++</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                        title={t('solutionDetail.cancel', 'Cancel·lar')}
                                        aria-label="Tancar">
                                        <X size={16} />
                                    </button>
                                    <button type="button"
                                        onClick={handleSave}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
                                        aria-label="Botó interactiu">
                                        <Save size={14} /> {t('solutionDetail.save', 'Guardar')}
                                    </button>
                                </div>
                            </div>
                            <Suspense fallback={<CodeEditorSkeleton />}>
                                <CodeEditor
                                    value={currentCode}
                                    onChange={setCurrentCode}
                                    height="100%"
                                    className="bg-transparent h-full flex-1"
                                    variant="minimal"
                                />
                            </Suspense>
                        </>
                    ) : (
                        <CodeBlock
                            code={solution.code || ''}
                            language="cpp"
                            title={`${solution.id}.cpp`}
                            titleHref={jutgeUrl}
                            showHeader={true}
                            className="m-0! h-full bg-transparent! rounded-none! shadow-none! border-0! flex-1 flex flex-col"
                            headerActions={
                                <div className="flex items-center gap-2">
                                    {user && ((user as any).role === 'moderador' || (user as any).role === 'editor') && (
                                        <button type="button"
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
                                        >
                                            <Edit size={14} /> {t('solutionDetail.edit', 'Editar')}
                                        </button>
                                    )}
                                </div>
                            }
                        />
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default SolutionEditorViewer;
