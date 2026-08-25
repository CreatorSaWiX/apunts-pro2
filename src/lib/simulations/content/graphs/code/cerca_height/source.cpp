bool cerca(const BinTree<int>& t, int x) {
    if (t.empty()) return false;
    if (t.value() == x) return true;
    return cerca(t.left(), x) || cerca(t.right(), x);
}