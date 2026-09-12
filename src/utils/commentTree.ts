import type { CommentEntity } from '../types/comments';

/**
 * Reconstructs a flat list of comments into a clean 1-level threaded tree (Instagram/TikTok/Twitter standard).
 * Guarantees O(N) time and space complexity.
 * All nested replies are attached to their root ancestor so that mobile and sidebar layouts never suffer
 * from infinite horizontal indentation squeezing or nested accordions.
 */
export const buildCommentTree = (flatComments: CommentEntity[]): CommentEntity[] => {
    const roots: CommentEntity[] = [];
    const byId = new Map<string, CommentEntity>();

    // Pass 1: O(N) Indexing with isolated replies array
    for (let i = 0; i < flatComments.length; i++) {
        const c = flatComments[i];
        byId.set(c.id, {
            ...c,
            replies: []
        });
    }

    // Helper to find root ancestor with memoization / path compression
    const rootCache = new Map<string, string>();
    const findRootId = (nodeId: string): string => {
        if (rootCache.has(nodeId)) return rootCache.get(nodeId)!;

        let currentId = nodeId;
        const visited = new Set<string>();

        while (byId.has(currentId) && !visited.has(currentId) && visited.size < 50) {
            visited.add(currentId);
            const node = byId.get(currentId)!;
            const parentId = node.parentId || node.replyTo?.id || null;

            if (parentId && byId.has(parentId)) {
                currentId = parentId;
            } else {
                break;
            }
        }

        rootCache.set(nodeId, currentId);
        return currentId;
    };

    // Pass 2: O(N) Direct pointer linkage to root comments
    for (let i = 0; i < flatComments.length; i++) {
        const original = flatComments[i];
        const node = byId.get(original.id)!;
        const directParentId = original.parentId || original.replyTo?.id || null;

        if (directParentId && byId.has(directParentId)) {
            // Find root ancestor so all replies sit at depth 1 under the root
            const rootId = findRootId(directParentId);
            const rootNode = byId.get(rootId);

            if (rootNode && rootNode.id !== node.id) {
                rootNode.replies!.push(node);
            } else {
                roots.push(node);
            }
        } else {
            roots.push(node);
        }
    }

    return roots;
};
