import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Configurar CORS
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

        const { prompt, currentNodes = [], history = [], memory = {}, aiSettings, userName, attachedFile } = req.body;

        if (!prompt && !attachedFile) {
            return res.status(400).json({ error: 'Falta el paràmetre "prompt" o arxiu adjunt' });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey || apiKey === 'LA_TEVA_CLAU_AQUI') {
            return res.status(500).json({ error: 'Error intern del servidor (C)' });
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

        // --- EXTRACCIÓ DINÀMICA DE CONTEXT (RAG) ---
        // Busquem si l'usuari menciona alguna assignatura de les que té al roadmap
        let injectedContext = "";
        let mentionedNodes = currentNodes.filter((node: any) => {
            // Busquem l'acrònim de forma case-insensitive, assegurant-nos que sigui una paraula sencera
            const regex = new RegExp(`\\b${node.id}\\b`, 'i');
            return regex.test(prompt);
        });

        // Si no menciona cap assignatura concreta però demana consells, explicacions o preparació
        if (mentionedNodes.length === 0 && /(assignatur|cursar|roadmap|semestre|preparar|avaluaci|professor|hores|estudi|consell)/i.test(prompt)) {
            mentionedNodes = currentNodes.filter((n: any) => n.status === 'in_progress');
            // Si no té cap in_progress, agafem totes per donar-li context global
            if (mentionedNodes.length === 0) mentionedNodes = currentNodes.slice(0, 5); 
        }

        if (mentionedNodes.length > 0) {
            injectedContext += "\n\n# CONTEXT ESPECÍFIC DE LES ASSIGNATURES MENCIONADES:\n";
            for (const node of mentionedNodes) {
                try {
                    // En producció a Vercel, els fitxers de public es poden llegir si s'han copiat correctament
                    // Normalment per Vercel cal configurar bé els fitxers estàtics, però intentem llegir-ho del build path
                    const filePath = path.join(process.cwd(), 'public', 'data', 'subjects', `${node.id}.json`);
                    if (fs.existsSync(filePath)) {
                        const fileData = fs.readFileSync(filePath, 'utf-8');
                        const parsedData = JSON.parse(fileData);
                        
                        // Només injectem les parts rellevants per no saturar el token limit (tot i que Gemini aguanta bé)
                        const filteredData = {
                            acronim: parsedData.acronim,
                            credits: parsedData.credits,
                            activities: parsedData.activities,
                            // Simplifiquem les seccions d'avaluació i altres per treure HTML
                            sections: parsedData.sections?.map((s: any) => ({
                                title: s.title,
                                // Traiem l'HTML complex, deixem només el text net
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

        const ai = new GoogleGenAI({ apiKey });
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
Tens una personalitat professional. Respon amb màxima claredat i precisió.
NO ets un xatbot convencional. Ets una eina de productivitat i planificació d'alt nivell.

REGLES D'ESTIL I CONTINGUT (MOLT ESTRICTES):
1. **ZERO EMOJIS**: Sota CAP concepte pots utilitzar emojis. Mai.
2. **CLAREDAT I CONCISIÓ**: Vés directe a la informació o a l'acció. Si l'usuari envia un missatge curt o fora de context (ex: "Hola", "a", "hola què tal"), respon de forma completament natural, curta i directa com ho faria un company d'universitat. Demana què necessita sense allargar-te (ex: "Digues-me.", "Què passa?").
3. **MÀXIMA CONCISIÓ**: Fes servir llistes, punts i frases curtes. No escriguis paràgrafs densos que no aportin valor.
4. FORMAT I UI (CRÍTIC PER A L'APP):
   - **Mètode d'Avaluació**: TRADUEIX explícitament l'avaluació a KaTeX PUR. És obligatori fer servir commands de LaTeX com \\min i \\max. La fórmula ha d'estar aïllada en un bloc $$:
     $$ \\text{NOTA} = \\min(10, \\max(0.225 \\cdot NPP + ...)) $$
     **MOLT IMPORTANT**: Has d'incloure SEMPRE i OBLIGATÒRIAMENT just a sota un bloc de codi EXACTAMENT amb el llenguatge \`subject-evaluation\` que contingui els pesos en JSON. Si no ho fas, l'aplicació farà "crash". Exemple:
     \`\`\`subject-evaluation
     [
       {"acronym": "NPP", "name": "Examen Parcial", "weight": 22.5},
       {"acronym": "NF", "name": "Examen Final", "weight": 45},
       {"acronym": "NO", "name": "Examen d'Ordinador", "weight": 45},
       {"acronym": "NJ", "name": "Joc / Projecte", "weight": 20}
     ]
     \`\`\`
5. ADAPTA'T AL MISSATGE: Respon curt i directe per defecte. Desenvolupa només si demanen consell estratègic (ex: triar especialitat, dubtes d'avaluació).
6. ZERO farciment: Mai diguis "Sóc un assistent virtual".
7. MANTENIMENT DE TEMA: Si l'usuari et parla de qualsevol cosa fora de la uni, respon amb naturalitat. No canviïs forçosament cap a l'estudi.
8. ESTIL DE COMUNICACIÓ (ANTI-CRINGE): Sigues molt directe i al gra. NO t'enrotllis gens ni facis paràgrafs llargs. NO facis servir adjectius innecessaris, motivacionals, exagerats o emocionals (ex: "màgicament", "apassionant", "increïble", "submergiràs"). Parla com un company enginyer objectiu, amb fets concrets i zero cringe.
9. CONTINGUT D'ASSIGNATURES: Quan donis el resum o expliquis una assignatura, obvia el professorat i les competències, centra't ÚNICAMENT en aquests 3 punts:
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
     Mai posis "subject-stats" com a text normal, OBLIGATÒRIAMENT ha de ser un bloc de codi.

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

        const MODELS = [
            'gemini-3.5-flash',
            'gemini-2.5-flash',
            'gemini-3.1-flash-lite'
        ];

        // Definim la tool per modificar el roadmap
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

        const msgParts: any[] = [];
        if (prompt) msgParts.push({ text: prompt });
        else msgParts.push({ text: "Analitza aquest document." });

        if (attachedFile && attachedFile.data && attachedFile.mimeType) {
            msgParts.push({ inlineData: { data: attachedFile.data, mimeType: attachedFile.mimeType } });
        }

        for (const modelName of MODELS) {
            try {
                const supportsThinking = THINKING_MODELS.has(modelName);
                // Mantenim els tools però NO activem el thinkingConfig alhora,
                // ja que pot provocar al·lucinacions amb "tool_code" o "thought" en models 2.5
                const streamConfig: any = {
                    systemInstruction,
                    temperature: 0.1,
                    tools: [{ functionDeclarations: [roadmapTool] as any }]
                };


                const responseStream = await ai.models.generateContentStream({
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
                    console.warn(`[Prod Roadmap AI] ${modelName} rate limit/503, provant el seguent model...`);
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
        console.error("[Prod Roadmap AI Error]:", e);
        if (!res.headersSent) {
            res.status(500).json({ error: String(e.message || e) });
        } else {
            res.write(`event: error\ndata: ${JSON.stringify({ message: String(e.message || e) })}\n\n`);
            if (typeof (res as any).flush === 'function') (res as any).flush();
            res.end();
        }
    }
}
