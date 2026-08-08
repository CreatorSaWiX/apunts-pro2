import type { Simulation, SimulationStep } from "../../../engine/types";

interface AlgoStep {
    line: number;
    description: string;
    highlights: Record<string | number, string>; // nodeId -> color
    nodeLabels?: Record<string | number, string>; // nodeId -> label text
    links?: { source: string | number; target: string | number; label?: string; color?: string; curvature?: number }[];
    variables: Record<string, string>;
}

const bfs2Code = `vector<int> BFS(const vector<vector<int>>& G, int v) {
    queue<int> C;
    vector<int> W;
    vector<int> D(G.size(), 0);
    vector<bool> visitat(G.size(), false);
    
    C.push(v);
    visitat[v] = true;
    W.push_back(v);
    
    while (!C.empty()) {
        int x = C.front();
        bool hi_ha_nou = false;
        
        for (int y : G[x]) {
            if (!visitat[y]) {
                C.push(y);
                visitat[y] = true;
                W.push_back(y);
                D[y] = D[x] + 1;
                hi_ha_nou = true;
                break;
            }
        }
        
        if (!hi_ha_nou) {
            C.pop();
        }
    }
    
    return D;
}`;

const legacyAlgo: Record<string, any> = {
    bfs2: {
        id: "bfs2",
        code: bfs2Code,
        initialGraph: {
            nodes: [
                { id: 0, label: "0", fx: 0, fy: -120 },
                { id: 1, label: "1", fx: -80, fy: -40 },
                { id: 2, label: "2", fx: 80, fy: -40 },
                { id: 3, label: "3", fx: -120, fy: 40 },
                { id: 4, label: "4", fx: -40, fy: 40 },
                { id: 5, label: "5", fx: 120, fy: 40 }
            ],
            links: [
                { source: 0, target: 1 },
                { source: 0, target: 2 },
                { source: 1, target: 3 },
                { source: 1, target: 4 },
                { source: 2, target: 5 }
            ]
        },
        generateSteps: () => {
            const steps: AlgoStep[] = [];
            const adj = [[1, 2], [0, 3, 4], [0, 5], [1], [1], [2]];
            const C: number[] = [];
            const W: number[] = [];
            const D: number[] = [0, 0, 0, 0, 0, 0];
            const visitat = [false, false, false, false, false, false];
            const highlights: Record<number, string> = {};

            const addStep = (line: number, desc: string, overrideVars: Record<string, string> = {}) => {
                steps.push({
                    line,
                    description: desc,
                    highlights: { ...highlights },
                    variables: { "Cua (C)": `[${C.join(', ')}]`, "Visitat (W)": `[${W.join(', ')}]`, "Distància (D)": `[${D.join(', ')}]`, ...overrideVars }
                });
            };

            addStep(2, "algo.bfs2.step_1");

            const v = 0;
            C.push(v);
            visitat[v] = true;
            W.push(v);
            D[v] = 0;
            highlights[v] = "#10b981"; // In list W (green)
            addStep(8, "algo.bfs2.step_2");

            while (C.length > 0) {
                const x = C[0];
                for (const key in highlights) if (highlights[key] === "#facc15") highlights[key] = "#10b981";
                if (highlights[x] !== "#3b82f6") highlights[x] = "#facc15"; // currently checking x

                addStep(12, "algo.bfs2.step_3", { x: String(x) });

                let y = -1;
                for (const vehi of adj[x]) {
                    if (!visitat[vehi]) {
                        y = vehi;
                        break;
                    }
                }

                if (y !== -1) {
                    C.push(y);
                    visitat[y] = true;
                    W.push(y);
                    D[y] = D[x] + 1;
                    highlights[y] = "#10b981";
                    addStep(18, "algo.bfs2.step_4", { x: String(x), y: String(y) });
                } else {
                    addStep(26, "algo.bfs2.step_5", { x: String(x) });
                    const popped = C.shift();
                    if (popped !== undefined) highlights[popped] = "#3b82f6"; // finished
                }
            }

            for (const key in highlights) highlights[key] = "#3b82f6";
            addStep(31, "algo.bfs2.step_6");
            return steps;
        }
    }
};

export const bfs2: Simulation = {
    id: legacyAlgo.bfs2.id,
    renderer: "graph",
    code: legacyAlgo.bfs2.code,
    initialState: legacyAlgo.bfs2.initialGraph,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.bfs2.generateSteps().map((step: AlgoStep) => ({
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
