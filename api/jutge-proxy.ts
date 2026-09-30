import { withMiddleware, jsonResponse } from './_shared/middleware.js';

export default withMiddleware(async function handler(req: Request, _userId?: string): Promise<Response> {
    if (req.method !== 'GET') {
        return jsonResponse({ error: 'Mètode no permès. Fes servir GET.' }, 405);
    }

    try {
        const url = new URL(req.url);
        const id = url.searchParams.get("id")?.replace(/[^a-zA-Z0-9_]/g, '');
        const lang = url.searchParams.get("lang") || 'ca';

        if (!id) {
            return jsonResponse({ error: 'Missing Problem ID' }, 400);
        }

        // Provar amb cada idioma en ordre de prioritat
        const priority = Array.from(new Set([lang, 'ca', 'en', 'es']));

        for (const l of priority) {
            const jutgeUrl = `https://jutge.org/problems/${id}_${l}`;
            const resp = await fetch(jutgeUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            });

            if (!resp.ok) continue;

            const html = await resp.text();
            if (html.includes('Login') || html.includes('Wrong URL') || html.length < 200) continue;

            // Retornar l'HTML cru embolcallat en JSON — el client fa el parsing
            const response = jsonResponse({ id, lang: l, html }, 200);
            response.headers.set('Cache-Control', 's-maxage=86400, stale-while-revalidate=43200');
            return response;
        }

        return jsonResponse({ error: 'Problem not found on Jutge.org' }, 404);
    } catch (e: unknown) {
        console.error("[Vercel API] Proxy Error:", e);
        return jsonResponse({ error: 'Error intern del servidor' }, 500);
    }
}, { requireAuth: false });

