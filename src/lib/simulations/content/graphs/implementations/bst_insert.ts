import type { Simulation, SimulationStep } from "../../../engine/types";
import bst_insert_code from "../code/bst_insert/source.cpp?raw";

interface AlgoStep {
    line: number;
    description: string;
    highlights: Record<string | number, string>; // nodeId -> color
    nodeLabels?: Record<string | number, string>; // nodeId -> label text
    links?: { source: string | number; target: string | number; label?: string; color?: string; curvature?: number }[];
    variables: Record<string, string>;
}

const legacyAlgo: Record<string, { id: string; initialGraph?: Record<string, unknown>; generateSteps: () => AlgoStep[] }> = {
    bst_insert: {
        id: "bst_insert",
        initialGraph: {
            nodes: [
                { id: 1, label: "50", fx: 0,    fy: -120 },
                { id: 2, label: "20", fx: -80,  fy: -40  },
                { id: 3, label: "80", fx: 80,   fy: -40  },
                { id: 4, label: "10", fx: -120, fy: 60   },
                { id: 5, label: "30", fx: -40,  fy: 60   },
                { id: 6, label: "70", fx: 40,   fy: 60   },
                { id: 7, label: "90", fx: 120,  fy: 60   },
            ],
            links: [
                { source: 1, target: 2 },
                { source: 1, target: 3 },
                { source: 2, target: 4 },
                { source: 2, target: 5 },
                { source: 3, target: 6 },
                { source: 3, target: 7 },
            ]
        },
        generateSteps: () => {
            const steps: AlgoStep[] = [];
            const hl: Record<number, string> = {};
            // Inserir x=25. Camí: 50->20->30->fulla esquerra de 30
            const labels: Record<number, string> = { 1:"50", 2:"20", 3:"80", 4:"10", 5:"30", 6:"70", 7:"90" };
            const addStep = (line: number, desc: string, vars: Record<string, string> = {}) => {
                steps.push({ line, description: desc, highlights: { ...hl }, nodeLabels: { ...labels }, variables: vars });
            };

            addStep(1, "algo.bst_insert.step_1", { x: "25" });

            // Pas 1: Arrel 50
            hl[1] = "#facc15";
            addStep(3, "algo.bst_insert.step_2", { node: "50", x: "25", cond: "25 ≠ 50" });
            addStep(4, "algo.bst_insert.step_3", { node: "50", decision: "25 < 50 → esquerra" });
            hl[1] = "#0ea5e9"; // blau: en reconstrucció

            // Pas 2: node 20
            hl[2] = "#facc15";
            addStep(3, "algo.bst_insert.step_4", { node: "20", x: "25", cond: "25 ≠ 20" });
            addStep(5, "algo.bst_insert.step_5", { node: "20", decision: "25 > 20 → dreta" });
            hl[2] = "#0ea5e9";

            // Pas 3: node 30
            hl[5] = "#facc15";
            addStep(3, "algo.bst_insert.step_6", { node: "30", x: "25", cond: "25 ≠ 30" });
            addStep(4, "algo.bst_insert.step_7", { node: "30", decision: "25 < 30 → esquerra" });
            hl[5] = "#0ea5e9";

            // Pas 4: Cas base - buit -> crear nou node!
            hl[8] = "#22c55e";
            labels[8] = "25 ✦";
            addStep(2, "algo.bst_insert.step_8", { node_nou: "25", acció: "return BinTree<int>(25)" });

            // Propagar reconstrucció cap amunt
            hl[5] = "#22c55e";
            addStep(4, "algo.bst_insert.step_9", { reconstruint: "BinTree(30, [25], null)" });
            hl[2] = "#22c55e";
            addStep(5, "algo.bst_insert.step_10", { reconstruint: "BinTree(20, [10], [30→25])" });
            hl[1] = "#22c55e";
            addStep(4, "algo.bst_insert.step_11", { cost: "O(log n)", arbre_final: "50" });

            return steps;
        }
    }
};

export const bst_insert: Simulation = {
    id: legacyAlgo.bst_insert.id,
    renderer: "graph",
    code: bst_insert_code,
    initialState: legacyAlgo.bst_insert.initialGraph,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.bst_insert.generateSteps().map((step: AlgoStep) => ({
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
