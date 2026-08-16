import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { verifyIdToken } from './_shared/auth';
import { handleCors } from './_shared/cors';

export default async function handler(req: Request) {
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Mètode no permès. Fes servir POST.' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const authHeader = req.headers.get('authorization') || '';
        const idToken = authHeader.split('Bearer ')[1];
        if (!idToken) {
            return new Response(JSON.stringify({ error: 'No autoritzat' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }
        try {
            await verifyIdToken(idToken);
        } catch (error) {
            return new Response(JSON.stringify({ error: 'Token invàlid o caducat' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }

        const body = await req.json().catch(() => ({}));
        const { filename, contentType } = body;

        if (!filename || !contentType) {
            return new Response(JSON.stringify({ error: 'Falta filename o contentType' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
        if (!ALLOWED_MIME_TYPES.includes(contentType)) {
            return new Response(JSON.stringify({ error: 'Tipus de fitxer no permès' }), {
                status: 415,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const accountId = process.env.R2_ACCOUNT_ID;
        const endpoint = process.env.R2_ENDPOINT || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : null);
        const accessKeyId = process.env.R2_ACCESS_KEY_ID;
        const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
        const bucketName = process.env.R2_BUCKET_NAME;
        const publicUrlBase = process.env.VITE_R2_PUBLIC_URL;

        if (!endpoint || !accessKeyId || !secretAccessKey || !bucketName || !publicUrlBase) {
            return new Response(JSON.stringify({ error: 'Configuració R2 incompleta al servidor' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const S3 = new S3Client({
            region: 'auto',
            endpoint: endpoint ? new URL(endpoint).origin : undefined,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
            forcePathStyle: true,
            requestChecksumCalculation: "WHEN_REQUIRED",
        });

        // Evitar col·lisions de noms d'arxiu i problemes de codificació
        const cleanFilename = filename.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const objectKey = `community/${Date.now()}-${cleanFilename}`;

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: objectKey,
            ContentType: contentType,
            CacheControl: 'public, max-age=31536000, immutable',
        });

        // Generar URL signada vàlida per 5 minuts (300s)
        const presignedUrl = await getSignedUrl(S3, command, { 
            expiresIn: 300,
            signableHeaders: new Set(['content-type', 'cache-control'])
        });
        
        return new Response(JSON.stringify({ 
            presignedUrl, 
            objectKey,
            publicUrl: `${publicUrlBase}/${objectKey}`
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('[R2 Presign Error]', error);
        return new Response(JSON.stringify({ error: 'Error intern generant URL de pujada' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
