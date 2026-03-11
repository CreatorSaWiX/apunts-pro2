export interface AlgoStep {
    line: number;
    description: string;
    highlights: Record<string | number, string>; // nodeId -> color
    nodeLabels?: Record<string | number, string>; // nodeId -> label text
    variables: Record<string, string>;
}

export interface Algorithm {
    id: string;
    code: string;
    initialGraph: {
        nodes: { id: string | number; label: string; group?: number; fx?: number; fy?: number; color?: string }[];
        links: { source: string | number; target: string | number; label?: string }[];
    };
    generateSteps: () => AlgoStep[];
}

const cercaHeightCode = `int height(BinTree<int> t) {
    if (t.empty()) return 0;
    return 1 + max(height(t.left()), height(t.right()));
}

bool cerca(const BinTree<int>& t, int x) {
    if (t.empty()) return false;
    if (t.value() == x) return true;
    return cerca(t.left(), x) || cerca(t.right(), x);
}`;

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

const postordreCode = `void postordre(Node* node) {
    if (node == nullptr) return;
    postordre(node->left);
    postordre(node->right);
    cout << node->value << " ";
}`;

const pairMultitaskCode = `pair<double, int> sum_and_size__(BinTree<double> t) {
    if (t.empty()) return {0.0, 0};
    
    auto L = sum_and_size__(t.left());
    auto R = sum_and_size__(t.right());
    
    return {
        t.value() + L.first + R.first, 
        1 + L.second + R.second
    };
}`;

const rebuildPreorderCode = `// Input cin: "10 5 # # 14 # #"
template <typename T>
pro2::BinTree<T> build_preorder(istream& cin) {
    string token;
    cin >> token;
    
    if (token == "#" || !cin) return pro2::BinTree<T>(); 
    
    T value = read_value<T>(token);
    auto left = build_preorder<T>(cin);
    auto right = build_preorder<T>(cin);
    
    return pro2::BinTree<T>(value, left, right);
}`;

const eulerianCheckCode = `bool is_eulerian(const vector<vector<int>>& G) {
    int odd_count = 0;
    
    for (int i = 0; i < G.size(); i++) {
        if (G[i].size() % 2 != 0) {
            odd_count++;
        }
    }
    
    // Si tots parells -> Circuit Eulerià
    if (odd_count == 0) return true; 
    
    // Si exactament 2 senars -> Senderó Eulerià
    if (odd_count == 2) return true; 
    
    return false;
}`;

const hamiltonianBacktrackCode = `bool hamiltonian_path(int u, int count, int n,
                      const vector<vector<int>>& G,
                      vector<bool>& visitat, vector<int>& path) {
    if (count == n) return true;
    
    for (int v : G[u]) {
        if (!visitat[v]) {
            visitat[v] = true;
            path.push_back(v);
            
            if (hamiltonian_path(v, count + 1, n, G, visitat, path)) {
                return true;
            }
            
            // Backtracking: Aquest camí no té sortida final, desfem iteració
            visitat[v] = false;
            path.pop_back();
        }
    }
    return false;
}`;

const pruferBuildCode = `vector<int> build_prufer(const vector<vector<int>>& G) {
    int n = G.size();
    vector<int> degree(n);
    vector<bool> actiu(n, true);
    for(int i=0; i<n; i++) degree[i] = G[i].size();
    
    vector<int> prufer;
    for(int step=0; step < n-2; step++) {
        int leaf = -1;
        for(int i=0; i<n; i++) {
            if(degree[i] == 1 && actiu[i]) { leaf = i; break; }
        }
        
        int neighbor = -1;
        for(int v : G[leaf]) {
            if(actiu[v]) { neighbor = v; break; }
        }
        
        prufer.push_back(neighbor);
        actiu[leaf] = false;
        degree[leaf]--;
        degree[neighbor]--;
    }
    return prufer;
}`;

const pruferRebuildCode = `vector<pair<int, int>> rebuild_prufer(const vector<int>& P, int n) {
    vector<int> degree(n, 1);
    for(int v : P) degree[v]++;
    
    vector<pair<int, int>> edges;
    vector<bool> actiu(n, true);
    
    for(int p_node : P) {
        int leaf = -1;
        for(int i=0; i<n; i++) {
            if(degree[i] == 1 && actiu[i]) { leaf = i; break; }
        }
        
        edges.push_back({leaf, p_node});
        actiu[leaf] = false;
        degree[leaf]--;
        degree[p_node]--;
    }
    
    int u = -1, v = -1;
    for(int i=0; i<n; i++) {
        if(actiu[i]) {
            if(u == -1) u = i;
            else v = i;
        }
    }
    edges.push_back({u, v});
    return edges;
}`;

const heapPushCode = `template <typename T>
void Heap<T>::push(const T& x) {
    resize_(1);
    elems_[size_] = x;
    flow_up_(size_);
}

template <typename T>
void Heap<T>::flow_up_(int i) {
    while (i > 1 && elems_[i] > elems_[i / 2]) {
        std::swap(elems_[i], elems_[i / 2]);
        i /= 2;
    }
}`;

const heapPopCode = `template <typename T>
void Heap<T>::pop() {
    elems_[1] = elems_[size_];
    resize_(-1);
    flow_down_(1);
}

template <typename T>
void Heap<T>::flow_down_(int i) {
    int left = 2 * i, right = 2 * i + 1;
    int max = i;
    if (left <= size_ && elems_[left] > elems_[max]) max = left;
    if (right <= size_ && elems_[right] > elems_[max]) max = right;
    
    if (max != i) {
        std::swap(elems_[i], elems_[max]);
        flow_down_(max);
    }
}`;

const treeSearchCode = `bool tree_search(Tree<int> t, int x) {
    if (t.empty()) return false;
    if (t.value() == x) return true;
    
    for (int i = 0; i < t.num_children(); i++) {
        if (tree_search(t.child(i), x)) {
            return true;
        }
    }
    return false;
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
    eulerian_check: {
        id: "eulerian_check",
        code: eulerianCheckCode,
        initialGraph: {
            nodes: [
                { id: 0, label: "0 (Gr 2)", fx: -60, fy: -40 },
                { id: 1, label: "1 (Gr 3)", fx: 60, fy: -40 },
                { id: 2, label: "2 (Gr 3)", fx: -60, fy: 40 },
                { id: 3, label: "3 (Gr 2)", fx: 60, fy: 40 }
            ],
            links: [
                { source: 0, target: 1 },
                { source: 0, target: 2 },
                { source: 1, target: 2 },
                { source: 1, target: 3 },
                { source: 2, target: 3 }
            ]
        },
        generateSteps: () => {
            const steps: AlgoStep[] = [];
            const adj = [[1, 2], [0, 2, 3], [0, 1, 3], [1, 2]];
            let odd_count = 0;
            const hl: Record<number, string> = {};

            const addStep = (line: number, desc: string, vars: Record<string, string> = {}) => {
                steps.push({ line, description: desc, highlights: { ...hl }, variables: vars });
            };

            addStep(2, "Iniciem el comptador de vèrtexs amb un grau senar.", { odd_count: "0" });

            for (let i = 0; i < adj.length; i++) {
                hl[i] = "#facc15"; // yellow
                const degree = adj[i].length;
                addStep(5, `Avaluem el grau del vèrtex ${i}. Grau = ${degree}.`, { i: i.toString(), degree: degree.toString(), odd_count: odd_count.toString() });
                if (degree % 2 !== 0) {
                    odd_count++;
                    hl[i] = "#ef4444"; // red meaning odd
                    addStep(6, `El grau és senar! Incrementem el comptador d'anomalies.`, { i: i.toString(), odd_count: odd_count.toString() });
                } else {
                    hl[i] = "#10b981"; // green meaning even
                    addStep(9, `El grau és parell, passem al següent vèrtex sense alterar res.`, { i: i.toString(), odd_count: odd_count.toString() });
                }
            }

            addStep(11, "Avaluació final! Hem acabat el recorregut.", { odd_count: odd_count.toString() });

            if (odd_count === 0) {
                addStep(12, "0 anomalies (tots parell)! El graf permet un Circuit Eulerià perfecte.", { odd_count: odd_count.toString() });
            } else if (odd_count === 2) {
                addStep(15, "Exactament 2 nodes senars. El graf té Senderó Eulerià, obligant origen/destí.", { odd_count: odd_count.toString() });
            } else {
                addStep(17, "NO ÉS EULERIÀ. Com hi ha 2 nodes senars, el recorregut complet fallarà segur.", { odd_count: odd_count.toString() });
            }
            return steps;
        }
    },
    hamiltonian_backtrack: {
        id: "hamiltonian_backtrack",
        code: hamiltonianBacktrackCode,
        initialGraph: {
            nodes: [
                { id: 0, label: "0", fx: 0, fy: -80 },
                { id: 1, label: "1", fx: -60, fy: 0 },
                { id: 2, label: "2", fx: 60, fy: 0 },
                { id: 3, label: "3", fx: 0, fy: 60 }
            ],
            links: [
                { source: 0, target: 1 },
                { source: 0, target: 2 },
                { source: 1, target: 2 },
                { source: 1, target: 3 },
                { source: 2, target: 3 }
            ]
        },
        generateSteps: () => {
            const steps: AlgoStep[] = [];
            const adj = [[1, 2], [0, 2, 3], [0, 1, 3], [1, 2]];
            const visitat = [false, false, false, false];
            const path: number[] = [];
            const hl: Record<number, string> = {};

            const addStep = (line: number, desc: string, overrideVars: Record<string, string> = {}) => {
                steps.push({ line, description: desc, highlights: { ...hl }, variables: { path: `[${path.join(', ')}]`, ...overrideVars } });
            };

            const solve = (u: number, count: number): boolean => {
                addStep(1, `Entrem al vèrtex ${u}. Nodes visitats (count) = ${count}.`, { u: u.toString(), count: count.toString() });

                if (count === 4) {
                    addStep(2, "ÈXIT! count == n (4). Hem trobat un camí per tots els vèrtexs d'una passada.", { count: count.toString() });
                    for (let i = 0; i < 4; i++) hl[i] = "#22c55e"; // bright green
                    return true;
                }

                for (const v of adj[u]) {
                    addStep(5, `Des del vèrtex ${u}, explorem anar cap al veí ${v}.`, { u: u.toString(), v: v.toString() });
                    if (!visitat[v]) {
                        visitat[v] = true;
                        path.push(v);
                        const oldColor = hl[v];
                        hl[v] = "#3b82f6"; // blue in path

                        addStep(7, `Veí ${v} inèdit! L'afegim al camí i marquem com visitat. Truquem recursivitat.`, { u: u.toString(), v: v.toString() });

                        if (solve(v, count + 1)) {
                            addStep(11, `La branca explorada retorna true. Propaguem l'èxit i sortim.`, { u: u.toString(), v: v.toString() });
                            return true;
                        }

                        // Backtracking
                        visitat[v] = false;
                        path.pop();
                        if (oldColor) hl[v] = oldColor;
                        else delete hl[v];

                        hl[u] = "#ef4444"; // Backtracked warning logic
                        addStep(15, `BACKTRACKING! Arribem a un atzucac visitant ${v}. Desfem els registres (marxa enrere).`, { u: u.toString(), v: v.toString() });
                        hl[u] = "#3b82f6"; // Restore
                    } else {
                        addStep(6, `El veí ${v} ja és al camí. Ignorem per no repetir.`, { u: u.toString(), v: v.toString() });
                    }
                }

                addStep(20, `Cap opció des de ${u} funciona completament. Aquest camí falla.`, { u: u.toString() });
                return false;
            };

            visitat[0] = true;
            path.push(0);
            hl[0] = "#3b82f6";
            addStep(1, `Iniciem l'algorisme des de l'arrel Origen (0).`, { u: "0", count: "1" });
            solve(0, 1);

            return steps;
        }
    },
    prufer_build: {
        id: "prufer_build",
        code: pruferBuildCode,
        initialGraph: {
            nodes: [
                { id: 0, label: "0", fx: -60, fy: 0 }, { id: 1, label: "1", fx: -120, fy: -40 },
                { id: 2, label: "2", fx: 0, fy: 0 }, { id: 3, label: "3", fx: -40, fy: 60 },
                { id: 4, label: "4", fx: 60, fy: 0 }, { id: 5, label: "5", fx: 120, fy: 40 }
            ],
            links: [
                { source: 0, target: 1 }, { source: 0, target: 2 },
                { source: 2, target: 3 }, { source: 2, target: 4 },
                { source: 4, target: 5 }
            ]
        },
        generateSteps: () => {
            const steps: AlgoStep[] = [];
            const hl: Record<number, string> = {};
            const prufer: number[] = [];
            const adj = [[1, 2], [0], [0, 3, 4], [2], [2, 5], [4]];
            const degree = [2, 1, 3, 1, 2, 1];
            const actiu = [true, true, true, true, true, true];
            const n = 6;

            const formatVars = () => {
                let degStr = "[";
                for (let i = 0; i < n; i++) degStr += (actiu[i] ? degree[i] : "-") + (i < n - 1 ? ", " : "");
                degStr += "]";
                return { prufer: `[${prufer.join(', ')}]`, degree: degStr };
            };

            const addStep = (line: number, desc: string, ov: Record<string, string> = {}) => {
                steps.push({ line, description: desc, highlights: { ...hl }, variables: { ...formatVars(), ...ov } });
            };

            addStep(2, "Iniciem els graus (degree) i activem tots els nodes (actiu).", { n: "6" });

            for (let step = 0; step < n - 2; step++) {
                addStep(8, `Inici del pas ${step + 1} de ${n - 2}: Busquem la fulla (activa) amb la ID més petita.`, { step: step.toString() });
                let leaf = -1;
                for (let i = 0; i < n; i++) {
                    if (degree[i] === 1 && actiu[i]) {
                        leaf = i;
                        break;
                    }
                }
                hl[leaf] = "#facc15"; // yellow for current leaf
                addStep(11, `Fulla més petita trobada! És la número ${leaf}.`, { leaf: leaf.toString() });

                let neighbor = -1;
                for (const v of adj[leaf]) {
                    if (actiu[v]) {
                        neighbor = v;
                        break;
                    }
                }
                hl[neighbor] = "#3b82f6"; // blue for neighbor
                addStep(16, `Mirem l'únic veí associat que encara està actiu. És en ${neighbor}.`, { leaf: leaf.toString(), neighbor: neighbor.toString() });

                prufer.push(neighbor);
                hl[leaf] = "#ef4444"; // red meaning deleted
                addStep(19, `Afegim el veí ${neighbor} a la seqüència de Prüfer!`, { leaf: leaf.toString(), neighbor: neighbor.toString() });

                actiu[leaf] = false;
                degree[leaf]--;
                degree[neighbor]--;
                addStep(20, `Esborrem la fulla ${leaf} de l'arbre (física i del registre de graus). El veí ${neighbor} ara té un grau menys!`, { leaf: leaf.toString(), neighbor: neighbor.toString() });

                hl[leaf] = "rgba(0,0,0,0.2)"; // Set as ghost
                delete hl[neighbor]; // remove highlight from neighbor, keep ghost
            }

            addStep(24, "Hem fet exactament n-2 passos. L'arbre queda retallat a 2 nodes únics. Seqüència Acabada!", {});

            return steps;
        }
    },
    prufer_rebuild: {
        id: "prufer_rebuild",
        code: pruferRebuildCode,
        initialGraph: {
            nodes: [
                { id: 0, label: "0", fx: -60, fy: 0 }, { id: 1, label: "1", fx: -120, fy: -40 },
                { id: 2, label: "2", fx: 0, fy: 0 }, { id: 3, label: "3", fx: -40, fy: 60 },
                { id: 4, label: "4", fx: 60, fy: 0 }, { id: 5, label: "5", fx: 120, fy: 40 }
            ],
            links: [] // initially empty
        },
        generateSteps: () => {
            const steps: AlgoStep[] = [];
            const hl: Record<number, string> = {};
            const P = [0, 2, 2, 4]; // prufer seq for the same graph
            const n = 6;
            const degree = [1, 1, 1, 1, 1, 1];
            for (const v of P) degree[v]++;

            const actiu = [true, true, true, true, true, true];
            const edges: { source: number, target: number }[] = [];

            const formatVars = () => {
                let degStr = "[";
                for (let i = 0; i < n; i++) degStr += (actiu[i] ? degree[i] : "-") + (i < n - 1 ? ", " : "");
                degStr += "]";
                return { P: `[0, 2, 2, 4]`, degree: degStr, out_edges: edges.length.toString() };
            };

            const addStep = (line: number, desc: string, ov: Record<string, string> = {}) => {
                steps.push({ line, description: desc, highlights: { ...hl }, variables: { ...formatVars(), ...ov } });
            };

            addStep(2, "Iniciem tots als graus a 1. Com que 0, 2, 2, i 4 surten a P, els sumem els seus graus respectius.", {});

            for (const p_node of P) {
                addStep(8, `Extreiem el primer element pendent de P: ${p_node}`, { p_node: p_node.toString() });

                let leaf = -1;
                for (let i = 0; i < n; i++) {
                    if (degree[i] === 1 && actiu[i]) {
                        leaf = i;
                        break;
                    }
                }
                hl[leaf] = "#facc15"; // yellow
                addStep(11, `Busquem la ID més petita (activa) que tingui grau 1 avui. És la número ${leaf}.`, { p_node: p_node.toString(), leaf: leaf.toString() });

                edges.push({ source: leaf, target: p_node });
                hl[p_node] = "#3b82f6"; // blue
                addStep(14, `Hem confimat que la fulla ${leaf} penjava del node ${p_node}!! Afegim una nova aresta per muntar l'arbre final.`, { p_node: p_node.toString(), leaf: leaf.toString() });

                actiu[leaf] = false;
                degree[leaf]--;
                degree[p_node]--;

                hl[leaf] = "#10b981"; // green connected
                addStep(15, `Node ${leaf} ja està lligat i resolt. El desactivem per no lligar-lo de nou. Deg[${p_node}] baixa també per l'ús.`, { p_node: p_node.toString(), leaf: leaf.toString() });
                delete hl[p_node];
                delete hl[leaf];
            }

            addStep(21, "Hem esgotat P. Sempre i obligatoriament quedaran exactament 2 elements encara actius al sistema.", {});

            let u = -1, v = -1;
            for (let i = 0; i < n; i++) {
                if (actiu[i]) {
                    if (u === -1) u = i;
                    else v = i;
                }
            }
            hl[u] = hl[v] = "#ef4444"; // red final
            edges.push({ source: u, target: v });
            addStep(26, `Aquests últims elements residuals mai s'esborren i sempre seran veïns mutus. Els enllacem: ${u} i ${v}!`, { u: u.toString(), v: v.toString() });

            return steps;
        }
    },
    cerca_height: {
        id: "cerca_height",
        code: cercaHeightCode,
        initialGraph: {
            nodes: [
                { id: 50, label: "50", fx: 0, fy: -100 },
                { id: 10, label: "10 (L)", fx: -60, fy: -20 },
                { id: 20, label: "20 (R)", fx: 60, fy: -20 },
                { id: 30, label: "30", fx: 30, fy: 60 }
            ],
            links: [
                { source: 50, target: 10 },
                { source: 50, target: 20 },
                { source: 20, target: 30 }
            ]
        },
        generateSteps: () => {
            const steps: AlgoStep[] = [];
            let highlights: Record<number, string> = {};

            const addStep = (line: number, desc: string, vars: Record<string, string> = {}) => {
                steps.push({ line, description: desc, highlights: { ...highlights }, variables: vars });
            };

            addStep(1, "Anem a mesurar l'altura enviant directament height(L) (només contra el subarbre de l'esquerra).", { t: "BinTree(10)" });
            highlights[10] = "#facc15"; // yellow, reading
            addStep(2, "Entrem a la funció height(10). El node no és empty().", { t: "BinTree(10)" });

            highlights[10] = "#10b981"; // moving to eval children
            addStep(3, "La funció interna max() ens obliga primer a evaluar t.left() baixant al pis inferior...", { t: "BinTree(10)", max: "max(height(null), ?)" });

            // left child of 10 is empty
            addStep(1, "Dins de height(t.left()): És un arbre buit ocult! Supera t.empty()...", { t: "BinTree()", node: "null" });
            addStep(2, "t.empty() talla la recursió retornant 0.", { t: "BinTree()", returned: "0" });

            addStep(3, "Mateixa sortida pel right: retorna 0. Llavors la suma max(0, 0) dóna 0, + 1 de base = altura 1. Acaba height.", { t: "BinTree(10)", returned: "1" });

            // Now start cerca
            highlights = {};
            addStep(6, "Ara cridem cerca(Arbre, 30) llençant el raig d'escàner des l'arrel general 50.", { t: "BinTree(50)", x: "30", h: "1" });
            highlights[50] = "#facc15"; // yellow
            addStep(7, "Condicional 1: t.empty()? El 50 existeix.", { t: "BinTree(50)", x: "30" });
            addStep(8, "La corona '50' s'assembla al nostre 30? No. Falla el condicional t.value() == x.", { t: "BinTree(50)", x: "30" });

            highlights[50] = "#8b5cf6"; // purple branch left
            highlights[10] = "#facc15";
            addStep(9, "ATENCIÓ C++ || : Or lògic no s'avalua alhora. Explorem obligatòriament cerca(t.left()) que va al 10. Desplegant...", { t: "BinTree(10)", x: "30" });
            addStep(8, "El valor '10' no és x=30.", { t: "BinTree(10)", x: "30" });
            highlights[10] = "#ef4444"; // red, dead end
            addStep(9, "I els seus fills invisibles donaran falses buides també donant un false com acció cap endarrere al parent 50.", { t: "BinTree(10)", returned: "false" });

            highlights[50] = "#3b82f6"; // inspecting right
            highlights[20] = "#facc15";
            addStep(9, "C++ OR: l'ala esquerra del 50 va tornar false sencer. Obligació ara sí a cerca(t.right())! Disparem cap al 20.", { t: "BinTree(20)", x: "30", l_res: "false" });
            addStep(8, "Node 20 != 30. Hem d'instigar el seu subarbre sub-esquerra t.left().", { t: "BinTree(20)", x: "30" });

            highlights[20] = "#10b981"; // path ok
            highlights[30] = "#facc15";
            addStep(9, "Aterrisatge al pou de l'esquerra: t=30.", { t: "BinTree(30)", x: "30" });
            highlights[30] = "#22c55e"; // bright green success
            addStep(8, "GLÒRIA TÈCNICA! La màgia if (t.value() == x) llegeix 30 == 30. 'return true' aturant tota descensió absurda aquí matant a la baixa.", { t: "BinTree(30)", x: "30 // = x" });

            highlights[20] = "#22c55e";
            addStep(9, "Retorn cap a 20 rep l'avís d'èxit del seu fill. C++ || Curt-Circuit actiu tanca en True sense buscar la seva ala dreta que penjava.", { t: "BinTree(20)", x: "30", res: "true // salt dreta" });

            highlights[50] = "#22c55e";
            addStep(6, "Arrel immensa base de tot rep notificació encadenada amunt garantint un èxit i acaba final O(logN~N).", { res_final: "true" });

            return steps;
        }
    },
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
                addStep(11, `Mirem el cim de la pila.x = ${x} `, { x: x.toString() });

                let hi_ha_nou = false;
                for (const y of adj[x]) {
                    if (!visitat[y]) {
                        P.push(y);
                        visitat[y] = true;
                        W.push(y);
                        hi_ha_nou = true;
                        highlights[y] = "#10b981";
                        addStep(16, `Veí ${y} de ${x} no visitat.Ens hi enfonsem(break) !`, { x: x.toString(), y: y.toString() });
                        break;
                    }
                }
                if (!hi_ha_nou) {
                    addStep(24, `No hi ha veïns nous des de ${x}.Fem pop() desempilant.`);
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
            const W: number[] = [];
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
                for (const key in highlights) if (highlights[key] === "#facc15") highlights[key] = "#10b981";
                if (highlights[x] !== "#3b82f6") highlights[x] = "#facc15"; // currently checking x

                addStep(12, `Mirem el primer element de la cua sense treure'l: x=${x}.`, { x: String(x) });

                let y = -1;
                for (const vehi of adj[x]) {
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

            for (const key in highlights) highlights[key] = "#3b82f6";
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
    },
    eficiencia_multitasca: {
        id: "eficiencia_multitasca",
        code: pairMultitaskCode,
        initialGraph: {
            nodes: [
                { id: "10", label: "A (10)", fx: 0, fy: -60 },
                { id: "5", label: "B (5)", fx: -40, fy: -10 },
                { id: "15", label: "C (15)", fx: 40, fy: -10 }
            ],
            links: [
                { source: "10", target: "5" },
                { source: "10", target: "15" }
            ]
        },
        generateSteps: () => {
            const steps: AlgoStep[] = [];
            let hl: Record<string, string> = {};
            const vars: Record<string, string> = {};

            const st = (l: number, d: string, c: string | Record<string, string>) => {
                if (typeof c === 'string') {
                    if (c) hl[c] = "#facc15"; // yellow
                } else {
                    hl = { ...hl, ...c };
                }
                steps.push({ line: l, description: d, highlights: { ...hl }, variables: { ...vars } });
            };

            st(1, "Anem a resoldre els 2 problemes (Suma total i Quantitat) amb un sol Pair d'una passada! Cridem arrel (10).", "10");

            st(2, "L'arbre 10 no és buit.", "10");
            st(4, "Primer rebot a l'esquerra: t.left().", "5");
            vars["L (pel 10)"] = "esperant...";

            st(2, "Avaluem node 5. No és buit.", "5");
            st(4, "Rebotem la crida l'esquerra del node 5 (que és un full blanc null escondit).", { "5": "#f59e0b", "null_5L": "transparent" });
            st(2, "Buit t.empty() retornem pair neutre: {0.0 sum, 0 elements}.", { "5": "#facc15" });
            vars["L (pel 5)"] = "{0.0, 0}";

            st(5, "Ara el node 5 fa rebotar la branca dreta morta que amaga.", "5");
            st(2, "Torna a retornar pair neutre buit {0.0, 0}.", "5");
            vars["R (pel 5)"] = "{0.0, 0}";

            st(7, "Ara ve la clau de L'O(N): El node 5 fusiona les respostes dels seus fills en una nova Tupla combinada i s'ho queda directament en memòria.", "5");
            st(8, "Calcula i retorna: {5 + 0.0 + 0.0, 1 pos + 0 + 0} -> {5, 1}. Ho empenta a dalt sense mai repetir més línies de codi.", { "5": "#10b981", "10": "#facc15" });
            vars["L (pel 10)"] = "{5.0, 1}";

            st(5, "Tornem a l'arrel gran (10), que ataca a la dreta instigant el node 15 abans de calcular res.", "15");
            st(2, "Avaluant 15. No buida.", "15");
            st(7, "Com sabem que té dos fills nulls ocults rebent {0.0, 0} cada un, directament resol fusionant: {15 + 0 + 0, 1 + 0 + 0}.", "15");
            vars["R (pel 10)"] = "{15.0, 1}";
            st(8, "El node 15 respon instantàniament desintegrant la mort recursiva. Retorna {15, 1}", { "15": "#10b981", "10": "#facc15" });

            st(9, "Final! L'arrel consolida els dos apilaments dels fills: \nSuma total iterada = 10 + 5.0 (Esquerra) + 15.0 (Dreta)\nMida nodes totals = 1 + 1 (Esq) + 1 (Dreta).", { "10": "#10b981", "5": "#10b981", "15": "#10b981" });
            vars["Retorn Final (Main)"] = "pair{30.0, 3}";
            st(10, "Aconseguim les dues dades llegint la base de l'Arbre 1 COP rigorós de recobriment. Si haguéssim instanciat sum() i size() per separat hauria costat el famós Theta(2N) que seria Theta(N^2) si és codi de bucle desequilibrat intern.", { "10": "#3b82f6", "5": "#3b82f6", "15": "#3b82f6" });

            return steps;
        }
    },
    reconstruccio_preordre: {
        id: "reconstruccio_preordre",
        code: rebuildPreorderCode,
        initialGraph: {
            nodes: [
                { id: "10", label: "10", fx: 0, fy: -60, color: "transparent" }, // color custom injection workaround
                { id: "5", label: "5", fx: -40, fy: -10, color: "transparent" },
                { id: "14", label: "14", fx: 40, fy: -10, color: "transparent" },
                { id: "L_buida1", label: "# (Buit)", fx: -60, fy: 30, color: "transparent" },
                { id: "R_buida1", label: "# (Buit)", fx: -20, fy: 30, color: "transparent" },
                { id: "L_buida2", label: "# (Buit)", fx: 20, fy: 30, color: "transparent" },
                { id: "R_buida2", label: "# (Buit)", fx: 60, fy: 30, color: "transparent" }
            ],
            links: [
                { source: "10", target: "5" },
                { source: "10", target: "14" },
                { source: "5", target: "L_buida1" },
                { source: "5", target: "R_buida1" },
                { source: "14", target: "L_buida2" },
                { source: "14", target: "R_buida2" }
            ]
        },
        generateSteps: () => {
            const steps: AlgoStep[] = [];
            const vars: Record<string, string> = {};
            const hl: Record<string, string> = {};

            const st = (l: number, d: string, activeNodeId: string, customColor: string = "#facc15") => {
                if (activeNodeId) hl[activeNodeId] = customColor;
                steps.push({ line: l, description: d, highlights: { ...hl }, variables: { ...vars } });
            };

            st(2, "Arrenca la terminal desponent el teclat. El text a llegir complet és: '10 5 # # 14 # #'.", "");
            vars["Input Input Stream (cin)"] = "[10, 5, #, #, 14, #, #]";

            st(4, "Primer espai: es llegeix la paraula del terminal.", "");
            vars["Input Input Stream (cin)"] = "[5, #, #, 14, #, #]";
            vars["token"] = `"10"`;

            st(6, "Era un hashtag '#' que indica Buit? No, vol dir que realment això és una dada i no està mort l'arbre aquí.", "");
            st(8, "Convertim '10' texte a instància numèrica (T = int) guardant-la al calaix.", "");

            st(9, "Ara ja podem intentar buscar i engatxar tota l'ala esquerre abans de fer res més... Llança'm codi un altre cop confiant a on el terminal em porti.", "10", "#10b981");

            st(4, "NOVA Crida. Llegim paraula terminal.", "");
            vars["Input Input Stream (cin)"] = "[#, #, 14, #, #]";
            vars["token (fill esq L)"] = `"5"`;

            st(8, "No era buit, convertim... Llavors, confia un cop més cec per lligar a l'esquerra el costat buit de l'arbre 5... Crida esquerre.", "5", "#3b82f6");

            st(4, "NOVA Crida. Llegeix token següent...", "");
            vars["Input Input Stream (cin)"] = "[#, 14, #, #]";
            vars["token (L del 5)"] = `"# (!)"`;

            st(6, "BINGO. Salt pel buit '#' detectat! Aquesta fulla sí que rebota falsa aturant una línia infinita i generant directament un 'Arbre Buit' que es desvincula de la resta tallant subestructures inexistents.", "L_buida1", "#64748b");
            st(10, "Es recoloca al fill L del 5 amb fulla blanca, comença a fer el return per invocar de seguida l'intent a l'ala dreta buida. R del 5.", "5", "#facc15");

            st(4, "NOVA Crida (Buscant dreta del 5). Llegeix terminal:", "", "");
            vars["Input Input Stream (cin)"] = "[14, #, #]";
            vars["token (R del 5)"] = `"# (!)"`;

            st(6, "BINGO un altre cop, null '#'. Retorna false.", "R_buida1", "#64748b");

            st(11, "Increïble. L'objecte arbre del node (5) ha fusionat ell mateix junt a les dues derivades nulles que acabem de matar. Torna el node amunt construït en sec cap al recursiu root de base com l'Autèntic fill esquerre de 10.", "5", "#10b981");

            st(10, "Roots base: L'Arrel de tota l'estructura de 10 respira tranquil perquè sap que tota l'ala esquerra del paper de format estava completada... Llança't al mateix infern per buscar a la Dreta.", "10", "#facc15");
            vars["Input Input Stream (cin)"] = "[#, #]";
            vars["token (R del 10)"] = `"14"`;
            st(11, "Construeix l'esperant 14... Llegeix dues # per R i L, confirmant que ell i el teclat de notes final ha estat consumit pel sencer... (Saltant sub-passos)", "14", "#10b981");
            st(11, "Els dos fills 14 de buits absorbits validen que la màquina té l'arbre 10 unit integral...", "L_buida2", "#64748b");
            st(11, "Lligat tot, torna la Corona general instanciada tancant i alliberant Stream Input.", "R_buida2", "#64748b");
            st(12, "L'Arbre Pre-Ordre construït i llest a temps matemàtic perfecte i en ordre pur O(N).", "10", "#22c55e");

            return steps;
        }
    },
    heap_push: {
        id: "heap_push",
        code: heapPushCode,
        initialGraph: {
            nodes: [
                { id: 1, label: "1 (50)", fx: 0, fy: -100 },
                { id: 2, label: "2 (40)", fx: -60, fy: -20 },
                { id: 3, label: "3 (30)", fx: 60, fy: -20 },
                { id: 4, label: "4 (10)", fx: -90, fy: 60 },
                { id: 5, label: "5 (20)", fx: -30, fy: 60 },
                { id: 6, label: "6", fx: 30, fy: 60, color: "transparent" }
            ],
            links: [
                { source: 1, target: 2 },
                { source: 1, target: 3 },
                { source: 2, target: 4 },
                { source: 2, target: 5 },
                { source: 3, target: 6, label: "buit" }
            ]
        },
        generateSteps: () => {
            const steps: AlgoStep[] = [];
            let hl: Record<number, string> = {};
            let labels: Record<number, string> = {
                1: "1 (50)", 2: "2 (40)", 3: "3 (30)", 4: "4 (10)", 5: "5 (20)", 6: "6"
            };
            const addStep = (line: number, desc: string, vars: Record<string, string> = {}) => {
                steps.push({ line, description: desc, highlights: { ...hl }, nodeLabels: { ...labels }, variables: vars });
            };

            addStep(2, "Invoquem push(45).", { x: "45", size_: "5" });
            
            hl[6] = "#10b981"; // green: target
            labels[6] = "6 (45)";
            addStep(3, "Augmentem el vector i el size_ a 6 i copiem el target a l'última posició.", { x: "45", size_: "6" });
            
            addStep(4, "Cridem a flow_up_(6) per elevar aquest 45 al seu forat jeràrquic.", { i: "6" });
            
            hl[6] = "#3b82f6"; // blue: current moving node
            addStep(10, "Inici de flow_up_: loop on comparem 45 (pos 6) amb el Pare a 6/2=3 (valor 30).", { i: "6", pare_val: "30", me_val: "45" });
            
            hl[3] = "#facc15"; // yellow: parent to compare
            addStep(10, "Comprovem la condició: 45 > 30? Sí!", { cond: "45 > 30 (T)" });
            
            labels[3] = "3 (45)";
            labels[6] = "6 (30)";
            hl[3] = "#3b82f6";
            hl[6] = "#10b981";
            addStep(11, "Intercanviem (swap) el 45 amb el seu pare 30.", { i: "6" });
            
            delete hl[6]; // clean up 
            addStep(12, "Actualitzem l'índex: ara estem a la posició i=3.", { i: "3" });
            
            hl[1] = "#facc15"; // yellow: new parent
            addStep(10, "Revaluem el bucle a i=3. El Pare ara és 3/2=1 (valor 50).", { i: "3", pare_val: "50", me_val: "45" });
            
            addStep(10, "Comprovem condició: 45 > 50? No.", { cond: "45 > 50 (F)" });
            
            hl[3] = "#22c55e"; // bright green: final position
            delete hl[1];
            addStep(14, "Sortim del bucle: el 45 ja és més petit que el seu pare. Procés acabat.", { success: "Done" });

            return steps;
        }
    },
    heap_pop: {
        id: "heap_pop",
        code: heapPopCode,
        initialGraph: {
            nodes: [
                { id: 1, label: "1 (50)", fx: 0, fy: -100 },
                { id: 2, label: "2 (40)", fx: -60, fy: -20 },
                { id: 3, label: "3 (45)", fx: 60, fy: -20 },
                { id: 4, label: "4 (10)", fx: -90, fy: 60 },
                { id: 5, label: "5 (20)", fx: -30, fy: 60 },
                { id: 6, label: "6 (30)", fx: 30, fy: 60 }
            ],
            links: [
                { source: 1, target: 2 },
                { source: 1, target: 3 },
                { source: 2, target: 4 },
                { source: 2, target: 5 },
                { source: 3, target: 6 }
            ]
        },
        generateSteps: () => {
            const steps: AlgoStep[] = [];
            let hl: Record<number, string> = {};
            let labels: Record<number, string> = {
                1: "1 (50)", 2: "2 (40)", 3: "3 (45)", 4: "4 (10)", 5: "5 (20)", 6: "6 (30)"
            };
            const addStep = (line: number, desc: string, vars: Record<string, string> = {}) => {
                steps.push({ line, description: desc, highlights: { ...hl }, nodeLabels: { ...labels }, variables: vars });
            };

            hl[1] = "#facc15"; // yellow: target to remove
            addStep(2, "Volem eliminar l'element màxim (l'arrel 50).", { size_: "6" });
            
            hl[6] = "#3b82f6"; // blue: element that will move
            addStep(3, "Primer pas: movem l'últim element (30) a la posició de l'arrel.", { size_: "6" });
            
            labels[1] = "1 (30)";
            labels[6] = "6";
            hl[6] = "transparent";
            hl[1] = "#3b82f6";
            addStep(3, "L'arrel ara conté el valor 30. El 50 ha desaparegut.", { size_: "6" });
            
            addStep(4, "Reduïm la mida del vector: el node 6 ja no existeix.", { size_: "5" });
            
            addStep(5, "Cridem flow_down(1) per reordenar l'arbre des de l'arrel.", { i: "1" });
            
            addStep(9, "Entrem a flow_down. i=1 (valor 30).", { i: "1" });
            
            hl[2] = "#facc15"; hl[3] = "#facc15"; // yellow: children to compare
            addStep(10, "Calculem índexs dels fills: 2*1=2 i 2*1+1=3.", { i: "1", left: "2", right: "3" });
            
            addStep(11, "Inicialment el màxim provisional és el propi node 1.", { max: "1" });
            
            hl[2] = "#10b981"; // green: current winner
            addStep(12, "Comparem amb fill esquerre (40). 40 > 30? Sí. Ara max=2.", { max: "2" });
            
            hl[2] = "#facc15"; // back to yellow
            hl[3] = "#10b981"; // new winner
            addStep(13, "Comparem amb fill dret (45). 45 > 40? Sí. Ara max=3.", { max: "3" });
            
            hl[3] = "#ef4444"; // red: swap confirmed
            addStep(15, "Check: max (3) != i (1). Cal fer un intercanvi cap a la dreta.", { i: "1", max: "3" });
            
            // Swap labels BEFORE the next step
            labels[1] = "1 (45)";
            labels[3] = "3 (30)";
            hl[1] = "#10b981";
            hl[3] = "#3b82f6";
            addStep(16, "Fem swap(1, 3). El 45 puja i el 30 baixa.", { i: "1", max: "3" });
            
            addStep(17, "Recursivitat: cridem flow_down(3) per continuar reordenant des de la posició 3.", { i: "3" });

            hl = { 3: "#3b82f6" };
            addStep(9, "Entrem a la nova crida: i=3.", { i: "3" });
            addStep(10, "Calculem fills de 3: 6 i 7. Però mid_size és 5!", { left: "6", size: "5" });
            addStep(12, "L'índex 6 supera la mida del heap. No hi ha fills reals.", { cond: "left <= size (F)" });
            
            hl[3] = "#22c55e"; // bright green
            addStep(15, "max (3) == i (3). L'element 30 ha trobat el seu lloc.", { max: "3", i: "3" });
            
            addStep(19, "Fi de la reordenació. El Heap torna a ser vàlid.", { success: "Done" });

            return steps;
        }
    },
    tree_general_search: {
        id: "tree_general_search",
        code: treeSearchCode,
        initialGraph: {
            nodes: [
                { id: 1, label: "50", fx: 0, fy: -100 },
                { id: 2, label: "20", fx: -60, fy: 0 },
                { id: 3, label: "30", fx: 0, fy: 0 },
                { id: 4, label: "80", fx: 60, fy: 0 },
                { id: 5, label: "10", fx: 30, fy: 100 },
                { id: 6, label: "90", fx: 90, fy: 100 }
            ],
            links: [
                { source: 1, target: 2 },
                { source: 1, target: 3 },
                { source: 1, target: 4 },
                { source: 4, target: 5 },
                { source: 4, target: 6 }
            ]
        },
        generateSteps: () => {
            const steps: AlgoStep[] = [];
            let hl: Record<number, string> = {};
            let labels: Record<number, string> = {
                1: "50", 2: "20", 3: "30", 4: "80", 5: "10", 6: "90"
            };
            const addStep = (line: number, desc: string, vars: Record<string, string> = {}) => {
                steps.push({ line, description: desc, highlights: { ...hl }, nodeLabels: { ...labels }, variables: vars });
            };

            addStep(1, "Volem cercar x=90 des de l'arrel C general superior.", { x: "90", node_actual: "50" });
            hl[1] = "#facc15";
            addStep(2, "L'arrel 50 no està buida. Passem if.", { cond: "empty()" });
            addStep(3, "El valor interior (50) no és el nostre premi (90).", { cond: "50 == 90 (F)" });

            addStep(5, "Iniciem iterador de bucle for: n_fills = 3. Primer cap child(0) a esquerra el valor 20.", { iter: "0 de 3" });
            hl[2] = "#facc15";
            addStep(6, "Cridem la recurrència en 20 i ens enfonsem allà com una sub-instància...", { recursiu: "child(0)" });

            hl[2] = "#ef4444";
            addStep(2, "Node [20] falla les dues comprovacions inicials perquè tampoc no fa match 20 != 90, com que no té fills al for no entra.", { estat: "Mort", num_child: "0" });
            addStep(10, "Torna i ens avisa False. Falla el primer subarbol sencer tornant el cop a 50.", { retorn: "False" });

            hl[3] = "#facc15"; delete hl[2];
            addStep(6, "Bucle (1 de 3). Child central (1), cridem node valor 30.", { iter: "1 de 3" });
            hl[3] = "#ef4444";
            addStep(2, "Repeteix final sec, torna sense èxits lliurant False igual al germà i avisant al Gran Pare 50.", { node_actual: "30", num_child: "0", retorn: "False" });

            hl[4] = "#facc15"; delete hl[3];
            addStep(6, "La fe no acaba al 50: Bucle (2 de 3). Arrenca la cerca des del poderós Child '80'.", { iter: "2 de 3" });
            addStep(3, "A dins: 80 != 90, però obre iteració de fills: per dos subarbres, va a child(0) d'ell (el que seria node 10).", { node_actual: "80", num_child: "2" });

            hl[5] = "#ef4444";
            addStep(2, "El fill node 10 nega match total... False cap a 80 de retorn amunt.", { node_actual: "10", retorn: "False" });

            hl[6] = "#10b981"; delete hl[5];
            addStep(6, "El for del Gran 80 salta al child 1: El glorificat node '90'!! Envia un raig cercador cap aquest lloc...", { the_node: "90" });

            hl[6] = "#22c55e";
            addStep(3, "Subarbol pur 90 val un cert incontestable gràcies al t.value() == x. Talla absolut de cadena subministrant Return True com a bandera cap a adalt.", { node_actual: "90", bool: "TRUE" });

            hl[4] = "#22c55e";
            addStep(7, "El 80 sent la notícia amb exultació de cop rebent l'if veritat tallant literalment el bucle que estava calculant i sense remordiments retorna True propagant pel forat del for en cadena recursiva d'alegria suprema.", { bool: "TRUE" });

            hl[1] = "#22c55e";
            addStep(7, "Resultat total acabat al main. Tota la resta ha estat ignorada gràcies a aquest curtcircuit salvador estalviant N processaments al final O(logN).", { return_final: "TRUE" });

            return steps;
        }
    }
};
