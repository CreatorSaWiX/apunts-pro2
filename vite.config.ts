import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import contentCollections from "@content-collections/vite"

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
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
          maximumFileSizeToCacheInBytes: 3000000,
          navigateFallbackDenylist: [/^\/pdfs\//], // EXCLOURE ELS PDFS DEL SERVICE WORKER
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
          enabled: true,
          type: 'module',
          navigateFallbackAllowlist: [/^\/$/]
        }
      }),
      {
        name: 'jutge-api-dev-server',
        configureServer(server) {
          server.middlewares.use('/api/jutge-proxy', async (req, res) => {
            try {
              const url = new URL(req.url || '', `http://${req.headers.host}`);
              const id = url.searchParams.get('id');
              const reqLang = url.searchParams.get('lang');

              if (!id) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Missing ID' }));
                return;
              }

              // Import dinàmic per evitar problemes d'esbuild en arrencada
              const { getProblemInfo } = await import('./src/lib/jutgeScraper.js');

              const result = await getProblemInfo(id, reqLang, {
                JUTGE_EMAIL: env.JUTGE_EMAIL,
                JUTGE_PASSWORD: env.JUTGE_PASSWORD
              });

              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
              res.end(JSON.stringify(result));
            } catch (e: any) {
              console.error("[DevServer] Proxy Error:", e);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: String(e.message || e) }));
            }
          });

          // Middleware per provar l'API de Gemini en local
          server.middlewares.use('/api/chat', async (req, res) => {
            if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => {
                body += chunk.toString();
              });
              req.on('end', async () => {
                try {
                  const { message, history, currentPath = '/', pageText = '', image } = JSON.parse(body);
                  const { GoogleGenerativeAI } = await import('@google/generative-ai');

                  // Per evitar el bucle infinit de recàrrega de Vite, llegim el fitxer manualment 
                  // en lloc d'utilitzar import() que Vite rastreja com a dependència.
                  const fs = await import('node:fs');
                  const path = await import('node:path');
                  let allPersonalNotes = [];
                  try {
                    const filePath = path.resolve('./.content-collections/generated/allPersonalNotes.js');
                    if (fs.existsSync(filePath)) {
                      const fileContent = fs.readFileSync(filePath, 'utf-8');
                      const jsonStr = fileContent.replace('export default', '').trim().replace(/;$/, '');
                      // Usem eval de forma segura per carregar el JS array que genera Content Collections
                      allPersonalNotes = eval(`(${jsonStr})`);
                    }
                  } catch (e) {
                    console.error("Error llegint els apunts locals:", e);
                  }

                  const apiKey = env.GEMINI_API_KEY;
                  if (!apiKey || apiKey === 'LA_TEVA_CLAU_AQUI') {
                    res.statusCode = 500;
                    res.end(JSON.stringify({ error: 'Clau de Gemini no configurada al servidor (.env.local)' }));
                    return;
                  }

                  const notesContext = allPersonalNotes
                    .map((note: any) => `## Tema: ${note.title}\n\n${note.content}`)
                    .join('\n\n---\n\n');

                  const genAI = new GoogleGenerativeAI(apiKey);

                  const MODELS = [
                    'gemini-3.1-flash-lite',     // lite de gemini 3
                    'gemini-2.5-flash',          // provat i fiable → primer
                    'gemini-2.5-flash-lite',     // lite de 2.5
                    'gemini-2.0-flash-lite',     // de rescat
                  ];

                  const systemInstruction = `Ets un company de classe o tutor que ajuda amb l'assignatura PRO2 a la FIB (UPC).
                    RESPON DE FORMA MOLT NATURAL, BREU I HUMANA. NO siguis robòtic ni donis explicacions llargues del teu "context" o de "la ruta".
                    Si no saps una cosa o no la veus, digues simplement "Ostres, no veig el codi/solucionari que dius" o "Això no ho tinc als meus apunts".
                    L'alumne està actualment a la pàgina: ${currentPath}

                    Aquest és el text visible a la seva pantalla ara mateix (útil si està mirant un solucionari penjat per algú):
                    """
                    ${pageText}
                    """

                    I aquest és el coneixement base oficial de l'assignatura:
                    ${notesContext}`;

                  const formattedHistory = (history || []).map((msg: any) => ({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.content }]
                  }));

                  const msgParts: any[] = [{ text: message }];
                  if (image && image.data && image.mimeType) {
                    msgParts.push({ inlineData: { data: image.data, mimeType: image.mimeType } });
                  }

                  let lastError: any;
                  let replied = false;

                  for (const modelName of MODELS) {
                    try {
                      const model = genAI.getGenerativeModel({ model: modelName, systemInstruction });
                      const chat = model.startChat({ history: formattedHistory });
                      const result = await chat.sendMessage(msgParts);
                      console.log(`✅ [Gemini] Model usat: ${modelName}`);
                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify({ reply: result.response.text() }));
                      replied = true;
                      break;
                    } catch (e: any) {
                      const is429 = e?.status === 429 || String(e?.message || '').includes('429') || String(e?.message || '').toLowerCase().includes('quota') || String(e?.message || '').toLowerCase().includes('rate');
                      if (is429) {
                        console.warn(`⚠️ [Gemini] ${modelName} rate limit, provant el seguent model...`);
                        lastError = e;
                        continue;
                      }
                      throw e; // error que no és rate-limit → propagar
                    }
                  }

                  if (!replied) throw lastError ?? new Error('Tots els models han fallat');
                } catch (e: any) {
                  console.error("[DevServer Gemini Error]:", e);
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: String(e.message || e) }));
                }
              });
            } else {
              res.statusCode = 405;
              res.end('Method Not Allowed');
            }
          });
        }
      }
    ],
    optimizeDeps: {
      include: [
        'three',
        '@react-three/fiber',
        '@react-three/drei',
      ],
      exclude: [],
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('firebase')) return 'vendor-firebase';
              if (id.includes('@uiw') || id.includes('@codemirror')) return 'vendor-codemirror';
              if (id.includes('react-force-graph') || id.includes('d3-') || id.includes('kapsule')) return 'vendor-graphs';
              if (id.includes('react-markdown') || id.includes('rehype') || id.includes('remark')) return 'vendor-markdown';
              if (id.includes('lucide-react')) return 'vendor-icons';
              if (id.includes('framer-motion')) return 'vendor-framer';
              // Be more specific with React core to avoid circular dependencies
              if (
                id.includes('node_modules/react/') ||
                id.includes('node_modules/react-dom/') ||
                id.includes('node_modules/react-router/') ||
                id.includes('node_modules/react-router-dom/') ||
                id.includes('node_modules/scheduler/') ||
                id.includes('node_modules/@remix-run/')
              ) {
                return 'vendor-react';
              }
            }
          }
        }
      }
    }
  }
})