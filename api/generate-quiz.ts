import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { topicId, markdownContent } = req.body;

        if (!topicId || !markdownContent) {
            return res.status(400).json({ error: 'Falten camps necessaris (topicId, markdownContent)' });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'Clau de Gemini no configurada al servidor' });
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

        const response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                temperature: 0.1, // Temperatura baixa per màxima precisió respecte al text
            }
        });

        const textResponse = response.text;
        if (!textResponse) {
            return res.status(500).json({ error: 'La resposta de Gemini està buida' });
        }

        const data = JSON.parse(textResponse);

        if (!data.questions || data.questions.length === 0) {
            return res.status(500).json({ error: 'Gemini no ha generat preguntes vàlides' });
        }

        return res.status(200).json(data);
    } catch (error: any) {
        console.error('Error al generar test:', error);
        return res.status(500).json({ error: error.message || 'Error intern al generar test' });
    }
}
