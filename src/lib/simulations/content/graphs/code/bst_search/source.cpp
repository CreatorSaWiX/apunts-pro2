bool bst_search(const BinTree<int>& a, int x) {
    if (a.empty()) return false;
    if (x == a.value()) return true;
    if (x < a.value())
        return bst_search(a.left(), x);
    return bst_search(a.right(), x);
}