import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Check } from 'lucide-react';
import { SUBJECTS } from '../../config/subjects';

interface SubjectSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (subjectId: string) => void;
    selectedId?: string;
    allowAll?: boolean;
}

const SubjectSelectorModal = ({ isOpen, onClose, onSelect, selectedId, allowAll = false }: SubjectSelectorModalProps) => {
    const [search, setSearch] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setSearch('');
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const filteredSubjects = useMemo(() => {
        const query = search.toLowerCase();
        let filtered = SUBJECTS;
        if (query) {
            filtered = SUBJECTS.filter(s => 
                s.label.toLowerCase().includes(query) || 
                s.description.toLowerCase().includes(query)
            );
        }
        return filtered;
    }, [search]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-[#050505]/80 backdrop-blur-md z-[100]"
                    />
                    <div className="fixed inset-0 pointer-events-none flex items-start justify-center pt-[15vh] px-4 z-[100]">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[2rem] shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden pointer-events-auto flex flex-col max-h-[60vh]"
                        >
                            <div className="px-6 py-5 border-b border-white/5 flex items-center gap-4 bg-white/[0.02]">
                                <Search size={20} className="text-slate-500 shrink-0" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cerca per acrònim o nom sencer..."
                                    className="flex-1 bg-transparent border-none text-white placeholder:text-slate-500 focus:outline-none focus:ring-0 text-base"
                                />
                                <button onClick={onClose} className="p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-full transition-all bg-white/5">
                                    <X size={16} />
                                </button>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col gap-2">
                                {allowAll && (
                                    <button
                                        onClick={() => { onSelect('all'); onClose(); }}
                                        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${selectedId === 'all' ? 'bg-white/10 border-white/20' : 'border-transparent hover:bg-white/5'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-black/50 flex items-center justify-center shrink-0 border border-white/5">
                                                <span className="text-[10px] font-black text-white">ALL</span>
                                            </div>
                                            <div className="text-left">
                                                <div className="font-bold text-white">Descobrir Tot</div>
                                                <div className="text-xs text-slate-500">Mostra tot el contingut de la comunitat</div>
                                            </div>
                                        </div>
                                        {selectedId === 'all' && <Check size={18} className="text-white" />}
                                    </button>
                                )}

                                {filteredSubjects.length === 0 ? (
                                    <div className="py-12 text-center text-slate-500 text-sm font-medium">
                                        No s'ha trobat cap assignatura.
                                    </div>
                                ) : (
                                    filteredSubjects.map(subject => (
                                        <button
                                            key={subject.id}
                                            onClick={() => { onSelect(subject.id); onClose(); }}
                                            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${selectedId === subject.id ? 'bg-white/10 border-white/20 shadow-inner' : 'border-transparent hover:bg-white/5'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-black/50 flex items-center justify-center shrink-0 border border-white/5 relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-white/5" />
                                                    <span className="text-[11px] font-black text-white relative z-10">{subject.label}</span>
                                                </div>
                                                <div className="text-left">
                                                    <div className={`font-bold transition-colors ${selectedId === subject.id ? 'text-white' : 'text-slate-300'}`}>{subject.label}</div>
                                                    <div className="text-xs text-slate-500 truncate max-w-[200px] sm:max-w-[280px]">{subject.description}</div>
                                                </div>
                                            </div>
                                            {selectedId === subject.id && <Check size={18} className="text-white" />}
                                        </button>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default SubjectSelectorModal;
