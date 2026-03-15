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
            { id: "V22704", title: "Camí més llarg en un arbre binari" }
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
            { id: "S84123", title: "Exercici restringit (S84123)" }
        ]
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
            { id: "M2-T4-Ex2", title: "Problema 2: Unicitat de solució per 3^{-x} = x" },
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
        problems: []
    },
    {
        id: "m2-tema-7-funcions-diverses",
        title: "Tema 7: Funcions de diverses variables",
        description: "Domini, gràfica, conjunts de nivell, interpretació geomètrica. Funcions contínues.",
        problems: []
    },
    {
        id: "m2-tema-8-derivades-parcials",
        title: "Tema 8: Derivades parcials i direccionals. Vector Gradient",
        description: "Derivada direccional i parcial. Vector Gradient. Pla tangent a una superfície.",
        problems: []
    },
    {
        id: "m2-tema-9-taylor-diverses",
        title: "Tema 9: Polinomi de Taylor en diverses variables",
        description: "Derivades parcials d'ordre superior. Matriu Hessiana. Polinomi de Taylor i residu.",
        problems: []
    },
    {
        id: "m2-tema-10-optimitzacio",
        title: "Tema 10: Optimització de funcions de diverses variables",
        description: "Weierstrass. Multiplicadors de Lagrange. Extrems relatius, condicionats i absoluts.",
        problems: []
    }
];
