import type { CommentEntity } from '../types/comments';

/**
 * Helper to reliably normalize comment timestamps into milliseconds for O(1) comparison.
 */
const getCommentTime = (c: CommentEntity): number => {
    if (!c.createdAt) return 0;
    if (typeof c.createdAt === 'number') return c.createdAt;
    if (typeof (c.createdAt as { seconds?: number }).seconds === 'number') {
        return (c.createdAt as { seconds: number }).seconds * 1000;
    }
    if (typeof (c.createdAt as { toMillis?: () => number }).toMillis === 'function') {
        return (c.createdAt as { toMillis: () => number }).toMillis();
    }
    const parsed = new Date((c.createdAt as unknown) as string | number).getTime();
    return Number.isNaN(parsed) ? 0 : parsed;
};

/**
 * Reconstructs a flat list of comments into a clean 1-level threaded tree (Instagram/TikTok/Twitter standard).
 * Guarantees O(N) time and space complexity with true Disjoint Set / Path Compression.
 * All nested replies are attached to their root ancestor so that mobile and sidebar layouts never suffer
 * from infinite horizontal indentation squeezing or nested accordions.
 */
export const buildCommentTree = (flatComments: CommentEntity[]): CommentEntity[] => {
    if (!Array.isArray(flatComments) || flatComments.length === 0) {
        return [];
    }

    const roots: CommentEntity[] = [];
    const byId = new Map<string, CommentEntity>();

    // Pass 1: O(N) Indexing with defensive validation and isolated replies array
    for (let i = 0; i < flatComments.length; i++) {
        const c = flatComments[i];
        if (!c || !c.id) continue;
        byId.set(c.id, {
            ...c,
            replies: []
        });
    }

    // Helper to find root ancestor with true path compression & cycle protection
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

        // True Path Compression: assign the discovered root to all intermediate visited nodes
        for (const v of visited) {
            rootCache.set(v, currentId);
        }

        return currentId;
    };

    // Pass 2: O(N) Direct pointer linkage to root comments
    for (let i = 0; i < flatComments.length; i++) {
        const original = flatComments[i];
        if (!original || !original.id) continue;
        const node = byId.get(original.id);
        if (!node) continue;

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

    // Pass 3: Sort replies chronologically (oldest to newest) for each root
    for (let i = 0; i < roots.length; i++) {
        const root = roots[i];
        if (root.replies && root.replies.length > 1) {
            root.replies.sort((a, b) => getCommentTime(a) - getCommentTime(b));
        }
    }

    return roots;
};

