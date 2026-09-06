import fs from 'node:fs';
import path from 'node:path';

/**
 * Utilitats de depuració per a les crides a Google Gemini AI.
 * Permet inspeccionar el contingut exacte dels prompts, system instructions,
 * historial i configuracions enviades als models directament en un arxiu net.
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
 * Formata els continguts de manera neta per a l'arxiu .log (sense caràcters ANSI d'escapament).
 */
function formatContentsForLogPlain(contents: unknown): string {
    if (!contents) return '(buit)';

    if (typeof contents === 'string') {
        return contents;
    }

    if (Array.isArray(contents)) {
        const lines: string[] = [];
        for (let i = 0; i < contents.length; i++) {
            const item = contents[i];
            if (item && typeof item === 'object' && 'role' in item && 'parts' in item) {
                const role = String(item.role).toUpperCase();
                lines.push(`[${role}]`);

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
                            lines.push(`  [Adjunt: ${inline.mimeType || 'desconegut'} (${size})]`);
                        }
                    }
                }
            } else {
                lines.push(JSON.stringify(sanitizeForLog(item), null, 2));
            }
        }
        return lines.join('\n');
    }

    return JSON.stringify(sanitizeForLog(contents), null, 2);
}

/**
 * Desa a un fitxer .log net tot el prompt enviat a Gemini (sobrescrivint l'anterior)
 * i mostra únicament un resum compacte a la terminal per no saturar el buffer.
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

    // Construeix el text complet i net sense codis ANSI per a l'arxiu
    const logLines: string[] = [
        border,
        `GEMINI AI DEBUG LOG | ${time}`,
        `Endpoint: ${endpoint} | Model: ${model}`,
        border,
        ''
    ];

    // Metadades addicionals
    if (extra && Object.keys(extra).length > 0) {
        logLines.push('METADADES:');
        for (const [k, v] of Object.entries(extra)) {
            logLines.push(`  ${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`);
        }
        logLines.push('', divider, '');
    }

    // System Instruction
    if (systemInstruction) {
        logLines.push(`SYSTEM INSTRUCTION (${systemInstruction.length} caràcters):`);
        logLines.push(systemInstruction.trim());
        logLines.push('', divider, '');
    }

    // Continguts / Missatges / Prompt de l'usuari
    logLines.push('CONTENTS (PROMPT / HISTORIAL):');
    logLines.push(formatContentsForLogPlain(contents));
    logLines.push('');

    // Eines / Tools
    if (tools) {
        logLines.push(divider, 'TOOLS (EINES):');
        logLines.push(JSON.stringify(sanitizeForLog(tools), null, 2));
        logLines.push('');
    }

    // Config addicional
    if (config) {
        const filteredConfig = { ...config };
        delete filteredConfig.systemInstruction;
        delete filteredConfig.tools;

        if (Object.keys(filteredConfig).length > 0) {
            logLines.push(divider, 'CONFIG:');
            logLines.push(JSON.stringify(filteredConfig, null, 2));
            logLines.push('');
        }
    }

    logLines.push(border);
    const fullLogText = logLines.join('\n');

    // Escriure a l'arxiu net (sobrescriu sempre el fitxer anterior perquè quedi net)
    const logFileName = 'gemini-prompt.log';
    try {
        const logFilePath = path.resolve(process.cwd(), logFileName);
        fs.writeFileSync(logFilePath, fullLogText, 'utf-8');

        // Si és un sub-endpoint específic (ex: chat, quiz, roadmap), en desem també una còpia dedicada
        const safeEndpoint = endpoint.replace(/[^a-zA-Z0-9_-]/g, '_');
        if (safeEndpoint && safeEndpoint !== 'prompt') {
            fs.writeFileSync(path.resolve(process.cwd(), `gemini-${safeEndpoint}.log`), fullLogText, 'utf-8');
        }
    } catch (err) {
        console.error('[DEBUG] No s\'ha pogut desar el log de Gemini:', err);
    }

    // A la terminal, imprimim només un resum compacte per evitar inundar el buffer
    const kb = (Buffer.byteLength(fullLogText, 'utf8') / 1024).toFixed(1);
    console.log(`\n${C.cyan}╔${border}╗${C.reset}`);
    console.log(`${C.cyan}║ GEMINI AI DEBUG ${C.dim}| ${time}${C.reset}`);
    console.log(`${C.cyan}║ Endpoint: ${C.bold}${C.white}${endpoint}${C.reset}${C.cyan} | Model: ${C.bold}${C.yellow}${model}${C.reset}`);
    console.log(`${C.cyan}║ 📄 Log net desat a: ${C.bold}${C.green}${logFileName}${C.reset}${C.cyan} (${kb} KB)${C.reset}`);
    console.log(`${C.cyan}╚${border}╝\n${C.reset}`);
}
