vector<int> DFS(const vector<vector<int>>& G, int v) {
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
}