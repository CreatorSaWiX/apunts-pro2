import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Search, FileText as FileTextIcon, BookOpen, X, Filter, ArrowUpDown, Flame, Eye, Clock, Image, Code2, Heart } from 'lucide-react';
import { LiquidToolbar, LiquidToolbarButton } from '../../ui/glass/LiquidToolbar';
import LiquidDropdown from '../../ui/glass/LiquidDropdown';

interface Props {
    activeSubject: string;
    filterType: 'all' | 'pdf' | 'image' | 'code';
    sortBy: 'recent' | 'popular' | 'views' | 'liked';
    searchQuery: string;
    setShowSubjectFilter: (show: boolean) => void;
    setFilterType: (type: 'all' | 'pdf' | 'image' | 'code') => void;
    setSortBy: (sort: 'recent' | 'popular' | 'views' | 'liked') => void;
    setSearchQuery: (query: string) => void;
}

const CommunityToolbar = ({
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
    const [showTypeDropdown, setShowTypeDropdown] = useState(false);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <div className="hidden md:block touch-landscape:hidden">
            <LiquidToolbar delay={0.5}>
                {/* Assignatures */}
                <LiquidToolbarButton
                    key="assignatures"
                    onClick={() => { setShowSubjectFilter(true); setShowTypeDropdown(false); setShowSortDropdown(false); }}
                    active={activeSubject !== 'all'}
                >
                    <BookOpen size={16} />
                    <span className="hidden sm:inline">{t('community.subjects', 'Assignatures')}</span>
                    <span className="sm:hidden">{t('community.subjectsShort', 'Assig.')}</span>
                    {activeSubject !== 'all' && <span className="ml-1 text-[10px] bg-black/20 text-current px-1.5 py-0.5 rounded-md uppercase">{activeSubject}</span>}
                </LiquidToolbarButton>

                <div key="divider-1" className="w-px h-6 bg-white/10 mx-1" />

                {/* Tipus de recurs */}
                <div key="filter-type" className="relative">
                    <LiquidToolbarButton
                        onClick={() => { setShowTypeDropdown(!showTypeDropdown); setShowSortDropdown(false); }}
                        active={showTypeDropdown || filterType !== 'all'}
                    >
                        <Filter size={16} />
                        <span className="hidden sm:inline">
                            {filterType === 'all' ? t('community.allTypes', 'Tipus') : filterType === 'pdf' ? 'PDF' : filterType === 'image' ? 'Imatges' : 'Codi'}
                        </span>
                        <span className="sm:hidden">{filterType === 'all' ? 'Tipus' : filterType.toUpperCase()}</span>
                    </LiquidToolbarButton>

                    <AnimatePresence>
                        {showTypeDropdown && (
                            <LiquidDropdown className="min-w-52.5">
                                <button
                                    type="button"
                                    onClick={() => { setFilterType('all'); setShowTypeDropdown(false); }}
                                    className={`relative z-10 flex items-center gap-3 w-full p-2.5 rounded-2xl hover:bg-white/10 text-white transition-colors text-sm font-medium ${filterType === 'all' ? 'bg-white/10' : ''}`}
                                    aria-label="Obrir material">
                                    <BookOpen size={16} className="text-white shrink-0" />
                                    <span>{t('community.filterAll', 'Tots els recursos')}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setFilterType('pdf'); setShowTypeDropdown(false); }}
                                    className={`relative z-10 flex items-center gap-3 w-full p-2.5 rounded-2xl hover:bg-white/10 text-white transition-colors text-sm font-medium ${filterType === 'pdf' ? 'bg-white/10' : ''}`}
                                    aria-label="Arxiu de text">
                                    <FileTextIcon size={16} className="text-white shrink-0" />
                                    <span>{t('community.filterPdf', 'Documents PDF')}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setFilterType('image'); setShowTypeDropdown(false); }}
                                    className={`relative z-10 flex items-center gap-3 w-full p-2.5 rounded-2xl hover:bg-white/10 text-white transition-colors text-sm font-medium ${filterType === 'image' ? 'bg-white/10' : ''}`}
                                    aria-label="Veure imatge">
                                    <Image size={16} className="text-white shrink-0" />
                                    <span>{t('community.filterImage', 'Imatges / Fotos')}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setFilterType('code'); setShowTypeDropdown(false); }}
                                    className={`relative z-10 flex items-center gap-3 w-full p-2.5 rounded-2xl hover:bg-white/10 text-white transition-colors text-sm font-medium ${filterType === 'code' ? 'bg-white/10' : ''}`}
                                    aria-label="Veure codi">
                                    <Code2 size={16} className="text-white shrink-0" />
                                    <span>{t('community.filterCode', 'Codi Font')}</span>
                                </button>
                            </LiquidDropdown>
                        )}
                    </AnimatePresence>
                </div>

                <div key="divider-2" className="w-px h-6 bg-white/10 mx-1" />

                {/* Ordenació */}
                <div key="sort-by" className="relative">
                    <LiquidToolbarButton
                        onClick={() => { setShowSortDropdown(!showSortDropdown); setShowTypeDropdown(false); }}
                        active={showSortDropdown || sortBy !== 'recent'}
                    >
                        <ArrowUpDown size={16} />
                        <span className="hidden sm:inline">
                            {sortBy === 'recent' ? t('community.recent', 'Recents') : sortBy === 'popular' ? t('community.popular', 'Populars') : sortBy === 'views' ? t('community.views', 'Vistos') : t('community.liked', "M'agrada")}
                        </span>
                        <span className="sm:hidden">
                            {sortBy === 'recent' ? t('community.recent', 'Recents') : sortBy === 'popular' ? t('community.popular', 'Populars') : sortBy === 'views' ? t('community.views', 'Vistos') : t('community.liked', "M'agrada")}
                        </span>
                    </LiquidToolbarButton>

                    <AnimatePresence>
                        {showSortDropdown && (
                            <LiquidDropdown className="min-w-47.5">
                                <button
                                    type="button"
                                    onClick={() => { setSortBy('recent'); setShowSortDropdown(false); }}
                                    className={`relative z-10 flex items-center gap-3 w-full p-2.5 rounded-2xl hover:bg-white/10 text-white transition-colors text-sm font-medium ${sortBy === 'recent' ? 'bg-white/10' : ''}`}
                                    aria-label="Historial">
                                    <Clock size={16} className="text-white shrink-0" />
                                    <span>{t('community.sortRecent', 'Més recents')}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setSortBy('popular'); setShowSortDropdown(false); }}
                                    className={`relative z-10 flex items-center gap-3 w-full p-2.5 rounded-2xl hover:bg-white/10 text-white transition-colors text-sm font-medium ${sortBy === 'popular' ? 'bg-white/10' : ''}`}
                                    aria-label="Destacat">
                                    <Flame size={16} className="text-white shrink-0" />
                                    <span>{t('community.sortPopular', 'Més populars')}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setSortBy('views'); setShowSortDropdown(false); }}
                                    className={`relative z-10 flex items-center gap-3 w-full p-2.5 rounded-2xl hover:bg-white/10 text-white transition-colors text-sm font-medium ${sortBy === 'views' ? 'bg-white/10' : ''}`}
                                    aria-label="Veure">
                                    <Eye size={16} className="text-white shrink-0" />
                                    <span>{t('community.sortViews', 'Més vistos')}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setSortBy('liked'); setShowSortDropdown(false); }}
                                    className={`relative z-10 flex items-center gap-3 w-full p-2.5 rounded-2xl hover:bg-white/10 text-white transition-colors text-sm font-medium ${sortBy === 'liked' ? 'bg-white/10' : ''}`}
                                    aria-label="M'agrada">
                                    <Heart size={16} className="text-white shrink-0" />
                                    <span>{t('community.sortLiked', "Els meus m'agrada")}</span>
                                </button>
                            </LiquidDropdown>
                        )}
                    </AnimatePresence>
                </div>

                <div key="divider-3" className="w-px h-6 bg-white/10 mx-1" />

                {/* Buscar */}
                <div key="buscar" className={`flex items-center transition duration-500 overflow-hidden ${isSearchOpen || searchQuery ? 'w-45 sm:w-70 ml-1' : 'w-10 ml-0'}`}>
                    <button type="button"
                        onClick={() => {
                            if (isSearchOpen && !searchQuery) setIsSearchOpen(false);
                            else setIsSearchOpen(true);
                        }}
                        className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isSearchOpen || searchQuery ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
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
                            className="absolute inset-0 w-full h-full bg-transparent text-white text-sm font-medium focus:outline-none pl-2 pr-8 placeholder:text-slate-600"
                        />
                        {(searchQuery || isSearchOpen) && (
                            <button type="button"
                                onClick={() => { setSearchQuery(''); setIsSearchOpen(false); }}
                                className="absolute right-2 p-1 text-slate-500 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors z-10"
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
};

export default CommunityToolbar;
