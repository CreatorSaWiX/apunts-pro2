import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSolution, useSolutions } from '../hooks/useSolutions';
import { useAuth } from '../contexts/AuthContext';
import { useAuthor } from '../hooks/useAuthor';
import type { TopicDefinition } from '../content/data/courseStructure';
import Spinner from '../components/ui/Spinner';
import SolutionHeader from '../components/solutions/SolutionHeader';
import ProblemStatementPanel from '../components/solutions/ProblemStatementPanel';
import SolutionEditorViewer from '../components/solutions/SolutionEditorViewer';
import { getCanonicalTitle, isJutgeId, isSolutionSolved } from '../utils/solutionUtils';

const SolutionDetailPage = () => {
    const { id: topicId, problemId } = useParams();
    const { t } = useTranslation();
    const [lang, setLang] = useState('ca');
    const { solution, loading, setSolution } = useSolution(topicId || '', problemId || '', lang);
    const { solutions } = useSolutions(topicId || '');
    const { user } = useAuth();
    
    const { authorData } = useAuthor(solution?.authorId);
    
    const [courseStructure, setCourseStructure] = useState<TopicDefinition[]>([]);
    const [importError, setImportError] = useState(false);

    useEffect(() => {
        import('../content/data/courseStructure')
            .then(m => {
                setCourseStructure(m.courseStructure);
                setImportError(false);
            })
            .catch(e => {
                console.error(e);
                setImportError(true);
            });
    }, []);

    // Find prev/next
    const currentIndex = solutions.findIndex(s => s.id === problemId);
    const prevSolution = currentIndex > 0 ? solutions[currentIndex - 1] : null;
    const nextSolution = currentIndex !== -1 && currentIndex < solutions.length - 1 ? solutions[currentIndex + 1] : null;

    // Scroll to top
    useEffect(() => {
        window.scrollTo(0, 0);
        document.body.style.overflow = 'auto';
    }, [problemId]);

    const isSolved = isSolutionSolved(solution);
    const isJutge = isJutgeId(solution?.id, topicId);
    const jutgeUrl = isJutge ? `https://jutge.org/problems/${solution?.id}` : undefined;
    const canonicalTitle = solution ? getCanonicalTitle(solution.id, solution.title, topicId, courseStructure) : '';

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center pt-24 pb-20 px-4">
            <div className="flex flex-col items-center gap-4">
                <Spinner size="lg" variant="primary" />
                <p className="text-slate-400 text-sm">{t('solutionDetail.loadingSolution', 'Carregant solució...')}</p>
            </div>
        </div>
    );

    if (!solution) return (
        <div className="min-h-screen flex items-center justify-center pt-24 pb-20 px-4">
            <div className="text-center">
                <h2 className="text-xl font-bold text-white mb-2">{t('solutionDetail.notFound', 'Solució no trobada')}</h2>
                <Link to={`/tema/${topicId}/solucionaris`} className="text-slate-400 hover:text-white transition-colors">
                    {t('solutionDetail.backToList', 'Tornar a la llista')}
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 max-w-350 mx-auto flex flex-col relative z-10">
            {importError && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center justify-center gap-2">
                    <X size={16} />
                    <span>{t('solutionDetail.importErrorDesc', 'Hi ha hagut un problema de connexió i pot ser que alguns títols no es mostrin correctament.')}</span>
                </div>
            )}

            <SolutionHeader
                solution={solution}
                topicId={topicId || ''}
                authorData={authorData}
                prevSolution={prevSolution}
                nextSolution={nextSolution}
                jutgeUrl={jutgeUrl}
                canonicalTitle={canonicalTitle}
                isSolved={isSolved}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full items-start">
                <ProblemStatementPanel
                    solution={solution}
                    lang={lang}
                    setLang={setLang}
                />

                <SolutionEditorViewer
                    solution={solution}
                    user={user}
                    topicId={topicId || ''}
                    canonicalTitle={canonicalTitle}
                    jutgeUrl={jutgeUrl}
                    setSolution={setSolution}
                />
            </div>
        </div>
    );
};

export default SolutionDetailPage;
