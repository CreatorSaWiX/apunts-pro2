/**
 * Utilitats per a la gestió i resolució de fonts web de Google Search Grounding.
 */

/**
 * Extreu un títol humà i net a partir dels segments de la ruta d'una URL
 * (ex: "https://www.fcbarcelona.cat/ca/club/agenda" -> "Club › Agenda").
 */
export function extractTitleFromPath(urlStr: string): string {
    try {
        const url = new URL(urlStr);
        const segments = url.pathname
            .split('/')
            .filter(Boolean)
            .filter(s => !['ca', 'es', 'en', 'cat', 'fr', 'de', 'index', 'default', 'home'].includes(s.toLowerCase()))
            // Ignorem segments purament numèrics o hashes/UUIDs llargs
            .filter(s => !/^\d+$/.test(s) && !/^[0-9a-f]{16,}$/i.test(s));

        if (segments.length > 0) {
            const relevant = segments.slice(-2).map(s =>
                decodeURIComponent(s)
                    .replace(/[-_]+/g, ' ')
                    .replace(/\.[a-zA-Z0-9]+$/, '')
                    .trim()
            ).filter(Boolean);

            if (relevant.length > 0) {
                return relevant
                    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
                    .join(' › ');
            }
        }
    } catch {
        // En cas d'error de parsing d'URL
    }
    return '';
}

/**
 * Resol les URLs de redirecció de Google Vertex AI Search per obtenir la URL directa
 * i el títol real de la pàgina/secció consultada.
 *
 * S'executa amb un timeout estricte per no endarrerir mai la resposta en streaming.
 */
export async function resolveGroundingChunks(chunks: any[], timeoutMs = 1000): Promise<void> {
    if (!Array.isArray(chunks) || chunks.length === 0) return;

    await Promise.allSettled(
        chunks.map(async (chunk) => {
            const uri = chunk?.web?.uri;
            if (!uri || typeof uri !== 'string') return;

            // Només cal resoldre si és un redirect opac de Google / Vertex AI Search
            if (!uri.includes('vertexaisearch.cloud.google.com') && !uri.includes('google.com/grounding-api-redirect')) {
                return;
            }

            try {
                const controller = new AbortController();
                const timer = setTimeout(() => controller.abort(), timeoutMs);

                const response = await fetch(uri, {
                    method: 'HEAD',
                    redirect: 'manual',
                    signal: controller.signal,
                });
                clearTimeout(timer);

                const targetLocation = response.headers.get('location');
                if (targetLocation && targetLocation.startsWith('http')) {
                    chunk.web.uri = targetLocation;

                    const rawTitle = (chunk.web.title || '').trim();
                    let hostname = '';
                    try {
                        hostname = new URL(targetLocation).hostname.replace(/^www\./, '');
                    } catch {}

                    const isOnlyDomainTitle =
                        !rawTitle ||
                        rawTitle.toLowerCase() === hostname.toLowerCase() ||
                        rawTitle.toLowerCase() === `www.${hostname}`.toLowerCase();

                    // Si Google només havia posat el nom del domini, provem d'extreure el títol de la secció
                    if (isOnlyDomainTitle) {
                        const pathTitle = extractTitleFromPath(targetLocation);
                        if (pathTitle) {
                            chunk.web.title = pathTitle;
                        }
                    }
                }
            } catch {
                // Fallback silenciós: es manté la URI i títol originals de Google
            }
        })
    );
}
