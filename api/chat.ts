import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { getChatModels, getLiteModels, applyThinkingConfig } from './_shared/models';
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
import { resolveGroundingChunks } from './_shared/grounding';

function truncateAtWordBoundary(text: string, maxLen: number): string {
    if (text.length <= maxLen) return text;

    const truncated = text.substring(0, maxLen);
    const match = truncated.match(/\s(?=[^\s]*$)/);
    const lastSpace = match ? match.index! : -1;

    return lastSpace > maxLen * 0.7 ? truncated.substring(0, lastSpace) : truncated;
}

//Necessitat google search
async function classifySearchIntent(message: string, ai: GoogleGenAI, emit: SseEmitFn): Promise<boolean> {
    await emit('thought', { text: `🔍 i18n:analyzingIntent\n` });
    const trimmed = message.trim();

    const prompt = `Ets un classificador d'intenció de cerca web per a un assistent d'apunts universitaris.

Pregunta de l'usuari: "${truncateAtWordBoundary(trimmed, 300).replace(/"/g, '\\"')}"

La teva tasca és retornar:
1 -> Si cal cercar a internet (persones, entitats, bots, personatges, "coneixes X?", "qui és X?", eines noves, notícies, actualitat o termes externs).
0 -> Si NO cal cercar perquè és teoria universitària estàndard (matemàtiques, derivades, matrius, algorísmia, grafs, C++), dubtes dels apunts o salutacions bàsiques ("hola", "gràcies").

Respon ÚNICAMENT amb el dígit 1 o 0 (sense cap altre text).
Dígit:`;

    const candidateModels = getLiteModels();
    const controllers = candidateModels.map(() => new AbortController());

    // Execució en paral·lel de tots els models Lite: el primer que respongui determina el resultat (Promise.any)
    const promises = candidateModels.map(async (liteModel, index) => {
        const controller = controllers[index];
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        const thinkingConfig = liteModel.startsWith('gemini-3')
            ? { thinkingLevel: ThinkingLevel.MINIMAL }
            : { thinkingBudget: 0 };

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
                    maxOutputTokens: 5,
                    thinkingConfig,
                    abortSignal: controller.signal,
                }
            });

            clearTimeout(timeoutId);
            const answer = (response.text || "").trim();
            if (!answer) throw new Error("Resposta buida");
            return answer.includes('1');
        } catch (err) {
            clearTimeout(timeoutId);
            throw err;
        }
    });

    try {
        const search = await Promise.any(promises);
        // Cancelem els altres models en curs per estalviar recursos
        controllers.forEach(c => c.abort());
        await emit('thought', { text: search ? `i18n:searchDetected\n\n` : `i18n:searchNotNeeded\n\n` });
        return search;
    } catch {
        controllers.forEach(c => c.abort());
        await emit('thought', { text: `i18n:searchFailed\n\n` });
        return false;
    }
}

interface MemoryAction {
    type: 'ADD' | 'UPDATE' | 'DELETE';
    content?: string;
    index?: number;
}

const MEMORY_SYSTEM_INSTRUCTION =
    "Ets el Gestor de Memòria. Si l'usuari revela detalls nous rellevants, usa manage_memory amb ADD. " +
    "Si diu quelcom que contradiu o actualitza una memòria de la llista, usa UPDATE. " +
    "Si exigeix oblidar alguna memòria, usa DELETE. Retorna SKIP en text lliure només si no hi ha canvis a fer.";

const MEMORY_TOOLS = [{ functionDeclarations: [manageMemoryTool] }];

// Necessitat guardar memòria d'usuari
async function extractUserMemories(
    message: string,
    aiSettings: AiSettings | undefined,
    ai: GoogleGenAI,
    parentSignal?: AbortSignal
): Promise<{ memory_actions: MemoryAction[] }> {
    const currentMemories = (aiSettings?.userContext?.memories || []);
    const memoryCtx = currentMemories.length > 0
        ? "La llista actual de memòries de l'usuari és:\n" + currentMemories.map((m: string) => `- "${m}"`).join('\n')
        : "Actualment no tens cap memòria de l'usuari.";

    const promptContent = `${memoryCtx}\n\nAnalitza el NOU missatge de l'usuari: "${truncateAtWordBoundary(message, 500).replace(/"/g, '\\"')}"`;

    for (const liteModel of getLiteModels()) {
        if (parentSignal?.aborted) return { memory_actions: [] };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        const onParentAbort = () => controller.abort();
        parentSignal?.addEventListener('abort', onParentAbort, { once: true });

        try {
            logGeminiPrompt({
                endpoint: 'chat:extract_memories',
                model: liteModel,
                systemInstruction: MEMORY_SYSTEM_INSTRUCTION,
                contents: promptContent,
                tools: MEMORY_TOOLS
            });

            const thinkingConfig = liteModel.startsWith('gemini-3')
                ? { thinkingLevel: ThinkingLevel.MINIMAL }
                : { thinkingBudget: 0 };

            const metadataResponse = await ai.models.generateContent({
                model: liteModel,
                contents: promptContent,
                config: {
                    systemInstruction: MEMORY_SYSTEM_INSTRUCTION,
                    tools: MEMORY_TOOLS,
                    temperature: 0.1,
                    maxOutputTokens: 250,
                    thinkingConfig,
                    abortSignal: controller.signal,
                }
            });

            clearTimeout(timeoutId);
            parentSignal?.removeEventListener('abort', onParentAbort);

            const memoryCall = metadataResponse.functionCalls?.find(call => call.name === 'manage_memory');
            const actions = (memoryCall?.args as any)?.actions;
            return { memory_actions: Array.isArray(actions) ? actions : [] };
        } catch (e: any) {
            clearTimeout(timeoutId);
            parentSignal?.removeEventListener('abort', onParentAbort);

            if (controller.signal.aborted || parentSignal?.aborted) {
                console.warn("[extractUserMemories] Temps límit de 2s superat o petició cancel·lada.");
                return { memory_actions: [] };
            }

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

                // 1. Extracció de memòries en segon pla (no bloquejant)
                const metadataPromise = extractUserMemories(message, aiSettings, ai, req.signal)
                    .catch(e => { console.warn("[extractUserMemories] Non-critical failure:", e); return { memory_actions: [] as MemoryAction[] }; });

                // 2. Classificació d'intenció de cerca (tots els models Lite en paral·lel, resposta instantània)
                const enableSearch = await classifySearchIntent(message, ai, emit);

                if (req.signal.aborted) return;

                // 3. 'chat:notes_router' depèn de si s'ha de cercar o no:
                // Si cal cercar a internet (enableSearch = true), no cal consultar ni injectar apunts universitaris.
                // Si NO cal cercar (enableSearch = false), cerquem els apunts del campus rellevants.
                let notesContext = "";
                if (!enableSearch) {
                    notesContext = await resolveDynamicNotesContext({
                        message,
                        currentPath,
                        pageText,
                        language
                    }, ai);
                }

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
                const targetModels = getChatModels(enableSearch);

                const systemInstruction = buildChatSystemInstruction(
                    aiSettings,
                    currentPath,
                    pageText,
                    notesContext,
                    enableSearch,
                    language
                );

                // Bucle de resiliència en cascada
                for (const modelName of targetModels) {
                    try {
                        const streamConfig: Record<string, unknown> = {
                            systemInstruction
                        };

                        if (enableSearch) {
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

                        let hasResolvedGrounding = false;
                        for await (const chunk of response) {
                            if (req.signal.aborted || controller.desiredSize === null) {
                                return;
                            }

                            const candidate = chunk.candidates?.[0];
                            if (!candidate) continue;

                            if (candidate.groundingMetadata) {
                                if (candidate.groundingMetadata.groundingChunks?.length && !hasResolvedGrounding) {
                                    hasResolvedGrounding = true;
                                    await resolveGroundingChunks(candidate.groundingMetadata.groundingChunks);
                                }
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
                        if (parsed.isSafety || parsed.isRecitation) {
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
                } else if (parsedLast.isSafety || parsedLast.isRecitation) {
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
