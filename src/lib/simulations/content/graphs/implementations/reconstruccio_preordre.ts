import type { Simulation, SimulationStep } from "../../../engine/types";

interface AlgoStep {
    line: number;
    description: string;
    highlights: Record<string | number, string>; // nodeId -> color
    nodeLabels?: Record<string | number, string>; // nodeId -> label text
    links?: { source: string | number; target: string | number; label?: string; color?: string; curvature?: number }[];
    variables: Record<string, string>;
}

const rebuildPreorderCode = `// Input cin: "10 5 # # 14 # #"
template <typename T>
pro2::BinTree<T> build_preorder(istream& cin) {
    string token;
    cin >> token;
    
    if (token == "#" || !cin) return pro2::BinTree<T>(); 
    
    T value = read_value<T>(token);
    auto left = build_preorder<T>(cin);
    auto right = build_preorder<T>(cin);
    
    return pro2::BinTree<T>(value, left, right);
}`;

const legacyAlgo: Record<string, { id: string; code?: string; initialGraph?: Record<string, unknown>; generateSteps: () => AlgoStep[] }> = {
    reconstruccio_preordre: {
        id: "reconstruccio_preordre",
        code: rebuildPreorderCode,
        initialGraph: {
            nodes: [
                { id: "10", label: "10", fx: 0, fy: -60, color: "transparent" }, // color custom injection workaround
                { id: "5", label: "5", fx: -40, fy: -10, color: "transparent" },
                { id: "14", label: "14", fx: 40, fy: -10, color: "transparent" },
                { id: "L_buida1", label: "# (Buit)", fx: -60, fy: 30, color: "transparent" },
                { id: "R_buida1", label: "# (Buit)", fx: -20, fy: 30, color: "transparent" },
                { id: "L_buida2", label: "# (Buit)", fx: 20, fy: 30, color: "transparent" },
                { id: "R_buida2", label: "# (Buit)", fx: 60, fy: 30, color: "transparent" }
            ],
            links: [
                { source: "10", target: "5" },
                { source: "10", target: "14" },
                { source: "5", target: "L_buida1" },
                { source: "5", target: "R_buida1" },
                { source: "14", target: "L_buida2" },
                { source: "14", target: "R_buida2" }
            ]
        },
        generateSteps: () => {
            const steps: AlgoStep[] = [];
            const vars: Record<string, string> = {};
            const hl: Record<string, string> = {};

            const st = (l: number, d: string, activeNodeId: string, customColor: string = "#facc15") => {
                if (activeNodeId) hl[activeNodeId] = customColor;
                steps.push({ line: l, description: d, highlights: { ...hl }, variables: { ...vars } });
            };

            st(2, "Arrenca la terminal desponent el teclat. El text a llegir complet és: '10 5 # # 14 # #'.", "");
            vars["Input Input Stream (cin)"] = "[10, 5, #, #, 14, #, #]";

            st(4, "Primer espai: es llegeix la paraula del terminal.", "");
            vars["Input Input Stream (cin)"] = "[5, #, #, 14, #, #]";
            vars["token"] = `"10"`;

            st(6, "Era un hashtag '#' que indica Buit? No, vol dir que realment això és una dada i no està mort l'arbre aquí.", "");
            st(8, "Convertim '10' texte a instància numèrica (T = int) guardant-la al calaix.", "");

            st(9, "Ara ja podem intentar buscar i engatxar tota l'ala esquerre abans de fer res més... Llança'm codi un altre cop confiant a on el terminal em porti.", "10", "#10b981");

            st(4, "NOVA Crida. Llegim paraula terminal.", "");
            vars["Input Input Stream (cin)"] = "[#, #, 14, #, #]";
            vars["token (fill esq L)"] = `"5"`;

            st(8, "No era buit, convertim... Llavors, confia un cop més cec per lligar a l'esquerra el costat buit de l'arbre 5... Crida esquerre.", "5", "#3b82f6");

            st(4, "NOVA Crida. Llegeix token següent...", "");
            vars["Input Input Stream (cin)"] = "[#, 14, #, #]";
            vars["token (L del 5)"] = `"# (!)"`;

            st(6, "BINGO. Salt pel buit '#' detectat! Aquesta fulla sí que rebota falsa aturant una línia infinita i generant directament un 'Arbre Buit' que es desvincula de la resta tallant subestructures inexistents.", "L_buida1", "#64748b");
            st(10, "Es recoloca al fill L del 5 amb fulla blanca, comença a fer el return per invocar de seguida l'intent a l'ala dreta buida. R del 5.", "5", "#facc15");

            st(4, "NOVA Crida (Buscant dreta del 5). Llegeix terminal:", "", "");
            vars["Input Input Stream (cin)"] = "[14, #, #]";
            vars["token (R del 5)"] = `"# (!)"`;

            st(6, "BINGO un altre cop, null '#'. Retorna false.", "R_buida1", "#64748b");

            st(11, "Increïble. L'objecte arbre del node (5) ha fusionat ell mateix junt a les dues derivades nulles que acabem de matar. Torna el node amunt construït en sec cap al recursiu root de base com l'Autèntic fill esquerre de 10.", "5", "#10b981");

            st(10, "Roots base: L'Arrel de tota l'estructura de 10 respira tranquil perquè sap que tota l'ala esquerra del paper de format estava completada... Llança't al mateix infern per buscar a la Dreta.", "10", "#facc15");
            vars["Input Input Stream (cin)"] = "[#, #]";
            vars["token (R del 10)"] = `"14"`;
            st(11, "Construeix l'esperant 14... Llegeix dues # per R i L, confirmant que ell i el teclat de notes final ha estat consumit pel sencer... (Saltant sub-passos)", "14", "#10b981");
            st(11, "Els dos fills 14 de buits absorbits validen que la màquina té l'arbre 10 unit integral...", "L_buida2", "#64748b");
            st(11, "Lligat tot, torna la Corona general instanciada tancant i alliberant Stream Input.", "R_buida2", "#64748b");
            st(12, "L'Arbre Pre-Ordre construït i llest a temps matemàtic perfecte i en ordre pur O(N).", "10", "#22c55e");

            return steps;
        }
    }
};

export const reconstruccio_preordre: Simulation = {
    id: legacyAlgo.reconstruccio_preordre.id,
    renderer: "graph",
    code: legacyAlgo.reconstruccio_preordre.code,
    initialState: legacyAlgo.reconstruccio_preordre.initialGraph,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.reconstruccio_preordre.generateSteps().map((step: AlgoStep) => ({
            line: step.line,
            description: step.description,
            variables: step.variables,
            visual: {
                highlights: step.highlights,
                nodeLabels: step.nodeLabels,
                links: step.links
            }
        }));
    }
};
