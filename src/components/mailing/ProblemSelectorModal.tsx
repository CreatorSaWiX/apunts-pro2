import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Search, Layers, ChevronRight, Hash, Database } from 'lucide-react';
import { courseStructure } from '../../content/data/courseStructure';

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
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-[#0f172a] border border-white/10 rounded-2xl w-full max-w-2xl h-[80vh] shadow-2xl relative flex flex-col ring-1 ring-white/5 overflow-hidden"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/5 bg-slate-900/50 flex justify-between items-center shrink-0">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Database size={20} className="text-sky-400" />
                            Seleccionar Exercici
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">Vincula un problema al teu missatge</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="p-4 border-b border-white/5 bg-slate-900/30 shrink-0">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-400 transition-colors" size={18} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar per codi (P37500) o títol..."
                            className="w-full bg-slate-900/80 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all font-medium"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Topic Tabs (Only visible if not searching) */}
                {search.trim() === '' && (
                    <div className="px-4 py-3 border-b border-white/5 flex gap-2 overflow-x-auto custom-scrollbar bg-slate-900/20 shrink-0">
                        {courseStructure.map(topic => (
                            <button
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
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-[#0f172a]">
                    {results.length > 0 ? (
                        <div className="grid grid-cols-1 gap-2">
                            {results.map((problem) => (
                                <button
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
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2 opacity-50">
                            <Hash size={48} />
                            <p>No s'han trobat exercicis</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ProblemSelectorModal;
