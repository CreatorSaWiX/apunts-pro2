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
        const { POST } = await import('../../../../api/reset-password.ts');
        
        // Creem un "Request" simulat (Web API standard que espera Vercel)
        const url = new URL(req.url || '', `http://${req.headers.host}`);
        const mockRequest = new Request(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: body
        });

        // Cridem la funció de Vercel directament
        const response = await POST(mockRequest);
        
        // Retornem la resposta al format de Node (el que espera Vite)
        res.statusCode = response.status;
        response.headers.forEach((value, key) => {
          res.setHeader(key, value);
        });
        
        const responseBody = await response.text();
        res.end(responseBody);
      } catch (e: any) {
        console.error("[DevServer reset-password Error]:", e);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: String(e.message || e) }));
      }
    });
  } else {
    res.statusCode = 405;
    res.end('Method Not Allowed');
  }
}
