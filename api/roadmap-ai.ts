import { GoogleGenAI } from '@google/genai';
import { getLoadBalancedModels, applyThinkingConfig } from './_shared/models';
import { withMiddleware } from './_shared/middleware';
import { roadmapRequestSchema } from './_shared/schemas';
import { CORS_HEADERS } from './_shared/cors';

export default withMiddleware(async function handler(req: Request, userId?: string): Promise<Response> {
    const rawBody = await req.json().catch(() => ({}));
    const parseResult = roadmapRequestSchema.safeParse(rawBody);

    if (!parseResult.success) {
        return new Response(JSON.stringify({ error: 'Dades invàlides', details: parseResult.error.format() }), { 
            status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } 
        });
    }

    const { prompt, currentNodes, history, memory, aiSettings, userName, attachedFile } = parseResult.data;

    if (!prompt && !attachedFile) {
        return new Response(JSON.stringify({ error: 'Falta el paràmetre "prompt" o arxiu adjunt' }), { 
            status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } 
        });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return new Response(JSON.stringify({ error: 'Error intern del servidor (C)' }), { 
            status: 500, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } 
        });
    }

    // --- EXTRACCIÓ DINÀMICA DE CONTEXT ---
    let injectedContext = "";
    let mentionedNodes = currentNodes.filter((node: any) => {
        const regex = new RegExp(`\\b${node.id}\\b`, 'i');
        return regex.test(prompt || "");
    });

    if (mentionedNodes.length === 0 && /(assignatur|cursar|roadmap|semestre|preparar|avaluaci|professor|hores|estudi|consell)/i.test(prompt || "")) {
        mentionedNodes = currentNodes.filter((n: any) => n.status === 'in_progress');
        if (mentionedNodes.length === 0) mentionedNodes = currentNodes.slice(0, 5); 
    }

    if (mentionedNodes.length > 0) {
        injectedContext += "\n\n# CONTEXT ESPECÍFIC DE LES ASSIGNATURES MENCIONADES:\n";
        for (const node of mentionedNodes) {
            try {
                const baseUrl = process.env.VITE_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:5173");
                const url = `${baseUrl}/data/subjects/${node.id}.json`;
                const res = await fetch(url);
                if (res.ok) {
                    const parsedData = await res.json();
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

    const formattedHistory = history.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
    }));

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

    const msgParts: any[] = [];
    if (prompt) msgParts.push({ text: prompt });
    else msgParts.push({ text: "Analitza aquest document." });

    if (attachedFile && attachedFile.data && attachedFile.mimeType) {
        msgParts.push({ inlineData: { data: attachedFile.data, mimeType: attachedFile.mimeType } });
    }

    const encoder = new TextEncoder();
    const sseStream = new ReadableStream({
        async start(controller) {
            const emit = (event: string, data: object) => {
                controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
            };

            try {
                let lastError: any;
                let replied = false;
                let hasStartedWriting = false;

                for (const modelName of getLoadBalancedModels()) {
                    try {
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
                            if (req.signal.aborted) {
                                controller.close();
                                return;
                            }
                            if (chunk.candidates && chunk.candidates[0]?.content?.parts) {
                                for (const part of chunk.candidates[0].content.parts) {
                                    if (part.thought && part.text) {
                                        emit('thought', { text: part.text });
                                    } else if (part.text) {
                                        hasStartedWriting = true;
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
                        replied = true;
                        break;
                    } catch (e: any) {
                        const is429 = (e?.status === 429 || String(e?.message || '').includes('429') || String(e?.message || '').includes('503') || String(e?.message || '').toLowerCase().includes('quota') || String(e?.message || '').toLowerCase().includes('rate')) && !hasStartedWriting;
                        if (is429) {
                            lastError = e;
                            continue;
                        }
                        emit('error', { message: e.message || 'Error intern del servidor' });
                        emit('done', {});
                        replied = true;
                        break;
                    }
                }

                if (!replied) {
                    emit('error', { message: lastError?.message || 'Tots els models han fallat' });
                    emit('done', {});
                }
            } finally {
                try {
                    controller.close();
                } catch (e) {
                    // Ignore if already closed
                }
            }
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
});
