import { useEffect, useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { m as motion } from 'framer-motion';
import { ArrowLeft, Search, Code2, X } from 'lucide-react';
import { useSolutions } from '../hooks/useSolutions';
import type { TopicDefinition } from '../content/data/courseStructure';
import NotebookLayout from '../components/layout/NotebookLayout';
import { useTranslation } from 'react-i18next';
import ProblemCard from '../components/solutions/ProblemCard';
import PdfDropdownMenu from '../components/solutions/PdfDropdownMenu';

const SolutionsListPage = () => {
    const { id: topicId } = useParams();
    const [searchQuery, setSearchQuery] = useState('');
    const { t, i18n } = useTranslation();
    const preferredLang = i18n.language;

    const [availablePdfs, setAvailablePdfs] = useState<{ ca: boolean; es: boolean }>({ ca: false, es: false });

    // 1. Get definitions for the current topic from our static structure
    const [topicDefinition, setTopicDefinition] = useState<TopicDefinition | undefined>(undefined);
    const [importError, setImportError] = useState(false);

    useEffect(() => {
        import('../content/data/courseStructure')
            .then(m => {
                setTopicDefinition(m.courseStructure.find((t: TopicDefinition) => t.id === topicId));
                setImportError(false);
            })
            .catch(e => {
                console.error(e);
                setImportError(true);
            });
    }, [topicId]);

    // We pass the explicit problem IDs so they are searched globally (not just constrained by topicId namespace)
    const predefinedProblemIds = useMemo(() => topicDefinition?.problems?.map(p => p.id) || [], [topicDefinition]);
    const { solutions: uploadedSolutions, loading } = useSolutions(topicId || '', predefinedProblemIds);

    // Create a map for O(1) lookups
    const uploadedSolutionsMap = useMemo(() => {
        const map = new Map();
        uploadedSolutions.forEach(s => map.set(s.id, s));
        return map;
    }, [uploadedSolutions]);

    // Scroll to top
    useEffect(() => {
        window.scrollTo(0, 0);
        document.body.style.overflow = 'auto';

        if (topicId) {
            const subject = topicId.split('-')[0];
            const checkPdfs = async () => {
                try {
                    const [caRes, esRes] = await Promise.all([
                        fetch(`/pdfs/solucionaris/${subject}/ca/solucionari-${topicId}.pdf`, { method: 'HEAD' }),
                        fetch(`/pdfs/solucionaris/${subject}/es/solucionari-${topicId}.pdf`, { method: 'HEAD' })
                    ]);

                    const isValidPdf = (res: Response) => {
                        return res.ok && res.headers.get('content-type')?.includes('application/pdf');
                    };

                    setAvailablePdfs({
                        ca: !!isValidPdf(caRes),
                        es: !!isValidPdf(esRes)
                    });
                } catch (e) {
                    console.error("Error comprovant PDFs de solucionaris", e);
                    setAvailablePdfs({ ca: false, es: false });
                }
            };
            checkPdfs();
        }
    }, [topicId]);

    // 2. M1 & M2 Special Layout Check
    if ((topicId?.startsWith('m1-') || topicId?.startsWith('m2-')) && topicDefinition) {
        return <NotebookLayout topic={topicDefinition} solutions={uploadedSolutions} loading={loading} />;
    }

    // 3. Error Fallback
    if (importError) {
        return (
            <div className="min-h-screen pt-24 pb-20 px-4 max-w-5xl mx-auto flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20">
                    <X size={32} className="text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{t('solutionsList.importError', 'Error al carregar el temari')}</h2>
                <p className="text-slate-400 mb-6">{t('solutionsList.importErrorDesc', 'Hi ha hagut un problema de connexió. Si us plau, recarrega la pàgina.')}</p>
                <button type="button" onClick={() => window.location.reload()} className="px-6 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-400 transition-colors">
                    {t('common.retry', "Reintentar")}
                </button>
            </div>
        );
    }

    // 2. Identify problems associated with this topic
    // problemsList is now an array of { id, title }
    const problemsList = topicDefinition?.problems || [];

    // Helper to check status
    const getProblemStatus = (problemId: string) => {
        // Check if we have a solution uploaded for this ID
        const solution = uploadedSolutionsMap.get(problemId);
        return solution ? { status: 'solved', solution } : { status: 'pending', solution: null };
    };

    // Filter based on search (Structure-based)
    const visibleProblems = problemsList.filter(problem => {
        const pId = problem.id;
        const pTitle = problem.title;

        return pId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            // Also search in uploaded solution title if we have one (legacy override)
            uploadedSolutionsMap.get(pId)?.title?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Fallback: If we rely on uploaded solutions (unstructured topics)
    const displaySolutionsFallback = problemsList.length === 0
        ? uploadedSolutions.filter(s => s.id.toLowerCase().includes(searchQuery.toLowerCase()) || s.title.toLowerCase().includes(searchQuery.toLowerCase()))
        : [];

    if (!topicDefinition && !loading && uploadedSolutions.length === 0) {
        return (
            <div className="min-h-screen pt-24 pb-20 px-4 max-w-5xl mx-auto flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-6 border border-white/5">
                    <Code2 size={32} className="text-slate-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{t('solutionsList.topicNotFound', 'Tema no trobat o buit')}</h2>
                <Link to="/" className="mt-4 px-6 py-2.5 bg-indigo-500 text-white rounded-xl font-medium hover:bg-indigo-400 transition-colors">
                    {t('common.backToHome', "Tornar a l'inici")}
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-12 md:pt-28 pb-20 px-4 max-w-6xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-12 relative"
            >
                <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group">
                    <ArrowLeft size={16} /> <span className="font-medium">{t('common.backToHome', "Tornar a l'Inici")}</span>
                </Link>

                <div className="flex flex-col md:flex-row md:items-stretch justify-between gap-8 mb-8 relative">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                            {(preferredLang === 'es' && topicDefinition?.title_es) ? topicDefinition.title_es : (topicDefinition?.title || t('solutionsList.title', 'Llista de Problemes'))}
                        </h1>
                        <p className="text-slate-400 text-lg max-w-4xl leading-relaxed opacity-70 font-medium">
                            {(preferredLang === 'es' && topicDefinition?.description_es) ? topicDefinition.description_es : (topicDefinition?.description || t('solutionsList.description', { defaultValue: `Col·lecció d'exercicis del tema {{topicId}}.`, topicId }))}
                        </p>
                    </div>

                    {/* PDF Large Square Button - Right Aligned */}
                    <PdfDropdownMenu topicId={topicId!} availablePdfs={availablePdfs} />
                    <div className="w-full lg:w-80">
                        <div className="relative flex items-center bg-slate-900 border border-white/10 rounded-xl px-4 py-3 focus-within:border-emerald-500/30 transition-colors">
                            <Search size={18} className="text-slate-500 mr-3" />
                            <input
                                type="text"
                                placeholder={t('solutionsList.searchPlaceholder', 'Buscar ID (P12345)...')}
                                className="bg-transparent border-none outline-none text-white w-full text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Problems List based on Structure */}
            {problemsList.length > 0 ? (
                loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-44 rounded-3xl bg-slate-800/20 border border-white/5 animate-pulse relative overflow-hidden">
                                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {visibleProblems.map((problem, index) => {
                            const { id: problemId } = problem;
                            const problemTitle = (preferredLang === 'es' && problem.title_es) ? problem.title_es : problem.title;
                            const { status, solution } = getProblemStatus(problemId);
                            const isSolved = status === 'solved';

                            return (
                                <ProblemCard
                                    key={problemId}
                                    problemId={problemId}
                                    topicId={topicId!}
                                    problemTitle={problemTitle}
                                    isSolved={isSolved}
                                    solutionTitle={solution?.title}
                                    index={index}
                                />
                            );
                        })}
                    </div>
                )
            ) : (
                /* Fallback for unstructured topics */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displaySolutionsFallback.length > 0 ? displaySolutionsFallback.map(sol => (
                        <motion.div key={sol.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <Link to={`/tema/${topicId}/solucionaris/${sol.id}`} className="block p-6 bg-slate-900 border border-white/10 rounded-2xl hover:border-emerald-500/50 transition-colors">
                                <h3 className="text-white font-bold">{sol.title}</h3>
                                <p className="text-emerald-400 text-sm">{sol.id}</p>
                            </Link>
                        </motion.div>
                    )) : (
                        <div className="col-span-full text-center py-20 text-slate-500">
                            <p>{t('solutionsList.noProblemsDefined', 'No hi ha problemes definits per a aquest tema.')}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SolutionsListPage;
