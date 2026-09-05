import { GoogleGenAI, Type, ApiError } from '@google/genai';
import { getLoadBalancedModels, getLiteModels, applyThinkingConfig } from './_shared/models';
import { withMiddleware } from './_shared/middleware';
import { chatRequestSchema } from './_shared/schemas';
import { CORS_HEADERS } from './_shared/cors';
import { Index } from "@upstash/vector";
import { buildChatSystemInstruction } from './_shared/prompts';

let vectorIndex: Index | null = null;
function getVectorIndex(): Index | null {
    if (vectorIndex) return vectorIndex;

    const url = process.env.UPSTASH_VECTOR_REST_URL;
    const token = process.env.UPSTASH_VECTOR_REST_TOKEN;
    if (!url || !token) return null;

    vectorIndex = new Index({ url, token });
    return vectorIndex;
}

let aiInstance: GoogleGenAI | null = null;

function getGoogleGenAI(): GoogleGenAI | null {
    if (aiInstance) return aiInstance;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;

    aiInstance = new GoogleGenAI({ apiKey });
    return aiInstance;
}


/** Trunca a un límit de caràcters respectant fronteres de paraules. */
function truncateAtWordBoundary(text: string, maxLen: number): string {
    if (text.length <= maxLen) return text;

    const truncated = text.substring(0, maxLen);
    const match = truncated.match(/\s(?=[^\s]*$)/);
    const lastSpace = match ? match.index! : -1;

    return lastSpace > maxLen * 0.7 ? truncated.substring(0, lastSpace) : truncated;
}

interface ParsedApiError {
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
function parseGenAIError(e: unknown): ParsedApiError {
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


// ── Eines (Tools) ────────────────────────────────────────────────────────────
const manageMemoryTool = {
    name: "manage_memory",
    description: "Utilitza aquesta eina EXCLUSIVAMENT quan l'usuari reveli fets personals clars, canvis en la seva vida acadèmica o aficions, o t'ordeni explícitament que oblidis alguna cosa que sabies d'ell.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            actions: {
                type: Type.ARRAY,
                description: "Llista d'accions CRUD per mantenir el perfil al dia.",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        action: {
                            type: Type.STRING,
                            enum: ["ADD", "UPDATE", "DELETE"],
                            description: "Tipus d'acció: només pot ser ADD, UPDATE o DELETE."
                        },
                        old_fact: {
                            type: Type.STRING,
                            description: "Només per UPDATE i DELETE. La cadena EXACTA de la memòria a modificar o esborrar de la llista que has rebut."
                        },
                        new_fact: {
                            type: Type.STRING,
                            description: "Només per ADD i UPDATE. El nou fet pur a guardar."
                        }
                    },
                    required: ["action"]
                }
            }
        },
        required: ["actions"]
    }
};

// ── Main Handler ─────────────────────────────────────────────────────────────
export default withMiddleware(async function handler(req: Request, _userId?: string): Promise<Response> {
    const rawBody = await req.json().catch(() => ({}));
    const parseResult = chatRequestSchema.safeParse(rawBody);

    if (!parseResult.success) {
        return new Response(JSON.stringify({ error: 'Dades invàlides', details: parseResult.error.format() }), {
            status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
        });
    }

    const { message, history, currentPath, pageText, image, aiSettings, thinkingLevel, language } = parseResult.data;

    const ai = getGoogleGenAI();
    if (!ai) {
        return new Response(JSON.stringify({ error: 'Error intern del servidor (C)' }), {
            status: 500,
            headers: CORS_HEADERS
        });
    }

    // ── SSE Stream ───────────────────────────────────────────────────
    const encoder = new TextEncoder();

    const sseStream = new ReadableStream({
        async start(controller) {
            const emit = async (event: string, data: object): Promise<boolean> => {
                if (req.signal.aborted || controller.desiredSize === null) return false;

                // Backpressure: si el client no consumeix prou ràpid, la cua interna s'omple (desiredSize <= 0).
                // Pausem l'emissió cedint l'Event Loop fins que el client dreni el buffer.
                while (controller.desiredSize !== null && controller.desiredSize <= 0) {
                    if (req.signal.aborted) return false;
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

            let lastError: any;
            let hasStartedWriting = false;

            try {
                await emit('status', { phase: 'analyzing_intent' });

                // 7 apunts de teoria per upstash vector
                const ragPromise = (async () => {
                    let notesCtx = "";
                    try {
                        const embedResponse = await ai.models.embedContent({
                            model: 'gemini-embedding-2',
                            contents: truncateAtWordBoundary(message, 500),
                            config: { outputDimensionality: 1536 }
                        });
                        const userVector = embedResponse.embeddings?.[0]?.values;

                        const index = getVectorIndex();
                        if (userVector && index) {
                            const queryResponse = await index.query({
                                vector: userVector,
                                topK: 7,
                                includeMetadata: true
                            });
                            notesCtx = queryResponse
                                .map((r) => {
                                    const meta = r.metadata as Record<string, string> | undefined;
                                    return `## Tema: ${meta?.title ?? 'Sense títol'} (Rellevància: ${(r.score * 100).toFixed(1)}%)\n\n${meta?.content ?? ''}`;
                                })
                                .join('\n\n---\n\n');
                        } else {
                            throw new Error("Missing Upstash Keys or Vector");
                        }
                    } catch (error) {
                        console.warn("RAG no disponible (Upstash), continuant amb context de pàgina i coneixement del model:", error);
                    }
                    return notesCtx;
                })();

                // Cerca google
                const intentPromise = (async () => {
                    await emit('thought', { text: `🔍 i18n:analyzingIntent\n` });
                    const classifierPrompt = `Ets un classificador. Respon NOMÉS amb el número 1 o 0.\nL'usuari ha fet la següent consulta: "${message}"\nAquesta consulta demana informació actualitzada, notícies recents, o dades del món real que no es puguin deduir sense buscar a internet?\nRespon 1 si requereix cerca a internet, o 0 si no en requereix.`;

                    for (const liteModel of getLiteModels()) {
                        const classifierController = new AbortController();
                        const timeoutId = setTimeout(() => classifierController.abort(), 1500);
                        try {
                            const classifierResponse = await ai.models.generateContent({
                                model: liteModel,
                                contents: classifierPrompt,
                                config: {
                                    temperature: 0,
                                    maxOutputTokens: 5,
                                    abortSignal: classifierController.signal,
                                }
                            });

                            clearTimeout(timeoutId);
                            const classifierText = (classifierResponse.text || "").trim();
                            const search = classifierText === '1';
                            await emit('thought', { text: search ? `i18n:searchDetected\n\n` : `i18n:searchNotNeeded\n\n` });
                            return search;
                        } catch (e) {
                            clearTimeout(timeoutId);

                            if (classifierController.signal.aborted) {
                                console.warn("Classificador d'intenció ha superat el temps límit (1.5s).");
                                await emit('thought', { text: `i18n:searchFailed\n\n` });
                                return false;
                            }

                            console.warn(`Model ${liteModel} ha fallat, provant següent...`);
                        }
                    }
                    await emit('thought', { text: `i18n:searchFailed\n\n` });
                    return false;
                })();

                // Afegir memòria usuari
                const metadataPromise = (async () => {
                    const currentMemories = (aiSettings?.userContext?.memories || []);
                    const memoryCtx = currentMemories.length > 0
                        ? "La llista actual de memòries de l'usuari és:\n" + currentMemories.map((m: string) => `- "${m}"`).join('\n')
                        : "Actualment no tens cap memòria de l'usuari.";

                    const promptContent = `${memoryCtx}\n\nAnalitza el NOU missatge de l'usuari: "${truncateAtWordBoundary(message, 500).replace(/"/g, '\\"')}"`;

                    for (const liteModel of getLiteModels()) {
                        try {
                            const metadataResponse = await ai.models.generateContent({
                                model: liteModel,
                                contents: promptContent,
                                config: {
                                    systemInstruction: "Ets el Gestor de Memòria. Si l'usuari revela detalls nous rellevants, usa manage_memory amb ADD. Si diu quelcom que contradiu o actualitza una memòria de la llista, usa UPDATE. Si exigeix oblidar alguna memòria, usa DELETE. Retorna SKIP en text lliure només si no hi ha canvis a fer.",
                                    tools: [{ functionDeclarations: [manageMemoryTool] }],
                                    temperature: 0.1,
                                    maxOutputTokens: 250
                                }
                            });

                            const memoryCall = metadataResponse.functionCalls?.find(call => call.name === 'manage_memory');
                            const actions = (memoryCall?.args as any)?.actions;

                            return { memory_actions: Array.isArray(actions) ? actions : [] };

                        } catch (e: any) {
                            const parsed = parseGenAIError(e);
                            if (parsed.isQuota || parsed.isUnavailable) continue;
                            console.warn("Extracció de metadades fallida (no crític):", e);
                            return { memory_actions: [] };
                        }
                    }
                    return {memory_actions: []};
                })();

                const [notesContext, attemptWithSearch] = await Promise.all([ragPromise, intentPromise]);

                if (req.signal.aborted) {
                    controller.close();
                    return;
                }

                const formattedHistory = history.map((msg) => ({
                    role: msg.role === 'user' ? 'user' as const : 'model' as const,
                    parts: [{ text: msg.content }]
                }));

                const msgParts: Array<{ text: string } | { inlineData: { data: string; mimeType: string } }> = [{ text: message }];
                if (image && image.data && image.mimeType) {
                    msgParts.push({ inlineData: { data: image.data, mimeType: image.mimeType } });
                }

                const systemInstruction = buildChatSystemInstruction(
                    aiSettings,
                    currentPath,
                    pageText,
                    notesContext,
                    attemptWithSearch,
                    language
                );

                const fullContents = [...formattedHistory, { role: 'user', parts: msgParts }];
                let targetModels = getLoadBalancedModels();
                if (attemptWithSearch) {
                    targetModels = targetModels.filter(m => !m.startsWith('gemini-3'));
                }

                for (const modelName of targetModels) {
                    try {
                        const streamConfig: Record<string, unknown> = {
                            systemInstruction
                        };
                        if (attemptWithSearch) {
                            streamConfig.tools = [{ googleSearch: {} }];
                        }

                        applyThinkingConfig(streamConfig as any, modelName, thinkingLevel);

                        await emit('status', { phase: 'thinking', model: modelName });
                        await emit('thought', { text: `📡 i18n:requestingModel:${modelName}\n` });

                        const response = await ai.models.generateContentStream({
                            model: modelName,
                            contents: fullContents,
                            config: streamConfig as any,
                        });

                        for await (const chunk of response) {
                            if (req.signal.aborted || controller.desiredSize === null) {
                                return;
                            }

                            const candidate = chunk.candidates?.[0];
                            if (!candidate) continue;

                            if (candidate.groundingMetadata) {
                                const ok = await emit('grounding', candidate.groundingMetadata);
                                if (!ok) return;
                            }

                            if (candidate.finishReason === 'SAFETY') {
                                throw new Error("El contingut ha estat bloquejat pels filtres de seguretat de Google (SAFETY).");
                            }
                            if (candidate.finishReason === 'RECITATION') {
                                throw new Error("El contingut ha estat bloquejat per protecció de drets d'autor (RECITATION).");
                            }

                            for (const part of candidate.content?.parts || []) {
                                if (part.thought && part.text) {
                                    const ok = await emit('thought', { text: part.text });
                                    if (!ok) return;
                                } else if (part.text) {
                                    if (!hasStartedWriting && part.text.trim().length > 0) {
                                        await emit('status', { phase: 'writing' });
                                        hasStartedWriting = true;
                                    }
                                    const ok = await emit('delta', { text: part.text });
                                    if (!ok) return;
                                }
                            }
                        }

                        if (!hasStartedWriting) {
                            await emit('error', { message: 'El model ha processat la informació però no ha generat cap text de resposta (Filtres de seguretat o error de format).' });
                            await emit('done', {});
                            return;
                        }

                        // ── Extracció de memòries (post-resposta, best-effort) ────────
                        const metadataResult = await metadataPromise;
                        await emit('metadata', metadataResult);
                        await emit('done', {});
                        return; // Resposta completada amb èxit!

                    } catch (e: unknown) {
                        lastError = e;
                        const parsed = parseGenAIError(e);

                        console.error(`[Fallback Loop] El model ${modelName} ha fallat:`, {
                            status: parsed.status,
                            grpcCode: parsed.grpcCode,
                            reason: parsed.reason,
                            message: parsed.cleanMessage
                        });

                        // Si és un error recuperable i encara no havíem començat a escriure, provem el següent model
                        if ((parsed.isQuota || parsed.isUnavailable) && !hasStartedWriting) {
                            const failReason = parsed.isQuota
                                ? "reasonQuota"
                                : (parsed.status === 503 ? "reason503" : "reasonSaturation");
                            await emit('thought', { text: `❌ i18n:modelDenied:${modelName}:${failReason}\n\n` });
                            await new Promise(resolve => setTimeout(resolve, 150));
                            continue;
                        }

                        // Si ha fallat a mig escriure o és un error fatal no recuperable, informem i sortim
                        let chunkErrorMsg = parsed.cleanMessage || 'Error intern del servidor';
                        if (parsed.isQuota) {
                            chunkErrorMsg = `⚠️ El model '${modelName}' ha denegat la petició per Quota Excedida (Límit de minuts o de dia).`;
                        } else if (parsed.isNotFound) {
                            chunkErrorMsg = `⚠️ El model '${modelName}' no existeix o no està disponible (Error 404).`;
                        } else if (parsed.cleanMessage.toLowerCase().includes('not supported') || parsed.cleanMessage.toLowerCase().includes('invalid arg')) {
                            chunkErrorMsg = `⚠️ El model '${modelName}' no suporta aquesta configuració: ` + chunkErrorMsg;
                        } else {
                            chunkErrorMsg = `⚠️ Error de l'API (${modelName}): ` + chunkErrorMsg;
                        }

                        await emit('error', { message: chunkErrorMsg });
                        await emit('done', {});
                        return;
                    }
                }

                // Si el bucle finalitza sense haver fet return, tots els models han fallat
                const parsedLast = parseGenAIError(lastError);
                let finalErrorMsg = 'Tots els models de Gemini han fallat. Si us plau, torna-ho a intentar més tard.';

                if (parsedLast.isQuota) {
                    const waitTime = parsedLast.retryAfterSeconds
                        ? `${parsedLast.retryAfterSeconds} segons`
                        : "un o dos minuts";
                    finalErrorMsg = `⚠️ Has esgotat tota la teva quota gratuïta (RPM o RPD) per als diferents models provats.\nL'API demana que t'esperis com a mínim **${waitTime}** abans de tornar-ho a provar.\n\n_Detall tècnic de l'últim intent: ${parsedLast.cleanMessage.substring(0, 150)}..._`;
                } else if (parsedLast.cleanMessage.includes('SAFETY') || parsedLast.cleanMessage.includes('filtres')) {
                    finalErrorMsg = "⚠️ El missatge ha estat bloquejat pels filtres de seguretat de Google.";
                } else if (parsedLast.isUnavailable) {
                    finalErrorMsg = "⚠️ Els servidors de Google estan saturats. Torna-ho a intentar en uns minuts.";
                } else if (parsedLast.cleanMessage) {
                    finalErrorMsg = "⚠️ Error de l'API: " + parsedLast.cleanMessage;
                }

                await emit('error', { message: finalErrorMsg });
                await emit('done', {});
            } catch (fatalError: any) {
                console.error("🔥 FATAL ERROR PROCESSANT LA PETICIÓ:", fatalError);
                const parsedFatal = parseGenAIError(fatalError);
                await emit('error', { message: 'Error fatal processant la petició: ' + (parsedFatal.cleanMessage || String(fatalError)) });
                await emit('done', {});
            } finally {
                try {
                    controller.close();
                } catch {
                    // Ignore if already closed
                }
            }
        }
    });

    return new Response(sseStream, {
        status: 200,
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            ...CORS_HEADERS,
        },
    });
});
