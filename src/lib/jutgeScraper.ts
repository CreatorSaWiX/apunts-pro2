import * as cheerio from 'cheerio';

interface JutgeEnv {
    JUTGE_EMAIL?: string;
    JUTGE_PASSWORD?: string;
    JUTGE_COOKIE?: string; // For testing in some environments
}

export async function getProblemInfo(id: string, reqLang: string | null, env: JutgeEnv) {
    let cleanId = id.replace(/[^a-zA-Z0-9_]/g, '');
    let statementHtml = '';
    let title = cleanId;
    let source = 'scraping';
    let availableLanguages = ['ca', 'en', 'es'];

    async function jsonRpc(endpoint: string, method: string, params: any, token?: string | null) {
        const headers: any = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        if (env.JUTGE_COOKIE) headers['Cookie'] = env.JUTGE_COOKIE;

        const response = await fetch(`https://api.jutge.org/api/${endpoint}/${method}`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ params, version: "1.0", id: 1 })
        });

        if (!response.ok) throw new Error(`API Error ${response.status}: ${response.statusText}`);
        const data: any = await response.json();
        if (data.error) throw new Error(data.error.message || 'Unknown API Error');
        return data.result;
    }

    async function getJutgeToken() {
        if (env.JUTGE_EMAIL && env.JUTGE_PASSWORD) {
            try {
                const token = await jsonRpc('auth', 'login', {
                    email: env.JUTGE_EMAIL,
                    password: env.JUTGE_PASSWORD
                });
                return token;
            } catch (e) {
                console.error("[JutgeScraper] Login failed:", e);
            }
        }
        return null;
    }

    const token = await getJutgeToken();

    const priority = reqLang ? [reqLang, 'ca', 'en', 'es'] : ['ca', 'en', 'es'];
    const uniqueLangs = [...new Set(priority)];

    const fetchStatementApi = async (l: string) => {
        if (!token) return null;
        try {
            return await jsonRpc('problems', 'getHtmlStatement', { problem_nm: cleanId, lang: l }, token);
        } catch (e) { return null; }
    };

    const fetchScraping = async (l: string) => {
        try {
            const urlId = l ? `${cleanId}_${l}` : cleanId;
            const url = `https://jutge.org/problems/${urlId}`;
            const headers: any = { 'User-Agent': 'Mozilla/5.0 (compatible; ApuntsBot/1.0)' };
            if (token) headers['Cookie'] = `PHPSESSID=${token}`;

            const resp = await fetch(url, { headers });
            if (!resp.ok) return null;

            const html = await resp.text();
            if (html.includes('Login') || html.includes('Wrong URL')) return null;

            const $ = cheerio.load(html);
            const t = $('h1').first().text().trim();
            if (t) title = t.replace(new RegExp(`^${cleanId}\\.?\\s*`, 'i'), '');

            // Detecció idiomes (es passa a través dels links if scraping worked)
            const dLangs = new Set<string>();
            $('a[href*="/problems/"]').each((_, el) => {
                const href = $(el).attr('href') || '';
                if (href.endsWith('_ca') || href.endsWith('/ca')) dLangs.add('ca');
                if (href.endsWith('_en') || href.endsWith('/en')) dLangs.add('en');
                if (href.endsWith('_es') || href.endsWith('/es')) dLangs.add('es');
            });
            if (l) dLangs.add(l);
            if (dLangs.size > 0) availableLanguages = Array.from(dLangs);

            const combinedContent = $('<div></div>');
            const content = $('#txt, .statement-section, .problem-statement, .enunciat, .panel-body').first();

            if (content.length) {
                content.find('h1, button, script, style, nav, header, footer, .navbar, .breadcrumb, #header, #footer, .ui-layout-north, .ui-layout-south, .left-panel, .right-panel').remove();
                content.find('*').each((_, el) => {
                    if ($(el).text().trim() === '' && $(el).children().length === 0 && !$(el).is('img')) $(el).remove();
                });
                combinedContent.append(content.html() || '');
            }

            $('.panel.panel-default').each((_, el) => {
                const heading = $(el).find('.panel-heading').text().trim().toLowerCase();
                if (heading.includes('public test cases') || heading.includes('jocs de prova') || heading.includes('casos de prueba')) {
                    const testCasePanel = $(el).clone();
                    testCasePanel.find('.panel-heading, .pull-right, .vertical-view, button, script, style').remove();

                    combinedContent.append('<div class="mt-12 pt-8 border-t border-sky-500/10"></div>');
                    combinedContent.append('<h2 class="text-xl font-bold mb-6 text-sky-400">Exemples (Jocs de proves públics)</h2>');

                    const listGroup = testCasePanel.find('.list-group');
                    if (listGroup.length) combinedContent.append(listGroup.html() || '');
                    else combinedContent.append(testCasePanel.html() || '');
                }
            });

            if (combinedContent.children().length > 0) return { html: combinedContent.html() || '', langs: availableLanguages };
            return null;
        } catch (ex) { return null; }
    };

    // 1. Scraping (Primary)
    for (const l of uniqueLangs) {
        const scraped = await fetchScraping(l);
        if (scraped) { statementHtml = scraped.html; availableLanguages = scraped.langs; source = 'scraping-primary'; break; }
    }
    if (!statementHtml && uniqueLangs.length === 0) {
        const scraped = await fetchScraping('');
        if (scraped) { statementHtml = scraped.html; availableLanguages = scraped.langs; source = 'scraping-primary'; }
    }

    // 2. API (Fallback)
    if (!statementHtml && token) {
        source = 'api-fallback';
        for (const l of uniqueLangs) {
            const html = await fetchStatementApi(l);
            if (html) {
                statementHtml = html;
                try {
                    const pData = await jsonRpc('problems', 'getProblem', { problem_nm: cleanId }, token);
                    if (pData?.title) title = pData.title;
                } catch (e) { }
                break;
            }
        }
    }

    if (!statementHtml) throw new Error('Problem content not found or unable to scrape.');

    // 3. Post-processat HTML
    const $ = cheerio.load(statementHtml, null, false);
    $('a[href^="problem://"]').each((_, el) => {
        const parts = ($(el).attr('href') || '').split('/');
        const lastPart = parts[parts.length - 1];
        if (lastPart) $(el).attr('href', `https://jutge.org/problems/${lastPart.split('.')[0]}`);
    });

    $('a').each((_, el) => {
        const href = ($(el).attr('href') || '').toLowerCase();
        const $el = $(el);

        if (href.startsWith('/')) $el.attr('href', `https://jutge.org${href}`);
        $el.attr('target', '_blank');

        const isPdf = href.includes('.pdf') || href.endsWith('/pdf');
        const isZip = href.includes('.zip') || href.endsWith('/zip');
        const isTar = href.includes('.tar') || href.endsWith('.tgz');
        const isCode = href.match(/\.(cc|hh|java|py|cpp|c\+\+)$/);
        const isTrash = href.includes('trashurl');

        if (isPdf || isZip || isTar || isCode || isTrash) {
            $el.find('img').remove();
            $el.addClass('file-badge');

            // Standardizing icons
            const mkIcon = (svgPath: string) => `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="mr-1.5">${svgPath}</svg>`;
            const iPdf = mkIcon('<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>');
            const iZip = mkIcon('<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>');
            const iCode = mkIcon('<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>');

            if (isPdf) $el.addClass('pdf').html(`${iPdf}<span>PDF</span>`);
            else if (isZip) $el.addClass('zip').html(`${iZip}<span>ZIP</span>`);
            else if (isTar) $el.addClass('tar bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/40').html(`${iZip}<span>TAR</span>`);
            else if (isCode) $el.addClass('code').html(`${iCode}<span>CODI</span>`);
            else if (isTrash) $el.remove();
        } else {
            if (!$el.find('img').length) $el.addClass('text-emerald-400 hover:text-emerald-300 underline underline-offset-4 decoration-emerald-500/30 transition-colors');
            else $el.addClass('inline-block no-underline');
        }
    });

    $('img').each((_, el) => {
        const src = ($(el).attr('src') || '').toLowerCase();
        const originalSrc = $(el).attr('src') || '';
        if (originalSrc.startsWith('/')) $(el).attr('src', `https://jutge.org${originalSrc}`);

        if (src.match(/(\/icons\/|\/ico\/|ico_|icon_|f_pdf|f_zip|zip\.png|pdf\.png|public\.png)/)) $(el).remove();
        else $(el).addClass('content-image block max-w-full h-auto rounded-lg my-6 shadow-md border border-white/10 mx-auto');
    });

    return {
        id: cleanId,
        title,
        statement: $.html(),
        url: `https://jutge.org/problems/${cleanId}`,
        source,
        availableLanguages
    };
}
