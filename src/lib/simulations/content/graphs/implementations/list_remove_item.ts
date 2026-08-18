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
    list_remove_item: {
        id: "list_remove_item",
        code: `void removeItem(Item *pitem) {
    extractItem(pitem);
    delete pitem;
}`,
        initialGraph: {
            nodes: [
                { id: 0, label: "prev (A)", fx: -160, fy: 0, color: "#3b82f6" },
                { id: 1, label: "pitem (N)", fx: 0, fy: 0, color: "#ef4444" },
                { id: 2, label: "next (B)", fx: 160, fy: 0, color: "#3b82f6" }
            ],
            links: [
                { source: 0, target: 1, curvature: 0.2, color: "#475569" },
                { source: 1, target: 0, curvature: 0.2, color: "#475569" },
                { source: 1, target: 2, curvature: 0.2, color: "#475569" },
                { source: 2, target: 1, curvature: 0.2, color: "#475569" }
            ]
        },
        generateSteps: () => {
            const steps: AlgoStep[] = [];
            const addStep = (line: number, desc: string, highlights: Record<number, string>, links: AlgoStep['links'], vars: Record<string, string>) => {
                steps.push({ line, description: desc, highlights, links, variables: vars });
            };

            const lBase = [
                { source: 0, target: 1, curvature: 0.2, color: "#475569" },
                { source: 1, target: 0, curvature: 0.2, color: "#475569" },
                { source: 1, target: 2, curvature: 0.2, color: "#475569" },
                { source: 2, target: 1, curvature: 0.2, color: "#475569" }
            ];

            addStep(1, "algo.list_remove_item.step_1", 
                { 0: "#3b82f6", 1: "#ef4444", 2: "#3b82f6" }, lBase, { pitem: "N" });

            const lExtracted = [
                { source: 0, target: 2, curvature: 0.3, color: "#10b981" }, // A -> B
                { source: 1, target: 0, curvature: 0.2, color: "rgba(71,85,105,0.2)" }, // (ghost)
                { source: 1, target: 2, curvature: 0.2, color: "rgba(71,85,105,0.2)" }, // (ghost)
                { source: 2, target: 0, curvature: 0.3, color: "#10b981" }
            ];
            addStep(2, "algo.list_remove_item.step_2", 
                { 0: "#10b981", 1: "rgba(239,68,68,0.5)", 2: "#10b981" }, lExtracted, { pitem: "N (extret)" });

            const lDeleted = [
                { source: 0, target: 2, curvature: 0.3, color: "#475569" }, // A -> B
                { source: 2, target: 0, curvature: 0.3, color: "#475569" }
            ];
            addStep(3, "algo.list_remove_item.step_3", 
                { 0: "#3b82f6", 1: "rgba(0,0,0,0)", 2: "#3b82f6" }, lDeleted, { pitem: "N (destruït)" });

            return steps;
        }
    }
};

export const list_remove_item: Simulation = {
    id: legacyAlgo.list_remove_item.id,
    renderer: "graph",
    code: legacyAlgo.list_remove_item.code,
    initialState: legacyAlgo.list_remove_item.initialGraph,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.list_remove_item.generateSteps().map((step: AlgoStep) => ({
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
