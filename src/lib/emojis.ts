const emojiModules = import.meta.glob('../assets/emojis/*.{png,PNG,webp,jpg}', { eager: true, query: '?url', import: 'default' });

export const CUSTOM_EMOJIS: Record<string, string> = {};

for (const path in emojiModules) {
    const name = path.split('/').pop()?.split('.')[0];
    if (name) {
        CUSTOM_EMOJIS[name] = emojiModules[path] as string;
    }
}

export const renderEmojis = (text: string) => {
    if (!text) return text;
    // Replace :EmojiName: with <img> tag
    return text.replace(/:([a-zA-Z0-9_]+):/g, (match, name) => {
        if (CUSTOM_EMOJIS[name]) {
            return `<img src="${CUSTOM_EMOJIS[name]}" alt="${name}" class="inline-block w-6 h-6 align-middle mx-0.5 object-contain" />`;
        }
        return match;
    });
};
