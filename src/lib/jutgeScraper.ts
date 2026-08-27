import { DOMParser } from 'linkedom';

export async function getProblemInfo(id: string, reqLang: string | null) {
    const cleanId = id.replace(/[^a-zA-Z0-9_]/g, '');
    let statementHtml = '';
    let title = cleanId;
    let source = 'scraping';
    let availableLanguages = ['ca', 'en', 'es'];

    const priority = reqLang ? [reqLang, 'ca', 'en', 'es'] : ['ca', 'en', 'es'];
    const uniqueLangs = Array.from(new Set(priority));

    const fetchScraping = async (l: string) => {
        try {
            const urlId = l ? `${cleanId}_${l}` : cleanId;
            const url = `https://jutge.org/problems/${urlId}`;
            // IMPORTANT: Fem servir User-Agent estàndard per a que Vercel IPs no siguin bloquejats pel WAF de Cloudflare
            const headers: Record<string, string> = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            };

            const resp = await fetch(url, { headers });
            if (!resp.ok) {
                console.error(`Fetch Jutge Fallit: ${resp.status}`);
                return null;
            }

            const html = await resp.text();
            if (html.includes('Login') || html.includes('Wrong URL')) return null;

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            const h1 = doc.querySelector('h1');
            const t = h1 ? h1.textContent?.trim() : '';
            if (t) title = t?.replace(new RegExp(`^${cleanId}\\.?\\s*`, 'i'), '') || title;

            const dLangs = new Set<string>();
            doc.querySelectorAll('a[href*="/problems/"]').forEach((el: any) => {
                const href = el.getAttribute('href') || '';
                if (href.endsWith('_ca') || href.endsWith('/ca')) dLangs.add('ca');
                if (href.endsWith('_en') || href.endsWith('/en')) dLangs.add('en');
                if (href.endsWith('_es') || href.endsWith('/es')) dLangs.add('es');
            });
            if (l) dLangs.add(l);
            if (dLangs.size > 0) availableLanguages = Array.from(dLangs);

            let combinedHtml = '';
            const content = doc.querySelector('#txt, .statement-section, .problem-statement, .enunciat, .panel-body');

            if (content) {
                content.querySelectorAll('h1, button, script, style, nav, header, footer, .navbar, .breadcrumb, #header, #footer, .ui-layout-north, .ui-layout-south, .left-panel, .right-panel').forEach((el: any) => el.remove());
                content.querySelectorAll('*').forEach((el: any) => {
                    if (el.textContent?.trim() === '' && el.children.length === 0 && el.tagName.toLowerCase() !== 'img') el.remove();
                });
                combinedHtml = content.innerHTML;
            }

            if (combinedHtml) return { html: combinedHtml, langs: availableLanguages };
            return null;
        } catch (ex) {
            console.error("Scrape Error:", ex);
            return null;
        }
    };

    // 1. Scraping directament, res de JWT/Tokens
    for (const l of uniqueLangs) {
        const scraped = await fetchScraping(l);
        if (scraped) { statementHtml = scraped.html; availableLanguages = scraped.langs; source = 'scraping-direct'; break; }
    }
    if (!statementHtml && uniqueLangs.length === 0) {
        const scraped = await fetchScraping('');
        if (scraped) { statementHtml = scraped.html; availableLanguages = scraped.langs; source = 'scraping-direct'; }
    }

    if (!statementHtml) throw new Error('Problem content not found or unable to scrape.');

    // 3. Post-processat HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(statementHtml, 'text/html');

    doc.querySelectorAll('.collapse').forEach((el: any) => el.classList.remove('collapse'));
    doc.querySelectorAll('.in').forEach((el: any) => el.classList.remove('in'));

    doc.querySelectorAll('a[href^="problem://"]').forEach((el: any) => {
        const parts = (el.getAttribute('href') || '').split('/');
        const lastPart = parts[parts.length - 1];
        if (lastPart) el.setAttribute('href', `https://jutge.org/problems/${lastPart.split('.')[0]}`);
    });

    doc.querySelectorAll('a').forEach((el: any) => {
        const href = (el.getAttribute('href') || '').toLowerCase();

        if (href.startsWith('/')) el.setAttribute('href', `https://jutge.org${href}`);
        el.setAttribute('target', '_blank');

        const isPdf = href.includes('.pdf') || href.endsWith('/pdf');
        const isZip = href.includes('.zip') || href.endsWith('/zip');
        const isTar = href.includes('.tar') || href.endsWith('.tgz');
        const isCode = href.match(/\.(cc|hh|java|py|cpp|c\+\+)$/);
        const isTrash = href.includes('trashurl');

        if (isPdf || isZip || isTar || isCode || isTrash) {
            el.querySelectorAll('img').forEach((img: any) => img.remove());
            el.classList.add('file-badge');

            // Standardizing icons
            const mkIcon = (svgPath: string) => `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="mr-1.5">${svgPath}</svg>`;
            const iPdf = mkIcon('<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>');
            const iZip = mkIcon('<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>');
            const iCode = mkIcon('<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>');

            if (isPdf) { el.classList.add('pdf'); el.innerHTML = `${iPdf}<span>PDF</span>`; }
            else if (isZip) { el.classList.add('zip'); el.innerHTML = `${iZip}<span>ZIP</span>`; }
            else if (isTar) { 
                el.classList.add('tar', 'bg-amber-500/10', 'text-amber-400', 'border', 'border-amber-500/20', 'hover:bg-amber-500/20', 'hover:border-amber-500/40'); 
                el.innerHTML = `${iZip}<span>TAR</span>`; 
            }
            else if (isCode) { el.classList.add('code'); el.innerHTML = `${iCode}<span>CODI</span>`; }
            else if (isTrash) { el.remove(); }
        } else {
            if (!el.querySelector('img')) {
                el.classList.add('text-emerald-400', 'hover:text-emerald-300', 'underline', 'underline-offset-4', 'decoration-emerald-500/30', 'transition-colors');
            } else {
                el.classList.add('inline-block', 'no-underline');
            }
        }
    });

    doc.querySelectorAll('img').forEach((el: any) => {
        const src = (el.getAttribute('src') || '').toLowerCase();
        const originalSrc = el.getAttribute('src') || '';
        if (originalSrc.startsWith('/')) el.setAttribute('src', `https://jutge.org${originalSrc}`);

        if (src.match(/(\/icons\/|\/ico\/|ico_|icon_|f_pdf|f_zip|zip\.png|pdf\.png|public\.png)/)) {
            el.remove();
        } else {
            el.classList.add('content-image', 'block', 'max-w-full', 'h-auto', 'rounded-lg', 'my-6', 'shadow-md', 'border', 'border-white/10', 'mx-auto');
        }
    });

    return {
        id: cleanId,
        title,
        statement: doc.toString(),
        url: `https://jutge.org/problems/${cleanId}`,
        source,
        availableLanguages
    };
}
