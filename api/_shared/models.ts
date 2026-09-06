// ── Models Premium (Raonament profund, codi, mates) ──────────────────────────
// Quota AI Studio: 5 RPM, 20 RPD, 250K TPM
const PREMIUM_MODELS = [
    'gemini-3.8-flash',
    'gemini-3.7-flash',
    'gemini-3.6-flash',
    'gemini-3.5-flash',
    'gemini-3-flash-preview',
    'gemini-2.5-flash',
];

// ── Models Lite (Ràpids, encaminadors semàntics, memòria, transcripció) ──────
// Quota AI Studio: 15 RPM, 500 RPD, 250K TPM
const LITE_MODELS = [
    'gemini-3.5-flash-lite',
    'gemini-3.1-flash-lite',
    'gemini-2.5-flash-lite',
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

// ── Models amb suport de Google Search (Quota AI Studio: 1.500 cerques/dia) ──
// Només la família Gemini 2.x suporta Google Search al pla gratuït (Gemini 3 té 0/0).
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
 * - Si cal cerca: ÚNICAMENT els models amb Google Search actiu (Gemini 2.5).
 * - Si no cal cerca: fa servir la llista estàndard (prioritzant Gemini 3 amb raonament profund).
 */
export function getChatModels(enableSearch: boolean): readonly string[] {
    return enableSearch ? SEARCH_MODELS : ALL_MODELS;
}

/**
 * Models multimodals òptims per a la transcripció d'àudio (MicButton).
 * Prioritza models Lite per velocitat i quota de 500 RPD, amb fallback a Flash.
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

/**
 * Pressupost de tokens aproximat per a la família Gemini 2.x,
 * que no suporta l'enum thinkingLevel sinó thinkingBudget (nombre de tokens).
 */
const GEMINI_2_BUDGET_MAP: Record<Exclude<ThinkingLevelOption, 'auto'>, number> = {
    low: 1024,
    medium: 8192,
    high: 24576,
};

/**
 * Configura els paràmetres de 'thinking' respectant les diferències entre
 * les generacions de Gemini (2.x vs 3.x).
 */
export interface ThinkingStreamConfig {
    thinkingConfig?: {
        includeThoughts?: boolean;
        thinkingBudget?: number;
        thinkingLevel?: 'minimal' | 'low' | 'medium' | 'high';
    };
    [key: string]: unknown;
}

export function applyThinkingConfig(
    streamConfig: ThinkingStreamConfig,
    modelName: string,
    level: ThinkingLevelOption = 'auto'
): void {
    if (!THINKING_MODELS.has(modelName)) {
        return;
    }

    // Gemini 3.x (ex: gemini-3.8-flash, gemini-3.7-flash, etc.)
    if (modelName.startsWith('gemini-3')) {
        streamConfig.thinkingConfig = {
            includeThoughts: true,
            ...(level !== 'auto' ? { thinkingLevel: level } : {})
        };
        return;
    }

    // Gemini 2.x (ex: gemini-2.5-flash, etc.)
    if (modelName.startsWith('gemini-2')) {
        const budget = level !== 'auto' ? GEMINI_2_BUDGET_MAP[level] : undefined;
        streamConfig.thinkingConfig = {
            includeThoughts: true,
            ...(budget !== undefined ? { thinkingBudget: budget } : {})
        };
        return;
    }

    // Fallback genèric
    streamConfig.thinkingConfig = { includeThoughts: true };
}