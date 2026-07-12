// import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Per suportar __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error('ERROR: Falta GEMINI_API_KEY a .env.local');
    process.exit(1);
}

// const ai = new GoogleGenAI({ apiKey });

// Llegim el directori d'apunts (des de .content-collections)
// Hem de fer import dinàmic pel fet d'estar compilat
import { allPersonalNotes } from '../.content-collections/generated/index.js';

interface ChunkData {
    id: string;
    subject: string;
    slug: string;
    title: string;
    content: string;
    embedding?: number[];
}

// Funció senzilla de chunking per markdown
function chunkText(text: string, maxLen: number = 800): string[] {
    const paragraphs = text.split('\n\n');
    const chunks: string[] = [];
    let currentChunk = '';

    for (const p of paragraphs) {
        if (currentChunk.length + p.length > maxLen && currentChunk.length > 0) {
            chunks.push(currentChunk.trim());
            currentChunk = '';
        }
        currentChunk += p + '\n\n';
    }
    if (currentChunk.trim().length > 0) {
        chunks.push(currentChunk.trim());
    }
    return chunks;
}

async function buildEmbeddings() {
    console.log(`Iniciant generació d'embeddings per a ${allPersonalNotes.length} apunts...`);
    
    const allChunks: ChunkData[] = [];

    for (const note of allPersonalNotes) {
        const textChunks = chunkText(note.content, 1000);
        for (let i = 0; i < textChunks.length; i++) {
            allChunks.push({
                id: `${note.slug}-chunk-${i}`,
                subject: note.subject || 'general',
                slug: note.slug,
                title: note.title,
                content: textChunks[i]
            });
        }
    }

    console.log(`S'han generat ${allChunks.length} chunks en total. Obtenint vectors de Gemini...`);

    // Obtenim embeddings de forma seqüencial per no petar l'API de Gemini (Rate Limit 429)
    // El model gratuït té límit de RPM (Requests Per Minute).
    /* --- COMENTAT TEMPORALMENT PER A DESENVOLUPAMENT (EVITAR RATE LIMITS) ---
    for (let i = 0; i < allChunks.length; i++) {
        const chunk = allChunks[i];
        console.log(`Processant chunk ${i + 1} de ${allChunks.length}...`);
        
        try {
            const response = await ai.models.embedContent({
                model: 'gemini-embedding-2',
                contents: chunk.content,
            });
            if (response.embeddings && response.embeddings.length > 0) {
                chunk.embedding = response.embeddings[0].values;
            }
        } catch (err: any) {
            console.error(`Error generant embedding per ${chunk.id}:`, err.message);
        }

        // Delay de 2.5 segons entre crides (~24 reqs per minut) per evitar 429 RESOURCE_EXHAUSTED
        await new Promise(r => setTimeout(r, 2500));
    }
    -------------------------------------------------------------------------- */

    // Filtrem els que hagin fallat
    const successChunks = allChunks.filter(c => c.embedding && c.embedding.length > 0);
    console.log(`Guardant ${successChunks.length} embeddings amb èxit...`);

    if (successChunks.length === 0) {
        console.log("No s'ha generat cap embedding (bucle de generació comentat per a entorn de desenvolupament).");
        return; // Retornem d'hora per no sobreescriure el fitxer amb un array buit
    }

    // Ho desem a src/data/embeddings.json
    const dataDir = path.resolve(__dirname, '../src/data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(
        path.join(dataDir, 'embeddings.json'),
        JSON.stringify(successChunks) // Si pesa molt podem fer-ho sense espais
    );

    console.log('✅ Embeddings generats i guardats a src/data/embeddings.json!');
}

buildEmbeddings().catch(console.error);
