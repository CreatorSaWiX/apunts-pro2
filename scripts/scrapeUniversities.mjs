import fs from 'fs/promises';
import path from 'path';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://www.fib.upc.edu';
const LIST_URL = `${BASE_URL}/ca/mobilitat/aliances-internacionals/universitats-partner`;

const countryToFlag = {
  "Alemanya": "🇩🇪", "Argentina": "🇦🇷", "Austràlia": "🇦🇺", "Àustria": "🇦🇹",
  "Bèlgica": "🇧🇪", "Brasil": "🇧🇷", "Canadà": "🇨🇦", "Colòmbia": "🇨🇴",
  "Corea del Sud": "🇰🇷", "Dinamarca": "🇩🇰", "Eslovènia": "🇸🇮", "Espanya": "🇪🇸",
  "Estats Units": "🇺🇸", "Estònia": "🇪🇪", "Finlàndia": "🇫🇮", "França": "🇫🇷",
  "Grècia": "🇬🇷", "Holanda": "🇳🇱", "Hong Kong": "🇭🇰", "Hongria": "🇭🇺",
  "Irlanda": "🇮🇪", "Islàndia": "🇮🇸", "Itàlia": "🇮🇹", "Japó": "🇯🇵",
  "Letònia": "🇱🇻", "Lituània": "🇱🇹", "Mèxic": "🇲🇽", "Noruega": "🇳🇴",
  "Països Baixos": "🇳🇱", "Perú": "🇵🇪", "Polònia": "🇵🇱", "Portugal": "🇵🇹",
  "Regne Unit": "🇬🇧", "República Txeca": "🇨🇿", "Romania": "🇷🇴", "Singapur": "🇸🇬",
  "Suècia": "🇸🇪", "Suïssa": "🇨🇭", "Taiwan": "🇹🇼", "Uruguai": "🇺🇾",
  "Xile": "🇨🇱", "Xina": "🇨🇳", "Xipre": "🇨🇾", "Vietnam": "🇻🇳"
};

function getProgram(country) {
  if (['Argentina', 'Brasil', 'Colòmbia', 'Mèxic', 'Perú', 'Uruguai', 'Xile'].includes(country)) return 'Amèrica Llatina';
  if (['Austràlia', 'Canadà', 'Corea del Sud', 'Estats Units', 'Hong Kong', 'Japó', 'Singapur', 'Taiwan', 'Xina', 'Vietnam'].includes(country)) return "Mobilitat fora d'Europa";
  return 'Erasmus+'; // Default fallback
}

async function fetchHtml(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return await res.text();
}

async function scrape() {
  console.log('Fetching main list...');
  const html = await fetchHtml(LIST_URL);
  const $ = cheerio.load(html);
  
  const universities = [];
  const linksToScrape = [];

  // Normally the countries are in h3 inside the main content area.
  // The lists are usually the next sibling ul.
  $('h3').each((i, el) => {
      const country = $(el).text().trim();
      const list = $(el).next('ul');
      if (list.length > 0) {
          list.find('li a').each((j, a) => {
              const name = $(a).text().trim();
              let href = $(a).attr('href');
              if (!href) return;
              
              const url = href.startsWith('http') ? href : BASE_URL + href;
              
              linksToScrape.push({
                  name,
                  country,
                  url
              });
          });
      }
  });
  
  console.log(`Found ${linksToScrape.length} universities. Scraping details...`);
  
  for (let i = 0; i < linksToScrape.length; i++) {
      const uni = linksToScrape[i];
      console.log(`[${i+1}/${linksToScrape.length}] Fetching ${uni.name}...`);
      try {
          const detailHtml = await fetchHtml(uni.url);
          const $d = cheerio.load(detailHtml);
          
          let webLink = '';
          let docLink = '';
          
          $d('.content a, .field--name-body a').each((idx, aTag) => {
             const text = $d(aTag).text().toLowerCase();
             const href = $d(aTag).attr('href');
             if (!href) return;
             
             // Ignore social links
             if (href.includes('facebook.com') || href.includes('twitter.com') || href.includes('instagram.com') || href.includes('youtube.com') || href.includes('linkedin.com') || href.includes('flickr.com') || href.includes('bsky.app')) return;

             // Very heuristic way to find the web link:
             // Usually they link to an external site or it explicitly says "Web"
             if ((href.includes('http') && !href.includes('upc.edu') && webLink === '') || text.includes('web')) {
                 if (href.includes('http')) {
                    webLink = href;
                 }
             }
             if (href.endsWith('.pdf')) {
                 docLink = href.startsWith('http') ? href : BASE_URL + href;
             }
          });
          
          universities.push({
              id: (i + 1).toString(),
              name: uni.name,
              country: uni.country,
              flag: countryToFlag[uni.country] || '🌍',
              program: getProgram(uni.country),
              url: uni.url,
              webLink,
              docLink
          });
          
      } catch (e) {
          console.error(`Error fetching ${uni.name}: ${e.message}`);
      }
      
      // Delay to avoid overwhelming the server
      await new Promise(r => setTimeout(r, 50));
  }
  
  const outPath = path.join(process.cwd(), 'public', 'data', 'universities.json');
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, JSON.stringify(universities, null, 2));
  console.log(`Successfully saved ${universities.length} universities to ${outPath}`);
}

scrape().catch(console.error);
