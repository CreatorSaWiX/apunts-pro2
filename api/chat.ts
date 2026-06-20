import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';
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

        const { message, history = [], currentPath = '/', pageText = '', image } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Falta el paràmetre "message"' });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey || apiKey === 'LA_TEVA_CLAU_AQUI') {
            return res.status(500).json({ error: 'Error intern del servidor (C)' });
        }

        // 1. Preparem el context: Unim tots els apunts (aprox 500KB)
        const notesContext = allPersonalNotes
            .map(note => `## Tema: ${note.title}\n\n${note.content}`)
            .join('\n\n---\n\n');

        // 2. Inicialitzem Gemini
        const genAI = new GoogleGenerativeAI(apiKey);

        const MODELS = [
            'gemini-3.5-flash',          // nou model de referència 3.5
            'gemini-3.1-flash-lite',     // 500 RPD → primer sempre
            'gemini-2.5-flash',          // 20 RPD, millor qualitat
            'gemini-2.5-flash-lite',     // 20 RPD, lite
            'gemini-2.0-flash-lite',     // rescat final
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

        // 3. Format de l'historial per a Gemini
        const formattedHistory = history.map((msg: any) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));

        const msgParts: any[] = [{ text: message }];
        if (image && image.data && image.mimeType) {
            msgParts.push({ inlineData: { data: image.data, mimeType: image.mimeType } });
        }

        // 4. Cascada de models: prova cada un, salta si 429
        let lastError: any;
        for (const modelName of MODELS) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName, systemInstruction });
                const chat = model.startChat({ history: formattedHistory });
                const result = await chat.sendMessage(msgParts);
                console.log(`✅ [Gemini] Model usat: ${modelName}`);
                return res.status(200).json({ reply: result.response.text() });
            } catch (e: any) {
                const is429 = e?.status === 429 || String(e?.message || '').includes('429') || String(e?.message || '').toLowerCase().includes('quota') || String(e?.message || '').toLowerCase().includes('rate');
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
