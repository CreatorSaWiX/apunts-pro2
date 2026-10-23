// ── Models Premium (Raonament profund, codi, mates) ──────────────────────────
// Nota: S'han eliminat gemini-3.7-flash i gemini-3.5-flash perquè estan deprecats
// i l'API de Google els redirigeix automàticament a 3.8-flash i 3.6-flash.
const PREMIUM_MODELS = [
    'gemini-3.8-flash',
    'gemini-3.6-flash',
    'gemini-2.5-flash',
];

// ── Models Lite (Ràpids, encaminadors semàntics, memòria, transcripció) ──────
const LITE_MODELS = [
    'gemini-3.5-flash-lite',
    'gemini-3.1-flash-lite',
    'gemini-2.5-flash-lite',
];

// ── Ordre per a salutacions i respostes instantànies (< 1s) ──────────────────
const FAST_CHAT_MODELS = [
    'gemini-2.5-flash',
    'gemini-3.6-flash',
    'gemini-3.5-flash-lite',
    'gemini-2.5-flash-lite',
    'gemini-3.8-flash',
];

const ALL_MODELS = [...PREMIUM_MODELS, ...LITE_MODELS];
const THINKING_MODELS = new Set(PREMIUM_MODELS);

/**
 * Retorna tots els models disponibles per a fallback genèric.
 */
export function getLoadBalancedModels(): readonly string[] {
    return ALL_MODELS;
}

/**
 * Retorna els models d'alta velocitat i quota generosa (15 RPM / 500 RPD).
 */
export function getLiteModels(): readonly string[] {
    return LITE_MODELS;
}

// ── Models amb suport de Google Search ───────────────────────────────────────
const SEARCH_MODELS = [
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
];

/**
 * Comprova si un model suporta l'eina de Google Search Grounding.
 */
export function supportsGoogleSearch(modelName: string): boolean {
    return SEARCH_MODELS.includes(modelName);
}

/**
 * Retorna els models per al xat:
 * - Si és un missatge curt/salutació (fastPath): prioritzem resposta sub-segon.
 * - Si cal cerca: ÚNICAMENT els models amb Google Search actiu (Gemini 2.5).
 * - Si no cal cerca: fa servir la llista estàndard sense àlies deprecats.
 */
export function getChatModels(enableSearch: boolean, fastPath = false): readonly string[] {
    if (enableSearch) return SEARCH_MODELS;
    if (fastPath) return FAST_CHAT_MODELS;
    return ALL_MODELS;
}

/**
 * Models multimodals òptims per a la transcripció d'àudio (MicButton).
 */
export function getTranscribeModels(): readonly string[] {
    return [
        'gemini-3.5-flash-lite',
        'gemini-3.1-flash-lite',
        'gemini-2.5-flash-lite',
        'gemini-2.5-flash',
    ];
}

export type ThinkingLevelOption = 'auto' | 'low' | 'medium' | 'high';

const GEMINI_2_BUDGET_MAP: Record<Exclude<ThinkingLevelOption, 'auto'>, number> = {
    low: 1024,
    medium: 8192,
    high: 24576,
};

export interface ThinkingStreamConfig {
    thinkingConfig?: {
        includeThoughts?: boolean;
        thinkingBudget?: number;
        thinkingLevel?: 'minimal' | 'low' | 'medium' | 'high';
    };
    [key: string]: unknown;
}

const COMPLEX_REASONING_REGEX = /\b(demostra|calcula|resol|deriva|integra|programa|implementa|codi|algorisme|complexitat|recursi|inducci[oó]|teorema|matriu|sistema|probabilitat|optimitza|debug|error)\b/i;

/**
 * Configura els paràmetres de 'thinking' respectant les diferències entre
 * les generacions de Gemini (2.x vs 3.x) i evitant raonaments pesats en missatges simples.
 */
export function applyThinkingConfig(
    streamConfig: ThinkingStreamConfig,
    modelName: string,
    level: ThinkingLevelOption = 'auto',
    options?: { disableThinking?: boolean; userMessage?: string }
): void {
    // 1. Mode instantani (salutacions o converses trivials): desactivar pensament
    if (options?.disableThinking) {
        if (modelName.startsWith('gemini-2')) {
            streamConfig.thinkingConfig = { includeThoughts: false, thinkingBudget: 0 };
        } else if (modelName === 'gemini-3.8-flash') {
            // gemini-3.8-flash no suporta 'minimal', el seu mínim és 'low'
            streamConfig.thinkingConfig = { includeThoughts: false, thinkingLevel: 'low' };
        } else if (modelName.startsWith('gemini-3')) {
            streamConfig.thinkingConfig = { includeThoughts: false, thinkingLevel: 'minimal' };
        }
        return;
    }

    if (!THINKING_MODELS.has(modelName)) {
        if (modelName.startsWith('gemini-3')) {
            streamConfig.thinkingConfig = { includeThoughts: false, thinkingLevel: 'minimal' };
        } else if (modelName.startsWith('gemini-2')) {
            streamConfig.thinkingConfig = { includeThoughts: false, thinkingBudget: 0 };
        }
        return;
    }

    // Determinar el nivell òptim quan l'usuari ho té en 'auto'
    const isComplexQuery = options?.userMessage ? COMPLEX_REASONING_REGEX.test(options.userMessage) : false;

    // 2. Família Gemini 3.x (gemini-3.8-flash, gemini-3.6-flash)
    if (modelName.startsWith('gemini-3')) {
        const effectiveLevel: 'low' | 'medium' | 'high' =
            level !== 'auto'
                ? level
                : (isComplexQuery ? 'medium' : 'low');

        streamConfig.thinkingConfig = {
            includeThoughts: true,
            thinkingLevel: effectiveLevel,
        };
        return;
    }

    // 3. Família Gemini 2.x (gemini-2.5-flash)
    if (modelName.startsWith('gemini-2')) {
        const budget = level !== 'auto'
            ? GEMINI_2_BUDGET_MAP[level]
            : (isComplexQuery ? GEMINI_2_BUDGET_MAP.medium : GEMINI_2_BUDGET_MAP.low);

        streamConfig.thinkingConfig = {
            includeThoughts: true,
            thinkingBudget: budget,
        };
        return;
    }

    streamConfig.thinkingConfig = { includeThoughts: true };
}