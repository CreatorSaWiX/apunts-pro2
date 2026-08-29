import type { Simulation, SimulationStep } from "../../../engine/types";
import { GraphBuilder } from "../GraphBuilder";
import bfs_code from "../code/bfs/source.cpp?raw";

const treeGraph = {
    nodes: [
        { id: 1, label: "1", fx: 0, fy: -100 },
        { id: 2, label: "2", fx: -60, fy: -20 },
        { id: 3, label: "3", fx: 60, fy: -20 },
        { id: 4, label: "4", fx: -90, fy: 60 },
        { id: 5, label: "5", fx: -30, fy: 60 },
        { id: 6, label: "6", fx: 30, fy: 60 },
        { id: 7, label: "7", fx: 90, fy: 60 }
    ],
    links: [
        { source: 1, target: 2 },
        { source: 1, target: 3 },
        { source: 2, target: 4 },
        { source: 2, target: 5 },
        { source: 3, target: 6 },
        { source: 3, target: 7 }
    ]
};

const treeLeft: Record<number, number | null> = { 1: 2, 2: 4, 3: 6, 4: null, 5: null, 6: null, 7: null };
const treeRight: Record<number, number | null> = { 1: 3, 2: 5, 3: 7, 4: null, 5: null, 6: null, 7: null };

export const bfs: Simulation = {
  id: "bfs",
  renderer: "graph",
  code: bfs_code,
  initialState: treeGraph,
  generateSteps: (): SimulationStep[] => {
    const builder = new GraphBuilder();
    const Q: number[] = [];
    const W: number[] = [];

    const updateVars = (overrideVars: Record<string, string> = {}) => {
      builder.setVariables({
        "Cua (Q)": `[${Q.join(", ")}]`,
        "Resultat (cout)": `[${W.join(", ")}]`,
        ...overrideVars,
      });
      return builder;
    };

    updateVars().addStep(2, "algo.bfs.step_1");

    Q.push(1);
    builder.setHighlight(1, "#facc15");
    updateVars().addStep(5, "algo.bfs.step_2");

    while (Q.length > 0) {
      const act = Q.shift()!;
      builder.setHighlight(act, "#10b981"); // Processing
      W.push(act);

      updateVars({ act: act.toString() }).addStep(8, "algo.bfs.step_3", {
        act: act.toString(),
      });

      const left = treeLeft[act];
      const right = treeRight[act];

      if (left !== null) {
        Q.push(left);
        builder.setHighlight(left, "#facc15"); // In queue
        updateVars({ act: act.toString() }).addStep(13, "algo.bfs.step_4", {
          act: act.toString(),
          left: left.toString(),
        });
      }
      if (right !== null) {
        Q.push(right);
        builder.setHighlight(right, "#facc15"); // In queue
        updateVars({ act: act.toString() }).addStep(14, "algo.bfs.step_5", {
          act: act.toString(),
          right: right.toString(),
        });
      }

      builder.setHighlight(act, "#3b82f6"); // Done
    }

    updateVars().addStep(16, "algo.bfs.step_6");

    return builder.build();
  },
};
