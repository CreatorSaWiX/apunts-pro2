import { GoogleGenAI } from '@google/genai';
import { getLoadBalancedModels, getLiteModels, applyThinkingConfig } from './_shared/models';
import { withMiddleware } from './_shared/middleware';
import { chatRequestSchema, type AiSettings } from './_shared/schemas';
import { CORS_HEADERS } from './_shared/cors';
import { Index } from "@upstash/vector";
import { buildChatSystemInstruction } from './_shared/prompts';
import { getGoogleGenAI } from './_shared/gemini';
import { parseGenAIError } from './_shared/errors';
import { createSseEmitter } from './_shared/sse';
import { manageMemoryTool } from './_shared/chat-tools';
import { logGeminiPrompt } from './_shared/debug';

let vectorIndex: Index | null = null;
function getVectorIndex(): Index | null {
    if (vectorIndex) return vectorIndex;

    const url = process.env.UPSTASH_VECTOR_REST_URL;
    const token = process.env.UPSTASH_VECTOR_REST_TOKEN;
    if (!url || !token) return null;

    vectorIndex = new Index({ url, token });
    return vectorIndex;
}

function truncateAtWordBoundary(text: string, maxLen: number): string {
    if (text.length <= maxLen) return text;

    const truncated = text.substring(0, maxLen);
    const match = truncated.match(/\s(?=[^\s]*$)/);
    const lastSpace = match ? match.index! : -1;

    return lastSpace > maxLen * 0.7 ? truncated.substring(0, lastSpace) : truncated;
}

// ── RAG: Cercador semàntic optimitzat, deduplicat i unilingüe ────────────────
async function fetchRagNotes(
    message: string,
    ai: GoogleGenAI,
    userLanguage: string = 'ca',
    currentPath?: string,
    pageText?: string
): Promise<string> {
    try {
        // 1. Evitar RAG dispers si la consulta és autoreferent a la pàgina que l'alumne ja està mirant
        const lowerMsg = message.toLowerCase().trim();
        const isSelfReferential = /(aquest|aquesta|aquests|aquestes|este|esta|estos|estas|this|current)\s+(tema|pàgina|pagina|capítol|capitol|secció|seccio|text|apunt|resum|topic|page|section)/i.test(lowerMsg) ||
            /^(resumeix|resumeix-me|resumir|resumeme|summarize|explica|explica'm|què diu|que dice)(\s+(el|la|aquest|aquesta|este|esta|tot|el que))?/i.test(lowerMsg);

        if (isSelfReferential && pageText && pageText.trim().length > 150) {
            // El text de l'apunt que l'alumne vol consultar ja està inclòs a <page_context>.
            // Evitem afegir apunts d'altres assignatures que distreguin o contaminin el model.
            return "";
        }

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
                topK: 12, // Demanem més resultats per poder filtrar per idioma i deduplicar
                includeMetadata: true
            });

            const targetLang = (userLanguage || 'ca').toLowerCase().slice(0, 2);
            const langPrefix = `${targetLang}-`;

            // 2. Filtrar exclusivament per l'idioma configurat per l'alumne
            let langMatches = queryResponse.filter(r => r.id.startsWith(langPrefix));
            // Si cap apunt coincideix amb l'idioma triat, fallback exclusiu a català ('ca-')
            if (langMatches.length === 0 && targetLang !== 'ca') {
                langMatches = queryResponse.filter(r => r.id.startsWith('ca-'));
            }

            // 3. Filtrar ferralla, apunts buits, marcadors de posició i coincidències febles (< 65%)
            const cleanMatches = langMatches.filter(r => {
                if (r.score < 0.65) return false;
                const meta = r.metadata as Record<string, string> | undefined;
                const content = (meta?.content || '').trim();
                if (content.length < 80) return false;
                if (content.includes('Contingut pendent') || content.includes("Aquest tema encara s'ha de redactar")) return false;
                if (/^<object[\s\S]*<\/object>$/i.test(content)) return false;
                return true;
            });

            // 4. Deduplicar per tema (slug o títol) per no repetir el mateix tema múltiples vegades
            const seenSlugs = new Set<string>();
            const deduplicated: typeof cleanMatches = [];

            for (const r of cleanMatches) {
                const meta = r.metadata as Record<string, string> | undefined;
                const slug = (meta?.slug || meta?.title || '').toLowerCase().trim();
                if (!slug || seenSlugs.has(slug)) continue;
                seenSlugs.add(slug);
                deduplicated.push(r);
                if (deduplicated.length >= 3) break; // Màxim 3 apunts oficials únics
            }

            if (deduplicated.length === 0) return "";

            return deduplicated
                .map((r) => {
                    const meta = r.metadata as Record<string, string> | undefined;
                    return `## Tema: ${meta?.title ?? 'Sense títol'} (Rellevància: ${(r.score * 100).toFixed(1)}%)\n\n${meta?.content ?? ''}`;
                })
                .join('\n\n---\n\n');
        }
    } catch (error) {
        console.warn("RAG no disponible (Upstash), continuant amb context de pàgina i coneixement del model:", error);
    }
    return "";
}


// Detecció d'intenció de cerca en temps real (0ms, regex en comptes de crida LLM)
function needsSearch(message: string): boolean {
    const text = message.toLowerCase().trim();
    if (text.length < 4) return false;

    const b = "(?:^|[\\s.,;:!?¿¡()\\[\\]\"]|$)";
    const patterns = [
        new RegExp(`${b}(avui|dema|demà|ahir|ara mateix|aquesta setmana|aquest mes|proxim|pròxim|proper|today|tomorrow|yesterday|hoy|manana|mañana|ayer|ahora|esta semana|próximo|proximo)${b}`),
        new RegExp(`${b}(partit|partits|partido|partidos|match|game|horari|horaris|horario|horarios|schedule|jornada|classificacio|classificació|clasificacion|clasificación|resultat|resultats|resultado|resultados|score|barça|barca|madrid|futbol|fútbol|champions|lliga|liga|nba|f1|formula 1|fórmula 1)${b}`),
        new RegExp(`${b}(noticia|notícia|noticias|notícies|news|actualitat|actualidad|ultima hora|última hora|latest|recent|recents|reciente|recientes)${b}`),
        new RegExp(`${b}(temps|tiempo|weather|ploura|plourà|plou|llou|llover|temperatura)${b}`),
        new RegExp(`${b}(preu|precio|price|borsa|bolsa|stock|crypto|bitcoin|dolar|dòlar|euro)${b}`)
    ];

    return patterns.some(p => p.test(text));
}

// Necessitat guardar memòria d'usuari
async function extractUserMemories(message: string, aiSettings: AiSettings | undefined, ai: GoogleGenAI): Promise<{ memory_actions: any[] }> {
    // Short-circuit: missatges curts o salutacions no contenen fets memorables
    const trivialPattern = /^(hola|hey|ei|ok|gràcies|merci|bon dia|bona nit|adéu|bye|thx|thanks|sí|no|va|vale|d'acord|entesos|genial|perfecte|\.+|!+|\?+)$/i;
    if (message.trim().length < 15 || trivialPattern.test(message.trim())) {
        return { memory_actions: [] };
    }

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

                // Execució paral·lela de tasques preparatòries
                const ragPromise = fetchRagNotes(message, ai, language, currentPath, pageText);
                const metadataPromise = extractUserMemories(message, aiSettings, ai);

                const notesContext = await ragPromise;

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

                // Detecció instantània d'intenció de cerca (0ms)
                const enableSearch = needsSearch(message);

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
                                ragNotesFound: !!notesContext
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

                        if ((parsed.isQuota || parsed.isUnavailable) && !hasStartedWriting) {
                            const failReason = parsed.isQuota
                                ? "reasonQuota"
                                : (parsed.status === 503 ? "reason503" : "reasonSaturation");
                            await emit('thought', { text: `❌ i18n:modelDenied:${modelName}:${failReason}\n\n` });
                            await new Promise(resolve => setTimeout(resolve, 150));
                            continue;
                        }

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
