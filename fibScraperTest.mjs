import * as cheerio from 'cheerio';

async function testScraper() {
    const subRes = await fetch('https://www.fib.upc.edu/ca/graus/grau-en-enginyeria-informatica/pla-destudis/assignatures/F');
    const subHtml = await subRes.text();
    const $sub = cheerio.load(subHtml);
    
    // Find the container that has all these stats
    let foundContainer = null;
    $sub('.row').each((_, el) => {
        if ($sub(el).text().includes('Crèdits') && $sub(el).text().includes('Tipus')) {
            foundContainer = el;
        }
    });
    
    if (foundContainer) {
        console.log("Found container HTML:");
        console.log($sub(foundContainer).html());
    } else {
        console.log("Could not find the stats row container.");
    }

    // Also let's print the first <p> in .field--name-body that is not inside a section
    let summary = '';
    $sub('.field-name-body > p, .field-name-body > div > p, .field--name-body > p, .field--name-body > div > p').each((_, p) => {
        if (!summary) {
            summary = $sub(p).text().trim();
        }
    });
    console.log("Summary extracted by path:", summary);
}

testScraper().catch(console.error);
