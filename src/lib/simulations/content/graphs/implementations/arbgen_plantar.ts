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
    arbgen_plantar: {
        id: "arbgen_plantar",
        code: `void plantar(const T &x, vector<ArbreGen> &v) {
    node_arbreGen* aux = new node_arbreGen;
    aux->info = x;
    int ari = v.size();
    aux->seg = vector<node_arbreGen*>(ari);
    for (int i = 0; i < ari; ++i) {
        aux->seg[i] = v[i].primer_node;
        v[i].primer_node = NULL;
    }
    primer_node = aux;
}`,
        initialGraph: {
            nodes: [
                { id: "v0", label: "v[0] (B)", fx: -60, fy: 0, color: "#10b981" },
                { id: "v1", label: "v[1] (C)", fx: 60, fy: 0, color: "#8b5cf6" },
                { id: "aux", label: "x (A)", fx: 0, fy: -80, color: "rgba(0,0,0,0)" }
            ],
            links: []
        },
        generateSteps: () => {
            const steps: AlgoStep[] = [];
            const addStep = (line: number, desc: string, highlights: Record<string, string>, links: any[], vars: Record<string, string>) => {
                steps.push({ line, description: desc, highlights, links, variables: vars });
            };

            addStep(1, "algo.arbgen_plantar.step_1", 
                { "v0": "#10b981", "v1": "#8b5cf6" }, [], { "x": "A", "ari": "2" });

            addStep(2, "algo.arbgen_plantar.step_2", 
                { "aux": "#facc15", "v0": "#10b981", "v1": "#8b5cf6" }, [], { "aux->info": "A", "aux->seg": "vector(2)" });

            const l1 = [ { source: "aux", target: "v0", color: "#10b981" } ];
            addStep(7, "algo.arbgen_plantar.step_3", 
                { "aux": "#3b82f6", "v0": "rgba(16,185,129,0.5)", "v1": "#8b5cf6" }, l1, { "i": "0", "v[0]": "NULL" });

            const l2 = [ ...l1, { source: "aux", target: "v1", color: "#8b5cf6" } ];
            addStep(7, "algo.arbgen_plantar.step_4", 
                { "aux": "#3b82f6", "v0": "rgba(16,185,129,0.5)", "v1": "rgba(139,92,246,0.5)" }, l2, { "i": "1", "v[1]": "NULL" });

            addStep(10, "algo.arbgen_plantar.step_5", 
                { "aux": "#22c55e", "v0": "rgba(16,185,129,0.3)", "v1": "rgba(139,92,246,0.3)" }, l2, { "primer_node": "aux" });

            return steps;
        }
    }
};

export const arbgen_plantar: Simulation = {
    id: legacyAlgo.arbgen_plantar.id,
    renderer: "graph",
    code: legacyAlgo.arbgen_plantar.code,
    initialState: legacyAlgo.arbgen_plantar.initialGraph,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.arbgen_plantar.generateSteps().map((step: AlgoStep) => ({
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
