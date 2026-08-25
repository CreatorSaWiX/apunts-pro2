int height(const BinTree<int>& t) {
    if (t.empty()) return 0;
    return 1 + max(height(t.left()), height(t.right()));
}
