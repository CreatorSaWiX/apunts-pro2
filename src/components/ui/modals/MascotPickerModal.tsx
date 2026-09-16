import React, { useState, useMemo, useCallback } from 'react';
import { Search, Shuffle, Check, X } from 'lucide-react';
import Modal from './Modal';
import { getAllMascots, getMascotUrl, type MascotLogo } from '../../../utils/avatar';
import { useTranslation } from 'react-i18next';

interface MascotPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (url: string, mascot: MascotLogo) => void;
    onReset?: () => void;
    currentUrl?: string;
    title?: string;
}

type CategoryKey = 'all' | 'animals' | 'nature' | 'objects' | 'symbols' | 'other';

const PAGE_SIZE = 72;

export const MascotPickerModal: React.FC<MascotPickerModalProps> = ({
    isOpen,
    onClose,
    onSelect,
    onReset,
    currentUrl,
    title
}) => {
    const { t } = useTranslation();
    const allMascots = useMemo(() => getAllMascots(), []);

    const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMascot, setSelectedMascot] = useState<MascotLogo | null>(null);
    const [displayLimit, setDisplayLimit] = useState(PAGE_SIZE);
    const [shuffleSeed, setShuffleSeed] = useState(0);

    // Categories with translated labels
    const categories: { key: CategoryKey; label: string }[] = useMemo(() => [
        { key: 'all', label: t('mascot.categories.all', 'Tots') },
        { key: 'animals', label: t('mascot.categories.animals', 'Animals') },
        { key: 'nature', label: t('mascot.categories.nature', 'Natura') },
        { key: 'objects', label: t('mascot.categories.objects', 'Objectes') },
        { key: 'symbols', label: t('mascot.categories.symbols', 'Símbols') },
        { key: 'other', label: t('mascot.categories.other', 'Altres') },
    ], [t]);

    // Filter and optionally shuffle
    const filteredMascots = useMemo(() => {
        let list = allMascots;

        if (selectedCategory !== 'all') {
            list = list.filter(m => m.cat === selectedCategory);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.trim().toLowerCase();
            list = list.filter(m => m.name.toLowerCase().includes(q));
        }

        if (shuffleSeed > 0) {
            // Deterministic pseudo-random shuffle using current seed
            list = [...list].sort((a, b) => {
                const ha = Math.sin(a.id + shuffleSeed) * 10000;
                const hb = Math.sin(b.id + shuffleSeed) * 10000;
                return (ha - Math.floor(ha)) - (hb - Math.floor(hb));
            });
        }

        return list;
    }, [allMascots, selectedCategory, searchQuery, shuffleSeed]);

    const visibleMascots = useMemo(() => {
        return filteredMascots.slice(0, displayLimit);
    }, [filteredMascots, displayLimit]);

    const handleShuffle = useCallback(() => {
        setShuffleSeed(prev => prev + 1);
        setDisplayLimit(PAGE_SIZE);
    }, []);

    const handleSelectCategory = (cat: CategoryKey) => {
        setSelectedCategory(cat);
        setDisplayLimit(PAGE_SIZE);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setDisplayLimit(PAGE_SIZE);
    };

    const handleConfirm = () => {
        if (selectedMascot) {
            onSelect(getMascotUrl(selectedMascot.key), selectedMascot);
            onClose();
        }
    };

    const handleDoubleClick = (mascot: MascotLogo) => {
        setSelectedMascot(mascot);
        onSelect(getMascotUrl(mascot.key), mascot);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="4xl"
        >
            <Modal.Header className="pb-4">
                <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                        {title || t('mascot.modal.title', 'Tria la teva Mascota')}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                        {t('mascot.modal.subtitle', 'Més de 3.400 mascotes originals lliures i optimitzades')}
                    </p>
                </div>

                {/* Search & Actions Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 mt-4">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder={t('mascot.search.placeholder', 'Cerca per nom (ex: cat, owl, robot, coffee)...')}
                            className="w-full pl-9 pr-8 py-2 text-sm rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 transition"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition"
                                title={t('mascot.search.clear', 'Netejar')}
                                aria-label={t('mascot.search.clear', 'Netejar')}
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={handleShuffle}
                        title={t('mascot.shuffle', 'Barallar')}
                        aria-label={t('mascot.shuffle', 'Barallar')}
                        className="flex items-center justify-center p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition active:scale-95 shrink-0"
                    >
                        <Shuffle size={16} className="text-white" />
                    </button>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto py-2 mt-2 custom-scrollbar">
                    {categories.map(cat => {
                        const count = cat.key === 'all'
                            ? allMascots.length
                            : allMascots.filter(m => m.cat === cat.key).length;
                        const isSelected = selectedCategory === cat.key;
                        return (
                            <button
                                key={cat.key}
                                onClick={() => handleSelectCategory(cat.key)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                                    isSelected
                                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                                        : 'bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10 border border-transparent'
                                }`}
                            >
                                <span>{cat.label}</span>
                                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-sky-500/30 text-sky-200' : 'bg-white/5 text-slate-500'}`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </Modal.Header>

            <Modal.Layout className="flex-col">
                <Modal.Body className="p-4 sm:p-6 custom-scrollbar">
                    {visibleMascots.length === 0 ? (
                        <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-3">
                                <Search size={22} className="text-slate-500" />
                            </div>
                            <p className="text-sm font-medium">{t('mascot.empty.title', 'No s\'ha trobat cap mascota')}</p>
                            <p className="text-xs text-slate-500 mt-1">{t('mascot.empty.subtitle', 'Prova amb una altra paraula o categoria')}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                            {visibleMascots.map(mascot => {
                                const url = getMascotUrl(mascot.key);
                                const isSelected = selectedMascot?.id === mascot.id || (selectedMascot === null && currentUrl === url);
                                return (
                                    <button
                                        key={mascot.id}
                                        type="button"
                                        onClick={() => setSelectedMascot(mascot)}
                                        onDoubleClick={() => handleDoubleClick(mascot)}
                                        title={mascot.name}
                                        className={`group relative aspect-square rounded-2xl overflow-hidden p-1 transition-all duration-200 focus:outline-none ${
                                            isSelected
                                                ? 'ring-2 ring-sky-400 ring-offset-2 ring-offset-slate-950/50 scale-102 shadow-lg shadow-sky-500/20'
                                                : 'border border-white/5 hover:border-white/20 hover:scale-105 bg-white/2'
                                        }`}
                                    >
                                        <img
                                            src={url}
                                            alt={mascot.name}
                                            loading="lazy"
                                            className="w-full h-full object-cover rounded-xl transition-transform duration-200 group-hover:scale-105"
                                        />
                                        {isSelected && (
                                            <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-md">
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                        )}
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-1 pt-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            <p className="text-[10px] text-white font-medium text-center truncate px-1">
                                                {mascot.name}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Load More Button */}
                    {visibleMascots.length < filteredMascots.length && (
                        <div className="flex justify-center mt-6">
                            <button
                                type="button"
                                onClick={() => setDisplayLimit(prev => prev + PAGE_SIZE)}
                                className="px-5 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition"
                            >
                                {t('mascot.loadMore', 'Carregar-ne més')} ({filteredMascots.length - visibleMascots.length} {t('mascot.remaining', 'restants')})
                            </button>
                        </div>
                    )}
                </Modal.Body>

                {/* Bottom Selection Bar */}
                <div className="p-4 sm:px-6 sm:py-3 border-t border-white/8 bg-white/2 backdrop-blur-md flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        {selectedMascot ? (
                            <>
                                <img
                                    src={getMascotUrl(selectedMascot.key)}
                                    alt={selectedMascot.name}
                                    className="w-10 h-10 rounded-xl object-cover border border-white/10 shrink-0"
                                />
                                <div className="min-w-0">
                                    <p className="text-xs text-slate-400 leading-none">{t('mascot.selected', 'Seleccionat:')}</p>
                                    <p className="text-sm font-bold text-white truncate mt-0.5">{selectedMascot.name}</p>
                                </div>
                            </>
                        ) : (
                            <p className="text-xs text-slate-500">
                                {t('mascot.hint', 'Fes clic sobre una mascota per seleccionar-la o doble clic per aplicar')}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {currentUrl && onReset && (
                            <button
                                type="button"
                                onClick={() => {
                                    onReset();
                                    onClose();
                                }}
                                className="px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition"
                            >
                                {t('settings.ai.removeAvatar', 'Restablir per defecte')}
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition"
                        >
                            {t('common.cancel', 'Cancel·lar')}
                        </button>
                        <button
                            type="button"
                            disabled={!selectedMascot}
                            onClick={handleConfirm}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-200 text-black shadow-md shadow-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition active:scale-95"
                        >
                            <Check size={14} className="text-black" />
                            <span>{t('mascot.apply', 'Aplicar avatar')}</span>
                        </button>
                    </div>
                </div>
            </Modal.Layout>
        </Modal>
    );
};

export default MascotPickerModal;
