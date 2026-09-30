export interface JutgeProblem {
    id: string;
    title: string;
    statement: string;
    url: string;
    source?: string;
    availableLanguages?: string[];
}

// --- Pre-scraped static statements (loaded on demand) ---
// This is the primary source — instant, no network, no errors.
// Loaded via dynamic import() so it creates a separate lazy chunk instead of bloating useSolutions.
let cachedStatements: Record<string, { title: string; statement: string; availableLanguages: string[] }> | null = null;

async function getStaticStatement(problemId: string, lang: string): Promise<JutgeProblem | null> {
    if (!cachedStatements) {
        try {
            const mod = await import('../content/data/jutge-statements.json');
            cachedStatements = (mod.default || mod) as unknown as Record<string, { title: string; statement: string; availableLanguages: string[] }>;
        } catch (e) {
            console.warn('[jutge] Failed to load static statements JSON:', e);
            cachedStatements = {};
        }
    }

    const cleanId = problemId.replace(/[^a-zA-Z0-9_]/g, '');
    const priority = Array.from(new Set([lang, 'ca', 'en', 'es']));

    for (const l of priority) {
        const key = `${cleanId}_${l}`;
        const entry = cachedStatements[key];
        if (entry && entry.statement) {
            return {
                id: cleanId,
                title: entry.title,
                statement: entry.statement,
                url: `https://jutge.org/problems/${cleanId}`,
                source: 'static-prescrape',
                availableLanguages: entry.availableLanguages
            };
        }
    }
    return null;
}

// --- Client-side fallback scraping via CORS proxy ---
// Replicates the server-side jutgeScraper.ts logic using the native browser DOMParser.

interface CorsProxy {
    makeUrl: (url: string) => string;
    extractHtml: (resp: Response) => Promise<string>;
}

const CORS_PROXIES: CorsProxy[] = [
    {
        // allorigins /get returns JSON { contents: "..." } with proper CORS headers
        makeUrl: (url) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
        extractHtml: async (resp) => {
            const json = await resp.json();
            return json.contents || '';
        },
    },
    {
        // codetabs proxy returns raw HTML
        makeUrl: (url) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
        extractHtml: async (resp) => resp.text(),
    },
];

async function clientSideScrape(problemId: string, lang: string): Promise<JutgeProblem | null> {
    const cleanId = problemId.replace(/[^a-zA-Z0-9_]/g, '');
    const priority = [lang, 'ca', 'en', 'es'];
    const uniqueLangs = Array.from(new Set(priority));

    for (const l of uniqueLangs) {
        const jutgeUrl = `https://jutge.org/problems/${cleanId}_${l}`;

        for (const proxy of CORS_PROXIES) {
            try {
                const proxyUrl = proxy.makeUrl(jutgeUrl);
                const resp = await fetch(proxyUrl);
                if (!resp.ok) continue;

                const html = await proxy.extractHtml(resp);
                if (!html || html.includes('Login') || html.includes('Wrong URL') || html.length < 200) continue;

                const result = parseJutgeHtml(html, cleanId, l);
                if (result) {
                    console.info(`[jutge] Client-side scrape OK via CORS proxy for ${cleanId}_${l}`);
                    return result;
                }
            } catch {
                continue;
            }
        }
    }

    return null;
}

function parseJutgeHtml(html: string, cleanId: string, lang: string): JutgeProblem | null {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Extract title
    let title = cleanId;
    const h1 = doc.querySelector('h1');
    if (h1) {
        h1.querySelectorAll('small, .pull-right').forEach(el => el.remove());
        const t = h1.textContent?.replace(/\s+/g, ' ').trim();
        if (t) {
            title = t.replace(new RegExp(`^${cleanId}\\.?\\s*`, 'i'), '').replace(new RegExp(`\\s*${cleanId}\\.?$`, 'i'), '').trim() || title;
        }
    }

    // Detect available languages
    const dLangs = new Set<string>();
    doc.querySelectorAll('a[href*="/problems/"]').forEach(el => {
        const href = el.getAttribute('href') || '';
        if (href.endsWith('_ca') || href.endsWith('/ca')) dLangs.add('ca');
        if (href.endsWith('_en') || href.endsWith('/en')) dLangs.add('en');
        if (href.endsWith('_es') || href.endsWith('/es')) dLangs.add('es');
    });
    if (lang) dLangs.add(lang);
    const availableLanguages = dLangs.size > 0 ? Array.from(dLangs) : ['ca', 'en', 'es'];

    // Extract statement content
    const content = doc.querySelector('#txt, .statement-section, .problem-statement, .enunciat, .panel-body');
    if (!content) return null;

    content.querySelectorAll('h1, button, script, style, nav, header, footer, .navbar, .breadcrumb, #header, #footer, .ui-layout-north, .ui-layout-south, .left-panel, .right-panel').forEach(el => el.remove());
    content.querySelectorAll('*').forEach(el => {
        if (el.textContent?.trim() === '' && el.children.length === 0 && el.tagName.toLowerCase() !== 'img') el.remove();
    });

    let statementHtml = content.innerHTML;
    if (!statementHtml.trim()) return null;

    // Post-processing (same as server-side jutgeScraper.ts)
    const postDoc = parser.parseFromString(statementHtml, 'text/html');

    postDoc.querySelectorAll('.collapse').forEach(el => el.classList.remove('collapse'));
    postDoc.querySelectorAll('.in').forEach(el => el.classList.remove('in'));

    postDoc.querySelectorAll('a[href^="problem://"]').forEach(el => {
        const parts = (el.getAttribute('href') || '').split('/');
        const lastPart = parts[parts.length - 1];
        if (lastPart) el.setAttribute('href', `https://jutge.org/problems/${lastPart.split('.')[0]}`);
    });

    postDoc.querySelectorAll('a').forEach(el => {
        const href = (el.getAttribute('href') || '').toLowerCase();
        if (href.startsWith('/')) el.setAttribute('href', `https://jutge.org${el.getAttribute('href')}`);
        el.setAttribute('target', '_blank');

        const isFileLink = href.includes('.pdf') || href.endsWith('/pdf') ||
            href.includes('.zip') || href.endsWith('/zip') ||
            href.includes('.tar') || href.endsWith('.tgz') ||
            href.includes('trashurl') ||
            href.includes('/main/') || href.includes('/solution/') ||
            Boolean(href.match(/\.(cc|hh|java|py|cpp|c\+\+)$/));

        if (isFileLink) {
            el.remove();
        } else {
            if (!el.querySelector('img')) {
                el.classList.add('text-emerald-400', 'hover:text-emerald-300', 'underline', 'underline-offset-4', 'decoration-emerald-500/30', 'transition-colors');
            } else {
                el.classList.add('inline-block', 'no-underline');
            }
        }
    });

    postDoc.querySelectorAll('img').forEach(el => {
        const originalSrc = el.getAttribute('src') || '';
        if (originalSrc.startsWith('/')) el.setAttribute('src', `https://jutge.org${originalSrc}`);

        const src = (el.getAttribute('src') || '').toLowerCase();
        if (src.match(/(\/icons\/|\/ico\/|ico_|icon_|f_pdf|f_zip|zip\.png|pdf\.png|public\.png)/)) {
            el.remove();
        } else {
            el.classList.add('content-image', 'block', 'max-w-full', 'h-auto', 'rounded-lg', 'my-6', 'shadow-md', 'border', 'border-white/10', 'mx-auto');
        }
    });

    // Remove empty anchor tags left behind by removed icons
    postDoc.querySelectorAll('a').forEach(el => {
        if (!el.textContent?.trim() && !el.querySelector('img, svg')) {
            el.remove();
        }
    });

    // Remove empty paragraphs and whitespace
    postDoc.querySelectorAll('p').forEach(p => {
        if (!p.textContent?.trim() && !p.querySelector('img, svg')) {
            p.remove();
        }
    });

    statementHtml = postDoc.body.innerHTML.trim();

    return {
        id: cleanId,
        title,
        statement: statementHtml,
        url: `https://jutge.org/problems/${cleanId}`,
        source: 'client-scraping',
        availableLanguages
    };
}

// --- Main fetch function ---
// Strategy:
//   1) Instant lookup from pre-scraped static JSON (0ms, always works)
//   2) Fallback: Vercel proxy (for problems not in static data, e.g. user-uploaded)
//   3) Fallback: Client-side CORS proxy scraping

export const fetchJutgeProblem = async (problemId: string, lang: string = 'ca'): Promise<JutgeProblem | null> => {
    // 1. ⚡ Try pre-scraped static data FIRST (instant, no network)
    const staticResult = await getStaticStatement(problemId, lang);
    if (staticResult) {
        return staticResult;
    }

    // 2. Try Vercel serverless proxy (returns raw HTML wrapped in JSON)
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(`/api/jutge-proxy?id=${problemId}&lang=${lang}&v=${Date.now()}`, {
            signal: controller.signal
        });
        clearTimeout(timeout);

        if (response.ok) {
            const data = await response.json();
            if (data.html) {
                // El proxy retorna { id, lang, html } — parsegem l'HTML al client
                const result = parseJutgeHtml(data.html, data.id || problemId, data.lang || lang);
                if (result) {
                    result.source = 'vercel-proxy';
                    return result;
                }
            }
        }
        console.warn(`[jutge] Vercel proxy returned ${response.status}, trying client-side fallback...`);
    } catch (error) {
        console.warn(`[jutge] Vercel proxy failed:`, error);
    }

    // 3. Fallback: client-side scraping via CORS proxy
    try {
        const result = await clientSideScrape(problemId, lang);
        if (result) return result;
    } catch (error) {
        console.warn(`[jutge] Client-side scraping also failed:`, error);
    }

    // 4. Return error fallback
    return {
        id: problemId,
        title: `Error carregant ${problemId}`,
        statement: `<div class="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200">
            <p class="font-bold">No s'ha pogut carregar l'enunciat des del portal web.</p>
            <p class="text-sm opacity-80 mt-2">És possible que el problema no estigui disponible públicament o hi hagi un error de connexió.</p>
            <a href="https://jutge.org/problems/${problemId}" target="_blank" class="block mt-4 text-emerald-400 hover:underline">
                Veure manualment a Jutge.org &rarr;
            </a>
        </div>`,
        url: `https://jutge.org/problems/${problemId}`,
        source: 'error'
    };
};

export const isJutgeProblem = (problemId: string, topicId?: string): boolean => {
    return /^[A-Z0-9]{6}$/.test(problemId) && (topicId?.startsWith('pro2-') || topicId?.startsWith('eda-') || false);
};

export const getJutgeUrl = (problemId: string): string => {
    return `https://jutge.org/problems/${problemId}`;
};
