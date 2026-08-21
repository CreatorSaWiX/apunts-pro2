bool hamiltonian_path(int u, int count, int n,
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
}