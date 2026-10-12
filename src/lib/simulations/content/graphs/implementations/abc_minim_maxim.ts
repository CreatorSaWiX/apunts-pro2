import type { Simulation, SimulationStep } from "../../../engine/types";
import abc_minim_maxim_code from "../code/abc_minim_maxim/source.cpp?raw";

interface AlgoStep {
    line: number;
    description: string;
    highlights: Record<string | number, string>;
    nodeLabels?: Record<string | number, string>;
    links?: { source: string | number; target: string | number; label?: string; color?: string; curvature?: number }[];
    variables: Record<string, string>;
}

const legacyAlgo: Record<string, { id: string; initialGraph?: Record<string, unknown>; generateSteps: () => AlgoStep[] }> = {
    abc_minim_maxim: {
        id: "abc_minim_maxim",
        initialGraph: {
            nodes: [
                { id: "40", label: "40", fx: 0,    fy: -100, color: "#3b82f6" },
                { id: "20", label: "20", fx: -80,  fy: -20,  color: "#3b82f6" },
                { id: "60", label: "60", fx: 80,   fy: -20,  color: "#3b82f6" },
                { id: "10", label: "10", fx: -120, fy: 60,   color: "#3b82f6" },
                { id: "30", label: "30", fx: -40,  fy: 60,   color: "#3b82f6" },
                { id: "50", label: "50", fx: 40,   fy: 60,   color: "#3b82f6" },
                { id: "70", label: "70", fx: 120,  fy: 60,   color: "#3b82f6" }
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
                vars: Record<string, string>,
                nodeLabels?: Record<string, string>
            ) => {
                steps.push({ line, description: desc, highlights, links, variables: vars, nodeLabels });
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

            // --- PART 1: CERCA DEL MÍNIM (RECURSIVA) ---
            // Pas 1: minim(arrel), p apunta a 40
            addStep(1, "algo.abc_minim_maxim.step_1",
                { ...hlDefault, "40": "#facc15" },
                [...lBase],
                { "funció": "minim(p)", "p": "&Node(40)", "p->clau": "40", "p->fesq": "&Node(20)" }
            );

            // Pas 2: p->fesq no és nullptr, descendim a 20
            const lMin1 = lBase.map(l => {
                if (l.source === "40" && l.target === "20") return { ...l, color: "#38bdf8" };
                if (l.source === "40" && l.target === "60") return { ...l, color: "#1e293b" };
                if (l.source === "60") return { ...l, color: "#1e293b" };
                return l;
            });
            addStep(2, "algo.abc_minim_maxim.step_2",
                { ...hlDefault, "40": "#38bdf8", "60": "#1e293b", "50": "#1e293b", "70": "#1e293b" },
                lMin1,
                { "p->fesq": "&Node(20) != nullptr", "decisió": "minim(p->fesq)", "subarbre_dret": "Descartat (claus majors)" }
            );

            // Pas 3: Crida recursiva minim(p->fesq), p apunta a 20
            addStep(1, "algo.abc_minim_maxim.step_3",
                { ...hlDefault, "40": "#475569", "20": "#facc15", "60": "#1e293b", "50": "#1e293b", "70": "#1e293b" },
                lMin1,
                { "funció": "minim(p)", "p": "&Node(20)", "p->clau": "20", "p->fesq": "&Node(10)" }
            );

            // Pas 4: p->fesq no és nullptr, descendim a 10
            const lMin2 = lMin1.map(l => {
                if (l.source === "20" && l.target === "10") return { ...l, color: "#38bdf8" };
                if (l.source === "20" && l.target === "30") return { ...l, color: "#1e293b" };
                return l;
            });
            addStep(2, "algo.abc_minim_maxim.step_4",
                { ...hlDefault, "40": "#475569", "20": "#38bdf8", "30": "#1e293b", "60": "#1e293b", "50": "#1e293b", "70": "#1e293b" },
                lMin2,
                { "p->fesq": "&Node(10) != nullptr", "decisió": "minim(p->fesq)", "node_30": "Descartat (claus majors)" }
            );

            // Pas 5: Crida recursiva minim(p->fesq), p apunta a 10
            addStep(1, "algo.abc_minim_maxim.step_5",
                { ...hlDefault, "40": "#475569", "20": "#475569", "10": "#facc15", "30": "#1e293b", "60": "#1e293b", "50": "#1e293b", "70": "#1e293b" },
                lMin2,
                { "funció": "minim(p)", "p": "&Node(10)", "p->clau": "10", "p->fesq": "nullptr" }
            );

            // Pas 6: p->fesq és nullptr, retorna p (10)
            const lMinFound = lMin2.map(l => {
                if ((l.source === "40" && l.target === "20") || (l.source === "20" && l.target === "10")) {
                    return { ...l, color: "#22c55e" };
                }
                return l;
            });
            addStep(2, "algo.abc_minim_maxim.step_6",
                { ...hlDefault, "40": "#22c55e", "20": "#22c55e", "10": "#22c55e", "30": "#1e293b", "60": "#1e293b", "50": "#1e293b", "70": "#1e293b" },
                lMinFound,
                { "p->fesq": "nullptr", "retorn": "&Node(10)", "resultat": "MÍNIM = 10", "cost": "Θ(h)" },
                { "10": "10 (MÍNIM)" }
            );

            // --- PART 2: CERCA DEL MÀXIM (ITERATIVA) ---
            // Pas 7: maxim(arrel), p apunta a 40
            addStep(5, "algo.abc_minim_maxim.step_7",
                { ...hlDefault, "40": "#facc15" },
                [...lBase],
                { "funció": "maxim(p)", "p": "&Node(40)", "p->clau": "40", "p->fdre": "&Node(60)" }
            );

            // Pas 8: while (p->fdre) cert, p avança a 60
            const lMax1 = lBase.map(l => {
                if (l.source === "40" && l.target === "60") return { ...l, color: "#38bdf8" };
                if (l.source === "40" && l.target === "20") return { ...l, color: "#1e293b" };
                if (l.source === "20") return { ...l, color: "#1e293b" };
                return l;
            });
            addStep(6, "algo.abc_minim_maxim.step_8",
                { ...hlDefault, "40": "#475569", "60": "#facc15", "20": "#1e293b", "10": "#1e293b", "30": "#1e293b" },
                lMax1,
                { "p->fdre": "&Node(60) != nullptr", "avanç": "p = p->fdre", "p": "&Node(60)", "p->clau": "60" }
            );

            // Pas 9: while (p->fdre) cert, p avança a 70
            const lMax2 = lMax1.map(l => {
                if (l.source === "60" && l.target === "70") return { ...l, color: "#38bdf8" };
                if (l.source === "60" && l.target === "50") return { ...l, color: "#1e293b" };
                return l;
            });
            addStep(6, "algo.abc_minim_maxim.step_9",
                { ...hlDefault, "40": "#475569", "60": "#475569", "70": "#facc15", "50": "#1e293b", "20": "#1e293b", "10": "#1e293b", "30": "#1e293b" },
                lMax2,
                { "p->fdre": "&Node(70) != nullptr", "avanç": "p = p->fdre", "p": "&Node(70)", "p->clau": "70" }
            );

            // Pas 10: while (p->fdre) fals (p->fdre == nullptr), acaba bucle
            addStep(6, "algo.abc_minim_maxim.step_10",
                { ...hlDefault, "40": "#475569", "60": "#475569", "70": "#facc15", "50": "#1e293b", "20": "#1e293b", "10": "#1e293b", "30": "#1e293b" },
                lMax2,
                { "p->fdre": "nullptr", "condició": "Falsa (fi bucle)", "p": "&Node(70)" }
            );

            // Pas 11: return p (70)
            const lMaxFound = lMax2.map(l => {
                if ((l.source === "40" && l.target === "60") || (l.source === "60" && l.target === "70")) {
                    return { ...l, color: "#22c55e" };
                }
                return l;
            });
            addStep(7, "algo.abc_minim_maxim.step_11",
                { ...hlDefault, "40": "#22c55e", "60": "#22c55e", "70": "#22c55e", "50": "#1e293b", "20": "#1e293b", "10": "#1e293b", "30": "#1e293b" },
                lMaxFound,
                { "retorn": "&Node(70)", "resultat": "MÀXIM = 70", "cost": "Θ(h)" },
                { "70": "70 (MÀXIM)" }
            );

            return steps;
        }
    }
};

export const abc_minim_maxim: Simulation = {
    id: legacyAlgo.abc_minim_maxim.id,
    renderer: "graph",
    code: abc_minim_maxim_code,
    initialState: legacyAlgo.abc_minim_maxim.initialGraph,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.abc_minim_maxim.generateSteps().map((step: AlgoStep) => ({
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
