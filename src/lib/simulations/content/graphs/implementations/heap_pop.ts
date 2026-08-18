import type { Simulation, SimulationStep } from "../../../engine/types";

interface AlgoStep {
    line: number;
    description: string;
    highlights: Record<string | number, string>; // nodeId -> color
    nodeLabels?: Record<string | number, string>; // nodeId -> label text
    links?: { source: string | number; target: string | number; label?: string; color?: string; curvature?: number }[];
    variables: Record<string, string>;
}

const heapPopCode = `template <typename T>
void Heap<T>::pop() {
    elems_[1] = elems_[size_];
    resize_(-1);
    flow_down_(1);
}

template <typename T>
void Heap<T>::flow_down_(int i) {
    int left = 2 * i, right = 2 * i + 1;
    int max = i;
    if (left <= size_ && elems_[left] > elems_[max]) max = left;
    if (right <= size_ && elems_[right] > elems_[max]) max = right;
    
    if (max != i) {
        std::swap(elems_[i], elems_[max]);
        flow_down_(max);
    }
}`;

const legacyAlgo: Record<string, { id: string; code?: string; initialGraph?: Record<string, unknown>; generateSteps: () => AlgoStep[] }> = {
    heap_pop: {
        id: "heap_pop",
        code: heapPopCode,
        initialGraph: {
            nodes: [
                { id: 1, label: "1 (50)", fx: 0, fy: -100 },
                { id: 2, label: "2 (40)", fx: -60, fy: -20 },
                { id: 3, label: "3 (45)", fx: 60, fy: -20 },
                { id: 4, label: "4 (10)", fx: -90, fy: 60 },
                { id: 5, label: "5 (20)", fx: -30, fy: 60 },
                { id: 6, label: "6 (30)", fx: 30, fy: 60 }
            ],
            links: [
                { source: 1, target: 2 },
                { source: 1, target: 3 },
                { source: 2, target: 4 },
                { source: 2, target: 5 },
                { source: 3, target: 6 }
            ]
        },
        generateSteps: () => {
            const steps: AlgoStep[] = [];
            let hl: Record<number, string> = {};
            const labels: Record<number, string> = {
                1: "1 (50)", 2: "2 (40)", 3: "3 (45)", 4: "4 (10)", 5: "5 (20)", 6: "6 (30)"
            };
            const addStep = (line: number, desc: string, vars: Record<string, string> = {}) => {
                steps.push({ line, description: desc, highlights: { ...hl }, nodeLabels: { ...labels }, variables: vars });
            };

            hl[1] = "#facc15"; // yellow: target to remove
            addStep(2, "algo.heap_pop.step_1", { size_: "6" });
            
            hl[6] = "#3b82f6"; // blue: element that will move
            addStep(3, "algo.heap_pop.step_2", { size_: "6" });
            
            labels[1] = "1 (30)";
            labels[6] = "6";
            hl[6] = "transparent";
            hl[1] = "#3b82f6";
            addStep(3, "algo.heap_pop.step_3", { size_: "6" });
            
            addStep(4, "algo.heap_pop.step_4", { size_: "5" });
            
            addStep(5, "algo.heap_pop.step_5", { i: "1" });
            
            addStep(9, "algo.heap_pop.step_6", { i: "1" });
            
            hl[2] = "#facc15"; hl[3] = "#facc15"; // yellow: children to compare
            addStep(10, "algo.heap_pop.step_7", { i: "1", left: "2", right: "3" });
            
            addStep(11, "algo.heap_pop.step_8", { max: "1" });
            
            hl[2] = "#10b981"; // green: current winner
            addStep(12, "algo.heap_pop.step_9", { max: "2" });
            
            hl[2] = "#facc15"; // back to yellow
            hl[3] = "#10b981"; // new winner
            addStep(13, "algo.heap_pop.step_10", { max: "3" });
            
            hl[3] = "#ef4444"; // red: swap confirmed
            addStep(15, "algo.heap_pop.step_11", { i: "1", max: "3" });
            
            // Swap labels BEFORE the next step
            labels[1] = "1 (45)";
            labels[3] = "3 (30)";
            hl[1] = "#10b981";
            hl[3] = "#3b82f6";
            addStep(16, "algo.heap_pop.step_12", { i: "1", max: "3" });
            
            addStep(17, "algo.heap_pop.step_13", { i: "3" });

            hl = { 3: "#3b82f6" };
            addStep(9, "algo.heap_pop.step_14", { i: "3" });
            addStep(10, "algo.heap_pop.step_15", { left: "6", size: "5" });
            addStep(12, "algo.heap_pop.step_16", { cond: "left <= size (F)" });
            
            hl[3] = "#22c55e"; // bright green
            addStep(15, "algo.heap_pop.step_17", { max: "3", i: "3" });
            
            addStep(19, "algo.heap_pop.step_18", { success: "Done" });

            return steps;
        }
    }
};

export const heap_pop: Simulation = {
    id: legacyAlgo.heap_pop.id,
    renderer: "graph",
    code: legacyAlgo.heap_pop.code,
    initialState: legacyAlgo.heap_pop.initialGraph,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.heap_pop.generateSteps().map((step: AlgoStep) => ({
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
