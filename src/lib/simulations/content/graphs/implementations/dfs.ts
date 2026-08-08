import type { Simulation, SimulationStep } from "../../../engine/types";
import { dfsCode } from "../data/code";
import { GraphBuilder } from "../GraphBuilder";

export const dfs: Simulation = {
    id: "dfs",
    renderer: "graph",
    code: dfsCode,
    initialState: {
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
    generateSteps: (): SimulationStep[] => {
        const builder = new GraphBuilder();
        const adj = [[1, 2], [3, 4], [5], [], [], []];
        const P: number[] = [];
        const W: number[] = [];
        const visitat = [false, false, false, false, false, false];

        const updateVars = (overrideVars: Record<string, string> = {}) => {
            builder.setVariables({ "Pila (P)": `[${P.join(', ')}]`, "Resultat": `[${W.join(', ')}]`, ...overrideVars });
        };

        updateVars();
        builder.addStep(2, "algorithms.dfs.init");
        
        P.push(0);
        visitat[0] = true;
        W.push(0);
        builder.setHighlight(0, "#10b981");
        updateVars();
        builder.addStep(6, "algorithms.dfs.addStart");

        while (P.length > 0) {
            const x = P[P.length - 1];
            
            // Clear current yellow highlights to green
            const currentHighlights = builder.build().slice(-1)[0]?.visual?.highlights || {};
            for (const key in currentHighlights) {
                if (currentHighlights[key] === "#facc15") builder.setHighlight(key, "#10b981");
            }
            
            builder.setHighlight(x, "#facc15");
            updateVars({ x: x.toString() });
            builder.addStep(11, "algorithms.dfs.checkTop", { x: x.toString() });

            let hi_ha_nou = false;
            for (const y of adj[x]) {
                if (!visitat[y]) {
                    P.push(y);
                    visitat[y] = true;
                    W.push(y);
                    hi_ha_nou = true;
                    builder.setHighlight(y, "#10b981");
                    updateVars({ x: x.toString(), y: y.toString() });
                    builder.addStep(16, "algorithms.dfs.visitNeighbor", { x: x.toString(), y: y.toString() });
                    break;
                }
            }
            
            if (!hi_ha_nou) {
                updateVars();
                builder.addStep(24, "algorithms.dfs.noNeighbors", { x: x.toString() });
                const popped = P.pop();
                if (popped !== undefined) builder.setHighlight(popped, "#3b82f6");
            }
        }
        
        const finalHighlights = builder.build().slice(-1)[0]?.visual?.highlights || {};
        for (const key in finalHighlights) builder.setHighlight(key, "#3b82f6");
        
        updateVars();
        builder.addStep(29, "algorithms.dfs.finished");
        
        return builder.build();
    }
};
