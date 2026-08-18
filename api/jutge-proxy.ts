import { getProblemInfo } from '../src/lib/jutgeScraper.js';
import { withMiddleware, jsonResponse } from './_shared/middleware';

export default withMiddleware(async function handler(req: Request, userId?: string): Promise<Response> {
    if (req.method !== 'GET') {
        return jsonResponse({ error: 'Mètode no permès. Fes servir GET.' }, 405);
    }

    try {
        const url = new URL(req.url);
        const id = url.searchParams.get("id");
        const lang = url.searchParams.get("lang") || null;

        if (!id) {
            return jsonResponse({ error: 'Missing Problem ID' }, 400);
        }

        const result = await getProblemInfo(id, lang);

        const response = jsonResponse(result, 200);
        response.headers.set('Cache-Control', 's-maxage=86400, stale-while-revalidate=43200');
        return response;
    } catch (e: any) {
        console.error("[Vercel API] Proxy Error:", e);
        return jsonResponse({ error: 'Error intern del servidor' }, 500);
    }
}, { requireAuth: false });
