import { memo } from 'react';
import UnifiedCommentFeed from '../comments/UnifiedCommentFeed';

export interface ReplySectionProps {
    postId: string;
    postAuthorId: string;
    postContent: string;
    onNavigateToProfile?: (username: string) => void;
}

/**
 * Adapter wrapper for Community posts, routing to the unified high-performance comment engine.
 * Supports Markdown, depth-1 clean threads, custom emojis, mentions, and instant optimistic reactions.
 */
const ReplySectionComponent = ({
    postId,
    postAuthorId,
    postContent,
    onNavigateToProfile
}: ReplySectionProps) => {
    return (
        <UnifiedCommentFeed
            resourceType="community_posts"
            resourceId={postId}
            resourceTitle={postContent?.substring(0, 30)}
            postAuthorId={postAuthorId}
            onNavigateToProfile={onNavigateToProfile}
            allowGifs={true}
            className="h-full min-h-0 rounded-none border-none bg-transparent"
        />
    );
};

export const ReplySection = memo(ReplySectionComponent);
export default ReplySection;
