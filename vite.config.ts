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
        }
      }
    ],
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('firebase')) return 'vendor-firebase';
              if (id.includes('@uiw') || id.includes('@codemirror')) return 'vendor-codemirror';
              if (id.includes('react-force-graph')) return 'vendor-graphs';
              if (id.includes('react-markdown') || id.includes('rehype') || id.includes('remark')) return 'vendor-markdown';
              if (id.includes('lucide-react')) return 'vendor-icons';
              if (id.includes('framer-motion')) return 'vendor-framer';
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) return 'vendor-react';
            }
          }
        }
      }
    }
  }
})
