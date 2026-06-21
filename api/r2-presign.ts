import type { VercelRequest, VercelResponse } from '@vercel/node';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Mètode no permès. Fes servir POST.' });
    }

    try {
        const { filename, contentType } = req.body;

        if (!filename || !contentType) {
            return res.status(400).json({ error: 'Falta filename o contentType' });
        }

        const accountId = process.env.R2_ACCOUNT_ID;
        const endpoint = process.env.R2_ENDPOINT || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : null);
        const accessKeyId = process.env.R2_ACCESS_KEY_ID;
        const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
        const bucketName = process.env.R2_BUCKET_NAME;
        const publicUrlBase = process.env.VITE_R2_PUBLIC_URL;

        if (!endpoint || !accessKeyId || !secretAccessKey || !bucketName || !publicUrlBase) {
            return res.status(500).json({ error: 'Configuració R2 incompleta al servidor' });
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
        });

        // Generar URL signada vàlida per 5 minuts (300s)
        const presignedUrl = await getSignedUrl(S3, command, { 
            expiresIn: 300,
            signableHeaders: new Set(['content-type'])
        });
        
        // Retornem la URL on cal fer el PUT, i la URL pública final
        return res.status(200).json({ 
            presignedUrl, 
            objectKey,
            publicUrl: `${publicUrlBase}/${objectKey}`
        });

    } catch (error) {
        console.error('[R2 Presign Error]', error);
        res.status(500).json({ error: 'Error intern generant URL de pujada' });
    }
}
