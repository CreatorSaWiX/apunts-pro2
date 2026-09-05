import { ApiError } from '@google/genai';

export interface ParsedApiError {
    status?: number;
    grpcCode?: string | number;
    reason?: string;
    isQuota: boolean;
    isUnavailable: boolean;
    isNotFound: boolean;
    retryAfterSeconds?: number;
    cleanMessage: string;
}

/**
 * Inspecciona estructuradament els errors retornats pel SDK de Google GenAI / gRPC / HTTP.
 * Prioritza codis d'estat HTTP, codis d'error gRPC i ErrorInfo estructurats sobre heurístiques fràgils de cadenes.
 */
export function parseGenAIError(e: unknown): ParsedApiError {
    const rawMsg = e instanceof Error ? e.message : String(e);

    let status: number | undefined;
    let grpcCode: string | number | undefined;
    let reason: string | undefined;

    if (e instanceof ApiError) {
        status = e.status;
    }

    if (typeof e === 'object' && e !== null) {
        const errObj = e as Record<string, any>;
        if (typeof errObj.status === 'number') status = status ?? errObj.status;
        if (typeof errObj.statusCode === 'number') status = status ?? errObj.statusCode;
        if (typeof errObj.response?.status === 'number') status = status ?? errObj.response.status;

        if (errObj.code !== undefined) grpcCode = errObj.code;
        if (typeof errObj.statusText === 'string') grpcCode = grpcCode ?? errObj.statusText;

        const details = Array.isArray(errObj.errorDetails) ? errObj.errorDetails : errObj.details;
        if (Array.isArray(details) && details.length > 0) {
            reason = details[0]?.reason;
        }
    }

    let cleanMessage = rawMsg;
    const jsonStart = rawMsg.indexOf('{');
    if (jsonStart !== -1) {
        try {
            const parsed = JSON.parse(rawMsg.substring(jsonStart));
            if (parsed.error) {
                if (typeof parsed.error.code === 'number') status = status ?? parsed.error.code;
                if (typeof parsed.error.status === 'string') grpcCode = grpcCode ?? parsed.error.status;
                if (Array.isArray(parsed.error.details) && parsed.error.details.length > 0) {
                    reason = reason ?? parsed.error.details[0]?.reason;
                }
                if (typeof parsed.error.message === 'string') {
                    cleanMessage = parsed.error.message;
                }
            }
        } catch {
            // Si no és un JSON vàlid, mantenim rawMsg
        }
    }

    let retryAfterSeconds: number | undefined;
    const retryMatch = rawMsg.match(/retry (?:in|after) ([\d\.]+)s?/i);
    if (retryMatch) {
        retryAfterSeconds = Math.ceil(parseFloat(retryMatch[1]));
    }

    const lowerMsg = rawMsg.toLowerCase();

    const isQuota =
        status === 429 ||
        grpcCode === 'RESOURCE_EXHAUSTED' ||
        grpcCode === 8 ||
        reason === 'RATE_LIMIT_EXCEEDED' ||
        reason === 'QUOTA_EXCEEDED' ||
        lowerMsg.includes('quota') ||
        lowerMsg.includes('rate limit') ||
        lowerMsg.includes('resource_exhausted') ||
        lowerMsg.includes('too many requests');

    const isUnavailable =
        status === 503 ||
        status === 500 ||
        status === 504 ||
        grpcCode === 'UNAVAILABLE' ||
        grpcCode === 14 ||
        grpcCode === 'INTERNAL' ||
        grpcCode === 13 ||
        reason === 'MODEL_OVERLOADED' ||
        reason === 'SERVICE_UNAVAILABLE' ||
        lowerMsg.includes('503') ||
        lowerMsg.includes('unavailable') ||
        lowerMsg.includes('high demand') ||
        lowerMsg.includes('overloaded');

    const isNotFound =
        status === 404 ||
        grpcCode === 'NOT_FOUND' ||
        grpcCode === 5 ||
        lowerMsg.includes('not found');

    return {
        status,
        grpcCode,
        reason,
        isQuota,
        isUnavailable,
        isNotFound,
        retryAfterSeconds,
        cleanMessage,
    };
}
