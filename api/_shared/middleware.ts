import { verifyIdToken } from "./auth";
import { CORS_HEADERS, handleCors } from "./cors";

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

      // 4. Cridar a l'endpoint real amb l'userId
      return await handler(req, userId);
      
    } catch (error: any) {
      console.error("[Middleware Error]:", error);
      return new Response(
        JSON.stringify({ error: error.message || "Internal Server Error" }),
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
