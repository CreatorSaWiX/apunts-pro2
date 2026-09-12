import { buildCommentTree } from '../../utils/commentTree';
import type { CommentEntity } from '../../types/comments';

// Generate 1,000 synthetic comments with multi-level nested replies
const generateMockComments = (count: number): CommentEntity[] => {
    const comments: CommentEntity[] = [];

    for (let i = 0; i < count; i++) {
        // Every 3rd comment is a reply to an earlier comment
        const isReply = i > 0 && i % 3 !== 0;
        const parentId = isReply ? `comment_${Math.floor(Math.random() * i)}` : null;

        comments.push({
            id: `comment_${i}`,
            userId: `user_${i % 20}`,
            username: `User ${i}`,
            userAvatar: '',
            content: `This is comment ${i}`,
            createdAt: null,
            reactions: {},
            replyCount: 0,
            parentId: parentId,
            replyTo: parentId ? { id: parentId, username: `Parent`, content: 'parent content' } : null
        });
    }

    return comments;
};

const runBenchmark = () => {
    const sampleSize = 1000;
    const comments = generateMockComments(sampleSize);

    const start = performance.now();
    const tree = buildCommentTree(comments);
    const durationMs = performance.now() - start;

    console.log(`[BENCHMARK] Reconstructed tree for ${sampleSize} items in ${durationMs.toFixed(3)} ms`);

    // Verify all comments exist in either roots or nested replies
    let countInTree = 0;
    const countNodes = (nodes: CommentEntity[]) => {
        for (const node of nodes) {
            countInTree++;
            if (node.replies && node.replies.length > 0) {
                countNodes(node.replies);
            }
        }
    };
    countNodes(tree);

    if (countInTree !== sampleSize) {
        throw new Error(`Integrity check failed: Expected ${sampleSize} nodes, found ${countInTree}`);
    }

    console.log(`[VERIFICATION PASSED] 100% data integrity verified. No orphaned comments.`);
};

runBenchmark();
