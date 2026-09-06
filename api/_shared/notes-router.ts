import { allPersonalNotes } from '../../.content-collections/generated/index.js';
import type { GoogleGenAI } from '@google/genai';
import { getLiteModels } from './models';
import { logGeminiPrompt } from './debug';
import subjectsData from '../../src/data/subjects.json';

export interface NotesRouterOptions {
    message: string;
    currentPath?: string;
    pageText?: string;
    language?: string;
}

// Mapa ràpid de totes les assignatures oficials del Grau GEI (acronym en minúscules -> dades)
const officialSubjectsMap = new Map<string, { acronym: string; name: string }>();
for (const s of subjectsData) {
    officialSubjectsMap.set(s.name.toLowerCase(), {
        acronym: s.name.toUpperCase(),
        name: s.description
    });
}

/**
 * Extreu el número real del tema a partir del títol ("Tema 5: ...") o de l'slug ("m1-tema-5")
 */
export function getNoteTopicNumber(note: { title?: string; slug?: string }): number | null {
    if (note.title) {
        const titleMatch = note.title.match(/Tema\s+(\d+)/i);
        if (titleMatch) return parseInt(titleMatch[1], 10);
    }
    if (note.slug) {
        const slugMatch = note.slug.match(/tema-(\d+)/i);
        if (slugMatch) return parseInt(slugMatch[1], 10);
    }
    return null;
}

/**
 * Comprova si una nota té contingut teòric real o és només un marcador de posició buit ("test", etc.)
 */
export function isRealNote(note: { content?: string; title?: string }): boolean {
    const text = (note.content || '').trim();
    if (text.length < 200) return false;
    if (text.toLowerCase().includes('tema 1: test') || text.toLowerCase().includes('contingut pendent')) return false;
    return true;
}

/**
 * Neteja el contingut Markdown per a l'LLM:
 * - Elimina grans blocs JSON de grafs interactius per D3/ForceGraph
 * - Elimina contenidors i tags HTML <object> de visors de PDF
 * - Preserva el 100% de la teoria, definicions, teoremes, fórmules KaTeX i codi
 */
export function cleanNoteContentForLlm(content: string): string {
    return content
        .replace(/:::graph[^\n]*\n```json[\s\S]*?```\n:::/gi, '')
        .replace(/:::graph[\s\S]*?:::/gi, '')
        .replace(/:::(?:grid|tip|warning|note|info)[^\n]*/gi, '')
        .replace(/:::/g, '')
        .replace(/<object[\s\S]*?<\/object>/gi, '')
        .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

/**
 * Retorna la llista única de temes per a una assignatura, evitant duplicacions
 * entre idiomes (prioritzant targetLang, fallback a 'ca') i ordenant per ordre curricular.
 */
export function getUniqueNotesForSubject(subject: string, targetLang: string) {
    const validNotes = allPersonalNotes.filter(
        n => n.subject.toLowerCase() === subject.toLowerCase() && !n.draft
    );

    const bySlug = new Map<string, typeof validNotes>();
    for (const note of validNotes) {
        if (!bySlug.has(note.slug)) bySlug.set(note.slug, []);
        bySlug.get(note.slug)!.push(note);
    }

    const selected: typeof validNotes = [];
    for (const [, variants] of bySlug.entries()) {
        const note = variants.find(n => n.lang === targetLang) ||
                     variants.find(n => n.lang === 'ca') ||
                     variants[0];
        if (note) selected.push(note);
    }

    return selected.sort((a, b) => a.order - b.order);
}

/**
 * Genera el resum compacte de totes les assignatures per al prompt del model Lite
 */
function getSubjectsSyllabusOverview(): string {
    const subjects = Array.from(new Set(allPersonalNotes.map(n => n.subject.toLowerCase()))).sort();
    const lines: string[] = [];

    for (const sub of subjects) {
        const notes = getUniqueNotesForSubject(sub, 'ca');
        const realNotes = notes.filter(isRealNote);
        const official = officialSubjectsMap.get(sub);
        const fullName = official ? `${official.acronym} (${official.name})` : sub.toUpperCase();

        if (realNotes.length > 0) {
            const items = notes.map(n => {
                const num = getNoteTopicNumber(n);
                const shortTitle = n.title.replace(/^Tema\s+\d+:\s*/i, '');
                return num !== null ? `T${num} (${shortTitle})` : shortTitle;
            });
            lines.push(`- ${fullName} [APUNTS COMPLETS DISPONIBLES]: ${items.join(', ')}`);
        } else {
            lines.push(`- ${fullName} [APUNTS EN CONSTRUCCIÓ: Temari oficial del GEI FIB]`);
        }
    }

    return lines.join('\n');
}

/**
 * Genera el mapa curricular d'alta nivell de totes les assignatures i temes disponibles
 */
function generateCurricularOverview(userLang: string): string {
    const subjects = Array.from(new Set(allPersonalNotes.map(n => n.subject.toLowerCase()))).sort();
    const sections: string[] = [];

    for (const sub of subjects) {
        const notes = getUniqueNotesForSubject(sub, userLang);
        const official = officialSubjectsMap.get(sub);
        const subHeader = official ? `${official.acronym} - ${official.name}` : sub.toUpperCase();

        const topicList = notes
            .map(n => {
                const topicNum = getNoteTopicNumber(n);
                const prefix = topicNum !== null ? `Tema ${topicNum}` : 'Material';
                return `  - **${n.title}** (${prefix}): ${n.description || (isRealNote(n) ? 'Teoria completa disponible' : 'Pendent de redacció a la plataforma')}`;
            })
            .join('\n');

        sections.push(`### Assignatura: ${subHeader}\n${topicList}`);
    }

    return `MAPA DE TOTES LES ASSIGNATURES I TEMARIS DEL GRAU GEI:\n\n${sections.join('\n\n')}`;
}

/**
 * Encaminador semàntic d'apunts impulsat per un model Lite.
 * Suporta consultes d'un tema concret, d'assignatures completes individuals o múltiples,
 * i mapeja fidelment la realitat acadèmica de la FIB-UPC.
 */
export async function resolveDynamicNotesContext(
    options: NotesRouterOptions,
    ai: GoogleGenAI
): Promise<string> {
    const { message, currentPath, language } = options;
    const targetLang = (language || 'ca').toLowerCase().slice(0, 2);

    // Tema actual si l'alumne és a la pàgina
    const currentNote = currentPath
        ? (allPersonalNotes.find(n => currentPath.includes(n.slug) && n.lang === targetLang && !n.draft) ||
           allPersonalNotes.find(n => currentPath.includes(n.slug) && n.lang === 'ca' && !n.draft))
        : undefined;

    const subjectsSyllabus = getSubjectsSyllabusOverview();
    const prompt = `Ets el router semàntic d'apunts d'un campus universitari d'enginyeria informàtica (FIB/UPC).

Assignatures i temaris oficials a la plataforma web:
${subjectsSyllabus}

Pàgina actual on es troba l'estudiant: ${currentNote ? `${currentNote.subject.toUpperCase()} - Tema ${getNoteTopicNumber(currentNote) ?? currentNote.order} (${currentNote.title})` : 'Pàgina general'}

Consulta de l'alumne: "${message.slice(0, 500).replace(/"/g, '\\"')}"

Determina quins apunts o temaris cal injectar per respondre amb màxima fidelitat. Respon ÚNICAMENT amb un JSON vàlid:
{
  "scope": "subjects" | "topic" | "curriculum" | "none",
  "subjects": string[], // Llista d'assignatures en minúscules (ex: ["m1"], ["eda", "so", "pe", "ci", "bd"], ["pro2", "eda"]). Buit si scope és "none" o "curriculum".
  "topic": number | null // número de tema si demana un tema concret (ex: 5 per Tema 5). Si demana tota l'assignatura o múltiples, null.
}`;

    let routing: { scope?: string; subject?: string; subjects?: string[]; topic?: number } = {};

    for (const model of getLiteModels()) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1200);
        try {
            logGeminiPrompt({
                endpoint: 'chat:notes_router',
                model,
                contents: prompt
            });

            const res = await ai.models.generateContent({
                model,
                contents: prompt,
                config: {
                    temperature: 0,
                    responseMimeType: 'application/json',
                    maxOutputTokens: 120,
                    abortSignal: controller.signal
                }
            });

            clearTimeout(timeoutId);
            routing = JSON.parse(res.text?.trim() || '{}');
            break;
        } catch {
            clearTimeout(timeoutId);
            continue;
        }
    }

    // Normalització d'assignatures (suport transparent per a 'subjects' com array o 'subject' singular)
    let subjectsList: string[] = [];
    if (Array.isArray(routing.subjects)) {
        subjectsList = routing.subjects.map(s => String(s).toLowerCase().trim()).filter(Boolean);
    } else if (routing.subject) {
        subjectsList = [String(routing.subject).toLowerCase().trim()];
    }

    // 1. Demana una o múltiples assignatures (ex: "Resumeix tot M1", "Resumeix EDA, SO, PE, CI i BD", "Diferència entre PRO2 i EDA")
    if ((routing.scope === 'subjects' || routing.scope === 'subject') && subjectsList.length > 0) {
        // CAS A: Una sola assignatura sol·licitada
        if (subjectsList.length === 1) {
            const sub = subjectsList[0];
            const subNotes = getUniqueNotesForSubject(sub, targetLang);
            const realNotes = subNotes.filter(isRealNote);
            const official = officialSubjectsMap.get(sub);
            const fullName = official ? `${official.acronym} - ${official.name}` : sub.toUpperCase();

            // Si té apunts reals complets al repositori (ex: M1, M2, PRO2)
            if (realNotes.length > 0) {
                const indexLines = subNotes.map(n => {
                    const topicNum = getNoteTopicNumber(n);
                    const tag = topicNum !== null ? `Tema ${topicNum}` : 'Material/Examen';
                    return `- **${n.title}** (${tag}): ${n.description || ''}`;
                });

                const contentBlocks = subNotes.map(n => {
                    const cleaned = cleanNoteContentForLlm(n.content);
                    const body = cleaned.length > 0 ? cleaned : `*(Recurs de repàs d'examen oficial: "${n.description || n.title}")*`;
                    return `### ${n.title}\n${body}`;
                });

                return `APUNTS I TEMARI OFICIAL COMPLET DE L'ASSIGNATURA ${fullName}:

ESTRUCTURA CURRICULAR OFICIAL (UTILITZA EXCLUSIVAMENT AQUESTS TEMES):
${indexLines.join('\n')}

---

CONTINGUT DETALLAT DE CADA TEMA:

${contentBlocks.join('\n\n---\n\n')}`;
            }

            // Si l'assignatura és oficial de la FIB però no té apunts redactats a la web (ex: EDA, SO, BD, IA)
            return `ASSIGNATURA OFICIAL DE LA FIB-UPC: ${fullName}
[AVÍS PLATAFORMA: Els apunts redactats d'aquesta assignatura encara estan en procés a la plataforma web. Respon amb el teu màxim rigor docent explicant el programa oficial d'aquesta assignatura al Grau en Enginyeria Informàtica (GEI) de la FIB-UPC.]`;
        }

        // CAS B: Múltiples assignatures demanades alhora (ex: "Resumeix EDA, SO, PE, CI i BD", "Compara M1 i M2")
        const multiSections: string[] = [];
        for (const sub of subjectsList) {
            const subNotes = getUniqueNotesForSubject(sub, targetLang);
            const realNotes = subNotes.filter(isRealNote);
            const official = officialSubjectsMap.get(sub);
            const fullName = official ? `${official.acronym} - ${official.name}` : sub.toUpperCase();

            if (realNotes.length > 0) {
                const topicLines = subNotes.map(n => {
                    const topicNum = getNoteTopicNumber(n);
                    const tag = topicNum !== null ? `Tema ${topicNum}` : 'Material';
                    return `  - **${n.title}** (${tag}): ${n.description || ''}`;
                }).join('\n');
                multiSections.push(`### Assignatura: ${fullName} (Apunts complets disponibles)\nTemari oficial:\n${topicLines}`);
            } else {
                multiSections.push(`### Assignatura: ${fullName}\n[Apunts web en procés de redacció a la plataforma. Fes servir el programa docent oficial de la FIB per a aquesta assignatura].`);
            }
        }

        return `GUIA I TEMARIS OFICIALS DE LES ASSIGNATURES SOL·LICITADES (${subjectsList.map(s => s.toUpperCase()).join(', ')}):\n\n${multiSections.join('\n\n---\n\n')}`;
    }

    // 2. Demana un tema específic (ex: "M1 tema 5", "Tema 8 de PRO2", "Schwarz a M2")
    if (routing.scope === 'topic') {
        const sub = subjectsList[0] || currentNote?.subject;
        const targetTopic = routing.topic ?? (currentNote ? getNoteTopicNumber(currentNote) : null);

        if (sub) {
            const subNotes = getUniqueNotesForSubject(sub, targetLang);
            let note = null;

            if (targetTopic !== null && targetTopic !== undefined) {
                // 1. Cerca pel número de tema real al títol o slug (ex: Tema 5 -> tema-5.md)
                note = subNotes.find(n => getNoteTopicNumber(n) === targetTopic);
                // 2. Si no es troba, fallback a n.order
                if (!note) {
                    note = subNotes.find(n => n.order === targetTopic);
                }
            }

            // 3. Cerca per coincidència textual al títol si no s'ha especificat número
            if (!note) {
                const lowerMsg = message.toLowerCase();
                note = subNotes.find(n => {
                    const cleanTitle = n.title.toLowerCase().replace(/^tema\s+\d+:\s*/i, '');
                    return cleanTitle.length > 3 && lowerMsg.includes(cleanTitle);
                });
            }

            if (note) {
                if (isRealNote(note)) {
                    const cleaned = cleanNoteContentForLlm(note.content);
                    return `APUNT OFICIAL DE L'ASSIGNATURA ${sub.toUpperCase()} - ${note.title}:\n\n${cleaned}`;
                } else {
                    return `APUNT DEL TEMA ${note.title} (${sub.toUpperCase()}): [Aquest tema està pendent de redacció a la plataforma web. Respon amb el teu coneixement docent expert de la FIB-UPC sobre aquest concepte].`;
                }
            }
        }
    }

    // 3. Demana el mapa del grau sencer
    if (routing.scope === 'curriculum') {
        return generateCurricularOverview(targetLang);
    }

    // 4. Fallback automàtic: si l'alumne és a un tema real de la web i no ha demanat res extern
    if (currentNote && isRealNote(currentNote)) {
        const cleaned = cleanNoteContentForLlm(currentNote.content);
        return `APUNT OFICIAL DEL TEMA ${currentNote.order} (${currentNote.title}):\n\n${cleaned}`;
    }

    return '';
}
