import type { Simulation, SimulationStep } from "../../../engine/types";
import abc_assignar_code from "../code/abc_assignar/source.cpp?raw";

interface AlgoStep {
    line: number;
    description: string;
    highlights: Record<string | number, string>; // nodeId -> color
    nodeLabels?: Record<string | number, string>; // nodeId -> label text
    links?: { source: string | number; target: string | number; label?: string; color?: string; curvature?: number }[];
    variables: Record<string, string>;
}

const legacyAlgo: Record<string, { id: string; initialGraph?: Record<string, unknown>; generateSteps: () => AlgoStep[] }> = {
    abc_assignar: {
        id: "abc_assignar",
        initialGraph: {
            nodes: [
                { id: "40", label: "40 ('A')", fx: 0, fy: -100, color: "#3b82f6" },
                { id: "20", label: "20 ('B')", fx: -70, fy: -30, color: "#3b82f6" },
                { id: "60", label: "60 ('C')", fx: 70, fy: -30, color: "#3b82f6" },
                { id: "10", label: "10 ('D')", fx: -110, fy: 45, color: "#3b82f6" },
                { id: "30", label: "30 ('E')", fx: -35, fy: 45, color: "#3b82f6" },
                { id: "25", label: "25 ('X')", fx: -65, fy: 120, color: "rgba(0,0,0,0)" }
            ],
            links: [
                { source: "40", target: "20", color: "#475569" },
                { source: "40", target: "60", color: "#475569" },
                { source: "20", target: "10", color: "#475569" },
                { source: "20", target: "30", color: "#475569" }
            ]
        },
        generateSteps: () => {
            const steps: AlgoStep[] = [];
            const addStep = (
                line: number,
                desc: string,
                highlights: Record<string, string>,
                links: AlgoStep['links'],
                vars: Record<string, string>
            ) => {
                steps.push({ line, description: desc, highlights, links, variables: vars });
            };

            const lBase = [
                { source: "40", target: "20", color: "#475569" },
                { source: "40", target: "60", color: "#475569" },
                { source: "20", target: "10", color: "#475569" },
                { source: "20", target: "30", color: "#475569" }
            ];

            const hlDefault: Record<string, string> = {
                "40": "#3b82f6",
                "20": "#3b82f6",
                "60": "#3b82f6",
                "10": "#3b82f6",
                "30": "#3b82f6",
                "25": "rgba(0,0,0,0)"
            };

            // Pas 1: Crida inicial amb clau = 25, info = 'X', n = 5
            addStep(1, "algo.abc_assignar.step_1",
                { ...hlDefault, "40": "#facc15" },
                [...lBase],
                { "p": "&arrel (40)", "p->clau": "40", "clau": "25", "info": "'X'", "n": "5" }
            );

            // Pas 2: Comprovació if (p) a l'arrel 40
            addStep(2, "algo.abc_assignar.step_2",
                { ...hlDefault, "40": "#facc15" },
                [...lBase],
                { "p": "0x40 (no nul)", "clau": "25", "info": "'X'", "n": "5" }
            );

            // Pas 3: 25 < 40 -> branca esquerra
            addStep(3, "algo.abc_assignar.step_3",
                { ...hlDefault, "40": "#facc15" },
                [...lBase],
                { "comparació": "25 < 40 (cert)", "clau": "25", "p->clau": "40", "n": "5" }
            );

            // Pas 4: Crida recursiva amb p->fesq (node 20)
            addStep(1, "algo.abc_assignar.step_4",
                { ...hlDefault, "20": "#facc15" },
                [...lBase],
                { "p": "&(40->fesq)", "p->clau": "20", "clau": "25", "info": "'X'", "n": "5" }
            );

            // Pas 5: Comprovació if (p) al node 20
            addStep(2, "algo.abc_assignar.step_5",
                { ...hlDefault, "20": "#facc15" },
                [...lBase],
                { "p": "0x20 (no nul)", "clau": "25", "info": "'X'", "n": "5" }
            );

            // Pas 6: 25 < 20 és fals
            addStep(3, "algo.abc_assignar.step_6",
                { ...hlDefault, "20": "#facc15" },
                [...lBase],
                { "comparació": "25 < 20 (fals)", "clau": "25", "p->clau": "20", "n": "5" }
            );

            // Pas 7: 25 > 20 és cert -> branca dreta
            addStep(4, "algo.abc_assignar.step_7",
                { ...hlDefault, "20": "#facc15" },
                [...lBase],
                { "comparació": "25 > 20 (cert)", "clau": "25", "p->clau": "20", "n": "5" }
            );

            // Pas 8: Crida recursiva amb p->fdre (node 30)
            addStep(1, "algo.abc_assignar.step_8",
                { ...hlDefault, "30": "#facc15" },
                [...lBase],
                { "p": "&(20->fdre)", "p->clau": "30", "clau": "25", "info": "'X'", "n": "5" }
            );

            // Pas 9: Comprovació if (p) al node 30
            addStep(2, "algo.abc_assignar.step_9",
                { ...hlDefault, "30": "#facc15" },
                [...lBase],
                { "p": "0x30 (no nul)", "clau": "25", "info": "'X'", "n": "5" }
            );

            // Pas 10: 25 < 30 és cert -> branca esquerra
            addStep(3, "algo.abc_assignar.step_10",
                { ...hlDefault, "30": "#facc15" },
                [...lBase],
                { "comparació": "25 < 30 (cert)", "clau": "25", "p->clau": "30", "n": "5" }
            );

            // Pas 11: Crida recursiva amb p->fesq de 30 (que és nullptr!)
            addStep(1, "algo.abc_assignar.step_11",
                { ...hlDefault, "30": "#facc15" },
                [...lBase],
                { "p": "&(30->fesq) == nullptr", "clau": "25", "info": "'X'", "n": "5" }
            );

            // Pas 12: Comprovació if (p) -> Fals!
            addStep(2, "algo.abc_assignar.step_12",
                { ...hlDefault, "30": "#facc15" },
                [...lBase],
                { "p": "nullptr (fals)", "clau": "25", "info": "'X'", "n": "5" }
            );

            // Pas 13: Creació del nou node: p = new Node(clau, info)
            const lWithNew = [
                ...lBase,
                { source: "30", target: "25", color: "#22c55e" }
            ];
            addStep(7, "algo.abc_assignar.step_13",
                { ...hlDefault, "30": "#3b82f6", "25": "#22c55e" },
                lWithNew,
                { "p": "new Node(25, 'X')", "30->fesq": "0x25", "clau": "25", "info": "'X'", "n": "5" }
            );

            // Pas 14: Increment de mida ++n
            addStep(8, "algo.abc_assignar.step_14",
                { ...hlDefault, "25": "#22c55e" },
                lWithNew,
                { "n": "6 (++n)", "clau": "25", "info": "'X'" }
            );

            // Pas 15: Retorn i finalització
            const lFinal = [
                ...lBase,
                { source: "30", target: "25", color: "#475569" }
            ];
            addStep(10, "algo.abc_assignar.step_15",
                { ...hlDefault, "25": "#10b981" },
                lFinal,
                { "estat": "Inserció finalitzada", "n": "6", "cost": "Θ(h)" }
            );

            return steps;
        }
    }
};

export const abc_assignar: Simulation = {
    id: legacyAlgo.abc_assignar.id,
    renderer: "graph",
    code: abc_assignar_code,
    initialState: legacyAlgo.abc_assignar.initialGraph,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.abc_assignar.generateSteps().map((step: AlgoStep) => ({
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
