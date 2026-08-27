import type { Simulation, SimulationStep } from "../../../engine/types";
import bst_search_code from "../code/bst_search/source.cpp?raw";

interface AlgoStep {
    line: number;
    description: string;
    highlights: Record<string | number, string>; // nodeId -> color
    nodeLabels?: Record<string | number, string>; // nodeId -> label text
    links?: { source: string | number; target: string | number; label?: string; color?: string; curvature?: number }[];
    variables: Record<string, string>;
}

const bstGraph = {
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
};

const bstVal = { 1: 50, 2: 20, 3: 80, 4: 10, 5: 30, 6: 70, 7: 90 };

const legacyAlgo: Record<string, { id: string; initialGraph?: Record<string, unknown>; generateSteps: () => AlgoStep[] }> = {
    bst_search: {
        id: "bst_search",
        initialGraph: bstGraph,
        generateSteps: () => {
            const steps: AlgoStep[] = [];
            const hl: Record<number, string> = {};
            // Cercar x = 30. Camí: 50 -> 20 -> 30 (TROBAT)
            const addStep = (line: number, desc: string, vars: Record<string, string> = {}) => {
                steps.push({ line, description: desc, highlights: { ...hl }, nodeLabels: { ...Object.fromEntries(Object.entries(bstVal).map(([k,v]) => [k, String(v)])) }, variables: vars });
            };

            addStep(1, "algo.bst_search.step_1", { x: "30", node: "arrel" });

            // Pas 1: node 50
            hl[1] = "#facc15";
            addStep(2, "algo.bst_search.step_2", { node: "50", x: "30" });
            addStep(3, "algo.bst_search.step_3", { node: "50", x: "30", cond: "30 ≠ 50" });
            addStep(4, "algo.bst_search.step_4", { node: "50", x: "30", cond: "30 < 50 → esquerra" });
            hl[1] = "#475569"; // gris: visitat
            hl[3] = "#1e293b"; hl[6] = "#1e293b"; hl[7] = "#1e293b"; // descartar subarbre dret

            // Pas 2: node 20
            hl[2] = "#facc15";
            addStep(2, "algo.bst_search.step_5", { node: "20", x: "30" });
            addStep(3, "algo.bst_search.step_6", { node: "20", x: "30", cond: "30 ≠ 20" });
            addStep(5, "algo.bst_search.step_7", { node: "20", x: "30", cond: "30 > 20 → dreta" });
            hl[2] = "#475569";
            hl[4] = "#1e293b"; // descartar subarbre esquerre (10)

            // Pas 3: node 30 - TROBAT!
            hl[5] = "#facc15";
            addStep(2, "algo.bst_search.step_8", { node: "30", x: "30" });
            hl[5] = "#22c55e";
            addStep(3, "algo.bst_search.step_9", { node: "30", x: "30", cond: "30 == 30 → true", return: "true" });
            hl[2] = "#22c55e";
            hl[1] = "#22c55e";
            addStep(3, "algo.bst_search.step_10", { comparacions: "3", cost: "O(log n)" });

            return steps;
        }
    }
};

export const bst_search: Simulation = {
    id: legacyAlgo.bst_search.id,
    renderer: "graph",
    code: bst_search_code,
    initialState: legacyAlgo.bst_search.initialGraph,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.bst_search.generateSteps().map((step: AlgoStep) => ({
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
