import { GoogleGenAI } from '@google/genai';
import { getLoadBalancedModels } from './_shared/models';
import { withMiddleware } from './_shared/middleware';
import { roadmapRequestSchema } from './_shared/schemas';
import { CORS_HEADERS } from './_shared/cors';
import { buildRoadmapSystemInstruction, type RoadmapNode } from './_shared/prompts';

const subjectCache = new Map<string, { acronim?: string; credits?: number; activities?: string[]; sections?: { title?: string; content?: string }[] }>();

export default withMiddleware(async function handler(req: Request, _userId?: string): Promise<Response> {
    const rawBody = await req.json().catch(() => ({}));
    const parseResult = roadmapRequestSchema.safeParse(rawBody);

    if (!parseResult.success) {
        return new Response(JSON.stringify({ error: 'Dades invàlides', details: parseResult.error.format() }), { 
            status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } 
        });
    }

    const { prompt, currentNodes, history, memory, aiSettings, userName, attachedFile } = parseResult.data;

    if (!prompt && !attachedFile) {
        return new Response(JSON.stringify({ error: 'Falta el paràmetre "prompt" o arxiu adjunt' }), { 
            status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } 
        });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return new Response(JSON.stringify({ error: 'Error intern del servidor (C)' }), { 
            status: 500, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } 
        });
    }

    // --- EXTRACCIÓ DINÀMICA DE CONTEXT ---
    let injectedContext = "";
    let mentionedNodes = currentNodes.filter((node: RoadmapNode) => {
        const regex = new RegExp(`\\b${node.id}\\b`, 'i');
        return regex.test(prompt || "");
    });

    if (mentionedNodes.length === 0 && /(assignatur|cursar|roadmap|semestre|preparar|avaluaci|professor|hores|estudi|consell)/i.test(prompt || "")) {
        mentionedNodes = currentNodes.filter((n: RoadmapNode) => n.status === 'in_progress');
        if (mentionedNodes.length === 0) mentionedNodes = currentNodes.slice(0, 5); 
    }

    if (mentionedNodes.length > 0) {
        injectedContext += "\n\n# CONTEXT ESPECÍFIC DE LES ASSIGNATURES MENCIONADES:\n";
        for (const node of mentionedNodes) {
            try {
                if (subjectCache.has(node.id)) {
                    const cachedData = subjectCache.get(node.id)!;
                    // Movem al final (implementació LRU simple)
                    subjectCache.delete(node.id);
                    subjectCache.set(node.id, cachedData);
                    injectedContext += `\n## Dades oficials de ${node.id}:\n${JSON.stringify(cachedData)}\n`;
                    continue;
                }

                const baseUrl = process.env.VITE_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:5173");
                const url = `${baseUrl}/data/subjects/${node.id}.json`;
                const res = await fetch(url);
                if (res.ok) {
                    const parsedData = await res.json() as any;
                    const filteredData = {
                        acronim: parsedData.acronim,
                        credits: parsedData.credits,
                        activities: parsedData.activities,
                        sections: parsedData.sections?.map((s: { title: string; html?: string }) => ({
                            title: s.title,
                            content: s.html ? s.html.replace(/<[^>]*>?/gm, '') : ''
                        }))
                    };

                    // Limitem el cache a 100 assignatures
                    if (subjectCache.size >= 100) {
                        const oldestKey = subjectCache.keys().next().value;
                        if (oldestKey) subjectCache.delete(oldestKey);
                    }
                    subjectCache.set(node.id, filteredData);
                    injectedContext += `\n## Dades oficials de ${node.id}:\n${JSON.stringify(filteredData)}\n`;
                }
            } catch (e) {
                console.error(`Error llegint el context de ${node.id}:`, e);
            }
        }
    }

    const ai = new GoogleGenAI({ apiKey });
    const systemInstruction = buildRoadmapSystemInstruction(
        aiSettings,
        userName || "",
        memory,
        currentNodes,
        injectedContext
    );

    const formattedHistory = history.map((msg: { role: string; content: string }) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
    }));

    const roadmapTool = {
        name: "modify_roadmap",
        description: "Modifica el roadmap de l'estudiant afegint o eliminant assignatures. Només cridar-ho si l'usuari ho demana explícitament (ex: 'Afegeix IA al meu roadmap').",
        parameters: {
            type: "object",
            properties: {
                actions: {
                    type: "array",
                    description: "Llista d'accions a aplicar al roadmap.",
                    items: {
                        type: "object",
                        properties: {
                            type: { type: "string", description: "Tipus d'acció: 'add' o 'remove'" },
                            subject: { type: "string", description: "Acrònim de l'assignatura (ex: 'IA', 'EDA')" }
                        },
                        required: ["type", "subject"]
                    }
                }
            },
            required: ["actions"]
        }
    };

    const msgParts: { text?: string; inlineData?: { data: string; mimeType: string } }[] = [];
    if (prompt) msgParts.push({ text: prompt });
    else msgParts.push({ text: "Analitza aquest document." });

    if (attachedFile && attachedFile.data && attachedFile.mimeType) {
        msgParts.push({ inlineData: { data: attachedFile.data, mimeType: attachedFile.mimeType } });
    }

    const encoder = new TextEncoder();
    const sseStream = new ReadableStream({
        async start(controller) {
            const emit = (event: string, data: object) => {
                controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
            };

            try {
                let lastError: unknown;
                let replied = false;
                let hasStartedWriting = false;

                for (const modelName of getLoadBalancedModels()) {
                    try {
                        const streamConfig: Record<string, unknown> = {
                            systemInstruction,
                            temperature: 0.1,
                            tools: [{ functionDeclarations: [roadmapTool] as unknown[] }]
                        };

                        const responseStream = await ai.models.generateContentStream({
                            model: modelName,
                            contents: [...formattedHistory, { role: 'user', parts: msgParts }],
                            config: streamConfig as never
                        });

                        emit('status', { phase: 'thinking', model: modelName });

                        let hasToolCall = false;
                        let toolCallData = null;

                        for await (const chunk of responseStream) {
                            if (req.signal.aborted) {
                                controller.close();
                                return;
                            }
                            if (chunk.candidates && chunk.candidates[0]?.content?.parts) {
                                for (const part of chunk.candidates[0].content.parts) {
                                    if (part.thought && part.text) {
                                        emit('thought', { text: part.text });
                                    } else if (part.text) {
                                        hasStartedWriting = true;
                                        emit('status', { phase: 'writing' });
                                        emit('message', { text: part.text });
                                    }
                                }
                            }

                            const functionCalls = chunk.functionCalls;
                            if (functionCalls && functionCalls.length > 0) {
                                hasToolCall = true;
                                toolCallData = functionCalls[0].args;
                                break;
                            }
                        }

                        if (hasToolCall && toolCallData) {
                            emit('actions', { actions: (toolCallData as { actions?: unknown[] }).actions });
                        }

                        emit('done', {});
                        replied = true;
                        break;
                    } catch (e: unknown) {
                        const errMessage = e instanceof Error ? e.message : String(e);
                        const errStatus = (e as { status?: number })?.status;
                        const is429 = (errStatus === 429 || errMessage.includes('429') || errMessage.includes('503') || errMessage.toLowerCase().includes('quota') || errMessage.toLowerCase().includes('rate')) && !hasStartedWriting;
                        if (is429) {
                            lastError = e;
                            continue;
                        }
                        emit('error', { message: errMessage || 'Error intern del servidor' });
                        emit('done', {});
                        replied = true;
                        break;
                    }
                }

                if (!replied) {
                    emit('error', { message: (lastError as Error)?.message || 'Tots els models han fallat' });
                    emit('done', {});
                }
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
