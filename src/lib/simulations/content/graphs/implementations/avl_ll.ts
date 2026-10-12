import type { Simulation, SimulationStep } from "../../../engine/types";
import avl_ll_code from "../code/avl_ll/source.cpp?raw";

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
    avl_ll: {
        id: "avl_ll",
        initialGraph: {
            nodes: [
                { id: "50", label: "p: 50 (h=2)", fx: 35,  fy: -100, color: "#ef4444" },
                { id: "30", label: "30 (h=1)",    fx: -45, fy: -25,  color: "#3b82f6" },
                { id: "70", label: "70 (h=0)",    fx: 110, fy: -25,  color: "#3b82f6" },
                { id: "20", label: "20 (h=0)",    fx: -95, fy: 50,   color: "#3b82f6" },
                { id: "40", label: "40 (h=0)",    fx: 5,   fy: 50,   color: "#3b82f6" }
            ],
            links: [
                { source: "50", target: "30", color: "#475569" },
                { source: "50", target: "70", color: "#475569" },
                { source: "30", target: "20", color: "#475569" },
                { source: "30", target: "40", color: "#475569" }
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
                { source: "50", target: "30", color: "#475569" },
                { source: "50", target: "70", color: "#475569" },
                { source: "30", target: "20", color: "#475569" },
                { source: "30", target: "40", color: "#475569" }
            ];

            const hlInitial: Record<string, string> = {
                "50": "#ef4444", // vermell: desequilibrat (+2)
                "30": "#3b82f6",
                "70": "#3b82f6",
                "20": "#3b82f6",
                "40": "#3b82f6"
            };

            const labelsInitial: Record<string, string> = {
                "50": "p: 50 (h=2)",
                "30": "30 (h=1)",
                "70": "70 (h=0)",
                "20": "20 (h=0)",
                "40": "40 (h=0)"
            };

            // Pas 1: Entrada a LL(Node*& p)
            addStep(1, "algo.avl_ll.step_1",
                { ...hlInitial },
                [...lInitial],
                { p: "&Node(50)", "p->fesq": "&Node(30)", "p->fdre": "&Node(70)", factor_equilibri: "+2 (LL)" },
                undefined,
                labelsInitial
            );

            // Pas 2: Node* q = p;
            const labelsQ: Record<string, string> = {
                ...labelsInitial,
                "50": "p, q: 50 (h=2)"
            };
            addStep(2, "algo.avl_ll.step_2",
                { ...hlInitial, "50": "#facc15" },
                [...lInitial],
                { q: "&Node(50)", p: "&Node(50)", accio: "q guarda la referència a l'arrel original" },
                undefined,
                labelsQ
            );

            // Pas 3: p = p->fesq; (p passa a apuntar a 30)
            const labelsPNew: Record<string, string> = {
                ...labelsInitial,
                "50": "q: 50",
                "30": "p: 30"
            };
            addStep(3, "algo.avl_ll.step_3",
                { ...hlInitial, "50": "#38bdf8", "30": "#facc15" },
                [...lInitial],
                { p: "&Node(30) (NOVA ARREL)", q: "&Node(50)", accio: "Pivot 30 ascendeix com a nova arrel" },
                undefined,
                labelsPNew
            );

            // Pas 4: q->fesq = p->fdre; (50->fesq passa a ser 40)
            const lTransferB = [
                { source: "50", target: "40", color: "#facc15" }, // nou enllaç q->fesq = p->fdre
                { source: "50", target: "70", color: "#475569" },
                { source: "30", target: "20", color: "#475569" },
                { source: "30", target: "40", color: "#334155" } // enllaç antic en atenuació
            ];
            addStep(4, "algo.avl_ll.step_4",
                { ...hlInitial, "50": "#38bdf8", "30": "#facc15", "40": "#facc15" },
                lTransferB,
                { "q->fesq": "&Node(40)", "p->fdre": "&Node(40)", subarbre_traspassat: "40 traspassat a 50->fesq" },
                undefined,
                labelsPNew
            );

            // Pas 5: p->fdre = q; (30->fdre passa a ser 50) + Reorganització geomètrica
            const posAfterLL: Record<string, { fx: number; fy: number }> = {
                "30": { fx: 0,   fy: -100 }, // nova arrel al centre superior
                "20": { fx: -70, fy: -25 },
                "50": { fx: 70,  fy: -25 },
                "40": { fx: 35,  fy: 50 },
                "70": { fx: 105, fy: 50 }
            };
            const lFinal = [
                { source: "30", target: "20", color: "#475569" },
                { source: "30", target: "50", color: "#22c55e" }, // nou enllaç p->fdre = q
                { source: "50", target: "40", color: "#475569" },
                { source: "50", target: "70", color: "#475569" }
            ];
            addStep(5, "algo.avl_ll.step_5",
                { "30": "#22c55e", "50": "#38bdf8", "20": "#3b82f6", "40": "#3b82f6", "70": "#3b82f6" },
                lFinal,
                { "p->fdre": "&Node(50)", rotacio: "Punters reassignats amb èxit" },
                posAfterLL,
                labelsPNew
            );

            // Pas 6: actualitzar_alcada(q); (alçada de 50 passa a 1)
            const labelsH50: Record<string, string> = {
                ...labelsPNew,
                "50": "50 (h=1)"
            };
            addStep(6, "algo.avl_ll.step_6",
                { "30": "#22c55e", "50": "#10b981", "20": "#3b82f6", "40": "#3b82f6", "70": "#3b82f6" },
                lFinal,
                { node: "q (50)", alcada_50: "1 + max(h(40), h(70)) = 1", alcada_actualitzada: "1" },
                posAfterLL,
                labelsH50
            );

            // Pas 7: actualitzar_alcada(p); (alçada de 30 passa a 2)
            const labelsFinal: Record<string, string> = {
                "30": "p: 30 (h=2)",
                "20": "20 (h=0)",
                "50": "50 (h=1)",
                "40": "40 (h=0)",
                "70": "70 (h=0)"
            };
            const lBalanced = lFinal.map(l => ({ ...l, color: "#475569" }));
            addStep(7, "algo.avl_ll.step_7",
                { "30": "#22c55e", "50": "#22c55e", "20": "#22c55e", "40": "#22c55e", "70": "#22c55e" },
                lBalanced,
                { node: "p (30)", alcada_30: "1 + max(h(20), h(50)) = 2", cost: "O(1)", estat: "Rotació LL completada i equilibrada" },
                posAfterLL,
                labelsFinal
            );

            return steps;
        }
    }
};

export const avl_ll: Simulation = {
    id: legacyAlgo.avl_ll.id,
    renderer: "graph",
    code: avl_ll_code,
    initialState: legacyAlgo.avl_ll.initialGraph,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.avl_ll.generateSteps().map((step: AlgoStep) => ({
            line: step.line,
            description: step.description,
            variables: step.variables,
            visual: {
                highlights: step.highlights,
                nodeLabels: step.nodeLabels,
                nodePositions: step.nodePositions,
                links: step.links
            }
        }));
    }
};
