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

const dfsCode = `vector<int> DFS(const vector<vector<int>>& G, int v) {
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
}`;

const bfsCode = `void breadth_first(BinTree<int> t) {
    if (t.empty()) return;
    
    queue<BinTree<int>> Q;
    Q.push(t);
    
    while (!Q.empty()) {
        BinTree<int> act = Q.front(); 
        Q.pop();
        
        cout << act.value() << ' '; 
        
        if (!act.left().empty()) Q.push(act.left());
        if (!act.right().empty()) Q.push(act.right());
    }
}`;

const bfs2Code = `vector<int> BFS(const vector<vector<int>>& G, int v) {
    queue<int> C;
    vector<int> W;
    vector<int> D(G.size(), 0);
    vector<bool> visitat(G.size(), false);
    
    C.push(v);
    visitat[v] = true;
    W.push_back(v);
    
    while (!C.empty()) {
        int x = C.front();
        bool hi_ha_nou = false;
        
        for (int y : G[x]) {
            if (!visitat[y]) {
                C.push(y);
                visitat[y] = true;
                W.push_back(y);
                D[y] = D[x] + 1;
                hi_ha_nou = true;
                break;
            }
        }
        
        if (!hi_ha_nou) {
            C.pop();
        }
    }
    
    return D;
}`;

const preordreCode = `void preordre(BinTree<int> t) {
    if (!t.empty()) {
        cout << t.value() << ' ';
        preordre(t.left());
        preordre(t.right());
    }
}`;

const inordreCode = `void inordre(BinTree<int> t) {
    if (!t.empty()) {
        inordre(t.left());
        cout << t.value() << ' ';
        inordre(t.right());
    }
}`;

const postordreCode = `void postordre(BinTree<int> t) {
    if (!t.empty()) {
        postordre(t.left());
        postordre(t.right());
        cout << t.value() << ' ';
    }
}`;

const treeGraph = {
    nodes: [
        { id: 1, label: "1", fx: 0, fy: -100 },
        { id: 2, label: "2", fx: -60, fy: -20 },
        { id: 3, label: "3", fx: 60, fy: -20 },
        { id: 4, label: "4", fx: -90, fy: 60 },
        { id: 5, label: "5", fx: -30, fy: 60 },
        { id: 6, label: "6", fx: 30, fy: 60 },
        { id: 7, label: "7", fx: 90, fy: 60 }
    ],
    links: [
        { source: 1, target: 2 },
        { source: 1, target: 3 },
        { source: 2, target: 4 },
        { source: 2, target: 5 },
        { source: 3, target: 6 },
        { source: 3, target: 7 }
    ]
};

const treeLeft: Record<number, number | null> = { 1: 2, 2: 4, 3: 6, 4: null, 5: null, 6: null, 7: null };
const treeRight: Record<number, number | null> = { 1: 3, 2: 5, 3: 7, 4: null, 5: null, 6: null, 7: null };

export const algorithms: Record<string, Algorithm> = {
    dfs: {
        id: "dfs",
        code: dfsCode,
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
            const adj = [[1, 2], [3, 4], [5], [], [], []];
            const P: number[] = [];
            const W: number[] = [];
            const visitat = [false, false, false, false, false, false];
            const highlights: Record<number, string> = {};

            const addStep = (line: number, desc: string, overrideVars: Record<string, string> = {}) => {
                steps.push({
                    line,
                    description: desc,
                    highlights: { ...highlights },
                    variables: { "Pila (P)": `[${P.join(', ')}]`, "Resultat": `[${W.join(', ')}]`, ...overrideVars }
                });
            };

            addStep(2, "Inicialitzem les estructures: Pila P i Vector W buits.");
            P.push(0);
            visitat[0] = true;
            W.push(0);
            highlights[0] = "#10b981";
            addStep(6, "Afegim el vèrtex inicial 0 a la pila, marquem com a visitat i afegim a resultat.");

            while (P.length > 0) {
                const x = P[P.length - 1];
                for (const key in highlights) if (highlights[key] === "#facc15") highlights[key] = "#10b981";
                highlights[x] = "#facc15";
                addStep(11, `Mirem el cim de la pila. x = ${x}`, { x: x.toString() });

                let hi_ha_nou = false;
                for (const y of adj[x]) {
                    if (!visitat[y]) {
                        P.push(y);
                        visitat[y] = true;
                        W.push(y);
                        hi_ha_nou = true;
                        highlights[y] = "#10b981";
                        addStep(16, `Veí ${y} de ${x} no visitat. Ens hi enfonsem (break)!`, { x: x.toString(), y: y.toString() });
                        break;
                    }
                }
                if (!hi_ha_nou) {
                    addStep(24, `No hi ha veïns nous des de ${x}. Fem pop() desempilant.`);
                    const popped = P.pop();
                    if (popped !== undefined) highlights[popped] = "#3b82f6";
                }
            }
            for (const key in highlights) highlights[key] = "#3b82f6";
            addStep(29, "Pila buida! DFS ha acabat.");
            return steps;
        }
    },
    bfs: {
        id: "bfs",
        code: bfsCode,
        initialGraph: treeGraph,
        generateSteps: () => {
            const steps: AlgoStep[] = [];
            const Q: number[] = [];
            const W: number[] = [];
            const highlights: Record<number, string> = {};

            const addStep = (line: number, desc: string, overrideVars: Record<string, string> = {}) => {
                steps.push({
                    line,
                    description: desc,
                    highlights: { ...highlights },
                    variables: { "Cua (Q)": `[${Q.join(', ')}]`, "Resultat (cout)": `[${W.join(', ')}]`, ...overrideVars }
                });
            };

            addStep(2, "Comprovem que l'arbre no és buit.");
            Q.push(1);
            highlights[1] = "#facc15";
            addStep(5, "Encuem l'arrel (1).");

            while (Q.length > 0) {
                const act = Q.shift()!;
                highlights[act] = "#10b981"; // Processing
                W.push(act);

                addStep(8, `Traiem l'element frontal (${act}) de la cua i el processem.`, { act: act.toString() });

                const left = treeLeft[act];
                const right = treeRight[act];

                if (left !== null) {
                    Q.push(left);
                    highlights[left] = "#facc15"; // In queue
                    addStep(14, `El fill esquerre de ${act} no és buit (${left}). L'encuem.`, { act: act.toString() });
                }
                if (right !== null) {
                    Q.push(right);
                    highlights[right] = "#facc15"; // In queue
                    addStep(15, `El fill dret de ${act} no és buit (${right}). L'encuem.`, { act: act.toString() });
                }

                highlights[act] = "#3b82f6"; // Done
            }

            addStep(17, "Cua buida! L'algorisme BFS ha acabat.");
            return steps;
        }
    },
    bfs2: {
        id: "bfs2",
        code: bfs2Code,
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
            const adj = [[1, 2], [0, 3, 4], [0, 5], [1], [1], [2]];
            const C: number[] = [];
            let W: number[] = [];
            const D: number[] = [0, 0, 0, 0, 0, 0];
            const visitat = [false, false, false, false, false, false];
            const highlights: Record<number, string> = {};

            const addStep = (line: number, desc: string, overrideVars: Record<string, string> = {}) => {
                steps.push({
                    line,
                    description: desc,
                    highlights: { ...highlights },
                    variables: { "Cua (C)": `[${C.join(', ')}]`, "Visitat (W)": `[${W.join(', ')}]`, "Distància (D)": `[${D.join(', ')}]`, ...overrideVars }
                });
            };

            addStep(2, "Inicialitzem les estructures: Cua C, Vectors W, D i visitat buits/a 0.");

            const v = 0;
            C.push(v);
            visitat[v] = true;
            W.push(v);
            D[v] = 0;
            highlights[v] = "#10b981"; // In list W (green)
            addStep(8, `Afegim el vèrtex inicial v=${v} a la cua, marquem com a visitat, a W i D[${v}]=0.`);

            while (C.length > 0) {
                const x = C[0];
                for (let key in highlights) if (highlights[key] === "#facc15") highlights[key] = "#10b981";
                if (highlights[x] !== "#3b82f6") highlights[x] = "#facc15"; // currently checking x

                addStep(12, `Mirem el primer element de la cua sense treure'l: x=${x}.`, { x: String(x) });

                let y = -1;
                for (let vehi of adj[x]) {
                    if (!visitat[vehi]) {
                        y = vehi;
                        break;
                    }
                }

                if (y !== -1) {
                    C.push(y);
                    visitat[y] = true;
                    W.push(y);
                    D[y] = D[x] + 1;
                    highlights[y] = "#10b981";
                    addStep(18, `Trobem el veí y=${y} d'x=${x} encara no visitat. L'afegim i D[${y}]=D[${x}]+1 (break).`, { x: String(x), y: String(y) });
                } else {
                    addStep(26, `No hi ha més veïns nous per x=${x}. El traiem definitivament de la cua (pop).`, { x: String(x) });
                    const popped = C.shift();
                    if (popped !== undefined) highlights[popped] = "#3b82f6"; // finished
                }
            }

            for (let key in highlights) highlights[key] = "#3b82f6";
            addStep(31, "Cua buida! L'algorisme BFS ha acabat i tenim totes les distàncies.");
            return steps;
        }
    },
    preordre: {
        id: "preordre",
        code: preordreCode,
        initialGraph: treeGraph,
        generateSteps: () => {
            const steps: AlgoStep[] = [];
            const W: number[] = [];
            const highlights: Record<number, string> = {};

            const addStep = (line: number, desc: string, currentNode: number) => {
                const nodeStr = currentNode === 0 ? "null" : currentNode.toString();
                steps.push({
                    line,
                    description: desc,
                    highlights: { ...highlights },
                    variables: { "Crida actual (t.value)": nodeStr, "Resultat (cout)": `[${W.join(', ')}]` }
                });
            };

            const recurse = (node: number | null) => {
                const nodeVal = node || 0;
                addStep(1, `Cridem preordre(${nodeVal === 0 ? 'null' : nodeVal})`, nodeVal);
                if (node === null) {
                    addStep(2, "L'arbre és buit, retornem.", 0);
                    return;
                }

                highlights[node] = "#facc15"; // Yellow for visiting

                W.push(node);
                highlights[node] = "#10b981"; // Green for printed
                addStep(3, `Arrel: Imprimim el valor central ${node}.`, node);

                addStep(4, `Anem al subarbre esquerre de ${node}.`, node);
                recurse(treeLeft[node]);

                addStep(5, `Anem al subarbre dret de ${node}.`, node);
                recurse(treeRight[node]);

                highlights[node] = "#3b82f6"; // Blue for finished
                addStep(6, `Hem acabat amb el node ${node}, fem return cap amunt.`, node);
            };

            recurse(1);
            addStep(7, "S'ha visitat tot l'arbre en Preordre.", 1);
            return steps;
        }
    },
    inordre: {
        id: "inordre",
        code: inordreCode,
        initialGraph: treeGraph,
        generateSteps: () => {
            const steps: AlgoStep[] = [];
            const W: number[] = [];
            const highlights: Record<number, string> = {};

            const addStep = (line: number, desc: string, currentNode: number) => {
                const nodeStr = currentNode === 0 ? "null" : currentNode.toString();
                steps.push({
                    line,
                    description: desc,
                    highlights: { ...highlights },
                    variables: { "Crida actual (t.value)": nodeStr, "Resultat (cout)": `[${W.join(', ')}]` }
                });
            };

            const recurse = (node: number | null) => {
                const nodeVal = node || 0;
                addStep(1, `Cridem inordre(${nodeVal === 0 ? 'null' : nodeVal})`, nodeVal);
                if (node === null) {
                    addStep(2, "L'arbre és buit, retornem.", 0);
                    return;
                }

                highlights[node] = "#facc15"; // Yellow for visiting

                addStep(3, `Anem primer de tot al subarbre esquerre de ${node}.`, node);
                recurse(treeLeft[node]);

                W.push(node);
                highlights[node] = "#10b981"; // Green for printed
                addStep(4, `Arrel: Ja hem fet l'esquerre, així que imprimim el node ${node}.`, node);

                addStep(5, `Anem al subarbre dret de ${node}.`, node);
                recurse(treeRight[node]);

                highlights[node] = "#3b82f6"; // Blue for finished
                addStep(6, `Hem acabat amb el node ${node}, fem return cap amunt.`, node);
            };

            recurse(1);
            addStep(7, "S'ha visitat tot l'arbre en Inordre.", 1);
            return steps;
        }
    },
    postordre: {
        id: "postordre",
        code: postordreCode,
        initialGraph: treeGraph,
        generateSteps: () => {
            const steps: AlgoStep[] = [];
            const W: number[] = [];
            const highlights: Record<number, string> = {};

            const addStep = (line: number, desc: string, currentNode: number) => {
                const nodeStr = currentNode === 0 ? "null" : currentNode.toString();
                steps.push({
                    line,
                    description: desc,
                    highlights: { ...highlights },
                    variables: { "Crida actual (t.value)": nodeStr, "Resultat (cout)": `[${W.join(', ')}]` }
                });
            };

            const recurse = (node: number | null) => {
                const nodeVal = node || 0;
                addStep(1, `Cridem postordre(${nodeVal === 0 ? 'null' : nodeVal})`, nodeVal);
                if (node === null) {
                    addStep(2, "L'arbre és buit, retornem.", 0);
                    return;
                }

                highlights[node] = "#facc15"; // Yellow for visiting

                addStep(3, `Anem primer al subarbre esquerre de ${node}.`, node);
                recurse(treeLeft[node]);

                addStep(4, `Ara anem al subarbre dret de ${node}.`, node);
                recurse(treeRight[node]);

                W.push(node);
                highlights[node] = "#10b981"; // Green for printed
                addStep(5, `Arrel: Imprimim el valor central ${node} al final de tot.`, node);

                highlights[node] = "#3b82f6"; // Blue for finished
                addStep(6, `Hem acabat amb el node ${node}, fem return cap amunt.`, node);
            };

            recurse(1);
            addStep(7, "S'ha visitat tot l'arbre en Postordre.", 1);
            return steps;
        }
    }
};
