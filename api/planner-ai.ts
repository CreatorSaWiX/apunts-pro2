import { getLiteModels } from './_shared/models';
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

    const { prompt, currentTasks, subjects, currentDate, aiSettings, attachedFile, availableStatuses } = parseResult.data;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return new Response(JSON.stringify({ error: 'Falta GEMINI_API_KEY' }), { status: 500, headers: CORS_HEADERS });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            const emit = (event: string, data: object) => {
                controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
            };

            try {
                const { GoogleGenAI } = await import('@google/genai');
                const genAI = new GoogleGenAI({ apiKey });

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

                if (attachedFile && attachedFile.data && attachedFile.mimeType) {
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

                        // No thinking config needed for a secretary task

                        emit('status', { phase: 'thinking', model: modelName });
                        emit('thought', { text: `📡 Intentant generar amb el model **${modelName}**...\n` });

                        const responseStream = await genAI.models.generateContentStream({
                            model: modelName,
                            contents: msgParts,
                            config: streamConfig
                        });

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
                            if (!rData || !Array.isArray(rData.actions)) {
                                throw new Error("Format de resposta invàlid: manca l'array actions");
                            }
                        } catch (parseErr) {
                            console.warn(`[Planner Fallback] Model ${modelName} no ha retornat JSON vàlid:`, parseErr);
                            lastError = parseErr;
                            continue; // Intentem amb el següent model de reserva
                        }

                        emit('actions', { actions: rData.actions });
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
                            emit('thought', { text: `❌ El model ${modelName} ha fallat (Error ${errStatus || 'Cota/Servidor'}). Saltant al següent...\n\n` });
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
