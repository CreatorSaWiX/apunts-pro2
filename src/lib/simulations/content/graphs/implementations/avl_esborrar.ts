import type { Simulation, SimulationStep } from "../../../engine/types";
import avl_esborrar_code from "../code/avl_esborrar/source.cpp?raw";

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
    avl_esborrar: {
        id: "avl_esborrar",
        initialGraph: {
            nodes: [
                { id: "30", label: "30 (h=3)", fx: 0,   fy: -100, color: "#3b82f6" },
                { id: "20", label: "20 (h=1)", fx: -70, fy: -30,  color: "#3b82f6" },
                { id: "50", label: "50 (h=2)", fx: 70,  fy: -30,  color: "#3b82f6" },
                { id: "40", label: "40 (h=1)", fx: 35,  fy: 45,   color: "#3b82f6" },
                { id: "60", label: "60 (h=1)", fx: 105, fy: 45,   color: "#3b82f6" }
            ],
            links: [
                { source: "30", target: "20", color: "#475569" },
                { source: "30", target: "50", color: "#475569" },
                { source: "50", target: "40", color: "#475569" },
                { source: "50", target: "60", color: "#475569" }
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
                { source: "50", target: "60", color: "#475569" }
            ];

            const posInitial: Record<string, { fx: number; fy: number }> = {
                "30": { fx: 0,   fy: -100 },
                "20": { fx: -70, fy: -30 },
                "50": { fx: 70,  fy: -30 },
                "40": { fx: 35,  fy: 45 },
                "60": { fx: 105, fy: 45 }
            };

            const labelsInitial = {
                "30": "30 (h=3)",
                "20": "20 (h=1)",
                "50": "50 (h=2)",
                "40": "40 (h=1)",
                "60": "60 (h=1)"
            };

            const hlDefault: Record<string, string> = {
                "30": "#3b82f6",
                "20": "#3b82f6",
                "50": "#3b82f6",
                "40": "#3b82f6",
                "60": "#3b82f6"
            };

            // Pas 1: Inici esborrar(arrel, 20)
            addStep(15, "algo.avl_esborrar.step_1",
                { ...hlDefault, "30": "#facc15" },
                [...lInitial],
                { ...labelsInitial },
                { ...posInitial },
                { "p": "0x30 (arrel)", "clau": "20", "alc(30)": "3", "n": "5" }
            );

            // Pas 2: if (!p) fals
            addStep(16, "algo.avl_esborrar.step_2",
                { ...hlDefault, "30": "#facc15" },
                [...lInitial],
                { ...labelsInitial },
                { ...posInitial },
                { "p": "0x30 (no nul)", "clau": "20" }
            );

            // Pas 3: 20 < 30 cert -> recursió esquerra
            addStep(17, "algo.avl_esborrar.step_3",
                { ...hlDefault, "30": "#facc15" },
                [...lInitial],
                { ...labelsInitial },
                { ...posInitial },
                { "comparació": "20 < 30 (cert)", "acció": "esborrar(p->fesq, 20)" }
            );

            // Pas 4: esborrar(p->fesq, 20) al node 20
            addStep(15, "algo.avl_esborrar.step_4",
                { ...hlDefault, "20": "#facc15" },
                [...lInitial],
                { ...labelsInitial },
                { ...posInitial },
                { "p": "0x20", "p->clau": "20", "clau": "20" }
            );

            // Pas 5: if (!p) fals
            addStep(16, "algo.avl_esborrar.step_5",
                { ...hlDefault, "20": "#facc15" },
                [...lInitial],
                { ...labelsInitial },
                { ...posInitial },
                { "p": "0x20 (no nul)" }
            );

            // Pas 6: 20 < 20 fals
            addStep(17, "algo.avl_esborrar.step_6",
                { ...hlDefault, "20": "#facc15" },
                [...lInitial],
                { ...labelsInitial },
                { ...posInitial },
                { "comparació": "20 < 20 (fals)" }
            );

            // Pas 7: 20 > 20 fals -> trobat!
            addStep(18, "algo.avl_esborrar.step_7",
                { ...hlDefault, "20": "#ef4444" },
                [...lInitial],
                { ...labelsInitial },
                { ...posInitial },
                { "trobat": "20 == 20", "acció": "eliminar node" }
            );

            // Pas 8: Cas fulla -> p = nullptr
            addStep(21, "algo.avl_esborrar.step_8",
                { ...hlDefault, "20": "#ef4444" },
                [...lInitial],
                { ...labelsInitial },
                { ...posInitial },
                { "old": "0x20", "p": "nullptr", "30->fesq": "nullptr" }
            );

            // Pas 9: delete old; --n
            const lAfterDelete = [
                { source: "30", target: "50", color: "#475569" },
                { source: "50", target: "40", color: "#475569" },
                { source: "50", target: "60", color: "#475569" }
            ];
            addStep(31, "algo.avl_esborrar.step_9",
                { ...hlDefault, "20": "rgba(0,0,0,0)", "30": "#3b82f6" },
                lAfterDelete,
                { ...labelsInitial, "30": "30 (h=3?)" },
                { ...posInitial },
                { "node": "20 alliberat", "n": "4" }
            );

            // Pas 10: Retorn al pare (30), crida equilibrar_esq(p)
            addStep(17, "algo.avl_esborrar.step_10",
                { ...hlDefault, "20": "rgba(0,0,0,0)", "30": "#facc15" },
                lAfterDelete,
                { ...labelsInitial, "30": "30 (h=3?)" },
                { ...posInitial },
                { "p": "0x30", "p->fesq": "nullptr", "p->fdre": "0x50", "acció": "equilibrar_esq(p)" }
            );

            // Pas 11: equilibrar_esq: alcada(50) - alcada(null) == 2 (Desequilibri!)
            addStep(2, "algo.avl_esborrar.step_11",
                { ...hlDefault, "20": "rgba(0,0,0,0)", "30": "#facc15", "50": "#f97316" },
                lAfterDelete,
                { ...labelsInitial, "30": "30 (h=3?)" },
                { ...posInitial },
                { "alc(fdre)": "2", "alc(fesq)": "0", "factor": "+2 (DESEQUILIBRI)" }
            );

            // Pas 12: Comprovació rotació doble: alcada(40) - alcada(60) == 1 fals
            addStep(3, "algo.avl_esborrar.step_12",
                { ...hlDefault, "20": "rgba(0,0,0,0)", "30": "#facc15", "50": "#f97316", "40": "#3b82f6", "60": "#3b82f6" },
                lAfterDelete,
                { ...labelsInitial, "30": "30 (h=3?)" },
                { ...posInitial },
                { "alc(40)": "1", "alc(60)": "1", "diferència": "0 ≠ 1", "rotació": "no és RL" }
            );

            // Pas 13: else RR(p) -> Rotació simple a l'esquerra!
            const lAfterRotation = [
                { source: "50", target: "30", color: "#22c55e" },
                { source: "50", target: "60", color: "#475569" },
                { source: "30", target: "40", color: "#22c55e" }
            ];
            const posAfterRotation: Record<string, { fx: number; fy: number }> = {
                "50": { fx: 0,   fy: -100 },
                "30": { fx: -70, fy: -30 },
                "60": { fx: 70,  fy: -30 },
                "40": { fx: -35, fy: 45 },
                "20": { fx: -120, fy: 120 }
            };
            const labelsAfterRotation = {
                "50": "50 (h=2)",
                "30": "30 (h=2)",
                "40": "40 (h=1)",
                "60": "60 (h=1)",
                "20": ""
            };
            addStep(4, "algo.avl_esborrar.step_13",
                { ...hlDefault, "20": "rgba(0,0,0,0)", "50": "#22c55e", "30": "#facc15" },
                lAfterRotation,
                labelsAfterRotation,
                posAfterRotation,
                { "rotació": "RR(30)", "nova arrel": "50", "fill esquerre": "30", "fill dret": "60" }
            );

            // Pas 14: Final de l'esborrat i reequilibri complet
            const lFinal = [
                { source: "50", target: "30", color: "#475569" },
                { source: "50", target: "60", color: "#475569" },
                { source: "30", target: "40", color: "#475569" }
            ];
            addStep(34, "algo.avl_esborrar.step_14",
                { "30": "#10b981", "50": "#10b981", "40": "#10b981", "60": "#10b981", "20": "rgba(0,0,0,0)" },
                lFinal,
                labelsAfterRotation,
                posAfterRotation,
                { "estat": "Arbre AVL reequilibrat", "arrel": "50", "alçada": "2", "n": "4", "cost": "O(log n)" }
            );

            return steps;
        }
    }
};

export const avl_esborrar: Simulation = {
    id: legacyAlgo.avl_esborrar.id,
    renderer: "graph",
    code: avl_esborrar_code,
    initialState: legacyAlgo.avl_esborrar.initialGraph,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.avl_esborrar.generateSteps().map((step: AlgoStep) => ({
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
