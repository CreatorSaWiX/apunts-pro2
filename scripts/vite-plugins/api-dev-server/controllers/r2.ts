import type { IncomingMessage, ServerResponse } from 'node:http';

export async function r2PresignController(req: IncomingMessage, res: ServerResponse, env: Record<string, string>) {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const { filename, contentType } = JSON.parse(body);

        // Importem dinàmicament el SDK d'AWS
        const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');
        const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner');

        const accountId = env.R2_ACCOUNT_ID;
        const endpoint = env.R2_ENDPOINT || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : null);
        const accessKeyId = env.R2_ACCESS_KEY_ID;
        const secretAccessKey = env.R2_SECRET_ACCESS_KEY;
        const bucketName = env.R2_BUCKET_NAME;
        const publicUrlBase = env.VITE_R2_PUBLIC_URL;

        if (!endpoint || !accessKeyId || !secretAccessKey || !bucketName || !publicUrlBase) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Configuració R2 incompleta al .env local' }));
          return;
        }

        const S3 = new S3Client({
          region: 'auto',
          endpoint: endpoint ? new URL(endpoint).origin : undefined,
          credentials: { accessKeyId, secretAccessKey },
          forcePathStyle: true,
          requestChecksumCalculation: "WHEN_REQUIRED",
        });

        const cleanFilename = filename.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const objectKey = `community/${Date.now()}-${cleanFilename}`;

        const command = new PutObjectCommand({
          Bucket: bucketName,
          Key: objectKey,
          ContentType: contentType,
        });

        const presignedUrl = await getSignedUrl(S3, command, {
          expiresIn: 300,
          signableHeaders: new Set(['content-type'])
        });

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          presignedUrl,
          objectKey,
          publicUrl: `${publicUrlBase}/${objectKey}`
        }));
      } catch (e: any) {
        console.error("[DevServer R2 Presign Error]:", e);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: String(e.message || e) }));
      }
    });
  } else {
    res.statusCode = 405;
    res.end('Method Not Allowed');
  }
}

export async function r2CdnController(req: IncomingMessage, res: ServerResponse, env: Record<string, string>) {
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

    // req.url equals the path after /api/cdn, e.g. /community/1784383481543-sawix2.webp
    const urlParts = new URL(req.url || '/', `http://${req.headers.host}`);
    const objectKey = decodeURIComponent(urlParts.pathname.substring(1)); // remove leading slash

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
    
    // Fem un redirect 302 al presigned URL de cloudflarestorage.com que NO està bloquejat
    res.writeHead(302, { Location: presignedUrl });
    res.end();
  } catch (e: any) {
    console.error("[DevServer R2 CDN Error]:", e);
    res.statusCode = 500;
    res.end('Error CDN');
  }
}
