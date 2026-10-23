import { loadEnv, type Plugin } from 'vite';
import type { IncomingMessage, ServerResponse } from 'node:http';

export function apiDevServerPlugin(mode: string): Plugin {
  const env = loadEnv(mode, process.cwd(), '');
  
  for (const [key, value] of Object.entries(env)) {
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }

  return {
    name: 'jutge-api-dev-server',
    configureServer(server) {
      server.middlewares.use('/cdn', async (req: IncomingMessage, res: ServerResponse) => {
        await handleLocalCdn(req, res, env);
      });

      server.middlewares.use('/api', async (req: IncomingMessage, res: ServerResponse, next: Function) => {
        try {
          const urlStr = req.url || '/';
          const path = urlStr.split('?')[0];
          
          if (path === '/' || path === '') {
            return next();
          }

          if (path.startsWith('/cdn/')) {
            await handleLocalCdn(req, res, env);
            return;
          }

          const apiFile = path.substring(1);
          let apiModule: {
            default?: ((req: Request) => Promise<Response>) | { fetch?: (req: Request) => Promise<Response> };
          };
          try {
            apiModule = await server.ssrLoadModule(`/api/${apiFile}.ts`);
          } catch (e: unknown) {
            const err = e as { code?: string; message?: string };
            if (err.code === 'ERR_MODULE_NOT_FOUND' || err.message?.includes('Cannot find module') || err.message?.includes('Failed to load url')) {
               return next();
            }
            throw e;
          }

          const rawDefault = apiModule.default;
          const handler = typeof rawDefault === 'function' ? rawDefault : rawDefault?.fetch;
          if (!handler) {
            res.statusCode = 500;
            res.end(`No default export found in api/${apiFile}.ts`);
            return;
          }

          let bodyData: Buffer | undefined;
          if (req.method !== 'GET' && req.method !== 'HEAD') {
            bodyData = await new Promise<Buffer>((resolve, reject) => {
              const chunks: Buffer[] = [];
              req.on('data', chunk => chunks.push(Buffer.from(chunk)));
              req.on('end', () => resolve(Buffer.concat(chunks)));
              req.on('error', reject);
            });
          }

          const mappedHeaders: Record<string, string> = {};
          for (const [key, value] of Object.entries(req.headers)) {
            if (value) mappedHeaders[key] = Array.isArray(value) ? value.join(', ') : value;
          }

          const abortController = new AbortController();
          const onClose = () => {
            if (!res.writableEnded && !abortController.signal.aborted) {
              abortController.abort();
            }
          };
          req.on('aborted', onClose);
          res.on('close', onClose);

          const fullUrl = new URL((req as IncomingMessage & { originalUrl?: string }).originalUrl || req.url || '/', `http://${req.headers.host || 'localhost'}`);
          const init: RequestInit = {
            method: req.method,
            headers: mappedHeaders,
            signal: abortController.signal,
          };
          if (bodyData && bodyData.length > 0) {
            init.body = new Uint8Array(bodyData);
          }
          const mockRequest = new Request(fullUrl, init);

          const response: Response = await handler(mockRequest);

          res.statusCode = response.status;
          response.headers.forEach((value, key) => {
            res.setHeader(key, value);
          });
          if (typeof res.flushHeaders === 'function') {
            res.flushHeaders();
          }

          if (response.body) {
            const reader = response.body.getReader();
            while (true) {
              const { done, value } = await reader.read();
              if (done || res.writableEnded) break;
              if (value) {
                res.write(value);
                const flushableRes = res as ServerResponse & { flush?: () => void };
                if (typeof flushableRes.flush === 'function') flushableRes.flush();
              }
            }
            if (!res.writableEnded) res.end();
          } else {
            const text = await response.text();
            res.end(text);
          }
        } catch (e: unknown) {
          console.error(`[DevServer Universal API Wrapper Error]:`, e);
          const err = e as Error;
          if (!res.headersSent) {
             res.statusCode = 500;
             res.end(JSON.stringify({ error: String(err?.message || e) }));
          } else if (!res.writableEnded) {
             res.write(`event: error\ndata: ${JSON.stringify({ message: String(err?.message || e) })}\n\n`);
             res.end();
          }
        }
      });
    }
  };
}

async function handleLocalCdn(req: IncomingMessage, res: ServerResponse, env: Record<string, string>) {
  try {
    const rawUrl = req.url || '/';
    let path = rawUrl.split('?')[0];
    if (path.startsWith('/cdn/')) path = path.substring(5);
    else if (path.startsWith('/api/cdn/')) path = path.substring(9);
    else if (path.startsWith('/')) path = path.substring(1);

    const objectKey = decodeURIComponent(path);

    if (!objectKey) {
      res.statusCode = 400;
      res.end('Missing object key');
      return;
    }

    const publicBase = env.VITE_R2_PUBLIC_URL || 'https://pub-b67ee6442b98462db44a968a86d3b036.r2.dev';
    const targetUrl = `${publicBase.replace(/\/$/, '')}/${objectKey}`;
    
    res.writeHead(302, { 
      Location: targetUrl,
      'Access-Control-Allow-Origin': '*'
    });
    res.end();
  } catch (e: unknown) {
    console.error("[DevServer R2 CDN Error]:", e);
    res.statusCode = 500;
    res.end('Error CDN local');
  }
}
