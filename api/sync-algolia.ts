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

            // Validació d'autorització estricta (Hard check): l'usuari ha d'estar autenticat i coincidir amb l'autor
            if (!_userId || !post.userId || post.userId !== _userId) {
                return jsonResponse({ error: 'No autoritzat a sincronitzar posts d\'un altre usuari' }, 403);
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
            if (!_userId) {
                return jsonResponse({ error: 'No autoritzat' }, 401);
            }

            // Validació d'autorització per a l'eliminació: comprovem si el registre pertany a l'usuari
            try {
                const existingRecord = await index.getObject<{ userId?: string }>(postId);
                if (existingRecord.userId && existingRecord.userId !== _userId) {
                    return jsonResponse({ error: 'No autoritzat a esborrar posts d\'un altre usuari' }, 403);
                }
            } catch (err: any) {
                // Si el post ja no existia a l'índex (404), considerem l'eliminació com a satisfeta
                if (err?.status === 404) {
                    return jsonResponse({ success: true });
                }
                throw err;
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
