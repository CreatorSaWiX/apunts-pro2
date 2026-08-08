import type { Simulation, SimulationStep } from "../../../engine/types";

interface AlgoStep {
    line: number;
    description: string;
    highlights: Record<string | number, string>; // nodeId -> color
    nodeLabels?: Record<string | number, string>; // nodeId -> label text
    links?: { source: string | number; target: string | number; label?: string; color?: string; curvature?: number }[];
    variables: Record<string, string>;
}

const legacyAlgo: Record<string, any> = {
    list_remove_all: {
        id: "list_remove_all",
        code: `void removeItem() {
    while (_size > 0) {
        removeItem(iteminf.next);
    }
}`,
        initialGraph: {
            nodes: [
                { id: "inf", label: "iteminf", fx: -160, fy: 0, color: "#3b82f6" },
                { id: 1, label: "Node 1", fx: -60, fy: 0, color: "#10b981" },
                { id: 2, label: "Node 2", fx: 60, fy: 0, color: "#10b981" },
                { id: "sup", label: "itemsup", fx: 160, fy: 0, color: "#3b82f6" }
            ],
            links: [
                { source: "inf", target: 1, curvature: 0.2, color: "#475569" },
                { source: 1, target: "inf", curvature: 0.2, color: "#475569" },
                { source: 1, target: 2, curvature: 0.2, color: "#475569" },
                { source: 2, target: 1, curvature: 0.2, color: "#475569" },
                { source: 2, target: "sup", curvature: 0.2, color: "#475569" },
                { source: "sup", target: 2, curvature: 0.2, color: "#475569" }
            ]
        },
        generateSteps: () => {
            const steps: AlgoStep[] = [];
            const addStep = (line: number, desc: string, highlights: Record<string, string>, links: any[], vars: Record<string, string>) => {
                steps.push({ line, description: desc, highlights, links, variables: vars });
            };

            const l0 = [
                { source: "inf", target: 1, curvature: 0.2, color: "#475569" },
                { source: 1, target: "inf", curvature: 0.2, color: "#475569" },
                { source: 1, target: 2, curvature: 0.2, color: "#475569" },
                { source: 2, target: 1, curvature: 0.2, color: "#475569" },
                { source: 2, target: "sup", curvature: 0.2, color: "#475569" },
                { source: "sup", target: 2, curvature: 0.2, color: "#475569" }
            ];

            addStep(1, "algo.list_remove_all.step_1", 
                { "inf": "#3b82f6", "sup": "#3b82f6" }, l0, { _size: "2" });

            addStep(2, "algo.list_remove_all.step_2", 
                { "inf": "#3b82f6", "sup": "#3b82f6" }, l0, { _size: "2 > 0" });

            addStep(3, "algo.list_remove_all.step_3", 
                { "inf": "#3b82f6", 1: "#ef4444" }, l0, { "iteminf.next": "Node 1" });

            const l1 = [
                { source: "inf", target: 2, curvature: 0.3, color: "#10b981" },
                { source: 2, target: "inf", curvature: 0.3, color: "#10b981" },
                { source: 2, target: "sup", curvature: 0.2, color: "#475569" },
                { source: "sup", target: 2, curvature: 0.2, color: "#475569" }
            ];
            addStep(3, "algo.list_remove_all.step_4", 
                { "inf": "#10b981", 1: "rgba(0,0,0,0)", 2: "#3b82f6", "sup": "#3b82f6" }, l1, { _size: "1" });

            addStep(2, "algo.list_remove_all.step_5", 
                { "inf": "#3b82f6", "sup": "#3b82f6" }, l1, { _size: "1 > 0" });

            addStep(3, "algo.list_remove_all.step_6", 
                { "inf": "#3b82f6", 2: "#ef4444" }, l1, { "iteminf.next": "Node 2" });

            const l2 = [
                { source: "inf", target: "sup", curvature: 0.2, color: "#10b981" },
                { source: "sup", target: "inf", curvature: 0.2, color: "#10b981" }
            ];
            addStep(3, "algo.list_remove_all.step_7", 
                { "inf": "#10b981", 1: "rgba(0,0,0,0)", 2: "rgba(0,0,0,0)", "sup": "#10b981" }, l2, { _size: "0" });

            addStep(2, "algo.list_remove_all.step_8", 
                { "inf": "#3b82f6", "sup": "#3b82f6" }, l2, { _size: "0" });

            return steps;
        }
    }
};

export const list_remove_all: Simulation = {
    id: legacyAlgo.list_remove_all.id,
    renderer: "graph",
    code: legacyAlgo.list_remove_all.code,
    initialState: legacyAlgo.list_remove_all.initialGraph,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.list_remove_all.generateSteps().map((step: AlgoStep) => ({
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
