import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Plus, Zap } from 'lucide-react';
import subjectsData from '../../../data/subjects.json';
import { useRoadmap } from '../../../contexts/RoadmapContext';
import { specializations } from '../../../data/curriculum';
import { motion } from 'framer-motion';
import Modal from '../../ui/Modal';

interface SubjectSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CATEGORIES = [
    { id: 'all', label: 'Totes' },
    { id: 'comp', label: 'Complementàries', icon: <Zap size={14} className="text-amber-400" /> },
    { id: 'C', label: 'Computació' },
    { id: 'ES', label: 'Enginyeria del Software' },
    { id: 'EC', label: 'Enginyeria de Computadors' },
    { id: 'SI', label: 'Sistemes d\'Informació' },
    { id: 'TI', label: 'Tecnologies de la Informació' },
    { id: 'altres', label: 'Transversals' }
];

const SubjectSearchModal: React.FC<SubjectSearchModalProps> = ({ isOpen, onClose }) => {
    const { nodes, addSubjectNode } = useRoadmap();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const inputRef = useRef<HTMLInputElement>(null);

    // Determine current specialization to highlight its complementary subjects
    const currentSpecNode = nodes.find(n => n.data.type === 'specialization');
    const currentSpec = useMemo(() => {
        if (!currentSpecNode) return null;
        return specializations.find(s => s.mandatory.includes(currentSpecNode.id));
    }, [currentSpecNode]);

    // Available subjects that are not in the graph yet
    const availableSubjects = useMemo(() => {
        const existingIds = new Set(nodes.map(n => n.id));
        return subjectsData.filter((s: any) => !existingIds.has(s.name));
    }, [nodes]);

    // Attach tags (specializations) to each subject
    const subjectsWithTags = useMemo(() => {
        return availableSubjects.map((s: any) => {
            const specs = specializations.filter(spec => 
                spec.mandatory.includes(s.name) || spec.complementary.includes(s.name)
            );
            return { ...s, specs };
        });
    }, [availableSubjects]);

    const filteredSubjects = useMemo(() => {
        let result = subjectsWithTags.filter((s: any) => 
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            s.description.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (activeFilter !== 'all') {
            if (activeFilter === 'comp') {
                if (currentSpec) {
                    result = result.filter(s => currentSpec.complementary.includes(s.name));
                }
            } else if (activeFilter === 'altres') {
                result = result.filter(s => s.specs.length === 0);
            } else {
                result = result.filter(s => s.specs.some((spec: any) => spec.id === activeFilter));
            }
        }

        return result;
    }, [subjectsWithTags, searchQuery, activeFilter, currentSpec]);

    useEffect(() => {
        if (isOpen) {
            setSearchQuery('');
            setActiveFilter(currentSpec ? 'comp' : 'all');
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen, currentSpec]);

    // Keyboard shortcut to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Adjust categories to show 'comp' only if a spec is selected, and hide the spec itself to avoid redundancy
    const visibleCategories = CATEGORIES.filter(c => {
        if (c.id === 'comp' && !currentSpec) return false;
        if (currentSpec && c.id === currentSpec.id) return false;
        return true;
    });

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl" overlayVariant="transparent">
            <Modal.Layout className="flex-col h-full w-full">
                {/* Inner Glow Line */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-400/40 to-transparent z-50 pointer-events-none" />

                <Modal.Header>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-white tracking-tight">Buscar Assignatura</span>
                    </div>
                </Modal.Header>

                {/* Search Bar */}
                <div className="p-4 border-b border-white/[0.08] bg-white/[0.02] shrink-0">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-400 transition-colors" size={18} />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Busca per nom o codi..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all font-medium"
                            spellCheck={false}
                        />
                    </div>
                </div>

                <div className="px-4 py-4 border-b border-white/[0.08] flex gap-2 overflow-x-auto custom-scrollbar bg-white/[0.02] shrink-0">
                    <div className="bg-[#0F172A]/80 backdrop-blur-[40px] p-1.5 rounded-full border border-white/[0.12] flex items-center shrink-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_10px_40px_rgba(0,0,0,0.5)]">
                        {visibleCategories.map(cat => {
                            const isActive = activeFilter === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveFilter(cat.id)}
                                    className={`relative px-4 py-2 text-sm font-bold whitespace-nowrap transition-all duration-300 flex items-center gap-2 rounded-full ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="search-nav-active"
                                            className="absolute inset-0 bg-white/[0.12] border border-white/[0.15] rounded-full z-[-1] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_0_20px_rgba(255,255,255,0.1),0_0_8px_rgba(255,255,255,0.05)]"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        >
                                            <div className="absolute inset-x-2 -bottom-px h-px bg-gradient-to-r from-transparent via-white/50 to-transparent blur-[1px]" />
                                        </motion.div>
                                    )}
                                    <span className="relative z-10 flex items-center gap-2">
                                        {cat.icon && cat.icon}
                                        {cat.label}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                <Modal.Body className="!p-6 bg-transparent custom-scrollbar">
                                {filteredSubjects.length === 0 ? (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-20 text-slate-500 flex flex-col items-center justify-center h-full"
                                    >
                                        <div className="relative mb-6">
                                            <div className="absolute inset-0 bg-sky-500/20 blur-2xl rounded-full" />
                                            <div className="w-20 h-20 rounded-3xl bg-slate-800/50 flex items-center justify-center border border-white/10 relative z-10 shadow-2xl">
                                                <Search size={32} className="text-sky-400/80" />
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">No hem trobat res</h3>
                                        <p className="text-lg text-slate-400">Intenta buscar amb una altra paraula o canvia de filtre.</p>
                                    </motion.div>
                                ) : (
                                    <motion.div 
                                        initial="hidden"
                                        animate="visible"
                                        variants={{
                                            hidden: { opacity: 0 },
                                            visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
                                        }}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                    >
                                        {filteredSubjects.map((subject: any) => {
                                            const isComplementary = currentSpec && currentSpec.complementary.includes(subject.name);
                                            
                                            return (
                                                <motion.div 
                                                    key={subject.id}
                                                    variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                                                    className={`relative overflow-hidden p-5 rounded-2xl border transition-all duration-300 group cursor-pointer flex flex-col
                                                        ${isComplementary 
                                                            ? 'border-amber-500/20 bg-amber-500/[0.03] hover:bg-amber-500/[0.06] hover:border-amber-500/40 hover:shadow-[0_8px_30px_rgba(245,158,11,0.1)]' 
                                                            : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-sky-500/30 hover:shadow-[0_8px_30px_rgba(14,165,233,0.1)]'
                                                        }
                                                    `}
                                                    onClick={() => {
                                                        addSubjectNode(subject.name, 'optional');
                                                        onClose();
                                                    }}
                                                >
                                                    {/* Hover glow effect */}
                                                    <div className={`absolute -inset-20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none
                                                        ${isComplementary ? 'bg-amber-500/10' : 'bg-sky-500/10'}
                                                    `} />

                                                    <div className="relative z-10 flex flex-col h-full">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div className="flex items-center gap-3">
                                                                <span className={`font-black text-2xl tracking-tight ${isComplementary ? 'text-amber-400' : 'text-sky-300'}`}>
                                                                    {subject.name}
                                                                </span>
                                                                {isComplementary && (
                                                                    <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 text-[10px] font-bold uppercase tracking-widest border border-amber-500/20 flex items-center gap-1">
                                                                        <Zap size={10} /> Rec
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className={`p-2.5 rounded-xl transition-all duration-300 transform scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100
                                                                ${isComplementary ? 'bg-amber-500 text-amber-950' : 'bg-sky-500 text-sky-950'}
                                                            `}>
                                                                <Plus size={20} strokeWidth={3} />
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="text-slate-300 font-medium mb-4 flex-1">{subject.description}</div>
                                                        
                                                        {subject.specs.length > 0 ? (
                                                            <div className="flex flex-wrap gap-2 mt-auto">
                                                                {subject.specs.slice(0, 3).map((spec: any) => (
                                                                    <span key={spec.id} className="text-[10px] font-bold text-slate-400 bg-slate-800/50 px-2 py-1 rounded-md border border-white/5">
                                                                        {spec.name}
                                                                    </span>
                                                                ))}
                                                                {subject.specs.length > 3 && (
                                                                    <span className="text-[10px] font-bold text-slate-500 bg-slate-800/30 px-2 py-1 rounded-md">
                                                                        +{subject.specs.length - 3} més
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-wrap gap-2 mt-auto">
                                                                <span className="text-[10px] font-bold text-slate-500 bg-slate-800/30 px-2 py-1 rounded-md border border-white/5">
                                                                    Transversal
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )
                                        })}
                                    </motion.div>
                                )}
                </Modal.Body>
            </Modal.Layout>
        </Modal>
    );
};

export default SubjectSearchModal;
