import type { Simulation, SimulationStep } from "../../../engine/types";
import avl_rr_code from "../code/avl_rr/source.cpp?raw";

interface AlgoStep {
    line: number;
    description: string;
    highlights: Record<string | number, string>;
    nodeLabels?: Record<string | number, string>;
    nodePositions?: Record<string | number, { fx: number; fy: number }>;
    links?: { source: string | number; target: string | number; label?: string; color?: string; curvature?: number }[];
    variables: Record<string, string>;
}

const legacyAlgo: Record<string, { id: string; initialGraph?: Record<string, unknown>; generateSteps: () => AlgoStep[] }> = {
    avl_rr: {
        id: "avl_rr",
        initialGraph: {
            nodes: [
                { id: "30", label: "p: 30 (h=2)", fx: -35, fy: -100, color: "#ef4444" },
                { id: "20", label: "20 (h=0)",    fx: -110, fy: -25,  color: "#3b82f6" },
                { id: "50", label: "50 (h=1)",    fx: 45,  fy: -25,  color: "#3b82f6" },
                { id: "40", label: "40 (h=0)",    fx: -5,  fy: 50,   color: "#3b82f6" },
                { id: "70", label: "70 (h=0)",    fx: 95,  fy: 50,   color: "#3b82f6" }
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
                vars: Record<string, string>,
                positions?: Record<string, { fx: number; fy: number }>,
                labels?: Record<string, string>
            ) => {
                steps.push({
                    line,
                    description: desc,
                    highlights,
                    links,
                    variables: vars,
                    nodePositions: positions,
                    nodeLabels: labels
                });
            };

            const lInitial = [
                { source: "30", target: "20", color: "#475569" },
                { source: "30", target: "50", color: "#475569" },
                { source: "50", target: "40", color: "#475569" },
                { source: "50", target: "70", color: "#475569" }
            ];

            const hlInitial: Record<string, string> = {
                "30": "#ef4444", // vermell: desequilibrat (+2 cap a la dreta)
                "20": "#3b82f6",
                "50": "#3b82f6",
                "40": "#3b82f6",
                "70": "#3b82f6"
            };

            const labelsInitial: Record<string, string> = {
                "30": "p: 30 (h=2)",
                "20": "20 (h=0)",
                "50": "50 (h=1)",
                "40": "40 (h=0)",
                "70": "70 (h=0)"
            };

            // Pas 1: Entrada a RR(Node*& p)
            addStep(1, "algo.avl_rr.step_1",
                { ...hlInitial },
                [...lInitial],
                { p: "&Node(30)", "p->fesq": "&Node(20)", "p->fdre": "&Node(50)", factor_equilibri: "+2 (RR)" },
                undefined,
                labelsInitial
            );

            // Pas 2: Node* q = p;
            const labelsQ: Record<string, string> = {
                ...labelsInitial,
                "30": "p, q: 30 (h=2)"
            };
            addStep(2, "algo.avl_rr.step_2",
                { ...hlInitial, "30": "#facc15" },
                [...lInitial],
                { q: "&Node(30)", p: "&Node(30)", accio: "q guarda la referència a l'arrel original" },
                undefined,
                labelsQ
            );

            // Pas 3: p = p->fdre; (p passa a apuntar a 50)
            const labelsPNew: Record<string, string> = {
                ...labelsInitial,
                "30": "q: 30",
                "50": "p: 50"
            };
            addStep(3, "algo.avl_rr.step_3",
                { ...hlInitial, "30": "#38bdf8", "50": "#facc15" },
                [...lInitial],
                { p: "&Node(50) (NOVA ARREL)", q: "&Node(30)", accio: "Pivot 50 ascendeix com a nova arrel" },
                undefined,
                labelsPNew
            );

            // Pas 4: q->fdre = p->fesq; (30->fdre passa a ser 40)
            const lTransferB = [
                { source: "30", target: "20", color: "#475569" },
                { source: "30", target: "40", color: "#facc15" }, // nou enllaç q->fdre = p->fesq
                { source: "50", target: "70", color: "#475569" },
                { source: "50", target: "40", color: "#334155" }  // antic enllaç atenuat
            ];
            addStep(4, "algo.avl_rr.step_4",
                { ...hlInitial, "30": "#38bdf8", "50": "#facc15", "40": "#facc15" },
                lTransferB,
                { "q->fdre": "&Node(40)", "p->fesq": "&Node(40)", subarbre_traspassat: "40 traspassat a 30->fdre" },
                undefined,
                labelsPNew
            );

            // Pas 5: p->fesq = q; (50->fesq passa a ser 30) + Reorganització geomètrica
            const posAfterRR: Record<string, { fx: number; fy: number }> = {
                "50": { fx: 0,   fy: -100 }, // nova arrel al centre superior
                "30": { fx: -70, fy: -25 },
                "70": { fx: 70,  fy: -25 },
                "20": { fx: -105, fy: 50 },
                "40": { fx: -35, fy: 50 }
            };
            const lFinal = [
                { source: "50", target: "30", color: "#22c55e" }, // nou enllaç p->fesq = q
                { source: "50", target: "70", color: "#475569" },
                { source: "30", target: "20", color: "#475569" },
                { source: "30", target: "40", color: "#475569" }
            ];
            addStep(5, "algo.avl_rr.step_5",
                { "50": "#22c55e", "30": "#38bdf8", "20": "#3b82f6", "40": "#3b82f6", "70": "#3b82f6" },
                lFinal,
                { "p->fesq": "&Node(30)", rotacio: "Punters reassignats amb èxit" },
                posAfterRR,
                labelsPNew
            );

            // Pas 6: actualitzar_alcada(q); (alçada de 30 passa a 1)
            const labelsH30: Record<string, string> = {
                ...labelsPNew,
                "30": "30 (h=1)"
            };
            addStep(6, "algo.avl_rr.step_6",
                { "50": "#22c55e", "30": "#10b981", "20": "#3b82f6", "40": "#3b82f6", "70": "#3b82f6" },
                lFinal,
                { node: "q (30)", alcada_30: "1 + max(h(20), h(40)) = 1", alcada_actualitzada: "1" },
                posAfterRR,
                labelsH30
            );

            // Pas 7: actualitzar_alcada(p); (alçada de 50 passa a 2)
            const labelsFinal: Record<string, string> = {
                "50": "p: 50 (h=2)",
                "30": "30 (h=1)",
                "70": "70 (h=0)",
                "20": "20 (h=0)",
                "40": "40 (h=0)"
            };
            const lBalanced = lFinal.map(l => ({ ...l, color: "#475569" }));
            addStep(7, "algo.avl_rr.step_7",
                { "30": "#22c55e", "50": "#22c55e", "20": "#22c55e", "40": "#22c55e", "70": "#22c55e" },
                lBalanced,
                { node: "p (50)", alcada_50: "1 + max(h(30), h(70)) = 2", cost: "O(1)", estat: "Rotació RR completada i equilibrada" },
                posAfterRR,
                labelsFinal
            );

            return steps;
        }
    }
};

export const avl_rr: Simulation = {
    id: legacyAlgo.avl_rr.id,
    renderer: "graph",
    code: avl_rr_code,
    initialState: legacyAlgo.avl_rr.initialGraph,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.avl_rr.generateSteps().map((step: AlgoStep) => ({
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
