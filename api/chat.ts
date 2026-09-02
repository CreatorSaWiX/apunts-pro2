import { GoogleGenAI, Type } from '@google/genai';
import { getLoadBalancedModels, getLiteModels, applyThinkingConfig } from './_shared/models';
import { withMiddleware } from './_shared/middleware';
import { chatRequestSchema } from './_shared/schemas';
import { CORS_HEADERS } from './_shared/cors';
import { Index } from "@upstash/vector";
import { buildChatSystemInstruction } from './_shared/prompts';

// ── Singletons a nivell de mòdul ─────────────────────────────────────────────
let vectorIndex: Index | null = null;
function getVectorIndex(): Index | null {
    const url = process.env.UPSTASH_VECTOR_REST_URL;
    const token = process.env.UPSTASH_VECTOR_REST_TOKEN;
    if (!url || !token) return null;
    if (!vectorIndex) vectorIndex = new Index({ url, token });
    return vectorIndex;
}

/** Trunca a un límit de caràcters respectant fronteres de paraules. */
function truncateAtWordBoundary(text: string, maxLen: number): string {
    if (text.length <= maxLen) return text;
    const truncated = text.substring(0, maxLen);
    const lastSpace = truncated.lastIndexOf(' ');
    return lastSpace > maxLen * 0.7 ? truncated.substring(0, lastSpace) : truncated;
}

// ── Llistes per a fallback de cerca per paraules clau ────────────────────────
const STOP_WORDS = new Set([
    'aquest', 'aquesta', 'aquests', 'aquestes', 'sobre', 'perque', 'perquè', 'quan', 'molt',
    'tenir', 'estar', 'dels', 'deles', 'com', 'que', 'què', 'mes', 'més', 'quin', 'quina',
    'quins', 'quines', 'on', 'qui', 'per', 'amb', 'pel', 'pels', 'perla', 'perles', 'tot', 'tota',
    'tots', 'totes', 'algun', 'alguna', 'alguns', 'algunes', 'uns', 'unes', 'una', 'el', 'la',
    'els', 'les', 'un', 'de', 'en', 'i', 'o', 'a', 'al', 'als', 'del', 'fa', 'fet', 'fer', 'ha', 'han'
]);

const SHORT_TECH_TERMS = new Set([
    'eda', 'm1', 'm2', 'pro', 'ec', 'ac', 'f', 'fm', 'tfg', 'tfm', 'sql', 'api', 'git',
    'tcp', 'udp', 'ip', 'dfs', 'bfs', 'avl', 'bst', 'cpu', 'ram', 'dom', 'css', 'cua',
    'cpp', 'c', 'os', 'io', 'vm', 'ui', 'ux', 'lan', 'wan', 'dns', 'ssh', 'sh', 'oop', 'poo'
]);

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
                        action: { type: Type.STRING, description: "Pot ser: ADD, UPDATE, DELETE" },
                        old_fact: { type: Type.STRING, description: "Només per UPDATE i DELETE. La cadena EXACTA de la memòria a modificar o esborrar de la llista que has rebut." },
                        new_fact: { type: Type.STRING, description: "Només per ADD i UPDATE. El nou fet pur a guardar." }
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

    const { message, history, currentPath, pageText, image, aiSettings, language } = parseResult.data;

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

            try {
                const ai = new GoogleGenAI({ apiKey });

                // ── A & B.5 Execució en paral·lel (RAG + Classificador d'Intenció) ──
                emit('status', { phase: 'analyzing_intent' });

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
                                    return `## Tema: ${meta?.title ?? 'Sense títol'} (Relevància: ${(r.score * 100).toFixed(1)}%)\n\n${meta?.content ?? ''}`;
                                })
                                .join('\n\n---\n\n');
                        } else {
                            throw new Error("Missing Upstash Keys or Vector");
                        }
                    } catch (error) {
                        console.warn("Error calculant RAG per embeddings, utilitzant fallback:", error);
                        // Lazy import: només carrega les notes quan el RAG per embeddings falla
                        const { allPersonalNotes } = await import('../.content-collections/generated/index.js');
                        const pathLower = currentPath.toLowerCase();
                        let activeSubject: string | null = null;
                        if (pathLower.includes('pro2')) activeSubject = 'pro2';
                        else if (pathLower.includes('m1')) activeSubject = 'm1';
                        else if (pathLower.includes('m2')) activeSubject = 'm2';

                        // Normalitzem C++ a cpp abans d'eliminar caràcters especials
                        const normalizedMessage = message.toLowerCase().replace(/c\+\+/gi, 'cpp');
                        const rawTokens = normalizedMessage
                            .replace(/[^\p{L}\p{N}\s]/gu, ' ')
                            .split(/\s+/)
                            .filter(Boolean);

                        const keywords = rawTokens.filter(w => {
                            if (SHORT_TECH_TERMS.has(w)) return true;
                            return w.length > 3 && !STOP_WORDS.has(w);
                        });

                        if (keywords.length > 0) {
                            const candidateNotes = allPersonalNotes.filter(
                                note => !activeSubject || note.subject === activeSubject
                            );

                            const scoredNotes: { note: (typeof candidateNotes)[0]; score: number }[] = [];
                            for (const note of candidateNotes) {
                                let score = 0;
                                const titleLower = note.title.toLowerCase();
                                for (const kw of keywords) {
                                    if (titleLower.includes(kw)) score += 5;
                                }
                                const contentLower = note.content.toLowerCase();
                                for (const kw of keywords) {
                                    if (contentLower.includes(kw)) score += 1;
                                }
                                if (score > 0) {
                                    scoredNotes.push({ note, score });
                                }
                            }

                            scoredNotes.sort((a, b) => b.score - a.score);
                            for (const { note } of scoredNotes.slice(0, 5)) {
                                notesCtx += `## Tema: ${note.title}\n\n${note.content}\n\n---\n\n`;
                            }
                        }
                    }
                    return notesCtx;
                })();

                const intentPromise = (async () => {
                    let search = false;
                    try {
                        emit('thought', { text: `🔍 i18n:analyzingIntent\n` });
                        const classifierPrompt = `Ets un classificador. Respon NOMÉS amb el número 1 o 0.\nL'usuari ha fet la següent consulta: "${message}"\nAquesta consulta demana informació actualitzada, notícies recents, o dades del món real que no es puguin deduir sense buscar a internet?\nRespon 1 si requereix cerca a internet, o 0 si no en requereix.`;

                        const classifierController = new AbortController();
                        const timeoutId = setTimeout(() => classifierController.abort(), 1500);

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
                            search = true;
                            emit('thought', { text: `i18n:searchDetected\n\n` });
                        } else {
                            emit('thought', { text: `i18n:searchNotNeeded\n\n` });
                        }
                    } catch (e) {
                        console.warn("Error al classificador d'intenció. Es desactiva la cerca per defecte:", e);
                        emit('thought', { text: `i18n:searchFailed\n\n` });
                    }
                    return search;
                })();

                const metadataPromise = (async () => {
                    let memoryActions: any[] = [];
                    const currentMemories = (aiSettings?.userContext?.memories || []);
                    const memoryCtx = currentMemories.length > 0 
                      ? "La llista actual de memòries de l'usuari és:\n" + currentMemories.map((m:string) => `- "${m}"`).join('\n')
                      : "Actualment no tens cap memòria de l'usuari.";

                    try {
                        let metaSuccess = false;
                        for (const liteModel of getLiteModels()) {
                            if (metaSuccess) break;
                            try {
                                const metadataResponse = await ai.models.generateContent({
                                    model: liteModel,
                                    contents: `${memoryCtx}\n\nAnalitza el NOU missatge de l'usuari: \"${truncateAtWordBoundary(message, 500).replace(/"/g, '\\"')}\"`,
                                    config: {
                                        systemInstruction: "Ets el Gestor de Memòria. Si l'usuari revela detalls nous rellevants, usa manage_memory amb ADD. Si diu quelcom que contradiu o actualitza una memòria de la llista, usa UPDATE. Si exigeix oblidar alguna memòria, usa DELETE. Retorna SKIP en text lliure només si no hi ha canvis a fer.",
                                        tools: [{ functionDeclarations: [manageMemoryTool] }],
                                        temperature: 0.1,
                                        maxOutputTokens: 250
                                    }
                                });

                                if (metadataResponse.functionCalls && metadataResponse.functionCalls.length > 0) {
                                    for (const call of metadataResponse.functionCalls) {
                                        if (call.name === 'manage_memory' && call.args) {
                                            const args = call.args as any;
                                            if (args.actions) memoryActions = args.actions as any[];
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
                        console.warn("Metadata extraction failed (non-critical):", metaError);
                    }
                    return { memory_actions: memoryActions };
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

                // ── C. Loop de cascada ───────────────────────────────────────────
                // System instruction: computed once and reused across all model attempts.
                const systemInstruction = buildChatSystemInstruction(
                    aiSettings,
                    currentPath,
                    pageText,
                    notesContext,
                    attemptWithSearch,
                    language
                );

                let targetModels = getLoadBalancedModels();
                if (attemptWithSearch) {
                    targetModels = targetModels.filter(m => !m.startsWith('gemini-3'));
                }

                for (const modelName of targetModels) {
                    if (success) break;

                    try {
                        const streamConfig: Record<string, unknown> = {
                            systemInstruction
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
                    // Esperem la promesa paral·lela que hem llançat a l'inici. 
                    // D'aquesta manera amaguem totalment la latència (1-3s) darrere del temps de resposta de la IA.
                    const metadataResult = await metadataPromise;
                    emit('metadata', metadataResult);
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
