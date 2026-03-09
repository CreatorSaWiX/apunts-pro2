export interface ProofStep {
    description: string;
    latex?: string;
    highlights?: Record<string | number, string>;
    graphData?: {
        nodes: { id: string | number; label: string; color?: string; x?: number; y?: number }[];
        links: { source: string | number; target: string | number; color?: string }[];
    };
}

export interface Proof {
    id: string;
    title: string;
    steps: ProofStep[];
}

export const proofs: Record<string, Proof> = {
    bipartite_product: {
        id: "bipartite_product",
        title: "Producte de Grafs Bipartits",
        steps: [
            {
                description: "Comencem amb dos grafs bipartits $G_1$ i $G_2$. Per a l'exemple, usem $K_2$ per a tots dos.",
                latex: "G_1, G_2 \\text{ són bipartits.}",
                graphData: {
                    nodes: [
                        { id: "A", label: "A (X1)", color: "#3b82f6", x: -100, y: -50 },
                        { id: "B", label: "B (Y1)", color: "#ef4444", x: -100, y: 50 },
                        { id: "1", label: "1 (X2)", color: "#3b82f6", x: 100, y: -50 },
                        { id: "2", label: "2 (Y2)", color: "#ef4444", x: 100, y: 50 },
                    ],
                    links: [
                        { source: "A", target: "B" },
                        { source: "1", target: "2" },
                    ]
                }
            },
            {
                description: "El producte $G_1 \\times G_2$ té com a vèrtexs totes les parelles $(u, v)$. Els col·loquem en una graella.",
                latex: "V(G_1 \\times G_2) = V_1 \\times V_2",
                graphData: {
                    nodes: [
                        { id: "(A,1)", label: "(A,1)", x: -50, y: -50 },
                        { id: "(A,2)", label: "(A,2)", x: 50, y: -50 },
                        { id: "(B,1)", label: "(B,1)", x: -50, y: 50 },
                        { id: "(B,2)", label: "(B,2)", x: 50, y: 50 },
                    ],
                    links: []
                }
            },
            {
                description: "Les arestes es defineixen si un vèrtex és adjacent i l'altre és igual.",
                latex: "(u,v) \\sim (u',v') \\iff (u \\sim u', v=v') \\text{ o } (u=u', v \\sim v')",
                graphData: {
                    nodes: [
                        { id: "(A,1)", label: "(A,1)", x: -50, y: -50 },
                        { id: "(A,2)", label: "(A,2)", x: 50, y: -50 },
                        { id: "(B,1)", label: "(B,1)", x: -50, y: 50 },
                        { id: "(B,2)", label: "(B,2)", x: 50, y: 50 },
                    ],
                    links: [
                        { source: "(A,1)", target: "(B,1)" },
                        { source: "(A,1)", target: "(A,2)" },
                        { source: "(B,2)", target: "(A,2)" },
                        { source: "(B,2)", target: "(B,1)" },
                    ]
                }
            },
            {
                description: "Definim la partició $A$ i $B$. El conjunt $A$ conté les parelles on tots dos vèrtexs estan a la mateixa part ($X$ o $Y$).",
                latex: "A = (X_1 \\times X_2) \\cup (Y_1 \\times Y_2)",
                graphData: {
                    nodes: [
                        { id: "(A,1)", label: "(A,1)", color: "#ffffff", x: -50, y: -50 },
                        { id: "(A,2)", label: "(A,2)", x: 50, y: -50 },
                        { id: "(B,1)", label: "(B,1)", x: -50, y: 50 },
                        { id: "(B,2)", label: "(B,2)", color: "#ffffff", x: 50, y: 50 },
                    ],
                    links: [
                        { source: "(A,1)", target: "(B,1)" },
                        { source: "(A,1)", target: "(A,2)" },
                        { source: "(B,2)", target: "(A,2)" },
                        { source: "(B,2)", target: "(B,1)" },
                    ]
                }
            },
            {
                description: "El conjunt $B$ conté les parelles on els vèrtexs estan en parts creuades.",
                latex: "B = (X_1 \\times Y_2) \\cup (Y_1 \\times X_2)",
                graphData: {
                    nodes: [
                        { id: "(A,1)", label: "(A,1)", color: "#ffffff", x: -50, y: -50 },
                        { id: "(A,2)", label: "(A,2)", color: "#000000", x: 50, y: -50 },
                        { id: "(B,1)", label: "(B,1)", color: "#000000", x: -50, y: 50 },
                        { id: "(B,2)", label: "(B,2)", color: "#ffffff", x: 50, y: 50 },
                    ],
                    links: [
                        { source: "(A,1)", target: "(B,1)" },
                        { source: "(A,1)", target: "(A,2)" },
                        { source: "(B,2)", target: "(A,2)" },
                        { source: "(B,2)", target: "(B,1)" },
                    ]
                }
            },
            {
                description: "Com veiem, totes les arestes connecten un vèrtex Blanc amb un Negre. El graf és bipartit!",
                latex: "\\text{Aresta } \\{(u,v), (u',v')\\} \\implies \\text{un a } A \\text{ i l'altre a } B.",
                graphData: {
                    nodes: [
                        { id: "(A,1)", label: "⬜", color: "#ffffff", x: -50, y: -50 },
                        { id: "(A,2)", label: "⬛", color: "#000000", x: 100, y: -100 },
                        { id: "(B,1)", label: "⬛", color: "#000000", x: -100, y: 100 },
                        { id: "(B,2)", label: "⬜", color: "#ffffff", x: 50, y: 50 },
                    ],
                    links: [
                        { source: "(A,1)", target: "(B,1)" },
                        { source: "(A,1)", target: "(A,2)" },
                        { source: "(B,2)", target: "(A,2)" },
                        { source: "(B,2)", target: "(B,1)" },
                    ]
                }
            }
        ]
    }
};
