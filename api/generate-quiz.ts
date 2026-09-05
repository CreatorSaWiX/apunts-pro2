import { getLiteModels } from './_shared/models';
import { withMiddleware, jsonResponse } from './_shared/middleware';
import { quizRequestSchema, quizResponseSchema } from './_shared/schemas';
import { buildQuizPrompt } from './_shared/prompts';
import { getGoogleGenAI } from './_shared/gemini';
import { parseGenAIError } from './_shared/errors';

export default withMiddleware(async function handler(req: Request, _userId?: string): Promise<Response> {
    const rawBody = await req.json().catch(() => ({}));
    const parseResult = quizRequestSchema.safeParse(rawBody);

    if (!parseResult.success) {
        return jsonResponse({ error: 'Falten camps necessaris o format invàlid', details: parseResult.error.format() }, 400);
    }

    const { topicId, markdownContent } = parseResult.data;

    const ai = getGoogleGenAI();
    if (!ai) return jsonResponse({ error: 'Clau de Gemini no configurada al servidor' }, 500);

    const prompt = buildQuizPrompt(topicId, markdownContent);

    let lastError: unknown;
    for (const modelName of getLiteModels()) {
        try {
            const response = await ai.models.generateContent({
                model: modelName,
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    temperature: 0.1, // Temperatura baixa per màxima precisió respecte al text
                }
            });

            const textResponse = response.text;
            if (!textResponse) {
                throw new Error('La resposta de Gemini està buida');
            }

            let cleanText = textResponse.trim();
            if (cleanText.startsWith('```')) {
                cleanText = cleanText.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();
            } else {
                const firstBrace = cleanText.indexOf('{');
                const lastBrace = cleanText.lastIndexOf('}');
                if (firstBrace !== -1 && lastBrace > firstBrace) {
                    cleanText = cleanText.substring(firstBrace, lastBrace + 1);
                }
            }

            const rawData = JSON.parse(cleanText);
            const validated = quizResponseSchema.safeParse(rawData);
            if (!validated.success) {
                throw new Error(`Estructura de test invàlida retornada per Gemini: ${validated.error.message}`);
            }

            return jsonResponse(validated.data, 200);
        } catch (error: unknown) {
            lastError = error;
            const parsed = parseGenAIError(error);
            console.warn(`[Quiz Fallback] Model ${modelName} ha fallat:`, parsed.cleanMessage);

            // Si és un error de Quota o Servidors saturats, provem el següent model
            if (parsed.isQuota || parsed.isUnavailable) continue;
            break;
        }
    }

    console.error('Error al generar test (Tots els models han fallat):', lastError);
    const parsedLast = parseGenAIError(lastError);
    return jsonResponse({ error: parsedLast.cleanMessage || 'Error intern al generar test' }, 500);
});
