import { GoogleGenAI } from '@google/genai';
import { getLoadBalancedModels, applyThinkingConfig } from './_shared/models';
import { allPersonalNotes } from '../.content-collections/generated/index.js';
import { withMiddleware } from './_shared/middleware';
import { chatRequestSchema } from './_shared/schemas';
import { CORS_HEADERS } from './_shared/cors';
import { Index } from "@upstash/vector";

// ── META block parser (keywords + memories) ──────────────────────────────────
const META_MARKER = '<META>';
const META_END = '</META>';

function parseMetaBlock(fullText: string): {
    cleanText: string;
    keywords: string[];
    memories_to_add: string[];
} {
    const metaIdx = fullText.indexOf(META_MARKER);
    if (metaIdx === -1) return { cleanText: fullText, keywords: [], memories_to_add: [] };

    const cleanText = fullText.substring(0, metaIdx).trimEnd();
    const metaBlock = fullText.substring(metaIdx + META_MARKER.length);
    const endIdx = metaBlock.indexOf(META_END);
    const metaContent = endIdx !== -1 ? metaBlock.substring(0, endIdx) : metaBlock;

    let keywords: string[] = [];
    let memories_to_add: string[] = [];

    for (const line of metaContent.split('\n')) {
        const trimmed = line.trim();
        if (trimmed.startsWith('KEYWORDS:')) {
            keywords = trimmed.substring(9).split(',').map(k => k.trim()).filter(Boolean);
        } else if (trimmed.startsWith('MEMORIES:')) {
            const raw = trimmed.substring(9).trim();
            if (raw && raw !== '-' && raw.toLowerCase() !== 'cap') {
                memories_to_add = raw.split('|').map(m => m.trim()).filter(Boolean);
            }
        }
    }

    return { cleanText, keywords, memories_to_add };
}

// ── Main Handler ─────────────────────────────────────────────────────────────
export default withMiddleware(async function handler(req: Request, userId?: string): Promise<Response> {
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

    // ── 1. RAG mitjançant Upstash Vector ───────────────────────────────────
    let notesContext = "";
    try {
        const aiEmbedding = new GoogleGenAI({ apiKey });
        const embedResponse = await aiEmbedding.models.embedContent({
            model: 'gemini-embedding-2',
            contents: message,
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
        let activeSubject: string | null = null;
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

    // ── 2. Gemini init ───────────────────────────────────────────────────
    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `El teu nom és ${aiSettings?.identity?.name || "AI"}.
Pronoms: ${aiSettings?.identity?.pronouns || "ell"}.
L'usuari amb qui parles vol que li diguis: ${aiSettings?.userContext?.userPreferredName || "l'alumne"}.
Memòria a llarg termini de l'usuari (Fets que ja coneixes):
${(aiSettings?.userContext?.memories || []).map((m: string) => `- ${m}`).join('\n')}

[VIBE]
${aiSettings?.identity?.vibe || "Ets útil."}

[RULES]
${aiSettings?.soul?.rules || ""}

[BOUNDARIES]
${aiSettings?.soul?.boundaries || ""}

[CONTINUITY]
${aiSettings?.soul?.continuity || ""}

[CUSTOM DIRECTIVES]
${aiSettings?.soul?.customDirectives || "Cap directriu especial."}

L'alumne està actualment a la pàgina: ${currentPath}

Respon de manera natural, formatant en Markdown. Sigues directe i útil.

Al FINAL de la teva resposta (després de tot el contingut), afegeix EXACTAMENT aquest bloc de metadades en una línia nova:

<META>
KEYWORDS: paraula1, paraula2, paraula3
MEMORIES: -
</META>

On KEYWORDS són 3-5 paraules clau rellevants de la conversa.
On MEMORIES: per defecte escriu "-". NOMÉS hi has d'afegir fets separats per "|" si l'usuari acaba de revelar informació vital a llarg termini sobre el seu perfil (ex. un projecte, una tecnologia que aprèn, preferències). Evita guardar dades temporals o de xerrada casual.

Aquest és el text visible a la seva pantalla ara mateix:
"""
${pageText}
"""

I aquest és el coneixement base oficial de l'assignatura:
${notesContext}

MOLT IMPORTANT SOBRE LA CERCA:
Tens l'eina "Google Search" activada. Si l'alumne et fa una pregunta sobre actualitat, dates, conferències, documentació o qualsevol cosa que no estigui al "coneixement base oficial", **HAS D'UTILITZAR GOOGLE SEARCH per buscar la resposta a Internet** i respondre-li amb la informació trobada. Mai diguis "no ho tinc als meus apunts" si ho pots buscar a Google.`;

    // ── 3. Historial ────────────────────────────────────────────────────
    const formattedHistory = history.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
    }));

    const msgParts: any[] = [{ text: message }];
    if (image && image.data && image.mimeType) {
        msgParts.push({ inlineData: { data: image.data, mimeType: image.mimeType } });
    }

    // ── 4. SSE Stream ───────────────────────────────────────────────────
    const encoder = new TextEncoder();

    const sseStream = new ReadableStream({
        async start(controller) {
            const emit = (event: string, data: object) => {
                controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
            };

            let lastError: any;
            let success = false;
            let intent = 'THINK'; // Default to THINK

            emit('status', { phase: 'thinking', model: 'AI Router' });
            emit('thought', { text: "Classificant la intenció de la consulta..." });

            try {
                const intentRes = await ai.models.generateContent({
                    model: 'gemini-3.5-flash-lite',
                    contents: message,
                    config: {
                        systemInstruction: "Ets un classificador d'intencions ràpid. Si el missatge de l'usuari requereix informació externa d'internet (actualitat, notícies, esports, dates recents, buscar a google), respon NOMÉS 'SEARCH'. Per qualsevol altra cosa (programació, càlculs, teoria, resum, xerrada), respon NOMÉS 'THINK'. No justifiquis la resposta.",
                        temperature: 0.1,
                        maxOutputTokens: 5,
                    }
                });
                if (intentRes.text?.trim().toUpperCase().includes('SEARCH')) {
                    intent = 'SEARCH';
                }
            } catch (e) {
                console.error("Intent classifier failed, falling back to default:", e);
            }

            if (intent === 'SEARCH') {
                emit('status', { phase: 'thinking', model: 'Google Search' });
                emit('thought', { text: "Buscant a Google informació actualitzada..." });
            }

            for (const modelName of getLoadBalancedModels()) {
                if (success) break;

                try {
                    const streamConfig: any = {
                        systemInstruction,
                    };

                    if (intent === 'SEARCH') {
                        streamConfig.tools = [{ googleSearch: {} }];
                    } else {
                        applyThinkingConfig(streamConfig, modelName);
                    }

                    const response = await ai.models.generateContentStream({
                        model: modelName,
                        contents: [...formattedHistory, { role: 'user', parts: msgParts }],
                        config: streamConfig,
                    });

                    emit('status', { phase: 'thinking', model: modelName });

                    let accumulatedText = '';
                    let lastSentIndex = 0;
                    let hasStartedWriting = false;
                    const BUFFER_MARGIN = META_MARKER.length + 5;

                    for await (const chunk of response) {
                        if (req.signal.aborted) {
                            controller.close();
                            return;
                        }
                        if (chunk.candidates && chunk.candidates[0]?.content?.parts) {
                            for (const part of chunk.candidates[0].content.parts) {
                                if (part.thought && part.text) {
                                    emit('thought', { text: part.text });
                                }
                                else if (part.text) {
                                    accumulatedText += part.text;
                                    const metaIdx = accumulatedText.indexOf(META_MARKER);

                                    if (metaIdx === -1) {
                                        const safeEnd = accumulatedText.length - BUFFER_MARGIN;
                                        if (safeEnd > lastSentIndex) {
                                            const toSend = accumulatedText.substring(lastSentIndex, safeEnd);
                                            if (toSend) {
                                                if (!hasStartedWriting) {
                                                    emit('status', { phase: 'writing' });
                                                    hasStartedWriting = true;
                                                }
                                                emit('delta', { text: toSend });
                                                lastSentIndex = safeEnd;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    const { cleanText, keywords, memories_to_add } = parseMetaBlock(accumulatedText);

                    const remaining = cleanText.substring(lastSentIndex);
                    if (remaining) {
                        if (!hasStartedWriting) {
                            emit('status', { phase: 'writing' });
                        }
                        emit('delta', { text: remaining });
                    }

                    emit('metadata', { keywords, memories_to_add });
                    emit('done', {});
                    success = true;

                } catch (e: any) {
                    const errMsg = String(e?.message || '');
                    const errStatus = e?.status;
                    const isRetryable =
                        errStatus === 429 || errStatus === 404 ||
                        errMsg.includes('429') || errMsg.includes('404') ||
                        errMsg.toLowerCase().includes('quota') ||
                        errMsg.toLowerCase().includes('rate') ||
                        errMsg.toLowerCase().includes('not found') ||
                        errMsg.toLowerCase().includes('not supported');

                    if (isRetryable) {
                        lastError = e;
                        continue;
                    }
                    emit('error', { message: e.message || 'Error intern del servidor' });
                    emit('done', {});
                    success = true; 
                }
            }

            if (!success) {
                emit('error', { message: lastError?.message || 'Tots els models de Gemini han fallat' });
                emit('done', {});
            }

            controller.close();
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
