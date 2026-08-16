import { GoogleGenAI } from '@google/genai';
import { getLoadBalancedModels, applyThinkingConfig } from './_shared/models';
import { allPersonalNotes } from '../.content-collections/generated/index.js';
import { withMiddleware } from './_shared/middleware';
import { chatRequestSchema } from './_shared/schemas';
import { CORS_HEADERS } from './_shared/cors';
import { Index } from "@upstash/vector";

// ── Eines (Tools) ────────────────────────────────────────────────────────────
const saveMetadataTool = {
    name: "save_metadata",
    description: "Desa paraules clau i metadades extretes d'aquesta conversa.",
    parameters: {
        type: "object",
        properties: {
            keywords: {
                type: "array",
                description: "Llista de 3-5 paraules clau rellevants per aquesta conversa.",
                items: { type: "string" }
            },
            memories_to_add: {
                type: "array",
                description: "Llista de fets importants sobre l'usuari a recordar a llarg termini (opcional).",
                items: { type: "string" }
            }
        },
        required: ["keywords"]
    }
};

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
            contents: message.length > 500 ? message.substring(0, 500) : message,
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

Quan acabis la teva resposta, SI l'usuari ha revelat nova informació important sobre el seu perfil que cal recordar a llarg termini, o per extreure les paraules clau de la conversa, UTILITZA SEMPRE l'eina 'save_metadata'. Evita guardar dades temporals o casuals com a memòria.

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
            let hasStartedWriting = false;

            for (const modelName of getLoadBalancedModels()) {
                if (success) break;

                try {
                    const streamConfig: any = {
                        systemInstruction,
                        tools: [{ googleSearch: {} }, { functionDeclarations: [saveMetadataTool] as any }]
                    };

                    applyThinkingConfig(streamConfig, modelName);

                    const response = await ai.models.generateContentStream({
                        model: modelName,
                        contents: [...formattedHistory, { role: 'user', parts: msgParts }],
                        config: streamConfig,
                    });

                    emit('status', { phase: 'thinking', model: modelName });

                    let extractedKeywords: string[] = [];
                    let extractedMemories: string[] = [];

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
                                    if (!hasStartedWriting) {
                                        emit('status', { phase: 'writing' });
                                        hasStartedWriting = true;
                                    }
                                    emit('delta', { text: part.text });
                                }
                            }
                        }
                        
                        if (chunk.functionCalls && chunk.functionCalls.length > 0) {
                            for (const call of chunk.functionCalls) {
                                if (call.name === 'save_metadata' && call.args) {
                                    const args = call.args as any;
                                    if (args.keywords) extractedKeywords = args.keywords;
                                    if (args.memories_to_add) extractedMemories = args.memories_to_add;
                                }
                            }
                        }
                    }

                    emit('metadata', { keywords: extractedKeywords, memories_to_add: extractedMemories });
                    emit('done', {});
                    success = true;

                } catch (e: any) {
                    const errMsg = String(e?.message || '');
                    const errStatus = e?.status;
                    const isRetryable =
                        (errStatus === 429 || errStatus === 404 ||
                        errMsg.includes('429') || errMsg.includes('404') ||
                        errMsg.toLowerCase().includes('quota') ||
                        errMsg.toLowerCase().includes('rate') ||
                        errMsg.toLowerCase().includes('not found') ||
                        errMsg.toLowerCase().includes('not supported')) && !hasStartedWriting;

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

            try {
                controller.close();
            } catch (e) {
                // Ignore if already closed
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
