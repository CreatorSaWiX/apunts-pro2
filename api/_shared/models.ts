/**
 * Shared AI Model configuration and Load Balancing.
 */

const PREMIUM_MODELS = [
    'gemini-3.7-flash',
    'gemini-3.6-flash',
    'gemini-3.5-flash',
    'gemini-3-flash-preview',
    'gemini-2.5-flash',
];

const LITE_MODELS = [
    'gemini-3.5-flash-lite',
    'gemini-3.1-flash-lite',
    'gemini-2.5-flash-lite',
];

// Models que suporten Thinking (Raonament intern previ)
const THINKING_MODELS = new Set([
    'gemini-3.7-flash', 
    'gemini-3.6-flash', 
    'gemini-3.5-flash', 
    'gemini-3-flash-preview', 
    'gemini-2.5-flash'
]);

/**
 * Retorna la llista de models en estricte ordre de qualitat (Cascada).
 * Això garanteix que tothom sempre intenta usar el millor model (3.7) primer,
 * i només salta als inferiors quan s'exhaureix la quota gratuïta.
 */
export function getLoadBalancedModels(): string[] {
    return [...PREMIUM_MODELS, ...LITE_MODELS];
}

/**
 * Per a generadors massius o de fons (com els Quizzes), retorna directament
 * els models Lite balancejats, ja que tenen molta més quota gratuïta (15 RPM / 500 RPD).
 */
export function getLiteModels(): string[] {
    return [...LITE_MODELS];
}

/**
 * Configura els paràmetres de 'thinking' de forma automàtica
 * si el model triat suporta aquesta funcionalitat.
 */
export interface ThinkingStreamConfig {
    thinkingConfig?: {
        includeThoughts: boolean;
        thinkingBudget?: number;
    };
    [key: string]: unknown;
}

export function applyThinkingConfig(streamConfig: ThinkingStreamConfig, modelName: string): void {
    if (THINKING_MODELS.has(modelName)) {
        streamConfig.thinkingConfig = { includeThoughts: true };
        
        if (modelName.includes('2.5')) {
            streamConfig.thinkingConfig.thinkingBudget = 32768; // Màxim permès per Gemini 2.5
        } else {
            // Per Gemini 3.0 i superiors
            // Li donem més marge perquè tenen arquitectures més potents
            streamConfig.thinkingConfig.thinkingBudget = 65536; 
        }
    }
}
