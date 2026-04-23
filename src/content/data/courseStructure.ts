export interface TopicDefinition {
    id: string;
    title: string;
    title_es?: string;
    description?: string;
    description_es?: string;
    problems: { id: string; title: string; title_es?: string }[];
}

export const courseStructure: TopicDefinition[] = [
    // --- PRO2 ---
    {
        id: "pro2-tema-1",
        title: "Tema 1: Iteracions 1 (Simulació)",
        description: "Exercicis bàsics d'iteracions i bucles extrets de PRO1 per a pràctica.",
        problems: []
    },
    {
        id: "pro2-tema-2",
        title: "Tema 2: Recursivitat",
        description: "Disseny d'algorismes recursius i anàlisi de complexitat.",
        problems: []
    },
    {
        id: "pro2-tema-3",
        title: "Tema 3: Llistes i iteracions",
        description: "Exercicis de jutge",
        problems: [
            { id: "W84371", title: "Ajuntar Paraules" },
            { id: "U61590", title: "Paraula més llarga" },
            { id: "S92412", title: "Guanyadors" },
            { id: "T65668", title: "Don Camilo" },
            { id: "X88100", title: "Inserta per Ordre" },
            { id: "S54195", title: "Ordenació per Selecció amb Iteradors" },
            { id: "S97463", title: "Fusió de llistes ordenades" },
            { id: "T58713", title: "Intersecció de llistes ordenades" },
            { id: "S39735", title: "Operacions sobre una seqüència" },
            { id: "Y29996", title: "Matrius esparses (1): conversió" },
            { id: "Y91345", title: "Matrius esparses (2): transposició" },
            { id: "T33423", title: "Matrius esparses (3): suma" }
        ]
    },
    {
        id: "pro2-lab-1",
        title: "Lab 1: Struct a class",
        description: "Sessió de laboratori resolta. Salt a la programació orientada a objectes.",
        problems: []
    },
    {
        id: "pro2-lab-2",
        title: "Lab 2: Contenidors Lineals",
        description: "Sessió de laboratori resolta. Stacks i Queues (Piles i Cues).",
        problems: []
    },
    {
        id: "pro2-tema-4",
        title: "Tema 4: Arbres",
        description: "Arbres binaris, recorreguts i arbres generals.",
        problems: [
            { id: "S42599", title: "Alçada d'un arbre binari" },
            { id: "T93544", title: "Suma valors d'un arbre binari" },
            { id: "Z53201", title: "Cerca un valor en un arbre binari" },
            { id: "W72736", title: "Arbre binari de sumes" },
            { id: "Z17905", title: "Arbre binari de mides" },
            { id: "T78145", title: "Mirall d'un arbre binari" },
            { id: "U38461", title: "Avaluar expressions binàries (1)" },
            { id: "Z78925", title: "Avaluar expressions binàries amb variables" },
            { id: "V80619", title: "Podar un arbre binari" },
            { id: "U38261", title: "Podar un arbre binari sense repeticions" },
            { id: "W90730", title: "Ordenar un arbre binari per sumes de subarbres" },
            { id: "V22704", title: "Camí més llarg en un arbre binari" },
            { id: "T82960", title: "Arbre binari amb totes les fulles iguals" },
            { id: "X93918", title: "25P-Ex1: Arbre binari amb els valors dels nodes interns iguals" }
        ]
    },
    {
        id: "pro2-tema-5",
        title: "Tema 5: Cues de prioritat i arbres generals",
        description: "Exercicis de cues de prioritat (Heaps) i arbres generals.",
        problems: [
            { id: "X20428", title: "Ordena amb Heap" },
            { id: "Y13945", title: "K Més Grans" },
            { id: "T85801", title: "Paquets de Xarxa" },
            { id: "Z80280", title: "Alçada d'un arbre" },
            { id: "W23082", title: "Cerca un valor en un arbre" },
            { id: "V21234", title: "Arbre mirall" },
            { id: "Z82639", title: "Avaluar expressions Booleanes" },
            { id: "Z14339", title: "Imprimir expressions" },
            { id: "W37576", title: "Màxim en Finestra" },
            { id: "S84123", title: "Fusió de K Llistes Ordenades" }
        ]
    },
    {
        id: "pro2-tema-6",
        title: "Tema 6: Arbres de Cerca i Maps",
        description: "BSTs, diccionaris (maps) i conjunts (sets).",
        problems: [
            { id: "Z95513", title: "Divisió i Mòdul" },
            { id: "U77364", title: "Llista de Parelles" },
            { id: "V12327", title: "Mostra els valors d'un BST per ordre" },
            { id: "Y96513", title: "Mínim i màxim d'un BST" },
            { id: "W75159", title: "Cerca a un BST" },
            { id: "Y74034", title: "Inserció a un BST" },
            { id: "S50027", title: "Morse" },
            { id: "V81307", title: "Diccionari" },
            { id: "X34352", title: "Freqüència de paraules amb diccionaris" },
            { id: "Y23369", title: "Suma Fruites" },
            { id: "X79905", title: "Freqüència de paraules amb diccionaris (amb esborrat)" },
            { id: "V42348", title: "Ok Cupid" },
            { id: "X83904", title: "Activitats esportives (sets)" },
            { id: "X51146", title: "Activitats esportives ordenades (sets)" }
        ]
    },
    {
        id: "pro2-parcial-pro2",
        title: "Parcial PRO2",
        description: "Resum PRO2",
        problems: [
            { id: "X24468", title: "Índex de paraules" },
            { id: "V80480", title: "Anagrames" },
            { id: "Z49559", title: "Mateixos amics" },
            { id: "U20331", title: "Turistes" },
            { id: "U93469", title: "24T-Ex2: Treballs d'impressió repetits" },
            { id: "V55523", title: "24T-Ex3: Llistes iguals circularment" },
            { id: "W49269", title: "25P-Ex3: Casino" },
            { id: "Z99038", title: "Rànking de tennis (1)" },
            { id: "X14956", title: "K nombres més freqüents" },
            { id: "U14997", title: "Rànking de tennis (2)" },
            { id: "Y60287", title: "Anti Cross-Site Scripting" },
            { id: "Z84907", title: "Pàgina HTML Correcta" },
            { id: "W54048", title: "25P-Ex4: Corregeix Pàgines HTML" },
            { id: "V72123", title: "25P-Ex2: Unió de llistes ordenades" },
            { id: "W78388", title: "Round Robin" },
            { id: "X34719", title: "Scraper Bots" },
            { id: "X85340", title: "Subhasta" },
            { id: "U52362", title: "Guillem Tell" },
            { id: "S37830", title: "Concatena els valors d'un arbre binari de strings" },
            { id: "X93918", title: "25P-Ex1: Arbre binari amb els valors dels nodes interns iguals" },
            { id: "U38461", title: "Avaluar expressions binàries (1)" },
            { id: "Y97108", title: "Reemplaça els nodes d'un arbre binari a profunditat parell per la suma per sota" },
            { id: "T56798", title: "25T-Ex2: Arbre de Múltiples" },
            { id: "Z19994", title: "Mostra carpetes indentades" },
            { id: "T47104", title: "Arbre binari de graus de desequilibri" },
            { id: "Z78925", title: "Avaluar expressions binàries amb variables" },
            { id: "W90730", title: "Ordenar un arbre binari per sumes de subarbres" },
            { id: "V22704", title: "Camí més llarg en un arbre binari" },
            { id: "S81463", title: "25T-Ex1: Parentització Correcta" },
            { id: "W28242", title: "25T-Ex3: Avalua expressió general" },
            { id: "Y99091", title: "25T-Ex4: Números consecutius" },

            { id: "X31410", title: "24P-Ex1: Nombre de nodes amb valor estríctament major que el valor del seu node pare" },
            { id: "X65021", title: "24P-Ex2: Afegir els propis elements d'una llista al final i en ordre invers (Pro2)" },
            { id: "X31002", title: "24P-Ex3: Esborrar cada dos lletres consecutives iguals però una majúscula i l'altra minúscula" },
            { id: "X21572", title: "24P-Ex4: Seguiment de comptes en vermell" },
            { id: "X56934", title: "24P-Ex5: Arbre amb postordre" },

            { id: "X58333", title: "24T-Ex1: Màxima suma d'un camí descendent." },
            { id: "V40142", title: "24T-Ex4: Paraula en un arbre" },

            { id: "X12047", title: "23T-Ex1: Nombre de fulles d'un arbre" },
            { id: "X38065", title: "23T-Ex2: Nombre de persones amb monedes" },
            { id: "X30191", title: "23T-Ex3: Nombre d'expressions amb avaluació negativa" },
            { id: "X62454", title: "23T-Ex4: Canviar paréntesis i corxets de tancar per a produïr una seqüència ben parentitzada" }
        ]
    },
    {
        id: "pro2-tema-7",
        title: "Tema 7: Cues de Prioritat i Heaps",
        description: "Implementació i ús de cues de prioritat.",
        problems: []
    },
    {
        id: "pro2-tema-8",
        title: "Tema 8: Punters",
        description: "Gestió de memòria en C++, operadors, aliasing i gestió del 'heap'.",
        problems: [
            { id: "X94161", title: "Stack: Accedir segon element" },
            { id: "X72693", title: "Stack: Esborrar segon element" },
            { id: "X82586", title: "Stack: Intercanviar elements top" },
            { id: "X80037", title: "Stack: Sumar contingut altra pila" },
            { id: "X87185", title: "Stack: Esborrar element per valor" },
            { id: "X17005", title: "Queue: Moure primer a l'últim" },
            { id: "X80705", title: "Queue: Accés indexat" },
            { id: "X86445", title: "Queue: Multiplicar elements" }
        ]
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
            { id: "M1-T2-Ex2.8", title: "Exercici 2.8: Construcció Fita Superior (Mida i Connexió)" },
            { id: "M1-T2-Ex2.9", title: "Exercici 2.9: Vèrtexs de tall i arestes pont" },
            { id: "M1-T2-Ex2.10", title: "Exercici 2.10: Graf estrella adherent G+z" },
            { id: "M1-T2-Ex2.11", title: "Exercici 2.11: Graf regular més petit amb pont" },
            { id: "M1-T2-Ex2.12", title: "Exercici 2.12: Ponts i Talls dependents als regulars" },
            { id: "M1-T2-Ex2.13", title: "Exercici 2.13: Propietats del Complementari i els talls" },
            { id: "M1-T2-Ex2.14", title: "Exercici 2.14: Distàncies amb algorisme BFS" },
            { id: "M1-T2-Ex2.15", title: "Exercici 2.15: Càlcul de Diàmetres" },
            { id: "M1-T2-Ex2.16", title: "Exercici 2.16: Impacte del tall al Diàmetre" },
            { id: "M1-T2-Ex2.17", title: "Exercici 2.17: Centre, Radi i Diàmetre" },
            { id: "M1-T2-Ex2.18", title: "Exercici 2.18: Diàmetre Mínim per Densitat Alta" }
        ]
    },
    {
        id: "m1-tema-3",
        title: "Tema 3: Grafs Eulerians i Hamiltonians",
        description: "Camins i cicles eulerians i hamiltonians.",
        problems: [
            { id: "M1-T3-Ex3.1", title: "Exercici 3.1: Circuits Eulerians" },
            { id: "M1-T3-Ex3.4", title: "Exercici 3.4: Eulerianitat en Bipartits" },
            { id: "M1-T3-Ex3.5", title: "Exercici 3.5: Unir components eulerians" },
            { id: "M1-T3-Ex3.6", title: "Exercici 3.6: Ponts i Graus Parells" },
            { id: "M1-T3-Ex3.7", title: "Exercici 3.7: El Problema del Dòmino" },
            { id: "M1-T3-Ex3.8", title: "Exercici 3.8: El Graf n-cub (Qn)" },
            { id: "M1-T3-Ex3.9", title: "Exercici 3.9: Cicles Hamiltonians" },
            { id: "M1-T3-Ex3.10", title: "Exercici 3.10: Bipartits i Hamiltonians" },
            { id: "M1-T3-Ex3.11", title: "Exercici 3.11: Hamiltonianitat en Bipartits Complets" },
            { id: "M1-T3-Ex3.12", title: "Exercici 3.12: Unir components hamiltonians" },
            { id: "M1-T3-Ex3.13", title: "Exercici 3.13: Graus en Grafs Hamiltonians" },
            { id: "M1-T3-Ex3.15", title: "Exercici 3.15: Hamiltonianitat del Graf Complementari" },
            { id: "M1-T3-Ex3.16", title: "Exercici 3.16: Existència de Camí Hamiltonià" }
        ]
    },
    {
        id: "m1-tema-4",
        title: "Tema 4: Arbres i arbres generadors",
        description: "L'estructura estrella. Caracterització i la seqüència de Prüfer.",
        problems: [
            { id: "M1-T4-Ex4.2", title: "Exercici 4.2: Arbre és Bipartit" },
            { id: "M1-T4-Ex4.3", title: "Exercici 4.3: Ordre i Mida d'Arbres" },
            { id: "M1-T4-Ex4.5", title: "Exercici 4.5: Seqüència de Graus i Arbres No Isomorfs" },
            { id: "M1-T4-Ex4.6", title: "Exercici 4.6: Graf no arbre amb vèrtexs de tall" },
            { id: "M1-T4-Ex4.7", title: "Exercici 4.7: Fórmula de les Fulles" },
            { id: "M1-T4-Ex4.8", title: "Exercici 4.8: Condició per ser Arbre (Graus 1 i 5)" },
            { id: "M1-T4-Ex4.9", title: "Exercici 4.9: Grau Màxim i Nombre de Fulles" },
            { id: "M1-T4-Ex4.10", title: "Exercici 4.10: Caracteritzacions del Graf Estrella" },
            { id: "M1-T4-Ex4.11", title: "Exercici 4.11: Grafs Unicíclics" },
            { id: "M1-T4-Ex4.12", title: "Exercici 4.12: Arbres generadors de C_n i K_{2,r}" },
            { id: "M1-T4-Ex4.15", title: "Exercici 4.15: Fulles del Spanning Tree i Vèrtexs de Tall" },
            { id: "M1-T4-Ex4.16", title: "Exercici 4.16: Seqüències de Prüfer" },
            { id: "M1-T4-Ex4.17", title: "Exercici 4.17: Reconstrucció d'arbres" }
        ]
    },
    {
        id: "m1-tema-5",
        title: "Tema 5: Matrius",
        description: "Càlcul matricial. Operacions bàsiques i propietats.",
        problems: [
            { id: "M1-T5-Ex5.1", title: "Exercici 5.1: Operacions bàsiques" },
            { id: "M1-T5-Ex5.2", title: "Exercici 5.2: Producte de vectors fila i columna" },
            { id: "M1-T5-Ex5.3", title: "Exercici 5.3: Existència del producte BA" },
            { id: "M1-T5-Ex5.4", title: "Exercici 5.4: Càlcul d’elements específics" },
            { id: "M1-T5-Ex5.5", title: "Exercici 5.5: Representació de dades" },
            { id: "M1-T5-Ex5.6", title: "Exercici 5.6: Potències de matrius diagonals" },
            { id: "M1-T5-Ex5.7", title: "Exercici 5.7: Transposada del producte" },
            { id: "M1-T5-Ex5.8", title: "Exercici 5.8: Producte de matrius simètriques" },
            { id: "M1-T5-Ex5.9", title: "Exercici 5.9: Condició de simetria del producte" },
            { id: "M1-T5-Ex5.10", title: "Exercici 5.10: Matrius amb propietats especials" },
            { id: "M1-T5-Ex5.11", title: "Exercici 5.11: Identitats notables amb matrius" },
            { id: "M1-T5-Ex5.12", title: "Exercici 5.12: Relació de semblança" },
            { id: "M1-T5-Ex5.13", title: "Exercici 5.13: Escalonament i rang" },
            { id: "M1-T5-Ex5.14", title: "Exercici 5.14: Inversa de matrius elementals" },
            { id: "M1-T5-Ex5.15", title: "Exercici 5.15: Càlcul de la inversa (Gauss-Jordan)" },
            { id: "M1-T5-Ex5.16", title: "Exercici 5.16: Linealitat de les equacions" },
            { id: "M1-T5-Ex5.17", title: "Exercici 5.17: De matriu ampliada a sistema" },
            { id: "M1-T5-Ex5.18", title: "Exercici 5.18: Teorema de Rouché-Capelli" },
            { id: "M1-T5-Ex5.19", title: "Exercici 5.19: Sistemes en Z2" },
            { id: "M1-T5-Ex5.20", title: "Exercici 5.20: Resolució de sistemes lineals" },
            { id: "M1-T5-Ex5.21", title: "Exercici 5.21: Resolució de sistemes homogenis" },
            { id: "M1-T5-Ex5.22", title: "Exercici 5.22: Discussió segons paràmetres" },
            { id: "M1-T5-Ex5.23", title: "Exercici 5.23: Propietats dels determinants" },
            { id: "M1-T5-Ex5.24", title: "Exercici 5.24: Valors per determinant nul" },
            { id: "M1-T5-Ex5.25", title: "Exercici 5.25: Càlcul de determinants" },
            { id: "M1-T5-Ex5.26", title: "Exercici 5.26: Propietats algebraiques" },
            { id: "M1-T5-Ex5.27", title: "Exercici 5.27: Demostració de determinant" }
        ]
    },
    {
        id: "m1-tema-6",
        title: "Tema 6: Espais vectorials",
        description: "Introducció als espais vectorials, subespais i bases.",
        problems: [
            { id: "M1-T6-Ex6.1", title: "Exercici 6.1: Operacions amb vectors" },
            { id: "M1-T6-Ex6.2", title: "Exercici 6.2: Representació al pla" },
            { id: "M1-T6-Ex6.3", title: "Exercici 6.3: Operacions gràfiques" },
            { id: "M1-T6-Ex6.4", title: "Exercici 6.4: Combinacions lineals" },
            { id: "M1-T6-Ex6.5", title: "Exercici 6.5: Polinomis de grau parell" },
            { id: "M1-T6-Ex6.6", title: "Exercici 6.6: Espai de les funcions reals" },
            { id: "M1-T6-Ex6.7", title: "Exercici 6.7: Identificació de subespais" },
            { id: "M1-T6-Ex6.8", title: "Exercici 6.8: Subespais de polinomis" },
            { id: "M1-T6-Ex6.9", title: "Exercici 6.9: Subespais de matrius" },
            { id: "M1-T6-Ex6.10", title: "Exercici 6.10: Combinacions no úniques" },
            { id: "M1-T6-Ex6.11", title: "Exercici 6.11: Combinació amb paràmetres" },
            { id: "M1-T6-Ex6.12", title: "Exercici 6.12: Combinació de matrius" },
            { id: "M1-T6-Ex6.13", title: "Exercici 6.13: Condició de pertinença" },
            { id: "M1-T6-Ex6.14", title: "Exercici 6.14: Forma genèrica" },
            { id: "M1-T6-Ex6.15", title: "Exercici 6.15: Igualtat de subespais" },
            { id: "M1-T6-Ex6.16", title: "Exercici 6.16: Independència lineal" },
            { id: "M1-T6-Ex6.17", title: "Exercici 6.17: Dependència lineal amb paràmetres" },
            { id: "M1-T6-Ex6.18", title: "Exercici 6.18: Prova teòrica de dependència" },
            { id: "M1-T6-Ex6.19", title: "Exercici 6.19: Independència i combinació de matrius" },
            { id: "M1-T6-Ex6.20", title: "Exercici 6.20: Dependència de polinomis" },
            { id: "M1-T6-Ex6.21", title: "Exercici 6.21: Propietats de la dependència lineal" },
            { id: "M1-T6-Ex6.22", title: "Exercici 6.22: Veritat o Fals sobre LI i Generadors" },
            { id: "M1-T6-Ex6.23", title: "Exercici 6.23: Canvi de base i coordenades" },
            { id: "M1-T6-Ex6.24", title: "Exercici 6.24: Base de l'espai de matrius" },
            { id: "M1-T6-Ex6.25", title: "Exercici 6.25: Base en l'espai de polinomis" },
            { id: "M1-T6-Ex6.26", title: "Exercici 6.26: Base i equació implícita" },
            { id: "M1-T6-Ex6.27", title: "Exercici 6.27: Igualtat de subespais" },
            { id: "M1-T6-Ex6.28", title: "Exercici 6.28: Prova de base mitjançant combinacions" },
            { id: "M1-T6-Ex6.29", title: "Exercici 6.29: Base subespai a R5 i extensió" },
            { id: "M1-T6-Ex6.30", title: "Exercici 6.30: Extensió d'independència en matrius" },
            { id: "M1-T6-Ex6.31", title: "Exercici 6.31: Dimensió amb paràmetres" },
            { id: "M1-T6-Ex6.32", title: "Exercici 6.32: Subespai de matrius i bases" },
            { id: "M1-T6-Ex6.33", title: "Exercici 6.33: Intersecció de subespais" },
            { id: "M1-T6-Ex6.34", title: "Exercici 6.34: Ampliació de bases" },
            { id: "M1-T6-Ex6.35", title: "Exercici 6.35: Matrius de canvi de base" },
            { id: "M1-T6-Ex6.36", title: "Exercici 6.36: Base de polinomis i coordenades" },
            { id: "M1-T6-Ex6.37", title: "Exercici 6.37: Canvi entre bases no canòniques" },
            { id: "M1-T6-Ex6.38", title: "Exercici 6.38: Canvis de base en matrius" },
            { id: "M1-T6-Ex6.39", title: "Exercici 6.39: Relació entre coordenades" },
            { id: "M1-T6-Ex6.40", title: "Exercici 6.40: Determinació d'una base" }
        ]
    },

    // --- M2 (Càlcul i Optimitació) ---
    {
        id: "m2-tema-1-reals",
        title: "Tema 1: Nombres reals i complexos",
        description: "Valor absoluts, desigualtats i nombres complexos. Propietats bàsiques.",
        problems: [
            { id: "M2-T1-Ex1", title: "Problema 1: Desigualtats fraccionàries i polinòmiques" },
            { id: "M2-T1-Ex2", title: "Problema 2: Desigualtats amb valor absolut" },
            { id: "M2-T1-Ex3", title: "Problema 3: Suprem, Ínfim de subconjunts" },
            { id: "M2-T1-Ex4", title: "Problema 4: Desigualtats creuades" },
            { id: "M2-T1-Ex5", title: "Problema 5: Polinomis i valors absoluts amb condicions" },
            { id: "M2-T1-Ex6", title: "Problema 6: Equacions i inequacions amb múltiples valors absoluts" },
            { id: "M2-T1-Ex7", title: "Problema 7: Desigualtat triangular sobre polinomis de fraccions" },
            { id: "M2-T1-Ex8", title: "Problema 8: Simplificació de valors absoluts en funcions definides a trossos" },
            { id: "M2-T1-Ex9", title: "Problema 9: Desigualtat Triangular Generalitzada amb sumatoris oposats" },
            { id: "M2-T1-Ex10", title: "Problema 10: Inequacions compostes de paràmetres de polinomis i extrems absoluts" },
            { id: "M2-T1-Ex11", title: "Problema 11: Inequacions diverses de grau superior i quocients creuats" },
            { id: "M2-T1-Ex12", title: "Problema 12: Interseccions i unions de conjunts" }
        ]
    },
    {
        id: "m2-tema-2-successions",
        title: "Tema 2: Successions numèriques",
        description: "Definicions. Successions convergents, divergents i oscil·lants. Criteris de convergència. Successions recurrents.",
        problems: [
            { id: "M2-T2-Ex1", title: "Problema 1: Càlcul de límits bàsics" },
            { id: "M2-T2-Ex2", title: "Problema 2: Indeterminacions als límits" },
            { id: "M2-T2-Ex3", title: "Problema 3: Criteri del sandvitx" },
            { id: "M2-T2-Ex4", title: "Problema 4: Jerarquia d'infinits" },
            { id: "M2-T2-Ex5", title: "Problema 5: Límits avançats i constants" },
            { id: "M2-T2-Ex6", title: "Problema 6: Successions recurrents" },
            // { id: "M2-T2-Ex7", title: "Problema 7: Taller de límits (I)" },
            // { id: "M2-T2-Ex8", title: "Problema 8: Sèries de sumatoris" },
            { id: "M2-T2-Ex9", title: "Problema 9: Taller de límits (II)" },
            // { id: "M2-T2-Ex10", title: "Problema 10: Demostracions de recurrència" },
            // { id: "M2-T2-Ex11", title: "Problema 11: Successions factorials" },
            { id: "M2-T2-Ex12", title: "Problema 12: Equacions de límits" },
            // { id: "M2-T2-Ex13", title: "Problema 13: Variables en límits d'arrels" },
            // { id: "M2-T2-Ex14", title: "Problema 14: Límits de longitud i sumatoris" },
            // { id: "M2-T2-Ex15", title: "Problema 15: Successió d'arrels infinites" }
        ]
    },
    {
        id: "m2-tema-3-continuïtat",
        title: "Tema 3: Continuïtat",
        description: "Teoremes de Bolzano i Weierstrass. Mètodes de bissecció, secant i Newton-Raphson.",
        problems: [
            { id: "M2-T3-Ex1", title: "Problema 1: Existència de solució a l'interval [0, 2]" },
            { id: "M2-T3-Ex2", title: "Problema 2: Intersecció de dues funcions contínues" },
            { id: "M2-T3-Ex5", title: "Problema 5: Bolzano, bissecció i mètode de la secant" },
            { id: "M2-T3-Ex6", title: "Problema 6: Solucions a funcions trigonomètriques" },
            { id: "M2-T3-Ex8", title: "Problema 8: Aproximació d'arrels múltiples mètodes" },
            { id: "M2-T3-Ex11", title: "Problema 11: Arrels de polinomis i limitador" }
        ]
    },
    {
        id: "m2-tema-4-funcions-derivables",
        title: "Tema 4: Teoremes de funcions derivables d'una variable",
        description: "Rolle, Lagrange, L'Hôpital. Mètode de Newton-Raphson i aplicacions de la derivada.",
        problems: [
            // { id: "M2-T4-Ex1", title: "Problema 1: Penden de la recta tangent paral·lela" },
            { id: "M2-T4-Ex2", title: "Problema 2: Unicitat de solució per 3^-x = x" },
            // { id: "M2-T4-Ex3", title: "Problema 3: Zeros de funció polinòmica" },
            { id: "M2-T4-Ex4", title: "Problema 4: Equació e^{-x} = ln x" },
            // { id: "M2-T4-Ex5", title: "Problema 5: Límits de tipus ∞/∞ i 0 · ∞" },
            { id: "M2-T4-Ex6", title: "Problema 6: Existència de punt fix f(x)=x" },
            { id: "M2-T4-Ex7", title: "Problema 7: Equació e^x = x/2 + 2" },
            { id: "M2-T4-Ex8", title: "Problema 8: Regla de l'Hôpital (Diversos)" },
            { id: "M2-T4-Ex9", title: "Problema 9: Límits varis" },
            { id: "M2-T4-Ex10", title: "Problema 10: Teorema del valor mitjà" },
            // { id: "M2-T4-Ex11", title: "Problema 11: Nombre d'arrels reals" },
            { id: "M2-T4-Ex12", title: "Problema 12: Gràfica talla exactament un cop l'eix" },
            // { id: "M2-T4-Ex13", title: "Problema 13: Mètode iteratiu de Newton-Raphson" },
            // { id: "M2-T4-Ex14", title: "Problema 14: Resolució per Newton-Raphson de diverses equacions" },
            // { id: "M2-T4-Ex15", title: "Problema 15: Punt de la gràfica amb tangent perpendicular" },
            // { id: "M2-T4-Ex16", title: "Problema 16: Punts on es tallen dues gràfiques amb la mateixa tangent" },
            // { id: "M2-T4-Ex17", title: "Problema 17: Derivades i simplificació" },
            { id: "M2-T4-Ex18", title: "Problema 18: Punts crítics, classificació i asímptotes" },
            // { id: "M2-T4-Ex19", title: "Problema 19: Problema d'optimització (suma de cubs mínima)" },
            // { id: "M2-T4-Ex20", title: "Problema 20: Extrems absoluts en intervals tancats" },
            { id: "M2-T4-Ex21", title: "Problema 21: Intervals de creixement i extrems relatius" },
            // { id: "M2-T4-Ex22", title: "Problema 22: Intervals de creixement, concavitat i convexitat" }
        ]
    },
    {
        id: "m2-tema-5-taylor",
        title: "Tema 5: Fórmula de Taylor per a funcions d'una variable",
        description: "Polinomi de Taylor. Fórmula de Lagrange del residu. Propagació de l'error i aplicacions.",
        problems: [
            { id: "M2-T5-Ex1", title: "Problema 1: Taylor i avaluabilitat radical" },
            { id: "M2-T5-Ex2", title: "Problema 2: Desenvolupament logs" },
            { id: "M2-T5-Ex3", title: "Problema 3: Aproximant e amb fites fixades generals" },
            { id: "M2-T5-Ex4", title: "Problema 4: Arrels quadrades sobre Taller de funcions" },
            { id: "M2-T5-Ex5", title: "Problema 5: Exemples d'Avaluacions Decimalitzades" },
            { id: "M2-T5-Ex6", title: "Problema 6: Maclaurin i residu de varies funcions" },
            { id: "M2-T5-Ex8", title: "Problema 8: Límits mitjançant infinitèssims i Taylor" },
            { id: "M2-T5-Ex9", title: "Problema 9: Desenvolupaments d'ordre divers" },
            { id: "M2-T5-Ex11", title: "Problema 11: Polinomi de funcions irracionals" }
        ]
    },
    {
        id: "m2-tema-6-integracio",
        title: "Tema 6: Integració de funcions d'una variable",
        description: "Teorema Fonamental del Càlcul. Regla de Barrow. Àrees i volums. Trapezis i Simpson.",
        problems: [
            { id: "M2-T6-Ex1", title: "Problema 1: Derivada de funcions integrals" },
            { id: "M2-T6-Ex2", title: "Problema 2: Límits amb integrals" },
            { id: "M2-T6-Ex3", title: "Problema 3: Monotonia d'una funció integral" },
            { id: "M2-T6-Ex4", title: "Problema 4: Paritat i concavitat d'una funció integral" },
            { id: "M2-T6-Ex5", title: "Problema 5: Integració numèrica (Trapezis i Simpson)" },
            { id: "M2-T6-Ex6", title: "Problema 6: Dimensió de la partició per Simpson" },
            { id: "M2-T6-Ex7", title: "Problema 7: Integrals immediates" },
            { id: "M2-T6-Ex8", title: "Problema 8: Integració per parts" },
            { id: "M2-T6-Ex9", title: "Problema 9: Àrea entre paràbola i recta" },
            { id: "M2-T6-Ex10", title: "Problema 10: Àrea entre corbes i eix d'abscisses" },
            { id: "M2-T6-Ex11", title: "Problema 11: Àrea en el quart quadrant" },
            { id: "M2-T6-Ex12", title: "Problema 12: Integració numèrica de funcions no elementals" },
            { id: "M2-T6-Ex13", title: "Problema 13: Determinació de la partició per a un error fixat" },
            { id: "M2-T6-Ex14", title: "Problema 14: Anàlisi de l'error en la regla de Simpson" },
            { id: "M2-T6-Ex15", title: "Problema 15: Punt crític i integració numèrica" }
        ]
    },
    {
        id: "m2-tema-7-funcions-variables",
        title: "Tema 7: Funcions de diverses variables",
        description: "Domini, gràfica, conjunts de nivell, interpretació geomètrica. Funcions contínues.",
        problems: [
            { id: "M2-T7-Ex1", title: "Problema 1: Topologia a R^2 (Conjunts)" },
            { id: "M2-T7-Ex2", title: "Problema 2: Domini de funcions" },
            { id: "M2-T7-Ex3", title: "Problema 3: Dibuix de corbes de nivell" },
            { id: "M2-T7-Ex4", title: "Problema 4: Domini i corbes de nivell complexes" },
            { id: "M2-T7-Ex5", title: "Problema 5: Dibuix de subconjunts de R^2" },
            { id: "M2-T7-Ex6", title: "Problema 6: Topologia i Compacitat" },
            { id: "M2-T7-Ex7", title: "Problema 7: Representació de dominis" },
            { id: "M2-T7-Ex8", title: "Problema 8: Dibuix de corbes de nivell" },
            { id: "M2-T7-Ex9", title: "Problema 9: Verificació de corbes de nivell" }
        ]
    },
    {
        id: "m2-tema-8-derivades-parcials",
        title: "Tema 8: Derivades parcials i direccionals. Vector Gradient",
        description: "Derivada direccional i parcial. Vector Gradient. Pla tangent a una superfície.",
        problems: [
            { id: "M2-T8-Ex1", title: "Problema 1: Derivades parcials de primer ordre" },
            { id: "M2-T8-Ex2", title: "Problema 2: Derivada direccional" },
            { id: "M2-T8-Ex3", title: "Problema 3: Derivada direccional amb angle" },
            { id: "M2-T8-Ex4", title: "Problema 4: Determinació de paràmetres" },
            { id: "M2-T8-Ex5", title: "Problema 5: Pla tangent i recta normal" },
            { id: "M2-T8-Ex6", title: "Problema 6: Pla tangent paral·lel a XY" },
            { id: "M2-T8-Ex7", title: "Problema 7: Càlcul de gradients" },
            { id: "M2-T8-Ex8", title: "Problema 8: Propietats del gradient" },
            { id: "M2-T8-Ex9", title: "Problema 9: Corbes de nivell i creixement" },
            { id: "M2-T8-Ex10", title: "Problema 10: Pla tangent i recta normal (II)" }
        ]
    },
    {
        id: "m2-tema-9-taylor-multivariable",
        title: "Tema 9: Polinomi de Taylor en diverses variables",
        description: "Derivades parcials d'ordre superior. Matriu Hessiana. Polinomi de Taylor i residu.",
        problems: [
            { id: "M2-T9-Ex1", title: "Problema 1: Polinomi de Taylor de grau 2" },
            { id: "M2-T9-Ex2", title: "Problema 2: Pla tangent i aproximació" },
            { id: "M2-T9-Ex3", title: "Problema 3: Extrems relatius i Hessian nul" },
            { id: "M2-T9-Ex4", title: "Problema 4: Determinació de paràmetres" }
        ]
    },
    {
        id: "m2-tema-10-optimitzacio",
        title: "Tema 10: Optimització de funcions de diverses variables",
        description: "Weierstrass. Multiplicadors de Lagrange. Extrems relatius, condicionats i absoluts.",
        problems: []
    }
];
