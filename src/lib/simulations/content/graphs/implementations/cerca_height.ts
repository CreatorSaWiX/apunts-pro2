import type { Simulation, SimulationStep } from "../../../engine/types";
import cerca_height_code from "../code/cerca_height/source.cpp?raw";

interface AlgoStep {
    line: number;
    description: string;
    highlights: Record<string | number, string>;
    nodeLabels?: Record<string | number, string>;
    links?: { source: string | number; target: string | number; label?: string; color?: string; curvature?: number }[];
    variables: Record<string, string>;
}

const legacyAlgo = {
    cerca_height: {
        id: "cerca_height",
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
        generateSteps: (): AlgoStep[] => {
            const steps: AlgoStep[] = [];

            const addStep = (line: number, desc: string, highlights: Record<number, string>, vars: Record<string, string> = {}) => {
                steps.push({ line, description: desc, highlights, variables: vars });
            };

            // 1. Inicia a 50
            addStep(1, "algo.cerca_height.step_1", { 50: "#facc15" }, { t: "50", x: "30" });
            addStep(2, "algo.cerca_height.step_2", { 50: "#facc15" }, { t: "50", x: "30" });
            addStep(3, "algo.cerca_height.step_3", { 50: "#facc15" }, { "t.value()": "50", x: "30" });

            // 2. Va a l'esquerra (10)
            addStep(4, "algo.cerca_height.step_4", { 50: "#8b5cf6", 10: "#facc15" }, { t: "10", x: "30" });
            addStep(2, "algo.cerca_height.step_5", { 50: "#8b5cf6", 10: "#facc15" }, { t: "10", x: "30" });
            addStep(3, "algo.cerca_height.step_6", { 50: "#8b5cf6", 10: "#facc15" }, { "t.value()": "10", x: "30" });
            addStep(4, "algo.cerca_height.step_7", { 50: "#8b5cf6", 10: "#ef4444" }, { t: "10", retorn: "false" });

            // 3. Torna a 50 i va a la dreta (20)
            addStep(4, "algo.cerca_height.step_8", { 50: "#8b5cf6", 20: "#facc15" }, { t: "20", x: "30", "esq_res": "false" });
            addStep(2, "algo.cerca_height.step_9", { 50: "#8b5cf6", 20: "#facc15" }, { t: "20", x: "30" });
            addStep(3, "algo.cerca_height.step_10", { 50: "#8b5cf6", 20: "#facc15" }, { "t.value()": "20", x: "30" });

            // 4. Va a l'esquerra de 20 (30)
            addStep(4, "algo.cerca_height.step_11", { 50: "#8b5cf6", 20: "#8b5cf6", 30: "#facc15" }, { t: "30", x: "30" });
            addStep(2, "algo.cerca_height.step_12", { 50: "#8b5cf6", 20: "#8b5cf6", 30: "#facc15" }, { t: "30", x: "30" });
            addStep(3, "algo.cerca_height.step_13", { 50: "#8b5cf6", 20: "#8b5cf6", 30: "#22c55e" }, { "t.value()": "30", x: "30", retorn: "true" });

            // 5. Propaga true amunt
            addStep(4, "algo.cerca_height.step_14", { 50: "#8b5cf6", 20: "#22c55e", 30: "#22c55e" }, { t: "20", retorn: "true (curtcircuit)" });
            addStep(4, "algo.cerca_height.step_15", { 50: "#22c55e", 20: "#22c55e", 30: "#22c55e" }, { resultat: "true" });

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
