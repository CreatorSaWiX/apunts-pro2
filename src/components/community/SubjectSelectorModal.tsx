import { useState, useMemo, useEffect, useRef } from 'react';
import Modal from '../ui/Modal';
import { Search, Check } from 'lucide-react';
import { SUBJECTS } from '../../config/subjects';
import { useSettings } from '../../contexts/SettingsContext';
import { tailwindColors } from '../../contexts/SubjectContext';

interface SubjectSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (subjectId: string) => void;
    selectedId?: string;
    allowAll?: boolean;
    allowNone?: boolean;
}

const SubjectSelectorModal = ({ isOpen, onClose, onSelect, selectedId, allowAll = false, allowNone = false }: SubjectSelectorModalProps) => {
    const [search, setSearch] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const { customSubjectColors } = useSettings();

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
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <Modal.Header className="flex items-center gap-4 py-4 pr-12">
                <Search size={20} className="text-slate-500 shrink-0" />
                <input
                    ref={inputRef}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cerca per acrònim o nom sencer..."
                    className="flex-1 bg-transparent border-none text-white placeholder:text-slate-500 focus:outline-none focus:ring-0 text-base"
                />
            </Modal.Header>
            
            <Modal.Body className="p-4 flex flex-col gap-2">
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

                                {allowNone && (
                                    <button
                                        onClick={() => { onSelect(''); onClose(); }}
                                        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${!selectedId || selectedId === '' ? 'bg-white/10 border-white/20 shadow-inner' : 'border-transparent hover:bg-white/5'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-black/50 flex items-center justify-center shrink-0 border border-white/5 relative overflow-hidden">
                                                <div className="absolute inset-0 bg-white/5" />
                                                <div className="w-2.5 h-2.5 rounded-full bg-slate-500 relative z-10" />
                                            </div>
                                            <div className="text-left">
                                                <div className={`font-bold transition-colors ${!selectedId || selectedId === '' ? 'text-white' : 'text-slate-300'}`}>Sense assignatura</div>
                                                <div className="text-xs text-slate-500">Publicació general de la comunitat</div>
                                            </div>
                                        </div>
                                        {(!selectedId || selectedId === '') && <Check size={18} className="text-white" />}
                                    </button>
                                )}

                                {filteredSubjects.length === 0 ? (
                                    <div className="py-12 text-center text-slate-500 text-sm font-medium">
                                        No s'ha trobat cap assignatura.
                                    </div>
                                ) : (
                                    filteredSubjects.map(subject => {
                                        const colorFamily = customSubjectColors[subject.label] || subject.color;
                                        const theme = tailwindColors[colorFamily] || tailwindColors['slate'];
                                        
                                        return (
                                        <button
                                            key={subject.id}
                                            onClick={() => { onSelect(subject.id); onClose(); }}
                                            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${selectedId === subject.id ? 'bg-white/10 border-white/20 shadow-inner' : 'border-transparent hover:bg-white/5'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div 
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border relative overflow-hidden"
                                                    style={{ 
                                                        backgroundColor: `rgba(${theme.primary_rgb}, 0.1)`, 
                                                        borderColor: `rgba(${theme.primary_rgb}, 0.2)` 
                                                    }}
                                                >
                                                    <span 
                                                        className="text-[11px] font-black relative z-10"
                                                        style={{ color: theme.accent || theme.primary }}
                                                    >
                                                        {subject.label}
                                                    </span>
                                                </div>
                                                <div className="text-left">
                                                    <div className={`font-bold transition-colors ${selectedId === subject.id ? 'text-white' : 'text-slate-300'}`}>{subject.label}</div>
                                                    <div className="text-xs text-slate-500 truncate max-w-[200px] sm:max-w-[280px]">{subject.description}</div>
                                                </div>
                                            </div>
                                            {selectedId === subject.id && <Check size={18} className="text-white" />}
                                        </button>
                                        );
                                    })
                                )}
            </Modal.Body>
        </Modal>
    );
};

export default SubjectSelectorModal;
