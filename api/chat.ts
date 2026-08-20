import { GoogleGenAI, Type } from '@google/genai';
import { getLoadBalancedModels, getLiteModels, applyThinkingConfig } from './_shared/models';
import { allPersonalNotes } from '../.content-collections/generated/index.js';
import { withMiddleware } from './_shared/middleware';
import { chatRequestSchema } from './_shared/schemas';
import { CORS_HEADERS } from './_shared/cors';
import { Index } from "@upstash/vector";
import { buildChatSystemInstruction } from './_shared/prompts';

// ── Eines (Tools) ────────────────────────────────────────────────────────────
const saveMetadataTool = {
    name: "save_metadata",
    description: "Utilitza aquesta eina EXCLUSIVAMENT quan l'usuari reveli explícitament informació personal, preferències o fets sobre ell mateix (ex. 'M'agrada el futbol', 'Sóc estudiant', 'Tinc 20 anys'). NO la facis servir sota cap concepte per preguntes de coneixement general, dades objectives, actualitat, ni preguntes sobre esports (ex. 'Qui va guanyar l'Eurocopa?'). Si tens dubtes, NO la facis servir.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            keywords: {
                type: Type.ARRAY,
                description: "Paraules clau sobre les preferències de l'usuari.",
                items: { type: Type.STRING }
            },
            memories_to_add: {
                type: Type.ARRAY,
                description: "Informació personal rellevant a recordar (ex. 'Li agrada el tennis').",
                items: { type: Type.STRING }
            }
        },
        required: ["keywords"]
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

    const { message, history, currentPath, pageText, image, aiSettings } = parseResult.data;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return new Response(JSON.stringify({ error: 'Error intern del servidor (C)' }), { status: 500, headers: CORS_HEADERS });
    }

    // ── 4. SSE Stream ───────────────────────────────────────────────────
    const encoder = new TextEncoder();

    const sseStream = new ReadableStream({
        async start(controller) {
            const emit = (event: string, data: object) => {
                controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
            };

            let success = false;
            let lastError: any;
            let hasStartedWriting = false;
            let extractedKeywords: string[] = [];
            let extractedMemories: string[] = [];

            try {
                // ── A. RAG mitjançant Upstash Vector ───────────────────────────────────
                emit('status', { phase: 'searching_vector' });

                let notesContext = "";
                const ai = new GoogleGenAI({ apiKey });

                try {
                    const embedResponse = await ai.models.embedContent({
                        model: 'gemini-embedding-2',
                        contents: message.length > 500 ? message.substring(0, 500) : message,
                        config: { outputDimensionality: 1536 }
                    });
                    const userVector = embedResponse.embeddings?.[0]?.values;

                    if (userVector && process.env.UPSTASH_VECTOR_REST_URL && process.env.UPSTASH_VECTOR_REST_TOKEN) {
                        const index = new Index({
                            url: process.env.UPSTASH_VECTOR_REST_URL,
                            token: process.env.UPSTASH_VECTOR_REST_TOKEN,
                        });

                        const queryResponse = await index.query({
                            vector: userVector,
                            topK: 7,
                            includeMetadata: true
                        });

                        notesContext = queryResponse
                            .map((r: any) => `## Tema: ${r.metadata?.title} (Relevància: ${(r.score * 100).toFixed(1)}%)\n\n${r.metadata?.content}`)
                            .join('\n\n---\n\n');
                    } else {
                        throw new Error("Missing Upstash Keys or Vector");
                    }
                } catch (error) {
                    console.warn("Error calculant RAG per embeddings, utilitzant fallback:", error);
                    const pathLower = currentPath.toLowerCase();
                    let activeSubject = null;
                    if (pathLower.includes('pro2')) activeSubject = 'pro2';
                    else if (pathLower.includes('m1')) activeSubject = 'm1';
                    else if (pathLower.includes('m2')) activeSubject = 'm2';

                    let relevantNotes = allPersonalNotes;
                    if (activeSubject) {
                        relevantNotes = relevantNotes.filter((n: any) => n.subject === activeSubject);
                    }
                    if (relevantNotes.length > 5) {
                        relevantNotes = relevantNotes.slice(0, 5);
                    }
                    notesContext = relevantNotes
                        .map((note: any) => `## Tema: ${note.title}\n\n${note.content}`)
                        .join('\n\n---\n\n');
                }

                // ── B. Gemini Config ─────────────────────────────────────────────────
                const systemInstruction = buildChatSystemInstruction(
                    aiSettings as any,
                    currentPath,
                    pageText,
                    notesContext
                );

                const formattedHistory = history.map((msg: any) => ({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.content }]
                }));

                const msgParts: any[] = [{ text: message }];
                if (image && image.data && image.mimeType) {
                    msgParts.push({ inlineData: { data: image.data, mimeType: image.mimeType } });
                }

                // ── B.5 Classificador d'Intenció (Cerca a Internet Automàtica) ──
                let attemptWithSearch = false;
                try {
                    emit('status', { phase: 'thinking', model: 'intent-classifier' });
                    emit('thought', { text: `🔍 i18n:analyzingIntent\n` });

                    const classifierPrompt = `Ets un classificador. Respon NOMÉS amb el número 1 o 0.
L'usuari ha fet la següent consulta: "${message}"
Aquesta consulta demana informació actualitzada, notícies recents, o dades del món real que no es puguin deduir sense buscar a internet?
Respon 1 si requereix cerca a internet, o 0 si no en requereix.`;

                    // Usem gemini-3.5-flash-lite amb un timeout ràpid
                    const classifierController = new AbortController();
                    const timeoutId = setTimeout(() => classifierController.abort(), 1500); // 1.5s max

                    const classifierResponse = await ai.models.generateContent({
                        model: 'gemini-3.5-flash-lite',
                        contents: classifierPrompt,
                        config: {
                            temperature: 0,
                            maxOutputTokens: 5,
                            abortSignal: classifierController.signal,
                        }
                    });

                    clearTimeout(timeoutId);
                    const classifierText = (classifierResponse.text || "").trim();

                    if (classifierText === '1') {
                        attemptWithSearch = true;
                        emit('thought', { text: `i18n:searchDetected\n\n` });
                    } else {
                        emit('thought', { text: `i18n:searchNotNeeded\n\n` });
                    }
                } catch (e) {
                    console.warn("Error al classificador d'intenció. Es desactiva la cerca per defecte:", e);
                    emit('thought', { text: `i18n:searchFailed\n\n` });
                }

                // ── C. Loop de cascada ───────────────────────────────────────────────
                // Google Search s'activa segons attemptWithSearch.
                // save_metadata s'extreu en una crida post-resposta separada.
                let targetModels = getLoadBalancedModels();
                if (attemptWithSearch) {
                    // Google Cloud (Free Tier) bloqueja el Grounding a tota la família Gemini 3 (0 de quota).
                    // Filtrem els models 3.x per anar directament als 2.x i estalviar latència de reintents.
                    targetModels = targetModels.filter(m => !m.startsWith('gemini-3'));
                }

                for (const modelName of targetModels) {
                    if (success) break;

                    try {
                        const dynamicSystemInstruction = buildChatSystemInstruction(
                            aiSettings as any,
                            currentPath,
                            pageText,
                            notesContext,
                            attemptWithSearch
                        );

                        const streamConfig: any = {
                            systemInstruction: dynamicSystemInstruction
                        };
                        if (attemptWithSearch) {
                            streamConfig.tools = [{ googleSearch: {} }];
                        }

                        applyThinkingConfig(streamConfig as any, modelName);

                        emit('status', { phase: 'thinking', model: modelName });
                        emit('thought', { text: `📡 i18n:requestingModel:${modelName}\n` });

                        const response = await ai.models.generateContentStream({
                            model: modelName,
                            contents: [...formattedHistory, { role: 'user', parts: msgParts }],
                            config: streamConfig as any,
                        });

                        for await (const chunk of response) {
                            if (req.signal.aborted) {
                                controller.close();
                                return;
                            }

                            if (chunk.candidates && chunk.candidates.length > 0) {
                                const candidate = chunk.candidates[0];

                                if (candidate.groundingMetadata) {
                                    console.log("Grounding Metadata:", JSON.stringify(candidate.groundingMetadata, null, 2));
                                    emit('grounding', candidate.groundingMetadata);
                                }

                                if (candidate.finishReason === 'SAFETY') {
                                    throw new Error("El contingut ha estat bloquejat pels filtres de seguretat de Google (SAFETY).");
                                }
                                if (candidate.finishReason === 'RECITATION') {
                                    throw new Error("El contingut ha estat bloquejat per protecció de drets d'autor (RECITATION).");
                                }

                                if (candidate.content && candidate.content.parts) {
                                    for (const part of candidate.content.parts) {
                                        if (part.thought && part.text) {
                                            emit('thought', { text: part.text });
                                        }
                                        else if (part.text !== undefined && part.text !== null) {
                                            if (!hasStartedWriting && part.text.trim().length > 0) {
                                                emit('status', { phase: 'writing' });
                                                hasStartedWriting = true;
                                            }
                                            emit('delta', { text: part.text });
                                        }
                                    }
                                }
                            }
                        }

                        success = true;

                    } catch (e: unknown) {
                        const errMsg = e instanceof Error ? e.message : String(e);
                        const errStatus = (e as { status?: number })?.status;

                        // Comprovem si és un FALS 429 causat per la restricció de googleSearch en models experimentals (3.x)
                        // Els falsos 429 NO contenen la cadena "metric:" (que indica que s'ha esgotat RPM o RPD).
                        if (attemptWithSearch && (errStatus === 429 || errMsg.includes('429')) && !errMsg.includes('metric:')) {
                            console.error(`[Faux 429 Detectat] ${modelName} error pur:`, e);
                            emit('thought', { text: `⚠️ i18n:modelNoSearch:${modelName}\n` });
                            await new Promise(resolve => setTimeout(resolve, 150));
                            continue; // Salta al següent model (cascade)
                        }

                        console.error(`[Fallback Loop] El model ${modelName} ha fallat:`, errMsg);

                        const isRetryable =
                            (errStatus === 429 || errStatus === 503 || errStatus === 500 ||
                                errMsg.includes('429') || errMsg.includes('503') ||
                                errMsg.toLowerCase().includes('quota') ||
                                errMsg.toLowerCase().includes('rate limit') ||
                                errMsg.toLowerCase().includes('too many') ||
                                errMsg.toLowerCase().includes('unavailable') ||
                                errMsg.toLowerCase().includes('high demand')) && !hasStartedWriting;

                        if (isRetryable) {
                            lastError = e;
                            let failReason = "reasonSaturation";
                            if (errStatus === 429 || errMsg.includes('429') || errMsg.toLowerCase().includes('quota') || errMsg.toLowerCase().includes('rate limit') || errMsg.toLowerCase().includes('too many')) {
                                failReason = "reasonQuota";
                            } else if (errStatus === 503 || errMsg.includes('503') || errMsg.toLowerCase().includes('unavailable')) {
                                failReason = "reason503";
                            }
                            emit('thought', { text: `❌ i18n:modelDenied:${modelName}:${failReason}\n\n` });
                            await new Promise(resolve => setTimeout(resolve, 150));
                            continue;
                        }

                        let chunkErrorMsg = errMsg || 'Error intern del servidor';
                        if (chunkErrorMsg.includes('429') || chunkErrorMsg.toLowerCase().includes('quota') || chunkErrorMsg.toLowerCase().includes('resource_exhausted')) {
                            chunkErrorMsg = `⚠️ El model '${modelName}' ha denegat la petició per Quota Excedida (Límit de minuts o de dia).`;
                        } else if (chunkErrorMsg.toLowerCase().includes('not found') || errStatus === 404) {
                            chunkErrorMsg = `⚠️ El model '${modelName}' no existeix o no està disponible (Error 404).`;
                        } else if (chunkErrorMsg.toLowerCase().includes('not supported') || chunkErrorMsg.toLowerCase().includes('invalid arg')) {
                            chunkErrorMsg = `⚠️ El model '${modelName}' no suporta aquesta configuració (ex. googleSearch): ` + chunkErrorMsg;
                        } else if (chunkErrorMsg.includes('{')) {
                            try {
                                const parsed = JSON.parse(chunkErrorMsg.substring(chunkErrorMsg.indexOf('{')));
                                chunkErrorMsg = `⚠️ Error de l'API (${modelName}): ` + (parsed.error?.message || chunkErrorMsg);
                            } catch {
                                chunkErrorMsg = `⚠️ Error de l'API (${modelName}): ` + chunkErrorMsg;
                            }
                        }

                        emit('error', { message: chunkErrorMsg });
                        emit('done', {});
                        success = true;
                    }
                }

                if (!success) {
                    let finalErrorMsg = 'Tots els models de Gemini han fallat. Si us plau, torna-ho a intentar més tard.';
                    const rawMsg = lastError?.message || String(lastError);

                    if (rawMsg.includes('429') || rawMsg.toLowerCase().includes('quota') || rawMsg.toLowerCase().includes('resource_exhausted')) {
                        // Intentem extreure el temps d'espera si hi és, i el model que ha petat a l'últim pas
                        let timeMatch = rawMsg.match(/retry in ([\d\.]+)s/);
                        let waitTime = timeMatch ? `${Math.ceil(parseFloat(timeMatch[1]))} segons` : "un o dos minuts";
                        finalErrorMsg = `⚠️ Has esgotat tota la teva quota gratuïta (RPM o RPD) per als diferents models provats.\nL'API demana que t'esperis com a mínim **${waitTime}** abans de tornar-ho a provar.\n\n_Detall tècnic de l'últim intent: ${rawMsg.substring(0, 150)}..._`;
                    } else if (rawMsg.includes('SAFETY') || rawMsg.includes('filtres')) {
                        finalErrorMsg = "⚠️ El missatge ha estat bloquejat pels filtres de seguretat de Google.";
                    } else if (rawMsg.includes('503') || rawMsg.includes('500') || rawMsg.toLowerCase().includes('unavailable')) {
                        finalErrorMsg = "⚠️ Els servidors de Google estan saturats. Torna-ho a intentar en uns minuts.";
                    } else if (rawMsg.includes('{')) {
                        try {
                            const parsed = JSON.parse(rawMsg.substring(rawMsg.indexOf('{')));
                            finalErrorMsg = `⚠️ Error de l'API: ` + (parsed.error?.message || rawMsg);
                        } catch {
                            finalErrorMsg = `⚠️ Error de l'API: ` + rawMsg;
                        }
                    } else if (lastError?.message) {
                        finalErrorMsg = "⚠️ Error: " + lastError.message;
                    }

                    emit('error', { message: finalErrorMsg });
                    emit('done', {});
                } else if (!hasStartedWriting) {
                    emit('error', { message: 'El model ha processat la informació però no ha generat cap text de resposta (Filtres de seguretat o error de format).' });
                    emit('done', {});
                } else {
                    // ── D. Extracció de memòries (post-resposta, best-effort) ────────
                    // Crida lleugera i separada amb un model lite per extreure
                    // informació personal de l'usuari sense bloquejar la resposta principal.
                    try {
                        let metaSuccess = false;
                        for (const liteModel of getLiteModels()) {
                            if (metaSuccess) break;
                            try {
                                const metadataResponse = await ai.models.generateContent({
                                    model: liteModel,
                                    contents: `Missatge de l'usuari: "${message.slice(0, 500)}"`,
                                    config: {
                                        systemInstruction: "Analitza el missatge de l'usuari. Si ha revelat informació personal, preferències o fets sobre ell mateix (ex: el seu nom, edat, gustos, objectius acadèmics), crida l'eina save_metadata. Si el missatge és una pregunta de coneixement o no conté informació personal, NO cridis l'eina i respon amb la paraula 'SKIP'.",
                                        tools: [{ functionDeclarations: [saveMetadataTool] }],
                                        temperature: 0.1,
                                        maxOutputTokens: 100
                                    }
                                });

                                if (metadataResponse.functionCalls && metadataResponse.functionCalls.length > 0) {
                                    for (const call of metadataResponse.functionCalls) {
                                        if (call.name === 'save_metadata' && call.args) {
                                            const args = call.args as any;
                                            if (args.keywords) extractedKeywords = args.keywords as any[];
                                            if (args.memories_to_add) extractedMemories = args.memories_to_add as any[];
                                        }
                                    }
                                }
                                metaSuccess = true;
                            } catch (e: any) {
                                const status = e?.status;
                                if (status === 429 || status === 503) continue; // Try next lite model
                                break; // Stop trying if it's another error (like format)
                            }
                        }
                    } catch (metaError) {
                        // Best-effort: si falla la metadata, no afecta la resposta principal
                        console.warn("Metadata extraction failed (non-critical):", metaError);
                    }

                    emit('metadata', {
                        memories_to_add: extractedMemories,
                        keywords: extractedKeywords
                    });
                    emit('done', {});
                }
            } catch (fatalError: any) {
                console.error("🔥 FATAL ERROR PROCESSANT LA PETICIÓ:", fatalError);
                emit('error', { message: 'Error fatal processant la petició: ' + (fatalError.message || String(fatalError)) });
                emit('done', {});
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
