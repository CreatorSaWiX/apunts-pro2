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
    },
    three_regular_cut_bridge: {
        id: "three_regular_cut_bridge",
        title: "Vèrtex de Tall en Graf 3-Regular",
        steps: [
            {
                description: "Sigui $v$ un vèrtex de tall en un graf 3-regular. Per definició, el seu grau és 3, amb veïns $x, y, z$.",
                latex: "\\text{deg}(v) = 3, \\text{ Veïns}(v) = \\{x, y, z\\}",
                graphData: {
                    nodes: [
                        { id: "v", label: "v (Tall)", color: "#ef4444", x: 0, y: 0 },
                        { id: "x", label: "x", color: "#3b82f6", x: 0, y: -80 },
                        { id: "y", label: "y", color: "#3b82f6", x: -70, y: 60 },
                        { id: "z", label: "z", color: "#3b82f6", x: 70, y: 60 },
                    ],
                    links: [
                        { source: "v", target: "x" },
                        { source: "v", target: "y" },
                        { source: "v", target: "z" },
                    ]
                }
            },
            {
                description: "Si eliminem el vèrtex $v$, el graf es desconnecta en, com a mínim, 2 components connexos ($C_1, C_2, \\dots$).",
                latex: "G - \\{v\\} = C_1 \\cup C_2 \\cup \\dots",
                graphData: {
                    nodes: [
                        { id: "x", label: "x", color: "#3b82f6", x: 0, y: -80 },
                        { id: "y", label: "y", color: "#3b82f6", x: -70, y: 60 },
                        { id: "z", label: "z", color: "#3b82f6", x: 70, y: 60 },
                        { id: "c1", label: "Comp 1", color: "#1e293b", x: 0, y: -130 },
                        { id: "c2", label: "Comp 2", color: "#1e293b", x: 0, y: 130 },
                    ],
                    links: [
                        { source: "x", target: "c1" },
                        { source: "y", target: "c2" },
                        { source: "z", target: "c2" },
                    ]
                }
            },
            {
                description: "Com que només hi havia 3 arestes sortint de $v$, el repartiment entre components ens deixa, almenys, un component amb un sol veí.",
                latex: "3 \\text{ arestes} \\to \\ge 2 \\text{ components} \\implies \\text{algun } C_i \\text{ té només 1 veí de } v",
                graphData: {
                    nodes: [
                        { id: "v", label: "v", color: "#ef4444", x: 0, y: 0 },
                        { id: "x", label: "x", color: "#3b82f6", x: 0, y: -80 },
                        { id: "y", label: "y", color: "#3b82f6", x: -70, y: 60 },
                        { id: "z", label: "z", color: "#3b82f6", x: 70, y: 60 },
                        { id: "c1", label: "Components de x", color: "#3b82f6", x: 0, y: -130 },
                        { id: "c2", label: "Resta del graf", color: "#94a3b8", x: 0, y: 130 },
                    ],
                    links: [
                        { source: "v", target: "x", color: "#facc15" },
                        { source: "v", target: "y" },
                        { source: "v", target: "z" },
                        { source: "x", target: "c1" },
                        { source: "y", target: "c2" },
                        { source: "z", target: "c2" },
                    ]
                }
            },
            {
                description: "Si $x$ és l'únic veí de $v$ en el component $C_1$, llavors l'aresta $xv$ és l'únic camí per connectar $C_1$ amb la resta. Per tant, $xv$ és un PONT.",
                latex: "xv \\text{ és aresta pont.}",
                graphData: {
                    nodes: [
                        { id: "v", label: "v", color: "#ef4444", x: 0, y: 0 },
                        { id: "x", label: "x", color: "#3b82f6", x: 0, y: -80 },
                        { id: "y", label: "y", color: "#94a3b8", x: -70, y: 60 },
                        { id: "z", label: "z", color: "#94a3b8", x: 70, y: 60 },
                        { id: "c1", label: "C1", color: "#3b82f6", x: 0, y: -130 },
                    ],
                    links: [
                        { source: "v", target: "x", color: "#facc15" },
                        { source: "x", target: "c1" },
                    ]
                }
            }
        ]
    },
    diameter_bound_dense: {
        id: "diameter_bound_dense",
        title: "Diàmetre en Grafs Densos",
        steps: [
            {
                description: "Volem demostrar que si $n=1001$ i $\\delta(G) \\ge 500$, llavors $D(G) \\le 2$. Ho farem per absurd suposant que existeixen dos nodes $u, v$ a distància $\\ge 3$.",
                latex: "dist(u,v) \\ge 3",
                graphData: {
                    nodes: [
                        { id: "u", label: "u", color: "#3b82f6", x: -150, y: 0 },
                        { id: "v", label: "v", color: "#ef4444", x: 150, y: 0 },
                    ],
                    links: []
                }
            },
            {
                description: "Si la distància és $\\ge 3$, no pot haver-hi cap vèrtex compartit entre els seus veïns. Si n'hi hagués un ($x$), la distància seria 2 ($u \\to x \\to v$).",
                latex: "N(u) \\cap N(v) = \\emptyset",
                graphData: {
                    nodes: [
                        { id: "u", label: "u", color: "#3b82f6", x: -150, y: 0 },
                        { id: "v", label: "v", color: "#ef4444", x: 150, y: 0 },
                        { id: "nu1", label: "", color: "#3b82f6", x: -100, y: -40 },
                        { id: "nu2", label: "N(u)", color: "#3b82f6", x: -100, y: 40 },
                        { id: "nv1", label: "", color: "#ef4444", x: 100, y: -40 },
                        { id: "nv2", label: "N(v)", color: "#ef4444", x: 100, y: 40 },
                    ],
                    links: [
                        { source: "u", target: "nu1" }, { source: "u", target: "nu2" },
                        { source: "v", target: "nv1" }, { source: "v", target: "nv2" },
                    ]
                }
            },
            {
                description: "A més, $u$ i $v$ no poden estar connectats, i $u \\notin N(v)$ i $v \\notin N(u)$. Per tant, els quatre conjunts {u}, {v}, N(u) i N(v) són disjunts.",
                latex: "\\text{Ordre } n \\ge |\\{u\\}| + |\\{v\\}| + |N(u)| + |N(v)|",
                graphData: {
                    nodes: [
                        { id: "u", label: "u", color: "#3b82f6", x: -150, y: 0 },
                        { id: "nu", label: "≥ 500 nodes", color: "#3b82f6", x: -100, y: 50 },
                        { id: "v", label: "v", color: "#ef4444", x: 150, y: 0 },
                        { id: "nv", label: "≥ 500 nodes", color: "#ef4444", x: 100, y: 50 },
                    ],
                    links: [
                        { source: "u", target: "nu" },
                        { source: "v", target: "nv" },
                    ]
                }
            },
            {
                description: "Sumant els vèrtexs: $1 (u) + 500 (N(u)) + 1 (v) + 500 (N(v)) = 1002$. Com que el graf només té $1001$ vèrtexs, hem arribat a una contradicció!",
                latex: "1 + 500 + 1 + 500 = 1002 > 1001 \\implies \\text{ABSURD!}",
                graphData: {
                    nodes: [
                        { id: "total", label: "Necessitem 1002 vèrtexs", color: "#facc15", x: 0, y: 0 },
                    ],
                    links: []
                }
            }
        ]
    }
};
