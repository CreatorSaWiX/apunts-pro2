import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, Plus } from 'lucide-react';
import subjectsData from '../../../data/subjects.json';
import { useRoadmap } from '../../../contexts/RoadmapContext';
import { specializations } from '../../../data/curriculum';
import { motion, AnimatePresence } from 'framer-motion';

interface SubjectSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SubjectSearchModal: React.FC<SubjectSearchModalProps> = ({ isOpen, onClose }) => {
    const { nodes, addSubjectNode } = useRoadmap();
    const [searchQuery, setSearchQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    // Determine current specialization to highlight its complementary subjects
    const currentSpecNode = nodes.find(n => n.data.type === 'specialization');
    const currentSpec = useMemo(() => {
        if (!currentSpecNode) return null;
        return specializations.find(s => s.mandatory.includes(currentSpecNode.id));
    }, [currentSpecNode]);

    const availableSubjects = useMemo(() => {
        const existingIds = new Set(nodes.map(n => n.id));
        return subjectsData.filter((s: any) => !existingIds.has(s.name));
    }, [nodes]);

    const filteredSubjects = useMemo(() => {
        return availableSubjects.filter((s: any) => 
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            s.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [availableSubjects, searchQuery]);

    useEffect(() => {
        if (isOpen) {
            setSearchQuery('');
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Keyboard shortcut to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[120] flex items-start justify-center pt-[15vh] px-4">
                    {/* Deep Blur Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-slate-950/40 backdrop-blur-md"
                        onClick={onClose}
                    />

                    {/* Command Palette Modal */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="w-full max-w-2xl relative z-10"
                    >
                        <div className="bg-slate-900/70 backdrop-blur-3xl border border-white/10 rounded-[32px] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] flex flex-col max-h-[70vh]">
                            
                            {/* Inner Glow Line */}
                            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-400/30 to-transparent" />

                            {/* Search Header */}
                            <div className="p-4 border-b border-white/5 relative bg-white/[0.02]">
                                <div className="relative flex items-center">
                                    <Search className="absolute left-4 text-sky-400/70" size={24} strokeWidth={2.5} />
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        placeholder="Cerca assignatures..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-transparent border-none py-4 pl-14 pr-12 text-2xl font-semibold text-white placeholder-slate-500 focus:outline-none focus:ring-0"
                                        spellCheck={false}
                                    />
                                    <button 
                                        onClick={onClose}
                                        className="absolute right-4 p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-white"
                                    >
                                        <X size={20} strokeWidth={2.5} />
                                    </button>
                                </div>
                            </div>

                            {/* Results List */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                                {filteredSubjects.length === 0 ? (
                                    <div className="text-center py-16 text-slate-500 flex flex-col items-center">
                                        <div className="w-16 h-16 mb-4 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                            <Search size={24} className="text-slate-600" />
                                        </div>
                                        <p className="text-lg">No s'han trobat assignatures.</p>
                                    </div>
                                ) : (
                                    <motion.div 
                                        initial="hidden"
                                        animate="visible"
                                        variants={{
                                            hidden: { opacity: 0 },
                                            visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
                                        }}
                                        className="space-y-6"
                                    >
                                        {/* Complementary Section */}
                                        {currentSpec && filteredSubjects.some((s: any) => currentSpec.complementary.includes(s.name)) && (
                                            <div className="space-y-2">
                                                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-[0.2em] mb-3 px-3 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                                                    Complementàries de {currentSpec.name}
                                                </h3>
                                                {filteredSubjects
                                                    .filter((s: any) => currentSpec.complementary.includes(s.name))
                                                    .map((subject: any) => (
                                                        <motion.div 
                                                            key={subject.id}
                                                            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                                                            className="flex items-center justify-between p-4 rounded-2xl border border-indigo-500/10 bg-indigo-500/[0.03] hover:bg-indigo-500/10 transition-colors group cursor-pointer"
                                                            onClick={() => {
                                                                addSubjectNode(subject.name, 'optional');
                                                                onClose();
                                                            }}
                                                        >
                                                            <div>
                                                                <div className="flex items-center gap-3">
                                                                    <span className="font-bold text-sky-300 text-lg">{subject.name}</span>
                                                                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-widest border border-indigo-500/30">
                                                                        Complementària
                                                                    </span>
                                                                </div>
                                                                <div className="text-sm text-slate-400 mt-1.5 line-clamp-1">{subject.description}</div>
                                                            </div>
                                                            <div className="p-3 bg-white/5 text-slate-400 group-hover:bg-indigo-500 group-hover:text-white rounded-xl transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100">
                                                                <Plus size={20} />
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                            </div>
                                        )}

                                        {/* Rest of Optionals Section */}
                                        <div className="space-y-2">
                                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 px-3">
                                                Altres Optatives de Facultat
                                            </h3>
                                            {filteredSubjects
                                                .filter((s: any) => !currentSpec?.complementary.includes(s.name))
                                                .map((subject: any) => (
                                                    <motion.div 
                                                        key={subject.id}
                                                        variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                                                        className="flex items-center justify-between p-4 rounded-2xl border border-transparent hover:border-white/10 bg-transparent hover:bg-white/5 transition-all group cursor-pointer"
                                                        onClick={() => {
                                                            addSubjectNode(subject.name, 'optional');
                                                            onClose();
                                                        }}
                                                    >
                                                        <div>
                                                            <div className="flex items-center gap-3">
                                                                <span className="font-bold text-sky-100 text-lg group-hover:text-sky-300 transition-colors">{subject.name}</span>
                                                            </div>
                                                            <div className="text-sm text-slate-400 mt-1.5 line-clamp-1">{subject.description}</div>
                                                        </div>
                                                        <div className="p-3 bg-white/5 text-slate-400 group-hover:bg-sky-500 group-hover:text-slate-950 rounded-xl transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 shadow-[0_0_20px_rgba(14,165,233,0.3)]">
                                                            <Plus size={20} strokeWidth={2.5} />
                                                        </div>
                                                    </motion.div>
                                                ))}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SubjectSearchModal;
