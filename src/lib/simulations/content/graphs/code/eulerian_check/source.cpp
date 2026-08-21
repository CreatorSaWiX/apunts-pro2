bool is_eulerian(const vector<vector<int>>& G) {
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
}