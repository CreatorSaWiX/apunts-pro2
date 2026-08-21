import type { Simulation, SimulationStep } from "../../../engine/types";
import list_copy_items_code from "../code/list_copy_items/source.cpp?raw";

interface AlgoStep {
    line: number;
    description: string;
    highlights: Record<string | number, string>; // nodeId -> color
    nodeLabels?: Record<string | number, string>; // nodeId -> label text
    links?: { source: string | number; target: string | number; label?: string; color?: string; curvature?: number }[];
    variables: Record<string, string>;
}

const legacyAlgo: Record<string, { id: string; code?: string; initialGraph?: Record<string, unknown>; generateSteps: () => AlgoStep[] }> = {
    list_copy_items: {
        id: "list_copy_items",
        code: `void copyItems(const List& l) {
    for (Item *pitem = l.itemsup.prev; pitem != &l.iteminf; pitem = pitem->prev) {
        insertItem(&iteminf, pitem->value);
    }
}`,
        initialGraph: {
            nodes: [
                { id: "l_inf", label: "l.inf", fx: -160, fy: -60, color: "#8b5cf6" },
                { id: "l_1", label: "X", fx: -60, fy: -60, color: "#8b5cf6" },
                { id: "l_2", label: "Y", fx: 60, fy: -60, color: "#8b5cf6" },
                { id: "l_sup", label: "l.sup", fx: 160, fy: -60, color: "#8b5cf6" },
                { id: "inf", label: "iteminf", fx: -160, fy: 60, color: "#3b82f6" },
                { id: "sup", label: "itemsup", fx: 160, fy: 60, color: "#3b82f6" },
                { id: "new_X", label: "Còpia X", fx: -60, fy: 60, color: "rgba(0,0,0,0)" },
                { id: "new_Y", label: "Còpia Y", fx: 60, fy: 60, color: "rgba(0,0,0,0)" }
            ],
            links: [
                { source: "l_inf", target: "l_1", curvature: 0.2, color: "rgba(71,85,105,0.4)" },
                { source: "l_1", target: "l_inf", curvature: 0.2, color: "rgba(71,85,105,0.4)" },
                { source: "l_1", target: "l_2", curvature: 0.2, color: "rgba(71,85,105,0.4)" },
                { source: "l_2", target: "l_1", curvature: 0.2, color: "rgba(71,85,105,0.4)" },
                { source: "l_2", target: "l_sup", curvature: 0.2, color: "rgba(71,85,105,0.4)" },
                { source: "l_sup", target: "l_2", curvature: 0.2, color: "rgba(71,85,105,0.4)" },
                { source: "inf", target: "sup", curvature: 0.2, color: "#475569" },
                { source: "sup", target: "inf", curvature: 0.2, color: "#475569" }
            ]
        },
        generateSteps: () => {
            const steps: AlgoStep[] = [];
            const addStep = (line: number, desc: string, highlights: Record<string, string>, links: AlgoStep['links'], vars: Record<string, string>) => {
                steps.push({ line, description: desc, highlights, links, variables: vars });
            };

            const lBase = [
                { source: "l_inf", target: "l_1", curvature: 0.2, color: "rgba(71,85,105,0.4)" },
                { source: "l_1", target: "l_inf", curvature: 0.2, color: "rgba(71,85,105,0.4)" },
                { source: "l_1", target: "l_2", curvature: 0.2, color: "rgba(71,85,105,0.4)" },
                { source: "l_2", target: "l_1", curvature: 0.2, color: "rgba(71,85,105,0.4)" },
                { source: "l_2", target: "l_sup", curvature: 0.2, color: "rgba(71,85,105,0.4)" },
                { source: "l_sup", target: "l_2", curvature: 0.2, color: "rgba(71,85,105,0.4)" },
                { source: "inf", target: "sup", curvature: 0.2, color: "#475569" },
                { source: "sup", target: "inf", curvature: 0.2, color: "#475569" }
            ];

            addStep(2, "algo.list_copy_items.step_1", 
                { "l_2": "#facc15" }, [...lBase], { "pitem": "Y" });

            const l1 = [
                ...lBase.slice(0, 6),
                { source: "inf", target: "new_Y", curvature: 0.2, color: "#10b981" },
                { source: "new_Y", target: "inf", curvature: 0.2, color: "#10b981" },
                { source: "new_Y", target: "sup", curvature: 0.2, color: "#10b981" },
                { source: "sup", target: "new_Y", curvature: 0.2, color: "#10b981" }
            ];
            addStep(3, "algo.list_copy_items.step_2", 
                { "l_2": "#10b981", "new_Y": "#10b981" }, l1, { "pitem": "Y", action: "insertItem(&iteminf, Y)" });

            addStep(2, "algo.list_copy_items.step_3", 
                { "l_1": "#facc15", "new_Y": "#3b82f6" }, l1, { "pitem": "X" });

            const l2 = [
                ...lBase.slice(0, 6),
                { source: "inf", target: "new_X", curvature: 0.2, color: "#10b981" },
                { source: "new_X", target: "inf", curvature: 0.2, color: "#10b981" },
                { source: "new_X", target: "new_Y", curvature: 0.2, color: "#10b981" },
                { source: "new_Y", target: "new_X", curvature: 0.2, color: "#10b981" },
                { source: "new_Y", target: "sup", curvature: 0.2, color: "#475569" },
                { source: "sup", target: "new_Y", curvature: 0.2, color: "#475569" }
            ];
            addStep(3, "algo.list_copy_items.step_4", 
                { "l_1": "#10b981", "new_X": "#10b981", "new_Y": "#3b82f6" }, l2, { "pitem": "X" });

            addStep(2, "algo.list_copy_items.step_5", 
                { "l_inf": "#ef4444", "new_X": "#3b82f6", "new_Y": "#3b82f6" }, l2, { "pitem": "&l.iteminf" });

            return steps;
        }
    }
};

export const list_copy_items: Simulation = {
    id: legacyAlgo.list_copy_items.id,
    renderer: "graph",
    code: list_copy_items_code,
    initialState: legacyAlgo.list_copy_items.initialGraph,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.list_copy_items.generateSteps().map((step: AlgoStep) => ({
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
