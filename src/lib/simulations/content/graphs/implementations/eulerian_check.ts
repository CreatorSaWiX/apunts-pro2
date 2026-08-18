import type { Simulation, SimulationStep } from "../../../engine/types";

interface AlgoStep {
    line: number;
    description: string;
    highlights: Record<string | number, string>; // nodeId -> color
    nodeLabels?: Record<string | number, string>; // nodeId -> label text
    links?: { source: string | number; target: string | number; label?: string; color?: string; curvature?: number }[];
    variables: Record<string, string>;
}

const eulerianCheckCode = `bool is_eulerian(const vector<vector<int>>& G) {
    int odd_count = 0;
    
    for (int i = 0; i < G.size(); i++) {
        if (G[i].size() % 2 != 0) {
            odd_count++;
        }
    }
    
    // Si tots parells -> Circuit Eulerià
    if (odd_count == 0) return true; 
    
    // Si exactament 2 senars -> Senderó Eulerià
    if (odd_count == 2) return true; 
    
    return false;
}`;

const legacyAlgo: Record<string, { id: string; code?: string; initialGraph?: Record<string, unknown>; generateSteps: () => AlgoStep[] }> = {
    eulerian_check: {
        id: "eulerian_check",
        code: eulerianCheckCode,
        initialGraph: {
            nodes: [
                { id: 0, label: "0 (Gr 2)", fx: -60, fy: -40 },
                { id: 1, label: "1 (Gr 3)", fx: 60, fy: -40 },
                { id: 2, label: "2 (Gr 3)", fx: -60, fy: 40 },
                { id: 3, label: "3 (Gr 2)", fx: 60, fy: 40 }
            ],
            links: [
                { source: 0, target: 1 },
                { source: 0, target: 2 },
                { source: 1, target: 2 },
                { source: 1, target: 3 },
                { source: 2, target: 3 }
            ]
        },
        generateSteps: () => {
            const steps: AlgoStep[] = [];
            const adj = [[1, 2], [0, 2, 3], [0, 1, 3], [1, 2]];
            let odd_count = 0;
            const hl: Record<number, string> = {};

            const addStep = (line: number, desc: string, vars: Record<string, string> = {}) => {
                steps.push({ line, description: desc, highlights: { ...hl }, variables: vars });
            };

            addStep(2, "algo.eulerian_check.step_1", { odd_count: "0" });

            for (let i = 0; i < adj.length; i++) {
                hl[i] = "#facc15"; // yellow
                const degree = adj[i].length;
                addStep(5, "algo.eulerian_check.step_2", { i: i.toString(), degree: degree.toString(), odd_count: odd_count.toString() });
                if (degree % 2 !== 0) {
                    odd_count++;
                    hl[i] = "#ef4444"; // red meaning odd
                    addStep(6, "algo.eulerian_check.step_3", { i: i.toString(), odd_count: odd_count.toString() });
                } else {
                    hl[i] = "#10b981"; // green meaning even
                    addStep(9, "algo.eulerian_check.step_4", { i: i.toString(), odd_count: odd_count.toString() });
                }
            }

            addStep(11, "algo.eulerian_check.step_5", { odd_count: odd_count.toString() });

            if (odd_count === 0) {
                addStep(12, "algo.eulerian_check.step_6", { odd_count: odd_count.toString() });
            } else if (odd_count === 2) {
                addStep(15, "algo.eulerian_check.step_7", { odd_count: odd_count.toString() });
            } else {
                addStep(17, "algo.eulerian_check.step_8", { odd_count: odd_count.toString() });
            }
            return steps;
        }
    }
};

export const eulerian_check: Simulation = {
    id: legacyAlgo.eulerian_check.id,
    renderer: "graph",
    code: legacyAlgo.eulerian_check.code,
    initialState: legacyAlgo.eulerian_check.initialGraph,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.eulerian_check.generateSteps().map((step: AlgoStep) => ({
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
