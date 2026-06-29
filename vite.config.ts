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
        registerType: 'prompt',
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
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
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
          navigateFallbackAllowlist: [/^\/$/]
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

          // Middleware per provar l'API de Gemini en local
          server.middlewares.use('/api/chat', async (req, res) => {
            if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => {
                body += chunk.toString();
              });
              req.on('end', async () => {
                try {
                  const { message, history, currentPath = '/', pageText = '', image } = JSON.parse(body);
                  const { GoogleGenAI } = await import('@google/genai');

                  // Per evitar el bucle infinit de recàrrega de Vite, llegim el fitxer manualment 
                  // en lloc d'utilitzar import() que Vite rastreja com a dependència.
                  const fs = await import('node:fs');
                  const path = await import('node:path');
                  let allPersonalNotes = [];
                  try {
                    const filePath = path.resolve('./.content-collections/generated/allPersonalNotes.json');
                    if (fs.existsSync(filePath)) {
                      const fileContent = fs.readFileSync(filePath, 'utf-8');
                      // Usem JSON.parse enlloc d'eval per evitar vulnerabilitats
                      allPersonalNotes = JSON.parse(fileContent);
                    } else {
                      // Fallback si és el fitxer .js
                      const jsPath = path.resolve('./.content-collections/generated/allPersonalNotes.js');
                      if (fs.existsSync(jsPath)) {
                        const fileContent = fs.readFileSync(jsPath, 'utf-8');
                        const jsonStr = fileContent.replace('export default', '').trim().replace(/;$/, '');
                        allPersonalNotes = JSON.parse(jsonStr);
                      }
                    }
                  } catch (e) {
                    console.error("Error llegint els apunts locals:", e);
                  }

                  const apiKey = env.GEMINI_API_KEY;
                  if (!apiKey || apiKey === 'LA_TEVA_CLAU_AQUI') {
                    res.statusCode = 500;
                    res.end(JSON.stringify({ error: 'Clau de Gemini no configurada al servidor (.env.local)' }));
                    return;
                  }

                  const notesContext = allPersonalNotes
                    .map((note: any) => `## Tema: ${note.title}\n\n${note.content}`)
                    .join('\n\n---\n\n');

                  const genAI = new GoogleGenAI({ apiKey });

                  const MODELS = [
                    'gemini-3.5-flash',          // nou model de referència 3.5
                    'gemini-3.1-flash-lite',     // lite de gemini 3
                    'gemini-2.5-flash',          // provat i fiable
                    'gemini-2.5-flash-lite',     // lite de 2.5
                    'gemini-2.0-flash-lite',     // de rescat
                  ];

                  const systemInstruction = `Ets un company de classe o tutor que ajuda amb l'assignatura PRO2 a la FIB (UPC).
                    RESPON DE FORMA MOLT NATURAL, BREU I HUMANA. NO siguis robòtic ni donis explicacions llargues del teu "context" o de "la ruta".
                    Si no saps una cosa o no la veus, digues simplement "Ostres, no veig el codi/solucionari que dius" o "Això no ho tinc als meus apunts".
                    L'alumne està actualment a la pàgina: ${currentPath}

                    Aquest és el text visible a la seva pantalla ara mateix (útil si està mirant un solucionari penjat per algú):
                    """
                    ${pageText}
                    """

                    I aquest és el coneixement base oficial de l'assignatura:
                    ${notesContext}`;

                  const formattedHistory = (history || []).map((msg: any) => ({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.content }]
                  }));

                  const msgParts: any[] = [{ text: message }];
                  if (image && image.data && image.mimeType) {
                    msgParts.push({ inlineData: { data: image.data, mimeType: image.mimeType } });
                  }

                  let lastError: any;
                  let replied = false;

                  for (const modelName of MODELS) {
                    try {
                      const response = await genAI.models.generateContent({
                        model: modelName,
                        contents: [...formattedHistory, { role: 'user', parts: msgParts }],
                        config: { systemInstruction }
                      });
                      console.log(`✅ [Gemini] Model usat: ${modelName}`);
                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify({ reply: response.text }));
                      replied = true;
                      break;
                    } catch (e: any) {
                      const isFallbackable = e?.status === 429 || e?.status === 503 || String(e?.message || '').includes('429') || String(e?.message || '').includes('503') || String(e?.message || '').match(/exhausted/i);
                      if (isFallbackable) {
                        console.warn(`[Vite proxy] ${modelName} fallat (rate limit / server error), saltant al següent model...`);
                        lastError = e;
                        continue;
                      }
                      throw e; // error que no és rate-limit → propagar
                    }
                  }

                  if (!replied) throw lastError ?? new Error('Tots els models han fallat');
                } catch (e: any) {
                  console.error("[DevServer Gemini Error]:", e);
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: String(e.message || e) }));
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
                  const { prompt, currentTasks, subjects, currentDate } = JSON.parse(body);
                  const { GoogleGenAI } = await import('@google/genai');
                  const apiKey = env.GEMINI_API_KEY;

                  if (!apiKey || apiKey === 'LA_TEVA_CLAU_AQUI') {
                    res.statusCode = 500;
                    res.end(JSON.stringify({ error: 'Clau de Gemini no configurada al servidor' }));
                    return;
                  }

                  const genAI = new GoogleGenAI({ apiKey });
                  const systemInstruction = `Ets un asistent intel·ligent per a una aplicació de planificació d'estudiants universitaris. La teva feina és analitzar el missatge de l'usuari i determinar quines accions s'han de prendre sobre les tasques.

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

                  const response = await genAI.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: { systemInstruction, responseMimeType: "application/json" }
                  });
                  const responseText = response.text;

                  res.setHeader('Content-Type', 'application/json');
                  res.end(responseText);
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
                  const { prompt, currentNodes, history = [], memory = {} } = JSON.parse(body);
                  const { GoogleGenAI } = await import('@google/genai');
                  const fs = await import('fs');
                  const path = await import('path');
                  const apiKey = env.GEMINI_API_KEY;

                  if (!apiKey || apiKey === 'LA_TEVA_CLAU_AQUI') {
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
                  res.setHeader('Cache-Control', 'no-cache');
                  res.setHeader('Connection', 'keep-alive');
                  if (typeof res.flushHeaders === 'function') res.flushHeaders();

                  const sendSSE = (payload: any) => {
                    res.write(`data: ${JSON.stringify(payload)}\n\n`);
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
                  const systemInstruction = `Ets un Senior Software Engineer i mentor que ajuda estudiants de la FIB-UPC amb el seu roadmap.
Tens una personalitat propera, honesta i que parla de tu a tu, com un company més veterà.
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

                  const msgParts: any[] = [{ text: prompt }];

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

                  let lastError: any;
                  let replied = false;

                  for (const modelName of MODELS) {
                    try {
                      const responseStream = await genAI.models.generateContentStream({
                        model: modelName,
                        contents: [...formattedHistory, { role: 'user', parts: msgParts }],
                        config: {
                          systemInstruction,
                          tools: [{ functionDeclarations: [roadmapTool] as any }]
                        }
                      });

                      let hasToolCall = false;
                      let toolCallData = null;

                      for await (const chunk of responseStream) {
                        const functionCalls = chunk.functionCalls;
                        if (functionCalls && functionCalls.length > 0) {
                          hasToolCall = true;
                          toolCallData = functionCalls[0].args;
                          break;
                        }

                        const chunkText = chunk.text;
                        if (chunkText) {
                          sendSSE({ type: 'text', content: chunkText });
                        }
                      }

                      if (hasToolCall && toolCallData) {
                        sendSSE({ type: 'actions', content: (toolCallData as any).actions });
                      }

                      res.write(`data: [DONE]\n\n`);
                      if (typeof (res as any).flush === 'function') (res as any).flush();
                      res.end();
                      replied = true;
                      break;
                    } catch (e: any) {
                      const is429 = e?.status === 429 || String(e?.message || '').includes('429') || String(e?.message || '').includes('503') || String(e?.message || '').toLowerCase().includes('quota') || String(e?.message || '').toLowerCase().includes('rate');
                      if (is429) {
                        console.warn(`⚠️ [DevServer Roadmap AI] ${modelName} rate limit/503, provant el seguent model...`);
                        lastError = e;
                        continue;
                      }
                      throw e;
                    }
                  }

                  if (!replied) {
                    if (lastError) {
                      sendSSE({ type: 'error', content: 'Tots els models han fallat (Rate Limit)' });
                    } else {
                      sendSSE({ type: 'error', content: 'Tots els models han fallat' });
                    }
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
                    res.write(`data: ${JSON.stringify({ type: 'error', content: String(e.message || e) })}\n\n`);
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