import type { Simulation, SimulationStep } from "../../../engine/types";
import cerca_height_code from "../code/cerca_height/source.cpp?raw";

interface AlgoStep {
    line: number;
    description: string;
    highlights: Record<string | number, string>; // nodeId -> color
    nodeLabels?: Record<string | number, string>; // nodeId -> label text
    links?: { source: string | number; target: string | number; label?: string; color?: string; curvature?: number }[];
    variables: Record<string, string>;
}

const cercaHeightCode = `int height(BinTree<int> t) {
    if (t.empty()) return 0;
    return 1 + max(height(t.left()), height(t.right()));
}

bool cerca(const BinTree<int>& t, int x) {
    if (t.empty()) return false;
    if (t.value() == x) return true;
    return cerca(t.left(), x) || cerca(t.right(), x);
}`;

const legacyAlgo: Record<string, { id: string; code?: string; initialGraph?: Record<string, unknown>; generateSteps: () => AlgoStep[] }> = {
    cerca_height: {
        id: "cerca_height",
        code: cercaHeightCode,
        initialGraph: {
            nodes: [
                { id: 50, label: "50", fx: 0, fy: -100 },
                { id: 10, label: "10 (L)", fx: -60, fy: -20 },
                { id: 20, label: "20 (R)", fx: 60, fy: -20 },
                { id: 30, label: "30", fx: 30, fy: 60 }
            ],
            links: [
                { source: 50, target: 10 },
                { source: 50, target: 20 },
                { source: 20, target: 30 }
            ]
        },
        generateSteps: () => {
            const steps: AlgoStep[] = [];
            let highlights: Record<number, string> = {};

            const addStep = (line: number, desc: string, vars: Record<string, string> = {}) => {
                steps.push({ line, description: desc, highlights: { ...highlights }, variables: vars });
            };

            addStep(1, "algo.cerca_height.step_1", { t: "BinTree(10)" });
            highlights[10] = "#facc15"; // yellow, reading
            addStep(2, "algo.cerca_height.step_2", { t: "BinTree(10)" });

            highlights[10] = "#10b981"; // moving to eval children
            addStep(3, "algo.cerca_height.step_3", { t: "BinTree(10)", max: "max(height(null), ?)" });

            // left child of 10 is empty
            addStep(1, "algo.cerca_height.step_4", { t: "BinTree()", node: "null" });
            addStep(2, "algo.cerca_height.step_5", { t: "BinTree()", returned: "0" });

            addStep(3, "algo.cerca_height.step_6", { t: "BinTree(10)", returned: "1" });

            // Now start cerca
            highlights = {};
            addStep(6, "algo.cerca_height.step_7", { t: "BinTree(50)", x: "30", h: "1" });
            highlights[50] = "#facc15"; // yellow
            addStep(7, "algo.cerca_height.step_8", { t: "BinTree(50)", x: "30" });
            addStep(8, "algo.cerca_height.step_9", { t: "BinTree(50)", x: "30" });

            highlights[50] = "#8b5cf6"; // purple branch left
            highlights[10] = "#facc15";
            addStep(9, "algo.cerca_height.step_10", { t: "BinTree(10)", x: "30" });
            addStep(8, "algo.cerca_height.step_11", { t: "BinTree(10)", x: "30" });
            highlights[10] = "#ef4444"; // red, dead end
            addStep(9, "algo.cerca_height.step_12", { t: "BinTree(10)", returned: "false" });

            highlights[50] = "#3b82f6"; // inspecting right
            highlights[20] = "#facc15";
            addStep(9, "algo.cerca_height.step_13", { t: "BinTree(20)", x: "30", l_res: "false" });
            addStep(8, "algo.cerca_height.step_14", { t: "BinTree(20)", x: "30" });

            highlights[20] = "#10b981"; // path ok
            highlights[30] = "#facc15";
            addStep(9, "algo.cerca_height.step_15", { t: "BinTree(30)", x: "30" });
            highlights[30] = "#22c55e"; // bright green success
            addStep(8, "algo.cerca_height.step_16", { t: "BinTree(30)", x: "30 // = x" });

            highlights[20] = "#22c55e";
            addStep(9, "algo.cerca_height.step_17", { t: "BinTree(20)", x: "30", res: "true // salt dreta" });

            highlights[50] = "#22c55e";
            addStep(6, "algo.cerca_height.step_18", { res_final: "true" });

            return steps;
        }
    }
};

export const cerca_height: Simulation = {
    id: legacyAlgo.cerca_height.id,
    renderer: "graph",
    code: cerca_height_code,
    initialState: legacyAlgo.cerca_height.initialGraph,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.cerca_height.generateSteps().map((step: AlgoStep) => ({
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
