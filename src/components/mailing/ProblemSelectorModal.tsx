import React, { useState, useEffect } from 'react';
import { Search, Layers, ChevronRight, Hash } from 'lucide-react';
import { courseStructure } from '../../content/data/courseStructure';
import Modal from '../ui/Modal';
import { useTranslation } from 'react-i18next';

interface Problem {
    id: string;
    title: string;
    topicId?: string;
    topicName?: string;
}

interface ProblemSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (problem: Problem) => void;
}

const ProblemSelectorModal: React.FC<ProblemSelectorModalProps> = ({ isOpen, onClose, onSelect }) => {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const [selectedTopicId, setSelectedTopicId] = useState<string>(courseStructure[0]?.id || '');
    const [results, setResults] = useState<Problem[]>([]);

    // Reset when opening
    useEffect(() => {
        if (isOpen) {
            setSearch('');
            setSelectedTopicId(courseStructure[0]?.id || '');
        }
    }, [isOpen]);

    // Filtering Logic
    useEffect(() => {
        let found: Problem[] = [];

        if (search.trim() !== '') {
            // Global Search
            const query = search.toLowerCase();
            courseStructure.forEach(topic => {
                topic.problems.forEach(p => {
                    const problemId = typeof p === 'string' ? p : p.id;
                    const problemTitle = typeof p === 'string' ? p : p.title;

                    if (problemId.toLowerCase().includes(query) || problemTitle.toLowerCase().includes(query)) {
                        found.push({
                            id: problemId,
                            title: problemTitle,
                            topicId: topic.id,
                            topicName: topic.title
                        });
                    }
                });
            });
            // Limit global search results
            setResults(found.slice(0, 20));
        } else {
            // Show problems for selected topic
            const topic = courseStructure.find(t => t.id === selectedTopicId);
            if (topic) {
                found = topic.problems.map(p => ({
                    id: typeof p === 'string' ? p : p.id,
                    title: typeof p === 'string' ? p : p.title,
                    topicId: topic.id,
                    topicName: topic.title
                }));
            }
            setResults(found);
        }
    }, [search, selectedTopicId]);

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="3xl" overlayVariant="transparent">
            <Modal.Layout className="flex-col">
                <Modal.Header>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-white tracking-tight">{t('mailing.problemSelector.title', 'Seleccionar Exercici')}</span>
                        <span className="text-xs text-slate-400 mt-1">{t('mailing.problemSelector.subtitle', 'Vincula un problema al teu missatge')}</span>
                    </div>
                </Modal.Header>

                {/* Search Bar */}
                <div className="p-4 border-b border-white/[0.08] bg-white/[0.02] shrink-0">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-400 transition-colors" size={18} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={t('mailing.problemSelector.searchPlaceholder', "Buscar per codi (P37500) o títol...")}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all font-medium"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Topic Tabs (Only visible if not searching) */}
                {search.trim() === '' && (
                    <div className="px-4 py-3 border-b border-white/[0.08] flex gap-2 overflow-x-auto custom-scrollbar bg-white/[0.02] shrink-0">
                        {courseStructure.map(topic => (
                            <button type="button"
                                key={topic.id}
                                onClick={() => setSelectedTopicId(topic.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${selectedTopicId === topic.id
                                    ? 'bg-sky-500/10 border-sky-500/30 text-sky-400'
                                    : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10 hover:text-slate-200'
                                    }`}
                            >
                                {topic.title}
                            </button>
                        ))}
                    </div>
                )}

                {/* Results List */}
                <Modal.Body className="bg-transparent">
                    {results.length > 0 ? (
                        <div className="grid grid-cols-1 gap-2">
                            {results.map((problem) => (
                                <button type="button"
                                    key={problem.id}
                                    onClick={() => onSelect(problem)}
                                    className="w-full text-left p-4 rounded-xl bg-slate-800/30 hover:bg-sky-500/10 border border-white/5 hover:border-sky-500/30 transition-all group flex items-center justify-between"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-xs font-bold text-slate-400 font-mono group-hover:text-sky-400 group-hover:border-sky-500/30 transition-colors">
                                            {problem.id.substring(0, 3)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-white font-medium group-hover:text-sky-200 transition-colors">{problem.title}</span>
                                                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/5 text-slate-500 border border-white/5 group-hover:border-sky-500/20 group-hover:bg-sky-500/10 group-hover:text-sky-400 transition-colors">
                                                    {problem.id}
                                                </span>
                                            </div>
                                            <div className="text-xs text-slate-500 flex items-center gap-1">
                                                <Layers size={10} />
                                                {problem.topicName || courseStructure.find(t => t.id === problem.topicId)?.title}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-500 opacity-0 group-hover:opacity-100 transition-all group-hover:bg-sky-500 group-hover:text-white transform group-hover:translate-x-0 translate-x-4">
                                        <ChevronRight size={16} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2 opacity-50 pt-10">
                            <Hash size={48} />
                            <p>{t('mailing.problemSelector.notFound', "No s'han trobat exercicis")}</p>
                        </div>
                    )}
                </Modal.Body>
            </Modal.Layout>
        </Modal>
    );
};

export default ProblemSelectorModal;
