import type { IncomingMessage, ServerResponse } from 'node:http';

export async function plannerAiController(req: IncomingMessage, res: ServerResponse, env: Record<string, string>) {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const { prompt, currentTasks, subjects, currentDate, aiSettings, attachedFile, language } = JSON.parse(body);
        const { GoogleGenAI } = await import('@google/genai');
        const apiKey = env.GEMINI_API_KEY;

        if (!apiKey) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Clau de Gemini no configurada al servidor' }));
          return;
        }

        const genAI = new GoogleGenAI({ apiKey });
        const langName = language?.startsWith('en') ? 'English' : language?.startsWith('es') ? 'Spanish' : 'Catalan';
        const systemInstruction = `El teu nom és ${aiSettings?.identity?.name || "AI"}.
[CRITICAL LANGUAGE REQUIREMENT]: The user has set the app language to ${langName.toUpperCase()}. YOU MUST REPLY ENTIRELY IN ${langName.toUpperCase()}. Translate your personality, vibe, and any default phrases into ${langName.toUpperCase()}.
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
- Data i hora actuals de l'usuari: ${currentDate}
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

        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
          'X-Accel-Buffering': 'no'
        });

        const emit = (event: string, data: object) => {
          res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
          if ((res as any).flush) (res as any).flush();
        };

        let lastError: any;
        let replied = false;
        
        const MODELS = [
          'gemini-3.5-flash',          
          'gemini-3.1-flash-lite',     
          'gemini-2.5-flash',          
          'gemini-2.5-flash-lite',     
          'gemini-2.0-flash-lite',     
        ];
        const THINKING_MODELS = new Set(['gemini-3.5-flash', 'gemini-2.5-flash']);

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

            console.log(`[Vite Proxy] Planner Gemini usat: ${modelName}`);
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
            res.end();
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
              console.warn(`[Vite proxy planner] ${modelName} fallat, saltant al següent model...`);
              lastError = e;
              continue;
            }
            
            emit('error', { message: e.message || 'Error intern del servidor' });
            emit('done', {});
            res.end();
            replied = true;
            break;
          }
        }

        if (!replied) {
            emit('error', { message: lastError?.message || 'Tots els models han fallat' });
            emit('done', {});
            res.end();
        }
      } catch (e: any) {
        console.error("[DevServer Planner AI Error]:", e);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: String(e.message || e) }));
      }
    });
  } else {
    res.statusCode = 405;
    res.end('Method Not Allowed');
  }
}
