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
    arbgen_fills: {
        id: "arbgen_fills",
        code: `void fills(vector<ArbreGen> &v) {
    node_arbreGen* aux = primer_node;
    int ari = aux->seg.size();
    v = vector<ArbreGen>(ari);
    for (int i = 0; i < ari; ++i) {
        v[i].primer_node = aux->seg[i];
    }
    primer_node = NULL;
    delete aux;
}`,
        initialGraph: {
            nodes: [
                { id: "m", label: "A", fx: 0, fy: -80, color: "#facc15" },
                { id: "mA", label: "v[0]", fx: -60, fy: 0, color: "#10b981" },
                { id: "mB", label: "v[1]", fx: 60, fy: 0, color: "#8b5cf6" }
            ],
            links: [
                { source: "m", target: "mA", color: "#475569" },
                { source: "m", target: "mB", color: "#475569" }
            ]
        },
        generateSteps: () => {
            const steps: AlgoStep[] = [];
            const addStep = (line: number, desc: string, highlights: Record<string, string>, links: any[], vars: Record<string, string>) => {
                steps.push({ line, description: desc, highlights, links, variables: vars });
            };

            const lBase = [
                { source: "m", target: "mA", color: "#475569" },
                { source: "m", target: "mB", color: "#475569" }
            ];

            addStep(1, "algo.arbgen_fills.step_1", 
                { "m": "#facc15", "mA": "#10b981", "mB": "#8b5cf6" }, [...lBase], { "ari": "2" });

            addStep(4, "algo.arbgen_fills.step_2", 
                { "m": "#facc15", "mA": "#10b981", "mB": "#8b5cf6" }, [...lBase], { "v": "vector(2)" });

            const l1 = [ { source: "m", target: "mB", color: "#475569" } ];
            addStep(6, "algo.arbgen_fills.step_3", 
                { "m": "#3b82f6", "mA": "#22c55e", "mB": "#8b5cf6" }, l1, { "i": "0", "v[0]": "fill creat" });

            const l2: any[] = [];
            addStep(6, "algo.arbgen_fills.step_4", 
                { "m": "#3b82f6", "mA": "#22c55e", "mB": "#22c55e" }, l2, { "i": "1", "v[1]": "fill creat" });

            addStep(8, "algo.arbgen_fills.step_5", 
                { "m": "#ef4444", "mA": "#22c55e", "mB": "#22c55e" }, l2, { "primer_node": "NULL" });

            addStep(9, "algo.arbgen_fills.step_6", 
                { "m": "rgba(0,0,0,0)", "mA": "#22c55e", "mB": "#22c55e" }, l2, { "deleted": "aux" });

            return steps;
        }
    }
};

export const arbgen_fills: Simulation = {
    id: legacyAlgo.arbgen_fills.id,
    renderer: "graph",
    code: legacyAlgo.arbgen_fills.code,
    initialState: legacyAlgo.arbgen_fills.initialGraph,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.arbgen_fills.generateSteps().map((step: AlgoStep) => ({
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
