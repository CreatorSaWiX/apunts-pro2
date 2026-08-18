import { getLoadBalancedModels, applyThinkingConfig } from './_shared/models';
import { withMiddleware } from './_shared/middleware';
import { plannerRequestSchema } from './_shared/schemas';
import { CORS_HEADERS } from './_shared/cors';
import { buildPlannerSystemInstruction } from './_shared/prompts';

export default withMiddleware(async function handler(req: Request): Promise<Response> {
    const rawBody = await req.json().catch(() => ({}));
    const parseResult = plannerRequestSchema.safeParse(rawBody);

    if (!parseResult.success) {
        return new Response(JSON.stringify({ error: 'Dades invàlides', details: parseResult.error.format() }), { 
            status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
        });
    }

    const { prompt, currentTasks, subjects, currentDate, aiSettings, attachedFile } = parseResult.data;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return new Response(JSON.stringify({ error: 'Falta GEMINI_API_KEY' }), { status: 500, headers: CORS_HEADERS });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            const emit = (event: string, data: object) => {
                controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
            };

            try {
                const { GoogleGenAI, Type } = await import('@google/genai');
                const genAI = new GoogleGenAI({ apiKey });

                const systemInstruction = buildPlannerSystemInstruction(
                    aiSettings,
                    currentDate,
                    subjects,
                    currentTasks
                );

                const msgParts: { text?: string; inlineData?: { data: string; mimeType: string } }[] = [];
                if (prompt) msgParts.push({ text: prompt });
                else msgParts.push({ text: "Analitza aquest document." });

                if (attachedFile && attachedFile.data && attachedFile.mimeType) {
                    msgParts.push({ inlineData: { data: attachedFile.data, mimeType: attachedFile.mimeType } });
                }

                let lastError: unknown;
                let replied = false;
                let hasStartedWriting = false;

                for (const modelName of getLoadBalancedModels()) {
                    try {
                        const streamConfig: Record<string, unknown> = {
                            systemInstruction,
                            responseMimeType: "application/json",
                            responseSchema: {
                                type: Type.OBJECT,
                                properties: {
                                    actions: {
                                        type: Type.ARRAY,
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                type: { type: Type.STRING },
                                                taskId: { type: Type.STRING },
                                                task: {
                                                    type: Type.OBJECT,
                                                    properties: {
                                                        title: { type: Type.STRING },
                                                        description: { type: Type.STRING },
                                                        priority: { type: Type.STRING },
                                                        status: { type: Type.STRING },
                                                        estimatedMinutes: { type: Type.INTEGER },
                                                        subjectId: { type: Type.STRING },
                                                        startDate: { type: Type.STRING },
                                                        dueDate: { type: Type.STRING }
                                                    }
                                                },
                                                updates: {
                                                    type: Type.OBJECT,
                                                    properties: {
                                                        status: { type: Type.STRING },
                                                        startDate: { type: Type.STRING }
                                                    }
                                                }
                                            },
                                            required: ["type"]
                                        }
                                    }
                                },
                                required: ["actions"]
                            }
                        };

                        applyThinkingConfig(streamConfig, modelName);
                        if (streamConfig.thinkingConfig) {
                             (streamConfig.thinkingConfig as Record<string, any>).thinkingBudget = 32768;
                        }

                        const responseStream = await genAI.models.generateContentStream({
                            model: modelName,
                            contents: msgParts,
                            config: streamConfig
                        });

                        emit('status', { phase: 'thinking', model: modelName });

                        let accumulatedText = '';

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
                                        accumulatedText += part.text;
                                    }
                                }
                            }
                        }

                        let rData: { actions: unknown[] } | undefined;
                        try {
                            rData = JSON.parse(accumulatedText.trim());
                        } catch {
                            console.warn("Planner didn't return valid JSON, falling back.", accumulatedText);
                            rData = { actions: [] };
                        }

                        emit('actions', { actions: rData?.actions || [] });
                        emit('done', {});
                        replied = true;
                        break;
                    } catch (e: unknown) {
                        const errMsg = e instanceof Error ? e.message : String(e);
                        const errStatus = (e as { status?: number })?.status;
                        const isFallbackable =
                            (errStatus === 429 || errStatus === 503 || errStatus === 404 ||
                            errMsg.includes('429') || errMsg.includes('503') || errMsg.includes('404') ||
                            errMsg.match(/exhausted/i) || errMsg.match(/not found/i)) && !hasStartedWriting;

                        if (isFallbackable) {
                            lastError = e;
                            continue;
                        }

                        emit('error', { message: errMsg || 'Error intern del servidor' });
                        emit('done', {});
                        replied = true;
                        break;
                    }
                }

                if (!replied) {
                    emit('error', { message: (lastError as Error)?.message || 'Tots els models han fallat' });
                    emit('done', {});
                }
            } catch (err: unknown) {
                emit('error', { message: (err as Error).message || 'Error de procés' });
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

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            ...CORS_HEADERS
        }
    });
});
