export const config = {
    runtime: 'edge'
};

export default async function handler(req: Request) {
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            status: 200,
            headers: {
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
                'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
            }
        });
    }

    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Mètode no permès' }), { status: 405 });
    }

    try {
        const authHeader = req.headers.get('authorization');
        const idToken = authHeader?.split('Bearer ')[1];
        if (!idToken) return new Response(JSON.stringify({ error: 'No autoritzat' }), { status: 401 });

        // Firebase verification...
        const firebaseApiKey = process.env.VITE_FIREBASE_API_KEY;
        if (!firebaseApiKey) return new Response(JSON.stringify({ error: 'Configuració de Firebase incompleta' }), { status: 500 });
        
        const verifyRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseApiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken })
        });
        if (!verifyRes.ok) return new Response(JSON.stringify({ error: 'Token invàlid' }), { status: 401 });

        const body = await req.json();
        const { prompt, currentTasks = [], subjects = [], currentDate, aiSettings, attachedFile } = body;

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) return new Response(JSON.stringify({ error: 'Falta GEMINI_API_KEY' }), { status: 500 });

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                const emit = (event: string, data: object) => {
                    controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
                };

                try {
                    const { GoogleGenAI } = await import('@google/genai');
                    const genAI = new GoogleGenAI({ apiKey });

                    const MODELS = [
                        'gemini-2.0-flash-thinking-exp-01-21',
                        'gemini-3.5-flash',
                        'gemini-2.5-flash',
                        'gemini-3.1-flash-lite',
                        'gemini-2.5-flash-lite',
                        'gemini-2.0-flash-lite',
                    ];
                    const THINKING_MODELS = new Set(['gemini-2.0-flash-thinking-exp-01-21', 'gemini-2.0-flash-thinking-exp', 'gemini-3.5-flash', 'gemini-2.5-flash']);

                    const systemInstruction = `El teu nom és ${aiSettings?.identity?.name || "AI"}.
Pronoms: ${aiSettings?.identity?.pronouns || "ell"}.

[VIBE]
${aiSettings?.identity?.vibe || "Ets útil."}

[RULES]
${aiSettings?.soul?.rules || ""}

[BOUNDARIES]
${aiSettings?.soul?.boundaries || ""}

[CONTINUITY]
${aiSettings?.soul?.continuity || ""}

[CUSTOM DIRECTIVES]
${aiSettings?.soul?.customDirectives || "Cap directriu especial."}

Ets un asistent intel·ligent per a una aplicació de planificació d'estudiants universitaris. La teva feina és analitzar el missatge de l'usuari i determinar quines accions s'han de prendre sobre les tasques.

IMPORTANT: HAS DE RETORNAR ÚNICAMENT I EXCLUSIVAMENT UN OBJECTE JSON VÀLID. SENSE TEXT AL VOLTANT. Només JSON.

# CONTEXT ACTUAL:
- Data i hora actuals de l'usuari: ${currentDate || new Date().toISOString()}
- Assignatures vàlides (selecciona l'id apropiat, o null):
  ${JSON.stringify(subjects || [])}
- Tasques actuals de l'usuari (fes-ho servir per trobar els 'taskId' quan hagis de modificar o esborrar tasques existents):
  ${JSON.stringify(currentTasks?.map((t: any) => ({ id: t.id, title: t.title, subjectId: t.subjectId, status: t.status })) || [])}

# INSTRUCCIONS:
Pots executar una llista d'accions. Les accions possibles són:
1. "CREATE": Per crear noves tasques. Reparteix-les lògicament usant startDate i dueDate. Usa l'hora actual com a base si no s'especifica res.
2. "UPDATE": Per modificar tasques existents (posposar, canviar de color/assignatura, completar). Pots actualitzar el \`status\` a "TODO", "IN_PROGRESS", "IN_REVIEW", o "DONE".
3. "DELETE": Per esborrar tasques.

L'estructura exacta ha de ser:
{
  "actions": [
    {
      "type": "CREATE",
      "task": {
        "title": "Nom de la tasca",
        "description": "Explicació (opcional)",
        "priority": "HIGH" | "MEDIUM" | "LOW",
        "status": "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE",
        "estimatedMinutes": 60,
        "subjectId": "ID_DE_L_ASSIGNATURA" | null,
        "startDate": "2026-06-16T10:00:00.000Z" | null,
        "dueDate": "2026-06-16T12:00:00.000Z" | null
      }
    },
    {
      "type": "DELETE",
      "taskId": "id_de_la_tasca_a_esborrar"
    },
    {
      "type": "UPDATE",
      "taskId": "id_de_la_tasca_a_actualitzar",
      "updates": {
        "status": "IN_PROGRESS",
        "startDate": "2026-06-17T10:00:00.000Z"
      }
    }
  ]
}`;

                    const msgParts: any[] = [];
                    if (prompt) msgParts.push({ text: prompt });
                    else msgParts.push({ text: "Analitza aquest document." });

                    if (attachedFile && attachedFile.data && attachedFile.mimeType) {
                        msgParts.push({ inlineData: { data: attachedFile.data, mimeType: attachedFile.mimeType } });
                    }

                    let lastError: any;
                    let replied = false;

                    for (const modelName of MODELS) {
                        try {
                            const supportsThinking = THINKING_MODELS.has(modelName);
                            const streamConfig: any = {
                                systemInstruction,
                                responseMimeType: "application/json"
                            };

                            if (supportsThinking) {
                                streamConfig.thinkingConfig = {
                                    includeThoughts: true,
                                    thinkingBudget: 1024,
                                };
                            }

                            const responseStream = await genAI.models.generateContentStream({
                                model: modelName,
                                contents: msgParts,
                                config: streamConfig
                            });

                            emit('status', { phase: 'thinking', model: modelName });

                            let accumulatedText = '';

                            for await (const chunk of responseStream) {
                                if (chunk.candidates && chunk.candidates[0]?.content?.parts) {
                                    for (const part of chunk.candidates[0].content.parts) {
                                        if (part.thought && part.text) {
                                            emit('thought', { text: part.text });
                                        } else if (part.text) {
                                            accumulatedText += part.text;
                                        }
                                    }
                                }
                            }

                            let rData;
                            try {
                                let cleanText = accumulatedText.trim();
                                if (cleanText.startsWith("```json")) {
                                    cleanText = cleanText.substring(7).replace(/```$/, '').trim();
                                } else if (cleanText.startsWith("```")) {
                                    cleanText = cleanText.substring(3).replace(/```$/, '').trim();
                                }
                                const firstBrace = cleanText.indexOf('{');
                                const lastBrace = cleanText.lastIndexOf('}');
                                if (firstBrace !== -1 && lastBrace !== -1) {
                                    cleanText = cleanText.substring(firstBrace, lastBrace + 1);
                                }
                                rData = JSON.parse(cleanText);
                            } catch (parseError: any) {
                                console.warn("Planner didn't return valid JSON, falling back.", accumulatedText);
                                rData = { actions: [] };
                            }

                            emit('actions', { actions: rData.actions || [] });
                            emit('done', {});
                            controller.close();
                            replied = true;
                            break;
                        } catch (e: any) {
                            const errMsg = String(e?.message || '');
                            const errStatus = e?.status;
                            const isFallbackable =
                                errStatus === 429 || errStatus === 503 || errStatus === 404 ||
                                errMsg.includes('429') || errMsg.includes('503') || errMsg.includes('404') ||
                                errMsg.match(/exhausted/i) || errMsg.match(/not found/i);

                            if (isFallbackable) {
                                lastError = e;
                                continue;
                            }

                            emit('error', { message: e.message || 'Error intern del servidor' });
                            emit('done', {});
                            controller.close();
                            replied = true;
                            break;
                        }
                    }

                    if (!replied) {
                        emit('error', { message: lastError?.message || 'Tots els models han fallat' });
                        emit('done', {});
                        controller.close();
                    }
                } catch (err: any) {
                    emit('error', { message: err.message || 'Error de procés' });
                    emit('done', {});
                    controller.close();
                }
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            }
        });

    } catch (e: any) {
        return new Response(JSON.stringify({ error: String(e.message || e) }), { status: 500 });
    }
}
