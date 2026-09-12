import type { Timestamp } from 'firebase/firestore';

export type CommentResourceType = 'solutions' | 'community_posts';

export interface CommentReactionUser {
    emoji: string;
    username: string;
    userId: string;
}

export interface CommentEntity {
    id: string;
    userId: string;
    username: string;
    userAvatar: string;
    content: string;
    createdAt: Timestamp | null;
    updatedAt?: Timestamp | null;
    isEdited?: boolean;
    isDeleted?: boolean;
    // Map of userId -> reaction payload
    reactions: Record<string, CommentReactionUser>;
    replyCount: number;
    // Pointer to immediate parent comment, null for root comments
    parentId: string | null;
    // Context of the parent comment being replied to
    replyTo?: {
        id: string;
        username: string;
        content: string;
    } | null;
    // Populated dynamically in client-side tree reconstruction
    replies?: CommentEntity[];
}

export interface CommentInputPayload {
    content: string;
    parentId?: string | null;
    replyToObj?: CommentEntity | null;
}
