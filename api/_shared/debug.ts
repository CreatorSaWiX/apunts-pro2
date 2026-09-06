/**
 * Utilitats de depuració per a les crides a Google Gemini AI.
 * Permet inspeccionar el contingut exacte dels prompts, system instructions,
 * historial i configuracions enviades als models directament a la terminal.
 */

export interface GeminiDebugPayload {
    endpoint: string;
    model?: string;
    systemInstruction?: string;
    contents?: unknown;
    tools?: unknown;
    config?: Record<string, unknown>;
    extra?: Record<string, unknown>;
}

// Estils ANSI per a la terminal
const C = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
    cyan: '\x1b[36m',
    yellow: '\x1b[33m',
    green: '\x1b[32m',
    magenta: '\x1b[35m',
    blue: '\x1b[34m',
    gray: '\x1b[90m',
    bgBlue: '\x1b[44m',
    white: '\x1b[37m',
};

/**
 * Comprova si el mode depuració de prompts està actiu.
 * Actiu per defecte en entorn local / desenvolupament a menys que DEBUG_PROMPTS='false'.
 */
export function isPromptDebugEnabled(): boolean {
    if (process.env.DEBUG_PROMPTS === 'false') return false;
    if (process.env.DEBUG_PROMPTS === 'true') return true;
    return process.env.NODE_ENV !== 'production' || !process.env.VERCEL;
}

/**
 * Sanititza els continguts per evitar imprimir cadenes massives en base64
 * d'imatges o PDFs que puguin bloquejar o saturar la terminal.
 */
function sanitizeForLog(data: unknown): unknown {
    if (data === null || data === undefined) return data;

    if (typeof data === 'string') {
        // Si és un base64 molt llarg aïllat
        if (data.length > 500 && /^[A-Za-z0-9+/=]+$/.test(data.substring(0, 100))) {
            return `[Base64 Data: ${data.length} caràcters (~${Math.round(data.length * 0.75 / 1024)} KB)]`;
        }
        return data;
    }

    if (Array.isArray(data)) {
        return data.map(item => sanitizeForLog(item));
    }

    if (typeof data === 'object') {
        const copy: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
            if (key === 'data' && typeof value === 'string' && value.length > 100) {
                copy[key] = `[Base64 Data: ${value.length} caràcters (~${Math.round(value.length * 0.75 / 1024)} KB)]`;
            } else if (key === 'inlineData' && value && typeof value === 'object') {
                const inline = value as { mimeType?: string; data?: string };
                copy[key] = {
                    mimeType: inline.mimeType,
                    data: inline.data ? `[Base64 ${inline.mimeType || 'fitxer'}: ${inline.data.length} caràcters]` : undefined
                };
            } else {
                copy[key] = sanitizeForLog(value);
            }
        }
        return copy;
    }

    return data;
}

/**
 * Formata els continguts (parts o historial de missatges) de manera llegible per humans.
 */
function formatContentsForLog(contents: unknown): string {
    if (!contents) return `${C.gray}(buit)${C.reset}`;

    // Si és text pla
    if (typeof contents === 'string') {
        return contents;
    }

    // Si és una llista de missatges estructurats [{ role, parts }, ...]
    if (Array.isArray(contents)) {
        const lines: string[] = [];
        for (let i = 0; i < contents.length; i++) {
            const item = contents[i];
            if (item && typeof item === 'object' && 'role' in item && 'parts' in item) {
                const role = String(item.role).toUpperCase();
                const roleColor = role === 'USER' ? C.green : C.magenta;
                lines.push(`${roleColor}${C.bold}[${role}]${C.reset}`);

                const parts = Array.isArray(item.parts) ? item.parts : [item.parts];
                for (const part of parts) {
                    if (typeof part === 'string') {
                        lines.push(`  ${part}`);
                    } else if (part && typeof part === 'object') {
                        if ('text' in part && part.text) {
                            lines.push(`  ${part.text}`);
                        }
                        if ('inlineData' in part && part.inlineData) {
                            const inline = part.inlineData as { mimeType?: string; data?: string };
                            const size = inline.data ? `${inline.data.length} bytes base64` : '';
                            lines.push(`  ${C.yellow}[Adjunt: ${inline.mimeType || 'desconegut'} (${size})]${C.reset}`);
                        }
                    }
                }
            } else {
                // Altres tipus d'array
                lines.push(JSON.stringify(sanitizeForLog(item), null, 2));
            }
        }
        return lines.join('\n');
    }

    return JSON.stringify(sanitizeForLog(contents), null, 2);
}

/**
 * Imprimeix a la terminal un bloc visual clar i ordenat amb tota la informació
 * del prompt enviat a Gemini.
 */
export function logGeminiPrompt(payload: GeminiDebugPayload): void {
    if (!isPromptDebugEnabled()) return;

    const {
        endpoint,
        model = 'desconegut',
        systemInstruction,
        contents,
        tools,
        config,
        extra
    } = payload;

    const time = new Date().toLocaleTimeString();
    const border = '═'.repeat(66);
    const divider = '─'.repeat(66);

    console.log(`\n${C.cyan}╔${border}╗${C.reset}`);
    console.log(`${C.cyan}║ GEMINI AI DEBUG ${C.dim}| ${time}${C.reset}`);
    console.log(`${C.cyan}║ Endpoint: ${C.bold}${C.white}${endpoint}${C.reset}${C.cyan} | Model: ${C.bold}${C.yellow}${model}${C.reset}`);
    console.log(`${C.cyan}╠${divider}╣${C.reset}`);

    // Metadades addicionals
    if (extra && Object.keys(extra).length > 0) {
        console.log(`${C.blue}${C.bold}🔍 METADADES:${C.reset}`);
        for (const [k, v] of Object.entries(extra)) {
            console.log(`  ${C.dim}${k}:${C.reset} ${typeof v === 'object' ? JSON.stringify(v) : v}`);
        }
        console.log(`${C.cyan}╠${divider}╣${C.reset}`);
    }

    // System Instruction
    if (systemInstruction) {
        console.log(`${C.magenta}${C.bold}SYSTEM INSTRUCTION (${systemInstruction.length} caràcters):${C.reset}`);
        console.log(systemInstruction.trim());
        console.log(`${C.cyan}╠${divider}╣${C.reset}`);
    }

    // Continguts / Missatges / Prompt de l'usuari
    console.log(`${C.green}${C.bold}CONTENTS (PROMPT / HISTORIAL):${C.reset}`);
    console.log(formatContentsForLog(contents));

    // Eines / Tools
    if (tools) {
        console.log(`${C.cyan}╠${divider}╣${C.reset}`);
        console.log(`${C.yellow}${C.bold}TOOLS (EINES):${C.reset}`);
        console.log(JSON.stringify(sanitizeForLog(tools), null, 2));
    }

    // Config addicional
    if (config) {
        const filteredConfig = { ...config };
        delete filteredConfig.systemInstruction;
        delete filteredConfig.tools;

        if (Object.keys(filteredConfig).length > 0) {
            console.log(`${C.cyan}╠${divider}╣${C.reset}`);
            console.log(`${C.blue}${C.bold}CONFIG:${C.reset}`);
            console.log(JSON.stringify(filteredConfig, null, 2));
        }
    }

    console.log(`${C.cyan}╚${border}╝\n${C.reset}`);
}
