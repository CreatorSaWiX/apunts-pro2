import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, ChevronLeft, ChevronRight, CheckCircle, Loader, Edit, Save, X, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSolution, useSolutions } from '../hooks/useSolutions';
import CodeBlock from '../components/ui/CodeBlock';
import { useAuth } from '../contexts/AuthContext';
import { courseStructure } from '../content/data/courseStructure';
import CommentsSection from '../components/comments/CommentsSection';
import CodeEditor from '../components/ui/CodeEditor';

const SolutionDetailPage = () => {
    const { id: topicId, problemId } = useParams();
    const [lang, setLang] = useState('ca');
    const { solution, loading } = useSolution(topicId || '', problemId || '', lang);
    const { solutions } = useSolutions(topicId || '');
    const [authorData, setAuthorData] = useState<{ avatar?: string; username?: string; } | null>(null);

    // Edit logic
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [currentCode, setCurrentCode] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (solution) setCurrentCode(solution.code);
    }, [solution]);

    // Fetch author data
    useEffect(() => {
        const fetchAuthor = async () => {
            if (solution?.authorId) {
                try {
                    const { doc, getDoc } = await import('firebase/firestore');
                    const { db } = await import('../lib/firebase');
                    const userDoc = await getDoc(doc(db, 'users', solution.authorId));
                    if (userDoc.exists()) {
                        setAuthorData(userDoc.data());
                    }
                } catch (e) {
                    console.error("Error fetching author:", e);
                }
            }
        };
        fetchAuthor();
    }, [solution]);

    // Find prev/next
    const currentIndex = solutions.findIndex(s => s.id === problemId);
    const prevSolution = currentIndex > 0 ? solutions[currentIndex - 1] : null;
    const nextSolution = currentIndex !== -1 && currentIndex < solutions.length - 1 ? solutions[currentIndex + 1] : null;

    // Scroll to top
    useEffect(() => {
        window.scrollTo(0, 0);
        document.body.style.overflow = 'auto';
    }, [problemId]);

    const handleCopy = () => {
        if (!solution) return;
        navigator.clipboard.writeText(solution.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSave = async () => {
        if (!solution || !user) return;

        try {
            const { doc, setDoc } = await import('firebase/firestore');
            const { db } = await import('../lib/firebase');

            // Try to find the canonical title from courseStructure to avoid saving the ID as title
            let canonicalTitle = solution.title;
            if (topicId) {
                const topic = courseStructure.find(t => t.id === topicId);
                if (topic) {
                    const problemDef = topic.problems.find(p => (typeof p === 'string' ? p : p.id) === solution.id);
                    if (problemDef && typeof problemDef !== 'string') {
                        canonicalTitle = problemDef.title;
                    }
                }
            }

            // Construct solution data object
            const solutionData = {
                problemId: solution.id,
                topicId: topicId,
                title: canonicalTitle, // Use canonical title
                code: currentCode,
                authorId: user.id,
                authorName: user.username,
                language: 'cpp', // Default for now
                updatedAt: new Date().toISOString(),
                // Only set createdAt if it doesn't exist (handled by merge usually, but we overwrite here for simplicity of "latest version")
                statement: solution.statement || '' // Cache statement if available
            };

            // Save to Firestore (using problem ID as doc ID)
            await setDoc(doc(db, 'solutions', solution.id), solutionData, { merge: true });

            console.log("Solution saved successfully!", canonicalTitle);

            // Update local state to reflect saved changes immediately
            if (solution) {
                solution.code = currentCode;
                solution.title = canonicalTitle;
                solution.authorId = user.id;
                solution.author = user.username;
            }

            setIsEditing(false);
        } catch (error) {
            console.error("Error saving solution:", error);
            alert("Error al guardar la solució. Comprova la consola.");
        }
    };

    // Helper to check if it's a "real" solved solution
    const isSolved = solution && solution.authorId && !solution.code.includes('// Solució no disponible encara');

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center pt-24 pb-20 px-4">
            <div className="flex flex-col items-center gap-4">
                <Loader className="animate-spin text-sky-500" size={32} />
                <p className="text-slate-400 text-sm">Carregant solució...</p>
            </div>
        </div>
    );

    if (!solution) return (
        <div className="min-h-screen flex items-center justify-center pt-24 pb-20 px-4">
            <div className="text-center">
                <h2 className="text-xl font-bold text-white mb-2">Solució no trobada</h2>
                <Link to={`/tema/${topicId}/solucionaris`} className="text-slate-400 hover:text-white transition-colors">
                    Tornar a la llista
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 max-w-[1400px] mx-auto flex flex-col relative z-10">

            {/* Top Navigation Bar */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-between mb-8 pb-4 border-b border-white/5"
            >
                <div className="flex items-center gap-4">
                    <Link
                        to={`/tema/${topicId}/solucionaris`}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-800/50 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/5 hover:border-white/20"
                        title="Tornar a la llista"
                    >
                        <ArrowLeft size={18} />
                    </Link>

                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-emerald-400 font-bold tracking-tight text-lg">
                                {solution.id}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                            <h1 className="text-lg font-bold text-slate-200 truncate max-w-xs sm:max-w-md">
                                {(() => {
                                    // Try to resolve canonical title
                                    if (topicId) {
                                        const topic = courseStructure.find(t => t.id === topicId);
                                        const problemInfo = topic?.problems?.find(p =>
                                            typeof p === 'object' ? p.id === solution.id : p === solution.id
                                        );
                                        if (problemInfo && typeof problemInfo === 'object') {
                                            return problemInfo.title;
                                        }
                                    }
                                    // Fallback: If title equals ID, try to make it look better or just show it
                                    return solution.title === solution.id ? solution.title : solution.title;
                                })()}
                            </h1>
                            {isSolved && (
                                <div className="hidden sm:flex items-center gap-1 ml-2 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                                    <CheckCircle size={10} className="fill-current" />
                                    <span>Acceptat</span>
                                </div>
                            )}
                        </div>
                        {/* Author Info */}
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                            <span className="text-slate-500 mr-0.5">Autor:</span>
                            {solution.authorId ? (
                                <Link to={`/profile/${solution.authorId}`} className="flex items-center gap-2 hover:text-sky-400 transition-colors">
                                    {authorData?.avatar && <img src={authorData.avatar} className="w-5 h-5 rounded-full bg-slate-800 object-cover" />}
                                    {authorData?.username || solution.author || 'Anònim'}
                                </Link>
                            ) : (
                                <span className="flex items-center gap-2 text-slate-400 cursor-default">
                                    {solution.author || 'Anònim'}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Prev/Next Buttons */}
                <div className="flex items-center gap-2">
                    <Link
                        to={prevSolution ? `/tema/${topicId}/solucionaris/${prevSolution.id}` : '#'}
                        className={`p-2.5 rounded-lg border border-white/5 transition-all flex items-center gap-2 ${prevSolution
                            ? 'bg-slate-800/50 hover:bg-white/10 text-slate-400 hover:text-white hover:border-white/10'
                            : 'bg-transparent text-slate-800 border-transparent cursor-not-allowed hidden sm:flex'
                            }`}
                        title={prevSolution ? `Anterior: ${prevSolution.title}` : undefined}
                    >
                        <ChevronLeft size={18} />
                        <span className="text-sm font-medium hidden lg:inline">Anterior</span>
                    </Link>
                    <Link
                        to={nextSolution ? `/tema/${topicId}/solucionaris/${nextSolution.id}` : '#'}
                        className={`p-2.5 rounded-lg border border-white/5 transition-all flex items-center gap-2 ${nextSolution
                            ? 'bg-slate-800/50 hover:bg-white/10 text-slate-400 hover:text-white hover:border-white/10'
                            : 'bg-transparent text-slate-800 border-transparent cursor-not-allowed hidden sm:flex'
                            }`}
                        title={nextSolution ? `Següent: ${nextSolution.title}` : undefined}
                    >
                        <span className="text-sm font-medium hidden lg:inline">Següent</span>
                        <ChevronRight size={18} />
                    </Link>
                </div>
            </motion.div>

            {/* Split View Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full items-start">

                {/* Left Panel: Problem Statement */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="flex flex-col gap-6"
                >
                    <div className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden shadow-lg backdrop-blur-sm">
                        <div className="px-5 py-3 bg-white/5 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FileText size={16} className="text-indigo-400" />
                                <span className="text-sm font-medium text-slate-200">Enunciat</span>
                            </div>

                            {/* LANGUAGE SELECTOR */}
                            <div className="flex items-center gap-1 text-[10px] font-bold uppercase bg-black/20 p-1 rounded-lg">
                                {(solution.availableLanguages && solution.availableLanguages.length > 0
                                    ? solution.availableLanguages
                                    : ['ca', 'es', 'en']
                                ).map((l) => (
                                    <button
                                        key={l}
                                        onClick={() => setLang(l)}
                                        className={`px-2 py-1 rounded-md transition-all ${lang === l
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
                                <div dangerouslySetInnerHTML={{ __html: solution.statement }} className="jutge-content space-y-4" />
                            ) : (
                                <p className="italic text-slate-500">Enunciat no disponible.</p>
                            )}
                        </div>
                    </div>

                    <CommentsSection solutionId={solution.id} solutionTitle={solution.title} />
                </motion.div>

                {/* Right Panel: Code */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative lg:col-span-1 h-full flex flex-col"
                >
                    <div className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden shadow-lg flex-1 flex flex-col min-h-[500px] backdrop-blur-sm">
                        <div className="px-5 py-3 bg-white/5 border-b border-white/5 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-mono text-slate-400">{solution.id}.cpp</span>
                                <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">C++</span>
                            </div>

                            {/* EDIT CONTROLS */}
                            <div className="flex items-center gap-2">
                                {/* COPY BUTTON (Visible only when not editing) */}
                                {!isEditing && (
                                    <button
                                        onClick={handleCopy}
                                        className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors mr-2"
                                        title="Copiar codi"
                                    >
                                        {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                                    </button>
                                )}

                                {user && user.role === 'editor' && (
                                    <>
                                        {isEditing ? (
                                            <>
                                                <button
                                                    onClick={() => setIsEditing(false)}
                                                    className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                                    title="Cancel·lar"
                                                >
                                                    <X size={16} />
                                                </button>
                                                <button
                                                    onClick={handleSave}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
                                                >
                                                    <Save size={14} /> Guardar
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
                                            >
                                                <Edit size={14} /> Editar
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="relative flex-1 bg-transparent overflow-hidden">
                            {isEditing ? (
                                <CodeEditor
                                    value={currentCode}
                                    onChange={setCurrentCode}
                                    height="100%"
                                    className="bg-transparent h-full"
                                    variant="minimal"
                                />
                            ) : (
                                <CodeBlock
                                    code={solution.code}
                                    language="cpp"
                                    showHeader={false}
                                    className="!m-0 h-full !bg-transparent !p-0"
                                    variant="minimal"
                                />
                            )}
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default SolutionDetailPage;
