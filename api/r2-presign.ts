import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { withMiddleware, jsonResponse } from './_shared/middleware';
import { r2PresignRequestSchema } from './_shared/schemas';

export default withMiddleware(async function handler(req: Request, userId?: string): Promise<Response> {
    const rawBody = await req.json().catch(() => ({}));
    const parseResult = r2PresignRequestSchema.safeParse(rawBody);

    if (!parseResult.success) {
        return jsonResponse({ error: 'Falten camps o format invàlid (filename, contentType)', details: parseResult.error.format() }, 400);
    }

    const { filename, contentType } = parseResult.data;

    const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
    if (!ALLOWED_MIME_TYPES.includes(contentType)) {
        return jsonResponse({ error: 'Tipus de fitxer no permès' }, 415);
    }

    const accountId = process.env.R2_ACCOUNT_ID;
    const endpoint = process.env.R2_ENDPOINT || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : null);
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const bucketName = process.env.R2_BUCKET_NAME;
    const publicUrlBase = process.env.VITE_R2_PUBLIC_URL;

    if (!endpoint || !accessKeyId || !secretAccessKey || !bucketName || !publicUrlBase) {
        return jsonResponse({ error: 'Configuració R2 incompleta al servidor' }, 500);
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

    const cleanFilename = filename.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const objectKey = `community/${Date.now()}-${cleanFilename}`;

    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: objectKey,
        ContentType: contentType,
        CacheControl: 'public, max-age=31536000, immutable',
    });

    try {
        const presignedUrl = await getSignedUrl(S3, command, { 
            expiresIn: 300,
            signableHeaders: new Set(['content-type', 'cache-control'])
        });
        
        return jsonResponse({ 
            presignedUrl, 
            objectKey,
            publicUrl: `${publicUrlBase}/${objectKey}`
        }, 200);

    } catch (error) {
        console.error('[R2 Presign Error]', error);
        return jsonResponse({ error: 'Error intern generant URL de pujada' }, 500);
    }
});
