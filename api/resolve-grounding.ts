import { withMiddleware, jsonResponse } from './_shared/middleware';
import { resolveGroundingChunks } from './_shared/grounding';

export default withMiddleware(async function handler(req: Request): Promise<Response> {
    if (req.method !== 'POST') {
        return jsonResponse({ error: 'Mètode no permès' }, 405);
    }

    const rawBody = await req.json().catch(() => ({}));
    const chunks = rawBody?.chunks;

    if (!Array.isArray(chunks)) {
        return jsonResponse({ error: 'Camp "chunks" invàlid o absent' }, 400);
    }

    await resolveGroundingChunks(chunks);

    return jsonResponse({ chunks });
}, { requireAuth: false });
