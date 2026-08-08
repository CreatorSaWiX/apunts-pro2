import type { Simulation, SimulationStep } from "../../../engine/types";

interface AlgoStep {
    line: number;
    description: string;
    highlights: Record<string | number, string>; // nodeId -> color
    nodeLabels?: Record<string | number, string>; // nodeId -> label text
    links?: { source: string | number; target: string | number; label?: string; color?: string; curvature?: number }[];
    variables: Record<string, string>;
}

const preordreCode = `void preordre(BinTree<int> t) {
    if (!t.empty()) {
        cout << t.value() << ' ';
        preordre(t.left());
        preordre(t.right());
    }
}`;

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

const legacyAlgo: Record<string, any> = {
    preordre: {
        id: "preordre",
        code: preordreCode,
        initialGraph: treeGraph,
        generateSteps: () => {
            const steps: AlgoStep[] = [];
            const W: number[] = [];
            const highlights: Record<number, string> = {};

            const addStep = (line: number, desc: string, currentNode: number) => {
                const nodeStr = currentNode === 0 ? "null" : currentNode.toString();
                steps.push({
                    line,
                    description: desc,
                    highlights: { ...highlights },
                    variables: { "Crida actual (t.value)": nodeStr, "Resultat (cout)": `[${W.join(', ')}]` }
                });
            };

            const recurse = (node: number | null) => {
                const nodeVal = node || 0;
                addStep(1, "algo.preordre.step_1", nodeVal);
                if (node === null) {
                    addStep(2, "algo.preordre.step_2", 0);
                    return;
                }

                highlights[node] = "#facc15"; // Yellow for visiting

                W.push(node);
                highlights[node] = "#10b981"; // Green for printed
                addStep(3, "algo.preordre.step_3", node);

                addStep(4, "algo.preordre.step_4", node);
                recurse(treeLeft[node]);

                addStep(5, "algo.preordre.step_5", node);
                recurse(treeRight[node]);

                highlights[node] = "#3b82f6"; // Blue for finished
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
    code: legacyAlgo.preordre.code,
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
