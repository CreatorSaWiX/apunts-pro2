import type { Simulation, SimulationStep } from "../../../engine/types";
import height_code from "../code/height/source.cpp?raw";

interface AlgoStep {
    line: number;
    description: string;
    highlights: Record<string | number, string>;
    nodeLabels?: Record<string | number, string>;
    links?: { source: string | number; target: string | number; label?: string; color?: string; curvature?: number }[];
    variables: Record<string, string>;
}

const legacyAlgo = {
    height: {
        id: "height",
        initialGraph: {
            nodes: [
                { id: 1, label: "1", fx: 0, fy: -80 },
                { id: 2, label: "2", fx: -60, fy: -10 },
                { id: 3, label: "3", fx: 60, fy: -10 },
                { id: 4, label: "4", fx: 30, fy: 60 }
            ],
            links: [
                { source: 1, target: 2 },
                { source: 1, target: 3 },
                { source: 3, target: 4 }
            ]
        },
        generateSteps: (): AlgoStep[] => {
            const steps: AlgoStep[] = [];

            const addStep = (
                line: number,
                desc: string,
                highlights: Record<number, string>,
                vars: Record<string, string> = {},
                labels?: Record<number, string>
            ) => {
                steps.push({
                    line,
                    description: desc,
                    highlights,
                    variables: vars,
                    nodeLabels: labels
                });
            };

            // 1. Inicia a l'arrel (1)
            addStep(1, "algo.height.step_1", { 1: "#facc15" }, { t: "1" });
            addStep(2, "algo.height.step_2", { 1: "#facc15" }, { t: "1" });

            // 2. Avalua el fill esquerre (2)
            addStep(3, "algo.height.step_3", { 1: "#8b5cf6", 2: "#facc15" }, { t: "2" });
            addStep(2, "algo.height.step_4", { 1: "#8b5cf6", 2: "#facc15" }, { t: "2" });
            addStep(3, "algo.height.step_5", { 1: "#8b5cf6", 2: "#facc15" }, { "h(esq)": "0", "h(dret)": "0", "càlcul": "1 + max(0, 0) = 1" });
            addStep(3, "algo.height.step_6", { 1: "#8b5cf6", 2: "#10b981" }, { "retorn": "1" }, { 2: "2 (h=1)" });

            // 3. Torna a l'arrel (1) i avalua el fill dret (3)
            addStep(3, "algo.height.step_7", { 1: "#8b5cf6", 2: "#10b981", 3: "#facc15" }, { "h(esq)": "1", t: "3" }, { 2: "2 (h=1)" });
            addStep(2, "algo.height.step_8", { 1: "#8b5cf6", 2: "#10b981", 3: "#facc15" }, { t: "3" }, { 2: "2 (h=1)" });

            // 4. Node 3 avalua el seu fill esquerre (4)
            addStep(3, "algo.height.step_9", { 1: "#8b5cf6", 2: "#10b981", 3: "#8b5cf6", 4: "#facc15" }, { t: "4" }, { 2: "2 (h=1)" });
            addStep(2, "algo.height.step_10", { 1: "#8b5cf6", 2: "#10b981", 3: "#8b5cf6", 4: "#facc15" }, { t: "4" }, { 2: "2 (h=1)" });
            addStep(3, "algo.height.step_11", { 1: "#8b5cf6", 2: "#10b981", 3: "#8b5cf6", 4: "#10b981" }, { "retorn": "1" }, { 2: "2 (h=1)", 4: "4 (h=1)" });

            // 5. Node 3 calcula la seva alçada: 1 + max(1, 0) = 2
            addStep(3, "algo.height.step_12", { 1: "#8b5cf6", 2: "#10b981", 3: "#10b981", 4: "#10b981" }, { "h(esq)": "1", "h(dret)": "0", "càlcul": "1 + max(1, 0) = 2" }, { 2: "2 (h=1)", 4: "4 (h=1)", 3: "3 (h=2)" });

            // 6. Arrel (1) calcula l'alçada total: 1 + max(1, 2) = 3
            addStep(3, "algo.height.step_13", { 1: "#22c55e", 2: "#10b981", 3: "#10b981", 4: "#10b981" }, { "h(esq)": "1", "h(dret)": "2", "alçada_total": "1 + max(1, 2) = 3" }, { 2: "2 (h=1)", 4: "4 (h=1)", 3: "3 (h=2)", 1: "1 (h=3)" });

            return steps;
        }
    }
};

export const height: Simulation = {
    id: legacyAlgo.height.id,
    renderer: "graph",
    code: height_code,
    initialState: legacyAlgo.height.initialGraph,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.height.generateSteps().map((step: AlgoStep) => ({
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
