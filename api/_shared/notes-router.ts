import { allPersonalNotes } from '../../.content-collections/generated/index.js';
import { type GoogleGenAI, ThinkingLevel } from '@google/genai';
import { getLiteModels } from './models.js';
import { logGeminiPrompt } from './debug.js';
import subjectsData from '../../src/data/subjects.json' with { type: 'json' };

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

const TRIVIAL_MESSAGE_REGEX = /^(hola|bon dia|bona tarda|bona nit|ei|bones|hey|hi|hello|adeu|fins aviat|gr[aà]cies|moltes gr[aà]cies|merci|ok|d'acord|perfecte|ent[eè]s|vale|qu[eè] tal|com va|com est[aà]s|qui ets|qu[eè] pots fer)[?!.,\s]*$/i;

/**
 * Comprova si un missatge és una salutació o interacció conversacional breu
 * que no requereix consultar apunts ni memòria.
 */
export function isTrivialConversationalMessage(message: string): boolean {
    const trimmed = message.trim();
    if (trimmed.length === 0) return true;
    if (trimmed.length <= 45 && TRIVIAL_MESSAGE_REGEX.test(trimmed)) return true;
    return false;
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
 * Neteja i compacta el contingut Markdown per a l'LLM.
 */
export function cleanNoteContentForLlm(content: string): string {
    return content
        .replace(/:{3,}graph[^\n]*\n```json[\s\S]*?```\n:{3,}/gi, '')
        .replace(/:{3,}graph[\s\S]*?:{3,}/gi, '')
        .replace(/:{3,}[a-zA-Z0-9_\-]+(?:\{[^\}]*\})?/gi, '')
        .replace(/:{3,}/g, '')
        .replace(/<object[\s\S]*?<\/object>/gi, '')
        .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
        .replace(/<\/?(?:div|span|p|small)[^>]*>/gi, '')
        .replace(/^[=\-_*]{3,}$/gm, '')
        .replace(/\|(?:[ \t]*:?-+:?[ \t]*\|)+/g, match => match.replace(/[ \t:]+/g, ''))
        .replace(/[ \t]+$/gm, '')
        .replace(/[ \t]{2,}/g, ' ')
        .replace(/\n{2,}/g, '\n')
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

let cachedSyllabusOverview: string | null = null;

/**
 * Genera (i guarda en caché en memòria) el resum compacte de totes les assignatures.
 */
function getSubjectsSyllabusOverview(): string {
    if (cachedSyllabusOverview) return cachedSyllabusOverview;

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

    cachedSyllabusOverview = lines.join('\n');
    return cachedSyllabusOverview;
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
 * Detecta en O(1) quines assignatures del grau es mencionen explícitament al missatge.
 */
function detectMentionedSubjects(message: string): string[] {
    const found: string[] = [];
    for (const [acronymLower] of officialSubjectsMap.entries()) {
        const escaped = acronymLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escaped}\\b`, 'i');
        if (regex.test(message)) {
            found.push(acronymLower);
        }
    }
    return found;
}

/**
 * Encaminador semàntic d'apunts amb Fast-Path O(1) local i fallback a model Lite.
 */
export async function resolveDynamicNotesContext(
    options: NotesRouterOptions,
    ai: GoogleGenAI
): Promise<string> {
    const { message, currentPath, language } = options;
    const trimmed = message.trim();

    // 0. Fast-Path O(1): Salutacions o missatges trivials no injecten mai apunts
    if (isTrivialConversationalMessage(trimmed)) {
        return '';
    }

    const targetLang = (language || 'ca').toLowerCase().slice(0, 2);

    // Tema actual si l'alumne és a la pàgina
    const currentNote = currentPath
        ? (allPersonalNotes.find(n => currentPath.includes(n.slug) && n.lang === targetLang && !n.draft) ||
           allPersonalNotes.find(n => currentPath.includes(n.slug) && n.lang === 'ca' && !n.draft))
        : undefined;

    // 1. Fast-Path O(1): Si l'alumne està en un tema real, no menciona cap altra assignatura,
    // ni demana tot el grau/temari general, resolem en 0ms sense cridar cap LLM!
    const mentionedSubjects = detectMentionedSubjects(trimmed);
    const asksForWholeCurriculum = /\b(grau|totes les assignatures|mapa curricular|pla d'estudis|especialitat)\b/i.test(trimmed);
    const asksForWholeSubject = /\b(tota l'assignatura|tot el temari|tots els temes|resum de\s+[a-z0-9]{2,5})\b/i.test(trimmed);
    const explicitTopicMatch = trimmed.match(/\btema\s+(\d+)\b/i);

    if (
        currentNote &&
        isRealNote(currentNote) &&
        !asksForWholeCurriculum &&
        !asksForWholeSubject &&
        !explicitTopicMatch &&
        (mentionedSubjects.length === 0 ||
            (mentionedSubjects.length === 1 && mentionedSubjects[0] === currentNote.subject.toLowerCase()))
    ) {
        const cleaned = cleanNoteContentForLlm(currentNote.content);
        return `APUNT OFICIAL DEL TEMA ${currentNote.order} (${currentNote.title}):\n\n${cleaned}`;
    }

    // 2. Fast-Path O(1): Menció directa d'1 assignatura + 1 tema concret (ex: "M1 tema 5" o "tema 3 de PRO2")
    if (mentionedSubjects.length === 1 && explicitTopicMatch && !asksForWholeSubject) {
        const sub = mentionedSubjects[0];
        const targetTopic = parseInt(explicitTopicMatch[1], 10);
        const subNotes = getUniqueNotesForSubject(sub, targetLang);
        const note = subNotes.find(n => getNoteTopicNumber(n) === targetTopic) || subNotes.find(n => n.order === targetTopic);
        if (note && isRealNote(note)) {
            const cleaned = cleanNoteContentForLlm(note.content);
            return `APUNT OFICIAL DE L'ASSIGNATURA ${sub.toUpperCase()} - ${note.title}:\n\n${cleaned}`;
        }
    }

    const subjectsSyllabus = getSubjectsSyllabusOverview();
    const prompt = `Ets el router semàntic d'apunts d'un campus universitari d'enginyeria informàtica (FIB/UPC).

Assignatures i temaris oficials a la plataforma web:
${subjectsSyllabus}

Pàgina actual on es troba l'estudiant: ${currentNote ? `${currentNote.subject.toUpperCase()} - Tema ${getNoteTopicNumber(currentNote) ?? currentNote.order} (${currentNote.title})` : 'Pàgina general'}

Consulta de l'alumne: "${trimmed.slice(0, 500).replace(/"/g, '\\"')}"

Determina quins apunts o temaris cal injectar per respondre amb màxima fidelitat. Respon ÚNICAMENT amb un JSON vàlid:
{
  "scope": "subjects" | "topic" | "curriculum" | "none",
  "subjects": string[],
  "topic": number | null
}`;

    let routing: { scope?: string; subject?: string; subjects?: string[]; topic?: number } = {};

    // Executem seqüencialment amb timeout curt (2.2s) per no multiplicar per 3 el consum de quota RPM
    for (const model of getLiteModels()) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2200);
        const thinkingConfig = model.startsWith('gemini-3')
            ? { thinkingLevel: ThinkingLevel.MINIMAL }
            : { thinkingBudget: 0 };

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
                    thinkingConfig,
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

    // Si el router determina explícitament que no cal cap apunt, no injectem res
    if (routing.scope === 'none') {
        return '';
    }

    let subjectsList: string[] = [];
    if (Array.isArray(routing.subjects)) {
        subjectsList = routing.subjects.map(s => String(s).toLowerCase().trim()).filter(Boolean);
    } else if (routing.subject) {
        subjectsList = [String(routing.subject).toLowerCase().trim()];
    }

    // 1. Demana una o múltiples assignatures
    if ((routing.scope === 'subjects' || routing.scope === 'subject') && subjectsList.length > 0) {
        if (subjectsList.length === 1) {
            const sub = subjectsList[0];
            const subNotes = getUniqueNotesForSubject(sub, targetLang);
            const realNotes = subNotes.filter(isRealNote);
            const official = officialSubjectsMap.get(sub);
            const fullName = official ? `${official.acronym} - ${official.name}` : sub.toUpperCase();

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

${contentBlocks.join('\n\n')}`;
            }

            return `ASSIGNATURA OFICIAL DE LA FIB-UPC: ${fullName}
[AVÍS PLATAFORMA: Els apunts redactats d'aquesta assignatura encara estan en procés a la plataforma web. Respon amb el teu màxim rigor docent explicant el programa oficial d'aquesta assignatura al Grau en Enginyeria Informàtica (GEI) de la FIB-UPC.]`;
        }

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

    // 2. Demana un tema específic
    if (routing.scope === 'topic') {
        const sub = subjectsList[0] || currentNote?.subject;
        const targetTopic = routing.topic ?? (currentNote ? getNoteTopicNumber(currentNote) : null);

        if (sub) {
            const subNotes = getUniqueNotesForSubject(sub, targetLang);
            let note = null;

            if (targetTopic !== null && targetTopic !== undefined) {
                note = subNotes.find(n => getNoteTopicNumber(n) === targetTopic) || subNotes.find(n => n.order === targetTopic);
            }

            if (!note) {
                const lowerMsg = trimmed.toLowerCase();
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

    // 4. Fallback si el router ha fallat per timeout i l'alumne és dins d'un tema
    if (!routing.scope && currentNote && isRealNote(currentNote)) {
        const cleaned = cleanNoteContentForLlm(currentNote.content);
        return `APUNT OFICIAL DEL TEMA ${currentNote.order} (${currentNote.title}):\n\n${cleaned}`;
    }

    return '';
}
