/**
 * Utilitat per a la gestió d'enllaços multimèdia.
 * Prioritat 1: Enllaç directe a Cloudflare R2 (0 consum d'amplada de banda a Vercel, transferència 100% gratuïta).
 * Prioritat 2 (Fallback): Proxy transparent /cdn/ de Vercel (només si la connexió a R2 falla o fa timeout per bloquejos d'operadors).
 */

const R2_PUBLIC_BASE = 'https://pub-b67ee6442b98462db44a968a86d3b036.r2.dev';

export function extractObjectKey(url?: string | null): string | null {
    if (!url) return null;
    if (url.startsWith('data:') || url.startsWith('blob:')) return null;

    if (url.startsWith('/cdn/')) return url.substring(5);
    if (url.startsWith('/api/cdn/')) return url.substring(9);
    
    if (url.includes('.r2.dev/')) {
        return url.split('.r2.dev/')[1]?.split('?')[0] || null;
    }
    
    if (url.includes('.r2.cloudflarestorage.com/')) {
        const parts = url.split('.r2.cloudflarestorage.com/')[1]?.split('/');
        return (parts && parts.length > 1) ? parts.slice(1).join('/').split('?')[0] : null;
    }

    return null;
}

/** Retorna la URL directa de Cloudflare R2 per estalviar consum a Vercel */
export function getDirectR2Url(url?: string | null): string | undefined {
    if (!url) return undefined;
    if (url.startsWith('data:') || url.startsWith('blob:')) return url;

    const key = extractObjectKey(url);
    if (key) {
        return `${R2_PUBLIC_BASE}/${key.replace(/^\//, '')}`;
    }
    return url;
}

/** Retorna la URL de rescat a través del proxy de Vercel (/cdn/...) */
export function getProxyVercelUrl(url?: string | null): string | undefined {
    if (!url) return undefined;
    if (url.startsWith('data:') || url.startsWith('blob:')) return url;

    const key = extractObjectKey(url);
    if (key) {
        return `/cdn/${key.replace(/^\//, '')}`;
    }
    return url;
}

/** Per defecte resol a través del proxy /cdn/ de Vercel per evitar bloquejos d'ISP */
export function resolveMediaUrl(url?: string | null): string | undefined {
    return getProxyVercelUrl(url);
}

export function isVideoUrl(url?: string | null): boolean {
    if (!url) return false;
    return /\.(mp4|webm|mov|ogg)$/i.test(url.split('?')[0]);
}
