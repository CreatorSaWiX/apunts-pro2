import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { getChatModels, getLiteModels, applyThinkingConfig } from './_shared/models.js';
import { withMiddleware } from './_shared/middleware.js';
import { chatRequestSchema, type AiSettings } from './_shared/schemas.js';
import { CORS_HEADERS } from './_shared/cors.js';
import { resolveDynamicNotesContext, isTrivialConversationalMessage } from './_shared/notes-router.js';
import { buildChatSystemInstruction } from './_shared/prompts.js';
import { getGoogleGenAI } from './_shared/gemini.js';
import { parseGenAIError } from './_shared/errors.js';
import { createSseEmitter, SSE_HEADERS, type SseEmitFn } from './_shared/sse.js';
import { manageMemoryTool } from './_shared/chat-tools.js';
import { logGeminiPrompt } from './_shared/debug.js';
import { resolveGroundingChunks } from './_shared/grounding.js';

function truncateAtWordBoundary(text: string, maxLen: number): string {
    if (text.length <= maxLen) return text;

    const truncated = text.substring(0, maxLen);
    const match = truncated.match(/\s(?=[^\s]*$)/);
    const lastSpace = match ? match.index! : -1;

    return lastSpace > maxLen * 0.7 ? truncated.substring(0, lastSpace) : truncated;
}

// Heurística local O(1) per evitar consumir quota d'API innecessàriament
const NO_SEARCH_REGEX = /^(hola|bon dia|bona tarda|bona nit|ei|bones|adeu|gr[aà]cies|merci|hello|hi|hey|què és|que es|com es|com funciona|explica'm|resol|demostra|troba|calcula|deriva|integra|resumeix|resum|ajuda'm|tinc un dubte)\b/i;
const SEARCH_TRIGGER_REGEX = /\b(qui [eé]s|qui era|qui va ser|coneixes a|not[ií]cia|actualitat|última hora|avui en dia|any 202[4-9]|paper de recerca|arxiv|jutge\.org|fib-upc|novetats?|preu|cotitzaci[oó]|resultat del partit)\b/i;

// Heurística O(1) per saber si el missatge pot contenir fets personals a memoritzar
const MEMORY_CANDIDATE_REGEX = /\b(em dic|soc |sóc |estudio|estudio a|curs[oo]|m'agrada|m'encanta|odio|prefereixo|recorda|memoron|oblida|esborra|el meu nom|tinc \d+ anys|visc a|treballo|vaig aprovar|he susp[eè]s|matriculat)\b/i;

async function classifySearchIntent(message: string, ai: GoogleGenAI, emit: SseEmitFn): Promise<boolean> {
    const trimmed = message.trim();

    if (isTrivialConversationalMessage(trimmed)) {
        return false;
    }

    // 1. Detecció ultraràpida O(1): Prioritat absoluta a paraules clau que requereixen informació externa
    if (SEARCH_TRIGGER_REGEX.test(trimmed)) {
        await emit('thought', { text: `i18n:searchDetected\n\n` });
        return true;
    }
    // 2. Filtre de preguntes teòriques o acadèmiques habituals (< 120 caràcters)
    if (trimmed.length < 120 && NO_SEARCH_REGEX.test(trimmed)) {
        await emit('thought', { text: `i18n:searchNotNeeded\n\n` });
        return false;
    }

    await emit('status', { phase: 'analyzing_intent' });
    await emit('thought', { text: `🔍 i18n:analyzingIntent\n` });

    const prompt = `Ets un classificador d'intenció de cerca web per a un assistent d'apunts universitaris.

Pregunta de l'usuari: "${truncateAtWordBoundary(trimmed, 300).replace(/"/g, '\\"')}"

La teva tasca és retornar:
1 -> Si cal cercar a internet (persones, entitats, bots, personatges, "coneixes X?", "qui és X?", eines noves, notícies, actualitat o termes externs).
0 -> Si NO cal cercar perquè és teoria universitària estàndard (matemàtiques, derivades, matrius, algorísmia, grafs, C++), dubtes dels apunts o salutacions bàsiques ("hola", "gràcies").

Respon ÚNICAMENT amb el dígit 1 o 0 (sense cap altre text).
Dígit:`;

    const candidateModels = getLiteModels();

    for (let i = 0; i < candidateModels.length; i++) {
        const liteModel = candidateModels[i];
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2200);
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
            if (!answer) continue;

            const search = answer.includes('1');
            await emit('thought', { text: search ? `i18n:searchDetected\n\n` : `i18n:searchNotNeeded\n\n` });
            return search;
        } catch (e) {
            clearTimeout(timeoutId);
            console.warn('[classifySearchIntent] Model failed, trying next:', e instanceof Error ? e.message : String(e));
            continue;
        }
    }

    await emit('thought', { text: `i18n:searchNotNeeded\n\n` });
    return false;
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

async function extractUserMemories(
    message: string,
    aiSettings: AiSettings | undefined,
    ai: GoogleGenAI,
    parentSignal?: AbortSignal
): Promise<{ memory_actions: MemoryAction[] }> {
    const trimmed = message.trim();
    if (isTrivialConversationalMessage(trimmed) || !MEMORY_CANDIDATE_REGEX.test(trimmed)) {
        return { memory_actions: [] };
    }

    const currentMemories = (aiSettings?.userContext?.memories || []);
    const memoryCtx = currentMemories.length > 0
        ? "La llista actual de memòries de l'usuari és:\n" + currentMemories.map((m: string) => `- "${m}"`).join('\n')
        : "Actualment no tens cap memòria de l'usuari.";

    const promptContent = `${memoryCtx}\n\nAnalitza el NOU missatge de l'usuari: "${truncateAtWordBoundary(trimmed, 500).replace(/"/g, '\\"')}"`;

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
            const actions = (memoryCall?.args as Record<string, unknown>)?.actions;
            return { memory_actions: Array.isArray(actions) ? actions : [] };
        } catch (e: unknown) {
            clearTimeout(timeoutId);
            parentSignal?.removeEventListener('abort', onParentAbort);

            if (controller.signal.aborted || parentSignal?.aborted) {
                return { memory_actions: [] };
            }

            const parsed = parseGenAIError(e);
            if (parsed.isQuota || parsed.isUnavailable) continue;
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
            headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
        });
    }

    const sseStream = new ReadableStream({
        async start(controller) {
            const emit = createSseEmitter(controller, req);
            let lastError: unknown;
            let hasStartedWriting = false;

            try {
                await emit('status', { phase: 'thinking' });

                const isFastPath = isTrivialConversationalMessage(message) && !image?.data;

                // 1. Extracció de memòries en segon pla (només si hi ha indicis de dades personals)
                const metadataPromise = isFastPath
                    ? Promise.resolve({ memory_actions: [] as MemoryAction[] })
                    : extractUserMemories(message, aiSettings, ai, req.signal)
                        .catch(() => ({ memory_actions: [] as MemoryAction[] }));

                // 2. Classificació d'intenció de cerca
                const enableSearch = isFastPath
                    ? false
                    : await classifySearchIntent(message, ai, emit);

                if (req.signal.aborted) return;

                // 3. Resolució d'apunts (s'omet completament en Fast-Path o si cal cerca web)
                let notesContext = "";
                if (!enableSearch && !isFastPath) {
                    await emit('status', { phase: 'searching_vector' });
                    notesContext = await resolveDynamicNotesContext({
                        message,
                        currentPath,
                        pageText,
                        language
                    }, ai);
                } else if (enableSearch) {
                    await emit('status', { phase: 'searching_web' });
                }

                if (req.signal.aborted) return;

                const formattedHistory = history.map((msg) => ({
                    role: msg.role === 'user' ? 'user' as const : 'model' as const,
                    parts: [{ text: msg.content }]
                }));

                const msgParts: Array<{ text: string } | { inlineData: { data: string; mimeType: string } }> = [{ text: message }];
                if (image?.data && image?.mimeType) {
                    msgParts.push({ inlineData: { data: image.data, mimeType: image.mimeType } });
                }

                const fullContents = [...formattedHistory, { role: 'user', parts: msgParts }];
                const targetModels = getChatModels(enableSearch, isFastPath);

                const systemInstruction = buildChatSystemInstruction(
                    aiSettings,
                    currentPath,
                    isFastPath ? "" : pageText,
                    notesContext,
                    enableSearch,
                    language
                );

                // Bucle de resiliència en cascada amb Timeout de Primer Token (TTFT)
                for (const modelName of targetModels) {
                    if (req.signal.aborted) return;

                    const attemptController = new AbortController();
                    const onClientAbort = () => attemptController.abort();
                    req.signal.addEventListener('abort', onClientAbort, { once: true });

                    // Si un model no envia el primer chunk en 8s (o 4.5s en Fast-Path), avortem i saltem al següent!
                    const firstChunkTimeoutMs = isFastPath ? 4500 : 8500;
                    let timeoutId: ReturnType<typeof setTimeout> | null = setTimeout(() => {
                        attemptController.abort(new Error(`Timeout esperant el primer token de ${modelName}`));
                    }, firstChunkTimeoutMs);

                    const refreshStreamTimeout = (ms = 15000) => {
                        if (timeoutId) clearTimeout(timeoutId);
                        timeoutId = setTimeout(() => {
                            attemptController.abort(new Error(`Timeout d'inactivitat de streaming a ${modelName}`));
                        }, ms);
                    };

                    try {
                        const streamConfig: Record<string, unknown> = {
                            systemInstruction,
                            abortSignal: attemptController.signal,
                        };

                        if (enableSearch) {
                            streamConfig.tools = [{ googleSearch: {} }];
                        }

                        applyThinkingConfig(streamConfig as any, modelName, thinkingLevel, {
                            disableThinking: isFastPath,
                            userMessage: message,
                        });

                        await emit('status', { phase: 'thinking', model: modelName });
                        if (!isFastPath) {
                            await emit('thought', { text: `📡 i18n:requestingModel:${modelName}\n` });
                        }

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
                                isFastPath,
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
                                if (timeoutId) clearTimeout(timeoutId);
                                req.signal.removeEventListener('abort', onClientAbort);
                                return;
                            }

                            refreshStreamTimeout(15000);

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

                        if (timeoutId) clearTimeout(timeoutId);
                        req.signal.removeEventListener('abort', onClientAbort);

                        if (!hasStartedWriting) {
                            throw new Error('Resposta buida del model.');
                        }

                        const metadataResult = await metadataPromise;
                        await emit('metadata', metadataResult);
                        await emit('done', {});
                        return;

                    } catch (e: unknown) {
                        if (timeoutId) clearTimeout(timeoutId);
                        req.signal.removeEventListener('abort', onClientAbort);

                        // Si l'usuari ha cancel·lat manualment des del navegador, sortim immediatament
                        if (req.signal.aborted) {
                            return;
                        }

                        lastError = e;
                        const parsed = parseGenAIError(e);

                        console.error(`[Fallback Loop] El model ${modelName} ha fallat:`, {
                            status: parsed.status,
                            grpcCode: parsed.grpcCode,
                            reason: parsed.reason,
                            message: parsed.cleanMessage
                        });

                        if (parsed.isSafety || parsed.isRecitation) {
                            await emit('error', { message: parsed.cleanMessage });
                            await emit('done', {});
                            return;
                        }

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

            } catch (fatalError: unknown) {
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
        headers: SSE_HEADERS,
    });
});
