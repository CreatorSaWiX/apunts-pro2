import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import contentCollections from "@content-collections/vite"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      contentCollections(),
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: {
          name: 'Apunts PRO2',
          short_name: 'ApuntsPRO2',
          description: 'Apunts i solucionaris de Programació 2 (FIB-UPC)',
          theme_color: '#0f172a',
          background_color: '#0f172a',
          display: 'standalone',
          orientation: 'portrait',
          icons: [
            {
              src: 'favicon-96x96.png',
              sizes: '96x96',
              type: 'image/png'
            },
            {
              src: 'web-app-manifest-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: 'web-app-manifest-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
          maximumFileSizeToCacheInBytes: 3000000,
          navigateFallbackDenylist: [/^\/pdfs\//], // EXCLOURE ELS PDFS DEL SERVICE WORKER
          runtimeCaching: [
            {
              urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 500,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ]
        },
        devOptions: {
          enabled: true,
          type: 'module',
          navigateFallbackAllowlist: [/^\/$/],
          suppressWarnings: true
        }
      }),
      {
        name: 'jutge-api-dev-server',
        configureServer(server) {
          server.middlewares.use('/api/jutge-proxy', async (req, res) => {
            try {
              const url = new URL(req.url || '', `http://${req.headers.host}`);
              const id = url.searchParams.get('id');
              const reqLang = url.searchParams.get('lang');

              if (!id) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Missing ID' }));
                return;
              }

              // Import dinàmic per evitar problemes d'esbuild en arrencada
              const { getProblemInfo } = await import('./src/lib/jutgeScraper.js');

              const result = await getProblemInfo(id, reqLang);

              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
              res.end(JSON.stringify(result));
            } catch (e: any) {
              console.error("[DevServer] Proxy Error:", e);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: String(e.message || e) }));
            }
          });

          server.middlewares.use('/api/reset-password', async (req, res) => {
            if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => {
                body += chunk.toString();
              });
              req.on('end', async () => {
                try {
                  // INJECCIÓ D'ENTORN LOCAL PER A VITE:
                  // Vite no posa les variables del .env.local directament a process.env per seguretat.
                  // Ho fem manualment aquí perquè l'arxiu importat les pugui llegir igual que faria a Vercel.
                  if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
                      process.env.FIREBASE_SERVICE_ACCOUNT_KEY = env.FIREBASE_SERVICE_ACCOUNT_KEY;
                      process.env.GMAIL_USER = env.GMAIL_USER;
                      process.env.GMAIL_PASS = env.GMAIL_PASS;
                  }

                  // Importem el fitxer de l'API de Vercel
                  const { POST } = await import('./api/reset-password.ts');
                  
                  // Creem un "Request" simulat (Web API standard que espera Vercel)
                  const url = new URL(req.url || '', `http://${req.headers.host}`);
                  const mockRequest = new Request(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: body
                  });

                  // Cridem la funció de Vercel directament
                  const response = await POST(mockRequest);
                  
                  // Retornem la resposta al format de Node (el que espera Vite)
                  res.statusCode = response.status;
                  response.headers.forEach((value, key) => {
                    res.setHeader(key, value);
                  });
                  
                  const responseBody = await response.text();
                  res.end(responseBody);
                } catch (e: any) {
                  console.error("[DevServer reset-password Error]:", e);
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: String(e.message || e) }));
                }
              });
            } else {
              res.statusCode = 405;
              res.end('Method Not Allowed');
            }
          });

          server.middlewares.use('/api/generate-quiz', async (req, res) => {
            if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => {
                body += chunk.toString();
              });
              req.on('end', async () => {
                try {
                  const { topicId, markdownContent } = JSON.parse(body);
                  const { GoogleGenAI } = await import('@google/genai');

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
                      model: 'gemini-3.1-flash-lite',
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
          });

          // Middleware per provar l'API de Gemini en local
          server.middlewares.use('/api/chat', async (req, res) => {
            if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => {
                body += chunk.toString();
              });
              req.on('end', async () => {
                try {
                  const { message, history, currentPath = '/', pageText = '', image, aiSettings } = JSON.parse(body);
                  const { GoogleGenAI } = await import('@google/genai');

                  const apiKey = env.GEMINI_API_KEY;
                  if (!apiKey) {
                    res.statusCode = 500;
                    res.end(JSON.stringify({ error: 'Clau de Gemini no configurada al servidor (.env.local)' }));
                    return;
                  }
                  
                  let notesContext = "";
                  try {
                    const aiEmbedding = new GoogleGenAI({ apiKey });
                    const embedResponse = await aiEmbedding.models.embedContent({
                        model: 'gemini-embedding-2',
                        contents: message,
                    });
                    const userVector = embedResponse.embeddings?.[0]?.values;
                    
                    if (userVector) {
                        const fs = await import('node:fs');
                        const path = await import('node:path');
                        const embeddingsPath = path.resolve('./src/data/embeddings.json');
                        if (fs.existsSync(embeddingsPath)) {
                            const data = await fs.promises.readFile(embeddingsPath, 'utf-8');
                            const embeddingsData = JSON.parse(data);
                            
                            const scoredChunks = embeddingsData.map((chunk: any) => {
                                let dotProduct = 0;
                                let normA = 0;
                                let normB = 0;
                                for (let i = 0; i < userVector.length; i++) {
                                    dotProduct += userVector[i] * chunk.embedding[i];
                                    normA += userVector[i] * userVector[i];
                                    normB += chunk.embedding[i] * chunk.embedding[i];
                                }
                                const score = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
                                return { ...chunk, score };
                            });
                            
                            scoredChunks.sort((a: any, b: any) => b.score - a.score);
                            const topChunks = scoredChunks.slice(0, 7);
                            notesContext = topChunks
                                .map((c: any) => `## Tema: ${c.title} (Relevància: ${(c.score * 100).toFixed(1)}%)\n\n${c.content}`)
                                .join('\n\n---\n\n');
                        }
                    }
                  } catch (e) {
                      console.error("Error al calcular Vector Search local a Vite:", e);
                  }

                  const genAI = new GoogleGenAI({ apiKey });

                  const MODELS = [
                    'gemini-3.5-flash',          // nou model de referència 3.5
                    'gemini-3.1-flash-lite',     // lite de gemini 3
                    'gemini-2.5-flash',          // provat i fiable
                    'gemini-2.5-flash-lite',     // lite de 2.5
                    'gemini-2.0-flash-lite',     // de rescat
                  ];

                  const systemInstruction = `El teu nom és ${aiSettings?.identity?.name || "AI"}.
Pronoms: ${aiSettings?.identity?.pronouns || "ell"}.
L'usuari amb qui parles vol que li diguis: ${aiSettings?.userContext?.userPreferredName || "l'alumne"}.
Memòria a llarg termini de l'usuari (Fets que ja coneixes):
${(aiSettings?.userContext?.memories || []).map((m: string) => `- ${m}`).join('\n')}

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

RESPON DE FORMA MOLT NATURAL, BREU I HUMANA. NO siguis robòtic ni donis explicacions llargues del teu "context" o de "la ruta".
                    Si no saps una cosa o no la veus, digues simplement "Ostres, no veig el codi/solucionari que dius" o "Això no ho tinc als meus apunts".
                    L'alumne està actualment a la pàgina: ${currentPath}

Al FINAL de la teva resposta (després de tot el contingut), afegeix EXACTAMENT aquest bloc de metadades en una línia nova:

<META>
KEYWORDS: paraula1, paraula2, paraula3
MEMORIES: -
</META>

On KEYWORDS són 3-5 paraules clau rellevants de la conversa.
On MEMORIES: per defecte escriu "-". NOMÉS hi has d'afegir fets separats per "|" si l'usuari acaba de revelar informació vital a llarg termini sobre el seu perfil (ex. un projecte, una tecnologia que aprèn, preferències). Evita guardar dades temporals o de xerrada casual.

Aquest és el text visible a la seva pantalla ara mateix:
"""
${pageText}
"""

I aquest és el coneixement base oficial de l'assignatura:
${notesContext}

MOLT IMPORTANT SOBRE LA CERCA:
Tens l'eina "Google Search" activada. Si l'alumne et fa una pregunta sobre actualitat, dates, conferències, documentació o qualsevol cosa que no estigui al "coneixement base oficial", **HAS D'UTILITZAR GOOGLE SEARCH per buscar la resposta a Internet** i respondre-li amb la informació trobada. Mai diguis "no ho tinc als meus apunts" si ho pots buscar a Google.`;

                  const formattedHistory = (history || []).map((msg: any) => ({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.content }]
                  }));

                  const msgParts: any[] = [{ text: message }];
                  if (image && image.data && image.mimeType) {
                    msgParts.push({ inlineData: { data: image.data, mimeType: image.mimeType } });
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
                  const META_MARKER = '<META>';
                  const META_END = '</META>';

                  function parseMetaBlock(fullText: string) {
                      const metaIdx = fullText.indexOf(META_MARKER);
                      if (metaIdx === -1) return { cleanText: fullText, keywords: [], memories_to_add: [] };

                      const cleanText = fullText.substring(0, metaIdx).trimEnd();
                      const metaBlock = fullText.substring(metaIdx + META_MARKER.length);
                      const endIdx = metaBlock.indexOf(META_END);
                      const metaContent = endIdx !== -1 ? metaBlock.substring(0, endIdx) : metaBlock;

                      let keywords: string[] = [];
                      let memories_to_add: string[] = [];

                      for (const line of metaContent.split('\n')) {
                          const trimmed = line.trim();
                          if (trimmed.startsWith('KEYWORDS:')) {
                              keywords = trimmed.substring(9).split(',').map((k: string) => k.trim()).filter(Boolean);
                          } else if (trimmed.startsWith('MEMORIES:')) {
                              const raw = trimmed.substring(9).trim();
                              if (raw && raw !== '-' && raw.toLowerCase() !== 'cap') {
                                  memories_to_add = raw.split('|').map((m: string) => m.trim()).filter(Boolean);
                              }
                          }
                      }
                      return { cleanText, keywords, memories_to_add };
                  }

                  const THINKING_MODELS = new Set(['gemini-3.5-flash', 'gemini-2.5-flash']);

                  for (const modelName of MODELS) {
                    try {
                      const supportsThinking = THINKING_MODELS.has(modelName);
                      const streamConfig: any = {
                        systemInstruction,
                        tools: [{ googleSearch: {} } as any]
                      };


                      const responseStream = await genAI.models.generateContentStream({
                        model: modelName,
                        contents: [...formattedHistory, { role: 'user', parts: msgParts }],
                        config: streamConfig
                      });

                      console.log(`[Vite Proxy] Gemini usat: ${modelName}`);
                      emit('status', { phase: 'thinking', model: modelName });

                      let accumulatedText = '';
                      let lastSentIndex = 0;
                      let hasStartedWriting = false;
                      const BUFFER_MARGIN = META_MARKER.length + 5;

                      for await (const chunk of responseStream) {
                        if (chunk.candidates && chunk.candidates[0]?.content?.parts) {
                          for (const part of chunk.candidates[0].content.parts) {
                            if (part.thought && part.text) {
                              emit('thought', { text: part.text });
                            } else if (part.text) {
                              accumulatedText += part.text;
                              const metaIdx = accumulatedText.indexOf(META_MARKER);
                              if (metaIdx === -1) {
                                const safeEnd = accumulatedText.length - BUFFER_MARGIN;
                                if (safeEnd > lastSentIndex) {
                                  const toSend = accumulatedText.substring(lastSentIndex, safeEnd);
                                  if (toSend) {
                                    if (!hasStartedWriting) {
                                      emit('status', { phase: 'writing' });
                                      hasStartedWriting = true;
                                    }
                                    emit('delta', { text: toSend });
                                    lastSentIndex = safeEnd;
                                  }
                                }
                              }
                            }
                          }
                        }
                      }

                      const { cleanText, keywords, memories_to_add } = parseMetaBlock(accumulatedText);
                      const remaining = cleanText.substring(lastSentIndex);
                      if (remaining) {
                        if (!hasStartedWriting) {
                          emit('status', { phase: 'writing' });
                        }
                        emit('delta', { text: remaining });
                      }

                      emit('metadata', { keywords, memories_to_add });
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
                        console.warn(`[Vite proxy] ${modelName} fallat (rate limit / server error), saltant al següent model...`);
                        lastError = e;
                        continue;
                      }
                      
                      // Error fatal: ja hem enviat headers SSE, així que emetem un event d'error
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
                  console.error("[DevServer Gemini Error]:", e);
                  // Només enviem el 500 si no hem respost encara
                  if (!res.headersSent) {
                    res.statusCode = 500;
                    res.end(JSON.stringify({ error: String(e.message || e) }));
                  } else {
                    res.end();
                  }
                }
              });
            } else {
              res.statusCode = 405;
              res.end('Method Not Allowed');
            }
          });

          // Middleware per l'AI Planner
          server.middlewares.use('/api/planner-ai', async (req, res) => {
            if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => {
                body += chunk.toString();
              });
              req.on('end', async () => {
                try {
                  const { prompt, currentTasks, subjects, currentDate, aiSettings, attachedFile } = JSON.parse(body);
                  const { GoogleGenAI } = await import('@google/genai');
                  const apiKey = env.GEMINI_API_KEY;

                  if (!apiKey) {
                    res.statusCode = 500;
                    res.end(JSON.stringify({ error: 'Clau de Gemini no configurada al servidor' }));
                    return;
                  }

                  const genAI = new GoogleGenAI({ apiKey });
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
          });

          // Middleware per l'AI Roadmap
          server.middlewares.use('/api/roadmap-ai', async (req, res) => {
            if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => {
                body += chunk.toString();
              });
              req.on('end', async () => {
                try {
                  const { prompt, currentNodes, history = [], memory = {}, aiSettings, userName, attachedFile } = JSON.parse(body);
                  const { GoogleGenAI } = await import('@google/genai');
                  const fs = await import('fs');
                  const path = await import('path');
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
          });

          // Middleware per R2 (emulant el de Vercel en local)
          server.middlewares.use('/api/r2-presign', async (req, res) => {
            if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => {
                body += chunk.toString();
              });
              req.on('end', async () => {
                try {
                  const { filename, contentType } = JSON.parse(body);

                  // Importem dinàmicament el SDK d'AWS
                  const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');
                  const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner');

                  const accountId = env.R2_ACCOUNT_ID;
                  const endpoint = env.R2_ENDPOINT || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : null);
                  const accessKeyId = env.R2_ACCESS_KEY_ID;
                  const secretAccessKey = env.R2_SECRET_ACCESS_KEY;
                  const bucketName = env.R2_BUCKET_NAME;
                  const publicUrlBase = env.VITE_R2_PUBLIC_URL;

                  if (!endpoint || !accessKeyId || !secretAccessKey || !bucketName || !publicUrlBase) {
                    res.statusCode = 500;
                    res.end(JSON.stringify({ error: 'Configuració R2 incompleta al .env local' }));
                    return;
                  }

                  const S3 = new S3Client({
                    region: 'auto',
                    endpoint: endpoint ? new URL(endpoint).origin : undefined,
                    credentials: { accessKeyId, secretAccessKey },
                    forcePathStyle: true,
                    requestChecksumCalculation: "WHEN_REQUIRED",
                  });

                  const cleanFilename = filename.replace(/[^a-zA-Z0-9.\-_]/g, '_');
                  const objectKey = `community/${Date.now()}-${cleanFilename}`;

                  const command = new PutObjectCommand({
                    Bucket: bucketName,
                    Key: objectKey,
                    ContentType: contentType,
                  });

                  const presignedUrl = await getSignedUrl(S3, command, {
                    expiresIn: 300,
                    signableHeaders: new Set(['content-type'])
                  });

                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({
                    presignedUrl,
                    objectKey,
                    publicUrl: `${publicUrlBase}/${objectKey}`
                  }));
                } catch (e: any) {
                  console.error("[DevServer R2 Presign Error]:", e);
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: String(e.message || e) }));
                }
              });
            } else {
              res.statusCode = 405;
              res.end('Method Not Allowed');
            }
          });
        }
      }
    ],
    optimizeDeps: {
      include: [
        'three',
        '@react-three/fiber',
        '@react-three/drei',
      ],
      exclude: [],
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('firebase')) return 'vendor-firebase';
              if (id.includes('@uiw') || id.includes('@codemirror')) return 'vendor-codemirror';
              if (id.includes('react-force-graph') || id.includes('d3-') || id.includes('kapsule')) return 'vendor-graphs';
              if (id.includes('react-markdown') || id.includes('rehype') || id.includes('remark')) return 'vendor-markdown';
              if (id.includes('lucide-react')) return 'vendor-icons';
              if (id.includes('framer-motion')) return 'vendor-framer';
              // Be more specific with React core to avoid circular dependencies
              if (
                id.includes('node_modules/react/') ||
                id.includes('node_modules/react-dom/') ||
                id.includes('node_modules/react-router/') ||
                id.includes('node_modules/react-router-dom/') ||
                id.includes('node_modules/scheduler/') ||
                id.includes('node_modules/@remix-run/')
              ) {
                return 'vendor-react';
              }
            }
          }
        }
      }
    }
  }
})