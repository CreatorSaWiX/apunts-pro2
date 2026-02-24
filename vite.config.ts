import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import contentCollections from "@content-collections/vite"
import * as cheerio from 'cheerio'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      contentCollections(),
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'prompt',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: {
          name: 'Apunts PRO2',
          short_name: 'ApuntsPRO2',
          description: 'Apunts i solucionaris de Programació 2 (FIB-UPC)',
          theme_color: '#0f172a',
          background_color: '#0f172a',
          display: 'standalone',
          orientation: 'portrait',
          icons: [
            {
              src: 'favicon-96x96.png',
              sizes: '96x96',
              type: 'image/png'
            },
            {
              src: 'web-app-manifest-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: 'web-app-manifest-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 3000000,
          runtimeCaching: [
            {
              urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 500,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ]
        },
        devOptions: {
          enabled: true
        }
      }),
      {
        name: 'jutge-api-dev-server',
        configureServer(server) {
          server.middlewares.use('/api/jutge-proxy', async (req, res) => {
            try {
              const url = new URL(req.url || '', `http://${req.headers.host}`);
              const id = url.searchParams.get('id');
              const reqLang = url.searchParams.get('lang'); // Llegim idioma sol·licitat

              if (!id) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Missing ID' }));
                return;
              }

              const cleanId = id.replace(/[^a-zA-Z0-9_]/g, '');
              console.log(`[DevServer] Fetching proxy for ${cleanId} (${reqLang || 'auto'})...`);

              // Lògica de Login Automàtic
              let token = null;
              if (env.JUTGE_EMAIL && env.JUTGE_PASSWORD) {
                try {
                  const loginRes = await fetch('https://api.jutge.org/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ params: { email: env.JUTGE_EMAIL, password: env.JUTGE_PASSWORD }, version: "1.0", id: 1 })
                  });
                  if (loginRes.ok) {
                    const data: any = await loginRes.json();
                    if (data.result) token = data.result;
                  }
                } catch (err) { console.error("[DevServer] Login exception:", err); }
              } else {
                console.warn("[DevServer] No JUTGE_EMAIL/PASSWORD in env.");
              }

              // Fetch Enunciat via API
              const fetchStatementApi = async (lang: string) => {
                if (!token) return null;
                try {
                  const headers: Record<string, string> = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
                  const r = await fetch('https://api.jutge.org/api/problems/getHtmlStatement', {
                    method: 'POST', headers,
                    body: JSON.stringify({ params: { problem_nm: cleanId, lang }, version: "1.0", id: 1 })
                  });
                  if (r.ok) {
                    const d: any = await r.json();
                    if (d?.result) return d.result;
                  }
                  return null;
                } catch (e) { return null; }
              };

              // Fetch Enunciat via Scraping (Fallback)
              const fetchStatementScraping = async (lang: string) => {
                try {
                  const urlId = lang ? `${cleanId}_${lang}` : cleanId;
                  const finalUrl = `https://jutge.org/problems/${urlId}`;
                  console.log(`[DevServer] Scraping URL: ${finalUrl}`);

                  const headers: Record<string, string> = { 'User-Agent': 'Mozilla/5.0 (compatible; ApuntsBot/1.0)' };
                  if (token) headers['Cookie'] = `PHPSESSID=${token}`;

                  const r = await fetch(finalUrl, { headers });
                  if (r.ok) {
                    const html = await r.text();
                    if (html.includes('Login') || html.includes('Wrong URL')) return null;

                    const $ = cheerio.load(html);
                    // Detecció idiomes
                    const availableLangs = new Set<string>();
                    $('a[href*="/problems/"]').each((_, el) => {
                      const href = $(el).attr('href') || '';
                      if (href.endsWith('_ca') || href.endsWith('/ca')) availableLangs.add('ca');
                      if (href.endsWith('_en') || href.endsWith('/en')) availableLangs.add('en');
                      if (href.endsWith('_es') || href.endsWith('/es')) availableLangs.add('es');
                    });
                    if (lang) availableLangs.add(lang);
                    else availableLangs.add('en');
                    const langsArray = Array.from(availableLangs);
                    if (langsArray.length === 0) langsArray.push('ca', 'en', 'es');

                    const content = $('#txt, .statement-section, .problem-statement, .enunciat, .panel-body').first();
                    if (content.length) {
                      // NETEJA GENERAL
                      content.find('h1, button, script, style, nav, header, footer, .navbar, .breadcrumb, #header, #footer').remove();
                      content.find('*').each((_, el) => {
                        if ($(el).text().trim() === '' && $(el).children().length === 0 && !$(el).is('img')) $(el).remove();
                      });
                      return { html: content.html(), langs: langsArray };
                    }
                  }
                  return null;
                } catch (e) { return null; }
              }

              // Lògica de prioritats
              let result = null;
              let source = 'api-official';
              let availableLanguages = ['ca', 'en', 'es'];

              const priority = reqLang ? [reqLang, 'ca', 'en', 'es'] : ['ca', 'en', 'es'];
              const uniqueLangs = [...new Set(priority)];

              // 1. API
              for (const lang of uniqueLangs) {
                const apiHtml = await fetchStatementApi(lang);
                if (apiHtml) {
                  result = { html: apiHtml, langs: ['ca', 'en', 'es'] };
                  break;
                }
              }

              // 2. Scraping
              if (!result) {
                source = 'scraping-fallback';
                for (const lang of uniqueLangs) {
                  const scraped = await fetchStatementScraping(lang);
                  if (scraped) { result = scraped; break; }
                }
                if (!result) result = await fetchStatementScraping('');
              }

              if (!result) {
                res.statusCode = 404;
                res.end(JSON.stringify({ error: 'Not found' }));
                return;
              }

              // PROCESSAMENT HTML FINAL (BADGES & CLEANUP)
              const $ = cheerio.load(result.html || '', null, false);
              availableLanguages = result.langs || availableLanguages;

              // 1. FIX links problem://
              $('a[href^="problem://"]').each((_, el) => {
                const href = $(el).attr('href') || '';
                const parts = href.split('/');
                const last = parts[parts.length - 1];
                if (last) $(el).attr('href', `https://jutge.org/problems/${last.split('.')[0]}`);
              });

              // 2. LINKS & BADGES
              $('a').each((_, el) => {
                const href = ($(el).attr('href') || '').toLowerCase(); // Lowercase per detectar millor ext
                const $el = $(el);

                if ($el.attr('href')?.startsWith('/')) $el.attr('href', `https://jutge.org${$el.attr('href')}`);
                $el.attr('target', '_blank');

                const isPdf = href.includes('.pdf') || href.endsWith('/pdf');
                const isZip = href.includes('.zip') || href.endsWith('/zip');
                const isCode = href.includes('.cc') || href.includes('.hh') || href.includes('.java') || href.includes('.py') || href.includes('.cpp') || href.includes('.c++');
                const isTrash = href.includes('trashurl');

                if (isPdf || isZip || isCode || isTrash) {
                  console.log(`[DevServer] Creating Badge for: ${href}`);
                  $el.find('img').remove(); // Eliminem imatge interna
                  $el.addClass('file-badge');

                  const iPdf = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="mr-1.5"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>`;
                  const iZip = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="mr-1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`;
                  const iCode = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="mr-1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`;

                  if (isPdf) $el.addClass('pdf').html(`${iPdf}<span>PDF</span>`);
                  else if (isZip) $el.addClass('zip').html(`${iZip}<span>ZIP</span>`);
                  else if (isCode) $el.addClass('code').html(`${iCode}<span>CODI</span>`);
                  else if (isTrash) $el.remove();
                } else {
                  if (!$el.find('img').length) {
                    $el.addClass('text-emerald-400 hover:text-emerald-300 underline underline-offset-4 decoration-emerald-500/30 transition-colors');
                  } else {
                    $el.addClass('inline-block no-underline'); // Image link
                  }
                }
              });

              // 3. IMATGES RESTANTS (Neteja icones orfes)
              $('img').each((_, el) => {
                const src = ($(el).attr('src') || '').toLowerCase();
                const originalSrc = $(el).attr('src') || '';
                if (originalSrc.startsWith('/')) $(el).attr('src', `https://jutge.org${originalSrc}`);

                // Llista negra d'icones que sabem que sobren
                const isLegacyIcon = src.includes('/icons/') || src.includes('ico_') || src.includes('icon_') || src.includes('f_pdf') || src.includes('f_zip') || src.includes('zip.png') || src.includes('pdf.png');

                if (isLegacyIcon) {
                  console.log(`[DevServer] Removing Legacy Icon: ${src}`);
                  $(el).remove();
                } else {
                  $(el).addClass('content-image block max-w-full h-auto rounded-lg my-6 shadow-md border border-white/10 mx-auto');
                }
              });

              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Cache-Control', 'public, max-age=3600'); // Permetre cache local per test de PWA
              res.end(JSON.stringify({
                id: cleanId,
                title: cleanId,
                statement: $.html(),
                availableLanguages, // Retornem idiomes disponibles al frontend
                url: `https://jutge.org/problems/${cleanId}`,
                source
              }));

            } catch (e) {
              console.error("[DevServer] Proxy Error:", e);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: String(e) }));
            }
          });
        }
      }
    ],
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-graphs': ['react-force-graph-2d'],
            'vendor-markdown': ['react-markdown', 'rehype-raw', 'rehype-katex', 'remark-math', 'remark-directive'],
            'vendor-utils': ['framer-motion', 'lucide-react', 'date-fns']
          }
        }
      }
    }
  }
})
