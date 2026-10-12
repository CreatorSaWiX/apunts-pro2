import type { Simulation, SimulationStep } from "../../../engine/types";
import abc_cerca_code from "../code/abc_cerca/source.cpp?raw";

interface AlgoStep {
    line: number;
    description: string;
    highlights: Record<string | number, string>; // nodeId -> color
    nodeLabels?: Record<string | number, string>; // nodeId -> label text
    links?: { source: string | number; target: string | number; label?: string; color?: string; curvature?: number }[];
    variables: Record<string, string>;
}

const legacyAlgo: Record<string, { id: string; initialGraph?: Record<string, unknown>; generateSteps: () => AlgoStep[] }> = {
    abc_cerca: {
        id: "abc_cerca",
        initialGraph: {
            nodes: [
                { id: "40", label: "40 ('A')", fx: 0,    fy: -110, color: "#3b82f6" },
                { id: "20", label: "20 ('B')", fx: -80,  fy: -30,  color: "#3b82f6" },
                { id: "60", label: "60 ('C')", fx: 80,   fy: -30,  color: "#3b82f6" },
                { id: "10", label: "10 ('D')", fx: -120, fy: 50,   color: "#3b82f6" },
                { id: "30", label: "30 ('E')", fx: -40,  fy: 50,   color: "#3b82f6" },
                { id: "50", label: "50 ('F')", fx: 40,   fy: 50,   color: "#3b82f6" },
                { id: "70", label: "70 ('G')", fx: 120,  fy: 50,   color: "#3b82f6" }
            ],
            links: [
                { source: "40", target: "20", color: "#475569" },
                { source: "40", target: "60", color: "#475569" },
                { source: "20", target: "10", color: "#475569" },
                { source: "20", target: "30", color: "#475569" },
                { source: "60", target: "50", color: "#475569" },
                { source: "60", target: "70", color: "#475569" }
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
                { source: "20", target: "30", color: "#475569" },
                { source: "60", target: "50", color: "#475569" },
                { source: "60", target: "70", color: "#475569" }
            ];

            const hlDefault: Record<string, string> = {
                "40": "#3b82f6",
                "20": "#3b82f6",
                "60": "#3b82f6",
                "10": "#3b82f6",
                "30": "#3b82f6",
                "50": "#3b82f6",
                "70": "#3b82f6"
            };

            // Pas 1: Crida inicial cerca(arrel, 30). p apunta al node 40
            addStep(1, "algo.abc_cerca.step_1",
                { ...hlDefault, "40": "#facc15" },
                [...lBase],
                { "p": "&Node(40)", "p->clau": "40", "clau": "30" }
            );

            // Pas 2: Comprovació if (!p)
            addStep(2, "algo.abc_cerca.step_2",
                { ...hlDefault, "40": "#facc15" },
                [...lBase],
                { "p": "&Node(40) (no nul)", "condicio": "p != nullptr" }
            );

            // Pas 3: Comprovació if (clau < p->clau) -> 30 < 40 (cert). Descartem subarbre dret (60, 50, 70)
            const lAfter40 = lBase.map(l => {
                if (l.source === "40" && l.target === "20") return { ...l, color: "#38bdf8" };
                if (l.source === "40" && l.target === "60") return { ...l, color: "#1e293b" };
                if (l.source === "60") return { ...l, color: "#1e293b" };
                return l;
            });
            addStep(3, "algo.abc_cerca.step_3",
                { ...hlDefault, "40": "#38bdf8", "60": "#1e293b", "50": "#1e293b", "70": "#1e293b" },
                lAfter40,
                { "comparacio": "30 < 40 (cert)", "clau": "30", "p->clau": "40", "decisio": "cerca(p->fesq, 30)" }
            );

            // Pas 4: Crida recursiva cerca(p->fesq, 30) -> node 20
            addStep(1, "algo.abc_cerca.step_4",
                { ...hlDefault, "40": "#475569", "20": "#facc15", "60": "#1e293b", "50": "#1e293b", "70": "#1e293b" },
                lAfter40,
                { "p": "&Node(20)", "p->clau": "20", "clau": "30" }
            );

            // Pas 5: Comprovació if (!p)
            addStep(2, "algo.abc_cerca.step_5",
                { ...hlDefault, "40": "#475569", "20": "#facc15", "60": "#1e293b", "50": "#1e293b", "70": "#1e293b" },
                lAfter40,
                { "p": "&Node(20) (no nul)", "condicio": "p != nullptr" }
            );

            // Pas 6: Comprovació if (clau < p->clau) -> 30 < 20 (fals)
            addStep(3, "algo.abc_cerca.step_6",
                { ...hlDefault, "40": "#475569", "20": "#facc15", "60": "#1e293b", "50": "#1e293b", "70": "#1e293b" },
                lAfter40,
                { "comparacio": "30 < 20 (fals)", "clau": "30", "p->clau": "20" }
            );

            // Pas 7: Comprovació if (clau > p->clau) -> 30 > 20 (cert). Descartem subarbre esquerre (node 10)
            const lAfter20 = lAfter40.map(l => {
                if (l.source === "20" && l.target === "30") return { ...l, color: "#38bdf8" };
                if (l.source === "20" && l.target === "10") return { ...l, color: "#1e293b" };
                return l;
            });
            addStep(4, "algo.abc_cerca.step_7",
                { ...hlDefault, "40": "#475569", "20": "#38bdf8", "10": "#1e293b", "60": "#1e293b", "50": "#1e293b", "70": "#1e293b" },
                lAfter20,
                { "comparacio": "30 > 20 (cert)", "clau": "30", "p->clau": "20", "decisio": "cerca(p->fdre, 30)" }
            );

            // Pas 8: Crida recursiva cerca(p->fdre, 30) -> node 30
            addStep(1, "algo.abc_cerca.step_8",
                { ...hlDefault, "40": "#475569", "20": "#475569", "30": "#facc15", "10": "#1e293b", "60": "#1e293b", "50": "#1e293b", "70": "#1e293b" },
                lAfter20,
                { "p": "&Node(30)", "p->clau": "30", "clau": "30" }
            );

            // Pas 9: Comprovació if (!p)
            addStep(2, "algo.abc_cerca.step_9",
                { ...hlDefault, "40": "#475569", "20": "#475569", "30": "#facc15", "10": "#1e293b", "60": "#1e293b", "50": "#1e293b", "70": "#1e293b" },
                lAfter20,
                { "p": "&Node(30) (no nul)", "condicio": "p != nullptr" }
            );

            // Pas 10: Comprovació if (clau < p->clau) -> 30 < 30 (fals)
            addStep(3, "algo.abc_cerca.step_10",
                { ...hlDefault, "40": "#475569", "20": "#475569", "30": "#facc15", "10": "#1e293b", "60": "#1e293b", "50": "#1e293b", "70": "#1e293b" },
                lAfter20,
                { "comparacio": "30 < 30 (fals)", "clau": "30", "p->clau": "30" }
            );

            // Pas 11: Comprovació if (clau > p->clau) -> 30 > 30 (fals)
            addStep(4, "algo.abc_cerca.step_11",
                { ...hlDefault, "40": "#475569", "20": "#475569", "30": "#facc15", "10": "#1e293b", "60": "#1e293b", "50": "#1e293b", "70": "#1e293b" },
                lAfter20,
                { "comparacio": "30 > 30 (fals)", "coincidencia": "30 == 30", "estat": "Clau trobada!" }
            );

            // Pas 12: Retorn del punter p: return p; Camí complet en verd (#22c55e)
            const lFound = lAfter20.map(l => {
                if ((l.source === "40" && l.target === "20") || (l.source === "20" && l.target === "30")) {
                    return { ...l, color: "#22c55e" };
                }
                return l;
            });
            addStep(5, "algo.abc_cerca.step_12",
                { ...hlDefault, "40": "#22c55e", "20": "#22c55e", "30": "#22c55e", "10": "#1e293b", "60": "#1e293b", "50": "#1e293b", "70": "#1e293b" },
                lFound,
                { "retorn": "&Node(30, 'E')", "resultat": "TROBAT", "comparacions": "3 (alçada h)", "cost": "Θ(h)" }
            );

            return steps;
        }
    }
};

export const abc_cerca: Simulation = {
    id: legacyAlgo.abc_cerca.id,
    renderer: "graph",
    code: abc_cerca_code,
    initialState: legacyAlgo.abc_cerca.initialGraph,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.abc_cerca.generateSteps().map((step: AlgoStep) => ({
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
