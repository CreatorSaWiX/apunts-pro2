import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';
// Importem els apunts compilats per Content Collections
import { allPersonalNotes } from '../.content-collections/generated/index.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Preflight request (CORS)
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

        const { message, history = [], currentPath = '/', pageText = '', image, aiSettings } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Falta el paràmetre "message"' });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey || apiKey === 'LA_TEVA_CLAU_AQUI') {
            return res.status(500).json({ error: 'Error intern del servidor (C)' });
        }

        // 1. Preparem el context: RAG lleuger basat en la URL (currentPath)
        const pathLower = currentPath.toLowerCase();
        let activeSubject = null;
        if (pathLower.includes('pro2')) activeSubject = 'pro2';
        else if (pathLower.includes('m1')) activeSubject = 'm1';
        else if (pathLower.includes('m2')) activeSubject = 'm2';

        let relevantNotes = allPersonalNotes;
        if (activeSubject) {
            relevantNotes = relevantNotes.filter(n => n.subject === activeSubject);
        }

        // Si podem deduir el tema exacte pel slug de la URL, el prioritzem
        const slugMatch = pathLower.split('/').pop();
        if (slugMatch && relevantNotes.some(n => n.slug && n.slug.includes(slugMatch))) {
            relevantNotes = relevantNotes.filter(n => n.slug.includes(slugMatch));
        } else if (relevantNotes.length > 5) {
            // Si no hi ha slug específic i hi ha massa notes, ens quedem només amb els 5 primers per no saturar
            relevantNotes = relevantNotes.slice(0, 5);
        }

        const notesContext = relevantNotes
            .map(note => `## Tema: ${note.title}\n\n${note.content}`)
            .join('\n\n---\n\n');

        // 2. Inicialitzem Gemini
        const ai = new GoogleGenAI({ apiKey });

        const MODELS = [
            'gemini-3.5-flash',          // nou model de referència 3.5
            'gemini-3.1-flash-lite',     // 500 RPD → primer sempre
            'gemini-2.5-flash',          // 20 RPD, millor qualitat
            'gemini-2.5-flash-lite',     // 20 RPD, lite
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

L'alumne està actualment a la pàgina: ${currentPath}

MOLT IMPORTANT: La teva sortida ha de ser ÚNICAMENT un objecte JSON amb aquesta estructura exacta:
{
  "reply": "La teva resposta natural i formatada en markdown com ho faries normalment.",
  "keywords": ["paraula1", "paraula2", "paraula3"], // 3 a 5 paraules clau rellevants per a l'usuari
  "memories_to_add": [] // Retorna un array buit per defecte. NOMÉS hi has d'afegir un string si l'usuari acaba de revelar informació vital a llarg termini sobre el seu perfil (ex. un projecte, una tecnologia que aprèn, preferències). Evita guardar dades temporals o de xerrada casual.
}

Aquest és el text visible a la seva pantalla ara mateix (útil si està mirant un solucionari penjat per algú):
"""
${pageText}
"""

I aquest és el coneixement base oficial de l'assignatura:
${notesContext}

MOLT IMPORTANT SOBRE LA CERCA:
Tens l'eina "Google Search" activada. Si l'alumne et fa una pregunta sobre actualitat, dates, conferències, documentació o qualsevol cosa que no estigui al "coneixement base oficial", **HAS D'UTILITZAR GOOGLE SEARCH per buscar la resposta a Internet** i respondre-li amb la informació trobada. Mai diguis "no ho tinc als meus apunts" si ho pots buscar a Google.`;

        // 3. Format de l'historial per a Gemini
        const formattedHistory = history.map((msg: any) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));

        const msgParts: any[] = [{ text: message }];
        if (image && image.data && image.mimeType) {
            msgParts.push({ inlineData: { data: image.data, mimeType: image.mimeType } });
        }

        // 4. Cascada de models: prova cada un, salta si 429 o 404
        let lastError: any;
        for (const modelName of MODELS) {
            try {
                const response = await ai.models.generateContent({
                    model: modelName,
                    contents: [...formattedHistory, { role: 'user', parts: msgParts }],
                        config: {
                            systemInstruction: systemInstruction,
                            tools: [{ googleSearch: {} } as any]
                        }
                });
                console.log(`✅ [Gemini] Model usat: ${modelName}`);
                
                let rData;
                try {
                    let cleanText = response.text.trim();
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
                    console.warn("Gemini didn't return JSON, falling back to raw text.");
                    rData = {
                        reply: response.text,
                        keywords: [],
                        memories_to_add: []
                    };
                }
                
                // Mantenim el camp 'reply' per al frontend actual, 
                return res.status(200).json({ 
                    reply: rData.reply,
                    keywords: rData.keywords || [],
                    memories_to_add: rData.memories_to_add || []
                });
            } catch (e: any) {
                const is429 = e?.status === 429 || e?.status === 404 || String(e?.message || '').includes('429') || String(e?.message || '').includes('404') || String(e?.message || '').toLowerCase().includes('quota') || String(e?.message || '').toLowerCase().includes('rate');
                if (is429) {
                    console.warn(`⚠️ [Gemini] ${modelName} rate limit, provant el seguent...`);
                    lastError = e;
                    continue;
                }
                throw e;
            }
        }

        throw lastError ?? new Error('Tots els models de Gemini han fallat');
    } catch (error: any) {
        console.error('[Gemini API Error]', error);
        res.status(500).json({ error: 'Error intern del servidor' });
    }
}
