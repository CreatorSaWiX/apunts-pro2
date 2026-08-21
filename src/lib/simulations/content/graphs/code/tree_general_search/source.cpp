bool tree_search(Tree<int> t, int x) {
    if (t.empty()) return false;
    if (t.value() == x) return true;
    
    for (int i = 0; i < t.num_children(); i++) {
        if (tree_search(t.child(i), x)) {
            return true;
        }
    }
    return false;
}