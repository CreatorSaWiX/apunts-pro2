export interface TopicDefinition {
    id: string;
    title: string;
    description?: string;
    problems: { id: string; title: string }[];
}

export const courseStructure: TopicDefinition[] = [
    // --- PRO2 ---
    {
        id: "pro2-tema-1",
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
        id: "pro2-tema-2",
        title: "Tema 2: Recursivitat",
        description: "Disseny d'algorismes recursius i anàlisi de complexitat.",
        problems: []
    },
    {
        id: "pro2-tema-3",
        title: "Tema 3: Estructures de Dades Lineals",
        description: "Piles, cues i llistes.",
        problems: []
    },
    {
        id: "pro2-tema-4",
        title: "Tema 4: Arbres",
        description: "Arbres binaris, recorreguts i arbres generals.",
        problems: []
    },
    {
        id: "pro2-tema-5",
        title: "Tema 5: Arbres Generals",
        description: "Estructures arborescents no lineals.",
        problems: []
    },
    {
        id: "pro2-tema-6",
        title: "Tema 6: Arbres Binaris",
        description: "Propietats i recorreguts d'arbres binaris.",
        problems: []
    },
    {
        id: "pro2-parcial-pro2",
        title: "Parcial PRO2",
        description: "Recull d'exàmens parcials i exercicis de preparació.",
        problems: []
    },
    {
        id: "pro2-tema-7",
        title: "Tema 7: Cues de Prioritat i Heaps",
        description: "Implementació i ús de cues de prioritat.",
        problems: []
    },
    {
        id: "pro2-tema-8",
        title: "Tema 8: Diccionaris i ABB",
        description: "Arbres Binaris de Cerca i la seva aplicació en diccionaris.",
        problems: []
    },
    {
        id: "pro2-tema-9",
        title: "Tema 9: Cerca i Ordenació",
        description: "Algorismes fonamentals de cerca i ordenació.",
        problems: []
    },
    {
        id: "pro2-tema-10",
        title: "Tema 10: Grafs",
        description: "Introducció als grafs i els seus algorismes bàsics.",
        problems: []
    },
    {
        id: "pro2-tema-11",
        title: "Tema 11: Disseny d'Algorismes",
        description: "Estratègies avançades: Divide & Conquer, Greedy...",
        problems: []
    },
    {
        id: "pro2-examens-finals",
        title: "Exàmens Finals",
        description: "Recull d'exàmens finals d'anys anteriors.",
        problems: []
    },

    // --- M1 (Matemàtica Discreta) ---
    {
        id: "m1-tema-1",
        title: "Tema 1: Conceptes bàsics de grafs",
        description: "Introducció a la teoria de grafs: vèrtexs, arestes, graus i representacions.",
        problems: [
            { id: "M1-T1-Ex1.1", title: "Exercici 1.1: Famílies de Grafs" },
            { id: "M1-T1-Ex1.2", title: "Exercici 1.2: Construcció" },
            { id: "M1-T1-Ex1.3", title: "Exercici 1.3: Regularitat" },
            { id: "M1-T1-Ex1.4", title: "Exercici 1.4: Mides" },
            { id: "M1-T1-Ex1.5", title: "Exercici 1.5: Subgrafs" },
            { id: "M1-T1-Ex1.6", title: "Exercici 1.6: Induïts" },
            { id: "M1-T1-Ex1.7", title: "Exercici 1.7: Operacions" },
            { id: "M1-T1-Ex1.8", title: "Exercici 1.8: Ordre i Mida" },
            { id: "M1-T1-Ex1.9", title: "Exercici 1.9: Complementaris" },
            { id: "M1-T1-Ex1.10", title: "Exercici 1.10: Unió i Producte" },
            { id: "M1-T1-Ex1.11", title: "Exercici 1.11: Propietats" },
            { id: "M1-T1-Ex1.12", title: "Exercici 1.12: Teoria" },
            { id: "M1-T1-Ex1.13", title: "Exercici 1.13: Grafs d'ordre 3" },
            { id: "M1-T1-Ex1.14", title: "Exercici 1.14: Comptant Grafs" },
            { id: "M1-T1-Ex1.15", title: "Exercici 1.15: Seqüències de Graus" },
            { id: "M1-T1-Ex1.16", title: "Exercici 1.16: Regularitat i Paritat" },
            { id: "M1-T1-Ex1.17", title: "Exercici 1.17: Bipartit Regular" },
            { id: "M1-T1-Ex1.18", title: "Exercici 1.18: Fita de la Mida" },
            { id: "M1-T1-Ex1.19", title: "Exercici 1.19: Graus i Ordre" },
            { id: "M1-T1-Ex1.20", title: "Exercici 1.20: Festa i Salutacions" },
            { id: "M1-T1-Ex1.21", title: "Exercici 1.21: Isomorfismes (Ordre 4, Mida 2)" },
            { id: "M1-T1-Ex1.22", title: "Exercici 1.22: Subgrafs i Isomorfia" },
            { id: "M1-T1-Ex1.23", title: "Exercici 1.23: Classes d'Isomorfia" },
            { id: "M1-T1-Ex1.24", title: "Exercici 1.24: Isomorfismes de Complementaris" },
            { id: "M1-T1-Ex1.25", title: "Exercici 1.25: Comptants Grafs No Isomorfs" },
            { id: "M1-T1-Ex1.26", title: "Exercici 1.26: Grafs Autocomplementaris (Ordres Petits)" },
            { id: "M1-T1-Ex1.27", title: "Exercici 1.27: Grafs Autocomplementaris (General)" },
            { id: "M1-T1-Ex1.28", title: "Exercici 1.28: Cicles en Grafs Grans" }
        ]
    },
    {
        id: "m1-tema-2",
        title: "Tema 2: Recorreguts i Connexió",
        description: "DFS, BFS, components connexos i distàncies.",
        problems: [
            { id: "M1-T2-Ex2.1", title: "Exercici 2.1: Trobar Camins i Cicles" },
            { id: "M1-T2-Ex2.2", title: "Exercici 2.2: Camí en Graf de Grau Mínim" },
            { id: "M1-T2-Ex2.3", title: "Exercici 2.3: Components Connexos i Vèrtexs" },
            { id: "M1-T2-Ex2.4", title: "Exercici 2.4: Algorisme DFS" },
            { id: "M1-T2-Ex2.5", title: "Exercici 2.5: Dos Vèrtexs Senars connectats per un Camí" },
            { id: "M1-T2-Ex2.6", title: "Exercici 2.6: Mida en Dos Components Complets" },
            { id: "M1-T2-Ex2.7", title: "Exercici 2.7: Extrems de Mida segons Components Connexos i Arbres" },
            { id: "M1-T2-Ex2.8", title: "Exercici 2.8: Construcció Fita Superior (Mida i Connexió)" }
        ]
    },
    {
        id: "m1-tema-3",
        title: "Tema 3: Grafs Eulerians i Hamiltonians",
        description: "Camins i cicles eulerians i hamiltonians.",
        problems: []
    }
];
