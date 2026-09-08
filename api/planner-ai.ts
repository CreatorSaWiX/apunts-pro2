import { getLiteModels } from './_shared/models';
import { withMiddleware } from './_shared/middleware';
import { plannerRequestSchema } from './_shared/schemas';
import { CORS_HEADERS } from './_shared/cors';
import { buildPlannerSystemInstruction } from './_shared/prompts';
import { getGoogleGenAI } from './_shared/gemini';
import { parseGenAIError } from './_shared/errors';
import { createSseEmitter } from './_shared/sse';
import { logGeminiPrompt } from './_shared/debug';

export default withMiddleware(async function handler(req: Request): Promise<Response> {
    const rawBody = await req.json().catch(() => ({}));
    const parseResult = plannerRequestSchema.safeParse(rawBody);

    if (!parseResult.success) {
        return new Response(JSON.stringify({ error: 'Dades invàlides', details: parseResult.error.format() }), {
            status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
        });
    }

    const { prompt, currentTasks, subjects, currentDate, aiSettings, attachedFile, availableStatuses } = parseResult.data;

    const ai = getGoogleGenAI();
    if (!ai) return new Response(JSON.stringify({ error: 'Falta GEMINI_API_KEY' }), { status: 500, headers: CORS_HEADERS });
    
    const stream = new ReadableStream({
        async start(controller) {
            const emit = createSseEmitter(controller, req);

            try {
                const systemInstruction = buildPlannerSystemInstruction(
                    aiSettings,
                    currentDate,
                    subjects,
                    currentTasks,
                    availableStatuses
                );

                const msgParts: { text?: string; inlineData?: { data: string; mimeType: string } }[] = [];
                if (prompt) msgParts.push({ text: prompt });
                else msgParts.push({ text: "Analitza aquest document." });

                if (attachedFile?.data && attachedFile?.mimeType) {
                    msgParts.push({ inlineData: { data: attachedFile.data, mimeType: attachedFile.mimeType } });
                }

                let lastError: unknown;
                let replied = false;
                let hasStartedWriting = false;

                for (const modelName of getLiteModels()) {
                    try {
                        const streamConfig: Record<string, unknown> = {
                            systemInstruction,
                            responseMimeType: "application/json"
                        };

                        await emit('status', { phase: 'thinking', model: modelName });
                        await emit('thought', { text: `📡 Intentant generar amb el model **${modelName}**...\n` });

                        logGeminiPrompt({
                            endpoint: 'planner-ai',
                            model: modelName,
                            systemInstruction,
                            contents: msgParts,
                            config: streamConfig,
                            extra: {
                                currentDate,
                                tasksCount: currentTasks?.length,
                                subjectsCount: subjects?.length,
                                availableStatuses
                            }
                        });

                        const responseStream = await ai.models.generateContentStream({
                            model: modelName,
                            contents: msgParts,
                            config: streamConfig as any
                        });

                        let accumulatedText = '';

                        for await (const chunk of responseStream) {
                            if (req.signal.aborted || controller.desiredSize === null) {
                                return;
                            }
                            if (chunk.candidates && chunk.candidates[0]?.content?.parts) {
                                for (const part of chunk.candidates[0].content.parts) {
                                    if (part.thought && part.text) {
                                        await emit('thought', { text: part.text });
                                    } else if (part.text) {
                                        hasStartedWriting = true;
                                        accumulatedText += part.text;
                                    }
                                }
                            }
                        }

                        let rData: { actions: unknown[] } | undefined;
                        try {
                            let cleanText = accumulatedText.trim();
                            if (cleanText.startsWith('```')) {
                                cleanText = cleanText.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();
                            } else {
                                const firstBrace = cleanText.indexOf('{');
                                const lastBrace = cleanText.lastIndexOf('}');
                                if (firstBrace !== -1 && lastBrace > firstBrace) {
                                    cleanText = cleanText.substring(firstBrace, lastBrace + 1);
                                }
                            }
                            rData = JSON.parse(cleanText);
                        } catch (pErr) {
                            console.warn(`[Planner AI] Error parsejant JSON de ${modelName}:`, pErr);
                            throw new Error("El model ha retornat un format JSON invàlid.");
                        }

                        if (!rData || !Array.isArray(rData.actions)) {
                            throw new Error("La resposta del model no conté la propietat 'actions' requerida.");
                        }

                        await emit('actions', rData);
                        await emit('done', {});
                        replied = true;
                        break; // Èxit amb aquest model!

                    } catch (e: unknown) {
                        lastError = e;
                        const parsed = parseGenAIError(e);

                        console.warn(`[Planner Fallback] Model ${modelName} ha fallat:`, parsed.cleanMessage);

                        const isFallbackable = (parsed.isQuota || parsed.isUnavailable || parsed.isNotFound) && !hasStartedWriting;

                        if (isFallbackable) {
                            await emit('thought', { text: `❌ El model ${modelName} ha fallat (${parsed.cleanMessage}). Saltant al següent...\n\n` });
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
            } catch (err: unknown) {
                const parsed = parseGenAIError(err);
                await emit('error', { message: parsed.cleanMessage || 'Error de procés' });
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

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            ...CORS_HEADERS
        }
    });
});
