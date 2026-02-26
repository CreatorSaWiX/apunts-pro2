import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as cheerio from 'cheerio';

async function jsonRpc(endpoint: string, method: string, params: any, token?: string) {
    const headers: any = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (process.env.JUTGE_COOKIE) headers['Cookie'] = process.env.JUTGE_COOKIE;

    const response = await fetch(`https://api.jutge.org/api/${endpoint}/${method}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ params, version: "1.0", id: 1 })
    });

    if (!response.ok) throw new Error(`API Error ${response.status}: ${response.statusText}`);
    const data = await response.json();
    if (data.error) throw new Error(data.error.message || 'Unknown API Error');
    return data.result;
}

async function getJutgeToken() {
    if (process.env.JUTGE_EMAIL && process.env.JUTGE_PASSWORD) {
        try {
            console.log("Attempting automatic login via API...");
            const token = await jsonRpc('auth', 'login', {
                email: process.env.JUTGE_EMAIL,
                password: process.env.JUTGE_PASSWORD
            });
            console.log("Login successful!");
            return token;
        } catch (e) {
            console.error("Login failed:", e);
        }
    } else {
        console.warn("Missing JUTGE_EMAIL or JUTGE_PASSWORD in environment variables.");
    }
    return null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { id, lang } = req.query; // Llegim 'lang'

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid problem ID' });
    }

    const cleanId = id.replace(/[^a-zA-Z0-9_]/g, '');
    const reqLang = typeof lang === 'string' ? lang : null;

    try {
        let statementHtml = '';
        let title = cleanId;
        let source = 'scraping'; // Default

        const token = await getJutgeToken();

        // Estratègia d'idiomes
        const priority = reqLang ? [reqLang, 'ca', 'en', 'es'] : ['ca', 'en', 'es'];
        const uniqueLangs = [...new Set(priority)];

        const fetchStatementApi = async (l: string) => {
            if (!token) return null;
            try {
                const html = await jsonRpc('problems', 'getHtmlStatement', { problem_nm: cleanId, lang: l }, token);
                return html;
            } catch (e) { return null; }
        };

        const fetchScraping = async (l: string) => {
            try {
                const urlId = l ? `${cleanId}_${l}` : cleanId;
                const url = `https://jutge.org/problems/${urlId}`;

                const headers: any = { 'User-Agent': 'Mozilla/5.0 (compatible; ApuntsBot/1.0)' };
                if (token) headers['Cookie'] = `PHPSESSID=${token}`;

                const resp = await fetch(url, { headers });
                if (resp.ok) {
                    const html = await resp.text();
                    if (!html.includes('Login') && !html.includes('Wrong URL')) {
                        const $ = cheerio.load(html);

                        // Títol scraping
                        const t = $('h1').first().text().trim();
                        if (t) title = t.replace(new RegExp(`^${cleanId}\\.?\\s*`, 'i'), '');

                        const combinedContent = $('<div></div>');
                        const content = $('#txt, .statement-section, .problem-statement, .enunciat, .panel-body').first();
                        
                        if (content.length) {
                            content.find('h1, button, script, style, nav, header, footer, .navbar, .breadcrumb, #header, #footer, .ui-layout-north, .ui-layout-south, .left-panel, .right-panel').remove();
                            content.find('*').each((_, el) => {
                                if ($(el).text().trim() === '' && $(el).children().length === 0 && !$(el).is('img')) $(el).remove();
                            });
                            combinedContent.append(content.html() || '');
                        }

                        // Extraiem els Public test cases
                        $('.panel.panel-default').each((_, el) => {
                            const heading = $(el).find('.panel-heading').text().trim().toLowerCase();
                            if (heading.includes('public test cases') || heading.includes('jocs de prova') || heading.includes('casos de prueba')) {
                                const testCasePanel = $(el).clone();
                                testCasePanel.find('.panel-heading').remove();
                                testCasePanel.find('.pull-right').remove();
                                testCasePanel.find('.vertical-view').remove();
                                testCasePanel.find('button, script, style').remove();
                                
                                combinedContent.append('<div class="mt-12 pt-8 border-t border-sky-500/10"></div>');
                                combinedContent.append('<h2 class="text-xl font-bold mb-6 text-sky-400">Exemples (Jocs de proves públics)</h2>');
                                
                                const listGroup = testCasePanel.find('.list-group');
                                if (listGroup.length) {
                                    combinedContent.append(listGroup.html() || '');
                                } else {
                                    combinedContent.append(testCasePanel.html() || '');
                                }
                            }
                        });

                        if (combinedContent.children().length > 0) {
                            return combinedContent.html() || '';
                        }
                    }
                }
            } catch (ex) { console.error(ex); }
            return null;
        };

        // 1. Scraping (Primary) per tenir codi + test cases
        for (const l of uniqueLangs) {
            const scraped = await fetchScraping(l);
            if (scraped) { statementHtml = scraped; source = 'scraping-primary'; break; }
        }
        if (!statementHtml && uniqueLangs.length === 0) {
            const scraped = await fetchScraping('');
            if (scraped) { statementHtml = scraped; source = 'scraping-primary'; }
        }

        // 2. Fallback API (si scraping falla)
        if (!statementHtml && token) {
            source = 'api-fallback';
            for (const l of uniqueLangs) {
                const html = await fetchStatementApi(l);
                if (html) {
                    statementHtml = html;
                    if (!title || title === cleanId) {
                        try {
                            const pData = await jsonRpc('problems', 'getProblem', { problem_nm: cleanId }, token);
                            if (pData?.title) title = pData.title;
                        } catch (e) { }
                    }
                    break;
                }
            }
        }

        if (!statementHtml) {
            return res.status(404).json({ error: 'Problem content not found' });
        }

        // Post-processat comú
        const $ = cheerio.load(statementHtml, null, false);
        let availableLanguages = ['ca', 'en', 'es'];

        // 1. FIX: Convertir enllaços 'problem://' a normals
        $('a[href^="problem://"]').each((_, el) => {
            const href = $(el).attr('href') || '';
            const parts = href.split('/');
            const lastPart = parts[parts.length - 1];
            if (lastPart) {
                const problemId = lastPart.split('.')[0];
                $(el).attr('href', `https://jutge.org/problems/${problemId}`);
            }
        });

        // 2. TRACTAMENT BADGES I FITXERS
        $('a').each((_, el) => {
            const href = ($(el).attr('href') || '').toLowerCase(); // Lowercase per detectar millor
            const $el = $(el);

            if (href.startsWith('/')) $el.attr('href', `https://jutge.org${href}`);
            $el.attr('target', '_blank');

            const isPdf = href.includes('.pdf') || href.endsWith('/pdf');
            const isZip = href.includes('.zip') || href.endsWith('/zip');
            const isTar = href.includes('.tar') || href.endsWith('.tgz');
            const isCode = href.includes('.cc') || href.includes('.hh') || href.includes('.java') || href.includes('.py') || href.includes('.cpp') || href.includes('.c++');
            const isTrash = href.includes('trashurl');

            if (isPdf || isZip || isTar || isCode || isTrash) {
                $el.find('img').remove();
                $el.addClass('file-badge');

                const iPdf = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="mr-1.5"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>`;
                const iZip = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="mr-1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`;
                const iTar = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="mr-1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`;
                const iCode = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="mr-1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`;

                if (isPdf) $el.addClass('pdf').html(`${iPdf}<span>PDF</span>`);
                else if (isZip) $el.addClass('zip').html(`${iZip}<span>ZIP</span>`);
                else if (isTar) $el.addClass('tar bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/40').html(`${iTar}<span>TAR</span>`);
                else if (isCode) $el.addClass('code').html(`${iCode}<span>CODI</span>`);
                else if (isTrash) $el.remove();
            } else {
                // Links normals
                if (!$el.find('img').length) {
                    $el.addClass('text-emerald-400 hover:text-emerald-300 underline underline-offset-4 decoration-emerald-500/30 transition-colors');
                } else {
                    // Imatges dins de links (diagrames clicables)
                    $el.addClass('inline-block no-underline');
                }
            }
        });

        // 3. Imatges soltes (Diagrames)
        $('img').each((_, el) => {
            const src = ($(el).attr('src') || '').toLowerCase();
            const originalSrc = $(el).attr('src') || '';
            if (originalSrc.startsWith('/')) $(el).attr('src', `https://jutge.org${originalSrc}`);

            // Neteja extra per si queda alguna icona solta
            const isLegacyIcon = src.includes('/icons/') || src.includes('/ico/') || src.includes('ico_') || src.includes('icon_') || src.includes('f_pdf') || src.includes('f_zip') || src.includes('zip.png') || src.includes('pdf.png') || src.includes('public.png');

            if (isLegacyIcon) {
                $(el).remove();
            } else {
                $(el).addClass('content-image block max-w-full h-auto rounded-lg my-6 shadow-md border border-white/10 mx-auto');
            }
        });


        // Cache per 1 dia (CDN) i fins a 1 setmana stale-while-revalidate
        res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');

        return res.status(200).json({
            id: cleanId,
            title: title,
            statement: $.html(),
            url: `https://jutge.org/problems/${cleanId}`,
            source: source,
            availableLanguages
        });

    } catch (error) {
        console.error('Error fetching from Jutge API:', error);
        res.status(500).json({
            error: 'Failed to fetch problem data',
            details: error instanceof Error ? error.message : String(error)
        });
    }
}
