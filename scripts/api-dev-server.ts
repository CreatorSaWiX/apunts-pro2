import { loadEnv, type Plugin } from 'vite';
import type { IncomingMessage, ServerResponse } from 'node:http';

export function apiDevServerPlugin(mode: string): Plugin {
  const env = loadEnv(mode, process.cwd(), '');
  
  // Inject env into process.env so Vercel API files can read them
  for (const [key, value] of Object.entries(env)) {
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }

  return {
    name: 'jutge-api-dev-server',
    configureServer(server) {
      server.middlewares.use('/api', async (req: IncomingMessage, res: ServerResponse, next: Function) => {
        try {
          const urlStr = req.url || '/';
          const path = urlStr.split('?')[0]; // e.g. /chat, /cdn/community/...
          
          if (path === '/' || path === '') {
            return next();
          }

          // R2 CDN specific local implementation (302 redirect to presigned URL)
          // Prod doesn't have an /api/cdn.ts endpoint (it uses direct public URL)
          if (path.startsWith('/cdn/')) {
            await handleLocalCdn(req, res, env);
            return;
          }

          // Map other paths to the api/ directory
          const apiFile = path.substring(1); // e.g. "chat", "roadmap-ai"
          let apiModule: { default?: (req: Request) => Promise<Response> };
          try {
            // Import dynamically using Vite's module runner for HMR and TS support
            apiModule = await server.ssrLoadModule(`/api/${apiFile}.ts`);
          } catch (e: unknown) {
            // File not found or failed to compile, let Vite handle it or return 404
            const err = e as { code?: string; message?: string };
            if (err.code === 'ERR_MODULE_NOT_FOUND' || err.message?.includes('Cannot find module') || err.message?.includes('Failed to load url')) {
               return next();
            }
            throw e; // Throw actual syntax/compilation errors
          }

          const handler = apiModule.default;
          if (!handler) {
            res.statusCode = 500;
            res.end(`No default export found in api/${apiFile}.ts`);
            return;
          }

          // Read the body if not GET/HEAD
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

          // Create a Web API Request
          const fullUrl = new URL((req as IncomingMessage & { originalUrl?: string }).originalUrl || req.url || '/', `http://${req.headers.host || 'localhost'}`);
          const init: RequestInit = {
            method: req.method,
            headers: mappedHeaders,
          };
          if (bodyData && bodyData.length > 0) {
            init.body = bodyData;
          }
          const mockRequest = new Request(fullUrl, init);

          // Execute Vercel API Handler
          const response: Response = await handler(mockRequest);

          // Write Response back to Node's ServerResponse
          res.statusCode = response.status;
          response.headers.forEach((value, key) => {
            res.setHeader(key, value);
          });

          // Handle streams vs text
          if (response.body) {
            const reader = response.body.getReader();
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              if (value) {
                res.write(value);
                const flushableRes = res as ServerResponse & { flush?: () => void };
                if (typeof flushableRes.flush === 'function') flushableRes.flush();
              }
            }
            res.end();
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
          } else {
             res.write(`event: error\ndata: ${JSON.stringify({ message: String(err?.message || e) })}\n\n`);
             res.end();
          }
        }
      });
    }
  };
}

// Local implementation for /api/cdn
async function handleLocalCdn(req: IncomingMessage, res: ServerResponse, env: Record<string, string>) {
  try {
    const { S3Client, GetObjectCommand } = await import('@aws-sdk/client-s3');
    const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner');

    const accountId = env.R2_ACCOUNT_ID;
    const endpoint = env.R2_ENDPOINT || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : null);
    const accessKeyId = env.R2_ACCESS_KEY_ID;
    const secretAccessKey = env.R2_SECRET_ACCESS_KEY;
    const bucketName = env.R2_BUCKET_NAME;

    if (!endpoint || !accessKeyId || !secretAccessKey || !bucketName) {
      res.statusCode = 500;
      res.end('Falta configuració de R2');
      return;
    }

    const S3 = new S3Client({
      region: 'auto',
      endpoint: endpoint ? new URL(endpoint).origin : undefined,
      credentials: { accessKeyId, secretAccessKey },
      forcePathStyle: true,
    });

    const urlParts = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    const pathWithoutCdn = urlParts.pathname.substring(5); // remove /cdn/
    const objectKey = decodeURIComponent(pathWithoutCdn);

    if (!objectKey) {
      res.statusCode = 400;
      res.end('Missing object key');
      return;
    }

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    });

    const presignedUrl = await getSignedUrl(S3, command, { expiresIn: 3600 });
    
    res.writeHead(302, { Location: presignedUrl });
    res.end();
  } catch (e: unknown) {
    console.error("[DevServer R2 CDN Error]:", e);
    res.statusCode = 500;
    res.end('Error CDN local');
  }
}
