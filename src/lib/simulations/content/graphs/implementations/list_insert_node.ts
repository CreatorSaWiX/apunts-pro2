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
    list_insert_node: {
        id: "list_insert_node",
        code: `void insertItem(Item *pitemprev, Item *pitem) {
    pitem->next = pitemprev->next;
    pitem->next->prev = pitem;
    pitem->prev = pitemprev;
    pitemprev->next = pitem;
    _size++;
}`,
        initialGraph: {
            nodes: [
                { id: 0, label: "pitemprev (A)", fx: -160, fy: 0, color: "#3b82f6" },
                { id: 1, label: "next (B)", fx: 160, fy: 0, color: "#3b82f6" },
                { id: 2, label: "pitem (N)", fx: 0, fy: -100, color: "#10b981" },
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

            const hBase = { 0: "#3b82f6", 1: "#3b82f6", 2: "#10b981" };
            const lBase = [
                { source: 0, target: 1, curvature: 0.2, color: "#475569" },
                { source: 1, target: 0, curvature: 0.2, color: "#475569" }
            ];

            addStep(1, "algo.list_insert_node.step_1", 
                { ...hBase }, [...lBase], { pitemprev: "A", pitem: "N" });

            const l2 = [
                ...lBase,
                { source: 2, target: 1, curvature: -0.2, color: "#facc15" } // N -> B
            ];
            addStep(2, "algo.list_insert_node.step_2", 
                { 0: "#3b82f6", 1: "#3b82f6", 2: "#facc15" }, l2, { "pitem->next": "B" });

            const l3 = [
                { source: 0, target: 1, curvature: 0.2, color: "#475569" },
                { source: 1, target: 2, curvature: -0.2, color: "#facc15" }, // B -> N
                { source: 2, target: 1, curvature: -0.2, color: "#475569" }  // N -> B
            ];
            addStep(3, "algo.list_insert_node.step_3", 
                { 0: "#3b82f6", 1: "#facc15", 2: "#10b981" }, l3, { "B->prev": "N" });

            const l4 = [
                ...l3,
                { source: 2, target: 0, curvature: 0.2, color: "#facc15" } // N -> A
            ];
            addStep(4, "algo.list_insert_node.step_4", 
                { 0: "#3b82f6", 1: "#3b82f6", 2: "#facc15" }, l4, { "pitem->prev": "A" });

            const l5 = [
                { source: 0, target: 2, curvature: 0.2, color: "#facc15" }, // A -> N
                { source: 1, target: 2, curvature: -0.2, color: "#475569" },
                { source: 2, target: 1, curvature: -0.2, color: "#475569" },
                { source: 2, target: 0, curvature: 0.2, color: "#475569" }
            ];
            addStep(5, "algo.list_insert_node.step_5", 
                { 0: "#facc15", 1: "#3b82f6", 2: "#10b981" }, l5, { "A->next": "N" });

            addStep(6, "algo.list_insert_node.step_6", 
                { 0: "#10b981", 1: "#10b981", 2: "#10b981" }, l5, { _size: "3" });

            return steps;
        }
    }
};

export const list_insert_node: Simulation = {
    id: legacyAlgo.list_insert_node.id,
    renderer: "graph",
    code: legacyAlgo.list_insert_node.code,
    initialState: legacyAlgo.list_insert_node.initialGraph,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.list_insert_node.generateSteps().map((step: AlgoStep) => ({
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
