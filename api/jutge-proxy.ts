import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getProblemInfo } from '../src/lib/jutgeScraper.js';
import { CORS_HEADERS } from './_shared/cors';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    Object.entries(CORS_HEADERS).forEach(([key, value]) => {
        res.setHeader(key, value);
    });

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const id = req.query.id as string;
        const lang = (req.query.lang as string) || null;

        if (!id) {
            return res.status(400).json({ error: 'Missing Problem ID' });
        }

        const result = await getProblemInfo(id, lang);

        // Set caching headers for the edge CDN
        res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=43200');
        res.status(200).json(result);
    } catch (e: any) {
        console.error("[Vercel API] Proxy Error:", e);
        res.status(500).json({ error: 'Error intern del servidor' });
    }
}
