import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Check } from 'lucide-react';
import { SUBJECTS } from '../../config/subjects';

interface SubjectSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (subjectId: string) => void;
    selectedId?: string;
    allowAll?: boolean; // For filtering
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

    const colorClasses: Record<string, string> = {
        sky: 'bg-sky-500',
        violet: 'bg-violet-500',
        emerald: 'bg-emerald-500',
        slate: 'bg-slate-500',
        rose: 'bg-rose-500',
        amber: 'bg-amber-500',
        fuchsia: 'bg-fuchsia-500',
        cyan: 'bg-cyan-500',
        lime: 'bg-lime-500',
        orange: 'bg-orange-500',
        red: 'bg-red-500',
        purple: 'bg-purple-500',
        teal: 'bg-teal-500',
        yellow: 'bg-yellow-500',
        pink: 'bg-pink-500',
        indigo: 'bg-indigo-500',
        green: 'bg-green-500'
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100]"
                    />
                    <div className="fixed inset-0 pointer-events-none flex items-start justify-center pt-[15vh] px-4 z-[100]">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[60vh]"
                        >
                            <div className="p-4 border-b border-white/10 flex items-center gap-3">
                                <Search size={20} className="text-slate-500 shrink-0" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cerca per acrònim o nom sencer..."
                                    className="flex-1 bg-transparent border-none text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-0 text-lg"
                                />
                                <button onClick={onClose} className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                                    <X size={20} />
                                </button>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                                {allowAll && (
                                    <button
                                        onClick={() => { onSelect('all'); onClose(); }}
                                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${selectedId === 'all' ? 'bg-primary/20 text-white' : 'text-slate-300 hover:bg-white/5'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-white/10">
                                                <span className="text-xs font-black">ALL</span>
                                            </div>
                                            <div className="text-left">
                                                <div className="font-bold">Totes les assignatures</div>
                                                <div className="text-xs text-slate-500">Mostra tot el contingut</div>
                                            </div>
                                        </div>
                                        {selectedId === 'all' && <Check size={18} className="text-primary" />}
                                    </button>
                                )}

                                {filteredSubjects.length === 0 ? (
                                    <div className="py-10 text-center text-slate-500 text-sm">
                                        No s'ha trobat cap assignatura.
                                    </div>
                                ) : (
                                    filteredSubjects.map(subject => (
                                        <button
                                            key={subject.id}
                                            onClick={() => { onSelect(subject.id); onClose(); }}
                                            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${selectedId === subject.id ? 'bg-primary/20 text-white' : 'text-slate-300 hover:bg-white/5'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-white/10 ${colorClasses[subject.color] || 'bg-slate-800'}`}>
                                                    <span className="text-[10px] font-black text-white">{subject.label}</span>
                                                </div>
                                                <div className="text-left">
                                                    <div className="font-bold">{subject.label}</div>
                                                    <div className="text-xs text-slate-500 truncate max-w-[250px] sm:max-w-[300px]">{subject.description}</div>
                                                </div>
                                            </div>
                                            {selectedId === subject.id && <Check size={18} className="text-primary" />}
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
