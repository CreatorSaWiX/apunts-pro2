import type { Simulation, SimulationStep } from "../../../engine/types";

interface AlgoStep {
    line: number;
    description: string;
    highlights: Record<string | number, string>; // nodeId -> color
    nodeLabels?: Record<string | number, string>; // nodeId -> label text
    links?: { source: string | number; target: string | number; label?: string; color?: string; curvature?: number }[];
    variables: Record<string, string>;
}

const pairMultitaskCode = `pair<double, int> sum_and_size__(BinTree<double> t) {
    if (t.empty()) return {0.0, 0};
    
    auto L = sum_and_size__(t.left());
    auto R = sum_and_size__(t.right());
    
    return {
        t.value() + L.first + R.first, 
        1 + L.second + R.second
    };
}`;

const legacyAlgo: Record<string, { id: string; code?: string; initialGraph?: Record<string, unknown>; generateSteps: () => AlgoStep[] }> = {
    eficiencia_multitasca: {
        id: "eficiencia_multitasca",
        code: pairMultitaskCode,
        initialGraph: {
            nodes: [
                { id: "10", label: "A (10)", fx: 0, fy: -60 },
                { id: "5", label: "B (5)", fx: -40, fy: -10 },
                { id: "15", label: "C (15)", fx: 40, fy: -10 }
            ],
            links: [
                { source: "10", target: "5" },
                { source: "10", target: "15" }
            ]
        },
        generateSteps: () => {
            const steps: AlgoStep[] = [];
            let hl: Record<string, string> = {};
            const vars: Record<string, string> = {};

            const st = (l: number, d: string, c: string | Record<string, string>) => {
                if (typeof c === 'string') {
                    if (c) hl[c] = "#facc15"; // yellow
                } else {
                    hl = { ...hl, ...c };
                }
                steps.push({ line: l, description: d, highlights: { ...hl }, variables: { ...vars } });
            };

            st(1, "Anem a resoldre els 2 problemes (Suma total i Quantitat) amb un sol Pair d'una passada! Cridem arrel (10).", "10");

            st(2, "L'arbre 10 no és buit.", "10");
            st(4, "Primer rebot a l'esquerra: t.left().", "5");
            vars["L (pel 10)"] = "esperant...";

            st(2, "Avaluem node 5. No és buit.", "5");
            st(4, "Rebotem la crida l'esquerra del node 5 (que és un full blanc null escondit).", { "5": "#f59e0b", "null_5L": "transparent" });
            st(2, "Buit t.empty() retornem pair neutre: {0.0 sum, 0 elements}.", { "5": "#facc15" });
            vars["L (pel 5)"] = "{0.0, 0}";

            st(5, "Ara el node 5 fa rebotar la branca dreta morta que amaga.", "5");
            st(2, "Torna a retornar pair neutre buit {0.0, 0}.", "5");
            vars["R (pel 5)"] = "{0.0, 0}";

            st(7, "Ara ve la clau de L'O(N): El node 5 fusiona les respostes dels seus fills en una nova Tupla combinada i s'ho queda directament en memòria.", "5");
            st(8, "Calcula i retorna: {5 + 0.0 + 0.0, 1 pos + 0 + 0} -> {5, 1}. Ho empenta a dalt sense mai repetir més línies de codi.", { "5": "#10b981", "10": "#facc15" });
            vars["L (pel 10)"] = "{5.0, 1}";

            st(5, "Tornem a l'arrel gran (10), que ataca a la dreta instigant el node 15 abans de calcular res.", "15");
            st(2, "Avaluant 15. No buida.", "15");
            st(7, "Com sabem que té dos fills nulls ocults rebent {0.0, 0} cada un, directament resol fusionant: {15 + 0 + 0, 1 + 0 + 0}.", "15");
            vars["R (pel 10)"] = "{15.0, 1}";
            st(8, "El node 15 respon instantàniament desintegrant la mort recursiva. Retorna {15, 1}", { "15": "#10b981", "10": "#facc15" });

            st(9, "Final! L'arrel consolida els dos apilaments dels fills: \nSuma total iterada = 10 + 5.0 (Esquerra) + 15.0 (Dreta)\nMida nodes totals = 1 + 1 (Esq) + 1 (Dreta).", { "10": "#10b981", "5": "#10b981", "15": "#10b981" });
            vars["Retorn Final (Main)"] = "pair{30.0, 3}";
            st(10, "Aconseguim les dues dades llegint la base de l'Arbre 1 COP rigorós de recobriment. Si haguéssim instanciat sum() i size() per separat hauria costat el famós Theta(2N) que seria Theta(N^2) si és codi de bucle desequilibrat intern.", { "10": "#3b82f6", "5": "#3b82f6", "15": "#3b82f6" });

            return steps;
        }
    }
};

export const eficiencia_multitasca: Simulation = {
    id: legacyAlgo.eficiencia_multitasca.id,
    renderer: "graph",
    code: legacyAlgo.eficiencia_multitasca.code,
    initialState: legacyAlgo.eficiencia_multitasca.initialGraph,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.eficiencia_multitasca.generateSteps().map((step: AlgoStep) => ({
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
