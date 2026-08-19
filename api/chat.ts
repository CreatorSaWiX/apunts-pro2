import { GoogleGenAI } from '@google/genai';
import { getLoadBalancedModels, applyThinkingConfig } from './_shared/models';
import { allPersonalNotes } from '../.content-collections/generated/index.js';
import { withMiddleware } from './_shared/middleware';
import { chatRequestSchema } from './_shared/schemas';
import { CORS_HEADERS } from './_shared/cors';
import { Index } from "@upstash/vector";
import { buildChatSystemInstruction } from './_shared/prompts';

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
                .map((r: { metadata?: { title?: string; content?: string }; score: number }) => `## Tema: ${r.metadata?.title} (Relevància: ${(r.score * 100).toFixed(1)}%)\n\n${r.metadata?.content}`)
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
            relevantNotes = relevantNotes.filter((n: { subject: string; title: string; content: string }) => n.subject === activeSubject);
        }
        if (relevantNotes.length > 5) {
            relevantNotes = relevantNotes.slice(0, 5);
        }
        notesContext = relevantNotes
            .map((note: { title: string; content: string }) => `## Tema: ${note.title}\n\n${note.content}`)
            .join('\n\n---\n\n');
    }

    // ── 2. Gemini init ───────────────────────────────────────────────────
    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = buildChatSystemInstruction(
        aiSettings,
        currentPath,
        pageText,
        notesContext
    );

    // ── 3. Historial ────────────────────────────────────────────────────
    const formattedHistory = history.map((msg: { role: string; content: string }) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
    }));

    const msgParts: { text?: string; inlineData?: { data: string; mimeType: string } }[] = [{ text: message }];
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

                let lastError: unknown;
                let success = false;
                let hasStartedWriting = false;

                for (const modelName of getLoadBalancedModels()) {
                    if (success) break;

                    try {
                        const streamConfig: Record<string, unknown> = {
                            systemInstruction,
                            tools: [{ functionDeclarations: [saveMetadataTool] as unknown[] }]
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
                                    const args = call.args as { keywords?: string[]; memories_to_add?: string[] };
                                    if (args.keywords) extractedKeywords = args.keywords;
                                    if (args.memories_to_add) extractedMemories = args.memories_to_add;
                                }
                            }
                        }
                    }

                    emit('metadata', { keywords: extractedKeywords, memories_to_add: extractedMemories });
                    emit('done', {});
                    success = true;

                } catch (e: unknown) {
                    const errMsg = e instanceof Error ? e.message : String(e);
                    const errStatus = (e as { status?: number })?.status;
                    const isRetryable =
                        (errStatus === 429 || errStatus === 404 || errStatus === 503 || errStatus === 500 ||
                        errMsg.includes('429') || errMsg.includes('404') || errMsg.includes('503') ||
                        errMsg.toLowerCase().includes('quota') ||
                        errMsg.toLowerCase().includes('rate') ||
                        errMsg.toLowerCase().includes('not found') ||
                        errMsg.toLowerCase().includes('not supported') ||
                        errMsg.toLowerCase().includes('unavailable') ||
                        errMsg.toLowerCase().includes('high demand')) && !hasStartedWriting;

                    if (isRetryable) {
                        lastError = e;
                        continue;
                    }
                    emit('error', { message: errMsg || 'Error intern del servidor' });
                    emit('done', {});
                    success = true; 
                }
            }

            if (!success) {
                emit('error', { message: (lastError as Error)?.message || 'Tots els models de Gemini han fallat' });
                emit('done', {});
            }

            try {
                controller.close();
            } catch {
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
