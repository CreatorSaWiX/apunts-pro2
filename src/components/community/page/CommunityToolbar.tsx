import { useState, useRef, useEffect, memo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Search, FileText as FileTextIcon, BookOpen, X, Filter, ArrowUpDown, Flame, Eye, Clock, Image, Code2, Heart } from 'lucide-react';
import { LiquidToolbar, LiquidToolbarButton } from '../../ui/glass/LiquidToolbar';
import LiquidDropdown from '../../ui/glass/LiquidDropdown';

export type FilterType = 'all' | 'pdf' | 'image' | 'code';
export type SortByType = 'recent' | 'popular' | 'views' | 'liked';

/* ==========================================================================
   Configuració estàtica d'opcions de filtratge i ordenació
   ========================================================================== */

interface FilterOption {
    id: FilterType;
    labelKey: string;
    defaultLabel: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
}

interface SortOption {
    id: SortByType;
    labelKey: string;
    defaultLabel: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
}

const FILTER_OPTIONS: FilterOption[] = [
    { id: 'all', labelKey: 'community.filterAll', defaultLabel: 'Tots els recursos', icon: BookOpen },
    { id: 'pdf', labelKey: 'community.filterPdf', defaultLabel: 'Documents PDF', icon: FileTextIcon },
    { id: 'image', labelKey: 'community.filterImage', defaultLabel: 'Imatges / Fotos', icon: Image },
    { id: 'code', labelKey: 'community.filterCode', defaultLabel: 'Codi Font', icon: Code2 },
];

const SORT_OPTIONS: SortOption[] = [
    { id: 'recent', labelKey: 'community.sortRecent', defaultLabel: 'Més recents', icon: Clock },
    { id: 'popular', labelKey: 'community.sortPopular', defaultLabel: 'Més populars', icon: Flame },
    { id: 'views', labelKey: 'community.sortViews', defaultLabel: 'Més vistos', icon: Eye },
    { id: 'liked', labelKey: 'community.sortLiked', defaultLabel: "Els meus m'agrada", icon: Heart },
];

/* ==========================================================================
   Component CommunityToolbar
   ========================================================================== */

interface Props {
    activeSubject: string;
    filterType: FilterType;
    sortBy: SortByType;
    searchQuery: string;
    setShowSubjectFilter: (show: boolean) => void;
    setFilterType: (type: FilterType) => void;
    setSortBy: (sort: SortByType) => void;
    setSearchQuery: (query: string) => void;
}

const CommunityToolbar = memo(({
    activeSubject,
    filterType,
    sortBy,
    searchQuery,
    setShowSubjectFilter,
    setFilterType,
    setSortBy,
    setSearchQuery
}: Props) => {
    const { t } = useTranslation();
    const toolbarRef = useRef<HTMLDivElement>(null);
    const [showTypeDropdown, setShowTypeDropdown] = useState(false);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Tancar desplegables en fer clic a fora o prémer Escape
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
                setShowTypeDropdown(false);
                setShowSortDropdown(false);
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setShowTypeDropdown(false);
                setShowSortDropdown(false);
                if (isSearchOpen && !searchQuery) {
                    setIsSearchOpen(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isSearchOpen, searchQuery]);

    // Etiqueta del filtre actiu
    const activeFilterLabel = filterType === 'all'
        ? t('community.allTypes', 'Tipus')
        : filterType === 'pdf'
            ? 'PDF'
            : filterType === 'image'
                ? t('community.filterImageShort', 'Imatges')
                : t('community.filterCodeShort', 'Codi');

    // Etiqueta de l'ordenació activa
    const activeSortOption = SORT_OPTIONS.find(s => s.id === sortBy);
    const activeSortLabel = activeSortOption
        ? t(activeSortOption.labelKey, activeSortOption.defaultLabel)
        : t('community.recent', 'Recents');

    return (
        <div ref={toolbarRef} className="hidden md:block touch-landscape:hidden">
            <LiquidToolbar delay={0.5}>
                {/* 1. Selector d'Assignatures */}
                <LiquidToolbarButton
                    key="assignatures"
                    onClick={() => {
                        setShowSubjectFilter(true);
                        setShowTypeDropdown(false);
                        setShowSortDropdown(false);
                    }}
                    active={activeSubject !== 'all'}
                    aria-label={t('community.subjects', 'Assignatures')}
                >
                    <BookOpen size={16} />
                    <span className="hidden sm:inline">{t('community.subjects', 'Assignatures')}</span>
                    <span className="sm:hidden">{t('community.subjectsShort', 'Assig.')}</span>
                    {activeSubject !== 'all' && (
                        <span className="ml-1 text-[10px] bg-black/20 text-current px-1.5 py-0.5 rounded-md uppercase font-bold">
                            {activeSubject}
                        </span>
                    )}
                </LiquidToolbarButton>

                <div key="divider-1" className="w-px h-6 bg-white/10 mx-1" />

                {/* 2. Filtre per tipus de recurs */}
                <div key="filter-type" className="relative">
                    <LiquidToolbarButton
                        onClick={() => {
                            setShowTypeDropdown(prev => !prev);
                            setShowSortDropdown(false);
                        }}
                        active={showTypeDropdown || filterType !== 'all'}
                        aria-haspopup="true"
                        aria-expanded={showTypeDropdown}
                        aria-label={t('community.filterByType', 'Filtrar per tipus de recurs')}
                    >
                        <Filter size={16} />
                        <span>{activeFilterLabel}</span>
                    </LiquidToolbarButton>

                    <AnimatePresence>
                        {showTypeDropdown && (
                            <LiquidDropdown className="min-w-52.5">
                                {FILTER_OPTIONS.map(opt => {
                                    const Icon = opt.icon;
                                    const isSelected = filterType === opt.id;
                                    const label = t(opt.labelKey, opt.defaultLabel);
                                    return (
                                        <button
                                            key={opt.id}
                                            type="button"
                                            onClick={() => {
                                                setFilterType(opt.id);
                                                setShowTypeDropdown(false);
                                            }}
                                            className={`relative z-10 flex items-center gap-3 w-full p-2.5 rounded-2xl hover:bg-white/10 text-white transition-colors text-sm font-medium cursor-pointer ${isSelected ? 'bg-white/10 shadow-inner' : ''}`}
                                            aria-label={label}
                                        >
                                            <Icon size={16} className="text-white shrink-0" />
                                            <span>{label}</span>
                                        </button>
                                    );
                                })}
                            </LiquidDropdown>
                        )}
                    </AnimatePresence>
                </div>

                <div key="divider-2" className="w-px h-6 bg-white/10 mx-1" />

                {/* 3. Criteri d'ordenació */}
                <div key="sort-by" className="relative">
                    <LiquidToolbarButton
                        onClick={() => {
                            setShowSortDropdown(prev => !prev);
                            setShowTypeDropdown(false);
                        }}
                        active={showSortDropdown || sortBy !== 'recent'}
                        aria-haspopup="true"
                        aria-expanded={showSortDropdown}
                        aria-label={t('community.sortBy', 'Ordenar recursos')}
                    >
                        <ArrowUpDown size={16} />
                        <span>{activeSortLabel}</span>
                    </LiquidToolbarButton>

                    <AnimatePresence>
                        {showSortDropdown && (
                            <LiquidDropdown className="min-w-47.5">
                                {SORT_OPTIONS.map(opt => {
                                    const Icon = opt.icon;
                                    const isSelected = sortBy === opt.id;
                                    const label = t(opt.labelKey, opt.defaultLabel);
                                    return (
                                        <button
                                            key={opt.id}
                                            type="button"
                                            onClick={() => {
                                                setSortBy(opt.id);
                                                setShowSortDropdown(false);
                                            }}
                                            className={`relative z-10 flex items-center gap-3 w-full p-2.5 rounded-2xl hover:bg-white/10 text-white transition-colors text-sm font-medium cursor-pointer ${isSelected ? 'bg-white/10 shadow-inner' : ''}`}
                                            aria-label={label}
                                        >
                                            <Icon size={16} className="text-white shrink-0" />
                                            <span>{label}</span>
                                        </button>
                                    );
                                })}
                            </LiquidDropdown>
                        )}
                    </AnimatePresence>
                </div>

                <div key="divider-3" className="w-px h-6 bg-white/10 mx-1" />

                {/* 4. Barra de Cerca */}
                <div
                    key="buscar"
                    className={`flex items-center transition duration-500 overflow-hidden ${isSearchOpen || searchQuery ? 'w-45 sm:w-70 ml-1' : 'w-10 ml-0'}`}
                >
                    <button
                        type="button"
                        onClick={() => {
                            if (isSearchOpen && !searchQuery) setIsSearchOpen(false);
                            else setIsSearchOpen(true);
                        }}
                        className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer ${isSearchOpen || searchQuery ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
                        title={t('community.search', 'Buscar')}
                        aria-label={t('community.search', 'Buscar')}
                    >
                        <Search size={18} />
                    </button>

                    <div className="flex-1 relative h-10 flex items-center">
                        <input
                            autoFocus={isSearchOpen}
                            type="text"
                            placeholder={t('community.searchPlaceholder', 'Cerca apunts...')}
                            aria-label={t('community.searchPlaceholder', 'Cerca apunts...')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Escape') {
                                    if (searchQuery) setSearchQuery('');
                                    else setIsSearchOpen(false);
                                }
                            }}
                            className="absolute inset-0 w-full h-full bg-transparent text-white text-sm font-medium focus:outline-none pl-2 pr-8 placeholder:text-slate-600"
                        />
                        {(searchQuery || isSearchOpen) && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchQuery('');
                                    setIsSearchOpen(false);
                                }}
                                className="absolute right-2 p-1 text-slate-500 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors z-10 cursor-pointer"
                                aria-label={t('community.clearSearch', 'Netejar cerca')}
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>
            </LiquidToolbar>
        </div>
    );
});

CommunityToolbar.displayName = 'CommunityToolbar';
export default CommunityToolbar;
