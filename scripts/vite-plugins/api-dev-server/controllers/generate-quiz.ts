import type { IncomingMessage, ServerResponse } from 'node:http';
import { GoogleGenAI } from '@google/genai';
import { getLiteModels } from '../../../../../api/_shared/models';
export async function generateQuizController(req: IncomingMessage, res: ServerResponse, env: Record<string, string>) {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const { topicId, markdownContent } = JSON.parse(body);

        const apiKey = env.GEMINI_API_KEY;
        if (!apiKey) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Clau de Gemini no configurada al servidor (.env.local)' }));
          return;
        }

        const genAI = new GoogleGenAI({ apiKey });
        const prompt = `Ets un professor expert d'enginyeria informàtica de la UPC. Has de crear un examen tipus test rigorós de 10 preguntes basant-te ÚNICAMENT I EXCLUSIVAMENT en els següents apunts de teoria.

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
}`;

        const response = await genAI.models.generateContent({
            model: getLiteModels()[0],
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                temperature: 0.1,
            }
        });

        res.setHeader('Content-Type', 'application/json');
        res.end(response.text);
      } catch (e: any) {
        console.error("[DevServer generate-quiz Error]:", e);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: String(e.message || e) }));
      }
    });
  } else {
    res.statusCode = 405;
    res.end('Method Not Allowed');
  }
}
