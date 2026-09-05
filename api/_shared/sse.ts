export interface SseEmitterOptions {
    maxBackpressureTimeoutMs?: number;
}

export type SseEmitFn = (event: string, data: object) => Promise<boolean>;

/**
 * Crea una funció d'emissió d'esdeveniments Server-Sent Events (SSE) tipada
 * amb control actiu de contrapressió (Backpressure) i protecció contra desconnexions o clients congelats.
 */
export function createSseEmitter(
    controller: ReadableStreamDefaultController,
    req: Request,
    options: SseEmitterOptions = {}
): SseEmitFn {
    const encoder = new TextEncoder();
    const timeoutMs = options.maxBackpressureTimeoutMs ?? 10_000;

    return async (event: string, data: object): Promise<boolean> => {
        if (req.signal.aborted || controller.desiredSize === null) return false;

        // Control de contrapressió: si el client no consumeix dades, desiredSize baixa a <= 0.
        // Pausem l'emissió fins que dreni o superi el temps límit de seguretat (client zombi).
        const maxBackpressureTimeout = Date.now() + timeoutMs;
        while (controller.desiredSize !== null && controller.desiredSize <= 0) {
            if (req.signal.aborted || Date.now() > maxBackpressureTimeout) return false;
            await new Promise(resolve => setTimeout(resolve, 20));
        }

        if (req.signal.aborted || controller.desiredSize === null) return false;

        const sseMessage = `event: ${event}\n` + `data: ${JSON.stringify(data)}\n\n`;
        try {
            controller.enqueue(encoder.encode(sseMessage));
            return true;
        } catch {
            return false;
        }
    };
}
