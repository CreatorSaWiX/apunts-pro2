

export interface AlgoStep {
    line: number;
    description: string;
    highlights: Record<string | number, string>; // nodeId -> color
    variables: Record<string, string>;
}

export interface Algorithm {
    id: string;
    code: string;
    initialGraph: {
        nodes: { id: string | number; label: string; group?: number; fx?: number; fy?: number }[];
        links: { source: string | number; target: string | number; label?: string }[];
    }
    generateSteps: () => AlgoStep[];
}

export const algorithms: Record<string, Algorithm> = {
    dfs: {
        id: "dfs",
        code: `vector<int> DFS(const vector<vector<int>>& G, int v) {
    stack<int> P;
    vector<int> W;
    vector<bool> visitat(G.size(), false);
    
    P.push(v);
    visitat[v] = true;
    W.push_back(v);
    
    while (!P.empty()) {
        int x = P.top();
        bool hi_ha_nou = false;
        
        for (int y : G[x]) {
            if (!visitat[y]) {
                P.push(y);
                visitat[y] = true;
                W.push_back(y);
                hi_ha_nou = true;
                break;
            }
        }
        
        if (!hi_ha_nou) {
            P.pop();
        }
    }
    
    return W;
}`,
        initialGraph: {
            nodes: [
                { id: 0, label: "0", fx: 0, fy: -120 },
                { id: 1, label: "1", fx: -80, fy: -40 },
                { id: 2, label: "2", fx: 80, fy: -40 },
                { id: 3, label: "3", fx: -120, fy: 40 },
                { id: 4, label: "4", fx: -40, fy: 40 },
                { id: 5, label: "5", fx: 120, fy: 40 }
            ],
            links: [
                { source: 0, target: 1 },
                { source: 0, target: 2 },
                { source: 1, target: 3 },
                { source: 1, target: 4 },
                { source: 2, target: 5 }
            ]
        },
        generateSteps: () => {
            const steps: AlgoStep[] = [];
            const adj = [
                [1, 2], // 0
                [3, 4], // 1
                [5],    // 2
                [],     // 3
                [],     // 4
                []      // 5
            ];

            const P: number[] = [];
            const W: number[] = [];
            const visitat = [false, false, false, false, false, false];
            const highlights: Record<number, string> = {};

            const addStep = (line: number, desc: string, overrideVars: Record<string, string> = {}) => {
                steps.push({
                    line,
                    description: desc,
                    highlights: { ...highlights },
                    variables: {
                        "Pila (P)": `[${P.join(', ')}]`,
                        "Resultat (W)": `[${W.join(', ')}]`,
                        ...overrideVars
                    }
                });
            };

            const startNode = 0;
            addStep(2, "Inicialitzem les estructures: Pila P i Vector W buits.");

            P.push(startNode);
            visitat[startNode] = true;
            W.push(startNode);
            highlights[startNode] = "#10b981"; // Emerald for visited/current

            addStep(6, `Afegim el vèrtex inicial ${startNode} a la pila, el marquem com visitat i l'afegim a la solució.`);

            while (P.length > 0) {
                const x = P[P.length - 1]; // top

                // Highlight current node top
                for (const key in highlights) if (highlights[key] === "#facc15") highlights[key] = "#10b981"; // change prev yellow to green
                highlights[x] = "#facc15"; // yellow for current top

                addStep(11, `Mirem el cim de la pila. x = ${x}`, { x: x.toString() });

                let hi_ha_nou = false;

                for (const y of adj[x]) {
                    addStep(14, `Comprovem els veïns de ${x}. Mirem el veí ${y}.`, { x: x.toString(), y: y.toString() });
                    if (!visitat[y]) {
                        P.push(y);
                        visitat[y] = true;
                        W.push(y);
                        hi_ha_nou = true;
                        highlights[y] = "#10b981"; // newly visited

                        addStep(16, `El vèrtex ${y} NO està visitat. Ens hi enfonsem! Afegim a la Pila i parem de buscar més veïns (break).`, { x: x.toString(), y: y.toString() });
                        break;
                    } else {
                        addStep(15, `El vèrtex ${y} ja estava visitat. L'ignorem.`, { x: x.toString(), y: y.toString() });
                    }
                }

                if (!hi_ha_nou) {
                    addStep(24, `No hi ha veïns nous des de ${x}. Fem Backtrack: el traiem de la pila (desempilar).`);
                    const popped = P.pop();
                    if (popped !== undefined) highlights[popped] = "#3b82f6"; // blue for finished
                    addStep(25, `Pila reduïda.`);
                }
            }

            // Turn all to blue at end
            for (const key in highlights) highlights[key] = "#3b82f6";
            addStep(29, "Pila buida! L'algorisme DFS ha acabat. Retornem els nodes visitats.");

            return steps;
        }
    }
}
