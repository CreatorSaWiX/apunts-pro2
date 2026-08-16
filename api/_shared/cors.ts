export const CORS_HEADERS: Record<string, string> = {
    'Access-Control-Allow-Origin': process.env.VITE_APP_URL || '*', // Should restrict in production
    'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
    'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
};

export function handleCors(req: Request) {
    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: CORS_HEADERS });
    }
    return null;
}
