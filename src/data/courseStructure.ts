export interface TopicDefinition {
    id: string;
    title: string;
    description?: string;
    problems: { id: string; title: string }[];
}

export const courseStructure: TopicDefinition[] = [
    {
        id: "tema-1", // Should match your existing IDs logic
        title: "Tema 1: Iteracions 1 (Simulació)",
        description: "Exercicis bàsics d'iteracions i bucles extrets de PRO1 per a pràctica.",
        problems: [
            { id: "P37500", title: "Primers nombres" },
            { id: "P59539", title: "Nombres harmònics (1)" },
            { id: "P59875", title: "Cap avall" },
            { id: "P97969", title: "Comptant as (1)" },
            { id: "P97156", title: "Nombres en un interval" }, // Títol deduït o genèric si no és exacte
            { id: "P28754", title: "Número del revés en binari" },
            { id: "P60816", title: "Número del revés en hexadecimal" },
            { id: "P55622", title: "Nombre de dígits (1)" },
            { id: "P74398", title: "Número de cifras 1" }, // Jutge title likely "Nombre de xifres (1)"
            { id: "P50327", title: "Número del revés" },
            { id: "X50286", title: "Quàntes hola?" },
            { id: "P39057", title: "Càlcul d'àrees" },
            { id: "P67723", title: "Màxim comú divisor" },
            { id: "P29448", title: "Dates correctes" },
            { id: "P85370", title: "Interessos (1)" }
        ]
    },
    {
        id: "tema-2",
        title: "Tema 2: Recursivitat",
        description: "Disseny d'algorismes recursius i anàlisi de complexitat.",
        problems: []
    },
    {
        id: "tema-3",
        title: "Tema 3: Estructures de Dades Lineals",
        description: "Piles, cues i llistes.",
        problems: []
    },
    {
        id: "tema-4",
        title: "Tema 4: Arbres",
        description: "Arbres binaris, recorreguts i arbres generals.",
        problems: []
    }
];
