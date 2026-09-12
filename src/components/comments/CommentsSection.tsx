import UnifiedCommentFeed from './UnifiedCommentFeed';

export interface CommentsSectionProps {
    solutionId: string;
    solutionTitle?: string;
}

/**
 * Adapter wrapper for Solutions, routing to the unified high-performance comment engine.
 */
export const CommentsSection = ({ solutionId, solutionTitle }: CommentsSectionProps) => {
    return (
        <UnifiedCommentFeed
            resourceType="solutions"
            resourceId={solutionId}
            resourceTitle={solutionTitle}
            allowGifs={true}
            className="mt-8 mb-12 shadow-xl"
        />
    );
};

export default CommentsSection;
