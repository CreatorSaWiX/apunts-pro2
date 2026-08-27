import type { Simulation, SimulationStep } from "../../../engine/types";
import tree_general_search_code from "../code/tree_general_search/source.cpp?raw";

interface AlgoStep {
    line: number;
    description: string;
    highlights: Record<string | number, string>; // nodeId -> color
    nodeLabels?: Record<string | number, string>; // nodeId -> label text
    links?: { source: string | number; target: string | number; label?: string; color?: string; curvature?: number }[];
    variables: Record<string, string>;
}

const legacyAlgo: Record<string, { id: string; initialGraph?: Record<string, unknown>; generateSteps: () => AlgoStep[] }> = {
    tree_general_search: {
        id: "tree_general_search",
        initialGraph: {
            nodes: [
                { id: 1, label: "50", fx: 0, fy: -100 },
                { id: 2, label: "20", fx: -60, fy: 0 },
                { id: 3, label: "30", fx: 0, fy: 0 },
                { id: 4, label: "80", fx: 60, fy: 0 },
                { id: 5, label: "10", fx: 30, fy: 100 },
                { id: 6, label: "90", fx: 90, fy: 100 }
            ],
            links: [
                { source: 1, target: 2 },
                { source: 1, target: 3 },
                { source: 1, target: 4 },
                { source: 4, target: 5 },
                { source: 4, target: 6 }
            ]
        },
        generateSteps: () => {
            const steps: AlgoStep[] = [];
            const hl: Record<number, string> = {};
            const labels: Record<number, string> = {
                1: "50", 2: "20", 3: "30", 4: "80", 5: "10", 6: "90"
            };
            const addStep = (line: number, desc: string, vars: Record<string, string> = {}) => {
                steps.push({ line, description: desc, highlights: { ...hl }, nodeLabels: { ...labels }, variables: vars });
            };

            addStep(1, "algo.tree_general_search.step_1", { x: "90", node_actual: "50" });
            hl[1] = "#facc15";
            addStep(2, "algo.tree_general_search.step_2", { cond: "empty()" });
            addStep(3, "algo.tree_general_search.step_3", { cond: "50 == 90 (F)" });

            addStep(5, "algo.tree_general_search.step_4", { iter: "0 de 3" });
            hl[2] = "#facc15";
            addStep(6, "algo.tree_general_search.step_5", { recursiu: "child(0)" });

            hl[2] = "#ef4444";
            addStep(2, "algo.tree_general_search.step_6", { estat: "Mort", num_child: "0" });
            addStep(10, "algo.tree_general_search.step_7", { retorn: "False" });

            hl[3] = "#facc15"; delete hl[2];
            addStep(6, "algo.tree_general_search.step_8", { iter: "1 de 3" });
            hl[3] = "#ef4444";
            addStep(2, "algo.tree_general_search.step_9", { node_actual: "30", num_child: "0", retorn: "False" });

            hl[4] = "#facc15"; delete hl[3];
            addStep(6, "algo.tree_general_search.step_10", { iter: "2 de 3" });
            addStep(3, "algo.tree_general_search.step_11", { node_actual: "80", num_child: "2" });

            hl[5] = "#ef4444";
            addStep(2, "algo.tree_general_search.step_12", { node_actual: "10", retorn: "False" });

            hl[6] = "#10b981"; delete hl[5];
            addStep(6, "algo.tree_general_search.step_13", { the_node: "90" });

            hl[6] = "#22c55e";
            addStep(3, "algo.tree_general_search.step_14", { node_actual: "90", bool: "TRUE" });

            hl[4] = "#22c55e";
            addStep(7, "algo.tree_general_search.step_15", { bool: "TRUE" });

            hl[1] = "#22c55e";
            addStep(7, "algo.tree_general_search.step_16", { return_final: "TRUE" });

            return steps;
        }
    }
};

export const tree_general_search: Simulation = {
    id: legacyAlgo.tree_general_search.id,
    renderer: "graph",
    code: tree_general_search_code,
    initialState: legacyAlgo.tree_general_search.initialGraph,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.tree_general_search.generateSteps().map((step: AlgoStep) => ({
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
