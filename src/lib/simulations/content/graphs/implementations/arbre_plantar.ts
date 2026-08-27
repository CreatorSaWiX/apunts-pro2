import type { Simulation, SimulationStep } from "../../../engine/types";
import arbre_plantar_code from "../code/arbre_plantar/source.cpp?raw";

interface AlgoStep {
    line: number;
    description: string;
    highlights: Record<string | number, string>; // nodeId -> color
    nodeLabels?: Record<string | number, string>; // nodeId -> label text
    links?: { source: string | number; target: string | number; label?: string; color?: string; curvature?: number }[];
    variables: Record<string, string>;
}

const legacyAlgo: Record<string, { id: string; initialGraph?: Record<string, unknown>; generateSteps: () => AlgoStep[] }> = {
    arbre_plantar: {
        id: "arbre_plantar",
        initialGraph: {
            nodes: [
                { id: "a1", label: "a1 (2)", fx: -60, fy: 0, color: "#10b981" },
                { id: "a2", label: "a2 (9)", fx: 60, fy: 0, color: "#8b5cf6" },
                { id: "aux", label: "x (7)", fx: 0, fy: -80, color: "rgba(0,0,0,0)" }
            ],
            links: []
        },
        generateSteps: () => {
            const steps: AlgoStep[] = [];
            const addStep = (line: number, desc: string, highlights: Record<string, string>, links: AlgoStep['links'], vars: Record<string, string>) => {
                steps.push({ line, description: desc, highlights, links, variables: vars });
            };

            addStep(1, "algo.arbre_plantar.step_1", 
                { "a1": "#10b981", "a2": "#8b5cf6" }, [], { "x": "7" });

            addStep(2, "algo.arbre_plantar.step_2", 
                { "a1": "#10b981", "a2": "#8b5cf6", "aux": "#facc15" }, [], { "aux->info": "7" });

            const l1 = [ { source: "aux", target: "a1", color: "#10b981" } ];
            addStep(4, "algo.arbre_plantar.step_3", 
                { "a1": "#10b981", "a2": "#8b5cf6", "aux": "#3b82f6" }, l1, { "aux->segE": "a1.primer_node" });

            const l2 = [ ...l1, { source: "aux", target: "a2", color: "#8b5cf6" } ];
            addStep(5, "algo.arbre_plantar.step_4", 
                { "a1": "#10b981", "a2": "#8b5cf6", "aux": "#3b82f6" }, l2, { "aux->segD": "a2.primer_node" });

            addStep(6, "algo.arbre_plantar.step_5", 
                { "a1": "#10b981", "a2": "#8b5cf6", "aux": "#22c55e" }, l2, { "primer_node": "aux" });

            addStep(7, "algo.arbre_plantar.step_6", 
                { "a1": "rgba(16,185,129,0.3)", "a2": "rgba(139,92,246,0.3)", "aux": "#22c55e" }, l2, { "a1": "buit", "a2": "buit" });

            return steps;
        }
    }
};

export const arbre_plantar: Simulation = {
    id: legacyAlgo.arbre_plantar.id,
    renderer: "graph",
    code: arbre_plantar_code,
    initialState: legacyAlgo.arbre_plantar.initialGraph,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.arbre_plantar.generateSteps().map((step: AlgoStep) => ({
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
