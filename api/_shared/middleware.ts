import { verifyIdToken } from "./auth";
import { CORS_HEADERS, handleCors } from "./cors";

// ── Rate Limiter en memòria RAM (Sliding Window, 20 req / 1 min) ─────────────
interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitRecord>();
const WINDOW_MS = 60 * 1000; // 1 minut
const MAX_REQUESTS = 20; // 20 peticions per minut per client

// Neteja periòdica d'entrades antigues cada 5 minuts
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
 * Funció de middleware superior (Higher-Order Function)
 * Afegeix suport de CORS i Autenticació automàtica a les API de l'estàndard web Request -> Response.
 */
export function withMiddleware(
  handler: (req: Request, userId?: string) => Promise<Response> | Response,
  options: { requireAuth?: boolean } = { requireAuth: true }
) {
  return async (req: Request): Promise<Response> => {
    // 1. Gestió CORS
    const corsOptions = handleCors(req);
    if (corsOptions) return corsOptions;

    // 2. Prevenir mètodes no permesos que no siguin POST per defecte
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
      
      // 4. Rate Limiting en memòria (ABANS de la criptografia pesada per seguretat)
      const xForwardedFor = req.headers.get("x-forwarded-for");
      const ip = xForwardedFor ? xForwardedFor.split(",")[0].trim() : "unknown";
      const identifier = idToken || ip;
      const { success, limit, reset, remaining } = checkRateLimit(identifier);

      if (!success) {
        return new Response(JSON.stringify({ error: "S'ha superat el límit de peticions. Si us plau, torna-ho a provar més tard." }), {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
            ...CORS_HEADERS
          }
        });
      }

      // 5. Autenticar Token
      let userId: string | undefined = undefined;

      if (idToken) {
         try {
            const decoded = await verifyIdToken(idToken);
            userId = decoded.uid;
         } catch (e) {
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
      return new Response(
        JSON.stringify({ error: message }),
        { status: 500, headers: { "Content-Type": "application/json", ...CORS_HEADERS } }
      );
    }
  };
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
