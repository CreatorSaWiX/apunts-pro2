export interface TopicDefinition {
    id: string;
    title: string;
    description?: string;
    problems: { id: string; title: string }[];
}

export const courseStructure: TopicDefinition[] = [
    {
        id: "tema-1",
        title: "Tema 1: Iteracions 1 (Simulació)",
        description: "Exercicis bàsics d'iteracions i bucles extrets de PRO1 per a pràctica.",
        problems: [
            { id: "P37500", title: "Primers nombres" },
            { id: "P59539", title: "Nombres harmònics (1)" },
            { id: "P59875", title: "Cap avall" },
            { id: "P97969", title: "Comptant as (1)" },
            { id: "P97156", title: "Nombres en un interval" },
            { id: "P28754", title: "Número del revés en binari" },
            { id: "P60816", title: "Número del revés en hexadecimal" },
            { id: "P55622", title: "Nombre de dígits (1)" },
            { id: "P74398", title: "Número de cifras 1" },
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
    },
    {
        id: "tema-5",
        title: "Tema 5: Arbres Generals",
        description: "Estructures arborescents no lineals.",
        problems: []
    },
    {
        id: "tema-6",
        title: "Tema 6: Arbres Binaris",
        description: "Propietats i recorreguts d'arbres binaris.",
        problems: []
    },
    {
        id: "parcial-pro2",
        title: "Parcial PRO2",
        description: "Recull d'exàmens parcials i exercicis de preparació.",
        problems: []
    },
    {
        id: "tema-7",
        title: "Tema 7: Cues de Prioritat i Heaps",
        description: "Implementació i ús de cues de prioritat.",
        problems: []
    },
    {
        id: "tema-8",
        title: "Tema 8: Diccionaris i ABB",
        description: "Arbres Binaris de Cerca i la seva aplicació en diccionaris.",
        problems: []
    },
    {
        id: "tema-9",
        title: "Tema 9: Cerca i Ordenació",
        description: "Algorismes fonamentals de cerca i ordenació.",
        problems: []
    },
    {
        id: "tema-10",
        title: "Tema 10: Grafs",
        description: "Introducció als grafs i els seus algorismes bàsics.",
        problems: []
    },
    {
        id: "tema-11",
        title: "Tema 11: Disseny d'Algorismes",
        description: "Estratègies avançades: Divide & Conquer, Greedy...",
        problems: []
    },
    {
        id: "examens-finals",
        title: "Exàmens Finals",
        description: "Recull d'exàmens finals d'anys anteriors.",
        problems: []
    }
];
