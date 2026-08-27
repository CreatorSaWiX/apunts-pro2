import type { Simulation, SimulationStep } from "../../../engine/types";
import list_insert_value_code from "../code/list_insert_value/source.cpp?raw";

interface AlgoStep {
    line: number;
    description: string;
    highlights: Record<string | number, string>; // nodeId -> color
    nodeLabels?: Record<string | number, string>; // nodeId -> label text
    links?: { source: string | number; target: string | number; label?: string; color?: string; curvature?: number }[];
    variables: Record<string, string>;
}

const legacyAlgo: Record<string, { id: string; initialGraph?: Record<string, unknown>; generateSteps: () => AlgoStep[] }> = {
    list_insert_value: {
        id: "list_insert_value",
        initialGraph: {
            nodes: [
                { id: 0, label: "pitemprev (A)", fx: -160, fy: 0, color: "#3b82f6" },
                { id: 1, label: "next (B)", fx: 160, fy: 0, color: "#3b82f6" },
                { id: 2, label: "pitem (N)", fx: 0, fy: -100, color: "rgba(255,255,255,0.05)" },
            ],
            links: [
                { source: 0, target: 1, curvature: 0.2, color: "#475569" },
                { source: 1, target: 0, curvature: 0.2, color: "#475569" },
            ]
        },
        generateSteps: () => {
            const steps: AlgoStep[] = [];
            const addStep = (line: number, desc: string, highlights: Record<number, string>, links: AlgoStep['links'], vars: Record<string, string>) => {
                steps.push({ line, description: desc, highlights, links, variables: vars });
            };

            const hBase = { 0: "#3b82f6", 1: "#3b82f6", 2: "rgba(255,255,255,0.05)" };
            const lBase = [
                { source: 0, target: 1, curvature: 0.2, color: "#475569" },
                { source: 1, target: 0, curvature: 0.2, color: "#475569" }
            ];

            addStep(1, "algo.list_insert_value.step_1", 
                { ...hBase }, [...lBase], { pitemprev: "A", value: "42" });

            addStep(2, "algo.list_insert_value.step_2", 
                { ...hBase, 2: "#facc15" }, [...lBase], { pitem: "Node N (0x...)" });

            addStep(3, "algo.list_insert_value.step_3", 
                { ...hBase, 2: "#10b981" }, [...lBase], { "pitem->value": "42" });

            const lFinal = [
                { source: 0, target: 2, curvature: 0.2, color: "#475569" },
                { source: 1, target: 2, curvature: -0.2, color: "#475569" },
                { source: 2, target: 1, curvature: -0.2, color: "#475569" },
                { source: 2, target: 0, curvature: 0.2, color: "#475569" }
            ];
            addStep(4, "algo.list_insert_value.step_4", 
                { 0: "#10b981", 1: "#10b981", 2: "#10b981" }, lFinal, { "pitem": "inserit" });

            return steps;
        }
    }
};

export const list_insert_value: Simulation = {
    id: legacyAlgo.list_insert_value.id,
    renderer: "graph",
    code: list_insert_value_code,
    initialState: legacyAlgo.list_insert_value.initialGraph,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.list_insert_value.generateSteps().map((step: AlgoStep) => ({
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
