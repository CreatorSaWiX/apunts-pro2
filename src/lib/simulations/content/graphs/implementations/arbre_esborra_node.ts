import type { Simulation, SimulationStep } from "../../../engine/types";
import arbre_esborra_node_code from "../code/arbre_esborra_node/source.cpp?raw";

interface AlgoStep {
    line: number;
    description: string;
    highlights: Record<string | number, string>; // nodeId -> color
    nodeLabels?: Record<string | number, string>; // nodeId -> label text
    links?: { source: string | number; target: string | number; label?: string; color?: string; curvature?: number }[];
    variables: Record<string, string>;
}

const legacyAlgo: Record<string, { id: string; initialGraph?: Record<string, unknown>; generateSteps: () => AlgoStep[] }> = {
    arbre_esborra_node: {
        id: "arbre_esborra_node",
        initialGraph: {
            nodes: [
                { id: "m", label: "7", fx: 0, fy: -80, color: "#3b82f6" },
                { id: "mE", label: "2", fx: -60, fy: 0, color: "#3b82f6" },
                { id: "mD", label: "9", fx: 60, fy: 0, color: "#3b82f6" }
            ],
            links: [
                { source: "m", target: "mE", color: "#475569" },
                { source: "m", target: "mD", color: "#475569" }
            ]
        },
        generateSteps: () => {
            const steps: AlgoStep[] = [];
            const addStep = (line: number, desc: string, highlights: Record<string, string>, links: AlgoStep['links'], vars: Record<string, string>) => {
                steps.push({ line, description: desc, highlights, links, variables: vars });
            };

            const lBase = [
                { source: "m", target: "mE", color: "#475569" },
                { source: "m", target: "mD", color: "#475569" }
            ];

            addStep(1, "algo.arbre_esborra_node.step_1", 
                { "m": "#facc15" }, [...lBase], { "m": "7" });

            addStep(3, "algo.arbre_esborra_node.step_2", 
                { "m": "#3b82f6", "mE": "#facc15" }, [...lBase], { "m": "2" });

            const l1 = [ { source: "m", target: "mD", color: "#475569" } ];
            addStep(5, "algo.arbre_esborra_node.step_3", 
                { "m": "#3b82f6", "mE": "rgba(0,0,0,0)" }, l1, { "deleted": "2" });

            addStep(4, "algo.arbre_esborra_node.step_4", 
                { "m": "#3b82f6", "mD": "#facc15" }, l1, { "m": "9" });

            const l2: AlgoStep['links'] = [];
            addStep(5, "algo.arbre_esborra_node.step_5", 
                { "m": "#3b82f6", "mD": "rgba(0,0,0,0)" }, l2, { "deleted": "9" });

            addStep(5, "algo.arbre_esborra_node.step_6", 
                { "m": "rgba(0,0,0,0)" }, l2, { "deleted": "7" });

            return steps;
        }
    }
};

export const arbre_esborra_node: Simulation = {
    id: legacyAlgo.arbre_esborra_node.id,
    renderer: "graph",
    code: arbre_esborra_node_code,
    initialState: legacyAlgo.arbre_esborra_node.initialGraph,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.arbre_esborra_node.generateSteps().map((step: AlgoStep) => ({
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
