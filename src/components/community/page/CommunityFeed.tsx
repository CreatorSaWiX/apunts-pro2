import { memo, useMemo, useCallback } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { Plus, FileText as FileTextIcon, WifiOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Spinner from '../../ui/Spinner';
import PublicationCard from '../PublicationCard';
import type { CommunityPost } from '../../../types/community';
import { getSubjectById } from '../../../config/subjects';
import { useSettingsStore } from '../../../stores/useSettingsStore';

/**
 * Resoldre el variant de color del Spinner segons l'assignatura seleccionada i els colors personalitzats.
 */
function getSubjectSpinnerVariant(
    activeSubject: string,
    customSubjectColors: Record<string, string>
): string {
    if (activeSubject === 'all') return 'primary';
    const subject = getSubjectById(activeSubject);
    if (!subject) return 'primary';
    return customSubjectColors[subject.label] || subject.color || 'primary';
}

/* ==========================================================================
   Subcomponents auxiliars memoitzats
   ========================================================================== */

interface OfflineStateProps {
    title: string;
    subtitle: string;
}

const CommunityOfflineState = memo(({ title, subtitle }: OfflineStateProps) => (
    <motion.div
        key="offline"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
        <div className="w-full max-w-lg rounded-3xl p-10 sm:p-14 flex flex-col items-center bg-linear-to-b from-red-500/5 to-transparent border border-red-500/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-red-500/5 blur-3xl rounded-full group-hover:bg-red-500/10 transition-colors duration-700 pointer-events-none" />

            <div className="relative w-20 h-20 bg-black/50 backdrop-blur-xl border border-red-500/20 rounded-2xl flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                <div className="absolute inset-0 bg-linear-to-br from-red-500/10 to-transparent opacity-50 rounded-2xl pointer-events-none" />
                <WifiOff size={36} className="relative text-red-400 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
            </div>

            <h3 className="font-bold text-3xl text-white mb-3 tracking-tight relative z-10">{title}</h3>
            <p className="text-slate-400 max-w-sm text-sm leading-relaxed relative z-10">{subtitle}</p>
        </div>
    </motion.div>
));
CommunityOfflineState.displayName = 'CommunityOfflineState';

interface EmptyStateProps {
    isSearching: boolean;
    onUploadClick: () => void;
    uploadLabel: string;
    title: string;
    subtitle: string;
}

const CommunityEmptyState = memo(({
    isSearching,
    onUploadClick,
    uploadLabel,
    title,
    subtitle
}: EmptyStateProps) => (
    <motion.div
        key="empty"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
        <div className="w-full max-w-lg rounded-3xl p-10 sm:p-14 flex flex-col items-center bg-linear-to-b from-white/5 to-transparent border border-white/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/10 transition-colors duration-700 pointer-events-none" />

            <div className="relative w-20 h-20 bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent opacity-50 rounded-2xl pointer-events-none" />
                <motion.div
                    animate={isSearching ? { rotate: 360 } : { y: [0, -10, 0] }}
                    transition={isSearching ? { repeat: Infinity, duration: 2, ease: 'linear' } : { duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                    {isSearching ? <Spinner size="sm" variant="primary" /> : <FileTextIcon size={36} className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />}
                </motion.div>
            </div>

            <h3 className="font-bold text-3xl text-white mb-3 tracking-tight relative z-10">{title}</h3>
            <p className="text-slate-400 mb-10 max-w-sm text-sm leading-relaxed relative z-10">{subtitle}</p>

            <button
                type="button"
                onClick={onUploadClick}
                className="relative px-8 py-3.5 bg-white text-black hover:bg-slate-200 font-bold rounded-2xl transition hover:-translate-y-1 flex items-center gap-2 shadow-[0_10px_40px_rgba(255,255,255,0.2)] hover:shadow-[0_15px_50px_rgba(255,255,255,0.3)] z-10 overflow-hidden cursor-pointer"
                aria-label={uploadLabel}
            >
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shine_3s_infinite]" />
                <Plus size={20} className="text-black" />
                {uploadLabel}
            </button>
        </div>
    </motion.div>
));
CommunityEmptyState.displayName = 'CommunityEmptyState';

interface FeedCardItemProps {
    post: CommunityPost;
    index: number;
    isLast: boolean;
    onSelectPost: (post: CommunityPost) => void;
    lastPostRef: (node: HTMLDivElement | null) => void;
}

const CommunityFeedCardItem = memo(({
    post,
    index,
    isLast,
    onSelectPost,
    lastPostRef
}: FeedCardItemProps) => {
    const handleClick = useCallback(() => {
        onSelectPost(post);
    }, [onSelectPost, post]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelectPost(post);
        }
    }, [onSelectPost, post]);

    return (
        <div
            ref={isLast ? lastPostRef : undefined}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            className="w-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl"
            aria-label={post.content?.slice(0, 60) || 'Publicació de la comunitat'}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (index % 10) * 0.05 }}
            >
                <PublicationCard post={post} />
            </motion.div>
        </div>
    );
});
CommunityFeedCardItem.displayName = 'CommunityFeedCardItem';

/* ==========================================================================
   Component Principal CommunityFeed
   ========================================================================== */

interface Props {
    filteredAndSortedPosts: CommunityPost[];
    loading: boolean;
    loadingMore: boolean;
    isOffline: boolean;
    activeSubject: string;
    onUploadClick: () => void;
    onSelectPost: (post: CommunityPost) => void;
    lastPostRef: (node: HTMLDivElement | null) => void;
}

const CommunityFeed = memo(({
    filteredAndSortedPosts,
    loading,
    loadingMore,
    isOffline,
    activeSubject,
    onUploadClick,
    onSelectPost,
    lastPostRef
}: Props) => {
    const { t } = useTranslation();
    const { customSubjectColors } = useSettingsStore();

    // Color unificat per al Spinner segons l'assignatura activa i personalitzacions
    const spinnerVariant = useMemo(
        () => getSubjectSpinnerVariant(activeSubject, customSubjectColors),
        [activeSubject, customSubjectColors]
    );

    const isSearchingNextPage = loading || loadingMore;

    return (
        <div className="w-full">
            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex justify-center py-32"
                    >
                        <Spinner size="2xl" variant={spinnerVariant} />
                    </motion.div>
                ) : isOffline ? (
                    <CommunityOfflineState
                        title={t('community.offlineTitle', 'Sense connexió')}
                        subtitle={t('community.offlineSubtitle', 'Actualment estàs offline. Per consultar els recursos de la comunitat o pujar-ne un de nou cal que et connectis a Internet.')}
                    />
                ) : filteredAndSortedPosts.length === 0 ? (
                    <CommunityEmptyState
                        isSearching={isSearchingNextPage}
                        onUploadClick={onUploadClick}
                        uploadLabel={t('community.uploadFirst', 'Pujar el primer recurs')}
                        title={isSearchingNextPage ? t('community.emptyLoadingTitle', 'Cercant apunts...') : t('community.emptyTitle', 'Encara no hi ha apunts')}
                        subtitle={isSearchingNextPage ? t('community.emptyLoadingSubtitle', 'Estem aplicant els filtres a la següent pàgina de dades...') : t('community.emptySubtitle', "No s'ha trobat cap recurs que coincideixi amb els filtres seleccionats.")}
                    />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 pt-8">
                        {filteredAndSortedPosts.map((post, index) => (
                            <CommunityFeedCardItem
                                key={post.id}
                                post={post}
                                index={index}
                                isLast={index === filteredAndSortedPosts.length - 1}
                                onSelectPost={onSelectPost}
                                lastPostRef={lastPostRef}
                            />
                        ))}
                    </div>
                )}
            </AnimatePresence>

            {loadingMore && (
                <div className="flex justify-center py-10">
                    <Spinner size="lg" variant={spinnerVariant} />
                </div>
            )}
        </div>
    );
});

CommunityFeed.displayName = 'CommunityFeed';
export default CommunityFeed;
