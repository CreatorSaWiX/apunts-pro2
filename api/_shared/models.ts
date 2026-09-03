const PREMIUM_MODELS = [
    'gemini-3.8-flash',
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

const ALL_MODELS = [...PREMIUM_MODELS, ...LITE_MODELS];

// Models que suporten Thinking (Raonament intern previ)
const THINKING_MODELS = new Set([
    'gemini-3.8-flash',
    'gemini-3.7-flash',
    'gemini-3.6-flash',
    'gemini-3.5-flash',
    'gemini-3-flash-preview',
    'gemini-2.5-flash'
]);

/**
 * RPM: -/5, RPD: -/20, TPM: -/250K
 */
export function getLoadBalancedModels(): readonly string[] {
    return ALL_MODELS;
}

/**
 * RPM: -/15, RPD: -/500, TPM: -/250K
 */
export function getLiteModels(): readonly string[] {
    return LITE_MODELS;
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
