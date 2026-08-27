import type { Simulation, SimulationStep } from "../../../engine/types";
import arbgen_copia_code from "../code/arbgen_copia/source.cpp?raw";

interface AlgoStep {
    line: number;
    description: string;
    highlights: Record<string | number, string>; // nodeId -> color
    nodeLabels?: Record<string | number, string>; // nodeId -> label text
    links?: { source: string | number; target: string | number; label?: string; color?: string; curvature?: number }[];
    variables: Record<string, string>;
}

const legacyAlgo: Record<string, { id: string; initialGraph?: Record<string, unknown>; generateSteps: () => AlgoStep[] }> = {
    arbgen_copia: {
        id: "arbgen_copia",
        initialGraph: {
            nodes: [
                { id: "m", label: "m (A)", fx: -100, fy: -80, color: "#8b5cf6" },
                { id: "mA", label: "mA (B)", fx: -160, fy: 0, color: "#8b5cf6" },
                { id: "mB", label: "mB (C)", fx: -40, fy: 0, color: "#8b5cf6" },
                { id: "n", label: "n (A)", fx: 100, fy: -80, color: "rgba(0,0,0,0)" },
                { id: "nA", label: "nA (B)", fx: 40, fy: 0, color: "rgba(0,0,0,0)" },
                { id: "nB", label: "nB (C)", fx: 160, fy: 0, color: "rgba(0,0,0,0)" }
            ],
            links: [
                { source: "m", target: "mA", color: "#475569" },
                { source: "m", target: "mB", color: "#475569" }
            ]
        },
        generateSteps: () => {
            const steps: AlgoStep[] = [];
            const addStep = (line: number, desc: string, highlights: Record<string, string>, links: AlgoStep['links'], vars: Record<string, string>) => {
                steps.push({ line, description: desc, highlights, links, variables: vars });
            };

            const lBase = [
                { source: "m", target: "mA", color: "#475569" },
                { source: "m", target: "mB", color: "#475569" }
            ];

            addStep(1, "algo.arbgen_copia.step_1", 
                { "m": "#facc15" }, [...lBase], { "ari": "?" });

            addStep(3, "algo.arbgen_copia.step_2", 
                { "m": "#3b82f6", "n": "#facc15" }, [...lBase], { "n->info": "A" });

            addStep(6, "algo.arbgen_copia.step_3", 
                { "m": "#3b82f6", "n": "#facc15" }, [...lBase], { "ari": "2", "n->seg": "vector(2)" });

            addStep(7, "algo.arbgen_copia.step_4", 
                { "mA": "#facc15", "n": "#3b82f6" }, [...lBase], { "i": "0" });

            const l1 = [ ...lBase, { source: "n", target: "nA", color: "#10b981" } ];
            addStep(8, "algo.arbgen_copia.step_5", 
                { "n": "#10b981", "nA": "#3b82f6" }, l1, { "n->seg[0]": "nA" });

            addStep(7, "algo.arbgen_copia.step_6", 
                { "mB": "#facc15", "n": "#3b82f6", "nA": "#3b82f6" }, l1, { "i": "1" });

            const l2 = [ ...l1, { source: "n", target: "nB", color: "#10b981" } ];
            addStep(8, "algo.arbgen_copia.step_7", 
                { "n": "#10b981", "nA": "#3b82f6", "nB": "#3b82f6" }, l2, { "n->seg[1]": "nB" });

            addStep(9, "algo.arbgen_copia.step_8", 
                { "n": "#22c55e", "nA": "#22c55e", "nB": "#22c55e" }, l2, { "return": "n" });

            return steps;
        }
    }
};

export const arbgen_copia: Simulation = {
    id: legacyAlgo.arbgen_copia.id,
    renderer: "graph",
    code: arbgen_copia_code,
    initialState: legacyAlgo.arbgen_copia.initialGraph,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.arbgen_copia.generateSteps().map((step: AlgoStep) => ({
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
