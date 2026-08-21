vector<int> BFS(const vector<vector<int>>& G, int v) {
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
}