import { useState, useMemo, useEffect, useRef, memo, useCallback } from 'react';
import Modal from '../ui/modals/Modal';
import { Search, Check, X } from 'lucide-react';
import { SUBJECTS, type SubjectConfig } from '../../config/subjects';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { tailwindColors } from '../../stores/useSubjectStore';
import { useTranslation } from 'react-i18next';

interface SubjectSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (subjectId: string) => void;
    selectedId?: string;
    allowAll?: boolean;
    allowNone?: boolean;
}

const normalizeText = (text: string): string => {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
};

interface SubjectOptionItemProps {
    subject: SubjectConfig;
    isSelected: boolean;
    colorFamily: string;
    onSelect: (id: string) => void;
}

const SubjectOptionItem = memo(({ subject, isSelected, colorFamily, onSelect }: SubjectOptionItemProps) => {
    const theme = tailwindColors[colorFamily] || tailwindColors['slate'];

    return (
        <button
            type="button"
            role="option"
            aria-selected={isSelected}
            onClick={() => onSelect(subject.id)}
            className={`w-full flex items-center justify-between p-4 rounded-2xl transition border text-left ${
                isSelected ? 'bg-white/10 border-white/20 shadow-inner' : 'border-transparent hover:bg-white/5'
            }`}
        >
            <div className="flex items-center gap-4 min-w-0">
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
                <div className="min-w-0">
                    <div className={`font-bold transition-colors truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {subject.label}
                    </div>
                    <div className="text-xs text-slate-500 truncate max-w-[200px] sm:max-w-70">
                        {subject.description}
                    </div>
                </div>
            </div>
            {isSelected && <Check size={18} className="text-white shrink-0 ml-2" />}
        </button>
    );
});
SubjectOptionItem.displayName = 'SubjectOptionItem';

const SubjectSelectorModal = ({
    isOpen,
    onClose,
    onSelect,
    selectedId,
    allowAll = false,
    allowNone = false
}: SubjectSelectorModalProps) => {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const { customSubjectColors } = useSettingsStore();

    useEffect(() => {
        if (isOpen) {
            setSearch('');
            const timer = setTimeout(() => inputRef.current?.focus(), 100);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const filteredSubjects = useMemo(() => {
        const query = normalizeText(search);
        if (!query) return SUBJECTS;

        return SUBJECTS.filter(s => {
            const labelNorm = normalizeText(s.label);
            const descNorm = normalizeText(s.description);
            return labelNorm.includes(query) || descNorm.includes(query);
        });
    }, [search]);

    const handleSelect = useCallback((id: string) => {
        onSelect(id);
        onClose();
    }, [onSelect, onClose]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && filteredSubjects.length > 0) {
            e.preventDefault();
            handleSelect(filteredSubjects[0].id);
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <Modal.Header className="flex items-center gap-3 py-3.5 px-4 sm:px-6">
                <Search size={20} className="text-slate-400 shrink-0" />
                <input
                    ref={inputRef}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t('community.subjectSelector.searchPlaceholder', "Cerca per acrònim o nom sencer...")}
                    aria-label={t('community.subjectSelector.searchPlaceholder', "Cerca per acrònim o nom sencer...")}
                    className="flex-1 bg-transparent border-none text-white placeholder:text-slate-500 focus:outline-none focus:ring-0 text-base"
                />
                {search.length > 0 && (
                    <button
                        type="button"
                        onClick={() => {
                            setSearch('');
                            inputRef.current?.focus();
                        }}
                        aria-label={t('common.clear', 'Netejar')}
                        className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors shrink-0"
                    >
                        <X size={16} />
                    </button>
                )}
            </Modal.Header>

            <Modal.Body className="p-4 flex flex-col gap-2 max-h-[60vh] overflow-y-auto custom-scrollbar" role="listbox">
                {allowAll && (
                    <button
                        type="button"
                        role="option"
                        aria-selected={selectedId === 'all'}
                        onClick={() => handleSelect('all')}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl transition border text-left ${
                            selectedId === 'all' ? 'bg-white/10 border-white/20' : 'border-transparent hover:bg-white/5'
                        }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-black/50 flex items-center justify-center shrink-0 border border-white/5">
                                <span className="text-[10px] font-black text-white">ALL</span>
                            </div>
                            <div>
                                <div className="font-bold text-white">
                                    {t('community.subjectSelector.discoverAll', 'Descobrir Tot')}
                                </div>
                                <div className="text-xs text-slate-500">
                                    {t('community.subjectSelector.discoverAllDesc', 'Mostra tot el contingut de la comunitat')}
                                </div>
                            </div>
                        </div>
                        {selectedId === 'all' && <Check size={18} className="text-white shrink-0 ml-2" />}
                    </button>
                )}

                {allowNone && (
                    <button
                        type="button"
                        role="option"
                        aria-selected={!selectedId || selectedId === ''}
                        onClick={() => handleSelect('')}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl transition border text-left ${
                            !selectedId || selectedId === '' ? 'bg-white/10 border-white/20 shadow-inner' : 'border-transparent hover:bg-white/5'
                        }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-black/50 flex items-center justify-center shrink-0 border border-white/5 relative overflow-hidden">
                                <div className="absolute inset-0 bg-white/5" />
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-500 relative z-10" />
                            </div>
                            <div>
                                <div className={`font-bold transition-colors ${!selectedId || selectedId === '' ? 'text-white' : 'text-slate-300'}`}>
                                    {t('community.subjectSelector.noSubject', 'Sense assignatura')}
                                </div>
                                <div className="text-xs text-slate-500">
                                    {t('community.subjectSelector.noSubjectDesc', 'Publicació general de la comunitat')}
                                </div>
                            </div>
                        </div>
                        {(!selectedId || selectedId === '') && <Check size={18} className="text-white shrink-0 ml-2" />}
                    </button>
                )}

                {filteredSubjects.length === 0 ? (
                    <div className="py-12 text-center text-slate-500 text-sm font-medium">
                        {t('community.subjectSelector.notFound', "No s'ha trobat cap assignatura.")}
                    </div>
                ) : (
                    filteredSubjects.map(subject => {
                        const colorFamily = customSubjectColors[subject.label] || subject.color;
                        return (
                            <SubjectOptionItem
                                key={subject.id}
                                subject={subject}
                                isSelected={selectedId === subject.id}
                                colorFamily={colorFamily}
                                onSelect={handleSelect}
                            />
                        );
                    })
                )}
            </Modal.Body>
        </Modal>
    );
};

export default memo(SubjectSelectorModal);
