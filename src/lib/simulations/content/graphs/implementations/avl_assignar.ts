import type { Simulation, SimulationStep } from "../../../engine/types";
import avl_assignar_code from "../code/avl_assignar/source.cpp?raw";

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
    avl_assignar: {
        id: "avl_assignar",
        initialGraph: {
            nodes: [
                { id: "50", label: "50 (h=1)", fx: 30,  fy: -110, color: "#3b82f6" },
                { id: "30", label: "30 (h=1)", fx: -45, fy: -35,  color: "#3b82f6" },
                { id: "70", label: "70 (h=0)", fx: 105, fy: -35,  color: "#3b82f6" },
                { id: "20", label: "20 (h=0)", fx: -85, fy: 40,   color: "#3b82f6" },
                { id: "40", label: "40 (h=0)", fx: -5,  fy: 40,   color: "#3b82f6" },
                { id: "10", label: "10 (h=0)", fx: -125, fy: 110, color: "rgba(0,0,0,0)" }
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

            const lBase = [
                { source: "50", target: "30", color: "#475569" },
                { source: "50", target: "70", color: "#475569" },
                { source: "30", target: "20", color: "#475569" },
                { source: "30", target: "40", color: "#475569" }
            ];

            const hlDefault: Record<string, string> = {
                "50": "#3b82f6",
                "30": "#3b82f6",
                "70": "#3b82f6",
                "20": "#3b82f6",
                "40": "#3b82f6",
                "10": "rgba(0,0,0,0)"
            };

            const labelsInitial: Record<string, string> = {
                "50": "50 (h=1)",
                "30": "30 (h=1)",
                "70": "70 (h=0)",
                "20": "20 (h=0)",
                "40": "40 (h=0)",
                "10": "10 (h=0)"
            };

            // Pas 1: Crida assignar(arrel, 10, 'X')
            addStep(1, "algo.avl_assignar.step_1",
                { ...hlDefault, "50": "#facc15" },
                [...lBase],
                { p: "&arrel (50)", "p->clau": "50", clau: "10", alcada_50: "1" },
                undefined,
                labelsInitial
            );

            // Pas 2: if (p) a l'arrel 50
            addStep(2, "algo.avl_assignar.step_2",
                { ...hlDefault, "50": "#facc15" },
                [...lBase],
                { p: "0x50 (no nul)", clau: "10" },
                undefined,
                labelsInitial
            );

            // Pas 3: 10 < 50 (cert)
            addStep(3, "algo.avl_assignar.step_3",
                { ...hlDefault, "50": "#facc15" },
                [...lBase],
                { comparacio: "10 < 50 (cert)", clau: "10", "p->clau": "50" },
                undefined,
                labelsInitial
            );

            // Pas 4: assignar(p->fesq, 10) -> node 30
            addStep(4, "algo.avl_assignar.step_4",
                { ...hlDefault, "50": "#38bdf8", "30": "#facc15" },
                [...lBase],
                { p: "&(50->fesq) (30)", "p->clau": "30", clau: "10", alcada_30: "1" },
                undefined,
                labelsInitial
            );

            // Pas 5: if (p) al node 30
            addStep(2, "algo.avl_assignar.step_5",
                { ...hlDefault, "50": "#38bdf8", "30": "#facc15" },
                [...lBase],
                { p: "0x30 (no nul)", clau: "10" },
                undefined,
                labelsInitial
            );

            // Pas 6: 10 < 30 (cert)
            addStep(3, "algo.avl_assignar.step_6",
                { ...hlDefault, "50": "#38bdf8", "30": "#facc15" },
                [...lBase],
                { comparacio: "10 < 30 (cert)", clau: "10", "p->clau": "30" },
                undefined,
                labelsInitial
            );

            // Pas 7: assignar(p->fesq, 10) -> node 20
            addStep(4, "algo.avl_assignar.step_7",
                { ...hlDefault, "50": "#38bdf8", "30": "#38bdf8", "20": "#facc15" },
                [...lBase],
                { p: "&(30->fesq) (20)", "p->clau": "20", clau: "10", alcada_20: "0" },
                undefined,
                labelsInitial
            );

            // Pas 8: if (p) al node 20
            addStep(2, "algo.avl_assignar.step_8",
                { ...hlDefault, "50": "#38bdf8", "30": "#38bdf8", "20": "#facc15" },
                [...lBase],
                { p: "0x20 (no nul)", clau: "10" },
                undefined,
                labelsInitial
            );

            // Pas 9: 10 < 20 (cert)
            addStep(3, "algo.avl_assignar.step_9",
                { ...hlDefault, "50": "#38bdf8", "30": "#38bdf8", "20": "#facc15" },
                [...lBase],
                { comparacio: "10 < 20 (cert)", clau: "10", "p->clau": "20" },
                undefined,
                labelsInitial
            );

            // Pas 10: assignar(20->fesq, 10) -> nullptr
            addStep(4, "algo.avl_assignar.step_10",
                { ...hlDefault, "20": "#facc15" },
                [...lBase],
                { p: "20->fesq (nullptr)", clau: "10" },
                undefined,
                labelsInitial
            );

            // Pas 11: if (p) és fals -> cas base
            addStep(2, "algo.avl_assignar.step_11",
                { ...hlDefault, "20": "#facc15" },
                [...lBase],
                { p: "nullptr (fals)", accio: "branca else" },
                undefined,
                labelsInitial
            );

            // Pas 12: p = new Node(10, ...) -> inserit com a fulla
            const lWith10 = [
                ...lBase,
                { source: "20", target: "10", color: "#22c55e" }
            ];
            addStep(21, "algo.avl_assignar.step_12",
                { ...hlDefault, "20": "#38bdf8", "10": "#22c55e" },
                lWith10,
                { p: "new Node(10, 'X', 0)", "20->fesq": "0x10", h_10: "0" },
                undefined,
                labelsInitial
            );

            // Pas 13: ++n
            addStep(22, "algo.avl_assignar.step_13",
                { ...hlDefault, "20": "#38bdf8", "10": "#22c55e" },
                lWith10,
                { n: "++n", clau: "10" },
                undefined,
                labelsInitial
            );

            // Pas 14: Retorn a 20: comprovació desequilibri alcada(fesq) - alcada(fdre) == 2
            addStep(5, "algo.avl_assignar.step_14",
                { ...hlDefault, "20": "#facc15", "10": "#22c55e" },
                lWith10,
                { node: "20", h_fesq: "0", h_fdre: "-1", balanc: "1", desequilibri: "No" },
                undefined,
                labelsInitial
            );

            // Pas 15: actualitzar_alcada(20) -> h=1
            const labelsH20: Record<string, string> = {
                ...labelsInitial,
                "20": "20 (h=1)"
            };
            addStep(9, "algo.avl_assignar.step_15",
                { ...hlDefault, "20": "#38bdf8", "10": "#3b82f6" },
                lWith10,
                { node: "20", alcada_actualitzada: "1" },
                undefined,
                labelsH20
            );

            // Pas 16: Retorn a 30: comprovació desequilibri alcada(fesq) - alcada(fdre) == 2
            addStep(5, "algo.avl_assignar.step_16",
                { ...hlDefault, "30": "#facc15", "20": "#38bdf8" },
                lWith10,
                { node: "30", h_fesq: "1", h_fdre: "0", balanc: "1", desequilibri: "No" },
                undefined,
                labelsH20
            );

            // Pas 17: actualitzar_alcada(30) -> h=2
            const labelsH30: Record<string, string> = {
                ...labelsH20,
                "30": "30 (h=2)"
            };
            addStep(9, "algo.avl_assignar.step_17",
                { ...hlDefault, "30": "#38bdf8" },
                lWith10,
                { node: "30", alcada_actualitzada: "2" },
                undefined,
                labelsH30
            );

            // Pas 18: Retorn a l'arrel 50: ALERTA DESEQUILIBRI 2 - 0 = 2!
            addStep(5, "algo.avl_assignar.step_18",
                { ...hlDefault, "50": "#ef4444", "30": "#facc15" },
                lWith10,
                { node: "50", h_fesq: "2", h_fdre: "0", balanc: "+2 (DESEQUILIBRI)", estat: "Alerta!" },
                undefined,
                labelsH30
            );

            // Pas 19: Comprovació if (clau < p->fesq->clau) -> 10 < 30 (Cas LL!)
            addStep(6, "algo.avl_assignar.step_19",
                { ...hlDefault, "50": "#ef4444", "30": "#facc15", "10": "#38bdf8" },
                lWith10,
                { comparacio: "10 < 30 (cert)", cas: "Cas LL (Left-Left)", accio: "Executar LL(p)" },
                undefined,
                labelsH30
            );

            // Pas 20: Execució de la rotació LL(50) -> reequilibri i canvi de geometria!
            const posAfterLL: Record<string, { fx: number; fy: number }> = {
                "30": { fx: 0,   fy: -110 }, // nova arrel
                "20": { fx: -70, fy: -35 },
                "50": { fx: 70,  fy: -35 },
                "10": { fx: -110, fy: 40 },
                "40": { fx: 35,  fy: 40 },
                "70": { fx: 110, fy: 40 }
            };
            const lRotated = [
                { source: "30", target: "20", color: "#22c55e" },
                { source: "30", target: "50", color: "#22c55e" },
                { source: "20", target: "10", color: "#475569" },
                { source: "50", target: "40", color: "#38bdf8" }, // 40 traspassat a 50->fesq!
                { source: "50", target: "70", color: "#475569" }
            ];
            const labelsRotated: Record<string, string> = {
                "30": "30 (h=2)",
                "20": "20 (h=1)",
                "50": "50 (h=1)",
                "10": "10 (h=0)",
                "40": "40 (h=0)",
                "70": "70 (h=0)"
            };

            addStep(6, "algo.avl_assignar.step_20",
                { "30": "#22c55e", "20": "#38bdf8", "50": "#38bdf8", "10": "#3b82f6", "40": "#38bdf8", "70": "#3b82f6" },
                lRotated,
                { rotacio: "LL completada", nova_arrel: "30", pivot: "50 passa a fill dret", subarbre_40: "passa a 50->fesq" },
                posAfterLL,
                labelsRotated
            );

            // Pas 21: actualitzar_alcada(p) sobre la nova arrel 30 i final
            const lFinal = lRotated.map(l => ({ ...l, color: "#475569" }));
            addStep(9, "algo.avl_assignar.step_21",
                { "30": "#22c55e", "20": "#22c55e", "50": "#22c55e", "10": "#22c55e", "40": "#22c55e", "70": "#22c55e" },
                lFinal,
                { estat: "Arbre equilibrat", h_total: "2", rotacions_fetes: "1 (màxim 1 per inserció)", cost: "Θ(log n)" },
                posAfterLL,
                labelsRotated
            );

            return steps;
        }
    }
};

export const avl_assignar: Simulation = {
    id: legacyAlgo.avl_assignar.id,
    renderer: "graph",
    code: avl_assignar_code,
    initialState: legacyAlgo.avl_assignar.initialGraph,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.avl_assignar.generateSteps().map((step: AlgoStep) => ({
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
