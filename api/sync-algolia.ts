import algoliasearch from 'algoliasearch';
import { withMiddleware, jsonResponse } from './_shared/middleware';
import { algoliaSyncRequestSchema } from './_shared/schemas';

let algoliaClient: ReturnType<typeof algoliasearch> | null = null;

export default withMiddleware(async function handler(req: Request, _userId?: string): Promise<Response> {
    const rawBody = await req.json().catch(() => ({}));
    const parseResult = algoliaSyncRequestSchema.safeParse(rawBody);

    if (!parseResult.success) {
        return jsonResponse({ error: 'Falten camps o format invàlid', details: parseResult.error.format() }, 400);
    }
    const { action, post, postId } = parseResult.data;

    const appId = process.env.VITE_ALGOLIA_APP_ID;
    const adminKey = process.env.ALGOLIA_ADMIN_KEY;

    if (!appId || !adminKey) {
        console.error('[Algolia Sync] Missing environment variables');
        return jsonResponse({ error: 'Algolia keys not configured' }, 500);
    }

    try {
        if (!algoliaClient) algoliaClient = algoliasearch(appId, adminKey);
        const index = algoliaClient.initIndex('apunts_posts');

        if (action === 'create' || action === 'update') {
            if (!post || !post.id) {
                return jsonResponse({ error: 'Post object with id is required' }, 400);
            }
            
            const record = {
                objectID: post.id,
                content: post.content,
                username: post.username,
                subject: post.subject,
                userId: post.userId,
                type: post.type,
                attachments: post.attachments?.map((a: { name: string }) => ({ name: a.name })) || [],
            };

            await index.saveObject(record);
            return jsonResponse({ success: true });
            
        } else if (action === 'delete') {
            if (!postId) {
                return jsonResponse({ error: 'postId is required' }, 400);
            }
            await index.deleteObject(postId);
            return jsonResponse({ success: true });
        } else {
            return jsonResponse({ error: 'Invalid action' }, 400);
        }
    } catch (error: unknown) {
        console.error('[Algolia Sync Error]', error);
        return jsonResponse({ error: 'Failed to sync to Algolia' }, 500);
    }
});
