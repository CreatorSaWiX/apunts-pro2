void breadth_first(BinTree<int> t) {
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
}