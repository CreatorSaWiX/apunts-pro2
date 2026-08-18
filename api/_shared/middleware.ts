import { verifyIdToken } from "./auth";
import { CORS_HEADERS, handleCors } from "./cors";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

let ratelimit: Ratelimit | null = null;
if (redisUrl && redisToken) {
  ratelimit = new Ratelimit({
    redis: new Redis({
      url: redisUrl,
      token: redisToken,
    }),
    limiter: Ratelimit.slidingWindow(10, "1 m"),
    analytics: true,
  });
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
      // 3. Extreure Token i Autenticar
      const authHeader = req.headers.get("authorization") || "";
      const idToken = authHeader.split("Bearer ")[1];
      
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

      if (ratelimit) {
        const xForwardedFor = req.headers.get("x-forwarded-for");
        const ip = xForwardedFor ? xForwardedFor.split(",")[0].trim() : "unknown";
        const identifier = userId || ip;
        const { success, limit, reset, remaining } = await ratelimit.limit(identifier);

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
      }

      // 4. Cridar a l'endpoint real amb l'userId
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
