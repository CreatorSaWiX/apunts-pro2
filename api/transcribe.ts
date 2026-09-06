import { withMiddleware, jsonResponse } from './_shared/middleware';
import { transcribeRequestSchema } from './_shared/schemas';
import { getTranscribeModels } from './_shared/models';
import { getGoogleGenAI } from './_shared/gemini';
import { parseGenAIError } from './_shared/errors';
import { logGeminiPrompt } from './_shared/debug';

export default withMiddleware(async function handler(req: Request, _userId?: string): Promise<Response> {
    const rawBody = await req.json().catch(() => ({}));
    const parseResult = transcribeRequestSchema.safeParse(rawBody);

    if (!parseResult.success) {
        return jsonResponse({
            error: 'Dades invàlides per a la transcripció',
            details: parseResult.error.format()
        }, 400);
    }

    const { audio, mimeType, language } = parseResult.data;

    const ai = getGoogleGenAI();
    if (!ai) return jsonResponse({ error: 'Clau de Gemini no configurada al servidor' }, 500);

    const langName = language?.startsWith('es')
        ? 'castellà'
        : language?.startsWith('en')
        ? 'anglès'
        : 'català';

    const systemInstruction = 
        `Ets un transcriptor d'àudio professional d'alta precisió. ` +
        `Transcriu fidelment i exactament tot el que es diu a l'àudio proporcionat. ` +
        `L'idioma principal de l'àudio és el ${langName}. ` +
        `Retorna ÚNICAMENT el text parlat, sense cap comentari, sense cometes, sense introduccions ni explicacions. ` +
        `Si l'àudio és només silenci o soroll inintel·ligible, no retornis res.`;

    const contents = [
        {
            role: 'user',
            parts: [
                {
                    inlineData: {
                        data: audio,
                        mimeType: mimeType
                    }
                },
                {
                    text: `Transcriu aquest àudio a text.`
                }
            ]
        }
    ];

    let lastError: unknown;

    for (const modelName of getTranscribeModels()) {
        try {
            const config = {
                systemInstruction,
                temperature: 0,
                maxOutputTokens: 1000,
            };

            logGeminiPrompt({
                endpoint: 'transcribe',
                model: modelName,
                systemInstruction,
                contents,
                extra: { mimeType, language }
            });

            const response = await ai.models.generateContent({
                model: modelName,
                contents,
                config
            });

            const transcribedText = (response.text || '').trim();
            return jsonResponse({ text: transcribedText }, 200);

        } catch (error: unknown) {
            lastError = error;
            const parsed = parseGenAIError(error);
            console.warn(`[Transcribe Fallback] El model ${modelName} ha fallat:`, parsed.cleanMessage);

            if (parsed.isQuota || parsed.isUnavailable) {
                continue;
            }
            break;
        }
    }

    console.error('Error transcrivint àudio (Tots els models han fallat):', lastError);
    const parsedLast = parseGenAIError(lastError);
    return jsonResponse({
        error: parsedLast.cleanMessage || "Error intern en transcriure l'àudio"
    }, 500);
});
