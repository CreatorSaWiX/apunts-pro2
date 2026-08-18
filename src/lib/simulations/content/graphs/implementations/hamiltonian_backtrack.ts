import type { Simulation, SimulationStep } from "../../../engine/types";

interface AlgoStep {
    line: number;
    description: string;
    highlights: Record<string | number, string>; // nodeId -> color
    nodeLabels?: Record<string | number, string>; // nodeId -> label text
    links?: { source: string | number; target: string | number; label?: string; color?: string; curvature?: number }[];
    variables: Record<string, string>;
}

const hamiltonianBacktrackCode = `bool hamiltonian_path(int u, int count, int n,
                      const vector<vector<int>>& G,
                      vector<bool>& visitat, vector<int>& path) {
    if (count == n) return true;
    
    for (int v : G[u]) {
        if (!visitat[v]) {
            visitat[v] = true;
            path.push_back(v);
            
            if (hamiltonian_path(v, count + 1, n, G, visitat, path)) {
                return true;
            }
            
            // Backtracking: Aquest camí no té sortida final, desfem iteració
            visitat[v] = false;
            path.pop_back();
        }
    }
    return false;
}`;

const legacyAlgo: Record<string, { id: string; code?: string; initialGraph?: Record<string, unknown>; generateSteps: () => AlgoStep[] }> = {
    hamiltonian_backtrack: {
        id: "hamiltonian_backtrack",
        code: hamiltonianBacktrackCode,
        initialGraph: {
            nodes: [
                { id: 0, label: "0", fx: 0, fy: -80 },
                { id: 1, label: "1", fx: -60, fy: 0 },
                { id: 2, label: "2", fx: 60, fy: 0 },
                { id: 3, label: "3", fx: 0, fy: 60 }
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
            const visitat = [false, false, false, false];
            const path: number[] = [];
            const hl: Record<number, string> = {};

            const addStep = (line: number, desc: string, overrideVars: Record<string, string> = {}) => {
                steps.push({ line, description: desc, highlights: { ...hl }, variables: { path: `[${path.join(', ')}]`, ...overrideVars } });
            };

            const solve = (u: number, count: number): boolean => {
                addStep(1, "algo.hamiltonian_backtrack.step_1", { u: u.toString(), count: count.toString() });

                if (count === 4) {
                    addStep(2, "algo.hamiltonian_backtrack.step_2", { count: count.toString() });
                    for (let i = 0; i < 4; i++) hl[i] = "#22c55e"; // bright green
                    return true;
                }

                for (const v of adj[u]) {
                    addStep(5, "algo.hamiltonian_backtrack.step_3", { u: u.toString(), v: v.toString() });
                    if (!visitat[v]) {
                        visitat[v] = true;
                        path.push(v);
                        const oldColor = hl[v];
                        hl[v] = "#3b82f6"; // blue in path

                        addStep(7, "algo.hamiltonian_backtrack.step_4", { u: u.toString(), v: v.toString() });

                        if (solve(v, count + 1)) {
                            addStep(11, "algo.hamiltonian_backtrack.step_5", { u: u.toString(), v: v.toString() });
                            return true;
                        }

                        // Backtracking
                        visitat[v] = false;
                        path.pop();
                        if (oldColor) hl[v] = oldColor;
                        else delete hl[v];

                        hl[u] = "#ef4444"; // Backtracked warning logic
                        addStep(15, "algo.hamiltonian_backtrack.step_6", { u: u.toString(), v: v.toString() });
                        hl[u] = "#3b82f6"; // Restore
                    } else {
                        addStep(6, "algo.hamiltonian_backtrack.step_7", { u: u.toString(), v: v.toString() });
                    }
                }

                addStep(20, "algo.hamiltonian_backtrack.step_8", { u: u.toString() });
                return false;
            };

            visitat[0] = true;
            path.push(0);
            hl[0] = "#3b82f6";
            addStep(1, "algo.hamiltonian_backtrack.step_9", { u: "0", count: "1" });
            solve(0, 1);

            return steps;
        }
    }
};

export const hamiltonian_backtrack: Simulation = {
    id: legacyAlgo.hamiltonian_backtrack.id,
    renderer: "graph",
    code: legacyAlgo.hamiltonian_backtrack.code,
    initialState: legacyAlgo.hamiltonian_backtrack.initialGraph,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.hamiltonian_backtrack.generateSteps().map((step: AlgoStep) => ({
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
