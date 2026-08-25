import type { Simulation, SimulationStep } from "../../../engine/types";
import preordre_code from "../code/preordre/source.cpp?raw";

interface AlgoStep {
    line: number;
    description: string;
    highlights: Record<string | number, string>;
    nodeLabels?: Record<string | number, string>;
    links?: { source: string | number; target: string | number; label?: string; color?: string; curvature?: number }[];
    variables: Record<string, string>;
}

const treeGraph = {
    nodes: [
        { id: 1, label: "1", fx: 0, fy: -100 },
        { id: 2, label: "2", fx: -60, fy: -20 },
        { id: 3, label: "3", fx: 60, fy: -20 },
        { id: 4, label: "4", fx: -90, fy: 60 },
        { id: 5, label: "5", fx: -30, fy: 60 },
        { id: 6, label: "6", fx: 30, fy: 60 },
        { id: 7, label: "7", fx: 90, fy: 60 }
    ],
    links: [
        { source: 1, target: 2 },
        { source: 1, target: 3 },
        { source: 2, target: 4 },
        { source: 2, target: 5 },
        { source: 3, target: 6 },
        { source: 3, target: 7 }
    ]
};

const treeLeft: Record<number, number | null> = { 1: 2, 2: 4, 3: 6, 4: null, 5: null, 6: null, 7: null };
const treeRight: Record<number, number | null> = { 1: 3, 2: 5, 3: 7, 4: null, 5: null, 6: null, 7: null };

const legacyAlgo = {
    preordre: {
        id: "preordre",
        initialGraph: treeGraph,
        generateSteps: (): AlgoStep[] => {
            const steps: AlgoStep[] = [];
            const W: number[] = [];
            const highlights: Record<number, string> = {};

            const addStep = (line: number, desc: string, currentNode: number | null) => {
                const nodeStr = currentNode === null ? "null" : currentNode.toString();
                steps.push({
                    line,
                    description: desc,
                    highlights: { ...highlights },
                    variables: {
                        node: nodeStr,
                        "Node actual": nodeStr,
                        "Sortida (cout)": W.length > 0 ? W.join(' ') : "(buit)"
                    }
                });
            };

            const recurse = (node: number | null) => {
                if (node === null) {
                    addStep(1, "algo.preordre.step_1_null", null);
                    addStep(2, "algo.preordre.step_2_empty", null);
                    return;
                }

                addStep(1, "algo.preordre.step_1", node);
                addStep(2, "algo.preordre.step_2_not_empty", node);

                // Imprimeix arrel
                W.push(node);
                highlights[node] = "#10b981"; // Green for printed
                addStep(3, "algo.preordre.step_3", node);

                // Fill esquerre
                addStep(4, "algo.preordre.step_4", node);
                recurse(treeLeft[node]);

                // Fill dret
                addStep(5, "algo.preordre.step_5", node);
                recurse(treeRight[node]);

                highlights[node] = "#3b82f6"; // Blue for completed
                addStep(6, "algo.preordre.step_6", node);
            };

            recurse(1);
            addStep(7, "algo.preordre.step_7", 1);
            return steps;
        }
    }
};

export const preordre: Simulation = {
    id: legacyAlgo.preordre.id,
    renderer: "graph",
    code: preordre_code,
    initialState: legacyAlgo.preordre.initialGraph,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.preordre.generateSteps().map((step: AlgoStep) => ({
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
