import { GoogleGenAI } from '@google/genai';

let aiInstance: GoogleGenAI | null = null;

/**
 * Singleton mandrós (lazy singleton) per a instanciar GoogleGenAI un sol cop en memòria.
 * Evita pressió innecessària sobre el Garbage Collector de V8 entre múltiples peticions.
 */
export function getGoogleGenAI(): GoogleGenAI | null {
    if (aiInstance) return aiInstance;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;

    aiInstance = new GoogleGenAI({ apiKey });
    return aiInstance;
}
