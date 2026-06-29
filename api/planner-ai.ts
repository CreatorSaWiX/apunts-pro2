import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Mètode no permès. Fes servir POST.' });
    }

    try {
        const idToken = req.headers.authorization?.split('Bearer ')[1];
        if (!idToken) {
            return res.status(401).json({ error: 'No autoritzat. Cal iniciar sessió.' });
        }

        const firebaseApiKey = process.env.VITE_FIREBASE_API_KEY;
        if (!firebaseApiKey) {
            return res.status(500).json({ error: 'Configuració de Firebase incompleta al servidor.' });
        }

        const verifyRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseApiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken })
        });

        if (!verifyRes.ok) {
            return res.status(401).json({ error: 'Token invàlid o caducat.' });
        }

        const { prompt, currentTasks = [] } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Falta el paràmetre "prompt"' });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey || apiKey === 'LA_TEVA_CLAU_AQUI') {
            return res.status(500).json({ error: 'Error intern del servidor (C)' });
        }

        const ai = new GoogleGenAI({ apiKey });

        const MODELS = [
            'gemini-2.5-flash',
            'gemini-3.5-flash',
            'gemini-3.1-flash-lite',
        ];

        const systemInstruction = `Ets un assistent d'estudi avançat (IA Planner).
La teva missió és llegir la petició de l'usuari (text lliure o imatge/text copiat d'assignatures) i retornar un ARRAY DE TASQUES en format JSON pur.

Tens les següents tasques actualment programades (per si cal distribuir la feina o no sobreposar):
${JSON.stringify(currentTasks.map((t: any) => ({ title: t.title, startDate: t.startDate, estimatedMinutes: t.estimatedMinutes })), null, 2)}

Les tasques han de seguir aquesta estructura per a cada element de l'array:
{
  "title": "Nom curt de la tasca (ex: Pràctica 1, Llegir Tema 3)",
  "description": "Detalls curts sobre el que cal fer",
  "status": "TODO", // Sempre "TODO"
  "priority": "HIGH" | "MEDIUM" | "LOW", // Determina la prioritat segons la urgència o rellevància
  "startDate": "2026-06-15T12:00:00Z", // Data recomanada d'inici en format ISO (calculada lògicament per l'usuari) o null si no se sap,
  "dueDate": "2026-06-20T12:00:00Z", // Data límit d'entrega o null
  "estimatedMinutes": 60, // Duració estimada en minuts
  "source": "AI" // Sempre "AI"
}

IMPORTANT:
1. Retorna NOMÉS l'estructura JSON sol·licitada.
2. Si el prompt no demana dates específiques, assigna-les intel·ligentment respectant les tasques existents o deixa-les en null. Avui és ${new Date().toISOString()}`;

        let lastError: any;
        for (const modelName of MODELS) {
            try {
                const response = await ai.models.generateContent({
                    model: modelName,
                    contents: prompt,
                    config: {
                        systemInstruction: systemInstruction,
                        responseMimeType: "application/json",
                    }
                });
                
                const textOutput = response.text;
                const parsedTasks = JSON.parse(textOutput);
                
                return res.status(200).json({ tasks: parsedTasks });
            } catch (e: any) {
                const is429 = e?.status === 429 || e?.status === 404 || String(e?.message || '').includes('429') || String(e?.message || '').includes('404');
                if (is429) {
                    console.warn(`[Gemini Planner] ${modelName} rate limit, saltant...`);
                    lastError = e;
                    continue;
                }
                throw e; // Si és un error de parseig JSON o d'un altre tipus, mostrem error
            }
        }

        throw lastError ?? new Error('Tots els models de Gemini han fallat');
    } catch (error: any) {
        console.error('[Gemini Planner API Error]', error);
        res.status(500).json({ error: 'Error processant la petició d\'IA' });
    }
}
