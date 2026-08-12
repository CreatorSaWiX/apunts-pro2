import type { IncomingMessage, ServerResponse } from 'node:http';

export async function jutgeProxyController(req: IncomingMessage, res: ServerResponse, env: Record<string, string>) {
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
    const { getProblemInfo } = await import('../../../../src/lib/jutgeScraper.js');

    const result = await getProblemInfo(id, reqLang);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.end(JSON.stringify(result));
  } catch (e: any) {
    console.error("[DevServer] Proxy Error:", e);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: String(e.message || e) }));
  }
}
