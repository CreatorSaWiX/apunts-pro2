import type { Simulation, SimulationStep } from "../../../engine/types";
import arbgen_esborra_code from "../code/arbgen_esborra/source.cpp?raw";

interface AlgoStep {
    line: number;
    description: string;
    highlights: Record<string | number, string>; // nodeId -> color
    nodeLabels?: Record<string | number, string>; // nodeId -> label text
    links?: { source: string | number; target: string | number; label?: string; color?: string; curvature?: number }[];
    variables: Record<string, string>;
}

const legacyAlgo: Record<string, { id: string; initialGraph?: Record<string, unknown>; generateSteps: () => AlgoStep[] }> = {
    arbgen_esborra: {
        id: "arbgen_esborra",
        initialGraph: {
            nodes: [
                { id: "m", label: "A", fx: 0, fy: -80, color: "#3b82f6" },
                { id: "mA", label: "B", fx: -60, fy: 0, color: "#3b82f6" },
                { id: "mB", label: "C", fx: 60, fy: 0, color: "#3b82f6" }
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

            addStep(1, "algo.arbgen_esborra.step_1", 
                { "m": "#facc15" }, [...lBase], { "m": "A" });

            addStep(3, "algo.arbgen_esborra.step_2", 
                { "m": "#3b82f6" }, [...lBase], { "ari": "2" });

            addStep(5, "algo.arbgen_esborra.step_3", 
                { "mA": "#facc15", "m": "#3b82f6" }, [...lBase], { "i": "0" });

            const l1 = [ { source: "m", target: "mB", color: "#475569" } ];
            addStep(6, "algo.arbgen_esborra.step_4", 
                { "m": "#3b82f6", "mA": "rgba(0,0,0,0)" }, l1, { "deleted": "B" });

            addStep(5, "algo.arbgen_esborra.step_5", 
                { "mB": "#facc15", "m": "#3b82f6" }, l1, { "i": "1" });

            const l2: AlgoStep['links'] = [];
            addStep(6, "algo.arbgen_esborra.step_6", 
                { "m": "#3b82f6", "mB": "rgba(0,0,0,0)" }, l2, { "deleted": "C" });

            addStep(6, "algo.arbgen_esborra.step_7", 
                { "m": "rgba(0,0,0,0)" }, l2, { "deleted": "A" });

            return steps;
        }
    }
};

export const arbgen_esborra: Simulation = {
    id: legacyAlgo.arbgen_esborra.id,
    renderer: "graph",
    code: arbgen_esborra_code,
    initialState: legacyAlgo.arbgen_esborra.initialGraph,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.arbgen_esborra.generateSteps().map((step: AlgoStep) => ({
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
