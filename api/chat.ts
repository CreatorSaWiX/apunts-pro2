import { GoogleGenAI } from '@google/genai';
// Importem els apunts compilats per Content Collections
import { allPersonalNotes } from '../.content-collections/generated/index.js';

// ── Node.js Serverless Runtime (Millor memòria) ──────────────────────────────────────────────
// Hem suprimit l'Edge runtime perquè 'embeddings.json' pot pesar uns quants MBs quan escali
// i l'Edge runtime limita l'script a 1MB/2MB, el que faria caure l'API en producció.
// Vercel Serverless suporta fins a 50MB, sent perfecte per aquesta arquitectura RAG local.

// ── CORS Headers ─────────────────────────────────────────────────────────────
const CORS_HEADERS: Record<string, string> = {
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
    'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
};

// ── Models que suporten thinkingConfig ────────────────────────────────────────
const THINKING_MODELS = new Set([
    'gemini-3.5-flash',
    'gemini-2.0-flash-thinking-exp-01-21',
    'gemini-2.5-flash',
]);

const MODELS = [
    'gemini-3.5-flash', // Primari (500 RPD)
    'gemini-2.0-flash-thinking-exp-01-21', // Fallback oficial thinking
    'gemini-3.1-flash-lite', // Fallback d'emergència
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function jsonResponse(data: object, status = 200): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
}

// ── META block parser (keywords + memories) ──────────────────────────────────
const META_MARKER = '<META>';
const META_END = '</META>';

function parseMetaBlock(fullText: string): {
    cleanText: string;
    keywords: string[];
    memories_to_add: string[];
} {
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
            keywords = trimmed.substring(9).split(',').map(k => k.trim()).filter(Boolean);
        } else if (trimmed.startsWith('MEMORIES:')) {
            const raw = trimmed.substring(9).trim();
            if (raw && raw !== '-' && raw.toLowerCase() !== 'cap') {
                memories_to_add = raw.split('|').map(m => m.trim()).filter(Boolean);
            }
        }
    }

    return { cleanText, keywords, memories_to_add };
}

// ── Main Handler ─────────────────────────────────────────────────────────────
export default async function handler(req: Request): Promise<Response> {
    // Preflight CORS
    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: CORS_HEADERS });
    }

    if (req.method !== 'POST') {
        return jsonResponse({ error: 'Mètode no permès. Fes servir POST.' }, 405);
    }

    try {
        // ── Auth ─────────────────────────────────────────────────────────────
        const authHeader = req.headers.get('authorization') || '';
        const idToken = authHeader.split('Bearer ')[1];
        if (!idToken) {
            return jsonResponse({ error: 'No autoritzat. Cal iniciar sessió.' }, 401);
        }

        const firebaseApiKey = process.env.VITE_FIREBASE_API_KEY;
        if (!firebaseApiKey) {
            return jsonResponse({ error: 'Configuració de Firebase incompleta al servidor.' }, 500);
        }

        const verifyRes = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseApiKey}`,
            { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken }) }
        );
        if (!verifyRes.ok) {
            return jsonResponse({ error: 'Token invàlid o caducat.' }, 401);
        }

        // ── Body ─────────────────────────────────────────────────────────────
        const { message, history = [], currentPath = '/', pageText = '', image, aiSettings } = await req.json();

        if (!message) {
            return jsonResponse({ error: 'Falta el paràmetre "message"' }, 400);
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey || apiKey === 'LA_TEVA_CLAU_AQUI') {
            return jsonResponse({ error: 'Error intern del servidor (C)' }, 500);
        }

        // ── 1. RAG mitjançant Vector Embeddings ───────────────────────────────────
        let notesContext = "";
        try {
            const aiEmbedding = new GoogleGenAI({ apiKey });
            const embedResponse = await aiEmbedding.models.embedContent({
                model: 'gemini-embedding-2',
                contents: message,
            });
            const userVector = embedResponse.embeddings?.[0]?.values;

            if (userVector) {
                // Utilitzem una importació dinàmica per si l'arxiu és massa gran o es genera en build
                const embeddingsData = await import('../src/data/embeddings.json', { with: { type: "json" } })
                    .then(m => m.default || m)
                    .catch(() => []);
                
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
                
                // Ordenem de major a menor similitud i agafem els 7 millors fragments
                scoredChunks.sort((a: any, b: any) => b.score - a.score);
                const topChunks = scoredChunks.slice(0, 7);
                
                notesContext = topChunks
                    .map((c: any) => `## Tema: ${c.title} (Relevància: ${(c.score * 100).toFixed(1)}%)\n\n${c.content}`)
                    .join('\n\n---\n\n');
            }
        } catch (error) {
            console.error("Error calculant RAG per embeddings:", error);
            // Si falla l'embedding (ex: no hi ha internet, no troba l'arxiu local)
            // tornem a caure al mètode fallback bàsic
            const pathLower = currentPath.toLowerCase();
            let activeSubject: string | null = null;
            if (pathLower.includes('pro2')) activeSubject = 'pro2';
            else if (pathLower.includes('m1')) activeSubject = 'm1';
            else if (pathLower.includes('m2')) activeSubject = 'm2';

            let relevantNotes = allPersonalNotes;
            if (activeSubject) {
                relevantNotes = relevantNotes.filter((n: any) => n.subject === activeSubject);
            }
            if (relevantNotes.length > 5) {
                relevantNotes = relevantNotes.slice(0, 5);
            }
            notesContext = relevantNotes
                .map((note: any) => `## Tema: ${note.title}\n\n${note.content}`)
                .join('\n\n---\n\n');
        }

        // ── 2. Gemini init ───────────────────────────────────────────────────
        const ai = new GoogleGenAI({ apiKey });

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

L'alumne està actualment a la pàgina: ${currentPath}

Respon de manera natural, formatant en Markdown. Sigues directe i útil.

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

        // ── 3. Historial ────────────────────────────────────────────────────
        const formattedHistory = history.map((msg: any) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));

        const msgParts: any[] = [{ text: message }];
        if (image && image.data && image.mimeType) {
            msgParts.push({ inlineData: { data: image.data, mimeType: image.mimeType } });
        }

        // ── 4. SSE Stream ───────────────────────────────────────────────────
        const encoder = new TextEncoder();

        const sseStream = new ReadableStream({
            async start(controller) {
                const emit = (event: string, data: object) => {
                    controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
                };

                let lastError: any;
                let success = false;
                let intent = 'THINK'; // Default to THINK

                // Tell frontend we are alive immediately
                emit('status', { phase: 'thinking', model: 'AI Router' });
                emit('thought', { text: "Classificant la intenció de la consulta..." });

                // ── 4.1. Dynamic Intent Classification ──────────────────────
                try {
                    // Try to quickly classify the intent
                    const intentRes = await ai.models.generateContent({
                        model: 'gemini-2.5-flash-lite',
                        contents: message,
                        config: {
                            systemInstruction: "Ets un classificador d'intencions ràpid. Si el missatge de l'usuari requereix informació externa d'internet (actualitat, notícies, esports, dates recents, buscar a google), respon NOMÉS 'SEARCH'. Per qualsevol altra cosa (programació, càlculs, teoria, resum, xerrada), respon NOMÉS 'THINK'. No justifiquis la resposta.",
                            temperature: 0.1,
                            maxOutputTokens: 5,
                        }
                    });
                    if (intentRes.text.trim().toUpperCase().includes('SEARCH')) {
                        intent = 'SEARCH';
                    }
                } catch (e) {
                    console.error("Intent classifier failed, falling back to default:", e);
                }

                // If it's a search intent, we manually emit a thought to keep the UX alive
                if (intent === 'SEARCH') {
                    emit('status', { phase: 'thinking', model: 'Google Search' });
                    emit('thought', { text: "Buscant a Google informació actualitzada..." });
                }

                for (const modelName of MODELS) {
                    if (success) break;

                    try {
                        const supportsThinking = THINKING_MODELS.has(modelName);

                        const streamConfig: any = {
                            systemInstruction,
                        };

                        // Configure Tools OR Thinking based on intent
                        if (intent === 'SEARCH') {
                            streamConfig.tools = [{ googleSearch: {} }];
                        } else if (supportsThinking) {
                            streamConfig.thinkingConfig = {
                                includeThoughts: true,
                                thinkingBudget: 1024,
                            };
                        }

                        const response = await ai.models.generateContentStream({
                            model: modelName,
                            contents: [...formattedHistory, { role: 'user', parts: msgParts }],
                            config: streamConfig,
                        });

                        // Emit thinking status
                        emit('status', { phase: 'thinking', model: modelName });

                        let accumulatedText = '';
                        let lastSentIndex = 0;
                        let hasStartedWriting = false;
                        // Buffer safety margin: length of META_MARKER + some margin
                        const BUFFER_MARGIN = META_MARKER.length + 5;

                        for await (const chunk of response) {
                            // Process each part in the chunk
                            if (chunk.candidates && chunk.candidates[0]?.content?.parts) {
                                for (const part of chunk.candidates[0].content.parts) {
                                    // Thought parts (native thinking from Gemini)
                                    if (part.thought && part.text) {
                                        emit('thought', { text: part.text });
                                    }
                                    // Regular text parts
                                    else if (part.text) {
                                        accumulatedText += part.text;

                                        // Check if we've hit the META marker
                                        const metaIdx = accumulatedText.indexOf(META_MARKER);

                                        if (metaIdx === -1) {
                                            // No META marker yet — stream text with buffer margin
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
                                        // If META found, stop sending text deltas (rest goes to metadata)
                                    }
                                }
                            }
                        }

                        // ── Stream ended: flush remaining text and parse metadata ───
                        const { cleanText, keywords, memories_to_add } = parseMetaBlock(accumulatedText);

                        // Send any remaining clean text that wasn't sent yet
                        const remaining = cleanText.substring(lastSentIndex);
                        if (remaining) {
                            if (!hasStartedWriting) {
                                emit('status', { phase: 'writing' });
                            }
                            emit('delta', { text: remaining });
                        }

                        // Emit metadata
                        emit('metadata', { keywords, memories_to_add });
                        emit('done', {});
                        success = true;

                    } catch (e: any) {
                        const errMsg = String(e?.message || '');
                        const errStatus = e?.status;
                        const isRetryable =
                            errStatus === 429 || errStatus === 404 ||
                            errMsg.includes('429') || errMsg.includes('404') ||
                            errMsg.toLowerCase().includes('quota') ||
                            errMsg.toLowerCase().includes('rate') ||
                            errMsg.toLowerCase().includes('not found') ||
                            errMsg.toLowerCase().includes('not supported');

                        if (isRetryable) {
                            lastError = e;
                            continue;
                        }
                        // Non-retryable error — emit error and stop
                        emit('error', { message: e.message || 'Error intern del servidor' });
                        emit('done', {});
                        success = true; // prevent further retries
                    }
                }

                if (!success) {
                    emit('error', { message: lastError?.message || 'Tots els models de Gemini han fallat' });
                    emit('done', {});
                }

                controller.close();
            }
        });

        return new Response(sseStream, {
            status: 200,
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                ...CORS_HEADERS,
            },
        });

    } catch (error: any) {
        console.error('[Chat API Error]', error);
        return jsonResponse({ error: 'Error intern del servidor' }, 500);
    }
}
