import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
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

        const { prompt, currentNodes = [], history = [], memory = {} } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Falta el paràmetre "prompt"' });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey || apiKey === 'LA_TEVA_CLAU_AQUI') {
            return res.status(500).json({ error: 'Error intern del servidor (C)' });
        }

        // Com que enviarem progressos abans que la IA respongui, preparem el SSE
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        if (typeof res.flushHeaders === 'function') res.flushHeaders();

        const sendSSE = (payload: any) => {
            res.write(`data: ${JSON.stringify(payload)}\n\n`);
            if (typeof (res as any).flush === 'function') {
                (res as any).flush(); // Força a enviar el buffer de compressió si existeix
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

        const genAI = new GoogleGenerativeAI(apiKey);
        const systemInstruction = `Ets un Senior Software Engineer i mentor executiu que ajuda estudiants de la FIB-UPC amb el seu roadmap.
Tens una personalitat professional, molt directa i estricta. Respon amb màxima claredat i precisió.
NO ets un xatbot convencional. Ets una eina de productivitat i planificació d'alt nivell.

REGLES D'ESTIL I CONTINGUT (MOLT ESTRICTES):
1. **ZERO EMOJIS**: Sota CAP concepte pots utilitzar emojis. Mai.
2. **ZERO FARCIMENT**: No facis introduccions ni comiats innecessaris ("Hola!", "Què tal?", "Com et puc ajudar?", "Que tinguis un bon dia"). Vés directe a la informació o a l'acció. Si et saluden només amb "Hola", respon amb "Digues-me."
3. **MÀXIMA CONCISIÓ**: Fes servir llistes, punts i frases curtes. No escriguis paràgrafs densos que no aportin valor.
4. PROCÉS DE PENSAMENT EXPLICAT: A petició de l'equip de disseny, SEMPRE has de començar la teva resposta explicant què estàs fent de forma transparent en cursiva. Això dóna feedback a l'estudiant del teu procés intern. Sigues molt curt. Exemples: "*Analitzant la salutació...*", "*Buscant la guia docent d'EDA...*", "*Avaluant trajectòria...*".
5. FORMAT I UI (CRÍTIC PER A L'APP):
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
5. NATURALITAT EXTREMA: Comporta't com en un xat normal amb un col·lega. Si et diuen "Hola", respon una cosa com "Ei, com va tot?". NO treguis el tema d'assignatures o la universitat si l'usuari només està saludant.
6. ADAPTA'T AL MISSATGE: Respon curt i directe per defecte. Desenvolupa només si demanen consell estratègic (ex: triar especialitat, dubtes d'avaluació).
7. ZERO farciment: Mai diguis "Sóc un assistent virtual".
8. MANTENIMENT DE TEMA: Si l'usuari et parla de qualsevol cosa fora de la uni, respon amb naturalitat. No canviïs forçosament cap a l'estudi.
9. ESTIL DE COMUNICACIÓ (ANTI-CRINGE): Sigues molt directe i al gra. NO t'enrotllis gens ni facis paràgrafs llargs. NO facis servir adjectius innecessaris, motivacionals, exagerats o emocionals (ex: "màgicament", "apassionant", "increïble", "submergiràs"). Parla com un company enginyer objectiu, amb fets concrets i zero cringe.
10. CONTINGUT D'ASSIGNATURES: Quan donis el resum o expliquis una assignatura, obvia el professorat i les competències, centra't ÚNICAMENT en aquests 3 punts:
   - **Què faran (Activitats)**: Llistat molt breu dels projectes o pràctiques clau perquè sàpiga exactament què haurà de programar o resoldre.
   - **Mètode d'Avaluació**: Moltes assignatures tenen avaluacions complexes amb \`max()\` o sumen més de 100% (punts extra). Per solucionar-ho:
     1. Escriu la fórmula oficial matemàtica de l'avaluació en format KaTeX (ex: \`$$ \\min(10, \\max(0.2 \\cdot P + ...)) $$\`) perquè l'usuari vegi tota la lògica i rutes alternatives. Afegeix una llegenda ràpida si cal.
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
            'gemini-2.5-flash',
            'gemini-1.5-flash',
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

        let lastError: any;
        
        for (const modelName of MODELS) {
            try {
                const model = genAI.getGenerativeModel({
                    model: modelName,
                    systemInstruction,
                    tools: [{ functionDeclarations: [roadmapTool] as any }],
                    generationConfig: {
                        temperature: 0.1
                    }
                });

                const chat = model.startChat({ history: formattedHistory });
                const result = await chat.sendMessageStream([{ text: prompt }]);
                
                let hasToolCall = false;
                let toolCallData = null;

                let isThinking = true;
                let thoughtProcessBuffer = "";
                let hasStartedThinking = false;

                for await (const chunk of result.stream) {
                    // Check for function calls
                    const functionCalls = chunk.functionCalls();
                    if (functionCalls && functionCalls.length > 0) {
                        hasToolCall = true;
                        toolCallData = functionCalls[0].args;
                        break;
                    }

                    const chunkText = chunk.text();
                    if (chunkText) {
                        if (isThinking) {
                            thoughtProcessBuffer += chunkText;
                            
                            // Busquem el primer asterisc que indica l'inici del pensament
                            if (!hasStartedThinking) {
                                const startIdx = thoughtProcessBuffer.indexOf('*');
                                if (startIdx !== -1) {
                                    hasStartedThinking = true;
                                    thoughtProcessBuffer = thoughtProcessBuffer.substring(startIdx + 1);
                                }
                            }
                            
                            if (hasStartedThinking) {
                                const endIdx = thoughtProcessBuffer.indexOf('*');
                                if (endIdx !== -1) {
                                    // Hem trobat el final del pensament
                                    const thoughtText = thoughtProcessBuffer.substring(0, endIdx).trim();
                                    const remainingText = thoughtProcessBuffer.substring(endIdx + 1).trimStart();
                                    
                                    if (thoughtText) {
                                        sendSSE({ type: 'progress', content: thoughtText + "..." });
                                    }
                                    
                                    isThinking = false; // Fi del pensament
                                    
                                    if (remainingText) {
                                        sendSSE({ type: 'text', content: remainingText });
                                    }
                                } else {
                                    // Encara està pensant, actualitzem el text
                                    sendSSE({ type: 'progress', content: thoughtProcessBuffer.replace(/\n/g, ' ') + "..." });
                                }
                            } else {
                                // Si escriu més de 10 caràcters i no ha posat cap asterisc, ignorem el pensament
                                if (thoughtProcessBuffer.length > 10) {
                                    isThinking = false;
                                    sendSSE({ type: 'text', content: thoughtProcessBuffer });
                                }
                            }
                        } else {
                            // Enviar com a text normal un cop ha acabat de pensar
                            sendSSE({ type: 'text', content: chunkText });
                        }
                    }
                }

                // Si hi ha hagut una crida a una funció
                if (hasToolCall && toolCallData) {
                    sendSSE({ type: 'actions', content: toolCallData.actions });
                }

                res.write(`data: [DONE]\n\n`);
                if (typeof (res as any).flush === 'function') (res as any).flush();
                res.end();
                return;
                
            } catch (e: any) {
                const is429 = e?.status === 429 || String(e?.message || '').includes('429');
                if (is429) {
                    console.warn(`[Vercel Roadmap AI] ${modelName} rate limit, saltant...`);
                    lastError = e;
                    continue;
                }
                
                // Si hi ha un error durant el stream, envia'l i tanca
                sendSSE({ type: 'error', content: e.message });
                res.end();
                return;
            }
        }

        if (lastError) {
            res.status(500).json({ error: 'Tots els models han fallat (Rate Limit)' });
        }

    } catch (error: any) {
        console.error('[Roadmap AI Error]', error);
        res.status(500).json({ error: 'Error processant la petició d\'IA' });
    }
}
