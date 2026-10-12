import type { Simulation, SimulationStep } from "../../../engine/types";
import avl_lr_code from "../code/avl_lr/source.cpp?raw";

interface AlgoStep {
    line: number;
    description: string;
    highlights: Record<string | number, string>;
    nodeLabels?: Record<string | number, string>;
    nodePositions?: Record<string | number, { fx?: number; fy?: number }>;
    links?: { source: string | number; target: string | number; label?: string; color?: string; curvature?: number }[];
    variables: Record<string, string>;
}

const legacyAlgo: Record<string, { id: string; initialGraph?: Record<string, unknown>; generateSteps: () => AlgoStep[] }> = {
    avl_lr: {
        id: "avl_lr",
        initialGraph: {
            nodes: [
                { id: "50", label: "p: 50 (h=3)", fx: 40,  fy: -100, color: "#ef4444" },
                { id: "30", label: "30 (h=2)",    fx: -40, fy: -30,  color: "#facc15" },
                { id: "70", label: "70 (h=0)",    fx: 110, fy: -30,  color: "#3b82f6" },
                { id: "20", label: "20 (h=0)",    fx: -90, fy: 40,   color: "#3b82f6" },
                { id: "40", label: "40 (h=1)",    fx: 10,  fy: 40,   color: "#a855f7" },
                { id: "35", label: "35 (h=0)",    fx: -10, fy: 110,  color: "#3b82f6" }
            ],
            links: [
                { source: "50", target: "30", color: "#475569" },
                { source: "50", target: "70", color: "#475569" },
                { source: "30", target: "20", color: "#475569" },
                { source: "30", target: "40", color: "#facc15" },
                { source: "40", target: "35", color: "#a855f7" }
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
                { source: "50", target: "30", color: "#475569" },
                { source: "50", target: "70", color: "#475569" },
                { source: "30", target: "20", color: "#475569" },
                { source: "30", target: "40", color: "#facc15" },
                { source: "40", target: "35", color: "#a855f7" }
            ];

            const hlInitial: Record<string, string> = {
                "50": "#ef4444", // vermell: desequilibrat (+2)
                "30": "#facc15", // groc: desequilibri intern cap a la dreta (-1)
                "70": "#3b82f6",
                "20": "#3b82f6",
                "40": "#a855f7", // lila: pivot central que puja
                "35": "#3b82f6"
            };

            const labelsInitial: Record<string, string> = {
                "50": "p: 50 (h=3, Δ=+2)",
                "30": "30 (h=2, Δ=-1)",
                "70": "70 (h=0)",
                "20": "20 (h=0)",
                "40": "pivot: 40 (h=1)",
                "35": "35 (h=0)"
            };

            const posInitial: Record<string, { fx: number; fy: number }> = {
                "50": { fx: 40,  fy: -100 },
                "30": { fx: -40, fy: -30 },
                "70": { fx: 110, fy: -30 },
                "20": { fx: -90, fy: 40 },
                "40": { fx: 10,  fy: 40 },
                "35": { fx: -10, fy: 110 }
            };

            // Pas 1: Entrada a LR(p)
            addStep(18, "algo.avl_lr.step_1",
                { ...hlInitial },
                [...lInitial],
                labelsInitial,
                posInitial,
                { cas: "LR (Zigzag esquerra-dreta)", "Δ(50)": "+2", "Δ(30)": "-1", acció: "Cal rotació doble: RR(fesq) + LL(p)" }
            );

            // Pas 2: Crida a RR(p->fesq)
            addStep(19, "algo.avl_lr.step_2",
                { ...hlInitial, "30": "#facc15", "40": "#a855f7" },
                [...lInitial],
                labelsInitial,
                posInitial,
                { pas: "Fase 1: RR(p->fesq)", subarbre: "Aplicant rotació simple esquerra sobre el node 30" }
            );

            // Pas 3: RR -> Node* q = p (dins RR, q=30)
            const labelsRR_q: Record<string, string> = {
                ...labelsInitial,
                "30": "q: 30"
            };
            addStep(2, "algo.avl_lr.step_3",
                { ...hlInitial, "30": "#facc15" },
                [...lInitial],
                labelsRR_q,
                posInitial,
                { q: "&Node(30)", acció: "q guarda la referència al node 30" }
            );

            // Pas 4: RR -> p = p->fdre (el node 40 puja)
            const labelsRR_p: Record<string, string> = {
                ...labelsInitial,
                "40": "p: 40 (ascendeix)",
                "30": "q: 30"
            };
            addStep(3, "algo.avl_lr.step_4",
                { ...hlInitial, "40": "#22c55e", "30": "#38bdf8" },
                [...lInitial],
                labelsRR_p,
                posInitial,
                { p: "&Node(40)", "50->fesq": "&Node(40)", acció: "El node 40 passa a ser el nou fill esquerre de 50" }
            );

            // Pas 5: RR -> q->fdre = p->fesq (30->fdre adopta 35)
            const lAfterRRTransfer = [
                { source: "50", target: "40", color: "#22c55e" },
                { source: "50", target: "70", color: "#475569" },
                { source: "30", target: "20", color: "#475569" },
                { source: "30", target: "35", color: "#facc15" }, // 35 traspassat a 30
                { source: "40", target: "30", color: "#38bdf8" }
            ];
            addStep(4, "algo.avl_lr.step_5",
                { ...hlInitial, "40": "#22c55e", "30": "#38bdf8", "35": "#facc15" },
                lAfterRRTransfer,
                labelsRR_p,
                posInitial,
                { "q->fdre": "&Node(35)", traspassat: "El subarbre esquerre de 40 passa a ser fill dret de 30" }
            );

            // Pas 6: RR -> p->fesq = q (40->fesq passa a ser 30) + Redreçament visual (cas LL lineal!)
            const posAfterRR: Record<string, { fx: number; fy: number }> = {
                "50": { fx: 60,  fy: -100 },
                "40": { fx: -20, fy: -30 },
                "70": { fx: 125, fy: -30 },
                "30": { fx: -75, fy: 40 },
                "20": { fx: -115, fy: 110 },
                "35": { fx: -35, fy: 110 }
            };
            const labelsAfterRR: Record<string, string> = {
                "50": "p: 50 (h=3, Δ=+2)",
                "40": "40 (h=2)",
                "30": "30 (h=1)",
                "70": "70 (h=0)",
                "20": "20 (h=0)",
                "35": "35 (h=0)"
            };
            addStep(5, "algo.avl_lr.step_6",
                { "50": "#ef4444", "40": "#3b82f6", "30": "#3b82f6", "70": "#3b82f6", "20": "#3b82f6", "35": "#3b82f6" },
                lAfterRRTransfer,
                labelsAfterRR,
                posAfterRR,
                { estat: "Zigzag redreçat en línia recta!", cas_resultant: "Transformat a Cas LL (50 -> 40 -> 30)" }
            );

            // Pas 7: actualitzar_alcada(q) i actualitzar_alcada(p) de RR
            addStep(6, "algo.avl_lr.step_7",
                { "50": "#ef4444", "40": "#3b82f6", "30": "#3b82f6", "70": "#3b82f6", "20": "#3b82f6", "35": "#3b82f6" },
                lAfterRRTransfer,
                labelsAfterRR,
                posAfterRR,
                { "h(30)": "1", "h(40)": "2", resultat_fase1: "Fase 1 completada. Ara cal aplicar LL(p) sobre l'arrel 50" }
            );

            // Pas 8: Crida a LL(p) (Fase 2)
            addStep(20, "algo.avl_lr.step_8",
                { "50": "#ef4444", "40": "#a855f7", "30": "#3b82f6", "70": "#3b82f6", "20": "#3b82f6", "35": "#3b82f6" },
                lAfterRRTransfer,
                labelsAfterRR,
                posAfterRR,
                { pas: "Fase 2: LL(p)", acció: "Rotació simple dreta sobre l'arrel original 50" }
            );

            // Pas 9: LL -> Node* q = p (q=50)
            const labelsLL_q: Record<string, string> = {
                ...labelsAfterRR,
                "50": "q: 50"
            };
            addStep(11, "algo.avl_lr.step_9",
                { "50": "#facc15", "40": "#a855f7", "30": "#3b82f6", "70": "#3b82f6", "20": "#3b82f6", "35": "#3b82f6" },
                lAfterRRTransfer,
                labelsLL_q,
                posAfterRR,
                { q: "&Node(50)", acció: "q guarda el node 50" }
            );

            // Pas 10: LL -> p = p->fesq (40 ascendeix com a NOVA ARREL GLOBAL)
            const labelsLL_newRoot: Record<string, string> = {
                "40": "p: 40 (NOVA ARREL)",
                "50": "q: 50",
                "30": "30",
                "70": "70",
                "20": "20",
                "35": "35"
            };
            addStep(12, "algo.avl_lr.step_10",
                { "40": "#22c55e", "50": "#38bdf8", "30": "#3b82f6", "70": "#3b82f6", "20": "#3b82f6", "35": "#3b82f6" },
                lAfterRRTransfer,
                labelsLL_newRoot,
                posAfterRR,
                { p: "&Node(40) (NOVA ARREL)", acció: "El node 40 puja com a nova arrel del diccionari" }
            );

            // Pas 11: LL -> q->fesq = p->fdre (el subarbre dret de 40 passa a ser fill esquerre de 50)
            // Pas 12: LL -> p->fdre = q (50 esdevé el fill dret de 40) + Geometria simètrica final
            const posFinal: Record<string, { fx: number; fy: number }> = {
                "40": { fx: 0,   fy: -100 }, // nova arrel centrada
                "30": { fx: -70, fy: -25 },
                "50": { fx: 70,  fy: -25 },
                "20": { fx: -105, fy: 50 },
                "35": { fx: -35,  fy: 50 },
                "70": { fx: 105,  fy: 50 }
            };
            const lFinal = [
                { source: "40", target: "30", color: "#475569" },
                { source: "40", target: "50", color: "#22c55e" },
                { source: "30", target: "20", color: "#475569" },
                { source: "30", target: "35", color: "#475569" },
                { source: "50", target: "70", color: "#475569" }
            ];
            const labelsFinal: Record<string, string> = {
                "40": "p: 40 (h=2)",
                "30": "30 (h=1)",
                "50": "50 (h=1)",
                "20": "20 (h=0)",
                "35": "35 (h=0)",
                "70": "70 (h=0)"
            };
            addStep(14, "algo.avl_lr.step_11",
                { "40": "#22c55e", "30": "#3b82f6", "50": "#3b82f6", "20": "#3b82f6", "35": "#3b82f6", "70": "#3b82f6" },
                lFinal,
                labelsFinal,
                posFinal,
                { "p->fdre": "&Node(50)", "p->fesq": "&Node(30)", reorganització: "50 enllaçat com a fill dret de 40" }
            );

            // Pas 13: actualitzar_alcada(q) i actualitzar_alcada(p) de LL
            addStep(15, "algo.avl_lr.step_12",
                { "40": "#22c55e", "30": "#22c55e", "50": "#22c55e", "20": "#22c55e", "35": "#22c55e", "70": "#22c55e" },
                lFinal,
                labelsFinal,
                posFinal,
                { "h(50)": "1", "h(30)": "1", "h(40)": "2", alçades: "Alçades recalculades en O(1)" }
            );

            // Pas 14: Fi de LR(p)
            addStep(21, "algo.avl_lr.step_13",
                { "40": "#22c55e", "30": "#22c55e", "50": "#22c55e", "20": "#22c55e", "35": "#22c55e", "70": "#22c55e" },
                lFinal,
                labelsFinal,
                posFinal,
                { resultat: "Arbre perfectament equilibrat!", cost: "Θ(1)", factor_equilibri: "Tots els nodes tenen |Δ| ≤ 1" }
            );

            return steps;
        }
    }
};

export const avl_lr: Simulation = {
    id: legacyAlgo.avl_lr.id,
    renderer: "graph",
    code: avl_lr_code,
    initialState: legacyAlgo.avl_lr.initialGraph,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.avl_lr.generateSteps().map((step: AlgoStep) => ({
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
