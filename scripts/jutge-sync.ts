/**
 * jutge-sync.ts
 *
 * Intelligent sync system for Jutge.org problem statements.
 * Automatically synchronizes problem statements defined in `courseStructure.ts`
 * into `src/content/data/jutge-statements.json`.
 *
 * Features:
 *  - ⚡ Instant: if all problem IDs are already scraped, takes ~2ms (zero network).
 *  - 🧠 Intelligent: detects newly added problem IDs and scrapes ONLY those.
 *  - 🛡 Resilient: handles offline builds, 404s, and Jutge outages gracefully.
 *  - 🔌 Vite Plugin: auto-scrapes in dev mode on file save AND at build time.
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import type { Plugin } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const OUTPUT_FILE = path.resolve(__dirname, '../src/content/data/jutge-statements.json');
export const COURSE_STRUCTURE_FILE = path.resolve(__dirname, '../src/content/data/courseStructure.ts');
export const CONTENT_DATA_DIR = path.resolve(__dirname, '../src/content/data');

const LANGS = ['ca', 'en', 'es'];
const CONCURRENCY = 4;
const DELAY_MS = 250;

export interface ScrapedStatement {
    title: string;
    statement: string;
    availableLanguages: string[];
}

export interface StatementsMetadata {
    version: number;
    lastSync: string;
    checkedIds: string[];
    unsupportedIds?: string[];
}

export type StatementsMap = Record<string, ScrapedStatement | StatementsMetadata | undefined>;

/**
 * Determines whether a topic belongs to Jutge (PRO2, EDA, or layout: 'jutge').
 * Explicitly ignores mathematics (M1, M2), probability (PE), and databases (BD).
 */
export function isJutgeTopic(topicId: string, layout?: string): boolean {
    if (layout === 'notebook') return false;
    if (
        topicId.startsWith('m1-') ||
        topicId.startsWith('m2-') ||
        topicId.startsWith('pe-') ||
        topicId.startsWith('bd-')
    ) {
        return false;
    }
    return topicId.startsWith('pro2-') || topicId.startsWith('eda-') || layout === 'jutge';
}

/**
 * Validates if an ID follows the official Jutge problem format (6 uppercase alphanumeric characters).
 * Math exercises (e.g. 'M1-T1-Ex1.1', 'M2-T1-Ex1') are rejected.
 */
export function isJutgeProblemId(id: string): boolean {
    return /^[A-Z0-9]{6}$/.test(id);
}

/**
 * Extracts unique Jutge problem IDs from courseStructure.ts.
 * Strictly ignores all mathematics/non-Jutge topics and non-Jutge problem IDs.
 */
export function extractProblemIds(): string[] {
    if (!fs.existsSync(COURSE_STRUCTURE_FILE)) return [];
    try {
        const fileContent = fs.readFileSync(COURSE_STRUCTURE_FILE, 'utf-8');
        const jutgeIds = new Set<string>();

        // Match topic objects: { id: "...", ... problems: [ ... ] }
        const topicRegex = /\{\s*id:\s*["']([a-z0-9_-]+)["'][\s\S]*?problems:\s*\[([\s\S]*?)\]\s*(?:,\s*layout:\s*["']([a-z]+)["'])?/g;

        let match;
        while ((match = topicRegex.exec(fileContent)) !== null) {
            const topicId = match[1];
            const problemsBlock = match[2];
            const layout = match[3];

            if (!isJutgeTopic(topicId, layout)) {
                // Math or other non-Jutge topic: completely skip
                continue;
            }

            // Extract only valid Jutge IDs: exactly 6 uppercase alphanumeric chars
            const probRegex = /id:\s*["']([A-Z0-9]{6})["']/g;
            let pm;
            while ((pm = probRegex.exec(problemsBlock)) !== null) {
                if (isJutgeProblemId(pm[1])) {
                    jutgeIds.add(pm[1]);
                }
            }
        }

        return Array.from(jutgeIds);
    } catch (err) {
        console.warn(`[jutge-sync] Error reading ${COURSE_STRUCTURE_FILE}:`, (err as Error).message);
        return [];
    }
}

/**
 * Parses Jutge problem statement HTML and sanitizes it.
 */
function parseJutgeHtml(html: string, problemId: string, lang: string): ScrapedStatement | null {
    if (html.includes('Login') || html.includes('Wrong URL') || html.length < 200) {
        return null;
    }

    // Extract title from <h1>
    let title = problemId;
    const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (h1Match) {
        let h1Content = h1Match[1]
            .replace(/<small[^>]*>[\s\S]*?<\/small>/gi, '')
            .replace(/<[^>]*class=["'][^"']*pull-right[^"']*["'][^>]*>[\s\S]*?<\/[^>]+>/gi, '');
        h1Content = h1Content.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
        if (h1Content) {
            title = h1Content
                .replace(new RegExp(`^${problemId}\\.?\\s*`, 'i'), '')
                .replace(new RegExp(`\\s*${problemId}\\.?$`, 'i'), '')
                .trim() || title;
        }
    }

    // Detect available languages
    const detectedLangs = new Set<string>();
    const langRegex = /href=["'][^"']*\/problems\/[^"']*[_/](ca|en|es)["']/gi;
    let langMatch;
    while ((langMatch = langRegex.exec(html)) !== null) {
        detectedLangs.add(langMatch[1].toLowerCase());
    }
    detectedLangs.add(lang);
    const availableLanguages = detectedLangs.size > 0 ? Array.from(detectedLangs) : LANGS;

    // Extract statement container
    let statementHtml = '';
    const txtMatch = html.match(/<div[^>]*id=["']txt["'][^>]*>([\s\S]*?)<\/div>\s*(?:<\/div>|<div[^>]*id=["'](?!txt))/i);
    if (txtMatch) {
        statementHtml = txtMatch[1];
    } else {
        const panelMatch = html.match(/<div[^>]*class=["'][^"']*panel-body[^"']*["'][^>]*>([\s\S]*?)<\/div>\s*<\/div>/i);
        if (panelMatch) {
            statementHtml = panelMatch[1];
        } else {
            const bodyMatch = html.match(/<h1[^>]*>[\s\S]*?<\/h1>([\s\S]*?)(?:<form|<div[^>]*id=["'](?:footer|submission)|$)/i);
            if (bodyMatch) {
                statementHtml = bodyMatch[1];
            }
        }
    }

    if (!statementHtml || statementHtml.trim().length < 10) return null;

    // Clean up HTML
    statementHtml = statementHtml
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<nav[\s\S]*?<\/nav>/gi, '')
        .replace(/<header[\s\S]*?<\/header>/gi, '')
        .replace(/<footer[\s\S]*?<\/footer>/gi, '')
        .replace(/<button[\s\S]*?<\/button>/gi, '')
        .replace(/<[^>]*class=["'][^"']*(?:navbar|breadcrumb)[^"']*["'][^>]*>[\s\S]*?<\/[^>]+>/gi, '')
        .replace(/\bclass=["']([^"']*)collapse([^"']*)["']/g, 'class="$1$2"')
        .replace(/\bclass=["']([^"']*)in([^"']*)["']/g, 'class="$1$2"')
        .replace(/href=["']problem:\/\/([^"']+)["']/g, (_, id) => `href="https://jutge.org/problems/${id.split('.')[0]}"`)
        // Preserve quote character (' or ") when resolving relative paths
        .replace(/\bsrc=(["'])\/(?!\/)/gi, 'src=$1https://jutge.org/')
        .replace(/\bhref=(["'])\/(?!\/)/gi, 'href=$1https://jutge.org/');

    // Remove all file downloads (PDF, ZIP, TAR, TGZ, Code files, /main/cc, /solution/cc, trash links) completely
    statementHtml = statementHtml.replace(
        /<a\b[^>]*href=(["'])[^"']*?(\.pdf|\/pdf|\.zip|\/zip|\.tar|\.tgz|\.tar\.gz|public\.tar|trashurl|\/main\/|\/solution\/|\.(cc|hh|java|py|cpp|c\+\+))[^"']*?\1[^>]*>[\s\S]*?<\/a>/gi,
        ''
    );

    // Remove any leftover file-badge elements
    statementHtml = statementHtml.replace(/<a\b[^>]*class=["'][^"']*file-badge[^"']*["'][^>]*>[\s\S]*?<\/a>/gi, '');

    // Remove file icons (pdf, zip, tar, gatet/public icons)
    statementHtml = statementHtml.replace(
        /<img\b[^>]*src=(["'])https:\/\/jutge\.org[^"']*?(?:\/icons\/|\/ico\/|ico_|icon_|f_pdf|f_zip|zip\.png|pdf\.png|public\.png)[^"']*?\1[^>]*>/gi,
        ''
    );

    // Remove empty anchor tags left behind by removed icons
    statementHtml = statementHtml.replace(/<a\b[^>]*>\s*<\/a>/gi, '');

    // Add target="_blank" to remaining valid links (if not already present)
    statementHtml = statementHtml.replace(/<a\b(?![^>]*\btarget=)([^>]*)/gi, '<a target="_blank"$1');

    // Style content images (diagrams, math charts, graphs)
    statementHtml = statementHtml.replace(
        /<img(?![^>]*class=["'][^"']*content-image)([^>]*)>/gi,
        '<img class="content-image block max-w-full h-auto rounded-lg my-6 shadow-md border border-white/10 mx-auto"$1>'
    );

    // Style normal remaining links (e.g. cross-references to other problems)
    statementHtml = statementHtml.replace(/<a\b([^>]*href=(["'])([^"']*)\2[^>]*)>([\s\S]*?)<\/a>/gi, (_fullMatch, attrs, _q, _href, content) => {
        if (!content.includes('<img')) {
            return `<a ${attrs} class="text-emerald-400 hover:text-emerald-300 underline underline-offset-4 decoration-emerald-500/30 transition-colors">${content}</a>`;
        }
        return `<a ${attrs} class="inline-block no-underline">${content}</a>`;
    });

    // Remove empty paragraphs and empty anchors iteratively
    let prev;
    do {
        prev = statementHtml;
        statementHtml = statementHtml
            .replace(/<p\b[^>]*>(\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, '')
            .replace(/<a\b[^>]*>\s*<\/a>/gi, '');
    } while (statementHtml !== prev);

    statementHtml = statementHtml.replace(/^(\s|&nbsp;|<br\s*\/?>)+/gi, '');
    statementHtml = statementHtml.replace(/(\s|&nbsp;|<br\s*\/?>)+$/gi, '');

    return { title, statement: statementHtml.trim(), availableLanguages };
}

/**
 * Fetches a single problem from Jutge.org in a specific language.
 */
async function fetchStatement(problemId: string, lang: string): Promise<ScrapedStatement | null> {
    const url = `https://jutge.org/problems/${problemId}_${lang}`;
    try {
        const resp = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            signal: AbortSignal.timeout(10000)
        });
        if (!resp.ok) return null;
        const html = await resp.text();
        return parseJutgeHtml(html, problemId, lang);
    } catch {
        return null;
    }
}

/**
 * Runs a batch of promises with concurrency limit and polite delay.
 */
async function processBatch<T, R>(items: T[], fn: (item: T) => Promise<R>, concurrency: number): Promise<R[]> {
    const results: R[] = [];
    for (let i = 0; i < items.length; i += concurrency) {
        const batch = items.slice(i, i + concurrency);
        const batchResults = await Promise.all(batch.map(fn));
        results.push(...batchResults);
        if (i + concurrency < items.length) {
            await new Promise(r => setTimeout(r, DELAY_MS));
        }
    }
    return results;
}

/**
 * Synchronizes Jutge statements: detects new problem IDs in courseStructure.ts
 * and fetches only the missing ones, updating jutge-statements.json.
 */
export async function syncJutgeStatements(options: { force?: boolean; silent?: boolean } = {}): Promise<{
    fetched: number;
    newProblems: string[];
}> {
    const { force = false, silent = false } = options;

    // 1. Load existing data
    let data: StatementsMap = {};
    if (fs.existsSync(OUTPUT_FILE)) {
        try {
            data = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
        } catch {
            data = {};
        }
    }

    const meta = (data._meta as StatementsMetadata) || {
        version: 1,
        lastSync: '',
        checkedIds: [],
        unsupportedIds: []
    };

    // Track checked IDs
    const checkedIdsSet = new Set<string>(meta.checkedIds || []);
    // Also include any IDs already present as keys
    for (const key of Object.keys(data)) {
        if (key === '_meta') continue;
        const id = key.split('_')[0];
        if (id) checkedIdsSet.add(id);
    }

    if (force) {
        checkedIdsSet.clear();
        data = {};
    }

    // 2. Extract current IDs from courseStructure.ts
    const currentProblemIds = extractProblemIds();

    // 3. Find missing IDs
    const missingIds = force
        ? currentProblemIds
        : currentProblemIds.filter(id => !checkedIdsSet.has(id));

    if (missingIds.length === 0) {
        if (!silent) {
            // Check if metadata needs initial saving
            if (!data._meta || (data._meta as StatementsMetadata).checkedIds?.length !== checkedIdsSet.size) {
                data._meta = {
                    version: 1,
                    lastSync: new Date().toISOString(),
                    checkedIds: Array.from(checkedIdsSet).sort(),
                    unsupportedIds: meta.unsupportedIds || []
                };
                fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2), 'utf-8');
            }
        }
        return { fetched: 0, newProblems: [] };
    }

    console.log(`\n[jutge-sync] 🔍 Detectat(s) ${missingIds.length} exercici(s) nou(s) a courseStructure: ${missingIds.join(', ')}`);
    console.log(`[jutge-sync] ⏳ Descarregant enunciats de Jutge.org...`);

    // 4. Build task list for missing IDs
    const tasks: { problemId: string; lang: string }[] = [];
    for (const id of missingIds) {
        for (const lang of LANGS) {
            tasks.push({ problemId: id, lang });
        }
    }

    let fetched = 0;
    const newlyFoundProblems = new Set<string>();

    await processBatch(tasks, async ({ problemId, lang }) => {
        const key = `${problemId}_${lang}`;
        const result = await fetchStatement(problemId, lang);
        if (result) {
            data[key] = result;
            fetched++;
            newlyFoundProblems.add(problemId);
            console.log(`  [jutge-sync] ✅ ${key} -> "${result.title}"`);
        }
        return result;
    }, CONCURRENCY);

    // Update checked IDs so we don't query 404s repeatedly
    for (const id of missingIds) {
        checkedIdsSet.add(id);
        if (!newlyFoundProblems.has(id)) {
            if (!meta.unsupportedIds) meta.unsupportedIds = [];
            if (!meta.unsupportedIds.includes(id)) meta.unsupportedIds.push(id);
        }
    }

    // 5. Save updated JSON
    data._meta = {
        version: 1,
        lastSync: new Date().toISOString(),
        checkedIds: Array.from(checkedIdsSet).sort(),
        unsupportedIds: meta.unsupportedIds || []
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2), 'utf-8');
    const sizeKb = (fs.statSync(OUTPUT_FILE).size / 1024).toFixed(1);
    console.log(`[jutge-sync] ✨ Sincronitzat! ${fetched} enunciats guardats a jutge-statements.json (${sizeKb} KB)\n`);

    return { fetched, newProblems: missingIds };
}

/**
 * Vite Plugin: Automatically syncs Jutge statements during build and dev.
 * - On server start / buildStart: checks if any IDs are missing and downloads them.
 * - On file change: watches courseStructure.ts and downloads newly added exercises.
 */
export function jutgeAutoSyncPlugin(): Plugin {
    let isSyncing = false;

    return {
        name: 'jutge-auto-sync-plugin',
        async buildStart() {
            try {
                await syncJutgeStatements({ silent: false });
            } catch (err) {
                console.warn('[jutge-sync] Avís: No s\'ha pogut sincronitzar amb Jutge.org (continuant amb dades existents):', (err as Error).message);
            }
        },
        async handleHotUpdate(ctx) {
            // ONLY watch courseStructure.ts. Math files, notes, proofs, and quizzes are ignored immediately.
            const isTargetFile = ctx.file.endsWith('courseStructure.ts');

            if (!isTargetFile || isSyncing) return;

            isSyncing = true;
            try {
                const { fetched, newProblems } = await syncJutgeStatements({ silent: false });
                if (fetched > 0 || newProblems.length > 0) {
                    console.log(`[jutge-sync] 🔄 Recarregant aplicació amb els nous enunciats...`);
                    ctx.server.ws.send({ type: 'full-reload' });
                }
            } catch (err) {
                console.warn('[jutge-sync] Error durant la sincronització automàtica:', (err as Error).message);
            } finally {
                isSyncing = false;
            }
        }
    };
}
