import { useState, useEffect, useCallback, lazy, Suspense, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { m as motion, AnimatePresence } from 'framer-motion';
import { Filter, Users, Palette, BookOpen, FileText as FileTextIcon, Image, Code2, Clock, Flame, Eye, Heart, Plus } from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import { useShortcut } from '../hooks/useShortcut';
import type { CommunityPost } from '../types/community';

import BottomSheet from '../components/ui/mobile/BottomSheet';
import FloatingActionButton from '../components/ui/mobile/FloatingActionButton';
import NavigationPill from '../components/ui/NavigationPill';

import { useCommunityFeed } from '../hooks/useCommunityFeed';
import { useCanvasOrchestrator } from '../hooks/useCanvasOrchestrator';
import { useCommunityUI } from '../hooks/useCommunityUI';

import CommunityHero from '../components/community/page/CommunityHero';
import CommunityToolbar from '../components/community/page/CommunityToolbar';
import CommunityFeed from '../components/community/page/CommunityFeed';

const CommunityCanvas = lazy(() => import('../components/community/CommunityCanvas'));
const SubjectSelectorModal = lazy(() => import('../components/community/SubjectSelectorModal'));
const CreatePostModal = lazy(() => import('../components/community/CreatePostModal'));
const PostDetailModal = lazy(() => import('../components/community/PostDetailModal'));

const CommunityPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    // App State
    const [isOffline, setIsOffline] = useState(!navigator.onLine);
    
    // UI & Canvas Orchestration (Custom Hooks)
    const {
        activeSubject, setActiveSubject,
        showSubjectFilter, setShowSubjectFilter,
        showMobileFiltersMenu, setShowMobileFiltersMenu,
        isCreateOpen, setIsCreateOpen,
        selectedPost, setSelectedPost,
        postToEdit, setPostToEdit,
        filterType, setFilterType,
        sortBy, setSortBy,
        searchQuery, setSearchQuery
    } = useCommunityUI();

    const {
        isCanvasOpen,
        isCanvasFullyOpen,
        isBackgroundHidden,
        isCanvasClosing,
        handleOpenCanvas,
        handleCloseCanvas
    } = useCanvasOrchestrator();

    // Custom Hook for Data
    const {
        posts,
        loading,
        loadingMore,
        filteredAndSortedPosts,
        lastPostRef
    } = useCommunityFeed(searchQuery, activeSubject, filterType, sortBy, isOffline);

    const postModalData = useMemo(() => {
        if (!selectedPost) return null;
        const list = filteredAndSortedPosts.some(p => p.id === selectedPost.id) ? filteredAndSortedPosts : posts;
        const currentIdx = list.findIndex(p => p.id === selectedPost.id);
        
        const handlePrevPost = list.length > 1 && currentIdx !== -1 ? () => {
            const prevIdx = currentIdx > 0 ? currentIdx - 1 : list.length - 1;
            setSelectedPost(list[prevIdx]);
        } : undefined;
        
        const handleNextPost = list.length > 1 && currentIdx !== -1 ? () => {
            const nextIdx = currentIdx < list.length - 1 ? currentIdx + 1 : 0;
            setSelectedPost(list[nextIdx]);
        } : undefined;

        return {
            post: posts.find(p => p.id === selectedPost.id) || selectedPost,
            handlePrevPost,
            handleNextPost
        };
    }, [selectedPost, filteredAndSortedPosts, posts, setSelectedPost]);

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        }
    }, []);

    const handleCreateShortcut = useCallback(() => {
        if (!isOffline) {
            setIsCreateOpen(true);
        }
    }, [isOffline, setIsCreateOpen]);

    useShortcut('createResource', handleCreateShortcut);

    const handleUploadClick = useCallback(() => {
        if (!user) {
            navigate('/login');
        } else {
            setIsCreateOpen(true);
        }
    }, [user, navigate, setIsCreateOpen]);

    return (
        <div className="w-full min-h-screen pb-32 flex flex-col items-center text-white overflow-x-hidden selection:bg-primary selection:text-black relative">
            
            {/* Mobile Filter Button (Top Left) */}
            <div className="md:hidden touch-landscape:block fixed top-5 left-4 z-50">
                <NavigationPill>
                    <button type="button"
                        onClick={() => {
                            if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(30);
                            setShowMobileFiltersMenu(!showMobileFiltersMenu);
                        }}
                        className="flex items-center justify-center w-11 h-11 text-white hover:text-primary transition-colors active:scale-95"
                        aria-label="Filtres"
                    >
                        <Filter size={20} />
                    </button>
                </NavigationPill>

                <BottomSheet
                    isOpen={showMobileFiltersMenu}
                    onClose={() => setShowMobileFiltersMenu(false)}
                    title={t('community.filters', 'Filtres')}
                >
                    <div className="flex flex-col gap-6">
                        <div>
                            <h4 className="text-[11px] font-bold text-slate-400 mb-3 uppercase tracking-widest">{t('community.subjects', 'Assignatures')}</h4>
                            <button
                                onClick={() => { setShowSubjectFilter(true); setShowMobileFiltersMenu(false); }}
                                className="flex items-center justify-between w-full p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/5"
                                aria-label="Obrir panell">
                                <div className="flex items-center gap-3">
                                    <BookOpen size={18} className="text-primary" />
                                    <span>{activeSubject === 'all' ? t('community.allSubjects', 'Totes les assignatures') : activeSubject.toUpperCase()}</span>
                                </div>
                                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                </div>
                            </button>
                        </div>
                        <div>
                            <h4 className="text-[11px] font-bold text-slate-400 mb-3 uppercase tracking-widest">{t('community.allTypes', 'Tipus de recurs')}</h4>
                            <div className="grid grid-cols-2 gap-3">
                                {(['all', 'pdf', 'image', 'code'] as const).map((type, i) => (
                                    <motion.button
                                        key={type}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 + 0.1 }}
                                        onClick={() => {
                                            if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(40);
                                            setFilterType(type);
                                            setTimeout(() => setShowMobileFiltersMenu(false), 200);
                                        }}
                                        className={`p-3.5 rounded-2xl text-sm font-semibold transition duration-300 flex items-center justify-center gap-2 ${filterType === type ? 'bg-primary text-white shadow-[0_0_20px_rgba(0,0,0,0.2)] scale-[1.02]' : 'bg-white/5 text-slate-300 border border-white/5'}`}
                                    >
                                        {type === 'all' ? <BookOpen size={16} /> : type === 'pdf' ? <FileTextIcon size={16} /> : type === 'image' ? <Image size={16} /> : <Code2 size={16} />}
                                        {type === 'all' ? 'Tots' : type === 'pdf' ? 'PDFs' : type === 'image' ? 'Imatges' : 'Codi'}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-[11px] font-bold text-slate-400 mb-3 uppercase tracking-widest">Ordenació</h4>
                            <div className="grid grid-cols-2 gap-3">
                                {(['recent', 'popular', 'views', 'liked'] as const).map((sort, i) => (
                                    <motion.button
                                        key={sort}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 + 0.2 }}
                                        onClick={() => {
                                            if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(40);
                                            setSortBy(sort);
                                            setTimeout(() => setShowMobileFiltersMenu(false), 200);
                                        }}
                                        className={`p-3.5 rounded-2xl text-sm font-semibold transition duration-300 flex items-center justify-center gap-2 ${sortBy === sort ? 'bg-primary text-white shadow-[0_0_20px_rgba(0,0,0,0.2)] scale-[1.02]' : 'bg-white/5 text-slate-300 border border-white/5'}`}
                                    >
                                        {sort === 'recent' ? <Clock size={16} /> : sort === 'popular' ? <Flame size={16} /> : sort === 'views' ? <Eye size={16} /> : <Heart size={16} />}
                                        {sort === 'recent' ? t('community.recent', 'Recents') : sort === 'popular' ? t('community.popular', 'Populars') : sort === 'views' ? t('community.views', 'Vistos') : t('community.liked', "M'agrada")}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </div>
                </BottomSheet>
            </div>

            {/* Dynamic Island Navigator (Canvas/Resources) - Top Right */}
            <div className="fixed top-5 md:top-6 right-4 sm:right-6 z-50">
                <NavigationPill>
                    <button type="button"
                        onClick={() => {
                            if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(20);
                            handleCloseCanvas();
                        }}
                        aria-label={t('community.resources', 'Recursos')}
                        className={`relative flex items-center justify-center gap-2 px-4 sm:px-6 h-11 md:h-10 rounded-full transition duration-300 text-[11px] sm:text-sm font-bold tracking-wide z-10 group hover:scale-[1.02] active:scale-[0.98] ${!isCanvasOpen ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        {!isCanvasOpen && (
                            <motion.div
                                layoutId="community-active-tab"
                                className="absolute inset-0 bg-white/12 border border-white/15 rounded-full z-[-1] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_0_20px_rgba(255,255,255,0.1),0_0_8px_rgba(255,255,255,0.05)]"
                                initial={false}
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            >
                                <div className="absolute inset-x-4 -bottom-px h-px bg-linear-to-r from-transparent via-white/50 to-transparent blur-[1px]" />
                            </motion.div>
                        )}
                        <Users size={16} strokeWidth={!isCanvasOpen ? 2.5 : 2} className={`transition-colors ${!isCanvasOpen ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'group-hover:text-slate-200'}`} />
                        <span className="hidden sm:inline">{t('community.resources', 'Recursos')}</span>
                    </button>

                    <div className="w-px h-6 bg-white/10 mx-1"></div>

                    <button type="button"
                        onClick={() => {
                            if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(20);
                            if (!user) {
                                navigate('/login');
                            } else {
                                handleOpenCanvas();
                            }
                        }}
                        aria-label={t('community.canvas', 'Llenç')}
                        className={`relative flex items-center justify-center gap-2 px-4 sm:px-6 h-11 md:h-10 rounded-full transition duration-300 text-[11px] sm:text-sm font-bold tracking-wide z-10 group hover:scale-[1.02] active:scale-[0.98] ${isCanvasOpen ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        {isCanvasOpen && (
                            <motion.div
                                layoutId="community-active-tab"
                                className="absolute inset-0 bg-white/12 border border-white/15 rounded-full z-[-1] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_0_20px_rgba(255,255,255,0.1),0_0_8px_rgba(255,255,255,0.05)]"
                                initial={false}
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            >
                                <div className="absolute inset-x-4 -bottom-px h-px bg-linear-to-r from-transparent via-white/50 to-transparent blur-[1px]" />
                            </motion.div>
                        )}
                        <Palette size={16} strokeWidth={isCanvasOpen ? 2.5 : 2} className={`transition-colors ${isCanvasOpen ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'group-hover:text-slate-200'}`} />
                        <span className="hidden sm:inline">{t('community.canvas', 'Llenç')}</span>
                    </button>
                </NavigationPill>
            </div>

            <div className={`w-full transition duration-700 ease-in-out ${isBackgroundHidden ? 'invisible opacity-0 pointer-events-none' : 'visible opacity-100'}`}>
                
                <CommunityHero 
                    isCanvasFullyOpen={isCanvasFullyOpen} 
                    onUploadClick={handleUploadClick} 
                />

                <main className="w-full max-w-400 mx-auto px-4 sm:px-8 lg:px-12 relative z-10 pt-4 md:pt-0 touch-landscape:pt-4">
                    {/* Mobile Upload FAB */}
                    <FloatingActionButton
                        onClick={handleUploadClick}
                        icon={<Plus size={24} className="relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />}
                        ariaLabel="Obrir panell"
                    />

                    <CommunityToolbar 
                        activeSubject={activeSubject}
                        filterType={filterType}
                        sortBy={sortBy}
                        searchQuery={searchQuery}
                        setShowSubjectFilter={setShowSubjectFilter}
                        setFilterType={setFilterType}
                        setSortBy={setSortBy}
                        setSearchQuery={setSearchQuery}
                    />

                    <CommunityFeed 
                        filteredAndSortedPosts={filteredAndSortedPosts}
                        loading={loading}
                        loadingMore={loadingMore}
                        isOffline={isOffline}
                        activeSubject={activeSubject}
                        onUploadClick={handleUploadClick}
                        onSelectPost={setSelectedPost}
                        lastPostRef={lastPostRef}
                    />
                </main>
            </div>

            {/* Modals */}
            <Suspense fallback={null}>
                {showSubjectFilter && (
                    <SubjectSelectorModal
                        isOpen={showSubjectFilter}
                        onClose={() => setShowSubjectFilter(false)}
                        onSelect={(id) => { setActiveSubject(id); setShowSubjectFilter(false); }}
                        selectedId={activeSubject}
                        allowAll={true}
                    />
                )}

                {isCreateOpen && (
                    <CreatePostModal
                        isOpen={isCreateOpen}
                        onClose={() => { setIsCreateOpen(false); setPostToEdit(null); }}
                        postToEdit={postToEdit}
                    />
                )}

                {postModalData && (
                    <PostDetailModal
                        post={postModalData.post}
                        isOpen={true}
                        onClose={() => setSelectedPost(null)}
                        onPrev={postModalData.handlePrevPost}
                        onNext={postModalData.handleNextPost}
                        onDelete={() => setSelectedPost(null)}
                        onEdit={() => {
                            setPostToEdit(postModalData.post);
                            setSelectedPost(null);
                            setIsCreateOpen(true);
                        }}
                    />
                )}
            </Suspense>

            <AnimatePresence>
                {isCanvasOpen && (
                    <motion.div
                        key="canvas-overlay"
                        initial={{ clipPath: 'circle(0% at calc(100% - 4rem) 2.5rem)' }}
                        animate={{ clipPath: 'circle(150% at calc(100% - 4rem) 2.5rem)' }}
                        exit={{ clipPath: 'circle(0% at calc(100% - 4rem) 2.5rem)' }}
                        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                        className="fixed inset-0 z-30 bg-[#09090b]"
                    >
                        <Suspense fallback={null}>
                            <CommunityCanvas onClose={handleCloseCanvas} isClosing={isCanvasClosing} />
                        </Suspense>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CommunityPage;
