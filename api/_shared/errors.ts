import { ApiError } from '@google/genai';

export interface ParsedApiError {
    status?: number;
    grpcCode?: string | number;
    reason?: string;
    isQuota: boolean;
    isUnavailable: boolean;
    isNotFound: boolean;
    isSafety: boolean;
    isRecitation: boolean;
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
    const firstBrace = rawMsg.indexOf('{');
    const firstBracket = rawMsg.indexOf('[');
    let startIdx = -1;
    if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
        startIdx = firstBrace;
    } else if (firstBracket !== -1) {
        startIdx = firstBracket;
    }

    if (startIdx !== -1) {
        try {
            const parsedJson = JSON.parse(rawMsg.substring(startIdx));
            const errPayload = Array.isArray(parsedJson) ? (parsedJson[0]?.error || parsedJson[0]) : (parsedJson?.error || parsedJson);
            if (errPayload) {
                if (typeof errPayload.code === 'number') status = status ?? errPayload.code;
                if (typeof errPayload.status === 'string') grpcCode = grpcCode ?? errPayload.status;
                if (Array.isArray(errPayload.details) && errPayload.details.length > 0) {
                    reason = reason ?? errPayload.details[0]?.reason;
                }
                if (typeof errPayload.message === 'string') {
                    cleanMessage = errPayload.message;
                }
            }
        } catch {
            const matchMsg = rawMsg.match(/"message"\s*:\s*"([^"]+)"/);
            if (matchMsg) cleanMessage = matchMsg[1];
            const matchCode = rawMsg.match(/"code"\s*:\s*(\d+)/);
            if (matchCode) status = status ?? parseInt(matchCode[1], 10);
            const matchStatus = rawMsg.match(/"status"\s*:\s*"([^"]+)"/);
            if (matchStatus) grpcCode = grpcCode ?? matchStatus[1];
        }
    }

    let retryAfterSeconds: number | undefined;
    const retryMatch = rawMsg.match(/retry (?:in|after) ([\d\.]+)s?/i);
    if (retryMatch) {
        retryAfterSeconds = Math.ceil(parseFloat(retryMatch[1]));
    }

    const lowerMsg = (rawMsg + " " + cleanMessage).toLowerCase();

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
        status === 502 ||
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
        lowerMsg.includes('overloaded') ||
        lowerMsg.includes('spikes in demand') ||
        lowerMsg.includes('capacity') ||
        lowerMsg.includes('server is busy') ||
        lowerMsg.includes('fetch failed') ||
        lowerMsg.includes('econnreset') ||
        lowerMsg.includes('socket hang up') ||
        lowerMsg.includes('network');

    const isNotFound =
        status === 404 ||
        grpcCode === 'NOT_FOUND' ||
        grpcCode === 5 ||
        lowerMsg.includes('not found');

    const isSafety =
        lowerMsg.includes('safety') ||
        lowerMsg.includes('filtres de seguretat');

    const isRecitation =
        lowerMsg.includes('recitation') ||
        lowerMsg.includes('drets d\'autor');

    return {
        status,
        grpcCode,
        reason,
        isQuota,
        isUnavailable,
        isNotFound,
        isSafety,
        isRecitation,
        retryAfterSeconds,
        cleanMessage,
    };
}
