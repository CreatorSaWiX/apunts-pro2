import { getLoadBalancedModels } from './_shared/models';
import { withMiddleware } from './_shared/middleware';
import { roadmapRequestSchema } from './_shared/schemas';
import { CORS_HEADERS } from './_shared/cors';
import { buildRoadmapSystemInstruction, type RoadmapNode } from './_shared/prompts';
import { getGoogleGenAI } from './_shared/gemini';
import { parseGenAIError } from './_shared/errors';
import { createSseEmitter } from './_shared/sse';
import { logGeminiPrompt } from './_shared/debug';

interface SubjectOfficialData {
    acronim?: string;
    credits?: number;
    activities?: string[];
    sections?: { title?: string; content?: string }[];
}

interface RawSubjectJson {
    acronim?: string;
    credits?: number;
    activities?: string[];
    sections?: { title: string; html?: string }[];
}

interface CacheEntry {
    data: SubjectOfficialData;
    timestamp: number;
}

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hora
const subjectCache = new Map<string, CacheEntry>();

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

    const ai = getGoogleGenAI();
    if (!ai) {
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
        const now = Date.now();
        await Promise.all(mentionedNodes.map(async (node) => {
            try {
                const cached = subjectCache.get(node.id);
                if (cached && (now - cached.timestamp < CACHE_TTL_MS)) {
                    subjectCache.delete(node.id);
                    subjectCache.set(node.id, cached);
                    injectedContext += `\n## Dades oficials de ${node.id}:\n${JSON.stringify(cached.data)}\n`;
                    return;
                }

                const baseUrl = process.env.VITE_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:5173");
                const url = `${baseUrl}/data/subjects/${node.id}.json`;
                const res = await fetch(url);
                if (res.ok) {
                    const parsedData = (await res.json()) as RawSubjectJson;
                    const filteredData: SubjectOfficialData = {
                        acronim: parsedData.acronim,
                        credits: parsedData.credits,
                        activities: parsedData.activities,
                        sections: parsedData.sections?.map((s: { title: string; html?: string }) => ({
                            title: s.title,
                            content: s.html ? s.html.replace(/<[^>]*>?/gm, '') : ''
                        }))
                    };

                    if (subjectCache.size >= 100) {
                        const oldestKey = subjectCache.keys().next().value;
                        if (oldestKey) subjectCache.delete(oldestKey);
                    }
                    subjectCache.set(node.id, { data: filteredData, timestamp: now });
                    injectedContext += `\n## Dades oficials de ${node.id}:\n${JSON.stringify(filteredData)}\n`;
                }
            } catch (e) {
                console.error(`Error llegint el context de ${node.id}:`, e);
            }
        }));
    }

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

    if (attachedFile?.data && attachedFile?.mimeType) {
        msgParts.push({ inlineData: { data: attachedFile.data, mimeType: attachedFile.mimeType } });
    }

    const sseStream = new ReadableStream({
        async start(controller) {
            const emit = createSseEmitter(controller, req);

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

                        logGeminiPrompt({
                            endpoint: 'roadmap-ai',
                            model: modelName,
                            systemInstruction,
                            contents: [...formattedHistory, { role: 'user', parts: msgParts }],
                            tools: streamConfig.tools,
                            config: streamConfig,
                            extra: {
                                userName,
                                currentNodesCount: currentNodes?.length,
                                hasInjectedContext: !!injectedContext
                            }
                        });

                        const responseStream = await ai.models.generateContentStream({
                            model: modelName,
                            contents: [...formattedHistory, { role: 'user', parts: msgParts }],
                            config: streamConfig as never
                        });

                        await emit('status', { phase: 'thinking', model: modelName });

                        let hasToolCall = false;
                        let toolCallData: unknown = null;

                        for await (const chunk of responseStream) {
                            if (req.signal.aborted || controller.desiredSize === null) {
                                return;
                            }
                            if (chunk.candidates && chunk.candidates[0]?.content?.parts) {
                                for (const part of chunk.candidates[0].content.parts) {
                                    if (part.thought && part.text) {
                                        const ok = await emit('thought', { text: part.text });
                                        if (!ok) return;
                                    } else if (part.text) {
                                        hasStartedWriting = true;
                                        await emit('status', { phase: 'writing' });
                                        const ok = await emit('message', { text: part.text });
                                        if (!ok) return;
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
                            await emit('actions', { actions: (toolCallData as { actions?: unknown[] }).actions });
                        }

                        await emit('done', {});
                        replied = true;
                        break;
                    } catch (e: unknown) {
                        lastError = e;
                        const parsed = parseGenAIError(e);

                        if ((parsed.isQuota || parsed.isUnavailable) && !hasStartedWriting) {
                            continue;
                        }

                        await emit('error', { message: parsed.cleanMessage || 'Error intern del servidor' });
                        await emit('done', {});
                        replied = true;
                        break;
                    }
                }

                if (!replied) {
                    const parsedLast = parseGenAIError(lastError);
                    await emit('error', { message: parsedLast.cleanMessage || 'Tots els models han fallat' });
                    await emit('done', {});
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
