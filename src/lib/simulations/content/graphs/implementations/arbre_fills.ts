import type { Simulation, SimulationStep } from "../../../engine/types";

interface AlgoStep {
    line: number;
    description: string;
    highlights: Record<string | number, string>; // nodeId -> color
    nodeLabels?: Record<string | number, string>; // nodeId -> label text
    links?: { source: string | number; target: string | number; label?: string; color?: string; curvature?: number }[];
    variables: Record<string, string>;
}

const legacyAlgo: Record<string, { id: string; code?: string; initialGraph?: Record<string, unknown>; generateSteps: () => AlgoStep[] }> = {
    arbre_fills: {
        id: "arbre_fills",
        code: `void fills(Arbre &fe, Arbre &fd) {
    node_arbre* aux = primer_node;
    fe.primer_node = aux->segE;
    fd.primer_node = aux->segD;
    primer_node = NULL;
    delete aux;
}`,
        initialGraph: {
            nodes: [
                { id: "m", label: "this (7)", fx: 0, fy: -80, color: "#facc15" },
                { id: "mE", label: "fe (2)", fx: -60, fy: 0, color: "#10b981" },
                { id: "mD", label: "fd (9)", fx: 60, fy: 0, color: "#8b5cf6" }
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

            addStep(1, "algo.arbre_fills.step_1", 
                { "m": "#facc15", "mE": "#10b981", "mD": "#8b5cf6" }, [...lBase], { "aux": "primer_node" });

            const l1 = [ { source: "m", target: "mD", color: "#475569" } ];
            addStep(3, "algo.arbre_fills.step_2", 
                { "m": "#facc15", "mE": "#22c55e", "mD": "#8b5cf6" }, l1, { "fe.primer_node": "aux->segE" });

            addStep(4, "algo.arbre_fills.step_3", 
                { "m": "#facc15", "mE": "#22c55e", "mD": "#22c55e" }, [], { "fd.primer_node": "aux->segD" });

            addStep(5, "algo.arbre_fills.step_4", 
                { "m": "#ef4444", "mE": "#22c55e", "mD": "#22c55e" }, [], { "primer_node": "NULL" });

            addStep(6, "algo.arbre_fills.step_5", 
                { "m": "rgba(0,0,0,0)", "mE": "#22c55e", "mD": "#22c55e" }, [], { "aux": "deleted" });

            return steps;
        }
    }
};

export const arbre_fills: Simulation = {
    id: legacyAlgo.arbre_fills.id,
    renderer: "graph",
    code: legacyAlgo.arbre_fills.code,
    initialState: legacyAlgo.arbre_fills.initialGraph,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.arbre_fills.generateSteps().map((step: AlgoStep) => ({
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
