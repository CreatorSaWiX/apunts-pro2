import type { Simulation, SimulationStep } from "../../../engine/types";
import list_extract_item_code from "../code/list_extract_item/source.cpp?raw";

interface AlgoStep {
    line: number;
    description: string;
    highlights: Record<string | number, string>; // nodeId -> color
    nodeLabels?: Record<string | number, string>; // nodeId -> label text
    links?: { source: string | number; target: string | number; label?: string; color?: string; curvature?: number }[];
    variables: Record<string, string>;
}

const legacyAlgo: Record<string, { id: string; code?: string; initialGraph?: Record<string, unknown>; generateSteps: () => AlgoStep[] }> = {
    list_extract_item: {
        id: "list_extract_item",
        code: `void extractItem(Item *pitem) {
    pitem->next->prev = pitem->prev;
    pitem->prev->next = pitem->next;
    _size--;
}`,
        initialGraph: {
            nodes: [
                { id: 0, label: "prev (A)", fx: -160, fy: 0, color: "#3b82f6" },
                { id: 1, label: "pitem (N)", fx: 0, fy: 0, color: "#10b981" },
                { id: 2, label: "next (B)", fx: 160, fy: 0, color: "#3b82f6" }
            ],
            links: [
                { source: 0, target: 1, curvature: 0.2, color: "#475569" }, // A -> N
                { source: 1, target: 0, curvature: 0.2, color: "#475569" }, // N -> A
                { source: 1, target: 2, curvature: 0.2, color: "#475569" }, // N -> B
                { source: 2, target: 1, curvature: 0.2, color: "#475569" }  // B -> N
            ]
        },
        generateSteps: () => {
            const steps: AlgoStep[] = [];
            const addStep = (line: number, desc: string, highlights: Record<number, string>, links: AlgoStep['links'], vars: Record<string, string>) => {
                steps.push({ line, description: desc, highlights, links, variables: vars });
            };

            const hBase = { 0: "#3b82f6", 1: "#10b981", 2: "#3b82f6" };
            const lBase = [
                { source: 0, target: 1, curvature: 0.2, color: "#475569" },
                { source: 1, target: 0, curvature: 0.2, color: "#475569" },
                { source: 1, target: 2, curvature: 0.2, color: "#475569" },
                { source: 2, target: 1, curvature: 0.2, color: "#475569" }
            ];

            addStep(1, "algo.list_extract_item.step_1", 
                { ...hBase }, [...lBase], { pitem: "N" });

            const l2 = [
                { source: 0, target: 1, curvature: 0.2, color: "#475569" },
                { source: 1, target: 0, curvature: 0.2, color: "#475569" },
                { source: 1, target: 2, curvature: 0.2, color: "#475569" },
                { source: 2, target: 0, curvature: 0.3, color: "#facc15" } // B -> A
            ];
            addStep(2, "algo.list_extract_item.step_2", 
                { 0: "#facc15", 1: "#10b981", 2: "#3b82f6" }, l2, { "pitem->next->prev": "A" });

            const l3 = [
                { source: 0, target: 2, curvature: 0.3, color: "#facc15" }, // A -> B
                { source: 1, target: 0, curvature: 0.2, color: "rgba(71,85,105,0.2)" }, // (ghost)
                { source: 1, target: 2, curvature: 0.2, color: "rgba(71,85,105,0.2)" }, // (ghost)
                { source: 2, target: 0, curvature: 0.3, color: "#475569" }
            ];
            addStep(3, "algo.list_extract_item.step_3", 
                { 0: "#3b82f6", 1: "#ef4444", 2: "#facc15" }, l3, { "pitem->prev->next": "B" });

            addStep(4, "algo.list_extract_item.step_4", 
                { 0: "#3b82f6", 1: "rgba(16,185,129,0.3)", 2: "#3b82f6" }, l3, { _size: "mida - 1" });

            return steps;
        }
    }
};

export const list_extract_item: Simulation = {
    id: legacyAlgo.list_extract_item.id,
    renderer: "graph",
    code: list_extract_item_code,
    initialState: legacyAlgo.list_extract_item.initialGraph,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.list_extract_item.generateSteps().map((step: AlgoStep) => ({
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
