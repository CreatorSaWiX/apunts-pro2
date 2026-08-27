import type { Simulation, SimulationStep } from "../../../engine/types";
import heap_push_code from "../code/heap_push/source.cpp?raw";

interface AlgoStep {
    line: number;
    description: string;
    highlights: Record<string | number, string>; // nodeId -> color
    nodeLabels?: Record<string | number, string>; // nodeId -> label text
    links?: { source: string | number; target: string | number; label?: string; color?: string; curvature?: number }[];
    variables: Record<string, string>;
}

const legacyAlgo: Record<string, { id: string; initialGraph?: Record<string, unknown>; generateSteps: () => AlgoStep[] }> = {
    heap_push: {
        id: "heap_push",
        initialGraph: {
            nodes: [
                { id: 1, label: "1 (50)", fx: 0, fy: -100 },
                { id: 2, label: "2 (40)", fx: -60, fy: -20 },
                { id: 3, label: "3 (30)", fx: 60, fy: -20 },
                { id: 4, label: "4 (10)", fx: -90, fy: 60 },
                { id: 5, label: "5 (20)", fx: -30, fy: 60 },
                { id: 6, label: "6", fx: 30, fy: 60, color: "transparent" }
            ],
            links: [
                { source: 1, target: 2 },
                { source: 1, target: 3 },
                { source: 2, target: 4 },
                { source: 2, target: 5 },
                { source: 3, target: 6, label: "buit" }
            ]
        },
        generateSteps: () => {
            const steps: AlgoStep[] = [];
            const hl: Record<number, string> = {};
            const labels: Record<number, string> = {
                1: "1 (50)", 2: "2 (40)", 3: "3 (30)", 4: "4 (10)", 5: "5 (20)", 6: "6"
            };
            const addStep = (line: number, desc: string, vars: Record<string, string> = {}) => {
                steps.push({ line, description: desc, highlights: { ...hl }, nodeLabels: { ...labels }, variables: vars });
            };

            addStep(2, "algo.heap_push.step_1", { x: "45", size_: "5" });
            
            hl[6] = "#10b981"; // green: target
            labels[6] = "6 (45)";
            addStep(4, "algo.heap_push.step_2", { x: "45", size_: "6" });
            
            addStep(5, "algo.heap_push.step_3", { i: "6" });
            
            hl[6] = "#3b82f6"; // blue: current moving node
            addStep(10, "algo.heap_push.step_4", { i: "6", pare_val: "30", me_val: "45" });
            
            hl[3] = "#facc15"; // yellow: parent to compare
            addStep(10, "algo.heap_push.step_5", { cond: "45 > 30 (T)" });
            
            labels[3] = "3 (45)";
            labels[6] = "6 (30)";
            hl[3] = "#3b82f6";
            hl[6] = "#10b981";
            addStep(11, "algo.heap_push.step_6", { i: "6" });
            
            delete hl[6]; // clean up 
            addStep(12, "algo.heap_push.step_7", { i: "3" });
            
            hl[1] = "#facc15"; // yellow: new parent
            addStep(10, "algo.heap_push.step_8", { i: "3", pare_val: "50", me_val: "45" });
            
            addStep(10, "algo.heap_push.step_9", { cond: "45 > 50 (F)" });
            
            hl[3] = "#22c55e"; // bright green: final position
            delete hl[1];
            addStep(6, "algo.heap_push.step_10", { success: "Done" });

            return steps;
        }
    }
};

export const heap_push: Simulation = {
    id: legacyAlgo.heap_push.id,
    renderer: "graph",
    code: heap_push_code,
    initialState: legacyAlgo.heap_push.initialGraph,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.heap_push.generateSteps().map((step: AlgoStep) => ({
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
