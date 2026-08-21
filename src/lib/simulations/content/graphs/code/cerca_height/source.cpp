int height(BinTree<int> t) {
    if (t.empty()) return 0;
    return 1 + max(height(t.left()), height(t.right()));
}

bool cerca(const BinTree<int>& t, int x) {
    if (t.empty()) return false;
    if (t.value() == x) return true;
    return cerca(t.left(), x) || cerca(t.right(), x);
}