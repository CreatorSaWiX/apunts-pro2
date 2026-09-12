import { useState, useRef, useCallback } from 'react';
import { ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useComments } from '../../hooks/useComments';
import CommentItem from './CommentItem';
import CommentInput from './CommentInput';
import ConfirmModal from '../ui/modals/ConfirmModal';
import Spinner from '../ui/Spinner';
import type { CommentEntity, CommentResourceType } from '../../types/comments';

export interface UnifiedCommentFeedProps {
    resourceType: CommentResourceType; // 'solutions' | 'community_posts'
    resourceId: string;
    resourceTitle?: string;
    postAuthorId?: string;
    allowGifs?: boolean;
    onNavigateToProfile?: (username: string) => void;
    className?: string;
}

const CommentFeedSkeleton = () => (
    <div className="flex justify-center py-6">
        <Spinner size="sm" variant="slate" glow={false} />
    </div>
);

export const UnifiedCommentFeed = ({
    resourceType,
    resourceId,
    resourceTitle,
    postAuthorId,
    allowGifs = true,
    onNavigateToProfile,
    className = ''
}: UnifiedCommentFeedProps) => {
    const { t } = useTranslation();
    const {
        comments,
        loading,
        isLoadingMore,
        hasMore,
        toggleReaction,
        submitComment,
        deleteComment,
        loadMore
    } = useComments({
        resourceType,
        resourceId,
        resourceTitle,
        postAuthorId
    });

    const [replyingTo, setReplyingTo] = useState<CommentEntity | null>(null);
    const [expandedThreadIds, setExpandedThreadIds] = useState<Set<string>>(new Set());
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
    const commentsEndRef = useRef<HTMLDivElement>(null);

    // Resolves root ancestor even for deep sub-replies
    const getRootCommentId = useCallback(
        (target: CommentEntity): string => {
            if (comments.some((c) => c.id === target.id)) {
                return target.id;
            }
            for (const root of comments) {
                if (root.replies && root.replies.some((r) => r.id === target.id)) {
                    return root.id;
                }
            }
            return target.parentId || target.id;
        },
        [comments]
    );

    const scrollToBottom = useCallback(() => {
        setTimeout(() => {
            commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }, []);

    const handleReply = useCallback(
        (comment: CommentEntity) => {
            setReplyingTo(comment);
            const rootId = getRootCommentId(comment);
            setExpandedThreadIds((prev) => new Set(prev).add(rootId));
            scrollToBottom();
        },
        [getRootCommentId, scrollToBottom]
    );

    const handleCancelReply = useCallback(() => {
        setReplyingTo(null);
    }, []);

    const handleDeleteRequest = useCallback((commentId: string) => {
        setCommentToDelete(commentId);
        setIsDeleteModalOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (!commentToDelete) return;
        try {
            await deleteComment(commentToDelete);
        } catch (e) {
            console.error('[UnifiedCommentFeed] Failed to delete comment:', e);
        } finally {
            setCommentToDelete(null);
            setIsDeleteModalOpen(false);
        }
    }, [commentToDelete, deleteComment]);

    return (
        <div
            className={`flex flex-col h-full min-h-0 bg-transparent overflow-hidden ${className}`}
        >
            {/* Comments Stream / List */}
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-5 sm:p-6 space-y-4">
                {loading ? (
                    <CommentFeedSkeleton />
                ) : comments.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-xs italic">
                        {resourceType === 'community_posts'
                            ? t('community.replySection.empty', 'Encara no hi ha respostes.')
                            : t('comments.empty', 'Encara no hi ha cap comentari.')}{' '}
                        <span className="text-slate-300">
                            {resourceType === 'community_posts'
                                ? t('community.replySection.beFirst', 'Sigues el primer!')
                                : t('comments.beTheFirst', 'Sigues el primer en participar!')}
                        </span>
                    </div>
                ) : (
                    <>
                        {hasMore && (
                            <button
                                type="button"
                                onClick={() => loadMore(25)}
                                disabled={isLoadingMore}
                                className="w-full py-1 text-xs font-semibold text-slate-500 hover:text-sky-400 transition-colors flex items-center justify-center gap-1.5"
                            >
                                {isLoadingMore ? (
                                    <div className="w-3.5 h-3.5 border-2 border-sky-400/30 border-t-sky-400 rounded-full animate-spin" />
                                ) : (
                                    <ChevronUp size={13} />
                                )}
                                <span>{isLoadingMore ? 'Carregant...' : 'Carregar comentaris anteriors...'}</span>
                            </button>
                        )}

                        {comments.map((comment) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                onReact={toggleReaction}
                                onReply={handleReply}
                                onDelete={handleDeleteRequest}
                                onNavigateToProfile={onNavigateToProfile}
                                forceExpanded={expandedThreadIds.has(comment.id)}
                            />
                        ))}
                    </>
                )}
                <div ref={commentsEndRef} />
            </div>

            {/* Input Area */}
            <div className="shrink-0 bg-transparent px-4 py-3 pb-8 sm:pb-4 relative">
                <CommentInput
                    onSubmit={async (content, replyTo, mentioned) => {
                        if (replyTo) {
                            const rootId = getRootCommentId(replyTo);
                            setExpandedThreadIds((prev) => new Set(prev).add(rootId));
                        }
                        await submitComment(content, replyTo, mentioned);
                        scrollToBottom();
                    }}
                    replyingTo={replyingTo}
                    onCancelReply={handleCancelReply}
                    allowGifs={allowGifs}
                    placeholder={
                        resourceType === 'community_posts'
                            ? t('community.replySection.placeholder', 'Afegeix una resposta...')
                            : t('comments.placeholder', 'Escriu un comentari... (@ per mencionar, Cmd+Enter)')
                    }
                />
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Eliminar comentari"
                message="Estàs segur que vols eliminar aquest comentari? Si té respostes anidades, es conservarà el fil mantenint el context de la conversa."
                confirmText="Eliminar"
                cancelText="Cancel·lar"
                isDestructive={true}
            />
        </div>
    );
};

export default UnifiedCommentFeed;
