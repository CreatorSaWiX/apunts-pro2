import { getLiteModels } from './_shared/models';
import { withMiddleware, jsonResponse } from './_shared/middleware';
import { quizRequestSchema } from './_shared/schemas';
import { buildQuizPrompt } from './_shared/prompts';

export default withMiddleware(async function handler(req: Request, _userId?: string): Promise<Response> {
    const rawBody = await req.json().catch(() => ({}));
    const parseResult = quizRequestSchema.safeParse(rawBody);

    if (!parseResult.success) {
        return jsonResponse({ error: 'Falten camps necessaris o format invàlid', details: parseResult.error.format() }, 400);
    }

    const { topicId, markdownContent } = parseResult.data;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return jsonResponse({ error: 'Clau de Gemini no configurada al servidor' }, 500);
    }

    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });

    const prompt = buildQuizPrompt(topicId, markdownContent);

    try {
        const response = await ai.models.generateContent({
            model: getLiteModels()[0],
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                temperature: 0.1, // Temperatura baixa per màxima precisió respecte al text
            }
        });

        const textResponse = response.text;
        if (!textResponse) {
            return jsonResponse({ error: 'La resposta de Gemini està buida' }, 500);
        }

        const data = JSON.parse(textResponse);

        if (!data.questions || data.questions.length === 0) {
            return jsonResponse({ error: 'Gemini no ha generat preguntes vàlides' }, 500);
        }

        return jsonResponse(data, 200);
    } catch (error: unknown) {
        console.error('Error al generar test:', error);
        return jsonResponse({ error: (error as Error).message || 'Error intern al generar test' }, 500);
    }
});
