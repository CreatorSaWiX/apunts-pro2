import type { IncomingMessage, ServerResponse } from 'node:http';

export async function resetPasswordController(req: IncomingMessage, res: ServerResponse, env: Record<string, string>) {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        // INJECCIÓ D'ENTORN LOCAL PER A VITE:
        // Vite no posa les variables del .env.local directament a process.env per seguretat.
        // Ho fem manualment aquí perquè l'arxiu importat les pugui llegir igual que faria a Vercel.
        if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
            process.env.FIREBASE_SERVICE_ACCOUNT_KEY = env.FIREBASE_SERVICE_ACCOUNT_KEY;
            process.env.GMAIL_USER = env.GMAIL_USER;
            process.env.GMAIL_PASS = env.GMAIL_PASS;
        }

        // Importem el fitxer de l'API de Vercel
        const apiModule = await import('../../../../api/reset-password.ts');
        const handler = apiModule.default;
        
        // Creem un "Request" simulat (Web API standard que espera Vercel)
        const url = new URL(req.url || '', `http://${req.headers.host}`);
        const mockRequest = new Request(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: body
        });

        // Cridem la funció de Vercel directament
        const response = await handler(mockRequest);
        
        // Retornem la resposta al format de Node (el que espera Vite)
        res.statusCode = response.status;
        response.headers.forEach((value: string, key: string) => {
          res.setHeader(key, value);
        });
        
        const responseBody = await response.text();
        res.end(responseBody);
      } catch (e: unknown) {
        console.error("[DevServer reset-password Error]:", e);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: String((e as Error).message || e) }));
      }
    });
  } else {
    res.statusCode = 405;
    res.end('Method Not Allowed');
  }
}
