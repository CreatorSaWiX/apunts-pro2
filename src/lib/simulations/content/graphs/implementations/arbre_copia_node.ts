import type { Simulation, SimulationStep } from "../../../engine/types";
import arbre_copia_node_code from "../code/arbre_copia_node/source.cpp?raw";

interface AlgoStep {
    line: number;
    description: string;
    highlights: Record<string | number, string>; // nodeId -> color
    nodeLabels?: Record<string | number, string>; // nodeId -> label text
    links?: { source: string | number; target: string | number; label?: string; color?: string; curvature?: number }[];
    variables: Record<string, string>;
}

const legacyAlgo: Record<string, { id: string; initialGraph?: Record<string, unknown>; generateSteps: () => AlgoStep[] }> = {
    arbre_copia_node: {
        id: "arbre_copia_node",
        initialGraph: {
            nodes: [
                { id: "m", label: "m (7)", fx: -100, fy: -80, color: "#8b5cf6" },
                { id: "mE", label: "mE (2)", fx: -160, fy: 0, color: "#8b5cf6" },
                { id: "mD", label: "mD (9)", fx: -40, fy: 0, color: "#8b5cf6" },
                { id: "n", label: "n (7)", fx: 100, fy: -80, color: "rgba(0,0,0,0)" },
                { id: "nE", label: "nE (2)", fx: 40, fy: 0, color: "rgba(0,0,0,0)" },
                { id: "nD", label: "nD (9)", fx: 160, fy: 0, color: "rgba(0,0,0,0)" }
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

            addStep(1, "algo.arbre_copia_node.step_1", 
                { "m": "#facc15" }, [...lBase], { "m": "7" });

            addStep(4, "algo.arbre_copia_node.step_2", 
                { "m": "#3b82f6", "n": "#facc15" }, [...lBase], { "n->info": "7" });

            addStep(7, "algo.arbre_copia_node.step_3", 
                { "mE": "#facc15", "n": "#3b82f6" }, [...lBase], { "m": "2" });

            addStep(4, "algo.arbre_copia_node.step_4", 
                { "mE": "#3b82f6", "nE": "#facc15", "n": "#3b82f6" }, [...lBase], { "nE->info": "2" });

            const l1 = [ ...lBase, { source: "n", target: "nE", color: "#10b981" } ];
            addStep(7, "algo.arbre_copia_node.step_5", 
                { "n": "#10b981", "nE": "#3b82f6" }, l1, { "n->segE": "nE" });

            addStep(8, "algo.arbre_copia_node.step_6", 
                { "mD": "#facc15", "n": "#3b82f6", "nE": "#3b82f6" }, l1, { "m": "9" });

            addStep(4, "algo.arbre_copia_node.step_7", 
                { "mD": "#3b82f6", "nD": "#facc15", "n": "#3b82f6", "nE": "#3b82f6" }, l1, { "nD->info": "9" });

            const l2 = [ ...l1, { source: "n", target: "nD", color: "#10b981" } ];
            addStep(8, "algo.arbre_copia_node.step_8", 
                { "n": "#10b981", "nE": "#3b82f6", "nD": "#3b82f6" }, l2, { "n->segD": "nD" });

            addStep(10, "algo.arbre_copia_node.step_9", 
                { "n": "#22c55e", "nE": "#22c55e", "nD": "#22c55e" }, l2, { "return": "n" });

            return steps;
        }
    }
};

export const arbre_copia_node: Simulation = {
    id: legacyAlgo.arbre_copia_node.id,
    renderer: "graph",
    code: arbre_copia_node_code,
    initialState: legacyAlgo.arbre_copia_node.initialGraph,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.arbre_copia_node.generateSteps().map((step: AlgoStep) => ({
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
