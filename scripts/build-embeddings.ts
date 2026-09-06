import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { GoogleGenAI } from '@google/genai';
import { Index } from '@upstash/vector';

// ── Carrega .env.local o .env si existeixen localment ─────────────────────────
if (typeof process.loadEnvFile === 'function') {
    try {
        process.loadEnvFile('.env.local');
    } catch {
        try {
            process.loadEnvFile('.env');
        } catch {}
    }
}

// ── Llegim apunts des de .content-collections ─────────────────────────────────
import { allPersonalNotes } from '../.content-collections/generated/index.js';

// ── Tipus i estructures ──────────────────────────────────────────────────────
interface ChunkItem {
    id: string;
    subject: string;
    slug: string;
    title: string;
    content: string;
    fullContextText: string;
    hash: string;
    embedding?: number[];
}

interface SavedChunkData {
    id: string;
    hash: string;
    subject: string;
    slug: string;
    title: string;
    content: string;
    embedding: number[];
}

// ── Chunking robust de Markdown amb Overlap ──────────────────────────────────
function chunkMarkdown(
    text: string,
    maxChunkSize: number = 1200,
    overlapSize: number = 150
): string[] {
    if (!text || text.trim().length === 0) return [];
    if (text.length <= maxChunkSize) return [text.trim()];

    const paragraphs = text.split(/\n\n+/);
    const chunks: string[] = [];
    let currentChunk = '';

    for (const p of paragraphs) {
        const trimmedP = p.trim();
        if (!trimmedP) continue;

        // Si un sol paràgraf és immens (ex: taula o bloc de codi), el dividim
        if (trimmedP.length > maxChunkSize) {
            if (currentChunk.trim().length > 0) {
                chunks.push(currentChunk.trim());
                currentChunk = '';
            }
            let start = 0;
            while (start < trimmedP.length) {
                const slice = trimmedP.slice(start, start + maxChunkSize);
                chunks.push(slice.trim());
                start += Math.max(1, maxChunkSize - overlapSize);
            }
            continue;
        }

        // Si afegir aquest paràgraf supera maxChunkSize, tanquem chunk
        if (currentChunk.length + trimmedP.length + 2 > maxChunkSize && currentChunk.length > 0) {
            chunks.push(currentChunk.trim());

            if (overlapSize > 0 && currentChunk.length > overlapSize) {
                const overlapSlice = currentChunk.slice(-overlapSize);
                const lastBreak = overlapSlice.lastIndexOf('\n');
                currentChunk = (lastBreak !== -1 ? overlapSlice.slice(lastBreak + 1) : overlapSlice).trim() + '\n\n' + trimmedP + '\n\n';
            } else {
                currentChunk = trimmedP + '\n\n';
            }
        } else {
            currentChunk += trimmedP + '\n\n';
        }
    }

    if (currentChunk.trim().length > 0) {
        chunks.push(currentChunk.trim());
    }

    return chunks;
}

// ── Hash SHA-256 ràpid per a memòria cau ─────────────────────────────────────
function computeSha256(text: string): string {
    return crypto.createHash('sha256').update(text).digest('hex');
}

// ── Generació d'embeddings amb Exponential Backoff per a 429 ────────────────
async function getEmbeddingWithRetry(
    ai: GoogleGenAI,
    text: string,
    chunkId: string,
    maxRetries = 4
): Promise<number[] | undefined> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await ai.models.embedContent({
                model: 'gemini-embedding-2',
                contents: text,
                config: { outputDimensionality: 1536 }
            });

            const values = response.embeddings?.[0]?.values;
            if (values && values.length === 1536) {
                return values;
            }
            console.warn(`⚠️ [Embedding] Dimensió inesperada per a ${chunkId}`);
        } catch (err: any) {
            const isRateLimit = err?.status === 429 ||
                err?.message?.includes('429') ||
                err?.message?.includes('RESOURCE_EXHAUSTED');

            if (isRateLimit && attempt < maxRetries) {
                // Si és rate limit (RPM), esperar 15s per donar temps a buidar la finestra de quota
                const delayMs = attempt * 15000 + Math.floor(Math.random() * 2000);
                console.warn(`⏳ [Rate Limit 429] Finestra de quota superada per a ${chunkId}. Esperant ${(delayMs / 1000).toFixed(0)}s (intent ${attempt}/${maxRetries})...`);
                await new Promise(r => setTimeout(r, delayMs));
                continue;
            }
            console.error(`❌ [Error Embedding] ${chunkId}:`, err?.message || err);
            if (attempt === maxRetries) return undefined;
        }
    }
    return undefined;
}

// ── Worker Pool amb concurrència controlada i pacing ──────────────────────────
async function runConcurrentPool<T, R>(
    items: T[],
    concurrency: number,
    delayBetweenCallsMs: number,
    fn: (item: T, index: number) => Promise<R>,
    onProgress?: (completed: number, total: number) => void
): Promise<R[]> {
    const results: R[] = new Array(items.length);
    let currentIndex = 0;
    let completedCount = 0;

    const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
        while (currentIndex < items.length) {
            const idx = currentIndex++;
            results[idx] = await fn(items[idx], idx);
            completedCount++;
            if (onProgress) onProgress(completedCount, items.length);
            if (delayBetweenCallsMs > 0) {
                await new Promise(r => setTimeout(r, delayBetweenCallsMs));
            }
        }
    });

    await Promise.all(workers);
    return results;
}

// ── Sincronització en lots cap a Upstash Vector ──────────────────────────────
async function syncUpstashVector(chunks: SavedChunkData[]) {
    const url = process.env.UPSTASH_VECTOR_REST_URL;
    const token = process.env.UPSTASH_VECTOR_REST_TOKEN;

    if (!url || !token) {
        console.log("ℹ️ UPSTASH_VECTOR_REST_URL o UPSTASH_VECTOR_REST_TOKEN no configurats. S'omet la sincronització remota.");
        return;
    }

    try {
        const index = new Index({ url, token });
        const info = await index.info().catch(() => null);
        console.log(`📡 Connexió amb Upstash Vector establerta (Vectors actuals a l'índex: ${info?.vectorCount ?? 0}).`);

        const BATCH_SIZE = 100;
        const totalBatches = Math.ceil(chunks.length / BATCH_SIZE);
        console.log(`🚀 Sincronitzant ${chunks.length} vectors a Upstash en ${totalBatches} lots de ${BATCH_SIZE}...`);

        for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
            const batch = chunks.slice(i, i + BATCH_SIZE);
            const batchNumber = Math.floor(i / BATCH_SIZE) + 1;

            const upsertPayload = batch.map(c => ({
                id: c.id,
                vector: c.embedding,
                metadata: {
                    title: c.title,
                    slug: c.slug,
                    subject: c.subject,
                    content: c.content
                }
            }));

            await index.upsert(upsertPayload);
            console.log(`   ✅ Lot ${batchNumber}/${totalBatches} sincronitzat (${batch.length} vectors).`);
        }

        const updatedInfo = await index.info().catch(() => null);
        console.log(`🎉 Sincronització completada amb èxit! Vectors totals a Upstash: ${updatedInfo?.vectorCount ?? chunks.length}`);
    } catch (err: any) {
        console.error("❌ Error sincronitzant amb Upstash Vector:", err?.message || err);
    }
}

// ── Main Pipeline ────────────────────────────────────────────────────────────
async function buildEmbeddings() {
    const args = process.argv.slice(2);
    const forceRebuild = args.includes('--force');
    const isDryRun = args.includes('--dry-run');
    const syncOnly = args.includes('--sync-only');

    console.log("════════════════════════════════════════════════════════════════════");
    console.log("⚡ INICIANT SISTEMA D'OPTIMITZACIÓ RAG I EMBEDDINGS D'APUNTS ⚡");
    console.log("════════════════════════════════════════════════════════════════════");

    const dataDir = path.join(process.cwd(), 'data');
    const embeddingsPath = path.join(dataDir, 'embeddings.json');

    // 1. Carregar memòria cau existent (indexada per hash per màxima reutilització)
    const cacheByHash = new Map<string, SavedChunkData>();
    if (fs.existsSync(embeddingsPath)) {
        try {
            const raw = fs.readFileSync(embeddingsPath, 'utf-8');
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                for (const item of parsed) {
                    if (item.hash && item.embedding?.length === 1536) {
                        cacheByHash.set(item.hash, item);
                    }
                }
                console.log(`📦 S'han carregat ${cacheByHash.size} vectors vàlids (1536 dim) de la memòria cau local.`);
            }
        } catch (e) {
            console.warn("⚠️ No s'ha pogut llegir data/embeddings.json previ, s'inicia cau neta.");
        }
    }

    // 2. Si és mode només sincronització
    if (syncOnly) {
        const cachedList = Array.from(cacheByHash.values());
        if (cachedList.length === 0) {
            console.error("❌ No hi ha chunks a la memòria cau per sincronitzar. Executa l'script sense --sync-only.");
            return;
        }
        await syncUpstashVector(cachedList);
        return;
    }

    // 3. Extreure i trossejar (chunking) els apunts actius (ignorant esborranys i placeholders buits)
    const validNotes = allPersonalNotes.filter(n => {
        if (n.draft) return false;
        const content = (n.content || '').trim();
        if (content.length < 80) return false;
        if (content.includes('Contingut pendent') || content.includes("Aquest tema encara s'ha de redactar")) return false;
        if (content.includes('<object') && content.includes('resum_final.pdf')) return false;
        if (/^<object[\s\S]*<\/object>$/i.test(content)) return false;
        return true;
    });
    console.log(`📚 Processant ${validNotes.length} apunts actius amb contingut real (s'han omès ${allPersonalNotes.length - validNotes.length} esborranys o placeholders)...`);

    const allChunks: ChunkItem[] = [];
    for (const note of validNotes) {
        const lang = note.lang || 'ca';
        const subject = note.subject || 'general';
        const title = note.title || 'Sense títol';
        const textChunks = chunkMarkdown(note.content, 1200, 150);

        for (let i = 0; i < textChunks.length; i++) {
            const content = textChunks[i];
            const fullContextText = `[Assignatura: ${subject.toUpperCase()} | Tema: ${title}]\n\n${content}`;
            const hash = computeSha256(fullContextText);

            allChunks.push({
                id: `${lang}-${note.slug}-chunk-${i}`,
                subject,
                slug: note.slug,
                title,
                content,
                fullContextText,
                hash
            });
        }
    }
    console.log(`🧩 S'han generat ${allChunks.length} chunks estructurats.`);

    // 4. Comparar amb la memòria cau per trobar només els canvis
    const chunksToGenerate: ChunkItem[] = [];
    const finalMap = new Map<string, SavedChunkData>();

    for (const chunk of allChunks) {
        const cached = cacheByHash.get(chunk.hash);
        if (!forceRebuild && cached && cached.embedding?.length === 1536) {
            // Reutilitzar de la cau!
            finalMap.set(chunk.id, {
                ...cached,
                id: chunk.id,
                subject: chunk.subject,
                slug: chunk.slug,
                title: chunk.title,
                content: chunk.content
            });
        } else {
            chunksToGenerate.push(chunk);
        }
    }

    console.log(`✨ Reutilitzats de la memòria cau: ${finalMap.size} chunks (0 crides API gastades).`);
    console.log(`🆕 Chunks nous o modificats a calcular: ${chunksToGenerate.length}.`);

    if (isDryRun) {
        console.log("🔍 [Dry Run] Mode simulació actiu. No es crida Gemini ni es modifica cap fitxer.");
        return;
    }

    // 5. Generar embeddings per als chunks nous/modificats
    if (chunksToGenerate.length > 0) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn("⚠️ GEMINI_API_KEY no trobada. No es poden calcular nous embeddings. S'utilitzen només els de la cau.");
        } else {
            const ai = new GoogleGenAI({ apiKey });
            console.log(`🚀 Iniciant generació controlada (2 concurrència amb pacing de 600ms)...`);
            const startTime = Date.now();

            await runConcurrentPool(
                chunksToGenerate,
                2,   // 2 treballadors concurrents
                600, // 600ms entre crides per treballador (~100 RPM global per mantenir-se segur)
                async (item, idx) => {
                    const embedding = await getEmbeddingWithRetry(ai, item.fullContextText, item.id);
                    if (embedding) {
                        const saved: SavedChunkData = {
                            id: item.id,
                            hash: item.hash,
                            subject: item.subject,
                            slug: item.slug,
                            title: item.title,
                            content: item.content,
                            embedding
                        };
                        finalMap.set(item.id, saved);

                        // Desat incremental cada 10 chunks per no perdre feina mai
                        if (finalMap.size % 10 === 0) {
                            const currentList = Array.from(finalMap.values());
                            fs.writeFileSync(embeddingsPath, JSON.stringify(currentList, null, 2), 'utf-8');
                        }
                        return saved;
                    }
                    return null;
                },
                (completed, total) => {
                    if (completed % 10 === 0 || completed === total) {
                        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
                        console.log(`   Progrés: ${completed}/${total} (${((completed / total) * 100).toFixed(1)}%) en ${elapsed}s`);
                    }
                }
            );

            const totalSeconds = ((Date.now() - startTime) / 1000).toFixed(1);
            console.log(`✅ S'han processat ${chunksToGenerate.length} vectors en ${totalSeconds} segons!`);
        }
    }

    const finalChunks = Array.from(finalMap.values());

    // 6. Desar a data/embeddings.json
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    // Ordenar per ID per consistència
    finalChunks.sort((a, b) => a.id.localeCompare(b.id));

    fs.writeFileSync(embeddingsPath, JSON.stringify(finalChunks, null, 2), 'utf-8');
    console.log(`💾 Guardats ${finalChunks.length} embeddings a data/embeddings.json (${(fs.statSync(embeddingsPath).size / (1024 * 1024)).toFixed(2)} MB).`);

    // 7. Sincronitzar a Upstash Vector si hi ha hagut canvis o si Upstash està buit
    const url = process.env.UPSTASH_VECTOR_REST_URL;
    const token = process.env.UPSTASH_VECTOR_REST_TOKEN;
    if (url && token) {
        const index = new Index({ url, token });
        const info = await index.info().catch(() => null);
        const upstashNeedsPopulation = !info || info.vectorCount === 0 || chunksToGenerate.length > 0;

        if (upstashNeedsPopulation) {
            console.log(`🔄 Upstash requereix sincronització (vectorCount actual: ${info?.vectorCount ?? 0}).`);
            await syncUpstashVector(finalChunks);
        } else {
            console.log(`⚡ Upstash Vector ja està al dia (${info.vectorCount} vectors). No cal resincronitzar.`);
        }
    }

    console.log("════════════════════════════════════════════════════════════════════");
    console.log("🎉 SISTEMA RAG COMPLETAMENT SINCRONITZAT I A PUNT! 🎉");
    console.log("════════════════════════════════════════════════════════════════════");
}

buildEmbeddings().catch((err) => {
    console.error("❌ Error fatal executant buildEmbeddings:", err);
    process.exit(1);
});
