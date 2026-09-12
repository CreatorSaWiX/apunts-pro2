import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
    collection, query, orderBy, onSnapshot,
    addDoc, setDoc, updateDoc, doc, limitToLast,
    serverTimestamp, deleteField, type Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { buildCommentTree } from '../utils/commentTree';
import type { CommentEntity, CommentResourceType, CommentReactionUser } from '../types/comments';

export { buildCommentTree };

interface UseCommentsProps {
    resourceType: CommentResourceType; // 'solutions' | 'community_posts'
    resourceId: string;
    resourceTitle?: string;
    postAuthorId?: string;
    initialLimit?: number;
}

export const useComments = ({
    resourceType,
    resourceId,
    resourceTitle,
    postAuthorId,
    initialLimit = 50
}: UseCommentsProps) => {
    const { user } = useAuth();
    const [rawComments, setRawComments] = useState<CommentEntity[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [queryLimit, setQueryLimit] = useState(initialLimit);

    // Keep snapshot reference for optimistic rollback
    const rawCommentsRef = useRef<CommentEntity[]>([]);
    rawCommentsRef.current = rawComments;

    // Reset state when switching resources
    const lastResourceIdRef = useRef(resourceId);
    if (lastResourceIdRef.current !== resourceId) {
        lastResourceIdRef.current = resourceId;
        setRawComments([]);
        setLoading(true);
        setQueryLimit(initialLimit);
    }

    // Subcollection name in Firestore (preserves legacy data schema)
    const subcollectionName = resourceType === 'community_posts' ? 'replies' : 'comments';

    // 1. Real-time subscription to Firestore with database-level limitToLast
    useEffect(() => {
        if (!resourceId) return;

        // Only activate full-page loading skeletons when there are no comments loaded
        if (rawCommentsRef.current.length === 0) {
            setLoading(true);
        } else {
            setIsLoadingMore(true);
        }
        setError(null);

        const commentsColRef = collection(db, resourceType, resourceId, subcollectionName);
        // limitToLast ensures the newest comments are always retrieved in chronological order
        const q = query(commentsColRef, orderBy('createdAt', 'asc'), limitToLast(queryLimit));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const parsed: CommentEntity[] = snapshot.docs.map((d) => {
                    const data = d.data();
                    return {
                        id: d.id,
                        userId: data.userId || '',
                        username: data.username || 'Anònim',
                        userAvatar: data.userAvatar || '',
                        content: data.content || '',
                        createdAt: (data.createdAt as Timestamp) || null,
                        updatedAt: (data.updatedAt as Timestamp) || null,
                        isEdited: !!data.isEdited,
                        isDeleted: !!data.isDeleted,
                        reactions: (data.reactions as Record<string, CommentReactionUser>) || {},
                        replyCount: data.replyCount || 0,
                        parentId: data.parentId || data.replyTo?.id || null,
                        replyTo: data.replyTo || null
                    };
                });

                setRawComments(parsed);
                // If we received as many docs as requested, there might be older comments to paginate
                setHasMore(snapshot.docs.length >= queryLimit);
                setLoading(false);
                setIsLoadingMore(false);
            },
            (err) => {
                console.error(`[useComments] Error fetching ${resourceType}/${resourceId}:`, err);
                setError(err.message);
                setLoading(false);
                setIsLoadingMore(false);
            }
        );

        return () => unsubscribe();
    }, [resourceType, resourceId, subcollectionName, queryLimit]);

    // 2. Linear O(N) 1-level tree computation memoized on rawComments
    const threadedComments = useMemo(() => {
        return buildCommentTree(rawComments);
    }, [rawComments]);

    const totalCount = rawComments.length;

    // 3. Optimistic Reaction Mutation with isolated notification dispatch
    const toggleReaction = useCallback(
        async (commentId: string, emoji: string) => {
            if (!user) return;

            const previousComments = rawCommentsRef.current;
            const targetComment = previousComments.find((c) => c.id === commentId);
            if (!targetComment) return;

            const currentReaction = targetComment.reactions[user.id];
            const isRemoving = currentReaction?.emoji === emoji;

            // Optimistic local state update (0ms perception)
            const updatedComments = previousComments.map((c) => {
                if (c.id !== commentId) return c;
                const nextReactions = { ...c.reactions };
                if (isRemoving) {
                    delete nextReactions[user.id];
                } else {
                    nextReactions[user.id] = {
                        emoji,
                        username: user.username,
                        userId: user.id
                    };
                }
                return { ...c, reactions: nextReactions };
            });
            setRawComments(updatedComments);

            const commentDocRef = doc(db, resourceType, resourceId, subcollectionName, commentId);

            try {
                // Atomic reaction write to Firestore comment document
                if (isRemoving) {
                    await updateDoc(commentDocRef, {
                        [`reactions.${user.id}`]: deleteField()
                    });
                } else {
                    await updateDoc(commentDocRef, {
                        [`reactions.${user.id}`]: {
                            emoji,
                            username: user.username,
                            userId: user.id
                        }
                    });
                }

                // Isolated notification dispatch: a failure here MUST NOT rollback the reaction
                if (!isRemoving && targetComment.userId && targetComment.userId !== user.id) {
                    try {
                        const notifId = `reaction_${commentId}_${user.id}`;
                        await setDoc(doc(db, 'notifications', notifId), {
                            userId: targetComment.userId,
                            type: 'reaction',
                            content: emoji,
                            fromUserId: user.id,
                            fromUserName: user.username,
                            fromUserAvatar: user.avatar || '',
                            resourceId,
                            resourceType,
                            resourceTitle: resourceTitle || '',
                            commentId,
                            read: false,
                            createdAt: serverTimestamp()
                        });
                    } catch (notifErr) {
                        console.warn('[useComments] Non-critical notification dispatch failed:', notifErr);
                    }
                }
            } catch (err) {
                // Rollback optimistic update on comment write failure
                console.error('[useComments] Failed to toggle reaction, rolling back:', err);
                setRawComments(previousComments);
                throw err;
            }
        },
        [user, resourceType, resourceId, subcollectionName, resourceTitle]
    );

    // 4. Submit New Comment or Reply
    const submitComment = useCallback(
        async (
            content: string,
            replyingToObj: CommentEntity | null = null,
            mentionedUsers: Array<{ id: string; username: string } | string> = []
        ) => {
            if (!content.trim() || !user) return;

            setIsSubmitting(true);
            setError(null);

            const commentsColRef = collection(db, resourceType, resourceId, subcollectionName);

            try {
                // Keep queryLimit expanded so the new comment isn't pushed out
                setQueryLimit((prev) => prev + 1);

                const commentData: Record<string, any> = {
                    content: content.trim(),
                    userId: user.id,
                    username: user.username || 'Anònim',
                    userAvatar: user.avatar || '',
                    createdAt: serverTimestamp(),
                    reactions: {},
                    isDeleted: false,
                    isEdited: false
                };

                // Link reply context if replying
                if (replyingToObj) {
                    commentData.parentId = replyingToObj.id;
                    commentData.replyTo = {
                        id: replyingToObj.id,
                        username: replyingToObj.username,
                        content: replyingToObj.content.substring(0, 50) + (replyingToObj.content.length > 50 ? '...' : '')
                    };
                }

                const docRef = await addDoc(commentsColRef, commentData);

                // Asynchronous Isolated Notification Dispatch (reply + mentions)
                try {
                    // Reply notification
                    if (replyingToObj && replyingToObj.userId && replyingToObj.userId !== user.id) {
                        await addDoc(collection(db, 'notifications'), {
                            userId: replyingToObj.userId,
                            type: 'reply',
                            fromUserId: user.id,
                            fromUserName: user.username,
                            fromUserAvatar: user.avatar || '',
                            content: content.trim().substring(0, 100),
                            resourceId,
                            resourceType,
                            resourceTitle: resourceTitle || '',
                            commentId: docRef.id,
                            read: false,
                            createdAt: serverTimestamp()
                        });
                    }

                    // Post author notification
                    if (!replyingToObj && postAuthorId && postAuthorId !== user.id) {
                        await addDoc(collection(db, 'notifications'), {
                            userId: postAuthorId,
                            type: resourceType === 'community_posts' ? 'reply' : 'comment',
                            fromUserId: user.id,
                            fromUserName: user.username,
                            fromUserAvatar: user.avatar || '',
                            content: content.trim().substring(0, 100),
                            resourceId,
                            resourceType,
                            resourceTitle: resourceTitle || '',
                            commentId: docRef.id,
                            read: false,
                            createdAt: serverTimestamp()
                        });
                    }

                    // Mentions notification
                    if (mentionedUsers.length > 0) {
                        for (const item of mentionedUsers) {
                            const username = typeof item === 'string' ? item : item.username;
                            if (username && username !== user.username) {
                                await addDoc(collection(db, 'notifications'), {
                                    recipientUsername: username,
                                    type: 'mention',
                                    fromUserId: user.id,
                                    fromUserName: user.username,
                                    fromUserAvatar: user.avatar || '',
                                    content: content.trim().substring(0, 100),
                                    resourceId,
                                    resourceType,
                                    resourceTitle: resourceTitle || '',
                                    commentId: docRef.id,
                                    read: false,
                                    createdAt: serverTimestamp()
                                });
                            }
                        }
                    }
                } catch (notifErr) {
                    console.warn('[useComments] Non-critical notification dispatch error:', notifErr);
                }

                return docRef.id;
            } catch (err: any) {
                console.error('[useComments] Error submitting comment:', err);
                setError(err.message || 'Error en enviar el comentari');
                throw err;
            } finally {
                setIsSubmitting(false);
            }
        },
        [user, resourceType, resourceId, subcollectionName, resourceTitle, postAuthorId]
    );

    // 5. Delete Comment (Always Soft-delete to preserve tree integrity and prevent orphaned replies)
    const deleteComment = useCallback(
        async (commentId: string) => {
            const docRef = doc(db, resourceType, resourceId, subcollectionName, commentId);

            try {
                await updateDoc(docRef, {
                    isDeleted: true,
                    content: '[Aquest comentari ha estat suprimit]',
                    reactions: {},
                    updatedAt: serverTimestamp()
                });
            } catch (err) {
                console.error('[useComments] Error deleting comment:', err);
                throw err;
            }
        },
        [resourceType, resourceId, subcollectionName]
    );

    // 6. Pagination helper (fetches older comments via queryLimit expansion)
    const loadMore = useCallback((additional = 25) => {
        setIsLoadingMore(true);
        setQueryLimit((prev) => prev + additional);
    }, []);

    return {
        comments: threadedComments,
        rawComments,
        totalCount,
        loading,
        isLoadingMore,
        hasMore,
        isSubmitting,
        error,
        submitComment,
        toggleReaction,
        deleteComment,
        loadMore
    };
};
