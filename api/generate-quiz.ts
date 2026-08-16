import { getLiteModels } from './_shared/models';
import { withMiddleware, jsonResponse } from './_shared/middleware';
import { quizRequestSchema } from './_shared/schemas';

export default withMiddleware(async function handler(req: Request, userId?: string): Promise<Response> {
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

    const prompt = `
Ets un professor expert d'enginyeria informàtica de la UPC. Has de crear un examen tipus test rigorós de 10 preguntes basant-te ÚNICAMENT I EXCLUSIVAMENT en els següents apunts de teoria.

NORMES CRÍTIQUES:
1. Les preguntes han de ser analítiques i de nivell universitari.
2. Totes les respostes correctes s'han de poder deduir directament del text proporcionat.
3. El test ha de tenir EXACTAMENT 10 preguntes.
4. El temps límit serà sempre de 600 segons.
5. Afegeix un camp 'explanation' justificant la resposta correcta amb el raonament basat en els apunts.

APUNTS DE TEORIA:
${markdownContent}

RETORNA UNICAMENT AQUEST FORMAT JSON:
{
    "topicId": "${topicId}",
    "timeLimitSeconds": 600,
    "questions": [
    {
        "id": "${topicId}-q1",
        "question": "Text de la pregunta?",
        "options": [
        { "id": "a", "text": "Opció 1" },
        { "id": "b", "text": "Opció 2" },
        { "id": "c", "text": "Opció 3" },
        { "id": "d", "text": "Opció 4" }
        ],
        "correctOptionId": "c",
        "explanation": "Explicació de per què la C és correcta basada en els apunts."
    }
    ]
}
`;

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
    } catch (error: any) {
        console.error('Error al generar test:', error);
        return jsonResponse({ error: error.message || 'Error intern al generar test' }, 500);
    }
});
