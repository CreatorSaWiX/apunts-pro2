import algoliasearch from 'algoliasearch';

const CORS_HEADERS: Record<string, string> = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
    'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
};

function jsonResponse(data: any, status: number = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            ...CORS_HEADERS
        }
    });
}

export default async function handler(req: Request) {
    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: CORS_HEADERS });
    }

    if (req.method !== 'POST') {
        return jsonResponse({ error: 'Method not allowed' }, 405);
    }

    try {
        const body = await req.json();
        const { action, post, postId } = body;

        const appId = process.env.VITE_ALGOLIA_APP_ID;
        const adminKey = process.env.ALGOLIA_ADMIN_KEY;

        if (!appId || !adminKey) {
            console.error('[Algolia Sync] Missing environment variables');
            return jsonResponse({ error: 'Algolia keys not configured' }, 500);
        }

        const client = algoliasearch(appId, adminKey);
        const index = client.initIndex('apunts_posts');

        if (action === 'create' || action === 'update') {
            if (!post || !post.id) {
                return jsonResponse({ error: 'Post object with id is required' }, 400);
            }
            
            // Construim el record (evitant guardar camps innecessaris i pesats)
            const record = {
                objectID: post.id,
                content: post.content,
                username: post.username,
                subject: post.subject,
                userId: post.userId,
                type: post.type,
                attachments: post.attachments?.map((a: any) => ({ name: a.name })) || [],
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
    } catch (error: any) {
        console.error('[Algolia Sync Error]', error);
        return jsonResponse({ error: 'Failed to sync to Algolia' }, 500);
    }
}
