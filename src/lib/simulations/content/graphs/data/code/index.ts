export const cercaHeightCode = `int height(BinTree<int> t) {
    if (t.empty()) return 0;
    return 1 + max(height(t.left()), height(t.right()));
}

bool cerca(const BinTree<int>& t, int x) {
    if (t.empty()) return false;
    if (t.value() == x) return true;
    return cerca(t.left(), x) || cerca(t.right(), x);
}`;

export const dfsCode = `vector<int> DFS(const vector<vector<int>>& G, int v) {
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

export const bfsCode = `void breadth_first(BinTree<int> t) {
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

export const bfs2Code = `vector<int> BFS(const vector<vector<int>>& G, int v) {
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

export const preordreCode = `void preordre(BinTree<int> t) {
    if (!t.empty()) {
        cout << t.value() << ' ';
        preordre(t.left());
        preordre(t.right());
    }
}`;

export const inordreCode = `void inordre(BinTree<int> t) {
    if (!t.empty()) {
        inordre(t.left());
        cout << t.value() << ' ';
        inordre(t.right());
    }
}`;

export const postordreCode = `void postordre(Node* node) {
    if (node == nullptr) return;
    postordre(node->left);
    postordre(node->right);
    cout << node->value << " ";
}`;

export const pairMultitaskCode = `pair<double, int> sum_and_size__(BinTree<double> t) {
    if (t.empty()) return {0.0, 0};
    
    auto L = sum_and_size__(t.left());
    auto R = sum_and_size__(t.right());
    
    return {
        t.value() + L.first + R.first, 
        1 + L.second + R.second
    };
}`;

export const rebuildPreorderCode = `// Input cin: "10 5 # # 14 # #"
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

export const eulerianCheckCode = `bool is_eulerian(const vector<vector<int>>& G) {
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

export const hamiltonianBacktrackCode = `bool hamiltonian_path(int u, int count, int n,
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

export const pruferBuildCode = `vector<int> build_prufer(const vector<vector<int>>& G) {
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

export const pruferRebuildCode = `vector<pair<int, int>> rebuild_prufer(const vector<int>& P, int n) {
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

export const heapPushCode = `template <typename T>
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

export const heapPopCode = `template <typename T>
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

export const treeSearchCode = `bool tree_search(Tree<int> t, int x) {
    if (t.empty()) return false;
    if (t.value() == x) return true;
    
    for (int i = 0; i < t.num_children(); i++) {
        if (tree_search(t.child(i), x)) {
            return true;
        }
    }
    return false;
}`;
export const bstSearchCode = `bool bst_search(const BinTree<int>& a, int x) {
    if (a.empty()) return false;
    if (x == a.value()) return true;
    if (x < a.value())
        return bst_search(a.left(), x);
    return bst_search(a.right(), x);
}`;

export const bstInsertCode = `BinTree<int> bst_insert(const BinTree<int>& a, int x) {
    if (a.empty())
        return BinTree<int>(x);
    if (x == a.value()) return a; // ja existeix
    if (x < a.value())
        return BinTree<int>(a.value(),
                            bst_insert(a.left(), x),
                            a.right());
    return BinTree<int>(a.value(),
                        a.left(),
                        bst_insert(a.right(), x));
}`;
