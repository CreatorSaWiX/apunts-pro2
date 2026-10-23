import type { IncomingMessage, ServerResponse } from "node:http";
import { verifyIdToken } from "./auth.js";
import { CORS_HEADERS, handleCors } from "./cors.js";

// ── Rate Limiter en memòria RAM (Sliding Window, 20 req / 1 min) ─────────────
interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitRecord>();
const WINDOW_MS = 60 * 1000; // 1 minut
const MAX_REQUESTS = 20; // 20 peticions per minut per client

if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < WINDOW_MS);
      if (record.timestamps.length === 0) {
        rateLimitMap.delete(key);
      }
    }
  }, 5 * 60 * 1000).unref?.();
}

function checkRateLimit(key: string): { success: boolean; limit: number; remaining: number; reset: number } {
  const now = Date.now();
  const record = rateLimitMap.get(key) || { timestamps: [] };
  record.timestamps = record.timestamps.filter((ts) => now - ts < WINDOW_MS);

  if (record.timestamps.length >= MAX_REQUESTS) {
    const oldest = record.timestamps[0];
    return {
      success: false,
      limit: MAX_REQUESTS,
      remaining: 0,
      reset: Math.ceil((oldest + WINDOW_MS - now) / 1000),
    };
  }

  record.timestamps.push(now);
  rateLimitMap.set(key, record);
  return {
    success: true,
    limit: MAX_REQUESTS,
    remaining: MAX_REQUESTS - record.timestamps.length,
    reset: Math.ceil(WINDOW_MS / 1000),
  };
}

/**
 * Converteix un IncomingMessage de Node.js / Vercel en un objecte Web Standard Request,
 * vinculant el senyal d'avortament si el client tanca la connexió.
 */
async function nodeIncomingToWebRequest(
  req: IncomingMessage & { body?: unknown; originalUrl?: string },
  res: ServerResponse
): Promise<Request> {
  const proto = (req.headers["x-forwarded-proto"] as string) || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost";
  const rawUrl = req.originalUrl || req.url || "/";
  const fullUrl = new URL(rawUrl, `${proto}://${Array.isArray(host) ? host[0] : host}`);

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value !== undefined) {
      headers.set(key, Array.isArray(value) ? value.join(", ") : value);
    }
  }

  const abortController = new AbortController();
  const onAbort = () => {
    if (!abortController.signal.aborted) {
      abortController.abort();
    }
  };
  req.on("aborted", onAbort);
  res.on("close", () => {
    if (!res.writableEnded) onAbort();
  });

  const method = (req.method || "GET").toUpperCase();
  let body: Uint8Array | string | undefined;

  if (method !== "GET" && method !== "HEAD") {
    // Si els petits payloads ja han estat llegits o si el stream encara és obert:
    const rawChunks: Buffer[] = [];
    if (!req.readableEnded) {
      try {
        for await (const chunk of req) {
          rawChunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        }
      } catch {
        // Ignorar si el stream ja s'havia consumit
      }
    }

    if (rawChunks.length > 0) {
      body = new Uint8Array(Buffer.concat(rawChunks));
    } else if (req.body !== undefined && req.body !== null) {
      if (typeof req.body === "string") {
        body = req.body;
      } else if (Buffer.isBuffer(req.body)) {
        body = new Uint8Array(req.body);
      } else if (typeof req.body === "object") {
        body = JSON.stringify(req.body);
      }
    }
  }

  return new Request(fullUrl.toString(), {
    method,
    headers,
    body,
    signal: abortController.signal,
  });
}

/**
 * Escriu i transmet un Web Standard Response cap al ServerResponse natiu de Node.js / Vercel
 * garantint el flush immediat de capçaleres i de cada paquet SSE.
 */
async function sendWebResponseToNode(webRes: Response, res: ServerResponse): Promise<void> {
  res.statusCode = webRes.status;
  webRes.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  if (typeof res.flushHeaders === "function") {
    res.flushHeaders();
  }

  if (!webRes.body) {
    const text = await webRes.text().catch(() => "");
    res.end(text);
    return;
  }

  const reader = webRes.body.getReader();
  const flushableRes = res as ServerResponse & { flush?: () => void };

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done || res.writableEnded) break;
      if (value) {
        res.write(value);
        if (typeof flushableRes.flush === "function") {
          flushableRes.flush();
        }
      }
    }
  } catch (err) {
    console.error("[Stream Pipe Error]:", err);
  } finally {
    try {
      reader.releaseLock();
    } catch {
      // Ignore
    }
    if (!res.writableEnded) {
      res.end();
    }
  }
}

/**
 * Executa la lògica central de CORS, Rate Limiting i Autenticació sobre un Web Request.
 */
async function executeWebPipeline(
  req: Request,
  handler: (req: Request, userId?: string) => Promise<Response> | Response,
  options: { requireAuth?: boolean }
): Promise<Response> {
  // 1. Gestió CORS
  const corsOptions = handleCors(req);
  if (corsOptions) return corsOptions;

  // 2. Prevenir mètodes no permesos que no siguin POST o GET
  if (req.method !== "POST" && req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
  }

  try {
    // 3. Extreure Token
    const authHeader = req.headers.get("authorization") || "";
    const match = authHeader.match(/^Bearer\s+(.*)$/i);
    const idToken = match ? match[1] : undefined;

    // 4. Rate Limiting en memòria
    const xForwardedFor = req.headers.get("x-forwarded-for");
    const ip = xForwardedFor ? xForwardedFor.split(",")[0].trim() : "unknown";
    const identifier = idToken || ip;
    const { success, limit, reset, remaining } = checkRateLimit(identifier);

    if (!success) {
      return new Response(
        JSON.stringify({ error: "S'ha superat el límit de peticions. Si us plau, torna-ho a provar més tard." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
            ...CORS_HEADERS,
          },
        }
      );
    }

    // 5. Autenticar Token
    let userId: string | undefined = undefined;

    if (idToken) {
      try {
        const decoded = await verifyIdToken(idToken);
        userId = decoded.uid;
      } catch {
        return new Response(JSON.stringify({ error: "Token invàlid o caducat." }), {
          status: 401,
          headers: { "Content-Type": "application/json", ...CORS_HEADERS },
        });
      }
    } else if (options.requireAuth) {
      return new Response(JSON.stringify({ error: "No autoritzat. Cal iniciar sessió." }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      });
    }

    // 6. Cridar a l'endpoint real amb l'userId
    return await handler(req, userId);
  } catch (error: unknown) {
    console.error("[Middleware Error]:", error);
    const message = (error as Error)?.message || "Internal Server Error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
  }
}

export type UniversalVercelHandler = ((req: Request) => Promise<Response>) & {
  (req: IncomingMessage, res: ServerResponse): Promise<void>;
  fetch: (req: Request) => Promise<Response>;
};

/**
 * Funció de middleware superior (Higher-Order Function) compatible tant amb:
 * - Web Standard Fetch API (`Request` -> `Response`)
 * - Vercel Node.js Runtime (`IncomingMessage`, `ServerResponse`)
 */
export function withMiddleware(
  handler: (req: Request, userId?: string) => Promise<Response> | Response,
  options: { requireAuth?: boolean } = { requireAuth: true }
): UniversalVercelHandler {
  const webHandler = async (req: Request): Promise<Response> => {
    return executeWebPipeline(req, handler, options);
  };

  const universalHandler = async (
    reqOrIncoming: Request | IncomingMessage,
    maybeRes?: ServerResponse
  ): Promise<any> => {
    // Cas 1: Invocació per @vercel/node amb (IncomingMessage, ServerResponse)
    if (maybeRes && typeof maybeRes.setHeader === "function" && typeof maybeRes.end === "function") {
      const webReq = await nodeIncomingToWebRequest(reqOrIncoming as IncomingMessage, maybeRes);
      const webRes = await webHandler(webReq);
      await sendWebResponseToNode(webRes, maybeRes);
      return;
    }

    // Cas 2: Invocació estàndard Web (Request -> Response)
    return webHandler(reqOrIncoming as Request);
  };

  universalHandler.fetch = webHandler;
  return universalHandler as UniversalVercelHandler;
}

/**
 * Funció auxiliar per respondre amb JSON
 */
export function jsonResponse(data: object, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}
