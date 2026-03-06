import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getProblemInfo } from '../src/lib/jutgeScraper.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Add CORS headers so we can access from the frontend in local development / prod
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

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

        const result = await getProblemInfo(id, lang, {
            JUTGE_EMAIL: process.env.JUTGE_EMAIL,
            JUTGE_PASSWORD: process.env.JUTGE_PASSWORD
        });

        // Set caching headers for the edge CDN
        res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=43200');
        res.status(200).json(result);
    } catch (e: any) {
        console.error("[Vercel API] Proxy Error:", e);
        res.status(500).json({ error: String(e.message || e) });
    }
}
