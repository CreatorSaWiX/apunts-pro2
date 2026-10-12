import type { Simulation, SimulationStep } from "../../../engine/types";
import avl_rotacio_rr_code from "../code/avl_rotacio_rr/source.cpp?raw";

interface AlgoStep {
    line: number;
    description: string;
    highlights: Record<string | number, string>;
    nodeLabels?: Record<string | number, string>;
    links?: { source: string | number; target: string | number; label?: string; color?: string; curvature?: number }[];
    nodePositions?: Record<string | number, { fx?: number; fy?: number }>;
    variables: Record<string, string>;
}

const legacyAlgo: Record<string, { id: string; initialGraph?: Record<string, unknown>; generateSteps: () => AlgoStep[] }> = {
    avl_rotacio_rr: {
        id: "avl_rotacio_rr",
        initialGraph: {
            nodes: [
                { id: "30", label: "30 (h=4)", fx: -30, fy: -100, color: "#ef4444" },
                { id: "20", label: "20 (h=1)", fx: -90, fy: -20,  color: "#3b82f6" },
                { id: "50", label: "50 (h=3)", fx: 50,  fy: -20,  color: "#3b82f6" },
                { id: "40", label: "40 (h=1)", fx: 0,   fy: 60,   color: "#3b82f6" },
                { id: "70", label: "70 (h=2)", fx: 100, fy: 60,   color: "#3b82f6" }
            ],
            links: [
                { source: "30", target: "20", color: "#475569" },
                { source: "30", target: "50", color: "#475569" },
                { source: "50", target: "40", color: "#475569" },
                { source: "50", target: "70", color: "#475569" }
            ]
        },
        generateSteps: () => {
            const steps: AlgoStep[] = [];
            const addStep = (
                line: number,
                desc: string,
                highlights: Record<string, string>,
                links: AlgoStep['links'],
                labels: Record<string, string>,
                positions: AlgoStep['nodePositions'],
                vars: Record<string, string>
            ) => {
                steps.push({
                    line,
                    description: desc,
                    highlights,
                    links,
                    nodeLabels: labels,
                    nodePositions: positions,
                    variables: vars
                });
            };

            const lInitial = [
                { source: "30", target: "20", color: "#475569" },
                { source: "30", target: "50", color: "#475569" },
                { source: "50", target: "40", color: "#475569" },
                { source: "50", target: "70", color: "#475569" }
            ];

            const posInitial: Record<string, { fx: number; fy: number }> = {
                "30": { fx: -30, fy: -100 },
                "20": { fx: -90, fy: -20 },
                "50": { fx: 50,  fy: -20 },
                "40": { fx: 0,   fy: 60 },
                "70": { fx: 100, fy: 60 }
            };

            const labelsInitial = {
                "30": "30 (h=4)",
                "20": "20 (h=1)",
                "50": "50 (h=3)",
                "40": "40 (h=1)",
                "70": "70 (h=2)"
            };

            const hlDefault: Record<string, string> = {
                "30": "#3b82f6",
                "20": "#3b82f6",
                "50": "#3b82f6",
                "40": "#3b82f6",
                "70": "#3b82f6"
            };

            // Pas 1 (Línia 1): Crida RR(Node*& p)
            addStep(1, "algo.avl_rotacio_rr.step_1",
                { ...hlDefault, "30": "#ef4444" },
                [...lInitial],
                { ...labelsInitial },
                { ...posInitial },
                { "p": "0x30", "alc(fesq)": "1", "alc(fdre)": "3", "factor": "+2 (Desequilibri RR)" }
            );

            // Pas 2 (Línia 2): Node* q = p;
            addStep(2, "algo.avl_rotacio_rr.step_2",
                { ...hlDefault, "30": "#facc15" },
                [...lInitial],
                { ...labelsInitial },
                { ...posInitial },
                { "p": "0x30", "q": "0x30", "p->clau": "30", "q->clau": "30" }
            );

            // Pas 3 (Línia 3): p = p->fdre; (la referència p passa a apuntar al node 50)
            addStep(3, "algo.avl_rotacio_rr.step_3",
                { ...hlDefault, "30": "#facc15", "50": "#22c55e" },
                [...lInitial],
                { ...labelsInitial },
                { ...posInitial },
                { "p": "0x50 (nova arrel)", "q": "0x30", "p->clau": "50", "q->clau": "30" }
            );

            // Pas 4 (Línia 4): q->fdre = p->fesq; (30 adopta el subarbre 40 com a fill dret)
            const lAdopt = [
                { source: "30", target: "20", color: "#475569" },
                { source: "30", target: "40", color: "#facc15" },
                { source: "50", target: "70", color: "#475569" }
            ];
            addStep(4, "algo.avl_rotacio_rr.step_4",
                { ...hlDefault, "30": "#facc15", "50": "#22c55e", "40": "#facc15" },
                lAdopt,
                { ...labelsInitial },
                { ...posInitial },
                { "q->fdre": "0x40", "p->fesq": "0x40", "acció": "30 adopta 40 a la dreta" }
            );

            // Pas 5 (Línia 5): p->fesq = q; (50 adopta 30 com a fill esquerre)
            const lRotated = [
                { source: "50", target: "30", color: "#22c55e" },
                { source: "50", target: "70", color: "#475569" },
                { source: "30", target: "20", color: "#475569" },
                { source: "30", target: "40", color: "#475569" }
            ];
            const posRotated: Record<string, { fx: number; fy: number }> = {
                "50": { fx: 0,   fy: -100 },
                "30": { fx: -60, fy: -20 },
                "70": { fx: 60,  fy: -20 },
                "20": { fx: -90, fy: 60 },
                "40": { fx: -30, fy: 60 }
            };
            addStep(5, "algo.avl_rotacio_rr.step_5",
                { ...hlDefault, "50": "#22c55e", "30": "#22c55e" },
                lRotated,
                { ...labelsInitial },
                posRotated,
                { "p->fesq": "0x30", "nova_arrel": "50", "fill_esquerre": "30" }
            );

            // Pas 6 (Línia 6): actualitzar_alcada(q);
            const labelsUpdatedQ = {
                ...labelsInitial,
                "30": "30 (h=2)"
            };
            addStep(6, "algo.avl_rotacio_rr.step_6",
                { ...hlDefault, "50": "#22c55e", "30": "#3b82f6" },
                lRotated,
                labelsUpdatedQ,
                posRotated,
                { "q": "0x30", "alc(q)": "1 + max(1, 1) = 2" }
            );

            // Pas 7 (Línia 7): actualitzar_alcada(p);
            const labelsUpdatedP = {
                ...labelsUpdatedQ,
                "50": "50 (h=3)"
            };
            addStep(7, "algo.avl_rotacio_rr.step_7",
                { ...hlDefault, "50": "#3b82f6" },
                lRotated,
                labelsUpdatedP,
                posRotated,
                { "p": "0x50", "alc(p)": "1 + max(2, 2) = 3" }
            );

            // Pas 8 (Línia 8): final de la rotació
            const lFinal = [
                { source: "50", target: "30", color: "#475569" },
                { source: "50", target: "70", color: "#475569" },
                { source: "30", target: "20", color: "#475569" },
                { source: "30", target: "40", color: "#475569" }
            ];
            addStep(8, "algo.avl_rotacio_rr.step_8",
                { "30": "#10b981", "50": "#10b981", "20": "#10b981", "40": "#10b981", "70": "#10b981" },
                lFinal,
                labelsUpdatedP,
                posRotated,
                { "estat": "Rotació RR completada", "arrel": "50", "factor_arrel": "0", "cost": "Θ(1)" }
            );

            return steps;
        }
    }
};

export const avl_rotacio_rr: Simulation = {
    id: legacyAlgo.avl_rotacio_rr.id,
    renderer: "graph",
    code: avl_rotacio_rr_code,
    initialState: legacyAlgo.avl_rotacio_rr.initialGraph,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.avl_rotacio_rr.generateSteps().map((step: AlgoStep) => ({
            line: step.line,
            description: step.description,
            variables: step.variables,
            visual: {
                highlights: step.highlights,
                nodeLabels: step.nodeLabels,
                links: step.links,
                nodePositions: step.nodePositions
            }
        }));
    }
};
