const emojiModules = import.meta.glob('../assets/emojis/*.{png,PNG,webp,jpg}', { eager: true, query: '?url', import: 'default' });

export const CUSTOM_EMOJIS: Record<string, string> = {};
const LOWERCASE_EMOJIS: Record<string, string> = {};

for (const path in emojiModules) {
    const name = path.split('/').pop()?.split('.')[0];
    if (name) {
        const url = emojiModules[path] as string;
        CUSTOM_EMOJIS[name] = url;
        LOWERCASE_EMOJIS[name.toLowerCase()] = url;
        LOWERCASE_EMOJIS[name.toLowerCase().replace(/[\s_-]+/g, '')] = url;
    }
}

/**
 * Resolves an emoji name to its URL case-insensitively, handling spaces, underscores and hyphens.
 */
export const getCustomEmojiUrl = (name: string): string | undefined => {
    if (!name) return undefined;
    const trimmed = name.trim();
    if (CUSTOM_EMOJIS[trimmed]) return CUSTOM_EMOJIS[trimmed];
    const lower = trimmed.toLowerCase();
    if (LOWERCASE_EMOJIS[lower]) return LOWERCASE_EMOJIS[lower];
    const normalized = lower.replace(/[\s_-]+/g, '');
    return LOWERCASE_EMOJIS[normalized];
};

export const renderEmojis = (text: string) => {
    if (!text) return text;
    // Replace :EmojiName: with <img> tag (supports case-insensitivity, underscores, hyphens, and spaces)
    return text.replace(/:([a-zA-Z0-9_\-\s]+?):/g, (match, rawName) => {
        const url = getCustomEmojiUrl(rawName);
        if (url) {
            return `<img src="${url}" alt="${rawName.trim()}" class="inline-block w-[1.25em] h-[1.25em] align-[-0.2em] mx-0.5 object-contain" loading="lazy" />`;
        }
        return match;
    });
};

