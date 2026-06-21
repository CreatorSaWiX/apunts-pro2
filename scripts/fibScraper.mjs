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
            let professors = [];
            let hours = [];
            let activities = [];

            $sub('section.caixa_sombra').each((_, sec) => {
                const title = $sub(sec).find('h2').first().text().trim();
                if (title) {
                    $sub(sec).find('h2').first().remove();

                    if (title === 'Professorat') {
                        // Extract professors
                        let currentRole = 'Altres';
                        $sub(sec).find('h3, li').each((_, el) => {
                            if (el.tagName.toLowerCase() === 'h3') {
                                currentRole = $sub(el).text().trim();
                            } else if (el.tagName.toLowerCase() === 'li') {
                                const text = $sub(el).text().trim();
                                // Match: Name (email@upc.edu)
                                const match = text.match(/^(.*?)\s*\((.*?@.*?)\)$/);
                                if (match) {
                                    professors.push({
                                        name: match[1].trim(),
                                        email: match[2].trim(),
                                        role: currentRole
                                    });
                                } else {
                                    professors.push({
                                        name: text,
                                        email: null,
                                        role: currentRole
                                    });
                                }
                            }
                        });
                    } else if (title === 'Hores setmanals') {
                        // Extract hours
                        $sub(sec).find('b').each((_, b) => {
                            const type = $sub(b).text().trim();
                            const valDiv = $sub(b).parent().next();
                            if (valDiv.length > 0) {
                                const valueStr = valDiv.text().trim();
                                const value = parseFloat(valueStr) || 0;
                                hours.push({ type, value });
                            }
                        });
                    } else if (title === 'Activitats') {
                        $sub(sec).find('.activitat, .acte_avaluatiu').each((_, act) => {
                            const isEvaluative = $sub(act).hasClass('acte_avaluatiu');
                            const actTitle = $sub(act).find('h3').first().text().trim();
                            
                            const col9 = $sub(act).find('.col-lg-9');
                            const h3 = col9.find('h3').remove(); // remove h3 to process description
                            
                            const objectives = [];
                            col9.find('a[href^="#obj"]').each((_, a) => {
                                objectives.push($sub(a).text().trim());
                            });

                            let col9Html = col9.html() || '';
                            const weekMatch = col9Html.match(/<b>Setmana:<\/b>\s*(\d+)/);
                            const week = weekMatch ? parseInt(weekMatch[1]) : null;
                            
                            // Strip known metadata blocks to leave only the description
                            col9Html = col9Html.replace(/<b>Objectius:<\/b>[\s\S]*?(?:<br>|$)/gi, '');
                            col9Html = col9Html.replace(/<b>Setmana:<\/b>[\s\S]*?(?:<br>|$)/gi, '');
                            col9Html = col9Html.replace(/<b>Continguts:<\/b>[\s\S]*?(?:<br>|$)/gi, '');
                            
                            // Remove any leftover links to objectives or continguts just in case
                            col9Html = col9Html.replace(/<a href="#(obj|cont)[^>]*>.*?<\/a>/gi, '');
                            
                            const temp$ = cheerio.load(col9Html);
                            const actDescription = temp$('body').text().trim().replace(/\s+/g, ' ');
                            
                            col9.prepend(h3); // Put it back

                            const actHours = [];
                            $sub(act).find('.col-lg-3 .row > div:nth-child(odd)').each((idx, bDiv) => {
                                const type = $sub(bDiv).text().trim();
                                const valDiv = $sub(bDiv).next();
                                const value = parseFloat(valDiv.text().trim().replace('h', '')) || 0;
                                if (value > 0) {
                                    actHours.push({ type, value });
                                }
                            });
                            
                            if (actTitle) {
                                activities.push({
                                    title: actTitle,
                                    isEvaluative,
                                    description: actDescription,
                                    objectives,
                                    week,
                                    hours: actHours
                                });
                            }
                        });
                    } else {
                        let contentHtml = $sub(sec).html()?.trim() || '';
                        if (contentHtml) {
                            sections.push({ title, html: contentHtml });
                        }
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
                professors,
                hours,
                activities,
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
