import type { IncomingMessage, ServerResponse } from 'node:http';

export async function chatController(req: IncomingMessage, res: ServerResponse, env: Record<string, string>) {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const { message, history, currentPath = '/', pageText = '', image, aiSettings, language } = JSON.parse(body);
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

        

        const langName = language?.startsWith('en') ? 'English' : language?.startsWith('es') ? 'Spanish' : 'Catalan';
        const systemInstruction = `El teu nom és ${aiSettings?.identity?.name || "AI"}.
[CRITICAL LANGUAGE REQUIREMENT]: The user has set the app language to ${langName.toUpperCase()}. YOU MUST REPLY ENTIRELY IN ${langName.toUpperCase()}. Translate your personality, vibe, and any default phrases into ${langName.toUpperCase()}.
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

        for (const modelName of getLoadBalancedModels()) {
          try {
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
}
