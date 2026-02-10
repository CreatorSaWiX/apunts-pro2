
export type LanguageColors = "blue" | "green" | "red" | "purple";

export interface Language {
    name: string;
    color: LanguageColors;
}

export const languageNames = {
    cpp: {
        name: "C++",
        color: "blue"
    },
    py: {
        name: "Python",
        color: "green"
    }
} as const satisfies Record<string, Language>;

export function isLanguageName(s: any): s is keyof typeof languageNames {
    return s in languageNames;
}