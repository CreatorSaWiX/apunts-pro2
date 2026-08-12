import type { IncomingMessage, ServerResponse } from 'node:http';

export async function roadmapAiController(req: IncomingMessage, res: ServerResponse, env: Record<string, string>) {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const { prompt, currentNodes, history = [], memory = {}, aiSettings, userName, attachedFile, language } = JSON.parse(body);
        const { GoogleGenAI } = await import('@google/genai');
        const fs = await import('node:fs');
        const path = await import('node:path');
        const apiKey = env.GEMINI_API_KEY;

        if (!apiKey) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Clau de Gemini no configurada al servidor' }));
          return;
        }

        // --- EXTRACCIÓ DINÀMICA DE CONTEXT (RAG) ---
        let injectedContext = "";
        let mentionedNodes = (currentNodes || []).filter((node: any) => {
          const regex = new RegExp(`\\b${node.id}\\b`, 'i');
          return regex.test(prompt);
        });

        if (mentionedNodes.length === 0 && /(assignatur|cursar|roadmap|semestre|preparar|avaluaci|professor|hores|estudi|consell)/i.test(prompt)) {
          mentionedNodes = (currentNodes || []).filter((n: any) => n.status === 'in_progress');
          if (mentionedNodes.length === 0) mentionedNodes = (currentNodes || []).slice(0, 5);
        }

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache, no-transform');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');
        if (typeof res.flushHeaders === 'function') res.flushHeaders();

        const emit = (event: string, data: object) => {
          res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
          if (typeof (res as any).flush === 'function') {
            (res as any).flush();
          }
        };

        if (mentionedNodes.length > 0) {
          injectedContext += "\n\n# CONTEXT ESPECÍFIC DE LES ASSIGNATURES MENCIONADES:\n";
          for (const node of mentionedNodes) {
            try {
              const filePath = path.join(process.cwd(), 'public', 'data', 'subjects', `${node.id}.json`);
              if (fs.existsSync(filePath)) {
                const fileData = fs.readFileSync(filePath, 'utf-8');
                const parsedData = JSON.parse(fileData);

                const filteredData = {
                  acronim: parsedData.acronim,
                  credits: parsedData.credits,
                  activities: parsedData.activities,
                  sections: parsedData.sections?.map((s: any) => ({
                    title: s.title,
                    content: s.html ? s.html.replace(/<[^>]*>?/gm, '') : ''
                  }))
                };

                injectedContext += `\n## Dades oficials de ${node.id}:\n${JSON.stringify(filteredData)}\n`;
              }
            } catch (e) {
              console.error(`Error llegint el context de ${node.id}:`, e);
            }
          }
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

L'usuari amb qui estàs parlant es diu: ${aiSettings?.userContext?.userPreferredName || userName || "Estudiant"}

Ets un mentor executiu que ajuda estudiants amb el seu roadmap.
Tens una personalitat propera, honesta i que parla de tu a tu.
NO ets un llibre ni un robot que fa discursos. Aquest és un xat normal.

REGLES D'ESTIL I CONTINGUT:
1. NATURALITAT EXTREMA: Comporta't com en un xat normal amb un col·lega. Si et diuen "Hola", respon una cosa com "Ei, com va tot?". NO treguis el tema d'assignatures o la universitat si l'usuari només està saludant.
2. ADAPTA'T AL MISSATGE: Respon curt i directe per defecte. Desenvolupa només si demanen consell estratègic (ex: triar especialitat, dubtes d'avaluació).
3. ZERO farciment: Mai diguis "Sóc un assistent virtual".
8. MANTENIMENT DE TEMA: Si l'usuari et parla de qualsevol cosa fora de la uni, respon amb naturalitat. No canviïs forçosament cap a l'estudi.
9. ESTIL DE COMUNICACIÓ (ANTI-CRINGE): Sigues molt directe i al gra. NO t'enrotllis gens ni facis paràgrafs llargs. NO facis servir adjectius innecessaris, motivacionals, exagerats o emocionals (ex: "màgicament", "apassionant", "increïble", "submergiràs"). Parla com un company enginyer objectiu, amb fets concrets i zero cringe.
10. CONTINGUT D'ASSIGNATURES: Quan donis el resum o expliquis una assignatura, obvia el professorat i les competències, centra't ÚNICAMENT en aquests 3 punts:
   - **Què faran (Activitats)**: Llistat molt breu dels projectes o pràctiques clau perquè sàpiga exactament què haurà de programar o resoldre.
   - **Mètode d'Avaluació**: Moltes assignatures tenen avaluacions complexes amb \`max()\` o sumen més de 100% (punts extra). Per solucionar-ho:
     1. Explica com s'avalua de forma molt senzilla en text pla i llistes. Si hi ha rutes alternatives (ex: Avaluació Única) o condicions (com quedar-se amb la nota màxima), explica-ho ràpidament en llenguatge humà, SENSE usar fórmules matemàtiques complexes ni KaTeX, per evitar errors de sintaxi i no espantar l'alumne.
     2. A sota, genera EXACTAMENT un bloc de codi Markdown amb el llenguatge \`subject-evaluation\` i un array JSON a dins. Per aquest gràfic, tria NOMÉS la ruta principal (Avaluació Continuada) i posa els pesos base (les "weight" haurien de sumar prop de 100). Exemple:
     \`\`\`subject-evaluation
     [
       {"acronym": "P", "name": "Examen Parcial", "weight": 30},
       {"acronym": "F", "name": "Examen Final", "weight": 50},
       {"acronym": "PR", "name": "Pràctiques", "weight": 20}
     ]
     \`\`\`
   - **Gràfics d'Hores (IMPRESCINDIBLE)**: Perquè la UI renderitzi els gràfics visuals de càrrega, has de generar EXACTAMENT un bloc de codi Markdown amb el llenguatge "subject-stats". Exemple per a EDA:
     \`\`\`subject-stats
     EDA
     \`\`\`
     Mai posis "subject-stats" com a text normal, OBLIGATÒRIAMENT ha de ser un bloc de codi Markdown.

# CONTEXT DE L'ESTUDIANT:
- Memòria del perfil de l'estudiant (objectius, interessos): ${JSON.stringify(memory)}
- Assignatures al Roadmap actual: ${JSON.stringify(currentNodes)}
${injectedContext}

# ACCIONS:
L'estudiant està en una aplicació interactiva. SI l'alumne et demana EXPLÍCITAMENT que afegeixis o treguis una assignatura del seu roadmap, usa les Eines (Tools). Altrament, només respon de forma natural.
`;

        const formattedHistory = (history || []).map((msg: any) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        }));

        const msgParts: any[] = [];
        if (prompt) msgParts.push({ text: prompt });
        else msgParts.push({ text: "Analitza aquest document." });

        if (attachedFile && attachedFile.data && attachedFile.mimeType) {
          msgParts.push({ inlineData: { data: attachedFile.data, mimeType: attachedFile.mimeType } });
        }

        const MODELS = [
          'gemini-3.5-flash',
          'gemini-2.5-flash',
          'gemini-1.5-flash',
          'gemini-3.1-flash-lite'
        ];

        const roadmapTool = {
          name: "modify_roadmap",
          description: "Modifica el roadmap de l'estudiant afegint o eliminant assignatures. Només cridar-ho si l'usuari ho demana explícitament (ex: 'Afegeix IA al meu roadmap').",
          parameters: {
            type: "object",
            properties: {
              actions: {
                type: "array",
                description: "Llista d'accions a aplicar al roadmap.",
                items: {
                  type: "object",
                  properties: {
                    type: { type: "string", description: "Tipus d'acció: 'add' o 'remove'" },
                    subject: { type: "string", description: "Acrònim de l'assignatura (ex: 'IA', 'EDA')" }
                  },
                  required: ["type", "subject"]
                }
              }
            },
            required: ["actions"]
          }
        };

        const THINKING_MODELS = new Set(['gemini-3.5-flash', 'gemini-2.5-flash']);

        let lastError: any;
        let replied = false;

        for (const modelName of MODELS) {
          try {
            const supportsThinking = THINKING_MODELS.has(modelName);
            const streamConfig: any = {
              systemInstruction,
              tools: [{ functionDeclarations: [roadmapTool] as any }]
            };

            if (supportsThinking) {
              streamConfig.thinkingConfig = {
                includeThoughts: true,
                thinkingBudget: 1024,
              };
            }

            const responseStream = await genAI.models.generateContentStream({
              model: modelName,
              contents: [...formattedHistory, { role: 'user', parts: msgParts }],
              config: streamConfig
            });

            emit('status', { phase: 'thinking', model: modelName });

            let hasToolCall = false;
            let toolCallData = null;

            for await (const chunk of responseStream) {
              if (chunk.candidates && chunk.candidates[0]?.content?.parts) {
                for (const part of chunk.candidates[0].content.parts) {
                  if (part.thought && part.text) {
                    emit('thought', { text: part.text });
                  } else if (part.text) {
                    emit('status', { phase: 'writing' });
                    emit('message', { text: part.text });
                  }
                }
              }

              const functionCalls = chunk.functionCalls;
              if (functionCalls && functionCalls.length > 0) {
                hasToolCall = true;
                toolCallData = functionCalls[0].args;
                break;
              }
            }

            if (hasToolCall && toolCallData) {
              emit('actions', { actions: (toolCallData as any).actions });
            }

            emit('done', {});
            res.end();
            replied = true;
            break;
          } catch (e: any) {
            const is429 = e?.status === 429 || String(e?.message || '').includes('429') || String(e?.message || '').includes('503') || String(e?.message || '').toLowerCase().includes('quota') || String(e?.message || '').toLowerCase().includes('rate');
            if (is429) {
              console.warn(`[DevServer Roadmap AI] ${modelName} rate limit/503, provant el seguent model...`);
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
        console.error("[DevServer Roadmap AI Error]:", e);
        // Since we might have already sent headers, we can't change statusCode easily if stream started.
        // But if we fail before stream starts:
        if (!res.headersSent) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: String(e.message || e) }));
        } else {
          res.write(`event: error\ndata: ${JSON.stringify({ message: String(e.message || e) })}\n\n`);
          if (typeof (res as any).flush === 'function') (res as any).flush();
          res.end();
        }
      }
    });
  } else {
    res.statusCode = 405;
    res.end('Method Not Allowed');
  }
}
