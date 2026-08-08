import type { Simulation, SimulationStep } from "../../../engine/types";
import { bfsCode } from "../data/code";
import { treeGraph, treeLeft, treeRight } from "../data/graph";
import { GraphBuilder } from "../GraphBuilder";

export const bfs: Simulation = {
    id: "bfs",
    renderer: "graph",
    code: bfsCode,
    initialState: treeGraph,
    generateSteps: (): SimulationStep[] => {
        const builder = new GraphBuilder();
        const Q: number[] = [];
        const W: number[] = [];

        const updateVars = (overrideVars: Record<string, string> = {}) => {
            builder.setVariables({ "Cua (Q)": `[${Q.join(', ')}]`, "Resultat (cout)": `[${W.join(', ')}]`, ...overrideVars });
        };

        updateVars();
        builder.addStep(2, "algo.bfs.step_1");
        
        Q.push(1);
        builder.setHighlight(1, "#facc15");
        updateVars();
        builder.addStep(5, "algo.bfs.step_2");

        while (Q.length > 0) {
            const act = Q.shift()!;
            builder.setHighlight(act, "#10b981"); // Processing
            W.push(act);

            updateVars({ act: act.toString() });
            builder.addStep(8, "algo.bfs.step_3", { act: act.toString() });

            const left = treeLeft[act];
            const right = treeRight[act];

            if (left !== null) {
                Q.push(left);
                builder.setHighlight(left, "#facc15"); // In queue
                updateVars({ act: act.toString() });
                builder.addStep(14, "algo.bfs.step_4", { act: act.toString(), left: left.toString() });
            }
            if (right !== null) {
                Q.push(right);
                builder.setHighlight(right, "#facc15"); // In queue
                updateVars({ act: act.toString() });
                builder.addStep(15, "algo.bfs.step_5", { act: act.toString(), right: right.toString() });
            }

            builder.setHighlight(act, "#3b82f6"); // Done
        }

        updateVars();
        builder.addStep(17, "algo.bfs.step_6");
        
        return builder.build();
    }
};
