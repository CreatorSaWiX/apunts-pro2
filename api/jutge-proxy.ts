import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getProblemInfo } from '../src/lib/jutgeScraper';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { id, lang } = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid problem ID' });
    }

    const reqLang = typeof lang === 'string' ? lang : null;

    try {
        const result = await getProblemInfo(id, reqLang, {
            JUTGE_EMAIL: process.env.JUTGE_EMAIL,
            JUTGE_PASSWORD: process.env.JUTGE_PASSWORD,
            JUTGE_COOKIE: process.env.JUTGE_COOKIE
        });

        // Cache for 1 day (CDN) and up to 1 week stale-while-revalidate
        res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');

        return res.status(200).json(result);

    } catch (error) {
        console.error('Error fetching from Jutge API:', error);
        return res.status(500).json({
            error: 'Failed to fetch problem data',
            details: error instanceof Error ? error.message : String(error)
        });
    }
}
