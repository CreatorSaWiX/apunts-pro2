import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'data', 'subjects');

async function scrapeFIB() {
    console.log("Fetching subjects list...");
    const listRes = await fetch('https://www.fib.upc.edu/ca/graus/grau-en-enginyeria-informatica/pla-destudis/assignatures');
    const listHtml = await listRes.text();
    const $list = cheerio.load(listHtml);
    
    const subjectLinks = [];
    $list('table tbody tr').each((_, tr) => {
        const link = $list(tr).find('a').attr('href');
        const acronim = $list(tr).find('td').eq(1).text().trim();
        if (link && link.includes('/assignatures/')) {
            subjectLinks.push({ acronim, url: `https://www.fib.upc.edu${link}` });
        }
    });
    
    console.log(`Found ${subjectLinks.length} subjects.`);

    for (let i = 0; i < subjectLinks.length; i++) {
        const sub = subjectLinks[i];
        console.log(`[${i+1}/${subjectLinks.length}] Scraping ${sub.acronim}...`);
        try {
            const subRes = await fetch(sub.url);
            const subHtml = await subRes.text();
            const $sub = cheerio.load(subHtml);
            
            // Extract the blue box info (which is a table-like grid)
            let creditsStr = '';
            let typeStr = '';
            let reqStr = '';
            let deptStr = '';
            let webStr = '';

            $sub('b').each((_, el) => {
                const text = $sub(el).text().trim();
                const nextDiv = $sub(el).parent().next();
                
                if (text === 'Crèdits') creditsStr = nextDiv.text().trim();
                if (text === 'Tipus') typeStr = nextDiv.text().trim();
                if (text === 'Requisits') reqStr = nextDiv.text().trim();
                if (text === 'Departament') deptStr = nextDiv.text().trim();
                if (text === 'Web') webStr = nextDiv.find('a').attr('href') || nextDiv.text().trim();
            });
            
            // Extract summary text (just below the blue box)
            let summary = '';
            $sub('.field-name-body > p, .field-name-body > div > p, .field--name-body > p, .field--name-body > div > p').each((_, p) => {
                const pText = $sub(p).text().trim();
                if (!summary && pText.length > 20) {
                    summary = pText;
                }
            });

            // Extract tabs
            const sections = [];
            $sub('section.caixa_sombra').each((_, sec) => {
                const title = $sub(sec).find('h2').first().text().trim();
                if (title) {
                    $sub(sec).find('h2').first().remove();
                    let contentHtml = $sub(sec).html()?.trim() || '';
                    if (contentHtml) {
                        sections.push({ title, html: contentHtml });
                    }
                }
            });

            const data = {
                acronim: sub.acronim,
                url: sub.url,
                credits: parseFloat(creditsStr) || creditsStr,
                type: typeStr,
                requirements: reqStr,
                department: deptStr,
                web: webStr,
                summary: summary,
                sections: sections
            };

            const filePath = path.join(OUTPUT_DIR, `${sub.acronim}.json`);
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

            // Small delay to not hammer the server
            await new Promise(r => setTimeout(r, 100));
        } catch (e) {
            console.error(`Failed to scrape ${sub.acronim}:`, e.message);
        }
    }
    console.log("Scraping completed!");
}

scrapeFIB().catch(console.error);
