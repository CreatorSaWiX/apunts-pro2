import { GoogleGenAI } from '@google/genai';
import { getLoadBalancedModels, getLiteModels, applyThinkingConfig } from './_shared/models';
import { withMiddleware } from './_shared/middleware';
import { chatRequestSchema, type AiSettings } from './_shared/schemas';
import { CORS_HEADERS } from './_shared/cors';
import { resolveDynamicNotesContext } from './_shared/notes-router';
import { buildChatSystemInstruction } from './_shared/prompts';
import { getGoogleGenAI } from './_shared/gemini';
import { parseGenAIError } from './_shared/errors';
import { createSseEmitter, type SseEmitFn } from './_shared/sse';
import { manageMemoryTool } from './_shared/chat-tools';
import { logGeminiPrompt } from './_shared/debug';

function truncateAtWordBoundary(text: string, maxLen: number): string {
    if (text.length <= maxLen) return text;

    const truncated = text.substring(0, maxLen);
    const match = truncated.match(/\s(?=[^\s]*$)/);
    const lastSpace = match ? match.index! : -1;

    return lastSpace > maxLen * 0.7 ? truncated.substring(0, lastSpace) : truncated;
}

async function classifySearchIntent(message: string, ai: GoogleGenAI, emit: SseEmitFn): Promise<boolean> {
    await emit('thought', { text: `🔍 i18n:analyzingIntent\n` });
    const trimmed = message.trim();

    const prompt = `Ets un classificador d'intenció de cerca. Respon ÚNICAMENT amb '1' o '0'.
Pregunta de l'usuari: "${truncateAtWordBoundary(trimmed, 300).replace(/"/g, '\\"')}"
Aquesta consulta demana informació d'actualitat, notícies recents, esdeveniments en temps real, el temps meteorològic, preus, esports, o tecnologia recent del món real que pugui haver canviat?
Respon 1 si requereix cerca a internet, o 0 si no en requereix:`;

    for (const liteModel of getLiteModels()) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1200);
        try {
            logGeminiPrompt({
                endpoint: 'chat:classify_search',
                model: liteModel,
                contents: prompt
            });

            const response = await ai.models.generateContent({
                model: liteModel,
                contents: prompt,
                config: {
                    temperature: 0,
                    maxOutputTokens: 1,
                    abortSignal: controller.signal,
                }
            });

            clearTimeout(timeoutId);
            const answer = (response.text || "").trim();
            const search = answer.includes('1');
            await emit('thought', { text: search ? `i18n:searchDetected\n\n` : `i18n:searchNotNeeded\n\n` });
            return search;
        } catch {
            clearTimeout(timeoutId);
            if (controller.signal.aborted) {
                console.warn("[classifySearchIntent] Temps límit de 1.2s superat, prioritzant coneixement acadèmic.");
                await emit('thought', { text: `i18n:searchFailed\n\n` });
                return false;
            }
        }
    }
    await emit('thought', { text: `i18n:searchFailed\n\n` });
    return false;
}

// Necessitat guardar memòria d'usuari
async function extractUserMemories(message: string, aiSettings: AiSettings | undefined, ai: GoogleGenAI): Promise<{ memory_actions: any[] }> {
    const currentMemories = (aiSettings?.userContext?.memories || []);
    const memoryCtx = currentMemories.length > 0
        ? "La llista actual de memòries de l'usuari és:\n" + currentMemories.map((m: string) => `- "${m}"`).join('\n')
        : "Actualment no tens cap memòria de l'usuari.";

    const promptContent = `${memoryCtx}\n\nAnalitza el NOU missatge de l'usuari: "${truncateAtWordBoundary(message, 500).replace(/"/g, '\\"')}"`;

    for (const liteModel of getLiteModels()) {
        try {
            logGeminiPrompt({
                endpoint: 'chat:extract_memories',
                model: liteModel,
                systemInstruction: "Ets el Gestor de Memòria. Si l'usuari revela detalls nous rellevants, usa manage_memory amb ADD. Si diu quelcom que contradiu o actualitza una memòria de la llista, usa UPDATE. Si exigeix oblidar alguna memòria, usa DELETE. Retorna SKIP en text lliure només si no hi ha canvis a fer.",
                contents: promptContent,
                tools: [{ functionDeclarations: [manageMemoryTool] }]
            });

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
    return { memory_actions: [] };
}

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

    // ── SSE Stream ───────────────────────────────────────────────────────────
    const sseStream = new ReadableStream({
        async start(controller) {
            const emit = createSseEmitter(controller, req);
            let lastError: unknown;
            let hasStartedWriting = false;

            try {
                await emit('status', { phase: 'thinking' });

                // Resolució dinàmica d'apunts i intenció de cerca en paral·lel (models Lite)
                const notesPromise = resolveDynamicNotesContext({
                    message,
                    currentPath,
                    pageText,
                    language
                }, ai);
                const searchPromise = classifySearchIntent(message, ai, emit);
                const metadataPromise = extractUserMemories(message, aiSettings, ai);

                const [notesContext, enableSearch] = await Promise.all([notesPromise, searchPromise]);

                if (req.signal.aborted) return;

                // Format del context de conversa
                const formattedHistory = history.map((msg) => ({
                    role: msg.role === 'user' ? 'user' as const : 'model' as const,
                    parts: [{ text: msg.content }]
                }));

                const msgParts: Array<{ text: string } | { inlineData: { data: string; mimeType: string } }> = [{ text: message }];
                if (image?.data && image?.mimeType) {
                    msgParts.push({ inlineData: { data: image.data, mimeType: image.mimeType } });
                }

                const fullContents = [...formattedHistory, { role: 'user', parts: msgParts }];
                const allAvailable = getLoadBalancedModels();
                // Si la consulta requereix cerca a internet (esport, actualitat, temps, etc.),
                // prioritzem models Gemini 2.x que tenen l'eina Google Search activa sense error de quota.
                // Per a la resta de preguntes (estudi, codi, mates), prioritzem Gemini 3.x amb thinking profund.
                const targetModels = enableSearch
                    ? [...allAvailable.filter(m => m.startsWith('gemini-2')), ...allAvailable.filter(m => !m.startsWith('gemini-2'))]
                    : allAvailable;

                // Bucle de resiliència en cascada
                for (const modelName of targetModels) {
                    try {
                        const modelHasSearch = enableSearch && modelName.startsWith('gemini-2');
                        const systemInstruction = buildChatSystemInstruction(
                            aiSettings,
                            currentPath,
                            pageText,
                            notesContext,
                            modelHasSearch,
                            language
                        );

                        const streamConfig: Record<string, unknown> = {
                            systemInstruction
                        };

                        // Google Search actiu només quan el model el suporta
                        if (modelHasSearch) {
                            streamConfig.tools = [{ googleSearch: {} }];
                        }

                        applyThinkingConfig(streamConfig as any, modelName, thinkingLevel);

                        await emit('status', { phase: 'thinking', model: modelName });
                        await emit('thought', { text: `📡 i18n:requestingModel:${modelName}\n` });

                        logGeminiPrompt({
                            endpoint: 'chat',
                            model: modelName,
                            systemInstruction,
                            contents: fullContents,
                            tools: streamConfig.tools,
                            config: streamConfig,
                            extra: {
                                currentPath,
                                language,
                                thinkingLevel,
                                enableSearch,
                                notesInjected: !!notesContext
                            }
                        });

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

                        // Emissió de memòries resoltes en segon pla
                        const metadataResult = await metadataPromise;
                        await emit('metadata', metadataResult);
                        await emit('done', {});
                        return;

                    } catch (e: unknown) {
                        lastError = e;
                        const parsed = parseGenAIError(e);

                        console.error(`[Fallback Loop] El model ${modelName} ha fallat:`, {
                            status: parsed.status,
                            grpcCode: parsed.grpcCode,
                            reason: parsed.reason,
                            message: parsed.cleanMessage
                        });

                        // Si el contingut ha estat bloquejat per filtres de seguretat, no té sentit provar altres models
                        if (parsed.cleanMessage.includes('SAFETY') || parsed.cleanMessage.includes('filtres') || parsed.cleanMessage.includes('RECITATION')) {
                            await emit('error', { message: parsed.cleanMessage });
                            await emit('done', {});
                            return;
                        }

                        // Si el model ha fallat per quota, saturació, sobrecàrrega o indisponibilitat temporal:
                        // Reintentem de forma resilient amb el següent model de la llista.
                        // Si ja havíem començat a enviar text a la pantalla, emetem 'reset' perquè el client netegi els fragments truncats.
                        if (hasStartedWriting) {
                            await emit('reset', {});
                            hasStartedWriting = false;
                        }

                        const failReason = parsed.isQuota
                            ? "reasonQuota"
                            : (parsed.status === 503 ? "reason503" : "reasonSaturation");
                        await emit('thought', { text: `❌ i18n:modelDenied:${modelName}:${failReason}\n\n` });
                        await new Promise(resolve => setTimeout(resolve, 150));
                        continue;
                    }
                }

                // Tots els models han fallat
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
                console.error("FATAL ERROR PROCESSANT LA PETICIÓ:", fatalError);
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
